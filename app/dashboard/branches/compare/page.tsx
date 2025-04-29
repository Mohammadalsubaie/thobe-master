'use client';

import {
	ArrowDownUp,
	ArrowLeft,
	BarChart,
	Building,
	CheckCircle,
	ChevronDown,
	Clock,
	DollarSign,
	Download,
	FileText,
	LineChart,
	PieChart,
	ShoppingCart,
	Star,
	TrendingUp,
	Users,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { JSX, useEffect, useState } from 'react';

interface Branch {
	id: number;
	name: string;
	code: string;
	city: string;
	status: 'active' | 'inactive' | 'maintenance';
}

interface PerformanceMetric {
	id: string;
	name: string;
	icon: JSX.Element;
	type: 'currency' | 'number' | 'percent' | 'rating';
}

interface BranchPerformance {
	id: number;
	branch: Branch;
	monthlySales: number[];
	totalSales: number;
	ordersCount: number;
	avgOrderValue: number;
	customersCount: number;
	employeesCount: number;
	conversionRate: number;
	rating: number;
	expenses: number;
	profit: number;
	topCategories: { name: string; value: number }[];
}

export default function BranchesComparePage() {
	const [branches, setBranches] = useState<Branch[]>([]);
	const [performanceData, setPerformanceData] = useState<BranchPerformance[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
	const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
	const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
		'totalSales',
		'ordersCount',
		'avgOrderValue',
		'rating',
	]);
	const [showMetricSelector, setShowMetricSelector] = useState(false);

	// تعريف المقاييس المتاحة
	const availableMetrics: PerformanceMetric[] = [
		{ id: 'totalSales', name: 'إجمالي المبيعات', icon: <DollarSign className='h-4 w-4' />, type: 'currency' },
		{ id: 'ordersCount', name: 'عدد الطلبات', icon: <ShoppingCart className='h-4 w-4' />, type: 'number' },
		{ id: 'avgOrderValue', name: 'متوسط قيمة الطلب', icon: <FileText className='h-4 w-4' />, type: 'currency' },
		{ id: 'customersCount', name: 'عدد العملاء', icon: <Users className='h-4 w-4' />, type: 'number' },
		{ id: 'employeesCount', name: 'عدد الموظفين', icon: <Users className='h-4 w-4' />, type: 'number' },
		{ id: 'conversionRate', name: 'معدل التحويل', icon: <TrendingUp className='h-4 w-4' />, type: 'percent' },
		{ id: 'rating', name: 'تقييم العملاء', icon: <Star className='h-4 w-4' />, type: 'rating' },
		{ id: 'expenses', name: 'المصروفات', icon: <DollarSign className='h-4 w-4' />, type: 'currency' },
		{ id: 'profit', name: 'صافي الربح', icon: <DollarSign className='h-4 w-4' />, type: 'currency' },
	];

	// تحميل بيانات الفروع وأدائها
	useEffect(() => {
		const fetchBranchesData = async () => {
			setLoading(true);
			try {
				// محاكاة تحميل البيانات من API
				await new Promise((resolve) => setTimeout(resolve, 800));

				// بيانات تجريبية للفروع
				const mockBranches: Branch[] = [
					{ id: 1, name: 'فرع الرياض الرئيسي', code: 'RYD-001', city: 'الرياض', status: 'active' },
					{ id: 2, name: 'فرع جدة', code: 'JED-001', city: 'جدة', status: 'active' },
					{ id: 3, name: 'فرع الدمام', code: 'DMM-001', city: 'الدمام', status: 'active' },
					{ id: 4, name: 'فرع مكة', code: 'MKH-001', city: 'مكة', status: 'maintenance' },
					{ id: 5, name: 'فرع المدينة', code: 'MDN-001', city: 'المدينة', status: 'active' },
					{ id: 6, name: 'فرع الطائف', code: 'TAF-001', city: 'الطائف', status: 'inactive' },
				];

				// بيانات تجريبية لأداء الفروع
				const mockPerformanceData: BranchPerformance[] = [
					{
						id: 1,
						branch: mockBranches[0],
						monthlySales: [750000, 780000, 830000, 805000, 840000, 850000],
						totalSales: 850000,
						ordersCount: 4580,
						avgOrderValue: 185.6,
						customersCount: 3200,
						employeesCount: 25,
						conversionRate: 68.3,
						rating: 4.7,
						expenses: 350000,
						profit: 500000,
						topCategories: [
							{ name: 'ثياب', value: 45 },
							{ name: 'جلابيات', value: 32 },
							{ name: 'أثواب مناسبات', value: 15 },
							{ name: 'أخرى', value: 8 },
						],
					},
					{
						id: 2,
						branch: mockBranches[1],
						monthlySales: [650000, 680000, 700000, 710000, 705000, 720000],
						totalSales: 720000,
						ordersCount: 3200,
						avgOrderValue: 225.0,
						customersCount: 2500,
						employeesCount: 20,
						conversionRate: 72.4,
						rating: 4.5,
						expenses: 280000,
						profit: 440000,
						topCategories: [
							{ name: 'ثياب', value: 42 },
							{ name: 'جلابيات', value: 28 },
							{ name: 'أثواب مناسبات', value: 20 },
							{ name: 'أخرى', value: 10 },
						],
					},
					{
						id: 3,
						branch: mockBranches[2],
						monthlySales: [410000, 425000, 440000, 430000, 445000, 450000],
						totalSales: 450000,
						ordersCount: 2100,
						avgOrderValue: 214.3,
						customersCount: 1800,
						employeesCount: 15,
						conversionRate: 65.8,
						rating: 4.3,
						expenses: 180000,
						profit: 270000,
						topCategories: [
							{ name: 'ثياب', value: 50 },
							{ name: 'جلابيات', value: 25 },
							{ name: 'أثواب مناسبات', value: 18 },
							{ name: 'أخرى', value: 7 },
						],
					},
					{
						id: 4,
						branch: mockBranches[3],
						monthlySales: [280000, 290000, 300000, 310000, 315000, 320000],
						totalSales: 320000,
						ordersCount: 1500,
						avgOrderValue: 213.3,
						customersCount: 1100,
						employeesCount: 10,
						conversionRate: 76.2,
						rating: 4.2,
						expenses: 120000,
						profit: 200000,
						topCategories: [
							{ name: 'ثياب', value: 55 },
							{ name: 'جلابيات', value: 20 },
							{ name: 'أثواب مناسبات', value: 20 },
							{ name: 'أخرى', value: 5 },
						],
					},
					{
						id: 5,
						branch: mockBranches[4],
						monthlySales: [340000, 350000, 360000, 365000, 370000, 380000],
						totalSales: 380000,
						ordersCount: 1800,
						avgOrderValue: 211.1,
						customersCount: 1500,
						employeesCount: 12,
						conversionRate: 67.5,
						rating: 4.4,
						expenses: 150000,
						profit: 230000,
						topCategories: [
							{ name: 'ثياب', value: 48 },
							{ name: 'جلابيات', value: 30 },
							{ name: 'أثواب مناسبات', value: 14 },
							{ name: 'أخرى', value: 8 },
						],
					},
					{
						id: 6,
						branch: mockBranches[5],
						monthlySales: [180000, 190000, 200000, 205000, 208000, 210000],
						totalSales: 210000,
						ordersCount: 950,
						avgOrderValue: 221.1,
						customersCount: 800,
						employeesCount: 8,
						conversionRate: 63.2,
						rating: 4.0,
						expenses: 90000,
						profit: 120000,
						topCategories: [
							{ name: 'ثياب', value: 52 },
							{ name: 'جلابيات', value: 28 },
							{ name: 'أثواب مناسبات', value: 12 },
							{ name: 'أخرى', value: 8 },
						],
					},
				];

				setBranches(mockBranches);
				setPerformanceData(mockPerformanceData);
				setSelectedBranches([1, 2]); // تحديد الفرعين الأولين افتراضياً
			} catch (error) {
				console.error('Error fetching branches data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchBranchesData();
	}, []);

	// تنسيق القيمة حسب نوع المقياس
	const formatMetricValue = (value: number, metricType: string) => {
		const metric = availableMetrics.find((m) => m.id === metricType);
		if (!metric) return value.toString();

		switch (metric.type) {
			case 'currency':
				return `${value.toLocaleString()} ر.س`;
			case 'percent':
				return `${value.toFixed(1)}%`;
			case 'rating':
				return value.toFixed(1);
			default:
				return value.toLocaleString();
		}
	};

	// الحصول على بيانات الفروع المحددة
	const getSelectedBranchesData = () => {
		return performanceData.filter((data) => selectedBranches.includes(data.branch.id));
	};

	// الحصول على النسبة المئوية للفارق بين فرعين
	const getDifferencePercentage = (value1: number, value2: number) => {
		if (value2 === 0) return 0;
		return ((value1 - value2) / value2) * 100;
	};

	// الحصول على لون الفارق (أخضر للزيادة، أحمر للنقصان)
	const getDifferenceColor = (diff: number, isPositiveGood: boolean = true) => {
		if (diff === 0) return 'text-gray-500';
		const isPositive = diff > 0;
		return (isPositive && isPositiveGood) || (!isPositive && !isPositiveGood) ? 'text-green-600' : 'text-red-600';
	};

	// تبديل تحديد مقياس
	const toggleMetricSelection = (metricId: string) => {
		if (selectedMetrics.includes(metricId)) {
			if (selectedMetrics.length > 1) {
				// منع إزالة جميع المقاييس
				setSelectedMetrics(selectedMetrics.filter((id) => id !== metricId));
			}
		} else {
			setSelectedMetrics([...selectedMetrics, metricId]);
		}
	};

	// الحصول على حالة الفرع بالعربية
	const getBranchStatusText = (status: string) => {
		switch (status) {
			case 'active':
				return 'نشط';
			case 'inactive':
				return 'غير نشط';
			case 'maintenance':
				return 'تحت الصيانة';
			default:
				return 'غير معروف';
		}
	};

	// الحصول على لون حالة الفرع
	const getBranchStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'inactive':
				return 'bg-red-100 text-red-800';
			case 'maintenance':
				return 'bg-amber-100 text-amber-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const selectedBranchesData = getSelectedBranchesData();

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<ArrowDownUp className='ml-2 h-6 w-6 text-gray-600' /> مقارنة أداء الفروع
					</h1>
					<p className='mt-1 text-sm text-gray-600'>مقارنة مؤشرات أداء الفروع وتحليل الفروقات</p>
				</div>

				<div className='flex items-center space-x-2 space-x-reverse'>
					<Link
						href='/dashboard/branches'
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'
					>
						<ArrowLeft className='ml-1 h-4 w-4' />
						العودة للفروع
					</Link>

					<button className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'>
						<Download className='ml-1 h-4 w-4' />
						تصدير المقارنة
					</button>
				</div>
			</div>

			{/* اختيار الفروع للمقارنة */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
				<h2 className='text-sm font-medium text-gray-700 mb-4'>اختر الفروع للمقارنة</h2>

				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
					{branches.map((branch) => (
						<div
							key={branch.id}
							onClick={() => {
								if (selectedBranches.includes(branch.id)) {
									if (selectedBranches.length > 1) {
										// منع إزالة جميع الفروع
										setSelectedBranches(selectedBranches.filter((id) => id !== branch.id));
									}
								} else {
									setSelectedBranches([...selectedBranches, branch.id]);
								}
							}}
							className={`p-3 border rounded-lg cursor-pointer flex justify-between items-center ${
								selectedBranches.includes(branch.id)
									? 'border-green-500 bg-green-50'
									: 'border-gray-200 hover:bg-gray-50'
							}`}
						>
							<div className='flex items-center'>
								<Building className='h-5 w-5 text-gray-500 ml-2' />
								<div>
									<h3 className='text-sm font-medium text-gray-900'>{branch.name}</h3>
									<div className='flex items-center mt-1'>
										<span className='text-xs text-gray-500'>{branch.code}</span>
										<span className='mx-1'>•</span>
										<span
											className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${getBranchStatusColor(
												branch.status
											)}`}
										>
											{getBranchStatusText(branch.status)}
										</span>
									</div>
								</div>
							</div>

							{selectedBranches.includes(branch.id) && (
								<CheckCircle className='h-5 w-5 text-green-500 flex-shrink-0' />
							)}
						</div>
					))}
				</div>

				<div className='mt-4 flex justify-between items-center'>
					<div className='flex items-center space-x-3 space-x-reverse'>
						<div className='text-sm text-gray-700'>الفترة:</div>
						<select
							value={selectedPeriod}
							onChange={(e) => setSelectedPeriod(e.target.value as any)}
							className='rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm'
						>
							<option value='month'>الشهر الأخير</option>
							<option value='quarter'>الربع الأخير</option>
							<option value='year'>السنة الأخيرة</option>
						</select>
					</div>

					<div className='relative'>
						<button
							onClick={() => setShowMetricSelector(!showMetricSelector)}
							className='flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none'
						>
							تعديل المقاييس
							<ChevronDown className='mr-1 h-4 w-4' />
						</button>

						{showMetricSelector && (
							<div className='absolute z-10 left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg'>
								<div className='py-1 px-2 border-b border-gray-200'>
									<h3 className='text-xs font-medium text-gray-700'>اختر المقاييس</h3>
								</div>
								<div className='py-1 max-h-60 overflow-y-auto'>
									{availableMetrics.map((metric) => (
										<div
											key={metric.id}
											className='px-2 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between'
											onClick={() => toggleMetricSelection(metric.id)}
										>
											<div className='flex items-center'>
												<span className='ml-2'>{metric.icon}</span>
												<span className='text-sm text-gray-700'>{metric.name}</span>
											</div>
											{selectedMetrics.includes(metric.id) ? (
												<CheckCircle className='h-4 w-4 text-green-500' />
											) : (
												<div className='h-4 w-4 border rounded-sm border-gray-300'></div>
											)}
										</div>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* المقارنة الرئيسية */}
			{loading ? (
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
					<div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500'></div>
					<p className='mt-2 text-sm text-gray-600'>جاري تحميل البيانات...</p>
				</div>
			) : selectedBranchesData.length === 0 ? (
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
					<Building className='h-12 w-12 text-gray-300 mx-auto mb-3' />
					<h3 className='text-lg font-medium text-gray-900'>يرجى اختيار فروع للمقارنة</h3>
					<p className='mt-1 text-gray-500'>اختر فرعين أو أكثر من القائمة أعلاه لبدء المقارنة</p>
				</div>
			) : (
				<>
					{/* مقارنة المقاييس الرئيسية */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						<div className='px-4 py-3 border-b border-gray-200'>
							<h2 className='text-sm font-medium text-gray-700'>مقارنة المقاييس الرئيسية</h2>
						</div>

						<div className='p-4'>
							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead>
										<tr>
											<th className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												المقياس
											</th>
											{selectedBranchesData.map((data) => (
												<th
													key={data.id}
													className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													{data.branch.name}
												</th>
											))}
											{selectedBranchesData.length === 2 && (
												<th className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
													الفرق
												</th>
											)}
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										{selectedMetrics.map((metricId) => {
											const metric = availableMetrics.find((m) => m.id === metricId);
											if (!metric) return null;

											const isExpenseMetric = metricId === 'expenses';
											const isPositiveGood = !isExpenseMetric;

											return (
												<tr key={metricId} className='hover:bg-gray-50'>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='flex items-center text-sm font-medium text-gray-900'>
															<span className='ml-2'>{metric.icon}</span>
															{metric.name}
														</div>
													</td>

													{selectedBranchesData.map((data, index) => (
														<td
															key={`${data.id}-${metricId}`}
															className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
														>
															{formatMetricValue((data as any)[metricId], metricId)}
														</td>
													))}

													{selectedBranchesData.length === 2 && (
														<td className='px-6 py-4 whitespace-nowrap'>
															{(() => {
																const value1 = (selectedBranchesData[0] as any)[
																	metricId
																];
																const value2 = (selectedBranchesData[1] as any)[
																	metricId
																];
																const diff = value1 - value2;
																const diffPercentage = getDifferencePercentage(
																	value1,
																	value2
																);

																return (
																	<div
																		className={`flex items-center text-sm font-medium ${getDifferenceColor(
																			diff,
																			isPositiveGood
																		)}`}
																	>
																		{diff > 0 ? '+' : diff < 0 ? '-' : ''}
																		{Math.abs(diff).toLocaleString()}
																		<span className='mr-1'>
																			({Math.abs(diffPercentage).toFixed(1)}%)
																		</span>
																	</div>
																);
															})()}
														</td>
													)}
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						</div>
					</div>

					{/* الرسم البياني للمقارنة */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						<div className='px-4 py-3 border-b border-gray-200 flex justify-between items-center'>
							<h2 className='text-sm font-medium text-gray-700'>رسم بياني للمقارنة</h2>
							<select
								className='rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm'
								defaultValue='totalSales'
							>
								{availableMetrics.map((metric) => (
									<option key={metric.id} value={metric.id}>
										{metric.name}
									</option>
								))}
							</select>
						</div>

						<div className='p-4'>
							<div className='h-80 flex items-center justify-center'>
								{/* هنا سيكون الرسم البياني الحقيقي باستخدام مكتبة مثل Chart.js أو Recharts */}
								<div className='text-center'>
									<BarChart className='h-12 w-12 text-gray-300 mx-auto mb-2' />
									<p className='text-gray-500'>هنا سيظهر الرسم البياني لمقارنة أداء الفروع</p>
								</div>
							</div>
						</div>
					</div>

					{/* تحليل الفروقات */}
					{selectedBranchesData.length === 2 && (
						<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
							<div className='px-4 py-3 border-b border-gray-200'>
								<h2 className='text-sm font-medium text-gray-700'>تحليل الفروقات</h2>
							</div>

							<div className='p-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='border border-gray-200 rounded-lg p-4'>
										<h3 className='text-sm font-medium text-gray-900 mb-3'>
											توزيع المبيعات حسب الأصناف
										</h3>
										<div className='h-64 flex items-center justify-center'>
											{/* هنا سيكون رسم دائري لتوزيع المبيعات */}
											<PieChart className='h-12 w-12 text-gray-300' />
										</div>
									</div>

									<div className='border border-gray-200 rounded-lg p-4'>
										<h3 className='text-sm font-medium text-gray-900 mb-3'>
											تطور المبيعات الشهرية
										</h3>
										<div className='h-64 flex items-center justify-center'>
											{/* هنا سيكون رسم بياني خطي لتطور المبيعات */}
											<LineChart className='h-12 w-12 text-gray-300' />
										</div>
									</div>
								</div>

								<div className='mt-6 border border-gray-200 rounded-lg p-4'>
									<h3 className='text-sm font-medium text-gray-900 mb-3'>ملاحظات وتوصيات</h3>
									<div className='space-y-2'>
										<div className='flex items-start'>
											<div className='flex-shrink-0 mt-0.5'>
												<CheckCircle className='h-5 w-5 text-green-500' />
											</div>
											<p className='mr-2 text-sm text-gray-700'>
												يتفوق فرع {selectedBranchesData[0].branch.name} في إجمالي المبيعات بنسبة{' '}
												{Math.abs(
													getDifferencePercentage(
														selectedBranchesData[0].totalSales,
														selectedBranchesData[1].totalSales
													)
												).toFixed(1)}
												% عن فرع {selectedBranchesData[1].branch.name}.
											</p>
										</div>

										<div className='flex items-start'>
											<div className='flex-shrink-0 mt-0.5 '>
												<CheckCircle className='h-5 w-5 text-green-500' />
											</div>
											<p className='mr-2 text-sm text-gray-700'>
												متوسط قيمة الطلب في فرع {selectedBranchesData[1].branch.name} أعلى بنسبة{' '}
												{Math.abs(
													getDifferencePercentage(
														selectedBranchesData[1].avgOrderValue,
														selectedBranchesData[0].avgOrderValue
													)
												).toFixed(1)}
												% مما يشير إلى احتمالية بيع منتجات ذات قيمة أعلى.
											</p>
										</div>

										<div className='flex items-start'>
											<div className='flex-shrink-0 mt-0.5'>
												<XCircle className='h-5 w-5 text-red-500' />
											</div>
											<p className='mr-2 text-sm text-gray-700'>
												معدل التحويل في فرع{' '}
												{selectedBranchesData[1].conversionRate <
												selectedBranchesData[0].conversionRate
													? selectedBranchesData[1].branch.name
													: selectedBranchesData[0].branch.name}{' '}
												أقل بنسبة{' '}
												{Math.abs(
													getDifferencePercentage(
														selectedBranchesData[0].conversionRate,
														selectedBranchesData[1].conversionRate
													)
												).toFixed(1)}
												%، مما يتطلب مراجعة استراتيجيات البيع وتدريب الموظفين.
											</p>
										</div>

										<div className='flex items-start'>
											<div className='flex-shrink-0 mt-0.5'>
												<Clock className='h-5 w-5 text-blue-500' />
											</div>
											<p className='mr-2 text-sm text-gray-700'>
												يوصى بزيادة التركيز على تحسين أداء فرع{' '}
												{selectedBranchesData[0].profit < selectedBranchesData[1].profit
													? selectedBranchesData[0].branch.name
													: selectedBranchesData[1].branch.name}{' '}
												من خلال تطبيق الممارسات الناجحة من الفرع الآخر.
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* جدول النسب والمؤشرات */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						<div className='px-4 py-3 border-b border-gray-200'>
							<h2 className='text-sm font-medium text-gray-700'>النسب والمؤشرات الإضافية</h2>
						</div>

						<div className='p-4'>
							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead>
										<tr>
											<th className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												المؤشر
											</th>
											{selectedBranchesData.map((data) => (
												<th
													key={data.id}
													className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													{data.branch.name}
												</th>
											))}
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										<tr className='hover:bg-gray-50'>
											<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
												المبيعات لكل موظف
											</td>
											{selectedBranchesData.map((data) => (
												<td
													key={`${data.id}-sales-per-employee`}
													className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
												>
													{(data.totalSales / data.employeesCount).toLocaleString()} ر.س
												</td>
											))}
										</tr>
										<tr className='hover:bg-gray-50'>
											<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
												الطلبات لكل موظف
											</td>
											{selectedBranchesData.map((data) => (
												<td
													key={`${data.id}-orders-per-employee`}
													className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
												>
													{(data.ordersCount / data.employeesCount).toFixed(1)}
												</td>
											))}
										</tr>
										<tr className='hover:bg-gray-50'>
											<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
												هامش الربح
											</td>
											{selectedBranchesData.map((data) => (
												<td
													key={`${data.id}-profit-margin`}
													className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
												>
													{((data.profit / data.totalSales) * 100).toFixed(1)}%
												</td>
											))}
										</tr>
										<tr className='hover:bg-gray-50'>
											<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
												نسبة المصروفات إلى المبيعات
											</td>
											{selectedBranchesData.map((data) => (
												<td
													key={`${data.id}-expense-ratio`}
													className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
												>
													{((data.expenses / data.totalSales) * 100).toFixed(1)}%
												</td>
											))}
										</tr>
										<tr className='hover:bg-gray-50'>
											<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
												متوسط العملاء لكل موظف
											</td>
											{selectedBranchesData.map((data) => (
												<td
													key={`${data.id}-customers-per-employee`}
													className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'
												>
													{(data.customersCount / data.employeesCount).toFixed(1)}
												</td>
											))}
										</tr>
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
