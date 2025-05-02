'use client';

import {
	AlertTriangle,
	ArrowLeft,
	BarChart2,
	Building,
	Calendar,
	CheckCircle,
	CheckSquare,
	Clock,
	Download,
	Edit,
	FileText,
	Package,
	Printer,
	RefreshCcw,
	Tag,
	User,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DiscrepancyItem {
	id: string;
	itemCode: string;
	itemName: string;
	category: string;
	systemQuantity: number;
	actualQuantity: number;
	difference: number;
	unit: string;
	notes: string | null;
}

interface StockCount {
	id: string;
	countId: string;
	status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
	startDate: string;
	endDate: string | null;
	assignedTo: string;
	location: string;
	category: string;
	totalItems: number;
	countedItems: number;
	discrepancies: number;
	notes: string | null;
	createdBy: string;
	createdAt: string;
	discrepancyItems?: DiscrepancyItem[];
}

export default function StockCountDetailsPage({ params }: { params: { id: string } }) {
	const [stockCount, setStockCount] = useState<StockCount | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// محاكاة استدعاء API لجلب بيانات الجرد
		const fetchStockCount = async () => {
			try {
				// تأخير مصطنع لمحاكاة الاتصال بالخادم
				await new Promise((resolve) => setTimeout(resolve, 800));

				// بيانات تجريبية لعملية الجرد
				const mockStockCount: StockCount = {
					id: 'sc-001',
					countId: 'SC-2023-09-001',
					status: 'completed',
					startDate: '2023-09-01',
					endDate: '2023-09-05',
					assignedTo: 'محمد العمري',
					location: 'المستودع الرئيسي',
					category: 'الأقمشة',
					totalItems: 120,
					countedItems: 120,
					discrepancies: 3,
					notes: 'وجدت اختلافات في أنواع القطن المصري',
					createdBy: 'أحمد المالكي',
					createdAt: '2023-08-28',
					discrepancyItems: [
						{
							id: 'disc-001',
							itemCode: 'FAB-COTTON-001',
							itemName: 'قطن مصري فاخر',
							category: 'أقمشة',
							systemQuantity: 250,
							actualQuantity: 245,
							difference: -5,
							unit: 'متر',
							notes: 'وجدت قطع تالفة لم تسجل في النظام',
						},
						{
							id: 'disc-002',
							itemCode: 'FAB-SILK-001',
							itemName: 'حرير طبيعي',
							category: 'أقمشة',
							systemQuantity: 80,
							actualQuantity: 82,
							difference: 2,
							unit: 'متر',
							notes: null,
						},
						{
							id: 'disc-003',
							itemCode: 'FAB-WOOL-001',
							itemName: 'صوف كشميري',
							category: 'أقمشة',
							systemQuantity: 35,
							actualQuantity: 30,
							difference: -5,
							unit: 'متر',
							notes: 'يجب إعادة طلب كمية جديدة',
						},
					],
				};

				setStockCount(mockStockCount);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching stock count details:', error);
				setLoading(false);
			}
		};

		fetchStockCount();
	}, [params.id]);

	// تنسيق حالة الجرد
	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'scheduled':
				return <span className='px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full'>مجدول</span>;
			case 'in_progress':
				return (
					<span className='px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full'>قيد التنفيذ</span>
				);
			case 'completed':
				return <span className='px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full'>مكتمل</span>;
			case 'cancelled':
				return <span className='px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full'>ملغي</span>;
			default:
				return null;
		}
	};

	// التقدم في عملية الجرد كنسبة مئوية
	const getProgressPercentage = (count: StockCount) => {
		if (count.status === 'scheduled') return 0;
		if (count.status === 'cancelled') return 0;
		if (count.status === 'completed') return 100;

		return Math.round((count.countedItems / count.totalItems) * 100);
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
			</div>
		);
	}

	if (!stockCount) {
		return (
			<div className='text-center py-10'>
				<XCircle className='mx-auto h-12 w-12 text-red-500' />
				<h3 className='mt-2 text-base font-medium text-gray-900'>لم يتم العثور على بيانات الجرد</h3>
				<p className='mt-1 text-sm text-gray-500'>عملية الجرد المطلوبة غير موجودة أو تم حذفها.</p>
				<div className='mt-6'>
					<Link
						href='/dashboard/inventory/stock-count'
						className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700'
					>
						<ArrowLeft className='ml-2 h-4 w-4' />
						العودة إلى قائمة الجرد
					</Link>
				</div>
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
							href='/dashboard/inventory/stock-count'
							className='flex items-center text-gray-500 hover:text-gray-700 ml-4'
						>
							<ArrowLeft className='h-5 w-5' />
							<span className='mr-1 text-sm'>العودة</span>
						</Link>
						<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
							جرد المخزون: {stockCount.countId}
						</h1>
					</div>
					<div className='mt-2 flex items-center'>
						{getStatusBadge(stockCount.status)}
						<span className='mr-2 text-sm text-gray-500'>
							تم إنشاؤه بتاريخ {new Date(stockCount.createdAt).toLocaleDateString('ar-SA')}
						</span>
					</div>
				</div>

				<div className='flex gap-2'>
					<button
						onClick={() => {}}
						className='px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Printer className='ml-1 h-4 w-4' />
						طباعة
					</button>

					<button
						onClick={() => {}}
						className='px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Download className='ml-1 h-4 w-4' />
						تصدير
					</button>

					{stockCount.status === 'scheduled' && (
						<Link
							href={`/dashboard/inventory/stock-count/${stockCount.id}/edit`}
							className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700'
						>
							<Edit className='ml-1 h-4 w-4' />
							تعديل
						</Link>
					)}

					{stockCount.status === 'in_progress' && (
						<Link
							href={`/dashboard/inventory/stock-count/${stockCount.id}/count`}
							className='px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-yellow-700'
						>
							<CheckSquare className='ml-1 h-4 w-4' />
							متابعة الجرد
						</Link>
					)}
				</div>
			</div>

			{/* تفاصيل الجرد */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* معلومات الجرد */}
				<div className='lg:col-span-1'>
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						<div className='px-4 py-5 sm:px-6 border-b border-gray-200'>
							<h3 className='text-lg font-medium leading-6 text-gray-900'>معلومات الجرد</h3>
							<p className='mt-1 max-w-2xl text-sm text-gray-500'>تفاصيل عملية جرد المخزون</p>
						</div>
						<div className='border-t border-gray-200 px-4 py-5 sm:p-0'>
							<dl className='sm:divide-y sm:divide-gray-200'>
								<div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500 flex items-center'>
										<Calendar className='ml-1 h-4 w-4 text-gray-400' />
										تاريخ البدء
									</dt>
									<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
										{new Date(stockCount.startDate).toLocaleDateString('ar-SA')}
									</dd>
								</div>

								<div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500 flex items-center'>
										<Clock className='ml-1 h-4 w-4 text-gray-400' />
										تاريخ الانتهاء
									</dt>
									<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
										{stockCount.endDate
											? new Date(stockCount.endDate).toLocaleDateString('ar-SA')
											: 'لم ينته بعد'}
									</dd>
								</div>

								<div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500 flex items-center'>
										<User className='ml-1 h-4 w-4 text-gray-400' />
										المسؤول
									</dt>
									<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
										{stockCount.assignedTo}
									</dd>
								</div>

								<div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500 flex items-center'>
										<Building className='ml-1 h-4 w-4 text-gray-400' />
										الموقع
									</dt>
									<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
										{stockCount.location}
									</dd>
								</div>

								<div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500 flex items-center'>
										<Tag className='ml-1 h-4 w-4 text-gray-400' />
										الفئة
									</dt>
									<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
										{stockCount.category}
									</dd>
								</div>

								<div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500 flex items-center'>
										<Package className='ml-1 h-4 w-4 text-gray-400' />
										الأصناف
									</dt>
									<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
										{stockCount.countedItems} / {stockCount.totalItems} صنف
									</dd>
								</div>

								<div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500 flex items-center'>
										<AlertTriangle className='ml-1 h-4 w-4 text-gray-400' />
										الاختلافات
									</dt>
									<dd className='mt-1 text-sm font-medium sm:mt-0 sm:col-span-2'>
										<span
											className={stockCount.discrepancies > 0 ? 'text-red-600' : 'text-green-600'}
										>
											{stockCount.discrepancies} اختلاف
										</span>
									</dd>
								</div>

								<div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
									<dt className='text-sm font-medium text-gray-500 flex items-center'>
										<FileText className='ml-1 h-4 w-4 text-gray-400' />
										ملاحظات
									</dt>
									<dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
										{stockCount.notes || 'لا توجد ملاحظات'}
									</dd>
								</div>
							</dl>
						</div>
					</div>

					{/* حالة التقدم */}
					<div className='mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
						<h3 className='text-lg font-medium text-gray-900 mb-4'>حالة التقدم</h3>

						<div className='space-y-4'>
							<div>
								<div className='flex items-center justify-between text-sm font-medium'>
									<span className='text-gray-700'>تقدم الجرد</span>
									<span className='text-gray-900'>{getProgressPercentage(stockCount)}%</span>
								</div>
								<div className='mt-2 w-full bg-gray-200 rounded-full h-2.5'>
									<div
										className={`h-2.5 rounded-full ${
											stockCount.status === 'completed'
												? 'bg-green-500'
												: stockCount.status === 'in_progress'
												? 'bg-yellow-500'
												: stockCount.status === 'cancelled'
												? 'bg-red-500'
												: 'bg-blue-500'
										}`}
										style={{ width: `${getProgressPercentage(stockCount)}%` }}
									></div>
								</div>
							</div>

							<div>
								<div className='relative pt-1'>
									<div className='flex items-center justify-between'>
										<div>
											<span className='text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200'>
												الدقة
											</span>
										</div>
										<div className='text-right'>
											<span className='text-xs font-semibold inline-block text-green-600'>
												{stockCount.countedItems === 0
													? '0'
													: (
															((stockCount.countedItems - stockCount.discrepancies) /
																stockCount.countedItems) *
															100
													  ).toFixed(1)}
												%
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* اختلافات الجرد */}
				<div className='lg:col-span-2'>
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						<div className='px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center'>
							<div>
								<h3 className='text-lg font-medium leading-6 text-gray-900'>الاختلافات في الجرد</h3>
								<p className='mt-1 max-w-2xl text-sm text-gray-500'>
									الأصناف التي وجدت فيها اختلافات بين المسجل والفعلي
								</p>
							</div>

							{stockCount.discrepancies > 0 && (
								<Link
									href='/dashboard/inventory/discrepancies'
									className='px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-md flex items-center hover:bg-blue-200'
								>
									<BarChart2 className='mr-1 h-4 w-4' />
									عرض التقرير الكامل
								</Link>
							)}
						</div>

						{stockCount.discrepancies === 0 ? (
							<div className='p-8 text-center'>
								<CheckCircle className='mx-auto h-12 w-12 text-green-500' />
								<h3 className='mt-2 text-base font-medium text-gray-900'>لا توجد اختلافات</h3>
								<p className='mt-1 text-sm text-gray-500'>
									تم مطابقة جميع الأصناف المجرودة مع الكميات المسجلة في النظام.
								</p>
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
												الصنف
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												الكمية في النظام
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												الكمية الفعلية
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												الفرق
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												ملاحظات
											</th>
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										{stockCount.discrepancyItems?.map((item) => (
											<tr key={item.id} className='hover:bg-gray-50'>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm font-medium text-gray-900'>
														{item.itemName}
													</div>
													<div className='text-xs text-gray-500'>{item.itemCode}</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
													{item.systemQuantity} {item.unit}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
													{item.actualQuantity} {item.unit}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
													<span
														className={`${
															item.difference > 0
																? 'text-green-600'
																: item.difference < 0
																? 'text-red-600'
																: 'text-gray-500'
														}`}
													>
														{item.difference > 0 ? '+' : ''}
														{item.difference} {item.unit}
													</span>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
													{item.notes || '-'}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>

					{/* التوصيات والإجراءات */}
					{stockCount.status === 'completed' && stockCount.discrepancies > 0 && (
						<div className='mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>التوصيات والإجراءات</h3>

							<div className='space-y-4'>
								<div className='p-4 border border-yellow-200 rounded-lg bg-yellow-50'>
									<div className='flex'>
										<div className='flex-shrink-0'>
											<AlertTriangle className='h-5 w-5 text-yellow-400' />
										</div>
										<div className='mr-3'>
											<h3 className='text-sm font-medium text-yellow-800'>ملاحظة هامة</h3>
											<div className='mt-2 text-sm text-yellow-700'>
												<p>
													يوجد اختلافات في الجرد تتطلب مراجعة وتحديث المخزون. يرجى تحديث كميات
													المخزون في النظام لتتطابق مع الجرد الفعلي.
												</p>
											</div>
										</div>
									</div>
								</div>

								<div className='border-t border-gray-200 pt-4'>
									<h4 className='text-sm font-medium text-gray-900 mb-3'>الإجراءات المقترحة:</h4>
									<ul className='list-disc list-inside text-sm text-gray-700 space-y-2'>
										<li>تحديث كميات المخزون في النظام</li>
										<li>فحص الأسباب المحتملة للاختلافات</li>
										<li>التحقق من إجراءات استلام وتسليم المواد</li>
										<li>إجراء جرد دوري أكثر تكراراً للأصناف ذات الاختلافات</li>
									</ul>
								</div>

								<div className='border-t border-gray-200 pt-4 flex justify-end'>
									<Link
										href='/dashboard/inventory/adjust'
										className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700'
									>
										<RefreshCcw className='ml-1 h-4 w-4' />
										تسوية الاختلافات
									</Link>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
