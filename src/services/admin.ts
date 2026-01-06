import api from '@/api/api';

export interface DashboardStats {
  totalUsers: number;
  totalManagers: number;
  totalUsersRoleUser: number;
}

export interface DashboardChart {
  assigned: number;
  submitted: number;
  approved: number;
  rejected: number;
  deleted: number;
  completed: number;
}

export interface PendingResources {
  id: number;
  name: string;
  email: string;
}

export interface ResourceUpdate {
  id: number;
  status: 'manager' | 'user' | 'reject';
}

export interface Manager {
  id: number;
  name: string;
  email: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  manage_id: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/admin/dashboard-stats');
  return data;
};

export const getDashboardChart = async (): Promise<DashboardChart> => {
  const { data } = await api.get('/admin/dashboard-chart');
  return data;
};

export const getPendingResources = async (): Promise<PendingResources[]> => {
  const { data } = await api.get('/admin/pending-resources');
  return data;
};

export const updateResourceStatus = async (updates: ResourceUpdate[]) => {
  const { data } = await api.post('/admin/resource-status', updates);
  return data;
};

export const getManagers = async (): Promise<Manager[]> => {
  const { data } = await api.get('/admin/get-managers');
  return data;
};

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/admin/get-users');
  return data;
};

export const bulkAssignUsers = async (payload: {
  userIds: number[];
  managerId: number | null;
}) => {
  const { data } = await api.post('/admin/assign-users-to-manager', payload);
  return data;
};
