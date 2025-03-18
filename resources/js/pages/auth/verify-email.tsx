// Components
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, LogOut, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

import { Button } from '@/components/ui/button';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('verification.send'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-gray-50 p-4">
            <Head title="Email verification" />

            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                            <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/20 blur-xl" />
                            <div className="relative rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
                                <Mail className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                            Verify Your Email
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-sm text-sm">
                        Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to
                        you?
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-600 dark:bg-green-900/50 dark:text-green-400">
                        A new verification link has been sent to your email address.
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white transition-all hover:from-indigo-600 hover:to-purple-700"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Resend Verification Email
                        </Button>

                        <Button variant="ghost" className="w-full" onClick={() => post(route('logout'))} type="button">
                            <LogOut className="mr-2 h-4 w-4" />
                            Log Out
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
