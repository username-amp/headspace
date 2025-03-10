import { BarChart, LineChart } from '@/components/charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

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
    const monthlyData = Object.entries(monthlyStats)
        .flatMap(([year, months]) =>
            Object.entries(months).map(([month, data]) => ({
                date: `${year}-${month}`,
                total: data.reduce((sum, item) => sum + item.total_activities, 0),
            })),
        )
        .sort((a, b) => a.date.localeCompare(b.date));

    // Transform activity types for the bar chart
    const activityData = Object.values(monthlyStats)
        .flatMap((months) => Object.values(months))
        .flatMap((activities) =>
            activities.map((activity) => ({
                type: activity.activity_type,
                count: activity.total_activities,
            })),
        );

    return (
        <AdminLayout>
            <Head title="Analytics" />
            <div className="p-6">
                <h1 className="mb-6 text-3xl font-bold">Analytics</h1>

                {/* Monthly Activity Charts */}
                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Popular Meditations */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Popular Meditations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {popularContent.meditations.map((item, index) => (
                                    <div key={item.id} className="bg-card flex items-center space-x-4 rounded-lg p-4">
                                        <div className="bg-primary/10 flex h-8 w-8 flex-none items-center justify-center rounded-full">
                                            <span className="font-bold">{index + 1}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{item.title}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {item.section} - {item.category}
                                            </p>
                                        </div>
                                        <div className="flex-none">
                                            <p className="font-bold">{item.completion_count}</p>
                                            <p className="text-muted-foreground text-sm">completions</p>
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
                                    <div key={item.id} className="bg-card flex items-center space-x-4 rounded-lg p-4">
                                        <div className="bg-primary/10 flex h-8 w-8 flex-none items-center justify-center rounded-full">
                                            <span className="font-bold">{index + 1}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{item.title}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {item.section} - {item.category}
                                            </p>
                                        </div>
                                        <div className="flex-none">
                                            <p className="font-bold">{item.completion_count}</p>
                                            <p className="text-muted-foreground text-sm">plays</p>
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
                                    <div key={item.id} className="bg-card flex items-center space-x-4 rounded-lg p-4">
                                        <div className="bg-primary/10 flex h-8 w-8 flex-none items-center justify-center rounded-full">
                                            <span className="font-bold">{index + 1}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{item.title}</p>
                                            <p className="text-muted-foreground text-sm">{item.category}</p>
                                        </div>
                                        <div className="flex-none">
                                            <p className="font-bold">{item.completion_count}</p>
                                            <p className="text-muted-foreground text-sm">completions</p>
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
