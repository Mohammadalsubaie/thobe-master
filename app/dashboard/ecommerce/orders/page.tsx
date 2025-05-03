'use client';

import {
	ArrowLeft,
	ArrowRight,
	BarChart2,
	ChevronDown,
	Clock,
	DollarSign,
	Download,
	Eye,
	Mail,
	MapPin,
	MessageSquare,
	MoreHorizontal,
	Package,
	Phone,
	Printer,
	RefreshCw,
	Search,
	ShoppingBag,
	Truck,
	User,
	X,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Order {
	id: string;
	orderNumber: string;
	date: string;
	customer: {
		id: string;
		name: string;
		email: string;
		phone: string;
	};
	total: number;
	status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
	paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
	paymentMethod: string;
	shippingMethod: string;
	items: {
		id: string;
		name: string;
		sku: string;
		quantity: number;
		price: number;
		total: number;
		options?: {
			name: string;
			value: string;
		}[];
	}[];
	shippingAddress: {
		city: string;
		area: string;
		address: string;
		postalCode?: string;
	};
	notes?: string;
	trackingNumber?: string;
	estimatedDelivery?: string;
	updatedAt: string;
}

interface OrderStats {
	totalOrders: number;
	pendingOrders: number;
	processingOrders: number;
	shippedOrders: number;
	deliveredOrders: number;
	cancelledOrders: number;
	totalRevenue: number;
	averageOrderValue: number;
}

export default function StoreOrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
	const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
	const [showUpdateStatus, setShowUpdateStatus] = useState(false);
	const [stats, setStats] = useState<OrderStats | null>(null);

	// حالة الفلترة
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
	const [dateFilter, setDateFilter] = useState('all');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	// حالة جديدة لتحديث الحالة
	const [newStatus, setNewStatus] = useState<string>('');
	const [statusNote, setStatusNote] = useState<string>('');
	const [trackingNumber, setTrackingNumber] = useState<string>('');
	const [notifyCustomer, setNotifyCustomer] = useState<boolean>(true);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// بيانات تجريبية للطلبات
			const mockOrders: Order[] = [
				{
					id: 'ord-001',
					orderNumber: 'ORD-20231001-001',
					date: '2023-10-01T14:30:00',
					customer: {
						id: 'cust-001',
						name: 'محمد عبدالله',
						email: 'mohamed@example.com',
						phone: '0501234567',
					},
					total: 850.0,
					status: 'delivered',
					paymentStatus: 'paid',
					paymentMethod: 'بطاقة ائتمانية',
					shippingMethod: 'شحن سريع',
					items: [
						{
							id: 'item-001',
							name: 'ثوب كلاسيكي',
							sku: 'THB-C-001',
							quantity: 2,
							price: 300.0,
							total: 600.0,
							options: [
								{ name: 'اللون', value: 'أبيض' },
								{ name: 'المقاس', value: '54' },
							],
						},
						{
							id: 'item-002',
							name: 'غترة فاخرة',
							sku: 'GTR-P-005',
							quantity: 1,
							price: 250.0,
							total: 250.0,
							options: [{ name: 'النوع', value: 'قطن' }],
						},
					],
					shippingAddress: {
						city: 'الرياض',
						area: 'حي الملقا',
						address: 'شارع الأمير محمد بن سلمان، مبنى 15',
						postalCode: '12345',
					},
					updatedAt: '2023-10-05T09:15:00',
				},
				{
					id: 'ord-002',
					orderNumber: 'ORD-20231002-002',
					date: '2023-10-02T11:20:00',
					customer: {
						id: 'cust-002',
						name: 'فهد سعيد',
						email: 'fahad@example.com',
						phone: '0555556789',
					},
					total: 475.0,
					status: 'shipped',
					paymentStatus: 'paid',
					paymentMethod: 'Apple Pay',
					shippingMethod: 'شحن قياسي',
					items: [
						{
							id: 'item-003',
							name: 'بشت شتوي',
							sku: 'BST-W-002',
							quantity: 1,
							price: 475.0,
							total: 475.0,
							options: [
								{ name: 'اللون', value: 'بني' },
								{ name: 'المقاس', value: '58' },
							],
						},
					],
					shippingAddress: {
						city: 'جدة',
						area: 'حي الصفا',
						address: 'شارع الملك فهد، بجوار مركز الحارثي',
						postalCode: '23456',
					},
					trackingNumber: 'SAM123456789SA',
					estimatedDelivery: '2023-10-09',
					updatedAt: '2023-10-06T14:20:00',
				},
				{
					id: 'ord-003',
					orderNumber: 'ORD-20231003-003',
					date: '2023-10-03T16:45:00',
					customer: {
						id: 'cust-003',
						name: 'خالد الدوسري',
						email: 'khalid@example.com',
						phone: '0567891234',
					},
					total: 1200.0,
					status: 'processing',
					paymentStatus: 'paid',
					paymentMethod: 'بطاقة مدى',
					shippingMethod: 'شحن قياسي',
					items: [
						{
							id: 'item-004',
							name: 'تصميم ثوب خاص',
							sku: 'CST-THB-001',
							quantity: 2,
							price: 600.0,
							total: 1200.0,
							options: [
								{ name: 'نوع القماش', value: 'قطن مصري' },
								{ name: 'التطريز', value: 'ذهبي' },
								{ name: 'المقاس', value: '56' },
							],
						},
					],
					shippingAddress: {
						city: 'الدمام',
						area: 'حي الفيصلية',
						address: 'شارع الأمير فيصل بن فهد، عمارة 23، شقة 4',
					},
					notes: 'أرجو التوصيل مساءً بعد الساعة 6 مساءً',
					updatedAt: '2023-10-06T10:30:00',
				},
				{
					id: 'ord-004',
					orderNumber: 'ORD-20231004-004',
					date: '2023-10-04T09:10:00',
					customer: {
						id: 'cust-004',
						name: 'عبدالرحمن المهنا',
						email: 'abdulrahman@example.com',
						phone: '0512345678',
					},
					total: 320.0,
					status: 'pending',
					paymentStatus: 'pending',
					paymentMethod: 'تحويل بنكي',
					shippingMethod: 'استلام من المتجر',
					items: [
						{
							id: 'item-005',
							name: 'شماغ فاخر',
							sku: 'SHM-P-010',
							quantity: 1,
							price: 320.0,
							total: 320.0,
							options: [{ name: 'الماركة', value: 'الشماغ الملكي' }],
						},
					],
					shippingAddress: {
						city: 'الرياض',
						area: 'حي العليا',
						address: 'فرع العليا مول',
					},
					notes: 'سأقوم بالاستلام شخصياً من الفرع',
					updatedAt: '2023-10-04T09:10:00',
				},
				{
					id: 'ord-005',
					orderNumber: 'ORD-20231005-005',
					date: '2023-10-05T14:20:00',
					customer: {
						id: 'cust-005',
						name: 'سعود الحربي',
						email: 'saud@example.com',
						phone: '0501112233',
					},
					total: 950.0,
					status: 'cancelled',
					paymentStatus: 'refunded',
					paymentMethod: 'بطاقة ائتمانية',
					shippingMethod: 'شحن سريع',
					items: [
						{
							id: 'item-006',
							name: 'ثوب مطرز',
							sku: 'THB-E-007',
							quantity: 1,
							price: 650.0,
							total: 650.0,
							options: [
								{ name: 'اللون', value: 'أسود' },
								{ name: 'المقاس', value: '52' },
							],
						},
						{
							id: 'item-007',
							name: 'عقال مجدول',
							sku: 'EQA-B-003',
							quantity: 1,
							price: 300.0,
							total: 300.0,
						},
					],
					shippingAddress: {
						city: 'الرياض',
						area: 'حي الربيع',
						address: 'شارع الملك سلمان، فيلا 45',
					},
					notes: 'تم إلغاء الطلب بناءً على طلب العميل',
					updatedAt: '2023-10-06T16:45:00',
				},
				{
					id: 'ord-006',
					orderNumber: 'ORD-20231006-006',
					date: '2023-10-06T12:15:00',
					customer: {
						id: 'cust-001',
						name: 'محمد عبدالله',
						email: 'mohamed@example.com',
						phone: '0501234567',
					},
					total: 525.0,
					status: 'delivered',
					paymentStatus: 'paid',
					paymentMethod: 'بطاقة ائتمانية',
					shippingMethod: 'شحن قياسي',
					items: [
						{
							id: 'item-008',
							name: 'عباية رجالية',
							sku: 'ABY-M-005',
							quantity: 1,
							price: 525.0,
							total: 525.0,
							options: [
								{ name: 'اللون', value: 'أسود' },
								{ name: 'المقاس', value: 'XL' },
							],
						},
					],
					shippingAddress: {
						city: 'الرياض',
						area: 'حي الملقا',
						address: 'شارع الأمير محمد بن سلمان، مبنى 15',
					},
					updatedAt: '2023-10-09T11:30:00',
				},
				{
					id: 'ord-007',
					orderNumber: 'ORD-20231007-007',
					date: '2023-10-07T17:05:00',
					customer: {
						id: 'cust-006',
						name: 'ناصر القحطاني',
						email: 'nasser@example.com',
						phone: '0555551234',
					},
					total: 1350.0,
					status: 'processing',
					paymentStatus: 'paid',
					paymentMethod: 'بطاقة مدى',
					shippingMethod: 'شحن سريع',
					items: [
						{
							id: 'item-009',
							name: 'طقم جلابية وسروال',
							sku: 'JLB-S-002',
							quantity: 2,
							price: 400.0,
							total: 800.0,
							options: [
								{ name: 'اللون', value: 'أزرق فاتح' },
								{ name: 'المقاس', value: 'L' },
							],
						},
						{
							id: 'item-010',
							name: 'بشت حفلات',
							sku: 'BST-P-009',
							quantity: 1,
							price: 550.0,
							total: 550.0,
							options: [
								{ name: 'اللون', value: 'ذهبي' },
								{ name: 'المقاس', value: '54' },
							],
						},
					],
					shippingAddress: {
						city: 'أبها',
						area: 'حي الخالدية',
						address: 'شارع الملك خالد، بجوار مدرسة الأمير سلطان',
					},
					updatedAt: '2023-10-08T09:10:00',
				},
				{
					id: 'ord-008',
					orderNumber: 'ORD-20231008-008',
					date: '2023-10-08T10:30:00',
					customer: {
						id: 'cust-007',
						name: 'طارق العتيبي',
						email: 'tariq@example.com',
						phone: '0567897777',
					},
					total: 290.0,
					status: 'pending',
					paymentStatus: 'pending',
					paymentMethod: 'تحويل بنكي',
					shippingMethod: 'شحن قياسي',
					items: [
						{
							id: 'item-011',
							name: 'كبك فضي',
							sku: 'CFK-S-012',
							quantity: 1,
							price: 180.0,
							total: 180.0,
						},
						{
							id: 'item-012',
							name: 'ساعة معصم جلد',
							sku: 'WTC-L-003',
							quantity: 1,
							price: 110.0,
							total: 110.0,
						},
					],
					shippingAddress: {
						city: 'الرياض',
						area: 'حي النخيل',
						address: 'شارع عمر بن الخطاب، عمارة 12، شقة 3',
					},
					updatedAt: '2023-10-08T10:30:00',
				},
				{
					id: 'ord-009',
					orderNumber: 'ORD-20231008-009',
					date: '2023-10-08T15:45:00',
					customer: {
						id: 'cust-008',
						name: 'عبدالعزيز الشمري',
						email: 'abdulaziz@example.com',
						phone: '0512223344',
					},
					total: 750.0,
					status: 'shipped',
					paymentStatus: 'paid',
					paymentMethod: 'Apple Pay',
					shippingMethod: 'شحن سريع',
					items: [
						{
							id: 'item-013',
							name: 'ثوب صيفي',
							sku: 'THB-S-015',
							quantity: 3,
							price: 250.0,
							total: 750.0,
							options: [
								{ name: 'اللون', value: 'بيج فاتح' },
								{ name: 'المقاس', value: '58' },
							],
						},
					],
					shippingAddress: {
						city: 'جدة',
						area: 'حي المروة',
						address: 'شارع حراء، فيلا 27',
					},
					trackingNumber: 'ARL789012345SA',
					estimatedDelivery: '2023-10-12',
					updatedAt: '2023-10-09T14:10:00',
				},
				{
					id: 'ord-010',
					orderNumber: 'ORD-20231009-010',
					date: '2023-10-09T09:20:00',
					customer: {
						id: 'cust-009',
						name: 'ماجد السالم',
						email: 'majed@example.com',
						phone: '0505556677',
					},
					total: 1225.0,
					status: 'refunded',
					paymentStatus: 'refunded',
					paymentMethod: 'بطاقة ائتمانية',
					shippingMethod: 'شحن سريع',
					items: [
						{
							id: 'item-014',
							name: 'بشت شعر الجمل',
							sku: 'BST-C-006',
							quantity: 1,
							price: 900.0,
							total: 900.0,
							options: [
								{ name: 'اللون', value: 'بني داكن' },
								{ name: 'المقاس', value: '56' },
							],
						},
						{
							id: 'item-015',
							name: 'شماغ أحمر',
							sku: 'SHM-R-008',
							quantity: 1,
							price: 325.0,
							total: 325.0,
						},
					],
					shippingAddress: {
						city: 'الخبر',
						area: 'حي الراكة',
						address: 'شارع الملك فيصل، برج الخليج، شقة 1203',
					},
					notes: 'تم إرجاع المنتج بسبب مقاس خاطئ واسترداد المبلغ بالكامل',
					updatedAt: '2023-10-11T13:20:00',
				},
				{
					id: 'ord-011',
					orderNumber: 'ORD-20231010-011',
					date: '2023-10-10T14:15:00',
					customer: {
						id: 'cust-010',
						name: 'سلطان الراشد',
						email: 'sultan@example.com',
						phone: '0555557788',
					},
					total: 1650.0,
					status: 'processing',
					paymentStatus: 'paid',
					paymentMethod: 'بطاقة ائتمانية',
					shippingMethod: 'شحن سريع',
					items: [
						{
							id: 'item-016',
							name: 'سديري مطرز',
							sku: 'SDR-E-010',
							quantity: 1,
							price: 1100.0,
							total: 1100.0,
							options: [
								{ name: 'اللون', value: 'أسود' },
								{ name: 'المقاس', value: '54' },
							],
						},
						{
							id: 'item-017',
							name: 'شماغ فاخر',
							sku: 'SHM-P-012',
							quantity: 1,
							price: 450.0,
							total: 450.0,
						},
						{
							id: 'item-018',
							name: 'طاقية صوف',
							sku: 'CAP-W-005',
							quantity: 1,
							price: 100.0,
							total: 100.0,
						},
					],
					shippingAddress: {
						city: 'الرياض',
						area: 'حي اليرموك',
						address: 'شارع الشفاء، عمارة 34، شقة 7',
					},
					updatedAt: '2023-10-10T16:20:00',
				},
				{
					id: 'ord-012',
					orderNumber: 'ORD-20231011-012',
					date: '2023-10-11T18:30:00',
					customer: {
						id: 'cust-011',
						name: 'راشد الحميدي',
						email: 'rashed@example.com',
						phone: '0567891122',
					},
					total: 425.0,
					status: 'pending',
					paymentStatus: 'pending',
					paymentMethod: 'الدفع عند الاستلام',
					shippingMethod: 'شحن قياسي',
					items: [
						{
							id: 'item-019',
							name: 'غترة قطنية',
							sku: 'GTR-C-022',
							quantity: 1,
							price: 200.0,
							total: 200.0,
						},
						{
							id: 'item-020',
							name: 'عقال أسود',
							sku: 'EQA-B-015',
							quantity: 1,
							price: 225.0,
							total: 225.0,
						},
					],
					shippingAddress: {
						city: 'الرياض',
						area: 'حي النزهة',
						address: 'شارع الرياض، فيلا 18',
					},
					updatedAt: '2023-10-11T18:30:00',
				},
			];

			// حساب الإحصائيات
			const totalOrders = mockOrders.length;
			const pendingOrders = mockOrders.filter((order) => order.status === 'pending').length;
			const processingOrders = mockOrders.filter((order) => order.status === 'processing').length;
			const shippedOrders = mockOrders.filter((order) => order.status === 'shipped').length;
			const deliveredOrders = mockOrders.filter((order) => order.status === 'delivered').length;
			const cancelledOrders = mockOrders.filter(
				(order) => order.status === 'cancelled' || order.status === 'refunded'
			).length;
			const totalRevenue = mockOrders
				.filter((order) => order.paymentStatus === 'paid')
				.reduce((sum, order) => sum + order.total, 0);
			const averageOrderValue =
				totalRevenue / (mockOrders.filter((order) => order.paymentStatus === 'paid').length || 1);

			const statsData: OrderStats = {
				totalOrders,
				pendingOrders,
				processingOrders,
				shippedOrders,
				deliveredOrders,
				cancelledOrders,
				totalRevenue,
				averageOrderValue,
			};

			setOrders(mockOrders);
			setFilteredOrders(mockOrders);
			setStats(statsData);

			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلترة
	useEffect(() => {
		let result = [...orders];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(order) =>
					order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
					order.customer.phone.includes(searchTerm)
			);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			result = result.filter((order) => order.status === statusFilter);
		}

		// تطبيق فلتر حالة الدفع
		if (paymentStatusFilter !== 'all') {
			result = result.filter((order) => order.paymentStatus === paymentStatusFilter);
		}

		// تطبيق فلتر التاريخ
		if (dateFilter !== 'all') {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			if (dateFilter === 'today') {
				result = result.filter((order) => {
					const orderDate = new Date(order.date);
					return orderDate.toDateString() === today.toDateString();
				});
			} else if (dateFilter === 'week') {
				const weekAgo = new Date(today.getTime() - 7 * 86400000);
				result = result.filter((order) => {
					const orderDate = new Date(order.date);
					return orderDate >= weekAgo;
				});
			} else if (dateFilter === 'month') {
				const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
				result = result.filter((order) => {
					const orderDate = new Date(order.date);
					return orderDate >= monthAgo;
				});
			}
		}

		setFilteredOrders(result);
		setCurrentPage(1); // إعادة تعيين الصفحة الحالية عند تغيير الفلترة
	}, [searchTerm, statusFilter, paymentStatusFilter, dateFilter, orders]);

	// توسيع/طي تفاصيل الطلب
	const toggleOrderExpand = (orderId: string) => {
		if (expandedOrder === orderId) {
			setExpandedOrder(null);
		} else {
			setExpandedOrder(orderId);
		}
	};

	// تحديث حالة الطلب
	const openUpdateStatusModal = (order: Order) => {
		setSelectedOrder(order);
		setNewStatus(order.status);
		setTrackingNumber(order.trackingNumber || '');
		setStatusNote('');
		setShowUpdateStatus(true);
	};

	// إغلاق نافذة تحديث الحالة
	const closeUpdateStatusModal = () => {
		setShowUpdateStatus(false);
		setSelectedOrder(null);
		setNewStatus('');
		setTrackingNumber('');
		setStatusNote('');
	};

	// حفظ تحديث حالة الطلب
	const saveStatusUpdate = async () => {
		if (!selectedOrder) return;

		// محاكاة تحديث الحالة
		const updatedOrders = orders.map((order) => {
			if (order.id === selectedOrder.id) {
				const updatedOrder = {
					...order,
					status: newStatus as any,
					updatedAt: new Date().toISOString(),
				};

				if (newStatus === 'shipped' && trackingNumber) {
					updatedOrder.trackingNumber = trackingNumber;
					// إضافة تاريخ تسليم متوقع (بعد 5 أيام)
					const estimatedDate = new Date();
					estimatedDate.setDate(estimatedDate.getDate() + 5);
					updatedOrder.estimatedDelivery = estimatedDate.toISOString().split('T')[0];
				}

				return updatedOrder;
			}
			return order;
		});

		setOrders(updatedOrders);

		// تحديث الإحصائيات
		if (stats) {
			const newStats = { ...stats };

			// تقليل العدد من الحالة السابقة
			if (selectedOrder.status === 'pending') newStats.pendingOrders--;
			else if (selectedOrder.status === 'processing') newStats.processingOrders--;
			else if (selectedOrder.status === 'shipped') newStats.shippedOrders--;
			else if (selectedOrder.status === 'delivered') newStats.deliveredOrders--;
			else if (selectedOrder.status === 'cancelled' || selectedOrder.status === 'refunded')
				newStats.cancelledOrders--;

			// زيادة العدد في الحالة الجديدة
			if (newStatus === 'pending') newStats.pendingOrders++;
			else if (newStatus === 'processing') newStats.processingOrders++;
			else if (newStatus === 'shipped') newStats.shippedOrders++;
			else if (newStatus === 'delivered') newStats.deliveredOrders++;
			else if (newStatus === 'cancelled' || newStatus === 'refunded') newStats.cancelledOrders++;

			setStats(newStats);
		}

		closeUpdateStatusModal();
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

	// تنسيق الوقت
	const formatTime = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleTimeString('ar-SA', {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	// تنسيق المبلغ
	const formatAmount = (amount: number) => {
		return new Intl.NumberFormat('ar-SA', {
			style: 'currency',
			currency: 'SAR',
		}).format(amount);
	};

	// عرض حالة الطلب
	const renderOrderStatusBadge = (status: string) => {
		switch (status) {
			case 'pending':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
						قيد المراجعة
					</span>
				);
			case 'processing':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
						قيد التجهيز
					</span>
				);
			case 'shipped':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
						تم الشحن
					</span>
				);
			case 'delivered':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						تم التسليم
					</span>
				);
			case 'cancelled':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						ملغي
					</span>
				);
			case 'refunded':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						مسترجع
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

	// عرض حالة الدفع
	const renderPaymentStatusBadge = (status: string) => {
		switch (status) {
			case 'paid':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						مدفوع
					</span>
				);
			case 'pending':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
						قيد الانتظار
					</span>
				);
			case 'failed':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						فشل الدفع
					</span>
				);
			case 'refunded':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						مسترد
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

	// حساب صفحات الترقيم
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

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
						طلبات المتجر
					</h1>
					<p className='mt-1 text-gray-500'>إدارة ومتابعة طلبات المتجر الإلكتروني</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/ecommerce/orders/reports'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						تحليل المبيعات
					</Link>
					<Link
						href='/dashboard/ecommerce/orders/print'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<Printer className='ml-1 h-4 w-4' />
						طباعة
					</Link>
					<button
						onClick={() => {
							// محاكاة تحديث البيانات
							setLoading(true);
							setTimeout(() => setLoading(false), 500);
						}}
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						<RefreshCw className='ml-1 h-4 w-4' />
						تحديث
					</button>
				</div>
			</div>

			{/* بطاقات الإحصائيات */}
			{stats && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>إجمالي الطلبات</p>
								<p className='text-2xl font-bold text-indigo-600'>{stats.totalOrders}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
								<ShoppingBag className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>
							متوسط قيمة الطلب: {formatAmount(stats.averageOrderValue)}
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>إجمالي المبيعات</p>
								<p className='text-2xl font-bold text-green-600'>{formatAmount(stats.totalRevenue)}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
								<DollarSign className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>
							من {stats.totalOrders - stats.cancelledOrders} طلب مكتمل
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>طلبات قيد المعالجة</p>
								<p className='text-2xl font-bold text-amber-600'>
									{stats.pendingOrders + stats.processingOrders}
								</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
								<Clock className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>
							{stats.pendingOrders} قيد المراجعة / {stats.processingOrders} قيد التجهيز
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>تم شحنها</p>
								<p className='text-2xl font-bold text-blue-600'>{stats.shippedOrders}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600'>
								<Truck className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>تم تسليم {stats.deliveredOrders} طلب</div>
					</div>
				</div>
			)}

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
					{/* البحث */}
					<div className='relative'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='بحث عن رقم الطلب أو العميل...'
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
							<option value='pending'>قيد المراجعة</option>
							<option value='processing'>قيد التجهيز</option>
							<option value='shipped'>تم الشحن</option>
							<option value='delivered'>تم التسليم</option>
							<option value='cancelled'>ملغي</option>
							<option value='refunded'>مسترجع</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر حالة الدفع */}
					<div className='relative'>
						<select
							value={paymentStatusFilter}
							onChange={(e) => setPaymentStatusFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع حالات الدفع</option>
							<option value='paid'>مدفوع</option>
							<option value='pending'>قيد الانتظار</option>
							<option value='failed'>فشل الدفع</option>
							<option value='refunded'>مسترد</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر التاريخ */}
					<div className='relative'>
						<select
							value={dateFilter}
							onChange={(e) => setDateFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع التواريخ</option>
							<option value='today'>اليوم</option>
							<option value='week'>آخر أسبوع</option>
							<option value='month'>آخر شهر</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>
				</div>

				{/* معلومات الفلترة */}
				<div className='mt-4 pt-3 border-t border-gray-200'>
					<div className='flex justify-between items-center'>
						<span className='text-sm text-gray-500'>
							عرض {filteredOrders.length} من {orders.length} طلب
						</span>

						{(searchTerm ||
							statusFilter !== 'all' ||
							paymentStatusFilter !== 'all' ||
							dateFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setStatusFilter('all');
									setPaymentStatusFilter('all');
									setDateFilter('all');
								}}
								className='text-xs text-indigo-600 hover:text-indigo-800'
							>
								مسح الفلاتر
							</button>
						)}
					</div>
				</div>
			</div>

			{/* قائمة الطلبات */}
			{currentItems.length > 0 ? (
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										رقم الطلب
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										التاريخ
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										العميل
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										المبلغ
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الحالة
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										حالة الدفع
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
								{currentItems.map((order) => (
									<tr key={order.id} className='hover:bg-gray-50'>
										<td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-indigo-600'>
											<button
												onClick={() => toggleOrderExpand(order.id)}
												className='hover:underline focus:outline-none'
											>
												{order.orderNumber}
											</button>
										</td>
										<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
											<div>{formatDate(order.date)}</div>
											<div className='text-xs'>{formatTime(order.date)}</div>
										</td>
										<td className='px-4 py-4 whitespace-nowrap'>
											<div className='text-sm font-medium text-gray-900'>
												{order.customer.name}
											</div>
											<div className='text-xs text-gray-500'>{order.customer.phone}</div>
										</td>
										<td className='px-4 py-4 whitespace-nowrap text-sm font-medium text-left'>
											{formatAmount(order.total)}
										</td>
										<td className='px-4 py-4 whitespace-nowrap'>
											{renderOrderStatusBadge(order.status)}
										</td>
										<td className='px-4 py-4 whitespace-nowrap'>
											{renderPaymentStatusBadge(order.paymentStatus)}
										</td>
										<td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center'>
											<div className='flex items-center justify-center space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/ecommerce/orders/${order.id}`}
													className='text-indigo-600 hover:text-indigo-900'
													title='عرض التفاصيل'
												>
													<Eye className='h-5 w-5' />
												</Link>
												<button
													className='text-blue-600 hover:text-blue-900'
													title='تحديث الحالة'
													onClick={() => openUpdateStatusModal(order)}
												>
													<RefreshCw className='h-5 w-5' />
												</button>
												<button
													className='text-gray-600 hover:text-gray-900'
													title='طباعة الفاتورة'
												>
													<Printer className='h-5 w-5' />
												</button>
												<div className='relative group'>
													<button
														className='text-gray-500 hover:text-gray-700'
														title='المزيد من الخيارات'
													>
														<MoreHorizontal className='h-5 w-5' />
													</button>
													<div className='absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
														<Link
															href={`/dashboard/ecommerce/orders/${order.id}`}
															className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
														>
															<Eye className='inline ml-1 h-4 w-4' />
															عرض التفاصيل
														</Link>
														<button className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
															<MessageSquare className='inline ml-1 h-4 w-4' />
															مراسلة العميل
														</button>
														<button className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'>
															<Download className='inline ml-1 h-4 w-4' />
															تنزيل الفاتورة
														</button>
														{(order.status === 'pending' ||
															order.status === 'processing') && (
															<button className='block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50'>
																<XCircle className='inline ml-1 h-4 w-4' />
																إلغاء الطلب
															</button>
														)}
													</div>
												</div>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* تفاصيل الطلب الموسعة */}
					{expandedOrder && (
						<div className='border-t border-gray-200 bg-gray-50 p-4 animate-fadeIn'>
							{orders
								.filter((o) => o.id === expandedOrder)
								.map((order) => (
									<div key={`details-${order.id}`}>
										<div className='flex justify-between items-center mb-4'>
											<h3 className='text-lg font-medium text-gray-900'>
												تفاصيل الطلب #{order.orderNumber}
											</h3>
											<button
												onClick={() => setExpandedOrder(null)}
												className='text-gray-400 hover:text-gray-500'
											>
												<X className='h-5 w-5' />
											</button>
										</div>

										<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													معلومات العميل
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='flex items-center'>
														<div className='flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-500'>
															<User className='h-5 w-5' />
														</div>
														<div className='mr-3 flex-1'>
															<p className='text-sm font-medium text-gray-900'>
																{order.customer.name}
															</p>
															<div className='flex flex-col mt-1 text-xs text-gray-500'>
																<div className='flex items-center'>
																	<Phone className='h-3 w-3 ml-1' />
																	<span dir='ltr'>{order.customer.phone}</span>
																</div>
																<div className='flex items-center mt-1'>
																	<Mail className='h-3 w-3 ml-1' />
																	<span>{order.customer.email}</span>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>

											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													معلومات الشحن
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='flex items-start'>
														<div className='flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500'>
															<MapPin className='h-5 w-5' />
														</div>
														<div className='mr-3 flex-1'>
															<p className='text-sm font-medium text-gray-900'>
																{order.shippingMethod}
															</p>
															<div className='text-xs text-gray-500 mt-1'>
																<p>
																	{order.shippingAddress.city} -{' '}
																	{order.shippingAddress.area}
																</p>
																<p className='mt-0.5'>
																	{order.shippingAddress.address}
																</p>
																{order.shippingAddress.postalCode && (
																	<p className='mt-0.5'>
																		الرمز البريدي:{' '}
																		{order.shippingAddress.postalCode}
																	</p>
																)}
															</div>
															{order.trackingNumber && (
																<div className='mt-2 text-xs'>
																	<span className='font-medium'>رقم التتبع: </span>
																	<span className='text-indigo-600 font-mono'>
																		{order.trackingNumber}
																	</span>
																</div>
															)}
															{order.estimatedDelivery && (
																<div className='mt-1 text-xs'>
																	<span className='font-medium'>
																		التسليم المتوقع:{' '}
																	</span>
																	<span>{formatDate(order.estimatedDelivery)}</span>
																</div>
															)}
														</div>
													</div>
												</div>
											</div>

											<div>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>
													معلومات الدفع
												</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200'>
													<div className='flex items-start'>
														<div className='flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-500'>
															<DollarSign className='h-5 w-5' />
														</div>
														<div className='mr-3 flex-1'>
															<p className='text-sm font-medium text-gray-900'>
																{order.paymentMethod}
															</p>
															<div className='mt-1 flex items-center'>
																{renderPaymentStatusBadge(order.paymentStatus)}
																<span className='text-xs text-gray-500 mr-2'>
																	{formatAmount(order.total)}
																</span>
															</div>
															<div className='mt-2 text-xs'>
																<span className='font-medium'>تاريخ الطلب: </span>
																<span>{formatDate(order.date)}</span>
															</div>
															<div className='mt-1 text-xs'>
																<span className='font-medium'>آخر تحديث: </span>
																<span>{formatDate(order.updatedAt)}</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>

										<h4 className='text-sm font-medium text-gray-500 mb-1'>المنتجات</h4>
										<div className='bg-white rounded-md border border-gray-200 overflow-hidden mb-4'>
											<table className='min-w-full divide-y divide-gray-200'>
												<thead className='bg-gray-50'>
													<tr>
														<th
															scope='col'
															className='px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															المنتج
														</th>
														<th
															scope='col'
															className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															السعر
														</th>
														<th
															scope='col'
															className='px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															الكمية
														</th>
														<th
															scope='col'
															className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
														>
															الإجمالي
														</th>
													</tr>
												</thead>
												<tbody className='divide-y divide-gray-200'>
													{order.items.map((item) => (
														<tr key={item.id}>
															<td className='px-4 py-2 text-sm'>
																<div className='font-medium text-gray-900'>
																	{item.name}
																</div>
																<div className='text-xs text-gray-500'>
																	SKU: {item.sku}
																</div>
																{item.options && item.options.length > 0 && (
																	<div className='text-xs text-gray-500 mt-1'>
																		{item.options.map((option, index) => (
																			<span key={index} className='mr-1'>
																				{option.name}: {option.value}
																				{index < item.options!.length - 1
																					? ' | '
																					: ''}
																			</span>
																		))}
																	</div>
																)}
															</td>
															<td className='px-4 py-2 text-sm text-gray-500 text-center'>
																{formatAmount(item.price)}
															</td>
															<td className='px-4 py-2 text-sm text-gray-500 text-center'>
																{item.quantity}
															</td>
															<td className='px-4 py-2 text-sm font-medium text-gray-900 text-left'>
																{formatAmount(item.total)}
															</td>
														</tr>
													))}
												</tbody>
												<tfoot className='bg-gray-50'>
													<tr>
														<td
															colSpan={3}
															className='px-4 py-2 text-sm font-medium text-gray-900 text-left'
														>
															الإجمالي
														</td>
														<td className='px-4 py-2 text-sm font-bold text-gray-900 text-left'>
															{formatAmount(order.total)}
														</td>
													</tr>
												</tfoot>
											</table>
										</div>

										{order.notes && (
											<div className='mb-4'>
												<h4 className='text-sm font-medium text-gray-500 mb-1'>ملاحظات</h4>
												<div className='bg-white p-3 rounded-md border border-gray-200 text-sm text-gray-600'>
													{order.notes}
												</div>
											</div>
										)}

										<div className='flex justify-between items-center gap-2'>
											<div className='flex gap-2'>
												<Link
													href={`/dashboard/ecommerce/orders/${order.id}`}
													className='px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center'
												>
													<Eye className='ml-1 h-4 w-4' />
													عرض التفاصيل الكاملة
												</Link>
												<button
													onClick={() => openUpdateStatusModal(order)}
													className='px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm flex items-center'
												>
													<RefreshCw className='ml-1 h-4 w-4' />
													تحديث الحالة
												</button>
												<button className='px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center'>
													<Printer className='ml-1 h-4 w-4' />
													طباعة الفاتورة
												</button>
											</div>

											{(order.status === 'pending' || order.status === 'processing') && (
												<button className='px-3 py-1.5 border border-red-300 text-red-700 bg-red-50 rounded-md hover:bg-red-100 text-sm flex items-center'>
													<XCircle className='ml-1 h-4 w-4' />
													إلغاء الطلب
												</button>
											)}
										</div>
									</div>
								))}
						</div>
					)}

					{/* الترقيم الصفحي */}
					<div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
						<div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
							<div>
								<p className='text-sm text-gray-700'>
									عرض <span className='font-medium'>{indexOfFirstItem + 1}</span> إلى{' '}
									<span className='font-medium'>
										{Math.min(indexOfLastItem, filteredOrders.length)}
									</span>{' '}
									من أصل <span className='font-medium'>{filteredOrders.length}</span> طلب
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
				</div>
			) : (
				<div className='bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center'>
					<ShoppingBag className='h-12 w-12 text-gray-300 mx-auto mb-3' />
					<h3 className='text-lg font-medium text-gray-900'>لا توجد طلبات</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm || statusFilter !== 'all' || paymentStatusFilter !== 'all' || dateFilter !== 'all'
							? 'لم يتم العثور على طلبات تطابق معايير البحث المحددة'
							: 'لا توجد طلبات مسجلة في النظام حالياً.'}
					</p>
				</div>
			)}

			{/* نسب الطلبات حسب الحالة */}
			{stats && (
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-lg font-medium text-gray-900'>تحليل حالات الطلبات</h2>
						<Link
							href='/dashboard/ecommerce/orders/reports'
							className='text-sm text-indigo-600 hover:text-indigo-800'
						>
							المزيد من التحليلات
						</Link>
					</div>

					<div className='h-6 rounded-full bg-gray-200 overflow-hidden'>
						{stats.totalOrders > 0 && (
							<>
								<div
									className='h-full bg-green-500 float-right'
									style={{ width: `${(stats.deliveredOrders / stats.totalOrders) * 100}%` }}
									title={`تم التسليم: ${stats.deliveredOrders} (${Math.round(
										(stats.deliveredOrders / stats.totalOrders) * 100
									)}%)`}
								></div>
								<div
									className='h-full bg-blue-500 float-right'
									style={{ width: `${(stats.shippedOrders / stats.totalOrders) * 100}%` }}
									title={`تم الشحن: ${stats.shippedOrders} (${Math.round(
										(stats.shippedOrders / stats.totalOrders) * 100
									)}%)`}
								></div>
								<div
									className='h-full bg-indigo-500 float-right'
									style={{ width: `${(stats.processingOrders / stats.totalOrders) * 100}%` }}
									title={`قيد التجهيز: ${stats.processingOrders} (${Math.round(
										(stats.processingOrders / stats.totalOrders) * 100
									)}%)`}
								></div>
								<div
									className='h-full bg-amber-500 float-right'
									style={{ width: `${(stats.pendingOrders / stats.totalOrders) * 100}%` }}
									title={`قيد المراجعة: ${stats.pendingOrders} (${Math.round(
										(stats.pendingOrders / stats.totalOrders) * 100
									)}%)`}
								></div>
								<div
									className='h-full bg-red-500 float-right'
									style={{ width: `${(stats.cancelledOrders / stats.totalOrders) * 100}%` }}
									title={`ملغاة/مسترجعة: ${stats.cancelledOrders} (${Math.round(
										(stats.cancelledOrders / stats.totalOrders) * 100
									)}%)`}
								></div>
							</>
						)}
					</div>

					<div className='flex justify-center mt-4 space-x-4 space-x-reverse flex-wrap'>
						<div className='flex items-center mx-2 mb-2'>
							<span className='w-3 h-3 bg-green-500 rounded-sm inline-block ml-1'></span>
							<span className='text-xs text-gray-600'>تم التسليم ({stats.deliveredOrders})</span>
						</div>
						<div className='flex items-center mx-2 mb-2'>
							<span className='w-3 h-3 bg-blue-500 rounded-sm inline-block ml-1'></span>
							<span className='text-xs text-gray-600'>تم الشحن ({stats.shippedOrders})</span>
						</div>
						<div className='flex items-center mx-2 mb-2'>
							<span className='w-3 h-3 bg-indigo-500 rounded-sm inline-block ml-1'></span>
							<span className='text-xs text-gray-600'>قيد التجهيز ({stats.processingOrders})</span>
						</div>
						<div className='flex items-center mx-2 mb-2'>
							<span className='w-3 h-3 bg-amber-500 rounded-sm inline-block ml-1'></span>
							<span className='text-xs text-gray-600'>قيد المراجعة ({stats.pendingOrders})</span>
						</div>
						<div className='flex items-center mx-2 mb-2'>
							<span className='w-3 h-3 bg-red-500 rounded-sm inline-block ml-1'></span>
							<span className='text-xs text-gray-600'>ملغاة/مسترجعة ({stats.cancelledOrders})</span>
						</div>
					</div>
				</div>
			)}

			{/* روابط سريعة */}
			<div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
				<Link
					href='/dashboard/ecommerce/orders/processing'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 ml-3'>
						<Package className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>طلبات قيد التجهيز</h3>
						<p className='text-sm text-gray-500'>{stats ? stats.processingOrders : 0} طلب ينتظر التجهيز</p>
					</div>
				</Link>

				<Link
					href='/dashboard/ecommerce/orders/shipped'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ml-3'>
						<Truck className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>طلبات تم شحنها</h3>
						<p className='text-sm text-gray-500'>متابعة {stats ? stats.shippedOrders : 0} طلب في الشحن</p>
					</div>
				</Link>

				<Link
					href='/dashboard/ecommerce/orders/pending'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 ml-3'>
						<Clock className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>طلبات قيد المراجعة</h3>
						<p className='text-sm text-gray-500'>{stats ? stats.pendingOrders : 0} طلب بانتظار المراجعة</p>
					</div>
				</Link>

				<Link
					href='/dashboard/ecommerce/orders/reports'
					className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center hover:shadow-md transition-shadow'
				>
					<div className='flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 ml-3'>
						<BarChart2 className='h-5 w-5' />
					</div>
					<div>
						<h3 className='text-base font-medium text-gray-900'>تقارير المبيعات</h3>
						<p className='text-sm text-gray-500'>تحليل المبيعات والأداء</p>
					</div>
				</Link>
			</div>

			{/* نافذة تحديث حالة الطلب */}
			{showUpdateStatus && selectedOrder && (
				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
						<div className='fixed inset-0 transition-opacity' onClick={closeUpdateStatusModal}>
							<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
						</div>

						<div className='inline-block align-middle bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
							<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								<div className='flex justify-between items-center mb-4'>
									<h3 className='text-lg font-medium text-gray-900'>
										تحديث حالة الطلب #{selectedOrder.orderNumber}
									</h3>
									<button
										onClick={closeUpdateStatusModal}
										className='text-gray-400 hover:text-gray-500'
									>
										<X className='h-5 w-5' />
									</button>
								</div>

								<div className='space-y-4'>
									<div>
										<label
											htmlFor='status'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											الحالة الجديدة
										</label>
										<select
											id='status'
											value={newStatus}
											onChange={(e) => setNewStatus(e.target.value)}
											className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
										>
											<option value='pending'>قيد المراجعة</option>
											<option value='processing'>قيد التجهيز</option>
											<option value='shipped'>تم الشحن</option>
											<option value='delivered'>تم التسليم</option>
											<option value='cancelled'>ملغي</option>
										</select>
									</div>

									{newStatus === 'shipped' && (
										<div>
											<label
												htmlFor='tracking'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												رقم التتبع
											</label>
											<input
												type='text'
												id='tracking'
												value={trackingNumber}
												onChange={(e) => setTrackingNumber(e.target.value)}
												className='block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
												placeholder='أدخل رقم التتبع'
												dir='ltr'
											/>
										</div>
									)}

									<div>
										<label htmlFor='notes' className='block text-sm font-medium text-gray-700 mb-1'>
											ملاحظات (اختياري)
										</label>
										<textarea
											id='notes'
											value={statusNote}
											onChange={(e) => setStatusNote(e.target.value)}
											className='block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
											placeholder='أضف ملاحظات حول تغيير الحالة'
											rows={3}
										/>
									</div>

									<div className='flex items-center'>
										<input
											id='notifyCustomer'
											type='checkbox'
											checked={notifyCustomer}
											onChange={(e) => setNotifyCustomer(e.target.checked)}
											className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
										/>
										<label htmlFor='notifyCustomer' className='mr-2 block text-sm text-gray-700'>
											إرسال إشعار للعميل
										</label>
									</div>
								</div>
							</div>

							<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
								<button
									type='button'
									onClick={saveStatusUpdate}
									className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
								>
									تحديث الحالة
								</button>
								<button
									type='button'
									onClick={closeUpdateStatusModal}
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
