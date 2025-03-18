import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { CheckCircle2, KeyRound, Shield } from 'lucide-react';
import { FormEventHandler, useRef } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
];

export default function Password() {
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Password settings" />

            <SettingsLayout>
                <div className="space-y-8">
                    {/* Header Section */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-8 text-white shadow-xl">
                        <div className="relative z-10">
                            <div className="mb-4 inline-flex rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                                <Shield className="mr-2 h-5 w-5 text-pink-300" />
                                <span className="text-sm font-medium">Security First</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Update Password</h1>
                            <p className="mt-2 max-w-md text-lg text-white/90">Keep your account secure with a strong, unique password.</p>
                        </div>
                        <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 opacity-50 blur-3xl" />
                        <div className="absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 opacity-50 blur-2xl" />
                    </div>

                    {/* Password Form */}
                    <Card className="hover:ring-offset-background overflow-hidden transition-all hover:ring-2 hover:ring-violet-500/30 hover:ring-offset-2">
                        <CardContent className="p-6">
                            <form onSubmit={updatePassword} className="space-y-6">
                                <div className="grid gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-base font-semibold" htmlFor="current_password">
                                            Current Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="current_password"
                                                ref={currentPasswordInput}
                                                value={data.current_password}
                                                onChange={(e) => setData('current_password', e.target.value)}
                                                type="password"
                                                className="pl-10"
                                                autoComplete="current-password"
                                                placeholder="Enter your current password"
                                            />
                                            <KeyRound className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                                        </div>
                                        <InputError message={errors.current_password} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-base font-semibold" htmlFor="password">
                                            New Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                ref={passwordInput}
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                type="password"
                                                className="pl-10"
                                                autoComplete="new-password"
                                                placeholder="Enter your new password"
                                            />
                                            <Shield className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-base font-semibold" htmlFor="password_confirmation">
                                            Confirm New Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password_confirmation"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                type="password"
                                                className="pl-10"
                                                autoComplete="new-password"
                                                placeholder="Confirm your new password"
                                            />
                                            <Shield className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                                        </div>
                                        <InputError message={errors.password_confirmation} />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        className="bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700"
                                    >
                                        Update Password
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
                                            <span>Password updated successfully</span>
                                        </div>
                                    </Transition>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
