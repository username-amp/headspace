import { cn } from '@/lib/utils';
import { useAppearance } from '@/hooks/use-appearance';
import { BottomNav } from '@/components/bottom-nav';
import { Toaster } from 'sonner';
import { usePage } from '@inertiajs/react';
import { useTheme } from '@/components/theme-provider';

interface BaseLayoutProps {
    header?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    sidebar?: React.ReactNode;
    isAdmin?: boolean;
}

export function BaseLayout({ header, children, className, sidebar, isAdmin }: BaseLayoutProps) {
    const { theme } = useTheme();
    const { appearance } = useAppearance();

    // Use theme from context for consistent state across page navigation
    const currentTheme = theme === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;

    return (
        <div className={cn('relative min-h-screen bg-background text-foreground', currentTheme)}>
            {header}
            <div className="flex min-h-screen">
                {sidebar}
                <main className={cn('flex-1 pb-20', className)}>{children}</main>
            </div>
            {!isAdmin && <BottomNav />}
            <Toaster 
                position="top-right" 
                theme={currentTheme} 
            />
        </div>
    );
}

// Re-export as both default and named export for backward compatibility
export default BaseLayout;
