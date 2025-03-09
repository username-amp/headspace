import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Clock, Tag } from 'lucide-react';

interface MeditationSession {
  id: number;
  title: string;
  section: string;
  category: string;
  duration: string;
  description: string;
  image_url: string;
  audio_url: string;
  is_featured: boolean;
  user_meditations_count: number;
}

interface MeditationsIndexProps {
  meditations: {
    data: MeditationSession[];
    current_page: number;
    last_page: number;
  };
}

const MeditationsIndex: React.FC<MeditationsIndexProps> = ({ meditations }) => {
  const sectionLabels = {
    featured: 'Featured Meditations',
    today: "Today's Meditation",
    new_popular: 'New and Popular',
    quick: 'Quick Meditations',
    courses: 'Courses',
    singles: 'Singles',
  };

  const groupedMeditations = meditations.data.reduce((acc, meditation) => {
    if (!acc[meditation.section]) {
      acc[meditation.section] = [];
    }
    acc[meditation.section].push(meditation);
    return acc;
  }, {} as Record<string, MeditationSession[]>);

  return (
    <AdminLayout>
      <Head title="Meditation Management" />
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Meditation Management</h1>
          <Link href={route('admin.meditations.create')}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Meditation
            </Button>
          </Link>
        </div>

        {/* Meditation Sections */}
        {Object.entries(sectionLabels).map(([section, label]) => (
          <div key={section} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">{label}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {groupedMeditations[section]?.map(meditation => (
                <Card key={meditation.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={meditation.image_url}
                      alt={meditation.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    {meditation.is_featured && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-sm">
                        Featured
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{meditation.title}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        {meditation.duration} minutes
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Tag className="h-4 w-4 mr-2" />
                        {meditation.category}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {meditation.user_meditations_count} completions
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Link href={route('admin.meditations.edit', meditation.id)}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <Link
                        href={route('admin.meditations.destroy', meditation.id)}
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
        {meditations.last_page > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex space-x-2">
              {Array.from({ length: meditations.last_page }, (_, i) => i + 1).map(page => (
                <Link
                  key={page}
                  href={route('admin.meditations.index', { page })}
                  className={`px-4 py-2 rounded ${
                    page === meditations.current_page
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

export default MeditationsIndex;
