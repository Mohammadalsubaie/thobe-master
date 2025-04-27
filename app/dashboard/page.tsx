'use client';

import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	Clock,
	LayoutDashboard,
	Plus,
	ShoppingBag,
	Users,
	X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

// أنواع الويدجيت المتاحة
type WidgetType =
	| 'stats'
	| 'recent-orders'
	| 'order-status'
	| 'deliveries-today'
	| 'revenue-chart'
	| 'top-customers'
	| 'inventory-status'
	| 'quick-actions';

// واجهة الويدجيت
interface Widget {
	id: string;
	type: WidgetType;
	title: string;
	size: 'small' | 'medium' | 'large' | 'full';
	enabled: boolean;
	order: number;
}

// بيانات الإحصائيات
interface DashboardStats {
	totalOrders: number;
	pendingOrders: number;
	completedOrders: number;
	totalCustomers: number;
	totalRevenue: number;
}

// تعريف نوع StatsItem
interface StatsItem {
	name: string;
	value: number | string;
	icon?: typeof ShoppingBag; // نوع الأيقونة من lucide
	useImage?: boolean;
	imageSrc?: string;
	color: string;
}

export default function DashboardPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [stats, setStats] = useState<DashboardStats>({
		totalOrders: 0,
		pendingOrders: 0,
		completedOrders: 0,
		totalCustomers: 0,
		totalRevenue: 0,
	});

	// قائمة الويدجيت الافتراضية
	const [availableWidgets, setAvailableWidgets] = useState<Widget[]>([
		{ id: 'w1', type: 'stats', title: 'إحصائيات سريعة', size: 'full', enabled: true, order: 1 },
		{ id: 'w2', type: 'recent-orders', title: 'أحدث الطلبات', size: 'medium', enabled: true, order: 2 },
		{ id: 'w3', type: 'order-status', title: 'حالة الطلبات', size: 'medium', enabled: true, order: 3 },
		{ id: 'w4', type: 'deliveries-today', title: 'التسليمات اليوم', size: 'medium', enabled: false, order: 4 },
		{ id: 'w5', type: 'revenue-chart', title: 'الإيرادات', size: 'medium', enabled: false, order: 5 },
		{ id: 'w6', type: 'top-customers', title: 'أفضل العملاء', size: 'small', enabled: false, order: 6 },
		{ id: 'w7', type: 'inventory-status', title: 'حالة المخزون', size: 'small', enabled: false, order: 7 },
		{ id: 'w8', type: 'quick-actions', title: 'إجراءات سريعة', size: 'small', enabled: false, order: 8 },
	]);

	// حالة تحرير الويدجيت
	const [isEditingWidgets, setIsEditingWidgets] = useState(false);
	const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

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

				// تحميل إعدادات الويدجيت من التخزين المحلي
				const savedWidgets = localStorage.getItem('dashboardWidgets');
				if (savedWidgets) {
					setAvailableWidgets(JSON.parse(savedWidgets));
				}

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

	// تحديث الويدجيت في التخزين المحلي عند التغيير
	useEffect(() => {
		if (!isLoading) {
			localStorage.setItem('dashboardWidgets', JSON.stringify(availableWidgets));
		}
	}, [availableWidgets, isLoading]);

	// تغيير حالة تمكين ويدجيت
	const toggleWidgetEnabled = (widgetId: string) => {
		setAvailableWidgets((prev) =>
			prev.map((widget) => (widget.id === widgetId ? { ...widget, enabled: !widget.enabled } : widget))
		);
	};

	// تحريك ويدجيت للأعلى
	const moveWidgetUp = (index: number) => {
		if (index <= 0) return;

		setAvailableWidgets((prev) => {
			const newWidgets = [...prev];
			const temp = newWidgets[index];
			newWidgets[index] = newWidgets[index - 1];
			newWidgets[index - 1] = temp;

			// تحديث ترتيب الويدجيت
			return newWidgets.map((widget, idx) => ({ ...widget, order: idx + 1 }));
		});
	};

	// تحريك ويدجيت للأسفل
	const moveWidgetDown = (index: number) => {
		if (index >= availableWidgets.length - 1) return;

		setAvailableWidgets((prev) => {
			const newWidgets = [...prev];
			const temp = newWidgets[index];
			newWidgets[index] = newWidgets[index + 1];
			newWidgets[index + 1] = temp;

			// تحديث ترتيب الويدجيت
			return newWidgets.map((widget, idx) => ({ ...widget, order: idx + 1 }));
		});
	};

	const statsItems: StatsItem[] = [
		{
			name: 'إجمالي الطلبات',
			value: stats.totalOrders,
			icon: ShoppingBag,
			color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
		},
		{
			name: 'طلبات قيد التنفيذ',
			value: stats.pendingOrders,
			icon: Clock,
			color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
		},
		{
			name: 'طلبات مكتملة',
			value: stats.completedOrders,
			icon: CheckCircle,
			color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
		},
		{
			name: 'إجمالي العملاء',
			value: stats.totalCustomers,
			icon: Users,
			color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
		},
		{
			name: 'إجمالي الإيرادات',
			value: `${stats.totalRevenue.toLocaleString()}`,
			useImage: true,
			imageSrc: '/images/Saudi_Riyal_Symbol.png', // مسار الصورة من الأصول
			color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
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

	// رسم الويدجيت
	const renderWidget = (widget: Widget) => {
		switch (widget.type) {
			case 'stats':
				return (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4'>
						{statsItems.map((item) => (
							<div
								key={item.name}
								className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6 flex items-center space-x-4 space-x-reverse transition-all duration-300 hover:shadow-md'
							>
								<div className={`p-3 rounded-full ${item.color}`}>
									{item.useImage ? (
										<div className='relative h-6 w-6'>
											<Image
												src={item.imageSrc || '/images/Saudi_Riyal_Symbol.png'}
												alt='رمز الريال السعودي'
												fill
												sizes='24px'
												style={{ objectFit: 'contain' }}
											/>
										</div>
									) : item.icon ? (
										<item.icon className='h-6 w-6' />
									) : null}
								</div>
								<div>
									<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>{item.name}</p>
									<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
										{item.value} {item.useImage && <span>ر.س</span>}
									</p>
								</div>
							</div>
						))}
					</div>
				);

			case 'recent-orders':
				return (
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
						<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
							<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100'>أحدث الطلبات</h2>
							<Link
								href='/dashboard/orders'
								className='text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
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
													className='text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
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
												<div className='flex items-center'>
													{order.price}
													<div className='relative h-4 w-4 mr-1'>
														<Image
															src='/images/Saudi_Riyal_Symbol.png'
															alt='ر.س'
															fill
															sizes='16px'
															style={{ objectFit: 'contain' }}
														/>
													</div>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				);

			case 'order-status':
				return (
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
						<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>حالة الطلبات</h2>
						<div className='grid grid-cols-2 gap-4'>
							<div className='bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/50'>
								<div className='flex items-center justify-between'>
									<div className='bg-blue-100 dark:bg-blue-800 p-3 rounded-lg'>
										<Calendar className='h-6 w-6 text-blue-600 dark:text-blue-400' />
									</div>
									<span className='text-2xl font-bold text-blue-600 dark:text-blue-300'>18</span>
								</div>
								<p className='mt-2 text-sm text-blue-700 dark:text-blue-300'>طلبات اليوم</p>
							</div>

							<div className='bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800/50'>
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

							<div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/50'>
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

							<div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800/50'>
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
										<p className='text-sm font-medium text-red-600 dark:text-red-400'>
											بحاجة للإصلاح
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				);

			case 'deliveries-today':
				return (
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
						<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>
							التسليمات اليومية
						</h2>
						<div className='space-y-4'>
							<div className='bg-green-50 dark:bg-green-900/10 p-4 rounded-lg'>
								<div className='flex justify-between items-center'>
									<div className='flex flex-col'>
										<span className='text-sm text-gray-500 dark:text-gray-400'>
											إجمالي التسليمات اليوم
										</span>
										<span className='text-2xl font-bold text-gray-900 dark:text-gray-100'>12</span>
									</div>
									<div className='p-3 bg-green-100 dark:bg-green-800 rounded-full'>
										<Calendar className='h-5 w-5 text-green-600 dark:text-green-400' />
									</div>
								</div>
							</div>

							<div className='divide-y divide-gray-200 dark:divide-gray-700'>
								{[
									{ time: '11:00 ص', customer: 'صالح العتيبي', status: 'ready' },
									{ time: '1:30 م', customer: 'عبدالله الدوسري', status: 'in-progress' },
									{ time: '3:00 م', customer: 'فهد السلمي', status: 'ready' },
									{ time: '4:30 م', customer: 'راشد المري', status: 'in-progress' },
								].map((delivery, index) => (
									<div key={index} className='py-3 flex justify-between items-center'>
										<div>
											<span className='block text-gray-800 dark:text-gray-200 font-medium'>
												{delivery.customer}
											</span>
											<span className='text-sm text-gray-500 dark:text-gray-400'>
												{delivery.time}
											</span>
										</div>
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
												delivery.status
											)}`}
										>
											{getStatusText(delivery.status)}
										</span>
									</div>
								))}
							</div>

							<div className='pt-3 text-center'>
								<Link
									href='/dashboard/deliveries'
									className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm'
								>
									عرض جدول التسليمات كاملاً
								</Link>
							</div>
						</div>
					</div>
				);

			case 'revenue-chart':
				return (
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
						<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>الإيرادات</h2>
						<div className='h-64 flex flex-col justify-center items-center'>
							<div className='mb-2 text-indigo-600 dark:text-indigo-400'>
								<div className='relative h-12 w-12'>
									<Image
										src='/images/Saudi_Riyal_Symbol.png'
										alt='رمز الريال السعودي'
										fill
										sizes='48px'
										style={{ objectFit: 'contain' }}
									/>
								</div>
							</div>
							<p className='text-xl font-bold text-gray-900 dark:text-gray-100'>14,750 ر.س</p>
							<p className='text-sm text-gray-500 dark:text-gray-400'>إجمالي الإيرادات هذا الشهر</p>
							<div className='mt-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5'>
								<div className='bg-indigo-500 h-2.5 rounded-full' style={{ width: '70%' }}></div>
							</div>
							<p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>70% من الهدف الشهري</p>
							<Link
								href='/dashboard/reports/revenue'
								className='mt-6 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm'
							>
								عرض التقرير المفصل
							</Link>
						</div>
					</div>
				);

			case 'top-customers':
				return (
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
						<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>أفضل العملاء</h2>
						<div className='space-y-4'>
							{[
								{ name: 'محمد العبدالله', count: 12, total: 4500 },
								{ name: 'أحمد السالم', count: 8, total: 3200 },
								{ name: 'خالد المنصور', count: 6, total: 2800 },
							].map((customer, index) => (
								<div key={index} className='flex items-center'>
									<div className='w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-bold mr-3'>
										{index + 1}
									</div>
									<div className='flex-1'>
										<p className='font-medium text-gray-800 dark:text-gray-200'>{customer.name}</p>
										<p className='text-xs text-gray-500 dark:text-gray-400'>
											{customer.count} طلب | {customer.total}
											<span className='inline-block relative h-3 w-3 mx-1 -mt-0.5'>
												<Image
													src='/images/Saudi_Riyal_Symbol.png'
													alt='ر.س'
													fill
													sizes='12px'
													style={{ objectFit: 'contain' }}
												/>
											</span>
										</p>
									</div>
								</div>
							))}
							<div className='pt-3 text-center'>
								<Link
									href='/dashboard/customers'
									className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm'
								>
									عرض جميع العملاء
								</Link>
							</div>
						</div>
					</div>
				);

			case 'inventory-status':
				return (
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
						<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>حالة المخزون</h2>
						<div className='space-y-4'>
							<div className='flex items-center justify-between'>
								<span className='text-gray-700 dark:text-gray-300'>الأقمشة</span>
								<div className='w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
									<div className='bg-green-500 h-2.5 rounded-full' style={{ width: '85%' }}></div>
								</div>
								<span className='text-gray-700 dark:text-gray-300'>85%</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-gray-700 dark:text-gray-300'>الخيوط</span>
								<div className='w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
									<div className='bg-yellow-500 h-2.5 rounded-full' style={{ width: '45%' }}></div>
								</div>
								<span className='text-gray-700 dark:text-gray-300'>45%</span>
							</div>
							<div className='flex items-center justify-between'>
								<span className='text-gray-700 dark:text-gray-300'>الأزرار</span>
								<div className='w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
									<div className='bg-red-500 h-2.5 rounded-full' style={{ width: '15%' }}></div>
								</div>
								<span className='text-gray-700 dark:text-gray-300'>15%</span>
							</div>
							<div className='pt-3 text-center'>
								<Link
									href='/dashboard/inventory'
									className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm'
								>
									إدارة المخزون
								</Link>
							</div>
						</div>
					</div>
				);

			case 'quick-actions':
				return (
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
						<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4'>إجراءات سريعة</h2>
						<div className='grid grid-cols-2 gap-3'>
							<Link
								href='/dashboard/orders/new'
								className='p-3 flex flex-col items-center justify-center bg-primary-50 dark:bg-primary-900/10 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20'
							>
								<ShoppingBag className='h-6 w-6 mb-1' />
								<span className='text-sm'>طلب جديد</span>
							</Link>

							<Link
								href='/dashboard/customers/new'
								className='p-3 flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/10 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20'
							>
								<Users className='h-6 w-6 mb-1' />
								<span className='text-sm'>عميل جديد</span>
							</Link>

							<Link
								href='/dashboard/inventory/add'
								className='p-3 flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/10 rounded-lg text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20'
							>
								<Plus className='h-6 w-6 mb-1' />
								<span className='text-sm'>إضافة مخزون</span>
							</Link>

							<Link
								href='/dashboard/reports'
								className='p-3 flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900/10 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20'
							>
								<Calendar className='h-6 w-6 mb-1' />
								<span className='text-sm'>التقارير</span>
							</Link>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	// مودال تخصيص الويدجيت
	const WidgetCustomizationModal = () => {
		if (typeof document === 'undefined') return null;

		return createPortal(
			<div className='fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4'>
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col'>
					<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
						<h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>تخصيص لوحة التحكم</h2>
						<button
							onClick={() => setIsEditingWidgets(false)}
							className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
						>
							<X className='h-6 w-6' />
						</button>
					</div>

					<div className='p-6 overflow-y-auto flex-1'>
						<p className='text-gray-600 dark:text-gray-300 mb-4'>
							يمكنك تخصيص لوحة التحكم بإعادة ترتيب الويدجيت وتفعيل أو تعطيل الويدجيت حسب احتياجاتك.
						</p>

						<div className='space-y-2'>
							{availableWidgets
								.sort((a, b) => a.order - b.order)
								.map((widget, index) => (
									<div
										key={widget.id}
										className={`bg-gray-50 dark:bg-gray-700 rounded-lg border ${
											draggedWidget === widget.id
												? 'border-blue-500 dark:border-blue-400'
												: 'border-gray-200 dark:border-gray-600'
										} p-3 flex items-center justify-between`}
									>
										<div className='flex items-center'>
											<div className='flex flex-col mr-3'>
												<button
													onClick={() => moveWidgetUp(index)}
													disabled={index === 0}
													className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed'
												>
													<ChevronUp className='h-5 w-5' />
												</button>
												<button
													onClick={() => moveWidgetDown(index)}
													disabled={index === availableWidgets.length - 1}
													className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed'
												>
													<ChevronDown className='h-5 w-5' />
												</button>
											</div>
											<div>
												<p className='font-medium text-gray-800 dark:text-gray-200'>
													{widget.title}
												</p>
												<p className='text-xs text-gray-500 dark:text-gray-400'>
													{widget.size === 'small'
														? 'صغير'
														: widget.size === 'medium'
														? 'متوسط'
														: widget.size === 'large'
														? 'كبير'
														: 'عرض كامل'}
												</p>
											</div>
										</div>
										<div>
											<label className='inline-flex items-center cursor-pointer'>
												<input
													type='checkbox'
													className='sr-only peer'
													checked={widget.enabled}
													onChange={() => toggleWidgetEnabled(widget.id)}
												/>
												<div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300/25 dark:peer-focus:ring-blue-800/25 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
											</label>
										</div>
									</div>
								))}
						</div>
					</div>

					<div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end'>
						<button
							onClick={() => setIsEditingWidgets(false)}
							className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
						>
							حفظ التغييرات
						</button>
					</div>
				</div>
			</div>,
			document.body
		);
	};

	// تنظيم الشبكة بناءً على أحجام الويدجيت
	const renderWidgetGrid = () => {
		const enabledWidgets = availableWidgets.filter((widget) => widget.enabled).sort((a, b) => a.order - b.order);

		// ويدجيت كاملة العرض
		const fullWidgets = enabledWidgets.filter((w) => w.size === 'full');

		// ويدجيت متوسطة وكبيرة (تأخذ نصف العرض في الشاشات الكبيرة)
		const mediumWidgets = enabledWidgets.filter((w) => w.size === 'medium' || w.size === 'large');

		// ويدجيت صغيرة (تأخذ ثلث أو ربع العرض)
		const smallWidgets = enabledWidgets.filter((w) => w.size === 'small');

		return (
			<div className='space-y-6'>
				{/* ويدجيت كاملة العرض */}
				{fullWidgets.map((widget) => (
					<div key={widget.id} className='w-full'>
						{renderWidget(widget)}
					</div>
				))}

				{/* ويدجيت متوسطة (عرضها نصف الشاشة) */}
				{mediumWidgets.length > 0 && (
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						{mediumWidgets.map((widget) => (
							<div key={widget.id}>{renderWidget(widget)}</div>
						))}
					</div>
				)}

				{/* ويدجيت صغيرة (عرضها ثلث أو ربع الشاشة) */}
				{smallWidgets.length > 0 && (
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{smallWidgets.map((widget) => (
							<div key={widget.id}>{renderWidget(widget)}</div>
						))}
					</div>
				)}
			</div>
		);
	};

	if (isLoading) {
		return (
			<div className='flex flex-col items-center justify-center h-96'>
				<div className='w-12 h-12 border-4 border-t-blue-600 border-gray-200 dark:border-gray-700 rounded-full animate-spin mb-4'></div>
				<p className='text-gray-700 dark:text-gray-300'>جاري تحميل البيانات...</p>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>لوحة التحكم</h1>
				<div className='flex space-x-4 space-x-reverse'>
					<button
						onClick={() => setIsEditingWidgets(true)}
						className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800'
					>
						<LayoutDashboard className='ml-1.5 -mr-1 h-5 w-5' />
						تخصيص
					</button>

					<Link
						href='/dashboard/orders/new'
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
					>
						<ShoppingBag className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
						طلب جديد
					</Link>

					<Link
						href='/dashboard/customers/new'
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800'
					>
						<Users className='ml-2 -mr-1 h-5 w-5' aria-hidden='true' />
						عميل جديد
					</Link>
				</div>
			</div>

			{/* عرض الويدجيت النشطة */}
			{renderWidgetGrid()}

			{/* مودال تخصيص الويدجيت */}
			{isEditingWidgets && <WidgetCustomizationModal />}
		</div>
	);
}
