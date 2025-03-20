import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head, Link } from '@inertiajs/react';
import { Activity, Bell, Brain, Clock, Crown, Flame, Flower2, Moon, PlayCircle, Sparkles, Sun, Timer, Trophy } from 'lucide-react';

// Remove the mockData constant and update the component to use props
interface Props {
    stats: {
        currentStreak: {
            days: number;
            message: string;
        };
        totalMinutes: {
            minutes: number;
            message: string;
        };
        totalSessions: {
            count: number;
            message: string;
        };
        achievements: {
            count: number;
            total: number;
            message: string;
            items: Array<{
                title: string;
                description: string;
                progress: number;
                total: number;
                color: string;
                icon: string;
            }>;
        };
        todaysPractice: {
            completed: boolean;
            session: {
                title: string;
                type: string;
                duration: string;
                description: string;
                image: string;
            };
        };
    };
    recentActivities: Array<{
        title: string;
        type: string;
        duration: string;
        timestamp: string;
        icon: string;
        color: string;
    }>;
    recommendedContent: Array<{
        title: string;
        type: string;
        duration: string;
        category: string;
        image: string;
        video_url?: string;
        audio_url?: string;
        icon: string;
        url: string;
    }>;
}

// Add this function before the Dashboard component
const getIconComponent = (iconName: string) => {
    switch (iconName) {
        case 'Flower2':
            return <Flower2 className="h-5 w-5" />;
        case 'Brain':
            return <Brain className="h-5 w-5" />;
        case 'Sun':
            return <Sun className="h-5 w-5" />;
        case 'Moon':
            return <Moon className="h-5 w-5" />;
        default:
            return <Activity className="h-5 w-5" />;
    }
};

