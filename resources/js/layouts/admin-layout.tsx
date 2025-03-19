import { useTheme } from '@/components/theme-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { BarChart, Bell, Headphones, LayoutDashboard, LogOut, Moon, Music, Radio, Search, Settings, User, Users, Video, Waves } from 'lucide-react';
import React from 'react';
import { Toaster } from 'sonner';

interface AdminLayoutProps {
    children: React.ReactNode;
}

interface User {
    name: string;
    email: string;
    avatar?: string;
}

interface Auth {
    user: User;
}

interface SharedPageProps {
    auth: Auth;
    [key: string]: unknown;
}

type FocusType = {
    type: 'binaural' | 'music' | 'soundscape';
    label: string;
    icon: React.ReactNode;
    directory: string;
};

type NavItem = {
    href: string;
    icon: React.ReactNode;
    label: string;
    subtext?: string;
    softDelete?: boolean;
    directory?: string;
    types?: readonly FocusType[];
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { theme, setTheme } = useTheme();
    const page = usePage<SharedPageProps>();
    const { auth } = page.props;
    const { user } = auth;

    const currentTheme = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;

    const focusTypes = [
        {
            type: 'binaural' as const,
            label: 'Binaural Beats',
            icon: <Waves className="mr-2 h-4 w-4" />,
            directory: 'focus-audio/binaural',
        },
        {
            type: 'music' as const,
            label: 'Music Tracks',
            icon: <Radio className="mr-2 h-4 w-4" />,
            directory: 'focus-audio/music',
        },
        {
            type: 'soundscape' as const,
            label: 'Soundscapes',
            icon: <Headphones className="mr-2 h-4 w-4" />,
            directory: 'focus-audio/soundscape',
        },
    ] satisfies FocusType[];

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
            subtext: 'mp4, mov, avi • max 100MB',
            softDelete: true,
            directory: 'meditation-videos',
        },
        {
            href: route('admin.focus.index'),
            icon: <Music className="mr-2 h-4 w-4" />,
            label: 'Focus Audio',
            subtext: 'mp3, wav, ogg • max 50MB',
            softDelete: true,
            types: focusTypes,
        },
        {
            href: route('admin.analytics'),
            icon: <BarChart className="mr-2 h-4 w-4" />,
            label: 'Analytics',
        },
    ] satisfies NavItem[];

    // Get current page title from nav items
    const currentPage = navItems.find((item) => page.url.startsWith(item.href));
    const pageTitle = currentPage?.label || 'Admin';

    // Get user initials
    const userInitials = user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="bg-background min-h-screen">
            {/* Sidebar */}
            <aside className="bg-card fixed top-0 left-0 z-30 flex h-full w-64 flex-col border-r">
                {/* Logo Section */}
                <div className="flex h-16 items-center gap-2 border-b px-6">
                    <div className="relative">
                        <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/20 blur-xl" />
                        <div className="relative rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-2">
                            <Moon className="h-5 w-5 text-white" />
                        </div>
                    </div>
                    <h1 className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-xl font-bold text-transparent">
                        Headspace Admin
                    </h1>
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-2">
                    <nav className="space-y-1 px-3">
                        {navItems.map((item) => {
                            const isActive = page.url.startsWith(item.href);
                            return (
                                <div key={item.label} className="relative">
                                    <Link href={item.href}>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                'group hover:bg-muted relative w-full justify-start font-medium transition-all',
                                                isActive &&
                                                    'bg-muted before:absolute before:top-1/2 before:left-0 before:h-8 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-gradient-to-b before:from-indigo-500 before:to-purple-600',
                                            )}
                                        >
                                            <span className={cn('mr-2 transition-transform group-hover:scale-110', isActive && 'text-indigo-500')}>
                                                {item.icon}
                                            </span>
                                            <div className="flex flex-col items-start">
                                                <span className={cn('transition-colors', isActive && 'text-indigo-500')}>{item.label}</span>
                                                {item.subtext && <span className="text-muted-foreground text-xs">{item.subtext}</span>}
                                            </div>
                                            {item.softDelete && (
                                                <span className="text-muted-foreground ml-auto text-xs opacity-0 transition-opacity group-hover:opacity-100">
                                                    Soft Delete
                                                </span>
                                            )}
                                        </Button>
                                    </Link>
                                    {item.types && (
                                        <div className="mt-1 ml-6 space-y-1">
                                            {item.types.map((type) => {
                                                const isTypeActive = page.url === `${item.href}?type=${type.type}`;
                                                return (
                                                    <Link key={type.type} href={`${item.href}?type=${type.type}`}>
                                                        <Button
                                                            variant="ghost"
                                                            className={cn(
                                                                'group hover:bg-muted w-full justify-start text-sm font-normal transition-all',
                                                                isTypeActive &&
                                                                    'bg-muted before:absolute before:top-1/2 before:left-0 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-r-full before:bg-gradient-to-b before:from-indigo-500 before:to-purple-600',
                                                            )}
                                                        >
                                                            <span
                                                                className={cn(
                                                                    'transition-transform group-hover:scale-110',
                                                                    isTypeActive && 'text-indigo-500',
                                                                )}
                                                            >
                                                                {type.icon}
                                                            </span>
                                                            <div className="flex flex-col items-start">
                                                                <span className={cn('transition-colors', isTypeActive && 'text-indigo-500')}>
                                                                    {type.label}
                                                                </span>
                                                                <span className="text-muted-foreground text-xs">{type.directory}</span>
                                                            </div>
                                                        </Button>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                </ScrollArea>

                {/* User Section */}
                <div className="border-t p-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="hover:bg-muted w-full justify-start">
                                <Avatar className="mr-2 h-8 w-8">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-start text-left">
                                    <span className="text-sm font-medium">{user.name}</span>
                                    <span className="text-muted-foreground text-xs">{user.email}</span>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={8}>
                            <DropdownMenuItem onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}>
                                <Moon className="mr-2 h-4 w-4" />
                                <span>{currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <Link href={route('logout')} method="post" as="div">
                                <DropdownMenuItem className="text-red-600 focus:bg-red-50 dark:focus:bg-red-950">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Main Content */}
            <div className="ml-64">
                {/* Fixed Header */}
                <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-64 z-20 border-b backdrop-blur">
                    <div className="flex h-16 items-center justify-between px-6">
                        <h2 className="text-lg font-semibold">{pageTitle}</h2>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="group h-9 w-9 rounded-full transition-transform hover:scale-105">
                                <Search className="h-4 w-4 transition-transform group-hover:scale-110" />
                            </Button>
                            <Button variant="ghost" size="icon" className="group relative h-9 w-9 rounded-full transition-transform hover:scale-105">
                                <Bell className="h-4 w-4 transition-transform group-hover:scale-110" />
                                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="relative min-h-[calc(100vh-4rem)] pt-16">
                    <div className="p-6">{children}</div>
                </main>
            </div>

            <Toaster position="top-right" theme={currentTheme} className="toaster group" />
        </div>
    );
};

export default AdminLayout;
