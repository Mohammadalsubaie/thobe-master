'use client';

import {
	AlertCircle,
	ArrowLeft,
	ArrowRight,
	ChevronDown,
	Clock,
	DollarSign,
	Download,
	Edit,
	Eye,
	FileText,
	MoreHorizontal,
	Percent,
	Plus,
	Printer,
	RefreshCw,
	Search,
	Send,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Invoice {
	id: string;
	invoiceNumber: string;
	date: string;
	dueDate: string;
	customer: {
		id: string;
		name: string;
		phone: string;
		email?: string;
		type: 'individual' | 'company';
	};
	items: {
		id: string;
		name: string;
		quantity: number;
		unitPrice: number;
		discount?: number;
		tax: number;
		total: number;
	}[];
	subtotal: number;
	taxAmount: number;
	discount?: number;
	total: number;
	amountPaid: number;
	balance: number;
	status: 'draft' | 'pending' | 'paid' | 'partial' | 'overdue' | 'canceled';
	paymentMethod?: string;
	notes?: string;
	createdBy: string;
	relatedOrder?: string;
}

export default function InvoicesPage() {
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

	// فلترة
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [dateFilter, setDateFilter] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	// إحصائيات
	const [stats, setStats] = useState({
		totalInvoices: 0,
		totalAmount: 0,
		paidAmount: 0,
		pendingAmount: 0,
		overdueAmount: 0,
	});

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// بيانات تجريبية للفواتير
			const mockInvoices: Invoice[] = [
				{
					id: 'inv-001',
					invoiceNumber: 'INV-20231001-001',
					date: '2023-10-01',
					dueDate: '2023-10-15',
					customer: {
						id: 'cust-001',
						name: 'عبدالله محمد',
						phone: '0501234567',
						email: 'abdullah@example.com',
						type: 'individual',
					},
					items: [
						{
							id: 'item-001',
							name: 'ثوب كلاسيك',
							quantity: 2,
							unitPrice: 450,
							tax: 15,
							total: 1035,
						},
						{
							id: 'item-002',
							name: 'شماغ أحمر',
							quantity: 1,
							unitPrice: 120,
							tax: 15,
							total: 138,
						},
					],
					subtotal: 1020,
					taxAmount: 153,
					total: 1173,
					amountPaid: 1173,
					balance: 0,
					status: 'paid',
					paymentMethod: 'بطاقة ائتمانية',
					createdBy: 'فهد العتيبي',
					relatedOrder: 'ORD-1245',
				},
				{
					id: 'inv-002',
					invoiceNumber: 'INV-20231003-002',
					date: '2023-10-03',
					dueDate: '2023-10-17',
					customer: {
						id: 'cust-002',
						name: 'شركة الأفق للتجارة',
						phone: '0112345678',
						email: 'info@alufuq.com',
						type: 'company',
					},
					items: [
						{
							id: 'item-003',
							name: 'بشت شتوي فاخر',
							quantity: 5,
							unitPrice: 1200,
							discount: 10,
							tax: 15,
							total: 6210,
						},
					],
					subtotal: 5400,
					taxAmount: 810,
					total: 6210,
					amountPaid: 3000,
					balance: 3210,
					status: 'partial',
					paymentMethod: 'تحويل بنكي',
					notes: 'تسديد باقي المبلغ خلال أسبوعين',
					createdBy: 'محمد السالم',
					relatedOrder: 'ORD-1250',
				},
				{
					id: 'inv-003',
					invoiceNumber: 'INV-20231005-003',
					date: '2023-10-05',
					dueDate: '2023-10-12',
					customer: {
						id: 'cust-003',
						name: 'فهد العمري',
						phone: '0557654321',
						type: 'individual',
					},
					items: [
						{
							id: 'item-004',
							name: 'ثوب إماراتي',
							quantity: 1,
							unitPrice: 500,
							tax: 15,
							total: 575,
						},
						{
							id: 'item-005',
							name: 'عقال أسود',
							quantity: 1,
							unitPrice: 80,
							tax: 15,
							total: 92,
						},
					],
					subtotal: 580,
					taxAmount: 87,
					total: 667,
					amountPaid: 0,
					balance: 667,
					status: 'pending',
					createdBy: 'خالد المالكي',
					relatedOrder: 'ORD-1246',
				},
				{
					id: 'inv-004',
					invoiceNumber: 'INV-20230925-004',
					date: '2023-09-25',
					dueDate: '2023-10-02',
					customer: {
						id: 'cust-004',
						name: 'سعيد الزهراني',
						phone: '0562345678',
						email: 'saeed@example.com',
						type: 'individual',
					},
					items: [
						{
							id: 'item-006',
							name: 'ثوب مغربي',
							quantity: 1,
							unitPrice: 550,
							tax: 15,
							total: 632.5,
						},
					],
					subtotal: 550,
					taxAmount: 82.5,
					total: 632.5,
					amountPaid: 0,
					balance: 632.5,
					status: 'overdue',
					notes: 'تم التواصل مع العميل لتذكيره بالدفع',
					createdBy: 'فهد العتيبي',
					relatedOrder: 'ORD-1240',
				},
				{
					id: 'inv-005',
					invoiceNumber: 'INV-20231006-005',
					date: '2023-10-06',
					dueDate: '2023-10-06',
					customer: {
						id: 'cust-005',
						name: 'محمد العنزي',
						phone: '0533456789',
						type: 'individual',
					},
					items: [
						{
							id: 'item-007',
							name: 'شماغ أبيض',
							quantity: 2,
							unitPrice: 120,
							tax: 15,
							total: 276,
						},
						{
							id: 'item-008',
							name: 'عقال أسود',
							quantity: 2,
							unitPrice: 80,
							tax: 15,
							total: 184,
						},
					],
					subtotal: 400,
					taxAmount: 60,
					total: 460,
					amountPaid: 460,
					balance: 0,
					status: 'paid',
					paymentMethod: 'نقداً',
					createdBy: 'محمد السالم',
					relatedOrder: 'ORD-1247',
				},
				{
					id: 'inv-006',
					invoiceNumber: 'INV-20231002-006',
					date: '2023-10-02',
					dueDate: '2023-10-02',
					customer: {
						id: 'cust-006',
						name: 'خالد المالكي',
						phone: '0512345678',
						type: 'individual',
					},
					items: [
						{
							id: 'item-009',
							name: 'ثوب كلاسيك',
							quantity: 1,
							unitPrice: 450,
							tax: 15,
							total: 517.5,
						},
					],
					subtotal: 450,
					taxAmount: 67.5,
					discount: 50,
					total: 467.5,
					amountPaid: 467.5,
					balance: 0,
					status: 'paid',
					paymentMethod: 'نقداً',
					createdBy: 'فهد العتيبي',
					relatedOrder: 'ORD-1243',
				},
				{
					id: 'inv-007',
					invoiceNumber: 'INV-20231007-007',
					date: '2023-10-07',
					dueDate: '2023-10-21',
					customer: {
						id: 'cust-007',
						name: 'سلطان السلمي',
						phone: '0554567890',
						email: 'sultan@example.com',
						type: 'individual',
					},
					items: [
						{
							id: 'item-010',
							name: 'بشت صيفي',
							quantity: 1,
							unitPrice: 850,
							discount: 100,
							tax: 15,
							total: 862.5,
						},
						{
							id: 'item-011',
							name: 'ثوب كلاسيك',
							quantity: 1,
							unitPrice: 450,
							tax: 15,
							total: 517.5,
						},
					],
					subtotal: 1200,
					taxAmount: 180,
					discount: 0,
					total: 1380,
					amountPaid: 0,
					balance: 1380,
					status: 'draft',
					createdBy: 'محمد السالم',
					notes: 'مسودة - بانتظار تأكيد الطلب',
					relatedOrder: 'ORD-1248',
				},
			];

			// حساب الإحصائيات
			const totalAmount = mockInvoices.reduce((sum, invoice) => sum + invoice.total, 0);
			const paidAmount = mockInvoices.reduce(
				(sum, invoice) => (invoice.status === 'paid' ? sum + invoice.total : sum + invoice.amountPaid),
				0
			);
			const pendingAmount = mockInvoices.reduce(
				(sum, invoice) =>
					invoice.status === 'pending' || invoice.status === 'partial' ? sum + invoice.balance : sum,
				0
			);
			const overdueAmount = mockInvoices.reduce(
				(sum, invoice) => (invoice.status === 'overdue' ? sum + invoice.balance : sum),
				0
			);

			setInvoices(mockInvoices);
			setFilteredInvoices(mockInvoices);
			setStats({
				totalInvoices: mockInvoices.length,
				totalAmount,
				paidAmount,
				pendingAmount,
				overdueAmount,
			});

			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let result = [...invoices];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(invoice) =>
					invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
					invoice.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					invoice.customer.phone.includes(searchTerm)
			);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			result = result.filter((invoice) => invoice.status === statusFilter);
		}

		// تطبيق فلتر التاريخ
		if (dateFilter !== 'all') {
			const today = new Date();
			const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

			if (dateFilter === 'today') {
				result = result.filter((invoice) => {
					const invoiceDate = new Date(invoice.date);
					return (
						invoiceDate.getTime() >= startOfToday.getTime() &&
						invoiceDate.getTime() < startOfToday.getTime() + 86400000
					);
				});
			} else if (dateFilter === 'week') {
				const weekAgo = new Date(startOfToday.getTime() - 7 * 86400000);
				result = result.filter((invoice) => {
					const invoiceDate = new Date(invoice.date);
					return invoiceDate.getTime() >= weekAgo.getTime();
				});
			} else if (dateFilter === 'month') {
				const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
				result = result.filter((invoice) => {
					const invoiceDate = new Date(invoice.date);
					return invoiceDate.getTime() >= monthAgo.getTime();
				});
			} else if (dateFilter === 'overdue') {
				const now = new Date();
				result = result.filter((invoice) => {
					const dueDate = new Date(invoice.dueDate);
					return dueDate.getTime() < now.getTime() && invoice.status !== 'paid';
				});
			}
		}

		setFilteredInvoices(result);
		setCurrentPage(1); // إعادة تعيين الصفحة الحالية عند تغيير الفلاتر
	}, [searchTerm, statusFilter, dateFilter, invoices]);

	// توسيع/طي تفاصيل الفاتورة
	const toggleInvoiceExpand = (invoiceId: string) => {
		if (expandedInvoice === invoiceId) {
			setExpandedInvoice(null);
		} else {
			setExpandedInvoice(invoiceId);
		}
	};

	// عرض حالة الفاتورة
	const renderStatusBadge = (status: string) => {
		switch (status) {
			case 'paid':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						مدفوعة
					</span>
				);
			case 'partial':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						مدفوعة جزئياً
					</span>
				);
			case 'pending':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
						قيد الانتظار
					</span>
				);
			case 'overdue':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						متأخرة
					</span>
				);
			case 'canceled':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						ملغاة
					</span>
				);
			case 'draft':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500'>
						مسودة
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

	// تنسيق التاريخ
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// التحقق من تاريخ الاستحقاق
	const isDueDatePassed = (dueDate: string) => {
		const now = new Date();
		const due = new Date(dueDate);
		return due < now;
	};

	// حساب صفحات الترقيم
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

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
						<FileText className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						الفواتير
					</h1>
					<p className='mt-1 text-gray-500'>إدارة وعرض فواتير المبيعات</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/sales/pos'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<DollarSign className='ml-1 h-4 w-4' />
						نقطة البيع
					</Link>
					<Link
						href='/dashboard/sales/invoices/new'
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						<Plus className='ml-1 h-4 w-4' />
						فاتورة جديدة
					</Link>
				</div>
			</div>

			{/* بطاقات الإحصائيات */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>إجمالي الفواتير</p>
							<p className='text-2xl font-bold text-gray-900'>{stats.totalInvoices}</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
							<FileText className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>{filteredInvoices.length} فاتورة في الفلتر الحالي</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>إجمالي المبيعات</p>
							<p className='text-2xl font-bold text-gray-900'>{stats.totalAmount.toLocaleString()} ر.س</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600'>
							<DollarSign className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 text-xs text-gray-500'>مبيعات الشهر الحالي</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>المبالغ المستحقة</p>
							<p className='text-2xl font-bold text-amber-600'>
								{stats.pendingAmount.toLocaleString()} ر.س
							</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
							<Clock className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 flex items-center'>
						<div className='flex-1 bg-gray-200 rounded-full h-2'>
							<div
								className='bg-amber-500 h-2 rounded-full'
								style={{ width: `${(stats.pendingAmount / stats.totalAmount) * 100}%` }}
							></div>
						</div>
						<span className='text-xs text-gray-500 mr-2'>
							{Math.round((stats.pendingAmount / stats.totalAmount) * 100)}%
						</span>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between'>
						<div>
							<p className='text-sm text-gray-500'>المبالغ المتأخرة</p>
							<p className='text-2xl font-bold text-red-600'>
								{stats.overdueAmount.toLocaleString()} ر.س
							</p>
						</div>
						<div className='h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600'>
							<AlertCircle className='h-6 w-6' />
						</div>
					</div>
					<div className='mt-2 flex items-center'>
						<div className='flex-1 bg-gray-200 rounded-full h-2'>
							<div
								className='bg-red-500 h-2 rounded-full'
								style={{ width: `${(stats.overdueAmount / stats.totalAmount) * 100}%` }}
							></div>
						</div>
						<span className='text-xs text-gray-500 mr-2'>
							{Math.round((stats.overdueAmount / stats.totalAmount) * 100)}%
						</span>
					</div>
				</div>
			</div>

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					{/* البحث */}
					<div className='relative'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='بحث عن رقم الفاتورة أو اسم العميل...'
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
							<option value='paid'>مدفوعة</option>
							<option value='partial'>مدفوعة جزئياً</option>
							<option value='pending'>قيد الانتظار</option>
							<option value='overdue'>متأخرة</option>
							<option value='draft'>مسودة</option>
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
							<option value='overdue'>متأخرة الدفع</option>
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
							عرض {filteredInvoices.length} من {invoices.length} فاتورة
						</span>

						{(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
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

			{/* قائمة الفواتير */}
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
										رقم الفاتورة
									</th>
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
										التاريخ
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الإجمالي
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										المدفوع
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
								{currentItems.map((invoice) => (
									<tr key={invoice.id} className='hover:bg-gray-50'>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600'>
											<button
												onClick={() => toggleInvoiceExpand(invoice.id)}
												className='hover:underline focus:outline-none'
											>
												{invoice.invoiceNumber}
											</button>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm font-medium text-gray-900'>
												{invoice.customer.name}
											</div>
											<div className='text-xs text-gray-500'>{invoice.customer.phone}</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>{formatDate(invoice.date)}</div>
											{invoice.status !== 'paid' && (
												<div
													className={`text-xs ${
														isDueDatePassed(invoice.dueDate)
															? 'text-red-500'
															: 'text-gray-500'
													}`}
												>
													تاريخ الاستحقاق: {formatDate(invoice.dueDate)}
												</div>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium'>
											{invoice.total.toLocaleString()} ر.س
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{invoice.amountPaid.toLocaleString()} ر.س
											</div>
											{invoice.balance > 0 && (
												<div className='text-xs text-red-500'>
													متبقي: {invoice.balance.toLocaleString()} ر.س
												</div>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{renderStatusBadge(invoice.status)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
											<div className='flex items-center justify-center space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/sales/invoices/${invoice.id}`}
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
															href={`/dashboard/sales/invoices/${invoice.id}/edit`}
															className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
														>
															<Edit className='inline ml-1 h-4 w-4' />
															تعديل الفاتورة
														</Link>
														<button className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
															<Download className='inline ml-1 h-4 w-4' />
															تنزيل كـ PDF
														</button>
														<button className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
															<Send className='inline ml-1 h-4 w-4' />
															إرسال بالبريد الإلكتروني
														</button>
														{(invoice.status === 'pending' ||
															invoice.status === 'partial') && (
															<button className='block w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-green-50'>
																<DollarSign className='inline ml-1 h-4 w-4' />
																تسجيل دفعة
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

					{/* تفاصيل الفاتورة الموسعة */}
					{expandedInvoice && (
						<div className='border-t border-gray-200 bg-gray-50 p-4 animate-fadeIn'>
							{invoices
								.filter((inv) => inv.id === expandedInvoice)
								.map((invoice) => (
									<div key={`details-${invoice.id}`}>
										<div className='flex justify-between items-center mb-4'>
											<h3 className='text-lg font-medium text-gray-900'>
												تفاصيل الفاتورة #{invoice.invoiceNumber}
											</h3>
											<button
												onClick={() => setExpandedInvoice(null)}
												className='text-gray-400 hover:text-gray-500'
											>
												<X className='h-5 w-5' />
											</button>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													معلومات العميل
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<p className='text-sm font-medium text-gray-900'>
														{invoice.customer.name}
													</p>
													<p className='text-sm text-gray-500'>{invoice.customer.phone}</p>
													{invoice.customer.email && (
														<p className='text-sm text-gray-500'>
															{invoice.customer.email}
														</p>
													)}
													<p className='text-xs text-gray-500 mt-1'>
														نوع العميل:{' '}
														{invoice.customer.type === 'individual' ? 'فرد' : 'شركة'}
													</p>
												</div>
											</div>

											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													معلومات الفاتورة
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-2 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>تاريخ الإصدار:</p>
															<p className='font-medium text-gray-900'>
																{formatDate(invoice.date)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>تاريخ الاستحقاق:</p>
															<p
																className={`font-medium ${
																	isDueDatePassed(invoice.dueDate) &&
																	invoice.status !== 'paid'
																		? 'text-red-600'
																		: 'text-gray-900'
																}`}
															>
																{formatDate(invoice.dueDate)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>طريقة الدفع:</p>
															<p className='font-medium text-gray-900'>
																{invoice.paymentMethod || 'غير محدد'}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>حالة الفاتورة:</p>
															<div>{renderStatusBadge(invoice.status)}</div>
														</div>
													</div>
												</div>
											</div>
										</div>

										<h4 className='text-sm font-medium text-gray-500 mb-1'>المنتجات</h4>
										<div className='bg-white rounded-md border border-gray-200 overflow-hidden mb-4'>
											<table className='min-w-full divide-y divide-gray-200'>
												<thead className='bg-gray-50'>
													<tr>
														<th
															scope='col'
															className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															المنتج
														</th>
														<th
															scope='col'
															className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															الكمية
														</th>
														<th
															scope='col'
															className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															السعر
														</th>
														<th
															scope='col'
															className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															الخصم
														</th>
														<th
															scope='col'
															className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															الضريبة
														</th>
														<th
															scope='col'
															className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															الإجمالي
														</th>
													</tr>
												</thead>
												<tbody className='divide-y divide-gray-200'>
													{invoice.items.map((item) => (
														<tr key={item.id}>
															<td className='px-4 py-2 text-sm text-gray-900'>
																{item.name}
															</td>
															<td className='px-4 py-2 text-sm text-gray-500 text-center'>
																{item.quantity}
															</td>
															<td className='px-4 py-2 text-sm text-gray-500 text-center'>
																{item.unitPrice.toLocaleString()} ر.س
															</td>
															<td className='px-4 py-2 text-sm text-gray-500 text-center'>
																{item.discount
																	? `${item.discount.toLocaleString()} ر.س`
																	: '-'}
															</td>
															<td className='px-4 py-2 text-sm text-gray-500 text-center'>
																{item.tax}%
															</td>
															<td className='px-4 py-2 text-sm font-medium text-gray-900 text-left'>
																{item.total.toLocaleString()} ر.س
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>

										<div className='flex flex-col md:flex-row gap-4'>
											<div className='flex-1'>
												{invoice.notes && (
													<div>
														<h4 className='text-sm font-medium text-gray-500 mb-1'>
															ملاحظات
														</h4>
														<div className='bg-white p-3 rounded-md border border-gray-200 text-sm text-gray-600'>
															{invoice.notes}
														</div>
													</div>
												)}
											</div>

											<div className='md:w-80'>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													ملخص الفاتورة
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='space-y-1 text-sm'>
														<div className='flex justify-between'>
															<span className='text-gray-500'>المجموع الفرعي:</span>
															<span className='text-gray-900'>
																{invoice.subtotal.toLocaleString()} ر.س
															</span>
														</div>
														{invoice.discount && (
															<div className='flex justify-between'>
																<span className='text-gray-500'>الخصم:</span>
																<span className='text-gray-900'>
																	- {invoice.discount.toLocaleString()} ر.س
																</span>
															</div>
														)}
														<div className='flex justify-between'>
															<span className='text-gray-500'>الضريبة (15%):</span>
															<span className='text-gray-900'>
																{invoice.taxAmount.toLocaleString()} ر.س
															</span>
														</div>
														<div className='flex justify-between border-t border-gray-200 pt-2 font-medium'>
															<span className='text-gray-900'>الإجمالي:</span>
															<span className='text-gray-900'>
																{invoice.total.toLocaleString()} ر.س
															</span>
														</div>
														<div className='flex justify-between text-green-600'>
															<span>المدفوع:</span>
															<span>{invoice.amountPaid.toLocaleString()} ر.س</span>
														</div>
														{invoice.balance > 0 && (
															<div className='flex justify-between text-red-600 font-medium'>
																<span>المتبقي:</span>
																<span>{invoice.balance.toLocaleString()} ر.س</span>
															</div>
														)}
													</div>
												</div>
											</div>
										</div>

										{/* إجراءات الفاتورة */}
										<div className='mt-4 flex flex-wrap gap-2'>
											<Link
												href={`/dashboard/sales/invoices/${invoice.id}`}
												className='px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center'
											>
												<Eye className='ml-1 h-4 w-4' />
												عرض التفاصيل الكاملة
											</Link>
											<button className='px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center'>
												<Printer className='ml-1 h-4 w-4' />
												طباعة
											</button>
											<button className='px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center'>
												<Download className='ml-1 h-4 w-4' />
												تنزيل PDF
											</button>
											{invoice.status !== 'paid' && invoice.status !== 'canceled' && (
												<button className='px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center'>
													<DollarSign className='ml-1 h-4 w-4' />
													تسجيل دفعة
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
										{Math.min(indexOfLastItem, filteredInvoices.length)}
									</span>{' '}
									من أصل <span className='font-medium'>{filteredInvoices.length}</span> فاتورة
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
					<h3 className='text-lg font-medium text-gray-900'>لا توجد فواتير</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm || statusFilter !== 'all' || dateFilter !== 'all'
							? 'لم يتم العثور على فواتير تطابق معايير البحث المحددة'
							: 'لا توجد فواتير مسجلة في النظام. قم بإنشاء فاتورة جديدة للبدء.'}
					</p>
					<div className='mt-4'>
						<Link
							href='/dashboard/sales/invoices/new'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
						>
							<Plus className='ml-1 h-4 w-4' />
							إنشاء فاتورة جديدة
						</Link>
					</div>
				</div>
			)}

			{/* روابط سريعة */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<Link
					href='/dashboard/sales/pos'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
						<DollarSign className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>نقطة البيع</h3>
						<p className='text-sm text-gray-500'>إنشاء مبيعات جديدة بطريقة سريعة</p>
					</div>
				</Link>

				<Link
					href='/dashboard/sales/returns'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 ml-3'>
						<RefreshCw className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>المرتجعات</h3>
						<p className='text-sm text-gray-500'>إدارة المرتجعات واستبدال المنتجات</p>
					</div>
				</Link>

				<Link
					href='/dashboard/sales/promotions'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
						<Percent className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>العروض والخصومات</h3>
						<p className='text-sm text-gray-500'>إنشاء وإدارة العروض الترويجية</p>
					</div>
				</Link>
			</div>
		</div>
	);
}
