import { Button } from '@/components/ui/button';
import { Head, useForm } from '@inertiajs/react';
import { Clock, Moon, Sun, Target } from 'lucide-react';
import { useState } from 'react';

interface OnboardingForm {
    preferred_time: string;
    daily_goal_minutes: number;
    notifications_enabled: boolean;
    initial_mood: number;
    interests: string[];
    [key: string]: string | number | boolean | string[];
}

export default function Onboard() {
    const [step, setStep] = useState(1);
    const { data, setData, post, processing } = useForm<OnboardingForm>({
        preferred_time: 'morning',
        daily_goal_minutes: 10,
        notifications_enabled: true,
        initial_mood: 3,
        interests: [],
    });

    const handleSubmit = () => {
        post(route('onboarding.save'), {
            onSuccess: () => {
                window.location.href = route('dashboard');
            },
        });
    };

    const timePreferences = [
        { value: 'morning', label: 'Morning', icon: Sun, description: 'Start your day mindfully' },
        { value: 'afternoon', label: 'Afternoon', icon: Clock, description: 'Take a midday break' },
        { value: 'evening', label: 'Evening', icon: Moon, description: 'Wind down before bed' },
    ];

    const goalOptions = [
        { value: 5, label: '5 minutes', description: 'Perfect for beginners' },
        { value: 10, label: '10 minutes', description: 'Most popular choice' },
        { value: 15, label: '15 minutes', description: 'For deeper practice' },
        { value: 20, label: '20 minutes', description: 'Advanced practitioners' },
    ];

    const interestOptions = [
        { value: 'stress_relief', label: 'Stress Relief', icon: '🍃' },
        { value: 'better_sleep', label: 'Better Sleep', icon: '😴' },
        { value: 'focus', label: 'Focus & Productivity', icon: '🎯' },
        { value: 'anxiety', label: 'Anxiety Management', icon: '🧘' },
        { value: 'happiness', label: 'Happiness', icon: '😊' },
        { value: 'self_growth', label: 'Personal Growth', icon: '🌱' },
    ];

    return (
        <>
            <Head title="Welcome to Headspace" />
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
                <div className="mx-auto max-w-4xl px-4 py-12">
                    {/* Progress bar */}
                    <div className="mb-8">
                        <div className="h-2 w-full rounded-full bg-gray-200">
                            <div
                                className="h-2 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 transition-all duration-300"
                                style={{ width: `${(step / 4) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Step 1: Welcome */}
                    {step === 1 && (
                        <div className="space-y-8 text-center">
                            <div className="space-y-4">
                                <h1 className="text-4xl font-bold">Welcome to Your Mindfulness Journey</h1>
                                <p className="text-muted-foreground text-lg">Let's personalize your experience in a few simple steps</p>
                            </div>
                            <div className="mx-auto max-w-md">
                                <img src="/images/onboarding/welcome.svg" alt="Welcome" className="w-full" />
                            </div>
                            <Button onClick={() => setStep(2)} className="bg-gradient-to-r from-amber-500 to-yellow-600 px-8 py-6 text-lg text-white">
                                Let's Begin
                            </Button>
                        </div>
                    )}

                    {/* Step 2: Time Preference */}
                    {step === 2 && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold">When do you prefer to meditate?</h2>
                                <p className="text-muted-foreground mt-2">Choose your ideal meditation time</p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                {timePreferences.map((time) => (
                                    <button
                                        key={time.value}
                                        onClick={() => setData('preferred_time', time.value)}
                                        className={`flex flex-col items-center gap-4 rounded-xl border-2 p-6 transition-all hover:bg-white/50 ${
                                            data.preferred_time === time.value
                                                ? 'border-amber-500 bg-white shadow-lg'
                                                : 'border-transparent bg-white/30'
                                        }`}
                                    >
                                        <time.icon className="h-8 w-8 text-amber-500" />
                                        <div className="text-center">
                                            <h3 className="font-semibold">{time.label}</h3>
                                            <p className="text-muted-foreground text-sm">{time.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between">
                                <Button onClick={() => setStep(1)} variant="outline">
                                    Back
                                </Button>
                                <Button onClick={() => setStep(3)} className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white">
                                    Continue
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Daily Goal */}
                    {step === 3 && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold">Set Your Daily Goal</h2>
                                <p className="text-muted-foreground mt-2">How long would you like to meditate each day?</p>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                {goalOptions.map((goal) => (
                                    <button
                                        key={goal.value}
                                        onClick={() => setData('daily_goal_minutes', goal.value)}
                                        className={`flex items-center gap-4 rounded-xl border-2 p-6 transition-all hover:bg-white/50 ${
                                            data.daily_goal_minutes === goal.value
                                                ? 'border-amber-500 bg-white shadow-lg'
                                                : 'border-transparent bg-white/30'
                                        }`}
                                    >
                                        <Target className="h-8 w-8 text-amber-500" />
                                        <div className="text-left">
                                            <h3 className="font-semibold">{goal.label}</h3>
                                            <p className="text-muted-foreground text-sm">{goal.description}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between">
                                <Button onClick={() => setStep(2)} variant="outline">
                                    Back
                                </Button>
                                <Button onClick={() => setStep(4)} className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white">
                                    Continue
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Initial Mood & Interests */}
                    {step === 4 && (
                        <div className="space-y-8">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold">How are you feeling today?</h2>
                                <p className="text-muted-foreground mt-2">Let's track your mood and interests</p>
                            </div>

                            {/* Mood Rating */}
                            <div className="space-y-4">
                                <label className="block text-center text-lg font-medium">Your Current Mood</label>
                                <div className="flex justify-center gap-4">
                                    {[1, 2, 3, 4, 5].map((rating) => (
                                        <button
                                            key={rating}
                                            onClick={() => setData('initial_mood', rating)}
                                            className={`rounded-full p-2 transition-all hover:scale-110 ${
                                                data.initial_mood === rating ? 'scale-110 text-amber-500' : 'text-gray-400'
                                            }`}
                                        >
                                            {rating === 1 && '😢'}
                                            {rating === 2 && '😕'}
                                            {rating === 3 && '😐'}
                                            {rating === 4 && '🙂'}
                                            {rating === 5 && '😊'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Interests */}
                            <div className="space-y-4">
                                <label className="block text-center text-lg font-medium">What are you interested in?</label>
                                <div className="grid gap-3 md:grid-cols-3">
                                    {interestOptions.map((interest) => (
                                        <button
                                            key={interest.value}
                                            onClick={() => {
                                                const newInterests = data.interests.includes(interest.value)
                                                    ? data.interests.filter((i) => i !== interest.value)
                                                    : [...data.interests, interest.value];
                                                setData('interests', newInterests);
                                            }}
                                            className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all hover:bg-white/50 ${
                                                data.interests.includes(interest.value)
                                                    ? 'border-amber-500 bg-white shadow-lg'
                                                    : 'border-transparent bg-white/30'
                                            }`}
                                        >
                                            <span className="text-2xl">{interest.icon}</span>
                                            <span className="font-medium">{interest.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <Button onClick={() => setStep(3)} variant="outline">
                                    Back
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white"
                                    disabled={processing}
                                >
                                    Complete Setup
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
