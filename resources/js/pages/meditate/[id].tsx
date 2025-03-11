import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { Clock, ArrowLeft, Tag, PlayCircle, PauseCircle, Volume2, VolumeX } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface MeditationSession {
    id: number;
    title: string;
    description: string;
    type: string;
    category: string;
    duration: string;
    image_url: string;
    video_url: string;
    is_featured: boolean;
}

interface Props {
    meditation: MeditationSession;
    relatedMeditations: MeditationSession[];
}

export default function MeditateDetails({ meditation, relatedMeditations }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(progress);
        }
    };

    return (
        <AppLayout>
            <Head title={meditation.title} />
            <div className="min-h-[calc(100vh-8rem)] p-6">
                {/* Back Button */}
                <Link href={route('meditate')} className="mb-6 inline-flex">
                    <Button variant="ghost" className="gap-2 pl-0 text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Meditations
                    </Button>
                </Link>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Video Player */}
                        <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                            <video
                                ref={videoRef}
                                src={meditation.video_url}
                                poster={meditation.image_url}
                                className="h-full w-full object-contain"
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={() => setIsPlaying(false)}
                            />

                            {/* Video Controls */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-12 w-12 rounded-full text-white hover:bg-white/20 hover:text-white"
                                        onClick={toggleMute}
                                    >
                                        {isMuted ? (
                                            <VolumeX className="h-6 w-6" />
                                        ) : (
                                            <Volume2 className="h-6 w-6" />
                                        )}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-20 w-20 rounded-full text-white hover:bg-white/20 hover:text-white"
                                        onClick={togglePlay}
                                    >
                                        {isPlaying ? (
                                            <PauseCircle className="h-12 w-12" />
                                        ) : (
                                            <PlayCircle className="h-12 w-12" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="absolute bottom-0 left-0 h-1 w-full bg-white/20">
                                <div
                                    className="h-full bg-white transition-all"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Meditation Details */}
                        <div className="mt-6 space-y-4">
                            <h1 className="text-3xl font-bold">{meditation.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{meditation.duration}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Tag className="h-4 w-4" />
                                    <span>{meditation.category}</span>
                                </div>
                            </div>
                            <p className="text-muted-foreground">{meditation.description}</p>
                        </div>
                    </div>

                    {/* Related Meditations */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Related Meditations</h2>
                        <div className="space-y-4">
                            {relatedMeditations.map((item) => (
                                <Link key={item.id} href={route('meditate.details', item.id)}>
                                    <Card className="group overflow-hidden transition-all hover:shadow-lg">
                                        <CardContent className="p-0">
                                            <div className="relative aspect-video">
                                                <img
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover"
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                                    <PlayCircle className="h-12 w-12 text-white" />
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-medium">{item.title}</h3>
                                                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{item.duration}</span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
