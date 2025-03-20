import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Search, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';

interface AppHeaderProps {
    className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth } = page.props;
    const getInitials = useInitials();
    const [activeRoute, setActiveRoute] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    // Update active route when page changes
    useEffect(() => {
        setActiveRoute(window.location.pathname);
    }, []);

    // Add scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/meditate', label: 'Meditate' },
        { href: '/focus', label: 'Focus' },
    ];

    return (
        <div
            className={cn(
                'bg-background/80 sticky top-0 z-50 border-b backdrop-blur-lg transition-all duration-300',
                isScrolled && 'shadow-md',
                className,
            )}
        >
            <div className="mx-auto flex h-16 items-center justify-between px-4 md:max-w-7xl">
                {/* Logo and Brand */}
                <Link href="/dashboard" prefetch className="group flex items-center gap-2 transition-transform hover:scale-[0.98]">
                    <div className="relative">
                        <div className="absolute inset-0 scale-100 rotate-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-[15deg]">
                            <AppLogo />
                        </div>
                        <div className="invisible opacity-0">
                            <AppLogo />
                        </div>
                    </div>
                    <span className="bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-lg font-semibold text-transparent">
                        Headspace
                    </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden items-center space-x-1 md:flex">
                    {navItems.map((item) => {
                        const isActive = activeRoute === item.href;
                        return (
                            <Button
                                key={item.href}
                                variant="ghost"
                                className={cn(
                                    'hover:text-foreground relative text-sm font-medium transition-all',
                                    isActive ? 'text-foreground' : 'text-muted-foreground',
                                )}
                                asChild
                            >
                                <Link href={item.href}>
                                    {item.label}
                                    {isActive && (
                                        <span
                                            className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-amber-500 to-yellow-600"
                                            style={{
                                                transform: 'scaleX(1)',
                                                transition: 'transform 0.2s ease-in-out',
                                            }}
                                        />
                                    )}
                                </Link>
                            </Button>
                        );
                    })}
                </nav>

                {/* Search and User */}
                <div className="flex items-center space-x-4">
                    {/* Admin Button */}
                    {auth.user.role === 'admin' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="hidden items-center gap-2 transition-transform hover:scale-105 hover:text-amber-500 md:flex"
                            asChild
                        >
                            <Link href="/admin">
                                <Sparkles className="h-4 w-4 text-amber-500" />
                                <span>Admin</span>
                            </Link>
                        </Button>
                    )}

                    {/* Search Button */}
                    <Button variant="ghost" size="icon" className="group h-9 w-9 rounded-full transition-transform hover:scale-105">
                        <Search className="size-4 transition-transform duration-300 group-hover:scale-110" />
                        <span className="sr-only">Search</span>
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="group relative size-10 rounded-full p-1 transition-transform hover:scale-105">
                                <div className="relative">
                                    <Avatar className="size-8 overflow-hidden rounded-full ring-2 ring-amber-500/20 transition-all duration-300 group-hover:ring-amber-500/40">
                                        <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white">
                                            {getInitials(auth.user.name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500"></span>
                                    </span>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}
