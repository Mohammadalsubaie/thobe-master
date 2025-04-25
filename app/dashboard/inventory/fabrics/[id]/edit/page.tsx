// app/dashboard/inventory/fabrics/[id]/edit/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, ArrowRight, Check, Loader2, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

// مخطط التحقق من صحة البيانات
const fabricSchema = z
	.object({
		name: z.string().min(3, { message: 'يجب أن يكون اسم القماش 3 أحرف على الأقل' }),
		sku: z.string().min(3, { message: 'يجب أن يكون رمز القماش 3 أحرف على الأقل' }),
		description: z.string().optional(),
		color: z.string().min(1, { message: 'يجب تحديد اللون' }),
		colorCode: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: 'صيغة كود اللون غير صحيحة' }),
		material: z.string().min(1, { message: 'يجب تحديد المادة' }),
		width: z.coerce.number().positive({ message: 'يجب أن يكون العرض رقمًا موجبًا' }),
		price: z.coerce.number().positive({ message: 'يجب أن يكون السعر رقمًا موجبًا' }),
		cost: z.coerce.number().positive({ message: 'يجب أن تكون التكلفة رقمًا موجبًا' }),
		unit: z.string().min(1, { message: 'يجب تحديد وحدة القياس' }),
		quantityAvailable: z.coerce.number().min(0, { message: 'يجب أن تكون الكمية المتوفرة رقمًا غير سالب' }),
		minimumStockLevel: z.coerce.number().min(0, { message: 'يجب أن يكون الحد الأدنى للمخزون رقمًا غير سالب' }),
		isActive: z.boolean(),
		supplierId: z.string().min(1, { message: 'يجب تحديد المورد' }),
		attributes: z.array(
			z.object({
				key: z.string().min(1, { message: 'يجب تحديد اسم الخاصية' }),
				value: z.string().min(1, { message: 'يجب تحديد قيمة الخاصية' }),
			})
		),
	})
	.transform((data) => ({
		...data,
		isActive: data.isActive ?? true,
	}));

type FabricFormValues = z.infer<typeof fabricSchema>;

// نوع بيانات القماش من API
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
	};
	attributes: Record<string, string>;
}

// نوع بيانات المورد
interface Supplier {
	id: string;
	name: string;
}

