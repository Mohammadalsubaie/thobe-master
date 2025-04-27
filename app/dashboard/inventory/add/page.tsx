// app/dashboard/inventory/add/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
	AlertTriangle,
	Archive,
	ArrowRight,
	Check,
	DollarSign,
	FileText,
	Hash,
	Loader2,
	MinusCircle,
	PackageOpen,
	PlusCircle,
	Save,
	Upload,
	X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

// مخطط التحقق من صحة البيانات
const inventoryItemSchema = z.object({
	name: z.string().min(1, { message: 'يجب إدخال اسم المنتج' }),
	category: z.string().min(1, { message: 'يجب اختيار فئة المنتج' }),
	description: z.string().optional(),
	sku: z.string().min(1, { message: 'يجب إدخال رمز المنتج' }),
	unit: z.string().min(1, { message: 'يجب اختيار وحدة القياس' }),
	purchasePrice: z
		.string()
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: 'يجب إدخال سعر شراء صحيح' }),
	sellingPrice: z
		.string()
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, { message: 'يجب إدخال سعر بيع صحيح' }),
	initialQuantity: z
		.string()
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: 'يجب إدخال كمية صحيحة' }),
	minQuantity: z
		.string()
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, { message: 'يجب إدخال حد أدنى صحيح' }),
	supplier: z.string().optional(),
	variants: z
		.array(
			z.object({
				name: z.string().min(1, { message: 'يجب إدخال اسم المتغير' }),
				value: z.string().min(1, { message: 'يجب إدخال قيمة المتغير' }),
				quantity: z
					.string()
					.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
						message: 'يجب إدخال كمية صحيحة',
					}),
			})
		)
		.optional(),
});

type InventoryItemValues = z.infer<typeof inventoryItemSchema>;

// قائمة الفئات
const categoryOptions = [
	{ id: 'fabrics', name: 'أقمشة' },
	{ id: 'threads', name: 'خيوط' },
	{ id: 'buttons', name: 'أزرار' },
	{ id: 'accessories', name: 'إكسسوارات' },
	{ id: 'tools', name: 'أدوات خياطة' },
	{ id: 'packaging', name: 'مواد تغليف' },
];

// قائمة وحدات القياس
const unitOptions = [
	{ id: 'meter', name: 'متر' },
	{ id: 'yard', name: 'ياردة' },
	{ id: 'piece', name: 'قطعة' },
	{ id: 'roll', name: 'لفة' },
	{ id: 'box', name: 'صندوق' },
	{ id: 'kg', name: 'كيلوغرام' },
	{ id: 'gram', name: 'غرام' },
	{ id: 'pack', name: 'حزمة' },
];

// قائمة الموردين
const supplierOptions = [
	{ id: 's1', name: 'شركة النسيج العالمية' },
	{ id: 's2', name: 'مؤسسة الخياط للأقمشة' },
	{ id: 's3', name: 'مصنع الأناقة للإكسسوارات' },
	{ id: 's4', name: 'مستودع الأقمشة الفاخرة' },
];

