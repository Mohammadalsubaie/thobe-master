// app/dashboard/inventory/purchases/new/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
	AlertTriangle,
	ArrowRight,
	Calculator,
	Calendar,
	Check,
	FileText,
	Loader2,
	Plus,
	Save,
	Search,
	Trash2,
	X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

// مخطط التحقق من صحة البيانات
const purchaseSchema = z.object({
	supplierId: z.string().min(1, { message: 'يجب تحديد المورد' }),
	invoiceNumber: z.string().min(1, { message: 'يجب إدخال رقم الفاتورة' }),
	invoiceDate: z.date({
		required_error: 'يجب تحديد تاريخ الفاتورة',
		invalid_type_error: 'التاريخ غير صالح',
	}),
	paymentMethod: z.string().min(1, { message: 'يجب تحديد طريقة الدفع' }),
	paymentStatus: z.string().min(1, { message: 'يجب تحديد حالة الدفع' }),
	notes: z.string().optional(),
	items: z
		.array(
			z.object({
				fabricId: z.string().min(1, { message: 'يجب تحديد نوع القماش' }),
				quantity: z.coerce.number().positive({ message: 'يجب أن تكون الكمية رقمًا موجبًا' }),
				unitPrice: z.coerce.number().positive({ message: 'يجب أن يكون السعر رقمًا موجبًا' }),
				discount: z.coerce.number().min(0, { message: 'يجب أن يكون الخصم رقمًا غير سالب' }).optional(),
			})
		)
		.min(1, { message: 'يجب إضافة منتج واحد على الأقل' }),
	otherCharges: z.coerce.number().min(0, { message: 'يجب أن تكون الرسوم الإضافية رقمًا غير سالب' }).optional(),
	taxRate: z.coerce.number().min(0, { message: 'يجب أن تكون نسبة الضريبة رقمًا غير سالب' }).optional(),
});

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

// نوع بيانات المورد
interface Supplier {
	id: string;
	name: string;
}

// نوع بيانات القماش
interface Fabric {
	id: string;
	name: string;
	sku: string;
	unit: string;
	cost: number;
	thumbnail?: string;
}

