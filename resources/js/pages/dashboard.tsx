import { BottomNav } from '@/components/bottom-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppHeaderLayout from '@/layouts/app/app-header-layout';
import { Head, Link } from '@inertiajs/react';
import { Activity, Calendar, Clock, Flame, Heart, Moon, PlayCircle, Sparkles, Star, Target } from 'lucide-react';

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
        level: {
            level: 3,
            title: 'Mindful Explorer',
        },
        dailyGoals: {
            completed: 3,
            total: 4,
            message: 'Almost there!',
        },
    },
    streakDays: [
        { date: '2024-03-08', completed: true },
        { date: '2024-03-09', completed: true },
        { date: '2024-03-10', completed: true },
        { date: '2024-03-11', completed: true },
        { date: '2024-03-12', completed: true },
        { date: '2024-03-13', completed: true },
        { date: '2024-03-14', completed: true },
    ],
    weeklyActivity: [
        { day: 'Mon', minutes: 45 },
        { day: 'Tue', minutes: 30 },
        { day: 'Wed', minutes: 60 },
        { day: 'Thu', minutes: 25 },
        { day: 'Fri', minutes: 40 },
        { day: 'Sat', minutes: 55 },
        { day: 'Sun', minutes: 35 },
    ],
    recommendedSessions: [
        {
            title: 'Morning Mindfulness',
            type: 'Guided',
            duration: '10 min',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2070',
        },
        {
            title: 'Stress Relief',
            type: 'Breathing',
            duration: '15 min',
            image: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?q=80&w=2053',
        },
        {
            title: 'Deep Focus',
            type: 'Music',
            duration: '30 min',
            image: 'https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?q=80&w=2023',
        },
    ],
};

export default function Dashboard() {
    const statCards = [
        {
            title: 'Mindful Streak',
            value: `${mockData.stats.currentStreak.days} days`,
            description: mockData.stats.currentStreak.message,
            icon: <Flame className="h-6 w-6 text-rose-500" />,
            gradient: 'from-rose-500/20 via-orange-500/20 to-rose-500/10',
            ringColor: 'group-hover:ring-rose-500/30',
        },
        {
            title: 'Peace Time',
            value: mockData.stats.totalMinutes.minutes.toString(),
            description: mockData.stats.totalMinutes.message,
            icon: <Moon className="h-6 w-6 text-violet-500" />,
            gradient: 'from-violet-500/20 via-purple-500/20 to-violet-500/10',
            ringColor: 'group-hover:ring-violet-500/30',
        },
        {
            title: 'Zen Level',
            value: `Level ${mockData.stats.level.level}`,
            description: mockData.stats.level.title,
            icon: <Star className="h-6 w-6 text-amber-500" />,
            gradient: 'from-amber-500/20 via-yellow-500/20 to-amber-500/10',
            ringColor: 'group-hover:ring-amber-500/30',
        },
        {
            title: 'Daily Goals',
            value: `${mockData.stats.dailyGoals.completed}/${mockData.stats.dailyGoals.total}`,
            description: mockData.stats.dailyGoals.message,
            icon: <Target className="h-6 w-6 text-teal-500" />,
            gradient: 'from-teal-500/20 via-emerald-500/20 to-teal-500/10',
            ringColor: 'group-hover:ring-teal-500/30',
        },
    ];

    return (
        <AppHeaderLayout>
            <Head title="Dashboard" />

            <div className="container space-y-8 px-4 py-8 md:px-6">
                {/* Welcome Section with Animation */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-8 text-white shadow-xl">
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                            <Heart className="mr-2 h-5 w-5 text-pink-300" />
                            <span className="text-sm font-medium">Welcome back! ✨</span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">Time to Find Your Peace</h1>
                        <p className="mt-2 max-w-md text-lg text-white/90">
                            Your daily dose of tranquility awaits. Let's begin your mindful journey today.
                        </p>
                        <Button className="mt-6 bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/30" asChild>
                            <Link href="/meditate">
                                <PlayCircle className="mr-2 h-5 w-5" />
                                Start Today's Session
                            </Link>
                        </Button>
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

                {/* Streak Calendar */}
                <Card className="group hover:ring-offset-background overflow-hidden transition-all hover:ring-2 hover:ring-indigo-500/30 hover:ring-offset-2">
                    <CardContent className="p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="flex items-center gap-2 text-xl font-semibold">
                                    <div className="rounded-lg bg-rose-500/10 p-1.5">
                                        <Flame className="h-5 w-5 text-rose-500" />
                                    </div>
                                    Your Meditation Journey
                                </h2>
                                <p className="text-foreground/60 text-sm">Keep the streak alive!</p>
                            </div>
                            <div className="bg-foreground/5 rounded-lg p-1.5">
                                <Calendar className="text-foreground/70 h-5 w-5" />
                            </div>
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {mockData.streakDays.map((day, index) => (
                                <div
                                    key={index}
                                    className={`group relative flex h-14 w-full items-center justify-center rounded-xl text-sm font-medium transition-all ${
                                        day.completed
                                            ? 'bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-lg'
                                            : 'bg-muted/50 text-foreground/60 hover:bg-muted hover:text-foreground/80'
                                    }`}
                                >
                                    <span className="relative z-10">{new Date(day.date).getDate()}</span>
                                    {day.completed && (
                                        <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Chart */}
                <Card className="group hover:ring-offset-background overflow-hidden transition-all hover:ring-2 hover:ring-violet-500/30 hover:ring-offset-2">
                    <CardContent className="p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="flex items-center gap-2 text-xl font-semibold">
                                    <div className="rounded-lg bg-violet-500/10 p-1.5">
                                        <Activity className="h-5 w-5 text-violet-500" />
                                    </div>
                                    Mindfulness Activity
                                </h2>
                                <p className="text-foreground/60 text-sm">Your weekly meditation progress</p>
                            </div>
                        </div>
                        <div className="flex h-48 items-end gap-3">
                            {mockData.weeklyActivity.map((day, index) => (
                                <div key={index} className="group relative flex-1">
                                    <div className="bg-foreground text-background absolute -top-8 left-1/2 -translate-x-1/2 rounded-lg px-3 py-1.5 text-xs opacity-0 transition-opacity group-hover:opacity-100">
                                        {day.minutes}m
                                    </div>
                                    <div
                                        className="w-full rounded-t-lg bg-gradient-to-t from-violet-500 via-purple-500 to-fuchsia-500 shadow-lg transition-all group-hover:opacity-90"
                                        style={{ height: `${(day.minutes / 60) * 100}%` }}
                                    />
                                    <div className="text-foreground/60 mt-2 text-center text-sm font-medium">{day.day}</div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recommended Sessions */}
                <div>
                    <div className="mb-6">
                        <h2 className="flex items-center gap-2 text-xl font-semibold">
                            <div className="rounded-lg bg-amber-500/10 p-1.5">
                                <Sparkles className="h-5 w-5 text-amber-500" />
                            </div>
                            Curated for Your Journey
                        </h2>
                        <p className="text-foreground/60 text-sm">Personalized sessions to enhance your practice</p>
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
