'use client';

import {
	AlertCircle,
	ArrowDown,
	ArrowLeft,
	ArrowRight,
	ChevronDown,
	Copy,
	DollarSign,
	Edit,
	ExternalLink,
	Eye,
	Grid,
	List,
	MoreHorizontal,
	Package,
	Plus,
	Search,
	Settings,
	ShoppingBag,
	Tag,
	Trash,
	Upload,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Product {
	id: string;
	name: string;
	sku: string;
	slug: string;
	description: string;
	price: number;
	compareAtPrice?: number;
	costPrice?: number;
	status: 'active' | 'draft' | 'archived';
	inventory: {
		quantity: number;
		lowStockThreshold?: number;
		sku: string;
		barcode?: string;
		trackInventory: boolean;
	};
	categories: string[];
	tags: string[];
	images: string[];
	mainImage: string;
	publishedAt?: string;
	featured: boolean;
	options?: {
		name: string;
		values: string[];
	}[];
	variants?: {
		id: string;
		sku: string;
		price: number;
		compareAtPrice?: number;
		inventory: number;
		attributes: {
			name: string;
			value: string;
		}[];
	}[];
	seo?: {
		title?: string;
		description?: string;
		keywords?: string[];
	};
	createdAt: string;
	updatedAt: string;
}

interface ProductStats {
	totalProducts: number;
	activeProducts: number;
	draftProducts: number;
	archivedProducts: number;
	lowStockProducts: number;
	outOfStockProducts: number;
	totalValue: number;
}

export default function ProductsPage() {
	const [products, setProducts] = useState<Product[]>([]);
	const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
	const [stats, setStats] = useState<ProductStats | null>(null);

	// حالة الفلترة
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [inventoryFilter, setInventoryFilter] = useState('all');
	const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	// حالة غلق/فتح خيارات متقدمة
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [productToDelete, setProductToDelete] = useState<Product | null>(null);
	const [categories, setCategories] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState<'date' | 'name' | 'price' | 'inventory'>('date');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// بيانات تجريبية للمنتجات
			const mockProducts: Product[] = [
				{
					id: 'prod-001',
					name: 'ثوب كلاسيكي أبيض',
					sku: 'THB-W-001',
					slug: 'classic-white-thobe',
					description: 'ثوب رجالي كلاسيكي باللون الأبيض، قماش قطن 100%، مناسب لجميع المناسبات',
					price: 350.0,
					compareAtPrice: 400.0,
					costPrice: 200.0,
					status: 'active',
					inventory: {
						quantity: 45,
						lowStockThreshold: 10,
						sku: 'THB-W-001',
						barcode: '6291041500213',
						trackInventory: true,
					},
					categories: ['ثياب رجالية', 'ملابس رسمية'],
					tags: ['أبيض', 'قطن', 'عروض'],
					images: [
						'/images/products/thobe-white-1.jpg',
						'/images/products/thobe-white-2.jpg',
						'/images/products/thobe-white-3.jpg',
					],
					mainImage: '/images/products/thobe-white-1.jpg',
					publishedAt: '2023-05-15T08:00:00',
					featured: true,
					options: [
						{
							name: 'المقاس',
							values: ['52', '54', '56', '58', '60'],
						},
						{
							name: 'الطول',
							values: ['قصير', 'متوسط', 'طويل'],
						},
					],
					variants: [
						{
							id: 'var-001',
							sku: 'THB-W-001-52-M',
							price: 350.0,
							compareAtPrice: 400.0,
							inventory: 15,
							attributes: [
								{ name: 'المقاس', value: '52' },
								{ name: 'الطول', value: 'متوسط' },
							],
						},
						{
							id: 'var-002',
							sku: 'THB-W-001-54-M',
							price: 350.0,
							compareAtPrice: 400.0,
							inventory: 12,
							attributes: [
								{ name: 'المقاس', value: '54' },
								{ name: 'الطول', value: 'متوسط' },
							],
						},
						{
							id: 'var-003',
							sku: 'THB-W-001-56-M',
							price: 350.0,
							compareAtPrice: 400.0,
							inventory: 8,
							attributes: [
								{ name: 'المقاس', value: '56' },
								{ name: 'الطول', value: 'متوسط' },
							],
						},
					],
					seo: {
						title: 'ثوب كلاسيكي أبيض | أناقتي للأزياء',
						description:
							'ثوب رجالي كلاسيكي باللون الأبيض، قماش قطن 100%، مناسب لجميع المناسبات. جودة عالية وتصميم أنيق.',
						keywords: ['ثوب', 'ثوب أبيض', 'ثوب رجالي', 'ملابس رجالية', 'أناقتي'],
					},
					createdAt: '2023-05-10T14:30:00',
					updatedAt: '2023-09-01T16:45:00',
				},
				{
					id: 'prod-002',
					name: 'بشت شتوي بني',
					sku: 'BST-B-002',
					slug: 'winter-brown-bisht',
					description: 'بشت شتوي فاخر بلون بني كلاسيكي، مناسب للمناسبات الرسمية والأعياد',
					price: 1200.0,
					costPrice: 850.0,
					status: 'active',
					inventory: {
						quantity: 18,
						lowStockThreshold: 5,
						sku: 'BST-B-002',
						barcode: '6291041500220',
						trackInventory: true,
					},
					categories: ['بشوت', 'ملابس رسمية'],
					tags: ['بني', 'شتوي', 'فاخر'],
					images: ['/images/products/bisht-brown-1.jpg', '/images/products/bisht-brown-2.jpg'],
					mainImage: '/images/products/bisht-brown-1.jpg',
					publishedAt: '2023-06-20T10:15:00',
					featured: true,
					options: [
						{
							name: 'المقاس',
							values: ['54', '56', '58', '60'],
						},
					],
					variants: [
						{
							id: 'var-004',
							sku: 'BST-B-002-54',
							price: 1200.0,
							inventory: 5,
							attributes: [{ name: 'المقاس', value: '54' }],
						},
						{
							id: 'var-005',
							sku: 'BST-B-002-56',
							price: 1200.0,
							inventory: 6,
							attributes: [{ name: 'المقاس', value: '56' }],
						},
						{
							id: 'var-006',
							sku: 'BST-B-002-58',
							price: 1200.0,
							inventory: 4,
							attributes: [{ name: 'المقاس', value: '58' }],
						},
						{
							id: 'var-007',
							sku: 'BST-B-002-60',
							price: 1200.0,
							inventory: 3,
							attributes: [{ name: 'المقاس', value: '60' }],
						},
					],
					seo: {
						title: 'بشت شتوي بني فاخر | أناقتي للأزياء',
						description:
							'بشت شتوي فاخر بلون بني كلاسيكي، مناسب للمناسبات الرسمية والأعياد. خامة عالية الجودة وتصميم أنيق.',
						keywords: ['بشت', 'بشت بني', 'بشت شتوي', 'ملابس رجالية', 'أناقتي'],
					},
					createdAt: '2023-06-15T12:30:00',
					updatedAt: '2023-06-20T10:15:00',
				},
				{
					id: 'prod-003',
					name: 'غترة بيضاء فاخرة',
					sku: 'GTR-W-003',
					slug: 'premium-white-ghutra',
					description: 'غترة بيضاء فاخرة من القطن المصري، خفيفة الوزن ومريحة للاستخدام اليومي',
					price: 120.0,
					costPrice: 70.0,
					status: 'active',
					inventory: {
						quantity: 180,
						lowStockThreshold: 20,
						sku: 'GTR-W-003',
						barcode: '6291041500237',
						trackInventory: true,
					},
					categories: ['غتر وشماغات', 'إكسسوارات'],
					tags: ['أبيض', 'قطن', 'يومي'],
					images: ['/images/products/ghutra-white-1.jpg', '/images/products/ghutra-white-2.jpg'],
					mainImage: '/images/products/ghutra-white-1.jpg',
					publishedAt: '2023-07-05T09:30:00',
					featured: false,
					seo: {
						title: 'غترة بيضاء فاخرة من القطن المصري | أناقتي للأزياء',
						description:
							'غترة بيضاء فاخرة من القطن المصري، خفيفة الوزن ومريحة للاستخدام اليومي. خامة عالية الجودة.',
						keywords: ['غترة', 'غترة بيضاء', 'قطن مصري', 'إكسسوارات رجالية', 'أناقتي'],
					},
					createdAt: '2023-07-01T11:20:00',
					updatedAt: '2023-07-05T09:30:00',
				},
				{
					id: 'prod-004',
					name: 'عقال أسود كلاسيكي',
					sku: 'EQA-B-004',
					slug: 'classic-black-eqal',
					description: 'عقال أسود كلاسيكي، مصنوع يدوياً بجودة عالية، مناسب للاستخدام اليومي والمناسبات',
					price: 85.0,
					costPrice: 45.0,
					status: 'active',
					inventory: {
						quantity: 120,
						lowStockThreshold: 15,
						sku: 'EQA-B-004',
						barcode: '6291041500244',
						trackInventory: true,
					},
					categories: ['عقالات', 'إكسسوارات'],
					tags: ['أسود', 'كلاسيكي'],
					images: ['/images/products/eqal-black-1.jpg', '/images/products/eqal-black-2.jpg'],
					mainImage: '/images/products/eqal-black-1.jpg',
					publishedAt: '2023-07-10T14:00:00',
					featured: false,
					seo: {
						title: 'عقال أسود كلاسيكي | أناقتي للأزياء',
						description: 'عقال أسود كلاسيكي، مصنوع يدوياً بجودة عالية، مناسب للاستخدام اليومي والمناسبات',
						keywords: ['عقال', 'عقال أسود', 'إكسسوارات رجالية', 'أناقتي'],
					},
					createdAt: '2023-07-08T16:15:00',
					updatedAt: '2023-07-10T14:00:00',
				},
				{
					id: 'prod-005',
					name: 'ثوب صيفي بيج',
					sku: 'THB-B-005',
					slug: 'summer-beige-thobe',
					description: 'ثوب صيفي بلون البيج الفاتح، خفيف الوزن ومريح للارتداء في الأيام الحارة',
					price: 270.0,
					compareAtPrice: 320.0,
					costPrice: 180.0,
					status: 'active',
					inventory: {
						quantity: 35,
						lowStockThreshold: 10,
						sku: 'THB-B-005',
						barcode: '6291041500251',
						trackInventory: true,
					},
					categories: ['ثياب رجالية', 'ملابس صيفية'],
					tags: ['بيج', 'صيفي', 'خفيف', 'عروض'],
					images: [
						'/images/products/thobe-beige-1.jpg',
						'/images/products/thobe-beige-2.jpg',
						'/images/products/thobe-beige-3.jpg',
					],
					mainImage: '/images/products/thobe-beige-1.jpg',
					publishedAt: '2023-08-01T11:45:00',
					featured: true,
					options: [
						{
							name: 'المقاس',
							values: ['52', '54', '56', '58', '60'],
						},
						{
							name: 'الطول',
							values: ['قصير', 'متوسط', 'طويل'],
						},
					],
					variants: [
						{
							id: 'var-008',
							sku: 'THB-B-005-54-M',
							price: 270.0,
							compareAtPrice: 320.0,
							inventory: 12,
							attributes: [
								{ name: 'المقاس', value: '54' },
								{ name: 'الطول', value: 'متوسط' },
							],
						},
						{
							id: 'var-009',
							sku: 'THB-B-005-56-M',
							price: 270.0,
							compareAtPrice: 320.0,
							inventory: 8,
							attributes: [
								{ name: 'المقاس', value: '56' },
								{ name: 'الطول', value: 'متوسط' },
							],
						},
						{
							id: 'var-010',
							sku: 'THB-B-005-58-M',
							price: 270.0,
							compareAtPrice: 320.0,
							inventory: 7,
							attributes: [
								{ name: 'المقاس', value: '58' },
								{ name: 'الطول', value: 'متوسط' },
							],
						},
					],
					seo: {
						title: 'ثوب صيفي بيج خفيف الوزن | أناقتي للأزياء',
						description:
							'ثوب صيفي بلون البيج الفاتح، خفيف الوزن ومريح للارتداء في الأيام الحارة. تصميم عصري وقماش عالي الجودة.',
						keywords: ['ثوب', 'ثوب صيفي', 'ثوب بيج', 'ملابس صيفية', 'أناقتي'],
					},
					createdAt: '2023-07-25T13:10:00',
					updatedAt: '2023-08-01T11:45:00',
				},
				{
					id: 'prod-006',
					name: 'شماغ أحمر فاخر',
					sku: 'SHM-R-006',
					slug: 'premium-red-shmagh',
					description: 'شماغ أحمر فاخر ذو خامة عالية الجودة، مناسب للمناسبات الرسمية والإطلالة المميزة',
					price: 220.0,
					costPrice: 150.0,
					status: 'active',
					inventory: {
						quantity: 60,
						lowStockThreshold: 15,
						sku: 'SHM-R-006',
						barcode: '6291041500268',
						trackInventory: true,
					},
					categories: ['غتر وشماغات', 'إكسسوارات'],
					tags: ['أحمر', 'فاخر', 'رسمي'],
					images: ['/images/products/shmagh-red-1.jpg', '/images/products/shmagh-red-2.jpg'],
					mainImage: '/images/products/shmagh-red-1.jpg',
					publishedAt: '2023-08-15T10:00:00',
					featured: true,
					seo: {
						title: 'شماغ أحمر فاخر | أناقتي للأزياء',
						description: 'شماغ أحمر فاخر ذو خامة عالية الجودة، مناسب للمناسبات الرسمية والإطلالة المميزة',
						keywords: ['شماغ', 'شماغ أحمر', 'شماغ فاخر', 'إكسسوارات رجالية', 'أناقتي'],
					},
					createdAt: '2023-08-10T15:30:00',
					updatedAt: '2023-08-15T10:00:00',
				},
				{
					id: 'prod-007',
					name: 'سروال قطني أسود',
					sku: 'PNT-B-007',
					slug: 'black-cotton-pants',
					description: 'سروال قطني أسود مريح، مناسب للارتداء مع الثوب أو الملابس اليومية',
					price: 110.0,
					costPrice: 65.0,
					status: 'active',
					inventory: {
						quantity: 75,
						lowStockThreshold: 15,
						sku: 'PNT-B-007',
						barcode: '6291041500275',
						trackInventory: true,
					},
					categories: ['سراويل', 'ملابس داخلية'],
					tags: ['أسود', 'قطن', 'يومي'],
					images: ['/images/products/pants-black-1.jpg', '/images/products/pants-black-2.jpg'],
					mainImage: '/images/products/pants-black-1.jpg',
					publishedAt: '2023-08-20T13:15:00',
					featured: false,
					options: [
						{
							name: 'المقاس',
							values: ['M', 'L', 'XL', 'XXL'],
						},
					],
					variants: [
						{
							id: 'var-011',
							sku: 'PNT-B-007-M',
							price: 110.0,
							inventory: 20,
							attributes: [{ name: 'المقاس', value: 'M' }],
						},
						{
							id: 'var-012',
							sku: 'PNT-B-007-L',
							price: 110.0,
							inventory: 25,
							attributes: [{ name: 'المقاس', value: 'L' }],
						},
						{
							id: 'var-013',
							sku: 'PNT-B-007-XL',
							price: 110.0,
							inventory: 20,
							attributes: [{ name: 'المقاس', value: 'XL' }],
						},
						{
							id: 'var-014',
							sku: 'PNT-B-007-XXL',
							price: 110.0,
							inventory: 10,
							attributes: [{ name: 'المقاس', value: 'XXL' }],
						},
					],
					seo: {
						title: 'سروال قطني أسود | أناقتي للأزياء',
						description: 'سروال قطني أسود مريح، مناسب للارتداء مع الثوب أو الملابس اليومية',
						keywords: ['سروال', 'سروال قطني', 'سروال أسود', 'ملابس داخلية', 'أناقتي'],
					},
					createdAt: '2023-08-18T11:40:00',
					updatedAt: '2023-08-20T13:15:00',
				},
				{
					id: 'prod-008',
					name: 'طاقية صوف شتوية',
					sku: 'CAP-W-008',
					slug: 'winter-wool-cap',
					description: 'طاقية شتوية من الصوف الناعم، مناسبة للحفاظ على الدفء خلال فصل الشتاء',
					price: 55.0,
					costPrice: 25.0,
					status: 'active',
					inventory: {
						quantity: 90,
						lowStockThreshold: 15,
						sku: 'CAP-W-008',
						barcode: '6291041500282',
						trackInventory: true,
					},
					categories: ['إكسسوارات', 'ملابس شتوية'],
					tags: ['صوف', 'شتوي', 'دافئ'],
					images: ['/images/products/cap-wool-1.jpg', '/images/products/cap-wool-2.jpg'],
					mainImage: '/images/products/cap-wool-1.jpg',
					publishedAt: '2023-09-01T14:30:00',
					featured: false,
					options: [
						{
							name: 'اللون',
							values: ['أسود', 'رمادي', 'بني'],
						},
					],
					variants: [
						{
							id: 'var-015',
							sku: 'CAP-W-008-BLK',
							price: 55.0,
							inventory: 30,
							attributes: [{ name: 'اللون', value: 'أسود' }],
						},
						{
							id: 'var-016',
							sku: 'CAP-W-008-GRY',
							price: 55.0,
							inventory: 30,
							attributes: [{ name: 'اللون', value: 'رمادي' }],
						},
						{
							id: 'var-017',
							sku: 'CAP-W-008-BRN',
							price: 55.0,
							inventory: 30,
							attributes: [{ name: 'اللون', value: 'بني' }],
						},
					],
					seo: {
						title: 'طاقية صوف شتوية | أناقتي للأزياء',
						description: 'طاقية شتوية من الصوف الناعم، مناسبة للحفاظ على الدفء خلال فصل الشتاء',
						keywords: ['طاقية', 'طاقية صوف', 'إكسسوارات شتوية', 'ملابس شتوية', 'أناقتي'],
					},
					createdAt: '2023-08-30T16:20:00',
					updatedAt: '2023-09-01T14:30:00',
				},
				{
					id: 'prod-009',
					name: 'ثوب مطرز فاخر',
					sku: 'THB-E-009',
					slug: 'premium-embroidered-thobe',
					description: 'ثوب مطرز فاخر بتطريز يدوي متقن، مناسب للمناسبات الخاصة والأعياد',
					price: 650.0,
					costPrice: 450.0,
					status: 'draft',
					inventory: {
						quantity: 15,
						lowStockThreshold: 5,
						sku: 'THB-E-009',
						barcode: '6291041500299',
						trackInventory: true,
					},
					categories: ['ثياب رجالية', 'ملابس رسمية', 'مطرزات'],
					tags: ['مطرز', 'فاخر', 'مناسبات', 'عيد'],
					images: [
						'/images/products/thobe-embroidered-1.jpg',
						'/images/products/thobe-embroidered-2.jpg',
						'/images/products/thobe-embroidered-3.jpg',
					],
					mainImage: '/images/products/thobe-embroidered-1.jpg',
					featured: true,
					options: [
						{
							name: 'المقاس',
							values: ['54', '56', '58'],
						},
						{
							name: 'لون التطريز',
							values: ['ذهبي', 'فضي'],
						},
					],
					variants: [
						{
							id: 'var-018',
							sku: 'THB-E-009-54-G',
							price: 650.0,
							inventory: 5,
							attributes: [
								{ name: 'المقاس', value: '54' },
								{ name: 'لون التطريز', value: 'ذهبي' },
							],
						},
						{
							id: 'var-019',
							sku: 'THB-E-009-56-G',
							price: 650.0,
							inventory: 5,
							attributes: [
								{ name: 'المقاس', value: '56' },
								{ name: 'لون التطريز', value: 'ذهبي' },
							],
						},
						{
							id: 'var-020',
							sku: 'THB-E-009-58-G',
							price: 650.0,
							inventory: 5,
							attributes: [
								{ name: 'المقاس', value: '58' },
								{ name: 'لون التطريز', value: 'ذهبي' },
							],
						},
					],
					seo: {
						title: 'ثوب مطرز فاخر للمناسبات | أناقتي للأزياء',
						description:
							'ثوب مطرز فاخر بتطريز يدوي متقن، مناسب للمناسبات الخاصة والأعياد. تصميم فريد وخامة ممتازة.',
						keywords: ['ثوب', 'ثوب مطرز', 'ثوب فاخر', 'ملابس مناسبات', 'أناقتي'],
					},
					createdAt: '2023-09-15T13:40:00',
					updatedAt: '2023-09-15T13:40:00',
				},
				{
					id: 'prod-010',
					name: 'بشت مطرز ذهبي',
					sku: 'BST-G-010',
					slug: 'gold-embroidered-bisht',
					description: 'بشت فاخر مطرز باللون الذهبي، مناسب للمناسبات الرسمية والأعياد والزفاف',
					price: 1800.0,
					costPrice: 1200.0,
					status: 'draft',
					inventory: {
						quantity: 8,
						lowStockThreshold: 3,
						sku: 'BST-G-010',
						barcode: '6291041500305',
						trackInventory: true,
					},
					categories: ['بشوت', 'ملابس رسمية', 'مطرزات'],
					tags: ['ذهبي', 'مطرز', 'فاخر', 'زفاف'],
					images: [
						'/images/products/bisht-gold-1.jpg',
						'/images/products/bisht-gold-2.jpg',
						'/images/products/bisht-gold-3.jpg',
					],
					mainImage: '/images/products/bisht-gold-1.jpg',
					featured: true,
					options: [
						{
							name: 'المقاس',
							values: ['54', '56', '58', '60'],
						},
					],
					variants: [
						{
							id: 'var-021',
							sku: 'BST-G-010-54',
							price: 1800.0,
							inventory: 2,
							attributes: [{ name: 'المقاس', value: '54' }],
						},
						{
							id: 'var-022',
							sku: 'BST-G-010-56',
							price: 1800.0,
							inventory: 2,
							attributes: [{ name: 'المقاس', value: '56' }],
						},
						{
							id: 'var-023',
							sku: 'BST-G-010-58',
							price: 1800.0,
							inventory: 2,
							attributes: [{ name: 'المقاس', value: '58' }],
						},
						{
							id: 'var-024',
							sku: 'BST-G-010-60',
							price: 1800.0,
							inventory: 2,
							attributes: [{ name: 'المقاس', value: '60' }],
						},
					],
					seo: {
						title: 'بشت مطرز ذهبي فاخر | أناقتي للأزياء',
						description:
							'بشت فاخر مطرز باللون الذهبي، مناسب للمناسبات الرسمية والأعياد والزفاف. جودة استثنائية وتصميم أنيق.',
						keywords: ['بشت', 'بشت مطرز', 'بشت ذهبي', 'ملابس زفاف', 'أناقتي'],
					},
					createdAt: '2023-09-20T11:15:00',
					updatedAt: '2023-09-20T11:15:00',
				},
				{
					id: 'prod-011',
					name: 'ثوب أسود كلاسيكي',
					sku: 'THB-B-011',
					slug: 'classic-black-thobe',
					description: 'ثوب رجالي أسود كلاسيكي، مناسب للمناسبات الرسمية والعمل',
					price: 370.0,
					costPrice: 210.0,
					status: 'active',
					inventory: {
						quantity: 0,
						lowStockThreshold: 10,
						sku: 'THB-B-011',
						barcode: '6291041500312',
						trackInventory: true,
					},
					categories: ['ثياب رجالية', 'ملابس رسمية'],
					tags: ['أسود', 'كلاسيكي', 'رسمي'],
					images: ['/images/products/thobe-black-1.jpg', '/images/products/thobe-black-2.jpg'],
					mainImage: '/images/products/thobe-black-1.jpg',
					publishedAt: '2023-08-25T09:45:00',
					featured: false,
					options: [
						{
							name: 'المقاس',
							values: ['52', '54', '56', '58', '60'],
						},
						{
							name: 'الطول',
							values: ['قصير', 'متوسط', 'طويل'],
						},
					],
					variants: [
						{
							id: 'var-025',
							sku: 'THB-B-011-52-M',
							price: 370.0,
							inventory: 0,
							attributes: [
								{ name: 'المقاس', value: '52' },
								{ name: 'الطول', value: 'متوسط' },
							],
						},
						{
							id: 'var-026',
							sku: 'THB-B-011-54-M',
							price: 370.0,
							inventory: 0,
							attributes: [
								{ name: 'المقاس', value: '54' },
								{ name: 'الطول', value: 'متوسط' },
							],
						},
						{
							id: 'var-027',
							sku: 'THB-B-011-56-M',
							price: 370.0,
							inventory: 0,
							attributes: [
								{ name: 'المقاس', value: '56' },
								{ name: 'الطول', value: 'متوسط' },
							],
						},
					],
					seo: {
						title: 'ثوب أسود كلاسيكي | أناقتي للأزياء',
						description:
							'ثوب رجالي أسود كلاسيكي، مناسب للمناسبات الرسمية والعمل. تصميم أنيق وخامة عالية الجودة.',
						keywords: ['ثوب', 'ثوب أسود', 'ثوب رسمي', 'ملابس رجالية', 'أناقتي'],
					},
					createdAt: '2023-08-20T14:30:00',
					updatedAt: '2023-08-25T09:45:00',
				},
				{
					id: 'prod-012',
					name: 'كبك فضي فاخر',
					sku: 'CFK-S-012',
					slug: 'premium-silver-cufflinks',
					description: 'كبك فضي فاخر، مطلي بالفضة الخالصة، مناسب للمناسبات الرسمية والإطلالة الأنيقة',
					price: 180.0,
					costPrice: 90.0,
					status: 'archived',
					inventory: {
						quantity: 25,
						lowStockThreshold: 5,
						sku: 'CFK-S-012',
						barcode: '6291041500329',
						trackInventory: true,
					},
					categories: ['إكسسوارات', 'كبابيك'],
					tags: ['فضي', 'فاخر', 'رسمي'],
					images: ['/images/products/cufflinks-silver-1.jpg', '/images/products/cufflinks-silver-2.jpg'],
					mainImage: '/images/products/cufflinks-silver-1.jpg',
					publishedAt: '2023-06-10T10:30:00',
					featured: false,
					seo: {
						title: 'كبك فضي فاخر | أناقتي للأزياء',
						description: 'كبك فضي فاخر، مطلي بالفضة الخالصة، مناسب للمناسبات الرسمية والإطلالة الأنيقة',
						keywords: ['كبك', 'كبك فضي', 'إكسسوارات رجالية', 'أناقتي'],
					},
					createdAt: '2023-06-05T13:20:00',
					updatedAt: '2023-06-10T10:30:00',
				},
			];

			// استخراج الفئات
			const categoriesList = new Set<string>();
			mockProducts.forEach((product) => {
				product.categories.forEach((category) => {
					categoriesList.add(category);
				});
			});

			// حساب الإحصائيات
			const totalProducts = mockProducts.length;
			const activeProducts = mockProducts.filter((p) => p.status === 'active').length;
			const draftProducts = mockProducts.filter((p) => p.status === 'draft').length;
			const archivedProducts = mockProducts.filter((p) => p.status === 'archived').length;

			const lowStockProducts = mockProducts.filter((p) => {
				return (
					p.inventory.quantity > 0 &&
					p.inventory.quantity <= (p.inventory.lowStockThreshold || 5) &&
					p.status === 'active'
				);
			}).length;

			const outOfStockProducts = mockProducts.filter(
				(p) => p.inventory.quantity === 0 && p.status === 'active'
			).length;

			const totalValue = mockProducts.reduce((sum, product) => {
				return sum + product.inventory.quantity * product.price;
			}, 0);

			const statsData: ProductStats = {
				totalProducts,
				activeProducts,
				draftProducts,
				archivedProducts,
				lowStockProducts,
				outOfStockProducts,
				totalValue,
			};

			setProducts(mockProducts);
			setFilteredProducts(mockProducts);
			setCategories(Array.from(categoriesList));
			setStats(statsData);

			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلترة
	useEffect(() => {
		let result = [...products];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(product) =>
					product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
					product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
					product.categories.some((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase())) ||
					product.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			result = result.filter((product) => product.status === statusFilter);
		}

		// تطبيق فلتر الفئة
		if (categoryFilter !== 'all') {
			result = result.filter((product) => product.categories.includes(categoryFilter));
		}

		// تطبيق فلتر المخزون
		if (inventoryFilter !== 'all') {
			if (inventoryFilter === 'in_stock') {
				result = result.filter((product) => product.inventory.quantity > 0);
			} else if (inventoryFilter === 'low_stock') {
				result = result.filter(
					(product) =>
						product.inventory.quantity > 0 &&
						product.inventory.quantity <= (product.inventory.lowStockThreshold || 5)
				);
			} else if (inventoryFilter === 'out_of_stock') {
				result = result.filter((product) => product.inventory.quantity === 0);
			}
		}

		// تطبيق الترتيب
		result.sort((a, b) => {
			if (sortBy === 'date') {
				return sortOrder === 'asc'
					? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
					: new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			} else if (sortBy === 'name') {
				return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
			} else if (sortBy === 'price') {
				return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
			} else {
				return sortOrder === 'asc'
					? a.inventory.quantity - b.inventory.quantity
					: b.inventory.quantity - a.inventory.quantity;
			}
		});

		setFilteredProducts(result);
		setCurrentPage(1); // إعادة تعيين الصفحة الحالية عند تغيير الفلاتر
	}, [searchTerm, statusFilter, categoryFilter, inventoryFilter, sortBy, sortOrder, products]);

	// توسيع/طي تفاصيل المنتج
	const toggleProductExpand = (productId: string) => {
		if (expandedProduct === productId) {
			setExpandedProduct(null);
		} else {
			setExpandedProduct(productId);
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

	// عرض حالة المنتج
	const renderProductStatusBadge = (status: string) => {
		switch (status) {
			case 'active':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						نشط
					</span>
				);
			case 'draft':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800'>
						مسودة
					</span>
				);
			case 'archived':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						مؤرشف
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

	// عرض حالة المخزون
	const renderInventoryStatus = (product: Product) => {
		const { quantity, lowStockThreshold = 5 } = product.inventory;

		if (quantity === 0) {
			return (
				<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
					نفدت الكمية
				</span>
			);
		} else if (quantity <= lowStockThreshold) {
			return (
				<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800'>
					كمية منخفضة
				</span>
			);
		} else {
			return (
				<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
					متوفر
				</span>
			);
		}
	};

	// تنسيق المبلغ
	const formatAmount = (amount: number) => {
		return new Intl.NumberFormat('ar-SA', {
			style: 'currency',
			currency: 'SAR',
		}).format(amount);
	};

	// فتح نافذة تأكيد الحذف
	const confirmDelete = (product: Product) => {
		setProductToDelete(product);
		setShowDeleteConfirm(true);
	};

	// حذف المنتج
	const deleteProduct = () => {
		if (!productToDelete) return;

		// محاكاة حذف المنتج
		const updatedProducts = products.filter((product) => product.id !== productToDelete.id);
		setProducts(updatedProducts);
		setFilteredProducts(updatedProducts);

		// تحديث الإحصائيات
		if (stats) {
			const newStats = { ...stats };
			newStats.totalProducts--;

			if (productToDelete.status === 'active') {
				newStats.activeProducts--;

				if (productToDelete.inventory.quantity === 0) {
					newStats.outOfStockProducts--;
				} else if (productToDelete.inventory.quantity <= (productToDelete.inventory.lowStockThreshold || 5)) {
					newStats.lowStockProducts--;
				}
			} else if (productToDelete.status === 'draft') {
				newStats.draftProducts--;
			} else if (productToDelete.status === 'archived') {
				newStats.archivedProducts--;
			}

			setStats(newStats);
		}

		setShowDeleteConfirm(false);
		setProductToDelete(null);
	};

	// حساب صفحات الترقيم
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

	// تغيير الصفحة
	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

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
						<ShoppingBag className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						المنتجات
					</h1>
					<p className='mt-1 text-gray-500'>إدارة منتجات المتجر الإلكتروني وإعدادات العرض</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/ecommerce/products/categories'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<Tag className='ml-1 h-4 w-4' />
						الفئات
					</Link>
					<Link
						href='/dashboard/ecommerce/products/inventory'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<Package className='ml-1 h-4 w-4' />
						المخزون
					</Link>
					<Link
						href='/dashboard/ecommerce/products/new'
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						<Plus className='ml-1 h-4 w-4' />
						منتج جديد
					</Link>
				</div>
			</div>

			{/* بطاقات الإحصائيات */}
			{stats && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>إجمالي المنتجات</p>
								<p className='text-2xl font-bold text-indigo-600'>{stats.totalProducts}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
								<Package className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 flex items-center text-xs text-gray-500'>
							<span>{stats.activeProducts} نشط</span>
							<span className='mx-1'>•</span>
							<span>{stats.draftProducts} مسودة</span>
							<span className='mx-1'>•</span>
							<span>{stats.archivedProducts} مؤرشف</span>
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>قيمة المخزون</p>
								<p className='text-2xl font-bold text-green-600'>{formatAmount(stats.totalValue)}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
								<DollarSign className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>إجمالي قيمة المنتجات المتوفرة</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>منتجات نفدت كميتها</p>
								<p className='text-2xl font-bold text-red-600'>{stats.outOfStockProducts}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-600'>
								<AlertCircle className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>بحاجة إلى إعادة تعبئة المخزون</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>مخزون منخفض</p>
								<p className='text-2xl font-bold text-amber-600'>{stats.lowStockProducts}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
								<ArrowDown className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>تحت الحد الأدنى للمخزون</div>
					</div>
				</div>
			)}

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
					{/* البحث */}
					<div className='relative md:col-span-2'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='بحث عن اسم المنتج، SKU، وصف...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						/>
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
							<option value='draft'>مسودة</option>
							<option value='archived'>مؤرشف</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر الفئة */}
					<div className='relative'>
						<select
							value={categoryFilter}
							onChange={(e) => setCategoryFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الفئات</option>
							{categories.map((category, index) => (
								<option key={index} value={category}>
									{category}
								</option>
							))}
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر المخزون */}
					<div className='relative'>
						<select
							value={inventoryFilter}
							onChange={(e) => setInventoryFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع حالات المخزون</option>
							<option value='in_stock'>متوفر</option>
							<option value='low_stock'>مخزون منخفض</option>
							<option value='out_of_stock'>نفدت الكمية</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>
				</div>

				<div className='mt-4 pt-3 border-t border-gray-200 flex flex-wrap justify-between items-center'>
					<div className='flex items-center mr-2 mb-2'>
						<span className='text-sm text-gray-500'>
							عرض {filteredProducts.length} من {products.length} منتج
						</span>

						{(searchTerm ||
							statusFilter !== 'all' ||
							categoryFilter !== 'all' ||
							inventoryFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setStatusFilter('all');
									setCategoryFilter('all');
									setInventoryFilter('all');
								}}
								className='mr-3 text-xs text-indigo-600 hover:text-indigo-800'
							>
								مسح الفلاتر
							</button>
						)}
					</div>

					<div className='flex items-center mb-2'>
						<div className='mr-3'>
							<select
								value={`${sortBy}_${sortOrder}`}
								onChange={(e) => {
									const [newSortBy, newSortOrder] = e.target.value.split('_') as [
										'date' | 'name' | 'price' | 'inventory',
										'asc' | 'desc'
									];
									setSortBy(newSortBy);
									setSortOrder(newSortOrder);
								}}
								className='text-sm border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
							>
								<option value='date_desc'>الأحدث أولاً</option>
								<option value='date_asc'>الأقدم أولاً</option>
								<option value='name_asc'>الاسم (أ-ي)</option>
								<option value='name_desc'>الاسم (ي-أ)</option>
								<option value='price_desc'>السعر (الأعلى أولاً)</option>
								<option value='price_asc'>السعر (الأقل أولاً)</option>
								<option value='inventory_desc'>المخزون (الأعلى أولاً)</option>
								<option value='inventory_asc'>المخزون (الأقل أولاً)</option>
							</select>
						</div>

						<div className='flex border border-gray-300 rounded-md overflow-hidden'>
							<button
								onClick={() => setViewMode('list')}
								className={`flex items-center justify-center p-1.5 ${
									viewMode === 'list'
										? 'bg-gray-100 text-gray-700'
										: 'bg-white text-gray-500 hover:bg-gray-50'
								}`}
								title='عرض القائمة'
							>
								<List className='h-5 w-5' />
							</button>
							<button
								onClick={() => setViewMode('grid')}
								className={`flex items-center justify-center p-1.5 ${
									viewMode === 'grid'
										? 'bg-gray-100 text-gray-700'
										: 'bg-white text-gray-500 hover:bg-gray-50'
								}`}
								title='عرض الشبكة'
							>
								<Grid className='h-5 w-5' />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* قائمة المنتجات */}
			{currentItems.length > 0 ? (
				<>
					{/* عرض قائمة */}
					{viewMode === 'list' && (
						<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead className='bg-gray-50'>
										<tr>
											<th
												scope='col'
												className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												المنتج
											</th>
											<th
												scope='col'
												className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												SKU
											</th>
											<th
												scope='col'
												className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												السعر
											</th>
											<th
												scope='col'
												className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												المخزون
											</th>
											<th
												scope='col'
												className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												الحالة
											</th>
											<th
												scope='col'
												className='px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
											>
												الإجراءات
											</th>
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										{currentItems.map((product) => (
											<tr key={product.id} className='hover:bg-gray-50'>
												<td className='px-4 py-4'>
													<div className='flex items-center'>
														<div className='flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md'>
															{product.mainImage ? (
																<img
																	src={product.mainImage}
																	alt={product.name}
																	className='h-10 w-10 rounded-md object-cover'
																/>
															) : (
																<div className='h-10 w-10 rounded-md flex items-center justify-center text-gray-400'>
																	<Package className='h-6 w-6' />
																</div>
															)}
														</div>
														<div className='mr-4'>
															<button
																onClick={() => toggleProductExpand(product.id)}
																className='text-sm font-medium text-gray-900 hover:text-indigo-600 focus:outline-none'
															>
																{product.name}
															</button>
															<div className='text-xs text-gray-500 mt-1'>
																{product.categories.map((cat, index) => (
																	<span key={index}>
																		{cat}
																		{index < product.categories.length - 1
																			? ' / '
																			: ''}
																	</span>
																))}
															</div>
														</div>
													</div>
												</td>
												<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500 font-mono'>
													{product.sku}
												</td>
												<td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-left'>
													<div className='text-gray-900'>{formatAmount(product.price)}</div>
													{product.compareAtPrice && (
														<div className='text-xs text-gray-500 line-through'>
															{formatAmount(product.compareAtPrice)}
														</div>
													)}
												</td>
												<td className='px-4 py-4 whitespace-nowrap text-center'>
													<div className='text-sm font-medium text-gray-900'>
														{product.inventory.quantity}
													</div>
													<div className='mt-1'>{renderInventoryStatus(product)}</div>
												</td>
												<td className='px-4 py-4 whitespace-nowrap'>
													{renderProductStatusBadge(product.status)}
												</td>
												<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
													<div className='flex items-center justify-center space-x-2 space-x-reverse'>
														<Link
															href={`/dashboard/ecommerce/products/${product.id}`}
															className='text-indigo-600 hover:text-indigo-900'
															title='عرض التفاصيل'
														>
															<Eye className='h-5 w-5' />
														</Link>
														<Link
															href={`/dashboard/ecommerce/products/${product.id}/edit`}
															className='text-amber-600 hover:text-amber-900'
															title='تعديل'
														>
															<Edit className='h-5 w-5' />
														</Link>
														<a
															href={`https://anaqati.com/products/${product.slug}`}
															target='_blank'
															rel='noopener noreferrer'
															className='text-blue-600 hover:text-blue-900'
															title='عرض في المتجر'
														>
															<ExternalLink className='h-5 w-5' />
														</a>
														<div className='relative group'>
															<button
																className='text-gray-500 hover:text-gray-700'
																title='المزيد من الخيارات'
															>
																<MoreHorizontal className='h-5 w-5' />
															</button>
															<div className='absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
																<Link
																	href={`/dashboard/ecommerce/products/${product.id}`}
																	className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
																>
																	<Eye className='inline ml-1 h-4 w-4' />
																	عرض التفاصيل
																</Link>
																<Link
																	href={`/dashboard/ecommerce/products/${product.id}/edit`}
																	className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
																>
																	<Edit className='inline ml-1 h-4 w-4' />
																	تعديل المنتج
																</Link>
																<Link
																	href={`/dashboard/ecommerce/products/${product.id}/duplicate`}
																	className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
																>
																	<Copy className='inline ml-1 h-4 w-4' />
																	نسخ المنتج
																</Link>
																<a
																	href={`https://anaqati.com/products/${product.slug}`}
																	target='_blank'
																	rel='noopener noreferrer'
																	className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
																>
																	<ExternalLink className='inline ml-1 h-4 w-4' />
																	عرض في المتجر
																</a>
																<button
																	className='block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50'
																	onClick={() => confirmDelete(product)}
																>
																	<Trash className='inline ml-1 h-4 w-4' />
																	حذف المنتج
																</button>
															</div>
														</div>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* تفاصيل المنتج الموسعة */}
							{expandedProduct && (
								<div className='border-t border-gray-200 bg-gray-50 p-4 animate-fadeIn'>
									{products
										.filter((p) => p.id === expandedProduct)
										.map((product) => (
											<div key={`details-${product.id}`}>
												<div className='flex justify-between items-center mb-4'>
													<h3 className='text-lg font-medium text-gray-900'>
														تفاصيل المنتج: {product.name}
													</h3>
													<button
														onClick={() => setExpandedProduct(null)}
														className='text-gray-400 hover:text-gray-500'
													>
														<X className='h-5 w-5' />
													</button>
												</div>

												<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
													<div>
														<h4 className='text-sm font-medium text-gray-500 mb-2'>
															معلومات أساسية
														</h4>
														<div className='bg-white p-3 rounded-md border border-gray-200'>
															<div className='flex justify-between mb-2'>
																<span className='text-sm text-gray-600'>الاسم:</span>
																<span className='text-sm font-medium text-gray-900'>
																	{product.name}
																</span>
															</div>
															<div className='flex justify-between mb-2'>
																<span className='text-sm text-gray-600'>SKU:</span>
																<span className='text-sm font-mono text-gray-900'>
																	{product.sku}
																</span>
															</div>
															<div className='flex justify-between mb-2'>
																<span className='text-sm text-gray-600'>الحالة:</span>
																<span>{renderProductStatusBadge(product.status)}</span>
															</div>
															<div className='flex justify-between mb-2'>
																<span className='text-sm text-gray-600'>
																	منتج مميز:
																</span>
																<span className='text-sm font-medium text-gray-900'>
																	{product.featured ? 'نعم' : 'لا'}
																</span>
															</div>
															<div className='flex justify-between'>
																<span className='text-sm text-gray-600'>
																	تاريخ الإنشاء:
																</span>
																<span className='text-sm text-gray-900'>
																	{formatDate(product.createdAt)}
																</span>
															</div>
														</div>
													</div>

													<div>
														<h4 className='text-sm font-medium text-gray-500 mb-2'>
															معلومات السعر والمخزون
														</h4>
														<div className='bg-white p-3 rounded-md border border-gray-200'>
															<div className='flex justify-between mb-2'>
																<span className='text-sm text-gray-600'>
																	سعر البيع:
																</span>
																<span className='text-sm font-medium text-gray-900'>
																	{formatAmount(product.price)}
																</span>
															</div>
															{product.compareAtPrice && (
																<div className='flex justify-between mb-2'>
																	<span className='text-sm text-gray-600'>
																		السعر الأصلي:
																	</span>
																	<span className='text-sm line-through text-gray-500'>
																		{formatAmount(product.compareAtPrice)}
																	</span>
																</div>
															)}
															{product.costPrice && (
																<div className='flex justify-between mb-2'>
																	<span className='text-sm text-gray-600'>
																		تكلفة المنتج:
																	</span>
																	<span className='text-sm text-gray-900'>
																		{formatAmount(product.costPrice)}
																	</span>
																</div>
															)}
															<div className='flex justify-between mb-2'>
																<span className='text-sm text-gray-600'>
																	الكمية المتوفرة:
																</span>
																<span className='text-sm font-medium text-gray-900'>
																	{product.inventory.quantity}
																</span>
															</div>
															<div className='flex justify-between'>
																<span className='text-sm text-gray-600'>
																	حالة المخزون:
																</span>
																<span>{renderInventoryStatus(product)}</span>
															</div>
														</div>
													</div>

													<div>
														<h4 className='text-sm font-medium text-gray-500 mb-2'>
															التصنيفات والوسوم
														</h4>
														<div className='bg-white p-3 rounded-md border border-gray-200'>
															<div className='mb-2'>
																<span className='text-sm text-gray-600 block mb-1'>
																	الفئات:
																</span>
																<div>
																	{product.categories.map((category, index) => (
																		<span
																			key={index}
																			className='inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-md ml-1 mb-1'
																		>
																			{category}
																		</span>
																	))}
																</div>
															</div>
															<div>
																<span className='text-sm text-gray-600 block mb-1'>
																	الوسوم:
																</span>
																<div>
																	{product.tags.map((tag, index) => (
																		<span
																			key={index}
																			className='inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-md ml-1 mb-1'
																		>
																			{tag}
																		</span>
																	))}
																</div>
															</div>
														</div>
													</div>
												</div>

												<div className='bg-white p-3 rounded-md border border-gray-200 mb-4'>
													<h4 className='text-sm font-medium text-gray-700 mb-2'>الوصف</h4>
													<p className='text-sm text-gray-600'>{product.description}</p>
												</div>

												{product.variants && product.variants.length > 0 && (
													<div className='bg-white p-3 rounded-md border border-gray-200 mb-4'>
														<h4 className='text-sm font-medium text-gray-700 mb-2'>
															المتغيرات (الأصناف)
														</h4>
														<div className='mt-2 overflow-x-auto'>
															<table className='min-w-full divide-y divide-gray-200'>
																<thead className='bg-gray-50'>
																	<tr>
																		<th
																			scope='col'
																			className='px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
																		>
																			SKU
																		</th>
																		<th
																			scope='col'
																			className='px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
																		>
																			الخصائص
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
																	{product.variants.map((variant) => (
																		<tr key={variant.id}>
																			<td className='px-3 py-2 whitespace-nowrap text-xs font-mono text-gray-500'>
																				{variant.sku}
																			</td>
																			<td className='px-3 py-2 text-xs text-gray-600'>
																				{variant.attributes.map((attr, idx) => (
																					<span key={idx}>
																						{attr.name}:{' '}
																						<span className='font-medium'>
																							{attr.value}
																						</span>
																						{idx <
																						variant.attributes.length - 1
																							? ' / '
																							: ''}
																					</span>
																				))}
																			</td>
																			<td className='px-3 py-2 whitespace-nowrap text-xs text-left'>
																				<span className='font-medium text-gray-900'>
																					{formatAmount(variant.price)}
																				</span>
																				{variant.compareAtPrice && (
																					<span className='text-xs text-gray-500 line-through mr-1'>
																						{formatAmount(
																							variant.compareAtPrice
																						)}
																					</span>
																				)}
																			</td>
																			<td className='px-3 py-2 whitespace-nowrap text-xs text-center'>
																				<span
																					className={`font-medium ${
																						variant.inventory === 0
																							? 'text-red-600'
																							: 'text-gray-900'
																					}`}
																				>
																					{variant.inventory}
																				</span>
																			</td>
																		</tr>
																	))}
																</tbody>
															</table>
														</div>
													</div>
												)}

												<div className='flex justify-between items-center gap-2'>
													<div className='flex gap-2'>
														<Link
															href={`/dashboard/ecommerce/products/${product.id}`}
															className='px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center'
														>
															<Eye className='ml-1 h-4 w-4' />
															عرض التفاصيل الكاملة
														</Link>
														<Link
															href={`/dashboard/ecommerce/products/${product.id}/edit`}
															className='px-3 py-1.5 bg-amber-600 text-white rounded-md hover:bg-amber-700 text-sm flex items-center'
														>
															<Edit className='ml-1 h-4 w-4' />
															تعديل المنتج
														</Link>
														<a
															href={`https://anaqati.com/products/${product.slug}`}
															target='_blank'
															rel='noopener noreferrer'
															className='px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center'
														>
															<ExternalLink className='ml-1 h-4 w-4' />
															عرض في المتجر
														</a>
													</div>

													<button
														onClick={() => confirmDelete(product)}
														className='px-3 py-1.5 border border-red-300 text-red-700 bg-red-50 rounded-md hover:bg-red-100 text-sm flex items-center'
													>
														<Trash className='ml-1 h-4 w-4' />
														حذف المنتج
													</button>
												</div>
											</div>
										))}
								</div>
							)}
						</div>
					)}

					{/* عرض شبكة */}
					{viewMode === 'grid' && (
						<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
							{currentItems.map((product) => (
								<div
									key={product.id}
									className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow'
								>
									<div className='aspect-w-3 aspect-h-2 bg-gray-200 relative'>
										{product.mainImage ? (
											<img
												src={product.mainImage}
												alt={product.name}
												className='w-full h-full object-cover'
											/>
										) : (
											<div className='w-full h-full flex items-center justify-center bg-gray-100 text-gray-400'>
												<Package className='h-12 w-12' />
											</div>
										)}
										<div className='absolute top-2 right-2'>
											{renderProductStatusBadge(product.status)}
										</div>
										{product.featured && (
											<div className='absolute top-2 left-2'>
												<span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800'>
													مميز
												</span>
											</div>
										)}
									</div>

									<div className='p-4'>
										<div className='mb-2'>
											<h3 className='text-sm font-medium text-gray-900'>
												<Link
													href={`/dashboard/ecommerce/products/${product.id}`}
													className='hover:text-indigo-600'
												>
													{product.name}
												</Link>
											</h3>
											<p className='text-xs text-gray-500 mt-1 font-mono'>{product.sku}</p>
										</div>

										<div className='flex justify-between items-center mb-2'>
											<div>
												<span className='text-sm font-semibold text-gray-900'>
													{formatAmount(product.price)}
												</span>
												{product.compareAtPrice && (
													<span className='text-xs text-gray-500 line-through mr-1'>
														{formatAmount(product.compareAtPrice)}
													</span>
												)}
											</div>
											<div>{renderInventoryStatus(product)}</div>
										</div>

										<div className='text-xs text-gray-500 mb-3'>
											المخزون:{' '}
											<span
												className={
													product.inventory.quantity === 0 ? 'text-red-600 font-medium' : ''
												}
											>
												{product.inventory.quantity}
											</span>
										</div>

										<div className='flex flex-wrap gap-1 mb-3'>
											{product.categories.slice(0, 2).map((category, index) => (
												<span
													key={index}
													className='inline-block bg-gray-100 text-xs px-2 py-0.5 rounded'
												>
													{category}
												</span>
											))}
											{product.categories.length > 2 && (
												<span className='inline-block bg-gray-100 text-xs px-2 py-0.5 rounded'>
													+{product.categories.length - 2}
												</span>
											)}
										</div>

										<div className='flex justify-between border-t border-gray-100 pt-3'>
											<div className='flex space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/ecommerce/products/${product.id}`}
													className='text-indigo-600 hover:text-indigo-900'
													title='عرض التفاصيل'
												>
													<Eye className='h-5 w-5' />
												</Link>
												<Link
													href={`/dashboard/ecommerce/products/${product.id}/edit`}
													className='text-amber-600 hover:text-amber-900'
													title='تعديل'
												>
													<Edit className='h-5 w-5' />
												</Link>
												<a
													href={`https://anaqati.com/products/${product.slug}`}
													target='_blank'
													rel='noopener noreferrer'
													className='text-blue-600 hover:text-blue-900'
													title='عرض في المتجر'
												>
													<ExternalLink className='h-5 w-5' />
												</a>
											</div>
											<button
												onClick={() => confirmDelete(product)}
												className='text-red-600 hover:text-red-900'
												title='حذف المنتج'
											>
												<Trash className='h-5 w-5' />
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					)}

					{/* الترقيم الصفحي */}
					<div className='bg-white px-4 py-3 flex items-center justify-between border border-gray-200 mt-4 rounded-lg sm:px-6'>
						<div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
							<div>
								<p className='text-sm text-gray-700'>
									عرض <span className='font-medium'>{indexOfFirstItem + 1}</span> إلى{' '}
									<span className='font-medium'>
										{Math.min(indexOfLastItem, filteredProducts.length)}
									</span>{' '}
									من أصل <span className='font-medium'>{filteredProducts.length}</span> منتج
								</p>
							</div>
							<div>
								<nav
									className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px space-x-reverse'
									aria-label='Pagination'
								>
									<button
										onClick={() => paginate(Math.max(1, currentPage - 1))}
										className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
											currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
										}`}
										disabled={currentPage === 1}
									>
										<span className='sr-only'>السابق</span>
										<ArrowRight className='h-5 w-5' />
									</button>

									{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
										let pageNumber;

										if (totalPages <= 5) {
											pageNumber = i + 1;
										} else if (currentPage <= 3) {
											pageNumber = i + 1;
										} else if (currentPage >= totalPages - 2) {
											pageNumber = totalPages - 4 + i;
										} else {
											pageNumber = currentPage - 2 + i;
										}

										return (
											<button
												key={pageNumber}
												onClick={() => paginate(pageNumber)}
												className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
													currentPage === pageNumber
														? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
														: 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
												}`}
											>
												{pageNumber}
											</button>
										);
									})}

									<button
										onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
										className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
											currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
										}`}
										disabled={currentPage === totalPages}
									>
										<span className='sr-only'>التالي</span>
										<ArrowLeft className='h-5 w-5' />
									</button>
								</nav>
							</div>
						</div>
					</div>
				</>
			) : (
				<div className='bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center'>
					<Package className='h-12 w-12 text-gray-300 mx-auto mb-3' />
					<h3 className='text-lg font-medium text-gray-900'>لا توجد منتجات</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || inventoryFilter !== 'all'
							? 'لم يتم العثور على منتجات تطابق معايير البحث المحددة'
							: 'لا توجد منتجات مسجلة في النظام. قم بإنشاء منتج جديد للبدء.'}
					</p>
					<div className='mt-4'>
						<Link
							href='/dashboard/ecommerce/products/new'
							className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700'
						>
							<Plus className='ml-1 h-4 w-4' />
							إضافة منتج جديد
						</Link>
					</div>
				</div>
			)}

			{/* روابط سريعة */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Link
					href='/dashboard/ecommerce/products/new'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
						<Plus className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>إضافة منتج</h3>
						<p className='text-sm text-gray-500'>إضافة منتج جديد للمتجر</p>
					</div>
				</Link>

				<Link
					href='/dashboard/ecommerce/products/inventory'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ml-3'>
						<Package className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>إدارة المخزون</h3>
						<p className='text-sm text-gray-500'>تحديث كميات المنتجات</p>
					</div>
				</Link>

				<Link
					href='/dashboard/ecommerce/products/import'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
						<Upload className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>استيراد منتجات</h3>
						<p className='text-sm text-gray-500'>استيراد عبر ملف CSV</p>
					</div>
				</Link>

				<Link
					href='/dashboard/ecommerce/products/settings'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
						<Settings className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>إعدادات المنتجات</h3>
						<p className='text-sm text-gray-500'>تكوين خيارات المنتجات</p>
					</div>
				</Link>
			</div>

			{/* نافذة تأكيد الحذف */}
			{showDeleteConfirm && productToDelete && (
				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
						<div className='fixed inset-0 transition-opacity' onClick={() => setShowDeleteConfirm(false)}>
							<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
						</div>

						<div className='inline-block align-middle bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
							<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								<div className='sm:flex sm:items-start'>
									<div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
										<Trash className='h-6 w-6 text-red-600' />
									</div>
									<div className='mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right'>
										<h3 className='text-lg leading-6 font-medium text-gray-900'>حذف المنتج</h3>
										<div className='mt-2'>
											<p className='text-sm text-gray-500'>
												هل أنت متأكد من رغبتك في حذف المنتج "{productToDelete.name}"؟ لا يمكن
												التراجع عن هذا الإجراء.
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
								<button
									type='button'
									onClick={deleteProduct}
									className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
								>
									حذف
								</button>
								<button
									type='button'
									onClick={() => setShowDeleteConfirm(false)}
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
