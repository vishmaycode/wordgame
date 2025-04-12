// src/hooks/useTheme.ts
import { useEffect, useState } from 'react';
import type { Theme } from '../types';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem('theme');
        return (stored === 'light' || stored === 'dark') ? stored : 'dark';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    };

    return { theme, toggleTheme };
}
