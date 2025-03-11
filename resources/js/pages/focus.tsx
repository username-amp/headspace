import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { Clock, Music, PlayCircle, PauseCircle, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import cn from 'classnames';
import { usePage } from '@inertiajs/react';

interface FocusItem {
    id: number;
    title: string;
    type: string;
    duration: string;
    image?: string;
    audio_url: string;
    icon?: 'music' | 'meditation';
}

interface FocusSection {
    title: string;
    description?: string;
    items: FocusItem[];
}

interface Props {
    featuredItems: FocusItem[];
    sections: FocusSection[];
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

    useEffect(() => {
        if (currentTrack && audioRef.current) {
            audioRef.current.play();
            setIsPlaying(true);
        }
    }, [currentTrack]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
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

    if (!currentTrack) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t">
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
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                            <Music className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-medium">{currentTrack.title}</h3>
                            <p className="text-sm text-muted-foreground">{currentTrack.type}</p>
                        </div>
                    </div>
                    
                    {/* Time */}
                    <div className="text-sm text-muted-foreground">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col space-y-4">
                    {/* Progress Bar */}
                    <Slider
                        value={[progress]}
                        onValueChange={handleProgressChange}
                        max={100}
                        step={0.1}
                        className="w-full"
                    />

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            {/* Volume Control */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-primary/10 hover:text-primary"
                                onClick={toggleMute}
                            >
                                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </Button>
                            <Slider
                                value={[volume]}
                                onValueChange={handleVolumeChange}
                                max={1}
                                step={0.01}
                                className="w-24"
                            />
                        </div>

                        {/* Playback Controls */}
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-primary/10 hover:text-primary"
                                onClick={onPrevious}
                            >
                                <SkipBack className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-12 w-12 rounded-full hover:bg-primary/10 hover:text-primary"
                                onClick={togglePlay}
                            >
                                {isPlaying ? (
                                    <PauseCircle className="h-8 w-8" />
                                ) : (
                                    <PlayCircle className="h-8 w-8" />
                                )}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-primary/10 hover:text-primary"
                                onClick={onNext}
                            >
                                <SkipForward className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Repeat Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "hover:bg-primary/10 hover:text-primary",
                                isLooping && "text-primary bg-primary/10"
                            )}
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

function FocusItem({ item }: { item: FocusItem }) {
    return (
        <Link
            href={`/music?track=${item.id}`}
            preserveScroll
            className="group relative aspect-square overflow-hidden rounded-xl border bg-muted/30"
        >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/50 to-transparent" />
            <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 z-20 p-4">
                <h3 className="font-medium text-white">{item.title}</h3>
                <p className="text-sm text-white/70">{item.duration} minutes</p>
            </div>
            <div className="absolute right-4 top-4 z-20">
                <div className="rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                    <div className="flex items-center space-x-1">
                        <Music className="h-5 w-5 text-white" />
                        <span className="text-xs text-white">Open Player</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

function FocusCard({ item, onClick }: { item: FocusItem; onClick: () => void }) {
    return (
        <Card 
            className={`group relative overflow-hidden cursor-pointer ${item.image ? 'p-0' : 'p-4'}`}
            onClick={onClick}
        >
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
                        {item.icon === 'music' ? <Music className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        <span>{item.duration}</span>
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity group-hover:opacity-100">
                    <PlayCircle className="h-12 w-12 text-white" />
                </div>
            </div>
        </Card>
    );
}

export default function Focus({ featuredItems, sections }: Props) {
    const [currentTrack, setCurrentTrack] = useState<FocusItem | null>(null);
    const [playlist, setPlaylist] = useState<FocusItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    const handleTrackSelect = (item: FocusItem, allTracks: FocusItem[]) => {
        setPlaylist(allTracks);
        const index = allTracks.findIndex(track => track.id === item.id);
        setCurrentIndex(index);
        setCurrentTrack(item);
    };

    const handleNext = () => {
        if (currentIndex < playlist.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setCurrentTrack(playlist[nextIndex]);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            setCurrentIndex(prevIndex);
            setCurrentTrack(playlist[prevIndex]);
        }
    };

    return (
        <AppLayout>
            <Head title="Focus" />
            <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="space-y-8 pb-32">
                    {/* Featured Section */}
                    <section>
                        <h1 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">Focus</h1>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {featuredItems.map((item, index) => (
                                <FocusItem 
                                    key={index} 
                                    item={item} 
                                />
                            ))}
                        </div>
                    </section>

                    {/* Other Sections */}
                    {sections.map((section, index) => (
                        <section key={index}>
                            <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">{section.title}</h2>
                            {section.description && <p className="mb-4 text-slate-600 dark:text-slate-400">{section.description}</p>}
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {section.items.map((item, itemIndex) => (
                                    <FocusItem 
                                        key={itemIndex} 
                                        item={item} 
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </ScrollArea>

            <AudioPlayer 
                currentTrack={currentTrack}
                onNext={handleNext}
                onPrevious={handlePrevious}
            />
        </AppLayout>
    );
}
