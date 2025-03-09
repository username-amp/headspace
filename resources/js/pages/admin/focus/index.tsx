import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Music, Clock, Tag, PlayCircle } from 'lucide-react';

interface FocusSession {
  id: number;
  title: string;
  section: string;
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
  const sectionLabels = {
    featured: 'Featured Focus Content',
    binaural_beats: 'Binaural Beats',
    focus_music: 'Focus Music',
    soundscapes: 'Soundscapes',
  };

  const groupedSessions = focusSessions.data.reduce((acc, session) => {
    if (!acc[session.section]) {
      acc[session.section] = [];
    }
    acc[session.section].push(session);
    return acc;
  }, {} as Record<string, FocusSession[]>);

  return (
    <AdminLayout>
      <Head title="Focus Content Management" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Focus Content Management</h1>
          <Link href={route('admin.focus.create')}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Focus Content
            </Button>
          </Link>
        </div>

        {/* Focus Content Sections */}
        {Object.entries(sectionLabels).map(([section, label]) => (
          <div key={section} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{label}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedSessions[section]?.map(session => (
                <Card key={session.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={session.image_url}
                      alt={session.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {session.is_featured && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-sm">
                        Featured
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-white opacity-80" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{session.title}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {session.duration} minutes
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Tag className="h-4 w-4 mr-2" />
                        {session.category}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Music className="h-4 w-4 mr-2" />
                        {session.user_progress_count} plays
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Link href={route('admin.focus.edit', session.id)}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link
                        href={route('admin.focus.destroy', session.id)}
                        method="delete"
                        as="button"
                        type="button"
                      >
                        <Button variant="destructive" size="sm">
                          Delete
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Pagination */}
        {focusSessions.last_page > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: focusSessions.last_page }, (_, i) => i + 1).map(page => (
                <Link
                  key={page}
                  href={route('admin.focus.index', { page })}
                  className={`px-4 py-2 rounded ${
                    page === focusSessions.current_page
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card hover:bg-accent'
                  }`}
                >
                  {page}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default FocusIndex;
