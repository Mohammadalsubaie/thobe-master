'use client';

import {
	AlertTriangle,
	ChevronDown,
	Download,
	Edit,
	FileText,
	Filter,
	Package,
	Plus,
	Printer,
	RefreshCw,
	Scissors,
	Search,
	Trash,
	X,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Thread {
	id: string;
	code: string;
	name: string;
	type: string;
	color: string;
	thickness: string;
	quantity: number;
	unit: string;
	price: number;
	supplier: string;
	status: 'active' | 'low' | 'out_of_stock';
	lastUpdated: string;
}

export default function ThreadsPage() {
	const [threads, setThreads] = useState<Thread[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedType, setSelectedType] = useState<string>('');
	const [selectedStatus, setSelectedStatus] = useState<string>('');
	const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	useEffect(() => {
		// محاكاة استدعاء API لجلب بيانات الخيوط
		const fetchThreads = async () => {
			try {
				// تأخير مصطنع لمحاكاة الاتصال بالخادم
				await new Promise((resolve) => setTimeout(resolve, 800));

				const mockThreads: Thread[] = [
					{
						id: 'thread-001',
						code: 'THR-COT-001',
						name: 'خيط قطني ممتاز',
						type: 'قطن',
						color: 'أبيض',
						thickness: '40/2',
						quantity: 100,
						unit: 'بكرة',
						price: 15.0,
						supplier: 'خيوط الخليج',
						status: 'active',
						lastUpdated: '2023-08-10',
					},
					{
						id: 'thread-002',
						code: 'THR-SILK-001',
						name: 'خيط حرير',
						type: 'حرير',
						color: 'أسود',
						thickness: '30/2',
						quantity: 30,
						unit: 'بكرة',
						price: 25.0,
						supplier: 'الخيوط الفاخرة',
						status: 'active',
						lastUpdated: '2023-09-05',
					},
					{
						id: 'thread-003',
						code: 'THR-POLY-001',
						name: 'خيط بوليستر',
						type: 'بوليستر',
						color: 'أزرق',
						thickness: '60/2',
						quantity: 8,
						unit: 'بكرة',
						price: 12.0,
						supplier: 'خيوط الخليج',
						status: 'low',
						lastUpdated: '2023-08-22',
					},
					{
						id: 'thread-004',
						code: 'THR-NYLON-001',
						name: 'خيط نايلون',
						type: 'نايلون',
						color: 'شفاف',
						thickness: '50/3',
						quantity: 40,
						unit: 'بكرة',
						price: 18.0,
						supplier: 'الخيوط الفاخرة',
						status: 'active',
						lastUpdated: '2023-07-15',
					},
					{
						id: 'thread-005',
						code: 'THR-MET-001',
						name: 'خيط معدني',
						type: 'معدني',
						color: 'ذهبي',
						thickness: '20/1',
						quantity: 0,
						unit: 'بكرة',
						price: 30.0,
						supplier: 'خيوط الزينة',
						status: 'out_of_stock',
						lastUpdated: '2023-06-30',
					},
					{
						id: 'thread-006',
						code: 'THR-EMB-001',
						name: 'خيط تطريز',
						type: 'تطريز',
						color: 'أحمر',
						thickness: '12/2',
						quantity: 5,
						unit: 'بكرة',
						price: 20.0,
						supplier: 'خيوط الزينة',
						status: 'low',
						lastUpdated: '2023-09-01',
					},
				];

				setThreads(mockThreads);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching threads:', error);
				setLoading(false);
			}
		};

		fetchThreads();
	}, []);

	// فلترة الخيوط بناء على عوامل البحث والفلترة
	const filteredThreads = threads.filter((thread) => {
		// فلترة بناء على البحث
		const matchesSearch =
			thread.name.includes(searchTerm) ||
			thread.code.includes(searchTerm) ||
			thread.supplier.includes(searchTerm);

		// فلترة بناء على النوع
		const matchesType = selectedType === '' || thread.type === selectedType;

		// فلترة بناء على الحالة
		const matchesStatus = selectedStatus === '' || thread.status === selectedStatus;

		return matchesSearch && matchesType && matchesStatus;
	});

	// الحصول على قائمة فريدة من أنواع الخيوط المتاحة
	const threadTypes = Array.from(new Set(threads.map((thread) => thread.type)));

	// فتح نافذة حذف الخيط
	const openDeleteModal = (thread: Thread) => {
		setSelectedThread(thread);
		setIsDeleteModalOpen(true);
	};

	// إغلاق نافذة حذف الخيط
	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setSelectedThread(null);
	};

	// حذف الخيط
	const handleDeleteThread = () => {
		if (selectedThread) {
			// حذف الخيط من القائمة
			setThreads(threads.filter((thread) => thread.id !== selectedThread.id));
			closeDeleteModal();
		}
	};

	// تنسيق حالة المخزون
	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'active':
				return <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>متوفر</span>;
			case 'low':
				return <span className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full'>منخفض</span>;
			case 'out_of_stock':
				return <span className='px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full'>نفد</span>;
			default:
				return null;
		}
	};

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<Scissors className='inline-block ml-2 h-6 w-6 text-green-600' />
						إدارة الخيوط
					</h1>
					<p className='mt-1 text-sm text-gray-600'>إدارة مخزون الخيوط المستخدمة في الخياطة والتطريز</p>
				</div>

				<div className='flex gap-2'>
					<Link
						href='/dashboard/inventory/threads/new'
						className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700'
					>
						<Plus className='ml-1 h-4 w-4' />
						إضافة خيط جديد
					</Link>

					<button
						onClick={() => {}}
						className='px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Printer className='ml-1 h-4 w-4' />
						طباعة
					</button>

					<button
						onClick={() => {}}
						className='px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Download className='ml-1 h-4 w-4' />
						تصدير
					</button>
				</div>
			</div>

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex flex-col sm:flex-row gap-4'>
					{/* البحث */}
					<div className='flex-1 relative'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='ابحث بالاسم، الكود، أو المورد...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm'
						/>
					</div>

					{/* فلترة النوع */}
					<div className='w-full sm:w-48'>
						<div className='relative'>
							<select
								value={selectedType}
								onChange={(e) => setSelectedType(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm pr-8'
							>
								<option value=''>كل الأنواع</option>
								{threadTypes.map((type, index) => (
									<option key={index} value={type}>
										{type}
									</option>
								))}
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* فلترة الحالة */}
					<div className='w-full sm:w-48'>
						<div className='relative'>
							<select
								value={selectedStatus}
								onChange={(e) => setSelectedStatus(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm pr-8'
							>
								<option value=''>كل الحالات</option>
								<option value='active'>متوفر</option>
								<option value='low'>منخفض</option>
								<option value='out_of_stock'>نفد</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* زر إعادة تعيين الفلاتر */}
					<button
						onClick={() => {
							setSearchTerm('');
							setSelectedType('');
							setSelectedStatus('');
						}}
						className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-200'
						disabled={!searchTerm && !selectedType && !selectedStatus}
					>
						<RefreshCw className='ml-1 h-4 w-4' />
						إعادة تعيين
					</button>
				</div>

				{/* إظهار ملخص الفلاتر النشطة */}
				{(searchTerm || selectedType || selectedStatus) && (
					<div className='mt-3 flex flex-wrap gap-2'>
						{searchTerm && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
								بحث: {searchTerm}
								<button onClick={() => setSearchTerm('')} className='mr-1 focus:outline-none'>
									<X className='h-3 w-3 text-gray-500' />
								</button>
							</span>
						)}

						{selectedType && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
								النوع: {selectedType}
								<button onClick={() => setSelectedType('')} className='mr-1 focus:outline-none'>
									<X className='h-3 w-3 text-gray-500' />
								</button>
							</span>
						)}

						{selectedStatus && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
								الحالة:{' '}
								{selectedStatus === 'active' ? 'متوفر' : selectedStatus === 'low' ? 'منخفض' : 'نفد'}
								<button onClick={() => setSelectedStatus('')} className='mr-1 focus:outline-none'>
									<X className='h-3 w-3 text-gray-500' />
								</button>
							</span>
						)}
					</div>
				)}
			</div>

			{/* جدول الخيوط */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				{loading ? (
					<div className='flex justify-center items-center h-64'>
						<div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500'></div>
					</div>
				) : filteredThreads.length === 0 ? (
					<div className='p-8 text-center'>
						<Package className='mx-auto h-12 w-12 text-gray-300' />
						<h3 className='mt-2 text-base font-medium text-gray-900'>لا توجد خيوط</h3>
						<p className='mt-1 text-sm text-gray-500'>
							{searchTerm || selectedType || selectedStatus
								? 'لا توجد خيوط مطابقة لمعايير البحث.'
								: 'لم يتم إضافة أي خيوط بعد.'}
						</p>
						{(searchTerm || selectedType || selectedStatus) && (
							<button
								onClick={() => {
									setSearchTerm('');
									setSelectedType('');
									setSelectedStatus('');
								}}
								className='mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
							>
								إعادة تعيين الفلاتر
							</button>
						)}
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الكود
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الاسم
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										النوع
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										اللون
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										السماكة
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الكمية المتوفرة
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										السعر (ريال)
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										المورد
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الحالة
									</th>
									<th scope='col' className='relative px-4 py-3'>
										<span className='sr-only'>إجراءات</span>
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{filteredThreads.map((thread) => (
									<tr key={thread.id} className='hover:bg-gray-50'>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
											{thread.code}
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='text-sm font-medium text-gray-900'>{thread.name}</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-700'>
											{thread.type}
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='flex items-center'>
												<span
													className='h-4 w-4 rounded-full border border-gray-300 mr-2'
													style={{
														backgroundColor:
															thread.color === 'أبيض'
																? 'white'
																: thread.color === 'أسود'
																? 'black'
																: thread.color === 'أزرق'
																? 'blue'
																: thread.color === 'شفاف'
																? '#e0e0e0'
																: thread.color === 'ذهبي'
																? 'gold'
																: thread.color === 'أحمر'
																? 'red'
																: undefined,
													}}
												></span>
												<span className='text-sm text-gray-700'>{thread.color}</span>
											</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-700'>
											{thread.thickness}
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{thread.quantity} {thread.unit}
											</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
											{thread.price.toFixed(2)}
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-700'>
											{thread.supplier}
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>{getStatusBadge(thread.status)}</td>
										<td className='px-4 py-3 whitespace-nowrap text-left text-sm font-medium'>
											<div className='flex justify-start space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/inventory/threads/${thread.id}`}
													className='text-blue-600 hover:text-blue-800'
												>
													<span className='sr-only'>عرض</span>
													<FileText className='h-5 w-5' />
												</Link>
												<Link
													href={`/dashboard/inventory/threads/${thread.id}/edit`}
													className='text-green-600 hover:text-green-800'
												>
													<span className='sr-only'>تعديل</span>
													<Edit className='h-5 w-5' />
												</Link>
												<button
													onClick={() => openDeleteModal(thread)}
													className='text-red-600 hover:text-red-800'
												>
													<span className='sr-only'>حذف</span>
													<Trash className='h-5 w-5' />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{!loading && filteredThreads.length > 0 && (
					<div className='bg-white border-t border-gray-200 px-4 py-3 sm:px-6'>
						<div className='flex justify-between items-center'>
							<div className='text-sm text-gray-700'>
								عرض <span className='font-medium'>{filteredThreads.length}</span> من أصل{' '}
								<span className='font-medium'>{threads.length}</span> خيط
							</div>
							<div className='flex justify-end'>
								<button className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
									السابق
								</button>
								<button className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 mr-3'>
									التالي
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* نافذة تأكيد الحذف */}
			{isDeleteModalOpen && selectedThread && (
				<div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
					<div className='bg-white rounded-lg max-w-md w-full p-6'>
						<h3 className='text-lg font-medium text-gray-900 mb-4'>تأكيد الحذف</h3>
						<p className='text-sm text-gray-500 mb-4'>
							هل أنت متأكد من رغبتك في حذف الخيط{' '}
							<span className='font-medium'>{selectedThread.name}</span>؟ هذا الإجراء لا يمكن التراجع عنه.
						</p>
						<div className='flex justify-end gap-3'>
							<button
								onClick={closeDeleteModal}
								className='px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
							>
								إلغاء
							</button>
							<button
								onClick={handleDeleteThread}
								className='px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700'
							>
								حذف
							</button>
						</div>
					</div>
				</div>
			)}

			{/* إحصائيات سريعة */}
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-blue-100 text-blue-600 mr-4'>
						<Package className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>إجمالي الخيوط</p>
						<p className='text-xl font-semibold'>{threads.length} نوع</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-green-100 text-green-600 mr-4'>
						<Filter className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>متوفر</p>
						<p className='text-xl font-semibold'>
							{threads.filter((t) => t.status === 'active').length} نوع
						</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4'>
						<AlertTriangle className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>مخزون منخفض</p>
						<p className='text-xl font-semibold'>{threads.filter((t) => t.status === 'low').length} نوع</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-red-100 text-red-600 mr-4'>
						<XCircle className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>نفد من المخزون</p>
						<p className='text-xl font-semibold'>
							{threads.filter((t) => t.status === 'out_of_stock').length} نوع
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