export default function Dashboard({ stats, recentActivities, recommendedContent }: Props) {
    const statCards = [
        {
            title: 'Daily Streak',
            value: `${stats.currentStreak.days} days`,
            description: stats.currentStreak.message,
            icon: <Flame className="h-6 w-6 text-amber-500" />,
            gradient: 'from-amber-500/20 via-yellow-500/20 to-amber-500/10',
            ringColor: 'group-hover:ring-amber-500/30',
        },
        {
            title: 'Mindful Minutes',
            value: stats.totalMinutes.minutes.toString(),
            description: stats.totalMinutes.message,
            icon: <Timer className="h-6 w-6 text-yellow-600" />,
            gradient: 'from-yellow-600/20 via-amber-500/20 to-yellow-600/10',
            ringColor: 'group-hover:ring-yellow-600/30',
        },
        {
            title: 'Total Sessions',
            value: stats.totalSessions.count.toString(),
            description: stats.totalSessions.message,
            icon: <Trophy className="h-6 w-6 text-amber-600" />,
            gradient: 'from-amber-600/20 via-yellow-600/20 to-amber-600/10',
            ringColor: 'group-hover:ring-amber-600/30',
        },
        {
            title: 'Achievements',
            value: `${stats.achievements.count}/${stats.achievements.total}`,
            description: stats.achievements.message,
            icon: <Crown className="h-6 w-6 text-yellow-500" />,
            gradient: 'from-yellow-500/20 via-amber-500/20 to-yellow-500/10',
            ringColor: 'group-hover:ring-yellow-500/30',
        },
    ];

    return (
        <AppHeaderLayout>
            <Head title="Dashboard" />

            <div className="container space-y-8 px-4 py-8 md:px-6">
                {/* Welcome Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-8 text-white shadow-xl">
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                            <Bell className="mr-2 h-5 w-5 text-amber-200" />
                            <span className="text-sm font-medium">Welcome back! ✨</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Your Mindful Journey Awaits</h1>
                        <p className="mt-2 max-w-md text-lg text-white/90">Take a moment to breathe, focus, and find your inner peace.</p>
                        <div className="mt-6 flex flex-wrap gap-4">
                            <Button className="bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30" asChild>
                                <Link href="/meditate">
                                    <Flower2 className="mr-2 h-5 w-5" />
                                    Start Meditation
                                </Link>
                            </Button>
                            <Button className="bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30" asChild>
                                <Link href="/focus">
                                    <Brain className="mr-2 h-5 w-5" />
                                    Focus Mode
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 opacity-50 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 opacity-50 blur-2xl" />
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat, index) => (
                        <Card
                            key={index}
                            className={`group hover:ring-offset-background overflow-hidden transition-all hover:scale-[1.02] hover:ring-2 ${stat.ringColor} hover:ring-offset-2`}
                        >
                            <CardContent className={`relative bg-gradient-to-br p-6 ${stat.gradient}`}>
                                <div className="flex items-center gap-4">
                                    <div className="rounded-xl bg-white/95 p-2.5 shadow-lg ring-1 ring-white/50 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-2xl">
                                        {stat.icon}
                                    </div>
                                    <div>
                                        <p className="text-foreground/80 text-sm font-medium">{stat.title}</p>
                                        <h3 className="from-foreground to-foreground/80 bg-gradient-to-br bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                                            {stat.value}
                                        </h3>
                                        <p className="text-foreground/60 text-sm">{stat.description}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Today's Practice */}
                    <Card className="group hover:ring-offset-background overflow-hidden transition-all hover:ring-2 hover:ring-amber-500/30 hover:ring-offset-2">
                        <CardContent className="p-6">
                            <div className="mb-6">
                                <h2 className="flex items-center gap-2 text-xl font-semibold">
                                    <div className="rounded-lg bg-amber-500/10 p-1.5">
                                        <Sun className="h-5 w-5 text-amber-500" />
                                    </div>
                                    Today's Practice
                                </h2>
                                <p className="text-foreground/60 text-sm">Your recommended session for today</p>
                            </div>
                            <div className="relative overflow-hidden rounded-xl">
                                <img
                                    src={stats.todaysPractice.session.image}
                                    alt={stats.todaysPractice.session.title}
                                    className="aspect-[2/1] w-full object-cover"
                                />
                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 text-white">
                                    <h3 className="text-lg font-semibold">{stats.todaysPractice.session.title}</h3>
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                                        <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                                            {stats.todaysPractice.session.type}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{stats.todaysPractice.session.duration}</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-white/80">{stats.todaysPractice.session.description}</p>
                                    <Button className="mt-4 bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30" asChild>
                                        <Link href="/meditate">
                                            <PlayCircle className="mr-2 h-5 w-5" />
                                            Begin Session
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card className="group hover:ring-offset-background overflow-hidden transition-all hover:ring-2 hover:ring-amber-500/30 hover:ring-offset-2">
                        <CardContent className="p-6">
                            <div className="mb-6">
                                <h2 className="flex items-center gap-2 text-xl font-semibold">
                                    <div className="rounded-lg bg-yellow-500/10 p-1.5">
                                        <Activity className="h-5 w-5 text-yellow-500" />
                                    </div>
                                    Recent Activity
                                </h2>
                                <p className="text-foreground/60 text-sm">Your latest mindfulness sessions</p>
                            </div>
                            <div className="space-y-4">
                                {recentActivities.map((activity, index) => (
                                    <div key={index} className="hover:bg-muted/50 flex items-center gap-4 rounded-lg border p-4 transition-colors">
                                        <div className={`rounded-full bg-gray-100 p-2 ${activity.color}`}>{getIconComponent(activity.icon)}</div>
                                        <div className="flex-1">
                                            <h4 className="font-medium">{activity.title}</h4>
                                            <div className="text-muted-foreground mt-1 flex items-center gap-3 text-sm">
                                                <span>{activity.type}</span>
                                                <span>•</span>
                                                <span>{activity.duration}</span>
                                            </div>
                                        </div>
                                        <div className="text-muted-foreground text-sm">{activity.timestamp}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Achievements */}
                <Card className="group hover:ring-offset-background overflow-hidden transition-all hover:ring-2 hover:ring-amber-500/30 hover:ring-offset-2">
                    <CardContent className="p-6">
                        <div className="mb-6">
                            <h2 className="flex items-center gap-2 text-xl font-semibold">
                                <div className="rounded-lg bg-amber-500/10 p-1.5">
                                    <Trophy className="h-5 w-5 text-amber-500" />
                                </div>
                                Achievements
                            </h2>
                            <p className="text-foreground/60 text-sm">Track your mindfulness milestones</p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {stats.achievements.items.map((achievement, index) => (
                                <div
                                    key={index}
                                    className={`rounded-lg border bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm transition-all duration-300 dark:from-gray-900/50 dark:to-gray-900 ${
                                        achievement.progress === achievement.total ? 'ring-2 ring-amber-500/50' : ''
                                    }`}
                                >
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className={`rounded-lg bg-gray-100 p-2 ${achievement.color}`}>{getIconComponent(achievement.icon)}</div>
                                        <div>
                                            <h4 className="font-medium">{achievement.title}</h4>
                                            <p className="text-muted-foreground text-xs">
                                                {achievement.progress === achievement.total ? 'Completed!' : 'In Progress'}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground mb-3 text-sm">{achievement.description}</p>
                                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${
                                                achievement.progress === achievement.total
                                                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                                                    : 'bg-gradient-to-r from-violet-500 to-purple-600'
                                            }`}
                                            style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                        />
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-muted-foreground text-xs">
                                            {achievement.progress === achievement.total
                                                ? 'Achievement Unlocked!'
                                                : `${achievement.progress}/${achievement.total} completed`}
                                        </span>
                                        <span className="text-sm font-medium">{Math.round((achievement.progress / achievement.total) * 100)}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recommended Sessions */}
                <div>
                    <div className="mb-6">
                        <h2 className="flex items-center gap-2 text-xl font-semibold">
                            <div className="rounded-lg bg-yellow-500/10 p-1.5">
                                <Sparkles className="h-5 w-5 text-yellow-500" />
                            </div>
                            Recommended for You
                        </h2>
                        <p className="text-foreground/60 text-sm">Personalized sessions based on your preferences</p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {recommendedContent.map((session, index) => (
                            <Card
                                key={index}
                                className="group hover:ring-offset-background relative overflow-hidden transition-all hover:ring-2 hover:ring-amber-500/30 hover:ring-offset-2"
                            >
                                <Link href={session.url}>
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img
                                            src={session.image}
                                            alt={session.title}
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        {/* Media Type Indicator */}
                                        {(session.video_url || session.audio_url) && (
                                            <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                                {session.video_url ? 'Video' : 'Audio'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                                        <div className="mb-2 flex items-center gap-2">
                                            <div className="rounded-lg bg-white/20 p-1.5 backdrop-blur-sm">{getIconComponent(session.icon)}</div>
                                            <span className="text-sm font-medium text-white/90">{session.category}</span>
                                        </div>
                                        <h3 className="text-lg font-semibold text-white">{session.title}</h3>
                                        <div className="mt-2 flex items-center gap-3 text-sm text-white/90">
                                            <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">{session.type}</span>
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                <span>{session.duration}</span>
                                            </div>
                                        </div>
                                        <Button
                                            size="icon"
                                            className="absolute top-1/2 left-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:scale-110 hover:bg-white/30"
                                        >
                                            <PlayCircle className="h-8 w-8 text-white" />
                                        </Button>
                                    </div>
                                </Link>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AppHeaderLayout>
    );
}
