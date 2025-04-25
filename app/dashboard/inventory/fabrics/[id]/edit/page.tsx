// app/dashboard/inventory/fabrics/[id]/edit/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

// تعريف المخطط مع تحديد واضح لجميع الحقول (فرض in_stock كـ boolean)
const fabricSchema = z.object({
	name: z.string().min(2, { message: 'اسم القماش يجب أن يكون حرفين على الأقل' }),
	color: z.string().min(2, { message: 'اللون يجب أن يكون حرفين على الأقل' }),
	material: z.string().min(2, { message: 'نوع المادة يجب أن يكون حرفين على الأقل' }),
	width: z.coerce.number().positive({ message: 'العرض يجب أن يكون رقمًا موجبًا' }),
	length: z.coerce.number().positive({ message: 'الطول المتبقي يجب أن يكون رقمًا موجبًا' }),
	price_per_meter: z.coerce.number().positive({ message: 'السعر يجب أن يكون رقمًا موجبًا' }),
	supplier: z.string().optional(),
	description: z.string().optional(),
	in_stock: z.boolean(), // حذف .default() للتأكد من توافق الأنواع
	reorder_level: z.coerce.number().nonnegative({ message: 'مستوى إعادة الطلب يجب أن يكون صفر أو أكثر' }).optional(),
});

// استخراج النوع من المخطط
type FabricFormValues = z.infer<typeof fabricSchema>;

// تعريف واجهة البيانات المسترجعة
interface Fabric {
	id: string;
	name: string;
	color: string;
	material: string;
	width: number;
	length: number;
	price_per_meter: number;
	supplier: string;
	description: string;
	in_stock: boolean;
	reorder_level: number;
}

