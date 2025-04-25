'use client';

import { Calendar, ChevronDown, DollarSign, Package, Ruler, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Customer {
	id: string;
	name: string;
}

interface Measurement {
	id: string;
	createdAt: string;
	isDefault: boolean;
}

interface Fabric {
	id: string;
	name: string;
	color: string;
	price: number;
	quantity: number;
}

interface Tailor {
	id: string;
	name: string;
	role: string;
}

export default function NewOrderPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialCustomerId = searchParams.get('customerId');
	const initialMeasurementId = searchParams.get('measurementId');

	const [customers, setCustomers] = useState<Customer[]>([]);
	const [measurements, setMeasurements] = useState<Measurement[]>([]);
	const [fabrics, setFabrics] = useState<Fabric[]>([]);
	const [tailors, setTailors] = useState<Tailor[]>([]);

	const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomerId || '');
	const [selectedMeasurementId, setSelectedMeasurementId] = useState<string>(initialMeasurementId || '');
	const [selectedFabricId, setSelectedFabricId] = useState<string>('');
	const [selectedTailorId, setSelectedTailorId] = useState<string>('');
	const [selectedFactoryTailorId, setSelectedFactoryTailorId] = useState<string>('');
	const [deliveryDate, setDeliveryDate] = useState<string>('');
	const [price, setPrice] = useState<string>('');
	const [notes, setNotes] = useState<string>('');

	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// Fetch initial data
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Mock data - replace with actual API calls
				setTimeout(() => {
					// Mock customers
					const mockCustomers = Array.from({ length: 10 }, (_, index) => ({
						id: `c${index + 1}`,
						name: [
							'أحمد محمد',
							'خالد عبدالله',
							'محمد سعيد',
							'عبدالعزيز سالم',
							'فهد العنزي',
							'سعد القحطاني',
							'عمر العمري',
							'سلطان السلطان',
							'راشد الدوسري',
							'فيصل الفيصل',
						][index],
					}));

					setCustomers(mockCustomers);

					// If a customer is selected (from query params), fetch their measurements
					if (initialCustomerId) {
						const mockMeasurements = Array.from({ length: 3 }, (_, index) => {
							const date = new Date();
							date.setMonth(date.getMonth() - index);
							return {
								id: `m${index + 1}`,
								createdAt: date.toISOString().split('T')[0],
								isDefault: index === 0,
							};
						});
						setMeasurements(mockMeasurements);

						// If a measurement is selected (from query params), pre-select it
						if (initialMeasurementId) {
							setSelectedMeasurementId(initialMeasurementId);
						} else if (mockMeasurements.length > 0) {
							// Select default measurement if available
							const defaultMeasurement = mockMeasurements.find((m) => m.isDefault);
							if (defaultMeasurement) {
								setSelectedMeasurementId(defaultMeasurement.id);
							}
						}
					}

					// Mock fabrics
					const mockFabrics = [
						{ id: 'f1', name: 'قطن مصري', color: 'أبيض', price: 150, quantity: 50 },
						{ id: 'f2', name: 'قطن مصري', color: 'أسود', price: 150, quantity: 30 },
						{ id: 'f3', name: 'كتان', color: 'بيج', price: 180, quantity: 25 },
						{ id: 'f4', name: 'كتان', color: 'أزرق فاتح', price: 180, quantity: 20 },
						{ id: 'f5', name: 'حرير', color: 'أبيض', price: 250, quantity: 15 },
					];
					setFabrics(mockFabrics);

					// Mock tailors
					const mockTailors = [
						{ id: 't1', name: 'عمر الخياط', role: 'tailor' },
						{ id: 't2', name: 'سعد الحربي', role: 'tailor' },
						{ id: 't3', name: 'عبدالله التميمي', role: 'factory' },
						{ id: 't4', name: 'محمد السالم', role: 'factory' },
						{ id: 't5', name: 'خالد الخالدي', role: 'factory' },
					];
					setTailors(mockTailors);

					setIsLoading(false);
				}, 1000);
			} catch (error) {
				console.error('Error fetching data:', error);
				setIsLoading(false);
			}
		};

		fetchData();
	}, [initialCustomerId, initialMeasurementId]);

	// Fetch measurements when customer changes
	useEffect(() => {
		if (selectedCustomerId && selectedCustomerId !== initialCustomerId) {
			setIsLoading(true);

			// Mock API call to get measurements for the selected customer
			setTimeout(() => {
				const mockMeasurements = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, index) => {
					const date = new Date();
					date.setMonth(date.getMonth() - index);
					return {
						id: `m${index + 1}`,
						createdAt: date.toISOString().split('T')[0],
						isDefault: index === 0,
					};
				});

				setMeasurements(mockMeasurements);

				// Select default measurement if available
				if (mockMeasurements.length > 0) {
					const defaultMeasurement = mockMeasurements.find((m) => m.isDefault);
					if (defaultMeasurement) {
						setSelectedMeasurementId(defaultMeasurement.id);
					} else {
						setSelectedMeasurementId(mockMeasurements[0].id);
					}
				} else {
					setSelectedMeasurementId('');
				}

				setIsLoading(false);
			}, 500);
		}
	}, [selectedCustomerId, initialCustomerId]);

	// Update price when fabric changes
	useEffect(() => {
		if (selectedFabricId) {
			const selectedFabric = fabrics.find((fabric) => fabric.id === selectedFabricId);
			if (selectedFabric) {
				// Base price is fabric price plus labor
				const basePrice = selectedFabric.price + 150;
				setPrice(basePrice.toString());
			}
		}
	}, [selectedFabricId, fabrics]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);

		// Validate form
		if (!selectedCustomerId) {
			setErrorMessage('الرجاء اختيار عميل');
			return;
		}

		if (!selectedMeasurementId) {
			setErrorMessage('الرجاء اختيار قياس');
			return;
		}

		if (!selectedFabricId) {
			setErrorMessage('الرجاء اختيار قماش');
			return;
		}

		if (!selectedTailorId) {
			setErrorMessage('الرجاء اختيار خياط');
			return;
		}

		if (!selectedFactoryTailorId) {
			setErrorMessage('الرجاء اختيار خياط المصنع');
			return;
		}

		if (!price || isNaN(Number(price)) || Number(price) <= 0) {
			setErrorMessage('الرجاء إدخال سعر صحيح');
			return;
		}

		setIsSubmitting(true);

		try {
			// Mock API call - replace with actual API call
			console.log('Creating order with data:', {
				customerId: selectedCustomerId,
				measurementId: selectedMeasurementId,
				fabricId: selectedFabricId,
				assignedTailorId: selectedTailorId,
				factoryTailorId: selectedFactoryTailorId,
				deliveryDate: deliveryDate || null,
				price: Number(price),
				notes: notes || null,
			});

			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirect to orders list
			router.push('/dashboard/orders');
		} catch (error) {
			console.error('Error creating order:', error);
			setErrorMessage('حدث خطأ أثناء إنشاء الطلب. الرجاء المحاولة مرة أخرى.');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (isLoading && !isSubmitting) {
		return <div className='flex items-center justify-center h-96'>جاري التحميل...</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>إنشاء طلب جديد</h1>
			</div>

			<div className='bg-white rounded-lg shadow-sm p-6'>
				<form onSubmit={handleSubmit} className='space-y-6'>
					{errorMessage && (
						<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md'>
							{errorMessage}
						</div>
					)}

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-2'>
							<label
								htmlFor='customer'
								className='block text-sm font-medium text-gray-700 flex items-center'
							>
								<User className='h-4 w-4 ml-1 text-gray-400' />
								العميل <span className='text-red-500'>*</span>
							</label>
							<div className='relative'>
								<select
									id='customer'
									className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
									value={selectedCustomerId}
									onChange={(e) => setSelectedCustomerId(e.target.value)}
									disabled={isSubmitting}
								>
									<option value=''>اختر عميل</option>
									{customers.map((customer) => (
										<option key={customer.id} value={customer.id}>
											{customer.name}
										</option>
									))}
								</select>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<ChevronDown className='h-5 w-5 text-gray-400' />
								</div>
							</div>
							{selectedCustomerId && (
								<div className='mt-2 text-sm'>
									<Link
										href={`/dashboard/customers/${selectedCustomerId}/measurements/new`}
										className='text-green-600 hover:text-green-800'
									>
										+ إضافة قياس جديد
									</Link>
								</div>
							)}
						</div>

						<div className='space-y-2'>
							<label
								htmlFor='measurement'
								className='block text-sm font-medium text-gray-700 flex items-center'
							>
								<Ruler className='h-4 w-4 ml-1 text-gray-400' />
								القياس <span className='text-red-500'>*</span>
							</label>
							<div className='relative'>
								<select
									id='measurement'
									className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
									value={selectedMeasurementId}
									onChange={(e) => setSelectedMeasurementId(e.target.value)}
									disabled={!selectedCustomerId || measurements.length === 0 || isSubmitting}
								>
									<option value=''>اختر قياس</option>
									{measurements.map((measurement) => (
										<option key={measurement.id} value={measurement.id}>
											قياس {new Date(measurement.createdAt).toLocaleDateString('ar-SA')}
											{measurement.isDefault ? ' (افتراضي)' : ''}
										</option>
									))}
								</select>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<ChevronDown className='h-5 w-5 text-gray-400' />
								</div>
							</div>
							{measurements.length === 0 && selectedCustomerId && (
								<p className='text-sm text-red-500'>
									لا توجد قياسات لهذا العميل. الرجاء إضافة قياس جديد.
								</p>
							)}
						</div>

						<div className='space-y-2'>
							<label
								htmlFor='fabric'
								className='block text-sm font-medium text-gray-700 flex items-center'
							>
								<Package className='h-4 w-4 ml-1 text-gray-400' />
								القماش <span className='text-red-500'>*</span>
							</label>
							<div className='relative'>
								<select
									id='fabric'
									className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
									value={selectedFabricId}
									onChange={(e) => setSelectedFabricId(e.target.value)}
									disabled={isSubmitting}
								>
									<option value=''>اختر قماش</option>
									{fabrics.map((fabric) => (
										<option key={fabric.id} value={fabric.id}>
											{fabric.name} - {fabric.color} ({fabric.price} ر.س)
										</option>
									))}
								</select>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<ChevronDown className='h-5 w-5 text-gray-400' />
								</div>
							</div>
						</div>

						<div className='space-y-2'>
							<label htmlFor='tailor' className='block text-sm font-medium text-gray-700'>
								الخياط المسؤول <span className='text-red-500'>*</span>
							</label>
							<div className='relative'>
								<select
									id='tailor'
									className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
									value={selectedTailorId}
									onChange={(e) => setSelectedTailorId(e.target.value)}
									disabled={isSubmitting}
								>
									<option value=''>اختر الخياط</option>
									{tailors
										.filter((t) => t.role === 'tailor')
										.map((tailor) => (
											<option key={tailor.id} value={tailor.id}>
												{tailor.name}
											</option>
										))}
								</select>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<ChevronDown className='h-5 w-5 text-gray-400' />
								</div>
							</div>
						</div>

						<div className='space-y-2'>
							<label htmlFor='factoryTailor' className='block text-sm font-medium text-gray-700'>
								خياط المصنع <span className='text-red-500'>*</span>
							</label>
							<div className='relative'>
								<select
									id='factoryTailor'
									className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
									value={selectedFactoryTailorId}
									onChange={(e) => setSelectedFactoryTailorId(e.target.value)}
									disabled={isSubmitting}
								>
									<option value=''>اختر خياط المصنع</option>
									{tailors
										.filter((t) => t.role === 'factory')
										.map((tailor) => (
											<option key={tailor.id} value={tailor.id}>
												{tailor.name}
											</option>
										))}
								</select>
								<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
									<ChevronDown className='h-5 w-5 text-gray-400' />
								</div>
							</div>
						</div>

						<div className='space-y-2'>
							<label
								htmlFor='deliveryDate'
								className='block text-sm font-medium text-gray-700 flex items-center'
							>
								<Calendar className='h-4 w-4 ml-1 text-gray-400' />
								تاريخ التسليم المتوقع
							</label>
							<input
								type='date'
								id='deliveryDate'
								className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
								value={deliveryDate}
								onChange={(e) => setDeliveryDate(e.target.value)}
								min={new Date().toISOString().split('T')[0]}
								disabled={isSubmitting}
							/>
						</div>

						<div className='space-y-2'>
							<label
								htmlFor='price'
								className='block text-sm font-medium text-gray-700 flex items-center'
							>
								<DollarSign className='h-4 w-4 ml-1 text-gray-400' />
								السعر (ر.س) <span className='text-red-500'>*</span>
							</label>
							<input
								type='number'
								id='price'
								className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								min='1'
								disabled={isSubmitting}
							/>
						</div>
					</div>

					<div className='space-y-2'>
						<label htmlFor='notes' className='block text-sm font-medium text-gray-700'>
							ملاحظات
						</label>
						<textarea
							id='notes'
							rows={3}
							className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							disabled={isSubmitting}
						/>
					</div>

					<div className='flex justify-end space-x-2 space-x-reverse pt-4'>
						<Link
							href='/dashboard/orders'
							className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
						>
							إلغاء
						</Link>
						<button
							type='submit'
							disabled={isSubmitting}
							className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
						>
							{isSubmitting ? 'جاري الإنشاء...' : 'إنشاء الطلب'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
