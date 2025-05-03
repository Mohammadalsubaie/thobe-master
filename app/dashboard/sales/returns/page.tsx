'use client';

import {
	ArrowLeft,
	ArrowRight,
	BarChart2,
	Check,
	ChevronDown,
	Clock,
	DollarSign,
	Download,
	Eye,
	FileText,
	MoreHorizontal,
	Package,
	Plus,
	Printer,
	RefreshCw,
	Search,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ReturnItem {
	id: string;
	productId: string;
	productName: string;
	quantity: number;
	unitPrice: number;
	returnReason: string;
	condition: 'new' | 'used' | 'damaged';
	returnType: 'refund' | 'exchange' | 'store_credit';
	status: 'pending' | 'approved' | 'rejected' | 'completed';
}

interface Return {
	id: string;
	returnNumber: string;
	originalInvoiceId: string;
	originalInvoiceNumber: string;
	date: string;
	customer: {
		id: string;
		name: string;
		phone: string;
		email?: string;
	};
	items: ReturnItem[];
	total: number;
	status: 'pending' | 'approved' | 'rejected' | 'partially_approved' | 'completed' | 'canceled';
	refundMethod?: string;
	refundAmount: number;
	exchangeAmount: number;
	storeCreditAmount: number;
	notes?: string;
	processedBy?: string;
	processedDate?: string;
}

interface ReturnStats {
	totalReturns: number;
	pendingReturns: number;
	approvedReturns: number;
	refundAmount: number;
	exchangeAmount: number;
	topReturnReasons: {
		reason: string;
		count: number;
		percentage: number;
	}[];
}

export default function ReturnsPage() {
	const [returns, setReturns] = useState<Return[]>([]);
	const [filteredReturns, setFilteredReturns] = useState<Return[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedReturn, setExpandedReturn] = useState<string | null>(null);

	// فلترة
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [typeFilter, setTypeFilter] = useState('all');
	const [dateFilter, setDateFilter] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(8);

	// إحصائيات
	const [stats, setStats] = useState<ReturnStats | null>(null);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// بيانات تجريبية للمرتجعات
			const mockReturns: Return[] = [
				{
					id: 'ret-001',
					returnNumber: 'RET-20231005-001',
					originalInvoiceId: 'inv-001',
					originalInvoiceNumber: 'INV-20231001-001',
					date: '2023-10-05',
					customer: {
						id: 'cust-001',
						name: 'عبدالله محمد',
						phone: '0501234567',
						email: 'abdullah@example.com',
					},
					items: [
						{
							id: 'ri-001',
							productId: 'prod-001',
							productName: 'ثوب كلاسيك',
							quantity: 1,
							unitPrice: 450,
							returnReason: 'مقاس غير مناسب',
							condition: 'new',
							returnType: 'exchange',
							status: 'approved',
						},
					],
					total: 450,
					status: 'approved',
					refundAmount: 0,
					exchangeAmount: 450,
					storeCreditAmount: 0,
					processedBy: 'فهد العتيبي',
					processedDate: '2023-10-06',
					notes: 'تم الموافقة على الاستبدال وتسجيل طلب جديد بنفس المقاس ولكن بلون مختلف',
				},
				{
					id: 'ret-002',
					returnNumber: 'RET-20231006-002',
					originalInvoiceId: 'inv-003',
					originalInvoiceNumber: 'INV-20231005-003',
					date: '2023-10-06',
					customer: {
						id: 'cust-003',
						name: 'فهد العمري',
						phone: '0557654321',
					},
					items: [
						{
							id: 'ri-002',
							productId: 'prod-005',
							productName: 'ثوب إماراتي',
							quantity: 1,
							unitPrice: 500,
							returnReason: 'جودة المنتج أقل من المتوقع',
							condition: 'new',
							returnType: 'refund',
							status: 'pending',
						},
					],
					total: 500,
					status: 'pending',
					refundAmount: 500,
					exchangeAmount: 0,
					storeCreditAmount: 0,
					notes: 'بانتظار فحص المنتج',
				},
				{
					id: 'ret-003',
					returnNumber: 'RET-20231004-003',
					originalInvoiceId: 'inv-002',
					originalInvoiceNumber: 'INV-20231003-002',
					date: '2023-10-04',
					customer: {
						id: 'cust-002',
						name: 'شركة الأفق للتجارة',
						phone: '0112345678',
						email: 'info@alufuq.com',
					},
					items: [
						{
							id: 'ri-003',
							productId: 'prod-006',
							productName: 'بشت شتوي فاخر',
							quantity: 2,
							unitPrice: 1200,
							returnReason: 'عيب في التصنيع',
							condition: 'damaged',
							returnType: 'refund',
							status: 'approved',
						},
					],
					total: 2400,
					status: 'completed',
					refundAmount: 2400,
					exchangeAmount: 0,
					storeCreditAmount: 0,
					processedBy: 'محمد السالم',
					processedDate: '2023-10-05',
					notes: 'تم إرجاع المبلغ للعميل بالكامل بعد التأكد من وجود عيب مصنعي',
				},
				{
					id: 'ret-004',
					returnNumber: 'RET-20231007-004',
					originalInvoiceId: 'inv-005',
					originalInvoiceNumber: 'INV-20231006-005',
					date: '2023-10-07',
					customer: {
						id: 'cust-005',
						name: 'محمد العنزي',
						phone: '0533456789',
					},
					items: [
						{
							id: 'ri-004',
							productId: 'prod-007',
							productName: 'شماغ أبيض',
							quantity: 1,
							unitPrice: 120,
							returnReason: 'المنتج غير مطابق للوصف',
							condition: 'used',
							returnType: 'store_credit',
							status: 'approved',
						},
						{
							id: 'ri-005',
							productId: 'prod-004',
							productName: 'عقال أسود',
							quantity: 1,
							unitPrice: 80,
							returnReason: 'المنتج غير مطابق للوصف',
							condition: 'used',
							returnType: 'store_credit',
							status: 'rejected',
						},
					],
					total: 200,
					status: 'partially_approved',
					refundAmount: 0,
					exchangeAmount: 0,
					storeCreditAmount: 120,
					processedBy: 'خالد المالكي',
					processedDate: '2023-10-07',
					notes: 'تمت الموافقة على إرجاع الشماغ فقط، العقال كان مستعملاً بشكل واضح',
				},
				{
					id: 'ret-005',
					returnNumber: 'RET-20231008-005',
					originalInvoiceId: 'inv-006',
					originalInvoiceNumber: 'INV-20231002-006',
					date: '2023-10-08',
					customer: {
						id: 'cust-006',
						name: 'خالد المالكي',
						phone: '0512345678',
					},
					items: [
						{
							id: 'ri-006',
							productId: 'prod-001',
							productName: 'ثوب كلاسيك',
							quantity: 1,
							unitPrice: 450,
							returnReason: 'تغيير رأي العميل',
							condition: 'used',
							returnType: 'refund',
							status: 'rejected',
						},
					],
					total: 450,
					status: 'rejected',
					refundAmount: 0,
					exchangeAmount: 0,
					storeCreditAmount: 0,
					processedBy: 'فهد العتيبي',
					processedDate: '2023-10-08',
					notes: 'المنتج مستعمل ويوجد به آثار ارتداء، وسبب الإرجاع غير مقبول حسب سياسة الإرجاع',
				},
				{
					id: 'ret-006',
					returnNumber: 'RET-20231009-006',
					originalInvoiceId: 'inv-004',
					originalInvoiceNumber: 'INV-20230925-004',
					date: '2023-10-09',
					customer: {
						id: 'cust-004',
						name: 'سعيد الزهراني',
						phone: '0562345678',
						email: 'saeed@example.com',
					},
					items: [
						{
							id: 'ri-007',
							productId: 'prod-009',
							productName: 'ثوب مغربي',
							quantity: 1,
							unitPrice: 550,
							returnReason: 'استلمت منتج خاطئ',
							condition: 'new',
							returnType: 'exchange',
							status: 'pending',
						},
					],
					total: 550,
					status: 'pending',
					refundAmount: 0,
					exchangeAmount: 550,
					storeCreditAmount: 0,
				},
				{
					id: 'ret-007',
					returnNumber: 'RET-20231010-007',
					originalInvoiceId: 'inv-005',
					originalInvoiceNumber: 'INV-20231006-005',
					date: '2023-10-10',
					customer: {
						id: 'cust-005',
						name: 'محمد العنزي',
						phone: '0533456789',
					},
					items: [
						{
							id: 'ri-008',
							productId: 'prod-004',
							productName: 'عقال أسود',
							quantity: 1,
							unitPrice: 80,
							returnReason: 'المنتج معيب',
							condition: 'damaged',
							returnType: 'refund',
							status: 'approved',
						},
					],
					total: 80,
					status: 'completed',
					refundAmount: 80,
					exchangeAmount: 0,
					storeCreditAmount: 0,
					processedBy: 'محمد السالم',
					processedDate: '2023-10-10',
					notes: 'تم فحص المنتج وتأكيد وجود عيب مصنعي وتم إرجاع المبلغ للعميل',
				},
			];

			// حساب الإحصائيات
			const totalReturns = mockReturns.length;
			const pendingReturns = mockReturns.filter((r) => r.status === 'pending').length;
			const approvedReturns = mockReturns.filter((r) =>
				['approved', 'partially_approved', 'completed'].includes(r.status)
			).length;

			const refundAmount = mockReturns.reduce((sum, r) => sum + r.refundAmount, 0);
			const exchangeAmount = mockReturns.reduce((sum, r) => sum + r.exchangeAmount, 0);

			// تجميع أسباب الإرجاع
			const reasonsMap = new Map<string, number>();
			mockReturns.forEach((r) => {
				r.items.forEach((item) => {
					const currentCount = reasonsMap.get(item.returnReason) || 0;
					reasonsMap.set(item.returnReason, currentCount + 1);
				});
			});

			const totalReturnItems = mockReturns.reduce((sum, r) => sum + r.items.length, 0);

			// تحويل أسباب الإرجاع إلى مصفوفة وترتيبها
			const topReturnReasons = Array.from(reasonsMap.entries())
				.map(([reason, count]) => ({
					reason,
					count,
					percentage: (count / totalReturnItems) * 100,
				}))
				.sort((a, b) => b.count - a.count)
				.slice(0, 5);

			const statsData: ReturnStats = {
				totalReturns,
				pendingReturns,
				approvedReturns,
				refundAmount,
				exchangeAmount,
				topReturnReasons,
			};

			setReturns(mockReturns);
			setFilteredReturns(mockReturns);
			setStats(statsData);

			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let result = [...returns];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(ret) =>
					ret.returnNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
					ret.originalInvoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
					ret.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					ret.customer.phone.includes(searchTerm)
			);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			result = result.filter((ret) => ret.status === statusFilter);
		}

		// تطبيق فلتر نوع الإرجاع
		if (typeFilter !== 'all') {
			result = result.filter((ret) => ret.items.some((item) => item.returnType === typeFilter));
		}

		// تطبيق فلتر التاريخ
		if (dateFilter !== 'all') {
			const today = new Date();
			const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

			if (dateFilter === 'today') {
				result = result.filter((ret) => {
					const returnDate = new Date(ret.date);
					return (
						returnDate.getTime() >= startOfToday.getTime() &&
						returnDate.getTime() < startOfToday.getTime() + 86400000
					);
				});
			} else if (dateFilter === 'week') {
				const weekAgo = new Date(startOfToday.getTime() - 7 * 86400000);
				result = result.filter((ret) => {
					const returnDate = new Date(ret.date);
					return returnDate.getTime() >= weekAgo.getTime();
				});
			} else if (dateFilter === 'month') {
				const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
				result = result.filter((ret) => {
					const returnDate = new Date(ret.date);
					return returnDate.getTime() >= monthAgo.getTime();
				});
			}
		}

		setFilteredReturns(result);
		setCurrentPage(1); // إعادة تعيين الصفحة الحالية عند تغيير الفلاتر
	}, [searchTerm, statusFilter, typeFilter, dateFilter, returns]);

	// توسيع/طي تفاصيل المرتجع
	const toggleReturnExpand = (returnId: string) => {
		if (expandedReturn === returnId) {
			setExpandedReturn(null);
		} else {
			setExpandedReturn(returnId);
		}
	};

	// عرض حالة المرتجع
	const renderStatusBadge = (status: string) => {
		switch (status) {
			case 'pending':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
						قيد المراجعة
					</span>
				);
			case 'approved':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						تمت الموافقة
					</span>
				);
			case 'partially_approved':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						موافقة جزئية
					</span>
				);
			case 'rejected':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						مرفوض
					</span>
				);
			case 'completed':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
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

	// عرض نوع الإرجاع

	// عرض نوع الإرجاع
	const renderReturnTypeBadge = (type: string) => {
		switch (type) {
			case 'refund':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						استرداد نقدي
					</span>
				);
			case 'exchange':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						استبدال
					</span>
				);
			case 'store_credit':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						رصيد بالمتجر
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

	// عرض حالة المنتج
	const renderConditionBadge = (condition: string) => {
		switch (condition) {
			case 'new':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						جديد
					</span>
				);
			case 'used':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
						مستعمل
					</span>
				);
			case 'damaged':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						تالف
					</span>
				);
			default:
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						{condition}
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

	// حساب صفحات الترقيم
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredReturns.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);

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
						<RefreshCw className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						المرتجعات
					</h1>
					<p className='mt-1 text-gray-500'>إدارة طلبات إرجاع واستبدال المنتجات</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/sales/invoices'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<FileText className='ml-1 h-4 w-4' />
						الفواتير
					</Link>
					<Link
						href='/dashboard/sales/returns/new'
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						<Plus className='ml-1 h-4 w-4' />
						طلب إرجاع جديد
					</Link>
				</div>
			</div>

			{/* بطاقات الإحصائيات */}
			{stats && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>إجمالي المرتجعات</p>
								<p className='text-2xl font-bold text-gray-900'>{stats.totalReturns}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
								<RefreshCw className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 flex items-center'>
							<div className='flex-1 bg-gray-200 rounded-full h-2'>
								<div
									className='bg-indigo-500 h-2 rounded-full'
									style={{
										width: `${(stats.approvedReturns / stats.totalReturns) * 100}%`,
									}}
								></div>
							</div>
							<span className='text-xs text-gray-500 mr-2'>
								{Math.round((stats.approvedReturns / stats.totalReturns) * 100)}% مقبول
							</span>
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>مرتجعات قيد المراجعة</p>
								<p className='text-2xl font-bold text-amber-600'>{stats.pendingReturns}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
								<Clock className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>تحتاج إلى مراجعة وإجراء</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>إجمالي الاسترداد النقدي</p>
								<p className='text-2xl font-bold text-red-600'>
									{stats.refundAmount.toLocaleString()} ر.س
								</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600'>
								<DollarSign className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>مجموع المبالغ المستردة للعملاء</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>إجمالي الاستبدال</p>
								<p className='text-2xl font-bold text-blue-600'>
									{stats.exchangeAmount.toLocaleString()} ر.س
								</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600'>
								<Package className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>مجموع قيمة المنتجات المستبدلة</div>
					</div>
				</div>
			)}

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
							placeholder='بحث عن رقم الإرجاع أو الفاتورة أو العميل...'
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
							<option value='pending'>قيد المراجعة</option>
							<option value='approved'>تمت الموافقة</option>
							<option value='partially_approved'>موافقة جزئية</option>
							<option value='rejected'>مرفوض</option>
							<option value='completed'>مكتمل</option>
							<option value='canceled'>ملغي</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر نوع الإرجاع */}
					<div className='relative'>
						<select
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع أنواع الإرجاع</option>
							<option value='refund'>استرداد نقدي</option>
							<option value='exchange'>استبدال</option>
							<option value='store_credit'>رصيد بالمتجر</option>
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
							عرض {filteredReturns.length} من {returns.length} طلب إرجاع
						</span>

						{(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setStatusFilter('all');
									setTypeFilter('all');
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

			{/* قائمة المرتجعات */}
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
										رقم الإرجاع
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الفاتورة الأصلية
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
										المبلغ
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										نوع الإرجاع
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
								{currentItems.map((returnItem) => (
									<tr key={returnItem.id} className='hover:bg-gray-50'>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600'>
											<button
												onClick={() => toggleReturnExpand(returnItem.id)}
												className='hover:underline focus:outline-none'
											>
												{returnItem.returnNumber}
											</button>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											<Link
												href={`/dashboard/sales/invoices/${returnItem.originalInvoiceId}`}
												className='text-indigo-600 hover:underline'
											>
												{returnItem.originalInvoiceNumber}
											</Link>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm font-medium text-gray-900'>
												{returnItem.customer.name}
											</div>
											<div className='text-xs text-gray-500'>{returnItem.customer.phone}</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{formatDate(returnItem.date)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium'>
											{returnItem.total.toLocaleString()} ر.س
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{returnItem.refundAmount > 0 && (
												<div className='mb-1'>{renderReturnTypeBadge('refund')}</div>
											)}
											{returnItem.exchangeAmount > 0 && (
												<div className='mb-1'>{renderReturnTypeBadge('exchange')}</div>
											)}
											{returnItem.storeCreditAmount > 0 && (
												<div>{renderReturnTypeBadge('store_credit')}</div>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{renderStatusBadge(returnItem.status)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
											<div className='flex items-center justify-center space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/sales/returns/${returnItem.id}`}
													className='text-indigo-600 hover:text-indigo-900'
													title='عرض التفاصيل'
												>
													<Eye className='h-5 w-5' />
												</Link>
												{returnItem.status === 'pending' && (
													<Link
														href={`/dashboard/sales/returns/${returnItem.id}/review`}
														className='text-green-600 hover:text-green-900'
														title='مراجعة الطلب'
													>
														<Check className='h-5 w-5' />
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
															href={`/dashboard/sales/returns/${returnItem.id}`}
															className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
														>
															<Eye className='inline ml-1 h-4 w-4' />
															عرض التفاصيل
														</Link>
														{returnItem.status === 'pending' && (
															<>
																<button className='block w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-green-50'>
																	<Check className='inline ml-1 h-4 w-4' />
																	قبول الطلب
																</button>
																<button className='block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50'>
																	<X className='inline ml-1 h-4 w-4' />
																	رفض الطلب
																</button>
															</>
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

					{/* تفاصيل المرتجع الموسعة */}
					{expandedReturn && (
						<div className='border-t border-gray-200 bg-gray-50 p-4 animate-fadeIn'>
							{returns
								.filter((ret) => ret.id === expandedReturn)
								.map((returnItem) => (
									<div key={`details-${returnItem.id}`}>
										<div className='flex justify-between items-center mb-4'>
											<h3 className='text-lg font-medium text-gray-900'>
												تفاصيل الإرجاع #{returnItem.returnNumber}
											</h3>
											<button
												onClick={() => setExpandedReturn(null)}
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
														{returnItem.customer.name}
													</p>
													<p className='text-sm text-gray-500'>{returnItem.customer.phone}</p>
													{returnItem.customer.email && (
														<p className='text-sm text-gray-500'>
															{returnItem.customer.email}
														</p>
													)}
												</div>
											</div>

											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													معلومات الإرجاع
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-2 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>تاريخ الإرجاع:</p>
															<p className='font-medium text-gray-900'>
																{formatDate(returnItem.date)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>الفاتورة الأصلية:</p>
															<p className='font-medium text-indigo-600'>
																<Link
																	href={`/dashboard/sales/invoices/${returnItem.originalInvoiceId}`}
																	className='hover:underline'
																>
																	{returnItem.originalInvoiceNumber}
																</Link>
															</p>
														</div>
														<div>
															<p className='text-gray-500'>حالة الطلب:</p>
															<div>{renderStatusBadge(returnItem.status)}</div>
														</div>
														<div>
															<p className='text-gray-500'>معالج بواسطة:</p>
															<p className='font-medium text-gray-900'>
																{returnItem.processedBy || 'لم تتم المعالجة بعد'}
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>

										<h4 className='text-sm font-medium text-gray-500 mb-1'>المنتجات المرتجعة</h4>
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
															حالة المنتج
														</th>
														<th
															scope='col'
															className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															نوع الإرجاع
														</th>
														<th
															scope='col'
															className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															الحالة
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
													{returnItem.items.map((item) => (
														<tr key={item.id}>
															<td className='px-4 py-2 text-sm'>
																<div className='font-medium text-gray-900'>
																	{item.productName}
																</div>
																<div className='text-xs text-gray-500'>
																	سبب الإرجاع: {item.returnReason}
																</div>
															</td>
															<td className='px-4 py-2 text-sm text-gray-500 text-center'>
																{item.quantity}
															</td>
															<td className='px-4 py-2 text-sm text-gray-500 text-center'>
																{item.unitPrice.toLocaleString()} ر.س
															</td>
															<td className='px-4 py-2 text-sm text-center'>
																{renderConditionBadge(item.condition)}
															</td>
															<td className='px-4 py-2 text-sm text-center'>
																{renderReturnTypeBadge(item.returnType)}
															</td>
															<td className='px-4 py-2 text-sm text-center'>
																{renderStatusBadge(item.status)}
															</td>
															<td className='px-4 py-2 text-sm font-medium text-gray-900 text-left'>
																{(item.unitPrice * item.quantity).toLocaleString()} ر.س
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div>

										<div className='flex flex-col md:flex-row gap-4'>
											<div className='flex-1'>
												{returnItem.notes && (
													<div>
														<h4 className='text-sm font-medium text-gray-500 mb-1'>
															ملاحظات
														</h4>
														<div className='bg-white p-3 rounded-md border border-gray-200 text-sm text-gray-600'>
															{returnItem.notes}
														</div>
													</div>
												)}
											</div>

											<div className='md:w-80'>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>ملخص الإرجاع</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='space-y-1 text-sm'>
														<div className='flex justify-between'>
															<span className='text-gray-500'>إجمالي المبلغ:</span>
															<span className='text-gray-900'>
																{returnItem.total.toLocaleString()} ر.س
															</span>
														</div>
														{returnItem.refundAmount > 0 && (
															<div className='flex justify-between'>
																<span className='text-gray-500'>المبلغ المسترد:</span>
																<span className='text-red-600'>
																	{returnItem.refundAmount.toLocaleString()} ر.س
																</span>
															</div>
														)}
														{returnItem.exchangeAmount > 0 && (
															<div className='flex justify-between'>
																<span className='text-gray-500'>مبلغ الاستبدال:</span>
																<span className='text-blue-600'>
																	{returnItem.exchangeAmount.toLocaleString()} ر.س
																</span>
															</div>
														)}
														{returnItem.storeCreditAmount > 0 && (
															<div className='flex justify-between'>
																<span className='text-gray-500'>رصيد بالمتجر:</span>
																<span className='text-green-600'>
																	{returnItem.storeCreditAmount.toLocaleString()} ر.س
																</span>
															</div>
														)}
													</div>
												</div>
											</div>
										</div>

										{/* إجراءات الإرجاع */}
										<div className='mt-4 flex flex-wrap gap-2'>
											<Link
												href={`/dashboard/sales/returns/${returnItem.id}`}
												className='px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center'
											>
												<Eye className='ml-1 h-4 w-4' />
												عرض التفاصيل الكاملة
											</Link>
											<button className='px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center'>
												<Printer className='ml-1 h-4 w-4' />
												طباعة
											</button>
											{returnItem.status === 'pending' && (
												<>
													<button className='px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center'>
														<Check className='ml-1 h-4 w-4' />
														قبول الطلب
													</button>
													<button className='px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center'>
														<X className='ml-1 h-4 w-4' />
														رفض الطلب
													</button>
												</>
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
										{Math.min(indexOfLastItem, filteredReturns.length)}
									</span>{' '}
									من أصل <span className='font-medium'>{filteredReturns.length}</span> طلب إرجاع
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
					<RefreshCw className='h-12 w-12 text-gray-300 mx-auto mb-3' />
					<h3 className='text-lg font-medium text-gray-900'>لا توجد طلبات إرجاع</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all'
							? 'لم يتم العثور على طلبات إرجاع تطابق معايير البحث المحددة'
							: 'لا توجد طلبات إرجاع مسجلة في النظام. قم بإنشاء طلب إرجاع جديد للبدء.'}
					</p>
					<div className='mt-4'>
						<Link
							href='/dashboard/sales/returns/new'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
						>
							<Plus className='ml-1 h-4 w-4' />
							إنشاء طلب إرجاع جديد
						</Link>
					</div>
				</div>
			)}

			{/* أسباب الإرجاع الأكثر شيوعاً */}
			{stats && stats.topReturnReasons.length > 0 && (
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-lg font-medium text-gray-900'>أسباب الإرجاع الأكثر شيوعاً</h2>
						<Link
							href='/dashboard/sales/returns/reports'
							className='text-sm text-indigo-600 hover:text-indigo-800 flex items-center'
						>
							<BarChart2 className='ml-1 h-4 w-4' />
							عرض التقارير المفصلة
						</Link>
					</div>

					<div className='space-y-3'>
						{stats.topReturnReasons.map((reason, index) => (
							<div key={index} className='flex items-center space-x-4 space-x-reverse'>
								<div className='w-36 text-sm text-gray-600 truncate'>{reason.reason}</div>
								<div className='flex-1'>
									<div className='flex items-center'>
										<div className='flex-1 bg-gray-200 rounded-full h-2.5'>
											<div
												className='bg-red-500 h-2.5 rounded-full'
												style={{ width: `${reason.percentage * 2}%` }}
											></div>
										</div>
										<span className='text-xs text-gray-500 mr-2 w-16'>
											{reason.percentage.toFixed(1)}%
										</span>
										<span className='text-xs text-gray-400 w-8'>({reason.count})</span>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className='mt-4 text-sm text-gray-500'>
						تحليل أسباب الإرجاع يساعد في تحسين جودة المنتجات وتقليل نسبة المرتجعات
					</div>
				</div>
			)}

			{/* روابط سريعة */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<Link
					href='/dashboard/sales/returns/policy'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
						<FileText className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>سياسة الإرجاع</h3>
						<p className='text-sm text-gray-500'>عرض وتعديل سياسة الإرجاع والاستبدال</p>
					</div>
				</Link>

				<Link
					href='/dashboard/sales/returns/new'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
						<Plus className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>طلب إرجاع جديد</h3>
						<p className='text-sm text-gray-500'>إنشاء طلب إرجاع أو استبدال جديد</p>
					</div>
				</Link>

				<Link
					href='/dashboard/sales/returns/reports'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
						<BarChart2 className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>تقارير المرتجعات</h3>
						<p className='text-sm text-gray-500'>تحليل المرتجعات وأسباب الإرجاع</p>
					</div>
				</Link>
			</div>
		</div>
	);
}
