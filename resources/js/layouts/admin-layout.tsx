import { Button } from '@/components/ui/button';
import { Link, usePage } from '@inertiajs/react';
import type { Page } from '@inertiajs/core';
import { BarChart, Video, Music, LayoutDashboard, Users, Search, Bell, Settings, LogOut, User, Headphones, Waves, Radio } from 'lucide-react';
import React from 'react';
import { Toaster } from 'sonner';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    const { theme } = useTheme();
    const page = usePage<SharedPageProps>();
    const { auth } = page.props;
    const { user } = auth;

    const currentTheme = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;

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
    const currentPage = navItems.find(item => page.url.startsWith(item.href));
    const pageTitle = currentPage?.label || 'Admin';

    // Get user initials
    const userInitials = user.name
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase();

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-30 h-full w-64 border-r bg-card">
                <div className="flex h-16 items-center border-b px-6">
                    <h1 className="text-xl font-bold">Headspace Admin</h1>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = page.url.startsWith(item.href);
                        return (
                            <div key={item.label}>
                                <Link href={item.href}>
                                    <Button 
                                        variant="ghost" 
                                        className={cn(
                                            "w-full justify-start font-medium hover:bg-muted group",
                                            isActive && "bg-muted"
                                        )}
                                    >
                                        {item.icon}
                                        <div className="flex flex-col items-start">
                                            <span>{item.label}</span>
                                            {item.subtext && (
                                                <span className="text-xs text-muted-foreground">{item.subtext}</span>
                                            )}
                                        </div>
                                        {item.softDelete && (
                                            <span className="ml-auto text-xs text-muted-foreground opacity-0 group-hover:opacity-100">
                                                Soft Delete
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                                {item.types && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {item.types.map((type) => (
                                            <Link key={type.type} href={`${item.href}?type=${type.type}`}>
                                                <Button
                                                    variant="ghost"
                                                    className={cn(
                                                        "w-full justify-start text-sm font-normal hover:bg-muted",
                                                        page.url === `${item.href}?type=${type.type}` && "bg-muted"
                                                    )}
                                                >
                                                    {type.icon}
                                                    <div className="flex flex-col items-start">
                                                        <span>{type.label}</span>
                                                        <span className="text-xs text-muted-foreground">{type.directory}</span>
                                                    </div>
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="ml-64">
                {/* Fixed Header */}
                <header className="fixed top-0 right-0 left-64 z-20 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-16 items-center justify-between px-6">
                        <h2 className="text-lg font-semibold">{pageTitle}</h2>
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Search className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <Bell className="h-5 w-5" />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.avatar} alt={user.name} />
                                            <AvatarFallback>{userInitials}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
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
                                        <DropdownMenuItem className="text-red-600">
                                            <LogOut className="mr-2 h-4 w-4" />
                                            <span>Log out</span>
                                        </DropdownMenuItem>
                                    </Link>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="relative pt-16">
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>

            <Toaster 
                position="top-right" 
                theme={currentTheme}
            />
        </div>
    );
};

export default AdminLayout;
