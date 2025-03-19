import InputLabel from '@/components/input-label';
import PrimaryButton from '@/components/primary-button';
import SelectInput from '@/components/select-input';
import TextInput from '@/components/text-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { router, useForm } from '@inertiajs/react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import axios, { AxiosError, AxiosResponse } from 'axios';
import React, { useState } from 'react';

type FormData = {
    title: string;
    description: string;
    section: string;
    category: string;
    duration: string;
    video: File | null;
    image: File | null;
    is_featured: boolean;
};

type ChunkResponse = {
    message: string;
    path?: string;
};

export const MeditationForm: React.FC = () => {
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoDuration, setVideoDuration] = useState<string>('');
    const [uploadStats, setUploadStats] = useState<{
        currentChunk: number;
        totalChunks: number;
        uploadSpeed: number;
        timeRemaining: number;
    } | null>(null);
    const [uploadStartTime, setUploadStartTime] = useState<number>(0);
    const { data, setData, processing, errors } = useForm<FormData>({
        title: '',
        description: '',
        section: '',
        category: '',
        duration: '',
        video: null,
        image: null,
        is_featured: false,
    });

    const sections = [
        { value: 'featured', label: 'Featured Meditations' },
        { value: 'today', label: "Today's Meditation" },
        { value: 'new_popular', label: 'New and Popular' },
        { value: 'quick', label: 'Quick Meditations' },
        { value: 'courses', label: 'Courses' },
        { value: 'singles', label: 'Singles' },
    ];

    const formatDuration = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        // Ensure we always have at least 1 minute
        return `${Math.max(1, minutes)} min`;
    };

    const detectVideoDuration = (file: File) => {
        console.log('Starting video duration detection for:', file.name);

        const video = document.createElement('video');
        video.preload = 'metadata';

        // Add error handling
        video.onerror = (e) => {
            console.error('Error loading video:', e);
            // Set a default duration of 1 minute if we can't detect it
            const defaultDuration = formatDuration(60);
            setVideoDuration(defaultDuration);
            setData('duration', defaultDuration);
        };

        video.onloadedmetadata = () => {
            console.log('Video metadata loaded, duration:', video.duration);
            if (video.duration && isFinite(video.duration)) {
                const duration = formatDuration(Math.round(video.duration));
                console.log('Formatted duration:', duration);
                setVideoDuration(duration);
                setData('duration', duration);
            } else {
                console.warn('Invalid duration detected:', video.duration);
                // Set a default duration of 1 minute if we get an invalid duration
                const defaultDuration = formatDuration(60);
                setVideoDuration(defaultDuration);
                setData('duration', defaultDuration);
            }
            window.URL.revokeObjectURL(video.src);
        };

        const videoUrl = URL.createObjectURL(file);
        console.log('Created video URL:', videoUrl);
        video.src = videoUrl;
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
    };

    const formatTime = (seconds: number): string => {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.round(seconds % 60);
        return `${minutes}m ${remainingSeconds}s`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploadStartTime(Date.now());

        try {
            let videoPath = '';
            // First, upload the video file separately
            if (data.video) {
                const chunkSize = 1 * 1024 * 1024; // 1MB chunks
                const totalChunks = Math.ceil(data.video.size / chunkSize);
                setUploadStats({
                    currentChunk: 0,
                    totalChunks,
                    uploadSpeed: 0,
                    timeRemaining: 0,
                });

                const uploadChunk = async (chunk: number, retries = 3): Promise<AxiosResponse<ChunkResponse>> => {
                    try {
                        const start = chunk * chunkSize;
                        const end = Math.min(start + chunkSize, data.video!.size);
                        const videoChunk = data.video!.slice(start, end);

                        const formData = new FormData();
                        formData.append('chunk', videoChunk);
                        formData.append('chunk_number', chunk.toString());
                        formData.append('total_chunks', totalChunks.toString());
                        formData.append('filename', data.video!.name);

                        const response = await axios.post<ChunkResponse>(route('admin.meditations.upload-chunk'), formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'X-Requested-With': 'XMLHttpRequest',
                            },
                            onUploadProgress: (progressEvent) => {
                                if (progressEvent.total) {
                                    const percentComplete = ((chunk + progressEvent.loaded / progressEvent.total) / totalChunks) * 100;
                                    setUploadProgress(Math.round(percentComplete));

                                    // Calculate upload speed and time remaining
                                    const elapsedTime = (Date.now() - uploadStartTime) / 1000; // in seconds
                                    const uploadedBytes = chunk * chunkSize + progressEvent.loaded;
                                    const uploadSpeed = uploadedBytes / elapsedTime; // bytes per second
                                    const remainingBytes = data.video!.size - uploadedBytes;
                                    const timeRemaining = remainingBytes / uploadSpeed;

                                    setUploadStats({
                                        currentChunk: chunk + 1,
                                        totalChunks,
                                        uploadSpeed,
                                        timeRemaining,
                                    });
                                }
                            },
                            timeout: 30000,
                        });
                        return response;
                    } catch (error) {
                        if (retries > 0) {
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                            return uploadChunk(chunk, retries - 1);
                        }
                        throw error;
                    }
                };

                // Upload chunks sequentially with progress tracking
                for (let chunk = 0; chunk < totalChunks; chunk++) {
                    try {
                        const response = await uploadChunk(chunk);
                        if (chunk === totalChunks - 1 && response.data.path) {
                            videoPath = response.data.path;
                        }
                    } catch (error) {
                        const axiosError = error as AxiosError;
                        console.error(`Failed to upload chunk ${chunk}:`, axiosError.message);
                        if (axiosError.response) {
                            console.error('Response:', axiosError.response.data);
                            console.error('Status:', axiosError.response.status);
                        }
                        throw new Error(`Failed to upload chunk ${chunk}: ${axiosError.message}`);
                    }
                }
            }

            // Now submit the rest of the form data
            const formData = new FormData();
            (Object.keys(data) as Array<keyof FormData>).forEach((key) => {
                if (key !== 'video' && data[key] !== null) {
                    if (key === 'is_featured') {
                        formData.append(key, data[key] ? '1' : '0');
                    } else {
                        formData.append(key, data[key] as string | Blob);
                    }
                }
            });

            // Add the video path if we have one
            if (videoPath) {
                formData.append('video_url', videoPath);
            }

            router.post(route('admin.meditations.store'), formData, {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    // Reset form and progress
                    setUploadProgress(0);
                    setVideoDuration('');
                },
                onError: (errors) => {
                    console.error('Form submission errors:', errors);
                    alert('Failed to create meditation: ' + Object.values(errors).join('\n'));
                },
            });
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error('Upload failed:', axiosError);
            alert(`Upload failed: ${axiosError.message}`);
            setUploadProgress(0);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Pick<FormData, 'video' | 'image'>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Show warning if file is too large (1GB = 1024 * 1024 * 1024 bytes)
            if (field === 'video' && file.size > 1024 * 1024 * 1024) {
                alert('Warning: Video file size exceeds 1GB limit');
            }
            setData(field, file);

            // Detect duration if it's a video file
            if (field === 'video') {
                detectVideoDuration(file);
            }
        }
    };

    const handleCheckedChange: CheckboxPrimitive.CheckboxProps['onCheckedChange'] = (checked) => {
        if (checked !== 'indeterminate') {
            setData('is_featured', checked);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-6" encType="multipart/form-data">
            <div>
                <InputLabel htmlFor="title" value="Title" />
                <TextInput
                    id="title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className="mt-1 block w-full"
                    error={errors.title}
                />
            </div>

            <div>
                <InputLabel htmlFor="description" value="Description" />
                <textarea
                    id="description"
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className="focus:ring-opacity-50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                    rows={4}
                />
            </div>

            <div>
                <InputLabel htmlFor="section" value="Section" />
                <SelectInput
                    id="section"
                    value={data.section}
                    onChange={(e) => setData('section', e.target.value)}
                    options={sections}
                    className="mt-1 block w-full"
                    error={errors.section}
                />
            </div>

            <div>
                <InputLabel htmlFor="category" value="Category" />
                <TextInput
                    id="category"
                    type="text"
                    value={data.category}
                    onChange={(e) => setData('category', e.target.value)}
                    className="mt-1 block w-full"
                    error={errors.category}
                />
            </div>

            <div>
                <InputLabel htmlFor="video" value="Video File (MP4, MOV, AVI) - Max 1GB" />
                <input
                    id="video"
                    name="video"
                    type="file"
                    accept="video/mp4,video/mov,video/avi"
                    onChange={(e) => handleFileChange(e, 'video')}
                    className="mt-1 block w-full"
                />
                {errors.video && <p className="mt-1 text-sm text-red-600">{errors.video}</p>}
                {videoDuration && <p className="mt-1 text-sm text-green-600">Detected duration: {videoDuration}</p>}
                {(processing || uploadProgress > 0) && (
                    <div className="mt-4 space-y-4">
                        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-3 flex items-center justify-between text-sm">
                                <span className="font-medium text-gray-700 dark:text-gray-300">Uploading video...</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">{uploadProgress}%</span>
                            </div>
                            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>

                        {uploadStats && (
                            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                                <div className="grid gap-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Chunk Progress:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">
                                            {uploadStats.currentChunk} / {uploadStats.totalChunks}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Upload Speed:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{formatBytes(uploadStats.uploadSpeed)}/s</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Time Remaining:</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{formatTime(uploadStats.timeRemaining)}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                <p className="mt-1 text-sm text-gray-500">Maximum file size: 1GB</p>
            </div>

            <div>
                <InputLabel htmlFor="image" value="Thumbnail Image (JPEG, PNG) - Max 2MB" />
                <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={(e) => handleFileChange(e, 'image')}
                    className="mt-1 block w-full"
                />
                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
                <p className="mt-1 text-sm text-gray-500">Maximum file size: 2MB</p>
            </div>

            <div className="flex items-center">
                <Checkbox
                    id="is_featured"
                    name="is_featured"
                    checked={data.is_featured}
                    onCheckedChange={handleCheckedChange}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />
                <Label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                    Feature this meditation
                </Label>
            </div>

            <div className="flex items-center justify-end">
                <PrimaryButton type="submit" disabled={processing}>
                    {processing ? 'Uploading...' : 'Create Meditation'}
                </PrimaryButton>
            </div>
        </form>
    );
};
