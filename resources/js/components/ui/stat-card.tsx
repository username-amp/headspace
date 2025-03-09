import React from 'react';
import { Card } from './card';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatCard({ title, value, description, icon, trend, className }: StatCardProps) {
    return (
        <Card className={cn("p-6 transition-all hover:shadow-lg", className)}>
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                    {description && (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    )}
                    {trend && (
                        <div className="flex items-center gap-2">
                            <span className={cn(
                                "text-sm font-medium",
                                trend.isPositive ? "text-green-600" : "text-red-600"
                            )}>
                                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                            </span>
                            <span className="text-sm text-muted-foreground">vs last period</span>
                        </div>
                    )}
                </div>
                {icon && (
                    <div className="rounded-full p-2.5 bg-primary/10">
                        {icon}
                    </div>
                )}
            </div>
        </Card>
    );
}
