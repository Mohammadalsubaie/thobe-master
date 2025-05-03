'use client';

import {
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	BarChart2,
	CheckCircle,
	ChevronDown,
	Clock,
	CreditCard,
	DollarSign,
	Download,
	Edit,
	Eye,
	FileText,
	MoreHorizontal,
	Plus,
	Printer,
	Search,
	Tag,
	X,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Expense {
	id: string;
	reference: string;
	date: string;
	paymentDate?: string;
	amount: number;
	category: string;
	vendor?: string;
	status: 'pending' | 'approved' | 'rejected' | 'paid' | 'canceled';
	paymentMethod?: string;
	description: string;
	attachments: number;
	receipt?: string;
	approvedBy?: string;
	approvalDate?: string;
	paidBy?: string;
	createdBy: string;
	recurring?: boolean;
	recurrenceInfo?: {
		frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
		nextDate: string;
	};
}

interface ExpenseCategory {
	id: string;
	name: string;
	count: number;
	totalAmount: number;
}

export default function ExpensesPage() {
	const [expenses, setExpenses] = useState<Expense[]>([]);
	const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
	const [categories, setCategories] = useState<ExpenseCategory[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedExpense, setExpandedExpense] = useState<string | null>(null);

	// حالة الفلترة
	const [searchTerm, setSearchTerm] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [dateFilter, setDateFilter] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	// إحصائيات سريعة
	const [stats, setStats] = useState({
		totalExpenses: 0,
		pendingExpenses: 0,
		paidExpenses: 0,
		monthlyAverage: 0,
	});

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// بيانات تجريبية للمصروفات
			const mockExpenses: Expense[] = [
				{
					id: 'exp-001',
					reference: 'EXP-20231001-001',
					date: '2023-10-01',
					paymentDate: '2023-10-05',
					amount: 1200.0,
					category: 'إيجار',
					vendor: 'شركة العقارات المتحدة',
					status: 'paid',
					paymentMethod: 'تحويل بنكي',
					description: 'إيجار المتجر - شهر أكتوبر 2023',
					attachments: 1,
					receipt: 'receipt-001.pdf',
					approvedBy: 'محمد العمري',
					approvalDate: '2023-10-02',
					paidBy: 'فهد السالم',
					createdBy: 'أحمد محمد',
					recurring: true,
					recurrenceInfo: {
						frequency: 'monthly',
						nextDate: '2023-11-01',
					},
				},
				{
					id: 'exp-002',
					reference: 'EXP-20231002-002',
					date: '2023-10-02',
					amount: 850.0,
					category: 'مرافق عامة',
					vendor: 'شركة الكهرباء',
					status: 'pending',
					description: 'فاتورة الكهرباء - شهر سبتمبر 2023',
					attachments: 1,
					createdBy: 'فهد السالم',
				},
				{
					id: 'exp-003',
					reference: 'EXP-20231003-003',
					date: '2023-10-03',
					paymentDate: '2023-10-03',
					amount: 550.0,
					category: 'مستلزمات مكتبية',
					vendor: 'مكتبة الرياض',
					status: 'paid',
					paymentMethod: 'بطاقة ائتمانية',
					description: 'شراء مستلزمات مكتبية للإدارة',
					attachments: 1,
					receipt: 'receipt-003.pdf',
					approvedBy: 'محمد العمري',
					approvalDate: '2023-10-03',
					paidBy: 'أحمد محمد',
					createdBy: 'أحمد محمد',
				},
				{
					id: 'exp-004',
					reference: 'EXP-20231005-004',
					date: '2023-10-05',
					amount: 3500.0,
					category: 'رواتب',
					status: 'approved',
					paymentMethod: 'تحويل بنكي',
					description: 'راتب الموظف - محمد خالد',
					attachments: 0,
					approvedBy: 'فهد السالم',
					approvalDate: '2023-10-06',
					createdBy: 'أحمد محمد',
					recurring: true,
					recurrenceInfo: {
						frequency: 'monthly',
						nextDate: '2023-11-05',
					},
				},
				{
					id: 'exp-005',
					reference: 'EXP-20231007-005',
					date: '2023-10-07',
					amount: 750.0,
					category: 'صيانة',
					vendor: 'مؤسسة الخدمات الفنية',
					status: 'rejected',
					description: 'صيانة مكيفات - فرع الرياض',
					attachments: 1,
					approvedBy: 'محمد العمري',
					approvalDate: '2023-10-08',
					createdBy: 'فهد السالم',
				},
				{
					id: 'exp-006',
					reference: 'EXP-20231008-006',
					date: '2023-10-08',
					paymentDate: '2023-10-10',
					amount: 450.0,
					category: 'مرافق عامة',
					vendor: 'شركة المياه الوطنية',
					status: 'paid',
					paymentMethod: 'تحويل بنكي',
					description: 'فاتورة المياه - الربع الثالث 2023',
					attachments: 1,
					receipt: 'receipt-006.pdf',
					approvedBy: 'محمد العمري',
					approvalDate: '2023-10-09',
					paidBy: 'فهد السالم',
					createdBy: 'أحمد محمد',
				},
				{
					id: 'exp-007',
					reference: 'EXP-20231010-007',
					date: '2023-10-10',
					amount: 1500.0,
					category: 'تسويق وإعلان',
					vendor: 'وكالة الإعلان الرقمي',
					status: 'pending',
					description: 'حملة إعلانية على منصات التواصل الاجتماعي',
					attachments: 2,
					createdBy: 'فهد السالم',
				},
				{
					id: 'exp-008',
					reference: 'EXP-20231012-008',
					date: '2023-10-12',
					amount: 320.0,
					category: 'نقل وشحن',
					vendor: 'شركة النقل السريع',
					status: 'approved',
					description: 'شحن منتجات إلى فرع جدة',
					attachments: 1,
					approvedBy: 'محمد العمري',
					approvalDate: '2023-10-13',
					createdBy: 'أحمد محمد',
				},
				{
					id: 'exp-009',
					reference: 'EXP-20231013-009',
					date: '2023-10-13',
					paymentDate: '2023-10-14',
					amount: 4800.0,
					category: 'مشتريات المخزون',
					vendor: 'مصنع النسيج الوطني',
					status: 'paid',
					paymentMethod: 'تحويل بنكي',
					description: 'شراء أقمشة للإنتاج - دفعة أكتوبر',
					attachments: 3,
					receipt: 'receipt-009.pdf',
					approvedBy: 'فهد السالم',
					approvalDate: '2023-10-13',
					paidBy: 'محمد العمري',
					createdBy: 'أحمد محمد',
				},
				{
					id: 'exp-010',
					reference: 'EXP-20231015-010',
					date: '2023-10-15',
					amount: 280.0,
					category: 'مستلزمات مكتبية',
					vendor: 'مكتبة الرياض',
					status: 'pending',
					description: 'شراء قرطاسية ومستلزمات طباعة',
					attachments: 0,
					createdBy: 'فهد السالم',
				},
				{
					id: 'exp-011',
					reference: 'EXP-20231018-011',
					date: '2023-10-18',
					paymentDate: '2023-10-19',
					amount: 950.0,
					category: 'صيانة',
					vendor: 'مؤسسة الصيانة العامة',
					status: 'paid',
					paymentMethod: 'نقدًا',
					description: 'صيانة ماكينات الخياطة',
					attachments: 1,
					receipt: 'receipt-011.pdf',
					approvedBy: 'محمد العمري',
					approvalDate: '2023-10-18',
					paidBy: 'أحمد محمد',
					createdBy: 'فهد السالم',
				},
				{
					id: 'exp-012',
					reference: 'EXP-20231020-012',
					date: '2023-10-20',
					amount: 680.0,
					category: 'تسويق وإعلان',
					vendor: 'مطبعة الجودة',
					status: 'canceled',
					description: 'طباعة بروشورات ترويجية',
					attachments: 1,
					createdBy: 'أحمد محمد',
				},
			];

			// استخراج فئات المصروفات وإحصائياتها
			const categoriesMap = new Map<string, { count: number; totalAmount: number }>();

			mockExpenses.forEach((expense) => {
				const category = expense.category;
				const current = categoriesMap.get(category) || { count: 0, totalAmount: 0 };
				categoriesMap.set(category, {
					count: current.count + 1,
					totalAmount: current.totalAmount + expense.amount,
				});
			});

			const mockCategories: ExpenseCategory[] = Array.from(categoriesMap.entries()).map(
				([name, stats], index) => ({
					id: `cat-${index + 1}`,
					name,
					count: stats.count,
					totalAmount: stats.totalAmount,
				})
			);

			// حساب الإحصائيات
			const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
			const pendingExpenses = mockExpenses.filter(
				(e) => e.status === 'pending' || e.status === 'approved'
			).length;
			const paidExpenses = mockExpenses.filter((e) => e.status === 'paid').length;

			// حساب متوسط المصروفات الشهرية (محاكاة)
			const monthlyAverage = totalExpenses / 3; // نفترض أن هذه البيانات تغطي 3 أشهر

			setExpenses(mockExpenses);
			setFilteredExpenses(mockExpenses);
			setCategories(mockCategories);
			setStats({
				totalExpenses,
				pendingExpenses,
				paidExpenses,
				monthlyAverage,
			});

			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let result = [...expenses];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(expense) =>
					expense.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
					expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(expense.vendor && expense.vendor.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		// تطبيق فلتر الفئة
		if (categoryFilter !== 'all') {
			result = result.filter((expense) => expense.category === categoryFilter);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			result = result.filter((expense) => expense.status === statusFilter);
		}

		// تطبيق فلتر التاريخ
		if (dateFilter !== 'all') {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			if (dateFilter === 'today') {
				result = result.filter((expense) => {
					const expenseDate = new Date(expense.date);
					return expenseDate.toDateString() === today.toDateString();
				});
			} else if (dateFilter === 'week') {
				const weekAgo = new Date(today.getTime() - 7 * 86400000);
				result = result.filter((expense) => {
					const expenseDate = new Date(expense.date);
					return expenseDate >= weekAgo;
				});
			} else if (dateFilter === 'month') {
				const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
				result = result.filter((expense) => {
					const expenseDate = new Date(expense.date);
					return expenseDate >= monthAgo;
				});
			}
		}

		setFilteredExpenses(result);
		setCurrentPage(1); // إعادة تعيين الصفحة الحالية عند تغيير الفلاتر
	}, [searchTerm, categoryFilter, statusFilter, dateFilter, expenses]);

	// توسيع/طي تفاصيل المصروف
	const toggleExpenseExpand = (expenseId: string) => {
		if (expandedExpense === expenseId) {
			setExpandedExpense(null);
		} else {
			setExpandedExpense(expenseId);
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

	// عرض حالة المصروف
	const renderExpenseStatusBadge = (status: string) => {
		switch (status) {
			case 'pending':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
						قيد المراجعة
					</span>
				);
			case 'approved':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						تمت الموافقة
					</span>
				);
			case 'rejected':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						مرفوض
					</span>
				);
			case 'paid':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						مدفوع
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

	// حساب صفحات الترقيم
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredExpenses.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

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
						المصروفات
					</h1>
					<p className='mt-1 text-gray-500'>تسجيل وإدارة المصروفات وتتبعها</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/finance/expenses/categories'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<Tag className='ml-1 h-4 w-4' />
						فئات المصروفات
					</Link>
					<Link
						href='/dashboard/finance/expenses/new'
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						<Plus className='ml-1 h-4 w-4' />
						مصروف جديد
					</Link>
				</div>
			</div>

			{/* بطاقات الإحصائيات */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>إجمالي المصروفات</p>
							<p className='text-2xl font-bold text-red-600'>{formatAmount(stats.totalExpenses)}</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600'>
							<ArrowUp className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>في الفترة المحددة</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>المصروفات المعلقة</p>
							<p className='text-2xl font-bold text-amber-600'>{stats.pendingExpenses}</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
							<Clock className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>بانتظار الموافقة أو الدفع</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>المصروفات المدفوعة</p>
							<p className='text-2xl font-bold text-green-600'>{stats.paidExpenses}</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
							<CheckCircle className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>تم دفعها بالكامل</div>
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
					<div className='mt-2 text-xs text-gray-500'>متوسط المصروفات الشهرية</div>
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
							placeholder='بحث عن رقم المصروف أو الوصف...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						/>
					</div>

					{/* فلتر الفئة */}
					<div className='relative'>
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الفئات</option>
							{categories.map((category) => (
								<option key={category.id} value={category.name}>
									{category.name}
								</option>
							))}
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر الحالة */}
					<div className='relative'>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الحالات</option>
							<option value='pending'>قيد المراجعة</option>
							<option value='approved'>تمت الموافقة</option>
							<option value='paid'>مدفوع</option>
							<option value='rejected'>مرفوض</option>
							<option value='canceled'>ملغي</option>
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
							عرض {filteredExpenses.length} من {expenses.length} مصروف
						</span>

						{(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setCategoryFilter('all');
									setStatusFilter('all');
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

			{/* قائمة المصروفات */}
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
										رقم المصروف
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
										الفئة
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
								{currentItems.map((expense) => (
									<tr key={expense.id} className='hover:bg-gray-50'>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600'>
											<button
												onClick={() => toggleExpenseExpand(expense.id)}
												className='hover:underline focus:outline-none'
											>
												{expense.reference}
											</button>
											{expense.recurring && (
												<span className='mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
													متكرر
												</span>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{formatDate(expense.date)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{expense.category}
										</td>
										<td className='px-6 py-4 text-sm text-gray-900 max-w-xs truncate'>
											<div className='truncate'>{expense.description}</div>
											{expense.vendor && (
												<div className='text-xs text-gray-500 truncate'>
													المورد: {expense.vendor}
												</div>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-left text-red-600'>
											{formatAmount(expense.amount)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{renderExpenseStatusBadge(expense.status)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
											<div className='flex items-center justify-center space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/finance/expenses/${expense.id}`}
													className='text-indigo-600 hover:text-indigo-900'
													title='عرض التفاصيل'
												>
													<Eye className='h-5 w-5' />
												</Link>
												{expense.status === 'pending' && (
													<Link
														href={`/dashboard/finance/expenses/${expense.id}/edit`}
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
															href={`/dashboard/finance/expenses/${expense.id}`}
															className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
														>
															<Eye className='inline ml-1 h-4 w-4' />
															عرض التفاصيل
														</Link>
														{expense.status === 'pending' && (
															<>
																<button className='block w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-green-50'>
																	<CheckCircle className='inline ml-1 h-4 w-4' />
																	الموافقة
																</button>
																<button className='block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50'>
																	<XCircle className='inline ml-1 h-4 w-4' />
																	رفض
																</button>
															</>
														)}
														{expense.status === 'approved' && (
															<button className='block w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-green-50'>
																<DollarSign className='inline ml-1 h-4 w-4' />
																تسجيل الدفع
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

					{/* تفاصيل المصروف الموسعة */}
					{expandedExpense && (
						<div className='border-t border-gray-200 bg-gray-50 p-4 animate-fadeIn'>
							{expenses
								.filter((e) => e.id === expandedExpense)
								.map((expense) => (
									<div key={`details-${expense.id}`}>
										<div className='flex justify-between items-center mb-4'>
											<h3 className='text-lg font-medium text-gray-900'>
												تفاصيل المصروف #{expense.reference}
											</h3>
											<button
												onClick={() => setExpandedExpense(null)}
												className='text-gray-400 hover:text-gray-500'
											>
												<X className='h-5 w-5' />
											</button>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													معلومات المصروف
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-2 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>رقم المصروف:</p>
															<p className='font-medium text-gray-900'>
																{expense.reference}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>التاريخ:</p>
															<p className='font-medium text-gray-900'>
																{formatDate(expense.date)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>الفئة:</p>
															<p className='font-medium text-gray-900'>
																{expense.category}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>الحالة:</p>
															<div>{renderExpenseStatusBadge(expense.status)}</div>
														</div>
														{expense.vendor && (
															<div className='col-span-2'>
																<p className='text-gray-500'>المورد:</p>
																<p className='font-medium text-gray-900'>
																	{expense.vendor}
																</p>
															</div>
														)}
														<div className='col-span-2'>
															<p className='text-gray-500'>الوصف:</p>
															<p className='font-medium text-gray-900'>
																{expense.description}
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
															<p className='font-medium text-red-600'>
																{formatAmount(expense.amount)}
															</p>
														</div>
														{expense.paymentMethod && (
															<div>
																<p className='text-gray-500'>طريقة الدفع:</p>
																<p className='font-medium text-gray-900'>
																	{expense.paymentMethod}
																</p>
															</div>
														)}
														{expense.paymentDate && (
															<div>
																<p className='text-gray-500'>تاريخ الدفع:</p>
																<p className='font-medium text-gray-900'>
																	{formatDate(expense.paymentDate)}
																</p>
															</div>
														)}
														{expense.paidBy && (
															<div>
																<p className='text-gray-500'>دفع بواسطة:</p>
																<p className='font-medium text-gray-900'>
																	{expense.paidBy}
																</p>
															</div>
														)}
													</div>

													{expense.recurring && expense.recurrenceInfo && (
														<div className='mt-3 pt-3 border-t border-gray-200'>
															<p className='text-gray-500 mb-1'>معلومات التكرار:</p>
															<div className='grid grid-cols-2 gap-2'>
																<div>
																	<p className='text-gray-500'>التكرار:</p>
																	<p className='font-medium text-gray-900'>
																		{expense.recurrenceInfo.frequency === 'weekly'
																			? 'أسبوعي'
																			: expense.recurrenceInfo.frequency ===
																			  'monthly'
																			? 'شهري'
																			: expense.recurrenceInfo.frequency ===
																			  'quarterly'
																			? 'ربع سنوي'
																			: 'سنوي'}
																	</p>
																</div>
																<div>
																	<p className='text-gray-500'>التاريخ القادم:</p>
																	<p className='font-medium text-blue-600'>
																		{formatDate(expense.recurrenceInfo.nextDate)}
																	</p>
																</div>
															</div>
														</div>
													)}
												</div>
											</div>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
											{expense.approvedBy && (
												<div>
													<h4 className='text-sm font-medium text-gray-500 mb-1'>
														معلومات الموافقة
													</h4>
													<div className='bg-white p-3 rounded-md border border-gray-200'>
														<div className='grid grid-cols-2 gap-2 text-sm'>
															<div>
																<p className='text-gray-500'>تمت الموافقة بواسطة:</p>
																<p className='font-medium text-gray-900'>
																	{expense.approvedBy}
																</p>
															</div>
															{expense.approvalDate && (
																<div>
																	<p className='text-gray-500'>تاريخ الموافقة:</p>
																	<p className='font-medium text-gray-900'>
																		{formatDate(expense.approvalDate)}
																	</p>
																</div>
															)}
														</div>
													</div>
												</div>
											)}

											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>المرفقات</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													{expense.attachments > 0 ? (
														<div className='text-sm'>
															<p>{expense.attachments} مرفق</p>
															{expense.receipt && (
																<div className='mt-2'>
																	<a
																		href='#'
																		className='inline-flex items-center text-indigo-600 hover:text-indigo-900'
																	>
																		<FileText className='mr-1 h-4 w-4' />
																		{expense.receipt}
																	</a>
																</div>
															)}
														</div>
													) : (
														<p className='text-sm text-gray-500'>لا توجد مرفقات</p>
													)}
												</div>
											</div>
										</div>

										<div className='flex justify-between items-center text-sm mt-4'>
											<div className='text-gray-500'>تم إنشاؤه بواسطة: {expense.createdBy}</div>

											<div className='flex gap-2'>
												<Link
													href={`/dashboard/finance/expenses/${expense.id}`}
													className='text-indigo-600 hover:text-indigo-800 flex items-center'
												>
													عرض التفاصيل الكاملة
													<ArrowLeft className='mr-1 h-4 w-4' />
												</Link>

												{expense.status === 'pending' && (
													<div className='flex gap-2'>
														<button className='px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center'>
															<CheckCircle className='ml-1 h-4 w-4' />
															الموافقة
														</button>
														<button className='px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center'>
															<XCircle className='ml-1 h-4 w-4' />
															رفض
														</button>
													</div>
												)}

												{expense.status === 'approved' && (
													<button className='px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center'>
														<DollarSign className='ml-1 h-4 w-4' />
														تسجيل الدفع
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
										{Math.min(indexOfLastItem, filteredExpenses.length)}
									</span>{' '}
									من أصل <span className='font-medium'>{filteredExpenses.length}</span> مصروف
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
					<h3 className='text-lg font-medium text-gray-900'>لا توجد مصروفات</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all'
							? 'لم يتم العثور على مصروفات تطابق معايير البحث المحددة'
							: 'لا توجد مصروفات مسجلة في النظام. قم بإنشاء مصروف جديد للبدء.'}
					</p>
					<div className='mt-4'>
						<Link
							href='/dashboard/finance/expenses/new'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
						>
							<Plus className='ml-1 h-4 w-4' />
							إنشاء مصروف جديد
						</Link>
					</div>
				</div>
			)}

			{/* توزيع المصروفات حسب الفئة */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-lg font-medium text-gray-900'>توزيع المصروفات حسب الفئة</h2>
					<Link
						href='/dashboard/finance/reports/expenses'
						className='text-sm text-indigo-600 hover:text-indigo-800 flex items-center'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						عرض تقرير مفصل
					</Link>
				</div>

				<div className='space-y-4'>
					{categories
						.sort((a, b) => b.totalAmount - a.totalAmount)
						.slice(0, 5)
						.map((category, index) => {
							// حساب النسبة المئوية من إجمالي المصروفات
							const percentage = Math.round((category.totalAmount / stats.totalExpenses) * 100);

							return (
								<div key={category.id}>
									<div className='flex justify-between items-center mb-1'>
										<div className='flex items-center'>
											<span className='text-sm font-medium text-gray-700'>{category.name}</span>
											<span className='text-xs text-gray-500 mr-2'>({category.count})</span>
										</div>
										<div className='flex items-center'>
											<span className='text-sm font-medium text-gray-900'>
												{formatAmount(category.totalAmount)}
											</span>
											<span className='text-xs text-gray-500 mr-2'>({percentage}%)</span>
										</div>
									</div>
									<div className='w-full bg-gray-200 rounded-full h-2'>
										<div
											className={`h-2 rounded-full ${
												index === 0
													? 'bg-red-600'
													: index === 1
													? 'bg-amber-600'
													: index === 2
													? 'bg-blue-600'
													: index === 3
													? 'bg-green-600'
													: 'bg-indigo-600'
											}`}
											style={{ width: `${percentage}%` }}
										></div>
									</div>
								</div>
							);
						})}
				</div>

				{categories.length > 5 && (
					<div className='mt-4 text-center'>
						<Link
							href='/dashboard/finance/expenses/categories'
							className='text-sm text-indigo-600 hover:underline'
						>
							عرض جميع الفئات ({categories.length})
						</Link>
					</div>
				)}
			</div>

			{/* روابط سريعة */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Link
					href='/dashboard/finance/expenses/new'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
						<Plus className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>مصروف جديد</h3>
						<p className='text-sm text-gray-500'>تسجيل مصروف جديد</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/expenses/approval'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
						<CheckCircle className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>الموافقات</h3>
						<p className='text-sm text-gray-500'>مصروفات تنتظر الموافقة</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/expenses/recurring'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
						<Clock className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>المصروفات المتكررة</h3>
						<p className='text-sm text-gray-500'>إدارة المصروفات الدورية</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/expenses/categories'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ml-3'>
						<Tag className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>فئات المصروفات</h3>
						<p className='text-sm text-gray-500'>إدارة فئات المصروفات</p>
					</div>
				</Link>
			</div>
		</div>
	);
}
