'use client';

import {
	AlertCircle,
	ArrowLeft,
	Building,
	CheckCircle,
	Edit,
	FileText,
	Filter,
	Info,
	Plus,
	Save,
	Settings,
	Tag,
	Trash,
	Users,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface BranchType {
	id: number;
	name: string;
	code: string;
	description: string;
	isDefault: boolean;
}

interface BranchStatus {
	id: number;
	name: string;
	code: string;
	color: string;
	isDefault: boolean;
}

interface BranchCategory {
	id: number;
	name: string;
	description?: string;
}

interface BranchPolicy {
	id: number;
	name: string;
	description: string;
	enabled: boolean;
}

interface BranchRole {
	id: number;
	name: string;
	permissions: string[];
}

export default function BranchSettingsPage() {
	const [branchTypes, setBranchTypes] = useState<BranchType[]>([]);
	const [branchStatuses, setBranchStatuses] = useState<BranchStatus[]>([]);
	const [branchCategories, setBranchCategories] = useState<BranchCategory[]>([]);
	const [branchPolicies, setBranchPolicies] = useState<BranchPolicy[]>([]);
	const [branchRoles, setBranchRoles] = useState<BranchRole[]>([]);

	const [activeTab, setActiveTab] = useState<string>('types');
	const [loading, setLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

	// تحميل البيانات
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				// محاكاة لاستدعاء API
				await new Promise((resolve) => setTimeout(resolve, 700));

				// بيانات تجريبية
				const mockBranchTypes: BranchType[] = [
					{
						id: 1,
						name: 'فرع رئيسي',
						code: 'MAIN',
						description: 'الفروع الرئيسية التي تتبع مباشرة للإدارة العامة',
						isDefault: true,
					},
					{
						id: 2,
						name: 'فرع فرعي',
						code: 'SUB',
						description: 'الفروع الفرعية التي تتبع للفروع الرئيسية',
						isDefault: false,
					},
					{
						id: 3,
						name: 'فرع موسمي',
						code: 'SEASONAL',
						description: 'فروع تعمل في المواسم والأعياد فقط',
						isDefault: false,
					},
				];

				const mockBranchStatuses: BranchStatus[] = [
					{
						id: 1,
						name: 'نشط',
						code: 'ACTIVE',
						color: '#10B981',
						isDefault: true,
					},
					{
						id: 2,
						name: 'غير نشط',
						code: 'INACTIVE',
						color: '#EF4444',
						isDefault: false,
					},
					{
						id: 3,
						name: 'تحت الصيانة',
						code: 'MAINTENANCE',
						color: '#F59E0B',
						isDefault: false,
					},
					{
						id: 4,
						name: 'قيد الإنشاء',
						code: 'UNDER_CONSTRUCTION',
						color: '#6366F1',
						isDefault: false,
					},
				];

				const mockBranchCategories: BranchCategory[] = [
					{
						id: 1,
						name: 'فئة مميزة',
						description: 'فروع ذات أداء متميز',
					},
					{
						id: 2,
						name: 'فئة متوسطة',
						description: 'فروع ذات أداء متوسط',
					},
					{
						id: 3,
						name: 'فئة تحت المراقبة',
						description: 'فروع تحتاج إلى تحسين أدائها',
					},
				];

				const mockBranchPolicies: BranchPolicy[] = [
					{
						id: 1,
						name: 'إدارة المستندات التلقائية',
						description: 'إرسال إشعارات قبل انتهاء صلاحية المستندات الخاصة بالفروع',
						enabled: true,
					},
					{
						id: 2,
						name: 'تقييم أداء الفروع الشهري',
						description: 'إنشاء تقارير أداء شهرية تلقائية وإرسالها لمدراء الفروع',
						enabled: true,
					},
					{
						id: 3,
						name: 'نظام المكافآت للفروع',
						description: 'تفعيل نظام المكافآت التلقائي للفروع التي تحقق أهدافها',
						enabled: false,
					},
					{
						id: 4,
						name: 'توزيع الموظفين التلقائي',
						description: 'اقتراح توزيع الموظفين بين الفروع حسب الحاجة',
						enabled: false,
					},
					{
						id: 5,
						name: 'تقارير المقارنة الأسبوعية',
						description: 'إنشاء تقارير مقارنة أسبوعية بين الفروع',
						enabled: true,
					},
				];

				const mockBranchRoles: BranchRole[] = [
					{
						id: 1,
						name: 'مدير فرع',
						permissions: [
							'view_all',
							'edit_branch',
							'manage_employees',
							'manage_documents',
							'view_reports',
							'manage_sales',
						],
					},
					{
						id: 2,
						name: 'مساعد مدير',
						permissions: ['view_all', 'edit_branch', 'manage_employees', 'view_documents', 'view_reports'],
					},
					{
						id: 3,
						name: 'مشرف فرع',
						permissions: ['view_all', 'view_employees', 'view_documents', 'view_reports'],
					},
				];

				setBranchTypes(mockBranchTypes);
				setBranchStatuses(mockBranchStatuses);
				setBranchCategories(mockBranchCategories);
				setBranchPolicies(mockBranchPolicies);
				setBranchRoles(mockBranchRoles);
			} catch (error) {
				console.error('Error fetching data:', error);
				setNotification({
					message: 'حدث خطأ أثناء تحميل البيانات',
					type: 'error',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// حفظ التغييرات
	const handleSave = async () => {
		setIsSaving(true);
		try {
			// محاكاة لاستدعاء API
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setNotification({
				message: 'تم حفظ التغييرات بنجاح',
				type: 'success',
			});

			// إزالة الإشعار بعد ٣ ثوان
			setTimeout(() => {
				setNotification(null);
			}, 3000);
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

	// تغيير حالة سياسة
	const togglePolicy = (policyId: number) => {
		setBranchPolicies((prevPolicies) =>
			prevPolicies.map((policy) => (policy.id === policyId ? { ...policy, enabled: !policy.enabled } : policy))
		);
	};

	// إضافة نوع فرع جديد
	const handleAddBranchType = () => {
		const newType: BranchType = {
			id: branchTypes.length + 1,
			name: 'نوع جديد',
			code: `TYPE_${branchTypes.length + 1}`,
			description: 'وصف النوع الجديد',
			isDefault: false,
		};

		setBranchTypes([...branchTypes, newType]);
	};

	// إضافة حالة فرع جديدة
	const handleAddBranchStatus = () => {
		const newStatus: BranchStatus = {
			id: branchStatuses.length + 1,
			name: 'حالة جديدة',
			code: `STATUS_${branchStatuses.length + 1}`,
			color: '#6B7280',
			isDefault: false,
		};

		setBranchStatuses([...branchStatuses, newStatus]);
	};

	// إضافة تصنيف فرع جديد
	const handleAddBranchCategory = () => {
		const newCategory: BranchCategory = {
			id: branchCategories.length + 1,
			name: 'تصنيف جديد',
			description: 'وصف التصنيف الجديد',
		};

		setBranchCategories([...branchCategories, newCategory]);
	};

	// حذف نوع فرع
	const handleDeleteBranchType = (id: number) => {
		setBranchTypes(branchTypes.filter((type) => type.id !== id));
	};

	// حذف حالة فرع
	const handleDeleteBranchStatus = (id: number) => {
		setBranchStatuses(branchStatuses.filter((status) => status.id !== id));
	};

	// حذف تصنيف فرع
	const handleDeleteBranchCategory = (id: number) => {
		setBranchCategories(branchCategories.filter((category) => category.id !== id));
	};

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<Settings className='ml-2 h-6 w-6 text-gray-600' /> إعدادات الفروع
					</h1>
					<p className='mt-1 text-sm text-gray-600'>
						إدارة أنواع وحالات الفروع وإعدادات النظام المرتبطة بالفروع
					</p>
				</div>

				<div className='flex space-x-2 space-x-reverse'>
					<Link
						href='/dashboard/branches'
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'
					>
						<ArrowLeft className='ml-1 h-4 w-4' />
						العودة للفروع
					</Link>

					<button
						onClick={handleSave}
						disabled={isSaving}
						className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center disabled:bg-green-300 disabled:cursor-not-allowed'
					>
						{isSaving ? (
							<>
								<span className='animate-spin h-4 w-4 ml-1 border-2 border-t-transparent border-white rounded-full'></span>
								جاري الحفظ...
							</>
						) : (
							<>
								<Save className='ml-1 h-4 w-4' />
								حفظ التغييرات
							</>
						)}
					</button>
				</div>
			</div>

			{/* مُذكِّرة مهمة */}
			<div className='bg-blue-50 border border-blue-200 rounded-md p-4'>
				<div className='flex'>
					<Info className='h-5 w-5 text-blue-400 ml-2 flex-shrink-0' />
					<div>
						<h3 className='text-sm font-medium text-blue-800'>معلومات هامة</h3>
						<p className='text-sm text-blue-700 mt-1'>
							تؤثر هذه الإعدادات على جميع الفروع في النظام. يرجى الحذر عند تعديل الإعدادات الافتراضية.
						</p>
					</div>
				</div>
			</div>

			{/* تبويبات الإعدادات */}
			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='border-b border-gray-200'>
					<nav className='flex overflow-x-auto hide-scrollbar'>
						<button
							onClick={() => setActiveTab('types')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'types'
									? 'text-green-600 border-b-2 border-green-500'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Building className='inline-block ml-1 h-5 w-5' />
							أنواع الفروع
						</button>

						<button
							onClick={() => setActiveTab('statuses')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'statuses'
									? 'text-green-600 border-b-2 border-green-500'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Filter className='inline-block ml-1 h-5 w-5' />
							حالات الفروع
						</button>

						<button
							onClick={() => setActiveTab('categories')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'categories'
									? 'text-green-600 border-b-2 border-green-500'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Tag className='inline-block ml-1 h-5 w-5' />
							تصنيفات الفروع
						</button>

						<button
							onClick={() => setActiveTab('policies')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'policies'
									? 'text-green-600 border-b-2 border-green-500'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<FileText className='inline-block ml-1 h-5 w-5' />
							سياسات الفروع
						</button>

						<button
							onClick={() => setActiveTab('roles')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'roles'
									? 'text-green-600 border-b-2 border-green-500'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Users className='inline-block ml-1 h-5 w-5' />
							أدوار الفروع
						</button>
					</nav>
				</div>

				{/* محتوى التبويب */}
				<div className='p-6'>
					{/* أنواع الفروع */}
					{activeTab === 'types' && (
						<div>
							<div className='flex justify-between items-center mb-4'>
								<h2 className='text-lg font-medium text-gray-900'>أنواع الفروع</h2>
								<button
									onClick={handleAddBranchType}
									className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center'
								>
									<Plus className='ml-1 h-4 w-4' />
									إضافة نوع
								</button>
							</div>

							<div className='bg-gray-50 p-4 rounded-md mb-4'>
								<p className='text-sm text-gray-600'>
									أنواع الفروع تُستخدم لتصنيف الفروع وتحديد صلاحياتها وميزاتها. يُمكن تخصيص نوع لكل
									فرع عند إنشائه أو تعديله لاحقاً.
								</p>
							</div>

							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead>
										<tr>
											<th className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												الاسم
											</th>
											<th className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												الرمز
											</th>
											<th className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												الوصف
											</th>
											<th className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												افتراضي
											</th>
											<th className='px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
												الإجراءات
											</th>
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										{branchTypes.map((type) => (
											<tr key={type.id} className='hover:bg-gray-50'>
												<td className='px-6 py-4 whitespace-nowrap'>
													<input
														type='text'
														value={type.name}
														onChange={(e) => {
															setBranchTypes((prevTypes) =>
																prevTypes.map((t) =>
																	t.id === type.id
																		? { ...t, name: e.target.value }
																		: t
																)
															);
														}}
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
													/>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<input
														type='text'
														value={type.code}
														onChange={(e) => {
															setBranchTypes((prevTypes) =>
																prevTypes.map((t) =>
																	t.id === type.id
																		? { ...t, code: e.target.value }
																		: t
																)
															);
														}}
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
													/>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<input
														type='text'
														value={type.description}
														onChange={(e) => {
															setBranchTypes((prevTypes) =>
																prevTypes.map((t) =>
																	t.id === type.id
																		? { ...t, description: e.target.value }
																		: t
																)
															);
														}}
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
													/>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-center'>
													<input
														type='checkbox'
														checked={type.isDefault}
														onChange={(e) => {
															// تحديث النوع الافتراضي وإلغاء التحديد عن الأنواع الأخرى
															if (e.target.checked) {
																setBranchTypes((prevTypes) =>
																	prevTypes.map((t) =>
																		t.id === type.id
																			? { ...t, isDefault: true }
																			: { ...t, isDefault: false }
																	)
																);
															}
														}}
														className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
													/>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-center'>
													<button
														onClick={() => handleDeleteBranchType(type.id)}
														disabled={type.isDefault}
														className='text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed'
														title={type.isDefault ? 'لا يمكن حذف النوع الافتراضي' : 'حذف'}
													>
														<Trash className='h-5 w-5' />
													</button>
												</td>
											</tr>
										))}
										{branchTypes.length === 0 && (
											<tr>
												<td colSpan={5} className='px-6 py-4 text-center text-sm text-gray-500'>
													لا توجد أنواع مضافة بعد
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{/* حالات الفروع */}
					{activeTab === 'statuses' && (
						<div>
							<div className='flex justify-between items-center mb-4'>
								<h2 className='text-lg font-medium text-gray-900'>حالات الفروع</h2>
								<button
									onClick={handleAddBranchStatus}
									className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center'
								>
									<Plus className='ml-1 h-4 w-4' />
									إضافة حالة
								</button>
							</div>

							<div className='bg-gray-50 p-4 rounded-md mb-4'>
								<p className='text-sm text-gray-600'>
									حالات الفروع تعبر عن الوضع الحالي للفرع مثل نشط، غير نشط، تحت الصيانة، إلخ. تؤثر
									الحالة على ظهور الفرع في النظام وعلى العمليات التي يمكن إجراؤها.
								</p>
							</div>

							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead>
										<tr>
											<th className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												الاسم
											</th>
											<th className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												الرمز
											</th>
											<th className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												اللون
											</th>
											<th className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												معاينة
											</th>
											<th className='px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												افتراضي
											</th>
											<th className='px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
												الإجراءات
											</th>
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										{branchStatuses.map((status) => (
											<tr key={status.id} className='hover:bg-gray-50'>
												<td className='px-6 py-4 whitespace-nowrap'>
													<input
														type='text'
														value={status.name}
														onChange={(e) => {
															setBranchStatuses((prevStatuses) =>
																prevStatuses.map((s) =>
																	s.id === status.id
																		? { ...s, name: e.target.value }
																		: s
																)
															);
														}}
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
													/>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<input
														type='text'
														value={status.code}
														onChange={(e) => {
															setBranchStatuses((prevStatuses) =>
																prevStatuses.map((s) =>
																	s.id === status.id
																		? { ...s, code: e.target.value }
																		: s
																)
															);
														}}
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
													/>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<input
														type='color'
														value={status.color}
														onChange={(e) => {
															setBranchStatuses((prevStatuses) =>
																prevStatuses.map((s) =>
																	s.id === status.id
																		? { ...s, color: e.target.value }
																		: s
																)
															);
														}}
														className='h-10 w-10 p-0.5 border border-gray-300 rounded-md shadow-sm'
													/>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<span
														className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium'
														style={{
															backgroundColor: `${status.color}20`, // إضافة شفافية للون
															color: status.color,
														}}
													>
														{status.name}
													</span>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-center'>
													<input
														type='checkbox'
														checked={status.isDefault}
														onChange={(e) => {
															// تحديث الحالة الافتراضية وإلغاء التحديد عن الحالات الأخرى
															if (e.target.checked) {
																setBranchStatuses((prevStatuses) =>
																	prevStatuses.map((s) =>
																		s.id === status.id
																			? { ...s, isDefault: true }
																			: { ...s, isDefault: false }
																	)
																);
															}
														}}
														className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
													/>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-center'>
													<button
														onClick={() => handleDeleteBranchStatus(status.id)}
														disabled={status.isDefault}
														className='text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed'
														title={
															status.isDefault ? 'لا يمكن حذف الحالة الافتراضية' : 'حذف'
														}
													>
														<Trash className='h-5 w-5' />
													</button>
												</td>
											</tr>
										))}
										{branchStatuses.length === 0 && (
											<tr>
												<td colSpan={6} className='px-6 py-4 text-center text-sm text-gray-500'>
													لا توجد حالات مضافة بعد
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{/* تصنيفات الفروع */}
					{activeTab === 'categories' && (
						<div>
							<div className='flex justify-between items-center mb-4'>
								<h2 className='text-lg font-medium text-gray-900'>تصنيفات الفروع</h2>
								<button
									onClick={handleAddBranchCategory}
									className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center'
								>
									<Plus className='ml-1 h-4 w-4' />
									إضافة تصنيف
								</button>
							</div>

							<div className='bg-gray-50 p-4 rounded-md mb-4'>
								<p className='text-sm text-gray-600'>
									تصنيفات الفروع تساعد في تنظيم الفروع حسب معايير مختلفة. يمكن استخدام التصنيفات
									لترتيب وفلترة الفروع في التقارير وعرض الإحصائيات.
								</p>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
								{branchCategories.map((category) => (
									<div
										key={category.id}
										className='bg-white p-4 border border-gray-200 rounded-lg shadow-sm'
									>
										<div className='flex justify-between items-start'>
											<div className='flex-1'>
												<input
													type='text'
													value={category.name}
													onChange={(e) => {
														setBranchCategories((prevCategories) =>
															prevCategories.map((c) =>
																c.id === category.id
																	? { ...c, name: e.target.value }
																	: c
															)
														);
													}}
													className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
												/>
											</div>
											<button
												onClick={() => handleDeleteBranchCategory(category.id)}
												className='ml-2 text-red-600 hover:text-red-900'
											>
												<Trash className='h-5 w-5' />
											</button>
										</div>
										<div className='mt-2'>
											<textarea
												value={category.description || ''}
												onChange={(e) => {
													setBranchCategories((prevCategories) =>
														prevCategories.map((c) =>
															c.id === category.id
																? { ...c, description: e.target.value }
																: c
														)
													);
												}}
												rows={3}
												placeholder='وصف التصنيف'
												className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-green-500 focus:border-green-500'
											></textarea>
										</div>
									</div>
								))}

								{branchCategories.length === 0 && (
									<div className='md:col-span-3 bg-white p-8 border border-gray-200 rounded-lg shadow-sm text-center'>
										<Tag className='h-12 w-12 mx-auto text-gray-300' />
										<h3 className='mt-2 text-sm font-medium text-gray-900'>لا توجد تصنيفات</h3>
										<p className='mt-1 text-sm text-gray-500'>
											قم بإضافة تصنيفات الفروع لتنظيم الفروع وتسهيل الوصول إليها
										</p>
										<button
											onClick={handleAddBranchCategory}
											className='mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none'
										>
											<Plus className='ml-1 h-4 w-4' />
											إضافة تصنيف جديد
										</button>
									</div>
								)}
							</div>
						</div>
					)}

					{/* سياسات الفروع */}
					{activeTab === 'policies' && (
						<div>
							<div className='flex justify-between items-center mb-4'>
								<h2 className='text-lg font-medium text-gray-900'>سياسات الفروع</h2>
							</div>

							<div className='bg-gray-50 p-4 rounded-md mb-4'>
								<p className='text-sm text-gray-600'>
									سياسات الفروع تحدد طريقة عمل النظام ومدى تفاعله مع الفروع. قم بتفعيل أو تعطيل
									السياسات حسب احتياجات المؤسسة.
								</p>
							</div>

							<div className='space-y-4'>
								{branchPolicies.map((policy) => (
									<div
										key={policy.id}
										className='bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center'
									>
										<div>
											<h3 className='text-sm font-medium text-gray-900'>{policy.name}</h3>
											<p className='mt-1 text-sm text-gray-500'>{policy.description}</p>
										</div>
										<div className='ml-4'>
											<button
												onClick={() => togglePolicy(policy.id)}
												className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none ${
													policy.enabled ? 'bg-green-500' : 'bg-gray-200'
												}`}
											>
												<span
													className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
														policy.enabled
															? 'translate-x-5 rtl:-translate-x-5'
															: 'translate-x-0'
													}`}
												></span>
											</button>
										</div>
									</div>
								))}

								{branchPolicies.length === 0 && (
									<div className='bg-white p-8 border border-gray-200 rounded-lg shadow-sm text-center'>
										<FileText className='h-12 w-12 mx-auto text-gray-300' />
										<h3 className='mt-2 text-sm font-medium text-gray-900'>لا توجد سياسات</h3>
										<p className='mt-1 text-sm text-gray-500'>لم يتم تعريف أي سياسات للفروع بعد</p>
									</div>
								)}
							</div>
						</div>
					)}

					{/* أدوار الفروع */}
					{activeTab === 'roles' && (
						<div>
							<div className='flex justify-between items-center mb-4'>
								<h2 className='text-lg font-medium text-gray-900'>أدوار الفروع</h2>
								<button className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center'>
									<Plus className='ml-1 h-4 w-4' />
									إضافة دور
								</button>
							</div>

							<div className='bg-gray-50 p-4 rounded-md mb-4'>
								<p className='text-sm text-gray-600'>
									أدوار الفروع تحدد صلاحيات الموظفين العاملين في الفروع. يمكن تعيين دور لكل موظف
									لتحديد العمليات المسموح له بها.
								</p>
							</div>

							<div className='space-y-4'>
								{branchRoles.map((role) => (
									<div
										key={role.id}
										className='bg-white border border-gray-200 rounded-lg overflow-hidden'
									>
										<div className='p-4 flex justify-between items-center border-b border-gray-200'>
											<h3 className='text-sm font-medium text-gray-900'>{role.name}</h3>
											<div className='flex space-x-2 space-x-reverse'>
												<button className='text-blue-600 hover:text-blue-800'>
													<Edit className='h-5 w-5' />
												</button>
												<button className='text-red-600 hover:text-red-800'>
													<Trash className='h-5 w-5' />
												</button>
											</div>
										</div>
										<div className='p-4'>
											<h4 className='text-xs font-medium text-gray-500 mb-2'>الصلاحيات:</h4>
											<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
												{role.permissions.map((permission, index) => (
													<div key={index} className='flex items-center'>
														<CheckCircle className='h-4 w-4 text-green-500 ml-1' />
														<span className='text-sm text-gray-700'>
															{(() => {
																switch (permission) {
																	case 'view_all':
																		return 'عرض كافة البيانات';
																	case 'edit_branch':
																		return 'تعديل بيانات الفرع';
																	case 'manage_employees':
																		return 'إدارة الموظفين';
																	case 'manage_documents':
																		return 'إدارة المستندات';
																	case 'view_documents':
																		return 'عرض المستندات';
																	case 'view_employees':
																		return 'عرض الموظفين';
																	case 'view_reports':
																		return 'عرض التقارير';
																	case 'manage_sales':
																		return 'إدارة المبيعات';
																	default:
																		return permission;
																}
															})()}
														</span>
													</div>
												))}
											</div>
										</div>
									</div>
								))}

								{branchRoles.length === 0 && (
									<div className='bg-white p-8 border border-gray-200 rounded-lg shadow-sm text-center'>
										<Users className='h-12 w-12 mx-auto text-gray-300' />
										<h3 className='mt-2 text-sm font-medium text-gray-900'>لا توجد أدوار</h3>
										<p className='mt-1 text-sm text-gray-500'>
											قم بإضافة أدوار جديدة لتحديد صلاحيات الموظفين في الفروع
										</p>
										<button className='mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none'>
											<Plus className='ml-1 h-4 w-4' />
											إضافة دور جديد
										</button>
									</div>
								)}
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
