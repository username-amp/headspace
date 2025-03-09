import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Clock, Music, PlayCircle } from 'lucide-react';

interface FocusItem {
    title: string;
    type: string;
    duration: string;
    image?: string;
    icon?: 'music' | 'meditation';
}

interface FocusSection {
    title: string;
    description?: string;
    items: FocusItem[];
}

const featuredItems: FocusItem[] = [
    {
        title: "Tina Guo's Playlist",
        type: "Focus music",
        duration: "60 min",
        image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76",
        icon: "music"
    },
    {
        title: "Breathing through exams",
        type: "Meditation",
        duration: "10 min",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
        icon: "meditation"
    },
    {
        title: "Organizing Thoughts",
        type: "Meditation",
        duration: "7 min",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
        icon: "meditation"
    },
    {
        title: "Study Beats",
        type: "Focus Music",
        duration: "54 min",
        image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
        icon: "music"
    }
];

const sections: FocusSection[] = [
    {
        title: "Binaural Beats",
        description: "A special collection of harmonic frequencies — scientifically proven to enhance focus, relaxation, and calm",
        items: [
            {
                title: "Deep Focus",
                type: "Binaural",
                duration: "60 min",
                image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
                icon: "music"
            },
            {
                title: "Alpha Waves",
                type: "Binaural",
                duration: "45 min",
                image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7",
                icon: "music"
            }
        ]
    },
    {
        title: "Focus Music",
        description: "Find and keep focus with music from world-renowned artists",
        items: [
            {
                title: "Piano Focus",
                type: "Music",
                duration: "120 min",
                image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0",
                icon: "music"
            },
            {
                title: "Ambient Flow",
                type: "Music",
                duration: "90 min",
                image: "https://images.unsplash.com/photo-1511379938547-c1f69419868d",
                icon: "music"
            }
        ]
    },
    {
        title: "Soundscapes",
        description: "3D recordings from the world's loveliest places",
        items: [
            {
                title: "Rainy Coffee Shop",
                type: "Soundscape",
                duration: "60 min",
                image: "https://images.unsplash.com/photo-1445116572660-236099ec97a0",
                icon: "music"
            },
            {
                title: "Forest Morning",
                type: "Soundscape",
                duration: "45 min",
                image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9",
                icon: "music"
            }
        ]
    }
];

function FocusCard({ item }: { item: FocusItem }) {
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
                        {item.icon === 'music' ? (
                            <Music className="h-3 w-3" />
                        ) : (
                            <Clock className="h-3 w-3" />
                        )}
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

export default function Focus() {
    return (
        <AppLayout>
            <Head title="Focus" />
            <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-8 pb-20">
                    {/* Featured Section */}
                    <section>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Focus</h1>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredItems.map((item, index) => (
                                <FocusCard key={index} item={item} />
                            ))}
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
                                    <FocusCard key={itemIndex} item={item} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </ScrollArea>
        </AppLayout>
    );
}
