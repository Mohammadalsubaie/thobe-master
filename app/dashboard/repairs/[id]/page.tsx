'use client';

import { AlertTriangle, Calendar, CheckCircle, ChevronLeft, Clock, MessageCircle, Package, User } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RepairDetails {
	id: string;
	orderId: string;
	customer: {
		id: string;
		name: string;
		phone: string;
	};
	fabric: {
		name: string;
		color: string;
	};
	description: string;
	status: 'pending' | 'in-progress' | 'completed';
	createdAt: string;
	completedAt: string | null;
	assignedTo: string | null;
	notes: string | null;
	history: Array<{
		status: string;
		date: string;
		by: string;
		notes?: string;
	}>;
}

export default function RepairDetailsPage() {
	const params = useParams();

	const repairId = params.id as string;

	const [repair, setRepair] = useState<RepairDetails | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [showCompleteModal, setShowCompleteModal] = useState(false);
	const [showAssignModal, setShowAssignModal] = useState(false);
	const [completionNote, setCompletionNote] = useState('');
	const [selectedTailor, setSelectedTailor] = useState('');
	const [isUpdating, setIsUpdating] = useState(false);
	const [tailors] = useState([
		{ id: 't1', name: 'عمر الخياط' },
		{ id: 't2', name: 'سعد الحربي' },
		{ id: 't3', name: 'عبدالله التميمي' },
	]);

	useEffect(() => {
		const fetchRepairDetails = async () => {
			try {
				// Mock API call - replace with actual API call
				setTimeout(() => {
					setRepair({
						id: repairId,
						orderId: '10001',
						customer: {
							id: 'c1',
							name: 'أحمد محمد',
							phone: '966512345678',
						},
						fabric: {
							name: 'قطن مصري',
							color: 'أبيض',
						},
						description: 'مقاس الثوب أوسع من القياس المطلوب',
						status: 'in-progress',
						createdAt: '2025-04-10',
						completedAt: null,
						assignedTo: 'عمر الخياط',
						notes: 'العميل يريد تضييق الثوب عند الخصر والصدر',
						history: [
							{
								status: 'pending',
								date: '2025-04-10T14:30:00',
								by: 'محمد المدير',
								notes: 'تم استلام طلب الإصلاح',
							},
							{
								status: 'in-progress',
								date: '2025-04-12T09:15:00',
								by: 'عمر الخياط',
								notes: 'بدأ العمل على إصلاح الثوب',
							},
						],
					});
					setIsLoading(false);
				}, 1000);
			} catch (error) {
				console.error('Error fetching repair details:', error);
				setIsLoading(false);
			}
		};

		fetchRepairDetails();
	}, [repairId]);

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending':
				return 'قيد الانتظار';
			case 'in-progress':
				return 'قيد التنفيذ';
			case 'completed':
				return 'مكتمل';
			default:
				return status;
		}
	};

	const getStatusClass = (status: string) => {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'in-progress':
				return 'bg-blue-100 text-blue-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case 'pending':
				return <Clock className='h-5 w-5' />;
			case 'in-progress':
				return <Clock className='h-5 w-5' />;
			case 'completed':
				return <CheckCircle className='h-5 w-5' />;
			default:
				return <Clock className='h-5 w-5' />;
		}
	};

	const handleCompleteRepair = async () => {
		setIsUpdating(true);

		try {
			// Mock API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Update repair status in state
			if (repair) {
				setRepair({
					...repair,
					status: 'completed',
					completedAt: new Date().toISOString().split('T')[0],
					history: [
						...repair.history,
						{
							status: 'completed',
							date: new Date().toISOString(),
							by: 'عمر الخياط', // This would be the logged-in user
							notes: completionNote || undefined,
						},
					],
				});
			}

			setShowCompleteModal(false);
			setCompletionNote('');
		} catch (error) {
			console.error('Error completing repair:', error);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleAssignRepair = async () => {
		if (!selectedTailor) return;

		setIsUpdating(true);

		try {
			// Mock API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Update assigned tailor in state
			if (repair) {
				const selectedTailorName = tailors.find((t) => t.id === selectedTailor)?.name || '';

				setRepair({
					...repair,
					status: repair.status === 'pending' ? 'in-progress' : repair.status,
					assignedTo: selectedTailorName,
					history: [
						...repair.history,
						{
							status: 'assigned',
							date: new Date().toISOString(),
							by: 'محمد المدير', // This would be the logged-in user
							notes: `تم تعيين ${selectedTailorName} للإصلاح`,
						},
					],
				});
			}

			setShowAssignModal(false);
			setSelectedTailor('');
		} catch (error) {
			console.error('Error assigning repair:', error);
		} finally {
			setIsUpdating(false);
		}
	};

	if (isLoading) {
		return <div className='flex items-center justify-center h-96'>جاري التحميل...</div>;
	}

	if (!repair) {
		return <div className='text-center py-8'>لم يتم العثور على طلب الإصلاح</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div className='flex items-center space-x-2 space-x-reverse'>
					<Link href='/dashboard/repairs' className='text-green-600 hover:text-green-800'>
						<ChevronLeft className='h-5 w-5' />
					</Link>
					<h1 className='text-2xl font-bold text-gray-800'>تفاصيل طلب الإصلاح</h1>
				</div>
				<div className='flex space-x-2 space-x-reverse'>
					{!repair.assignedTo && (
						<button
							onClick={() => setShowAssignModal(true)}
							className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
						>
							<User className='ml-2 -mr-1 h-5 w-5 text-gray-500' />
							تعيين خياط
						</button>
					)}
					{repair.status !== 'completed' && (
						<button
							onClick={() => setShowCompleteModal(true)}
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
						>
							<CheckCircle className='ml-2 -mr-1 h-5 w-5' />
							إكمال الإصلاح
						</button>
					)}
				</div>
			</div>

			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='p-6'>
					<div className='flex justify-between items-start mb-6'>
						<div>
							<div className='flex items-center'>
								<div className={`p-2 rounded-full ${getStatusClass(repair.status)}`}>
									<AlertTriangle className='h-5 w-5' />
								</div>
								<div className='mr-3'>
									<div className='flex items-center'>
										<h2 className='text-xl font-bold text-gray-800'>طلب الإصلاح #{repair.id}</h2>
										<span
											className={`mr-2 px-2 py-1 text-xs rounded-full ${getStatusClass(
												repair.status
											)}`}
										>
											{getStatusText(repair.status)}
										</span>
									</div>
									<div className='flex items-center text-sm text-gray-500 mt-1'>
										<Calendar className='h-4 w-4 ml-1' />
										<span>
											تاريخ الطلب: {new Date(repair.createdAt).toLocaleDateString('ar-SA')}
										</span>
									</div>
								</div>
							</div>
						</div>

						<div className='text-right'>
							<Link
								href={`/dashboard/orders/${repair.orderId}`}
								className='inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
							>
								عرض الطلب الأصلي #{repair.orderId}
							</Link>
							{repair.completedAt && (
								<div className='flex items-center justify-end text-sm text-gray-500 mt-2'>
									<span>
										تاريخ الإكمال: {new Date(repair.completedAt).toLocaleDateString('ar-SA')}
									</span>
									<CheckCircle className='h-4 w-4 mr-1 text-green-500' />
								</div>
							)}
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200 pt-6'>
						<div>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>معلومات العميل</h3>
							<div className='bg-gray-50 p-4 rounded-lg'>
								<div className='flex items-center'>
									<div className='bg-blue-100 p-2 rounded-full'>
										<User className='h-5 w-5 text-blue-600' />
									</div>
									<div className='mr-3'>
										<Link
											href={`/dashboard/customers/${repair.customer.id}`}
											className='text-lg font-semibold text-blue-600 hover:text-blue-800'
										>
											{repair.customer.name}
										</Link>
										<p className='text-sm text-gray-500'>{repair.customer.phone}</p>
									</div>
								</div>
							</div>
						</div>

						<div>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>معلومات القماش</h3>
							<div className='bg-gray-50 p-4 rounded-lg'>
								<div className='flex items-center'>
									<div className='bg-indigo-100 p-2 rounded-full'>
										<Package className='h-5 w-5 text-indigo-600' />
									</div>
									<div className='mr-3'>
										<p className='text-lg font-semibold'>{repair.fabric.name}</p>
										<p className='text-sm text-gray-500'>اللون: {repair.fabric.color}</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='border-t border-gray-200 pt-6 mt-6'>
						<h3 className='text-lg font-medium text-gray-900 mb-4'>تفاصيل المشكلة</h3>
						<div className='bg-red-50 p-4 rounded-lg'>
							<div className='flex'>
								<AlertTriangle className='h-5 w-5 text-red-500 ml-2 flex-shrink-0' />
								<p className='text-red-700'>{repair.description}</p>
							</div>
						</div>
					</div>

					{repair.notes && (
						<div className='border-t border-gray-200 pt-6 mt-6'>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>ملاحظات إضافية</h3>
							<div className='bg-gray-50 p-4 rounded-lg'>
								<div className='flex'>
									<MessageCircle className='h-5 w-5 text-gray-500 ml-2 flex-shrink-0' />
									<p className='text-gray-700'>{repair.notes}</p>
								</div>
							</div>
						</div>
					)}

					{repair.assignedTo && (
						<div className='border-t border-gray-200 pt-6 mt-6'>
							<h3 className='text-lg font-medium text-gray-900 mb-4'>الخياط المسؤول</h3>
							<div className='bg-blue-50 p-4 rounded-lg'>
								<div className='flex items-center'>
									<div className='bg-blue-100 p-2 rounded-full'>
										<User className='h-5 w-5 text-blue-600' />
									</div>
									<div className='mr-3'>
										<p className='text-lg font-semibold'>{repair.assignedTo}</p>
									</div>
								</div>
							</div>
						</div>
					)}

					<div className='border-t border-gray-200 pt-6 mt-6'>
						<h3 className='text-lg font-medium text-gray-900 mb-4'>تاريخ الحالة</h3>
						<div className='relative'>
							<div className='absolute inset-y-0 right-5 w-0.5 bg-gray-200'></div>
							<div className='space-y-6'>
								{repair.history.map((status, index) => (
									<div key={index} className='relative'>
										<div className='absolute right-5 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center'>
											{getStatusIcon(status.status)}
										</div>
										<div className='mr-16 bg-gray-50 p-4 rounded-lg'>
											<div className='flex justify-between items-center'>
												<p className='font-medium text-gray-900'>
													{getStatusText(status.status)}
												</p>
												<p className='text-sm text-gray-500'>
													{new Date(status.date).toLocaleString('ar-SA')}
												</p>
											</div>
											<p className='text-sm text-gray-500 mt-1'>بواسطة: {status.by}</p>
											{status.notes && (
												<p className='text-sm text-gray-600 mt-2'>{status.notes}</p>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Complete Repair Modal */}
			{showCompleteModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white p-5 rounded-md shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-gray-900 mb-4'>إكمال طلب الإصلاح</h3>
						<p className='text-gray-700 mb-4'>هل تم الانتهاء من إصلاح هذا الطلب؟</p>

						<div className='mb-4'>
							<label htmlFor='completionNote' className='block text-sm font-medium text-gray-700 mb-2'>
								ملاحظات (اختياري)
							</label>
							<textarea
								id='completionNote'
								rows={3}
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500'
								value={completionNote}
								onChange={(e) => setCompletionNote(e.target.value)}
								placeholder='أضف ملاحظات حول الإصلاح...'
								disabled={isUpdating}
							/>
						</div>

						<div className='flex justify-end space-x-2 space-x-reverse'>
							<button
								onClick={() => setShowCompleteModal(false)}
								className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
								disabled={isUpdating}
							>
								إلغاء
							</button>
							<button
								onClick={handleCompleteRepair}
								className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
								disabled={isUpdating}
							>
								{isUpdating ? 'جاري الإكمال...' : 'إكمال الإصلاح'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Assign Tailor Modal */}
			{showAssignModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white p-5 rounded-md shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-gray-900 mb-4'>تعيين خياط للإصلاح</h3>

						<div className='mb-4'>
							<label htmlFor='tailor' className='block text-sm font-medium text-gray-700 mb-2'>
								اختر الخياط
							</label>
							<select
								id='tailor'
								className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500'
								value={selectedTailor}
								onChange={(e) => setSelectedTailor(e.target.value)}
								disabled={isUpdating}
							>
								<option value=''>اختر خياط</option>
								{tailors.map((tailor) => (
									<option key={tailor.id} value={tailor.id}>
										{tailor.name}
									</option>
								))}
							</select>
						</div>

						<div className='flex justify-end space-x-2 space-x-reverse'>
							<button
								onClick={() => setShowAssignModal(false)}
								className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
								disabled={isUpdating}
							>
								إلغاء
							</button>
							<button
								onClick={handleAssignRepair}
								className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed'
								disabled={!selectedTailor || isUpdating}
							>
								{isUpdating ? 'جاري التعيين...' : 'تعيين الخياط'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
