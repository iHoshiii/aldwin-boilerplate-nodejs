/**
 * Contacts Service
 */

import type { ApiResponse, Contact, CreateContactInput } from '../types/api.js';
import api from './api.js';

export const contactsService = {
  getAll: () => api.get<ApiResponse<Contact[]>>('/contact/list'),

  getById: (id: number | string) => api.get<ApiResponse<Contact>>(`/contact/${id}`),

  create: (data: CreateContactInput) => api.post<ApiResponse<Contact>>('/contact', data),

  update: (id: number | string, data: Partial<CreateContactInput>) =>
    api.put<ApiResponse<Contact>>(`/contact/${id}`, data),

  delete: (id: number | string) => api.delete<ApiResponse<Contact>>(`/contact/${id}`),
};

export default contactsService;
