'use client';

import {
	AlertTriangle,
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	BarChart2,
	CheckCircle,
	ChevronDown,
	Clipboard,
	Clock,
	Download,
	Eye,
	HelpCircle,
	Info,
	Loader,
	Package,
	Printer,
	RefreshCw,
	Save,
	Search,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AdjustmentItem {
	id: string;
	stockCountId: string;
	stockCountCode: string;
	itemId: string;
	itemCode: string;
	itemName: string;
	category: 'الأقمشة' | 'الخيوط' | 'الاكسسوارات' | 'أخرى';
	systemQuantity: number;
	actualQuantity: number;
	difference: number;
	diffPercentage: number;
	unit: string;
	adjustmentType: 'add' | 'deduct' | null;
	adjustmentQuantity: number | null;
	location: string;
	date: string;
	status: 'pending' | 'adjusted' | 'ignored';
	adjustmentReason: string | null;
	notes: string | null;
	costImpact: number | null;
}

export default function InventoryAdjustmentPage() {
	const [adjustmentItems, setAdjustmentItems] = useState<AdjustmentItem[]>([]);
	const [filteredItems, setFilteredItems] = useState<AdjustmentItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [selectedStatus, setSelectedStatus] = useState<string>('pending');
	const [selectedAdjustmentType, setSelectedAdjustmentType] = useState<string>('all');
	const [showHelp, setShowHelp] = useState(false);
	const [adjustmentCompleted, setAdjustmentCompleted] = useState(false);
	const [adjustmentStats, setAdjustmentStats] = useState({
		totalItems: 0,
		totalCostImpact: 0,
		positiveAdjustments: 0,
		negativeAdjustments: 0,
	});

	// حالة تنبيه النجاح
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		// محاكاة استدعاء API لجلب بيانات الاختلافات للتسوية
		const fetchAdjustmentItems = async () => {
			try {
				// تأخير مصطنع لمحاكاة الاتصال بالخادم
				await new Promise((resolve) => setTimeout(resolve, 800));

				// بيانات تجريبية للاختلافات
				const mockAdjustmentItems: AdjustmentItem[] = [
					{
						id: 'adj-001',
						stockCountId: 'sc-001',
						stockCountCode: 'SC-2023-09-001',
						itemId: 'item-001',
						itemCode: 'FAB-COTTON-001',
						itemName: 'قطن مصري فاخر',
						category: 'الأقمشة',
						systemQuantity: 250,
						actualQuantity: 245,
						difference: -5,
						diffPercentage: 2,
						unit: 'متر',
						adjustmentType: 'deduct',
						adjustmentQuantity: 5,
						location: 'المستودع الرئيسي',
						date: '2023-09-05',
						status: 'pending',
						adjustmentReason: 'تلف',
						notes: 'وجدت قطع تالفة لم تسجل في النظام',
						costImpact: -225, // 5 متر × 45 ريال
					},
					{
						id: 'adj-002',
						stockCountId: 'sc-001',
						stockCountCode: 'SC-2023-09-001',
						itemId: 'item-002',
						itemCode: 'FAB-SILK-001',
						itemName: 'حرير طبيعي',
						category: 'الأقمشة',
						systemQuantity: 80,
						actualQuantity: 82,
						difference: 2,
						diffPercentage: 2.5,
						unit: 'متر',
						adjustmentType: 'add',
						adjustmentQuantity: 2,
						location: 'المستودع الرئيسي',
						date: '2023-09-05',
						status: 'pending',
						adjustmentReason: 'خطأ بشري',
						notes: null,
						costImpact: 240, // 2 متر × 120 ريال
					},
					{
						id: 'adj-003',
						stockCountId: 'sc-001',
						stockCountCode: 'SC-2023-09-001',
						itemId: 'item-003',
						itemCode: 'FAB-WOOL-001',
						itemName: 'صوف كشميري',
						category: 'الأقمشة',
						systemQuantity: 35,
						actualQuantity: 30,
						difference: -5,
						diffPercentage: 14.29,
						unit: 'متر',
						adjustmentType: 'deduct',
						adjustmentQuantity: 5,
						location: 'المستودع الرئيسي',
						date: '2023-09-05',
						status: 'pending',
						adjustmentReason: 'نقص غير مبرر',
						notes: 'يجب إعادة طلب كمية جديدة',
						costImpact: -450, // 5 متر × 90 ريال
					},
					{
						id: 'adj-004',
						stockCountId: 'sc-002',
						stockCountCode: 'SC-2023-09-002',
						itemId: 'item-004',
						itemCode: 'THR-COT-001',
						itemName: 'خيط قطني ممتاز',
						category: 'الخيوط',
						systemQuantity: 100,
						actualQuantity: 95,
						difference: -5,
						diffPercentage: 5,
						unit: 'بكرة',
						adjustmentType: 'deduct',
						adjustmentQuantity: 5,
						location: 'المستودع الرئيسي',
						date: '2023-09-12',
						status: 'pending',
						adjustmentReason: 'استهلاك غير مسجل',
						notes: 'بعض البكرات مستخدمة جزئياً',
						costImpact: -75, // 5 بكرات × 15 ريال
					},
					{
						id: 'adj-005',
						stockCountId: 'sc-002',
						stockCountCode: 'SC-2023-09-002',
						itemId: 'item-005',
						itemCode: 'THR-POLY-001',
						itemName: 'خيط بوليستر',
						category: 'الخيوط',
						systemQuantity: 50,
						actualQuantity: 45,
						difference: -5,
						diffPercentage: 10,
						unit: 'بكرة',
						adjustmentType: 'deduct',
						adjustmentQuantity: 5,
						location: 'المستودع الرئيسي',
						date: '2023-09-12',
						status: 'pending',
						adjustmentReason: 'سرقة',
						notes: 'تم توثيق الحادثة في تقرير منفصل',
						costImpact: -60, // 5 بكرات × 12 ريال
					},
					{
						id: 'adj-006',
						stockCountId: 'sc-003',
						stockCountCode: 'SC-2023-08-001',
						itemId: 'item-006',
						itemCode: 'ACC-BTN-001',
						itemName: 'أزرار كلاسيكية',
						category: 'الاكسسوارات',
						systemQuantity: 500,
						actualQuantity: 480,
						difference: -20,
						diffPercentage: 4,
						unit: 'قطعة',
						adjustmentType: 'deduct',
						adjustmentQuantity: 20,
						location: 'مستودع الفرع الثاني',
						date: '2023-08-16',
						status: 'pending',
						adjustmentReason: 'استهلاك غير مسجل',
						notes: null,
						costImpact: -10, // 20 قطعة × 0.5 ريال
					},
					{
						id: 'adj-007',
						stockCountId: 'sc-003',
						stockCountCode: 'SC-2023-08-001',
						itemId: 'item-007',
						itemCode: 'ACC-ZP-001',
						itemName: 'سحاب معدني',
						category: 'الاكسسوارات',
						systemQuantity: 200,
						actualQuantity: 220,
						difference: 20,
						diffPercentage: 10,
						unit: 'قطعة',
						adjustmentType: 'add',
						adjustmentQuantity: 20,
						location: 'مستودع الفرع الثاني',
						date: '2023-08-16',
						status: 'pending',
						adjustmentReason: 'استلام غير مسجل',
						notes: 'تم استلام شحنة جديدة لم تسجل في النظام',
						costImpact: 60, // 20 قطعة × 3 ريال
					},
				];

				setAdjustmentItems(mockAdjustmentItems);

				// حساب الإحصائيات
				calculateAdjustmentStats(mockAdjustmentItems);

				setLoading(false);
			} catch (error) {
				console.error('Error fetching adjustment items:', error);
				setLoading(false);
			}
		};

		fetchAdjustmentItems();
	}, []);

	// حساب إحصائيات التسوية
	const calculateAdjustmentStats = (items: AdjustmentItem[]) => {
		const totalItems = items.length;
		const totalCostImpact = items.reduce((sum, item) => sum + (item.costImpact || 0), 0);
		const positiveAdjustments = items.filter((item) => item.adjustmentType === 'add').length;
		const negativeAdjustments = items.filter((item) => item.adjustmentType === 'deduct').length;

		setAdjustmentStats({
			totalItems,
			totalCostImpact,
			positiveAdjustments,
			negativeAdjustments,
		});
	};

	// تطبيق الفلاتر عند تغير أي من معايير البحث
	useEffect(() => {
		const applyFilters = () => {
			let filtered = [...adjustmentItems];

			// فلترة بناء على البحث
			if (searchTerm) {
				filtered = filtered.filter(
					(item) =>
						item.itemName.includes(searchTerm) ||
						item.itemCode.includes(searchTerm) ||
						item.stockCountCode.includes(searchTerm)
				);
			}

			// فلترة بناء على الفئة
			if (selectedCategory) {
				filtered = filtered.filter((item) => item.category === selectedCategory);
			}

			// فلترة بناء على الحالة
			if (selectedStatus) {
				filtered = filtered.filter((item) => item.status === selectedStatus);
			}

			// فلترة بناء على نوع التسوية
			if (selectedAdjustmentType !== 'all') {
				filtered = filtered.filter((item) => item.adjustmentType === selectedAdjustmentType);
			}

			setFilteredItems(filtered);
		};

		applyFilters();
	}, [adjustmentItems, searchTerm, selectedCategory, selectedStatus, selectedAdjustmentType]);

	// تحديث حالة تسوية العنصر
	const updateItemStatus = (id: string, status: 'pending' | 'adjusted' | 'ignored') => {
		setAdjustmentItems((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)));
	};

	// تحديث سبب التسوية
	const updateAdjustmentReason = (id: string, reason: string) => {
		setAdjustmentItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, adjustmentReason: reason } : item))
		);
	};

	// إجراء تسوية المخزون لجميع العناصر المحددة
	const handleSubmitAdjustment = async () => {
		const itemsToAdjust = filteredItems.filter((item) => item.status === 'pending');

		if (itemsToAdjust.length === 0) {
			setSuccessMessage('لا توجد عناصر للتسوية. يرجى اختيار عناصر بحالة "بانتظار التسوية".');
			setTimeout(() => setSuccessMessage(null), 5000);
			return;
		}

		// التحقق من وجود سبب للتسوية لجميع العناصر
		const missingReasons = itemsToAdjust.filter((item) => !item.adjustmentReason);
		if (missingReasons.length > 0) {
			alert(`يرجى إضافة سبب للتسوية لجميع العناصر. يوجد ${missingReasons.length} عنصر بدون سبب.`);
			return;
		}

		setSubmitting(true);

		try {
			// محاكاة استدعاء API لإجراء التسوية
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// تحديث حالة العناصر إلى "تمت التسوية"
			const updatedItems = adjustmentItems.map((item) => {
				if (itemsToAdjust.some((adjustItem) => adjustItem.id === item.id)) {
					return { ...item, status: 'adjusted' } as AdjustmentItem;
				}
				return item;
			});

			setAdjustmentItems(updatedItems);
			calculateAdjustmentStats(updatedItems);

			// إظهار رسالة النجاح
			setSuccessMessage(`تم تسوية ${itemsToAdjust.length} عنصر بنجاح`);
			setTimeout(() => setSuccessMessage(null), 5000);

			// إظهار قسم اكتمال التسوية
			setAdjustmentCompleted(true);
		} catch (error) {
			console.error('Error submitting adjustments:', error);
			alert('حدث خطأ أثناء تسوية المخزون. يرجى المحاولة مرة أخرى.');
		} finally {
			setSubmitting(false);
		}
	};

	// تجاهل جميع العناصر المحددة
	const handleIgnoreAllItems = async () => {
		const itemsToIgnore = filteredItems.filter((item) => item.status === 'pending');

		if (itemsToIgnore.length === 0) {
			setSuccessMessage('لا توجد عناصر للتجاهل. يرجى اختيار عناصر بحالة "بانتظار التسوية".');
			setTimeout(() => setSuccessMessage(null), 5000);
			return;
		}

		if (!confirm(`هل أنت متأكد من تجاهل ${itemsToIgnore.length} عنصر؟ لن يتم تسوية هذه العناصر في المخزون.`)) {
			return;
		}

		setSubmitting(true);

		try {
			// محاكاة استدعاء API لتجاهل العناصر
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// تحديث حالة العناصر إلى "تم التجاهل"
			const updatedItems = adjustmentItems.map((item) => {
				if (itemsToIgnore.some((ignoreItem) => ignoreItem.id === item.id)) {
					return { ...item, status: 'ignored' } as AdjustmentItem;
				}
				return item;
			});
			setAdjustmentItems(updatedItems);
			calculateAdjustmentStats(updatedItems);

			// إظهار رسالة النجاح
			setSuccessMessage(`تم تجاهل ${itemsToIgnore.length} عنصر بنجاح`);
			setTimeout(() => setSuccessMessage(null), 5000);
		} catch (error) {
			console.error('Error ignoring items:', error);
			alert('حدث خطأ أثناء تجاهل العناصر. يرجى المحاولة مرة أخرى.');
		} finally {
			setSubmitting(false);
		}
	};

	// إعادة فتح جميع العناصر المحددة
	const handleReopenAllItems = async () => {
		const itemsToReopen = filteredItems.filter((item) => item.status !== 'pending');

		if (itemsToReopen.length === 0) {
			setSuccessMessage('لا توجد عناصر لإعادة فتحها. يرجى اختيار عناصر بحالة "تمت التسوية" أو "تم التجاهل".');
			setTimeout(() => setSuccessMessage(null), 5000);
			return;
		}

		if (
			!confirm(
				`هل أنت متأكد من إعادة فتح ${itemsToReopen.length} عنصر؟ سيتم إعادة العناصر إلى حالة "بانتظار التسوية".`
			)
		) {
			return;
		}

		setSubmitting(true);

		try {
			// محاكاة استدعاء API لإعادة فتح العناصر
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// تحديث حالة العناصر إلى "بانتظار التسوية"
			const updatedItems = adjustmentItems.map((item) => {
				if (itemsToReopen.some((reopenItem) => reopenItem.id === item.id)) {
					return { ...item, status: 'pending' } as AdjustmentItem;
				}
				return item;
			});
			setAdjustmentItems(updatedItems);
			calculateAdjustmentStats(updatedItems);

			// إظهار رسالة النجاح
			setSuccessMessage(`تم إعادة فتح ${itemsToReopen.length} عنصر بنجاح`);
			setTimeout(() => setSuccessMessage(null), 5000);

			// إعادة تعيين حالة اكتمال التسوية
			setAdjustmentCompleted(false);
		} catch (error) {
			console.error('Error reopening items:', error);
			alert('حدث خطأ أثناء إعادة فتح العناصر. يرجى المحاولة مرة أخرى.');
		} finally {
			setSubmitting(false);
		}
	};

	// الحصول على تصنيف تأثير التكلفة
	const getCostImpactClass = (impact: number | null) => {
		if (!impact) return 'text-gray-500';
		if (impact > 0) return 'text-green-600';
		if (impact < 0) return 'text-red-600';
		return 'text-gray-500';
	};

	// الحصول على قائمة أسباب التسوية
	const getAdjustmentReasons = (type: 'add' | 'deduct' | null) => {
		if (type === 'add') {
			return [
				'استلام غير مسجل',
				'إرجاع من العملاء',
				'خطأ بشري',
				'إعادة تقييم',
				'عينات إضافية',
				'تحويل من مستودع آخر',
				'أخرى',
			];
		} else if (type === 'deduct') {
			return [
				'تلف',
				'سرقة',
				'استهلاك غير مسجل',
				'نقص غير مبرر',
				'خطأ بشري',
				'تحويل إلى مستودع آخر',
				'إهلاك',
				'أخرى',
			];
		}
		return [];
	};

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<div className='flex items-center'>
						<Link
							href='/dashboard/inventory/discrepancies'
							className='flex items-center text-gray-500 hover:text-gray-700 ml-4'
						>
							<ArrowLeft className='h-5 w-5' />
							<span className='mr-1 text-sm'>العودة إلى التقرير</span>
						</Link>
						<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
							<Clipboard className='inline-block ml-2 h-6 w-6 text-blue-600' />
							تسوية اختلافات المخزون
						</h1>
					</div>
					<p className='mt-1 text-sm text-gray-600'>
						تعديل وتسوية اختلافات المخزون بين الكميات المسجلة في النظام والكميات الفعلية
					</p>
				</div>

				<div className='flex gap-2'>
					<button
						onClick={() => setShowHelp(!showHelp)}
						className='px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center'
					>
						<HelpCircle className='ml-1 h-4 w-4 text-gray-500' />
						مساعدة
					</button>

					<button
						onClick={() => {}}
						className='px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center'
					>
						<Printer className='ml-1 h-4 w-4' />
						طباعة
					</button>

					<button
						onClick={() => {}}
						className='px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center'
					>
						<Download className='ml-1 h-4 w-4' />
						تصدير
					</button>
				</div>
			</div>

			{/* قسم المساعدة */}
			{showHelp && (
				<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
					<div className='flex justify-between'>
						<h3 className='text-lg font-medium text-blue-900 flex items-center'>
							<Info className='ml-2 h-5 w-5 text-blue-500' />
							كيفية تسوية اختلافات المخزون
						</h3>
						<button onClick={() => setShowHelp(false)} className='text-blue-500 hover:text-blue-700'>
							<X className='h-5 w-5' />
						</button>
					</div>
					<div className='mt-2 text-sm text-blue-700'>
						<ol className='list-decimal list-inside space-y-2 mr-4'>
							<li>راجع قائمة الاختلافات المعروضة وتحقق من أنواعها (إضافة أو خصم).</li>
							<li>اختر سبب التسوية من القائمة المنسدلة لكل عنصر.</li>
							<li>للتبديل بين حالات العناصر، استخدم أزرار "تسوية" أو "تجاهل".</li>
							<li>استخدم أزرار الإجراءات الجماعية لتسوية أو تجاهل أو إعادة فتح مجموعة من العناصر.</li>
							<li>
								بعد مراجعة جميع العناصر وتحديد أسبابها، انقر على زر "حفظ وتنفيذ التسوية" لتحديث المخزون.
							</li>
							<li>بعد التسوية، سيتم تحديث كميات المخزون في النظام تلقائياً.</li>
							<li>يمكنك تصفية العناصر حسب الفئة، الحالة، أو نوع التسوية باستخدام أدوات التصفية.</li>
						</ol>
						<div className='mt-4 p-2 bg-blue-100 rounded-md'>
							<p className='font-medium'>ملاحظة هامة:</p>
							<p>
								تأكد من صحة الكميات وأسباب التسوية قبل الحفظ، حيث سيؤثر ذلك على قيمة المخزون وتقارير
								المحاسبة.
							</p>
						</div>
					</div>
				</div>
			)}

			{/* رسالة النجاح */}
			{successMessage && (
				<div className='bg-green-50 border border-green-200 rounded-md p-4'>
					<div className='flex'>
						<div className='flex-shrink-0'>
							<CheckCircle className='h-5 w-5 text-green-400' />
						</div>
						<div className='mr-3'>
							<p className='text-sm font-medium text-green-800'>{successMessage}</p>
						</div>
					</div>
				</div>
			)}

			{/* بطاقات الإحصائيات */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-blue-100 text-blue-600 mr-4'>
						<Clipboard className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>إجمالي العناصر</p>
						<p className='text-xl font-semibold'>{filteredItems.length}</p>
					</div>
				</div>

				<div className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center`}>
					<div
						className={`p-3 rounded-full ${
							adjustmentStats.totalCostImpact >= 0
								? 'bg-green-100 text-green-600'
								: 'bg-red-100 text-red-600'
						} mr-4`}
					>
						<BarChart2 className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>تأثير التكلفة</p>
						<p className={`text-xl font-semibold ${getCostImpactClass(adjustmentStats.totalCostImpact)}`}>
							{Math.abs(adjustmentStats.totalCostImpact).toLocaleString()} ريال
							{adjustmentStats.totalCostImpact >= 0 ? ' +' : ' -'}
						</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-green-100 text-green-600 mr-4'>
						<ArrowUp className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>تسويات إضافة</p>
						<p className='text-xl font-semibold'>{adjustmentStats.positiveAdjustments}</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-red-100 text-red-600 mr-4'>
						<ArrowDown className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>تسويات خصم</p>
						<p className='text-xl font-semibold'>{adjustmentStats.negativeAdjustments}</p>
					</div>
				</div>
			</div>

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex flex-col sm:flex-row gap-4 mb-4'>
					{/* البحث */}
					<div className='flex-1 relative'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='ابحث بالاسم، الكود، أو رقم الجرد...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
						/>
					</div>

					{/* فلترة الفئة */}
					<div className='w-full sm:w-40'>
						<div className='relative'>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm pr-8'
							>
								<option value=''>كل الفئات</option>
								<option value='الأقمشة'>الأقمشة</option>
								<option value='الخيوط'>الخيوط</option>
								<option value='الاكسسوارات'>الاكسسوارات</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* فلترة الحالة */}
					<div className='w-full sm:w-44'>
						<div className='relative'>
							<select
								value={selectedStatus}
								onChange={(e) => setSelectedStatus(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm pr-8'
							>
								<option value=''>كل الحالات</option>
								<option value='pending'>بانتظار التسوية</option>
								<option value='adjusted'>تمت التسوية</option>
								<option value='ignored'>تم التجاهل</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* فلترة نوع التسوية */}
					<div className='w-full sm:w-44'>
						<div className='relative'>
							<select
								value={selectedAdjustmentType}
								onChange={(e) => setSelectedAdjustmentType(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm pr-8'
							>
								<option value='all'>كل أنواع التسوية</option>
								<option value='add'>إضافة للمخزون</option>
								<option value='deduct'>خصم من المخزون</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* زر إعادة تعيين الفلاتر */}
					<button
						onClick={() => {
							setSearchTerm('');
							setSelectedCategory('');
							setSelectedStatus('');
							setSelectedAdjustmentType('all');
						}}
						className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-200'
						disabled={
							!searchTerm && !selectedCategory && !selectedStatus && selectedAdjustmentType === 'all'
						}
					>
						<RefreshCw className='ml-1 h-4 w-4' />
						إعادة تعيين
					</button>
				</div>

				{/* أزرار الإجراءات الجماعية */}
				<div className='flex flex-wrap gap-2'>
					<button
						onClick={handleSubmitAdjustment}
						disabled={submitting || filteredItems.filter((item) => item.status === 'pending').length === 0}
						className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed'
					>
						{submitting ? (
							<>
								<Loader className='animate-spin ml-2 h-4 w-4' />
								جاري التسوية...
							</>
						) : (
							<>
								<Save className='ml-2 h-4 w-4' />
								حفظ وتنفيذ التسوية
							</>
						)}
					</button>

					<button
						onClick={handleIgnoreAllItems}
						disabled={submitting || filteredItems.filter((item) => item.status === 'pending').length === 0}
						className='px-4 py-2 bg-gray-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed'
					>
						<X className='ml-2 h-4 w-4' />
						تجاهل الكل
					</button>

					<button
						onClick={handleReopenAllItems}
						disabled={submitting || filteredItems.filter((item) => item.status !== 'pending').length === 0}
						className='px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md text-sm font-medium flex items-center hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed'
					>
						<RefreshCw className='ml-2 h-4 w-4' />
						إعادة فتح الكل
					</button>

					<Link
						href='/dashboard/inventory/discrepancies'
						className='px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md text-sm font-medium flex items-center hover:bg-gray-50 mr-auto'
					>
						<Eye className='ml-2 h-4 w-4' />
						عرض تقرير الاختلافات
					</Link>
				</div>
			</div>

			{/* قسم اكتمال التسوية */}
			{adjustmentCompleted && (
				<div className='bg-green-50 border border-green-200 rounded-lg p-6'>
					<div className='text-center mb-4'>
						<CheckCircle className='mx-auto h-12 w-12 text-green-500' />
						<h3 className='mt-2 text-lg font-medium text-gray-900'>تم تسوية المخزون بنجاح</h3>
						<p className='mt-1 text-sm text-gray-600'>
							تمت تسوية اختلافات المخزون بنجاح وتحديث الكميات في النظام
						</p>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4'>
						<div className='bg-white p-4 rounded-md border border-green-200'>
							<p className='text-sm font-medium text-gray-600'>العناصر المعالجة</p>
							<p className='text-xl font-semibold text-gray-900'>
								{filteredItems.filter((item) => item.status === 'adjusted').length}
							</p>
						</div>

						<div className='bg-white p-4 rounded-md border border-green-200'>
							<p className='text-sm font-medium text-gray-600'>تاريخ التسوية</p>
							<p className='text-xl font-semibold text-gray-900'>
								{new Date().toLocaleDateString('ar-SA')}
							</p>
						</div>

						<div className='bg-white p-4 rounded-md border border-green-200'>
							<p className='text-sm font-medium text-gray-600'>تأثير التكلفة الإجمالي</p>
							<p
								className={`text-xl font-semibold ${getCostImpactClass(
									adjustmentStats.totalCostImpact
								)}`}
							>
								{Math.abs(adjustmentStats.totalCostImpact).toLocaleString()} ريال
								{adjustmentStats.totalCostImpact >= 0 ? ' +' : ' -'}
							</p>
						</div>
					</div>

					<div className='flex justify-center gap-3'>
						<Link
							href='/dashboard/inventory/discrepancies'
							className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700'
						>
							<ArrowRight className='ml-2 h-4 w-4' />
							العودة إلى تقرير الاختلافات
						</Link>

						<button
							onClick={() => {
								setSelectedStatus('');
								setAdjustmentCompleted(false);
							}}
							className='px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
						>
							<Eye className='ml-2 h-4 w-4' />
							عرض جميع العناصر
						</button>
					</div>
				</div>
			)}

			{/* جدول العناصر */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				{loading ? (
					<div className='flex justify-center items-center h-64'>
						<div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500'></div>
					</div>
				) : filteredItems.length === 0 ? (
					<div className='p-8 text-center'>
						<Package className='mx-auto h-12 w-12 text-gray-300' />
						<h3 className='mt-2 text-base font-medium text-gray-900'>لا توجد عناصر للتسوية</h3>
						<p className='mt-1 text-sm text-gray-500'>
							{searchTerm || selectedCategory || selectedStatus || selectedAdjustmentType !== 'all'
								? 'لا توجد عناصر مطابقة لمعايير البحث.'
								: 'لا توجد اختلافات في المخزون تتطلب التسوية.'}
						</p>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الصنف
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الفئة
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										النظام
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الفعلي
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الفرق
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										نوع التسوية
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										سبب التسوية
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										تأثير التكلفة
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الحالة
									</th>
									<th scope='col' className='relative px-4 py-3'>
										<span className='sr-only'>إجراءات</span>
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{filteredItems.map((item) => (
									<tr
										key={item.id}
										className={`hover:bg-gray-50 ${
											item.status === 'adjusted'
												? 'bg-green-50'
												: item.status === 'ignored'
												? 'bg-gray-50'
												: ''
										}`}
									>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='text-sm font-medium text-gray-900'>{item.itemName}</div>
											<div className='text-xs text-gray-500'>{item.itemCode}</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-700'>
											{item.category}
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
											{item.systemQuantity} {item.unit}
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
											{item.actualQuantity} {item.unit}
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<span
												className={`text-sm font-medium ${
													item.difference > 0
														? 'text-green-600'
														: item.difference < 0
														? 'text-red-600'
														: 'text-gray-500'
												}`}
											>
												{item.difference > 0 ? '+' : ''}
												{item.difference} {item.unit}
												<span className='text-xs text-gray-500 mr-1'>
													({item.diffPercentage}%)
												</span>
											</span>
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<span
												className={`px-2 py-1 text-xs rounded-full ${
													item.adjustmentType === 'add'
														? 'bg-green-100 text-green-800'
														: item.adjustmentType === 'deduct'
														? 'bg-red-100 text-red-800'
														: 'bg-gray-100 text-gray-800'
												}`}
											>
												{item.adjustmentType === 'add'
													? 'إضافة'
													: item.adjustmentType === 'deduct'
													? 'خصم'
													: 'غير محدد'}
											</span>
										</td>
										<td className='px-4 py-3'>
											{item.status === 'pending' ? (
												<select
													value={item.adjustmentReason || ''}
													onChange={(e) => updateAdjustmentReason(item.id, e.target.value)}
													className='block w-full text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
												>
													<option value='' disabled>
														اختر السبب
													</option>
													{getAdjustmentReasons(item.adjustmentType).map((reason) => (
														<option key={reason} value={reason}>
															{reason}
														</option>
													))}
												</select>
											) : (
												<span className='text-sm text-gray-700'>
													{item.adjustmentReason || '-'}
												</span>
											)}
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<span
												className={`text-sm font-medium ${getCostImpactClass(item.costImpact)}`}
											>
												{item.costImpact
													? `${Math.abs(item.costImpact)} ${item.costImpact > 0 ? '+' : '-'}`
													: '-'}
											</span>
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<span
												className={`px-2 py-1 text-xs rounded-full ${
													item.status === 'pending'
														? 'bg-yellow-100 text-yellow-800'
														: item.status === 'adjusted'
														? 'bg-green-100 text-green-800'
														: 'bg-gray-100 text-gray-800'
												}`}
											>
												{item.status === 'pending'
													? 'بانتظار التسوية'
													: item.status === 'adjusted'
													? 'تمت التسوية'
													: 'تم التجاهل'}
											</span>
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-left text-sm font-medium'>
											{item.status === 'pending' ? (
												<div className='flex justify-start space-x-2 space-x-reverse'>
													<button
														onClick={() => updateItemStatus(item.id, 'adjusted')}
														className='text-green-600 hover:text-green-800'
														title='تسوية'
													>
														<CheckCircle className='h-5 w-5' />
													</button>
													<button
														onClick={() => updateItemStatus(item.id, 'ignored')}
														className='text-gray-600 hover:text-gray-800'
														title='تجاهل'
													>
														<X className='h-5 w-5' />
													</button>
												</div>
											) : (
												<button
													onClick={() => updateItemStatus(item.id, 'pending')}
													className='text-blue-600 hover:text-blue-800'
													title='إعادة فتح'
												>
													<RefreshCw className='h-5 w-5' />
												</button>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* ملخص حالة التسوية */}
			{!loading && filteredItems.length > 0 && (
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<h3 className='text-sm font-medium text-gray-900 mb-3'>ملخص حالة التسوية</h3>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						<div className='flex items-center'>
							<div className='p-2 rounded-full bg-yellow-100 text-yellow-600 ml-3'>
								<Clock className='h-5 w-5' />
							</div>
							<div>
								<p className='text-xs text-gray-500'>بانتظار التسوية</p>
								<p className='text-lg font-medium text-gray-900'>
									{filteredItems.filter((item) => item.status === 'pending').length} عنصر
								</p>
							</div>
						</div>

						<div className='flex items-center'>
							<div className='p-2 rounded-full bg-green-100 text-green-600 ml-3'>
								<CheckCircle className='h-5 w-5' />
							</div>
							<div>
								<p className='text-xs text-gray-500'>تمت التسوية</p>
								<p className='text-lg font-medium text-gray-900'>
									{filteredItems.filter((item) => item.status === 'adjusted').length} عنصر
								</p>
							</div>
						</div>

						<div className='flex items-center'>
							<div className='p-2 rounded-full bg-gray-100 text-gray-600 ml-3'>
								<X className='h-5 w-5' />
							</div>
							<div>
								<p className='text-xs text-gray-500'>تم التجاهل</p>
								<p className='text-lg font-medium text-gray-900'>
									{filteredItems.filter((item) => item.status === 'ignored').length} عنصر
								</p>
							</div>
						</div>
					</div>

					{filteredItems.filter((item) => item.status === 'pending').length > 0 && (
						<div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md'>
							<div className='flex'>
								<AlertTriangle className='h-5 w-5 text-yellow-500 ml-2 flex-shrink-0' />
								<div>
									<p className='text-sm text-yellow-700'>
										يوجد {filteredItems.filter((item) => item.status === 'pending').length} عنصر
										بانتظار التسوية. يرجى إكمال تسوية جميع العناصر أو تجاهلها قبل الانتهاء.
									</p>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
