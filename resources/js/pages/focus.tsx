import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import { Slider } from '@radix-ui/react-slider';
import axios from 'axios';
import { Music, Pause, Play, PlayCircle, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface FocusItem {
    id: number;
    title: string;
    type: string;
    duration: string;
    image: string;
    audio_url: string;
}

interface Props {
    featuredItems: FocusItem[];
    sections: {
        title: string;
        description?: string;
        items: FocusItem[];
    }[];
}

function AudioPlayer({ currentTrack, onNext, onPrevious }: { currentTrack: FocusItem | null; onNext: () => void; onPrevious: () => void }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // Add activity tracking
    const trackActivity = useCallback(
        async (action: string, duration?: number) => {
            if (!currentTrack) return;

            try {
                await axios.post(route('activity.track'), {
                    trackable_type: 'App\\Models\\FocusSession',
                    trackable_id: currentTrack.id,
                    action,
                    duration,
                });
            } catch (error) {
                console.error('Failed to track activity:', error);
            }
        },
        [currentTrack],
    );

    useEffect(() => {
        if (currentTrack && audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
            trackActivity('play');
        }
    }, [currentTrack, trackActivity]);

    useEffect(() => {
        if (isPlaying) {
            trackActivity('play');
        } else {
            trackActivity('pause');
        }
    }, [isPlaying, trackActivity]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                trackActivity('pause', Math.floor(audioRef.current.currentTime));
            } else {
                audioRef.current.play();
                trackActivity('play');
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const toggleRepeat = () => {
        if (audioRef.current) {
            audioRef.current.loop = !isLooping;
            setIsLooping(!isLooping);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(progress);
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleVolumeChange = (value: number[]) => {
        const newVolume = value[0];
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const handleProgressChange = (value: number[]) => {
        const newProgress = value[0];
        if (audioRef.current) {
            const time = (newProgress / 100) * audioRef.current.duration;
            audioRef.current.currentTime = time;
            setProgress(newProgress);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!currentTrack) {
        return null;
    }

    return (
        <div className="bg-background/80 fixed right-0 bottom-0 left-0 border-t backdrop-blur-lg">
            <div className="container mx-auto p-4">
                <audio
                    ref={audioRef}
                    src={currentTrack.audio_url}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    loop={isLooping}
                    onEnded={!isLooping ? onNext : undefined}
                />

                {/* Track Info */}
                <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 text-primary rounded-lg p-2">
                            <Music className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-medium">{currentTrack.title}</h3>
                            <p className="text-muted-foreground text-sm">{currentTrack.type}</p>
                        </div>
                    </div>

                    {/* Time */}
                    <div className="text-muted-foreground text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col space-y-4">
                    {/* Progress Bar */}
                    <Slider value={[progress]} onValueChange={handleProgressChange} max={100} step={0.1} className="w-full" />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {/* Volume Control */}
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" onClick={toggleMute}>
                                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </Button>
                            <Slider value={[volume]} onValueChange={handleVolumeChange} max={1} step={0.01} className="w-24" />
                        </div>

                        {/* Playback Controls */}
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" onClick={onPrevious}>
                                <SkipBack className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-primary/10 hover:text-primary h-12 w-12 rounded-full"
                                onClick={togglePlay}
                            >
                                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary" onClick={onNext}>
                                <SkipForward className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Repeat Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn('hover:bg-primary/10 hover:text-primary', isLooping && 'text-primary bg-primary/10')}
                            onClick={toggleRepeat}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M17 1l4 4-4 4" />
                                <path d="M3 11V9a4 4 0 014-4h14" />
                                <path d="M7 23l-4-4 4-4" />
                                <path d="M21 13v2a4 4 0 01-4 4H3" />
                            </svg>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FocusItem({
    item,
    allItems,
    onSelect,
}: {
    item: FocusItem;
    allItems: FocusItem[];
    onSelect: (item: FocusItem, allItems: FocusItem[]) => void;
}) {
    return (
        <Link
            href={`/music?track=${item.id}`}
            preserveScroll
            onClick={(e) => {
                e.preventDefault();
                onSelect(item, allItems); // 'allItems' is now used in handleTrackSelect
            }}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-black/5 backdrop-blur-sm transition-transform hover:scale-[1.02]"
        >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 to-transparent" />
            <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 z-20 p-4">
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="text-sm text-white/70">{item.duration} minutes</p>
            </div>
            <div className="absolute top-4 right-4 z-20">
                <div className="rounded-full bg-white/10 p-2 backdrop-blur-sm">
                    <Music className="h-5 w-5 text-white" />
                </div>
            </div>
            <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 transform">
                <Button
                    size="icon"
                    className="h-16 w-16 rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all group-hover:opacity-100 hover:scale-110 hover:bg-white/30"
                >
                    <PlayCircle className="h-8 w-8 text-white" />
                </Button>
            </div>
        </Link>
    );
}

function EmptyState() {
    return (
        <div className="flex h-[60vh] flex-col items-center justify-center text-center">
            <div className="relative mb-6">
                <div className="absolute inset-0 animate-pulse rounded-full bg-amber-500/20 blur-xl" />
                <div className="relative rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 p-4">
                    <Music className="h-12 w-12 text-white" />
                </div>
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-slate-900 dark:text-white">Finding Your Focus...</h2>
            <p className="mb-6 max-w-md text-slate-600 dark:text-slate-400">
                We're preparing some amazing focus sessions for you. Check back soon for a journey into deep concentration and productivity.
            </p>
            <div className="flex space-x-4">
                <div className="h-2 w-2 animate-bounce rounded-full bg-amber-500 [animation-delay:-0.3s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-amber-500 [animation-delay:-0.15s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-amber-500" />
            </div>
        </div>
    );
}

export default function Focus({ featuredItems, sections }: Props) {
    const [currentTrack, setCurrentTrack] = useState<FocusItem | null>(null);
    const [allItems, setAllItems] = useState<FocusItem[]>([]);

    useEffect(() => {
        // Combine all items into a single array for playlist functionality
        const items = [...featuredItems];
        sections.forEach((section) => {
            items.push(...section.items);
        });
        setAllItems(items);
    }, [featuredItems, sections]);

    const handleTrackSelect = (track: FocusItem, items: FocusItem[]) => {
        setAllItems(items);
        setCurrentTrack(track);
    };

    const handleNext = () => {
        if (!currentTrack || !allItems.length) return;
        const currentIndex = allItems.findIndex((item) => item.id === currentTrack.id);
        const nextIndex = (currentIndex + 1) % allItems.length;
        setCurrentTrack(allItems[nextIndex]);
    };

    const handlePrevious = () => {
        if (!currentTrack || !allItems.length) return;
        const currentIndex = allItems.findIndex((item) => item.id === currentTrack.id);
        const previousIndex = (currentIndex - 1 + allItems.length) % allItems.length;
        setCurrentTrack(allItems[previousIndex]);
    };

    if (allItems.length === 0) {
        return (
            <AppLayout>
                <Head title="Focus" />
                <EmptyState />
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <Head title="Focus" />
            <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-8 pb-20">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-600 p-8 text-white">
                        <div className="relative z-10">
                            <h1 className="text-3xl font-bold">Focus Mode</h1>
                            <p className="mt-2 text-white/90">Enhance your concentration with curated ambient sounds</p>
                            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {featuredItems.map((item, index) => (
                                    <FocusItem key={index} item={item} allItems={allItems} onSelect={handleTrackSelect} />
                                ))}
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white/10 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-yellow-300/20 blur-2xl" />
                    </section>

                    {/* Other Sections */}
                    {sections.map((section, index) => (
                        <section key={index} className="relative">
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{section.title}</h2>
                                {section.description && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{section.description}</p>}
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {section.items.map((item, itemIndex) => (
                                    <FocusItem key={itemIndex} item={item} allItems={allItems} onSelect={handleTrackSelect} />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </ScrollArea>

            <AudioPlayer currentTrack={currentTrack} onNext={handleNext} onPrevious={handlePrevious} />
        </AppLayout>
    );
}
