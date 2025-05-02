'use client';

import {
	AlertCircle,
	ArrowLeft,
	Award,
	Check,
	ChevronDown,
	ChevronUp,
	DollarSign,
	HelpCircle,
	Info,
	Plus,
	Save,
	Trash2,
	Zap,
} from 'lucide-react';
import { useEffect, useState } from 'react';

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
	isActive: boolean;
}

interface TierBenefit {
	id: string;
	text: string;
	isEditable: boolean;
}

export default function LoyaltyTiersEditPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);
	const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchTiersData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية للشرائح
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
					isActive: true,
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
					isActive: true,
				},
				{
					id: 'tier-3',
					name: 'Gold',
					arabicName: 'ذهبي',
					threshold: 1500,
					benefits: [
						'2 نقطة لكل 10 ريال',
						'خصم 10% على الاصلاحات',
						'خدمة توصيل مجانية',
						'هدية عيد ميلاد',
						'قياسات مجانية',
					],
					pointsMultiplier: 2,
					color: '#FFD700',
					icon: 'award',
					isActive: true,
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
						'هدية عيد ميلاد',
						'قياسات مجانية',
						'مساعد شخصي للتسوق',
						'وصول مبكر للمجموعات الجديدة',
					],
					pointsMultiplier: 3,
					color: '#E5E4E2',
					icon: 'award',
					isActive: true,
				},
			];

			setTiers(mockTiers);
			setLoading(false);
		};

		fetchTiersData();
	}, []);

	// تحويل البيانات للعرض والتحرير
	const [tiersForms, setTiersForms] = useState<
		{
			id: string;
			name: string;
			arabicName: string;
			threshold: number;
			benefits: TierBenefit[];
			pointsMultiplier: number;
			color: string;
			icon: string;
			isActive: boolean;
			isExpanded: boolean;
		}[]
	>([]);

	useEffect(() => {
		if (tiers.length) {
			const forms = tiers.map((tier) => ({
				id: tier.id,
				name: tier.name,
				arabicName: tier.arabicName,
				threshold: tier.threshold,
				benefits: tier.benefits.map((benefit, index) => ({
					id: `benefit-${tier.id}-${index}`,
					text: benefit,
					isEditable: index !== 0, // الميزة الأولى غير قابلة للتعديل (معدل النقاط)
				})),
				pointsMultiplier: tier.pointsMultiplier,
				color: tier.color,
				icon: tier.icon,
				isActive: tier.isActive,
				isExpanded: true,
			}));

			setTiersForms(forms);
		}
	}, [tiers]);

	// تحديث اسم الشريحة بالعربية
	const updateTierName = (tierId: string, newName: string) => {
		setTiersForms((prev) => prev.map((tier) => (tier.id === tierId ? { ...tier, arabicName: newName } : tier)));
		setHasChanges(true);
	};

	// تحديث حد النقاط
	const updateThreshold = (tierId: string, newThreshold: number) => {
		setTiersForms((prev) => prev.map((tier) => (tier.id === tierId ? { ...tier, threshold: newThreshold } : tier)));
		setHasChanges(true);
	};

	// تحديث مضاعف النقاط
	const updatePointsMultiplier = (tierId: string, newMultiplier: number) => {
		// تحديث المضاعف
		setTiersForms((prev) => {
			const updatedTiers = prev.map((tier) => {
				if (tier.id === tierId) {
					// تحديث نص الميزة الأولى (معدل النقاط)
					const updatedBenefits = [...tier.benefits];
					updatedBenefits[0] = {
						...updatedBenefits[0],
						text: newMultiplier === 1 ? 'نقطة واحدة لكل 10 ريال' : `${newMultiplier} نقطة لكل 10 ريال`,
					};

					return {
						...tier,
						pointsMultiplier: newMultiplier,
						benefits: updatedBenefits,
					};
				}
				return tier;
			});

			return updatedTiers;
		});

		setHasChanges(true);
	};

	// تحديث الميزة
	const updateBenefit = (tierId: string, benefitId: string, newText: string) => {
		setTiersForms((prev) =>
			prev.map((tier) => {
				if (tier.id === tierId) {
					const updatedBenefits = tier.benefits.map((benefit) =>
						benefit.id === benefitId ? { ...benefit, text: newText } : benefit
					);
					return { ...tier, benefits: updatedBenefits };
				}
				return tier;
			})
		);
		setHasChanges(true);
	};

	// إضافة ميزة جديدة
	const addBenefit = (tierId: string) => {
		setTiersForms((prev) =>
			prev.map((tier) => {
				if (tier.id === tierId) {
					const newBenefitId = `benefit-${tierId}-${tier.benefits.length}`;
					const updatedBenefits = [...tier.benefits, { id: newBenefitId, text: '', isEditable: true }];
					return { ...tier, benefits: updatedBenefits };
				}
				return tier;
			})
		);
		setHasChanges(true);
	};

	// حذف ميزة
	const removeBenefit = (tierId: string, benefitId: string) => {
		setTiersForms((prev) =>
			prev.map((tier) => {
				if (tier.id === tierId) {
					const updatedBenefits = tier.benefits.filter((benefit) => benefit.id !== benefitId);
					return { ...tier, benefits: updatedBenefits };
				}
				return tier;
			})
		);
		setHasChanges(true);
	};

	// تحديث لون الشريحة
	const updateColor = (tierId: string, newColor: string) => {
		setTiersForms((prev) => prev.map((tier) => (tier.id === tierId ? { ...tier, color: newColor } : tier)));
		setHasChanges(true);
	};

	// تبديل حالة توسيع/طي الشريحة
	const toggleExpand = (tierId: string) => {
		setTiersForms((prev) =>
			prev.map((tier) => (tier.id === tierId ? { ...tier, isExpanded: !tier.isExpanded } : tier))
		);
	};

	// تبديل حالة تفعيل/تعطيل الشريحة
	const toggleActive = (tierId: string) => {
		setTiersForms((prev) =>
			prev.map((tier) => (tier.id === tierId ? { ...tier, isActive: !tier.isActive } : tier))
		);
		setHasChanges(true);
	};

	// تحقق من صحة البيانات قبل الحفظ
	const validateTiers = () => {
		// تحقق من وجود الاسم وحد النقاط ومضاعف النقاط
		const invalidTier = tiersForms.find(
			(tier) => !tier.arabicName || tier.threshold < 0 || tier.pointsMultiplier <= 0
		);

		if (invalidTier) {
			return false;
		}

		// تحقق من أن كل شريحة لها حد نقاط أعلى من الشريحة السابقة
		for (let i = 1; i < tiersForms.length; i++) {
			if (tiersForms[i].threshold <= tiersForms[i - 1].threshold) {
				return false;
			}
		}

		return true;
	};

	// حفظ التغييرات
	const saveTiers = async () => {
		if (!validateTiers()) {
			alert('يرجى التحقق من إدخال جميع البيانات المطلوبة بشكل صحيح');
			return;
		}

		setSaving(true);

		// محاكاة عملية الحفظ
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// تحويل البيانات من الأشكال إلى كائنات الشرائح
		const updatedTiers = tiersForms.map((form) => ({
			id: form.id,
			name: form.name,
			arabicName: form.arabicName,
			threshold: form.threshold,
			benefits: form.benefits.map((benefit) => benefit.text),
			pointsMultiplier: form.pointsMultiplier,
			color: form.color,
			icon: form.icon,
			isActive: form.isActive,
		}));

		// في تطبيق حقيقي، سنرسل البيانات للخادم هنا

		setTiers(updatedTiers as LoyaltyTier[]);
		setSaving(false);
		setShowSuccessMessage(true);
		setHasChanges(false);

		// إخفاء رسالة النجاح بعد 3 ثوان
		setTimeout(() => {
			setShowSuccessMessage(false);
		}, 3000);
	};

	// التحقق قبل الخروج من الصفحة
	const handleBack = () => {
		if (hasChanges) {
			setShowDiscardConfirm(true);
		} else {
			window.history.back();
		}
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
					<button onClick={handleBack} className='flex items-center text-gray-500 hover:text-gray-700 ml-4'>
						<ArrowLeft className='h-5 w-5' />
						<span className='mr-1 text-sm'>العودة</span>
					</button>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<Award className='inline-block ml-2 h-6 w-6 text-amber-600' />
						تعديل شرائح برنامج الولاء
					</h1>
				</div>

				<div className='flex gap-2'>
					<button
						onClick={() => window.history.back()}
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
						disabled={saving}
					>
						إلغاء
					</button>

					<button
						onClick={saveTiers}
						disabled={saving || !hasChanges}
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
								حفظ التغييرات
							</>
						)}
					</button>
				</div>
			</div>

			{/* رسالة نجاح الحفظ */}
			{showSuccessMessage && (
				<div className='bg-green-50 border border-green-200 rounded-md p-4 flex items-start'>
					<Check className='h-5 w-5 text-green-500 ml-3 mt-0.5' />
					<div>
						<p className='text-sm font-medium text-green-800'>تم حفظ التغييرات بنجاح</p>
						<p className='text-xs text-green-700 mt-1'>تم تحديث شرائح برنامج الولاء بنجاح.</p>
					</div>
				</div>
			)}

			{/* معلومات إرشادية */}
			<div className='bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start'>
				<Info className='h-5 w-5 text-blue-500 ml-3 mt-0.5' />
				<div>
					<p className='text-sm font-medium text-blue-800'>معلومات حول شرائح الولاء</p>
					<ul className='text-xs text-blue-700 mt-1 space-y-1 mr-5 list-disc'>
						<li>شرائح الولاء هي مستويات مختلفة للعملاء بناءً على نقاط الولاء المكتسبة.</li>
						<li>لكل شريحة مزايا مختلفة ومعدل مختلف لاكتساب النقاط.</li>
						<li>يتم ترقية العملاء تلقائياً عند الوصول لحد النقاط المطلوب.</li>
						<li>النقاط المكتسبة تعتمد على مضاعف النقاط لكل شريحة.</li>
					</ul>
				</div>
			</div>

			{/* نماذج تعديل الشرائح */}
			<div className='space-y-6'>
				{tiersForms.map((tier, index) => (
					<div key={tier.id} className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
						{/* رأس الشريحة */}
						<div
							className='p-4 border-b border-gray-200 flex items-center justify-between cursor-pointer'
							onClick={() => toggleExpand(tier.id)}
							style={{ backgroundColor: `${tier.color}20` }}
						>
							<div className='flex items-center'>
								<Award className='h-6 w-6 ml-2' style={{ color: tier.color }} />
								<span className='text-lg font-medium text-gray-900'>شريحة {tier.arabicName}</span>
								{!tier.isActive && (
									<span className='mr-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs'>
										معطلة
									</span>
								)}
							</div>

							<div className='flex items-center'>
								<button
									type='button'
									onClick={(e) => {
										e.stopPropagation();
										toggleActive(tier.id);
									}}
									className={`mr-2 px-3 py-1 rounded text-xs font-medium ${
										tier.isActive
											? 'bg-red-100 text-red-800 hover:bg-red-200'
											: 'bg-green-100 text-green-800 hover:bg-green-200'
									}`}
								>
									{tier.isActive ? 'تعطيل' : 'تفعيل'}
								</button>
								{tier.isExpanded ? (
									<ChevronUp className='h-5 w-5 text-gray-500' />
								) : (
									<ChevronDown className='h-5 w-5 text-gray-500' />
								)}
							</div>
						</div>

						{/* محتوى الشريحة */}
						{tier.isExpanded && (
							<div className='p-6'>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div>
										{/* اسم الشريحة */}
										<div className='mb-4'>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												اسم الشريحة
											</label>
											<input
												type='text'
												value={tier.arabicName}
												onChange={(e) => updateTierName(tier.id, e.target.value)}
												className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
												placeholder='اسم الشريحة بالعربية'
											/>
										</div>

										{/* حد النقاط */}
										<div className='mb-4'>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												حد النقاط المطلوبة {index === 0 && '(الشريحة الأساسية)'}
											</label>
											<div className='relative'>
												<input
													type='number'
													value={tier.threshold}
													onChange={(e) =>
														updateThreshold(tier.id, parseInt(e.target.value, 10) || 0)
													}
													className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
													placeholder='حد النقاط المطلوبة للترقية لهذه الشريحة'
													min='0'
													disabled={index === 0} // الشريحة الأولى دائماً تبدأ من 0
												/>
											</div>
											{index === 0 && (
												<p className='mt-1 text-xs text-gray-500'>
													الشريحة الأساسية تبدأ دائماً من 0 نقطة
												</p>
											)}
										</div>

										{/* مضاعف النقاط */}
										<div className='mb-4'>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												مضاعف النقاط
											</label>
											<div className='flex items-center'>
												<select
													value={tier.pointsMultiplier}
													onChange={(e) =>
														updatePointsMultiplier(tier.id, parseFloat(e.target.value))
													}
													className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
												>
													<option value='1'>1x - نقطة واحدة لكل 10 ريال</option>
													<option value='1.5'>1.5x - 1.5 نقطة لكل 10 ريال</option>
													<option value='2'>2x - نقطتين لكل 10 ريال</option>
													<option value='2.5'>2.5x - 2.5 نقطة لكل 10 ريال</option>
													<option value='3'>3x - 3 نقاط لكل 10 ريال</option>
													<option value='4'>4x - 4 نقاط لكل 10 ريال</option>
													<option value='5'>5x - 5 نقاط لكل 10 ريال</option>
												</select>
												<Zap className='h-5 w-5 text-amber-500 mr-2' />
											</div>
											<p className='mt-1 text-xs text-gray-500'>
												يحدد عدد النقاط التي يكسبها العميل لكل 10 ريال
											</p>
										</div>

										{/* لون الشريحة */}
										<div className='mb-4'>
											<label className='block text-sm font-medium text-gray-700 mb-1'>
												لون الشريحة
											</label>
											<div className='flex items-center'>
												<input
													type='color'
													value={tier.color}
													onChange={(e) => updateColor(tier.id, e.target.value)}
													className='h-10 w-10 rounded border border-gray-300 p-1'
												/>
												<input
													type='text'
													value={tier.color}
													onChange={(e) => updateColor(tier.id, e.target.value)}
													className='block w-full mr-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
													placeholder='#000000'
												/>
											</div>
										</div>
									</div>

									<div>
										<div className='mb-4'>
											<div className='flex items-center justify-between'>
												<label className='block text-sm font-medium text-gray-700'>
													مزايا الشريحة
												</label>
												<button
													type='button'
													onClick={() => addBenefit(tier.id)}
													className='flex items-center text-amber-600 hover:text-amber-700 text-sm'
												>
													<Plus className='h-4 w-4 ml-1' />
													إضافة ميزة
												</button>
											</div>
											<p className='text-xs text-gray-500 mt-1 mb-2'>
												المزايا التي يحصل عليها العميل في هذه الشريحة
											</p>

											<div className='space-y-3'>
												{tier.benefits.map((benefit, benefitIndex) => (
													<div key={benefit.id} className='flex items-center'>
														<input
															type='text'
															value={benefit.text}
															onChange={(e) =>
																updateBenefit(tier.id, benefit.id, e.target.value)
															}
															className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
															placeholder='أدخل ميزة'
															disabled={!benefit.isEditable}
														/>
														{benefit.isEditable && (
															<button
																type='button'
																onClick={() => removeBenefit(tier.id, benefit.id)}
																className='mr-2 text-gray-400 hover:text-red-500'
															>
																<Trash2 className='h-5 w-5' />
															</button>
														)}
														{!benefit.isEditable && (
															<div className='mr-2 px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs'>
																تلقائي
															</div>
														)}
													</div>
												))}

												{tier.benefits.length === 0 && (
													<div className='text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-md'>
														لا توجد مزايا محددة. أضف بعض المزايا.
													</div>
												)}
											</div>
										</div>

										<div className='mt-6 bg-amber-50 p-4 rounded-lg border border-amber-200'>
											<div className='flex items-start'>
												<HelpCircle className='h-5 w-5 text-amber-500 ml-2 mt-0.5' />
												<div>
													<p className='text-sm font-medium text-amber-800'>
														نصائح حول مزايا الشريحة
													</p>
													<ul className='text-xs text-amber-700 mt-1 mr-5 space-y-1 list-disc'>
														<li>اجعل المزايا واضحة وملموسة للعملاء</li>
														<li>زد من قيمة المزايا كلما ارتفعت الشريحة</li>
														<li>يمكنك تخصيص المزايا حسب فئات العملاء المستهدفة</li>
														<li>اضمن أن تكون المزايا قابلة للتطبيق والتنفيذ</li>
													</ul>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				))}
			</div>

			{/* معاينة الشرائح */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-4 border-b border-gray-200'>
					<h2 className='text-lg font-medium text-gray-900'>معاينة شرائح الولاء</h2>
					<p className='text-sm text-gray-500'>هكذا ستظهر الشرائح للعملاء في النظام</p>
				</div>

				<div className='p-6'>
					<div className='space-y-8'>
						{tiersForms
							.filter((t) => t.isActive)
							.map((tier, index) => (
								<div key={tier.id} className='rounded-lg border border-gray-200 overflow-hidden'>
									<div className='h-3 w-full' style={{ backgroundColor: tier.color }}></div>
									<div className='p-4'>
										<div className='flex items-center justify-between mb-4'>
											<div className='flex items-center'>
												<Award className='h-6 w-6 ml-2' style={{ color: tier.color }} />
												<h3 className='text-lg font-medium text-gray-900'>{tier.arabicName}</h3>
											</div>
											{index === 0 && (
												<div className='px-2 py-1 bg-amber-100 text-amber-800 rounded-md text-xs'>
													المستوى الأساسي
												</div>
											)}
										</div>

										<div className='mb-4'>
											<div className='flex items-center mb-2'>
												<DollarSign className='h-5 w-5 text-amber-500 ml-1' />
												<span className='text-sm font-medium text-gray-700'>
													متطلبات الترقية
												</span>
											</div>
											<p className='text-sm text-gray-600'>
												{index === 0
													? 'لا توجد متطلبات - هذه الشريحة الأساسية'
													: `${tier.threshold.toLocaleString()} نقطة أو أكثر`}
											</p>
										</div>

										<div>
											<div className='flex items-center mb-2'>
												<Zap className='h-5 w-5 text-amber-500 ml-1' />
												<span className='text-sm font-medium text-gray-700'>المزايا</span>
											</div>
											<ul className='space-y-2 mr-6 list-disc'>
												{tier.benefits.map((benefit, i) => (
													<li key={i} className='text-sm text-gray-600'>
														{benefit.text}
													</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							))}
					</div>
				</div>
			</div>

			{/* تأكيد إلغاء التغييرات */}
			{showDiscardConfirm && (
				<div className='fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50 p-4'>
					<div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
						<div className='p-6 border-b border-gray-200'>
							<h3 className='text-lg font-medium text-gray-900 flex items-center'>
								<AlertCircle className='h-5 w-5 text-amber-500 ml-2' />
								هل أنت متأكد من إلغاء التغييرات؟
							</h3>
						</div>
						<div className='p-6'>
							<p className='text-sm text-gray-600'>
								لديك تغييرات غير محفوظة. هل أنت متأكد من أنك تريد إلغاء هذه التغييرات؟
							</p>
							<div className='mt-6 flex justify-end space-x-3 space-x-reverse'>
								<button
									type='button'
									onClick={() => setShowDiscardConfirm(false)}
									className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50'
								>
									لا، استمر في التحرير
								</button>
								<button
									type='button'
									onClick={() => {
										setShowDiscardConfirm(false);
										window.history.back();
									}}
									className='px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700'
								>
									نعم، إلغاء التغييرات
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
