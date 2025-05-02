'use client';

import {
	AlertTriangle,
	ArrowDown,
	ArrowRight,
	ArrowUp,
	BarChart2,
	Calendar,
	CheckCircle,
	ChevronDown,
	Clock,
	Download,
	FileText,
	Info,
	Package,
	PencilRuler,
	Printer,
	RefreshCw,
	Scissors,
	Search,
	Share2,
	Tag,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DiscrepancyItem {
	id: string;
	stockCountId: string;
	stockCountCode: string;
	itemCode: string;
	itemName: string;
	category: 'الأقمشة' | 'الخيوط' | 'الاكسسوارات' | 'أخرى';
	systemQuantity: number;
	actualQuantity: number;
	difference: number;
	diffPercentage: number;
	unit: string;
	location: string;
	date: string;
	status: 'pending' | 'adjusted' | 'ignored';
	notes: string | null;
}

export default function DiscrepanciesPage() {
	const [discrepancies, setDiscrepancies] = useState<DiscrepancyItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [selectedStatus, setSelectedStatus] = useState<string>('');
	const [selectedDateRange, setSelectedDateRange] = useState<string>('all');
	const [sortField, setSortField] = useState<string>('date');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

	// مؤشرات للتحليل
	const [stats, setStats] = useState({
		totalItems: 0,
		totalDifference: 0,
		pendingAdjustments: 0,
		completedAdjustments: 0,
		ignoredItems: 0,
	});

	useEffect(() => {
		// محاكاة استدعاء API لجلب بيانات الاختلافات
		const fetchDiscrepancies = async () => {
			try {
				// تأخير مصطنع لمحاكاة الاتصال بالخادم
				await new Promise((resolve) => setTimeout(resolve, 800));

				// بيانات تجريبية للاختلافات
				const mockDiscrepancies: DiscrepancyItem[] = [
					{
						id: 'disc-001',
						stockCountId: 'sc-001',
						stockCountCode: 'SC-2023-09-001',
						itemCode: 'FAB-COTTON-001',
						itemName: 'قطن مصري فاخر',
						category: 'الأقمشة',
						systemQuantity: 250,
						actualQuantity: 245,
						difference: -5,
						diffPercentage: 2,
						unit: 'متر',
						location: 'المستودع الرئيسي',
						date: '2023-09-05',
						status: 'adjusted',
						notes: 'وجدت قطع تالفة لم تسجل في النظام',
					},
					{
						id: 'disc-002',
						stockCountId: 'sc-001',
						stockCountCode: 'SC-2023-09-001',
						itemCode: 'FAB-SILK-001',
						itemName: 'حرير طبيعي',
						category: 'الأقمشة',
						systemQuantity: 80,
						actualQuantity: 82,
						difference: 2,
						diffPercentage: 2.5,
						unit: 'متر',
						location: 'المستودع الرئيسي',
						date: '2023-09-05',
						status: 'pending',
						notes: null,
					},
					{
						id: 'disc-003',
						stockCountId: 'sc-001',
						stockCountCode: 'SC-2023-09-001',
						itemCode: 'FAB-WOOL-001',
						itemName: 'صوف كشميري',
						category: 'الأقمشة',
						systemQuantity: 35,
						actualQuantity: 30,
						difference: -5,
						diffPercentage: 14.29,
						unit: 'متر',
						location: 'المستودع الرئيسي',
						date: '2023-09-05',
						status: 'pending',
						notes: 'يجب إعادة طلب كمية جديدة',
					},
					{
						id: 'disc-004',
						stockCountId: 'sc-002',
						stockCountCode: 'SC-2023-09-002',
						itemCode: 'THR-COT-001',
						itemName: 'خيط قطني ممتاز',
						category: 'الخيوط',
						systemQuantity: 100,
						actualQuantity: 95,
						difference: -5,
						diffPercentage: 5,
						unit: 'بكرة',
						location: 'المستودع الرئيسي',
						date: '2023-09-12',
						status: 'pending',
						notes: 'بعض البكرات مستخدمة جزئياً',
					},
					{
						id: 'disc-005',
						stockCountId: 'sc-002',
						stockCountCode: 'SC-2023-09-002',
						itemCode: 'THR-POLY-001',
						itemName: 'خيط بوليستر',
						category: 'الخيوط',
						systemQuantity: 50,
						actualQuantity: 45,
						difference: -5,
						diffPercentage: 10,
						unit: 'بكرة',
						location: 'المستودع الرئيسي',
						date: '2023-09-12',
						status: 'ignored',
						notes: 'تم التحقق منها، الاختلاف مقبول',
					},
					{
						id: 'disc-006',
						stockCountId: 'sc-003',
						stockCountCode: 'SC-2023-08-001',
						itemCode: 'ACC-BTN-001',
						itemName: 'أزرار كلاسيكية',
						category: 'الاكسسوارات',
						systemQuantity: 500,
						actualQuantity: 480,
						difference: -20,
						diffPercentage: 4,
						unit: 'قطعة',
						location: 'مستودع الفرع الثاني',
						date: '2023-08-16',
						status: 'adjusted',
						notes: null,
					},
					{
						id: 'disc-007',
						stockCountId: 'sc-003',
						stockCountCode: 'SC-2023-08-001',
						itemCode: 'ACC-ZP-001',
						itemName: 'سحاب معدني',
						category: 'الاكسسوارات',
						systemQuantity: 200,
						actualQuantity: 220,
						difference: 20,
						diffPercentage: 10,
						unit: 'قطعة',
						location: 'مستودع الفرع الثاني',
						date: '2023-08-16',
						status: 'adjusted',
						notes: 'تم استلام شحنة جديدة لم تسجل في النظام',
					},
				];

				setDiscrepancies(mockDiscrepancies);

				// حساب الإحصائيات
				const totalItems = mockDiscrepancies.length;
				const totalDifference = mockDiscrepancies.reduce((sum, item) => sum + Math.abs(item.difference), 0);
				const pendingAdjustments = mockDiscrepancies.filter((item) => item.status === 'pending').length;
				const completedAdjustments = mockDiscrepancies.filter((item) => item.status === 'adjusted').length;
				const ignoredItems = mockDiscrepancies.filter((item) => item.status === 'ignored').length;

				setStats({
					totalItems,
					totalDifference,
					pendingAdjustments,
					completedAdjustments,
					ignoredItems,
				});

				setLoading(false);
			} catch (error) {
				console.error('Error fetching discrepancies:', error);
				setLoading(false);
			}
		};

		fetchDiscrepancies();
	}, []);

	// فلترة الاختلافات بناء على عوامل البحث والفلترة
	const filteredDiscrepancies = discrepancies.filter((item) => {
		// فلترة بناء على البحث
		const matchesSearch =
			item.itemName.includes(searchTerm) ||
			item.itemCode.includes(searchTerm) ||
			item.stockCountCode.includes(searchTerm);

		// فلترة بناء على الفئة
		const matchesCategory = selectedCategory === '' || item.category === selectedCategory;

		// فلترة بناء على الحالة
		const matchesStatus = selectedStatus === '' || item.status === selectedStatus;

		// فلترة بناء على نطاق التاريخ
		let matchesDateRange = true;
		const itemDate = new Date(item.date);
		const today = new Date();

		if (selectedDateRange === 'week') {
			const weekAgo = new Date();
			weekAgo.setDate(today.getDate() - 7);
			matchesDateRange = itemDate >= weekAgo;
		} else if (selectedDateRange === 'month') {
			const monthAgo = new Date();
			monthAgo.setMonth(today.getMonth() - 1);
			matchesDateRange = itemDate >= monthAgo;
		} else if (selectedDateRange === 'quarter') {
			const quarterAgo = new Date();
			quarterAgo.setMonth(today.getMonth() - 3);
			matchesDateRange = itemDate >= quarterAgo;
		}

		return matchesSearch && matchesCategory && matchesStatus && matchesDateRange;
	});

	// ترتيب الاختلافات
	const sortedDiscrepancies = [...filteredDiscrepancies].sort((a, b) => {
		if (sortField === 'date') {
			return sortDirection === 'asc'
				? new Date(a.date).getTime() - new Date(b.date).getTime()
				: new Date(b.date).getTime() - new Date(a.date).getTime();
		} else if (sortField === 'difference') {
			return sortDirection === 'asc'
				? Math.abs(a.difference) - Math.abs(b.difference)
				: Math.abs(b.difference) - Math.abs(a.difference);
		} else if (sortField === 'percentage') {
			return sortDirection === 'asc' ? a.diffPercentage - b.diffPercentage : b.diffPercentage - a.diffPercentage;
		}
		return 0;
	});

	// تبديل اتجاه الترتيب
	const toggleSort = (field: string) => {
		if (sortField === field) {
			setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
		} else {
			setSortField(field);
			setSortDirection('desc');
		}
	};

	// الحصول على أيقونة الفئة
	const getCategoryIcon = (category: string) => {
		switch (category) {
			case 'الأقمشة':
				return <PencilRuler className='h-4 w-4 text-blue-500' />;
			case 'الخيوط':
				return <Scissors className='h-4 w-4 text-green-500' />;
			case 'الاكسسوارات':
				return <Tag className='h-4 w-4 text-purple-500' />;
			default:
				return <Package className='h-4 w-4 text-gray-500' />;
		}
	};

	// تحديث حالة الاختلاف
	const updateDiscrepancyStatus = (id: string, newStatus: 'pending' | 'adjusted' | 'ignored') => {
		setDiscrepancies((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));

		// تحديث الإحصائيات
		const updatedDiscrepancies = discrepancies.map((item) =>
			item.id === id ? { ...item, status: newStatus } : item
		);

		const pendingAdjustments = updatedDiscrepancies.filter((item) => item.status === 'pending').length;
		const completedAdjustments = updatedDiscrepancies.filter((item) => item.status === 'adjusted').length;
		const ignoredItems = updatedDiscrepancies.filter((item) => item.status === 'ignored').length;

		setStats((prev) => ({
			...prev,
			pendingAdjustments,
			completedAdjustments,
			ignoredItems,
		}));
	};

	// تنسيق حالة الاختلاف
	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'pending':
				return (
					<span className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full'>
						بانتظار التسوية
					</span>
				);
			case 'adjusted':
				return <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>تمت التسوية</span>;
			case 'ignored':
				return <span className='px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full'>تم التجاهل</span>;
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
						<AlertTriangle className='inline-block ml-2 h-6 w-6 text-yellow-600' />
						تقرير اختلافات المخزون
					</h1>
					<p className='mt-1 text-sm text-gray-600'>
						عرض وإدارة اختلافات المخزون بين الكميات المسجلة في النظام والكميات الفعلية
					</p>
				</div>

				<div className='flex gap-2'>
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

					<button
						onClick={() => {}}
						className='px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Share2 className='ml-1 h-4 w-4' />
						مشاركة
					</button>
				</div>
			</div>

			{/* بطاقات الإحصائيات */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4'>
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-blue-100 text-blue-600 mr-4'>
						<Package className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>إجمالي الاختلافات</p>
						<p className='text-xl font-semibold'>{stats.totalItems}</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-red-100 text-red-600 mr-4'>
						<BarChart2 className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>إجمالي الفرق</p>
						<p className='text-xl font-semibold'>{stats.totalDifference} وحدة</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4'>
						<Clock className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>بانتظار التسوية</p>
						<p className='text-xl font-semibold'>{stats.pendingAdjustments}</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-green-100 text-green-600 mr-4'>
						<CheckCircle className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>تمت التسوية</p>
						<p className='text-xl font-semibold'>{stats.completedAdjustments}</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-gray-100 text-gray-600 mr-4'>
						<X className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>تم تجاهلها</p>
						<p className='text-xl font-semibold'>{stats.ignoredItems}</p>
					</div>
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
							placeholder='ابحث بالاسم، الكود، أو رقم الجرد...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-sm'
						/>
					</div>

					{/* فلترة الفئة */}
					<div className='w-full sm:w-48'>
						<div className='relative'>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-sm pr-8'
							>
								<option value=''>كل الفئات</option>
								<option value='الأقمشة'>الأقمشة</option>
								<option value='الخيوط'>الخيوط</option>
								<option value='الاكسسوارات'>الاكسسوارات</option>
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
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-sm pr-8'
							>
								<option value=''>كل الحالات</option>
								<option value='pending'>بانتظار التسوية</option>
								<option value='adjusted'>تمت التسوية</option>
								<option value='ignored'>تم التجاهل</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* فلترة التاريخ */}
					<div className='w-full sm:w-48'>
						<div className='relative'>
							<select
								value={selectedDateRange}
								onChange={(e) => setSelectedDateRange(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 text-sm pr-8'
							>
								<option value='all'>كل الفترات</option>
								<option value='week'>آخر أسبوع</option>
								<option value='month'>آخر شهر</option>
								<option value='quarter'>آخر 3 أشهر</option>
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
							setSelectedCategory('');
							setSelectedStatus('');
							setSelectedDateRange('all');
						}}
						className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-200'
						disabled={!searchTerm && !selectedCategory && !selectedStatus && selectedDateRange === 'all'}
					>
						<RefreshCw className='ml-1 h-4 w-4' />
						إعادة تعيين
					</button>
				</div>

				{/* إظهار ملخص الفلاتر النشطة */}
				{(searchTerm || selectedCategory || selectedStatus || selectedDateRange !== 'all') && (
					<div className='mt-3 flex flex-wrap gap-2'>
						{searchTerm && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
								بحث: {searchTerm}
								<button onClick={() => setSearchTerm('')} className='mr-1 focus:outline-none'>
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

						{selectedStatus && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
								الحالة:{' '}
								{selectedStatus === 'pending'
									? 'بانتظار التسوية'
									: selectedStatus === 'adjusted'
									? 'تمت التسوية'
									: 'تم التجاهل'}
								<button onClick={() => setSelectedStatus('')} className='mr-1 focus:outline-none'>
									<X className='h-3 w-3 text-gray-500' />
								</button>
							</span>
						)}

						{selectedDateRange !== 'all' && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
								الفترة:{' '}
								{selectedDateRange === 'week'
									? 'آخر أسبوع'
									: selectedDateRange === 'month'
									? 'آخر شهر'
									: 'آخر 3 أشهر'}
								<button onClick={() => setSelectedDateRange('all')} className='mr-1 focus:outline-none'>
									<X className='h-3 w-3 text-gray-500' />
								</button>
							</span>
						)}
					</div>
				)}
			</div>

			{/* جدول الاختلافات */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				{loading ? (
					<div className='flex justify-center items-center h-64'>
						<div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-yellow-500'></div>
					</div>
				) : sortedDiscrepancies.length === 0 ? (
					<div className='p-8 text-center'>
						<AlertTriangle className='mx-auto h-12 w-12 text-gray-300' />
						<h3 className='mt-2 text-base font-medium text-gray-900'>لا توجد اختلافات</h3>
						<p className='mt-1 text-sm text-gray-500'>
							{searchTerm || selectedCategory || selectedStatus || selectedDateRange !== 'all'
								? 'لا توجد اختلافات مطابقة لمعايير البحث.'
								: 'لا توجد اختلافات في المخزون حالياً.'}
						</p>
						{(searchTerm || selectedCategory || selectedStatus || selectedDateRange !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setSelectedCategory('');
									setSelectedStatus('');
									setSelectedDateRange('all');
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
										الصنف
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
										الكمية في النظام
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الكمية الفعلية
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
										onClick={() => toggleSort('difference')}
									>
										<div className='flex items-center justify-between'>
											<span>الفرق</span>
											{sortField === 'difference' &&
												(sortDirection === 'asc' ? (
													<ArrowUp className='h-3 w-3' />
												) : (
													<ArrowDown className='h-3 w-3' />
												))}
										</div>
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
										onClick={() => toggleSort('percentage')}
									>
										<div className='flex items-center justify-between'>
											<span>نسبة الاختلاف</span>
											{sortField === 'percentage' &&
												(sortDirection === 'asc' ? (
													<ArrowUp className='h-3 w-3' />
												) : (
													<ArrowDown className='h-3 w-3' />
												))}
										</div>
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										رقم الجرد
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
										onClick={() => toggleSort('date')}
									>
										<div className='flex items-center justify-between'>
											<span>التاريخ</span>
											{sortField === 'date' &&
												(sortDirection === 'asc' ? (
													<ArrowUp className='h-3 w-3' />
												) : (
													<ArrowDown className='h-3 w-3' />
												))}
										</div>
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
								{sortedDiscrepancies.map((item) => (
									<tr key={item.id} className='hover:bg-gray-50'>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='text-sm font-medium text-gray-900'>{item.itemName}</div>
											<div className='text-xs text-gray-500'>{item.itemCode}</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='flex items-center'>
												{getCategoryIcon(item.category)}
												<span className='text-sm text-gray-700 mr-1'>{item.category}</span>
											</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
											{item.systemQuantity} {item.unit}
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
											{item.actualQuantity} {item.unit}
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<span
												className={`text-sm font-medium ${
													item.difference > 0
														? 'text-green-600'
														: item.difference < 0
														? 'text-red-600'
														: 'text-gray-500'
												}`}
											>
												{item.difference > 0 ? '+' : ''}
												{item.difference} {item.unit}
											</span>
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<span
												className={`text-sm font-medium ${
													item.diffPercentage >= 10
														? 'text-red-600'
														: item.diffPercentage > 5
														? 'text-yellow-600'
														: 'text-blue-600'
												}`}
											>
												{item.diffPercentage}%
											</span>
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<Link
												href={`/dashboard/inventory/stock-count/${item.stockCountId}`}
												className='text-sm text-blue-600 hover:text-blue-800'
											>
												{item.stockCountCode}
											</Link>
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='flex items-center'>
												<Calendar className='h-4 w-4 text-gray-400 ml-1' />
												<span className='text-sm text-gray-500'>
													{new Date(item.date).toLocaleDateString('ar-SA')}
												</span>
											</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>{getStatusBadge(item.status)}</td>
										<td className='px-4 py-3 whitespace-nowrap text-left text-sm font-medium'>
											{item.status === 'pending' ? (
												<div className='flex justify-start space-x-2 space-x-reverse'>
													<button
														onClick={() => updateDiscrepancyStatus(item.id, 'adjusted')}
														className='text-green-600 hover:text-green-800'
														title='تسوية'
													>
														<CheckCircle className='h-5 w-5' />
													</button>
													<button
														onClick={() => updateDiscrepancyStatus(item.id, 'ignored')}
														className='text-gray-600 hover:text-gray-800'
														title='تجاهل'
													>
														<X className='h-5 w-5' />
													</button>
													<Link
														href={`/dashboard/inventory/adjust/${item.id}`}
														className='text-blue-600 hover:text-blue-800'
														title='تفاصيل'
													>
														<FileText className='h-5 w-5' />
													</Link>
												</div>
											) : (
												<div className='flex justify-start space-x-2 space-x-reverse'>
													<Link
														href={`/dashboard/inventory/adjust/${item.id}`}
														className='text-blue-600 hover:text-blue-800'
														title='تفاصيل'
													>
														<FileText className='h-5 w-5' />
													</Link>
													{item.status === 'adjusted' && (
														<button
															onClick={() => updateDiscrepancyStatus(item.id, 'pending')}
															className='text-yellow-600 hover:text-yellow-800'
															title='إعادة فتح'
														>
															<RefreshCw className='h-5 w-5' />
														</button>
													)}
												</div>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{!loading && sortedDiscrepancies.length > 0 && (
					<div className='bg-white border-t border-gray-200 px-4 py-3 sm:px-6'>
						<div className='flex justify-between items-center'>
							<div className='text-sm text-gray-700'>
								عرض <span className='font-medium'>{sortedDiscrepancies.length}</span> من أصل{' '}
								<span className='font-medium'>{discrepancies.length}</span> اختلاف
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

			{/* معلومات حول تقرير الاختلافات */}
			<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
				<h3 className='text-lg font-medium text-blue-900 flex items-center'>
					<Info className='ml-2 h-5 w-5 text-blue-500' />
					معلومات حول تقرير الاختلافات
				</h3>
				<ul className='mt-2 space-y-2 text-sm text-blue-700 list-disc list-inside pr-2'>
					<li>يعرض هذا التقرير اختلافات المخزون المكتشفة خلال عمليات الجرد</li>
					<li>نسبة الاختلاف = (الفرق / الكمية في النظام) × 100</li>
					<li>يمكن تسوية الاختلافات عبر تحديث كميات المخزون في النظام أو تجاهلها إذا كانت غير مهمة</li>
					<li>اختلافات بنسبة &gt; 10% تظهر باللون الأحمر وتتطلب مراجعة فورية</li>
					<li>بعد تسوية الاختلاف، يتم تحديث المخزون تلقائياً في النظام</li>
				</ul>
				<div className='mt-3'>
					<Link
						href='/dashboard/inventory/stock-count'
						className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700'
					>
						<ArrowRight className='ml-2 h-4 w-4' />
						إدارة عمليات الجرد
					</Link>
				</div>
			</div>
		</div>
	);
}
