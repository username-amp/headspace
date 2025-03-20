import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Activity, Clock, FileVideo, PlayCircle, Tag, Video } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface MeditationSession {
    id: number;
    title: string;
    section: string;
    category: string;
    duration: string;
    description: string;
    image_url: string;
    video_url: string;
    is_featured: boolean;
    user_progress_count: number;
    user_meditations_count: number;
}

interface MeditationIndexProps {
    meditationSessions: {
        data: MeditationSession[];
        current_page: number;
        last_page: number;
    };
}

const MeditationIndex: React.FC<MeditationIndexProps> = ({ meditationSessions }) => {
    const { delete: destroy } = useForm();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [forceDeleteModalOpen, setForceDeleteModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<MeditationSession | null>(null);

    const handleDelete = (session: MeditationSession) => {
        setSelectedSession(session);
        setDeleteModalOpen(true);
    };

    const handleForceDelete = (session: MeditationSession) => {
        setSelectedSession(session);
        setForceDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedSession) return;

        destroy(route('admin.meditations.destroy', selectedSession.id), {
            onSuccess: () => {
                toast.success('Meditation video deleted successfully');
                setDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete meditation video');
                setDeleteModalOpen(false);
            },
        });
    };

    const confirmForceDelete = () => {
        if (!selectedSession) return;

        destroy(route('admin.meditations.force-delete', selectedSession.id), {
            onSuccess: () => {
                toast.success('Meditation video permanently deleted');
                setForceDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to permanently delete meditation video');
                setForceDeleteModalOpen(false);
            },
        });
    };

    const sectionLabels = {
        featured: 'Featured Videos',
        today: "Today's Videos",
        new_popular: 'New & Popular',
        quick: 'Quick Videos',
        courses: 'Course Videos',
        singles: 'Single Videos',
    };

    const sectionColors = {
        featured: 'bg-emerald-500/10 text-emerald-500',
        today: 'bg-blue-500/10 text-blue-500',
        new_popular: 'bg-purple-500/10 text-purple-500',
        quick: 'bg-orange-500/10 text-orange-500',
        courses: 'bg-rose-500/10 text-rose-500',
        singles: 'bg-cyan-500/10 text-cyan-500',
    };

    const groupedSessions = meditationSessions.data.reduce(
        (acc, session) => {
            if (!acc[session.section]) {
                acc[session.section] = [];
            }
            acc[session.section].push(session);
            return acc;
        },
        {} as Record<string, MeditationSession[]>,
    );

    return (
        <AdminLayout>
            <Head title="Meditation Videos Management" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Meditation Videos</h1>
                        <p className="text-muted-foreground mt-2">Manage meditation video content (up to 100MB per video)</p>
                    </div>
                    <Link href={route('admin.meditations.create')}>
                        <Button className="bg-emerald-500 hover:bg-emerald-600">
                            <FileVideo className="mr-2 h-4 w-4" />
                            Add New Video
                        </Button>
                    </Link>
                </div>

                {/* Meditation Content Sections */}
                {Object.entries(sectionLabels).map(([section, label]) => (
                    <div key={section} className="mb-8">
                        <div className="mb-4 flex items-center">
                            <div className={`mr-3 rounded-lg p-2 ${sectionColors[section as keyof typeof sectionColors]}`}>
                                <Video className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-semibold">{label}</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {groupedSessions[section]?.map((session) => (
                                <Card key={session.id} className="group overflow-hidden transition-all hover:shadow-lg">
                                    <div className="relative aspect-video">
                                        <img src={session.image_url} alt={session.title} className="absolute inset-0 h-full w-full object-cover" />
                                        {session.is_featured && (
                                            <div className="absolute top-2 right-2 rounded bg-gradient-to-r from-emerald-500 to-blue-500 px-2 py-1 text-sm text-white">
                                                Featured
                                            </div>
                                        )}
                                        <div
                                            className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity group-hover:bg-black/60`}
                                        >
                                            <div className={`rounded-full p-3 ${sectionColors[session.section as keyof typeof sectionColors]}`}>
                                                <PlayCircle className="h-12 w-12" />
                                            </div>
                                        </div>
                                    </div>
                                    <CardContent className="p-4">
                                        <h3 className="mb-2 text-lg font-semibold">{session.title}</h3>
                                        <div className="space-y-2">
                                            <div className="text-muted-foreground flex items-center text-sm">
                                                <Clock className="mr-2 h-4 w-4" />
                                                {session.duration} minutes
                                            </div>
                                            <div className="text-muted-foreground flex items-center text-sm">
                                                <Tag className="mr-2 h-4 w-4" />
                                                {session.category}
                                            </div>
                                            <div className="text-muted-foreground flex items-center text-sm">
                                                <Video className="mr-2 h-4 w-4" />
                                                {session.user_meditations_count} completed
                                            </div>
                                            <div className="text-muted-foreground flex items-center text-sm">
                                                <Activity className="mr-2 h-4 w-4" />
                                                {session.user_progress_count} in progress
                                            </div>
                                        </div>
                                        <div className="mt-4 flex space-x-2">
                                            <Link href={route('admin.meditations.edit', session.id)}>
                                                <Button variant="outline" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(session)}
                                                className="hover:bg-red-600"
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleForceDelete(session)}
                                                className="bg-red-700 hover:bg-red-800"
                                            >
                                                Force Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Pagination */}
                {meditationSessions.last_page > 1 && (
                    <div className="mt-6 flex justify-center">
                        <div className="flex space-x-2">
                            {Array.from({ length: meditationSessions.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={route('admin.meditations.index', { page })}
                                    className={`rounded px-4 py-2 transition-colors ${
                                        page === meditationSessions.current_page
                                            ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white'
                                            : 'bg-card hover:bg-accent'
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Meditation Video"
                    description="Are you sure you want to delete this meditation video? This will temporarily remove it from the platform. Users' progress will be preserved."
                />

                {/* Force Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={forceDeleteModalOpen}
                    onClose={() => setForceDeleteModalOpen(false)}
                    onConfirm={confirmForceDelete}
                    title="Permanently Delete Meditation Video"
                    description="Are you sure you want to permanently delete this meditation video? This action cannot be undone and will remove all associated files and user progress."
                    variant="destructive"
                />
            </div>
        </AdminLayout>
    );
};

export default MeditationIndex;
