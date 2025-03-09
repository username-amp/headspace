import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { FocusForm } from '@/components/admin/focus/focus-form';

interface Props {
  sections: {
    featured: string;
    binaural_beats: string;
    focus_music: string;
    soundscapes: string;
  };
}

export default function CreateFocus({ sections }: Props) {
  return (
    <>
      <Head title="Create Focus Content" />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Create New Focus Content</h1>
        <FocusForm />
      </div>
    </>
  );
}

CreateFocus.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