export default function NewPurchasePage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const fabricId = searchParams.get('fabric_id');

	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [suppliers, setSuppliers] = useState<Supplier[]>([]);
	const [fabrics, setFabrics] = useState<Fabric[]>([]);
	const [searchFabric, setSearchFabric] = useState('');
	const [filteredFabrics, setFilteredFabrics] = useState<Fabric[]>([]);
	const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
	const [showFabricSelector, setShowFabricSelector] = useState(false);

	// إعداد React Hook Form
	const {
		register,
		handleSubmit,
		control,
		setValue,
		getValues,
		watch,
		formState: { errors },
	} = useForm<PurchaseFormValues>({
		resolver: zodResolver(purchaseSchema),
		defaultValues: {
			supplierId: '',
			invoiceNumber: '',
			invoiceDate: new Date(),
			paymentMethod: 'bank-transfer',
			paymentStatus: 'paid',
			notes: '',
			items: [],
			otherCharges: 0,
			taxRate: 15, // نسبة ضريبة القيمة المضافة الافتراضية 15%
		},
	});

	// إعداد مصفوفة المنتجات
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'items',
	});

	// مراقبة التغييرات لحساب المجموع
	const watchedItems = watch('items');
	const watchedOtherCharges = watch('otherCharges') || 0;
	const watchedTaxRate = watch('taxRate') || 0;

	// جلب بيانات الموردين والأقمشة
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);

				// جلب بيانات الموردين
				await new Promise((resolve) => setTimeout(resolve, 300));
				const mockSuppliers: Supplier[] = [
					{ id: 's1', name: 'شركة النسيج العالمية' },
					{ id: 's2', name: 'مصنع الأقمشة الفاخرة' },
					{ id: 's3', name: 'مؤسسة الخليج للمنسوجات' },
					{ id: 's4', name: 'شركة الحرير الذهبي' },
				];
				setSuppliers(mockSuppliers);

				// جلب بيانات الأقمشة
				await new Promise((resolve) => setTimeout(resolve, 300));
				const mockFabrics: Fabric[] = [
					{
						id: 'f1',
						name: 'قماش كشمير أسود فاخر',
						sku: 'FAB-KSH-BLK-001',
						unit: 'متر',
						cost: 80,
						thumbnail: '/images/fabrics/black-cashmere-1.jpg',
					},
					{
						id: 'f2',
						name: 'قماش قطن مصري أبيض',
						sku: 'FAB-CTN-WHT-002',
						unit: 'متر',
						cost: 45,
						thumbnail: '/images/fabrics/white-cotton.jpg',
					},
					{
						id: 'f3',
						name: 'قماش صوف رمادي',
						sku: 'FAB-WOL-GRY-003',
						unit: 'متر',
						cost: 65,
						thumbnail: '/images/fabrics/gray-wool.jpg',
					},
					{
						id: 'f4',
						name: 'قماش حرير أزرق',
						sku: 'FAB-SLK-BLU-004',
						unit: 'متر',
						cost: 90,
						thumbnail: '/images/fabrics/blue-silk.jpg',
					},
					{
						id: 'f5',
						name: 'قماش كتان بيج',
						sku: 'FAB-LNN-BGE-005',
						unit: 'متر',
						cost: 55,
						thumbnail: '/images/fabrics/beige-linen.jpg',
					},
				];
				setFabrics(mockFabrics);
				setFilteredFabrics(mockFabrics);

				// إذا تم تمرير fabric_id في البارامترات، أضف القماش تلقائيًا
				if (fabricId) {
					const selectedFabric = mockFabrics.find((fabric) => fabric.id === fabricId);
					if (selectedFabric) {
						const defaultSupplierId = mockSuppliers.length > 0 ? mockSuppliers[0].id : '';
						setValue('supplierId', defaultSupplierId);

						// أضف القماش إلى القائمة
						append({
							fabricId: selectedFabric.id,
							quantity: 1,
							unitPrice: selectedFabric.cost,
							discount: 0,
						});
					}
				}
			} catch (err) {
				console.error('Error fetching data:', err);
				setError('حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.');
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [fabricId, setValue, append]);

	// تحديث قائمة الأقمشة المصفاة عند تغيير مصطلح البحث
	useEffect(() => {
		if (!searchFabric.trim()) {
			setFilteredFabrics(fabrics);
			return;
		}

		const filtered = fabrics.filter(
			(fabric) => fabric.name.includes(searchFabric) || fabric.sku.includes(searchFabric)
		);
		setFilteredFabrics(filtered);
	}, [searchFabric, fabrics]);

	// اختيار قماش
	const handleSelectFabric = (fabric: Fabric) => {
		setSelectedFabric(fabric);
		setShowFabricSelector(false);
		setSearchFabric('');

		// إضافة القماش إلى القائمة
		append({
			fabricId: fabric.id,
			quantity: 1,
			unitPrice: fabric.cost,
			discount: 0,
		});
	};

	// حساب المجموع الفرعي (قبل الضريبة)
	const calculateSubtotal = () => {
		return (
			watchedItems.reduce((sum, item) => {
				const total = item.quantity * item.unitPrice;
				const discount = item.discount || 0;
				return sum + (total - discount);
			}, 0) + (watchedOtherCharges || 0)
		);
	};

	// حساب قيمة الضريبة
	const calculateTax = () => {
		return calculateSubtotal() * (watchedTaxRate / 100);
	};

	// حساب المجموع الكلي
	const calculateTotal = () => {
		return calculateSubtotal() + calculateTax();
	};

	// الحصول على تفاصيل القماش من معرّفه
	const getFabricDetails = (fabricId: string) => {
		return fabrics.find((fabric) => fabric.id === fabricId);
	};

	// تقديم النموذج
	const onSubmit = handleSubmit(async (data) => {
		try {
			setSubmitting(true);
			setError(null);

			console.log('Form data to submit:', data);

			// في التطبيق الحقيقي، هنا سيتم إرسال البيانات إلى الخادم
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setSuccess(true);

			// إعادة التوجيه بعد النجاح
			setTimeout(() => {
				// يمكن التوجيه إلى صفحة تفاصيل عملية الشراء الجديدة
				router.push('/dashboard/inventory/purchases');
			}, 1500);
		} catch (err) {
			console.error('Error submitting form:', err);
			setError('حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة مرة أخرى.');
			setSubmitting(false);
		}
	});

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'></div>
				<span className='mr-2 text-gray-700 dark:text-gray-300'>جاري تحميل البيانات...</span>
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
							href='/dashboard/inventory/purchases'
							className='text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light mr-2'
						>
							<ArrowRight className='h-5 w-5' />
						</Link>
						<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>إضافة عملية شراء جديدة</h1>
					</div>
					<p className='text-gray-500 dark:text-gray-400 text-sm'>سجل عملية شراء أقمشة جديدة من الموردين</p>
				</div>

				<div className='flex mt-4 md:mt-0 space-x-3 space-x-reverse'>
					<Link
						href='/dashboard/inventory/purchases'
						className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
					>
						<X className='ml-1.5 -mr-1 h-4 w-4' />
						إلغاء
					</Link>

					<button
						type='button'
						onClick={() =>
							document
								.getElementById('purchaseForm')
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
								حفظ عملية الشراء
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

			{/* نموذج عملية الشراء */}
			<form id='purchaseForm' onSubmit={onSubmit} className='space-y-8'>
				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
					{/* العمود الأول: معلومات الفاتورة */}
					<div className='lg:col-span-2 space-y-6'>
						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
									<FileText className='h-5 w-5 inline-block ml-1 -mt-1' />
									معلومات الفاتورة
								</h2>
							</div>
							<div className='p-6 space-y-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
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

									{/* رقم الفاتورة */}
									<div>
										<label
											htmlFor='invoiceNumber'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300'
										>
											رقم الفاتورة <span className='text-red-500'>*</span>
										</label>
										<input
											id='invoiceNumber'
											type='text'
											{...register('invoiceNumber')}
											className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
										/>
										{errors.invoiceNumber && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.invoiceNumber.message}
											</p>
										)}
									</div>

									{/* تاريخ الفاتورة */}
									<div>
										<label
											htmlFor='invoiceDate'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300'
										>
											تاريخ الفاتورة <span className='text-red-500'>*</span>
										</label>
										<div className='mt-1 relative'>
											<Controller
												control={control}
												name='invoiceDate'
												render={({ field }) => (
													<div className='relative flex items-center'>
														<DatePicker
															selected={field.value}
															onChange={field.onChange}
															dateFormat='dd/MM/yyyy'
															className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
														/>
														<Calendar className='absolute left-3 h-5 w-5 text-gray-400 dark:text-gray-500' />
													</div>
												)}
											/>
										</div>
										{errors.invoiceDate && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.invoiceDate.message}
											</p>
										)}
									</div>

									{/* طريقة الدفع */}
									<div>
										<label
											htmlFor='paymentMethod'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300'
										>
											طريقة الدفع <span className='text-red-500'>*</span>
										</label>
										<select
											id='paymentMethod'
											{...register('paymentMethod')}
											className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
										>
											<option value='cash'>نقدًا</option>
											<option value='bank-transfer'>تحويل بنكي</option>
											<option value='check'>شيك</option>
											<option value='credit-card'>بطاقة ائتمان</option>
										</select>
										{errors.paymentMethod && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.paymentMethod.message}
											</p>
										)}
									</div>

									{/* حالة الدفع */}
									<div>
										<label
											htmlFor='paymentStatus'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300'
										>
											حالة الدفع <span className='text-red-500'>*</span>
										</label>
										<select
											id='paymentStatus'
											{...register('paymentStatus')}
											className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
										>
											<option value='paid'>مدفوع</option>
											<option value='partially-paid'>مدفوع جزئيًا</option>
											<option value='pending'>في انتظار الدفع</option>
											<option value='credit'>آجل</option>
										</select>
										{errors.paymentStatus && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.paymentStatus.message}
											</p>
										)}
									</div>

									{/* رسوم إضافية */}
									<div>
										<label
											htmlFor='otherCharges'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300'
										>
											رسوم إضافية
										</label>
										<div className='mt-1 relative rounded-md shadow-sm'>
											<input
												id='otherCharges'
												type='number'
												step='0.01'
												min='0'
												{...register('otherCharges')}
												className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
											/>
											<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
												<span className='text-gray-500 dark:text-gray-400'>ر.س</span>
											</div>
										</div>
										{errors.otherCharges && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.otherCharges.message}
											</p>
										)}
									</div>

									{/* ضريبة القيمة المضافة */}
									<div>
										<label
											htmlFor='taxRate'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300'
										>
											نسبة ضريبة القيمة المضافة
										</label>
										<div className='mt-1 relative rounded-md shadow-sm'>
											<input
												id='taxRate'
												type='number'
												step='0.01'
												min='0'
												max='100'
												{...register('taxRate')}
												className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
											/>
											<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
												<span className='text-gray-500 dark:text-gray-400'>%</span>
											</div>
										</div>
										{errors.taxRate && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.taxRate.message}
											</p>
										)}
									</div>

									{/* ملاحظات */}
									<div className='md:col-span-2'>
										<label
											htmlFor='notes'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300'
										>
											ملاحظات
										</label>
										<textarea
											id='notes'
											{...register('notes')}
											rows={3}
											className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
											placeholder='أي ملاحظات إضافية عن عملية الشراء...'
										></textarea>
									</div>
								</div>
							</div>
						</div>

						{/* قائمة المنتجات */}
						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
									قائمة الأقمشة المشتراة
								</h2>
								<button
									type='button'
									onClick={() => setShowFabricSelector(true)}
									className='inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
								>
									<Plus className='ml-1.5 -mr-1 h-4 w-4' />
									إضافة قماش
								</button>
							</div>

							{/* منتقي الأقمشة */}
							{showFabricSelector && (
								<div className='p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700'>
									<div className='flex items-center mb-3'>
										<div className='flex-1 relative'>
											<input
												type='text'
												value={searchFabric}
												onChange={(e) => setSearchFabric(e.target.value)}
												placeholder='ابحث عن قماش...'
												className='block w-full py-2 px-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-600 dark:text-gray-100'
											/>
											<Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500' />
										</div>
										<button
											type='button'
											onClick={() => setShowFabricSelector(false)}
											className='mr-2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
										>
											<X className='h-5 w-5' />
										</button>
									</div>

									<div className='max-h-64 overflow-y-auto'>
										<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
											{filteredFabrics.length > 0 ? (
												filteredFabrics.map((fabric) => (
													<div
														key={fabric.id}
														onClick={() => handleSelectFabric(fabric)}
														className='flex items-center p-2 border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer'
													>
														{fabric.thumbnail && (
															<div className='h-12 w-12 rounded-md overflow-hidden flex-shrink-0 relative'>
																<Image
																	src={fabric.thumbnail}
																	alt={fabric.name}
																	fill
																	sizes='48px'
																	className='object-cover'
																/>
															</div>
														)}
														<div className='mr-3 flex-1 min-w-0'>
															<p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
																{fabric.name}
															</p>
															<p className='text-xs text-gray-500 dark:text-gray-400'>
																{fabric.sku} | {fabric.cost} ر.س / {fabric.unit}
															</p>
														</div>
													</div>
												))
											) : (
												<div className='col-span-2 p-4 text-center text-gray-500 dark:text-gray-400'>
													لم يتم العثور على أقمشة تطابق البحث
												</div>
											)}
										</div>
									</div>
								</div>
							)}

							{/* جدول المنتجات */}
							<div className='p-4'>
								{fields.length > 0 ? (
									<div className='overflow-x-auto'>
										<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
											<thead className='bg-gray-50 dark:bg-gray-700'>
												<tr>
													<th
														scope='col'
														className='px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														القماش
													</th>
													<th
														scope='col'
														className='px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														الكمية
													</th>
													<th
														scope='col'
														className='px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														سعر الوحدة
													</th>
													<th
														scope='col'
														className='px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														الخصم
													</th>
													<th
														scope='col'
														className='px-3 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														الإجمالي
													</th>
													<th
														scope='col'
														className='px-3 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														<span className='sr-only'>الإجراءات</span>
													</th>
												</tr>
											</thead>
											<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
												{fields.map((field, index) => {
													const fabricDetails = getFabricDetails(
														getValues(`items.${index}.fabricId`)
													);
													const quantity = watch(`items.${index}.quantity`) || 0;
													const unitPrice = watch(`items.${index}.unitPrice`) || 0;
													const discount = watch(`items.${index}.discount`) || 0;
													const totalPrice = quantity * unitPrice - discount;

													return (
														<tr key={field.id}>
															<td className='px-3 py-4 whitespace-nowrap'>
																<div className='flex items-center'>
																	{fabricDetails?.thumbnail && (
																		<div className='h-10 w-10 rounded-md overflow-hidden flex-shrink-0 relative'>
																			<Image
																				src={fabricDetails.thumbnail}
																				alt={fabricDetails.name}
																				fill
																				sizes='40px'
																				className='object-cover'
																			/>
																		</div>
																	)}
																	<div className='mr-3 min-w-0'>
																		<div className='text-sm font-medium text-gray-900 dark:text-gray-100'>
																			{fabricDetails?.name || 'قماش غير معروف'}
																		</div>
																		<div className='text-xs text-gray-500 dark:text-gray-400'>
																			{fabricDetails?.sku || '-'}
																		</div>
																	</div>
																</div>

																{/* المعرّف الخفي */}
																<input
																	type='hidden'
																	{...register(`items.${index}.fabricId` as const)}
																/>
															</td>
															<td className='px-3 py-4 whitespace-nowrap'>
																<div className='relative w-24'>
																	<input
																		type='number'
																		step='0.1'
																		min='0.1'
																		{...register(
																			`items.${index}.quantity` as const
																		)}
																		className='block w-full py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100 text-center'
																	/>
																	<div className='absolute inset-y-0 left-0 pr-3 flex items-center pointer-events-none'>
																		<span className='text-xs text-gray-500 dark:text-gray-400'>
																			{fabricDetails?.unit}
																		</span>
																	</div>
																</div>
																{errors.items?.[index]?.quantity && (
																	<p className='mt-1 text-xs text-red-600 dark:text-red-400'>
																		{errors.items[index]?.quantity?.message}
																	</p>
																)}
															</td>
															<td className='px-3 py-4 whitespace-nowrap'>
																<div className='relative w-28'>
																	<input
																		type='number'
																		step='0.01'
																		min='0.01'
																		{...register(
																			`items.${index}.unitPrice` as const
																		)}
																		className='block w-full py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100 text-center'
																	/>
																	<div className='absolute inset-y-0 left-0 pr-3 flex items-center pointer-events-none'>
																		<span className='text-xs text-gray-500 dark:text-gray-400'>
																			ر.س
																		</span>
																	</div>
																</div>
																{errors.items?.[index]?.unitPrice && (
																	<p className='mt-1 text-xs text-red-600 dark:text-red-400'>
																		{errors.items[index]?.unitPrice?.message}
																	</p>
																)}
															</td>
															<td className='px-3 py-4 whitespace-nowrap'>
																<div className='relative w-24'>
																	<input
																		type='number'
																		step='0.01'
																		min='0'
																		{...register(
																			`items.${index}.discount` as const
																		)}
																		className='block w-full py-1.5 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100 text-center'
																	/>
																	<div className='absolute inset-y-0 left-0 pr-3 flex items-center pointer-events-none'>
																		<span className='text-xs text-gray-500 dark:text-gray-400'>
																			ر.س
																		</span>
																	</div>
																</div>
																{errors.items?.[index]?.discount && (
																	<p className='mt-1 text-xs text-red-600 dark:text-red-400'>
																		{errors.items[index]?.discount?.message}
																	</p>
																)}
															</td>
															<td className='px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100'>
																{totalPrice.toFixed(2)} ر.س
															</td>
															<td className='px-3 py-4 whitespace-nowrap text-center'>
																<button
																	type='button'
																	onClick={() => remove(index)}
																	className='text-red-500 hover:text-red-700 dark:hover:text-red-400'
																>
																	<Trash2 className='h-5 w-5' />
																</button>
															</td>
														</tr>
													);
												})}
											</tbody>
										</table>
									</div>
								) : (
									<div className='text-center py-8'>
										<p className='text-gray-500 dark:text-gray-400 mb-4'>
											لم تتم إضافة أي أقمشة بعد
										</p>
										<button
											type='button'
											onClick={() => setShowFabricSelector(true)}
											className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
										>
											<Plus className='ml-2 -mr-1 h-5 w-5' />
											إضافة قماش
										</button>
									</div>
								)}

								{errors.items && !Array.isArray(errors.items) && (
									<p className='mt-2 text-sm text-red-600 dark:text-red-400'>
										{errors.items.message}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* العمود الثاني: ملخص الفاتورة */}
					<div className='space-y-6'>
						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden sticky top-6'>
							<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
									<Calculator className='h-5 w-5 inline-block ml-1 -mt-1' />
									ملخص عملية الشراء
								</h2>
							</div>
							<div className='p-6'>
								<div className='space-y-4'>
									<div className='flex justify-between items-center'>
										<span className='text-gray-600 dark:text-gray-400'>المجموع الفرعي:</span>
										<span className='text-gray-900 dark:text-gray-100 font-medium'>
											{calculateSubtotal().toFixed(2)} ر.س
										</span>
									</div>

									<div className='flex justify-between items-center'>
										<span className='text-gray-600 dark:text-gray-400'>
											ضريبة القيمة المضافة ({watchedTaxRate}%):
										</span>
										<span className='text-gray-900 dark:text-gray-100 font-medium'>
											{calculateTax().toFixed(2)} ر.س
										</span>
									</div>

									<div className='pt-4 border-t border-gray-200 dark:border-gray-700'>
										<div className='flex justify-between items-center'>
											<span className='text-lg font-medium text-gray-900 dark:text-gray-100'>
												الإجمالي:
											</span>
											<span className='text-lg text-primary dark:text-primary-light font-bold'>
												{calculateTotal().toFixed(2)} ر.س
											</span>
										</div>
									</div>
								</div>

								<div className='mt-8 space-y-3'>
									<button
										type='submit'
										disabled={submitting || success}
										className='w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed'
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
												حفظ عملية الشراء
											</>
										)}
									</button>

									<Link
										href='/dashboard/inventory/purchases'
										className='block w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
									>
										<X className='inline-block ml-1.5 -mr-1 h-4 w-4' />
										إلغاء
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
