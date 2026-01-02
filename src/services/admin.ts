import api from '@/api/api';

export interface DashboardStats {
  totalUsers: number;
  totalManagers: number;
  totalUsersRoleUser: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await api.get('/admin/dashboard-stats');
  return data;
};
