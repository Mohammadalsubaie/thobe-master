'use client';

import { AlertTriangle, Calendar, CheckCircle, Clock, ShoppingBag, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [stats, setStats] = useState({
		totalOrders: 0,
		pendingOrders: 0,
		completedOrders: 0,
		totalCustomers: 0,
		totalRevenue: 0,
	});

	// Mock recent orders
	const recentOrders = [
		{
			id: '10001',
			customer: 'أحمد محمد',
			date: new Date(2025, 3, 15),
			status: 'ready',
			price: 350,
		},
		{
			id: '10002',
			customer: 'خالد عبدالله',
			date: new Date(2025, 3, 14),
			status: 'in-progress',
			price: 270,
		},
		{
			id: '10003',
			customer: 'محمد سعيد',
			date: new Date(2025, 3, 12),
			status: 'delivered',
			price: 420,
		},
		{
			id: '10004',
			customer: 'سعود ناصر',
			date: new Date(2025, 3, 10),
			status: 'needs-repair',
			price: 380,
		},
	];

	// Fetch dashboard data
	useEffect(() => {
		const fetchDashboardData = async () => {
			try {
				// Replace with actual API call
				// const response = await fetch('/api/dashboard');
				// const data = await response.json();

				// Mock data for now
				setTimeout(() => {
					setStats({
						totalOrders: 125,
						pendingOrders: 28,
						completedOrders: 97,
						totalCustomers: 85,
						totalRevenue: 14750,
					});
					setIsLoading(false);
				}, 1000);
			} catch (error) {
				console.error('Error fetching dashboard data:', error);
				setIsLoading(false);
			}
		};

		fetchDashboardData();
	}, []);

	if (isLoading) {
		return <div className='flex items-center justify-center h-96'>جاري التحميل...</div>;
	}

	const statsItems = [
		{
			name: 'إجمالي الطلبات',
			value: stats.totalOrders,
			icon: ShoppingBag,
			color: 'bg-blue-100 text-blue-600',
		},
		{
			name: 'طلبات قيد التنفيذ',
			value: stats.pendingOrders,
			icon: Clock,
			color: 'bg-yellow-100 text-yellow-600',
		},
		{
			name: 'طلبات مكتملة',
			value: stats.completedOrders,
			icon: CheckCircle,
			color: 'bg-green-100 text-green-600',
		},
		{
			name: 'إجمالي العملاء',
			value: stats.totalCustomers,
			icon: Users,
			color: 'bg-purple-100 text-purple-600',
		},
		{
			name: 'إجمالي الإيرادات',
			value: `${stats.totalRevenue.toLocaleString()} ر.س`,
			icon: null, // نستخدم صورة بدلاً من الأيقونة
			color: 'bg-indigo-100 text-indigo-600',
			imageSrc: '/images/Saudi_Riyal_Symbol.png', // مسار الصورة
		},
	];

	const getStatusClass = (status: string) => {
		switch (status) {
			case 'ready':
				return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
			case 'in-progress':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
			case 'delivered':
				return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
			case 'needs-repair':
				return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'ready':
				return 'جاهز';
			case 'in-progress':
				return 'قيد التنفيذ';
			case 'delivered':
				return 'تم التسليم';
			case 'needs-repair':
				return 'بحاجة للإصلاح';
			default:
				return 'غير معروف';
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>لوحة التحكم</h1>
				<div className='flex space-x-4 space-x-reverse'>
					<Link
						href='/dashboard/orders/new'
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
					>
						<ShoppingBag className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
						طلب جديد
					</Link>
					<Link
						href='/dashboard/customers/new'
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-secondary hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary dark:focus:ring-offset-gray-800'
					>
						<Users className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
						عميل جديد
					</Link>
				</div>
			</div>

			{/* Stats Cards */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
				{statsItems.map((item) => (
					<div
						key={item.name}
						className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6 flex items-center space-x-4 space-x-reverse'
					>
						<div className={`p-3 rounded-full ${item.color}`}>
							{item.icon ? (
								<item.icon className='h-6 w-6' />
							) : (
								<div className='relative h-6 w-6'>
									<Image
										src={item.imageSrc || '/images/saudi-riyal.png'}
										alt='Saudi Riyal'
										fill
										sizes='24px'
										style={{ objectFit: 'contain' }}
									/>
								</div>
							)}
						</div>
						<div>
							<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>{item.name}</p>
							<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>{item.value}</p>
						</div>
					</div>
				))}
			</div>

			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* Recent Orders */}
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
						<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>أحدث الطلبات</h2>
						<Link
							href='/dashboard/orders'
							className='text-sm text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary'
						>
							عرض الكل
						</Link>
					</div>
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
							<thead className='bg-gray-50 dark:bg-gray-700'>
								<tr>
									<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
										رقم الطلب
									</th>
									<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
										العميل
									</th>
									<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
										التاريخ
									</th>
									<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
										الحالة
									</th>
									<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
										السعر
									</th>
								</tr>
							</thead>
							<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
								{recentOrders.map((order) => (
									<tr key={order.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
										<td className='px-6 py-4 whitespace-nowrap'>
											<Link
												href={`/dashboard/orders/${order.id}`}
												className='text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary'
											>
												#{order.id}
											</Link>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
											{order.customer}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
											{order.date.toLocaleDateString('ar-SA')}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<span
												className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
													order.status
												)}`}
											>
												{getStatusText(order.status)}
											</span>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
											{order.price} ر.س
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Order Status */}
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
					<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>حالة الطلبات</h2>
					<div className='grid grid-cols-2 gap-4'>
						<div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800'>
							<div className='flex items-center justify-between'>
								<div className='bg-blue-100 dark:bg-blue-800 p-3 rounded-lg'>
									<Calendar className='h-6 w-6 text-blue-600 dark:text-blue-400' />
								</div>
								<span className='text-2xl font-bold text-blue-600 dark:text-blue-300'>18</span>
							</div>
							<p className='mt-2 text-sm text-blue-700 dark:text-blue-300'>طلبات اليوم</p>
						</div>

						<div className='bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800'>
							<div className='flex items-center justify-between'>
								<div className='bg-yellow-100 dark:bg-yellow-800 p-3 rounded-lg'>
									<Clock className='h-6 w-6 text-yellow-600 dark:text-yellow-400' />
								</div>
								<span className='text-2xl font-bold text-yellow-600 dark:text-yellow-300'>
									{stats.pendingOrders}
								</span>
							</div>
							<p className='mt-2 text-sm text-yellow-700 dark:text-yellow-300'>قيد التنفيذ</p>
						</div>

						<div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800'>
							<div className='flex items-center justify-between'>
								<div className='bg-green-100 dark:bg-green-800 p-3 rounded-lg'>
									<CheckCircle className='h-6 w-6 text-green-600 dark:text-green-400' />
								</div>
								<span className='text-2xl font-bold text-green-600 dark:text-green-300'>
									{stats.completedOrders}
								</span>
							</div>
							<p className='mt-2 text-sm text-green-700 dark:text-green-300'>تم التسليم</p>
						</div>

						<div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800'>
							<div className='flex items-center justify-between'>
								<div className='bg-red-100 dark:bg-red-800 p-3 rounded-lg'>
									<AlertTriangle className='h-6 w-6 text-red-600 dark:text-red-400' />
								</div>
								<span className='text-2xl font-bold text-red-600 dark:text-red-300'>5</span>
							</div>
							<p className='mt-2 text-sm text-red-700 dark:text-red-300'>بحاجة للإصلاح</p>
						</div>
					</div>

					<div className='mt-6'>
						<h3 className='text-md font-medium text-gray-700 dark:text-gray-300 mb-3'>
							الطلبات المتوقع تسليمها اليوم
						</h3>
						<div className='space-y-3'>
							<div className='flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
								<div>
									<p className='font-medium text-gray-800 dark:text-gray-200'>أحمد محمد</p>
									<p className='text-sm text-gray-500 dark:text-gray-400'>#10001</p>
								</div>
								<div className='text-right'>
									<p className='text-sm text-gray-600 dark:text-gray-400'>2:00 م</p>
									<p className='text-sm font-medium text-green-600 dark:text-green-400'>جاهز</p>
								</div>
							</div>
							<div className='flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
								<div>
									<p className='font-medium text-gray-800 dark:text-gray-200'>خالد عبدالله</p>
									<p className='text-sm text-gray-500 dark:text-gray-400'>#10002</p>
								</div>
								<div className='text-right'>
									<p className='text-sm text-gray-600 dark:text-gray-400'>4:30 م</p>
									<p className='text-sm font-medium text-yellow-600 dark:text-yellow-400'>
										قيد التنفيذ
									</p>
								</div>
							</div>
							<div className='flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
								<div>
									<p className='font-medium text-gray-800 dark:text-gray-200'>سعود ناصر</p>
									<p className='text-sm text-gray-500 dark:text-gray-400'>#10004</p>
								</div>
								<div className='text-right'>
									<p className='text-sm text-gray-600 dark:text-gray-400'>5:00 م</p>
									<p className='text-sm font-medium text-red-600 dark:text-red-400'>بحاجة للإصلاح</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
