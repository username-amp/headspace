import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Home, Moon, Zap } from 'lucide-react';

export function BottomNav() {
    const currentPath = window.location.pathname;

    const navItems = [
        { name: 'Home', href: '/dashboard', icon: Home },
        { name: 'Meditate', href: '/meditate', icon: Moon },
        { name: 'Focus', href: '/focus', icon: Zap },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
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
                                isActive
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400'
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
