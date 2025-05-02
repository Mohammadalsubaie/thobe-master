'use client';

import {
	AlertTriangle,
	BarChart,
	Calendar,
	CheckCircle,
	CheckSquare,
	ChevronDown,
	Clock,
	Download,
	Edit,
	FileText,
	ListChecks,
	Package,
	PencilRuler,
	PlusCircle,
	Printer,
	RefreshCw,
	Scissors,
	Search,
	Tag,
	X,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface StockCount {
	id: string;
	countId: string;
	status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
	startDate: string;
	endDate: string | null;
	assignedTo: string;
	location: string;
	category: string;
	totalItems: number;
	countedItems: number;
	discrepancies: number;
	notes: string | null;
	createdBy: string;
	createdAt: string;
}

export default function StockCountPage() {
	const [stockCounts, setStockCounts] = useState<StockCount[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<string>('');
	const [selectedCategory, setSelectedCategory] = useState<string>('');

	useEffect(() => {
		// محاكاة استدعاء API لجلب بيانات جرد المخزون
		const fetchStockCounts = async () => {
			try {
				// تأخير مصطنع لمحاكاة الاتصال بالخادم
				await new Promise((resolve) => setTimeout(resolve, 800));

				const mockStockCounts: StockCount[] = [
					{
						id: 'sc-001',
						countId: 'SC-2023-09-001',
						status: 'completed',
						startDate: '2023-09-01',
						endDate: '2023-09-05',
						assignedTo: 'محمد العمري',
						location: 'المستودع الرئيسي',
						category: 'الأقمشة',
						totalItems: 120,
						countedItems: 120,
						discrepancies: 3,
						notes: 'وجدت اختلافات في أنواع القطن المصري',
						createdBy: 'أحمد المالكي',
						createdAt: '2023-08-28',
					},
					{
						id: 'sc-002',
						countId: 'SC-2023-09-002',
						status: 'in_progress',
						startDate: '2023-09-12',
						endDate: null,
						assignedTo: 'نورة السعدي',
						location: 'المستودع الرئيسي',
						category: 'الخيوط',
						totalItems: 80,
						countedItems: 45,
						discrepancies: 1,
						notes: null,
						createdBy: 'أحمد المالكي',
						createdAt: '2023-09-10',
					},
					{
						id: 'sc-003',
						countId: 'SC-2023-09-003',
						status: 'scheduled',
						startDate: '2023-09-20',
						endDate: null,
						assignedTo: 'عبدالله الزيد',
						location: 'مستودع الفرع الثاني',
						category: 'الاكسسوارات',
						totalItems: 200,
						countedItems: 0,
						discrepancies: 0,
						notes: 'جرد شامل لجميع الاكسسوارات',
						createdBy: 'سلطان العتيبي',
						createdAt: '2023-09-12',
					},
					{
						id: 'sc-004',
						countId: 'SC-2023-08-001',
						status: 'completed',
						startDate: '2023-08-15',
						endDate: '2023-08-16',
						assignedTo: 'مريم القحطاني',
						location: 'المستودع الرئيسي',
						category: 'الأقمشة',
						totalItems: 90,
						countedItems: 90,
						discrepancies: 0,
						notes: 'تم الجرد بنجاح دون وجود أي اختلافات',
						createdBy: 'أحمد المالكي',
						createdAt: '2023-08-10',
					},
					{
						id: 'sc-005',
						countId: 'SC-2023-08-002',
						status: 'cancelled',
						startDate: '2023-08-20',
						endDate: '2023-08-20',
						assignedTo: 'فيصل العنزي',
						location: 'مستودع الفرع الأول',
						category: 'كل الأصناف',
						totalItems: 350,
						countedItems: 0,
						discrepancies: 0,
						notes: 'تم إلغاء الجرد بسبب عطل في نظام الجرد',
						createdBy: 'سلطان العتيبي',
						createdAt: '2023-08-18',
					},
					{
						id: 'sc-006',
						countId: 'SC-2023-09-004',
						status: 'scheduled',
						startDate: '2023-09-25',
						endDate: null,
						assignedTo: 'محمد العمري',
						location: 'المستودع الرئيسي',
						category: 'الخيوط',
						totalItems: 75,
						countedItems: 0,
						discrepancies: 0,
						notes: null,
						createdBy: 'أحمد المالكي',
						createdAt: '2023-09-15',
					},
				];

				setStockCounts(mockStockCounts);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching stock counts:', error);
				setLoading(false);
			}
		};

		fetchStockCounts();
	}, []);

	// فلترة عمليات الجرد بناء على عوامل البحث والفلترة
	const filteredStockCounts = stockCounts.filter((count) => {
		// فلترة بناء على البحث
		const matchesSearch =
			count.countId.includes(searchTerm) ||
			count.assignedTo.includes(searchTerm) ||
			count.location.includes(searchTerm);

		// فلترة بناء على الحالة
		const matchesStatus = selectedStatus === '' || count.status === selectedStatus;

		// فلترة بناء على الفئة
		const matchesCategory = selectedCategory === '' || count.category === selectedCategory;

		return matchesSearch && matchesStatus && matchesCategory;
	});

	// الحصول على قائمة فريدة من فئات المنتجات المتاحة
	const categories = Array.from(new Set(stockCounts.map((count) => count.category)));

	// تنسيق حالة الجرد
	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'scheduled':
				return <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'>مجدول</span>;
			case 'in_progress':
				return (
					<span className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full'>قيد التنفيذ</span>
				);
			case 'completed':
				return <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>مكتمل</span>;
			case 'cancelled':
				return <span className='px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full'>ملغي</span>;
			default:
				return null;
		}
	};

	// التقدم في عملية الجرد كنسبة مئوية
	const getProgressPercentage = (count: StockCount) => {
		if (count.status === 'scheduled') return 0;
		if (count.status === 'cancelled') return 0;
		if (count.status === 'completed') return 100;

		return Math.round((count.countedItems / count.totalItems) * 100);
	};

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<CheckSquare className='inline-block ml-2 h-6 w-6 text-green-600' />
						جرد المخزون
					</h1>
					<p className='mt-1 text-sm text-gray-600'>إدارة عمليات جرد المخزون ومتابعة حالتها</p>
				</div>

				<div className='flex gap-2'>
					<Link
						href='/dashboard/inventory/stock-count/new'
						className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700'
					>
						<PlusCircle className='ml-1 h-4 w-4' />
						جرد جديد
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
							placeholder='ابحث برقم الجرد، اسم الموظف، أو الموقع...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm'
						/>
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
								<option value='scheduled'>مجدول</option>
								<option value='in_progress'>قيد التنفيذ</option>
								<option value='completed'>مكتمل</option>
								<option value='cancelled'>ملغي</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* فلترة الفئة */}
					<div className='w-full sm:w-48'>
						<div className='relative'>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm pr-8'
							>
								<option value=''>كل الفئات</option>
								{categories.map((category, index) => (
									<option key={index} value={category}>
										{category}
									</option>
								))}
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
							setSelectedStatus('');
							setSelectedCategory('');
						}}
						className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-200'
						disabled={!searchTerm && !selectedStatus && !selectedCategory}
					>
						<RefreshCw className='ml-1 h-4 w-4' />
						إعادة تعيين
					</button>
				</div>

				{/* إظهار ملخص الفلاتر النشطة */}
				{(searchTerm || selectedStatus || selectedCategory) && (
					<div className='mt-3 flex flex-wrap gap-2'>
						{searchTerm && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
								بحث: {searchTerm}
								<button onClick={() => setSearchTerm('')} className='mr-1 focus:outline-none'>
									<X className='h-3 w-3 text-gray-500' />
								</button>
							</span>
						)}

						{selectedStatus && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
								الحالة:{' '}
								{selectedStatus === 'scheduled'
									? 'مجدول'
									: selectedStatus === 'in_progress'
									? 'قيد التنفيذ'
									: selectedStatus === 'completed'
									? 'مكتمل'
									: 'ملغي'}
								<button onClick={() => setSelectedStatus('')} className='mr-1 focus:outline-none'>
									<X className='h-3 w-3 text-gray-500' />
								</button>
							</span>
						)}

						{selectedCategory && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
								الفئة: {selectedCategory}
								<button onClick={() => setSelectedCategory('')} className='mr-1 focus:outline-none'>
									<X className='h-3 w-3 text-gray-500' />
								</button>
							</span>
						)}
					</div>
				)}
			</div>

			{/* قائمة عمليات الجرد */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				{loading ? (
					<div className='flex justify-center items-center h-64'>
						<div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500'></div>
					</div>
				) : filteredStockCounts.length === 0 ? (
					<div className='p-8 text-center'>
						<CheckSquare className='mx-auto h-12 w-12 text-gray-300' />
						<h3 className='mt-2 text-base font-medium text-gray-900'>لا توجد عمليات جرد</h3>
						<p className='mt-1 text-sm text-gray-500'>
							{searchTerm || selectedStatus || selectedCategory
								? 'لا توجد عمليات جرد مطابقة لمعايير البحث.'
								: 'لم يتم إضافة أي عمليات جرد بعد.'}
						</p>
						{(searchTerm || selectedStatus || selectedCategory) && (
							<button
								onClick={() => {
									setSearchTerm('');
									setSelectedStatus('');
									setSelectedCategory('');
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
										رقم الجرد
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الحالة
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										تاريخ البدء
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										المسؤول
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الموقع
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الفئة
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										التقدم
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الاختلافات
									</th>
									<th scope='col' className='relative px-4 py-3'>
										<span className='sr-only'>إجراءات</span>
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{filteredStockCounts.map((count) => (
									<tr key={count.id} className='hover:bg-gray-50'>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='text-sm font-medium text-gray-900'>{count.countId}</div>
											<div className='text-xs text-gray-500'>
												{new Date(count.createdAt).toLocaleDateString('ar-SA')}
											</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>{getStatusBadge(count.status)}</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{new Date(count.startDate).toLocaleDateString('ar-SA')}
											</div>
											{count.endDate && (
												<div className='text-xs text-gray-500'>
													انتهى: {new Date(count.endDate).toLocaleDateString('ar-SA')}
												</div>
											)}
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-700'>
											{count.assignedTo}
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-700'>
											{count.location}
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='flex items-center'>
												{count.category === 'الأقمشة' && (
													<PencilRuler className='ml-1 h-4 w-4 text-blue-500' />
												)}
												{count.category === 'الخيوط' && (
													<Scissors className='ml-1 h-4 w-4 text-green-500' />
												)}
												{count.category === 'الاكسسوارات' && (
													<Tag className='ml-1 h-4 w-4 text-purple-500' />
												)}
												{count.category === 'كل الأصناف' && (
													<Package className='ml-1 h-4 w-4 text-gray-500' />
												)}
												<span className='text-sm text-gray-700'>{count.category}</span>
											</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='w-full bg-gray-200 rounded-full h-2 mr-2 w-24'>
													<div
														className={`h-2 rounded-full ${
															count.status === 'completed'
																? 'bg-green-500'
																: count.status === 'in_progress'
																? 'bg-yellow-500'
																: count.status === 'cancelled'
																? 'bg-red-500'
																: 'bg-blue-500'
														}`}
														style={{ width: `${getProgressPercentage(count)}%` }}
													></div>
												</div>
												<span className='text-sm text-gray-700'>
													{getProgressPercentage(count)}%
												</span>
											</div>
											<div className='text-xs text-gray-500 mt-1'>
												{count.countedItems} / {count.totalItems} صنف
											</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											{count.status === 'completed' || count.status === 'in_progress' ? (
												<span
													className={`text-sm font-medium ${
														count.discrepancies > 0 ? 'text-red-600' : 'text-green-600'
													}`}
												>
													{count.discrepancies}
												</span>
											) : (
												<span className='text-sm text-gray-500'>-</span>
											)}
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-left text-sm font-medium'>
											<div className='flex justify-start space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/inventory/stock-count/${count.id}`}
													className='text-blue-600 hover:text-blue-800'
												>
													<span className='sr-only'>عرض</span>
													<FileText className='h-5 w-5' />
												</Link>
												{count.status === 'scheduled' && (
													<Link
														href={`/dashboard/inventory/stock-count/${count.id}/edit`}
														className='text-green-600 hover:text-green-800'
													>
														<span className='sr-only'>تعديل</span>
														<Edit className='h-5 w-5' />
													</Link>
												)}
												{count.status === 'in_progress' && (
													<Link
														href={`/dashboard/inventory/stock-count/${count.id}/count`}
														className='text-yellow-600 hover:text-yellow-800'
													>
														<span className='sr-only'>متابعة الجرد</span>
														<ListChecks className='h-5 w-5' />
													</Link>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{!loading && filteredStockCounts.length > 0 && (
					<div className='bg-white border-t border-gray-200 px-4 py-3 sm:px-6'>
						<div className='flex justify-between items-center'>
							<div className='text-sm text-gray-700'>
								عرض <span className='font-medium'>{filteredStockCounts.length}</span> من أصل{' '}
								<span className='font-medium'>{stockCounts.length}</span> عملية جرد
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

			{/* إحصائيات سريعة */}
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-blue-100 text-blue-600 mr-4'>
						<Calendar className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>مجدول</p>
						<p className='text-xl font-semibold'>
							{stockCounts.filter((c) => c.status === 'scheduled').length}
						</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4'>
						<Clock className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>قيد التنفيذ</p>
						<p className='text-xl font-semibold'>
							{stockCounts.filter((c) => c.status === 'in_progress').length}
						</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-green-100 text-green-600 mr-4'>
						<CheckCircle className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>مكتمل</p>
						<p className='text-xl font-semibold'>
							{stockCounts.filter((c) => c.status === 'completed').length}
						</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-red-100 text-red-600 mr-4'>
						<XCircle className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>ملغي</p>
						<p className='text-xl font-semibold'>
							{stockCounts.filter((c) => c.status === 'cancelled').length}
						</p>
					</div>
				</div>
			</div>

			{/* ملخص الاختلافات */}
			{!loading && filteredStockCounts.some((c) => c.status === 'completed' && c.discrepancies > 0) && (
				<div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
					<h3 className='text-lg font-medium text-yellow-800 flex items-center'>
						<AlertTriangle className='ml-2 h-5 w-5 text-yellow-600' />
						ملاحظة: يوجد اختلافات في بعض عمليات الجرد
					</h3>
					<p className='mt-2 text-sm text-yellow-700'>
						هناك اختلافات في عمليات الجرد المكتملة. يرجى مراجعة تفاصيل هذه العمليات وتحديث المخزون وفقا
						لذلك.
					</p>
					<div className='mt-3'>
						<Link
							href='/dashboard/inventory/discrepancies'
							className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700'
						>
							<BarChart className='ml-2 h-4 w-4' />
							عرض تقرير الاختلافات
						</Link>
					</div>
				</div>
			)}
		</div>
	);
}
