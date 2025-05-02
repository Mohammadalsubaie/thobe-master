'use client';

import {
	AlertCircle,
	ArrowLeft,
	Briefcase,
	Building,
	CheckCircle,
	DollarSign,
	FileText,
	Phone,
	PlusCircle,
	Save,
	Trash,
	Upload,
	User,
	UserCheck,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Employee {
	id: number;
	name: string;
	employeeId: string;
	position: string;
	department: string;
	branch: {
		id: number;
		name: string;
	};
	phone: string;
	email: string;
	hireDate: string;
	status: 'active' | 'vacation' | 'sick' | 'leave' | 'terminated';
	photo?: string;
	gender: 'male' | 'female';
	nationality: string;
	idNumber: string;
	birthDate?: string;
	address?: string;
	city?: string;
	performanceRating?: number;
	salary?: number;
	bankAccount?: string;
	bankName?: string;
	skills?: string[];
	educations?: {
		degree: string;
		institution: string;
		year: string;
	}[];
	experiences?: {
		position: string;
		company: string;
		period: string;
	}[];
	directManager?: {
		id: number;
		name: string;
		position: string;
	};
	emergencyContact?: {
		name: string;
		relation: string;
		phone: string;
	};
	notes?: string;
}

// الأقسام المتاحة في الشركة
const departments = [
	'الإدارة',
	'المبيعات',
	'خدمة العملاء',
	'الإنتاج',
	'الموارد البشرية',
	'المالية',
	'تطوير الأعمال',
	'المستودعات',
	'التسويق',
];

// الوظائف المتاحة في الشركة
const positions = [
	'مدير فرع',
	'مساعد مدير',
	'مسؤول مبيعات',
	'مسؤول خدمة عملاء',
	'كاشير',
	'خياط',
	'مسؤول القياسات',
	'مسؤول مستودع',
	'محاسب',
	'موظف موارد بشرية',
	'مسوق',
	'مدير تطوير أعمال',
];

// الفروع المتاحة في الشركة
const branches = [
	{ id: 1, name: 'فرع الرياض الرئيسي' },
	{ id: 2, name: 'فرع جدة' },
	{ id: 3, name: 'فرع الدمام' },
	{ id: 4, name: 'فرع مكة' },
	{ id: 5, name: 'فرع المدينة' },
	{ id: 6, name: 'فرع الطائف' },
];

// المدراء المتاحين للإشراف
const managers = [
	{ id: 101, name: 'أحمد العمري', position: 'مدير فرع' },
	{ id: 108, name: 'عمر المالكي', position: 'مدير فرع' },
	{ id: 102, name: 'محمد القحطاني', position: 'مسؤول المبيعات' },
	{ id: 106, name: 'سارة المطيري', position: 'مديرة قسم الإنتاج' },
];

export default function EditEmployeePage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const [employee, setEmployee] = useState<Employee | null>(null);
	const [loading, setLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

	// المهارات الجديدة والتعليم والخبرات
	const [newSkill, setNewSkill] = useState('');
	const [newEducation, setNewEducation] = useState({ degree: '', institution: '', year: '' });
	const [newExperience, setNewExperience] = useState({ position: '', company: '', period: '' });

	// ملف الصورة الجديدة
	const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
	const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

	// تحميل بيانات الموظف
	useEffect(() => {
		const fetchEmployeeData = async () => {
			setLoading(true);
			try {
				// محاكاة لتحميل البيانات من API
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// بيانات تجريبية للموظف
				const mockEmployee: Employee = {
					id: parseInt(params.id),
					name: 'نورة الحربي',
					employeeId: 'EMP-1007',
					position: 'مسؤولة القياسات',
					department: 'الإنتاج',
					branch: {
						id: 1,
						name: 'فرع الرياض الرئيسي',
					},
					phone: '966512345684',
					email: 'noura@example.com',
					hireDate: '2021-02-15',
					status: 'active',
					gender: 'female',
					nationality: 'سعودية',
					idNumber: '1234567896',
					birthDate: '1990-06-20',
					address: 'حي الملقا، شارع الأمير سعود',
					city: 'الرياض',
					performanceRating: 4.5,
					salary: 8500,
					bankAccount: 'SA123456789012345678',
					bankName: 'البنك الأهلي السعودي',
					skills: ['قياسات دقيقة', 'خدمة عملاء', 'تصميم أزياء', 'تعديلات'],
					educations: [
						{
							degree: 'بكالوريوس تصميم أزياء',
							institution: 'جامعة الأميرة نورة',
							year: '2018',
						},
						{
							degree: 'دبلوم خياطة وتفصيل',
							institution: 'معهد التدريب المهني',
							year: '2016',
						},
					],
					experiences: [
						{
							position: 'مساعدة تصميم',
							company: 'دار الأزياء العربية',
							period: '2018 - 2021',
						},
						{
							position: 'متدربة',
							company: 'أزياء الشرق',
							period: '2017 - 2018',
						},
					],
					directManager: {
						id: 106,
						name: 'سارة المطيري',
						position: 'مديرة قسم الإنتاج',
					},
					emergencyContact: {
						name: 'منيرة الحربي',
						relation: 'أخت',
						phone: '966512345690',
					},
					notes: 'موظفة متميزة وملتزمة بمواعيد العمل. تتمتع بمهارات عالية في القياسات الدقيقة ورضا العملاء عن تعاملها ممتاز.',
				};

				setEmployee(mockEmployee);
			} catch (error) {
				console.error('Error fetching employee data:', error);
				setNotification({
					message: 'حدث خطأ أثناء تحميل بيانات الموظف',
					type: 'error',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchEmployeeData();
	}, [params.id]);

	// تحديث بيانات الموظف
	const updateEmployeeField = (field: string, value: any) => {
		if (!employee) return;

		setEmployee((prevEmployee) => {
			if (!prevEmployee) return null;

			// للحقول المتداخلة، نستخدم الكائن المؤقت
			const updatedEmployee = { ...prevEmployee };

			// تحديد نوع الحقل وتحديثه
			if (field.includes('.')) {
				const [parentField, childField] = field.split('.');

				if (parentField === 'branch') {
					updatedEmployee.branch = {
						...updatedEmployee.branch,
						[childField]: value,
					};
				} else if (parentField === 'emergencyContact') {
					updatedEmployee.emergencyContact = {
						...(updatedEmployee.emergencyContact || { name: '', relation: '', phone: '' }),
						[childField]: value,
					};
				} else if (parentField === 'directManager') {
					updatedEmployee.directManager = {
						...(updatedEmployee.directManager || { id: 0, name: '', position: '' }),
						[childField]: value,
					};
				}
			} else {
				(updatedEmployee as any)[field] = value;
			}

			return updatedEmployee;
		});
	};

	// معالجة اختيار المدير المباشر
	const handleManagerChange = (managerId: number) => {
		if (!employee) return;

		const selectedManager = managers.find((m) => m.id === managerId);
		if (!selectedManager) return;

		setEmployee({
			...employee,
			directManager: {
				id: selectedManager.id,
				name: selectedManager.name,
				position: selectedManager.position,
			},
		});
	};

	// إضافة مهارة جديدة
	const addSkill = () => {
		if (!newSkill.trim() || !employee) return;

		setEmployee({
			...employee,
			skills: [...(employee.skills || []), newSkill.trim()],
		});

		setNewSkill('');
	};

	// حذف مهارة
	const removeSkill = (index: number) => {
		if (!employee || !employee.skills) return;

		const updatedSkills = [...employee.skills];
		updatedSkills.splice(index, 1);

		setEmployee({
			...employee,
			skills: updatedSkills,
		});
	};

	// إضافة تعليم جديد
	const addEducation = () => {
		if (!newEducation.degree.trim() || !newEducation.institution.trim() || !newEducation.year.trim() || !employee)
			return;

		setEmployee({
			...employee,
			educations: [...(employee.educations || []), { ...newEducation }],
		});

		setNewEducation({ degree: '', institution: '', year: '' });
	};

	// حذف تعليم
	const removeEducation = (index: number) => {
		if (!employee || !employee.educations) return;

		const updatedEducations = [...employee.educations];
		updatedEducations.splice(index, 1);

		setEmployee({
			...employee,
			educations: updatedEducations,
		});
	};

	// إضافة خبرة جديدة
	const addExperience = () => {
		if (
			!newExperience.position.trim() ||
			!newExperience.company.trim() ||
			!newExperience.period.trim() ||
			!employee
		)
			return;

		setEmployee({
			...employee,
			experiences: [...(employee.experiences || []), { ...newExperience }],
		});

		setNewExperience({ position: '', company: '', period: '' });
	};

	// حذف خبرة
	const removeExperience = (index: number) => {
		if (!employee || !employee.experiences) return;

		const updatedExperiences = [...employee.experiences];
		updatedExperiences.splice(index, 1);

		setEmployee({
			...employee,
			experiences: updatedExperiences,
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

	// تحديث الصورة
	const updatePhoto = () => {
		if (!previewPhoto || !employee) return;

		// في التطبيق الحقيقي سيتم رفع الصورة للخادم أولاً
		setEmployee({
			...employee,
			photo: previewPhoto,
		});

		setNewPhotoFile(null);
		setPreviewPhoto(null);
	};

	// حفظ التغييرات
	const handleSave = async () => {
		if (!employee) return;

		setIsSaving(true);
		try {
			// محاكاة لاستدعاء API
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// عرض إشعار النجاح
			setNotification({
				message: 'تم حفظ بيانات الموظف بنجاح',
				type: 'success',
			});

			// الانتظار قليلاً ثم الانتقال إلى صفحة تفاصيل الموظف
			setTimeout(() => {
				router.push(`/dashboard/employees/${params.id}`);
			}, 1500);
		} catch (error) {
			console.error('Error saving employee data:', error);
			setNotification({
				message: 'حدث خطأ أثناء حفظ البيانات',
				type: 'error',
			});
			setIsSaving(false);
		}
	};

	// إلغاء التغييرات
	const handleCancel = () => {
		router.push(`/dashboard/employees/${params.id}`);
	};

	// عرض شاشة التحميل
	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-[70vh]'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
				<span className='mr-3 text-lg text-gray-700'>جاري تحميل بيانات الموظف...</span>
			</div>
		);
	}

	// عرض رسالة خطأ إذا لم يتوفر الموظف
	if (!employee) {
		return (
			<div className='text-center py-10'>
				<AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-4' />
				<h2 className='text-2xl font-bold text-gray-900 mb-2'>لم يتم العثور على الموظف</h2>
				<p className='text-gray-600 mb-6'>لم نتمكن من العثور على بيانات الموظف المطلوب.</p>
				<Link
					href='/dashboard/employees'
					className='inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
				>
					<ArrowLeft className='ml-2 h-5 w-5' />
					العودة إلى قائمة الموظفين
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
						<User className='ml-2 h-6 w-6 text-gray-600' /> تعديل بيانات الموظف: {employee.name}
					</h1>
					<p className='mt-1 text-sm text-gray-600'>تعديل البيانات الشخصية والوظيفية للموظف</p>
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
					{/* الصورة الشخصية */}
					<div className='flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 sm:space-x-reverse'>
						<div className='relative'>
							<div className='h-24 w-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center'>
								{employee.photo || previewPhoto ? (
									<img
										src={previewPhoto || employee.photo}
										alt={employee.name}
										className='h-full w-full object-cover'
									/>
								) : (
									<User className='h-12 w-12 text-gray-400' />
								)}
							</div>
							<label
								htmlFor='photo-upload'
								className='absolute bottom-0 right-0 h-8 w-8 bg-green-100 rounded-full flex items-center justify-center cursor-pointer border-2 border-white'
							>
								<Upload className='h-4 w-4 text-green-600' />
								<input
									id='photo-upload'
									type='file'
									accept='image/*'
									onChange={handlePhotoChange}
									className='hidden'
								/>
							</label>
						</div>

						<div className='flex-1'>
							<h3 className='text-lg font-medium text-gray-900'>{employee.name}</h3>
							<p className='text-sm text-gray-500'>
								{employee.position} - {employee.department}
							</p>

							{previewPhoto && (
								<div className='mt-2 flex space-x-2 space-x-reverse'>
									<button
										onClick={updatePhoto}
										className='px-2 py-1 text-xs text-green-700 bg-green-100 rounded hover:bg-green-200'
									>
										تأكيد الصورة الجديدة
									</button>
									<button
										onClick={() => {
											setNewPhotoFile(null);
											setPreviewPhoto(null);
										}}
										className='px-2 py-1 text-xs text-red-700 bg-red-100 rounded hover:bg-red-200'
									>
										إلغاء
									</button>
								</div>
							)}
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* المعلومات الأساسية */}
						<div>
							<h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
								<User className='ml-2 h-5 w-5 text-gray-500' />
								المعلومات الأساسية
							</h3>

							<div className='space-y-4'>
								{/* الاسم */}
								<div>
									<label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
										الاسم الكامل <span className='text-red-500'>*</span>
									</label>
									<input
										id='name'
										type='text'
										value={employee.name}
										onChange={(e) => updateEmployeeField('name', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										required
									/>
								</div>

								{/* رقم الموظف */}
								<div>
									<label
										htmlFor='employee-id'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										رقم الموظف <span className='text-red-500'>*</span>
									</label>
									<input
										id='employee-id'
										type='text'
										value={employee.employeeId}
										onChange={(e) => updateEmployeeField('employeeId', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										required
									/>
								</div>

								{/* الجنس */}
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										الجنس <span className='text-red-500'>*</span>
									</label>
									<div className='flex space-x-4 space-x-reverse'>
										<div className='flex items-center'>
											<input
												id='gender-male'
												type='radio'
												name='gender'
												value='male'
												checked={employee.gender === 'male'}
												onChange={() => updateEmployeeField('gender', 'male')}
												className='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300'
											/>
											<label htmlFor='gender-male' className='mr-2 block text-sm text-gray-700'>
												ذكر
											</label>
										</div>
										<div className='flex items-center'>
											<input
												id='gender-female'
												type='radio'
												name='gender'
												value='female'
												checked={employee.gender === 'female'}
												onChange={() => updateEmployeeField('gender', 'female')}
												className='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300'
											/>
											<label htmlFor='gender-female' className='mr-2 block text-sm text-gray-700'>
												أنثى
											</label>
										</div>
									</div>
								</div>

								{/* الجنسية */}
								<div>
									<label
										htmlFor='nationality'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										الجنسية <span className='text-red-500'>*</span>
									</label>
									<input
										id='nationality'
										type='text'
										value={employee.nationality}
										onChange={(e) => updateEmployeeField('nationality', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										required
									/>
								</div>

								{/* رقم الهوية */}
								<div>
									<label htmlFor='id-number' className='block text-sm font-medium text-gray-700 mb-1'>
										رقم الهوية <span className='text-red-500'>*</span>
									</label>
									<input
										id='id-number'
										type='text'
										value={employee.idNumber}
										onChange={(e) => updateEmployeeField('idNumber', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										required
									/>
								</div>

								{/* تاريخ الميلاد */}
								<div>
									<label
										htmlFor='birth-date'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										تاريخ الميلاد
									</label>
									<input
										id='birth-date'
										type='date'
										value={employee.birthDate || ''}
										onChange={(e) => updateEmployeeField('birthDate', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									/>
								</div>
							</div>
						</div>

						{/* معلومات التواصل */}
						<div>
							<h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
								<Phone className='ml-2 h-5 w-5 text-gray-500' />
								معلومات التواصل
							</h3>

							<div className='space-y-4'>
								{/* رقم الهاتف */}
								<div>
									<label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-1'>
										رقم الهاتف <span className='text-red-500'>*</span>
									</label>
									<input
										id='phone'
										type='tel'
										value={employee.phone}
										onChange={(e) => updateEmployeeField('phone', e.target.value)}
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
										value={employee.email}
										onChange={(e) => updateEmployeeField('email', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										required
									/>
								</div>

								{/* العنوان */}
								<div>
									<label htmlFor='address' className='block text-sm font-medium text-gray-700 mb-1'>
										العنوان
									</label>
									<input
										id='address'
										type='text'
										value={employee.address || ''}
										onChange={(e) => updateEmployeeField('address', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									/>
								</div>

								{/* المدينة */}
								<div>
									<label htmlFor='city' className='block text-sm font-medium text-gray-700 mb-1'>
										المدينة
									</label>
									<input
										id='city'
										type='text'
										value={employee.city || ''}
										onChange={(e) => updateEmployeeField('city', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									/>
								</div>

								<h4 className='text-sm font-medium text-gray-700 pt-2 mt-2 border-t border-gray-200'>
									بيانات الطوارئ
								</h4>

								{/* اسم جهة الاتصال في حالات الطوارئ */}
								<div>
									<label
										htmlFor='emergency-name'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										اسم جهة الاتصال
									</label>
									<input
										id='emergency-name'
										type='text'
										value={employee.emergencyContact?.name || ''}
										onChange={(e) => updateEmployeeField('emergencyContact.name', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									/>
								</div>

								{/* صلة القرابة */}
								<div>
									<label
										htmlFor='emergency-relation'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										صلة القرابة
									</label>
									<input
										id='emergency-relation'
										type='text'
										value={employee.emergencyContact?.relation || ''}
										onChange={(e) =>
											updateEmployeeField('emergencyContact.relation', e.target.value)
										}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									/>
								</div>

								{/* رقم هاتف الطوارئ */}
								<div>
									<label
										htmlFor='emergency-phone'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										رقم هاتف الطوارئ
									</label>
									<input
										id='emergency-phone'
										type='tel'
										value={employee.emergencyContact?.phone || ''}
										onChange={(e) => updateEmployeeField('emergencyContact.phone', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									/>
								</div>
							</div>
						</div>
					</div>

					<hr className='border-gray-200' />

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* معلومات العمل */}
						<div>
							<h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
								<Briefcase className='ml-2 h-5 w-5 text-gray-500' />
								معلومات العمل
							</h3>

							<div className='space-y-4'>
								{/* المنصب */}
								<div>
									<label htmlFor='position' className='block text-sm font-medium text-gray-700 mb-1'>
										المنصب <span className='text-red-500'>*</span>
									</label>
									<select
										id='position'
										value={employee.position}
										onChange={(e) => updateEmployeeField('position', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										required
									>
										<option value=''>اختر المنصب</option>
										{positions.map((position, index) => (
											<option key={index} value={position}>
												{position}
											</option>
										))}
									</select>
								</div>

								{/* القسم */}
								<div>
									<label
										htmlFor='department'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										القسم <span className='text-red-500'>*</span>
									</label>
									<select
										id='department'
										value={employee.department}
										onChange={(e) => updateEmployeeField('department', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										required
									>
										<option value=''>اختر القسم</option>
										{departments.map((department, index) => (
											<option key={index} value={department}>
												{department}
											</option>
										))}
									</select>
								</div>

								{/* الفرع */}
								<div>
									<label htmlFor='branch' className='block text-sm font-medium text-gray-700 mb-1'>
										الفرع <span className='text-red-500'>*</span>
									</label>
									<select
										id='branch'
										value={employee.branch.id}
										onChange={(e) => updateEmployeeField('branch.id', parseInt(e.target.value))}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										required
									>
										<option value=''>اختر الفرع</option>
										{branches.map((branch) => (
											<option key={branch.id} value={branch.id}>
												{branch.name}
											</option>
										))}
									</select>
								</div>

								{/* المدير المباشر */}
								<div>
									<label htmlFor='manager' className='block text-sm font-medium text-gray-700 mb-1'>
										المدير المباشر
									</label>
									<select
										id='manager'
										value={employee.directManager?.id || ''}
										onChange={(e) => handleManagerChange(parseInt(e.target.value))}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									>
										<option value=''>بدون مدير مباشر</option>
										{managers.map((manager) => (
											<option key={manager.id} value={manager.id}>
												{manager.name} - {manager.position}
											</option>
										))}
									</select>
								</div>

								{/* تاريخ التعيين */}
								<div>
									<label htmlFor='hire-date' className='block text-sm font-medium text-gray-700 mb-1'>
										تاريخ التعيين <span className='text-red-500'>*</span>
									</label>
									<input
										id='hire-date'
										type='date'
										value={employee.hireDate}
										onChange={(e) => updateEmployeeField('hireDate', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										required
									/>
								</div>

								{/* حالة الموظف */}
								<div>
									<label htmlFor='status' className='block text-sm font-medium text-gray-700 mb-1'>
										حالة الموظف <span className='text-red-500'>*</span>
									</label>
									<select
										id='status'
										value={employee.status}
										onChange={(e) => updateEmployeeField('status', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										required
									>
										<option value='active'>نشط</option>
										<option value='vacation'>إجازة</option>
										<option value='sick'>مرضي</option>
										<option value='leave'>غائب</option>
										<option value='terminated'>منتهي</option>
									</select>
								</div>
							</div>
						</div>

						{/* المعلومات المالية */}
						<div>
							<h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
								<DollarSign className='ml-2 h-5 w-5 text-gray-500' />
								المعلومات المالية
							</h3>

							<div className='space-y-4'>
								{/* الراتب */}
								<div>
									<label htmlFor='salary' className='block text-sm font-medium text-gray-700 mb-1'>
										الراتب الشهري
									</label>
									<div className='relative'>
										<input
											id='salary'
											type='number'
											value={employee.salary || ''}
											onChange={(e) =>
												updateEmployeeField('salary', parseFloat(e.target.value) || 0)
											}
											className='block w-full pl-12 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
										/>
										<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
											<span className='text-gray-500 sm:text-sm'>ريال</span>
										</div>
									</div>
								</div>

								{/* البنك */}
								<div>
									<label htmlFor='bank-name' className='block text-sm font-medium text-gray-700 mb-1'>
										اسم البنك
									</label>
									<input
										id='bank-name'
										type='text'
										value={employee.bankName || ''}
										onChange={(e) => updateEmployeeField('bankName', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									/>
								</div>

								{/* رقم الحساب */}
								<div>
									<label
										htmlFor='bank-account'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										رقم الحساب (IBAN)
									</label>
									<input
										id='bank-account'
										type='text'
										value={employee.bankAccount || ''}
										onChange={(e) => updateEmployeeField('bankAccount', e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
									/>
								</div>
							</div>
						</div>
					</div>

					<hr className='border-gray-200' />

					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						{/* المهارات */}
						<div>
							<h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
								<UserCheck className='ml-2 h-5 w-5 text-gray-500' />
								المهارات
							</h3>

							<div className='mb-4'>
								<div className='flex flex-wrap gap-2 mb-3'>
									{employee.skills &&
										employee.skills.map((skill, index) => (
											<div
												key={index}
												className='inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1'
											>
												<span className='text-sm'>{skill}</span>
												<button
													type='button'
													onClick={() => removeSkill(index)}
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
										placeholder='أضف مهارة جديدة'
										value={newSkill}
										onChange={(e) => setNewSkill(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-green-500 focus:border-green-500'
									/>
									<button
										type='button'
										onClick={addSkill}
										disabled={!newSkill.trim()}
										className='px-3 py-2 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-500 hover:bg-gray-100 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
									>
										<PlusCircle className='h-5 w-5' />
									</button>
								</div>
							</div>
						</div>

						{/* التعليم */}
						<div>
							<h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
								<Building className='ml-2 h-5 w-5 text-gray-500' />
								التعليم
							</h3>

							<div className='mb-4'>
								<div className='space-y-3 mb-3'>
									{employee.educations &&
										employee.educations.map((education, index) => (
											<div key={index} className='border border-gray-200 rounded-md p-3 relative'>
												<button
													type='button'
													onClick={() => removeEducation(index)}
													className='absolute top-2 left-2 text-red-600 hover:text-red-800 focus:outline-none'
												>
													<Trash className='h-4 w-4' />
												</button>

												<p className='font-medium text-sm text-gray-900'>{education.degree}</p>
												<p className='text-xs text-gray-600'>
													{education.institution} - {education.year}
												</p>
											</div>
										))}
								</div>

								<div className='border border-gray-200 rounded-md p-3'>
									<div className='space-y-2'>
										<input
											type='text'
											placeholder='الشهادة أو الدرجة العلمية'
											value={newEducation.degree}
											onChange={(e) =>
												setNewEducation({ ...newEducation, degree: e.target.value })
											}
											className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm'
										/>
										<input
											type='text'
											placeholder='الجامعة أو المؤسسة التعليمية'
											value={newEducation.institution}
											onChange={(e) =>
												setNewEducation({ ...newEducation, institution: e.target.value })
											}
											className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm'
										/>
										<div className='flex justify-between items-center'>
											<input
												type='text'
												placeholder='سنة التخرج'
												value={newEducation.year}
												onChange={(e) =>
													setNewEducation({ ...newEducation, year: e.target.value })
												}
												className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm'
											/>
											<button
												type='button'
												onClick={addEducation}
												disabled={
													!newEducation.degree.trim() ||
													!newEducation.institution.trim() ||
													!newEducation.year.trim()
												}
												className='mr-2 text-green-600 hover:text-green-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
											>
												<PlusCircle className='h-5 w-5' />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* الخبرات السابقة */}
						<div>
							<h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
								<Briefcase className='ml-2 h-5 w-5 text-gray-500' />
								الخبرات السابقة
							</h3>

							<div className='mb-4'>
								<div className='space-y-3 mb-3'>
									{employee.experiences &&
										employee.experiences.map((experience, index) => (
											<div key={index} className='border border-gray-200 rounded-md p-3 relative'>
												<button
													type='button'
													onClick={() => removeExperience(index)}
													className='absolute top-2 left-2 text-red-600 hover:text-red-800 focus:outline-none'
												>
													<Trash className='h-4 w-4' />
												</button>

												<p className='font-medium text-sm text-gray-900'>
													{experience.position}
												</p>
												<p className='text-xs text-gray-600'>
													{experience.company} - {experience.period}
												</p>
											</div>
										))}
								</div>

								<div className='border border-gray-200 rounded-md p-3'>
									<div className='space-y-2'>
										<input
											type='text'
											placeholder='المنصب'
											value={newExperience.position}
											onChange={(e) =>
												setNewExperience({ ...newExperience, position: e.target.value })
											}
											className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm'
										/>
										<input
											type='text'
											placeholder='الشركة أو المؤسسة'
											value={newExperience.company}
											onChange={(e) =>
												setNewExperience({ ...newExperience, company: e.target.value })
											}
											className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm'
										/>
										<div className='flex justify-between items-center'>
											<input
												type='text'
												placeholder='الفترة (مثال: 2018 - 2020)'
												value={newExperience.period}
												onChange={(e) =>
													setNewExperience({ ...newExperience, period: e.target.value })
												}
												className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm'
											/>
											<button
												type='button'
												onClick={addExperience}
												disabled={
													!newExperience.position.trim() ||
													!newExperience.company.trim() ||
													!newExperience.period.trim()
												}
												className='mr-2 text-green-600 hover:text-green-800 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed'
											>
												<PlusCircle className='h-5 w-5' />
											</button>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<hr className='border-gray-200' />

					{/* الملاحظات */}
					<div>
						<h3 className='text-lg font-medium text-gray-900 mb-4 flex items-center'>
							<FileText className='ml-2 h-5 w-5 text-gray-500' />
							ملاحظات إضافية
						</h3>

						<div>
							<textarea
								rows={4}
								value={employee.notes || ''}
								onChange={(e) => updateEmployeeField('notes', e.target.value)}
								placeholder='أدخل أي ملاحظات إضافية خاصة بالموظف هنا...'
								className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
							></textarea>
						</div>
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
