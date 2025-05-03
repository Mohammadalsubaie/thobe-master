'use client';

import {
	Activity,
	AlertCircle,
	ArrowUpRight,
	BarChart2,
	Calendar,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	ClipboardList,
	Clock,
	Edit,
	Eye,
	FileText,
	Mail,
	MessageSquare,
	MoreHorizontal,
	Phone,
	Plus,
	Search,
	Star,
	StarHalf,
	User,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Tailor {
	id: string;
	name: string;
	avatar?: string;
	phone: string;
	email: string;
	employeeId: string;
	specializations: string[];
	skills: {
		name: string;
		level: number; // 1-5
	}[];
	joinedDate: string;
	rating: number;
	status: 'active' | 'inactive' | 'on_leave';
	stats: {
		completedTasks: number;
		inProgressTasks: number;
		delayedTasks: number;
		averageCompletionTime: number;
		qualityScore: number;
	};
	currentTasks: {
		id: string;
		orderNumber: string;
		productName: string;
		dueDate: string;
		stage: string;
		priority: 'low' | 'medium' | 'high' | 'urgent';
	}[];
}

interface TailorFilter {
	specialization: string;
	status: string;
	rating: string;
	availability: string;
}

export default function TailorsPage() {
	const [loading, setLoading] = useState(true);
	const [tailors, setTailors] = useState<Tailor[]>([]);
	const [filteredTailors, setFilteredTailors] = useState<Tailor[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [filters, setFilters] = useState<TailorFilter>({
		specialization: 'all',
		status: 'all',
		rating: 'all',
		availability: 'all',
	});
	const [sortBy, setSortBy] = useState<'name' | 'rating' | 'tasks'>('rating');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [expandedTailor, setExpandedTailor] = useState<string | null>(null);
	const [specializations, setSpecializations] = useState<string[]>([]);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية للخياطين
			const mockTailors: Tailor[] = [
				{
					id: 'tailor-1',
					name: 'أحمد محمد',
					phone: '0501234567',
					email: 'ahmed@example.com',
					employeeId: 'EMP-001',
					specializations: ['القياس', 'القص'],
					skills: [
						{ name: 'قص الأقمشة', level: 5 },
						{ name: 'أخذ المقاسات', level: 4 },
						{ name: 'خياطة الأكمام', level: 3 },
					],
					joinedDate: '2021-05-15',
					rating: 4.8,
					status: 'active',
					stats: {
						completedTasks: 128,
						inProgressTasks: 5,
						delayedTasks: 1,
						averageCompletionTime: 2.5, // بالأيام
						qualityScore: 92, // النسبة المئوية
					},
					currentTasks: [
						{
							id: 'task-1',
							orderNumber: 'ORD-1245',
							productName: 'ثوب كلاسيك',
							dueDate: '2023-10-10',
							stage: 'القياس',
							priority: 'high',
						},
						{
							id: 'task-8',
							orderNumber: 'ORD-1252',
							productName: 'ثوب حجازي',
							dueDate: '2023-10-12',
							stage: 'القياس',
							priority: 'medium',
						},
					],
				},
				{
					id: 'tailor-2',
					name: 'خالد العمري',
					phone: '0507654321',
					email: 'khalid@example.com',
					employeeId: 'EMP-002',
					specializations: ['الخياطة', 'التطريز'],
					skills: [
						{ name: 'خياطة متقدمة', level: 5 },
						{ name: 'تطريز يدوي', level: 5 },
						{ name: 'تطريز آلي', level: 4 },
					],
					joinedDate: '2020-08-10',
					rating: 4.9,
					status: 'active',
					stats: {
						completedTasks: 203,
						inProgressTasks: 4,
						delayedTasks: 0,
						averageCompletionTime: 2.2,
						qualityScore: 95,
					},
					currentTasks: [
						{
							id: 'task-3',
							orderNumber: 'ORD-1247',
							productName: 'ثوب إماراتي',
							dueDate: '2023-10-08',
							stage: 'الخياطة',
							priority: 'urgent',
						},
						{
							id: 'task-7',
							orderNumber: 'ORD-1251',
							productName: 'ثوب نجدي',
							dueDate: '2023-10-05',
							stage: 'الخياطة',
							priority: 'high',
						},
					],
				},
				{
					id: 'tailor-3',
					name: 'سعيد الزهراني',
					phone: '0561234567',
					email: 'saeed@example.com',
					employeeId: 'EMP-003',
					specializations: ['القص', 'الخياطة'],
					skills: [
						{ name: 'قص الأقمشة', level: 4 },
						{ name: 'خياطة الثياب', level: 5 },
						{ name: 'تصميم الموديلات', level: 3 },
					],
					joinedDate: '2019-11-22',
					rating: 4.6,
					status: 'active',
					stats: {
						completedTasks: 175,
						inProgressTasks: 6,
						delayedTasks: 2,
						averageCompletionTime: 2.8,
						qualityScore: 88,
					},
					currentTasks: [
						{
							id: 'task-2',
							orderNumber: 'ORD-1246',
							productName: 'ثوب مغربي',
							dueDate: '2023-10-15',
							stage: 'القص',
							priority: 'medium',
						},
						{
							id: 'task-6',
							orderNumber: 'ORD-1250',
							productName: 'ثوب كلاسيك',
							dueDate: '2023-10-25',
							stage: 'القص',
							priority: 'low',
						},
					],
				},
				{
					id: 'tailor-4',
					name: 'فهد القرني',
					phone: '0541234567',
					email: 'fahad@example.com',
					employeeId: 'EMP-004',
					specializations: ['التطريز'],
					skills: [
						{ name: 'تطريز يدوي', level: 5 },
						{ name: 'تطريز ذهبي', level: 5 },
						{ name: 'تصميم التطريز', level: 4 },
					],
					joinedDate: '2022-02-05',
					rating: 4.7,
					status: 'on_leave',
					stats: {
						completedTasks: 89,
						inProgressTasks: 3,
						delayedTasks: 0,
						averageCompletionTime: 3.1,
						qualityScore: 94,
					},
					currentTasks: [
						{
							id: 'task-4',
							orderNumber: 'ORD-1248',
							productName: 'بشت ملكي',
							dueDate: '2023-10-20',
							stage: 'التطريز',
							priority: 'high',
						},
					],
				},
				{
					id: 'tailor-5',
					name: 'محمد الشهري',
					phone: '0551234567',
					email: 'mohammed@example.com',
					employeeId: 'EMP-005',
					specializations: ['الكي والتشطيب'],
					skills: [
						{ name: 'كي الثياب', level: 5 },
						{ name: 'التشطيب النهائي', level: 5 },
						{ name: 'التغليف', level: 4 },
					],
					joinedDate: '2020-06-18',
					rating: 4.5,
					status: 'active',
					stats: {
						completedTasks: 152,
						inProgressTasks: 7,
						delayedTasks: 1,
						averageCompletionTime: 1.5,
						qualityScore: 90,
					},
					currentTasks: [
						{
							id: 'task-5',
							orderNumber: 'ORD-1249',
							productName: 'ثوب بقصة عصرية',
							dueDate: '2023-10-07',
							stage: 'الكي والتشطيب',
							priority: 'medium',
						},
						{
							id: 'task-10',
							orderNumber: 'ORD-1254',
							productName: 'ثوب رسمي',
							dueDate: '2023-10-15',
							stage: 'الكي والتشطيب',
							priority: 'high',
						},
					],
				},
				{
					id: 'tailor-6',
					name: 'عبدالرحمن الغامدي',
					phone: '0571234567',
					email: 'abdulrahman@example.com',
					employeeId: 'EMP-006',
					specializations: ['الخياطة', 'القص'],
					skills: [
						{ name: 'خياطة الثياب', level: 4 },
						{ name: 'قص الأقمشة', level: 4 },
						{ name: 'تصميم القصّات', level: 3 },
					],
					joinedDate: '2021-09-01',
					rating: 4.2,
					status: 'inactive',
					stats: {
						completedTasks: 65,
						inProgressTasks: 0,
						delayedTasks: 0,
						averageCompletionTime: 3.2,
						qualityScore: 85,
					},
					currentTasks: [],
				},
				{
					id: 'tailor-7',
					name: 'علي السلمي',
					phone: '0531234567',
					email: 'ali@example.com',
					employeeId: 'EMP-007',
					specializations: ['القياس', 'التفصيل'],
					skills: [
						{ name: 'أخذ المقاسات', level: 5 },
						{ name: 'تفصيل الأقمشة', level: 4 },
						{ name: 'استشارات القصّات', level: 4 },
					],
					joinedDate: '2022-01-10',
					rating: 4.4,
					status: 'active',
					stats: {
						completedTasks: 78,
						inProgressTasks: 4,
						delayedTasks: 1,
						averageCompletionTime: 2.7,
						qualityScore: 87,
					},
					currentTasks: [
						{
							id: 'task-11',
							orderNumber: 'ORD-1255',
							productName: 'ثوب سعودي',
							dueDate: '2023-10-18',
							stage: 'القياس',
							priority: 'medium',
						},
					],
				},
			];

			// استخلاص جميع التخصصات المتاحة
			const allSpecializations = new Set<string>();
			mockTailors.forEach((tailor) => {
				tailor.specializations.forEach((spec) => {
					allSpecializations.add(spec);
				});
			});

			setTailors(mockTailors);
			setFilteredTailors(mockTailors);
			setSpecializations(Array.from(allSpecializations));
			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let result = [...tailors];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(tailor) =>
					tailor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					tailor.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
					tailor.email.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// تطبيق فلتر التخصص
		if (filters.specialization !== 'all') {
			result = result.filter((tailor) => tailor.specializations.includes(filters.specialization));
		}

		// تطبيق فلتر الحالة
		if (filters.status !== 'all') {
			result = result.filter((tailor) => tailor.status === filters.status);
		}

		// تطبيق فلتر التقييم
		if (filters.rating !== 'all') {
			const rating = parseFloat(filters.rating);
			result = result.filter((tailor) => tailor.rating >= rating);
		}

		// تطبيق فلتر الإتاحة
		if (filters.availability !== 'all') {
			if (filters.availability === 'available') {
				result = result.filter((tailor) => tailor.status === 'active' && tailor.currentTasks.length < 5);
			} else if (filters.availability === 'busy') {
				result = result.filter((tailor) => tailor.currentTasks.length >= 5);
			}
		}

		// تطبيق الترتيب
		result.sort((a, b) => {
			if (sortBy === 'name') {
				return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
			} else if (sortBy === 'rating') {
				return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
			} else {
				return sortOrder === 'asc'
					? a.stats.completedTasks - b.stats.completedTasks
					: b.stats.completedTasks - a.stats.completedTasks;
			}
		});

		setFilteredTailors(result);
	}, [tailors, searchTerm, filters, sortBy, sortOrder]);

	// تغيير حالة توسيع بطاقة الخياط
	const toggleExpandTailor = (tailorId: string) => {
		if (expandedTailor === tailorId) {
			setExpandedTailor(null);
		} else {
			setExpandedTailor(tailorId);
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

	// عرض مستوى المهارة بالنجوم
	const renderSkillLevel = (level: number) => {
		const stars = [];
		for (let i = 0; i < 5; i++) {
			if (i < Math.floor(level)) {
				stars.push(<Star key={i} className='h-4 w-4 text-amber-500 fill-amber-500' />);
			} else if (i === Math.floor(level) && level % 1 !== 0) {
				stars.push(<StarHalf key={i} className='h-4 w-4 text-amber-500 fill-amber-500' />);
			} else {
				stars.push(<Star key={i} className='h-4 w-4 text-gray-300' />);
			}
		}
		return <div className='flex'>{stars}</div>;
	};

	// عرض حالة الخياط
	const renderStatusBadge = (status: string) => {
		switch (status) {
			case 'active':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						نشط
					</span>
				);
			case 'inactive':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						غير نشط
					</span>
				);
			case 'on_leave':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800'>
						في إجازة
					</span>
				);
			default:
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						{status}
					</span>
				);
		}
	};

	// عرض شارة الأولوية
	const renderPriorityBadge = (priority: string) => {
		switch (priority) {
			case 'urgent':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						عاجل
					</span>
				);
			case 'high':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
						مرتفع
					</span>
				);
			case 'medium':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						متوسط
					</span>
				);
			case 'low':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						منخفض
					</span>
				);
			default:
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						{priority}
					</span>
				);
		}
	};

	// التحقق من توفر الخياط
	const getTailorAvailabilityStatus = (tailor: Tailor) => {
		if (tailor.status !== 'active') {
			return { status: 'unavailable', text: 'غير متاح', color: 'text-gray-500' };
		}

		if (tailor.currentTasks.length === 0) {
			return { status: 'free', text: 'متاح تماماً', color: 'text-green-600' };
		} else if (tailor.currentTasks.length < 3) {
			return { status: 'available', text: 'متاح', color: 'text-green-600' };
		} else if (tailor.currentTasks.length < 5) {
			return { status: 'busy', text: 'مشغول جزئياً', color: 'text-amber-600' };
		} else {
			return { status: 'very_busy', text: 'مشغول جداً', color: 'text-red-600' };
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500'></div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900 flex items-center'>
						<User className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						الخياطين
					</h1>
					<p className='mt-1 text-gray-500'>إدارة الخياطين وتخصصاتهم وتقييم أدائهم</p>
				</div>

				<div>
					<button className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'>
						<Plus className='ml-1 h-4 w-4' />
						إضافة خياط جديد
					</button>
				</div>
			</div>

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex flex-col md:flex-row gap-4 mb-4'>
					{/* البحث */}
					<div className='flex-1 relative'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='بحث عن اسم أو رقم موظف أو بريد إلكتروني...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						/>
					</div>

					{/* فلتر التخصص */}
					<div className='min-w-[180px] relative'>
						<select
							value={filters.specialization}
							onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع التخصصات</option>
							{specializations.map((spec) => (
								<option key={spec} value={spec}>
									{spec}
								</option>
							))}
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر الحالة */}
					<div className='min-w-[150px] relative'>
						<select
							value={filters.status}
							onChange={(e) => setFilters({ ...filters, status: e.target.value })}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الحالات</option>
							<option value='active'>نشط</option>
							<option value='inactive'>غير نشط</option>
							<option value='on_leave'>في إجازة</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر التقييم */}
					<div className='min-w-[150px] relative'>
						<select
							value={filters.rating}
							onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع التقييمات</option>
							<option value='4.5'>4.5+ نجوم</option>
							<option value='4'>4+ نجوم</option>
							<option value='3.5'>3.5+ نجوم</option>
							<option value='3'>3+ نجوم</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر الإتاحة */}
					<div className='min-w-[150px] relative'>
						<select
							value={filters.availability}
							onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الإتاحات</option>
							<option value='available'>متاحون للعمل</option>
							<option value='busy'>مشغولون</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>
				</div>

				{/* خيارات الفرز ومعلومات إضافية */}
				<div className='flex flex-col sm:flex-row justify-between pt-4 border-t border-gray-200'>
					<div className='flex items-center mb-2 sm:mb-0'>
						<span className='text-sm text-gray-500'>
							عرض {filteredTailors.length} من {tailors.length} خياط
						</span>
						{(searchTerm ||
							filters.specialization !== 'all' ||
							filters.status !== 'all' ||
							filters.rating !== 'all' ||
							filters.availability !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setFilters({
										specialization: 'all',
										status: 'all',
										rating: 'all',
										availability: 'all',
									});
								}}
								className='mr-2 text-xs text-indigo-600 hover:text-indigo-800'
							>
								مسح الفلاتر
							</button>
						)}
					</div>

					<div className='flex items-center gap-2'>
						<span className='text-sm text-gray-500'>ترتيب حسب:</span>
						<div className='relative'>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value as 'name' | 'rating' | 'tasks')}
								className='appearance-none border border-gray-300 rounded-md py-1 pl-8 pr-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
							>
								<option value='name'>الاسم</option>
								<option value='rating'>التقييم</option>
								<option value='tasks'>المهام المكتملة</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>

						<button
							onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
							className={`p-1 border border-gray-300 rounded-md ${
								sortOrder === 'desc' ? 'bg-gray-100' : 'bg-white'
							}`}
							title={sortOrder === 'asc' ? 'ترتيب تصاعدي' : 'ترتيب تنازلي'}
						>
							{sortOrder === 'asc' ? (
								<ChevronUp className='h-4 w-4 text-gray-600' />
							) : (
								<ChevronDown className='h-4 w-4 text-gray-600' />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* قائمة الخياطين */}
			{filteredTailors.length > 0 ? (
				<div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
					{filteredTailors.map((tailor) => {
						const availability = getTailorAvailabilityStatus(tailor);

						return (
							<div
								key={tailor.id}
								className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'
							>
								<div className='p-4'>
									<div className='flex items-start justify-between'>
										<div className='flex items-start'>
											<div className='flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
												{tailor.avatar ? (
													<img
														src={tailor.avatar}
														alt={tailor.name}
														className='h-12 w-12 rounded-full'
													/>
												) : (
													<User className='h-6 w-6' />
												)}
											</div>
											<div>
												<h3 className='text-base font-medium text-gray-900'>{tailor.name}</h3>
												<div className='flex items-center mt-1'>
													<div className='flex'>
														{[1, 2, 3, 4, 5].map((star) => (
															<Star
																key={star}
																className={`h-4 w-4 ${
																	star <= Math.floor(tailor.rating)
																		? 'text-amber-500 fill-amber-500'
																		: 'text-gray-300'
																}`}
															/>
														))}
													</div>
													<span className='text-xs text-gray-500 mr-1'>
														{tailor.rating.toFixed(1)}
													</span>
												</div>
											</div>
										</div>

										<div className='flex items-center'>{renderStatusBadge(tailor.status)}</div>
									</div>

									<div className='mt-3 grid grid-cols-2 gap-2 text-sm'>
										<div className='flex items-center'>
											<Mail className='h-4 w-4 text-gray-400 ml-1' />
											<span className='text-gray-600 text-xs overflow-hidden truncate'>
												{tailor.email}
											</span>
										</div>
										<div className='flex items-center'>
											<Phone className='h-4 w-4 text-gray-400 ml-1' />
											<span className='text-gray-600 text-xs'>{tailor.phone}</span>
										</div>
										<div className='flex items-center'>
											<FileText className='h-4 w-4 text-gray-400 ml-1' />
											<span className='text-gray-600 text-xs'>
												رقم الموظف: {tailor.employeeId}
											</span>
										</div>
										<div className='flex items-center'>
											<Calendar className='h-4 w-4 text-gray-400 ml-1' />
											<span className='text-gray-600 text-xs'>
												تاريخ التعيين: {formatDate(tailor.joinedDate)}
											</span>
										</div>
									</div>

									<div className='mt-3 flex flex-wrap gap-1'>
										{tailor.specializations.map((spec, index) => (
											<span
												key={index}
												className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800'
											>
												{spec}
											</span>
										))}
									</div>

									<div className='mt-3 pt-3 border-t border-gray-100'>
										<div className='flex items-center justify-between'>
											<div className='flex items-center'>
												<Activity className='h-4 w-4 text-indigo-500 ml-1' />
												<span className='text-sm font-medium text-gray-700'>
													نبذة عن الأداء
												</span>
											</div>
											<button
												onClick={() => toggleExpandTailor(tailor.id)}
												className='text-indigo-600 hover:text-indigo-800 text-sm flex items-center'
											>
												{expandedTailor === tailor.id ? (
													<>
														<ChevronUp className='h-4 w-4 ml-1' />
														أقل تفاصيل
													</>
												) : (
													<>
														<ChevronDown className='h-4 w-4 ml-1' />
														المزيد من التفاصيل
													</>
												)}
											</button>
										</div>

										<div className='mt-2 grid grid-cols-3 gap-2'>
											<div className='text-center'>
												<div className='text-sm font-medium text-gray-900'>
													{tailor.stats.completedTasks}
												</div>
												<div className='text-xs text-gray-500'>مهمة منجزة</div>
											</div>
											<div className='text-center'>
												<div className='text-sm font-medium text-gray-900'>
													{tailor.stats.inProgressTasks}
												</div>
												<div className='text-xs text-gray-500'>مهمة حالية</div>
											</div>
											<div className='text-center'>
												<div className={`text-sm font-medium ${availability.color}`}>
													{availability.text}
												</div>
												<div className='text-xs text-gray-500'>الإتاحة</div>
											</div>
										</div>
									</div>

									{/* تفاصيل موسعة */}
									{expandedTailor === tailor.id && (
										<div className='mt-4 pt-3 border-t border-gray-100 animate-fadeIn'>
											{/* المهارات */}
											<div className='mb-4'>
												<h4 className='text-sm font-medium text-gray-700 mb-2'>المهارات</h4>
												<div className='space-y-2'>
													{tailor.skills.map((skill, index) => (
														<div key={index} className='flex items-center justify-between'>
															<span className='text-sm text-gray-600'>{skill.name}</span>
															{renderSkillLevel(skill.level)}
														</div>
													))}
												</div>
											</div>

											{/* إحصائيات الأداء */}
											<div className='mb-4'>
												<h4 className='text-sm font-medium text-gray-700 mb-2'>
													إحصائيات الأداء
												</h4>
												<div className='space-y-2'>
													<div className='flex items-center justify-between'>
														<span className='text-xs text-gray-600'>
															متوسط وقت الإنجاز:
														</span>
														<span className='text-xs font-medium text-gray-800'>
															{tailor.stats.averageCompletionTime} يوم
														</span>
													</div>
													<div className='flex items-center justify-between'>
														<span className='text-xs text-gray-600'>تقييم الجودة:</span>
														<span className='text-xs font-medium text-gray-800'>
															{tailor.stats.qualityScore}%
														</span>
													</div>
													<div className='flex items-center justify-between'>
														<span className='text-xs text-gray-600'>مهام متأخرة:</span>
														<span
															className={`text-xs font-medium ${
																tailor.stats.delayedTasks > 0
																	? 'text-red-600'
																	: 'text-green-600'
															}`}
														>
															{tailor.stats.delayedTasks}
														</span>
													</div>
												</div>
											</div>

											{/* المهام الحالية */}
											<div>
												<h4 className='text-sm font-medium text-gray-700 mb-2'>
													المهام الحالية
												</h4>
												{tailor.currentTasks.length > 0 ? (
													<div className='space-y-2'>
														{tailor.currentTasks.map((task) => (
															<div
																key={task.id}
																className='flex items-center justify-between p-2 bg-gray-50 rounded-md border border-gray-200'
															>
																<div>
																	<div className='text-xs font-medium text-gray-800'>
																		{task.orderNumber} - {task.productName}
																	</div>
																	<div className='flex items-center mt-1'>
																		<span className='text-xs text-gray-500 ml-2'>
																			{task.stage}
																		</span>
																		{renderPriorityBadge(task.priority)}
																	</div>
																</div>
																<div className='flex items-center text-xs'>
																	<Calendar className='h-3 w-3 text-gray-400 ml-1' />
																	<span className='text-gray-500'>
																		{formatDate(task.dueDate)}
																	</span>
																</div>
															</div>
														))}
													</div>
												) : (
													<div className='text-center py-2 bg-gray-50 rounded-md'>
														<p className='text-xs text-gray-500'>لا توجد مهام حالية</p>
													</div>
												)}
											</div>
										</div>
									)}

									{/* أزرار الإجراءات */}
									<div className='mt-4 pt-3 border-t border-gray-100 flex justify-between'>
										<div className='flex gap-2'>
											<Link
												href={`/dashboard/tailoring/tailors/${tailor.id}`}
												className='inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50'
											>
												<Eye className='ml-1 h-3 w-3' />
												عرض
											</Link>
											<button className='inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50'>
												<Edit className='ml-1 h-3 w-3' />
												تعديل
											</button>
										</div>
										<div className='flex gap-2'>
											<button className='inline-flex items-center px-2.5 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700'>
												<ClipboardList className='ml-1 h-3 w-3' />
												تعيين مهمة
											</button>
											<div className='relative group'>
												<button className='inline-flex items-center px-1.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50'>
													<MoreHorizontal className='h-3 w-3' />
												</button>
												<div className='absolute left-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
													<button className='block w-full text-right px-4 py-2 text-xs text-gray-700 hover:bg-gray-100'>
														<MessageSquare className='inline ml-1 h-3 w-3' />
														إرسال رسالة
													</button>
													<button className='block w-full text-right px-4 py-2 text-xs text-gray-700 hover:bg-gray-100'>
														<BarChart2 className='inline ml-1 h-3 w-3' />
														تقرير الأداء
													</button>
													<button className='block w-full text-right px-4 py-2 text-xs text-red-600 hover:bg-red-50'>
														<AlertCircle className='inline ml-1 h-3 w-3' />
														إيقاف مؤقت
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			) : (
				<div className='bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center'>
					<User className='h-12 w-12 text-gray-300 mx-auto mb-3' />
					<h3 className='text-lg font-medium text-gray-900'>لم يتم العثور على خياطين</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm ||
						filters.specialization !== 'all' ||
						filters.status !== 'all' ||
						filters.rating !== 'all' ||
						filters.availability !== 'all'
							? 'لم يتم العثور على خياطين تطابق معايير البحث المحددة'
							: 'لا يوجد خياطين مسجلين في النظام حالياً'}
					</p>
					<div className='mt-4'>
						<button className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'>
							<Plus className='ml-1 h-4 w-4' />
							إضافة خياط جديد
						</button>
					</div>
				</div>
			)}

			{/* ملخص الإحصائيات */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-4 border-b border-gray-200'>
					<h2 className='text-lg font-medium text-gray-900'>ملخص الإحصائيات</h2>
				</div>
				<div className='p-4'>
					<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
						<div className='bg-indigo-50 rounded-lg p-4'>
							<div className='flex items-center justify-between mb-3'>
								<h3 className='text-sm font-medium text-indigo-800'>إجمالي الخياطين</h3>
								<User className='h-5 w-5 text-indigo-600' />
							</div>
							<div className='flex items-end'>
								<span className='text-2xl font-bold text-indigo-700'>{tailors.length}</span>
								<span className='text-xs text-indigo-600 mr-2'>خياط</span>
							</div>
							<div className='mt-2 text-xs'>
								<span className='text-green-600'>
									{tailors.filter((t) => t.status === 'active').length} نشط
								</span>
								<span className='text-gray-500 mx-1'>•</span>
								<span className='text-amber-600'>
									{tailors.filter((t) => t.status === 'on_leave').length} في إجازة
								</span>
								<span className='text-gray-500 mx-1'>•</span>
								<span className='text-gray-600'>
									{tailors.filter((t) => t.status === 'inactive').length} غير نشط
								</span>
							</div>
						</div>

						<div className='bg-green-50 rounded-lg p-4'>
							<div className='flex items-center justify-between mb-3'>
								<h3 className='text-sm font-medium text-green-800'>المهام المكتملة</h3>
								<CheckCircle className='h-5 w-5 text-green-600' />
							</div>
							<div className='flex items-end'>
								<span className='text-2xl font-bold text-green-700'>
									{tailors.reduce((sum, tailor) => sum + tailor.stats.completedTasks, 0)}
								</span>
								<span className='text-xs text-green-600 mr-2'>مهمة</span>
							</div>
							<div className='mt-2 text-xs text-green-600'>
								{Math.round(
									tailors.reduce((sum, tailor) => sum + tailor.stats.completedTasks, 0) /
										(tailors.length || 1)
								)}{' '}
								مهمة لكل خياط في المتوسط
							</div>
						</div>

						<div className='bg-amber-50 rounded-lg p-4'>
							<div className='flex items-center justify-between mb-3'>
								<h3 className='text-sm font-medium text-amber-800'>المهام الحالية</h3>
								<Clock className='h-5 w-5 text-amber-600' />
							</div>
							<div className='flex items-end'>
								<span className='text-2xl font-bold text-amber-700'>
									{tailors.reduce((sum, tailor) => sum + tailor.stats.inProgressTasks, 0)}
								</span>
								<span className='text-xs text-amber-600 mr-2'>مهمة</span>
							</div>
							<div className='mt-2 text-xs text-amber-600'>
								{Math.round(
									tailors.reduce((sum, tailor) => sum + tailor.stats.inProgressTasks, 0) /
										(tailors.length || 1)
								)}{' '}
								مهمة لكل خياط في المتوسط
							</div>
						</div>

						<div className='bg-red-50 rounded-lg p-4'>
							<div className='flex items-center justify-between mb-3'>
								<h3 className='text-sm font-medium text-red-800'>المهام المتأخرة</h3>
								<AlertCircle className='h-5 w-5 text-red-600' />
							</div>
							<div className='flex items-end'>
								<span className='text-2xl font-bold text-red-700'>
									{tailors.reduce((sum, tailor) => sum + tailor.stats.delayedTasks, 0)}
								</span>
								<span className='text-xs text-red-600 mr-2'>مهمة</span>
							</div>
							<div className='mt-2 text-xs text-red-600'>
								{(
									(tailors.reduce((sum, tailor) => sum + tailor.stats.delayedTasks, 0) /
										(tailors.reduce((sum, tailor) => sum + tailor.stats.inProgressTasks, 0) || 1)) *
									100
								).toFixed(1)}
								% من المهام الحالية
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* روابط سريعة */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<Link
					href='/dashboard/tailoring/tasks'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
						<ClipboardList className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>جدول المهام</h3>
						<p className='text-sm text-gray-500'>إدارة وتوزيع المهام على الخياطين</p>
					</div>
					<ArrowUpRight className='mr-auto h-5 w-5 text-indigo-600' />
				</Link>

				<Link
					href='/dashboard/tailoring/stages'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
						<Activity className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>مراحل الإنتاج</h3>
						<p className='text-sm text-gray-500'>إدارة مراحل الإنتاج المختلفة</p>
					</div>
					<ArrowUpRight className='mr-auto h-5 w-5 text-indigo-600' />
				</Link>

				<Link
					href='/dashboard/tailoring/quality'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
						<CheckCircle className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>مراقبة الجودة</h3>
						<p className='text-sm text-gray-500'>معايير الجودة وتقارير فحص الجودة</p>
					</div>
					<ArrowUpRight className='mr-auto h-5 w-5 text-indigo-600' />
				</Link>
			</div>
		</div>
	);
}
