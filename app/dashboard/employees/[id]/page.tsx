'use client';

import {
	AlertCircle,
	ArrowLeft,
	Award,
	BarChart,
	Briefcase,
	CheckCircle,
	Clock,
	Download,
	Edit,
	Eye,
	FileText,
	Image,
	Mail,
	Phone,
	PieChart,
	PlusCircle,
	Printer,
	Send,
	Share2,
	Shield,
	Star,
	Trash,
	Upload,
	User,
	XCircle,
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
	documents?: {
		id: number;
		name: string;
		type: string;
		date: string;
		size: number;
		url: string;
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
	attendance?: {
		month: string;
		present: number;
		absent: number;
		late: number;
	}[];
	performanceHistory?: {
		period: string;
		rating: number;
		comments: string;
	}[];
	notes?: string;
}

export default function EmployeeDetailsPage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const [employee, setEmployee] = useState<Employee | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'performance' | 'attendance'>('info');
	const [showNoteForm, setShowNoteForm] = useState(false);
	const [newNote, setNewNote] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

	// تحميل بيانات الموظف
	useEffect(() => {
		const fetchEmployeeDetails = async () => {
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
					documents: [
						{
							id: 101,
							name: 'عقد العمل',
							type: 'pdf',
							date: '2021-02-15',
							size: 1540000,
							url: '/documents/contract.pdf',
						},
						{
							id: 102,
							name: 'شهادة البكالوريوس',
							type: 'pdf',
							date: '2018-06-30',
							size: 2120000,
							url: '/documents/degree.pdf',
						},
						{
							id: 103,
							name: 'صورة الهوية',
							type: 'image',
							date: '2021-02-10',
							size: 650000,
							url: '/documents/id.jpg',
						},
						{
							id: 104,
							name: 'شهادة التدريب',
							type: 'pdf',
							date: '2020-12-05',
							size: 890000,
							url: '/documents/training.pdf',
						},
					],
					directManager: {
						id: 105,
						name: 'سارة المطيري',
						position: 'مديرة قسم الإنتاج',
					},
					emergencyContact: {
						name: 'منيرة الحربي',
						relation: 'أخت',
						phone: '966512345690',
					},
					attendance: [
						{
							month: 'يناير 2023',
							present: 22,
							absent: 0,
							late: 2,
						},
						{
							month: 'فبراير 2023',
							present: 20,
							absent: 1,
							late: 3,
						},
						{
							month: 'مارس 2023',
							present: 23,
							absent: 0,
							late: 1,
						},
						{
							month: 'أبريل 2023',
							present: 21,
							absent: 0,
							late: 0,
						},
						{
							month: 'مايو 2023',
							present: 22,
							absent: 1,
							late: 1,
						},
						{
							month: 'يونيو 2023',
							present: 22,
							absent: 0,
							late: 2,
						},
					],
					performanceHistory: [
						{
							period: 'النصف الأول 2021',
							rating: 4.2,
							comments: 'أداء ممتاز وتعاون جيد مع الفريق',
						},
						{
							period: 'النصف الثاني 2021',
							rating: 4.3,
							comments: 'تطور ملحوظ في مهارات التعامل مع العملاء',
						},
						{
							period: 'النصف الأول 2022',
							rating: 4.5,
							comments: 'تميز في الدقة والسرعة في العمل',
						},
						{
							period: 'النصف الثاني 2022',
							rating: 4.5,
							comments: 'الحفاظ على مستوى أداء متميز ومبادرات إيجابية',
						},
						{
							period: 'النصف الأول 2023',
							rating: 4.7,
							comments: 'تحسن ملحوظ في الإنتاجية وجودة العمل',
						},
					],
					notes: 'موظفة متميزة وملتزمة بمواعيد العمل. تتمتع بمهارات عالية في القياسات الدقيقة ورضا العملاء عن تعاملها ممتاز.',
				};

				setEmployee(mockEmployee);
			} catch (error) {
				console.error('Error fetching employee details:', error);
				setNotification({
					message: 'حدث خطأ أثناء تحميل بيانات الموظف',
					type: 'error',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchEmployeeDetails();
	}, [params.id]);

	// إضافة ملاحظة جديدة
	const handleAddNote = async () => {
		if (!newNote.trim() || !employee) return;

		setIsSubmitting(true);
		try {
			// محاكاة لطلب API
			await new Promise((resolve) => setTimeout(resolve, 800));

			// تحديث الملاحظات
			const updatedEmployee = {
				...employee,
				notes: employee.notes
					? `${employee.notes}\n\n${new Date().toLocaleDateString('ar-SA')}: ${newNote}`
					: `${new Date().toLocaleDateString('ar-SA')}: ${newNote}`,
			};

			setEmployee(updatedEmployee);
			setNewNote('');
			setShowNoteForm(false);

			// إظهار رسالة نجاح
			setNotification({
				message: 'تم إضافة الملاحظة بنجاح',
				type: 'success',
			});

			// إزالة الإشعار بعد 3 ثوان
			setTimeout(() => {
				setNotification(null);
			}, 3000);
		} catch (error) {
			console.error('Error adding note:', error);
			setNotification({
				message: 'حدث خطأ أثناء إضافة الملاحظة',
				type: 'error',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// الحصول على نص حالة الموظف
	const getStatusText = (status: string) => {
		switch (status) {
			case 'active':
				return 'نشط';
			case 'vacation':
				return 'إجازة';
			case 'sick':
				return 'مرضي';
			case 'leave':
				return 'غائب';
			case 'terminated':
				return 'منتهي';
			default:
				return 'غير معروف';
		}
	};

	// الحصول على لون حالة الموظف
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'vacation':
				return 'bg-blue-100 text-blue-800';
			case 'sick':
				return 'bg-orange-100 text-orange-800';
			case 'leave':
				return 'bg-amber-100 text-amber-800';
			case 'terminated':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// تنسيق التاريخ
	const formatDate = (dateString?: string) => {
		if (!dateString) return '-';

		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// حساب فترة العمل
	const calculateWorkPeriod = (hireDate: string) => {
		const hire = new Date(hireDate);
		const now = new Date();

		const diffYears = now.getFullYear() - hire.getFullYear();
		const diffMonths = now.getMonth() - hire.getMonth();

		let years = diffYears;
		let months = diffMonths;

		if (diffMonths < 0) {
			years -= 1;
			months += 12;
		}

		let result = '';
		if (years > 0) {
			result += `${years} سنة`;
			if (months > 0) {
				result += ` و ${months} شهر`;
			}
		} else if (months > 0) {
			result += `${months} شهر`;
		} else {
			result = 'أقل من شهر';
		}

		return result;
	};

	// تنسيق حجم الملف
	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + ' بايت';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' كيلوبايت';
		if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' ميجابايت';
		return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' جيجابايت';
	};

	// الحصول على نوع الملف مع أيقونة
	const getFileTypeIcon = (type: string) => {
		switch (type) {
			case 'pdf':
				return <FileText className='h-5 w-5 text-red-500' />;
			case 'image':
				return <Image className='h-5 w-5 text-blue-500' />;
			case 'doc':
			case 'docx':
				return <FileText className='h-5 w-5 text-blue-600' />;
			case 'xls':
			case 'xlsx':
				return <FileText className='h-5 w-5 text-green-600' />;
			default:
				return <FileText className='h-5 w-5 text-gray-500' />;
		}
	};

	// رسم العناصر عند التحميل
	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-[70vh]'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
				<span className='mr-3 text-lg text-gray-700'>جاري تحميل بيانات الموظف...</span>
			</div>
		);
	}

	// إذا لم يتم العثور على الموظف
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
			<div className='flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0'>
				<div className='flex items-start'>
					<div className='flex-shrink-0'>
						{employee.photo ? (
							<img
								src={employee.photo}
								alt={employee.name}
								className='h-16 w-16 rounded-full object-cover'
							/>
						) : (
							<div className='h-16 w-16 bg-green-100 rounded-full flex items-center justify-center'>
								<User className='h-8 w-8 text-green-600' />
							</div>
						)}
					</div>
					<div className='mr-4'>
						<div className='flex items-center'>
							<h1 className='text-2xl font-bold text-gray-900'>{employee.name}</h1>
							<span
								className={`mr-3 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${getStatusColor(
									employee.status
								)}`}
							>
								{getStatusText(employee.status)}
							</span>
						</div>
						<div className='flex items-center mt-1 text-gray-600'>
							<Briefcase className='h-4 w-4 text-gray-400 ml-1' />
							<span>
								{employee.position} - {employee.department}
							</span>
							<span className='mx-2 text-gray-300'>•</span>
							<span className='text-gray-600'>{employee.employeeId}</span>
						</div>
					</div>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/employees'
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'
					>
						<ArrowLeft className='ml-1 h-4 w-4' />
						العودة للقائمة
					</Link>

					<button
						onClick={() => window.print()}
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'
					>
						<Printer className='ml-1 h-4 w-4' />
						طباعة
					</button>

					<button className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'>
						<Share2 className='ml-1 h-4 w-4' />
						مشاركة
					</button>

					<Link
						href={`/dashboard/employees/${employee.id}/edit`}
						className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center'
					>
						<Edit className='ml-1 h-4 w-4' />
						تعديل
					</Link>
				</div>
			</div>

			{/* تبويبات */}
			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='border-b border-gray-200'>
					<nav className='flex overflow-x-auto hide-scrollbar'>
						<button
							onClick={() => setActiveTab('info')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'info'
									? 'text-green-600 border-b-2 border-green-500'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<User className='inline-block ml-1 h-5 w-5' />
							المعلومات الشخصية
						</button>

						<button
							onClick={() => setActiveTab('documents')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'documents'
									? 'text-green-600 border-b-2 border-green-500'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<FileText className='inline-block ml-1 h-5 w-5' />
							المستندات والسجلات
						</button>

						<button
							onClick={() => setActiveTab('performance')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'performance'
									? 'text-green-600 border-b-2 border-green-500'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<BarChart className='inline-block ml-1 h-5 w-5' />
							تقييم الأداء
						</button>

						<button
							onClick={() => setActiveTab('attendance')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'attendance'
									? 'text-green-600 border-b-2 border-green-500'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Clock className='inline-block ml-1 h-5 w-5' />
							الحضور والغياب
						</button>
					</nav>
				</div>

				{/* محتوى التبويب */}
				<div className='p-6'>
					{/* تبويب المعلومات الشخصية */}
					{activeTab === 'info' && (
						<div className='space-y-8'>
							{/* المعلومات الشخصية والتواصل */}
							<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
								{/* القسم الأول: المعلومات الشخصية */}
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
										<h3 className='text-sm font-medium text-gray-700'>المعلومات الشخصية</h3>
									</div>
									<div className='p-4 space-y-3'>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>الاسم</span>
											<span className='text-sm font-medium text-gray-900'>{employee.name}</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>الجنس</span>
											<span className='text-sm font-medium text-gray-900'>
												{employee.gender === 'male' ? 'ذكر' : 'أنثى'}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>الجنسية</span>
											<span className='text-sm font-medium text-gray-900'>
												{employee.nationality}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>رقم الهوية</span>
											<span className='text-sm font-medium text-gray-900'>
												{employee.idNumber}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>تاريخ الميلاد</span>
											<span className='text-sm font-medium text-gray-900'>
												{formatDate(employee.birthDate)}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>العنوان</span>
											<span className='text-sm font-medium text-gray-900'>
												{employee.address || '-'}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>المدينة</span>
											<span className='text-sm font-medium text-gray-900'>
												{employee.city || '-'}
											</span>
										</div>
									</div>
								</div>

								{/* القسم الثاني: معلومات التواصل */}
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
										<h3 className='text-sm font-medium text-gray-700'>معلومات التواصل</h3>
									</div>
									<div className='p-4 space-y-3'>
										<div className='flex items-center'>
											<Phone className='h-5 w-5 text-gray-400 ml-2' />
											<span className='text-sm text-gray-900'>{employee.phone}</span>
										</div>
										<div className='flex items-center'>
											<Mail className='h-5 w-5 text-gray-400 ml-2' />
											<span className='text-sm text-gray-900'>{employee.email}</span>
										</div>
										<hr className='my-2' />
										<h4 className='text-sm font-medium text-gray-600'>بيانات الطوارئ</h4>
										{employee.emergencyContact ? (
											<>
												<div className='flex justify-between'>
													<span className='text-sm text-gray-500'>الاسم</span>
													<span className='text-sm font-medium text-gray-900'>
														{employee.emergencyContact.name}
													</span>
												</div>
												<div className='flex justify-between'>
													<span className='text-sm text-gray-500'>صلة القرابة</span>
													<span className='text-sm font-medium text-gray-900'>
														{employee.emergencyContact.relation}
													</span>
												</div>
												<div className='flex justify-between'>
													<span className='text-sm text-gray-500'>رقم الهاتف</span>
													<span className='text-sm font-medium text-gray-900'>
														{employee.emergencyContact.phone}
													</span>
												</div>
											</>
										) : (
											<p className='text-sm text-gray-500'>لا توجد بيانات طوارئ مسجلة</p>
										)}
									</div>
								</div>

								{/* القسم الثالث: معلومات العمل */}
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
										<h3 className='text-sm font-medium text-gray-700'>معلومات العمل</h3>
									</div>
									<div className='p-4 space-y-3'>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>الرقم الوظيفي</span>
											<span className='text-sm font-medium text-gray-900'>
												{employee.employeeId}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>المنصب</span>
											<span className='text-sm font-medium text-gray-900'>
												{employee.position}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>القسم</span>
											<span className='text-sm font-medium text-gray-900'>
												{employee.department}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>الفرع</span>
											<Link
												href={`/dashboard/branches/${employee.branch.id}`}
												className='text-sm font-medium text-blue-600 hover:text-blue-800'
											>
												{employee.branch.name}
											</Link>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>تاريخ التعيين</span>
											<span className='text-sm font-medium text-gray-900'>
												{formatDate(employee.hireDate)}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>مدة الخدمة</span>
											<span className='text-sm font-medium text-gray-900'>
												{calculateWorkPeriod(employee.hireDate)}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>المدير المباشر</span>
											{employee.directManager ? (
												<Link
													href={`/dashboard/employees/${employee.directManager.id}`}
													className='text-sm font-medium text-blue-600 hover:text-blue-800'
												>
													{employee.directManager.name}
												</Link>
											) : (
												<span className='text-sm font-medium text-gray-900'>-</span>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* المعلومات المالية والمهارات والتعليم */}
							<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
								{/* المعلومات المالية */}
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
										<h3 className='text-sm font-medium text-gray-700'>المعلومات المالية</h3>
									</div>
									<div className='p-4 space-y-3'>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>الراتب الشهري</span>
											<span className='text-sm font-medium text-gray-900'>
												{employee.salary ? `${employee.salary.toLocaleString()} ريال` : '-'}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>البنك</span>
											<span className='text-sm font-medium text-gray-900'>
												{employee.bankName || '-'}
											</span>
										</div>
										<div className='flex justify-between'>
											<span className='text-sm text-gray-500'>رقم الحساب</span>
											<span className='text-sm font-medium text-gray-900'>
												{employee.bankAccount || '-'}
											</span>
										</div>
									</div>
								</div>

								{/* المهارات */}
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
										<h3 className='text-sm font-medium text-gray-700'>المهارات</h3>
									</div>
									<div className='p-4'>
										{employee.skills && employee.skills.length > 0 ? (
											<div className='flex flex-wrap gap-2'>
												{employee.skills.map((skill, index) => (
													<span
														key={index}
														className='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800'
													>
														{skill}
													</span>
												))}
											</div>
										) : (
											<p className='text-sm text-gray-500'>لم يتم تسجيل أية مهارات بعد</p>
										)}
									</div>
								</div>

								{/* التعليم والخبرات */}
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
										<h3 className='text-sm font-medium text-gray-700'>التعليم والخبرات</h3>
									</div>
									<div className='p-4'>
										<h4 className='text-sm font-medium text-gray-600 mb-2'>المؤهلات الدراسية</h4>
										{employee.educations && employee.educations.length > 0 ? (
											<div className='space-y-2 mb-4'>
												{employee.educations.map((education, index) => (
													<div key={index} className='text-sm text-gray-900'>
														<div className='font-medium'>{education.degree}</div>
														<div className='text-xs text-gray-500'>
															{education.institution} - {education.year}
														</div>
													</div>
												))}
											</div>
										) : (
											<p className='text-sm text-gray-500 mb-4'>لم يتم تسجيل أية مؤهلات دراسية</p>
										)}

										<h4 className='text-sm font-medium text-gray-600 mb-2'>الخبرات السابقة</h4>
										{employee.experiences && employee.experiences.length > 0 ? (
											<div className='space-y-2'>
												{employee.experiences.map((experience, index) => (
													<div key={index} className='text-sm text-gray-900'>
														<div className='font-medium'>{experience.position}</div>
														<div className='text-xs text-gray-500'>
															{experience.company} - {experience.period}
														</div>
													</div>
												))}
											</div>
										) : (
											<p className='text-sm text-gray-500'>لم يتم تسجيل أية خبرات سابقة</p>
										)}
									</div>
								</div>
							</div>

							{/* الملاحظات */}
							<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
								<div className='px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center'>
									<h3 className='text-sm font-medium text-gray-700'>الملاحظات</h3>
									<button
										onClick={() => setShowNoteForm(true)}
										className='text-sm text-green-600 hover:text-green-800 flex items-center'
									>
										<PlusCircle className='h-4 w-4 ml-1' />
										إضافة ملاحظة
									</button>
								</div>
								<div className='p-4'>
									{employee.notes ? (
										<p className='text-sm text-gray-900 whitespace-pre-line'>{employee.notes}</p>
									) : (
										<p className='text-sm text-gray-500'>لا توجد ملاحظات حتى الآن</p>
									)}

									{/* نموذج إضافة ملاحظة */}
									{showNoteForm && (
										<div className='mt-4 border-t border-gray-200 pt-4'>
											<h4 className='text-sm font-medium text-gray-600 mb-2'>
												إضافة ملاحظة جديدة
											</h4>
											<textarea
												value={newNote}
												onChange={(e) => setNewNote(e.target.value)}
												rows={3}
												className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
												placeholder='أدخل الملاحظة هنا...'
											></textarea>
											<div className='mt-2 flex justify-end space-x-2 space-x-reverse'>
												<button
													type='button'
													onClick={() => {
														setShowNoteForm(false);
														setNewNote('');
													}}
													className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none'
												>
													إلغاء
												</button>
												<button
													type='button'
													onClick={handleAddNote}
													disabled={!newNote.trim() || isSubmitting}
													className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none disabled:bg-green-300 disabled:cursor-not-allowed'
												>
													{isSubmitting ? (
														<span className='flex items-center'>
															<span className='animate-spin h-4 w-4 ml-1 border-2 border-t-transparent border-white rounded-full'></span>
															جاري الحفظ...
														</span>
													) : (
														<>
															<Send className='ml-1.5 -mr-0.5 h-4 w-4' />
															إضافة
														</>
													)}
												</button>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{/* تبويب المستندات والسجلات */}
					{activeTab === 'documents' && (
						<div className='space-y-6'>
							<div className='flex justify-between items-center'>
								<h2 className='text-lg font-medium text-gray-900'>مستندات الموظف</h2>
								<button className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center'>
									<Upload className='ml-1.5 -mr-0.5 h-4 w-4' />
									رفع مستند جديد
								</button>
							</div>

							{employee.documents && employee.documents.length > 0 ? (
								<div className='bg-white shadow-sm border border-gray-200 overflow-hidden rounded-lg'>
									<table className='min-w-full divide-y divide-gray-200'>
										<thead className='bg-gray-50'>
											<tr>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													المستند
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													النوع
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													الحجم
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													تاريخ الإضافة
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													الإجراءات
												</th>
											</tr>
										</thead>
										<tbody className='bg-white divide-y divide-gray-200'>
											{employee.documents.map((document) => (
												<tr key={document.id} className='hover:bg-gray-50'>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='flex items-center'>
															<div className='flex-shrink-0'>
																{getFileTypeIcon(document.type)}
															</div>
															<div className='mr-3'>
																<div className='text-sm font-medium text-gray-900'>
																	{document.name}
																</div>
															</div>
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<span className='text-sm text-gray-900'>
															{document.type.toUpperCase()}
														</span>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<span className='text-sm text-gray-900'>
															{formatFileSize(document.size)}
														</span>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<span className='text-sm text-gray-900'>
															{formatDate(document.date)}
														</span>
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-center'>
														<div className='flex items-center justify-center space-x-2 space-x-reverse'>
															<a
																href={document.url}
																target='_blank'
																rel='noopener noreferrer'
																className='text-blue-600 hover:text-blue-900'
																title='عرض'
															>
																<Eye className='h-5 w-5' />
															</a>
															<a
																href={document.url}
																download
																className='text-green-600 hover:text-green-900'
																title='تحميل'
															>
																<Download className='h-5 w-5' />
															</a>
															<button
																className='text-red-600 hover:text-red-900'
																title='حذف'
															>
																<Trash className='h-5 w-5' />
															</button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<div className='bg-white p-8 text-center border border-gray-200 rounded-lg shadow-sm'>
									<FileText className='h-12 w-12 text-gray-300 mx-auto' />
									<h3 className='mt-2 text-sm font-medium text-gray-900'>لا توجد مستندات</h3>
									<p className='mt-1 text-sm text-gray-500'>
										لم يتم إضافة أي مستندات لهذا الموظف بعد
									</p>
									<button className='mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none'>
										<Upload className='ml-1 h-4 w-4' />
										رفع مستند جديد
									</button>
								</div>
							)}

							<div className='mt-6'>
								<h2 className='text-lg font-medium text-gray-900 mb-4'>شهادات وإنجازات</h2>

								<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
									<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
										<div className='flex items-start'>
											<div className='flex-shrink-0'>
												<XCircle className='h-8 w-8 text-amber-500' />
											</div>
											<div className='mr-3'>
												<h3 className='text-sm font-medium text-gray-900'>شهادة التميز</h3>
												<p className='text-xs text-gray-500 mt-1'>موظف متميز لشهر مارس 2023</p>
												<p className='text-xs text-gray-500 mt-1'>
													تم منحها بتاريخ: 2023-04-05
												</p>
											</div>
										</div>
									</div>

									<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
										<div className='flex items-start'>
											<div className='flex-shrink-0'>
												<Award className='h-8 w-8 text-blue-500' />
											</div>
											<div className='mr-3'>
												<h3 className='text-sm font-medium text-gray-900'>جائزة أفضل موظف</h3>
												<p className='text-xs text-gray-500 mt-1'>للربع الأول من عام 2022</p>
												<p className='text-xs text-gray-500 mt-1'>
													تم منحها بتاريخ: 2022-04-10
												</p>
											</div>
										</div>
									</div>

									<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
										<div className='flex items-start'>
											<div className='flex-shrink-0'>
												<Shield className='h-8 w-8 text-green-500' />
											</div>
											<div className='mr-3'>
												<h3 className='text-sm font-medium text-gray-900'>شهادة تدريب</h3>
												<p className='text-xs text-gray-500 mt-1'>
													دورة تطوير المهارات الإدارية
												</p>
												<p className='text-xs text-gray-500 mt-1'>
													تم منحها بتاريخ: 2022-09-15
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* تبويب تقييم الأداء */}
					{activeTab === 'performance' && (
						<div className='space-y-6'>
							<div className='flex justify-between items-center'>
								<h2 className='text-lg font-medium text-gray-900'>تقييم الأداء</h2>
								<button className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center'>
									<PlusCircle className='ml-1.5 -mr-0.5 h-4 w-4' />
									إضافة تقييم جديد
								</button>
							</div>

							{/* ملخص الأداء */}
							<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
									<p className='text-sm font-medium text-gray-500 mb-1'>التقييم الحالي</p>
									<div className='flex items-center'>
										<span className='text-2xl font-bold text-gray-900'>
											{employee.performanceRating}
										</span>
										<Star className='h-5 w-5 mr-1 text-amber-400 fill-current' />
									</div>
									<p className='text-xs text-gray-500 mt-1'>من 5.0</p>
								</div>

								<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
									<p className='text-sm font-medium text-gray-500 mb-1'>عدد التقييمات</p>
									<p className='text-2xl font-bold text-gray-900'>
										{employee.performanceHistory?.length || 0}
									</p>
									<p className='text-xs text-gray-500 mt-1'>تقييم</p>
								</div>

								<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
									<p className='text-sm font-medium text-gray-500 mb-1'>متوسط النمو</p>
									<p className='text-2xl font-bold text-green-600'>+0.1</p>
									<p className='text-xs text-gray-500 mt-1'>لكل تقييم</p>
								</div>

								<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
									<p className='text-sm font-medium text-gray-500 mb-1'>آخر تقييم</p>
									<p className='text-2xl font-bold text-gray-900'>4.7</p>
									<p className='text-xs text-gray-500 mt-1'>النصف الأول 2023</p>
								</div>
							</div>

							{/* رسم بياني التقييمات */}
							<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
								<div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
									<h3 className='text-sm font-medium text-gray-700'>تطور التقييم مع الوقت</h3>
								</div>
								<div className='p-4'>
									<div className='h-64 flex items-center justify-center'>
										{/* هنا سيكون الرسم البياني الحقيقي باستخدام مكتبة مثل Chart.js أو Recharts */}
										<div className='text-center'>
											<BarChart className='h-12 w-12 text-gray-300 mx-auto mb-2' />
											<p className='text-gray-500'>
												رسم بياني لتطور تقييم الموظف خلال الفترات السابقة
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* تاريخ التقييمات */}
							<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
								<div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
									<h3 className='text-sm font-medium text-gray-700'>سجل التقييمات</h3>
								</div>
								<div className='divide-y divide-gray-200'>
									{employee.performanceHistory && employee.performanceHistory.length > 0 ? (
										employee.performanceHistory.map((performance, index) => (
											<div key={index} className='p-4'>
												<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center'>
													<div>
														<h4 className='text-sm font-medium text-gray-900'>
															{performance.period}
														</h4>
														<div className='flex items-center mt-1'>
															<Star className='h-4 w-4 text-amber-400 fill-current ml-1' />
															<span className='text-sm text-gray-700'>
																{performance.rating} من 5
															</span>
														</div>
													</div>
													<div className='mt-2 sm:mt-0'>
														<button className='text-sm text-blue-600 hover:text-blue-800'>
															عرض التفاصيل
														</button>
													</div>
												</div>
												<p className='mt-2 text-sm text-gray-600'>{performance.comments}</p>
											</div>
										))
									) : (
										<div className='p-8 text-center'>
											<BarChart className='h-12 w-12 text-gray-300 mx-auto' />
											<h3 className='mt-2 text-sm font-medium text-gray-900'>لا توجد تقييمات</h3>
											<p className='mt-1 text-sm text-gray-500'>
												لم يتم إضافة أي تقييمات للموظف بعد
											</p>
										</div>
									)}
								</div>
							</div>
						</div>
					)}

					{/* تبويب الحضور والغياب */}
					{activeTab === 'attendance' && (
						<div className='space-y-6'>
							<div className='flex justify-between items-center'>
								<h2 className='text-lg font-medium text-gray-900'>سجل الحضور والغياب</h2>
								<div className='flex items-center space-x-2 space-x-reverse'>
									<select className='block text-sm border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500'>
										<option value='2023'>2023</option>
										<option value='2022'>2022</option>
										<option value='2021'>2021</option>
									</select>
									<button className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'>
										<Download className='ml-1.5 -mr-0.5 h-4 w-4' />
										تصدير السجل
									</button>
								</div>
							</div>

							{/* ملخص الحضور */}
							<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
									<p className='text-sm font-medium text-gray-500 mb-1'>نسبة الحضور</p>
									<p className='text-2xl font-bold text-gray-900'>97%</p>
									<p className='text-xs text-gray-500 mt-1'>في آخر 6 أشهر</p>
								</div>

								<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
									<p className='text-sm font-medium text-gray-500 mb-1'>أيام الغياب</p>
									<p className='text-2xl font-bold text-gray-900'>2</p>
									<p className='text-xs text-gray-500 mt-1'>في آخر 6 أشهر</p>
								</div>

								<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
									<p className='text-sm font-medium text-gray-500 mb-1'>مرات التأخير</p>
									<p className='text-2xl font-bold text-gray-900'>9</p>
									<p className='text-xs text-gray-500 mt-1'>في آخر 6 أشهر</p>
								</div>

								<div className='bg-white rounded-lg border border-gray-200 shadow-sm p-4'>
									<p className='text-sm font-medium text-gray-500 mb-1'>التزام بالدوام</p>
									<div className='flex items-center'>
										<span className='text-2xl font-bold text-gray-900'>4.8</span>
										<Star className='h-5 w-5 mr-1 text-amber-400 fill-current' />
									</div>
									<p className='text-xs text-gray-500 mt-1'>تقييم عام</p>
								</div>
							</div>

							{/* رسم بياني للحضور */}
							<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
								<div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
									<h3 className='text-sm font-medium text-gray-700'>تحليل الحضور والغياب</h3>
								</div>
								<div className='p-4'>
									<div className='h-64 flex items-center justify-center'>
										{/* هنا سيكون الرسم البياني الحقيقي باستخدام مكتبة مثل Chart.js أو Recharts */}
										<div className='text-center'>
											<PieChart className='h-12 w-12 text-gray-300 mx-auto mb-2' />
											<p className='text-gray-500'>رسم بياني لتوزيع الحضور، الغياب، والتأخير</p>
										</div>
									</div>
								</div>
							</div>

							{/* سجل الحضور الشهري */}
							<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
								<div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
									<h3 className='text-sm font-medium text-gray-700'>سجل الحضور الشهري</h3>
								</div>
								<div className='overflow-x-auto'>
									<table className='min-w-full divide-y divide-gray-200'>
										<thead className='bg-gray-50'>
											<tr>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													الشهر
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													أيام الحضور
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													أيام الغياب
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													مرات التأخير
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													نسبة الالتزام
												</th>
											</tr>
										</thead>
										<tbody className='bg-white divide-y divide-gray-200'>
											{employee.attendance &&
												employee.attendance.map((record, index) => (
													<tr key={index} className='hover:bg-gray-50'>
														<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
															{record.month}
														</td>
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
															{record.present}
														</td>
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
															{record.absent}
														</td>
														<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
															{record.late}
														</td>
														<td className='px-6 py-4 whitespace-nowrap'>
															<div className='flex items-center'>
																<div className='w-full bg-gray-200 rounded-full h-2.5'>
																	<div
																		className='bg-green-600 h-2.5 rounded-full'
																		style={{
																			width: `${
																				(record.present /
																					(record.present +
																						record.absent +
																						record.late)) *
																				100
																			}%`,
																		}}
																	></div>
																</div>
																<span className='mr-2 text-sm text-gray-700'>
																	{Math.round(
																		(record.present /
																			(record.present +
																				record.absent +
																				record.late)) *
																			100
																	)}
																	%
																</span>
															</div>
														</td>
													</tr>
												))}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					)}
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
			<div></div>
		</div>
	);
}
