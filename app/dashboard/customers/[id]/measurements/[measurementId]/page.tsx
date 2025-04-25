'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { MeasurementFormData } from '../../../../../..//types/measurement';
import MeasurementForm from '../../../../../../components/forms/MeasurementForm';

export default function NewMeasurementPage() {
	const params = useParams();
	const router = useRouter();
	const customerId = params.id as string;

	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (data: MeasurementFormData) => {
		setIsSubmitting(true);
		try {
			// Mock API call - replace with actual API call
			console.log('Submitting measurement data:', data);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirect to customer details page
			router.push(`/dashboard/customers/${customerId}`);
		} catch (error) {
			console.error('Error submitting measurement:', error);
			// Handle error
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>إضافة قياس جديد</h1>
			</div>

			<div className='bg-white rounded-lg shadow-sm p-6'>
				<div className='mb-6'>
					<Link href={`/dashboard/customers/${customerId}`} className='text-green-600 hover:text-green-800'>
						&larr; العودة إلى تفاصيل العميل
					</Link>
				</div>

				<MeasurementForm customerId={customerId} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
			</div>
		</div>
	);
}
