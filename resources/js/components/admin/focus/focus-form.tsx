import InputLabel from '@/components/input-label';
import PrimaryButton from '@/components/primary-button';
import SelectInput from '@/components/select-input';
import TextInput from '@/components/text-input';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

type FormData = {
    title: string;
    description: string;
    type: string;
    section: string;
    category: string;
    duration: string;
    audio: File | null;
    audio_path?: string;
    image: File | null;
    is_featured: boolean;
};

type ChunkResponse = {
    message: string;
    path?: string;
};

export const FocusForm: React.FC = () => {
    const { data, setData, errors, processing } = useForm<FormData>({
        title: '',
        description: '',
        type: '',
        section: '',
        category: '',
        duration: '',
        audio: null,
        image: null,
        is_featured: false,
    });

    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const types = [
        { value: 'binaural', label: 'Binaural Beats' },
        { value: 'music', label: 'Focus Music' },
        { value: 'soundscape', label: 'Nature Soundscape' },
    ];

    const sections = [
        { value: 'featured', label: 'Featured' },
        { value: 'binaural_beats', label: 'Binaural Beats' },
        { value: 'focus_music', label: 'Focus Music' },
        { value: 'soundscapes', label: 'Soundscapes' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);
        console.log('Form submission started', { formData: data });

        try {
            if (data.audio) {
                console.log('Starting audio upload process', {
                    fileName: data.audio.name,
                    fileSize: data.audio.size,
                });

                const chunkSize = 1024 * 1024; // 1MB chunks
                const chunks = Math.ceil(data.audio.size / chunkSize);
                console.log('Chunk configuration', { chunkSize, totalChunks: chunks });
                let uploadedPath = '';

                const uploadChunk = async (chunk: number, retries = 3): Promise<ChunkResponse> => {
                    try {
                        const start = chunk * chunkSize;
                        const end = Math.min(start + chunkSize, data.audio!.size);
                        console.log('Uploading chunk', {
                            chunkNumber: chunk,
                            start,
                            end,
                            size: end - start,
                        });

                        const chunkBlob = data.audio!.slice(start, end);

                        const formData = new FormData();
                        formData.append('chunk', chunkBlob);
                        formData.append('chunk_number', chunk.toString());
                        formData.append('total_chunks', chunks.toString());
                        formData.append('filename', data.audio!.name);

                        const response = await axios.post<ChunkResponse>(route('admin.focus.upload-chunk'), formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                Accept: 'application/json',
                            },
                            onUploadProgress: (progressEvent) => {
                                const percentCompleteForChunk = (progressEvent.loaded / progressEvent.total!) * 100;
                                const overallProgress = (chunk * 100 + percentCompleteForChunk) / chunks;
                                setUploadProgress(Math.round(overallProgress));
                                console.log('Upload progress', {
                                    chunkProgress: percentCompleteForChunk,
                                    overallProgress: Math.round(overallProgress),
                                });
                            },
                        });

                        console.log('Chunk upload response', response.data);
                        return response.data;
                    } catch (error) {
                        console.error('Chunk upload error', {
                            chunk,
                            retries,
                            error: axios.isAxiosError(error)
                                ? {
                                      status: error.response?.status,
                                      message: error.message,
                                      data: error.response?.data,
                                  }
                                : error,
                        });

                        if (retries > 0 && axios.isAxiosError(error) && error.response?.status === 413) {
                            console.log('Retrying chunk upload after delay');
                            await new Promise((resolve) => setTimeout(resolve, 1000));
                            return uploadChunk(chunk, retries - 1);
                        }
                        throw error;
                    }
                };

                // Upload chunks sequentially
                for (let i = 0; i < chunks; i++) {
                    try {
                        const response = await uploadChunk(i);
                        if (response.path) {
                            uploadedPath = response.path;
                            console.log('Received file path from server', { uploadedPath });
                        }
                        toast.info(`Uploading: ${Math.round(((i + 1) / chunks) * 100)}%`, {
                            description: `Chunk ${i + 1} of ${chunks}`,
                        });
                    } catch (error) {
                        console.error('Failed to upload chunk', {
                            chunkNumber: i,
                            error: axios.isAxiosError(error)
                                ? {
                                      status: error.response?.status,
                                      message: error.message,
                                      data: error.response?.data,
                                  }
                                : error,
                        });
                        if (axios.isAxiosError(error) && error.response?.status === 413) {
                            toast.error('Upload failed: File chunk too large');
                        } else {
                            toast.error(`Upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
                        }
                        setUploadProgress(0);
                        setIsUploading(false);
                        return;
                    }
                }

                console.log('All chunks uploaded successfully');

                // After successful upload, submit the form with the file path
                try {
                    const submitFormData = new FormData();

                    // Add all text fields
                    submitFormData.append('title', data.title);
                    submitFormData.append('description', data.description);
                    submitFormData.append('type', data.type);
                    submitFormData.append('section', data.section);
                    submitFormData.append('category', data.category);
                    submitFormData.append('duration', data.duration);
                    submitFormData.append('is_featured', data.is_featured ? '1' : '0');
                    submitFormData.append('audio_path', uploadedPath);

                    // Only append image if it exists
                    if (data.image) {
                        submitFormData.append('image', data.image);
                    }

                    console.log('Submitting final form', {
                        entries: Array.from(submitFormData.entries()).map(([key, value]) => ({
                            key,
                            value: value instanceof File ? `File: ${value.name}` : value,
                        })),
                    });

                    await axios.post(route('admin.focus.store'), submitFormData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Accept: 'application/json',
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    });

                    console.log('Form submitted successfully');
                    toast.success('Focus audio created successfully');

                    // Reset form state
                    setUploadProgress(0);
                    setIsUploading(false);

                    // Redirect to index page
                    window.location.href = route('admin.focus.index');
                } catch (error) {
                    console.error('Form submission failed', {
                        error: axios.isAxiosError(error)
                            ? {
                                  status: error.response?.status,
                                  message: error.message,
                                  data: error.response?.data,
                              }
                            : error,
                    });
                    throw error;
                }
            }
        } catch (error) {
            console.error('Form submission error', {
                error: axios.isAxiosError(error)
                    ? {
                          status: error.response?.status,
                          message: error.message,
                          data: error.response?.data,
                      }
                    : error,
            });
            toast.error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setUploadProgress(0);
            setIsUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Pick<FormData, 'audio' | 'image'>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (field === 'audio' && file.size > 500 * 1024 * 1024) {
                toast.error('Audio file size exceeds 500MB limit');
                e.target.value = '';
                return;
            }
            if (field === 'image' && file.size > 2 * 1024 * 1024) {
                toast.error('Image file size exceeds 2MB limit');
                e.target.value = '';
                return;
            }
            setData(field, file);
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
                <InputLabel htmlFor="type" value="Content Type" />
                <SelectInput
                    id="type"
                    value={data.type}
                    onChange={(e) => setData('type', e.target.value)}
                    options={types}
                    className="mt-1 block w-full"
                    error={errors.type}
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
                <InputLabel htmlFor="audio" value="Audio File (MP3, WAV, OGG) - Max 500MB" />
                <input
                    id="audio"
                    name="audio"
                    type="file"
                    accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg"
                    onChange={(e) => handleFileChange(e, 'audio')}
                    className="mt-1 block w-full"
                />
                {errors.audio && <p className="mt-1 text-sm text-red-600">{errors.audio}</p>}
                {uploadProgress > 0 && (
                    <div className="mt-2">
                        <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                                className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="mt-1 text-sm text-gray-600">Uploading: {uploadProgress}%</p>
                    </div>
                )}
                <p className="mt-1 text-sm text-gray-500">Maximum file size: 500MB</p>
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

            <div className="flex items-center justify-end">
                <PrimaryButton type="submit" disabled={processing || isUploading}>
                    {(processing || isUploading) && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                    Create Focus Content
                </PrimaryButton>
            </div>
        </form>
    );
};
