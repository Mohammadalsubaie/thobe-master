'use client';

import {
	ArrowLeft,
	Calendar,
	Check,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Clock,
	Info,
	MapPin,
	MessageSquare,
	Package,
	Plus,
	Scissors,
	Search,
	User,
	Users,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Customer {
	id: string;
	name: string;
	phone: string;
	email: string;
}

interface Branch {
	id: string;
	name: string;
	address: string;
}

interface Employee {
	id: string;
	name: string;
	role: string;
	specialization: string[];
	available: boolean;
}

interface TimeSlot {
	time: string;
	available: boolean;
}

export default function NewAppointmentPage() {
	const [loading, setLoading] = useState(false);
	const [customers, setCustomers] = useState<Customer[]>([]);
	const [branches, setBranches] = useState<Branch[]>([]);
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

	const [searchQuery, setSearchQuery] = useState('');
	const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
	const [showCustomerSearch, setShowCustomerSearch] = useState(false);

	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
	const [calendarDays, setCalendarDays] = useState<Date[]>([]);

	// بيانات النموذج
	const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
	const [appointmentType, setAppointmentType] = useState<'measurement' | 'fitting' | 'delivery' | 'consultation'>(
		'measurement'
	);
	const [selectedBranch, setSelectedBranch] = useState<string>('');
	const [selectedEmployee, setSelectedEmployee] = useState<string>('');
	const [selectedTime, setSelectedTime] = useState<string>('');
	const [duration, setDuration] = useState<number>(45);
	const [orderReference, setOrderReference] = useState<string>('');
	const [notes, setNotes] = useState<string>('');
	const [sendReminder, setSendReminder] = useState<boolean>(true);

	const [step, setStep] = useState<1 | 2 | 3>(1);
	const [errors, setErrors] = useState<Record<string, string>>({});

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);

			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 500));

			// بيانات تجريبية للعملاء
			const mockCustomers: Customer[] = [
				{ id: 'cust-001', name: 'محمد أحمد', phone: '0501234567', email: 'mohamed@example.com' },
				{ id: 'cust-002', name: 'أحمد علي', phone: '0507654321', email: 'ahmed@example.com' },
				{ id: 'cust-003', name: 'سارة محمد', phone: '0551234567', email: 'sara@example.com' },
				{ id: 'cust-004', name: 'فيصل العتيبي', phone: '0561234567', email: 'faisal@example.com' },
				{ id: 'cust-005', name: 'نورة السالم', phone: '0531234567', email: 'noura@example.com' },
				{ id: 'cust-006', name: 'عبدالله عمر', phone: '0541234567', email: 'abdullah@example.com' },
				{ id: 'cust-007', name: 'ليلى حسن', phone: '0521234567', email: 'layla@example.com' },
				{ id: 'cust-008', name: 'عمر سعيد', phone: '0511234567', email: 'omar@example.com' },
				{ id: 'cust-009', name: 'محمد سالم', phone: '0571234567', email: 'msalem@example.com' },
				{ id: 'cust-010', name: 'فاطمة العلي', phone: '0581234567', email: 'fatima@example.com' },
			];

			// بيانات تجريبية للفروع
			const mockBranches: Branch[] = [
				{ id: 'branch-001', name: 'الفرع الرئيسي', address: 'الرياض، حي العليا، شارع التخصصي' },
				{ id: 'branch-002', name: 'فرع الخبر', address: 'الخبر، حي الراكة، شارع الأمير فيصل بن فهد' },
			];

			// بيانات تجريبية للموظفين
			const mockEmployees: Employee[] = [
				{
					id: 'emp-001',
					name: 'خالد محمد',
					role: 'فني قياس',
					specialization: ['measurement'],
					available: true,
				},
				{
					id: 'emp-002',
					name: 'فهد العتيبي',
					role: 'فني تجربة وقياس',
					specialization: ['fitting', 'measurement'],
					available: true,
				},
				{
					id: 'emp-003',
					name: 'سارة الحمد',
					role: 'مستشارة',
					specialization: ['consultation', 'measurement'],
					available: false,
				},
				{
					id: 'emp-004',
					name: 'عبدالله سعد',
					role: 'مستشار',
					specialization: ['consultation'],
					available: true,
				},
			];

			// إنشاء المواعيد المتاحة
			const mockTimeSlots = generateTimeSlots();

			setCustomers(mockCustomers);
			setBranches(mockBranches);
			setEmployees(mockEmployees);
			setTimeSlots(mockTimeSlots);
			setFilteredCustomers(mockCustomers);

			setLoading(false);
		};

		fetchData();
	}, []);

	// البحث عن العملاء
	useEffect(() => {
		if (searchQuery) {
			const filtered = customers.filter(
				(customer) =>
					customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					customer.phone.includes(searchQuery) ||
					customer.email.toLowerCase().includes(searchQuery.toLowerCase())
			);
			setFilteredCustomers(filtered);
		} else {
			setFilteredCustomers(customers);
		}
	}, [searchQuery, customers]);

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

			const days: Date[] = [];

			// إضافة أيام من الشهر السابق
			for (let i = 0; i < adjustedFirstDayOfWeek; i++) {
				const day = daysInPreviousMonth - adjustedFirstDayOfWeek + i + 1;
				days.push(new Date(year, month - 1, day));
			}

			// إضافة أيام الشهر الحالي
			for (let day = 1; day <= daysInMonth; day++) {
				days.push(new Date(year, month, day));
			}

			// حساب عدد الأيام المتبقية لإكمال الصفوف
			// عادة نعرض 6 صفوف × 7 أيام = 42 يوم
			const remainingDays = 42 - days.length;

			// إضافة أيام من الشهر التالي
			for (let day = 1; day <= remainingDays; day++) {
				days.push(new Date(year, month + 1, day));
			}

			return days;
		};

		setCalendarDays(generateCalendarDays());
	}, [currentMonth]);

	// إنشاء مواعيد متاحة (محاكاة)
	const generateTimeSlots = () => {
		const slots: TimeSlot[] = [];
		const startHour = 9; // 9 صباحاً
		const endHour = 21; // 9 مساءً

		for (let hour = startHour; hour < endHour; hour++) {
			slots.push({ time: `${hour}:00`, available: Math.random() > 0.3 });
			slots.push({ time: `${hour}:30`, available: Math.random() > 0.3 });
		}

		return slots;
	};

	// تحديث المواعيد المتاحة عند تغيير التاريخ أو الفرع
	useEffect(() => {
		// في تطبيق حقيقي هنا سنقوم بطلب المواعيد المتاحة من الخادم
		// بناء على التاريخ والفرع المحدد
		setTimeSlots(generateTimeSlots());
	}, [selectedDate, selectedBranch]);

	// الحصول على الموظفين المناسبين لنوع الموعد
	const getAvailableEmployees = () => {
		return employees.filter((employee) => employee.specialization.includes(appointmentType) && employee.available);
	};

	// تحديد نوع الموعد
	const handleAppointmentTypeChange = (type: 'measurement' | 'fitting' | 'delivery' | 'consultation') => {
		setAppointmentType(type);

		// إعادة تعيين الموظف إذا كان النوع الجديد غير متوافق مع تخصصه
		const currentEmployee = employees.find((emp) => emp.id === selectedEmployee);
		if (currentEmployee && !currentEmployee.specialization.includes(type)) {
			setSelectedEmployee('');
		}

		// تعيين المدة الافتراضية حسب نوع الموعد
		switch (type) {
			case 'measurement':
				setDuration(45);
				break;
			case 'fitting':
				setDuration(30);
				break;
			case 'delivery':
				setDuration(15);
				break;
			case 'consultation':
				setDuration(60);
				break;
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
	const selectDay = (day: Date) => {
		setSelectedDate(day);
	};

	// التحقق من صحة الخطوة الأولى
	const validateStep1 = () => {
		const errors: Record<string, string> = {};

		if (!selectedCustomer) {
			errors.customer = 'يرجى اختيار عميل';
		}

		if (!appointmentType) {
			errors.appointmentType = 'يرجى اختيار نوع الموعد';
		}

		if (!selectedBranch) {
			errors.branch = 'يرجى اختيار الفرع';
		}

		setErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// التحقق من صحة الخطوة الثانية
	const validateStep2 = () => {
		const errors: Record<string, string> = {};

		if (!selectedDate) {
			errors.date = 'يرجى اختيار تاريخ';
		} else {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const selectedDay = new Date(selectedDate);
			selectedDay.setHours(0, 0, 0, 0);

			if (selectedDay < today) {
				errors.date = 'لا يمكن اختيار تاريخ في الماضي';
			}
		}

		if (!selectedTime) {
			errors.time = 'يرجى اختيار وقت متاح';
		}

		setErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// التحقق من صحة الخطوة الثالثة
	const validateStep3 = () => {
		const errors: Record<string, string> = {};

		// لا يوجد حقول إلزامية في الخطوة الثالثة
		// لكن يمكن إضافة تحقق من رقم الطلب إذا كان نوع الموعد يتطلب ذلك
		if ((appointmentType === 'fitting' || appointmentType === 'delivery') && !orderReference) {
			errors.orderReference = 'يرجى إدخال رقم الطلب لمواعيد التجربة والتسليم';
		}

		setErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// الانتقال للخطوة التالية
	const goToNextStep = () => {
		if (step === 1 && validateStep1()) {
			setStep(2);
		} else if (step === 2 && validateStep2()) {
			setStep(3);
		}
	};

	// الرجوع للخطوة السابقة
	const goToPreviousStep = () => {
		if (step === 2) {
			setStep(1);
		} else if (step === 3) {
			setStep(2);
		}
	};

	// حفظ الموعد
	const saveAppointment = () => {
		if (!validateStep3()) {
			return;
		}

		// محاكاة الحفظ
		setLoading(true);

		setTimeout(() => {
			setLoading(false);
			// في التطبيق الحقيقي سنقوم بإرسال البيانات للخادم
			alert('تم حجز الموعد بنجاح!');
			// ثم الانتقال لصفحة المواعيد أو التفاصيل
			window.location.href = '/dashboard/appointments';
		}, 1000);
	};

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex items-center justify-between'>
				<div className='flex items-center'>
					<Link
						href='/dashboard/appointments'
						className='flex items-center text-gray-500 hover:text-gray-700 ml-4'
					>
						<ArrowLeft className='h-5 w-5' />
						<span className='mr-1 text-sm'>العودة</span>
					</Link>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<Calendar className='inline-block ml-2 h-6 w-6 text-blue-600' />
						حجز موعد جديد
					</h1>
				</div>
			</div>

			{/* خطوات الحجز */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex items-center justify-between mb-8'>
					<div className='flex items-center w-full'>
						<div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
							<div
								className={`flex items-center justify-center w-8 h-8 rounded-full ${
									step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
								}`}
							>
								1
							</div>
							<span className='mr-2 text-sm font-medium'>تحديد العميل</span>
						</div>
						<div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
						<div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
							<div
								className={`flex items-center justify-center w-8 h-8 rounded-full ${
									step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
								}`}
							>
								2
							</div>
							<span className='mr-2 text-sm font-medium'>اختيار الموعد</span>
						</div>
						<div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
						<div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
							<div
								className={`flex items-center justify-center w-8 h-8 rounded-full ${
									step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
								}`}
							>
								3
							</div>
							<span className='mr-2 text-sm font-medium'>تأكيد الحجز</span>
						</div>
					</div>
				</div>

				{/* الخطوة الأولى: تحديد العميل ونوع الموعد */}
				{step === 1 && (
					<div className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<div className='mb-6'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										اختيار العميل <span className='text-red-500'>*</span>
									</label>
									{selectedCustomer ? (
										<div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
											<div className='flex items-center justify-between'>
												<div className='flex items-center'>
													<div className='h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
														<User className='h-6 w-6 text-gray-500' />
													</div>
													<div className='mr-3'>
														<div className='text-sm font-medium text-gray-900'>
															{selectedCustomer.name}
														</div>
														<div className='text-xs text-gray-500'>
															{selectedCustomer.phone}
														</div>
													</div>
												</div>
												<button
													onClick={() => setSelectedCustomer(null)}
													className='text-gray-400 hover:text-gray-500'
												>
													<X className='h-5 w-5' />
												</button>
											</div>
										</div>
									) : (
										<div>
											<div className='relative'>
												<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
													<Search className='h-5 w-5 text-gray-400' />
												</div>
												<input
													type='text'
													value={searchQuery}
													onChange={(e) => {
														setSearchQuery(e.target.value);
														setShowCustomerSearch(true);
													}}
													onClick={() => setShowCustomerSearch(true)}
													placeholder='ابحث باسم العميل أو رقم الهاتف...'
													className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
												/>
											</div>

											{showCustomerSearch && (
												<div className='absolute z-10 mt-1 w-full sm:max-w-md bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden'>
													<div className='max-h-60 overflow-y-auto'>
														{filteredCustomers.length > 0 ? (
															filteredCustomers.map((customer) => (
																<div
																	key={customer.id}
																	className='flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer'
																	onClick={() => {
																		setSelectedCustomer(customer);
																		setShowCustomerSearch(false);
																		setSearchQuery('');
																	}}
																>
																	<div className='flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center'>
																		<User className='h-4 w-4 text-gray-500' />
																	</div>
																	<div className='mr-3'>
																		<div className='text-sm font-medium text-gray-900'>
																			{customer.name}
																		</div>
																		<div className='text-xs text-gray-500'>
																			{customer.phone}
																		</div>
																	</div>
																</div>
															))
														) : (
															<div className='px-4 py-6 text-center text-gray-500'>
																<p>لم يتم العثور على عملاء مطابقين</p>
																<button
																	className='mt-2 text-blue-600 hover:text-blue-800 text-sm'
																	onClick={() => {
																		setShowCustomerSearch(false);
																		// هنا يمكن إضافة انتقال لصفحة إضافة عميل جديد
																	}}
																>
																	إضافة عميل جديد
																</button>
															</div>
														)}
													</div>
													<div className='py-2 px-4 bg-gray-50 border-t border-gray-200'>
														<Link
															href='/dashboard/customers/new?redirect=appointments/new'
															className='flex items-center justify-center text-sm text-blue-600 hover:text-blue-800'
														>
															<Plus className='ml-1 h-4 w-4' />
															إضافة عميل جديد
														</Link>
													</div>
												</div>
											)}

											{errors.customer && (
												<p className='mt-1 text-sm text-red-600'>{errors.customer}</p>
											)}
										</div>
									)}
								</div>

								<div className='mb-6'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										نوع الموعد <span className='text-red-500'>*</span>
									</label>
									<div className='grid grid-cols-2 gap-3'>
										<div
											className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border ${
												appointmentType === 'measurement'
													? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
													: 'border-gray-200 hover:border-blue-500'
											}`}
											onClick={() => handleAppointmentTypeChange('measurement')}
										>
											<Scissors
												className={`h-6 w-6 mb-2 ${
													appointmentType === 'measurement'
														? 'text-blue-500'
														: 'text-gray-400'
												}`}
											/>
											<span
												className={`text-sm font-medium ${
													appointmentType === 'measurement'
														? 'text-blue-700'
														: 'text-gray-700'
												}`}
											>
												قياس
											</span>
										</div>

										<div
											className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border ${
												appointmentType === 'delivery'
													? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
													: 'border-gray-200 hover:border-blue-500'
											}`}
											onClick={() => handleAppointmentTypeChange('delivery')}
										>
											<Package
												className={`h-6 w-6 mb-2 ${
													appointmentType === 'delivery' ? 'text-blue-500' : 'text-gray-400'
												}`}
											/>
											<span
												className={`text-sm font-medium ${
													appointmentType === 'delivery' ? 'text-blue-700' : 'text-gray-700'
												}`}
											>
												تسليم
											</span>
										</div>
									</div>
									{errors.appointmentType && (
										<p className='mt-1 text-sm text-red-600'>{errors.appointmentType}</p>
									)}
								</div>
							</div>

							<div>
								<div className='mb-6'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										اختر الفرع <span className='text-red-500'>*</span>
									</label>
									<div className='space-y-3'>
										{branches.map((branch) => (
											<div
												key={branch.id}
												className={`flex items-center p-3 rounded-lg cursor-pointer border ${
													selectedBranch === branch.id
														? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
														: 'border-gray-200 hover:border-blue-500'
												}`}
												onClick={() => setSelectedBranch(branch.id)}
											>
												<div className='flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-500 ml-3'>
													<MapPin className='h-5 w-5' />
												</div>
												<div>
													<div className='text-sm font-medium text-gray-900'>
														{branch.name}
													</div>
													<div className='text-xs text-gray-500'>{branch.address}</div>
												</div>
												{selectedBranch === branch.id && (
													<div className='mr-auto'>
														<Check className='h-5 w-5 text-blue-500' />
													</div>
												)}
											</div>
										))}
									</div>
									{errors.branch && <p className='mt-1 text-sm text-red-600'>{errors.branch}</p>}
								</div>

								<div className='mb-6'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>
										اختر الموظف (اختياري)
									</label>
									<div className='relative'>
										<select
											value={selectedEmployee}
											onChange={(e) => setSelectedEmployee(e.target.value)}
											className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm pr-8'
										>
											<option value=''>اختر الموظف...</option>
											{getAvailableEmployees().map((employee) => (
												<option key={employee.id} value={employee.id}>
													{employee.name} - {employee.role}
												</option>
											))}
										</select>
										<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
											<ChevronDown className='h-4 w-4 text-gray-400' />
										</div>
									</div>
									<p className='mt-1 text-xs text-gray-500'>
										* يتم عرض الموظفين المتاحين حسب نوع الموعد
									</p>
								</div>
							</div>
						</div>

						<div className='flex justify-end'>
							<button
								onClick={goToNextStep}
								className='px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700'
							>
								التالي
							</button>
						</div>
					</div>
				)}

				{/* الخطوة الثانية: اختيار التاريخ والوقت */}
				{step === 2 && (
					<div className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<h3 className='text-lg font-medium text-gray-900 mb-4'>اختيار التاريخ</h3>
								<div className='mb-4'>
									<div className='flex items-center justify-between mb-4'>
										<div className='flex items-center'>
											<h2 className='text-base font-medium text-gray-900'>
												{currentMonth.toLocaleDateString('ar-SA', {
													month: 'long',
													year: 'numeric',
												})}
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
									</div>

									{/* التقويم */}
									<div className='overflow-hidden rounded-lg border border-gray-200'>
										<div className='grid grid-cols-7 bg-gray-50 border-b border-gray-200'>
											{[
												'الإثنين',
												'الثلاثاء',
												'الأربعاء',
												'الخميس',
												'الجمعة',
												'السبت',
												'الأحد',
											].map((day, i) => (
												<div
													key={i}
													className='py-2 text-center text-xs font-medium text-gray-500'
												>
													{day}
												</div>
											))}
										</div>
										<div className='grid grid-cols-7 bg-white'>
											{calendarDays.map((day, dayIdx) => {
												const isToday = new Date().toDateString() === day.toDateString();
												const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
												const isSelected =
													selectedDate && day.toDateString() === selectedDate.toDateString();
												const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

												return (
													<div
														key={dayIdx}
														className={`h-14 py-2 px-3 border-b border-l ${
															isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
														} ${isToday ? 'bg-blue-50' : ''} ${
															isSelected ? 'ring-2 ring-inset ring-blue-500' : ''
														} ${
															isPast && isCurrentMonth ? 'bg-gray-100 text-gray-400' : ''
														} ${dayIdx % 7 === 6 ? 'border-l-0' : ''}`}
														onClick={() => !isPast && selectDay(day)}
													>
														<div className='flex justify-center'>
															<span
																className={`text-sm inline-flex items-center justify-center w-7 h-7 rounded-full ${
																	isToday ? 'bg-blue-600 text-white' : ''
																} ${isPast && isCurrentMonth ? 'text-gray-400' : ''} ${
																	!isCurrentMonth ? 'text-gray-400' : ''
																} ${isPast ? 'cursor-not-allowed' : 'cursor-pointer'}`}
															>
																{day.getDate()}
															</span>
														</div>
													</div>
												);
											})}
										</div>
									</div>

									{errors.date && <p className='mt-2 text-sm text-red-600'>{errors.date}</p>}

									<div className='mt-4 flex items-center justify-between text-sm'>
										<div className='flex items-center'>
											<div className='h-3 w-3 bg-blue-600 rounded-full ml-1'></div>
											<span>اليوم</span>
										</div>
										<div className='flex items-center'>
											<div className='h-3 w-3 bg-gray-100 rounded-full ml-1'></div>
											<span>غير متاح</span>
										</div>
									</div>
								</div>
							</div>

							<div>
								<h3 className='text-lg font-medium text-gray-900 mb-4'>اختيار الوقت</h3>

								{selectedDate ? (
									<>
										<div className='mb-4'>
											<p className='text-sm font-medium text-gray-700 mb-2'>
												المواعيد المتاحة في{' '}
												{selectedDate.toLocaleDateString('ar-SA', {
													weekday: 'long',
													day: 'numeric',
													month: 'long',
												})}
											</p>
											<div className='grid grid-cols-2 sm:grid-cols-3 gap-3'>
												{timeSlots.map((slot, index) => (
													<div
														key={index}
														className={`py-2 px-3 rounded-md text-center text-sm cursor-pointer ${
															!slot.available
																? 'bg-gray-100 text-gray-400 cursor-not-allowed'
																: selectedTime === slot.time
																? 'bg-blue-100 text-blue-700 border border-blue-500'
																: 'bg-gray-50 text-gray-700 border border-gray-200 hover:border-blue-500'
														}`}
														onClick={() => slot.available && setSelectedTime(slot.time)}
													>
														{slot.time}
													</div>
												))}
											</div>

											{errors.time && <p className='mt-2 text-sm text-red-600'>{errors.time}</p>}
										</div>

										<div className='mt-6'>
											<label className='block text-sm font-medium text-gray-700 mb-2'>
												مدة الموعد
											</label>
											<div className='relative'>
												<select
													value={duration}
													onChange={(e) => setDuration(parseInt(e.target.value))}
													className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm pr-8'
												>
													<option value='15'>15 دقيقة</option>
													<option value='30'>30 دقيقة</option>
													<option value='45'>45 دقيقة</option>
													<option value='60'>ساعة واحدة</option>
													<option value='90'>ساعة ونصف</option>
													<option value='120'>ساعتان</option>
												</select>
												<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
													<ChevronDown className='h-4 w-4 text-gray-400' />
												</div>
											</div>
											<p className='mt-1 text-xs text-gray-500'>
												* المدة المقترحة لنوع الموعد المحدد
											</p>
										</div>
									</>
								) : (
									<div className='bg-gray-50 rounded-lg p-8 text-center border border-gray-200'>
										<Calendar className='mx-auto h-10 w-10 text-gray-400 mb-2' />
										<p className='text-gray-500'>يرجى اختيار تاريخ أولاً</p>
									</div>
								)}
							</div>
						</div>

						<div className='flex justify-between'>
							<button
								onClick={goToPreviousStep}
								className='px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50'
							>
								السابق
							</button>
							<button
								onClick={goToNextStep}
								className='px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700'
							>
								التالي
							</button>
						</div>
					</div>
				)}

				{/* الخطوة الثالثة: تفاصيل إضافية وتأكيد الحجز */}
				{step === 3 && (
					<div className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<h3 className='text-lg font-medium text-gray-900 mb-4'>تفاصيل إضافية</h3>

								{(appointmentType === 'fitting' || appointmentType === 'delivery') && (
									<div className='mb-4'>
										<label className='block text-sm font-medium text-gray-700 mb-2'>
											رقم الطلب{' '}
											{(appointmentType === 'fitting' || appointmentType === 'delivery') && (
												<span className='text-red-500'>*</span>
											)}
										</label>
										<input
											type='text'
											value={orderReference}
											onChange={(e) => setOrderReference(e.target.value)}
											placeholder='أدخل رقم الطلب المرتبط بالموعد'
											className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
										/>
										{errors.orderReference && (
											<p className='mt-1 text-sm text-red-600'>{errors.orderReference}</p>
										)}
									</div>
								)}

								<div className='mb-4'>
									<label className='block text-sm font-medium text-gray-700 mb-2'>ملاحظات</label>
									<textarea
										value={notes}
										onChange={(e) => setNotes(e.target.value)}
										placeholder='أي ملاحظات إضافية حول الموعد...'
										rows={4}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
									></textarea>
								</div>

								<div className='flex items-center mb-4'>
									<input
										type='checkbox'
										checked={sendReminder}
										onChange={(e) => setSendReminder(e.target.checked)}
										id='sendReminder'
										className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ml-2'
									/>
									<label htmlFor='sendReminder' className='text-sm text-gray-700'>
										إرسال تذكير للعميل قبل الموعد بـ 24 ساعة
									</label>
								</div>
							</div>

							<div>
								<h3 className='text-lg font-medium text-gray-900 mb-4'>ملخص الموعد</h3>
								<div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
									<div className='space-y-4'>
										<div>
											<div className='text-sm text-gray-500 mb-1'>العميل</div>
											<div className='flex items-center'>
												<User className='h-5 w-5 text-gray-400 ml-1.5' />
												<span className='text-sm font-medium text-gray-900'>
													{selectedCustomer?.name}
												</span>
											</div>
										</div>

										<div className='flex justify-between'>
											<div>
												<div className='text-sm text-gray-500 mb-1'>نوع الموعد</div>
												<div className='flex items-center'>
													{appointmentType === 'measurement' && (
														<Scissors className='h-5 w-5 text-blue-500 ml-1.5' />
													)}
													{appointmentType === 'fitting' && (
														<Users className='h-5 w-5 text-purple-500 ml-1.5' />
													)}
													{appointmentType === 'delivery' && (
														<Package className='h-5 w-5 text-green-500 ml-1.5' />
													)}
													{appointmentType === 'consultation' && (
														<MessageSquare className='h-5 w-5 text-amber-500 ml-1.5' />
													)}
													<span className='text-sm font-medium text-gray-900'>
														{appointmentType === 'measurement' ? 'قياس' : 'تسليم'}
													</span>
												</div>
											</div>

											<div>
												<div className='text-sm text-gray-500 mb-1'>المدة</div>
												<div className='text-sm font-medium text-gray-900'>
													{duration} دقيقة
												</div>
											</div>
										</div>

										<div className='flex justify-between'>
											<div>
												<div className='text-sm text-gray-500 mb-1'>التاريخ</div>
												<div className='flex items-center'>
													<Calendar className='h-5 w-5 text-gray-400 ml-1.5' />
													<span className='text-sm font-medium text-gray-900'>
														{selectedDate.toLocaleDateString('ar-SA', {
															weekday: 'long',
															day: 'numeric',
															month: 'long',
														})}
													</span>
												</div>
											</div>

											<div>
												<div className='text-sm text-gray-500 mb-1'>الوقت</div>
												<div className='flex items-center'>
													<Clock className='h-5 w-5 text-gray-400 ml-1.5' />
													<span className='text-sm font-medium text-gray-900'>
														{selectedTime}
													</span>
												</div>
											</div>
										</div>

										<div>
											<div className='text-sm text-gray-500 mb-1'>الفرع</div>
											<div className='flex items-center'>
												<MapPin className='h-5 w-5 text-gray-400 ml-1.5' />
												<span className='text-sm font-medium text-gray-900'>
													{branches.find((b) => b.id === selectedBranch)?.name}
												</span>
											</div>
										</div>

										{selectedEmployee && (
											<div>
												<div className='text-sm text-gray-500 mb-1'>الموظف المسؤول</div>
												<div className='text-sm font-medium text-gray-900'>
													{employees.find((e) => e.id === selectedEmployee)?.name}
												</div>
											</div>
										)}
									</div>
								</div>

								<div className='mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200 flex items-start'>
									<Info className='h-5 w-5 text-blue-500 ml-2 mt-0.5' />
									<div>
										<p className='text-sm font-medium text-blue-800'>سيتم تأكيد الموعد</p>
										<p className='text-xs text-blue-700 mt-1'>
											سيتم إرسال تأكيد للموعد للعميل عبر الرسائل النصية والبريد الإلكتروني.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className='flex justify-between'>
							<button
								onClick={goToPreviousStep}
								className='px-6 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50'
							>
								السابق
							</button>
							<button
								onClick={saveAppointment}
								disabled={loading}
								className='px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center disabled:opacity-70 disabled:cursor-not-allowed'
							>
								{loading && (
									<svg
										className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
									>
										<circle
											className='opacity-25'
											cx='12'
											cy='12'
											r='10'
											stroke='currentColor'
											strokeWidth='4'
										></circle>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
										></path>
									</svg>
								)}
								تأكيد الحجز
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
