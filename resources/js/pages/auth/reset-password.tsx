import { Head, useForm } from '@inertiajs/react';
import { KeyRound, LoaderCircle, Lock, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-gray-50 p-4">
            <Head title="Reset password" />

            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                            <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/20 blur-xl" />
                            <div className="relative rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
                                <KeyRound className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                            Reset Password
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-sm text-sm">
                        Please enter your new password below to complete the password reset process.
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={data.email}
                                    className="pl-10"
                                    readOnly
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <Mail className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    autoComplete="new-password"
                                    value={data.password}
                                    autoFocus
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your new password"
                                    className="pl-10"
                                />
                                <KeyRound className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm your new password"
                                    className="pl-10"
                                />
                                <Lock className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white transition-all hover:from-indigo-600 hover:to-purple-700"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    );
}
