import { cn } from '@/lib/utils';

interface AppContentProps extends React.ComponentProps<'main'> {
    children: React.ReactNode;
    variant?: 'header' | 'sidebar';
}

export function AppContent({ variant = 'header', children, className, ...props }: AppContentProps) {
    return (
        <main
            className={cn(
                'flex-1 overflow-y-auto bg-background',
                variant === 'header' && 'w-full px-4 pt-8 pb-20 md:px-8',
                variant === 'sidebar' && 'flex w-full flex-col',
                className
            )}
            {...props}
        >
            <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
    );
}
