'use client';

import {
	AlertCircle,
	ArrowUpRight,
	BarChart2,
	Check,
	CheckCircle,
	CheckSquare,
	ChevronDown,
	ChevronUp,
	ClipboardList,
	Clock,
	Download,
	Edit,
	Eye,
	Flag,
	Info,
	Minus,
	MoreHorizontal,
	Plus,
	Printer,
	Search,
	User,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface QualityCheck {
	id: string;
	name: string;
	description: string;
	isRequired: boolean;
	maxDefectsAllowed?: number;
}

interface QualityInspection {
	id: string;
	orderNumber: string;
	orderLink: string;
	productName: string;
	customerId: string;
	customerName: string;
	stage: string;
	stageName: string;
	inspectionDate: string;
	inspectorId: string;
	inspectorName: string;
	status: 'passed' | 'failed' | 'pending' | 'partial';
	notes?: string;
	issuesCount: number;
	criticalIssues: number;
	actionRequired: boolean;
	checklistItems: {
		checkId: string;
		name: string;
		isRequired: boolean;
		result: 'passed' | 'failed' | 'na' | 'partial' | 'pending';
		defectsCount?: number;
		notes?: string;
		images?: string[];
	}[];
}

interface QualityStage {
	id: string;
	name: string;
	checksCount: number;
	requiredChecksCount: number;
}

interface QualityStats {
	totalInspections: number;
	passRate: number;
	criticalIssuesRate: number;
	inspectionsByStage: {
		stageName: string;
		count: number;
		passRate: number;
	}[];
	topIssues: {
		checkName: string;
		failCount: number;
		percentage: number;
	}[];
}

export default function QualityControlPage() {
	const [loading, setLoading] = useState(true);
	const [inspections, setInspections] = useState<QualityInspection[]>([]);
	const [filteredInspections, setFilteredInspections] = useState<QualityInspection[]>([]);
	const [stages, setStages] = useState<QualityStage[]>([]);
	const [stats, setStats] = useState<QualityStats | null>(null);

	// حالة الفلترة
	const [searchTerm, setSearchTerm] = useState('');
	const [stageFilter, setStageFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [dateFilter, setDateFilter] = useState('all');
	const [sortBy, setSortBy] = useState<'date' | 'status' | 'issues'>('date');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	// حالة عرض التفاصيل
	const [expandedInspection, setExpandedInspection] = useState<string | null>(null);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية لمراحل الجودة
			const mockStages: QualityStage[] = [
				{ id: 'stage-1', name: 'القياس', checksCount: 5, requiredChecksCount: 3 },
				{ id: 'stage-2', name: 'القص', checksCount: 8, requiredChecksCount: 6 },
				{ id: 'stage-3', name: 'الخياطة', checksCount: 12, requiredChecksCount: 8 },
				{ id: 'stage-4', name: 'التطريز', checksCount: 6, requiredChecksCount: 4 },
				{ id: 'stage-5', name: 'الكي والتشطيب', checksCount: 10, requiredChecksCount: 7 },
				{ id: 'stage-6', name: 'الفحص النهائي', checksCount: 15, requiredChecksCount: 12 },
			];

			// بيانات تجريبية لفحوصات الجودة
			const mockInspections: QualityInspection[] = [
				{
					id: 'insp-001',
					orderNumber: 'ORD-1245',
					orderLink: '/dashboard/orders/ORD-1245',
					productName: 'ثوب كلاسيك',
					customerId: 'cust-001',
					customerName: 'عبدالله محمد',
					stage: 'stage-5',
					stageName: 'الكي والتشطيب',
					inspectionDate: '2023-10-05T14:30:00',
					inspectorId: 'user-001',
					inspectorName: 'أحمد القحطاني',
					status: 'passed',
					notes: 'تم الفحص بنجاح، جودة ممتازة',
					issuesCount: 0,
					criticalIssues: 0,
					actionRequired: false,
					checklistItems: [
						{ checkId: 'check-1', name: 'جودة الكي', isRequired: true, result: 'passed' },
						{ checkId: 'check-2', name: 'نظافة القماش', isRequired: true, result: 'passed' },
						{ checkId: 'check-3', name: 'جودة الخياطة', isRequired: true, result: 'passed' },
						{ checkId: 'check-4', name: 'تناسق الأزرار', isRequired: false, result: 'passed' },
						{ checkId: 'check-5', name: 'صحة المقاسات', isRequired: true, result: 'passed' },
					],
				},
				{
					id: 'insp-002',
					orderNumber: 'ORD-1246',
					orderLink: '/dashboard/orders/ORD-1246',
					productName: 'ثوب مغربي',
					customerId: 'cust-002',
					customerName: 'فهد العتيبي',
					stage: 'stage-3',
					stageName: 'الخياطة',
					inspectionDate: '2023-10-04T11:15:00',
					inspectorId: 'user-002',
					inspectorName: 'محمد العمري',
					status: 'failed',
					notes: 'يوجد عدة مشاكل في الخياطة، يجب إعادة العمل',
					issuesCount: 3,
					criticalIssues: 1,
					actionRequired: true,
					checklistItems: [
						{
							checkId: 'check-6',
							name: 'متانة الخياطة',
							isRequired: true,
							result: 'failed',
							defectsCount: 2,
							notes: 'خياطة ضعيفة في منطقة الذيل',
						},
						{
							checkId: 'check-7',
							name: 'استقامة الخطوط',
							isRequired: true,
							result: 'failed',
							defectsCount: 1,
							notes: 'خط الكتف غير مستقيم',
						},
						{ checkId: 'check-8', name: 'توازن القصة', isRequired: true, result: 'passed' },
						{ checkId: 'check-9', name: 'تناسق الألوان', isRequired: false, result: 'passed' },
						{
							checkId: 'check-10',
							name: 'مطابقة المقاسات',
							isRequired: true,
							result: 'failed',
							defectsCount: 1,
							notes: 'الطول أقصر بـ 2 سم من المطلوب',
						},
					],
				},
				{
					id: 'insp-003',
					orderNumber: 'ORD-1247',
					orderLink: '/dashboard/orders/ORD-1247',
					productName: 'ثوب إماراتي',
					customerId: 'cust-003',
					customerName: 'محمد العنزي',
					stage: 'stage-4',
					stageName: 'التطريز',
					inspectionDate: '2023-10-03T09:45:00',
					inspectorId: 'user-001',
					inspectorName: 'أحمد القحطاني',
					status: 'partial',
					notes: 'بعض المشاكل البسيطة في التطريز، يمكن إصلاحها',
					issuesCount: 1,
					criticalIssues: 0,
					actionRequired: true,
					checklistItems: [
						{
							checkId: 'check-11',
							name: 'دقة التطريز',
							isRequired: true,
							result: 'partial',
							defectsCount: 1,
							notes: 'بعض الخيوط غير متناسقة',
						},
						// { checkId: 'check-12', name: 'تناسق الألوان', isRequired: true

						{
							checkId: 'check-11',
							name: 'دقة التطريز',
							isRequired: true,
							result: 'partial',
							defectsCount: 1,
							notes: 'بعض الخيوط غير متناسقة',
						},
						{ checkId: 'check-12', name: 'تناسق الألوان', isRequired: true, result: 'passed' },
						{ checkId: 'check-13', name: 'ثبات التطريز', isRequired: true, result: 'passed' },
						{ checkId: 'check-14', name: 'تطابق التصميم', isRequired: true, result: 'passed' },
					],
				},
				{
					id: 'insp-004',
					orderNumber: 'ORD-1248',
					orderLink: '/dashboard/orders/ORD-1248',
					productName: 'بشت ملكي',
					customerId: 'cust-004',
					customerName: 'سلطان السلمي',
					stage: 'stage-6',
					stageName: 'الفحص النهائي',
					inspectionDate: '2023-10-05T16:20:00',
					inspectorId: 'user-003',
					inspectorName: 'خالد الغامدي',
					status: 'passed',
					notes: 'جودة ممتازة، المنتج جاهز للتسليم',
					issuesCount: 0,
					criticalIssues: 0,
					actionRequired: false,
					checklistItems: [
						{ checkId: 'check-15', name: 'جودة الخامة', isRequired: true, result: 'passed' },
						{ checkId: 'check-16', name: 'جودة التطريز', isRequired: true, result: 'passed' },
						{ checkId: 'check-17', name: 'ثبات الألوان', isRequired: true, result: 'passed' },
						{ checkId: 'check-18', name: 'تناسق القصة', isRequired: true, result: 'passed' },
						{ checkId: 'check-19', name: 'مطابقة المقاسات', isRequired: true, result: 'passed' },
						{ checkId: 'check-20', name: 'جودة التشطيب', isRequired: true, result: 'passed' },
					],
				},
				{
					id: 'insp-005',
					orderNumber: 'ORD-1249',
					orderLink: '/dashboard/orders/ORD-1249',
					productName: 'ثوب بقصة عصرية',
					customerId: 'cust-005',
					customerName: 'خالد المالكي',
					stage: 'stage-2',
					stageName: 'القص',
					inspectionDate: '2023-10-01T10:30:00',
					inspectorId: 'user-002',
					inspectorName: 'محمد العمري',
					status: 'failed',
					notes: 'مشاكل كبيرة في القص، يجب إعادة القطعة كاملة',
					issuesCount: 4,
					criticalIssues: 2,
					actionRequired: true,
					checklistItems: [
						{
							checkId: 'check-21',
							name: 'دقة القص',
							isRequired: true,
							result: 'failed',
							defectsCount: 2,
							notes: 'قص غير متساوٍ في الأطراف',
						},
						{
							checkId: 'check-22',
							name: 'مطابقة النموذج',
							isRequired: true,
							result: 'failed',
							defectsCount: 1,
							notes: 'قصة الرقبة مختلفة عن المطلوب',
						},
						{
							checkId: 'check-23',
							name: 'سلامة القماش',
							isRequired: true,
							result: 'failed',
							defectsCount: 1,
							notes: 'وجود تلف في القماش أثناء القص',
						},
						{
							checkId: 'check-24',
							name: 'التناسق بين القطع',
							isRequired: true,
							result: 'failed',
							defectsCount: 1,
							notes: 'عدم تناسق بين القطع',
						},
					],
				},
				{
					id: 'insp-006',
					orderNumber: 'ORD-1250',
					orderLink: '/dashboard/orders/ORD-1250',
					productName: 'ثوب كلاسيك',
					customerId: 'cust-006',
					customerName: 'عبدالرحمن الشهري',
					stage: 'stage-1',
					stageName: 'القياس',
					inspectionDate: '2023-09-30T14:00:00',
					inspectorId: 'user-001',
					inspectorName: 'أحمد القحطاني',
					status: 'pending',
					notes: 'فحص أولي، بانتظار المراجعة النهائية',
					issuesCount: 0,
					criticalIssues: 0,
					actionRequired: true,
					checklistItems: [
						{ checkId: 'check-25', name: 'دقة المقاسات', isRequired: true, result: 'passed' },
						{ checkId: 'check-26', name: 'اكتمال المقاسات', isRequired: true, result: 'passed' },
						{ checkId: 'check-27', name: 'توثيق المقاسات', isRequired: true, result: 'pending' },
					],
				},
			];

			// بيانات تجريبية للإحصائيات
			const mockStats: QualityStats = {
				totalInspections: 118,
				passRate: 76,
				criticalIssuesRate: 14,
				inspectionsByStage: [
					{ stageName: 'القياس', count: 18, passRate: 94 },
					{ stageName: 'القص', count: 24, passRate: 83 },
					{ stageName: 'الخياطة', count: 32, passRate: 69 },
					{ stageName: 'التطريز', count: 12, passRate: 75 },
					{ stageName: 'الكي والتشطيب', count: 16, passRate: 88 },
					{ stageName: 'الفحص النهائي', count: 16, passRate: 75 },
				],
				topIssues: [
					{ checkName: 'متانة الخياطة', failCount: 12, percentage: 10.2 },
					{ checkName: 'دقة القص', failCount: 9, percentage: 7.6 },
					{ checkName: 'مطابقة المقاسات', failCount: 8, percentage: 6.8 },
					{ checkName: 'جودة التطريز', failCount: 7, percentage: 5.9 },
					{ checkName: 'تناسق الخطوط', failCount: 6, percentage: 5.1 },
				],
			};

			setStages(mockStages);
			setInspections(mockInspections);
			setFilteredInspections(mockInspections);
			setStats(mockStats);
			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let result = [...inspections];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(inspection) =>
					inspection.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
					inspection.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					inspection.customerName.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// تطبيق فلتر المرحلة
		if (stageFilter !== 'all') {
			result = result.filter((inspection) => inspection.stage === stageFilter);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			result = result.filter((inspection) => inspection.status === statusFilter);
		}

		// تطبيق فلتر التاريخ
		if (dateFilter !== 'all') {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			if (dateFilter === 'today') {
				result = result.filter((inspection) => {
					const inspDate = new Date(inspection.inspectionDate);
					return inspDate >= today && inspDate < new Date(today.getTime() + 86400000);
				});
			} else if (dateFilter === 'week') {
				const weekAgo = new Date(today.getTime() - 7 * 86400000);
				result = result.filter((inspection) => {
					const inspDate = new Date(inspection.inspectionDate);
					return inspDate >= weekAgo;
				});
			} else if (dateFilter === 'month') {
				const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
				result = result.filter((inspection) => {
					const inspDate = new Date(inspection.inspectionDate);
					return inspDate >= monthAgo;
				});
			}
		}

		// تطبيق الترتيب
		result.sort((a, b) => {
			if (sortBy === 'date') {
				return sortOrder === 'asc'
					? new Date(a.inspectionDate).getTime() - new Date(b.inspectionDate).getTime()
					: new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime();
			} else if (sortBy === 'status') {
				const statusOrder = { failed: 0, partial: 1, pending: 2, passed: 3 };
				return sortOrder === 'asc'
					? statusOrder[a.status] - statusOrder[b.status]
					: statusOrder[b.status] - statusOrder[a.status];
			} else {
				return sortOrder === 'asc' ? a.issuesCount - b.issuesCount : b.issuesCount - a.issuesCount;
			}
		});

		setFilteredInspections(result);
	}, [inspections, searchTerm, stageFilter, statusFilter, dateFilter, sortBy, sortOrder]);

	// توسيع/طي تفاصيل الفحص
	const toggleInspectionExpand = (inspectionId: string) => {
		if (expandedInspection === inspectionId) {
			setExpandedInspection(null);
		} else {
			setExpandedInspection(inspectionId);
		}
	};

	// استخراج عرض حالة الفحص
	const getStatusDisplay = (status: string) => {
		switch (status) {
			case 'passed':
				return {
					label: 'مقبول',
					color: 'bg-green-100 text-green-800',
				};
			case 'failed':
				return {
					label: 'مرفوض',
					color: 'bg-red-100 text-red-800',
				};
			case 'partial':
				return {
					label: 'مقبول مع ملاحظات',
					color: 'bg-amber-100 text-amber-800',
				};
			case 'pending':
				return {
					label: 'قيد المراجعة',
					color: 'bg-blue-100 text-blue-800',
				};
			default:
				return {
					label: status,
					color: 'bg-gray-100 text-gray-800',
				};
		}
	};

	// استخراج عرض نتيجة الفحص الفرعي
	const getCheckResultDisplay = (result: string) => {
		switch (result) {
			case 'passed':
				return {
					label: 'مقبول',
					icon: <Check className='h-4 w-4 text-green-600' />,
					color: 'text-green-600',
				};
			case 'failed':
				return {
					label: 'مرفوض',
					icon: <X className='h-4 w-4 text-red-600' />,
					color: 'text-red-600',
				};
			case 'partial':
				return {
					label: 'جزئي',
					icon: <AlertCircle className='h-4 w-4 text-amber-600' />,
					color: 'text-amber-600',
				};
			case 'na':
				return {
					label: 'غير منطبق',
					icon: <Minus className='h-4 w-4 text-gray-400' />,
					color: 'text-gray-400',
				};
			case 'pending':
				return {
					label: 'قيد المراجعة',
					icon: <Clock className='h-4 w-4 text-blue-600' />,
					color: 'text-blue-600',
				};
			default:
				return {
					label: result,
					icon: <Info className='h-4 w-4 text-gray-600' />,
					color: 'text-gray-600',
				};
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

	// تنسيق الوقت
	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('ar-SA', {
			hour: '2-digit',
			minute: '2-digit',
		});
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
						<CheckCircle className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						مراقبة الجودة
					</h1>
					<p className='mt-1 text-gray-500'>إدارة معايير الجودة وفحوصات المنتجات</p>
				</div>

				<div className='flex items-center gap-2'>
					<Link
						href='/dashboard/tailoring/quality/checklist'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<ClipboardList className='ml-1 h-4 w-4' />
						قوائم الفحص
					</Link>
					<Link
						href='/dashboard/tailoring/quality/new'
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						<Plus className='ml-1 h-4 w-4' />
						فحص جديد
					</Link>
				</div>
			</div>

			{/* بطاقات الإحصائيات */}
			{stats && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>إجمالي الفحوصات</p>
								<p className='text-2xl font-bold text-gray-900'>{stats.totalInspections}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
								<ClipboardList className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>
							{filteredInspections.length} فحص في الفلتر الحالي
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>نسبة النجاح</p>
								<p className='text-2xl font-bold text-green-600'>{stats.passRate}%</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
								<CheckCircle className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 flex items-center'>
							<div className='flex-1 bg-gray-200 rounded-full h-2'>
								<div
									className='bg-green-500 h-2 rounded-full'
									style={{ width: `${stats.passRate}%` }}
								></div>
							</div>
							<span className='text-xs text-gray-500 mr-2'>{stats.passRate}%</span>
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>معدل المشاكل الحرجة</p>
								<p className='text-2xl font-bold text-red-600'>{stats.criticalIssuesRate}%</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600'>
								<AlertCircle className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 flex items-center'>
							<div className='flex-1 bg-gray-200 rounded-full h-2'>
								<div
									className='bg-red-500 h-2 rounded-full'
									style={{ width: `${stats.criticalIssuesRate}%` }}
								></div>
							</div>
							<span className='text-xs text-gray-500 mr-2'>{stats.criticalIssuesRate}%</span>
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>فحوصات بحاجة لإجراء</p>
								<p className='text-2xl font-bold text-amber-600'>
									{inspections.filter((i) => i.actionRequired).length}
								</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
								<Flag className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>
							{Math.round(
								(inspections.filter((i) => i.actionRequired).length / inspections.length) * 100
							)}
							% من إجمالي الفحوصات
						</div>
					</div>
				</div>
			)}

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
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
									{stage.name}
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
							<option value='passed'>مقبول</option>
							<option value='failed'>مرفوض</option>
							<option value='partial'>مقبول مع ملاحظات</option>
							<option value='pending'>قيد المراجعة</option>
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
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع التواريخ</option>
							<option value='today'>اليوم</option>
							<option value='week'>آخر أسبوع</option>
							<option value='month'>آخر شهر</option>
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
							عرض {filteredInspections.length} من {inspections.length} فحص
						</span>
						{(searchTerm || stageFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setStageFilter('all');
									setStatusFilter('all');
									setDateFilter('all');
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
								onChange={(e) => setSortBy(e.target.value as 'date' | 'status' | 'issues')}
								className='appearance-none border border-gray-300 rounded-md py-1 pl-8 pr-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
							>
								<option value='date'>التاريخ</option>
								<option value='status'>الحالة</option>
								<option value='issues'>عدد المشاكل</option>
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

			{/* قائمة فحوصات الجودة */}
			{filteredInspections.length > 0 ? (
				<div className='space-y-4'>
					{filteredInspections.map((inspection) => {
						const statusDisplay = getStatusDisplay(inspection.status);

						return (
							<div
								key={inspection.id}
								className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'
							>
								<div className='p-4 border-b border-gray-200 flex justify-between items-center'>
									<div className='flex flex-col sm:flex-row sm:items-center gap-2'>
										<div>
											<Link
												href={inspection.orderLink}
												className='text-indigo-600 hover:text-indigo-800 font-medium'
											>
												{inspection.orderNumber}
											</Link>
											<span className='mx-2 text-gray-300'>|</span>
											<span className='font-medium text-gray-900'>{inspection.productName}</span>
										</div>

										<div className='flex items-center'>
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDisplay.color}`}
											>
												{statusDisplay.label}
											</span>

											{inspection.criticalIssues > 0 && (
												<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2'>
													{inspection.criticalIssues} مشكلة حرجة
												</span>
											)}

											{inspection.actionRequired && (
												<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 mr-2'>
													بحاجة لإجراء
												</span>
											)}
										</div>
									</div>

									<div className='flex gap-2'>
										<button
											onClick={() => toggleInspectionExpand(inspection.id)}
											className='px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm flex items-center'
										>
											{expandedInspection === inspection.id ? (
												<>
													<ChevronUp className='ml-1 h-3 w-3' />
													إخفاء
												</>
											) : (
												<>
													<Eye className='ml-1 h-3 w-3' />
													عرض
												</>
											)}
										</button>

										<div className='relative group'>
											<button className='px-2 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm'>
												<MoreHorizontal className='h-4 w-4' />
											</button>
											<div className='absolute left-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
												<Link
													href={`/dashboard/tailoring/quality/view/${inspection.id}`}
													className='block w-full text-right px-4 py-2 text-xs text-gray-700 hover:bg-gray-100'
												>
													<Eye className='inline ml-1 h-3 w-3' />
													عرض التفاصيل
												</Link>

												<Link
													href={`/dashboard/tailoring/quality/edit/${inspection.id}`}
													className='block w-full text-right px-4 py-2 text-xs text-gray-700 hover:bg-gray-100'
												>
													<Edit className='inline ml-1 h-3 w-3' />
													تعديل الفحص
												</Link>

												<button className='block w-full text-right px-4 py-2 text-xs text-gray-700 hover:bg-gray-100'>
													<Printer className='inline ml-1 h-3 w-3' />
													طباعة التقرير
												</button>

												<button className='block w-full text-right px-4 py-2 text-xs text-gray-700 hover:bg-gray-100'>
													<Download className='inline ml-1 h-3 w-3' />
													تنزيل كـ PDF
												</button>
											</div>
										</div>
									</div>
								</div>

								{/* معلومات موجزة */}
								<div className='p-4 bg-gray-50'>
									<div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
										<div className='flex flex-col'>
											<span className='text-gray-500'>العميل</span>
											<span className='font-medium text-gray-900'>{inspection.customerName}</span>
										</div>

										<div className='flex flex-col'>
											<span className='text-gray-500'>المرحلة</span>
											<span className='font-medium text-gray-900'>{inspection.stageName}</span>
										</div>

										<div className='flex flex-col'>
											<span className='text-gray-500'>تاريخ الفحص</span>
											<span className='font-medium text-gray-900'>
												{formatDate(inspection.inspectionDate)} -{' '}
												{formatTime(inspection.inspectionDate)}
											</span>
										</div>
									</div>
								</div>

								{/* تفاصيل الفحص */}
								{expandedInspection === inspection.id && (
									<div className='p-4 border-t border-gray-200 animate-fadeIn'>
										<div className='mb-4'>
											<h3 className='text-sm font-medium text-gray-700 mb-2'>قائمة الفحص</h3>
											<div className='border border-gray-200 rounded-md overflow-hidden'>
												<table className='min-w-full divide-y divide-gray-200'>
													<thead className='bg-gray-50'>
														<tr>
															<th
																scope='col'
																className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
															>
																اسم الفحص
															</th>
															<th
																scope='col'
																className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
															>
																النتيجة
															</th>
															<th
																scope='col'
																className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
															>
																ملاحظات
															</th>
														</tr>
													</thead>
													<tbody className='bg-white divide-y divide-gray-200'>
														{inspection.checklistItems.map((item) => {
															const resultDisplay = getCheckResultDisplay(item.result);

															return (
																<tr key={item.checkId}>
																	<td className='px-4 py-2 whitespace-nowrap text-sm'>
																		<div className='flex items-center'>
																			<span className='font-medium text-gray-900'>
																				{item.name}
																			</span>
																			{item.isRequired && (
																				<span className='mr-2 text-xs text-red-500'>
																					*
																				</span>
																			)}
																		</div>
																	</td>
																	<td className='px-4 py-2 whitespace-nowrap'>
																		<div className='flex items-center'>
																			{resultDisplay.icon}
																			<span
																				className={`mr-1 text-sm ${resultDisplay.color}`}
																			>
																				{resultDisplay.label}
																			</span>
																			{item.defectsCount && (
																				<span className='mr-2 text-xs text-gray-500'>
																					({item.defectsCount} مشكلة)
																				</span>
																			)}
																		</div>
																	</td>
																	<td className='px-4 py-2 text-sm text-gray-500'>
																		{item.notes || '-'}
																	</td>
																</tr>
															);
														})}
													</tbody>
												</table>
											</div>
										</div>

										{inspection.notes && (
											<div className='mb-4'>
												<h3 className='text-sm font-medium text-gray-700 mb-2'>ملاحظات عامة</h3>
												<div className='bg-gray-50 p-3 rounded-md text-sm text-gray-600'>
													{inspection.notes}
												</div>
											</div>
										)}

										<div className='flex justify-between items-center text-sm'>
											<div className='flex items-center text-gray-500'>
												<User className='h-4 w-4 ml-1' />
												المُفتش: {inspection.inspectorName}
											</div>

											<div className='flex items-center'>
												<Link
													href={`/dashboard/tailoring/quality/view/${inspection.id}`}
													className='text-indigo-600 hover:text-indigo-800 flex items-center'
												>
													عرض التقرير الكامل
													<ArrowUpRight className='mr-1 h-4 w-4' />
												</Link>
											</div>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			) : (
				<div className='bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center'>
					<CheckSquare className='h-12 w-12 text-gray-300 mx-auto mb-3' />
					<h3 className='text-lg font-medium text-gray-900'>لم يتم العثور على فحوصات</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm || stageFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all'
							? 'لم يتم العثور على فحوصات تطابق معايير البحث المحددة'
							: 'لا توجد فحوصات جودة مسجلة في النظام. أنشئ فحص جديد للبدء.'}
					</p>
					<div className='mt-4'>
						<Link
							href='/dashboard/tailoring/quality/new'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
						>
							<Plus className='ml-1 h-4 w-4' />
							فحص جديد
						</Link>
					</div>
				</div>
			)}

			{/* إحصائيات الجودة */}
			{stats && (
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='p-4 border-b border-gray-200'>
						<div className='flex justify-between items-center'>
							<h2 className='text-lg font-medium text-gray-900'>إحصائيات الجودة</h2>
							<Link
								href='/dashboard/tailoring/quality/stats'
								className='text-indigo-600 hover:text-indigo-800 text-sm flex items-center'
							>
								<BarChart2 className='ml-1 h-4 w-4' />
								عرض التقارير المفصلة
							</Link>
						</div>
					</div>

					<div className='p-4'>
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							{/* إحصائيات حسب المرحلة */}
							<div>
								<h3 className='text-sm font-medium text-gray-700 mb-3'>معدل القبول حسب المرحلة</h3>
								<div className='space-y-3'>
									{stats.inspectionsByStage.map((stage, index) => (
										<div key={index} className='flex items-center space-x-4 space-x-reverse'>
											<div className='w-36 text-sm text-gray-600'>{stage.stageName}</div>
											<div className='flex-1'>
												<div className='flex items-center'>
													<div className='flex-1 bg-gray-200 rounded-full h-2.5'>
														<div
															className={`${
																stage.passRate >= 90
																	? 'bg-green-500'
																	: stage.passRate >= 75
																	? 'bg-blue-500'
																	: stage.passRate >= 50
																	? 'bg-amber-500'
																	: 'bg-red-500'
															} h-2.5 rounded-full`}
															style={{ width: `${stage.passRate}%` }}
														></div>
													</div>
													<span className='text-xs text-gray-500 mr-2 w-12'>
														{stage.passRate}%
													</span>
													<span className='text-xs text-gray-400 w-8'>({stage.count})</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* أبرز المشاكل */}
							<div>
								<h3 className='text-sm font-medium text-gray-700 mb-3'>أكثر المشاكل شيوعاً</h3>
								<div className='space-y-3'>
									{stats.topIssues.map((issue, index) => (
										<div key={index} className='flex items-center space-x-4 space-x-reverse'>
											<div className='w-36 text-sm text-gray-600 truncate'>{issue.checkName}</div>
											<div className='flex-1'>
												<div className='flex items-center'>
													<div className='flex-1 bg-gray-200 rounded-full h-2.5'>
														<div
															className='bg-red-500 h-2.5 rounded-full'
															style={{ width: `${issue.percentage * 5}%` }}
														></div>
													</div>
													<span className='text-xs text-gray-500 mr-2 w-16'>
														{issue.percentage.toFixed(1)}%
													</span>
													<span className='text-xs text-gray-400 w-8'>
														({issue.failCount})
													</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* روابط مساعدة */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<Link
					href='/dashboard/tailoring/quality/checklist'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
						<ClipboardList className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>قوائم الفحص</h3>
						<p className='text-sm text-gray-500'>إدارة معايير الجودة وقوائم الفحص</p>
					</div>
					<ArrowUpRight className='mr-auto h-5 w-5 text-indigo-600' />
				</Link>

				<Link
					href='/dashboard/tailoring/quality/issues'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 ml-3'>
						<AlertCircle className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>تقارير المشاكل</h3>
						<p className='text-sm text-gray-500'>عرض المشاكل المتكررة وحلولها</p>
					</div>
					<ArrowUpRight className='mr-auto h-5 w-5 text-indigo-600' />
				</Link>

				<Link
					href='/dashboard/tailoring/quality/stats'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
						<BarChart2 className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>تقارير الجودة</h3>
						<p className='text-sm text-gray-500'>إحصائيات ومؤشرات الجودة</p>
					</div>
					<ArrowUpRight className='mr-auto h-5 w-5 text-indigo-600' />
				</Link>
			</div>
		</div>
	);
}