export default function EditFabricPage() {
	const params = useParams();
	const router = useRouter();
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [fabric, setFabric] = useState<Fabric | null>(null);
	const [images, setImages] = useState<string[]>([]);
	const [newImages, setNewImages] = useState<File[]>([]);
	const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);

	// إعداد React Hook Form
	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm<FabricFormValues>({
		resolver: zodResolver(fabricSchema),
		defaultValues: {
			name: '',
			sku: '',
			description: '',
			color: '',
			colorCode: '#000000',
			material: '',
			width: 0,
			price: 0,
			cost: 0,
			unit: 'متر',
			quantityAvailable: 0,
			minimumStockLevel: 0,
			isActive: true,
			supplierId: '',
			attributes: [],
		},
	});

	// إعداد مصفوفة الخصائص
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'attributes',
	});

	// جلب بيانات القماش والموردين
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				// في التطبيق الحقيقي، هذه ستكون استدعاءات API فعلية

				// جلب بيانات الموردين
				await new Promise((resolve) => setTimeout(resolve, 300));
				const mockSuppliers: Supplier[] = [
					{ id: 's1', name: 'شركة النسيج العالمية' },
					{ id: 's2', name: 'مصنع الأقمشة الفاخرة' },
					{ id: 's3', name: 'مؤسسة الخليج للمنسوجات' },
					{ id: 's4', name: 'شركة الحرير الذهبي' },
				];
				setSuppliers(mockSuppliers);

				// جلب بيانات القماش
				await new Promise((resolve) => setTimeout(resolve, 500));
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
					price: 120,
					cost: 80,
					unit: 'متر',
					quantityAvailable: 45.5,
					minimumStockLevel: 20,
					isActive: true,
					images: ['/images/fabrics/black-cashmere-1.jpg', '/images/fabrics/black-cashmere-2.jpg'],
					supplier: {
						id: 's1',
						name: 'شركة النسيج العالمية',
					},
					attributes: {
						'نوع النسيج': 'مخلوط',
						'وزن القماش': '280 جرام/متر مربع',
						'مقاومة للتجعد': 'عالية',
						'مقاومة للماء': 'متوسطة',
						'مناسب لـ': 'ثوب، بدلة، جاكيت',
					},
				};

				setFabric(mockFabric);
				setImages(mockFabric.images);

				// تعيين قيم النموذج
				setValue('name', mockFabric.name);
				setValue('sku', mockFabric.sku);
				setValue('description', mockFabric.description || '');
				setValue('color', mockFabric.color);
				setValue('colorCode', mockFabric.colorCode);
				setValue('material', mockFabric.material);
				setValue('width', mockFabric.width);
				setValue('price', mockFabric.price);
				setValue('cost', mockFabric.cost);
				setValue('unit', mockFabric.unit);
				setValue('quantityAvailable', mockFabric.quantityAvailable);
				setValue('minimumStockLevel', mockFabric.minimumStockLevel);
				setValue('isActive', mockFabric.isActive);
				setValue('supplierId', mockFabric.supplier.id);

				// تحويل الخصائص من كائن إلى مصفوفة للنموذج
				const attributesArray = Object.entries(mockFabric.attributes).map(([key, value]) => ({ key, value }));
				setValue('attributes', attributesArray);
			} catch (err) {
				console.error('Error fetching data:', err);
				setError('حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [params.id, setValue]);

	// معالجة إضافة صور جديدة
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const files = Array.from(e.target.files);
			setNewImages((prev) => [...prev, ...files]);

			// إنشاء URLs للمعاينة
			const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
			setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
		}
	};

	// إزالة صورة موجودة
	const removeExistingImage = (index: number) => {
		const imageToRemove = images[index];
		setImagesToDelete((prev) => [...prev, imageToRemove]);
		setImages((prev) => prev.filter((_, i) => i !== index));
	};

	// إزالة صورة جديدة
	const removeNewImage = (index: number) => {
		setNewImages((prev) => prev.filter((_, i) => i !== index));

		// تحرير عنوان المعاينة
		URL.revokeObjectURL(previewUrls[index]);
		setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
	};

	// تقديم النموذج
	const onSubmit = handleSubmit(async (data) => {
		try {
			setSubmitting(true);
			setError(null);

			console.log('Form data to submit:', data);
			console.log('New images to upload:', newImages);
			console.log('Images to delete:', imagesToDelete);

			// في التطبيق الحقيقي، هنا سيتم رفع الصور وتحديث بيانات القماش
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setSuccess(true);

			// إعادة التوجيه بعد النجاح
			setTimeout(() => {
				router.push(`/dashboard/inventory/fabrics/${params.id}`);
			}, 1500);
		} catch (err) {
			console.error('Error submitting form:', err);
			setError('حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة مرة أخرى.');
			setSubmitting(false);
		}
	});

	// حساب هامش الربح
	const calculateProfitMargin = () => {
		const price = watch('price');
		const cost = watch('cost');

		if (price && cost && price > 0) {
			return Math.round(((price - cost) / price) * 100);
		}
		return 0;
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'></div>
				<span className='mr-2 text-gray-700 dark:text-gray-300'>جاري تحميل البيانات...</span>
			</div>
		);
	}

	if (error && !fabric) {
		return (
			<div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-md'>
				<div className='text-red-700 dark:text-red-400 font-medium'>{error}</div>
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

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-wrap justify-between items-center'>
				<div>
					<div className='flex items-center mb-1'>
						<Link
							href={`/dashboard/inventory/fabrics/${params.id}`}
							className='text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light mr-2'
						>
							<ArrowRight className='h-5 w-5' />
						</Link>
						<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>
							تعديل القماش: {fabric?.name}
						</h1>
					</div>
					<p className='text-gray-500 dark:text-gray-400 text-sm'>تعديل معلومات وخصائص القماش</p>
				</div>

				<div className='flex mt-4 md:mt-0 space-x-3 space-x-reverse'>
					<Link
						href={`/dashboard/inventory/fabrics/${params.id}`}
						className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
					>
						<X className='ml-1.5 -mr-1 h-4 w-4' />
						إلغاء
					</Link>

					<button
						type='button'
						onClick={() =>
							document
								.getElementById('fabricForm')
								?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
						}
						disabled={submitting || success}
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed'
					>
						{submitting ? (
							<>
								<Loader2 className='ml-1.5 -mr-1 h-4 w-4 animate-spin' />
								جاري الحفظ...
							</>
						) : success ? (
							<>
								<Check className='ml-1.5 -mr-1 h-4 w-4' />
								تم الحفظ بنجاح
							</>
						) : (
							<>
								<Save className='ml-1.5 -mr-1 h-4 w-4' />
								حفظ التغييرات
							</>
						)}
					</button>
				</div>
			</div>

			{/* رسالة الخطأ */}
			{error && (
				<div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-md'>
					<div className='flex'>
						<AlertTriangle className='h-5 w-5 text-red-500 dark:text-red-400 ml-2' />
						<div className='text-red-700 dark:text-red-400'>{error}</div>
					</div>
				</div>
			)}

			{/* نموذج التعديل */}
			<form id='fabricForm' onSubmit={onSubmit} className='space-y-8'>
				<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
						<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>معلومات أساسية</h2>
					</div>
					<div className='p-6 space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* اسم القماش */}
							<div>
								<label
									htmlFor='name'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									اسم القماش <span className='text-red-500'>*</span>
								</label>
								<input
									id='name'
									type='text'
									{...register('name')}
									className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
								/>
								{errors.name && (
									<p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.name.message}</p>
								)}
							</div>

							{/* رمز المنتج */}
							<div>
								<label
									htmlFor='sku'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									رمز المنتج (SKU) <span className='text-red-500'>*</span>
								</label>
								<input
									id='sku'
									type='text'
									{...register('sku')}
									className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
									dir='ltr'
								/>
								{errors.sku && (
									<p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.sku.message}</p>
								)}
							</div>

							{/* وصف القماش */}
							<div className='md:col-span-2'>
								<label
									htmlFor='description'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									وصف القماش
								</label>
								<textarea
									id='description'
									rows={3}
									{...register('description')}
									className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
								></textarea>
								{errors.description && (
									<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
										{errors.description.message}
									</p>
								)}
							</div>

							{/* اللون وكود اللون */}
							<div>
								<label
									htmlFor='color'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									اللون <span className='text-red-500'>*</span>
								</label>
								<input
									id='color'
									type='text'
									{...register('color')}
									className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
								/>
								{errors.color && (
									<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
										{errors.color.message}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor='colorCode'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									كود اللون <span className='text-red-500'>*</span>
								</label>
								<div className='mt-1 flex'>
									<span className='inline-flex items-center px-3 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400'>
										<div
											className='w-4 h-4 rounded-full border border-gray-300 dark:border-gray-500'
											style={{ backgroundColor: watch('colorCode') || '#000000' }}
										/>
									</span>
									<input
										type='text'
										id='colorCode'
										{...register('colorCode')}
										className='flex-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
										dir='ltr'
									/>
								</div>
								{errors.colorCode && (
									<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
										{errors.colorCode.message}
									</p>
								)}
							</div>

							{/* المادة */}
							<div>
								<label
									htmlFor='material'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									المادة <span className='text-red-500'>*</span>
								</label>
								<input
									id='material'
									type='text'
									{...register('material')}
									className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
								/>
								{errors.material && (
									<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
										{errors.material.message}
									</p>
								)}
							</div>

							{/* المورد */}
							<div>
								<label
									htmlFor='supplierId'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									المورد <span className='text-red-500'>*</span>
								</label>
								<select
									id='supplierId'
									{...register('supplierId')}
									className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
								>
									<option value=''>اختر المورد</option>
									{suppliers.map((supplier) => (
										<option key={supplier.id} value={supplier.id}>
											{supplier.name}
										</option>
									))}
								</select>
								{errors.supplierId && (
									<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
										{errors.supplierId.message}
									</p>
								)}
							</div>

							{/* العرض */}
							<div>
								<label
									htmlFor='width'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									العرض (سم) <span className='text-red-500'>*</span>
								</label>
								<input
									id='width'
									type='number'
									step='0.1'
									min='0'
									{...register('width')}
									className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
								/>
								{errors.width && (
									<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
										{errors.width.message}
									</p>
								)}
							</div>

							{/* وحدة القياس */}
							<div>
								<label
									htmlFor='unit'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									وحدة القياس <span className='text-red-500'>*</span>
								</label>
								<select
									id='unit'
									{...register('unit')}
									className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
								>
									<option value='متر'>متر</option>
									<option value='يارد'>يارد</option>
									<option value='قطعة'>قطعة</option>
								</select>
								{errors.unit && (
									<p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.unit.message}</p>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* تفاصيل السعر والمخزون */}
				<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
						<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>السعر والمخزون</h2>
					</div>
					<div className='p-6 space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
							{/* السعر */}
							<div>
								<label
									htmlFor='price'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									سعر البيع (للوحدة) <span className='text-red-500'>*</span>
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<input
										id='price'
										type='number'
										step='0.01'
										min='0'
										{...register('price')}
										className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
									/>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<span className='text-gray-500 dark:text-gray-400'>ر.س</span>
									</div>
								</div>
								{errors.price && (
									<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
										{errors.price.message}
									</p>
								)}
							</div>

							{/* التكلفة */}
							<div>
								<label
									htmlFor='cost'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									سعر التكلفة (للوحدة) <span className='text-red-500'>*</span>
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<input
										id='cost'
										type='number'
										step='0.01'
										min='0'
										{...register('cost')}
										className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
									/>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<span className='text-gray-500 dark:text-gray-400'>ر.س</span>
									</div>
								</div>
								{errors.cost && (
									<p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.cost.message}</p>
								)}
							</div>

							{/* هامش الربح */}
							<div>
								<label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
									هامش الربح
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<input
										type='text'
										value={`${calculateProfitMargin()}%`}
										readOnly
										className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 cursor-not-allowed'
									/>
								</div>
							</div>

							{/* الكمية المتوفرة */}
							<div>
								<label
									htmlFor='quantityAvailable'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									الكمية المتوفرة <span className='text-red-500'>*</span>
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<input
										id='quantityAvailable'
										type='number'
										step='0.1'
										min='0'
										{...register('quantityAvailable')}
										className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
									/>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<span className='text-gray-500 dark:text-gray-400'>{watch('unit')}</span>
									</div>
								</div>
								{errors.quantityAvailable && (
									<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
										{errors.quantityAvailable.message}
									</p>
								)}
							</div>

							{/* الحد الأدنى للمخزون */}
							<div>
								<label
									htmlFor='minimumStockLevel'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300'
								>
									الحد الأدنى للمخزون <span className='text-red-500'>*</span>
								</label>
								<div className='mt-1 relative rounded-md shadow-sm'>
									<input
										id='minimumStockLevel'
										type='number'
										step='0.1'
										min='0'
										{...register('minimumStockLevel')}
										className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
									/>
									<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
										<span className='text-gray-500 dark:text-gray-400'>{watch('unit')}</span>
									</div>
								</div>
								{errors.minimumStockLevel && (
									<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
										{errors.minimumStockLevel.message}
									</p>
								)}
							</div>

							{/* حالة المنتج */}
							<div>
								<span className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
									حالة المنتج
								</span>
								<div className='mt-1 space-y-2'>
									<div className='flex items-center'>
										<input
											id='isActive-true'
											type='radio'
											value='true'
											{...register('isActive')}
											checked={watch('isActive') === true}
											onChange={() => setValue('isActive', true)}
											className='h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600'
										/>
										<label
											htmlFor='isActive-true'
											className='mr-2 block text-sm text-gray-700 dark:text-gray-300'
										>
											نشط (متاح للبيع)
										</label>
									</div>
									<div className='flex items-center'>
										<input
											id='isActive-false'
											type='radio'
											value='false'
											{...register('isActive')}
											checked={watch('isActive') === false}
											onChange={() => setValue('isActive', false)}
											className='h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600'
										/>
										<label
											htmlFor='isActive-false'
											className='mr-2 block text-sm text-gray-700 dark:text-gray-300'
										>
											غير نشط (غير متاح للبيع)
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* صور القماش */}
				<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
						<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>صور القماش</h2>
					</div>
					<div className='p-6'>
						<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
							{/* الصور الموجودة */}
							{images.map((image, index) => (
								<div key={`existing-${index}`} className='relative rounded-md overflow-hidden group'>
									<div className='aspect-w-1 aspect-h-1 w-full'>
										<Image
											src={image}
											alt={`${fabric?.name || 'قماش'} - صورة ${index + 1}`}
											fill
											sizes='(max-width: 768px) 50vw, 25vw'
											className='object-cover'
										/>
									</div>
									<button
										type='button'
										onClick={() => removeExistingImage(index)}
										className='absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
									>
										<Trash2 size={16} />
									</button>
								</div>
							))}

							{/* الصور الجديدة */}
							{previewUrls.map((url, index) => (
								<div key={`new-${index}`} className='relative rounded-md overflow-hidden group'>
									<div className='aspect-w-1 aspect-h-1 w-full'>
										<Image
											src={url}
											alt={`صورة جديدة ${index + 1}`}
											fill
											sizes='(max-width: 768px) 50vw, 25vw'
											className='object-cover'
										/>
									</div>
									<div className='absolute top-0 left-0 bg-green-500 text-white text-xs px-1.5 py-0.5'>
										جديد
									</div>
									<button
										type='button'
										onClick={() => removeNewImage(index)}
										className='absolute top-2 left-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
									>
										<Trash2 size={16} />
									</button>
								</div>
							))}

							{/* زر إضافة صورة */}
							<div className='relative rounded-md overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary-light'>
								<div className='aspect-w-1 aspect-h-1 w-full flex flex-col items-center justify-center p-4 text-center'>
									<Upload className='h-8 w-8 text-gray-400 dark:text-gray-500 mb-2' />
									<p className='text-sm text-gray-500 dark:text-gray-400'>انقر لإضافة صورة</p>
									<input
										type='file'
										accept='image/*'
										onChange={handleImageUpload}
										className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
									/>
								</div>
							</div>
						</div>

						<p className='mt-3 text-sm text-gray-500 dark:text-gray-400'>
							الصيغ المدعومة: JPG، PNG، GIF. الحد الأقصى لحجم الصورة: 2 ميجابايت.
						</p>
					</div>
				</div>

				{/* خصائص القماش */}
				<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
						<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>خصائص القماش</h2>
					</div>
					<div className='p-6'>
						<div className='space-y-4'>
							{fields.map((field, index) => (
								<div key={field.id} className='flex items-start space-x-2 space-x-reverse'>
									<div className='w-full'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
											<div>
												<label
													htmlFor={`attributes.${index}.key`}
													className='block text-sm font-medium text-gray-700 dark:text-gray-300'
												>
													اسم الخاصية
												</label>
												<input
													id={`attributes.${index}.key`}
													{...register(`attributes.${index}.key` as const)}
													className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												/>
												{errors.attributes?.[index]?.key && (
													<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
														{errors.attributes[index]?.key?.message}
													</p>
												)}
											</div>
											<div>
												<label
													htmlFor={`attributes.${index}.value`}
													className='block text-sm font-medium text-gray-700 dark:text-gray-300'
												>
													قيمة الخاصية
												</label>
												<input
													id={`attributes.${index}.value`}
													{...register(`attributes.${index}.value` as const)}
													className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												/>
												{errors.attributes?.[index]?.value && (
													<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
														{errors.attributes[index]?.value?.message}
													</p>
												)}
											</div>
										</div>
									</div>
									<button
										type='button'
										onClick={() => remove(index)}
										className='mt-7 p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400'
									>
										<Trash2 size={18} />
									</button>
								</div>
							))}

							<button
								type='button'
								onClick={() => append({ key: '', value: '' })}
								className='mt-2 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
							>
								<Plus className='ml-1.5 -mr-1 h-4 w-4' />
								إضافة خاصية
							</button>
						</div>
					</div>
				</div>

				{/* أزرار التحكم السفلية */}
				<div className='flex justify-end space-x-3 space-x-reverse'>
					<Link
						href={`/dashboard/inventory/fabrics/${params.id}`}
						className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
					>
						إلغاء
					</Link>

					<button
						type='submit'
						disabled={submitting || success}
						className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed'
					>
						{submitting ? (
							<>
								<Loader2 className='inline-block ml-1.5 -mr-1 h-4 w-4 animate-spin' />
								جاري الحفظ...
							</>
						) : success ? (
							<>
								<Check className='inline-block ml-1.5 -mr-1 h-4 w-4' />
								تم الحفظ بنجاح
							</>
						) : (
							<>
								<Save className='inline-block ml-1.5 -mr-1 h-4 w-4' />
								حفظ التغييرات
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
