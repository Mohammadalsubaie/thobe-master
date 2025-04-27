// app/dashboard/suppliers/purchase-orders/new/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import {
	AlertTriangle,
	ArrowRight,
	Calendar,
	CheckCircle,
	CreditCard,
	FileText,
	Loader2,
	MinusCircle,
	Package,
	Plus,
	ShoppingBag,
	Trash2,
	Truck,
	X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

// مخطط التحقق من الحقول
const purchaseOrderSchema = z.object({
	supplier: z.string().min(1, { message: 'يجب اختيار المورد' }),
	poNumber: z.string().min(1, { message: 'يجب إدخال رقم طلب الشراء' }),
	orderDate: z.string().min(1, { message: 'يجب تحديد تاريخ الطلب' }),
	expectedDeliveryDate: z.string().min(1, { message: 'يجب تحديد تاريخ التسليم المتوقع' }),
	deliveryMethod: z.string().min(1, { message: 'يجب اختيار طريقة التسليم' }),
	paymentMethod: z.string().min(1, { message: 'يجب اختيار طريقة الدفع' }),
	paymentTerms: z.string().optional(),
	shippingAddress: z.string().min(1, { message: 'يجب إدخال عنوان التسليم' }),
	items: z
		.array(
			z.object({
				productId: z.string().min(1, { message: 'يجب اختيار المنتج' }),
				productName: z.string().min(1, { message: 'يجب إدخال اسم المنتج' }),
				quantity: z.coerce.number(),
				unit: z.string(),
				unitPrice: z.coerce.number(),
				discount: z.coerce.number(),
				totalPrice: z.coerce.number(),
			})
		)
		.min(1, { message: 'يجب إضافة عنصر واحد على الأقل' }),
	subtotal: z.number(),
	discount: z.number(),
	tax: z.number(),
	shipping: z.number(),
	total: z.number(),
	notes: z.string().optional(),
});

// نوع البيانات المستخرج من المخطط
type PurchaseOrderFormValues = z.infer<typeof purchaseOrderSchema>;

