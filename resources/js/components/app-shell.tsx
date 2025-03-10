import { SidebarProvider } from '@/components/ui/sidebar';
import { useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

interface AppShellProps {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
    className?: string;
}

export function AppShell({ children, variant = 'header', className }: AppShellProps) {
    const { appearance } = useAppearance();
    const [isOpen, setIsOpen] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('sidebar') !== 'false' : true));

    const handleSidebarChange = (open: boolean) => {
        setIsOpen(open);

        if (typeof window !== 'undefined') {
            localStorage.setItem('sidebar', String(open));
        }
    };

    if (variant === 'header') {
        return <div className={cn('flex min-h-screen w-full flex-col', appearance, className)}>{children}</div>;
    }

    return (
        <SidebarProvider defaultOpen={isOpen} open={isOpen} onOpenChange={handleSidebarChange}>
            <div className={cn(appearance, className)}>{children}</div>
        </SidebarProvider>
    );
}
