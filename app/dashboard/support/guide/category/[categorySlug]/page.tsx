'use client';

import {
	AlertCircle,
	ArrowLeft,
	ChevronDown,
	ChevronRight,
	Clock,
	Download,
	Eye,
	FileText,
	Info,
	MessageSquare,
	Play,
	Rocket,
	Search,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
	tags?: string[];
	level?: 'beginner' | 'intermediate' | 'advanced';
}

interface CategoryWithArticles {
	category: GuideCategory;
	articles: GuideArticle[];
}

export default function GuideCategoryPage() {
	const params = useParams();
	const router = useRouter();
	const categorySlug = params.categorySlug as string;

	const [loading, setLoading] = useState(true);
	const [categoryData, setCategoryData] = useState<CategoryWithArticles | null>(null);
	const [filteredArticles, setFilteredArticles] = useState<GuideArticle[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [typeFilter, setTypeFilter] = useState<'all' | 'text' | 'video'>('all');
	const [levelFilter, setLevelFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
	const [sortOrder, setSortOrder] = useState<'newest' | 'popular'>('popular');

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchCategoryData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// التحقق من الفئة المطلوبة
			if (categorySlug === 'getting-started') {
				const mockCategory: GuideCategory = {
					id: 'cat-001',
					name: 'البدء باستخدام النظام',
					slug: 'getting-started',
					description: 'كل ما تحتاج معرفته للبدء باستخدام نظام ثوب ماستر والإعداد الأولي',
					icon: 'rocket',
					articlesCount: 9,
				};

				const mockArticles: GuideArticle[] = [
					{
						id: 'art-001',
						title: 'تثبيت وإعداد النظام لأول مرة',
						slug: 'system-installation-setup',
						excerpt: 'دليل خطوة بخطوة لتثبيت وإعداد نظام ثوب ماستر لأول مرة على الأجهزة المختلفة',
						categoryId: 'cat-001',
						categoryName: 'البدء باستخدام النظام',
						createdAt: '2023-07-15T10:30:00',
						updatedAt: '2023-09-20T14:15:00',
						viewCount: 1245,
						type: 'text',
						hasDownload: true,
						tags: ['التثبيت', 'الإعداد الأولي', 'متطلبات النظام'],
						level: 'beginner',
					},
					{
						id: 'art-002',
						title: 'جولة سريعة في واجهة النظام',
						slug: 'interface-quick-tour',
						excerpt: 'تعرف على مكونات واجهة المستخدم الرئيسية وكيفية التنقل بين الأقسام المختلفة',
						categoryId: 'cat-001',
						categoryName: 'البدء باستخدام النظام',
						createdAt: '2023-07-18T11:45:00',
						updatedAt: '2023-09-15T09:30:00',
						viewCount: 987,
						type: 'video',
						duration: '8:35',
						hasDownload: false,
						tags: ['واجهة المستخدم', 'التنقل', 'لوحة التحكم'],
						level: 'beginner',
					},
					{
						id: 'art-003',
						title: 'إعداد ملف تعريف الشركة',
						slug: 'company-profile-setup',
						excerpt: 'كيفية إعداد ملف تعريف الشركة بما في ذلك المعلومات الأساسية والإعدادات المخصصة',
						categoryId: 'cat-001',
						categoryName: 'البدء باستخدام النظام',
						createdAt: '2023-07-25T13:15:00',
						updatedAt: '2023-09-10T15:45:00',
						viewCount: 754,
						type: 'text',
						hasDownload: true,
						tags: ['الملف الشخصي', 'معلومات الشركة', 'الإعدادات'],
						level: 'beginner',
					},
					{
						id: 'art-004',
						title: 'إدارة المستخدمين والصلاحيات',
						slug: 'users-permissions-management',
						excerpt: 'دليل شامل لإضافة المستخدمين وإدارة الصلاحيات وتحديد الأدوار ضمن النظام',
						categoryId: 'cat-001',
						categoryName: 'البدء باستخدام النظام',
						createdAt: '2023-08-05T09:00:00',
						updatedAt: '2023-09-05T10:30:00',
						viewCount: 635,
						type: 'text',
						hasDownload: false,
						tags: ['المستخدمين', 'الصلاحيات', 'الأدوار', 'الأمان'],
						level: 'intermediate',
					},
					{
						id: 'art-005',
						title: 'تخصيص الإعدادات العامة للنظام',
						slug: 'system-general-settings',
						excerpt: 'شرح لكيفية تخصيص الإعدادات العامة للنظام بما يتناسب مع احتياجات عملك',
						categoryId: 'cat-001',
						categoryName: 'البدء باستخدام النظام',
						createdAt: '2023-08-12T14:20:00',
						updatedAt: '2023-09-01T11:10:00',
						viewCount: 528,
						type: 'video',
						duration: '12:40',
						hasDownload: true,
						tags: ['الإعدادات', 'التخصيص', 'ضبط النظام'],
						level: 'intermediate',
					},
					{
						id: 'art-006',
						title: 'إعداد قوائم المنتجات والخدمات',
						slug: 'products-services-setup',
						excerpt: 'كيفية إضافة وتنظيم المنتجات والخدمات التي تقدمها في النظام',
						categoryId: 'cat-001',
						categoryName: 'البدء باستخدام النظام',
						createdAt: '2023-08-18T16:45:00',
						updatedAt: '2023-08-30T13:20:00',
						viewCount: 489,
						type: 'text',
						hasDownload: false,
						tags: ['المنتجات', 'الخدمات', 'الكتالوج'],
						level: 'beginner',
					},
					{
						id: 'art-007',
						title: 'استيراد وتصدير البيانات',
						slug: 'data-import-export',
						excerpt: 'دليل لكيفية استيراد البيانات الموجودة لديك وتصدير البيانات من النظام',
						categoryId: 'cat-001',
						categoryName: 'البدء باستخدام النظام',
						createdAt: '2023-08-22T11:30:00',
						updatedAt: '2023-08-25T14:15:00',
						viewCount: 412,
						type: 'text',
						hasDownload: true,
						tags: ['البيانات', 'استيراد', 'تصدير', 'إكسل'],
						level: 'advanced',
					},
					{
						id: 'art-008',
						title: 'الإعداد الأولي لنظام الفوترة',
						slug: 'billing-system-setup',
						excerpt: 'كيفية إعداد نظام الفوترة وتخصيص قوالب الفواتير وإعدادات الضرائب',
						categoryId: 'cat-001',
						categoryName: 'البدء باستخدام النظام',
						createdAt: '2023-08-28T10:45:00',
						updatedAt: '2023-09-12T09:20:00',
						viewCount: 375,
						type: 'video',
						duration: '15:20',
						hasDownload: false,
						tags: ['الفواتير', 'الضرائب', 'القوالب'],
						level: 'intermediate',
					},
					{
						id: 'art-009',
						title: 'ربط النظام مع الخدمات الخارجية',
						slug: 'external-services-integration',
						excerpt: 'شرح لكيفية ربط نظام ثوب ماستر مع الخدمات الخارجية مثل أنظمة المحاسبة وخدمات الشحن',
						categoryId: 'cat-001',
						categoryName: 'البدء باستخدام النظام',
						createdAt: '2023-09-05T13:10:00',
						updatedAt: '2023-09-18T15:30:00',
						viewCount: 298,
						type: 'text',
						hasDownload: true,
						tags: ['التكامل', 'API', 'الخدمات الخارجية'],
						level: 'advanced',
					},
				];

				setCategoryData({
					category: mockCategory,
					articles: mockArticles,
				});

				setFilteredArticles(mockArticles);
			} else {
				// إذا كانت الفئة غير موجودة
				router.push('/dashboard/support/guide');
				return;
			}

			setLoading(false);
		};

		fetchCategoryData();
	}, [categorySlug, router]);

	// تطبيق الفلاتر والبحث
	useEffect(() => {
		if (!categoryData) return;

		let filtered = [...categoryData.articles];

		// تطبيق البحث
		if (searchTerm) {
			filtered = filtered.filter(
				(article) =>
					article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(article.tags && article.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
			);
		}

		// تطبيق فلتر النوع
		if (typeFilter !== 'all') {
			filtered = filtered.filter((article) => article.type === typeFilter);
		}

		// تطبيق فلتر المستوى
		if (levelFilter !== 'all') {
			filtered = filtered.filter((article) => article.level === levelFilter);
		}

		// تطبيق الترتيب
		if (sortOrder === 'newest') {
			filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
		} else if (sortOrder === 'popular') {
			filtered.sort((a, b) => b.viewCount - a.viewCount);
		}

		setFilteredArticles(filtered);
	}, [categoryData, searchTerm, typeFilter, levelFilter, sortOrder]);

	// تنسيق التاريخ
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// عرض مستوى الدليل بشكل مرئي
	const renderLevelBadge = (level?: string) => {
		if (!level) return null;

		let bgColor = 'bg-gray-100';
		let textColor = 'text-gray-800';
		let levelText = 'غير محدد';

		switch (level) {
			case 'beginner':
				bgColor = 'bg-green-100';
				textColor = 'text-green-800';
				levelText = 'مبتدئ';
				break;
			case 'intermediate':
				bgColor = 'bg-blue-100';
				textColor = 'text-blue-800';
				levelText = 'متوسط';
				break;
			case 'advanced':
				bgColor = 'bg-purple-100';
				textColor = 'text-purple-800';
				levelText = 'متقدم';
				break;
		}

		return (
			<span
				className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bgColor} ${textColor}`}
			>
				{levelText}
			</span>
		);
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	if (!categoryData) {
		return (
			<div className='text-center py-16'>
				<AlertCircle className='h-12 w-12 text-red-500 mx-auto' />
				<h3 className='mt-2 text-lg font-medium text-gray-900'>لم يتم العثور على الفئة</h3>
				<p className='mt-1 text-gray-500'>الفئة التي تبحث عنها غير موجودة أو تم حذفها</p>
				<div className='mt-6'>
					<Link
						href='/dashboard/support/guide'
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
					>
						العودة إلى دليل الاستخدام
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex items-center'>
				<Link
					href='/dashboard/support/guide'
					className='flex items-center text-gray-500 hover:text-gray-700 ml-4'
				>
					<ArrowLeft className='h-5 w-5' />
					<span className='mr-1 text-sm'>العودة</span>
				</Link>
				<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
					<div className='flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-2'>
						<Rocket className='h-5 w-5' />
					</div>
					<span>{categoryData.category.name}</span>
				</h1>
			</div>

			{/* وصف الفئة والإحصائيات */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
					<div>
						<p className='text-gray-600'>{categoryData.category.description}</p>
						<p className='mt-2 text-sm text-blue-600'>{categoryData.articles.length} دليل في هذه الفئة</p>
					</div>

					<div className='flex gap-2'>
						<a
							href={`/documents/guides/${categoryData.category.slug}-full-guide.pdf`}
							download
							className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
						>
							<Download className='ml-1 h-4 w-4' />
							تنزيل الدليل الكامل
						</a>
					</div>
				</div>
			</div>

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex flex-col md:flex-row gap-4 mb-4'>
					{/* البحث */}
					<div className='flex-1 relative'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder={`ابحث في أدلة ${categoryData.category.name}...`}
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
						/>
					</div>

					{/* فلتر النوع */}
					<div className='min-w-[150px] relative'>
						<label htmlFor='type-filter' className='block text-xs text-gray-500 mb-1'>
							نوع المحتوى
						</label>
						<div className='relative'>
							<select
								id='type-filter'
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value as 'all' | 'text' | 'video')}
								className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm'
							>
								<option value='all'>الكل</option>
								<option value='text'>نصي</option>
								<option value='video'>فيديو</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* فلتر المستوى */}
					<div className='min-w-[150px] relative'>
						<label htmlFor='level-filter' className='block text-xs text-gray-500 mb-1'>
							المستوى
						</label>
						<div className='relative'>
							<select
								id='level-filter'
								value={levelFilter}
								onChange={(e) =>
									setLevelFilter(e.target.value as 'all' | 'beginner' | 'intermediate' | 'advanced')
								}
								className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm'
							>
								<option value='all'>جميع المستويات</option>
								<option value='beginner'>مبتدئ</option>
								<option value='intermediate'>متوسط</option>
								<option value='advanced'>متقدم</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* الترتيب */}
					<div className='min-w-[150px] relative'>
						<label htmlFor='sort-order' className='block text-xs text-gray-500 mb-1'>
							الترتيب
						</label>
						<div className='relative'>
							<select
								id='sort-order'
								value={sortOrder}
								onChange={(e) => setSortOrder(e.target.value as 'newest' | 'popular')}
								className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm'
							>
								<option value='popular'>الأكثر مشاهدة</option>
								<option value='newest'>الأحدث</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>
				</div>

				{/* عرض نتائج الفلترة */}
				<div className='text-sm text-gray-500 border-t border-gray-200 pt-4 flex items-center justify-between'>
					<div>
						عرض {filteredArticles.length} من أصل {categoryData.articles.length} دليل
					</div>

					{(searchTerm || typeFilter !== 'all' || levelFilter !== 'all') && (
						<button
							onClick={() => {
								setSearchTerm('');
								setTypeFilter('all');
								setLevelFilter('all');
							}}
							className='text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center'
						>
							مسح الفلاتر
						</button>
					)}
				</div>
			</div>

			{/* قائمة الأدلة */}
			{filteredArticles.length > 0 ? (
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{filteredArticles.map((article) => (
						<Link
							key={article.id}
							href={`/dashboard/support/guide/${article.categoryId}/${article.slug}`}
							className='bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 flex flex-col h-full'
						>
							<div className='flex items-start mb-3'>
								<div
									className={`flex-shrink-0 p-1.5 rounded-md ${
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
									<h3 className='text-base font-medium text-gray-900 leading-tight group-hover:text-blue-600 transition-colors duration-200'>
										{article.title}
									</h3>

									<div className='flex flex-wrap items-center mt-1 gap-2'>
										{renderLevelBadge(article.level)}

										{article.type === 'video' && article.duration && (
											<span className='inline-flex items-center text-xs text-gray-500'>
												<Clock className='h-3 w-3 ml-0.5' />
												{article.duration}
											</span>
										)}

										{article.hasDownload && (
											<span className='inline-flex items-center text-xs text-gray-500'>
												<Download className='h-3 w-3 ml-0.5' />
												PDF
											</span>
										)}
									</div>
								</div>
							</div>

							<p className='text-sm text-gray-600 mb-4 line-clamp-2 flex-grow'>{article.excerpt}</p>

							<div className='flex items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t border-gray-100'>
								<div className='flex items-center'>
									<span className='ml-3'>تاريخ التحديث: {formatDate(article.updatedAt)}</span>
									<span className='flex items-center'>
										<Eye className='ml-1 h-3 w-3' />
										{article.viewCount}
									</span>
								</div>

								<span className='text-blue-600 font-medium flex items-center'>
									عرض الدليل
									<ChevronRight className='mr-1 h-4 w-4' />
								</span>
							</div>
						</Link>
					))}
				</div>
			) : (
				<div className='bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center'>
					<Search className='h-12 w-12 text-gray-300 mx-auto mb-3' />
					<h3 className='text-lg font-medium text-gray-900'>لم يتم العثور على نتائج</h3>
					<p className='mt-1 text-gray-500'>
						لم نتمكن من العثور على أدلة تطابق معايير البحث والفلترة المحددة
					</p>
					<div className='mt-4'>
						<button
							onClick={() => {
								setSearchTerm('');
								setTypeFilter('all');
								setLevelFilter('all');
							}}
							className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
						>
							مسح الفلاتر
						</button>
					</div>
				</div>
			)}

			{/* قسم الاقتراحات المصغرة */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<h2 className='text-lg font-medium text-gray-900 mb-4'>قد تكون مهتماً أيضاً</h2>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<Link
						href='/dashboard/support/guide/category/orders-management'
						className='p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200'
					>
						<h3 className='text-base font-medium text-gray-900 mb-1'>إدارة الطلبات</h3>
						<p className='text-sm text-gray-500 mb-2 line-clamp-2'>
							تعلم كيفية إنشاء وإدارة الطلبات ومتابعة حالتها
						</p>
						<span className='text-xs text-blue-600 font-medium flex items-center'>
							استعراض الأدلة
							<ChevronRight className='mr-1 h-3 w-3' />
						</span>
					</Link>

					<Link
						href='/dashboard/support/guide/category/customers-management'
						className='p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200'
					>
						<h3 className='text-base font-medium text-gray-900 mb-1'>إدارة العملاء</h3>
						<p className='text-sm text-gray-500 mb-2 line-clamp-2'>
							إضافة وتعديل بيانات العملاء وإدارة علاقتك معهم
						</p>
						<span className='text-xs text-blue-600 font-medium flex items-center'>
							استعراض الأدلة
							<ChevronRight className='mr-1 h-3 w-3' />
						</span>
					</Link>

					<Link
						href='/dashboard/support/guide/category/reports-statistics'
						className='p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all duration-200'
					>
						<h3 className='text-base font-medium text-gray-900 mb-1'>تقارير وإحصائيات</h3>
						<p className='text-sm text-gray-500 mb-2 line-clamp-2'>
							كيفية الوصول وتحليل البيانات واستخراج التقارير
						</p>
						<span className='text-xs text-blue-600 font-medium flex items-center'>
							استعراض الأدلة
							<ChevronRight className='mr-1 h-3 w-3' />
						</span>
					</Link>
				</div>
			</div>

			{/* هل تحتاج إلى مساعدة إضافية؟ */}
			<div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
				<div className='flex flex-col sm:flex-row items-center'>
					<div className='flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 sm:mb-0 sm:ml-4'>
						<Info className='h-8 w-8' />
					</div>
					<div className='text-center sm:text-right flex-1'>
						<h3 className='text-lg font-medium text-gray-900'>هل تحتاج إلى مساعدة إضافية؟</h3>
						<p className='mt-1 text-gray-600'>
							إذا لم تجد ما تبحث عنه في الأدلة، يمكنك التواصل مباشرة مع فريق الدعم الفني
						</p>
						<div className='mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3'>
							<Link
								href='/dashboard/support/faq'
								className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
							>
								<Info className='ml-1 h-4 w-4 text-gray-500' />
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
