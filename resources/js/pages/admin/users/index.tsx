import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link } from '@inertiajs/react';
import { Activity, User, Calendar, Video, Music } from 'lucide-react';
import React from 'react';

interface UserData {
    id: number;
    name: string;
    email: string;
    meditations_count: number;
    activity_logs_count: number;
    created_at: string;
}

interface UsersIndexProps {
    users: {
        data: UserData[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

const UsersIndex: React.FC<UsersIndexProps> = ({ users }) => {
    return (
        <AdminLayout>
            <Head title="Users Management" />
            <div className="p-6">
                <div className="mb-6 flex items-center">
                    <div className="mr-3 rounded-lg bg-cyan-500/10 p-2 text-cyan-500">
                        <User className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Users Management</h1>
                        <p className="text-muted-foreground mt-1">Total Users: {users.total}</p>
                    </div>
                </div>

                <div className="grid gap-4">
                    {users.data.map((user) => (
                        <Card key={user.id} className="group transition-all hover:shadow-lg">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-cyan-500/10 text-cyan-500 flex h-12 w-12 items-center justify-center rounded-full transition-colors group-hover:bg-cyan-500/20">
                                            <User className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">{user.name}</h3>
                                            <p className="text-muted-foreground text-sm">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Link href={route('admin.users.show', user.id)}>
                                            <Button variant="outline" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="bg-indigo-500/10 text-indigo-500 flex h-8 w-8 items-center justify-center rounded transition-colors group-hover:bg-indigo-500/20">
                                            <Activity className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Total Activities</p>
                                            <p className="text-lg font-bold text-indigo-500">{user.activity_logs_count}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="bg-emerald-500/10 text-emerald-500 flex h-8 w-8 items-center justify-center rounded transition-colors group-hover:bg-emerald-500/20">
                                            <Video className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Meditations</p>
                                            <p className="text-lg font-bold text-emerald-500">{user.meditations_count}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <div className="bg-purple-500/10 text-purple-500 flex h-8 w-8 items-center justify-center rounded transition-colors group-hover:bg-purple-500/20">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">Member Since</p>
                                            <p className="text-lg font-bold text-purple-500">{new Date(user.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="mt-6 flex justify-center">
                        <div className="flex space-x-2">
                            {Array.from({ length: users.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={route('admin.users.index', { page })}
                                    className={`rounded px-4 py-2 transition-colors ${
                                        page === users.current_page 
                                            ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                                            : 'bg-card hover:bg-accent'
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default UsersIndex;
