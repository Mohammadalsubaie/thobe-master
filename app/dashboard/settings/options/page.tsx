'use client';

import { ArrowLeft, Check, Edit, Move, Pencil, Plus, Save, Settings, Shirt, Trash, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// واجهة مجموعة الخيارات
interface OptionGroup {
	id: string;
	name: string;
	order: number;
	isSystem?: boolean; // المجموعات الأساسية
}

// واجهة خيار الثياب
interface ClothingOption {
	id: string;
	name: string;
	price: number;
	image: string;
	isDefault: boolean;
	groupId: string;
}

export default function ClothingOptionsSettingsPage() {
	const [activeTab, setActiveTab] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);
	const [options, setOptions] = useState<Record<string, ClothingOption[]>>({});
	const [showOptionModal, setShowOptionModal] = useState(false);
	const [showGroupModal, setShowGroupModal] = useState(false);
	const [editingOption, setEditingOption] = useState<ClothingOption | null>(null);
	const [editingGroup, setEditingGroup] = useState<OptionGroup | null>(null);
	const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
	const [showConfirmDeleteGroup, setShowConfirmDeleteGroup] = useState(false);
	const [groupToDelete, setGroupToDelete] = useState<string | null>(null);

	// قيم الخيار الجديد
	const [newOptionName, setNewOptionName] = useState('');
	const [newOptionPrice, setNewOptionPrice] = useState(0);
	const [newOptionImage, setNewOptionImage] = useState('');
	const [newOptionIsDefault, setNewOptionIsDefault] = useState(false);

	// قيم المجموعة الجديدة
	const [newGroupName, setNewGroupName] = useState('');

	useEffect(() => {
		// محاكاة تحميل البيانات
		const fetchData = async () => {
			try {
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// مجموعات الخيارات الافتراضية
				const defaultGroups: OptionGroup[] = [
					{ id: 'stitchType', name: 'أنواع الخياطة', order: 1, isSystem: true },
					{ id: 'collarType', name: 'أنواع الياقة', order: 2, isSystem: true },
					{ id: 'cuffType', name: 'أنواع الكم', order: 3, isSystem: true },
					{ id: 'pocketType', name: 'أنواع الجيب', order: 4, isSystem: true },
					{ id: 'buttonLineType', name: 'أنواع الجبروز', order: 5, isSystem: true },
					{ id: 'additionalOptions', name: 'خيارات إضافية', order: 6, isSystem: true },
					// مجموعات مخصصة
					{ id: 'custom_fabrics', name: 'أنواع القماش', order: 7 },
					{ id: 'custom_embroidery', name: 'خيارات التطريز', order: 8 },
				];

				// تعيين المجموعات
				setOptionGroups(defaultGroups);

				// بيانات الخيارات التجريبية
				const mockOptions: Record<string, ClothingOption[]> = {
					stitchType: [
						{
							id: 'st1',
							name: 'سعودي',
							price: 0,
							image: '/images/stitch/saudi.png',
							isDefault: true,
							groupId: 'stitchType',
						},
						{
							id: 'st2',
							name: 'كويتي',
							price: 20,
							image: '/images/stitch/kuwaiti.png',
							isDefault: false,
							groupId: 'stitchType',
						},
						{
							id: 'st3',
							name: 'إماراتي',
							price: 25,
							image: '/images/stitch/emirati.png',
							isDefault: false,
							groupId: 'stitchType',
						},
						{
							id: 'st4',
							name: 'قطري',
							price: 25,
							image: '/images/stitch/qatari.png',
							isDefault: false,
							groupId: 'stitchType',
						},
					],
					collarType: [
						{
							id: 'cl1',
							name: 'عادية',
							price: 0,
							image: '/images/collar/regular.png',
							isDefault: true,
							groupId: 'collarType',
						},
						{
							id: 'cl2',
							name: 'صينية',
							price: 10,
							image: '/images/collar/chinese.png',
							isDefault: false,
							groupId: 'collarType',
						},
						{
							id: 'cl3',
							name: 'دبل',
							price: 15,
							image: '/images/collar/double.png',
							isDefault: false,
							groupId: 'collarType',
						},
					],
					cuffType: [
						{
							id: 'cf1',
							name: 'عادي',
							price: 0,
							image: '/images/cuff/regular.png',
							isDefault: true,
							groupId: 'cuffType',
						},
						{
							id: 'cf2',
							name: 'دبل',
							price: 15,
							image: '/images/cuff/double.png',
							isDefault: false,
							groupId: 'cuffType',
						},
						{
							id: 'cf3',
							name: 'إيطالي',
							price: 20,
							image: '/images/cuff/italian.png',
							isDefault: false,
							groupId: 'cuffType',
						},
					],
					pocketType: [
						{
							id: 'pk1',
							name: 'بدون جيب',
							price: 0,
							image: '/images/pocket/none.png',
							isDefault: true,
							groupId: 'pocketType',
						},
						{
							id: 'pk2',
							name: 'جيب عادي',
							price: 10,
							image: '/images/pocket/regular.png',
							isDefault: false,
							groupId: 'pocketType',
						},
						{
							id: 'pk3',
							name: 'جيب مخفي',
							price: 15,
							image: '/images/pocket/hidden.png',
							isDefault: false,
							groupId: 'pocketType',
						},
					],
					buttonLineType: [
						{
							id: 'bt1',
							name: 'عادي',
							price: 0,
							image: '/images/button/regular.png',
							isDefault: true,
							groupId: 'buttonLineType',
						},
						{
							id: 'bt2',
							name: 'مخفي',
							price: 15,
							image: '/images/button/hidden.png',
							isDefault: false,
							groupId: 'buttonLineType',
						},
					],
					additionalOptions: [
						{
							id: 'ad1',
							name: 'جيب جوال',
							price: 0,
							image: '/images/addon/mobile.png',
							isDefault: false,
							groupId: 'additionalOptions',
						},
						{
							id: 'ad2',
							name: 'جيب قلم',
							price: 0,
							image: '/images/addon/pen.png',
							isDefault: false,
							groupId: 'additionalOptions',
						},
						{
							id: 'ad3',
							name: 'تطريز',
							price: 50,
							image: '/images/addon/embroidery.png',
							isDefault: false,
							groupId: 'additionalOptions',
						},
					],
					custom_fabrics: [
						{
							id: 'fb1',
							name: 'قطن مصري',
							price: 100,
							image: '/images/fabric/egyptian.png',
							isDefault: true,
							groupId: 'custom_fabrics',
						},
						{
							id: 'fb2',
							name: 'ساسو',
							price: 150,
							image: '/images/fabric/saso.png',
							isDefault: false,
							groupId: 'custom_fabrics',
						},
					],
					custom_embroidery: [
						{
							id: 'em1',
							name: 'تطريز اسم',
							price: 30,
							image: '/images/embroidery/name.png',
							isDefault: false,
							groupId: 'custom_embroidery',
						},
						{
							id: 'em2',
							name: 'تطريز شعار',
							price: 50,
							image: '/images/embroidery/logo.png',
							isDefault: false,
							groupId: 'custom_embroidery',
						},
					],
				};

				setOptions(mockOptions);

				// تعيين التبويب النشط للمجموعة الأولى
				if (defaultGroups.length > 0) {
					setActiveTab(defaultGroups[0].id);
				}

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

	// إضافة مجموعة جديدة
	const openAddGroupModal = () => {
		setEditingGroup(null);
		setNewGroupName('');
		setShowGroupModal(true);
	};

	// تعديل مجموعة موجودة
	const openEditGroupModal = (group: OptionGroup) => {
		setEditingGroup(group);
		setNewGroupName(group.name);
		setShowGroupModal(true);
	};

	// حفظ المجموعة (إضافة أو تعديل)
	const saveGroup = (e: React.FormEvent) => {
		e.preventDefault();

		if (!newGroupName.trim()) {
			showNotification('يرجى إدخال اسم المجموعة', 'error');
			return;
		}

		if (editingGroup) {
			// تعديل مجموعة موجودة
			setOptionGroups((groups) =>
				groups.map((g) => (g.id === editingGroup.id ? { ...g, name: newGroupName } : g))
			);
			showNotification(`تم تعديل مجموعة "${newGroupName}" بنجاح`, 'success');
		} else {
			// إضافة مجموعة جديدة
			const newId = `custom_${Date.now()}`;
			const newGroup: OptionGroup = {
				id: newId,
				name: newGroupName,
				order: optionGroups.length + 1,
			};

			setOptionGroups([...optionGroups, newGroup]);
			setOptions({ ...options, [newId]: [] });
			setActiveTab(newId);
			showNotification(`تم إضافة مجموعة "${newGroupName}" بنجاح`, 'success');
		}

		setShowGroupModal(false);
	};

	// حذف مجموعة
	const confirmDeleteGroup = (groupId: string) => {
		const group = optionGroups.find((g) => g.id === groupId);

		if (group?.isSystem) {
			showNotification('لا يمكن حذف المجموعات الأساسية', 'error');
			return;
		}

		setGroupToDelete(groupId);
		setShowConfirmDeleteGroup(true);
	};

	const deleteGroup = () => {
		if (!groupToDelete) return;

		// التحقق مرة أخرى من أن المجموعة ليست أساسية
		const group = optionGroups.find((g) => g.id === groupToDelete);
		if (group?.isSystem) {
			showNotification('لا يمكن حذف المجموعات الأساسية', 'error');
			setShowConfirmDeleteGroup(false);
			setGroupToDelete(null);
			return;
		}

		// حذف المجموعة من قائمة المجموعات
		setOptionGroups((groups) => groups.filter((g) => g.id !== groupToDelete));

		// حذف خيارات المجموعة
		const newOptions = { ...options };
		delete newOptions[groupToDelete];
		setOptions(newOptions);

		// تعيين التبويب النشط للمجموعة الأولى إذا كانت المجموعة المحذوفة هي النشطة
		if (activeTab === groupToDelete && optionGroups.length > 0) {
			setActiveTab(optionGroups[0].id);
		}

		showNotification('تم حذف المجموعة بنجاح', 'success');
		setShowConfirmDeleteGroup(false);
		setGroupToDelete(null);
	};

	// تغيير ترتيب المجموعات
	const reorderGroup = (groupId: string, direction: 'up' | 'down') => {
		const groupIndex = optionGroups.findIndex((g) => g.id === groupId);
		if (groupIndex === -1) return;

		const newGroups = [...optionGroups];

		if (direction === 'up' && groupIndex > 0) {
			// تحريك لأعلى
			const temp = newGroups[groupIndex].order;
			newGroups[groupIndex].order = newGroups[groupIndex - 1].order;
			newGroups[groupIndex - 1].order = temp;
		} else if (direction === 'down' && groupIndex < newGroups.length - 1) {
			// تحريك لأسفل
			const temp = newGroups[groupIndex].order;
			newGroups[groupIndex].order = newGroups[groupIndex + 1].order;
			newGroups[groupIndex + 1].order = temp;
		} else {
			return; // لا تغيير إذا كانت في البداية/النهاية
		}

		// ترتيب المجموعات حسب الترتيب الجديد
		newGroups.sort((a, b) => a.order - b.order);
		setOptionGroups(newGroups);
	};

	// فتح نافذة إضافة خيار جديد
	const openAddOptionModal = () => {
		if (!activeTab) return;

		setEditingOption(null);
		setNewOptionName('');
		setNewOptionPrice(0);
		setNewOptionImage('');
		setNewOptionIsDefault(false);
		setShowOptionModal(true);
	};

	// فتح نافذة تعديل خيار موجود
	const openEditOptionModal = (option: ClothingOption) => {
		setEditingOption(option);
		setNewOptionName(option.name);
		setNewOptionPrice(option.price);
		setNewOptionImage(option.image);
		setNewOptionIsDefault(option.isDefault);
		setShowOptionModal(true);
	};

	// حفظ الخيار (إضافة أو تعديل)
	const saveOption = (e: React.FormEvent) => {
		e.preventDefault();

		if (!activeTab) return;

		if (!newOptionName.trim()) {
			showNotification('يرجى إدخال اسم الخيار', 'error');
			return;
		}

		// تجهيز بيانات الخيار
		const optionData: ClothingOption = {
			id: editingOption?.id || `opt_${Date.now()}`,
			name: newOptionName,
			price: newOptionPrice,
			image: newOptionImage || '/images/placeholder.png', // صورة افتراضية إذا لم يتم تحديد صورة
			isDefault: newOptionIsDefault,
			groupId: activeTab,
		};

		const currentOptions = options[activeTab] || [];

		// إذا كان الخيار الجديد افتراضياً، إلغاء الافتراضي من الخيارات الأخرى
		if (newOptionIsDefault) {
			currentOptions.forEach((opt) => {
				if (opt.id !== optionData.id) {
					opt.isDefault = false;
				}
			});
		}

		if (editingOption) {
			// تعديل خيار موجود
			const updatedOptions = currentOptions.map((opt) => (opt.id === editingOption.id ? optionData : opt));
			setOptions({ ...options, [activeTab]: updatedOptions });
			showNotification(`تم تعديل خيار "${newOptionName}" بنجاح`, 'success');
		} else {
			// إضافة خيار جديد
			setOptions({ ...options, [activeTab]: [...currentOptions, optionData] });
			showNotification(`تم إضافة خيار "${newOptionName}" بنجاح`, 'success');
		}

		setShowOptionModal(false);
	};

	// حذف خيار
	const deleteOption = (optionId: string) => {
		if (!activeTab || !confirm('هل أنت متأكد من حذف هذا الخيار؟')) return;

		const currentOptions = options[activeTab] || [];
		const updatedOptions = currentOptions.filter((opt) => opt.id !== optionId);

		setOptions({ ...options, [activeTab]: updatedOptions });
		showNotification('تم حذف الخيار بنجاح', 'success');
	};

	// تعيين خيار كافتراضي
	const setOptionAsDefault = (optionId: string) => {
		if (!activeTab) return;

		const currentOptions = options[activeTab] || [];
		const updatedOptions = currentOptions.map((opt) => ({
			...opt,
			isDefault: opt.id === optionId,
		}));

		setOptions({ ...options, [activeTab]: updatedOptions });
		showNotification('تم تعيين الخيار كافتراضي بنجاح', 'success');
	};

	// الحصول على خيارات المجموعة النشطة
	const currentOptions = activeTab ? options[activeTab] || [] : [];

	// الحصول على اسم المجموعة النشطة
	const activeGroupName = optionGroups.find((g) => g.id === activeTab)?.name || '';

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
				<div className='flex items-center space-x-2 space-x-reverse'>
					<button
						onClick={openAddGroupModal}
						className='px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center'
					>
						<Plus size={16} className='ml-1' />
						إضافة مجموعة جديدة
					</button>
					<button
						onClick={handleSave}
						disabled={isSubmitting}
						className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:bg-green-300 disabled:cursor-not-allowed'
					>
						<Save size={18} className='ml-1' />
						{isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
					</button>
				</div>
			</div>

			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='border-b border-gray-200 overflow-x-auto py-1'>
					<div className='flex justify-between items-center px-4'>
						<nav className='flex overflow-x-auto hide-scrollbar pb-1'>
							{optionGroups
								.sort((a, b) => a.order - b.order)
								.map((group) => (
									<button
										key={group.id}
										onClick={() => setActiveTab(group.id)}
										className={`py-3 px-4 text-sm font-medium whitespace-nowrap flex items-center relative ${
											activeTab === group.id
												? 'text-green-600 after:absolute after:bottom-0 after:right-0 after:left-0 after:h-0.5 after:bg-green-500'
												: 'text-gray-500 hover:text-gray-700'
										}`}
									>
										{group.name}
										{!group.isSystem && (
											<button
												className='mr-2 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none'
												onClick={(e) => {
													e.stopPropagation();
													openEditGroupModal(group);
												}}
											>
												<Pencil size={12} />
											</button>
										)}
									</button>
								))}
						</nav>
						<div className='flex-shrink-0'>
							<button
								onClick={openAddGroupModal}
								className='p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md'
							>
								<Plus size={18} />
							</button>
						</div>
					</div>
				</div>

				<div className='p-6'>
					<div className='flex justify-between items-center mb-6'>
						<div className='flex items-center'>
							<h2 className='text-lg font-medium text-gray-900'>{activeGroupName}</h2>

							{/* إدارة المجموعة الحالية */}
							{activeTab && !optionGroups.find((g) => g.id === activeTab)?.isSystem && (
								<div className='mr-3'>
									<div className='flex space-x-2 space-x-reverse'>
										<button
											onClick={() => reorderGroup(activeTab, 'up')}
											className='p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded'
											title='تحريك لأعلى'
										>
											<Move size={14} className='transform rotate-90' />
										</button>
										<button
											onClick={() => reorderGroup(activeTab, 'down')}
											className='p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded'
											title='تحريك لأسفل'
										>
											<Move size={14} className='transform -rotate-90' />
										</button>
										<button
											onClick={() =>
												openEditGroupModal(optionGroups.find((g) => g.id === activeTab)!)
											}
											className='p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded'
											title='تعديل المجموعة'
										>
											<Edit size={14} />
										</button>
										<button
											onClick={() => confirmDeleteGroup(activeTab)}
											className='p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded'
											title='حذف المجموعة'
										>
											<Trash size={14} />
										</button>
									</div>
								</div>
							)}
						</div>
						<button
							onClick={openAddOptionModal}
							className='px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center'
							disabled={!activeTab}
						>
							<Plus size={16} className='ml-1' />
							إضافة خيار جديد
						</button>
					</div>

					{activeTab ? (
						<>
							{currentOptions.length > 0 ? (
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
									{currentOptions.map((option) => (
										<div
											key={option.id}
											className='border border-gray-200 rounded-lg overflow-hidden group'
										>
											<div className='h-40 bg-gray-100 relative flex items-center justify-center p-4'>
												{option.image ? (
													<img
														src={option.image}
														alt={option.name}
														className='h-full object-contain'
													/>
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
														onClick={() => deleteOption(option.id)}
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
															onClick={() => setOptionAsDefault(option.id)}
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
							) : (
								<div className='text-center py-12 border-2 border-dashed border-gray-300 rounded-lg'>
									<Shirt size={48} className='mx-auto text-gray-300 mb-3' />
									<h3 className='text-lg font-medium text-gray-900 mb-1'>لا توجد خيارات</h3>
									<p className='text-gray-500 mb-4'>لم يتم إضافة أي خيارات لهذه المجموعة بعد</p>
									<button
										onClick={openAddOptionModal}
										className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 inline-flex items-center'
									>
										<Plus size={18} className='ml-1' />
										إضافة خيار جديد
									</button>
								</div>
							)}
						</>
					) : (
						<div className='text-center py-12 border-2 border-dashed border-gray-300 rounded-lg'>
							<Settings size={48} className='mx-auto text-gray-300 mb-3' />
							<h3 className='text-lg font-medium text-gray-900 mb-1'>اختر مجموعة</h3>
							<p className='text-gray-500'>اختر مجموعة خيارات من الأعلى لعرض وإدارة خياراتها</p>
						</div>
					)}
				</div>
			</div>

			{/* نافذة منبثقة لإضافة/تعديل مجموعة */}
			{showGroupModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md'>
						<div className='flex justify-between items-center mb-4'>
							<h3 className='text-lg font-medium text-gray-900'>
								{editingGroup ? 'تعديل مجموعة' : 'إضافة مجموعة جديدة'}
							</h3>
							<button
								onClick={() => setShowGroupModal(false)}
								className='text-gray-400 hover:text-gray-600'
							>
								<X size={20} />
							</button>
						</div>
						<form onSubmit={saveGroup} className='space-y-4'>
							<div>
								<label htmlFor='groupName' className='block text-sm font-medium text-gray-700'>
									اسم المجموعة <span className='text-red-600'>*</span>
								</label>
								<input
									type='text'
									id='groupName'
									value={newGroupName}
									onChange={(e) => setNewGroupName(e.target.value)}
									className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									placeholder='مثال: أنواع التطريز، موديلات خاصة، الخ'
									required
								/>
							</div>

							<div className='mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3'>
								<button
									type='button'
									className='w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm'
									onClick={() => setShowGroupModal(false)}
								>
									إلغاء
								</button>
								<button
									type='submit'
									className='mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:text-sm'
								>
									{editingGroup ? 'تحديث' : 'إضافة'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* نافذة منبثقة لإضافة/تعديل خيار */}
			{showOptionModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md'>
						<div className='flex justify-between items-center mb-4'>
							<h3 className='text-lg font-medium text-gray-900'>
								{editingOption
									? `تعديل خيار في ${activeGroupName}`
									: `إضافة خيار جديد في ${activeGroupName}`}
							</h3>
							<button
								onClick={() => setShowOptionModal(false)}
								className='text-gray-400 hover:text-gray-600'
							>
								<X size={20} />
							</button>
						</div>
						<form onSubmit={saveOption} className='space-y-4'>
							<div>
								<label htmlFor='optionName' className='block text-sm font-medium text-gray-700'>
									اسم الخيار <span className='text-red-600'>*</span>
								</label>
								<input
									type='text'
									id='optionName'
									value={newOptionName}
									onChange={(e) => setNewOptionName(e.target.value)}
									className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									required
								/>
							</div>

							<div>
								<label htmlFor='optionPrice' className='block text-sm font-medium text-gray-700'>
									السعر الإضافي (ر.س)
								</label>
								<input
									type='number'
									id='optionPrice'
									value={newOptionPrice}
									onChange={(e) => setNewOptionPrice(parseFloat(e.target.value))}
									className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
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
									checked={newOptionIsDefault}
									onChange={(e) => setNewOptionIsDefault(e.target.checked)}
									className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
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

			{/* نافذة تأكيد حذف المجموعة */}
			{showConfirmDeleteGroup && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md'>
						<div className='mb-4'>
							<h3 className='text-lg font-medium text-gray-900 mb-2'>تأكيد حذف المجموعة</h3>
							<p className='text-gray-500'>
								هل أنت متأكد من حذف هذه المجموعة وكل الخيارات الموجودة بها؟ هذا الإجراء لا يمكن التراجع
								عنه.
							</p>
						</div>

						<div className='flex justify-end space-x-3 space-x-reverse'>
							<button
								type='button'
								className='inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm'
								onClick={() => {
									setShowConfirmDeleteGroup(false);
									setGroupToDelete(null);
								}}
							>
								إلغاء
							</button>
							<button
								type='button'
								className='inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm'
								onClick={deleteGroup}
							>
								تأكيد الحذف
							</button>
						</div>
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

			<style jsx>{`
				/* إخفاء شريط التمرير للتبويبات مع الحفاظ على التمرير */
				.hide-scrollbar::-webkit-scrollbar {
					display: none;
				}
				.hide-scrollbar {
					-ms-overflow-style: none;
					scrollbar-width: none;
				}
			`}</style>
		</div>
	);
}
