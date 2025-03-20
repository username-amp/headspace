import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import AdminLayout from '@/layouts/admin-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Activity, Clock, FileAudio, Headphones, Music2, Radio, Tag } from 'lucide-react';
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
    const [forceDeleteModalOpen, setForceDeleteModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<FocusSession | null>(null);

    const handleForceDelete = (session: FocusSession) => {
        setSelectedSession(session);
        setForceDeleteModalOpen(true);
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

    const typeColors = {
        binaural: 'bg-violet-500/10 text-violet-500',
        music: 'bg-pink-500/10 text-pink-500',
        soundscape: 'bg-amber-500/10 text-amber-500',
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
                        <Button className="bg-blue-500 hover:bg-blue-600">
                            <FileAudio className="mr-2 h-4 w-4" />
                            Add New Audio
                        </Button>
                    </Link>
                </div>

                {/* Focus Content Sections */}
                {Object.entries(typeLabels).map(([type, label]) => (
                    <div key={type} className="mb-8">
                        <div className="mb-4 flex items-center">
                            <div className={`mr-3 rounded-lg p-2 ${typeColors[type as keyof typeof typeColors]}`}>
                                {React.createElement(typeIcons[type as keyof typeof typeIcons], { className: 'h-6 w-6' })}
                            </div>
                            <h2 className="text-2xl font-semibold">{label}</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {groupedSessions[type]?.map((session) => {
                                const Icon = typeIcons[session.type as keyof typeof typeIcons];
                                const colorClass = typeColors[session.type as keyof typeof typeColors];
                                return (
                                    <Card key={session.id} className="group overflow-hidden transition-all hover:shadow-lg">
                                        <div className="relative aspect-video">
                                            <img
                                                src={session.image_url}
                                                alt={session.title}
                                                className="absolute inset-0 h-full w-full object-cover"
                                            />
                                            {session.is_featured && (
                                                <div className="absolute top-2 right-2 rounded bg-gradient-to-r from-blue-500 to-purple-500 px-2 py-1 text-sm text-white">
                                                    Featured
                                                </div>
                                            )}
                                            <div
                                                className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity group-hover:bg-black/60`}
                                            >
                                                <div className={`rounded-full p-3 ${colorClass}`}>
                                                    <Icon className="h-12 w-12" />
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
                                                    <Activity className="mr-2 h-4 w-4" />
                                                    {session.user_progress_count} plays
                                                </div>
                                            </div>
                                            <div className="mt-4 flex space-x-2">
                                                <Link href={route('admin.focus.edit', session.id)}>
                                                    <Button variant="outline" size="sm" className="hover:bg-gray-100 dark:hover:bg-gray-800">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleForceDelete(session)}
                                                    className="bg-red-700 hover:bg-red-800"
                                                >
                                                    Delete
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
                                    className={`rounded px-4 py-2 transition-colors ${
                                        page === focusSessions.current_page
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                                            : 'bg-card hover:bg-accent'
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Force Delete Confirmation Modal */}
                <ConfirmationModal
                    isOpen={forceDeleteModalOpen}
                    onClose={() => setForceDeleteModalOpen(false)}
                    onConfirm={confirmForceDelete}
                    title="Permanently Delete Focus Audio"
                    description="Are you sure you want to permanently delete this focus audio? This action cannot be undone and will remove all associated files and user progress."
                    variant="destructive"
                />
            </div>
        </AdminLayout>
    );
};

export default FocusIndex;
