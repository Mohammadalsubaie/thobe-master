'use client';

import {
	AlertTriangle,
	Calendar,
	CheckCircle,
	ChevronLeft,
	Clock,
	Edit,
	MessageCircle,
	Package,
	Printer,
	Ruler,
	Truck,
	User,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderDetails {
	id: string;
	status: 'pending' | 'in-progress' | 'ready' | 'delivered' | 'needs-repair';
	customer: {
		id: string;
		name: string;
		phone: string;
	};
	measurement: {
		id: string;
		createdAt: string;
	};
	fabric: {
		name: string;
		color: string;
		price: number;
	};
	assignedTailor: {
		id: string;
		name: string;
	};
	factoryTailor: {
		id: string;
		name: string;
	};
	createdAt: string;
	updatedAt: string;
	deliveryDate: string | null;
	completedDate: string | null;
	price: number;
	notes: string | null;
	repairDetails: string | null;
	statusHistory: Array<{
		status: string;
		date: string;
		by: string;
		notes?: string;
	}>;
}

export default function OrderDetailsPage() {
	const params = useParams();

	const orderId = params.id as string;

	const [order, setOrder] = useState<OrderDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showStatusUpdateModal, setShowStatusUpdateModal] = useState(false);
	const [newStatus, setNewStatus] = useState<string>('');
	const [statusNote, setStatusNote] = useState('');
	const [isUpdating, setIsUpdating] = useState(false);

	useEffect(() => {
		const fetchOrderDetails = async () => {
			try {
				// Mock API call - replace with actual API call
				setTimeout(() => {
					setOrder({
						id: orderId,
						status: 'in-progress',
						customer: {
							id: 'c1',
							name: 'أحمد محمد',
							phone: '966512345678',
						},
						measurement: {
							id: 'm1',
							createdAt: '2025-01-15',
						},
						fabric: {
							name: 'قطن مصري',
							color: 'أبيض',
							price: 150,
						},
						assignedTailor: {
							id: 't1',
							name: 'عمر الخياط',
						},
						factoryTailor: {
							id: 't3',
							name: 'عبدالله التميمي',
						},
						createdAt: '2025-04-10',
						updatedAt: '2025-04-12',
						deliveryDate: '2025-04-20',
						completedDate: null,
						price: 350,
						notes: 'يفضل العميل أن يكون الثوب فضفاضًا قليلاً',
						repairDetails: null,
						statusHistory: [
							{
								status: 'pending',
								date: '2025-04-10T14:30:00',
								by: 'عمر الخياط',
								notes: 'تم إنشاء الطلب',
							},
							{
								status: 'in-progress',
								date: '2025-04-12T09:15:00',
								by: 'عبدالله التميمي',
								notes: 'بدأ العمل على الثوب',
							},
						],
					});
					setIsLoading(false);
				}, 1000);
			} catch (error) {
				console.error('Error fetching order details:', error);
				setIsLoading(false);
			}
		};

		fetchOrderDetails();
	}, [orderId]);

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

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'pending':
				return <Clock className='h-5 w-5' />;
			case 'in-progress':
				return <Clock className='h-5 w-5' />;
			case 'ready':
				return <CheckCircle className='h-5 w-5' />;
			case 'delivered':
				return <Truck className='h-5 w-5' />;
			case 'needs-repair':
				return <AlertTriangle className='h-5 w-5' />;
			default:
				return <Clock className='h-5 w-5' />;
		}
	};

	const handleStatusUpdate = async () => {
		if (!newStatus) return;

		setIsUpdating(true);

		try {
			// Mock API call - replace with actual API call
			console.log('Updating order status:', {
				orderId,
				status: newStatus,
				notes: statusNote,
			});

			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Update local state
			if (order) {
				setOrder({
					...order,
					status: newStatus as any,
					updatedAt: new Date().toISOString(),
					statusHistory: [
						...order.statusHistory,
						{
							status: newStatus,
							date: new Date().toISOString(),
							by: 'عمر الخياط', // This would come from the logged-in user
							notes: statusNote || undefined,
						},
					],
				});
			}

			setShowStatusUpdateModal(false);
			setNewStatus('');
			setStatusNote('');
		} catch (error) {
			console.error('Error updating order status:', error);
		} finally {
			setIsUpdating(false);
		}
	};

	if (isLoading) {
		return <div className='flex items-center justify-center h-96'>جاري التحميل...</div>;
	}

	if (!order) {
		return <div className='text-center py-8'>لم يتم العثور على الطلب</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div className='flex items-center space-x-2 space-x-reverse'>
					<Link href='/dashboard/orders' className='text-green-600 hover:text-green-800'>
						<ChevronLeft className='h-5 w-5' />
					</Link>
					<h1 className='text-2xl font-bold text-gray-800'>تفاصيل الطلب #{order.id}</h1>
				</div>
				<div className='flex space-x-2 space-x-reverse'>
					<button
						onClick={() => window.print()}
						className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
					>
						<Printer className='ml-2 -mr-1 h-5 w-5 text-gray-500' />
						طباعة
					</button>
					<button
						onClick={() => setShowStatusUpdateModal(true)}
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
					>
						<Edit className='ml-2 -mr-1 h-5 w-5' />
						تحديث الحالة
					</button>
				</div>
			</div>

			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='p-6'>
					<div className='flex justify-between items-start mb-6'>
						<div>
							<div className='flex items-center'>
								<div className={`p-2 rounded-full ${getStatusClass(order.status)}`}>
									{getStatusIcon(order.status)}
								</div>
								<div className='mr-3'>
									<div className='flex items-center'>
										<h2 className='text-xl font-bold text-gray-800'>طلب #{order.id}</h2>
										<span
											className={`mr-2 px-2 py-1 text-xs rounded-full ${getStatusClass(
												order.status
											)}`}
										>
											{getStatusText(order.status)}
										</span>
									</div>
									<div className='flex items-center text-sm text-gray-500 mt-1'>
										<Calendar className='h-4 w-4 ml-1' />
										<span>
											تاريخ الطلب: {new Date(order.createdAt).toLocaleDateString('ar-SA')}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className='text-right'>
							<div className='text-2xl font-bold text-gray-800'>{order.price} ر.س</div>
							{order.deliveryDate && (
								<div className='flex items-center justify-end text-sm text-gray-500 mt-1'>
									<span>
										تاريخ التسليم المتوقع:{' '}
										{new Date(order.deliveryDate).toLocaleDateString('ar-SA')}
									</span>
									<Truck className='h-4 w-4 mr-1' />
								</div>
							)}
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6'>
						<div>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>معلومات العميل</h3>
							<div className='bg-gray-50 p-4 rounded-lg'>
								<div className='flex items-center'>
									<div className='bg-blue-100 p-2 rounded-full'>
										<User className='h-5 w-5 text-blue-600' />
									</div>
									<div className='mr-3'>
										<Link
											href={`/dashboard/customers/${order.customer.id}`}
											className='text-lg font-semibold text-blue-600 hover:text-blue-800'
										>
											{order.customer.name}
										</Link>
										<p className='text-sm text-gray-500'>{order.customer.phone}</p>
									</div>
								</div>
							</div>
						</div>

						<div>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>معلومات القياس</h3>
							<div className='bg-gray-50 p-4 rounded-lg'>
								<div className='flex items-center'>
									<div className='bg-green-100 p-2 rounded-full'>
										<Ruler className='h-5 w-5 text-green-600' />
									</div>
									<div className='mr-3'>
										<Link
											href={`/dashboard/customers/${order.customer.id}/measurements/${order.measurement.id}`}
											className='text-lg font-semibold text-green-600 hover:text-green-800'
										>
											قياس {new Date(order.measurement.createdAt).toLocaleDateString('ar-SA')}
										</Link>
										<p className='text-sm text-gray-500'>
											<Link
												href={`/dashboard/customers/${order.customer.id}/measurements/${order.measurement.id}`}
												className='text-green-600 hover:text-green-800'
											>
												عرض تفاصيل القياس
											</Link>
										</p>
									</div>
								</div>
							</div>
						</div>

						<div>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>معلومات القماش</h3>
							<div className='bg-gray-50 p-4 rounded-lg'>
								<div className='flex items-center'>
									<div className='bg-indigo-100 p-2 rounded-full'>
										<Package className='h-5 w-5 text-indigo-600' />
									</div>
									<div className='mr-3'>
										<p className='text-lg font-semibold'>{order.fabric.name}</p>
										<p className='text-sm text-gray-500'>اللون: {order.fabric.color}</p>
										<p className='text-sm text-gray-500'>السعر: {order.fabric.price} ر.س</p>
									</div>
								</div>
							</div>
						</div>

						<div>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>الخياطين المسؤولين</h3>
							<div className='bg-gray-50 p-4 rounded-lg'>
								<div className='space-y-3'>
									<div className='flex items-center'>
										<div className='bg-yellow-100 p-2 rounded-full'>
											<User className='h-5 w-5 text-yellow-600' />
										</div>
										<div className='mr-3'>
											<p className='text-base font-semibold'>{order.assignedTailor.name}</p>
											<p className='text-sm text-gray-500'>الخياط المسؤول</p>
										</div>
									</div>

									<div className='flex items-center'>
										<div className='bg-purple-100 p-2 rounded-full'>
											<User className='h-5 w-5 text-purple-600' />
										</div>
										<div className='mr-3'>
											<p className='text-base font-semibold'>{order.factoryTailor.name}</p>
											<p className='text-sm text-gray-500'>خياط المصنع</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{(order.notes || order.repairDetails) && (
						<div className='border-t border-gray-200 pt-6 mt-6'>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>ملاحظات</h3>
							<div className='space-y-4'>
								{order.notes && (
									<div className='bg-gray-50 p-4 rounded-lg'>
										<div className='flex'>
											<MessageCircle className='h-5 w-5 text-gray-500 ml-2 flex-shrink-0' />
											<div>
												<p className='text-gray-700'>{order.notes}</p>
												<p className='text-xs text-gray-500 mt-1'>ملاحظات الطلب</p>
											</div>
										</div>
									</div>
								)}

								{order.repairDetails && (
									<div className='bg-red-50 p-4 rounded-lg'>
										<div className='flex'>
											<AlertTriangle className='h-5 w-5 text-red-500 ml-2 flex-shrink-0' />
											<div>
												<p className='text-red-700'>{order.repairDetails}</p>
												<p className='text-xs text-red-500 mt-1'>تفاصيل الإصلاح</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					)}

					<div className='border-t border-gray-200 pt-6 mt-6'>
						<h3 className='text-lg font-medium text-gray-900 mb-4'>تاريخ الحالة</h3>
						<div className='relative'>
							<div className='absolute inset-y-0 right-5 w-0.5 bg-gray-200'></div>
							<div className='space-y-6'>
								{order.statusHistory.map((status, index) => (
									<div key={index} className='relative'>
										<div className='absolute right-5 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center'>
											{getStatusIcon(status.status)}
										</div>
										<div className='mr-16 bg-gray-50 p-4 rounded-lg'>
											<div className='flex justify-between items-center'>
												<p className='font-medium text-gray-900'>
													{getStatusText(status.status)}
												</p>
												<p className='text-sm text-gray-500'>
													{new Date(status.date).toLocaleString('ar-SA')}
												</p>
											</div>
											<p className='text-sm text-gray-500 mt-1'>بواسطة: {status.by}</p>
											{status.notes && (
												<p className='text-sm text-gray-600 mt-2'>{status.notes}</p>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Status Update Modal */}
			{showStatusUpdateModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white p-5 rounded-md shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-gray-900 mb-4'>تحديث حالة الطلب</h3>

						<div className='space-y-4'>
							<div className='space-y-2'>
								<label htmlFor='status' className='block text-sm font-medium text-gray-700'>
									الحالة الجديدة
								</label>
								<select
									id='status'
									className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
									value={newStatus}
									onChange={(e) => setNewStatus(e.target.value)}
									disabled={isUpdating}
								>
									<option value=''>اختر الحالة</option>
									<option value='pending'>قيد الانتظار</option>
									<option value='in-progress'>قيد التنفيذ</option>
									<option value='ready'>جاهز</option>
									<option value='delivered'>تم التسليم</option>
									<option value='needs-repair'>بحاجة للإصلاح</option>
								</select>
							</div>

							<div className='space-y-2'>
								<label htmlFor='statusNote' className='block text-sm font-medium text-gray-700'>
									ملاحظات (اختياري)
								</label>
								<textarea
									id='statusNote'
									rows={3}
									className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
									value={statusNote}
									onChange={(e) => setStatusNote(e.target.value)}
									disabled={isUpdating}
								/>
							</div>
						</div>

						<div className='flex justify-end space-x-2 space-x-reverse mt-6'>
							<button
								onClick={() => setShowStatusUpdateModal(false)}
								className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
								disabled={isUpdating}
							>
								إلغاء
							</button>
							<button
								onClick={handleStatusUpdate}
								disabled={!newStatus || isUpdating}
								className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
							>
								{isUpdating ? 'جاري التحديث...' : 'تحديث الحالة'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
