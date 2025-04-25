// app/dashboard/inventory/purchases/page.tsx
'use client';

import { format } from 'date-fns';
import {
	AlertTriangle,
	Calendar,
	Check,
	ChevronLeft,
	ChevronRight,
	Clock,
	Download,
	File,
	FileText,
	Filter,
	Package,
	Plus,
	RefreshCw,
	Search,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { DateRange } from 'react-day-picker';
import DateRangePicker from '../../../../components/DateRangePicker'; // افتراضي: مكون منتقي نطاق التاريخ

// نوع بيانات عملية الشراء
interface Purchase {
	id: string;
	invoiceNumber: string;
	date: Date;
	supplierId: string;
	supplierName: string;
	supplierLogo?: string;
	totalAmount: number;
	paymentStatus: 'paid' | 'pending' | 'partially-paid' | 'overdue' | 'cancelled';
	items: number;
}

// نوع بيانات المورد
interface Supplier {
	id: string;
	name: string;
	logo?: string;
}

// نوع تصفية البيانات
interface Filters {
	search: string;
	dateRange: DateRange | undefined;
	status: string;
	supplierId: string;
	sortBy: 'date' | 'amount' | 'invoice';
	sortOrder: 'asc' | 'desc';
}

// حجم الصفحة للتقسيم
const PAGE_SIZE = 10;

export default function PurchasesPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// استخراج المعلمات من عنوان URL
	const supplierIdParam = searchParams.get('supplier_id');
	const searchParam = searchParams.get('search');
	const statusParam = searchParams.get('status');

	// حالة التطبيق
	const [purchases, setPurchases] = useState<Purchase[]>([]);
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [filters, setFilters] = useState<Filters>({
		search: searchParam || '',
		dateRange: undefined,
		status: statusParam || 'all',
		supplierId: supplierIdParam || 'all',
		sortBy: 'date',
		sortOrder: 'desc',
	});
	const [currentPage, setCurrentPage] = useState(1);
	const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

	// جلب البيانات
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// جلب بيانات المورّدين
				await new Promise((resolve) => setTimeout(resolve, 300));
				const mockSuppliers: Supplier[] = [
					{ id: 's1', name: 'شركة النسيج العالمية', logo: '/images/suppliers/textile-global-logo.png' },
					{ id: 's2', name: 'مصنع الأقمشة الفاخرة' },
					{ id: 's3', name: 'مؤسسة الخليج للمنسوجات' },
					{ id: 's4', name: 'شركة الحرير الذهبي' },
				];
				setSuppliers(mockSuppliers);

				// جلب بيانات عمليات الشراء (في التطبيق الحقيقي، سيكون هذا استدعاء API)
				await new Promise((resolve) => setTimeout(resolve, 500));

				// بيانات تجريبية
				const mockPurchases: Purchase[] = [];

				// إنشاء بيانات تجريبية متنوعة
				for (let i = 1; i <= 25; i++) {
					const supplierId = `s${Math.floor(Math.random() * 4) + 1}`;
					const supplier = mockSuppliers.find((s) => s.id === supplierId);

					// تواريخ متنوعة خلال الأشهر الستة الماضية
					const date = new Date();
					date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
					date.setDate(Math.floor(Math.random() * 28) + 1);

					// حالات دفع متنوعة
					const statuses: Purchase['paymentStatus'][] = [
						'paid',
						'pending',
						'partially-paid',
						'overdue',
						'cancelled',
					];
					const status = statuses[Math.floor(Math.random() * statuses.length)];

					// مبالغ متنوعة
					const amount = Math.floor(Math.random() * 10000) + 1000;

					// عدد العناصر
					const items = Math.floor(Math.random() * 10) + 1;

					mockPurchases.push({
						id: `p${i}`,
						invoiceNumber: `INV-${date.getFullYear()}-${1000 + i}`,
						date,
						supplierId,
						supplierName: supplier?.name || 'مورّد غير معروف',
						supplierLogo: supplier?.logo,
						totalAmount: amount,
						paymentStatus: status,
						items,
					});
				}

				setPurchases(mockPurchases);
			} catch (err) {
				console.error('Error fetching data:', err);
				setError('حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [supplierIdParam, searchParam, statusParam]);

	// تصفية وترتيب البيانات
	const filteredPurchases = useMemo(() => {
		return purchases
			.filter((purchase) => {
				// تصفية بواسطة المورّد
				if (filters.supplierId !== 'all' && purchase.supplierId !== filters.supplierId) {
					return false;
				}

				// تصفية بواسطة نص البحث
				if (filters.search) {
					const searchLower = filters.search.toLowerCase();
					if (
						!purchase.invoiceNumber.toLowerCase().includes(searchLower) &&
						!purchase.supplierName.toLowerCase().includes(searchLower)
					) {
						return false;
					}
				}

				// تصفية بواسطة حالة الدفع
				if (filters.status !== 'all' && purchase.paymentStatus !== filters.status) {
					return false;
				}

				// تصفية بواسطة نطاق التاريخ
				if (filters.dateRange?.from && filters.dateRange?.to) {
					const purchaseDate = new Date(purchase.date);
					return purchaseDate >= filters.dateRange.from && purchaseDate <= filters.dateRange.to;
				}

				return true;
			})
			.sort((a, b) => {
				// الترتيب
				if (filters.sortBy === 'date') {
					return filters.sortOrder === 'asc'
						? a.date.getTime() - b.date.getTime()
						: b.date.getTime() - a.date.getTime();
				} else if (filters.sortBy === 'amount') {
					return filters.sortOrder === 'asc' ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount;
				} else if (filters.sortBy === 'invoice') {
					return filters.sortOrder === 'asc'
						? a.invoiceNumber.localeCompare(b.invoiceNumber)
						: b.invoiceNumber.localeCompare(a.invoiceNumber);
				}
				return 0;
			});
	}, [purchases, filters]);

	// حساب إجمالي الصفحات
	const totalPages = Math.ceil(filteredPurchases.length / PAGE_SIZE);

	// الحصول على العناصر للصفحة الحالية
	const currentItems = useMemo(() => {
		const startIndex = (currentPage - 1) * PAGE_SIZE;
		return filteredPurchases.slice(startIndex, startIndex + PAGE_SIZE);
	}, [filteredPurchases, currentPage]);

	// تغيير الصفحة
	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	// تحديث عوامل التصفية
	const updateFilters = (newFilters: Partial<Filters>) => {
		setFilters((prev) => ({ ...prev, ...newFilters }));
		setCurrentPage(1); // إعادة التعيين إلى الصفحة الأولى عند تغيير عوامل التصفية
	};

	// تبديل اتجاه الترتيب
	const toggleSortOrder = (sortBy: Filters['sortBy']) => {
		if (filters.sortBy === sortBy) {
			updateFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' });
		} else {
			updateFilters({ sortBy, sortOrder: 'desc' });
		}
	};

	// إعادة تعيين عوامل التصفية
	const resetFilters = () => {
		setFilters({
			search: '',
			dateRange: undefined,
			status: 'all',
			supplierId: 'all',
			sortBy: 'date',
			sortOrder: 'desc',
		});
		setCurrentPage(1);

		// إعادة توجيه إلى URL أساسي بدون معلمات
		router.push('/dashboard/inventory/purchases');
	};

	// حالة الدفع
	const PaymentStatusBadge = ({ status }: { status: Purchase['paymentStatus'] }) => {
		const statusConfig = {
			paid: {
				color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
				icon: <Check className='h-3 w-3 ml-1' />,
				label: 'مدفوع',
			},
			pending: {
				color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
				icon: <Clock className='h-3 w-3 ml-1' />,
				label: 'بانتظار الدفع',
			},
			'partially-paid': {
				color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
				icon: <AlertTriangle className='h-3 w-3 ml-1' />,
				label: 'مدفوع جزئيًا',
			},
			overdue: {
				color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
				icon: <AlertTriangle className='h-3 w-3 ml-1' />,
				label: 'متأخر',
			},
			cancelled: {
				color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
				icon: <AlertTriangle className='h-3 w-3 ml-1' />,
				label: 'ملغي',
			},
		};

		const config = statusConfig[status];

		return (
			<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
				{config.icon}
				{config.label}
			</span>
		);
	};

	// حساب إجمالي المشتريات
	const totalPurchaseAmount = useMemo(() => {
		return filteredPurchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);
	}, [filteredPurchases]);

	// حساب عدد العناصر لكل حالة دفع
	const statusCounts = useMemo(() => {
		const counts = {
			all: filteredPurchases.length,
			paid: 0,
			pending: 0,
			'partially-paid': 0,
			overdue: 0,
			cancelled: 0,
		};

		filteredPurchases.forEach((purchase) => {
			counts[purchase.paymentStatus] += 1;
		});

		return counts;
	}, [filteredPurchases]);

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4'>
				<div>
					<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>سجل المشتريات</h1>
					<p className='text-gray-500 dark:text-gray-400 text-sm'>إدارة ومتابعة عمليات الشراء من الموردين</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<button
						onClick={() => window.print()}
						className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
					>
						<Download className='ml-1.5 -mr-1 h-4 w-4' />
						تصدير
					</button>

					<Link
						href='/dashboard/inventory/purchases/new'
						className='inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
					>
						<Plus className='ml-1.5 -mr-1 h-4 w-4' />
						إضافة عملية شراء
					</Link>
				</div>
			</div>

			{/* إحصائيات سريعة */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-4'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-xs text-gray-500 dark:text-gray-400'>إجمالي المشتريات</p>
							<p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
								{totalPurchaseAmount.toLocaleString()} ر.س
							</p>
						</div>
						<div className='h-10 w-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center'>
							<FileText className='h-5 w-5 text-primary-600 dark:text-primary-400' />
						</div>
					</div>
				</div>

				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-4'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-xs text-gray-500 dark:text-gray-400'>عدد الفواتير</p>
							<p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
								{filteredPurchases.length}
							</p>
						</div>
						<div className='h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center'>
							<File className='h-5 w-5 text-blue-600 dark:text-blue-400' />
						</div>
					</div>
				</div>

				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-4'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-xs text-gray-500 dark:text-gray-400'>قيد الانتظار</p>
							<p className='text-xl font-bold text-gray-900 dark:text-gray-100'>{statusCounts.pending}</p>
						</div>
						<div className='h-10 w-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center'>
							<Clock className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />
						</div>
					</div>
				</div>

				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-4'>
					<div className='flex items-center justify-between'>
						<div>
							<p className='text-xs text-gray-500 dark:text-gray-400'>الموردين</p>
							<p className='text-xl font-bold text-gray-900 dark:text-gray-100'>{suppliers.length}</p>
						</div>
						<div className='h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center'>
							<Package className='h-5 w-5 text-purple-600 dark:text-purple-400' />
						</div>
					</div>
				</div>
			</div>

			{/* أدوات البحث والتصفية */}
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-4'>
				<div className='flex flex-col sm:flex-row gap-4'>
					<div className='relative flex-1'>
						<input
							type='text'
							placeholder='بحث برقم الفاتورة أو اسم المورد...'
							value={filters.search}
							onChange={(e) => updateFilters({ search: e.target.value })}
							className='block w-full py-2 px-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
						/>
						<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500' />
					</div>

					<div className='flex gap-2 flex-wrap'>
						<button
							onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
							className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
						>
							<Filter className='ml-1.5 -mr-1 h-4 w-4' />
							تصفية
							{(filters.status !== 'all' || filters.supplierId !== 'all' || filters.dateRange) && (
								<span className='mr-1 text-xs bg-primary text-white rounded-full w-4 h-4 flex items-center justify-center'>
									{(filters.status !== 'all' ? 1 : 0) +
										(filters.supplierId !== 'all' ? 1 : 0) +
										(filters.dateRange ? 1 : 0)}
								</span>
							)}
						</button>

						{(filters.status !== 'all' ||
							filters.supplierId !== 'all' ||
							filters.dateRange ||
							filters.search) && (
							<button
								onClick={resetFilters}
								className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
							>
								<RefreshCw className='ml-1.5 -mr-1 h-4 w-4' />
								إعادة ضبط
							</button>
						)}
					</div>
				</div>

				{/* قائمة عوامل التصفية */}
				{isFilterMenuOpen && (
					<div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
								حالة الدفع
							</label>
							<select
								value={filters.status}
								onChange={(e) => updateFilters({ status: e.target.value })}
								className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
							>
								<option value='all'>جميع الحالات ({statusCounts.all})</option>
								<option value='paid'>مدفوع ({statusCounts.paid})</option>
								<option value='pending'>بانتظار الدفع ({statusCounts.pending})</option>
								<option value='partially-paid'>مدفوع جزئيًا ({statusCounts['partially-paid']})</option>
								<option value='overdue'>متأخر ({statusCounts.overdue})</option>
								<option value='cancelled'>ملغي ({statusCounts.cancelled})</option>
							</select>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
								المورد
							</label>
							<select
								value={filters.supplierId}
								onChange={(e) => updateFilters({ supplierId: e.target.value })}
								className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
							>
								<option value='all'>جميع الموردين</option>
								{suppliers.map((supplier) => (
									<option key={supplier.id} value={supplier.id}>
										{supplier.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
								نطاق التاريخ
							</label>
							<DateRangePicker
								value={filters.dateRange}
								onChange={(range: DateRange | undefined) => updateFilters({ dateRange: range })}
								locale='ar'
								placeholder='اختر نطاق التاريخ'
							/>
						</div>
					</div>
				)}
			</div>

			{/* جدول المشتريات */}
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
				{loading ? (
					<div className='flex justify-center items-center h-64'>
						<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'></div>
						<span className='mr-2 text-gray-700 dark:text-gray-300'>جاري تحميل البيانات...</span>
					</div>
				) : error ? (
					<div className='p-4 text-center text-red-500 dark:text-red-400'>{error}</div>
				) : currentItems.length === 0 ? (
					<div className='p-8 text-center'>
						<div className='inline-flex items-center justify-center h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4'>
							<File className='h-8 w-8 text-gray-400 dark:text-gray-500' />
						</div>
						<h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-1'>لا توجد مشتريات</h3>
						<p className='text-gray-500 dark:text-gray-400 mb-4'>
							{filters.search ||
							filters.status !== 'all' ||
							filters.supplierId !== 'all' ||
							filters.dateRange
								? 'لا توجد نتائج مطابقة لمعايير البحث الحالية.'
								: 'لم يتم تسجيل أي عمليات شراء بعد.'}
						</p>
						{filters.search ||
						filters.status !== 'all' ||
						filters.supplierId !== 'all' ||
						filters.dateRange ? (
							<button
								onClick={resetFilters}
								className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
							>
								<RefreshCw className='ml-2 -mr-1 h-5 w-5' />
								إعادة ضبط عوامل التصفية
							</button>
						) : (
							<Link
								href='/dashboard/inventory/purchases/new'
								className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
							>
								<Plus className='ml-2 -mr-1 h-5 w-5' />
								إضافة عملية شراء
							</Link>
						)}
					</div>
				) : (
					<>
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
								<thead className='bg-gray-50 dark:bg-gray-700'>
									<tr>
										<th
											scope='col'
											className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
										>
											<button
												onClick={() => toggleSortOrder('invoice')}
												className='flex items-center focus:outline-none'
											>
												رقم الفاتورة
												{filters.sortBy === 'invoice' && (
													<span className='mr-1'>
														{filters.sortOrder === 'asc' ? '↑' : '↓'}
													</span>
												)}
											</button>
										</th>
										<th
											scope='col'
											className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
										>
											<button
												onClick={() => toggleSortOrder('date')}
												className='flex items-center focus:outline-none'
											>
												التاريخ
												{filters.sortBy === 'date' && (
													<span className='mr-1'>
														{filters.sortOrder === 'asc' ? '↑' : '↓'}
													</span>
												)}
											</button>
										</th>
										<th
											scope='col'
											className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
										>
											المورد
										</th>
										<th
											scope='col'
											className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
										>
											<button
												onClick={() => toggleSortOrder('amount')}
												className='flex items-center focus:outline-none'
											>
												المبلغ
												{filters.sortBy === 'amount' && (
													<span className='mr-1'>
														{filters.sortOrder === 'asc' ? '↑' : '↓'}
													</span>
												)}
											</button>
										</th>
										<th
											scope='col'
											className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
										>
											حالة الدفع
										</th>
										<th
											scope='col'
											className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
										>
											العناصر
										</th>
									</tr>
								</thead>
								<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
									{currentItems.map((purchase) => (
										<tr key={purchase.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
											<td className='px-4 py-4 whitespace-nowrap'>
												<Link
													href={`/dashboard/inventory/purchases/${purchase.id}`}
													className='text-primary dark:text-primary-light hover:underline font-medium'
												>
													{purchase.invoiceNumber}
												</Link>
											</td>
											<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
												<div className='flex items-center'>
													<Calendar className='h-4 w-4 ml-1.5 text-gray-400' />
													{format(new Date(purchase.date), 'dd/MM/yyyy')}
												</div>
											</td>
											<td className='px-4 py-4 whitespace-nowrap'>
												<div className='flex items-center'>
													{purchase.supplierLogo ? (
														<div className='h-8 w-8 rounded-md overflow-hidden flex-shrink-0 relative bg-gray-100 dark:bg-gray-700'>
															<Image
																src={purchase.supplierLogo}
																alt={purchase.supplierName}
																fill
																sizes='32px'
																className='object-contain'
															/>
														</div>
													) : (
														<div className='h-8 w-8 rounded-md bg-gray-200 dark:bg-gray-700 flex items-center justify-center'>
															<Package className='h-4 w-4 text-gray-400 dark:text-gray-500' />
														</div>
													)}
													<Link
														href={`/dashboard/suppliers/${purchase.supplierId}`}
														className='mr-2 text-sm text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary-light'
													>
														{purchase.supplierName}
													</Link>
												</div>
											</td>
											<td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100'>
												{purchase.totalAmount.toLocaleString()} ر.س
											</td>
											<td className='px-4 py-4 whitespace-nowrap'>
												<PaymentStatusBadge status={purchase.paymentStatus} />
											</td>
											<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
												{purchase.items} عنصر
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* ترقيم الصفحات */}
						{totalPages > 1 && (
							<div className='bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700'>
								<div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
									<div>
										<p className='text-sm text-gray-700 dark:text-gray-300'>
											عرض <span className='font-medium'>{(currentPage - 1) * PAGE_SIZE + 1}</span>{' '}
											من{' '}
											<span className='font-medium'>
												{Math.min(currentPage * PAGE_SIZE, filteredPurchases.length)}
											</span>{' '}
											من أصل <span className='font-medium'>{filteredPurchases.length}</span> نتيجة
										</p>
									</div>
									<div>
										<nav
											className='inline-flex rounded-md shadow-sm -space-x-px space-x-reverse'
											aria-label='Pagination'
										>
											<button
												onClick={() => handlePageChange(currentPage - 1)}
												disabled={currentPage === 1}
												className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed'
											>
												<span className='sr-only'>السابق</span>
												<ChevronRight className='h-5 w-5' aria-hidden='true' />
											</button>

											{Array.from({ length: totalPages }).map((_, index) => {
												const page = index + 1;
												const isCurrentPage = page === currentPage;

												// عرض الصفحة الأولى، والأخيرة، والصفحات حول الصفحة الحالية
												if (
													page === 1 ||
													page === totalPages ||
													(page >= currentPage - 1 && page <= currentPage + 1)
												) {
													return (
														<button
															key={page}
															onClick={() => handlePageChange(page)}
															className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
																isCurrentPage
																	? 'z-10 bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-500 text-primary-600 dark:text-primary-300'
																	: 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
															}`}
														>
															{page}
														</button>
													);
												}

												// عرض النقاط الثلاث للفجوات
												if (
													(page === 2 && currentPage > 3) ||
													(page === totalPages - 1 && currentPage < totalPages - 2)
												) {
													return (
														<span
															key={page}
															className='relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300'
														>
															...
														</span>
													);
												}

												return null;
											})}

											<button
												onClick={() => handlePageChange(currentPage + 1)}
												disabled={currentPage === totalPages}
												className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed'
											>
												<span className='sr-only'>التالي</span>
												<ChevronLeft className='h-5 w-5' aria-hidden='true' />
											</button>
										</nav>
									</div>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
