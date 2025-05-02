'use client';

import {
	AlertTriangle,
	ArrowLeft,
	BarChart2,
	Check,
	ChevronDown,
	Copy,
	DollarSign,
	DownloadCloud,
	Edit,
	Eye,
	Plus,
	RefreshCw,
	Search,
	Settings,
	ShoppingBag,
	Tag,
	Users,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Coupon {
	id: string;
	code: string;
	description: string;
	type: 'percentage' | 'fixed';
	value: number;
	minOrderValue: number | null;
	maxDiscount: number | null;
	startDate: string;
	endDate: string | null;
	status: 'active' | 'expired' | 'scheduled' | 'disabled';
	usageLimit: number | null;
	usageCount: number;
	restrictions: {
		newCustomersOnly: boolean;
		specificProducts: boolean;
		specificCategories: boolean;
	};
	createdAt: string;
	createdBy: string;
}

interface CouponStats {
	total: number;
	active: number;
	totalRedemptions: number;
	totalDiscountValue: number;
	averageDiscountValue: number;
	topCoupon: {
		code: string;
		usageCount: number;
		discountValue: number;
	};
}

export default function CouponsPage() {
	const [loading, setLoading] = useState(true);
	const [coupons, setCoupons] = useState<Coupon[]>([]);
	const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
	const [stats, setStats] = useState<CouponStats | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [typeFilter, setTypeFilter] = useState('all');
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
	const [showCouponDetails, setShowCouponDetails] = useState(false);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchCouponData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية للكوبونات
			const mockCoupons: Coupon[] = [
				{
					id: 'coup-001',
					code: 'WELCOME20',
					description: 'خصم 20% للعملاء الجدد',
					type: 'percentage',
					value: 20,
					minOrderValue: 200,
					maxDiscount: 100,
					startDate: '2023-09-01',
					endDate: null,
					status: 'active',
					usageLimit: 1,
					usageCount: 85,
					restrictions: {
						newCustomersOnly: true,
						specificProducts: false,
						specificCategories: false,
					},
					createdAt: '2023-09-01',
					createdBy: 'أحمد محمد',
				},
				{
					id: 'coup-002',
					code: 'SUMMER50',
					description: 'خصم 50 ريال على جميع الثياب الصيفية',
					type: 'fixed',
					value: 50,
					minOrderValue: 300,
					maxDiscount: null,
					startDate: '2023-06-01',
					endDate: '2023-08-31',
					status: 'expired',
					usageLimit: null,
					usageCount: 230,
					restrictions: {
						newCustomersOnly: false,
						specificProducts: false,
						specificCategories: true,
					},
					createdAt: '2023-05-25',
					createdBy: 'فاطمة علي',
				},
				{
					id: 'coup-003',
					code: 'PREMIUM15',
					description: 'خصم 15% على الثياب الفاخرة',
					type: 'percentage',
					value: 15,
					minOrderValue: 500,
					maxDiscount: 200,
					startDate: '2023-09-15',
					endDate: '2023-12-31',
					status: 'active',
					usageLimit: null,
					usageCount: 42,
					restrictions: {
						newCustomersOnly: false,
						specificProducts: true,
						specificCategories: false,
					},
					createdAt: '2023-09-10',
					createdBy: 'محمد عبدالله',
				},
				{
					id: 'coup-004',
					code: 'WINTER30',
					description: 'خصم 30% على مجموعة الشتاء الجديدة',
					type: 'percentage',
					value: 30,
					minOrderValue: 400,
					maxDiscount: 150,
					startDate: '2023-12-01',
					endDate: '2024-01-31',
					status: 'scheduled',
					usageLimit: null,
					usageCount: 0,
					restrictions: {
						newCustomersOnly: false,
						specificProducts: false,
						specificCategories: true,
					},
					createdAt: '2023-09-20',
					createdBy: 'أحمد محمد',
				},
				{
					id: 'coup-005',
					code: 'RAMADAN25',
					description: 'خصم 25% بمناسبة شهر رمضان',
					type: 'percentage',
					value: 25,
					minOrderValue: 300,
					maxDiscount: null,
					startDate: '2023-03-23',
					endDate: '2023-04-21',
					status: 'expired',
					usageLimit: null,
					usageCount: 312,
					restrictions: {
						newCustomersOnly: false,
						specificProducts: false,
						specificCategories: false,
					},
					createdAt: '2023-03-15',
					createdBy: 'سارة عمر',
				},
				{
					id: 'coup-006',
					code: 'VIP100',
					description: 'خصم 100 ريال للعملاء المميزين',
					type: 'fixed',
					value: 100,
					minOrderValue: 600,
					maxDiscount: null,
					startDate: '2023-09-10',
					endDate: '2023-10-10',
					status: 'active',
					usageLimit: 1,
					usageCount: 28,
					restrictions: {
						newCustomersOnly: false,
						specificProducts: false,
						specificCategories: false,
					},
					createdAt: '2023-09-08',
					createdBy: 'محمد عبدالله',
				},
				{
					id: 'coup-007',
					code: 'TEST10',
					description: 'كوبون اختباري',
					type: 'percentage',
					value: 10,
					minOrderValue: null,
					maxDiscount: null,
					startDate: '2023-09-01',
					endDate: '2023-09-30',
					status: 'disabled',
					usageLimit: null,
					usageCount: 2,
					restrictions: {
						newCustomersOnly: false,
						specificProducts: false,
						specificCategories: false,
					},
					createdAt: '2023-08-25',
					createdBy: 'فاطمة علي',
				},
			];

			// بيانات تجريبية للإحصائيات
			const mockStats: CouponStats = {
				total: 42,
				active: 18,
				totalRedemptions: 2850,
				totalDiscountValue: 76240,
				averageDiscountValue: 26.75,
				topCoupon: {
					code: 'RAMADAN25',
					usageCount: 312,
					discountValue: 15620,
				},
			};

			setCoupons(mockCoupons);
			setFilteredCoupons(mockCoupons);
			setStats(mockStats);
			setLoading(false);
		};

		fetchCouponData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let filtered = [...coupons];

		// تطبيق فلتر البحث
		if (searchTerm) {
			filtered = filtered.filter(
				(coupon) =>
					coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
					coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			filtered = filtered.filter((coupon) => coupon.status === statusFilter);
		}

		// تطبيق فلتر النوع
		if (typeFilter !== 'all') {
			filtered = filtered.filter((coupon) => coupon.type === typeFilter);
		}

		// تطبيق الترتيب
		filtered.sort((a, b) => {
			let comparison = 0;

			if (sortBy === 'createdAt') {
				comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
			} else if (sortBy === 'value') {
				comparison = a.value - b.value;
			} else if (sortBy === 'usageCount') {
				comparison = a.usageCount - b.usageCount;
			} else if (sortBy === 'code') {
				comparison = a.code.localeCompare(b.code);
			}

			return sortOrder === 'asc' ? comparison : -comparison;
		});

		setFilteredCoupons(filtered);
	}, [coupons, searchTerm, statusFilter, typeFilter, sortBy, sortOrder]);

	// الحصول على شارة حالة الكوبون
	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'active':
				return <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>نشط</span>;
			case 'expired':
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>منتهي</span>;
			case 'scheduled':
				return <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>مجدول</span>;
			case 'disabled':
				return <span className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'>معطل</span>;
			default:
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>{status}</span>;
		}
	};

	// تنسيق القيمة حسب النوع
	const formatValue = (type: string, value: number) => {
		if (type === 'percentage') {
			return `${value}%`;
		} else {
			return `${value} ريال`;
		}
	};

	// تنسيق التاريخ
	const formatDate = (dateStr: string | null) => {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('ar-SA');
	};

	// عرض تفاصيل الكوبون
	const viewCouponDetails = (coupon: Coupon) => {
		setSelectedCoupon(coupon);
		setShowCouponDetails(true);
	};

	// حالة التحميل
	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500'></div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<div className='flex items-center'>
						<Link
							href='/dashboard/marketing'
							className='flex items-center text-gray-500 hover:text-gray-700 ml-4'
						>
							<ArrowLeft className='h-5 w-5' />
							<span className='mr-1 text-sm'>العودة</span>
						</Link>
						<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
							<Tag className='inline-block ml-2 h-6 w-6 text-red-600' />
							كوبونات الخصم
						</h1>
					</div>
					<p className='mt-1 text-sm text-gray-600'>إدارة كوبونات وعروض الخصم</p>
				</div>

				<div className='flex gap-2'>
					<Link
						href='/dashboard/marketing/coupons/new'
						className='px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-red-700'
					>
						<Plus className='ml-1 h-4 w-4' />
						إنشاء كوبون
					</Link>

					<Link
						href='/dashboard/reports/marketing/coupons'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						التقارير
					</Link>

					<Link
						href='/dashboard/marketing/coupons/settings'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Settings className='ml-1 h-4 w-4' />
						الإعدادات
					</Link>
				</div>
			</div>

			{/* ملخص الإحصائيات */}
			{stats && (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>إجمالي الكوبونات</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>{stats.total}</h3>
								<div className='flex items-center text-xs text-gray-500 mt-1'>
									<span className='flex items-center'>
										<span className='h-2 w-2 rounded-full bg-green-500 ml-1'></span>
										نشطة: {stats.active}
									</span>
									<span className='mx-2'>•</span>
									<span className='flex items-center'>
										<span className='h-2 w-2 rounded-full bg-gray-500 ml-1'></span>
										غير نشطة: {stats.total - stats.active}
									</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-red-100'>
								<Tag className='h-6 w-6 text-red-600' />
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>مرات الاستخدام</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>
									{stats.totalRedemptions.toLocaleString()}
								</h3>
								<div className='mt-1 flex items-center'>
									<span className='text-xs text-gray-500'>عدد مرات استخدام جميع الكوبونات</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-red-100'>
								<ShoppingBag className='h-6 w-6 text-red-600' />
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>إجمالي قيمة الخصومات</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>
									{stats.totalDiscountValue.toLocaleString()} ريال
								</h3>
								<div className='mt-1 flex items-center'>
									<span className='text-xs text-gray-500'>
										متوسط قيمة الخصم: {stats.averageDiscountValue.toFixed(2)} ريال
									</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-red-100'>
								<DollarSign className='h-6 w-6 text-red-600' />
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>أفضل كوبون</p>
								<h3 className='text-lg font-bold text-gray-900 mt-1'>{stats.topCoupon.code}</h3>
								<div className='mt-1 flex items-center text-xs text-gray-500'>
									<span className='flex items-center'>استخدام: {stats.topCoupon.usageCount}</span>
									<span className='mx-2'>•</span>
									<span className='flex items-center'>
										قيمة: {stats.topCoupon.discountValue.toLocaleString()} ريال
									</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-red-100'>
								<Tag className='h-6 w-6 text-red-600' />
							</div>
						</div>
					</div>
				</div>
			)}

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
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
							placeholder='ابحث بالكود أو الوصف...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm'
						/>
					</div>

					{/* فلتر الحالة */}
					<div className='sm:w-44'>
						<div className='relative'>
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm pr-8'
							>
								<option value='all'>كل الحالات</option>
								<option value='active'>نشط</option>
								<option value='expired'>منتهي</option>
								<option value='scheduled'>مجدول</option>
								<option value='disabled'>معطل</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* فلتر النوع */}
					<div className='sm:w-44'>
						<div className='relative'>
							<select
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm pr-8'
							>
								<option value='all'>كل الأنواع</option>
								<option value='percentage'>نسبة مئوية</option>
								<option value='fixed'>مبلغ ثابت</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* خيارات الترتيب */}
					<div className='sm:w-52'>
						<div className='relative'>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm pr-8'
							>
								<option value='createdAt'>الترتيب حسب تاريخ الإنشاء</option>
								<option value='value'>الترتيب حسب القيمة</option>
								<option value='usageCount'>الترتيب حسب الاستخدام</option>
								<option value='code'>الترتيب حسب الكود</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					<button
						onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
						className='sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center'
					>
						{sortOrder === 'asc' ? (
							<svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
								<path
									d='M8 6L12 2L16 6'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M8 18L12 22L16 18'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						) : (
							<svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
								<path
									d='M8 18L12 22L16 18'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
								<path
									d='M8 6L12 2L16 6'
									stroke='currentColor'
									strokeWidth='2'
									strokeLinecap='round'
									strokeLinejoin='round'
								/>
							</svg>
						)}
					</button>

					<button
						onClick={() => {
							setSearchTerm('');
							setStatusFilter('all');
							setTypeFilter('all');
							setSortBy('createdAt');
							setSortOrder('desc');
						}}
						className='sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
						disabled={
							!searchTerm &&
							statusFilter === 'all' &&
							typeFilter === 'all' &&
							sortBy === 'createdAt' &&
							sortOrder === 'desc'
						}
					>
						إعادة تعيين
					</button>
				</div>

				<div className='mt-4 flex justify-between items-center'>
					<div className='text-sm text-gray-500'>
						إظهار <span className='font-medium text-gray-900'>{filteredCoupons.length}</span> من أصل{' '}
						<span className='font-medium text-gray-900'>{coupons.length}</span> كوبون
					</div>

					<div className='flex items-center gap-2'>
						<button className='px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-200'>
							<RefreshCw className='ml-1 h-4 w-4' />
							تحديث
						</button>
						<button className='px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-200'>
							<DownloadCloud className='ml-1 h-4 w-4' />
							تصدير
						</button>
					</div>
				</div>
			</div>

			{/* قائمة الكوبونات */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				{filteredCoupons.length === 0 ? (
					<div className='p-8 text-center'>
						<Tag className='mx-auto h-12 w-12 text-gray-300' />
						<h3 className='mt-2 text-lg font-medium text-gray-900'>لا توجد كوبونات</h3>
						<p className='mt-1 text-gray-500'>لم يتم العثور على كوبونات مطابقة للفلاتر المحددة.</p>
						<div className='mt-6'>
							<Link
								href='/dashboard/marketing/coupons/new'
								className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700'
							>
								<Plus className='ml-1 -mr-1 h-4 w-4' />
								إنشاء كوبون جديد
							</Link>
						</div>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										كود الكوبون
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الوصف
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										القيمة
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الفترة
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الاستخدام
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الحالة
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										<span className='sr-only'>إجراءات</span>
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{filteredCoupons.map((coupon) => (
									<tr key={coupon.id} className='hover:bg-gray-50'>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<Tag className='h-5 w-5 text-red-500 ml-2' />
												<span className='font-mono font-medium text-gray-900'>
													{coupon.code}
												</span>
											</div>
										</td>
										<td className='px-6 py-4'>
											<div className='text-sm text-gray-900 line-clamp-2'>
												{coupon.description}
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm font-medium text-gray-900'>
												{formatValue(coupon.type, coupon.value)}
											</div>
											{coupon.minOrderValue && (
												<div className='text-xs text-gray-500'>
													الحد الأدنى للطلب: {coupon.minOrderValue} ريال
												</div>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												من: {formatDate(coupon.startDate)}
											</div>
											{coupon.endDate && (
												<div className='text-sm text-gray-900'>
													إلى: {formatDate(coupon.endDate)}
												</div>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>{coupon.usageCount} مرة</div>
											{coupon.usageLimit && (
												<div className='text-xs text-gray-500'>
													الحد الأقصى: {coupon.usageLimit} مرة
												</div>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>{getStatusBadge(coupon.status)}</td>
										<td className='px-6 py-4 whitespace-nowrap text-left text-sm font-medium'>
											<div className='flex items-center justify-end space-x-2 space-x-reverse'>
												<button
													onClick={() => viewCouponDetails(coupon)}
													className='text-gray-400 hover:text-gray-500'
													title='عرض التفاصيل'
												>
													<Eye className='h-5 w-5' />
												</button>

												<Link
													href={`/dashboard/marketing/coupons/edit/${coupon.id}`}
													className='text-gray-400 hover:text-gray-500'
													title='تعديل'
												>
													<Edit className='h-5 w-5' />
												</Link>

												<button className='text-gray-400 hover:text-gray-500' title='نسخ الكود'>
													<Copy className='h-5 w-5' />
												</button>

												{coupon.status === 'active' || coupon.status === 'scheduled' ? (
													<button className='text-gray-400 hover:text-red-500' title='تعطيل'>
														<X className='h-5 w-5' />
													</button>
												) : coupon.status === 'disabled' ? (
													<button
														className='text-gray-400 hover:text-green-500'
														title='تفعيل'
													>
														<Check className='h-5 w-5' />
													</button>
												) : null}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* نافذة تفاصيل الكوبون */}
			{showCouponDetails && selectedCoupon && (
				<div className='fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
						<div className='p-6 border-b border-gray-200 flex items-center justify-between'>
							<h2 className='text-xl font-bold text-gray-900 flex items-center'>
								<Tag className='ml-2 h-6 w-6 text-red-600' />
								تفاصيل كوبون الخصم
							</h2>
							<button
								onClick={() => setShowCouponDetails(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-6 w-6' />
							</button>
						</div>

						<div className='p-6'>
							<div className='mb-6 bg-red-50 border border-red-100 rounded-lg p-4 flex flex-col items-center text-center'>
								<div className='text-xl font-bold text-gray-900 mb-1'>{selectedCoupon.code}</div>
								<div className='text-sm text-gray-600 mb-3'>{selectedCoupon.description}</div>
								<div className='text-3xl font-bold text-red-600 mb-2'>
									{formatValue(selectedCoupon.type, selectedCoupon.value)}
								</div>
								<div className='flex items-center'>{getStatusBadge(selectedCoupon.status)}</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
								<div>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>معلومات الكوبون</h4>
									<div className='bg-gray-50 rounded-lg p-4 space-y-3'>
										<div>
											<p className='text-xs text-gray-500'>نوع الخصم</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{selectedCoupon.type === 'percentage' ? 'نسبة مئوية' : 'مبلغ ثابت'}
											</p>
										</div>

										<div>
											<p className='text-xs text-gray-500'>القيمة</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{formatValue(selectedCoupon.type, selectedCoupon.value)}
											</p>
										</div>

										{selectedCoupon.maxDiscount && (
											<div>
												<p className='text-xs text-gray-500'>الحد الأقصى للخصم</p>
												<p className='text-sm font-medium text-gray-900 mt-1'>
													{selectedCoupon.maxDiscount} ريال
												</p>
											</div>
										)}

										{selectedCoupon.minOrderValue && (
											<div>
												<p className='text-xs text-gray-500'>الحد الأدنى للطلب</p>
												<p className='text-sm font-medium text-gray-900 mt-1'>
													{selectedCoupon.minOrderValue} ريال
												</p>
											</div>
										)}
									</div>
								</div>

								<div>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>صلاحية الكوبون</h4>
									<div className='bg-gray-50 rounded-lg p-4 space-y-3'>
										<div>
											<p className='text-xs text-gray-500'>تاريخ البدء</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{formatDate(selectedCoupon.startDate)}
											</p>
										</div>

										<div>
											<p className='text-xs text-gray-500'>تاريخ الانتهاء</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{selectedCoupon.endDate
													? formatDate(selectedCoupon.endDate)
													: 'غير محدد'}
											</p>
										</div>

										<div>
											<p className='text-xs text-gray-500'>عدد مرات الاستخدام</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{selectedCoupon.usageCount} مرة
												{selectedCoupon.usageLimit &&
													` من أصل ${selectedCoupon.usageLimit} مرة`}
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className='mb-6'>
								<h4 className='text-sm font-medium text-gray-500 mb-2'>القيود والشروط</h4>
								<div className='bg-gray-50 rounded-lg p-4'>
									<ul className='space-y-2'>
										{selectedCoupon.restrictions.newCustomersOnly && (
											<li className='flex items-start'>
												<Users className='h-5 w-5 text-gray-400 ml-2 mt-0.5' />
												<span className='text-sm text-gray-900'>متاح للعملاء الجدد فقط</span>
											</li>
										)}

										{selectedCoupon.restrictions.specificProducts && (
											<li className='flex items-start'>
												<ShoppingBag className='h-5 w-5 text-gray-400 ml-2 mt-0.5' />
												<span className='text-sm text-gray-900'>متاح على منتجات محددة</span>
											</li>
										)}

										{selectedCoupon.restrictions.specificCategories && (
											<li className='flex items-start'>
												<Tag className='h-5 w-5 text-gray-400 ml-2 mt-0.5' />
												<span className='text-sm text-gray-900'>متاح على فئات محددة</span>
											</li>
										)}

										{!selectedCoupon.restrictions.newCustomersOnly &&
											!selectedCoupon.restrictions.specificProducts &&
											!selectedCoupon.restrictions.specificCategories && (
												<li className='flex items-start'>
													<Check className='h-5 w-5 text-green-500 ml-2 mt-0.5' />
													<span className='text-sm text-gray-900'>
														متاح لجميع العملاء على جميع المنتجات
													</span>
												</li>
											)}
									</ul>
								</div>
							</div>

							<div className='mb-6'>
								<h4 className='text-sm font-medium text-gray-500 mb-2'>معلومات إضافية</h4>
								<div className='bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4'>
									<div>
										<p className='text-xs text-gray-500'>تم الإنشاء بواسطة</p>
										<p className='text-sm text-gray-900 mt-1'>{selectedCoupon.createdBy}</p>
									</div>
									<div>
										<p className='text-xs text-gray-500'>تاريخ الإنشاء</p>
										<p className='text-sm text-gray-900 mt-1'>
											{formatDate(selectedCoupon.createdAt)}
										</p>
									</div>
								</div>
							</div>

							{selectedCoupon.status === 'expired' && (
								<div className='mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start'>
									<AlertTriangle className='h-5 w-5 text-yellow-500 ml-2 mt-0.5' />
									<div>
										<p className='text-sm font-medium text-yellow-800'>
											هذا الكوبون منتهي الصلاحية
										</p>
										<p className='text-xs text-yellow-700 mt-1'>
											لم يعد هذا الكوبون صالحاً للاستخدام.
										</p>
									</div>
								</div>
							)}

							<div className='flex justify-between'>
								<div>
									<Link
										href={`/dashboard/marketing/coupons/edit/${selectedCoupon.id}`}
										className='px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-red-700'
									>
										<Edit className='ml-1 h-4 w-4' />
										تعديل الكوبون
									</Link>
								</div>

								<div className='flex space-x-3 space-x-reverse'>
									<button
										onClick={() => {}}
										className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
									>
										<Copy className='ml-1 h-4 w-4' />
										نسخ الكود
									</button>

									{selectedCoupon.status === 'active' && (
										<button
											onClick={() => {}}
											className='px-4 py-2 border border-gray-300 text-red-700 rounded-md text-sm font-medium flex items-center hover:bg-red-50'
										>
											<X className='ml-1 h-4 w-4' />
											تعطيل الكوبون
										</button>
									)}

									{selectedCoupon.status === 'disabled' && (
										<button
											onClick={() => {}}
											className='px-4 py-2 border border-gray-300 text-green-700 rounded-md text-sm font-medium flex items-center hover:bg-green-50'
										>
											<Check className='ml-1 h-4 w-4' />
											تفعيل الكوبون
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
