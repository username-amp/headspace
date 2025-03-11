import { BarChart, LineChart } from '@/components/charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { BarChart as BarChartIcon, LineChart as LineChartIcon, Activity, Video, Music, BookOpen } from 'lucide-react';
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
                <div className="mb-6 flex items-center">
                    <div className="mr-3 rounded-lg bg-indigo-500/10 p-2 text-indigo-500">
                        <Activity className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                </div>

                {/* Monthly Activity Charts */}
                <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center space-x-3">
                            <div className="rounded-lg bg-blue-500/10 p-2 text-blue-500">
                                <LineChartIcon className="h-6 w-6" />
                            </div>
                            <CardTitle>Monthly Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LineChart data={monthlyData} />
                        </CardContent>
                    </Card>

                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center space-x-3">
                            <div className="rounded-lg bg-purple-500/10 p-2 text-purple-500">
                                <BarChartIcon className="h-6 w-6" />
                            </div>
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
                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center space-x-3">
                            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
                                <Video className="h-6 w-6" />
                            </div>
                            <CardTitle>Popular Meditations</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {popularContent.meditations.map((item, index) => (
                                    <div key={item.id} className="group flex items-center space-x-4 rounded-lg bg-card p-4 transition-all hover:bg-accent">
                                        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 transition-colors group-hover:bg-emerald-500/20">
                                            <span className="font-bold">{index + 1}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{item.title}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {item.section} - {item.category}
                                            </p>
                                        </div>
                                        <div className="flex-none">
                                            <p className="font-bold text-emerald-500">{item.completion_count}</p>
                                            <p className="text-muted-foreground text-sm">completions</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Popular Focus Content */}
                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center space-x-3">
                            <div className="rounded-lg bg-pink-500/10 p-2 text-pink-500">
                                <Music className="h-6 w-6" />
                            </div>
                            <CardTitle>Popular Focus Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {popularContent.focus.map((item, index) => (
                                    <div key={item.id} className="group flex items-center space-x-4 rounded-lg bg-card p-4 transition-all hover:bg-accent">
                                        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-pink-500/10 text-pink-500 transition-colors group-hover:bg-pink-500/20">
                                            <span className="font-bold">{index + 1}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{item.title}</p>
                                            <p className="text-muted-foreground text-sm">
                                                {item.section} - {item.category}
                                            </p>
                                        </div>
                                        <div className="flex-none">
                                            <p className="font-bold text-pink-500">{item.completion_count}</p>
                                            <p className="text-muted-foreground text-sm">plays</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Popular Courses */}
                    <Card className="transition-all hover:shadow-lg">
                        <CardHeader className="flex flex-row items-center space-x-3">
                            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-500">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <CardTitle>Popular Courses</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {popularContent.courses.map((item, index) => (
                                    <div key={item.id} className="group flex items-center space-x-4 rounded-lg bg-card p-4 transition-all hover:bg-accent">
                                        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-amber-500/10 text-amber-500 transition-colors group-hover:bg-amber-500/20">
                                            <span className="font-bold">{index + 1}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium">{item.title}</p>
                                            <p className="text-muted-foreground text-sm">{item.category}</p>
                                        </div>
                                        <div className="flex-none">
                                            <p className="font-bold text-amber-500">{item.completion_count}</p>
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
