import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Activity } from 'lucide-react';

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Users Management</h1>
        </div>

        <div className="grid gap-4">
          {users.data.map(user => (
            <Card key={user.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={route('admin.users.show', user.id)}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Activities</p>
                      <p className="text-lg font-bold">{user.activity_logs_count}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Meditations</p>
                      <p className="text-lg font-bold">{user.meditations_count}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                      <Activity className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Member Since</p>
                      <p className="text-lg font-bold">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
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
              {Array.from({ length: users.last_page }, (_, i) => i + 1).map(page => (
                <Link
                  key={page}
                  href={route('admin.users.index', { page })}
                  className={`px-4 py-2 rounded ${
                    page === users.current_page
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
      </div>
    </AdminLayout>
  );
};

export default UsersIndex;
