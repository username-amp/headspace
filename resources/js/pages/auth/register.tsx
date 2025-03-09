import { Head, useForm, Link } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLogoIcon from '@/components/app-logo-icon';

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

interface RegisterProps {
  status?: string;
}

export default function Register({ status }: RegisterProps) {
  const { data, setData, post, processing, errors } = useForm<RegisterForm>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('register'));
  };

  return (
    <>
      <Head title="Register" />
      <div className="min-h-screen flex">
        {/* Left Side: Registration Form */}
        <div className="flex items-center justify-center w-full md:w-1/2 bg-white">
          <div className="max-w-md w-full p-8 space-y-6">
            {/* Logo */}
            <div className="flex items-center justify-center">
              <AppLogoIcon className="h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-center text-gray-800">Create an Account</h2>
            {status && (
              <div className="mb-4 text-center text-sm font-medium text-green-600">
                {status}
              </div>
            )}
            <form className="space-y-6" onSubmit={submit}>
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  placeholder="Your Name"
                  className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <InputError message={errors.name} />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  placeholder="email@example.com"
                  className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <InputError message={errors.email} />
              </div>
              <div>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="Password"
                  className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <InputError message={errors.password} />
              </div>
              <div>
                <Label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  required
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  placeholder="Confirm Password"
                  className="mt-1 text-black block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <InputError message={errors.password_confirmation} />
              </div>
              <Button
                type="submit"
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 transition rounded-md"
                disabled={processing}
              >
                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                Sign Up
              </Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <TextLink href={route('login')} className="text-indigo-600 hover:text-indigo-800">
                Log in
              </TextLink>
            </p>
          </div>
        </div>

        {/* Right Side: Image Section */}
        <div 
          className="hidden md:flex w-1/2 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")' }}
        ></div>
      </div>
    </>
  );
}
