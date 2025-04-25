'use client';

import { Edit, Mail, MapPin, MoreHorizontal, Phone, Plus, Search, Trash } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Customer {
	id: string;
	name: string;
	phone: string;
	email?: string;
	address?: string;
	ordersCount: number;
	lastOrderDate: string;
}

export default function CustomersPage() {
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

	useEffect(() => {
		// Mock data fetching - replace with actual API call later
		const fetchCustomers = async () => {
			// Simulate API call
			setTimeout(() => {
				const mockCustomers = Array.from({ length: 15 }, (_, index) => ({
					id: (index + 1).toString(),
					name: ['أحمد محمد', 'خالد عبدالله', 'محمد سعيد', 'عبدالعزيز سالم', 'فهد العنزي'][index % 5],
					phone: `9665${Math.floor(10000000 + Math.random() * 90000000)}`,
					email: index % 3 === 0 ? undefined : `customer${index + 1}@example.com`,
					address: index % 4 === 0 ? undefined : 'الرياض، حي النخيل',
					ordersCount: Math.floor(Math.random() * 10),
					lastOrderDate: new Date(2025, 3, 15 - index).toISOString().split('T')[0],
				}));
				setCustomers(mockCustomers);
				setIsLoading(false);
			}, 1000);
		};

		fetchCustomers();
	}, []);

	const filteredCustomers = customers.filter(
		(customer) =>
			customer.name.includes(searchQuery) ||
			customer.phone.includes(searchQuery) ||
			(customer.email && customer.email.includes(searchQuery))
	);

	const handleDeleteClick = (customerId: string) => {
		setCustomerToDelete(customerId);
		setShowDeleteModal(true);
	};

	const confirmDelete = () => {
		if (customerToDelete) {
			// Delete customer logic here
			setCustomers(customers.filter((c) => c.id !== customerToDelete));
			setShowDeleteModal(false);
			setCustomerToDelete(null);
		}
	};

	if (isLoading) {
		return <div className='flex items-center justify-center h-96'>جاري التحميل...</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>العملاء</h1>
				<Link
					href='/dashboard/customers/new'
					className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
				>
					<Plus className='ml-2 h-4 w-4' />
					عميل جديد
				</Link>
			</div>

			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='p-4 border-b border-gray-200'>
					<div className='relative rounded-md shadow-sm'>
						<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' aria-hidden='true' />
						</div>
						<input
							type='text'
							className='block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
							placeholder='بحث بالاسم أو رقم الهاتف أو البريد الإلكتروني...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									الاسم
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									معلومات الاتصال
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									عدد الطلبات
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									آخر طلب
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									الإجراءات
								</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{filteredCustomers.map((customer) => (
								<tr key={customer.id} className='hover:bg-gray-50'>
									<td className='px-6 py-4 whitespace-nowrap'>
										<Link
											href={`/dashboard/customers/${customer.id}`}
											className='text-sm font-medium text-green-600 hover:text-green-800'
										>
											{customer.name}
										</Link>
									</td>
									<td className='px-6 py-4'>
										<div className='flex flex-col space-y-1'>
											<div className='flex items-center text-sm text-gray-500'>
												<Phone className='h-4 w-4 ml-1 text-gray-400' />
												{customer.phone}
											</div>
											{customer.email && (
												<div className='flex items-center text-sm text-gray-500'>
													<Mail className='h-4 w-4 ml-1 text-gray-400' />
													{customer.email}
												</div>
											)}
											{customer.address && (
												<div className='flex items-center text-sm text-gray-500'>
													<MapPin className='h-4 w-4 ml-1 text-gray-400' />
													{customer.address}
												</div>
											)}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{customer.ordersCount}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{new Date(customer.lastOrderDate).toLocaleDateString('ar-SA')}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
										<div className='flex space-x-2 space-x-reverse'>
											<Link
												href={`/dashboard/customers/${customer.id}/edit`}
												className='text-indigo-600 hover:text-indigo-900 p-1'
												title='تعديل'
											>
												<Edit className='h-5 w-5' />
											</Link>
											<button
												className='text-red-600 hover:text-red-900 p-1'
												onClick={() => handleDeleteClick(customer.id)}
												title='حذف'
											>
												<Trash className='h-5 w-5' />
											</button>
											<div className='relative group'>
												<button
													className='text-gray-600 hover:text-gray-900 p-1'
													title='المزيد'
												>
													<MoreHorizontal className='h-5 w-5' />
												</button>
												<div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
													<Link
														href={`/dashboard/orders/new?customerId=${customer.id}`}
														className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
													>
														إضافة طلب جديد
													</Link>
													<Link
														href={`/dashboard/customers/${customer.id}/measurements/new`}
														className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
													>
														إضافة قياسات جديدة
													</Link>
												</div>
											</div>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{filteredCustomers.length === 0 && (
					<div className='text-center py-8'>
						<p className='text-gray-500'>لا يوجد عملاء مطابقين لبحثك</p>
					</div>
				)}
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white p-5 rounded-md shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-gray-900 mb-4'>تأكيد الحذف</h3>
						<p className='text-gray-700 mb-4'>
							هل أنت متأكد من رغبتك في حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.
						</p>
						<div className='flex justify-end space-x-2 space-x-reverse'>
							<button
								onClick={() => setShowDeleteModal(false)}
								className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
							>
								إلغاء
							</button>
							<button
								onClick={confirmDelete}
								className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
							>
								حذف
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
