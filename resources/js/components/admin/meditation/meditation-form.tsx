import React from 'react';
import { useForm } from '@inertiajs/react';
import TextInput from '@/components/text-input';
import InputLabel from '@/components/input-label';
import PrimaryButton from '@/components/primary-button';
import SelectInput from '@/components/select-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

type FormData = {
  title: string;
  description: string;
  section: string;
  category: string;
  duration: string;
  audio_file: File | null;
  thumbnail: File | null;
  is_featured: boolean;
};

export const MeditationForm: React.FC = () => {
  const { data, setData, post, processing, errors } = useForm<FormData>({
    title: '',
    description: '',
    section: '',
    category: '',
    duration: '',
    audio_file: null,
    thumbnail: null,
    is_featured: false,
  });

  const sections = [
    { value: 'featured', label: 'Featured Meditations' },
    { value: 'today', label: 'Today\'s Meditation' },
    { value: 'new_popular', label: 'New and Popular' },
    { value: 'quick', label: 'Quick Meditations' },
    { value: 'courses', label: 'Courses' },
    { value: 'singles', label: 'Singles' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.meditations.store'));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Pick<FormData, 'audio_file' | 'thumbnail'>) => {
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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <InputLabel htmlFor="title" value="Title" />
        <TextInput
          id="title"
          type="text"
          value={data.title}
          onChange={e => setData('title', e.target.value)}
          className="mt-1 block w-full"
          error={errors.title}
        />
      </div>

      <div>
        <InputLabel htmlFor="description" value="Description" />
        <textarea
          id="description"
          value={data.description}
          onChange={e => setData('description', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          rows={4}
        />
      </div>

      <div>
        <InputLabel htmlFor="section" value="Section" />
        <SelectInput
          id="section"
          value={data.section}
          onChange={e => setData('section', e.target.value)}
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
          onChange={e => setData('category', e.target.value)}
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
          onChange={e => setData('duration', e.target.value)}
          className="mt-1 block w-full"
          error={errors.duration}
        />
      </div>

      <div>
        <InputLabel htmlFor="audio_file" value="Audio File" />
        <input
          id="audio_file"
          type="file"
          accept="audio/*"
          onChange={e => handleFileChange(e, 'audio_file')}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <InputLabel htmlFor="thumbnail" value="Thumbnail Image" />
        <input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={e => handleFileChange(e, 'thumbnail')}
          className="mt-1 block w-full"
        />
      </div>

      <div className="flex items-center">
        <Checkbox
          id="is_featured"
          name="is_featured"
          checked={data.is_featured}
          onCheckedChange={handleCheckedChange}
          className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
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
