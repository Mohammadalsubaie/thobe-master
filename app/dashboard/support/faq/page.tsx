'use client';

import {
	ArrowLeft,
	BarChart2,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	CreditCard,
	HelpCircle,
	MessageSquare,
	Package,
	Search,
	ShoppingBag,
	ThumbsDown,
	ThumbsUp,
	Users,
	Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface FaqCategory {
	id: string;
	name: string;
	icon: string;
	description: string;
	questionsCount: number;
}

interface FaqItem {
	id: string;
	question: string;
	answer: string;
	categoryId: string;
	categoryName: string;
	helpful: number;
	notHelpful: number;
	createdAt: string;
	updatedAt: string;
}

export default function FaqPage() {
	const [loading, setLoading] = useState(true);
	const [categories, setCategories] = useState<FaqCategory[]>([]);
	const [popularFaqs, setPopularFaqs] = useState<FaqItem[]>([]);
	const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<FaqItem[]>([]);
	const [isSearching, setIsSearching] = useState(false);
	const [feedbackSubmitted, setFeedbackSubmitted] = useState<Set<string>>(new Set());

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchFaqData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية لفئات الأسئلة الشائعة
			const mockCategories: FaqCategory[] = [
				{
					id: 'faq-cat-001',
					name: 'بدء الاستخدام',
					icon: 'zap',
					description: 'أسئلة حول كيفية البدء باستخدام النظام وإعداده للمرة الأولى',
					questionsCount: 8,
				},
				{
					id: 'faq-cat-002',
					name: 'إدارة الطلبات',
					icon: 'shopping-bag',
					description: 'أسئلة حول إنشاء وإدارة ومتابعة الطلبات',
					questionsCount: 12,
				},
				{
					id: 'faq-cat-003',
					name: 'المدفوعات والفواتير',
					icon: 'credit-card',
					description: 'أسئلة حول المدفوعات وإعدادات الفواتير والضرائب',
					questionsCount: 10,
				},
				{
					id: 'faq-cat-004',
					name: 'إدارة العملاء',
					icon: 'users',
					description: 'أسئلة حول إضافة وإدارة معلومات العملاء',
					questionsCount: 7,
				},
				{
					id: 'faq-cat-005',
					name: 'التقارير والإحصائيات',
					icon: 'bar-chart-2',
					description: 'أسئلة حول تقارير الأداء والمبيعات والإحصائيات',
					questionsCount: 6,
				},
				{
					id: 'faq-cat-006',
					name: 'المخزون والمنتجات',
					icon: 'package',
					description: 'أسئلة حول إدارة المخزون والمنتجات',
					questionsCount: 9,
				},
			];

			// بيانات تجريبية للأسئلة الشائعة
			const mockPopularFaqs: FaqItem[] = [
				{
					id: 'faq-001',
					question: 'كيف يمكنني إضافة عميل جديد في النظام؟',
					answer: 'يمكنك إضافة عميل جديد من خلال الذهاب إلى قسم "العملاء" في الشريط الجانبي، ثم النقر على زر "إضافة عميل جديد". قم بتعبئة البيانات المطلوبة مثل الاسم ورقم الهاتف والبريد الإلكتروني وغيرها من المعلومات الضرورية ثم اضغط على "حفظ" لإتمام العملية.',
					categoryId: 'faq-cat-004',
					categoryName: 'إدارة العملاء',
					helpful: 124,
					notHelpful: 12,
					createdAt: '2023-08-15T10:30:00',
					updatedAt: '2023-09-20T14:15:00',
				},
				{
					id: 'faq-002',
					question: 'كيف يمكنني تعديل طلب بعد إنشائه؟',
					answer: 'يمكنك تعديل الطلب بعد إنشائه من خلال الذهاب إلى صفحة الطلبات، ثم البحث عن الطلب المطلوب تعديله. انقر على رمز "التعديل" (أيقونة القلم) الموجود بجانب الطلب. ستتمكن من تعديل تفاصيل الطلب مثل المنتجات أو المقاسات أو معلومات العميل، ثم اضغط على "حفظ التغييرات" لتأكيد التعديلات. ملاحظة: لا يمكن تعديل الطلبات التي تم تسليمها بالفعل، وقد تكون هناك قيود على بعض التعديلات اعتمادًا على مرحلة الطلب.',
					categoryId: 'faq-cat-002',
					categoryName: 'إدارة الطلبات',
					helpful: 231,
					notHelpful: 18,
					createdAt: '2023-08-17T11:45:00',
					updatedAt: '2023-09-15T09:30:00',
				},
				{
					id: 'faq-003',
					question: 'ما هي طرق الدفع المدعومة في النظام؟',
					answer: 'يدعم نظام ثوب ماستر العديد من طرق الدفع لتلبية احتياجات عملائك، بما في ذلك: بطاقات الائتمان (فيزا، ماستر كارد، أمريكان إكسبرس)، بطاقات مدى، محافظ إلكترونية (أبل باي، ستك باي)، تحويل بنكي، دفع نقدي عند الاستلام. يمكنك تفعيل أو تعطيل أي من هذه الطرق من خلال إعدادات المدفوعات في لوحة التحكم.',
					categoryId: 'faq-cat-003',
					categoryName: 'المدفوعات والفواتير',
					helpful: 198,
					notHelpful: 7,
					createdAt: '2023-08-20T13:15:00',
					updatedAt: '2023-09-10T15:45:00',
				},
				{
					id: 'faq-004',
					question: 'كيف يمكنني إعداد نظام المخزون لأول مرة؟',
					answer: 'لإعداد نظام المخزون لأول مرة، اتبع الخطوات التالية:\n\n1. انتقل إلى قسم "المخزون" في الشريط الجانبي\n2. اضغط على "إعدادات المخزون"\n3. قم بتحديد الوحدات والفئات التي تريد استخدامها\n4. أضف المخازن أو المستودعات التي تملكها\n5. قم بإدخال المنتجات والكميات المتوفرة لديك\n6. حدد مستويات التنبيه للمخزون المنخفض\n7. اضبط إعدادات الجرد الدوري\n\nيمكنك أيضًا استيراد بيانات المخزون باستخدام ملف Excel من خلال خيار "استيراد" الموجود في صفحة المخزون.',
					categoryId: 'faq-cat-006',
					categoryName: 'المخزون والمنتجات',
					helpful: 145,
					notHelpful: 22,
					createdAt: '2023-08-25T09:00:00',
					updatedAt: '2023-09-05T10:30:00',
				},
				{
					id: 'faq-005',
					question: 'كيف يمكنني إنشاء تقرير مخصص للمبيعات؟',
					answer: 'لإنشاء تقرير مخصص للمبيعات، اتبع هذه الخطوات:\n\n1. انتقل إلى قسم "التقارير" في الشريط الجانبي\n2. اختر "تقارير المبيعات" ثم "تقرير مخصص"\n3. حدد الفترة الزمنية المطلوبة (يوم، أسبوع، شهر، فترة محددة)\n4. اختر تصفية البيانات حسب الفرع، المنتج، المستخدم، أو أي معايير أخرى\n5. حدد نوع العرض (جدول، رسم بياني، مخطط)\n6. اضغط على "إنشاء التقرير"\n7. يمكنك حفظ التقرير كقالب لاستخدامه مستقبلاً\n\nيمكنك أيضًا تصدير التقرير بصيغة PDF أو Excel أو طباعته مباشرة من النظام.',
					categoryId: 'faq-cat-005',
					categoryName: 'التقارير والإحصائيات',
					helpful: 167,
					notHelpful: 5,
					createdAt: '2023-08-30T14:20:00',
					updatedAt: '2023-09-12T11:10:00',
				},
			];

			setCategories(mockCategories);
			setPopularFaqs(mockPopularFaqs);
			setLoading(false);
		};

		fetchFaqData();
	}, []);

	// محاكاة البحث في الأسئلة الشائعة
	const handleSearch = () => {
		if (!searchTerm.trim()) {
			setSearchResults([]);
			return;
		}

		setIsSearching(true);

		// محاكاة تأخير البحث
		setTimeout(() => {
			// افتراض أننا نبحث في الأسئلة الشائعة الشعبية للتبسيط
			const results = popularFaqs.filter(
				(faq) =>
					faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
					faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
			);

			setSearchResults(results);
			setIsSearching(false);
		}, 500);
	};

	// توسيع/طي سؤال
	const toggleQuestion = (questionId: string) => {
		const newExpandedQuestions = new Set(expandedQuestions);
		if (newExpandedQuestions.has(questionId)) {
			newExpandedQuestions.delete(questionId);
		} else {
			newExpandedQuestions.add(questionId);
		}
		setExpandedQuestions(newExpandedQuestions);
	};

	// إرسال ملاحظات حول فائدة الإجابة
	const submitFeedback = (questionId: string, isHelpful: boolean) => {
		// هنا يمكن إرسال البيانات إلى الخادم لتحديث عدد الإعجابات

		// نحدث حالة الملاحظات المرسلة محليًا
		setFeedbackSubmitted((prev) => new Set(prev).add(questionId));

		// تظهر رسالة شكر للمستخدم (يمكن تنفيذها بطريقة أفضل)
		alert(isHelpful ? 'شكرًا لك على الملاحظات الإيجابية!' : 'شكرًا على ملاحظاتك، سنعمل على تحسين الإجابة.');
	};

	// رسم أيقونة حسب الاسم
	const renderIcon = (iconName: string) => {
		switch (iconName) {
			case 'zap':
				return <Zap className='h-6 w-6' />;
			case 'shopping-bag':
				return <ShoppingBag className='h-6 w-6' />;
			case 'credit-card':
				return <CreditCard className='h-6 w-6' />;
			case 'users':
				return <Users className='h-6 w-6' />;
			case 'bar-chart-2':
				return <BarChart2 className='h-6 w-6' />;
			case 'package':
				return <Package className='h-6 w-6' />;
			default:
				return <HelpCircle className='h-6 w-6' />;
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
					<HelpCircle className='inline-block ml-2 h-6 w-6 text-blue-600' />
					الأسئلة الشائعة
				</h1>
			</div>

			{/* مربع البحث */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<h2 className='text-lg font-medium text-gray-900 mb-4'>ابحث في الأسئلة الشائعة</h2>
				<div className='relative'>
					<input
						type='text'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
						placeholder='اكتب سؤالك هنا...'
						className='block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-gray-900'
					/>
					<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
						<Search className='h-5 w-5 text-gray-400' />
					</div>
					<button
						onClick={handleSearch}
						className='absolute inset-y-0 left-0 px-3 text-blue-600 hover:text-blue-800 font-medium'
					>
						{isSearching ? (
							<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600'></div>
						) : (
							'بحث'
						)}
					</button>
				</div>
			</div>

			{/* نتائج البحث (إذا كان هناك بحث) */}
			{searchTerm && searchResults.length > 0 && (
				<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-lg font-medium text-gray-900'>نتائج البحث ({searchResults.length})</h2>
						<button
							onClick={() => {
								setSearchTerm('');
								setSearchResults([]);
							}}
							className='text-sm text-gray-500 hover:text-gray-700'
						>
							مسح البحث
						</button>
					</div>
					<div className='space-y-4'>
						{searchResults.map((faq) => (
							<div key={faq.id} className='border border-gray-200 rounded-lg overflow-hidden'>
								<button
									onClick={() => toggleQuestion(faq.id)}
									className='flex w-full items-center justify-between px-4 py-3 bg-gray-50 text-right'
								>
									<span className='text-gray-900 font-medium'>{faq.question}</span>
									{expandedQuestions.has(faq.id) ? (
										<ChevronUp className='h-5 w-5 text-gray-500' />
									) : (
										<ChevronDown className='h-5 w-5 text-gray-500' />
									)}
								</button>

								{expandedQuestions.has(faq.id) && (
									<div className='px-4 py-3 bg-white'>
										<div className='text-gray-700 whitespace-pre-line'>{faq.answer}</div>

										<div className='mt-4 pt-3 border-t border-gray-100 flex items-center justify-between'>
											<div className='text-xs text-gray-500'>
												تم التحديث: {new Date(faq.updatedAt).toLocaleDateString('ar-SA')}
											</div>

											<div className='flex items-center'>
												<span className='text-xs text-gray-500 ml-2'>
													هل كانت الإجابة مفيدة؟
												</span>

												{!feedbackSubmitted.has(faq.id) ? (
													<>
														<button
															onClick={() => submitFeedback(faq.id, true)}
															className='ml-1 p-1 text-gray-500 hover:text-green-600 rounded-full hover:bg-green-50'
															title='نعم، كانت مفيدة'
														>
															<ThumbsUp className='h-4 w-4' />
														</button>
														<button
															onClick={() => submitFeedback(faq.id, false)}
															className='p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50'
															title='لا، لم تكن مفيدة'
														>
															<ThumbsDown className='h-4 w-4' />
														</button>
													</>
												) : (
													<span className='text-xs text-green-600'>شكراً على ملاحظاتك!</span>
												)}
											</div>
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			)}

			{/* عرض "لا توجد نتائج" إذا كان هناك بحث بدون نتائج */}
			{searchTerm && searchResults.length === 0 && !isSearching && (
				<div className='bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center'>
					<div className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100'>
						<Search className='h-6 w-6 text-blue-600' />
					</div>
					<h3 className='mt-2 text-lg font-medium text-gray-900'>لا توجد نتائج للبحث</h3>
					<p className='mt-1 text-gray-500'>لم نتمكن من العثور على نتائج مطابقة لـ "{searchTerm}"</p>
					<div className='mt-6'>
						<Link
							href='/dashboard/support/contact'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
						>
							تواصل مع الدعم
						</Link>
					</div>
				</div>
			)}

			{/* فئات الأسئلة الشائعة */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<h2 className='text-lg font-medium text-gray-900 mb-4'>تصنيفات الأسئلة الشائعة</h2>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<Link
							key={category.id}
							href={`/dashboard/support/faq/category/${category.id}`}
							className='group block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-200'
						>
							<div className='flex items-start'>
								<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200'>
									{renderIcon(category.icon)}
								</div>
								<div>
									<h3 className='text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200'>
										{category.name}
									</h3>
									<p className='text-sm text-gray-500 mt-1 line-clamp-2'>{category.description}</p>
									<p className='text-xs text-blue-600 mt-2 flex items-center font-medium group-hover:underline'>
										عرض {category.questionsCount} سؤال وجواب
										<ChevronRight className='mr-1 h-3 w-3' />
									</p>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>

			{/* الأسئلة الأكثر شيوعًا */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<h2 className='text-lg font-medium text-gray-900 mb-4'>الأسئلة الأكثر شيوعًا</h2>
				<div className='space-y-4'>
					{popularFaqs.map((faq) => (
						<div key={faq.id} className='border border-gray-200 rounded-lg overflow-hidden'>
							<button
								onClick={() => toggleQuestion(faq.id)}
								className='flex w-full items-center justify-between px-4 py-3 bg-gray-50 text-right'
							>
								<span className='text-gray-900 font-medium'>{faq.question}</span>
								{expandedQuestions.has(faq.id) ? (
									<ChevronUp className='h-5 w-5 text-gray-500' />
								) : (
									<ChevronDown className='h-5 w-5 text-gray-500' />
								)}
							</button>

							{expandedQuestions.has(faq.id) && (
								<div className='px-4 py-3 bg-white'>
									<div className='text-gray-700 whitespace-pre-line'>{faq.answer}</div>

									<div className='mt-4 pt-3 border-t border-gray-100 flex items-center justify-between'>
										<div className='flex items-center'>
											<span className='px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800'>
												{faq.categoryName}
											</span>
											<div className='mr-2 text-xs text-gray-500'>
												تم التحديث: {new Date(faq.updatedAt).toLocaleDateString('ar-SA')}
											</div>
										</div>

										<div className='flex items-center'>
											<span className='text-xs text-gray-500 ml-2'>هل كانت الإجابة مفيدة؟</span>

											{!feedbackSubmitted.has(faq.id) ? (
												<>
													<button
														onClick={() => submitFeedback(faq.id, true)}
														className='ml-1 p-1 text-gray-500 hover:text-green-600 rounded-full hover:bg-green-50'
														title='نعم، كانت مفيدة'
													>
														<ThumbsUp className='h-4 w-4' />
													</button>
													<button
														onClick={() => submitFeedback(faq.id, false)}
														className='p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50'
														title='لا، لم تكن مفيدة'
													>
														<ThumbsDown className='h-4 w-4' />
													</button>
												</>
											) : (
												<span className='text-xs text-green-600'>شكراً على ملاحظاتك!</span>
											)}
										</div>
									</div>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* لم تجد ما تبحث عنه؟ */}
			<div className='bg-blue-50 border border-blue-200 rounded-lg p-6'>
				<div className='flex flex-col sm:flex-row items-center'>
					<div className='flex-shrink-0 h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 sm:mb-0 sm:ml-4'>
						<HelpCircle className='h-8 w-8' />
					</div>
					<div className='text-center sm:text-right flex-1'>
						<h3 className='text-lg font-medium text-gray-900'>لم تجد ما تبحث عنه؟</h3>
						<p className='mt-1 text-gray-600'>
							قم بالتواصل مع فريق الدعم وسيقوم فريقنا بالرد عليك في أقرب وقت ممكن.
						</p>
						<div className='mt-4'>
							<Link
								href='/dashboard/support/contact'
								className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
							>
								<MessageSquare className='ml-1 h-4 w-4' />
								تواصل مع الدعم
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
