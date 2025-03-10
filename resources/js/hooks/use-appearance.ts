import { useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { useTheme } from '@/components/theme-provider';
import type { Theme } from '@/components/theme-provider';

export type Appearance = Theme;

export function initializeTheme() {
    const root = window.document.documentElement;
    root.classList.add('light'); // Default to light mode
}

export function useAppearance() {
    const { auth } = usePage<SharedData>().props;
    const { theme, setTheme } = useTheme();
    const appearance = auth.user?.appearance as Appearance || 'light';

    const updateAppearance = (newAppearance: Appearance) => {
        // Update theme context
        setTheme(newAppearance);

        // Save to server
        router.post('/settings/appearance', {
            appearance: newAppearance,
        });
    };

    // Sync theme with user's saved appearance
    useEffect(() => {
        if (appearance !== theme) {
            setTheme(appearance);
        }
    }, [appearance, theme, setTheme]);

    return { appearance, updateAppearance };
}
