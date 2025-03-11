import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Clock, PlayCircle } from 'lucide-react';

interface MeditationItem {
    id: number;
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

interface Props {
    featuredMeditations: MeditationItem[];
    todaysMeditation: MeditationItem;
    sections: MeditationSection[];
}

function MeditationCard({ item }: { item: MeditationItem }) {
    return (
        <Link href={route('meditate.details', item.id)} className="block">
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
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-white/80">
                        <span>{item.type}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{item.duration}</span>
                        </div>
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                        <PlayCircle className="h-12 w-12 text-white" />
                    </div>
                </div>
            </Card>
        </Link>
    );
}

export default function Meditate({ featuredMeditations, todaysMeditation, sections }: Props) {
    return (
        <AppLayout>
            <Head title="Meditate" />
            <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-8 pb-20">
                    {/* Featured Section */}
                    <section>
                        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Meditate</h1>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredMeditations.map((item, index) => (
                                <MeditationCard key={index} item={item} />
                            ))}
                        </div>
                    </section>

                    {/* Today's Meditation */}
                    {todaysMeditation && (
                        <section>
                            <h2 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Today's Meditation</h2>
                            <div className="max-w-2xl">
                                <MeditationCard item={todaysMeditation} />
                            </div>
                        </section>
                    )}

                    {/* Other Sections */}
                    {sections.map((section, index) => (
                        <section key={index}>
                            <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">{section.title}</h2>
                            {section.description && <p className="mb-4 text-slate-600 dark:text-slate-400">{section.description}</p>}
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
