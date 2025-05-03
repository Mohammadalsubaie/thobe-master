'use client';

import {
	ArrowDown,
	ArrowUp,
	BarChart2,
	Calendar,
	DollarSign,
	Download,
	Eye,
	FileText,
	Flag,
	Printer,
	Settings,
	TrendingDown,
	TrendingUp,
	Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FinancialSummary {
	income: number;
	expenses: number;
	netProfit: number;
	previousPeriodProfit: number;
	profitChange: number;
	accountsReceivable: number;
	accountsPayable: number;
	cashFlow: number;
	averageMonthlySales: number;
}

interface MonthlyData {
	month: string;
	income: number;
	expenses: number;
	profit: number;
}

interface CategoryData {
	name: string;
	amount: number;
	percentage: number;
}

interface TopItem {
	name: string;
	amount: number;
	change: number;
}

export default function FinancialReportsPage() {
	const [loading, setLoading] = useState(true);

	// التاريخ والفترة
	const [periodFilter, setPeriodFilter] = useState('month');
	const [dateRange, setDateRange] = useState({
		start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toISOString().split('T')[0],
		end: new Date(new Date().getFullYear(), new Date().getMonth(), 0).toISOString().split('T')[0],
	});

	// بيانات التقارير
	const [summary, setSummary] = useState<FinancialSummary | null>(null);
	const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
	const [expenseCategories, setExpenseCategories] = useState<CategoryData[]>([]);
	const [incomeCategories, setIncomeCategories] = useState<CategoryData[]>([]);
	const [topExpenses, setTopExpenses] = useState<TopItem[]>([]);
	const [topIncome, setTopIncome] = useState<TopItem[]>([]);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// مؤشرات الملخص المالي
			const mockSummary: FinancialSummary = {
				income: 85000,
				expenses: 56000,
				netProfit: 29000,
				previousPeriodProfit: 24500,
				profitChange: 18.4,
				accountsReceivable: 32000,
				accountsPayable: 18500,
				cashFlow: 38000,
				averageMonthlySales: 78000,
			};

			// البيانات الشهرية للرسم البياني
			const mockMonthlyData: MonthlyData[] = [
				{ month: 'يناير', income: 72000, expenses: 45000, profit: 27000 },
				{ month: 'فبراير', income: 68000, expenses: 50000, profit: 18000 },
				{ month: 'مارس', income: 75000, expenses: 48000, profit: 27000 },
				{ month: 'أبريل', income: 82000, expenses: 52000, profit: 30000 },
				{ month: 'مايو', income: 78000, expenses: 49000, profit: 29000 },
				{ month: 'يونيو', income: 85000, expenses: 51000, profit: 34000 },
				{ month: 'يوليو', income: 80000, expenses: 54000, profit: 26000 },
				{ month: 'أغسطس', income: 88000, expenses: 55000, profit: 33000 },
				{ month: 'سبتمبر', income: 82000, expenses: 53000, profit: 29000 },
				{ month: 'أكتوبر', income: 85000, expenses: 56000, profit: 29000 },
			];

			// فئات المصروفات
			const mockExpenseCategories: CategoryData[] = [
				{ name: 'رواتب', amount: 22000, percentage: 39.3 },
				{ name: 'إيجار', amount: 8500, percentage: 15.2 },
				{ name: 'مشتريات المخزون', amount: 15000, percentage: 26.8 },
				{ name: 'مرافق عامة', amount: 3500, percentage: 6.2 },
				{ name: 'تسويق وإعلان', amount: 4500, percentage: 8.0 },
				{ name: 'أخرى', amount: 2500, percentage: 4.5 },
			];

			// فئات الإيرادات
			const mockIncomeCategories: CategoryData[] = [
				{ name: 'مبيعات متجر', amount: 45000, percentage: 52.9 },
				{ name: 'مبيعات إلكترونية', amount: 18000, percentage: 21.2 },
				{ name: 'خدمات خياطة', amount: 12000, percentage: 14.1 },
				{ name: 'عقود', amount: 8500, percentage: 10.0 },
				{ name: 'أخرى', amount: 1500, percentage: 1.8 },
			];

			// أكبر المصروفات
			const mockTopExpenses: TopItem[] = [
				{ name: 'رواتب الموظفين', amount: 22000, change: 5.2 },
				{ name: 'إيجار المستودع', amount: 8500, change: 0 },
				{ name: 'شراء أقمشة', amount: 7500, change: 12.5 },
				{ name: 'شراء خيوط وإكسسوارات', amount: 4800, change: -3.5 },
				{ name: 'إعلانات فيسبوك', amount: 2800, change: 15.2 },
			];

			// أكبر مصادر الإيرادات
			const mockTopIncome: TopItem[] = [
				{ name: 'مبيعات ثياب رجالية', amount: 25000, change: 8.5 },
				{ name: 'مبيعات بشوت', amount: 15000, change: 12.0 },
				{ name: 'خدمات تفصيل', amount: 12000, change: 5.3 },
				{ name: 'عقد توريد زي مدرسي', amount: 8500, change: 0 },
				{ name: 'مبيعات شماغ', amount: 7200, change: -2.8 },
			];

			setSummary(mockSummary);
			setMonthlyData(mockMonthlyData);
			setExpenseCategories(mockExpenseCategories);
			setIncomeCategories(mockIncomeCategories);
			setTopExpenses(mockTopExpenses);
			setTopIncome(mockTopIncome);

			setLoading(false);
		};

		fetchData();
	}, []);

	// تغيير الفترة الزمنية
	const handlePeriodChange = (period: string) => {
		setPeriodFilter(period);

		const now = new Date();
		let start, end;

		if (period === 'month') {
			// الشهر السابق
			start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
			end = new Date(now.getFullYear(), now.getMonth(), 0);
		} else if (period === 'quarter') {
			// الربع الحالي

			// الربع الحالي
			const currentQuarter = Math.floor(now.getMonth() / 3);
			start = new Date(now.getFullYear(), currentQuarter * 3, 1);
			end = new Date(now.getFullYear(), (currentQuarter + 1) * 3, 0);
		} else if (period === 'year') {
			// السنة الحالية
			start = new Date(now.getFullYear(), 0, 1);
			end = new Date(now.getFullYear(), 11, 31);
		} else if (period === 'last_year') {
			// السنة السابقة
			start = new Date(now.getFullYear() - 1, 0, 1);
			end = new Date(now.getFullYear() - 1, 11, 31);
		}

		if (start && end) {
			setDateRange({
				start: start.toISOString().split('T')[0],
				end: end.toISOString().split('T')[0],
			});
		}
	};

	// تنسيق المبلغ
	const formatAmount = (amount: number) => {
		return new Intl.NumberFormat('ar-SA', {
			style: 'currency',
			currency: 'SAR',
		}).format(amount);
	};

	// تنسيق النسبة المئوية
	const formatPercentage = (percentage: number) => {
		return `${percentage > 0 ? '+' : ''}${percentage.toFixed(1)}%`;
	};

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
						<BarChart2 className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						التقارير المالية
					</h1>
					<p className='mt-1 text-gray-500'>تقارير الأرباح والخسائر والتحليل المالي</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<button
						onClick={() => {
							// محاكاة تحديث البيانات
							setLoading(true);
							setTimeout(() => setLoading(false), 500);
						}}
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<Eye className='ml-1 h-4 w-4' />
						تحديث
					</button>
					<button className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'>
						<Printer className='ml-1 h-4 w-4' />
						طباعة
					</button>
					<button className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'>
						<Download className='ml-1 h-4 w-4' />
						تصدير التقرير
					</button>
				</div>
			</div>

			{/* فلتر الفترة الزمنية */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
					<div className='flex items-center gap-2'>
						<Calendar className='h-5 w-5 text-gray-500' />
						<span className='text-sm font-medium text-gray-700'>الفترة الزمنية:</span>
						<div className='flex flex-wrap gap-2'>
							<button
								onClick={() => handlePeriodChange('month')}
								className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
									periodFilter === 'month'
										? 'bg-indigo-100 text-indigo-700'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								الشهر السابق
							</button>
							<button
								onClick={() => handlePeriodChange('quarter')}
								className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
									periodFilter === 'quarter'
										? 'bg-indigo-100 text-indigo-700'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								الربع الحالي
							</button>
							<button
								onClick={() => handlePeriodChange('year')}
								className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
									periodFilter === 'year'
										? 'bg-indigo-100 text-indigo-700'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								السنة الحالية
							</button>
							<button
								onClick={() => handlePeriodChange('last_year')}
								className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
									periodFilter === 'last_year'
										? 'bg-indigo-100 text-indigo-700'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								السنة السابقة
							</button>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<div className='relative'>
							<input
								type='date'
								value={dateRange.start}
								onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
								className='block w-40 appearance-none rounded-md border border-gray-300 py-1.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
							/>
						</div>
						<span className='text-gray-500'>-</span>
						<div className='relative'>
							<input
								type='date'
								value={dateRange.end}
								onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
								className='block w-40 appearance-none rounded-md border border-gray-300 py-1.5 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
							/>
						</div>
						<button
							className='px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center'
							onClick={() => {
								// محاكاة تحديث البيانات بناءً على النطاق المحدد
								setLoading(true);
								setTimeout(() => setLoading(false), 500);
							}}
						>
							تطبيق
						</button>
					</div>
				</div>
			</div>

			{/* بطاقات الملخص المالي */}
			{summary && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>صافي الربح</p>
								<p className='text-2xl font-bold text-indigo-600'>{formatAmount(summary.netProfit)}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
								<BarChart2 className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 flex items-center'>
							<span
								className={`text-xs ${
									summary.profitChange >= 0 ? 'text-green-600' : 'text-red-600'
								} flex items-center`}
							>
								{summary.profitChange >= 0 ? (
									<TrendingUp className='mr-1 h-3 w-3' />
								) : (
									<TrendingDown className='mr-1 h-3 w-3' />
								)}
								{formatPercentage(summary.profitChange)}
							</span>
							<span className='text-xs text-gray-500 mr-1'>مقارنة بالفترة السابقة</span>
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>الإيرادات</p>
								<p className='text-2xl font-bold text-green-600'>{formatAmount(summary.income)}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
								<ArrowDown className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>
							متوسط شهري: {formatAmount(summary.averageMonthlySales)}
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>المصروفات</p>
								<p className='text-2xl font-bold text-red-600'>{formatAmount(summary.expenses)}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600'>
								<ArrowUp className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>
							{((summary.expenses / summary.income) * 100).toFixed(1)}% من الإيرادات
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>التدفق النقدي</p>
								<p className='text-2xl font-bold text-amber-600'>{formatAmount(summary.cashFlow)}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
								<DollarSign className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>
							الذمم المدينة: {formatAmount(summary.accountsReceivable)}
						</div>
					</div>
				</div>
			)}

			{/* تقرير الدخل - الرسم البياني */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-lg font-medium text-gray-900'>تقرير الدخل</h2>
					<div className='flex gap-2'>
						<Link
							href='/dashboard/finance/reports/income-statement'
							className='text-sm text-indigo-600 hover:text-indigo-800 flex items-center'
						>
							<Eye className='ml-1 h-4 w-4' />
							عرض التقرير الكامل
						</Link>
						<button className='p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100'>
							<Download className='h-4 w-4' />
						</button>
					</div>
				</div>

				{/* رسم بياني للإيرادات والمصروفات والأرباح */}
				<div className='h-80 mt-6'>
					{/* هنا يمكن إضافة مكتبة رسوم بيانية مثل Chart.js أو Recharts */}
					{/* لأغراض العرض، سنستخدم تصور محاكي بسيط */}
					<div className='h-full flex items-end space-x-1 space-x-reverse'>
						{monthlyData.map((data, index) => (
							<div key={index} className='flex-1 flex flex-col items-center'>
								<div className='relative w-full mb-1'>
									<div className='absolute inset-x-0 bottom-0 h-40 flex flex-col justify-end items-center'>
										{/* شريط المصروفات */}
										<div
											className='w-5/6 bg-red-500 rounded-t-sm'
											style={{ height: `${(data.expenses / 100000) * 100}%` }}
											title={`المصروفات: ${formatAmount(data.expenses)}`}
										></div>

										{/* شريط الإيرادات */}
										<div
											className='w-5/6 bg-green-500 rounded-t-sm mt-0.5'
											style={{ height: `${(data.income / 100000) * 100}%` }}
											title={`الإيرادات: ${formatAmount(data.income)}`}
										></div>

										{/* شريط الأرباح */}
										<div
											className='w-5/6 bg-indigo-500 rounded-t-sm mt-0.5'
											style={{ height: `${(data.profit / 100000) * 100}%` }}
											title={`الربح: ${formatAmount(data.profit)}`}
										></div>
									</div>
								</div>
								<span className='text-xs text-gray-500 mt-1'>{data.month}</span>
							</div>
						))}
					</div>

					<div className='flex justify-center mt-4 space-x-4 space-x-reverse'>
						<div className='flex items-center'>
							<span className='w-3 h-3 bg-green-500 rounded-sm inline-block ml-1'></span>
							<span className='text-xs text-gray-600'>الإيرادات</span>
						</div>
						<div className='flex items-center'>
							<span className='w-3 h-3 bg-red-500 rounded-sm inline-block ml-1'></span>
							<span className='text-xs text-gray-600'>المصروفات</span>
						</div>
						<div className='flex items-center'>
							<span className='w-3 h-3 bg-indigo-500 rounded-sm inline-block ml-1'></span>
							<span className='text-xs text-gray-600'>صافي الربح</span>
						</div>
					</div>
				</div>
			</div>

			{/* توزيع المصروفات والإيرادات */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{/* توزيع المصروفات */}
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-lg font-medium text-gray-900'>توزيع المصروفات</h2>
						<Link
							href='/dashboard/finance/reports/expenses'
							className='text-sm text-indigo-600 hover:text-indigo-800'
						>
							التفاصيل
						</Link>
					</div>

					<div className='mb-6 grid grid-cols-2 gap-4'>
						<div className='flex flex-col items-center justify-center h-40'>
							{/* هنا يمكن إضافة رسم دائري باستخدام مكتبة رسوم بيانية */}
							{/* نستخدم محاكاة بسيطة للعرض */}
							<div className='relative w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center'>
								<svg viewBox='0 0 36 36' className='w-full h-full'>
									{/* كل قطاع من الرسم الدائري */}
									<path
										d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
										fill='none'
										stroke='#E5E7EB'
										strokeWidth='3'
									/>
									<path
										d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
										fill='none'
										stroke='#EF4444'
										strokeWidth='3'
										strokeDasharray='39.3, 100'
										strokeLinecap='round'
									/>
								</svg>
								<div className='absolute inset-0 flex items-center justify-center'>
									<span className='text-lg font-bold text-red-600'>
										{formatAmount(summary?.expenses || 0)}
									</span>
								</div>
							</div>
						</div>

						<div className='space-y-3'>
							{expenseCategories.map((category, index) => (
								<div key={index}>
									<div className='flex justify-between items-center text-sm mb-1'>
										<div className='flex items-center'>
											<span
												className={`inline-block w-3 h-3 rounded-sm mr-2 ${
													index === 0
														? 'bg-red-600'
														: index === 1
														? 'bg-amber-500'
														: index === 2
														? 'bg-blue-500'
														: index === 3
														? 'bg-green-500'
														: index === 4
														? 'bg-purple-500'
														: 'bg-gray-500'
												}`}
											></span>
											<span className='text-gray-700'>{category.name}</span>
										</div>
										<span className='font-medium'>{category.percentage}%</span>
									</div>
									<div className='w-full bg-gray-200 rounded-full h-1.5'>
										<div
											className={`h-1.5 rounded-full ${
												index === 0
													? 'bg-red-600'
													: index === 1
													? 'bg-amber-500'
													: index === 2
													? 'bg-blue-500'
													: index === 3
													? 'bg-green-500'
													: index === 4
													? 'bg-purple-500'
													: 'bg-gray-500'
											}`}
											style={{ width: `${category.percentage}%` }}
										></div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className='border-t border-gray-200 pt-3'>
						<h3 className='text-sm font-medium text-gray-700 mb-2'>أكبر المصروفات</h3>
						<div className='space-y-2'>
							{topExpenses.map((expense, index) => (
								<div key={index} className='flex justify-between items-center text-sm'>
									<span className='text-gray-600'>{expense.name}</span>
									<div className='flex items-center'>
										<span className='font-medium text-gray-900 ml-2'>
											{formatAmount(expense.amount)}
										</span>
										<span
											className={`text-xs ${
												expense.change >= 0 ? 'text-green-600' : 'text-red-600'
											}`}
										>
											{formatPercentage(expense.change)}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* توزيع الإيرادات */}
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-lg font-medium text-gray-900'>توزيع الإيرادات</h2>
						<Link
							href='/dashboard/finance/reports/income'
							className='text-sm text-indigo-600 hover:text-indigo-800'
						>
							التفاصيل
						</Link>
					</div>

					<div className='mb-6 grid grid-cols-2 gap-4'>
						<div className='flex flex-col items-center justify-center h-40'>
							{/* هنا يمكن إضافة رسم دائري باستخدام مكتبة رسوم بيانية */}
							{/* نستخدم محاكاة بسيطة للعرض */}
							<div className='relative w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center'>
								<svg viewBox='0 0 36 36' className='w-full h-full'>
									{/* كل قطاع من الرسم الدائري */}
									<path
										d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
										fill='none'
										stroke='#E5E7EB'
										strokeWidth='3'
									/>
									<path
										d='M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831'
										fill='none'
										stroke='#10B981'
										strokeWidth='3'
										strokeDasharray='52.9, 100'
										strokeLinecap='round'
									/>
								</svg>
								<div className='absolute inset-0 flex items-center justify-center'>
									<span className='text-lg font-bold text-green-600'>
										{formatAmount(summary?.income || 0)}
									</span>
								</div>
							</div>
						</div>

						<div className='space-y-3'>
							{incomeCategories.map((category, index) => (
								<div key={index}>
									<div className='flex justify-between items-center text-sm mb-1'>
										<div className='flex items-center'>
											<span
												className={`inline-block w-3 h-3 rounded-sm mr-2 ${
													index === 0
														? 'bg-green-600'
														: index === 1
														? 'bg-blue-500'
														: index === 2
														? 'bg-indigo-500'
														: index === 3
														? 'bg-purple-500'
														: 'bg-gray-500'
												}`}
											></span>
											<span className='text-gray-700'>{category.name}</span>
										</div>
										<span className='font-medium'>{category.percentage}%</span>
									</div>
									<div className='w-full bg-gray-200 rounded-full h-1.5'>
										<div
											className={`h-1.5 rounded-full ${
												index === 0
													? 'bg-green-600'
													: index === 1
													? 'bg-blue-500'
													: index === 2
													? 'bg-indigo-500'
													: index === 3
													? 'bg-purple-500'
													: 'bg-gray-500'
											}`}
											style={{ width: `${category.percentage}%` }}
										></div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className='border-t border-gray-200 pt-3'>
						<h3 className='text-sm font-medium text-gray-700 mb-2'>أكبر مصادر الإيرادات</h3>
						<div className='space-y-2'>
							{topIncome.map((income, index) => (
								<div key={index} className='flex justify-between items-center text-sm'>
									<span className='text-gray-600'>{income.name}</span>
									<div className='flex items-center'>
										<span className='font-medium text-gray-900 ml-2'>
											{formatAmount(income.amount)}
										</span>
										<span
											className={`text-xs ${
												income.change >= 0 ? 'text-green-600' : 'text-red-600'
											}`}
										>
											{formatPercentage(income.change)}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* معلومات التدفق النقدي والذمم */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				{/* الذمم المدينة */}
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-lg font-medium text-gray-900'>الذمم المدينة</h2>
						<Link
							href='/dashboard/finance/reports/accounts-receivable'
							className='text-sm text-indigo-600 hover:text-indigo-800'
						>
							عرض التقرير الكامل
						</Link>
					</div>

					<div className='flex justify-between mb-4'>
						<div className='text-center'>
							<p className='text-sm text-gray-500'>إجمالي الذمم المدينة</p>
							<p className='text-xl font-bold text-amber-600'>
								{formatAmount(summary?.accountsReceivable || 0)}
							</p>
						</div>
						<div className='text-center'>
							<p className='text-sm text-gray-500'>ذمم متأخرة السداد</p>
							<p className='text-xl font-bold text-red-600'>
								{formatAmount((summary?.accountsReceivable || 0) * 0.35)}
							</p>
						</div>
						<div className='text-center'>
							<p className='text-sm text-gray-500'>عدد العملاء</p>
							<p className='text-xl font-bold text-indigo-600'>14</p>
						</div>
					</div>

					<div className='mb-4'>
						<h3 className='text-sm font-medium text-gray-700 mb-2'>توزيع أعمار الذمم المدينة</h3>
						<div className='flex h-4 rounded-md overflow-hidden'>
							<div className='bg-green-500 h-full' style={{ width: '40%' }} title='0-30 يوم'></div>
							<div className='bg-blue-500 h-full' style={{ width: '25%' }} title='31-60 يوم'></div>
							<div className='bg-amber-500 h-full' style={{ width: '20%' }} title='61-90 يوم'></div>
							<div className='bg-red-500 h-full' style={{ width: '15%' }} title='> 90 يوم'></div>
						</div>
						<div className='flex justify-between mt-1 text-xs text-gray-500'>
							<span>0-30 يوم</span>
							<span>31-60 يوم</span>
							<span>61-90 يوم</span>
							<span> 90 يوم</span>
						</div>
					</div>

					<div className='text-sm'>
						<Link
							href='/dashboard/finance/customer-accounts'
							className='text-indigo-600 hover:underline flex items-center'
						>
							<Users className='ml-1 h-4 w-4' />
							عرض حسابات العملاء
						</Link>
					</div>
				</div>

				{/* التدفق النقدي */}
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-lg font-medium text-gray-900'>التدفق النقدي</h2>
						<Link
							href='/dashboard/finance/reports/cash-flow'
							className='text-sm text-indigo-600 hover:text-indigo-800'
						>
							عرض التقرير الكامل
						</Link>
					</div>

					<div className='flex justify-between mb-4'>
						<div className='text-center'>
							<p className='text-sm text-gray-500'>صافي التدفق النقدي</p>
							<p className='text-xl font-bold text-indigo-600'>{formatAmount(summary?.cashFlow || 0)}</p>
						</div>
						<div className='text-center'>
							<p className='text-sm text-gray-500'>تدفق نقدي وارد</p>
							<p className='text-xl font-bold text-green-600'>
								{formatAmount((summary?.income || 0) * 0.85)}
							</p>
						</div>
						<div className='text-center'>
							<p className='text-sm text-gray-500'>تدفق نقدي صادر</p>
							<p className='text-xl font-bold text-red-600'>
								{formatAmount((summary?.expenses || 0) * 0.9)}
							</p>
						</div>
					</div>

					<div className='mb-4'>
						<h3 className='text-sm font-medium text-gray-700 mb-2'>تحليل التدفق النقدي الشهري</h3>
						<div className='h-32 flex items-end space-x-1 space-x-reverse'>
							{monthlyData.slice(-6).map((data, index) => {
								const cashFlow = data.income * 0.85 - data.expenses * 0.9;
								const isPositive = cashFlow >= 0;
								const heightPercentage = (Math.abs(cashFlow) / 50000) * 100;

								return (
									<div key={index} className='flex-1 flex flex-col items-center'>
										<div className='relative w-full flex justify-center'>
											<div
												className={`w-4/5 ${
													isPositive ? 'bg-green-500' : 'bg-red-500'
												} rounded-sm`}
												style={{
													height: `${Math.min(100, heightPercentage)}%`,
													marginTop: isPositive ? 'auto' : 0,
												}}
												title={`${formatAmount(cashFlow)}`}
											></div>
										</div>
										<span className='text-xs text-gray-500 mt-1'>{data.month.substring(0, 3)}</span>
									</div>
								);
							})}
						</div>
					</div>

					<div className='text-sm'>
						<Link
							href='/dashboard/finance/transactions'
							className='text-indigo-600 hover:underline flex items-center'
						>
							<DollarSign className='ml-1 h-4 w-4' />
							عرض المعاملات المالية
						</Link>
					</div>
				</div>
			</div>

			{/* التقارير المتاحة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<h2 className='text-lg font-medium text-gray-900 mb-4'>التقارير المالية المتاحة</h2>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<Link
						href='/dashboard/finance/reports/income-statement'
						className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
					>
						<div className='flex items-start'>
							<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
								<FileText className='h-5 w-5' />
							</div>
							<div>
								<h3 className='text-base font-medium text-gray-900'>قائمة الدخل</h3>
								<p className='text-sm text-gray-500 mt-1'>
									تقرير مفصل عن الإيرادات والمصروفات وصافي الربح
								</p>
							</div>
						</div>
					</Link>

					<Link
						href='/dashboard/finance/reports/balance-sheet'
						className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
					>
						<div className='flex items-start'>
							<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
								<FileText className='h-5 w-5' />
							</div>
							<div>
								<h3 className='text-base font-medium text-gray-900'>الميزانية العمومية</h3>
								<p className='text-sm text-gray-500 mt-1'>تقرير عن الأصول والخصوم وحقوق الملكية</p>
							</div>
						</div>
					</Link>

					<Link
						href='/dashboard/finance/reports/cash-flow'
						className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
					>
						<div className='flex items-start'>
							<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
								<DollarSign className='h-5 w-5' />
							</div>
							<div>
								<h3 className='text-base font-medium text-gray-900'>قائمة التدفق النقدي</h3>
								<p className='text-sm text-gray-500 mt-1'>
									تحليل مفصل للتدفقات النقدية الواردة والصادرة
								</p>
							</div>
						</div>
					</Link>

					<Link
						href='/dashboard/finance/reports/accounts-receivable'
						className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
					>
						<div className='flex items-start'>
							<div className='flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ml-3'>
								<Users className='h-5 w-5' />
							</div>
							<div>
								<h3 className='text-base font-medium text-gray-900'>تقرير الذمم المدينة</h3>
								<p className='text-sm text-gray-500 mt-1'>
									تقرير مفصل عن أرصدة العملاء والذمم المستحقة
								</p>
							</div>
						</div>
					</Link>

					<Link
						href='/dashboard/finance/reports/expenses'
						className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
					>
						<div className='flex items-start'>
							<div className='flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 ml-3'>
								<ArrowUp className='h-5 w-5' />
							</div>
							<div>
								<h3 className='text-base font-medium text-gray-900'>تقرير المصروفات</h3>
								<p className='text-sm text-gray-500 mt-1'>تحليل مفصل للمصروفات حسب الفئة والمورد</p>
							</div>
						</div>
					</Link>

					<Link
						href='/dashboard/finance/reports/sales-by-product'
						className='p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
					>
						<div className='flex items-start'>
							<div className='flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 ml-3'>
								<BarChart2 className='h-5 w-5' />
							</div>
							<div>
								<h3 className='text-base font-medium text-gray-900'>تقرير المبيعات حسب المنتج</h3>
								<p className='text-sm text-gray-500 mt-1'>تحليل أداء المبيعات حسب المنتجات وفئاتها</p>
							</div>
						</div>
					</Link>
				</div>
			</div>

			{/* روابط سريعة */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Link
					href='/dashboard/finance/reports/income-statement'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
						<FileText className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>قائمة الدخل</h3>
						<p className='text-sm text-gray-500'>الإيرادات والمصروفات</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/reports/cash-flow'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
						<DollarSign className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>التدفق النقدي</h3>
						<p className='text-sm text-gray-500'>تحليل التدفقات النقدية</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/reports/custom'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
						<Settings className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>تقرير مخصص</h3>
						<p className='text-sm text-gray-500'>إنشاء تقارير مخصصة</p>
					</div>
				</Link>

				<Link
					href='/dashboard/finance/reports/tax'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ml-3'>
						<Flag className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>تقارير ضريبية</h3>
						<p className='text-sm text-gray-500'>تقارير ضريبة القيمة المضافة</p>
					</div>
				</Link>
			</div>
		</div>
	);
}
