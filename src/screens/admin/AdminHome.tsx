import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsGrid } from '@/components/common/StatsGrid';
import { ChartCard } from '@/components/common/ChartCard';
import { DashboardSection } from '@/components/common/DashboardSection';
import { getDashboardChart, getDashboardStats } from '@/services/admin';

export const AdminHome = () => {
  const [stats, setStats] = useState<
    { id: number; title: string; value: number; icon: string }[]
  >([]);
  const [chart, setChart] = useState<
    { name: string; value: number; color: string; legendFontColor: string; legendFontSize: number; }[]
  >([]);
  const [loading, setLoading] = useState(true);

//fetching chart data
  useEffect(() => {
    const fetchchart = async () => {
      try {
        const data = await getDashboardChart();

        const chart_data = [
          { name: 'Completed', value: data.completed, color: '#13ab3eff', legendFontColor: '#333', legendFontSize: 12 },
          { name: 'Rejected', value: data.rejected, color: '#c40808ff', legendFontColor: '#333', legendFontSize: 12 },
          { name: 'assigned', value: data.assigned, color: '#445befff', legendFontColor: '#333', legendFontSize: 12 },
          { name: 'Submitted', value: data.submitted, color: '#f0e909ff', legendFontColor: '#333', legendFontSize: 12 },
          { name: 'Approved', value: data.approved, color: '#970c8eff', legendFontColor: '#333', legendFontSize: 12 },
          { name: 'Deleted', value: data.deleted, color: '#5d5b5bff', legendFontColor: '#333', legendFontSize: 12 },
        ];

        setChart(chart_data);
      } catch (err) {
        console.error('Failed to fetch dashboard chart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchchart();
  }, []);
  
//fetching stats data
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
          <ChartCard title="Task Progress" type="pie" data={chart} />
        </DashboardSection>
      </ScrollView>
    </AdminLayout>
  );
};
