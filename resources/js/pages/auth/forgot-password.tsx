// Components
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm<Required<{ email: string }>>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-gray-50 p-4">
            <Head title="Forgot password" />

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
                            Forgot Password?
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-sm text-sm">
                        No worries! Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                {status && (
                    <div className="rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-600 dark:bg-green-900/50 dark:text-green-400">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email address</Label>
                        <div className="relative">
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="off"
                                value={data.email}
                                autoFocus
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                                className="pl-10"
                            />
                            <Mail className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-4">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white transition-all hover:from-indigo-600 hover:to-purple-700"
                            disabled={processing}
                        >
                            {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Send Reset Link
                        </Button>

                        <Button variant="ghost" className="w-full" onClick={() => window.history.back()} type="button">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to login
                        </Button>
                    </div>
                </form>

                <div className="text-muted-foreground text-center text-sm">
                    Remember your password?{' '}
                    <TextLink href={route('login')} className="hover:text-indigo-600">
                        Log in
                    </TextLink>
                </div>
            </div>
        </div>
    );
}
