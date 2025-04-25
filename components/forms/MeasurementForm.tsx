'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const measurementSchema = z.object({
	id: z.string().optional(),
	length: z.coerce
		.number()
		.min(50, { message: 'الطول يجب أن يكون 50 سم على الأقل' })
		.max(150, { message: 'الطول يجب ألا يزيد عن 150 سم' }),
	shoulderWidth: z.coerce
		.number()
		.min(30, { message: 'عرض الكتف يجب أن يكون 30 سم على الأقل' })
		.max(80, { message: 'عرض الكتف يجب ألا يزيد عن 80 سم' }),
	chestWidth: z.coerce
		.number()
		.min(40, { message: 'عرض الصدر يجب أن يكون 40 سم على الأقل' })
		.max(120, { message: 'عرض الصدر يجب ألا يزيد عن 120 سم' }),
	waistWidth: z.coerce
		.number()
		.min(40, { message: 'عرض الخصر يجب أن يكون 40 سم على الأقل' })
		.max(120, { message: 'عرض الخصر يجب ألا يزيد عن 120 سم' }),
	hipWidth: z.coerce
		.number()
		.min(40, { message: 'عرض الورك يجب أن يكون 40 سم على الأقل' })
		.max(120, { message: 'عرض الورك يجب ألا يزيد عن 120 سم' }),
	sleeveLength: z.coerce
		.number()
		.min(40, { message: 'طول الكم يجب أن يكون 40 سم على الأقل' })
		.max(100, { message: 'طول الكم يجب ألا يزيد عن 100 سم' }),
	sleeveWidth: z.coerce
		.number()
		.min(15, { message: 'عرض الكم يجب أن يكون 15 سم على الأقل' })
		.max(50, { message: 'عرض الكم يجب ألا يزيد عن 50 سم' }),
	neckWidth: z.coerce
		.number()
		.min(30, { message: 'عرض الرقبة يجب أن يكون 30 سم على الأقل' })
		.max(60, { message: 'عرض الرقبة يجب ألا يزيد عن 60 سم' }),
	cuffStyle: z.string(),
	collarStyle: z.string(),
	sidePocketStyle: z.string(),
	frontPocketStyle: z.string(),
	embroideryDetails: z.string().optional().or(z.literal('')),
	notes: z.string().optional().or(z.literal('')),
});

type Measurement = z.infer<typeof measurementSchema>;

