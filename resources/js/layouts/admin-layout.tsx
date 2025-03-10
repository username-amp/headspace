import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { BarChart, Video, Music, LayoutDashboard, Users } from 'lucide-react';
import React from 'react';
import { Toaster } from 'sonner';
import { useTheme } from '@/components/theme-provider';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { theme } = useTheme();
    const currentTheme = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;

    const navItems = [
        {
            href: route('admin.dashboard'),
            icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
            label: 'Dashboard',
        },
        {
            href: route('admin.users.index'),
            icon: <Users className="mr-2 h-4 w-4" />,
            label: 'Users',
        },
        {
            href: route('admin.meditations.index'),
            icon: <Video className="mr-2 h-4 w-4" />,
            label: 'Meditation Videos',
        },
        {
            href: route('admin.focus.index'),
            icon: <Music className="mr-2 h-4 w-4" />,
            label: 'Focus Audio',
        },
        {
            href: route('admin.analytics'),
            icon: <BarChart className="mr-2 h-4 w-4" />,
            label: 'Analytics',
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 border-r bg-card">
                <div className="p-4">
                    <h1 className="mb-6 text-xl font-bold">Headspace Admin</h1>

                    <nav className="space-y-2">
                        {navItems.map((item) => (
                            <Link key={item.label} href={item.href}>
                                <Button variant="ghost" className="w-full justify-start">
                                    {item.icon}
                                    {item.label}
                                </Button>
                            </Link>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 min-h-screen flex-1 overflow-y-auto">
                {children}
            </main>
            <Toaster 
                position="top-right" 
                theme={currentTheme}
            />
        </div>
    );
};

export default AdminLayout;
