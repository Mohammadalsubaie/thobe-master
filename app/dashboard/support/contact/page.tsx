'use client';

import {
	AlertCircle,
	ArrowLeft,
	Calendar,
	Check,
	ChevronDown,
	Clock,
	Download,
	ExternalLink,
	HelpCircle,
	MessageCircle,
	MessageSquare,
	Paperclip,
	Phone,
	Send,
	Users,
	Video,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface ContactDepartment {
	id: string;
	name: string;
	description: string;
	email: string;
	phone: string;
	responseTime: string;
}

interface SupportTicket {
	id: string;
	subject: string;
	status: 'open' | 'in_progress' | 'pending' | 'resolved' | 'closed';
	priority: 'low' | 'medium' | 'high' | 'urgent';
	createdAt: string;
	updatedAt: string;
	departmentId: string;
	departmentName: string;
}

export default function ContactSupportPage() {
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [departments, setDepartments] = useState<ContactDepartment[]>([]);
	const [recentTickets, setRecentTickets] = useState<SupportTicket[]>([]);

	// حالة النموذج
	const [subject, setSubject] = useState('');
	const [message, setMessage] = useState('');
	const [selectedDepartment, setSelectedDepartment] = useState('');
	const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
	const [attachments, setAttachments] = useState<File[]>([]);
	const [subjectError, setSubjectError] = useState('');
	const [messageError, setMessageError] = useState('');
	const [departmentError, setDepartmentError] = useState('');
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	const fileInputRef = useRef<HTMLInputElement>(null);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchContactData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية للأقسام
			const mockDepartments: ContactDepartment[] = [
				{
					id: 'dept-001',
					name: 'الدعم الفني',
					description: 'المساعدة في المشاكل التقنية واستخدام النظام',
					email: 'techsupport@thobmaster.com',
					phone: '920001234',
					responseTime: '24 ساعة',
				},
				{
					id: 'dept-002',
					name: 'خدمة العملاء',
					description: 'استفسارات عامة حول الخدمات والعروض',
					email: 'customer@thobmaster.com',
					phone: '920001235',
					responseTime: '48 ساعة',
				},
				{
					id: 'dept-003',
					name: 'قسم المبيعات',
					description: 'استفسارات حول أسعار الخدمات والباقات',
					email: 'sales@thobmaster.com',
					phone: '920001236',
					responseTime: '24 ساعة',
				},
				{
					id: 'dept-004',
					name: 'الفوترة والمدفوعات',
					description: 'مساعدة في قضايا الفواتير والدفع والاشتراكات',
					email: 'billing@thobmaster.com',
					phone: '920001237',
					responseTime: '48 ساعة',
				},
			];

			// بيانات تجريبية للتذاكر السابقة
			const mockTickets: SupportTicket[] = [
				{
					id: 'ticket-001',
					subject: 'مشكلة في إضافة طلب جديد',
					status: 'resolved',
					priority: 'high',
					createdAt: '2023-09-25T10:30:00',
					updatedAt: '2023-09-27T14:45:00',
					departmentId: 'dept-001',
					departmentName: 'الدعم الفني',
				},
				{
					id: 'ticket-002',
					subject: 'استفسار حول التقارير الشهرية',
					status: 'closed',
					priority: 'medium',
					createdAt: '2023-09-15T14:15:00',
					updatedAt: '2023-09-18T16:20:00',
					departmentId: 'dept-002',
					departmentName: 'خدمة العملاء',
				},
				{
					id: 'ticket-003',
					subject: 'طلب ميزة جديدة في نظام المخزون',
					status: 'in_progress',
					priority: 'low',
					createdAt: '2023-09-22T09:45:00',
					updatedAt: '2023-09-24T11:30:00',
					departmentId: 'dept-001',
					departmentName: 'الدعم الفني',
				},
			];

			setDepartments(mockDepartments);
			setRecentTickets(mockTickets);
			setLoading(false);
		};

		fetchContactData();
	}, []);

	// مناولة التحقق من الحقول
	const validateForm = () => {
		let isValid = true;

		if (!subject.trim()) {
			setSubjectError('الرجاء إدخال موضوع الرسالة');
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

	// مناولة إرسال النموذج
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

		// إخفاء رسالة النجاح بعد 5 ثوانٍ
		setTimeout(() => {
			setShowSuccessMessage(false);
		}, 5000);
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
			// قيود الملفات: 3 ملفات بحد أقصى، وكل ملف لا يتجاوز 10 ميجابايت
			const selectedFiles = Array.from(e.target.files);

			if (attachments.length + selectedFiles.length > 3) {
				alert('لا يمكنك إرفاق أكثر من 3 ملفات.');
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

	// رسم شارة حالة التذكرة
	const renderStatusBadge = (status: string) => {
		switch (status) {
			case 'open':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						مفتوحة
					</span>
				);
			case 'in_progress':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
						قيد المعالجة
					</span>
				);
			case 'pending':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800'>
						في انتظار الرد
					</span>
				);
			case 'resolved':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						تم الحل
					</span>
				);
			case 'closed':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						مغلقة
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
					التواصل مع الدعم
				</h1>
			</div>

			{/* عرض رسالة النجاح */}
			{showSuccessMessage && (
				<div className='flex p-4 mb-4 text-green-800 border-t-4 border-green-500 bg-green-50 rounded-lg'>
					<Check className='flex-shrink-0 w-5 h-5 ml-2' />
					<div>
						<p className='font-bold'>تم إرسال رسالتك بنجاح!</p>
						<p className='text-sm'>سيقوم فريق الدعم بالتواصل معك في أقرب وقت ممكن.</p>
					</div>
				</div>
			)}

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* القسم الرئيسي - نموذج الاتصال */}
				<div className='lg:col-span-2'>
					<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
						<div className='p-6 border-b border-gray-200'>
							<h2 className='text-lg font-medium text-gray-900'>ارسل رسالة إلى فريق الدعم</h2>
							<p className='text-sm text-gray-500'>
								املأ النموذج التالي وسيقوم فريقنا بالرد عليك في أقرب وقت ممكن
							</p>
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
								{selectedDepartment && (
									<p className='mt-1 text-xs text-gray-500'>
										{departments.find((d) => d.id === selectedDepartment)?.description}
									</p>
								)}
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
										onChange={(e) =>
											setPriority(e.target.value as 'low' | 'medium' | 'high' | 'urgent')
										}
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
									placeholder='اكتب عنوانًا مختصرًا لاستفسارك'
								/>
								{subjectError && <p className='mt-1 text-sm text-red-600'>{subjectError}</p>}
							</div>

							{/* الرسالة */}
							<div>
								<label htmlFor='message' className='block text-sm font-medium text-gray-700 mb-1'>
									الرسالة <span className='text-red-500'>*</span>
								</label>
								<textarea
									id='message'
									value={message}
									onChange={(e) => setMessage(e.target.value)}
									rows={6}
									className={`block w-full rounded-md border ${
										messageError ? 'border-red-300' : 'border-gray-300'
									} shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm`}
									placeholder='اشرح المشكلة أو الاستفسار بالتفصيل. كلما كانت المعلومات أكثر تفصيلاً، كان بإمكاننا مساعدتك بشكل أفضل.'
								/>
								{messageError && <p className='mt-1 text-sm text-red-600'>{messageError}</p>}
							</div>

							{/* المرفقات */}
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-2'>
									المرفقات (اختياري)
								</label>
								<div
									className='border border-gray-300 border-dashed rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors duration-200'
									onClick={handleFileUpload}
								>
									<Paperclip className='h-5 w-5 text-gray-400 ml-2' />
									<span className='text-sm text-gray-500'>
										انقر لإرفاق ملفات (الحد الأقصى: 3 ملفات، 10 ميجابايت لكل ملف)
									</span>
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
									<div className='mt-2 space-y-2'>
										{attachments.map((file, index) => (
											<div
												key={index}
												className='flex items-center justify-between p-2 border border-gray-200 rounded-md'
											>
												<div className='flex items-center'>
													<Paperclip className='h-4 w-4 text-gray-400 ml-2' />
													<div>
														<p className='text-sm font-medium text-gray-700'>{file.name}</p>
														<p className='text-xs text-gray-500'>
															{formatFileSize(file.size)}
														</p>
													</div>
												</div>
												<button
													type='button'
													onClick={() => removeAttachment(index)}
													className='text-gray-400 hover:text-red-500'
												>
													<X className='h-4 w-4' />
												</button>
											</div>
										))}
									</div>
								)}
							</div>

							{/* ملاحظة مهمة */}
							<div className='flex p-4 bg-blue-50 rounded-lg border border-blue-200'>
								<AlertCircle className='flex-shrink-0 w-5 h-5 text-blue-600 ml-2' />
								<div>
									<p className='text-sm text-blue-800'>معلومات مهمة</p>
									<p className='text-xs text-blue-700 mt-1'>
										سيتم الرد على طلبك خلال وقت الاستجابة المحدد لكل قسم. الرجاء التأكد من توفير
										جميع المعلومات اللازمة.
									</p>
								</div>
							</div>

							{/* زر الإرسال */}
							<div className='flex justify-end'>
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
											إرسال الرسالة
										</>
									)}
								</button>
							</div>
						</form>
					</div>

					{/* التذاكر السابقة */}
					{recentTickets.length > 0 && (
						<div className='bg-white rounded-lg shadow-sm border border-gray-200 mt-6'>
							<div className='p-4 border-b border-gray-200 flex justify-between items-center'>
								<h2 className='text-base font-medium text-gray-900'>طلبات الدعم السابقة</h2>
								<Link
									href='/dashboard/support/tickets'
									className='text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center'
								>
									عرض الكل
									<ChevronDown className='ml-1 h-4 w-4' />
								</Link>
							</div>
							<div className='divide-y divide-gray-200'>
								{recentTickets.map((ticket) => (
									<Link
										key={ticket.id}
										href={`/dashboard/support/tickets/${ticket.id}`}
										className='block px-4 py-3 hover:bg-gray-50'
									>
										<div className='flex justify-between items-center'>
											<div>
												<p className='text-sm font-medium text-gray-900'>{ticket.subject}</p>
												<div className='flex items-center mt-1'>
													<span className='text-xs text-gray-500 ml-2'>
														{formatDate(ticket.createdAt)}
													</span>
													<span className='text-xs text-gray-500'>
														#{ticket.id.split('-')[1]}
													</span>
												</div>
											</div>
											<div className='flex space-x-2 space-x-reverse'>
												<span className='text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full'>
													{ticket.departmentName}
												</span>
												{renderStatusBadge(ticket.status)}
											</div>
										</div>
									</Link>
								))}
							</div>
						</div>
					)}
				</div>

				{/* الشريط الجانبي - معلومات التواصل والموارد */}
				<div className='space-y-6'>
					{/* قنوات التواصل المباشر */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
						<div className='p-4 border-b border-gray-200'>
							<h2 className='text-base font-medium text-gray-900'>قنوات التواصل المباشر</h2>
						</div>
						<div className='divide-y divide-gray-200'>
							<div className='p-4'>
								<div className='flex items-start'>
									<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
										<Phone className='h-5 w-5' />
									</div>
									<div>
										<h3 className='text-sm font-medium text-gray-900'>الدعم الهاتفي</h3>
										<p className='text-xs text-gray-500 mt-1'>
											متاح من الأحد إلى الخميس، 9 صباحًا - 5 مساءً
										</p>
										<a
											href='tel:+966920001234'
											className='text-sm text-blue-600 hover:text-blue-800 font-medium mt-1 inline-block'
										>
											920001234
										</a>
									</div>
								</div>
							</div>

							<div className='p-4'>
								<div className='flex items-start'>
									<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
										<MessageCircle className='h-5 w-5' />
									</div>
									<div>
										<h3 className='text-sm font-medium text-gray-900'>الدردشة المباشرة</h3>
										<p className='text-xs text-gray-500 mt-1'>دردش مع فريق الدعم الفني مباشرة</p>
										<button className='text-sm text-green-600 hover:text-green-800 font-medium mt-1 inline-flex items-center'>
											بدء الدردشة
										</button>
									</div>
								</div>
							</div>

							<div className='p-4'>
								<div className='flex items-start'>
									<div className='flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 ml-3'>
										<Video className='h-5 w-5' />
									</div>
									<div>
										<h3 className='text-sm font-medium text-gray-900'>جلسة دعم عن بُعد</h3>
										<p className='text-xs text-gray-500 mt-1'>جدولة اجتماع افتراضي مع فريق الدعم</p>
										<a
											href='https://meetings.thobmaster.com'
											target='_blank'
											className='text-sm text-purple-600 hover:text-purple-800 font-medium mt-1 inline-flex items-center'
										>
											حجز موعد
											<ExternalLink className='mr-1 h-3 w-3' />
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* أوقات استجابة الأقسام */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
						<div className='p-4 border-b border-gray-200'>
							<h2 className='text-base font-medium text-gray-900'>أوقات الاستجابة المتوقعة</h2>
						</div>
						<div className='p-4'>
							<ul className='space-y-3'>
								{departments.map((dept) => (
									<li key={dept.id} className='flex items-center justify-between'>
										<span className='text-sm text-gray-900'>{dept.name}</span>
										<div className='flex items-center'>
											<Clock className='h-4 w-4 text-gray-400 ml-1' />
											<span className='text-sm text-gray-500'>{dept.responseTime}</span>
										</div>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* موارد مفيدة */}
					<div className='bg-white rounded-lg shadow-sm border border-gray-200'>
						<div className='p-4 border-b border-gray-200'>
							<h2 className='text-base font-medium text-gray-900'>موارد مفيدة</h2>
						</div>
						<div className='divide-y divide-gray-200'>
							<Link href='/dashboard/support/guide' className='block p-4 hover:bg-gray-50'>
								<div className='flex items-center'>
									<Calendar className='h-5 w-5 text-blue-600 ml-2' />
									<span className='text-sm font-medium text-gray-900'>دليل الاستخدام</span>
								</div>
							</Link>
							<Link href='/dashboard/support/faq' className='block p-4 hover:bg-gray-50'>
								<div className='flex items-center'>
									<HelpCircle className='h-5 w-5 text-green-600 ml-2' />
									<span className='text-sm font-medium text-gray-900'>الأسئلة الشائعة</span>
								</div>
							</Link>
							<a href='/documents/user-guide.pdf' download className='block p-4 hover:bg-gray-50'>
								<div className='flex items-center'>
									<Download className='h-5 w-5 text-purple-600 ml-2' />
									<span className='text-sm font-medium text-gray-900'>تحميل دليل المستخدم (PDF)</span>
								</div>
							</a>
							<Link href='/dashboard/support/suggestions' className='block p-4 hover:bg-gray-50'>
								<div className='flex items-center'>
									<Users className='h-5 w-5 text-amber-600 ml-2' />
									<span className='text-sm font-medium text-gray-900'>تقديم اقتراحات</span>
								</div>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
