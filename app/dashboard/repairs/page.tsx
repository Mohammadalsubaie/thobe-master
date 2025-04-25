'use client';

import { AlertTriangle, CheckCircle, ChevronDown, Eye, Filter, Search } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface RepairRequest {
	id: string;
	orderId: string;
	customer: {
		id: string;
		name: string;
		phone: string;
	};
	fabric: {
		name: string;
		color: string;
	};
	description: string;
	status: 'pending' | 'in-progress' | 'completed';
	createdAt: string;
	completedAt: string | null;
	assignedTo: string | null;
}

export default function RepairsPage() {
	const [repairs, setRepairs] = useState<RepairRequest[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [showFilterMenu, setShowFilterMenu] = useState(false);
	const [showCompleteModal, setShowCompleteModal] = useState(false);
	const [repairToComplete, setRepairToComplete] = useState<string | null>(null);
	const [completionNote, setCompletionNote] = useState('');
	const [isUpdating, setIsUpdating] = useState(false);

	useEffect(() => {
		const fetchRepairs = async () => {
			// Mock API call - replace with actual API call
			setTimeout(() => {
				const statuses: ('pending' | 'in-progress' | 'completed')[] = ['pending', 'in-progress', 'completed'];

				const mockRepairs = Array.from({ length: 15 }, (_, index) => {
					const randomDate = new Date();
					randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));

					const status = statuses[index % statuses.length];
					const completedAt =
						status === 'completed'
							? new Date(randomDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString()
							: null;

					return {
						id: `r${index + 1}`,
						orderId: `10${String(index + 1).padStart(3, '0')}`,
						customer: {
							id: `c${index + 1}`,
							name: ['أحمد محمد', 'خالد عبدالله', 'محمد سعيد', 'عبدالعزيز سالم', 'فهد العنزي'][index % 5],
							phone: `9665${Math.floor(10000000 + Math.random() * 90000000)}`,
						},
						fabric: {
							name: ['قطن مصري', 'كتان', 'حرير'][index % 3],
							color: ['أبيض', 'أسود', 'بيج', 'أزرق فاتح'][index % 4],
						},
						description: [
							'مقاس الثوب أوسع من القياس المطلوب',
							'طول الكم قصير جدًا',
							'الخياطة عند الكتف غير متساوية',
							'القماش تالف عند الجيب',
							'المقاس ضيق عند الصدر',
						][index % 5],
						status,
						createdAt: randomDate.toISOString().split('T')[0],
						completedAt: completedAt ? completedAt.split('T')[0] : null,
						assignedTo:
							status !== 'pending' ? ['عمر الخياط', 'سعد الحربي', 'عبدالله التميمي'][index % 3] : null,
					};
				});

				setRepairs(mockRepairs);
				setIsLoading(false);
			}, 1000);
		};

		fetchRepairs();
	}, []);

	const filteredRepairs = repairs.filter((repair) => {
		// Filter by search query (order id, customer name, or description)
		const matchesSearch =
			repair.orderId.includes(searchQuery) ||
			repair.customer.name.includes(searchQuery) ||
			repair.description.includes(searchQuery);

		// Filter by status
		const matchesStatus = statusFilter === 'all' || repair.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending':
				return 'قيد الانتظار';
			case 'in-progress':
				return 'قيد التنفيذ';
			case 'completed':
				return 'مكتمل';
			default:
				return status;
		}
	};

	const getStatusClass = (status: string) => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'in-progress':
				return 'bg-blue-100 text-blue-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const handleCompleteClick = (repairId: string) => {
		setRepairToComplete(repairId);
		setCompletionNote('');
		setShowCompleteModal(true);
	};

	const confirmComplete = async () => {
		if (!repairToComplete) return;

		setIsUpdating(true);

		try {
			// Mock API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Update repair status in state
			setRepairs(
				repairs.map((repair) => {
					if (repair.id === repairToComplete) {
						return {
							...repair,
							status: 'completed',
							completedAt: new Date().toISOString().split('T')[0],
						};
					}
					return repair;
				})
			);

			setShowCompleteModal(false);
			setRepairToComplete(null);
		} catch (error) {
			console.error('Error completing repair:', error);
		} finally {
			setIsUpdating(false);
		}
	};

	if (isLoading) {
		return <div className='flex items-center justify-center h-96'>جاري التحميل...</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>طلبات الإصلاح</h1>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<div className='bg-white rounded-lg shadow-sm p-6'>
					<div className='flex items-center'>
						<div className='bg-yellow-100 p-3 rounded-full'>
							<AlertTriangle className='h-6 w-6 text-yellow-600' />
						</div>
						<div className='mr-4'>
							<p className='text-sm text-yellow-600'>قيد الانتظار</p>
							<p className='text-2xl font-bold text-gray-900'>
								{repairs.filter((r) => r.status === 'pending').length}
							</p>
						</div>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-sm p-6'>
					<div className='flex items-center'>
						<div className='bg-blue-100 p-3 rounded-full'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6 text-blue-600'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M13 10V3L4 14h7v7l9-11h-7z'
								/>
							</svg>
						</div>
						<div className='mr-4'>
							<p className='text-sm text-blue-600'>قيد التنفيذ</p>
							<p className='text-2xl font-bold text-gray-900'>
								{repairs.filter((r) => r.status === 'in-progress').length}
							</p>
						</div>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-sm p-6'>
					<div className='flex items-center'>
						<div className='bg-green-100 p-3 rounded-full'>
							<CheckCircle className='h-6 w-6 text-green-600' />
						</div>
						<div className='mr-4'>
							<p className='text-sm text-green-600'>مكتمل</p>
							<p className='text-2xl font-bold text-gray-900'>
								{repairs.filter((r) => r.status === 'completed').length}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div className='relative rounded-md shadow-sm md:w-2/3'>
						<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' aria-hidden='true' />
						</div>
						<input
							type='text'
							className='block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
							placeholder='بحث برقم الطلب أو اسم العميل أو وصف المشكلة...'
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
												<option value='completed'>مكتمل</option>
											</select>
										</div>
									</div>
									<div className='py-1'>
										<button
											className='block w-full text-right px-4 py-2 text-sm text-green-700 hover:bg-gray-100'
											onClick={() => {
												setStatusFilter('all');
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
									القماش
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									المشكلة
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									التاريخ
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									الحالة
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									مسند إلى
								</th>
								<th className='relative px-6 py-3'>
									<span className='sr-only'>إجراءات</span>
								</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{filteredRepairs.map((repair) => (
								<tr key={repair.id} className='hover:bg-gray-50'>
									<td className='px-6 py-4 whitespace-nowrap'>
										<Link
											href={`/dashboard/orders/${repair.orderId}`}
											className='text-green-600 hover:text-green-800'
										>
											#{repair.orderId}
										</Link>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<Link
											href={`/dashboard/customers/${repair.customer.id}`}
											className='text-blue-600 hover:text-blue-800'
										>
											{repair.customer.name}
										</Link>
										<p className='text-xs text-gray-500'>{repair.customer.phone}</p>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{repair.fabric.name} - {repair.fabric.color}
									</td>
									<td className='px-6 py-4 text-sm text-gray-500'>{repair.description}</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{new Date(repair.createdAt).toLocaleDateString('ar-SA')}
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
												repair.status
											)}`}
										>
											{getStatusText(repair.status)}
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{repair.assignedTo || '-'}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
										<div className='flex space-x-2 space-x-reverse'>
											<Link
												href={`/dashboard/repairs/${repair.id}`}
												className='text-indigo-600 hover:text-indigo-900'
											>
												<Eye className='h-5 w-5' />
											</Link>
											{(repair.status === 'pending' || repair.status === 'in-progress') && (
												<button
													onClick={() => handleCompleteClick(repair.id)}
													className='text-green-600 hover:text-green-900'
												>
													<CheckCircle className='h-5 w-5' />
												</button>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{filteredRepairs.length === 0 && (
					<div className='text-center py-8'>
						<p className='text-gray-500'>لا توجد طلبات إصلاح مطابقة لبحثك</p>
					</div>
				)}
			</div>

			{/* Complete Repair Modal */}
			{showCompleteModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white p-5 rounded-md shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-gray-900 mb-4'>إكمال طلب الإصلاح</h3>
						<p className='text-gray-700 mb-4'>هل تم الانتهاء من إصلاح هذا الطلب؟</p>

						<div className='mb-4'>
							<label htmlFor='completionNote' className='block text-sm font-medium text-gray-700 mb-2'>
								ملاحظات (اختياري)
							</label>
							<textarea
								id='completionNote'
								rows={3}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500'
								value={completionNote}
								onChange={(e) => setCompletionNote(e.target.value)}
								placeholder='أضف ملاحظات حول الإصلاح...'
								disabled={isUpdating}
							/>
						</div>

						<div className='flex justify-end space-x-2 space-x-reverse'>
							<button
								onClick={() => setShowCompleteModal(false)}
								className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
								disabled={isUpdating}
							>
								إلغاء
							</button>
							<button
								onClick={confirmComplete}
								className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
								disabled={isUpdating}
							>
								{isUpdating ? 'جاري الإكمال...' : 'إكمال الإصلاح'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
