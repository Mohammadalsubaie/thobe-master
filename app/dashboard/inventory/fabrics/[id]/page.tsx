// app/dashboard/inventory/fabrics/[id]/page.tsx
'use client';

import {
	AlertTriangle,
	ArrowRight,
	Check,
	ChevronDown,
	ChevronUp,
	Copy,
	Edit,
	MinusCircle,
	Plus,
	PlusCircle,
	RefreshCw,
	Trash2,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// نوع بيانات القماش
interface Fabric {
	id: string;
	name: string;
	sku: string;
	description: string;
	color: string;
	colorCode: string;
	material: string;
	width: number;
	price: number;
	cost: number;
	unit: string;
	quantityAvailable: number;
	minimumStockLevel: number;
	isActive: boolean;
	images: string[];
	supplier: {
		id: string;
		name: string;
		contactPerson: string;
		phone: string;
		email: string;
	};
	purchaseHistory: {
		id: string;
		date: Date;
		quantity: number;
		price: number;
		invoiceNumber: string;
	}[];
	usageHistory: {
		id: string;
		date: Date;
		quantity: number;
		orderId?: string;
		customer?: string;
		reason: string;
	}[];
	attributes: Record<string, string>;
	createdAt: Date;
	updatedAt: Date;
}

// كومبوننت مخصص للبطاقات
const InfoCard = ({
	title,
	children,
	className = '',
}: {
	title: string;
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<div
			className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden ${className}`}
		>
			<div className='px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center'>
				<h3 className='text-sm font-medium text-gray-700 dark:text-gray-200'>{title}</h3>
			</div>
			<div className='p-4'>{children}</div>
		</div>
	);
};

// كومبوننت مخصص للحقول
const InfoField = ({ label, value, className = '' }: { label: string; value: React.ReactNode; className?: string }) => {
	return (
		<div className={`flex flex-col mb-4 ${className}`}>
			<span className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>{label}</span>
			<div className='text-sm text-gray-900 dark:text-gray-100'>{value}</div>
		</div>
	);
};

export default function FabricDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const [fabric, setFabric] = useState<Fabric | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [adjustingInventory, setAdjustingInventory] = useState(false);
	const [adjustmentQuantity, setAdjustmentQuantity] = useState(0);
	const [adjustmentReason, setAdjustmentReason] = useState('');
	const [adjustmentSuccess, setAdjustmentSuccess] = useState(false);
	const [activeImage, setActiveImage] = useState(0);
	const [expandedSection, setExpandedSection] = useState<string | null>('details');
	const [copiedField, setCopiedField] = useState<string | null>(null);

	// جلب بيانات القماش
	useEffect(() => {
		const fetchFabricDetails = async () => {
			try {
				setLoading(true);
				// في التطبيق الحقيقي، هذا سيكون استدعاء API
				await new Promise((resolve) => setTimeout(resolve, 800));

				// بيانات تجريبية
				const mockFabric: Fabric = {
					id: 'f1',
					name: 'قماش كشمير أسود فاخر',
					sku: 'FAB-KSH-BLK-001',
					description:
						'قماش كشمير أسود عالي الجودة، مثالي للثياب الرسمية والمناسبات الخاصة. قماش ناعم مع لمعة خفيفة.',
					color: 'أسود',
					colorCode: '#000000',
					material: 'كشمير، صوف، بوليستر',
					width: 150,
					price: 120, // سعر المتر
					cost: 80, // تكلفة المتر
					unit: 'متر',
					quantityAvailable: 45.5,
					minimumStockLevel: 20,
					isActive: true,
					images: ['/images/fabrics/Saudi_Riyal_Symbol.png', '/images/fabrics/Saudi_Riyal_Symbol.png'],
					supplier: {
						id: 's1',
						name: 'شركة النسيج العالمية',
						contactPerson: 'خالد محمد',
						phone: '0512345678',
						email: 'info@textileglobal.com',
					},
					purchaseHistory: [
						{
							id: 'ph1',
							date: new Date('2025-03-10'),
							quantity: 50,
							price: 4000,
							invoiceNumber: 'INV-2025-456',
						},
						{
							id: 'ph2',
							date: new Date('2025-01-22'),
							quantity: 30,
							price: 2400,
							invoiceNumber: 'INV-2025-123',
						},
					],
					usageHistory: [
						{
							id: 'uh1',
							date: new Date('2025-04-15'),
							quantity: 3.5,
							orderId: 'ORD-10025',
							customer: 'أحمد خالد',
							reason: 'طلب عميل',
						},
						{
							id: 'uh2',
							date: new Date('2025-04-10'),
							quantity: 1,
							reason: 'عينة للعرض',
						},
					],
					attributes: {
						'نوع النسيج': 'مخلوط',
						'وزن القماش': '280 جرام/متر مربع',
						'مقاومة للتجعد': 'عالية',
						'مقاومة للماء': 'متوسطة',
						'مناسب لـ': 'ثوب، بدلة، جاكيت',
					},
					createdAt: new Date('2025-01-20'),
					updatedAt: new Date('2025-04-05'),
				};

				setFabric(mockFabric);
			} catch (err) {
				console.error('Error fetching fabric details:', err);
				setError('حدث خطأ أثناء تحميل بيانات القماش');
			} finally {
				setLoading(false);
			}
		};

		fetchFabricDetails();
	}, [params.id]);

	// تبديل حالة التوسع للأقسام
	const toggleSection = (section: string) => {
		if (expandedSection === section) {
			setExpandedSection(null);
		} else {
			setExpandedSection(section);
		}
	};

	// إنشاء كود لون للعرض
	const ColorSwatch = ({ colorCode }: { colorCode: string }) => (
		<div
			className='w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 inline-block mr-2'
			style={{ backgroundColor: colorCode }}
		/>
	);

	// تنفيذ تعديل المخزون
	const handleInventoryAdjustment = async () => {
		if (adjustmentQuantity === 0 || !adjustmentReason) return;

		try {
			setAdjustmentSuccess(false);
			// في التطبيق الحقيقي، هذا سيكون استدعاء API
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (fabric) {
				const newQuantity = fabric.quantityAvailable + adjustmentQuantity;
				setFabric({
					...fabric,
					quantityAvailable: newQuantity,
					usageHistory: [
						{
							id: `uh${fabric.usageHistory.length + 1}`,
							date: new Date(),
							quantity: Math.abs(adjustmentQuantity),
							reason: adjustmentReason,
						},
						...fabric.usageHistory,
					],
				});
			}

			setAdjustmentSuccess(true);

			// إعادة التعيين بعد النجاح
			setTimeout(() => {
				setAdjustmentQuantity(0);
				setAdjustmentReason('');
				setAdjustingInventory(false);
				setAdjustmentSuccess(false);
			}, 2000);
		} catch (err) {
			console.error('Error adjusting inventory:', err);
			setError('حدث خطأ أثناء تعديل المخزون');
		}
	};

	// نسخ حقل إلى الحافظة
	const copyToClipboard = (text: string, field: string) => {
		navigator.clipboard.writeText(text);
		setCopiedField(field);
		setTimeout(() => setCopiedField(null), 2000);
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'></div>
				<span className='mr-2 text-gray-700 dark:text-gray-300'>جاري تحميل البيانات...</span>
			</div>
		);
	}

	if (error || !fabric) {
		return (
			<div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-md'>
				<div className='text-red-700 dark:text-red-400 font-medium'>
					{error || 'لم يتم العثور على بيانات القماش'}
				</div>
				<Link
					href='/dashboard/inventory/fabrics'
					className='mt-2 inline-flex items-center text-primary hover:underline'
				>
					<ArrowRight className='h-4 w-4 ml-1' />
					العودة إلى قائمة الأقمشة
				</Link>
			</div>
		);
	}

	const stockStatus = () => {
		if (fabric.quantityAvailable <= 0) {
			return { label: 'نفذت الكمية', class: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' };
		} else if (fabric.quantityAvailable < fabric.minimumStockLevel) {
			return {
				label: 'كمية منخفضة',
				class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
			};
		} else {
			return { label: 'متوفر', class: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' };
		}
	};

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col md:flex-row md:justify-between md:items-center'>
				<div>
					<div className='flex items-center mb-1'>
						<Link
							href='/dashboard/inventory/fabrics'
							className='text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light mr-2'
						>
							<ArrowRight className='h-5 w-5' />
						</Link>
						<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>{fabric.name}</h1>
						{!fabric.isActive && (
							<span className='mr-2 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'>
								غير نشط
							</span>
						)}
					</div>
					<p className='text-gray-500 dark:text-gray-400 text-sm'>رمز المنتج: {fabric.sku}</p>
				</div>

				<div className='flex mt-4 md:mt-0 space-x-3 space-x-reverse'>
					<button
						onClick={() => setAdjustingInventory(!adjustingInventory)}
						className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
					>
						<RefreshCw className='ml-1.5 -mr-1 h-4 w-4' />
						تعديل المخزون
					</button>

					<Link
						href={`/dashboard/inventory/fabrics/${fabric.id}/edit`}
						className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
					>
						<Edit className='ml-1.5 -mr-1 h-4 w-4' />
						تعديل
					</Link>

					<button className='inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800'>
						<Trash2 className='ml-1.5 -mr-1 h-4 w-4' />
						حذف
					</button>
				</div>
			</div>

			{/* نافذة تعديل المخزون */}
			{adjustingInventory && (
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-4'>
					<h3 className='text-md font-medium text-gray-800 dark:text-gray-200 mb-4'>تعديل كمية المخزون</h3>

					{adjustmentSuccess ? (
						<div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-md flex items-start'>
							<Check className='h-5 w-5 text-green-500 dark:text-green-400 ml-2 mt-0.5' />
							<div>
								<p className='text-green-800 dark:text-green-300 font-medium'>تم تحديث المخزون بنجاح</p>
								<p className='text-green-600 dark:text-green-400 text-sm'>
									الكمية الحالية: {fabric.quantityAvailable} {fabric.unit}
								</p>
							</div>
						</div>
					) : (
						<div className='space-y-4'>
							<div className='flex flex-wrap items-center gap-4'>
								<div className='w-full md:w-auto'>
									<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
										الكمية الحالية
									</label>
									<div className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
										{fabric.quantityAvailable} {fabric.unit}
									</div>
								</div>

								<div className='w-full md:w-auto flex-1'>
									<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
										تعديل الكمية
									</label>
									<div className='flex'>
										<button
											type='button'
											onClick={() => setAdjustmentQuantity(adjustmentQuantity - 1)}
											className='px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600'
										>
											<MinusCircle className='h-5 w-5' />
										</button>
										<input
											type='number'
											value={adjustmentQuantity}
											onChange={(e) => setAdjustmentQuantity(parseFloat(e.target.value) || 0)}
											className='block flex-1 py-2 px-3 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center'
										/>
										<button
											type='button'
											onClick={() => setAdjustmentQuantity(adjustmentQuantity + 1)}
											className='px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-l-md hover:bg-gray-200 dark:hover:bg-gray-600'
										>
											<PlusCircle className='h-5 w-5' />
										</button>
									</div>
									<p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
										استخدم الرقم السالب للخصم من المخزون
									</p>
								</div>

								<div className='w-full md:w-auto flex-1'>
									<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
										سبب التعديل
									</label>
									<input
										type='text'
										value={adjustmentReason}
										onChange={(e) => setAdjustmentReason(e.target.value)}
										placeholder='مثال: إضافة مشتريات جديدة، تالف، الخ'
										className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary'
									/>
								</div>
							</div>

							<div className='flex items-center justify-end space-x-3 space-x-reverse'>
								<button
									type='button'
									onClick={() => setAdjustingInventory(false)}
									className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
								>
									إلغاء
								</button>
								<button
									type='button'
									onClick={handleInventoryAdjustment}
									disabled={adjustmentQuantity === 0 || !adjustmentReason}
									className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed'
								>
									حفظ التعديل
								</button>
							</div>
						</div>
					)}
				</div>
			)}

			{/* عرض تفاصيل القماش */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* العمود الأول: الصور والتفاصيل الأساسية */}
				<div className='space-y-6'>
					{/* صور القماش */}
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
						<div className='relative h-[300px] w-full bg-gray-100 dark:bg-gray-700'>
							{fabric.images && fabric.images.length > 0 ? (
								<Image
									src={fabric.images[activeImage]}
									alt={fabric.name}
									fill
									sizes='(max-width: 768px) 100vw, 33vw'
									className='object-cover'
								/>
							) : (
								<div className='flex items-center justify-center h-full w-full'>
									<p className='text-gray-500 dark:text-gray-400'>لا توجد صور متاحة</p>
								</div>
							)}
						</div>

						{fabric.images && fabric.images.length > 1 && (
							<div className='p-2 grid grid-cols-4 gap-2'>
								{fabric.images.map((image, index) => (
									<div
										key={index}
										className={`cursor-pointer h-16 relative ${
											activeImage === index
												? 'ring-2 ring-primary dark:ring-primary-light'
												: 'border border-gray-200 dark:border-gray-700'
										}`}
										onClick={() => setActiveImage(index)}
									>
										<Image
											src={image}
											alt={`${fabric.name} - صورة ${index + 1}`}
											fill
											sizes='100px'
											className='object-cover'
										/>
									</div>
								))}
							</div>
						)}
					</div>

					{/* معلومات المورد */}
					<InfoCard title='معلومات المورد'>
						<div className='space-y-3'>
							<InfoField
								label='اسم المورد'
								value={
									<Link
										href={`/dashboard/suppliers/${fabric.supplier.id}`}
										className='text-primary dark:text-primary-light hover:underline'
									>
										{fabric.supplier.name}
									</Link>
								}
							/>

							<InfoField label='جهة الاتصال' value={fabric.supplier.contactPerson} />

							<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
								<InfoField
									label='رقم الهاتف'
									value={
										<a
											href={`tel:${fabric.supplier.phone}`}
											className='text-primary dark:text-primary-light hover:underline'
											dir='ltr'
										>
											{fabric.supplier.phone}
										</a>
									}
								/>

								<InfoField
									label='البريد الإلكتروني'
									value={
										<a
											href={`mailto:${fabric.supplier.email}`}
											className='text-primary dark:text-primary-light hover:underline'
											dir='ltr'
										>
											{fabric.supplier.email}
										</a>
									}
								/>
							</div>

							<div className='mt-2 pt-2 border-t border-gray-200 dark:border-gray-700'>
								<Link
									href={`/dashboard/suppliers/${fabric.supplier.id}`}
									className='inline-flex items-center text-sm text-primary dark:text-primary-light hover:underline'
								>
									عرض التفاصيل الكاملة للمورد
									<ArrowRight className='ml-1.5 h-4 w-4' />
								</Link>
							</div>
						</div>
					</InfoCard>
				</div>

				{/* العمود الثاني والثالث: المعلومات التفصيلية */}
				<div className='lg:col-span-2 space-y-6'>
					{/* المعلومات الأساسية */}
					<InfoCard title='نظرة عامة'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-6'>
							<div className='md:col-span-3 mb-2'>
								<h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-2'>
									{fabric.name}
								</h3>
								<p className='text-gray-700 dark:text-gray-300'>{fabric.description}</p>
							</div>

							<InfoField
								label='رمز المنتج'
								value={
									<div className='flex items-center'>
										<span dir='ltr'>{fabric.sku}</span>
										<button
											onClick={() => copyToClipboard(fabric.sku, 'sku')}
											className='mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
											title='نسخ'
										>
											{copiedField === 'sku' ? (
												<Check className='h-4 w-4 text-green-500' />
											) : (
												<Copy className='h-4 w-4' />
											)}
										</button>
									</div>
								}
							/>

							<InfoField
								label='اللون'
								value={
									<div className='flex items-center'>
										<ColorSwatch colorCode={fabric.colorCode} />
										<span>{fabric.color}</span>
									</div>
								}
							/>

							<InfoField label='المادة' value={fabric.material} />

							<InfoField label='العرض' value={`${fabric.width} سم`} />

							<InfoField label='سعر البيع' value={`${fabric.price} ر.س / ${fabric.unit}`} />

							<InfoField label='سعر التكلفة' value={`${fabric.cost} ر.س / ${fabric.unit}`} />

							<InfoField
								label='هامش الربح'
								value={`${Math.round(((fabric.price - fabric.cost) / fabric.price) * 100)}%`}
							/>

							<InfoField
								label='حالة المخزون'
								value={
									<div>
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
												stockStatus().class
											}`}
										>
											{stockStatus().label}
										</span>
										{fabric.quantityAvailable < fabric.minimumStockLevel && (
											<span className='block mt-1 text-xs text-yellow-600 dark:text-yellow-400 flex items-center'>
												<AlertTriangle className='h-3 w-3 inline-block ml-1' />
												أقل من الحد الأدنى ({fabric.minimumStockLevel} {fabric.unit})
											</span>
										)}
									</div>
								}
							/>

							<InfoField label='الكمية المتوفرة' value={`${fabric.quantityAvailable} ${fabric.unit}`} />

							<InfoField
								label='القيمة الإجمالية'
								value={`${(fabric.quantityAvailable * fabric.cost).toLocaleString()} ر.س`}
							/>
						</div>
					</InfoCard>

					{/* خصائص القماش */}
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
						<div
							className='px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center cursor-pointer'
							onClick={() => toggleSection('attributes')}
						>
							<h3 className='text-sm font-medium text-gray-700 dark:text-gray-200'>خصائص القماش</h3>
							<button className='text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400'>
								{expandedSection === 'attributes' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
							</button>
						</div>
						{expandedSection === 'attributes' && (
							<div className='p-4'>
								<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
									{Object.entries(fabric.attributes).map(([key, value]) => (
										<InfoField key={key} label={key} value={value} />
									))}
								</div>
							</div>
						)}
					</div>

					{/* سجل الشراء */}
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
						<div
							className='px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center cursor-pointer'
							onClick={() => toggleSection('purchases')}
						>
							<h3 className='text-sm font-medium text-gray-700 dark:text-gray-200'>سجل الشراء</h3>
							<button className='text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400'>
								{expandedSection === 'purchases' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
							</button>
						</div>
						{expandedSection === 'purchases' && (
							<div className='p-4'>
								{fabric.purchaseHistory.length > 0 ? (
									<div className='overflow-x-auto'>
										<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
											<thead className='bg-gray-50 dark:bg-gray-700'>
												<tr>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														التاريخ
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														الكمية
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														السعر
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														رقم الفاتورة
													</th>
												</tr>
											</thead>
											<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
												{fabric.purchaseHistory.map((purchase) => (
													<tr
														key={purchase.id}
														className='hover:bg-gray-50 dark:hover:bg-gray-700'
													>
														<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
															{purchase.date.toLocaleDateString('ar-SA')}
														</td>
														<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
															{purchase.quantity} {fabric.unit}
														</td>
														<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
															{purchase.price} ر.س
														</td>
														<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
															<Link
																href={`/dashboard/purchases/${purchase.invoiceNumber}`}
																className='text-primary dark:text-primary-light hover:underline'
															>
																{purchase.invoiceNumber}
															</Link>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								) : (
									<p className='text-gray-500 dark:text-gray-400 text-center py-4'>
										لا يوجد سجل للشراء حتى الآن
									</p>
								)}

								<div className='mt-4 text-center'>
									<Link
										href='/dashboard/inventory/purchases/new?fabric_id=f1'
										className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
									>
										<Plus className='ml-1.5 -mr-1 h-4 w-4' />
										إضافة عملية شراء جديدة
									</Link>
								</div>
							</div>
						)}
					</div>

					{/* سجل الاستخدام */}
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
						<div
							className='px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center cursor-pointer'
							onClick={() => toggleSection('usage')}
						>
							<h3 className='text-sm font-medium text-gray-700 dark:text-gray-200'>سجل الاستخدام</h3>
							<button className='text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400'>
								{expandedSection === 'usage' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
							</button>
						</div>
						{expandedSection === 'usage' && (
							<div className='p-4'>
								{fabric.usageHistory.length > 0 ? (
									<div className='overflow-x-auto'>
										<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
											<thead className='bg-gray-50 dark:bg-gray-700'>
												<tr>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														التاريخ
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														الكمية
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														الطلب
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														العميل
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														السبب
													</th>
												</tr>
											</thead>
											<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
												{fabric.usageHistory.map((usage) => (
													<tr
														key={usage.id}
														className='hover:bg-gray-50 dark:hover:bg-gray-700'
													>
														<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
															{usage.date.toLocaleDateString('ar-SA')}
														</td>
														<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
															{usage.quantity} {fabric.unit}
														</td>
														<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
															{usage.orderId ? (
																<Link
																	href={`/dashboard/orders/${usage.orderId}`}
																	className='text-primary dark:text-primary-light hover:underline'
																>
																	{usage.orderId}
																</Link>
															) : (
																<span className='text-gray-500 dark:text-gray-400'>
																	-
																</span>
															)}
														</td>
														<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
															{usage.customer || (
																<span className='text-gray-500 dark:text-gray-400'>
																	-
																</span>
															)}
														</td>
														<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
															{usage.reason}
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								) : (
									<p className='text-gray-500 dark:text-gray-400 text-center py-4'>
										لا يوجد سجل للاستخدام حتى الآن
									</p>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
