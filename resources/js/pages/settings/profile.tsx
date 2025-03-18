import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle2, Mail, User } from 'lucide-react';
import { FormEventHandler } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];

interface ProfileForm {
    name: string;
    email: string;
}

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<Required<ProfileForm>>({
        name: auth.user.name,
        email: auth.user.email,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-8 text-white shadow-xl">
                        <div className="relative z-10">
                            <div className="mb-4 inline-flex rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                                <User className="mr-2 h-5 w-5 text-pink-300" />
                                <span className="text-sm font-medium">Your Profile</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
                            <p className="mt-2 max-w-md text-lg text-white/90">Manage your account information and email preferences.</p>
                        </div>
                        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 opacity-50 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-50 blur-2xl" />
                    </div>

                    {/* Profile Form */}
                    <Card className="hover:ring-offset-background overflow-hidden transition-all hover:ring-2 hover:ring-violet-500/30 hover:ring-offset-2">
                        <CardContent className="p-6">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-base font-semibold" htmlFor="name">
                                            Full Name
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="name"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                className="pl-10"
                                                required
                                                autoComplete="name"
                                                placeholder="Enter your full name"
                                            />
                                            <User className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                                        </div>
                                        <InputError className="mt-2" message={errors.name} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-base font-semibold" htmlFor="email">
                                            Email Address
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                className="pl-10"
                                                required
                                                autoComplete="username"
                                                placeholder="Enter your email address"
                                            />
                                            <Mail className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                                        </div>
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>
                                </div>

                                {mustVerifyEmail && auth.user.email_verified_at === null && (
                                    <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/50">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
                                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                                Your email address is unverified.{' '}
                                                <Link
                                                    href={route('verification.send')}
                                                    method="post"
                                                    as="button"
                                                    className="font-medium underline hover:text-yellow-600"
                                                >
                                                    Click here to resend the verification email.
                                                </Link>
                                            </p>
                                        </div>

                                        {status === 'verification-link-sent' && (
                                            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-green-600">
                                                <CheckCircle2 className="h-5 w-5" />
                                                <span>A new verification link has been sent to your email address.</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
                                    >
                                        Save Changes
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="flex items-center gap-2 text-sm text-green-500">
                                            <CheckCircle2 className="h-5 w-5" />
                                            <span>Profile updated successfully</span>
                                        </div>
                                    </Transition>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Delete Account Section */}
                    <Card className="border-destructive/50 hover:ring-offset-background overflow-hidden transition-all hover:ring-2 hover:ring-red-500/30 hover:ring-offset-2">
                        <CardContent className="p-6">
                            <DeleteUser />
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
