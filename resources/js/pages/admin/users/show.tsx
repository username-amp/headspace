import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { Activity, ArrowLeft, BookOpen, Calendar, Clock, Music, User } from 'lucide-react';
import React from 'react';

interface ActivityLog {
    id: number;
    activity_type: string;
    activity_name: string;
    duration_minutes: number;
    created_at: string;
    metadata: Record<string, string | number | boolean | null>;
}

interface UserStats {
    total_meditation_time: number;
    meditation_streak: number;
    completed_courses: number;
}

interface UserActivity {
    id: number;
    action: string;
    duration: number;
    created_at: string;
    trackable: {
        title: string;
        type: string;
    };
}

interface UserDetailsProps {
    user: {
        id: number;
        name: string;
        email: string;
        created_at: string;
        activities: UserActivity[];
    };
    activityLogs: {
        data: ActivityLog[];
        current_page: number;
        last_page: number;
    };
    stats: UserStats;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, activityLogs, stats }) => {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'meditation':
                return <BookOpen className="h-4 w-4" />;
            case 'focus':
                return <Music className="h-4 w-4" />;
            default:
                return <Activity className="h-4 w-4" />;
        }
    };

    return (
        <AdminLayout>
            <>
                <Head title={`User Details - ${user.name}`} />
                <div className="p-6">
                    <div className="mb-6 flex items-center space-x-4">
                        <Link href={route('admin.users.index')}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Users
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold">User Details</h1>
                    </div>

                    {/* User Profile Card */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-4">
                                <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
                                    <User className="h-8 w-8" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold">{user.name}</h2>
                                    <p className="text-muted-foreground">{user.email}</p>
                                    <p className="text-muted-foreground text-sm">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4" />
                                    Total Meditation Time
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{stats.total_meditation_time} minutes</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Current Streak
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{stats.meditation_streak} days</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <BookOpen className="mr-2 h-4 w-4" />
                                    Completed Courses
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold">{stats.completed_courses}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Activity Log */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {activityLogs.data.map((log) => (
                                    <div
                                        key={log.id}
                                        className="bg-card hover:bg-accent flex items-center justify-between rounded-lg p-4 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded">
                                                {getActivityIcon(log.activity_type)}
                                            </div>
                                            <div>
                                                <p className="font-medium">{log.activity_name}</p>
                                                <p className="text-muted-foreground text-sm">
                                                    {log.activity_type.charAt(0).toUpperCase() + log.activity_type.slice(1)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{log.duration_minutes} minutes</p>
                                            <p className="text-muted-foreground text-sm">{new Date(log.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {activityLogs.last_page > 1 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex space-x-2">
                                        {Array.from({ length: activityLogs.last_page }, (_, i) => i + 1).map((page) => (
                                            <Link
                                                key={page}
                                                href={route('admin.users.show', { user: user.id, page })}
                                                className={`rounded px-4 py-2 ${
                                                    page === activityLogs.current_page
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-card hover:bg-accent'
                                                }`}
                                            >
                                                {page}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </>
        </AdminLayout>
    );
};

export default UserDetails;
