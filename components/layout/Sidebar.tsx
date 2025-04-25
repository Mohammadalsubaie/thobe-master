'use client';

import { BarChart2, Home, Menu, Package, Scissors, Settings, ShoppingBag, Users, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navigation = [
		{ name: 'لوحة التحكم', href: '/dashboard', icon: Home },
		{ name: 'العملاء', href: '/dashboard/customers', icon: Users },
		{ name: 'الطلبات', href: '/dashboard/orders', icon: ShoppingBag },
		{ name: 'المخزون', href: '/dashboard/inventory', icon: Package },
		{ name: 'اصلاح ثياب', href: '/dashboard/repairs', icon: Scissors },
		{ name: 'التقارير', href: '/dashboard/reports', icon: BarChart2 },
		{ name: 'الإعدادات', href: '/dashboard/settings', icon: Settings },
	];

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<>
			{/* Mobile menu button */}
			<div className='md:hidden fixed top-4 right-4 z-50'>
				<button
					onClick={toggleMobileMenu}
					className='p-2 rounded-md bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-white'
				>
					{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			{/* Mobile Sidebar */}
			{isMobileMenuOpen && (
				<div className='fixed inset-0 bg-gray-800 bg-opacity-75 z-40 md:hidden'>
					<div className='fixed inset-y-0 right-0 max-w-xs w-full bg-green-800 text-white shadow-xl z-50 overflow-y-auto'>
						<div className='p-6'>
							<div className='flex items-center justify-between'>
								<h1 className='text-2xl font-bold'>ثوب ماستر</h1>
								<button
									onClick={toggleMobileMenu}
									className='p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white'
								>
									<X size={24} />
								</button>
							</div>
							<nav className='mt-8'>
								<ul className='space-y-2'>
									{navigation.map((item) => {
										const isActive = pathname === item.href;
										return (
											<li key={item.name}>
												<Link
													href={item.href}
													onClick={toggleMobileMenu}
													className={`flex items-center gap-3 px-4 py-3 rounded-md ${
														isActive
															? 'bg-green-900 text-white'
															: 'text-white hover:bg-green-700'
													}`}
												>
													<item.icon size={20} />
													<span>{item.name}</span>
												</Link>
											</li>
										);
									})}
								</ul>
							</nav>
						</div>
					</div>
				</div>
			)}

			{/* Desktop Sidebar */}
			<div className='h-screen w-64 bg-green-800 text-white hidden md:block sticky top-0 overflow-y-auto'>
				<div className='p-6'>
					<h1 className='text-2xl font-bold'>ثوب ماستر</h1>
				</div>
				<nav className='mt-6'>
					<ul className='space-y-2 px-4'>
						{navigation.map((item) => {
							const isActive = pathname === item.href;
							return (
								<li key={item.name}>
									<Link
										href={item.href}
										className={`flex items-center gap-3 px-4 py-3 rounded-md ${
											isActive ? 'bg-green-900 text-white' : 'text-white hover:bg-green-700'
										}`}
									>
										<item.icon size={20} />
										<span>{item.name}</span>
									</Link>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</>
	);
}
