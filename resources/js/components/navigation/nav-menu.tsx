import React from 'react';
import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Home, Compass, Brain, Settings, Users, BarChart } from 'lucide-react';

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    isActive?: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
                isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
            )}
        >
            {icon}
            <span>{label}</span>
        </Link>
    );
}

interface NavMenuProps {
    isAdmin?: boolean;
    currentPath: string;
}

export function NavMenu({ isAdmin = false, currentPath }: NavMenuProps) {
    const userNavItems = [
        {
            href: '/dashboard',
            icon: <Home className="h-4 w-4" />,
            label: 'Dashboard',
        },
        {
            href: '/meditate',
            icon: <Brain className="h-4 w-4" />,
            label: 'Meditate',
        },
        {
            href: '/focus',
            icon: <Compass className="h-4 w-4" />,
            label: 'Focus',
        },
        {
            href: '/settings',
            icon: <Settings className="h-4 w-4" />,
            label: 'Settings',
        },
    ];

    const adminNavItems = [
        {
            href: '/admin/dashboard',
            icon: <BarChart className="h-4 w-4" />,
            label: 'Dashboard',
        },
        {
            href: '/admin/users',
            icon: <Users className="h-4 w-4" />,
            label: 'Users',
        },
        {
            href: '/admin/meditations',
            icon: <Brain className="h-4 w-4" />,
            label: 'Meditations',
        },
        {
            href: '/admin/focus',
            icon: <Compass className="h-4 w-4" />,
            label: 'Focus Content',
        },
    ];

    const items = isAdmin ? adminNavItems : userNavItems;

    return (
        <nav className="space-y-1 p-4">
            {items.map((item) => (
                <NavItem
                    key={item.href}
                    {...item}
                    isActive={currentPath === item.href}
                />
            ))}
        </nav>
    );
}
