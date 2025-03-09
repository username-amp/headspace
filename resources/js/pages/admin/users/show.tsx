import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Clock, 
  Calendar,
  BookOpen,
  Music,
  Activity,
  ArrowLeft
} from 'lucide-react';

interface ActivityLog {
  id: number;
  activity_type: string;
  activity_name: string;
  duration_minutes: number;
  created_at: string;
  metadata: Record<string, any>;
}

interface UserStats {
  total_meditation_time: number;
  meditation_streak: number;
  completed_courses: number;
}

interface UserDetailsProps {
  user: {
    id: number;
    name: string;
    email: string;
    created_at: string;
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
    <>
      <Head title={`User Details - ${user.name}`} />
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Link href={route('admin.users.index')}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">User Details</h1>
        </div>

        {/* User Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
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
                <Calendar className="h-4 w-4 mr-2" />
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
                <BookOpen className="h-4 w-4 mr-2" />
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
              {activityLogs.data.map(log => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-card hover:bg-accent transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                      {getActivityIcon(log.activity_type)}
                    </div>
                    <div>
                      <p className="font-medium">{log.activity_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.activity_type.charAt(0).toUpperCase() + log.activity_type.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{log.duration_minutes} minutes</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {activityLogs.last_page > 1 && (
              <div className="mt-6 flex justify-center">
                <div className="flex space-x-2">
                  {Array.from({ length: activityLogs.last_page }, (_, i) => i + 1).map(page => (
                    <Link
                      key={page}
                      href={route('admin.users.show', { user: user.id, page })}
                      className={`px-4 py-2 rounded ${
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
  );
};

UserDetails.layout = page => <AdminLayout children={page} />;

export default UserDetails;
