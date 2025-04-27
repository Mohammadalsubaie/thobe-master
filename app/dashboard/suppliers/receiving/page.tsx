// app/dashboard/suppliers/receiving/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
	AlertTriangle,
	ArrowRight,
	Camera,
	CheckCircle,
	ChevronDown,
	ClipboardCheck,
	FileCheck,
	Filter,
	Loader2,
	Package,
	Search,
	ThumbsDown,
	ThumbsUp,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// نوع حالة الاستلام
type ReceivingStatus = 'pending' | 'received' | 'partial' | 'rejected';

// واجهة طلب الشراء
interface PurchaseOrder {
	id: string;
	poNumber: string;
	supplier: {
		id: string;
		name: string;
	};
	orderDate: string;
	expectedDeliveryDate: string;
	status: 'pending' | 'received' | 'partial' | 'completed' | 'cancelled';
	items: Array<{
		id: string;
		productName: string;
		quantity: number;
		unit: string;
		receivedQuantity: number;
		remainingQuantity: number;
	}>;
}

// مخطط التحقق من نموذج الاستلام
const receivingFormSchema = z.object({
	purchaseOrderId: z.string().min(1, { message: 'يجب اختيار طلب الشراء' }),
	receivingNumber: z.string().min(1, { message: 'يجب إدخال رقم الاستلام' }),
	receivingDate: z.string().min(1, { message: 'يجب تحديد تاريخ الاستلام' }),
	deliveryNote: z.string().optional(),
	receivingStatus: z.enum(['received', 'partial', 'rejected']),
	notes: z.string().optional(),
	receivedItems: z.array(
		z.object({
			itemId: z.string(),
			productName: z.string(),
			orderedQuantity: z.number(),
			receivedQuantity: z.number(),
			unit: z.string(),
			qualityCheck: z.enum(['passed', 'failed', 'pending']),
			notes: z.string().optional(),
		})
	),
});

type ReceivingFormValues = z.infer<typeof receivingFormSchema>;

