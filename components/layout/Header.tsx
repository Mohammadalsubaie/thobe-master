'use client';

import { signOut } from 'firebase/auth';
import { Bell, ChevronDown, LogOut, Search, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '../../lib/db/firebase';

export default function Header() {
	const router = useRouter();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
	const [userName, setUserName] = useState('');
	const [notifications, setNotifications] = useState([
		{ id: 1, message: 'طلب جديد من أحمد محمد', time: '10:30 ص', read: false },
		{ id: 2, message: 'تم الانتهاء من طلب خالد سعيد', time: '9:15 ص', read: true },
		{ id: 3, message: 'تذكير: طلب محمد سالم يتم تسليمه اليوم', time: 'أمس', read: false },
	]);

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user && user.displayName) {
				setUserName(user.displayName);
			}
		});

		return () => unsubscribe();
	}, []);

	const handleLogout = async () => {
		try {
			await signOut(auth);
			router.push('/auth/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	const toggleUserMenu = () => {
		setIsMenuOpen(!isMenuOpen);
		if (isNotificationsOpen) setIsNotificationsOpen(false);
	};

	const toggleNotificationsMenu = () => {
		setIsNotificationsOpen(!isNotificationsOpen);
		if (isMenuOpen) setIsMenuOpen(false);
	};

	const unreadCount = notifications.filter((n) => !n.read).length;

	return (
		<header className='bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between sticky top-0 z-10'>
			<div className='flex items-center'>
				<div className='relative rounded-md shadow-sm min-w-[200px] md:min-w-[300px]'>
					<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
						<Search className='h-5 w-5 text-gray-400' aria-hidden='true' />
					</div>
					<input
						type='text'
						name='search'
						id='search'
						className='block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
						placeholder='بحث...'
					/>
				</div>
			</div>

			<div className='flex items-center space-x-4 space-x-reverse'>
				{/* Notifications */}
				<div className='relative'>
					<button className='relative text-gray-500 hover:text-gray-700' onClick={toggleNotificationsMenu}>
						<Bell size={20} />
						{unreadCount > 0 && (
							<span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center'>
								{unreadCount}
							</span>
						)}
					</button>

					{isNotificationsOpen && (
						<div className='absolute left-0 mt-2 w-72 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50'>
							<div className='px-4 py-2 border-b border-gray-200'>
								<h3 className='text-sm font-semibold text-gray-800'>الإشعارات</h3>
							</div>
							<div className='max-h-64 overflow-y-auto'>
								{notifications.map((notification) => (
									<div
										key={notification.id}
										className={`px-4 py-2 hover:bg-gray-50 ${
											!notification.read ? 'bg-blue-50' : ''
										}`}
									>
										<div className='flex justify-between'>
											<p className='text-sm font-medium text-gray-800'>{notification.message}</p>
											{!notification.read && (
												<span className='h-2 w-2 bg-blue-500 rounded-full'></span>
											)}
										</div>
										<p className='text-xs text-gray-500 mt-1'>{notification.time}</p>
									</div>
								))}
							</div>
							<div className='px-4 py-2 border-t border-gray-200 text-center'>
								<Link
									href='/dashboard/notifications'
									className='text-xs text-green-600 hover:text-green-800 font-medium'
								>
									عرض جميع الإشعارات
								</Link>
							</div>
						</div>
					)}
				</div>

				{/* User Menu */}
				<div className='relative'>
					<button
						className='flex items-center space-x-2 space-x-reverse text-gray-700 hover:text-gray-900'
						onClick={toggleUserMenu}
					>
						<div className='h-8 w-8 rounded-full bg-green-100 flex items-center justify-center'>
							<User size={18} className='text-green-600' />
						</div>
						<span className='hidden md:inline-block font-medium'>{userName || 'مستخدم'}</span>
						<ChevronDown size={16} />
					</button>

					{isMenuOpen && (
						<div className='absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50'>
							<Link
								href='/dashboard/profile'
								className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
							>
								الملف الشخصي
							</Link>
							<Link
								href='/dashboard/settings'
								className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
							>
								الإعدادات
							</Link>
							<button
								onClick={handleLogout}
								className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
							>
								<div className='flex items-center space-x-2 space-x-reverse'>
									<LogOut size={16} />
									<span>تسجيل الخروج</span>
								</div>
							</button>
						</div>
					)}
				</div>
			</div>
		</header>
	);
}
