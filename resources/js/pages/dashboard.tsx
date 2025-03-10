import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Head, Link, usePage } from '@inertiajs/react';
import { Clock, PlayCircle, Activity, Calendar, Crown, Flame, Target } from 'lucide-react';
import { AppHeader } from '@/components/app-header';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { BottomNav } from '@/components/bottom-nav';

interface DashboardProps {
    stats: {
        currentStreak: {
            days: number;
            message: string;
        };
        totalMinutes: {
            minutes: number;
            message: string;
        };
        level: {
            level: number;
            title: string;
        };
        dailyGoals: {
            completed: number;
            total: number;
            message: string;
        };
    };
    streakDays: Array<{
        date: string;
        completed: boolean;
    }>;
    weeklyActivity: Array<{
        day: string;
        minutes: number;
    }>;
    recommendedSessions: Array<{
        title: string;
        type: string;
        duration: string;
        image: string;
    }>;
}

export default function Dashboard({ stats, streakDays, weeklyActivity, recommendedSessions }: DashboardProps) {
    const { url } = usePage();
    const statCards = [
        {
            title: 'Current Streak',
            value: `${stats.currentStreak.days} days`,
            description: stats.currentStreak.message,
            icon: <Flame className="h-5 w-5 text-orange-600" />,
        },
        {
            title: 'Total Minutes',
            value: stats.totalMinutes.minutes.toString(),
            description: stats.totalMinutes.message,
            icon: <Clock className="h-5 w-5 text-blue-600" />,
        },
        {
            title: 'Level',
            value: `Level ${stats.level.level}`,
            description: stats.level.title,
            icon: <Crown className="h-5 w-5 text-yellow-600" />,
        },
        {
            title: 'Goals',
            value: `${stats.dailyGoals.completed}/${stats.dailyGoals.total}`,
            description: stats.dailyGoals.message,
            icon: <Target className="h-5 w-5 text-green-600" />,
        },
    ];

    return (
        <>
            <AppHeaderLayout>
                <Head title="Dashboard" />

                <div className="container space-y-8 px-4 py-6 md:px-6">
                    {/* Welcome Section */}
                    <div>
                        <h1 className="text-3xl font-bold">Welcome back!</h1>
                        <p className="text-muted-foreground mt-2">Track your progress and continue your mindfulness journey.</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((stat, index) => (
                            <Card key={index} className="p-6">
                                <div className="flex items-center gap-4">
                                    {stat.icon}
                                    <div>
                                        <p className="text-sm font-medium">{stat.title}</p>
                                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                                        <p className="text-muted-foreground text-sm">{stat.description}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Streak Calendar */}
                    <Card className="p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Meditation Streak</h2>
                                <p className="text-muted-foreground text-sm">Your daily meditation progress</p>
                            </div>
                            <Calendar className="text-muted-foreground h-5 w-5" />
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {streakDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                                        day.completed ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-muted text-muted-foreground'
                                    }`}
                                >
                                    {new Date(day.date).getDate()}
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Activity Chart */}
                    <Card className="p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold">Weekly Activity</h2>
                                <p className="text-muted-foreground text-sm">Minutes spent meditating</p>
                            </div>
                            <Activity className="text-muted-foreground h-5 w-5" />
                        </div>
                        <div className="flex h-40 items-end gap-2">
                            {weeklyActivity.map((day, index) => (
                                <div key={index} className="group relative flex-1">
                                    <div className="text-muted-foreground absolute -top-6 w-full text-center text-xs opacity-0 transition-opacity group-hover:opacity-100">
                                        {day.minutes}m
                                    </div>
                                    <div className="bg-primary/20 hover:bg-primary/30 transition-colors" style={{ height: `${(day.minutes / 60) * 100}%` }} />
                                </div>
                            ))}
                        </div>
                        <div className="text-muted-foreground mt-4 flex justify-between text-sm">
                            {weeklyActivity.map((day, index) => (
                                <span key={index}>{day.day}</span>
                            ))}
                        </div>
                    </Card>

                    {/* Recommended Sessions */}
                    <div>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold">Recommended for You</h2>
                            <p className="text-muted-foreground text-sm">Based on your meditation history</p>
                        </div>
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {recommendedSessions.map((session, index) => (
                                <Card key={index} className="group relative overflow-hidden p-0 transition-all hover:shadow-lg">
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img src={session.image} alt={session.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                    </div>
                                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                                        <h3 className="text-lg font-semibold text-white">{session.title}</h3>
                                        <div className="mt-1 flex items-center gap-2 text-sm text-white/90">
                                            <span>{session.type}</span>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{session.duration}</span>
                                            </div>
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-90 transform opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
                                            <PlayCircle className="h-16 w-16 text-white drop-shadow-lg" />
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </AppHeaderLayout>
            <BottomNav />
        </>
    );
}
