import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BaseLayout } from '@/layouts/base-layout';
import { NavMenu } from '@/components/navigation/nav-menu';
import { StatCard } from '@/components/ui/stat-card';
import { Head } from '@inertiajs/react';
import { Activity, Calendar, Clock, Crown, Flame, PlayCircle, Target } from 'lucide-react';

interface MeditationSession {
    title: string;
    duration: string;
    type: string;
    image: string;
}

function RecommendedSession({ session }: { session: MeditationSession }) {
    return (
        <Card className="group relative overflow-hidden p-0 transition-all hover:shadow-lg">
            <div className="aspect-video w-full overflow-hidden">
                <img src={session.image} alt={session.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-lg font-semibold text-white">{session.title}</h3>
                <div className="flex items-center gap-2 text-white/90 text-sm mt-1">
                    <span>{session.type}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{session.duration}</span>
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100">
                    <PlayCircle className="h-16 w-16 text-white drop-shadow-lg" />
                </div>
            </div>
        </Card>
    );
}

interface StreakDay {
    date: string;
    completed: boolean;
}

function StreakCalendar({ days }: { days: StreakDay[] }) {
    return (
        <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
                <div
                    key={index}
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-all ${
                        day.completed
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'bg-muted text-muted-foreground'
                    }`}
                >
                    {new Date(day.date).getDate()}
                </div>
            ))}
        </div>
    );
}

export default function Dashboard() {
    const stats = [
        {
            title: 'Current Streak',
            value: '7 days',
            description: 'Keep going strong!',
            icon: <Flame className="h-5 w-5 text-orange-600" />,
            trend: { value: 40, isPositive: true }
        },
        {
            title: 'Total Minutes',
            value: '420',
            description: 'Time spent meditating',
            icon: <Clock className="h-5 w-5 text-blue-600" />,
            trend: { value: 15, isPositive: true }
        },
        {
            title: 'Level',
            value: 'Level 5',
            description: 'Mindful Explorer',
            icon: <Crown className="h-5 w-5 text-yellow-600" />,
        },
        {
            title: 'Goals',
            value: '2/3',
            description: 'Daily goals completed',
            icon: <Target className="h-5 w-5 text-green-600" />,
        },
    ];

    const recommendedSessions: MeditationSession[] = [
        {
            title: 'Morning Mindfulness',
            duration: '10 min',
            type: 'Meditation',
            image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
        },
        {
            title: 'Stress Relief',
            duration: '15 min',
            type: 'Guided',
            image: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118',
        },
        {
            title: 'Focus Flow',
            duration: '20 min',
            type: 'Music',
            image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7',
        },
    ];

    const streakDays: StreakDay[] = Array.from({ length: 14 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 13 + i);
        return {
            date: date.toISOString(),
            completed: i < 13 && Math.random() > 0.3,
        };
    });

    const Header = (
        <div className="flex h-16 items-center px-6 gap-6 border-b">
            <h1 className="text-xl font-semibold">Headspacezzz</h1>
        </div>
    );

    return (
        <BaseLayout
            header={Header}
            sidebar={<NavMenu currentPath="/dashboard" />}
            currentPath="/dashboard"
            className="bg-muted/5"
        >
            <Head title="Dashboard" />
            <div className="space-y-8">
                {/* Welcome Section */}
                <div>
                    <h1 className="text-3xl font-bold">Welcome back!</h1>
                    <p className="mt-2 text-muted-foreground">
                        Track your progress and continue your mindfulness journey.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {/* Streak Calendar */}
                <Card className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Meditation Streak</h2>
                            <p className="text-sm text-muted-foreground">Your daily meditation progress</p>
                        </div>
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <StreakCalendar days={streakDays} />
                </Card>

                {/* Activity Chart */}
                <Card className="p-6">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Weekly Activity</h2>
                            <p className="text-sm text-muted-foreground">Minutes spent meditating</p>
                        </div>
                        <Activity className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex h-40 items-end gap-2">
                        {[35, 45, 30, 60, 25, 40, 50].map((value, index) => (
                            <div key={index} className="group relative flex-1">
                                <div 
                                    className="absolute -top-6 w-full text-center text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {value}m
                                </div>
                                <div
                                    className="bg-primary/20 hover:bg-primary/30 transition-colors"
                                    style={{ height: `${(value / 60) * 100}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                        <span>Sun</span>
                    </div>
                </Card>

                {/* Recommended Sessions */}
                <div>
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold">Recommended for You</h2>
                        <p className="text-sm text-muted-foreground">Based on your meditation history</p>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {recommendedSessions.map((session, index) => (
                            <RecommendedSession key={index} session={session} />
                        ))}
                    </div>
                </div>
            </div>
        </BaseLayout>
    );
}
