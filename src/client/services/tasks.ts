/**
 * Tasks Service
 */

import type {
  ApiResponse,
  CreateTaskInput,
  PriorityValue,
  Task,
  TaskStatusValue,
} from '../types/api.js';
import api from './api.js';

export const TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  REVIEW: 'REVIEW',
  DONE: 'DONE',
} as const satisfies Record<string, TaskStatusValue>;

export const Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
} as const satisfies Record<string, PriorityValue>;

export const tasksService = {
  getAll: () => api.get<ApiResponse<Task[]>>('/task/list'),

  getById: (id: number | string) => api.get<ApiResponse<Task>>(`/task/${id}`),

  create: (data: CreateTaskInput) => api.post<ApiResponse<Task>>('/task/create', data),

  update: (id: number | string, data: Partial<CreateTaskInput>) =>
    api.put<ApiResponse<Task>>(`/task/${id}`, data),

  delete: (id: number | string) => api.delete<ApiResponse<Task>>(`/task/${id}`),
};

export default tasksService;
