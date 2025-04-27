// app/dashboard/reports/revenue/page.tsx
'use client';

import { addDays, differenceInDays, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subDays } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
	ArrowDown,
	ArrowRight,
	ArrowUp,
	Calendar as CalendarIcon,
	ChevronDown,
	Clipboard,
	DollarSign,
	Download,
	Printer,
	RefreshCw,
	Search,
	ShoppingCart,
	TrendingUp,
	User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

// نوع فترة التقرير
type ReportPeriod = 'day' | 'week' | 'month' | 'custom';

// واجهة بيانات المبيعات اليومية
interface DailySales {
	date: string;
	total: number;
	orders: number;
}

// واجهة بيانات طرق الدفع
interface PaymentMethod {
	method: string;
	amount: number;
	percentage: number;
}

// واجهة بيانات المنتجات الأكثر مبيعاً
interface TopProduct {
	id: string;
	name: string;
	category: string;
	quantity: number;
	revenue: number;
}

// واجهة بيانات العملاء الأكثر إنفاقاً
interface TopCustomer {
	id: string;
	name: string;
	purchases: number;
	spent: number;
}

export default function RevenueReportPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [period, setPeriod] = useState<ReportPeriod>('month');
	const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
	const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
	const [showCustomDateRange, setShowCustomDateRange] = useState(false);
	const [dailySales, setDailySales] = useState<DailySales[]>([]);
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
	const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
	const [comparePrevious, setComparePrevious] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');

	// إحصائيات التقرير
	const [reportStats, setReportStats] = useState({
		totalRevenue: 0,
		comparisonRevenue: 0,
		percentChange: 0,
		totalOrders: 0,
		comparisonOrders: 0,
		ordersPercentChange: 0,
		averageOrderValue: 0,
		comparisonAOV: 0,
		aovPercentChange: 0,
		returnRate: 0,
		comparisonReturnRate: 0,
		returnRateChange: 0,
	});

	// تحديث فترة التقرير
	useEffect(() => {
		switch (period) {
			case 'day':
				setStartDate(subDays(new Date(), 1));
				setEndDate(new Date());
				break;
			case 'week':
				setStartDate(startOfWeek(new Date(), { weekStartsOn: 6 })); // تبدأ الأسبوع من يوم السبت
				setEndDate(endOfWeek(new Date(), { weekStartsOn: 6 }));
				break;
			case 'month':
				setStartDate(startOfMonth(new Date()));
				setEndDate(endOfMonth(new Date()));
				break;
			case 'custom':
				setShowCustomDateRange(true);
				break;
		}
	}, [period]);

	// جلب بيانات التقرير
	useEffect(() => {
		const fetchReportData = async () => {
			if (period === 'custom' && !startDate && !endDate) return;

			setIsLoading(true);
			try {
				// في التطبيق الحقيقي، سنقوم بطلب البيانات من الخادم
				// محاكاة جلب البيانات
				await new Promise((resolve) => setTimeout(resolve, 1200));

				// بيانات عشوائية للعرض
				generateMockData();
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching report data:', error);
				setIsLoading(false);
			}
		};

		fetchReportData();
	}, [startDate, endDate, period, comparePrevious]);

	// إنشاء بيانات عشوائية للعرض
	const generateMockData = () => {
		// إنشاء المبيعات اليومية
		const days = differenceInDays(endDate, startDate) + 1;
		const sales: DailySales[] = [];

		let totalRev = 0;
		let totalOrders = 0;

		for (let i = 0; i < days; i++) {
			const date = addDays(startDate, i);
			const dayTotal = Math.floor(Math.random() * 5000) + 1000;
			const dayOrders = Math.floor(Math.random() * 20) + 5;

			totalRev += dayTotal;
			totalOrders += dayOrders;

			sales.push({
				date: format(date, 'yyyy-MM-dd'),
				total: dayTotal,
				orders: dayOrders,
			});
		}

		// طرق الدفع
		const paymentTotal = totalRev;
		const paymentData: PaymentMethod[] = [
			{
				method: 'بطاقة ائتمان',
				amount: Math.floor(paymentTotal * 0.45),
				percentage: 45,
			},
			{
				method: 'مدى',
				amount: Math.floor(paymentTotal * 0.3),
				percentage: 30,
			},
			{
				method: 'نقداً',
				amount: Math.floor(paymentTotal * 0.15),
				percentage: 15,
			},
			{
				method: 'تحويل بنكي',
				amount: Math.floor(paymentTotal * 0.1),
				percentage: 10,
			},
		];

		// المنتجات الأكثر مبيعاً
		const products: TopProduct[] = [
			{
				id: 'P001',
				name: 'ثوب كلاسيكي',
				category: 'الأثواب',
				quantity: Math.floor(Math.random() * 30) + 20,
				revenue: Math.floor(Math.random() * 3000) + 1000,
			},
			{
				id: 'P002',
				name: 'بشت مطرز',
				category: 'البشوت',
				quantity: Math.floor(Math.random() * 20) + 10,
				revenue: Math.floor(Math.random() * 7000) + 3000,
			},
			{
				id: 'P003',
				name: 'شماغ أحمر',
				category: 'الشماغات',
				quantity: Math.floor(Math.random() * 40) + 20,
				revenue: Math.floor(Math.random() * 2000) + 1000,
			},
			{
				id: 'P004',
				name: 'عقال ملكي',
				category: 'الإكسسوارات',
				quantity: Math.floor(Math.random() * 25) + 15,
				revenue: Math.floor(Math.random() * 1500) + 800,
			},
			{
				id: 'P005',
				name: 'ثوب مناسبات',
				category: 'الأثواب',
				quantity: Math.floor(Math.random() * 15) + 5,
				revenue: Math.floor(Math.random() * 2500) + 1200,
			},
		];

		// العملاء الأكثر إنفاقاً
		const customers: TopCustomer[] = [
			{
				id: 'C001',
				name: 'محمد العبدالله',
				purchases: Math.floor(Math.random() * 10) + 5,
				spent: Math.floor(Math.random() * 3000) + 2000,
			},
			{
				id: 'C002',
				name: 'أحمد السالم',
				purchases: Math.floor(Math.random() * 8) + 3,
				spent: Math.floor(Math.random() * 2500) + 1500,
			},
			{
				id: 'C003',
				name: 'فهد القحطاني',
				purchases: Math.floor(Math.random() * 6) + 2,
				spent: Math.floor(Math.random() * 2000) + 1000,
			},
			{
				id: 'C004',
				name: 'عبدالله المطيري',
				purchases: Math.floor(Math.random() * 5) + 2,
				spent: Math.floor(Math.random() * 1800) + 900,
			},
			{
				id: 'C005',
				name: 'سعود الحربي',
				purchases: Math.floor(Math.random() * 4) + 1,
				spent: Math.floor(Math.random() * 1500) + 800,
			},
		];

		// إحصائيات التقرير
		const previousRevenue = Math.floor(totalRev * (Math.random() * 0.4 + 0.8)); // بين 80% و 120% من القيمة الحالية
		const percentChange = ((totalRev - previousRevenue) / previousRevenue) * 100;

		const avgOrderValue = totalRev / totalOrders;
		const previousAvgOrder = avgOrderValue * (Math.random() * 0.4 + 0.8);
		const aovChange = ((avgOrderValue - previousAvgOrder) / previousAvgOrder) * 100;

		const previousOrders = Math.floor(totalOrders * (Math.random() * 0.4 + 0.8));
		const ordersChange = ((totalOrders - previousOrders) / previousOrders) * 100;

		const returnRate = Math.random() * 5;
		const previousReturnRate = returnRate * (Math.random() * 0.4 + 0.8);
		const returnRateChange = returnRate - previousReturnRate;

		setDailySales(sales);
		setPaymentMethods(paymentData);
		setTopProducts(products);
		setTopCustomers(customers);

		setReportStats({
			totalRevenue: totalRev,
			comparisonRevenue: previousRevenue,
			percentChange: percentChange,
			totalOrders: totalOrders,
			comparisonOrders: previousOrders,
			ordersPercentChange: ordersChange,
			averageOrderValue: avgOrderValue,
			comparisonAOV: previousAvgOrder,
			aovPercentChange: aovChange,
			returnRate: returnRate,
			comparisonReturnRate: previousReturnRate,
			returnRateChange: returnRateChange,
		});
	};

	// البحث في المنتجات والعملاء
	const filteredProducts = useMemo(() => {
		if (!searchQuery) return topProducts;

		return topProducts.filter(
			(product) =>
				product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
				product.id.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [topProducts, searchQuery]);

	const filteredCustomers = useMemo(() => {
		if (!searchQuery) return topCustomers;

		return topCustomers.filter(
			(customer) =>
				customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				customer.id.toLowerCase().includes(searchQuery.toLowerCase())
		);
	}, [topCustomers, searchQuery]);

	// مكون الرسم البياني للمبيعات
	const SalesChart = () => {
		// في تطبيق حقيقي، استخدم مكتبة رسوم بيانية مثل Chart.js أو Recharts
		// هنا نستخدم تمثيل بسيط للرسم البياني

		if (dailySales.length === 0)
			return (
				<div className='h-64 flex items-center justify-center'>
					<p className='text-gray-500 dark:text-gray-400'>لا توجد بيانات للعرض</p>
				</div>
			);

		const maxSales = Math.max(...dailySales.map((day) => day.total));

		return (
			<div className='h-64 flex flex-col'>
				<div className='flex-1 flex items-end mt-2 space-x-1 space-x-reverse rtl'>
					{dailySales.map((day, index) => {
						const height = `${(day.total / maxSales) * 100}%`;

						return (
							<div
								key={index}
								className='flex-1 flex flex-col items-center'
								title={`${format(new Date(day.date), 'EEEE, d MMMM', { locale: ar })}: ${
									day.total
								} ر.س`}
							>
								<div className='w-full flex justify-center'>
									<div
										className='w-4/5 bg-blue-500 dark:bg-blue-600 rounded-t'
										style={{ height }}
									></div>
								</div>
								<div className='text-xs text-gray-500 dark:text-gray-400 mt-1 rotate-45 origin-top-left'>
									{format(new Date(day.date), 'd', { locale: ar })}
								</div>
							</div>
						);
					})}
				</div>
				<div className='h-6 mt-4 border-t border-gray-200 dark:border-gray-700'></div>
			</div>
		);
	};

	// مكون مخطط دائري لطرق الدفع
	const PaymentMethodChart = () => {
		// في تطبيق حقيقي، استخدم مكتبة رسوم بيانية مثل Chart.js أو Recharts

		if (paymentMethods.length === 0)
			return (
				<div className='h-48 flex items-center justify-center'>
					<p className='text-gray-500 dark:text-gray-400'>لا توجد بيانات للعرض</p>
				</div>
			);

		// ألوان المخطط الدائري
		const colors = [
			'bg-blue-500 dark:bg-blue-600',
			'bg-green-500 dark:bg-green-600',
			'bg-yellow-500 dark:bg-yellow-600',
			'bg-purple-500 dark:bg-purple-600',
			'bg-pink-500 dark:bg-pink-600',
			'bg-indigo-500 dark:bg-indigo-600',
		];

		return (
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
				<div className='flex items-center justify-center'>
					<div className='relative w-40 h-40'>
						<div className='absolute inset-0 rounded-full bg-gray-200 dark:bg-gray-700'></div>
						{paymentMethods.map((method, index) => {
							const offset = paymentMethods
								.slice(0, index)
								.reduce((acc, curr) => acc + curr.percentage, 0);

							return (
								<div
									key={index}
									className={`absolute inset-0 ${colors[index % colors.length]}`}
									style={{
										clipPath: `polygon(50% 50%, ${
											50 + 50 * Math.cos((2 * Math.PI * offset) / 100)
										}% ${50 + 50 * Math.sin((2 * Math.PI * offset) / 100)}%, ${
											50 + 50 * Math.cos((2 * Math.PI * (offset + method.percentage)) / 100)
										}% ${50 + 50 * Math.sin((2 * Math.PI * (offset + method.percentage)) / 100)}%)`,
									}}
								></div>
							);
						})}
					</div>
				</div>

				<div>
					{paymentMethods.map((method, index) => (
						<div key={index} className='flex items-center justify-between mb-2'>
							<div className='flex items-center'>
								<div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-2`}></div>
								<span className='text-sm text-gray-700 dark:text-gray-300'>{method.method}</span>
							</div>
							<div className='text-sm text-gray-700 dark:text-gray-300'>
								<span>{method.percentage}%</span>
								<span className='mx-2'>|</span>
								<span className='ltr:inline rtl:inline'>
									{method.amount.toLocaleString()}
									<span className='inline-block relative h-3 w-3 mx-1 -mt-0.5'>
										<Image
											src='/images/Saudi_Riyal_Symbol.png'
											alt='ر.س'
											fill
											sizes='12px'
											style={{ objectFit: 'contain' }}
										/>
									</span>
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		);
	};

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-wrap justify-between items-center'>
				<div>
					<div className='flex items-center mb-1'>
						<Link
							href='/dashboard/reports'
							className='text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ml-2'
						>
							<ArrowRight className='h-5 w-5' />
						</Link>
						<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>تقرير الإيرادات</h1>
					</div>
					<p className='text-gray-500 dark:text-gray-400 text-sm'>تحليل المبيعات والإيرادات وأداء المتجر</p>
				</div>

				<div className='flex mt-4 sm:mt-0 space-x-3 space-x-reverse'>
					<button
						onClick={() => window.print()}
						className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
					>
						<Printer className='ml-1.5 -mr-1 h-5 w-5 text-gray-400 dark:text-gray-500' />
						طباعة التقرير
					</button>

					<button
						onClick={() => alert('تم تصدير البيانات')}
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
					>
						<Download className='ml-1.5 -mr-1 h-5 w-5' />
						تصدير CSV
					</button>
				</div>
			</div>

			{/* أدوات التقرير */}
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-4'>
				<div className='flex flex-wrap gap-4'>
					<div className='flex-1 min-w-[200px]'>
						<label
							htmlFor='period'
							className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
						>
							الفترة
						</label>
						<div className='relative'>
							<select
								id='period'
								className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white sm:text-sm'
								value={period}
								onChange={(e) => setPeriod(e.target.value as ReportPeriod)}
							>
								<option value='day'>آخر 24 ساعة</option>
								<option value='week'>هذا الأسبوع</option>
								<option value='month'>هذا الشهر</option>
								<option value='custom'>تاريخ مخصص</option>
							</select>
							<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
								<ChevronDown className='h-5 w-5 text-gray-400 dark:text-gray-500' />
							</div>
						</div>
					</div>

					{(period === 'custom' || showCustomDateRange) && (
						<>
							<div>
								<label
									htmlFor='start-date'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
								>
									من
								</label>
								<div className='relative'>
									<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
										<CalendarIcon className='h-5 w-5 text-gray-400 dark:text-gray-500' />
									</div>
									<input
										type='date'
										id='start-date'
										className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm'
										value={format(startDate, 'yyyy-MM-dd')}
										onChange={(e) => setStartDate(new Date(e.target.value))}
									/>
								</div>
							</div>

							<div>
								<label
									htmlFor='end-date'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
								>
									إلى
								</label>
								<div className='relative'>
									<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
										<CalendarIcon className='h-5 w-5 text-gray-400 dark:text-gray-500' />
									</div>
									<input
										type='date'
										id='end-date'
										className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm'
										value={format(endDate, 'yyyy-MM-dd')}
										onChange={(e) => setEndDate(new Date(e.target.value))}
									/>
								</div>
							</div>
						</>
					)}

					<div className='flex items-end'>
						<div className='flex items-center mr-2'>
							<input
								id='compare'
								type='checkbox'
								className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
								checked={comparePrevious}
								onChange={(e) => setComparePrevious(e.target.checked)}
							/>
							<label htmlFor='compare' className='mr-2 block text-sm text-gray-700 dark:text-gray-300'>
								مقارنة بالفترة السابقة
							</label>
						</div>

						<button
							onClick={() => generateMockData()}
							className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
						>
							<RefreshCw className='ml-1.5 -mr-1 h-4 w-4 text-gray-400 dark:text-gray-500' />
							تحديث
						</button>
					</div>
				</div>
			</div>

			{isLoading ? (
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-12'>
					<div className='flex flex-col items-center justify-center'>
						<div className='w-12 h-12 border-4 border-t-blue-600 border-gray-200 dark:border-gray-700 rounded-full animate-spin mb-4'></div>
						<p className='text-gray-500 dark:text-gray-400'>جاري تحميل بيانات التقرير...</p>
					</div>
				</div>
			) : (
				<>
					{/* بطاقات الإحصائيات */}
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
						{/* إجمالي الإيرادات */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
							<div className='flex justify-between items-start'>
								<div>
									<p className='text-sm text-gray-500 dark:text-gray-400'>إجمالي الإيرادات</p>
									<h3 className='mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100'>
										{reportStats.totalRevenue.toLocaleString()}
										<span className='inline-block relative h-5 w-5 mx-1 -mt-0.5'>
											<Image
												src='/images/Saudi_Riyal_Symbol.png'
												alt='ر.س'
												fill
												sizes='20px'
												style={{ objectFit: 'contain' }}
											/>
										</span>
									</h3>

									{comparePrevious && (
										<div className='mt-2 flex items-center'>
											{reportStats.percentChange > 0 ? (
												<ArrowUp className='h-4 w-4 text-green-500 dark:text-green-400' />
											) : (
												<ArrowDown className='h-4 w-4 text-red-500 dark:text-red-400' />
											)}
											<span
												className={`text-sm font-medium ${
													reportStats.percentChange > 0
														? 'text-green-500 dark:text-green-400'
														: 'text-red-500 dark:text-red-400'
												}`}
											>
												{Math.abs(reportStats.percentChange).toFixed(1)}%
											</span>
											<span className='text-sm text-gray-500 dark:text-gray-400 mr-1'>
												من الفترة السابقة
											</span>
										</div>
									)}
								</div>

								<div className='p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg'>
									<DollarSign className='h-6 w-6 text-blue-600 dark:text-blue-400' />
								</div>
							</div>
						</div>

						{/* إجمالي الطلبات */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
							<div className='flex justify-between items-start'>
								<div>
									<p className='text-sm text-gray-500 dark:text-gray-400'>إجمالي الطلبات</p>
									<h3 className='mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100'>
										{reportStats.totalOrders.toLocaleString()}
									</h3>

									{comparePrevious && (
										<div className='mt-2 flex items-center'>
											{reportStats.ordersPercentChange > 0 ? (
												<ArrowUp className='h-4 w-4 text-green-500 dark:text-green-400' />
											) : (
												<ArrowDown className='h-4 w-4 text-red-500 dark:text-red-400' />
											)}
											<span
												className={`text-sm font-medium ${
													reportStats.ordersPercentChange > 0
														? 'text-green-500 dark:text-green-400'
														: 'text-red-500 dark:text-red-400'
												}`}
											>
												{Math.abs(reportStats.ordersPercentChange).toFixed(1)}%
											</span>
											<span className='text-sm text-gray-500 dark:text-gray-400 mr-1'>
												من الفترة السابقة
											</span>
										</div>
									)}
								</div>

								<div className='p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg'>
									<ShoppingCart className='h-6 w-6 text-purple-600 dark:text-purple-400' />
								</div>
							</div>
						</div>

						{/* متوسط قيمة الطلب */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
							<div className='flex justify-between items-start'>
								<div>
									<p className='text-sm text-gray-500 dark:text-gray-400'>متوسط قيمة الطلب</p>
									<h3 className='mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100'>
										{reportStats.averageOrderValue.toFixed(0)}
										<span className='inline-block relative h-5 w-5 mx-1 -mt-0.5'>
											<Image
												src='/images/Saudi_Riyal_Symbol.png'
												alt='ر.س'
												fill
												sizes='20px'
												style={{ objectFit: 'contain' }}
											/>
										</span>
									</h3>

									{comparePrevious && (
										<div className='mt-2 flex items-center'>
											{reportStats.aovPercentChange > 0 ? (
												<ArrowUp className='h-4 w-4 text-green-500 dark:text-green-400' />
											) : (
												<ArrowDown className='h-4 w-4 text-red-500 dark:text-red-400' />
											)}
											<span
												className={`text-sm font-medium ${
													reportStats.aovPercentChange > 0
														? 'text-green-500 dark:text-green-400'
														: 'text-red-500 dark:text-red-400'
												}`}
											>
												{Math.abs(reportStats.aovPercentChange).toFixed(1)}%
											</span>
											<span className='text-sm text-gray-500 dark:text-gray-400 mr-1'>
												من الفترة السابقة
											</span>
										</div>
									)}
								</div>

								<div className='p-3 bg-green-100 dark:bg-green-900/30 rounded-lg'>
									<TrendingUp className='h-6 w-6 text-green-600 dark:text-green-400' />
								</div>
							</div>
						</div>

						{/* نسبة الإرجاع */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-6'>
							<div className='flex justify-between items-start'>
								<div>
									<p className='text-sm text-gray-500 dark:text-gray-400'>نسبة الإرجاع</p>
									<h3 className='mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100'>
										{reportStats.returnRate.toFixed(1)}%
									</h3>

									{comparePrevious && (
										<div className='mt-2 flex items-center'>
											{reportStats.returnRateChange < 0 ? (
												<ArrowDown className='h-4 w-4 text-green-500 dark:text-green-400' />
											) : (
												<ArrowUp className='h-4 w-4 text-red-500 dark:text-red-400' />
											)}
											<span
												className={`text-sm font-medium ${
													reportStats.returnRateChange < 0
														? 'text-green-500 dark:text-green-400'
														: 'text-red-500 dark:text-red-400'
												}`}
											>
												{Math.abs(reportStats.returnRateChange).toFixed(1)}%
											</span>
											<span className='text-sm text-gray-500 dark:text-gray-400 mr-1'>
												من الفترة السابقة
											</span>
										</div>
									)}
								</div>

								<div className='p-3 bg-red-100 dark:bg-red-900/30 rounded-lg'>
									<Clipboard className='h-6 w-6 text-red-600 dark:text-red-400' />
								</div>
							</div>
						</div>
					</div>

					{/* الرسوم البيانية */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						{/* تحليل المبيعات */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
								<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
									تحليل المبيعات
								</h2>
							</div>
							<div className='p-6'>
								<SalesChart />

								<div className='mt-4 grid grid-cols-3 gap-4 text-center'>
									<div>
										<p className='text-sm text-gray-500 dark:text-gray-400'>إجمالي المبيعات</p>
										<p className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
											{reportStats.totalRevenue.toLocaleString()}
											<span className='inline-block relative h-4 w-4 mx-1 -mt-0.5'>
												<Image
													src='/images/Saudi_Riyal_Symbol.png'
													alt='ر.س'
													fill
													sizes='16px'
													style={{ objectFit: 'contain' }}
												/>
											</span>
										</p>
									</div>
									<div>
										<p className='text-sm text-gray-500 dark:text-gray-400'>عدد الطلبات</p>
										<p className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
											{reportStats.totalOrders}
										</p>
									</div>
									<div>
										<p className='text-sm text-gray-500 dark:text-gray-400'>متوسط يومي</p>
										<p className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
											{(reportStats.totalRevenue / dailySales.length).toFixed(0)}
											<span className='inline-block relative h-4 w-4 mx-1 -mt-0.5'>
												<Image
													src='/images/Saudi_Riyal_Symbol.png'
													alt='ر.س'
													fill
													sizes='16px'
													style={{ objectFit: 'contain' }}
												/>
											</span>
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* توزيع طرق الدفع */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
								<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
									توزيع طرق الدفع
								</h2>
							</div>
							<div className='p-6'>
								<PaymentMethodChart />
							</div>
						</div>
					</div>

					{/* المنتجات والعملاء */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
						{/* المنتجات الأكثر مبيعاً */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
								<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
									المنتجات الأكثر مبيعاً
								</h2>

								<div className='relative w-48'>
									<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
										<Search className='h-5 w-5 text-gray-400 dark:text-gray-500' />
									</div>
									<input
										type='text'
										className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm'
										placeholder='بحث...'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
							</div>

							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
									<thead className='bg-gray-50 dark:bg-gray-700'>
										<tr>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												المنتج
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												الفئة
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												الكمية
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												الإيرادات
											</th>
										</tr>
									</thead>
									<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
										{filteredProducts.map((product, index) => (
											<tr key={index} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='flex items-center'>
														<div className='flex flex-col'>
															<span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
																{product.name}
															</span>
															<span className='text-xs text-gray-500 dark:text-gray-400'>
																{product.id}
															</span>
														</div>
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
													{product.category}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
													{product.quantity}
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='flex items-center'>
														<span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
															{product.revenue.toLocaleString()}
														</span>
														<span className='inline-block relative h-4 w-4 mx-1'>
															<Image
																src='/images/Saudi_Riyal_Symbol.png'
																alt='ر.س'
																fill
																sizes='16px'
																style={{ objectFit: 'contain' }}
															/>
														</span>
													</div>
												</td>
											</tr>
										))}

										{filteredProducts.length === 0 && (
											<tr>
												<td
													colSpan={4}
													className='px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400'
												>
													لا توجد منتجات مطابقة للبحث
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>

						{/* العملاء الأكثر إنفاقاً */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
								<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
									العملاء الأكثر إنفاقاً
								</h2>

								<div className='relative w-48'>
									<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
										<Search className='h-5 w-5 text-gray-400 dark:text-gray-500' />
									</div>
									<input
										type='text'
										className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm'
										placeholder='بحث...'
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
							</div>

							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
									<thead className='bg-gray-50 dark:bg-gray-700'>
										<tr>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												العميل
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												عدد المشتريات
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												إجمالي الإنفاق
											</th>
										</tr>
									</thead>
									<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
										{filteredCustomers.map((customer, index) => (
											<tr key={index} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='flex items-center'>
														<div className='flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center'>
															<User className='h-6 w-6 text-gray-400 dark:text-gray-500' />
														</div>
														<div className='mr-4 flex flex-col'>
															<span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
																{customer.name}
															</span>
															<span className='text-xs text-gray-500 dark:text-gray-400'>
																{customer.id}
															</span>
														</div>
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
													{customer.purchases}
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='flex items-center'>
														<span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
															{customer.spent.toLocaleString()}
														</span>
														<span className='inline-block relative h-4 w-4 mx-1'>
															<Image
																src='/images/Saudi_Riyal_Symbol.png'
																alt='ر.س'
																fill
																sizes='16px'
																style={{ objectFit: 'contain' }}
															/>
														</span>
													</div>
												</td>
											</tr>
										))}

										{filteredCustomers.length === 0 && (
											<tr>
												<td
													colSpan={3}
													className='px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400'
												>
													لا يوجد عملاء مطابقين للبحث
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
