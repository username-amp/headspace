import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, BarChart } from '@/components/charts';

interface PopularContent {
  id: number;
  title: string;
  section: string;
  category: string;
  completion_count: number;
}

interface MonthlyStats {
  [year: string]: {
    [month: string]: {
      total_activities: number;
      activity_type: string;
    }[];
  };
}

interface AnalyticsProps {
  monthlyStats: MonthlyStats;
  popularContent: {
    meditations: PopularContent[];
    focus: PopularContent[];
    courses: PopularContent[];
  };
}

const Analytics: React.FC<AnalyticsProps> = ({ monthlyStats, popularContent }) => {
  // Transform monthly stats for the line chart
  const monthlyData = Object.entries(monthlyStats).flatMap(([year, months]) =>
    Object.entries(months).map(([month, data]) => ({
      date: `${year}-${month}`,
      total: data.reduce((sum, item) => sum + item.total_activities, 0),
    }))
  ).sort((a, b) => a.date.localeCompare(b.date));

  // Transform activity types for the bar chart
  const activityData = Object.values(monthlyStats)
    .flatMap(months => Object.values(months))
    .flatMap(activities =>
      activities.map(activity => ({
        type: activity.activity_type,
        count: activity.total_activities,
      }))
    );

  return (
    <AdminLayout>
      <Head title="Analytics" />
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>

        {/* Monthly Activity Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart data={monthlyData} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart data={activityData} />
            </CardContent>
          </Card>
        </div>

        {/* Popular Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Popular Meditations */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Meditations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularContent.meditations.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-card rounded-lg">
                    <div className="flex-none w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.section} - {item.category}
                      </p>
                    </div>
                    <div className="flex-none">
                      <p className="font-bold">{item.completion_count}</p>
                      <p className="text-sm text-muted-foreground">completions</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Focus Content */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Focus Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularContent.focus.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-card rounded-lg">
                    <div className="flex-none w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.section} - {item.category}
                      </p>
                    </div>
                    <div className="flex-none">
                      <p className="font-bold">{item.completion_count}</p>
                      <p className="text-sm text-muted-foreground">plays</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularContent.courses.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 bg-card rounded-lg">
                    <div className="flex-none w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{item.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                    <div className="flex-none">
                      <p className="font-bold">{item.completion_count}</p>
                      <p className="text-sm text-muted-foreground">completions</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
