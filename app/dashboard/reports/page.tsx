'use client';

import { Calendar, ChevronDown, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts';

export default function ReportsPage() {
	const [dateRange, setDateRange] = useState('month');
	const [isLoading, setIsLoading] = useState(true);
	const [salesData, setSalesData] = useState<{ name: string; sales: number }[]>([]);
	const [ordersStatusData, setOrdersStatusData] = useState<{ name: string; value: number }[]>([]);
	const [tailorsPerformanceData, setTailorsPerformanceData] = useState<
		{ name: string; completed: number; inProgress: number; pending: number }[]
	>([]);
	const [fabricSalesData, setFabricSalesData] = useState<{ name: string; value: number }[]>([]);
	const [showDateRangeMenu, setShowDateRangeMenu] = useState(false);

	useEffect(() => {
		const fetchReportData = async () => {
			// Mock API call - replace with actual API call
			setTimeout(() => {
				// Mock sales data
				const mockSalesData = [
					{ name: '1 أبريل', sales: 2500 },
					{ name: '2 أبريل', sales: 3000 },
					{ name: '3 أبريل', sales: 2800 },
					{ name: '4 أبريل', sales: 3200 },
					{ name: '5 أبريل', sales: 2900 },
					{ name: '6 أبريل', sales: 1500 },
					{ name: '7 أبريل', sales: 1800 },
					{ name: '8 أبريل', sales: 2700 },
					{ name: '9 أبريل', sales: 3100 },
					{ name: '10 أبريل', sales: 3500 },
					{ name: '11 أبريل', sales: 3200 },
					{ name: '12 أبريل', sales: 2800 },
					{ name: '13 أبريل', sales: 1900 },
					{ name: '14 أبريل', sales: 2100 },
					{ name: '15 أبريل', sales: 2600 },
				];
				setSalesData(mockSalesData);

				// Mock orders status data
				const mockOrdersStatusData = [
					{ name: 'قيد الانتظار', value: 15 },
					{ name: 'قيد التنفيذ', value: 25 },
					{ name: 'جاهز', value: 10 },
					{ name: 'تم التسليم', value: 40 },
					{ name: 'بحاجة للإصلاح', value: 5 },
				];
				setOrdersStatusData(mockOrdersStatusData);

				// Mock tailors performance data
				const mockTailorsPerformanceData = [
					{ name: 'عمر الخياط', completed: 28, inProgress: 5, pending: 2 },
					{ name: 'سعد الحربي', completed: 22, inProgress: 7, pending: 3 },
					{ name: 'عبدالله التميمي', completed: 18, inProgress: 8, pending: 4 },
					{ name: 'محمد السالم', completed: 15, inProgress: 6, pending: 2 },
				];
				setTailorsPerformanceData(mockTailorsPerformanceData);

				// Mock fabric sales data
				const mockFabricSalesData = [
					{ name: 'قطن مصري', value: 30 },
					{ name: 'كتان', value: 25 },
					{ name: 'حرير', value: 15 },
					{ name: 'صوف', value: 10 },
					{ name: 'بوليستر', value: 20 },
				];
				setFabricSalesData(mockFabricSalesData);

				setIsLoading(false);
			}, 1500);
		};

		fetchReportData();
	}, [dateRange]);

	const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

	if (isLoading) {
		return (
			<div className='flex items-center justify-center h-96'>
				<div className='w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full animate-spin'></div>
			</div>
		);
	}

	const getTotalSales = () => {
		return salesData.reduce((total, item) => total + item.sales, 0);
	};

	const getTotalOrders = () => {
		return ordersStatusData.reduce((total, item) => total + item.value, 0);
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>التقارير والإحصائيات</h1>
				<div className='flex space-x-2 space-x-reverse'>
					<div className='relative'>
						<button
							type='button'
							className='inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
							onClick={() => setShowDateRangeMenu(!showDateRangeMenu)}
						>
							<Calendar className='ml-2 -mr-1 h-5 w-5 text-gray-400' />
							{dateRange === 'week'
								? 'الأسبوع الحالي'
								: dateRange === 'month'
								? 'الشهر الحالي'
								: dateRange === 'quarter'
								? 'الربع الحالي'
								: 'السنة الحالية'}
							<ChevronDown className='mr-2 -ml-1 h-5 w-5 text-gray-400' aria-hidden='true' />
						</button>

						{showDateRangeMenu && (
							<div className='origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10'>
								<div
									className='py-1'
									role='menu'
									aria-orientation='vertical'
									aria-labelledby='options-menu'
								>
									<button
										onClick={() => {
											setDateRange('week');
											setShowDateRangeMenu(false);
										}}
										className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
										role='menuitem'
									>
										الأسبوع الحالي
									</button>
									<button
										onClick={() => {
											setDateRange('month');
											setShowDateRangeMenu(false);
										}}
										className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
										role='menuitem'
									>
										الشهر الحالي
									</button>
									<button
										onClick={() => {
											setDateRange('quarter');
											setShowDateRangeMenu(false);
										}}
										className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
										role='menuitem'
									>
										الربع الحالي
									</button>
									<button
										onClick={() => {
											setDateRange('year');
											setShowDateRangeMenu(false);
										}}
										className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
										role='menuitem'
									>
										السنة الحالية
									</button>
								</div>
							</div>
						)}
					</div>

					<button
						type='button'
						className='inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
					>
						<Download className='ml-2 -mr-1 h-5 w-5 text-gray-400' />
						تصدير التقرير
					</button>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='bg-white rounded-lg shadow-sm p-6'>
					<h2 className='text-lg font-medium text-gray-900 mb-4'>المبيعات</h2>
					<div className='text-3xl font-bold text-gray-800 mb-4'>{getTotalSales().toLocaleString()} ر.س</div>
					<div className='h-80'>
						<ResponsiveContainer width='100%' height='100%'>
							<LineChart
								data={salesData}
								margin={{
									top: 5,
									right: 30,
									left: 20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='name' />
								<YAxis />
								<Tooltip />
								<Legend />
								<Line type='monotone' dataKey='sales' stroke='#16A34A' activeDot={{ r: 8 }} />
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-sm p-6'>
					<h2 className='text-lg font-medium text-gray-900 mb-4'>حالة الطلبات</h2>
					<div className='text-3xl font-bold text-gray-800 mb-4'>{getTotalOrders()} طلب</div>
					<div className='h-80'>
						<ResponsiveContainer width='100%' height='100%'>
							<PieChart>
								<Pie
									data={ordersStatusData}
									cx='50%'
									cy='50%'
									labelLine={true}
									outerRadius={80}
									fill='#8884d8'
									dataKey='value'
									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
								>
									{ordersStatusData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
									))}
								</Pie>
								<Tooltip />
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='bg-white rounded-lg shadow-sm p-6'>
					<h2 className='text-lg font-medium text-gray-900 mb-4'>أداء الخياطين</h2>
					<div className='h-80'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart
								data={tailorsPerformanceData}
								margin={{
									top: 20,
									right: 30,
									left: 20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis dataKey='name' />
								<YAxis />
								<Tooltip />
								<Legend />
								<Bar dataKey='completed' stackId='a' fill='#4ade80' name='مكتمل' />
								<Bar dataKey='inProgress' stackId='a' fill='#facc15' name='قيد التنفيذ' />
								<Bar dataKey='pending' stackId='a' fill='#fb923c' name='قيد الانتظار' />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-sm p-6'>
					<h2 className='text-lg font-medium text-gray-900 mb-4'>مبيعات الأقمشة</h2>
					<div className='h-80'>
						<ResponsiveContainer width='100%' height='100%'>
							<BarChart
								layout='vertical'
								data={fabricSalesData}
								margin={{
									top: 5,
									right: 30,
									left: 20,
									bottom: 5,
								}}
							>
								<CartesianGrid strokeDasharray='3 3' />
								<XAxis type='number' />
								<YAxis dataKey='name' type='category' />
								<Tooltip />
								<Legend />
								<Bar dataKey='value' fill='#3b82f6' name='المبيعات' />
							</BarChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>

			<div className='bg-white rounded-lg shadow-sm p-6'>
				<h2 className='text-lg font-medium text-gray-900 mb-4'>تحليل المبيعات الشهرية</h2>
				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									الشهر
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									عدد الطلبات
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									المبيعات
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									متوسط قيمة الطلب
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									نسبة النمو
								</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							<tr>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>يناير</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>45</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>16,200 ر.س</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>360 ر.س</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-green-600'>+5%</td>
							</tr>
							<tr>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
									فبراير
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>42</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>15,120 ر.س</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>360 ر.س</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-red-600'>-7%</td>
							</tr>
							<tr>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>مارس</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>50</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>18,500 ر.س</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>370 ر.س</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-green-600'>+19%</td>
							</tr>
							<tr className='bg-green-50'>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
									أبريل (الحالي)
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>55</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>20,900 ر.س</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>380 ر.س</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-green-600'>+10%</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
