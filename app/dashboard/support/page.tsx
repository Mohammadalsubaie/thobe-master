'use client';

import {
	Activity,
	AlertCircle,
	ArrowRight,
	Bell,
	BookOpen,
	Calendar,
	Check,
	ChevronRight,
	Clock,
	ExternalLink,
	FileText,
	HelpCircle,
	LifeBuoy,
	Mail,
	MessageSquare,
	Phone,
	PlayCircle,
	Scissors,
	Search,
	Send,
	Users,
	Video,
	Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FaqCategory {
	id: string;
	name: string;
	icon: string;
	questionsCount: number;
}

interface Ticket {
	id: string;
	subject: string;
	status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
	priority: 'low' | 'medium' | 'high' | 'urgent';
	createdAt: string;
	updatedAt: string;
	departmentId: string;
	departmentName: string;
}

interface GuideCategory {
	id: string;
	name: string;
	icon: string;
	articlesCount: number;
}

export default function SupportPage() {
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [tickets, setTickets] = useState<Ticket[]>([]);
	const [faqCategories, setFaqCategories] = useState<FaqCategory[]>([]);
	const [guideCategories, setGuideCategories] = useState<GuideCategory[]>([]);
	const [popularSearches, setPopularSearches] = useState<string[]>([]);
	const [searchResults, setSearchResults] = useState<any[]>([]);
	const [showSearchResults, setShowSearchResults] = useState(false);

	// حالة البحث
	const [isSearching, setIsSearching] = useState(false);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchSupportData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية للتذاكر
			const mockTickets: Ticket[] = [
				{
					id: 'ticket-001',
					subject: 'مشكلة في إضافة طلب جديد',
					status: 'open',
					priority: 'high',
					createdAt: '2023-09-25T10:30:00',
					updatedAt: '2023-09-25T10:30:00',
					departmentId: 'dept-001',
					departmentName: 'الدعم الفني',
				},
				{
					id: 'ticket-002',
					subject: 'استفسار حول التقارير الشهرية',
					status: 'in_progress',
					priority: 'medium',
					createdAt: '2023-09-24T14:15:00',
					updatedAt: '2023-09-24T16:20:00',
					departmentId: 'dept-002',
					departmentName: 'خدمة العملاء',
				},
				{
					id: 'ticket-003',
					subject: 'طلب ميزة جديدة في نظام المخزون',
					status: 'pending',
					priority: 'low',
					createdAt: '2023-09-22T09:45:00',
					updatedAt: '2023-09-23T11:30:00',
					departmentId: 'dept-003',
					departmentName: 'تطوير المنتج',
				},
			];

			// بيانات تجريبية لفئات الأسئلة الشائعة
			const mockFaqCategories: FaqCategory[] = [
				{
					id: 'faq-cat-001',
					name: 'بدء الاستخدام',
					icon: 'zap',
					questionsCount: 8,
				},
				{
					id: 'faq-cat-002',
					name: 'إدارة الطلبات',
					icon: 'shopping-bag',
					questionsCount: 12,
				},
				{
					id: 'faq-cat-003',
					name: 'المدفوعات والفواتير',
					icon: 'credit-card',
					questionsCount: 10,
				},
				{
					id: 'faq-cat-004',
					name: 'إدارة العملاء',
					icon: 'users',
					questionsCount: 7,
				},
				{
					id: 'faq-cat-005',
					name: 'التقارير والإحصائيات',
					icon: 'bar-chart-2',
					questionsCount: 6,
				},
				{
					id: 'faq-cat-006',
					name: 'المخزون والمنتجات',
					icon: 'package',
					questionsCount: 9,
				},
			];

			// بيانات تجريبية لفئات الأدلة
			const mockGuideCategories: GuideCategory[] = [
				{
					id: 'guide-cat-001',
					name: 'أدلة المستخدم',
					icon: 'book-open',
					articlesCount: 15,
				},
				{
					id: 'guide-cat-002',
					name: 'دروس تعليمية',
					icon: 'video',
					articlesCount: 8,
				},
				{
					id: 'guide-cat-003',
					name: 'أدلة المسؤول',
					icon: 'shield',
					articlesCount: 12,
				},
				{
					id: 'guide-cat-004',
					name: 'الترقيات والتحديثات',
					icon: 'refresh-cw',
					articlesCount: 5,
				},
			];

			// بيانات تجريبية للبحث الشائع
			const mockPopularSearches = [
				'كيفية إضافة عميل جديد',
				'استرجاع كلمة المرور',
				'تعديل الطلبات',
				'إعداد الفروع',
				'إنشاء تقرير مخصص',
				'طباعة الفواتير',
			];

			setTickets(mockTickets);
			setFaqCategories(mockFaqCategories);
			setGuideCategories(mockGuideCategories);
			setPopularSearches(mockPopularSearches);
			setLoading(false);
		};

		fetchSupportData();
	}, []);

	// محاكاة البحث
	const handleSearch = () => {
		if (!searchTerm.trim()) {
			setSearchResults([]);
			setShowSearchResults(false);
			return;
		}

		setIsSearching(true);

		// محاكاة تأخير البحث
		setTimeout(() => {
			// نتائج بحث تجريبية
			const mockResults = [
				{
					type: 'faq',
					title: 'كيفية إضافة طلب جديد في النظام',
					category: 'إدارة الطلبات',
					url: '/dashboard/support/faq/order-001',
				},
				{
					type: 'guide',
					title: 'دليل شامل لإدارة الطلبات وتتبع الحالة',
					category: 'أدلة المستخدم',
					url: '/dashboard/support/guides/orders-guide',
				},
				{
					type: 'article',
					title: 'الطريقة الصحيحة لإدارة المخزون',
					category: 'المخزون والمنتجات',
					url: '/dashboard/support/articles/inventory-management',
				},
			];

			setSearchResults(mockResults);
			setShowSearchResults(true);
			setIsSearching(false);
		}, 500);
	};

	// رسم أيقونة حسب الاسم
	const renderIcon = (iconName: string) => {
		switch (iconName) {
			case 'zap':
				return <Zap className='h-5 w-5' />;
			case 'shopping-bag':
				return <Zap className='h-5 w-5' />;
			case 'credit-card':
				return <Zap className='h-5 w-5' />;
			case 'users':
				return <Users className='h-5 w-5' />;
			case 'bar-chart-2':
				return <Activity className='h-5 w-5' />;
			case 'package':
				return <Zap className='h-5 w-5' />;
			case 'book-open':
				return <BookOpen className='h-5 w-5' />;
			case 'video':
				return <Video className='h-5 w-5' />;
			case 'shield':
				return <Zap className='h-5 w-5' />;
			case 'refresh-cw':
				return <Zap className='h-5 w-5' />;
			default:
				return <HelpCircle className='h-5 w-5' />;
		}
	};

	// رسم شارة حالة التذكرة
	const renderStatusBadge = (status: string) => {
		switch (status) {
			case 'open':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						مفتوحة
					</span>
				);
			case 'in_progress':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
						قيد المعالجة
					</span>
				);
			case 'pending':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
						في انتظار الرد
					</span>
				);
			case 'resolved':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						تم الحل
					</span>
				);
			case 'closed':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						مغلقة
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

	// رسم شارة أولوية التذكرة
	const renderPriorityBadge = (priority: string) => {
		switch (priority) {
			case 'low':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						منخفضة
					</span>
				);
			case 'medium':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						متوسطة
					</span>
				);
			case 'high':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
						عالية
					</span>
				);
			case 'urgent':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						عاجلة
					</span>
				);
			default:
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						{priority}
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
			hour: '2-digit',
			minute: '2-digit',
		});
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
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<LifeBuoy className='inline-block ml-2 h-6 w-6 text-blue-600' />
						المساعدة والدعم
					</h1>
					<p className='mt-1 text-sm text-gray-600'>
						اعثر على إجابات لأسئلتك وتواصل مع فريق الدعم للحصول على المساعدة
					</p>
				</div>

				<div className='flex gap-2'>
					<Link
						href='/dashboard/support/tickets/new'
						className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700'
					>
						<Send className='ml-1 h-4 w-4' />
						تذكرة دعم جديدة
					</Link>

					<Link
						href='https://meetings.thobmaster.com'
						target='_blank'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Video className='ml-1 h-4 w-4' />
						جدولة اجتماع
						<ExternalLink className='mr-1 h-3 w-3' />
					</Link>
				</div>
			</div>

			{/* مربع البحث */}
			<div className='bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 shadow-md relative overflow-hidden'>
				<div className='absolute top-0 left-0 w-full h-full opacity-10'>
					<div className='absolute top-8 left-8 w-32 h-32 rounded-full bg-white'></div>
					<div className='absolute bottom-8 right-8 w-48 h-48 rounded-full bg-white'></div>
				</div>

				<div className='relative z-10'>
					<h2 className='text-xl font-bold text-white mb-2'>كيف يمكننا مساعدتك اليوم؟</h2>
					<p className='text-blue-100 mb-6 text-sm'>
						ابحث عن إجابات لأسئلتك أو تصفح موضوعات المساعدة الشائعة
					</p>

					<div className='relative'>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
							placeholder='ابحث عن سؤال أو موضوع...'
							className='block w-full pl-12 pr-4 py-3 border-0 rounded-lg focus:ring-2 focus:ring-white shadow-sm text-gray-900'
						/>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<button
							onClick={handleSearch}
							className='absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 hover:text-blue-800'
						>
							{isSearching ? (
								<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600'></div>
							) : (
								<ArrowRight className='h-5 w-5' />
							)}
						</button>
					</div>

					{/* نتائج البحث */}
					{showSearchResults && (
						<div className='absolute z-20 top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-80 overflow-y-auto'>
							{searchResults.length > 0 ? (
								<>
									<div className='p-4 border-b border-gray-200'>
										<h3 className='text-sm font-medium text-gray-700'>
											نتائج البحث لـ "{searchTerm}"
										</h3>
									</div>
									<ul>
										{searchResults.map((result, index) => (
											<li key={index} className='hover:bg-gray-50'>
												<Link
													href={result.url}
													className='block px-4 py-3 border-b border-gray-100'
												>
													<div className='flex items-start'>
														<div
															className={`flex-shrink-0 rounded-full p-1 mr-3 ${
																result.type === 'faq'
																	? 'bg-blue-100 text-blue-600'
																	: result.type === 'guide'
																	? 'bg-green-100 text-green-600'
																	: 'bg-purple-100 text-purple-600'
															}`}
														>
															{result.type === 'faq' ? (
																<HelpCircle className='h-4 w-4' />
															) : result.type === 'guide' ? (
																<BookOpen className='h-4 w-4' />
															) : (
																<FileText className='h-4 w-4' />
															)}
														</div>
														<div>
															<p className='text-sm font-medium text-gray-900'>
																{result.title}
															</p>
															<p className='text-xs text-gray-500 mt-0.5'>
																{result.category}
															</p>
														</div>
													</div>
												</Link>
											</li>
										))}
									</ul>
									<div className='p-3 border-t border-gray-200 bg-gray-50 text-center'>
										<Link
											href={`/dashboard/support/search?q=${encodeURIComponent(searchTerm)}`}
											className='text-sm text-blue-600 hover:text-blue-800 font-medium'
										>
											عرض كافة النتائج
										</Link>
									</div>
								</>
							) : (
								<div className='p-8 text-center'>
									<div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100'>
										<Search className='h-6 w-6 text-blue-600' />
									</div>
									<h3 className='mt-2 text-sm font-medium text-gray-900'>لا توجد نتائج</h3>
									<p className='mt-1 text-sm text-gray-500'>
										لم نتمكن من العثور على نتائج مطابقة لـ "{searchTerm}"
									</p>
								</div>
							)}
						</div>
					)}

					{/* عمليات البحث الشائعة */}
					<div className='mt-4 flex flex-wrap gap-2'>
						{popularSearches.map((search, index) => (
							<button
								key={index}
								onClick={() => {
									setSearchTerm(search);
									handleSearch();
								}}
								className='inline-flex items-center px-3 py-1 rounded-full bg-white bg-opacity-20 text-sm text-white hover:bg-opacity-30 transition-colors duration-200'
							>
								{search}
							</button>
						))}
					</div>
				</div>
			</div>

			{/* قنوات الدعم السريع */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200'>
					<div className='flex flex-col items-center text-center'>
						<div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3'>
							<Phone className='h-6 w-6 text-blue-600' />
						</div>
						<h3 className='text-lg font-medium text-gray-900'>اتصل بنا</h3>
						<p className='text-sm text-gray-500 mt-1 mb-3'>تحدث مع أحد ممثلي الدعم لدينا</p>
						<div className='text-blue-600 font-medium'>920001234</div>
						<div className='text-sm text-gray-500 mt-1'>9 صباحًا - 6 مساءً، الأحد - الخميس</div>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200'>
					<div className='flex flex-col items-center text-center'>
						<div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3'>
							<MessageSquare className='h-6 w-6 text-green-600' />
						</div>
						<h3 className='text-lg font-medium text-gray-900'>الدردشة المباشرة</h3>
						<p className='text-sm text-gray-500 mt-1 mb-3'>دردش مع فريق الدعم الفني مباشرة</p>
						<button className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 inline-flex items-center'>
							<MessageSquare className='ml-1 h-4 w-4' />
							بدء الدردشة
						</button>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200'>
					<div className='flex flex-col items-center text-center'>
						<div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-3'>
							<Mail className='h-6 w-6 text-purple-600' />
						</div>
						<h3 className='text-lg font-medium text-gray-900'>البريد الإلكتروني</h3>
						<p className='text-sm text-gray-500 mt-1 mb-3'>أرسل لنا بريدًا إلكترونيًا وسنرد عليك</p>
						<a href='mailto:support@thobmaster.com' className='text-purple-600 font-medium hover:underline'>
							support@thobmaster.com
						</a>
						<div className='text-sm text-gray-500 mt-1'>وقت الاستجابة: خلال 24 ساعة</div>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200'>
					<div className='flex flex-col items-center text-center'>
						<div className='w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-3'>
							<Video className='h-6 w-6 text-amber-600' />
						</div>
						<h3 className='text-lg font-medium text-gray-900'>دعم عن بُعد</h3>
						<p className='text-sm text-gray-500 mt-1 mb-3'>جدولة اجتماع عبر الإنترنت مع متخصص</p>
						<a
							href='https://meetings.thobmaster.com'
							target='_blank'
							className='px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium hover:bg-amber-700 inline-flex items-center'
						>
							<Calendar className='ml-1 h-4 w-4' />
							حجز موعد
						</a>
					</div>
				</div>
			</div>

			{/* الأسئلة الشائعة والأدلة */}
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{/* الأسئلة الشائعة */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='p-6 border-b border-gray-200 flex justify-between items-center'>
						<div>
							<h2 className='text-lg font-medium text-gray-900 flex items-center'>
								<HelpCircle className='inline-block ml-2 h-5 w-5 text-blue-600' />
								الأسئلة الشائعة
							</h2>
							<p className='text-sm text-gray-500'>الإجابات على الأسئلة المتداولة</p>
						</div>
						<Link
							href='/dashboard/support/faq'
							className='text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center'
						>
							عرض الكل
							<ChevronRight className='mr-1 h-4 w-4' />
						</Link>
					</div>

					<div className='divide-y divide-gray-200'>
						{faqCategories.slice(0, 4).map((category) => (
							<Link
								key={category.id}
								href={`/dashboard/support/faq/category/${category.id}`}
								className='block p-6 hover:bg-gray-50'
							>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-4'>
										{renderIcon(category.icon)}
									</div>
									<div className='flex-1'>
										<h3 className='text-base font-medium text-gray-900'>{category.name}</h3>
										<p className='text-sm text-gray-500 mt-1'>
											{category.questionsCount} سؤال وجواب
										</p>
									</div>
									<ChevronRight className='h-5 w-5 text-gray-400' />
								</div>
							</Link>
						))}
					</div>
				</div>

				{/* الأدلة والموارد */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='p-6 border-b border-gray-200 flex justify-between items-center'>
						<div>
							<h2 className='text-lg font-medium text-gray-900 flex items-center'>
								<BookOpen className='inline-block ml-2 h-5 w-5 text-green-600' />
								الأدلة والموارد
							</h2>
							<p className='text-sm text-gray-500'>أدلة المستخدم والموارد التعليمية</p>
						</div>
						<Link
							href='/dashboard/support/guides'
							className='text-sm text-green-600 hover:text-green-800 font-medium flex items-center'
						>
							عرض الكل
							<ChevronRight className='mr-1 h-4 w-4' />
						</Link>
					</div>

					<div className='divide-y divide-gray-200'>
						{guideCategories.map((category) => (
							<Link
								key={category.id}
								href={`/dashboard/support/guides/category/${category.id}`}
								className='block p-6 hover:bg-gray-50'
							>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-4'>
										{renderIcon(category.icon)}
									</div>
									<div className='flex-1'>
										<h3 className='text-base font-medium text-gray-900'>{category.name}</h3>
										<p className='text-sm text-gray-500 mt-1'>{category.articlesCount} مقال</p>
									</div>
									<ChevronRight className='h-5 w-5 text-gray-400' />
								</div>
							</Link>
						))}
					</div>
				</div>
			</div>

			{/* تذاكر الدعم */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-6 border-b border-gray-200 flex justify-between items-center'>
					<div>
						<h2 className='text-lg font-medium text-gray-900 flex items-center'>
							<MessageSquare className='inline-block ml-2 h-5 w-5 text-indigo-600' />
							تذاكر الدعم الخاصة بك
						</h2>
						<p className='text-sm text-gray-500'>آخر طلبات الدعم الخاصة بك</p>
					</div>
					<Link
						href='/dashboard/support/tickets'
						className='text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center'
					>
						عرض الكل
						<ChevronRight className='mr-1 h-4 w-4' />
					</Link>
				</div>

				<div>
					{tickets.length > 0 ? (
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											رقم التذكرة
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											الموضوع
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											القسم
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
											الأولوية
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											آخر تحديث
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{tickets.map((ticket) => (
										<tr key={ticket.id} className='hover:bg-gray-50'>
											<td className='px-6 py-4 whitespace-nowrap'>
												<Link
													href={`/dashboard/support/tickets/${ticket.id}`}
													className='text-blue-600 hover:text-blue-800 font-medium'
												>
													#{ticket.id.split('-')[1]}
												</Link>
											</td>
											<td className='px-6 py-4'>
												<Link
													href={`/dashboard/support/tickets/${ticket.id}`}
													className='text-gray-900 hover:text-blue-600'
												>
													{ticket.subject}
												</Link>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<span className='text-sm text-gray-500'>{ticket.departmentName}</span>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{renderStatusBadge(ticket.status)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{renderPriorityBadge(ticket.priority)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
												<div className='flex items-center'>
													<Clock className='h-4 w-4 ml-1 text-gray-400' />
													{formatDate(ticket.updatedAt)}
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className='text-center py-12'>
							<MessageSquare className='h-12 w-12 text-gray-300 mx-auto' />
							<h3 className='mt-2 text-lg font-medium text-gray-900'>لا توجد تذاكر</h3>
							<p className='mt-1 text-gray-500'>لم تقم بإنشاء أي تذاكر دعم بعد</p>
							<div className='mt-6'>
								<Link
									href='/dashboard/support/tickets/new'
									className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
								>
									<Send className='ml-1 -mr-1 h-4 w-4' />
									إنشاء تذكرة جديدة
								</Link>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* موارد تعليمية سريعة وفيديوهات */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='p-6 border-b border-gray-200 flex justify-between items-center'>
						<div>
							<h2 className='text-lg font-medium text-gray-900 flex items-center'>
								<PlayCircle className='inline-block ml-2 h-5 w-5 text-red-600' />
								دروس تعليمية سريعة
							</h2>
							<p className='text-sm text-gray-500'>مقاطع فيديو إرشادية قصيرة</p>
						</div>
						<Link
							href='/dashboard/support/tutorials'
							className='text-sm text-red-600 hover:text-red-800 font-medium flex items-center'
						>
							عرض الكل
							<ChevronRight className='mr-1 h-4 w-4' />
						</Link>
					</div>

					<div className='p-6 grid grid-cols-1 sm:grid-cols-2 gap-6'>
						<div className='rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200'>
							<div className='aspect-w-16 aspect-h-9 bg-gray-100 relative group'>
								<img
									src='/images/tutorial-1.jpg'
									alt='كيفية إضافة طلب جديد'
									className='object-cover w-full h-full'
								/>
								<div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
									<PlayCircle className='h-16 w-16 text-white' />
								</div>
							</div>
							<div className='p-4'>
								<h3 className='text-sm font-medium text-gray-900'>كيفية إضافة طلب جديد</h3>
								<p className='text-xs text-gray-500 mt-1'>3:45 دقيقة</p>
							</div>
						</div>

						<div className='rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200'>
							<div className='aspect-w-16 aspect-h-9 bg-gray-100 relative group'>
								<img
									src='/images/tutorial-2.jpg'
									alt='إعداد المقاسات المخصصة'
									className='object-cover w-full h-full'
								/>
								<div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
									<PlayCircle className='h-16 w-16 text-white' />
								</div>
							</div>
							<div className='p-4'>
								<h3 className='text-sm font-medium text-gray-900'>إعداد المقاسات المخصصة</h3>
								<p className='text-xs text-gray-500 mt-1'>5:12 دقيقة</p>
							</div>
						</div>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='p-6 border-b border-gray-200'>
						<h2 className='text-lg font-medium text-gray-900 flex items-center'>
							<Zap className='inline-block ml-2 h-5 w-5 text-amber-600' />
							روابط سريعة
						</h2>
						<p className='text-sm text-gray-500'>موارد ومقالات مفيدة</p>
					</div>

					<div className='divide-y divide-gray-200'>
						<Link href='/dashboard/support/guides/getting-started' className='block p-4 hover:bg-gray-50'>
							<div className='flex items-center'>
								<Zap className='h-5 w-5 text-amber-500 ml-2' />
								<span className='text-sm font-medium text-gray-900'>دليل البدء السريع</span>
							</div>
						</Link>

						<Link href='/dashboard/support/guides/measurements' className='block p-4 hover:bg-gray-50'>
							<div className='flex items-center'>
								<Scissors className='h-5 w-5 text-gray-500 ml-2' />
								<span className='text-sm font-medium text-gray-900'>دليل المقاسات</span>
							</div>
						</Link>

						<Link href='/dashboard/support/guides/import' className='block p-4 hover:bg-gray-50'>
							<div className='flex items-center'>
								<Activity className='h-5 w-5 text-gray-500 ml-2' />
								<span className='text-sm font-medium text-gray-900'>استيراد البيانات</span>
							</div>
						</Link>

						<Link href='/dashboard/support/guides/reports' className='block p-4 hover:bg-gray-50'>
							<div className='flex items-center'>
								<Activity className='h-5 w-5 text-gray-500 ml-2' />
								<span className='text-sm font-medium text-gray-900'>تقارير الأداء</span>
							</div>
						</Link>

						<Link href='/dashboard/support/guides/admin' className='block p-4 hover:bg-gray-50'>
							<div className='flex items-center'>
								<Users className='h-5 w-5 text-gray-500 ml-2' />
								<span className='text-sm font-medium text-gray-900'>دليل المسؤول</span>
							</div>
						</Link>
					</div>
				</div>
			</div>

			{/* اتصل بنا وتحديثات النظام */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* تحديثات النظام */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='p-6 border-b border-gray-200'>
						<h2 className='text-lg font-medium text-gray-900 flex items-center'>
							<Bell className='inline-block ml-2 h-5 w-5 text-purple-600' />
							آخر التحديثات
						</h2>
						<p className='text-sm text-gray-500'>أحدث الميزات والتحسينات</p>
					</div>

					<div className='divide-y divide-gray-200'>
						<div className='p-4'>
							<div className='flex items-start'>
								<div className='flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
									<Check className='h-4 w-4' />
								</div>
								<div>
									<h3 className='text-sm font-medium text-gray-900'>تم إطلاق النسخة 2.5.0</h3>
									<p className='text-xs text-gray-500 mt-1'>منذ 3 أيام</p>
									<p className='text-sm text-gray-700 mt-2'>
										تحسينات في واجهة المستخدم وإضافة ميزات جديدة لإدارة الطلبات
									</p>
								</div>
							</div>
						</div>

						<div className='p-4'>
							<div className='flex items-start'>
								<div className='flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
									<Bell className='h-4 w-4' />
								</div>
								<div>
									<h3 className='text-sm font-medium text-gray-900'>تحديث نظام المخزون</h3>
									<p className='text-xs text-gray-500 mt-1'>منذ أسبوع</p>
									<p className='text-sm text-gray-700 mt-2'>
										تحسينات في نظام إدارة المخزون وتتبع المنتجات
									</p>
								</div>
							</div>
						</div>

						<div className='p-4'>
							<div className='flex items-start'>
								<div className='flex-shrink-0 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ml-3'>
									<AlertCircle className='h-4 w-4' />
								</div>
								<div>
									<h3 className='text-sm font-medium text-gray-900'>صيانة مجدولة</h3>
									<p className='text-xs text-gray-500 mt-1'>الأحد، 5 أكتوبر، 2 صباحًا - 4 صباحًا</p>
									<p className='text-sm text-gray-700 mt-2'>
										سيكون النظام غير متاح لفترة قصيرة خلال فترة الصيانة
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className='p-4 bg-gray-50 border-t border-gray-200 text-center'>
						<Link
							href='/dashboard/support/updates'
							className='text-sm text-purple-600 hover:text-purple-800 font-medium flex items-center justify-center'
						>
							عرض جميع التحديثات
							<ChevronRight className='mr-1 h-4 w-4' />
						</Link>
					</div>
				</div>

				{/* نماذج الاتصال وطلب الميزات */}
				<div className='lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6'>
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
						<div className='h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4'>
							<Mail className='h-6 w-6' />
						</div>
						<h3 className='text-lg font-medium text-gray-900 mb-2'>اتصل بنا</h3>
						<p className='text-sm text-gray-500 mb-4'>
							هل لديك استفسار أو مشكلة؟ راسلنا وسنقوم بالرد عليك في أقرب وقت ممكن
						</p>
						<Link
							href='/dashboard/support/contact'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
						>
							<Mail className='ml-1 -mr-1 h-4 w-4' />
							ارسل رسالة
						</Link>
					</div>

					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
						<div className='h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4'>
							<Zap className='h-6 w-6' />
						</div>
						<h3 className='text-lg font-medium text-gray-900 mb-2'>اقترح ميزة جديدة</h3>
						<p className='text-sm text-gray-500 mb-4'>
							هل لديك فكرة لتحسين النظام؟ شاركنا أفكارك واقتراحاتك
						</p>
						<Link
							href='/dashboard/support/feature-request'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700'
						>
							<Zap className='ml-1 -mr-1 h-4 w-4' />
							اقترح ميزة
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
