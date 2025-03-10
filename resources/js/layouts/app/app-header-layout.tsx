import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { appearance } = useAppearance();

    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <AppContent className={cn('bg-background', appearance)}>{children}</AppContent>
        </AppShell>
    );
}
