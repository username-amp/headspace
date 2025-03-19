import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head, Link } from '@inertiajs/react';
import {
    Activity,
    Bell,
    Brain,
    Clock,
    Crown,
    Flame,
    Flower2,
    Moon,
    Music2,
    PlayCircle,
    Sparkles,
    Sun,
    Target,
    Timer,
    Trophy,
    Waves,
} from 'lucide-react';

// Mock data for initial dashboard state
const mockData = {
    stats: {
        currentStreak: {
            days: 7,
            message: 'Keep up the great work!',
        },
        totalMinutes: {
            minutes: 420,
            message: '7 hours of mindfulness',
        },
        totalSessions: {
            count: 28,
            message: 'Sessions completed',
        },
        achievements: {
            count: 5,
            total: 12,
            message: 'Achievements unlocked',
        },
    },
    todaysPractice: {
        completed: false,
        session: {
            title: 'Morning Mindfulness',
            duration: '10 min',
            type: 'Meditation',
            description: 'Start your day with clarity and purpose',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070',
        },
    },
    achievements: [
        {
            title: 'Early Bird',
            description: 'Complete 5 morning meditation sessions',
            progress: 3,
            total: 5,
            icon: <Sun className="h-5 w-5" />,
            color: 'text-amber-500',
        },
        {
            title: 'Focus Master',
            description: 'Accumulate 3 hours of focus sessions',
            progress: 2,
            total: 3,
            icon: <Brain className="h-5 w-5" />,
            color: 'text-indigo-500',
        },
        {
            title: 'Night Owl',
            description: 'Complete 5 evening meditation sessions',
            progress: 4,
            total: 5,
            icon: <Moon className="h-5 w-5" />,
            color: 'text-purple-500',
        },
    ],
    recentActivity: [
        {
            title: 'Deep Focus',
            type: 'Focus',
            duration: '45 min',
            timestamp: '2 hours ago',
            icon: <Target className="h-4 w-4" />,
            color: 'text-blue-500',
        },
        {
            title: 'Evening Calm',
            type: 'Meditation',
            duration: '15 min',
            timestamp: 'Yesterday',
            icon: <Flower2 className="h-4 w-4" />,
            color: 'text-purple-500',
        },
        {
            title: 'Study Session',
            type: 'Focus',
            duration: '60 min',
            timestamp: 'Yesterday',
            icon: <Brain className="h-4 w-4" />,
            color: 'text-indigo-500',
        },
    ],
    recommendedSessions: [
        {
            title: 'Deep Work Focus',
            type: 'Focus',
            duration: '45 min',
            category: 'Binaural Beats',
            image: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2073',
            icon: <Waves className="h-5 w-5 text-indigo-500" />,
        },
        {
            title: 'Stress Relief',
            type: 'Meditation',
            duration: '15 min',
            category: 'Guided',
            image: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=2053',
            icon: <Flower2 className="h-5 w-5 text-purple-500" />,
        },
        {
            title: 'Study Music',
            type: 'Focus',
            duration: '60 min',
            category: 'Classical',
            image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?q=80&w=2023',
            icon: <Music2 className="h-5 w-5 text-rose-500" />,
        },
    ],
};

