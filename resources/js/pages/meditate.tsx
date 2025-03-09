import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Clock, PlayCircle } from 'lucide-react';

interface MeditationItem {
    title: string;
    type: string;
    duration: string;
    image?: string;
}

interface MeditationSection {
    title: string;
    description?: string;
    items: MeditationItem[];
}

const featuredMeditations: MeditationItem[] = [
    {
        title: "Visualizing Well-Being",
        type: "Meditation",
        duration: "10 min",
        image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7"
    },
    {
        title: "Learn the Basics of Meditation",
        type: "Course",
        duration: "3-10 min",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773"
    },
    {
        title: "Breathe",
        type: "Meditation",
        duration: "1-3 min",
        image: "https://images.unsplash.com/photo-1515023115689-589c33041d3c"
    },
    {
        title: "Letting Go of Stress",
        type: "Course",
        duration: "10-20 min",
        image: "https://images.unsplash.com/photo-1474418397713-7ede21d49118"
    }
];

const sections: MeditationSection[] = [
    {
        title: "New and Popular",
        description: "The latest meditations and top picks from our team.",
        items: [
            {
                title: "Finding Inner Peace",
                type: "Meditation",
                duration: "15 min",
                image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83"
            },
            {
                title: "Mindful Morning",
                type: "Course",
                duration: "5-10 min",
                image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773"
            }
        ]
    },
    {
        title: "Quick Meditations",
        description: "Give yourself a moment to breathe.",
        items: [
            {
                title: "1-Minute Reset",
                type: "Meditation",
                duration: "1 min",
                image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2"
            },
            {
                title: "Quick Calm",
                type: "Meditation",
                duration: "3 min",
                image: "https://images.unsplash.com/photo-1515023115689-589c33041d3c"
            }
        ]
    },
    {
        title: "Courses and Singles",
        description: "Guided meditations for any moment.",
        items: [
            {
                title: "Beginning Meditation",
                type: "Course",
                duration: "10-20 min",
                image: "https://images.unsplash.com/photo-1474418397713-7ede21d49118"
            },
            {
                title: "Stress Relief",
                type: "Single",
                duration: "15 min",
                image: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83"
            }
        ]
    }
];

function MeditationCard({ item }: { item: MeditationItem }) {
    return (
        <Card className={`group relative overflow-hidden ${item.image ? 'p-0' : 'p-4'}`}>
            <div className="aspect-video w-full overflow-hidden">
                {item.image && (
                    <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
                    <span>{item.type}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.duration}</span>
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-12 w-12 text-white" />
                </div>
            </div>
        </Card>
    );
}

export default function Meditate() {
    return (
        <AppLayout>
            <Head title="Meditate" />
            <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-8 pb-20">
                    {/* Featured Section */}
                    <section>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Meditate</h1>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredMeditations.map((item, index) => (
                                <MeditationCard key={index} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* Today's Meditation */}
                    <section>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Today's Meditation</h2>
                        <div className="max-w-2xl">
                            <MeditationCard
                                item={{
                                    title: "Finding Contentment",
                                    type: "Meditation",
                                    duration: "3-20 min",
                                    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7"
                                }}
                            />
                        </div>
                    </section>

                    {/* Other Sections */}
                    {sections.map((section, index) => (
                        <section key={index}>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">{section.title}</h2>
                            {section.description && (
                                <p className="text-slate-600 dark:text-slate-400 mb-4">{section.description}</p>
                            )}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {section.items.map((item, itemIndex) => (
                                    <MeditationCard key={itemIndex} item={item} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </ScrollArea>
        </AppLayout>
    );
}
