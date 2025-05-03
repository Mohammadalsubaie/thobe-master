'use client';

import {
	Activity,
	AlertCircle,
	ArrowDown,
	ArrowUp,
	BarChart2,
	Check,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	ClipboardList,
	Clock,
	Edit,
	MoreHorizontal,
	Plus,
	Save,
	Settings,
	Trash,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ProductionStage {
	id: string;
	name: string;
	description: string;
	order: number;
	color: string;
	estimatedTime: number; // بالساعات
	requiredSkills: string[];
	activeTasksCount: number;
	isActive: boolean;
	isDefault: boolean;
	qualityChecks: {
		id: string;
		name: string;
		isRequired: boolean;
	}[];
}

export default function ProductionStagesPage() {
	const [loading, setLoading] = useState(true);
	const [stages, setStages] = useState<ProductionStage[]>([]);
	const [expandedStage, setExpandedStage] = useState<string | null>(null);

	// حالة تعديل المرحلة
	const [isEditing, setIsEditing] = useState(false);
	const [editingStage, setEditingStage] = useState<ProductionStage | null>(null);

	// حالة إضافة مرحلة جديدة
	const [isAddingStage, setIsAddingStage] = useState(false);
	const [newStage, setNewStage] = useState<Partial<ProductionStage>>({
		name: '',
		description: '',
		estimatedTime: 4,
		color: 'blue',
		requiredSkills: [],
		isActive: true,
		qualityChecks: [],
	});

	// أجراس معايير الجودة المؤقتة للمرحلة الجديدة
	const [newQualityCheck, setNewQualityCheck] = useState('');

	// حالة ترتيب المراحل
	const [showReorderMode, setShowReorderMode] = useState(false);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية لمراحل الإنتاج
			const mockStages: ProductionStage[] = [
				{
					id: 'stage-1',
					name: 'القياس',
					description: 'قياس العميل وأخذ المقاسات اللازمة',
					order: 1,
					color: 'blue',
					estimatedTime: 1, // ساعة
					requiredSkills: ['قياس', 'تدوين المقاسات'],
					activeTasksCount: 5,
					isActive: true,
					isDefault: true,
					qualityChecks: [
						{ id: 'qc-1-1', name: 'التأكد من دقة المقاسات', isRequired: true },
						{ id: 'qc-1-2', name: 'تسجيل المقاسات في النظام', isRequired: true },
						{ id: 'qc-1-3', name: 'التأكيد مع العميل على المقاسات', isRequired: false },
					],
				},
				{
					id: 'stage-2',
					name: 'التصميم',
					description: 'تصميم القصة والموديل وفقاً لمتطلبات العميل',
					order: 2,
					color: 'purple',
					estimatedTime: 2,
					requiredSkills: ['تصميم', 'رسم'],
					activeTasksCount: 3,
					isActive: true,
					isDefault: true,
					qualityChecks: [
						{ id: 'qc-2-1', name: 'مطابقة التصميم لمتطلبات العميل', isRequired: true },
						{ id: 'qc-2-2', name: 'التأكد من إمكانية تنفيذ التصميم', isRequired: true },
					],
				},
				{
					id: 'stage-3',
					name: 'القص',
					description: 'قص القماش وفقاً للتصميم والمقاسات',
					order: 3,
					color: 'amber',
					estimatedTime: 3,
					requiredSkills: ['قص', 'تعامل مع الأقمشة'],
					activeTasksCount: 7,
					isActive: true,
					isDefault: true,
					qualityChecks: [
						{ id: 'qc-3-1', name: 'دقة القص وفقاً للمقاسات', isRequired: true },
						{ id: 'qc-3-2', name: 'خلو القماش من العيوب', isRequired: true },
						{ id: 'qc-3-3', name: 'التأكد من توفير هوامش الخياطة', isRequired: true },
					],
				},
				{
					id: 'stage-4',
					name: 'الخياطة',
					description: 'خياطة الأجزاء وفقاً للتصميم',
					order: 4,
					color: 'green',
					estimatedTime: 8,
					requiredSkills: ['خياطة', 'تشطيب'],
					activeTasksCount: 10,
					isActive: true,
					isDefault: true,
					qualityChecks: [
						{ id: 'qc-4-1', name: 'متانة الخياطة', isRequired: true },
						{ id: 'qc-4-2', name: 'تناسق الغرز', isRequired: true },
						{ id: 'qc-4-3', name: 'دقة وصل الأجزاء', isRequired: true },
						{ id: 'qc-4-4', name: 'خلو الخياطة من التنسيل', isRequired: false },
					],
				},
				{
					id: 'stage-5',
					name: 'التطريز',
					description: 'تطريز القماش وفقاً للتصميم إذا تطلب الأمر',
					order: 5,
					color: 'pink',
					estimatedTime: 4,
					requiredSkills: ['تطريز'],
					activeTasksCount: 4,
					isActive: true,
					isDefault: false,
					qualityChecks: [
						{ id: 'qc-5-1', name: 'دقة التطريز وفقاً للتصميم', isRequired: true },
						{ id: 'qc-5-2', name: 'ثبات التطريز وعدم قابليته للتلف', isRequired: true },
					],
				},
				{
					id: 'stage-6',
					name: 'الكي والتشطيب',
					description: 'كي الثوب وإضافة اللمسات النهائية والتأكد من الجودة الشاملة',
					order: 6,
					color: 'red',
					estimatedTime: 2,
					requiredSkills: ['كي', 'تشطيب'],
					activeTasksCount: 8,
					isActive: true,
					isDefault: true,
					qualityChecks: [
						{ id: 'qc-6-1', name: 'جودة الكي', isRequired: true },
						{ id: 'qc-6-2', name: 'التأكد من عدم وجود خيوط زائدة', isRequired: true },
						{ id: 'qc-6-3', name: 'التأكد من المظهر العام للثوب', isRequired: true },
						{ id: 'qc-6-4', name: 'فحص جميع التفاصيل النهائية', isRequired: true },
					],
				},
				{
					id: 'stage-7',
					name: 'مراقبة الجودة النهائية',
					description: 'فحص نهائي شامل للثوب والتأكد من مطابقته للمواصفات',
					order: 7,
					color: 'gray',
					estimatedTime: 1,
					requiredSkills: ['فحص الجودة'],
					activeTasksCount: 6,
					isActive: true,
					isDefault: true,
					qualityChecks: [
						{ id: 'qc-7-1', name: 'فحص شامل للثوب', isRequired: true },
						{ id: 'qc-7-2', name: 'مطابقة المواصفات المطلوبة', isRequired: true },
						{ id: 'qc-7-3', name: 'التأكد من رضا العميل', isRequired: true },
					],
				},
			];

			// ترتيب المراحل
			mockStages.sort((a, b) => a.order - b.order);

			setStages(mockStages);
			setLoading(false);
		};

		fetchData();
	}, []);

	// توسيع/طي تفاصيل المرحلة
	const toggleStageExpand = (stageId: string) => {
		if (expandedStage === stageId) {
			setExpandedStage(null);
		} else {
			setExpandedStage(stageId);
		}
	};

	// بدء تعديل مرحلة
	const startEditingStage = (stage: ProductionStage) => {
		setEditingStage({ ...stage });
		setIsEditing(true);
		setExpandedStage(stage.id);
	};

	// إلغاء التعديل
	const cancelEditing = () => {
		setIsEditing(false);
		setEditingStage(null);
	};

	// حفظ التعديلات
	const saveStageChanges = () => {
		if (!editingStage) return;

		// تحديث المرحلة في القائمة
		setStages((prevStages) => prevStages.map((stage) => (stage.id === editingStage.id ? editingStage : stage)));

		setIsEditing(false);
		setEditingStage(null);
	};

	// بدء إضافة مرحلة جديدة
	const startAddingStage = () => {
		setIsAddingStage(true);
		setNewStage({
			name: '',
			description: '',
			estimatedTime: 4,
			color: 'blue',
			requiredSkills: [],
			isActive: true,
			qualityChecks: [],
		});
	};

	// إلغاء إضافة مرحلة جديدة
	const cancelAddingStage = () => {
		setIsAddingStage(false);
		setNewStage({
			name: '',
			description: '',
			estimatedTime: 4,
			color: 'blue',
			requiredSkills: [],
			isActive: true,
			qualityChecks: [],
		});
	};

	// حفظ المرحلة الجديدة
	const saveNewStage = () => {
		if (!newStage.name || !newStage.description) {
			alert('يرجى إدخال اسم ووصف المرحلة');
			return;
		}

		// إنشاء مرحلة جديدة
		const createdStage: ProductionStage = {
			id: `stage-${Date.now()}`,
			name: newStage.name || '',
			description: newStage.description || '',
			order: stages.length + 1,
			color: newStage.color || 'blue',
			estimatedTime: newStage.estimatedTime || 4,
			requiredSkills: newStage.requiredSkills || [],
			activeTasksCount: 0,
			isActive: newStage.isActive !== undefined ? newStage.isActive : true,
			isDefault: false,
			qualityChecks: newStage.qualityChecks || [],
		};

		// إضافة المرحلة الجديدة إلى القائمة
		setStages((prevStages) => [...prevStages, createdStage]);

		// إعادة تعيين نموذج الإضافة
		setIsAddingStage(false);
		setNewStage({
			name: '',
			description: '',
			estimatedTime: 4,
			color: 'blue',
			requiredSkills: [],
			isActive: true,
			qualityChecks: [],
		});
	};

	// إضافة معيار جودة جديد
	const addQualityCheck = () => {
		if (!newQualityCheck.trim()) return;

		if (isEditing && editingStage) {
			// إضافة معيار جودة للمرحلة التي يتم تعديلها
			setEditingStage({
				...editingStage,
				qualityChecks: [
					...editingStage.qualityChecks,
					{
						id: `qc-new-${Date.now()}`,
						name: newQualityCheck,
						isRequired: true,
					},
				],
			});
		} else if (isAddingStage) {
			// إضافة معيار جودة للمرحلة الجديدة
			setNewStage({
				...newStage,
				qualityChecks: [
					...(newStage.qualityChecks || []),
					{
						id: `qc-new-${Date.now()}`,
						name: newQualityCheck,
						isRequired: true,
					},
				],
			});
		}

		setNewQualityCheck('');
	};

	// حذف معيار جودة
	const removeQualityCheck = (checkId: string) => {
		if (isEditing && editingStage) {
			// حذف معيار جودة من المرحلة التي يتم تعديلها
			setEditingStage({
				...editingStage,
				qualityChecks: editingStage.qualityChecks.filter((check) => check.id !== checkId),
			});
		} else if (isAddingStage) {
			// حذف معيار جودة
			const removeQualityCheck = (checkId: string) => {
				if (isEditing && editingStage) {
					// حذف معيار جودة من المرحلة التي يتم تعديلها
					setEditingStage({
						...editingStage,
						qualityChecks: editingStage.qualityChecks.filter((check) => check.id !== checkId),
					});
				} else if (isAddingStage) {
					// حذف معيار جودة من المرحلة الجديدة
					setNewStage({
						...newStage,
						qualityChecks: (newStage.qualityChecks || []).filter((check) => check.id !== checkId),
					});
				}
			};

			// تغيير حالة إلزامية معيار الجودة
			const toggleQualityCheckRequired = (checkId: string) => {
				if (isEditing && editingStage) {
					// تغيير الحالة للمرحلة التي يتم تعديلها
					setEditingStage({
						...editingStage,
						qualityChecks: editingStage.qualityChecks.map((check) =>
							check.id === checkId ? { ...check, isRequired: !check.isRequired } : check
						),
					});
				} else if (isAddingStage) {
					// تغيير الحالة للمرحلة الجديدة
					setNewStage({
						...newStage,
						qualityChecks: (newStage.qualityChecks || []).map((check) =>
							check.id === checkId ? { ...check, isRequired: !check.isRequired } : check
						),
					});
				}
			};

			// تحريك المرحلة للأعلى
			const moveStageUp = (stageId: string) => {
				const stageIndex = stages.findIndex((s) => s.id === stageId);
				if (stageIndex <= 0) return; // لا يمكن تحريك المرحلة الأولى للأعلى

				const newStages = [...stages];

				// تبديل المراحل
				const temp = newStages[stageIndex];
				newStages[stageIndex] = newStages[stageIndex - 1];
				newStages[stageIndex - 1] = temp;

				// تحديث ترتيب المراحل
				newStages.forEach((stage, index) => {
					stage.order = index + 1;
				});

				setStages(newStages);
			};

			// تحريك المرحلة للأسفل
			const moveStageDown = (stageId: string) => {
				const stageIndex = stages.findIndex((s) => s.id === stageId);
				if (stageIndex >= stages.length - 1) return; // لا يمكن تحريك المرحلة الأخيرة للأسفل

				const newStages = [...stages];

				// تبديل المراحل
				const temp = newStages[stageIndex];
				newStages[stageIndex] = newStages[stageIndex + 1];
				newStages[stageIndex + 1] = temp;

				// تحديث ترتيب المراحل
				newStages.forEach((stage, index) => {
					stage.order = index + 1;
				});

				setStages(newStages);
			};

			// تغيير حالة تفعيل المرحلة
			const toggleStageActive = (stageId: string) => {
				setStages((prevStages) =>
					prevStages.map((stage) => (stage.id === stageId ? { ...stage, isActive: !stage.isActive } : stage))
				);
			};

			// حذف مرحلة (لن نسمح بحذف المراحل الافتراضية)
			const deleteStage = (stageId: string) => {
				const stage = stages.find((s) => s.id === stageId);
				if (!stage) return;

				if (stage.isDefault) {
					alert('لا يمكن حذف المراحل الافتراضية، يمكنك تعطيلها فقط');
					return;
				}

				if (stage.activeTasksCount > 0) {
					alert('لا يمكن حذف مرحلة تحتوي على مهام نشطة');
					return;
				}

				if (confirm('هل أنت متأكد من رغبتك في حذف هذه المرحلة؟')) {
					setStages((prevStages) => {
						const newStages = prevStages.filter((s) => s.id !== stageId);

						// إعادة ترتيب المراحل المتبقية
						newStages.forEach((stage, index) => {
							stage.order = index + 1;
						});

						return newStages;
					});
				}
			};

			// إضافة مهارة مطلوبة
			const addRequiredSkill = (skill: string) => {
				if (!skill.trim()) return;

				if (isEditing && editingStage) {
					if (editingStage.requiredSkills.includes(skill)) return;

					setEditingStage({
						...editingStage,
						requiredSkills: [...editingStage.requiredSkills, skill],
					});
				} else if (isAddingStage) {
					if (newStage.requiredSkills?.includes(skill)) return;

					setNewStage({
						...newStage,
						requiredSkills: [...(newStage.requiredSkills || []), skill],
					});
				}
			};

			// حذف مهارة مطلوبة
			const removeRequiredSkill = (skill: string) => {
				if (isEditing && editingStage) {
					setEditingStage({
						...editingStage,
						requiredSkills: editingStage.requiredSkills.filter((s) => s !== skill),
					});
				} else if (isAddingStage) {
					setNewStage({
						...newStage,
						requiredSkills: (newStage.requiredSkills || []).filter((s) => s !== skill),
					});
				}
			};

			// تحويل رمز اللون إلى فئة CSS
			const getColorClass = (color: string) => {
				switch (color) {
					case 'blue':
						return 'bg-blue-100 text-blue-800';
					case 'green':
						return 'bg-green-100 text-green-800';
					case 'amber':
						return 'bg-amber-100 text-amber-800';
					case 'red':
						return 'bg-red-100 text-red-800';
					case 'purple':
						return 'bg-purple-100 text-purple-800';
					case 'pink':
						return 'bg-pink-100 text-pink-800';
					case 'indigo':
						return 'bg-indigo-100 text-indigo-800';
					default:
						return 'bg-gray-100 text-gray-800';
				}
			};

			// الحصول على عنصر أيقونة اللون للتحديد
			const getColorOption = (color: string, isSelected: boolean, onSelect: () => void) => {
				const borderClass = isSelected ? 'ring-2 ring-offset-2 ring-indigo-500' : 'border border-gray-300';

				let bgClass = 'bg-gray-200';
				switch (color) {
					case 'blue':
						bgClass = 'bg-blue-500';
						break;
					case 'green':
						bgClass = 'bg-green-500';
						break;
					case 'amber':
						bgClass = 'bg-amber-500';
						break;
					case 'red':
						bgClass = 'bg-red-500';
						break;
					case 'purple':
						bgClass = 'bg-purple-500';
						break;
					case 'pink':
						bgClass = 'bg-pink-500';
						break;
					case 'indigo':
						bgClass = 'bg-indigo-500';
						break;
					case 'gray':
						bgClass = 'bg-gray-500';
						break;
				}

				return (
					<div
						className={`h-8 w-8 rounded-full ${bgClass} ${borderClass} cursor-pointer`}
						onClick={onSelect}
						title={color}
					/>
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
								<Activity className='inline-block ml-2 h-7 w-7 text-indigo-600' />
								مراحل الإنتاج
							</h1>
							<p className='mt-1 text-gray-500'>إدارة وتنظيم مراحل إنتاج الثياب</p>
						</div>

						<div className='flex gap-2'>
							<button
								onClick={() => setShowReorderMode(!showReorderMode)}
								className={`px-4 py-2 border ${
									showReorderMode
										? 'border-indigo-600 text-indigo-700 bg-indigo-50'
										: 'border-gray-300 text-gray-700 bg-white'
								} rounded-md hover:bg-gray-50 flex items-center`}
							>
								<Settings className='ml-1 h-4 w-4' />
								{showReorderMode ? 'إنهاء الترتيب' : 'ترتيب المراحل'}
							</button>
							{!isAddingStage && (
								<button
									onClick={startAddingStage}
									className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
								>
									<Plus className='ml-1 h-4 w-4' />
									إضافة مرحلة
								</button>
							)}
						</div>
					</div>

					{/* نموذج إضافة مرحلة جديدة */}
					{isAddingStage && (
						<div className='bg-white rounded-lg shadow-sm border border-indigo-200 overflow-hidden'>
							<div className='p-4 bg-indigo-50 border-b border-indigo-200'>
								<h2 className='text-lg font-medium text-indigo-900'>إضافة مرحلة جديدة</h2>
							</div>

							<div className='p-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<label
											htmlFor='new-stage-name'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											اسم المرحلة <span className='text-red-500'>*</span>
										</label>
										<input
											type='text'
											id='new-stage-name'
											value={newStage.name}
											onChange={(e) => setNewStage({ ...newStage, name: e.target.value })}
											className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
											placeholder='أدخل اسم المرحلة'
											required
										/>
									</div>

									<div>
										<label
											htmlFor='new-stage-time'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											الوقت المقدر (بالساعات)
										</label>
										<input
											type='number'
											id='new-stage-time'
											value={newStage.estimatedTime}
											onChange={(e) =>
												setNewStage({
													...newStage,
													estimatedTime: parseInt(e.target.value) || 0,
												})
											}
											min='0.5'
											step='0.5'
											className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
										/>
									</div>

									<div className='md:col-span-2'>
										<label
											htmlFor='new-stage-description'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											وصف المرحلة <span className='text-red-500'>*</span>
										</label>
										<textarea
											id='new-stage-description'
											value={newStage.description}
											onChange={(e) => setNewStage({ ...newStage, description: e.target.value })}
											rows={3}
											className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
											placeholder='أدخل وصفاً تفصيلياً للمرحلة'
											required
										/>
									</div>

									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											لون المرحلة
										</label>
										<div className='flex space-x-2 space-x-reverse'>
											{['blue', 'green', 'amber', 'red', 'purple', 'pink', 'indigo', 'gray'].map(
												(color) => (
													<div key={color} className='flex items-center'>
														{getColorOption(color, newStage.color === color, () =>
															setNewStage({ ...newStage, color })
														)}
													</div>
												)
											)}
										</div>
									</div>

									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>الحالة</label>
										<div className='flex items-center'>
											<input
												type='checkbox'
												id='new-stage-active'
												checked={newStage.isActive}
												onChange={(e) =>
													setNewStage({ ...newStage, isActive: e.target.checked })
												}
												className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ml-2'
											/>
											<label htmlFor='new-stage-active' className='text-sm text-gray-700'>
												المرحلة نشطة
											</label>
										</div>
									</div>

									<div className='md:col-span-2'>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											المهارات المطلوبة
										</label>
										<div className='flex flex-wrap gap-2 mb-2'>
											{newStage.requiredSkills?.map((skill) => (
												<div
													key={skill}
													className='inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm'
												>
													<span>{skill}</span>
													<button
														type='button'
														onClick={() => removeRequiredSkill(skill)}
														className='ml-1 text-gray-500 hover:text-gray-700'
													>
														<X className='h-3 w-3' />
													</button>
												</div>
											))}
										</div>
										<div className='flex'>
											<input
												type='text'
												placeholder='أضف مهارة مطلوبة'
												className='block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
												onKeyPress={(e) => {
													if (e.key === 'Enter') {
														e.preventDefault();
														const input = e.target as HTMLInputElement;
														addRequiredSkill(input.value);
														input.value = '';
													}
												}}
											/>
											<button
												type='button'
												onClick={(e) => {
													const input = e.currentTarget
														.previousElementSibling as HTMLInputElement;
													addRequiredSkill(input.value);
													input.value = '';
												}}
												className='inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100'
											>
												إضافة
											</button>
										</div>
									</div>

									<div className='md:col-span-2'>
										<label className='block text-sm font-medium text-gray-700 mb-1'>
											معايير الجودة
										</label>
										<div className='space-y-2 mb-3'>
											{newStage.qualityChecks?.map((check) => (
												<div
													key={check.id}
													className='flex items-center justify-between bg-gray-50 p-2 rounded-md'
												>
													<div className='flex items-center'>
														<input
															type='checkbox'
															checked={check.isRequired}
															onChange={() => toggleQualityCheckRequired(check.id)}
															className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ml-2'
														/>
														<span className='text-sm'>{check.name}</span>
													</div>
													<button
														type='button'
														onClick={() => removeQualityCheck(check.id)}
														className='text-gray-500 hover:text-red-600'
													>
														<Trash className='h-4 w-4' />
													</button>
												</div>
											))}
										</div>
										<div className='flex'>
											<input
												type='text'
												value={newQualityCheck}
												onChange={(e) => setNewQualityCheck(e.target.value)}
												placeholder='أضف معيار جودة جديد'
												className='block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
												onKeyPress={(e) => {
													if (e.key === 'Enter') {
														e.preventDefault();
														addQualityCheck();
													}
												}}
											/>
											<button
												type='button'
												onClick={addQualityCheck}
												className='inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100'
											>
												إضافة
											</button>
										</div>
									</div>
								</div>

								<div className='mt-4 flex justify-end gap-2'>
									<button
										type='button'
										onClick={cancelAddingStage}
										className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
									>
										إلغاء
									</button>
									<button
										type='button'
										onClick={saveNewStage}
										className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
									>
										حفظ المرحلة
									</button>
								</div>
							</div>
						</div>
					)}

					{/* قائمة المراحل */}
					<div className='space-y-4'>
						{stages.map((stage, index) => (
							<div
								key={stage.id}
								className={`bg-white rounded-lg shadow-sm border ${
									isEditing && editingStage?.id === stage.id ? 'border-indigo-300' : 'border-gray-200'
								} overflow-hidden ${!stage.isActive ? 'opacity-60' : ''}`}
							>
								<div
									className={`p-4 ${
										isEditing && editingStage?.id === stage.id
											? 'bg-indigo-50 border-b border-indigo-200'
											: 'border-b border-gray-200'
									} flex items-center justify-between`}
								>
									<div className='flex items-center'>
										{showReorderMode && (
											<div className='flex flex-col ml-2'>
												<button
													onClick={() => moveStageUp(stage.id)}
													disabled={index === 0}
													className={`p-1 text-gray-500 ${
														index === 0
															? 'opacity-30 cursor-not-allowed'
															: 'hover:text-indigo-700'
													}`}
												>
													<ArrowUp className='h-4 w-4' />
												</button>
												<button
													onClick={() => moveStageDown(stage.id)}
													disabled={index === stages.length - 1}
													className={`p-1 text-gray-500 ${
														index === stages.length - 1
															? 'opacity-30 cursor-not-allowed'
															: 'hover:text-indigo-700'
													}`}
												>
													<ArrowDown className='h-4 w-4' />
												</button>
											</div>
										)}
										<div
											className={`h-8 w-8 rounded-full flex items-center justify-center mr-1 ml-3 ${getColorClass(
												stage.color
											)}`}
										>
											<span className='text-sm font-bold'>{stage.order}</span>
										</div>
										{isEditing && editingStage?.id === stage.id ? (
											<input
												type='text'
												value={editingStage.name}
												onChange={(e) =>
													setEditingStage({ ...editingStage, name: e.target.value })
												}
												className='text-lg font-medium text-gray-900 border-b border-gray-300 focus:border-indigo-500 focus:ring-0 bg-transparent'
											/>
										) : (
											<h3 className='text-lg font-medium text-gray-900'>{stage.name}</h3>
										)}
										{stage.isDefault && (
											<span className='mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
												افتراضي
											</span>
										)}
										{!stage.isActive && (
											<span className='mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
												غير نشط
											</span>
										)}
									</div>

									<div className='flex gap-2'>
										{isEditing && editingStage?.id === stage.id ? (
											<>
												<button
													onClick={cancelEditing}
													className='px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm'
												>
													إلغاء
												</button>
												<button
													onClick={saveStageChanges}
													className='px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center'
												>
													<Save className='ml-1 h-3 w-3' />
													حفظ
												</button>
											</>
										) : (
											<>
												<button
													onClick={() => toggleStageExpand(stage.id)}
													className='px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm flex items-center'
												>
													{expandedStage === stage.id ? (
														<>
															<ChevronUp className='ml-1 h-3 w-3' />
															إخفاء
														</>
													) : (
														<>
															<ChevronDown className='ml-1 h-3 w-3' />
															عرض
														</>
													)}
												</button>
												{!showReorderMode && (
													<div className='relative group'>
														<button className='px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm'>
															<MoreHorizontal className='h-4 w-4' />
														</button>
														<div className='absolute left-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
															<button
																onClick={() => startEditingStage(stage)}
																className='block w-full text-right px-4 py-2 text-xs text-gray-700 hover:bg-gray-100'
															>
																<Edit className='inline ml-1 h-3 w-3' />
																تعديل المرحلة
															</button>
															<button
																onClick={() => toggleStageActive(stage.id)}
																className='block w-full text-right px-4 py-2 text-xs text-gray-700 hover:bg-gray-100'
															>
																{stage.isActive ? (
																	<>
																		<AlertCircle className='inline ml-1 h-3 w-3' />
																		تعطيل المرحلة
																	</>
																) : (
																	<>
																		<Check className='inline ml-1 h-3 w-3' />
																		تفعيل المرحلة
																	</>
																)}
															</button>
															{!stage.isDefault && (
																<button
																	onClick={() => deleteStage(stage.id)}
																	className='block w-full text-right px-4 py-2 text-xs text-red-600 hover:bg-red-50'
																>
																	<Trash className='inline ml-1 h-3 w-3' />
																	حذف المرحلة
																</button>
															)}
														</div>
													</div>
												)}
											</>
										)}
									</div>
								</div>

								{/* تفاصيل المرحلة */}
								{(expandedStage === stage.id || (isEditing && editingStage?.id === stage.id)) && (
									<div className='p-4 animate-fadeIn'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											{/* الوصف */}
											<div className='md:col-span-2'>
												<h4 className='text-sm font-medium text-gray-700 mb-1'>الوصف</h4>
												{isEditing && editingStage?.id === stage.id ? (
													<textarea
														value={editingStage.description}
														onChange={(e) =>
															setEditingStage({
																...editingStage,
																description: e.target.value,
															})
														}
														rows={3}
														className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
													/>
												) : (
													<p className='text-gray-600 text-sm'>{stage.description}</p>
												)}
											</div>

											{/* المدة المتوقعة */}
											<div>
												<h4 className='text-sm font-medium text-gray-700 mb-1'>
													المدة المتوقعة
												</h4>
												{isEditing && editingStage?.id === stage.id ? (
													<div className='flex items-center'>
														<input
															type='number'
															value={editingStage.estimatedTime}
															onChange={(e) =>
																setEditingStage({
																	...editingStage,
																	estimatedTime: parseInt(e.target.value) || 0,
																})
															}
															min='0.5'
															step='0.5'
															className='block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
														/>
														<span className='text-sm text-gray-500 mr-2'>ساعة</span>
													</div>
												) : (
													<div className='flex items-center'>
														<Clock className='h-4 w-4 text-gray-400 ml-1' />
														<span className='text-gray-600 text-sm'>
															{stage.estimatedTime} ساعة
														</span>
													</div>
												)}
											</div>

											{/* عدد المهام النشطة */}
											<div>
												<h4 className='text-sm font-medium text-gray-700 mb-1'>
													المهام النشطة
												</h4>
												<div className='flex items-center'>
													<ClipboardList className='h-4 w-4 text-gray-400 ml-1' />
													<span className='text-gray-600 text-sm'>
														{stage.activeTasksCount} مهمة
													</span>
													<Link
														href={`/dashboard/tailoring/tasks?stage=${stage.id}`}
														className='mr-2 text-xs text-indigo-600 hover:text-indigo-800'
													>
														عرض المهام
													</Link>
												</div>
											</div>

											{/* لون المرحلة */}
											{isEditing && editingStage?.id === stage.id && (
												<div>
													<h4 className='text-sm font-medium text-gray-700 mb-1'>
														لون المرحلة
													</h4>
													<div className='flex space-x-2 space-x-reverse'>
														{[
															'blue',
															'green',
															'amber',
															'red',
															'purple',
															'pink',
															'indigo',
															'gray',
														].map((color) => (
															<div key={color} className='flex items-center'>
																{getColorOption(
																	color,
																	editingStage.color === color,
																	() => setEditingStage({ ...editingStage, color })
																)}
															</div>
														))}
													</div>
												</div>
											)}

											{/* الحالة */}
											{isEditing && editingStage?.id === stage.id && (
												<div>
													<h4 className='text-sm font-medium text-gray-700 mb-1'>الحالة</h4>
													<div className='flex items-center'>
														<input
															type='checkbox'
															checked={editingStage.isActive}
															onChange={(e) =>
																setEditingStage({
																	...editingStage,
																	isActive: e.target.checked,
																})
															}
															className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ml-2'
														/>
														<label className='text-sm text-gray-700'>المرحلة نشطة</label>
													</div>
												</div>
											)}

											{/* المهارات المطلوبة */}
											<div className='md:col-span-2'>
												<h4 className='text-sm font-medium text-gray-700 mb-1'>
													المهارات المطلوبة
												</h4>
												{isEditing && editingStage?.id === stage.id ? (
													<>
														<div className='flex flex-wrap gap-2 mb-2'>
															{editingStage.requiredSkills.map((skill) => (
																<div
																	key={skill}
																	className='inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-xs'
																>
																	<span>{skill}</span>
																	<button
																		type='button'
																		onClick={() => removeRequiredSkill(skill)}
																		className='ml-1 text-gray-500 hover:text-gray-700'
																	>
																		<X className='h-3 w-3' />
																	</button>
																</div>
															))}
														</div>
														<div className='flex'>
															<input
																type='text'
																placeholder='أضف مهارة مطلوبة'
																className='block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
																onKeyPress={(e) => {
																	if (e.key === 'Enter') {
																		e.preventDefault();
																		const input = e.target as HTMLInputElement;
																		addRequiredSkill(input.value);
																		input.value = '';
																	}
																}}
															/>
															<button
																type='button'
																onClick={(e) => {
																	const input = e.currentTarget
																		.previousElementSibling as HTMLInputElement;
																	addRequiredSkill(input.value);
																	input.value = '';
																}}
																className='inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100'
															>
																إضافة
															</button>
														</div>
													</>
												) : (
													<div className='flex flex-wrap gap-1'>
														{stage.requiredSkills.length > 0 ? (
															stage.requiredSkills.map((skill, idx) => (
																<span
																	key={idx}
																	className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
																>
																	{skill}
																</span>
															))
														) : (
															<span className='text-gray-500 text-sm'>
																لا توجد مهارات مطلوبة محددة
															</span>
														)}
													</div>
												)}
											</div>

											{/* معايير الجودة */}
											<div className='md:col-span-2'>
												<h4 className='text-sm font-medium text-gray-700 mb-1'>
													معايير الجودة
												</h4>

												{isEditing && editingStage?.id === stage.id ? (
													<>
														<div className='space-y-2 mb-3'>
															{editingStage.qualityChecks.map((check) => (
																<div
																	key={check.id}
																	className='flex items-center justify-between bg-gray-50 p-2 rounded-md'
																>
																	<div className='flex items-center'>
																		<input
																			type='checkbox'
																			checked={check.isRequired}
																			onChange={() =>
																				toggleQualityCheckRequired(check.id)
																			}
																			className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ml-2'
																		/>
																		<span className='text-sm'>{check.name}</span>
																	</div>
																	<button
																		type='button'
																		onClick={() => removeQualityCheck(check.id)}
																		className='text-gray-500 hover:text-red-600'
																	>
																		<Trash className='h-4 w-4' />
																	</button>
																</div>
															))}
														</div>
														<div className='flex'>
															<input
																type='text'
																value={newQualityCheck}
																onChange={(e) => setNewQualityCheck(e.target.value)}
																placeholder='أضف معيار جودة جديد'
																className='block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
																onKeyPress={(e) => {
																	if (e.key === 'Enter') {
																		e.preventDefault();
																		addQualityCheck();
																	}
																}}
															/>
															<button
																type='button'
																onClick={addQualityCheck}
																className='inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-700 hover:bg-gray-100'
															>
																إضافة
															</button>
														</div>
													</>
												) : (
													<>
														{stage.qualityChecks.length > 0 ? (
															<div className='space-y-1'>
																{stage.qualityChecks.map((check) => (
																	<div key={check.id} className='flex items-start'>
																		<div className='flex-shrink-0 pt-0.5'>
																			{check.isRequired ? (
																				<div className='h-2 w-2 rounded-full bg-red-500 ml-2'></div>
																			) : (
																				<div className='h-2 w-2 rounded-full bg-gray-300 ml-2'></div>
																			)}
																		</div>
																		<p className='text-sm text-gray-600'>
																			{check.name}
																		</p>
																	</div>
																))}
															</div>
														) : (
															<p className='text-gray-500 text-sm'>
																لا توجد معايير جودة محددة
															</p>
														)}
														<div className='mt-2 text-xs text-gray-500'>
															<span className='inline-block h-2 w-2 rounded-full bg-red-500 ml-1'></span>
															إلزامي
															<span className='inline-block h-2 w-2 rounded-full bg-gray-300 mr-3 ml-1'></span>
															اختياري
														</div>
													</>
												)}
											</div>
										</div>

										{/* روابط سريعة إلى صفحات متعلقة */}
										{!isEditing && (
											<div className='mt-4 pt-3 border-t border-gray-200 flex gap-3'>
												<Link
													href={`/dashboard/tailoring/tasks?stage=${stage.id}`}
													className='text-xs text-indigo-600 hover:text-indigo-800 flex items-center'
												>
													<ClipboardList className='h-3 w-3 ml-1' />
													مهام المرحلة
												</Link>
												<Link
													href={`/dashboard/tailoring/quality?stage=${stage.id}`}
													className='text-xs text-indigo-600 hover:text-indigo-800 flex items-center'
												>
													<Check className='h-3 w-3 ml-1' />
													معايير الجودة
												</Link>
												<Link
													href={`/dashboard/tailoring/stats?stage=${stage.id}`}
													className='text-xs text-indigo-600 hover:text-indigo-800 flex items-center'
												>
													<BarChart2 className='h-3 w-3 ml-1' />
													إحصائيات المرحلة
												</Link>
											</div>
										)}
									</div>
								)}
							</div>
						))}
					</div>

					{/* معلومات ونصائح */}
					<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
						<h3 className='text-lg font-medium text-blue-900 mb-2 flex items-center'>
							<AlertCircle className='ml-2 h-5 w-5 text-blue-600' />
							معلومات مهمة
						</h3>
						<ul className='text-sm text-blue-800 list-disc list-inside space-y-1'>
							<li>المراحل الافتراضية لا يمكن حذفها، ولكن يمكن تعطيلها إذا لم تكن مستخدمة</li>
							<li>ترتيب المراحل مهم، لأنه يحدد مسار العمل والانتقال بين المراحل المختلفة</li>
							<li>المراحل غير النشطة لن تظهر في قوائم المهام وتوزيع العمل</li>
							<li>يمكن إضافة معايير جودة خاصة لكل مرحلة لضمان جودة العمل</li>
						</ul>
						<div className='mt-2 flex gap-2'>
							<Link
								href='/dashboard/tailoring/tasks'
								className='text-sm text-blue-700 hover:text-blue-900 flex items-center'
							>
								<ChevronRight className='ml-1 h-4 w-4' />
								الانتقال إلى جدول المهام
							</Link>
							<Link
								href='/dashboard/tailoring/quality'
								className='text-sm text-blue-700 hover:text-blue-900 flex items-center'
							>
								<ChevronRight className='ml-1 h-4 w-4' />
								الانتقال إلى مراقبة الجودة
							</Link>
						</div>
					</div>
				</div>
			);
		}
	};
}
