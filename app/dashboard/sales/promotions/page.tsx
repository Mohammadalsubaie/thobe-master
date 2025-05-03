'use client';

import {
	ArrowLeft,
	ArrowRight,
	BarChart2,
	Calendar,
	CheckCircle,
	ChevronDown,
	Copy,
	DollarSign,
	Edit,
	Eye,
	MoreHorizontal,
	Percent,
	Plus,
	Search,
	Settings,
	Trash,
	Users,
	X,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Promotion {
	id: string;
	code: string;
	name: string;
	type: 'percentage' | 'fixed' | 'bogo' | 'free_shipping' | 'free_item';
	value: number;
	minOrderValue?: number;
	maxDiscountValue?: number;
	startDate: string;
	endDate: string;
	isActive: boolean;
	applicableProducts: 'all' | 'specific' | 'categories';
	productIds?: string[];
	categoryIds?: string[];
	usageLimit?: number;
	currentUsage: number;
	customerEligibility: 'all' | 'specific' | 'new' | 'returning';
	customerIds?: string[];
	description?: string;
	createdAt: string;
	updatedAt: string;
}

interface PromotionStats {
	totalPromotions: number;
	activePromotions: number;
	expiredPromotions: number;
	totalDiscounts: number;
	topPromotions: {
		name: string;
		usageCount: number;
		discountAmount: number;
	}[];
}

export default function PromotionsPage() {
	const [promotions, setPromotions] = useState<Promotion[]>([]);
	const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedPromotion, setExpandedPromotion] = useState<string | null>(null);

	// فلترة
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [typeFilter, setTypeFilter] = useState('all');
	const [sortBy, setSortBy] = useState<'date' | 'usage' | 'name'>('date');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	// إحصائيات
	const [stats, setStats] = useState<PromotionStats | null>(null);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// بيانات تجريبية للعروض
			const mockPromotions: Promotion[] = [
				{
					id: 'promo-001',
					code: 'SUMMER25',
					name: 'خصم الصيف 25%',
					type: 'percentage',
					value: 25,
					minOrderValue: 500,
					maxDiscountValue: 200,
					startDate: '2023-06-01',
					endDate: '2023-09-30',
					isActive: false,
					applicableProducts: 'all',
					usageLimit: 100,
					currentUsage: 87,
					customerEligibility: 'all',
					description: 'خصم 25% على جميع المنتجات لموسم الصيف',
					createdAt: '2023-05-15',
					updatedAt: '2023-05-15',
				},
				{
					id: 'promo-002',
					code: 'NEWCUST50',
					name: 'خصم العملاء الجدد',
					type: 'fixed',
					value: 50,
					minOrderValue: 200,
					startDate: '2023-01-01',
					endDate: '2023-12-31',
					isActive: true,
					applicableProducts: 'all',
					usageLimit: 1000,
					currentUsage: 342,
					customerEligibility: 'new',
					description: 'خصم 50 ريال على الطلب الأول للعملاء الجدد',
					createdAt: '2022-12-20',
					updatedAt: '2023-01-05',
				},
				{
					id: 'promo-003',
					code: 'THOBES10',
					name: 'خصم الثياب',
					type: 'percentage',
					value: 10,
					startDate: '2023-08-01',
					endDate: '2023-10-31',
					isActive: true,
					applicableProducts: 'categories',
					categoryIds: ['cat-001'],
					usageLimit: 500,
					currentUsage: 78,
					customerEligibility: 'all',
					description: 'خصم 10% على الثياب',
					createdAt: '2023-07-20',
					updatedAt: '2023-07-20',
				},
				{
					id: 'promo-004',
					code: 'FREESHIP',
					name: 'شحن مجاني',
					type: 'free_shipping',
					value: 0,
					minOrderValue: 300,
					startDate: '2023-09-01',
					endDate: '2023-11-30',
					isActive: true,
					applicableProducts: 'all',
					usageLimit: 0,
					currentUsage: 120,
					customerEligibility: 'all',
					description: 'شحن مجاني للطلبات فوق 300 ريال',
					createdAt: '2023-08-15',
					updatedAt: '2023-08-15',
				},
				{
					id: 'promo-005',
					code: 'BUY1GET1',
					name: 'اشتر واحد واحصل على آخر مجاناً',
					type: 'bogo',
					value: 100,
					startDate: '2023-09-15',
					endDate: '2023-10-15',
					isActive: true,
					applicableProducts: 'specific',
					productIds: ['prod-001', 'prod-002'],
					usageLimit: 200,
					currentUsage: 45,
					customerEligibility: 'all',
					description: 'اشتر ثوب واحصل على الثاني مجاناً',
					createdAt: '2023-09-10',
					updatedAt: '2023-09-10',
				},
				{
					id: 'promo-006',
					code: 'VIP15',
					name: 'خصم كبار العملاء',
					type: 'percentage',
					value: 15,
					startDate: '2023-01-01',
					endDate: '2023-12-31',
					isActive: true,
					applicableProducts: 'all',
					usageLimit: 0,
					currentUsage: 230,
					customerEligibility: 'specific',
					customerIds: ['cust-001', 'cust-002', 'cust-003'],
					description: 'خصم 15% لعملائنا المميزين',
					createdAt: '2022-12-20',
					updatedAt: '2023-01-05',
				},
				{
					id: 'promo-007',
					code: 'BISHT20',
					name: 'خصم على البشوت',
					type: 'percentage',
					value: 20,
					startDate: '2023-10-01',
					endDate: '2023-12-31',
					isActive: true,
					applicableProducts: 'categories',
					categoryIds: ['cat-002'],
					usageLimit: 0,
					currentUsage: 12,
					customerEligibility: 'all',
					description: 'خصم 20% على جميع البشوت',
					createdAt: '2023-09-20',
					updatedAt: '2023-09-20',
				},
				{
					id: 'promo-008',
					code: 'WINTER100',
					name: 'خصم الشتاء',
					type: 'fixed',
					value: 100,
					minOrderValue: 700,
					startDate: '2023-11-01',
					endDate: '2024-01-31',
					isActive: false,
					applicableProducts: 'all',
					usageLimit: 0,
					currentUsage: 0,
					customerEligibility: 'all',
					description: 'خصم 100 ريال على الطلبات فوق 700 ريال لموسم الشتاء',
					createdAt: '2023-10-15',
					updatedAt: '2023-10-15',
				},
			];

			// حساب الإحصائيات
			const totalPromotions = mockPromotions.length;
			const now = new Date();
			const activePromotions = mockPromotions.filter((p) => {
				const endDate = new Date(p.endDate);
				return p.isActive && endDate >= now;
			}).length;
			const expiredPromotions = mockPromotions.filter((p) => {
				const endDate = new Date(p.endDate);
				return endDate < now;
			}).length;

			// محاكاة إجمالي الخصومات
			const totalDiscounts = 23450;

			// ترتيب العروض حسب الاستخدام
			const topPromotions = [...mockPromotions]
				.sort((a, b) => b.currentUsage - a.currentUsage)
				.slice(0, 3)
				.map((p) => ({
					name: p.name,
					usageCount: p.currentUsage,
					discountAmount:
						p.type === 'percentage' ? p.currentUsage * (p.value / 100) * 500 : p.currentUsage * p.value,
				}));

			const statsData: PromotionStats = {
				totalPromotions,
				activePromotions,
				expiredPromotions,
				totalDiscounts,
				topPromotions,
			};

			setPromotions(mockPromotions);
			setFilteredPromotions(mockPromotions);
			setStats(statsData);

			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let result = [...promotions];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(promo) =>
					promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(promo.description && promo.description.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			const now = new Date();

			if (statusFilter === 'active') {
				result = result.filter((promo) => {
					const endDate = new Date(promo.endDate);
					return promo.isActive && endDate >= now;
				});
			} else if (statusFilter === 'inactive') {
				result = result.filter((promo) => !promo.isActive);
			} else if (statusFilter === 'expired') {
				result = result.filter((promo) => {
					const endDate = new Date(promo.endDate);
					return endDate < now;
				});
			} else if (statusFilter === 'scheduled') {
				result = result.filter((promo) => {
					const startDate = new Date(promo.startDate);
					return promo.isActive && startDate > now;
				});
			}
		}

		// تطبيق فلتر النوع
		if (typeFilter !== 'all') {
			result = result.filter((promo) => promo.type === typeFilter);
		}

		// تطبيق الترتيب
		result.sort((a, b) => {
			if (sortBy === 'date') {
				return sortOrder === 'asc'
					? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					: new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			} else if (sortBy === 'usage') {
				return sortOrder === 'asc' ? a.currentUsage - b.currentUsage : b.currentUsage - a.currentUsage;
			} else {
				return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
			}
		});

		setFilteredPromotions(result);
		setCurrentPage(1); // إعادة تعيين الصفحة الحالية عند تغيير الفلاتر
	}, [searchTerm, statusFilter, typeFilter, sortBy, sortOrder, promotions]);

	// توسيع/طي تفاصيل العرض
	const togglePromotionExpand = (promotionId: string) => {
		if (expandedPromotion === promotionId) {
			setExpandedPromotion(null);
		} else {
			setExpandedPromotion(promotionId);
		}
	};

	// عرض نوع العرض
	const renderPromotionTypeBadge = (type: string) => {
		switch (type) {
			case 'percentage':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						خصم نسبة
					</span>
				);
			case 'fixed':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						خصم ثابت
					</span>
				);
			case 'bogo':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
						اشتر واحد واحصل على آخر
					</span>
				);
			case 'free_shipping':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800'>
						شحن مجاني
					</span>
				);
			case 'free_item':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800'>
						هدية مجانية
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

	// عرض حالة العرض
	const renderPromotionStatusBadge = (promotion: Promotion) => {
		const now = new Date();
		const startDate = new Date(promotion.startDate);
		const endDate = new Date(promotion.endDate);

		if (!promotion.isActive) {
			return (
				<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
					غير نشط
				</span>
			);
		} else if (endDate < now) {
			return (
				<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
					منتهي
				</span>
			);
		} else if (startDate > now) {
			return (
				<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800'>
					مجدول
				</span>
			);
		} else {
			return (
				<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
					نشط
				</span>
			);
		}
	};

	// عرض نطاق تطبيق العرض
	const renderPromotionScope = (promotion: Promotion) => {
		switch (promotion.applicableProducts) {
			case 'all':
				return <span className='text-gray-600'>جميع المنتجات</span>;
			case 'specific':
				return <span className='text-gray-600'>منتجات محددة ({promotion.productIds?.length})</span>;
			case 'categories':
				return <span className='text-gray-600'>فئات محددة ({promotion.categoryIds?.length})</span>;
			default:
				return <span className='text-gray-600'>{promotion.applicableProducts}</span>;
		}
	};

	// عرض نطاق العملاء
	const renderCustomerEligibility = (promotion: Promotion) => {
		switch (promotion.customerEligibility) {
			case 'all':
				return <span className='text-gray-600'>جميع العملاء</span>;
			case 'specific':
				return <span className='text-gray-600'>عملاء محددين ({promotion.customerIds?.length})</span>;
			case 'new':
				return <span className='text-gray-600'>العملاء الجدد</span>;
			case 'returning':
				return <span className='text-gray-600'>العملاء العائدين</span>;
			default:
				return <span className='text-gray-600'>{promotion.customerEligibility}</span>;
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

	// التحقق من انتهاء العرض
	const isPromotionExpired = (endDate: string) => {
		const now = new Date();
		const end = new Date(endDate);
		return end < now;
	};

	// التحقق من أن العرض مجدول (لم يبدأ بعد)
	const isPromotionScheduled = (startDate: string) => {
		const now = new Date();
		const start = new Date(startDate);
		return start > now;
	};

	// حساب نسبة استخدام العرض
	const calculateUsagePercentage = (promotion: Promotion) => {
		if (!promotion.usageLimit || promotion.usageLimit === 0) return 0;
		return Math.min(100, Math.round((promotion.currentUsage / promotion.usageLimit) * 100));
	};

	// تغيير حالة التفعيل للعرض
	const togglePromotionStatus = (promotionId: string) => {
		setPromotions((prevPromotions) =>
			prevPromotions.map((promo) => (promo.id === promotionId ? { ...promo, isActive: !promo.isActive } : promo))
		);
	};

	// حساب صفحات الترقيم
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredPromotions.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

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
						<Percent className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						العروض والخصومات
					</h1>
					<p className='mt-1 text-gray-500'>إنشاء وإدارة العروض الترويجية والخصومات</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/sales/promotions/analytics'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						تحليل الأداء
					</Link>
					<Link
						href='/dashboard/sales/promotions/new'
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						<Plus className='ml-1 h-4 w-4' />
						إنشاء عرض جديد
					</Link>
				</div>
			</div>

			{/* بطاقات الإحصائيات */}
			{stats && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>العروض النشطة</p>
								<p className='text-2xl font-bold text-green-600'>{stats.activePromotions}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
								<CheckCircle className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>من أصل {stats.totalPromotions} عرض</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>العروض المنتهية</p>
								<p className='text-2xl font-bold text-red-600'>{stats.expiredPromotions}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600'>
								<XCircle className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>تحتاج إلى تحديث أو إيقاف</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>إجمالي الخصومات</p>
								<p className='text-2xl font-bold text-indigo-600'>
									{stats.totalDiscounts.toLocaleString()} ر.س
								</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
								<DollarSign className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>قيمة جميع الخصومات المطبقة</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>متوسط قيمة الخصم</p>
								<p className='text-2xl font-bold text-amber-600'>
									{(
										stats.totalDiscounts /
										(promotions.reduce((sum, p) => sum + p.currentUsage, 0) || 1)
									).toFixed(2)}{' '}
									ر.س
								</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
								<Percent className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>لكل عملية شراء باستخدام العروض</div>
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
							placeholder='بحث عن اسم العرض أو الكود...'
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
							<option value='inactive'>غير نشط</option>
							<option value='expired'>منتهي</option>
							<option value='scheduled'>مجدول</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر نوع العرض */}
					<div className='relative'>
						<select
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع أنواع العروض</option>
							<option value='percentage'>خصم نسبة</option>
							<option value='fixed'>خصم ثابت</option>
							<option value='bogo'>اشتر واحد واحصل على آخر</option>
							<option value='free_shipping'>شحن مجاني</option>
							<option value='free_item'>هدية مجانية</option>
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
								const [newSortBy, newSortOrder] = e.target.value.split('_');
								setSortBy(newSortBy as 'date' | 'usage' | 'name');
								setSortOrder(newSortOrder as 'asc' | 'desc');
							}}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='date_desc'>الأحدث أولاً</option>
							<option value='date_asc'>الأقدم أولاً</option>
							<option value='usage_desc'>الأكثر استخداماً</option>
							<option value='usage_asc'>الأقل استخداماً</option>
							<option value='name_asc'>الاسم (أ-ي)</option>
							<option value='name_desc'>الاسم (ي-أ)</option>
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
							عرض {filteredPromotions.length} من {promotions.length} عرض
						</span>

						{(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setStatusFilter('all');
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

			{/* قائمة العروض */}
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
										اسم العرض
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										كود الخصم
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										نوع العرض
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
										التاريخ
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
										الاستخدام
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
								{currentItems.map((promotion) => (
									<tr key={promotion.id} className='hover:bg-gray-50'>
										<td className='px-6 py-4 text-sm'>
											<button
												onClick={() => togglePromotionExpand(promotion.id)}
												className='font-medium text-gray-900 hover:text-indigo-600 focus:outline-none'
											>
												{promotion.name}
											</button>
											{promotion.description && (
												<p className='text-xs text-gray-500 truncate max-w-xs'>
													{promotion.description}
												</p>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='inline-flex items-center px-2.5 py-0.5 rounded-md bg-gray-100 text-gray-800 font-mono text-xs'>
												{promotion.code}
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{renderPromotionTypeBadge(promotion.type)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
											{promotion.type === 'percentage' ? (
												<span>{promotion.value}%</span>
											) : promotion.type === 'fixed' ? (
												<span>{promotion.value} ر.س</span>
											) : promotion.type === 'free_shipping' ? (
												<span>شحن مجاني</span>
											) : promotion.type === 'bogo' ? (
												<span>{promotion.value}%</span>
											) : (
												<span>{promotion.value}</span>
											)}
											{promotion.minOrderValue && (
												<div className='text-xs text-gray-500'>
													الحد الأدنى: {promotion.minOrderValue} ر.س
												</div>
											)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											<div className='flex flex-col'>
												<div className='flex items-center'>
													<Calendar className='h-3 w-3 text-gray-400 ml-1' />
													<span
														className={`${
															isPromotionScheduled(promotion.startDate)
																? 'text-amber-600'
																: 'text-gray-500'
														}`}
													>
														{formatDate(promotion.startDate)}
													</span>
												</div>
												<div className='flex items-center mt-1'>
													<Calendar className='h-3 w-3 text-gray-400 ml-1' />
													<span
														className={`${
															isPromotionExpired(promotion.endDate)
																? 'text-red-600'
																: 'text-gray-500'
														}`}
													>
														{formatDate(promotion.endDate)}
													</span>
												</div>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{renderPromotionStatusBadge(promotion)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											<div className='flex items-center'>
												<span className='mr-2'>{promotion.currentUsage}</span>
												{promotion.usageLimit ? (
													<>
														<span className='text-gray-400 mr-1'>
															/ {promotion.usageLimit}
														</span>
														<div className='w-16 bg-gray-200 rounded-full h-1.5 mr-2'>
															<div
																className='bg-indigo-600 h-1.5 rounded-full'
																style={{
																	width: `${calculateUsagePercentage(promotion)}%`,
																}}
															></div>
														</div>
													</>
												) : (
													<span className='text-gray-400 mr-1'>/ غير محدود</span>
												)}
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
											<div className='flex items-center justify-center space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/sales/promotions/${promotion.id}`}
													className='text-indigo-600 hover:text-indigo-900'
													title='عرض التفاصيل'
												>
													<Eye className='h-5 w-5' />
												</Link>
												<Link
													href={`/dashboard/sales/promotions/${promotion.id}/edit`}
													className='text-amber-600 hover:text-amber-900'
													title='تعديل'
												>
													<Edit className='h-5 w-5' />
												</Link>
												<div className='relative group'>
													<button
														className='text-gray-500 hover:text-gray-700'
														title='المزيد من الخيارات'
													>
														<MoreHorizontal className='h-5 w-5' />
													</button>
													<div className='absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
														<button
															onClick={() => togglePromotionStatus(promotion.id)}
															className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
														>
															{promotion.isActive ? (
																<>
																	<XCircle className='inline ml-1 h-4 w-4 text-red-500' />
																	إيقاف العرض
																</>
															) : (
																<>
																	<CheckCircle className='inline ml-1 h-4 w-4 text-green-500' />
																	تفعيل العرض
																</>
															)}
														</button>
														<Link
															href={`/dashboard/sales/promotions/${promotion.id}/analytics`}
															className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
														>
															<BarChart2 className='inline ml-1 h-4 w-4' />
															تحليل أداء العرض
														</Link>
														<Link
															href={`/dashboard/sales/promotions/duplicate/${promotion.id}`}
															className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
														>
															<Copy className='inline ml-1 h-4 w-4' />
															نسخ العرض
														</Link>
														<button className='block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50'>
															<Trash className='inline ml-1 h-4 w-4' />
															حذف العرض
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

					{/* تفاصيل العرض الموسعة */}
					{expandedPromotion && (
						<div className='border-t border-gray-200 bg-gray-50 p-4 animate-fadeIn'>
							{promotions
								.filter((promo) => promo.id === expandedPromotion)
								.map((promotion) => (
									<div key={`details-${promotion.id}`}>
										<div className='flex justify-between items-start mb-4'>
											<h3 className='text-lg font-medium text-gray-900'>
												تفاصيل العرض: {promotion.name}
											</h3>
											<button
												onClick={() => setExpandedPromotion(null)}
												className='text-gray-400 hover:text-gray-500'
											>
												<X className='h-5 w-5' />
											</button>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													معلومات العرض
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-1 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>اسم العرض:</p>
															<p className='font-medium text-gray-900'>
																{promotion.name}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>كود الخصم:</p>
															<p className='font-medium text-gray-900 font-mono'>
																{promotion.code}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>نوع العرض:</p>
															<div>{renderPromotionTypeBadge(promotion.type)}</div>
														</div>
														<div>
															<p className='text-gray-500'>قيمة العرض:</p>
															<p className='font-medium text-gray-900'>
																{promotion.type === 'percentage' ? (
																	<span>{promotion.value}%</span>
																) : promotion.type === 'fixed' ? (
																	<span>{promotion.value} ر.س</span>
																) : promotion.type === 'free_shipping' ? (
																	<span>شحن مجاني</span>
																) : promotion.type === 'bogo' ? (
																	<span>
																		خصم {promotion.value}% على القطعة الثانية
																	</span>
																) : (
																	<span>{promotion.value}</span>
																)}
															</p>
														</div>
													</div>
												</div>
											</div>

											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>شروط التطبيق</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-1 gap-2 text-sm'>
														{promotion.minOrderValue && (
															<div>
																<p className='text-gray-500'>الحد الأدنى للطلب:</p>
																<p className='font-medium text-gray-900'>
																	{promotion.minOrderValue} ر.س
																</p>
															</div>
														)}
														{promotion.maxDiscountValue && (
															<div>
																<p className='text-gray-500'>الحد الأقصى للخصم:</p>
																<p className='font-medium text-gray-900'>
																	{promotion.maxDiscountValue} ر.س
																</p>
															</div>
														)}
														<div>
															<p className='text-gray-500'>حد الاستخدام:</p>
															<p className='font-medium text-gray-900'>
																{promotion.usageLimit
																	? `${promotion.usageLimit} مرة`
																	: 'غير محدود'}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>ينطبق على:</p>
															<p className='font-medium text-gray-900'>
																{renderPromotionScope(promotion)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>متاح لـ:</p>
															<p className='font-medium text-gray-900'>
																{renderCustomerEligibility(promotion)}
															</p>
														</div>
													</div>
												</div>
											</div>

											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													المدة والحالة
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-1 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>تاريخ البدء:</p>
															<p
																className={`font-medium ${
																	isPromotionScheduled(promotion.startDate)
																		? 'text-amber-600'
																		: 'text-gray-900'
																}`}
															>
																{formatDate(promotion.startDate)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>تاريخ الانتهاء:</p>
															<p
																className={`font-medium ${
																	isPromotionExpired(promotion.endDate)
																		? 'text-red-600'
																		: 'text-gray-900'
																}`}
															>
																{formatDate(promotion.endDate)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>حالة العرض:</p>
															<div>{renderPromotionStatusBadge(promotion)}</div>
														</div>
														<div>
															<p className='text-gray-500'>عدد مرات الاستخدام:</p>
															<div className='flex items-center'>
																<span className='font-medium text-gray-900'>
																	{promotion.currentUsage}
																</span>
																{promotion.usageLimit ? (
																	<span className='text-gray-500 mr-1'>
																		/ {promotion.usageLimit}
																	</span>
																) : (
																	<span className='text-gray-500 mr-1'>
																		/ غير محدود
																	</span>
																)}
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>

										{promotion.description && (
											<div className='mb-4'>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>وصف العرض</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200 text-sm text-gray-600'>
													{promotion.description}
												</div>
											</div>
										)}

										{/* معلومات إضافية */}
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													نسبة استخدام العرض
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													{promotion.usageLimit ? (
														<>
															<div className='flex justify-between text-sm mb-1'>
																<span className='text-gray-600'>
																	{promotion.currentUsage} من {promotion.usageLimit}
																</span>
																<span className='text-gray-600'>
																	{calculateUsagePercentage(promotion)}%
																</span>
															</div>
															<div className='w-full bg-gray-200 rounded-full h-2.5'>
																<div
																	className={`h-2.5 rounded-full ${
																		calculateUsagePercentage(promotion) > 75
																			? 'bg-red-600'
																			: calculateUsagePercentage(promotion) > 50
																			? 'bg-amber-600'
																			: 'bg-green-600'
																	}`}
																	style={{
																		width: `${calculateUsagePercentage(
																			promotion
																		)}%`,
																	}}
																></div>
															</div>
														</>
													) : (
														<div className='text-sm text-gray-600'>
															<p>تم استخدام العرض {promotion.currentUsage} مرة</p>
															<p className='mt-1'>لا يوجد حد أقصى للاستخدام</p>
														</div>
													)}
												</div>
											</div>

											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													المدة المتبقية
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													{isPromotionExpired(promotion.endDate) ? (
														<div className='text-sm text-red-600'>
															<p>انتهى العرض</p>
															<p className='mt-1'>
																انتهى بتاريخ {formatDate(promotion.endDate)}
															</p>
														</div>
													) : isPromotionScheduled(promotion.startDate) ? (
														<div className='text-sm text-amber-600'>
															<p>العرض مجدول</p>
															<p className='mt-1'>
																سيبدأ بتاريخ {formatDate(promotion.startDate)}
															</p>
														</div>
													) : (
														<div className='text-sm text-green-600'>
															<p>العرض نشط حالياً</p>
															<p className='mt-1'>
																ينتهي بتاريخ {formatDate(promotion.endDate)}
															</p>
														</div>
													)}
												</div>
											</div>
										</div>

										{/* إجراءات العرض */}
										<div className='flex flex-wrap gap-2'>
											<Link
												href={`/dashboard/sales/promotions/${promotion.id}`}
												className='px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center'
											>
												<Eye className='ml-1 h-4 w-4' />
												عرض التفاصيل الكاملة
											</Link>
											<Link
												href={`/dashboard/sales/promotions/${promotion.id}/edit`}
												className='px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center'
											>
												<Edit className='ml-1 h-4 w-4' />
												تعديل العرض
											</Link>
											<Link
												href={`/dashboard/sales/promotions/${promotion.id}/analytics`}
												className='px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center'
											>
												<BarChart2 className='ml-1 h-4 w-4' />
												تحليل أداء العرض
											</Link>
											<button
												onClick={() => togglePromotionStatus(promotion.id)}
												className={`px-3 py-1.5 text-white rounded-md text-sm flex items-center ${
													promotion.isActive
														? 'bg-red-600 hover:bg-red-700'
														: 'bg-green-600 hover:bg-green-700'
												}`}
											>
												{promotion.isActive ? (
													<>
														<XCircle className='ml-1 h-4 w-4' />
														إيقاف العرض
													</>
												) : (
													<>
														<CheckCircle className='ml-1 h-4 w-4' />
														تفعيل العرض
													</>
												)}
											</button>
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
										{Math.min(indexOfLastItem, filteredPromotions.length)}
									</span>{' '}
									من أصل <span className='font-medium'>{filteredPromotions.length}</span> عرض
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
					<Percent className='h-12 w-12 text-gray-300 mx-auto mb-3' />
					<h3 className='text-lg font-medium text-gray-900'>لا توجد عروض</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
							? 'لم يتم العثور على عروض تطابق معايير البحث المحددة'
							: 'لا توجد عروض مسجلة في النظام. قم بإنشاء عرض جديد للبدء.'}
					</p>
					<div className='mt-4'>
						<Link
							href='/dashboard/sales/promotions/new'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
						>
							<Plus className='ml-1 h-4 w-4' />
							إنشاء عرض جديد
						</Link>
					</div>
				</div>
			)}

			{/* أفضل العروض أداءً */}
			{stats && stats.topPromotions.length > 0 && (
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-lg font-medium text-gray-900'>أفضل العروض أداءً</h2>
						<Link
							href='/dashboard/sales/promotions/analytics'
							className='text-sm text-indigo-600 hover:text-indigo-800 flex items-center'
						>
							<BarChart2 className='ml-1 h-4 w-4' />
							عرض تحليل مفصل
						</Link>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						{stats.topPromotions.map((promo, index) => (
							<div key={index} className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
								<div className='flex justify-between items-start mb-2'>
									<h3 className='text-base font-medium text-gray-900'>{promo.name}</h3>
									<span
										className={`inline-flex items-center justify-center h-6 w-6 rounded-full ${
											index === 0
												? 'bg-yellow-100 text-yellow-800'
												: index === 1
												? 'bg-gray-100 text-gray-800'
												: 'bg-amber-100 text-amber-800'
										}`}
									>
										{index + 1}
									</span>
								</div>
								<div className='space-y-1'>
									<div className='flex justify-between text-sm'>
										<span className='text-gray-500'>عدد الاستخدام:</span>
										<span className='text-gray-900 font-medium'>{promo.usageCount} مرة</span>
									</div>
									<div className='flex justify-between text-sm'>
										<span className='text-gray-500'>قيمة الخصومات:</span>
										<span className='text-gray-900 font-medium'>
											{promo.discountAmount.toLocaleString()} ر.س
										</span>
									</div>
									<div className='flex justify-between text-sm'>
										<span className='text-gray-500'>متوسط الخصم:</span>
										<span className='text-gray-900 font-medium'>
											{(promo.discountAmount / promo.usageCount).toFixed(2)} ر.س
										</span>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* روابط سريعة */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Link
					href='/dashboard/sales/promotions/new'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
						<Plus className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>إنشاء عرض</h3>
						<p className='text-sm text-gray-500'>إنشاء عرض أو كود خصم جديد</p>
					</div>
				</Link>

				<Link
					href='/dashboard/sales/promotions/analytics'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
						<BarChart2 className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>تحليل الأداء</h3>
						<p className='text-sm text-gray-500'>تحليل أداء العروض والخصومات</p>
					</div>
				</Link>

				<Link
					href='/dashboard/sales/promotions/segments'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
						<Users className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>شرائح العملاء</h3>
						<p className='text-sm text-gray-500'>إدارة شرائح العملاء للعروض</p>
					</div>
				</Link>

				<Link
					href='/dashboard/sales/promotions/settings'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ml-3'>
						<Settings className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>الإعدادات</h3>
						<p className='text-sm text-gray-500'>إعدادات العروض والخصومات</p>
					</div>
				</Link>
			</div>
		</div>
	);
}
