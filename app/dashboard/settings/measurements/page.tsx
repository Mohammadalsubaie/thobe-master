'use client';

import { ArrowLeft, Plus, Save, Trash } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// واجهة بيانات حقل القياس مع إضافة الحدود العليا والدنيا
interface MeasurementField {
	id: string;
	name: string;
	description: string;
	isRequired: boolean;
	defaultValue: number;
	unit: 'cm' | 'inch';
	order: number;
	minValue: number; // الحد الأدنى للقياس
	maxValue: number; // الحد الأعلى للقياس
}

// واجهة بيانات قالب القياس
interface MeasurementTemplate {
	id: string;
	name: string;
	category: 'male' | 'female' | 'child';
	type: 'front' | 'back' | 'side';
	imageUrl: string;
	isDefault: boolean;
}

export default function MeasurementSettingsPage() {
	const [activeTab, setActiveTab] = useState('fields');
	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [fields, setFields] = useState<MeasurementField[]>([]);
	const [templates, setTemplates] = useState<MeasurementTemplate[]>([]);
	const [showFieldModal, setShowFieldModal] = useState(false);
	const [showTemplateModal, setShowTemplateModal] = useState(false);
	const [editingField, setEditingField] = useState<MeasurementField | null>(null);
	const [editingTemplate, setEditingTemplate] = useState<MeasurementTemplate | null>(null);
	const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

	// قيم جديدة للنموذج
	const [fieldName, setFieldName] = useState('');
	const [fieldDescription, setFieldDescription] = useState('');
	const [fieldUnit, setFieldUnit] = useState<'cm' | 'inch'>('cm');
	const [fieldIsRequired, setFieldIsRequired] = useState(false);
	const [fieldOrder, setFieldOrder] = useState(0);
	const [fieldMinValue, setFieldMinValue] = useState(0); // الحد الأدنى
	const [fieldMaxValue, setFieldMaxValue] = useState(200); // الحد الأعلى

	useEffect(() => {
		// محاكاة تحميل البيانات
		const fetchData = async () => {
			try {
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// بيانات الحقول التجريبية مع إضافة الحدود العليا والدنيا
				setFields([
					{
						id: 'length',
						name: 'الطول',
						description: 'الطول الكلي للثوب',
						isRequired: true,
						defaultValue: 70,
						unit: 'cm',
						order: 1,
						minValue: 0,
						maxValue: 200,
					},
					{
						id: 'shoulder',
						name: 'الكتف',
						description: 'عرض الكتف',
						isRequired: true,
						defaultValue: 15,
						unit: 'cm',
						order: 2,
						minValue: 0,
						maxValue: 50,
					},
					{
						id: 'chest',
						name: 'الصدر',
						description: 'محيط الصدر',
						isRequired: true,
						defaultValue: 100,
						unit: 'cm',
						order: 3,
						minValue: 20,
						maxValue: 180,
					},
					{
						id: 'waist',
						name: 'الخصر',
						description: 'محيط الخصر',
						isRequired: true,
						defaultValue: 90,
						unit: 'cm',
						order: 4,
						minValue: 20,
						maxValue: 180,
					},
					{
						id: 'sleeve',
						name: 'الكم',
						description: 'طول الكم',
						isRequired: true,
						defaultValue: 60,
						unit: 'cm',
						order: 5,
						minValue: 0,
						maxValue: 100,
					},
				]);

				// بيانات القوالب التجريبية
				setTemplates([
					{
						id: 'template1',
						name: 'قالب قياسات رجالي أمامي',
						category: 'male',
						type: 'front',
						imageUrl: '/images/templates/male_front.png',
						isDefault: true,
					},
					{
						id: 'template2',
						name: 'قالب قياسات رجالي خلفي',
						category: 'male',
						type: 'back',
						imageUrl: '/images/templates/male_back.png',
						isDefault: false,
					},
					{
						id: 'template3',
						name: 'قالب قياسات نسائي',
						category: 'female',
						type: 'front',
						imageUrl: '/images/templates/female_front.png',
						isDefault: true,
					},
				]);

				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching data:', error);
				setIsLoading(false);
				showNotification('حدث خطأ أثناء تحميل البيانات', 'error');
			}
		};

		fetchData();
	}, []);

	const showNotification = (message: string, type: 'success' | 'error') => {
		setNotification({ message, type });
		setTimeout(() => setNotification(null), 3000);
	};

	const handleSave = async () => {
		setIsSubmitting(true);
		try {
			// محاكاة حفظ البيانات
			await new Promise((resolve) => setTimeout(resolve, 1000));
			showNotification('تم حفظ الإعدادات بنجاح', 'success');
		} catch (error) {
			console.error('Error saving settings:', error);
			showNotification('حدث خطأ أثناء حفظ الإعدادات', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// فتح نافذة إضافة حقل جديد
	const openAddFieldModal = () => {
		setEditingField(null);
		// تعيين القيم الافتراضية للحقل الجديد
		setFieldName('');
		setFieldDescription('');
		setFieldUnit('cm');
		setFieldIsRequired(false);
		setFieldOrder(fields.length + 1);
		setFieldMinValue(0); // القيمة الافتراضية للحد الأدنى
		setFieldMaxValue(200); // القيمة الافتراضية للحد الأعلى
		setShowFieldModal(true);
	};

	// فتح نافذة تعديل حقل موجود
	const openEditFieldModal = (field: MeasurementField) => {
		setEditingField(field);
		// تعيين قيم الحقل الحالي
		setFieldName(field.name);
		setFieldDescription(field.description);
		setFieldUnit(field.unit);
		setFieldIsRequired(field.isRequired);
		setFieldOrder(field.order);
		setFieldMinValue(field.minValue);
		setFieldMaxValue(field.maxValue);
		setShowFieldModal(true);
	};

	// حفظ حقل (إضافة أو تعديل)
	const saveField = (e: React.FormEvent) => {
		e.preventDefault();

		// التحقق من صحة البيانات
		if (!fieldName.trim()) {
			showNotification('يرجى إدخال اسم الحقل', 'error');
			return;
		}

		if (fieldMinValue >= fieldMaxValue) {
			showNotification('يجب أن يكون الحد الأدنى أقل من الحد الأعلى', 'error');
			return;
		}

		// تجهيز بيانات الحقل
		const fieldData: MeasurementField = {
			id: editingField?.id || `field_${Date.now()}`,
			name: fieldName,
			description: fieldDescription,
			isRequired: fieldIsRequired,
			defaultValue: editingField?.defaultValue || fieldMinValue + Math.floor((fieldMaxValue - fieldMinValue) / 2),
			unit: fieldUnit,
			order: fieldOrder,
			minValue: fieldMinValue,
			maxValue: fieldMaxValue,
		};

		// إضافة أو تحديث الحقل
		if (editingField) {
			// تحديث حقل موجود
			setFields(fields.map((f) => (f.id === editingField.id ? fieldData : f)));
			showNotification(`تم تحديث حقل "${fieldName}" بنجاح`, 'success');
		} else {
			// إضافة حقل جديد
			setFields([...fields, fieldData]);
			showNotification(`تم إضافة حقل "${fieldName}" بنجاح`, 'success');
		}

		setShowFieldModal(false);
	};

	const openAddTemplateModal = () => {
		setEditingTemplate(null);
		setShowTemplateModal(true);
	};

	const openEditTemplateModal = (template: MeasurementTemplate) => {
		setEditingTemplate(template);
		setShowTemplateModal(true);
	};

	// حذف حقل
	const deleteField = (fieldId: string) => {
		if (confirm('هل أنت متأكد من حذف هذا الحقل؟')) {
			setFields(fields.filter((f) => f.id !== fieldId));
			showNotification('تم حذف الحقل بنجاح', 'success');
		}
	};

	// حذف قالب
	const deleteTemplate = (templateId: string) => {
		if (confirm('هل أنت متأكد من حذف هذا القالب؟')) {
			setTemplates(templates.filter((t) => t.id !== templateId));
			showNotification('تم حذف القالب بنجاح', 'success');
		}
	};

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-screen'>
				<div className='animate-spin h-8 w-8 border-4 border-green-500 rounded-full border-t-transparent'></div>
				<span className='mr-2 text-gray-700'>جاري التحميل...</span>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<div className='flex items-center'>
					<Link href='/dashboard/settings' className='text-gray-500 hover:text-gray-700 ml-3'>
						<ArrowLeft size={20} />
					</Link>
					<h1 className='text-2xl font-bold text-gray-800'>إعدادات القياسات</h1>
				</div>
				<button
					onClick={handleSave}
					disabled={isSubmitting}
					className='ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center disabled:bg-green-300 disabled:cursor-not-allowed'
				>
					<Save size={18} className='ml-1' />
					{isSubmitting ? 'جاري الحفظ...' : 'حفظ التغييرات'}
				</button>
			</div>

			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='border-b border-gray-200'>
					<nav className='flex -mb-px'>
						<button
							onClick={() => setActiveTab('fields')}
							className={`py-4 px-6 text-sm font-medium border-b-2 ${
								activeTab === 'fields'
									? 'border-green-500 text-green-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							حقول القياسات
						</button>
						<button
							onClick={() => setActiveTab('templates')}
							className={`py-4 px-6 text-sm font-medium border-b-2 ${
								activeTab === 'templates'
									? 'border-green-500 text-green-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							قوالب القياسات
						</button>
					</nav>
				</div>

				<div className='p-6'>
					{activeTab === 'fields' && (
						<div className='space-y-6'>
							<div className='flex justify-between items-center'>
								<h2 className='text-lg font-medium text-gray-900'>حقول القياسات</h2>
								<button
									onClick={openAddFieldModal}
									className='px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center'
								>
									<Plus size={16} className='ml-1' />
									إضافة حقل جديد
								</button>
							</div>

							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead className='bg-gray-50'>
										<tr>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												الاسم
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												الوصف
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												الوحدة
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												الحد الأدنى
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												الحد الأعلى
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												إلزامي
											</th>
											<th
												scope='col'
												className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												الترتيب
											</th>
											<th scope='col' className='relative px-6 py-3'>
												<span className='sr-only'>إجراءات</span>
											</th>
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										{fields.map((field) => (
											<tr key={field.id} className='hover:bg-gray-50'>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm font-medium text-gray-900'>
														{field.name}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-500'>{field.description}</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-500'>{field.unit}</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900'>
														{field.minValue} {field.unit}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<div className='text-sm text-gray-900'>
														{field.maxValue} {field.unit}
													</div>
												</td>
												<td className='px-6 py-4 whitespace-nowrap'>
													<span
														className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
															field.isRequired
																? 'bg-green-100 text-green-800'
																: 'bg-gray-100 text-gray-800'
														}`}
													>
														{field.isRequired ? 'نعم' : 'لا'}
													</span>
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
													{field.order}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-left text-sm font-medium'>
													<button
														onClick={() => openEditFieldModal(field)}
														className='text-indigo-600 hover:text-indigo-900 ml-3'
													>
														تعديل
													</button>
													<button
														onClick={() => deleteField(field.id)}
														className='text-red-600 hover:text-red-900'
													>
														حذف
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}

					{activeTab === 'templates' && (
						<div className='space-y-6'>
							<div className='flex justify-between items-center'>
								<h2 className='text-lg font-medium text-gray-900'>قوالب القياسات</h2>
								<button
									onClick={openAddTemplateModal}
									className='px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center'
								>
									<Plus size={16} className='ml-1' />
									إضافة قالب جديد
								</button>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
								{templates.map((template) => (
									<div
										key={template.id}
										className='border border-gray-200 rounded-lg overflow-hidden'
									>
										<div className='h-48 bg-gray-100 relative flex items-center justify-center'>
											<img
												src={template.imageUrl}
												alt={template.name}
												className='h-full object-contain'
											/>
											{template.isDefault && (
												<div className='absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-md'>
													افتراضي
												</div>
											)}
										</div>
										<div className='p-4'>
											<h3 className='font-medium text-gray-900'>{template.name}</h3>
											<p className='text-sm text-gray-500 mt-1'>
												الفئة:{' '}
												{template.category === 'male'
													? 'رجالي'
													: template.category === 'female'
													? 'نسائي'
													: 'أطفال'}{' '}
												- النوع:{' '}
												{template.type === 'front'
													? 'أمامي'
													: template.type === 'back'
													? 'خلفي'
													: 'جانبي'}
											</p>
											<div className='mt-4 flex justify-between'>
												<button
													onClick={() => openEditTemplateModal(template)}
													className='text-sm text-indigo-600 hover:text-indigo-900'
												>
													تعديل
												</button>
												<button
													onClick={() => deleteTemplate(template.id)}
													className='text-sm text-red-600 hover:text-red-900'
												>
													<Trash size={16} />
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* نافذة منبثقة لإضافة/تعديل حقل قياس مع إضافة الحدود العليا والدنيا */}
			{showFieldModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md'>
						<h3 className='text-lg font-medium text-gray-900 mb-4'>
							{editingField ? 'تعديل حقل قياس' : 'إضافة حقل قياس جديد'}
						</h3>
						<form onSubmit={saveField} className='space-y-4'>
							<div>
								<label htmlFor='fieldName' className='block text-sm font-medium text-gray-700'>
									اسم الحقل <span className='text-red-600'>*</span>
								</label>
								<input
									type='text'
									id='fieldName'
									value={fieldName}
									onChange={(e) => setFieldName(e.target.value)}
									className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									required
								/>
							</div>

							<div>
								<label htmlFor='fieldDescription' className='block text-sm font-medium text-gray-700'>
									الوصف
								</label>
								<input
									type='text'
									id='fieldDescription'
									value={fieldDescription}
									onChange={(e) => setFieldDescription(e.target.value)}
									className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
								/>
							</div>

							{/* حقول الحد الأدنى والحد الأعلى */}
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label htmlFor='fieldMinValue' className='block text-sm font-medium text-gray-700'>
										الحد الأدنى
									</label>
									<div className='mt-1 relative rounded-md shadow-sm'>
										<input
											type='number'
											id='fieldMinValue'
											value={fieldMinValue}
											onChange={(e) => setFieldMinValue(Number(e.target.value))}
											className='block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
											min='0'
										/>
										<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
											<span className='text-gray-500 sm:text-sm'>{fieldUnit}</span>
										</div>
									</div>
								</div>

								<div>
									<label htmlFor='fieldMaxValue' className='block text-sm font-medium text-gray-700'>
										الحد الأعلى
									</label>
									<div className='mt-1 relative rounded-md shadow-sm'>
										<input
											type='number'
											id='fieldMaxValue'
											value={fieldMaxValue}
											onChange={(e) => setFieldMaxValue(Number(e.target.value))}
											className='block w-full border border-gray-300 rounded-md shadow-sm py-2 pl-10 pr-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
											min='0'
										/>
										<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
											<span className='text-gray-500 sm:text-sm'>{fieldUnit}</span>
										</div>
									</div>
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label htmlFor='fieldUnit' className='block text-sm font-medium text-gray-700'>
										الوحدة
									</label>
									<select
										id='fieldUnit'
										value={fieldUnit}
										onChange={(e) => setFieldUnit(e.target.value as 'cm' | 'inch')}
										className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									>
										<option value='cm'>سنتيمتر</option>
										<option value='inch'>إنش</option>
									</select>
								</div>

								<div>
									<label htmlFor='fieldOrder' className='block text-sm font-medium text-gray-700'>
										الترتيب
									</label>
									<input
										type='number'
										id='fieldOrder'
										value={fieldOrder}
										onChange={(e) => setFieldOrder(Number(e.target.value))}
										className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										min='1'
									/>
								</div>
							</div>

							<div className='flex items-center'>
								<input
									id='fieldRequired'
									type='checkbox'
									checked={fieldIsRequired}
									onChange={(e) => setFieldIsRequired(e.target.checked)}
									className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
								/>
								<label htmlFor='fieldRequired' className='mr-2 block text-sm text-gray-700'>
									حقل إلزامي
								</label>
							</div>

							{/* ملاحظة توضيحية */}
							<div className='rounded-md bg-blue-50 p-4'>
								<div className='flex'>
									<div className='flex-shrink-0'>
										<svg
											className='h-5 w-5 text-blue-400'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 20 20'
											fill='currentColor'
										>
											<path
												fillRule='evenodd'
												d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
												clipRule='evenodd'
											/>
										</svg>
									</div>
									<div className='mr-3'>
										<p className='text-sm text-blue-700'>
											الحدود العليا والدنيا تحدد نطاق القيم المسموح بها عند إدخال القياسات. القيم
											الافتراضية هي من 0 إلى 200 سم.
										</p>
									</div>
								</div>
							</div>

							<div className='mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3'>
								<button
									type='button'
									className='w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm'
									onClick={() => setShowFieldModal(false)}
								>
									إلغاء
								</button>
								<button
									type='submit'
									className='mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:text-sm'
								>
									{editingField ? 'تحديث' : 'إضافة'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* نافذة منبثقة لإضافة/تعديل قالب */}
			{showTemplateModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='bg-white rounded-lg shadow-xl p-6 w-full max-w-md'>
						<h3 className='text-lg font-medium text-gray-900 mb-4'>
							{editingTemplate ? 'تعديل قالب' : 'إضافة قالب جديد'}
						</h3>
						<form className='space-y-4'>
							<div>
								<label htmlFor='templateName' className='block text-sm font-medium text-gray-700'>
									اسم القالب
								</label>
								<input
									type='text'
									id='templateName'
									className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									defaultValue={editingTemplate?.name || ''}
								/>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label
										htmlFor='templateCategory'
										className='block text-sm font-medium text-gray-700'
									>
										الفئة
									</label>
									<select
										id='templateCategory'
										className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										defaultValue={editingTemplate?.category || 'male'}
									>
										<option value='male'>رجالي</option>
										<option value='female'>نسائي</option>
										<option value='child'>أطفال</option>
									</select>
								</div>

								<div>
									<label htmlFor='templateType' className='block text-sm font-medium text-gray-700'>
										النوع
									</label>
									<select
										id='templateType'
										className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										defaultValue={editingTemplate?.type || 'front'}
									>
										<option value='front'>أمامي</option>
										<option value='back'>خلفي</option>
										<option value='side'>جانبي</option>
									</select>
								</div>
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700'>صورة القالب</label>
								<div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
									<div className='space-y-1 text-center'>
										<Plus size={40} className='mx-auto text-gray-400' />
										<div className='flex text-sm text-gray-600'>
											<label
												htmlFor='file-upload'
												className='relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
											>
												<span>رفع ملف</span>
												<input
													id='file-upload'
													name='file-upload'
													type='file'
													className='sr-only'
												/>
											</label>
											<p className='pr-1'>أو سحب وإفلات</p>
										</div>
										<p className='text-xs text-gray-500'>PNG, JPG حتى 10MB</p>
									</div>
								</div>
							</div>

							<div className='flex items-center'>
								<input
									id='templateDefault'
									type='checkbox'
									className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
									defaultChecked={editingTemplate?.isDefault || false}
								/>
								<label htmlFor='templateDefault' className='mr-2 block text-sm text-gray-700'>
									تعيين كقالب افتراضي
								</label>
							</div>

							<div className='mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3'>
								<button
									type='button'
									className='w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm'
									onClick={() => setShowTemplateModal(false)}
								>
									إلغاء
								</button>
								<button
									type='submit'
									className='mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:text-sm'
								>
									{editingTemplate ? 'تحديث' : 'إضافة'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* إشعار */}
			{notification && (
				<div
					className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 flex items-center 
                        ${
							notification.type === 'success'
								? 'bg-green-100 text-green-800 border border-green-200'
								: 'bg-red-100 text-red-800 border border-red-200'
						}`}
				>
					{notification.type === 'success' ? (
						<svg className='h-5 w-5 ml-2 text-green-400' viewBox='0 0 20 20' fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
								clipRule='evenodd'
							/>
						</svg>
					) : (
						<svg className='h-5 w-5 ml-2 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
							<path
								fillRule='evenodd'
								d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
								clipRule='evenodd'
							/>
						</svg>
					)}
					<span>{notification.message}</span>
				</div>
			)}
		</div>
	);
}