interface MeasurementFormProps {
	customerId: string;
	onSubmit: (data: Measurement) => void;
	initialData?: Partial<Measurement>;
	isSubmitting?: boolean;
}
export default function MeasurementForm({
	customerId,
	onSubmit,
	initialData,
	isSubmitting = false,
}: MeasurementFormProps) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Measurement>({
		resolver: zodResolver(measurementSchema),
		defaultValues: initialData || {
			length: 90,
			shoulderWidth: 45,
			chestWidth: 60,
			waistWidth: 60,
			hipWidth: 60,
			sleeveLength: 60,
			sleeveWidth: 25,
			neckWidth: 40,
			cuffStyle: 'regular',
			collarStyle: 'regular',
			sidePocketStyle: 'none',
			frontPocketStyle: 'none',
			embroideryDetails: '',
			notes: '',
		},
	});

	const cuffStyles = [
		{ id: 'regular', name: 'عادي' },
		{ id: 'button', name: 'أزرار' },
		{ id: 'double', name: 'دبل' },
	];

	const collarStyles = [
		{ id: 'regular', name: 'عادي' },
		{ id: 'mandarin', name: 'مندرين' },
		{ id: 'algasabi', name: 'القصبي' },
	];

	const pocketStyles = [
		{ id: 'none', name: 'بدون' },
		{ id: 'regular', name: 'عادي' },
		{ id: 'zipper', name: 'سحاب' },
		{ id: 'button', name: 'أزرار' },
	];

	const submitForm = (data: Measurement) => {
		onSubmit(data);
	};

	return (
		<form onSubmit={handleSubmit(submitForm)} className='space-y-6 bg-white p-6 rounded-lg shadow-sm'>
			<div className='text-xl font-bold text-green-800 mb-6'>قياسات الثوب</div>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='space-y-2'>
					<label htmlFor='length' className='block text-sm font-medium text-gray-700'>
						طول الثوب (سم)
					</label>
					<input
						id='length'
						type='number'
						{...register('length')}
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
					/>
					{errors.length && <p className='text-red-500 text-xs mt-1'>{errors.length.message}</p>}
				</div>

				<div className='space-y-2'>
					<label htmlFor='shoulderWidth' className='block text-sm font-medium text-gray-700'>
						عرض الكتف (سم)
					</label>
					<input
						id='shoulderWidth'
						type='number'
						{...register('shoulderWidth')}
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
					/>
					{errors.shoulderWidth && (
						<p className='text-red-500 text-xs mt-1'>{errors.shoulderWidth.message}</p>
					)}
				</div>

				<div className='space-y-2'>
					<label htmlFor='chestWidth' className='block text-sm font-medium text-gray-700'>
						عرض الصدر (سم)
					</label>
					<input
						id='chestWidth'
						type='number'
						{...register('chestWidth')}
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
					/>
					{errors.chestWidth && <p className='text-red-500 text-xs mt-1'>{errors.chestWidth.message}</p>}
				</div>

				<div className='space-y-2'>
					<label htmlFor='waistWidth' className='block text-sm font-medium text-gray-700'>
						عرض الخصر (سم)
					</label>
					<input
						id='waistWidth'
						type='number'
						{...register('waistWidth')}
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
					/>
					{errors.waistWidth && <p className='text-red-500 text-xs mt-1'>{errors.waistWidth.message}</p>}
				</div>

				<div className='space-y-2'>
					<label htmlFor='hipWidth' className='block text-sm font-medium text-gray-700'>
						عرض الورك (سم)
					</label>
					<input
						id='hipWidth'
						type='number'
						{...register('hipWidth')}
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
					/>
					{errors.hipWidth && <p className='text-red-500 text-xs mt-1'>{errors.hipWidth.message}</p>}
				</div>

				<div className='space-y-2'>
					<label htmlFor='sleeveLength' className='block text-sm font-medium text-gray-700'>
						طول الكم (سم)
					</label>
					<input
						id='sleeveLength'
						type='number'
						{...register('sleeveLength')}
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
					/>
					{errors.sleeveLength && <p className='text-red-500 text-xs mt-1'>{errors.sleeveLength.message}</p>}
				</div>

				<div className='space-y-2'>
					<label htmlFor='sleeveWidth' className='block text-sm font-medium text-gray-700'>
						عرض الكم (سم)
					</label>
					<input
						id='sleeveWidth'
						type='number'
						{...register('sleeveWidth')}
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
					/>
					{errors.sleeveWidth && <p className='text-red-500 text-xs mt-1'>{errors.sleeveWidth.message}</p>}
				</div>

				<div className='space-y-2'>
					<label htmlFor='neckWidth' className='block text-sm font-medium text-gray-700'>
						عرض الرقبة (سم)
					</label>
					<input
						id='neckWidth'
						type='number'
						{...register('neckWidth')}
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:



			border-green-500 focus:ring-green-500 sm:text-sm'
					/>
					{errors.neckWidth && <p className='text-red-500 text-xs mt-1'>{errors.neckWidth.message}</p>}
				</div>

				<div className='space-y-2'>
					<label htmlFor='cuffStyle' className='block text-sm font-medium text-gray-700'>
						نوع الكبك
					</label>
					<select
						id='cuffStyle'
						{...register('cuffStyle')}
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
					>
						{cuffStyles.map((style) => (
							<option key={style.id} value={style.id}>
								{style.name}
							</option>
						))}
					</select>
					{errors.cuffStyle && <p className='text-red-500 text-xs mt-1'>{errors.cuffStyle.message}</p>}
				</div>

				<div className='space-y-2'>
					<label htmlFor='collarStyle' className='block text-sm font-medium text-gray-700'>
						نوع الياقة
					</label>
					<select
						id='collarStyle'
						{...register('collarStyle')}
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
					>
						{collarStyles.map((style) => (
							<option key={style.id} value={style.id}>
								{style.name}
							</option>
						))}
					</select>
					{errors.collarStyle && <p className='text-red-500 text-xs mt-1'>{errors.collarStyle.message}</p>}
				</div>

				<div className='space-y-2'>
					<label htmlFor='sidePocketStyle' className='block text-sm font-medium text-gray-700'>
						نوع الجيب الجانبي
					</label>
					<select
						id='sidePocketStyle'
						{...register('sidePocketStyle')}
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
					>
						{pocketStyles.map((style) => (
							<option key={style.id} value={style.id}>
								{style.name}
							</option>
						))}
					</select>
					{errors.sidePocketStyle && (
						<p className='text-red-500 text-xs mt-1'>{errors.sidePocketStyle.message}</p>
					)}
				</div>

				<div className='space-y-2'>
					<label htmlFor='frontPocketStyle' className='block text-sm font-medium text-gray-700'>
						نوع الجيب الأمامي
					</label>
					<select
						id='frontPocketStyle'
						{...register('frontPocketStyle')}
						className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
					>
						{pocketStyles.map((style) => (
							<option key={style.id} value={style.id}>
								{style.name}
							</option>
						))}
					</select>
					{errors.frontPocketStyle && (
						<p className='text-red-500 text-xs mt-1'>{errors.frontPocketStyle.message}</p>
					)}
				</div>
			</div>

			<div className='space-y-2'>
				<label htmlFor='embroideryDetails' className='block text-sm font-medium text-gray-700'>
					تفاصيل التطريز (اختياري)
				</label>
				<textarea
					id='embroideryDetails'
					{...register('embroideryDetails')}
					rows={3}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
				/>
				{errors.embroideryDetails && (
					<p className='text-red-500 text-xs mt-1'>{errors.embroideryDetails.message}</p>
				)}
			</div>

			<div className='space-y-2'>
				<label htmlFor='notes' className='block text-sm font-medium text-gray-700'>
					ملاحظات إضافية (اختياري)
				</label>
				<textarea
					id='notes'
					{...register('notes')}
					rows={3}
					className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
				/>
				{errors.notes && <p className='text-red-500 text-xs mt-1'>{errors.notes.message}</p>}
			</div>

			<div className='flex justify-end'>
				<button
					type='submit'
					disabled={isSubmitting}
					className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed'
				>
					{isSubmitting ? 'جاري الحفظ...' : 'حفظ القياسات'}
				</button>
			</div>
		</form>
	);
}
