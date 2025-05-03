'use client';

import {
	Check,
	Clock,
	Coffee,
	CreditCard,
	DollarSign,
	FileText,
	Package,
	Plus,
	RefreshCw,
	Search,
	ShoppingCart,
	Trash,
	User,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { JSX, useEffect, useState } from 'react';

interface Product {
	id: string;
	name: string;
	sku: string;
	price: number;
	cost: number;
	discountedPrice?: number;
	taxRate: number;
	inventory: number;
	category: string;
	imageUrl?: string;
}

interface Customer {
	id: string;
	name: string;
	phone: string;
	email?: string;
	balance: number;
	points: number;
	type: 'regular' | 'vip' | 'wholesale';
	lastVisit: string;
}

interface CartItem {
	product: Product;
	quantity: number;
	notes?: string;
	discount?: {
		type: 'percentage' | 'fixed';
		value: number;
	};
}

interface PaymentMethod {
	id: string;
	name: string;
	type: 'cash' | 'card' | 'bankTransfer' | 'digital' | 'credit';
	icon: JSX.Element;
}

export default function POSPage() {
	// حالة السلة
	const [cart, setCart] = useState<CartItem[]>([]);
	const [customer, setCustomer] = useState<Customer | null>(null);
	const [showCustomerSearch, setShowCustomerSearch] = useState(false);
	const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
	const [amountPaid, setAmountPaid] = useState<number>(0);

	// حالة البحث عن المنتجات
	const [searchTerm, setSearchTerm] = useState('');
	const [searchResults, setSearchResults] = useState<Product[]>([]);
	const [categoryFilter, setCategoryFilter] = useState('all');
	const [isCategoryActive, setIsCategoryActive] = useState<Record<string, boolean>>({});

	// قائمة بالمنتجات والفئات للعرض
	const [products, setProducts] = useState<Product[]>([]);
	const [categories, setCategories] = useState<string[]>([]);
	const [recentProducts, setRecentProducts] = useState<Product[]>([]);

	// حالة إكمال الطلب
	const [isCheckingOut, setIsCheckingOut] = useState(false);

	// حالة تحميل البيانات
	const [loading, setLoading] = useState(true);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			await new Promise((resolve) => setTimeout(resolve, 800)); // تأخير للمحاكاة

			// بيانات تجريبية للمنتجات
			const mockProducts: Product[] = [
				{
					id: 'prod-001',
					name: 'ثوب كلاسيك',
					sku: 'TH-CL-001',
					price: 450,
					cost: 300,
					taxRate: 15,
					inventory: 25,
					category: 'الثياب',
				},
				{
					id: 'prod-002',
					name: 'بشت صيفي',
					sku: 'BS-SM-002',
					price: 850,
					cost: 600,
					discountedPrice: 750,
					taxRate: 15,
					inventory: 15,
					category: 'البشوت',
				},
				{
					id: 'prod-003',
					name: 'شماغ أحمر',
					sku: 'SH-RD-003',
					price: 120,
					cost: 75,
					taxRate: 15,
					inventory: 50,
					category: 'الاكسسوارات',
				},
				{
					id: 'prod-004',
					name: 'عقال أسود',
					sku: 'AG-BL-004',
					price: 80,
					cost: 45,
					taxRate: 15,
					inventory: 40,
					category: 'الاكسسوارات',
				},
				{
					id: 'prod-005',
					name: 'ثوب إماراتي',
					sku: 'TH-EM-005',
					price: 500,
					cost: 350,
					taxRate: 15,
					inventory: 20,
					category: 'الثياب',
				},
				{
					id: 'prod-006',
					name: 'بشت شتوي فاخر',
					sku: 'BS-WN-006',
					price: 1200,
					cost: 850,
					taxRate: 15,
					inventory: 8,
					category: 'البشوت',
				},
				{
					id: 'prod-007',
					name: 'شماغ أبيض',
					sku: 'SH-WT-007',
					price: 120,
					cost: 75,
					taxRate: 15,
					inventory: 45,
					category: 'الاكسسوارات',
				},
				{
					id: 'prod-008',
					name: 'قميص رسمي',
					sku: 'QM-FR-008',
					price: 180,
					cost: 110,
					discountedPrice: 150,
					taxRate: 15,
					inventory: 30,
					category: 'القمصان',
				},
				{
					id: 'prod-009',
					name: 'ثوب مغربي',
					sku: 'TH-MG-009',
					price: 550,
					cost: 380,
					taxRate: 15,
					inventory: 12,
					category: 'الثياب',
				},
				{
					id: 'prod-010',
					name: 'قميص كاجوال',
					sku: 'QM-CS-010',
					price: 150,
					cost: 90,
					taxRate: 15,
					inventory: 35,
					category: 'القمصان',
				},
			];

			// استخلاص الفئات
			const uniqueCategories = Array.from(new Set(mockProducts.map((product) => product.category)));

			setProducts(mockProducts);
			setCategories(uniqueCategories);

			// افتراض المنتجات الأخيرة المباعة
			setRecentProducts([mockProducts[1], mockProducts[3], mockProducts[8], mockProducts[9]]);

			// جعل الفئة الأولى نشطة افتراضياً
			const initialCategoryActive: Record<string, boolean> = {};
			uniqueCategories.forEach((category, index) => {
				initialCategoryActive[category] = index === 0;
			});
			setIsCategoryActive(initialCategoryActive);

			setCategoryFilter(uniqueCategories[0]); // تعيين الفئة الأولى كفلتر افتراضي

			setLoading(false);
		};

		fetchData();
	}, []);

	// تحديث نتائج البحث عند تغيير مصطلح البحث أو الفئة
	useEffect(() => {
		let filtered = [...products];

		// تطبيق فلتر الفئة
		if (categoryFilter !== 'all') {
			filtered = filtered.filter((product) => product.category === categoryFilter);
		}

		// تطبيق فلتر البحث
		if (searchTerm) {
			filtered = filtered.filter(
				(product) =>
					product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					product.sku.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		setSearchResults(filtered);
	}, [searchTerm, categoryFilter, products]);

	// إضافة منتج إلى السلة
	const addToCart = (product: Product) => {
		setCart((prevCart) => {
			// التحقق إذا كان المنتج موجود بالفعل في السلة
			const existingItemIndex = prevCart.findIndex((item) => item.product.id === product.id);

			if (existingItemIndex >= 0) {
				// تحديث الكمية إذا كان المنتج موجوداً بالفعل
				const updatedCart = [...prevCart];
				updatedCart[existingItemIndex] = {
					...updatedCart[existingItemIndex],
					quantity: updatedCart[existingItemIndex].quantity + 1,
				};
				return updatedCart;
			} else {
				// إضافة المنتج كعنصر جديد في السلة
				return [...prevCart, { product, quantity: 1 }];
			}
		});
	};

	// إزالة منتج من السلة
	const removeFromCart = (productId: string) => {
		setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
	};

	// تحديث كمية منتج في السلة
	const updateQuantity = (productId: string, newQuantity: number) => {
		if (newQuantity < 1) return;

		setCart((prevCart) =>
			prevCart.map((item) => (item.product.id === productId ? { ...item, quantity: newQuantity } : item))
		);
	};

	// إضافة ملاحظة على منتج في السلة
	const addNoteToItem = (productId: string, note: string) => {
		setCart((prevCart) =>
			prevCart.map((item) => (item.product.id === productId ? { ...item, notes: note } : item))
		);
	};

	// إضافة خصم على منتج في السلة
	const addDiscountToItem = (productId: string, discountType: 'percentage' | 'fixed', value: number) => {
		setCart((prevCart) =>
			prevCart.map((item) =>
				item.product.id === productId
					? {
							...item,
							discount: { type: discountType, value },
					  }
					: item
			)
		);
	};

	// حساب مجموع السلة
	const calculateSubtotal = () => {
		return cart.reduce((sum, item) => {
			const itemPrice = item.product.discountedPrice || item.product.price;
			let finalPrice = itemPrice;

			// تطبيق الخصم على المنتج إذا وجد
			if (item.discount) {
				if (item.discount.type === 'percentage') {
					finalPrice = finalPrice * (1 - item.discount.value / 100);
				} else {
					finalPrice = Math.max(0, finalPrice - item.discount.value);
				}
			}

			return sum + finalPrice * item.quantity;
		}, 0);
	};

	// حساب الضريبة
	const calculateTax = () => {
		return cart.reduce((sum, item) => {
			const itemPrice = item.product.discountedPrice || item.product.price;
			let finalPrice = itemPrice;

			// تطبيق الخصم على المنتج إذا وجد
			if (item.discount) {
				if (item.discount.type === 'percentage') {
					finalPrice = finalPrice * (1 - item.discount.value / 100);
				} else {
					finalPrice = Math.max(0, finalPrice - item.discount.value);
				}
			}

			return sum + ((finalPrice * item.product.taxRate) / 100) * item.quantity;
		}, 0);
	};

	// حساب الإجمالي
	const calculateTotal = () => {
		return calculateSubtotal() + calculateTax();
	};

	// حساب الباقي
	const calculateChange = () => {
		return amountPaid - calculateTotal();
	};

	// طرق الدفع المتاحة
	const paymentMethods: PaymentMethod[] = [
		{ id: 'cash', name: 'نقداً', type: 'cash', icon: <DollarSign className='h-5 w-5' /> },
		{ id: 'card', name: 'بطاقة ائتمانية', type: 'card', icon: <CreditCard className='h-5 w-5' /> },
		{ id: 'stcpay', name: 'STC Pay', type: 'digital', icon: <DollarSign className='h-5 w-5' /> },
		{ id: 'transfer', name: 'تحويل بنكي', type: 'bankTransfer', icon: <DollarSign className='h-5 w-5' /> },
	];

	// معالجة عملية الدفع
	const handleCheckout = () => {
		// هنا يتم معالجة عملية الدفع والتحقق من صحة البيانات
		// ثم إرسال الطلب إلى الخادم وإنشاء فاتورة جديدة

		alert('تمت عملية الدفع بنجاح وتم إنشاء الفاتورة.');

		// إعادة تعيين حالة السلة
		setCart([]);
		setCustomer(null);
		setSelectedPaymentMethod(null);
		setAmountPaid(0);
		setIsCheckingOut(false);
	};

	// البحث عن عميل
	const mockCustomers: Customer[] = [
		{
			id: 'cust-001',
			name: 'محمد عبدالله',
			phone: '0501234567',
			email: 'mohammed@example.com',
			balance: 0,
			points: 150,
			type: 'regular',
			lastVisit: '2023-09-15',
		},
		{
			id: 'cust-002',
			name: 'خالد العمري',
			phone: '0559876543',
			email: 'khalid@example.com',
			balance: 500,
			points: 350,
			type: 'vip',
			lastVisit: '2023-10-02',
		},
		{
			id: 'cust-003',
			name: 'فهد السالم',
			phone: '0567891234',
			balance: 0,
			points: 80,
			type: 'regular',
			lastVisit: '2023-10-01',
		},
		{
			id: 'cust-004',
			name: 'شركة الأفق للتجارة',
			phone: '0543216789',
			email: 'info@horizon.com',
			balance: 3500,
			points: 1200,
			type: 'wholesale',
			lastVisit: '2023-09-28',
		},
	];

	const selectCustomer = (selectedCustomer: Customer) => {
		setCustomer(selectedCustomer);
		setShowCustomerSearch(false);
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500'></div>
			</div>
		);
	}

	return (
		<div className='flex flex-col h-screen overflow-hidden'>
			{/* رأس الصفحة */}
			<div className='bg-white border-b border-gray-200 p-4'>
				<div className='flex items-center justify-between'>
					<h1 className='text-xl font-bold text-gray-900 flex items-center'>
						<ShoppingCart className='inline-block ml-2 h-6 w-6 text-indigo-600' />
						نقطة البيع
					</h1>

					<div className='flex items-center gap-2'>
						<div className='relative'>
							<div className='flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50'>
								<Coffee className='h-4 w-4 text-gray-500 ml-1' />
								<span className='text-sm text-gray-700'>فرع الرياض</span>
							</div>
						</div>

						<div className='relative'>
							<div className='flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-gray-50'>
								<Clock className='h-4 w-4 text-gray-500 ml-1' />
								<span className='text-sm text-gray-700'>
									{new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
								</span>
							</div>
						</div>

						<Link
							href='/dashboard/sales/invoices'
							className='px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center text-sm'
						>
							<FileText className='ml-1 h-4 w-4' />
							الفواتير
						</Link>

						<button
							onClick={() => setCart([])}
							className='px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center text-sm'
						>
							<RefreshCw className='ml-1 h-4 w-4' />
							فاتورة جديدة
						</button>
					</div>
				</div>
			</div>

			{/* المحتوى الرئيسي */}
			<div className='flex flex-1 overflow-hidden'>
				{/* قسم المنتجات */}
				<div className='w-2/3 bg-gray-50 overflow-y-auto'>
					{/* شريط البحث والفلاتر */}
					<div className='sticky top-0 z-10 bg-white p-4 border-b border-gray-200'>
						<div className='relative mb-4'>
							<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
								<Search className='h-5 w-5 text-gray-400' />
							</div>
							<input
								type='text'
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder='ابحث باسم المنتج أو الرمز...'
								className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
							/>
						</div>

						{/* فلاتر الفئات */}
						<div className='flex overflow-x-auto pb-2 -mx-1'>
							<button
								onClick={() => setCategoryFilter('all')}
								className={`px-3 py-1.5 mx-1 rounded-full text-sm whitespace-nowrap ${
									categoryFilter === 'all'
										? 'bg-indigo-600 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								الكل
							</button>

							{categories.map((category) => (
								<button
									key={category}
									onClick={() => setCategoryFilter(category)}
									className={`px-3 py-1.5 mx-1 rounded-full text-sm whitespace-nowrap ${
										categoryFilter === category
											? 'bg-indigo-600 text-white'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
								>
									{category}
								</button>
							))}
						</div>
					</div>

					{/* المنتجات الأخيرة المباعة */}
					{searchTerm === '' && categoryFilter === 'all' && (
						<div className='p-4'>
							<h2 className='text-sm font-medium text-gray-700 mb-3'>المنتجات الأخيرة المباعة</h2>
							<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
								{recentProducts.map((product) => (
									<div
										key={product.id}
										onClick={() => addToCart(product)}
										className='bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow'
									>
										<div className='relative'>
											<div className='h-28 bg-gray-100 rounded-md mb-2 flex items-center justify-center text-gray-400'>
												<Package className='h-10 w-10' />
											</div>
											{product.discountedPrice && (
												<div className='absolute top-0 left-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-bl-md rounded-tr-md'>
													خصم
												</div>
											)}
										</div>
										<h3 className='text-sm font-medium text-gray-900 mb-1 line-clamp-1'>
											{product.name}
										</h3>
										<div className='flex items-center justify-between'>
											<div>
												{product.discountedPrice ? (
													<div className='flex flex-col'>
														<span className='text-xs text-gray-500 line-through'>
															{product.price} ر.س
														</span>
														<span className='text-sm font-medium text-red-600'>
															{product.discountedPrice} ر.س
														</span>
													</div>
												) : (
													<span className='text-sm font-medium text-gray-900'>
														{product.price} ر.س
													</span>
												)}
											</div>
											<span className='text-xs text-gray-500'>المخزون: {product.inventory}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* نتائج البحث / المنتجات حسب الفئة */}
					<div className='p-4'>
						{(searchTerm !== '' || categoryFilter !== 'all') && (
							<h2 className='text-sm font-medium text-gray-700 mb-3'>
								{searchTerm !== '' ? `نتائج البحث عن "${searchTerm}"` : `منتجات ${categoryFilter}`}{' '}
								<span className='text-gray-500'>({searchResults.length})</span>
							</h2>
						)}

						{searchResults.length > 0 ? (
							<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
								{searchResults.map((product) => (
									<div
										key={product.id}
										onClick={() => addToCart(product)}
										className={`bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow ${
											product.inventory === 0 ? 'opacity-60' : ''
										}`}
									>
										<div className='relative'>
											<div className='h-28 bg-gray-100 rounded-md mb-2 flex items-center justify-center text-gray-400'>
												<Package className='h-10 w-10' />
											</div>
											{product.discountedPrice && (
												<div className='absolute top-0 left-0 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-bl-md rounded-tr-md'>
													خصم
												</div>
											)}
											{product.inventory === 0 && (
												<div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md'>
													<span className='text-white font-bold'>نفذت الكمية</span>
												</div>
											)}
										</div>
										<h3 className='text-sm font-medium text-gray-900 mb-1 line-clamp-1'>
											{product.name}
										</h3>
										<div className='text-xs text-gray-500 mb-1 line-clamp-1'>
											الرمز: {product.sku}
										</div>
										<div className='flex items-center justify-between'>
											<div>
												{product.discountedPrice ? (
													<div className='flex flex-col'>
														<span className='text-xs text-gray-500 line-through'>
															{product.price} ر.س
														</span>
														<span className='text-sm font-medium text-red-600'>
															{product.discountedPrice} ر.س
														</span>
													</div>
												) : (
													<span className='text-sm font-medium text-gray-900'>
														{product.price} ر.س
													</span>
												)}
											</div>
											<span
												className={`text-xs ${
													product.inventory < 5 ? 'text-red-500' : 'text-gray-500'
												}`}
											>
												المخزون: {product.inventory}
											</span>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='bg-white p-10 rounded-lg border border-gray-200 text-center'>
								<Search className='h-10 w-10 text-gray-300 mx-auto mb-2' />
								<h3 className='text-lg font-medium text-gray-900'>لا توجد منتجات</h3>
								<p className='mt-1 text-gray-500'>
									{searchTerm !== ''
										? `لم نتمكن من العثور على نتائج تطابق "${searchTerm}"`
										: `لا توجد منتجات في فئة ${categoryFilter}`}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* قسم السلة */}
				<div className='w-1/3 border-r border-gray-200 flex flex-col bg-white'>
					{/* معلومات العميل */}
					<div className='p-4 border-b border-gray-200'>
						{customer ? (
							<div className='flex justify-between items-start'>
								<div>
									<h3 className='text-sm font-medium text-gray-900'>{customer.name}</h3>
									<p className='text-xs text-gray-500'>{customer.phone}</p>
									<div className='flex items-center mt-1'>
										<span
											className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
												customer.type === 'vip'
													? 'bg-indigo-100 text-indigo-800'
													: customer.type === 'wholesale'
													? 'bg-blue-100 text-blue-800'
													: 'bg-green-100 text-green-800'
											}`}
										>
											{customer.type === 'vip'
												? 'عميل VIP'
												: customer.type === 'wholesale'
												? 'عميل جملة'
												: 'عميل عادي'}
										</span>
										{customer.points > 0 && (
											<span className='mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800'>
												{customer.points} نقطة
											</span>
										)}
									</div>
								</div>
								<button onClick={() => setCustomer(null)} className='text-gray-400 hover:text-gray-500'>
									<X className='h-4 w-4' />
								</button>
							</div>
						) : (
							<button
								onClick={() => setShowCustomerSearch(true)}
								className='flex items-center justify-center w-full py-2 border border-gray-300 rounded-md hover:bg-gray-50'
							>
								<User className='ml-2 h-4 w-4 text-gray-500' />
								<span className='text-sm text-gray-700'>إضافة عميل</span>
							</button>
						)}
					</div>

					{/* عناصر السلة */}
					<div className='flex-grow overflow-y-auto'>
						{cart.length > 0 ? (
							<div className='divide-y divide-gray-200'>
								{cart.map((item) => (
									<div key={item.product.id} className='p-4 hover:bg-gray-50'>
										<div className='flex justify-between mb-2'>
											<div className='flex-1'>
												<h3 className='text-sm font-medium text-gray-900'>
													{item.product.name}
												</h3>
												<div className='text-xs text-gray-500'>{item.product.sku}</div>
											</div>
											<button
												onClick={() => removeFromCart(item.product.id)}
												className='text-gray-400 hover:text-red-500'
											>
												<Trash className='h-4 w-4' />
											</button>
										</div>

										<div className='flex items-center justify-between mb-2'>
											<div className='flex items-center border border-gray-300 rounded-md'>
												<button
													onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
													className='px-2 py-1 text-gray-500 hover:bg-gray-100'
												>
													-
												</button>
												<span className='px-2 py-1 text-gray-700 min-w-[2rem] text-center'>
													{item.quantity}
												</span>
												<button
													onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
													className='px-2 py-1 text-gray-500 hover:bg-gray-100'
												>
													+
												</button>
											</div>

											<div className='text-left'>
												{item.discount ? (
													<div>
														<div className='text-xs text-gray-500 line-through'>
															{(
																(item.product.discountedPrice || item.product.price) *
																item.quantity
															).toFixed(2)}{' '}
															ر.س
														</div>
														<div className='text-sm font-medium text-red-600'>
															{(
																(item.product.discountedPrice || item.product.price) *
																(item.discount.type === 'percentage'
																	? 1 - item.discount.value / 100
																	: 1 -
																	  item.discount.value /
																			(item.product.discountedPrice ||
																				item.product.price)) *
																item.quantity
															).toFixed(2)}{' '}
															ر.س
														</div>
													</div>
												) : (
													<div className='text-sm font-medium'>
														{(
															(item.product.discountedPrice || item.product.price) *
															item.quantity
														).toFixed(2)}{' '}
														ر.س
													</div>
												)}
											</div>
										</div>

										{item.notes && (
											<div className='mt-1 text-xs text-gray-500 bg-gray-50 p-1 rounded'>
												ملاحظة: {item.notes}
											</div>
										)}

										<div className='mt-2 flex justify-between text-xs'>
											<button
												onClick={() => {
													const note = prompt('أدخل ملاحظة للمنتج:', item.notes || '');
													if (note !== null) {
														addNoteToItem(item.product.id, note);
													}
												}}
												className='text-gray-500 hover:text-indigo-600'
											>
												{item.notes ? 'تعديل الملاحظة' : 'إضافة ملاحظة'}
											</button>

											<button
												onClick={() => {
													const discountValue = parseFloat(
														prompt(
															'أدخل قيمة الخصم:',
															item.discount ? String(item.discount.value) : '0'
														) || '0'
													);

													if (discountValue > 0) {
														const discountType = confirm('هل الخصم نسبة مئوية؟')
															? 'percentage'
															: 'fixed';
														addDiscountToItem(item.product.id, discountType, discountValue);
													} else if (discountValue === 0) {
														// إزالة الخصم
														setCart((prevCart) =>
															prevCart.map((cartItem) =>
																cartItem.product.id === item.product.id
																	? { ...cartItem, discount: undefined }
																	: cartItem
															)
														);
													}
												}}
												className='text-gray-500 hover:text-indigo-600'
											>
												{item.discount ? 'تعديل الخصم' : 'إضافة خصم'}
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className='flex flex-col items-center justify-center h-full text-center p-4'>
								<ShoppingCart className='h-12 w-12 text-gray-300 mb-2' />
								<h3 className='text-lg font-medium text-gray-900'>السلة فارغة</h3>
								<p className='mt-1 text-gray-500'>قم بإضافة منتجات للسلة للبدء في عملية البيع</p>
							</div>
						)}
					</div>

					{/* ملخص السلة وزر الدفع */}
					{cart.length > 0 && (
						<div className='border-t border-gray-200 p-4 bg-gray-50'>
							<div className='space-y-2'>
								<div className='flex justify-between text-sm'>
									<span className='text-gray-500'>المجموع الفرعي:</span>
									<span className='font-medium'>{calculateSubtotal().toFixed(2)} ر.س</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-gray-500'>الضريبة ({15}%):</span>
									<span className='font-medium'>{calculateTax().toFixed(2)} ر.س</span>
								</div>
								<div className='border-t border-gray-200 pt-2 flex justify-between text-base'>
									<span className='font-medium'>الإجمالي:</span>
									<span className='font-bold'>{calculateTotal().toFixed(2)} ر.س</span>
								</div>
							</div>

							<button
								onClick={() => setIsCheckingOut(true)}
								className='mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center'
							>
								<CreditCard className='ml-2 h-5 w-5' />
								متابعة الدفع
							</button>
						</div>
					)}
				</div>
			</div>

			{/* نافذة البحث عن العملاء */}
			{showCustomerSearch && (
				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
						<div className='fixed inset-0 transition-opacity' onClick={() => setShowCustomerSearch(false)}>
							<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
						</div>

						<div className='inline-block align-middle bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
							<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								<div className='mb-4'>
									<h3 className='text-lg font-medium text-gray-900'>اختيار عميل</h3>
									<p className='mt-1 text-sm text-gray-500'>
										ابحث واختر عميلاً أو قم بإضافة عميل جديد
									</p>
								</div>

								<div className='relative mb-4'>
									<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
										<Search className='h-5 w-5 text-gray-400' />
									</div>
									<input
										type='text'
										placeholder='ابحث باسم العميل أو رقم الهاتف...'
										className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
									/>
								</div>

								<div className='max-h-64 overflow-y-auto'>
									<div className='space-y-2'>
										{mockCustomers.map((customer) => (
											<div
												key={customer.id}
												onClick={() => selectCustomer(customer)}
												className='border border-gray-200 rounded-md p-3 hover:bg-gray-50 cursor-pointer'
											>
												<div className='flex justify-between'>
													<div>
														<h4 className='text-sm font-medium text-gray-900'>
															{customer.name}
														</h4>
														<p className='text-xs text-gray-500'>{customer.phone}</p>
													</div>
													<div className='flex items-center'>
														<span
															className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
																customer.type === 'vip'
																	? 'bg-indigo-100 text-indigo-800'
																	: customer.type === 'wholesale'
																	? 'bg-blue-100 text-blue-800'
																	: 'bg-green-100 text-green-800'
															}`}
														>
															{customer.type === 'vip'
																? 'عميل VIP'
																: customer.type === 'wholesale'
																? 'عميل جملة'
																: 'عميل عادي'}
														</span>
													</div>
												</div>
												<div className='mt-1 flex items-center text-xs text-gray-500'>
													<span className='ml-2'>النقاط: {customer.points}</span>
													<span>
														آخر زيارة:{' '}
														{new Date(customer.lastVisit).toLocaleDateString('ar-SA')}
													</span>
												</div>
											</div>
										))}
									</div>
								</div>
							</div>

							<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
								<button
									type='button'
									className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
								>
									<Plus className='ml-1 h-4 w-4' />
									إضافة عميل جديد
								</button>
								<button
									type='button'
									onClick={() => setShowCustomerSearch(false)}
									className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
								>
									إلغاء
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* نافذة الدفع */}
			{isCheckingOut && (
				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
						<div className='fixed inset-0 transition-opacity' onClick={() => setIsCheckingOut(false)}>
							<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
						</div>

						<div className='inline-block align-middle bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
							<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								<div className='mb-4'>
									<h3 className='text-lg font-medium text-gray-900'>إتمام عملية الدفع</h3>
									<p className='mt-1 text-sm text-gray-500'>اختر طريقة الدفع وأدخل المبلغ المدفوع</p>
								</div>

								<div className='mb-4'>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										اختر طريقة الدفع
									</label>
									<div className='grid grid-cols-2 gap-2'>
										{paymentMethods.map((method) => (
											<div
												key={method.id}
												onClick={() => setSelectedPaymentMethod(method)}
												className={`border rounded-md p-2 flex items-center cursor-pointer ${
													selectedPaymentMethod?.id === method.id
														? 'border-indigo-600 bg-indigo-50'
														: 'border-gray-300 hover:bg-gray-50'
												}`}
											>
												<div
													className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
														selectedPaymentMethod?.id === method.id
															? 'bg-indigo-100 text-indigo-600'
															: 'bg-gray-100 text-gray-600'
													} ml-2`}
												>
													{method.icon}
												</div>
												<span className='text-sm font-medium text-gray-900'>{method.name}</span>
											</div>
										))}
									</div>
								</div>

								<div className='mb-4'>
									<label
										htmlFor='amountPaid'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										المبلغ المدفوع
									</label>
									<div className='mt-1 relative rounded-md shadow-sm'>
										<input
											type='number'
											id='amountPaid'
											value={amountPaid === 0 ? '' : amountPaid}
											onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
											placeholder='أدخل المبلغ المدفوع'
											className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
										/>
										<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
											<span className='text-gray-500 sm:text-sm'>ر.س</span>
										</div>
									</div>
								</div>

								<div className='bg-gray-50 p-3 rounded-md mb-4'>
									<div className='flex justify-between text-sm mb-2'>
										<span className='text-gray-500'>الإجمالي:</span>
										<span className='font-medium'>{calculateTotal().toFixed(2)} ر.س</span>
									</div>
									<div className='flex justify-between text-sm mb-2'>
										<span className='text-gray-500'>المبلغ المدفوع:</span>
										<span className='font-medium'>{amountPaid.toFixed(2)} ر.س</span>
									</div>
									<div className='flex justify-between text-sm pt-2 border-t border-gray-200'>
										<span className='text-gray-700 font-medium'>
											{calculateChange() >= 0 ? 'المبلغ المتبقي:' : 'المبلغ الناقص:'}
										</span>
										<span
											className={`font-bold ${
												calculateChange() >= 0 ? 'text-green-600' : 'text-red-600'
											}`}
										>
											{Math.abs(calculateChange()).toFixed(2)} ر.س
										</span>
									</div>
								</div>

								{customer && (
									<div className='bg-indigo-50 p-3 rounded-md border border-indigo-100'>
										<div className='flex items-center mb-1'>
											<User className='h-4 w-4 text-indigo-500 ml-1' />
											<span className='text-sm font-medium text-indigo-700'>تفاصيل العميل</span>
										</div>
										<div className='text-xs text-indigo-600'>
											<p>
												{customer.name} - {customer.phone}
											</p>
											<p className='mt-1'>
												النقاط الحالية: {customer.points} - سيحصل على{' '}
												{Math.floor(calculateTotal() / 50)} نقطة جديدة
											</p>
										</div>
									</div>
								)}
							</div>

							<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
								<button
									type='button'
									onClick={handleCheckout}
									disabled={!selectedPaymentMethod || calculateChange() < 0}
									className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
										!selectedPaymentMethod || calculateChange() < 0
											? 'bg-gray-400 cursor-not-allowed'
											: 'bg-indigo-600 hover:bg-indigo-700'
									}`}
								>
									<Check className='ml-1 h-4 w-4' />
									إتمام عملية البيع
								</button>
								<button
									type='button'
									onClick={() => setIsCheckingOut(false)}
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
