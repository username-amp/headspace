import { Head } from '@inertiajs/react';

import AppearanceTabs from '@/components/appearance-tabs';
import { type BreadcrumbItem } from '@/types';

import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Monitor, Moon, Palette, Sun } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />

            <SettingsLayout>
                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-8 text-white shadow-xl">
                        <div className="relative z-10">
                            <div className="mb-4 inline-flex rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                                <Palette className="mr-2 h-5 w-5 text-pink-300" />
                                <span className="text-sm font-medium">Personalize Your Experience</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Appearance Settings</h1>
                            <p className="mt-2 max-w-md text-lg text-white/90">
                                Customize the look and feel of your meditation space to match your preferences.
                            </p>
                        </div>
                        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 opacity-50 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-50 blur-2xl" />
                    </div>

                    {/* Theme Options */}
                    <Card className="hover:ring-offset-background overflow-hidden transition-all hover:ring-2 hover:ring-violet-500/30 hover:ring-offset-2">
                        <CardContent className="p-6">
                            <div className="grid gap-8">
                                <div className="flex flex-col space-y-2">
                                    <h2 className="text-xl font-semibold">Theme Preferences</h2>
                                    <p className="text-muted-foreground text-sm">Choose how Headspace appears to you</p>
                                </div>
                                <div className="grid gap-6">
                                    <AppearanceTabs />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Theme Selection */}
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Card className="group hover:ring-offset-background cursor-pointer overflow-hidden transition-all hover:scale-[1.02] hover:ring-2 hover:ring-violet-500/30 hover:ring-offset-2">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 p-2.5 text-white">
                                        <Sun className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Light Mode</h3>
                                        <p className="text-muted-foreground text-sm">Perfect for daytime meditation</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group hover:ring-offset-background cursor-pointer overflow-hidden transition-all hover:scale-[1.02] hover:ring-2 hover:ring-violet-500/30 hover:ring-offset-2">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 text-white">
                                        <Moon className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">Dark Mode</h3>
                                        <p className="text-muted-foreground text-sm">Easier on the eyes at night</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group hover:ring-offset-background cursor-pointer overflow-hidden transition-all hover:scale-[1.02] hover:ring-2 hover:ring-violet-500/30 hover:ring-offset-2">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 p-2.5 text-white">
                                        <Monitor className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">System</h3>
                                        <p className="text-muted-foreground text-sm">Match your system theme</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
