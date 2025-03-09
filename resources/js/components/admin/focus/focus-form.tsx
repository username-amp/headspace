import React from 'react';
import { useForm } from '@inertiajs/react';
import TextInput from '@/components/text-input';
import InputLabel from '@/components/input-label';
import PrimaryButton from '@/components/primary-button';
import SelectInput from '@/components/select-input';

type FormData = {
  title: string;
  description: string;
  type: string;
  duration: string;
  audio_file: File | null;
  thumbnail: File | null;
};

export const FocusForm: React.FC = () => {
  const { data, setData, post, processing, errors } = useForm<FormData>({
    title: '',
    description: '',
    type: '',
    duration: '',
    audio_file: null,
    thumbnail: null,
  });

  const focusTypes = [
    { value: 'binaural_beats', label: 'Binaural Beats' },
    { value: 'focus_music', label: 'Focus Music' },
    { value: 'soundscape', label: 'Soundscape' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.focus.store'));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Pick<FormData, 'audio_file' | 'thumbnail'>) => {
    if (e.target.files?.[0]) {
      setData(field, e.target.files[0]);
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
        <InputLabel htmlFor="type" value="Content Type" />
        <SelectInput
          id="type"
          value={data.type}
          onChange={e => setData('type', e.target.value)}
          options={focusTypes}
          className="mt-1 block w-full"
          error={errors.type}
        />
      </div>

      <div>
        <InputLabel htmlFor="duration" value="Duration (minutes)" />
        <TextInput
          id="duration"
          type="number"
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

      <div className="flex items-center justify-end">
        <PrimaryButton type="submit" disabled={processing}>
          Create Focus Content
        </PrimaryButton>
      </div>
    </form>
  );
};
