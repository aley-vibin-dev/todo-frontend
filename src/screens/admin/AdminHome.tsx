import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import { getDashboardStats } from '@/services/admin';

export const AdminHome = () => {
  const [stats, setStats] = useState<
    { id: number; title: string; value: number; icon: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{ data: [30, 50, 40, 70] }],
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();

        const cards = [
          { id: 1, title: 'Total Users', value: data.totalUsers - 1 || 0, icon: '🧑‍💻' },
          { id: 2, title: 'Managers', value: data.totalManagers || 0, icon: '👔' },
          { id: 3, title: 'Resources', value: data.totalUsersRoleUser || 0, icon: '🛠️' },
        ];

        setStats(cards);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <ScrollView className="p-4">
        <DashboardSection title="Statistics">
          {loading ? (
            <Text className="text-center text-gray-500">Loading stats...</Text>
          ) : (
            <StatsGrid cards={stats} />
          )}
        </DashboardSection>

        <DashboardSection title="Charts">
          <ChartCard title="Task Progress" type="line" data={chartData} />
        </DashboardSection>
      </ScrollView>
    </AdminLayout>
  );
};