export default function NewPurchaseOrderPage() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [suppliers, setSuppliers] = useState<any[]>([]);
	const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null);
	const [products, setProducts] = useState<any[]>([]);
	const [isLoadingProducts, setIsLoadingProducts] = useState(false);

	// استخدام React Hook Form مع Zod
	const {
		register,
		handleSubmit,
		control,
		setValue,
		watch,
		formState: { errors },
	} = useForm<PurchaseOrderFormValues>({
		resolver: zodResolver(purchaseOrderSchema),
		defaultValues: {
			supplier: '',
			poNumber: `PO-${Math.floor(100000 + Math.random() * 900000)}`,
			orderDate: format(new Date(), 'yyyy-MM-dd'),
			expectedDeliveryDate: '',
			deliveryMethod: '',
			paymentMethod: '',
			paymentTerms: '',
			shippingAddress: '',
			items: [
				{
					productId: '',
					productName: '',
					quantity: 1,
					unit: '',
					unitPrice: 0,
					discount: 0,
					totalPrice: 0,
				},
			],
			subtotal: 0,
			discount: 0,
			tax: 0,
			shipping: 0,
			total: 0,
			notes: '',
		},
	});

	// إدارة مصفوفة العناصر
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'items',
	});

	const watchedItems = watch('items');
	const watchedSupplier = watch('supplier');

	// جلب قائمة الموردين
	useEffect(() => {
		// محاكاة استجابة API
		setTimeout(() => {
			setSuppliers([
				{ id: 'S001', name: 'شركة النسيج العالمية', category: 'أقمشة' },
				{ id: 'S002', name: 'مؤسسة الخياط للأقمشة', category: 'أقمشة' },
				{ id: 'S003', name: 'مصنع الأناقة للإكسسوارات', category: 'إكسسوارات' },
				{ id: 'S004', name: 'مستودع الأقمشة الفاخرة', category: 'أقمشة' },
			]);
		}, 500);
	}, []);

	// جلب تفاصيل المورد والمنتجات المتاحة عند اختيار المورد
	useEffect(() => {
		if (!watchedSupplier) return;

		setIsLoadingProducts(true);

		// محاكاة استجابة API
		setTimeout(() => {
			const supplier = suppliers.find((s) => s.id === watchedSupplier);
			setSelectedSupplier(supplier);

			// تجهيز قائمة المنتجات الخاصة بالمورد
			const supplierProducts = [
				{ id: 'P001', name: 'قماش قطني', category: 'أقمشة', unit: 'متر', price: 25, minOrder: 10 },
				{ id: 'P002', name: 'قماش حرير', category: 'أقمشة', unit: 'متر', price: 50, minOrder: 5 },
				{ id: 'P003', name: 'خيط قطني', category: 'خيوط', unit: 'لفة', price: 15, minOrder: 3 },
				{ id: 'P004', name: 'أزرار بلاستيكية', category: 'إكسسوارات', unit: 'حزمة', price: 10, minOrder: 5 },
				{ id: 'P005', name: 'أزرار معدنية', category: 'إكسسوارات', unit: 'حزمة', price: 20, minOrder: 2 },
			];

			setProducts(supplierProducts);
			setValue('shippingAddress', 'الرياض، حي السليمانية، شارع التحلية - مصنع النهضة للخياطة');
			setIsLoadingProducts(false);
		}, 800);
	}, [watchedSupplier, suppliers, setValue]);

	// حساب المجاميع عند تغيير العناصر
	useEffect(() => {
		if (!watchedItems) return;

		// حساب المجموع الفرعي
		const subtotal = watchedItems.reduce((sum, item) => {
			const itemTotal = Number(item.quantity) * Number(item.unitPrice) - Number(item.discount);
			return sum + itemTotal;
		}, 0);

		// تحديث المجاميع
		setValue('subtotal', subtotal);

		// حساب القيمة المضافة (15%)
		const tax = subtotal * 0.15;
		setValue('tax', tax);

		// مصاريف الشحن (ثابتة للمثال)
		const shipping = subtotal > 0 ? 50 : 0;
		setValue('shipping', shipping);

		// الخصم العام (ثابت للمثال)
		const discount = 0;
		setValue('discount', discount);

		// المجموع النهائي
		const total = subtotal + tax + shipping - discount;
		setValue('total', total);
	}, [watchedItems, setValue]);

	// تقديم النموذج
	const onSubmit = handleSubmit(async (data) => {
		setIsSubmitting(true);
		setError(null);

		try {
			// هنا يتم إرسال البيانات إلى API
			console.log('Form data:', data);

			// محاكاة طلب API
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setSuccess(true);
			setIsSubmitting(false);

			// إعادة التوجيه بعد النجاح
			setTimeout(() => {
				window.location.href = '/dashboard/suppliers/purchase-orders';
			}, 2000);
		} catch (err) {
			console.error('Error submitting form:', err);
			setError('حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة مرة أخرى.');
			setIsSubmitting(false);
		}
	});

	// إضافة عنصر جديد
	const addItem = () => {
		append({
			productId: '',
			productName: '',
			quantity: 1,
			unit: '',
			unitPrice: 0,
			discount: 0,
			totalPrice: 0,
		});
	};

	// تحديث اسم المنتج ووحدة القياس والسعر عند اختياره
	const handleProductChange = (index: number, productId: string) => {
		const product = products.find((p) => p.id === productId);
		if (product) {
			setValue(`items.${index}.productName`, product.name);
			setValue(`items.${index}.unit`, product.unit);
			setValue(`items.${index}.unitPrice`, product.price.toString());

			// حساب السعر الإجمالي للعنصر
			const quantity = Number(watchedItems[index].quantity) || 0;
			const unitPrice = product.price;
			const discount = Number(watchedItems[index].discount) || 0;
			const totalPrice = quantity * unitPrice - discount;

			setValue(`items.${index}.totalPrice`, totalPrice);
		}
	};

	// تحديث السعر الإجمالي عند تغيير الكمية أو السعر أو الخصم
	const updateItemTotal = (index: number) => {
		const quantity = Number(watchedItems[index].quantity) || 0;
		const unitPrice = Number(watchedItems[index].unitPrice) || 0;
		const discount = Number(watchedItems[index].discount) || 0;
		const totalPrice = quantity * unitPrice - discount;

		setValue(`items.${index}.totalPrice`, totalPrice);
	};

	// قوائم الخيارات
	const deliveryMethods = [
		{ id: 'pickup', name: 'استلام من المورد' },
		{ id: 'supplier-delivery', name: 'توصيل بواسطة المورد' },
		{ id: 'shipping', name: 'شحن عن طريق شركة' },
	];

	const paymentMethods = [
		{ id: 'bank', name: 'تحويل بنكي' },
		{ id: 'credit', name: 'بطاقة ائتمان' },
		{ id: 'cash', name: 'نقدي' },
		{ id: 'check', name: 'شيك' },
	];

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-wrap justify-between items-center'>
				<div>
					<div className='flex items-center mb-1'>
						<Link
							href='/dashboard/suppliers/purchase-orders'
							className='text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ml-2'
						>
							<ArrowRight className='h-5 w-5' />
						</Link>
						<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>إنشاء طلب شراء جديد</h1>
					</div>
					<p className='text-gray-500 dark:text-gray-400 text-sm'>إنشاء طلب شراء جديد وإرساله إلى المورد</p>
				</div>

				<div className='flex mt-4 sm:mt-0 space-x-3 space-x-reverse'>
					<Link
						href='/dashboard/suppliers/purchase-orders'
						className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
					>
						<X className='ml-1.5 -mr-1 h-5 w-5' />
						إلغاء
					</Link>

					<button
						type='button'
						onClick={() =>
							document
								.getElementById('purchaseOrderForm')
								?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
						}
						disabled={isSubmitting || success}
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed'
					>
						{isSubmitting ? (
							<>
								<Loader2 className='ml-1.5 -mr-1 h-5 w-5 animate-spin' />
								جاري الحفظ...
							</>
						) : success ? (
							<>
								<CheckCircle className='ml-1.5 -mr-1 h-5 w-5' />
								تم إنشاء الطلب
							</>
						) : (
							<>
								<ShoppingBag className='ml-1.5 -mr-1 h-5 w-5' />
								إنشاء طلب الشراء
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

			{/* نموذج طلب الشراء */}
			<form id='purchaseOrderForm' onSubmit={onSubmit} className='space-y-8'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* العمود الأول والثاني: المعلومات الأساسية */}
					<div className='lg:col-span-2 space-y-6'>
						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
									معلومات طلب الشراء
								</h2>
							</div>
							<div className='p-6 space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									{/* اختيار المورد */}
									<div className='md:col-span-2'>
										<label
											htmlFor='supplier'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											المورد <span className='text-red-500'>*</span>
										</label>
										<select
											id='supplier'
											{...register('supplier')}
											className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
										>
											<option value=''>اختر المورد</option>
											{suppliers.map((supplier) => (
												<option key={supplier.id} value={supplier.id}>
													{supplier.name} - {supplier.category}
												</option>
											))}
										</select>
										{errors.supplier && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.supplier.message}
											</p>
										)}
									</div>

									{/* رقم طلب الشراء */}
									<div>
										<label
											htmlFor='poNumber'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											رقم طلب الشراء <span className='text-red-500'>*</span>
										</label>
										<input
											id='poNumber'
											type='text'
											readOnly
											{...register('poNumber')}
											className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-600'
										/>
										{errors.poNumber && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.poNumber.message}
											</p>
										)}
									</div>

									{/* تاريخ الطلب */}
									<div>
										<label
											htmlFor='orderDate'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											تاريخ الطلب <span className='text-red-500'>*</span>
										</label>
										<div className='mt-1 relative rounded-md shadow-sm'>
											<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
												<Calendar className='h-5 w-5 text-gray-400 dark:text-gray-500' />
											</div>
											<input
												id='orderDate'
												type='date'
												{...register('orderDate')}
												className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
											/>
										</div>
										{errors.orderDate && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.orderDate.message}
											</p>
										)}
									</div>

									{/* تاريخ التسليم المتوقع */}
									<div>
										<label
											htmlFor='expectedDeliveryDate'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											تاريخ التسليم المتوقع <span className='text-red-500'>*</span>
										</label>
										<div className='mt-1 relative rounded-md shadow-sm'>
											<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
												<Calendar className='h-5 w-5 text-gray-400 dark:text-gray-500' />
											</div>
											<input
												id='expectedDeliveryDate'
												type='date'
												{...register('expectedDeliveryDate')}
												className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
											/>
										</div>
										{errors.expectedDeliveryDate && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.expectedDeliveryDate.message}
											</p>
										)}
									</div>

									{/* طريقة التسليم */}
									<div>
										<label
											htmlFor='deliveryMethod'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											طريقة التسليم <span className='text-red-500'>*</span>
										</label>
										<div className='mt-1 relative rounded-md shadow-sm'>
											<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
												<Truck className='h-5 w-5 text-gray-400 dark:text-gray-500' />
											</div>
											<select
												id='deliveryMethod'
												{...register('deliveryMethod')}
												className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
											>
												<option value=''>اختر طريقة التسليم</option>
												{deliveryMethods.map((method) => (
													<option key={method.id} value={method.id}>
														{method.name}
													</option>
												))}
											</select>
										</div>
										{errors.deliveryMethod && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.deliveryMethod.message}
											</p>
										)}
									</div>

									{/* طريقة الدفع */}
									<div>
										<label
											htmlFor='paymentMethod'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											طريقة الدفع <span className='text-red-500'>*</span>
										</label>
										<div className='mt-1 relative rounded-md shadow-sm'>
											<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
												<CreditCard className='h-5 w-5 text-gray-400 dark:text-gray-500' />
											</div>
											<select
												id='paymentMethod'
												{...register('paymentMethod')}
												className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
											>
												<option value=''>اختر طريقة الدفع</option>
												{paymentMethods.map((method) => (
													<option key={method.id} value={method.id}>
														{method.name}
													</option>
												))}
											</select>
										</div>
										{errors.paymentMethod && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.paymentMethod.message}
											</p>
										)}
									</div>

									{/* شروط الدفع */}
									<div>
										<label
											htmlFor='paymentTerms'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											شروط الدفع
										</label>
										<input
											id='paymentTerms'
											type='text'
											{...register('paymentTerms')}
											className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
											placeholder='مثال: دفع 50% مقدمًا، 50% بعد التسليم'
										/>
									</div>

									{/* عنوان التسليم */}
									<div className='md:col-span-2'>
										<label
											htmlFor='shippingAddress'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											عنوان التسليم <span className='text-red-500'>*</span>
										</label>
										<textarea
											id='shippingAddress'
											{...register('shippingAddress')}
											rows={2}
											className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
											placeholder='أدخل عنوان التسليم بالتفصيل'
										></textarea>
										{errors.shippingAddress && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.shippingAddress.message}
											</p>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* عناصر الطلب */}
						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>عناصر الطلب</h2>
								<button
									type='button'
									onClick={addItem}
									className='inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
								>
									<Plus className='ml-1.5 -mr-1 h-4 w-4 text-gray-400 dark:text-gray-500' />
									إضافة عنصر
								</button>
							</div>
							<div className='p-6'>
								{isLoadingProducts && !selectedSupplier ? (
									<div className='flex justify-center items-center h-32'>
										<Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
										<p className='text-gray-500 dark:text-gray-400 mr-3'>جاري تحميل المنتجات...</p>
									</div>
								) : !selectedSupplier ? (
									<div className='text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg'>
										<FileText className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' />
										<h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
											لم يتم اختيار المورد
										</h3>
										<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
											يرجى اختيار المورد أولاً لعرض المنتجات المتاحة
										</p>
									</div>
								) : (
									<div className='space-y-4'>
										{fields.map((field, index) => (
											<div
												key={field.id}
												className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg relative'
											>
												<button
													type='button'
													onClick={() => remove(index)}
													className='absolute left-2 top-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400'
												>
													<Trash2 className='h-5 w-5' />
												</button>

												<div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
													{/* المنتج */}
													<div className='md:col-span-2'>
														<label
															htmlFor={`items.${index}.productId`}
															className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
														>
															المنتج <span className='text-red-500'>*</span>
														</label>
														<select
															id={`items.${index}.productId`}
															{...register(`items.${index}.productId` as const)}
															onChange={(e) => handleProductChange(index, e.target.value)}
															className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
														>
															<option value=''>اختر المنتج</option>
															{products.map((product) => (
																<option key={product.id} value={product.id}>
																	{product.name} - {product.category}
																</option>
															))}
														</select>
														{errors.items?.[index]?.productId && (
															<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
																{errors.items[index]?.productId?.message}
															</p>
														)}
													</div>

													{/* الكمية */}
													<div>
														<label
															htmlFor={`items.${index}.quantity`}
															className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
														>
															الكمية <span className='text-red-500'>*</span>
														</label>
														<input
															id={`items.${index}.quantity`}
															type='number'
															min='1'
															{...register(`items.${index}.quantity` as const)}
															onChange={(e) => {
																setValue(
																	`items.${index}.quantity`,
																	Number(e.target.value)
																);
																updateItemTotal(index);
															}}
															className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
														/>
													</div>

													{/* الوحدة (تلقائي بناءً على المنتج) */}
													<div>
														<label
															htmlFor={`items.${index}.unit`}
															className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
														>
															الوحدة
														</label>
														<input
															id={`items.${index}.unit`}
															type='text'
															{...register(`items.${index}.unit` as const)}
															readOnly
															className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-600'
														/>
													</div>

													{/* سعر الوحدة */}
													<div>
														<label
															htmlFor={`items.${index}.unitPrice`}
															className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
														>
															سعر الوحدة
														</label>
														<div className='mt-1 relative rounded-md shadow-sm'>
															<input
																id={`items.${index}.unitPrice`}
																type='number'
																step='0.01'
																min='0'
																{...register(`items.${index}.unitPrice` as const)}
																onChange={(e) => {
																	setValue(
																		`items.${index}.unitPrice`,
																		Number(e.target.value)
																	);
																	updateItemTotal(index);
																}}
																className='block w-full pr-3 pl-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
															/>
															<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
																<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
																	ر.س
																</span>
															</div>
														</div>
													</div>

													{/* الخصم */}
													<div>
														<label
															htmlFor={`items.${index}.discount`}
															className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
														>
															الخصم
														</label>
														<div className='mt-1 relative rounded-md shadow-sm'>
															<input
																id={`items.${index}.discount`}
																type='number'
																step='0.01'
																min='0'
																{...register(`items.${index}.discount` as const)}
																onChange={(e) => {
																	setValue(
																		`items.${index}.discount`,
																		Number(e.target.value)
																	);
																	updateItemTotal(index);
																}}
																className='block w-full pr-3 pl-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
															/>
															<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
																<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
																	ر.س
																</span>
															</div>
														</div>
													</div>

													{/* الإجمالي */}
													<div>
														<label
															htmlFor={`items.${index}.totalPrice`}
															className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
														>
															الإجمالي
														</label>
														<div className='mt-1 relative rounded-md shadow-sm'>
															<input
																id={`items.${index}.totalPrice`}
																type='number'
																step='0.01'
																readOnly
																{...register(`items.${index}.totalPrice` as const)}
																className='block w-full pr-3 pl-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 bg-gray-100 dark:bg-gray-600'
															/>
															<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
																<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
																	ر.س
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										))}

										{fields.length === 0 && (
											<div className='text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg'>
												<Package className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' />
												<h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
													لا توجد عناصر
												</h3>
												<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
													قم بإضافة العناصر التي ترغب في طلبها من المورد
												</p>
												<div className='mt-4'>
													<button
														type='button'
														onClick={addItem}
														className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 focus:outline-none'
													>
														<Plus className='ml-1.5 -mr-0.5 h-4 w-4' />
														إضافة عنصر
													</button>
												</div>
											</div>
										)}

										{errors.items && !Array.isArray(errors.items) && (
											<p className='mt-2 text-sm text-red-600 dark:text-red-400'>
												{errors.items.message}
											</p>
										)}

										{/* أزرار إضافة وحذف العناصر */}
										{fields.length > 0 && (
											<div className='flex justify-between pt-2'>
												<button
													type='button'
													onClick={addItem}
													className='inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none'
												>
													<Plus className='ml-1 h-4 w-4' />
													إضافة عنصر آخر
												</button>

												<button
													type='button'
													onClick={() => fields.length > 0 && remove(fields.length - 1)}
													className='inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none'
												>
													<MinusCircle className='ml-1 h-4 w-4' />
													حذف آخر عنصر
												</button>
											</div>
										)}
									</div>
								)}
							</div>
						</div>

						{/* ملاحظات الطلب */}
						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>ملاحظات إضافية</h2>
							</div>
							<div className='p-6'>
								<div>
									<label
										htmlFor='notes'
										className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
									>
										ملاحظات حول الطلب
									</label>
									<textarea
										id='notes'
										{...register('notes')}
										rows={4}
										className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
										placeholder='أضف أي ملاحظات إضافية للمورد حول هذا الطلب'
									></textarea>
								</div>
							</div>
						</div>
					</div>

					{/* العمود الثالث: ملخص الطلب والمدفوعات */}
					<div className='space-y-6'>
						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>ملخص الطلب</h2>
							</div>
							<div className='p-6 space-y-4'>
								<div className='flex justify-between'>
									<span className='font-medium text-gray-500 dark:text-gray-400'>
										المجموع الفرعي:
									</span>
									<span className='font-medium text-gray-800 dark:text-gray-200'>
										{watch('subtotal').toFixed(2)}
										<span className='inline-block relative h-4 w-4 mx-1 -mt-0.5'>
											<Image
												src='/images/Saudi_Riyal_Symbol.png'
												alt='ر.س'
												fill
												sizes='16px'
												style={{ objectFit: 'contain' }}
											/>
										</span>
									</span>
								</div>

								{watch('discount') > 0 && (
									<div className='flex justify-between'>
										<span className='font-medium text-gray-500 dark:text-gray-400'>الخصم:</span>
										<span className='font-medium text-red-500 dark:text-red-400'>
											- {watch('discount').toFixed(2)}
											<span className='inline-block relative h-4 w-4 mx-1 -mt-0.5'>
												<Image
													src='/images/Saudi_Riyal_Symbol.png'
													alt='ر.س'
													fill
													sizes='16px'
													style={{ objectFit: 'contain' }}
												/>
											</span>
										</span>
									</div>
								)}

								<div className='flex justify-between'>
									<span className='font-medium text-gray-500 dark:text-gray-400'>
										ضريبة القيمة المضافة (15%):
									</span>
									<span className='font-medium text-gray-800 dark:text-gray-200'>
										{watch('tax').toFixed(2)}
										<span className='inline-block relative h-4 w-4 mx-1 -mt-0.5'>
											<Image
												src='/images/Saudi_Riyal_Symbol.png'
												alt='ر.س'
												fill
												sizes='16px'
												style={{ objectFit: 'contain' }}
											/>
										</span>
									</span>
								</div>

								<div className='flex justify-between'>
									<span className='font-medium text-gray-500 dark:text-gray-400'>تكلفة الشحن:</span>
									<span className='font-medium text-gray-800 dark:text-gray-200'>
										{watch('shipping').toFixed(2)}
										<span className='inline-block relative h-4 w-4 mx-1 -mt-0.5'>
											<Image
												src='/images/Saudi_Riyal_Symbol.png'
												alt='ر.س'
												fill
												sizes='16px'
												style={{ objectFit: 'contain' }}
											/>
										</span>
									</span>
								</div>

								<div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
									<div className='flex justify-between'>
										<span className='text-lg font-medium text-gray-800 dark:text-gray-100'>
											المجموع:
										</span>
										<span className='text-lg font-bold text-gray-900 dark:text-gray-50'>
											{watch('total').toFixed(2)}
											<span className='inline-block relative h-5 w-5 mx-1 -mt-0.5'>
												<Image
													src='/images/Saudi_Riyal_Symbol.png'
													alt='ر.س'
													fill
													sizes='20px'
													style={{ objectFit: 'contain' }}
												/>
											</span>
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>معلومات المورد</h2>
							</div>
							{selectedSupplier ? (
								<div className='p-6 space-y-4'>
									<div>
										<span className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
											اسم المورد:
										</span>
										<span className='block text-base font-semibold text-gray-900 dark:text-gray-100'>
											{selectedSupplier.name}
										</span>
									</div>

									<div>
										<span className='block text-sm font-medium text-gray-500 dark:text-gray-400'>
											فئة التوريد:
										</span>
										<span className='block text-base text-gray-800 dark:text-gray-200'>
											{selectedSupplier.category}
										</span>
									</div>

									<div className='pt-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-md p-4'>
										<div className='flex'>
											<div className='flex-shrink-0'>
												<AlertTriangle className='h-5 w-5 text-blue-500 dark:text-blue-400' />
											</div>
											<div className='mr-3'>
												<h3 className='text-sm font-medium text-blue-800 dark:text-blue-300'>
													تنبيه
												</h3>
												<div className='mt-2 text-sm text-blue-700 dark:text-blue-400'>
													<p>تأكد من مراجعة كافة تفاصيل الطلب قبل إرساله للمورد.</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className='p-6 text-center text-gray-500 dark:text-gray-400'>
									اختر المورد لعرض المعلومات
								</div>
							)}
						</div>
					</div>
				</div>

				{/* أزرار التحكم السفلية */}
				<div className='flex justify-end space-x-3 space-x-reverse'>
					<Link
						href='/dashboard/suppliers/purchase-orders'
						className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
					>
						إلغاء
					</Link>

					<button
						type='submit'
						disabled={isSubmitting || success}
						className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed'
					>
						{isSubmitting ? (
							<>
								<Loader2 className='inline-block ml-1.5 -mr-1 h-4 w-4 animate-spin' />
								جاري الحفظ...
							</>
						) : success ? (
							<>
								<CheckCircle className='inline-block ml-1.5 -mr-1 h-4 w-4' />
								تم إنشاء الطلب
							</>
						) : (
							<>
								<ShoppingBag className='inline-block ml-1.5 -mr-1 h-4 w-4' />
								إنشاء طلب الشراء
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
