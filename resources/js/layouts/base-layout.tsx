import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BottomNav } from '@/components/navigation/bottom-nav';

interface BaseLayoutProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    sidebar?: React.ReactNode;
    className?: string;
    currentPath: string;
    isAdmin?: boolean;
}

export function BaseLayout({ children, header, sidebar, className = '', currentPath, isAdmin = false }: BaseLayoutProps) {
    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            {header && (
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    {header}
                </header>
            )}

            <div className="flex min-h-[calc(100vh-4rem)]">
                {/* Sidebar - Hidden on mobile */}
                {sidebar && (
                    <aside className="hidden border-r bg-muted/10 md:block md:w-64">
                        <ScrollArea className="h-[calc(100vh-4rem)]">
                            {sidebar}
                        </ScrollArea>
                    </aside>
                )}

                {/* Main Content */}
                <main className={`flex-1 pb-20 md:pb-6 ${className}`}>
                    <ScrollArea className="h-[calc(100vh-4rem)]">
                        <div className="container mx-auto p-6">
                            {children}
                        </div>
                    </ScrollArea>
                </main>
            </div>

            {/* Bottom Navigation - Only shown on mobile for non-admin pages */}
            {!isAdmin && <BottomNav currentPath={currentPath} />}
        </div>
    );
}
