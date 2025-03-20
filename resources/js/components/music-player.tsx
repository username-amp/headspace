import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { Music, Pause, Play, Repeat, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Track {
    id: number;
    title: string;
    type: string;
    audio_url: string;
}

interface MusicPlayerProps {
    currentTrack: Track | null;
    onNext: () => void;
    onPrevious: () => void;
}

export default function MusicPlayer({ currentTrack, onNext, onPrevious }: MusicPlayerProps) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLooping, setIsLooping] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying]);

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
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
                        <div className="rounded-lg bg-amber-500/10 p-2">
                            <Music className="h-6 w-6 text-amber-500" />
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
                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" className="hover:bg-amber-500/10 hover:text-amber-500" onClick={onPrevious}>
                                <SkipBack className="h-5 w-5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-amber-500/10 hover:text-amber-500" onClick={togglePlay}>
                                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                            </Button>
                            <Button variant="ghost" size="icon" className="hover:bg-amber-500/10 hover:text-amber-500" onClick={onNext}>
                                <SkipForward className="h-5 w-5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn('hover:bg-amber-500/10 hover:text-amber-500', isLooping && 'bg-amber-500/10 text-amber-500')}
                                onClick={() => setIsLooping(!isLooping)}
                            >
                                <Repeat className="h-5 w-5" />
                            </Button>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="icon" className="hover:bg-amber-500/10 hover:text-amber-500" onClick={toggleMute}>
                                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                            </Button>
                            <div className="w-32">
                                <Slider value={[isMuted ? 0 : volume]} onValueChange={handleVolumeChange} max={1} step={0.1} className="w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
