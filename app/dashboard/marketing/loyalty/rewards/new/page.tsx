'use client';

import {
	AlertCircle,
	ArrowLeft,
	Check,
	ChevronDown,
	Clock,
	Gift,
	Info,
	Minus,
	PackageOpen,
	Percent,
	Plus,
	Save,
	Star,
	Truck,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LoyaltyTier {
	id: string;
	name: string;
	arabicName: string;
	threshold: number;
}

export default function NewLoyaltyRewardPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
	const [categories, setCategories] = useState<string[]>([]);

	// بيانات النموذج
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [pointsCost, setPointsCost] = useState<number>(500);
	const [category, setCategory] = useState('');
	const [customCategory, setCustomCategory] = useState('');
	const [isActive, setIsActive] = useState(true);
	const [availableToAll, setAvailableToAll] = useState(true);
	const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
	const [limitedTimeOffer, setLimitedTimeOffer] = useState(false);
	const [startDate, setStartDate] = useState<string>('');
	const [endDate, setEndDate] = useState<string>('');
	const [maxRedemptions, setMaxRedemptions] = useState<number | null>(null);
	const [hasMaxRedemptions, setHasMaxRedemptions] = useState(false);
	const [redemptionInstructions, setRedemptionInstructions] = useState('');
	const [rewardType, setRewardType] = useState<'discount' | 'freeItem' | 'freeShipping' | 'other'>('discount');
	const [discountValue, setDiscountValue] = useState<number>(10);
	const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
	const [freeItemName, setFreeItemName] = useState('');
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية للشرائح
			const mockTiers: LoyaltyTier[] = [
				{
					id: 'tier-1',
					name: 'Bronze',
					arabicName: 'برونزي',
					threshold: 0,
				},
				{
					id: 'tier-2',
					name: 'Silver',
					arabicName: 'فضي',
					threshold: 500,
				},
				{
					id: 'tier-3',
					name: 'Gold',
					arabicName: 'ذهبي',
					threshold: 1500,
				},
				{
					id: 'tier-4',
					name: 'Platinum',
					arabicName: 'بلاتيني',
					threshold: 5000,
				},
			];

			// بيانات تجريبية لفئات المكافآت
			const mockCategories = ['خصومات', 'هدايا', 'شحن', 'خدمات', 'عروض موسمية', 'تجارب حصرية'];

			setTiers(mockTiers);
			setCategories(mockCategories);
			setLoading(false);
		};

		fetchData();
	}, []);

	// التحقق من صلاحية النموذج
	const validateForm = (): boolean => {
		if (!name.trim()) {
			alert('يرجى إدخال اسم المكافأة');
			return false;
		}

		if (!description.trim()) {
			alert('يرجى إدخال وصف المكافأة');
			return false;
		}

		if (pointsCost <= 0) {
			alert('يجب أن تكون تكلفة النقاط أكبر من صفر');
			return false;
		}

		if (!category && !customCategory) {
			alert('يرجى اختيار أو إدخال فئة المكافأة');
			return false;
		}

		if (!availableToAll && selectedTiers.length === 0) {
			alert('يرجى اختيار الشرائح التي ستتوفر لها المكافأة');
			return false;
		}

		if (limitedTimeOffer) {
			if (!startDate) {
				alert('يرجى تحديد تاريخ بداية العرض');
				return false;
			}

			if (!endDate) {
				alert('يرجى تحديد تاريخ نهاية العرض');
				return false;
			}

			const start = new Date(startDate);
			const end = new Date(endDate);

			if (start > end) {
				alert('تاريخ البداية يجب أن يكون قبل تاريخ النهاية');
				return false;
			}
		}

		if (rewardType === 'discount') {
			if (discountType === 'percentage' && (discountValue <= 0 || discountValue > 100)) {
				alert('يجب أن تكون نسبة الخصم بين 1% و 100%');
				return false;
			}

			if (discountType === 'fixed' && discountValue <= 0) {
				alert('يجب أن تكون قيمة الخصم أكبر من صفر');
				return false;
			}
		}

		if (rewardType === 'freeItem' && !freeItemName.trim()) {
			alert('يرجى إدخال اسم العنصر المجاني');
			return false;
		}

		return true;
	};

	// حفظ المكافأة الجديدة
	const saveReward = async () => {
		if (!validateForm()) {
			return;
		}

		setSaving(true);

		// تجميع بيانات المكافأة الجديدة
		const rewardData = {
			name,
			description,
			pointsCost,
			category: category === 'other' ? customCategory : category,
			isActive,
			availableTiers: availableToAll ? 'all' : selectedTiers,
			limitedTimeOffer,
			startDate: limitedTimeOffer ? startDate : null,
			endDate: limitedTimeOffer ? endDate : null,
			maxRedemptions: hasMaxRedemptions ? maxRedemptions : null,
			redemptionInstructions,
			rewardType,
			rewardDetails:
				rewardType === 'discount'
					? { type: discountType, value: discountValue }
					: rewardType === 'freeItem'
					? { itemName: freeItemName }
					: {},
		};

		// محاكاة عملية الحفظ
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// في تطبيق حقيقي، هنا نرسل البيانات للخادم
		console.log('Reward data:', rewardData);

		setSaving(false);
		setShowSuccessMessage(true);

		// إعادة توجيه بعد 2 ثانية
		setTimeout(() => {
			window.location.href = '/dashboard/marketing/loyalty';
		}, 2000);
	};

	// معالجة تحديد الشرائح
	const handleTierSelection = (tierId: string) => {
		if (selectedTiers.includes(tierId)) {
			setSelectedTiers(selectedTiers.filter((id) => id !== tierId));
		} else {
			setSelectedTiers([...selectedTiers, tierId]);
		}
	};

	// رسم أيقونة نوع المكافأة
	const renderRewardTypeIcon = (type: string) => {
		switch (type) {
			case 'discount':
				return <Percent className='h-6 w-6 text-red-500' />;
			case 'freeItem':
				return <PackageOpen className='h-6 w-6 text-green-500' />;
			case 'freeShipping':
				return <Truck className='h-6 w-6 text-blue-500' />;
			case 'other':
				return <Gift className='h-6 w-6 text-purple-500' />;
			default:
				return <Gift className='h-6 w-6 text-amber-500' />;
		}
	};

	// تصغير أو تكبير قيمة النقاط
	const decreasePoints = () => {
		if (pointsCost > 100) {
			setPointsCost(pointsCost - 100);
		}
	};

	const increasePoints = () => {
		setPointsCost(pointsCost + 100);
	};

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
			<div className='flex items-center justify-between'>
				<div className='flex items-center'>
					<Link
						href='/dashboard/marketing/loyalty'
						className='flex items-center text-gray-500 hover:text-gray-700 ml-4'
					>
						<ArrowLeft className='h-5 w-5' />
						<span className='mr-1 text-sm'>العودة</span>
					</Link>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<Gift className='inline-block ml-2 h-6 w-6 text-amber-600' />
						إضافة مكافأة جديدة
					</h1>
				</div>

				<div className='flex gap-2'>
					<Link
						href='/dashboard/marketing/loyalty'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						إلغاء
					</Link>

					<button
						onClick={saveReward}
						disabled={saving}
						className='px-4 py-2 bg-amber-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-amber-700 disabled:opacity-70 disabled:cursor-not-allowed'
					>
						{saving ? (
							<>
								<svg
									className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
								>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
									></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
									></path>
								</svg>
								جاري الحفظ...
							</>
						) : (
							<>
								<Save className='ml-1 h-4 w-4' />
								حفظ المكافأة
							</>
						)}
					</button>
				</div>
			</div>

			{/* رسالة النجاح */}
			{showSuccessMessage && (
				<div className='bg-green-50 border border-green-200 rounded-md p-4 mb-6'>
					<div className='flex'>
						<div className='flex-shrink-0'>
							<Check className='h-5 w-5 text-green-400' />
						</div>
						<div className='mr-3'>
							<p className='text-sm font-medium text-green-800'>تم إنشاء المكافأة بنجاح</p>
							<p className='mt-1 text-sm text-green-700'>
								تم إضافة المكافأة بنجاح إلى برنامج الولاء. جاري تحويلك...
							</p>
						</div>
					</div>
				</div>
			)}

			{/* معلومات إرشادية */}
			<div className='bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start'>
				<Info className='h-5 w-5 text-blue-500 ml-3 mt-0.5' />
				<div>
					<p className='text-sm font-medium text-blue-800'>معلومات حول مكافآت برنامج الولاء</p>
					<ul className='text-xs text-blue-700 mt-1 space-y-1 mr-5 list-disc'>
						<li>المكافآت هي ما يمكن للعملاء استبداله مقابل نقاط الولاء المكتسبة.</li>
						<li>كل مكافأة لها تكلفة محددة من النقاط يجب على العميل تحصيلها للحصول عليها.</li>
						<li>يمكن تحديد أنواع مختلفة من المكافآت مثل الخصومات، الهدايا، أو الشحن المجاني.</li>
						<li>يمكنك تحديد شرائح الولاء التي يمكنها الوصول إلى كل مكافأة.</li>
					</ul>
				</div>
			</div>

			{/* نموذج إنشاء المكافأة */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-6 border-b border-gray-200'>
					<h2 className='text-lg font-medium text-gray-900'>معلومات المكافأة</h2>
					<p className='text-sm text-gray-500'>أدخل المعلومات الأساسية للمكافأة الجديدة</p>
				</div>

				<div className='p-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							{/* اسم المكافأة */}
							<div className='mb-6'>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									اسم المكافأة <span className='text-red-500'>*</span>
								</label>
								<input
									type='text'
									value={name}
									onChange={(e) => setName(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
									placeholder='مثال: خصم 10٪، شحن مجاني، هدية...'
								/>
							</div>

							{/* وصف المكافأة */}
							<div className='mb-6'>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									وصف المكافأة <span className='text-red-500'>*</span>
								</label>
								<textarea
									value={description}
									onChange={(e) => setDescription(e.target.value)}
									rows={3}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
									placeholder='اشرح بالتفصيل ما سيحصل عليه العميل من هذه المكافأة...'
								/>
							</div>

							{/* تكلفة النقاط */}
							<div className='mb-6'>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									تكلفة النقاط <span className='text-red-500'>*</span>
								</label>
								<div className='relative flex items-center'>
									<button
										type='button'
										onClick={decreasePoints}
										className='absolute right-0 inset-y-0 px-3 py-1 border-r border-gray-300 bg-gray-50 rounded-r-md hover:bg-gray-100'
									>
										<Minus className='h-4 w-4 text-gray-500' />
									</button>
									<input
										type='number'
										value={pointsCost}
										onChange={(e) => setPointsCost(parseInt(e.target.value) || 0)}
										className='block w-full px-12 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-center text-lg font-bold text-amber-600'
										min='1'
									/>
									<button
										type='button'
										onClick={increasePoints}
										className='absolute left-0 inset-y-0 px-3 py-1 border-l border-gray-300 bg-gray-50 rounded-l-md hover:bg-gray-100'
									>
										<Plus className='h-4 w-4 text-gray-500' />
									</button>
								</div>
								<div className='mt-1 flex items-center justify-center'>
									<Star className='h-4 w-4 text-amber-500 ml-1' />
									<span className='text-sm text-gray-500'>
										عدد النقاط المطلوبة لاستبدال هذه المكافأة
									</span>
								</div>
							</div>

							{/* فئة المكافأة */}
							<div className='mb-6'>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									فئة المكافأة <span className='text-red-500'>*</span>
								</label>
								<div className='relative'>
									<select
										value={category}
										onChange={(e) => setCategory(e.target.value)}
										className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm pr-8'
									>
										<option value=''>اختر فئة...</option>
										{categories.map((cat) => (
											<option key={cat} value={cat}>
												{cat}
											</option>
										))}
										<option value='other'>فئة أخرى...</option>
									</select>
									<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
										<ChevronDown className='h-4 w-4 text-gray-400' />
									</div>
								</div>

								{category === 'other' && (
									<div className='mt-2'>
										<input
											type='text'
											value={customCategory}
											onChange={(e) => setCustomCategory(e.target.value)}
											className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
											placeholder='أدخل فئة مخصصة...'
										/>
									</div>
								)}
							</div>

							{/* حالة المكافأة */}
							<div className='mb-6'>
								<div className='flex items-center'>
									<input
										id='isActive'
										type='checkbox'
										checked={isActive}
										onChange={(e) => setIsActive(e.target.checked)}
										className='h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded'
									/>
									<label htmlFor='isActive' className='mr-2 block text-sm text-gray-700'>
										مكافأة نشطة
									</label>
								</div>
								<p className='mt-1 text-xs text-gray-500 mr-6'>
									إذا كانت غير نشطة، لن تظهر للعملاء حتى يتم تفعيلها
								</p>
							</div>
						</div>

						<div>
							{/* شرائح الولاء المستهدفة */}
							<div className='mb-6'>
								<div className='flex items-center mb-2'>
									<input
										id='availableToAll'
										type='checkbox'
										checked={availableToAll}
										onChange={(e) => setAvailableToAll(e.target.checked)}
										className='h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded'
									/>
									<label
										htmlFor='availableToAll'
										className='mr-2 block text-sm font-medium text-gray-700'
									>
										متاحة لجميع شرائح الولاء
									</label>
								</div>

								{!availableToAll && (
									<div className='mt-3 space-y-3 border border-gray-200 rounded-md p-4'>
										<label className='block text-sm font-medium text-gray-700 mb-2'>
											اختر الشرائح التي ستتوفر لها هذه المكافأة{' '}
											<span className='text-red-500'>*</span>
										</label>
										{tiers.map((tier) => (
											<div key={tier.id} className='flex items-center'>
												<input
													id={`tier-${tier.id}`}
													type='checkbox'
													checked={selectedTiers.includes(tier.id)}
													onChange={() => handleTierSelection(tier.id)}
													className='h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded'
												/>
												<label
													htmlFor={`tier-${tier.id}`}
													className='mr-2 block text-sm text-gray-700'
												>
													{tier.arabicName} ({tier.threshold.toLocaleString()}+ نقطة)
												</label>
											</div>
										))}
									</div>
								)}
							</div>

							{/* فترة محددة */}
							<div className='mb-6'>
								<div className='flex items-center mb-2'>
									<input
										id='limitedTimeOffer'
										type='checkbox'
										checked={limitedTimeOffer}
										onChange={(e) => setLimitedTimeOffer(e.target.checked)}
										className='h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded'
									/>
									<label
										htmlFor='limitedTimeOffer'
										className='mr-2 block text-sm font-medium text-gray-700'
									>
										مكافأة محدودة الوقت
									</label>
								</div>

								{limitedTimeOffer && (
									<div className='mt-3 grid grid-cols-2 gap-4'>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												تاريخ البداية <span className='text-red-500'>*</span>
											</label>
											<input
												type='date'
												value={startDate}
												onChange={(e) => setStartDate(e.target.value)}
												className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
											/>
										</div>
										<div>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												تاريخ النهاية <span className='text-red-500'>*</span>
											</label>
											<input
												type='date'
												value={endDate}
												onChange={(e) => setEndDate(e.target.value)}
												className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
											/>
										</div>
									</div>
								)}
							</div>

							{/* الحد الأقصى للاستبدال */}
							<div className='mb-6'>
								<div className='flex items-center mb-2'>
									<input
										id='hasMaxRedemptions'
										type='checkbox'
										checked={hasMaxRedemptions}
										onChange={(e) => setHasMaxRedemptions(e.target.checked)}
										className='h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded'
									/>
									<label
										htmlFor='hasMaxRedemptions'
										className='mr-2 block text-sm font-medium text-gray-700'
									>
										تحديد عدد أقصى للاستبدال
									</label>
								</div>

								{hasMaxRedemptions && (
									<div className='mt-3'>
										<input
											type='number'
											value={maxRedemptions !== null ? maxRedemptions : ''}
											onChange={(e) => setMaxRedemptions(parseInt(e.target.value) || 0)}
											className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
											placeholder='العدد الأقصى للمكافآت المتاحة للاستبدال'
											min='1'
										/>
									</div>
								)}
							</div>

							{/* تعليمات الاستبدال */}
							<div className='mb-6'>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									تعليمات الاستبدال
								</label>
								<textarea
									value={redemptionInstructions}
									onChange={(e) => setRedemptionInstructions(e.target.value)}
									rows={3}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
									placeholder='أي تعليمات خاصة لاستبدال هذه المكافأة...'
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* تفاصيل نوع المكافأة */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-6 border-b border-gray-200'>
					<h2 className='text-lg font-medium text-gray-900'>نوع المكافأة</h2>
					<p className='text-sm text-gray-500'>اختر نوع المكافأة وأدخل التفاصيل الخاصة بها</p>
				</div>

				<div className='p-6'>
					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6'>
						<div
							onClick={() => setRewardType('discount')}
							className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border ${
								rewardType === 'discount'
									? 'bg-red-50 border-red-500 ring-1 ring-red-500'
									: 'border-gray-200 hover:border-red-500'
							}`}
						>
							<Percent className='h-8 w-8 mb-2 text-red-500' />
							<span
								className={`text-sm font-medium ${
									rewardType === 'discount' ? 'text-red-700' : 'text-gray-700'
								}`}
							>
								خصم
							</span>
						</div>

						<div
							onClick={() => setRewardType('freeItem')}
							className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border ${
								rewardType === 'freeItem'
									? 'bg-green-50 border-green-500 ring-1 ring-green-500'
									: 'border-gray-200 hover:border-green-500'
							}`}
						>
							<PackageOpen className='h-8 w-8 mb-2 text-green-500' />
							<span
								className={`text-sm font-medium ${
									rewardType === 'freeItem' ? 'text-green-700' : 'text-gray-700'
								}`}
							>
								منتج مجاني
							</span>
						</div>

						<div
							onClick={() => setRewardType('freeShipping')}
							className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border ${
								rewardType === 'freeShipping'
									? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500'
									: 'border-gray-200 hover:border-blue-500'
							}`}
						>
							<Truck className='h-8 w-8 mb-2 text-blue-500' />
							<span
								className={`text-sm font-medium ${
									rewardType === 'freeShipping' ? 'text-blue-700' : 'text-gray-700'
								}`}
							>
								شحن مجاني
							</span>
						</div>

						<div
							onClick={() => setRewardType('other')}
							className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border ${
								rewardType === 'other'
									? 'bg-purple-50 border-purple-500 ring-1 ring-purple-500'
									: 'border-gray-200 hover:border-purple-500'
							}`}
						>
							<Gift className='h-8 w-8 mb-2 text-purple-500' />
							<span
								className={`text-sm font-medium ${
									rewardType === 'other' ? 'text-purple-700' : 'text-gray-700'
								}`}
							>
								أخرى
							</span>
						</div>
					</div>

					{/* تفاصيل حسب نوع المكافأة */}
					<div className='mt-6'>
						{rewardType === 'discount' && (
							<div className='space-y-4'>
								<div className='flex items-center mb-4'>
									<input
										id='percentageDiscount'
										type='radio'
										checked={discountType === 'percentage'}
										onChange={() => setDiscountType('percentage')}
										className='h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300'
									/>
									<label
										htmlFor='percentageDiscount'
										className='mr-2 block text-sm font-medium text-gray-700'
									>
										خصم بالنسبة المئوية (٪)
									</label>

									<input
										id='fixedDiscount'
										type='radio'
										checked={discountType === 'fixed'}
										onChange={() => setDiscountType('fixed')}
										className='h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 mr-6'
									/>
									<label
										htmlFor='fixedDiscount'
										className='mr-2 block text-sm font-medium text-gray-700'
									>
										خصم بقيمة ثابتة (ريال)
									</label>
								</div>

								<div className='flex items-center'>
									<input
										type='number'
										value={discountValue}
										onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
										className='w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
										min={discountType === 'percentage' ? 1 : 0}
										max={discountType === 'percentage' ? 100 : undefined}
									/>
									<span className='mr-2 text-gray-700'>
										{discountType === 'percentage' ? '%' : 'ريال'}
									</span>
								</div>

								<div className='bg-amber-50 border border-amber-200 rounded-md p-4 mt-4'>
									<div className='flex items-start'>
										<AlertCircle className='h-5 w-5 text-amber-500 ml-2 mt-0.5' />
										<div className='text-sm text-amber-700'>
											{discountType === 'percentage'
												? 'سيتم تطبيق هذا الخصم بالنسبة المئوية على إجمالي مشتريات العميل'
												: 'سيتم خصم هذا المبلغ من إجمالي قيمة مشتريات العميل'}
										</div>
									</div>
								</div>
							</div>
						)}

						{rewardType === 'freeItem' && (
							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										المنتج المجاني <span className='text-red-500'>*</span>
									</label>
									<input
										type='text'
										value={freeItemName}
										onChange={(e) => setFreeItemName(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
										placeholder='اسم المنتج أو الهدية المجانية...'
									/>
								</div>

								<div className='bg-green-50 border border-green-200 rounded-md p-4 mt-4'>
									<div className='flex items-start'>
										<AlertCircle className='h-5 w-5 text-green-500 ml-2 mt-0.5' />
										<div className='text-sm text-green-700'>
											عند استبدال هذه المكافأة، سيتمكن العميل من الحصول على المنتج المذكور مجاناً
										</div>
									</div>
								</div>
							</div>
						)}

						{rewardType === 'freeShipping' && (
							<div className='space-y-4'>
								<div className='bg-blue-50 border border-blue-200 rounded-md p-4'>
									<div className='flex items-start'>
										<AlertCircle className='h-5 w-5 text-blue-500 ml-2 mt-0.5' />
										<div className='text-sm text-blue-700'>
											عند استبدال هذه المكافأة، سيحصل العميل على خدمة شحن مجانية لطلبه التالي
										</div>
									</div>
								</div>
							</div>
						)}

						{rewardType === 'other' && (
							<div className='space-y-4'>
								<div className='bg-purple-50 border border-purple-200 rounded-md p-4'>
									<div className='flex items-start'>
										<AlertCircle className='h-5 w-5 text-purple-500 ml-2 mt-0.5' />
										<div className='text-sm text-purple-700'>
											هذه مكافأة مخصصة. يرجى تقديم وصف تفصيلي في حقل وصف المكافأة أعلاه.
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* معاينة المكافأة */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-6 border-b border-gray-200'>
					<h2 className='text-lg font-medium text-gray-900'>معاينة المكافأة</h2>
					<p className='text-sm text-gray-500'>هكذا ستظهر المكافأة للعملاء في النظام</p>
				</div>

				<div className='p-6'>
					<div className='max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-md border border-gray-200'>
						<div className='h-3 w-full bg-amber-500'></div>
						<div className='p-4'>
							<div className='flex justify-between items-start mb-4'>
								<div className='flex items-center'>
									{renderRewardTypeIcon(rewardType)}
									<h3 className='text-lg font-medium text-gray-900 mr-2'>{name || 'اسم المكافأة'}</h3>
								</div>
								<div className='bg-amber-100 text-amber-800 rounded-full px-3 py-1 text-xs font-medium'>
									{pointsCost.toLocaleString()} نقطة
								</div>
							</div>

							<p className='text-sm text-gray-700 mb-4'>{description || 'وصف المكافأة سيظهر هنا...'}</p>

							{limitedTimeOffer && startDate && endDate && (
								<div className='flex items-center text-xs text-gray-500 mb-3'>
									<Clock className='h-4 w-4 ml-1 text-amber-500' />
									متاح من {new Date(startDate).toLocaleDateString('ar-SA')} إلى{' '}
									{new Date(endDate).toLocaleDateString('ar-SA')}
								</div>
							)}

							<div className='flex justify-between mt-4 pt-3 border-t border-gray-200'>
								<div className='text-xs text-gray-500'>
									الفئة: {category === 'other' ? customCategory : category || 'غير محدد'}
								</div>
								<button className='px-3 py-1 bg-amber-600 text-white rounded-md text-xs font-medium hover:bg-amber-700'>
									استبدال المكافأة
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
