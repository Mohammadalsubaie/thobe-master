'use client';

import {
	ArrowLeft,
	BarChart,
	Building,
	DollarSign,
	Download,
	PieChart,
	ShoppingCart,
	Star,
	TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BranchPerformance {
	id: number;
	name: string;
	code: string;
	city: string;
	totalSales: number;
	ordersCount: number;
	avgOrderValue: number;
	customersCount: number;
	conversionRate: number;
	growth: number;
	employeesCount: number;
	rating: number;
}

interface PerformanceMetric {
	label: string;
	id: string;
	value: (branch: BranchPerformance) => number;
	format: (value: number) => string;
	color: string;
}

export default function BranchesReportsPage() {
	const [branchesData, setBranchesData] = useState<BranchPerformance[]>([]);
	const [loading, setLoading] = useState(true);
	const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
		start: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0],
		end: new Date().toISOString().split('T')[0],
	});
	const [selectedMetric, setSelectedMetric] = useState<string>('totalSales');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [cityFilter, setCityFilter] = useState<string>('all');

	// تحميل بيانات أداء الفروع
	useEffect(() => {
		const fetchBranchesPerformance = async () => {
			setLoading(true);
			try {
				// محاكاة تحميل البيانات من API
				await new Promise((resolve) => setTimeout(resolve, 800));

				// بيانات تجريبية للفروع
				const mockBranchesData: BranchPerformance[] = [
					{
						id: 1,
						name: 'فرع الرياض الرئيسي',
						code: 'RYD-001',
						city: 'الرياض',
						totalSales: 850000,
						ordersCount: 4580,
						avgOrderValue: 185.6,
						customersCount: 3200,
						conversionRate: 68.3,
						growth: 12.5,
						employeesCount: 25,
						rating: 4.7,
					},
					{
						id: 2,
						name: 'فرع جدة',
						code: 'JED-001',
						city: 'جدة',
						totalSales: 720000,
						ordersCount: 3200,
						avgOrderValue: 225.0,
						customersCount: 2500,
						conversionRate: 72.4,
						growth: 8.3,
						employeesCount: 20,
						rating: 4.5,
					},
					{
						id: 3,
						name: 'فرع الدمام',
						code: 'DMM-001',
						city: 'الدمام',
						totalSales: 450000,
						ordersCount: 2100,
						avgOrderValue: 214.3,
						customersCount: 1800,
						conversionRate: 65.8,
						growth: 5.2,
						employeesCount: 15,
						rating: 4.3,
					},
					{
						id: 4,
						name: 'فرع مكة',
						code: 'MKH-001',
						city: 'مكة',
						totalSales: 320000,
						ordersCount: 1500,
						avgOrderValue: 213.3,
						customersCount: 1100,
						conversionRate: 76.2,
						growth: 15.4,
						employeesCount: 10,
						rating: 4.2,
					},
					{
						id: 5,
						name: 'فرع المدينة',
						code: 'MDN-001',
						city: 'المدينة',
						totalSales: 380000,
						ordersCount: 1800,
						avgOrderValue: 211.1,
						customersCount: 1500,
						conversionRate: 67.5,
						growth: 9.8,
						employeesCount: 12,
						rating: 4.4,
					},
					{
						id: 6,
						name: 'فرع الطائف',
						code: 'TAF-001',
						city: 'الطائف',
						totalSales: 210000,
						ordersCount: 950,
						avgOrderValue: 221.1,
						customersCount: 800,
						conversionRate: 63.2,
						growth: 3.5,
						employeesCount: 8,
						rating: 4.0,
					},
				];

				setBranchesData(mockBranchesData);
			} catch (error) {
				console.error('Error fetching branches performance:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchBranchesPerformance();
	}, []);

	// تعريف المقاييس وطريقة عرضها
	const metrics: PerformanceMetric[] = [
		{
			label: 'إجمالي المبيعات',
			id: 'totalSales',
			value: (branch) => branch.totalSales,
			format: (value) => `${(value / 1000).toFixed(0)}K ر.س`,
			color: 'bg-green-500',
		},
		{
			label: 'عدد الطلبات',
			id: 'ordersCount',
			value: (branch) => branch.ordersCount,
			format: (value) => value.toLocaleString(),
			color: 'bg-blue-500',
		},
		{
			label: 'متوسط قيمة الطلب',
			id: 'avgOrderValue',
			value: (branch) => branch.avgOrderValue,
			format: (value) => `${value.toFixed(1)} ر.س`,
			color: 'bg-purple-500',
		},
		{
			label: 'عدد العملاء',
			id: 'customersCount',
			value: (branch) => branch.customersCount,
			format: (value) => value.toLocaleString(),
			color: 'bg-amber-500',
		},
		{
			label: 'معدل التحويل',
			id: 'conversionRate',
			value: (branch) => branch.conversionRate,
			format: (value) => `${value.toFixed(1)}%`,
			color: 'bg-cyan-500',
		},
		{
			label: 'نسبة النمو',
			id: 'growth',
			value: (branch) => branch.growth,
			format: (value) => `${value.toFixed(1)}%`,
			color: 'bg-rose-500',
		},
		{
			label: 'عدد الموظفين',
			id: 'employeesCount',
			value: (branch) => branch.employeesCount,
			format: (value) => value.toLocaleString(),
			color: 'bg-indigo-500',
		},
		{
			label: 'تقييم العملاء',
			id: 'rating',
			value: (branch) => branch.rating,
			format: (value) => value.toFixed(1),
			color: 'bg-yellow-500',
		},
	];

	// الحصول على المقياس المحدد
	const selectedMetricObj = metrics.find((m) => m.id === selectedMetric) || metrics[0];

	// تصفية وترتيب البيانات
	const getFilteredAndSortedData = () => {
		let filtered = [...branchesData];

		// تطبيق فلتر المدينة
		if (cityFilter !== 'all') {
			filtered = filtered.filter((branch) => branch.city === cityFilter);
		}

		// ترتيب البيانات
		filtered.sort((a, b) => {
			const valueA = selectedMetricObj.value(a);
			const valueB = selectedMetricObj.value(b);

			if (sortOrder === 'asc') {
				return valueA - valueB;
			} else {
				return valueB - valueA;
			}
		});

		return filtered;
	};

	// الحصول على أفضل وأسوأ أداء
	const getBestAndWorstPerformance = () => {
		const sorted = [...branchesData].sort((a, b) => {
			return selectedMetricObj.value(b) - selectedMetricObj.value(a);
		});

		return {
			best: sorted.length > 0 ? sorted[0] : null,
			worst: sorted.length > 0 ? sorted[sorted.length - 1] : null,
		};
	};

	// حساب المتوسط
	const calculateAverage = () => {
		if (branchesData.length === 0) return 0;

		const sum = branchesData.reduce((total, branch) => {
			return total + selectedMetricObj.value(branch);
		}, 0);

		return sum / branchesData.length;
	};

	// الحصول على الفروع الفريدة
	const getUniqueCities = () => {
		return Array.from(new Set(branchesData.map((branch) => branch.city)));
	};

	// الحصول على النسبة المئوية من الحد الأقصى
	const getPercentageOfMax = (value: number) => {
		const max = Math.max(...branchesData.map((branch) => selectedMetricObj.value(branch)));
		return max > 0 ? (value / max) * 100 : 0;
	};

	const filteredAndSortedData = getFilteredAndSortedData();
	const { best, worst } = getBestAndWorstPerformance();
	const averageValue = calculateAverage();
	const uniqueCities = getUniqueCities();

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<BarChart className='ml-2 h-6 w-6 text-gray-600' /> تقارير أداء الفروع
					</h1>
					<p className='mt-1 text-sm text-gray-600'>تحليل ومقارنة أداء فروع المؤسسة</p>
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
						تصدير التقرير
					</button>
				</div>
			</div>

			{/* فلاتر التقرير */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					<div>
						<label htmlFor='date-start' className='block text-xs font-medium text-gray-700 mb-1'>
							من تاريخ
						</label>
						<input
							type='date'
							id='date-start'
							value={dateRange.start}
							onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						/>
					</div>

					<div>
						<label htmlFor='date-end' className='block text-xs font-medium text-gray-700 mb-1'>
							إلى تاريخ
						</label>
						<input
							type='date'
							id='date-end'
							value={dateRange.end}
							onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						/>
					</div>

					<div>
						<label htmlFor='city-filter' className='block text-xs font-medium text-gray-700 mb-1'>
							المدينة
						</label>
						<select
							id='city-filter'
							value={cityFilter}
							onChange={(e) => setCityFilter(e.target.value)}
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						>
							<option value='all'>جميع المدن</option>
							{uniqueCities.map((city) => (
								<option key={city} value={city}>
									{city}
								</option>
							))}
						</select>
					</div>

					<div>
						<label htmlFor='metric' className='block text-xs font-medium text-gray-700 mb-1'>
							مقياس الأداء
						</label>
						<select
							id='metric'
							value={selectedMetric}
							onChange={(e) => setSelectedMetric(e.target.value)}
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						>
							{metrics.map((metric) => (
								<option key={metric.id} value={metric.id}>
									{metric.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* ملخص الأداء */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
					<h3 className='text-xs font-medium text-gray-500 mb-1'>متوسط {selectedMetricObj.label}</h3>
					<div className='flex justify-between items-end'>
						<p className='text-2xl font-bold text-gray-900'>{selectedMetricObj.format(averageValue)}</p>
						<BarChart className='h-5 w-5 text-blue-500' />
					</div>
					<div className='mt-2 text-xs text-gray-500'>لجميع الفروع</div>
				</div>

				<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
					<h3 className='text-xs font-medium text-gray-500 mb-1'>أفضل أداء</h3>
					<div className='flex justify-between items-end'>
						<div>
							<p className='text-2xl font-bold text-gray-900'>
								{best ? selectedMetricObj.format(selectedMetricObj.value(best)) : '-'}
							</p>
							<p className='text-xs text-gray-700 mt-1'>{best?.name || ''}</p>
						</div>
						<TrendingUp className='h-5 w-5 text-green-500' />
					</div>
					<div className='mt-2 text-xs text-green-600'>
						{best?.growth ? `+${best.growth.toFixed(1)}%` : ''} مقارنة بالفترة السابقة
					</div>
				</div>

				<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
					<h3 className='text-xs font-medium text-gray-500 mb-1'>إجمالي المبيعات</h3>
					<div className='flex justify-between items-end'>
						<p className='text-2xl font-bold text-gray-900'>
							{branchesData.reduce((sum, branch) => sum + branch.totalSales, 0).toLocaleString()} ر.س
						</p>
						<DollarSign className='h-5 w-5 text-green-500' />
					</div>
					<div className='mt-2 text-xs text-gray-500'>لجميع الفروع</div>
				</div>

				<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
					<h3 className='text-xs font-medium text-gray-500 mb-1'>إجمالي الطلبات</h3>
					<div className='flex justify-between items-end'>
						<p className='text-2xl font-bold text-gray-900'>
							{branchesData.reduce((sum, branch) => sum + branch.ordersCount, 0).toLocaleString()}
						</p>
						<ShoppingCart className='h-5 w-5 text-blue-500' />
					</div>
					<div className='mt-2 text-xs text-gray-500'>لجميع الفروع</div>
				</div>
			</div>

			{/* الرسم البياني الرئيسي */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				<div className='lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
					<div className='px-4 py-3 border-b border-gray-200 flex justify-between items-center'>
						<h2 className='text-sm font-medium text-gray-700'>
							مقارنة {selectedMetricObj.label} بين الفروع
						</h2>
						<div className='flex items-center space-x-2 space-x-reverse'>
							<button
								onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
								className='text-xs text-blue-600 hover:text-blue-800 flex items-center'
							>
								{sortOrder === 'asc' ? 'ترتيب تنازلي' : 'ترتيب تصاعدي'}
							</button>
						</div>
					</div>

					<div className='p-4'>
						<div className='h-80 flex items-center justify-center'>
							{/* هنا سيكون الرسم البياني الحقيقي باستخدام مكتبة مثل Chart.js أو Recharts */}
							<div className='w-full'>
								<div className='space-y-4 w-full'>
									{filteredAndSortedData.map((branch) => {
										const value = selectedMetricObj.value(branch);
										const percentage = getPercentageOfMax(value);

										return (
											<div key={branch.id} className='space-y-1'>
												<div className='flex justify-between items-center'>
													<div className='flex items-center'>
														<Building className='h-4 w-4 text-gray-500 ml-1' />
														<span className='text-sm font-medium text-gray-700'>
															{branch.name}
														</span>
													</div>
													<span className='text-sm font-medium text-gray-900'>
														{selectedMetricObj.format(value)}
													</span>
												</div>
												<div className='w-full bg-gray-200 rounded-full h-2'>
													<div
														className={`${selectedMetricObj.color} h-2 rounded-full`}
														style={{ width: `${percentage}%` }}
													></div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* توزيع المقاييس */}
				<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
					<div className='px-4 py-3 border-b border-gray-200'>
						<h2 className='text-sm font-medium text-gray-700'>توزيع المقاييس الرئيسية</h2>
					</div>

					<div className='p-4 space-y-6'>
						<div className='h-40 flex items-center justify-center'>
							{/* هنا سيكون رسم دائري باستخدام مكتبة مثل Chart.js أو Recharts */}
							<PieChart className='h-24 w-24 text-gray-300' />
						</div>

						<div className='grid grid-cols-2 gap-3'>
							<div className='p-3 bg-gray-50 rounded-lg'>
								<h3 className='text-xs font-medium text-gray-700 mb-1'>الطلبات لكل موظف</h3>
								<p className='text-lg font-bold text-gray-900'>
									{(
										branchesData.reduce((sum, branch) => sum + branch.ordersCount, 0) /
										branchesData.reduce((sum, branch) => sum + branch.employeesCount, 0)
									).toFixed(1)}
								</p>
								<p className='text-xs text-gray-500 mt-1'>المتوسط في جميع الفروع</p>
							</div>

							<div className='p-3 bg-gray-50 rounded-lg'>
								<h3 className='text-xs font-medium text-gray-700 mb-1'>معدل العائد على الموظف</h3>
								<p className='text-lg font-bold text-gray-900'>
									{(
										branchesData.reduce((sum, branch) => sum + branch.totalSales, 0) /
										branchesData.reduce((sum, branch) => sum + branch.employeesCount, 0)
									).toLocaleString()}{' '}
									ر.س
								</p>
								<p className='text-xs text-gray-500 mt-1'>المتوسط في جميع الفروع</p>
							</div>

							<div className='p-3 bg-gray-50 rounded-lg'>
								<h3 className='text-xs font-medium text-gray-700 mb-1'>متوسط التقييم</h3>
								<div className='flex items-center'>
									<p className='text-lg font-bold text-gray-900'>
										{(
											branchesData.reduce((sum, branch) => sum + branch.rating, 0) /
											branchesData.length
										).toFixed(1)}
									</p>
									<Star className='h-4 w-4 mr-1 text-amber-500 fill-current' />
								</div>
								<p className='text-xs text-gray-500 mt-1'>المتوسط في جميع الفروع</p>
							</div>

							<div className='p-3 bg-gray-50 rounded-lg'>
								<h3 className='text-xs font-medium text-gray-700 mb-1'>معدل التحويل</h3>
								<p className='text-lg font-bold text-gray-900'>
									{(
										branchesData.reduce((sum, branch) => sum + branch.conversionRate, 0) /
										branchesData.length
									).toFixed(1)}
									%
								</p>
								<p className='text-xs text-gray-500 mt-1'>المتوسط في جميع الفروع</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* جدول البيانات التفصيلية */}
			<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
				<div className='px-4 py-3 border-b border-gray-200 flex justify-between items-center'>
					<h2 className='text-sm font-medium text-gray-700'>تفاصيل أداء الفروع</h2>
					<button className='text-xs text-green-600 hover:text-green-800 flex items-center'>
						<Download className='h-3 w-3 ml-1' />
						تصدير إلى إكسل
					</button>
				</div>

				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-50'>
							<tr>
								<th
									scope='col'
									className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
								>
									الفرع
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
								>
									المبيعات (ر.س)
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
								>
									الطلبات
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
								>
									متوسط الطلب
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
								>
									العملاء
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
								>
									الموظفين
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
								>
									معدل التحويل
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
								>
									النمو
								</th>
								<th
									scope='col'
									className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
								>
									التقييم
								</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{filteredAndSortedData.map((branch) => (
								<tr key={branch.id} className='hover:bg-gray-50'>
									<td className='px-6 py-4 whitespace-nowrap'>
										<Link
											href={`/dashboard/branches/${branch.id}`}
											className='flex items-center text-sm font-medium text-blue-600 hover:text-blue-800'
										>
											<Building className='h-4 w-4 ml-1' />
											{branch.name}
										</Link>
										<div className='text-xs text-gray-500 mt-0.5'>
											{branch.code} • {branch.city}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
										{branch.totalSales.toLocaleString()}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
										{branch.ordersCount.toLocaleString()}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
										{branch.avgOrderValue.toFixed(1)} ر.س
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
										{branch.customersCount.toLocaleString()}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
										{branch.employeesCount}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
										{branch.conversionRate.toFixed(1)}%
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<span
											className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
												branch.growth >= 0
													? 'bg-green-100 text-green-800'
													: 'bg-red-100 text-red-800'
											}`}
										>
											{branch.growth >= 0 ? '+' : ''}
											{branch.growth.toFixed(1)}%
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='flex items-center'>
											<span className='text-sm text-gray-900 mr-1'>
												{branch.rating.toFixed(1)}
											</span>
											<Star className='h-4 w-4 text-amber-400 fill-current' />
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<div className='bg-gray-50 px-4 py-3 border-t border-gray-200'>
					<div className='flex justify-between items-center'>
						<p className='text-sm text-gray-700'>إجمالي {filteredAndSortedData.length} فرع</p>
						<p className='text-sm text-gray-700'>
							الفترة: {new Date(dateRange.start).toLocaleDateString('ar-SA')} -{' '}
							{new Date(dateRange.end).toLocaleDateString('ar-SA')}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
