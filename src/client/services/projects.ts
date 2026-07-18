/**
 * Projects Service
 */

import type { ApiResponse, CreateProjectInput, Project, ProjectMember } from '../types/api.js';
import api from './api.js';

export const projectsService = {
  getAll: () => api.get<ApiResponse<Project[]>>('/project/list'),

  getById: (id: number | string) => api.get<ApiResponse<Project>>(`/project/${id}`),

  create: (data: CreateProjectInput) => api.post<ApiResponse<Project>>('/project/create', data),

  update: (id: number | string, data: Partial<CreateProjectInput>) =>
    api.put<ApiResponse<Project>>(`/project/${id}`, data),

  delete: (id: number | string) => api.delete<ApiResponse<Project>>(`/project/${id}`),

  addMember: (projectId: number | string, contactId: number | string, role = 'member') =>
    api.post<ApiResponse<ProjectMember>>(`/project/${projectId}/members`, { contactId, role }),

  removeMember: (projectId: number | string, contactId: number | string) =>
    api.delete<ApiResponse<unknown>>(`/project/${projectId}/members/${contactId}`),
};

export default projectsService;
