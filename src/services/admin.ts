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

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/admin/dashboard-stats');
  return data;
};

export const getDashboardChart = async (): Promise<DashboardChart> => {
  const { data } = await api.get('/admin/dashboard-chart');
  return data;
};