import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from '@/components/theme-provider';
import { type Page } from '@inertiajs/core';
import { type Theme } from '@/components/theme-provider';
import { type SharedData } from '@/types';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);
        const page = props.initialPage as unknown as Page<SharedData>;
        const theme = (page.props.auth.user?.appearance || 'light') as Theme;

        root.render(
            <ThemeProvider theme={theme}>
                <App {...props} />
            </ThemeProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
