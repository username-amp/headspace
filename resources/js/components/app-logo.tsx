import { Moon, Music } from 'lucide-react';

export default function AppLogo({ className }: { className?: string }) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-1">
                <div className="relative h-full w-full">
                    <Moon className="absolute inset-0 h-full w-full text-white" strokeWidth={2} />
                    <Music className="absolute inset-0 h-full w-full text-white opacity-30" strokeWidth={2} />
                </div>
            </div>
        </div>
    );
}
