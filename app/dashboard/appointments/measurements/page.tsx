'use client';

import {
	AlertCircle,
	ArrowLeft,
	BarChart2,
	Calendar,
	Check,
	ChevronDown,
	ChevronLeft,
	Clock,
	Download,
	Edit,
	Eye,
	Filter,
	MessageSquare,
	Phone,
	Plus,
	Scissors,
	Search,
	User,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Appointment {
	id: string;
	customerId: string;
	customerName: string;
	customerPhone: string;
	date: string;
	time: string;
	duration: number; // minutes
	branchId: string;
	branchName: string;
	status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'noshow';
	notes: string | null;
	assignedTo: string | null;
	orderReference: string | null;
	measurementType: 'new' | 'adjustment' | 'retake';
	createdAt: string;
}

interface MeasurementStats {
	today: number;
	upcoming: number;
	completed: number;
	byType: {
		new: number;
		adjustment: number;
		retake: number;
	};
	avgDuration: number;
}

export default function MeasurementsPage() {
	const [loading, setLoading] = useState(true);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
	const [stats, setStats] = useState<MeasurementStats | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [typeFilter, setTypeFilter] = useState('all');
	const [dateFilter, setDateFilter] = useState('all');
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
	const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchAppointmentData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية لمواعيد القياس
			const mockAppointments: Appointment[] = [
				{
					id: 'app-001',
					customerId: 'cust-001',
					customerName: 'محمد أحمد',
					customerPhone: '0501234567',
					date: '2023-09-25',
					time: '10:00',
					duration: 45,
					branchId: 'branch-001',
					branchName: 'الفرع الرئيسي',
					status: 'scheduled',
					notes: 'قياس جديد لثوب كامل',
					assignedTo: 'خالد محمد',
					orderReference: 'ORD-12345',
					measurementType: 'new',
					createdAt: '2023-09-20',
				},
				{
					id: 'app-005',
					customerId: 'cust-005',
					customerName: 'نورة السالم',
					customerPhone: '0531234567',
					date: '2023-09-27',
					time: '10:30',
					duration: 45,
					branchId: 'branch-002',
					branchName: 'فرع الخبر',
					status: 'scheduled',
					notes: 'قياسات جديدة',
					assignedTo: 'سارة الحمد',
					orderReference: 'ORD-12348',
					measurementType: 'new',
					createdAt: '2023-09-23',
				},
				{
					id: 'app-008',
					customerId: 'cust-008',
					customerName: 'عمر سعيد',
					customerPhone: '0511234567',
					date: '2023-09-26',
					time: '09:00',
					duration: 45,
					branchId: 'branch-001',
					branchName: 'الفرع الرئيسي',
					status: 'confirmed',
					notes: 'قياس جديد للثوب',
					assignedTo: 'خالد محمد',
					orderReference: 'ORD-12351',
					measurementType: 'new',
					createdAt: '2023-09-22',
				},
				{
					id: 'app-011',
					customerId: 'cust-011',
					customerName: 'عبدالعزيز محمد',
					customerPhone: '0561234567',
					date: '2023-09-24',
					time: '11:00',
					duration: 30,
					branchId: 'branch-001',
					branchName: 'الفرع الرئيسي',
					status: 'completed',
					notes: 'إعادة قياس بعد فقدان الوزن',
					assignedTo: 'خالد محمد',
					orderReference: 'ORD-12360',
					measurementType: 'retake',
					createdAt: '2023-09-20',
				},
				{
					id: 'app-012',
					customerId: 'cust-012',
					customerName: 'فهد العمري',
					customerPhone: '0531234567',
					date: '2023-09-28',
					time: '14:30',
					duration: 30,
					branchId: 'branch-002',
					branchName: 'فرع الخبر',
					status: 'scheduled',
					notes: 'تعديل على القياسات السابقة',
					assignedTo: 'سارة الحمد',
					orderReference: 'ORD-12365',
					measurementType: 'adjustment',
					createdAt: '2023-09-24',
				},
				{
					id: 'app-013',
					customerId: 'cust-013',
					customerName: 'حسام الشمري',
					customerPhone: '0541234567',
					date: '2023-09-23',
					time: '09:30',
					duration: 45,
					branchId: 'branch-001',
					branchName: 'الفرع الرئيسي',
					status: 'noshow',
					notes: 'قياس جديد',
					assignedTo: 'خالد محمد',
					orderReference: 'ORD-12370',
					measurementType: 'new',
					createdAt: '2023-09-19',
				},
				{
					id: 'app-014',
					customerId: 'cust-014',
					customerName: 'ياسر العتيبي',
					customerPhone: '0551234567',
					date: '2023-09-29',
					time: '16:00',
					duration: 45,
					branchId: 'branch-001',
					branchName: 'الفرع الرئيسي',
					status: 'scheduled',
					notes: 'قياس جديد لثلاثة أثواب',
					assignedTo: 'خالد محمد',
					orderReference: 'ORD-12375',
					measurementType: 'new',
					createdAt: '2023-09-25',
				},
				{
					id: 'app-015',
					customerId: 'cust-015',
					customerName: 'عبدالرحمن السالم',
					customerPhone: '0521234567',
					date: '2023-09-26',
					time: '15:30',
					duration: 30,
					branchId: 'branch-002',
					branchName: 'فرع الخبر',
					status: 'confirmed',
					notes: 'تعديل على القياس',
					assignedTo: 'سارة الحمد',
					orderReference: 'ORD-12380',
					measurementType: 'adjustment',
					createdAt: '2023-09-23',
				},
			];

			// بيانات تجريبية للإحصائيات
			const mockStats: MeasurementStats = {
				today: 2,
				upcoming: 7,
				completed: 145,
				byType: {
					new: 95,
					adjustment: 35,
					retake: 15,
				},
				avgDuration: 42,
			};

			setAppointments(mockAppointments);
			setFilteredAppointments(mockAppointments);
			setStats(mockStats);
			setLoading(false);
		};

		fetchAppointmentData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let filtered = [...appointments];

		// تطبيق فلتر البحث
		if (searchTerm) {
			filtered = filtered.filter(
				(appointment) =>
					appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					appointment.customerPhone.includes(searchTerm) ||
					(appointment.orderReference &&
						appointment.orderReference.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			filtered = filtered.filter((appointment) => appointment.status === statusFilter);
		}

		// تطبيق فلتر نوع القياس
		if (typeFilter !== 'all') {
			filtered = filtered.filter((appointment) => appointment.measurementType === typeFilter);
		}

		// تطبيق فلتر التاريخ
		if (dateFilter !== 'all') {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);

			const nextWeek = new Date(today);
			nextWeek.setDate(nextWeek.getDate() + 7);

			if (dateFilter === 'today') {
				filtered = filtered.filter((appointment) => {
					const appointmentDate = new Date(appointment.date);
					appointmentDate.setHours(0, 0, 0, 0);
					return appointmentDate.getTime() === today.getTime();
				});
			} else if (dateFilter === 'tomorrow') {
				filtered = filtered.filter((appointment) => {
					const appointmentDate = new Date(appointment.date);
					appointmentDate.setHours(0, 0, 0, 0);
					return appointmentDate.getTime() === tomorrow.getTime();
				});
			} else if (dateFilter === 'week') {
				filtered = filtered.filter((appointment) => {
					const appointmentDate = new Date(appointment.date);
					appointmentDate.setHours(0, 0, 0, 0);
					return appointmentDate >= today && appointmentDate < nextWeek;
				});
			} else if (dateFilter === 'custom' && selectedDate) {
				const selectedDay = new Date(selectedDate);
				selectedDay.setHours(0, 0, 0, 0);

				filtered = filtered.filter((appointment) => {
					const appointmentDate = new Date(appointment.date);
					appointmentDate.setHours(0, 0, 0, 0);
					return appointmentDate.getTime() === selectedDay.getTime();
				});
			}
		}

		// ترتيب حسب التاريخ والوقت
		filtered.sort((a, b) => {
			const dateA = new Date(`${a.date}T${a.time}`);
			const dateB = new Date(`${b.date}T${b.time}`);
			return dateA.getTime() - dateB.getTime();
		});

		setFilteredAppointments(filtered);
	}, [appointments, searchTerm, statusFilter, typeFilter, dateFilter, selectedDate]);

	// الحصول على شارة نوع القياس
	const getMeasurementTypeBadge = (type: string) => {
		switch (type) {
			case 'new':
				return <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>قياس جديد</span>;
			case 'adjustment':
				return <span className='px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800'>تعديل قياس</span>;
			case 'retake':
				return <span className='px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800'>إعادة قياس</span>;
			default:
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>{type}</span>;
		}
	};

	// الحصول على شارة حالة الموعد
	const getAppointmentStatusBadge = (status: string) => {
		switch (status) {
			case 'scheduled':
				return <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>مجدول</span>;
			case 'confirmed':
				return <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>مؤكد</span>;
			case 'completed':
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>مكتمل</span>;
			case 'cancelled':
				return <span className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'>ملغي</span>;
			case 'noshow':
				return <span className='px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800'>لم يحضر</span>;
			default:
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>{status}</span>;
		}
	};

	// تنسيق التاريخ
	const formatDate = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
	};

	// تنسيق الوقت
	const formatTime = (timeStr: string) => {
		const [hours, minutes] = timeStr.split(':');
		return `${hours}:${minutes}`;
	};

	// تنسيق المدة
	const formatDuration = (minutes: number) => {
		if (minutes < 60) {
			return `${minutes} دقيقة`;
		} else {
			const hours = Math.floor(minutes / 60);
			const remainingMinutes = minutes % 60;
			return remainingMinutes > 0 ? `${hours} ساعة و ${remainingMinutes} دقيقة` : `${hours} ساعة`;
		}
	};

	// عرض تفاصيل الموعد
	const viewAppointmentDetails = (appointment: Appointment) => {
		setSelectedAppointment(appointment);
		setShowAppointmentDetails(true);
	};

	// تعيين فلتر تاريخ مخصص
	const handleCustomDateFilter = (date: Date) => {
		setSelectedDate(date);
		setDateFilter('custom');
	};

	// حالة التحميل
	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<div className='flex items-center'>
						<Link
							href='/dashboard/appointments'
							className='flex items-center text-gray-500 hover:text-gray-700 ml-4'
						>
							<ArrowLeft className='h-5 w-5' />
							<span className='mr-1 text-sm'>العودة</span>
						</Link>
						<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
							<Scissors className='inline-block ml-2 h-6 w-6 text-blue-600' />
							مواعيد القياس
						</h1>
					</div>
					<p className='mt-1 text-sm text-gray-600'>إدارة وتنظيم مواعيد قياس العملاء</p>
				</div>

				<div className='flex gap-2'>
					<Link
						href='/dashboard/appointments/new?type=measurement'
						className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700'
					>
						<Plus className='ml-1 h-4 w-4' />
						حجز موعد قياس
					</Link>

					<Link
						href='/dashboard/reports/appointments/measurements'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						التقارير
					</Link>

					<button className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'>
						<Download className='ml-1 h-4 w-4' />
						تصدير
					</button>
				</div>
			</div>

			{/* ملخص الإحصائيات */}
			{stats && (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>مواعيد القياس اليوم</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>{stats.today}</h3>
								<div className='flex items-center text-xs text-gray-500 mt-1'>
									<Clock className='h-3 w-3 ml-1 text-gray-400' />
									<span>مواعيد قياس مجدولة ليوم اليوم</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-blue-100'>
								<Calendar className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>إجمالي القياسات</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>
									{stats.byType.new + stats.byType.adjustment + stats.byType.retake}
								</h3>
								<div className='flex items-center text-xs text-gray-500 mt-1'>
									<div className='h-2 w-2 rounded-full bg-blue-500 ml-1'></div>
									<span>جديد: {stats.byType.new}</span>
									<div className='h-2 w-2 rounded-full bg-purple-500 mx-1 mr-2'></div>
									<span>تعديل: {stats.byType.adjustment}</span>
									<div className='h-2 w-2 rounded-full bg-amber-500 mx-1 mr-2'></div>
									<span>إعادة: {stats.byType.retake}</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-blue-100'>
								<Scissors className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>المواعيد القادمة</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>{stats.upcoming}</h3>
								<div className='flex items-center text-xs text-gray-500 mt-1'>
									<Clock className='h-3 w-3 ml-1 text-gray-400' />
									<span>خلال الأسبوع القادم</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-green-100'>
								<ChevronLeft className='h-6 w-6 text-green-600' />
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>متوسط مدة القياس</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>{stats.avgDuration} دقيقة</h3>
								<div className='flex items-center text-xs text-gray-500 mt-1'>
									<Clock className='h-3 w-3 ml-1 text-gray-400' />
									<span>متوسط الوقت لإتمام القياس</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-blue-100'>
								<Clock className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>
				</div>
			)}

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<div className='grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6'>
					{/* البحث */}
					<div className='sm:col-span-2 relative'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='ابحث عن عميل أو رقم طلب...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
						/>
					</div>

					{/* فلتر نوع القياس */}
					<div className='relative'>
						<select
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value)}
							className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm pr-8'
						>
							<option value='all'>كل أنواع القياس</option>
							<option value='new'>قياس جديد</option>
							<option value='adjustment'>تعديل قياس</option>
							<option value='retake'>إعادة قياس</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر الحالة */}
					<div className='relative'>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm pr-8'
						>
							<option value='all'>كل الحالات</option>
							<option value='scheduled'>مجدول</option>
							<option value='confirmed'>مؤكد</option>
							<option value='completed'>مكتمل</option>
							<option value='cancelled'>ملغي</option>
							<option value='noshow'>لم يحضر</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر التاريخ */}
					<div className='relative'>
						<select
							value={dateFilter}
							onChange={(e) => setDateFilter(e.target.value)}
							className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm pr-8'
						>
							<option value='all'>كل التواريخ</option>
							<option value='today'>اليوم</option>
							<option value='tomorrow'>غداً</option>
							<option value='week'>هذا الأسبوع</option>
							<option value='custom'>تاريخ محدد</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{dateFilter === 'custom' && (
						<div className='sm:col-span-5 flex items-center'>
							<div className='text-sm text-gray-500 ml-2'>اختر تاريخاً محدداً:</div>
							<input
								type='date'
								value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
								onChange={(e) => handleCustomDateFilter(new Date(e.target.value))}
								className='px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
							/>
						</div>
					)}
				</div>

				{/* النتائج والإجراءات */}
				<div className='flex justify-between items-center'>
					<div className='text-sm text-gray-500'>
						عرض <span className='font-medium text-gray-900'>{filteredAppointments.length}</span> من أصل{' '}
						<span className='font-medium text-gray-900'>{appointments.length}</span> موعد قياس
					</div>

					<div className='flex items-center gap-2'>
						<button
							onClick={() => {
								setSearchTerm('');
								setStatusFilter('all');
								setTypeFilter('all');
								setDateFilter('all');
								setSelectedDate(null);
							}}
							className='px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200'
							disabled={
								!searchTerm && statusFilter === 'all' && typeFilter === 'all' && dateFilter === 'all'
							}
						>
							إعادة تعيين
						</button>
						<button className='px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-50 flex items-center'>
							<Filter className='ml-1 h-4 w-4' />
							خيارات متقدمة
						</button>
					</div>
				</div>
			</div>

			{/* قائمة المواعيد */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				{filteredAppointments.length === 0 ? (
					<div className='p-8 text-center'>
						<Scissors className='mx-auto h-12 w-12 text-gray-300' />
						<h3 className='mt-2 text-lg font-medium text-gray-900'>لا توجد مواعيد قياس</h3>
						<p className='mt-1 text-gray-500'>لم يتم العثور على مواعيد قياس مطابقة للفلاتر المحددة.</p>
						<div className='mt-6'>
							<Link
								href='/dashboard/appointments/new?type=measurement'
								className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
							>
								<Plus className='ml-1 -mr-1 h-4 w-4' />
								حجز موعد قياس جديد
							</Link>
						</div>
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
										العميل
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										نوع القياس
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										التاريخ والوقت
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الفرع
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الحالة
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										المسؤول
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										<span className='sr-only'>إجراءات</span>
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{filteredAppointments.map((appointment) => (
									<tr key={appointment.id} className='hover:bg-gray-50'>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
													<User className='h-5 w-5 text-gray-500' />
												</div>
												<div className='mr-4'>
													<div className='text-sm font-medium text-gray-900'>
														{appointment.customerName}
													</div>
													<div className='text-xs text-gray-500'>
														{appointment.customerPhone}
													</div>
												</div>
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{getMeasurementTypeBadge(appointment.measurementType)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>{formatDate(appointment.date)}</div>
											<div className='text-xs text-gray-500'>
												<Clock className='inline-block ml-1 h-3 w-3' />
												{formatTime(appointment.time)} • {formatDuration(appointment.duration)}
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>{appointment.branchName}</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											{getAppointmentStatusBadge(appointment.status)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{appointment.assignedTo ? appointment.assignedTo : '-'}
											</div>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-left text-sm font-medium'>
											<div className='flex items-center justify-end space-x-3 space-x-reverse'>
												<button
													onClick={() => viewAppointmentDetails(appointment)}
													className='text-gray-400 hover:text-gray-500'
													title='عرض التفاصيل'
												>
													<Eye className='h-5 w-5' />
												</button>

												<Link
													href={`/dashboard/appointments/edit/${appointment.id}`}
													className='text-gray-400 hover:text-gray-500'
													title='تعديل'
												>
													<Edit className='h-5 w-5' />
												</Link>

												{appointment.status === 'scheduled' && (
													<button
														className='text-gray-400 hover:text-green-500'
														title='تأكيد'
													>
														<Check className='h-5 w-5' />
													</button>
												)}

												{(appointment.status === 'scheduled' ||
													appointment.status === 'confirmed') && (
													<button className='text-gray-400 hover:text-red-500' title='إلغاء'>
														<X className='h-5 w-5' />
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* نافذة تفاصيل الموعد */}
			{showAppointmentDetails && selectedAppointment && (
				<div className='fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
						<div className='p-6 border-b border-gray-200 flex items-center justify-between'>
							<h2 className='text-xl font-bold text-gray-900 flex items-center'>
								<Scissors className='ml-2 h-6 w-6 text-blue-600' />
								تفاصيل موعد القياس
							</h2>
							<button
								onClick={() => setShowAppointmentDetails(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-6 w-6' />
							</button>
						</div>

						<div className='p-6'>
							<div className='mb-6'>
								<div className='flex justify-between items-start'>
									<div>
										<div className='flex items-center'>
											<span className='text-lg font-medium text-gray-900'>
												موعد قياس{' '}
												{selectedAppointment.orderReference &&
													`للطلب ${selectedAppointment.orderReference}`}
											</span>
										</div>
										<div className='flex items-center mt-1'>
											{getMeasurementTypeBadge(selectedAppointment.measurementType)}
											<span className='mx-2'>•</span>
											{getAppointmentStatusBadge(selectedAppointment.status)}
										</div>
									</div>
								</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
								<div>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>معلومات العميل</h4>
									<div className='bg-gray-50 rounded-lg p-4'>
										<div className='flex items-center mb-3'>
											<div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
												<User className='h-5 w-5 text-gray-500' />
											</div>
											<div className='mr-3'>
												<div className='text-sm font-medium text-gray-900'>
													{selectedAppointment.customerName}
												</div>
												<div className='flex items-center text-xs text-gray-500 mt-1'>
													<Phone className='h-3 w-3 ml-1' />
													{selectedAppointment.customerPhone}
												</div>
											</div>
										</div>

										<div className='mt-3 flex justify-between'>
											<Link
												href={`/dashboard/customers/${selectedAppointment.customerId}`}
												className='text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center'
											>
												عرض ملف العميل
												<ChevronLeft className='mr-1 h-4 w-4' />
											</Link>

											<Link
												href={`tel:${selectedAppointment.customerPhone}`}
												className='text-sm text-gray-600 hover:text-gray-800 flex items-center'
											>
												<Phone className='ml-1 h-4 w-4' />
												اتصال
											</Link>
										</div>
									</div>
								</div>

								<div>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>معلومات الموعد</h4>
									<div className='bg-gray-50 rounded-lg p-4 space-y-3'>
										<div>
											<p className='text-xs text-gray-500'>التاريخ والوقت</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{formatDate(selectedAppointment.date)} •{' '}
												{formatTime(selectedAppointment.time)}
											</p>
										</div>

										<div>
											<p className='text-xs text-gray-500'>المدة</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{formatDuration(selectedAppointment.duration)}
											</p>
										</div>

										<div>
											<p className='text-xs text-gray-500'>الفرع</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{selectedAppointment.branchName}
											</p>
										</div>

										<div>
											<p className='text-xs text-gray-500'>المسؤول</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{selectedAppointment.assignedTo
													? selectedAppointment.assignedTo
													: 'غير محدد'}
											</p>
										</div>
									</div>
								</div>
							</div>

							{selectedAppointment.notes && (
								<div className='mb-6'>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>ملاحظات</h4>
									<div className='bg-gray-50 rounded-lg p-4'>
										<p className='text-sm text-gray-900'>{selectedAppointment.notes}</p>
									</div>
								</div>
							)}

							{selectedAppointment.status === 'scheduled' && (
								<div className='mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start'>
									<AlertCircle className='h-5 w-5 text-yellow-500 ml-2 mt-0.5' />
									<div>
										<p className='text-sm font-medium text-yellow-800'>الموعد بحاجة للتأكيد</p>
										<p className='text-xs text-yellow-700 mt-1'>
											لم يتم تأكيد هذا الموعد بعد. يرجى الاتصال بالعميل لتأكيد الموعد.
										</p>
									</div>
								</div>
							)}

							<div className='flex justify-between'>
								<div>
									<Link
										href={`/dashboard/customers/${selectedAppointment.customerId}/measurements`}
										className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700'
									>
										<Scissors className='ml-1 h-4 w-4' />
										سجل القياسات
									</Link>
								</div>

								<div className='flex space-x-3 space-x-reverse'>
									{selectedAppointment.status === 'scheduled' && (
										<button className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700'>
											<Check className='ml-1 h-4 w-4' />
											تأكيد الموعد
										</button>
									)}

									{(selectedAppointment.status === 'scheduled' ||
										selectedAppointment.status === 'confirmed') && (
										<button className='px-4 py-2 border border-gray-300 text-red-700 rounded-md text-sm font-medium flex items-center hover:bg-red-50'>
											<X className='ml-1 h-4 w-4' />
											إلغاء الموعد
										</button>
									)}

									{(selectedAppointment.status === 'scheduled' ||
										selectedAppointment.status === 'confirmed') && (
										<button className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'>
											<MessageSquare className='ml-1 h-4 w-4' />
											إرسال تذكير
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
