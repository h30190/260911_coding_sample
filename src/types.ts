export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type RFIStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ANSWERED' | 'CLOSED';
export type UserRole = 'ADMIN' | 'PM' | 'MEMBER' | 'GUEST';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Column {
  id: string;
  boardId: string;
  name: string;
  position: number;
  wipLimit?: number;
  color?: string;
}

export interface Task {
  id: string;
  projectId: string;
  columnId: string;
  title: string;
  description?: string;
  position: number;
  priority: Priority;
  startDate?: string;
  dueDate?: string;
  creatorId: string;
  createdAt: string;
}

export interface RFI {
  id: string;
  projectId: string;
  taskId?: string;
  rfiCode: string;
  title: string;
  question: string;
  status: RFIStatus;
  priority: Priority;
  creatorId: string;
  assigneeId?: string;
  dueDate?: string;
  costImpact: boolean;
  scheduleImpact: boolean;
  createdAt: string;
}
