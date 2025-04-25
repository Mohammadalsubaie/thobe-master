'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import MeasurementForm from '../../../../../../../components/forms/MeasurementForm';
import { Measurement, MeasurementFormData } from '../../../../../../../types/';

export default function EditMeasurementPage() {
	const params = useParams();
	const router = useRouter();
	const customerId = params.id as string;
	const measurementId = params.measurementId as string;

	const [measurement, setMeasurement] = useState<Measurement | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const fetchMeasurement = async () => {
			try {
				// Mock API call - replace with actual API call
				setTimeout(() => {
					setMeasurement({
						id: measurementId,
						customerId: customerId,
						createdAt: new Date('2025-01-15'),
						updatedAt: new Date('2025-01-15'),
						length: 90,
						shoulderWidth: 45,
						chestWidth: 60,
						waistWidth: 60,
						hipWidth: 60,
						sleeveLength: 60,
						sleeveWidth: 25,
						neckWidth: 40,
						cuffStyle: 'regular',
						collarStyle: 'mandarin',
						sidePocketStyle: 'regular',
						frontPocketStyle: 'none',
						embroideryDetails: 'تطريز بسيط على الصدر',
						notes: 'يفضل العميل أن يكون الثوب فضفاضًا قليلاً',
					});
					setIsLoading(false);
				}, 1000);
			} catch (error) {
				console.error('Error fetching measurement:', error);
				setIsLoading(false);
			}
		};

		fetchMeasurement();
	}, [customerId, measurementId]);

	const handleSubmit = async (data: MeasurementFormData) => {
		setIsSubmitting(true);
		try {
			// Mock API call - replace with actual API call
			console.log('Updating measurement data:', data);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirect to measurement details page
			router.push(`/dashboard/customers/${customerId}/measurements/${measurementId}`);
		} catch (error) {
			console.error('Error updating measurement:', error);
			// Handle error
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading) {
		return <div className='flex items-center justify-center h-96'>جاري التحميل...</div>;
	}

	if (!measurement) {
		return <div className='text-center py-8'>لم يتم العثور على القياس</div>;
	}

	const initialData: MeasurementFormData = {
		length: measurement.length,
		shoulderWidth: measurement.shoulderWidth,
		chestWidth: measurement.chestWidth,
		waistWidth: measurement.waistWidth,
		hipWidth: measurement.hipWidth,
		sleeveLength: measurement.sleeveLength,
		sleeveWidth: measurement.sleeveWidth,
		neckWidth: measurement.neckWidth,
		cuffStyle: measurement.cuffStyle,
		collarStyle: measurement.collarStyle,
		sidePocketStyle: measurement.sidePocketStyle,
		frontPocketStyle: measurement.frontPocketStyle,
		embroideryDetails: measurement.embroideryDetails,
		notes: measurement.notes,
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>تعديل القياس</h1>
			</div>

			<div className='bg-white rounded-lg shadow-sm p-6'>
				<div className='mb-6'>
					<Link
						href={`/dashboard/customers/${customerId}/measurements/${measurementId}`}
						className='text-green-600 hover:text-green-800'
					>
						&larr; العودة إلى تفاصيل القياس
					</Link>
				</div>

				<MeasurementForm
					customerId={customerId}
					onSubmit={handleSubmit}
					initialData={initialData}
					isSubmitting={isSubmitting}
				/>
			</div>
		</div>
	);
}
