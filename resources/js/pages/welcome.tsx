import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function LandingPage() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-gray-50">
                {/* Header Section */}
                <header className="sticky top-0 z-50 bg-white shadow-sm">
                    <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center">
                            <div className="flex items-center">
                                <img
                                    src="https://w7.pngwing.com/pngs/222/993/png-transparent-bitcoin-cash-ethereum-cryptocurrency-logo-meditation-physical-fitness-orange-investment.png"
                                    alt="Mindful logo"
                                    className="mr-2 h-8 w-8"
                                />
                                <Link
                                    href={route('home')}
                                    className="cursor-pointer text-xl font-semibold text-indigo-600 transition duration-300 ease-in-out hover:animate-pulse"
                                >
                                    ZenSpace
                                </Link>
                            </div>
                            <div className="ml-8 hidden space-x-4 md:flex">
                                <Link href="#features" className="text-gray-600 transition hover:text-gray-900">
                                    Features
                                </Link>
                                <Link href="#about" className="text-gray-600 transition hover:text-gray-900">
                                    About
                                </Link>
                                <Link href="#testimonials" className="text-gray-600 transition hover:text-gray-900">
                                    Testimonials
                                </Link>
                                <Link href="#contact" className="text-gray-600 transition hover:text-gray-900">
                                    Contact
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="transform rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 transition duration-300 ease-in-out hover:scale-105 hover:border-gray-500"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="transform text-gray-600 transition duration-300 ease-in-out hover:scale-105 hover:text-gray-900"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="transform rounded-md bg-indigo-600 px-4 py-2 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-700"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <section className="relative flex flex-grow items-center justify-center overflow-hidden bg-indigo-600 py-12">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                            alt="Peaceful meditation scene"
                            className="h-full w-full object-cover opacity-20"
                        />
                    </div>
                    <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between lg:flex-row">
                            <div className="mb-8 text-left lg:mb-0 lg:w-1/2">
                                <h1 className="mb-4 text-5xl leading-tight font-extrabold text-white">Find Inner Peace in a Chaotic World</h1>
                                <p className="mb-8 text-xl text-indigo-100">
                                    Start your journey to mindfulness with personalized meditation programs and daily calm sessions.
                                </p>
                                <div className="flex gap-4">
                                    {!auth.user && (
                                        <>
                                            <Link
                                                href={route('register')}
                                                className="transform rounded-md bg-white px-6 py-3 font-semibold text-indigo-600 transition duration-300 ease-in-out hover:scale-105 hover:bg-gray-100"
                                            >
                                                Start Free Trial
                                            </Link>
                                            <Link
                                                href={route('login')}
                                                className="transform rounded-md border border-white bg-transparent px-6 py-3 text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-white hover:text-indigo-600"
                                            >
                                                Watch Demo
                                            </Link>
                                        </>
                                    )}
                                    {auth.user && (
                                        <Link
                                            href={route('dashboard')}
                                            className="transform rounded-md bg-white px-6 py-3 font-semibold text-indigo-600 transition duration-300 ease-in-out hover:scale-105 hover:bg-gray-100"
                                        >
                                            Go to Dashboard
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="lg:w-1/2">
                                <img
                                    src="https://images.unsplash.com/photo-1588072432836-e10032774350?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
                                    alt="Meditation app interface"
                                    className="transform rounded-lg shadow-2xl transition duration-500 hover:scale-105"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="bg-white py-12">
                    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="mb-6 text-3xl font-bold text-gray-900">Transform Your Life</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            <div className="rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">
                                <img
                                    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="Daily mindfulness"
                                    className="mb-4 h-48 w-full rounded-md object-cover"
                                />
                                <h3 className="mb-2 text-xl font-semibold">Daily Mindfulness</h3>
                                <p className="text-gray-600">Curated sessions for stress relief, focus, and better sleep.</p>
                            </div>
                            <div className="rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">
                                <img
                                    src="https://images.unsplash.com/photo-1548602088-9d12a4f9c10f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="Progress insights"
                                    className="mb-4 h-48 w-full rounded-md object-cover"
                                />
                                <h3 className="mb-2 text-xl font-semibold">Progress Insights</h3>
                                <p className="text-gray-600">Track your mood, streaks, and personal growth with detailed analytics.</p>
                            </div>
                            <div className="rounded-lg border p-6 shadow-sm transition-shadow hover:shadow-md">
                                <img
                                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="Community support"
                                    className="mb-4 h-48 w-full rounded-md object-cover"
                                />
                                <h3 className="mb-2 text-xl font-semibold">Community Support</h3>
                                <p className="text-gray-600">Join live sessions and connect with mindful peers worldwide.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section id="testimonials" className="bg-indigo-50 py-12">
                    <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="mb-6 text-3xl font-bold text-gray-900">Success Stories</h2>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <div className="flex items-start rounded-lg bg-white p-6 shadow-md">
                                <img
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="Sarah"
                                    className="mr-4 h-16 w-16 rounded-full"
                                />
                                <div className="text-left">
                                    <p className="text-gray-600 italic">
                                        "ZenSpace helped me manage anxiety during a stressful career transition. The sleep meditations are
                                        life-changing!"
                                    </p>
                                    <p className="mt-4 font-semibold text-gray-800">- Sarah, Designer</p>
                                </div>
                            </div>
                            <div className="flex items-start rounded-lg bg-white p-6 shadow-md">
                                <img
                                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="Michael"
                                    className="mr-4 h-16 w-16 rounded-full"
                                />
                                <div className="text-left">
                                    <p className="text-gray-600 italic">
                                        "As a busy parent, the 5-minute mindfulness breaks keep me grounded throughout the day."
                                    </p>
                                    <p className="mt-4 font-semibold text-gray-800">- Michael, Teacher</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section id="about" className="bg-white py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center gap-12 lg:flex-row">
                            <div className="lg:w-1/2">
                                <img
                                    src="https://static.vecteezy.com/system/resources/thumbnails/022/799/016/small_2x/a-man-meditate-in-music-relaxation-meditation-generative-ai-photo.jpeg"
                                    alt="App interface"
                                    className="rounded-lg shadow-xl"
                                />
                            </div>
                            <div className="lg:w-1/2">
                                <h2 className="mb-6 text-3xl font-bold text-gray-900">Your Pocket Sanctuary</h2>
                                <p className="mb-8 text-lg text-gray-700">ZenSpace combines ancient wisdom with modern technology to help you:</p>
                                <ul className="space-y-4 text-gray-600">
                                    <li className="flex items-center">
                                        <svg className="mr-2 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Reduce stress and anxiety naturally
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="mr-2 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Improve focus and productivity
                                    </li>
                                    <li className="flex items-center">
                                        <svg className="mr-2 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Develop lasting mindfulness habits
                                    </li>
                                </ul>
                                <div className="mt-8">
                                    <Link
                                        href={route('register')}
                                        className="transform rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-indigo-700"
                                    >
                                        Start Your Journey
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer Section with Contact */}
                <footer id="contact" className="bg-gray-900 text-white">
                    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                            <div>
                                <h3 className="mb-4 text-lg font-semibold">ZenSpace</h3>
                                <p className="text-gray-400">Making mindfulness accessible to everyone</p>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold">Resources</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <Link href="#features" className="transition hover:text-white">
                                            Features
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#testimonials" className="transition hover:text-white">
                                            Success Stories
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#about" className="transition hover:text-white">
                                            About
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold">Support</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <Link href="#" className="transition hover:text-white">
                                            Contact
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="transition hover:text-white">
                                            FAQ
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="transition hover:text-white">
                                            Privacy Policy
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="mb-4 font-semibold">Connect</h4>
                                <div className="flex space-x-4">
                                    <Link href="#" className="text-gray-400 hover:text-white">
                                        <span className="sr-only">Twitter</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    </Link>
                                    <Link href="#" className="text-gray-400 hover:text-white">
                                        <span className="sr-only">Instagram</span>
                                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.227-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.668-.072-4.948C23.668 2.695 21.25.272 16.888.072 15.608.014 15.2 0 12 0z" />
                                            <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998z" />
                                            <circle cx="18.406" cy="5.594" r="1.44" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="mt-8 text-center text-sm text-gray-500">&copy; {new Date().getFullYear()} ZenSpace. All rights reserved.</div>
                    </div>
                </footer>
            </div>
        </>
    );
}
