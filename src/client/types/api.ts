/** Standard API envelope returned by Express routes */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type TaskStatusValue = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
export type PriorityValue = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatusValue;
  priority: PriorityValue;
  dueDate?: string;
  assigneeId?: number;
  projectId?: number;
  assignee?: Pick<Contact, 'firstName' | 'lastName'>;
  project?: { name: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectMember {
  id: number;
  role: string;
  contactId: number;
  projectId: number;
  contact: Pick<Contact, 'firstName' | 'lastName'>;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  startDate?: string;
  endDate?: string;
  members?: ProjectMember[];
  tasks?: Task[];
  _count?: { tasks?: number; members?: number };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateContactInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  notes?: string;
}

export interface CreateProjectInput {
  name: string;
  description?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: TaskStatusValue;
  priority?: PriorityValue;
  dueDate?: string;
  assigneeId?: number;
  projectId?: number;
}
