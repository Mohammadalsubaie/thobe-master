'use client';

import {
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	BarChart2,
	CheckCircle,
	ChevronDown,
	Clock,
	CreditCard,
	Download,
	Edit,
	Eye,
	FileText,
	Layers,
	MoreHorizontal,
	Plus,
	Printer,
	RefreshCw,
	Search,
	TrendingDown,
	TrendingUp,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Income {
	id: string;
	reference: string;
	date: string;
	amount: number;
	source: string;
	category: string;
	description: string;
	paymentMethod?: string;
	status: 'pending' | 'completed' | 'canceled';
	customer?: {
		id: string;
		name: string;
		type: 'individual' | 'company';
	};
	attachments: number;
	receipt?: string;
	relatedTo?: {
		type: 'order' | 'invoice' | 'subscription';
		id: string;
		reference: string;
	};
	createdBy: string;
	recurring?: boolean;
	recurrenceInfo?: {
		frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
		nextDate: string;
	};
}

interface IncomeSource {
	id: string;
	name: string;
	count: number;
	totalAmount: number;
}

interface MonthlyIncome {
	month: string;
	totalAmount: number;
	previousYearAmount?: number;
	change?: number;
}

export default function IncomePage() {
	const [incomes, setIncomes] = useState<Income[]>([]);
	const [filteredIncomes, setFilteredIncomes] = useState<Income[]>([]);
	const [sources, setSources] = useState<IncomeSource[]>([]);
	const [monthlyData, setMonthlyData] = useState<MonthlyIncome[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedIncome, setExpandedIncome] = useState<string | null>(null);

	// حالة الفلترة
	const [searchTerm, setSearchTerm] = useState('');
	const [sourceFilter, setSourceFilter] = useState('all');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [dateFilter, setDateFilter] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	// إحصائيات سريعة
	const [stats, setStats] = useState({
		totalIncome: 0,
		monthlyAverage: 0,
		yearlyGrowth: 0,
		pendingIncome: 0,
	});

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// بيانات تجريبية للإيرادات
			const mockIncomes: Income[] = [
				{
					id: 'inc-001',
					reference: 'INC-20231001-001',
					date: '2023-10-01',
					amount: 3500.0,
					source: 'مبيعات',
					category: 'مبيعات متجر',
					description: 'مبيعات متجر - فرع الرياض',
					paymentMethod: 'بطاقة ائتمانية',
					status: 'completed',
					customer: {
						id: 'cust-001',
						name: 'عبدالله محمد',
						type: 'individual',
					},
					attachments: 1,
					receipt: 'receipt-001.pdf',
					relatedTo: {
						type: 'invoice',
						id: 'inv-001',
						reference: 'INV-20231001-001',
					},
					createdBy: 'فهد السالم',
				},
				{
					id: 'inc-002',
					reference: 'INC-20231002-002',
					date: '2023-10-02',
					amount: 4800.0,
					source: 'مبيعات',
					category: 'مبيعات إلكترونية',
					description: 'مبيعات عبر الموقع الإلكتروني',
					paymentMethod: 'بطاقة ائتمانية',
					status: 'completed',
					attachments: 1,
					receipt: 'receipt-002.pdf',
					relatedTo: {
						type: 'order',
						id: 'ord-002',
						reference: 'ORD-20231002-002',
					},
					createdBy: 'أحمد محمد',
				},
				{
					id: 'inc-003',
					reference: 'INC-20231003-003',
					date: '2023-10-03',
					amount: 1200.0,
					source: 'خدمات',
					category: 'خدمات خياطة',
					description: 'خدمات تفصيل وخياطة',
					paymentMethod: 'نقداً',
					status: 'completed',
					customer: {
						id: 'cust-002',
						name: 'سلطان الحربي',
						type: 'individual',
					},
					attachments: 1,
					receipt: 'receipt-003.pdf',
					createdBy: 'فهد السالم',
				},
				{
					id: 'inc-004',
					reference: 'INC-20231005-004',
					date: '2023-10-05',
					amount: 15000.0,
					source: 'عقود',
					category: 'عقد توريد',
					description: 'عقد توريد زي موحد لشركة الاتصالات',
					paymentMethod: 'تحويل بنكي',
					status: 'completed',
					customer: {
						id: 'cust-003',
						name: 'شركة الاتصالات السعودية',
						type: 'company',
					},
					attachments: 2,
					receipt: 'receipt-004.pdf',
					relatedTo: {
						type: 'invoice',
						id: 'inv-004',
						reference: 'INV-20231004-004',
					},
					createdBy: 'محمد العمري',
				},
				{
					id: 'inc-005',
					reference: 'INC-20231007-005',
					date: '2023-10-07',
					amount: 2500.0,
					source: 'مبيعات',
					category: 'مبيعات متجر',
					description: 'مبيعات متجر - فرع جدة',
					paymentMethod: 'بطاقة ائتمانية',
					status: 'completed',
					attachments: 0,
					createdBy: 'أحمد محمد',
				},
				{
					id: 'inc-006',
					reference: 'INC-20231010-006',
					date: '2023-10-10',
					amount: 750.0,
					source: 'استشارات',
					category: 'استشارات تصميم',
					description: 'استشارات في تصميم الأزياء',
					paymentMethod: 'نقداً',
					status: 'completed',
					customer: {
						id: 'cust-004',
						name: 'فيصل العتيبي',
						type: 'individual',
					},
					attachments: 0,
					createdBy: 'فهد السالم',
				},
				{
					id: 'inc-007',
					reference: 'INC-20231012-007',
					date: '2023-10-12',
					amount: 8000.0,
					source: 'اشتراكات',
					category: 'خطة الاشتراك السنوية',
					description: 'رسوم الاشتراك السنوي لخدمات التصميم',
					paymentMethod: 'تحويل بنكي',
					status: 'completed',
					customer: {
						id: 'cust-005',
						name: 'شركة الأناقة للأزياء',
						type: 'company',
					},
					attachments: 1,
					receipt: 'receipt-007.pdf',
					relatedTo: {
						type: 'subscription',
						id: 'sub-001',
						reference: 'SUB-20231012-001',
					},
					createdBy: 'محمد العمري',
					recurring: true,
					recurrenceInfo: {
						frequency: 'yearly',
						nextDate: '2024-10-12',
					},
				},
				{
					id: 'inc-008',
					reference: 'INC-20231014-008',
					date: '2023-10-14',
					amount: 3000.0,
					source: 'مبيعات',
					category: 'مبيعات إلكترونية',
					description: 'مبيعات عبر تطبيق الجوال',
					paymentMethod: 'بطاقة ائتمانية',
					status: 'pending',
					attachments: 0,
					createdBy: 'أحمد محمد',
				},
				{
					id: 'inc-009',
					reference: 'INC-20231015-009',
					date: '2023-10-15',
					amount: 5000.0,
					source: 'عقود',
					category: 'عقد صيانة',
					description: 'عقد صيانة وإصلاح ماكينات الخياطة',
					paymentMethod: 'تحويل بنكي',
					status: 'pending',
					customer: {
						id: 'cust-006',
						name: 'معهد تطوير المهارات',
						type: 'company',
					},
					attachments: 1,
					createdBy: 'محمد العمري',
				},
				{
					id: 'inc-010',
					reference: 'INC-20231017-010',
					date: '2023-10-17',
					amount: 2200.0,
					source: 'مبيعات',
					category: 'مبيعات متجر',
					description: 'مبيعات متجر - فرع الدمام',
					paymentMethod: 'نقداً',
					status: 'completed',
					attachments: 0,
					createdBy: 'فهد السالم',
				},
				{
					id: 'inc-011',
					reference: 'INC-20231020-011',
					date: '2023-10-20',
					amount: 1800.0,
					source: 'خدمات',
					category: 'خدمات تعديل',
					description: 'خدمات تعديل وتصليح ملابس',
					paymentMethod: 'بطاقة ائتمانية',
					status: 'completed',
					customer: {
						id: 'cust-007',
						name: 'ماجد القحطاني',
						type: 'individual',
					},
					attachments: 0,
					createdBy: 'أحمد محمد',
				},
				{
					id: 'inc-012',
					reference: 'INC-20231022-012',
					date: '2023-10-22',
					amount: 900.0,
					source: 'مبيعات',
					category: 'مبيعات متجر',
					description: 'مبيعات متجر - فرع الرياض',
					paymentMethod: 'نقداً',
					status: 'canceled',
					attachments: 0,
					createdBy: 'فهد السالم',
				},
			];

			// استخراج مصادر الإيرادات وإحصائياتها
			const sourcesMap = new Map<string, { count: number; totalAmount: number }>();
			const categoriesSet = new Set<string>();

			mockIncomes.forEach((income) => {
				const source = income.source;
				const current = sourcesMap.get(source) || { count: 0, totalAmount: 0 };
				sourcesMap.set(source, {
					count: current.count + 1,
					totalAmount: current.totalAmount + income.amount,
				});

				categoriesSet.add(income.category);
			});

			const mockSources: IncomeSource[] = Array.from(sourcesMap.entries()).map(([name, stats], index) => ({
				id: `src-${index + 1}`,
				name,
				count: stats.count,
				totalAmount: stats.totalAmount,
			}));

			// بيانات الإيرادات الشهرية (محاكاة)
			const mockMonthlyData: MonthlyIncome[] = [
				{ month: 'يناير', totalAmount: 35000, previousYearAmount: 30000, change: 16.67 },
				{ month: 'فبراير', totalAmount: 37500, previousYearAmount: 31500, change: 19.05 },
				{ month: 'مارس', totalAmount: 42000, previousYearAmount: 33000, change: 27.27 },
				{ month: 'أبريل', totalAmount: 38500, previousYearAmount: 34500, change: 11.59 },
				{ month: 'مايو', totalAmount: 44000, previousYearAmount: 36000, change: 22.22 },
				{ month: 'يونيو', totalAmount: 41000, previousYearAmount: 35000, change: 17.14 },
				{ month: 'يوليو', totalAmount: 39500, previousYearAmount: 34000, change: 16.18 },
				{ month: 'أغسطس', totalAmount: 45000, previousYearAmount: 37500, change: 20.0 },
				{ month: 'سبتمبر', totalAmount: 47500, previousYearAmount: 39000, change: 21.79 },
				{ month: 'أكتوبر', totalAmount: 48750, previousYearAmount: 40000, change: 21.88 },
			];

			// حساب الإحصائيات
			const totalIncome = mockIncomes.reduce((sum, income) => sum + income.amount, 0);
			const pendingIncome = mockIncomes
				.filter((income) => income.status === 'pending')
				.reduce((sum, income) => sum + income.amount, 0);

			// حساب متوسط الإيرادات الشهرية
			// حساب متوسط الإيرادات الشهرية
			const monthlyAverage =
				mockMonthlyData.reduce((sum, month) => sum + month.totalAmount, 0) / mockMonthlyData.length;

			// حساب نسبة النمو السنوية
			const yearlyGrowth =
				mockMonthlyData.reduce((sum, month) => sum + (month.change || 0), 0) / mockMonthlyData.length;

			setIncomes(mockIncomes);
			setFilteredIncomes(mockIncomes);
			setSources(mockSources);
			setMonthlyData(mockMonthlyData);
			setStats({
				totalIncome,
				monthlyAverage,
				yearlyGrowth,
				pendingIncome,
			});

			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let result = [...incomes];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(income) =>
					income.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
					income.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(income.customer && income.customer.name.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		// تطبيق فلتر المصدر
		if (sourceFilter !== 'all') {
			result = result.filter((income) => income.source === sourceFilter);
		}

		// تطبيق فلتر الفئة
		if (categoryFilter !== 'all') {
			result = result.filter((income) => income.category === categoryFilter);
		}

		// تطبيق فلتر التاريخ
		if (dateFilter !== 'all') {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			if (dateFilter === 'today') {
				result = result.filter((income) => {
					const incomeDate = new Date(income.date);
					return incomeDate.toDateString() === today.toDateString();
				});
			} else if (dateFilter === 'week') {
				const weekAgo = new Date(today.getTime() - 7 * 86400000);
				result = result.filter((income) => {
					const incomeDate = new Date(income.date);
					return incomeDate >= weekAgo;
				});
			} else if (dateFilter === 'month') {
				const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
				result = result.filter((income) => {
					const incomeDate = new Date(income.date);
					return incomeDate >= monthAgo;
				});
			}
		}

		setFilteredIncomes(result);
		setCurrentPage(1); // إعادة تعيين الصفحة الحالية عند تغيير الفلاتر
	}, [searchTerm, sourceFilter, categoryFilter, dateFilter, incomes]);

	// توسيع/طي تفاصيل الإيراد
	const toggleIncomeExpand = (incomeId: string) => {
		if (expandedIncome === incomeId) {
			setExpandedIncome(null);
		} else {
			setExpandedIncome(incomeId);
		}
	};

	// تنسيق التاريخ
	const formatDate = (dateString: string) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// عرض حالة الإيراد
	const renderIncomeStatusBadge = (status: string) => {
		switch (status) {
			case 'pending':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
						قيد الانتظار
					</span>
				);
			case 'completed':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						مكتمل
					</span>
				);
			case 'canceled':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						ملغي
					</span>
				);
			default:
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						{status}
					</span>
				);
		}
	};

	// تنسيق المبلغ
	const formatAmount = (amount: number) => {
		return new Intl.NumberFormat('ar-SA', {
			style: 'currency',
			currency: 'SAR',
		}).format(amount);
	};

	// الحصول على جميع فئات الإيرادات
	const getAllCategories = () => {
		const categoriesSet = new Set<string>();
		incomes.forEach((income) => categoriesSet.add(income.category));
		return Array.from(categoriesSet);
	};

	// حساب صفحات الترقيم
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredIncomes.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredIncomes.length / itemsPerPage);

	// تغيير الصفحة
	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500'></div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900 flex items-center'>
						<CreditCard className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						الإيرادات
					</h1>
					<p className='mt-1 text-gray-500'>سجل ومتابعة مصادر الإيرادات وتحليلها</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/finance/reports/income'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						تقارير الإيرادات
					</Link>
					<Link
						href='/dashboard/finance/income/new'
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						<Plus className='ml-1 h-4 w-4' />
						إيراد جديد
					</Link>
				</div>
			</div>

			{/* بطاقات الإحصائيات */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>إجمالي الإيرادات</p>
							<p className='text-2xl font-bold text-green-600'>{formatAmount(stats.totalIncome)}</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
							<ArrowDown className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>في الفترة المحددة</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>المتوسط الشهري</p>
							<p className='text-2xl font-bold text-indigo-600'>{formatAmount(stats.monthlyAverage)}</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
							<BarChart2 className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>متوسط الإيرادات الشهرية</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>معدل النمو السنوي</p>
							<p className='text-2xl font-bold text-green-600'>+{stats.yearlyGrowth.toFixed(1)}%</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
							<TrendingUp className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>مقارنة بالعام السابق</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>إيرادات معلقة</p>
							<p className='text-2xl font-bold text-amber-600'>{formatAmount(stats.pendingIncome)}</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
							<Clock className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>إيرادات في انتظار التحصيل</div>
				</div>
			</div>

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					{/* البحث */}
					<div className='relative'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='بحث عن رقم المرجع أو الوصف...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						/>
					</div>

					{/* فلتر المصدر */}
					<div className='relative'>
						<select
							value={sourceFilter}
							onChange={(e) => setSourceFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع المصادر</option>
							{sources.map((source) => (
								<option key={source.id} value={source.name}>
									{source.name}
								</option>
							))}
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر الفئة */}
					<div className='relative'>
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الفئات</option>
							{getAllCategories().map((category, index) => (
								<option key={index} value={category}>
									{category}
								</option>
							))}
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر التاريخ */}
					<div className='relative'>
						<select
							value={dateFilter}
							onChange={(e) => setDateFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع التواريخ</option>
							<option value='today'>اليوم</option>
							<option value='week'>آخر أسبوع</option>
							<option value='month'>آخر شهر</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>
				</div>

				{/* معلومات الفلترة */}
				<div className='mt-4 pt-3 border-t border-gray-200'>
					<div className='flex justify-between items-center'>
						<span className='text-sm text-gray-500'>
							عرض {filteredIncomes.length} من {incomes.length} إيراد
						</span>

						{(searchTerm || sourceFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setSourceFilter('all');
									setCategoryFilter('all');
									setDateFilter('all');
								}}
								className='text-xs text-indigo-600 hover:text-indigo-800'
							>
								مسح الفلاتر
							</button>
						)}
					</div>
				</div>
			</div>

			{/* قائمة الإيرادات */}
			{currentItems.length > 0 ? (
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										رقم المرجع
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										التاريخ
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										المصدر
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الوصف
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										المبلغ
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الحالة
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الإجراءات
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{currentItems.map((income) => (
									<tr key={income.id} className='hover:bg-gray-50'>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600'>
											<button
												onClick={() => toggleIncomeExpand(income.id)}
												className='hover:underline focus:outline-none'
											>
												{income.reference}
											</button>
											{income.recurring && (
												<span className='mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
													متكرر
												</span>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{formatDate(income.date)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											<div>{income.source}</div>
											<div className='text-xs text-gray-400'>{income.category}</div>
										</td>
										<td className='px-6 py-4 text-sm text-gray-900 max-w-xs truncate'>
											<div className='truncate'>{income.description}</div>
											{income.customer && (
												<div className='text-xs text-gray-500 truncate'>
													{income.customer.type === 'company' ? 'شركة:' : 'عميل:'}{' '}
													{income.customer.name}
												</div>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-left text-green-600'>
											{formatAmount(income.amount)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{renderIncomeStatusBadge(income.status)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
											<div className='flex items-center justify-center space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/finance/income/${income.id}`}
													className='text-indigo-600 hover:text-indigo-900'
													title='عرض التفاصيل'
												>
													<Eye className='h-5 w-5' />
												</Link>
												{income.status === 'pending' && (
													<Link
														href={`/dashboard/finance/income/${income.id}/edit`}
														className='text-amber-600 hover:text-amber-900'
														title='تعديل'
													>
														<Edit className='h-5 w-5' />
													</Link>
												)}
												<button className='text-gray-600 hover:text-gray-900' title='طباعة'>
													<Printer className='h-5 w-5' />
												</button>
												<div className='relative group'>
													<button
														className='text-gray-500 hover:text-gray-700'
														title='المزيد من الخيارات'
													>
														<MoreHorizontal className='h-5 w-5' />
													</button>
													<div className='absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
														<Link
															href={`/dashboard/finance/income/${income.id}`}
															className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
														>
															<Eye className='inline ml-1 h-4 w-4' />
															عرض التفاصيل
														</Link>
														{income.status === 'pending' && (
															<button className='block w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-green-50'>
																<CheckCircle className='inline ml-1 h-4 w-4' />
																تأكيد الاستلام
															</button>
														)}
														<button className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
															<Download className='inline ml-1 h-4 w-4' />
															تنزيل كـ PDF
														</button>
													</div>
												</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* تفاصيل الإيراد الموسعة */}
					{expandedIncome && (
						<div className='border-t border-gray-200 bg-gray-50 p-4 animate-fadeIn'>
							{incomes
								.filter((i) => i.id === expandedIncome)
								.map((income) => (
									<div key={`details-${income.id}`}>
										<div className='flex justify-between items-center mb-4'>
											<h3 className='text-lg font-medium text-gray-900'>
												تفاصيل الإيراد #{income.reference}
											</h3>
											<button
												onClick={() => setExpandedIncome(null)}
												className='text-gray-400 hover:text-gray-500'
											>
												<X className='h-5 w-5' />
											</button>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													معلومات الإيراد
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-2 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>رقم المرجع:</p>
															<p className='font-medium text-gray-900'>
																{income.reference}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>التاريخ:</p>
															<p className='font-medium text-gray-900'>
																{formatDate(income.date)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>المصدر:</p>
															<p className='font-medium text-gray-900'>{income.source}</p>
														</div>
														<div>
															<p className='text-gray-500'>الفئة:</p>
															<p className='font-medium text-gray-900'>
																{income.category}
															</p>
														</div>
														<div className='col-span-2'>
															<p className='text-gray-500'>الوصف:</p>
															<p className='font-medium text-gray-900'>
																{income.description}
															</p>
														</div>
													</div>
												</div>
											</div>

											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													التفاصيل المالية
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-2 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>المبلغ:</p>
															<p className='font-medium text-green-600'>
																{formatAmount(income.amount)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>الحالة:</p>
															<div>{renderIncomeStatusBadge(income.status)}</div>
														</div>
														{income.paymentMethod && (
															<div>
																<p className='text-gray-500'>طريقة الدفع:</p>
																<p className='font-medium text-gray-900'>
																	{income.paymentMethod}
																</p>
															</div>
														)}
													</div>

													{income.recurring && income.recurrenceInfo && (
														<div className='mt-3 pt-3 border-t border-gray-200'>
															<p className='text-gray-500 mb-1'>معلومات التكرار:</p>
															<div className='grid grid-cols-2 gap-2'>
																<div>
																	<p className='text-gray-500'>التكرار:</p>
																	<p className='font-medium text-gray-900'>
																		{income.recurrenceInfo.frequency === 'weekly'
																			? 'أسبوعي'
																			: income.recurrenceInfo.frequency ===
																			  'monthly'
																			? 'شهري'
																			: income.recurrenceInfo.frequency ===
																			  'quarterly'
																			? 'ربع سنوي'
																			: 'سنوي'}
																	</p>
																</div>
																<div>
																	<p className='text-gray-500'>التاريخ القادم:</p>
																	<p className='font-medium text-blue-600'>
																		{formatDate(income.recurrenceInfo.nextDate)}
																	</p>
																</div>
															</div>
														</div>
													)}
												</div>
											</div>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
											{income.customer && (
												<div>
													<h4 className='text-sm font-medium text-gray-500 mb-1'>
														معلومات العميل
													</h4>
													<div className='bg-white p-3 rounded-md border border-gray-200'>
														<div className='grid grid-cols-2 gap-2 text-sm'>
															<div className='col-span-2'>
																<p className='text-gray-500'>الاسم:</p>
																<p className='font-medium text-gray-900'>
																	{income.customer.name}
																</p>
															</div>
															<div>
																<p className='text-gray-500'>النوع:</p>
																<p className='font-medium text-gray-900'>
																	{income.customer.type === 'individual'
																		? 'فرد'
																		: 'شركة'}
																</p>
															</div>
															<div>
																<p className='text-gray-500'>رقم العميل:</p>
																<p className='font-medium text-gray-900'>
																	{income.customer.id}
																</p>
															</div>
														</div>
													</div>
												</div>
											)}

											{income.relatedTo && (
												<div>
													<h4 className='text-sm font-medium text-gray-500 mb-1'>
														معلومات المرجع
													</h4>
													<div className='bg-white p-3 rounded-md border border-gray-200'>
														<div className='grid grid-cols-2 gap-2 text-sm'>
															<div>
																<p className='text-gray-500'>نوع المرجع:</p>
																<p className='font-medium text-gray-900'>
																	{income.relatedTo.type === 'invoice'
																		? 'فاتورة'
																		: income.relatedTo.type === 'order'
																		? 'طلب'
																		: 'اشتراك'}
																</p>
															</div>
															<div>
																<p className='text-gray-500'>رقم المرجع:</p>
																<p className='font-medium text-indigo-600'>
																	<Link
																		href={`/dashboard/${
																			income.relatedTo.type === 'invoice'
																				? 'sales/invoices'
																				: income.relatedTo.type === 'order'
																				? 'orders'
																				: 'subscriptions'
																		}/${income.relatedTo.id}`}
																		className='hover:underline'
																	>
																		{income.relatedTo.reference}
																	</Link>
																</p>
															</div>
														</div>
													</div>
												</div>
											)}
										</div>

										<div className='flex justify-between items-center text-sm mt-4'>
											<div className='text-gray-500'>تم إنشاؤه بواسطة: {income.createdBy}</div>

											<div className='flex gap-2'>
												<Link
													href={`/dashboard/finance/income/${income.id}`}
													className='text-indigo-600 hover:text-indigo-800 flex items-center'
												>
													عرض التفاصيل الكاملة
													<ArrowLeft className='mr-1 h-4 w-4' />
												</Link>

												{income.status === 'pending' && (
													<button className='px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center'>
														<CheckCircle className='ml-1 h-4 w-4' />
														تأكيد الاستلام
													</button>
												)}
											</div>
										</div>
									</div>
								))}
						</div>
					)}

					{/* الترقيم الصفحي */}
					<div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
						<div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
							<div>
								<p className='text-sm text-gray-700'>
									عرض <span className='font-medium'>{indexOfFirstItem + 1}</span> إلى{' '}
									<span className='font-medium'>
										{Math.min(indexOfLastItem, filteredIncomes.length)}
									</span>{' '}
									من أصل <span className='font-medium'>{filteredIncomes.length}</span> إيراد
								</p>
							</div>
							<div>
								<nav
									className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px space-x-reverse'
									aria-label='Pagination'
								>
									<button
										onClick={() => paginate(Math.max(1, currentPage - 1))}
										className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
											currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
										}`}
										disabled={currentPage === 1}
									>
										<span className='sr-only'>السابق</span>
										<ArrowRight className='h-5 w-5' />
									</button>

									{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
										let pageNumber;

										if (totalPages <= 5) {
											pageNumber = i + 1;
										} else if (currentPage <= 3) {
											pageNumber = i + 1;
										} else if (currentPage >= totalPages - 2) {
											pageNumber = totalPages - 4 + i;
										} else {
											pageNumber = currentPage - 2 + i;
										}

										return (
											<button
												key={pageNumber}
												onClick={() => paginate(pageNumber)}
												className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
													currentPage === pageNumber
														? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
														: 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
												}`}
											>
												{pageNumber}
											</button>
										);
									})}

									<button
										onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
										className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
											currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
										}`}
										disabled={currentPage === totalPages}
									>
										<span className='sr-only'>التالي</span>
										<ArrowLeft className='h-5 w-5' />
									</button>
								</nav>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className='bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center'>
					<FileText className='h-12 w-12 text-gray-300 mx-auto mb-3' />
					<h3 className='text-lg font-medium text-gray-900'>لا توجد إيرادات</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm || sourceFilter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all'
							? 'لم يتم العثور على إيرادات تطابق معايير البحث المحددة'
							: 'لا توجد إيرادات مسجلة في النظام. قم بإنشاء إيراد جديد للبدء.'}
					</p>
					<div className='mt-4'>
						<Link
							href='/dashboard/finance/income/new'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
						>
							<Plus className='ml-1 h-4 w-4' />
							إنشاء إيراد جديد
						</Link>
					</div>
				</div>
			)}

			{/* تحليل الإيرادات الشهرية */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-lg font-medium text-gray-900'>تحليل الإيرادات الشهرية</h2>
					<Link
						href='/dashboard/finance/reports/income'
						className='text-sm text-indigo-600 hover:text-indigo-800 flex items-center'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						عرض تقرير مفصل
					</Link>
				</div>

				<div className='space-y-4'>
					{monthlyData
						.slice(-5)
						.reverse()
						.map((month, index) => {
							const isPositiveChange = month.change && month.change > 0;

							return (
								<div key={index}>
									<div className='flex justify-between items-center mb-1'>
										<div className='flex items-center'>
											<span className='text-sm font-medium text-gray-700'>{month.month}</span>
										</div>
										<div className='flex items-center'>
											<span className='text-sm font-medium text-green-600'>
												{formatAmount(month.totalAmount)}
											</span>
											{month.change && (
												<span
													className={`text-xs mr-2 flex items-center ${
														isPositiveChange ? 'text-green-600' : 'text-red-600'
													}`}
												>
													{isPositiveChange ? (
														<>
															<TrendingUp className='h-3 w-3 ml-0.5' />+
															{month.change.toFixed(1)}%
														</>
													) : (
														<>
															<TrendingDown className='h-3 w-3 ml-0.5' />
															{month.change.toFixed(1)}%
														</>
													)}
												</span>
											)}
										</div>
									</div>
									<div className='w-full bg-gray-200 rounded-full h-2'>
										<div
											className='bg-green-600 h-2 rounded-full'
											style={{
												width: `${
													(month.totalAmount /
														monthlyData.reduce(
															(max, m) => Math.max(max, m.totalAmount),
															0
														)) *
													100
												}%`,
											}}
										></div>
									</div>
								</div>
							);
						})}
				</div>

				<div className='mt-4 text-center'>
					<Link href='/dashboard/finance/reports/income' className='text-sm text-indigo-600 hover:underline'>
						عرض كافة الشهور
					</Link>
				</div>
			</div>

			{/* توزيع الإيرادات حسب المصدر */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-lg font-medium text-gray-900'>توزيع الإيرادات حسب المصدر</h2>
					<Link
						href='/dashboard/finance/reports/income-sources'
						className='text-sm text-indigo-600 hover:text-indigo-800 flex items-center'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						عرض تقرير مفصل
					</Link>
				</div>

				<div className='space-y-4'>
					{sources
						.sort((a, b) => b.totalAmount - a.totalAmount)
						.map((source, index) => {
							// حساب النسبة المئوية من إجمالي الإيرادات
							const percentage = Math.round((source.totalAmount / stats.totalIncome) * 100);

							return (
								<div key={source.id}>
									<div className='flex justify-between items-center mb-1'>
										<div className='flex items-center'>
											<span className='text-sm font-medium text-gray-700'>{source.name}</span>
											<span className='text-xs text-gray-500 mr-2'>({source.count})</span>
										</div>
										<div className='flex items-center'>
											<span className='text-sm font-medium text-green-600'>
												{formatAmount(source.totalAmount)}
											</span>
											<span className='text-xs text-gray-500 mr-2'>({percentage}%)</span>
										</div>
									</div>
									<div className='w-full bg-gray-200 rounded-full h-2'>
										<div
											className={`h-2 rounded-full ${
												index === 0
													? 'bg-green-600'
													: index === 1
													? 'bg-blue-600'
													: index === 2
													? 'bg-indigo-600'
													: index === 3
													? 'bg-amber-500'
													: 'bg-purple-500'
											}`}
											style={{ width: `${percentage}%` }}
										></div>
									</div>
								</div>
							);
						})}
				</div>
			</div>

			{/* روابط سريعة */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Link
					href='/dashboard/finance/income/new'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
						<Plus className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>إيراد جديد</h3>
						<p className='text-sm text-gray-500'>تسجيل إيراد جديد</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/income/recurring'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
						<RefreshCw className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>الإيرادات المتكررة</h3>
						<p className='text-sm text-gray-500'>إدارة الإيرادات الدورية</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/income/sources'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
						<Layers className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>مصادر الإيرادات</h3>
						<p className='text-sm text-gray-500'>إدارة مصادر الإيرادات</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/reports/income'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ml-3'>
						<BarChart2 className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>تقارير الإيرادات</h3>
						<p className='text-sm text-gray-500'>عرض وتحليل الإيرادات</p>
					</div>
				</Link>
			</div>
		</div>
	);
}
