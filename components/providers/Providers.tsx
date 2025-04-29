'use client';

import { DarkModeProvider } from '@/lib/hooks/useDarkMode';

export function Providers({ children }: { children: React.ReactNode }) {
	return <DarkModeProvider>{children}</DarkModeProvider>;
}
