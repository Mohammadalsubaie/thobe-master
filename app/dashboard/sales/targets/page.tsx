'use client';

import {
	AlertCircle,
	Award,
	BarChart2,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	ClipboardList,
	Clock,
	Coffee,
	DollarSign,
	Edit,
	Eye,
	Flag,
	Plus,
	Search,
	Target,
	Trash,
	Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SalesTarget {
	id: string;
	title: string;
	type: 'revenue' | 'orders' | 'items';
	target: number;
	achieved: number;
	startDate: string;
	endDate: string;
	status: 'in_progress' | 'completed' | 'failed';
	assignedTo: 'all' | 'branch' | 'employee';
	branchId?: string;
	branchName?: string;
	employeeId?: string;
	employeeName?: string;
	progress: number;
	notes?: string;
	incentive?: string;
}

interface TargetSummary {
	totalTargets: number;
	activeTargets: number;
	completedTargets: number;
	overallProgress: number;
	revenueProgress: number;
	ordersProgress: number;
	itemsProgress: number;
}

export default function SalesTargetsPage() {
	const [targets, setTargets] = useState<SalesTarget[]>([]);
	const [filteredTargets, setFilteredTargets] = useState<SalesTarget[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedTarget, setExpandedTarget] = useState<string | null>(null);

	// فلترة
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [typeFilter, setTypeFilter] = useState('all');
	const [assigneeFilter, setAssigneeFilter] = useState('all');
	const [sortBy, setSortBy] = useState<'date' | 'progress' | 'target'>('date');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	// ملخص
	const [summary, setSummary] = useState<TargetSummary | null>(null);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// بيانات تجريبية لأهداف المبيعات
			const mockTargets: SalesTarget[] = [
				{
					id: 'target-001',
					title: 'هدف المبيعات الربع الثالث',
					type: 'revenue',
					target: 100000,
					achieved: 87500,
					startDate: '2023-07-01',
					endDate: '2023-09-30',
					status: 'completed',
					assignedTo: 'all',
					progress: 87.5,
					notes: 'تم تحقيق 87.5% من الهدف في الربع الثالث، وهو أداء جيد نظراً للظروف السوقية',
					incentive: 'مكافأة 5% من قيمة المبيعات التي تتجاوز الهدف',
				},
				{
					id: 'target-002',
					title: 'هدف مبيعات الثياب لشهر أكتوبر',
					type: 'revenue',
					target: 50000,
					achieved: 32500,
					startDate: '2023-10-01',
					endDate: '2023-10-31',
					status: 'in_progress',
					assignedTo: 'all',
					progress: 65,
					notes: 'التركيز على زيادة مبيعات الثياب الرجالية خلال شهر أكتوبر',
					incentive: 'مكافأة 3% من إجمالي المبيعات عند تحقيق الهدف',
				},
				{
					id: 'target-003',
					title: 'هدف مبيعات فرع الرياض',
					type: 'revenue',
					target: 75000,
					achieved: 62000,
					startDate: '2023-10-01',
					endDate: '2023-11-30',
					status: 'in_progress',
					assignedTo: 'branch',
					branchId: 'branch-001',
					branchName: 'فرع الرياض',
					progress: 82.7,
					incentive: 'مكافأة جماعية للفرع عند تحقيق الهدف',
				},
				{
					id: 'target-004',
					title: 'هدف عدد الطلبات اليومية',
					type: 'orders',
					target: 300,
					achieved: 237,
					startDate: '2023-10-01',
					endDate: '2023-10-31',
					status: 'in_progress',
					assignedTo: 'all',
					progress: 79,
					notes: 'زيادة متوسط عدد الطلبات اليومية إلى 10 طلبات على الأقل',
				},
				{
					id: 'target-005',
					title: 'هدف مبيعات أحمد محمد',
					type: 'revenue',
					target: 25000,
					achieved: 27500,
					startDate: '2023-10-01',
					endDate: '2023-10-31',
					status: 'completed',
					assignedTo: 'employee',
					employeeId: 'emp-001',
					employeeName: 'أحمد محمد',
					progress: 110,
					incentive: 'عمولة 2% من المبيعات التي تتجاوز الهدف',
				},
				{
					id: 'target-006',
					title: 'هدف مبيعات البشوت',
					type: 'items',
					target: 50,
					achieved: 23,
					startDate: '2023-10-01',
					endDate: '2023-11-15',
					status: 'in_progress',
					assignedTo: 'all',
					progress: 46,
					notes: 'التركيز على زيادة مبيعات البشوت خلال فصل الشتاء',
				},
				{
					id: 'target-007',
					title: 'هدف مبيعات فرع جدة',
					type: 'revenue',
					target: 60000,
					achieved: 35000,
					startDate: '2023-10-01',
					endDate: '2023-11-30',
					status: 'in_progress',
					assignedTo: 'branch',
					branchId: 'branch-002',
					branchName: 'فرع جدة',
					progress: 58.3,
					incentive: 'مكافأة جماعية للفرع عند تحقيق الهدف',
				},
				{
					id: 'target-008',
					title: 'هدف مبيعات فهد العتيبي',
					type: 'revenue',
					target: 20000,
					achieved: 9500,
					startDate: '2023-10-01',
					endDate: '2023-10-31',
					status: 'failed',
					assignedTo: 'employee',
					employeeId: 'emp-002',
					employeeName: 'فهد العتيبي',
					progress: 47.5,
					notes: 'لم يتمكن من تحقيق الهدف بسبب إجازته المرضية',
				},
				{
					id: 'target-009',
					title: 'هدف مبيعات الربع الرابع',
					type: 'revenue',
					target: 120000,
					achieved: 42000,
					startDate: '2023-10-01',
					endDate: '2023-12-31',
					status: 'in_progress',
					assignedTo: 'all',
					progress: 35,
					incentive: 'مكافأة 4% من إجمالي المبيعات عند تحقيق الهدف',
				},
			];

			// حساب الملخص
			const totalTargets = mockTargets.length;
			const activeTargets = mockTargets.filter((t) => t.status === 'in_progress').length;
			const completedTargets = mockTargets.filter((t) => t.status === 'completed').length;

			const overallProgress = Math.round(mockTargets.reduce((sum, t) => sum + t.progress, 0) / totalTargets);

			const revenueTargets = mockTargets.filter((t) => t.type === 'revenue');
			const revenueProgress = Math.round(
				revenueTargets.reduce((sum, t) => sum + t.progress, 0) / (revenueTargets.length || 1)
			);

			const ordersTargets = mockTargets.filter((t) => t.type === 'orders');
			const ordersProgress = Math.round(
				ordersTargets.reduce((sum, t) => sum + t.progress, 0) / (ordersTargets.length || 1)
			);

			const itemsTargets = mockTargets.filter((t) => t.type === 'items');
			const itemsProgress = Math.round(
				itemsTargets.reduce((sum, t) => sum + t.progress, 0) / (itemsTargets.length || 1)
			);

			const summaryData: TargetSummary = {
				totalTargets,
				activeTargets,
				completedTargets,
				overallProgress,
				revenueProgress,
				ordersProgress,
				itemsProgress,
			};

			setTargets(mockTargets);
			setFilteredTargets(mockTargets);
			setSummary(summaryData);

			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let result = [...targets];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(target) =>
					target.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(target.branchName && target.branchName.toLowerCase().includes(searchTerm.toLowerCase())) ||
					(target.employeeName && target.employeeName.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			result = result.filter((target) => target.status === statusFilter);
		}

		// تطبيق فلتر النوع
		if (typeFilter !== 'all') {
			result = result.filter((target) => target.type === typeFilter);
		}

		// تطبيق فلتر المسند إليه
		if (assigneeFilter !== 'all') {
			result = result.filter((target) => target.assignedTo === assigneeFilter);
		}

		// تطبيق الترتيب
		result.sort((a, b) => {
			if (sortBy === 'date') {
				return sortOrder === 'asc'
					? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
					: new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
			} else if (sortBy === 'progress') {
				return sortOrder === 'asc' ? a.progress - b.progress : b.progress - a.progress;
			} else {
				return sortOrder === 'asc' ? a.target - b.target : b.target - a.target;
			}
		});

		setFilteredTargets(result);
	}, [searchTerm, statusFilter, typeFilter, assigneeFilter, sortBy, sortOrder, targets]);

	// توسيع/طي تفاصيل الهدف
	const toggleTargetExpand = (targetId: string) => {
		if (expandedTarget === targetId) {
			setExpandedTarget(null);
		} else {
			setExpandedTarget(targetId);
		}
	};

	// عرض نوع الهدف
	const renderTargetTypeBadge = (type: string) => {
		switch (type) {
			case 'revenue':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						المبيعات
					</span>
				);
			case 'orders':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						الطلبات
					</span>
				);
			case 'items':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
						المنتجات
					</span>
				);
			default:
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						{type}
					</span>
				);
		}
	};

	// عرض حالة الهدف
	const renderTargetStatusBadge = (status: string) => {
		switch (status) {
			case 'in_progress':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						قيد التنفيذ
					</span>
				);
			case 'completed':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						مكتمل
					</span>
				);
			case 'failed':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						لم يتحقق
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

	// عرض الجهة المسند إليها الهدف
	const renderAssignee = (target: SalesTarget) => {
		switch (target.assignedTo) {
			case 'all':
				return <span className='text-gray-600'>جميع الفروع والموظفين</span>;
			case 'branch':
				return <span className='text-gray-600'>فرع: {target.branchName}</span>;
			case 'employee':
				return <span className='text-gray-600'>موظف: {target.employeeName}</span>;
			default:
				return <span className='text-gray-600'>{target.assignedTo}</span>;
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

	// عرض لون وأيقونة لنسبة التقدم
	const getProgressColor = (progress: number) => {
		if (progress >= 100) {
			return {
				text: 'text-green-600',
				bg: 'bg-green-600',
				icon: <CheckCircle className='h-4 w-4 text-green-600' />,
			};
		} else if (progress >= 75) {
			return {
				text: 'text-blue-600',
				bg: 'bg-blue-600',
				icon: <Target className='h-4 w-4 text-blue-600' />,
			};
		} else if (progress >= 50) {
			return {
				text: 'text-amber-600',
				bg: 'bg-amber-600',
				icon: <Clock className='h-4 w-4 text-amber-600' />,
			};
		} else {
			return {
				text: 'text-red-600',
				bg: 'bg-red-600',
				icon: <AlertCircle className='h-4 w-4 text-red-600' />,
			};
		}
	};

	// عرض القيمة بناءً على نوع الهدف
	const formatTargetValue = (target: SalesTarget) => {
		switch (target.type) {
			case 'revenue':
				return `${target.target.toLocaleString()} ر.س`;
			case 'orders':
				return `${target.target.toLocaleString()} طلب`;
			case 'items':
				return `${target.target.toLocaleString()} منتج`;
			default:
				return target.target.toLocaleString();
		}
	};

	// عرض القيمة المحققة بناءً على نوع الهدف
	const formatAchievedValue = (target: SalesTarget) => {
		switch (target.type) {
			case 'revenue':
				return `${target.achieved.toLocaleString()} ر.س`;
			case 'orders':
				return `${target.achieved.toLocaleString()} طلب`;
			case 'items':
				return `${target.achieved.toLocaleString()} منتج`;
			default:
				return target.achieved.toLocaleString();
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
						<Target className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						أهداف المبيعات
					</h1>
					<p className='mt-1 text-gray-500'>إدارة ومتابعة أهداف المبيعات للفروع والموظفين</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/sales/targets/analytics'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						تحليل الأداء
					</Link>
					<Link
						href='/dashboard/sales/targets/new'
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						<Plus className='ml-1 h-4 w-4' />
						هدف جديد
					</Link>
				</div>
			</div>

			{/* بطاقات الملخص */}
			{summary && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>الأهداف النشطة</p>
								<p className='text-2xl font-bold text-blue-600'>{summary.activeTargets}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600'>
								<Flag className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>من أصل {summary.totalTargets} هدف</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>نسبة الإنجاز الكلية</p>
								<p className='text-2xl font-bold text-indigo-600'>{summary.overallProgress}%</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
								<BarChart2 className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 flex items-center'>
							<div className='flex-1 bg-gray-200 rounded-full h-2'>
								<div
									className='bg-indigo-600 h-2 rounded-full'
									style={{ width: `${summary.overallProgress}%` }}
								></div>
							</div>
							<span className='text-xs text-gray-500 mr-2'>{summary.overallProgress}%</span>
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>أهداف المبيعات</p>
								<p className='text-2xl font-bold text-green-600'>{summary.revenueProgress}%</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
								<DollarSign className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 flex items-center'>
							<div className='flex-1 bg-gray-200 rounded-full h-2'>
								<div
									className='bg-green-600 h-2 rounded-full'
									style={{ width: `${summary.revenueProgress}%` }}
								></div>
							</div>
							<span className='text-xs text-gray-500 mr-2'>{summary.revenueProgress}%</span>
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>الأهداف المكتملة</p>
								<p className='text-2xl font-bold text-amber-600'>{summary.completedTargets}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
								<Award className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>
							بنسبة {Math.round((summary.completedTargets / summary.totalTargets) * 100)}% من إجمالي
							الأهداف
						</div>
					</div>
				</div>
			)}

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
					{/* البحث */}
					<div className='relative'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='بحث عن عنوان الهدف أو الفرع أو الموظف...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						/>
					</div>

					{/* فلتر الحالة */}
					<div className='relative'>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الحالات</option>
							<option value='in_progress'>قيد التنفيذ</option>
							<option value='completed'>مكتمل</option>
							<option value='failed'>لم يتحقق</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر النوع */}
					<div className='relative'>
						<select
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع أنواع الأهداف</option>
							<option value='revenue'>المبيعات</option>
							<option value='orders'>الطلبات</option>
							<option value='items'>المنتجات</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر المسند إليه */}
					<div className='relative'>
						<select
							value={assigneeFilter}
							onChange={(e) => setAssigneeFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>الكل</option>
							<option value='branch'>الفروع</option>
							<option value='employee'>الموظفين</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* الترتيب */}
					<div className='relative'>
						<select
							value={`${sortBy}_${sortOrder}`}
							onChange={(e) => {
								const [newSortBy, newSortOrder] = e.target.value.split('_');
								setSortBy(newSortBy as 'date' | 'progress' | 'target');
								setSortOrder(newSortOrder as 'asc' | 'desc');
							}}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='date_desc'>الأحدث أولاً</option>
							<option value='date_asc'>الأقدم أولاً</option>
							<option value='progress_desc'>الأعلى تقدماً</option>
							<option value='progress_asc'>الأقل تقدماً</option>
							<option value='target_desc'>الأكبر قيمة</option>
							<option value='target_asc'>الأقل قيمة</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>
				</div>

				{/* معلومات الفلترة */}
				<div className='mt-4 pt-3 border-t border-gray-200'>
					<div className='flex justify-between items-center'>
						<span className='text-sm text-gray-500'>
							عرض {filteredTargets.length} من {targets.length} هدف
						</span>

						{(searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || assigneeFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setStatusFilter('all');
									setTypeFilter('all');
									setAssigneeFilter('all');
								}}
								className='text-xs text-indigo-600 hover:text-indigo-800'
							>
								مسح الفلاتر
							</button>
						)}
					</div>
				</div>
			</div>

			{/* قائمة الأهداف */}
			{filteredTargets.length > 0 ? (
				<div className='space-y-4'>
					{filteredTargets.map((target) => {
						const progressStyle = getProgressColor(target.progress);

						return (
							<div
								key={target.id}
								className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'
							>
								<div className='p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
									<div className='flex-1'>
										<div className='flex items-start'>
											<div className='flex-1'>
												<button
													onClick={() => toggleTargetExpand(target.id)}
													className='text-lg font-medium text-gray-900 hover:text-indigo-600 focus:outline-none text-right'
												>
													{target.title}
												</button>
												<div className='mt-1 flex flex-wrap gap-2'>
													{renderTargetTypeBadge(target.type)}
													{renderTargetStatusBadge(target.status)}
													<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
														{renderAssignee(target)}
													</span>
												</div>
											</div>
										</div>
									</div>

									<div className='flex flex-col md:flex-row items-center gap-4'>
										{/* قيمة الهدف والمحقق */}
										<div className='flex flex-col items-center md:items-start'>
											<div className='text-sm text-gray-500'>الهدف / المحقق</div>
											<div className='font-medium'>
												<span className={progressStyle.text}>
													{formatAchievedValue(target)}
												</span>
												<span className='text-gray-500 mx-1'>/</span>
												<span>{formatTargetValue(target)}</span>
											</div>
										</div>

										{/* نسبة التقدم */}
										<div className='w-56'>
											<div className='flex justify-between items-center mb-1'>
												<div className='flex items-center'>
													{progressStyle.icon}
													<span className={`text-xs font-medium mr-1 ${progressStyle.text}`}>
														{target.progress}% مكتمل
													</span>
												</div>
												<span className='text-xs text-gray-500'>
													{formatDate(target.endDate)}
												</span>
											</div>
											<div className='w-full bg-gray-200 rounded-full h-2'>
												<div
													className={`${progressStyle.bg} h-2 rounded-full`}
													style={{ width: `${Math.min(100, target.progress)}%` }}
												></div>
											</div>
										</div>

										{/* زر التفاصيل */}
										<button
											onClick={() => toggleTargetExpand(target.id)}
											className='px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center'
										>
											{expandedTarget === target.id ? (
												<>
													<ChevronUp className='ml-1 h-4 w-4' />
													إخفاء
												</>
											) : (
												<>
													<ChevronDown className='ml-1 h-4 w-4' />
													التفاصيل
												</>
											)}
										</button>
									</div>
								</div>

								{/* تفاصيل الهدف الموسعة */}
								{expandedTarget === target.id && (
									<div className='border-t border-gray-200 bg-gray-50 p-4 animate-fadeIn'>
										<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>تفاصيل الهدف</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-1 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>نوع الهدف:</p>
															<p className='font-medium text-gray-900'>
																{target.type === 'revenue'
																	? 'هدف مبيعات (مالي)'
																	: target.type === 'orders'
																	? 'هدف عدد طلبات'
																	: 'هدف عدد منتجات مباعة'}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>مسند إلى:</p>
															<p className='font-medium text-gray-900'>
																{target.assignedTo === 'all'
																	? 'جميع الفروع والموظفين'
																	: target.assignedTo === 'branch'
																	? `فرع: ${target.branchName}`
																	: `موظف: ${target.employeeName}`}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>الحالة:</p>
															<div>{renderTargetStatusBadge(target.status)}</div>
														</div>
													</div>
												</div>
											</div>

											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													القيم والتقدم
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-1 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>القيمة المستهدفة:</p>
															<p className='font-medium text-gray-900'>
																{formatTargetValue(target)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>القيمة المحققة:</p>
															<p className={`font-medium ${progressStyle.text}`}>
																{formatAchievedValue(target)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>نسبة الإنجاز:</p>
															<div className='flex items-center'>
																<div className='w-24 bg-gray-200 rounded-full h-2 ml-2'>
																	<div
																		className={`${progressStyle.bg} h-2 rounded-full`}
																		style={{
																			width: `${Math.min(100, target.progress)}%`,
																		}}
																	></div>
																</div>
																<span className={`font-medium ${progressStyle.text}`}>
																	{target.progress}%
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													الفترة الزمنية
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-1 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>تاريخ البدء:</p>
															<p className='font-medium text-gray-900'>
																{formatDate(target.startDate)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>تاريخ الانتهاء:</p>
															<p className='font-medium text-gray-900'>
																{formatDate(target.endDate)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>المدة:</p>
															<p className='font-medium text-gray-900'>
																{Math.ceil(
																	(new Date(target.endDate).getTime() -
																		new Date(target.startDate).getTime()) /
																		(1000 * 60 * 60 * 24)
																)}{' '}
																يوم
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>

										{/* معلومات إضافية */}
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											{target.notes && (
												<div>
													<h4 className='text-sm font-medium text-gray-500 mb-1'>ملاحظات</h4>
													<div className='bg-white p-3 rounded-md border border-gray-200 text-sm text-gray-600'>
														{target.notes}
													</div>
												</div>
											)}

											{target.incentive && (
												<div>
													<h4 className='text-sm font-medium text-gray-500 mb-1'>الحوافز</h4>
													<div className='bg-white p-3 rounded-md border border-gray-200 text-sm text-gray-600'>
														{target.incentive}
													</div>
												</div>
											)}
										</div>

										{/* أزرار الإجراءات */}
										<div className='mt-4 flex flex-wrap gap-2'>
											<Link
												href={`/dashboard/sales/targets/${target.id}`}
												className='px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center'
											>
												<Eye className='ml-1 h-4 w-4' />
												عرض التفاصيل الكاملة
											</Link>
											<Link
												href={`/dashboard/sales/targets/${target.id}/edit`}
												className='px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center'
											>
												<Edit className='ml-1 h-4 w-4' />
												تعديل الهدف
											</Link>
											<Link
												href={`/dashboard/sales/targets/${target.id}/progress`}
												className='px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center'
											>
												<Target className='ml-1 h-4 w-4' />
												تحديث التقدم
											</Link>
											{target.status === 'in_progress' && (
												<button className='px-3 py-1.5 border border-red-300 text-red-700 rounded-md hover:bg-red-50 text-sm flex items-center'>
													<Trash className='ml-1 h-4 w-4' />
													حذف الهدف
												</button>
											)}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			) : (
				<div className='bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center'>
					<Target className='h-12 w-12 text-gray-300 mx-auto mb-3' />
					<h3 className='text-lg font-medium text-gray-900'>لا توجد أهداف مبيعات</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm || statusFilter !== 'all' || typeFilter !== 'all' || assigneeFilter !== 'all'
							? 'لم يتم العثور على أهداف تطابق معايير البحث المحددة'
							: 'لا توجد أهداف مبيعات مسجلة في النظام. قم بإنشاء هدف جديد للبدء.'}
					</p>
					<div className='mt-4'>
						<Link
							href='/dashboard/sales/targets/new'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
						>
							<Plus className='ml-1 h-4 w-4' />
							إنشاء هدف جديد
						</Link>
					</div>
				</div>
			)}

			{/* تحليل أداء الأهداف */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='text-lg font-medium text-gray-900'>تحليل أداء الأهداف</h2>
					<Link
						href='/dashboard/sales/targets/analytics'
						className='text-sm text-indigo-600 hover:text-indigo-800 flex items-center'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						عرض تقرير مفصل
					</Link>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					{/* أداء أهداف المبيعات */}
					<div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
						<div className='flex justify-between items-center mb-2'>
							<h3 className='text-base font-medium text-gray-900'>أهداف المبيعات</h3>
							<DollarSign className='h-5 w-5 text-green-600' />
						</div>
						<div className='space-y-3'>
							{targets
								.filter((t) => t.type === 'revenue' && t.status === 'in_progress')
								.sort((a, b) => b.progress - a.progress)
								.slice(0, 3)
								.map((target, index) => {
									const progressColor = getProgressColor(target.progress);

									return (
										<div key={index} className='bg-white p-2 rounded-md border border-gray-200'>
											<div className='flex justify-between text-sm mb-1'>
												<span className='font-medium text-gray-900 truncate'>
													{target.title}
												</span>
												<span className={progressColor.text}>{target.progress}%</span>
											</div>
											<div className='w-full bg-gray-200 rounded-full h-1.5'>
												<div
													className={`${progressColor.bg} h-1.5 rounded-full`}
													style={{ width: `${Math.min(100, target.progress)}%` }}
												></div>
											</div>
											<div className='mt-1 flex justify-between text-xs text-gray-500'>
												<span>{formatAchievedValue(target)}</span>
												<span>الهدف: {formatTargetValue(target)}</span>
											</div>
										</div>
									);
								})}
						</div>
						<div className='mt-2 text-center'>
							<Link
								href='/dashboard/sales/targets/revenue'
								className='text-xs text-indigo-600 hover:text-indigo-800'
							>
								عرض جميع أهداف المبيعات ({targets.filter((t) => t.type === 'revenue').length})
							</Link>
						</div>
					</div>

					{/* أداء أهداف الطلبات */}
					<div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
						<div className='flex justify-between items-center mb-2'>
							<h3 className='text-base font-medium text-gray-900'>أهداف الطلبات</h3>
							<ClipboardList className='h-5 w-5 text-blue-600' />
						</div>
						<div className='space-y-3'>
							{targets
								.filter((t) => t.type === 'orders' && t.status === 'in_progress')
								.sort((a, b) => b.progress - a.progress)
								.slice(0, 3)
								.map((target, index) => {
									const progressColor = getProgressColor(target.progress);

									return (
										<div key={index} className='bg-white p-2 rounded-md border border-gray-200'>
											<div className='flex justify-between text-sm mb-1'>
												<span className='font-medium text-gray-900 truncate'>
													{target.title}
												</span>
												<span className={progressColor.text}>{target.progress}%</span>
											</div>
											<div className='w-full bg-gray-200 rounded-full h-1.5'>
												<div
													className={`${progressColor.bg} h-1.5 rounded-full`}
													style={{ width: `${Math.min(100, target.progress)}%` }}
												></div>
											</div>
											<div className='mt-1 flex justify-between text-xs text-gray-500'>
												<span>{formatAchievedValue(target)}</span>
												<span>الهدف: {formatTargetValue(target)}</span>
											</div>
										</div>
									);
								})}
						</div>
						<div className='mt-2 text-center'>
							<Link
								href='/dashboard/sales/targets/orders'
								className='text-xs text-indigo-600 hover:text-indigo-800'
							>
								عرض جميع أهداف الطلبات ({targets.filter((t) => t.type === 'orders').length})
							</Link>
						</div>
					</div>

					{/* أفضل أداء للفروع */}
					<div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
						<div className='flex justify-between items-center mb-2'>
							<h3 className='text-base font-medium text-gray-900'>أداء الفروع</h3>
							<Coffee className='h-5 w-5 text-amber-600' />
						</div>
						<div className='space-y-3'>
							{targets
								.filter((t) => t.assignedTo === 'branch' && t.status === 'in_progress')
								.sort((a, b) => b.progress - a.progress)
								.slice(0, 3)
								.map((target, index) => {
									const progressColor = getProgressColor(target.progress);

									return (
										<div key={index} className='bg-white p-2 rounded-md border border-gray-200'>
											<div className='flex justify-between text-sm mb-1'>
												<span className='font-medium text-gray-900 truncate'>
													{target.branchName}
												</span>
												<span className={progressColor.text}>{target.progress}%</span>
											</div>
											<div className='w-full bg-gray-200 rounded-full h-1.5'>
												<div
													className={`${progressColor.bg} h-1.5 rounded-full`}
													style={{ width: `${Math.min(100, target.progress)}%` }}
												></div>
											</div>
											<div className='mt-1 flex justify-between text-xs text-gray-500'>
												<span className='truncate'>{target.title}</span>
												<span>
													{formatAchievedValue(target)} / {formatTargetValue(target)}
												</span>
											</div>
										</div>
									);
								})}
						</div>
						<div className='mt-2 text-center'>
							<Link
								href='/dashboard/sales/targets/branches'
								className='text-xs text-indigo-600 hover:text-indigo-800'
							>
								عرض أداء جميع الفروع ({targets.filter((t) => t.assignedTo === 'branch').length})
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* روابط سريعة */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Link
					href='/dashboard/sales/targets/new'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
						<Plus className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>هدف جديد</h3>
						<p className='text-sm text-gray-500'>إنشاء هدف مبيعات جديد</p>
					</div>
				</Link>

				<Link
					href='/dashboard/sales/targets/analytics'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
						<BarChart2 className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>تحليل الأداء</h3>
						<p className='text-sm text-gray-500'>تقارير تفصيلية عن الأداء</p>
					</div>
				</Link>

				<Link
					href='/dashboard/sales/targets/employees'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
						<Users className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>أداء الموظفين</h3>
						<p className='text-sm text-gray-500'>متابعة أداء الموظفين</p>
					</div>
				</Link>

				<Link
					href='/dashboard/sales/targets/settings'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ml-3'>
						<Award className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>الحوافز</h3>
						<p className='text-sm text-gray-500'>إدارة حوافز تحقيق الأهداف</p>
					</div>
				</Link>
			</div>
		</div>
	);
}
