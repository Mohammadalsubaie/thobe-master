'use client';

import {
	AlertCircle,
	ArrowUpRight,
	Building,
	Check,
	CheckCircle,
	ChevronDown,
	DollarSign,
	Download,
	Edit,
	Eye,
	FileText,
	Filter,
	MapPin,
	Phone,
	Plus,
	Search,
	Star,
	Trash,
	User,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Branch {
	id: number;
	name: string;
	code: string;
	address: string;
	city: string;
	phone: string;
	manager: string;
	managerPhone?: string;
	email?: string;
	status: 'active' | 'inactive' | 'maintenance';
	openingDate: string;
	employeesCount: number;
	totalOrders: number;
	monthlySales: number;
	photo?: string;
	type: 'main' | 'sub' | 'seasonal';
	rating?: number;
	coordinates?: {
		lat: number;
		lng: number;
	};
}

interface BranchFilter {
	status: string;
	city: string;
	type: string;
	sortBy: string;
	sortOrder: 'asc' | 'desc';
}

export default function BranchesPage() {
	const [branches, setBranches] = useState<Branch[]>([]);
	const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAddForm, setShowAddForm] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [branchToDelete, setBranchToDelete] = useState<number | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [filters, setFilters] = useState<BranchFilter>({
		status: 'all',
		city: 'all',
		type: 'all',
		sortBy: 'name',
		sortOrder: 'asc',
	});
	const [showFilters, setShowFilters] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

	// States for new branch form
	const [newBranchName, setNewBranchName] = useState('');
	const [newBranchCode, setNewBranchCode] = useState('');
	const [newBranchAddress, setNewBranchAddress] = useState('');
	const [newBranchCity, setNewBranchCity] = useState('');
	const [newBranchPhone, setNewBranchPhone] = useState('966');
	const [newBranchManager, setNewBranchManager] = useState('');
	const [newBranchType, setNewBranchType] = useState<'main' | 'sub' | 'seasonal'>('sub');
	const [newBranchEmail, setNewBranchEmail] = useState('');

	const cities = ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة', 'الطائف', 'تبوك', 'حائل', 'أبها', 'القصيم'];

	useEffect(() => {
		const fetchBranches = async () => {
			setLoading(true);
			try {
				// محاكاة لتحميل البيانات من API
				await new Promise((resolve) => setTimeout(resolve, 800));

				// بيانات تجريبية للفروع
				const mockBranches: Branch[] = [
					{
						id: 1,
						name: 'فرع الرياض الرئيسي',
						code: 'RYD-001',
						address: 'شارع الملك فهد، حي العليا',
						city: 'الرياض',
						phone: '966112345678',
						manager: 'أحمد العمري',
						managerPhone: '966512345678',
						email: 'riyadh@example.com',
						status: 'active',
						openingDate: '2020-03-15',
						employeesCount: 25,
						totalOrders: 4580,
						monthlySales: 850000,
						type: 'main',
						rating: 4.7,
					},
					{
						id: 2,
						name: 'فرع جدة',
						code: 'JED-001',
						address: 'شارع التحلية، حي الروضة',
						city: 'جدة',
						phone: '966122345678',
						manager: 'سعيد القحطاني',
						managerPhone: '966512345679',
						email: 'jeddah@example.com',
						status: 'active',
						openingDate: '2020-06-10',
						employeesCount: 20,
						totalOrders: 3200,
						monthlySales: 720000,
						type: 'sub',
						rating: 4.5,
					},
					{
						id: 3,
						name: 'فرع الدمام',
						code: 'DMM-001',
						address: 'طريق الملك فهد، الشاطئ',
						city: 'الدمام',
						phone: '966132345678',
						manager: 'خالد السالم',
						status: 'active',
						openingDate: '2021-01-05',
						employeesCount: 15,
						totalOrders: 2100,
						monthlySales: 450000,
						type: 'sub',
						rating: 4.3,
					},
					{
						id: 4,
						name: 'فرع مكة الموسمي',
						code: 'MKH-001',
						address: 'العزيزية، قرب الحرم',
						city: 'مكة',
						phone: '966142345678',
						manager: 'محمد الزهراني',
						status: 'maintenance',
						openingDate: '2021-05-20',
						employeesCount: 10,
						totalOrders: 1500,
						monthlySales: 320000,
						type: 'seasonal',
						rating: 4.2,
					},
					{
						id: 5,
						name: 'فرع المدينة',
						code: 'MDN-001',
						address: 'المنطقة المركزية، قرب المسجد النبوي',
						city: 'المدينة',
						phone: '966142345679',
						manager: 'عبدالرحمن العتيبي',
						status: 'active',
						openingDate: '2021-08-15',
						employeesCount: 12,
						totalOrders: 1800,
						monthlySales: 380000,
						type: 'sub',
						rating: 4.4,
					},
					{
						id: 6,
						name: 'فرع الطائف',
						code: 'TAF-001',
						address: 'شارع الشفا',
						city: 'الطائف',
						phone: '966142345680',
						manager: 'فهد الدوسري',
						status: 'inactive',
						openingDate: '2022-02-10',
						employeesCount: 8,
						totalOrders: 950,
						monthlySales: 210000,
						type: 'sub',
						rating: 4.0,
					},
				];

				setBranches(mockBranches);
				setFilteredBranches(mockBranches);
			} catch (error) {
				console.error('Error fetching branches:', error);
				setNotification({
					message: 'حدث خطأ أثناء تحميل بيانات الفروع',
					type: 'error',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchBranches();
	}, []);

	// Filter and search branches
	useEffect(() => {
		let result = [...branches];

		// Apply search query
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(branch) =>
					branch.name.toLowerCase().includes(query) ||
					branch.code.toLowerCase().includes(query) ||
					branch.address.toLowerCase().includes(query) ||
					branch.manager.toLowerCase().includes(query)
			);
		}

		// Apply filters
		if (filters.status !== 'all') {
			result = result.filter((branch) => branch.status === filters.status);
		}

		if (filters.city !== 'all') {
			result = result.filter((branch) => branch.city === filters.city);
		}

		if (filters.type !== 'all') {
			result = result.filter((branch) => branch.type === filters.type);
		}

		// Apply sorting
		result = sortBranches(result, filters.sortBy, filters.sortOrder);

		setFilteredBranches(result);
	}, [branches, searchQuery, filters]);

	// Sort branches
	const sortBranches = (branches: Branch[], sortBy: string, sortOrder: 'asc' | 'desc') => {
		return [...branches].sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case 'name':
					comparison = a.name.localeCompare(b.name);
					break;
				case 'sales':
					comparison = a.monthlySales - b.monthlySales;
					break;
				case 'employees':
					comparison = a.employeesCount - b.employeesCount;
					break;
				case 'orders':
					comparison = a.totalOrders - b.totalOrders;
					break;
				case 'rating':
					comparison = (a.rating || 0) - (b.rating || 0);
					break;
				default:
					comparison = a.name.localeCompare(b.name);
			}

			return sortOrder === 'asc' ? comparison : -comparison;
		});
	};

	// Reset all filters
	const resetFilters = () => {
		setFilters({
			status: 'all',
			city: 'all',
			type: 'all',
			sortBy: 'name',
			sortOrder: 'asc',
		});
		setSearchQuery('');
	};

	// Get color class based on branch status
	const getStatusColor = (status: string) => {
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

	// Get text for branch status
	const getStatusText = (status: string) => {
		switch (status) {
			case 'active':
				return 'نشط';
			case 'inactive':
				return 'غير نشط';
			case 'maintenance':
				return 'صيانة';
			default:
				return 'غير معروف';
		}
	};

	// Get text for branch type
	const getBranchTypeText = (type: string) => {
		switch (type) {
			case 'main':
				return 'فرع رئيسي';
			case 'sub':
				return 'فرع فرعي';
			case 'seasonal':
				return 'فرع موسمي';
			default:
				return 'غير معروف';
		}
	};

	// Format date
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// Get branch statistics
	const getBranchesStats = () => {
		const totalBranches = branches.length;
		const activeBranches = branches.filter((b) => b.status === 'active').length;
		const totalEmployees = branches.reduce((sum, branch) => sum + branch.employeesCount, 0);
		const totalSales = branches.reduce((sum, branch) => sum + branch.monthlySales, 0);

		return {
			totalBranches,
			activeBranches,
			totalEmployees,
			totalSales,
		};
	};

	// Handle add branch
	const handleAddBranch = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// محاكاة لطلب API
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// إنشاء فرع جديد
			const newBranch: Branch = {
				id: branches.length + 1,
				name: newBranchName,
				code: newBranchCode || `BR-${(branches.length + 1).toString().padStart(3, '0')}`,
				address: newBranchAddress,
				city: newBranchCity,
				phone: newBranchPhone,
				manager: newBranchManager,
				email: newBranchEmail,
				status: 'active',
				openingDate: new Date().toISOString().slice(0, 10),
				employeesCount: 0,
				totalOrders: 0,
				monthlySales: 0,
				type: newBranchType,
			};

			// إضافة الفرع للقائمة
			setBranches([...branches, newBranch]);

			// إعادة تعيين نموذج الإضافة
			setNewBranchName('');
			setNewBranchCode('');
			setNewBranchAddress('');
			setNewBranchCity('');
			setNewBranchPhone('966');
			setNewBranchManager('');
			setNewBranchType('sub');
			setNewBranchEmail('');

			// إخفاء النموذج
			setShowAddForm(false);

			// إظهار رسالة نجاح
			setNotification({
				message: 'تم إضافة الفرع بنجاح',
				type: 'success',
			});
		} catch (error) {
			console.error('Error adding branch:', error);
			setNotification({
				message: 'حدث خطأ أثناء إضافة الفرع',
				type: 'error',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle delete branch
	const handleDeleteBranch = async () => {
		if (branchToDelete === null) return;

		setIsSubmitting(true);
		try {
			// محاكاة لطلب API
			await new Promise((resolve) => setTimeout(resolve, 800));

			// حذف الفرع من القائمة
			setBranches(branches.filter((branch) => branch.id !== branchToDelete));

			// إغلاق النافذة
			setShowDeleteModal(false);
			setBranchToDelete(null);

			// إظهار رسالة نجاح
			setNotification({
				message: 'تم حذف الفرع بنجاح',
				type: 'success',
			});
		} catch (error) {
			console.error('Error deleting branch:', error);
			setNotification({
				message: 'حدث خطأ أثناء حذف الفرع',
				type: 'error',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	// الإحصائيات
	const stats = getBranchesStats();

	return (
		<div className='space-y-6'>
			{/* Header */}
			<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<Building className='ml-2 h-6 w-6 text-gray-600' /> إدارة الفروع
					</h1>
					<p className='mt-1 text-sm text-gray-600'>عرض وإدارة جميع فروع المؤسسة</p>
				</div>

				<div className='flex space-x-2 space-x-reverse'>
					<button
						type='button'
						onClick={() => setShowFilters(!showFilters)}
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'
					>
						<Filter className='ml-1.5 -mr-0.5 h-4 w-4' />
						فلترة
						{(filters.status !== 'all' || filters.city !== 'all' || filters.type !== 'all') && (
							<span className='inline-flex items-center justify-center w-4 h-4 mr-1 text-xs font-bold text-white bg-green-500 rounded-full'>
								{(filters.status !== 'all' ? 1 : 0) +
									(filters.city !== 'all' ? 1 : 0) +
									(filters.type !== 'all' ? 1 : 0)}
							</span>
						)}
					</button>

					<Link
						href='/dashboard/branches/reports'
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'
					>
						<FileText className='ml-1.5 -mr-0.5 h-4 w-4' />
						التقارير
					</Link>

					<Link
						href='/dashboard/branches/map'
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'
					>
						<MapPin className='ml-1.5 -mr-0.5 h-4 w-4' />
						الخريطة
					</Link>

					<button
						type='button'
						onClick={() => setShowAddForm(true)}
						className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center'
					>
						<Plus className='ml-1.5 -mr-0.5 h-4 w-4' />
						إضافة فرع
					</button>
				</div>
			</div>

			{/* Statistics Cards */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
					<div className='p-4 flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-500'>إجمالي الفروع</p>
							<p className='mt-1 text-2xl font-bold text-gray-900'>{stats.totalBranches}</p>
						</div>
						<div className='h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center'>
							<Building className='h-6 w-6 text-blue-600' />
						</div>
					</div>
					<div className='bg-blue-50 px-4 py-2 text-xs text-blue-700 flex justify-between'>
						<span>الفروع المسجلة</span>
						<Link href='/dashboard/branches/reports' className='flex items-center'>
							<span>عرض التفاصيل</span>
							<ChevronDown className='h-3 w-3 mr-1' />
						</Link>
					</div>
				</div>

				<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
					<div className='p-4 flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-500'>الفروع النشطة</p>
							<p className='mt-1 text-2xl font-bold text-gray-900'>{stats.activeBranches}</p>
						</div>
						<div className='h-12 w-12 bg-green-100 rounded-full flex items-center justify-center'>
							<Check className='h-6 w-6 text-green-600' />
						</div>
					</div>
					<div className='bg-green-50 px-4 py-2 text-xs text-green-700 flex justify-between'>
						<span>
							{Math.round((stats.activeBranches / Math.max(1, stats.totalBranches)) * 100)}% من الفروع
						</span>
						<span className='flex items-center'>
							<ArrowUpRight className='h-3 w-3 ml-1' />
							2.3%
						</span>
					</div>
				</div>

				<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
					<div className='p-4 flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-500'>إجمالي الموظفين</p>
							<p className='mt-1 text-2xl font-bold text-gray-900'>{stats.totalEmployees}</p>
						</div>
						<div className='h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center'>
							<User className='h-6 w-6 text-purple-600' />
						</div>
					</div>
					<div className='bg-purple-50 px-4 py-2 text-xs text-purple-700 flex justify-between'>
						<span>عبر جميع الفروع</span>
						<span>متوسط {Math.round(stats.totalEmployees / Math.max(1, stats.totalBranches))} لكل فرع</span>
					</div>
				</div>

				<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
					<div className='p-4 flex items-center justify-between'>
						<div>
							<p className='text-sm font-medium text-gray-500'>المبيعات الشهرية</p>
							<p className='mt-1 text-2xl font-bold text-gray-900'>
								{(stats.totalSales / 1000000).toFixed(1)}M{' '}
								<span className='text-sm font-medium'>ر.س</span>
							</p>
						</div>
						<div className='h-12 w-12 bg-amber-100 rounded-full flex items-center justify-center'>
							<DollarSign className='h-6 w-6 text-amber-600' />
						</div>
					</div>
					<div className='bg-amber-50 px-4 py-2 text-xs text-amber-700 flex justify-between'>
						<span>إجمالي المبيعات</span>
						<Link href='/dashboard/branches/reports' className='flex items-center'>
							<span>عرض التقرير</span>
							<ChevronDown className='h-3 w-3 mr-1' />
						</Link>
					</div>
				</div>
			</div>

			{/* Filters area */}
			{showFilters && (
				<div className='bg-white rounded-lg border border-gray-200 p-4'>
					<div className='flex justify-between items-center mb-4'>
						<h3 className='text-sm font-medium text-gray-700'>فلترة وترتيب الفروع</h3>
						<button onClick={resetFilters} className='text-sm text-blue-600 hover:text-blue-800'>
							إعادة ضبط
						</button>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
						<div>
							<label htmlFor='status-filter' className='block text-xs font-medium text-gray-700 mb-1'>
								حالة الفرع
							</label>
							<select
								id='status-filter'
								value={filters.status}
								onChange={(e) => setFilters({ ...filters, status: e.target.value })}
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
							>
								<option value='all'>جميع الحالات</option>
								<option value='active'>نشط</option>
								<option value='inactive'>غير نشط</option>
								<option value='maintenance'>تحت الصيانة</option>
							</select>
						</div>

						<div>
							<label htmlFor='city-filter' className='block text-xs font-medium text-gray-700 mb-1'>
								المدينة
							</label>
							<select
								id='city-filter'
								value={filters.city}
								onChange={(e) => setFilters({ ...filters, city: e.target.value })}
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
							>
								<option value='all'>جميع المدن</option>
								{cities.map((city) => (
									<option key={city} value={city}>
										{city}
									</option>
								))}
							</select>
						</div>

						<div>
							<label htmlFor='type-filter' className='block text-xs font-medium text-gray-700 mb-1'>
								نوع الفرع
							</label>
							<select
								id='type-filter'
								value={filters.type}
								onChange={(e) => setFilters({ ...filters, type: e.target.value })}
								className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
							>
								<option value='all'>جميع الأنواع</option>
								<option value='main'>فرع رئيسي</option>
								<option value='sub'>فرع فرعي</option>
								<option value='seasonal'>فرع موسمي</option>
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
									<option value='name'>اسم الفرع</option>
									<option value='sales'>المبيعات</option>
									<option value='employees'>عدد الموظفين</option>
									<option value='orders'>عدد الطلبات</option>
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

			{/* Search and branches list */}
			<div className='bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden'>
				<div className='p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center space-y-3 sm:space-y-0'>
					<div>
						<h2 className='text-sm font-medium text-gray-700'>قائمة الفروع</h2>
						<p className='text-xs text-gray-500 mt-1'>
							عرض {filteredBranches.length} من {branches.length} فرع
						</p>
					</div>

					<div className='relative'>
						<input
							type='text'
							placeholder='بحث في الفروع...'
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
						<p className='mt-2 text-sm text-gray-600'>جاري تحميل الفروع...</p>
					</div>
				) : filteredBranches.length === 0 ? (
					<div className='p-8 text-center'>
						<Building className='h-12 w-12 text-gray-300 mx-auto' />
						<h3 className='mt-2 text-sm font-medium text-gray-900'>لا توجد فروع</h3>
						<p className='mt-1 text-sm text-gray-500'>
							{searchQuery || filters.status !== 'all' || filters.city !== 'all' || filters.type !== 'all'
								? 'لا توجد فروع تطابق معايير البحث'
								: 'لم يتم إضافة أي فروع بعد'}
						</p>
						{(searchQuery ||
							filters.status !== 'all' ||
							filters.city !== 'all' ||
							filters.type !== 'all') && (
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
										الفرع
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										العنوان
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
										المدير
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الإحصائيات
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
								{filteredBranches.map((branch) => (
									<tr key={branch.id} className='hover:bg-gray-50'>
										{/* Branch */}
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='h-10 w-10 shrink-0 bg-green-100 rounded-md flex items-center justify-center'>
													<Building className='h-5 w-5 text-green-600' />
												</div>
												<div className='mr-3'>
													<div className='text-sm font-medium text-gray-900'>
														{branch.name}
													</div>
													<div className='flex items-center'>
														<span className='text-xs text-gray-500'>{branch.code}</span>
														<span className='mx-1 text-gray-300'>•</span>
														<span className='text-xs text-gray-500'>
															{getBranchTypeText(branch.type)}
														</span>
													</div>
												</div>
											</div>
										</td>

										{/* Address */}
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<MapPin className='h-4 w-4 text-gray-400 ml-1' />
												<div>
													<div className='text-sm text-gray-900'>{branch.address}</div>
													<div className='text-xs text-gray-500'>{branch.city}</div>
												</div>
											</div>
										</td>

										{/* Contact */}
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='text-sm text-gray-900 flex items-center'>
												<Phone className='h-4 w-4 text-gray-400 ml-1' />
												{branch.phone}
											</div>
											{branch.email && (
												<div className='text-xs text-gray-500 mt-1'>{branch.email}</div>
											)}
										</td>

										{/* Manager */}
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<div className='h-7 w-7 bg-gray-200 rounded-full flex items-center justify-center'>
													<User className='h-4 w-4 text-gray-500' />
												</div>
												<span className='mr-2 text-sm text-gray-900'>{branch.manager}</span>
											</div>
										</td>

										{/* Statistics */}
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex flex-col space-y-1'>
												<div className='flex items-center justify-between'>
													<span className='text-xs text-gray-500'>الموظفين:</span>
													<span className='text-sm font-medium'>{branch.employeesCount}</span>
												</div>
												<div className='flex items-center justify-between'>
													<span className='text-xs text-gray-500'>المبيعات:</span>
													<span className='text-sm font-medium'>
														{(branch.monthlySales / 1000).toFixed(0)}K ر.س
													</span>
												</div>
												{branch.rating && (
													<div className='flex items-center justify-between'>
														<span className='text-xs text-gray-500'>التقييم:</span>
														<span className='text-sm font-medium flex items-center'>
															{branch.rating}
															<Star className='h-3 w-3 mr-0.5 text-amber-400 fill-current' />
														</span>
													</div>
												)}
											</div>
										</td>

										{/* Status */}
										<td className='px-6 py-4 whitespace-nowrap'>
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
													branch.status
												)}`}
											>
												{getStatusText(branch.status)}
											</span>
											<div className='text-xs text-gray-500 mt-1'>
												{formatDate(branch.openingDate)}
											</div>
										</td>

										{/* Actions */}
										<td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
											<div className='flex items-center justify-center space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/branches/${branch.id}`}
													className='text-blue-600 hover:text-blue-900'
													title='عرض التفاصيل'
												>
													<Eye className='h-5 w-5' />
												</Link>

												<Link
													href={`/dashboard/branches/${branch.id}/edit`}
													className='text-green-600 hover:text-green-900'
													title='تعديل'
												>
													<Edit className='h-5 w-5' />
												</Link>

												<button
													onClick={() => {
														setBranchToDelete(branch.id);
														setShowDeleteModal(true);
													}}
													className='text-red-600 hover:text-red-900'
													title='حذف'
													disabled={branch.type === 'main'}
												>
													<Trash
														className={`h-5 w-5 ${
															branch.type === 'main'
																? 'opacity-50 cursor-not-allowed'
																: ''
														}`}
													/>
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{filteredBranches.length > 0 && (
					<div className='bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6 flex justify-between items-center'>
						<div className='text-sm text-gray-700'>
							عرض <span className='font-medium'>{filteredBranches.length}</span> من أصل{' '}
							<span className='font-medium'>{branches.length}</span> فرع
						</div>
						<div className='flex justify-between space-x-3 space-x-reverse'>
							<Link
								href='/dashboard/branches/reports'
								className='inline-flex justify-center px-3 py-1.5 text-sm text-green-600 hover:text-green-800'
							>
								<Download className='ml-1.5 -mr-0.5 h-4 w-4' />
								تصدير البيانات
							</Link>
						</div>
					</div>
				)}
			</div>

			{/* Add Branch Modal */}
			{showAddForm && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 relative'>
						<h2 className='text-lg font-bold text-gray-900 mb-6'>إضافة فرع جديد</h2>

						<form onSubmit={handleAddBranch} className='space-y-6'>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div className='space-y-2'>
									<label htmlFor='branch-name' className='block text-sm font-medium text-gray-700'>
										اسم الفرع <span className='text-red-500'>*</span>
									</label>
									<input
										id='branch-name'
										type='text'
										value={newBranchName}
										onChange={(e) => setNewBranchName(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='branch-code' className='block text-sm font-medium text-gray-700'>
										كود الفرع
									</label>
									<input
										id='branch-code'
										type='text'
										value={newBranchCode}
										onChange={(e) => setNewBranchCode(e.target.value)}
										placeholder='سيتم إنشاؤه تلقائيًا إذا تركته فارغًا'
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='branch-address' className='block text-sm font-medium text-gray-700'>
										العنوان <span className='text-red-500'>*</span>
									</label>
									<input
										id='branch-address'
										type='text'
										value={newBranchAddress}
										onChange={(e) => setNewBranchAddress(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='branch-city' className='block text-sm font-medium text-gray-700'>
										المدينة <span className='text-red-500'>*</span>
									</label>
									<select
										id='branch-city'
										value={newBranchCity}
										onChange={(e) => setNewBranchCity(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									>
										<option value=''>اختر المدينة</option>
										{cities.map((city) => (
											<option key={city} value={city}>
												{city}
											</option>
										))}
									</select>
								</div>

								<div className='space-y-2'>
									<label htmlFor='branch-phone' className='block text-sm font-medium text-gray-700'>
										رقم الهاتف <span className='text-red-500'>*</span>
									</label>
									<input
										id='branch-phone'
										type='tel'
										value={newBranchPhone}
										onChange={(e) => setNewBranchPhone(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='branch-email' className='block text-sm font-medium text-gray-700'>
										البريد الإلكتروني
									</label>
									<input
										id='branch-email'
										type='email'
										value={newBranchEmail}
										onChange={(e) => setNewBranchEmail(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='branch-manager' className='block text-sm font-medium text-gray-700'>
										المدير المسؤول <span className='text-red-500'>*</span>
									</label>
									<input
										id='branch-manager'
										type='text'
										value={newBranchManager}
										onChange={(e) => setNewBranchManager(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='branch-type' className='block text-sm font-medium text-gray-700'>
										نوع الفرع <span className='text-red-500'>*</span>
									</label>
									<select
										id='branch-type'
										value={newBranchType}
										onChange={(e) =>
											setNewBranchType(e.target.value as 'main' | 'sub' | 'seasonal')
										}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									>
										<option value='main'>فرع رئيسي</option>
										<option value='sub'>فرع فرعي</option>
										<option value='seasonal'>فرع موسمي</option>
									</select>
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
										'إضافة الفرع'
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
								<h3 className='text-lg font-medium text-gray-900'>تأكيد حذف الفرع</h3>
								<div className='mt-2'>
									<p className='text-sm text-gray-500'>
										هل أنت متأكد من رغبتك في حذف هذا الفرع؟ لا يمكن التراجع عن هذا الإجراء.
									</p>
								</div>

								<div className='mt-4 flex justify-end space-x-3 space-x-reverse'>
									<button
										type='button'
										onClick={() => {
											setShowDeleteModal(false);
											setBranchToDelete(null);
										}}
										className='px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
									>
										إلغاء
									</button>
									<button
										type='button'
										onClick={handleDeleteBranch}
										disabled={isSubmitting}
										className='px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none disabled:bg-red-300 disabled:cursor-not-allowed'
									>
										{isSubmitting ? (
											<span className='flex items-center'>
												<span className='animate-spin h-4 w-4 ml-1 border-2 border-t-transparent border-white rounded-full'></span>
												جاري الحذف...
											</span>
										) : (
											'حذف الفرع'
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
