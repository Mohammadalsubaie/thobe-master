'use client';

import {
	AlertCircle,
	ArrowLeft,
	Building,
	Calendar,
	CheckCircle,
	Clock,
	Image,
	MapPin,
	Phone,
	Plus,
	Save,
	Tag,
	Trash,
	Upload,
	User,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Branch {
	id: number;
	name: string;
	code: string;
	type: 'main' | 'sub' | 'seasonal';
	status: 'active' | 'inactive' | 'maintenance';
	address: {
		street: string;
		district: string;
		city: string;
		postalCode: string;
		coordinates: {
			lat: number;
			lng: number;
		};
	};
	contact: {
		phone: string;
		email: string;
		whatsapp?: string;
		website?: string;
	};
	manager: {
		id: number;
		name: string;
		phone: string;
		email: string;
	};
	operatingHours: {
		weekdays: string;
		weekends: string;
		holidays: string;
		notes?: string;
	};
	openingDate: string;
	area: number;
	employeesCount: number;
	maxCapacity: number;
	facilities: string[];
	tags: string[];
	description?: string;
	photos: string[];
}

interface BranchType {
	id: string;
	name: string;
}

interface BranchStatus {
	id: string;
	name: string;
	color: string;
}

export default function EditBranchPage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const [branch, setBranch] = useState<Branch | null>(null);
	const [loading, setLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

	// للحقول الديناميكية
	const [newFacility, setNewFacility] = useState('');
	const [newTag, setNewTag] = useState('');
	const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
	const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

	// بيانات القوائم
	const [branchTypes, setBranchTypes] = useState<BranchType[]>([]);
	const [branchStatuses, setBranchStatuses] = useState<BranchStatus[]>([]);
	const [cities, setCities] = useState<string[]>([]);
	const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);

	// تحميل بيانات الفرع
	useEffect(() => {
		const fetchBranchData = async () => {
			setLoading(true);
			try {
				// محاكاة لتحميل البيانات من API
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// بيانات تجريبية للفرع
				const mockBranchData: Branch = {
					id: parseInt(params.id),
					name: 'فرع الرياض الرئيسي',
					code: 'RYD-001',
					type: 'main',
					status: 'active',
					address: {
						street: 'شارع الملك فهد',
						district: 'حي العليا',
						city: 'الرياض',
						postalCode: '12211',
						coordinates: {
							lat: 24.7136,
							lng: 46.6753,
						},
					},
					contact: {
						phone: '966112345678',
						email: 'riyadh@example.com',
						whatsapp: '966512345678',
						website: 'https://www.example.com/branches/riyadh',
					},
					manager: {
						id: 15,
						name: 'أحمد العمري',
						phone: '966512345678',
						email: 'ahmed.manager@example.com',
					},
					operatingHours: {
						weekdays: '٩ ص - ١٠ م',
						weekends: '١٠ ص - ١١ م',
						holidays: 'مغلق',
						notes: 'قد يختلف وقت العمل خلال شهر رمضان والأعياد',
					},
					openingDate: '2020-03-15',
					area: 450,
					employeesCount: 25,
					maxCapacity: 120,
					facilities: ['مواقف سيارات', 'منطقة انتظار', 'غرف قياس', 'مكيفات', 'واي فاي مجاني'],
					tags: ['فرع رئيسي', 'منطقة مركزية', 'مبيعات عالية'],
					description:
						'أول فرع تم افتتاحه في الرياض، يقع في منطقة حيوية بحي العليا، ويعتبر من أكثر الفروع مبيعاً في المملكة.',
					photos: [
						'/images/branches/riyadh1.jpg',
						'/images/branches/riyadh2.jpg',
						'/images/branches/riyadh3.jpg',
					],
				};

				// بيانات القوائم
				const mockBranchTypes: BranchType[] = [
					{ id: 'main', name: 'فرع رئيسي' },
					{ id: 'sub', name: 'فرع فرعي' },
					{ id: 'seasonal', name: 'فرع موسمي' },
				];

				const mockBranchStatuses: BranchStatus[] = [
					{ id: 'active', name: 'نشط', color: '#10B981' },
					{ id: 'inactive', name: 'غير نشط', color: '#EF4444' },
					{ id: 'maintenance', name: 'تحت الصيانة', color: '#F59E0B' },
				];

				const mockCities: string[] = [
					'الرياض',
					'جدة',
					'الدمام',
					'مكة',
					'المدينة',
					'الطائف',
					'تبوك',
					'حائل',
					'أبها',
					'القصيم',
				];

				const mockManagers: { id: number; name: string }[] = [
					{ id: 15, name: 'أحمد العمري' },
					{ id: 22, name: 'خالد الشمري' },
					{ id: 36, name: 'محمد السعيد' },
					{ id: 41, name: 'فهد القحطاني' },
				];

				setBranch(mockBranchData);
				setBranchTypes(mockBranchTypes);
				setBranchStatuses(mockBranchStatuses);
				setCities(mockCities);
				setManagers(mockManagers);
			} catch (error) {
				console.error('Error fetching branch data:', error);
				setNotification({
					message: 'حدث خطأ أثناء تحميل بيانات الفرع',
					type: 'error',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchBranchData();
	}, [params.id]);

	// تحديث بيانات الفرع
	const updateBranchField = (field: string, value: any) => {
		if (!branch) return;

		setBranch((prevBranch) => {
			if (!prevBranch) return null;

			// للحقول المتداخلة، نستخدم الكائن المؤقت
			const updatedBranch = { ...prevBranch };

			// تحديد نوع الحقل وتحديثه
			if (field.includes('.')) {
				const [parentField, childField] = field.split('.');

				if (parentField === 'address') {
					updatedBranch.address = {
						...updatedBranch.address,
						[childField]: value,
					};
				} else if (parentField === 'contact') {
					updatedBranch.contact = {
						...updatedBranch.contact,
						[childField]: value,
					};
				} else if (parentField === 'manager') {
					updatedBranch.manager = {
						...updatedBranch.manager,
						[childField]: value,
					};
				} else if (parentField === 'operatingHours') {
					updatedBranch.operatingHours = {
						...updatedBranch.operatingHours,
						[childField]: value,
					};
				}
			} else {
				(updatedBranch as any)[field] = value;
			}

			return updatedBranch;
		});
	};

	// إضافة مرفق جديد
	const addFacility = () => {
		if (!newFacility.trim() || !branch) return;

		setBranch({
			...branch,
			facilities: [...branch.facilities, newFacility.trim()],
		});

		setNewFacility('');
	};

	// حذف مرفق
	const removeFacility = (index: number) => {
		if (!branch) return;

		const updatedFacilities = [...branch.facilities];
		updatedFacilities.splice(index, 1);

		setBranch({
			...branch,
			facilities: updatedFacilities,
		});
	};

	// إضافة تصنيف جديد
	const addTag = () => {
		if (!newTag.trim() || !branch) return;

		setBranch({
			...branch,
			tags: [...branch.tags, newTag.trim()],
		});

		setNewTag('');
	};

	// حذف تصنيف
	const removeTag = (index: number) => {
		if (!branch) return;

		const updatedTags = [...branch.tags];
		updatedTags.splice(index, 1);

		setBranch({
			...branch,
			tags: updatedTags,
		});
	};

	// معالجة اختيار صورة جديدة
	const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setNewPhotoFile(file);

		// إنشاء معاينة للصورة
		const reader = new FileReader();
		reader.onload = () => {
			setPreviewPhoto(reader.result as string);
		};
		reader.readAsDataURL(file);
	};

	// إضافة صورة جديدة
	const addPhoto = () => {
		if (!previewPhoto || !branch) return;

		// في التطبيق الحقيقي سيتم رفع الصورة للخادم أولاً
		setBranch({
			...branch,
			photos: [...branch.photos, previewPhoto],
		});

		setNewPhotoFile(null);
		setPreviewPhoto(null);
	};

	// حذف صورة
	const removePhoto = (index: number) => {
		if (!branch) return;

		const updatedPhotos = [...branch.photos];
		updatedPhotos.splice(index, 1);

		setBranch({
			...branch,
			photos: updatedPhotos,
		});
	};

	// تغيير مدير الفرع
	const handleManagerChange = (managerId: number) => {
		if (!branch) return;

		const selectedManager = managers.find((m) => m.id === managerId);
		if (!selectedManager) return;

		setBranch({
			...branch,
			manager: {
				...branch.manager,
				id: selectedManager.id,
				name: selectedManager.name,
			},
		});
	};

	// حفظ التغييرات
	const handleSave = async () => {
		if (!branch) return;

		setIsSaving(true);
		try {
			// محاكاة لاستدعاء API
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// عرض إشعار النجاح
			setNotification({
				message: 'تم حفظ التغييرات بنجاح',
				type: 'success',
			});

			// الانتظار قليلاً ثم الانتقال إلى صفحة تفاصيل الفرع
			setTimeout(() => {
				router.push(`/dashboard/branches/${params.id}`);
			}, 1500);
		} catch (error) {
			console.error('Error saving branch data:', error);
			setNotification({
				message: 'حدث خطأ أثناء حفظ البيانات',
				type: 'error',
			});
			setIsSaving(false);
		}
	};

	// إلغاء التغييرات
	const handleCancel = () => {
		router.push(`/dashboard/branches/${params.id}`);
	};

	// عرض شاشة التحميل
	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-[70vh]'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
				<span className='mr-3 text-lg text-gray-700'>جاري تحميل بيانات الفرع...</span>
			</div>
		);
	}

	// عرض رسالة خطأ إذا لم يتوفر الفرع
	if (!branch) {
		return (
			<div className='text-center py-10'>
				<AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-4' />
				<h2 className='text-2xl font-bold text-gray-900 mb-2'>لم يتم العثور على الفرع</h2>
				<p className='text-gray-600 mb-6'>لم نتمكن من العثور على بيانات الفرع المطلوب.</p>
				<Link
					href='/dashboard/branches'
					className='inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
				>
					<ArrowLeft className='ml-2 h-5 w-5' />
					العودة إلى قائمة الفروع
				</Link>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row justify-between sm:items-center space-y-4 sm:space-y-0'>
				<div>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<Building className='ml-2 h-6 w-6 text-gray-600' /> تعديل الفرع: {branch.name}
					</h1>
					<p className='mt-1 text-sm text-gray-600'>تعديل بيانات الفرع وإعداداته</p>
				</div>

				<div className='flex space-x-2 space-x-reverse'>
					<button
						onClick={handleCancel}
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'
					>
						<X className='ml-1 h-4 w-4' />
						إلغاء
					</button>

					<button
						onClick={handleSave}
						disabled={isSaving}
						className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center disabled:bg-green-300 disabled:cursor-not-allowed'
					>
						{isSaving ? (
							<>
								<span className='animate-spin h-4 w-4 ml-1 border-2 border-t-transparent border-white rounded-full'></span>
								جاري الحفظ...
							</>
						) : (
							<>
								<Save className='ml-1 h-4 w-4' />
								حفظ التغييرات
							</>
						)}
					</button>
				</div>
			</div>

			{/* نموذج التعديل */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-6 space-y-8'>
					{/* القسم الأول: المعلومات الأساسية */}
					<div>
						<h2 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
							<Building className='ml-2 h-5 w-5 text-gray-500' />
							المعلومات الأساسية
						</h2>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* اسم الفرع */}
							<div>
								<label htmlFor='branch-name' className='block text-sm font-medium text-gray-700 mb-1'>
									اسم الفرع <span className='text-red-500'>*</span>
								</label>
								<input
									id='branch-name'
									type='text'
									value={branch.name}
									onChange={(e) => updateBranchField('name', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>

							{/* رمز الفرع */}
							<div>
								<label htmlFor='branch-code' className='block text-sm font-medium text-gray-700 mb-1'>
									رمز الفرع <span className='text-red-500'>*</span>
								</label>
								<input
									id='branch-code'
									type='text'
									value={branch.code}
									onChange={(e) => updateBranchField('code', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>

							{/* نوع الفرع */}
							<div>
								<label htmlFor='branch-type' className='block text-sm font-medium text-gray-700 mb-1'>
									نوع الفرع <span className='text-red-500'>*</span>
								</label>
								<select
									id='branch-type'
									value={branch.type}
									onChange={(e) => updateBranchField('type', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								>
									{branchTypes.map((type) => (
										<option key={type.id} value={type.id}>
											{type.name}
										</option>
									))}
								</select>
							</div>

							{/* حالة الفرع */}
							<div>
								<label htmlFor='branch-status' className='block text-sm font-medium text-gray-700 mb-1'>
									حالة الفرع <span className='text-red-500'>*</span>
								</label>
								<select
									id='branch-status'
									value={branch.status}
									onChange={(e) => updateBranchField('status', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								>
									{branchStatuses.map((status) => (
										<option key={status.id} value={status.id}>
											{status.name}
										</option>
									))}
								</select>
							</div>

							{/* تاريخ الافتتاح */}
							<div>
								<label htmlFor='opening-date' className='block text-sm font-medium text-gray-700 mb-1'>
									تاريخ الافتتاح <span className='text-red-500'>*</span>
								</label>
								<div className='flex items-center'>
									<Calendar className='absolute right-3 text-gray-400 z-10 pointer-events-none h-5 w-5' />
									<input
										id='opening-date'
										type='date'
										value={branch.openingDate}
										onChange={(e) => updateBranchField('openingDate', e.target.value)}
										className='block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										required
									/>
								</div>
							</div>

							{/* الوصف */}
							<div className='md:col-span-2'>
								<label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-1'>
									وصف الفرع
								</label>
								<textarea
									id='description'
									rows={3}
									value={branch.description || ''}
									onChange={(e) => updateBranchField('description', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
								></textarea>
							</div>
						</div>
					</div>

					<hr className='border-gray-200' />

					{/* القسم الثاني: معلومات العنوان */}
					<div>
						<h2 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
							<MapPin className='ml-2 h-5 w-5 text-gray-500' />
							معلومات العنوان
						</h2>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* الشارع */}
							<div>
								<label htmlFor='street' className='block text-sm font-medium text-gray-700 mb-1'>
									الشارع <span className='text-red-500'>*</span>
								</label>
								<input
									id='street'
									type='text'
									value={branch.address.street}
									onChange={(e) => updateBranchField('address.street', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>

							{/* الحي */}
							<div>
								<label htmlFor='district' className='block text-sm font-medium text-gray-700 mb-1'>
									الحي <span className='text-red-500'>*</span>
								</label>
								<input
									id='district'
									type='text'
									value={branch.address.district}
									onChange={(e) => updateBranchField('address.district', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>

							{/* المدينة */}
							<div>
								<label htmlFor='city' className='block text-sm font-medium text-gray-700 mb-1'>
									المدينة <span className='text-red-500'>*</span>
								</label>
								<select
									id='city'
									value={branch.address.city}
									onChange={(e) => updateBranchField('address.city', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								>
									{cities.map((city) => (
										<option key={city} value={city}>
											{city}
										</option>
									))}
								</select>
							</div>

							{/* الرمز البريدي */}
							<div>
								<label htmlFor='postal-code' className='block text-sm font-medium text-gray-700 mb-1'>
									الرمز البريدي
								</label>
								<input
									id='postal-code'
									type='text'
									value={branch.address.postalCode}
									onChange={(e) => updateBranchField('address.postalCode', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
								/>
							</div>

							{/* الموقع على الخريطة */}
							<div className='md:col-span-2'>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									الموقع على الخريطة
								</label>
								<div className='h-56 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center'>
									<div className='text-center'>
										<MapPin className='h-6 w-6 text-gray-400 mx-auto mb-2' />
										<p className='text-sm text-gray-500'>اضغط لتحديد موقع الفرع على الخريطة</p>
										<p className='text-xs text-gray-400 mt-1'>
											الإحداثيات الحالية: {branch.address.coordinates.lat},{' '}
											{branch.address.coordinates.lng}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<hr className='border-gray-200' />

					{/* القسم الثالث: معلومات الاتصال */}
					<div>
						<h2 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
							<Phone className='ml-2 h-5 w-5 text-gray-500' />
							معلومات الاتصال
						</h2>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* رقم الهاتف */}
							<div>
								<label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>
									رقم الهاتف <span className='text-red-500'>*</span>
								</label>
								<input
									id='phone'
									type='tel'
									value={branch.contact.phone}
									onChange={(e) => updateBranchField('contact.phone', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>

							{/* البريد الإلكتروني */}
							<div>
								<label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
									البريد الإلكتروني <span className='text-red-500'>*</span>
								</label>
								<input
									id='email'
									type='email'
									value={branch.contact.email}
									onChange={(e) => updateBranchField('contact.email', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>

							{/* رقم الواتساب */}
							<div>
								<label htmlFor='whatsapp' className='block text-sm font-medium text-gray-700 mb-1'>
									رقم الواتساب
								</label>
								<input
									id='whatsapp'
									type='tel'
									value={branch.contact.whatsapp || ''}
									onChange={(e) => updateBranchField('contact.whatsapp', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
								/>
							</div>

							{/* الموقع الإلكتروني */}
							<div>
								<label htmlFor='website' className='block text-sm font-medium text-gray-700 mb-1'>
									الموقع الإلكتروني
								</label>
								<input
									id='website'
									type='url'
									value={branch.contact.website || ''}
									onChange={(e) => updateBranchField('contact.website', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
								/>
							</div>
						</div>
					</div>

					<hr className='border-gray-200' />

					{/* القسم الرابع: إدارة الفرع */}
					<div>
						<h2 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
							<User className='ml-2 h-5 w-5 text-gray-500' />
							إدارة الفرع
						</h2>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* مدير الفرع */}
							<div>
								<label htmlFor='manager' className='block text-sm font-medium text-gray-700 mb-1'>
									مدير الفرع <span className='text-red-500'>*</span>
								</label>
								<select
									id='manager'
									value={branch.manager.id}
									onChange={(e) => handleManagerChange(parseInt(e.target.value))}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								>
									{managers.map((manager) => (
										<option key={manager.id} value={manager.id}>
											{manager.name}
										</option>
									))}
								</select>
							</div>

							{/* رقم هاتف المدير */}
							<div>
								<label htmlFor='manager-phone' className='block text-sm font-medium text-gray-700 mb-1'>
									رقم هاتف المدير <span className='text-red-500'>*</span>
								</label>
								<input
									id='manager-phone'
									type='tel'
									value={branch.manager.phone}
									onChange={(e) => updateBranchField('manager.phone', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>

							{/* بريد المدير الإلكتروني */}
							<div>
								<label htmlFor='manager-email' className='block text-sm font-medium text-gray-700 mb-1'>
									البريد الإلكتروني للمدير <span className='text-red-500'>*</span>
								</label>
								<input
									id='manager-email'
									type='email'
									value={branch.manager.email}
									onChange={(e) => updateBranchField('manager.email', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>

							{/* عدد الموظفين */}
							<div>
								<label
									htmlFor='employees-count'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									عدد الموظفين <span className='text-red-500'>*</span>
								</label>
								<input
									id='employees-count'
									type='number'
									min='0'
									value={branch.employeesCount}
									onChange={(e) => updateBranchField('employeesCount', parseInt(e.target.value))}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>
						</div>
					</div>

					<hr className='border-gray-200' />

					{/* القسم الخامس: أوقات العمل */}
					<div>
						<h2 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
							<Clock className='ml-2 h-5 w-5 text-gray-500' />
							أوقات العمل
						</h2>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* أوقات العمل في أيام الأسبوع */}
							<div>
								<label htmlFor='weekdays' className='block text-sm font-medium text-gray-700 mb-1'>
									أيام الأسبوع <span className='text-red-500'>*</span>
								</label>
								<input
									id='weekdays'
									type='text'
									value={branch.operatingHours.weekdays}
									onChange={(e) => updateBranchField('operatingHours.weekdays', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>

							{/* أوقات العمل في نهاية الأسبوع */}
							<div>
								<label htmlFor='weekends' className='block text-sm font-medium text-gray-700 mb-1'>
									نهاية الأسبوع <span className='text-red-500'>*</span>
								</label>
								<input
									id='weekends'
									type='text'
									value={branch.operatingHours.weekends}
									onChange={(e) => updateBranchField('operatingHours.weekends', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>

							{/* أوقات العمل في الإجازات */}
							<div>
								<label htmlFor='holidays' className='block text-sm font-medium text-gray-700 mb-1'>
									الإجازات الرسمية <span className='text-red-500'>*</span>
								</label>
								<input
									id='holidays'
									type='text'
									value={branch.operatingHours.holidays}
									onChange={(e) => updateBranchField('operatingHours.holidays', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>

							{/* ملاحظات على أوقات العمل */}
							<div>
								<label htmlFor='hours-notes' className='block text-sm font-medium text-gray-700 mb-1'>
									ملاحظات
								</label>
								<input
									id='hours-notes'
									type='text'
									value={branch.operatingHours.notes || ''}
									onChange={(e) => updateBranchField('operatingHours.notes', e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
								/>
							</div>
						</div>
					</div>

					<hr className='border-gray-200' />

					{/* القسم السادس: معلومات المبنى */}
					<div>
						<h2 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
							<Building className='ml-2 h-5 w-5 text-gray-500' />
							معلومات المبنى
						</h2>

						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							{/* المساحة */}
							<div>
								<label htmlFor='area' className='block text-sm font-medium text-gray-700 mb-1'>
									المساحة (متر مربع) <span className='text-red-500'>*</span>
								</label>
								<input
									id='area'
									type='number'
									min='0'
									value={branch.area}
									onChange={(e) => updateBranchField('area', parseInt(e.target.value))}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>

							{/* القدرة الاستيعابية */}
							<div>
								<label htmlFor='capacity' className='block text-sm font-medium text-gray-700 mb-1'>
									القدرة الاستيعابية (شخص) <span className='text-red-500'>*</span>
								</label>
								<input
									id='capacity'
									type='number'
									min='0'
									value={branch.maxCapacity}
									onChange={(e) => updateBranchField('maxCapacity', parseInt(e.target.value))}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									required
								/>
							</div>

							{/* المرافق */}
							<div className='md:col-span-2'>
								<label className='block text-sm font-medium text-gray-700 mb-2'>المرافق</label>
								<div className='flex flex-wrap items-center gap-2 mb-2'>
									{branch.facilities.map((facility, index) => (
										<div
											key={index}
											className='inline-flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1'
										>
											<span className='text-sm'>{facility}</span>
											<button
												type='button'
												onClick={() => removeFacility(index)}
												className='mr-1 text-green-600 hover:text-green-800 focus:outline-none'
											>
												<X className='h-3 w-3' />
											</button>
										</div>
									))}
								</div>
								<div className='flex'>
									<input
										type='text'
										value={newFacility}
										onChange={(e) => setNewFacility(e.target.value)}
										placeholder='إضافة مرفق جديد'
										className='block flex-1 px-3 py-2 border border-gray-300 rounded-r-none rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500'
									/>
									<button
										type='button'
										onClick={addFacility}
										className='px-3 py-2 border border-r-0 border-gray-300 rounded-l-md rounded-r-none bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none'
									>
										<Plus className='h-5 w-5' />
									</button>
								</div>
							</div>

							{/* التصنيفات */}
							<div className='md:col-span-2'>
								<label className='block text-sm font-medium text-gray-700 mb-2'>التصنيفات</label>
								<div className='flex flex-wrap items-center gap-2 mb-2'>
									{branch.tags.map((tag, index) => (
										<div
											key={index}
											className='inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1'
										>
											<Tag className='h-3 w-3 ml-1' />
											<span className='text-sm'>{tag}</span>
											<button
												type='button'
												onClick={() => removeTag(index)}
												className='mr-1 text-blue-600 hover:text-blue-800 focus:outline-none'
											>
												<X className='h-3 w-3' />
											</button>
										</div>
									))}
								</div>
								<div className='flex'>
									<input
										type='text'
										value={newTag}
										onChange={(e) => setNewTag(e.target.value)}
										placeholder='إضافة تصنيف جديد'
										className='block flex-1 px-3 py-2 border border-gray-300 rounded-r-none rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500'
									/>
									<button
										type='button'
										onClick={addTag}
										className='px-3 py-2 border border-r-0 border-gray-300 rounded-l-md rounded-r-none bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none'
									>
										<Plus className='h-5 w-5' />
									</button>
								</div>
							</div>
						</div>
					</div>

					<hr className='border-gray-200' />

					{/* القسم السابع: صور الفرع */}
					<div>
						<h2 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
							<Image className='ml-2 h-5 w-5 text-gray-500' />
							صور الفرع
						</h2>

						<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
							{branch.photos.map((photo, index) => (
								<div key={index} className='relative h-48 bg-gray-100 rounded-lg overflow-hidden'>
									<img
										src={photo}
										alt={`صورة ${index + 1} للفرع`}
										className='h-full w-full object-cover'
									/>
									<button
										type='button'
										onClick={() => removePhoto(index)}
										className='absolute top-2 left-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 focus:outline-none'
									>
										<Trash className='h-4 w-4' />
									</button>
								</div>
							))}

							{/* إضافة صورة جديدة */}
							<div className='h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer'>
								<input
									type='file'
									id='add-photo'
									accept='image/*'
									onChange={handlePhotoChange}
									className='hidden'
								/>
								<label
									htmlFor='add-photo'
									className='w-full h-full flex flex-col items-center justify-center cursor-pointer'
								>
									<Upload className='h-8 w-8 text-gray-400 mb-2' />
									<p className='text-sm text-gray-500'>أضف صورة جديدة</p>
								</label>
							</div>
						</div>

						{/* معاينة الصورة الجديدة */}
						{previewPhoto && (
							<div className='mb-4'>
								<h3 className='text-sm font-medium text-gray-700 mb-2'>معاينة الصورة الجديدة</h3>
								<div className='flex items-start space-x-4 space-x-reverse'>
									<div className='relative h-32 w-32 bg-gray-100 rounded-lg overflow-hidden'>
										<img
											src={previewPhoto}
											alt='معاينة الصورة'
											className='h-full w-full object-cover'
										/>
									</div>
									<div className='flex-1 space-y-2'>
										<p className='text-sm text-gray-500'>
											{newPhotoFile?.name} (
											{newPhotoFile?.size && (newPhotoFile.size / 1024).toFixed(2)} كيلوبايت)
										</p>
										<div className='flex space-x-2 space-x-reverse'>
											<button
												type='button'
												onClick={addPhoto}
												className='px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none'
											>
												إضافة الصورة
											</button>
											<button
												type='button'
												onClick={() => {
													setNewPhotoFile(null);
													setPreviewPhoto(null);
												}}
												className='px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none'
											>
												إلغاء
											</button>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>

				{/* أزرار الحفظ والإلغاء */}
				<div className='px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end'>
					<button
						type='button'
						onClick={handleCancel}
						className='ml-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none'
					>
						إلغاء
					</button>
					<button
						type='button'
						onClick={handleSave}
						disabled={isSaving}
						className='px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:bg-green-300 disabled:cursor-not-allowed'
					>
						{isSaving ? (
							<>
								<span className='animate-spin h-4 w-4 ml-1 border-2 border-t-transparent border-white rounded-full inline-block'></span>
								جاري الحفظ...
							</>
						) : (
							'حفظ التغييرات'
						)}
					</button>
				</div>
			</div>

			{/* الإشعارات */}
			{notification && (
				<div
					className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 space-x-reverse z-50 ${
						notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
					}`}
				>
					{notification.type === 'success' ? (
						<CheckCircle className='h-5 w-5 text-green-500' />
					) : (
						<AlertCircle className='h-5 w-5 text-red-500' />
					)}
					<span>{notification.message}</span>
				</div>
			)}
		</div>
	);
}
