import InputLabel from '@/components/input-label';
import PrimaryButton from '@/components/primary-button';
import SelectInput from '@/components/select-input';
import TextInput from '@/components/text-input';
import { useForm } from '@inertiajs/react';
import React from 'react';

type FormData = {
    title: string;
    description: string;
    type: string;
    section: string;
    category: string;
    duration: string;
    audio: File | null;
    image: File | null;
    is_featured: boolean;
};

export const FocusForm: React.FC = () => {
    const { data, setData, post, processing, errors } = useForm<FormData>({
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.focus.store'), {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Pick<FormData, 'audio' | 'image'>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Show warning if file is too large
            if (field === 'audio' && file.size > 500 * 1024 * 1024) {
                // 500MB warning
                alert('Warning: Audio file size exceeds 500MB limit');
            }
            if (field === 'image' && file.size > 2 * 1024 * 1024) {
                // 2MB warning
                alert('Warning: Image file size exceeds 2MB limit');
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
                <PrimaryButton type="submit" disabled={processing}>
                    Create Focus Content
                </PrimaryButton>
            </div>
        </form>
    );
};
