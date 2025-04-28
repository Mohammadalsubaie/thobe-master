'use client';

import { Calendar, Edit, Mail, MapPin, Phone, Plus, Ruler, ShoppingBag, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface CustomerDetails {
	id: string;
	name: string;
	phone: string;
	email?: string;
	address?: string;
	createdAt: string;
	measurements: Array<{
		id: string;
		createdAt: string;
		isDefault: boolean;
	}>;
	orders: Array<{
		id: string;
		status: string;
		createdAt: string;
		totalPrice: number;
	}>;
}

export default function CustomerDetailsPage() {
	const params = useParams();

	const customerId = (params?.id as string) || '';

	const [customer, setCustomer] = useState<CustomerDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('measurements');

	useEffect(() => {
		const fetchCustomerDetails = async () => {
			try {
				// Mock API call - replace with actual API call
				setTimeout(() => {
					setCustomer({
						id: customerId,
						name: 'أحمد محمد علي',
						phone: '966512345678',
						email: 'ahmed@example.com',
						address: 'الرياض، حي النخيل، شارع العليا',
						createdAt: '2025-01-15',
						measurements: [
							{ id: 'm1', createdAt: '2025-01-15', isDefault: true },
							{ id: 'm2', createdAt: '2025-03-10', isDefault: false },
						],
						orders: [
							{ id: 'o1', status: 'completed', createdAt: '2025-01-20', totalPrice: 350 },
							{ id: 'o2', status: 'in-progress', createdAt: '2025-03-15', totalPrice: 420 },
							{ id: 'o3', status: 'pending', createdAt: '2025-04-10', totalPrice: 380 },
						],
					});
					setIsLoading(false);
				}, 1000);
			} catch (error) {
				console.error('Error fetching customer details:', error);
				setIsLoading(false);
			}
		};

		fetchCustomerDetails();
	}, [customerId]);

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending':
				return 'قيد الانتظار';
			case 'in-progress':
				return 'قيد التنفيذ';
			case 'completed':
				return 'مكتمل';
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
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'delivered':
				return 'bg-purple-100 text-purple-800';
			case 'needs-repair':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	if (isLoading) {
		return <div className='flex items-center justify-center h-96'>جاري التحميل...</div>;
	}

	if (!customer) {
		return <div className='text-center py-8'>لم يتم العثور على العميل</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>تفاصيل العميل</h1>
				<div className='flex space-x-2 space-x-reverse'>
					<Link
						href={`/dashboard/customers/${customerId}/edit`}
						className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
					>
						<Edit className='ml-2 -mr-1 h-5 w-5 text-gray-500' />
						تعديل البيانات
					</Link>
					<Link
						href={`/dashboard/orders/new?customerId=${customerId}`}
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
					>
						<Plus className='ml-2 -mr-1 h-5 w-5' />
						طلب جديد
					</Link>
				</div>
			</div>

			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='p-6'>
					<div className='flex flex-col md:flex-row md:items-center md:justify-between'>
						<div className='flex items-center'>
							<div className='h-16 w-16 rounded-full bg-green-100 flex items-center justify-center ml-4'>
								<User className='h-8 w-8 text-green-600' />
							</div>
							<div>
								<h2 className='text-xl font-bold text-gray-800'>{customer.name}</h2>
								<p className='text-sm text-gray-500'>
									عميل منذ {new Date(customer.createdAt).toLocaleDateString('ar-SA')}
								</p>
							</div>
						</div>
						<div className='mt-4 md:mt-0 grid grid-cols-1 gap-2'>
							<div className='flex items-center text-gray-600'>
								<Phone className='h-5 w-5 ml-2 text-gray-400' />
								<span>{customer.phone}</span>
							</div>
							{customer.email && (
								<div className='flex items-center text-gray-600'>
									<Mail className='h-5 w-5 ml-2 text-gray-400' />
									<span>{customer.email}</span>
								</div>
							)}
							{customer.address && (
								<div className='flex items-center text-gray-600'>
									<MapPin className='h-5 w-5 ml-2 text-gray-400' />
									<span>{customer.address}</span>
								</div>
							)}
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-8'>
						<div className='bg-blue-50 p-4 rounded-lg border border-blue-100'>
							<div className='flex items-center'>
								<div className='bg-blue-100 p-3 rounded-full'>
									<Calendar className='h-6 w-6 text-blue-600' />
								</div>
								<div className='mr-4'>
									<p className='text-sm text-blue-600'>عميل منذ</p>
									<p className='text-lg font-semibold text-blue-800'>
										{new Date(customer.createdAt).toLocaleDateString('ar-SA')}
									</p>
								</div>
							</div>
						</div>

						<div className='bg-green-50 p-4 rounded-lg border border-green-100'>
							<div className='flex items-center'>
								<div className='bg-green-100 p-3 rounded-full'>
									<Ruler className='h-6 w-6 text-green-600' />
								</div>
								<div className='mr-4'>
									<p className='text-sm text-green-600'>القياسات</p>
									<p className='text-lg font-semibold text-green-800'>
										{customer.measurements.length}
									</p>
								</div>
							</div>
						</div>

						<div className='bg-purple-50 p-4 rounded-lg border border-purple-100'>
							<div className='flex items-center'>
								<div className='bg-purple-100 p-3 rounded-full'>
									<ShoppingBag className='h-6 w-6 text-purple-600' />
								</div>
								<div className='mr-4'>
									<p className='text-sm text-purple-600'>الطلبات</p>
									<p className='text-lg font-semibold text-purple-800'>{customer.orders.length}</p>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='border-t border-gray-200'>
					<div className='flex'>
						<button
							className={`py-3 px-6 text-sm font-medium ${
								activeTab === 'measurements'
									? 'text-green-600 border-b-2 border-green-500'
									: 'text-gray-500 hover:text-gray-700'
							}`}
							onClick={() => setActiveTab('measurements')}
						>
							القياسات
						</button>
						<button
							className={`py-3 px-6 text-sm font-medium ${
								activeTab === 'orders'
									? 'text-green-600 border-b-2 border-green-500'
									: 'text-gray-500 hover:text-gray-700'
							}`}
							onClick={() => setActiveTab('orders')}
						>
							الطلبات
						</button>
					</div>
				</div>

				<div className='p-6'>
					{activeTab === 'measurements' && (
						<div>
							<div className='flex justify-between items-center mb-4'>
								<h3 className='font-medium text-gray-900'>القياسات</h3>
								<Link
									href={`/dashboard/customers/${customerId}/measurements/new`}
									className='inline-flex items-center px-3 py-1 text-sm border border-transparent shadow-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700'
								>
									<Plus className='ml-1 -mr-1 h-4 w-4' />
									قياس جديد
								</Link>
							</div>

							{customer.measurements.length > 0 ? (
								<div className='bg-gray-50 rounded-lg p-4 space-y-3'>
									{customer.measurements.map((measurement) => (
										<div
											key={measurement.id}
											className='bg-white p-4 rounded-md shadow-sm flex justify-between items-center'
										>
											<div>
												<div className='flex items-center'>
													<Ruler className='h-5 w-5 ml-2 text-gray-400' />
													<span className='font-medium text-gray-800'>
														قياس{' '}
														{new Date(measurement.createdAt).toLocaleDateString('ar-SA')}
													</span>
													{measurement.isDefault && (
														<span className='mr-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800'>
															افتراضي
														</span>
													)}
												</div>
											</div>
											<div className='flex space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/customers/${customerId}/measurements/${measurement.id}`}
													className='text-sm text-green-600 hover:text-green-800'
												>
													عرض التفاصيل
												</Link>
												<Link
													href={`/dashboard/customers/${customerId}/measurements/${measurement.id}/edit`}
													className='text-sm text-indigo-600 hover:text-indigo-800'
												>
													تعديل
												</Link>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className='text-center py-8 bg-gray-50 rounded-lg'>
									<Ruler className='h-10 w-10 mx-auto text-gray-400 mb-2' />
									<p className='text-gray-500 mb-4'>لا توجد قياسات محفوظة لهذا العميل</p>
									<Link
										href={`/dashboard/customers/${customerId}/measurements/new`}
										className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700'
									>
										<Plus className='ml-2 -mr-1 h-5 w-5' />
										إضافة قياس جديد
									</Link>
								</div>
							)}
						</div>
					)}

					{activeTab === 'orders' && (
						<div>
							<div className='flex justify-between items-center mb-4'>
								<h3 className='font-medium text-gray-900'>الطلبات</h3>
								<Link
									href={`/dashboard/orders/new?customerId=${customerId}`}
									className='inline-flex items-center px-3 py-1 text-sm border border-transparent shadow-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700'
								>
									<Plus className='ml-1 -mr-1 h-4 w-4' />
									طلب جديد
								</Link>
							</div>

							{customer.orders.length > 0 ? (
								<div className='overflow-x-auto'>
									<table className='min-w-full divide-y divide-gray-200'>
										<thead className='bg-gray-50'>
											<tr>
												<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
													رقم الطلب
												</th>
												<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
													التاريخ
												</th>
												<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
													الحالة
												</th>
												<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
													السعر
												</th>
												<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
													الإجراءات
												</th>
											</tr>
										</thead>
										<tbody className='bg-white divide-y divide-gray-200'>
											{customer.orders.map((order) => (
												<tr key={order.id} className='hover:bg-gray-50'>
													<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600'>
														#{order.id}
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
														{new Date(order.createdAt).toLocaleDateString('ar-SA')}
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
														{order.totalPrice} ر.س
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
														<Link
															href={`/dashboard/orders/${order.id}`}
															className='text-green-600 hover:text-green-800'
														>
															عرض التفاصيل
														</Link>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<div className='text-center py-8 bg-gray-50 rounded-lg'>
									<ShoppingBag className='h-10 w-10 mx-auto text-gray-400 mb-2' />
									<p className='text-gray-500 mb-4'>لا توجد طلبات لهذا العميل</p>
									<Link
										href={`/dashboard/orders/new?customerId=${customerId}`}
										className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700'
									>
										<Plus className='ml-2 -mr-1 h-5 w-5' />
										إضافة طلب جديد
									</Link>
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
