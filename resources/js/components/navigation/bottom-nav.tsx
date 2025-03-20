import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Home, Music, Video } from 'lucide-react';
import React from 'react';

interface BottomNavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
}

function BottomNavItem({ href, icon, label, isActive }: BottomNavItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                'hover:text-primary flex flex-1 flex-col items-center gap-1 p-2 transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground',
            )}
        >
            {icon}
            <span className="text-xs font-medium">{label}</span>
        </Link>
    );
}

interface BottomNavProps {
    currentPath: string;
}

export function BottomNav({ currentPath }: BottomNavProps) {
    const navItems = [
        {
            href: '/dashboard',
            icon: <Home className="h-5 w-5" />,
            label: 'Dashboard',
        },
        {
            href: '/meditate',
            icon: <Video className="h-5 w-5" />,
            label: 'Meditate',
        },
        {
            href: '/focus',
            icon: <Music className="h-5 w-5" />,
            label: 'Focus',
        },
    ];

    return (
        <nav className="bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed right-0 bottom-0 left-0 z-50 flex h-16 items-center justify-around border-t backdrop-blur md:hidden">
            {navItems.map((item) => (
                <BottomNavItem key={item.href} {...item} isActive={currentPath === item.href} />
            ))}
        </nav>
    );
}
