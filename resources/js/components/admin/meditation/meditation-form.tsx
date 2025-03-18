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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let videoPath = '';
            // First, upload the video file separately
            if (data.video) {
                const chunkSize = 1 * 1024 * 1024; // 1MB chunks
                const totalChunks = Math.ceil(data.video.size / chunkSize);

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
            // Show warning if file is too large
            if (field === 'video' && file.size > 100 * 1024 * 1024) {
                alert('Warning: Video file size exceeds 100MB limit');
            }
            setData(field, file);
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
                <InputLabel htmlFor="duration" value="Duration (minutes)" />
                <TextInput
                    id="duration"
                    type="text"
                    value={data.duration}
                    onChange={(e) => setData('duration', e.target.value)}
                    className="mt-1 block w-full"
                    error={errors.duration}
                />
            </div>

            <div>
                <InputLabel htmlFor="video" value="Video File (MP4, MOV, AVI) - Max 100MB" />
                <input
                    id="video"
                    name="video"
                    type="file"
                    accept="video/mp4,video/mov,video/avi"
                    onChange={(e) => handleFileChange(e, 'video')}
                    className="mt-1 block w-full"
                />
                {errors.video && <p className="mt-1 text-sm text-red-600">{errors.video}</p>}
                <p className="mt-1 text-sm text-gray-500">Maximum file size: 100MB</p>
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

            {processing && uploadProgress > 0 && (
                <div className="mt-4 h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div className="h-2.5 rounded-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                    <p className="mt-1 text-sm text-gray-600">Uploading: {uploadProgress}%</p>
                </div>
            )}

            <div className="flex items-center justify-end">
                <PrimaryButton type="submit" disabled={processing}>
                    {processing ? 'Uploading...' : 'Create Meditation'}
                </PrimaryButton>
            </div>
        </form>
    );
};
