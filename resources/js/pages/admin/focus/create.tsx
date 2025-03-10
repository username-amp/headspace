import { FocusForm } from '@/components/admin/focus/focus-form';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

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
                <h1 className="mb-6 text-2xl font-bold">Create New Focus Content</h1>
                <FocusForm />
            </div>
        </>
    );
}

CreateFocus.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
