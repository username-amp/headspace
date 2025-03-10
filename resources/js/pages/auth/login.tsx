import AppLogoIcon from '@/components/app-logo-icon';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
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
                {/* Left Side - Image Section */}
                <div
                    className="hidden w-1/2 bg-cover bg-center md:flex"
                    style={{
                        backgroundImage:
                            'url("https://www.verywellmind.com/thmb/MQWhY7u5mTDfaO4vgDHRvnHYcaA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-938890492-becc3fc4757849bea672f148454943f9.jpg")',
                    }}
                ></div>

                {/* Right Side - Form Section */}
                <div className="flex w-full items-center justify-center bg-white md:w-1/2">
                    <div className="w-full max-w-md space-y-6 p-8">
                        <div className="flex flex-col items-center gap-4">
                            <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full">
                                    <AppLogoIcon className="h-8 w-8 fill-current" />
                                </div>
                                <span className="text-2xl font-bold text-yellow-800">Log in to your account</span>
                            </Link>
                            <p className="text-center text-sm text-gray-600">Enter your email and password below to log in</p>
                        </div>
                        {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
                        <form className="space-y-6" onSubmit={submit}>
                            <div>
                                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </Label>
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
                                    className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={route('password.request')}
                                            className="text-sm text-indigo-600 hover:text-indigo-800"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Your secure password"
                                    className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="flex items-center">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                    tabIndex={3}
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                                />
                                <Label htmlFor="remember" className="ml-2 block text-sm text-gray-700">
                                    Remember me
                                </Label>
                            </div>
                            <Button
                                type="submit"
                                className="w-full rounded-md bg-indigo-600 text-white transition hover:bg-indigo-700"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Log in
                            </Button>
                        </form>
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <TextLink href={route('register')} tabIndex={5} className="text-indigo-600 hover:text-indigo-800">
                                Sign up
                            </TextLink>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