export default function ReceivingPage() {
	const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
	const [isReceivingModalOpen, setIsReceivingModalOpen] = useState(false);
	const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
	const [pendingOrders, setPendingOrders] = useState<PurchaseOrder[]>([]);
	const [receivingHistory, setReceivingHistory] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		reset,
		formState: { errors },
	} = useForm<ReceivingFormValues>({
		resolver: zodResolver(receivingFormSchema),
		defaultValues: {
			purchaseOrderId: '',
			receivingNumber: `REC-${Math.floor(100000 + Math.random() * 900000)}`,
			receivingDate: format(new Date(), 'yyyy-MM-dd'),
			deliveryNote: '',
			receivingStatus: 'received',
			notes: '',
			receivedItems: [],
		},
	});

	// مشاهدة التغييرات في حالة الاستلام
	const watchedItems = watch('receivedItems');
	const watchedStatus = watch('receivingStatus');

	// جلب طلبات الشراء المعلقة
	useEffect(() => {
		const fetchPendingOrders = async () => {
			setIsLoading(true);

			try {
				// محاكاة استجابة API
				setTimeout(() => {
					const mockPendingOrders: PurchaseOrder[] = [
						{
							id: 'po-1001',
							poNumber: 'PO-100001',
							supplier: {
								id: 'sup-1',
								name: 'شركة النسيج العالمية',
							},
							orderDate: '2025-04-10',
							expectedDeliveryDate: '2025-04-25',
							status: 'pending',
							items: [
								{
									id: 'item-1',
									productName: 'قماش قطني',
									quantity: 100,
									unit: 'متر',
									receivedQuantity: 0,
									remainingQuantity: 100,
								},
								{
									id: 'item-2',
									productName: 'خيط أسود',
									quantity: 50,
									unit: 'لفة',
									receivedQuantity: 0,
									remainingQuantity: 50,
								},
								{
									id: 'item-3',
									productName: 'أزرار بلاستيكية',
									quantity: 200,
									unit: 'حزمة',
									receivedQuantity: 0,
									remainingQuantity: 200,
								},
							],
						},
						{
							id: 'po-1002',
							poNumber: 'PO-100002',
							supplier: {
								id: 'sup-2',
								name: 'مؤسسة الخياط للأقمشة',
							},
							orderDate: '2025-04-15',
							expectedDeliveryDate: '2025-04-28',
							status: 'partial',
							items: [
								{
									id: 'item-4',
									productName: 'قماش حرير',
									quantity: 50,
									unit: 'متر',
									receivedQuantity: 30,
									remainingQuantity: 20,
								},
								{
									id: 'item-5',
									productName: 'خيط أبيض',
									quantity: 30,
									unit: 'لفة',
									receivedQuantity: 10,
									remainingQuantity: 20,
								},
							],
						},
					];

					// محاكاة سجل الاستلام
					const mockReceivingHistory = [
						{
							id: 'rec-1001',
							receivingNumber: 'REC-100001',
							purchaseOrderNumber: 'PO-100002',
							supplier: 'مؤسسة الخياط للأقمشة',
							receivingDate: '2025-04-20',
							status: 'partial',
							receivedItems: [
								{
									productName: 'قماش حرير',
									orderedQuantity: 50,
									receivedQuantity: 30,
									unit: 'متر',
									qualityCheck: 'passed',
								},
								{
									productName: 'خيط أبيض',
									orderedQuantity: 30,
									receivedQuantity: 10,
									unit: 'لفة',
									qualityCheck: 'passed',
								},
							],
						},
						{
							id: 'rec-1000',
							receivingNumber: 'REC-100000',
							purchaseOrderNumber: 'PO-100000',
							supplier: 'مصنع الأناقة للإكسسوارات',
							receivingDate: '2025-04-18',
							status: 'received',
							receivedItems: [
								{
									productName: 'أزرار معدنية',
									orderedQuantity: 100,
									receivedQuantity: 100,
									unit: 'حزمة',
									qualityCheck: 'passed',
								},
							],
						},
					];

					setPendingOrders(mockPendingOrders);
					setReceivingHistory(mockReceivingHistory);
					setIsLoading(false);
				}, 1000);
			} catch (error) {
				console.error('Error fetching pending orders:', error);
				setIsLoading(false);
			}
		};

		fetchPendingOrders();
	}, []);

	// فتح مودال استلام طلب
	const openReceivingModal = (purchaseOrder: PurchaseOrder) => {
		setSelectedPO(purchaseOrder);

		// تهيئة بيانات النموذج
		setValue('purchaseOrderId', purchaseOrder.id);
		setValue('receivingNumber', `REC-${Math.floor(100000 + Math.random() * 900000)}`);
		setValue('receivingDate', format(new Date(), 'yyyy-MM-dd'));
		setValue('receivingStatus', 'received');

		// تهيئة العناصر
		const items = purchaseOrder.items.map((item) => ({
			itemId: item.id,
			productName: item.productName,
			orderedQuantity: item.quantity,
			receivedQuantity: item.remainingQuantity, // الافتراضي استلام كامل الكمية المتبقية
			unit: item.unit,
			qualityCheck: 'pending' as const,
			notes: '',
		}));

		setValue('receivedItems', items);
		setIsReceivingModalOpen(true);
	};

	// إغلاق المودال
	const closeReceivingModal = () => {
		setSelectedPO(null);
		setIsReceivingModalOpen(false);
		reset();
	};

	// حساب حالة الاستلام تلقائياً بناءً على الكميات المستلمة
	useEffect(() => {
		if (!selectedPO || !watchedItems || watchedItems.length === 0) return;

		// التحقق مما إذا كان الاستلام كامل أو جزئي
		const isFullyReceived = watchedItems.every((item) => {
			const poItem = selectedPO.items.find((i) => i.id === item.itemId);
			return poItem && item.receivedQuantity >= poItem.remainingQuantity;
		});

		const isPartial = watchedItems.some((item) => {
			const poItem = selectedPO.items.find((i) => i.id === item.itemId);
			return poItem && item.receivedQuantity > 0 && item.receivedQuantity < poItem.remainingQuantity;
		});

		// تحديث حالة الاستلام تلقائياً
		if (watchedStatus !== 'rejected') {
			if (isFullyReceived) {
				setValue('receivingStatus', 'received');
			} else if (isPartial) {
				setValue('receivingStatus', 'partial');
			}
		}
	}, [watchedItems, selectedPO, setValue, watchedStatus]);

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

			// إغلاق المودال بعد النجاح
			setTimeout(() => {
				closeReceivingModal();
				setSuccess(false);

				// إعادة تحميل البيانات
				// في التطبيق الحقيقي، سيتم إعادة جلب البيانات من الخادم
				const updatedPO = pendingOrders.map((po) => {
					if (po.id === selectedPO?.id) {
						// تحديث الكميات المستلمة
						const updatedItems = po.items.map((item) => {
							const receivedItem = data.receivedItems.find((ri) => ri.itemId === item.id);
							if (receivedItem) {
								return {
									...item,
									receivedQuantity: item.receivedQuantity + receivedItem.receivedQuantity,
									remainingQuantity: item.remainingQuantity - receivedItem.receivedQuantity,
								};
							}
							return item;
						});

						// تحديث حالة الطلب
						let newStatus = po.status;
						if (data.receivingStatus === 'received') {
							newStatus = 'completed';
						} else if (data.receivingStatus === 'partial') {
							newStatus = 'partial';
						}

						return {
							...po,
							status: newStatus,
							items: updatedItems,
						};
					}
					return po;
				});

				// إضافة سجل الاستلام الجديد
				const newReceiving = {
					id: `rec-${Math.floor(1000 + Math.random() * 9000)}`,
					receivingNumber: data.receivingNumber,
					purchaseOrderNumber: selectedPO?.poNumber,
					supplier: selectedPO?.supplier.name,
					receivingDate: data.receivingDate,
					status: data.receivingStatus,
					receivedItems: data.receivedItems,
				};

				setPendingOrders(updatedPO);
				setReceivingHistory([newReceiving, ...receivingHistory]);
			}, 1500);
		} catch (err) {
			console.error('Error submitting form:', err);
			setError('حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة مرة أخرى.');
			setIsSubmitting(false);
		}
	});

	// تغيير كمية الاستلام للعنصر
	const handleQuantityChange = (index: number, quantity: number) => {
		if (!selectedPO) return;

		const item = watchedItems[index];
		const poItem = selectedPO.items.find((i) => i.id === item.itemId);

		if (poItem) {
			// التأكد من أن الكمية ليست أكبر من الكمية المتبقية
			const maxQuantity = poItem.remainingQuantity;
			const newQuantity = Math.min(Math.max(0, quantity), maxQuantity);

			// تحديث الكمية
			const updatedItems = [...watchedItems];
			updatedItems[index] = {
				...item,
				receivedQuantity: newQuantity,
			};

			setValue('receivedItems', updatedItems);
		}
	};

	// تغيير حالة فحص الجودة للعنصر
	const handleQualityChange = (index: number, status: 'passed' | 'failed' | 'pending') => {
		if (!watchedItems) return;

		const updatedItems = [...watchedItems];
		updatedItems[index] = {
			...updatedItems[index],
			qualityCheck: status,
		};

		setValue('receivedItems', updatedItems);
	};

	// تأكيد استلام كل الكميات
	const confirmAllQuantities = () => {
		if (!selectedPO || !watchedItems) return;

		const updatedItems = watchedItems.map((item) => {
			const poItem = selectedPO.items.find((i) => i.id === item.itemId);
			return {
				...item,
				receivedQuantity: poItem ? poItem.remainingQuantity : item.receivedQuantity,
			};
		});

		setValue('receivedItems', updatedItems);
	};

	// رفض كل العناصر
	const rejectAllItems = () => {
		if (!watchedItems) return;

		setValue('receivingStatus', 'rejected');

		const updatedItems = watchedItems.map((item) => ({
			...item,
			receivedQuantity: 0,
			qualityCheck: 'failed' as const,
		}));

		setValue('receivedItems', updatedItems);
	};

	// ReceivingModal المكون المسؤول عن مودال استلام البضائع
	const ReceivingModal = () => {
		if (!selectedPO) return null;

		return (
			<div className='fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4 overflow-y-auto'>
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col'>
					<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
						<h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
							استلام بضائع من طلب {selectedPO.poNumber}
						</h2>
						<button
							type='button'
							onClick={closeReceivingModal}
							className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
						>
							<X className='h-6 w-6' />
						</button>
					</div>

					<div className='p-6 overflow-y-auto flex-1'>
						<form id='receivingForm' onSubmit={onSubmit}>
							<div className='space-y-6'>
								{/* معلومات الاستلام */}
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
									<input type='hidden' {...register('purchaseOrderId')} />

									<div>
										<label
											htmlFor='receivingNumber'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											رقم الاستلام <span className='text-red-500'>*</span>
										</label>
										<input
											id='receivingNumber'
											type='text'
											{...register('receivingNumber')}
											className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 bg-gray-50 dark:bg-gray-600'
											readOnly
										/>
										{errors.receivingNumber && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.receivingNumber.message}
											</p>
										)}
									</div>

									<div>
										<label
											htmlFor='receivingDate'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											تاريخ الاستلام <span className='text-red-500'>*</span>
										</label>
										<input
											id='receivingDate'
											type='date'
											{...register('receivingDate')}
											className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
										/>
										{errors.receivingDate && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.receivingDate.message}
											</p>
										)}
									</div>

									<div>
										<label
											htmlFor='deliveryNote'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											رقم إشعار التسليم
										</label>
										<input
											id='deliveryNote'
											type='text'
											{...register('deliveryNote')}
											placeholder='DON-12345'
											className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
										/>
									</div>

									<div className='md:col-span-2 lg:col-span-3'>
										<label
											htmlFor='receivingStatus'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
										>
											حالة الاستلام <span className='text-red-500'>*</span>
										</label>
										<div className='flex space-x-4 space-x-reverse'>
											<label className='inline-flex items-center'>
												<input
													type='radio'
													value='received'
													className='form-radio text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600'
													{...register('receivingStatus')}
												/>
												<span className='mr-2 text-gray-700 dark:text-gray-300'>
													استلام كامل
												</span>
											</label>
											<label className='inline-flex items-center'>
												<input
													type='radio'
													value='partial'
													className='form-radio text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600'
													{...register('receivingStatus')}
												/>
												<span className='mr-2 text-gray-700 dark:text-gray-300'>
													استلام جزئي
												</span>
											</label>
											<label className='inline-flex items-center'>
												<input
													type='radio'
													value='rejected'
													className='form-radio text-red-600 focus:ring-red-500 border-gray-300 dark:border-gray-600'
													{...register('receivingStatus')}
												/>
												<span className='mr-2 text-gray-700 dark:text-gray-300'>
													رفض الاستلام
												</span>
											</label>
										</div>
										{errors.receivingStatus && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.receivingStatus.message}
											</p>
										)}
									</div>
								</div>

								{/* معلومات المورد */}
								<div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
									<h3 className='text-md font-medium text-gray-700 dark:text-gray-300 mb-2'>
										معلومات المورد والطلب
									</h3>
									<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
										<div>
											<p className='text-sm text-gray-500 dark:text-gray-400'>المورد:</p>
											<p className='font-medium text-gray-800 dark:text-gray-200'>
												{selectedPO.supplier.name}
											</p>
										</div>
										<div>
											<p className='text-sm text-gray-500 dark:text-gray-400'>تاريخ الطلب:</p>
											<p className='font-medium text-gray-800 dark:text-gray-200'>
												{format(new Date(selectedPO.orderDate), 'dd MMMM yyyy', { locale: ar })}
											</p>
										</div>
										<div>
											<p className='text-sm text-gray-500 dark:text-gray-400'>
												تاريخ التسليم المتوقع:
											</p>
											<p className='font-medium text-gray-800 dark:text-gray-200'>
												{format(new Date(selectedPO.expectedDeliveryDate), 'dd MMMM yyyy', {
													locale: ar,
												})}
											</p>
										</div>
									</div>
								</div>

								{/* جدول العناصر المستلمة */}
								<div>
									<div className='flex justify-between items-center mb-3'>
										<h3 className='text-md font-medium text-gray-700 dark:text-gray-300'>
											العناصر المستلمة
										</h3>
										<div className='flex space-x-2 space-x-reverse'>
											<button
												type='button'
												onClick={confirmAllQuantities}
												className='inline-flex items-center px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 focus:outline-none'
											>
												<ThumbsUp className='ml-1 h-4 w-4' />
												تأكيد استلام الكل
											</button>
											<button
												type='button'
												onClick={rejectAllItems}
												className='inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 focus:outline-none'
											>
												<ThumbsDown className='ml-1 h-4 w-4' />
												رفض الكل
											</button>
										</div>
									</div>

									<div className='overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg'>
										<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
											<thead className='bg-gray-50 dark:bg-gray-700'>
												<tr>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														المنتج
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														الكمية المطلوبة
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														الكمية المستلمة
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														فحص الجودة
													</th>
													<th
														scope='col'
														className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
													>
														ملاحظات
													</th>
												</tr>
											</thead>
											<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
												{watchedItems.map((item, index) => (
													<tr key={item.itemId}>
														<td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100'>
															{item.productName}
														</td>
														<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
															{item.orderedQuantity} {item.unit}
														</td>
														<td className='px-4 py-4 whitespace-nowrap'>
															<div className='flex items-center'>
																<input
																	type='number'
																	min='0'
																	max={item.orderedQuantity}
																	className='w-20 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
																	value={item.receivedQuantity}
																	onChange={(e) =>
																		handleQuantityChange(
																			index,
																			parseInt(e.target.value)
																		)
																	}
																	disabled={watchedStatus === 'rejected'}
																/>
																<span className='mr-2 text-sm text-gray-500 dark:text-gray-400'>
																	{item.unit}
																</span>
															</div>
														</td>
														<td className='px-4 py-4 whitespace-nowrap'>
															<select
																className='py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
																value={item.qualityCheck}
																onChange={(e) =>
																	handleQualityChange(
																		index,
																		e.target.value as
																			| 'passed'
																			| 'failed'
																			| 'pending'
																	)
																}
															>
																<option value='pending'>قيد الفحص</option>
																<option value='passed'>مطابق للمواصفات</option>
																<option value='failed'>غير مطابق</option>
															</select>
														</td>
														<td className='px-4 py-4 whitespace-nowrap'>
															<input
																type='text'
																className='w-full py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
																placeholder='ملاحظات عن العنصر'
																value={item.notes || ''}
																onChange={(e) => {
																	const updatedItems = [...watchedItems];
																	updatedItems[index] = {
																		...updatedItems[index],
																		notes: e.target.value,
																	};
																	setValue('receivedItems', updatedItems);
																}}
															/>
														</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</div>

								{/* ملاحظات إضافية */}
								<div>
									<label
										htmlFor='notes'
										className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
									>
										ملاحظات إضافية
									</label>
									<textarea
										id='notes'
										rows={3}
										{...register('notes')}
										className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100'
										placeholder='أي ملاحظات إضافية حول عملية الاستلام'
									></textarea>
								</div>

								{/* صور التوثيق (محاكاة) */}
								<div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 border-dashed'>
									<div className='flex items-center justify-center flex-col'>
										<Camera className='h-8 w-8 text-gray-400 dark:text-gray-500 mb-2' />
										<p className='text-sm text-center text-gray-500 dark:text-gray-400 mb-2'>
											يمكنك إرفاق صور لتوثيق عملية الاستلام
										</p>
										<button
											type='button'
											className='mt-2 inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
										>
											<Camera className='ml-1.5 -mr-1 h-5 w-5 text-gray-400 dark:text-gray-500' />
											إضافة صور
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
							</div>
						</form>
					</div>

					<div className='px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 space-x-reverse'>
						<button
							type='button'
							onClick={closeReceivingModal}
							className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
						>
							إلغاء
						</button>

						<button
							type='button'
							onClick={() =>
								document
									.getElementById('receivingForm')
									?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
							}
							disabled={isSubmitting || success}
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
									تم تسجيل الاستلام
								</>
							) : (
								<>
									<ClipboardCheck className='inline-block ml-1.5 -mr-1 h-4 w-4' />
									تأكيد الاستلام
								</>
							)}
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
							href='/dashboard/suppliers'
							className='text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ml-2'
						>
							<ArrowRight className='h-5 w-5' />
						</Link>
						<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>استلام البضائع</h1>
					</div>
					<p className='text-gray-500 dark:text-gray-400 text-sm'>
						إدارة عمليات استلام البضائع من الموردين وتسجيلها في المخزون
					</p>
				</div>
			</div>

			{/* التبويبات */}
			<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
				<div className='border-b border-gray-200 dark:border-gray-700'>
					<div className='flex -mb-px'>
						<button
							className={`py-4 px-6 text-sm font-medium focus:outline-none ${
								activeTab === 'pending'
									? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
									: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
							}`}
							onClick={() => setActiveTab('pending')}
						>
							انتظار الاستلام
						</button>
						<button
							className={`py-4 px-6 text-sm font-medium focus:outline-none ${
								activeTab === 'history'
									? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
									: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
							}`}
							onClick={() => setActiveTab('history')}
						>
							سجل الاستلام
						</button>
					</div>
				</div>

				{/* أدوات البحث والفلترة */}
				<div className='p-4 border-b border-gray-200 dark:border-gray-700'>
					<div className='flex flex-wrap gap-4'>
						<div className='flex-1 min-w-[200px]'>
							<div className='relative'>
								<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
									<Search className='h-5 w-5 text-gray-400 dark:text-gray-500' />
								</div>
								<input
									type='text'
									className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm'
									placeholder={
										activeTab === 'pending' ? 'بحث في طلبات الشراء...' : 'بحث في سجل الاستلام...'
									}
								/>
							</div>
						</div>

						<div className='relative'>
							<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
								<Filter className='h-5 w-5 text-gray-400 dark:text-gray-500' />
							</div>
							<select className='block appearance-none pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm'>
								<option value='all'>جميع الموردين</option>
								<option value='sup-1'>شركة النسيج العالمية</option>
								<option value='sup-2'>مؤسسة الخياط للأقمشة</option>
								<option value='sup-3'>مصنع الأناقة للإكسسوارات</option>
							</select>
						</div>

						<div className='relative'>
							<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
								<Filter className='h-5 w-5 text-gray-400 dark:text-gray-500' />
							</div>
							<select className='block appearance-none pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm'>
								{activeTab === 'pending' ? (
									<>
										<option value='all'>جميع الحالات</option>
										<option value='pending'>انتظار الاستلام</option>
										<option value='partial'>مستلم جزئياً</option>
									</>
								) : (
									<>
										<option value='all'>جميع الحالات</option>
										<option value='received'>مستلم بالكامل</option>
										<option value='partial'>مستلم جزئياً</option>
										<option value='rejected'>مرفوض</option>
									</>
								)}
							</select>
						</div>
					</div>
				</div>

				{/* محتوى التبويب النشط */}
				<div className='p-6'>
					{isLoading ? (
						<div className='flex flex-col items-center justify-center py-16'>
							<div className='w-12 h-12 border-4 border-t-blue-600 border-gray-200 dark:border-gray-700 rounded-full animate-spin mb-4'></div>
							<p className='text-gray-500 dark:text-gray-400'>جاري تحميل البيانات...</p>
						</div>
					) : activeTab === 'pending' ? (
						// طلبات الشراء المنتظرة الاستلام
						<div className='space-y-4'>
							{pendingOrders.length === 0 ? (
								<div className='text-center py-16 bg-gray-50 dark:bg-gray-700 rounded-lg'>
									<Package className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' />
									<h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
										لا توجد طلبات بانتظار الاستلام
									</h3>
									<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
										جميع طلبات الشراء مكتملة الاستلام
									</p>
								</div>
							) : (
								<div className='divide-y divide-gray-200 dark:divide-gray-700'>
									{pendingOrders.map((order) => (
										<div key={order.id} className='py-4 first:pt-0 last:pb-0'>
											<div className='flex flex-wrap justify-between items-start gap-2'>
												<div>
													<div className='flex items-center mb-1'>
														<h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
															طلب شراء #{order.poNumber}
														</h3>
														<span
															className={`mr-2 px-2 py-1 text-xs rounded-full ${
																order.status === 'pending'
																	? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
																	: order.status === 'partial'
																	? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
																	: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
															}`}
														>
															{order.status === 'pending'
																? 'بإنتظار الاستلام'
																: order.status === 'partial'
																? 'مستلم جزئياً'
																: 'مكتمل'}
														</span>
													</div>
													<p className='text-sm text-gray-500 dark:text-gray-400'>
														المورد: {order.supplier.name} | التاريخ المتوقع:{' '}
														{format(new Date(order.expectedDeliveryDate), 'dd MMM yyyy', {
															locale: ar,
														})}
													</p>
												</div>

												<button
													type='button'
													onClick={() => openReceivingModal(order)}
													className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
												>
													<ClipboardCheck className='ml-1.5 -mr-1 h-5 w-5' />
													تسجيل استلام
												</button>
											</div>

											<div className='mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'>
												{order.items.map((item) => (
													<div
														key={item.id}
														className='bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600'
													>
														<div className='flex justify-between items-start'>
															<div>
																<p className='font-medium text-gray-800 dark:text-gray-200'>
																	{item.productName}
																</p>
																<p className='text-sm text-gray-500 dark:text-gray-400'>
																	الكمية المطلوبة: {item.quantity} {item.unit}
																</p>
															</div>
															{item.receivedQuantity > 0 && (
																<span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'>
																	مستلم: {item.receivedQuantity} {item.unit}
																</span>
															)}
														</div>

														{item.remainingQuantity > 0 && (
															<div className='mt-2 text-sm text-blue-600 dark:text-blue-400'>
																متبقي لاستلام: {item.remainingQuantity} {item.unit}
															</div>
														)}
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					) : (
						// سجل الاستلام
						<div className='space-y-4'>
							{receivingHistory.length === 0 ? (
								<div className='text-center py-16 bg-gray-50 dark:bg-gray-700 rounded-lg'>
									<FileCheck className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500' />
									<h3 className='mt-2 text-sm font-medium text-gray-900 dark:text-gray-100'>
										لا يوجد سجل استلام
									</h3>
									<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
										لم يتم تسجيل أي عمليات استلام بعد
									</p>
								</div>
							) : (
								<div className='divide-y divide-gray-200 dark:divide-gray-700'>
									{receivingHistory.map((receiving) => (
										<div key={receiving.id} className='py-4 first:pt-0 last:pb-0'>
											<div className='flex flex-wrap justify-between items-start gap-2 mb-2'>
												<div>
													<div className='flex items-center'>
														<h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
															استلام #{receiving.receivingNumber}
														</h3>
														<span
															className={`mr-2 px-2 py-1 text-xs rounded-full ${
																receiving.status === 'received'
																	? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
																	: receiving.status === 'partial'
																	? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
																	: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
															}`}
														>
															{receiving.status === 'received'
																? 'مستلم بالكامل'
																: receiving.status === 'partial'
																? 'مستلم جزئياً'
																: 'مرفوض'}
														</span>
													</div>
													<p className='text-sm text-gray-500 dark:text-gray-400'>
														طلب شراء: {receiving.purchaseOrderNumber} | المورد:{' '}
														{receiving.supplier} | تاريخ الاستلام:{' '}
														{format(new Date(receiving.receivingDate), 'dd MMM yyyy', {
															locale: ar,
														})}
													</p>
												</div>

												<button
													type='button'
													className='inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-800'
												>
													<FileCheck className='ml-1.5 -mr-1 h-5 w-5 text-gray-400 dark:text-gray-500' />
													عرض التفاصيل
												</button>
											</div>

											<div className='bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600'>
												<div className='flex justify-between items-center'>
													<h4 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>
														العناصر المستلمة
													</h4>
													<button
														type='button'
														className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none'
														onClick={() => {
															// Toggle items visibility (would be implemented with state in a real app)
														}}
													>
														<ChevronDown className='h-5 w-5' />
													</button>
												</div>

												<div className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
													<div className='space-y-2'>
														{receiving.receivedItems.map((item: any, idx: number) => (
															<div
																key={idx}
																className='flex justify-between items-center'
															>
																<span>{item.productName}</span>
																<span>
																	{item.receivedQuantity} من {item.orderedQuantity}{' '}
																	{item.unit}
																	<span
																		className={`mr-2 px-1.5 py-0.5 text-xs rounded-full ${
																			item.qualityCheck === 'passed'
																				? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
																				: item.qualityCheck === 'failed'
																				? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
																				: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
																		}`}
																	>
																		{item.qualityCheck === 'passed'
																			? 'مطابق'
																			: item.qualityCheck === 'failed'
																			? 'غير مطابق'
																			: 'قيد الفحص'}
																	</span>
																</span>
															</div>
														))}
													</div>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* مودال استلام البضائع */}
			{isReceivingModalOpen && <ReceivingModal />}
		</div>
	);
}
