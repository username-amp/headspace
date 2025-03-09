import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Music, 
  BarChart 
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-full bg-card border-r">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-6">Headspace Admin</h1>
          
          <nav className="space-y-2">
            <Link href={route('admin.dashboard')}>
              <Button variant="ghost" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            
            <Link href={route('admin.users.index')}>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Users
              </Button>
            </Link>
            
            <Link href={route('admin.meditations.index')}>
              <Button variant="ghost" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Meditations
              </Button>
            </Link>
            
            <Link href={route('admin.focus.index')}>
              <Button variant="ghost" className="w-full justify-start">
                <Music className="mr-2 h-4 w-4" />
                Focus
              </Button>
            </Link>
            
            <Link href={route('admin.analytics')}>
              <Button variant="ghost" className="w-full justify-start">
                <BarChart className="mr-2 h-4 w-4" />
                Analytics
              </Button>
            </Link>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
