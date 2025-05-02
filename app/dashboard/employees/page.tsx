'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
	Users,
	User,
	UserPlus,
	Search,
	Filter,
	Edit,
	Trash,
	CheckCircle,
	XCircle,
	AlertCircle,
	Phone,
	Eye,
	Mail,
	Calendar,
	Clock,
	ChevronDown,
	Download,
	Briefcase,
	Star,
	FileText,
	UserCheck,
	X,
	Save,
	Building,
	ArrowUpRight,
} from 'lucide-react';

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
	performanceRating?: number;
	salary?: number;
	skills?: string[];
	directManager?: {
		id: number;
		name: string;
	};
}

export default function EmployeesPage() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [showFilters, setShowFilters] = useState(false);
	const [showAddForm, setShowAddForm] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [employeeToDelete, setEmployeeToDelete] = useState<number | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

	// فلاتر البحث
	const [filters, setFilters] = useState({
		department: 'all',
		status: 'all',
		branch: 'all',
		sortBy: 'name',
		sortOrder: 'asc' as 'asc' | 'desc',
	});

	// حقول نموذج إضافة موظف جديد
	const [newEmployee, setNewEmployee] = useState({
		name: '',
		employeeId: '',
		position: '',
		department: 'الإدارة',
		branchId: 1,
		phone: '',
		email: '',
		hireDate: new Date().toISOString().split('T')[0],
		nationality: 'سعودي',
		idNumber: '',
		gender: 'male' as 'male' | 'female',
	});

	// تحميل بيانات الموظفين
	useEffect(() => {
		const fetchEmployees = async () => {
			setLoading(true);
			try {
				// محاكاة لتحميل البيانات من API
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// بيانات تجريبية للموظفين
				const mockEmployees: Employee[] = [
					{
						id: 101,
						name: 'أحمد العمري',
						employeeId: 'EMP-1001',
						position: 'مدير فرع',
						department: 'الإدارة',
						branch: {
							id: 1,
							name: 'فرع الرياض الرئيسي',
						},
						phone: '966512345678',
						email: 'ahmed@example.com',
						hireDate: '2020-03-15',
						status: 'active',
						photo: '/images/employees/ahmed.jpg',
						gender: 'male',
						nationality: 'سعودي',
						idNumber: '1234567890',
						performanceRating: 4.8,
						skills: ['إدارة', 'تخطيط', 'مبيعات'],
					},
					{
						id: 102,
						name: 'محمد القحطاني',
						employeeId: 'EMP-1002',
						position: 'مسؤول المبيعات',
						department: 'المبيعات',
						branch: {
							id: 1,
							name: 'فرع الرياض الرئيسي',
						},
						phone: '966512345679',
						email: 'mohamed@example.com',
						hireDate: '2020-04-01',
						status: 'active',
						photo: '/images/employees/mohamed.jpg',
						gender: 'male',
						nationality: 'سعودي',
						idNumber: '1234567891',
						performanceRating: 4.6,
						directManager: {
							id: 101,
							name: 'أحمد العمري',
						},
					},
					{
						id: 103,
						name: 'عبدالله الشمري',
						employeeId: 'EMP-1003',
						position: 'كاشير',
						department: 'المبيعات',
						branch: {
							id: 1,
							name: 'فرع الرياض الرئيسي',
						},
						phone: '966512345680',
						email: 'abdullah@example.com',
						hireDate: '2021-01-15',
						status: 'active',
						gender: 'male',
						nationality: 'سعودي',
						idNumber: '1234567892',
						performanceRating: 4.3,
						directManager: {
							id: 102,
							name: 'محمد القحطاني',
						},
					},
					{
						id: 104,
						name: 'خالد العتيبي',
						employeeId: 'EMP-1004',
						position: 'خياط',
						department: 'الإنتاج',
						branch: {
							id: 1,
							name: 'فرع الرياض الرئيسي',
						},
						phone: '966512345681',
						email: 'khaled@example.com',
						hireDate: '2020-05-10',
						status: 'active',
						gender: 'male',
						nationality: 'سعودي',
						idNumber: '1234567893',
						performanceRating: 4.9,
					},
					{
						id: 105,
						name: 'فهد السبيعي',
						employeeId: 'EMP-1005',
						position: 'خياط',
						department: 'الإنتاج',
						branch: {
							id: 1,
							name: 'فرع الرياض الرئيسي',
						},
						phone: '966512345682',
						email: 'fahad@example.com',
						hireDate: '2020-06-01',
						status: 'vacation',
						gender: 'male',
						nationality: 'سعودي',
						idNumber: '1234567894',
						performanceRating: 4.7,
					},
					{
						id: 106,
						name: 'سارة المطيري',
						employeeId: 'EMP-1006',
						position: 'مسؤولة خدمة العملاء',
						department: 'خدمة العملاء',
						branch: {
							id: 1,
							name: 'فرع الرياض الرئيسي',
						},
						phone: '966512345683',
						email: 'sarah@example.com',
						hireDate: '2021-03-01',
						status: 'active',
						photo: '/images/employees/sarah.jpg',
						gender: 'female',
						nationality: 'سعودية',
						idNumber: '1234567895',
						performanceRating: 4.8,
					},
					{
						id: 107,
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
						performanceRating: 4.5,
					},
					{
						id: 108,
						name: 'عمر المالكي',
						employeeId: 'EMP-2001',
						position: 'مدير فرع',
						department: 'الإدارة',
						branch: {
							id: 2,
							name: 'فرع جدة',
						},
						phone: '966512345685',
						email: 'omar@example.com',
						hireDate: '2020-07-10',
						status: 'active',
						gender: 'male',
						nationality: 'سعودي',
						idNumber: '1234567897',
						performanceRating: 4.6,
					},
					{
						id: 109,
						name: 'ماجد الدوسري',
						employeeId: 'EMP-2002',
						position: 'مسؤول المبيعات',
						department: 'المبيعات',
						branch: {
							id: 2,
							name: 'فرع جدة',
						},
						phone: '966512345686',
						email: 'majed@example.com',
						hireDate: '2020-08-15',
						status: 'sick',
						gender: 'male',
						nationality: 'سعودي',
						idNumber: '1234567898',
						performanceRating: 4.2,
					},
					{
						id: 110,
						name: 'هدى الزهراني',
						employeeId: 'EMP-2003',
						position: 'مسؤولة خدمة العملاء',
						department: 'خدمة العملاء',
						branch: {
							id: 2,
							name: 'فرع جدة',
						},
						phone: '966512345687',
						email: 'huda@example.com',
						hireDate: '2021-04-20',
						status: 'active',
						gender: 'female',
						nationality: 'سعودية',
						idNumber: '1234567899',
						performanceRating: 4.4,
					},
				];

				setEmployees(mockEmployees);
				setFilteredEmployees(mockEmployees);
			} catch (error) {
				console.error('Error fetching employees:', error);
				setNotification({
					message: 'حدث خطأ أثناء تحميل بيانات الموظفين',
					type: 'error',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchEmployees();
	}, []);

	// تطبيق الفلاتر والبحث
	useEffect(() => {
		let result = [...employees];

		// تطبيق البحث
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(employee) =>
					employee.name.toLowerCase().includes(query) ||
					employee.employeeId.toLowerCase().includes(query) ||
					employee.position.toLowerCase().includes(query) ||
					employee.email.toLowerCase().includes(query) ||
					employee.phone.includes(query)
			);
		}

		// تطبيق فلتر القسم
		if (filters.department !== 'all') {
			result = result.filter((employee) => employee.department === filters.department);
		}

		// تطبيق فلتر الحالة
		if (filters.status !== 'all') {
			result = result.filter((employee) => employee.status === filters.status);
		}

		// تطبيق فلتر الفرع
		if (filters.branch !== 'all') {
			result = result.filter((employee) => employee.branch.id.toString() === filters.branch);
		}

		// تطبيق الترتيب
		result = sortEmployees(result, filters.sortBy, filters.sortOrder);

		setFilteredEmployees(result);
	}, [employees, searchQuery, filters]);

	// دالة الترتيب
	const sortEmployees = (employees: Employee[], sortBy: string, sortOrder: 'asc' | 'desc') => {
		return [...employees].sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case 'name':
					comparison = a.name.localeCompare(b.name);
					break;
				case 'position':
					comparison = a.position.localeCompare(b.position);
					break;
				case 'department':
					comparison = a.department.localeCompare(b.department);
					break;
				case 'hireDate':
					comparison = new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime();
					break;
				case 'rating':
					comparison = (a.performanceRating || 0) - (b.performanceRating || 0);
					break;
				default:
					comparison = a.name.localeCompare(b.name);
			}

			return sortOrder === 'asc' ? comparison : -comparison;
		});
	};

	// استخراج قائمة الأقسام الفريدة
	const getDepartments = () => {
		const departments = Array.from(new Set(employees.map((emp) => emp.department)));
		return departments.sort();
	};

	// استخراج قائمة الفروع الفريدة
	const getBranches = () => {
		const branches = Array.from(new Set(employees.map((emp) => emp.branch.id)));
		return branches
			.map((branchId) => {
				const branch = employees.find((emp) => emp.branch.id === branchId)?.branch;
				return branch ? { id: branch.id, name: branch.name } : null;
			})
			.filter(Boolean);
	};

	// إعادة ضبط الفلاتر
	const resetFilters = () => {
		setFilters({
			department: 'all',
			status: 'all',
			branch: 'all',
			sortBy: 'name',
			sortOrder: 'asc',
		});
		setSearchQuery('');
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
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// حساب إحصائيات الموظفين
	const getEmployeesStats = () => {
		const totalEmployees = employees.length;
		const activeEmployees = employees.filter((emp) => emp.status === 'active').length;
		const onLeaveEmployees = employees.filter(
			(emp) => emp.status === 'vacation' || emp.status === 'sick' || emp.status === 'leave'
		).length;
		const avgRating =
			employees.reduce((sum, emp) => sum + (emp.performanceRating || 0), 0) / Math.max(1, employees.length);

		return {
			totalEmployees,
			activeEmployees,
			onLeaveEmployees,
			avgRating,
		};
	};

	// إضافة موظف جديد
	const handleAddEmployee = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// محاكاة لطلب API
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// إنشاء موظف جديد
			const branch = {
				id: newEmployee.branchId,
				name: getBranches().find((b) => b?.id === newEmployee.branchId)?.name || 'غير معروف',
			};

			const newEmployeeData: Employee = {
				id: employees.length + 1001,
				name: newEmployee.name,
				employeeId: newEmployee.employeeId || `EMP-${Math.floor(Math.random() * 10000)}`,
				position: newEmployee.position,
				department: newEmployee.department,
				branch: branch,
				phone: newEmployee.phone,
				email: newEmployee.email,
				hireDate: newEmployee.hireDate,
				status: 'active',
				gender: newEmployee.gender,
				nationality: newEmployee.nationality,
				idNumber: newEmployee.idNumber,
				performanceRating: 0,
			};

			// إضافة الموظف للقائمة
			setEmployees([...employees, newEmployeeData]);

			// إعادة تعيين نموذج الإضافة
			setNewEmployee({
				name: '',
				employeeId: '',
				position: '',
				department: 'الإدارة',
				branchId: 1,
				phone: '',
				email: '',
				hireDate: new Date().toISOString().split('T')[0],
				nationality: 'سعودي',
				idNumber: '',
				gender: 'male',
			});

			// إخفاء النموذج
			setShowAddForm(false);

			// إظهار رسالة نجاح
			setNotification({
				message: 'تم إضافة الموظف بنجاح',
				type: 'success',
			});

			// إزالة الإشعار بعد 3 ثوان
			setTimeout(() => {
				setNotification(null);
			}, 3000);
		} catch (error) {
			console.error('Error adding employee:', error);
			setNotification({
				message: 'حدث خطأ أثناء إضافة الموظف',
				type: 'error',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// حذف موظف
	const handleDeleteEmployee = async () => {
		if (employeeToDelete === null) return;

		setIsSubmitting(true);
		try {
			// محاكاة لطلب API
			await new Promise((resolve) => setTimeout(resolve, 800));

			// حذف الموظف من القائمة
			setEmployees(employees.filter((emp) => emp.id !== employeeToDelete));

			// إغلاق النافذة
			setShowDeleteModal(false);
			setEmployeeToDelete(null);

			// إظهار رسالة نجاح
			setNotification({
				message: 'تم حذف الموظف بنجاح',
				type: 'success',
			});

			// إزالة الإشعار بعد 3 ثوان
			setTimeout(() => {
				setNotification(null);
			}, 3000);
		} catch (error) {
			console.error('Error deleting employee:', error);
			setNotification({
				message: 'حدث خطأ أثناء حذف الموظف',
				type: 'error',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// الإحصائيات
	const stats = getEmployeesStats();

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<Users className='ml-2 h-6 w-6 text-gray-600' /> إدارة الموظفين
					</h1>
					<p className='mt-1 text-sm text-gray-600'>عرض وإدارة جميع الموظفين في المؤسسة</p>
				</div>

				<div className='flex space-x-2 space-x-reverse'>
					<button
						type='button'
						onClick={() => setShowFilters(!showFilters)}
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'
					>
						<Filter className='ml-1.5 -mr-0.5 h-4 w-4' />
						فلترة
						{(filters.department !== 'all' || filters.status !== 'all' || filters.branch !== 'all') && (
							<span className='inline-flex items-center justify-center w-4 h-4 mr-1 text-xs font-bold text-white bg-green-500 rounded-full'>
								{(filters.department !== 'all' ? 1 : 0) +
									(filters.status !== 'all' ? 1 : 0) +
									(filters.branch !== 'all' ? 1 : 0)}
							</span>
						)}
					</button>

					<Link
						href='/dashboard/employees/reports'
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'
					>
						<FileText className='ml-1.5 -mr-0.5 h-4 w-4' />
						التقارير
					</Link>

					<button
						type='button'
						onClick={() => setShowAddForm(true)}
						className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center'
					>
						<UserPlus className='ml-1.5 -mr-0.5 h-4 w-4' />
						إضافة موظف
					</button>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
					<div className='p-4 flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-500'>إجمالي الموظفين</p>
							<p className='mt-1 text-2xl font-bold text-gray-900'>{stats.totalEmployees}</p>
						</div>
						<div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center'>
							<Users className='h-6 w-6 text-blue-600' />
						</div>
					</div>
					<div className='bg-blue-50 px-4 py-2 text-xs text-blue-700 flex justify-between'>
						<span>الموظفين المسجلين</span>
						<Link href='/dashboard/employees/reports' className='flex items-center'>
							<span>عرض التفاصيل</span>
							<ChevronDown className='h-3 w-3 mr-1' />
						</Link>
					</div>
				</div>

				<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
					<div className='p-4 flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-500'>الموظفين النشطين</p>
							<p className='mt-1 text-2xl font-bold text-gray-900'>{stats.activeEmployees}</p>
						</div>
						<div className='h-12 w-12 bg-green-100 rounded-full flex items-center justify-center'>
							<UserCheck className='h-6 w-6 text-green-600' />
						</div>
					</div>
					<div className='bg-green-50 px-4 py-2 text-xs text-green-700 flex justify-between'>
						<span>
							{Math.round((stats.activeEmployees / Math.max(1, stats.totalEmployees)) * 100)}% من الموظفين
						</span>
						<span className='flex items-center'>
							<ArrowUpRight className='h-3 w-3 ml-1' />
							2.1%
						</span>
					</div>
				</div>

				<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
					<div className='p-4 flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-500'>في إجازة</p>
							<p className='mt-1 text-2xl font-bold text-gray-900'>{stats.onLeaveEmployees}</p>
						</div>
						<div className='h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center'>
							<Clock className='h-6 w-6 text-amber-600' />
						</div>
					</div>
					<div className='bg-amber-50 px-4 py-2 text-xs text-amber-700 flex justify-between'>
						<span>موظفين في إجازات مختلفة</span>
						<span>
							{Math.round((stats.onLeaveEmployees / Math.max(1, stats.totalEmployees)) * 100)}% من
							الموظفين
						</span>
					</div>
				</div>

				<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
					<div className='p-4 flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-500'>متوسط التقييم</p>
							<p className='mt-1 text-2xl font-bold text-gray-900 flex items-center'>
								{stats.avgRating.toFixed(1)}
								<Star className='h-5 w-5 mr-1 text-amber-400 fill-current' />
							</p>
						</div>
						<div className='h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center'>
							<Star className='h-6 w-6 text-purple-600' />
						</div>
					</div>
					<div className='bg-purple-50 px-4 py-2 text-xs text-purple-700 flex justify-between'>
						<span>تقييم الأداء</span>
						<Link href='/dashboard/employees/performance' className='flex items-center'>
							<span>تفاصيل الأداء</span>
							<ChevronDown className='h-3 w-3 mr-1' />
						</Link>
					</div>
				</div>
			</div>

			{/* Filters area */}
			{showFilters && (
				<div className='bg-white rounded-lg border border-gray-200 p-4'>
					<div className='flex justify-between items-center mb-4'>
						<h3 className='text-sm font-medium text-gray-700'>فلترة وترتيب الموظفين</h3>
						<button onClick={resetFilters} className='text-sm text-blue-600 hover:text-blue-800'>
							إعادة ضبط
						</button>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
						<div>
							<label htmlFor='department-filter' className='block text-xs font-medium text-gray-700 mb-1'>
								القسم
							</label>
							<select
								id='department-filter'
								value={filters.department}
								onChange={(e) => setFilters({ ...filters, department: e.target.value })}
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
							>
								<option value='all'>جميع الأقسام</option>
								{getDepartments().map((department) => (
									<option key={department} value={department}>
										{department}
									</option>
								))}
							</select>
						</div>

						<div>
							<label htmlFor='status-filter' className='block text-xs font-medium text-gray-700 mb-1'>
								الحالة
							</label>
							<select
								id='status-filter'
								value={filters.status}
								onChange={(e) => setFilters({ ...filters, status: e.target.value })}
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
							>
								<option value='all'>جميع الحالات</option>
								<option value='active'>نشط</option>
								<option value='vacation'>إجازة</option>
								<option value='sick'>مرضي</option>
								<option value='leave'>غائب</option>
								<option value='terminated'>منتهي</option>
							</select>
						</div>

						<div>
							<label htmlFor='branch-filter' className='block text-xs font-medium text-gray-700 mb-1'>
								الفرع
							</label>
							<select
								id='branch-filter'
								value={filters.branch}
								onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
							>
								<option value='all'>جميع الفروع</option>
								{getBranches().map(
									(branch) =>
										branch && (
											<option key={branch.id} value={branch.id.toString()}>
												{branch.name}
											</option>
										)
								)}
							</select>
						</div>

						<div>
							<label htmlFor='sort-by' className='block text-xs font-medium text-gray-700 mb-1'>
								ترتيب حسب
							</label>
							<div className='flex'>
								<select
									id='sort-by'
									value={filters.sortBy}
									onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
									className='block w-full rounded-l-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
								>
									<option value='name'>الاسم</option>
									<option value='position'>المنصب</option>
									<option value='department'>القسم</option>
									<option value='hireDate'>تاريخ التعيين</option>
									<option value='rating'>التقييم</option>
								</select>
								<button
									type='button'
									onClick={() =>
										setFilters({
											...filters,
											sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
										})
									}
									className='inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none'
								>
									{filters.sortOrder === 'asc' ? 'تصاعدي' : 'تنازلي'}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Search and employees list */}
			<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
				<div className='p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0'>
					<div>
						<h2 className='text-sm font-medium text-gray-700'>قائمة الموظفين</h2>
						<p className='text-xs text-gray-500 mt-1'>
							عرض {filteredEmployees.length} من {employees.length} موظف
						</p>
					</div>

					<div className='relative'>
						<input
							type='text'
							placeholder='بحث عن موظف...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='block w-full sm:w-60 pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
						/>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-4 w-4 text-gray-400' />
						</div>
					</div>
				</div>

				{loading ? (
					<div className='p-8 text-center'>
						<div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500'></div>
						<p className='mt-2 text-sm text-gray-600'>جاري تحميل بيانات الموظفين...</p>
					</div>
				) : filteredEmployees.length === 0 ? (
					<div className='p-8 text-center'>
						<Users className='h-12 w-12 text-gray-300 mx-auto' />
						<h3 className='mt-2 text-sm font-medium text-gray-900'>لا يوجد موظفين</h3>
						<p className='mt-1 text-sm text-gray-500'>
							{searchQuery ||
							filters.department !== 'all' ||
							filters.status !== 'all' ||
							filters.branch !== 'all'
								? 'لا يوجد موظفين يطابقون معايير البحث'
								: 'لم يتم إضافة أي موظفين بعد'}
						</p>
						{(searchQuery ||
							filters.department !== 'all' ||
							filters.status !== 'all' ||
							filters.branch !== 'all') && (
							<button
								onClick={resetFilters}
								className='mt-3 inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none'
							>
								إعادة ضبط الفلاتر
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
										الموظف
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										المنصب والقسم
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
										التواصل
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										تاريخ التعيين
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الحالة
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
								{filteredEmployees.map((employee) => (
									<tr key={employee.id} className='hover:bg-gray-50'>
										{/* Employee */}
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='h-10 w-10 shrink-0 rounded-full overflow-hidden'>
													{employee.photo ? (
														<img
															src={employee.photo}
															alt={employee.name}
															className='h-10 w-10 object-cover'
														/>
													) : (
														<div className='h-10 w-10 bg-gray-200 flex items-center justify-center'>
															<User className='h-5 w-5 text-gray-500' />
														</div>
													)}
												</div>
												<div className='mr-3'>
													<div className='text-sm font-medium text-gray-900'>
														{employee.name}
													</div>
													<div className='text-xs text-gray-500'>{employee.employeeId}</div>
												</div>
											</div>
										</td>

										{/* Position & Department */}
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<Briefcase className='h-4 w-4 text-gray-400 ml-1' />
												<div>
													<div className='text-sm text-gray-900'>{employee.position}</div>
													<div className='text-xs text-gray-500'>{employee.department}</div>
												</div>
											</div>
										</td>

										{/* Branch */}
										<td className='px-6 py-4 whitespace-nowrap'>
											<Link
												href={`/dashboard/branches/${employee.branch.id}`}
												className='flex items-center text-sm text-blue-600 hover:text-blue-800'
											>
												<Building className='h-4 w-4 ml-1' />
												{employee.branch.name}
											</Link>
										</td>

										{/* Contact */}
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900 flex items-center'>
												<Phone className='h-4 w-4 text-gray-400 ml-1' />
												{employee.phone}
											</div>
											<div className='text-xs text-gray-500 flex items-center mt-1'>
												<Mail className='h-4 w-4 text-gray-400 ml-1' />
												{employee.email}
											</div>
										</td>

										{/* Hire Date */}
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<Calendar className='h-4 w-4 text-gray-400 ml-1' />
												<span className='text-sm text-gray-900'>
													{formatDate(employee.hireDate)}
												</span>
											</div>

											{employee.performanceRating && (
												<div className='flex items-center mt-1 text-xs text-gray-500'>
													<Star className='h-3 w-3 text-amber-500 ml-1 fill-current' />
													التقييم: {employee.performanceRating}
												</div>
											)}
										</td>

										{/* Status */}
										<td className='px-6 py-4 whitespace-nowrap'>
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
													employee.status
												)}`}
											>
												{getStatusText(employee.status)}
											</span>
										</td>

										{/* Actions */}
										<td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
											<div className='flex items-center justify-center space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/employees/${employee.id}`}
													className='text-blue-600 hover:text-blue-900'
													title='عرض التفاصيل'
												>
													<Eye className='h-5 w-5' />
												</Link>

												<Link
													href={`/dashboard/employees/${employee.id}/edit`}
													className='text-green-600 hover:text-green-900'
													title='تعديل'
												>
													<Edit className='h-5 w-5' />
												</Link>

												<button
													onClick={() => {
														setEmployeeToDelete(employee.id);
														setShowDeleteModal(true);
													}}
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

				{filteredEmployees.length > 0 && (
					<div className='bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6 flex justify-between items-center'>
						<div className='text-sm text-gray-700'>
							عرض <span className='font-medium'>{filteredEmployees.length}</span> من أصل{' '}
							<span className='font-medium'>{employees.length}</span> موظف
						</div>
						<div className='flex justify-between space-x-3 space-x-reverse'>
							<button className='inline-flex justify-center px-3 py-1.5 text-sm text-green-600 hover:text-green-800'>
								<Download className='ml-1.5 -mr-0.5 h-4 w-4' />
								تصدير البيانات
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Add Employee Modal */}
			{showAddForm && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative'>
						<h2 className='text-lg font-bold text-gray-900 mb-6'>إضافة موظف جديد</h2>

						<form onSubmit={handleAddEmployee} className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<label htmlFor='employee-name' className='block text-sm font-medium text-gray-700'>
										اسم الموظف <span className='text-red-500'>*</span>
									</label>
									<input
										id='employee-name'
										type='text'
										value={newEmployee.name}
										onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='employee-id' className='block text-sm font-medium text-gray-700'>
										رقم الموظف
									</label>
									<input
										id='employee-id'
										type='text'
										value={newEmployee.employeeId}
										onChange={(e) => setNewEmployee({ ...newEmployee, employeeId: e.target.value })}
										placeholder='سيتم إنشاؤه تلقائيًا إذا تركته فارغًا'
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='position' className='block text-sm font-medium text-gray-700'>
										المنصب <span className='text-red-500'>*</span>
									</label>
									<input
										id='position'
										type='text'
										value={newEmployee.position}
										onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='department' className='block text-sm font-medium text-gray-700'>
										القسم <span className='text-red-500'>*</span>
									</label>
									<select
										id='department'
										value={newEmployee.department}
										onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									>
										<option value='الإدارة'>الإدارة</option>
										<option value='المبيعات'>المبيعات</option>
										<option value='خدمة العملاء'>خدمة العملاء</option>
										<option value='الإنتاج'>الإنتاج</option>
										<option value='الموارد البشرية'>الموارد البشرية</option>
										<option value='المالية'>المالية</option>
										<option value='المستودعات'>المستودعات</option>
									</select>
								</div>

								<div className='space-y-2'>
									<label htmlFor='branch' className='block text-sm font-medium text-gray-700'>
										الفرع <span className='text-red-500'>*</span>
									</label>
									<select
										id='branch'
										value={newEmployee.branchId}
										onChange={(e) =>
											setNewEmployee({ ...newEmployee, branchId: parseInt(e.target.value) })
										}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									>
										{getBranches().map(
											(branch) =>
												branch && (
													<option key={branch.id} value={branch.id}>
														{branch.name}
													</option>
												)
										)}
									</select>
								</div>

								<div className='space-y-2'>
									<label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
										رقم الهاتف <span className='text-red-500'>*</span>
									</label>
									<input
										id='phone'
										type='tel'
										value={newEmployee.phone}
										onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
										البريد الإلكتروني <span className='text-red-500'>*</span>
									</label>
									<input
										id='email'
										type='email'
										value={newEmployee.email}
										onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='hire-date' className='block text-sm font-medium text-gray-700'>
										تاريخ التعيين <span className='text-red-500'>*</span>
									</label>
									<input
										id='hire-date'
										type='date'
										value={newEmployee.hireDate}
										onChange={(e) => setNewEmployee({ ...newEmployee, hireDate: e.target.value })}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label className='block text-sm font-medium text-gray-700'>
										الجنس <span className='text-red-500'>*</span>
									</label>
									<div className='flex mt-1 space-x-4 space-x-reverse'>
										<div className='flex items-center'>
											<input
												id='gender-male'
												type='radio'
												name='gender'
												value='male'
												checked={newEmployee.gender === 'male'}
												onChange={() => setNewEmployee({ ...newEmployee, gender: 'male' })}
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
												checked={newEmployee.gender === 'female'}
												onChange={() => setNewEmployee({ ...newEmployee, gender: 'female' })}
												className='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300'
											/>
											<label htmlFor='gender-female' className='mr-2 block text-sm text-gray-700'>
												أنثى
											</label>
										</div>
									</div>
								</div>

								<div className='space-y-2'>
									<label htmlFor='nationality' className='block text-sm font-medium text-gray-700'>
										الجنسية <span className='text-red-500'>*</span>
									</label>
									<input
										id='nationality'
										type='text'
										value={newEmployee.nationality}
										onChange={(e) =>
											setNewEmployee({ ...newEmployee, nationality: e.target.value })
										}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='id-number' className='block text-sm font-medium text-gray-700'>
										رقم الهوية <span className='text-red-500'>*</span>
									</label>
									<input
										id='id-number'
										type='text'
										value={newEmployee.idNumber}
										onChange={(e) => setNewEmployee({ ...newEmployee, idNumber: e.target.value })}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>
							</div>

							<div className='flex justify-end space-x-3 space-x-reverse pt-4 border-t border-gray-200'>
								<button
									type='button'
									onClick={() => setShowAddForm(false)}
									className='px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
								>
									إلغاء
								</button>
								<button
									type='submit'
									disabled={isSubmitting}
									className='px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none disabled:bg-green-300 disabled:cursor-not-allowed'
								>
									{isSubmitting ? (
										<span className='flex items-center'>
											<span className='animate-spin h-4 w-4 ml-1 border-2 border-t-transparent border-white rounded-full'></span>
											جاري الإضافة...
										</span>
									) : (
										'إضافة الموظف'
									)}
								</button>
							</div>
						</form>

						<button
							onClick={() => setShowAddForm(false)}
							className='absolute top-2 left-2 text-gray-500 hover:text-gray-700'
						>
							<X className='h-6 w-6' />
						</button>
					</div>
				</div>
			)}

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white rounded-lg shadow-lg max-w-md w-full p-6'>
						<div className='flex items-start'>
							<div className='shrink-0'>
								<AlertCircle className='h-6 w-6 text-red-600' />
							</div>
							<div className='mr-3 w-full'>
								<h3 className='text-lg font-medium text-gray-900'>تأكيد حذف الموظف</h3>
								<div className='mt-2'>
									<p className='text-sm text-gray-500'>
										هل أنت متأكد من رغبتك في حذف هذا الموظف؟ لا يمكن التراجع عن هذا الإجراء.
									</p>
								</div>

								<div className='mt-4 flex justify-end space-x-3 space-x-reverse'>
									<button
										type='button'
										onClick={() => {
											setShowDeleteModal(false);
											setEmployeeToDelete(null);
										}}
										className='px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
									>
										إلغاء
									</button>
									<button
										type='button'
										onClick={handleDeleteEmployee}
										disabled={isSubmitting}
										className='px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none disabled:bg-red-300 disabled:cursor-not-allowed'
									>
										{isSubmitting ? (
											<span className='flex items-center'>
												<span className='animate-spin h-4 w-4 ml-1 border-2 border-t-transparent border-white rounded-full'></span>
												جاري الحذف...
											</span>
										) : (
											'حذف الموظف'
										)}
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Notification */}
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
