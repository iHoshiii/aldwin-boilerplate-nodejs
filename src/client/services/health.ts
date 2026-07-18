/**
 * Health Service
 */

import type { ApiResponse } from '../types/api.js';
import api from './api.js';

export const healthService = {
  check: () => api.get<ApiResponse<{ status: string }>>('/health'),

  checkDatabase: async (): Promise<boolean> => {
    try {
      await api.get('/health');
      await api.get('/contact/list');
      return true;
    } catch {
      return false;
    }
  },
};

export default healthService;
