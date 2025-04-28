'use client';

import {
	AlertCircle,
	Bell,
	Check,
	Clock,
	CreditCard,
	Eye,
	Filter,
	Info,
	Search,
	Settings,
	ShoppingCart,
	Trash,
	User,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Notification {
	id: number;
	title: string;
	message: string;
	type: 'order' | 'customer' | 'payment' | 'system' | 'reminder' | 'alert';
	status: 'unread' | 'read';
	priority: 'high' | 'medium' | 'low';
	timestamp: string;
	actionUrl?: string;
	metadata?: {
		orderId?: number;
		customerId?: number;
		amount?: number;
		paymentId?: number;
		systemUpdate?: boolean;
		[key: string]: any;
	};
}

export default function NotificationsPage() {
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
	const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState('');
	const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'priority'>('newest');
	const [showFilterMenu, setShowFilterMenu] = useState(false);
	const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
	const [showBulkActions, setShowBulkActions] = useState(false);
	const [selectedNotificationIds, setSelectedNotificationIds] = useState<number[]>([]);
	const [isProcessing, setIsProcessing] = useState(false);
	const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
	const [notificationToDelete, setNotificationToDelete] = useState<number | null>(null);

	// تحميل الإشعارات عند تحميل الصفحة
	useEffect(() => {
		const fetchNotifications = async () => {
			setIsLoading(true);
			try {
				// محاكاة لتحميل البيانات من API
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// بيانات تجريبية للإشعارات
				const mockNotifications: Notification[] = [
					{
						id: 1,
						title: 'طلب جديد',
						message: 'تم إنشاء طلب جديد #10045 بقيمة 850 ريال',
						type: 'order',
						status: 'unread',
						priority: 'medium',
						timestamp: '2023-06-18T09:30:00Z',
						actionUrl: '/dashboard/orders/10045',
						metadata: {
							orderId: 10045,
							amount: 850,
							customerId: 325,
						},
					},
					{
						id: 2,
						title: 'دفعة مستلمة',
						message: 'تم استلام دفعة بقيمة 1200 ريال للطلب #10041',
						type: 'payment',
						status: 'read',
						priority: 'medium',
						timestamp: '2023-06-17T14:45:00Z',
						actionUrl: '/dashboard/payments/8701',
						metadata: {
							orderId: 10041,
							amount: 1200,
							paymentId: 8701,
						},
					},
					{
						id: 3,
						title: 'تحديث النظام',
						message:
							'سيتم تحديث النظام الليلة الساعة 12 منتصف الليل، قد يكون النظام غير متاح لمدة 30 دقيقة.',
						type: 'system',
						status: 'unread',
						priority: 'high',
						timestamp: '2023-06-18T08:00:00Z',
						metadata: {
							systemUpdate: true,
							maintenanceWindow: '30 دقيقة',
						},
					},
					{
						id: 4,
						title: 'عميل جديد',
						message: 'قام خالد العنزي بالتسجيل في النظام',
						type: 'customer',
						status: 'unread',
						priority: 'low',
						timestamp: '2023-06-17T10:15:00Z',
						actionUrl: '/dashboard/customers/325',
						metadata: {
							customerId: 325,
							source: 'website',
						},
					},
					{
						id: 5,
						title: 'تذكير بموعد تسليم',
						message: 'يجب تسليم الطلب #10033 غداً',
						type: 'reminder',
						status: 'unread',
						priority: 'high',
						timestamp: '2023-06-18T07:00:00Z',
						actionUrl: '/dashboard/orders/10033',
						metadata: {
							orderId: 10033,
							dueDate: '2023-06-19T17:00:00Z',
						},
					},
					{
						id: 6,
						title: 'طلب جاهز للتسليم',
						message: 'الطلب #10038 جاهز للتسليم للعميل',
						type: 'order',
						status: 'read',
						priority: 'medium',
						timestamp: '2023-06-16T16:30:00Z',
						actionUrl: '/dashboard/orders/10038',
						metadata: {
							orderId: 10038,
							status: 'ready_for_delivery',
						},
					},
					{
						id: 7,
						title: 'تنبيه مخزون',
						message: 'كمية قماش الساسو أقل من الحد الأدنى، يرجى إعادة الطلب',
						type: 'alert',
						status: 'unread',
						priority: 'high',
						timestamp: '2023-06-18T08:30:00Z',
						actionUrl: '/dashboard/inventory/45',
						metadata: {
							inventoryItemId: 45,
							currentQuantity: 3,
							minimumQuantity: 10,
						},
					},
					{
						id: 8,
						title: 'تقييم عميل جديد',
						message: 'قام العميل محمد السعيد بتقييم خدمتكم (5/5)',
						type: 'customer',
						status: 'read',
						priority: 'low',
						timestamp: '2023-06-15T13:20:00Z',
						actionUrl: '/dashboard/reviews/152',
						metadata: {
							customerId: 287,
							rating: 5,
							reviewId: 152,
						},
					},
					{
						id: 9,
						title: 'تم إلغاء طلب',
						message: 'تم إلغاء الطلب #10042 من قبل العميل',
						type: 'order',
						status: 'read',
						priority: 'medium',
						timestamp: '2023-06-14T11:25:00Z',
						actionUrl: '/dashboard/orders/10042',
						metadata: {
							orderId: 10042,
							status: 'cancelled',
							reason: 'customer_request',
						},
					},
					{
						id: 10,
						title: 'تذكير - اجتماع فريق العمل',
						message: 'تذكير: اجتماع فريق العمل غداً الساعة 10 صباحاً',
						type: 'reminder',
						status: 'unread',
						priority: 'medium',
						timestamp: '2023-06-18T08:00:00Z',
						metadata: {
							meetingId: 45,
							location: 'غرفة الاجتماعات الرئيسية',
							time: '2023-06-19T10:00:00Z',
						},
					},
					{
						id: 11,
						title: 'طلب إصلاح جديد',
						message: 'تم تقديم طلب إصلاح للثوب #5487',
						type: 'order',
						status: 'unread',
						priority: 'high',
						timestamp: '2023-06-18T10:45:00Z',
						actionUrl: '/dashboard/repairs/201',
						metadata: {
							productId: 5487,
							repairId: 201,
							customerId: 156,
						},
					},
					{
						id: 12,
						title: 'تقرير المبيعات الأسبوعي',
						message: 'تم إنشاء تقرير المبيعات الأسبوعي، إجمالي المبيعات: 45,200 ريال',
						type: 'system',
						status: 'read',
						priority: 'low',
						timestamp: '2023-06-17T00:05:00Z',
						actionUrl: '/dashboard/reports/sales/weekly/2023-24',
						metadata: {
							reportId: 'sales-weekly-2023-24',
							totalSales: 45200,
							period: 'weekly',
						},
					},
					{
						id: 13,
						title: 'عرض ترويجي جديد',
						message: 'تم إنشاء عرض ترويجي جديد "خصم الصيف" بنسبة 15%',
						type: 'system',
						status: 'read',
						priority: 'medium',
						timestamp: '2023-06-16T09:10:00Z',
						actionUrl: '/dashboard/promotions/35',
						metadata: {
							promotionId: 35,
							discount: 15,
							startDate: '2023-06-20T00:00:00Z',
							endDate: '2023-07-20T23:59:59Z',
						},
					},
					{
						id: 14,
						title: 'تم شحن الطلب',
						message: 'تم شحن الطلب #10039 بواسطة شركة النقل',
						type: 'order',
						status: 'read',
						priority: 'medium',
						timestamp: '2023-06-15T15:50:00Z',
						actionUrl: '/dashboard/orders/10039',
						metadata: {
							orderId: 10039,
							trackingNumber: 'SHP78901234',
							carrier: 'شركة النقل السريع',
						},
					},
					{
						id: 15,
						title: 'دعوة لتقييم المنتجات',
						message: 'تم إرسال دعوة لـ 25 عميل لتقييم منتجاتهم',
						type: 'customer',
						status: 'read',
						priority: 'low',
						timestamp: '2023-06-14T10:00:00Z',
						actionUrl: '/dashboard/campaigns/12',
						metadata: {
							campaignId: 12,
							totalRecipients: 25,
							campaignType: 'review_request',
						},
					},
				];

				setNotifications(mockNotifications);
				setFilteredNotifications(mockNotifications);
			} catch (error) {
				console.error('فشل في تحميل الإشعارات:', error);
				// يمكن إضافة حالة خطأ هنا
			} finally {
				setIsLoading(false);
			}
		};

		fetchNotifications();
	}, []);

	// تطبيق الفلاتر على الإشعارات
	useEffect(() => {
		let filtered = [...notifications];

		// فلترة حسب التبويب النشط
		if (activeTab === 'unread') {
			filtered = filtered.filter((notification) => notification.status === 'unread');
		} else if (activeTab === 'read') {
			filtered = filtered.filter((notification) => notification.status === 'read');
		}

		// فلترة حسب أنواع الإشعارات المحددة
		if (selectedTypes.length > 0) {
			filtered = filtered.filter((notification) => selectedTypes.includes(notification.type));
		}

		// فلترة حسب البحث
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(notification) =>
					notification.title.toLowerCase().includes(query) ||
					notification.message.toLowerCase().includes(query)
			);
		}

		// ترتيب الإشعارات
		filtered = sortNotifications(filtered, sortOrder);

		setFilteredNotifications(filtered);
	}, [notifications, activeTab, selectedTypes, searchQuery, sortOrder]);

	// ترتيب الإشعارات
	const sortNotifications = (notifs: Notification[], order: string) => {
		return [...notifs].sort((a, b) => {
			if (order === 'newest') {
				return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
			} else if (order === 'oldest') {
				return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
			} else if (order === 'priority') {
				const priorityOrder = { high: 3, medium: 2, low: 1 };
				return priorityOrder[b.priority] - priorityOrder[a.priority];
			}
			return 0;
		});
	};

	// تبديل حالة الإشعار (مقروء/غير مقروء)
	const toggleNotificationStatus = (notificationId: number) => {
		setNotifications((prevNotifications) =>
			prevNotifications.map((notification) =>
				notification.id === notificationId
					? {
							...notification,
							status: notification.status === 'read' ? 'unread' : 'read',
					  }
					: notification
			)
		);
	};

	// تأشير الإشعار كمقروء
	const markAsRead = (notificationId: number) => {
		setNotifications((prevNotifications) =>
			prevNotifications.map((notification) =>
				notification.id === notificationId ? { ...notification, status: 'read' } : notification
			)
		);
	};

	// حذف إشعار
	const deleteNotification = (notificationId: number) => {
		setNotifications((prevNotifications) =>
			prevNotifications.filter((notification) => notification.id !== notificationId)
		);
		setNotificationToDelete(null);
		setShowConfirmDeleteModal(false);
	};

	// تنفيذ إجراء جماعي
	const executeBulkAction = (action: 'markAsRead' | 'delete') => {
		setIsProcessing(true);

		// محاكاة للمعالجة
		setTimeout(() => {
			if (action === 'markAsRead') {
				setNotifications((prevNotifications) =>
					prevNotifications.map((notification) =>
						selectedNotificationIds.includes(notification.id)
							? { ...notification, status: 'read' }
							: notification
					)
				);
			} else if (action === 'delete') {
				setNotifications((prevNotifications) =>
					prevNotifications.filter((notification) => !selectedNotificationIds.includes(notification.id))
				);
			}

			setSelectedNotificationIds([]);
			setShowBulkActions(false);
			setIsProcessing(false);
		}, 500);
	};

	// تحديد/إلغاء تحديد كل الإشعارات
	const toggleSelectAll = () => {
		if (selectedNotificationIds.length === filteredNotifications.length) {
			setSelectedNotificationIds([]);
		} else {
			setSelectedNotificationIds(filteredNotifications.map((n) => n.id));
		}
	};

	// تحديد نوع الإشعار
	const toggleNotificationType = (type: string) => {
		setSelectedTypes((prevSelectedTypes) => {
			if (prevSelectedTypes.includes(type)) {
				return prevSelectedTypes.filter((t) => t !== type);
			} else {
				return [...prevSelectedTypes, type];
			}
		});
	};

	// الحصول على أيقونة الإشعار حسب نوعه
	const getNotificationIcon = (type: string) => {
		switch (type) {
			case 'order':
				return <ShoppingCart className='h-5 w-5 text-blue-500' />;
			case 'customer':
				return <User className='h-5 w-5 text-purple-500' />;
			case 'payment':
				return <CreditCard className='h-5 w-5 text-green-500' />;
			case 'system':
				return <Settings className='h-5 w-5 text-gray-500' />;
			case 'reminder':
				return <Clock className='h-5 w-5 text-amber-500' />;
			case 'alert':
				return <AlertCircle className='h-5 w-5 text-red-500' />;
			default:
				return <Info className='h-5 w-5 text-blue-500' />;
		}
	};

	// تنسيق الوقت منذ الإشعار
	const formatTimeAgo = (timestamp: string) => {
		const date = new Date(timestamp);
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) {
			return 'الآن';
		} else if (diffInSeconds < 3600) {
			const minutes = Math.floor(diffInSeconds / 60);
			return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
		} else if (diffInSeconds < 86400) {
			const hours = Math.floor(diffInSeconds / 3600);
			return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
		} else if (diffInSeconds < 604800) {
			const days = Math.floor(diffInSeconds / 86400);
			return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
		} else {
			return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric' });
		}
	};

	// الحصول على لون أولوية الإشعار
	const getPriorityColor = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'bg-red-100 text-red-800';
			case 'medium':
				return 'bg-amber-100 text-amber-800';
			case 'low':
				return 'bg-green-100 text-green-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// الحصول على اسم أولوية الإشعار بالعربية
	const getPriorityName = (priority: string) => {
		switch (priority) {
			case 'high':
				return 'عالية';
			case 'medium':
				return 'متوسطة';
			case 'low':
				return 'منخفضة';
			default:
				return 'غير محددة';
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
					<Bell className='ml-2 h-6 w-6 text-gray-600' /> الإشعارات
				</h1>

				<div className='flex items-center space-x-3 space-x-reverse'>
					<button
						onClick={() => setShowBulkActions(!showBulkActions)}
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none'
					>
						إجراءات متعددة
					</button>

					<div className='relative'>
						<button
							onClick={() => setShowFilterMenu(!showFilterMenu)}
							className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'
						>
							<Filter className='ml-1 h-4 w-4' />
							فلترة
							{selectedTypes.length > 0 && (
								<span className='mr-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
									{selectedTypes.length}
								</span>
							)}
						</button>

						{showFilterMenu && (
							<div className='absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10'>
								<div className='p-3 border-b border-gray-200'>
									<h3 className='text-sm font-medium text-gray-700'>فلترة حسب النوع</h3>
								</div>
								<div className='p-3 space-y-2'>
									<div className='flex items-center'>
										<input
											id='filter-order'
											type='checkbox'
											checked={selectedTypes.includes('order')}
											onChange={() => toggleNotificationType('order')}
											className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
										/>
										<label
											htmlFor='filter-order'
											className='mr-2 text-sm text-gray-700 flex items-center'
										>
											<ShoppingCart className='ml-1 h-4 w-4 text-blue-500' />
											الطلبات
										</label>
									</div>

									<div className='flex items-center'>
										<input
											id='filter-customer'
											type='checkbox'
											checked={selectedTypes.includes('customer')}
											onChange={() => toggleNotificationType('customer')}
											className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
										/>
										<label
											htmlFor='filter-customer'
											className='mr-2 text-sm text-gray-700 flex items-center'
										>
											<User className='ml-1 h-4 w-4 text-purple-500' />
											العملاء
										</label>
									</div>

									<div className='flex items-center'>
										<input
											id='filter-payment'
											type='checkbox'
											checked={selectedTypes.includes('payment')}
											onChange={() => toggleNotificationType('payment')}
											className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
										/>
										<label
											htmlFor='filter-payment'
											className='mr-2 text-sm text-gray-700 flex items-center'
										>
											<CreditCard className='ml-1 h-4 w-4 text-green-500' />
											المدفوعات
										</label>
									</div>

									<div className='flex items-center'>
										<input
											id='filter-system'
											type='checkbox'
											checked={selectedTypes.includes('system')}
											onChange={() => toggleNotificationType('system')}
											className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
										/>
										<label
											htmlFor='filter-system'
											className='mr-2 text-sm text-gray-700 flex items-center'
										>
											<Settings className='ml-1 h-4 w-4 text-gray-500' />
											النظام
										</label>
									</div>

									<div className='flex items-center'>
										<input
											id='filter-reminder'
											type='checkbox'
											checked={selectedTypes.includes('reminder')}
											onChange={() => toggleNotificationType('reminder')}
											className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
										/>
										<label
											htmlFor='filter-reminder'
											className='mr-2 text-sm text-gray-700 flex items-center'
										>
											<Clock className='ml-1 h-4 w-4 text-amber-500' />
											تذكيرات
										</label>
									</div>

									<div className='flex items-center'>
										<input
											id='filter-alert'
											type='checkbox'
											checked={selectedTypes.includes('alert')}
											onChange={() => toggleNotificationType('alert')}
											className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
										/>
										<label
											htmlFor='filter-alert'
											className='mr-2 text-sm text-gray-700 flex items-center'
										>
											<AlertCircle className='ml-1 h-4 w-4 text-red-500' />
											تنبيهات
										</label>
									</div>
								</div>

								<div className='p-3 border-t border-gray-200'>
									<h3 className='text-sm font-medium text-gray-700 mb-2'>ترتيب حسب</h3>
									<select
										value={sortOrder}
										onChange={(e) =>
											setSortOrder(e.target.value as 'newest' | 'oldest' | 'priority')
										}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									>
										<option value='newest'>الأحدث أولاً</option>
										<option value='oldest'>الأقدم أولاً</option>
										<option value='priority'>الأولوية</option>
									</select>
								</div>

								<div className='p-3 border-t border-gray-200 flex justify-between'>
									<button
										onClick={() => {
											setSelectedTypes([]);
											setSortOrder('newest');
										}}
										className='text-sm text-red-600 hover:text-red-800'
									>
										إعادة ضبط
									</button>

									<button
										onClick={() => setShowFilterMenu(false)}
										className='text-sm font-medium text-green-600 hover:text-green-800'
									>
										تطبيق
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				{/* شريط البحث والتبويبات */}
				<div className='p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3'>
					<div className='flex space-x-3 space-x-reverse'>
						<button
							onClick={() => setActiveTab('all')}
							className={`px-3 py-1.5 text-sm font-medium ${
								activeTab === 'all' ? 'bg-green-100 text-green-800' : 'text-gray-700 hover:bg-gray-100'
							} rounded-md`}
						>
							الكل ({notifications.length})
						</button>

						<button
							onClick={() => setActiveTab('unread')}
							className={`px-3 py-1.5 text-sm font-medium ${
								activeTab === 'unread' ? 'bg-blue-100 text-blue-800' : 'text-gray-700 hover:bg-gray-100'
							} rounded-md`}
						>
							غير مقروءة ({notifications.filter((n) => n.status === 'unread').length})
						</button>

						<button
							onClick={() => setActiveTab('read')}
							className={`px-3 py-1.5 text-sm font-medium ${
								activeTab === 'read' ? 'bg-gray-100 text-gray-800' : 'text-gray-700 hover:bg-gray-100'
							} rounded-md`}
						>
							مقروءة ({notifications.filter((n) => n.status === 'read').length})
						</button>
					</div>

					<div className='relative w-full sm:w-auto'>
						<input
							type='text'
							placeholder='بحث في الإشعارات...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='pr-10 block w-full sm:w-64 shadow-sm border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 sm:text-sm'
						/>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-4 w-4 text-gray-400' />
						</div>
					</div>
				</div>

				{/* رسالة التحميل */}
				{isLoading ? (
					<div className='p-8 text-center'>
						<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto'></div>
						<p className='mt-2 text-gray-600'>جاري تحميل الإشعارات...</p>
					</div>
				) : filteredNotifications.length === 0 ? (
					// رسالة لا توجد إشعارات
					<div className='p-8 text-center'>
						<Bell className='h-10 w-10 text-gray-300 mx-auto mb-2' />
						<h3 className='text-lg font-medium text-gray-900'>لا توجد إشعارات</h3>
						<p className='mt-1 text-gray-500'>
							{searchQuery || selectedTypes.length > 0
								? 'لا توجد إشعارات تطابق معايير البحث'
								: activeTab === 'unread'
								? 'ليس لديك إشعارات غير مقروءة'
								: activeTab === 'read'
								? 'ليس لديك إشعارات مقروءة بعد'
								: 'ليس لديك أي إشعارات حالياً'}
						</p>
						{(searchQuery || selectedTypes.length > 0) && (
							<button
								onClick={() => {
									setSearchQuery('');
									setSelectedTypes([]);
								}}
								className='mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none'
							>
								إزالة الفلاتر
							</button>
						)}
					</div>
				) : (
					<div>
						{/* شريط الإجراءات الجماعية */}
						{showBulkActions && (
							<div className='p-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center'>
								<div className='flex items-center'>
									<input
										id='select-all'
										type='checkbox'
										checked={
											selectedNotificationIds.length === filteredNotifications.length &&
											filteredNotifications.length > 0
										}
										onChange={toggleSelectAll}
										className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
									/>
									<label htmlFor='select-all' className='mr-2 text-sm text-gray-700'>
										تحديد الكل ({selectedNotificationIds.length}/{filteredNotifications.length})
									</label>
								</div>

								<div className='flex space-x-2 space-x-reverse'>
									<button
										onClick={() => executeBulkAction('markAsRead')}
										disabled={selectedNotificationIds.length === 0 || isProcessing}
										className='px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
									>
										<Check className='ml-1 h-3 w-3' />
										تأشير كمقروء
									</button>

									<button
										onClick={() => executeBulkAction('delete')}
										disabled={selectedNotificationIds.length === 0 || isProcessing}
										className='px-3 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center'
									>
										<Trash className='ml-1 h-3 w-3' />
										حذف
									</button>
								</div>
							</div>
						)}

						{/* قائمة الإشعارات */}
						<div className='divide-y divide-gray-200'>
							{filteredNotifications.map((notification) => (
								<div
									key={notification.id}
									className={`group hover:bg-gray-50 relative ${
										notification.status === 'unread' ? 'bg-blue-50' : ''
									}`}
								>
									<div className='px-4 py-4 sm:px-6 flex items-start'>
										{showBulkActions && (
											<div className='mt-1 ml-3'>
												<input
													type='checkbox'
													checked={selectedNotificationIds.includes(notification.id)}
													onChange={() => {
														setSelectedNotificationIds((prev) => {
															if (prev.includes(notification.id)) {
																return prev.filter((id) => id !== notification.id);
															} else {
																return [...prev, notification.id];
															}
														});
													}}
													className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
												/>
											</div>
										)}

										<div className='ml-3 flex-shrink-0 mt-1'>
											{getNotificationIcon(notification.type)}
										</div>

										<div className='min-w-0 flex-1 flex justify-between'>
											<div className='text-sm mr-2'>
												<button
													onClick={() => {
														if (notification.status === 'unread') {
															markAsRead(notification.id);
														}
														setSelectedNotification(notification);
													}}
													className='block text-right font-medium text-gray-900 hover:text-gray-600 focus:outline-none'
												>
													{notification.title}
												</button>
												<p className='mt-1 text-gray-500 line-clamp-2'>
													{notification.message}
												</p>

												<div className='mt-2 flex items-center'>
													<span className='text-xs text-gray-500 flex items-center'>
														<Clock className='ml-1 h-3 w-3' />
														{formatTimeAgo(notification.timestamp)}
													</span>

													<span
														className={`mr-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(
															notification.priority
														)}`}
													>
														{getPriorityName(notification.priority)}
													</span>

													{notification.actionUrl && (
														<Link
															href={notification.actionUrl}
															className='mr-3 text-xs text-green-600 hover:text-green-800'
														>
															عرض التفاصيل
														</Link>
													)}
												</div>
											</div>

											{/* إجراءات الإشعار */}
											<div className='ml-5 flex-shrink-0 flex space-x-2 space-x-reverse'>
												<button
													onClick={() => toggleNotificationStatus(notification.id)}
													className='text-gray-400 hover:text-blue-500'
													title={
														notification.status === 'read'
															? 'تأشير كغير مقروء'
															: 'تأشير كمقروء'
													}
												>
													{notification.status === 'read' ? (
														<Eye className='h-5 w-5' />
													) : (
														<Check className='h-5 w-5' />
													)}
												</button>

												<button
													onClick={() => {
														setNotificationToDelete(notification.id);
														setShowConfirmDeleteModal(true);
													}}
													className='text-gray-400 hover:text-red-500'
													title='حذف'
												>
													<Trash className='h-5 w-5' />
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* نافذة عرض تفاصيل الإشعار */}
			{selectedNotification && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white p-5 rounded-md shadow-lg max-w-xl w-full'>
						<div className='mb-4 flex justify-between items-start'>
							<div className='flex items-start'>
								<div className='ml-3 mt-0.5'>{getNotificationIcon(selectedNotification.type)}</div>
								<div>
									<h3 className='text-lg font-bold text-gray-900 mr-2'>
										{selectedNotification.title}
									</h3>
									<div className='flex items-center text-sm text-gray-500 mt-1'>
										<Clock className='ml-1 h-4 w-4' />
										<span>{new Date(selectedNotification.timestamp).toLocaleString('ar-SA')}</span>

										<span
											className={`mr-3 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(
												selectedNotification.priority
											)}`}
										>
											{getPriorityName(selectedNotification.priority)}
										</span>
									</div>
								</div>
							</div>

							<button
								onClick={() => setSelectedNotification(null)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-5 w-5' />
							</button>
						</div>

						<div className='border-t border-b border-gray-200 py-4 my-4'>
							<p className='text-gray-700 whitespace-pre-line'>{selectedNotification.message}</p>
						</div>

						{selectedNotification.metadata && Object.keys(selectedNotification.metadata).length > 0 && (
							<div className='mb-4'>
								<h4 className='text-sm font-medium text-gray-700 mb-2'>معلومات إضافية</h4>
								<div className='bg-gray-50 p-3 rounded-md'>
									<dl className='grid grid-cols-2 gap-x-4 gap-y-2 text-sm'>
										{Object.entries(selectedNotification.metadata).map(([key, value]) => {
											// تجاهل القيم الفارغة والقيم غير البسيطة
											if (value === null || value === undefined || typeof value === 'object')
												return null;

											let displayKey = key;
											// ترجمة المفاتيح الشائعة
											switch (key) {
												case 'orderId':
													displayKey = 'رقم الطلب';
													break;
												case 'customerId':
													displayKey = 'رقم العميل';
													break;
												case 'amount':
													displayKey = 'المبلغ';
													break;
												case 'paymentId':
													displayKey = 'رقم الدفعة';
													break;
												case 'status':
													displayKey = 'الحالة';
													break;
												case 'dueDate':
													displayKey = 'تاريخ الاستحقاق';
													break;
												case 'reason':
													displayKey = 'السبب';
													break;
												case 'systemUpdate':
													displayKey = 'تحديث النظام';
													break;
												case 'maintenanceWindow':
													displayKey = 'مدة الصيانة';
													break;
												case 'currentQuantity':
													displayKey = 'الكمية الحالية';
													break;
												case 'minimumQuantity':
													displayKey = 'الحد الأدنى';
													break;
												default:
													// تحويل camelCase إلى كلمات منفصلة
													displayKey = key
														.replace(/([A-Z])/g, ' $1')
														.replace(/^./, (str) => str.toUpperCase());
											}

											// تنسيق القيمة إذا كانت بوليانية
											let displayValue = value;
											if (typeof value === 'boolean') {
												displayValue = value ? 'نعم' : 'لا';
											} else if (
												typeof value === 'string' &&
												value.match(/^\d{4}-\d{2}-\d{2}T/)
											) {
												// إذا كانت القيمة تاريخ ISO
												displayValue = new Date(value).toLocaleString('ar-SA');
											} else if (key === 'amount') {
												displayValue = `${value} ر.س`;
											}

											return (
												<div key={key} className='col-span-2 md:col-span-1'>
													<dt className='text-gray-500 inline'>{displayKey}: </dt>
													<dd className='text-gray-900 inline'>{displayValue}</dd>
												</div>
											);
										})}
									</dl>
								</div>
							</div>
						)}

						<div className='flex justify-end mt-4 space-x-2 space-x-reverse'>
							<button
								onClick={() => {
									toggleNotificationStatus(selectedNotification.id);
									setSelectedNotification(null);
								}}
								className='px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none flex items-center'
							>
								{selectedNotification.status === 'read' ? (
									<>
										<Eye className='ml-2 -mr-1 h-5 w-5' />
										تأشير كغير مقروء
									</>
								) : (
									<>
										<Check className='ml-2 -mr-1 h-5 w-5' />
										تأشير كمقروء
									</>
								)}
							</button>

							{selectedNotification.actionUrl && (
								<Link
									href={selectedNotification.actionUrl}
									className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none'
								>
									عرض التفاصيل
								</Link>
							)}
						</div>
					</div>
				</div>
			)}

			{/* نافذة تأكيد الحذف */}
			{showConfirmDeleteModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white p-5 rounded-md shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-gray-900 mb-4'>تأكيد الحذف</h3>
						<p className='text-gray-700 mb-4'>
							هل أنت متأكد من رغبتك في حذف هذا الإشعار؟ لا يمكن التراجع عن هذا الإجراء.
						</p>
						<div className='flex justify-end space-x-2 space-x-reverse'>
							<button
								onClick={() => {
									setNotificationToDelete(null);
									setShowConfirmDeleteModal(false);
								}}
								className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
							>
								إلغاء
							</button>
							<button
								onClick={() => notificationToDelete && deleteNotification(notificationToDelete)}
								className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
							>
								حذف
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
