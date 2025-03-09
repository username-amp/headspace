import React from 'react';
import { Head } from '@inertiajs/react';
import { BaseLayout } from '@/layouts/base-layout';
import { NavMenu } from '@/components/navigation/nav-menu';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart } from '@/components/charts';
import { Users, BookOpen, Brain, Target, BarChart as ChartIcon } from 'lucide-react';

interface DashboardProps {
  stats: {
    total_users: number;
    total_meditation_sessions: number;
    total_focus_sessions: number;
    total_courses: number;
  };
  userActivity: {
    [date: string]: {
      total_activities: number;
      activity_type: string;
    }[];
  };
  mostActiveUsers: {
    id: number;
    name: string;
    email: string;
    activity_count: number;
  }[];
}

const Dashboard: React.FC<DashboardProps> = ({ stats, userActivity, mostActiveUsers }) => {
  const Header = (
    <div className="flex h-16 items-center px-6 gap-6 border-b">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
    </div>
  );

  const statCards = [
    {
      title: 'Total Users',
      value: stats.total_users,
      description: 'Active platform users',
      icon: <Users className="h-5 w-5 text-primary" />,
      trend: { value: 12, isPositive: true }
    },
    {
      title: 'Meditation Sessions',
      value: stats.total_meditation_sessions,
      description: 'Available meditations',
      icon: <Brain className="h-5 w-5 text-violet-600" />,
    },
    {
      title: 'Focus Sessions',
      value: stats.total_focus_sessions,
      description: 'Available focus content',
      icon: <Target className="h-5 w-5 text-blue-600" />,
    },
    {
      title: 'Total Courses',
      value: stats.total_courses,
      description: 'Active courses',
      icon: <BookOpen className="h-5 w-5 text-green-600" />,
    },
  ];

  return (
    <BaseLayout
      header={Header}
      sidebar={<NavMenu isAdmin currentPath="/admin/dashboard" />}
      currentPath="/admin/dashboard"
      isAdmin
      className="bg-muted/5"
    >
      <Head title="Admin Dashboard" />
      <div className="space-y-8">
        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
        
        {/* Activity Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Activity (Last 7 Days)</CardTitle>
                <ChartIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <LineChart
                data={Object.entries(userActivity).map(([date, activities]) => ({
                  date,
                  total: activities.reduce((sum, act) => sum + act.total_activities, 0),
                }))}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Activity by Type</CardTitle>
                <ChartIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <BarChart
                data={Object.values(userActivity).flatMap(activities =>
                  activities.map(act => ({
                    type: act.activity_type,
                    count: act.total_activities,
                  }))
                )}
              />
            </CardContent>
          </Card>
        </div>
        
        {/* Most Active Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Most Active Users</CardTitle>
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 text-muted-foreground font-medium">Name</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Email</th>
                    <th className="text-left p-3 text-muted-foreground font-medium">Activities</th>
                  </tr>
                </thead>
                <tbody>
                  {mostActiveUsers.map(user => (
                    <tr key={user.id} className="hover:bg-muted/50 transition-colors">
                      <td className="p-3">{user.name}</td>
                      <td className="p-3 text-muted-foreground">{user.email}</td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1">
                          <span className="font-medium">{user.activity_count}</span>
                          <span className="text-muted-foreground text-sm">activities</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default Dashboard;
