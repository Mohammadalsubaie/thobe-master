'use client';

import {
	ArrowLeft,
	BarChart2,
	Calendar,
	ChevronDown,
	Clock,
	Copy,
	Edit,
	Eye,
	FileText,
	MessageSquare,
	Plus,
	Search,
	Send,
	Settings,
	Trash2,
	Users,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SMSTemplate {
	id: string;
	name: string;
	content: string;
	createdAt: string;
	lastUsed: string | null;
}

interface SMSCampaign {
	id: string;
	name: string;
	status: 'draft' | 'scheduled' | 'sending' | 'completed' | 'failed';
	segment: {
		name: string;
		count: number;
	};
	template: {
		id: string;
		name: string;
	};
	scheduledAt: string | null;
	sentAt: string | null;
	stats: {
		total: number;
		sent: number;
		delivered: number;
		failed: number;
		cost: number;
	};
	createdAt: string;
	createdBy: string;
}

interface SMSBalance {
	available: number;
	used: number;
	total: number;
	lastRecharge: string;
	expiryDate: string;
}

export default function SMSPage() {
	const [loading, setLoading] = useState(true);
	const [templates, setTemplates] = useState<SMSTemplate[]>([]);
	const [campaigns, setCampaigns] = useState<SMSCampaign[]>([]);
	const [filteredCampaigns, setFilteredCampaigns] = useState<SMSCampaign[]>([]);
	const [balance, setBalance] = useState<SMSBalance | null>(null);
	const [activeTab, setActiveTab] = useState<'campaigns' | 'templates'>('campaigns');
	const [searchTerm, setSearchTerm] = useState<string>('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [dateFilter, setDateFilter] = useState<string>('all');
	const [selectedCampaign, setSelectedCampaign] = useState<SMSCampaign | null>(null);
	const [showCampaignDetails, setShowCampaignDetails] = useState<boolean>(false);
	const [selectedTemplate, setSelectedTemplate] = useState<SMSTemplate | null>(null);
	const [showTemplateDetails, setShowTemplateDetails] = useState<boolean>(false);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchSMSData = async () => {
			// محاكاة تأخير الاستجابة من الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية للقوالب
			const mockTemplates: SMSTemplate[] = [
				{
					id: 'tmpl-001',
					name: 'ترحيب بالعملاء الجدد',
					content:
						'مرحباً بك في ثوب ماستر! يسعدنا انضمامك إلينا. استخدم كود WELCOME للحصول على خصم 10% على طلبك الأول.',
					createdAt: '2023-08-10',
					lastUsed: '2023-09-22',
				},
				{
					id: 'tmpl-002',
					name: 'تذكير بالمواعيد',
					content:
						'تذكير: لديك موعد قياس في ثوب ماستر غداً الساعة {time}. نرجو الحضور قبل الموعد بـ 10 دقائق. للإلغاء أو التعديل يرجى الاتصال على 0512345678',
					createdAt: '2023-08-15',
					lastUsed: '2023-09-20',
				},
				{
					id: 'tmpl-003',
					name: 'إشعار بوصول الطلب',
					content:
						'عميلنا العزيز، طلبك رقم {order_id} جاهز للاستلام من فرع {branch}. أوقات العمل: 9 صباحاً - 10 مساءً',
					createdAt: '2023-08-20',
					lastUsed: '2023-09-18',
				},
				{
					id: 'tmpl-004',
					name: 'خصومات خاصة',
					content:
						'عميلنا المميز، استمتع بخصم {discount}% على جميع منتجاتنا لمدة 3 أيام فقط! استخدم كود {code} عند الطلب. العرض ساري حتى {end_date}',
					createdAt: '2023-09-01',
					lastUsed: '2023-09-15',
				},
				{
					id: 'tmpl-005',
					name: 'عرض عيد الأضحى',
					content:
						'عيد أضحى مبارك! استمتع بخصم 20% على جميع الثياب لفترة محدودة. استخدم كود EID2023 عند الطلب. ينتهي العرض في 30 يونيو.',
					createdAt: '2023-09-05',
					lastUsed: null,
				},
			];

			// بيانات تجريبية للحملات
			const mockCampaigns: SMSCampaign[] = [
				{
					id: 'sms-001',
					name: 'ترحيب بالعملاء الجدد - سبتمبر',
					status: 'completed',
					segment: {
						name: 'العملاء الجدد',
						count: 120,
					},
					template: {
						id: 'tmpl-001',
						name: 'ترحيب بالعملاء الجدد',
					},
					scheduledAt: null,
					sentAt: '2023-09-22T10:30:00',
					stats: {
						total: 120,
						sent: 120,
						delivered: 115,
						failed: 5,
						cost: 120,
					},
					createdAt: '2023-09-21',
					createdBy: 'أحمد محمد',
				},
				{
					id: 'sms-002',
					name: 'تذكير بمواعيد القياس - 21 سبتمبر',
					status: 'completed',
					segment: {
						name: 'مواعيد القياس',
						count: 35,
					},
					template: {
						id: 'tmpl-002',
						name: 'تذكير بالمواعيد',
					},
					scheduledAt: '2023-09-20T18:00:00',
					sentAt: '2023-09-20T18:00:00',
					stats: {
						total: 35,
						sent: 35,
						delivered: 33,
						failed: 2,
						cost: 35,
					},
					createdAt: '2023-09-19',
					createdBy: 'فاطمة علي',
				},
				{
					id: 'sms-003',
					name: 'إشعارات الطلبات الجاهزة - 19 سبتمبر',
					status: 'completed',
					segment: {
						name: 'طلبات جاهزة للاستلام',
						count: 47,
					},
					template: {
						id: 'tmpl-003',
						name: 'إشعار بوصول الطلب',
					},
					scheduledAt: null,
					sentAt: '2023-09-19T14:15:00',
					stats: {
						total: 47,
						sent: 47,
						delivered: 45,
						failed: 2,
						cost: 47,
					},
					createdAt: '2023-09-19',
					createdBy: 'سارة عمر',
				},
				{
					id: 'sms-004',
					name: 'عروض نهاية الأسبوع',
					status: 'scheduled',
					segment: {
						name: 'جميع العملاء النشطين',
						count: 850,
					},
					template: {
						id: 'tmpl-004',
						name: 'خصومات خاصة',
					},
					scheduledAt: '2023-09-28T08:00:00',
					sentAt: null,
					stats: {
						total: 850,
						sent: 0,
						delivered: 0,
						failed: 0,
						cost: 0,
					},
					createdAt: '2023-09-22',
					createdBy: 'محمد عبدالله',
				},
				{
					id: 'sms-005',
					name: 'عرض عيد الأضحى',
					status: 'draft',
					segment: {
						name: 'جميع العملاء',
						count: 3200,
					},
					template: {
						id: 'tmpl-005',
						name: 'عرض عيد الأضحى',
					},
					scheduledAt: null,
					sentAt: null,
					stats: {
						total: 3200,
						sent: 0,
						delivered: 0,
						failed: 0,
						cost: 0,
					},
					createdAt: '2023-09-23',
					createdBy: 'أحمد محمد',
				},
				{
					id: 'sms-006',
					name: 'تذكير بمواعيد التسليم - 24 سبتمبر',
					status: 'sending',
					segment: {
						name: 'مواعيد التسليم',
						count: 28,
					},
					template: {
						id: 'tmpl-002',
						name: 'تذكير بالمواعيد',
					},
					scheduledAt: null,
					sentAt: '2023-09-23T18:00:00',
					stats: {
						total: 28,
						sent: 20,
						delivered: 20,
						failed: 0,
						cost: 20,
					},
					createdAt: '2023-09-23',
					createdBy: 'فاطمة علي',
				},
				{
					id: 'sms-007',
					name: 'تذكير بتجديد العضوية',
					status: 'failed',
					segment: {
						name: 'عضويات منتهية',
						count: 75,
					},
					template: {
						id: 'tmpl-001',
						name: 'ترحيب بالعملاء الجدد',
					},
					scheduledAt: '2023-09-18T10:00:00',
					sentAt: '2023-09-18T10:00:00',
					stats: {
						total: 75,
						sent: 10,
						delivered: 8,
						failed: 67,
						cost: 10,
					},
					createdAt: '2023-09-17',
					createdBy: 'سارة عمر',
				},
			];

			// بيانات تجريبية للرصيد
			const mockBalance: SMSBalance = {
				available: 12500,
				used: 7500,
				total: 20000,
				lastRecharge: '2023-09-01',
				expiryDate: '2023-12-31',
			};

			setTemplates(mockTemplates);
			setCampaigns(mockCampaigns);
			setFilteredCampaigns(mockCampaigns);
			setBalance(mockBalance);
			setLoading(false);
		};

		fetchSMSData();
	}, []);

	// تطبيق الفلاتر على الحملات
	useEffect(() => {
		let filtered = [...campaigns];

		// تطبيق فلتر البحث
		if (searchTerm.trim() !== '') {
			filtered = filtered.filter(
				(campaign) =>
					campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					campaign.segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					campaign.template.name.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			filtered = filtered.filter((campaign) => campaign.status === statusFilter);
		}

		// تطبيق فلتر التاريخ
		if (dateFilter !== 'all') {
			const now = new Date();
			const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
			const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

			if (dateFilter === 'week') {
				filtered = filtered.filter((campaign) => new Date(campaign.createdAt) >= oneWeekAgo);
			} else if (dateFilter === 'month') {
				filtered = filtered.filter((campaign) => new Date(campaign.createdAt) >= oneMonthAgo);
			}
		}

		// ترتيب حسب التاريخ (الأحدث أولاً)
		filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

		setFilteredCampaigns(filtered);
	}, [campaigns, searchTerm, statusFilter, dateFilter]);

	// الحصول على شارة حالة الحملة
	const getCampaignStatusBadge = (status: string) => {
		switch (status) {
			case 'draft':
				return <span className='px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800'>مسودة</span>;
			case 'scheduled':
				return <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>مجدولة</span>;
			case 'sending':
				return <span className='px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800'>جاري الإرسال</span>;
			case 'completed':
				return <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>مكتملة</span>;
			case 'failed':
				return <span className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'>فشلت</span>;
			default:
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>{status}</span>;
		}
	};

	// تنسيق التاريخ والوقت
	const formatDateTime = (dateTimeString: string | null) => {
		if (!dateTimeString) return '-';
		const date = new Date(dateTimeString);
		return `${date.toLocaleDateString('ar-SA')} ${date.toLocaleTimeString('ar-SA', {
			hour: '2-digit',
			minute: '2-digit',
		})}`;
	};

	// تنسيق التاريخ فقط
	const formatDate = (dateString: string | null) => {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA');
	};

	// حساب نسبة التوصيل
	const calculateDeliveryRate = (campaign: SMSCampaign) => {
		if (campaign.stats.sent === 0) return 0;
		return Math.round((campaign.stats.delivered / campaign.stats.sent) * 100);
	};

	// عرض تفاصيل الحملة
	const viewCampaignDetails = (campaign: SMSCampaign) => {
		setSelectedCampaign(campaign);
		setShowCampaignDetails(true);
	};

	// عرض تفاصيل القالب
	const viewTemplateDetails = (template: SMSTemplate) => {
		setSelectedTemplate(template);
		setShowTemplateDetails(true);
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
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
							<MessageSquare className='inline-block ml-2 h-6 w-6 text-blue-600' />
							الرسائل النصية
						</h1>
					</div>
					<p className='mt-1 text-sm text-gray-600'>إدارة حملات الرسائل النصية والقوالب</p>
				</div>

				<div className='flex gap-2'>
					<Link
						href='/dashboard/marketing/sms/send'
						className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700'
					>
						<Send className='ml-1 h-4 w-4' />
						إرسال جديد
					</Link>

					<Link
						href='/dashboard/marketing/sms/templates/new'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Plus className='ml-1 h-4 w-4' />
						قالب جديد
					</Link>

					<Link
						href='/dashboard/reports/marketing/sms'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						التقارير
					</Link>
				</div>
			</div>

			{/* بطاقة الرصيد */}
			{balance && (
				<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
					<div className='grid grid-cols-1 md:grid-cols-5 gap-6'>
						<div className='md:col-span-3'>
							<div className='flex justify-between items-center mb-3'>
								<h2 className='text-lg font-medium text-gray-900'>رصيد الرسائل النصية</h2>
								<Link
									href='/dashboard/marketing/sms/recharge'
									className='text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center'
								>
									شحن الرصيد
								</Link>
							</div>

							<div className='w-full bg-gray-200 rounded-full h-4'>
								<div
									className='bg-blue-600 h-4 rounded-full'
									style={{ width: `${(balance.available / balance.total) * 100}%` }}
								></div>
							</div>

							<div className='flex justify-between mt-2 text-sm'>
								<div className='text-gray-600'>
									<span className='font-medium text-blue-600'>
										{balance.available.toLocaleString()}
									</span>{' '}
									رسالة متاحة
								</div>
								<div className='text-gray-600'>{balance.total.toLocaleString()} إجمالي الرصيد</div>
							</div>

							<div className='flex flex-wrap gap-y-2 mt-4 text-xs text-gray-500'>
								<div className='ml-6'>
									<span className='ml-1'>آخر شحن:</span>
									<span className='font-medium'>{formatDate(balance.lastRecharge)}</span>
								</div>
								<div className='ml-6'>
									<span className='ml-1'>تاريخ الانتهاء:</span>
									<span className='font-medium'>{formatDate(balance.expiryDate)}</span>
								</div>
								<div>
									<span className='ml-1'>الرسائل المستخدمة:</span>
									<span className='font-medium'>{balance.used.toLocaleString()} رسالة</span>
								</div>
							</div>
						</div>

						<div className='md:col-span-2 flex justify-center items-center border-t md:border-t-0 md:border-r border-gray-200 pt-4 md:pt-0 md:pr-6'>
							<div className='grid grid-cols-2 gap-4 w-full'>
								<Link
									href='/dashboard/marketing/sms/send'
									className='flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50'
								>
									<Send className='h-6 w-6 text-blue-600 mb-2' />
									<span className='text-sm font-medium text-gray-900'>إرسال فوري</span>
								</Link>

								<Link
									href='/dashboard/marketing/sms/schedule'
									className='flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50'
								>
									<Calendar className='h-6 w-6 text-blue-600 mb-2' />
									<span className='text-sm font-medium text-gray-900'>جدولة إرسال</span>
								</Link>

								<Link
									href='/dashboard/marketing/segments'
									className='flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50'
								>
									<Users className='h-6 w-6 text-blue-600 mb-2' />
									<span className='text-sm font-medium text-gray-900'>شرائح العملاء</span>
								</Link>

								<Link
									href='/dashboard/marketing/sms/settings'
									className='flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200 hover:bg-gray-50'
								>
									<Settings className='h-6 w-6 text-blue-600 mb-2' />
									<span className='text-sm font-medium text-gray-900'>الإعدادات</span>
								</Link>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* تبويبات */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='border-b border-gray-200'>
					<nav className='flex -mb-px'>
						<button
							onClick={() => setActiveTab('campaigns')}
							className={`py-4 px-6 font-medium text-sm border-b-2 ${
								activeTab === 'campaigns'
									? 'border-blue-500 text-blue-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Send className='h-4 w-4 inline-block ml-1' />
							حملات الإرسال
						</button>
						<button
							onClick={() => setActiveTab('templates')}
							className={`py-4 px-6 font-medium text-sm border-b-2 ${
								activeTab === 'templates'
									? 'border-blue-500 text-blue-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<FileText className='h-4 w-4 inline-block ml-1' />
							قوالب الرسائل
						</button>
					</nav>
				</div>

				{/* محتوى التبويب النشط */}
				<div className='p-6'>
					{activeTab === 'campaigns' && (
						<div className='space-y-6'>
							{/* أدوات البحث والفلترة */}
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
										placeholder='ابحث عن حملة...'
										className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
									/>
								</div>

								{/* فلتر الحالة */}
								<div className='sm:w-40'>
									<div className='relative'>
										<select
											value={statusFilter}
											onChange={(e) => setStatusFilter(e.target.value)}
											className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm pr-8'
										>
											<option value='all'>كل الحالات</option>
											<option value='draft'>مسودة</option>
											<option value='scheduled'>مجدولة</option>
											<option value='sending'>جاري الإرسال</option>
											<option value='completed'>مكتملة</option>
											<option value='failed'>فشلت</option>
										</select>
										<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
											<ChevronDown className='h-4 w-4 text-gray-400' />
										</div>
									</div>
								</div>

								{/* فلتر التاريخ */}
								<div className='sm:w-44'>
									<div className='relative'>
										<select
											value={dateFilter}
											onChange={(e) => setDateFilter(e.target.value)}
											className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm pr-8'
										>
											<option value='all'>كل الفترات</option>
											<option value='week'>آخر أسبوع</option>
											<option value='month'>آخر شهر</option>
										</select>
										<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
											<ChevronDown className='h-4 w-4 text-gray-400' />
										</div>
									</div>
								</div>

								{/* زر إعادة تعيين الفلاتر */}
								<button
									onClick={() => {
										setSearchTerm('');
										setStatusFilter('all');
										setDateFilter('all');
									}}
									className='px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
									disabled={!searchTerm && statusFilter === 'all' && dateFilter === 'all'}
								>
									إعادة تعيين
								</button>
							</div>

							{/* قائمة الحملات */}
							{filteredCampaigns.length === 0 ? (
								<div className='bg-gray-50 p-8 rounded-lg text-center'>
									<MessageSquare className='mx-auto h-12 w-12 text-gray-300' />
									<h3 className='mt-2 text-lg font-medium text-gray-900'>لا توجد حملات</h3>
									<p className='mt-1 text-gray-500'>
										لم يتم العثور على حملات رسائل نصية مطابقة للفلاتر المحددة.
									</p>
									<div className='mt-6'>
										<Link
											href='/dashboard/marketing/sms/send'
											className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
										>
											<Send className='ml-1 -mr-1 h-4 w-4' />
											إنشاء حملة جديدة
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
													اسم الحملة
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
													الشريحة المستهدفة
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													الإرسال
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													الإحصائيات
												</th>

												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													الإحصائيات
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
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='text-sm font-medium text-gray-900'>
															{campaign.name}
														</div>
														<div className='text-xs text-gray-500'>
															تم الإنشاء: {formatDate(campaign.createdAt)}
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														{getCampaignStatusBadge(campaign.status)}
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='text-sm text-gray-900'>
															{campaign.segment.name}
														</div>
														<div className='text-xs text-gray-500'>
															{campaign.segment.count} مستلم
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='text-sm text-gray-900'>
															{campaign.scheduledAt ? (
																<span className='flex items-center'>
																	<Clock className='h-4 w-4 text-blue-500 ml-1' />
																	مجدولة: {formatDateTime(campaign.scheduledAt)}
																</span>
															) : campaign.sentAt ? (
																<span className='flex items-center'>
																	<Send className='h-4 w-4 text-green-500 ml-1' />
																	تم الإرسال: {formatDateTime(campaign.sentAt)}
																</span>
															) : (
																<span className='text-gray-500'>-</span>
															)}
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														{campaign.status === 'draft' ||
														campaign.status === 'scheduled' ? (
															<span className='text-xs text-gray-500'>
																لا توجد إحصائيات حتى الآن
															</span>
														) : (
															<div>
																<div className='flex items-center mb-1'>
																	<div className='flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden'>
																		<div
																			className={`h-1.5 rounded-full ${
																				campaign.status === 'failed'
																					? 'bg-red-500'
																					: campaign.status === 'sending'
																					? 'bg-amber-500'
																					: 'bg-green-500'
																			}`}
																			style={{
																				width: `${calculateDeliveryRate(
																					campaign
																				)}%`,
																			}}
																		></div>
																	</div>
																	<span className='text-xs font-medium text-gray-900 mr-2'>
																		{calculateDeliveryRate(campaign)}%
																	</span>
																</div>
																<div className='flex text-xs text-gray-500 justify-between'>
																	<span>{campaign.stats.delivered} تم التوصيل</span>
																	<span>{campaign.stats.failed} فشل</span>
																	<span>{campaign.stats.cost} ريال</span>
																</div>
															</div>
														)}
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-left text-sm font-medium'>
														<div className='flex items-center justify-end space-x-3 space-x-reverse'>
															<button
																onClick={() => viewCampaignDetails(campaign)}
																className='text-gray-400 hover:text-gray-500'
																title='عرض التفاصيل'
															>
																<Eye className='h-5 w-5' />
															</button>

															{campaign.status === 'draft' && (
																<Link
																	href={`/dashboard/marketing/sms/edit/${campaign.id}`}
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
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					)}

					{activeTab === 'templates' && (
						<div className='space-y-6'>
							{/* أدوات البحث للقوالب */}
							<div className='flex items-center'>
								<div className='flex-1 relative'>
									<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
										<Search className='h-5 w-5 text-gray-400' />
									</div>
									<input
										type='text'
										placeholder='ابحث عن قالب...'
										className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
									/>
								</div>
								<Link
									href='/dashboard/marketing/sms/templates/new'
									className='mr-4 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700'
								>
									<Plus className='ml-1 h-4 w-4' />
									قالب جديد
								</Link>
							</div>

							{/* قائمة القوالب */}
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								{templates.map((template) => (
									<div
										key={template.id}
										className='bg-gray-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow'
									>
										<div className='p-4 border-b border-gray-200 flex justify-between items-center'>
											<h3 className='text-base font-medium text-gray-900'>{template.name}</h3>
											<div className='flex space-x-2 space-x-reverse'>
												<button
													onClick={() => viewTemplateDetails(template)}
													className='p-1 text-gray-400 hover:text-gray-500'
													title='عرض'
												>
													<Eye className='h-5 w-5' />
												</button>
												<Link
													href={`/dashboard/marketing/sms/templates/edit/${template.id}`}
													className='p-1 text-gray-400 hover:text-gray-500'
													title='تعديل'
												>
													<Edit className='h-5 w-5' />
												</Link>
												<button className='p-1 text-gray-400 hover:text-gray-500' title='نسخ'>
													<Copy className='h-5 w-5' />
												</button>
												<button className='p-1 text-gray-400 hover:text-gray-500' title='حذف'>
													<Trash2 className='h-5 w-5' />
												</button>
											</div>
										</div>
										<div className='p-4'>
											<div className='text-sm text-gray-600 bg-white p-3 rounded border border-gray-200 h-20 overflow-hidden'>
												{template.content}
											</div>
											<div className='mt-3 flex justify-between items-center text-xs text-gray-500'>
												<div>تم الإنشاء: {formatDate(template.createdAt)}</div>
												<div>
													{template.lastUsed
														? `آخر استخدام: ${formatDate(template.lastUsed)}`
														: 'لم يتم الاستخدام بعد'}
												</div>
											</div>
											<div className='mt-4 flex justify-center'>
												<Link
													href={`/dashboard/marketing/sms/send?template=${template.id}`}
													className='px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-medium flex items-center hover:bg-blue-700'
												>
													<Send className='ml-1 h-3 w-3' />
													استخدام هذا القالب
												</Link>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* نافذة تفاصيل الحملة */}
			{showCampaignDetails && selectedCampaign && (
				<div className='fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
						<div className='p-6 border-b border-gray-200 flex items-center justify-between'>
							<h2 className='text-xl font-bold text-gray-900 flex items-center'>
								<MessageSquare className='ml-2 h-6 w-6 text-blue-600' />
								تفاصيل حملة الرسائل النصية
							</h2>
							<button
								onClick={() => setShowCampaignDetails(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-6 w-6' />
							</button>
						</div>

						<div className='p-6'>
							<div className='mb-6'>
								<div className='flex justify-between items-start'>
									<div>
										<h3 className='text-lg font-medium text-gray-900'>{selectedCampaign.name}</h3>
										<p className='text-sm text-gray-500'>
											تم الإنشاء بواسطة: {selectedCampaign.createdBy} في{' '}
											{formatDate(selectedCampaign.createdAt)}
										</p>
									</div>
									<div>{getCampaignStatusBadge(selectedCampaign.status)}</div>
								</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
								<div>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>معلومات الحملة</h4>
									<div className='bg-gray-50 rounded-lg p-4'>
										<div className='mb-3'>
											<p className='text-xs text-gray-500'>الشريحة المستهدفة</p>
											<div className='flex items-center mt-1'>
												<Users className='h-4 w-4 text-blue-500 ml-2' />
												<p className='text-sm font-medium text-gray-900'>
													{selectedCampaign.segment.name} ({selectedCampaign.segment.count}{' '}
													مستلم)
												</p>
											</div>
										</div>

										<div className='mb-3'>
											<p className='text-xs text-gray-500'>قالب الرسالة</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{selectedCampaign.template.name}
											</p>
										</div>

										<div>
											<p className='text-xs text-gray-500'>توقيت الإرسال</p>
											<div className='mt-1'>
												{selectedCampaign.scheduledAt ? (
													<div className='flex items-center'>
														<Clock className='h-4 w-4 text-blue-500 ml-1' />
														<p className='text-sm text-gray-900'>
															مجدولة: {formatDateTime(selectedCampaign.scheduledAt)}
														</p>
													</div>
												) : selectedCampaign.sentAt ? (
													<div className='flex items-center'>
														<Send className='h-4 w-4 text-green-500 ml-1' />
														<p className='text-sm text-gray-900'>
															تم الإرسال: {formatDateTime(selectedCampaign.sentAt)}
														</p>
													</div>
												) : (
													<p className='text-sm text-gray-500'>
														لم يتم تحديد وقت للإرسال بعد
													</p>
												)}
											</div>
										</div>
									</div>
								</div>

								<div>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>إحصائيات الإرسال</h4>
									<div className='bg-gray-50 rounded-lg p-4'>
										{selectedCampaign.status === 'draft' ||
										selectedCampaign.status === 'scheduled' ? (
											<div className='h-32 flex items-center justify-center'>
												<p className='text-sm text-gray-500'>
													لا توجد إحصائيات متاحة حتى يتم إرسال الحملة
												</p>
											</div>
										) : (
											<>
												<div className='flex justify-between mb-4'>
													<div className='text-center'>
														<p className='text-xs text-gray-500'>إجمالي</p>
														<p className='text-xl font-medium text-gray-900 mt-1'>
															{selectedCampaign.stats.total}
														</p>
													</div>
													<div className='text-center'>
														<p className='text-xs text-gray-500'>تم إرسالها</p>
														<p className='text-xl font-medium text-blue-600 mt-1'>
															{selectedCampaign.stats.sent}
														</p>
													</div>
													<div className='text-center'>
														<p className='text-xs text-gray-500'>تم توصيلها</p>
														<p className='text-xl font-medium text-green-600 mt-1'>
															{selectedCampaign.stats.delivered}
														</p>
													</div>
													<div className='text-center'>
														<p className='text-xs text-gray-500'>فشلت</p>
														<p className='text-xl font-medium text-red-600 mt-1'>
															{selectedCampaign.stats.failed}
														</p>
													</div>
												</div>

												<div className='mb-4'>
													<div className='flex justify-between mb-1'>
														<span className='text-xs text-gray-500'>نسبة التوصيل</span>
														<span className='text-xs font-medium text-gray-900'>
															{calculateDeliveryRate(selectedCampaign)}%
														</span>
													</div>
													<div className='w-full bg-gray-200 rounded-full h-2.5'>
														<div
															className={`h-2.5 rounded-full ${
																selectedCampaign.status === 'failed'
																	? 'bg-red-500'
																	: selectedCampaign.status === 'sending'
																	? 'bg-amber-500'
																	: 'bg-green-500'
															}`}
															style={{
																width: `${calculateDeliveryRate(selectedCampaign)}%`,
															}}
														></div>
													</div>
												</div>

												<div className='border-t border-gray-200 pt-4 mt-4'>
													<div className='flex justify-between'>
														<div>
															<p className='text-xs text-gray-500'>التكلفة الإجمالية</p>
															<p className='text-lg font-medium text-gray-900 mt-1'>
																{selectedCampaign.stats.cost} ريال
															</p>
														</div>
														<div className='text-left'>
															<p className='text-xs text-gray-500'>تكلفة الرسالة</p>
															<p className='text-sm text-gray-900 mt-1'>1 ريال / رسالة</p>
														</div>
													</div>
												</div>
											</>
										)}
									</div>
								</div>
							</div>

							<div className='mb-6'>
								<h4 className='text-sm font-medium text-gray-500 mb-2'>محتوى الرسالة</h4>
								<div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
									<p className='text-gray-900 text-sm whitespace-pre-wrap'>
										مرحباً بك في ثوب ماستر! يسعدنا انضمامك إلينا. استخدم كود WELCOME للحصول على خصم
										10% على طلبك الأول.
									</p>
								</div>
							</div>

							<div className='flex justify-between'>
								<div>
									{selectedCampaign.status === 'draft' && (
										<Link
											href={`/dashboard/marketing/sms/edit/${selectedCampaign.id}`}
											className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700'
										>
											<Edit className='ml-1 h-4 w-4' />
											تعديل الحملة
										</Link>
									)}
								</div>

								<div className='flex space-x-3 space-x-reverse'>
									{selectedCampaign.status !== 'draft' && selectedCampaign.status !== 'scheduled' && (
										<Link
											href={`/dashboard/reports/marketing/sms/${selectedCampaign.id}`}
											className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
										>
											<BarChart2 className='ml-1 h-4 w-4' />
											التقرير التفصيلي
										</Link>
									)}

									<button
										onClick={() => {}}
										className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
									>
										<Copy className='ml-1 h-4 w-4' />
										نسخ الحملة
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* نافذة تفاصيل القالب */}
			{showTemplateDetails && selectedTemplate && (
				<div className='fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg shadow-xl max-w-2xl w-full'>
						<div className='p-6 border-b border-gray-200 flex items-center justify-between'>
							<h2 className='text-xl font-bold text-gray-900 flex items-center'>
								<FileText className='ml-2 h-6 w-6 text-blue-600' />
								تفاصيل قالب الرسائل
							</h2>
							<button
								onClick={() => setShowTemplateDetails(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-6 w-6' />
							</button>
						</div>

						<div className='p-6'>
							<div className='mb-6'>
								<h3 className='text-lg font-medium text-gray-900'>{selectedTemplate.name}</h3>
								<p className='text-sm text-gray-500 mt-1'>
									تم الإنشاء: {formatDate(selectedTemplate.createdAt)}
									{selectedTemplate.lastUsed &&
										` • آخر استخدام: ${formatDate(selectedTemplate.lastUsed)}`}
								</p>
							</div>

							<div className='mb-6'>
								<h4 className='text-sm font-medium text-gray-500 mb-2'>محتوى الرسالة</h4>
								<div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
									<p className='text-gray-900 text-sm whitespace-pre-wrap'>
										{selectedTemplate.content}
									</p>
								</div>
							</div>

							<div className='mb-6'>
								<h4 className='text-sm font-medium text-gray-500 mb-2'>متغيرات الرسالة</h4>
								<div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
									<div className='grid grid-cols-2 gap-3'>
										{selectedTemplate.content.includes('{time}') && (
											<div className='flex items-center'>
												<div className='h-2 w-2 rounded-full bg-blue-500 ml-2'></div>
												<span className='text-sm text-gray-900'>{'{time}'}: وقت الموعد</span>
											</div>
										)}
										{selectedTemplate.content.includes('{order_id}') && (
											<div className='flex items-center'>
												<div className='h-2 w-2 rounded-full bg-blue-500 ml-2'></div>
												<span className='text-sm text-gray-900'>{'{order_id}'}: رقم الطلب</span>
											</div>
										)}
										{selectedTemplate.content.includes('{branch}') && (
											<div className='flex items-center'>
												<div className='h-2 w-2 rounded-full bg-blue-500 ml-2'></div>
												<span className='text-sm text-gray-900'>{'{branch}'}: اسم الفرع</span>
											</div>
										)}
										{selectedTemplate.content.includes('{discount}') && (
											<div className='flex items-center'>
												<div className='h-2 w-2 rounded-full bg-blue-500 ml-2'></div>
												<span className='text-sm text-gray-900'>
													{'{discount}'}: نسبة الخصم
												</span>
											</div>
										)}
										{selectedTemplate.content.includes('{code}') && (
											<div className='flex items-center'>
												<div className='h-2 w-2 rounded-full bg-blue-500 ml-2'></div>
												<span className='text-sm text-gray-900'>{'{code}'}: كود الخصم</span>
											</div>
										)}
										{selectedTemplate.content.includes('{end_date}') && (
											<div className='flex items-center'>
												<div className='h-2 w-2 rounded-full bg-blue-500 ml-2'></div>
												<span className='text-sm text-gray-900'>
													{'{end_date}'}: تاريخ انتهاء العرض
												</span>
											</div>
										)}
									</div>
								</div>
							</div>

							<div className='flex justify-between'>
								<Link
									href={`/dashboard/marketing/sms/templates/edit/${selectedTemplate.id}`}
									className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700'
								>
									<Edit className='ml-1 h-4 w-4' />
									تعديل القالب
								</Link>

								<div className='flex space-x-3 space-x-reverse'>
									<button
										onClick={() => {}}
										className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
									>
										<Copy className='ml-1 h-4 w-4' />
										نسخ القالب
									</button>

									<Link
										href={`/dashboard/marketing/sms/send?template=${selectedTemplate.id}`}
										className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700'
									>
										<Send className='ml-1 h-4 w-4' />
										استخدام القالب
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
