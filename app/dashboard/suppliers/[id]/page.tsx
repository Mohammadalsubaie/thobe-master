// app/dashboard/suppliers/[id]/page.tsx
'use client';

import {
	ArrowRight,
	Calendar,
	Check,
	ChevronDown,
	ChevronUp,
	Copy,
	DollarSign,
	Edit,
	ExternalLink,
	FileText,
	Globe,
	Mail,
	MapPin,
	Package,
	Phone,
	ShoppingBag,
	Tag,
	Trash2,
	TrendingDown,
	TrendingUp,
	User,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// نوع بيانات المورد
interface Supplier {
	id: string;
	name: string;
	contactPerson: string;
	phone: string;
	email: string;
	address: string;
	website?: string;
	logoUrl?: string;
	taxNumber?: string;
	accountNumber?: string;
	notes?: string;
	status: 'active' | 'inactive';
	paymentTerms: string;
	rating: number;
	createdAt: Date;
	lastOrderDate?: Date;
	totalOrders: number;
	totalPurchases: number;
}

// نوع بيانات المنتج
interface Product {
	id: string;
	name: string;
	sku: string;
	thumbnail?: string;
	unit: string;
	price: number;
	lastPurchaseDate?: Date;
	totalPurchased: number;
}

// نوع بيانات عملية الشراء
interface Purchase {
	id: string;
	invoiceNumber: string;
	date: Date;
	totalAmount: number;
	paymentStatus: 'paid' | 'pending' | 'partially-paid' | 'overdue';
	items: number;
}

// كومبوننت مخصص للبطاقات
const InfoCard = ({
	title,
	children,
	className = '',
	action,
}: {
	title: string;
	children: React.ReactNode;
	className?: string;
	action?: { label: string; href?: string; onClick?: () => void };
}) => {
	return (
		<div
			className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden ${className}`}
		>
			<div className='px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center'>
				<h3 className='text-sm font-medium text-gray-700 dark:text-gray-200'>{title}</h3>
				{action &&
					(action.href ? (
						<Link
							href={action.href}
							className='text-xs text-primary dark:text-primary-light hover:underline'
						>
							{action.label}
						</Link>
					) : (
						<button
							onClick={action.onClick}
							className='text-xs text-primary dark:text-primary-light hover:underline'
						>
							{action.label}
						</button>
					))}
			</div>
			<div className='p-4'>{children}</div>
		</div>
	);
};

// كومبوننت مخصص للحقول
const InfoField = ({
	label,
	value,
	className = '',
	copyable = false,
}: {
	label: string;
	value: React.ReactNode;
	className?: string;
	copyable?: boolean;
}) => {
	const [copied, setCopied] = useState(false);

	const handleCopy = (text: string) => {
		navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<div className={`flex flex-col mb-4 ${className}`}>
			<span className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1'>{label}</span>
			<div className='text-sm text-gray-900 dark:text-gray-100 flex items-center'>
				{value}
				{copyable && typeof value === 'string' && (
					<button
						onClick={() => handleCopy(value)}
						className='mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
						title='نسخ'
					>
						{copied ? <Check className='h-4 w-4 text-green-500' /> : <Copy className='h-4 w-4' />}
					</button>
				)}
			</div>
		</div>
	);
};

export default function SupplierDetailsPage() {
	const params = useParams();
	const router = useRouter();
	const [supplier, setSupplier] = useState<Supplier | null>(null);
	const [products, setProducts] = useState<Product[]>([]);
	const [purchases, setPurchases] = useState<Purchase[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [expandedSection, setExpandedSection] = useState<string | null>('products');

	// تبديل حالة التوسع للأقسام
	const toggleSection = (section: string) => {
		if (expandedSection === section) {
			setExpandedSection(null);
		} else {
			setExpandedSection(section);
		}
	};

	// جلب بيانات المورد
	useEffect(() => {
		const fetchSupplierDetails = async () => {
			try {
				setLoading(true);
				// في التطبيق الحقيقي، هذا سيكون استدعاء API
				await new Promise((resolve) => setTimeout(resolve, 800));

				// بيانات تجريبية للمورد
				const mockSupplier: Supplier = {
					id: 's1',
					name: 'شركة النسيج العالمية',
					contactPerson: 'خالد محمد العمري',
					phone: '0512345678',
					email: 'info@textileglobal.com',
					address: 'الرياض، طريق الملك فهد، برج المملكة الدور 15',
					website: 'https://www.textileglobal.com',
					logoUrl: '/images/suppliers/textile-global-logo.png',
					taxNumber: '300123456700003',
					accountNumber: 'SA5580000123456789012345',
					notes: 'مورد رئيسي للأقمشة الفاخرة، يوفر أقمشة ذات جودة عالية بأسعار منافسة. شروط الدفع مرنة ومواعيد التسليم دقيقة.',
					status: 'active',
					paymentTerms: 'صافي 30 يوم',
					rating: 4,
					createdAt: new Date('2022-03-15'),
					lastOrderDate: new Date('2025-03-10'),
					totalOrders: 18,
					totalPurchases: 135600,
				};
				setSupplier(mockSupplier);

				// بيانات تجريبية للمنتجات
				const mockProducts: Product[] = [
					{
						id: 'f1',
						name: 'قماش كشمير أسود فاخر',
						sku: 'FAB-KSH-BLK-001',
						unit: 'متر',
						price: 80,
						thumbnail: '/images/fabrics/black-cashmere-1.jpg',
						lastPurchaseDate: new Date('2025-03-10'),
						totalPurchased: 150,
					},
					{
						id: 'f2',
						name: 'قماش قطن مصري أبيض',
						sku: 'FAB-CTN-WHT-002',
						unit: 'متر',
						price: 45,
						thumbnail: '/images/fabrics/white-cotton.jpg',
						lastPurchaseDate: new Date('2025-02-22'),
						totalPurchased: 200,
					},
					{
						id: 'f3',
						name: 'قماش صوف رمادي',
						sku: 'FAB-WOL-GRY-003',
						unit: 'متر',
						price: 65,
						thumbnail: '/images/fabrics/gray-wool.jpg',
						lastPurchaseDate: new Date('2025-01-15'),
						totalPurchased: 120,
					},
					{
						id: 'f4',
						name: 'قماش حرير أزرق',
						sku: 'FAB-SLK-BLU-004',
						unit: 'متر',
						price: 90,
						thumbnail: '/images/fabrics/blue-silk.jpg',
						lastPurchaseDate: new Date('2024-12-05'),
						totalPurchased: 80,
					},
				];
				setProducts(mockProducts);

				// بيانات تجريبية لعمليات الشراء
				const mockPurchases: Purchase[] = [
					{
						id: 'p1',
						invoiceNumber: 'INV-2025-456',
						date: new Date('2025-03-10'),
						totalAmount: 14000,
						paymentStatus: 'paid',
						items: 3,
					},
					{
						id: 'p2',
						invoiceNumber: 'INV-2025-123',
						date: new Date('2025-02-22'),
						totalAmount: 9200,
						paymentStatus: 'paid',
						items: 2,
					},
					{
						id: 'p3',
						invoiceNumber: 'INV-2025-089',
						date: new Date('2025-01-15'),
						totalAmount: 7800,
						paymentStatus: 'paid',
						items: 2,
					},
					{
						id: 'p4',
						invoiceNumber: 'INV-2024-998',
						date: new Date('2024-12-05'),
						totalAmount: 11500,
						paymentStatus: 'paid',
						items: 4,
					},
					{
						id: 'p5',
						invoiceNumber: 'INV-2024-876',
						date: new Date('2024-11-20'),
						totalAmount: 8900,
						paymentStatus: 'paid',
						items: 3,
					},
				];
				setPurchases(mockPurchases);
			} catch (err) {
				console.error('Error fetching supplier details:', err);
				setError('حدث خطأ أثناء تحميل بيانات المورد');
			} finally {
				setLoading(false);
			}
		};

		fetchSupplierDetails();
	}, [params.id]);

	// التقييم بالنجوم
	const StarRating = ({ rating }: { rating: number }) => {
		return (
			<div className='flex'>
				{[1, 2, 3, 4, 5].map((star) => (
					<svg
						key={star}
						className={`h-4 w-4 ${
							star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
						}`}
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path
							fillRule='evenodd'
							d='M10 15.585l-5.303 2.799a1 1 0 01-1.45-1.054l1.013-5.91-4.29-4.182a1 1 0 01.554-1.706l5.926-.862 2.646-5.364a1 1 0 011.788 0l2.646 5.364 5.926.862a1 1 0 01.554 1.706l-4.29 4.182 1.013 5.91a1 1 0 01-1.45 1.054L10 15.585z'
							clipRule='evenodd'
						/>
					</svg>
				))}
			</div>
		);
	};

	// حالة الدفع
	const PaymentStatusBadge = ({ status }: { status: Purchase['paymentStatus'] }) => {
		const statusConfig = {
			paid: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', label: 'مدفوع' },
			pending: {
				color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
				label: 'بانتظار الدفع',
			},
			'partially-paid': {
				color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
				label: 'مدفوع جزئيًا',
			},
			overdue: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', label: 'متأخر' },
		};

		const config = statusConfig[status];

		return (
			<span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
				{config.label}
			</span>
		);
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'></div>
				<span className='mr-2 text-gray-700 dark:text-gray-300'>جاري تحميل البيانات...</span>
			</div>
		);
	}

	if (error || !supplier) {
		return (
			<div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-md'>
				<div className='text-red-700 dark:text-red-400 font-medium'>
					{error || 'لم يتم العثور على بيانات المورد'}
				</div>
				<Link
					href='/dashboard/suppliers'
					className='mt-2 inline-flex items-center text-primary hover:underline'
				>
					<ArrowRight className='h-4 w-4 ml-1' />
					العودة إلى قائمة الموردين
				</Link>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col md:flex-row md:justify-between md:items-center'>
				<div>
					<div className='flex items-center mb-1'>
						<Link
							href='/dashboard/suppliers'
							className='text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light mr-2'
						>
							<ArrowRight className='h-5 w-5' />
						</Link>
						<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>{supplier.name}</h1>
						{supplier.status === 'inactive' && (
							<span className='mr-2 px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'>
								غير نشط
							</span>
						)}
					</div>
					<p className='text-gray-500 dark:text-gray-400 text-sm'>
						آخر طلب بتاريخ:{' '}
						{supplier.lastOrderDate ? supplier.lastOrderDate.toLocaleDateString('ar-SA') : 'لا يوجد'}
					</p>
				</div>

				<div className='flex mt-4 md:mt-0 space-x-3 space-x-reverse'>
					<Link
						href={`/dashboard/inventory/purchases/new?supplier_id=${supplier.id}`}
						className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
					>
						<ShoppingBag className='ml-1.5 -mr-1 h-4 w-4' />
						طلب جديد
					</Link>

					<Link
						href={`/dashboard/suppliers/${supplier.id}/edit`}
						className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
					>
						<Edit className='ml-1.5 -mr-1 h-4 w-4' />
						تعديل
					</Link>

					<button className='inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:focus:ring-offset-gray-800'>
						<Trash2 className='ml-1.5 -mr-1 h-4 w-4' />
						حذف
					</button>
				</div>
			</div>

			{/* بطاقة المعلومات الرئيسية */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
				<div className='space-y-6'>
					{/* معلومات المورد */}
					<InfoCard title='معلومات المورد'>
						<div className='flex items-center mb-4'>
							{supplier.logoUrl ? (
								<div className='h-16 w-16 rounded-md overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-700 relative'>
									<Image
										src={supplier.logoUrl}
										alt={supplier.name}
										fill
										sizes='64px'
										className='object-contain'
									/>
								</div>
							) : (
								<div className='h-16 w-16 rounded-md bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center'>
									<Package className='h-8 w-8 text-primary-600 dark:text-primary-400' />
								</div>
							)}

							<div className='mr-4'>
								<h2 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
									{supplier.name}
								</h2>
								<div className='mt-1 flex items-center'>
									<StarRating rating={supplier.rating} />
									<span className='mr-1 text-xs text-gray-500 dark:text-gray-400'>
										{supplier.rating}/5
									</span>
								</div>
							</div>
						</div>

						<div className='space-y-4'>
							<InfoField
								label='جهة الاتصال'
								value={
									<div className='flex items-center'>
										<User className='h-4 w-4 text-gray-400 ml-1.5' />
										<span>{supplier.contactPerson}</span>
									</div>
								}
							/>

							<InfoField
								label='رقم الهاتف'
								value={
									<div className='flex items-center'>
										<Phone className='h-4 w-4 text-gray-400 ml-1.5' />
										<a
											href={`tel:${supplier.phone}`}
											className='text-primary dark:text-primary-light hover:underline'
											dir='ltr'
										>
											{supplier.phone}
										</a>
									</div>
								}
							/>

							<InfoField
								label='البريد الإلكتروني'
								value={
									<div className='flex items-center'>
										<Mail className='h-4 w-4 text-gray-400 ml-1.5' />
										<a
											href={`mailto:${supplier.email}`}
											className='text-primary dark:text-primary-light hover:underline'
											dir='ltr'
										>
											{supplier.email}
										</a>
									</div>
								}
							/>

							<InfoField
								label='العنوان'
								value={
									<div className='flex items-start'>
										<MapPin className='h-4 w-4 text-gray-400 ml-1.5 mt-0.5' />
										<span>{supplier.address}</span>
									</div>
								}
							/>

							{supplier.website && (
								<InfoField
									label='الموقع الإلكتروني'
									value={
										<div className='flex items-center'>
											<Globe className='h-4 w-4 text-gray-400 ml-1.5' />
											<a
												href={supplier.website}
												target='_blank'
												rel='noopener noreferrer'
												className='text-primary dark:text-primary-light hover:underline flex items-center'
												dir='ltr'
											>
												{supplier.website.replace(/^https?:\/\/(www\.)?/, '')}
												<ExternalLink className='h-3 w-3 mr-1' />
											</a>
										</div>
									}
								/>
							)}
						</div>
					</InfoCard>

					{/* معلومات مالية */}
					<InfoCard title='معلومات مالية'>
						<div className='space-y-4'>
							{supplier.taxNumber && (
								<InfoField label='الرقم الضريبي' value={supplier.taxNumber} copyable />
							)}

							{supplier.accountNumber && (
								<InfoField label='رقم الحساب البنكي' value={supplier.accountNumber} copyable />
							)}

							<InfoField label='شروط الدفع' value={supplier.paymentTerms} />

							<InfoField
								label='إجمالي المشتريات'
								value={
									<div className='flex items-center'>
										<DollarSign className='h-4 w-4 text-gray-400 ml-1.5' />
										<span className='font-medium'>
											{supplier.totalPurchases.toLocaleString()} ر.س
										</span>
									</div>
								}
							/>

							<InfoField
								label='عدد الطلبات'
								value={
									<div className='flex items-center'>
										<ShoppingBag className='h-4 w-4 text-gray-400 ml-1.5' />
										<span className='font-medium'>{supplier.totalOrders} طلب</span>
									</div>
								}
							/>

							<InfoField
								label='منذ'
								value={
									<div className='flex items-center'>
										<Calendar className='h-4 w-4 text-gray-400 ml-1.5' />
										<span>
											{supplier.createdAt.toLocaleDateString('ar-SA', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
											})}
										</span>
									</div>
								}
							/>
						</div>
					</InfoCard>

					{/* ملاحظات */}
					{supplier.notes && (
						<InfoCard title='ملاحظات'>
							<p className='text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line'>
								{supplier.notes}
							</p>
						</InfoCard>
					)}
				</div>

				<div className='md:col-span-2 space-y-6'>
					{/* إحصائيات سريعة */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-4'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-xs text-gray-500 dark:text-gray-400'>إجمالي المشتريات</p>
									<p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
										{supplier.totalPurchases.toLocaleString()} ر.س
									</p>
								</div>
								<div className='h-10 w-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center'>
									<DollarSign className='h-5 w-5 text-primary-600 dark:text-primary-400' />
								</div>
							</div>
							<div className='mt-2 flex items-center text-xs text-green-600 dark:text-green-400'>
								<TrendingUp className='h-3 w-3 ml-1' />
								<span>زيادة بنسبة 12% من العام السابق</span>
							</div>
						</div>

						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-4'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-xs text-gray-500 dark:text-gray-400'>عدد الطلبات</p>
									<p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
										{supplier.totalOrders}
									</p>
								</div>
								<div className='h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center'>
									<ShoppingBag className='h-5 w-5 text-blue-600 dark:text-blue-400' />
								</div>
							</div>
							<div className='mt-2 flex items-center text-xs text-green-600 dark:text-green-400'>
								<TrendingUp className='h-3 w-3 ml-1' />
								<span>زيادة بنسبة 8% من العام السابق</span>
							</div>
						</div>

						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-4'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-xs text-gray-500 dark:text-gray-400'>متوسط سعر المنتج</p>
									<p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
										{products.length > 0
											? (
													products.reduce((sum, product) => sum + product.price, 0) /
													products.length
											  ).toFixed(1)
											: 0}{' '}
										ر.س
									</p>
								</div>
								<div className='h-10 w-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center'>
									<Tag className='h-5 w-5 text-yellow-600 dark:text-yellow-400' />
								</div>
							</div>
							<div className='mt-2 flex items-center text-xs text-red-500 dark:text-red-400'>
								<TrendingDown className='h-3 w-3 ml-1' />
								<span>انخفاض بنسبة 2% من الشهر الماضي</span>
							</div>
						</div>

						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-4'>
							<div className='flex items-center justify-between'>
								<div>
									<p className='text-xs text-gray-500 dark:text-gray-400'>عدد المنتجات</p>
									<p className='text-xl font-bold text-gray-900 dark:text-gray-100'>
										{products.length}
									</p>
								</div>
								<div className='h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center'>
									<Package className='h-5 w-5 text-purple-600 dark:text-purple-400' />
								</div>
							</div>
							<div className='mt-2 flex items-center text-xs text-green-600 dark:text-green-400'>
								<TrendingUp className='h-3 w-3 ml-1' />
								<span>زيادة بنسبة 5% من الشهر الماضي</span>
							</div>
						</div>
					</div>

					{/* قائمة المنتجات */}
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
						<div
							className='px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center cursor-pointer'
							onClick={() => toggleSection('products')}
						>
							<h3 className='text-sm font-medium text-gray-700 dark:text-gray-200'>
								المنتجات المتوفرة ({products.length})
							</h3>
							<button className='text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400'>
								{expandedSection === 'products' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
							</button>
						</div>
						{expandedSection === 'products' && (
							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
									<thead className='bg-gray-50 dark:bg-gray-700'>
										<tr>
											<th
												scope='col'
												className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												المنتج
											</th>
											<th
												scope='col'
												className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												رمز المنتج
											</th>
											<th
												scope='col'
												className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												السعر
											</th>
											<th
												scope='col'
												className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												آخر طلب
											</th>
											<th
												scope='col'
												className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												الكمية المطلوبة
											</th>
										</tr>
									</thead>
									<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
										{products.map((product) => (
											<tr key={product.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
												<td className='px-4 py-4 whitespace-nowrap'>
													<div className='flex items-center'>
														{product.thumbnail && (
															<div className='h-10 w-10 rounded-md overflow-hidden flex-shrink-0 relative'>
																<Image
																	src={product.thumbnail}
																	alt={product.name}
																	fill
																	sizes='40px'
																	className='object-cover'
																/>
															</div>
														)}
														<div className='mr-3'>
															<Link
																href={`/dashboard/inventory/fabrics/${product.id}`}
																className='text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary dark:hover:text-primary-light'
															>
																{product.name}
															</Link>
														</div>
													</div>
												</td>
												<td
													className='px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'
													dir='ltr'
												>
													{product.sku}
												</td>
												<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
													{product.price} ر.س / {product.unit}
												</td>
												<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
													{product.lastPurchaseDate
														? product.lastPurchaseDate.toLocaleDateString('ar-SA')
														: 'لا يوجد'}
												</td>
												<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
													{product.totalPurchased} {product.unit}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>

					{/* سجل المشتريات */}
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
						<div
							className='px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center cursor-pointer'
							onClick={() => toggleSection('purchases')}
						>
							<h3 className='text-sm font-medium text-gray-700 dark:text-gray-200'>
								سجل المشتريات ({purchases.length})
							</h3>
							<button className='text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400'>
								{expandedSection === 'purchases' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
							</button>
						</div>
						{expandedSection === 'purchases' && (
							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
									<thead className='bg-gray-50 dark:bg-gray-700'>
										<tr>
											<th
												scope='col'
												className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												رقم الفاتورة
											</th>
											<th
												scope='col'
												className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												التاريخ
											</th>
											<th
												scope='col'
												className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												المبلغ
											</th>
											<th
												scope='col'
												className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												حالة الدفع
											</th>
											<th
												scope='col'
												className='px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
											>
												العناصر
											</th>
										</tr>
									</thead>
									<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
										{purchases.map((purchase) => (
											<tr key={purchase.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
												<td className='px-4 py-4 whitespace-nowrap'>
													<Link
														href={`/dashboard/inventory/purchases/${purchase.id}`}
														className='text-sm font-medium text-primary dark:text-primary-light hover:underline'
														dir='ltr'
													>
														{purchase.invoiceNumber}
													</Link>
												</td>
												<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
													{purchase.date.toLocaleDateString('ar-SA')}
												</td>
												<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
													{purchase.totalAmount.toLocaleString()} ر.س
												</td>
												<td className='px-4 py-4 whitespace-nowrap'>
													<PaymentStatusBadge status={purchase.paymentStatus} />
												</td>
												<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100'>
													{purchase.items} عنصر
												</td>
											</tr>
										))}
									</tbody>
								</table>

								<div className='px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-center'>
									<Link
										href='/dashboard/inventory/purchases?supplier_id=s1'
										className='text-sm text-primary dark:text-primary-light hover:underline'
									>
										عرض كل المشتريات من هذا المورد
									</Link>
								</div>
							</div>
						)}
					</div>

					{/* الوثائق والملفات */}
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
						<div
							className='px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center cursor-pointer'
							onClick={() => toggleSection('documents')}
						>
							<h3 className='text-sm font-medium text-gray-700 dark:text-gray-200'>الوثائق والملفات</h3>
							<button className='text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400'>
								{expandedSection === 'documents' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
							</button>
						</div>
						{expandedSection === 'documents' && (
							<div className='p-4'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='border border-gray-200 dark:border-gray-700 rounded-md p-3 flex items-center'>
										<div className='h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-md flex items-center justify-center mr-3'>
											<FileText className='h-5 w-5 text-blue-600 dark:text-blue-400' />
										</div>
										<div className='min-w-0 flex-1'>
											<p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
												عقد التوريد
											</p>
											<p className='text-xs text-gray-500 dark:text-gray-400'>
												PDF • 2.5MB • تم التحديث قبل 3 أشهر
											</p>
										</div>
										<a href='#' className='text-primary dark:text-primary-light'>
											<svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
												<path
													fillRule='evenodd'
													d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 12.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
													clipRule='evenodd'
												/>
											</svg>
										</a>
									</div>

									<div className='border border-gray-200 dark:border-gray-700 rounded-md p-3 flex items-center'>
										<div className='h-10 w-10 bg-green-100 dark:bg-green-900/20 rounded-md flex items-center justify-center mr-3'>
											<FileText className='h-5 w-5 text-green-600 dark:text-green-400' />
										</div>
										<div className='min-w-0 flex-1'>
											<p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
												شهادة ضريبة القيمة المضافة
											</p>
											<p className='text-xs text-gray-500 dark:text-gray-400'>
												PDF • 1.2MB • تم التحديث قبل 6 أشهر
											</p>
										</div>
										<a href='#' className='text-primary dark:text-primary-light'>
											<svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
												<path
													fillRule='evenodd'
													d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 12.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
													clipRule='evenodd'
												/>
											</svg>
										</a>
									</div>

									<div className='border border-gray-200 dark:border-gray-700 rounded-md p-3 flex items-center'>
										<div className='h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-md flex items-center justify-center mr-3'>
											<FileText className='h-5 w-5 text-purple-600 dark:text-purple-400' />
										</div>
										<div className='min-w-0 flex-1'>
											<p className='text-sm font-medium text-gray-900 dark:text-gray-100 truncate'>
												قائمة أسعار 2025
											</p>
											<p className='text-xs text-gray-500 dark:text-gray-400'>
												Excel • 3.8MB • تم التحديث قبل شهر
											</p>
										</div>
										<a href='#' className='text-primary dark:text-primary-light'>
											<svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
												<path
													fillRule='evenodd'
													d='M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L10 12.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
													clipRule='evenodd'
												/>
											</svg>
										</a>
									</div>
								</div>

								<div className='mt-4 text-center'>
									<button className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'>
										<svg
											className='h-4 w-4 ml-1.5 -mr-1'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M12 4v16m8-8H4'
											/>
										</svg>
										إضافة ملف جديد
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
