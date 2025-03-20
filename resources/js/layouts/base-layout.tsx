import { BottomNav } from '@/components/bottom-nav';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { Toaster } from 'sonner';

interface BaseLayoutProps {
    header?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    sidebar?: React.ReactNode;
    isAdmin?: boolean;
}

export function BaseLayout({ header, children, className, sidebar, isAdmin }: BaseLayoutProps) {
    const { theme } = useTheme();

    // Use theme from context for consistent state across page navigation
    const currentTheme = theme === 'system' ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme;

    return (
        <div className={cn('bg-background text-foreground relative min-h-screen', currentTheme)}>
            {header}
            <div className="flex min-h-screen">
                {sidebar}
                <main className={cn('flex-1 pb-20', className)}>{children}</main>
            </div>
            {!isAdmin && <BottomNav />}
            <Toaster position="top-right" theme={currentTheme} />
        </div>
    );
}

// Re-export as both default and named export for backward compatibility
export default BaseLayout;
