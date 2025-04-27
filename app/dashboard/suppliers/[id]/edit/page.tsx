// app/dashboard/suppliers/[id]/edit/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
	AlertTriangle,
	Archive,
	ArrowRight,
	ArrowUpRight,
	Building,
	CheckCircle,
	ChevronDown,
	Clock,
	DollarSign,
	FileText,
	Loader2,
	Mail,
	MapPin,
	Phone,
	Plus,
	RotateCcw,
	Save,
	Trash2,
	User,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

// مخطط التحقق من الحقول (نفس المخطط المستخدم في صفحة إضافة المورد)
const supplierSchema = z.object({
	name: z.string().min(1, { message: 'يجب إدخال اسم المورد' }),
	type: z.string().min(1, { message: 'يجب اختيار نوع المورد' }),
	categories: z.array(z.string()).min(1, { message: 'يجب اختيار فئة واحدة على الأقل' }),
	phone: z.string().min(1, { message: 'يجب إدخال رقم الهاتف' }),
	email: z.string().email({ message: 'يجب إدخال بريد إلكتروني صحيح' }).optional().or(z.literal('')),
	address: z.string().min(1, { message: 'يجب إدخال العنوان' }),
	city: z.string().min(1, { message: 'يجب إدخال المدينة' }),
	website: z.string().url({ message: 'يجب إدخال رابط صحيح' }).optional().or(z.literal('')),
	taxNumber: z.string().optional(),
	status: z.enum(['active', 'inactive', 'archived']),

	// معلومات المسؤول
	contactPerson: z.object({
		name: z.string().min(1, { message: 'يجب إدخال اسم الشخص المسؤول' }),
		position: z.string().optional(),
		phone: z.string().min(1, { message: 'يجب إدخال رقم هاتف المسؤول' }),
		email: z.string().email({ message: 'يجب إدخال بريد إلكتروني صحيح' }).optional().or(z.literal('')),
	}),

	// معلومات الدفع
	paymentTerms: z.object({
		method: z.string().min(1, { message: 'يجب اختيار طريقة الدفع' }),
		days: z.string().transform((val) => parseInt(val) || 0),
		discount: z.string().transform((val) => parseFloat(val) || 0),
		bankName: z.string().optional(),
		bankAccount: z.string().optional(),
		notes: z.string().optional(),
	}),

	// المنتجات
	products: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z.string().min(1, { message: 'يجب إدخال اسم المنتج' }),
				sku: z.string().optional(),
				category: z.string().min(1, { message: 'يجب اختيار فئة للمنتج' }),
				unit: z.string().min(1, { message: 'يجب اختيار وحدة القياس' }),
				price: z.string().transform((val) => parseFloat(val) || 0),
				minOrder: z.string().transform((val) => parseInt(val) || 0),
				leadTime: z.string().transform((val) => parseInt(val) || 0),
			})
		)
		.optional(),

	notes: z.string().optional(),
});

// نوع البيانات المستخرج من المخطط
type SupplierFormValues = z.infer<typeof supplierSchema>;

