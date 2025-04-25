// app/dashboard/orders/page.tsx
'use client';

import { ChevronDown, Download, Filter, Plus, Search, Upload } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import OrderExcelImporter from '../../../components/OrderExcelImporter';
import { downloadOrderExcelTemplate } from '../../../utils/excelTemplateGenerator';

interface Order {
	id: string;
	customer: {
		id: string;
		name: string;
	};
	createdAt: string;
	deliveryDate: string | null;
	status: 'pending' | 'in-progress' | 'ready' | 'delivered' | 'needs-repair';
	price: number;
	assignedTailor: string;
}

interface ImportedOrderData {
	customerName: string;
	customerPhone: string;
	fabricType: string;
	fabricColor: string;
	deliveryDate?: string;
	price: number;
	notes?: string;
}

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [dateFilter, setDateFilter] = useState<string>('all');
	const [showFilterMenu, setShowFilterMenu] = useState(false);
	const [showImportModal, setShowImportModal] = useState(false);
	const [importSuccess, setImportSuccess] = useState<string | null>(null);

	useEffect(() => {
		const fetchOrders = async () => {
			// Mock API call - replace with actual API call
			setTimeout(() => {
				const statuses: ('pending' | 'in-progress' | 'ready' | 'delivered' | 'needs-repair')[] = [
					'pending',
					'in-progress',
					'ready',
					'delivered',
					'needs-repair',
				];

				const mockOrders = Array.from({ length: 20 }, (_, index) => {
					const randomDate = new Date();
					randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));

					const randomDeliveryDate = new Date();
					randomDeliveryDate.setDate(randomDeliveryDate.getDate() + Math.floor(Math.random() * 14));

					return {
						id: `10${String(index + 1).padStart(3, '0')}`,
						customer: {
							id: `c${index + 1}`,
							name: ['أحمد محمد', 'خالد عبدالله', 'محمد سعيد', 'عبدالعزيز سالم', 'فهد العنزي'][index % 5],
						},
						createdAt: randomDate.toISOString().split('T')[0],
						deliveryDate: index % 3 === 0 ? null : randomDeliveryDate.toISOString().split('T')[0],
						status: statuses[index % statuses.length],
						price: 250 + index * 25,
						assignedTailor: ['عمر الخياط', 'سعد الحربي', 'عبدالله التميمي'][index % 3],
					};
				});

				setOrders(mockOrders);
				setIsLoading(false);
			}, 1000);
		};

		fetchOrders();
	}, []);

	const filteredOrders = orders.filter((order) => {
		// Filter by search query (order id or customer name)
		const matchesSearch = order.id.includes(searchQuery) || order.customer.name.includes(searchQuery);

		// Filter by status
		const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

		// Filter by date
		let matchesDate = true;
		if (dateFilter === 'today') {
			const today = new Date().toISOString().split('T')[0];
			matchesDate = order.createdAt === today;
		} else if (dateFilter === 'this-week') {
			const today = new Date();
			const oneWeekAgo = new Date();
			oneWeekAgo.setDate(today.getDate() - 7);
			const orderDate = new Date(order.createdAt);
			matchesDate = orderDate >= oneWeekAgo && orderDate <= today;
		} else if (dateFilter === 'this-month') {
			const currentMonth = new Date().getMonth();
			const currentYear = new Date().getFullYear();
			const orderDate = new Date(order.createdAt);
			matchesDate = orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
		}

		return matchesSearch && matchesStatus && matchesDate;
	});

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending':
				return 'قيد الانتظار';
			case 'in-progress':
				return 'قيد التنفيذ';
			case 'ready':
				return 'جاهز';
			case 'delivered':
				return 'تم التسليم';
			case 'needs-repair':
				return 'بحاجة للإصلاح';
			default:
				return status;
		}
	};

	const getStatusClass = (status: string) => {
		switch (status) {
			case 'pending':
				return 'bg-blue-100 text-blue-800';
			case 'in-progress':
				return 'bg-yellow-100 text-yellow-800';
			case 'ready':
				return 'bg-green-100 text-green-800';
			case 'delivered':
				return 'bg-purple-100 text-purple-800';
			case 'needs-repair':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const handleImportOrders = async (importedOrders: ImportedOrderData[]) => {
		try {
			// In a real implementation, you would send these to your API
			console.log('Importing orders:', importedOrders);

			// Mock API call delay
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// For demo purposes, we'll add these to our state with mock IDs
			const newOrders: Order[] = importedOrders.map((order, index) => {
				const id = `imp${String(Date.now()).slice(-5)}${index}`;
				return {
					id,
					customer: {
						id: `c_imp_${index}`,
						name: order.customerName,
					},
					createdAt: new Date().toISOString().split('T')[0],
					deliveryDate: order.deliveryDate || null,
					status: 'pending',
					price: order.price,
					assignedTailor: 'لم يتم التعيين',
				};
			});

			setOrders([...newOrders, ...orders]);
			setShowImportModal(false);
			setImportSuccess(`تم استيراد ${importedOrders.length} طلب بنجاح`);

			// Clear success message after 5 seconds
			setTimeout(() => {
				setImportSuccess(null);
			}, 5000);
		} catch (error) {
			console.error('Error importing orders:', error);
			// Handle error
		}
	};

	if (isLoading) {
		return <div className='flex items-center justify-center h-96'>جاري التحميل...</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>الطلبات</h1>
				<div className='flex space-x-2 space-x-reverse'>
					<button
						onClick={() => downloadOrderExcelTemplate()}
						className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
					>
						<Download className='ml-2 h-4 w-4' />
						نموذج Excel
					</button>
					<button
						onClick={() => setShowImportModal(true)}
						className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
					>
						<Upload className='ml-2 h-4 w-4' />
						استيراد
					</button>
					<Link
						href='/dashboard/orders/new'
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
					>
						<Plus className='ml-2 h-4 w-4' />
						طلب جديد
					</Link>
				</div>
			</div>

			{importSuccess && (
				<div className='bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md'>
					{importSuccess}
				</div>
			)}

			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div className='relative rounded-md shadow-sm md:w-2/3'>
						<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' aria-hidden='true' />
						</div>
						<input
							type='text'
							className='block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
							placeholder='بحث برقم الطلب أو اسم العميل...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className='flex space-x-2 space-x-reverse md:w-1/3'>
						<div className='relative inline-block text-left'>
							<button
								type='button'
								className='inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
								onClick={() => setShowFilterMenu(!showFilterMenu)}
							>
								<Filter className='ml-2 -mr-1 h-5 w-5 text-gray-400' />
								فلترة
								<ChevronDown className='mr-2 -ml-1 h-5 w-5 text-gray-400' aria-hidden='true' />
							</button>

							{showFilterMenu && (
								<div className='z-10 origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100'>
									<div className='py-1'>
										<div className='px-4 py-2 text-sm text-gray-700 font-medium'>الحالة</div>
										<div className='px-4 py-2'>
											<select
												className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
												value={statusFilter}
												onChange={(e) => setStatusFilter(e.target.value)}
											>
												<option value='all'>الكل</option>
												<option value='pending'>قيد الانتظار</option>
												<option value='in-progress'>قيد التنفيذ</option>
												<option value='ready'>جاهز</option>
												<option value='delivered'>تم التسليم</option>
												<option value='needs-repair'>بحاجة للإصلاح</option>
											</select>
										</div>
									</div>
									<div className='py-1'>
										<div className='px-4 py-2 text-sm text-gray-700 font-medium'>التاريخ</div>
										<div className='px-4 py-2'>
											<select
												className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
												value={dateFilter}
												onChange={(e) => setDateFilter(e.target.value)}
											>
												<option value='all'>الكل</option>
												<option value='today'>اليوم</option>
												<option value='this-week'>هذا الأسبوع</option>
												<option value='this-month'>هذا الشهر</option>
											</select>
										</div>
									</div>
									<div className='py-1'>
										<button
											className='block w-full text-right px-4 py-2 text-sm text-green-700 hover:bg-gray-100'
											onClick={() => {
												setStatusFilter('all');
												setDateFilter('all');
											}}
										>
											إعادة ضبط الفلتر
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									رقم الطلب
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									العميل
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									تاريخ الطلب
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									تاريخ التسليم
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									الحالة
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									السعر
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									الخياط
								</th>
								<th className='relative px-6 py-3'>
									<span className='sr-only'>عرض</span>
								</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{filteredOrders.map((order) => (
								<tr key={order.id} className='hover:bg-gray-50'>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600'>
										#{order.id}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										<Link
											href={`/dashboard/customers/${order.customer.id}`}
											className='text-green-600 hover:text-green-800'
										>
											{order.customer.name}
										</Link>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{new Date(order.createdAt).toLocaleDateString('ar-SA')}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{order.deliveryDate
											? new Date(order.deliveryDate).toLocaleDateString('ar-SA')
											: '-'}
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
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{order.price} ر.س
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{order.assignedTailor}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
										<Link
											href={`/dashboard/orders/${order.id}`}
											className='text-indigo-600 hover:text-indigo-900'
										>
											عرض
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{filteredOrders.length === 0 && (
					<div className='text-center py-8'>
						<p className='text-gray-500'>لا توجد طلبات مطابقة لبحثك</p>
					</div>
				)}
			</div>

			{/* Import Excel Modal */}
			{showImportModal && (
				<OrderExcelImporter onImport={handleImportOrders} onClose={() => setShowImportModal(false)} />
			)}
		</div>
	);
}
