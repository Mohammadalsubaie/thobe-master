'use client';

import {
	ArrowDown,
	ArrowLeft,
	BookOpen,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	Clock,
	Download,
	Eye,
	FileText,
	HelpCircle,
	MessageSquare,
	Play,
	Search,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface GuideCategory {
	id: string;
	name: string;
	slug: string;
	description: string;
	icon: string;
	articlesCount: number;
}

interface GuideArticle {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	categoryId: string;
	categoryName: string;
	createdAt: string;
	updatedAt: string;
	viewCount: number;
	type: 'text' | 'video';
	duration?: string;
	hasDownload: boolean;
}

export default function UserGuidePage() {
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState<GuideCategory[]>([]);
	const [popularArticles, setPopularArticles] = useState<GuideArticle[]>([]);
	const [recentArticles, setRecentArticles] = useState<GuideArticle[]>([]);
	const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<GuideArticle[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [showSearchResults, setShowSearchResults] = useState(false);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchGuideData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية لفئات الأدلة
			const mockCategories: GuideCategory[] = [
				{
					id: 'cat-001',
					name: 'البدء باستخدام النظام',
					slug: 'getting-started',
					description: 'كل ما تحتاج معرفته للبدء باستخدام نظام ثوب ماستر',
					icon: 'rocket',
					articlesCount: 6,
				},
				{
					id: 'cat-002',
					name: 'إدارة الطلبات',
					slug: 'orders-management',
					description: 'تعلم كيفية إنشاء وإدارة الطلبات ومتابعة حالتها',
					icon: 'shopping-bag',
					articlesCount: 8,
				},
				{
					id: 'cat-003',
					name: 'إدارة العملاء',
					slug: 'customers-management',
					description: 'إضافة وتعديل بيانات العملاء وإدارة علاقتك معهم',
					icon: 'users',
					articlesCount: 5,
				},
				{
					id: 'cat-004',
					name: 'تقارير وإحصائيات',
					slug: 'reports-statistics',
					description: 'كيفية الوصول وتحليل البيانات واستخراج التقارير',
					icon: 'bar-chart-2',
					articlesCount: 4,
				},
				{
					id: 'cat-005',
					name: 'إدارة المقاسات',
					slug: 'measurements',
					description: 'إدارة وتتبع المقاسات وضبط القوالب المخصصة',
					icon: 'scissors',
					articlesCount: 7,
				},
				{
					id: 'cat-006',
					name: 'إعدادات النظام',
					slug: 'system-settings',
					description: 'تخصيص وضبط إعدادات النظام حسب احتياجات عملك',
					icon: 'settings',
					articlesCount: 5,
				},
			];

			// بيانات تجريبية للأدلة المشهورة
			const mockPopularArticles: GuideArticle[] = [
				{
					id: 'art-001',
					title: 'كيفية إنشاء طلب جديد',
					slug: 'how-to-create-new-order',
					excerpt: 'دليل خطوة بخطوة لإنشاء وإدارة طلب جديد في النظام',
					categoryId: 'cat-002',
					categoryName: 'إدارة الطلبات',
					createdAt: '2023-07-15T10:30:00',
					updatedAt: '2023-09-20T14:15:00',
					viewCount: 1245,
					type: 'text',
					hasDownload: true,
				},
				{
					id: 'art-002',
					title: 'إضافة مقاسات العميل',
					slug: 'adding-customer-measurements',
					excerpt: 'شرح مفصل لكيفية إضافة وتعديل مقاسات العملاء',
					categoryId: 'cat-005',
					categoryName: 'إدارة المقاسات',
					createdAt: '2023-07-18T11:45:00',
					updatedAt: '2023-09-15T09:30:00',
					viewCount: 987,
					type: 'video',
					duration: '8:35',
					hasDownload: false,
				},
				{
					id: 'art-003',
					title: 'إعداد النظام للمرة الأولى',
					slug: 'first-time-setup',
					excerpt: 'دليل شامل لإعداد النظام وتجهيزه للاستخدام لأول مرة',
					categoryId: 'cat-001',
					categoryName: 'البدء باستخدام النظام',
					createdAt: '2023-06-12T13:15:00',
					updatedAt: '2023-09-10T15:45:00',
					viewCount: 1532,
					type: 'text',
					hasDownload: true,
				},
				{
					id: 'art-004',
					title: 'إنشاء تقارير المبيعات',
					slug: 'creating-sales-reports',
					excerpt: 'تعلم كيفية إنشاء وتخصيص تقارير المبيعات الشهرية والسنوية',
					categoryId: 'cat-004',
					categoryName: 'تقارير وإحصائيات',
					createdAt: '2023-08-05T09:00:00',
					updatedAt: '2023-09-05T10:30:00',
					viewCount: 756,
					type: 'video',
					duration: '12:20',
					hasDownload: true,
				},
			];

			// بيانات تجريبية للأدلة الحديثة
			const mockRecentArticles: GuideArticle[] = [
				{
					id: 'art-005',
					title: 'استخدام نظام الولاء ونقاط المكافآت',
					slug: 'loyalty-system-guide',
					excerpt: 'دليل كامل لكيفية إعداد واستخدام نظام الولاء ونقاط المكافآت',
					categoryId: 'cat-003',
					categoryName: 'إدارة العملاء',
					createdAt: '2023-09-28T14:20:00',
					updatedAt: '2023-09-28T14:20:00',
					viewCount: 145,
					type: 'text',
					hasDownload: false,
				},
				{
					id: 'art-006',
					title: 'تخصيص الإشعارات التلقائية',
					slug: 'customizing-automatic-notifications',
					excerpt: 'كيفية تخصيص وضبط الإشعارات التلقائية للعملاء والموظفين',
					categoryId: 'cat-006',
					categoryName: 'إعدادات النظام',
					createdAt: '2023-09-25T11:10:00',
					updatedAt: '2023-09-25T11:10:00',
					viewCount: 98,
					type: 'text',
					hasDownload: false,
				},
				{
					id: 'art-007',
					title: 'التكامل مع نظام المحاسبة',
					slug: 'accounting-integration',
					excerpt: 'كيفية ربط نظام ثوب ماستر مع أنظمة المحاسبة الخارجية',
					categoryId: 'cat-006',
					categoryName: 'إعدادات النظام',
					createdAt: '2023-09-22T15:45:00',
					updatedAt: '2023-09-22T15:45:00',
					viewCount: 112,
					type: 'video',
					duration: '15:40',
					hasDownload: true,
				},
			];

			setCategories(mockCategories);
			setPopularArticles(mockPopularArticles);
			setRecentArticles(mockRecentArticles);
			setLoading(false);
		};

		fetchGuideData();
	}, []);

	// محاكاة البحث في الأدلة
	const handleSearch = () => {
		if (!searchTerm.trim()) {
			setSearchResults([]);
			setShowSearchResults(false);
			return;
		}

		setIsSearching(true);
		setShowSearchResults(true);

		// محاكاة تأخير البحث
		setTimeout(() => {
			// بحث في الأدلة الشائعة والحديثة
			const results = [...popularArticles, ...recentArticles].filter(
				(article) =>
					article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
					article.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
			);

			setSearchResults(results);
			setIsSearching(false);
		}, 500);
	};

	// توسيع/طي الفئة
	const toggleCategory = (categoryId: string) => {
		if (expandedCategory === categoryId) {
			setExpandedCategory(null);
		} else {
			setExpandedCategory(categoryId);
		}
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
			<div className='flex items-center'>
				<Link href='/dashboard/support' className='flex items-center text-gray-500 hover:text-gray-700 ml-4'>
					<ArrowLeft className='h-5 w-5' />
					<span className='mr-1 text-sm'>العودة</span>
				</Link>
				<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
					<BookOpen className='inline-block ml-2 h-6 w-6 text-blue-600' />
					دليل استخدام النظام
				</h1>
			</div>

			{/* مربع البحث */}
			<div className='bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 shadow-md relative overflow-hidden'>
				<div className='absolute top-0 left-0 w-full h-full opacity-10'>
					<div className='absolute top-8 left-8 w-32 h-32 rounded-full bg-white'></div>
					<div className='absolute bottom-8 right-8 w-48 h-48 rounded-full bg-white'></div>
				</div>

				<div className='relative z-10'>
					<h2 className='text-xl font-bold text-white mb-2'>ما الذي تبحث عنه؟</h2>
					<p className='text-blue-100 mb-6 text-sm'>
						ابحث في دليل الاستخدام للعثور على الإرشادات والشروحات التي تحتاجها
					</p>

					<div className='relative'>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
							placeholder='ابحث في دليل الاستخدام...'
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
								'بحث'
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
										{searchResults.map((article) => (
											<li key={article.id} className='hover:bg-gray-50'>
												<Link
													href={`/dashboard/support/guide/${article.categoryId}/${article.slug}`}
													className='block px-4 py-3 border-b border-gray-100'
												>
													<div className='flex items-start'>
														<div
															className={`flex-shrink-0 rounded-full p-1 mr-3 ${
																article.type === 'text'
																	? 'bg-blue-100 text-blue-600'
																	: 'bg-red-100 text-red-600'
															}`}
														>
															{article.type === 'text' ? (
																<FileText className='h-4 w-4' />
															) : (
																<Play className='h-4 w-4' />
															)}
														</div>
														<div>
															<p className='text-sm font-medium text-gray-900'>
																{article.title}
															</p>
															<p className='text-xs text-gray-500 mt-0.5'>
																{article.categoryName}
															</p>
														</div>
													</div>
												</Link>
											</li>
										))}
									</ul>
									<div className='p-3 border-t border-gray-200 bg-gray-50 text-center'>
										<Link
											href={`/dashboard/support/guide/search?q=${encodeURIComponent(searchTerm)}`}
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
				</div>
			</div>

			{/* المقالات الشائعة */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-lg font-medium text-gray-900'>الأدلة الأكثر مشاهدة</h2>
					<Link
						href='/dashboard/support/guide/popular'
						className='text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center'
					>
						عرض الكل
						<ChevronRight className='mr-1 h-4 w-4' />
					</Link>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
					{popularArticles.map((article) => (
						<Link
							key={article.id}
							href={`/dashboard/support/guide/${article.categoryId}/${article.slug}`}
							className='group block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200'
						>
							<div className='flex items-center mb-2'>
								<div
									className={`flex-shrink-0 p-1.5 rounded-md ${
										article.type === 'text'
											? 'bg-blue-100 text-blue-600'
											: 'bg-red-100 text-red-600'
									} ml-2`}
								>
									{article.type === 'text' ? (
										<FileText className='h-4 w-4' />
									) : (
										<Play className='h-4 w-4' />
									)}
								</div>
								<span className='text-xs text-gray-500'>{article.categoryName}</span>
							</div>

							<h3 className='text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200 mb-2'>
								{article.title}
							</h3>

							<p className='text-sm text-gray-500 line-clamp-2 mb-3'>{article.excerpt}</p>

							<div className='flex items-center justify-between text-xs text-gray-500'>
								<span className='flex items-center'>
									<Eye className='h-3 w-3 ml-1' />
									{article.viewCount} مشاهدة
								</span>

								<div className='flex items-center'>
									{article.type === 'video' && article.duration && (
										<span className='flex items-center ml-2'>
											<Clock className='h-3 w-3 ml-1' />
											{article.duration}
										</span>
									)}

									{article.hasDownload && (
										<span className='flex items-center'>
											<Download className='h-3 w-3 ml-1' />
											PDF
										</span>
									)}
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* فئات الأدلة */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<h2 className='text-lg font-medium text-gray-900 mb-6'>فهرس دليل الاستخدام</h2>

				<div className='space-y-4'>
					{categories.map((category) => (
						<div key={category.id} className='border border-gray-200 rounded-lg overflow-hidden'>
							<button
								onClick={() => toggleCategory(category.id)}
								className='w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 text-right'
							>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
										<BookOpen className='h-5 w-5' />
									</div>
									<div>
										<h3 className='text-base font-medium text-gray-900'>{category.name}</h3>
										<p className='text-sm text-gray-500'>{category.articlesCount} دليل</p>
									</div>
								</div>
								{expandedCategory === category.id ? (
									<ChevronUp className='h-5 w-5 text-gray-400' />
								) : (
									<ChevronDown className='h-5 w-5 text-gray-400' />
								)}
							</button>

							{expandedCategory === category.id && (
								<div className='p-4 border-t border-gray-200'>
									<p className='text-sm text-gray-600 mb-4'>{category.description}</p>
									<Link
										href={`/dashboard/support/guide/category/${category.slug}`}
										className='inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium'
									>
										عرض جميع الأدلة في هذا القسم
										<ArrowDown className='mr-1 h-4 w-4' />
									</Link>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* فيديوهات توضيحية */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-lg font-medium text-gray-900'>فيديوهات توضيحية</h2>
					<Link
						href='/dashboard/support/guide/videos'
						className='text-sm text-red-600 hover:text-red-800 font-medium flex items-center'
					>
						عرض الكل
						<ChevronRight className='mr-1 h-4 w-4' />
					</Link>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
					{popularArticles
						.concat(recentArticles)
						.filter((a) => a.type === 'video')
						.slice(0, 3)
						.map((video) => (
							<div key={video.id} className='border border-gray-200 rounded-lg overflow-hidden group'>
								<div className='aspect-w-16 aspect-h-9 bg-gray-100 relative'>
									<img
										src={`/images/video-thumbnail-${video.id}.jpg`}
										alt={video.title}
										className='object-cover w-full h-full'
									/>
									<div className='absolute inset-0 flex items-center justify-center'>
										<div className='rounded-full h-12 w-12 bg-white bg-opacity-75 shadow-lg flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all duration-300'>
											<Play className='h-6 w-6' />
										</div>
									</div>
									<div className='absolute bottom-2 left-2 bg-gray-900 bg-opacity-75 text-white text-xs px-2 py-1 rounded'>
										{video.duration}
									</div>
								</div>
								<div className='p-4'>
									<h3 className='text-base font-medium text-gray-900 mb-1'>{video.title}</h3>
									<p className='text-sm text-gray-500 mb-2'>{video.categoryName}</p>
									<Link
										href={`/dashboard/support/guide/${video.categoryId}/${video.slug}`}
										className='text-sm text-blue-600 hover:text-blue-800 font-medium'
									>
										مشاهدة الفيديو
									</Link>
								</div>
							</div>
						))}
				</div>
			</div>

			{/* أحدث الأدلة */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex justify-between items-center mb-6'>
					<h2 className='text-lg font-medium text-gray-900'>أحدث الأدلة المضافة</h2>
					<Link
						href='/dashboard/support/guide/recent'
						className='text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center'
					>
						عرض الكل
						<ChevronRight className='mr-1 h-4 w-4' />
					</Link>
				</div>

				<div className='space-y-4'>
					{recentArticles.map((article) => (
						<Link
							key={article.id}
							href={`/dashboard/support/guide/${article.categoryId}/${article.slug}`}
							className='block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200'
						>
							<div className='flex items-start'>
								<div
									className={`flex-shrink-0 p-2 rounded-md ${
										article.type === 'text'
											? 'bg-blue-100 text-blue-600'
											: 'bg-red-100 text-red-600'
									} ml-3`}
								>
									{article.type === 'text' ? (
										<FileText className='h-5 w-5' />
									) : (
										<Play className='h-5 w-5' />
									)}
								</div>

								<div className='flex-1'>
									<div className='flex items-center justify-between'>
										<span className='text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded'>
											{article.categoryName}
										</span>
										<span className='text-xs text-gray-500'>
											{new Date(article.createdAt).toLocaleDateString('ar-SA', {
												year: 'numeric',
												month: 'short',
												day: 'numeric',
											})}
										</span>
									</div>

									<h3 className='text-base font-medium text-gray-900 mt-1 mb-1'>{article.title}</h3>

									<p className='text-sm text-gray-600 line-clamp-1'>{article.excerpt}</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* هل تحتاج إلى مساعدة أخرى؟ */}
			<div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
				<div className='flex flex-col md:flex-row items-center'>
					<div className='flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 md:mb-0 md:ml-4'>
						<HelpCircle className='h-8 w-8' />
					</div>
					<div className='text-center md:text-right flex-1'>
						<h3 className='text-lg font-medium text-gray-900'>هل تحتاج إلى مساعدة أخرى؟</h3>
						<p className='mt-1 text-gray-600'>
							إذا لم تجد ما تبحث عنه في دليل الاستخدام، يمكنك التواصل مع فريق الدعم الفني
						</p>
						<div className='mt-4 flex flex-wrap items-center justify-center md:justify-start gap-3'>
							<Link
								href='/dashboard/support/faq'
								className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
							>
								<HelpCircle className='ml-1 h-4 w-4 text-gray-500' />
								الأسئلة الشائعة
							</Link>
							<Link
								href='/dashboard/support/contact'
								className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
							>
								<MessageSquare className='ml-1 h-4 w-4' />
								تواصل مع الدعم
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