export default function AddInventoryItemPage() {
	const router = useRouter();
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const [showVariants, setShowVariants] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// إعداد React Hook Form
	const {
		register,
		handleSubmit,
		control,
		watch,
		formState: { errors },
	} = useForm<InventoryItemValues>({
		resolver: zodResolver(inventoryItemSchema),
		defaultValues: {
			name: '',
			category: '',
			description: '',
			sku: '',
			unit: '',
			purchasePrice: '',
			sellingPrice: '',
			initialQuantity: '0',
			minQuantity: '0',
			supplier: '',
			variants: [],
		},
	});

	// إعداد مصفوفة المتغيرات
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'variants',
	});

	// مراقبة قيمة وحدة القياس
	const selectedUnit = watch('unit');

	// معالجة تحميل الصورة
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			setImageFile(file);

			// إنشاء URL للمعاينة
			const url = URL.createObjectURL(file);
			setImagePreview(url);
		}
	};

	// حذف الصورة
	const handleDeleteImage = () => {
		setImagePreview(null);
		setImageFile(null);

		// إعادة تعيين قيمة حقل الملف
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
	};

	// إضافة متغير جديد
	const addVariant = () => {
		append({ name: '', value: '', quantity: '0' });
	};

	// تقديم النموذج
	const onSubmit = handleSubmit(async (data) => {
		try {
			setSubmitting(true);
			setError(null);

			console.log('Form data to submit:', data);
			console.log('Image file:', imageFile);

			// في التطبيق الحقيقي، هذا سيكون استدعاء API
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setSuccess(true);

			// إعادة التوجيه بعد النجاح
			setTimeout(() => {
				router.push('/dashboard/inventory');
			}, 1500);
		} catch (err) {
			console.error('Error submitting form:', err);
			setError('حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة مرة أخرى.');
			setSubmitting(false);
		}
	});

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-wrap justify-between items-center'>
				<div>
					<div className='flex items-center mb-1'>
						<Link
							href='/dashboard/inventory'
							className='text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light mr-2'
						>
							<ArrowRight className='h-5 w-5' />
						</Link>
						<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>إضافة عنصر للمخزون</h1>
					</div>
					<p className='text-gray-500 dark:text-gray-400 text-sm'>
						إضافة منتج جديد إلى المخزون وتحديد التفاصيل والكميات
					</p>
				</div>

				<div className='flex mt-4 md:mt-0 space-x-3 space-x-reverse'>
					<Link
						href='/dashboard/inventory'
						className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
					>
						<X className='ml-1.5 -mr-1 h-4 w-4' />
						إلغاء
					</Link>

					<button
						type='button'
						onClick={() =>
							document
								.getElementById('inventoryForm')
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
								حفظ العنصر
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

			{/* نموذج إضافة المخزون */}
			<form id='inventoryForm' onSubmit={onSubmit} className='space-y-8'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* العمود الأول: المعلومات الأساسية */}
					<div className='lg:col-span-2 space-y-6'>
						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>معلومات المنتج</h2>
							</div>
							<div className='p-6 space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									{/* اسم المنتج */}
									<div className='md:col-span-2'>
										<label
											htmlFor='name'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											اسم المنتج <span className='text-red-500'>*</span>
										</label>
										<div className='mt-1 relative rounded-md shadow-sm'>
											<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
												<PackageOpen className='h-5 w-5 text-gray-400 dark:text-gray-500' />
											</div>
											<input
												id='name'
												type='text'
												{...register('name')}
												className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												placeholder='أدخل اسم المنتج هنا'
											/>
										</div>
										{errors.name && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.name.message}
											</p>
										)}
									</div>

									{/* فئة المنتج */}
									<div>
										<label
											htmlFor='category'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											الفئة <span className='text-red-500'>*</span>
										</label>
										<select
											id='category'
											{...register('category')}
											className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
										>
											<option value=''>اختر فئة المنتج</option>
											{categoryOptions.map((category) => (
												<option key={category.id} value={category.id}>
													{category.name}
												</option>
											))}
										</select>
										{errors.category && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.category.message}
											</p>
										)}
									</div>

									{/* رمز المنتج (SKU) */}
									<div>
										<label
											htmlFor='sku'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											رمز المنتج (SKU) <span className='text-red-500'>*</span>
										</label>
										<div className='mt-1 relative rounded-md shadow-sm'>
											<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
												<Hash className='h-5 w-5 text-gray-400 dark:text-gray-500' />
											</div>
											<input
												id='sku'
												type='text'
												{...register('sku')}
												className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												placeholder='مثال: FB-123'
											/>
										</div>
										{errors.sku && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.sku.message}
											</p>
										)}
									</div>

									{/* وحدة القياس */}
									<div>
										<label
											htmlFor='unit'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											وحدة القياس <span className='text-red-500'>*</span>
										</label>
										<select
											id='unit'
											{...register('unit')}
											className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
										>
											<option value=''>اختر وحدة القياس</option>
											{unitOptions.map((unit) => (
												<option key={unit.id} value={unit.id}>
													{unit.name}
												</option>
											))}
										</select>
										{errors.unit && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.unit.message}
											</p>
										)}
									</div>

									{/* سعر الشراء */}
									<div>
										<label
											htmlFor='purchasePrice'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											سعر الشراء <span className='text-red-500'>*</span>
										</label>
										<div className='mt-1 relative rounded-md shadow-sm'>
											<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
												<DollarSign className='h-5 w-5 text-gray-400 dark:text-gray-500' />
											</div>
											<input
												id='purchasePrice'
												type='text'
												{...register('purchasePrice')}
												className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100 ltr:text-left rtl:text-right'
												placeholder='0.00'
												dir='ltr'
											/>
											<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
												<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>ر.س</span>
											</div>
										</div>
										{errors.purchasePrice && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.purchasePrice.message}
											</p>
										)}
									</div>

									{/* سعر البيع */}
									<div>
										<label
											htmlFor='sellingPrice'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											سعر البيع <span className='text-red-500'>*</span>
										</label>
										<div className='mt-1 relative rounded-md shadow-sm'>
											<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
												<DollarSign className='h-5 w-5 text-gray-400 dark:text-gray-500' />
											</div>
											<input
												id='sellingPrice'
												type='text'
												{...register('sellingPrice')}
												className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100 ltr:text-left rtl:text-right'
												placeholder='0.00'
												dir='ltr'
											/>
											<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
												<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>ر.س</span>
											</div>
										</div>
										{errors.sellingPrice && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.sellingPrice.message}
											</p>
										)}
									</div>

									{/* المورد */}
									<div>
										<label
											htmlFor='supplier'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											المورد
										</label>
										<select
											id='supplier'
											{...register('supplier')}
											className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
										>
											<option value=''>اختر المورد</option>
											{supplierOptions.map((supplier) => (
												<option key={supplier.id} value={supplier.id}>
													{supplier.name}
												</option>
											))}
										</select>
										{errors.supplier && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.supplier.message}
											</p>
										)}
									</div>

									{/* وصف المنتج */}
									<div className='md:col-span-2'>
										<label
											htmlFor='description'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											وصف المنتج
										</label>
										<textarea
											id='description'
											{...register('description')}
											rows={3}
											className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
											placeholder='أدخل وصفاً للمنتج هنا'
										></textarea>
									</div>
								</div>
							</div>
						</div>

						{/* قسم الكميات والمخزون */}
						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
									الكميات والمخزون
								</h2>
							</div>
							<div className='p-6 space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									{/* الكمية الأولية */}
									<div>
										<label
											htmlFor='initialQuantity'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											الكمية الأولية <span className='text-red-500'>*</span>
										</label>
										<div className='mt-1 relative rounded-md shadow-sm'>
											<input
												id='initialQuantity'
												type='text'
												{...register('initialQuantity')}
												className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100 ltr:text-left rtl:text-right'
												dir='ltr'
											/>
											{selectedUnit && (
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
														{unitOptions.find((u) => u.id === selectedUnit)?.name || ''}
													</span>
												</div>
											)}
										</div>
										{errors.initialQuantity && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.initialQuantity.message}
											</p>
										)}
									</div>

									{/* الحد الأدنى للكمية */}
									<div>
										<label
											htmlFor='minQuantity'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											الحد الأدنى للمخزون <span className='text-red-500'>*</span>
										</label>
										<div className='mt-1 relative rounded-md shadow-sm'>
											<input
												id='minQuantity'
												type='text'
												{...register('minQuantity')}
												className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100 ltr:text-left rtl:text-right'
												dir='ltr'
											/>
											{selectedUnit && (
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
														{unitOptions.find((u) => u.id === selectedUnit)?.name || ''}
													</span>
												</div>
											)}
										</div>
										<p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
											سيتم تنبيهك عندما تصل الكمية إلى هذا الحد
										</p>
										{errors.minQuantity && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.minQuantity.message}
											</p>
										)}
									</div>
								</div>

								{/* المتغيرات */}
								<div className='pt-4'>
									<div className='flex items-center justify-between mb-4'>
										<div className='flex items-center'>
											<label
												htmlFor='showVariants'
												className='mr-3 text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												هل يحتوي المنتج على متغيرات؟
											</label>
											<button
												type='button'
												id='showVariants'
												onClick={() => setShowVariants(!showVariants)}
												className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
													showVariants ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
												}`}
											>
												<span className='sr-only'>تفعيل المتغيرات</span>
												<span
													className={`pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
														showVariants
															? 'translate-x-5 rtl:-translate-x-5'
															: 'translate-x-0'
													}`}
												></span>
											</button>
										</div>

										{showVariants && (
											<button
												type='button'
												onClick={addVariant}
												className='inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
											>
												<PlusCircle className='ml-1.5 -mr-1 h-4 w-4 text-gray-400 dark:text-gray-500' />
												إضافة متغير جديد
											</button>
										)}
									</div>

									{showVariants && (
										<div className='space-y-4 mt-4'>
											{fields.length === 0 ? (
												<div className='text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg'>
													<Archive className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' />
													<h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
														لا توجد متغيرات
													</h3>
													<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
														أضف متغيرات للمنتج مثل اللون، الحجم، النوع إلخ.
													</p>
													<div className='mt-4'>
														<button
															type='button'
															onClick={addVariant}
															className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-primary-700 dark:text-primary-300 bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 focus:outline-none'
														>
															<PlusCircle className='ml-1.5 -mr-0.5 h-4 w-4' />
															إضافة متغير
														</button>
													</div>
												</div>
											) : (
												<div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4'>
													<div className='space-y-4'>
														{fields.map((field, index) => (
															<div
																key={field.id}
																className='flex items-start space-x-4 space-x-reverse'
															>
																<div className='flex-1 grid grid-cols-1 md:grid-cols-3 gap-4'>
																	<div>
																		<label
																			htmlFor={`variants.${index}.name`}
																			className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'
																		>
																			اسم المتغير{' '}
																			<span className='text-red-500'>*</span>
																		</label>
																		<input
																			id={`variants.${index}.name`}
																			type='text'
																			{...register(
																				`variants.${index}.name` as const
																			)}
																			placeholder='مثال: اللون، الحجم'
																			className='block w-full py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100 text-sm'
																		/>
																		{errors.variants?.[index]?.name && (
																			<p className='mt-1 text-xs text-red-600 dark:text-red-400'>
																				{errors.variants[index]?.name?.message}
																			</p>
																		)}
																	</div>

																	<div>
																		<label
																			htmlFor={`variants.${index}.value`}
																			className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'
																		>
																			قيمة المتغير{' '}
																			<span className='text-red-500'>*</span>
																		</label>
																		<input
																			id={`variants.${index}.value`}
																			type='text'
																			{...register(
																				`variants.${index}.value` as const
																			)}
																			placeholder='مثال: أحمر، XL'
																			className='block w-full py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100 text-sm'
																		/>
																		{errors.variants?.[index]?.value && (
																			<p className='mt-1 text-xs text-red-600 dark:text-red-400'>
																				{errors.variants[index]?.value?.message}
																			</p>
																		)}
																	</div>

																	<div>
																		<label
																			htmlFor={`variants.${index}.quantity`}
																			className='block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1'
																		>
																			الكمية{' '}
																			<span className='text-red-500'>*</span>
																		</label>
																		<div className='relative'>
																			<input
																				id={`variants.${index}.quantity`}
																				type='text'
																				{...register(
																					`variants.${index}.quantity` as const
																				)}
																				className='block w-full py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100 text-sm ltr:text-left rtl:text-right'
																				dir='ltr'
																			/>
																			{selectedUnit && (
																				<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
																					<span className='text-gray-500 dark:text-gray-400 text-xs'>
																						{unitOptions.find(
																							(u) => u.id === selectedUnit
																						)?.name || ''}
																					</span>
																				</div>
																			)}
																		</div>
																		{errors.variants?.[index]?.quantity && (
																			<p className='mt-1 text-xs text-red-600 dark:text-red-400'>
																				{
																					errors.variants[index]?.quantity
																						?.message
																				}
																			</p>
																		)}
																	</div>
																</div>

																<button
																	type='button'
																	onClick={() => remove(index)}
																	className='inline-flex items-center p-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none'
																>
																	<MinusCircle className='h-4 w-4 text-red-500 dark:text-red-400' />
																</button>
															</div>
														))}
													</div>

													<div className='mt-4 flex justify-end'>
														<button
															type='button'
															onClick={addVariant}
															className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
														>
															<PlusCircle className='ml-1.5 -mr-1 h-4 w-4 text-gray-400 dark:text-gray-500' />
															إضافة متغير آخر
														</button>
													</div>
												</div>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* العمود الثاني: الصورة والمرفقات */}
					<div className='space-y-6'>
						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>صورة المنتج</h2>
							</div>
							<div className='p-6'>
								<div className='mb-4'>
									<div className='flex justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 pt-5 pb-6'>
										<div className='space-y-1 text-center'>
											{!imagePreview ? (
												<>
													<div className='mx-auto h-24 w-24 text-gray-400 dark:text-gray-500'>
														<PackageOpen className='mx-auto h-12 w-12' />
														<div className='flex text-sm text-gray-600 dark:text-gray-400 mt-4'>
															<label
																htmlFor='image-upload'
																className='relative cursor-pointer rounded-md bg-white dark:bg-gray-700 font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary dark:focus:within:ring-offset-gray-800'
															>
																<span>تحميل صورة</span>
																<input
																	ref={fileInputRef}
																	id='image-upload'
																	name='image-upload'
																	type='file'
																	className='sr-only'
																	onChange={handleImageUpload}
																	accept='image/*'
																/>
															</label>
															<p className='pr-1'>أو سحب وإفلات</p>
														</div>
													</div>
													<p className='text-xs text-gray-500 dark:text-gray-400'>
														PNG, JPG, GIF حتى 5MB
													</p>
												</>
											) : (
												<div className='relative'>
													<div className='h-48 w-48 mx-auto relative rounded-md overflow-hidden'>
														<Image
															src={imagePreview}
															alt='صورة المنتج'
															layout='fill'
															objectFit='contain'
														/>
													</div>
													<button
														type='button'
														onClick={handleDeleteImage}
														className='absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700 focus:outline-none'
													>
														<X className='h-4 w-4' />
													</button>
													<button
														type='button'
														onClick={() => fileInputRef.current?.click()}
														className='mt-4 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
													>
														<Upload className='ml-1.5 -mr-1 h-4 w-4' />
														تغيير الصورة
													</button>
													<input
														ref={fileInputRef}
														id='image-upload'
														name='image-upload'
														type='file'
														className='sr-only'
														onChange={handleImageUpload}
														accept='image/*'
													/>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>مستندات إضافية</h2>
							</div>
							<div className='p-6'>
								<div className='mb-4'>
									<div className='flex justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 pt-5 pb-6'>
										<div className='space-y-1 text-center'>
											<div className='mx-auto h-24 w-24 text-gray-400 dark:text-gray-500'>
												<FileText className='mx-auto h-12 w-12' />
												<div className='flex text-sm text-gray-600 dark:text-gray-400 mt-4'>
													<label
														htmlFor='file-upload'
														className='relative cursor-pointer rounded-md bg-white dark:bg-gray-700 font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary dark:focus:within:ring-offset-gray-800'
													>
														<span>تحميل ملفات</span>
														<input
															id='file-upload'
															name='file-upload'
															type='file'
															className='sr-only'
															multiple
														/>
													</label>
													<p className='pr-1'>أو سحب وإفلات</p>
												</div>
											</div>
											<p className='text-xs text-gray-500 dark:text-gray-400'>
												PDF, DOCX حتى 10MB
											</p>
										</div>
									</div>
								</div>
								<p className='text-sm text-gray-500 dark:text-gray-400 mt-2'>
									يمكنك تحميل مرفقات إضافية مثل دليل الاستخدام، كتالوجات، شهادات الجودة، وغيرها.
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* أزرار التحكم السفلية */}
				<div className='flex justify-end space-x-3 space-x-reverse'>
					<Link
						href='/dashboard/inventory'
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
								حفظ العنصر
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
