import InputLabel from '@/components/input-label';
import PrimaryButton from '@/components/primary-button';
import SelectInput from '@/components/select-input';
import TextInput from '@/components/text-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import React from 'react';

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

export const MeditationForm: React.FC = () => {
    const { data, setData, post, processing, errors } = useForm<FormData>({
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.meditations.store'), {
            forceFormData: true,
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Pick<FormData, 'video' | 'image'>) => {
        if (e.target.files?.[0]) {
            setData(field, e.target.files[0]);
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
                <InputLabel htmlFor="video" value="Video File (MP4, MOV, AVI)" />
                <input
                    id="video"
                    name="video"
                    type="file"
                    accept="video/mp4,video/mov,video/avi"
                    onChange={(e) => handleFileChange(e, 'video')}
                    className="mt-1 block w-full"
                />
                {errors.video && <p className="mt-1 text-sm text-red-600">{errors.video}</p>}
            </div>

            <div>
                <InputLabel htmlFor="image" value="Thumbnail Image" />
                <input 
                    id="image" 
                    name="image"
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(e, 'image')} 
                    className="mt-1 block w-full" 
                />
                {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
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
                    Create Meditation
                </PrimaryButton>
            </div>
        </form>
    );
};