export default function Dashboard() {
    const statCards = [
        {
            title: 'Daily Streak',
            value: `${mockData.stats.currentStreak.days} days`,
            description: mockData.stats.currentStreak.message,
            icon: <Flame className="h-6 w-6 text-rose-500" />,
            gradient: 'from-rose-500/20 via-orange-500/20 to-rose-500/10',
            ringColor: 'group-hover:ring-rose-500/30',
        },
        {
            title: 'Mindful Minutes',
            value: mockData.stats.totalMinutes.minutes.toString(),
            description: mockData.stats.totalMinutes.message,
            icon: <Timer className="h-6 w-6 text-violet-500" />,
            gradient: 'from-violet-500/20 via-purple-500/20 to-violet-500/10',
            ringColor: 'group-hover:ring-violet-500/30',
        },
        {
            title: 'Total Sessions',
            value: mockData.stats.totalSessions.count.toString(),
            description: mockData.stats.totalSessions.message,
            icon: <Trophy className="h-6 w-6 text-amber-500" />,
            gradient: 'from-amber-500/20 via-yellow-500/20 to-amber-500/10',
            ringColor: 'group-hover:ring-amber-500/30',
        },
        {
            title: 'Achievements',
            value: `${mockData.stats.achievements.count}/${mockData.stats.achievements.total}`,
            description: mockData.stats.achievements.message,
            icon: <Crown className="h-6 w-6 text-teal-500" />,
            gradient: 'from-teal-500/20 via-emerald-500/20 to-teal-500/10',
            ringColor: 'group-hover:ring-teal-500/30',
        },
    ];

    return (
        <AppHeaderLayout>
            <Head title="Dashboard" />

            <div className="container space-y-8 px-4 py-8 md:px-6">
                {/* Welcome Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-8 text-white shadow-xl">
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                            <Bell className="mr-2 h-5 w-5 text-pink-300" />
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
                    <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 opacity-50 blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-50 blur-2xl" />
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
                    <Card className="group hover:ring-offset-background overflow-hidden transition-all hover:ring-2 hover:ring-violet-500/30 hover:ring-offset-2">
                        <CardContent className="p-6">
                            <div className="mb-6">
                                <h2 className="flex items-center gap-2 text-xl font-semibold">
                                    <div className="rounded-lg bg-violet-500/10 p-1.5">
                                        <Sun className="h-5 w-5 text-violet-500" />
                                    </div>
                                    Today's Practice
                                </h2>
                                <p className="text-foreground/60 text-sm">Your recommended session for today</p>
                            </div>
                            <div className="relative overflow-hidden rounded-xl">
                                <img
                                    src={mockData.todaysPractice.session.image}
                                    alt={mockData.todaysPractice.session.title}
                                    className="aspect-[2/1] w-full object-cover"
                                />
                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/50 to-transparent p-6 text-white">
                                    <h3 className="text-lg font-semibold">{mockData.todaysPractice.session.title}</h3>
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                                        <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
                                            {mockData.todaysPractice.session.type}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Clock className="h-4 w-4" />
                                            <span>{mockData.todaysPractice.session.duration}</span>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-white/80">{mockData.todaysPractice.session.description}</p>
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
                    <Card className="group hover:ring-offset-background overflow-hidden transition-all hover:ring-2 hover:ring-violet-500/30 hover:ring-offset-2">
                        <CardContent className="p-6">
                            <div className="mb-6">
                                <h2 className="flex items-center gap-2 text-xl font-semibold">
                                    <div className="rounded-lg bg-indigo-500/10 p-1.5">
                                        <Activity className="h-5 w-5 text-indigo-500" />
                                    </div>
                                    Recent Activity
                                </h2>
                                <p className="text-foreground/60 text-sm">Your latest mindfulness sessions</p>
                            </div>
                            <div className="space-y-4">
                                {mockData.recentActivity.map((activity, index) => (
                                    <div key={index} className="hover:bg-muted/50 flex items-center gap-4 rounded-lg border p-4 transition-colors">
                                        <div className={`rounded-full bg-gray-100 p-2 ${activity.color}`}>{activity.icon}</div>
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
                <Card className="group hover:ring-offset-background overflow-hidden transition-all hover:ring-2 hover:ring-violet-500/30 hover:ring-offset-2">
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
                            {mockData.achievements.map((achievement, index) => (
                                <div
                                    key={index}
                                    className="rounded-lg border bg-gradient-to-br from-gray-50 to-white p-4 shadow-sm dark:from-gray-900/50 dark:to-gray-900"
                                >
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className={`rounded-lg bg-gray-100 p-2 ${achievement.color}`}>{achievement.icon}</div>
                                        <h4 className="font-medium">{achievement.title}</h4>
                                    </div>
                                    <p className="text-muted-foreground mb-3 text-sm">{achievement.description}</p>
                                    <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all"
                                            style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                        />
                                    </div>
                                    <div className="mt-2 text-right text-sm font-medium">
                                        {achievement.progress}/{achievement.total}
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
                            <div className="rounded-lg bg-rose-500/10 p-1.5">
                                <Sparkles className="h-5 w-5 text-rose-500" />
                            </div>
                            Recommended for You
                        </h2>
                        <p className="text-foreground/60 text-sm">Personalized sessions based on your preferences</p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {mockData.recommendedSessions.map((session, index) => (
                            <Card
                                key={index}
                                className="group hover:ring-offset-background relative overflow-hidden transition-all hover:ring-2 hover:ring-violet-500/30 hover:ring-offset-2"
                            >
                                <div className="aspect-video w-full overflow-hidden">
                                    <img
                                        src={session.image}
                                        alt={session.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6">
                                    <div className="mb-2 flex items-center gap-2">
                                        <div className="rounded-lg bg-white/20 p-1.5 backdrop-blur-sm">{session.icon}</div>
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
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </AppHeaderLayout>
    );
}
