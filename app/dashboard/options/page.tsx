'use client';

import { Edit, Image as ImageIcon, Plus, Save, Trash, Upload, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface StitchingOption {
	id: string;
	name: string;
	type: string;
	image?: string;
	price: number;
}

interface AdditionalOption {
	id: string;
	name: string;
	description?: string;
	price: number;
	image?: string;
}

const optionTypes = [
	{ id: 'stitchType', name: 'أنواع الخياطة' },
	{ id: 'collarType', name: 'أنواع الياقة' },
	{ id: 'cuffType', name: 'أنواع الكم' },
	{ id: 'pocketType', name: 'أنواع الجيب' },
	{ id: 'buttonLineType', name: 'أنواع الجبروز' },
	{ id: 'additionalOption', name: 'الإضافات الاختيارية' },
];

export default function OptionsManagementPage() {
	const [selectedOptionType, setSelectedOptionType] = useState<string>(optionTypes[0].id);
	const [stitchingOptions, setStitchingOptions] = useState<StitchingOption[]>([]);
	const [additionalOptions, setAdditionalOptions] = useState<AdditionalOption[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showAddModal, setShowAddModal] = useState(false);
	const [editingOption, setEditingOption] = useState<StitchingOption | AdditionalOption | null>(null);

	// New option form state
	const [newOptionName, setNewOptionName] = useState('');
	const [newOptionDescription, setNewOptionDescription] = useState('');
	const [newOptionPrice, setNewOptionPrice] = useState(0);
	const [newOptionImage, setNewOptionImage] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	// Fetch options data
	useEffect(() => {
		const fetchData = async () => {
			try {
				// في الوضع الفعلي، هذا سيكون طلب API
				setTimeout(() => {
					// Mock stitching options
					const mockStitchingOptions = [
						// أنواع الخياطة
						{
							id: 'st1',
							name: 'سعودي',
							type: 'stitchType',
							price: 0,
							image: '/images/options/stitch_saudi.png',
						},
						{
							id: 'st2',
							name: 'كويتي',
							type: 'stitchType',
							price: 20,
							image: '/images/options/stitch_kuwaiti.png',
						},
						{
							id: 'st3',
							name: 'قطري',
							type: 'stitchType',
							price: 30,
							image: '/images/options/stitch_qatar.png',
						},
						{
							id: 'st4',
							name: 'إماراتي',
							type: 'stitchType',
							price: 25,
							image: '/images/options/stitch_uae.png',
						},
						{
							id: 'st5',
							name: 'عماني',
							type: 'stitchType',
							price: 15,
							image: '/images/options/stitch_omani.png',
						},

						// أنواع الياقة
						{
							id: 'cl1',
							name: 'عادية',
							type: 'collarType',
							price: 0,
							image: '/images/options/collar_regular.png',
						},
						{
							id: 'cl2',
							name: 'إيطالي',
							type: 'collarType',
							price: 15,
							image: '/images/options/collar_italian.png',
						},
						{
							id: 'cl3',
							name: 'مستدير',
							type: 'collarType',
							price: 10,
							image: '/images/options/collar_round.png',
						},
						{
							id: 'cl4',
							name: 'فرنسي',
							type: 'collarType',
							price: 20,
							image: '/images/options/collar_french.png',
						},

						// أنواع الأكمام
						{
							id: 'cu1',
							name: 'عادي',
							type: 'cuffType',
							price: 0,
							image: '/images/options/cuff_regular.png',
						},
						{
							id: 'cu2',
							name: 'دبل',
							type: 'cuffType',
							price: 15,
							image: '/images/options/cuff_double.png',
						},
						{
							id: 'cu3',
							name: 'مستدير',
							type: 'cuffType',
							price: 10,
							image: '/images/options/cuff_round.png',
						},

						// أنواع الجيوب
						{
							id: 'po1',
							name: 'بدون جيب',
							type: 'pocketType',
							price: 0,
							image: '/images/options/pocket_none.png',
						},
						{
							id: 'po2',
							name: 'جيب عادي',
							type: 'pocketType',
							price: 10,
							image: '/images/options/pocket_regular.png',
						},
						{
							id: 'po3',
							name: 'جيب بغطاء',
							type: 'pocketType',
							price: 15,
							image: '/images/options/pocket_flap.png',
						},

						// أنواع الجبروز
						{
							id: 'bt1',
							name: 'عادي',
							type: 'buttonLineType',
							price: 0,
							image: '/images/options/button_regular.png',
						},
						{
							id: 'bt2',
							name: 'مخفي',
							type: 'buttonLineType',
							price: 20,
							image: '/images/options/button_hidden.png',
						},
						{
							id: 'bt3',
							name: 'سحاب',
							type: 'buttonLineType',
							price: 25,
							image: '/images/options/button_zipper.png',
						},
					];
					setStitchingOptions(mockStitchingOptions);

					// Mock additional options
					const mockAdditionalOptions = [
						{
							id: 'ao1',
							name: 'جيب جوال',
							description: 'جيب داخلي للجوال',
							price: 0,
							image: '/images/options/mobile_pocket.png',
						},
						{
							id: 'ao2',
							name: 'جيب قلم',
							description: 'جيب صغير للقلم',
							price: 0,
							image: '/images/options/pen_pocket.png',
						},
						{
							id: 'ao3',
							name: 'تطريز ذهبي',
							description: 'تطريز ذهبي على الكم',
							price: 50,
							image: '/images/options/gold_embroidery.png',
						},
						{
							id: 'ao4',
							name: 'تطريز فضي',
							description: 'تطريز فضي على الكم',
							price: 40,
							image: '/images/options/silver_embroidery.png',
						},
						{
							id: 'ao5',
							name: 'زر إضافي',
							description: 'زر إضافي داخلي',
							price: 5,
							image: '/images/options/extra_button.png',
						},
						{
							id: 'ao6',
							name: 'جيب مخفي',
							description: 'جيب مخفي داخلي',
							price: 10,
							image: '/images/options/hidden_pocket.png',
						},
					];
					setAdditionalOptions(mockAdditionalOptions);

					setIsLoading(false);
				}, 1000);
			} catch (error) {
				console.error('Error fetching options data:', error);
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// Get filtered options by type
	const getFilteredOptions = () => {
		if (selectedOptionType === 'additionalOption') {
			return additionalOptions;
		} else {
			return stitchingOptions.filter((option) => option.type === selectedOptionType);
		}
	};

	// Handle image upload
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type.match('image.*')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result;
				if (typeof result === 'string') {
					setNewOptionImage(result);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	// Open add modal
	const openAddModal = () => {
		setEditingOption(null);
		setNewOptionName('');
		setNewOptionDescription('');
		setNewOptionPrice(0);
		setNewOptionImage(null);
		setShowAddModal(true);
	};

	// Open edit modal
	const openEditModal = (option: StitchingOption | AdditionalOption) => {
		setEditingOption(option);
		setNewOptionName(option.name);
		setNewOptionDescription((option as AdditionalOption).description || '');
		setNewOptionPrice(option.price);
		setNewOptionImage(option.image || null);
		setShowAddModal(true);
	};

	// Delete option
	const deleteOption = async (optionId: string) => {
		if (window.confirm('هل أنت متأكد من حذف هذا الخيار؟')) {
			try {
				// Here would be the API call to delete the option
				if (selectedOptionType === 'additionalOption') {
					setAdditionalOptions(additionalOptions.filter((opt) => opt.id !== optionId));
				} else {
					setStitchingOptions(stitchingOptions.filter((opt) => opt.id !== optionId));
				}

				alert('تم حذف الخيار بنجاح');
			} catch (error) {
				console.error('Error deleting option:', error);
				alert('حدث خطأ أثناء حذف الخيار');
			}
		}
	};

	// Save new or edited option
	const saveOption = () => {
		if (!newOptionName) {
			alert('الرجاء إدخال اسم الخيار');
			return;
		}

		try {
			const now = Date.now();

			if (selectedOptionType === 'additionalOption') {
				const newAdditionalOption: AdditionalOption = {
					id: editingOption ? editingOption.id : `ao_${now}`,
					name: newOptionName,
					description: newOptionDescription,
					price: newOptionPrice,
					image: newOptionImage || undefined,
				};

				if (editingOption) {
					setAdditionalOptions(
						additionalOptions.map((opt) => (opt.id === editingOption.id ? newAdditionalOption : opt))
					);
				} else {
					setAdditionalOptions([...additionalOptions, newAdditionalOption]);
				}
			} else {
				const prefix =
					selectedOptionType === 'stitchType'
						? 'st'
						: selectedOptionType === 'collarType'
						? 'cl'
						: selectedOptionType === 'cuffType'
						? 'cu'
						: selectedOptionType === 'pocketType'
						? 'po'
						: 'bt';

				const newStitchingOption: StitchingOption = {
					id: editingOption ? editingOption.id : `${prefix}_${now}`,
					name: newOptionName,
					type: selectedOptionType,
					price: newOptionPrice,
					image: newOptionImage || undefined,
				};

				if (editingOption) {
					setStitchingOptions(
						stitchingOptions.map((opt) => (opt.id === editingOption.id ? newStitchingOption : opt))
					);
				} else {
					setStitchingOptions([...stitchingOptions, newStitchingOption]);
				}
			}

			setShowAddModal(false);
		} catch (error) {
			console.error('Error saving option:', error);
			alert('حدث خطأ أثناء حفظ الخيار');
		}
	};

	if (isLoading) {
		return <div className='flex items-center justify-center h-96'>جاري التحميل...</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>إدارة خيارات الثياب</h1>
				<Link href='/dashboard/orders/new' className='text-sm text-gray-600 hover:text-gray-900'>
					العودة لصفحة الطلب الجديد
				</Link>
			</div>

			{/* Tab navigation */}
			<div className='bg-white shadow-sm rounded-lg overflow-hidden'>
				<div className='border-b border-gray-200'>
					<nav className='flex -mb-px overflow-x-auto'>
						{optionTypes.map((type) => (
							<button
								key={type.id}
								className={`py-4 px-6 font-medium text-sm whitespace-nowrap ${
									selectedOptionType === type.id
										? 'border-b-2 border-green-500 text-green-600'
										: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}`}
								onClick={() => setSelectedOptionType(type.id)}
							>
								{type.name}
							</button>
						))}
					</nav>
				</div>

				<div className='p-6'>
					<div className='mb-4 flex justify-between items-center'>
						<h2 className='text-lg font-medium text-gray-900'>
							{optionTypes.find((t) => t.id === selectedOptionType)?.name}
						</h2>
						<button
							onClick={openAddModal}
							className='flex items-center text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded-md hover:bg-green-100'
						>
							<Plus size={16} className='ml-1' />
							إضافة خيار جديد
						</button>
					</div>

					{/* Options grid */}
					<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
						{getFilteredOptions().length === 0 ? (
							<div className='col-span-3 p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300'>
								<p className='text-gray-500'>
									لا توجد خيارات متاحة. انقر على "إضافة خيار جديد" لإضافة خيار.
								</p>
							</div>
						) : (
							getFilteredOptions().map((option) => (
								<div
									key={option.id}
									className='border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow relative group'
								>
									<div className='absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 space-x-reverse'>
										<button
											onClick={() => openEditModal(option)}
											className='p-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200'
											title='تعديل'
										>
											<Edit size={14} />
										</button>
										<button
											onClick={() => deleteOption(option.id)}
											className='p-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200'
											title='حذف'
										>
											<Trash size={14} />
										</button>
									</div>

									<div className='flex flex-col items-center'>
										{option.image ? (
											<div className='w-32 h-32 mb-3 flex items-center justify-center'>
												<img
													src={option.image}
													alt={option.name}
													className='max-w-full max-h-full object-contain'
												/>
											</div>
										) : (
											<div className='w-32 h-32 mb-3 bg-gray-100 flex items-center justify-center rounded-md'>
												<ImageIcon className='text-gray-400' size={32} />
											</div>
										)}

										<h3 className='font-medium text-gray-900 text-center'>{option.name}</h3>

										{'description' in option && option.description && (
											<p className='text-sm text-gray-500 mt-1 text-center'>
												{option.description}
											</p>
										)}

										<div className='mt-2 text-sm text-center'>
											{option.price > 0 ? (
												<span className='text-green-700'>{option.price} ر.س</span>
											) : (
												<span className='text-gray-500'>بدون تكلفة إضافية</span>
											)}
										</div>
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{/* Add/Edit Modal */}
			{showAddModal && (
				<div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50'>
					<div className='bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden'>
						<div className='px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
							<h3 className='text-lg font-medium text-gray-900'>
								{editingOption ? 'تعديل الخيار' : 'إضافة خيار جديد'}
							</h3>
							<button
								onClick={() => setShowAddModal(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X size={20} />
							</button>
						</div>

						<div className='p-6'>
							<div className='space-y-4'>
								{/* Option Image */}
								<div className='flex flex-col items-center mb-4'>
									{newOptionImage ? (
										<div className='w-48 h-48 mb-2 flex items-center justify-center border rounded-md p-2'>
											<img
												src={newOptionImage}
												alt='Preview'
												className='max-w-full max-h-full object-contain'
											/>
										</div>
									) : (
										<div className='w-48 h-48 mb-2 bg-gray-100 flex items-center justify-center rounded-md border'>
											<ImageIcon className='text-gray-400' size={48} />
										</div>
									)}

									<button
										type='button'
										onClick={() => fileInputRef.current?.click()}
										className='mt-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center'
									>
										<Upload size={14} className='ml-1' />
										{newOptionImage ? 'تغيير الصورة' : 'رفع صورة'}
									</button>

									<input
										type='file'
										accept='image/*'
										ref={fileInputRef}
										onChange={handleImageUpload}
										className='hidden'
									/>
								</div>

								{/* Option Name */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										اسم الخيار <span className='text-red-500'>*</span>
									</label>
									<input
										type='text'
										value={newOptionName}
										onChange={(e) => setNewOptionName(e.target.value)}
										className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										placeholder='أدخل اسم الخيار'
									/>
								</div>

								{/* Option Description (only for additional options) */}
								{selectedOptionType === 'additionalOption' && (
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											وصف الخيار
										</label>
										<textarea
											value={newOptionDescription}
											onChange={(e) => setNewOptionDescription(e.target.value)}
											className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
											placeholder='أدخل وصفاً مختصراً للخيار (اختياري)'
											rows={2}
										/>
									</div>
								)}

								{/* Option Price */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										السعر الإضافي (ر.س)
									</label>
									<input
										type='number'
										value={newOptionPrice}
										onChange={(e) => setNewOptionPrice(Number(e.target.value))}
										className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										placeholder='أدخل السعر الإضافي (0 للخيارات المجانية)'
										min='0'
									/>
								</div>
							</div>
						</div>

						<div className='px-6 py-4 border-t border-gray-200 flex justify-end space-x-2 space-x-reverse'>
							<button
								onClick={() => setShowAddModal(false)}
								className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
							>
								إلغاء
							</button>
							<button
								onClick={saveOption}
								className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center'
							>
								<Save size={16} className='ml-1' />
								{editingOption ? 'حفظ التعديلات' : 'إضافة الخيار'}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
