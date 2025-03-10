import { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';

type ThemeProviderProps = {
    children: React.ReactNode;
    theme?: Theme;
};

type ThemeProviderState = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
    theme: 'light',
    setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, theme = 'light' }: ThemeProviderProps) {
    const [currentTheme, setCurrentTheme] = useState<Theme>(theme);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        if (currentTheme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.add(systemTheme);

            // Listen for system theme changes
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handler = (e: MediaQueryListEvent) => {
                root.classList.remove('light', 'dark');
                root.classList.add(e.matches ? 'dark' : 'light');
            };

            mediaQuery.addEventListener('change', handler);
            return () => mediaQuery.removeEventListener('change', handler);
        } else {
            root.classList.add(currentTheme);
        }
    }, [currentTheme]);

    const setTheme = (theme: Theme) => {
        setCurrentTheme(theme);
        localStorage.setItem('theme', theme);
    };

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setCurrentTheme(storedTheme as Theme);
        }
    }, []);

    return (
        <ThemeProviderContext.Provider value={{ theme: currentTheme, setTheme }}>
            {children}
        </ThemeProviderContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeProviderContext);

    if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

    return context;
};
