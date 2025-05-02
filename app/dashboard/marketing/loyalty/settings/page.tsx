'use client';

import {
	AlertCircle,
	ArrowLeft,
	Bell,
	Check,
	ChevronDown,
	Gift,
	Info,
	Mail,
	MessageSquare,
	Save,
	Settings,
	Star,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LoyaltySettings {
	// إعدادات عامة
	programName: string;
	programEnabled: boolean;
	pointsName: string;
	pointsExpiration: {
		enabled: boolean;
		months: number;
	};

	// إعدادات اكتساب النقاط
	earningRules: {
		pointsPerRiyal: number;
		minimumOrderAmount: number;
		roundingMethod: 'up' | 'down' | 'nearest';
		excludeTax: boolean;
		excludeShipping: boolean;
		excludeDiscounts: boolean;
	};

	// إعدادات المكافآت
	redemption: {
		minimumPointsToRedeem: number;
		allowPartialRedemption: boolean;
		maximumDiscountPercentage: number;
		redemptionIncrement: number;
	};

	// إعدادات الإشعارات
	notifications: {
		sendWelcomeEmail: boolean;
		sendPointsEarnedNotification: boolean;
		sendPointsExpiringNotification: boolean;
		sendTierUpgradeNotification: boolean;
		pointsExpirationWarningDays: number;
	};

	// إعدادات إضافية
	additionalSettings: {
		allowPointsTransfer: boolean;
		displayInStorefront: boolean;
		enableBirthdayBonus: boolean;
		birthdayBonusPoints: number;
		enableReferralProgram: boolean;
		referralPoints: number;
		enablePointsForReviews: boolean;
		reviewPoints: number;
	};
}

export default function LoyaltySettingsPage() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [settings, setSettings] = useState<LoyaltySettings | null>(null);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [hasChanges, setHasChanges] = useState(false);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchSettings = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// بيانات تجريبية لإعدادات برنامج الولاء
			const mockSettings: LoyaltySettings = {
				// إعدادات عامة
				programName: 'برنامج ولاء ثوب ماستر',
				programEnabled: true,
				pointsName: 'نقاط',
				pointsExpiration: {
					enabled: true,
					months: 12,
				},

				// إعدادات اكتساب النقاط
				earningRules: {
					pointsPerRiyal: 1,
					minimumOrderAmount: 100,
					roundingMethod: 'down',
					excludeTax: true,
					excludeShipping: true,
					excludeDiscounts: false,
				},

				// إعدادات المكافآت
				redemption: {
					minimumPointsToRedeem: 500,
					allowPartialRedemption: true,
					maximumDiscountPercentage: 75,
					redemptionIncrement: 100,
				},

				// إعدادات الإشعارات
				notifications: {
					sendWelcomeEmail: true,
					sendPointsEarnedNotification: true,
					sendPointsExpiringNotification: true,
					sendTierUpgradeNotification: true,
					pointsExpirationWarningDays: 30,
				},

				// إعدادات إضافية
				additionalSettings: {
					allowPointsTransfer: false,
					displayInStorefront: true,
					enableBirthdayBonus: true,
					birthdayBonusPoints: 200,
					enableReferralProgram: true,
					referralPoints: 150,
					enablePointsForReviews: true,
					reviewPoints: 50,
				},
			};

			setSettings(mockSettings);
			setLoading(false);
		};

		fetchSettings();
	}, []);

	// تحديث الإعدادات العامة
	const updateGeneralSettings = (field: keyof LoyaltySettings, value: any) => {
		if (settings) {
			setSettings({
				...settings,
				[field]: value,
			});
			setHasChanges(true);
		}
	};

	// تحديث إعدادات انتهاء الصلاحية
	const updateExpirationSettings = (field: keyof LoyaltySettings['pointsExpiration'], value: any) => {
		if (settings) {
			setSettings({
				...settings,
				pointsExpiration: {
					...settings.pointsExpiration,
					[field]: value,
				},
			});
			setHasChanges(true);
		}
	};

	// تحديث قواعد اكتساب النقاط
	const updateEarningRules = (field: keyof LoyaltySettings['earningRules'], value: any) => {
		if (settings) {
			setSettings({
				...settings,
				earningRules: {
					...settings.earningRules,
					[field]: value,
				},
			});
			setHasChanges(true);
		}
	};

	// تحديث إعدادات استبدال النقاط
	const updateRedemptionSettings = (field: keyof LoyaltySettings['redemption'], value: any) => {
		if (settings) {
			setSettings({
				...settings,
				redemption: {
					...settings.redemption,
					[field]: value,
				},
			});
			setHasChanges(true);
		}
	};

	// تحديث إعدادات الإشعارات
	const updateNotificationSettings = (field: keyof LoyaltySettings['notifications'], value: any) => {
		if (settings) {
			setSettings({
				...settings,
				notifications: {
					...settings.notifications,
					[field]: value,
				},
			});
			setHasChanges(true);
		}
	};

	// تحديث الإعدادات الإضافية
	const updateAdditionalSettings = (field: keyof LoyaltySettings['additionalSettings'], value: any) => {
		if (settings) {
			setSettings({
				...settings,
				additionalSettings: {
					...settings.additionalSettings,
					[field]: value,
				},
			});
			setHasChanges(true);
		}
	};

	// حفظ الإعدادات
	const saveSettings = async () => {
		setSaving(true);

		// محاكاة عملية الحفظ
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// في تطبيق حقيقي، هنا نرسل البيانات للخادم
		console.log('Settings data:', settings);

		setSaving(false);
		setShowSuccessMessage(true);
		setHasChanges(false);

		// إخفاء رسالة النجاح بعد 3 ثوان
		setTimeout(() => {
			setShowSuccessMessage(false);
		}, 3000);
	};

	// عنصر التبديل (Toggle)
	const ToggleSwitch = ({
		enabled,
		onChange,
		label,
		description,
	}: {
		enabled: boolean;
		onChange: (value: boolean) => void;
		label: string;
		description?: string;
	}) => {
		return (
			<div className='flex items-start'>
				<button
					type='button'
					onClick={() => onChange(!enabled)}
					className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
						enabled ? 'bg-amber-600' : 'bg-gray-200'
					}`}
				>
					<span className='sr-only'>{enabled ? 'تفعيل' : 'تعطيل'}</span>
					<span
						className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
							enabled ? 'translate-x-5' : 'translate-x-0'
						}`}
					/>
				</button>
				<div className='mr-3'>
					<label className='text-sm font-medium text-gray-700'>{label}</label>
					{description && <p className='text-xs text-gray-500 mt-1'>{description}</p>}
				</div>
			</div>
		);
	};

	if (loading || !settings) {
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
						<Settings className='inline-block ml-2 h-6 w-6 text-amber-600' />
						إعدادات برنامج الولاء
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
						onClick={saveSettings}
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
								حفظ الإعدادات
							</>
						)}
					</button>
				</div>
			</div>

			{/* رسالة النجاح */}
			{showSuccessMessage && (
				<div className='bg-green-50 border border-green-200 rounded-md p-4'>
					<div className='flex'>
						<div className='flex-shrink-0'>
							<Check className='h-5 w-5 text-green-400' />
						</div>
						<div className='mr-3'>
							<p className='text-sm font-medium text-green-800'>تم حفظ الإعدادات بنجاح</p>
							<p className='mt-1 text-sm text-green-700'>تم تحديث إعدادات برنامج الولاء بنجاح.</p>
						</div>
					</div>
				</div>
			)}

			{/* الإعدادات العامة */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-6 border-b border-gray-200'>
					<h2 className='text-lg font-medium text-gray-900 flex items-center'>
						<Settings className='inline-block ml-2 h-5 w-5 text-amber-600' />
						الإعدادات العامة
					</h2>
					<p className='text-sm text-gray-500'>الإعدادات الأساسية لبرنامج الولاء</p>
				</div>

				<div className='p-6 space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>اسم البرنامج</label>
							<input
								type='text'
								value={settings.programName}
								onChange={(e) => updateGeneralSettings('programName', e.target.value)}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
								placeholder='اسم برنامج الولاء الخاص بك'
							/>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>مسمى النقاط</label>
							<input
								type='text'
								value={settings.pointsName}
								onChange={(e) => updateGeneralSettings('pointsName', e.target.value)}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
								placeholder='نقاط، نجوم، عملات، إلخ.'
							/>
						</div>
					</div>

					<div className='space-y-4'>
						<ToggleSwitch
							enabled={settings.programEnabled}
							onChange={(value) => updateGeneralSettings('programEnabled', value)}
							label='تفعيل برنامج الولاء'
							description='عند إلغاء التفعيل، لن يتمكن العملاء من اكتساب أو استبدال النقاط'
						/>

						<div className='space-y-3'>
							<ToggleSwitch
								enabled={settings.pointsExpiration.enabled}
								onChange={(value) => updateExpirationSettings('enabled', value)}
								label='تفعيل انتهاء صلاحية النقاط'
								description='تحديد ما إذا كانت النقاط تنتهي صلاحيتها بعد فترة معينة'
							/>

							{settings.pointsExpiration.enabled && (
								<div className='pr-10 mt-2'>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										فترة الصلاحية (بالشهور)
									</label>
									<div className='flex items-center'>
										<input
											type='number'
											value={settings.pointsExpiration.months}
											onChange={(e) =>
												updateExpirationSettings('months', parseInt(e.target.value))
											}
											className='block w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
											min='1'
										/>
										<span className='mr-2 text-sm text-gray-700'>شهر</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* إعدادات اكتساب النقاط */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-6 border-b border-gray-200'>
					<h2 className='text-lg font-medium text-gray-900 flex items-center'>
						<Star className='inline-block ml-2 h-5 w-5 text-amber-600' />
						قواعد اكتساب النقاط
					</h2>
					<p className='text-sm text-gray-500'>كيفية حصول العملاء على النقاط</p>
				</div>

				<div className='p-6 space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>عدد النقاط لكل ريال</label>
							<input
								type='number'
								value={settings.earningRules.pointsPerRiyal}
								onChange={(e) => updateEarningRules('pointsPerRiyal', parseFloat(e.target.value))}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
								min='0.01'
								step='0.01'
							/>
							<p className='mt-1 text-xs text-gray-500'>
								عدد النقاط التي يكسبها العميل لكل ريال من المشتريات
							</p>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								الحد الأدنى لقيمة الطلب
							</label>
							<div className='flex items-center'>
								<input
									type='number'
									value={settings.earningRules.minimumOrderAmount}
									onChange={(e) => updateEarningRules('minimumOrderAmount', parseInt(e.target.value))}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
									min='0'
								/>
								<span className='mr-2 text-sm text-gray-700'>ريال</span>
							</div>
							<p className='mt-1 text-xs text-gray-500'>الحد الأدنى لقيمة الطلب للحصول على نقاط</p>
						</div>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>طريقة تقريب النقاط</label>
						<div className='relative inline-block w-full'>
							<select
								value={settings.earningRules.roundingMethod}
								onChange={(e) => updateEarningRules('roundingMethod', e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm pr-8'
							>
								<option value='up'>تقريب لأعلى</option>
								<option value='down'>تقريب لأسفل</option>
								<option value='nearest'>تقريب لأقرب عدد صحيح</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
						<p className='mt-1 text-xs text-gray-500'>كيفية تقريب النقاط عند وجود كسور</p>
					</div>

					<div className='space-y-4'>
						<ToggleSwitch
							enabled={settings.earningRules.excludeTax}
							onChange={(value) => updateEarningRules('excludeTax', value)}
							label='استثناء الضريبة من حساب النقاط'
							description='عند التفعيل، لن يتم احتساب قيمة الضريبة عند حساب النقاط المكتسبة'
						/>

						<ToggleSwitch
							enabled={settings.earningRules.excludeShipping}
							onChange={(value) => updateEarningRules('excludeShipping', value)}
							label='استثناء رسوم الشحن من حساب النقاط'
							description='عند التفعيل، لن يتم احتساب رسوم الشحن عند حساب النقاط المكتسبة'
						/>

						<ToggleSwitch
							enabled={settings.earningRules.excludeDiscounts}
							onChange={(value) => updateEarningRules('excludeDiscounts', value)}
							label='استثناء الخصومات من حساب النقاط'
							description='عند التفعيل، سيتم حساب النقاط على أساس السعر قبل الخصم'
						/>
					</div>

					<div className='bg-amber-50 border border-amber-200 rounded-md p-4'>
						<div className='flex items-start'>
							<Info className='h-5 w-5 text-amber-500 ml-2 mt-0.5' />
							<div>
								<p className='text-sm font-medium text-amber-800'>كيفية حساب النقاط</p>
								<p className='text-xs text-amber-700 mt-1'>
									يتم حساب النقاط كالتالي: (قيمة الطلب المؤهلة) × (عدد النقاط لكل ريال) = النقاط
									المكتسبة.
									<br />
									مثال: طلب بقيمة 200 ريال مع نقطة واحدة لكل ريال = 200 نقطة.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* إعدادات استبدال النقاط */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-6 border-b border-gray-200'>
					<h2 className='text-lg font-medium text-gray-900 flex items-center'>
						<Gift className='inline-block ml-2 h-5 w-5 text-amber-600' />
						إعدادات المكافآت واستبدال النقاط
					</h2>
					<p className='text-sm text-gray-500'>كيفية استبدال العملاء للنقاط</p>
				</div>

				<div className='p-6 space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								الحد الأدنى للنقاط للاستبدال
							</label>
							<input
								type='number'
								value={settings.redemption.minimumPointsToRedeem}
								onChange={(e) =>
									updateRedemptionSettings('minimumPointsToRedeem', parseInt(e.target.value))
								}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
								min='0'
							/>
							<p className='mt-1 text-xs text-gray-500'>
								الحد الأدنى لعدد النقاط التي يجب أن يمتلكها العميل قبل الاستبدال
							</p>
						</div>

						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>خطوة الاستبدال</label>
							<input
								type='number'
								value={settings.redemption.redemptionIncrement}
								onChange={(e) =>
									updateRedemptionSettings('redemptionIncrement', parseInt(e.target.value))
								}
								className='block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
								min='1'
							/>
							<p className='mt-1 text-xs text-gray-500'>
								العدد الذي يمكن استبدال النقاط به (مثلاً: مضاعفات 100)
							</p>
						</div>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-1'>الحد الأقصى لنسبة الخصم</label>
						<div className='flex items-center'>
							<input
								type='number'
								value={settings.redemption.maximumDiscountPercentage}
								onChange={(e) =>
									updateRedemptionSettings('maximumDiscountPercentage', parseInt(e.target.value))
								}
								className='block w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
								min='0'
								max='100'
							/>
							<span className='mr-2 text-sm text-gray-700'>٪</span>
						</div>
						<p className='mt-1 text-xs text-gray-500'>
							الحد الأقصى لنسبة الخصم التي يمكن تطبيقها على الطلب باستخدام النقاط
						</p>
					</div>

					<div className='space-y-4'>
						<ToggleSwitch
							enabled={settings.redemption.allowPartialRedemption}
							onChange={(value) => updateRedemptionSettings('allowPartialRedemption', value)}
							label='السماح بالاستبدال الجزئي'
							description='السماح للعملاء باستبدال جزء من النقاط للحصول على خصم جزئي'
						/>
					</div>

					<div className='bg-amber-50 border border-amber-200 rounded-md p-4'>
						<div className='flex items-start'>
							<AlertCircle className='h-5 w-5 text-amber-500 ml-2 mt-0.5' />
							<p className='text-sm text-amber-700'>
								يمكنك إنشاء وتخصيص مكافآت متنوعة للعملاء من خلال
								<Link
									href='/dashboard/marketing/loyalty/rewards/new'
									className='font-medium text-amber-800 mr-1 hover:underline'
								>
									إضافة مكافأة جديدة
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* إعدادات الإشعارات */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-6 border-b border-gray-200'>
					<h2 className='text-lg font-medium text-gray-900 flex items-center'>
						<Bell className='inline-block ml-2 h-5 w-5 text-amber-600' />
						إعدادات الإشعارات
					</h2>
					<p className='text-sm text-gray-500'>إعدادات الإشعارات المتعلقة ببرنامج الولاء</p>
				</div>

				<div className='p-6 space-y-6'>
					<div className='grid grid-cols-1 gap-4'>
						<ToggleSwitch
							enabled={settings.notifications.sendWelcomeEmail}
							onChange={(value) => updateNotificationSettings('sendWelcomeEmail', value)}
							label='إرسال بريد ترحيبي'
							description='إرسال بريد إلكتروني ترحيبي للعملاء عند الانضمام لبرنامج الولاء'
						/>

						<ToggleSwitch
							enabled={settings.notifications.sendPointsEarnedNotification}
							onChange={(value) => updateNotificationSettings('sendPointsEarnedNotification', value)}
							label='إشعار اكتساب النقاط'
							description='إرسال إشعار للعملاء عند اكتساب نقاط جديدة'
						/>

						<ToggleSwitch
							enabled={settings.notifications.sendPointsExpiringNotification}
							onChange={(value) => updateNotificationSettings('sendPointsExpiringNotification', value)}
							label='إشعار انتهاء صلاحية النقاط'
							description='إرسال إشعار للعملاء قبل انتهاء صلاحية نقاطهم'
						/>

						{settings.notifications.sendPointsExpiringNotification && (
							<div className='pr-10'>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									أيام التنبيه قبل انتهاء الصلاحية
								</label>
								<div className='flex items-center'>
									<input
										type='number'
										value={settings.notifications.pointsExpirationWarningDays}
										onChange={(e) =>
											updateNotificationSettings(
												'pointsExpirationWarningDays',
												parseInt(e.target.value)
											)
										}
										className='block w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
										min='1'
									/>
									<span className='mr-2 text-sm text-gray-700'>يوم</span>
								</div>
							</div>
						)}

						<ToggleSwitch
							enabled={settings.notifications.sendTierUpgradeNotification}
							onChange={(value) => updateNotificationSettings('sendTierUpgradeNotification', value)}
							label='إشعار ترقية الشريحة'
							description='إرسال إشعار للعملاء عند ترقية شريحة الولاء الخاصة بهم'
						/>
					</div>

					<div className='bg-blue-50 border border-blue-200 rounded-md p-4 mt-4'>
						<div className='flex items-start'>
							<Info className='h-5 w-5 text-blue-500 ml-2 mt-0.5' />
							<div>
								<p className='text-sm font-medium text-blue-800'>قنوات الإشعارات</p>
								<div className='text-xs text-blue-700 mt-1 flex flex-wrap gap-2'>
									<span className='inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800'>
										<Mail className='ml-1 h-3 w-3' />
										البريد الإلكتروني
									</span>
									<span className='inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800'>
										<MessageSquare className='ml-1 h-3 w-3' />
										الرسائل النصية
									</span>
									<span className='inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-800'>
										<Bell className='ml-1 h-3 w-3' />
										إشعارات التطبيق
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* إعدادات إضافية */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				<div className='p-6 border-b border-gray-200'>
					<h2 className='text-lg font-medium text-gray-900 flex items-center'>
						<Settings className='inline-block ml-2 h-5 w-5 text-amber-600' />
						إعدادات إضافية
					</h2>
					<p className='text-sm text-gray-500'>ميزات وإعدادات إضافية لبرنامج الولاء</p>
				</div>

				<div className='p-6 space-y-6'>
					<div className='space-y-4'>
						<ToggleSwitch
							enabled={settings.additionalSettings.displayInStorefront}
							onChange={(value) => updateAdditionalSettings('displayInStorefront', value)}
							label='عرض برنامج الولاء في المتجر'
							description='عرض معلومات برنامج الولاء والنقاط للعملاء في المتجر'
						/>

						<ToggleSwitch
							enabled={settings.additionalSettings.allowPointsTransfer}
							onChange={(value) => updateAdditionalSettings('allowPointsTransfer', value)}
							label='السماح بتحويل النقاط'
							description='السماح للعملاء بتحويل النقاط بين حساباتهم'
						/>
					</div>

					<div className='pt-4 border-t border-gray-200 space-y-6'>
						<div className='space-y-3'>
							<ToggleSwitch
								enabled={settings.additionalSettings.enableBirthdayBonus}
								onChange={(value) => updateAdditionalSettings('enableBirthdayBonus', value)}
								label='مكافأة عيد الميلاد'
								description='منح العملاء نقاط إضافية في عيد ميلادهم'
							/>

							{settings.additionalSettings.enableBirthdayBonus && (
								<div className='pr-10 mt-2'>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										عدد نقاط مكافأة عيد الميلاد
									</label>
									<input
										type='number'
										value={settings.additionalSettings.birthdayBonusPoints}
										onChange={(e) =>
											updateAdditionalSettings('birthdayBonusPoints', parseInt(e.target.value))
										}
										className='block w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
										min='1'
									/>
								</div>
							)}
						</div>

						<div className='space-y-3'>
							<ToggleSwitch
								enabled={settings.additionalSettings.enableReferralProgram}
								onChange={(value) => updateAdditionalSettings('enableReferralProgram', value)}
								label='برنامج الإحالة'
								description='منح العملاء نقاط عند إحالة أصدقاء جدد'
							/>

							{settings.additionalSettings.enableReferralProgram && (
								<div className='pr-10 mt-2'>
									<label className='block text-sm font-medium text-gray-700 mb-1'>نقاط الإحالة</label>
									<input
										type='number'
										value={settings.additionalSettings.referralPoints}
										onChange={(e) =>
											updateAdditionalSettings('referralPoints', parseInt(e.target.value))
										}
										className='block w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
										min='1'
									/>
								</div>
							)}
						</div>

						<div className='space-y-3'>
							<ToggleSwitch
								enabled={settings.additionalSettings.enablePointsForReviews}
								onChange={(value) => updateAdditionalSettings('enablePointsForReviews', value)}
								label='نقاط للتقييمات'
								description='منح العملاء نقاط عند كتابة تقييمات للمنتجات'
							/>

							{settings.additionalSettings.enablePointsForReviews && (
								<div className='pr-10 mt-2'>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										نقاط لكل تقييم
									</label>
									<input
										type='number'
										value={settings.additionalSettings.reviewPoints}
										onChange={(e) =>
											updateAdditionalSettings('reviewPoints', parseInt(e.target.value))
										}
										className='block w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-sm'
										min='1'
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
