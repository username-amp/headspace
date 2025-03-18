// Components
import { Head, useForm } from '@inertiajs/react';
import { KeyRound, LoaderCircle, Shield } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<{ password: string }>>({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-gray-50 p-4">
            <Head title="Confirm password" />

            <div className="w-full max-w-md space-y-8">
                <div className="flex flex-col items-center gap-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                        <div className="relative">
                            <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/20 blur-xl" />
                            <div className="relative rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
                                <Shield className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h1 className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                            Confirm Password
                        </h1>
                    </div>
                    <p className="text-muted-foreground max-w-sm text-sm">This is a secure area. Please confirm your password before continuing.</p>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={data.password}
                                autoFocus
                                onChange={(e) => setData('password', e.target.value)}
                                className="pl-10"
                            />
                            <KeyRound className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white transition-all hover:from-indigo-600 hover:to-purple-700"
                        disabled={processing}
                    >
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Password
                    </Button>
                </form>
            </div>
        </div>
    );
}
