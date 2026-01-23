import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { StatsGrid } from '@/components/common/StatsGrid';
import { ChartCard } from '@/components/common/ChartCard';
import { DashboardSection } from '@/components/common/DashboardSection';
import { getDashboard } from '@/services/user';
import { UserLayout } from '@/components/user/UserLayout';

export const UserHome = () => {
  const [stats, setStats] = useState<
    { id: number; title: string; value: number; icon: string }[]
  >([]);
  const [chart, setChart] = useState<
    { name: string; value: number; color: string; legendFontColor: string; legendFontSize: number; }[]
  >([]);
  const [loading, setLoading] = useState(true);
  
//fetching stats data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboard();

        const cards = [
          { id: 1, title: 'High Priority Tasks', value: data.assigned? data.high : 0, icon: '⚠️' },
          { id: 2, title: 'Assigned Tasks', value: data.assigned || 0, icon: '📋' },
          { id: 3, title: 'Completed Tasks', value: data.completed || 0, icon: '✅' },
        ];

        const chart_data = [
          { name: 'Completed', value: data.completed || 0, color: '#13ab3eff', legendFontColor: '#333', legendFontSize: 12 },
          { name: 'Pending', value: (data.assigned - data.completed) || 0, color: '#fae60bff', legendFontColor: '#333', legendFontSize: 12 },
          { name: 'Rejected', value: data.rejected || 0, color: '#c40808ff', legendFontColor: '#333', legendFontSize: 12 },        ];

        setChart(chart_data);
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
    <UserLayout>
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
    </UserLayout>
  );
};