export default function EditFabricPage() {
	const params = useParams();
	const fabricId = params.id as string;
	const router = useRouter();

	const [fabric, setFabric] = useState<Fabric | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	// إعداد النموذج
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FabricFormValues>({
		resolver: zodResolver(fabricSchema) as any, // استخدام any كحل مؤقت لمشكلة التوافق
		defaultValues: {
			name: '',
			color: '',
			material: '',
			width: 0,
			length: 0,
			price_per_meter: 0,
			supplier: '',
			description: '',
			in_stock: true,
			reorder_level: 0,
		},
	});

	useEffect(() => {
		const fetchFabric = async () => {
			try {
				setLoading(true);

				// بيانات نموذجية
				await new Promise((resolve) => setTimeout(resolve, 600));

				const sampleFabric: Fabric = {
					id: 'f1',
					name: 'قطن مصري',
					color: 'أبيض',
					material: 'قطن 100%',
					width: 150,
					length: 45.5,
					price_per_meter: 28.5,
					supplier: 'مصانع النسيج المصرية',
					description: 'قماش قطني مصري عالي الجودة مناسب للثياب الرسمية',
					in_stock: true,
					reorder_level: 10,
				};

				setFabric(sampleFabric);

				// تعبئة قيم النموذج
				Object.entries(sampleFabric).forEach(([key, value]) => {
					if (key !== 'id') {
						setValue(key as keyof FabricFormValues, value as any);
					}
				});
			} catch (error) {
				console.error('Error fetching fabric:', error);
				setError('حدث خطأ أثناء تحميل بيانات القماش');
			} finally {
				setLoading(false);
			}
		};

		fetchFabric();
	}, [fabricId, setValue]);

	// معالج الإرسال مع الإشارة إلى النوع الصحيح
	const onSubmitForm: SubmitHandler<FabricFormValues> = async (data) => {
		setSubmitting(true);
		setError('');

		try {
			// محاكاة API
			await new Promise((resolve) => setTimeout(resolve, 1000));

			console.log('Updated fabric data:', data);

			// إعادة التوجيه
			router.push(`/dashboard/inventory/fabrics/${fabricId}`);
		} catch (error) {
			console.error('Error updating fabric:', error);
			setError('حدث خطأ أثناء تحديث بيانات القماش');
		} finally {
			setSubmitting(false);
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<Loader2 className='animate-spin h-8 w-8 text-primary' />
				<span className='mr-2'>جاري تحميل البيانات...</span>
			</div>
		);
	}

	if (error && !fabric) {
		return (
			<div className='bg-red-50 p-4 rounded-md'>
				<div className='text-red-700 font-medium'>{error}</div>
				<Link
					href='/dashboard/inventory/fabrics'
					className='mt-4 inline-flex items-center text-primary hover:underline'
				>
					<ArrowRight className='h-4 w-4 ml-1' />
					العودة إلى قائمة الأقمشة
				</Link>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div className='space-y-1'>
					<h1 className='text-2xl font-bold text-gray-800'>تعديل بيانات القماش</h1>
					<p className='text-gray-500'>تعديل معلومات قماش {fabric?.name}</p>
				</div>
			</div>

			{error && (
				<div className='bg-red-50 p-4 rounded-md'>
					<div className='text-red-700'>{error}</div>
				</div>
			)}

			<div className='bg-white rounded-lg shadow-sm p-6'>
				<form onSubmit={handleSubmit(onSubmitForm)} className='space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* اسم القماش */}
						<div className='space-y-2'>
							<label htmlFor='name' className='block text-sm font-medium text-gray-700'>
								اسم القماش <span className='text-red-500'>*</span>
							</label>
							<input
								id='name'
								type='text'
								{...register('name')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
							/>
							{errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
						</div>

						{/* اللون */}
						<div className='space-y-2'>
							<label htmlFor='color' className='block text-sm font-medium text-gray-700'>
								اللون <span className='text-red-500'>*</span>
							</label>
							<input
								id='color'
								type='text'
								{...register('color')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
							/>
							{errors.color && <p className='text-red-500 text-xs mt-1'>{errors.color.message}</p>}
						</div>

						{/* نوع المادة */}
						<div className='space-y-2'>
							<label htmlFor='material' className='block text-sm font-medium text-gray-700'>
								نوع المادة <span className='text-red-500'>*</span>
							</label>
							<input
								id='material'
								type='text'
								{...register('material')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
							/>
							{errors.material && <p className='text-red-500 text-xs mt-1'>{errors.material.message}</p>}
						</div>

						{/* عرض القماش */}
						<div className='space-y-2'>
							<label htmlFor='width' className='block text-sm font-medium text-gray-700'>
								العرض (سم) <span className='text-red-500'>*</span>
							</label>
							<input
								id='width'
								type='number'
								step='0.1'
								{...register('width')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
							/>
							{errors.width && <p className='text-red-500 text-xs mt-1'>{errors.width.message}</p>}
						</div>

						{/* الطول المتبقي */}
						<div className='space-y-2'>
							<label htmlFor='length' className='block text-sm font-medium text-gray-700'>
								الطول المتبقي (متر) <span className='text-red-500'>*</span>
							</label>
							<input
								id='length'
								type='number'
								step='0.1'
								{...register('length')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
							/>
							{errors.length && <p className='text-red-500 text-xs mt-1'>{errors.length.message}</p>}
						</div>

						{/* سعر المتر */}
						<div className='space-y-2'>
							<label htmlFor='price_per_meter' className='block text-sm font-medium text-gray-700'>
								سعر المتر (ر.س) <span className='text-red-500'>*</span>
							</label>
							<input
								id='price_per_meter'
								type='number'
								step='0.01'
								{...register('price_per_meter')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
							/>
							{errors.price_per_meter && (
								<p className='text-red-500 text-xs mt-1'>{errors.price_per_meter.message}</p>
							)}
						</div>

						{/* المورد */}
						<div className='space-y-2'>
							<label htmlFor='supplier' className='block text-sm font-medium text-gray-700'>
								المورد
							</label>
							<input
								id='supplier'
								type='text'
								{...register('supplier')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
							/>
							{errors.supplier && <p className='text-red-500 text-xs mt-1'>{errors.supplier.message}</p>}
						</div>

						{/* مستوى إعادة الطلب */}
						<div className='space-y-2'>
							<label htmlFor='reorder_level' className='block text-sm font-medium text-gray-700'>
								مستوى إعادة الطلب (متر)
							</label>
							<input
								id='reorder_level'
								type='number'
								step='0.1'
								{...register('reorder_level')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
							/>
							{errors.reorder_level && (
								<p className='text-red-500 text-xs mt-1'>{errors.reorder_level.message}</p>
							)}
						</div>

						{/* متوفر في المخزون */}
						<div className='space-y-2'>
							<div className='flex items-center'>
								<input
									id='in_stock'
									type='checkbox'
									{...register('in_stock')}
									className='h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded'
								/>
								<label htmlFor='in_stock' className='mr-2 block text-sm font-medium text-gray-700'>
									متوفر في المخزون
								</label>
							</div>
						</div>

						{/* الوصف */}
						<div className='space-y-2 md:col-span-2'>
							<label htmlFor='description' className='block text-sm font-medium text-gray-700'>
								الوصف
							</label>
							<textarea
								id='description'
								rows={3}
								{...register('description')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
							></textarea>
							{errors.description && (
								<p className='text-red-500 text-xs mt-1'>{errors.description.message}</p>
							)}
						</div>
					</div>

					<div className='flex justify-end space-x-2 space-x-reverse'>
						<Link
							href={`/dashboard/inventory/fabrics/${fabricId}`}
							className='px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary'
						>
							إلغاء
						</Link>
						<button
							type='submit'
							disabled={submitting}
							className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed'
						>
							{submitting ? (
								<>
									<Loader2 className='animate-spin h-4 w-4 inline ml-1' />
									جاري الحفظ...
								</>
							) : (
								'حفظ التغييرات'
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
