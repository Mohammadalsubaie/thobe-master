'use client';

import {
	BarChart2,
	Bell,
	Briefcase,
	Calendar,
	CreditCard,
	DollarSign,
	Globe,
	HelpCircle,
	LayoutDashboard,
	MapPin,
	Menu,
	Package,
	Scissors,
	Search,
	Settings,
	ShoppingBag,
	Star,
	Truck,
	Users,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Sidebar() {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({});

	const toggleExpand = (name: string) => {
		setExpandedItems((prev) => ({
			...prev,
			[name]: !prev[name],
		}));
	};

	const navigation = [
		{
			name: 'لوحة التحكم',
			href: '/dashboard',
			icon: LayoutDashboard,
			isExpandable: false,
		},
		{
			name: 'الطلبات',
			href: '/dashboard/orders',
			icon: ShoppingBag,
			isExpandable: false,
			subItems: [
				// المقترح التقسيم
				{ name: 'الطلبات الجديدة', href: '/dashboard/orders/new' },
				{ name: 'قيد التنفيذ', href: '/dashboard/orders/in-progress' },
				{ name: 'جاهزة للتسليم', href: '/dashboard/orders/ready' },
				{ name: 'الطلبات المكتملة', href: '/dashboard/orders/completed' },
				{ name: 'طلبات ملغاة', href: '/dashboard/orders/cancelled' },
				{ name: 'جميع الطلبات', href: '/dashboard/orders/all' },
				{ name: 'إنشاء طلب جديد', href: '/dashboard/orders/create' },
			],
		},
		{
			name: 'العملاء',
			href: '/dashboard/customers',
			icon: Users,
			isExpandable: false,
			subItems: [
				{ name: 'قائمة العملاء', href: '/dashboard/customers' },
				{ name: 'إضافة عميل جديد', href: '/dashboard/customers/new' },
				{ name: 'العملاء المميزين', href: '/dashboard/customers/vip' },
				{ name: 'قياسات العملاء', href: '/dashboard/customers/measurements' },
				{ name: 'تقارير العملاء', href: '/dashboard/customers/reports' },
			],
		},
		{
			name: 'إدارة الخياطة',
			href: '/dashboard/tailoring',
			icon: Scissors,
			isExpandable: true,
			subItems: [
				{ name: 'جدول المهام', href: '/dashboard/tailoring/tasks' },
				{ name: 'الخياطين', href: '/dashboard/tailoring/tailors' },
				{ name: 'مراحل الإنتاج', href: '/dashboard/tailoring/stages' },
				{ name: 'قوالب القياس', href: '/dashboard/tailoring/patterns' },
				{ name: 'مراقبة الجودة', href: '/dashboard/tailoring/quality' },
			],
		},
		// {
		// 	name: 'المنتجات',
		// 	href: '/dashboard/products',
		// 	icon: Tag,
		// 	isExpandable: true,
		// 	subItems: [
		// 		{ name: 'قائمة المنتجات', href: '/dashboard/products' },
		// 		{ name: 'إضافة منتج جديد', href: '/dashboard/products/new' },
		// 		{ name: 'فئات المنتجات', href: '/dashboard/products/categories' },
		// 		{ name: 'الموديلات', href: '/dashboard/products/models' },
		// 		{ name: 'الألوان والأنماط', href: '/dashboard/products/designs' },
		// 		{ name: 'التسعير', href: '/dashboard/products/pricing' },
		// 	],
		// },
		{
			name: 'المخزون',
			href: '/dashboard/inventory',
			icon: Package,
			isExpandable: true,
			subItems: [
				{ name: 'لوحة المخزون', href: '/dashboard/inventory' },
				{ name: 'الأقمشة', href: '/dashboard/inventory/fabrics' },
				{ name: 'الخيوط', href: '/dashboard/inventory/threads' },
				{ name: 'الإكسسوارات', href: '/dashboard/inventory/accessories' },
				{ name: 'جرد المخزون', href: '/dashboard/inventory/stock-count' },
				{ name: 'تسوية المخزون', href: '/dashboard/inventory/adjust' },
				{ name: 'تقرير الاختلافات', href: '/dashboard/inventory/discrepancies' },
				{ name: 'تقييم المخزون', href: '/dashboard/inventory/valuation' },
				{ name: 'طلبات الشراء', href: '/dashboard/inventory/purchases' },
			],
		},
		{
			name: 'الموردين',
			href: '/dashboard/suppliers',
			icon: Briefcase,
			isExpandable: true,
			subItems: [
				{ name: 'قائمة الموردين', href: '/dashboard/suppliers/list' },
				{ name: 'إضافة مورد', href: '/dashboard/suppliers/new' },
				{ name: 'طلبات الشراء', href: '/dashboard/suppliers/purchase-orders' },
				{ name: 'سجل الدفعات', href: '/dashboard/suppliers/payments' },
				{ name: 'تقييم الموردين', href: '/dashboard/suppliers/evaluation' },
			],
		},
		{
			name: 'الفروع',
			href: '/dashboard/branches',
			icon: MapPin,
			isExpandable: true,
			subItems: [
				{ name: 'إدارة الفروع', href: '/dashboard/branches' },
				{ name: 'إضافة فرع جديد', href: '/dashboard/branches/new' },
				{ name: 'نقل المخزون', href: '/dashboard/branches/transfers' },
				{ name: 'تقارير الفروع', href: '/dashboard/branches/reports' },
			],
		},
		{
			// للمدير
			name: 'المبيعات',
			href: '/dashboard/sales',
			icon: DollarSign,
			isExpandable: true,
			subItems: [
				{ name: 'نقاط البيع', href: '/dashboard/sales/pos' },
				{ name: 'الفواتير', href: '/dashboard/sales/invoices' },
				{ name: 'المرتجعات', href: '/dashboard/sales/returns' },
				{ name: 'العروض والخصومات', href: '/dashboard/sales/promotions' },
				{ name: 'أهداف المبيعات', href: '/dashboard/sales/targets' },
			],
		},
		{
			name: 'المالية',
			href: '/dashboard/finance',
			icon: CreditCard,
			isExpandable: true,
			subItems: [
				{ name: 'المعاملات المالية', href: '/dashboard/finance/transactions' },
				{ name: 'المصروفات', href: '/dashboard/finance/expenses' },
				{ name: 'الإيرادات', href: '/dashboard/finance/income' },
				{ name: 'حسابات العملاء', href: '/dashboard/finance/customer-accounts' },
				{ name: 'التقارير المالية', href: '/dashboard/finance/reports' },
			],
		},
		{
			name: 'التوصيلات',
			href: '/dashboard/deliveries',
			icon: Truck,
			isExpandable: true,
			subItems: [
				{ name: 'طلبات التوصيل', href: '/dashboard/deliveries' },
				{ name: 'مندوبي التوصيل', href: '/dashboard/deliveries/drivers' },
				{ name: 'مناطق التوصيل', href: '/dashboard/deliveries/zones' },
				{ name: 'تكاليف الشحن', href: '/dashboard/deliveries/costs' },
				{ name: 'تتبع الطلبات', href: '/dashboard/deliveries/tracking' },
			],
		},
		{
			name: 'الموظفين',
			href: '/dashboard/employees',
			icon: Users,
			isExpandable: true,
			subItems: [
				{ name: 'قائمة الموظفين', href: '/dashboard/employees' },
				{ name: 'إضافة موظف', href: '/dashboard/employees/new' },
				{ name: 'الحضور والغياب', href: '/dashboard/employees/attendance' },
				{ name: 'الرواتب والعمولات', href: '/dashboard/employees/payroll' },
				{ name: 'المهام والأداء', href: '/dashboard/employees/performance' },
				{ name: 'الإجازات', href: '/dashboard/employees/leaves' },
			],
		},
		{
			name: 'اصلاح الثياب',
			href: '/dashboard/repairs',
			icon: Scissors,
			isExpandable: true,
			subItems: [
				{ name: 'طلبات الإصلاح', href: '/dashboard/repairs/requests' },
				{ name: 'سجل الإصلاحات', href: '/dashboard/repairs/history' },
				{ name: 'أنواع الإصلاحات', href: '/dashboard/repairs/types' },
				{ name: 'أسعار الإصلاحات', href: '/dashboard/repairs/pricing' },
			],
		},
		{
			name: 'التسويق',
			href: '/dashboard/marketing',
			icon: Star,
			isExpandable: true,
			subItems: [
				{ name: 'التسويق', href: '/dashboard/marketing' },
				{ name: 'الحملات الترويجية', href: '/dashboard/marketing/campaigns' },
				{ name: 'الرسائل النصية', href: '/dashboard/marketing/sms' },
				{ name: 'البريد الإلكتروني', href: '/dashboard/marketing/email' },
				{ name: 'بطاقات الهدايا', href: '/dashboard/marketing/gift-cards' },
				{ name: 'برنامج الولاء', href: '/dashboard/marketing/loyalty' },
				{ name: 'كوبونات الخصم', href: '/dashboard/marketing/coupons' },
			],
		},
		{
			name: 'المواعيد',
			href: '/dashboard/appointments',
			icon: Calendar,
			isExpandable: true,
			subItems: [
				{ name: 'جدول المواعيد', href: '/dashboard/appointments/schedule' },
				{ name: 'حجز موعد جديد', href: '/dashboard/appointments/new' },
				{ name: 'مواعيد القياس', href: '/dashboard/appointments/measurements' },
				{ name: 'مواعيد التسليم', href: '/dashboard/appointments/delivery' },
			],
		},
		{
			name: 'التقارير',
			href: '/dashboard/reports',
			icon: BarChart2,
			isExpandable: true,
			subItems: [
				{ name: 'تقارير المبيعات', href: '/dashboard/reports/sales' },
				{ name: 'تقارير المخزون', href: '/dashboard/reports/inventory' },
				{ name: 'تقارير العملاء', href: '/dashboard/reports/customers' },
				{ name: 'تقارير الإنتاج', href: '/dashboard/reports/production' },
				{ name: 'تقارير الربحية', href: '/dashboard/reports/profitability' },
				{ name: 'تقارير الموظفين', href: '/dashboard/reports/employees' },
				{ name: 'تقارير مخصصة', href: '/dashboard/reports/custom' },
				{ name: 'لوحة المؤشرات', href: '/dashboard/reports/dashboard' },
			],
		},
		{
			name: 'المتجر الإلكتروني',
			href: '/dashboard/ecommerce',
			icon: Globe,
			isExpandable: true,
			subItems: [
				{ name: 'إعدادات المتجر', href: '/dashboard/ecommerce/settings' },
				{ name: 'طلبات المتجر', href: '/dashboard/ecommerce/orders' },
				{ name: 'المنتجات', href: '/dashboard/ecommerce/products' },
				{ name: 'النشر على المتجر', href: '/dashboard/ecommerce/publish' },
				{ name: 'تعليقات العملاء', href: '/dashboard/ecommerce/reviews' },
			],
		},
		// {
		// 	name: 'تطبيق الجوال',
		// 	href: '/dashboard/mobile-app',
		// 	icon: Smartphone,
		// 	isExpandable: true,
		// 	subItems: [
		// 		{ name: 'إعدادات التطبيق', href: '/dashboard/mobile-app/settings' },
		// 		{ name: 'الإشعارات', href: '/dashboard/mobile-app/notifications' },
		// 		{ name: 'إحصائيات التطبيق', href: '/dashboard/mobile-app/analytics' },
		// 	],
		// },
		{
			name: 'الإعدادات',
			href: '/dashboard/settings',
			icon: Settings,
			isExpandable: true,
			subItems: [
				{ name: 'إعدادات النظام', href: '/dashboard/settings/system' },
				{ name: 'إعدادات الفوترة', href: '/dashboard/settings/billing' },
				{ name: 'إعدادات المستخدمين', href: '/dashboard/settings/users' },
				{ name: 'الصلاحيات والأدوار', href: '/dashboard/settings/roles' },
				{ name: 'قياسات الثياب', href: '/dashboard/settings/measurements' },
				{ name: 'الضرائب والرسوم', href: '/dashboard/settings/taxes' },
				{ name: 'النسخ الإحتياطي', href: '/dashboard/settings/backup' },
				{ name: 'سجل النظام', href: '/dashboard/settings/logs' },
				{ name: 'تخصيص النظام', href: '/dashboard/settings/customization' },
			],
		},
		{
			name: 'المساعدة والدعم',
			href: '/dashboard/support',
			icon: HelpCircle,
			isExpandable: true,
			subItems: [
				{ name: 'دليل الاستخدام', href: '/dashboard/support/guide' },
				{ name: 'الأسئلة الشائعة', href: '/dashboard/support/faq' },
				{ name: 'التواصل مع الدعم', href: '/dashboard/support/contact' },
				{ name: 'تقديم اقتراحات', href: '/dashboard/support/suggestions' },
			],
		},
		{
			name: 'الإشعارات',
			href: '/dashboard/notifications',
			icon: Bell,
			isExpandable: false,
		},
		{
			name: 'الملف الشخصي',
			href: '/dashboard/profile',
			icon: Users,
			isExpandable: false,
		},
	];

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const isActive = (href: string) => {
		return pathname === href || pathname.startsWith(href + '/');
	};

	interface NavItem {
		name: string;
		href: string;
		icon: React.ElementType;
		isExpandable: boolean;
		subItems?: Array<{ name: string; href: string }>;
	}

	const renderNavItem = (item: NavItem) => {
		const active = isActive(item.href);
		const isExpanded = expandedItems[item.name];

		return (
			<li key={item.name}>
				<div className={`flex flex-col`}>
					{item.isExpandable ? (
						// For expandable items - use div with onClick
						<div
							className={`flex items-center justify-between px-4 py-3 rounded-md cursor-pointer ${
								active ? 'bg-green-900 text-white' : 'text-white hover:bg-green-700'
							}`}
							onClick={() => toggleExpand(item.name)}
						>
							<div className='flex items-center gap-3'>
								<item.icon size={20} />
								<span>{item.name}</span>
							</div>
							<span
								className='transform transition-transform duration-200'
								style={{
									transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
								}}
							>
								›
							</span>
						</div>
					) : (
						// For non-expandable items - use Link for navigation
						<Link
							href={item.href}
							className={`flex items-center justify-between px-4 py-3 rounded-md cursor-pointer ${
								active ? 'bg-green-900 text-white' : 'text-white hover:bg-green-700'
							}`}
						>
							<div className='flex items-center gap-3'>
								<item.icon size={20} />
								<span>{item.name}</span>
							</div>
						</Link>
					)}

					{item.isExpandable && isExpanded && item.subItems && (
						<ul className='mr-6 mt-1 space-y-1 border-r-2 border-green-600 pr-2'>
							{item.subItems.map((subItem) => (
								<li key={subItem.href}>
									<Link
										href={subItem.href}
										className={`flex items-center px-4 py-2 rounded-md text-sm ${
											isActive(subItem.href)
												? 'bg-green-700 text-white'
												: 'text-gray-200 hover:bg-green-700'
										}`}
									>
										{subItem.name}
									</Link>
								</li>
							))}
						</ul>
					)}
				</div>
			</li>
		);
	};
	return (
		<>
			{/* Mobile menu button */}
			<div className='md:hidden fixed top-4 right-4 z-50'>
				<button
					onClick={toggleMobileMenu}
					className='p-2 rounded-md bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-white'
				>
					{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
				</button>
			</div>

			{/* Mobile Sidebar */}
			{isMobileMenuOpen && (
				<div className='fixed inset-0 bg-gray-800 bg-opacity-75 z-40 md:hidden'>
					<div className='fixed inset-y-0 right-0 max-w-xs w-full bg-green-800 text-white shadow-xl z-50 overflow-y-auto'>
						<div className='p-6'>
							<div className='flex items-center justify-between'>
								<h1 className='text-2xl font-bold'>ثوب ماستر</h1>
								<button
									onClick={toggleMobileMenu}
									className='p-2 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-white'
								>
									<X size={24} />
								</button>
							</div>
							<div className='relative mt-4 mb-6'>
								<input
									type='text'
									placeholder='بحث سريع...'
									className='w-full bg-green-900 text-white border border-green-700 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-green-500'
								/>
								<Search className='absolute left-3 top-2.5 h-5 w-5 text-green-500' />
							</div>
							<nav className='mt-6'>
								<ul className='space-y-2'>{navigation.map(renderNavItem)}</ul>
							</nav>
						</div>
					</div>
				</div>
			)}

			{/* Desktop Sidebar */}
			<div className='h-screen w-64 bg-green-800 text-white hidden md:block sticky top-0 overflow-y-auto'>
				<div className='p-6'>
					<h1 className='text-2xl font-bold'>ثوب ماستر</h1>
				</div>
				<div className='px-4 mb-6'>
					<div className='relative'>
						<input
							type='text'
							placeholder='بحث سريع...'
							className='w-full bg-green-900 text-white border border-green-700 rounded-lg py-2 pr-10 pl-4 focus:outline-none focus:ring-2 focus:ring-green-500'
						/>
						<Search className='absolute left-3 top-2.5 h-5 w-5 text-green-500' />
					</div>
				</div>
				<nav className='mt-2 pb-8'>
					<ul className='space-y-1 px-2'>{navigation.map(renderNavItem)}</ul>
				</nav>
			</div>
		</>
	);
}
