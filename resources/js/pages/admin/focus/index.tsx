import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Clock, Music2, Plus, Tag, Activity, Headphones, Radio, FileAudio } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

interface FocusSession {
    id: number;
    title: string;
    type: string;
    category: string;
    duration: string;
    description: string;
    image_url: string;
    audio_url: string;
    is_featured: boolean;
    user_progress_count: number;
}

interface FocusIndexProps {
    focusSessions: {
        data: FocusSession[];
        current_page: number;
        last_page: number;
    };
}

const FocusIndex: React.FC<FocusIndexProps> = ({ focusSessions }) => {
    const { delete: destroy } = useForm();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [forceDeleteModalOpen, setForceDeleteModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<FocusSession | null>(null);

    const handleDelete = (session: FocusSession) => {
        setSelectedSession(session);
        setDeleteModalOpen(true);
    };

    const handleForceDelete = (session: FocusSession) => {
        setSelectedSession(session);
        setForceDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedSession) return;

        destroy(route('admin.focus.destroy', selectedSession.id), {
            onSuccess: () => {
                toast.success('Focus audio deleted successfully');
                setDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to delete focus audio');
                setDeleteModalOpen(false);
            },
        });
    };

    const confirmForceDelete = () => {
        if (!selectedSession) return;

        destroy(route('admin.focus.force-delete', selectedSession.id), {
            onSuccess: () => {
                toast.success('Focus audio permanently deleted');
                setForceDeleteModalOpen(false);
            },
            onError: () => {
                toast.error('Failed to permanently delete focus audio');
                setForceDeleteModalOpen(false);
            },
        });
    };

    const typeLabels = {
        binaural: 'Binaural Beats',
        music: 'Focus Music',
        soundscape: 'Soundscapes',
    };

    const typeIcons = {
        binaural: Headphones,
        music: Music2,
        soundscape: Radio,
    };

    const groupedSessions = focusSessions.data.reduce(
        (acc, session) => {
            if (!acc[session.type]) {
                acc[session.type] = [];
            }
            acc[session.type].push(session);
            return acc;
        },
        {} as Record<string, FocusSession[]>,
    );

    return (
        <AdminLayout>
            <Head title="Focus Audio Management" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Focus Audio</h1>
                        <p className="text-muted-foreground mt-2">Manage focus audio content (up to 50MB per audio file)</p>
                    </div>
                    <Link href={route('admin.focus.create')}>
                        <Button>
                            <FileAudio className="mr-2 h-4 w-4" />
                            Add New Audio
                        </Button>
                    </Link>
                </div>

                {/* Focus Content Sections */}
                {Object.entries(typeLabels).map(([type, label]) => (
                    <div key={type} className="mb-8">
                        <h2 className="mb-4 text-2xl font-semibold">{label}</h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {groupedSessions[type]?.map((session) => {
                                const Icon = typeIcons[session.type as keyof typeof typeIcons];
                                return (
                                    <Card key={session.id} className="overflow-hidden">
                                        <div className="relative aspect-video">
                                            <img src={session.image_url} alt={session.title} className="absolute inset-0 h-full w-full object-cover" />
                                            {session.is_featured && (
                                                <div className="absolute top-2 right-2 rounded bg-primary px-2 py-1 text-sm text-primary-foreground">
                                                    Featured
                                                </div>
                                            )}
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity hover:bg-black/60">
                                                <Icon className="h-12 w-12 text-white opacity-80" />
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
                                                    <Activity className="mr-2 h-4 w-4" />
                                                    {session.user_progress_count} plays
                                                </div>
                                            </div>
                                            <div className="mt-4 flex space-x-2">
                                                <Link href={route('admin.focus.edit', session.id)}>
                                                    <Button variant="outline" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm" 
                                                    onClick={() => handleDelete(session)}
                                                >
                                                    Delete
                                                </Button>
                                                <Button 
                                                    variant="destructive" 
                                                    size="sm" 
                                                    onClick={() => handleForceDelete(session)}
                                                >
                                                    Force Delete
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Pagination */}
                {focusSessions.last_page > 1 && (
                    <div className="mt-6 flex justify-center">
                        <div className="flex space-x-2">
                            {Array.from({ length: focusSessions.last_page }, (_, i) => i + 1).map((page) => (
                                <Link
                                    key={page}
                                    href={route('admin.focus.index', { page })}
                                    className={`rounded px-4 py-2 ${
                                        page === focusSessions.current_page ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-accent'
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
                    title="Delete Focus Audio"
                    description="Are you sure you want to delete this focus audio? This will temporarily remove it from the platform. Users' progress will be preserved."
                />

                {/* Force Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={forceDeleteModalOpen}
                    onClose={() => setForceDeleteModalOpen(false)}
                    onConfirm={confirmForceDelete}
                    title="Permanently Delete Focus Audio"
                    description="Are you sure you want to permanently delete this focus audio? This action cannot be undone. All associated files and user progress will be permanently deleted."
                />
            </div>
        </AdminLayout>
    );
};

export default FocusIndex;
