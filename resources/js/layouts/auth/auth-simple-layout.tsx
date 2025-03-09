import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
  name?: string;
  title?: string;
  description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="w-full max-w-md bg-yellow-100/80 backdrop-blur-sm rounded-xl shadow-2xl p-8">
        <div className="flex flex-col items-center gap-4">
          <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-200 shadow-md">
              <AppLogoIcon className="h-8 w-8 fill-current text-yellow-600" />
            </div>
            <span className="text-2xl font-bold text-yellow-800">{title}</span>
          </Link>
          <p className="text-center text-sm text-yellow-700">{description}</p>
        </div>
        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
}
