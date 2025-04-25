'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const customerSchema = z.object({
	name: z.string().min(3, { message: 'الاسم يجب أن يكون 3 أحرف على الأقل' }),
	phone: z.string().regex(/^9665\d{8}$/, { message: 'رقم الهاتف يجب أن يبدأ بـ 9665 ويتكون من 12 رقم' }),
	email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }).optional().or(z.literal('')),
	address: z.string().optional().or(z.literal('')),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export default function NewCustomerPage() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<CustomerFormValues>({
		resolver: zodResolver(customerSchema),
		defaultValues: {
			name: '',
			phone: '9665',
			email: '',
			address: '',
		},
	});

	const onSubmit = async (data: CustomerFormValues) => {
		setIsSubmitting(true);

		try {
			// Mock API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			console.log('Customer data:', data);

			// Redirect to customers list or to the new customer's page
			router.push('/dashboard/customers');
		} catch (error) {
			console.error('Error creating customer:', error);
			// Handle error
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>إضافة عميل جديد</h1>
			</div>

			<div className='bg-white rounded-lg shadow-sm p-6'>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-2'>
							<label htmlFor='name' className='block text-sm font-medium text-gray-700'>
								الاسم الكامل <span className='text-red-500'>*</span>
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
							<label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
								رقم الهاتف <span className='text-red-500'>*</span>
							</label>
							<input
								id='phone'
								type='text'
								{...register('phone')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
								placeholder='9665xxxxxxxx'
							/>
							{errors.phone && <p className='text-red-500 text-xs mt-1'>{errors.phone.message}</p>}
						</div>

						<div className='space-y-2'>
							<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
								البريد الإلكتروني
							</label>
							<input
								id='email'
								type='email'
								{...register('email')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
							/>
							{errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
						</div>

						<div className='space-y-2'>
							<label htmlFor='address' className='block text-sm font-medium text-gray-700'>
								العنوان
							</label>
							<input
								id='address'
								type='text'
								{...register('address')}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
							/>
							{errors.address && <p className='text-red-500 text-xs mt-1'>{errors.address.message}</p>}
						</div>
					</div>

					<div className='flex justify-end space-x-2 space-x-reverse pt-4'>
						<Link
							href='/dashboard/customers'
							className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
						>
							إلغاء
						</Link>
						<button
							type='submit'
							disabled={isSubmitting}
							className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
						>
							{isSubmitting ? 'جاري الحفظ...' : 'حفظ العميل'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
