/**
 * useHealthCheck Hook
 */

import { useState, useEffect, useCallback } from 'react';
import {
  healthService,
  contactsService,
  tasksService,
  projectsService,
} from '../services/index.js';

export const ConnectionStatus = {
  CHECKING: 'checking',
  CONNECTED: 'connected',
  ERROR: 'error',
} as const;

export type ConnectionStatusValue =
  (typeof ConnectionStatus)[keyof typeof ConnectionStatus];

interface HealthStats {
  contacts: number;
  tasks: number;
  projects: number;
}

export function useHealthCheck() {
  const [status, setStatus] = useState<ConnectionStatusValue>(ConnectionStatus.CHECKING);
  const [stats, setStats] = useState<HealthStats | null>(null);

  const checkConnection = useCallback(async () => {
    try {
      setStatus(ConnectionStatus.CHECKING);

      const healthResponse = await healthService.check().catch(() => null);
      if (!healthResponse) {
        throw new Error('Server not responding');
      }

      const [contactsRes, tasksRes, projectsRes] = await Promise.all([
        contactsService.getAll(),
        tasksService.getAll().catch(() => ({ data: [] as never[] })),
        projectsService.getAll().catch(() => ({ data: [] as never[] })),
      ]);

      setStats({
        contacts: contactsRes.data?.length || 0,
        tasks: tasksRes.data?.length || 0,
        projects: projectsRes.data?.length || 0,
      });

      setStatus(ConnectionStatus.CONNECTED);
    } catch (error) {
      console.error('Database connection error:', error);
      setStatus(ConnectionStatus.ERROR);
      setStats(null);
    }
  }, []);

  useEffect(() => {
    checkConnection();
  }, [checkConnection]);

  return {
    status,
    stats,
    isChecking: status === ConnectionStatus.CHECKING,
    isConnected: status === ConnectionStatus.CONNECTED,
    isError: status === ConnectionStatus.ERROR,
    retry: checkConnection,
    ConnectionStatus,
  };
}

export default useHealthCheck;
