'use client';

import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { auth } from '../../lib/db/firebase';

export default function Layout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setLoading(false);
			} else {
				// User is not logged in, redirect to login page
				router.push('/auth/login');
			}
		});

		return () => unsubscribe();
	}, [router]);

	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50'>
				<div className='w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin'></div>
			</div>
		);
	}

	return <DashboardLayout>{children}</DashboardLayout>;
}
