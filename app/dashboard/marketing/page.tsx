'use client';

import {
	AlertTriangle,
	ArrowRight,
	Award,
	BarChart2,
	Bell,
	Calendar,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Clipboard,
	Clock,
	Filter,
	Gift,
	Mail,
	MessageCircle,
	MessageSquare,
	Plus,
	Search,
	Settings,
	Star,
	Tag,
	TrendingUp,
	Users,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface MarketingStats {
	activeCustomers: number;
	engagementRate: number;
	campaignsCount: number;
	totalMessagesSent: number;
	averageOpenRate: number;
	giftCardsIssued: number;
	loyaltyMembers: number;
	activeCoupons: number;
	totalRevenue: number;
	roiPercentage: number;
}

interface Campaign {
	id: string;
	name: string;
	type: 'sms' | 'email' | 'discount' | 'loyalty';
	status: 'active' | 'scheduled' | 'completed' | 'draft';
	startDate: string;
	endDate: string | null;
	target: string;
	reach: number;
	engagement: number;
	revenue: number;
}

interface UpcomingActivity {
	id: string;
	title: string;
	type: 'sms' | 'email' | 'coupon' | 'loyalty' | 'giftcard';
	date: string;
	status: 'scheduled' | 'pending' | 'processing';
	details: string;
}

export default function MarketingDashboard() {
	const [loading, setLoading] = useState(true);
	const [stats, setStats] = useState<MarketingStats | null>(null);
	const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);
	const [upcomingActivities, setUpcomingActivities] = useState<UpcomingActivity[]>([]);
	const [currentMonth, setCurrentMonth] = useState<string>('');

	useEffect(() => {
		const fetchMarketingData = async () => {
			// محاكاة الوقت اللازم لجلب البيانات من الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// تعيين الشهر الحالي باللغة العربية
			const months = [
				'يناير',
				'فبراير',
				'مارس',
				'إبريل',
				'مايو',
				'يونيو',
				'يوليو',
				'أغسطس',
				'سبتمبر',
				'أكتوبر',
				'نوفمبر',
				'ديسمبر',
			];
			const now = new Date();
			setCurrentMonth(`${months[now.getMonth()]} ${now.getFullYear()}`);

			// بيانات تجريبية للإحصاءات
			const mockStats: MarketingStats = {
				activeCustomers: 3248,
				engagementRate: 37.5,
				campaignsCount: 14,
				totalMessagesSent: 9750,
				averageOpenRate: 42.8,
				giftCardsIssued: 185,
				loyaltyMembers: 956,
				activeCoupons: 8,
				totalRevenue: 85400,
				roiPercentage: 325,
			};

			// بيانات تجريبية للحملات الأخيرة
			const mockCampaigns: Campaign[] = [
				{
					id: 'camp-001',
					name: 'عروض عيد الفطر',
					type: 'discount',
					status: 'active',
					startDate: '2023-09-15',
					endDate: '2023-09-30',
					target: 'جميع العملاء',
					reach: 2750,
					engagement: 835,
					revenue: 28900,
				},
				{
					id: 'camp-002',
					name: 'إطلاق المجموعة الجديدة',
					type: 'email',
					status: 'completed',
					startDate: '2023-09-01',
					endDate: '2023-09-10',
					target: 'العملاء الجدد',
					reach: 1500,
					engagement: 620,
					revenue: 15750,
				},
				{
					id: 'camp-003',
					name: 'عرض خاص للعملاء المميزين',
					type: 'loyalty',
					status: 'scheduled',
					startDate: '2023-10-01',
					endDate: null,
					target: 'العملاء المميزين',
					reach: 0,
					engagement: 0,
					revenue: 0,
				},
				{
					id: 'camp-004',
					name: 'تذكير بالمواعيد',
					type: 'sms',
					status: 'active',
					startDate: '2023-09-20',
					endDate: null,
					target: 'العملاء المجدولة مواعيدهم',
					reach: 245,
					engagement: 198,
					revenue: 12400,
				},
			];

			// بيانات تجريبية للأنشطة القادمة
			const mockActivities: UpcomingActivity[] = [
				{
					id: 'act-001',
					title: 'حملة رسائل للعروض الأسبوعية',
					type: 'sms',
					date: '2023-09-25T09:00:00',
					status: 'scheduled',
					details: 'إرسال رسائل نصية لـ 1200 عميل',
				},
				{
					id: 'act-002',
					title: 'نشرة المجموعة الجديدة',
					type: 'email',
					date: '2023-09-26T10:00:00',
					status: 'scheduled',
					details: 'إرسال بريد إلكتروني لـ 2500 عميل',
				},
				{
					id: 'act-003',
					title: 'تفعيل عروض نهاية الشهر',
					type: 'coupon',
					date: '2023-09-28T00:00:00',
					status: 'pending',
					details: 'تفعيل 3 كوبونات خصم بنسبة 15%',
				},
				{
					id: 'act-004',
					title: 'تحديث نقاط برنامج الولاء',
					type: 'loyalty',
					date: '2023-09-30T23:59:59',
					status: 'scheduled',
					details: 'تحديث نقاط لـ 956 عضو',
				},
				{
					id: 'act-005',
					title: 'إطلاق بطاقات هدايا للعيد',
					type: 'giftcard',
					date: '2023-10-01T08:00:00',
					status: 'pending',
					details: 'إتاحة 300 بطاقة هدية بقيمة 100-500 ريال',
				},
			];

			setStats(mockStats);
			setRecentCampaigns(mockCampaigns);
			setUpcomingActivities(mockActivities);
			setLoading(false);
		};

		fetchMarketingData();
	}, []);

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
			default:
				return <Star className='h-5 w-5 text-gray-500' />;
		}
	};

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
			default:
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>{status}</span>;
		}
	};

	const getActivityTypeIcon = (type: string) => {
		switch (type) {
			case 'sms':
				return <MessageCircle className='h-5 w-5 text-blue-500' />;
			case 'email':
				return <Mail className='h-5 w-5 text-purple-500' />;
			case 'coupon':
				return <Tag className='h-5 w-5 text-red-500' />;
			case 'loyalty':
				return <Award className='h-5 w-5 text-amber-500' />;
			case 'giftcard':
				return <Gift className='h-5 w-5 text-green-500' />;
			default:
				return <Bell className='h-5 w-5 text-gray-500' />;
		}
	};

	const getActivityStatusBadge = (status: string) => {
		switch (status) {
			case 'scheduled':
				return <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>مجدولة</span>;
			case 'pending':
				return <span className='px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800'>معلقة</span>;
			case 'processing':
				return <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>قيد التنفيذ</span>;
			default:
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>{status}</span>;
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA');
	};

	const formatDateTime = (dateTimeString: string) => {
		const date = new Date(dateTimeString);
		return `${date.toLocaleDateString('ar-SA')} ${date.toLocaleTimeString('ar-SA', {
			hour: '2-digit',
			minute: '2-digit',
		})}`;
	};

	// فحص إذا كان النشاط سيحدث اليوم
	const isToday = (dateString: string) => {
		const today = new Date();
		const activityDate = new Date(dateString);
		return today.toDateString() === activityDate.toDateString();
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<Star className='inline-block ml-2 h-6 w-6 text-amber-500' />
						إدارة التسويق
					</h1>
					<p className='mt-1 text-sm text-gray-600'>
						لوحة معلومات التسويق وإدارة الحملات الترويجية لشهر {currentMonth}
					</p>
				</div>

				<div className='flex gap-2'>
					<Link
						href='/dashboard/marketing/campaigns/new'
						className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700'
					>
						<Plus className='ml-1 h-4 w-4' />
						حملة جديدة
					</Link>

					<Link
						href='/dashboard/reports/marketing'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						التقارير
					</Link>

					<Link
						href='/dashboard/marketing/settings'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Settings className='ml-1 h-4 w-4' />
						الإعدادات
					</Link>
				</div>
			</div>

			{/* بطاقات الإحصاءات */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between items-start'>
						<div>
							<p className='text-xs text-gray-500'>العملاء النشطون</p>
							<h3 className='text-2xl font-bold text-gray-900 mt-1'>
								{stats?.activeCustomers.toLocaleString()}
							</h3>
							<p className='text-xs text-green-600 mt-1 flex items-center'>
								<TrendingUp className='h-3 w-3 ml-1' />
								نسبة المشاركة {stats?.engagementRate}%
							</p>
						</div>
						<div className='p-2 rounded-full bg-blue-100'>
							<Users className='h-6 w-6 text-blue-500' />
						</div>
					</div>
				</div>

				<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between items-start'>
						<div>
							<p className='text-xs text-gray-500'>الحملات النشطة</p>
							<h3 className='text-2xl font-bold text-gray-900 mt-1'>{stats?.campaignsCount}</h3>
							<p className='text-xs text-gray-600 mt-1 flex items-center'>
								<MessageSquare className='h-3 w-3 ml-1' />
								{stats?.totalMessagesSent.toLocaleString()} رسالة مرسلة
							</p>
						</div>
						<div className='p-2 rounded-full bg-amber-100'>
							<Star className='h-6 w-6 text-amber-500' />
						</div>
					</div>
				</div>

				<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between items-start'>
						<div>
							<p className='text-xs text-gray-500'>برنامج الولاء</p>
							<h3 className='text-2xl font-bold text-gray-900 mt-1'>
								{stats?.loyaltyMembers.toLocaleString()}
							</h3>
							<p className='text-xs text-gray-600 mt-1 flex items-center'>
								<Gift className='h-3 w-3 ml-1' />
								{stats?.giftCardsIssued} بطاقة هدية مصدرة
							</p>
						</div>
						<div className='p-2 rounded-full bg-purple-100'>
							<Award className='h-6 w-6 text-purple-500' />
						</div>
					</div>
				</div>

				<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between items-start'>
						<div>
							<p className='text-xs text-gray-500'>عائد الحملات</p>
							<h3 className='text-2xl font-bold text-gray-900 mt-1'>
								{stats?.totalRevenue.toLocaleString()} ريال
							</h3>
							<p className='text-xs text-green-600 mt-1 flex items-center'>
								<TrendingUp className='h-3 w-3 ml-1' />
								ROI {stats?.roiPercentage}%
							</p>
						</div>
						<div className='p-2 rounded-full bg-green-100'>
							<BarChart2 className='h-6 w-6 text-green-500' />
						</div>
					</div>
				</div>
			</div>

			{/* القسم الرئيسي */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* الجانب الأيمن */}
				<div className='lg:col-span-2 space-y-6'>
					{/* الحملات الأخيرة */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						<div className='p-6 border-b border-gray-200'>
							<div className='flex justify-between items-center'>
								<h2 className='text-lg font-medium text-gray-900'>الحملات الترويجية</h2>
								<Link
									href='/dashboard/marketing/campaigns'
									className='text-sm font-medium text-green-600 hover:text-green-800 flex items-center'
								>
									عرض الكل
									<ArrowRight className='mr-1 h-4 w-4' />
								</Link>
							</div>
						</div>

						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
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
											الوصول
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											العائد
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{recentCampaigns.map((campaign) => (
										<tr key={campaign.id} className='hover:bg-gray-50'>
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
														{campaign.type === 'sms'
															? 'رسائل نصية'
															: campaign.type === 'email'
															? 'بريد إلكتروني'
															: campaign.type === 'discount'
															? 'عروض وخصومات'
															: campaign.type === 'loyalty'
															? 'برنامج الولاء'
															: campaign.type}
													</span>
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{getCampaignStatusBadge(campaign.status)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-sm text-gray-900'>{campaign.target}</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{campaign.status === 'scheduled' ? (
													<span className='text-sm text-gray-500'>-</span>
												) : (
													<div>
														<div className='text-sm text-gray-900'>
															{campaign.reach.toLocaleString()}
														</div>
														<div className='text-xs text-gray-500'>
															{campaign.engagement} تفاعل
														</div>
													</div>
												)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{campaign.status === 'scheduled' ? (
													<span className='text-sm text-gray-500'>-</span>
												) : (
													<div className='text-sm font-medium text-green-600'>
														{campaign.revenue.toLocaleString()} ريال
													</div>
												)}
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* أقسام التسويق */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<Link
							href='/dashboard/marketing/sms'
							className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
						>
							<div className='flex items-center justify-between mb-4'>
								<div className='p-2 rounded-full bg-blue-100'>
									<MessageSquare className='h-6 w-6 text-blue-500' />
								</div>
								<span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>
									{stats?.totalMessagesSent.toLocaleString()} رسالة
								</span>
							</div>
							<h3 className='text-lg font-medium text-gray-900 mb-1'>الرسائل النصية</h3>
							<p className='text-sm text-gray-500'>إدارة حملات الرسائل النصية وإرسال إشعارات للعملاء</p>
						</Link>

						<Link
							href='/dashboard/marketing/email'
							className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
						>
							<div className='flex items-center justify-between mb-4'>
								<div className='p-2 rounded-full bg-purple-100'>
									<Mail className='h-6 w-6 text-purple-500' />
								</div>
								<span className='px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800'>
									{stats?.averageOpenRate}% معدل الفتح
								</span>
							</div>
							<h3 className='text-lg font-medium text-gray-900 mb-1'>البريد الإلكتروني</h3>
							<p className='text-sm text-gray-500'>إنشاء حملات بريدية وإرسال نشرات إخبارية للعملاء</p>
						</Link>

						<Link
							href='/dashboard/marketing/coupons'
							className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
						>
							<div className='flex items-center justify-between mb-4'>
								<div className='p-2 rounded-full bg-red-100'>
									<Tag className='h-6 w-6 text-red-500' />
								</div>
								<span className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'>
									{stats?.activeCoupons} كوبون نشط
								</span>
							</div>
							<h3 className='text-lg font-medium text-gray-900 mb-1'>كوبونات الخصم</h3>
							<p className='text-sm text-gray-500'>إنشاء وإدارة كوبونات الخصم والعروض الترويجية</p>
						</Link>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<Link
							href='/dashboard/marketing/loyalty'
							className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
						>
							<div className='flex items-center justify-between mb-4'>
								<div className='p-2 rounded-full bg-amber-100'>
									<Award className='h-6 w-6 text-amber-500' />
								</div>
								<span className='px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800'>
									{stats?.loyaltyMembers.toLocaleString()} عضو
								</span>
							</div>
							<h3 className='text-lg font-medium text-gray-900 mb-1'>برنامج الولاء</h3>
							<p className='text-sm text-gray-500'>إدارة برنامج الولاء والمكافآت وتعزيز ولاء العملاء</p>
						</Link>

						<Link
							href='/dashboard/marketing/gift-cards'
							className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
						>
							<div className='flex items-center justify-between mb-4'>
								<div className='p-2 rounded-full bg-green-100'>
									<Gift className='h-6 w-6 text-green-500' />
								</div>
								<span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>
									{stats?.giftCardsIssued} بطاقة
								</span>
							</div>
							<h3 className='text-lg font-medium text-gray-900 mb-1'>بطاقات الهدايا</h3>
							<p className='text-sm text-gray-500'>إصدار وإدارة بطاقات الهدايا الرقمية والفعلية</p>
						</Link>

						<Link
							href='/dashboard/reports/marketing'
							className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
						>
							<div className='flex items-center justify-between mb-4'>
								<div className='p-2 rounded-full bg-blue-100'>
									<BarChart2 className='h-6 w-6 text-blue-500' />
								</div>
								<span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>
									{stats?.roiPercentage}% ROI
								</span>
							</div>
							<h3 className='text-lg font-medium text-gray-900 mb-1'>تحليلات التسويق</h3>
							<p className='text-sm text-gray-500'>مراجعة أداء الحملات والعائد على الاستثمار</p>
						</Link>
					</div>
				</div>

				{/* الجانب الأيسر */}
				<div className='space-y-6'>
					{/* الأنشطة القادمة */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						<div className='p-6 border-b border-gray-200'>
							<div className='flex justify-between items-center'>
								<h2 className='text-lg font-medium text-gray-900'>الأنشطة القادمة</h2>
								<div className='flex space-x-1 space-x-reverse'>
									<button className='p-1 rounded-full hover:bg-gray-100'>
										<ChevronRight className='h-5 w-5 text-gray-500' />
									</button>
									<button className='p-1 rounded-full hover:bg-gray-100'>
										<ChevronLeft className='h-5 w-5 text-gray-500' />
									</button>
								</div>
							</div>
						</div>

						<div className='divide-y divide-gray-200'>
							{upcomingActivities.map((activity) => (
								<div key={activity.id} className='p-4 hover:bg-gray-50'>
									<div className='flex items-start'>
										<div className='ml-4'>{getActivityTypeIcon(activity.type)}</div>
										<div className='flex-1'>
											<div className='flex items-center justify-between'>
												<h3 className='text-sm font-medium text-gray-900'>{activity.title}</h3>
												{getActivityStatusBadge(activity.status)}
											</div>
											<p className='mt-1 text-xs text-gray-500'>{activity.details}</p>
											<div className='mt-2 flex items-center'>
												<Clock className='h-4 w-4 text-gray-400 ml-1' />
												<span
													className={`text-xs ${
														isToday(activity.date)
															? 'text-red-600 font-medium'
															: 'text-gray-500'
													}`}
												>
													{formatDateTime(activity.date)}
													{isToday(activity.date) && ' (اليوم)'}
												</span>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>

						<div className='p-4 border-t border-gray-200 bg-gray-50'>
							<Link
								href='/dashboard/marketing/calendar'
								className='flex items-center justify-center text-sm text-green-600 hover:text-green-800'
							>
								<Calendar className='h-4 w-4 ml-1' />
								عرض تقويم التسويق
							</Link>
						</div>
					</div>

					{/* تنبيهات مهمة */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						<div className='p-6 border-b border-gray-200'>
							<h2 className='text-lg font-medium text-gray-900'>تنبيهات مهمة</h2>
						</div>

						<div className='p-4 bg-amber-50 border-b border-amber-200'>
							<div className='flex'>
								<div className='flex-shrink-0'>
									<AlertTriangle className='h-5 w-5 text-amber-400' />
								</div>
								<div className='mr-3'>
									<h3 className='text-sm font-medium text-amber-800'>انتهاء حملة "عروض عيد الفطر"</h3>
									<div className='mt-1 text-sm text-amber-700'>
										<p>تنتهي الحملة بعد 5 أيام. تحتاج للتخطيط للحملة القادمة.</p>
									</div>
								</div>
							</div>
						</div>

						<div className='p-4 bg-green-50 border-b border-green-200'>
							<div className='flex'>
								<div className='flex-shrink-0'>
									<CheckCircle className='h-5 w-5 text-green-400' />
								</div>
								<div className='mr-3'>
									<h3 className='text-sm font-medium text-green-800'>
										نجاح حملة "إطلاق المجموعة الجديدة"
									</h3>
									<div className='mt-1 text-sm text-green-700'>
										<p>حققت الحملة نسبة تفاعل 41% ومبيعات بقيمة 15,750 ريال.</p>
									</div>
								</div>
							</div>
						</div>

						<div className='p-4 bg-red-50'>
							<div className='flex'>
								<div className='flex-shrink-0'>
									<XCircle className='h-5 w-5 text-red-400' />
								</div>
								<div className='mr-3'>
									<h3 className='text-sm font-medium text-red-800'>رصيد الرسائل على وشك النفاد</h3>
									<div className='mt-1 text-sm text-red-700'>
										<p>تبقى 250 رسالة فقط من الرصيد. يرجى تجديد الباقة.</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* روابط سريعة */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						<div className='p-6 border-b border-gray-200'>
							<h2 className='text-lg font-medium text-gray-900'>روابط سريعة</h2>
						</div>

						<div className='p-4'>
							<div className='space-y-3'>
								<Link
									href='/dashboard/marketing/segments'
									className='flex items-center p-2 text-sm text-gray-800 hover:bg-gray-50 rounded-md'
								>
									<Users className='h-5 w-5 ml-2 text-gray-500' />
									<span>إدارة شرائح العملاء</span>
								</Link>

								<Link
									href='/dashboard/marketing/templates'
									className='flex items-center p-2 text-sm text-gray-800 hover:bg-gray-50 rounded-md'
								>
									<Clipboard className='h-5 w-5 ml-2 text-gray-500' />
									<span>قوالب الرسائل</span>
								</Link>

								<Link
									href='/dashboard/marketing/automation'
									className='flex items-center p-2 text-sm text-gray-800 hover:bg-gray-50 rounded-md'
								>
									<Settings className='h-5 w-5 ml-2 text-gray-500' />
									<span>أتمتة التسويق</span>
								</Link>

								<Link
									href='/dashboard/customers/export'
									className='flex items-center p-2 text-sm text-gray-800 hover:bg-gray-50 rounded-md'
								>
									<Filter className='h-5 w-5 ml-2 text-gray-500' />
									<span>تصدير بيانات العملاء</span>
								</Link>

								<Link
									href='/dashboard/marketing/search'
									className='flex items-center p-2 text-sm text-gray-800 hover:bg-gray-50 rounded-md'
								>
									<Search className='h-5 w-5 ml-2 text-gray-500' />
									<span>بحث في حملات التسويق</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
