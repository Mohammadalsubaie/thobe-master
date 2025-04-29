'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type DarkModeContextType = {
	isDarkMode: boolean;
	toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
	const [isDarkMode, setIsDarkMode] = useState(false);

	useEffect(() => {
		// Check local storage and system preference on mount
		const storedTheme = localStorage.getItem('theme');
		const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		setIsDarkMode(storedTheme === 'dark' || (!storedTheme && systemPrefersDark));
	}, []);

	useEffect(() => {
		// Update document class and local storage when dark mode changes
		if (isDarkMode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}, [isDarkMode]);

	const toggleDarkMode = () => {
		setIsDarkMode((prev) => !prev);
	};

	return <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</DarkModeContext.Provider>;
}

export function useDarkMode() {
	const context = useContext(DarkModeContext);
	if (context === undefined) {
		throw new Error('useDarkMode must be used within a DarkModeProvider');
	}
	return context;
}
