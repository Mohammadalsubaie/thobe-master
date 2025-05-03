'use client';

import {
	AlertCircle,
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ArrowUp,
	ArrowUpDown,
	Calendar,
	CheckCircle,
	ChevronDown,
	ChevronRight,
	ClipboardList,
	Clock,
	Edit,
	Eye,
	MoreHorizontal,
	Plus,
	Search,
	User,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TailoringTask {
	id: string;
	orderNumber: string;
	clientName: string;
	productName: string;
	currentStage: string;
	priority: 'low' | 'medium' | 'high' | 'urgent';
	assignedTo: {
		id: string;
		name: string;
		avatar?: string;
	} | null;
	status: 'pending' | 'in_progress' | 'completed' | 'delayed' | 'on_hold';
	dueDate: string;
	completionPercentage: number;
	createdAt: string;
	updatedAt?: string;
}

interface TailoringStage {
	id: string;
	name: string;
	order: number;
	color: string;
	tasksCount: number;
}

interface TailoringTailor {
	id: string;
	name: string;
	avatar?: string;
	tasksCount: number;
	specialization: string[];
}

export default function TailoringTasksPage() {
	const [loading, setLoading] = useState(true);
	const [tasks, setTasks] = useState<TailoringTask[]>([]);
	const [filteredTasks, setFilteredTasks] = useState<TailoringTask[]>([]);
	const [stages, setStages] = useState<TailoringStage[]>([]);
	const [tailors, setTailors] = useState<TailoringTailor[]>([]);

	// فلاتر
	const [searchTerm, setSearchTerm] = useState('');
	const [stageFilter, setStageFilter] = useState('all');
	const [tailorFilter, setTailorFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [priorityFilter, setPriorityFilter] = useState('all');
	const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt'>('dueDate');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
	const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

	// تقسيم المهام حسب المراحل (للعرض اللوحي)
	const [tasksByStage, setTasksByStage] = useState<Record<string, TailoringTask[]>>({});

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية للمراحل
			const mockStages: TailoringStage[] = [
				{ id: 'stage-1', name: 'القياس', order: 1, color: 'blue', tasksCount: 5 },
				{ id: 'stage-2', name: 'القص', order: 2, color: 'amber', tasksCount: 7 },
				{ id: 'stage-3', name: 'الخياطة', order: 3, color: 'green', tasksCount: 10 },
				{ id: 'stage-4', name: 'التطريز', order: 4, color: 'purple', tasksCount: 4 },
				{ id: 'stage-5', name: 'الكي والتشطيب', order: 5, color: 'red', tasksCount: 8 },
			];

			// بيانات تجريبية للخياطين
			const mockTailors: TailoringTailor[] = [
				{ id: 'tailor-1', name: 'أحمد محمد', tasksCount: 5, specialization: ['القياس', 'القص'] },
				{ id: 'tailor-2', name: 'خالد العمري', tasksCount: 4, specialization: ['الخياطة', 'التطريز'] },
				{ id: 'tailor-3', name: 'سعيد الزهراني', tasksCount: 6, specialization: ['القص', 'الخياطة'] },
				{ id: 'tailor-4', name: 'فهد القرني', tasksCount: 3, specialization: ['التطريز'] },
				{ id: 'tailor-5', name: 'محمد الشهري', tasksCount: 7, specialization: ['الكي والتشطيب'] },
			];

			// بيانات تجريبية للمهام
			const mockTasks: TailoringTask[] = [
				{
					id: 'task-1',
					orderNumber: 'ORD-1245',
					clientName: 'عبدالله محمد',
					productName: 'ثوب كلاسيك',
					currentStage: 'stage-1',
					priority: 'high',
					assignedTo: { id: 'tailor-1', name: 'أحمد محمد' },
					status: 'in_progress',
					dueDate: '2023-10-10',
					completionPercentage: 25,
					createdAt: '2023-10-01',
				},
				{
					id: 'task-2',
					orderNumber: 'ORD-1246',
					clientName: 'فهد العتيبي',
					productName: 'ثوب مغربي',
					currentStage: 'stage-2',
					priority: 'medium',
					assignedTo: { id: 'tailor-3', name: 'سعيد الزهراني' },
					status: 'pending',
					dueDate: '2023-10-15',
					completionPercentage: 0,
					createdAt: '2023-10-02',
				},
				{
					id: 'task-3',
					orderNumber: 'ORD-1247',
					clientName: 'محمد العنزي',
					productName: 'ثوب إماراتي',
					currentStage: 'stage-3',
					priority: 'urgent',
					assignedTo: { id: 'tailor-2', name: 'خالد العمري' },
					status: 'in_progress',
					dueDate: '2023-10-08',
					completionPercentage: 60,
					createdAt: '2023-09-29',
				},
				{
					id: 'task-4',
					orderNumber: 'ORD-1248',
					clientName: 'سلطان السلمي',
					productName: 'بشت ملكي',
					currentStage: 'stage-4',
					priority: 'high',
					assignedTo: { id: 'tailor-4', name: 'فهد القرني' },
					status: 'in_progress',
					dueDate: '2023-10-20',
					completionPercentage: 45,
					createdAt: '2023-10-05',
				},
				{
					id: 'task-5',
					orderNumber: 'ORD-1249',
					clientName: 'خالد المالكي',
					productName: 'ثوب بقصة عصرية',
					currentStage: 'stage-5',
					priority: 'medium',
					assignedTo: { id: 'tailor-5', name: 'محمد الشهري' },
					status: 'completed',
					dueDate: '2023-10-07',
					completionPercentage: 100,
					createdAt: '2023-09-28',
				},
				{
					id: 'task-6',
					orderNumber: 'ORD-1250',
					clientName: 'عبدالرحمن الشهري',
					productName: 'ثوب كلاسيك',
					currentStage: 'stage-2',
					priority: 'low',
					assignedTo: { id: 'tailor-3', name: 'سعيد الزهراني' },
					status: 'on_hold',
					dueDate: '2023-10-25',
					completionPercentage: 15,
					createdAt: '2023-10-06',
				},
				{
					id: 'task-7',
					orderNumber: 'ORD-1251',
					clientName: 'ماجد الدوسري',
					productName: 'ثوب نجدي',
					currentStage: 'stage-3',
					priority: 'urgent',
					assignedTo: { id: 'tailor-2', name: 'خالد العمري' },
					status: 'delayed',
					dueDate: '2023-10-05',
					completionPercentage: 30,
					createdAt: '2023-09-27',
				},
				{
					id: 'task-8',
					orderNumber: 'ORD-1252',
					clientName: 'عبدالعزيز الغامدي',
					productName: 'ثوب حجازي',
					currentStage: 'stage-1',
					priority: 'high',
					assignedTo: { id: 'tailor-1', name: 'أحمد محمد' },
					status: 'in_progress',
					dueDate: '2023-10-12',
					completionPercentage: 10,
					createdAt: '2023-10-03',
				},
				{
					id: 'task-9',
					orderNumber: 'ORD-1253',
					clientName: 'سعد القحطاني',
					productName: 'بشت شتوي',
					currentStage: 'stage-2',
					priority: 'medium',
					assignedTo: null,
					status: 'pending',
					dueDate: '2023-10-28',
					completionPercentage: 0,
					createdAt: '2023-10-07',
				},
				{
					id: 'task-10',
					orderNumber: 'ORD-1254',
					clientName: 'صالح الحربي',
					productName: 'ثوب رسمي',
					currentStage: 'stage-5',
					priority: 'high',
					assignedTo: { id: 'tailor-5', name: 'محمد الشهري' },
					status: 'in_progress',
					dueDate: '2023-10-15',
					completionPercentage: 90,
					createdAt: '2023-10-01',
				},
			];

			setStages(mockStages);
			setTailors(mockTailors);
			setTasks(mockTasks);
			setFilteredTasks(mockTasks);

			// تحضير المهام حسب المراحل للعرض اللوحي
			const tasksByStageObj: Record<string, TailoringTask[]> = {};
			mockStages.forEach((stage) => {
				tasksByStageObj[stage.id] = mockTasks.filter((task) => task.currentStage === stage.id);
			});
			setTasksByStage(tasksByStageObj);

			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let result = [...tasks];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(task) =>
					task.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
					task.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					task.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(task.assignedTo && task.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		// تطبيق فلتر المرحلة
		if (stageFilter !== 'all') {
			result = result.filter((task) => task.currentStage === stageFilter);
		}

		// تطبيق فلتر الخياط
		if (tailorFilter !== 'all') {
			result = result.filter((task) => task.assignedTo && task.assignedTo.id === tailorFilter);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			result = result.filter((task) => task.status === statusFilter);
		}

		// تطبيق فلتر الأولوية
		if (priorityFilter !== 'all') {
			result = result.filter((task) => task.priority === priorityFilter);
		}

		// تطبيق الترتيب
		result.sort((a, b) => {
			if (sortBy === 'dueDate') {
				return sortOrder === 'asc'
					? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
					: new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
			} else if (sortBy === 'priority') {
				const priorityOrder = { urgent: 3, high: 2, medium: 1, low: 0 };
				// @ts-ignore - handling priority values
				return sortOrder === 'asc'
					? priorityOrder[a.priority] - priorityOrder[b.priority]
					: priorityOrder[b.priority] - priorityOrder[a.priority];
			} else {
				return sortOrder === 'asc'
					? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					: new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			}
		});

		setFilteredTasks(result);

		// تحديث المهام حسب المراحل للعرض اللوحي
		if (viewMode === 'board') {
			const filteredTasksByStage: Record<string, TailoringTask[]> = {};
			stages.forEach((stage) => {
				filteredTasksByStage[stage.id] = result.filter((task) => task.currentStage === stage.id);
			});
			setTasksByStage(filteredTasksByStage);
		}
	}, [
		tasks,
		searchTerm,
		stageFilter,
		tailorFilter,
		statusFilter,
		priorityFilter,
		sortBy,
		sortOrder,
		stages,
		viewMode,
	]);

	// تنسيق التاريخ
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
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

	// عرض شارة الحالة
	const renderStatusBadge = (status: string) => {
		switch (status) {
			case 'pending':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						قيد الانتظار
					</span>
				);
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
			case 'delayed':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						متأخر
					</span>
				);
			case 'on_hold':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800'>
						معلق
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

	// عرض شارة المرحلة
	const renderStageBadge = (stageId: string) => {
		const stage = stages.find((s) => s.id === stageId);
		if (!stage) return null;

		let bgColor = 'bg-gray-100';
		let textColor = 'text-gray-800';

		switch (stage.color) {
			case 'blue':
				bgColor = 'bg-blue-100';
				textColor = 'text-blue-800';
				break;
			case 'green':
				bgColor = 'bg-green-100';
				textColor = 'text-green-800';
				break;
			case 'amber':
				bgColor = 'bg-amber-100';
				textColor = 'text-amber-800';
				break;
			case 'purple':
				bgColor = 'bg-purple-100';
				textColor = 'text-purple-800';
				break;
			case 'red':
				bgColor = 'bg-red-100';
				textColor = 'text-red-800';
				break;
		}

		return (
			<span
				className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
			>
				{stage.name}
			</span>
		);
	};

	// عرض شريط نسبة الإكمال
	const renderProgressBar = (percentage: number) => {
		let bgColor = 'bg-blue-600';

		if (percentage < 25) {
			bgColor = 'bg-red-600';
		} else if (percentage < 50) {
			bgColor = 'bg-amber-600';
		} else if (percentage < 75) {
			bgColor = 'bg-green-600';
		}

		return (
			<div className='flex items-center'>
				<div className='w-full bg-gray-200 rounded-full h-2 ml-2'>
					<div className={`h-2 rounded-full ${bgColor}`} style={{ width: `${percentage}%` }}></div>
				</div>
				<span className='text-xs text-gray-600'>{percentage}%</span>
			</div>
		);
	};

	// تغيير حالة المهمة (محاكاة)
	const handleStatusChange = (taskId: string, newStatus: string) => {
		setTasks((prevTasks) =>
			prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus as any } : task))
		);
	};

	// تعيين خياط للمهمة (محاكاة)
	const handleAssignTailor = (taskId: string, tailorId: string) => {
		const tailor = tailors.find((t) => t.id === tailorId);
		if (!tailor) return;

		setTasks((prevTasks) =>
			prevTasks.map((task) =>
				task.id === taskId
					? {
							...task,
							assignedTo: {
								id: tailor.id,
								name: tailor.name,
								avatar: tailor.avatar,
							},
					  }
					: task
			)
		);
	};

	// تغيير مرحلة المهمة (محاكاة)
	const handleStageChange = (taskId: string, newStageId: string) => {
		setTasks((prevTasks) =>
			prevTasks.map((task) => (task.id === taskId ? { ...task, currentStage: newStageId } : task))
		);
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
						<ClipboardList className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						جدول مهام الخياطة
					</h1>
					<p className='mt-1 text-gray-500'>إدارة وتتبع مهام الخياطة حسب المراحل والأولويات</p>
				</div>

				<div className='flex items-center gap-2'>
					<button
						onClick={() => setViewMode('list')}
						className={`p-2 rounded-md ${
							viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
						}`}
						title='عرض القائمة'
					>
						<ClipboardList className='h-5 w-5' />
					</button>
					<button
						onClick={() => setViewMode('board')}
						className={`p-2 rounded-md ${
							viewMode === 'board' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'
						}`}
						title='عرض اللوحة'
					>
						<div className='h-5 w-5 grid grid-cols-2 gap-0.5'>
							<div className='bg-current rounded-sm'></div>
							<div className='bg-current rounded-sm'></div>
							<div className='bg-current rounded-sm'></div>
							<div className='bg-current rounded-sm'></div>
						</div>
					</button>
					<button className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'>
						<Plus className='ml-1 h-4 w-4' />
						مهمة جديدة
					</button>
				</div>
			</div>

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4'>
					{/* البحث */}
					<div className='relative lg:col-span-2'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='بحث عن رقم الطلب أو العميل أو المنتج...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						/>
					</div>

					{/* فلتر المرحلة */}
					<div className='relative'>
						<select
							value={stageFilter}
							onChange={(e) => setStageFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع المراحل</option>
							{stages.map((stage) => (
								<option key={stage.id} value={stage.id}>
									{stage.name} ({stage.tasksCount})
								</option>
							))}
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر الخياط */}
					<div className='relative'>
						<select
							value={tailorFilter}
							onChange={(e) => setTailorFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الخياطين</option>
							<option value='unassigned'>غير معين</option>
							{tailors.map((tailor) => (
								<option key={tailor.id} value={tailor.id}>
									{tailor.name} ({tailor.tasksCount})
								</option>
							))}
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
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الحالات</option>
							<option value='pending'>قيد الانتظار</option>
							<option value='in_progress'>قيد التنفيذ</option>
							<option value='completed'>مكتمل</option>
							<option value='delayed'>متأخر</option>
							<option value='on_hold'>معلق</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر الأولوية */}
					<div className='relative'>
						<select
							value={priorityFilter}
							onChange={(e) => setPriorityFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الأولويات</option>
							<option value='urgent'>عاجل</option>
							<option value='high'>مرتفع</option>
							<option value='medium'>متوسط</option>
							<option value='low'>منخفض</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>
				</div>

				{/* خيارات الفرز ومعلومات إضافية */}
				<div className='flex flex-col sm:flex-row justify-between mt-4 pt-4 border-t border-gray-200'>
					<div className='flex items-center mb-2 sm:mb-0'>
						<span className='text-sm text-gray-500'>
							عرض {filteredTasks.length} من {tasks.length} مهمة
						</span>
						{(searchTerm ||
							stageFilter !== 'all' ||
							tailorFilter !== 'all' ||
							statusFilter !== 'all' ||
							priorityFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setStageFilter('all');
									setTailorFilter('all');
									setStatusFilter('all');
									setPriorityFilter('all');
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
								onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority' | 'createdAt')}
								className='appearance-none border border-gray-300 rounded-md py-1 pl-8 pr-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
							>
								<option value='dueDate'>تاريخ الاستحقاق</option>
								<option value='priority'>الأولوية</option>
								<option value='createdAt'>تاريخ الإنشاء</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ArrowUpDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>

						<button
							onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
							className='p-1 border border-gray-300 rounded-md'
						>
							{sortOrder === 'asc' ? (
								<ArrowUp className='h-4 w-4 text-gray-600' />
							) : (
								<ArrowDown className='h-4 w-4 text-gray-600' />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* عرض المهام (القائمة) */}
			{viewMode === 'list' && (
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					{filteredTasks.length > 0 ? (
						<div className='overflow-x-auto'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50'>
									<tr>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											رقم الطلب
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											العميل / المنتج
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											المرحلة
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											الخياط
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
											الأولوية
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											التاريخ المتوقع
										</th>
										<th
											scope='col'
											className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
										>
											نسبة الإنجاز
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
									{filteredTasks.map((task) => (
										<tr key={task.id} className='hover:bg-gray-50'>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='flex items-center'>
													<div className='text-sm font-medium text-indigo-600'>
														{task.orderNumber}
													</div>
												</div>
											</td>
											<td className='px-6 py-4'>
												<div className='text-sm font-medium text-gray-900'>
													{task.clientName}
												</div>
												<div className='text-sm text-gray-500'>{task.productName}</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{renderStageBadge(task.currentStage)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{task.assignedTo ? (
													<div className='flex items-center'>
														<div className='flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center ml-2'>
															{task.assignedTo.avatar ? (
																<img
																	src={task.assignedTo.avatar}
																	alt={task.assignedTo.name}
																	className='h-8 w-8 rounded-full'
																/>
															) : (
																<User className='h-4 w-4 text-gray-500' />
															)}
														</div>
														<div className='text-sm font-medium text-gray-900'>
															{task.assignedTo.name}
														</div>
													</div>
												) : (
													<div className='flex'>
														<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
															غير معين
														</span>
														<button className='mr-2 text-xs text-indigo-600 hover:text-indigo-800'>
															تعيين
														</button>
													</div>
												)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{renderStatusBadge(task.status)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{renderPriorityBadge(task.priority)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='flex items-center'>
													<Calendar className='h-4 w-4 text-gray-400 ml-1' />
													<span className='text-sm text-gray-500'>
														{formatDate(task.dueDate)}
													</span>
												</div>
											</td>
											<td className='px-6 py-4'>
												{renderProgressBar(task.completionPercentage)}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
												<div className='flex items-center justify-center space-x-2 space-x-reverse'>
													<Link
														href={`/dashboard/tailoring/tasks/${task.id}`}
														className='text-indigo-600 hover:text-indigo-900'
														title='عرض التفاصيل'
													>
														<Eye className='h-5 w-5' />
													</Link>
													<button
														className='text-yellow-600 hover:text-yellow-900'
														title='تعديل'
													>
														<Edit className='h-5 w-5' />
													</button>
													<div className='relative group'>
														<button
															className='text-gray-500 hover:text-gray-700'
															title='المزيد من الخيارات'
														>
															<MoreHorizontal className='h-5 w-5' />
														</button>
														<div className='absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
															<button className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
																تغيير المرحلة
															</button>
															<button className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
																تغيير الخياط
															</button>
															<button className='block w-full text-right px-4 py-2 text-sm text-green-600 hover:bg-green-50'>
																<CheckCircle className='inline ml-1 h-4 w-4' />
																اكتمال المهمة
															</button>
															<button className='block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50'>
																<AlertCircle className='inline ml-1 h-4 w-4' />
																تأخير المهمة
															</button>
														</div>
													</div>
												</div>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className='py-10 text-center'>
							<ClipboardList className='h-12 w-12 text-gray-300 mx-auto mb-2' />
							<h3 className='text-lg font-medium text-gray-900'>لا توجد مهام</h3>
							<p className='mt-1 text-gray-500'>
								{searchTerm ||
								stageFilter !== 'all' ||
								tailorFilter !== 'all' ||
								statusFilter !== 'all' ||
								priorityFilter !== 'all'
									? 'لم يتم العثور على مهام تطابق معايير البحث المحددة'
									: 'لا توجد مهام خياطة حالية. أضف مهمة جديدة للبدء.'}
							</p>
							<div className='mt-4'>
								<button className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'>
									<Plus className='ml-1 h-4 w-4' />
									إضافة مهمة
								</button>
							</div>
						</div>
					)}
				</div>
			)}

			{/* عرض المهام (لوحي) */}
			{viewMode === 'board' && (
				<div className='grid grid-cols-1 lg:grid-cols-5 gap-4 auto-rows-fr'>
					{stages.map((stage) => (
						<div
							key={stage.id}
							className='bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col'
						>
							<div
								className={`p-3 border-b border-gray-200 flex items-center justify-between ${
									stage.color === 'blue'
										? 'bg-blue-50'
										: stage.color === 'green'
										? 'bg-green-50'
										: stage.color === 'amber'
										? 'bg-amber-50'
										: stage.color === 'purple'
										? 'bg-purple-50'
										: stage.color === 'red'
										? 'bg-red-50'
										: 'bg-gray-50'
								}`}
							>
								<h3
									className={`text-sm font-medium ${
										stage.color === 'blue'
											? 'text-blue-700'
											: stage.color === 'green'
											? 'text-green-700'
											: stage.color === 'amber'
											? 'text-amber-700'
											: stage.color === 'purple'
											? 'text-purple-700'
											: stage.color === 'red'
											? 'text-red-700'
											: 'text-gray-700'
									}`}
								>
									{stage.name}
								</h3>
								<span className='bg-white px-2 py-0.5 rounded-full text-xs text-gray-600'>
									{tasksByStage[stage.id]?.length || 0}
								</span>
							</div>

							<div className='p-2 flex-grow overflow-y-auto max-h-[calc(100vh-300px)]'>
								{tasksByStage[stage.id]?.length > 0 ? (
									<div className='space-y-2'>
										{tasksByStage[stage.id].map((task) => (
											<div
												key={task.id}
												className='border border-gray-200 rounded-md p-3 bg-white shadow-sm hover:shadow-md transition-shadow duration-200'
											>
												<div className='flex items-center justify-between mb-2'>
													<span className='text-xs font-medium text-indigo-600'>
														{task.orderNumber}
													</span>
													{renderPriorityBadge(task.priority)}
												</div>

												<h4 className='text-sm font-medium text-gray-900 mb-1'>
													{task.productName}
												</h4>
												<p className='text-xs text-gray-500 mb-2'>العميل: {task.clientName}</p>

												<div className='mb-2'>
													{renderProgressBar(task.completionPercentage)}
												</div>

												<div className='flex items-center justify-between text-xs text-gray-500 mb-2'>
													<div className='flex items-center'>
														<Calendar className='h-3 w-3 ml-1' />
														{formatDate(task.dueDate)}
													</div>
													{renderStatusBadge(task.status)}
												</div>

												<div className='pt-2 mt-2 border-t border-gray-100 flex items-center justify-between'>
													<div>
														{task.assignedTo ? (
															<div className='flex items-center'>
																<div className='flex-shrink-0 h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center ml-1'>
																	<User className='h-3 w-3 text-gray-500' />
																</div>
																<span className='text-xs'>{task.assignedTo.name}</span>
															</div>
														) : (
															<button className='text-xs text-indigo-600 hover:text-indigo-800'>
																تعيين خياط
															</button>
														)}
													</div>

													<div>
														<Link
															href={`/dashboard/tailoring/tasks/${task.id}`}
															className='text-xs text-indigo-600 hover:text-indigo-800 flex items-center'
														>
															التفاصيل
															<ChevronRight className='mr-1 h-3 w-3' />
														</Link>
													</div>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className='text-center py-6 px-2'>
										<div className='h-8 w-8 mx-auto mb-1 rounded-full bg-gray-100 flex items-center justify-center'>
											<ClipboardList className='h-4 w-4 text-gray-400' />
										</div>
										<p className='text-xs text-gray-500'>لا توجد مهام في هذه المرحلة</p>
									</div>
								)}
							</div>

							<div className='p-2 border-t border-gray-200'>
								<button className='w-full py-1 text-xs text-indigo-600 hover:text-indigo-800 flex items-center justify-center'>
									<Plus className='h-3 w-3 ml-1' />
									إضافة مهمة
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* الترقيم الصفحي */}
			{filteredTasks.length > 0 && viewMode === 'list' && (
				<div className='flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg'>
					<div className='flex flex-1 justify-between sm:hidden'>
						<a
							href='#'
							className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
						>
							السابق
						</a>
						<a
							href='#'
							className='ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
						>
							التالي
						</a>
					</div>
					<div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
						<div>
							<p className='text-sm text-gray-700'>
								عرض <span className='font-medium'>1</span> إلى{' '}
								<span className='font-medium'>{filteredTasks.length}</span> من أصل{' '}
								<span className='font-medium'>{tasks.length}</span> مهمة
							</p>
						</div>
						<div>
							<nav
								className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px space-x-reverse'
								aria-label='Pagination'
							>
								<a
									href='#'
									className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
								>
									<span className='sr-only'>السابق</span>
									<ArrowRight className='h-5 w-5' />
								</a>
								<a
									href='#'
									className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'
								>
									1
								</a>
								<a
									href='#'
									className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-indigo-100'
								>
									2
								</a>
								<a
									href='#'
									className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'
								>
									3
								</a>
								<a
									href='#'
									className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
								>
									<span className='sr-only'>التالي</span>
									<ArrowLeft className='h-5 w-5' />
								</a>
							</nav>
						</div>
					</div>
				</div>
			)}

			{/* أدوات مساعدة */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
					<h3 className='text-sm font-medium text-gray-900 mb-3 flex items-center'>
						<AlertCircle className='ml-1 h-4 w-4 text-red-500' />
						مهام متأخرة
					</h3>
					<div className='space-y-2'>
						{tasks
							.filter((t) => t.status === 'delayed')
							.slice(0, 3)
							.map((task) => (
								<div
									key={task.id}
									className='flex items-center justify-between p-2 border border-red-100 rounded-md bg-red-50'
								>
									<div>
										<div className='text-xs font-medium text-gray-900'>
											{task.orderNumber} - {task.productName}
										</div>
										<div className='text-xs text-gray-500'>
											تاريخ الاستحقاق: {formatDate(task.dueDate)}
										</div>
									</div>
									<Link
										href={`/dashboard/tailoring/tasks/${task.id}`}
										className='text-xs text-red-600 hover:text-red-800'
									>
										عرض
									</Link>
								</div>
							))}
						{tasks.filter((t) => t.status === 'delayed').length === 0 && (
							<div className='text-center py-4'>
								<CheckCircle className='h-8 w-8 text-green-500 mx-auto mb-2' />
								<p className='text-sm text-gray-600'>لا توجد مهام متأخرة حالياً</p>
							</div>
						)}
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
					<h3 className='text-sm font-medium text-gray-900 mb-3 flex items-center'>
						<ClipboardList className='ml-1 h-4 w-4 text-indigo-500' />
						مهام اليوم
					</h3>
					<div className='space-y-2'>
						{tasks
							.filter((t) => new Date(t.dueDate).toDateString() === new Date().toDateString())
							.slice(0, 3)
							.map((task) => (
								<div
									key={task.id}
									className='flex items-center justify-between p-2 border border-indigo-100 rounded-md bg-indigo-50'
								>
									<div>
										<div className='text-xs font-medium text-gray-900'>
											{task.orderNumber} - {task.productName}
										</div>
										<div className='text-xs text-gray-500'>
											{renderStageBadge(task.currentStage)}
										</div>
									</div>
									<Link
										href={`/dashboard/tailoring/tasks/${task.id}`}
										className='text-xs text-indigo-600 hover:text-indigo-800'
									>
										عرض
									</Link>
								</div>
							))}
						{tasks.filter((t) => new Date(t.dueDate).toDateString() === new Date().toDateString())
							.length === 0 && (
							<div className='text-center py-4'>
								<Calendar className='h-8 w-8 text-gray-300 mx-auto mb-2' />
								<p className='text-sm text-gray-600'>لا توجد مهام مجدولة لليوم</p>
							</div>
						)}
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
					<h3 className='text-sm font-medium text-gray-900 mb-3 flex items-center'>
						<CheckCircle className='ml-1 h-4 w-4 text-green-500' />
						مهام مكتملة مؤخراً
					</h3>
					<div className='space-y-2'>
						{tasks
							.filter((t) => t.status === 'completed')
							.slice(0, 3)
							.map((task) => (
								<div
									key={task.id}
									className='flex items-center justify-between p-2 border border-green-100 rounded-md bg-green-50'
								>
									<div>
										<div className='text-xs font-medium text-gray-900'>
											{task.orderNumber} - {task.productName}
										</div>
										<div className='text-xs text-gray-500'>
											اكتملت بتاريخ: {formatDate(task.updatedAt || task.createdAt)}
										</div>
									</div>
									<Link
										href={`/dashboard/tailoring/tasks/${task.id}`}
										className='text-xs text-green-600 hover:text-green-800'
									>
										عرض
									</Link>
								</div>
							))}
						{tasks.filter((t) => t.status === 'completed').length === 0 && (
							<div className='text-center py-4'>
								<Clock className='h-8 w-8 text-gray-300 mx-auto mb-2' />
								<p className='text-sm text-gray-600'>لا توجد مهام مكتملة حتى الآن</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
