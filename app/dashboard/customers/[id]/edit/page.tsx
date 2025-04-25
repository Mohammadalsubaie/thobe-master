// app/dashboard/customers/[id]/edit/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// أي هاتف سعودي (05xxxxxxxx أو +966xxxxxxxx)
const SAUDI_PHONE_REGEX = /^(05\d{8}|\+966\d{9})$/;

const customerSchema = z.object({
	firstName: z.string().min(2, { message: 'الاسم الأول يجب أن يكون حرفين على الأقل' }),
	lastName: z.string().min(2, { message: 'اسم العائلة يجب أن يكون حرفين على الأقل' }),
	phone: z
		.string()
		.regex(SAUDI_PHONE_REGEX, { message: 'رقم الهاتف غير صالح، يجب أن يكون على صيغة 05xxxxxxxx أو +966xxxxxxxx' }),
	email: z.string().email({ message: 'البريد الإلكتروني غير صالح' }).optional().or(z.literal('')),
	address: z.string().optional(),
	notes: z.string().optional(),
	measurements: z
		.object({
			height: z.coerce.number().positive({ message: 'الطول يجب أن يكون رقمًا موجبًا' }).optional(),
			shoulders: z.coerce.number().positive({ message: 'عرض الكتفين يجب أن يكون رقمًا موجبًا' }).optional(),
			chest: z.coerce.number().positive({ message: 'محيط الصدر يجب أن يكون رقمًا موجبًا' }).optional(),
			waist: z.coerce.number().positive({ message: 'محيط الخصر يجب أن يكون رقمًا موجبًا' }).optional(),
			hips: z.coerce.number().positive({ message: 'محيط الأرداف يجب أن يكون رقمًا موجبًا' }).optional(),
			sleeve: z.coerce.number().positive({ message: 'طول الكم يجب أن يكون رقمًا موجبًا' }).optional(),
			inseam: z.coerce.number().positive({ message: 'طول الساق الداخلي يجب أن يكون رقمًا موجبًا' }).optional(),
			neckSize: z.coerce.number().positive({ message: 'قياس الرقبة يجب أن يكون رقمًا موجبًا' }).optional(),
		})
		.optional(),
	isVIP: z.boolean().default(false),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

interface Customer extends CustomerFormValues {
	id: string;
	created_at: string;
	updated_at: string;
	orders_count: number;
	total_spent: number;
}

export default function EditCustomerPage() {
	const params = useParams();
	const customerId = params.id as string;
	const router = useRouter();

	const [customer, setCustomer] = useState<Customer | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState('');

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<CustomerFormValues>({
		resolver: zodResolver(customerSchema) as any,
		defaultValues: {
			firstName: '',
			lastName: '',
			phone: '',
			email: '',
			address: '',
			notes: '',
			isVIP: false,
			measurements: {
				height: undefined,
				shoulders: undefined,
				chest: undefined,
				waist: undefined,
				hips: undefined,
				sleeve: undefined,
				inseam: undefined,
				neckSize: undefined,
			},
		},
	});

	useEffect(() => {
		const fetchCustomer = async () => {
			try {
				setLoading(true);

				// Mock API call - replace with actual API call
				await new Promise((resolve) => setTimeout(resolve, 600));

				// Sample data for customer with ID 2
				const sampleCustomer = {
					id: '2',
					firstName: 'عبدالله',
					lastName: 'العتيبي',
					phone: '0512345678',
					email: 'abdullah@example.com',
					address: 'الرياض، حي النخيل، شارع الأمير سعود',
					notes: 'يفضل التواصل بعد العصر، عميل منتظم',
					isVIP: true,
					measurements: {
						height: 175,
						shoulders: 48,
						chest: 102,
						waist: 85,
						hips: 98,
						sleeve: 62,
						inseam: 80,
						neckSize: 42,
					},
					created_at: '2023-08-15T14:30:00Z',
					updated_at: '2024-03-22T10:15:00Z',
					orders_count: 8,
					total_spent: 4250,
				};

				setCustomer(sampleCustomer);

				// Set form values
				setValue('firstName', sampleCustomer.firstName);
				setValue('lastName', sampleCustomer.lastName);
				setValue('phone', sampleCustomer.phone);
				setValue('email', sampleCustomer.email || '');
				setValue('address', sampleCustomer.address || '');
				setValue('notes', sampleCustomer.notes || '');
				setValue('isVIP', sampleCustomer.isVIP);

				// Set measurements
				if (sampleCustomer.measurements) {
					Object.entries(sampleCustomer.measurements).forEach(([key, value]) => {
						setValue(`measurements.${key as keyof typeof sampleCustomer.measurements}`, value);
					});
				}
			} catch (error) {
				console.error('Error fetching customer:', error);
				setError('حدث خطأ أثناء تحميل بيانات العميل');
			} finally {
				setLoading(false);
			}
		};

		fetchCustomer();
	}, [customerId, setValue]);

	const onSubmit = handleSubmit(async (data) => {
		setSubmitting(true);
		setError('');

		try {
			// Mock API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			console.log('Updated customer data:', data);

			// Redirect to customer details page
			router.push(`/dashboard/customers/${customerId}`);
		} catch (error) {
			console.error('Error updating customer:', error);
			setError('حدث خطأ أثناء تحديث بيانات العميل');
		} finally {
			setSubmitting(false);
		}
	});

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<Loader2 className='animate-spin h-8 w-8 text-primary' />
				<span className='mr-2'>جاري تحميل البيانات...</span>
			</div>
		);
	}

	if (error && !customer) {
		return (
			<div className='bg-red-50 p-4 rounded-md'>
				<div className='text-red-700 font-medium'>{error}</div>
				<Link
					href='/dashboard/customers'
					className='mt-4 inline-flex items-center text-primary hover:underline'
				>
					<ArrowRight className='h-4 w-4 ml-1' />
					العودة إلى قائمة العملاء
				</Link>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div className='space-y-1'>
					<h1 className='text-2xl font-bold text-gray-800'>تعديل بيانات العميل</h1>
					<p className='text-gray-500'>
						تعديل معلومات {customer?.firstName} {customer?.lastName}
					</p>
				</div>
			</div>

			{error && (
				<div className='bg-red-50 p-4 rounded-md'>
					<div className='text-red-700'>{error}</div>
				</div>
			)}

			<div className='bg-white rounded-lg shadow-sm p-6'>
				<form onSubmit={onSubmit} className='space-y-8'>
					{/* البيانات الأساسية */}
					<div>
						<h2 className='text-lg font-medium text-gray-800 mb-4'>البيانات الأساسية</h2>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* الاسم الأول */}
							<div className='space-y-2'>
								<label htmlFor='firstName' className='block text-sm font-medium text-gray-700'>
									الاسم الأول <span className='text-red-500'>*</span>
								</label>
								<input
									id='firstName'
									type='text'
									{...register('firstName')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
								{errors.firstName && (
									<p className='text-red-500 text-xs mt-1'>{errors.firstName.message}</p>
								)}
							</div>

							{/* اسم العائلة */}
							<div className='space-y-2'>
								<label htmlFor='lastName' className='block text-sm font-medium text-gray-700'>
									اسم العائلة <span className='text-red-500'>*</span>
								</label>
								<input
									id='lastName'
									type='text'
									{...register('lastName')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
								{errors.lastName && (
									<p className='text-red-500 text-xs mt-1'>{errors.lastName.message}</p>
								)}
							</div>

							{/* رقم الهاتف */}
							<div className='space-y-2'>
								<label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
									رقم الهاتف <span className='text-red-500'>*</span>
								</label>
								<input
									id='phone'
									type='text'
									placeholder='05xxxxxxxx'
									{...register('phone')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
								{errors.phone && <p className='text-red-500 text-xs mt-1'>{errors.phone.message}</p>}
							</div>

							{/* البريد الإلكتروني */}
							<div className='space-y-2'>
								<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
									البريد الإلكتروني
								</label>
								<input
									id='email'
									type='email'
									{...register('email')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
								{errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email.message}</p>}
							</div>

							{/* العنوان */}
							<div className='space-y-2 md:col-span-2'>
								<label htmlFor='address' className='block text-sm font-medium text-gray-700'>
									العنوان
								</label>
								<input
									id='address'
									type='text'
									{...register('address')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
								{errors.address && (
									<p className='text-red-500 text-xs mt-1'>{errors.address.message}</p>
								)}
							</div>

							{/* ملاحظات */}
							<div className='space-y-2 md:col-span-2'>
								<label htmlFor='notes' className='block text-sm font-medium text-gray-700'>
									ملاحظات
								</label>
								<textarea
									id='notes'
									rows={3}
									{...register('notes')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								></textarea>
								{errors.notes && <p className='text-red-500 text-xs mt-1'>{errors.notes.message}</p>}
							</div>

							{/* عميل مميز */}
							<div className='space-y-2'>
								<div className='flex items-center'>
									<input
										id='isVIP'
										type='checkbox'
										{...register('isVIP')}
										className='h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded'
									/>
									<label htmlFor='isVIP' className='mr-2 block text-sm font-medium text-gray-700'>
										عميل مميز (VIP)
									</label>
								</div>
							</div>
						</div>
					</div>

					{/* القياسات */}
					<div>
						<h2 className='text-lg font-medium text-gray-800 mb-4'>القياسات (سم)</h2>
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
							{/* الطول */}
							<div className='space-y-2'>
								<label htmlFor='height' className='block text-sm font-medium text-gray-700'>
									الطول
								</label>
								<input
									id='height'
									type='number'
									step='0.1'
									{...register('measurements.height')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
								{errors.measurements?.height && (
									<p className='text-red-500 text-xs mt-1'>{errors.measurements.height.message}</p>
								)}
							</div>

							{/* عرض الكتفين */}
							<div className='space-y-2'>
								<label htmlFor='shoulders' className='block text-sm font-medium text-gray-700'>
									عرض الكتفين
								</label>
								<input
									id='shoulders'
									type='number'
									step='0.1'
									{...register('measurements.shoulders')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
								{errors.measurements?.shoulders && (
									<p className='text-red-500 text-xs mt-1'>{errors.measurements.shoulders.message}</p>
								)}
							</div>

							{/* محيط الصدر */}
							<div className='space-y-2'>
								<label htmlFor='chest' className='block text-sm font-medium text-gray-700'>
									محيط الصدر
								</label>
								<input
									id='chest'
									type='number'
									step='0.1'
									{...register('measurements.chest')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
								{errors.measurements?.chest && (
									<p className='text-red-500 text-xs mt-1'>{errors.measurements.chest.message}</p>
								)}
							</div>

							{/* محيط الخصر */}
							<div className='space-y-2'>
								<label htmlFor='waist' className='block text-sm font-medium text-gray-700'>
									محيط الخصر
								</label>
								<input
									id='waist'
									type='number'
									step='0.1'
									{...register('measurements.waist')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
								{errors.measurements?.waist && (
									<p className='text-red-500 text-xs mt-1'>{errors.measurements.waist.message}</p>
								)}
							</div>

							{/* محيط الأرداف */}
							<div className='space-y-2'>
								<label htmlFor='hips' className='block text-sm font-medium text-gray-700'>
									محيط الأرداف
								</label>
								<input
									id='hips'
									type='number'
									step='0.1'
									{...register('measurements.hips')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
								{errors.measurements?.hips && (
									<p className='text-red-500 text-xs mt-1'>{errors.measurements.hips.message}</p>
								)}
							</div>

							{/* طول الكم */}
							<div className='space-y-2'>
								<label htmlFor='sleeve' className='block text-sm font-medium text-gray-700'>
									طول الكم
								</label>
								<input
									id='sleeve'
									type='number'
									step='0.1'
									{...register('measurements.sleeve')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
								{errors.measurements?.sleeve && (
									<p className='text-red-500 text-xs mt-1'>{errors.measurements.sleeve.message}</p>
								)}
							</div>

							{/* طول الساق الداخلي */}
							<div className='space-y-2'>
								<label htmlFor='inseam' className='block text-sm font-medium text-gray-700'>
									طول الساق الداخلي
								</label>
								<input
									id='inseam'
									type='number'
									step='0.1'
									{...register('measurements.inseam')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
								{errors.measurements?.inseam && (
									<p className='text-red-500 text-xs mt-1'>{errors.measurements.inseam.message}</p>
								)}
							</div>

							{/* قياس الرقبة */}
							<div className='space-y-2'>
								<label htmlFor='neckSize' className='block text-sm font-medium text-gray-700'>
									قياس الرقبة
								</label>
								<input
									id='neckSize'
									type='number'
									step='0.1'
									{...register('measurements.neckSize')}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm'
								/>
								{errors.measurements?.neckSize && (
									<p className='text-red-500 text-xs mt-1'>{errors.measurements.neckSize.message}</p>
								)}
							</div>
						</div>
					</div>

					<div className='flex justify-end space-x-2 space-x-reverse'>
						<Link
							href={`/dashboard/customers/${customerId}`}
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
