'use client';

import {
	ArrowLeft,
	Award,
	BarChart2,
	Calendar,
	Check,
	ChevronDown,
	ChevronRight,
	Clock,
	Edit,
	Eye,
	Filter,
	Gift,
	Plus,
	Search,
	Settings,
	Star,
	Trash2,
	User,
	Users,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LoyaltyMember {
	id: string;
	customer: {
		id: string;
		name: string;
		email: string;
		phone: string;
		joinDate: string;
	};
	tier: 'bronze' | 'silver' | 'gold' | 'platinum';
	points: {
		current: number;
		lifetime: number;
		lastEarned: string | null;
		lastRedeemed: string | null;
	};
	status: 'active' | 'inactive';
	totalSpent: number;
	lastPurchase: string | null;
	rewards: {
		available: number;
		redeemed: number;
	};
}

interface LoyaltyTier {
	id: string;
	name: string;
	arabicName: string;
	threshold: number;
	benefits: string[];
	pointsMultiplier: number;
	color: string;
	icon: string;
	customBenefits?: string[];
}

interface LoyaltyStats {
	totalMembers: number;
	activeMembers: number;
	totalPoints: number;
	redeemedPoints: number;
	membersByTier: {
		bronze: number;
		silver: number;
		gold: number;
		platinum: number;
	};
	pointsEarnedThisMonth: number;
	pointsRedeemedThisMonth: number;
}

interface LoyaltyReward {
	id: string;
	name: string;
	description: string;
	pointsCost: number;
	isActive: boolean;
	category: string;
	redemptionCount: number;
	availableFrom: string | null;
	availableTo: string | null;
}

export default function LoyaltyPage() {
	const [loading, setLoading] = useState(true);
	const [members, setMembers] = useState<LoyaltyMember[]>([]);
	const [filteredMembers, setFilteredMembers] = useState<LoyaltyMember[]>([]);
	const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
	const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
	const [stats, setStats] = useState<LoyaltyStats | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [tierFilter, setTierFilter] = useState('all');
	const [statusFilter, setStatusFilter] = useState('all');
	const [sortBy, setSortBy] = useState('points');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [activeTab, setActiveTab] = useState<'members' | 'tiers' | 'rewards'>('members');
	const [selectedMember, setSelectedMember] = useState<LoyaltyMember | null>(null);
	const [showMemberDetails, setShowMemberDetails] = useState(false);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchLoyaltyData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية لشرائح الولاء
			const mockTiers: LoyaltyTier[] = [
				{
					id: 'tier-1',
					name: 'Bronze',
					arabicName: 'برونزي',
					threshold: 0,
					benefits: ['نقطة واحدة لكل 10 ريال', 'تحديثات وعروض حصرية', 'تذكير بالمناسبات الخاصة'],
					pointsMultiplier: 1,
					color: '#CD7F32',
					icon: 'award',
				},
				{
					id: 'tier-2',
					name: 'Silver',
					arabicName: 'فضي',
					threshold: 500,
					benefits: [
						'1.5 نقطة لكل 10 ريال',
						'خصم 5% على الاصلاحات',
						'تمديد فترة الارجاع لـ 30 يوم',
						'خدمة عملاء مميزة',
					],
					pointsMultiplier: 1.5,
					color: '#C0C0C0',
					icon: 'award',
				},
				{
					id: 'tier-3',
					name: 'Gold',
					arabicName: 'ذهبي',
					threshold: 1500,
					benefits: ['2 نقطة لكل 10 ريال', 'خصم 10% على الاصلاحات', 'خدمة توصيل مجانية', 'قياسات مجانية'],
					pointsMultiplier: 2,
					color: '#FFD700',
					icon: 'award',
				},
				{
					id: 'tier-4',
					name: 'Platinum',
					arabicName: 'بلاتيني',
					threshold: 5000,
					benefits: [
						'3 نقاط لكل 10 ريال',
						'خصم 20% على الاصلاحات',
						'خدمة توصيل مجانية وسريعة',

						'قياسات مجانية',
						'مساعد شخصي للتسوق',
						'وصول مبكر للمجموعات الجديدة',
					],
					pointsMultiplier: 3,
					color: '#E5E4E2',
					icon: 'award',
				},
			];

			// بيانات تجريبية للأعضاء
			const mockMembers: LoyaltyMember[] = [
				{
					id: 'mem-001',
					customer: {
						id: 'cust-001',
						name: 'محمد أحمد',
						email: 'mohamed@example.com',
						phone: '0501234567',
						joinDate: '2022-10-15',
					},
					tier: 'gold',
					points: {
						current: 3200,
						lifetime: 4800,
						lastEarned: '2023-09-20',
						lastRedeemed: '2023-08-15',
					},
					status: 'active',
					totalSpent: 18500,
					lastPurchase: '2023-09-20',
					rewards: {
						available: 2,
						redeemed: 5,
					},
				},
				{
					id: 'mem-002',
					customer: {
						id: 'cust-002',
						name: 'أحمد علي',
						email: 'ahmed@example.com',
						phone: '0507654321',
						joinDate: '2023-01-20',
					},
					tier: 'silver',
					points: {
						current: 750,
						lifetime: 1200,
						lastEarned: '2023-09-18',
						lastRedeemed: '2023-07-30',
					},
					status: 'active',
					totalSpent: 6200,
					lastPurchase: '2023-09-18',
					rewards: {
						available: 1,
						redeemed: 2,
					},
				},
				{
					id: 'mem-003',
					customer: {
						id: 'cust-003',
						name: 'سارة محمد',
						email: 'sara@example.com',
						phone: '0551234567',
						joinDate: '2022-08-10',
					},
					tier: 'platinum',
					points: {
						current: 9500,
						lifetime: 12800,
						lastEarned: '2023-09-22',
						lastRedeemed: '2023-09-05',
					},
					status: 'active',
					totalSpent: 42000,
					lastPurchase: '2023-09-22',
					rewards: {
						available: 4,
						redeemed: 8,
					},
				},
				{
					id: 'mem-004',
					customer: {
						id: 'cust-004',
						name: 'فيصل العتيبي',
						email: 'faisal@example.com',
						phone: '0561234567',
						joinDate: '2023-03-05',
					},
					tier: 'bronze',
					points: {
						current: 280,
						lifetime: 320,
						lastEarned: '2023-09-10',
						lastRedeemed: null,
					},
					status: 'active',
					totalSpent: 3200,
					lastPurchase: '2023-09-10',
					rewards: {
						available: 0,
						redeemed: 0,
					},
				},
				{
					id: 'mem-005',
					customer: {
						id: 'cust-005',
						name: 'نورة السالم',
						email: 'noura@example.com',
						phone: '0531234567',
						joinDate: '2022-12-01',
					},
					tier: 'silver',
					points: {
						current: 930,
						lifetime: 1450,
						lastEarned: '2023-09-15',
						lastRedeemed: '2023-06-20',
					},
					status: 'inactive',
					totalSpent: 7800,
					lastPurchase: '2023-06-10',
					rewards: {
						available: 1,
						redeemed: 3,
					},
				},
				{
					id: 'mem-006',
					customer: {
						id: 'cust-006',
						name: 'عبدالله عمر',
						email: 'abdullah@example.com',
						phone: '0541234567',
						joinDate: '2022-11-12',
					},
					tier: 'gold',
					points: {
						current: 2800,
						lifetime: 3900,
						lastEarned: '2023-09-08',
						lastRedeemed: '2023-08-25',
					},
					status: 'active',
					totalSpent: 16500,
					lastPurchase: '2023-09-08',
					rewards: {
						available: 2,
						redeemed: 4,
					},
				},
				{
					id: 'mem-007',
					customer: {
						id: 'cust-007',
						name: 'ليلى حسن',
						email: 'layla@example.com',
						phone: '0521234567',
						joinDate: '2023-02-18',
					},
					tier: 'bronze',
					points: {
						current: 150,
						lifetime: 150,
						lastEarned: '2023-08-30',
						lastRedeemed: null,
					},
					status: 'active',
					totalSpent: 1500,
					lastPurchase: '2023-08-30',
					rewards: {
						available: 0,
						redeemed: 0,
					},
				},
			];

			// بيانات تجريبية للمكافآت
			const mockRewards: LoyaltyReward[] = [
				{
					id: 'rew-001',
					name: 'خصم 50 ريال',
					description: 'خصم بقيمة 50 ريال على أي طلب',
					pointsCost: 500,
					isActive: true,
					category: 'خصومات',
					redemptionCount: 85,
					availableFrom: null,
					availableTo: null,
				},
				{
					id: 'rew-002',
					name: 'خصم 10%',
					description: 'خصم 10% على إجمالي الطلب',
					pointsCost: 800,
					isActive: true,
					category: 'خصومات',
					redemptionCount: 62,
					availableFrom: null,
					availableTo: null,
				},
				{
					id: 'rew-003',
					name: 'توصيل مجاني',
					description: 'خدمة توصيل مجانية لطلبك القادم',
					pointsCost: 300,
					isActive: true,
					category: 'شحن',
					redemptionCount: 120,
					availableFrom: null,
					availableTo: null,
				},
				{
					id: 'rew-004',
					name: 'إصلاح مجاني',
					description: 'إصلاح مجاني لأي ثوب',
					pointsCost: 600,
					isActive: true,
					category: 'خدمات',
					redemptionCount: 45,
					availableFrom: null,
					availableTo: null,
				},
				{
					id: 'rew-005',
					name: 'قميص مجاني',
					description: 'احصل على قميص مجاني مع أي طلب ثوب',
					pointsCost: 1200,
					isActive: true,
					category: 'هدايا',
					redemptionCount: 28,
					availableFrom: null,
					availableTo: null,
				},
				{
					id: 'rew-006',
					name: 'عرض العيد',
					description: 'خصم 20% على جميع الثياب بمناسبة العيد',
					pointsCost: 1000,
					isActive: false,
					category: 'عروض موسمية',
					redemptionCount: 75,
					availableFrom: '2023-06-01',
					availableTo: '2023-06-30',
				},
			];

			// بيانات تجريبية للإحصائيات
			const mockStats: LoyaltyStats = {
				totalMembers: 356,
				activeMembers: 320,
				totalPoints: 285600,
				redeemedPoints: 98500,
				membersByTier: {
					bronze: 165,
					silver: 120,
					gold: 48,
					platinum: 23,
				},
				pointsEarnedThisMonth: 32450,
				pointsRedeemedThisMonth: 12800,
			};

			setMembers(mockMembers);
			setFilteredMembers(mockMembers);
			setTiers(mockTiers);
			setRewards(mockRewards);
			setStats(mockStats);
			setLoading(false);
		};

		fetchLoyaltyData();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let filtered = [...members];

		// تطبيق فلتر البحث
		if (searchTerm) {
			filtered = filtered.filter(
				(member) =>
					member.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					member.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
					member.customer.phone.includes(searchTerm)
			);
		}

		// تطبيق فلتر الشريحة
		if (tierFilter !== 'all') {
			filtered = filtered.filter((member) => member.tier === tierFilter);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			filtered = filtered.filter((member) => member.status === statusFilter);
		}

		// تطبيق الترتيب
		filtered.sort((a, b) => {
			let comparison = 0;

			if (sortBy === 'points') {
				comparison = a.points.current - b.points.current;
			} else if (sortBy === 'spent') {
				comparison = a.totalSpent - b.totalSpent;
			} else if (sortBy === 'lastPurchase') {
				const dateA = a.lastPurchase ? new Date(a.lastPurchase).getTime() : 0;
				const dateB = b.lastPurchase ? new Date(b.lastPurchase).getTime() : 0;
				comparison = dateA - dateB;
			} else if (sortBy === 'joinDate') {
				comparison = new Date(a.customer.joinDate).getTime() - new Date(b.customer.joinDate).getTime();
			} else if (sortBy === 'name') {
				comparison = a.customer.name.localeCompare(b.customer.name);
			}

			return sortOrder === 'asc' ? comparison : -comparison;
		});

		setFilteredMembers(filtered);
	}, [members, searchTerm, tierFilter, statusFilter, sortBy, sortOrder]);

	// الحصول على شارة الشريحة
	const getTierBadge = (tier: string) => {
		switch (tier) {
			case 'bronze':
				return <span className='px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800'>برونزي</span>;
			case 'silver':
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>فضي</span>;
			case 'gold':
				return <span className='px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800'>ذهبي</span>;
			case 'platinum':
				return <span className='px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800'>بلاتيني</span>;
			default:
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>{tier}</span>;
		}
	};

	// الحصول على لون الشريحة
	const getTierColor = (tier: string) => {
		switch (tier) {
			case 'bronze':
				return 'text-amber-600';
			case 'silver':
				return 'text-gray-500';
			case 'gold':
				return 'text-yellow-600';
			case 'platinum':
				return 'text-blue-600';
			default:
				return 'text-gray-600';
		}
	};

	// الحصول على شارة الحالة
	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'active':
				return <span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>نشط</span>;
			case 'inactive':
				return <span className='px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'>غير نشط</span>;
			default:
				return <span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>{status}</span>;
		}
	};

	// تنسيق التاريخ
	const formatDate = (dateStr: string | null) => {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('ar-SA');
	};

	// عرض تفاصيل العضو
	const viewMemberDetails = (member: LoyaltyMember) => {
		setSelectedMember(member);
		setShowMemberDetails(true);
	};

	// حالة التحميل
	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500'></div>
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
							<Award className='inline-block ml-2 h-6 w-6 text-amber-600' />
							برنامج الولاء
						</h1>
					</div>
					<p className='mt-1 text-sm text-gray-600'>إدارة أعضاء وشرائح برنامج الولاء والمكافآت</p>
				</div>

				<div className='flex gap-2'>
					<Link
						href='/dashboard/marketing/loyalty/members/new'
						className='px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-amber-700'
					>
						<Plus className='ml-1 h-4 w-4' />
						إضافة عضو
					</Link>

					<Link
						href='/dashboard/reports/marketing/loyalty'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						التقارير
					</Link>

					<Link
						href='/dashboard/marketing/loyalty/settings'
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
								<p className='text-xs text-gray-500'>إجمالي الأعضاء</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>{stats.totalMembers}</h3>
								<div className='flex items-center text-xs text-gray-500 mt-1'>
									<span className='flex items-center'>
										<span className='h-2 w-2 rounded-full bg-green-500 ml-1'></span>
										نشط: {stats.activeMembers}
									</span>
									<span className='mx-2'>•</span>
									<span className='flex items-center'>
										<span className='h-2 w-2 rounded-full bg-red-500 ml-1'></span>
										غير نشط: {stats.totalMembers - stats.activeMembers}
									</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-amber-100'>
								<Users className='h-6 w-6 text-amber-600' />
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>النقاط النشطة</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>
									{(stats.totalPoints - stats.redeemedPoints).toLocaleString()}
								</h3>
								<div className='mt-1 flex items-center'>
									<span className='text-xs text-amber-600 font-medium'>
										{stats.pointsEarnedThisMonth.toLocaleString()}
									</span>
									<span className='mx-1 text-xs text-gray-500'>نقطة مكتسبة هذا الشهر</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-amber-100'>
								<Star className='h-6 w-6 text-amber-600' />
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>توزيع الشرائح</p>
								<div className='flex items-center gap-2 mt-2'>
									<div className='flex-1 space-y-1'>
										<div className='flex justify-between text-xs'>
											<span className='text-amber-600'>برونزي</span>
											<span>{stats.membersByTier.bronze}</span>
										</div>
										<div className='w-full bg-gray-200 rounded-full h-1.5'>
											<div
												className='h-1.5 rounded-full bg-amber-500'
												style={{
													width: `${
														(stats.membersByTier.bronze / stats.totalMembers) * 100
													}%`,
												}}
											></div>
										</div>
									</div>
									<div className='flex-1 space-y-1'>
										<div className='flex justify-between text-xs'>
											<span className='text-gray-600'>فضي</span>
											<span>{stats.membersByTier.silver}</span>
										</div>
										<div className='w-full bg-gray-200 rounded-full h-1.5'>
											<div
												className='h-1.5 rounded-full bg-gray-400'
												style={{
													width: `${
														(stats.membersByTier.silver / stats.totalMembers) * 100
													}%`,
												}}
											></div>
										</div>
									</div>
								</div>
								<div className='flex items-center gap-2 mt-2'>
									<div className='flex-1 space-y-1'>
										<div className='flex justify-between text-xs'>
											<span className='text-yellow-600'>ذهبي</span>
											<span>{stats.membersByTier.gold}</span>
										</div>
										<div className='w-full bg-gray-200 rounded-full h-1.5'>
											<div
												className='h-1.5 rounded-full bg-yellow-500'
												style={{
													width: `${(stats.membersByTier.gold / stats.totalMembers) * 100}%`,
												}}
											></div>
										</div>
									</div>
									<div className='flex-1 space-y-1'>
										<div className='flex justify-between text-xs'>
											<span className='text-blue-600'>بلاتيني</span>
											<span>{stats.membersByTier.platinum}</span>
										</div>
										<div className='w-full bg-gray-200 rounded-full h-1.5'>
											<div
												className='h-1.5 rounded-full bg-blue-500'
												style={{
													width: `${
														(stats.membersByTier.platinum / stats.totalMembers) * 100
													}%`,
												}}
											></div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className='bg-white p-5 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between items-start'>
							<div>
								<p className='text-xs text-gray-500'>النقاط المستبدلة</p>
								<h3 className='text-2xl font-bold text-gray-900 mt-1'>
									{stats.redeemedPoints.toLocaleString()}
								</h3>
								<div className='mt-1 flex items-center'>
									<span className='text-xs text-amber-600 font-medium'>
										{stats.pointsRedeemedThisMonth.toLocaleString()}
									</span>
									<span className='mx-1 text-xs text-gray-500'>نقطة مستبدلة هذا الشهر</span>
								</div>
							</div>
							<div className='p-2 rounded-full bg-amber-100'>
								<Gift className='h-6 w-6 text-amber-600' />
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
							onClick={() => setActiveTab('members')}
							className={`py-4 px-6 font-medium text-sm border-b-2 ${
								activeTab === 'members'
									? 'border-amber-500 text-amber-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Users className='h-4 w-4 inline-block ml-1' />
							الأعضاء
						</button>
						<button
							onClick={() => setActiveTab('tiers')}
							className={`py-4 px-6 font-medium text-sm border-b-2 ${
								activeTab === 'tiers'
									? 'border-amber-500 text-amber-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Award className='h-4 w-4 inline-block ml-1' />
							شرائح الولاء
						</button>
						<button
							onClick={() => setActiveTab('rewards')}
							className={`py-4 px-6 font-medium text-sm border-b-2 ${
								activeTab === 'rewards'
									? 'border-amber-500 text-amber-600'
									: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Gift className='h-4 w-4 inline-block ml-1' />
							المكافآت
						</button>
					</nav>
				</div>

				<div className='p-6'>
					{activeTab === 'members' && (
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
										placeholder='ابحث باسم العميل، البريد الإلكتروني، أو رقم الهاتف...'
										className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
									/>
								</div>

								{/* فلتر الشريحة */}
								<div className='sm:w-40'>
									<div className='relative'>
										<select
											value={tierFilter}
											onChange={(e) => setTierFilter(e.target.value)}
											className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm pr-8'
										>
											<option value='all'>كل الشرائح</option>
											<option value='bronze'>برونزي</option>
											<option value='silver'>فضي</option>
											<option value='gold'>ذهبي</option>
											<option value='platinum'>بلاتيني</option>
										</select>
										<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
											<ChevronDown className='h-4 w-4 text-gray-400' />
										</div>
									</div>
								</div>

								{/* فلتر الحالة */}
								<div className='sm:w-36'>
									<div className='relative'>
										<select
											value={statusFilter}
											onChange={(e) => setStatusFilter(e.target.value)}
											className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm pr-8'
										>
											<option value='all'>كل الحالات</option>
											<option value='active'>نشط</option>
											<option value='inactive'>غير نشط</option>
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
											className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm pr-8'
										>
											<option value='points'>الترتيب حسب النقاط</option>
											<option value='spent'>الترتيب حسب الإنفاق</option>
											<option value='lastPurchase'>الترتيب حسب آخر عملية شراء</option>
											<option value='joinDate'>الترتيب حسب تاريخ الانضمام</option>
											<option value='name'>الترتيب حسب الاسم</option>
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
							</div>

							{/* قائمة الأعضاء */}
							{filteredMembers.length === 0 ? (
								<div className='bg-gray-50 p-8 rounded-lg text-center'>
									<Users className='mx-auto h-12 w-12 text-gray-300' />
									<h3 className='mt-2 text-lg font-medium text-gray-900'>لا يوجد أعضاء</h3>
									<p className='mt-1 text-gray-500'>
										لم يتم العثور على أعضاء مطابقين للفلاتر المحددة.
									</p>
									<div className='mt-6'>
										<Link
											href='/dashboard/marketing/loyalty/members/new'
											className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700'
										>
											<Plus className='ml-1 -mr-1 h-4 w-4' />
											إضافة عضو جديد
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
													العميل
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													الشريحة
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													النقاط
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													الإنفاق
												</th>
												<th
													scope='col'
													className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
												>
													آخر عملية شراء
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
													<span className='sr-only'>إجراءات</span>
												</th>
											</tr>
										</thead>
										<tbody className='bg-white divide-y divide-gray-200'>
											{filteredMembers.map((member) => (
												<tr key={member.id} className='hover:bg-gray-50'>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='flex items-center'>
															<div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
																<User className='h-5 w-5 text-gray-500' />
															</div>
															<div className='mr-4'>
																<div className='text-sm font-medium text-gray-900'>
																	{member.customer.name}
																</div>
																<div className='text-xs text-gray-500'>
																	{member.customer.phone}
																</div>
															</div>
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='flex items-center'>
															<Award
																className={`h-5 w-5 ml-1.5 ${getTierColor(
																	member.tier
																)}`}
															/>
															{getTierBadge(member.tier)}
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='text-sm font-medium text-gray-900'>
															{member.points.current.toLocaleString()}
														</div>
														<div className='text-xs text-gray-500'>
															إجمالي: {member.points.lifetime.toLocaleString()}
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='text-sm font-medium text-gray-900'>
															{member.totalSpent.toLocaleString()} ريال
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
														{formatDate(member.lastPurchase)}
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														{getStatusBadge(member.status)}
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-left text-sm font-medium'>
														<div className='flex items-center justify-end space-x-2 space-x-reverse'>
															<button
																onClick={() => viewMemberDetails(member)}
																className='text-gray-400 hover:text-gray-500'
																title='عرض التفاصيل'
															>
																<Eye className='h-5 w-5' />
															</button>

															<Link
																href={`/dashboard/marketing/loyalty/members/edit/${member.id}`}
																className='text-gray-400 hover:text-gray-500'
																title='تعديل'
															>
																<Edit className='h-5 w-5' />
															</Link>

															<Link
																href={`/dashboard/marketing/loyalty/members/${member.id}/points/add`}
																className='text-gray-400 hover:text-amber-500'
																title='إضافة نقاط'
															>
																<Plus className='h-5 w-5' />
															</Link>
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

					{activeTab === 'tiers' && (
						<div className='space-y-6'>
							<div className='flex justify-between items-center'>
								<h3 className='text-lg font-medium text-gray-900'>شرائح برنامج الولاء</h3>
								<Link
									href='/dashboard/marketing/loyalty/tiers/edit'
									className='px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-amber-700'
								>
									<Edit className='ml-1 h-4 w-4' />
									تعديل الشرائح
								</Link>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
								{tiers.map((tier) => (
									<div
										key={tier.id}
										className='bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow'
									>
										<div
											className='h-16 flex items-center justify-center'
											style={{ backgroundColor: tier.color + '20' }}
										>
											<div className='flex items-center'>
												<Award className='h-6 w-6 ml-1.5' style={{ color: tier.color }} />
												<span
													className='text-lg font-bold text-gray-900'
													style={{ color: tier.color }}
												>
													{tier.arabicName}
												</span>
											</div>
										</div>

										<div className='p-4'>
											<div className='flex justify-between items-center mb-3'>
												<div className='text-sm font-medium text-gray-700'>
													الحد الأدنى للنقاط
												</div>
												<span className='font-medium'>{tier.threshold.toLocaleString()}</span>
											</div>

											<div className='flex justify-between items-center mb-3'>
												<div className='text-sm font-medium text-gray-700'>مضاعف النقاط</div>
												<span className='font-medium'>{tier.pointsMultiplier}x</span>
											</div>

											<div className='mb-3'>
												<div className='text-sm font-medium text-gray-700 mb-1'>المزايا</div>
												<ul className='text-sm text-gray-600 space-y-1 mr-5 list-disc'>
													{tier.benefits.map((benefit, index) => (
														<li key={index}>{benefit}</li>
													))}
												</ul>
											</div>

											{stats && (
												<div className='flex justify-between items-center pt-2 mt-3 border-t border-gray-200 text-sm text-gray-500'>
													<span>عدد الأعضاء:</span>
													<span className='font-medium'>
														{
															stats.membersByTier[
																tier.name.toLowerCase() as keyof typeof stats.membersByTier
															]
														}
													</span>
												</div>
											)}
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{activeTab === 'rewards' && (
						<div className='space-y-6'>
							<div className='flex justify-between items-center'>
								<h3 className='text-lg font-medium text-gray-900'>مكافآت برنامج الولاء</h3>
								<div className='flex gap-2'>
									<Link
										href='/dashboard/marketing/loyalty/rewards/new'
										className='px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-amber-700'
									>
										<Plus className='ml-1 h-4 w-4' />
										إضافة مكافأة
									</Link>
									<button className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'>
										<Filter className='ml-1 h-4 w-4' />
										تصفية
									</button>
								</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
								{rewards.map((reward) => (
									<div
										key={reward.id}
										className={`bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
											!reward.isActive && 'opacity-70'
										}`}
									>
										<div
											className={`h-2 ${reward.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
										></div>

										<div className='p-4'>
											<div className='flex justify-between items-start mb-2'>
												<h4 className='text-base font-medium text-gray-900'>{reward.name}</h4>
												{reward.isActive ? (
													<span className='px-2 py-1 text-xs rounded-full bg-green-100 text-green-800'>
														نشطة
													</span>
												) : (
													<span className='px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'>
														غير نشطة
													</span>
												)}
											</div>

											<p className='text-sm text-gray-600 mb-3 min-h-[40px]'>
												{reward.description}
											</p>

											<div className='flex justify-between items-center mb-3 py-2 px-3 bg-amber-50 rounded-md'>
												<div className='flex items-center'>
													<Star className='h-5 w-5 text-amber-500 ml-1' />
													<span className='text-sm font-medium text-gray-900'>التكلفة:</span>
												</div>
												<span className='text-lg font-bold text-amber-600'>
													{reward.pointsCost.toLocaleString()} نقطة
												</span>
											</div>

											<div className='flex justify-between items-center text-xs text-gray-500 mb-3'>
												<span>الفئة: {reward.category}</span>
												<span>الاستبدالات: {reward.redemptionCount}</span>
											</div>

											{(reward.availableFrom || reward.availableTo) && (
												<div className='text-xs text-gray-500 mb-3 flex items-center'>
													<Calendar className='h-3.5 w-3.5 ml-1 text-gray-400' />
													{reward.availableFrom && reward.availableTo ? (
														<span>
															متاح من {formatDate(reward.availableFrom)} إلى{' '}
															{formatDate(reward.availableTo)}
														</span>
													) : reward.availableFrom ? (
														<span>متاح بدءاً من {formatDate(reward.availableFrom)}</span>
													) : (
														<span>متاح حتى {formatDate(reward.availableTo)}</span>
													)}
												</div>
											)}

											<div className='flex justify-between items-center mt-4 pt-3 border-t border-gray-200'>
												<Link
													href={`/dashboard/marketing/loyalty/rewards/${reward.id}`}
													className='text-sm text-amber-600 hover:text-amber-800 font-medium'
												>
													عرض التفاصيل
												</Link>

												<div className='flex space-x-2 space-x-reverse'>
													<Link
														href={`/dashboard/marketing/loyalty/rewards/edit/${reward.id}`}
														className='p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded'
														title='تعديل'
													>
														<Edit className='h-4 w-4' />
													</Link>

													{reward.isActive ? (
														<button
															className='p-1.5 text-gray-500 hover:text-red-700 hover:bg-gray-100 rounded'
															title='تعطيل'
														>
															<X className='h-4 w-4' />
														</button>
													) : (
														<button
															className='p-1.5 text-gray-500 hover:text-green-700 hover:bg-gray-100 rounded'
															title='تفعيل'
														>
															<Check className='h-4 w-4' />
														</button>
													)}

													<button
														className='p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded'
														title='حذف'
													>
														<Trash2 className='h-4 w-4' />
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
			</div>

			{/* نافذة تفاصيل العضو */}
			{showMemberDetails && selectedMember && (
				<div className='fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto'>
						<div className='p-6 border-b border-gray-200 flex items-center justify-between'>
							<h2 className='text-xl font-bold text-gray-900 flex items-center'>
								<Award className='ml-2 h-6 w-6 text-amber-600' />
								تفاصيل عضو برنامج الولاء
							</h2>
							<button
								onClick={() => setShowMemberDetails(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-6 w-6' />
							</button>
						</div>

						<div className='p-6'>
							<div className='mb-6'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center'>
										<div className='h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center'>
											<User className='h-8 w-8 text-gray-500' />
										</div>
										<div className='mr-4'>
											<h3 className='text-lg font-medium text-gray-900'>
												{selectedMember.customer.name}
											</h3>
											<div className='flex items-center mt-1'>
												<Award
													className={`h-5 w-5 ml-1.5 ${getTierColor(selectedMember.tier)}`}
												/>
												{getTierBadge(selectedMember.tier)}
												<span className='mx-3 text-gray-300'>|</span>
												{getStatusBadge(selectedMember.status)}
											</div>
										</div>
									</div>

									<div className='text-left'>
										<Link
											href={`/dashboard/customers/${selectedMember.customer.id}`}
											className='text-sm text-amber-600 hover:text-amber-800 font-medium flex items-center'
										>
											عرض ملف العميل
											<ChevronRight className='mr-1 h-4 w-4' />
										</Link>
									</div>
								</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-12 gap-6 mb-6'>
								<div className='md:col-span-7'>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>معلومات العضو</h4>
									<div className='bg-gray-50 rounded-lg p-4 space-y-3'>
										<div className='grid grid-cols-2 gap-4'>
											<div>
												<p className='text-xs text-gray-500'>البريد الإلكتروني</p>
												<p className='text-sm text-gray-900 mt-1'>
													{selectedMember.customer.email}
												</p>
											</div>
											<div>
												<p className='text-xs text-gray-500'>رقم الهاتف</p>
												<p className='text-sm text-gray-900 mt-1'>
													{selectedMember.customer.phone}
												</p>
											</div>
										</div>

										<div className='grid grid-cols-2 gap-4'>
											<div>
												<p className='text-xs text-gray-500'>تاريخ الانضمام</p>
												<p className='text-sm text-gray-900 mt-1'>
													{formatDate(selectedMember.customer.joinDate)}
												</p>
											</div>
											<div>
												<p className='text-xs text-gray-500'>آخر عملية شراء</p>
												<p className='text-sm text-gray-900 mt-1'>
													{formatDate(selectedMember.lastPurchase)}
												</p>
											</div>
										</div>

										<div className='grid grid-cols-2 gap-4'>
											<div>
												<p className='text-xs text-gray-500'>إجمالي الإنفاق</p>
												<p className='text-lg font-medium text-green-600 mt-1'>
													{selectedMember.totalSpent.toLocaleString()} ريال
												</p>
											</div>
											<div>
												<p className='text-xs text-gray-500'>المكافآت</p>
												<div className='flex items-center mt-1'>
													<p className='text-sm text-gray-900'>
														متاح:{' '}
														<span className='font-medium'>
															{selectedMember.rewards.available}
														</span>
													</p>
													<span className='mx-2 text-gray-300'>|</span>
													<p className='text-sm text-gray-900'>
														مستخدم:{' '}
														<span className='font-medium'>
															{selectedMember.rewards.redeemed}
														</span>
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className='md:col-span-5'>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>معلومات النقاط</h4>
									<div className='bg-amber-50 rounded-lg p-4'>
										<div className='text-center mb-4'>
											<h3 className='text-3xl font-bold text-amber-600'>
												{selectedMember.points.current.toLocaleString()}
											</h3>
											<p className='text-sm text-gray-600'>رصيد النقاط الحالي</p>
										</div>

										<div className='grid grid-cols-2 gap-3 text-center'>
											<div className='bg-white p-2 rounded-lg border border-gray-200'>
												<p className='text-xs text-gray-500 mb-1'>إجمالي النقاط المكتسبة</p>
												<p className='text-lg font-medium text-gray-900'>
													{selectedMember.points.lifetime.toLocaleString()}
												</p>
											</div>
											<div className='bg-white p-2 rounded-lg border border-gray-200'>
												<p className='text-xs text-gray-500 mb-1'>النقاط المستخدمة</p>
												<p className='text-lg font-medium text-gray-900'>
													{(
														selectedMember.points.lifetime - selectedMember.points.current
													).toLocaleString()}
												</p>
											</div>
										</div>

										<div className='mt-4 text-xs text-gray-600 space-y-1'>
											{selectedMember.points.lastEarned && (
												<div className='flex justify-between'>
													<span>آخر نقاط مكتسبة:</span>
													<span>{formatDate(selectedMember.points.lastEarned)}</span>
												</div>
											)}
											{selectedMember.points.lastRedeemed && (
												<div className='flex justify-between'>
													<span>آخر استبدال للنقاط:</span>
													<span>{formatDate(selectedMember.points.lastRedeemed)}</span>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
								<div>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>معلومات الشريحة</h4>
									<div className='bg-gray-50 rounded-lg p-4'>
										<div className='flex items-center mb-3'>
											<Award className={`h-6 w-6 ml-2 ${getTierColor(selectedMember.tier)}`} />
											<h3 className='text-lg font-medium text-gray-900'>
												شريحة{' '}
												{selectedMember.tier === 'bronze'
													? 'برونزي'
													: selectedMember.tier === 'silver'
													? 'فضي'
													: selectedMember.tier === 'gold'
													? 'ذهبي'
													: 'بلاتيني'}
											</h3>
										</div>

										<p className='text-sm text-gray-600 mb-3'>
											{selectedMember.tier === 'bronze'
												? 'الشريحة الأساسية في برنامج الولاء. احصل على نقاط مقابل كل عملية شراء.'
												: selectedMember.tier === 'silver'
												? 'شريحة متوسطة تمنحك مزايا إضافية وعروض خاصة.'
												: selectedMember.tier === 'gold'
												? 'شريحة متقدمة للعملاء المميزين مع مضاعفة النقاط ومزايا حصرية.'
												: 'أعلى شريحة في برنامج الولاء مع أفضل المزايا والخدمات الشخصية.'}
										</p>

										{selectedMember.tier !== 'platinum' && (
											<div className='mb-3'>
												<p className='text-xs text-gray-500 mb-1'>التقدم للشريحة التالية</p>
												<div className='w-full bg-gray-200 rounded-full h-2.5 mb-1'>
													<div
														className={`h-2.5 rounded-full ${
															selectedMember.tier === 'bronze'
																? 'bg-gray-400'
																: selectedMember.tier === 'silver'
																? 'bg-yellow-500'
																: 'bg-blue-500'
														}`}
														style={{
															width: `${
																selectedMember.tier === 'bronze'
																	? (selectedMember.points.lifetime / 500) * 100 > 100
																		? 100
																		: (selectedMember.points.lifetime / 500) * 100
																	: selectedMember.tier === 'silver'
																	? ((selectedMember.points.lifetime - 500) / 1000) *
																			100 >
																	  100
																		? 100
																		: ((selectedMember.points.lifetime - 500) /
																				1000) *
																		  100
																	: ((selectedMember.points.lifetime - 1500) / 3500) *
																			100 >
																	  100
																	? 100
																	: ((selectedMember.points.lifetime - 1500) / 3500) *
																	  100
															}%`,
														}}
													></div>
												</div>
												<div className='flex justify-between text-xs text-gray-500'>
													<span>
														{selectedMember.tier === 'bronze'
															? `${selectedMember.points.lifetime} / 500`
															: selectedMember.tier === 'silver'
															? `${selectedMember.points.lifetime} / 1500`
															: `${selectedMember.points.lifetime} / 5000`}
													</span>
													<span>
														{selectedMember.tier === 'bronze'
															? 'الشريحة التالية: فضي'
															: selectedMember.tier === 'silver'
															? 'الشريحة التالية: ذهبي'
															: 'الشريحة التالية: بلاتيني'}
													</span>
												</div>
											</div>
										)}

										<div className='mt-4 pt-3 border-t border-gray-200 flex justify-between items-center'>
											<span className='text-sm text-gray-600'>مضاعف النقاط:</span>
											<span className='text-lg font-medium text-amber-600'>
												{selectedMember.tier === 'bronze'
													? '1x'
													: selectedMember.tier === 'silver'
													? '1.5x'
													: selectedMember.tier === 'gold'
													? '2x'
													: '3x'}
											</span>
										</div>
									</div>
								</div>

								<div>
									<h4 className='text-sm font-medium text-gray-500 mb-2'>الإجراءات السريعة</h4>
									<div className='bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-3'>
										<Link
											href={`/dashboard/marketing/loyalty/members/${selectedMember.id}/points/add`}
											className='p-3 bg-amber-100 text-amber-800 rounded-lg flex flex-col items-center justify-center hover:bg-amber-200 transition-colors'
										>
											<Plus className='h-6 w-6 mb-1' />
											<span className='text-sm font-medium'>إضافة نقاط</span>
										</Link>

										<Link
											href={`/dashboard/marketing/loyalty/members/${selectedMember.id}/points/redeem`}
											className='p-3 bg-amber-100 text-amber-800 rounded-lg flex flex-col items-center justify-center hover:bg-amber-200 transition-colors'
										>
											<Gift className='h-6 w-6 mb-1' />
											<span className='text-sm font-medium'>استبدال نقاط</span>
										</Link>

										<Link
											href={`/dashboard/marketing/loyalty/members/edit/${selectedMember.id}`}
											className='p-3 bg-gray-100 text-gray-800 rounded-lg flex flex-col items-center justify-center hover:bg-gray-200 transition-colors'
										>
											<Edit className='h-6 w-6 mb-1' />
											<span className='text-sm font-medium'>تعديل العضوية</span>
										</Link>

										<Link
											href={`/dashboard/marketing/loyalty/members/${selectedMember.id}/history`}
											className='p-3 bg-gray-100 text-gray-800 rounded-lg flex flex-col items-center justify-center hover:bg-gray-200 transition-colors'
										>
											<Clock className='h-6 w-6 mb-1' />
											<span className='text-sm font-medium'>سجل النقاط</span>
										</Link>
									</div>

									<div className='mt-4'>
										<Link
											href={`/dashboard/reports/customers/${selectedMember.customer.id}`}
											className='w-full py-2 flex items-center justify-center text-sm text-amber-600 hover:text-amber-800 font-medium bg-white border border-amber-200 rounded-md'
										>
											<BarChart2 className='ml-1 h-4 w-4' />
											عرض تقرير شامل للعميل
										</Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
