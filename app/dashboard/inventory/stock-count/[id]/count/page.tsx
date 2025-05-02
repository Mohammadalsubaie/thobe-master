'use client';

import {
	AlertOctagon,
	AlertTriangle,
	ArrowLeft,
	Check,
	CheckSquare,
	Clock,
	HelpCircle,
	Info,
	Package,
	Save,
	Search,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface StockItem {
	id: string;
	code: string;
	name: string;
	category: string;
	expectedQuantity: number;
	actualQuantity: number | null;
	unit: string;
	counted: boolean;
	hasDiscrepancy: boolean;
	notes: string;
}

interface StockCount {
	id: string;
	countId: string;
	status: 'in_progress';
	startDate: string;
	assignedTo: string;
	location: string;
	category: string;
	totalItems: number;
	countedItems: number;
	items: StockItem[];
}

export default function StockCountProcessPage({ params }: { params: { id: string } }) {
	const [stockCount, setStockCount] = useState<StockCount | null>(null);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentItemIndex, setCurrentItemIndex] = useState<number | null>(null);
	const [currentItem, setCurrentItem] = useState<StockItem | null>(null);
	const [quantity, setQuantity] = useState<string>('');
	const [notes, setNotes] = useState<string>('');
	const [savingItem, setSavingItem] = useState(false);
	const [finishingCount, setFinishingCount] = useState(false);
	const [showDiscrepancyWarning, setShowDiscrepancyWarning] = useState(false);

	useEffect(() => {
		// محاكاة استدعاء API لجلب بيانات الجرد
		const fetchStockCount = async () => {
			try {
				// تأخير مصطنع لمحاكاة الاتصال بالخادم
				await new Promise((resolve) => setTimeout(resolve, 800));

				// بيانات تجريبية لعملية الجرد
				const mockStockCount: StockCount = {
					id: 'sc-002',
					countId: 'SC-2023-09-002',
					status: 'in_progress',
					startDate: '2023-09-12',
					assignedTo: 'نورة السعدي',
					location: 'المستودع الرئيسي',
					category: 'الخيوط',
					totalItems: 80,
					countedItems: 45,
					items: [
						{
							id: 'item-001',
							code: 'THR-COT-001',
							name: 'خيط قطني ممتاز',
							category: 'خيوط',
							expectedQuantity: 100,
							actualQuantity: 95,
							unit: 'بكرة',
							counted: true,
							hasDiscrepancy: true,
							notes: 'بعض البكرات مستخدمة جزئياً',
						},
						{
							id: 'item-002',
							code: 'THR-SILK-001',
							name: 'خيط حرير',
							category: 'خيوط',
							expectedQuantity: 30,
							actualQuantity: 30,
							unit: 'بكرة',
							counted: true,
							hasDiscrepancy: false,
							notes: '',
						},
						{
							id: 'item-003',
							code: 'THR-POLY-001',
							name: 'خيط بوليستر',
							category: 'خيوط',
							expectedQuantity: 50,
							actualQuantity: 45,
							unit: 'بكرة',
							counted: true,
							hasDiscrepancy: true,
							notes: '',
						},
						{
							id: 'item-004',
							code: 'THR-NYLON-001',
							name: 'خيط نايلون',
							category: 'خيوط',
							expectedQuantity: 40,
							actualQuantity: null,
							unit: 'بكرة',
							counted: false,
							hasDiscrepancy: false,
							notes: '',
						},
						{
							id: 'item-005',
							code: 'THR-EMB-001',
							name: 'خيط تطريز',
							category: 'خيوط',
							expectedQuantity: 35,
							actualQuantity: null,
							unit: 'بكرة',
							counted: false,
							hasDiscrepancy: false,
							notes: '',
						},
						{
							id: 'item-006',
							code: 'THR-METAL-001',
							name: 'خيط معدني',
							category: 'خيوط',
							expectedQuantity: 20,
							actualQuantity: null,
							unit: 'بكرة',
							counted: false,
							hasDiscrepancy: false,
							notes: '',
						},
					],
				};

				setStockCount(mockStockCount);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching stock count:', error);
				setLoading(false);
			}
		};

		fetchStockCount();
	}, [params.id]);

	// تحديد العنصر الحالي للعد
	const selectItem = (index: number) => {
		const item = stockCount?.items[index] || null;
		setCurrentItemIndex(index);
		setCurrentItem(item);
		setQuantity(item?.actualQuantity?.toString() || '');
		setNotes(item?.notes || '');
		setShowDiscrepancyWarning(false);
	};

	// فلترة العناصر بناء على البحث
	const filteredItems =
		stockCount?.items.filter((item) => item.name.includes(searchTerm) || item.code.includes(searchTerm)) || [];

	// حفظ كمية وملاحظات العنصر الحالي
	const saveCurrentItem = async () => {
		if (!currentItem || !stockCount) return;

		setSavingItem(true);

		try {
			// محاكاة تأخير لحفظ البيانات
			await new Promise((resolve) => setTimeout(resolve, 800));

			const actualQuantity = quantity ? parseInt(quantity) : null;
			const hasDiscrepancy = actualQuantity !== null && actualQuantity !== currentItem.expectedQuantity;

			// إذا كان هناك تباين كبير، عرض تحذير
			if (hasDiscrepancy && actualQuantity !== null) {
				const difference = Math.abs(actualQuantity - currentItem.expectedQuantity);
				const percentageDifference = (difference / currentItem.expectedQuantity) * 100;

				if (percentageDifference > 20) {
					setShowDiscrepancyWarning(true);
					setSavingItem(false);
					return;
				}
			}

			// تحديث العنصر
			const updatedItem = {
				...currentItem,
				actualQuantity,
				counted: actualQuantity !== null,
				hasDiscrepancy,
				notes,
			};

			// تحديث قائمة العناصر
			const updatedItems = [...stockCount.items];
			if (currentItemIndex !== null) {
				updatedItems[currentItemIndex] = updatedItem;
			}

			// حساب عدد العناصر المعدودة
			const countedItems = updatedItems.filter((item) => item.counted).length;

			// تحديث حالة الجرد
			setStockCount({
				...stockCount,
				countedItems,
				items: updatedItems,
			});

			// تحديث العنصر الحالي
			setCurrentItem(updatedItem);

			// انتقل تلقائيًا إلى العنصر التالي غير المعدود إذا كان هناك
			if (currentItemIndex !== null) {
				const nextUncountedIndex = updatedItems.findIndex(
					(item, idx) => idx > currentItemIndex && !item.counted
				);
				if (nextUncountedIndex !== -1) {
					selectItem(nextUncountedIndex);
				}
			}
		} catch (error) {
			console.error('Error saving item:', error);
		} finally {
			setSavingItem(false);
		}
	};

	// متابعة الحفظ بعد تأكيد التباين الكبير
	const confirmDiscrepancy = () => {
		setShowDiscrepancyWarning(false);

		if (!currentItem || !stockCount || currentItemIndex === null) return;

		const actualQuantity = quantity ? parseInt(quantity) : null;

		// تحديث العنصر
		const updatedItem = {
			...currentItem,
			actualQuantity,
			counted: actualQuantity !== null,
			hasDiscrepancy: actualQuantity !== null && actualQuantity !== currentItem.expectedQuantity,
			notes,
		};

		// تحديث قائمة العناصر
		const updatedItems = [...stockCount.items];
		updatedItems[currentItemIndex] = updatedItem;

		// حساب عدد العناصر المعدودة
		const countedItems = updatedItems.filter((item) => item.counted).length;

		// تحديث حالة الجرد
		setStockCount({
			...stockCount,
			countedItems,
			items: updatedItems,
		});

		// تحديث العنصر الحالي
		setCurrentItem(updatedItem);

		// انتقل تلقائيًا إلى العنصر التالي غير المعدود إذا كان هناك
		const nextUncountedIndex = updatedItems.findIndex((item, idx) => idx > currentItemIndex && !item.counted);
		if (nextUncountedIndex !== -1) {
			selectItem(nextUncountedIndex);
		}
	};

	// إنهاء عملية الجرد
	const finishStockCount = async () => {
		if (!stockCount) return;

		setFinishingCount(true);

		try {
			// التحقق من اكتمال جميع العناصر
			const uncountedItems = stockCount.items.filter((item) => !item.counted);

			if (uncountedItems.length > 0) {
				alert(
					`هناك ${uncountedItems.length} عنصر لم يتم جردها بعد. يرجى إكمال عملية الجرد أو تأكيد إلغاء هذه العناصر.`
				);
				setFinishingCount(false);
				return;
			}

			// محاكاة تأخير لإنهاء الجرد
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// توجيه المستخدم إلى صفحة تفاصيل الجرد
			window.location.href = `/dashboard/inventory/stock-count/${params.id}`;
		} catch (error) {
			console.error('Error finishing stock count:', error);
		} finally {
			setFinishingCount(false);
		}
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

	const progress = Math.round((stockCount.countedItems / stockCount.totalItems) * 100);

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<div className='flex items-center'>
						<Link
							href={`/dashboard/inventory/stock-count/${params.id}`}
							className='flex items-center text-gray-500 hover:text-gray-700 ml-4'
						>
							<ArrowLeft className='h-5 w-5' />
							<span className='mr-1 text-sm'>العودة</span>
						</Link>
						<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
							<CheckSquare className='inline-block ml-2 h-6 w-6 text-green-600' />
							متابعة جرد المخزون: {stockCount.countId}
						</h1>
					</div>
					<div className='mt-2 flex items-center text-sm text-gray-500'>
						<Clock className='mr-1 h-4 w-4' />
						<span>تاريخ البدء: {new Date(stockCount.startDate).toLocaleDateString('ar-SA')}</span>
						<span className='mx-2'>•</span>
						<span>المسؤول: {stockCount.assignedTo}</span>
						<span className='mx-2'>•</span>
						<span>الموقع: {stockCount.location}</span>
					</div>
				</div>

				<div>
					<button
						onClick={finishStockCount}
						disabled={finishingCount || stockCount.countedItems < stockCount.totalItems}
						className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
					>
						{finishingCount ? (
							<>
								<div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white ml-2'></div>
								جاري إنهاء الجرد...
							</>
						) : (
							<>
								<Check className='ml-2 h-4 w-4' />
								إنهاء الجرد
							</>
						)}
					</button>
				</div>
			</div>

			{/* شريط التقدم */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex items-center justify-between mb-2'>
					<div className='text-sm font-medium text-gray-700'>تقدم الجرد</div>
					<div className='text-sm font-medium text-gray-900'>{progress}%</div>
				</div>
				<div className='w-full bg-gray-200 rounded-full h-2.5'>
					<div className='bg-green-600 h-2.5 rounded-full' style={{ width: `${progress}%` }}></div>
				</div>
				<div className='mt-2 text-sm text-gray-600'>
					تم جرد {stockCount.countedItems} من أصل {stockCount.totalItems} صنف
				</div>
			</div>

			{/* محتوى الجرد */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* قائمة الأصناف */}
				<div className='lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='p-4 border-b border-gray-200'>
						<h3 className='text-lg font-medium text-gray-900'>قائمة الأصناف</h3>

						{/* البحث */}
						<div className='mt-3 relative'>
							<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
								<Search className='h-5 w-5 text-gray-400' />
							</div>
							<input
								type='text'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder='بحث عن صنف...'
								className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm'
							/>
						</div>
					</div>

					<div className='overflow-y-auto' style={{ maxHeight: 'calc(100vh - 24rem)' }}>
						<ul className='divide-y divide-gray-200'>
							{filteredItems.length === 0 ? (
								<li className='p-6 text-center'>
									<Package className='mx-auto h-10 w-10 text-gray-300' />
									<p className='mt-2 text-sm text-gray-500'>لم يتم العثور على أي أصناف مطابقة</p>
								</li>
							) : (
								filteredItems.map((item, index) => {
									const itemIndex = stockCount.items.findIndex((i) => i.id === item.id);
									return (
										<li
											key={item.id}
											className={`border-r-4 hover:bg-gray-50 cursor-pointer ${
												currentItem?.id === item.id
													? 'border-green-500 bg-green-50'
													: item.counted
													? item.hasDiscrepancy
														? 'border-yellow-400'
														: 'border-green-300'
													: 'border-transparent'
											}`}
											onClick={() => selectItem(itemIndex)}
										>
											<div className='p-4'>
												<div className='flex justify-between'>
													<div className='text-sm font-medium text-gray-900'>{item.name}</div>
													{item.counted && (
														<div>
															{item.hasDiscrepancy ? (
																<span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800'>
																	<AlertTriangle className='ml-1 h-3 w-3' />
																	اختلاف
																</span>
															) : (
																<span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800'>
																	<Check className='ml-1 h-3 w-3' />
																	تم الجرد
																</span>
															)}
														</div>
													)}
												</div>
												<div className='text-xs text-gray-500 mt-1'>{item.code}</div>
												<div className='flex justify-between items-center mt-2'>
													<div className='text-sm text-gray-700'>
														المتوقع: {item.expectedQuantity} {item.unit}
													</div>
													{item.counted && (
														<div
															className={`text-sm font-medium ${
																item.hasDiscrepancy
																	? 'text-yellow-600'
																	: 'text-green-600'
															}`}
														>
															الفعلي: {item.actualQuantity} {item.unit}
														</div>
													)}
												</div>
											</div>
										</li>
									);
								})
							)}
						</ul>
					</div>
				</div>

				{/* نموذج إدخال معلومات الجرد */}
				<div className='lg:col-span-2'>
					{currentItem ? (
						<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
							<div className='mb-6'>
								<h3 className='text-lg font-medium text-gray-900 mb-1'>{currentItem.name}</h3>
								<p className='text-sm text-gray-500'>{currentItem.code}</p>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										الكمية المتوقعة
									</label>
									<div className='relative rounded-md shadow-sm'>
										<input
											type='text'
											value={currentItem.expectedQuantity}
											disabled
											className='block w-full py-2 px-3 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none sm:text-sm'
										/>
										<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
											<span className='text-gray-500 sm:text-sm'>{currentItem.unit}</span>
										</div>
									</div>
								</div>

								<div>
									<label
										htmlFor='actual-quantity'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										الكمية الفعلية <span className='text-red-500'>*</span>
									</label>
									<div className='relative rounded-md shadow-sm'>
										<input
											type='number'
											id='actual-quantity'
											value={quantity}
											onChange={(e) => setQuantity(e.target.value)}
											min='0'
											className='block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
										/>
										<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
											<span className='text-gray-500 sm:text-sm'>{currentItem.unit}</span>
										</div>
									</div>
								</div>
							</div>

							<div className='mb-6'>
								<label htmlFor='item-notes' className='block text-sm font-medium text-gray-700 mb-1'>
									ملاحظات
								</label>
								<textarea
									id='item-notes'
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									rows={3}
									placeholder='أدخل أي ملاحظات إضافية عن حالة أو وضع الصنف...'
									className='block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
								></textarea>
							</div>

							{/* ملاحظة للحالة */}
							{quantity && parseInt(quantity) !== currentItem.expectedQuantity && (
								<div className='mb-6 p-3 bg-yellow-50 border border-yellow-200 rounded-md'>
									<div className='flex'>
										<div className='flex-shrink-0'>
											<Info className='h-5 w-5 text-yellow-400' />
										</div>
										<div className='mr-3'>
											<h3 className='text-sm font-medium text-yellow-800'>ملاحظة حول الاختلاف</h3>
											<div className='mt-2 text-sm text-yellow-700'>
												<p>
													هناك اختلاف بين الكمية المتوقعة والكمية الفعلية. يرجى التأكد من
													الكمية والتحقق مرة أخرى.
												</p>
											</div>
										</div>
									</div>
								</div>
							)}

							<div className='flex justify-end'>
								<button
									onClick={saveCurrentItem}
									disabled={!quantity || savingItem}
									className='px-4 py-2 bg-green-600 shadow-sm text-sm font-medium rounded-md text-white hover:bg-green-700 focus:outline-none disabled:bg-green-300 disabled:cursor-not-allowed flex items-center'
								>
									{savingItem ? (
										<>
											<div className='animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white ml-2'></div>
											جاري الحفظ...
										</>
									) : (
										<>
											<Save className='ml-2 h-4 w-4' />
											حفظ وانتقال للتالي
										</>
									)}
								</button>
							</div>
						</div>
					) : (
						<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
							<HelpCircle className='mx-auto h-12 w-12 text-gray-300' />
							<h3 className='mt-2 text-base font-medium text-gray-900'>اختر صنفاً من القائمة</h3>
							<p className='mt-1 text-sm text-gray-500'>
								قم باختيار صنف من القائمة على اليمين لإدخال الكمية الفعلية المجرودة
							</p>
						</div>
					)}

					{/* دليل المستخدم */}
					<div className='mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4'>
						<h3 className='text-lg font-medium text-blue-900 flex items-center'>
							<Info className='ml-2 h-5 w-5 text-blue-500' />
							دليل استخدام الجرد
						</h3>
						<ul className='mt-2 space-y-2 text-sm text-blue-700 list-disc list-inside pr-2'>
							<li>اختر صنفاً من القائمة على اليمين</li>
							<li>أدخل الكمية الفعلية التي قمت بجردها</li>
							<li>أضف أي ملاحظات إن وجدت (اختياري)</li>
							<li>اضغط على "حفظ وانتقال للتالي" للانتقال تلقائياً للصنف التالي</li>
							<li>بعد الانتهاء من جرد جميع الأصناف، اضغط على "إنهاء الجرد" أعلى الصفحة</li>
						</ul>
					</div>
				</div>
			</div>

			{/* نافذة تأكيد التباين الكبير */}
			{showDiscrepancyWarning && (
				<div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
					<div className='bg-white rounded-lg max-w-md w-full p-6'>
						<div className='flex items-center mb-4'>
							<AlertOctagon className='h-8 w-8 text-red-500 ml-3' />
							<h3 className='text-lg font-medium text-gray-900'>تحذير: تباين كبير في الكمية</h3>
						</div>

						<p className='text-sm text-gray-500 mb-4'>
							هناك تباين كبير بين الكمية المتوقعة والكمية المدخلة:
						</p>

						<div className='bg-gray-50 p-3 rounded-md mb-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<p className='text-xs text-gray-500'>الكمية المتوقعة</p>
									<p className='text-lg font-medium text-gray-900'>
										{currentItem?.expectedQuantity} {currentItem?.unit}
									</p>
								</div>
								<div>
									<p className='text-xs text-gray-500'>الكمية المدخلة</p>
									<p className='text-lg font-medium text-red-600'>
										{quantity} {currentItem?.unit}
									</p>
								</div>
							</div>
						</div>

						<p className='text-sm text-gray-700 mb-6'>
							هل أنت متأكد من صحة الكمية المدخلة؟ يرجى التحقق مرة أخرى للتأكد من الدقة.
						</p>

						<div className='flex justify-end gap-3'>
							<button
								onClick={() => setShowDiscrepancyWarning(false)}
								className='px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
							>
								تعديل الكمية
							</button>
							<button
								onClick={confirmDiscrepancy}
								className='px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700'
							>
								تأكيد الكمية
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
