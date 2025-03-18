import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { KeyRound, LoaderCircle, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in" />
            <div className="flex min-h-screen">
                {/* Left Side - Form Section */}
                <div className="flex w-full items-center justify-center bg-gradient-to-br from-white to-gray-50 px-4 md:w-1/2">
                    <div className="w-full max-w-md space-y-8">
                        <div className="flex flex-col items-center gap-6 text-center">
                            <Link href={route('home')} className="group flex flex-col items-center gap-2 transition-transform hover:scale-105">
                                <div className="relative">
                                    <div className="absolute inset-0 animate-pulse rounded-full bg-indigo-500/20 blur-xl" />
                                    <div className="relative rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-4">
                                        <AppLogoIcon className="h-8 w-8 text-white" />
                                    </div>
                                </div>
                                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
                                    Welcome Back
                                </span>
                            </Link>
                            <p className="text-muted-foreground text-sm">Enter your credentials to access your account</p>
                        </div>

                        {status && (
                            <div className="rounded-lg bg-green-50 p-4 text-center text-sm font-medium text-green-600 dark:bg-green-900/50 dark:text-green-400">
                                {status}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={submit}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email address</Label>
                                    <div className="relative">
                                        <Input
                                            id="email"
                                            type="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="email@example.com"
                                            className="pl-10"
                                        />
                                        <Mail className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                                    </div>
                                    <InputError message={errors.email} />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        {canResetPassword && (
                                            <TextLink href={route('password.request')} className="text-sm hover:text-indigo-600" tabIndex={5}>
                                                Forgot password?
                                            </TextLink>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type="password"
                                            required
                                            tabIndex={2}
                                            autoComplete="current-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Enter your password"
                                            className="pl-10"
                                        />
                                        <KeyRound className="text-muted-foreground absolute top-2.5 left-3 h-5 w-5" />
                                    </div>
                                    <InputError message={errors.password} />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        checked={data.remember}
                                        onCheckedChange={(checked) => setData('remember', checked === true)}
                                        tabIndex={3}
                                    />
                                    <Label htmlFor="remember" className="text-sm">
                                        Remember me
                                    </Label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white transition-all hover:from-indigo-600 hover:to-purple-700"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Log in
                            </Button>
                        </form>

                        <p className="text-muted-foreground text-center text-sm">
                            Don't have an account?{' '}
                            <TextLink href={route('register')} tabIndex={5} className="hover:text-indigo-600">
                                Sign up
                            </TextLink>
                        </p>
                    </div>
                </div>

                {/* Right Side - Image Section */}
                <div className="hidden md:block md:w-1/2">
                    <div className="relative h-full w-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/90 to-purple-600/90" />
                        <img
                            src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
                            alt="Meditation"
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center p-8">
                            <blockquote className="space-y-4">
                                <p className="text-2xl font-medium text-balance text-white">
                                    "Meditation is not about stopping thoughts, but recognizing that we are more than our thoughts and our feelings."
                                </p>
                                <footer className="text-white/80">— Thich Nhat Hanh</footer>
                            </blockquote>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
