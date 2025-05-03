'use client';

import {
	AlertCircle,
	ArrowDown,
	ArrowUp,
	Bookmark,
	Check,
	CheckCircle,
	Edit,
	ExternalLink,
	FileText,
	Grid,
	Home,
	Image,
	Layers,
	Layout,
	Menu,
	MessageSquare,
	Package,
	Palette,
	Plus,
	Save,
	Search,
	ShoppingBag,
	Tag,
	Trash,
	Upload,
	X,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ContentBlock {
	id: string;
	type: 'hero' | 'featured' | 'collection' | 'banner' | 'products' | 'categories' | 'text' | 'testimonials';
	title: string;
	subtitle?: string;
	layout?: 'default' | 'alternate' | 'grid' | 'slider';
	image?: string;
	buttonText?: string;
	buttonLink?: string;
	products?: string[];
	categories?: string[];
	content?: string;
	enabled: boolean;
	position: number;
	settings?: {
		backgroundColor?: string;
		textColor?: string;
		aspectRatio?: string;
		itemsPerRow?: number;
		showPrices?: boolean;
		showDescription?: boolean;
		fullWidth?: boolean;
	};
}

interface Category {
	id: string;
	name: string;
	slug: string;
	image?: string;
	productsCount: number;
}

interface Product {
	id: string;
	name: string;
	slug: string;
	price: number;
	compareAtPrice?: number;
	mainImage: string;
	status: 'active' | 'draft' | 'archived';
	featured: boolean;
}

interface Announcement {
	id: string;
	text: string;
	link?: string;
	backgroundColor: string;
	textColor: string;
	startDate?: string;
	endDate?: string;
	enabled: boolean;
}

interface Theme {
	id: string;
	name: string;
	screenshot: string;
	active: boolean;
}

export default function PublishPage() {
	const [activeTab, setActiveTab] = useState('homepage');
	const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<Category[]>([]);
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [themes, setThemes] = useState<Theme[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
	const [showBlockEditor, setShowBlockEditor] = useState(false);
	const [showProductSelector, setShowProductSelector] = useState(false);
	const [showCategorySelector, setShowCategorySelector] = useState(false);
	const [showAnnouncementEditor, setShowAnnouncementEditor] = useState(false);
	const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
	const [isSaving, setIsSaving] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);

	// للفلترة في منتقي المنتجات
	const [productSearchTerm, setProductSearchTerm] = useState('');
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

	// للفلترة في منتقي الفئات
	const [categorySearchTerm, setCategorySearchTerm] = useState('');
	const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// بيانات تجريبية لكتل المحتوى
			const mockContentBlocks: ContentBlock[] = [
				{
					id: 'block-001',
					type: 'hero',
					title: 'أناقة فاخرة لإطلالة مميزة',
					subtitle: 'تسوق أحدث تشكيلة من الأزياء الرجالية الفاخرة لموسم 2023',
					layout: 'default',
					image: '/images/hero-banner.jpg',
					buttonText: 'تسوق الآن',
					buttonLink: '/collections/all',
					enabled: true,
					position: 1,
					settings: {
						backgroundColor: '#f8f9fa',
						textColor: '#343a40',
						aspectRatio: '16:9',
						fullWidth: true,
					},
				},
				{
					id: 'block-002',
					type: 'featured',
					title: 'منتجات مميزة',
					subtitle: 'اكتشف أفضل اختياراتنا هذا الأسبوع',
					layout: 'grid',
					products: ['prod-001', 'prod-002', 'prod-006', 'prod-005'],
					enabled: true,
					position: 2,
					settings: {
						backgroundColor: '#ffffff',
						textColor: '#343a40',
						itemsPerRow: 4,
						showPrices: true,
						showDescription: false,
					},
				},
				{
					id: 'block-003',
					type: 'categories',
					title: 'تسوق حسب الفئة',
					layout: 'grid',
					categories: ['cat-001', 'cat-002', 'cat-003', 'cat-004'],
					enabled: true,
					position: 3,
					settings: {
						backgroundColor: '#f8f9fa',
						textColor: '#343a40',
						itemsPerRow: 4,
					},
				},
				{
					id: 'block-004',
					type: 'banner',
					title: 'عروض خاصة لفترة محدودة',
					subtitle: 'خصم 20% على جميع الثياب الكلاسيكية',
					layout: 'default',
					image: '/images/sale-banner.jpg',
					buttonText: 'تسوق العروض',
					buttonLink: '/collections/sale',
					enabled: true,
					position: 4,
					settings: {
						backgroundColor: '#e9ecef',
						textColor: '#212529',
						aspectRatio: '21:9',
					},
				},
				{
					id: 'block-005',
					type: 'collection',
					title: 'مجموعة الشتاء الجديدة',
					subtitle: 'أزياء شتوية فاخرة للمناسبات والاستخدام اليومي',
					layout: 'slider',
					products: ['prod-002', 'prod-008', 'prod-006', 'prod-010', 'prod-007'],
					enabled: true,
					position: 5,
					settings: {
						backgroundColor: '#ffffff',
						textColor: '#343a40',
						showPrices: true,
						showDescription: true,
					},
				},
				{
					id: 'block-006',
					type: 'text',
					title: 'عن متجرنا',
					content:
						'متجر أناقتي للأزياء هو وجهتك الأولى للأزياء الرجالية الفاخرة في المملكة العربية السعودية. نقدم مجموعة واسعة من الثياب والبشوت والإكسسوارات المصممة بأعلى معايير الجودة.',
					enabled: true,
					position: 6,
					settings: {
						backgroundColor: '#f8f9fa',
						textColor: '#343a40',
					},
				},
				{
					id: 'block-007',
					type: 'testimonials',
					title: 'آراء عملائنا',
					layout: 'slider',
					enabled: true,
					position: 7,
					settings: {
						backgroundColor: '#ffffff',
						textColor: '#343a40',
					},
				},
			];

			// بيانات تجريبية للمنتجات
			const mockProducts: Product[] = [
				{
					id: 'prod-001',
					name: 'ثوب كلاسيكي أبيض',
					slug: 'classic-white-thobe',
					price: 350.0,
					compareAtPrice: 400.0,
					mainImage: '/images/products/thobe-white-1.jpg',
					status: 'active',
					featured: true,
				},
				{
					id: 'prod-002',
					name: 'بشت شتوي بني',
					slug: 'winter-brown-bisht',
					price: 1200.0,
					mainImage: '/images/products/bisht-brown-1.jpg',
					status: 'active',
					featured: true,
				},
				{
					id: 'prod-003',
					name: 'غترة بيضاء فاخرة',
					slug: 'premium-white-ghutra',
					price: 120.0,
					mainImage: '/images/products/ghutra-white-1.jpg',
					status: 'active',
					featured: false,
				},
				{
					id: 'prod-004',
					name: 'عقال أسود كلاسيكي',
					slug: 'classic-black-eqal',
					price: 85.0,
					mainImage: '/images/products/eqal-black-1.jpg',
					status: 'active',
					featured: false,
				},
				{
					id: 'prod-005',
					name: 'ثوب صيفي بيج',
					slug: 'summer-beige-thobe',
					price: 270.0,
					compareAtPrice: 320.0,
					mainImage: '/images/products/thobe-beige-1.jpg',
					status: 'active',
					featured: true,
				},
				{
					id: 'prod-006',
					name: 'شماغ أحمر فاخر',
					slug: 'premium-red-shmagh',
					price: 220.0,
					mainImage: '/images/products/shmagh-red-1.jpg',
					status: 'active',
					featured: true,
				},
				{
					id: 'prod-007',
					name: 'سروال قطني أسود',
					slug: 'black-cotton-pants',
					price: 110.0,
					mainImage: '/images/products/pants-black-1.jpg',
					status: 'active',
					featured: false,
				},
				{
					id: 'prod-008',
					name: 'طاقية صوف شتوية',
					slug: 'winter-wool-cap',
					price: 55.0,
					mainImage: '/images/products/cap-wool-1.jpg',
					status: 'active',
					featured: false,
				},
				{
					id: 'prod-009',
					name: 'ثوب مطرز فاخر',
					slug: 'premium-embroidered-thobe',
					price: 650.0,
					mainImage: '/images/products/thobe-embroidered-1.jpg',
					status: 'draft',
					featured: true,
				},
				{
					id: 'prod-010',
					name: 'بشت مطرز ذهبي',
					slug: 'gold-embroidered-bisht',
					price: 1800.0,
					mainImage: '/images/products/bisht-gold-1.jpg',
					status: 'draft',
					featured: true,
				},
			];

			// بيانات تجريبية للفئات
			const mockCategories: Category[] = [
				{
					id: 'cat-001',
					name: 'ثياب رجالية',
					slug: 'mens-thobes',
					image: '/images/categories/thobes.jpg',
					productsCount: 25,
				},
				{
					id: 'cat-002',
					name: 'بشوت',
					slug: 'bishts',
					image: '/images/categories/bishts.jpg',
					productsCount: 10,
				},
				{
					id: 'cat-003',
					name: 'غتر وشماغات',
					slug: 'ghutras-shmagh',
					image: '/images/categories/ghutras.jpg',
					productsCount: 15,
				},
				{
					id: 'cat-004',
					name: 'إكسسوارات',
					slug: 'accessories',
					image: '/images/categories/accessories.jpg',
					productsCount: 30,
				},
				{
					id: 'cat-005',
					name: 'ملابس شتوية',
					slug: 'winter-clothes',
					image: '/images/categories/winter.jpg',
					productsCount: 12,
				},
				{
					id: 'cat-006',
					name: 'ملابس صيفية',
					slug: 'summer-clothes',
					image: '/images/categories/summer.jpg',
					productsCount: 18,
				},
				{
					id: 'cat-007',
					name: 'أطفال',
					slug: 'kids',
					image: '/images/categories/kids.jpg',
					productsCount: 20,
				},
				{
					id: 'cat-008',
					name: 'عروض خاصة',
					slug: 'sale',
					image: '/images/categories/sale.jpg',
					productsCount: 8,
				},
			];

			// بيانات تجريبية للإعلانات
			const mockAnnouncements: Announcement[] = [
				{
					id: 'ann-001',
					text: 'شحن مجاني للطلبات أكثر من 500 ريال',
					link: '/shipping-info',
					backgroundColor: '#343a40',
					textColor: '#ffffff',
					enabled: true,
				},
				{
					id: 'ann-002',
					text: 'خصم 15% على الطلبات الأولى - استخدم كود: FIRST15',
					backgroundColor: '#dc3545',
					textColor: '#ffffff',
					startDate: '2023-10-01',
					endDate: '2023-10-31',
					enabled: false,
				},
				{
					id: 'ann-003',
					text: 'عروض العيد - خصومات تصل إلى 30%',
					link: '/collections/eid-sale',
					backgroundColor: '#28a745',
					textColor: '#ffffff',
					startDate: '2023-12-01',
					endDate: '2023-12-15',
					enabled: false,
				},
			];

			// بيانات تجريبية للقوالب
			const mockThemes: Theme[] = [
				{
					id: 'theme-001',
					name: 'الأناقة',
					screenshot: '/images/themes/elegance.jpg',
					active: true,
				},
				{
					id: 'theme-002',
					name: 'البساطة',
					screenshot: '/images/themes/simplicity.jpg',
					active: false,
				},
				{
					id: 'theme-003',
					name: 'الفخامة',
					screenshot: '/images/themes/luxury.jpg',
					active: false,
				},
				{
					id: 'theme-004',
					name: 'العصرية',
					screenshot: '/images/themes/modern.jpg',
					active: false,
				},
			];

			setContentBlocks(mockContentBlocks);
			setProducts(mockProducts);
			setFilteredProducts(mockProducts);
			setCategories(mockCategories);
			setFilteredCategories(mockCategories);
			setAnnouncements(mockAnnouncements);
			setThemes(mockThemes);
			setLoading(false);
		};

		fetchData();
	}, []);

	// فلترة المنتجات عند البحث
	useEffect(() => {
		if (productSearchTerm) {
			const filtered = products.filter(
				(product) =>
					product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
					product.id.toLowerCase().includes(productSearchTerm.toLowerCase())
			);
			setFilteredProducts(filtered);
		} else {
			setFilteredProducts(products);
		}
	}, [productSearchTerm, products]);

	// فلترة الفئات عند البحث
	useEffect(() => {
		if (categorySearchTerm) {
			const filtered = categories.filter(
				(category) =>
					category.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
					category.id.toLowerCase().includes(categorySearchTerm.toLowerCase())
			);
			setFilteredCategories(filtered);
		} else {
			setFilteredCategories(categories);
		}
	}, [categorySearchTerm, categories]);

	// حصول على اسم المنتج من معرفه
	const getProductNameById = (productId: string): string => {
		const product = products.find((p) => p.id === productId);
		return product ? product.name : 'منتج غير موجود';
	};

	// حصول على اسم الفئة من معرفها
	const getCategoryNameById = (categoryId: string): string => {
		const category = categories.find((c) => c.id === categoryId);
		return category ? category.name : 'فئة غير موجودة';
	};

	// إضافة كتلة محتوى جديدة
	const addContentBlock = (type: ContentBlock['type']) => {
		const newBlock: ContentBlock = {
			id: `block-${Date.now()}`,
			type,
			title: getDefaultTitleForType(type),
			enabled: true,
			position: contentBlocks.length + 1,
			settings: getDefaultSettingsForType(type),
		};

		setContentBlocks([...contentBlocks, newBlock]);
		setSelectedBlock(newBlock);
		setShowBlockEditor(true);
	};

	// الحصول على العنوان الافتراضي حسب نوع الكتلة
	const getDefaultTitleForType = (type: ContentBlock['type']): string => {
		switch (type) {
			case 'hero':
				return 'عنوان القسم الرئيسي';
			case 'featured':
				return 'منتجات مميزة';
			case 'collection':
				return 'مجموعة منتجات';
			case 'banner':
				return 'لافتة إعلانية';
			case 'products':
				return 'منتجاتنا';
			case 'categories':
				return 'تسوق حسب الفئة';
			case 'text':
				return 'عنوان نصي';
			case 'testimonials':
				return 'آراء العملاء';
			default:
				return 'عنوان جديد';
		}
	};

	// الحصول على الإعدادات الافتراضية حسب نوع الكتلة
	const getDefaultSettingsForType = (type: ContentBlock['type']): ContentBlock['settings'] => {
		const defaultSettings = {
			backgroundColor: '#ffffff',
			textColor: '#343a40',
		};

		switch (type) {
			case 'hero':
			case 'banner':
				return {
					...defaultSettings,
					aspectRatio: '16:9',
					fullWidth: type === 'hero',
				};
			case 'featured':
			case 'products':
			case 'collection':
				return {
					...defaultSettings,
					itemsPerRow: 4,
					showPrices: true,
					showDescription: type === 'collection',
				};
			case 'categories':
				return {
					...defaultSettings,
					itemsPerRow: 4,
				};
			default:
				return defaultSettings;
		}
	};

	// فتح محرر كتلة محتوى
	const editContentBlock = (block: ContentBlock) => {
		setSelectedBlock(block);

		// إعداد المنتجات والفئات المحددة
		if (block.products) {
			setSelectedProducts(block.products);
		} else {
			setSelectedProducts([]);
		}

		if (block.categories) {
			setSelectedCategories(block.categories);
		} else {
			setSelectedCategories([]);
		}

		setShowBlockEditor(true);
	};

	// حفظ تغييرات كتلة المحتوى
	const saveContentBlock = () => {
		if (!selectedBlock) return;

		const updatedBlock = { ...selectedBlock };

		// تحديث المنتجات والفئات المحددة
		if (['featured', 'products', 'collection'].includes(updatedBlock.type)) {
			updatedBlock.products = selectedProducts;
		}

		if (updatedBlock.type === 'categories') {
			updatedBlock.categories = selectedCategories;
		}

		// تحديث الكتلة في القائمة
		const updatedBlocks = contentBlocks.map((block) => (block.id === updatedBlock.id ? updatedBlock : block));

		setContentBlocks(updatedBlocks);
		setShowBlockEditor(false);
		setSelectedBlock(null);
	};

	// حذف كتلة محتوى
	const deleteContentBlock = (blockId: string) => {
		const updatedBlocks = contentBlocks.filter((block) => block.id !== blockId);

		// إعادة ترتيب المواضع
		const reorderedBlocks = updatedBlocks.map((block, index) => ({
			...block,
			position: index + 1,
		}));

		setContentBlocks(reorderedBlocks);
	};

	// تغيير ترتيب الكتل
	const moveBlock = (blockId: string, direction: 'up' | 'down') => {
		const blockIndex = contentBlocks.findIndex((block) => block.id === blockId);
		if (blockIndex === -1) return;

		const newBlocks = [...contentBlocks];

		if (direction === 'up' && blockIndex > 0) {
			// تبديل الموضع مع الكتلة السابقة
			[newBlocks[blockIndex - 1], newBlocks[blockIndex]] = [newBlocks[blockIndex], newBlocks[blockIndex - 1]];
		} else if (direction === 'down' && blockIndex < newBlocks.length - 1) {
			// تبديل الموضع مع الكتلة التالية
			[newBlocks[blockIndex], newBlocks[blockIndex + 1]] = [newBlocks[blockIndex + 1], newBlocks[blockIndex]];
		} else {
			return; // لا يمكن التحرك في هذا الاتجاه
		}

		// تحديث مواضع الكتل
		const updatedBlocks = newBlocks.map((block, index) => ({
			...block,
			position: index + 1,
		}));

		setContentBlocks(updatedBlocks);
	};

	// تبديل تفعيل/تعطيل كتلة
	const toggleBlockEnabled = (blockId: string) => {
		const updatedBlocks = contentBlocks.map((block) =>
			block.id === blockId ? { ...block, enabled: !block.enabled } : block
		);
		setContentBlocks(updatedBlocks);
	};

	// فتح محرر الإعلان
	const editAnnouncement = (announcement?: Announcement) => {
		if (announcement) {
			setSelectedAnnouncement(announcement);
		} else {
			// إنشاء إعلان جديد بقيم افتراضية
			setSelectedAnnouncement({
				id: `ann-${Date.now()}`,
				text: 'إعلان جديد',
				backgroundColor: '#343a40',
				textColor: '#ffffff',
				enabled: true,
			});
		}
		setShowAnnouncementEditor(true);
	};

	// حفظ الإعلان
	const saveAnnouncement = () => {
		if (!selectedAnnouncement) return;

		if (announcements.some((a) => a.id === selectedAnnouncement.id)) {
			// تحديث إعلان موجود
			const updatedAnnouncements = announcements.map((announcement) =>
				announcement.id === selectedAnnouncement.id ? selectedAnnouncement : announcement
			);
			setAnnouncements(updatedAnnouncements);
		} else {
			// إضافة إعلان جديد
			setAnnouncements([...announcements, selectedAnnouncement]);
		}

		setShowAnnouncementEditor(false);
		setSelectedAnnouncement(null);
	};

	// حذف إعلان
	const deleteAnnouncement = (announcementId: string) => {
		const updatedAnnouncements = announcements.filter((a) => a.id !== announcementId);
		setAnnouncements(updatedAnnouncements);
	};

	// تبديل تفعيل/تعطيل إعلان
	const toggleAnnouncementEnabled = (announcementId: string) => {
		const updatedAnnouncements = announcements.map((announcement) =>
			announcement.id === announcementId ? { ...announcement, enabled: !announcement.enabled } : announcement
		);
		setAnnouncements(updatedAnnouncements);
	};

	// تبديل السمة النشطة
	const setActiveTheme = (themeId: string) => {
		const updatedThemes = themes.map((theme) => ({
			...theme,
			active: theme.id === themeId,
		}));
		setThemes(updatedThemes);
	};

	// حفظ جميع التغييرات
	const saveChanges = async () => {
		setIsSaving(true);

		// محاكاة عملية حفظ البيانات على الخادم
		await new Promise((resolve) => setTimeout(resolve, 1500));

		setIsSaving(false);
		setSaveSuccess(true);

		// إخفاء رسالة النجاح بعد 3 ثوان
		setTimeout(() => {
			setSaveSuccess(false);
		}, 3000);
	};

	// تنسيق التاريخ
	const formatDate = (dateString?: string) => {
		if (!dateString) return '-';
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// تنسيق المبلغ
	const formatAmount = (amount: number) => {
		return new Intl.NumberFormat('ar-SA', {
			style: 'currency',
			currency: 'SAR',
		}).format(amount);
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
						<Layout className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						النشر على المتجر
					</h1>
					<p className='mt-1 text-gray-500'>إدارة محتوى المتجر الإلكتروني ومظهره</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<a
						href='https://anaqati.com'
						target='_blank'
						rel='noopener noreferrer'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<ExternalLink className='ml-1 h-4 w-4' />
						زيارة المتجر
					</a>
					<button
						onClick={saveChanges}
						disabled={isSaving}
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						{isSaving ? (
							<>
								<span className='ml-1 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin'></span>
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

			{/* رسالة نجاح الحفظ */}
			{saveSuccess && (
				<div className='bg-green-50 border border-green-200 rounded-md p-3 flex items-center'>
					<Check className='h-5 w-5 text-green-500 ml-2' />
					<span className='text-green-800'>تم حفظ التغييرات بنجاح</span>
				</div>
			)}

			{/* تبويبات إدارة المحتوى */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='border-b border-gray-200'>
					<nav className='flex -mb-px overflow-x-auto scrollbar-hide'>
						<button
							onClick={() => setActiveTab('homepage')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'homepage'
									? 'border-b-2 border-indigo-500 text-indigo-600'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Home className='inline-block ml-2 h-5 w-5' />
							الصفحة الرئيسية
						</button>
						<button
							onClick={() => setActiveTab('announcements')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'announcements'
									? 'border-b-2 border-indigo-500 text-indigo-600'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Bookmark className='inline-block ml-2 h-5 w-5' />
							شريط الإعلانات
						</button>
						<button
							onClick={() => setActiveTab('theme')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'theme'
									? 'border-b-2 border-indigo-500 text-indigo-600'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Palette className='inline-block ml-2 h-5 w-5' />
							قالب المتجر
						</button>
						<button
							onClick={() => setActiveTab('menu')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'menu'
									? 'border-b-2 border-indigo-500 text-indigo-600'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Menu className='inline-block ml-2 h-5 w-5' />
							القائمة الرئيسية
						</button>
						<button
							onClick={() => setActiveTab('footer')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'footer'
									? 'border-b-2 border-indigo-500 text-indigo-600'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Layers className='inline-block ml-2 h-5 w-5' />
							تذييل الموقع
						</button>
					</nav>
				</div>

				<div className='p-6'>
					{/* الصفحة الرئيسية */}
					{activeTab === 'homepage' && (
						<div>
							<div className='flex justify-between items-center mb-6'>
								<h2 className='text-xl font-medium text-gray-900'>عناصر الصفحة الرئيسية</h2>
								<div className='flex gap-2'>
									<div className='relative group'>
										<button className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'>
											<Plus className='ml-1 h-4 w-4' />
											إضافة عنصر
										</button>
										<div className='absolute left-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
											<button
												onClick={() => addContentBlock('hero')}
												className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
											>
												<Image className='inline ml-1 h-4 w-4' />
												قسم رئيسي (Hero)
											</button>
											<button
												onClick={() => addContentBlock('featured')}
												className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
											>
												<Star className='inline ml-1 h-4 w-4' />
												منتجات مميزة
											</button>
											<button
												onClick={() => addContentBlock('collection')}
												className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
											>
												<Grid className='inline ml-1 h-4 w-4' />
												مجموعة منتجات
											</button>
											<button
												onClick={() => addContentBlock('banner')}
												className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
											>
												<Image className='inline ml-1 h-4 w-4' />
												لافتة إعلانية
											</button>
											<button
												onClick={() => addContentBlock('categories')}
												className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
											>
												<Tag className='inline ml-1 h-4 w-4' />
												تصنيفات المنتجات
											</button>
											<button
												onClick={() => addContentBlock('text')}
												className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
											>
												<FileText className='inline ml-1 h-4 w-4' />
												قسم نصي
											</button>
											<button
												onClick={() => addContentBlock('testimonials')}
												className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
											>
												<MessageSquare className='inline ml-1 h-4 w-4' />
												آراء العملاء
											</button>
										</div>
									</div>
								</div>
							</div>

							<div className='space-y-3'>
								{contentBlocks
									.sort((a, b) => a.position - b.position)
									.map((block) => (
										<div
											key={block.id}
											className={`border rounded-md ${
												block.enabled ? 'border-gray-200' : 'border-gray-200 bg-gray-50'
											}`}
										>
											<div className='flex items-center justify-between p-4'>
												<div className='flex items-center'>
													<div
														className={`flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center ${
															block.enabled
																? 'bg-indigo-100 text-indigo-600'
																: 'bg-gray-100 text-gray-400'
														}`}
													>
														{block.type === 'hero' && <Image className='h-5 w-5' />}
														{block.type === 'featured' && <Star className='h-5 w-5' />}
														{block.type === 'collection' && <Grid className='h-5 w-5' />}
														{block.type === 'banner' && <Image className='h-5 w-5' />}
														{block.type === 'products' && (
															<ShoppingBag className='h-5 w-5' />
														)}
														{block.type === 'categories' && <Tag className='h-5 w-5' />}
														{block.type === 'text' && <FileText className='h-5 w-5' />}
														{block.type === 'testimonials' && (
															<MessageSquare className='h-5 w-5' />
														)}
													</div>
													<div className='mr-3'>
														<h3
															className={`text-base font-medium ${
																block.enabled ? 'text-gray-900' : 'text-gray-500'
															}`}
														>
															{block.title}
														</h3>
														<p className='text-sm text-gray-500'>
															{getBlockTypeLabel(block.type)}
															{block.layout && ` • ${getLayoutLabel(block.layout)}`}
														</p>
													</div>
												</div>

												<div className='flex items-center space-x-2 space-x-reverse'>
													<button
														onClick={() => toggleBlockEnabled(block.id)}
														className={`p-1.5 rounded-md ${
															block.enabled
																? 'text-green-600 hover:bg-green-50'
																: 'text-gray-400 hover:bg-gray-100'
														}`}
														title={block.enabled ? 'تعطيل' : 'تفعيل'}
													>
														{block.enabled ? (
															<CheckCircle className='h-5 w-5' />
														) : (
															<XCircle className='h-5 w-5' />
														)}
													</button>

													<button
														onClick={() => moveBlock(block.id, 'up')}
														disabled={block.position === 1}
														className={`p-1.5 rounded-md ${
															block.position === 1
																? 'text-gray-300 cursor-not-allowed'
																: 'text-gray-500 hover:bg-gray-100'
														}`}
														title='تحريك لأعلى'
													>
														<ArrowUp className='h-5 w-5' />
													</button>

													<button
														onClick={() => moveBlock(block.id, 'down')}
														disabled={block.position === contentBlocks.length}
														className={`p-1.5 rounded-md ${
															block.position === contentBlocks.length
																? 'text-gray-300 cursor-not-allowed'
																: 'text-gray-500 hover:bg-gray-100'
														}`}
														title='تحريك لأسفل'
													>
														<ArrowDown className='h-5 w-5' />
													</button>

													<button
														onClick={() => editContentBlock(block)}
														className='p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md'
														title='تعديل'
													>
														<Edit className='h-5 w-5' />
													</button>

													<button
														onClick={() => deleteContentBlock(block.id)}
														className='p-1.5 text-red-600 hover:bg-red-50 rounded-md'
														title='حذف'
													>
														<Trash className='h-5 w-5' />
													</button>
												</div>
											</div>

											{/* عرض مختصر للمحتوى */}
											{block.enabled && (
												<div className='border-t border-gray-200 px-4 py-3 text-sm text-gray-500'>
													{(block.type === 'featured' ||
														block.type === 'collection' ||
														block.type === 'products') &&
														block.products && (
															<div>
																<span className='font-medium'>المنتجات: </span>
																{block.products.slice(0, 3).map((productId, index) => (
																	<span key={productId}>
																		{getProductNameById(productId)}
																		{index < Math.min(block.products!.length, 3) - 1
																			? '، '
																			: ''}
																	</span>
																))}
																{block.products.length > 3 &&
																	` و${block.products.length - 3} أخرى`}
															</div>
														)}

													{block.type === 'categories' && block.categories && (
														<div>
															<span className='font-medium'>الفئات: </span>
															{block.categories.slice(0, 3).map((categoryId, index) => (
																<span key={categoryId}>
																	{getCategoryNameById(categoryId)}
																	{index < Math.min(block.categories!.length, 3) - 1
																		? '، '
																		: ''}
																</span>
															))}
															{block.categories.length > 3 &&
																` و${block.categories.length - 3} أخرى`}
														</div>
													)}

													{(block.type === 'hero' || block.type === 'banner') &&
														block.buttonText && (
															<div>
																<span className='font-medium'>نص الزر: </span>
																{block.buttonText}
															</div>
														)}

													{block.type === 'text' && block.content && (
														<div className='line-clamp-2'>
															<span className='font-medium'>النص: </span>
															{block.content}
														</div>
													)}
												</div>
											)}
										</div>
									))}

								{contentBlocks.length === 0 && (
									<div className='text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-md'>
										<Layout className='h-12 w-12 text-gray-400 mx-auto mb-3' />
										<h3 className='text-lg font-medium text-gray-900'>لا توجد عناصر محتوى</h3>
										<p className='mt-1 text-gray-500 mb-4'>
											قم بإضافة عناصر لإنشاء الصفحة الرئيسية للمتجر
										</p>
										<button
											onClick={() => addContentBlock('hero')}
											className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
										>
											<Plus className='ml-1 h-4 w-4' />
											إضافة عنصر
										</button>
									</div>
								)}
							</div>
						</div>
					)}

					{/* شريط الإعلانات */}
					{activeTab === 'announcements' && (
						<div>
							<div className='flex justify-between items-center mb-6'>
								<div>
									<h2 className='text-xl font-medium text-gray-900'>شريط الإعلانات</h2>
									<p className='text-sm text-gray-500 mt-1'>
										يظهر شريط الإعلانات أعلى المتجر ويمكن استخدامه للإعلان عن العروض والمعلومات
										المهمة
									</p>
								</div>
								<button
									onClick={() => editAnnouncement()}
									className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
								>
									<Plus className='ml-1 h-4 w-4' />
									إضافة إعلان
								</button>
							</div>

							<div className='space-y-3'>
								{announcements.map((announcement) => (
									<div
										key={announcement.id}
										className={`border rounded-md ${
											announcement.enabled ? 'border-gray-200' : 'border-gray-200 bg-gray-50'
										}`}
									>
										<div className='flex items-center justify-between p-4'>
											<div className='flex items-center'>
												<div
													className='flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center text-white'
													style={{ backgroundColor: announcement.backgroundColor }}
												>
													<Bookmark className='h-5 w-5' />
												</div>
												<div className='mr-3'>
													<h3
														className={`text-base font-medium ${
															announcement.enabled ? 'text-gray-900' : 'text-gray-500'
														}`}
													>
														{announcement.text}
													</h3>
													<p className='text-sm text-gray-500'>
														{announcement.link ? (
															<span>رابط: {announcement.link}</span>
														) : (
															<span>بدون رابط</span>
														)}
														{(announcement.startDate || announcement.endDate) && (
															<span className='mr-3'>
																(
																{announcement.startDate
																	? formatDate(announcement.startDate)
																	: ''}
																{announcement.startDate && announcement.endDate
																	? ' - '
																	: ''}
																{announcement.endDate
																	? formatDate(announcement.endDate)
																	: ''}
																)
															</span>
														)}
													</p>
												</div>
											</div>

											<div className='flex items-center space-x-2 space-x-reverse'>
												<button
													onClick={() => toggleAnnouncementEnabled(announcement.id)}
													className={`p-1.5 rounded-md ${
														announcement.enabled
															? 'text-green-600 hover:bg-green-50'
															: 'text-gray-400 hover:bg-gray-100'
													}`}
													title={announcement.enabled ? 'تعطيل' : 'تفعيل'}
												>
													{announcement.enabled ? (
														<CheckCircle className='h-5 w-5' />
													) : (
														<XCircle className='h-5 w-5' />
													)}
												</button>

												<button
													onClick={() => editAnnouncement(announcement)}
													className='p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md'
													title='تعديل'
												>
													<Edit className='h-5 w-5' />
												</button>

												<button
													onClick={() => deleteAnnouncement(announcement.id)}
													className='p-1.5 text-red-600 hover:bg-red-50 rounded-md'
													title='حذف'
												>
													<Trash className='h-5 w-5' />
												</button>
											</div>
										</div>

										{/* معاينة الإعلان */}
										{announcement.enabled && (
											<div
												className='text-center py-3 border-t border-gray-200'
												style={{
													backgroundColor: announcement.backgroundColor,
													color: announcement.textColor,
												}}
											>
												<span className='text-sm font-medium'>{announcement.text}</span>
												{announcement.link && (
													<span className='underline mr-2 text-sm'>اضغط هنا</span>
												)}
											</div>
										)}
									</div>
								))}

								{announcements.length === 0 && (
									<div className='text-center py-12 bg-gray-50 border border-dashed border-gray-300 rounded-md'>
										<Bookmark className='h-12 w-12 text-gray-400 mx-auto mb-3' />
										<h3 className='text-lg font-medium text-gray-900'>لا توجد إعلانات</h3>
										<p className='mt-1 text-gray-500 mb-4'>
											قم بإضافة إعلان ليظهر في شريط الإعلانات أعلى المتجر
										</p>
										<button
											onClick={() => editAnnouncement()}
											className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
										>
											<Plus className='ml-1 h-4 w-4' />
											إضافة إعلان
										</button>
									</div>
								)}
							</div>
						</div>
					)}

					{/* قالب المتجر */}
					{activeTab === 'theme' && (
						<div>
							<div className='flex justify-between items-center mb-6'>
								<div>
									<h2 className='text-xl font-medium text-gray-900'>قالب المتجر</h2>
									<p className='text-sm text-gray-500 mt-1'>
										اختر تصميم المتجر وقم بتخصيصه حسب احتياجاتك
									</p>
								</div>
								<button
									onClick={() => {}}
									className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
								>
									<Upload className='ml-1 h-4 w-4' />
									تحميل قالب جديد
								</button>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{themes.map((theme) => (
									<div
										key={theme.id}
										className={`border rounded-md overflow-hidden ${
											theme.active
												? 'border-indigo-500 ring-2 ring-indigo-200'
												: 'border-gray-200 hover:border-gray-300'
										}`}
									>
										<div className='aspect-w-16 aspect-h-9 bg-gray-100'>
											{theme.screenshot ? (
												<img
													src={theme.screenshot}
													alt={theme.name}
													className='w-full h-full object-cover'
												/>
											) : (
												<div className='w-full h-full flex items-center justify-center bg-gray-200'>
													<Layout className='h-12 w-12 text-gray-400' />
												</div>
											)}
										</div>

										<div className='p-4'>
											<div className='flex justify-between items-center'>
												<h3 className='text-base font-medium text-gray-900'>{theme.name}</h3>
												{theme.active ? (
													<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
														نشط
													</span>
												) : (
													<button
														onClick={() => setActiveTheme(theme.id)}
														className='px-3 py-1 text-xs text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100'
													>
														تفعيل
													</button>
												)}
											</div>

											<div className='mt-4 flex justify-between'>
												<button
													className='text-sm text-indigo-600 hover:text-indigo-800'
													onClick={() => {}}
												>
													معاينة
												</button>

												<button
													className='text-sm text-indigo-600 hover:text-indigo-800'
													onClick={() => {}}
													disabled={!theme.active}
												>
													تخصيص
												</button>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* القائمة الرئيسية */}
					{activeTab === 'menu' && (
						<div className='text-center py-12'>
							<Menu className='h-12 w-12 text-gray-400 mx-auto mb-3' />
							<h3 className='text-lg font-medium text-gray-900'>قائمة الربط الرئيسية</h3>
							<p className='mt-1 text-gray-500 mb-4'>يمكنك تنظيم قائمة التنقل في المتجر من هنا</p>
							<Link
								href='/dashboard/ecommerce/publish/navigation'
								className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
							>
								<Edit className='ml-1 h-4 w-4' />
								تحرير القائمة
							</Link>
						</div>
					)}

					{/* تذييل الموقع */}
					{activeTab === 'footer' && (
						<div className='text-center py-12'>
							<Layers className='h-12 w-12 text-gray-400 mx-auto mb-3' />
							<h3 className='text-lg font-medium text-gray-900'>تذييل الموقع</h3>
							<p className='mt-1 text-gray-500 mb-4'>قم بتخصيص محتوى وروابط تذييل المتجر</p>
							<Link
								href='/dashboard/ecommerce/publish/footer'
								className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
							>
								<Edit className='ml-1 h-4 w-4' />
								تحرير التذييل
							</Link>
						</div>
					)}
				</div>
			</div>

			{/* تحذير SEO */}
			<div className='bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start'>
				<AlertCircle className='h-5 w-5 text-amber-500 mt-0.5 ml-3 flex-shrink-0' />
				<div>
					<h3 className='text-sm font-medium text-amber-800'>ملاحظة هامة</h3>
					<p className='mt-1 text-sm text-amber-700'>
						تأكد من تعبئة بيانات تحسين محركات البحث (SEO) لمتجرك. يساعد ذلك في تحسين ظهور متجرك في نتائج
						البحث وزيادة عدد الزوار.
					</p>
					<div className='mt-2'>
						<Link
							href='/dashboard/ecommerce/settings/seo'
							className='text-sm font-medium text-amber-800 hover:text-amber-900 underline'
						>
							إعدادات SEO
						</Link>
					</div>
				</div>
			</div>

			{/* نافذة تحرير كتلة المحتوى */}
			{showBlockEditor && selectedBlock && (
				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
						<div className='fixed inset-0 transition-opacity' onClick={() => setShowBlockEditor(false)}>
							<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
						</div>

						<div className='inline-block align-middle bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full'>
							<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								<div className='flex justify-between items-center mb-4'>
									<h3 className='text-lg font-medium text-gray-900'>
										{selectedBlock.id.includes('new') ? 'إضافة عنصر جديد' : 'تعديل عنصر'}
									</h3>
									<button
										onClick={() => setShowBlockEditor(false)}
										className='text-gray-400 hover:text-gray-500'
									>
										<X className='h-5 w-5' />
									</button>
								</div>

								<div className='space-y-4'>
									<div>
										<label
											htmlFor='blockTitle'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											العنوان
										</label>
										<input
											type='text'
											id='blockTitle'
											value={selectedBlock.title}
											onChange={(e) =>
												setSelectedBlock({ ...selectedBlock, title: e.target.value })
											}
											className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
											placeholder='أدخل عنوان العنصر'
										/>
									</div>

									{/* حقول إضافية حسب نوع الكتلة */}
									{(selectedBlock.type === 'hero' ||
										selectedBlock.type === 'banner' ||
										selectedBlock.type === 'collection') && (
										<div>
											<label
												htmlFor='blockSubtitle'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												العنوان الفرعي
											</label>
											<input
												type='text'
												id='blockSubtitle'
												value={selectedBlock.subtitle || ''}
												onChange={(e) =>
													setSelectedBlock({ ...selectedBlock, subtitle: e.target.value })
												}
												className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
												placeholder='أدخل العنوان الفرعي (اختياري)'
											/>
										</div>
									)}

									{(selectedBlock.type === 'hero' || selectedBlock.type === 'banner') && (
										<>
											<div>
												<label
													htmlFor='blockImage'
													className='block text-sm font-medium text-gray-700 mb-1'
												>
													الصورة
												</label>
												<div className='flex'>
													<input
														type='text'
														id='blockImage'
														value={selectedBlock.image || ''}
														onChange={(e) =>
															setSelectedBlock({
																...selectedBlock,
																image: e.target.value,
															})
														}
														className='block w-full rounded-r-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
														placeholder='رابط الصورة'
													/>
													<button
														type='button'
														className='inline-flex items-center px-4 py-2 border border-r-0 border-gray-300 shadow-sm text-sm font-medium rounded-l-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none'
													>
														<Upload className='ml-1 h-4 w-4' />
														اختيار
													</button>
												</div>
											</div>

											<div className='grid grid-cols-2 gap-4'>
												<div>
													<label
														htmlFor='blockButtonText'
														className='block text-sm font-medium text-gray-700 mb-1'
													>
														نص الزر
													</label>
													<input
														type='text'
														id='blockButtonText'
														value={selectedBlock.buttonText || ''}
														onChange={(e) =>
															setSelectedBlock({
																...selectedBlock,
																buttonText: e.target.value,
															})
														}
														className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
														placeholder='أدخل نص الزر (اختياري)'
													/>
												</div>

												<div>
													<label
														htmlFor='blockButtonLink'
														className='block text-sm font-medium text-gray-700 mb-1'
													>
														رابط الزر
													</label>
													<input
														type='text'
														id='blockButtonLink'
														value={selectedBlock.buttonLink || ''}
														onChange={(e) =>
															setSelectedBlock({
																...selectedBlock,
																buttonLink: e.target.value,
															})
														}
														className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
														placeholder='أدخل رابط الزر (اختياري)'
													/>
												</div>
											</div>
										</>
									)}

									{selectedBlock.type === 'text' && (
										<div>
											<label
												htmlFor='blockContent'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												المحتوى النصي
											</label>
											<textarea
												id='blockContent'
												value={selectedBlock.content || ''}
												onChange={(e) =>
													setSelectedBlock({ ...selectedBlock, content: e.target.value })
												}
												rows={4}
												className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
												placeholder='أدخل المحتوى النصي'
											/>
										</div>
									)}

									{(selectedBlock.type === 'featured' ||
										selectedBlock.type === 'products' ||
										selectedBlock.type === 'collection') && (
										<div>
											<div className='flex justify-between items-center mb-1'>
												<label className='block text-sm font-medium text-gray-700'>
													المنتجات
												</label>
												<button
													type='button'
													onClick={() => setShowProductSelector(true)}
													className='text-xs text-indigo-600 hover:text-indigo-800'
												>
													تغيير المنتجات
												</button>
											</div>
											<div className='border rounded-md border-gray-300 bg-gray-50 p-3 max-h-40 overflow-y-auto'>
												{selectedProducts.length > 0 ? (
													<div className='space-y-2'>
														{selectedProducts.map((productId) => {
															const product = products.find((p) => p.id === productId);
															return (
																<div
																	key={productId}
																	className='flex justify-between items-center bg-white p-2 rounded border border-gray-200'
																>
																	<div className='flex items-center'>
																		<div className='h-8 w-8 bg-gray-200 rounded overflow-hidden flex-shrink-0'>
																			{product?.mainImage ? (
																				<img
																					src={product.mainImage}
																					alt={product.name}
																					className='h-full w-full object-cover'
																				/>
																			) : (
																				<Package className='h-4 w-4 m-auto text-gray-400' />
																			)}
																		</div>
																		<span className='mr-2 text-sm'>
																			{getProductNameById(productId)}
																		</span>
																	</div>
																	<button
																		type='button'
																		onClick={() =>
																			setSelectedProducts(
																				selectedProducts.filter(
																					(id) => id !== productId
																				)
																			)
																		}
																		className='text-red-600 hover:text-red-800'
																	>
																		<X className='h-4 w-4' />
																	</button>
																</div>
															);
														})}
													</div>
												) : (
													<p className='text-center text-sm text-gray-500 py-2'>
														لم يتم تحديد أي منتجات
													</p>
												)}
											</div>
										</div>
									)}

									{selectedBlock.type === 'categories' && (
										<div>
											<div className='flex justify-between items-center mb-1'>
												<label className='block text-sm font-medium text-gray-700'>
													الفئات
												</label>
												<button
													type='button'
													onClick={() => setShowCategorySelector(true)}
													className='text-xs text-indigo-600 hover:text-indigo-800'
												>
													تغيير الفئات
												</button>
											</div>
											<div className='border rounded-md border-gray-300 bg-gray-50 p-3 max-h-40 overflow-y-auto'>
												{selectedCategories.length > 0 ? (
													<div className='space-y-2'>
														{selectedCategories.map((categoryId) => {
															const category = categories.find(
																(c) => c.id === categoryId
															);
															return (
																<div
																	key={categoryId}
																	className='flex justify-between items-center bg-white p-2 rounded border border-gray-200'
																>
																	<div className='flex items-center'>
																		<div className='h-8 w-8 bg-gray-200 rounded overflow-hidden flex-shrink-0'>
																			{category?.image ? (
																				<img
																					src={category.image}
																					alt={category.name}
																					className='h-full w-full object-cover'
																				/>
																			) : (
																				<Tag className='h-4 w-4 m-auto text-gray-400' />
																			)}
																		</div>
																		<span className='mr-2 text-sm'>
																			{getCategoryNameById(categoryId)}
																		</span>
																	</div>
																	<button
																		type='button'
																		onClick={() =>
																			setSelectedCategories(
																				selectedCategories.filter(
																					(id) => id !== categoryId
																				)
																			)
																		}
																		className='text-red-600 hover:text-red-800'
																	>
																		<X className='h-4 w-4' />
																	</button>
																</div>
															);
														})}
													</div>
												) : (
													<p className='text-center text-sm text-gray-500 py-2'>
														لم يتم تحديد أي فئات
													</p>
												)}
											</div>
										</div>
									)}

									{/* إعدادات التخطيط */}
									{(selectedBlock.type === 'featured' ||
										selectedBlock.type === 'collection' ||
										selectedBlock.type === 'categories' ||
										selectedBlock.type === 'testimonials') && (
										<div>
											<label
												htmlFor='blockLayout'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												التخطيط
											</label>
											<select
												id='blockLayout'
												value={selectedBlock.layout || 'default'}
												onChange={(e) =>
													setSelectedBlock({
														...selectedBlock,
														layout: e.target.value as any,
													})
												}
												className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
											>
												<option value='default'>افتراضي</option>
												<option value='grid'>شبكة</option>
												<option value='slider'>شريط تمرير</option>
												<option value='alternate'>متناوب</option>
											</select>
										</div>
									)}

									{/* إعدادات العرض */}
									<div>
										<div className='flex justify-between items-center mb-1'>
											<label className='block text-sm font-medium text-gray-700'>
												إعدادات العرض
											</label>
											<button
												type='button'
												onClick={() => {
													const settings = selectedBlock.settings || {};
													setSelectedBlock({
														...selectedBlock,
														settings: {
															...settings,
															showPrices: settings.showPrices !== false, // true بشكل افتراضي
															showDescription: !!settings.showDescription,
															fullWidth: !!settings.fullWidth,
														},
													});
												}}
												className='text-xs text-indigo-600 hover:text-indigo-800'
											>
												إعدادات افتراضية
											</button>
										</div>

										<div className='grid grid-cols-2 gap-4 mt-2'>
											{/* لون الخلفية */}
											<div>
												<label
													htmlFor='backgroundColor'
													className='block text-xs text-gray-500 mb-1'
												>
													لون الخلفية
												</label>
												<div className='flex'>
													<input
														type='color'
														id='backgroundColor'
														value={selectedBlock.settings?.backgroundColor || '#ffffff'}
														onChange={(e) =>
															setSelectedBlock({
																...selectedBlock,
																settings: {
																	...selectedBlock.settings,
																	backgroundColor: e.target.value,
																},
															})
														}
														className='h-9 w-9 rounded-l-md border border-gray-300 cursor-pointer'
													/>
													<input
														type='text'
														value={selectedBlock.settings?.backgroundColor || '#ffffff'}
														onChange={(e) =>
															setSelectedBlock({
																...selectedBlock,
																settings: {
																	...selectedBlock.settings,
																	backgroundColor: e.target.value,
																},
															})
														}
														className='flex-1 rounded-none rounded-l-none border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs'
														placeholder='#ffffff'
													/>
												</div>
											</div>

											{/* لون النص */}
											<div>
												<label htmlFor='textColor' className='block text-xs text-gray-500 mb-1'>
													لون النص
												</label>
												<div className='flex'>
													<input
														type='color'
														id='textColor'
														value={selectedBlock.settings?.textColor || '#333333'}
														onChange={(e) =>
															setSelectedBlock({
																...selectedBlock,
																settings: {
																	...selectedBlock.settings,
																	textColor: e.target.value,
																},
															})
														}
														className='h-9 w-9 rounded-l-md border border-gray-300 cursor-pointer'
													/>
													<input
														type='text'
														value={selectedBlock.settings?.textColor || '#333333'}
														onChange={(e) =>
															setSelectedBlock({
																...selectedBlock,
																settings: {
																	...selectedBlock.settings,
																	textColor: e.target.value,
																},
															})
														}
														className='flex-1 rounded-none rounded-l-none border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-xs'
														placeholder='#333333'
													/>
												</div>
											</div>
										</div>

										{/* خيارات إضافية */}
										{(selectedBlock.type === 'featured' ||
											selectedBlock.type === 'products' ||
											selectedBlock.type === 'collection' ||
											selectedBlock.type === 'categories') && (
											<div className='mt-3'>
												<label
													htmlFor='itemsPerRow'
													className='block text-xs text-gray-500 mb-1'
												>
													عدد العناصر في الصف
												</label>
												<select
													id='itemsPerRow'
													value={selectedBlock.settings?.itemsPerRow || 4}
													onChange={(e) =>
														setSelectedBlock({
															...selectedBlock,
															settings: {
																...selectedBlock.settings,
																itemsPerRow: parseInt(e.target.value),
															},
														})
													}
													className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
												>
													<option value='2'>2 عناصر</option>
													<option value='3'>3 عناصر</option>
													<option value='4'>4 عناصر</option>
													<option value='5'>5 عناصر</option>
													<option value='6'>6 عناصر</option>
												</select>
											</div>
										)}

										{(selectedBlock.type === 'hero' || selectedBlock.type === 'banner') && (
											<div className='mt-3'>
												<label
													htmlFor='aspectRatio'
													className='block text-xs text-gray-500 mb-1'
												>
													نسبة العرض إلى الارتفاع
												</label>
												<select
													id='aspectRatio'
													value={selectedBlock.settings?.aspectRatio || '16:9'}
													onChange={(e) =>
														setSelectedBlock({
															...selectedBlock,
															settings: {
																...selectedBlock.settings,
																aspectRatio: e.target.value,
															},
														})
													}
													className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
												>
													<option value='16:9'>16:9 (أفقي واسع)</option>
													<option value='4:3'>4:3 (أفقي قياسي)</option>
													<option value='1:1'>1:1 (مربع)</option>
													<option value='21:9'>21:9 (بانوراما)</option>
													<option value='2:3'>2:3 (عمودي)</option>
												</select>
											</div>
										)}

										<div className='mt-3 space-y-3'>
											{(selectedBlock.type === 'featured' ||
												selectedBlock.type === 'products' ||
												selectedBlock.type === 'collection') && (
												<>
													<div className='flex items-center'>
														<input
															id='showPrices'
															type='checkbox'
															checked={selectedBlock.settings?.showPrices !== false}
															onChange={(e) =>
																setSelectedBlock({
																	...selectedBlock,
																	settings: {
																		...selectedBlock.settings,
																		showPrices: e.target.checked,
																	},
																})
															}
															className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
														/>
														<label
															htmlFor='showPrices'
															className='mr-2 block text-sm text-gray-700'
														>
															إظهار الأسعار
														</label>
													</div>

													<div className='flex items-center'>
														<input
															id='showDescription'
															type='checkbox'
															checked={!!selectedBlock.settings?.showDescription}
															onChange={(e) =>
																setSelectedBlock({
																	...selectedBlock,
																	settings: {
																		...selectedBlock.settings,
																		showDescription: e.target.checked,
																	},
																})
															}
															className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
														/>
														<label
															htmlFor='showDescription'
															className='mr-2 block text-sm text-gray-700'
														>
															إظهار الوصف
														</label>
													</div>
												</>
											)}

											{(selectedBlock.type === 'hero' || selectedBlock.type === 'banner') && (
												<div className='flex items-center'>
													<input
														id='fullWidth'
														type='checkbox'
														checked={!!selectedBlock.settings?.fullWidth}
														onChange={(e) =>
															setSelectedBlock({
																...selectedBlock,
																settings: {
																	...selectedBlock.settings,
																	fullWidth: e.target.checked,
																},
															})
														}
														className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
													/>
													<label
														htmlFor='fullWidth'
														className='mr-2 block text-sm text-gray-700'
													>
														عرض كامل (بدون هوامش)
													</label>
												</div>
											)}
										</div>
									</div>

									<div className='flex items-center mt-2'>
										<input
											id='blockEnabled'
											type='checkbox'
											checked={selectedBlock.enabled}
											onChange={(e) =>
												setSelectedBlock({ ...selectedBlock, enabled: e.target.checked })
											}
											className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
										/>
										<label htmlFor='blockEnabled' className='mr-2 block text-sm text-gray-700'>
											تفعيل هذا العنصر
										</label>
									</div>
								</div>
							</div>

							<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
								<button
									type='button'
									onClick={saveContentBlock}
									className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
								>
									حفظ
								</button>
								<button
									type='button'
									onClick={() => setShowBlockEditor(false)}
									className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
								>
									إلغاء
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* نافذة منتقي المنتجات */}
			{showProductSelector && (
				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
						<div className='fixed inset-0 transition-opacity' onClick={() => setShowProductSelector(false)}>
							<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
						</div>

						<div className='inline-block align-middle bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full'>
							<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								<div className='flex justify-between items-center mb-4'>
									<h3 className='text-lg font-medium text-gray-900'>اختيار المنتجات</h3>
									<button
										onClick={() => setShowProductSelector(false)}
										className='text-gray-400 hover:text-gray-500'
									>
										<X className='h-5 w-5' />
									</button>
								</div>

								<div>
									<div className='mb-4'>
										<div className='relative'>
											<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
												<Search className='h-5 w-5 text-gray-400' />
											</div>
											<input
												type='text'
												value={productSearchTerm}
												onChange={(e) => setProductSearchTerm(e.target.value)}
												placeholder='بحث عن المنتجات...'
												className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
											/>
										</div>
									</div>

									<div className='border rounded-md border-gray-300 h-64 overflow-y-auto'>
										<table className='min-w-full divide-y divide-gray-200'>
											<thead className='bg-gray-50 sticky top-0'>
												<tr>
													<th
														scope='col'
														className='px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-12'
													>
														&nbsp;
													</th>
													<th
														scope='col'
														className='px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
													>
														المنتج
													</th>
													<th
														scope='col'
														className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
													>
														السعر
													</th>
													<th
														scope='col'
														className='px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
													>
														المخزون
													</th>
												</tr>
											</thead>
											<tbody className='bg-white divide-y divide-gray-200'>
												{filteredProducts
													.filter((product) => product.status === 'active')
													.map((product) => (
														<tr
															key={product.id}
															className={`hover:bg-gray-50 ${
																selectedProducts.includes(product.id)
																	? 'bg-indigo-50'
																	: ''
															}`}
														>
															<td className='px-3 py-3 whitespace-nowrap'>
																<input
																	type='checkbox'
																	checked={selectedProducts.includes(product.id)}
																	onChange={(e) => {
																		if (e.target.checked) {
																			setSelectedProducts([
																				...selectedProducts,
																				product.id,
																			]);
																		} else {
																			setSelectedProducts(
																				selectedProducts.filter(
																					(id) => id !== product.id
																				)
																			);
																		}
																	}}
																	className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
																/>
															</td>
															<td className='px-3 py-3 whitespace-nowrap'>
																<div className='flex items-center'>
																	<div className='flex-shrink-0 h-8 w-8 bg-gray-100 rounded-md'>
																		{product.mainImage ? (
																			<img
																				src={product.mainImage}
																				alt={product.name}
																				className='h-8 w-8 rounded-md object-cover'
																			/>
																		) : (
																			<div className='h-8 w-8 rounded-md flex items-center justify-center text-gray-400'>
																				<Package className='h-4 w-4' />
																			</div>
																		)}
																	</div>
																	<div className='mr-3'>
																		<div className='text-sm font-medium text-gray-900'>
																			{product.name}
																		</div>
																		<div className='text-xs text-gray-500'>
																			{product.slug}
																		</div>
																	</div>
																</div>
															</td>
															<td className='px-3 py-3 whitespace-nowrap text-left'>
																<div className='text-sm font-medium text-gray-900'>
																	{formatAmount(product.price)}
																</div>
																{product.compareAtPrice && (
																	<div className='text-xs text-gray-500 line-through'>
																		{formatAmount(product.compareAtPrice)}
																	</div>
																)}
															</td>
															<td className='px-3 py-3 whitespace-nowrap text-center'>
																<span
																	className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																		product.featured
																			? 'bg-indigo-100 text-indigo-800'
																			: 'bg-green-100 text-green-800'
																	}`}
																>
																	{product.featured ? 'مميز' : 'متاح'}
																</span>
															</td>
														</tr>
													))}

												{filteredProducts.filter((product) => product.status === 'active')
													.length === 0 && (
													<tr>
														<td
															colSpan={4}
															className='px-3 py-4 text-center text-sm text-gray-500'
														>
															لا توجد منتجات متاحة
														</td>
													</tr>
												)}
											</tbody>
										</table>
									</div>

									<div className='mt-3 flex justify-between text-sm'>
										<span className='text-gray-500'>تم تحديد {selectedProducts.length} منتج</span>
										<button
											type='button'
											onClick={() => setSelectedProducts([])}
											className='text-indigo-600 hover:text-indigo-800'
										>
											إلغاء التحديد
										</button>
									</div>
								</div>
							</div>

							<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
								<button
									type='button'
									onClick={() => {
										if (selectedBlock) {
											setSelectedBlock({
												...selectedBlock,
												products: selectedProducts,
											});
										}
										setShowProductSelector(false);
									}}
									className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
								>
									تأكيد
								</button>
								<button
									type='button'
									onClick={() => setShowProductSelector(false)}
									className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
								>
									إلغاء
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* نافذة منتقي الفئات */}
			{showCategorySelector && (
				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
						<div
							className='fixed inset-0 transition-opacity'
							onClick={() => setShowCategorySelector(false)}
						>
							<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
						</div>

						<div className='inline-block align-middle bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full'>
							<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								<div className='flex justify-between items-center mb-4'>
									<h3 className='text-lg font-medium text-gray-900'>اختيار الفئات</h3>
									<button
										onClick={() => setShowCategorySelector(false)}
										className='text-gray-400 hover:text-gray-500'
									>
										<X className='h-5 w-5' />
									</button>
								</div>

								<div>
									<div className='mb-4'>
										<div className='relative'>
											<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
												<Search className='h-5 w-5 text-gray-400' />
											</div>
											<input
												type='text'
												value={categorySearchTerm}
												onChange={(e) => setCategorySearchTerm(e.target.value)}
												placeholder='بحث عن الفئات...'
												className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
											/>
										</div>
									</div>

									<div className='border rounded-md border-gray-300 h-64 overflow-y-auto'>
										<table className='min-w-full divide-y divide-gray-200'>
											<thead className='bg-gray-50 sticky top-0'>
												<tr>
													<th
														scope='col'
														className='px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-12'
													>
														&nbsp;
													</th>
													<th
														scope='col'
														className='px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
													>
														الفئة
													</th>
													<th
														scope='col'
														className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
													>
														المنتجات
													</th>
												</tr>
											</thead>
											<tbody className='bg-white divide-y divide-gray-200'>
												{filteredCategories.map((category) => (
													<tr
														key={category.id}
														className={`hover:bg-gray-50 ${
															selectedCategories.includes(category.id)
																? 'bg-indigo-50'
																: ''
														}`}
													>
														<td className='px-3 py-3 whitespace-nowrap'>
															<input
																type='checkbox'
																checked={selectedCategories.includes(category.id)}
																onChange={(e) => {
																	if (e.target.checked) {
																		setSelectedCategories([
																			...selectedCategories,
																			category.id,
																		]);
																	} else {
																		setSelectedCategories(
																			selectedCategories.filter(
																				(id) => id !== category.id
																			)
																		);
																	}
																}}
																className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
															/>
														</td>
														<td className='px-3 py-3 whitespace-nowrap'>
															<div className='flex items-center'>
																<div className='flex-shrink-0 h-8 w-8 bg-gray-100 rounded-md'>
																	{category.image ? (
																		<img
																			src={category.image}
																			alt={category.name}
																			className='h-8 w-8 rounded-md object-cover'
																		/>
																	) : (
																		<div className='h-8 w-8 rounded-md flex items-center justify-center text-gray-400'>
																			<Tag className='h-4 w-4' />
																		</div>
																	)}
																</div>
																<div className='mr-3'>
																	<div className='text-sm font-medium text-gray-900'>
																		{category.name}
																	</div>
																	<div className='text-xs text-gray-500'>
																		{category.slug}
																	</div>
																</div>
															</div>
														</td>
														<td className='px-3 py-3 whitespace-nowrap text-sm text-left'>
															<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
																{category.productsCount} منتج
															</span>
														</td>
													</tr>
												))}

												{filteredCategories.length === 0 && (
													<tr>
														<td
															colSpan={3}
															className='px-3 py-4 text-center text-sm text-gray-500'
														>
															لا توجد فئات متاحة
														</td>
													</tr>
												)}
											</tbody>
										</table>
									</div>

									<div className='mt-3 flex justify-between text-sm'>
										<span className='text-gray-500'>تم تحديد {selectedCategories.length} فئة</span>
										<button
											type='button'
											onClick={() => setSelectedCategories([])}
											className='text-indigo-600 hover:text-indigo-800'
										>
											إلغاء التحديد
										</button>
									</div>
								</div>
							</div>

							<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
								<button
									type='button'
									onClick={() => {
										if (selectedBlock) {
											setSelectedBlock({
												...selectedBlock,
												categories: selectedCategories,
											});
										}
										setShowCategorySelector(false);
									}}
									className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
								>
									تأكيد
								</button>
								<button
									type='button'
									onClick={() => setShowCategorySelector(false)}
									className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
								>
									إلغاء
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* نافذة محرر الإعلان */}
			{showAnnouncementEditor && selectedAnnouncement && (
				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
						<div
							className='fixed inset-0 transition-opacity'
							onClick={() => setShowAnnouncementEditor(false)}
						>
							<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
						</div>

						<div className='inline-block align-middle bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
							<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								<div className='flex justify-between items-center mb-4'>
									<h3 className='text-lg font-medium text-gray-900'>
										{selectedAnnouncement.id.includes('new') ? 'إضافة إعلان جديد' : 'تعديل الإعلان'}
									</h3>
									<button
										onClick={() => setShowAnnouncementEditor(false)}
										className='text-gray-400 hover:text-gray-500'
									>
										<X className='h-5 w-5' />
									</button>
								</div>

								<div className='space-y-4'>
									<div>
										<label
											htmlFor='announcementText'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											نص الإعلان <span className='text-red-500'>*</span>
										</label>
										<input
											type='text'
											id='announcementText'
											value={selectedAnnouncement.text}
											onChange={(e) =>
												setSelectedAnnouncement({
													...selectedAnnouncement,
													text: e.target.value,
												})
											}
											className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
											placeholder='أدخل نص الإعلان'
											required
										/>
									</div>

									<div>
										<label
											htmlFor='announcementLink'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											الرابط (اختياري)
										</label>
										<input
											type='text'
											id='announcementLink'
											value={selectedAnnouncement.link || ''}
											onChange={(e) =>
												setSelectedAnnouncement({
													...selectedAnnouncement,
													link: e.target.value,
												})
											}
											className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
											placeholder='أدخل الرابط'
										/>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<label
												htmlFor='backgroundColor'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												لون الخلفية
											</label>
											<div className='flex'>
												<input
													type='color'
													id='backgroundColor'
													value={selectedAnnouncement.backgroundColor}
													onChange={(e) =>
														setSelectedAnnouncement({
															...selectedAnnouncement,
															backgroundColor: e.target.value,
														})
													}
													className='h-10 w-10 rounded-l-md border border-gray-300 cursor-pointer'
												/>
												<input
													type='text'
													value={selectedAnnouncement.backgroundColor}
													onChange={(e) =>
														setSelectedAnnouncement({
															...selectedAnnouncement,
															backgroundColor: e.target.value,
														})
													}
													className='flex-1 rounded-none rounded-l-none border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
													placeholder='#000000'
												/>
											</div>
										</div>

										<div>
											<label
												htmlFor='textColor'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												لون النص
											</label>
											<div className='flex'>
												<input
													type='color'
													id='textColor'
													value={selectedAnnouncement.textColor}
													onChange={(e) =>
														setSelectedAnnouncement({
															...selectedAnnouncement,
															textColor: e.target.value,
														})
													}
													className='h-10 w-10 rounded-l-md border border-gray-300 cursor-pointer'
												/>
												<input
													type='text'
													value={selectedAnnouncement.textColor}
													onChange={(e) =>
														setSelectedAnnouncement({
															...selectedAnnouncement,
															textColor: e.target.value,
														})
													}
													className='flex-1 rounded-none rounded-l-none border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
													placeholder='#ffffff'
												/>
											</div>
										</div>
									</div>

									<div className='grid grid-cols-2 gap-4'>
										<div>
											<label
												htmlFor='startDate'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												تاريخ البدء (اختياري)
											</label>
											<input
												type='date'
												id='startDate'
												value={selectedAnnouncement.startDate || ''}
												onChange={(e) =>
													setSelectedAnnouncement({
														...selectedAnnouncement,
														startDate: e.target.value,
													})
												}
												className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
											/>
										</div>

										<div>
											<label
												htmlFor='endDate'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												تاريخ الانتهاء (اختياري)
											</label>
											<input
												type='date'
												id='endDate'
												value={selectedAnnouncement.endDate || ''}
												onChange={(e) =>
													setSelectedAnnouncement({
														...selectedAnnouncement,
														endDate: e.target.value,
													})
												}
												className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
											/>
										</div>
									</div>

									{/* معاينة الإعلان */}
									<div>
										<label className='block text-sm font-medium text-gray-700 mb-1'>معاينة</label>
										<div
											className='text-center py-3 px-4 rounded border border-gray-300'
											style={{
												backgroundColor: selectedAnnouncement.backgroundColor,
												color: selectedAnnouncement.textColor,
											}}
										>
											<span className='text-sm font-medium'>{selectedAnnouncement.text}</span>
											{selectedAnnouncement.link && (
												<span className='underline mr-2 text-sm'>اضغط هنا</span>
											)}
										</div>
									</div>

									<div className='flex items-center mt-2'>
										<input
											id='announcementEnabled'
											type='checkbox'
											checked={selectedAnnouncement.enabled}
											onChange={(e) =>
												setSelectedAnnouncement({
													...selectedAnnouncement,
													enabled: e.target.checked,
												})
											}
											className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
										/>
										<label
											htmlFor='announcementEnabled'
											className='mr-2 block text-sm text-gray-700'
										>
											تفعيل هذا الإعلان
										</label>
									</div>
								</div>
							</div>

							<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
								<button
									type='button'
									onClick={saveAnnouncement}
									className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
								>
									حفظ
								</button>
								<button
									type='button'
									onClick={() => setShowAnnouncementEditor(false)}
									className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
								>
									إلغاء
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

// مكون النجمة (Star) المستخدم في أيقونات المنتجات المميزة
function Star(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg {...props} fill='none' viewBox='0 0 24 24' stroke='currentColor' xmlns='http://www.w3.org/2000/svg'>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				strokeWidth={2}
				d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
			/>
		</svg>
	);
}

// المتغيرات المساعدة - الحصول على نص نوع الكتلة
function getBlockTypeLabel(type: string): string {
	switch (type) {
		case 'hero':
			return 'قسم رئيسي';
		case 'featured':
			return 'منتجات مميزة';
		case 'collection':
			return 'مجموعة منتجات';
		case 'banner':
			return 'لافتة إعلانية';
		case 'products':
			return 'منتجات';
		case 'categories':
			return 'تصنيفات';
		case 'text':
			return 'قسم نصي';
		case 'testimonials':
			return 'آراء العملاء';
		default:
			return type;
	}
}

// المتغيرات المساعدة - الحصول على نص نمط العرض
function getLayoutLabel(layout: string): string {
	switch (layout) {
		case 'default':
			return 'افتراضي';
		case 'grid':
			return 'شبكة';
		case 'slider':
			return 'شريط تمرير';
		case 'alternate':
			return 'متناوب';
		default:
			return layout;
	}
}
