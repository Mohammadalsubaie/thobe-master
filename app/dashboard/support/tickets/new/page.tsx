'use client';

import {
	ArrowLeft,
	Check,
	ChevronDown,
	Clock,
	Info,
	MessageSquare,
	Paperclip,
	Send,
	Upload,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface Department {
	id: string;
	name: string;
}

export default function NewTicketPage() {
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [departments, setDepartments] = useState<Department[]>([]);
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');
	const [selectedDepartment, setSelectedDepartment] = useState('');
	const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
	const [attachments, setAttachments] = useState<File[]>([]);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [subjectError, setSubjectError] = useState('');
	const [messageError, setMessageError] = useState('');
	const [departmentError, setDepartmentError] = useState('');
	const fileInputRef = useRef<HTMLInputElement>(null);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchDepartments = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 500));

			// بيانات تجريبية للأقسام
			const mockDepartments: Department[] = [
				{ id: 'dept-001', name: 'الدعم الفني' },
				{ id: 'dept-002', name: 'خدمة العملاء' },
				{ id: 'dept-003', name: 'قسم المبيعات' },
				{ id: 'dept-004', name: 'الفوترة والمدفوعات' },
				{ id: 'dept-005', name: 'اقتراحات التطوير' },
			];

			setDepartments(mockDepartments);
			setLoading(false);
		};

		fetchDepartments();
	}, []);

	// مناولة التحقق من الحقول
	const validateForm = () => {
		let isValid = true;

		if (!subject.trim()) {
			setSubjectError('الرجاء إدخال موضوع التذكرة');
			isValid = false;
		} else {
			setSubjectError('');
		}

		if (!message.trim()) {
			setMessageError('الرجاء إدخال تفاصيل المشكلة أو الاستفسار');
			isValid = false;
		} else {
			setMessageError('');
		}

		if (!selectedDepartment) {
			setDepartmentError('الرجاء اختيار القسم المناسب');
			isValid = false;
		} else {
			setDepartmentError('');
		}

		return isValid;
	};

	// مناولة إرسال التذكرة
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setSubmitting(true);

		// محاكاة إرسال الطلب
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// في التطبيق الحقيقي، نرسل البيانات للخادم هنا

		setSubmitting(false);
		setShowSuccessMessage(true);

		// إعادة تعيين النموذج
		setSubject('');
		setMessage('');
		setSelectedDepartment('');
		setPriority('medium');
		setAttachments([]);

		// بعد مرور 3 ثواني، نوجه المستخدم إلى صفحة التذاكر
		setTimeout(() => {
			window.location.href = '/dashboard/support/tickets';
		}, 3000);
	};

	// مناولة تحميل المرفقات
	const handleFileUpload = () => {
		if (fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	// مناولة تغيير الملفات المرفقة
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			// قيود الملفات: 5 ملفات بحد أقصى، وكل ملف لا يتجاوز 10 ميجابايت
			const selectedFiles = Array.from(e.target.files);

			if (attachments.length + selectedFiles.length > 5) {
				alert('لا يمكنك إرفاق أكثر من 5 ملفات.');
				return;
			}

			const oversizedFiles = selectedFiles.filter((file) => file.size > 10 * 1024 * 1024);
			if (oversizedFiles.length > 0) {
				alert(
					`الملفات التالية تتجاوز الحد الأقصى للحجم (10 ميجابايت): ${oversizedFiles
						.map((f) => f.name)
						.join(', ')}`
				);
				return;
			}

			setAttachments([...attachments, ...selectedFiles]);
		}
	};

	// إزالة ملف مرفق
	const removeAttachment = (index: number) => {
		const newAttachments = [...attachments];
		newAttachments.splice(index, 1);
		setAttachments(newAttachments);
	};

	// تنسيق حجم الملف
	const formatFileSize = (sizeInBytes: number) => {
		if (sizeInBytes < 1024) {
			return `${sizeInBytes} بايت`;
		} else if (sizeInBytes < 1024 * 1024) {
			return `${(sizeInBytes / 1024).toFixed(2)} كيلوبايت`;
		} else {
			return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} ميجابايت`;
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex items-center'>
				<Link href='/dashboard/support' className='flex items-center text-gray-500 hover:text-gray-700 ml-4'>
					<ArrowLeft className='h-5 w-5' />
					<span className='mr-1 text-sm'>العودة</span>
				</Link>
				<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
					<MessageSquare className='inline-block ml-2 h-6 w-6 text-blue-600' />
					إنشاء تذكرة دعم جديدة
				</h1>
			</div>

			{/* عرض رسالة النجاح */}
			{showSuccessMessage && (
				<div className='flex p-4 mb-4 text-green-800 border-t-4 border-green-500 bg-green-50 rounded-lg'>
					<Check className='flex-shrink-0 w-5 h-5 ml-2' />
					<div>
						<p className='font-bold'>تم إنشاء التذكرة بنجاح!</p>
						<p className='text-sm'>سيتم توجيهك إلى صفحة التذاكر خلال لحظات...</p>
					</div>
				</div>
			)}

			{/* نموذج إنشاء التذكرة */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
				<div className='p-6 border-b border-gray-200'>
					<h2 className='text-lg font-medium text-gray-900'>تفاصيل التذكرة</h2>
					<p className='text-sm text-gray-500'>قم بتوفير معلومات مفصلة عن استفسارك أو المشكلة التي تواجهها</p>
				</div>

				<form onSubmit={handleSubmit} className='p-6 space-y-6'>
					{/* القسم */}
					<div>
						<label htmlFor='department' className='block text-sm font-medium text-gray-700 mb-1'>
							القسم <span className='text-red-500'>*</span>
						</label>
						<div className='relative'>
							<select
								id='department'
								value={selectedDepartment}
								onChange={(e) => setSelectedDepartment(e.target.value)}
								className={`block w-full appearance-none rounded-md border ${
									departmentError ? 'border-red-300' : 'border-gray-300'
								} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
							>
								<option value=''>اختر القسم المناسب...</option>
								{departments.map((dept) => (
									<option key={dept.id} value={dept.id}>
										{dept.name}
									</option>
								))}
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
						{departmentError && <p className='mt-1 text-sm text-red-600'>{departmentError}</p>}
					</div>

					{/* الأولوية */}
					<div>
						<label htmlFor='priority' className='block text-sm font-medium text-gray-700 mb-1'>
							الأولوية
						</label>
						<div className='relative'>
							<select
								id='priority'
								value={priority}
								onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | 'urgent')}
								className='block w-full appearance-none rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm'
							>
								<option value='low'>منخفضة</option>
								<option value='medium'>متوسطة</option>
								<option value='high'>عالية</option>
								<option value='urgent'>عاجلة</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* الموضوع */}
					<div>
						<label htmlFor='subject' className='block text-sm font-medium text-gray-700 mb-1'>
							الموضوع <span className='text-red-500'>*</span>
						</label>
						<input
							type='text'
							id='subject'
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							className={`block w-full rounded-md border ${
								subjectError ? 'border-red-300' : 'border-gray-300'
							} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
							placeholder='اكتب عنوانًا مختصرًا لمشكلتك أو استفسارك'
						/>
						{subjectError && <p className='mt-1 text-sm text-red-600'>{subjectError}</p>}
					</div>

					{/* الرسالة */}
					<div>
						<label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
							التفاصيل <span className='text-red-500'>*</span>
						</label>
						<textarea
							id='message'
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							rows={8}
							className={`block w-full rounded-md border ${
								messageError ? 'border-red-300' : 'border-gray-300'
							} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
							placeholder='اشرح المشكلة أو الاستفسار بالتفصيل. كلما كانت المعلومات أكثر تفصيلاً، كان بإمكاننا مساعدتك بشكل أفضل.'
						/>
						{messageError && <p className='mt-1 text-sm text-red-600'>{messageError}</p>}
					</div>

					{/* المرفقات */}
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>المرفقات (اختياري)</label>
						<div
							className='border border-gray-300 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200'
							onClick={handleFileUpload}
						>
							<Upload className='h-10 w-10 text-gray-400 mb-2' />
							<p className='text-sm text-gray-600 mb-1'>اسحب وأفلت الملفات هنا، أو انقر للاختيار</p>
							<p className='text-xs text-gray-500'>
								PNG, JPG, PDF, DOCX حتى 5 ملفات (10 ميجابايت لكل ملف)
							</p>
							<input
								ref={fileInputRef}
								type='file'
								multiple
								className='sr-only'
								onChange={handleFileChange}
								accept='.jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx'
							/>
						</div>

						{/* عرض الملفات المرفقة */}
						{attachments.length > 0 && (
							<div className='mt-4 space-y-2'>
								<p className='text-sm font-medium text-gray-700'>
									الملفات المرفقة ({attachments.length}/5)
								</p>
								<div className='border border-gray-200 rounded-lg divide-y divide-gray-200'>
									{attachments.map((file, index) => (
										<div key={index} className='flex items-center justify-between p-3'>
											<div className='flex items-center'>
												<Paperclip className='h-5 w-5 text-gray-400 ml-2' />
												<div>
													<p className='text-sm font-medium text-gray-700'>{file.name}</p>
													<p className='text-xs text-gray-500'>{formatFileSize(file.size)}</p>
												</div>
											</div>
											<button
												type='button'
												onClick={() => removeAttachment(index)}
												className='text-gray-400 hover:text-red-500'
											>
												<XCircle className='h-5 w-5' />
											</button>
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* معلومات مساعدة */}
					<div className='flex p-4 bg-blue-50 rounded-lg border border-blue-200'>
						<Info className='flex-shrink-0 w-5 h-5 text-blue-600 ml-2' />
						<div>
							<p className='text-sm text-blue-800'>نصائح للحصول على استجابة أسرع:</p>
							<ul className='text-xs text-blue-700 mr-5 mt-1 list-disc space-y-1'>
								<li>كن محددًا قدر الإمكان في وصف المشكلة</li>
								<li>أرفق لقطات شاشة إذا كان ذلك ممكنًا</li>
								<li>اذكر الخطوات التي اتبعتها والتي أدت إلى المشكلة</li>
								<li>حدد متى بدأت المشكلة بالظهور</li>
							</ul>
						</div>
					</div>

					{/* زر الإرسال */}
					<div className='flex justify-end'>
						<Link
							href='/dashboard/support'
							className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 ml-3'
						>
							إلغاء
						</Link>

						<button
							type='submit'
							disabled={submitting}
							className='px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 flex items-center disabled:opacity-70 disabled:cursor-not-allowed'
						>
							{submitting ? (
								<>
									<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-1'></div>
									جاري الإرسال...
								</>
							) : (
								<>
									<Send className='h-4 w-4 ml-1' />
									إرسال التذكرة
								</>
							)}
						</button>
					</div>
				</form>
			</div>

			{/* وقت الاستجابة المتوقع */}
			<div className='flex items-center justify-center bg-gray-50 p-4 rounded-lg border border-gray-200'>
				<Clock className='h-5 w-5 text-gray-500 ml-2' />
				<span className='text-sm text-gray-600'>وقت الاستجابة المتوقع: خلال 24 ساعة عمل</span>
			</div>
		</div>
	);
}
