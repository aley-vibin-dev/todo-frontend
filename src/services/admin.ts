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