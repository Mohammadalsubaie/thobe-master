'use client';

import {
	ArrowLeft,
	ArrowUpRight,
	Calendar,
	CheckCircle,
	ChevronDown,
	Clock,
	MessageSquare,
	Plus,
	Search,
	Send,
	Tag,
	ThumbsUp,
	User,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SuggestionCategory {
	id: string;
	name: string;
	count: number;
	color: string;
}

interface Suggestion {
	id: string;
	title: string;
	description: string;
	status: 'new' | 'under_review' | 'planned' | 'in_progress' | 'completed' | 'declined';
	votes: number;
	hasVoted: boolean;
	categoryId: string;
	categoryName: string;
	categoryColor: string;
	createdAt: string;
	createdBy: {
		id: string;
		name: string;
	};
	commentsCount: number;
}

export default function SuggestionsPage() {
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState<SuggestionCategory[]>([]);
	const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
	const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [sortOption, setSortOption] = useState<'votes' | 'recent' | 'status'>('votes');
	const [showNewSuggestionForm, setShowNewSuggestionForm] = useState(false);
	const [newSuggestion, setNewSuggestion] = useState({
		title: '',
		description: '',
		categoryId: '',
	});
	const [formErrors, setFormErrors] = useState({
		title: '',
		description: '',
		categoryId: '',
	});
	const [submitting, setSubmitting] = useState(false);
	const [submitSuccess, setSubmitSuccess] = useState(false);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchSuggestionsData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية لفئات الاقتراحات
			const mockCategories: SuggestionCategory[] = [
				{ id: 'cat-001', name: 'واجهة المستخدم', count: 12, color: 'blue' },
				{ id: 'cat-002', name: 'التقارير والإحصائيات', count: 8, color: 'purple' },
				{ id: 'cat-003', name: 'إدارة العملاء', count: 5, color: 'green' },
				{ id: 'cat-004', name: 'إدارة المخزون', count: 7, color: 'amber' },
				{ id: 'cat-005', name: 'إدارة الطلبات', count: 15, color: 'red' },
				{ id: 'cat-006', name: 'المدفوعات والفواتير', count: 9, color: 'indigo' },
			];

			// بيانات تجريبية للاقتراحات
			const mockSuggestions: Suggestion[] = [
				{
					id: 'sug-001',
					title: 'إضافة خاصية الإشعارات للجوال للتنبيه عند اكتمال الطلب',
					description:
						'أقترح إضافة ميزة إرسال إشعارات للعملاء عبر تطبيق الجوال عندما يكتمل طلبهم ويكون جاهزًا للاستلام، مما سيحسن من تجربة العميل ويقلل من الاتصالات الهاتفية للاستفسار عن حالة الطلبات.',
					status: 'planned',
					votes: 42,
					hasVoted: true,
					categoryId: 'cat-005',
					categoryName: 'إدارة الطلبات',
					categoryColor: 'red',
					createdAt: '2023-09-20T10:15:00',
					createdBy: {
						id: 'user-001',
						name: 'محمد علي',
					},
					commentsCount: 8,
				},
				{
					id: 'sug-002',
					title: 'تحسين تصميم لوحة التحكم الرئيسية',
					description:
						'أقترح تحسين تصميم لوحة التحكم الرئيسية لتكون أكثر تنظيمًا وسهولة في الاستخدام. يمكن إضافة ويدجيت مخصصة قابلة للتخصيص حسب احتياجات كل مستخدم.',
					status: 'in_progress',
					votes: 35,
					hasVoted: false,
					categoryId: 'cat-001',
					categoryName: 'واجهة المستخدم',
					categoryColor: 'blue',
					createdAt: '2023-09-18T12:30:00',
					createdBy: {
						id: 'user-002',
						name: 'سارة عبدالله',
					},
					commentsCount: 12,
				},
				{
					id: 'sug-003',
					title: 'إضافة تقارير تحليلية متقدمة للمبيعات',
					description:
						'أقترح إضافة المزيد من التقارير التحليلية المتقدمة للمبيعات، مثل تحليل اتجاهات المبيعات حسب الموسم، وتحليل سلوك العملاء، وتقارير المقارنة بين الفروع.',
					status: 'under_review',
					votes: 27,
					hasVoted: false,
					categoryId: 'cat-002',
					categoryName: 'التقارير والإحصائيات',
					categoryColor: 'purple',
					createdAt: '2023-09-22T15:45:00',
					createdBy: {
						id: 'user-003',
						name: 'فهد العتيبي',
					},
					commentsCount: 5,
				},
				{
					id: 'sug-004',
					title: 'إضافة نظام برنامج ولاء للعملاء',
					description:
						'أقترح إضافة نظام برنامج ولاء للعملاء يتيح لهم كسب النقاط واستبدالها بخصومات أو هدايا. هذا سيساعد في زيادة ولاء العملاء وتشجيعهم على العودة مرة أخرى.',
					status: 'completed',
					votes: 63,
					hasVoted: true,
					categoryId: 'cat-003',
					categoryName: 'إدارة العملاء',
					categoryColor: 'green',
					createdAt: '2023-09-15T09:20:00',
					createdBy: {
						id: 'user-004',
						name: 'عبدالله محمد',
					},
					commentsCount: 18,
				},
				{
					id: 'sug-005',
					title: 'إضافة خاصية تتبع المخزون بالباركود',
					description:
						'أقترح إضافة خاصية تتبع المخزون باستخدام الباركود، مما سيسهل عملية الجرد وإدارة المخزون. يمكن استخدام كاميرا الهاتف أو جهاز قارئ باركود.',
					status: 'new',
					votes: 18,
					hasVoted: false,
					categoryId: 'cat-004',
					categoryName: 'إدارة المخزون',
					categoryColor: 'amber',
					createdAt: '2023-09-24T17:10:00',
					createdBy: {
						id: 'user-005',
						name: 'نورة السالم',
					},
					commentsCount: 3,
				},
				{
					id: 'sug-006',
					title: 'دعم طرق دفع إضافية مثل Apple Pay وSTC Pay',
					description:
						'أقترح إضافة دعم لطرق دفع إضافية مثل Apple Pay وSTC Pay لتسهيل عملية الدفع على العملاء وتوفير خيارات متعددة لهم.',
					status: 'planned',
					votes: 48,
					hasVoted: false,
					categoryId: 'cat-006',
					categoryName: 'المدفوعات والفواتير',
					categoryColor: 'indigo',
					createdAt: '2023-09-17T14:25:00',
					createdBy: {
						id: 'user-006',
						name: 'خالد العمري',
					},
					commentsCount: 10,
				},
				{
					id: 'sug-007',
					title: 'إضافة خاصية الطباعة المباشرة للفواتير',
					description:
						'أقترح إضافة خاصية الطباعة المباشرة للفواتير من النظام دون الحاجة لتحميل الملف أولاً، مما سيوفر الوقت والجهد.',
					status: 'declined',
					votes: 15,
					hasVoted: false,
					categoryId: 'cat-006',
					categoryName: 'المدفوعات والفواتير',
					categoryColor: 'indigo',
					createdAt: '2023-09-16T11:35:00',
					createdBy: {
						id: 'user-007',
						name: 'سعود الفيصل',
					},
					commentsCount: 6,
				},
			];

			setCategories(mockCategories);
			setSuggestions(mockSuggestions);
			setFilteredSuggestions(mockSuggestions);
			setLoading(false);
		};

		fetchSuggestionsData();
	}, []);

	// تطبيق الفلاتر والفرز
	useEffect(() => {
		let filtered = [...suggestions];

		// تطبيق فلتر البحث
		if (searchTerm) {
			filtered = filtered.filter(
				(suggestion) =>
					suggestion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					suggestion.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// تطبيق فلتر الفئة
		if (categoryFilter !== 'all') {
			filtered = filtered.filter((suggestion) => suggestion.categoryId === categoryFilter);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			filtered = filtered.filter((suggestion) => suggestion.status === statusFilter);
		}

		// تطبيق الفرز
		if (sortOption === 'votes') {
			filtered.sort((a, b) => b.votes - a.votes);
		} else if (sortOption === 'recent') {
			filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
		} else if (sortOption === 'status') {
			const statusOrder = {
				in_progress: 0,
				planned: 1,
				under_review: 2,
				new: 3,
				completed: 4,
				declined: 5,
			};

			filtered.sort((a, b) => {
				// @ts-ignore - statuses are controlled
				return statusOrder[a.status] - statusOrder[b.status];
			});
		}

		setFilteredSuggestions(filtered);
	}, [suggestions, searchTerm, categoryFilter, statusFilter, sortOption]);

	// رسم شارة حالة الاقتراح
	const renderStatusBadge = (status: string) => {
		switch (status) {
			case 'new':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						جديد
					</span>
				);
			case 'under_review':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
						قيد المراجعة
					</span>
				);
			case 'planned':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800'>
						مخطط له
					</span>
				);
			case 'in_progress':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						قيد التنفيذ
					</span>
				);
			case 'completed':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800'>
						مكتمل
					</span>
				);
			case 'declined':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						مرفوض
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

	// رسم شارة فئة الاقتراح
	const renderCategoryBadge = (category: string, color: string) => {
		let bgColor = 'bg-gray-100';
		let textColor = 'text-gray-800';

		switch (color) {
			case 'blue':
				bgColor = 'bg-blue-100';
				textColor = 'text-blue-800';
				break;
			case 'purple':
				bgColor = 'bg-purple-100';
				textColor = 'text-purple-800';
				break;
			case 'green':
				bgColor = 'bg-green-100';
				textColor = 'text-green-800';
				break;
			case 'amber':
				bgColor = 'bg-amber-100';
				textColor = 'text-amber-800';
				break;
			case 'red':
				bgColor = 'bg-red-100';
				textColor = 'text-red-800';
				break;
			case 'indigo':
				bgColor = 'bg-indigo-100';
				textColor = 'text-indigo-800';
				break;
		}

		return (
			<span
				className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
			>
				{category}
			</span>
		);
	};

	// تنسيق التاريخ
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);

		// تحقق ما إذا كان التاريخ هو اليوم
		const isToday = new Date().toDateString() === date.toDateString();

		if (isToday) {
			return `اليوم، ${date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}`;
		}

		// تحقق ما إذا كان التاريخ هو الأمس
		const yesterday = new Date();
		yesterday.setDate(yesterday.getDate() - 1);
		const isYesterday = yesterday.toDateString() === date.toDateString();

		if (isYesterday) {
			return `الأمس، ${date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}`;
		}

		// تنسيق للتواريخ الأخرى
		return date.toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	// التصويت على اقتراح
	const handleVote = (suggestionId: string) => {
		setSuggestions((prev) =>
			prev.map((suggestion) => {
				if (suggestion.id === suggestionId) {
					const newVotes = suggestion.hasVoted ? suggestion.votes - 1 : suggestion.votes + 1;
					return {
						...suggestion,
						votes: newVotes,
						hasVoted: !suggestion.hasVoted,
					};
				}
				return suggestion;
			})
		);
	};

	// التحقق من صحة نموذج الاقتراح الجديد
	const validateSuggestionForm = () => {
		const errors = {
			title: '',
			description: '',
			categoryId: '',
		};

		if (!newSuggestion.title.trim()) {
			errors.title = 'يرجى إدخال عنوان للاقتراح';
		} else if (newSuggestion.title.length < 10) {
			errors.title = 'يجب أن يكون العنوان 10 أحرف على الأقل';
		}

		if (!newSuggestion.description.trim()) {
			errors.description = 'يرجى إدخال وصف للاقتراح';
		} else if (newSuggestion.description.length < 20) {
			errors.description = 'يجب أن يكون الوصف 20 حرف على الأقل';
		}

		if (!newSuggestion.categoryId) {
			errors.categoryId = 'يرجى اختيار فئة للاقتراح';
		}

		setFormErrors(errors);

		return !errors.title && !errors.description && !errors.categoryId;
	};

	// إرسال اقتراح جديد
	const handleSubmitSuggestion = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateSuggestionForm()) {
			return;
		}

		setSubmitting(true);

		// محاكاة إرسال الطلب
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// إضافة الاقتراح الجديد (محاكاة)
		const selectedCategory = categories.find((c) => c.id === newSuggestion.categoryId);

		const newSuggestionObj: Suggestion = {
			id: `sug-${Date.now()}`,
			title: newSuggestion.title,
			description: newSuggestion.description,
			status: 'new',
			votes: 1,
			hasVoted: true,
			categoryId: newSuggestion.categoryId,
			categoryName: selectedCategory?.name || '',
			categoryColor: selectedCategory?.color || 'gray',
			createdAt: new Date().toISOString(),
			createdBy: {
				id: 'user-current',
				name: 'أنت',
			},
			commentsCount: 0,
		};

		setSuggestions((prev) => [newSuggestionObj, ...prev]);
		setSubmitting(false);
		setSubmitSuccess(true);

		// إعادة تعيين النموذج
		setNewSuggestion({
			title: '',
			description: '',
			categoryId: '',
		});

		// إخفاء النموذج ورسالة النجاح بعد 3 ثوانٍ
		setTimeout(() => {
			setShowNewSuggestionForm(false);
			setSubmitSuccess(false);
		}, 3000);
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500'></div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div className='flex items-center'>
					<Link
						href='/dashboard/support'
						className='flex items-center text-gray-500 hover:text-gray-700 ml-4'
					>
						<ArrowLeft className='h-5 w-5' />
						<span className='mr-1 text-sm'>العودة</span>
					</Link>
					<div>
						<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
							<ArrowUpRight className='inline-block ml-2 h-6 w-6 text-amber-500' />
							تقديم اقتراحات
						</h1>
						<p className='mt-1 text-sm text-gray-600'>شارك أفكارك واقتراحاتك لتحسين النظام</p>
					</div>
				</div>

				<div>
					<button
						onClick={() => setShowNewSuggestionForm(!showNewSuggestionForm)}
						className='px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-medium flex items-center hover:bg-amber-600'
					>
						<Plus className='ml-1 h-4 w-4' />
						اقتراح جديد
					</button>
				</div>
			</div>

			{/* نموذج اقتراح جديد */}
			{showNewSuggestionForm && (
				<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-lg font-medium text-gray-900'>اقتراح جديد</h2>
						<button
							onClick={() => setShowNewSuggestionForm(false)}
							className='text-gray-400 hover:text-gray-500'
						>
							<X className='h-5 w-5' />
						</button>
					</div>

					{submitSuccess ? (
						<div className='bg-green-50 border border-green-200 rounded p-4'>
							<div className='flex'>
								<div className='flex-shrink-0'>
									<CheckCircle className='h-5 w-5 text-green-400' />
								</div>
								<div className='mr-3'>
									<p className='text-sm font-medium text-green-800'>تم تقديم اقتراحك بنجاح!</p>
									<p className='mt-1 text-sm text-green-700'>
										شكراً على مساهمتك في تحسين النظام. سيتم مراجعة اقتراحك من قبل فريقنا.
									</p>
								</div>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmitSuggestion}>
							<div className='space-y-4'>
								{/* عنوان الاقتراح */}
								<div>
									<label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-1'>
										عنوان الاقتراح <span className='text-red-500'>*</span>
									</label>
									<input
										type='text'
										id='title'
										value={newSuggestion.title}
										onChange={(e) => setNewSuggestion({ ...newSuggestion, title: e.target.value })}
										className={`block w-full rounded-md border ${
											formErrors.title ? 'border-red-300' : 'border-gray-300'
										} shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm`}
										placeholder='ضع عنواناً مختصراً وواضحاً لاقتراحك'
									/>
									{formErrors.title && (
										<p className='mt-1 text-sm text-red-600'>{formErrors.title}</p>
									)}
								</div>

								{/* فئة الاقتراح */}
								<div>
									<label htmlFor='category' className='block text-sm font-medium text-gray-700 mb-1'>
										فئة الاقتراح <span className='text-red-500'>*</span>
									</label>
									<div className='relative'>
										<select
											id='category'
											value={newSuggestion.categoryId}
											onChange={(e) =>
												setNewSuggestion({ ...newSuggestion, categoryId: e.target.value })
											}
											className={`block w-full appearance-none rounded-md border ${
												formErrors.categoryId ? 'border-red-300' : 'border-gray-300'
											} shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm`}
										>
											<option value=''>اختر فئة...</option>
											{categories.map((category) => (
												<option key={category.id} value={category.id}>
													{category.name}
												</option>
											))}
										</select>
										<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
											<ChevronDown className='h-4 w-4 text-gray-400' />
										</div>
									</div>
									{formErrors.categoryId && (
										<p className='mt-1 text-sm text-red-600'>{formErrors.categoryId}</p>
									)}
								</div>

								{/* وصف الاقتراح */}
								<div>
									<label
										htmlFor='description'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										تفاصيل الاقتراح <span className='text-red-500'>*</span>
									</label>
									<textarea
										id='description'
										value={newSuggestion.description}
										onChange={(e) =>
											setNewSuggestion({ ...newSuggestion, description: e.target.value })
										}
										rows={5}
										className={`block w-full rounded-md border ${
											formErrors.description ? 'border-red-300' : 'border-gray-300'
										} shadow-sm py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm`}
										placeholder='اشرح اقتراحك بالتفصيل. ما المشكلة التي يحلها؟ كيف يمكن تنفيذه؟ ما الفوائد المتوقعة منه؟'
									/>
									{formErrors.description && (
										<p className='mt-1 text-sm text-red-600'>{formErrors.description}</p>
									)}
								</div>

								{/* توجيهات مفيدة */}
								<div className='bg-amber-50 border border-amber-200 rounded p-4'>
									<p className='text-sm font-medium text-amber-800 mb-2'>نصائح لكتابة اقتراح فعال:</p>
									<ul className='text-xs text-amber-700 mr-5 list-disc space-y-1'>
										<li>كن محدداً وواضحاً في وصف الاقتراح</li>
										<li>اشرح المشكلة التي يحلها اقتراحك</li>
										<li>حاول توضيح كيفية تنفيذ الاقتراح إن أمكن</li>
										<li>اذكر الفوائد المتوقعة من تنفيذ الاقتراح</li>
									</ul>
								</div>

								{/* أزرار النموذج */}
								<div className='flex justify-end space-x-3 space-x-reverse'>
									<button
										type='button'
										onClick={() => setShowNewSuggestionForm(false)}
										className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50'
									>
										إلغاء
									</button>
									<button
										type='submit'
										disabled={submitting}
										className='px-4 py-2 bg-amber-500 text-white rounded-md text-sm font-medium hover:bg-amber-600 flex items-center disabled:opacity-70 disabled:cursor-not-allowed'
									>
										{submitting ? (
											<>
												<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-1'></div>
												جاري الإرسال...
											</>
										) : (
											<>
												<Send className='ml-1 h-4 w-4' />
												تقديم الاقتراح
											</>
										)}
									</button>
								</div>
							</div>
						</form>
					)}
				</div>
			)}

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex flex-col md:flex-row md:items-center gap-4 mb-6'>
					{/* البحث */}
					<div className='relative flex-1'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='ابحث في الاقتراحات...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
						/>
					</div>

					{/* فلتر الفئة */}
					<div className='relative w-full md:w-48'>
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm'
						>
							<option value='all'>جميع الفئات</option>
							{categories.map((category) => (
								<option key={category.id} value={category.id}>
									{category.name} ({category.count})
								</option>
							))}
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر الحالة */}
					<div className='relative w-full md:w-48'>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-amber-500 focus:border-amber-500 text-sm'
						>
							<option value='all'>جميع الحالات</option>
							<option value='new'>جديد</option>
							<option value='under_review'>قيد المراجعة</option>
							<option value='planned'>مخطط له</option>
							<option value='in_progress'>قيد التنفيذ</option>
							<option value='completed'>مكتمل</option>
							<option value='declined'>مرفوض</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>
				</div>

				{/* خيارات الفرز وعرض النتائج */}
				<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-gray-200 pt-4'>
					<span className='text-sm text-gray-500 mb-2 sm:mb-0'>
						عرض {filteredSuggestions.length} من أصل {suggestions.length} اقتراح
					</span>

					<div className='flex items-center'>
						<span className='text-sm text-gray-500 ml-2'>الترتيب حسب:</span>
						<div className='relative'>
							<select
								value={sortOption}
								onChange={(e) => setSortOption(e.target.value as 'votes' | 'recent' | 'status')}
								className='appearance-none border-0 py-1 pl-6 pr-2 bg-transparent text-gray-500 focus:ring-0 text-sm'
							>
								<option value='votes'>الأصوات</option>
								<option value='recent'>الأحدث</option>
								<option value='status'>الحالة</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* قائمة الاقتراحات */}
			<div className='space-y-4'>
				{filteredSuggestions.length > 0 ? (
					filteredSuggestions.map((suggestion) => (
						<div
							key={suggestion.id}
							className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'
						>
							<div className='p-5'>
								<div className='flex flex-col sm:flex-row sm:items-start justify-between gap-2'>
									<Link
										href={`/dashboard/support/suggestions/${suggestion.id}`}
										className='text-lg font-medium text-gray-900 hover:text-amber-600 transition-colors group'
									>
										<span className='group-hover:underline'>{suggestion.title}</span>
										<ArrowUpRight className='h-4 w-4 inline-block mr-1 opacity-0 group-hover:opacity-100 transition-opacity' />
									</Link>

									<div className='flex items-center space-x-2 space-x-reverse'>
										{renderCategoryBadge(suggestion.categoryName, suggestion.categoryColor)}
										{renderStatusBadge(suggestion.status)}
									</div>
								</div>

								<p className='mt-2 text-gray-600 line-clamp-2'>{suggestion.description}</p>

								<div className='mt-4 flex flex-wrap items-center justify-between gap-y-2'>
									<div className='flex items-center text-sm text-gray-500'>
										<User className='h-4 w-4 ml-1' />
										<span>{suggestion.createdBy.name}</span>
										<span className='mx-2'>•</span>
										<Calendar className='h-4 w-4 ml-1' />
										<span>{formatDate(suggestion.createdAt)}</span>
										{suggestion.commentsCount > 0 && (
											<>
												<span className='mx-2'>•</span>
												<MessageSquare className='h-4 w-4 ml-1' />
												<span>{suggestion.commentsCount} تعليق</span>
											</>
										)}
									</div>

									<button
										onClick={() => handleVote(suggestion.id)}
										className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border ${
											suggestion.hasVoted
												? 'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200'
												: 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
										}`}
									>
										<ThumbsUp
											className={`h-4 w-4 ml-1 ${
												suggestion.hasVoted ? 'text-amber-600' : 'text-gray-500'
											}`}
										/>
										<span>{suggestion.votes}</span>
									</button>
								</div>
							</div>
						</div>
					))
				) : (
					<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center'>
						<div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-amber-100'>
							<CheckCircle className='h-6 w-6 text-amber-600' />
						</div>
						<h3 className='mt-2 text-lg font-medium text-gray-900'>لا توجد اقتراحات</h3>
						<p className='mt-1 text-gray-500'>
							{searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
								? 'لم نتمكن من العثور على اقتراحات تطابق معايير البحث الخاصة بك'
								: 'لم يتم تقديم أي اقتراحات بعد. كن أول من يشارك فكرة لتحسين النظام!'}
						</p>
						<div className='mt-4'>
							<button
								onClick={() => setShowNewSuggestionForm(true)}
								className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600'
							>
								<Plus className='ml-1 -mr-1 h-4 w-4' />
								إضافة اقتراح جديد
							</button>
						</div>
					</div>
				)}
			</div>

			{/* منطقة إحصائيات الاقتراحات */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex items-start'>
						<div className='flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ml-3'>
							<CheckCircle className='h-5 w-5' />
						</div>
						<div>
							<h3 className='text-lg font-medium text-gray-900'>{suggestions.length}</h3>
							<p className='text-sm text-gray-500'>إجمالي الاقتراحات</p>
						</div>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex items-start'>
						<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
							<CheckCircle className='h-5 w-5' />
						</div>
						<div>
							<h3 className='text-lg font-medium text-gray-900'>
								{suggestions.filter((s) => s.status === 'completed').length}
							</h3>
							<p className='text-sm text-gray-500'>اقتراحات تم تنفيذها</p>
						</div>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex items-start'>
						<div className='flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 ml-3'>
							<Clock className='h-5 w-5' />
						</div>
						<div>
							<h3 className='text-lg font-medium text-gray-900'>
								{suggestions.filter((s) => ['in_progress', 'planned'].includes(s.status)).length}
							</h3>
							<p className='text-sm text-gray-500'>اقتراحات قيد التنفيذ</p>
						</div>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex items-start'>
						<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
							<Tag className='h-5 w-5' />
						</div>
						<div>
							<h3 className='text-lg font-medium text-gray-900'>{categories.length}</h3>
							<p className='text-sm text-gray-500'>فئات الاقتراحات</p>
						</div>
					</div>
				</div>
			</div>

			{/* معلومات عن عملية الاقتراحات */}
			<div className='bg-amber-50 border border-amber-200 rounded-lg p-6'>
				<h3 className='text-lg font-medium text-gray-900 mb-4'>كيف تعمل عملية الاقتراحات؟</h3>
				<div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
					<div className='bg-white p-4 rounded-lg border border-amber-100 shadow-sm'>
						<div className='h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2'>
							<span className='text-sm font-medium'>1</span>
						</div>
						<h4 className='text-sm font-medium text-gray-900 mb-1'>تقديم الاقتراح</h4>
						<p className='text-xs text-gray-600'>شارك فكرتك مع وصف مفصل</p>
					</div>

					<div className='bg-white p-4 rounded-lg border border-amber-100 shadow-sm'>
						<div className='h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2'>
							<span className='text-sm font-medium'>2</span>
						</div>
						<h4 className='text-sm font-medium text-gray-900 mb-1'>مراجعة الاقتراح</h4>
						<p className='text-xs text-gray-600'>يقوم فريقنا بمراجعة الاقتراح وتقييمه</p>
					</div>

					<div className='bg-white p-4 rounded-lg border border-amber-100 shadow-sm'>
						<div className='h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2'>
							<span className='text-sm font-medium'>3</span>
						</div>
						<h4 className='text-sm font-medium text-gray-900 mb-1'>تصويت المجتمع</h4>
						<p className='text-xs text-gray-600'>يقوم المستخدمون بالتصويت على الاقتراحات</p>
					</div>

					<div className='bg-white p-4 rounded-lg border border-amber-100 shadow-sm'>
						<div className='h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2'>
							<span className='text-sm font-medium'>4</span>
						</div>
						<h4 className='text-sm font-medium text-gray-900 mb-1'>التخطيط والتنفيذ</h4>
						<p className='text-xs text-gray-600'>يتم وضع خطة لتنفيذ الاقتراحات المعتمدة</p>
					</div>

					<div className='bg-white p-4 rounded-lg border border-amber-100 shadow-sm'>
						<div className='h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-2'>
							<span className='text-sm font-medium'>5</span>
						</div>
						<h4 className='text-sm font-medium text-gray-900 mb-1'>إطلاق الميزة</h4>
						<p className='text-xs text-gray-600'>يتم تنفيذ الاقتراح وإطلاقه للاستخدام</p>
					</div>
				</div>
			</div>
		</div>
	);
}
