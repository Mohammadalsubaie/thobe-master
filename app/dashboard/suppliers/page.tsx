// app/dashboard/suppliers/page.tsx
'use client';

import { ArrowRight, Clock, DollarSign, Download, Package, Plus, ShoppingBag, Star, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SuppliersPage() {
	const [isLoading, setIsLoading] = useState(true);
	interface Supplier {
		id: string;
		name: string;
		category: string;
		contact: string;
		totalOrders: number;
		pendingOrders: number;
		rating: number;
		status: string;
	}

	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [pendingOrders, setPendingOrders] = useState(0);
	const [activeSuppliers, setActiveSuppliers] = useState(0);
	const [pendingPayments, setPendingPayments] = useState(0);
	const [lowStockItems, setLowStockItems] = useState(0);

	// جلب البيانات (سيتم استبدالها بطلب API حقيقي)
	useEffect(() => {
		// محاكاة استجابة API
		setTimeout(() => {
			setSuppliers([
				{
					id: 'S001',
					name: 'شركة النسيج العالمية',
					category: 'أقمشة',
					contact: '0501234567',
					totalOrders: 32,
					pendingOrders: 2,
					rating: 4.7,
					status: 'active',
				},
				// ... المزيد من الموردين
			]);
			setPendingOrders(8);
			setActiveSuppliers(12);
			setPendingPayments(45000);
			setLowStockItems(15);
			setIsLoading(false);
		}, 1000);
	}, []);

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-wrap justify-between items-center'>
				<div>
					<div className='flex items-center mb-1'>
						<Link
							href='/dashboard'
							className='text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ml-2'
						>
							<ArrowRight className='h-5 w-5' />
						</Link>
						<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>إدارة الموردين</h1>
					</div>
					<p className='text-gray-500 dark:text-gray-400 text-sm'>
						إدارة الموردين وطلبات الشراء واستلام البضائع والمدفوعات
					</p>
				</div>

				<div className='flex mt-4 sm:mt-0 space-x-3 space-x-reverse'>
					<Link
						href='/dashboard/suppliers/new'
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
					>
						<Plus className='ml-1.5 -mr-1 h-5 w-5' />
						إضافة مورد جديد
					</Link>

					<Link
						href='/dashboard/suppliers/purchase-orders/new'
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-800'
					>
						<ShoppingBag className='ml-1.5 -mr-1 h-5 w-5' />
						طلب شراء جديد
					</Link>
				</div>
			</div>

			{/* بطاقات الإحصائيات */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{/* الموردين النشطين */}
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
					<div className='flex justify-between items-start'>
						<div>
							<p className='text-sm text-gray-500 dark:text-gray-400'>الموردين النشطين</p>
							<h3 className='mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100'>
								{activeSuppliers}
							</h3>
						</div>
						<div className='p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
							<Truck className='h-6 w-6 text-blue-600 dark:text-blue-400' />
						</div>
					</div>
				</div>

				{/* طلبات الشراء المعلقة */}
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
					<div className='flex justify-between items-start'>
						<div>
							<p className='text-sm text-gray-500 dark:text-gray-400'>طلبات الشراء المعلقة</p>
							<h3 className='mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100'>
								{pendingOrders}
							</h3>
						</div>
						<div className='p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg'>
							<Clock className='h-6 w-6 text-yellow-600 dark:text-yellow-400' />
						</div>
					</div>
				</div>

				{/* المدفوعات المستحقة */}
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
					<div className='flex justify-between items-start'>
						<div>
							<p className='text-sm text-gray-500 dark:text-gray-400'>المدفوعات المستحقة</p>
							<h3 className='mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100'>
								{pendingPayments.toLocaleString()}
								<span className='inline-block relative h-5 w-5 mx-1 -mt-0.5'>
									<Image
										src='/images/Saudi_Riyal_Symbol.png'
										alt='ر.س'
										fill
										sizes='20px'
										style={{ objectFit: 'contain' }}
									/>
								</span>
							</h3>
						</div>
						<div className='p-3 bg-red-100 dark:bg-red-900/30 rounded-lg'>
							<DollarSign className='h-6 w-6 text-red-600 dark:text-red-400' />
						</div>
					</div>
				</div>

				{/* العناصر منخفضة المخزون */}
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
					<div className='flex justify-between items-start'>
						<div>
							<p className='text-sm text-gray-500 dark:text-gray-400'>عناصر منخفضة المخزون</p>
							<h3 className='mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100'>
								{lowStockItems}
							</h3>
						</div>
						<div className='p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg'>
							<Package className='h-6 w-6 text-purple-600 dark:text-purple-400' />
						</div>
					</div>
				</div>
			</div>

			{/* قسم روابط سريعة */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* قسم الموردين */}
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
					<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4'>إدارة الموردين</h2>
					<div className='space-y-3'>
						<Link
							href='/dashboard/suppliers/list'
							className='flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
						>
							<div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md ml-3'>
								<Truck className='h-5 w-5 text-blue-600 dark:text-blue-400' />
							</div>
							<div>
								<p className='font-medium text-gray-800 dark:text-gray-200'>قائمة الموردين</p>
								<p className='text-sm text-gray-500 dark:text-gray-400'>عرض وإدارة جميع الموردين</p>
							</div>
						</Link>

						<Link
							href='/dashboard/suppliers/new'
							className='flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
						>
							<div className='p-2 bg-green-100 dark:bg-green-900/30 rounded-md ml-3'>
								<Plus className='h-5 w-5 text-green-600 dark:text-green-400' />
							</div>
							<div>
								<p className='font-medium text-gray-800 dark:text-gray-200'>إضافة مورد جديد</p>
								<p className='text-sm text-gray-500 dark:text-gray-400'>تسجيل مورد جديد في النظام</p>
							</div>
						</Link>

						<Link
							href='/dashboard/suppliers/evaluation'
							className='flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
						>
							<div className='p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-md ml-3'>
								<Star className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />
							</div>
							<div>
								<p className='font-medium text-gray-800 dark:text-gray-200'>تقييم الموردين</p>
								<p className='text-sm text-gray-500 dark:text-gray-400'>تقييم أداء الموردين وتصنيفهم</p>
							</div>
						</Link>
					</div>
				</div>

				{/* قسم طلبات الشراء */}
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
					<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4'>طلبات الشراء</h2>
					<div className='space-y-3'>
						<Link
							href='/dashboard/suppliers/purchase-orders'
							className='flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
						>
							<div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md ml-3'>
								<ShoppingBag className='h-5 w-5 text-blue-600 dark:text-blue-400' />
							</div>
							<div>
								<p className='font-medium text-gray-800 dark:text-gray-200'>جميع طلبات الشراء</p>
								<p className='text-sm text-gray-500 dark:text-gray-400'>عرض وإدارة طلبات الشراء</p>
							</div>
						</Link>

						<Link
							href='/dashboard/suppliers/purchase-orders/new'
							className='flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
						>
							<div className='p-2 bg-green-100 dark:bg-green-900/30 rounded-md ml-3'>
								<Plus className='h-5 w-5 text-green-600 dark:text-green-400' />
							</div>
							<div>
								<p className='font-medium text-gray-800 dark:text-gray-200'>طلب شراء جديد</p>
								<p className='text-sm text-gray-500 dark:text-gray-400'>إنشاء طلب شراء جديد</p>
							</div>
						</Link>

						<Link
							href='/dashboard/suppliers/purchase-orders/pending'
							className='flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
						>
							<div className='p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-md ml-3'>
								<Clock className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />
							</div>
							<div>
								<p className='font-medium text-gray-800 dark:text-gray-200'>طلبات معلقة</p>
								<p className='text-sm text-gray-500 dark:text-gray-400'>متابعة الطلبات المعلقة</p>
							</div>
						</Link>
					</div>
				</div>

				{/* قسم استلام وحسابات */}
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
					<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4'>الاستلام والحسابات</h2>
					<div className='space-y-3'>
						<Link
							href='/dashboard/suppliers/receiving'
							className='flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
						>
							<div className='p-2 bg-blue-100 dark:bg-blue-900/30 rounded-md ml-3'>
								<Package className='h-5 w-5 text-blue-600 dark:text-blue-400' />
							</div>
							<div>
								<p className='font-medium text-gray-800 dark:text-gray-200'>استلام البضائع</p>
								<p className='text-sm text-gray-500 dark:text-gray-400'>تسجيل استلام الطلبات</p>
							</div>
						</Link>

						<Link
							href='/dashboard/suppliers/payments'
							className='flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
						>
							<div className='p-2 bg-green-100 dark:bg-green-900/30 rounded-md ml-3'>
								<DollarSign className='h-5 w-5 text-green-600 dark:text-green-400' />
							</div>
							<div>
								<p className='font-medium text-gray-800 dark:text-gray-200'>مدفوعات الموردين</p>
								<p className='text-sm text-gray-500 dark:text-gray-400'>إدارة المدفوعات للموردين</p>
							</div>
						</Link>

						<Link
							href='/dashboard/suppliers/reports'
							className='flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors'
						>
							<div className='p-2 bg-purple-100 dark:bg-purple-900/30 rounded-md ml-3'>
								<Download className='h-5 w-5 text-purple-600 dark:text-purple-400' />
							</div>
							<div>
								<p className='font-medium text-gray-800 dark:text-gray-200'>تقارير الموردين</p>
								<p className='text-sm text-gray-500 dark:text-gray-400'>تقارير تحليلية عن الموردين</p>
							</div>
						</Link>
					</div>
				</div>
			</div>

			{/* الموردين الأخيرة */}
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
				<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
					<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>الموردين النشطين</h2>

					<Link
						href='/dashboard/suppliers/list'
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
									المورد
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
									الفئة
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
									رقم الاتصال
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
									الطلبات
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
									التقييم
								</th>
								<th className='px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'>
									الحالة
								</th>
							</tr>
						</thead>
						<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
							{isLoading ? (
								<tr>
									<td colSpan={6} className='px-6 py-4 text-center'>
										<div className='flex flex-col items-center justify-center py-6'>
											<div className='w-10 h-10 border-4 border-t-blue-600 border-gray-200 dark:border-gray-700 rounded-full animate-spin mb-4'></div>
											<p className='text-gray-500 dark:text-gray-400'>جاري تحميل البيانات...</p>
										</div>
									</td>
								</tr>
							) : suppliers.length === 0 ? (
								<tr>
									<td colSpan={6} className='px-6 py-4 text-center text-gray-500 dark:text-gray-400'>
										لا يوجد موردين نشطين حالياً
									</td>
								</tr>
							) : (
								suppliers.map((supplier) => (
									<tr key={supplier.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
										<td className='px-6 py-4 whitespace-nowrap'>
											<Link
												href={`/dashboard/suppliers/${supplier.id}`}
												className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium'
											>
												{supplier.name}
											</Link>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
											{supplier.category}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
											{supplier.contact}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
											{supplier.pendingOrders > 0 ? (
												<div className='flex items-center space-x-1 space-x-reverse'>
													<span>{supplier.totalOrders}</span>
													<span className='px-2 py-1 text-xs leading-none bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-full ml-2'>
														{supplier.pendingOrders} معلق
													</span>
												</div>
											) : (
												supplier.totalOrders
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
											<div className='flex items-center'>
												<Star className='h-4 w-4 text-yellow-500 dark:text-yellow-400 ml-1' />
												<span>{supplier.rating.toFixed(1)}/5</span>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-center'>
											<span
												className={`px-2 py-1 text-xs leading-none rounded-full ${
													supplier.status === 'active'
														? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
														: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
												}`}
											>
												{supplier.status === 'active' ? 'نشط' : 'غير نشط'}
											</span>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
