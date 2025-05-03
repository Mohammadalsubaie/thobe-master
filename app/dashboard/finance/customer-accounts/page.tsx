'use client';

import {
	AlertCircle,
	ArrowLeft,
	ArrowRight,
	BarChart2,
	Calendar,
	ChevronDown,
	CreditCard,
	DollarSign,
	Eye,
	FileText,
	Mail,
	MessageSquare,
	MoreHorizontal,
	Phone,
	Plus,
	Search,
	Users,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CustomerAccount {
	id: string;
	customerId: string;
	customerName: string;
	customerType: 'individual' | 'company';
	contactPerson?: string;
	phone: string;
	email?: string;
	totalPurchases: number;
	balance: number;
	creditLimit?: number;
	lastPaymentDate?: string;
	lastPaymentAmount?: number;
	dueAmount: number;
	overdueDays?: number;
	status: 'active' | 'suspended' | 'closed';
	paymentTerms?: string;
	notes?: string;
	createdAt: string;
}

interface Payment {
	id: string;
	customerId: string;
	date: string;
	amount: number;
	method: string;
	reference: string;
	notes?: string;
	invoiceId?: string;
	invoiceNumber?: string;
}

export default function CustomerAccountsPage() {
	const [accounts, setAccounts] = useState<CustomerAccount[]>([]);
	const [filteredAccounts, setFilteredAccounts] = useState<CustomerAccount[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedAccount, setExpandedAccount] = useState<string | null>(null);
	const [selectedAccount, setSelectedAccount] = useState<CustomerAccount | null>(null);
	const [showPaymentHistory, setShowPaymentHistory] = useState(false);
	const [paymentHistory, setPaymentHistory] = useState<Payment[]>([]);

	// حالة الفلترة
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [balanceFilter, setBalanceFilter] = useState('all');
	const [typeFilter, setTypeFilter] = useState('all');
	const [sortBy, setSortBy] = useState<'name' | 'balance' | 'due' | 'lastPayment'>('balance');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	// إحصائيات سريعة
	const [stats, setStats] = useState({
		totalBalances: 0,
		overdueAmount: 0,
		totalCustomers: 0,
		activeAccounts: 0,
	});

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// بيانات تجريبية لحسابات العملاء
			const mockAccounts: CustomerAccount[] = [
				{
					id: 'acc-001',
					customerId: 'cust-001',
					customerName: 'عبدالله محمد',
					customerType: 'individual',
					phone: '0501234567',
					email: 'abdullah@example.com',
					totalPurchases: 15000,
					balance: 3200,
					creditLimit: 5000,
					lastPaymentDate: '2023-09-25',
					lastPaymentAmount: 800,
					dueAmount: 1500,
					overdueDays: 0,
					status: 'active',
					paymentTerms: 'صافي 30 يوم',
					createdAt: '2022-05-10',
				},
				{
					id: 'acc-002',
					customerId: 'cust-002',
					customerName: 'شركة الأفق للتجارة',
					customerType: 'company',
					contactPerson: 'خالد السالم',
					phone: '0112345678',
					email: 'info@alufuq.com',
					totalPurchases: 85000,
					balance: 12500,
					creditLimit: 20000,
					lastPaymentDate: '2023-10-05',
					lastPaymentAmount: 7500,
					dueAmount: 5000,
					overdueDays: 0,
					status: 'active',
					paymentTerms: 'صافي 45 يوم',
					notes: 'عميل منتظم في السداد',
					createdAt: '2021-08-15',
				},
				{
					id: 'acc-003',
					customerId: 'cust-003',
					customerName: 'فهد العمري',
					customerType: 'individual',
					phone: '0557654321',
					totalPurchases: 8500,
					balance: 1800,
					lastPaymentDate: '2023-08-20',
					lastPaymentAmount: 500,
					dueAmount: 1800,
					overdueDays: 20,
					status: 'active',
					createdAt: '2022-11-03',
				},
				{
					id: 'acc-004',
					customerId: 'cust-004',
					customerName: 'مؤسسة النور للأزياء',
					customerType: 'company',
					contactPerson: 'محمد الحارثي',
					phone: '0126789123',
					email: 'info@alnoor.com',
					totalPurchases: 45000,
					balance: 8500,
					creditLimit: 15000,
					lastPaymentDate: '2023-09-18',
					lastPaymentAmount: 3500,
					dueAmount: 4500,
					overdueDays: 5,
					status: 'active',
					paymentTerms: 'صافي 30 يوم',
					createdAt: '2022-03-10',
				},
				{
					id: 'acc-005',
					customerId: 'cust-005',
					customerName: 'سعد الزهراني',
					customerType: 'individual',
					phone: '0534567890',
					email: 'saad@example.com',
					totalPurchases: 12000,
					balance: 0,
					lastPaymentDate: '2023-10-01',
					lastPaymentAmount: 1200,
					dueAmount: 0,
					status: 'active',
					createdAt: '2023-01-15',
				},
				{
					id: 'acc-006',
					customerId: 'cust-006',
					customerName: 'شركة المستقبل للملابس',
					customerType: 'company',
					contactPerson: 'عبدالرحمن القحطاني',
					phone: '0114567890',
					email: 'info@future-clothes.com',
					totalPurchases: 65000,
					balance: 18000,
					creditLimit: 25000,
					lastPaymentDate: '2023-09-15',
					lastPaymentAmount: 5000,
					dueAmount: 8000,
					overdueDays: 15,
					status: 'active',
					paymentTerms: 'صافي 45 يوم',
					notes: 'يفضل الدفع بالتحويل البنكي',
					createdAt: '2022-06-22',
				},
				{
					id: 'acc-007',
					customerId: 'cust-007',
					customerName: 'ماجد القحطاني',
					customerType: 'individual',
					phone: '0567891234',
					totalPurchases: 5000,
					balance: 2500,
					lastPaymentDate: '2023-08-15',
					lastPaymentAmount: 500,
					dueAmount: 2500,
					overdueDays: 45,
					status: 'suspended',
					notes: 'تم تعليق الحساب بسبب تأخر السداد',
					createdAt: '2022-10-05',
				},
				{
					id: 'acc-008',
					customerId: 'cust-008',
					customerName: 'مؤسسة الخليج للتجارة',
					customerType: 'company',
					contactPerson: 'سلطان المالكي',
					phone: '0135678912',
					email: 'info@gulf-trade.com',
					totalPurchases: 52000,
					balance: 0,
					creditLimit: 15000,
					lastPaymentDate: '2023-10-02',
					lastPaymentAmount: 4500,
					dueAmount: 0,
					status: 'active',
					paymentTerms: 'صافي 30 يوم',
					createdAt: '2022-07-30',
				},
				{
					id: 'acc-009',
					customerId: 'cust-009',
					customerName: 'محمد السالم',
					customerType: 'individual',
					phone: '0578912345',
					email: 'msalem@example.com',
					totalPurchases: 9500,
					balance: 3500,
					lastPaymentDate: '2023-09-01',
					lastPaymentAmount: 1000,
					dueAmount: 3500,
					overdueDays: 30,
					status: 'active',
					createdAt: '2022-12-10',
				},
				{
					id: 'acc-010',
					customerId: 'cust-010',
					customerName: 'شركة الأناقة للأزياء',
					customerType: 'company',
					contactPerson: 'فيصل المطيري',
					phone: '0125678912',
					email: 'info@elegance-fashion.com',
					totalPurchases: 75000,
					balance: 15000,
					creditLimit: 30000,
					lastPaymentDate: '2023-09-28',
					lastPaymentAmount: 10000,
					dueAmount: 7500,
					overdueDays: 0,
					status: 'active',
					paymentTerms: 'صافي 60 يوم',
					notes: 'عميل مهم، له شروط دفع خاصة',
					createdAt: '2021-11-20',
				},
				{
					id: 'acc-011',
					customerId: 'cust-011',
					customerName: 'عبدالعزيز الشمري',
					customerType: 'individual',
					phone: '0512345678',
					totalPurchases: 4500,
					balance: 1200,
					lastPaymentDate: '2023-09-10',
					lastPaymentAmount: 300,
					dueAmount: 1200,
					overdueDays: 15,
					status: 'active',
					createdAt: '2023-02-05',
				},
				{
					id: 'acc-012',
					customerId: 'cust-012',
					customerName: 'مؤسسة الريان',
					customerType: 'company',
					contactPerson: 'عبدالله الدوسري',
					phone: '0112345987',
					email: 'info@alrayyan.com',
					totalPurchases: 28000,
					balance: 0,
					creditLimit: 10000,
					lastPaymentDate: '2023-09-30',
					lastPaymentAmount: 2800,
					dueAmount: 0,
					status: 'closed',
					notes: 'تم إغلاق الحساب بناءً على طلب العميل',
					createdAt: '2022-04-15',
				},
			];

			// بيانات تجريبية لسجل المدفوعات
			const mockPaymentHistory: Payment[] = [
				{
					id: 'pay-001',
					customerId: 'cust-001',
					date: '2023-09-25',
					amount: 800,
					method: 'بطاقة ائتمانية',
					reference: 'PAY-20230925-001',
					invoiceId: 'inv-001',
					invoiceNumber: 'INV-20230915-001',
				},
				{
					id: 'pay-002',
					customerId: 'cust-001',
					date: '2023-09-01',
					amount: 1200,
					method: 'تحويل بنكي',
					reference: 'PAY-20230901-002',
					invoiceId: 'inv-002',
					invoiceNumber: 'INV-20230825-002',
				},
				{
					id: 'pay-003',
					customerId: 'cust-001',
					date: '2023-08-15',
					amount: 950,
					method: 'نقداً',
					reference: 'PAY-20230815-003',
					invoiceId: 'inv-003',
					invoiceNumber: 'INV-20230805-003',
				},
				{
					id: 'pay-004',
					customerId: 'cust-001',
					date: '2023-07-20',
					amount: 1500,
					method: 'بطاقة ائتمانية',
					reference: 'PAY-20230720-004',
					invoiceId: 'inv-004',
					invoiceNumber: 'INV-20230710-004',
				},
				{
					id: 'pay-005',
					customerId: 'cust-001',
					date: '2023-06-30',
					amount: 2000,
					method: 'تحويل بنكي',
					reference: 'PAY-20230630-005',
					invoiceId: 'inv-005',
					invoiceNumber: 'INV-20230620-005',
				},
				{
					id: 'pay-006',
					customerId: 'cust-002',
					date: '2023-10-05',
					amount: 7500,
					method: 'تحويل بنكي',
					reference: 'PAY-20231005-006',
					invoiceId: 'inv-006',
					invoiceNumber: 'INV-20230925-006',
					notes: 'دفعة جزئية من الفاتورة',
				},
			];

			setAccounts(mockAccounts);
			setFilteredAccounts(mockAccounts);
			setPaymentHistory(mockPaymentHistory);

			// حساب الإحصائيات
			const totalBalances = mockAccounts.reduce((sum, account) => sum + account.balance, 0);
			const overdueAmount = mockAccounts
				.filter((account) => account.overdueDays && account.overdueDays > 0)
				.reduce((sum, account) => sum + account.dueAmount, 0);
			const activeAccounts = mockAccounts.filter((account) => account.status === 'active').length;

			setStats({
				totalBalances,
				overdueAmount,
				totalCustomers: mockAccounts.length,
				activeAccounts,
			});

			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let result = [...accounts];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(account) =>
					account.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					account.customerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
					account.phone.includes(searchTerm) ||
					(account.email && account.email.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			result = result.filter((account) => account.status === statusFilter);
		}

		// تطبيق فلتر الرصيد
		if (balanceFilter !== 'all') {
			if (balanceFilter === 'positive') {
				result = result.filter((account) => account.balance > 0);
			} else if (balanceFilter === 'zero') {
				result = result.filter((account) => account.balance === 0);
			} else if (balanceFilter === 'overdue') {
				result = result.filter((account) => account.overdueDays && account.overdueDays > 0);
			}
		}

		// تطبيق فلتر نوع العميل
		if (typeFilter !== 'all') {
			result = result.filter((account) => account.customerType === typeFilter);
		}

		// تطبيق الترتيب
		result.sort((a, b) => {
			if (sortBy === 'name') {
				return sortOrder === 'asc'
					? a.customerName.localeCompare(b.customerName)
					: b.customerName.localeCompare(a.customerName);
			} else if (sortBy === 'balance') {
				return sortOrder === 'asc' ? a.balance - b.balance : b.balance - a.balance;
			} else if (sortBy === 'due') {
				return sortOrder === 'asc' ? a.dueAmount - b.dueAmount : b.dueAmount - a.dueAmount;
			} else {
				// تاريخ آخر دفعة
				const dateA = a.lastPaymentDate ? new Date(a.lastPaymentDate).getTime() : 0;
				const dateB = b.lastPaymentDate ? new Date(b.lastPaymentDate).getTime() : 0;
				return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
			}
		});

		setFilteredAccounts(result);
		setCurrentPage(1); // إعادة تعيين الصفحة الحالية عند تغيير الفلاتر
	}, [searchTerm, statusFilter, balanceFilter, typeFilter, sortBy, sortOrder, accounts]);

	// توسيع/طي تفاصيل الحساب
	const toggleAccountExpand = (accountId: string) => {
		if (expandedAccount === accountId) {
			setExpandedAccount(null);
		} else {
			setExpandedAccount(accountId);
		}
	};

	// عرض سجل مدفوعات العميل
	const showCustomerPaymentHistory = (account: CustomerAccount) => {
		setSelectedAccount(account);
		setShowPaymentHistory(true);
	};

	// إغلاق نافذة سجل المدفوعات
	const closePaymentHistory = () => {
		setShowPaymentHistory(false);
		setSelectedAccount(null);
	};

	// تنسيق التاريخ
	const formatDate = (dateString?: string) => {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// عرض حالة الحساب
	const renderAccountStatusBadge = (status: string) => {
		switch (status) {
			case 'active':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						نشط
					</span>
				);
			case 'suspended':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						معلق
					</span>
				);
			case 'closed':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						مغلق
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
	const currentItems = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

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
						حسابات العملاء
					</h1>
					<p className='mt-1 text-gray-500'>إدارة حسابات العملاء والأرصدة المستحقة</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/finance/customer-accounts/payments'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<DollarSign className='ml-1 h-4 w-4' />
						المدفوعات
					</Link>
					<Link
						href='/dashboard/finance/customer-accounts/schedules'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<Calendar className='ml-1 h-4 w-4' />
						جدولة المدفوعات
					</Link>
					<Link
						href='/dashboard/finance/customer-accounts/new-payment'
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						<Plus className='ml-1 h-4 w-4' />
						تسجيل دفعة جديدة
					</Link>
				</div>
			</div>

			{/* بطاقات الإحصائيات */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>إجمالي الأرصدة</p>
							<p className='text-2xl font-bold text-indigo-600'>{formatAmount(stats.totalBalances)}</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
							<DollarSign className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>إجمالي الذمم المستحقة للعملاء</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>المبالغ المتأخرة</p>
							<p className='text-2xl font-bold text-red-600'>{formatAmount(stats.overdueAmount)}</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600'>
							<AlertCircle className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>مبالغ تجاوزت تاريخ الاستحقاق</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>عدد العملاء</p>
							<p className='text-2xl font-bold text-green-600'>{stats.totalCustomers}</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
							<Users className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>{stats.activeAccounts} حساب نشط</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>متوسط الرصيد</p>
							<p className='text-2xl font-bold text-amber-600'>
								{formatAmount(stats.totalBalances / Math.max(1, stats.activeAccounts))}
							</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
							<BarChart2 className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>لكل حساب نشط</div>
				</div>
			</div>

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
					{/* البحث */}
					<div className='relative'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='بحث عن اسم العميل أو رقم الهاتف...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						/>
					</div>

					{/* فلتر الحالة */}
					<div className='relative'>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الحالات</option>
							<option value='active'>نشط</option>
							<option value='suspended'>معلق</option>
							<option value='closed'>مغلق</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر الرصيد */}
					<div className='relative'>
						<select
							value={balanceFilter}
							onChange={(e) => setBalanceFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الأرصدة</option>
							<option value='positive'>عليه رصيد</option>
							<option value='zero'>رصيد صفر</option>
							<option value='overdue'>متأخر السداد</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر نوع العميل */}
					<div className='relative'>
						<select
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع أنواع العملاء</option>
							<option value='individual'>أفراد</option>
							<option value='company'>شركات</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* الترتيب */}
					<div className='relative'>
						<select
							value={`${sortBy}_${sortOrder}`}
							onChange={(e) => {
								const [newSortBy, newSortOrder] = e.target.value.split('_') as [
									'name' | 'balance' | 'due' | 'lastPayment',
									'asc' | 'desc'
								];
								setSortBy(newSortBy);
								setSortOrder(newSortOrder);
							}}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='name_asc'>الاسم (أ-ي)</option>
							<option value='name_desc'>الاسم (ي-أ)</option>
							<option value='balance_desc'>الرصيد (الأعلى أولاً)</option>
							<option value='balance_asc'>الرصيد (الأقل أولاً)</option>
							<option value='due_desc'>المستحق (الأعلى أولاً)</option>
							<option value='due_asc'>المستحق (الأقل أولاً)</option>
							<option value='lastPayment_desc'>آخر دفعة (الأحدث أولاً)</option>
							<option value='lastPayment_asc'>آخر دفعة (الأقدم أولاً)</option>
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
							عرض {filteredAccounts.length} من {accounts.length} حساب
						</span>

						{(searchTerm || statusFilter !== 'all' || balanceFilter !== 'all' || typeFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setStatusFilter('all');
									setBalanceFilter('all');
									setTypeFilter('all');
								}}
								className='text-xs text-indigo-600 hover:text-indigo-800'
							>
								مسح الفلاتر
							</button>
						)}
					</div>
				</div>
			</div>

			{/* قائمة حسابات العملاء */}
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
										العميل
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										معلومات الاتصال
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										آخر دفعة
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الرصيد
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										المستحق
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
								{currentItems.map((account) => (
									<tr key={account.id} className='hover:bg-gray-50'>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div>
													<div className='text-sm font-medium text-gray-900'>
														<button
															onClick={() => toggleAccountExpand(account.id)}
															className='hover:text-indigo-600 focus:outline-none'
														>
															{account.customerName}
														</button>
													</div>
													<div className='text-xs text-gray-500'>
														{account.customerType === 'individual' ? 'فرد' : 'شركة'}
														{account.contactPerson && ` - ${account.contactPerson}`}
													</div>
												</div>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											<div className='flex flex-col'>
												<div className='flex items-center'>
													<Phone className='h-3 w-3 text-gray-400 ml-1' />
													<span dir='ltr'>{account.phone}</span>
												</div>
												{account.email && (
													<div className='flex items-center mt-1'>
														<Mail className='h-3 w-3 text-gray-400 ml-1' />
														<span>{account.email}</span>
													</div>
												)}
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{account.lastPaymentDate ? (
												<div>
													<div>{formatDate(account.lastPaymentDate)}</div>
													{account.lastPaymentAmount && (
														<div className='text-xs text-gray-500'>
															{formatAmount(account.lastPaymentAmount)}
														</div>
													)}
												</div>
											) : (
												<span>-</span>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-left'>
											<span className={account.balance > 0 ? 'text-amber-600' : 'text-gray-600'}>
												{formatAmount(account.balance)}
											</span>
											{account.creditLimit && (
												<div className='text-xs text-gray-500'>
													الحد: {formatAmount(account.creditLimit)}
												</div>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-left'>
											<span className={account.dueAmount > 0 ? 'text-red-600' : 'text-gray-600'}>
												{formatAmount(account.dueAmount)}
											</span>
											{account.overdueDays && account.overdueDays > 0 && (
												<div className='text-xs text-red-500'>
													متأخر {account.overdueDays} يوم
												</div>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{renderAccountStatusBadge(account.status)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
											<div className='flex items-center justify-center space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/finance/customer-accounts/${account.id}`}
													className='text-indigo-600 hover:text-indigo-900'
													title='عرض التفاصيل'
												>
													<Eye className='h-5 w-5' />
												</Link>
												<button
													onClick={() => showCustomerPaymentHistory(account)}
													className='text-green-600 hover:text-green-900'
													title='سجل المدفوعات'
												>
													<DollarSign className='h-5 w-5' />
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
															href={`/dashboard/finance/customer-accounts/${account.id}`}
															className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
														>
															<Eye className='inline ml-1 h-4 w-4' />
															عرض التفاصيل
														</Link>
														<Link
															href={`/dashboard/finance/customer-accounts/new-payment?customer=${account.customerId}`}
															className='block px-4 py-2 text-sm text-green-600 hover:bg-green-50'
														>
															<Plus className='inline ml-1 h-4 w-4' />
															تسجيل دفعة
														</Link>
														<Link
															href={`/dashboard/finance/customer-accounts/schedule?customer=${account.customerId}`}
															className='block px-4 py-2 text-sm text-blue-600 hover:bg-blue-50'
														>
															<Calendar className='inline ml-1 h-4 w-4' />
															جدولة المدفوعات
														</Link>
														<Link
															href={`/dashboard/finance/customer-accounts/${account.id}/statement`}
															className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
														>
															<FileText className='inline ml-1 h-4 w-4' />
															كشف حساب
														</Link>
														<button className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
															<MessageSquare className='inline ml-1 h-4 w-4' />
															إرسال تذكير
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

					{/* تفاصيل الحساب الموسعة */}
					{expandedAccount && (
						<div className='border-t border-gray-200 bg-gray-50 p-4 animate-fadeIn'>
							{accounts
								.filter((a) => a.id === expandedAccount)
								.map((account) => (
									<div key={`details-${account.id}`}>
										<div className='flex justify-between items-center mb-4'>
											<h3 className='text-lg font-medium text-gray-900'>
												تفاصيل حساب العميل: {account.customerName}
											</h3>
											<button
												onClick={() => setExpandedAccount(null)}
												className='text-gray-400 hover:text-gray-500'
											>
												<X className='h-5 w-5' />
											</button>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													معلومات العميل
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-1 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>اسم العميل:</p>
															<p className='font-medium text-gray-900'>
																{account.customerName}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>نوع العميل:</p>
															<p className='font-medium text-gray-900'>
																{account.customerType === 'individual' ? 'فرد' : 'شركة'}
															</p>
														</div>
														{account.contactPerson && (
															<div>
																<p className='text-gray-500'>الشخص المسؤول:</p>
																<p className='font-medium text-gray-900'>
																	{account.contactPerson}
																</p>
															</div>
														)}
														<div>
															<p className='text-gray-500'>رقم الهاتف:</p>
															<p className='font-medium text-gray-900' dir='ltr'>
																{account.phone}
															</p>
														</div>
														{account.email && (
															<div>
																<p className='text-gray-500'>البريد الإلكتروني:</p>
																<p className='font-medium text-gray-900'>
																	{account.email}
																</p>
															</div>
														)}
													</div>
												</div>
											</div>

											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													تفاصيل الحساب
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-1 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>حالة الحساب:</p>
															<div>{renderAccountStatusBadge(account.status)}</div>
														</div>
														<div>
															<p className='text-gray-500'>إجمالي المشتريات:</p>
															<p className='font-medium text-gray-900'>
																{formatAmount(account.totalPurchases)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>شروط الدفع:</p>
															<p className='font-medium text-gray-900'>
																{account.paymentTerms || '-'}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>تاريخ إنشاء الحساب:</p>
															<p className='font-medium text-gray-900'>
																{formatDate(account.createdAt)}
															</p>
														</div>
													</div>
												</div>
											</div>

											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													المعلومات المالية
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-1 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>الرصيد الحالي:</p>
															<p
																className={`font-medium ${
																	account.balance > 0
																		? 'text-amber-600'
																		: 'text-gray-900'
																}`}
															>
																{formatAmount(account.balance)}
															</p>
														</div>
														{account.creditLimit && (
															<div>
																<p className='text-gray-500'>حد الائتمان:</p>
																<p className='font-medium text-gray-900'>
																	{formatAmount(account.creditLimit)}
																</p>
															</div>
														)}
														<div>
															<p className='text-gray-500'>المبلغ المستحق:</p>
															<p
																className={`font-medium ${
																	account.dueAmount > 0
																		? 'text-red-600'
																		: 'text-gray-900'
																}`}
															>
																{formatAmount(account.dueAmount)}
															</p>
														</div>
														{account.overdueDays && account.overdueDays > 0 && (
															<div>
																<p className='text-gray-500'>متأخر لمدة:</p>
																<p className='font-medium text-red-600'>
																	{account.overdueDays} يوم
																</p>
															</div>
														)}
													</div>
												</div>
											</div>
										</div>

										{account.notes && (
											<div className='mb-4'>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>ملاحظات</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200 text-sm text-gray-600'>
													{account.notes}
												</div>
											</div>
										)}

										<div className='flex justify-between items-center mt-4'>
											<div className='flex gap-2'>
												<Link
													href={`/dashboard/finance/customer-accounts/${account.id}`}
													className='px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center'
												>
													<Eye className='ml-1 h-4 w-4' />
													عرض التفاصيل الكاملة
												</Link>
												<Link
													href={`/dashboard/finance/customer-accounts/new-payment?customer=${account.customerId}`}
													className='px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center'
												>
													<Plus className='ml-1 h-4 w-4' />
													تسجيل دفعة
												</Link>
												<Link
													href={`/dashboard/finance/customer-accounts/${account.id}/statement`}
													className='px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center'
												>
													<FileText className='ml-1 h-4 w-4' />
													كشف حساب
												</Link>
											</div>

											{account.dueAmount > 0 && (
												<button className='px-3 py-1.5 border border-amber-300 text-amber-700 bg-amber-50 rounded-md hover:bg-amber-100 text-sm flex items-center'>
													<MessageSquare className='ml-1 h-4 w-4' />
													إرسال تذكير
												</button>
											)}
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
										{Math.min(indexOfLastItem, filteredAccounts.length)}
									</span>{' '}
									من أصل <span className='font-medium'>{filteredAccounts.length}</span> حساب
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
					<Users className='h-12 w-12 text-gray-300 mx-auto mb-3' />
					<h3 className='text-lg font-medium text-gray-900'>لا توجد حسابات عملاء</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm || statusFilter !== 'all' || balanceFilter !== 'all' || typeFilter !== 'all'
							? 'لم يتم العثور على حسابات تطابق معايير البحث المحددة'
							: 'لا توجد حسابات عملاء مسجلة في النظام.'}
					</p>
					<div className='mt-4'>
						<Link
							href='/dashboard/customers/new'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
						>
							<Plus className='ml-1 h-4 w-4' />
							إضافة عميل جديد
						</Link>
					</div>
				</div>
			)}

			{/* العملاء المتأخرين في السداد */}
			{accounts.filter((a) => a.overdueDays && a.overdueDays > 0).length > 0 && (
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-lg font-medium text-gray-900'>العملاء المتأخرين في السداد</h2>
						<Link
							href='/dashboard/finance/customer-accounts/overdue'
							className='text-sm text-indigo-600 hover:text-indigo-800 flex items-center'
						>
							<Eye className='ml-1 h-4 w-4' />
							عرض الكل
						</Link>
					</div>

					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										العميل
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										رقم الهاتف
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										المبلغ المستحق
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										متأخر لمدة
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الإجراءات
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{accounts
									.filter((a) => a.overdueDays && a.overdueDays > 0)
									.sort((a, b) => (b.overdueDays || 0) - (a.overdueDays || 0))
									.slice(0, 5)
									.map((account) => (
										<tr key={`overdue-${account.id}`} className='hover:bg-gray-50'>
											<td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900'>
												{account.customerName}
											</td>
											<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500' dir='ltr'>
												{account.phone}
											</td>
											<td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-red-600 text-left'>
												{formatAmount(account.dueAmount)}
											</td>
											<td className='px-4 py-3 whitespace-nowrap text-sm text-red-600'>
												{account.overdueDays} يوم
											</td>
											<td className='px-4 py-3 whitespace-nowrap text-sm text-center'>
												<div className='flex items-center justify-center space-x-2 space-x-reverse'>
													<Link
														href={`/dashboard/finance/customer-accounts/new-payment?customer=${account.customerId}`}
														className='text-green-600 hover:text-green-900'
														title='تسجيل دفعة'
													>
														<DollarSign className='h-4 w-4' />
													</Link>
													<button
														className='text-amber-600 hover:text-amber-900'
														title='إرسال تذكير'
													>
														<MessageSquare className='h-4 w-4' />
													</button>
													<Link
														href={`/dashboard/finance/customer-accounts/${account.id}`}
														className='text-indigo-600 hover:text-indigo-900'
														title='عرض التفاصيل'
													>
														<Eye className='h-4 w-4' />
													</Link>
												</div>
											</td>
										</tr>
									))}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* روابط سريعة */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Link
					href='/dashboard/finance/customer-accounts/new-payment'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
						<Plus className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>تسجيل دفعة</h3>
						<p className='text-sm text-gray-500'>تسجيل دفعة جديدة من عميل</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/customer-accounts/overdue'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 ml-3'>
						<AlertCircle className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>المتأخرون</h3>
						<p className='text-sm text-gray-500'>عرض المتأخرين في السداد</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/customer-accounts/schedules'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
						<Calendar className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>جدولة المدفوعات</h3>
						<p className='text-sm text-gray-500'>عرض وإدارة جدولة المدفوعات</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/reports/accounts-receivable'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ml-3'>
						<BarChart2 className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>تقارير الذمم</h3>
						<p className='text-sm text-gray-500'>تقارير الذمم المدينة</p>
					</div>
				</Link>
			</div>

			{/* نافذة عرض سجل المدفوعات */}
			{showPaymentHistory && selectedAccount && (
				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
						<div className='fixed inset-0 transition-opacity' onClick={closePaymentHistory}>
							<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
						</div>

						<div className='inline-block align-middle bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full'>
							<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								<div className='flex justify-between items-center mb-4'>
									<h3 className='text-lg font-medium text-gray-900'>
										سجل مدفوعات العميل: {selectedAccount.customerName}
									</h3>
									<button onClick={closePaymentHistory} className='text-gray-400 hover:text-gray-500'>
										<X className='h-5 w-5' />
									</button>
								</div>

								{paymentHistory.filter((p) => p.customerId === selectedAccount.customerId).length >
								0 ? (
									<div className='overflow-x-auto'>
										<table className='min-w-full divide-y divide-gray-200'>
											<thead className='bg-gray-50'>
												<tr>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
													>
														رقم المرجع
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
													>
														التاريخ
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
													>
														طريقة الدفع
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
													>
														الفاتورة
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
													>
														المبلغ
													</th>
												</tr>
											</thead>
											<tbody className='bg-white divide-y divide-gray-200'>
												{paymentHistory
													.filter((p) => p.customerId === selectedAccount.customerId)
													.sort(
														(a, b) =>
															new Date(b.date).getTime() - new Date(a.date).getTime()
													)
													.map((payment) => (
														<tr key={payment.id} className='hover:bg-gray-50'>
															<td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-indigo-600'>
																{payment.reference}
															</td>
															<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
																{formatDate(payment.date)}
															</td>
															<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
																{payment.method}
															</td>
															<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-500'>
																{payment.invoiceNumber ? (
																	<Link
																		href={`/dashboard/sales/invoices/${payment.invoiceId}`}
																		className='text-indigo-600 hover:underline'
																	>
																		{payment.invoiceNumber}
																	</Link>
																) : (
																	'-'
																)}
															</td>
															<td className='px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600 text-left'>
																{formatAmount(payment.amount)}
															</td>
														</tr>
													))}
											</tbody>
										</table>
									</div>
								) : (
									<div className='text-center py-8'>
										<DollarSign className='h-12 w-12 text-gray-300 mx-auto mb-2' />
										<h3 className='text-lg font-medium text-gray-900'>لا توجد مدفوعات</h3>
										<p className='mt-1 text-gray-500'>لم يقم العميل بأي مدفوعات مسجلة في النظام</p>
									</div>
								)}
							</div>

							<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
								<Link
									href={`/dashboard/finance/customer-accounts/new-payment?customer=${selectedAccount.customerId}`}
									className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
								>
									<Plus className='ml-1 h-4 w-4' />
									تسجيل دفعة جديدة
								</Link>
								<button
									type='button'
									onClick={closePaymentHistory}
									className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
								>
									إغلاق
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
