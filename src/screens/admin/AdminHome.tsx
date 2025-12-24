import React from 'react';
import { ScrollView } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { DashboardSection } from '@/components/dashboard/DashboardSection';
import Icon from 'react-native-vector-icons/Feather';

export const AdminHome = () => {
  const stats = [
    {
      id: 1,
      title: 'Total Users',
      value: 120,
      icon: '🗿',
    },
    {
      id: 2,
      title: 'Managers',
      value: 15,
      icon: '🗿',
    },
    {
      id: 3,
      title: 'Resources',
      value: 50,
      icon: '🗿',
    },
  ];

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{ data: [30, 50, 40, 70] }],
  };

  return (
    <AdminLayout>
      <ScrollView className="p-4">
        <DashboardSection title="Statistics">
          {/* Pass all stats with icons to the dynamic StatsGrid */}
          <StatsGrid cards={stats} />
        </DashboardSection>

        <DashboardSection title="Charts">
          <ChartCard title="Task Progress" type="line" data={chartData} />
        </DashboardSection>
      </ScrollView>
    </AdminLayout>
  );
};
