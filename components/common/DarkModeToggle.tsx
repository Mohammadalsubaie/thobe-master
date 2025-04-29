'use client';

import { useDarkMode } from '@/lib/hooks/useDarkMode';
import { Moon, Sun } from 'lucide-react';

export function DarkModeToggle() {
	const { isDarkMode, toggleDarkMode } = useDarkMode();

	return (
		<button
			onClick={toggleDarkMode}
			className='p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
			aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
		>
			{isDarkMode ? <Sun className='h-5 w-5 text-yellow-500' /> : <Moon className='h-5 w-5 text-gray-700' />}
		</button>
	);
}
