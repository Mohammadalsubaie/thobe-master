'use client';

import {
	AlertTriangle,
	ArrowRight,
	BarChart2,
	CheckCircle,
	CheckSquare,
	Clipboard,
	Clock,
	Filter,
	Package,
	PencilRuler,
	RefreshCw,
	Scissors,
	Search,
	Tag,
	TrendingDown,
	TrendingUp,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// تعريف أنواع البيانات
interface InventorySummary {
	total: number;
	inStock: number;
	lowStock: number;
	outOfStock: number;
	valuationTotal: number;
}

interface CategorySummary {
	id: string;
	name: string;
	icon: string;
	total: number;
	inStock: number;
	lowStock: number;
	outOfStock: number;
	percentage: number;
	value: number;
}

interface RecentActivity {
	id: string;
	type: 'add' | 'deduct' | 'count' | 'adjust';
	item: string;
	itemCode: string;
	category: string;
	quantity: number;
	unit: string;
	date: string;
	user: string;
}

interface LowStockAlert {
	id: string;
	itemName: string;
	itemCode: string;
	category: string;
	currentStock: number;
	minStock: number;
	unit: string;
	supplier: string;
	lastOrdered: string;
}

export default function InventoryPage() {
	const [loading, setLoading] = useState(true);
	const [summary, setSummary] = useState<InventorySummary | null>(null);
	const [categories, setCategories] = useState<CategorySummary[]>([]);
	const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
	const [lowStockAlerts, setLowStockAlerts] = useState<LowStockAlert[]>([]);
	const [selectedTab, setSelectedTab] = useState<'overview' | 'activities' | 'alerts'>('overview');
	const [currentMonth, setCurrentMonth] = useState<string>('');

	// محاكاة استدعاء API عند تحميل الصفحة
	useEffect(() => {
		const fetchInventoryData = async () => {
			try {
				// تأخير مصطنع لمحاكاة الاتصال بالخادم
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

				// بيانات تجريبية لملخص المخزون
				const mockSummary: InventorySummary = {
					total: 382,
					inStock: 320,
					lowStock: 42,
					outOfStock: 20,
					valuationTotal: 156500,
				};

				// بيانات تجريبية لفئات المخزون
				const mockCategories: CategorySummary[] = [
					{
						id: 'fabrics',
						name: 'الأقمشة',
						icon: 'PencilRuler',
						total: 120,
						inStock: 106,
						lowStock: 10,
						outOfStock: 4,
						percentage: 88.3,
						value: 82500,
					},
					{
						id: 'threads',
						name: 'الخيوط',
						icon: 'Scissors',
						total: 80,
						inStock: 68,
						lowStock: 8,
						outOfStock: 4,
						percentage: 85,
						value: 16000,
					},
					{
						id: 'accessories',
						name: 'الاكسسوارات',
						icon: 'Tag',
						total: 182,
						inStock: 146,
						lowStock: 24,
						outOfStock: 12,
						percentage: 80.2,
						value: 58000,
					},
				];

				// بيانات تجريبية للنشاطات الأخيرة
				const mockActivities: RecentActivity[] = [
					{
						id: 'act-001',
						type: 'count',
						item: 'قطن مصري فاخر',
						itemCode: 'FAB-COTTON-001',
						category: 'الأقمشة',
						quantity: 245,
						unit: 'متر',
						date: '2023-09-05T10:30:00',
						user: 'نورة السعدي',
					},
					{
						id: 'act-002',
						type: 'adjust',
						item: 'خيط قطني ممتاز',
						itemCode: 'THR-COT-001',
						category: 'الخيوط',
						quantity: -5,
						unit: 'بكرة',
						date: '2023-09-04T14:15:00',
						user: 'أحمد المالكي',
					},
					{
						id: 'act-003',
						type: 'add',
						item: 'أزرار كلاسيكية',
						itemCode: 'ACC-BTN-001',
						category: 'الاكسسوارات',
						quantity: 200,
						unit: 'قطعة',
						date: '2023-09-03T09:45:00',
						user: 'فيصل العنزي',
					},
					{
						id: 'act-004',
						type: 'deduct',
						item: 'حرير طبيعي',
						itemCode: 'FAB-SILK-001',
						category: 'الأقمشة',
						quantity: -15,
						unit: 'متر',
						date: '2023-09-02T11:20:00',
						user: 'عبدالله الزيد',
					},
					{
						id: 'act-005',
						type: 'add',
						item: 'خيط بوليستر',
						itemCode: 'THR-POLY-001',
						category: 'الخيوط',
						quantity: 50,
						unit: 'بكرة',
						date: '2023-09-01T16:40:00',
						user: 'محمد العمري',
					},
				];

				// بيانات تجريبية لتنبيهات المخزون المنخفض
				const mockAlerts: LowStockAlert[] = [
					{
						id: 'alert-001',
						itemName: 'صوف كشميري',
						itemCode: 'FAB-WOOL-001',
						category: 'الأقمشة',
						currentStock: 30,
						minStock: 35,
						unit: 'متر',
						supplier: 'أقمشة الخليج',
						lastOrdered: '2023-08-15',
					},
					{
						id: 'alert-002',
						itemName: 'خيط بوليستر',
						itemCode: 'THR-POLY-001',
						category: 'الخيوط',
						currentStock: 8,
						minStock: 15,
						unit: 'بكرة',
						supplier: 'خيوط الخليج',
						lastOrdered: '2023-08-10',
					},
					{
						id: 'alert-003',
						itemName: 'خيط تطريز',
						itemCode: 'THR-EMB-001',
						category: 'الخيوط',
						currentStock: 5,
						minStock: 10,
						unit: 'بكرة',
						supplier: 'خيوط الزينة',
						lastOrdered: '2023-08-20',
					},
					{
						id: 'alert-004',
						itemName: 'مشابك معدنية',
						itemCode: 'ACC-BCK-001',
						category: 'الاكسسوارات',
						currentStock: 10,
						minStock: 20,
						unit: 'حزمة',
						supplier: 'اكسسوارات الخليج',
						lastOrdered: '2023-08-25',
					},
					{
						id: 'alert-005',
						itemName: 'ملصقات ماركة',
						itemCode: 'ACC-LBL-001',
						category: 'الاكسسوارات',
						currentStock: 8,
						minStock: 15,
						unit: 'حزمة',
						supplier: 'مستلزمات الخياطة',
						lastOrdered: '2023-08-18',
					},
				];

				// تعيين البيانات في الحالة
				setSummary(mockSummary);
				setCategories(mockCategories);
				setRecentActivity(mockActivities);
				setLowStockAlerts(mockAlerts);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching inventory data:', error);
				setLoading(false);
			}
		};

		fetchInventoryData();
	}, []);

	// الحصول على أيقونة الفئة
	const getCategoryIcon = (iconName: string) => {
		switch (iconName) {
			case 'PencilRuler':
				return <PencilRuler className='h-6 w-6 text-blue-500' />;
			case 'Scissors':
				return <Scissors className='h-6 w-6 text-green-500' />;
			case 'Tag':
				return <Tag className='h-6 w-6 text-purple-500' />;
			default:
				return <Package className='h-6 w-6 text-gray-500' />;
		}
	};

	// الحصول على أيقونة نوع النشاط
	const getActivityIcon = (type: string) => {
		switch (type) {
			case 'add':
				return <TrendingUp className='h-4 w-4 text-green-500' />;
			case 'deduct':
				return <TrendingDown className='h-4 w-4 text-red-500' />;
			case 'count':
				return <CheckSquare className='h-4 w-4 text-blue-500' />;
			case 'adjust':
				return <RefreshCw className='h-4 w-4 text-yellow-500' />;
			default:
				return <Clock className='h-4 w-4 text-gray-500' />;
		}
	};

	// تنسيق تاريخ النشاط
	const formatActivityDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			return 'اليوم';
		} else if (diffDays === 1) {
			return 'أمس';
		} else if (diffDays < 7) {
			return `منذ ${diffDays} أيام`;
		} else {
			return date.toLocaleDateString('ar-SA');
		}
	};

	// تنسيق نسبة النقص في المخزون
	const getLowStockPercentage = (current: number, min: number) => {
		const percentage = Math.round((current / min) * 100);
		return Math.min(percentage, 100);
	};

	// تنسيق النص لنوع النشاط
	const getActivityTypeText = (type: string) => {
		switch (type) {
			case 'add':
				return 'إضافة للمخزون';
			case 'deduct':
				return 'صرف من المخزون';
			case 'count':
				return 'جرد المخزون';
			case 'adjust':
				return 'تسوية المخزون';
			default:
				return 'نشاط';
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-full py-16'>
				<div className='animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600'></div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<Package className='inline-block ml-2 h-6 w-6 text-green-600' />
						إدارة المخزون
					</h1>
					<p className='mt-1 text-sm text-gray-600'>نظرة عامة على المخزون وإحصائيات شهر {currentMonth}</p>
				</div>

				<div className='flex gap-2'>
					<div className='relative'>
						<input
							type='text'
							placeholder='بحث في المخزون...'
							className='w-64 pr-10 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm'
						/>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					<Link
						href='/dashboard/inventory/stock-count/new'
						className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700'
					>
						<CheckSquare className='ml-1 h-4 w-4' />
						جرد جديد
					</Link>
				</div>
			</div>

			{/* شريط التبويب */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='border-b border-gray-200'>
					<nav className='flex -mb-px'>
						<button
							onClick={() => setSelectedTab('overview')}
							className={`py-4 px-6 font-medium text-sm border-b-2 ${
								selectedTab === 'overview'
									? 'border-green-500 text-green-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Package className='h-4 w-4 inline-block ml-1' />
							نظرة عامة
						</button>
						<button
							onClick={() => setSelectedTab('activities')}
							className={`py-4 px-6 font-medium text-sm border-b-2 ${
								selectedTab === 'activities'
									? 'border-green-500 text-green-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Clock className='h-4 w-4 inline-block ml-1' />
							النشاطات الأخيرة
						</button>
						<button
							onClick={() => setSelectedTab('alerts')}
							className={`py-4 px-6 font-medium text-sm border-b-2 ${
								selectedTab === 'alerts'
									? 'border-green-500 text-green-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<AlertTriangle className='h-4 w-4 inline-block ml-1' />
							تنبيهات المخزون
							{lowStockAlerts.length > 0 && (
								<span className='mr-1 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full'>
									{lowStockAlerts.length}
								</span>
							)}
						</button>
					</nav>
				</div>

				{/* محتوى التبويب النشط */}
				<div className='p-6'>
					{selectedTab === 'overview' && (
						<div className='space-y-6'>
							{/* ملخص المخزون */}
							<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
								<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
									<div className='p-3 rounded-full bg-blue-100 text-blue-600 ml-4'>
										<Package className='h-6 w-6' />
									</div>
									<div>
										<p className='text-sm font-medium text-gray-600'>إجمالي الأصناف</p>
										<p className='text-xl font-semibold'>{summary?.total} صنف</p>
									</div>
								</div>

								<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
									<div className='p-3 rounded-full bg-green-100 text-green-600 ml-4'>
										<CheckCircle className='h-6 w-6' />
									</div>
									<div>
										<p className='text-sm font-medium text-gray-600'>متوفر في المخزون</p>
										<p className='text-xl font-semibold'>
											{summary?.inStock} صنف
											<span className='text-sm text-gray-500 mr-1'>
												({Math.round(((summary?.inStock || 0) / (summary?.total || 1)) * 100)}%)
											</span>
										</p>
									</div>
								</div>

								<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
									<div className='p-3 rounded-full bg-yellow-100 text-yellow-600 ml-4'>
										<AlertTriangle className='h-6 w-6' />
									</div>
									<div>
										<p className='text-sm font-medium text-gray-600'>مخزون منخفض</p>
										<p className='text-xl font-semibold'>{summary?.lowStock} صنف</p>
									</div>
								</div>

								<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
									<div className='p-3 rounded-full bg-red-100 text-red-600 ml-4'>
										<XCircle className='h-6 w-6' />
									</div>
									<div>
										<p className='text-sm font-medium text-gray-600'>نفد من المخزون</p>
										<p className='text-xl font-semibold'>{summary?.outOfStock} صنف</p>
									</div>
								</div>
							</div>

							{/* قيمة المخزون */}
							<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
								<div className='flex justify-between items-center mb-4'>
									<h2 className='text-lg font-medium text-gray-900'>قيمة المخزون</h2>
									<Link
										href='/dashboard/inventory/valuation'
										className='text-sm font-medium text-green-600 hover:text-green-800 flex items-center'
									>
										عرض التفاصيل
										<ArrowRight className='mr-1 h-4 w-4' />
									</Link>
								</div>

								<div className='flex items-center mb-4'>
									<BarChart2 className='h-12 w-12 text-green-500 ml-4' />
									<div>
										<p className='text-sm text-gray-600'>إجمالي قيمة المخزون</p>
										<p className='text-3xl font-bold text-gray-900'>
											{summary?.valuationTotal.toLocaleString()} ريال
										</p>
									</div>
								</div>

								<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6'>
									{categories.map((category) => (
										<div key={category.id} className='p-4 bg-gray-50 rounded-lg'>
											<div className='flex items-center justify-between mb-2'>
												<div className='flex items-center'>
													{getCategoryIcon(category.icon)}
													<h3 className='text-sm font-medium text-gray-900 mr-2'>
														{category.name}
													</h3>
												</div>
												<span className='text-sm font-medium text-green-600'>
													{Math.round(
														(category.value / (summary?.valuationTotal || 1)) * 100
													)}
													%
												</span>
											</div>
											<p className='text-lg font-semibold text-gray-900 mb-1'>
												{category.value.toLocaleString()} ريال
											</p>
											<div className='w-full bg-gray-200 rounded-full h-1.5'>
												<div
													className='bg-green-500 h-1.5 rounded-full'
													style={{
														width: `${Math.round(
															(category.value / (summary?.valuationTotal || 1)) * 100
														)}%`,
													}}
												></div>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* فئات المخزون */}
							<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
								{categories.map((category) => (
									<Link
										key={category.id}
										href={`/dashboard/inventory/${category.id}`}
										className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
									>
										<div className='flex items-center justify-between mb-4'>
											<div className='flex items-center'>
												{getCategoryIcon(category.icon)}
												<h3 className='text-lg font-medium text-gray-900 mr-2'>
													{category.name}
												</h3>
											</div>
											<span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full'>
												{category.total} صنف
											</span>
										</div>

										<div className='mb-4'>
											<div className='flex justify-between items-center mb-1 text-sm'>
												<span className='text-gray-600'>توفر المخزون</span>
												<span className='font-medium'>{category.percentage}%</span>
											</div>
											<div className='w-full bg-gray-200 rounded-full h-2'>
												<div
													className={`h-2 rounded-full ${
														category.percentage >= 70
															? 'bg-green-500'
															: category.percentage >= 40
															? 'bg-yellow-500'
															: 'bg-red-500'
													}`}
													style={{ width: `${category.percentage}%` }}
												></div>
											</div>
										</div>

										<div className='grid grid-cols-3 gap-2 text-center'>
											<div className='p-2 bg-gray-50 rounded'>
												<p className='text-sm text-gray-500'>متوفر</p>
												<p className='text-lg font-medium text-green-600'>{category.inStock}</p>
											</div>
											<div className='p-2 bg-gray-50 rounded'>
												<p className='text-sm text-gray-500'>منخفض</p>
												<p className='text-lg font-medium text-yellow-600'>
													{category.lowStock}
												</p>
											</div>
											<div className='p-2 bg-gray-50 rounded'>
												<p className='text-sm text-gray-500'>نفد</p>
												<p className='text-lg font-medium text-red-600'>
													{category.outOfStock}
												</p>
											</div>
										</div>
									</Link>
								))}
							</div>

							{/* روابط سريعة */}
							<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
								<Link
									href='/dashboard/inventory/fabrics'
									className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors flex items-center'
								>
									<div className='p-3 rounded-full bg-blue-100 text-blue-600 ml-3'>
										<PencilRuler className='h-6 w-6' />
									</div>
									<div>
										<p className='text-sm font-medium text-gray-900'>إدارة الأقمشة</p>
										<p className='text-xs text-gray-500'>{categories[0]?.total} صنف</p>
									</div>
								</Link>

								<Link
									href='/dashboard/inventory/threads'
									className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-colors flex items-center'
								>
									<div className='p-3 rounded-full bg-green-100 text-green-600 ml-3'>
										<Scissors className='h-6 w-6' />
									</div>
									<div>
										<p className='text-sm font-medium text-gray-900'>إدارة الخيوط</p>
										<p className='text-xs text-gray-500'>{categories[1]?.total} صنف</p>
									</div>
								</Link>

								<Link
									href='/dashboard/inventory/accessories'
									className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-colors flex items-center'
								>
									<div className='p-3 rounded-full bg-purple-100 text-purple-600 ml-3'>
										<Tag className='h-6 w-6' />
									</div>
									<div>
										<p className='text-sm font-medium text-gray-900'>إدارة الاكسسوارات</p>
										<p className='text-xs text-gray-500'>{categories[2]?.total} صنف</p>
									</div>
								</Link>

								<Link
									href='/dashboard/inventory/stock-count'
									className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:bg-yellow-50 hover:border-yellow-200 transition-colors flex items-center'
								>
									<div className='p-3 rounded-full bg-yellow-100 text-yellow-600 ml-3'>
										<CheckSquare className='h-6 w-6' />
									</div>
									<div>
										<p className='text-sm font-medium text-gray-900'>جرد المخزون</p>
										<p className='text-xs text-gray-500'>إدارة عمليات الجرد</p>
									</div>
								</Link>
							</div>
						</div>
					)}

					{selectedTab === 'activities' && (
						<div className='space-y-6'>
							<div className='flex justify-between items-center mb-4'>
								<h2 className='text-lg font-medium text-gray-900'>النشاطات الأخيرة في المخزون</h2>
								<Link
									href='/dashboard/inventory/activities'
									className='text-sm font-medium text-green-600 hover:text-green-800 flex items-center'
								>
									عرض الكل
									<ArrowRight className='mr-1 h-4 w-4' />
								</Link>
							</div>

							<div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
								<ul className='divide-y divide-gray-200'>
									{recentActivity.length === 0 ? (
										<li className='p-8 text-center'>
											<Clock className='mx-auto h-12 w-12 text-gray-300' />
											<h3 className='mt-2 text-base font-medium text-gray-900'>
												لا توجد نشاطات حديثة
											</h3>
											<p className='mt-1 text-sm text-gray-500'>
												لم يتم تسجيل أي نشاطات في المخزون مؤخراً.
											</p>
										</li>
									) : (
										recentActivity.map((activity) => (
											<li key={activity.id} className='p-4 hover:bg-gray-50'>
												<div className='flex items-start'>
													<div
														className={`mt-1 p-2 rounded-full ${
															activity.type === 'add'
																? 'bg-green-100'
																: activity.type === 'deduct'
																? 'bg-red-100'
																: activity.type === 'count'
																? 'bg-blue-100'
																: 'bg-yellow-100'
														} ml-4`}
													>
														{getActivityIcon(activity.type)}
													</div>
													<div className='flex-1'>
														<div className='flex items-center justify-between'>
															<p className='text-sm font-medium text-gray-900'>
																{getActivityTypeText(activity.type)}
																<span className='mx-1'>:</span>
																{activity.item}
															</p>
															<span className='text-xs text-gray-500'>
																{formatActivityDate(activity.date)}
															</span>
														</div>
														<div className='mt-1 flex items-center text-sm text-gray-500'>
															<span>{activity.category}</span>
															<span className='mx-1'>•</span>
															<span>{activity.itemCode}</span>
															<span className='mx-1'>•</span>
															<span
																className={`font-medium ${
																	activity.type === 'add'
																		? 'text-green-600'
																		: activity.type === 'deduct'
																		? 'text-red-600'
																		: 'text-gray-600'
																}`}
															>
																{activity.quantity > 0 ? '+' : ''}
																{activity.quantity} {activity.unit}
															</span>
														</div>
														<p className='mt-1 text-xs text-gray-500'>
															بواسطة: {activity.user}
														</p>
													</div>
												</div>
											</li>
										))
									)}
								</ul>
							</div>

							<div className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm'>
								<h3 className='text-md font-medium text-gray-900 mb-3'>الإجراءات المتاحة</h3>

								<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3'>
									<Link
										href='/dashboard/inventory/adjust'
										className='flex items-center p-3 text-sm border border-gray-300 rounded-md hover:bg-gray-50'
									>
										<Clipboard className='h-5 w-5 ml-2 text-blue-500' />
										<span>تسوية اختلافات المخزون</span>
									</Link>

									<Link
										href='/dashboard/inventory/discrepancies'
										className='flex items-center p-3 text-sm border border-gray-300 rounded-md hover:bg-gray-50'
									>
										<AlertTriangle className='h-5 w-5 ml-2 text-yellow-500' />
										<span>تقرير الاختلافات</span>
									</Link>

									<Link
										href='/dashboard/reports/inventory'
										className='flex items-center p-3 text-sm border border-gray-300 rounded-md hover:bg-gray-50'
									>
										<BarChart2 className='h-5 w-5 ml-2 text-green-500' />
										<span>تقارير المخزون</span>
									</Link>

									<Link
										href='/dashboard/inventory/transactions'
										className='flex items-center p-3 text-sm border border-gray-300 rounded-md hover:bg-gray-50'
									>
										<Filter className='h-5 w-5 ml-2 text-purple-500' />
										<span>سجل العمليات</span>
									</Link>
								</div>
							</div>
						</div>
					)}

					{selectedTab === 'alerts' && (
						<div className='space-y-4'>
							<div className='flex justify-between items-center mb-4'>
								<div className='flex items-center'>
									<AlertTriangle className='h-5 w-5 text-yellow-500 ml-2' />
									<h2 className='text-lg font-medium text-gray-900'>تنبيهات المخزون المنخفض</h2>
								</div>

								<Link
									href='/dashboard/inventory/order'
									className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700'
								>
									<TrendingUp className='ml-1 h-4 w-4' />
									طلب مواد
								</Link>
							</div>

							{lowStockAlerts.length === 0 ? (
								<div className='bg-white border border-gray-200 rounded-lg p-8 text-center'>
									<CheckCircle className='mx-auto h-12 w-12 text-green-500' />
									<h3 className='mt-2 text-base font-medium text-gray-900'>لا توجد تنبيهات</h3>
									<p className='mt-1 text-sm text-gray-500'>
										جميع مستويات المخزون ضمن الحدود الآمنة.
									</p>
								</div>
							) : (
								<div className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'>
									<div className='p-4 bg-yellow-50 border-b border-yellow-200'>
										<div className='flex items-start'>
											<div className='flex-shrink-0'>
												<AlertTriangle className='h-5 w-5 text-yellow-400' />
											</div>
											<div className='mr-3'>
												<h3 className='text-sm font-medium text-yellow-800'>تنبيه</h3>
												<div className='mt-2 text-sm text-yellow-700'>
													<p>
														يوجد {lowStockAlerts.length} صنف وصل إلى مستوى المخزون المنخفض
														أو أقل. يرجى مراجعة القائمة أدناه واتخاذ الإجراء المناسب.
													</p>
												</div>
											</div>
										</div>
									</div>

									<ul className='divide-y divide-gray-200'>
										{lowStockAlerts.map((alert) => (
											<li key={alert.id} className='p-4 hover:bg-gray-50'>
												<div className='flex items-center justify-between'>
													<div className='flex items-start'>
														<div className='flex-1'>
															<div className='flex items-center'>
																<p className='text-sm font-medium text-gray-900'>
																	{alert.itemName}
																</p>
																<span className='mx-1 px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full'>
																	منخفض
																</span>
															</div>
															<div className='mt-1 flex items-center text-sm text-gray-500'>
																<span>{alert.category}</span>
																<span className='mx-1'>•</span>
																<span>{alert.itemCode}</span>
																<span className='mx-1'>•</span>
																<span className='font-medium text-red-600'>
																	{alert.currentStock} من {alert.minStock}{' '}
																	{alert.unit}
																</span>
															</div>
															<div className='mt-2 w-48 bg-gray-200 rounded-full h-1.5'>
																<div
																	className='bg-red-500 h-1.5 rounded-full'
																	style={{
																		width: `${getLowStockPercentage(
																			alert.currentStock,
																			alert.minStock
																		)}%`,
																	}}
																></div>
															</div>
															<p className='mt-1 text-xs text-gray-500'>
																المورد: {alert.supplier} • آخر طلب:{' '}
																{new Date(alert.lastOrdered).toLocaleDateString(
																	'ar-SA'
																)}
															</p>
														</div>
													</div>

													<div className='ml-2'>
														<Link
															href={`/dashboard/inventory/order/new?itemId=${alert.id}`}
															className='px-3 py-1 bg-blue-600 text-white rounded-md text-xs font-medium flex items-center hover:bg-blue-700'
														>
															طلب
														</Link>
													</div>
												</div>
											</li>
										))}
									</ul>
								</div>
							)}

							<div className='bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-6'>
								<h3 className='text-md font-medium text-gray-900 mb-3 flex items-center'>
									<Filter className='h-5 w-5 ml-2 text-gray-500' />
									تصفية التنبيهات
								</h3>

								<div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
									<select className='block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'>
										<option value=''>جميع الفئات</option>
										<option value='الأقمشة'>الأقمشة</option>
										<option value='الخيوط'>الخيوط</option>
										<option value='الاكسسوارات'>الاكسسوارات</option>
									</select>

									<select className='block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'>
										<option value=''>جميع الموردين</option>
										<option value='أقمشة الخليج'>أقمشة الخليج</option>
										<option value='خيوط الخليج'>خيوط الخليج</option>
										<option value='اكسسوارات الخليج'>اكسسوارات الخليج</option>
										<option value='خيوط الزينة'>خيوط الزينة</option>
										<option value='مستلزمات الخياطة'>مستلزمات الخياطة</option>
									</select>

									<select className='block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'>
										<option value=''>ترتيب حسب</option>
										<option value='lowest'>الأقل مخزوناً</option>
										<option value='percentage'>نسبة النقص</option>
										<option value='date'>تاريخ آخر طلب</option>
									</select>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
