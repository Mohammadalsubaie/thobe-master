'use client';

import {
	ArrowDown,
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
	Eye,
	FileText,
	MoreHorizontal,
	Plus,
	Printer,
	Search,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Transaction {
	id: string;
	reference: string;
	date: string;
	amount: number;
	type: 'income' | 'expense' | 'transfer' | 'refund' | 'payment';
	category: string;
	account: string;
	status: 'completed' | 'pending' | 'failed' | 'canceled';
	paymentMethod?: string;
	description: string;
	relatedTo?: {
		type: 'order' | 'invoice' | 'customer' | 'supplier' | 'expense';
		id: string;
		name: string;
	};
	createdBy: string;
	attachments?: number;
}

export default function TransactionsPage() {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedTransaction, setExpandedTransaction] = useState<string | null>(null);

	// حالة الفلترة
	const [searchTerm, setSearchTerm] = useState('');
	const [typeFilter, setTypeFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [dateFilter, setDateFilter] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	// إحصائيات سريعة
	const [stats, setStats] = useState({
		totalIncome: 0,
		totalExpenses: 0,
		pendingTransactions: 0,
		netFlow: 0,
	});

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// بيانات تجريبية للمعاملات
			const mockTransactions: Transaction[] = [
				{
					id: 'trx-001',
					reference: 'TRX-20231001-001',
					date: '2023-10-01T10:30:00',
					amount: 2500.0,
					type: 'income',
					category: 'مبيعات',
					account: 'الحساب الرئيسي',
					status: 'completed',
					paymentMethod: 'بطاقة ائتمانية',
					description: 'مبيعات متجر - فرع الرياض',
					relatedTo: {
						type: 'invoice',
						id: 'INV-1245',
						name: 'فاتورة مبيعات',
					},
					createdBy: 'أحمد محمد',
				},
				{
					id: 'trx-002',
					reference: 'TRX-20231003-002',
					date: '2023-10-03T14:15:00',
					amount: -750.0,
					type: 'expense',
					category: 'مشتريات المخزون',
					account: 'حساب المصروفات',
					status: 'completed',
					paymentMethod: 'تحويل بنكي',
					description: 'شراء مواد خام',
					relatedTo: {
						type: 'supplier',
						id: 'SUP-101',
						name: 'مؤسسة النسيج للأقمشة',
					},
					createdBy: 'محمد العمري',
				},
				{
					id: 'trx-003',
					reference: 'TRX-20231005-003',
					date: '2023-10-05T09:45:00',
					amount: 1800.0,
					type: 'income',
					category: 'مبيعات',
					account: 'الحساب الرئيسي',
					status: 'completed',
					paymentMethod: 'نقدًا',
					description: 'مبيعات متجر - فرع جدة',
					relatedTo: {
						type: 'invoice',
						id: 'INV-1246',
						name: 'فاتورة مبيعات',
					},
					createdBy: 'فهد السالم',
				},
				{
					id: 'trx-004',
					reference: 'TRX-20231007-004',
					date: '2023-10-07T16:20:00',
					amount: -350.0,
					type: 'expense',
					category: 'مرافق عامة',
					account: 'حساب المصروفات',
					status: 'completed',
					paymentMethod: 'تحويل بنكي',
					description: 'فاتورة الكهرباء - فرع الرياض',
					createdBy: 'محمد العمري',
				},
				{
					id: 'trx-005',
					reference: 'TRX-20231008-005',
					date: '2023-10-08T11:30:00',
					amount: -1200.0,
					type: 'expense',
					category: 'رواتب',
					account: 'حساب الرواتب',
					status: 'pending',
					paymentMethod: 'تحويل بنكي',
					description: 'رواتب الموظفين - النصف الأول',
					createdBy: 'فهد السالم',
				},
				{
					id: 'trx-006',
					reference: 'TRX-20231009-006',
					date: '2023-10-09T13:25:00',
					amount: 3200.0,
					type: 'income',
					category: 'مبيعات',
					account: 'الحساب الرئيسي',
					status: 'completed',
					paymentMethod: 'بطاقة ائتمانية',
					description: 'مبيعات عبر الإنترنت',
					createdBy: 'أحمد محمد',
				},
				{
					id: 'trx-007',
					reference: 'TRX-20231010-007',
					date: '2023-10-10T10:00:00',
					amount: -180.0,
					type: 'refund',
					category: 'مرتجعات',
					account: 'الحساب الرئيسي',
					status: 'completed',
					paymentMethod: 'بطاقة ائتمانية',
					description: 'استرداد قيمة منتج معيب',
					relatedTo: {
						type: 'order',
						id: 'ORD-985',
						name: 'طلب عميل',
					},
					createdBy: 'فهد السالم',
				},
				{
					id: 'trx-008',
					reference: 'TRX-20231011-008',
					date: '2023-10-11T15:10:00',
					amount: 950.0,
					type: 'income',
					category: 'مبيعات',
					account: 'الحساب الرئيسي',
					status: 'completed',
					paymentMethod: 'نقدًا',
					description: 'مبيعات متجر - فرع الدمام',
					createdBy: 'محمد العمري',
				},
				{
					id: 'trx-009',
					reference: 'TRX-20231012-009',
					date: '2023-10-12T09:30:00',
					amount: 1500.0,
					type: 'payment',
					category: 'دفعات العملاء',
					account: 'حساب الذمم المدينة',
					status: 'completed',
					paymentMethod: 'تحويل بنكي',
					description: 'سداد مديونية عميل',
					relatedTo: {
						type: 'customer',
						id: 'CUST-457',
						name: 'عبدالله محمد',
					},
					createdBy: 'أحمد محمد',
				},
				{
					id: 'trx-010',
					reference: 'TRX-20231013-010',
					date: '2023-10-13T14:15:00',
					amount: -500.0,
					type: 'expense',
					category: 'إيجار',
					account: 'حساب المصروفات',
					status: 'pending',
					paymentMethod: 'شيك',
					description: 'إيجار المستودع - أكتوبر',
					createdBy: 'فهد السالم',
				},
				{
					id: 'trx-011',
					reference: 'TRX-20231014-011',
					date: '2023-10-14T10:45:00',
					amount: 2750.0,
					type: 'income',
					category: 'مبيعات',
					account: 'الحساب الرئيسي',
					status: 'completed',
					paymentMethod: 'بطاقة ائتمانية',
					description: 'مبيعات متجر - فرع الرياض',
					createdBy: 'محمد العمري',
				},
				{
					id: 'trx-012',
					reference: 'TRX-20231014-012',
					date: '2023-10-14T16:30:00',
					amount: -250.0,
					type: 'expense',
					category: 'مستلزمات مكتبية',
					account: 'حساب المصروفات',
					status: 'completed',
					paymentMethod: 'نقدًا',
					description: 'شراء مستلزمات مكتبية - فرع جدة',
					createdBy: 'أحمد محمد',
				},
			];

			setTransactions(mockTransactions);
			setFilteredTransactions(mockTransactions);

			// حساب الإحصائيات
			const totalIncome = mockTransactions
				.filter((t) => ['income', 'payment'].includes(t.type))
				.reduce((sum, t) => sum + t.amount, 0);

			const totalExpenses = mockTransactions
				.filter((t) => ['expense', 'refund'].includes(t.type))
				.reduce((sum, t) => sum + Math.abs(t.amount), 0);

			const pendingTransactions = mockTransactions.filter((t) => t.status === 'pending').length;

			setStats({
				totalIncome,
				totalExpenses,
				pendingTransactions,
				netFlow: totalIncome - totalExpenses,
			});

			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let result = [...transactions];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(transaction) =>
					transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
					transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(transaction.relatedTo &&
						transaction.relatedTo.name.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		// تطبيق فلتر النوع
		if (typeFilter !== 'all') {
			result = result.filter((transaction) => transaction.type === typeFilter);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			result = result.filter((transaction) => transaction.status === statusFilter);
		}

		// تطبيق فلتر التاريخ
		if (dateFilter !== 'all') {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			if (dateFilter === 'today') {
				result = result.filter((transaction) => {
					const transactionDate = new Date(transaction.date);
					return transactionDate >= today && transactionDate < new Date(today.getTime() + 86400000);
				});
			} else if (dateFilter === 'week') {
				const weekAgo = new Date(today.getTime() - 7 * 86400000);
				result = result.filter((transaction) => {
					const transactionDate = new Date(transaction.date);
					return transactionDate >= weekAgo;
				});
			} else if (dateFilter === 'month') {
				const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
				result = result.filter((transaction) => {
					const transactionDate = new Date(transaction.date);
					return transactionDate >= monthAgo;
				});
			}
		}

		setFilteredTransactions(result);
		setCurrentPage(1); // إعادة تعيين الصفحة الحالية عند تغيير الفلاتر
	}, [searchTerm, typeFilter, statusFilter, dateFilter, transactions]);

	// توسيع/طي تفاصيل المعاملة
	const toggleTransactionExpand = (transactionId: string) => {
		if (expandedTransaction === transactionId) {
			setExpandedTransaction(null);
		} else {
			setExpandedTransaction(transactionId);
		}
	};

	// تنسيق التاريخ
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// تنسيق الوقت
	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('ar-SA', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	// عرض نوع المعاملة
	const renderTransactionTypeBadge = (type: string) => {
		switch (type) {
			case 'income':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						<ArrowDown className='ml-1 h-3 w-3' />
						إيراد
					</span>
				);
			case 'expense':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						<ArrowUp className='ml-1 h-3 w-3' />
						مصروف
					</span>
				);
			case 'transfer':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						<ArrowRight className='ml-1 h-3 w-3' />
						تحويل
					</span>
				);
			case 'refund':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800'>
						<ArrowLeft className='ml-1 h-3 w-3' />
						استرداد
					</span>
				);
			case 'payment':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
						<DollarSign className='ml-1 h-3 w-3' />
						دفعة
					</span>
				);
			default:
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						{type}
					</span>
				);
		}
	};

	// عرض حالة المعاملة
	const renderTransactionStatusBadge = (status: string) => {
		switch (status) {
			case 'completed':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						مكتملة
					</span>
				);
			case 'pending':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
						معلقة
					</span>
				);
			case 'failed':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						فاشلة
					</span>
				);
			case 'canceled':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						ملغاة
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
	const currentItems = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

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
						المعاملات المالية
					</h1>
					<p className='mt-1 text-gray-500'>سجل بجميع المعاملات المالية وتصنيفها</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/finance/reports'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						التقارير المالية
					</Link>
					<Link
						href='/dashboard/finance/transactions/new'
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						<Plus className='ml-1 h-4 w-4' />
						معاملة جديدة
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
							<p className='text-sm text-gray-500'>صافي التدفق</p>
							<p
								className={`text-2xl font-bold ${
									stats.netFlow >= 0 ? 'text-green-600' : 'text-red-600'
								}`}
							>
								{formatAmount(stats.netFlow)}
							</p>
						</div>
						<div
							className={`h-12 w-12 rounded-full ${
								stats.netFlow >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
							}`}
						>
							<div className='flex items-center justify-center h-full'>
								{stats.netFlow >= 0 ? (
									<ArrowDown className='h-6 w-6' />
								) : (
									<ArrowUp className='h-6 w-6' />
								)}
							</div>
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>الإيرادات - المصروفات</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>معاملات معلقة</p>
							<p className='text-2xl font-bold text-amber-600'>{stats.pendingTransactions}</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
							<Clock className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>بحاجة إلى متابعة</div>
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
							placeholder='بحث عن رقم المعاملة أو الوصف...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						/>
					</div>

					{/* فلتر النوع */}
					<div className='relative'>
						<select
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع أنواع المعاملات</option>
							<option value='income'>إيراد</option>
							<option value='expense'>مصروف</option>
							<option value='transfer'>تحويل</option>
							<option value='refund'>استرداد</option>
							<option value='payment'>دفعة</option>
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
							<option value='completed'>مكتملة</option>
							<option value='pending'>معلقة</option>
							<option value='failed'>فاشلة</option>
							<option value='canceled'>ملغاة</option>
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
							عرض {filteredTransactions.length} من {transactions.length} معاملة
						</span>

						{(searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setTypeFilter('all');
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

			{/* قائمة المعاملات */}
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
										رقم المعاملة
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
										النوع
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										التصنيف
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
								{currentItems.map((transaction) => (
									<tr key={transaction.id} className='hover:bg-gray-50'>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600'>
											<button
												onClick={() => toggleTransactionExpand(transaction.id)}
												className='hover:underline focus:outline-none'
											>
												{transaction.reference}
											</button>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											<div>{formatDate(transaction.date)}</div>
											<div className='text-xs'>{formatTime(transaction.date)}</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{renderTransactionTypeBadge(transaction.type)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{transaction.category}
										</td>
										<td className='px-6 py-4 text-sm text-gray-900'>
											<div>{transaction.description}</div>
											{transaction.relatedTo && (
												<div className='text-xs text-indigo-600'>
													{transaction.relatedTo.name}: {transaction.relatedTo.id}
												</div>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-left'>
											<span
												className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}
											>
												{formatAmount(transaction.amount)}
											</span>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{renderTransactionStatusBadge(transaction.status)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
											<div className='flex items-center justify-center space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/finance/transactions/${transaction.id}`}
													className='text-indigo-600 hover:text-indigo-900'
													title='عرض التفاصيل'
												>
													<Eye className='h-5 w-5' />
												</Link>
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
															href={`/dashboard/finance/transactions/${transaction.id}`}
															className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
														>
															<Eye className='inline ml-1 h-4 w-4' />
															عرض التفاصيل
														</Link>
														<button className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
															<Download className='inline ml-1 h-4 w-4' />
															تنزيل كـ PDF
														</button>
														{transaction.status === 'pending' && (
															<button className='block w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-green-50'>
																<CheckCircle className='inline ml-1 h-4 w-4' />
																تأكيد المعاملة
															</button>
														)}
													</div>
												</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* تفاصيل المعاملة الموسعة */}
					{expandedTransaction && (
						<div className='border-t border-gray-200 bg-gray-50 p-4 animate-fadeIn'>
							{transactions
								.filter((t) => t.id === expandedTransaction)
								.map((transaction) => (
									<div key={`details-${transaction.id}`}>
										<div className='flex justify-between items-center mb-4'>
											<h3 className='text-lg font-medium text-gray-900'>
												تفاصيل المعاملة #{transaction.reference}
											</h3>
											<button
												onClick={() => setExpandedTransaction(null)}
												className='text-gray-400 hover:text-gray-500'
											>
												<X className='h-5 w-5' />
											</button>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													معلومات المعاملة
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-2 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>رقم المعاملة:</p>
															<p className='font-medium text-gray-900'>
																{transaction.reference}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>التاريخ:</p>
															<p className='font-medium text-gray-900'>
																{formatDate(transaction.date)} -{' '}
																{formatTime(transaction.date)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>النوع:</p>
															<div>{renderTransactionTypeBadge(transaction.type)}</div>
														</div>
														<div>
															<p className='text-gray-500'>الحالة:</p>
															<div>
																{renderTransactionStatusBadge(transaction.status)}
															</div>
														</div>
														<div className='col-span-2'>
															<p className='text-gray-500'>الوصف:</p>
															<p className='font-medium text-gray-900'>
																{transaction.description}
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
															<p
																className={`font-medium ${
																	transaction.amount >= 0
																		? 'text-green-600'
																		: 'text-red-600'
																}`}
															>
																{formatAmount(transaction.amount)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>التصنيف:</p>
															<p className='font-medium text-gray-900'>
																{transaction.category}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>الحساب:</p>
															<p className='font-medium text-gray-900'>
																{transaction.account}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>طريقة الدفع:</p>
															<p className='font-medium text-gray-900'>
																{transaction.paymentMethod || 'غير محدد'}
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>

										{transaction.relatedTo && (
											<div className='mb-4'>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>المرجع</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-1 gap-2 text-sm'>
														<div className='flex justify-between'>
															<p className='text-gray-500'>النوع:</p>
															<p className='font-medium text-gray-900'>
																{transaction.relatedTo.type === 'order'
																	? 'طلب'
																	: transaction.relatedTo.type === 'invoice'
																	? 'فاتورة'
																	: transaction.relatedTo.type === 'customer'
																	? 'عميل'
																	: transaction.relatedTo.type === 'supplier'
																	? 'مورد'
																	: transaction.relatedTo.type === 'expense'
																	? 'مصروف'
																	: 'غير محدد'}
															</p>
														</div>
														<div className='flex justify-between'>
															<p className='text-gray-500'>الرقم المرجعي:</p>
															<p className='font-medium text-indigo-600'>
																<Link
																	href={`/dashboard/${
																		transaction.relatedTo.type === 'order'
																			? 'orders'
																			: transaction.relatedTo.type === 'invoice'
																			? 'sales/invoices'
																			: transaction.relatedTo.type === 'customer'
																			? 'customers'
																			: transaction.relatedTo.type === 'supplier'
																			? 'suppliers'
																			: transaction.relatedTo.type === 'expense'
																			? 'finance/expenses'
																			: ''
																	}/${transaction.relatedTo.id}`}
																	className='hover:underline'
																>
																	{transaction.relatedTo.id}
																</Link>
															</p>
														</div>
														<div className='flex justify-between'>
															<p className='text-gray-500'>الوصف:</p>
															<p className='font-medium text-gray-900'>
																{transaction.relatedTo.name}
															</p>
														</div>
													</div>
												</div>
											</div>
										)}

										<div className='flex justify-between items-center text-sm'>
											<div className='text-gray-500'>
												تم إنشاؤها بواسطة: {transaction.createdBy}
											</div>

											<div className='flex gap-2'>
												<Link
													href={`/dashboard/finance/transactions/${transaction.id}`}
													className='text-indigo-600 hover:text-indigo-800 flex items-center'
												>
													عرض التفاصيل الكاملة
													<ArrowLeft className='mr-1 h-4 w-4' />
												</Link>
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
										{Math.min(indexOfLastItem, filteredTransactions.length)}
									</span>{' '}
									من أصل <span className='font-medium'>{filteredTransactions.length}</span> معاملة
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
					<h3 className='text-lg font-medium text-gray-900'>لا توجد معاملات</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm || typeFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all'
							? 'لم يتم العثور على معاملات تطابق معايير البحث المحددة'
							: 'لا توجد معاملات مالية مسجلة في النظام. قم بإنشاء معاملة جديدة للبدء.'}
					</p>
					<div className='mt-4'>
						<Link
							href='/dashboard/finance/transactions/new'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
						>
							<Plus className='ml-1 h-4 w-4' />
							إنشاء معاملة جديدة
						</Link>
					</div>
				</div>
			)}

			{/* روابط سريعة */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Link
					href='/dashboard/finance/expenses'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 ml-3'>
						<ArrowUp className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>المصروفات</h3>
						<p className='text-sm text-gray-500'>تسجيل وإدارة المصروفات</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/income'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
						<ArrowDown className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>الإيرادات</h3>
						<p className='text-sm text-gray-500'>سجل وتحليل الإيرادات</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/customer-accounts'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
						<DollarSign className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>حسابات العملاء</h3>
						<p className='text-sm text-gray-500'>إدارة أرصدة وديون العملاء</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/reports'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ml-3'>
						<BarChart2 className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>التقارير المالية</h3>
						<p className='text-sm text-gray-500'>الأرباح والخسائر والتدفق النقدي</p>
					</div>
				</Link>
			</div>
		</div>
	);
}
