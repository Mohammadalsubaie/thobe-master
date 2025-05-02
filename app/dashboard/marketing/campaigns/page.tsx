'use client';

import {
	Archive,
	ArrowLeft,
	Award,
	BarChart2,
	Calendar,
	ChevronDown,
	Clock,
	Copy,
	Download,
	Edit,
	Eye,
	Mail,
	MessageSquare,
	MoreHorizontal,
	Plus,
	Search,
	Star,
	Tag,
	TrendingUp,
	Users,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Campaign {
	id: string;
	name: string;
	type: 'sms' | 'email' | 'discount' | 'loyalty' | 'giftcard';
	status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused' | 'cancelled';
	startDate: string;
	endDate: string | null;
	target: {
		segmentName: string;
		audienceCount: number;
		description: string;
	};
	metrics: {
		reach: number;
		engagement: number;
		conversion: number;
		revenue: number;
	};
	createdBy: string;
	createdAt: string;
	lastUpdated: string | null;
}

export default function CampaignsPage() {
	const [loading, setLoading] = useState(true);
	const [campaigns, setCampaigns] = useState<Campaign[]>([]);
	const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [typeFilter, setTypeFilter] = useState<string>('all');
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [dateFilter, setDateFilter] = useState<string>('all');
	const [sortBy, setSortBy] = useState<string>('date');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
	const [viewOption, setViewOption] = useState<'list' | 'grid'>('list');
	const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
	const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
	const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);

	// محاكاة استدعاء API لجلب الحملات
	useEffect(() => {
		const fetchCampaigns = async () => {
			// محاكاة تأخير الاستجابة من الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية للحملات
			const mockCampaigns: Campaign[] = [
				{
					id: 'camp-001',
					name: 'عروض عيد الفطر',
					type: 'discount',
					status: 'active',
					startDate: '2023-09-15',
					endDate: '2023-09-30',
					target: {
						segmentName: 'جميع العملاء',
						audienceCount: 3500,
						description: 'كافة العملاء المسجلين في قاعدة البيانات',
					},
					metrics: {
						reach: 2750,
						engagement: 835,
						conversion: 189,
						revenue: 28900,
					},
					createdBy: 'أحمد محمد',
					createdAt: '2023-09-10',
					lastUpdated: '2023-09-14',
				},
				{
					id: 'camp-002',
					name: 'إطلاق المجموعة الجديدة',
					type: 'email',
					status: 'completed',
					startDate: '2023-09-01',
					endDate: '2023-09-10',
					target: {
						segmentName: 'العملاء الجدد',
						audienceCount: 1200,
						description: 'العملاء الذين سجلوا خلال الـ 3 أشهر الماضية',
					},
					metrics: {
						reach: 1500,
						engagement: 620,
						conversion: 85,
						revenue: 15750,
					},
					createdBy: 'فاطمة علي',
					createdAt: '2023-08-25',
					lastUpdated: '2023-09-12',
				},
				{
					id: 'camp-003',
					name: 'عرض خاص للعملاء المميزين',
					type: 'loyalty',
					status: 'scheduled',
					startDate: '2023-10-01',
					endDate: '2023-10-15',
					target: {
						segmentName: 'العملاء المميزين',
						audienceCount: 450,
						description: 'العملاء ذوو المشتريات الأكثر من 5000 ريال',
					},
					metrics: {
						reach: 0,
						engagement: 0,
						conversion: 0,
						revenue: 0,
					},
					createdBy: 'محمد عبدالله',
					createdAt: '2023-09-20',
					lastUpdated: null,
				},
				{
					id: 'camp-004',
					name: 'تذكير بالمواعيد',
					type: 'sms',
					status: 'active',
					startDate: '2023-09-20',
					endDate: null,
					target: {
						segmentName: 'العملاء المجدولة مواعيدهم',
						audienceCount: 320,
						description: 'العملاء الذين لديهم مواعيد في الأسبوع القادم',
					},
					metrics: {
						reach: 245,
						engagement: 198,
						conversion: 124,
						revenue: 12400,
					},
					createdBy: 'سارة عمر',
					createdAt: '2023-09-18',
					lastUpdated: '2023-09-19',
				},
				{
					id: 'camp-005',
					name: 'خصم نهاية الموسم',
					type: 'discount',
					status: 'draft',
					startDate: '2023-10-15',
					endDate: '2023-10-30',
					target: {
						segmentName: 'عملاء لم يشتروا مؤخراً',
						audienceCount: 1850,
						description: 'العملاء الذين لم يشتروا خلال آخر 3 أشهر',
					},
					metrics: {
						reach: 0,
						engagement: 0,
						conversion: 0,
						revenue: 0,
					},
					createdBy: 'أحمد محمد',
					createdAt: '2023-09-22',
					lastUpdated: null,
				},
				{
					id: 'camp-006',
					name: 'برنامج مكافآت العملاء',
					type: 'loyalty',
					status: 'paused',
					startDate: '2023-08-01',
					endDate: null,
					target: {
						segmentName: 'أعضاء برنامج الولاء',
						audienceCount: 950,
						description: 'العملاء المسجلين في برنامج الولاء',
					},
					metrics: {
						reach: 920,
						engagement: 415,
						conversion: 76,
						revenue: 18500,
					},
					createdBy: 'فاطمة علي',
					createdAt: '2023-07-25',
					lastUpdated: '2023-09-15',
				},
				{
					id: 'camp-007',
					name: 'بطاقات هدايا الأعياد',
					type: 'giftcard',
					status: 'scheduled',
					startDate: '2023-12-01',
					endDate: '2023-12-31',
					target: {
						segmentName: 'كبار العملاء',
						audienceCount: 250,
						description: 'أكبر 250 عميل من حيث المشتريات',
					},
					metrics: {
						reach: 0,
						engagement: 0,
						conversion: 0,
						revenue: 0,
					},
					createdBy: 'محمد عبدالله',
					createdAt: '2023-09-15',
					lastUpdated: '2023-09-16',
				},
				{
					id: 'camp-008',
					name: 'استطلاع رضا العملاء',
					type: 'email',
					status: 'cancelled',
					startDate: '2023-09-05',
					endDate: '2023-09-12',
					target: {
						segmentName: 'عملاء بعد الشراء',
						audienceCount: 750,
						description: 'العملاء الذين اشتروا خلال آخر شهر',
					},
					metrics: {
						reach: 350,
						engagement: 120,
						conversion: 0,
						revenue: 0,
					},
					createdBy: 'سارة عمر',
					createdAt: '2023-09-01',
					lastUpdated: '2023-09-06',
				},
			];

			setCampaigns(mockCampaigns);
			setFilteredCampaigns(mockCampaigns);
			setLoading(false);
		};

		fetchCampaigns();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let filtered = [...campaigns];

		// تطبيق فلتر البحث
		if (searchTerm.trim() !== '') {
			filtered = filtered.filter(
				(campaign) =>
					campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					campaign.target.segmentName.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// تطبيق فلتر النوع
		if (typeFilter !== 'all') {
			filtered = filtered.filter((campaign) => campaign.type === typeFilter);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			filtered = filtered.filter((campaign) => campaign.status === statusFilter);
		}

		// تطبيق فلتر التاريخ
		if (dateFilter !== 'all') {
			const now = new Date();
			const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
			const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

			if (dateFilter === 'month') {
				filtered = filtered.filter((campaign) => new Date(campaign.createdAt) >= thirtyDaysAgo);
			} else if (dateFilter === 'quarter') {
				filtered = filtered.filter((campaign) => new Date(campaign.createdAt) >= ninetyDaysAgo);
			}
		}

		// تطبيق الترتيب
		filtered.sort((a, b) => {
			if (sortBy === 'date') {
				return sortDirection === 'asc'
					? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					: new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			} else if (sortBy === 'name') {
				return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
			} else if (sortBy === 'revenue') {
				return sortDirection === 'asc'
					? a.metrics.revenue - b.metrics.revenue
					: b.metrics.revenue - a.metrics.revenue;
			} else if (sortBy === 'engagement') {
				return sortDirection === 'asc'
					? a.metrics.engagement - b.metrics.engagement
					: b.metrics.engagement - a.metrics.engagement;
			}
			return 0;
		});

		setFilteredCampaigns(filtered);
	}, [campaigns, searchTerm, typeFilter, statusFilter, dateFilter, sortBy, sortDirection]);

	// الحصول على أيقونة نوع الحملة
	const getCampaignTypeIcon = (type: string) => {
		switch (type) {
			case 'sms':
				return <MessageSquare className='h-5 w-5 text-blue-500' />;
			case 'email':
				return <Mail className='h-5 w-5 text-purple-500' />;
			case 'discount':
				return <Tag className='h-5 w-5 text-red-500' />;
			case 'loyalty':
				return <Award className='h-5 w-5 text-amber-500' />;
			case 'giftcard':
				return <Star className='h-5 w-5 text-green-500' />;
			default:
				return <Star className='h-5 w-5 text-gray-500' />;
		}
	};

	// الحصول على اسم نوع الحملة
	const getCampaignTypeName = (type: string) => {
		switch (type) {
			case 'sms':
				return 'رسائل نصية';
			case 'email':
				return 'بريد إلكتروني';
			case 'discount':
				return 'عروض وخصومات';
			case 'loyalty':
				return 'برنامج الولاء';
			case 'giftcard':
				return 'بطاقات هدايا';
			default:
				return type;
		}
	};

	// الحصول على شارة حالة الحملة
	const getCampaignStatusBadge = (status: string) => {
		switch (status) {
			case 'active':
				return <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>نشطة</span>;
			case 'scheduled':
				return <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>مجدولة</span>;
			case 'completed':
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>مكتملة</span>;
			case 'draft':
				return <span className='px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800'>مسودة</span>;
			case 'paused':
				return (
					<span className='px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800'>متوقفة مؤقتًا</span>
				);
			case 'cancelled':
				return <span className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'>ملغاة</span>;
			default:
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>{status}</span>;
		}
	};

	// تنسيق التاريخ
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA');
	};

	// تحديد ما إذا كانت الحملة يمكن تحريرها
	const isCampaignEditable = (status: string) => {
		return ['draft', 'scheduled', 'paused'].includes(status);
	};

	// عرض تفاصيل الحملة
	const showCampaignDetails = (campaign: Campaign) => {
		setSelectedCampaign(campaign);
		setShowDetailsModal(true);
	};

	// التبديل بين تحديد عنصر
	const toggleSelectItem = (id: string) => {
		const newSelected = new Set(selectedItems);
		if (newSelected.has(id)) {
			newSelected.delete(id);
		} else {
			newSelected.add(id);
		}
		setSelectedItems(newSelected);
	};

	// تحديد كل العناصر
	const selectAll = () => {
		if (selectedItems.size === filteredCampaigns.length) {
			setSelectedItems(new Set());
		} else {
			setSelectedItems(new Set(filteredCampaigns.map((c) => c.id)));
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500'></div>
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
							<Star className='inline-block ml-2 h-6 w-6 text-amber-500' />
							الحملات الترويجية
						</h1>
					</div>
					<p className='mt-1 text-sm text-gray-600'>إدارة وتتبع نتائج الحملات التسويقية</p>
				</div>

				<div className='flex gap-2'>
					<Link
						href='/dashboard/marketing/campaigns/new'
						className='px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-amber-700'
					>
						<Plus className='ml-1 h-4 w-4' />
						حملة جديدة
					</Link>

					<Link
						href='/dashboard/reports/marketing/campaigns'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						التقارير
					</Link>

					<Link
						href='/dashboard/marketing/calendar'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Calendar className='ml-1 h-4 w-4' />
						التقويم
					</Link>
				</div>
			</div>

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex flex-col md:flex-row gap-4'>
					{/* البحث */}
					<div className='flex-1 relative'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='ابحث عن حملات...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
						/>
					</div>

					{/* فلتر النوع */}
					<div className='md:w-40'>
						<div className='relative'>
							<select
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm pr-8'
							>
								<option value='all'>كل الأنواع</option>
								<option value='sms'>رسائل نصية</option>
								<option value='email'>بريد إلكتروني</option>
								<option value='discount'>عروض وخصومات</option>
								<option value='loyalty'>برنامج الولاء</option>
								<option value='giftcard'>بطاقات هدايا</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* فلتر الحالة */}
					<div className='md:w-44'>
						<div className='relative'>
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm pr-8'
							>
								<option value='all'>كل الحالات</option>
								<option value='active'>نشطة</option>
								<option value='scheduled'>مجدولة</option>
								<option value='completed'>مكتملة</option>
								<option value='draft'>مسودة</option>
								<option value='paused'>متوقفة مؤقتًا</option>
								<option value='cancelled'>ملغاة</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* فلتر التاريخ */}
					<div className='md:w-48'>
						<div className='relative'>
							<select
								value={dateFilter}
								onChange={(e) => setDateFilter(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm pr-8'
							>
								<option value='all'>كل الفترات</option>
								<option value='month'>آخر 30 يوم</option>
								<option value='quarter'>آخر 90 يوم</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* أزرار عرض ترتيب */}
					<div className='flex'>
						<div className='relative'>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm pr-8'
							>
								<option value='date'>الترتيب حسب التاريخ</option>
								<option value='name'>الترتيب حسب الاسم</option>
								<option value='revenue'>الترتيب حسب العائد</option>
								<option value='engagement'>الترتيب حسب التفاعل</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>

						<button
							onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
							className='mr-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
						>
							{sortDirection === 'asc' ? 'تصاعدي' : 'تنازلي'}
						</button>
					</div>
				</div>

				{/* شريط الإجراءات */}
				<div className='mt-4 flex justify-between items-center'>
					<div className='flex items-center'>
						<input
							type='checkbox'
							checked={selectedItems.size === filteredCampaigns.length && filteredCampaigns.length > 0}
							onChange={selectAll}
							className='h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded ml-2'
						/>
						<span className='text-sm text-gray-500'>
							{selectedItems.size} من {filteredCampaigns.length} محدد
						</span>

						{selectedItems.size > 0 && (
							<div className='mr-4 flex space-x-2 space-x-reverse'>
								<button className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200'>
									حذف المحدد
								</button>
								<button className='px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200'>
									تصدير المحدد
								</button>
							</div>
						)}
					</div>

					<div className='flex items-center'>
						<span className='text-sm text-gray-500 ml-2'>عرض:</span>
						<button
							onClick={() => setViewOption('list')}
							className={`p-1.5 rounded-md ${
								viewOption === 'list'
									? 'bg-amber-100 text-amber-600'
									: 'text-gray-500 hover:bg-gray-100'
							}`}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 6h16M4 12h16M4 18h16'
								/>
							</svg>
						</button>
						<button
							onClick={() => setViewOption('grid')}
							className={`p-1.5 rounded-md ${
								viewOption === 'grid'
									? 'bg-amber-100 text-amber-600'
									: 'text-gray-500 hover:bg-gray-100'
							}`}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
								/>
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* عرض الحملات */}
			<div className='space-y-4'>
				{filteredCampaigns.length === 0 ? (
					<div className='bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center'>
						<Star className='mx-auto h-12 w-12 text-gray-300' />
						<h3 className='mt-2 text-lg font-medium text-gray-900'>لا توجد حملات</h3>
						<p className='mt-1 text-gray-500'>لم يتم العثور على حملات مطابقة للفلاتر المحددة.</p>
						<div className='mt-6'>
							<Link
								href='/dashboard/marketing/campaigns/new'
								className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700'
							>
								<Plus className='ml-1 -mr-1 h-4 w-4' />
								إنشاء حملة جديدة
							</Link>
						</div>
					</div>
				) : viewOption === 'list' ? (
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-10'
										>
											<input
												type='checkbox'
												checked={
													selectedItems.size === filteredCampaigns.length &&
													filteredCampaigns.length > 0
												}
												onChange={selectAll}
												className='h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded'
											/>
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											الحملة
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
											الحالة
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											الجمهور
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											الأداء
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
											<span className='sr-only'>إجراءات</span>
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{filteredCampaigns.map((campaign) => (
										<tr key={campaign.id} className='hover:bg-gray-50'>
											<td className='px-6 py-4 whitespace-nowrap w-10'>
												<input
													type='checkbox'
													checked={selectedItems.has(campaign.id)}
													onChange={() => toggleSelectItem(campaign.id)}
													className='h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded'
												/>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='flex items-center'>
													<div className='ml-3'>
														<div className='text-sm font-medium text-gray-900 mb-1'>
															{campaign.name}
														</div>
														<div className='text-xs text-gray-500'>
															{campaign.startDate &&
																`من ${formatDate(campaign.startDate)}`}
															{campaign.endDate && ` إلى ${formatDate(campaign.endDate)}`}
														</div>
													</div>
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='flex items-center'>
													{getCampaignTypeIcon(campaign.type)}
													<span className='text-sm text-gray-900 mr-2'>
														{getCampaignTypeName(campaign.type)}
													</span>
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{getCampaignStatusBadge(campaign.status)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>
													{campaign.target.segmentName}
												</div>
												<div className='text-xs text-gray-500'>
													{campaign.target.audienceCount.toLocaleString()} شخص
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{campaign.status === 'scheduled' || campaign.status === 'draft' ? (
													<span className='text-sm text-gray-500'>-</span>
												) : (
													<div>
														<div className='text-sm font-medium text-green-600'>
															{campaign.metrics.revenue.toLocaleString()} ريال
														</div>
														<div className='text-xs text-gray-500'>
															{campaign.metrics.reach.toLocaleString()} وصول /{' '}
															{campaign.metrics.engagement} تفاعل
														</div>
													</div>
												)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												<div>إنشاء: {formatDate(campaign.createdAt)}</div>
												{campaign.lastUpdated && (
													<div>تحديث: {formatDate(campaign.lastUpdated)}</div>
												)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-left text-sm font-medium'>
												<div className='flex items-center justify-end space-x-3 space-x-reverse'>
													<button
														onClick={() => showCampaignDetails(campaign)}
														className='text-gray-400 hover:text-gray-500'
														title='عرض التفاصيل'
													>
														<Eye className='h-5 w-5' />
													</button>

													{isCampaignEditable(campaign.status) && (
														<Link
															href={`/dashboard/marketing/campaigns/edit/${campaign.id}`}
															className='text-gray-400 hover:text-gray-500'
															title='تعديل'
														>
															<Edit className='h-5 w-5' />
														</Link>
													)}

													<button
														className='text-gray-400 hover:text-gray-500'
														title='نسخ الحملة'
													>
														<Copy className='h-5 w-5' />
													</button>

													<button className='text-gray-400 hover:text-gray-500' title='أرشفة'>
														<Archive className='h-5 w-5' />
													</button>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className='px-4 py-3 border-t border-gray-200 bg-gray-50 text-gray-500 text-sm'>
							عرض {filteredCampaigns.length} من إجمالي {campaigns.length} حملة
						</div>
					</div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
						{filteredCampaigns.map((campaign) => (
							<div
								key={campaign.id}
								className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
							>
								<div className='p-5 flex items-center justify-between border-b border-gray-200'>
									<div className='flex items-center'>
										<div className='p-2 rounded-full bg-amber-100'>
											{getCampaignTypeIcon(campaign.type)}
										</div>
										<div className='mr-3'>
											<h3 className='text-base font-medium text-gray-900'>{campaign.name}</h3>
											<p className='text-xs text-gray-500'>
												{getCampaignTypeName(campaign.type)}
											</p>
										</div>
									</div>
									<div className='flex items-center'>
										<input
											type='checkbox'
											checked={selectedItems.has(campaign.id)}
											onChange={() => toggleSelectItem(campaign.id)}
											className='h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded ml-2'
										/>
										<div className='relative'>
											<button className='text-gray-400 hover:text-gray-500'>
												<MoreHorizontal className='h-5 w-5' />
											</button>
										</div>
									</div>
								</div>

								<div className='p-5'>
									<div className='flex items-center justify-between mb-4'>
										<div>{getCampaignStatusBadge(campaign.status)}</div>
										<div className='text-xs text-gray-500'>
											{campaign.startDate && `${formatDate(campaign.startDate)}`}
											{campaign.endDate && ` - ${formatDate(campaign.endDate)}`}
										</div>
									</div>

									<div className='mb-4'>
										<p className='text-xs text-gray-500 mb-1'>الجمهور المستهدف</p>
										<div className='flex items-center'>
											<Users className='h-4 w-4 text-gray-400 ml-1' />
											<p className='text-sm text-gray-900'>{campaign.target.segmentName}</p>
										</div>
										<p className='text-xs text-gray-500 mt-1'>
											{campaign.target.audienceCount.toLocaleString()} شخص
										</p>
									</div>

									{campaign.status !== 'scheduled' && campaign.status !== 'draft' && (
										<div className='mb-4'>
											<p className='text-xs text-gray-500 mb-1'>الأداء</p>
											<div className='grid grid-cols-3 gap-2'>
												<div className='bg-gray-50 p-2 rounded'>
													<p className='text-xs text-gray-500'>وصول</p>
													<p className='text-sm font-medium'>
														{campaign.metrics.reach.toLocaleString()}
													</p>
												</div>
												<div className='bg-gray-50 p-2 rounded'>
													<p className='text-xs text-gray-500'>تفاعل</p>
													<p className='text-sm font-medium'>{campaign.metrics.engagement}</p>
												</div>
												<div className='bg-gray-50 p-2 rounded'>
													<p className='text-xs text-gray-500'>تحويل</p>
													<p className='text-sm font-medium'>{campaign.metrics.conversion}</p>
												</div>
											</div>
											<div className='mt-2 flex items-center justify-between'>
												<div className='flex items-center'>
													<TrendingUp className='h-4 w-4 text-green-500 ml-1' />
													<span className='text-sm font-medium text-green-600'>
														{campaign.metrics.revenue.toLocaleString()} ريال
													</span>
												</div>
												<span className='text-xs text-gray-500'>العائد</span>
											</div>
										</div>
									)}

									<div className='flex items-center text-xs text-gray-500 mb-4'>
										<Clock className='h-4 w-4 ml-1 text-gray-400' />
										<span>إنشاء: {formatDate(campaign.createdAt)}</span>
										{campaign.lastUpdated && (
											<>
												<span className='mx-2'>•</span>
												<span>تحديث: {formatDate(campaign.lastUpdated)}</span>
											</>
										)}
									</div>

									<div className='flex justify-between mt-4 pt-4 border-t border-gray-100'>
										<button
											onClick={() => showCampaignDetails(campaign)}
											className='text-sm text-amber-600 hover:text-amber-800 font-medium'
										>
											عرض التفاصيل
										</button>

										{isCampaignEditable(campaign.status) && (
											<Link
												href={`/dashboard/marketing/campaigns/edit/${campaign.id}`}
												className='text-sm text-gray-600 hover:text-gray-800 font-medium'
											>
												تعديل
											</Link>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* نافذة عرض تفاصيل الحملة */}
			{showDetailsModal && selectedCampaign && (
				<div className='fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
						<div className='p-6 border-b border-gray-200 flex items-center justify-between'>
							<h2 className='text-xl font-bold text-gray-900 flex items-center'>
								{getCampaignTypeIcon(selectedCampaign.type)}
								<span className='mr-2'>{selectedCampaign.name}</span>
							</h2>
							<button
								onClick={() => setShowDetailsModal(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-6 w-6' />
							</button>
						</div>

						<div className='p-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<h3 className='text-sm font-medium text-gray-500 mb-2'>معلومات الحملة</h3>
									<div className='bg-gray-50 rounded-lg p-4 space-y-3'>
										<div>
											<p className='text-xs text-gray-500'>النوع</p>
											<div className='flex items-center mt-1'>
												{getCampaignTypeIcon(selectedCampaign.type)}
												<span className='text-sm font-medium text-gray-900 mr-2'>
													{getCampaignTypeName(selectedCampaign.type)}
												</span>
											</div>
										</div>

										<div>
											<p className='text-xs text-gray-500'>الحالة</p>
											<div className='mt-1'>
												{getCampaignStatusBadge(selectedCampaign.status)}
											</div>
										</div>

										<div>
											<p className='text-xs text-gray-500'>الفترة</p>
											<p className='text-sm text-gray-900 mt-1'>
												{selectedCampaign.startDate &&
													`من ${formatDate(selectedCampaign.startDate)}`}
												{selectedCampaign.endDate &&
													` إلى ${formatDate(selectedCampaign.endDate)}`}
												{!selectedCampaign.endDate && ' - مستمرة'}
											</p>
										</div>

										<div>
											<p className='text-xs text-gray-500'>الإنشاء والتحديث</p>
											<p className='text-sm text-gray-900 mt-1'>
												تم الإنشاء: {formatDate(selectedCampaign.createdAt)} بواسطة{' '}
												{selectedCampaign.createdBy}
											</p>
											{selectedCampaign.lastUpdated && (
												<p className='text-sm text-gray-900 mt-1'>
													آخر تحديث: {formatDate(selectedCampaign.lastUpdated)}
												</p>
											)}
										</div>
									</div>
								</div>

								<div>
									<h3 className='text-sm font-medium text-gray-500 mb-2'>الجمهور المستهدف</h3>
									<div className='bg-gray-50 rounded-lg p-4 space-y-3'>
										<div>
											<p className='text-xs text-gray-500'>الشريحة</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{selectedCampaign.target.segmentName}
											</p>
										</div>

										<div>
											<p className='text-xs text-gray-500'>عدد الجمهور</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{selectedCampaign.target.audienceCount.toLocaleString()} شخص
											</p>
										</div>

										<div>
											<p className='text-xs text-gray-500'>وصف الشريحة</p>
											<p className='text-sm text-gray-900 mt-1'>
												{selectedCampaign.target.description}
											</p>
										</div>
									</div>
								</div>
							</div>

							{selectedCampaign.status !== 'scheduled' && selectedCampaign.status !== 'draft' && (
								<div className='mt-6'>
									<h3 className='text-sm font-medium text-gray-500 mb-2'>أداء الحملة</h3>
									<div className='bg-gray-50 rounded-lg p-4'>
										<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
											<div>
												<p className='text-xs text-gray-500'>الوصول</p>
												<p className='text-xl font-medium text-gray-900 mt-1'>
													{selectedCampaign.metrics.reach.toLocaleString()}
												</p>
												<p className='text-xs text-gray-500 mt-1'>
													{Math.round(
														(selectedCampaign.metrics.reach /
															selectedCampaign.target.audienceCount) *
															100
													)}
													% من الجمهور
												</p>
											</div>

											<div>
												<p className='text-xs text-gray-500'>التفاعل</p>
												<p className='text-xl font-medium text-gray-900 mt-1'>
													{selectedCampaign.metrics.engagement.toLocaleString()}
												</p>
												<p className='text-xs text-gray-500 mt-1'>
													{Math.round(
														(selectedCampaign.metrics.engagement /
															selectedCampaign.metrics.reach) *
															100
													)}
													% نسبة التفاعل
												</p>
											</div>

											<div>
												<p className='text-xs text-gray-500'>التحويل</p>
												<p className='text-xl font-medium text-gray-900 mt-1'>
													{selectedCampaign.metrics.conversion.toLocaleString()}
												</p>
												<p className='text-xs text-gray-500 mt-1'>
													{Math.round(
														(selectedCampaign.metrics.conversion /
															selectedCampaign.metrics.engagement) *
															100
													)}
													% نسبة التحويل
												</p>
											</div>

											<div>
												<p className='text-xs text-gray-500'>العائد</p>
												<p className='text-xl font-medium text-green-600 mt-1'>
													{selectedCampaign.metrics.revenue.toLocaleString()} ريال
												</p>
												<p className='text-xs text-gray-500 mt-1'>
													{Math.round(
														selectedCampaign.metrics.revenue /
															selectedCampaign.metrics.conversion
													)}{' '}
													ريال/تحويل
												</p>
											</div>
										</div>

										<div className='mt-4 pt-4 border-t border-gray-200'>
											<Link
												href={`/dashboard/reports/marketing/campaigns/${selectedCampaign.id}`}
												className='text-sm text-amber-600 hover:text-amber-800 font-medium'
											>
												عرض التقرير التفصيلي
											</Link>
										</div>
									</div>
								</div>
							)}

							<div className='mt-6 flex justify-between'>
								<div>
									{isCampaignEditable(selectedCampaign.status) && (
										<Link
											href={`/dashboard/marketing/campaigns/edit/${selectedCampaign.id}`}
											className='px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-amber-700'
										>
											<Edit className='ml-1 h-4 w-4' />
											تعديل الحملة
										</Link>
									)}
								</div>

								<div className='flex space-x-3 space-x-reverse'>
									<button
										onClick={() => {}}
										className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
									>
										<Copy className='ml-1 h-4 w-4' />
										نسخ الحملة
									</button>

									<button
										onClick={() => {}}
										className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
									>
										<Download className='ml-1 h-4 w-4' />
										تصدير
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
