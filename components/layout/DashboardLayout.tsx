import { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
	children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<div className='min-h-screen bg-white flex flex-col md:flex-row'>
			<Sidebar />
			<div className='flex-1 flex flex-col'>
				<Header />
				<main className='flex-1 p-4 md:p-6 bg-gray-50'>{children}</main>
				<Footer />
			</div>
		</div>
	);
}
