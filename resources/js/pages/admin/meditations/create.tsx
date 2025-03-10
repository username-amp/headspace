import { MeditationForm } from '@/components/admin/meditation/meditation-form';
import AdminLayout from '@/layouts/admin-layout';
import { Head } from '@inertiajs/react';
import React from 'react';

interface Props {
    sections: {
        featured: string;
        today: string;
        new_popular: string;
        quick: string;
        courses: string;
        singles: string;
    };
}

export default function CreateMeditation({ sections }: Props) {
    return (
        <>
            <Head title="Create Meditation" />
            <div className="container mx-auto px-4 py-6">
                <h1 className="mb-6 text-2xl font-bold">Create New Meditation</h1>
                <div className="mb-6">
                    <p className="text-slate-600 dark:text-slate-400">Add a new meditation to one of the following sections:</p>
                    <ul className="mt-2 list-inside list-disc text-sm text-slate-600 dark:text-slate-400">
                        <li>Featured meditations - Highlighted content for the dashboard</li>
                        <li>Today&apos;s Meditation - Daily featured meditation</li>
                        <li>New and Popular - Recently added or highly engaged content</li>
                        <li>Quick Meditations - Short sessions for busy moments</li>
                        <li>Courses - Structured meditation series</li>
                        <li>Singles - Individual meditation sessions</li>
                    </ul>
                </div>
                <MeditationForm />
            </div>
        </>
    );
}

CreateMeditation.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
