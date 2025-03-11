import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Music, PlayCircle, PauseCircle, Repeat } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface Track {
    id: number;
    title: string;
    type: string;
    duration: number;
    audio_url: string;
}

interface Props {
    tracks: Track[];
    track?: string;
}

export default function MusicPage({ tracks, track }: Props) {
    const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Load track from URL parameter and restore state
    useEffect(() => {
        const savedTrackId = localStorage.getItem('currentTrackId');
        const savedProgress = localStorage.getItem('currentProgress');
        const savedIsPlaying = localStorage.getItem('isPlaying');
        const savedIsLooping = localStorage.getItem('isLooping');

        if (track) {
            const selectedTrack = tracks.find(t => t.id === parseInt(track));
            if (selectedTrack) {
                setCurrentTrack(selectedTrack);
            }
        } else if (savedTrackId) {
            const savedTrack = tracks.find(t => t.id === parseInt(savedTrackId));
            if (savedTrack) {
                setCurrentTrack(savedTrack);
                if (savedProgress) {
                    setProgress(parseFloat(savedProgress));
                }
                if (savedIsPlaying) {
                    setIsPlaying(savedIsPlaying === 'true');
                }
                if (savedIsLooping) {
                    setIsLooping(savedIsLooping === 'true');
                }
            }
        }
    }, [track, tracks]);

    // Save state before page unload or navigation
    useEffect(() => {
        const saveState = () => {
            if (currentTrack) {
                localStorage.setItem('currentTrackId', currentTrack.id.toString());
                localStorage.setItem('currentProgress', progress.toString());
                localStorage.setItem('isPlaying', isPlaying.toString());
                localStorage.setItem('isLooping', isLooping.toString());
            }
        };

        window.addEventListener('beforeunload', saveState);
        window.addEventListener('pagehide', saveState);

        return () => {
            window.removeEventListener('beforeunload', saveState);
            window.removeEventListener('pagehide', saveState);
            saveState(); // Save state when component unmounts
        };
    }, [currentTrack, progress, isPlaying, isLooping]);

    // Handle audio playback
    useEffect(() => {
        if (currentTrack && audioRef.current) {
            if (isPlaying) {
                const playPromise = audioRef.current.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // Autoplay prevented by browser, keep state consistent
                        setIsPlaying(false);
                    });
                }
            } else {
                audioRef.current.pause();
            }
        }
    }, [currentTrack, isPlaying]);

    // Restore playback position
    useEffect(() => {
        if (currentTrack && audioRef.current && progress > 0 && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration)) {
            const time = (progress / 100) * audioRef.current.duration;
            if (isFinite(time)) {
                audioRef.current.currentTime = time;
            }
        }
    }, [currentTrack, duration]);

    const handleTrackClick = (track: Track) => {
        if (currentTrack?.id === track.id) {
            togglePlay();
        } else {
            setCurrentTrack(track);
            setIsPlaying(false);
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
            }
        }
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleRepeat = () => {
        if (audioRef.current) {
            audioRef.current.loop = !isLooping;
            setIsLooping(!isLooping);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            // Restore position after metadata is loaded
            if (progress > 0 && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration)) {
                const time = (progress / 100) * audioRef.current.duration;
                if (isFinite(time)) {
                    audioRef.current.currentTime = time;
                }
            }
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration)) {
            const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            if (isFinite(progress)) {
                setProgress(progress);
                setCurrentTime(audioRef.current.currentTime);
            }
        }
    };

    const handleProgressChange = (value: number[]) => {
        const newProgress = value[0];
        if (audioRef.current && !isNaN(audioRef.current.duration) && isFinite(audioRef.current.duration)) {
            const time = (newProgress / 100) * audioRef.current.duration;
            if (isFinite(time)) {
                audioRef.current.currentTime = time;
                setProgress(newProgress);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <AppLayout>
            <Head title="Music Player" />
            
            <div className="container py-6">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-4xl font-bold">Music Player</h1>
                </div>

                <div className="grid gap-4">
                    {tracks.map((track) => (
                        <div
                            key={track.id}
                            onClick={() => handleTrackClick(track)}
                            className={cn(
                                "p-4 rounded-lg border cursor-pointer transition-colors",
                                "hover:bg-primary/5",
                                currentTrack?.id === track.id && "bg-primary/10 border-primary"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className={cn(
                                        "p-2 rounded-lg",
                                        currentTrack?.id === track.id ? "bg-primary text-primary-foreground" : "bg-muted"
                                    )}>
                                        <Music className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium">{track.title}</h3>
                                        <p className="text-sm text-muted-foreground">{track.type}</p>
                                    </div>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {formatTime(track.duration)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Persistent Player */}
            {currentTrack && (
                <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t">
                    <div className="container mx-auto p-4">
                        <audio
                            ref={audioRef}
                            src={currentTrack.audio_url}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                            loop={isLooping}
                            onEnded={() => !isLooping && setIsPlaying(false)}
                        />
                        
                        {/* Track Info */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
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

                            <div className="flex items-center justify-center space-x-4">
                                {/* Play/Pause Button */}
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
                                    <Repeat className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
