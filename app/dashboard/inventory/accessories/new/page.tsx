'use client';

import { AlertCircle, ArrowLeft, CheckCircle, Loader, Save, Tag, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Supplier {
	id: string;
	name: string;
}

export default function NewAccessoryPage() {
	// حالة النموذج
	const [formData, setFormData] = useState({
		code: '',
		name: '',
		category: '',
		material: '',
		color: '',
		quantity: '',
		unit: 'قطعة',
		price: '',
		supplier: '',
		minLevel: '',
		notes: '',
	});

	// حالة إرسال النموذج
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	// قائمة المورّدين
	const [suppliers, setSuppliers] = useState<Supplier[]>([
		{ id: '1', name: 'اكسسوارات الخليج' },
		{ id: '2', name: 'مستلزمات الخياطة' },
		{ id: '3', name: 'مصنع الأزرار' },
		{ id: '4', name: 'الشركة العالمية للإكسسوارات' },
	]);

	// قائمة فئات الاكسسوارات
	const accessoryCategories = ['أزرار', 'سحابات', 'ملصقات', 'حشوات', 'مشابك', 'شرائط', 'خرز', 'دبابيس', 'أخرى'];

	// قائمة المواد
	const materials = ['بلاستيك', 'معدن', 'خشب', 'قماش', 'زجاج', 'جلد', 'اسفنج', 'أخرى'];

	// قائمة الألوان الأساسية
	const basicColors = ['أبيض', 'أسود', 'أحمر', 'أزرق', 'أخضر', 'أصفر', 'ذهبي', 'فضي', 'بني', 'متعدد'];

	// تحديث بيانات النموذج
	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// تقديم النموذج
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setSubmitError(null);

		try {
			// محاكاة استدعاء API لحفظ البيانات
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// محاكاة نجاح إرسال البيانات
			setSubmitSuccess(true);
			setTimeout(() => {
				// عادة سيتم توجيه المستخدم إلى صفحة أخرى
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}, 1000);
		} catch (error) {
			setSubmitError('حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.');
			console.error('Error submitting accessory data:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<div className='flex items-center'>
						<Link
							href='/dashboard/inventory/accessories'
							className='flex items-center text-gray-500 hover:text-gray-700 ml-4'
						>
							<ArrowLeft className='h-5 w-5' />
							<span className='mr-1 text-sm'>العودة</span>
						</Link>
						<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
							<Tag className='inline-block ml-2 h-6 w-6 text-green-600' />
							إضافة اكسسوار جديد
						</h1>
					</div>
					<p className='mt-1 text-sm text-gray-600'>أدخل بيانات الإكسسوار الجديد لإضافته إلى المخزون</p>
				</div>
			</div>

			{/* رسائل النجاح والخطأ */}
			{submitSuccess && (
				<div className='bg-green-50 border border-green-200 rounded-md p-4'>
					<div className='flex'>
						<div className='flex-shrink-0'>
							<CheckCircle className='h-5 w-5 text-green-400' />
						</div>
						<div className='mr-3'>
							<p className='text-sm font-medium text-green-800'>تم إضافة الإكسسوار بنجاح</p>
						</div>
					</div>
				</div>
			)}

			{submitError && (
				<div className='bg-red-50 border border-red-200 rounded-md p-4'>
					<div className='flex'>
						<div className='flex-shrink-0'>
							<X className='h-5 w-5 text-red-400' />
						</div>
						<div className='mr-3'>
							<p className='text-sm font-medium text-red-800'>{submitError}</p>
						</div>
					</div>
				</div>
			)}

			{/* نموذج إضافة اكسسوار جديد */}
			<form onSubmit={handleSubmit} className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{/* كود الاكسسوار */}
					<div>
						<label htmlFor='code' className='block text-sm font-medium text-gray-700 mb-1'>
							كود الاكسسوار <span className='text-red-500'>*</span>
						</label>
						<input
							type='text'
							id='code'
							name='code'
							value={formData.code}
							onChange={handleChange}
							required
							placeholder='مثال: ACC-BTN-001'
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						/>
					</div>

					{/* اسم الاكسسوار */}
					<div>
						<label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
							اسم الاكسسوار <span className='text-red-500'>*</span>
						</label>
						<input
							type='text'
							id='name'
							name='name'
							value={formData.name}
							onChange={handleChange}
							required
							placeholder='مثال: أزرار كلاسيكية'
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						/>
					</div>

					{/* فئة الاكسسوار */}
					<div>
						<label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-1'>
							فئة الاكسسوار <span className='text-red-500'>*</span>
						</label>
						<select
							id='category'
							name='category'
							value={formData.category}
							onChange={handleChange}
							required
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						>
							<option value='' disabled>
								اختر فئة الاكسسوار
							</option>
							{accessoryCategories.map((category) => (
								<option key={category} value={category}>
									{category}
								</option>
							))}
						</select>
					</div>

					{/* مادة الاكسسوار */}
					<div>
						<label htmlFor='material' className='block text-sm font-medium text-gray-700 mb-1'>
							مادة الاكسسوار <span className='text-red-500'>*</span>
						</label>
						<select
							id='material'
							name='material'
							value={formData.material}
							onChange={handleChange}
							required
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						>
							<option value='' disabled>
								اختر مادة الاكسسوار
							</option>
							{materials.map((material) => (
								<option key={material} value={material}>
									{material}
								</option>
							))}
						</select>
					</div>

					{/* لون الاكسسوار */}
					<div>
						<label htmlFor='color' className='block text-sm font-medium text-gray-700 mb-1'>
							لون الاكسسوار <span className='text-red-500'>*</span>
						</label>
						<select
							id='color'
							name='color'
							value={formData.color}
							onChange={handleChange}
							required
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						>
							<option value='' disabled>
								اختر لون الاكسسوار
							</option>
							{basicColors.map((color) => (
								<option key={color} value={color}>
									{color}
								</option>
							))}
						</select>
					</div>

					{/* الكمية */}
					<div>
						<label htmlFor='quantity' className='block text-sm font-medium text-gray-700 mb-1'>
							الكمية <span className='text-red-500'>*</span>
						</label>
						<input
							type='number'
							id='quantity'
							name='quantity'
							value={formData.quantity}
							onChange={handleChange}
							required
							min='0'
							step='1'
							placeholder='أدخل الكمية'
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						/>
					</div>

					{/* وحدة القياس */}
					<div>
						<label htmlFor='unit' className='block text-sm font-medium text-gray-700 mb-1'>
							وحدة القياس <span className='text-red-500'>*</span>
						</label>
						<select
							id='unit'
							name='unit'
							value={formData.unit}
							onChange={handleChange}
							required
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						>
							<option value='قطعة'>قطعة</option>
							<option value='دزينة'>دزينة</option>
							<option value='حزمة'>حزمة</option>
							<option value='علبة'>علبة</option>
							<option value='زوج'>زوج</option>
							<option value='متر'>متر</option>
						</select>
					</div>

					{/* السعر */}
					<div>
						<label htmlFor='price' className='block text-sm font-medium text-gray-700 mb-1'>
							السعر (ريال) <span className='text-red-500'>*</span>
						</label>
						<input
							type='number'
							id='price'
							name='price'
							value={formData.price}
							onChange={handleChange}
							required
							min='0'
							step='0.01'
							placeholder='أدخل السعر'
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						/>
					</div>

					{/* المورد */}
					<div>
						<label htmlFor='supplier' className='block text-sm font-medium text-gray-700 mb-1'>
							المورد <span className='text-red-500'>*</span>
						</label>
						<select
							id='supplier'
							name='supplier'
							value={formData.supplier}
							onChange={handleChange}
							required
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						>
							<option value='' disabled>
								اختر المورد
							</option>
							{suppliers.map((supplier) => (
								<option key={supplier.id} value={supplier.id}>
									{supplier.name}
								</option>
							))}
						</select>
					</div>

					{/* الحد الأدنى للمخزون */}
					<div>
						<label htmlFor='minLevel' className='block text-sm font-medium text-gray-700 mb-1'>
							الحد الأدنى للمخزون
						</label>
						<input
							type='number'
							id='minLevel'
							name='minLevel'
							value={formData.minLevel}
							onChange={handleChange}
							min='0'
							step='1'
							placeholder='أدخل الحد الأدنى للتنبيه'
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						/>
						<p className='mt-1 text-xs text-gray-500'>عند وصول المخزون لهذه الكمية، سيتم إظهار تنبيه</p>
					</div>

					{/* ملاحظات */}
					<div className='md:col-span-2'>
						<label htmlFor='notes' className='block text-sm font-medium text-gray-700 mb-1'>
							ملاحظات
						</label>
						<textarea
							id='notes'
							name='notes'
							value={formData.notes}
							onChange={handleChange}
							rows={3}
							placeholder='أدخل أي ملاحظات إضافية حول الاكسسوار'
							className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
						></textarea>
					</div>
				</div>

				{/* ملاحظة خاصة بالحقول المطلوبة */}
				<div className='mt-6 flex items-center text-sm text-gray-500'>
					<AlertCircle className='h-4 w-4 ml-1 text-red-500' />
					<span>
						الحقول المشار إليها بـ <span className='text-red-500'>*</span> حقول مطلوبة
					</span>
				</div>

				{/* أزرار حفظ وإلغاء */}
				<div className='mt-6 flex justify-end space-x-3 space-x-reverse'>
					<Link
						href='/dashboard/inventory/accessories'
						className='px-4 py-2 bg-white border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none'
					>
						إلغاء
					</Link>

					<button
						type='submit'
						disabled={isSubmitting}
						className='px-4 py-2 bg-green-600 shadow-sm text-sm font-medium rounded-md text-white hover:bg-green-700 focus:outline-none disabled:bg-green-300 disabled:cursor-not-allowed flex items-center'
					>
						{isSubmitting ? (
							<>
								<Loader className='animate-spin ml-2 h-4 w-4' />
								جاري الحفظ...
							</>
						) : (
							<>
								<Save className='ml-2 h-4 w-4' />
								حفظ
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