export default function EditSupplierPage() {
	const router = useRouter();
	const params = useParams();
	const supplierId = params.id as string;

	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [archiveConfirmOpen, setArchiveConfirmOpen] = useState(false);

	// استخدام React Hook Form مع Zod
	const {
		register,
		handleSubmit,
		control,
		formState: { errors, isDirty },
		reset,
		setValue,
		watch,
	} = useForm<SupplierFormValues>({
		resolver: zodResolver(supplierSchema),
		defaultValues: {
			name: '',
			type: '',
			categories: [],
			phone: '',
			email: '',
			address: '',
			city: '',
			website: '',
			taxNumber: '',
			status: 'active',
			contactPerson: {
				name: '',
				position: '',
				phone: '',
				email: '',
			},
			paymentTerms: {
				method: '',
				days: '30',
				discount: '0',
				bankName: '',
				bankAccount: '',
				notes: '',
			},
			products: [],
			notes: '',
		},
	});

	// جلب بيانات المورد
	useEffect(() => {
		const fetchSupplierData = async () => {
			setIsLoading(true);

			try {
				// في التطبيق الحقيقي، سنقوم بطلب البيانات من API
				// محاكاة جلب بيانات المورد
				setTimeout(() => {
					// هذه بيانات وهمية للعرض
					const mockSupplier: SupplierFormValues = {
						name: 'شركة النسيج العالمية',
						type: 'main',
						categories: ['fabrics', 'threads'],
						phone: '0501234567',
						email: 'info@textileworld.com',
						address: 'الرياض، طريق الملك فهد، حي العليا',
						city: 'الرياض',
						website: 'https://textileworld.com',
						taxNumber: '300012345600003',
						status: 'active',
						contactPerson: {
							name: 'محمد العبدالله',
							position: 'مدير المبيعات',
							phone: '0555123456',
							email: 'm.abdullah@textileworld.com',
						},
						paymentTerms: {
							method: 'bank',
							days: '30',
							discount: '2.5',
							bankName: 'البنك الأهلي السعودي',
							bankAccount: 'SA1234567890123456789012',
							notes: 'خصم 2.5% للدفع خلال 15 يوم',
						},
						products: [
							{
								id: 'p1',
								name: 'قماش قطني أبيض',
								sku: 'FAB-COT-WHT-001',
								category: 'fabrics',
								unit: 'meter',
								price: '25',
								minOrder: '50',
								leadTime: '7',
							},
							{
								id: 'p2',
								name: 'قماش حرير طبيعي',
								sku: 'FAB-SLK-NAT-002',
								category: 'fabrics',
								unit: 'meter',
								price: '120',
								minOrder: '20',
								leadTime: '14',
							},
							{
								id: 'p3',
								name: 'خيط قطني أسود',
								sku: 'THR-COT-BLK-001',
								category: 'threads',
								unit: 'roll',
								price: '15',
								minOrder: '10',
								leadTime: '5',
							},
						],
						notes: 'مورد موثوق للأقمشة عالية الجودة، نتعامل معه منذ أكثر من 5 سنوات.',
					};

					// تعبئة النموذج بالبيانات
					reset(mockSupplier);
					setIsLoading(false);
				}, 1000);
			} catch (err) {
				console.error('Error fetching supplier data:', err);
				setError('حدث خطأ أثناء جلب بيانات المورد. الرجاء المحاولة مرة أخرى.');
				setIsLoading(false);
			}
		};

		fetchSupplierData();
	}, [reset, supplierId]);

	// إدارة مصفوفة المنتجات
	const { fields, append, remove } = useFieldArray({
		control,
		name: 'products',
	});

	// متابعة حالة المورد
	const supplierStatus = watch('status');

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
				router.push(`/dashboard/suppliers/${supplierId}`);
			}, 2000);
		} catch (err) {
			console.error('Error submitting form:', err);
			setError('حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة مرة أخرى.');
			setIsSubmitting(false);
		}
	});

	// إضافة منتج جديد
	const addProduct = () => {
		append({
			id: undefined,
			name: '',
			sku: '',
			category: '',
			unit: '',
			price: '0',
			minOrder: '0',
			leadTime: '0',
		});
	};

	// حذف المورد
	const handleDeleteSupplier = async () => {
		setIsSubmitting(true);

		try {
			// في التطبيق الحقيقي، سنقوم بإرسال طلب حذف إلى API
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setDeleteConfirmOpen(false);

			// توجيه المستخدم لصفحة الموردين بعد الحذف
			router.push('/dashboard/suppliers');
		} catch (err) {
			console.error('Error deleting supplier:', err);
			setError('حدث خطأ أثناء محاولة حذف المورد. الرجاء المحاولة مرة أخرى.');
			setIsSubmitting(false);
			setDeleteConfirmOpen(false);
		}
	};

	// أرشفة المورد
	const handleArchiveSupplier = async () => {
		setIsSubmitting(true);

		try {
			// في التطبيق الحقيقي، سنقوم بإرسال طلب أرشفة إلى API
			setValue('status', 'archived');
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setArchiveConfirmOpen(false);
			setIsSubmitting(false);
			setSuccess(true);

			// نعرض رسالة النجاح
			setTimeout(() => {
				router.push('/dashboard/suppliers');
			}, 2000);
		} catch (err) {
			console.error('Error archiving supplier:', err);
			setError('حدث خطأ أثناء محاولة أرشفة المورد. الرجاء المحاولة مرة أخرى.');
			setIsSubmitting(false);
			setArchiveConfirmOpen(false);
		}
	};

	// إعادة تنشيط المورد
	const handleReactivateSupplier = async () => {
		setIsSubmitting(true);

		try {
			// في التطبيق الحقيقي، سنقوم بإرسال طلب تنشيط إلى API
			setValue('status', 'active');
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setIsSubmitting(false);
			setSuccess(true);

			// نعرض رسالة النجاح
			setTimeout(() => {
				setSuccess(false);
			}, 2000);
		} catch (err) {
			console.error('Error reactivating supplier:', err);
			setError('حدث خطأ أثناء محاولة إعادة تنشيط المورد. الرجاء المحاولة مرة أخرى.');
			setIsSubmitting(false);
		}
	};

	// قوائم الخيارات
	const supplierTypes = [
		{ id: 'main', name: 'مورد رئيسي' },
		{ id: 'secondary', name: 'مورد ثانوي' },
		{ id: 'local', name: 'مورد محلي' },
		{ id: 'international', name: 'مورد دولي' },
	];

	const categoryOptions = [
		{ id: 'fabrics', name: 'أقمشة' },
		{ id: 'threads', name: 'خيوط' },
		{ id: 'buttons', name: 'أزرار' },
		{ id: 'accessories', name: 'إكسسوارات' },
		{ id: 'packaging', name: 'مواد تغليف' },
		{ id: 'tools', name: 'أدوات خياطة' },
	];

	const paymentMethods = [
		{ id: 'bank', name: 'تحويل بنكي' },
		{ id: 'credit', name: 'بطاقة ائتمان' },
		{ id: 'cash', name: 'نقدي' },
		{ id: 'check', name: 'شيك' },
	];

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

	// مودال تأكيد الحذف
	const DeleteConfirmationModal = () => {
		if (!deleteConfirmOpen) return null;

		return (
			<div className='fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4'>
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6'>
					<div className='text-center'>
						<div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20'>
							<AlertTriangle className='h-6 w-6 text-red-600 dark:text-red-400' />
						</div>
						<h3 className='mt-4 text-lg font-medium text-gray-900 dark:text-gray-100'>تأكيد حذف المورد</h3>
						<p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
							هل أنت متأكد من حذف هذا المورد؟ لا يمكن التراجع عن هذا الإجراء.
						</p>
					</div>
					<div className='mt-6 flex justify-center space-x-3 space-x-reverse'>
						<button
							type='button'
							className='inline-flex justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none'
							onClick={() => setDeleteConfirmOpen(false)}
						>
							إلغاء
						</button>
						<button
							type='button'
							className='inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none'
							onClick={handleDeleteSupplier}
							disabled={isSubmitting}
						>
							{isSubmitting ? <Loader2 className='h-5 w-5 animate-spin' /> : 'نعم، حذف المورد'}
						</button>
					</div>
				</div>
			</div>
		);
	};

	// مودال تأكيد الأرشفة
	const ArchiveConfirmationModal = () => {
		if (!archiveConfirmOpen) return null;

		return (
			<div className='fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4'>
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6'>
					<div className='text-center'>
						<div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20'>
							<Archive className='h-6 w-6 text-yellow-600 dark:text-yellow-400' />
						</div>
						<h3 className='mt-4 text-lg font-medium text-gray-900 dark:text-gray-100'>
							تأكيد أرشفة المورد
						</h3>
						<p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
							هل ترغب في أرشفة هذا المورد؟ سيتم إخفاؤه من القائمة الرئيسية، ولكن يمكنك استرجاعه لاحقاً.
						</p>
					</div>
					<div className='mt-6 flex justify-center space-x-3 space-x-reverse'>
						<button
							type='button'
							className='inline-flex justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none'
							onClick={() => setArchiveConfirmOpen(false)}
						>
							إلغاء
						</button>
						<button
							type='button'
							className='inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none'
							onClick={handleArchiveSupplier}
							disabled={isSubmitting}
						>
							{isSubmitting ? <Loader2 className='h-5 w-5 animate-spin' /> : 'نعم، أرشفة المورد'}
						</button>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-wrap justify-between items-center'>
				<div>
					<div className='flex items-center mb-1'>
						<Link
							href={`/dashboard/suppliers/${supplierId}`}
							className='text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ml-2'
						>
							<ArrowRight className='h-5 w-5' />
						</Link>
						<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>تعديل بيانات المورد</h1>
					</div>
					<p className='text-gray-500 dark:text-gray-400 text-sm'>
						تحديث معلومات المورد والمنتجات التي يوفرها
					</p>
				</div>

				<div className='flex mt-4 sm:mt-0 space-x-3 space-x-reverse'>
					<div className='relative group'>
						<button
							type='button'
							className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800'
						>
							المزيد من الخيارات
							<ChevronDown className='mr-1 h-4 w-4' />
						</button>
						<div className='absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 dark:divide-gray-700 focus:outline-none z-10 hidden group-hover:block'>
							<div className='py-1'>
								<Link
									href={`/dashboard/suppliers/${supplierId}/history`}
									className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
								>
									<Clock className='ml-2 h-4 w-4 text-gray-400 dark:text-gray-500' />
									سجل التعاملات
								</Link>
								<Link
									href={`/dashboard/suppliers/purchase-orders/new?supplier=${supplierId}`}
									className='flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
								>
									<ArrowUpRight className='ml-2 h-4 w-4 text-gray-400 dark:text-gray-500' />
									إنشاء طلب شراء
								</Link>
							</div>
							<div className='py-1'>
								{supplierStatus === 'archived' ? (
									<button
										type='button'
										onClick={handleReactivateSupplier}
										className='flex w-full items-center px-4 py-2 text-sm text-green-700 dark:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700'
									>
										<RotateCcw className='ml-2 h-4 w-4' />
										إعادة تنشيط المورد
									</button>
								) : (
									<button
										type='button'
										onClick={() => setArchiveConfirmOpen(true)}
										className='flex w-full items-center px-4 py-2 text-sm text-yellow-700 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700'
									>
										<Archive className='ml-2 h-4 w-4' />
										أرشفة المورد
									</button>
								)}

								<button
									type='button'
									onClick={() => setDeleteConfirmOpen(true)}
									className='flex w-full items-center px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700'
								>
									<Trash2 className='ml-2 h-4 w-4' />
									حذف المورد
								</button>
							</div>
						</div>
					</div>

					<Link
						href={`/dashboard/suppliers/${supplierId}`}
						className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
					>
						<X className='ml-1.5 -mr-1 h-5 w-5' />
						إلغاء
					</Link>

					<button
						type='button'
						onClick={() =>
							document
								.getElementById('supplierForm')
								?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
						}
						disabled={isSubmitting || success || !isDirty}
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
								تم الحفظ بنجاح
							</>
						) : (
							<>
								<Save className='ml-1.5 -mr-1 h-5 w-5' />
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

			{/* حالة المورد */}
			<div
				className={`p-4 rounded-md ${
					supplierStatus === 'active'
						? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30'
						: supplierStatus === 'inactive'
						? 'bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30'
						: 'bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600'
				}`}
			>
				<div className='flex items-start'>
					<div
						className={`p-2 rounded-full mr-3 ${
							supplierStatus === 'active'
								? 'bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-400'
								: supplierStatus === 'inactive'
								? 'bg-yellow-100 dark:bg-yellow-800/50 text-yellow-600 dark:text-yellow-400'
								: 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
						}`}
					>
						{supplierStatus === 'active' ? (
							<CheckCircle className='h-5 w-5' />
						) : supplierStatus === 'inactive' ? (
							<AlertTriangle className='h-5 w-5' />
						) : (
							<Archive className='h-5 w-5' />
						)}
					</div>
					<div>
						<h3
							className={`text-sm font-medium ${
								supplierStatus === 'active'
									? 'text-green-800 dark:text-green-300'
									: supplierStatus === 'inactive'
									? 'text-yellow-800 dark:text-yellow-300'
									: 'text-gray-800 dark:text-gray-300'
							}`}
						>
							حالة المورد:{' '}
							{supplierStatus === 'active' ? 'نشط' : supplierStatus === 'inactive' ? 'غير نشط' : 'مؤرشف'}
						</h3>
						<div className='mt-1 text-sm text-gray-700 dark:text-gray-400'>
							<label className='inline-flex items-center ml-4'>
								<input
									type='radio'
									value='active'
									className='form-radio text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600'
									{...register('status')}
								/>
								<span className='mr-2'>نشط</span>
							</label>
							<label className='inline-flex items-center ml-4'>
								<input
									type='radio'
									value='inactive'
									className='form-radio text-yellow-600 focus:ring-yellow-500 border-gray-300 dark:border-gray-600'
									{...register('status')}
								/>
								<span className='mr-2'>غير نشط</span>
							</label>
							<label className='inline-flex items-center'>
								<input
									type='radio'
									value='archived'
									className='form-radio text-gray-600 focus:ring-gray-500 border-gray-300 dark:border-gray-600'
									{...register('status')}
								/>
								<span className='mr-2'>مؤرشف</span>
							</label>
						</div>
					</div>
				</div>
			</div>

			{isLoading ? (
				<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg p-6'>
					<div className='flex flex-col items-center justify-center py-16'>
						<div className='w-12 h-12 border-4 border-t-blue-600 border-gray-200 dark:border-gray-700 rounded-full animate-spin mb-4'></div>
						<p className='text-gray-500 dark:text-gray-400'>جاري تحميل بيانات المورد...</p>
					</div>
				</div>
			) : (
				<form id='supplierForm' onSubmit={onSubmit} className='space-y-8'>
					<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
						{/* العمود الأول: المعلومات الأساسية */}
						<div className='lg:col-span-2 space-y-6'>
							<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
								<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
									<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
										معلومات المورد الأساسية
									</h2>
								</div>
								<div className='p-6 space-y-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										{/* اسم المورد */}
										<div className='md:col-span-2'>
											<label
												htmlFor='name'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												اسم المورد <span className='text-red-500'>*</span>
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
													<Building className='h-5 w-5 text-gray-400 dark:text-gray-500' />
												</div>
												<input
													id='name'
													type='text'
													{...register('name')}
													className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
													placeholder='أدخل اسم المورد الكامل'
												/>
											</div>
											{errors.name && (
												<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
													{errors.name.message}
												</p>
											)}
										</div>

										{/* نوع المورد */}
										<div>
											<label
												htmlFor='type'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												نوع المورد <span className='text-red-500'>*</span>
											</label>
											<select
												id='type'
												{...register('type')}
												className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
											>
												<option value=''>اختر نوع المورد</option>
												{supplierTypes.map((type) => (
													<option key={type.id} value={type.id}>
														{type.name}
													</option>
												))}
											</select>
											{errors.type && (
												<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
													{errors.type.message}
												</p>
											)}
										</div>

										{/* فئات المنتجات */}
										<div>
											<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
												فئات المنتجات <span className='text-red-500'>*</span>
											</label>
											<div className='mt-1 space-y-2'>
												{categoryOptions.map((category) => (
													<label key={category.id} className='inline-flex items-center ml-4'>
														<input
															type='checkbox'
															value={category.id}
															{...register('categories')}
															className='rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 dark:border-gray-600 dark:bg-gray-700'
														/>
														<span className='mr-2 text-sm text-gray-700 dark:text-gray-300'>
															{category.name}
														</span>
													</label>
												))}
											</div>
											{errors.categories && (
												<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
													{errors.categories.message}
												</p>
											)}
										</div>

										{/* رقم الهاتف */}
										<div>
											<label
												htmlFor='phone'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												رقم الهاتف <span className='text-red-500'>*</span>
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
													<Phone className='h-5 w-5 text-gray-400 dark:text-gray-500' />
												</div>
												<input
													id='phone'
													type='text'
													{...register('phone')}
													className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
													placeholder='05xxxxxxxx'
												/>
											</div>
											{errors.phone && (
												<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
													{errors.phone.message}
												</p>
											)}
										</div>

										{/* البريد الإلكتروني */}
										<div>
											<label
												htmlFor='email'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												البريد الإلكتروني
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
													<Mail className='h-5 w-5 text-gray-400 dark:text-gray-500' />
												</div>
												<input
													id='email'
													type='email'
													{...register('email')}
													className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
													placeholder='example@company.com'
												/>
											</div>
											{errors.email && (
												<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
													{errors.email.message}
												</p>
											)}
										</div>

										{/* رقم ضريبي */}
										<div>
											<label
												htmlFor='taxNumber'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												الرقم الضريبي
											</label>
											<input
												id='taxNumber'
												type='text'
												{...register('taxNumber')}
												className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
												placeholder='الرقم الضريبي إن وجد'
											/>
										</div>

										{/* الموقع الإلكتروني */}
										<div>
											<label
												htmlFor='website'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												الموقع الإلكتروني
											</label>
											<input
												id='website'
												type='url'
												{...register('website')}
												className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
												placeholder='https://example.com'
											/>
											{errors.website && (
												<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
													{errors.website.message}
												</p>
											)}
										</div>

										{/* العنوان */}
										<div>
											<label
												htmlFor='address'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												العنوان <span className='text-red-500'>*</span>
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
													<MapPin className='h-5 w-5 text-gray-400 dark:text-gray-500' />
												</div>
												<input
													id='address'
													type='text'
													{...register('address')}
													className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
													placeholder='أدخل العنوان التفصيلي'
												/>
											</div>
											{errors.address && (
												<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
													{errors.address.message}
												</p>
											)}
										</div>

										{/* المدينة */}
										<div>
											<label
												htmlFor='city'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												المدينة <span className='text-red-500'>*</span>
											</label>
											<input
												id='city'
												type='text'
												{...register('city')}
												className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
												placeholder='أدخل المدينة'
											/>
											{errors.city && (
												<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
													{errors.city.message}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* معلومات المسؤول */}
							<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
								<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
									<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
										معلومات الشخص المسؤول
									</h2>
								</div>
								<div className='p-6 space-y-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										{/* اسم المسؤول */}
										<div>
											<label
												htmlFor='contactPerson.name'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												اسم المسؤول <span className='text-red-500'>*</span>
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
													<User className='h-5 w-5 text-gray-400 dark:text-gray-500' />
												</div>
												<input
													id='contactPerson.name'
													type='text'
													{...register('contactPerson.name')}
													className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
													placeholder='أدخل اسم الشخص المسؤول'
												/>
											</div>
											{errors.contactPerson?.name && (
												<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
													{errors.contactPerson.name.message}
												</p>
											)}
										</div>

										{/* المنصب */}
										<div>
											<label
												htmlFor='contactPerson.position'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												المنصب
											</label>
											<input
												id='contactPerson.position'
												type='text'
												{...register('contactPerson.position')}
												className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
												placeholder='مثال: مدير مبيعات'
											/>
										</div>

										{/* رقم هاتف المسؤول */}
										<div>
											<label
												htmlFor='contactPerson.phone'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												رقم الهاتف <span className='text-red-500'>*</span>
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
													<Phone className='h-5 w-5 text-gray-400 dark:text-gray-500' />
												</div>
												<input
													id='contactPerson.phone'
													type='text'
													{...register('contactPerson.phone')}
													className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
													placeholder='05xxxxxxxx'
												/>
											</div>
											{errors.contactPerson?.phone && (
												<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
													{errors.contactPerson.phone.message}
												</p>
											)}
										</div>

										{/* بريد المسؤول */}
										<div>
											<label
												htmlFor='contactPerson.email'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												البريد الإلكتروني
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
													<Mail className='h-5 w-5 text-gray-400 dark:text-gray-500' />
												</div>
												<input
													id='contactPerson.email'
													type='email'
													{...register('contactPerson.email')}
													className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
													placeholder='example@company.com'
												/>
											</div>
											{errors.contactPerson?.email && (
												<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
													{errors.contactPerson.email.message}
												</p>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* شروط الدفع */}
							<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
								<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
									<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>شروط الدفع</h2>
								</div>
								<div className='p-6 space-y-6'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										{/* طريقة الدفع */}
										<div>
											<label
												htmlFor='paymentTerms.method'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												طريقة الدفع <span className='text-red-500'>*</span>
											</label>
											<select
												id='paymentTerms.method'
												{...register('paymentTerms.method')}
												className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
											>
												<option value=''>اختر طريقة الدفع</option>
												{paymentMethods.map((method) => (
													<option key={method.id} value={method.id}>
														{method.name}
													</option>
												))}
											</select>
											{errors.paymentTerms?.method && (
												<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
													{errors.paymentTerms.method.message}
												</p>
											)}
										</div>

										{/* فترة الدفع (أيام) */}
										<div>
											<label
												htmlFor='paymentTerms.days'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												فترة الدفع (أيام)
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
													<Clock className='h-5 w-5 text-gray-400 dark:text-gray-500' />
												</div>
												<input
													id='paymentTerms.days'
													type='number'
													{...register('paymentTerms.days')}
													className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
													placeholder='30'
												/>
											</div>
											<p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
												عدد الأيام المسموح بها للدفع بعد الاستلام
											</p>
										</div>

										{/* نسبة الخصم */}
										<div>
											<label
												htmlFor='paymentTerms.discount'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												نسبة الخصم (%)
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
													<DollarSign className='h-5 w-5 text-gray-400 dark:text-gray-500' />
												</div>
												<input
													id='paymentTerms.discount'
													type='number'
													step='0.01'
													{...register('paymentTerms.discount')}
													className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
													placeholder='0'
												/>
											</div>
											<p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
												نسبة الخصم في حالة الدفع المبكر
											</p>
										</div>

										{/* اسم البنك */}
										<div>
											<label
												htmlFor='paymentTerms.bankName'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												اسم البنك
											</label>
											<input
												id='paymentTerms.bankName'
												type='text'
												{...register('paymentTerms.bankName')}
												className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
												placeholder='اسم البنك'
											/>
										</div>

										{/* رقم الحساب */}
										<div>
											<label
												htmlFor='paymentTerms.bankAccount'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												رقم الحساب البنكي
											</label>
											<input
												id='paymentTerms.bankAccount'
												type='text'
												{...register('paymentTerms.bankAccount')}
												className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
												placeholder='رقم الحساب (IBAN)'
											/>
										</div>

										{/* ملاحظات الدفع */}
										<div className='md:col-span-2'>
											<label
												htmlFor='paymentTerms.notes'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
											>
												ملاحظات الدفع
											</label>
											<textarea
												id='paymentTerms.notes'
												{...register('paymentTerms.notes')}
												rows={3}
												className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
												placeholder='أي ملاحظات متعلقة بالدفع'
											></textarea>
										</div>
									</div>
								</div>
							</div>

							{/* المنتجات */}
							<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
								<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
									<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
										المنتجات المتوفرة
									</h2>
									<button
										type='button'
										onClick={addProduct}
										className='inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
									>
										<Plus className='ml-1.5 -mr-1 h-4 w-4 text-gray-400 dark:text-gray-500' />
										إضافة منتج
									</button>
								</div>
								<div className='p-6'>
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

												<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
													{/* اسم المنتج */}
													<div className='md:col-span-2'>
														<label
															htmlFor={`products.${index}.name`}
															className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
														>
															اسم المنتج <span className='text-red-500'>*</span>
														</label>
														<input
															id={`products.${index}.name`}
															type='text'
															{...register(`products.${index}.name` as const)}
															className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
															placeholder='اسم المنتج'
														/>
														{errors.products?.[index]?.name && (
															<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
																{errors.products[index]?.name?.message}
															</p>
														)}
													</div>

													{/* رمز المنتج */}
													<div>
														<label
															htmlFor={`products.${index}.sku`}
															className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
														>
															رمز المنتج (SKU)
														</label>
														<input
															id={`products.${index}.sku`}
															type='text'
															{...register(`products.${index}.sku` as const)}
															className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
															placeholder='FB-123'
														/>
													</div>

													{/* فئة المنتج */}
													<div>
														<label
															htmlFor={`products.${index}.category`}
															className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
														>
															الفئة <span className='text-red-500'>*</span>
														</label>
														<select
															id={`products.${index}.category`}
															{...register(`products.${index}.category` as const)}
															className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
														>
															<option value=''>اختر الفئة</option>
															{categoryOptions.map((category) => (
																<option key={category.id} value={category.id}>
																	{category.name}
																</option>
															))}
														</select>
														{errors.products?.[index]?.category && (
															<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
																{errors.products[index]?.category?.message}
															</p>
														)}
													</div>

													{/* وحدة القياس */}
													<div>
														<label
															htmlFor={`products.${index}.unit`}
															className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
														>
															وحدة القياس <span className='text-red-500'>*</span>
														</label>
														<select
															id={`products.${index}.unit`}
															{...register(`products.${index}.unit` as const)}
															className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
														>
															<option value=''>اختر الوحدة</option>
															{unitOptions.map((unit) => (
																<option key={unit.id} value={unit.id}>
																	{unit.name}
																</option>
															))}
														</select>
														{errors.products?.[index]?.unit && (
															<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
																{errors.products[index]?.unit?.message}
															</p>
														)}
													</div>

													{/* سعر الشراء */}
													<div>
														<label
															htmlFor={`products.${index}.price`}
															className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
														>
															سعر الشراء
														</label>
														<div className='mt-1 relative rounded-md shadow-sm'>
															<input
																id={`products.${index}.price`}
																type='number'
																step='0.01'
																min='0'
																{...register(`products.${index}.price` as const)}
																className='block w-full pr-3 pl-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
																placeholder='0.00'
															/>
															<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
																<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
																	ر.س
																</span>
															</div>
														</div>
													</div>

													{/* الحد الأدنى للطلب */}
													<div>
														<label
															htmlFor={`products.${index}.minOrder`}
															className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
														>
															الحد الأدنى للطلب
														</label>
														<input
															id={`products.${index}.minOrder`}
															type='number'
															min='0'
															{...register(`products.${index}.minOrder` as const)}
															className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
															placeholder='1'
														/>
													</div>

													{/* وقت التسليم المتوقع */}
													<div>
														<label
															htmlFor={`products.${index}.leadTime`}
															className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
														>
															وقت التسليم المتوقع (أيام)
														</label>
														<input
															id={`products.${index}.leadTime`}
															type='number'
															min='0'
															{...register(`products.${index}.leadTime` as const)}
															className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
															placeholder='3'
														/>
													</div>
												</div>
											</div>
										))}

										{fields.length === 0 && (
											<div className='text-center py-6 bg-gray-50 dark:bg-gray-700 rounded-lg'>
												<FileText className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' />
												<h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
													لا توجد منتجات
												</h3>
												<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
													قم بإضافة المنتجات التي يوفرها هذا المورد
												</p>
												<div className='mt-4'>
													<button
														type='button'
														onClick={addProduct}
														className='inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 focus:outline-none'
													>
														<Plus className='ml-1.5 -mr-0.5 h-4 w-4' />
														إضافة منتج
													</button>
												</div>
											</div>
										)}

										{/* أزرار إضافة العناصر */}
										{fields.length > 0 && (
											<div className='flex justify-center pt-2'>
												<button
													type='button'
													onClick={addProduct}
													className='inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 focus:outline-none'
												>
													<Plus className='ml-1 h-4 w-4' />
													إضافة منتج آخر
												</button>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>

						{/* العمود الثاني: ملاحظات ووثائق */}
						<div className='space-y-6'>
							<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
								<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
									<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
										معلومات إضافية
									</h2>
								</div>
								<div className='p-6'>
									<div className='mb-6'>
										<label
											htmlFor='notes'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											ملاحظات حول المورد
										</label>
										<textarea
											id='notes'
											{...register('notes')}
											rows={5}
											className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
											placeholder='أي ملاحظات إضافية حول المورد'
										></textarea>
									</div>

									<div className='mt-6'>
										<h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
											الوثائق المرفقة
										</h3>

										<div className='space-y-3'>
											{/* وثيقة مرفقة (محاكاة) */}
											<div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600'>
												<div className='flex items-center'>
													<FileText className='h-5 w-5 text-gray-400 dark:text-gray-500 ml-2' />
													<div>
														<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
															عقد التوريد.pdf
														</p>
														<p className='text-xs text-gray-500 dark:text-gray-400'>
															تم الرفع في 15 مارس 2025
														</p>
													</div>
												</div>
												<div className='flex space-x-2 space-x-reverse'>
													<button
														type='button'
														className='text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
													>
														عرض
													</button>
													<button
														type='button'
														className='text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300'
													>
														حذف
													</button>
												</div>
											</div>

											{/* وثيقة أخرى (محاكاة) */}
											<div className='flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600'>
												<div className='flex items-center'>
													<FileText className='h-5 w-5 text-gray-400 dark:text-gray-500 ml-2' />
													<div>
														<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
															كتالوج_المنتجات_2025.pdf
														</p>
														<p className='text-xs text-gray-500 dark:text-gray-400'>
															تم الرفع في 10 أبريل 2025
														</p>
													</div>
												</div>
												<div className='flex space-x-2 space-x-reverse'>
													<button
														type='button'
														className='text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
													>
														عرض
													</button>
													<button
														type='button'
														className='text-red-600 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300'
													>
														حذف
													</button>
												</div>
											</div>
										</div>

										<div className='mt-4'>
											<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
												إضافة وثائق جديدة
											</label>
											<div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md'>
												<div className='space-y-1 text-center'>
													<div className='flex text-sm text-gray-600 dark:text-gray-400'>
														<label
															htmlFor='file-upload'
															className='relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 focus-within:outline-none'
														>
															<span>تحميل ملفات</span>
															<input
																id='file-upload'
																name='file-upload'
																type='file'
																multiple
																className='sr-only'
															/>
														</label>
														<p className='pr-1'>أو سحب وإفلات</p>
													</div>
													<p className='text-xs text-gray-500 dark:text-gray-400'>
														يمكنك تحميل عقود، اتفاقيات، كتالوجات المنتجات
													</p>
												</div>
											</div>
										</div>
									</div>

									<div className='mt-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-md p-4'>
										<div className='flex'>
											<div className='flex-shrink-0'>
												<AlertTriangle className='h-5 w-5 text-blue-500 dark:text-blue-400' />
											</div>
											<div className='mr-3'>
												<h3 className='text-sm font-medium text-blue-800 dark:text-blue-300'>
													معلومات التغييرات
												</h3>
												<div className='mt-2 text-sm text-blue-700 dark:text-blue-400'>
													<p className='mb-1'>آخر تحديث: 20 أبريل 2025</p>
													<p className='mb-1'>بواسطة: أحمد المطيري</p>
													<p>يتم حفظ سجل كامل للتغييرات في قاعدة البيانات</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* أزرار التحكم السفلية */}
					<div className='flex justify-end space-x-3 space-x-reverse'>
						<Link
							href={`/dashboard/suppliers/${supplierId}`}
							className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
						>
							إلغاء
						</Link>

						<button
							type='submit'
							disabled={isSubmitting || success || !isDirty}
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
			)}

			{/* مودال تأكيد الحذف */}
			<DeleteConfirmationModal />

			{/* مودال تأكيد الأرشفة */}
			<ArchiveConfirmationModal />
		</div>
	);
}
