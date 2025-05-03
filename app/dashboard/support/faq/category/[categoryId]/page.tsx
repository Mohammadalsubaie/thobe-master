'use client';

import {
	ArrowLeft,
	ChevronDown,
	ChevronUp,
	HelpCircle,
	MessageSquare,
	Search,
	ThumbsDown,
	ThumbsUp,
	Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
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
	tags?: string[];
}

interface CategoryWithFaqs {
	category: FaqCategory;
	faqs: FaqItem[];
}

export default function FaqCategoryPage() {
	const params = useParams();
	const router = useRouter();
	const categoryId = params.categoryId as string;

	const [loading, setLoading] = useState(true);
	const [categoryWithFaqs, setCategoryWithFaqs] = useState<CategoryWithFaqs | null>(null);
	const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
	const [searchTerm, setSearchTerm] = useState('');
	const [filteredFaqs, setFilteredFaqs] = useState<FaqItem[]>([]);
	const [feedbackSubmitted, setFeedbackSubmitted] = useState<Set<string>>(new Set());

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchCategoryData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية للفئة والأسئلة الشائعة
			let mockCategory: FaqCategory | null = null;

			// بيانات الفئة المحددة
			if (categoryId === 'faq-cat-001') {
				mockCategory = {
					id: 'faq-cat-001',
					name: 'بدء الاستخدام',
					icon: 'zap',
					description: 'أسئلة حول كيفية البدء باستخدام النظام وإعداده للمرة الأولى',
					questionsCount: 8,
				};
			} else {
				// إذا لم يتم العثور على الفئة، نعيد توجيه المستخدم إلى صفحة الأسئلة الشائعة الرئيسية
				router.push('/dashboard/support/faq');
				return;
			}

			// أسئلة شائعة لهذه الفئة
			const mockFaqs: FaqItem[] = [
				{
					id: 'faq-b001',
					question: 'كيف يمكنني تسجيل الدخول إلى النظام للمرة الأولى؟',
					answer: 'لتسجيل الدخول إلى النظام للمرة الأولى، اتبع الخطوات التالية:\n\n1. انتقل إلى صفحة تسجيل الدخول على الموقع الرسمي أو التطبيق\n2. أدخل اسم المستخدم وكلمة المرور المؤقتة التي تم إرسالها إليك عبر البريد الإلكتروني\n3. سيطلب منك النظام تغيير كلمة المرور المؤقتة إلى كلمة مرور جديدة من اختيارك\n4. قم بإنشاء كلمة مرور قوية تحتوي على حروف وأرقام ورموز\n5. أكمل عملية التحقق من هويتك إذا طُلب منك ذلك\n6. بعد تغيير كلمة المرور بنجاح، سيتم توجيهك إلى لوحة التحكم الرئيسية\n\nإذا واجهت أي مشكلة في تسجيل الدخول، يرجى التواصل مع فريق الدعم الفني.',
					categoryId: 'faq-cat-001',
					categoryName: 'بدء الاستخدام',
					helpful: 156,
					notHelpful: 5,
					createdAt: '2023-05-15T10:30:00',
					updatedAt: '2023-08-20T14:15:00',
					tags: ['تسجيل الدخول', 'كلمة المرور', 'الوصول'],
				},
				{
					id: 'faq-b002',
					question: 'كيفية إعداد ملف تعريف الشركة الخاص بي؟',
					answer: 'لإعداد ملف تعريف الشركة الخاص بك، اتبع هذه الخطوات:\n\n1. بعد تسجيل الدخول، انتقل إلى "الإعدادات" من القائمة الجانبية\n2. اختر "ملف تعريف الشركة" من قائمة الإعدادات\n3. قم بتعبئة المعلومات الأساسية مثل:\n   - اسم الشركة الرسمي\n   - رقم السجل التجاري\n   - العنوان الكامل\n   - معلومات الاتصال (رقم الهاتف، البريد الإلكتروني)\n   - شعار الشركة (يفضل بصيغة PNG بخلفية شفافة)\n4. أضف معلومات ضريبة القيمة المضافة إذا كانت شركتك مسجلة في الضريبة\n5. حدد عدد الفروع وأماكنها إذا كان لديك أكثر من فرع\n6. اضغط على "حفظ التغييرات" لتأكيد المعلومات\n\nملاحظة: يجب إكمال ملف تعريف الشركة بالكامل لضمان ظهور المعلومات الصحيحة على الفواتير والتقارير.',
					categoryId: 'faq-cat-001',
					categoryName: 'بدء الاستخدام',
					helpful: 132,
					notHelpful: 8,
					createdAt: '2023-05-16T11:45:00',
					updatedAt: '2023-08-17T09:30:00',
					tags: ['الملف الشخصي', 'إعدادات الشركة', 'الإعداد الأولي'],
				},
				{
					id: 'faq-b003',
					question: 'كيف أقوم بإضافة مستخدمين جدد إلى النظام؟',
					answer: 'لإضافة مستخدمين جدد إلى النظام، يجب أن تكون لديك صلاحيات المسؤول أو مدير النظام. اتبع الخطوات التالية:\n\n1. انتقل إلى "الإعدادات" من القائمة الجانبية\n2. اختر "إدارة المستخدمين"\n3. اضغط على زر "إضافة مستخدم جديد"\n4. قم بتعبئة البيانات المطلوبة:\n   - اسم المستخدم الكامل\n   - البريد الإلكتروني (سيتم استخدامه لتسجيل الدخول)\n   - رقم الجوال\n   - المسمى الوظيفي\n   - الفرع (إذا كان لديك أكثر من فرع)\n5. حدد مستوى الصلاحيات من القائمة المنسدلة (مسؤول، مدير، موظف، إلخ)\n6. يمكنك أيضًا تخصيص صلاحيات محددة بالضغط على "صلاحيات متقدمة"\n7. اضغط على "إضافة المستخدم" لإكمال العملية\n\nسيتلقى المستخدم الجديد بريدًا إلكترونيًا يحتوي على رابط لتفعيل حسابه وإنشاء كلمة مرور.',
					categoryId: 'faq-cat-001',
					categoryName: 'بدء الاستخدام',
					helpful: 185,
					notHelpful: 3,
					createdAt: '2023-05-18T13:15:00',
					updatedAt: '2023-07-10T15:45:00',
					tags: ['المستخدمين', 'الصلاحيات', 'إدارة الحسابات'],
				},
				{
					id: 'faq-b004',
					question: 'كيف يمكنني ضبط الإعدادات الأساسية للنظام؟',
					answer: 'لضبط الإعدادات الأساسية للنظام، اتبع هذه الخطوات:\n\n1. انتقل إلى "الإعدادات" من القائمة الجانبية\n2. اختر "إعدادات النظام" من القائمة\n3. ستجد عدة تبويبات للإعدادات المختلفة:\n\n**الإعدادات العامة**:\n- اللغة الافتراضية\n- المنطقة الزمنية\n- تنسيق التاريخ والوقت\n- العملة الرئيسية\n\n**إعدادات الفواتير**:\n- بادئة رقم الفاتورة\n- شروط الدفع الافتراضية\n- رسائل التذييل المخصصة\n- إعدادات ضريبة القيمة المضافة\n\n**إعدادات الإشعارات**:\n- تفعيل/تعطيل الإشعارات\n- طرق استلام الإشعارات (البريد الإلكتروني، رسائل نصية، إشعارات داخل النظام)\n- جدولة التقارير الدورية\n\n**إعدادات الأمان**:\n- سياسة كلمات المرور\n- مدة انتهاء الجلسة\n- التحقق بخطوتين\n\n4. قم بتعديل الإعدادات حسب احتياجاتك\n5. اضغط على "حفظ الإعدادات" في نهاية كل قسم\n\nملاحظة: بعض الإعدادات قد تتطلب إعادة تشغيل النظام لتطبيقها بشكل كامل.',
					categoryId: 'faq-cat-001',
					categoryName: 'بدء الاستخدام',
					helpful: 143,
					notHelpful: 7,
					createdAt: '2023-05-25T09:00:00',
					updatedAt: '2023-09-05T10:30:00',
					tags: ['إعدادات', 'تخصيص', 'ضبط النظام'],
				},
				{
					id: 'faq-b005',
					question: 'ما هي المتطلبات التقنية لاستخدام النظام بشكل أمثل؟',
					answer: 'لاستخدام نظام ثوب ماستر بشكل أمثل، ننصح بتوفر المتطلبات التقنية التالية:\n\n**متصفح الويب**:\n- Google Chrome (الإصدار 90 أو أحدث) - موصى به\n- Mozilla Firefox (الإصدار 88 أو أحدث)\n- Microsoft Edge (الإصدار 90 أو أحدث)\n- Safari (الإصدار 14 أو أحدث)\n\n**نظام التشغيل**:\n- Windows 10 أو 11\n- macOS 10.14 أو أحدث\n- أنظمة Linux الرئيسية\n\n**الأجهزة المحمولة**:\n- iOS 14 أو أحدث\n- Android 9 أو أحدث\n\n**اتصال الإنترنت**:\n- اتصال إنترنت مستقر بسرعة لا تقل عن 5 ميجابت/ثانية\n\n**الطابعات المدعومة** (للطباعة المباشرة):\n- طابعات متوافقة مع معيار ESC/POS\n- طابعات HP LaserJet\n- طابعات Epson\n- طابعات Brother\n\n**الأجهزة الإضافية المدعومة**:\n- قارئ الباركود\n- قارئ بطاقات الدفع\n- أجهزة نقاط البيع\n\nللحصول على أفضل أداء، نوصي بتحديث المتصفح باستمرار وتفعيل JavaScript وملفات تعريف الارتباط (Cookies).',
					categoryId: 'faq-cat-001',
					categoryName: 'بدء الاستخدام',
					helpful: 120,
					notHelpful: 4,
					createdAt: '2023-06-05T14:20:00',
					updatedAt: '2023-08-12T11:10:00',
					tags: ['متطلبات النظام', 'متصفحات', 'أجهزة'],
				},
				{
					id: 'faq-b006',
					question: 'هل يمكنني استخدام النظام على الأجهزة المحمولة؟',
					answer: 'نعم، يمكنك استخدام نظام ثوب ماستر على الأجهزة المحمولة بطريقتين:\n\n**1. التطبيق المخصص للأجهزة المحمولة**:\n- متوفر للتحميل على متجر Google Play للأجهزة التي تعمل بنظام Android\n- متوفر على App Store للأجهزة التي تعمل بنظام iOS\n- يوفر التطبيق واجهة مستخدم مُحسّنة للشاشات الصغيرة\n- يدعم الإشعارات الفورية\n- يمكنك الوصول إلى المهام الأساسية مثل إدارة الطلبات، وعرض تقارير المبيعات، ومتابعة المخزون\n\n**2. موقع ويب متجاوب**:\n- يمكن الوصول إلى النظام من خلال متصفح الويب على جهازك المحمول\n- تم تصميم الموقع ليتكيف مع أحجام الشاشات المختلفة\n- يوفر جميع الميزات المتاحة في نسخة سطح المكتب\n\n**ميزات الاستخدام على الأجهزة المحمولة**:\n- إدارة الطلبات أثناء التنقل\n- الوصول إلى بيانات العملاء\n- عرض التقارير والإحصائيات\n- تلقي الإشعارات الفورية للطلبات الجديدة\n- التقاط صور وإرفاقها مباشرة بالطلبات\n- مسح رموز الباركود باستخدام كاميرا الجهاز\n\nننصح باستخدام التطبيق المخصص للحصول على تجربة أفضل وأداء أسرع على الأجهزة المحمولة.',
					categoryId: 'faq-cat-001',
					categoryName: 'بدء الاستخدام',
					helpful: 97,
					notHelpful: 2,
					createdAt: '2023-06-12T16:45:00',
					updatedAt: '2023-07-18T09:20:00',
					tags: ['الجوال', 'التطبيق', 'الأجهزة المحمولة'],
				},
				{
					id: 'faq-b007',
					question: 'كيف يمكنني استعادة كلمة المرور في حال نسيانها؟',
					answer: 'لاستعادة كلمة المرور في حال نسيانها، اتبع الخطوات التالية:\n\n1. على صفحة تسجيل الدخول، انقر على رابط "نسيت كلمة المرور؟"\n2. أدخل عنوان البريد الإلكتروني المرتبط بحسابك\n3. انقر على زر "إرسال رابط إعادة التعيين"\n4. ستتلقى رسالة على بريدك الإلكتروني تحتوي على رابط لإعادة تعيين كلمة المرور\n5. انقر على الرابط في البريد الإلكتروني (ملاحظة: الرابط صالح لمدة 24 ساعة فقط)\n6. ستُنقل إلى صفحة إعادة تعيين كلمة المرور\n7. أدخل كلمة مرور جديدة والتأكيد عليها\n8. انقر على "حفظ كلمة المرور الجديدة"\n\n**ملاحظات مهمة**:\n- تأكد من استخدام كلمة مرور قوية تتكون من 8 أحرف على الأقل وتحتوي على أحرف كبيرة وصغيرة وأرقام ورموز\n- إذا لم تستلم رسالة البريد الإلكتروني، تحقق من مجلد الرسائل غير المرغوب فيها (Spam)\n- إذا استمرت المشكلة، يمكنك التواصل مع فريق الدعم الفني على الرقم 920001234\n\n**في حالة عدم الوصول إلى البريد الإلكتروني**:\nإذا لم تعد تملك إمكانية الوصول إلى البريد الإلكتروني المسجل، يرجى التواصل مع مسؤول النظام في شركتك أو مع فريق الدعم الفني مباشرةً.',
					categoryId: 'faq-cat-001',
					categoryName: 'بدء الاستخدام',
					helpful: 215,
					notHelpful: 5,
					createdAt: '2023-05-10T08:30:00',
					updatedAt: '2023-08-22T12:40:00',
					tags: ['كلمة المرور', 'استعادة الحساب', 'الأمان'],
				},
				{
					id: 'faq-b008',
					question: 'ما هي الخطوات الأولى بعد تسجيل الدخول للمرة الأولى؟',
					answer: 'بعد تسجيل الدخول للمرة الأولى، ننصح باتباع الخطوات التالية لبدء استخدام النظام بكفاءة:\n\n**1. أكمل ملف تعريف الشركة**:\n- انتقل إلى "الإعدادات" > "ملف تعريف الشركة"\n- أدخل معلومات شركتك كاملة\n- ارفع شعار الشركة لظهوره على الفواتير والتقارير\n\n**2. أضف فريق العمل**:\n- انتقل إلى "الإعدادات" > "إدارة المستخدمين"\n- أضف أعضاء فريقك وحدد أدوارهم وصلاحياتهم\n\n**3. أعد ضبط الإعدادات الأساسية**:\n- حدد العملة الرئيسية والمنطقة الزمنية\n- اضبط إعدادات الضرائب إن وجدت\n- خصص قوالب الفواتير والمستندات\n\n**4. أضف قائمة المنتجات/الخدمات**:\n- انتقل إلى "المنتجات" أو "الكتالوج"\n- أضف منتجاتك أو خدماتك مع وصف وأسعار مفصلة\n- قم بإعداد فئات المنتجات لتنظيم أفضل\n\n**5. أعد إعداد المخزون (إذا كان متاحاً)**:\n- أدخل الكميات الأولية للمخزون\n- حدد مستويات التنبيه للمخزون المنخفض\n\n**6. أضف قاعدة بيانات العملاء**:\n- قم باستيراد قائمة عملائك الحاليين أو أضفهم يدوياً\n- أضف بيانات التواصل ومعلومات الفوترة\n\n**7. استكشف لوحات التحكم والتقارير**:\n- تعرّف على لوحة التحكم الرئيسية والمؤشرات المتاحة\n- استعرض أنواع التقارير المختلفة\n\n**8. اطلع على الأدلة التعليمية**:\n- استخدم قسم "دليل المستخدم" للاطلاع على شروحات مفصلة\n- شاهد الفيديوهات التوضيحية المتاحة\n\nنوصي بالاستعانة بالدليل التدريبي المتوفر في قسم المساعدة للاطلاع على شرح تفصيلي لكل خطوة من الخطوات المذكورة أعلاه.',
					categoryId: 'faq-cat-001',
					categoryName: 'بدء الاستخدام',
					helpful: 178,
					notHelpful: 2,
					createdAt: '2023-05-20T11:20:00',
					updatedAt: '2023-08-15T13:30:00',
					tags: ['البداية', 'الإعداد الأولي', 'الخطوات الأولى'],
				},
			];

			setCategoryWithFaqs({
				category: mockCategory,
				faqs: mockFaqs,
			});

			setFilteredFaqs(mockFaqs);
			setLoading(false);
		};

		fetchCategoryData();
	}, [categoryId, router]);

	// تحديث الأسئلة المفلترة عند تغيير مصطلح البحث
	useEffect(() => {
		if (!categoryWithFaqs) return;

		if (!searchTerm.trim()) {
			setFilteredFaqs(categoryWithFaqs.faqs);
			return;
		}

		const filtered = categoryWithFaqs.faqs.filter(
			(faq) =>
				faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
				faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(faq.tags && faq.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
		);

		setFilteredFaqs(filtered);
	}, [searchTerm, categoryWithFaqs]);

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

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
			</div>
		);
	}

	if (!categoryWithFaqs) {
		return (
			<div className='text-center py-16'>
				<HelpCircle className='h-12 w-12 text-red-500 mx-auto' />
				<h3 className='mt-2 text-lg font-medium text-gray-900'>لم يتم العثور على الفئة</h3>
				<p className='mt-1 text-gray-500'>الفئة التي تبحث عنها غير موجودة أو تم حذفها</p>
				<div className='mt-6'>
					<Link
						href='/dashboard/support/faq'
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'
					>
						العودة إلى الأسئلة الشائعة
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex items-center'>
				<Link
					href='/dashboard/support/faq'
					className='flex items-center text-gray-500 hover:text-gray-700 ml-4'
				>
					<ArrowLeft className='h-5 w-5' />
					<span className='mr-1 text-sm'>العودة</span>
				</Link>
				<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
					<div className='flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-2'>
						<Zap className='h-5 w-5' />
					</div>
					<span>{categoryWithFaqs.category.name}</span>
				</h1>
			</div>

			{/* وصف الفئة والإحصائيات */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
					<div>
						<p className='text-gray-600'>{categoryWithFaqs.category.description}</p>
						<p className='mt-2 text-sm text-blue-600'>
							{categoryWithFaqs.faqs.length} سؤال وجواب في هذه الفئة
						</p>
					</div>

					<div className='flex gap-2'>
						<Link
							href='/dashboard/support/contact'
							className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
						>
							<MessageSquare className='ml-1 h-4 w-4' />
							لم تجد إجابة؟
						</Link>
					</div>
				</div>
			</div>

			{/* مربع البحث ضمن الفئة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='relative'>
					<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
						<Search className='h-5 w-5 text-gray-400' />
					</div>
					<input
						type='text'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder={`ابحث في أسئلة ${categoryWithFaqs.category.name}...`}
						className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm'
					/>
				</div>
			</div>

			{/* قائمة الأسئلة */}
			<div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
				{filteredFaqs.length > 0 ? (
					<div className='space-y-4'>
						{filteredFaqs.map((faq) => (
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

										{/* عرض الوسوم إن وجدت */}
										{faq.tags && faq.tags.length > 0 && (
											<div className='mt-3 flex flex-wrap gap-1'>
												{faq.tags.map((tag, idx) => (
													<span
														key={idx}
														className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800'
													>
														{tag}
													</span>
												))}
											</div>
										)}

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
															onClick={(e) => {
																e.stopPropagation();
																submitFeedback(faq.id, true);
															}}
															className='ml-1 p-1 text-gray-500 hover:text-green-600 rounded-full hover:bg-green-50'
															title='نعم، كانت مفيدة'
														>
															<ThumbsUp className='h-4 w-4' />
														</button>
														<button
															onClick={(e) => {
																e.stopPropagation();
																submitFeedback(faq.id, false);
															}}
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
				) : (
					<div className='text-center py-10'>
						<Search className='h-10 w-10 text-gray-300 mx-auto mb-2' />
						<h3 className='text-lg font-medium text-gray-900'>لا توجد نتائج</h3>
						<p className='mt-1 text-gray-500'>
							لم نتمكن من العثور على أسئلة تطابق معايير البحث "{searchTerm}"
						</p>
						<div className='mt-4'>
							<button
								onClick={() => setSearchTerm('')}
								className='inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
							>
								مسح البحث
							</button>
						</div>
					</div>
				)}
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
							قم بالتواصل مع فريق الدعم وسنقوم بالرد على استفسارك في أقرب وقت ممكن.
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

			{/* المزيد من الفئات */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='flex justify-between items-center mb-3'>
					<h3 className='text-base font-medium text-gray-900'>تصفح فئات أخرى</h3>
					<Link href='/dashboard/support/faq' className='text-sm text-blue-600 hover:text-blue-800'>
						جميع الفئات
					</Link>
				</div>
				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/support/faq/category/faq-cat-002'
						className='px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700'
					>
						إدارة الطلبات
					</Link>
					<Link
						href='/dashboard/support/faq/category/faq-cat-003'
						className='px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700'
					>
						المدفوعات والفواتير
					</Link>
					<Link
						href='/dashboard/support/faq/category/faq-cat-004'
						className='px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700'
					>
						إدارة العملاء
					</Link>
					<Link
						href='/dashboard/support/faq/category/faq-cat-005'
						className='px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700'
					>
						التقارير والإحصائيات
					</Link>
				</div>
			</div>
		</div>
	);
}
