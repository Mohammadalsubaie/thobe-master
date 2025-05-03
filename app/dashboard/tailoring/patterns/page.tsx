'use client';

import {
	AlertCircle,
	ArrowUpRight,
	Check,
	CheckCircle,
	ChevronDown,
	ChevronUp,
	Copy,
	Edit,
	Eye,
	FileText,
	MoreHorizontal,
	Plus,
	Save,
	Search,
	Tag,
	Trash,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface MeasurementField {
	id: string;
	name: string;
	description: string;
	isRequired: boolean;
	defaultValue?: number;
	unit: 'cm' | 'inch';
	minValue?: number;
	maxValue?: number;
}

interface MeasurementPattern {
	id: string;
	name: string;
	description: string;
	type: 'thobe' | 'bisht' | 'shirt' | 'pants' | 'other';
	createdAt: string;
	updatedAt: string;
	isDefault: boolean;
	isActive: boolean;
	usageCount: number;
	linkedProducts: {
		id: string;
		name: string;
	}[];
	fields: MeasurementField[];
}

export default function MeasurementPatternsPage() {
	const [loading, setLoading] = useState(true);
	const [patterns, setPatterns] = useState<MeasurementPattern[]>([]);
	const [filteredPatterns, setFilteredPatterns] = useState<MeasurementPattern[]>([]);

	// حالة الفلترة
	const [searchTerm, setSearchTerm] = useState('');
	const [typeFilter, setTypeFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');

	// حالة عرض التفاصيل والتعديل
	const [expandedPattern, setExpandedPattern] = useState<string | null>(null);
	const [editingPattern, setEditingPattern] = useState<MeasurementPattern | null>(null);
	const [isEditing, setIsEditing] = useState(false);

	// حالة إضافة حقل قياس جديد
	const [showAddField, setShowAddField] = useState(false);
	const [newField, setNewField] = useState<Partial<MeasurementField>>({
		name: '',
		description: '',
		isRequired: true,
		unit: 'cm',
		minValue: undefined,
		maxValue: undefined,
	});

	// حالة إنشاء قالب جديد
	const [isCreatingPattern, setIsCreatingPattern] = useState(false);
	const [newPattern, setNewPattern] = useState<Partial<MeasurementPattern>>({
		name: '',
		description: '',
		type: 'thobe',
		isActive: true,
		fields: [],
	});

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية لقوالب القياس
			const mockPatterns: MeasurementPattern[] = [
				{
					id: 'pattern-1',
					name: 'قالب الثوب الكلاسيكي',
					description: 'قالب قياسات للثوب السعودي الكلاسيكي',
					type: 'thobe',
					createdAt: '2023-01-15T10:30:00',
					updatedAt: '2023-08-20T14:15:00',
					isDefault: true,
					isActive: true,
					usageCount: 248,
					linkedProducts: [
						{ id: 'prod-1', name: 'ثوب كلاسيكي' },
						{ id: 'prod-2', name: 'ثوب قطن مميز' },
					],
					fields: [
						{
							id: 'field-1-1',
							name: 'الطول الكامل',
							description: 'طول الثوب من الكتف إلى أسفل',
							isRequired: true,
							unit: 'cm',
							minValue: 120,
							maxValue: 180,
						},
						{
							id: 'field-1-2',
							name: 'طول الكتف',
							description: 'المسافة بين طرفي الكتف',
							isRequired: true,
							unit: 'cm',
							minValue: 40,
							maxValue: 65,
						},
						{
							id: 'field-1-3',
							name: 'عرض الصدر',
							description: 'محيط الصدر',
							isRequired: true,
							unit: 'cm',
							minValue: 80,
							maxValue: 140,
						},
						{
							id: 'field-1-4',
							name: 'طول الكم',
							description: 'طول الذراع من الكتف للمعصم',
							isRequired: true,
							unit: 'cm',
							minValue: 50,
							maxValue: 70,
						},
						{
							id: 'field-1-5',
							name: 'محيط الرقبة',
							description: 'محيط الرقبة',
							isRequired: true,
							unit: 'cm',
							minValue: 35,
							maxValue: 50,
						},
						{
							id: 'field-1-6',
							name: 'محيط الوسط',
							description: 'محيط الخصر',
							isRequired: false,
							unit: 'cm',
							minValue: 70,
							maxValue: 120,
						},
						{
							id: 'field-1-7',
							name: 'محيط الصدر العلوي',
							description: 'محيط الصدر عند الإبط',
							isRequired: false,
							unit: 'cm',
							minValue: 90,
							maxValue: 140,
						},
					],
				},
				{
					id: 'pattern-2',
					name: 'قالب البشت',
					description: 'قالب قياسات للبشت التقليدي',
					type: 'bisht',
					createdAt: '2023-02-20T11:45:00',
					updatedAt: '2023-07-15T09:30:00',
					isDefault: true,
					isActive: true,
					usageCount: 124,
					linkedProducts: [
						{ id: 'prod-3', name: 'بشت شتوي فاخر' },
						{ id: 'prod-4', name: 'بشت قطن' },
					],
					fields: [
						{
							id: 'field-2-1',
							name: 'الطول الكامل',
							description: 'طول البشت من الكتف إلى أسفل',
							isRequired: true,
							unit: 'cm',
							minValue: 130,
							maxValue: 170,
						},
						{
							id: 'field-2-2',
							name: 'طول الكتف',
							description: 'المسافة بين طرفي الكتف',
							isRequired: true,
							unit: 'cm',
							minValue: 42,
							maxValue: 68,
						},
						{
							id: 'field-2-3',
							name: 'طول الكم',
							description: 'طول الذراع من الكتف للمعصم',
							isRequired: true,
							unit: 'cm',
							minValue: 50,
							maxValue: 70,
						},
						{
							id: 'field-2-4',
							name: 'محيط الرقبة',
							description: 'محيط الرقبة',
							isRequired: true,
							unit: 'cm',
							minValue: 35,
							maxValue: 50,
						},
					],
				},
				{
					id: 'pattern-3',
					name: 'قالب الثوب الإماراتي',
					description: 'قالب قياسات للثوب الإماراتي بقصة خاصة',
					type: 'thobe',
					createdAt: '2023-03-10T13:15:00',
					updatedAt: '2023-06-10T15:45:00',
					isDefault: false,
					isActive: true,
					usageCount: 87,
					linkedProducts: [{ id: 'prod-5', name: 'ثوب إماراتي' }],
					fields: [
						{
							id: 'field-3-1',
							name: 'الطول الكامل',
							description: 'طول الثوب من الكتف إلى أسفل',
							isRequired: true,
							unit: 'cm',
							minValue: 125,
							maxValue: 180,
						},
						{
							id: 'field-3-2',
							name: 'طول الكتف',
							description: 'المسافة بين طرفي الكتف',
							isRequired: true,
							unit: 'cm',
							minValue: 40,
							maxValue: 65,
						},
						{
							id: 'field-3-3',
							name: 'عرض الصدر',
							description: 'محيط الصدر',
							isRequired: true,
							unit: 'cm',
							minValue: 80,
							maxValue: 140,
						},
						{
							id: 'field-3-4',
							name: 'طول الكم',
							description: 'طول الذراع من الكتف للمعصم',
							isRequired: true,
							unit: 'cm',
							minValue: 50,
							maxValue: 70,
						},
						{
							id: 'field-3-5',
							name: 'محيط الرقبة',
							description: 'محيط الرقبة',
							isRequired: true,
							unit: 'cm',
							minValue: 35,
							maxValue: 50,
						},
						{
							id: 'field-3-6',
							name: 'عرض الذيل',
							description: 'عرض الثوب من الأسفل',
							isRequired: true,
							unit: 'cm',
							minValue: 60,
							maxValue: 90,
						},
					],
				},
				{
					id: 'pattern-4',
					name: 'قالب القميص',
					description: 'قالب قياسات للقميص الرجالي',
					type: 'shirt',
					createdAt: '2023-04-05T09:00:00',
					updatedAt: '2023-05-05T10:30:00',
					isDefault: false,
					isActive: true,
					usageCount: 56,
					linkedProducts: [
						{ id: 'prod-6', name: 'قميص رسمي' },
						{ id: 'prod-7', name: 'قميص كاجوال' },
					],
					fields: [
						{
							id: 'field-4-1',
							name: 'طول القميص',
							description: 'طول القميص من الكتف إلى أسفل',
							isRequired: true,
							unit: 'cm',
							minValue: 65,
							maxValue: 90,
						},
						{
							id: 'field-4-2',
							name: 'طول الكتف',
							description: 'المسافة بين طرفي الكتف',
							isRequired: true,
							unit: 'cm',
							minValue: 40,
							maxValue: 60,
						},
						{
							id: 'field-4-3',
							name: 'محيط الصدر',
							description: 'محيط الصدر',
							isRequired: true,
							unit: 'cm',
							minValue: 80,
							maxValue: 130,
						},
						{
							id: 'field-4-4',
							name: 'طول الكم',
							description: 'طول الذراع من الكتف للمعصم',
							isRequired: true,
							unit: 'cm',
							minValue: 50,
							maxValue: 70,
						},
					],
				},
				{
					id: 'pattern-5',
					name: 'قالب ثوب الأطفال',
					description: 'قالب قياسات لثوب الأطفال',
					type: 'thobe',
					createdAt: '2023-05-18T14:20:00',
					updatedAt: '2023-05-18T14:20:00',
					isDefault: false,
					isActive: true,
					usageCount: 32,
					linkedProducts: [{ id: 'prod-8', name: 'ثوب أطفال كلاسيكي' }],
					fields: [
						{
							id: 'field-5-1',
							name: 'الطول الكامل',
							description: 'طول الثوب من الكتف إلى أسفل',
							isRequired: true,
							unit: 'cm',
							minValue: 80,
							maxValue: 120,
						},
						{
							id: 'field-5-2',
							name: 'طول الكتف',
							description: 'المسافة بين طرفي الكتف',
							isRequired: true,
							unit: 'cm',
							minValue: 30,
							maxValue: 45,
						},
						{
							id: 'field-5-3',
							name: 'عرض الصدر',
							description: 'محيط الصدر',
							isRequired: true,
							unit: 'cm',
							minValue: 60,
							maxValue: 85,
						},
						{
							id: 'field-5-4',
							name: 'طول الكم',
							description: 'طول الذراع من الكتف للمعصم',
							isRequired: true,
							unit: 'cm',
							minValue: 35,
							maxValue: 50,
						},
					],
				},
				{
					id: 'pattern-6',
					name: 'قالب السروال',
					description: 'قالب قياسات للسروال التقليدي',
					type: 'pants',
					createdAt: '2023-06-10T11:30:00',
					updatedAt: '2023-06-10T11:30:00',
					isDefault: false,
					isActive: false,
					usageCount: 18,
					linkedProducts: [],
					fields: [
						{
							id: 'field-6-1',
							name: 'طول السروال',
							description: 'طول السروال من الوسط إلى أسفل',
							isRequired: true,
							unit: 'cm',
							minValue: 90,
							maxValue: 120,
						},
						{
							id: 'field-6-2',
							name: 'محيط الوسط',
							description: 'محيط الخصر',
							isRequired: true,
							unit: 'cm',
							minValue: 70,
							maxValue: 120,
						},
						{
							id: 'field-6-3',
							name: 'محيط الأرداف',
							description: 'محيط الأرداف',
							isRequired: true,
							unit: 'cm',
							minValue: 85,
							maxValue: 130,
						},
						{
							id: 'field-6-4',
							name: 'طول الساق الداخلي',
							description: 'طول الساق من المنشعب إلى أسفل',
							isRequired: true,
							unit: 'cm',
							minValue: 70,
							maxValue: 95,
						},
					],
				},
			];

			setPatterns(mockPatterns);
			setFilteredPatterns(mockPatterns);
			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let filtered = [...patterns];

		// تطبيق فلتر البحث
		if (searchTerm) {
			filtered = filtered.filter(
				(pattern) =>
					pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					pattern.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// تطبيق فلتر النوع
		if (typeFilter !== 'all') {
			filtered = filtered.filter((pattern) => pattern.type === typeFilter);
		}

		// تطبيق فلتر الحالة
		if (statusFilter === 'active') {
			filtered = filtered.filter((pattern) => pattern.isActive);
		} else if (statusFilter === 'inactive') {
			filtered = filtered.filter((pattern) => !pattern.isActive);
		}

		setFilteredPatterns(filtered);
	}, [patterns, searchTerm, typeFilter, statusFilter]);

	// توسيع/طي تفاصيل القالب
	const togglePatternExpand = (patternId: string) => {
		if (expandedPattern === patternId) {
			setExpandedPattern(null);
		} else {
			setExpandedPattern(patternId);
		}
	};

	// بدء تعديل قالب
	const startEditingPattern = (pattern: MeasurementPattern) => {
		setEditingPattern({ ...pattern });
		setIsEditing(true);
		setExpandedPattern(pattern.id);
	};

	// إلغاء التعديل
	const cancelEditing = () => {
		setIsEditing(false);
		setEditingPattern(null);
	};

	// حفظ التعديلات
	const savePatternChanges = () => {
		if (!editingPattern) return;

		// تحديث القالب في القائمة
		setPatterns((prevPatterns) =>
			prevPatterns.map((pattern) => (pattern.id === editingPattern.id ? editingPattern : pattern))
		);

		setIsEditing(false);
		setEditingPattern(null);
	};

	// بدء إنشاء قالب جديد
	const startCreatingPattern = () => {
		setIsCreatingPattern(true);
		setNewPattern({
			name: '',
			description: '',
			type: 'thobe',
			isActive: true,
			fields: [],
		});
	};

	// إلغاء إنشاء قالب جديد
	const cancelCreatingPattern = () => {
		setIsCreatingPattern(false);
	};

	// حفظ القالب الجديد
	const saveNewPattern = () => {
		if (!newPattern.name || !newPattern.description) {
			alert('يرجى إدخال اسم ووصف القالب');
			return;
		}

		if (!newPattern.fields || newPattern.fields.length === 0) {
			alert('يجب إضافة حقل قياس واحد على الأقل');
			return;
		}

		// إنشاء قالب جديد
		const createdPattern: MeasurementPattern = {
			id: `pattern-${Date.now()}`,
			name: newPattern.name || '',
			description: newPattern.description || '',
			type: newPattern.type || 'thobe',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			isDefault: false,
			isActive: newPattern.isActive !== undefined ? newPattern.isActive : true,
			usageCount: 0,
			linkedProducts: [],
			fields: newPattern.fields || [],
		};

		// إضافة القالب الجديد إلى القائمة
		setPatterns((prevPatterns) => [...prevPatterns, createdPattern]);

		// إعادة تعيين نموذج الإنشاء
		setIsCreatingPattern(false);
		setNewPattern({
			name: '',
			description: '',
			type: 'thobe',
			isActive: true,
			fields: [],
		});
	};

	// إضافة حقل للقالب الجديد
	const addFieldToNewPattern = () => {
		if (!newField.name || !newField.description) {
			alert('يرجى إدخال اسم ووصف الحقل');
			return;
		}

		const createdField: MeasurementField = {
			id: `field-new-${Date.now()}`,
			name: newField.name || '',
			description: newField.description || '',
			isRequired: newField.isRequired !== undefined ? newField.isRequired : true,
			unit: newField.unit || 'cm',
			minValue: newField.minValue,
			maxValue: newField.maxValue,
		};

		setNewPattern({
			...newPattern,
			fields: [...(newPattern.fields || []), createdField],
		});

		// إعادة تعيين نموذج الحقل
		setNewField({
			name: '',
			description: '',
			isRequired: true,
			unit: 'cm',
			minValue: undefined,
			maxValue: undefined,
		});

		setShowAddField(false);
	};

	// إضافة حقل للقالب الموجود
	const addFieldToExistingPattern = () => {
		if (!editingPattern) return;
		if (!newField.name || !newField.description) {
			alert('يرجى إدخال اسم ووصف الحقل');
			return;
		}

		const createdField: MeasurementField = {
			id: `field-${editingPattern.id}-${Date.now()}`,
			name: newField.name || '',
			description: newField.description || '',
			isRequired: newField.isRequired !== undefined ? newField.isRequired : true,
			unit: newField.unit || 'cm',
			minValue: newField.minValue,
			maxValue: newField.maxValue,
		};

		setEditingPattern({
			...editingPattern,
			fields: [...editingPattern.fields, createdField],
		});

		// إعادة تعيين نموذج الحقل
		setNewField({
			name: '',
			description: '',
			isRequired: true,
			unit: 'cm',
			minValue: undefined,
			maxValue: undefined,
		});

		setShowAddField(false);
	};

	// حذف حقل من القالب الجديد
	const removeFieldFromNewPattern = (fieldId: string) => {
		setNewPattern({
			...newPattern,
			fields: (newPattern.fields || []).filter((field) => field.id !== fieldId),
		});
	};

	// حذف حقل من القالب الموجود
	const removeFieldFromExistingPattern = (fieldId: string) => {
		if (!editingPattern) return;

		setEditingPattern({
			...editingPattern,
			fields: editingPattern.fields.filter((field) => field.id !== fieldId),
		});
	};

	// تغيير حالة إلزامية الحقل للقالب الموجود
	const toggleFieldRequired = (fieldId: string) => {
		if (!editingPattern) return;

		setEditingPattern({
			...editingPattern,
			fields: editingPattern.fields.map((field) =>
				field.id === fieldId ? { ...field, isRequired: !field.isRequired } : field
			),
		});
	};

	// تغيير حالة تفعيل القالب
	const togglePatternActive = (patternId: string) => {
		setPatterns((prevPatterns) =>
			prevPatterns.map((pattern) =>
				pattern.id === patternId ? { ...pattern, isActive: !pattern.isActive } : pattern
			)
		);
	};

	// نسخ قالب
	const duplicatePattern = (pattern: MeasurementPattern) => {
		const duplicatedPattern: MeasurementPattern = {
			...pattern,
			id: `pattern-${Date.now()}`,
			name: `نسخة من ${pattern.name}`,
			isDefault: false,
			usageCount: 0,
			linkedProducts: [],
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			fields: pattern.fields.map((field) => ({
				...field,
				id: `field-copy-${Date.now()}-${field.id}`,
			})),
		};

		setPatterns((prevPatterns) => [...prevPatterns, duplicatedPattern]);
	};

	// حذف قالب
	const deletePattern = (patternId: string) => {
		const pattern = patterns.find((p) => p.id === patternId);
		if (!pattern) return;

		if (pattern.isDefault) {
			alert('لا يمكن حذف القوالب الافتراضية، يمكنك تعطيلها فقط');
			return;
		}

		if (pattern.usageCount > 0) {
			alert('لا يمكن حذف قالب مستخدم بالفعل في منتجات، يمكنك تعطيله فقط');
			return;
		}

		if (confirm('هل أنت متأكد من رغبتك في حذف هذا القالب؟')) {
			setPatterns((prevPatterns) => prevPatterns.filter((p) => p.id !== patternId));
		}
	};

	// ترجمة نوع القالب
	const getPatternTypeDisplay = (type: string) => {
		switch (type) {
			case 'thobe':
				return 'ثوب';
			case 'bisht':
				return 'بشت';
			case 'shirt':
				return 'قميص';
			case 'pants':
				return 'سروال';
			case 'other':
				return 'أخرى';
			default:
				return type;
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
						<FileText className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						قوالب القياس
					</h1>
					<p className='mt-1 text-gray-500'>إدارة قوالب القياس المستخدمة في المنتجات المختلفة</p>
				</div>

				<div>
					<button
						onClick={startCreatingPattern}
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						<Plus className='ml-1 h-4 w-4' />
						إنشاء قالب جديد
					</button>
				</div>
			</div>

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					{/* البحث */}
					<div className='relative'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='بحث عن اسم أو وصف قالب...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						/>
					</div>

					{/* فلتر النوع */}
					<div className='relative'>
						<select
							value={typeFilter}
							onChange={(e) => setTypeFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الأنواع</option>
							<option value='thobe'>ثوب</option>
							<option value='bisht'>بشت</option>
							<option value='shirt'>قميص</option>
							<option value='pants'>سروال</option>
							<option value='other'>أخرى</option>
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
							<option value='active'>نشط</option>
							<option value='inactive'>غير نشط</option>
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
							عرض {filteredPatterns.length} من {patterns.length} قالب
						</span>

						{(searchTerm || typeFilter !== 'all' || statusFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setTypeFilter('all');
									setStatusFilter('all');
								}}
								className='text-xs text-indigo-600 hover:text-indigo-800'
							>
								مسح الفلاتر
							</button>
						)}
					</div>
				</div>
			</div>

			{/* نموذج إنشاء قالب جديد */}
			{isCreatingPattern && (
				<div className='bg-white rounded-lg shadow border border-indigo-200 overflow-hidden mb-6'>
					<div className='p-4 bg-indigo-50 border-b border-indigo-200 flex justify-between items-center'>
						<h2 className='text-lg font-medium text-indigo-900'>إنشاء قالب قياس جديد</h2>
						<button onClick={cancelCreatingPattern} className='text-gray-500 hover:text-gray-700'>
							<X className='h-5 w-5' />
						</button>
					</div>

					<div className='p-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
							<div>
								<label
									htmlFor='new-pattern-name'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									اسم القالب <span className='text-red-500'>*</span>
								</label>
								<input
									type='text'
									id='new-pattern-name'
									value={newPattern.name}
									onChange={(e) => setNewPattern({ ...newPattern, name: e.target.value })}
									className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									placeholder='أدخل اسم القالب'
									required
								/>
							</div>

							<div>
								<label
									htmlFor='new-pattern-type'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									نوع القالب
								</label>
								<select
									id='new-pattern-type'
									value={newPattern.type}
									onChange={(e) => setNewPattern({ ...newPattern, type: e.target.value as any })}
									className='block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
								>
									<option value='thobe'>ثوب</option>
									<option value='bisht'>بشت</option>
									<option value='shirt'>قميص</option>
									<option value='pants'>سروال</option>
									<option value='other'>أخرى</option>
								</select>
							</div>

							<div className='md:col-span-2'>
								<label
									htmlFor='new-pattern-description'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									وصف القالب <span className='text-red-500'>*</span>
								</label>
								<textarea
									id='new-pattern-description'
									value={newPattern.description}
									onChange={(e) => setNewPattern({ ...newPattern, description: e.target.value })}
									rows={2}
									className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									placeholder='أدخل وصفاً مختصراً للقالب'
									required
								/>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>الحالة</label>
								<div className='flex items-center'>
									<input
										type='checkbox'
										id='new-pattern-active'
										checked={newPattern.isActive}
										onChange={(e) => setNewPattern({ ...newPattern, isActive: e.target.checked })}
										className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ml-2'
									/>
									<label htmlFor='new-pattern-active' className='text-sm text-gray-700'>
										القالب نشط
									</label>
								</div>
							</div>
						</div>

						{/* حقول القياس */}
						<div className='mb-4'>
							<div className='flex justify-between items-center mb-2'>
								<h3 className='text-sm font-medium text-gray-700'>حقول القياس</h3>
								<button
									onClick={() => setShowAddField(true)}
									className='text-xs text-indigo-600 hover:text-indigo-800 flex items-center'
								>
									<Plus className='mr-1 h-3 w-3' />
									إضافة حقل
								</button>
							</div>

							{newPattern.fields && newPattern.fields.length > 0 ? (
								<div className='border border-gray-200 rounded-md overflow-hidden'>
									<table className='min-w-full divide-y divide-gray-200'>
										<thead className='bg-gray-50'>
											<tr>
												<th
													scope='col'
													className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													الاسم
												</th>
												<th
													scope='col'
													className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													الوصف
												</th>
												<th
													scope='col'
													className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													النطاق
												</th>
												<th
													scope='col'
													className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													إلزامي
												</th>
												<th
													scope='col'
													className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													الإجراءات
												</th>
											</tr>
										</thead>
										<tbody className='bg-white divide-y divide-gray-200'>
											{newPattern.fields.map((field) => (
												<tr key={field.id}>
													<td className='px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900'>
														{field.name}
													</td>
													<td className='px-4 py-2 text-sm text-gray-500'>
														{field.description}
													</td>
													<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
														{field.minValue && field.maxValue
															? `${field.minValue} - ${field.maxValue} ${field.unit}`
															: `${field.unit}`}
													</td>
													<td className='px-4 py-2 whitespace-nowrap'>
														{field.isRequired ? (
															<CheckCircle className='h-5 w-5 text-green-500' />
														) : (
															<span className='text-xs text-gray-500'>اختياري</span>
														)}
													</td>
													<td className='px-4 py-2 whitespace-nowrap text-center'>
														<button
															onClick={() => removeFieldFromNewPattern(field.id)}
															className='text-red-600 hover:text-red-800'
															title='حذف الحقل'
														>
															<Trash className='h-4 w-4' />
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							) : (
								<div className='text-center py-6 bg-gray-50 border border-dashed border-gray-300 rounded-md'>
									<p className='text-sm text-gray-500'>
										لم تتم إضافة حقول قياس بعد. انقر على "إضافة حقل" لإضافة حقول القياس.
									</p>
								</div>
							)}
						</div>

						{/* نموذج إضافة حقل جديد */}
						{showAddField && (
							<div className='bg-gray-50 p-4 rounded-md border border-gray-200 mb-4'>
								<div className='flex justify-between items-center mb-3'>
									<h3 className='text-sm font-medium text-gray-700'>إضافة حقل قياس جديد</h3>
									<button
										onClick={() => setShowAddField(false)}
										className='text-gray-500 hover:text-gray-700'
									>
										<X className='h-4 w-4' />
									</button>
								</div>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
									<div>
										<label
											htmlFor='new-field-name'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											اسم الحقل <span className='text-red-500'>*</span>
										</label>
										<input
											type='text'
											id='new-field-name'
											value={newField.name}
											onChange={(e) => setNewField({ ...newField, name: e.target.value })}
											className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
											placeholder='مثال: الطول الكامل'
											required
										/>
									</div>

									<div>
										<label
											htmlFor='new-field-unit'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											وحدة القياس
										</label>
										<select
											id='new-field-unit'
											value={newField.unit}
											onChange={(e) =>
												setNewField({ ...newField, unit: e.target.value as 'cm' | 'inch' })
											}
											className='block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
										>
											<option value='cm'>سنتيمتر (سم)</option>
											<option value='inch'>إنش</option>
										</select>
									</div>

									<div className='md:col-span-2'>
										<label
											htmlFor='new-field-description'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											وصف الحقل <span className='text-red-500'>*</span>
										</label>
										<input
											type='text'
											id='new-field-description'
											value={newField.description}
											onChange={(e) => setNewField({ ...newField, description: e.target.value })}
											className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
											placeholder='مثال: طول الثوب من الكتف إلى أسفل'
											required
										/>
									</div>

									<div>
										<label
											htmlFor='new-field-min'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											الحد الأدنى
										</label>
										<input
											type='number'
											id='new-field-min'
											value={newField.minValue === undefined ? '' : newField.minValue}
											onChange={(e) =>
												setNewField({
													...newField,
													minValue: e.target.value ? parseFloat(e.target.value) : undefined,
												})
											}
											className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
											placeholder='أدخل الحد الأدنى'
										/>
									</div>

									<div>
										<label
											htmlFor='new-field-max'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											الحد الأقصى
										</label>
										<input
											type='number'
											id='new-field-max'
											value={newField.maxValue === undefined ? '' : newField.maxValue}
											onChange={(e) =>
												setNewField({
													...newField,
													maxValue: e.target.value ? parseFloat(e.target.value) : undefined,
												})
											}
											className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
											placeholder='أدخل الحد الأقصى'
										/>
									</div>

									<div className='md:col-span-2'>
										<div className='flex items-center'>
											<input
												type='checkbox'
												id='new-field-required'
												checked={newField.isRequired}
												onChange={(e) =>
													setNewField({ ...newField, isRequired: e.target.checked })
												}
												className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ml-2'
											/>
											<label htmlFor='new-field-required' className='text-sm text-gray-700'>
												هذا الحقل إلزامي
											</label>
										</div>
									</div>
								</div>

								<div className='mt-3 flex justify-end'>
									<button
										onClick={() => addFieldToNewPattern()}
										className='px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm'
									>
										إضافة الحقل
									</button>
								</div>
							</div>
						)}

						<div className='flex justify-end gap-2'>
							<button
								type='button'
								onClick={cancelCreatingPattern}
								className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
							>
								إلغاء
							</button>
							<button
								type='button'
								onClick={saveNewPattern}
								className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
							>
								<Save className='ml-1 h-4 w-4' />
								حفظ القالب
							</button>
						</div>
					</div>
				</div>
			)}

			{/* قائمة القوالب */}
			{filteredPatterns.length > 0 ? (
				<div className='space-y-4'>
					{filteredPatterns.map((pattern) => (
						<div
							key={pattern.id}
							className={`bg-white rounded-lg shadow-sm border ${
								isEditing && editingPattern?.id === pattern.id ? 'border-indigo-300' : 'border-gray-200'
							} overflow-hidden ${!pattern.isActive ? 'opacity-70' : ''}`}
						>
							<div
								className={`p-4 ${
									isEditing && editingPattern?.id === pattern.id
										? 'bg-indigo-50 border-b border-indigo-200'
										: 'border-b border-gray-200'
								} flex justify-between items-center`}
							>
								<div className='flex items-center'>
									<div className='ml-3'>
										<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
											{getPatternTypeDisplay(pattern.type)}
										</span>
									</div>
									{isEditing && editingPattern?.id === pattern.id ? (
										<input
											type='text'
											value={editingPattern.name}
											onChange={(e) =>
												setEditingPattern({ ...editingPattern, name: e.target.value })
											}
											className='text-lg font-medium text-gray-900 border-b border-gray-300 focus:border-indigo-500 focus:ring-0 bg-transparent'
										/>
									) : (
										<h3 className='text-lg font-medium text-gray-900'>{pattern.name}</h3>
									)}
									{pattern.isDefault && (
										<span className='mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
											افتراضي
										</span>
									)}
									{!pattern.isActive && (
										<span className='mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
											غير نشط
										</span>
									)}
								</div>

								<div className='flex gap-2'>
									{isEditing && editingPattern?.id === pattern.id ? (
										<>
											<button
												onClick={cancelEditing}
												className='px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm'
											>
												إلغاء
											</button>
											<button
												onClick={savePatternChanges}
												className='px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center'
											>
												<Save className='ml-1 h-3 w-3' />
												حفظ
											</button>
										</>
									) : (
										<>
											<button
												onClick={() => togglePatternExpand(pattern.id)}
												className='px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm flex items-center'
											>
												{expandedPattern === pattern.id ? (
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
												<button className='px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm'>
													<MoreHorizontal className='h-4 w-4' />
												</button>
												<div className='absolute left-0 mt-1 w-40 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
													<button
														onClick={() => startEditingPattern(pattern)}
														className='block w-full text-right px-4 py-2 text-xs text-gray-700 hover:bg-gray-100'
													>
														<Edit className='inline ml-1 h-3 w-3' />
														تعديل القالب
													</button>
													<button
														onClick={() => duplicatePattern(pattern)}
														className='block w-full text-right px-4 py-2 text-xs text-gray-700 hover:bg-gray-100'
													>
														<Copy className='inline ml-1 h-3 w-3' />
														نسخ القالب
													</button>
													<button
														onClick={() => togglePatternActive(pattern.id)}
														className='block w-full text-right px-4 py-2 text-xs text-gray-700 hover:bg-gray-100'
													>
														{pattern.isActive ? (
															<>
																<AlertCircle className='inline ml-1 h-3 w-3' />
																تعطيل القالب
															</>
														) : (
															<>
																<Check className='inline ml-1 h-3 w-3' />
																تفعيل القالب
															</>
														)}
													</button>
													{!pattern.isDefault && (
														<button
															onClick={() => deletePattern(pattern.id)}
															className='block w-full text-right px-4 py-2 text-xs text-red-600 hover:bg-red-50'
														>
															<Trash className='inline ml-1 h-3 w-3' />
															حذف القالب
														</button>
													)}
												</div>
											</div>
										</>
									)}
								</div>
							</div>

							{/* وصف القالب */}
							<div className='p-4 bg-gray-50'>
								{isEditing && editingPattern?.id === pattern.id ? (
									<textarea
										value={editingPattern.description}
										onChange={(e) =>
											setEditingPattern({ ...editingPattern, description: e.target.value })
										}
										rows={2}
										className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
									/>
								) : (
									<p className='text-gray-600 text-sm'>{pattern.description}</p>
								)}

								<div className='mt-2 flex flex-wrap gap-3 text-xs text-gray-500'>
									<span className='flex items-center'>
										<Tag className='h-3 w-3 ml-1' />
										{pattern.fields.length} حقل قياس
									</span>
									<span className='flex items-center'>
										<CheckCircle className='h-3 w-3 ml-1' />
										استخدم {pattern.usageCount} مرة
									</span>
									<span>آخر تحديث: {formatDate(pattern.updatedAt)}</span>
								</div>
							</div>

							{/* تفاصيل القالب */}
							{(expandedPattern === pattern.id || (isEditing && editingPattern?.id === pattern.id)) && (
								<div className='p-4 animate-fadeIn'>
									{/* حقول القياس */}
									<div className='mb-4'>
										<div className='flex justify-between items-center mb-2'>
											<h3 className='text-sm font-medium text-gray-700'>حقول القياس</h3>
											{isEditing && editingPattern?.id === pattern.id && (
												<button
													onClick={() => setShowAddField(true)}
													className='text-xs text-indigo-600 hover:text-indigo-800 flex items-center'
												>
													<Plus className='mr-1 h-3 w-3' />
													إضافة حقل
												</button>
											)}
										</div>

										{isEditing && editingPattern?.id === pattern.id && showAddField && (
											<div className='bg-gray-50 p-4 rounded-md border border-gray-200 mb-4'>
												<div className='flex justify-between items-center mb-3'>
													<h3 className='text-sm font-medium text-gray-700'>
														إضافة حقل قياس جديد
													</h3>
													<button
														onClick={() => setShowAddField(false)}
														className='text-gray-500 hover:text-gray-700'
													>
														<X className='h-4 w-4' />
													</button>
												</div>

												<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
													<div>
														<label
															htmlFor='new-field-name-edit'
															className='block text-sm font-medium text-gray-700 mb-1'
														>
															اسم الحقل <span className='text-red-500'>*</span>
														</label>
														<input
															type='text'
															id='new-field-name-edit'
															value={newField.name}
															onChange={(e) =>
																setNewField({ ...newField, name: e.target.value })
															}
															className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
															placeholder='مثال: الطول الكامل'
															required
														/>
													</div>

													<div>
														<label
															htmlFor='new-field-unit-edit'
															className='block text-sm font-medium text-gray-700 mb-1'
														>
															وحدة القياس
														</label>
														<select
															id='new-field-unit-edit'
															value={newField.unit}
															onChange={(e) =>
																setNewField({
																	...newField,
																	unit: e.target.value as 'cm' | 'inch',
																})
															}
															className='block w-full appearance-none rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
														>
															<option value='cm'>سنتيمتر (سم)</option>
															<option value='inch'>إنش</option>
														</select>
													</div>

													<div className='md:col-span-2'>
														<label
															htmlFor='new-field-description-edit'
															className='block text-sm font-medium text-gray-700 mb-1'
														>
															وصف الحقل <span className='text-red-500'>*</span>
														</label>
														<input
															type='text'
															id='new-field-description-edit'
															value={newField.description}
															onChange={(e) =>
																setNewField({
																	...newField,
																	description: e.target.value,
																})
															}
															className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
															placeholder='مثال: طول الثوب من الكتف إلى أسفل'
															required
														/>
													</div>

													<div>
														<label
															htmlFor='new-field-min-edit'
															className='block text-sm font-medium text-gray-700 mb-1'
														>
															الحد الأدنى
														</label>
														<input
															type='number'
															id='new-field-min-edit'
															value={
																newField.minValue === undefined ? '' : newField.minValue
															}
															onChange={(e) =>
																setNewField({
																	...newField,
																	minValue: e.target.value
																		? parseFloat(e.target.value)
																		: undefined,
																})
															}
															className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
															placeholder='أدخل الحد الأدنى'
														/>
													</div>

													<div>
														<label
															htmlFor='new-field-max-edit'
															className='block text-sm font-medium text-gray-700 mb-1'
														>
															الحد الأقصى
														</label>
														<input
															type='number'
															id='new-field-max-edit'
															value={
																newField.maxValue === undefined ? '' : newField.maxValue
															}
															onChange={(e) =>
																setNewField({
																	...newField,
																	maxValue: e.target.value
																		? parseFloat(e.target.value)
																		: undefined,
																})
															}
															className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
															placeholder='أدخل الحد الأقصى'
														/>
													</div>

													<div className='md:col-span-2'>
														<div className='flex items-center'>
															<input
																type='checkbox'
																id='new-field-required-edit'
																checked={newField.isRequired}
																onChange={(e) =>
																	setNewField({
																		...newField,
																		isRequired: e.target.checked,
																	})
																}
																className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ml-2'
															/>
															<label
																htmlFor='new-field-required-edit'
																className='text-sm text-gray-700'
															>
																هذا الحقل إلزامي
															</label>
														</div>
													</div>
												</div>

												<div className='mt-3 flex justify-end'>
													<button
														onClick={() => addFieldToExistingPattern()}
														className='px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm'
													>
														إضافة الحقل
													</button>
												</div>
											</div>
										)}

										<div className='border border-gray-200 rounded-md overflow-hidden'>
											<table className='min-w-full divide-y divide-gray-200'>
												<thead className='bg-gray-50'>
													<tr>
														<th
															scope='col'
															className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															الاسم
														</th>
														<th
															scope='col'
															className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															الوصف
														</th>
														<th
															scope='col'
															className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															النطاق
														</th>
														<th
															scope='col'
															className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															إلزامي
														</th>
														{isEditing && editingPattern?.id === pattern.id && (
															<th
																scope='col'
																className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
															>
																الإجراءات
															</th>
														)}
													</tr>
												</thead>
												<tbody className='bg-white divide-y divide-gray-200'>
													{(isEditing && editingPattern?.id === pattern.id
														? editingPattern.fields
														: pattern.fields
													).map((field) => (
														<tr key={field.id}>
															<td className='px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900'>
																{field.name}
															</td>
															<td className='px-4 py-2 text-sm text-gray-500'>
																{field.description}
															</td>
															<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-500'>
																{field.minValue && field.maxValue
																	? `${field.minValue} - ${field.maxValue} ${field.unit}`
																	: `${field.unit}`}
															</td>
															<td className='px-4 py-2 whitespace-nowrap'>
																{isEditing && editingPattern?.id === pattern.id ? (
																	<div className='flex items-center'>
																		<input
																			type='checkbox'
																			checked={field.isRequired}
																			onChange={() =>
																				toggleFieldRequired(field.id)
																			}
																			className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
																		/>
																	</div>
																) : field.isRequired ? (
																	<CheckCircle className='h-5 w-5 text-green-500' />
																) : (
																	<span className='text-xs text-gray-500'>
																		اختياري
																	</span>
																)}
															</td>
															{isEditing && editingPattern?.id === pattern.id && (
																<td className='px-4 py-2 whitespace-nowrap text-center'>
																	<button
																		onClick={() =>
																			removeFieldFromExistingPattern(field.id)
																		}
																		className='text-red-600 hover:text-red-800'
																		title='حذف الحقل'
																	>
																		<Trash className='h-4 w-4' />
																	</button>
																</td>
															)}
														</tr>
													))}
												</tbody>
											</table>
										</div>
									</div>

									{/* المنتجات المرتبطة */}
									{!isEditing && pattern.linkedProducts.length > 0 && (
										<div className='mt-4'>
											<h3 className='text-sm font-medium text-gray-700 mb-2'>
												المنتجات المرتبطة
											</h3>
											<div className='flex flex-wrap gap-2'>
												{pattern.linkedProducts.map((product) => (
													<Link
														key={product.id}
														href={`/dashboard/products/${product.id}`}
														className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200'
													>
														{product.name}
														<ArrowUpRight className='mr-1 h-3 w-3' />
													</Link>
												))}
											</div>
										</div>
									)}

									{isEditing && editingPattern?.id === pattern.id && (
										<div className='mt-4'>
											<div className='flex items-center'>
												<input
													type='checkbox'
													id='edit-pattern-active'
													checked={editingPattern.isActive}
													onChange={(e) =>
														setEditingPattern({
															...editingPattern,
															isActive: e.target.checked,
														})
													}
													className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 ml-2'
												/>
												<label htmlFor='edit-pattern-active' className='text-sm text-gray-700'>
													القالب نشط
												</label>
											</div>
										</div>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			) : (
				<div className='bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center'>
					<FileText className='h-12 w-12 text-gray-300 mx-auto mb-3' />
					<h3 className='text-lg font-medium text-gray-900'>لا توجد قوالب قياس</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
							? 'لم يتم العثور على قوالب تطابق معايير البحث المحددة'
							: 'لا توجد قوالب قياس مسجلة في النظام. أنشئ قالب جديد للبدء.'}
					</p>
					<div className='mt-4'>
						<button
							onClick={startCreatingPattern}
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
						>
							<Plus className='ml-1 h-4 w-4' />
							إنشاء قالب جديد
						</button>
					</div>
				</div>
			)}

			{/* معلومات مساعدة */}
			<div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
				<h3 className='text-lg font-medium text-blue-900 mb-2 flex items-center'>
					<AlertCircle className='ml-2 h-5 w-5 text-blue-600' />
					نصائح استخدام قوالب القياس
				</h3>
				<ul className='text-sm text-blue-800 list-disc list-inside space-y-1'>
					<li>قوالب القياس تساعد في توحيد طريقة أخذ القياسات لنفس نوع المنتج</li>
					<li>استخدم القوالب الافتراضية كنقطة بداية ثم قم بتخصيصها حسب احتياجاتك</li>
					<li>يمكنك تحديد القيم المتوقعة للمقاسات لتنبيه الخياطين في حال تجاوز الحدود المنطقية</li>
					<li>ربط قوالب القياس بالمنتجات يتم من صفحة إعدادات المنتج</li>
				</ul>
				<div className='mt-2 text-sm text-blue-700'>
					<Link href='/dashboard/support/guide/category/measurements' className='hover:underline'>
						تعرف على المزيد حول قوالب القياس وكيفية استخدامها بكفاءة
					</Link>
				</div>
			</div>
		</div>
	);
}
