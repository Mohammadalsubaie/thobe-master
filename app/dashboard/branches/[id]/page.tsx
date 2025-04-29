'use client';

import {
	AlertCircle,
	ArrowLeft,
	ArrowUpRight,
	BarChart,
	Building,
	Calendar,
	CheckCircle,
	DollarSign,
	Download,
	Edit,
	ExternalLink,
	Eye,
	FileArchive,
	FileImage,
	FileText,
	Link as LinkIcon,
	Mail,
	MapPin,
	Package,
	Phone,
	PieChart,
	Plus,
	Printer,
	Save,
	Search,
	Share2,
	Star,
	Tag,
	Trash,
	UploadCloud,
	User,
	UserPlus,
	Users,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// استيراد واجهات البيانات (الواجهات مماثلة للصفحة السابقة)
interface BranchDetails {
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
		photo?: string;
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
	licenses: BranchDocument[];
	documents: BranchDocument[];
	statistics: {
		ordersCount: number;
		monthlySales: number;
		avgOrderValue: number;
		customerRating: number;
		employeesPerformance: number;
	};
}

interface BranchDocument {
	id: number;
	name: string;
	type: 'image' | 'pdf' | 'document' | 'spreadsheet' | 'archive';
	size: number;
	uploadDate: string;
	expiryDate?: string;
	url: string;
	category: 'license' | 'contract' | 'certificate' | 'report' | 'other';
	tags?: string[];
	description?: string;
	status?: 'valid' | 'expired' | 'pending';
}

interface BranchEmployee {
	id: number;
	name: string;
	position: string;
	department: string;
	phone: string;
	email: string;
	startDate: string;
	photo?: string;
	isManager: boolean;
	status: 'active' | 'vacation' | 'leave' | 'inactive';
	performanceRating?: number;
}

interface MonthlyStatistics {
	month: string;
	sales: number;
	orders: number;
	customers: number;
	expenses: number;
}

export default function BranchDetailsPage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const [branchDetails, setBranchDetails] = useState<BranchDetails | null>(null);
	const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'employees' | 'statistics'>('info');
	const [employees, setEmployees] = useState<BranchEmployee[]>([]);
	const [loading, setLoading] = useState(true);
	const [editMode, setEditMode] = useState(false);
	const [editedBranch, setEditedBranch] = useState<Partial<BranchDetails>>({});
	const [isSaving, setIsSaving] = useState(false);
	const [monthlyStats, setMonthlyStats] = useState<MonthlyStatistics[]>([]);
	const [documentFilter, setDocumentFilter] = useState<string>('all');
	const [documentSearchQuery, setDocumentSearchQuery] = useState<string>('');
	const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

	// تحميل بيانات الفرع
	useEffect(() => {
		const fetchBranchDetails = async () => {
			setLoading(true);
			try {
				// محاكاة لتحميل البيانات من API
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// بيانات تجريبية للفرع
				const mockBranchData: BranchDetails = {
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
						photo: '/images/users/ahmed.jpg',
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
					licenses: [
						{
							id: 101,
							name: 'رخصة البلدية',
							type: 'pdf',
							size: 2500000,
							uploadDate: '2023-01-10',
							expiryDate: '2024-01-09',
							url: '/documents/licenses/municipal-license.pdf',
							category: 'license',
							status: 'valid',
						},
						{
							id: 102,
							name: 'شهادة الدفاع المدني',
							type: 'pdf',
							size: 1800000,
							uploadDate: '2023-02-15',
							expiryDate: '2024-02-14',
							url: '/documents/licenses/civil-defense.pdf',
							category: 'license',
							status: 'valid',
						},
						{
							id: 103,
							name: 'رخصة الاستثمار التجاري',
							type: 'pdf',
							size: 3100000,
							uploadDate: '2022-08-20',
							expiryDate: '2027-08-19',
							url: '/documents/licenses/commercial-investment.pdf',
							category: 'license',
							status: 'valid',
						},
					],
					documents: [
						{
							id: 201,
							name: 'عقد إيجار المبنى',
							type: 'pdf',
							size: 4200000,
							uploadDate: '2022-03-01',
							expiryDate: '2025-02-28',
							url: '/documents/contracts/lease-agreement.pdf',
							category: 'contract',
							description: 'عقد إيجار المبنى لمدة ٣ سنوات',
							status: 'valid',
						},
						{
							id: 202,
							name: 'تقرير الصيانة الدورية - الربع الأول 2023',
							type: 'pdf',
							size: 1500000,
							uploadDate: '2023-04-05',
							url: '/documents/reports/maintenance-q1-2023.pdf',
							category: 'report',
							description: 'تقرير الصيانة الدورية للربع الأول من عام 2023',
						},
						{
							id: 203,
							name: 'مخطط الفرع',
							type: 'image',
							size: 5800000,
							uploadDate: '2020-03-10',
							url: '/documents/others/branch-plan.jpg',
							category: 'other',
							description: 'مخطط تفصيلي للفرع',
						},
						{
							id: 204,
							name: 'شهادة الأمن والسلامة',
							type: 'pdf',
							size: 1200000,
							uploadDate: '2023-01-18',
							expiryDate: '2024-01-17',
							url: '/documents/certificates/safety-certificate.pdf',
							category: 'certificate',
							status: 'valid',
						},
						{
							id: 205,
							name: 'سجلات الموظفين (أرشيف)',
							type: 'archive',
							size: 25000000,
							uploadDate: '2022-12-01',
							url: '/documents/archives/employees-records.zip',
							category: 'other',
							description: 'أرشيف سجلات الموظفين لعام 2022',
						},
					],
					statistics: {
						ordersCount: 4580,
						monthlySales: 850000,
						avgOrderValue: 1856.33,
						customerRating: 4.7,
						employeesPerformance: 92,
					},
				};

				// محاكاة تحميل بيانات الموظفين
				const mockEmployeesData: BranchEmployee[] = [
					{
						id: 101,
						name: 'أحمد العمري',
						position: 'مدير الفرع',
						department: 'الإدارة',
						phone: '966512345678',
						email: 'ahmed.manager@example.com',
						startDate: '2020-03-15',
						photo: '/images/users/ahmed.jpg',
						isManager: true,
						status: 'active',
						performanceRating: 4.8,
					},
					{
						id: 102,
						name: 'محمد القحطاني',
						position: 'مسؤول المبيعات',
						department: 'المبيعات',
						phone: '966512345679',
						email: 'mohamed.sales@example.com',
						startDate: '2020-04-01',
						photo: '/images/users/mohamed.jpg',
						isManager: false,
						status: 'active',
						performanceRating: 4.6,
					},
					{
						id: 103,
						name: 'عبدالله الشمري',
						position: 'كاشير',
						department: 'المبيعات',
						phone: '966512345680',
						email: 'abdullah.cashier@example.com',
						startDate: '2021-01-15',
						isManager: false,
						status: 'active',
						performanceRating: 4.3,
					},
					{
						id: 104,
						name: 'خالد العتيبي',
						position: 'خياط',
						department: 'الإنتاج',
						phone: '966512345681',
						email: 'khaled.tailor@example.com',
						startDate: '2020-05-10',
						isManager: false,
						status: 'active',
						performanceRating: 4.9,
					},
					{
						id: 105,
						name: 'فهد السبيعي',
						position: 'خياط',
						department: 'الإنتاج',
						phone: '966512345682',
						email: 'fahad.tailor@example.com',
						startDate: '2020-06-01',
						isManager: false,
						status: 'vacation',
						performanceRating: 4.7,
					},
					{
						id: 106,
						name: 'سارة المطيري',
						position: 'مسؤولة خدمة العملاء',
						department: 'خدمة العملاء',
						phone: '966512345683',
						email: 'sarah.support@example.com',
						startDate: '2021-03-01',
						photo: '/images/users/sarah.jpg',
						isManager: false,
						status: 'active',
						performanceRating: 4.8,
					},
					{
						id: 107,
						name: 'نورة الحربي',
						position: 'مسؤولة القياسات',
						department: 'الإنتاج',
						phone: '966512345684',
						email: 'noura.measurements@example.com',
						startDate: '2021-02-15',
						isManager: false,
						status: 'active',
						performanceRating: 4.5,
					},
				];

				// محاكاة تحميل البيانات الإحصائية الشهرية
				const mockMonthlyStats: MonthlyStatistics[] = [
					{ month: 'يناير', sales: 780000, orders: 420, customers: 380, expenses: 420000 },
					{ month: 'فبراير', sales: 820000, orders: 450, customers: 410, expenses: 430000 },
					{ month: 'مارس', sales: 900000, orders: 480, customers: 430, expenses: 450000 },
					{ month: 'أبريل', sales: 850000, orders: 460, customers: 420, expenses: 440000 },
					{ month: 'مايو', sales: 880000, orders: 475, customers: 440, expenses: 455000 },
					{ month: 'يونيو', sales: 920000, orders: 500, customers: 460, expenses: 460000 },
				];

				setBranchDetails(mockBranchData);
				setEditedBranch(mockBranchData);
				setEmployees(mockEmployeesData);
				setMonthlyStats(mockMonthlyStats);
			} catch (error) {
				console.error('Error fetching branch details:', error);
				setNotification({
					message: 'حدث خطأ أثناء تحميل بيانات الفرع',
					type: 'error',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchBranchDetails();
	}, [params.id]);

	// حفظ التغييرات
	const handleSaveChanges = async () => {
		setIsSaving(true);
		try {
			// محاكاة حفظ البيانات في API
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// تحديث بيانات الفرع
			setBranchDetails((prev) => ({
				...(prev as BranchDetails),
				...editedBranch,
			}));

			setEditMode(false);

			// إظهار رسالة نجاح
			setNotification({
				message: 'تم حفظ التغييرات بنجاح',
				type: 'success',
			});
		} catch (error) {
			console.error('Error saving changes:', error);
			setNotification({
				message: 'حدث خطأ أثناء حفظ التغييرات',
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	// تصفية المستندات
	const getFilteredDocuments = () => {
		let docs = [...(branchDetails?.documents || []), ...(branchDetails?.licenses || [])];

		// تطبيق فلتر التصنيف
		if (documentFilter !== 'all') {
			docs = docs.filter((doc) => doc.category === documentFilter);
		}

		// تطبيق البحث
		if (documentSearchQuery) {
			const query = documentSearchQuery.toLowerCase();
			docs = docs.filter(
				(doc) =>
					doc.name.toLowerCase().includes(query) ||
					(doc.description && doc.description.toLowerCase().includes(query))
			);
		}

		return docs;
	};

	// الحصول على أيقونة المستند حسب النوع
	const getDocumentIcon = (type: string, size: number = 5) => {
		switch (type) {
			case 'image':
				return <FileImage className={`h-${size} w-${size} text-blue-500`} />;
			case 'pdf':
				return <FileArchive className={`h-${size} w-${size} text-red-500`} />;
			case 'archive':
				return <FileArchive className={`h-${size} w-${size} text-amber-500`} />;
			default:
				return <FileText className={`h-${size} w-${size} text-gray-500`} />;
		}
	};

	// تنسيق حجم الملف
	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + ' بايت';
		if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' كيلوبايت';
		if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' ميجابايت';
		return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' جيجابايت';
	};

	// الحصول على تصنيف المستند بالعربية
	const getDocumentCategoryName = (category: string) => {
		switch (category) {
			case 'license':
				return 'رخصة';
			case 'contract':
				return 'عقد';
			case 'certificate':
				return 'شهادة';
			case 'report':
				return 'تقرير';
			default:
				return 'مستند آخر';
		}
	};

	// تنسيق التاريخ
	const formatDate = (dateString: string) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// حساب المدة المتبقية للانتهاء
	const getRemainingDays = (expiryDate?: string) => {
		if (!expiryDate) return null;

		const today = new Date();
		const expiry = new Date(expiryDate);
		const diffTime = expiry.getTime() - today.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return diffDays;
	};

	// الحصول على حالة المستند
	const getDocumentStatus = (expiryDate?: string) => {
		if (!expiryDate) return null;

		const remainingDays = getRemainingDays(expiryDate);
		if (!remainingDays) return null;

		if (remainingDays < 0) return 'expired';
		if (remainingDays <= 30) return 'warning';
		return 'valid';
	};

	// الحصول على حالة النص للفرع
	const getBranchStatusText = (status: string) => {
		switch (status) {
			case 'active':
				return 'نشط';
			case 'inactive':
				return 'غير نشط';
			case 'maintenance':
				return 'تحت الصيانة';
			default:
				return 'غير معروف';
		}
	};

	// الحصول على لون حالة الفرع
	const getBranchStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'inactive':
				return 'bg-red-100 text-red-800';
			case 'maintenance':
				return 'bg-amber-100 text-amber-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// رسم العناصر عند التحميل
	if (loading) {
		return (
			<div className='flex justify-center items-center min-h-[70vh]'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
				<span className='mr-3 text-lg text-gray-700'>جاري تحميل بيانات الفرع...</span>
			</div>
		);
	}

	// إذا لم يتم العثور على الفرع
	if (!branchDetails) {
		return (
			<div className='text-center py-10'>
				<AlertCircle className='h-16 w-16 text-red-500 mx-auto mb-4' />
				<h2 className='text-2xl font-bold text-gray-900 mb-2'>لم يتم العثور على الفرع</h2>
				<p className='text-gray-600 mb-6'>
					لم نتمكن من العثور على الفرع المطلوب. تحقق من الرابط أو اتصل بالدعم.
				</p>
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
			<div className='flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0'>
				<div className='flex items-start'>
					<div className='flex-shrink-0'>
						<div className='h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center'>
							<Building className='h-6 w-6 text-green-600' />
						</div>
					</div>
					<div className='mr-4'>
						<div className='flex items-center'>
							<h1 className='text-2xl font-bold text-gray-900'>{branchDetails.name}</h1>
							<span
								className={`mr-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getBranchStatusColor(
									branchDetails.status
								)}`}
							>
								{getBranchStatusText(branchDetails.status)}
							</span>
							<span className='mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800'>
								{branchDetails.type === 'main'
									? 'فرع رئيسي'
									: branchDetails.type === 'sub'
									? 'فرع فرعي'
									: 'فرع موسمي'}
							</span>
							<span className='mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'>
								{branchDetails.code}
							</span>
						</div>
						<p className='text-gray-600 flex items-center mt-1'>
							<MapPin className='h-4 w-4 ml-1 text-gray-400' />
							{branchDetails.address.district}، {branchDetails.address.city}
						</p>
					</div>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/branches'
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

					{!editMode && (
						<button
							onClick={() => setEditMode(true)}
							className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center'
						>
							<Edit className='ml-1 h-4 w-4' />
							تعديل
						</button>
					)}
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
							<Building className='inline-block ml-1 h-5 w-5' />
							المعلومات الأساسية
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
							onClick={() => setActiveTab('employees')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'employees'
									? 'text-green-600 border-b-2 border-green-500'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Users className='inline-block ml-1 h-5 w-5' />
							الموظفين
						</button>

						<button
							onClick={() => setActiveTab('statistics')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'statistics'
									? 'text-green-600 border-b-2 border-green-500'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<BarChart className='inline-block ml-1 h-5 w-5' />
							الإحصائيات
						</button>
					</nav>
				</div>

				{/* محتوى التبويب */}
				<div className='p-6'>
					{/* تبويب المعلومات الأساسية */}
					{activeTab === 'info' && (
						<div className='space-y-8'>
							{/* عرض التحذير في وضع التعديل */}
							{editMode && (
								<div className='bg-amber-50 border border-amber-200 rounded-md p-4 mb-6'>
									<div className='flex'>
										<AlertCircle className='h-5 w-5 text-amber-400 ml-2' />
										<div>
											<h3 className='text-sm font-medium text-amber-800'>أنت في وضع التعديل</h3>
											<p className='text-sm text-amber-700 mt-1'>
												قم بتعديل البيانات ثم انقر على "حفظ التغييرات" عند الانتهاء.
											</p>
										</div>
									</div>
								</div>
							)}

							{/* صور الفرع */}
							<div className='mb-8'>
								<h2 className='text-lg font-medium text-gray-900 mb-4'>صور الفرع</h2>
								<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
									{branchDetails.photos.map((photo, index) => (
										<div
											key={index}
											className='relative h-48 bg-gray-100 rounded-lg overflow-hidden'
										>
											<img
												src={photo}
												alt={`صورة ${index + 1} للفرع`}
												className='h-full w-full object-cover'
											/>
											{editMode && (
												<div className='absolute bottom-2 left-2'>
													<button className='p-1.5 bg-red-100 text-red-700 rounded-full hover:bg-red-200'>
														<Trash className='h-4 w-4' />
													</button>
												</div>
											)}
										</div>
									))}
									{editMode && (
										<div className='h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer'>
											<UploadCloud className='h-8 w-8 text-gray-400 mb-2' />
											<p className='text-sm text-gray-500'>أضف صورة جديدة</p>
										</div>
									)}
								</div>
							</div>

							{/* معلومات الفرع */}
							<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
								{/* القسم الأول: معلومات العنوان والاتصال */}
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
										<h3 className='text-sm font-medium text-gray-700'>معلومات العنوان والاتصال</h3>
									</div>
									<div className='p-4 space-y-4'>
										{/* العنوان */}
										<div>
											<h4 className='text-xs font-medium text-gray-500 mb-1'>العنوان</h4>
											{!editMode ? (
												<p className='text-sm text-gray-900'>
													{branchDetails.address.street}، {branchDetails.address.district}،{' '}
													{branchDetails.address.city}، {branchDetails.address.postalCode}
												</p>
											) : (
												<div className='space-y-2'>
													<input
														type='text'
														value={editedBranch.address?.street || ''}
														onChange={(e) =>
															setEditedBranch({
																...editedBranch,
																address: {
																	...(branchDetails?.address || {
																		district: '',
																		city: '',
																		postalCode: '',
																		coordinates: { lat: 0, lng: 0 },
																	}),
																	...(editedBranch.address || {}),
																	street: e.target.value,
																},
															})
														}
														placeholder='الشارع'
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
													/>
													<div className='grid grid-cols-2 gap-2'>
														<input
															type='text'
															value={editedBranch.address?.district || ''}
															onChange={(e) =>
																setEditedBranch({
																	...editedBranch,
																	address: {
																		street: editedBranch.address?.street || '',
																		district: e.target.value,
																		city: editedBranch.address?.city || '',
																		postalCode:
																			editedBranch.address?.postalCode || '',
																		coordinates: editedBranch.address
																			?.coordinates || { lat: 0, lng: 0 },
																	},
																})
															}
															placeholder='الحي'
															className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
														/>
														<input
															type='text'
															value={editedBranch.address?.city || ''}
															onChange={(e) =>
																setEditedBranch({
																	...editedBranch,
																	address: {
																		street: editedBranch.address?.street || '',
																		district: editedBranch.address?.district || '',
																		city: e.target.value,
																		postalCode:
																			editedBranch.address?.postalCode || '',
																		coordinates: editedBranch.address
																			?.coordinates || { lat: 0, lng: 0 },
																	},
																})
															}
															placeholder='المدينة'
															className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
														/>
													</div>
													<input
														type='text'
														value={editedBranch.address?.postalCode || ''}
														onChange={(e) =>
															setEditedBranch({
																...editedBranch,
																address: {
																	street:
																		editedBranch.address?.street ||
																		branchDetails?.address.street ||
																		'',
																	district:
																		editedBranch.address?.district ||
																		branchDetails?.address.district ||
																		'',
																	city:
																		editedBranch.address?.city ||
																		branchDetails?.address.city ||
																		'',
																	postalCode: e.target.value,
																	coordinates: editedBranch.address?.coordinates ||
																		branchDetails?.address.coordinates || {
																			lat: 0,
																			lng: 0,
																		},
																},
															})
														}
														placeholder='الرمز البريدي'
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
													/>
												</div>
											)}
										</div>

										{/* معلومات الاتصال */}
										<div>
											<h4 className='text-xs font-medium text-gray-500 mb-1'>معلومات الاتصال</h4>
											<div className='space-y-2'>
												{!editMode ? (
													<>
														<div className='flex items-center text-sm text-gray-900'>
															<Phone className='h-4 w-4 text-gray-400 ml-2' />
															{branchDetails.contact.phone}
														</div>
														<div className='flex items-center text-sm text-gray-900'>
															<Mail className='h-4 w-4 text-gray-400 ml-2' />
															{branchDetails.contact.email}
														</div>
														{branchDetails.contact.whatsapp && (
															<div className='flex items-center text-sm text-gray-900'>
																<span className='ml-2 text-green-500 font-bold'>
																	واتساب:
																</span>
																{branchDetails.contact.whatsapp}
															</div>
														)}
														{branchDetails.contact.website && (
															<div className='flex items-center text-sm text-green-600 hover:text-green-800'>
																<LinkIcon className='h-4 w-4 text-gray-400 ml-2' />
																<a
																	href={branchDetails.contact.website}
																	target='_blank'
																	rel='noopener noreferrer'
																	className='hover:underline flex items-center'
																>
																	{branchDetails.contact.website.replace(
																		/^https?:\/\//,
																		''
																	)}
																	<ExternalLink className='h-3 w-3 mr-1' />
																</a>
															</div>
														)}
													</>
												) : (
													<>
														<div className='flex items-center'>
															<Phone className='h-4 w-4 text-gray-400 ml-2' />
															<input
																type='tel'
																value={editedBranch.contact?.phone || ''}
																onChange={(e) =>
																	setEditedBranch({
																		...editedBranch,
																		contact: {
																			...(editedBranch.contact || {}),
																			phone: e.target.value,
																			email:
																				editedBranch.contact?.email ||
																				branchDetails?.contact.email ||
																				'',
																		},
																	})
																}
																placeholder='رقم الهاتف'
																className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
															/>
														</div>
														<div className='flex items-center'>
															<Mail className='h-4 w-4 text-gray-400 ml-2' />
															<input
																type='email'
																value={editedBranch.contact?.email || ''}
																onChange={(e) =>
																	setEditedBranch({
																		...editedBranch,
																		contact: {
																			phone:
																				editedBranch.contact?.phone ||
																				branchDetails?.contact.phone ||
																				'',
																			email: e.target.value,
																			whatsapp: editedBranch.contact?.whatsapp,
																			website: editedBranch.contact?.website,
																		},
																	})
																}
																placeholder='البريد الإلكتروني'
																className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
															/>
														</div>
														<div className='flex items-center'>
															<span className='text-gray-500 ml-2 font-bold text-sm'>
																واتساب:
															</span>
															<input
																type='tel'
																value={editedBranch.contact?.whatsapp || ''}
																onChange={(e) =>
																	setEditedBranch({
																		...editedBranch,
																		contact: {
																			phone:
																				editedBranch.contact?.phone ||
																				branchDetails?.contact.phone ||
																				'',
																			email:
																				editedBranch.contact?.email ||
																				branchDetails?.contact.email ||
																				'',
																			whatsapp: e.target.value,
																			website: editedBranch.contact?.website,
																		},
																	})
																}
																placeholder='رقم الواتساب (اختياري)'
																className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
															/>
														</div>
														<div className='flex items-center'>
															<LinkIcon className='h-4 w-4 text-gray-400 ml-2' />
															<input
																type='url'
																value={editedBranch.contact?.website || ''}
																onChange={(e) =>
																	setEditedBranch({
																		...editedBranch,
																		contact: {
																			phone:
																				editedBranch.contact?.phone ||
																				branchDetails?.contact.phone ||
																				'',
																			email:
																				editedBranch.contact?.email ||
																				branchDetails?.contact.email ||
																				'',
																			whatsapp: editedBranch.contact?.whatsapp,
																			website: e.target.value,
																		},
																	})
																}
																placeholder='الموقع الإلكتروني (اختياري)'
																className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
															/>
														</div>
													</>
												)}
											</div>
										</div>

										{/* الموقع على الخريطة */}
										<div>
											<h4 className='text-xs font-medium text-gray-500 mb-1'>
												الموقع على الخريطة
											</h4>
											<div className='h-40 bg-gray-100 rounded-md flex items-center justify-center'>
												<div className='text-center'>
													<MapPin className='h-6 w-6 text-gray-400 mx-auto' />
													<p className='text-xs text-gray-500 mt-1'>اضغط لفتح الخريطة</p>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* القسم الثاني: معلومات المدير وأوقات العمل */}
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
										<h3 className='text-sm font-medium text-gray-700'>مدير الفرع وأوقات العمل</h3>
									</div>
									<div className='p-4 space-y-4'>
										{/* معلومات المدير */}
										<div>
											<h4 className='text-xs font-medium text-gray-500 mb-2'>مدير الفرع</h4>
											{!editMode ? (
												<div className='flex items-center'>
													<div className='flex-shrink-0'>
														{branchDetails.manager.photo ? (
															<img
																src={branchDetails.manager.photo}
																alt={branchDetails.manager.name}
																className='h-10 w-10 rounded-full object-cover'
															/>
														) : (
															<div className='h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center'>
																<User className='h-5 w-5 text-gray-500' />
															</div>
														)}
													</div>
													<div className='mr-3'>
														<h5 className='text-sm font-medium text-gray-900'>
															{branchDetails.manager.name}
														</h5>
														<div className='flex flex-wrap text-xs text-gray-500 mt-1'>
															<span className='ml-2'>{branchDetails.manager.phone}</span>
															<span>{branchDetails.manager.email}</span>
														</div>
													</div>
												</div>
											) : (
												<div className='space-y-2'>
													<div className='flex items-center mb-2'>
														<div className='flex-shrink-0'>
															{branchDetails.manager.photo ? (
																<img
																	src={branchDetails.manager.photo}
																	alt={branchDetails.manager.name}
																	className='h-10 w-10 rounded-full object-cover'
																/>
															) : (
																<div className='h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center'>
																	<User className='h-5 w-5 text-gray-500' />
																</div>
															)}
														</div>
														<button className='mr-2 px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded hover:bg-blue-200'>
															تغيير
														</button>
													</div>
													<input
														type='text'
														value={editedBranch.manager?.name || ''}
														onChange={(e) =>
															setEditedBranch({
																...editedBranch,
																manager: {
																	...(branchDetails?.manager || {
																		id: 0,
																		phone: '',
																		email: '',
																	}),
																	...(editedBranch.manager || {}),
																	name: e.target.value,
																},
															})
														}
														placeholder='اسم المدير'
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
													/>
													<input
														type='tel'
														value={editedBranch.manager?.phone || ''}
														onChange={(e) =>
															setEditedBranch({
																...editedBranch,
																manager: {
																	...(branchDetails?.manager || {
																		id: 0,
																		name: '',
																		email: '',
																	}),
																	...(editedBranch.manager || {}),
																	phone: e.target.value,
																},
															})
														}
														placeholder='رقم الهاتف'
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
													/>
													<input
														type='email'
														value={editedBranch.manager?.email || ''}
														onChange={(e) =>
															setEditedBranch({
																...editedBranch,
																manager: {
																	...(branchDetails?.manager || {
																		id: 0,
																		name: '',
																		phone: '',
																	}),
																	...(editedBranch.manager || {}),
																	email: e.target.value,
																},
															})
														}
														placeholder='البريد الإلكتروني'
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
													/>
												</div>
											)}
										</div>

										{/* أوقات العمل */}
										<div>
											<h4 className='text-xs font-medium text-gray-500 mb-2'>أوقات العمل</h4>
											{!editMode ? (
												<div className='space-y-2'>
													<div className='flex'>
														<span className='text-sm font-medium text-gray-700 ml-2 w-24'>
															أيام الأسبوع:
														</span>
														<span className='text-sm text-gray-900'>
															{branchDetails.operatingHours.weekdays}
														</span>
													</div>
													<div className='flex'>
														<span className='text-sm font-medium text-gray-700 ml-2 w-24'>
															عطلة نهاية الأسبوع:
														</span>
														<span className='text-sm text-gray-900'>
															{branchDetails.operatingHours.weekends}
														</span>
													</div>
													<div className='flex'>
														<span className='text-sm font-medium text-gray-700 ml-2 w-24'>
															الإجازات الرسمية:
														</span>
														<span className='text-sm text-gray-900'>
															{branchDetails.operatingHours.holidays}
														</span>
													</div>
													{branchDetails.operatingHours.notes && (
														<div className='flex'>
															<span className='text-sm font-medium text-gray-700 ml-2 w-24'>
																ملاحظات:
															</span>
															<span className='text-sm text-gray-900'>
																{branchDetails.operatingHours.notes}
															</span>
														</div>
													)}
												</div>
											) : (
												<div className='space-y-2'>
													<div className='flex items-center'>
														<span className='text-sm font-medium text-gray-700 ml-2 w-24'>
															أيام الأسبوع:
														</span>
														<input
															type='text'
															value={editedBranch.operatingHours?.weekdays || ''}
															onChange={(e) =>
																setEditedBranch({
																	...editedBranch,
																	operatingHours: {
																		weekdays: e.target.value,
																		weekends:
																			editedBranch.operatingHours?.weekends ||
																			branchDetails?.operatingHours.weekends ||
																			'',
																		holidays:
																			editedBranch.operatingHours?.holidays ||
																			branchDetails?.operatingHours.holidays ||
																			'',
																		notes: editedBranch.operatingHours?.notes,
																	},
																})
															}
															placeholder='أوقات العمل في أيام الأسبوع'
															className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
														/>
													</div>
													<div className='flex items-center'>
														<span className='text-sm font-medium text-gray-700 ml-2 w-24'>
															نهاية الأسبوع:
														</span>
														<input
															type='text'
															value={editedBranch.operatingHours?.weekends || ''}
															onChange={(e) =>
																setEditedBranch({
																	...editedBranch,
																	operatingHours: {
																		weekdays:
																			editedBranch.operatingHours?.weekdays ||
																			branchDetails?.operatingHours.weekdays ||
																			'',
																		weekends: e.target.value,
																		holidays:
																			editedBranch.operatingHours?.holidays ||
																			branchDetails?.operatingHours.holidays ||
																			'',
																		notes: editedBranch.operatingHours?.notes,
																	},
																})
															}
															placeholder='أوقات العمل في نهاية الأسبوع'
															className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
														/>
													</div>
													<div className='flex items-center'>
														<span className='text-sm font-medium text-gray-700 ml-2 w-24'>
															الإجازات:
														</span>
														<input
															type='text'
															value={editedBranch.operatingHours?.holidays || ''}
															onChange={(e) =>
																setEditedBranch({
																	...editedBranch,
																	operatingHours: {
																		weekdays:
																			editedBranch.operatingHours?.weekdays ||
																			branchDetails?.operatingHours.weekdays ||
																			'',
																		weekends:
																			editedBranch.operatingHours?.weekends ||
																			branchDetails?.operatingHours.weekends ||
																			'',
																		holidays: e.target.value,
																		notes: editedBranch.operatingHours?.notes,
																	},
																})
															}
															placeholder='أوقات العمل في الإجازات الرسمية'
															className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
														/>
													</div>
													<div className='flex items-center'>
														<span className='text-sm font-medium text-gray-700 ml-2 w-24'>
															ملاحظات:
														</span>
														<input
															type='text'
															value={editedBranch.operatingHours?.notes || ''}
															onChange={(e) =>
																setEditedBranch({
																	...editedBranch,
																	operatingHours: {
																		weekdays:
																			editedBranch.operatingHours?.weekdays ||
																			branchDetails?.operatingHours.weekdays ||
																			'',
																		weekends:
																			editedBranch.operatingHours?.weekends ||
																			branchDetails?.operatingHours.weekends ||
																			'',
																		holidays:
																			editedBranch.operatingHours?.holidays ||
																			branchDetails?.operatingHours.holidays ||
																			'',
																		notes: e.target.value,
																	},
																})
															}
															placeholder='ملاحظات إضافية (اختياري)'
															className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
														/>
													</div>
												</div>
											)}
										</div>

										{/* تاريخ الافتتاح */}
										<div>
											<h4 className='text-xs font-medium text-gray-500 mb-1'>تاريخ الافتتاح</h4>
											{!editMode ? (
												<div className='flex items-center text-sm text-gray-900'>
													<Calendar className='h-4 w-4 text-gray-400 ml-2' />
													{formatDate(branchDetails.openingDate)}
												</div>
											) : (
												<div className='flex items-center'>
													<Calendar className='h-4 w-4 text-gray-400 ml-2' />
													<input
														type='date'
														value={editedBranch.openingDate || ''}
														onChange={(e) =>
															setEditedBranch({
																...editedBranch,
																openingDate: e.target.value,
															})
														}
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
													/>
												</div>
											)}
										</div>
									</div>
								</div>

								{/* القسم الثالث: الإحصائيات والمعلومات الإضافية */}
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='px-4 py-3 bg-gray-50 border-b border-gray-200'>
										<h3 className='text-sm font-medium text-gray-700'>معلومات إضافية وإحصائيات</h3>
									</div>
									<div className='p-4 space-y-4'>
										{/* معلومات المساحة والقدرة */}
										<div className='grid grid-cols-2 gap-4'>
											<div>
												<h4 className='text-xs font-medium text-gray-500 mb-1'>المساحة</h4>
												{!editMode ? (
													<p className='text-sm text-gray-900'>
														{branchDetails.area} متر مربع
													</p>
												) : (
													<div className='flex'>
														<input
															type='number'
															value={editedBranch.area || 0}
															onChange={(e) =>
																setEditedBranch({
																	...editedBranch,
																	area: Number(e.target.value),
																})
															}
															className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
														/>
														<span className='inline-flex items-center px-3 py-2 text-sm border border-l-0 border-gray-300 bg-gray-50 text-gray-500'>
															م²
														</span>
													</div>
												)}
											</div>
											<div>
												<h4 className='text-xs font-medium text-gray-500 mb-1'>
													القدرة الاستيعابية
												</h4>
												{!editMode ? (
													<p className='text-sm text-gray-900'>
														{branchDetails.maxCapacity} شخص
													</p>
												) : (
													<div className='flex'>
														<input
															type='number'
															value={editedBranch.maxCapacity || 0}
															onChange={(e) =>
																setEditedBranch({
																	...editedBranch,
																	maxCapacity: Number(e.target.value),
																})
															}
															className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
														/>
														<span className='inline-flex items-center px-3 py-2 text-sm border border-l-0 border-gray-300 bg-gray-50 text-gray-500'>
															شخص
														</span>
													</div>
												)}
											</div>
										</div>

										{/* المرافق المتوفرة */}
										<div>
											<h4 className='text-xs font-medium text-gray-500 mb-2'>المرافق المتوفرة</h4>
											{!editMode ? (
												<div className='flex flex-wrap gap-2'>
													{branchDetails.facilities.map((facility, index) => (
														<span
															key={index}
															className='inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800'
														>
															{facility}
														</span>
													))}
												</div>
											) : (
												<div>
													<div className='flex flex-wrap gap-2 mb-2'>
														{editedBranch.facilities?.map((facility, index) => (
															<div
																key={index}
																className='inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800'
															>
																<span>{facility}</span>
																<button
																	type='button'
																	onClick={() => {
																		const updatedFacilities = [
																			...(editedBranch.facilities || []),
																		];
																		updatedFacilities.splice(index, 1);
																		setEditedBranch({
																			...editedBranch,
																			facilities: updatedFacilities,
																		});
																	}}
																	className='mr-1 text-blue-600 hover:text-blue-800'
																>
																	<X className='h-3 w-3' />
																</button>
															</div>
														))}
													</div>
													<div className='flex'>
														<input
															type='text'
															id='new-facility'
															placeholder='أضف مرفق جديد'
															className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
															onKeyPress={(e) => {
																if (e.key === 'Enter') {
																	e.preventDefault();
																	const input = document.getElementById(
																		'new-facility'
																	) as HTMLInputElement;
																	if (input.value.trim()) {
																		setEditedBranch({
																			...editedBranch,
																			facilities: [
																				...(editedBranch.facilities || []),
																				input.value.trim(),
																			],
																		});
																		input.value = '';
																	}
																}
															}}
														/>
														<button
															type='button'
															onClick={() => {
																const input = document.getElementById(
																	'new-facility'
																) as HTMLInputElement;
																if (input.value.trim()) {
																	setEditedBranch({
																		...editedBranch,
																		facilities: [
																			...(editedBranch.facilities || []),
																			input.value.trim(),
																		],
																	});
																	input.value = '';
																}
															}}
															className='inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100'
														>
															<Plus className='h-4 w-4' />
														</button>
													</div>
												</div>
											)}
										</div>

										{/* التصنيفات */}
										<div>
											<h4 className='text-xs font-medium text-gray-500 mb-2'>التصنيفات</h4>
											{!editMode ? (
												<div className='flex flex-wrap gap-2'>
													{branchDetails.tags.map((tag, index) => (
														<span
															key={index}
															className='inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800'
														>
															<Tag className='h-3 w-3 ml-1' />
															{tag}
														</span>
													))}
												</div>
											) : (
												<div>
													<div className='flex flex-wrap gap-2 mb-2'>
														{editedBranch.tags?.map((tag, index) => (
															<div
																key={index}
																className='inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-100 text-green-800'
															>
																<Tag className='h-3 w-3 ml-1' />
																<span>{tag}</span>
																<button
																	type='button'
																	onClick={() => {
																		const updatedTags = [
																			...(editedBranch.tags || []),
																		];
																		updatedTags.splice(index, 1);
																		setEditedBranch({
																			...editedBranch,
																			tags: updatedTags,
																		});
																	}}
																	className='mr-1 text-green-600 hover:text-green-800'
																>
																	<X className='h-3 w-3' />
																</button>
															</div>
														))}
													</div>
													<div className='flex'>
														<input
															type='text'
															id='new-tag'
															placeholder='أضف تصنيف جديد'
															className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
															onKeyPress={(e) => {
																if (e.key === 'Enter') {
																	e.preventDefault();
																	const input = document.getElementById(
																		'new-tag'
																	) as HTMLInputElement;
																	if (input.value.trim()) {
																		setEditedBranch({
																			...editedBranch,
																			tags: [
																				...(editedBranch.tags || []),
																				input.value.trim(),
																			],
																		});
																		input.value = '';
																	}
																}
															}}
														/>
														<button
															type='button'
															onClick={() => {
																const input = document.getElementById(
																	'new-tag'
																) as HTMLInputElement;
																if (input.value.trim()) {
																	setEditedBranch({
																		...editedBranch,
																		tags: [
																			...(editedBranch.tags || []),
																			input.value.trim(),
																		],
																	});
																	input.value = '';
																}
															}}
															className='inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 hover:bg-gray-100'
														>
															<Plus className='h-4 w-4' />
														</button>
													</div>
												</div>
											)}
										</div>

										{/* الوصف */}
										<div>
											<h4 className='text-xs font-medium text-gray-500 mb-1'>الوصف</h4>
											{!editMode ? (
												<p className='text-sm text-gray-900'>
													{branchDetails.description || 'لا يوجد وصف متاح.'}
												</p>
											) : (
												<textarea
													value={editedBranch.description || ''}
													onChange={(e) =>
														setEditedBranch({
															...editedBranch,
															description: e.target.value,
														})
													}
													rows={3}
													placeholder='أدخل وصفاً للفرع'
													className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
												></textarea>
											)}
										</div>

										{/* ملخص الإحصائيات */}
										<div>
											<h4 className='text-xs font-medium text-gray-500 mb-2'>ملخص الإحصائيات</h4>
											<div className='grid grid-cols-2 gap-3'>
												<div className='bg-blue-50 p-2 rounded-md'>
													<div className='flex justify-between items-center'>
														<span className='text-xs text-blue-700'>عدد الطلبات</span>
														<span className='text-sm font-bold text-blue-900'>
															{branchDetails.statistics.ordersCount.toLocaleString()}
														</span>
													</div>
												</div>
												<div className='bg-green-50 p-2 rounded-md'>
													<div className='flex justify-between items-center'>
														<span className='text-xs text-green-700'>المبيعات الشهرية</span>
														<span className='text-sm font-bold text-green-900'>
															{branchDetails.statistics.monthlySales.toLocaleString()} ر.س
														</span>
													</div>
												</div>
												<div className='bg-amber-50 p-2 rounded-md'>
													<div className='flex justify-between items-center'>
														<span className='text-xs text-amber-700'>متوسط الطلب</span>
														<span className='text-sm font-bold text-amber-900'>
															{branchDetails.statistics.avgOrderValue.toLocaleString()}{' '}
															ر.س
														</span>
													</div>
												</div>
												<div className='bg-purple-50 p-2 rounded-md'>
													<div className='flex justify-between items-center'>
														<span className='text-xs text-purple-700'>تقييم العملاء</span>
														<span className='text-sm font-bold text-purple-900 flex items-center'>
															{branchDetails.statistics.customerRating}
															<Star className='h-3 w-3 ml-1 text-amber-500 fill-current' />
														</span>
													</div>
												</div>
											</div>
											<div className='mt-2 pt-2 border-t border-gray-200'>
												<button
													onClick={() => setActiveTab('statistics')}
													className='text-xs font-medium text-green-600 hover:text-green-800 flex items-center justify-end'
												>
													عرض تقرير مفصل
													<ArrowUpRight className='h-3 w-3 mr-1' />
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* زر حفظ التغييرات */}
							{editMode && (
								<div className='flex justify-end space-x-3 space-x-reverse'>
									<button
										type='button'
										onClick={() => setEditMode(false)}
										className='px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
									>
										إلغاء
									</button>
									<button
										type='button'
										onClick={handleSaveChanges}
										disabled={isSaving}
										className='px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none disabled:bg-green-300 disabled:cursor-not-allowed flex items-center'
									>
										{isSaving ? (
											<span className='flex items-center'>
												<span className='animate-spin h-4 w-4 ml-1 border-2 border-t-transparent border-white rounded-full'></span>
												جاري الحفظ...
											</span>
										) : (
											<>
												<Save className='ml-1.5 -mr-0.5 h-4 w-4' />
												حفظ التغييرات
											</>
										)}
									</button>
								</div>
							)}
						</div>
					)}

					{/* تبويب المستندات والسجلات */}
					{activeTab === 'documents' && (
						<div className='space-y-6'>
							<div className='flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0'>
								<div>
									<h2 className='text-lg font-medium text-gray-900 mb-1'>المستندات والسجلات</h2>
									<p className='text-sm text-gray-600'>إدارة الملفات والوثائق الخاصة بالفرع</p>
								</div>

								<div className='flex items-center space-x-2 space-x-reverse'>
									<button
										type='button'
										className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center'
									>
										<UploadCloud className='ml-1.5 -mr-0.5 h-4 w-4' />
										رفع ملف جديد
									</button>
								</div>
							</div>

							{/* أدوات فلترة المستندات */}
							<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
								<div className='p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0'>
									<div className='flex space-x-3 space-x-reverse'>
										<button
											onClick={() => setDocumentFilter('all')}
											className={`px-3 py-1.5 text-sm font-medium ${
												documentFilter === 'all'
													? 'bg-green-100 text-green-800'
													: 'text-gray-700 hover:bg-gray-100'
											} rounded-md`}
										>
											الكل
										</button>

										<button
											onClick={() => setDocumentFilter('license')}
											className={`px-3 py-1.5 text-sm font-medium ${
												documentFilter === 'license'
													? 'bg-red-100 text-red-800'
													: 'text-gray-700 hover:bg-gray-100'
											} rounded-md`}
										>
											الرخص
										</button>

										<button
											onClick={() => setDocumentFilter('contract')}
											className={`px-3 py-1.5 text-sm font-medium ${
												documentFilter === 'contract'
													? 'bg-blue-100 text-blue-800'
													: 'text-gray-700 hover:bg-gray-100'
											} rounded-md`}
										>
											العقود
										</button>

										<button
											onClick={() => setDocumentFilter('certificate')}
											className={`px-3 py-1.5 text-sm font-medium ${
												documentFilter === 'certificate'
													? 'bg-purple-100 text-purple-800'
													: 'text-gray-700 hover:bg-gray-100'
											} rounded-md`}
										>
											الشهادات
										</button>

										<button
											onClick={() => setDocumentFilter('report')}
											className={`px-3 py-1.5 text-sm font-medium ${
												documentFilter === 'report'
													? 'bg-amber-100 text-amber-800'
													: 'text-gray-700 hover:bg-gray-100'
											} rounded-md`}
										>
											التقارير
										</button>
									</div>

									<div className='relative'>
										<input
											type='text'
											placeholder='بحث في المستندات...'
											value={documentSearchQuery}
											onChange={(e) => setDocumentSearchQuery(e.target.value)}
											className='block w-full sm:w-64 pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
										/>
										<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
											<Search className='h-4 w-4 text-gray-400' />
										</div>
									</div>
								</div>

								{/* قائمة المستندات */}
								<div>
									{getFilteredDocuments().length === 0 ? (
										<div className='p-8 text-center'>
											<FileText className='h-10 w-10 text-gray-300 mx-auto mb-2' />
											<h3 className='text-sm font-medium text-gray-900'>لا توجد مستندات</h3>
											<p className='mt-1 text-sm text-gray-500'>
												{documentSearchQuery || documentFilter !== 'all'
													? 'لا توجد مستندات تطابق معايير البحث'
													: 'لم يتم إضافة أي مستندات لهذا الفرع بعد'}
											</p>
											{documentSearchQuery || documentFilter !== 'all' ? (
												<button
													onClick={() => {
														setDocumentSearchQuery('');
														setDocumentFilter('all');
													}}
													className='mt-2 text-sm text-green-600 hover:text-green-700'
												>
													إزالة الفلاتر
												</button>
											) : (
												<button className='mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none'>
													<UploadCloud className='ml-1 h-4 w-4' />
													رفع مستند جديد
												</button>
											)}
										</div>
									) : (
										<div className='overflow-x-auto'>
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
															الحجم
														</th>
														<th
															scope='col'
															className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															تاريخ الرفع
														</th>
														<th
															scope='col'
															className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															تاريخ الانتهاء
														</th>
														<th
															scope='col'
															className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															الحالة
														</th>
														<th scope='col' className='relative px-6 py-3'>
															<span className='sr-only'>إجراءات</span>
														</th>
													</tr>
												</thead>
												<tbody className='bg-white divide-y divide-gray-200'>
													{getFilteredDocuments().map((document) => (
														<tr key={document.id} className='hover:bg-gray-50'>
															<td className='px-6 py-4 whitespace-nowrap'>
																<div className='flex items-center'>
																	<div className='flex-shrink-0'>
																		{getDocumentIcon(document.type)}
																	</div>
																	<div className='mr-4'>
																		<div className='text-sm font-medium text-gray-900'>
																			{document.name}
																		</div>
																		<div className='text-xs text-gray-500 flex items-center mt-0.5'>
																			<span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800'>
																				{getDocumentCategoryName(
																					document.category
																				)}
																			</span>
																			{document.description && (
																				<span className='mr-1 text-gray-500 truncate max-w-xs'>
																					- {document.description}
																				</span>
																			)}
																		</div>
																	</div>
																</div>
															</td>
															<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
																{formatFileSize(document.size)}
															</td>
															<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
																{formatDate(document.uploadDate)}
															</td>
															<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
																{document.expiryDate
																	? formatDate(document.expiryDate)
																	: '—'}
															</td>
															<td className='px-6 py-4 whitespace-nowrap'>
																{document.expiryDate ? (
																	<span
																		className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
																			getDocumentStatus(document.expiryDate) ===
																			'expired'
																				? 'bg-red-100 text-red-800'
																				: getDocumentStatus(
																						document.expiryDate
																				  ) === 'warning'
																				? 'bg-amber-100 text-amber-800'
																				: 'bg-green-100 text-green-800'
																		}`}
																	>
																		{getDocumentStatus(document.expiryDate) ===
																		'expired'
																			? 'منتهي الصلاحية'
																			: getDocumentStatus(document.expiryDate) ===
																			  'warning'
																			? `ينتهي خلال ${getRemainingDays(
																					document.expiryDate
																			  )} يوم`
																			: 'ساري'}
																	</span>
																) : (
																	'—'
																)}
															</td>
															<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
																<div className='flex items-center justify-end space-x-2 space-x-reverse'>
																	<button
																		className='text-gray-600 hover:text-gray-900'
																		title='عرض'
																	>
																		<Eye className='h-5 w-5' />
																	</button>

																	<a
																		href={document.url}
																		target='_blank'
																		rel='noopener noreferrer'
																		className='text-blue-600 hover:text-blue-900'
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
									)}
								</div>
							</div>
						</div>
					)}

					{/* تبويب الموظفين */}
					{activeTab === 'employees' && (
						<div className='space-y-6'>
							<div className='flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0'>
								<div>
									<h2 className='text-lg font-medium text-gray-900 mb-1'>فريق عمل الفرع</h2>
									<p className='text-sm text-gray-600'>إدارة موظفي الفرع ومتابعة أدائهم</p>
								</div>

								<button
									type='button'
									className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center'
								>
									<UserPlus className='ml-1.5 -mr-0.5 h-4 w-4' />
									إضافة موظف
								</button>
							</div>

							{/* قائمة الموظفين */}
							<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
								<div className='p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0'>
									<div>
										<span className='text-sm text-gray-600'>
											إجمالي الموظفين:{' '}
											<span className='font-medium text-gray-900'>{employees.length}</span>
										</span>
									</div>

									<div className='relative'>
										<input
											type='text'
											placeholder='بحث عن موظف...'
											className='block w-full sm:w-64 pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
										/>
										<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
											<Search className='h-4 w-4 text-gray-400' />
										</div>
									</div>
								</div>

								{employees.length === 0 ? (
									<div className='p-8 text-center'>
										<Users className='h-10 w-10 text-gray-300 mx-auto mb-2' />
										<h3 className='text-sm font-medium text-gray-900'>لا يوجد موظفين</h3>
										<p className='mt-1 text-sm text-gray-500'>
											لم يتم إضافة أي موظفين لهذا الفرع بعد
										</p>
										<button className='mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none'>
											<UserPlus className='ml-1 h-4 w-4' />
											إضافة موظف
										</button>
									</div>
								) : (
									<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4'>
										{employees.map((employee) => (
											<div
												key={employee.id}
												className='bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden'
											>
												<div className='p-4'>
													<div className='flex items-start justify-between'>
														<div className='flex items-center'>
															<div className='flex-shrink-0'>
																{employee.photo ? (
																	<img
																		src={employee.photo}
																		alt={employee.name}
																		className='h-10 w-10 rounded-full object-cover'
																	/>
																) : (
																	<div className='h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center'>
																		<User className='h-5 w-5 text-gray-500' />
																	</div>
																)}
															</div>
															<div className='mr-3'>
																<h3 className='text-sm font-medium text-gray-900'>
																	{employee.name}
																</h3>
																<div className='flex items-center mt-1'>
																	<span
																		className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
																			employee.isManager
																				? 'bg-purple-100 text-purple-800'
																				: 'bg-blue-100 text-blue-800'
																		}`}
																	>
																		{employee.position}
																	</span>
																	<span
																		className={`mr-1 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
																			employee.status === 'active'
																				? 'bg-green-100 text-green-800'
																				: employee.status === 'vacation'
																				? 'bg-amber-100 text-amber-800'
																				: employee.status === 'leave'
																				? 'bg-orange-100 text-orange-800'
																				: 'bg-red-100 text-red-800'
																		}`}
																	>
																		{employee.status === 'active'
																			? 'نشط'
																			: employee.status === 'vacation'
																			? 'إجازة'
																			: employee.status === 'leave'
																			? 'غياب'
																			: 'غير نشط'}
																	</span>
																</div>
															</div>
														</div>
														{employee.performanceRating && (
															<div className='flex items-center'>
																<span className='text-sm font-medium'>
																	{employee.performanceRating}
																</span>
																<Star className='h-4 w-4 ml-0.5 text-amber-500 fill-current' />
															</div>
														)}
													</div>

													<div className='mt-3 pt-3 border-t border-gray-200'>
														<div className='grid grid-cols-2 gap-2 text-xs'>
															<div>
																<span className='text-gray-500'>القسم:</span>
																<span className='mr-1 font-medium text-gray-900'>
																	{employee.department}
																</span>
															</div>
															<div>
																<span className='text-gray-500'>تاريخ التعيين:</span>
																<span className='mr-1 font-medium text-gray-900'>
																	{formatDate(employee.startDate)}
																</span>
															</div>
															<div className='col-span-2'>
																<span className='text-gray-500'>
																	البريد الإلكتروني:
																</span>
																<span className='mr-1 font-medium text-gray-900'>
																	{employee.email}
																</span>
															</div>
															<div className='col-span-2'>
																<span className='text-gray-500'>رقم الهاتف:</span>
																<span className='mr-1 font-medium text-gray-900'>
																	{employee.phone}
																</span>
															</div>
														</div>
													</div>

													<div className='mt-3 flex justify-end space-x-2 space-x-reverse'>
														<Link
															href={`/dashboard/employees/${employee.id}`}
															className='inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none'
														>
															عرض التفاصيل
														</Link>

														<button
															type='button'
															className='inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none'
														>
															تعديل
														</button>
														{!employee.isManager && (
															<button
																type='button'
																className='inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none'
															>
																إزالة
															</button>
														)}
													</div>
												</div>
											</div>
										))}
									</div>
								)}
							</div>
						</div>
					)}

					{/* تبويب الإحصائيات */}
					{activeTab === 'statistics' && (
						<div className='space-y-6'>
							<div>
								<h2 className='text-lg font-medium text-gray-900 mb-1'>إحصائيات وأداء الفرع</h2>
								<p className='text-sm text-gray-600'>تحليل أداء الفرع والإحصائيات المالية</p>
							</div>

							{/* لوحة الإحصائيات */}
							<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='p-4 flex items-center justify-between'>
										<div>
											<p className='text-sm font-medium text-gray-500'>إجمالي المبيعات</p>
											<p className='mt-1 text-2xl font-bold text-gray-900'>
												{branchDetails.statistics.monthlySales.toLocaleString()}{' '}
												<span className='text-sm font-medium'>ر.س</span>
											</p>
										</div>
										<div className='h-12 w-12 bg-green-100 rounded-full flex items-center justify-center'>
											<DollarSign className='h-6 w-6 text-green-600' />
										</div>
									</div>
									<div className='bg-green-50 px-4 py-2 text-xs text-green-700 flex justify-between'>
										<span>شهر يونيو 2023</span>
										<span className='flex items-center'>
											<ArrowUpRight className='h-3 w-3 ml-1' />
											4.3%
										</span>
									</div>
								</div>

								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='p-4 flex items-center justify-between'>
										<div>
											<p className='text-sm font-medium text-gray-500'>عدد الطلبات</p>
											<p className='mt-1 text-2xl font-bold text-gray-900'>
												{branchDetails.statistics.ordersCount.toLocaleString()}
											</p>
										</div>
										<div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center'>
											<Package className='h-6 w-6 text-blue-600' />
										</div>
									</div>
									<div className='bg-blue-50 px-4 py-2 text-xs text-blue-700 flex justify-between'>
										<span>طلبات مكتملة</span>
										<span className='flex items-center'>
											<ArrowUpRight className='h-3 w-3 ml-1' />
											5.2%
										</span>
									</div>
								</div>

								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='p-4 flex items-center justify-between'>
										<div>
											<p className='text-sm font-medium text-gray-500'>متوسط قيمة الطلب</p>
											<p className='mt-1 text-2xl font-bold text-gray-900'>
												{branchDetails.statistics.avgOrderValue.toLocaleString()}{' '}
												<span className='text-sm font-medium'>ر.س</span>
											</p>
										</div>
										<div className='h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center'>
											<BarChart className='h-6 w-6 text-purple-600' />
										</div>
									</div>
									<div className='bg-purple-50 px-4 py-2 text-xs text-purple-700 flex justify-between'>
										<span>متوسط الطلبات</span>
										<span className='flex items-center'>
											<ArrowUpRight className='h-3 w-3 ml-1' />
											2.8%
										</span>
									</div>
								</div>

								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='p-4 flex items-center justify-between'>
										<div>
											<p className='text-sm font-medium text-gray-500'>تقييم العملاء</p>
											<p className='mt-1 text-2xl font-bold text-gray-900 flex items-center'>
												{branchDetails.statistics.customerRating}
												<Star className='h-5 w-5 mr-1 text-amber-500 fill-current' />
											</p>
										</div>
										<div className='h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center'>
											<Star className='h-6 w-6 text-amber-600' />
										</div>
									</div>
									<div className='bg-amber-50 px-4 py-2 text-xs text-amber-700 flex justify-between'>
										<span>من 5 نجوم</span>
										<span className='flex items-center'>
											<ArrowUpRight className='h-3 w-3 ml-1' />
											0.2
										</span>
									</div>
								</div>
							</div>

							{/* اختيار نطاق التاريخ */}
							<div className='bg-white rounded-lg border border-gray-200 p-4 flex flex-col sm:flex-row justify-between items-center'>
								<div>
									<h3 className='text-sm font-medium text-gray-900'>الإحصائيات الشهرية</h3>
									<p className='text-xs text-gray-500 mt-1'>
										تقرير مفصل لأداء الفرع خلال الفترة المحددة
									</p>
								</div>

								<div className='mt-3 sm:mt-0'>
									<div className='flex items-center space-x-2 space-x-reverse'>
										<div className='flex items-center'>
											<span className='text-sm text-gray-500 ml-2'>من:</span>
											<input
												type='date'
												value='2023-01-01'
												className='px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500'
											/>
										</div>
										<div className='flex items-center'>
											<span className='text-sm text-gray-500 ml-2'>إلى:</span>
											<input
												type='date'
												value='2023-06-30'
												className='px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:ring-green-500 focus:border-green-500'
											/>
										</div>
										<button
											type='button'
											className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none'
										>
											تطبيق
										</button>
									</div>
								</div>
							</div>

							{/* الرسوم البيانية والإحصائيات */}
							<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
								{/* الرسم البياني للمبيعات والطلبات */}
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='px-4 py-3 border-b border-gray-200 flex justify-between items-center'>
										<h3 className='text-sm font-medium text-gray-900'>المبيعات والطلبات الشهرية</h3>
										<div className='flex items-center'>
											<div className='mr-4 flex items-center'>
												<span className='h-3 w-3 bg-green-500 rounded-full ml-1'></span>
												<span className='text-xs text-gray-600'>المبيعات</span>
											</div>
											<div className='flex items-center'>
												<span className='h-3 w-3 bg-blue-500 rounded-full ml-1'></span>
												<span className='text-xs text-gray-600'>الطلبات</span>
											</div>
										</div>
									</div>
									<div className='p-4'>
										<div className='h-64 flex items-center justify-center'>
											{/* هنا يمكن إضافة مكتبة رسوم بيانية مثل Chart.js أو Recharts */}
											<div className='text-center text-gray-500'>
												<BarChart className='h-12 w-12 mx-auto text-gray-300' />
												<p className='mt-2'>الرسم البياني للمبيعات والطلبات</p>
											</div>
										</div>
									</div>
								</div>

								{/* الرسم البياني للعملاء والمصروفات */}
								<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
									<div className='px-4 py-3 border-b border-gray-200 flex justify-between items-center'>
										<h3 className='text-sm font-medium text-gray-900'>العملاء والمصروفات</h3>
										<div className='flex items-center'>
											<div className='mr-4 flex items-center'>
												<span className='h-3 w-3 bg-purple-500 rounded-full ml-1'></span>
												<span className='text-xs text-gray-600'>العملاء</span>
											</div>
											<div className='flex items-center'>
												<span className='h-3 w-3 bg-red-500 rounded-full ml-1'></span>
												<span className='text-xs text-gray-600'>المصروفات</span>
											</div>
										</div>
									</div>
									<div className='p-4'>
										<div className='h-64 flex items-center justify-center'>
											<div className='text-center text-gray-500'>
												<PieChart className='h-12 w-12 mx-auto text-gray-300' />
												<p className='mt-2'>الرسم البياني للعملاء والمصروفات</p>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* جدول الإحصائيات الشهرية */}
							<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
								<div className='px-4 py-3 border-b border-gray-200'>
									<h3 className='text-sm font-medium text-gray-900'>البيانات الشهرية</h3>
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
													المبيعات (ر.س)
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													الطلبات
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													العملاء
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													المصروفات (ر.س)
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													صافي الربح (ر.س)
												</th>
											</tr>
										</thead>
										<tbody className='bg-white divide-y divide-gray-200'>
											{monthlyStats.map((stat, index) => (
												<tr key={index} className='hover:bg-gray-50'>
													<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
														{stat.month}
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
														{stat.sales.toLocaleString()}
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
														{stat.orders.toLocaleString()}
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
														{stat.customers.toLocaleString()}
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
														{stat.expenses.toLocaleString()}
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600'>
														{(stat.sales - stat.expenses).toLocaleString()}
													</td>
												</tr>
											))}
										</tbody>
										<tfoot className='bg-gray-50'>
											<tr>
												<td className='px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900'>
													الإجمالي
												</td>
												<td className='px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900'>
													{monthlyStats
														.reduce((sum, stat) => sum + stat.sales, 0)
														.toLocaleString()}
												</td>
												<td className='px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900'>
													{monthlyStats
														.reduce((sum, stat) => sum + stat.orders, 0)
														.toLocaleString()}
												</td>
												<td className='px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900'>
													{/* عدد العملاء الفريدين قد يختلف عن مجموع الأشهر، لذا نستخدم متوسط */}
													{Math.round(
														monthlyStats.reduce((sum, stat) => sum + stat.customers, 0) /
															monthlyStats.length
													).toLocaleString()}
												</td>
												<td className='px-6 py-3 whitespace-nowrap text-sm font-bold text-gray-900'>
													{monthlyStats
														.reduce((sum, stat) => sum + stat.expenses, 0)
														.toLocaleString()}
												</td>
												<td className='px-6 py-3 whitespace-nowrap text-sm font-bold text-green-600'>
													{monthlyStats
														.reduce((sum, stat) => sum + (stat.sales - stat.expenses), 0)
														.toLocaleString()}
												</td>
											</tr>
										</tfoot>
									</table>
								</div>
								<div className='px-4 py-3 border-t border-gray-200 text-right'>
									<a
										href='#'
										className='text-sm text-green-600 hover:text-green-800 flex items-center justify-end'
									>
										تصدير التقرير
										<Download className='h-4 w-4 mr-1' />
									</a>
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
		</div>
	);
}
