import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Clock, Flower2, Moon, PlayCircle, Sparkles, Sun } from 'lucide-react';

interface MeditationItem {
    id: number;
    title: string;
    category: string;
    duration: string;
    image_url?: string;
    video_url?: string;
    description: string;
    is_featured: boolean;
    section: string;
}

interface MeditationSection {
    title: string;
    description?: string;
    items: MeditationItem[];
}

interface Props {
    meditations: MeditationItem[];
}

function MeditationCard({ item }: { item: MeditationItem }) {
    return (
        <Link href={route('meditate.details', item.id)} className="block">
            <Card className="group relative overflow-hidden rounded-2xl bg-black/5 backdrop-blur-sm transition-transform hover:scale-[1.02] hover:ring-2 hover:ring-amber-500/30 hover:ring-offset-2">
                <div className="aspect-video w-full overflow-hidden">
                    {item.image_url ? (
                        <img
                            src={item.image_url}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-gradient-to-br from-amber-500/20 to-yellow-600/20">
                            <Flower2 className="h-12 w-12 text-amber-500" />
                        </div>
                    )}
                </div>
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-black/30 to-transparent p-6">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <div className="mt-2 flex items-center gap-3 text-sm text-white/90">
                        <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">{item.category}</span>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{item.duration} min</span>
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
        </Link>
    );
}

function EmptyState() {
    return (
        <div className="flex h-[60vh] flex-col items-center justify-center text-center">
            <div className="relative mb-6">
                <div className="absolute inset-0 animate-pulse rounded-full bg-amber-500/20 blur-xl" />
                <div className="relative rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 p-4">
                    <Sparkles className="h-12 w-12 text-white" />
                </div>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-white">Finding Inner Peace...</h2>
            <p className="mb-6 max-w-md text-slate-600 dark:text-slate-400">
                We're preparing some amazing meditation sessions for you. Check back soon for a mindful journey into tranquility.
            </p>
            <div className="flex space-x-4">
                <div className="h-2 w-2 animate-bounce rounded-full bg-amber-500 [animation-delay:-0.3s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-amber-500 [animation-delay:-0.15s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-amber-500" />
            </div>
        </div>
    );
}

export default function Meditate({ meditations }: Props) {
    if (!meditations || meditations.length === 0) {
        return (
            <AppLayout>
                <Head title="Meditate" />
                <EmptyState />
            </AppLayout>
        );
    }

    // Organize meditations by section
    const featuredMeditations = meditations.filter((m) => m.is_featured);
    const todaysMeditation = meditations.find((m) => m.section === 'today');

    // Group remaining meditations by section
    const sectionGroups = meditations.reduce(
        (acc, meditation) => {
            if (meditation.section !== 'today' && !meditation.is_featured) {
                if (!acc[meditation.section]) {
                    acc[meditation.section] = {
                        title: getSectionTitle(meditation.section),
                        items: [],
                    };
                }
                acc[meditation.section].items.push(meditation);
            }
            return acc;
        },
        {} as Record<string, MeditationSection>,
    );

    // Convert sections object to array
    const sections = Object.values(sectionGroups);

    return (
        <AppLayout>
            <Head title="Meditate" />
            <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-8 pb-20">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-8 text-white">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold">Meditate Mode</h1>
                            <p className="mt-2 text-white/90">Watch and listen to our meditation videos</p>
                        </div>
                        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-yellow-300/20 blur-2xl" />
                    </section>

                    {/* Featured Section */}
                    {featuredMeditations.length > 0 && (
                        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-8 text-white">
                            <div className="relative z-10">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                                        <Moon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold">Featured Meditations</h1>
                                        <p className="mt-1 text-white/90">Begin your mindfulness journey</p>
                                    </div>
                                </div>
                                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                    {featuredMeditations.map((item) => (
                                        <MeditationCard key={item.id} item={item} />
                                    ))}
                                </div>
                            </div>
                            <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
                            <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-yellow-300/20 blur-2xl" />
                        </section>
                    )}

                    {/* Today's Meditation */}
                    {todaysMeditation && (
                        <section className="relative">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-full bg-amber-500/20 p-2">
                                    <Sun className="h-6 w-6 text-amber-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Today's Meditation</h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Start your day mindfully</p>
                                </div>
                            </div>
                            <div className="max-w-2xl">
                                <MeditationCard item={todaysMeditation} />
                            </div>
                        </section>
                    )}

                    {/* Other Sections */}
                    {sections.map((section) => (
                        <section key={section.title} className="relative">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="rounded-full bg-amber-500/20 p-2">
                                    <Flower2 className="h-6 w-6 text-amber-500" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{section.title}</h2>
                                    {section.description && <p className="text-sm text-slate-600 dark:text-slate-400">{section.description}</p>}
                                </div>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {section.items.map((item) => (
                                    <MeditationCard key={item.id} item={item} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </ScrollArea>
        </AppLayout>
    );
}

// Helper function to get human-readable section titles
function getSectionTitle(section: string): string {
    const titles: Record<string, string> = {
        featured: 'Featured Meditations',
        today: "Today's Meditation",
        new_popular: 'New and Popular',
        quick: 'Quick Meditations',
        courses: 'Courses',
        singles: 'Singles',
    };
    return titles[section] || section;
}
