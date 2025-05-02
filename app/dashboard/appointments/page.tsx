'use client';

import {
	AlertCircle,
	ArrowLeft,
	ArrowRight,
	BarChart2,
	Calendar,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock,
	Edit,
	Eye,
	MapPin,
	MessageSquare,
	Package,
	Phone,
	Plus,
	Scissors,
	Search,
	Settings,
	User,
	Users,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Appointment {
	id: string;
	customerId: string;
	customerName: string;
	customerPhone: string;
	type: 'measurement' | 'fitting' | 'delivery' | 'consultation';
	date: string;
	time: string;
	duration: number; // minutes
	branchId: string;
	branchName: string;
	status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'noshow';
	notes: string | null;
	assignedTo: string | null;
	orderReference: string | null;
	createdAt: string;
}

interface CalendarDay {
	date: Date;
	isCurrentMonth: boolean;
	isToday: boolean;
	appointments: Appointment[];
}

interface AppointmentStats {
	today: number;
	upcoming: number;
	completed: number;
	cancelled: number;
	percentOnTime: number;
}

export default function AppointmentsPage() {
	const [loading, setLoading] = useState(true);
	const [appointments, setAppointments] = useState<Appointment[]>([]);
	const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
	const [stats, setStats] = useState<AppointmentStats | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [typeFilter, setTypeFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
	const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
	const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
	const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchAppointmentData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية للمواعيد
			const mockAppointments: Appointment[] = [
				{
					id: 'app-001',
					customerId: 'cust-001',
					customerName: 'محمد أحمد',
					customerPhone: '0501234567',
					type: 'measurement',
					date: '2023-09-25',
					time: '10:00',
					duration: 45,
					branchId: 'branch-001',
					branchName: 'الفرع الرئيسي',
					status: 'scheduled',
					notes: 'قياس جديد لثوب كامل',
					assignedTo: 'خالد محمد',
					orderReference: 'ORD-12345',
					createdAt: '2023-09-20',
				},
				{
					id: 'app-002',
					customerId: 'cust-002',
					customerName: 'أحمد علي',
					customerPhone: '0507654321',
					type: 'fitting',
					date: '2023-09-25',
					time: '11:30',
					duration: 30,
					branchId: 'branch-001',
					branchName: 'الفرع الرئيسي',
					status: 'confirmed',
					notes: 'تجربة الثوب بعد التعديلات',
					assignedTo: 'فهد العتيبي',
					orderReference: 'ORD-12346',
					createdAt: '2023-09-21',
				},
				{
					id: 'app-003',
					customerId: 'cust-003',
					customerName: 'سارة محمد',
					customerPhone: '0551234567',
					type: 'delivery',
					date: '2023-09-26',
					time: '16:00',
					duration: 15,
					branchId: 'branch-002',
					branchName: 'فرع الخبر',
					status: 'scheduled',
					notes: 'تسليم الطلب النهائي',
					assignedTo: null,
					orderReference: 'ORD-12347',
					createdAt: '2023-09-22',
				},
				{
					id: 'app-004',
					customerId: 'cust-004',
					customerName: 'فيصل العتيبي',
					customerPhone: '0561234567',
					type: 'consultation',
					date: '2023-09-24',
					time: '14:00',
					duration: 60,
					branchId: 'branch-001',
					branchName: 'الفرع الرئيسي',
					status: 'completed',
					notes: 'استشارة حول اختيار القماش والتصميم',
					assignedTo: 'عبدالله سعد',
					orderReference: null,
					createdAt: '2023-09-18',
				},
				{
					id: 'app-005',
					customerId: 'cust-005',
					customerName: 'نورة السالم',
					customerPhone: '0531234567',
					type: 'measurement',
					date: '2023-09-27',
					time: '10:30',
					duration: 45,
					branchId: 'branch-002',
					branchName: 'فرع الخبر',
					status: 'scheduled',
					notes: 'قياسات جديدة',
					assignedTo: 'سارة الحمد',
					orderReference: 'ORD-12348',
					createdAt: '2023-09-23',
				},
				{
					id: 'app-006',
					customerId: 'cust-006',
					customerName: 'عبدالله عمر',
					customerPhone: '0541234567',
					type: 'delivery',
					date: '2023-09-23',
					time: '18:00',
					duration: 15,
					branchId: 'branch-001',
					branchName: 'الفرع الرئيسي',
					status: 'cancelled',
					notes: 'تم إلغاء الموعد من قبل العميل',
					assignedTo: null,
					orderReference: 'ORD-12349',
					createdAt: '2023-09-19',
				},
				{
					id: 'app-007',
					customerId: 'cust-007',
					customerName: 'ليلى حسن',
					customerPhone: '0521234567',
					type: 'fitting',
					date: '2023-09-24',
					time: '16:30',
					duration: 30,
					branchId: 'branch-002',
					branchName: 'فرع الخبر',
					status: 'noshow',
					notes: 'لم يحضر العميل للموعد',
					assignedTo: 'فهد العتيبي',
					orderReference: 'ORD-12350',
					createdAt: '2023-09-20',
				},
				{
					id: 'app-008',
					customerId: 'cust-008',
					customerName: 'عمر سعيد',
					customerPhone: '0511234567',
					type: 'measurement',
					date: '2023-09-26',
					time: '09:00',
					duration: 45,
					branchId: 'branch-001',
					branchName: 'الفرع الرئيسي',
					status: 'confirmed',
					notes: 'قياس جديد للثوب',
					assignedTo: 'خالد محمد',
					orderReference: 'ORD-12351',
					createdAt: '2023-09-22',
				},
				{
					id: 'app-009',
					customerId: 'cust-009',
					customerName: 'محمد سالم',
					customerPhone: '0571234567',
					type: 'consultation',
					date: '2023-09-27',
					time: '14:00',
					duration: 60,
					branchId: 'branch-001',
					branchName: 'الفرع الرئيسي',
					status: 'scheduled',
					notes: 'استشارة لاختيار التصميم',
					assignedTo: 'عبدالله سعد',
					orderReference: null,
					createdAt: '2023-09-23',
				},
				{
					id: 'app-010',
					customerId: 'cust-010',
					customerName: 'فاطمة العلي',
					customerPhone: '0581234567',
					type: 'delivery',
					date: '2023-09-28',
					time: '17:00',
					duration: 15,
					branchId: 'branch-002',
					branchName: 'فرع الخبر',
					status: 'scheduled',
					notes: 'تسليم طلب جاهز',
					assignedTo: null,
					orderReference: 'ORD-12352',
					createdAt: '2023-09-24',
				},
			];

			// بيانات تجريبية للإحصائيات
			const mockStats: AppointmentStats = {
				today: 4,
				upcoming: 12,
				completed: 128,
				cancelled: 18,
				percentOnTime: 92,
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

		// تطبيق فلتر النوع
		if (typeFilter !== 'all') {
			filtered = filtered.filter((appointment) => appointment.type === typeFilter);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			filtered = filtered.filter((appointment) => appointment.status === statusFilter);
		}

		// إذا كان عرض التقويم، فلتر حسب اليوم المحدد
		if (viewMode === 'calendar') {
			const dateStr = selectedDate.toISOString().split('T')[0];
			filtered = filtered.filter((appointment) => appointment.date === dateStr);
		}

		// ترتيب حسب التاريخ والوقت
		filtered.sort((a, b) => {
			const dateA = new Date(`${a.date}T${a.time}`);
			const dateB = new Date(`${b.date}T${b.time}`);
			return dateA.getTime() - dateB.getTime();
		});

		setFilteredAppointments(filtered);
	}, [appointments, searchTerm, typeFilter, statusFilter, selectedDate, viewMode]);

	// إنشاء أيام التقويم
	useEffect(() => {
		const generateCalendarDays = () => {
			const year = currentMonth.getFullYear();
			const month = currentMonth.getMonth();

			// الحصول على أول يوم من الشهر
			const firstDayOfMonth = new Date(year, month, 1);
			const firstDayOfWeek = firstDayOfMonth.getDay();

			// تعديل لجعل الأحد هو أول يوم في الأسبوع (0 = الأحد)
			const adjustedFirstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

			// الحصول على عدد أيام الشهر
			const daysInMonth = new Date(year, month + 1, 0).getDate();

			// الحصول على عدد أيام الشهر السابق
			const daysInPreviousMonth = new Date(year, month, 0).getDate();

			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const days: CalendarDay[] = [];

			// إضافة أيام من الشهر السابق
			for (let i = 0; i < adjustedFirstDayOfWeek; i++) {
				const day = daysInPreviousMonth - adjustedFirstDayOfWeek + i + 1;
				const date = new Date(year, month - 1, day);
				days.push({
					date,
					isCurrentMonth: false,
					isToday: date.getTime() === today.getTime(),
					appointments: getAppointmentsForDay(date),
				});
			}

			// إضافة أيام الشهر الحالي
			for (let day = 1; day <= daysInMonth; day++) {
				const date = new Date(year, month, day);
				days.push({
					date,
					isCurrentMonth: true,
					isToday: date.getTime() === today.getTime(),
					appointments: getAppointmentsForDay(date),
				});
			}

			// حساب عدد الأيام المتبقية لإكمال أسبوع (6 صفوف × 7 أيام = 42)
			const remainingDays = 42 - days.length;

			// إضافة أيام من الشهر التالي
			for (let day = 1; day <= remainingDays; day++) {
				const date = new Date(year, month + 1, day);
				days.push({
					date,
					isCurrentMonth: false,
					isToday: date.getTime() === today.getTime(),
					appointments: getAppointmentsForDay(date),
				});
			}

			return days;
		};

		const getAppointmentsForDay = (date: Date) => {
			const dateStr = date.toISOString().split('T')[0];
			return appointments.filter((appointment) => appointment.date === dateStr);
		};

		setCalendarDays(generateCalendarDays());
	}, [appointments, currentMonth]);

	// الحصول على شارة نوع الموعد
	const getAppointmentTypeBadge = (type: string) => {
		switch (type) {
			case 'measurement':
				return <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>قياس</span>;
			case 'fitting':
				return <span className='px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800'>تجربة</span>;
			case 'delivery':
				return <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>تسليم</span>;
			case 'consultation':
				return <span className='px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800'>استشارة</span>;
			default:
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>{type}</span>;
		}
	};

	// الحصول على أيقونة نوع الموعد
	const getAppointmentTypeIcon = (type: string) => {
		switch (type) {
			case 'measurement':
				return <Scissors className='h-4 w-4 text-blue-500' />;
			case 'fitting':
				return <Users className='h-4 w-4 text-purple-500' />;
			case 'delivery':
				return <Package className='h-4 w-4 text-green-500' />;
			case 'consultation':
				return <MessageSquare className='h-4 w-4 text-amber-500' />;
			default:
				return <Calendar className='h-4 w-4 text-gray-500' />;
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

	// الشهر التالي
	const nextMonth = () => {
		setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
	};

	// الشهر السابق
	const prevMonth = () => {
		setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
	};

	// اليوم الحالي
	const goToToday = () => {
		const today = new Date();
		setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
		setSelectedDate(today);
	};

	// تحديد يوم
	const selectDay = (day: CalendarDay) => {
		setSelectedDate(day.date);
	};

	// عرض تفاصيل الموعد
	const viewAppointmentDetails = (appointment: Appointment) => {
		setSelectedAppointment(appointment);
		setShowAppointmentDetails(true);
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
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<Calendar className='inline-block ml-2 h-6 w-6 text-blue-600' />
						جدول المواعيد
					</h1>
					<p className='mt-1 text-sm text-gray-600'>إدارة وتنظيم مواعيد العملاء</p>
				</div>

				<div className='flex gap-2'>
					<Link
						href='/dashboard/appointments/new'
						className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700'
					>
						<Plus className='ml-1 h-4 w-4' />
						حجز موعد جديد
					</Link>

					<Link
						href='/dashboard/reports/appointments'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						التقارير
					</Link>

					<Link
						href='/dashboard/appointments/settings'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Settings className='ml-1 h-4 w-4' />
						الإعدادات
					</Link>
				</div>
			</div>

			{/* ملخص الإحصائيات */}
			{stats && (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>مواعيد اليوم</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>{stats.today}</h3>
								<div className='flex items-center text-xs text-green-600 mt-1'>
									<div className='h-2 w-2 rounded-full bg-green-500 ml-1'></div>
									<span>{stats.percentOnTime}% تم الالتزام بالمواعيد</span>
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
								<p className='text-xs text-gray-500'>المواعيد القادمة</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>{stats.upcoming}</h3>
								<div className='flex items-center text-xs text-gray-500 mt-1'>
									<Clock className='h-3 w-3 ml-1 text-gray-400' />
									<span>خلال الأسبوع القادم</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-green-100'>
								<ArrowRight className='h-6 w-6 text-green-600' />
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>المواعيد المكتملة</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>{stats.completed}</h3>
								<div className='flex items-center text-xs text-gray-500 mt-1'>
									<Check className='h-3 w-3 ml-1 text-green-500' />
									<span>تم إكمال هذه المواعيد بنجاح</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-gray-100'>
								<Check className='h-6 w-6 text-gray-600' />
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>المواعيد الملغاة</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>{stats.cancelled}</h3>
								<div className='flex items-center text-xs text-gray-500 mt-1'>
									<X className='h-3 w-3 ml-1 text-red-500' />
									<span>تم إلغاؤها أو لم يحضر العميل</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-red-100'>
								<X className='h-6 w-6 text-red-600' />
							</div>
						</div>
					</div>
				</div>
			)}

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex items-center justify-between mb-6'>
					<div className='flex items-center'>
						<button
							onClick={() => setViewMode('calendar')}
							className={`px-4 py-2 rounded-r-md text-sm font-medium ${
								viewMode === 'calendar'
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
							}`}
						>
							<Calendar className='h-4 w-4 inline-block ml-1' />
							تقويم
						</button>
						<button
							onClick={() => setViewMode('list')}
							className={`px-4 py-2 rounded-l-md text-sm font-medium ${
								viewMode === 'list'
									? 'bg-blue-600 text-white'
									: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
							}`}
						>
							<ul className='h-4 w-4 inline-block ml-1'>
								<li className='h-1 w-4 bg-current mb-0.5'></li>
								<li className='h-1 w-4 bg-current mb-0.5'></li>
								<li className='h-1 w-4 bg-current'></li>
							</ul>
							قائمة
						</button>
					</div>

					<div className='flex gap-2'>
						<div className='relative'>
							<select
								value={typeFilter}
								onChange={(e) => setTypeFilter(e.target.value)}
								className='appearance-none pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
							>
								<option value='all'>كل الأنواع</option>
								<option value='measurement'>قياس</option>
								<option value='fitting'>تجربة</option>
								<option value='delivery'>تسليم</option>
								<option value='consultation'>استشارة</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>

						<div className='relative'>
							<select
								value={statusFilter}
								onChange={(e) => setStatusFilter(e.target.value)}
								className='appearance-none pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
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

						<div className='relative flex-1 min-w-[200px]'>
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
					</div>
				</div>

				{viewMode === 'calendar' && (
					<div>
						{/* رأس التقويم */}
						<div className='flex items-center justify-between mb-4'>
							<div className='flex items-center'>
								<h2 className='text-lg font-medium text-gray-900'>
									{currentMonth.toLocaleDateString('ar-SA', { month: 'long', year: 'numeric' })}
								</h2>
								<div className='mr-4 flex items-center gap-1'>
									<button
										onClick={prevMonth}
										className='p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100'
									>
										<ChevronRight className='h-5 w-5' />
									</button>
									<button
										onClick={goToToday}
										className='px-3 py-1 rounded-md text-sm text-gray-600 hover:bg-gray-100'
									>
										اليوم
									</button>
									<button
										onClick={nextMonth}
										className='p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100'
									>
										<ChevronLeft className='h-5 w-5' />
									</button>
								</div>
							</div>

							<div className='text-sm text-gray-500'>
								{selectedDate.toLocaleDateString('ar-SA', {
									weekday: 'long',
									year: 'numeric',
									month: 'long',
									day: 'numeric',
								})}
							</div>
						</div>

						{/* جدول التقويم */}
						<div className='overflow-hidden rounded-lg border border-gray-200'>
							{/* أيام الأسبوع */}
							<div className='grid grid-cols-7 bg-gray-50 border-b border-gray-200'>
								{['الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت', 'الأحد'].map(
									(day, i) => (
										<div key={i} className='py-2 text-center text-sm font-medium text-gray-500'>
											{day}
										</div>
									)
								)}
							</div>

							{/* أيام الشهر */}
							<div className='grid grid-cols-7 bg-white'>
								{calendarDays.map((day, dayIdx) => (
									<div
										key={dayIdx}
										className={`min-h-[100px] py-2 px-3 border-b border-l ${
											day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500'
										} ${day.isToday ? 'bg-blue-50' : ''} ${
											day.date.toDateString() === selectedDate.toDateString()
												? 'ring-2 ring-inset ring-blue-500'
												: ''
										} ${dayIdx % 7 === 6 ? 'border-l-0' : ''}`}
										onClick={() => selectDay(day)}
									>
										<div className='flex justify-between'>
											<span
												className={`text-sm ${
													day.isToday
														? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center'
														: ''
												}`}
											>
												{day.date.getDate()}
											</span>
											{day.appointments.length > 0 && (
												<span className='bg-blue-100 text-blue-800 text-xs font-medium px-2 rounded-full'>
													{day.appointments.length}
												</span>
											)}
										</div>
										<div className='mt-2 space-y-1 max-h-[80px] overflow-y-auto'>
											{day.appointments.map((appointment) => (
												<div
													key={appointment.id}
													className={`text-xs py-1 px-2 rounded cursor-pointer ${
														appointment.status === 'cancelled' ||
														appointment.status === 'noshow'
															? 'bg-red-50 border-r-2 border-red-400'
															: appointment.status === 'completed'
															? 'bg-gray-50 border-r-2 border-gray-400'
															: appointment.status === 'confirmed'
															? 'bg-green-50 border-r-2 border-green-400'
															: 'bg-blue-50 border-r-2 border-blue-400'
													}`}
													onClick={(e) => {
														e.stopPropagation();
														viewAppointmentDetails(appointment);
													}}
												>
													<div className='font-medium truncate'>
														{formatTime(appointment.time)}
													</div>
													<div className='truncate'>{appointment.customerName}</div>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>

						{/* قائمة المواعيد المختارة */}
						{filteredAppointments.length > 0 ? (
							<div className='mt-6'>
								<h3 className='text-lg font-medium text-gray-900 mb-3'>
									مواعيد{' '}
									{selectedDate.toLocaleDateString('ar-SA', {
										weekday: 'long',
										day: 'numeric',
										month: 'long',
									})}
								</h3>
								<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
									<div className='space-y-1 p-1'>
										{filteredAppointments.map((appointment) => (
											<div
												key={appointment.id}
												className='flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer'
												onClick={() => viewAppointmentDetails(appointment)}
											>
												<div className='mr-3 w-16 text-sm text-gray-900 font-medium'>
													{formatTime(appointment.time)}
												</div>
												<div className='flex-1'>
													<div className='flex items-center'>
														<div className='font-medium text-gray-900'>
															{appointment.customerName}
														</div>
														<div className='mr-2'>
															{getAppointmentTypeBadge(appointment.type)}
														</div>
														<div className='mr-2'>
															{getAppointmentStatusBadge(appointment.status)}
														</div>
													</div>
													<div className='flex text-xs text-gray-500 mt-1'>
														<div className='flex items-center ml-3'>
															<MapPin className='h-3 w-3 ml-1 text-gray-400' />
															{appointment.branchName}
														</div>
														<div className='flex items-center'>
															<Clock className='h-3 w-3 ml-1 text-gray-400' />
															{formatDuration(appointment.duration)}
														</div>
													</div>
												</div>
												<div className='flex gap-2'>
													{appointment.status === 'scheduled' && (
														<button className='p-1 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded'>
															<Check className='h-5 w-5' />
														</button>
													)}
													<button className='p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded'>
														<Edit className='h-5 w-5' />
													</button>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>
						) : (
							<div className='mt-6 text-center py-10 bg-gray-50 rounded-lg border border-gray-200'>
								<Calendar className='h-12 w-12 text-gray-300 mx-auto' />
								<h3 className='mt-2 text-lg font-medium text-gray-900'>لا توجد مواعيد</h3>
								<p className='mt-1 text-gray-500'>لا توجد مواعيد مجدولة لهذا اليوم</p>
								<div className='mt-6'>
									<Link
										href='/dashboard/appointments/new'
										className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
									>
										<Plus className='ml-1 -mr-1 h-4 w-4' />
										حجز موعد جديد
									</Link>
								</div>
							</div>
						)}
					</div>
				)}

				{viewMode === 'list' && (
					<div>
						{filteredAppointments.length > 0 ? (
							<div className='overflow-x-auto rounded-lg border border-gray-200'>
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
												نوع الموعد
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
													<div className='flex items-center'>
														{getAppointmentTypeIcon(appointment.type)}
														<span className='mr-2'>
															{getAppointmentTypeBadge(appointment.type)}
														</span>
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900'>
														{formatDate(appointment.date)}
													</div>
													<div className='text-xs text-gray-500'>
														<Clock className='inline-block ml-1 h-3 w-3' />
														{formatTime(appointment.time)} •{' '}
														{formatDuration(appointment.duration)}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900'>
														{appointment.branchName}
													</div>
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
															<button
																className='text-gray-400 hover:text-red-500'
																title='إلغاء'
															>
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
						) : (
							<div className='text-center py-10 bg-gray-50 rounded-lg border border-gray-200'>
								<Calendar className='h-12 w-12 text-gray-300 mx-auto' />
								<h3 className='mt-2 text-lg font-medium text-gray-900'>لا توجد مواعيد</h3>
								<p className='mt-1 text-gray-500'>لم يتم العثور على مواعيد مطابقة للفلاتر المحددة</p>
								<div className='mt-6'>
									<Link
										href='/dashboard/appointments/new'
										className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700'
									>
										<Plus className='ml-1 -mr-1 h-4 w-4' />
										حجز موعد جديد
									</Link>
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* نافذة تفاصيل الموعد */}
			{showAppointmentDetails && selectedAppointment && (
				<div className='fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
						<div className='p-6 border-b border-gray-200 flex items-center justify-between'>
							<h2 className='text-xl font-bold text-gray-900 flex items-center'>
								<Calendar className='ml-2 h-6 w-6 text-blue-600' />
								تفاصيل الموعد
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
											{getAppointmentTypeIcon(selectedAppointment.type)}
											<span className='mr-2 text-lg font-medium text-gray-900'>
												موعد{' '}
												{selectedAppointment.type === 'measurement'
													? 'قياس'
													: selectedAppointment.type === 'fitting'
													? 'تجربة'
													: selectedAppointment.type === 'delivery'
													? 'تسليم'
													: 'استشارة'}
											</span>
										</div>
										{selectedAppointment.orderReference && (
											<div className='text-sm text-gray-500 mt-1'>
												رقم الطلب: {selectedAppointment.orderReference}
											</div>
										)}
									</div>
									<div>{getAppointmentStatusBadge(selectedAppointment.status)}</div>
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
												<ArrowLeft className='mr-1 h-4 w-4' />
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

							{selectedAppointment.status === 'noshow' && (
								<div className='mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start'>
									<AlertCircle className='h-5 w-5 text-red-500 ml-2 mt-0.5' />
									<div>
										<p className='text-sm font-medium text-red-800'>العميل لم يحضر</p>
										<p className='text-xs text-red-700 mt-1'>لم يحضر العميل في الموعد المحدد.</p>
									</div>
								</div>
							)}

							<div className='flex justify-between'>
								<div>
									<Link
										href={`/dashboard/appointments/edit/${selectedAppointment.id}`}
										className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-blue-700'
									>
										<Edit className='ml-1 h-4 w-4' />
										تعديل الموعد
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
