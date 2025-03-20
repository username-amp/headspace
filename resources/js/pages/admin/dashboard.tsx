import {  LineChart } from '@/components/charts';
import { Card, CardContent } from '@/components/ui/card';

import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import { Video, Music, Check, Clock, Users, BookOpen, Headphones, Waves, Radio } from 'lucide-react';
import React from 'react';

interface DashboardProps {
    stats: {
        total_users: number;
        total_meditation_sessions: number;
        total_focus_sessions: number;
        total_courses: number;
        completion_rate: number;
        active_users_today: number;
        focus_sessions_by_type: {
            binaural: number;
            music: number;
            soundscape: number;
        };
        storage_usage: {
            meditation_videos: number; // in MB
            focus_audio: number; // in MB
        };
    };
    contentMetrics?: {
        meditation_completion_rate: number;
        focus_completion_rate: number;
        course_completion_rate: number;
    };
    userActivity: {
        [date: string]: {
            meditation_count: number;
            focus_count: number;
            course_progress: number;
        };
    };
    mostActiveUsers: {
        id: number;
        name: string;
        email: string;
        activity_count: number;
    }[];
}

const DEFAULT_METRICS = {
    meditation_completion_rate: 0,
    focus_completion_rate: 0,
    course_completion_rate: 0,
};

const Dashboard: React.FC<DashboardProps> = ({ 
    stats, 
    contentMetrics = DEFAULT_METRICS,
    userActivity = {},
    mostActiveUsers = [] 
}) => {

    // Performance metrics based on actual content completion rates
    const performanceCards = [
        {
            title: 'Meditation Success',
            value: `${contentMetrics?.meditation_completion_rate ?? 0}%`,
            icon: <Video className="text-emerald-500 h-5 w-5" />,
            description: `${stats.total_meditation_sessions} videos • ${Math.round(stats.storage_usage?.meditation_videos ?? 0)}MB`,
        },
        {
            title: 'Focus Sessions',
            value: `${contentMetrics?.focus_completion_rate ?? 0}%`,
            icon: <Music className="text-blue-500 h-5 w-5" />,
            description: `${stats.total_focus_sessions} audio • ${Math.round(stats.storage_usage?.focus_audio ?? 0)}MB`,
        },
    ];

    // Focus session type breakdown
    const focusTypeItems = [
        {
            title: 'Binaural Beats',
            count: stats.focus_sessions_by_type?.binaural ?? 0,
            icon: <Waves className="text-violet-500 h-5 w-5" />,
        },
        {
            title: 'Music Tracks',
            count: stats.focus_sessions_by_type?.music ?? 0,
            icon: <Radio className="text-pink-500 h-5 w-5" />,
        },
        {
            title: 'Soundscapes',
            count: stats.focus_sessions_by_type?.soundscape ?? 0,
            icon: <Headphones className="text-amber-500 h-5 w-5" />,
        },
    ];

    // Progress items showing recent system status
    const progressItems = [
        {
            title: 'Video content processed',
            status: 'done',
            icon: <Check className="text-emerald-500 h-5 w-5" />,
        },
        {
            title: 'Audio files optimized',
            status: 'done',
            icon: <Check className="text-emerald-500 h-5 w-5" />,
        },
        {
            title: 'Course materials updated',
            status: 'done',
            icon: <Check className="text-emerald-500 h-5 w-5" />,
        },
    ];

    // Engagement metrics from actual user activity
    const engagementMetrics = [
        {
            title: 'Active Today',
            value: stats.active_users_today?.toString() ?? '0',
            trend: 'up',
            icon: <Users className="text-orange-500 h-5 w-5" />,
        },
        {
            title: 'Meditations',
            value: stats.total_meditation_sessions?.toString() ?? '0',
            trend: 'up',
            icon: <Video className="text-blue-500 h-5 w-5" />,
        },
        {
            title: 'Focus Sessions',
            value: stats.total_focus_sessions?.toString() ?? '0',
            trend: 'up',
            icon: <Music className="text-rose-500 h-5 w-5" />,
        },
        {
            title: 'Courses',
            value: stats.total_courses?.toString() ?? '0',
            trend: 'up',
            icon: <BookOpen className="text-purple-500 h-5 w-5" />,
        },
    ];

    // Format activity data for the chart with total activities per day
    const activityData = Object.entries(userActivity || {}).map(([date, data]) => ({
        date,
        total: (data?.meditation_count ?? 0) + (data?.focus_count ?? 0) + (data?.course_progress ?? 0),
    }));

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />
            <div className="space-y-6">
                {/* Performance Section */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Performance Cards */}
                    <Card className="col-span-1 bg-[#1a1b1e] text-white">
                        <CardContent className="p-6">
                            <h2 className="mb-4 text-xl font-semibold">Content Performance</h2>
                            <div className="space-y-4">
                                {performanceCards.map((card, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-400">{card.title}</p>
                                            <p className="text-2xl font-bold">{card.value}</p>
                                            <p className="text-xs text-gray-400">{card.description}</p>
                                        </div>
                                        {card.icon}
                                    </div>
                                ))}
                                <div className="mt-6 space-y-4 border-t border-gray-800 pt-4">
                                    <h3 className="text-sm font-medium">Focus Session Types</h3>
                                    {focusTypeItems.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {item.icon}
                                                <span className="text-sm">{item.title}</span>
                                            </div>
                                            <span className="text-sm font-medium">{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-3 border-t border-gray-800 pt-4">
                                    {progressItems.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            {item.icon}
                                            <span className="text-sm">{item.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Activity Graph */}
                    <Card className="col-span-2 bg-[#B4E7E5]">
                        <CardContent className="p-6">
                            <div className="mb-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">Total Activities</h2>
                                    <p className="text-sm text-gray-600">Daily engagement across all content</p>
                                </div>
                                <div className="flex gap-4">
                                    <span className="font-medium">Total Activities</span>
                                </div>
                            </div>
                            <LineChart
                                data={activityData}
                            />
                        </CardContent>
                    </Card>
                </div>

                {/* Engagement Section */}
                <Card className="bg-[#F2E3D5]">
                    <CardContent className="p-6">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Platform Engagement</h2>
                            <p className="text-sm text-gray-600">Content and user engagement metrics</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {engagementMetrics.map((metric, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm"
                                >
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
                                        <p className="text-2xl font-bold">{metric.value}</p>
                                    </div>
                                    {metric.icon}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-white">
                    <CardContent className="p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Most Active Users</h2>
                                <p className="text-sm text-gray-600">Top performing users this week</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="p-3 text-left font-medium text-gray-600">User</th>
                                        <th className="p-3 text-left font-medium text-gray-600">Email</th>
                                        <th className="p-3 text-left font-medium text-gray-600">Activities</th>
                                        <th className="p-3 text-left font-medium text-gray-600">Last Active</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mostActiveUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3">{user.name}</td>
                                            <td className="p-3 text-gray-600">{user.email}</td>
                                            <td className="p-3">
                                                <span className="inline-flex items-center gap-1">
                                                    <span className="font-medium">{user.activity_count}</span>
                                                    <span className="text-sm text-gray-600">sessions</span>
                                                </span>
                                            </td>
                                            <td className="p-3 text-gray-600">
                                                <span className="inline-flex items-center gap-2">
                                                    <Clock className="h-4 w-4" />
                                                    <span>Today</span>
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
        </AdminLayout>
    );
};

export default Dashboard;
