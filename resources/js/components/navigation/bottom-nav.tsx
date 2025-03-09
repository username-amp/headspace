import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Home, Brain, Compass } from 'lucide-react';

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
                "flex flex-1 flex-col items-center gap-1 p-2 transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-muted-foreground"
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
            icon: <Brain className="h-5 w-5" />,
            label: 'Meditate',
        },
        {
            href: '/focus',
            icon: <Compass className="h-5 w-5" />,
            label: 'Focus',
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
            {navItems.map((item) => (
                <BottomNavItem
                    key={item.href}
                    {...item}
                    isActive={currentPath === item.href}
                />
            ))}
        </nav>
    );
}
