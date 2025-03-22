import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Modal from '@/components/ui/modal';
import { Slider } from '@/components/ui/slider';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import axios, { AxiosError } from 'axios';
import { ArrowLeft, Clock, Flower2, Forward, Heart, Pause, Play, Rewind, Tag, Volume2, VolumeX } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface MeditationSession {
    id: number;
    title: string;
    description: string;
    type: string;
    category: string;
    duration: string;
    image_url: string;
    video_url?: string;
    is_featured: boolean;
}

interface Props {
    meditation: MeditationSession;
    relatedMeditations: MeditationSession[];
}

// Add these interfaces for the new features
interface PreMeditationAssessment {
    moodRating: number;
    physicalSymptoms: string[];
}

interface PostMeditationAssessment {
    moodRating: number;
    reflections: string;
}

export default function MeditateDetails({ meditation, relatedMeditations }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [showPreModal, setShowPreModal] = useState(true);
    const [showPostModal, setShowPostModal] = useState(false);

    // State for pre-meditation assessment
    const [preAssessment, setPreAssessment] = useState<PreMeditationAssessment>({
        moodRating: 3,
        physicalSymptoms: [],
    });

    // State for post-meditation assessment
    const [postAssessment, setPostAssessment] = useState<PostMeditationAssessment>({
        moodRating: 3,
        reflections: '',
    });

    // Add activity tracking
    const trackActivity = useCallback(
        async (action: string, duration?: number) => {
            const payload = {
                trackable_type: 'App\\Models\\MeditationSession',
                trackable_id: meditation.id,
                action,
                // Always include duration for pause action, default to 0 if not provided
                ...(action === 'pause' ? { duration: duration || 0 } : duration ? { duration } : {}),
            };
            console.log('Activity Tracking Payload:', payload);
            console.log('Activity Tracking URL:', route('activity.track'));
            try {
                const response = await axios.post(route('activity.track'), payload);
                console.log('Activity Tracking Response:', response.data);
            } catch (error: unknown) {
                if (error instanceof AxiosError) {
                    console.error('Failed to track activity:', error);
                    console.error('Error response:', error.response?.data);
                }
            }
        },
        [meditation.id],
    );

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            const handleDuration = () => setDuration(video.duration);
            video.addEventListener('loadedmetadata', handleDuration);
            return () => video.removeEventListener('loadedmetadata', handleDuration);
        }
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.currentTime = 0;
        }
    }, []);

    useEffect(() => {
        if (isPlaying) {
            trackActivity('play');
        } else {
            trackActivity('pause');
        }
    }, [isPlaying, trackActivity]);

    // Track view on component mount
    useEffect(() => {
        trackActivity('view');
        // We can safely ignore the trackActivity dependency here since we only want this to run once
        // and meditation.id won't change during the component's lifecycle
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                // Only track pause if we've watched some content
                if (videoRef.current.currentTime > 0) {
                    trackActivity('pause', Math.floor(videoRef.current.currentTime));
                }
            } else {
                videoRef.current.play();
                trackActivity('play');
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

    const handleVolumeChange = (value: number[]) => {
        const newVolume = value[0];
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(progress);
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleProgressChange = (value: number[]) => {
        if (videoRef.current) {
            const newTime = (value[0] / 100) * videoRef.current.duration;
            videoRef.current.currentTime = newTime;
            setProgress(value[0]);
        }
    };

    const handleSkip = (seconds: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime += seconds;
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Handle changes for pre-meditation assessment
    const handlePreAssessmentChange = (field: keyof PreMeditationAssessment, value: string[] | number) => {
        setPreAssessment((prev) => ({ ...prev, [field]: value }));
    };

    // Handle changes for post-meditation assessment
    const handlePostAssessmentChange = (field: keyof PostMeditationAssessment, value: string | number) => {
        setPostAssessment((prev) => ({ ...prev, [field]: value }));
    };

    const handlePreAssessmentSubmit = () => {
        // Save pre-meditation assessment
        axios
            .post(route('mood-assessments.store'), {
                meditation_session_id: meditation.id,
                assessment_type: 'pre',
                mood_rating: preAssessment.moodRating,
                physical_symptoms: preAssessment.physicalSymptoms,
            })
            .then(() => {
                setShowPreModal(false);
                if (videoRef.current) {
                    videoRef.current.play();
                    setIsPlaying(true);
                }
            })
            .catch((error) => {
                console.error('Failed to save pre-assessment:', error);
                setShowPreModal(false);
                if (videoRef.current) {
                    videoRef.current.play();
                    setIsPlaying(true);
                }
            });
    };

    const handlePostAssessmentSubmit = () => {
        // Save post-meditation assessment
        axios
            .post(route('mood-assessments.store'), {
                meditation_session_id: meditation.id,
                assessment_type: 'post',
                mood_rating: postAssessment.moodRating,
                reflections: postAssessment.reflections,
            })
            .then(() => {
                setShowPostModal(false);
            })
            .catch((error) => {
                console.error('Failed to save post-assessment:', error);
                setShowPostModal(false);
            });
    };

    const handleVideoEnd = useCallback(() => {
        if (videoRef.current && Math.abs(videoRef.current.currentTime - videoRef.current.duration) < 1) {
            setIsPlaying(false);
            // Track completion when video ends
            trackActivity('complete', Math.floor(videoRef.current.duration));
            setShowPostModal(true);
        }
    }, [trackActivity]);

    useEffect(() => {
        const video = videoRef.current;
        if (video) {
            video.addEventListener('ended', handleVideoEnd);
            return () => video.removeEventListener('ended', handleVideoEnd);
        }
    }, [handleVideoEnd]);

    return (
        <AppLayout>
            <Head title={meditation.title} />
            <div className="relative min-h-[calc(100vh-4rem)]">
                {/* Background Gradient */}
                <div className="from-background to-background/50 absolute inset-0 bg-gradient-to-b" />

                <div className="relative space-y-8 p-6">
                    {/* Header Section */}
                    <div className="flex items-center justify-between">
                        <Link href={route('meditate')} className="group inline-flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                            </Button>
                            <span className="text-sm font-medium">Back to Meditations</span>
                        </Link>
                        <Button variant="ghost" size="icon" className="group h-8 w-8" onClick={() => setIsLiked(!isLiked)}>
                            <Heart className={`h-4 w-4 transition-colors ${isLiked ? 'fill-rose-500 text-rose-500' : 'group-hover:text-rose-500'}`} />
                        </Button>
                    </div>

                    {/* Pre-Meditation Modal */}
                    {showPreModal && (
                        <Modal isOpen={showPreModal} onClose={() => setShowPreModal(false)}>
                            <h2>How are you feeling?</h2>
                            <div className="modal-content space-y-6">
                                {/* Mood Rating */}
                                <div>
                                    <label>Rate your current mood</label>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-sm text-white/60">
                                            <span>Low</span>
                                            <span>High</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-4">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <button
                                                    key={rating}
                                                    onClick={() => handlePreAssessmentChange('moodRating', rating)}
                                                    className={`relative rounded-full p-3 transition-all hover:scale-110 ${
                                                        preAssessment.moodRating === rating
                                                            ? 'scale-110 bg-amber-500/20 text-amber-500 ring-2 ring-amber-500'
                                                            : 'text-gray-400 hover:text-gray-300'
                                                    }`}
                                                >
                                                    <div className="relative">
                                                        {rating === 1 && '😢'}
                                                        {rating === 2 && '😕'}
                                                        {rating === 3 && '😐'}
                                                        {rating === 4 && '🙂'}
                                                        {rating === 5 && '😊'}
                                                        <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium text-white/60">
                                                            {rating * 20}%
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Physical Symptoms */}
                                <div>
                                    <label>Any physical sensations?</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Tension', 'Fatigue', 'Pain', 'Restlessness', 'Comfort', 'Lightness'].map((symptom) => (
                                            <button
                                                key={symptom.toLowerCase()}
                                                type="button"
                                                onClick={() =>
                                                    handlePreAssessmentChange(
                                                        'physicalSymptoms',
                                                        preAssessment.physicalSymptoms.includes(symptom.toLowerCase())
                                                            ? preAssessment.physicalSymptoms.filter((s) => s !== symptom.toLowerCase())
                                                            : [...preAssessment.physicalSymptoms, symptom.toLowerCase()],
                                                    )
                                                }
                                                className={`relative overflow-hidden rounded-xl border p-2.5 text-sm font-medium transition-all duration-200 ${
                                                    preAssessment.physicalSymptoms.includes(symptom.toLowerCase())
                                                        ? 'border-amber-500 bg-amber-500/10 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)] ring-2 ring-amber-500'
                                                        : 'border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:ring-1 hover:ring-amber-500/50'
                                                }`}
                                            >
                                                {preAssessment.physicalSymptoms.includes(symptom.toLowerCase()) && (
                                                    <div className="animate-gradient absolute inset-0 bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/20" />
                                                )}
                                                <span className="relative">{symptom}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={handlePreAssessmentSubmit} className="mt-6 flex w-full items-center justify-center gap-2">
                                    Begin Meditation
                                </button>
                            </div>
                        </Modal>
                    )}

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Content */}
                        <div className="space-y-6 lg:col-span-2">
                            {/* Video Player */}
                            <div
                                className="group relative aspect-video overflow-hidden rounded-2xl bg-black shadow-2xl"
                                onMouseEnter={() => setShowControls(true)}
                                onMouseLeave={() => setShowControls(false)}
                            >
                                {meditation.video_url ? (
                                    <video
                                        ref={videoRef}
                                        src={meditation.video_url}
                                        poster={meditation.image_url}
                                        className="h-full w-full object-contain"
                                        onTimeUpdate={handleTimeUpdate}
                                        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                                        onEnded={handleVideoEnd}
                                    />
                                ) : (
                                    <div className="relative h-full w-full">
                                        <img src={meditation.image_url} alt={meditation.title} className="h-full w-full object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                            <p className="text-center text-white">
                                                This meditation session is currently image-only.
                                                <br />
                                                Video content coming soon!
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Video Controls - Only show if video is available */}
                                {meditation.video_url && (
                                    <div
                                        className={`absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 transition-opacity duration-300 ${
                                            showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
                                        }`}
                                    >
                                        {/* Progress Bar */}
                                        <div className="mb-4">
                                            <Slider
                                                value={[progress]}
                                                onValueChange={handleProgressChange}
                                                max={100}
                                                step={0.1}
                                                className="cursor-pointer"
                                            />
                                            <div className="mt-2 flex justify-between text-xs text-white/80">
                                                <span>{formatTime(currentTime)}</span>
                                                <span>{formatTime(duration)}</span>
                                            </div>
                                        </div>

                                        {/* Control Buttons */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-white hover:bg-white/20"
                                                    onClick={() => handleSkip(-10)}
                                                >
                                                    <Rewind className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-12 w-12 rounded-full bg-white/10 text-white backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/20"
                                                    onClick={togglePlay}
                                                >
                                                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-white hover:bg-white/20"
                                                    onClick={() => handleSkip(10)}
                                                >
                                                    <Forward className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-white hover:bg-white/20"
                                                    onClick={toggleMute}
                                                >
                                                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                                </Button>
                                                <div className="w-24">
                                                    <Slider
                                                        value={[isMuted ? 0 : volume]}
                                                        onValueChange={handleVolumeChange}
                                                        max={1}
                                                        step={0.1}
                                                        className="cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Meditation Details */}
                            <div className="space-y-6">
                                <div>
                                    <h1 className="text-3xl font-bold">{meditation.title}</h1>
                                    <div className="mt-3 flex flex-wrap items-center gap-4">
                                        <div className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium">
                                            <Clock className="h-4 w-4" />
                                            {meditation.duration}
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 px-3 py-1 text-sm font-medium text-violet-500">
                                            <Tag className="h-4 w-4" />
                                            {meditation.category}
                                        </div>
                                        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-500">
                                            <Flower2 className="h-4 w-4" />
                                            {meditation.type}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">{meditation.description}</p>
                            </div>
                        </div>

                        {/* Related Meditations */}
                        <div className="space-y-4">
                            <h2 className="flex items-center gap-2 text-xl font-semibold">
                                <div className="rounded-lg bg-violet-500/10 p-1.5">
                                    <Flower2 className="h-5 w-5 text-violet-500" />
                                </div>
                                Similar Sessions
                            </h2>
                            <div className="grid gap-4">
                                {relatedMeditations.map((item) => (
                                    <Link key={item.id} href={route('meditate.details', item.id)}>
                                        <Card className="group hover:ring-offset-background overflow-hidden transition-all hover:ring-2 hover:ring-violet-500/30 hover:ring-offset-2">
                                            <CardContent className="p-0">
                                                <div className="relative aspect-video">
                                                    <img
                                                        src={item.image_url}
                                                        alt={item.title}
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                                                        <Play className="h-8 w-8 text-white" />
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-medium group-hover:text-violet-500">{item.title}</h3>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/10 px-2 py-0.5 text-xs font-medium text-violet-500">
                                                            <Clock className="h-3 w-3" />
                                                            {item.duration}
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
                                                            <Tag className="h-3 w-3" />
                                                            {item.category}
                                                        </span>
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

                {/* Post-Meditation Modal */}
                {showPostModal && (
                    <Modal isOpen={showPostModal} onClose={() => setShowPostModal(false)}>
                        <h2>How do you feel now?</h2>
                        <div className="modal-content space-y-6">
                            {/* Mood Rating */}
                            <div>
                                <label>Rate your mood after meditation</label>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm text-white/60">
                                        <span>Low</span>
                                        <span>High</span>
                                    </div>
                                    <div className="flex items-center justify-center gap-4">
                                        {[1, 2, 3, 4, 5].map((rating) => (
                                            <button
                                                key={rating}
                                                onClick={() => handlePostAssessmentChange('moodRating', rating)}
                                                className={`relative rounded-full p-3 transition-all hover:scale-110 ${
                                                    postAssessment.moodRating === rating
                                                        ? 'scale-110 bg-amber-500/20 text-amber-500 ring-2 ring-amber-500'
                                                        : 'text-gray-400 hover:text-gray-300'
                                                }`}
                                            >
                                                <div className="relative">
                                                    {rating === 1 && '😢'}
                                                    {rating === 2 && '😕'}
                                                    {rating === 3 && '😐'}
                                                    {rating === 4 && '🙂'}
                                                    {rating === 5 && '😊'}
                                                    <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-medium text-white/60">
                                                        {rating * 20}%
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Reflections */}
                            <div>
                                <label>Share your thoughts about this session</label>
                                <textarea
                                    value={postAssessment.reflections}
                                    onChange={(e) => handlePostAssessmentChange('reflections', e.target.value)}
                                    placeholder="How was your meditation experience? Any notable moments or realizations?"
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>

                            <button onClick={handlePostAssessmentSubmit} className="mt-6 flex w-full items-center justify-center gap-2">
                                Complete Session
                            </button>
                        </div>
                    </Modal>
                )}
            </div>
        </AppLayout>
    );
}
