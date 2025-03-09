import { cn } from '@/lib/utils';

interface AppContentProps extends React.ComponentProps<'main'> {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, ...props }: AppContentProps) {
    return (
        <main
            className={cn(
                'flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-950',
                variant === 'header' && 'w-full px-4 pb-20 pt-8 md:px-8',
                variant === 'sidebar' && 'flex w-full flex-col'
            )}
            {...props}
        >
            <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
    );
}
