'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const fabricSchema = z.object({
	name: z.string().min(2, { message: 'اسم القماش يجب أن يكون حرفين على الأقل' }),
	type: z.string().min(2, { message: 'نوع القماش يجب أن يكون حرفين على الأقل' }),
	color: z.string().min(2, { message: 'لون القماش يجب أن يكون حرفين على الأقل' }),
	pattern: z.string().optional().or(z.literal('')),
	price: z.coerce.number().positive({ message: 'السعر يجب أن يكون رقمًا موجبًا' }),
	quantity: z.coerce
		.number()
		.int({ message: 'الكمية يجب أن تكون رقمًا صحيحًا' })
		.nonnegative({ message: 'الكمية يجب أن تكون صفر أو أكثر' }),
	supplier: z.string().optional().or(z.literal('')),
	imageUrl: z.string().optional().or(z.literal('')),
});

type FabricFormValues = z.infer<typeof fabricSchema>;

export default function NewFabricPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FabricFormValues>({
		resolver: zodResolver(fabricSchema),
		defaultValues: {
			name: '',
			type: '',
			color: '',
			pattern: '',
			price: undefined,
			quantity: undefined,
			supplier: '',
			imageUrl: '',
		},
	});

	const onSubmit = async (data: FabricFormValues) => {
		setIsSubmitting(true);

		try {
			// Mock API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			console.log('Fabric data:', data);

			// Redirect to fabrics list
			router.push('/dashboard/inventory');
		} catch (error) {
			console.error('Error creating fabric:', error);
			// Handle error
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>إضافة قماش جديد</h1>
			</div>

			<div className='bg-white rounded-lg shadow-sm p-6'>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-2'>
							<label htmlFor='name' className='block text-sm font-medium text-gray-700'>
								اسم القماش <span className='text-red-500'>*</span>
							</label>
							<input
								id='name'
								type='text'
								{...register('name')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
							/>
							{errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name.message}</p>}
						</div>

						<div className='space-y-2'>
							<label htmlFor='type' className='block text-sm font-medium text-gray-700'>
								نوع القماش <span className='text-red-500'>*</span>
							</label>
							<input
								id='type'
								type='text'
								{...register('type')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
								placeholder='مثال: قطن، كتان، حرير'
							/>
							{errors.type && <p className='text-red-500 text-xs mt-1'>{errors.type.message}</p>}
						</div>

						<div className='space-y-2'>
							<label htmlFor='color' className='block text-sm font-medium text-gray-700'>
								اللون <span className='text-red-500'>*</span>
							</label>
							<input
								id='color'
								type='text'
								{...register('color')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
							/>
							{errors.color && <p className='text-red-500 text-xs mt-1'>{errors.color.message}</p>}
						</div>

						<div className='space-y-2'>
							<label htmlFor='pattern' className='block text-sm font-medium text-gray-700'>
								النقش
							</label>
							<input
								id='pattern'
								type='text'
								{...register('pattern')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
								placeholder='مثال: سادة، مخطط، مربعات'
							/>
							{errors.pattern && <p className='text-red-500 text-xs mt-1'>{errors.pattern.message}</p>}
						</div>

						<div className='space-y-2'>
							<label htmlFor='price' className='block text-sm font-medium text-gray-700'>
								السعر (ر.س) <span className='text-red-500'>*</span>
							</label>
							<input
								id='price'
								type='number'
								step='0.01'
								{...register('price')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
							/>
							{errors.price && <p className='text-red-500 text-xs mt-1'>{errors.price.message}</p>}
						</div>

						<div className='space-y-2'>
							<label htmlFor='quantity' className='block text-sm font-medium text-gray-700'>
								الكمية <span className='text-red-500'>*</span>
							</label>
							<input
								id='quantity'
								type='number'
								{...register('quantity')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
							/>
							{errors.quantity && <p className='text-red-500 text-xs mt-1'>{errors.quantity.message}</p>}
						</div>

						<div className='space-y-2'>
							<label htmlFor='supplier' className='block text-sm font-medium text-gray-700'>
								المورد
							</label>
							<input
								id='supplier'
								type='text'
								{...register('supplier')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
							/>
							{errors.supplier && <p className='text-red-500 text-xs mt-1'>{errors.supplier.message}</p>}
						</div>

						<div className='space-y-2'>
							<label htmlFor='imageUrl' className='block text-sm font-medium text-gray-700'>
								رابط الصورة
							</label>
							<input
								id='imageUrl'
								type='text'
								{...register('imageUrl')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
							/>
							{errors.imageUrl && <p className='text-red-500 text-xs mt-1'>{errors.imageUrl.message}</p>}
						</div>
					</div>

					<div className='flex justify-end space-x-2 space-x-reverse pt-4'>
						<Link
							href='/dashboard/inventory'
							className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
						>
							إلغاء
						</Link>
						<button
							type='submit'
							disabled={isSubmitting}
							className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
						>
							{isSubmitting ? 'جاري الحفظ...' : 'حفظ القماش'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
