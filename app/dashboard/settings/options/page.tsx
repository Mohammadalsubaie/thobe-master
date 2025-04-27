'use client';

import { ArrowLeft, Check, Edit, Plus, Save, Shirt, Trash } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function ClothingOptionsSettingsPage() {
	const [activeTab, setActiveTab] = useState('stitchType');
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [options, setOptions] = useState<Record<string, any[]>>({});
	const [showOptionModal, setShowOptionModal] = useState(false);
	const [editingOption, setEditingOption] = useState<any | null>(null);
	const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

	// تعريف أنواع الخيارات
	const optionTypes = [
		{ id: 'stitchType', name: 'أنواع الخياطة' },
		{ id: 'collarType', name: 'أنواع الياقة' },
		{ id: 'cuffType', name: 'أنواع الكم' },
		{ id: 'pocketType', name: 'أنواع الجيب' },
		{ id: 'buttonLineType', name: 'أنواع الجبروز' },
		{ id: 'additionalOptions', name: 'خيارات إضافية' },
	];

	useEffect(() => {
		// محاكاة تحميل البيانات
		const fetchData = async () => {
			try {
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// بيانات الخيارات التجريبية
				setOptions({
					stitchType: [
						{ id: 'st1', name: 'سعودي', price: 0, image: '/images/stitch/saudi.png', isDefault: true },
						{ id: 'st2', name: 'كويتي', price: 20, image: '/images/stitch/kuwaiti.png', isDefault: false },
						{
							id: 'st3',
							name: 'إماراتي',
							price: 25,
							image: '/images/stitch/emirati.png',
							isDefault: false,
						},
						{ id: 'st4', name: 'قطري', price: 25, image: '/images/stitch/qatari.png', isDefault: false },
					],
					collarType: [
						{ id: 'cl1', name: 'عادية', price: 0, image: '/images/collar/regular.png', isDefault: true },
						{ id: 'cl2', name: 'صينية', price: 10, image: '/images/collar/chinese.png', isDefault: false },
						{ id: 'cl3', name: 'دبل', price: 15, image: '/images/collar/double.png', isDefault: false },
					],
					cuffType: [
						{ id: 'cf1', name: 'عادي', price: 0, image: '/images/cuff/regular.png', isDefault: true },
						{ id: 'cf2', name: 'دبل', price: 15, image: '/images/cuff/double.png', isDefault: false },
						{ id: 'cf3', name: 'إيطالي', price: 20, image: '/images/cuff/italian.png', isDefault: false },
					],
					pocketType: [
						{ id: 'pk1', name: 'بدون جيب', price: 0, image: '/images/pocket/none.png', isDefault: true },
						{
							id: 'pk2',
							name: 'جيب عادي',
							price: 10,
							image: '/images/pocket/regular.png',
							isDefault: false,
						},
						{
							id: 'pk3',
							name: 'جيب مخفي',
							price: 15,
							image: '/images/pocket/hidden.png',
							isDefault: false,
						},
					],
					buttonLineType: [
						{ id: 'bt1', name: 'عادي', price: 0, image: '/images/button/regular.png', isDefault: true },
						{ id: 'bt2', name: 'مخفي', price: 15, image: '/images/button/hidden.png', isDefault: false },
					],
					additionalOptions: [
						{ id: 'ad1', name: 'جيب جوال', price: 0, image: '/images/addon/mobile.png', isDefault: false },
						{ id: 'ad2', name: 'جيب قلم', price: 0, image: '/images/addon/pen.png', isDefault: false },
						{
							id: 'ad3',
							name: 'تطريز',
							price: 50,
							image: '/images/addon/embroidery.png',
							isDefault: false,
						},
					],
				});

				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
				setIsLoading(false);
				showNotification('حدث خطأ أثناء تحميل البيانات', 'error');
			}
		};

		fetchData();
	}, []);

	const showNotification = (message: string, type: 'success' | 'error') => {
		setNotification({ message, type });
		setTimeout(() => setNotification(null), 3000);
	};

	const handleSave = async () => {
		setIsSubmitting(true);
		try {
			// محاكاة حفظ البيانات
			await new Promise((resolve) => setTimeout(resolve, 1000));
			showNotification('تم حفظ الإعدادات بنجاح', 'success');
		} catch (error) {
			console.error('Error saving settings:', error);
			showNotification('حدث خطأ أثناء حفظ الإعدادات', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	const openAddOptionModal = () => {
		setEditingOption(null);
		setShowOptionModal(true);
	};

	const openEditOptionModal = (option: any) => {
		setEditingOption(option);
		setShowOptionModal(true);
	};

	const currentOptions = options[activeTab] || [];

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent'></div>
				<span className='mr-2 text-gray-700'>جاري التحميل...</span>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div className='flex items-center'>
					<Link href='/dashboard/settings' className='text-gray-500 hover:text-gray-700 ml-3'>
						<ArrowLeft size={20} />
					</Link>
					<h1 className='text-2xl font-bold text-gray-800'>خيارات الثياب</h1>
				</div>
				<button
					onClick={handleSave}
					disabled={isSubmitting}
					className='ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:bg-green-300 disabled:cursor-not-allowed'
				>
					<Save size={18} className='ml-1' />
					{isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
				</button>
			</div>

			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='border-b border-gray-200 overflow-x-auto'>
					<nav className='flex -mb-px'>
						{optionTypes.map((type) => (
							<button
								key={type.id}
								onClick={() => setActiveTab(type.id)}
								className={`py-4 px-6 text-sm font-medium whitespace-nowrap border-b-2 ${
									activeTab === type.id
										? 'border-green-500 text-green-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
							>
								{type.name}
							</button>
						))}
					</nav>
				</div>

				<div className='p-6'>
					<div className='flex justify-between items-center mb-6'>
						<h2 className='text-lg font-medium text-gray-900'>
							{optionTypes.find((t) => t.id === activeTab)?.name}
						</h2>
						<button
							onClick={openAddOptionModal}
							className='px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center'
						>
							<Plus size={16} className='ml-1' />
							إضافة خيار جديد
						</button>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
						{currentOptions.map((option) => (
							<div key={option.id} className='border border-gray-200 rounded-lg overflow-hidden group'>
								<div className='h-40 bg-gray-100 relative flex items-center justify-center p-4'>
									{option.image ? (
										<img src={option.image} alt={option.name} className='h-full object-contain' />
									) : (
										<Shirt size={48} className='text-gray-300' />
									)}
									{option.isDefault && (
										<div className='absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-md'>
											افتراضي
										</div>
									)}

									<div className='absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2 space-x-reverse'>
										<button
											onClick={() => openEditOptionModal(option)}
											className='bg-blue-100 text-blue-600 p-1.5 rounded-md hover:bg-blue-200'
										>
											<Edit size={16} />
										</button>
										<button
											onClick={() => {
												/* حذف الخيار */
											}}
											className='bg-red-100 text-red-600 p-1.5 rounded-md hover:bg-red-200'
										>
											<Trash size={16} />
										</button>
									</div>
								</div>
								<div className='p-4'>
									<h3 className='font-medium text-gray-900'>{option.name}</h3>
									<div className='flex justify-between items-center mt-2 text-sm'>
										<div className='text-gray-500'>
											السعر: {option.price > 0 ? `${option.price} ر.س` : 'مجاناً'}
										</div>
										{!option.isDefault && (
											<button
												onClick={() => {
													/* تعيين كخيار افتراضي */
												}}
												className='text-green-600 hover:text-green-800 flex items-center'
											>
												<Check size={14} className='ml-1' />
												تعيين كافتراضي
											</button>
										)}
									</div>
								</div>
							</div>
						))}

						{/* بطاقة إضافة خيار جديد */}
						<div
							onClick={openAddOptionModal}
							className='border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-64 cursor-pointer hover:bg-gray-50'
						>
							<div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2'>
								<Plus size={24} />
							</div>
							<span className='text-gray-600'>إضافة خيار جديد</span>
						</div>
					</div>
				</div>
			</div>

			{/* نافذة منبثقة لإضافة/تعديل خيار */}
			{showOptionModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md'>
						<h3 className='text-lg font-medium text-gray-900 mb-4'>
							{editingOption
								? `تعديل ${optionTypes.find((t) => t.id === activeTab)?.name}`
								: `إضافة ${optionTypes.find((t) => t.id === activeTab)?.name}`}
						</h3>
						<form className='space-y-4'>
							<div>
								<label htmlFor='optionName' className='block text-sm font-medium text-gray-700'>
									الاسم
								</label>
								<input
									type='text'
									id='optionName'
									className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									defaultValue={editingOption?.name || ''}
								/>
							</div>

							<div>
								<label htmlFor='optionPrice' className='block text-sm font-medium text-gray-700'>
									السعر الإضافي (ر.س)
								</label>
								<input
									type='number'
									id='optionPrice'
									className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									defaultValue={editingOption?.price || 0}
									min='0'
									step='5'
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>صورة الخيار</label>
								<div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
									<div className='space-y-1 text-center'>
										<Shirt size={40} className='mx-auto text-gray-400' />
										<div className='flex text-sm text-gray-600'>
											<label
												htmlFor='file-upload'
												className='relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
											>
												<span>رفع ملف</span>
												<input
													id='file-upload'
													name='file-upload'
													type='file'
													className='sr-only'
												/>
											</label>
											<p className='pr-1'>أو سحب وإفلات</p>
										</div>
										<p className='text-xs text-gray-500'>PNG, JPG حتى 2MB</p>
									</div>
								</div>
							</div>

							<div className='flex items-center'>
								<input
									id='optionDefault'
									type='checkbox'
									className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
									defaultChecked={editingOption?.isDefault || false}
								/>
								<label htmlFor='optionDefault' className='mr-2 block text-sm text-gray-700'>
									تعيين كخيار افتراضي
								</label>
							</div>

							<div className='mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3'>
								<button
									type='button'
									className='w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm'
									onClick={() => setShowOptionModal(false)}
								>
									إلغاء
								</button>
								<button
									type='submit'
									className='mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:text-sm'
								>
									{editingOption ? 'تحديث' : 'إضافة'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* إشعار */}
			{notification && (
				<div
					className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center 
                        ${
							notification.type === 'success'
								? 'bg-green-100 text-green-800 border border-green-200'
								: 'bg-red-100 text-red-800 border border-red-200'
						}`}
				>
					{notification.type === 'success' ? (
						<svg className='h-5 w-5 ml-2 text-green-400' viewBox='0 0 20 20' fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
								clipRule='evenodd'
							/>
						</svg>
					) : (
						<svg className='h-5 w-5 ml-2 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
								clipRule='evenodd'
							/>
						</svg>
					)}
					<span>{notification.message}</span>
				</div>
			)}
		</div>
	);
}
