import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Home, Video, Music } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export function BottomNav() {
    const { theme } = useTheme();
    const currentPath = window.location.pathname;

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Meditate', href: '/meditate', icon: Video },
        { name: 'Focus', href: '/focus', icon: Music },
    ];

    return (
        <div className="fixed right-0 bottom-0 left-0 z-50 border-t bg-background/95 backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
            <nav className="mx-auto flex max-w-md justify-around">
                {navItems.map((item) => {
                    const isActive = currentPath === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex flex-1 flex-col items-center py-3 text-sm',
                                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary',
                            )}
                        >
                            <Icon className="mb-1 h-5 w-5" />
                            <span className="text-xs">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
