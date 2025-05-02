'use client';

import {
	ArrowLeft,
	BarChart2,
	CheckCircle,
	ChevronDown,
	Clipboard,
	DollarSign,
	Download,
	Edit,
	Eye,
	FileText,
	Gift,
	MoreHorizontal,
	Plus,
	Search,
	Settings,
	User,
	X,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface GiftCard {
	id: string;
	code: string;
	amount: number;
	status: 'active' | 'redeemed' | 'expired' | 'cancelled';
	type: 'fixed' | 'percentage';
	createdAt: string;
	expireAt: string;
	issuedTo: {
		id: string;
		name: string;
		email: string;
		phone: string;
	} | null;
	redeemedAt: string | null;
	redeemedBy: string | null;
	notes: string | null;
	balance: number;
}

interface GiftCardTemplate {
	id: string;
	name: string;
	description: string;
	defaultAmount: number;
	type: 'fixed' | 'percentage';
	design: string;
	isActive: boolean;
}

interface GiftCardStats {
	totalIssued: number;
	activeCount: number;
	redeemedCount: number;
	expiredCount: number;
	cancelledCount: number;
	totalValue: number;
	redeemedValue: number;
	activeValue: number;
}

export default function GiftCardsPage() {
	const [loading, setLoading] = useState(true);
	const [giftCards, setGiftCards] = useState<GiftCard[]>([]);
	const [filteredCards, setFilteredCards] = useState<GiftCard[]>([]);
	const [templates, setTemplates] = useState<GiftCardTemplate[]>([]);
	const [stats, setStats] = useState<GiftCardStats | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [showDetailsModal, setShowDetailsModal] = useState(false);
	const [selectedCard, setSelectedCard] = useState<GiftCard | null>(null);
	const [activeTab, setActiveTab] = useState<'cards' | 'templates'>('cards');

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchGiftCardData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية للبطاقات
			const mockGiftCards: GiftCard[] = [
				{
					id: 'gc-001',
					code: 'GIFT-123456',
					amount: 200,
					status: 'active',
					type: 'fixed',
					createdAt: '2023-09-15',
					expireAt: '2023-12-31',
					issuedTo: {
						id: 'cust-001',
						name: 'محمد أحمد',
						email: 'mohamed@example.com',
						phone: '0501234567',
					},
					redeemedAt: null,
					redeemedBy: null,
					notes: 'هدية خاصة',
					balance: 200,
				},
				{
					id: 'gc-002',
					code: 'GIFT-789012',
					amount: 500,
					status: 'redeemed',
					type: 'fixed',
					createdAt: '2023-09-10',
					expireAt: '2023-12-31',
					issuedTo: {
						id: 'cust-002',
						name: 'أحمد علي',
						email: 'ahmed@example.com',
						phone: '0507654321',
					},
					redeemedAt: '2023-09-18',
					redeemedBy: 'أحمد علي',
					notes: 'شكر على التعاون',
					balance: 0,
				},
				{
					id: 'gc-003',
					code: 'DISC-15PERC',
					amount: 15,
					status: 'active',
					type: 'percentage',
					createdAt: '2023-09-12',
					expireAt: '2023-10-31',
					issuedTo: null,
					redeemedAt: null,
					redeemedBy: null,
					notes: 'عرض ترويجي لمجموعة الخريف',
					balance: 15,
				},
				{
					id: 'gc-004',
					code: 'GIFT-345678',
					amount: 300,
					status: 'cancelled',
					type: 'fixed',
					createdAt: '2023-09-05',
					expireAt: '2023-11-30',
					issuedTo: {
						id: 'cust-003',
						name: 'سارة محمد',
						email: 'sara@example.com',
						phone: '0551234567',
					},
					redeemedAt: null,
					redeemedBy: null,
					notes: 'تم إلغاؤها بناءً على طلب العميل',
					balance: 0,
				},
				{
					id: 'gc-005',
					code: 'GIFT-901234',
					amount: 1000,
					status: 'active',
					type: 'fixed',
					createdAt: '2023-09-20',
					expireAt: '2024-03-31',
					issuedTo: {
						id: 'cust-004',
						name: 'فيصل العتيبي',
						email: 'faisal@example.com',
						phone: '0561234567',
					},
					redeemedAt: null,
					redeemedBy: null,
					notes: 'هدية للعميل المميز',
					balance: 1000,
				},
				{
					id: 'gc-006',
					code: 'GIFT-567890',
					amount: 250,
					status: 'expired',
					type: 'fixed',
					createdAt: '2023-06-15',
					expireAt: '2023-09-15',
					issuedTo: {
						id: 'cust-005',
						name: 'نورة السالم',
						email: 'noura@example.com',
						phone: '0531234567',
					},
					redeemedAt: null,
					redeemedBy: null,
					notes: 'هدية عيد الفطر',
					balance: 0,
				},
				{
					id: 'gc-007',
					code: 'DISC-20PERC',
					amount: 20,
					status: 'redeemed',
					type: 'percentage',
					createdAt: '2023-09-01',
					expireAt: '2023-10-15',
					issuedTo: {
						id: 'cust-006',
						name: 'عبدالله عمر',
						email: 'abdullah@example.com',
						phone: '0541234567',
					},
					redeemedAt: '2023-09-10',
					redeemedBy: 'عبدالله عمر',
					notes: 'خصم بمناسبة افتتاح الفرع الجديد',
					balance: 0,
				},
			];

			// بيانات تجريبية للقوالب
			const mockTemplates: GiftCardTemplate[] = [
				{
					id: 'tpl-001',
					name: 'بطاقة هدية كلاسيكية',
					description: 'تصميم كلاسيكي أنيق لبطاقات الهدايا بقيمة محددة',
					defaultAmount: 200,
					type: 'fixed',
					design: 'classic',
					isActive: true,
				},
				{
					id: 'tpl-002',
					name: 'بطاقة خصم',
					description: 'بطاقة خصم بنسبة مئوية من قيمة المشتريات',
					defaultAmount: 15,
					type: 'percentage',
					design: 'discount',
					isActive: true,
				},
				{
					id: 'tpl-003',
					name: 'هدية الأعياد',
					description: 'تصميم خاص لبطاقات هدايا الأعياد والمناسبات',
					defaultAmount: 300,
					type: 'fixed',
					design: 'eid',
					isActive: true,
				},
				{
					id: 'tpl-004',
					name: 'بطاقة VIP',
					description: 'بطاقة هدية خاصة للعملاء المميزين',
					defaultAmount: 1000,
					type: 'fixed',
					design: 'vip',
					isActive: true,
				},
			];

			// إحصائيات تجريبية
			const mockStats: GiftCardStats = {
				totalIssued: 46,
				activeCount: 25,
				redeemedCount: 18,
				expiredCount: 2,
				cancelledCount: 1,
				totalValue: 15700,
				redeemedValue: 5200,
				activeValue: 10500,
			};

			setGiftCards(mockGiftCards);
			setFilteredCards(mockGiftCards);
			setTemplates(mockTemplates);
			setStats(mockStats);
			setLoading(false);
		};

		fetchGiftCardData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let filtered = [...giftCards];

		// تطبيق فلتر البحث
		if (searchTerm) {
			filtered = filtered.filter(
				(card) =>
					card.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(card.issuedTo?.name && card.issuedTo.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
					(card.notes && card.notes.toLowerCase().includes(searchTerm.toLowerCase()))
			);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			filtered = filtered.filter((card) => card.status === statusFilter);
		}

		// تطبيق الترتيب
		filtered.sort((a, b) => {
			let comparison = 0;

			if (sortBy === 'createdAt') {
				comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
			} else if (sortBy === 'amount') {
				comparison = a.amount - b.amount;
			} else if (sortBy === 'expireAt') {
				comparison = new Date(a.expireAt).getTime() - new Date(b.expireAt).getTime();
			} else if (sortBy === 'code') {
				comparison = a.code.localeCompare(b.code);
			}

			return sortOrder === 'asc' ? comparison : -comparison;
		});

		setFilteredCards(filtered);
	}, [giftCards, searchTerm, statusFilter, sortBy, sortOrder]);

	// الحصول على شارة حالة البطاقة
	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'active':
				return <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>نشطة</span>;
			case 'redeemed':
				return <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>مستخدمة</span>;
			case 'expired':
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>منتهية</span>;
			case 'cancelled':
				return <span className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'>ملغاة</span>;
			default:
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>{status}</span>;
		}
	};

	// تنسيق القيمة حسب النوع
	const formatAmount = (amount: number, type: string) => {
		if (type === 'percentage') {
			return `${amount}%`;
		} else {
			return `${amount} ريال`;
		}
	};

	// تنسيق التاريخ
	const formatDate = (dateStr: string) => {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('ar-SA');
	};

	// عرض تفاصيل البطاقة
	const showCardDetails = (card: GiftCard) => {
		setSelectedCard(card);
		setShowDetailsModal(true);
	};

	// حالة التحميل
	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<div className='flex items-center'>
						<Link
							href='/dashboard/marketing'
							className='flex items-center text-gray-500 hover:text-gray-700 ml-4'
						>
							<ArrowLeft className='h-5 w-5' />
							<span className='mr-1 text-sm'>العودة</span>
						</Link>
						<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
							<Gift className='inline-block ml-2 h-6 w-6 text-green-600' />
							بطاقات الهدايا
						</h1>
					</div>
					<p className='mt-1 text-sm text-gray-600'>إدارة بطاقات الهدايا وبطاقات الخصم</p>
				</div>

				<div className='flex gap-2'>
					<Link
						href='/dashboard/marketing/gift-cards/new'
						className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700'
					>
						<Plus className='ml-1 h-4 w-4' />
						إصدار بطاقة جديدة
					</Link>

					<Link
						href='/dashboard/reports/marketing/gift-cards'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						التقارير
					</Link>

					<Link
						href='/dashboard/marketing/gift-cards/settings'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Settings className='ml-1 h-4 w-4' />
						الإعدادات
					</Link>
				</div>
			</div>

			{/* ملخص الإحصائيات */}
			{stats && (
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>إجمالي البطاقات</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>{stats.totalIssued}</h3>
								<div className='flex items-center text-xs text-gray-500 mt-1'>
									<span className='flex items-center'>
										<span className='h-2 w-2 rounded-full bg-green-500 ml-1'></span>
										نشطة: {stats.activeCount}
									</span>
									<span className='mx-2'>•</span>
									<span className='flex items-center'>
										<span className='h-2 w-2 rounded-full bg-blue-500 ml-1'></span>
										مستخدمة: {stats.redeemedCount}
									</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-green-100'>
								<Gift className='h-6 w-6 text-green-600' />
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>إجمالي القيمة</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>
									{stats.totalValue.toLocaleString()} ريال
								</h3>
								<div className='mt-1 flex items-center'>
									<span className='text-xs text-green-600 font-medium'>
										{stats.activeValue.toLocaleString()} ريال
									</span>
									<span className='mx-1 text-xs text-gray-500'>متاح للاستخدام</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-green-100'>
								<DollarSign className='h-6 w-6 text-green-600' />
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>البطاقات النشطة</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>{stats.activeCount}</h3>
								<div className='mt-1 text-xs text-gray-500'>
									<span className='text-green-600 font-medium'>
										{((stats.activeCount / stats.totalIssued) * 100).toFixed(1)}%
									</span>{' '}
									من إجمالي البطاقات
								</div>
							</div>
							<div className='p-2 rounded-full bg-green-100'>
								<CheckCircle className='h-6 w-6 text-green-600' />
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>البطاقات المستخدمة</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>{stats.redeemedCount}</h3>
								<div className='mt-1 text-xs text-gray-500'>
									قيمة{' '}
									<span className='text-blue-600 font-medium'>
										{stats.redeemedValue.toLocaleString()} ريال
									</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-blue-100'>
								<FileText className='h-6 w-6 text-blue-600' />
							</div>
						</div>
					</div>
				</div>
			)}

			{/* تبويبات */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='border-b border-gray-200'>
					<nav className='flex -mb-px'>
						<button
							onClick={() => setActiveTab('cards')}
							className={`py-4 px-6 font-medium text-sm border-b-2 ${
								activeTab === 'cards'
									? 'border-green-500 text-green-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Gift className='h-4 w-4 inline-block ml-1' />
							البطاقات المصدرة
						</button>
						<button
							onClick={() => setActiveTab('templates')}
							className={`py-4 px-6 font-medium text-sm border-b-2 ${
								activeTab === 'templates'
									? 'border-green-500 text-green-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Clipboard className='h-4 w-4 inline-block ml-1' />
							قوالب البطاقات
						</button>
					</nav>
				</div>

				<div className='p-6'>
					{activeTab === 'cards' && (
						<div className='space-y-6'>
							{/* أدوات البحث والفلترة */}
							<div className='flex flex-col sm:flex-row gap-4'>
								{/* البحث */}
								<div className='flex-1 relative'>
									<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
										<Search className='h-5 w-5 text-gray-400' />
									</div>
									<input
										type='text'
										value={searchTerm}
										onChange={(e) => setSearchTerm(e.target.value)}
										placeholder='ابحث بالكود، اسم العميل، أو الملاحظات...'
										className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm'
									/>
								</div>

								{/* فلتر الحالة */}
								<div className='sm:w-44'>
									<div className='relative'>
										<select
											value={statusFilter}
											onChange={(e) => setStatusFilter(e.target.value)}
											className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm pr-8'
										>
											<option value='all'>كل الحالات</option>
											<option value='active'>نشطة</option>
											<option value='redeemed'>مستخدمة</option>
											<option value='expired'>منتهية</option>
											<option value='cancelled'>ملغاة</option>
										</select>
										<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
											<ChevronDown className='h-4 w-4 text-gray-400' />
										</div>
									</div>
								</div>

								{/* خيارات الترتيب */}
								<div className='sm:w-52'>
									<div className='relative'>
										<select
											value={sortBy}
											onChange={(e) => setSortBy(e.target.value)}
											className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm pr-8'
										>
											<option value='createdAt'>الترتيب حسب تاريخ الإصدار</option>
											<option value='amount'>الترتيب حسب القيمة</option>
											<option value='expireAt'>الترتيب حسب تاريخ الانتهاء</option>
											<option value='code'>الترتيب حسب الكود</option>
										</select>
										<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
											<ChevronDown className='h-4 w-4 text-gray-400' />
										</div>
									</div>
								</div>

								<button
									onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
									className='sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center'
								>
									{sortOrder === 'asc' ? (
										<svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
											<path
												d='M8 6L12 2L16 6'
												stroke='currentColor'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
											<path
												d='M8 18L12 22L16 18'
												stroke='currentColor'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
										</svg>
									) : (
										<svg className='h-5 w-5' viewBox='0 0 24 24' fill='none'>
											<path
												d='M8 18L12 22L16 18'
												stroke='currentColor'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
											<path
												d='M8 6L12 2L16 6'
												stroke='currentColor'
												strokeWidth='2'
												strokeLinecap='round'
												strokeLinejoin='round'
											/>
										</svg>
									)}
								</button>

								<button
									onClick={() => {
										setSearchTerm('');
										setStatusFilter('all');
										setSortBy('createdAt');
										setSortOrder('desc');
									}}
									className='sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
									disabled={
										!searchTerm &&
										statusFilter === 'all' &&
										sortBy === 'createdAt' &&
										sortOrder === 'desc'
									}
								>
									إعادة تعيين
								</button>
							</div>

							{/* قائمة البطاقات */}
							{filteredCards.length === 0 ? (
								<div className='bg-gray-50 p-8 rounded-lg text-center'>
									<Gift className='mx-auto h-12 w-12 text-gray-300' />
									<h3 className='mt-2 text-lg font-medium text-gray-900'>لا توجد بطاقات</h3>
									<p className='mt-1 text-gray-500'>
										لم يتم العثور على بطاقات مطابقة للفلاتر المحددة.
									</p>
									<div className='mt-6'>
										<Link
											href='/dashboard/marketing/gift-cards/new'
											className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700'
										>
											<Plus className='ml-1 -mr-1 h-4 w-4' />
											إصدار بطاقة جديدة
										</Link>
									</div>
								</div>
							) : (
								<div className='overflow-x-auto rounded-md border border-gray-200'>
									<table className='min-w-full divide-y divide-gray-200'>
										<thead className='bg-gray-50'>
											<tr>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													كود البطاقة
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													القيمة
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													الحالة
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													المستلم
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													تاريخ الإصدار
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													تاريخ الانتهاء
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													<span className='sr-only'>إجراءات</span>
												</th>
											</tr>
										</thead>
										<tbody className='bg-white divide-y divide-gray-200'>
											{filteredCards.map((card) => (
												<tr key={card.id} className='hover:bg-gray-50'>
													<td className='px-6 py-4 whitespace-nowrap'>
														<span className='bg-gray-100 text-gray-800 px-2.5 py-1 rounded-md font-mono text-sm'>
															{card.code}
														</span>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='text-sm font-medium text-gray-900'>
															{formatAmount(card.amount, card.type)}
														</div>
														{card.type === 'fixed' && card.status === 'active' && (
															<div className='text-xs text-gray-500'>
																الرصيد: {card.balance} ريال
															</div>
														)}
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														{getStatusBadge(card.status)}
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														{card.issuedTo ? (
															<div>
																<div className='text-sm font-medium text-gray-900'>
																	{card.issuedTo.name}
																</div>
																<div className='text-xs text-gray-500'>
																	{card.issuedTo.phone}
																</div>
															</div>
														) : (
															<span className='text-sm text-gray-500'>-</span>
														)}
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
														{formatDate(card.createdAt)}
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
														{formatDate(card.expireAt)}
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-left text-sm font-medium'>
														<div className='flex items-center justify-end space-x-2 space-x-reverse'>
															<button
																onClick={() => showCardDetails(card)}
																className='text-gray-400 hover:text-gray-500'
																title='عرض التفاصيل'
															>
																<Eye className='h-5 w-5' />
															</button>

															{card.status === 'active' && (
																<Link
																	href={`/dashboard/marketing/gift-cards/edit/${card.id}`}
																	className='text-gray-400 hover:text-gray-500'
																	title='تعديل'
																>
																	<Edit className='h-5 w-5' />
																</Link>
															)}

															{card.status === 'active' && (
																<button
																	className='text-gray-400 hover:text-red-500'
																	title='إلغاء'
																>
																	<XCircle className='h-5 w-5' />
																</button>
															)}

															<div className='relative' data-headlessui-state=''>
																<button
																	className='text-gray-400 hover:text-gray-500'
																	title='المزيد من الخيارات'
																>
																	<MoreHorizontal className='h-5 w-5' />
																</button>
															</div>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							)}
						</div>
					)}

					{activeTab === 'templates' && (
						<div className='space-y-6'>
							<div className='flex justify-between items-center'>
								<h3 className='text-lg font-medium text-gray-900'>قوالب بطاقات الهدايا</h3>
								<Link
									href='/dashboard/marketing/gift-cards/templates/new'
									className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700'
								>
									<Plus className='ml-1 h-4 w-4' />
									إضافة قالب جديد
								</Link>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{templates.map((template) => (
									<div
										key={template.id}
										className='bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow'
									>
										<div className='h-36 bg-gray-100 flex items-center justify-center border-b border-gray-200'>
											<div className='w-64 h-24 bg-white rounded-md shadow-sm flex items-center justify-center p-4'>
												<Gift className='h-6 w-6 text-green-500 ml-2' />
												<span className='text-base font-medium text-gray-900'>
													{template.name}
												</span>
											</div>
										</div>

										<div className='p-4'>
											<div className='flex justify-between items-start mb-2'>
												<h4 className='text-base font-medium text-gray-900'>{template.name}</h4>
												{template.isActive ? (
													<span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>
														نشط
													</span>
												) : (
													<span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>
														غير نشط
													</span>
												)}
											</div>

											<p className='text-sm text-gray-500 mb-3'>{template.description}</p>

											<div className='flex justify-between items-center text-sm'>
												<span className='text-gray-700'>القيمة الافتراضية:</span>
												<span className='font-medium'>
													{template.type === 'percentage'
														? `${template.defaultAmount}%`
														: `${template.defaultAmount} ريال`}
												</span>
											</div>
										</div>

										<div className='bg-gray-50 border-t border-gray-200 p-4 flex justify-between items-center'>
											<Link
												href={`/dashboard/marketing/gift-cards/templates/${template.id}`}
												className='text-sm text-green-600 hover:text-green-800 font-medium'
											>
												عرض التفاصيل
											</Link>

											<div className='flex space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/marketing/gift-cards/templates/edit/${template.id}`}
													className='p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded'
													title='تعديل'
												>
													<Edit className='h-4 w-4' />
												</Link>

												<Link
													href={`/dashboard/marketing/gift-cards/new?template=${template.id}`}
													className='p-1.5 text-green-500 hover:text-green-700 hover:bg-gray-100 rounded'
													title='إصدار بطاقة'
												>
													<Gift className='h-4 w-4' />
												</Link>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* نافذة تفاصيل البطاقة */}
			{showDetailsModal && selectedCard && (
				<div className='fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
						<div className='p-6 border-b border-gray-200 flex items-center justify-between'>
							<h2 className='text-xl font-bold text-gray-900 flex items-center'>
								<Gift className='ml-2 h-6 w-6 text-green-600' />
								تفاصيل بطاقة الهدية
							</h2>
							<button
								onClick={() => setShowDetailsModal(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-6 w-6' />
							</button>
						</div>

						<div className='p-6'>
							<div className='mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center'>
								<div className='bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-3 text-center w-full max-w-xs'>
									<div className='mb-2'>
										<Gift className='h-8 w-8 mx-auto text-green-600 mb-1' />
										<h3 className='text-xl font-bold'>
											{selectedCard.type === 'percentage' ? 'بطاقة خصم' : 'بطاقة هدية'}
										</h3>
									</div>
									<div className='mb-3'>
										<div className='font-mono text-lg font-bold text-gray-800 border-b border-gray-100 pb-2 mb-2'>
											{selectedCard.code}
										</div>
										<div className='text-2xl font-bold text-green-600'>
											{formatAmount(selectedCard.amount, selectedCard.type)}
										</div>
									</div>
									<div className='text-sm text-gray-500'>
										صالحة حتى: {formatDate(selectedCard.expireAt)}
									</div>
								</div>
								<div className='text-center flex items-center'>
									<span className='ml-2'>{getStatusBadge(selectedCard.status)}</span>
									{selectedCard.type === 'fixed' && selectedCard.status === 'active' && (
										<span className='text-sm text-gray-700'>
											الرصيد المتبقي:{' '}
											<span className='font-medium'>{selectedCard.balance} ريال</span>
										</span>
									)}
								</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
								<div>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>معلومات البطاقة</h4>
									<div className='bg-gray-50 rounded-lg p-4 space-y-3'>
										<div>
											<p className='text-xs text-gray-500'>نوع البطاقة</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{selectedCard.type === 'percentage'
													? 'بطاقة خصم بنسبة مئوية'
													: 'بطاقة هدية بقيمة ثابتة'}
											</p>
										</div>

										<div>
											<p className='text-xs text-gray-500'>تاريخ الإصدار</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{formatDate(selectedCard.createdAt)}
											</p>
										</div>

										<div>
											<p className='text-xs text-gray-500'>تاريخ انتهاء الصلاحية</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{formatDate(selectedCard.expireAt)}
											</p>
										</div>

										{selectedCard.notes && (
											<div>
												<p className='text-xs text-gray-500'>ملاحظات</p>
												<p className='text-sm text-gray-900 mt-1'>{selectedCard.notes}</p>
											</div>
										)}
									</div>
								</div>

								<div>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>معلومات المستلم</h4>
									<div className='bg-gray-50 rounded-lg p-4'>
										{selectedCard.issuedTo ? (
											<div className='space-y-3'>
												<div>
													<p className='text-xs text-gray-500'>الاسم</p>
													<p className='text-sm font-medium text-gray-900 mt-1'>
														{selectedCard.issuedTo.name}
													</p>
												</div>

												<div>
													<p className='text-xs text-gray-500'>البريد الإلكتروني</p>
													<p className='text-sm font-medium text-gray-900 mt-1'>
														{selectedCard.issuedTo.email}
													</p>
												</div>

												<div>
													<p className='text-xs text-gray-500'>رقم الهاتف</p>
													<p className='text-sm font-medium text-gray-900 mt-1'>
														{selectedCard.issuedTo.phone}
													</p>
												</div>

												<div className='pt-2 flex items-center'>
													<User className='h-4 w-4 text-green-500 ml-1' />
													<Link
														href={`/dashboard/customers/${selectedCard.issuedTo.id}`}
														className='text-sm text-green-600 hover:text-green-800'
													>
														عرض صفحة العميل
													</Link>
												</div>
											</div>
										) : (
											<div className='h-32 flex items-center justify-center text-sm text-gray-500'>
												لم يتم تخصيص البطاقة لعميل محدد
											</div>
										)}
									</div>
								</div>
							</div>

							{selectedCard.status === 'redeemed' && (
								<div className='mb-6'>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>معلومات الاستخدام</h4>
									<div className='bg-gray-50 rounded-lg p-4 space-y-3'>
										<div>
											<p className='text-xs text-gray-500'>تاريخ الاستخدام</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{formatDate(selectedCard.redeemedAt || '')}
											</p>
										</div>

										<div>
											<p className='text-xs text-gray-500'>المستخدم</p>
											<p className='text-sm font-medium text-gray-900 mt-1'>
												{selectedCard.redeemedBy}
											</p>
										</div>
									</div>
								</div>
							)}

							<div className='flex justify-between'>
								<div>
									{selectedCard.status === 'active' && (
										<Link
											href={`/dashboard/marketing/gift-cards/edit/${selectedCard.id}`}
											className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700'
										>
											<Edit className='ml-1 h-4 w-4' />
											تعديل البطاقة
										</Link>
									)}
								</div>

								<div className='flex space-x-3 space-x-reverse'>
									<button
										onClick={() => {}}
										className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
									>
										<Download className='ml-1 h-4 w-4' />
										تصدير بصيغة PDF
									</button>

									{selectedCard.status === 'active' && (
										<button
											onClick={() => {}}
											className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
										>
											<Clipboard className='ml-1 h-4 w-4' />
											نسخ الكود
										</button>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
