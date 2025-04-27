// app/dashboard/deliveries/page.tsx
'use client';

import { addDays, format, isSameDay, parseISO } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
	AlertTriangle,
	ArrowRight,
	Calendar,
	CalendarDays,
	Calendar as CalendarIcon,
	ChevronLeft,
	ChevronRight,
	Clock,
	Download,
	ExternalLink,
	Filter,
	MapPin,
	Phone,
	Printer,
	Search,
	Truck,
	User,
	X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

// أنواع حالة التسليم
type DeliveryStatus = 'pending' | 'scheduled' | 'in-transit' | 'delivered' | 'cancelled' | 'failed';

// واجهة بيانات التسليم
interface Delivery {
	id: string;
	orderId: string;
	customerName: string;
	customerPhone: string;
	address: string;
	scheduledTime: string;
	status: DeliveryStatus;
	items: number;
	amount: number;
	paymentMethod: 'cash' | 'card' | 'transfer';
	driverId?: string;
	driverName?: string;
	notes?: string;
}

export default function DeliveriesPage() {
	const [selectedDate, setSelectedDate] = useState<Date>(new Date());
	const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus | 'all'>('all');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const [deliveries, setDeliveries] = useState<Delivery[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
	const [isDetailsOpen, setIsDetailsOpen] = useState(false);

	// إنشاء قائمة بيانات العرض
	useEffect(() => {
		const fetchDeliveries = async () => {
			try {
				setIsLoading(true);
				// في التطبيق الحقيقي، سنقوم بطلب البيانات من الخادم
				// const response = await fetch('/api/deliveries?date=' + format(selectedDate, 'yyyy-MM-dd'));
				// const data = await response.json();

				// محاكاة استجابة API
				await new Promise((resolve) => setTimeout(resolve, 800));

				// بيانات وهمية للعرض
				const mockDeliveries: Delivery[] = [
					{
						id: 'DEL-1001',
						orderId: '10023',
						customerName: 'أحمد محمد',
						customerPhone: '0501234567',
						address: 'الرياض، حي النرجس، شارع الأمير سعود',
						scheduledTime: '2025-04-26T10:00:00Z',
						status: 'scheduled',
						items: 2,
						amount: 450,
						paymentMethod: 'cash',
						driverId: 'D001',
						driverName: 'خالد سالم',
						notes: 'الاتصال قبل الوصول بـ 15 دقيقة',
					},
					{
						id: 'DEL-1002',
						orderId: '10024',
						customerName: 'سلطان العتيبي',
						customerPhone: '0561234567',
						address: 'الرياض، حي الملقا، شارع الفاروق',
						scheduledTime: '2025-04-26T11:30:00Z',
						status: 'in-transit',
						items: 1,
						amount: 320,
						paymentMethod: 'card',
						driverId: 'D003',
						driverName: 'عبدالله محمد',
					},
					{
						id: 'DEL-1003',
						orderId: '10025',
						customerName: 'عبدالرحمن السالم',
						customerPhone: '0551234567',
						address: 'الرياض، حي المروج، شارع الملك فهد',
						scheduledTime: '2025-04-26T13:00:00Z',
						status: 'pending',
						items: 3,
						amount: 670,
						paymentMethod: 'transfer',
					},
					{
						id: 'DEL-1004',
						orderId: '10026',
						customerName: 'محمد الدوسري',
						customerPhone: '0541234567',
						address: 'الرياض، حي الياسمين، شارع عثمان بن عفان',
						scheduledTime: '2025-04-26T14:30:00Z',
						status: 'delivered',
						items: 2,
						amount: 520,
						paymentMethod: 'cash',
						driverId: 'D002',
						driverName: 'فهد العنزي',
						notes: 'تم التسليم في الموعد المحدد',
					},
					{
						id: 'DEL-1005',
						orderId: '10027',
						customerName: 'فيصل العنزي',
						customerPhone: '0531234567',
						address: 'الرياض، حي الشفا، شارع الغروب',
						scheduledTime: '2025-04-26T16:00:00Z',
						status: 'cancelled',
						items: 1,
						amount: 280,
						paymentMethod: 'card',
						notes: 'تم إلغاء الطلب من قبل العميل',
					},
					{
						id: 'DEL-1006',
						orderId: '10028',
						customerName: 'ناصر القحطاني',
						customerPhone: '0521234567',
						address: 'الرياض، حي العليا، شارع الأمير تركي',
						scheduledTime: '2025-04-26T17:30:00Z',
						status: 'scheduled',
						items: 4,
						amount: 890,
						paymentMethod: 'transfer',
						driverId: 'D001',
						driverName: 'خالد سالم',
					},
					{
						id: 'DEL-1007',
						orderId: '10029',
						customerName: 'سعد المالكي',
						customerPhone: '0511234567',
						address: 'الرياض، حي الرائد، شارع الأمير سلمان',
						scheduledTime: '2025-04-26T18:00:00Z',
						status: 'failed',
						items: 1,
						amount: 450,
						paymentMethod: 'cash',
						driverId: 'D003',
						driverName: 'عبدالله محمد',
						notes: 'العميل غير متواجد في الموقع',
					},
				];

				setDeliveries(mockDeliveries);
				setIsLoading(false);
			} catch (error) {
				console.error('Error fetching deliveries:', error);
				setIsLoading(false);
			}
		};

		fetchDeliveries();
	}, [selectedDate]);

	// فلترة البيانات حسب الحالة والبحث
	const filteredDeliveries = useMemo(() => {
		return deliveries.filter((delivery) => {
			// فلترة حسب الحالة
			if (selectedStatus !== 'all' && delivery.status !== selectedStatus) {
				return false;
			}

			// فلترة حسب البحث
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				return (
					delivery.id.toLowerCase().includes(query) ||
					delivery.orderId.toLowerCase().includes(query) ||
					delivery.customerName.toLowerCase().includes(query) ||
					delivery.customerPhone.includes(query) ||
					delivery.address.toLowerCase().includes(query)
				);
			}

			return true;
		});
	}, [deliveries, selectedStatus, searchQuery]);

	// الألوان والنصوص حسب الحالة
	const getStatusInfo = (status: DeliveryStatus) => {
		switch (status) {
			case 'pending':
				return {
					text: 'قيد الانتظار',
					color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
				};
			case 'scheduled':
				return {
					text: 'مجدول',
					color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
				};
			case 'in-transit':
				return {
					text: 'قيد التوصيل',
					color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
				};
			case 'delivered':
				return {
					text: 'تم التسليم',
					color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
				};
			case 'cancelled':
				return {
					text: 'ملغي',
					color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
				};
			case 'failed':
				return {
					text: 'فشل التسليم',
					color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
				};
			default:
				return {
					text: 'غير معروف',
					color: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
				};
		}
	};

	// تغيير التاريخ المحدد
	const changeDate = (offset: number) => {
		setSelectedDate((prevDate) => addDays(prevDate, offset));
		setIsCalendarOpen(false);
	};

	// تحديد تسليم للعرض التفصيلي
	const showDeliveryDetails = (delivery: Delivery) => {
		setSelectedDelivery(delivery);
		setIsDetailsOpen(true);
	};

	// إغلاق العرض التفصيلي
	const closeDetails = () => {
		setIsDetailsOpen(false);
	};

	// مكون تفاصيل التسليم
	const DeliveryDetails = () => {
		if (!selectedDelivery) return null;

		const { text: statusText, color: statusColor } = getStatusInfo(selectedDelivery.status);

		return (
			<div className='fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4'>
				<div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col'>
					<div className='p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
						<h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
							تفاصيل التسليم #{selectedDelivery.id}
						</h2>
						<button
							onClick={closeDetails}
							className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
						>
							<X className='h-6 w-6' />
						</button>
					</div>

					<div className='p-6 overflow-y-auto flex-1'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
							<div>
								<div className='flex items-center space-x-2 space-x-reverse mb-4'>
									<User className='h-5 w-5 text-gray-400 dark:text-gray-500' />
									<div>
										<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>العميل</p>
										<p className='text-base font-semibold text-gray-900 dark:text-gray-100'>
											{selectedDelivery.customerName}
										</p>
									</div>
								</div>

								<div className='flex items-center space-x-2 space-x-reverse mb-4'>
									<Phone className='h-5 w-5 text-gray-400 dark:text-gray-500' />
									<div>
										<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
											رقم الهاتف
										</p>
										<p className='text-base font-semibold text-gray-900 dark:text-gray-100'>
											{selectedDelivery.customerPhone}
										</p>
									</div>
								</div>

								<div className='flex items-center space-x-2 space-x-reverse mb-4'>
									<MapPin className='h-5 w-5 text-gray-400 dark:text-gray-500' />
									<div>
										<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>العنوان</p>
										<p className='text-base font-semibold text-gray-900 dark:text-gray-100'>
											{selectedDelivery.address}
										</p>
									</div>
								</div>
							</div>

							<div>
								<div className='flex items-center space-x-2 space-x-reverse mb-4'>
									<Clock className='h-5 w-5 text-gray-400 dark:text-gray-500' />
									<div>
										<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
											وقت التسليم المجدول
										</p>
										<p className='text-base font-semibold text-gray-900 dark:text-gray-100'>
											{format(parseISO(selectedDelivery.scheduledTime), 'h:mm a', { locale: ar })}
										</p>
									</div>
								</div>

								<div className='flex items-center space-x-2 space-x-reverse mb-4'>
									<div className={`h-3 w-3 rounded-full ${statusColor.split(' ')[0]}`}></div>
									<div>
										<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>الحالة</p>
										<p className={`text-base font-semibold ${statusColor}`}>{statusText}</p>
									</div>
								</div>

								{selectedDelivery.driverName && (
									<div className='flex items-center space-x-2 space-x-reverse mb-4'>
										<Truck className='h-5 w-5 text-gray-400 dark:text-gray-500' />
										<div>
											<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
												السائق
											</p>
											<p className='text-base font-semibold text-gray-900 dark:text-gray-100'>
												{selectedDelivery.driverName}
											</p>
										</div>
									</div>
								)}
							</div>
						</div>

						<div className='bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6'>
							<h3 className='text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4'>
								تفاصيل الطلب
							</h3>
							<div className='flex justify-between mb-2'>
								<p className='text-gray-500 dark:text-gray-400'>رقم الطلب</p>
								<p className='font-semibold text-gray-900 dark:text-gray-100'>
									#{selectedDelivery.orderId}
								</p>
							</div>
							<div className='flex justify-between mb-2'>
								<p className='text-gray-500 dark:text-gray-400'>عدد العناصر</p>
								<p className='font-semibold text-gray-900 dark:text-gray-100'>
									{selectedDelivery.items}
								</p>
							</div>
							<div className='flex justify-between mb-2'>
								<p className='text-gray-500 dark:text-gray-400'>المبلغ الإجمالي</p>
								<p className='font-semibold text-gray-900 dark:text-gray-100'>
									<span className='ml-1'>{selectedDelivery.amount}</span>
									<span className='inline-block relative h-4 w-4 ml-1'>
										<Image
											src='/images/Saudi_Riyal_Symbol.png'
											alt='ر.س'
											fill
											sizes='16px'
											style={{ objectFit: 'contain' }}
										/>
									</span>
								</p>
							</div>
							<div className='flex justify-between'>
								<p className='text-gray-500 dark:text-gray-400'>طريقة الدفع</p>
								<p className='font-semibold text-gray-900 dark:text-gray-100'>
									{selectedDelivery.paymentMethod === 'cash'
										? 'نقداً'
										: selectedDelivery.paymentMethod === 'card'
										? 'بطاقة ائتمان'
										: 'تحويل بنكي'}
								</p>
							</div>
						</div>

						{selectedDelivery.notes && (
							<div className='bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 rounded-lg p-4'>
								<div className='flex items-start space-x-2 space-x-reverse'>
									<AlertTriangle className='h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5' />
									<div>
										<h4 className='text-sm font-medium text-yellow-800 dark:text-yellow-300'>
											ملاحظات
										</h4>
										<p className='mt-1 text-sm text-yellow-700 dark:text-yellow-400'>
											{selectedDelivery.notes}
										</p>
									</div>
								</div>
							</div>
						)}
					</div>

					<div className='p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3 space-x-reverse'>
						<button
							onClick={closeDetails}
							className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
						>
							إغلاق
						</button>

						<Link
							href={`/dashboard/orders/${selectedDelivery.orderId}`}
							className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
						>
							<ExternalLink className='h-4 w-4 inline-block ml-1' />
							عرض الطلب
						</Link>
					</div>
				</div>
			</div>
		);
	};

	// مكون التقويم
	const CalendarPopover = () => {
		// إنشاء مصفوفة أيام لمدة أسبوع
		const days = Array.from({ length: 7 }, (_, index) => addDays(new Date(), index - 3));

		if (!isCalendarOpen) return null;

		return (
			<div
				className='absolute top-full right-0 mt-2 p-2 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 border border-gray-200 dark:border-gray-700'
				style={{ width: '370px' }}
			>
				<div className='grid grid-cols-7 gap-1 mb-2'>
					{days.map((day, index) => (
						<button
							key={index}
							className={`p-2 rounded-md text-center transition-colors ${
								isSameDay(day, selectedDate)
									? 'bg-blue-600 text-white'
									: 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
							}`}
							onClick={() => {
								setSelectedDate(day);
								setIsCalendarOpen(false);
							}}
						>
							<div className='text-xs font-medium mb-1'>{format(day, 'E', { locale: ar })}</div>
							<div className='text-sm font-bold'>{format(day, 'd', { locale: ar })}</div>
						</button>
					))}
				</div>

				<div className='text-center p-2 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700'>
					<button
						className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium'
						onClick={() => {
							setSelectedDate(new Date());
							setIsCalendarOpen(false);
						}}
					>
						اليوم
					</button>
				</div>
			</div>
		);
	};

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-wrap justify-between items-center'>
				<div>
					<div className='flex items-center mb-1'>
						<Link
							href='/dashboard'
							className='text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 ml-2'
						>
							<ArrowRight className='h-5 w-5' />
						</Link>
						<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>جدول التسليمات</h1>
					</div>
					<p className='text-gray-500 dark:text-gray-400 text-sm'>إدارة وتتبع حالة توصيل الطلبات للعملاء</p>
				</div>

				<div className='flex mt-4 sm:mt-0 space-x-3 space-x-reverse'>
					<div className='relative'>
						<button
							onClick={() => setIsCalendarOpen(!isCalendarOpen)}
							className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
						>
							<CalendarIcon className='ml-1.5 -mr-1 h-5 w-5 text-gray-400 dark:text-gray-500' />
							<span className='mx-1 font-medium'>
								{format(selectedDate, 'EEEE, d MMMM yyyy', { locale: ar })}
							</span>
						</button>

						{isCalendarOpen && <CalendarPopover />}
					</div>

					<button
						onClick={() => window.print()}
						className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
					>
						<Printer className='ml-1.5 -mr-1 h-5 w-5 text-gray-400 dark:text-gray-500' />
						طباعة الجدول
					</button>

					<button
						onClick={() => alert('تم تصدير البيانات')}
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
					>
						<Download className='ml-1.5 -mr-1 h-5 w-5' />
						تصدير
					</button>
				</div>
			</div>

			{/* أدوات الفلترة والبحث */}
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 p-4'>
				<div className='flex flex-wrap gap-4'>
					<div className='flex-1 min-w-[200px]'>
						<div className='relative'>
							<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
								<Search className='h-5 w-5 text-gray-400 dark:text-gray-500' />
							</div>
							<input
								type='text'
								className='block w-full pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm'
								placeholder='بحث في رقم التسليم، اسم العميل، العنوان...'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
					</div>

					<div className='flex space-x-4 space-x-reverse'>
						<div className='relative'>
							<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
								<Filter className='h-5 w-5 text-gray-400 dark:text-gray-500' />
							</div>
							<select
								className='block appearance-none pr-10 py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:text-white text-sm'
								value={selectedStatus}
								onChange={(e) => setSelectedStatus(e.target.value as DeliveryStatus | 'all')}
							>
								<option value='all'>جميع الحالات</option>
								<option value='pending'>قيد الانتظار</option>
								<option value='scheduled'>مجدول</option>
								<option value='in-transit'>قيد التوصيل</option>
								<option value='delivered'>تم التسليم</option>
								<option value='cancelled'>ملغي</option>
								<option value='failed'>فشل التسليم</option>
							</select>
						</div>

						<div className='flex space-x-2 space-x-reverse border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden'>
							<button
								onClick={() => changeDate(-1)}
								className='px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
							>
								<ChevronRight className='h-5 w-5' />
							</button>
							<button
								onClick={() => setSelectedDate(new Date())}
								className='px-3 py-2 bg-white dark:bg-gray-700 border-r border-l border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
							>
								<Calendar className='h-5 w-5' />
							</button>
							<button
								onClick={() => changeDate(1)}
								className='px-3 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
							>
								<ChevronLeft className='h-5 w-5' />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* جدول التسليمات */}
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
				<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700'>
					<h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>
						توصيلات {format(selectedDate, 'd MMMM yyyy', { locale: ar })}
						<span className='mr-2 text-sm text-gray-500 dark:text-gray-400'>
							({filteredDeliveries.length} تسليم)
						</span>
					</h2>
				</div>

				{isLoading ? (
					<div className='flex flex-col items-center justify-center py-16'>
						<div className='w-12 h-12 border-4 border-t-blue-600 border-gray-200 dark:border-gray-700 rounded-full animate-spin mb-4'></div>
						<p className='text-gray-500 dark:text-gray-400'>جاري تحميل بيانات التسليمات...</p>
					</div>
				) : filteredDeliveries.length === 0 ? (
					<div className='flex flex-col items-center justify-center py-16 px-4 text-center'>
						<CalendarDays className='h-16 w-16 text-gray-400 dark:text-gray-500 mb-4' />
						<h3 className='text-lg font-medium text-gray-900 dark:text-gray-100 mb-1'>
							لا توجد تسليمات في هذا اليوم
						</h3>
						<p className='text-gray-500 dark:text-gray-400 max-w-md mb-6'>
							لم يتم العثور على أي تسليمات مجدولة في التاريخ المحدد أو لا توجد نتائج تطابق عوامل التصفية
							الحالية.
						</p>
						<button
							onClick={() => {
								setSelectedDate(new Date());
								setSelectedStatus('all');
								setSearchQuery('');
							}}
							className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800'
						>
							العودة إلى اليوم
						</button>
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
							<thead className='bg-gray-50 dark:bg-gray-700'>
								<tr>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
									>
										رقم التسليم
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
									>
										العميل
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
									>
										العنوان
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
									>
										الوقت
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
									>
										السائق
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
									>
										الحالة
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
									>
										المبلغ
									</th>
									<th
										scope='col'
										className='px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider'
									>
										إجراءات
									</th>
								</tr>
							</thead>
							<tbody className='bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700'>
								{filteredDeliveries.map((delivery) => {
									const { text: statusText, color: statusColor } = getStatusInfo(delivery.status);

									return (
										<tr key={delivery.id} className='hover:bg-gray-50 dark:hover:bg-gray-700'>
											<td className='px-6 py-4 whitespace-nowrap'>
												<button
													onClick={() => showDeliveryDetails(delivery)}
													className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium'
												>
													{delivery.id}
												</button>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='flex items-center'>
													<div className='ml-2 flex flex-col'>
														<span className='text-sm font-medium text-gray-900 dark:text-gray-100'>
															{delivery.customerName}
														</span>
														<span className='text-sm text-gray-500 dark:text-gray-400'>
															{delivery.customerPhone}
														</span>
													</div>
												</div>
											</td>
											<td className='px-6 py-4'>
												<div className='text-sm text-gray-500 dark:text-gray-400 max-w-xs truncate'>
													{delivery.address}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
												{format(parseISO(delivery.scheduledTime), 'h:mm a', { locale: ar })}
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
												{delivery.driverName || '-'}
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<span
													className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}
												>
													{statusText}
												</span>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400'>
												<div className='flex items-center justify-start'>
													<span className='ml-1'>{delivery.amount}</span>
													<span className='inline-block relative h-4 w-4'>
														<Image
															src='/images/Saudi_Riyal_Symbol.png'
															alt='ر.س'
															fill
															sizes='16px'
															style={{ objectFit: 'contain' }}
														/>
													</span>
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap text-sm text-center'>
												<button
													onClick={() => showDeliveryDetails(delivery)}
													className='text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mx-2'
													title='عرض التفاصيل'
												>
													<ExternalLink className='h-5 w-5' />
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}
			</div>

			{/* مودال تفاصيل التسليم */}
			{isDetailsOpen && <DeliveryDetails />}
		</div>
	);
}
