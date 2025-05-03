'use client';

import {
	AlertCircle,
	Bell,
	CheckCircle,
	ChevronRight,
	CreditCard,
	FileText,
	Globe,
	Info,
	Mail,
	Map,
	Palette,
	Save,
	Settings,
	Smartphone,
	Truck,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface StoreSettings {
	general: {
		storeName: string;
		storeURL: string;
		storeEmail: string;
		customerSupport: string;
		country: string;
		city: string;
		address: string;
		vatNumber: string;
		logo: string;
		favicon: string;
		socialMedia: {
			facebook: string;
			instagram: string;
			twitter: string;
		};
	};
	appearance: {
		theme: 'light' | 'dark' | 'auto';
		primaryColor: string;
		accentColor: string;
		fontFamily: string;
		productDisplayMode: 'grid' | 'list';
		productsPerPage: number;
		enableQuickView: boolean;
		showRatings: boolean;
	};
	payment: {
		currency: string;
		currencySymbol: string;
		currencyPosition: 'before' | 'after';
		paymentGateways: {
			bank: boolean;
			cash: boolean;
			mada: boolean;
			visa: boolean;
			mastercard: boolean;
			applepay: boolean;
		};
		bankDetails: string;
	};
	shipping: {
		shippingMethods: {
			local: boolean;
			flatRate: boolean;
			freeShipping: boolean;
			pickup: boolean;
		};
		flatRateAmount: number;
		freeShippingMinAmount: number;
		deliveryTimeLocal: string;
		deliveryTimeFlatRate: string;
		pickupLocations: string[];
	};
	notifications: {
		newOrderEmail: boolean;
		newOrderSMS: boolean;
		lowStockAlert: boolean;
		lowStockThreshold: number;
		orderStatusUpdate: boolean;
		marketingEmails: boolean;
	};
}

export default function StoreSettingsPage() {
	const [activeTab, setActiveTab] = useState('general');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [settings, setSettings] = useState<StoreSettings | null>(null);
	const [changesMade, setChangesMade] = useState(false);
	const [saveSuccess, setSaveSuccess] = useState(false);

	// محاكاة استدعاء API للحصول على بيانات الإعدادات
	useEffect(() => {
		const fetchSettings = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// بيانات تجريبية للإعدادات
			const mockSettings: StoreSettings = {
				general: {
					storeName: 'أناقتي للأزياء',
					storeURL: 'anaqati.com',
					storeEmail: 'info@anaqati.com',
					customerSupport: '+966 53 123 4567',
					country: 'المملكة العربية السعودية',
					city: 'الرياض',
					address: 'حي الملقا، طريق أنس بن مالك',
					vatNumber: '310940283700003',
					logo: '/images/logo.png',
					favicon: '/images/favicon.ico',
					socialMedia: {
						facebook: 'facebook.com/anaqati',
						instagram: 'instagram.com/anaqati',
						twitter: 'twitter.com/anaqati',
					},
				},
				appearance: {
					theme: 'light',
					primaryColor: '#4F46E5',
					accentColor: '#10B981',
					fontFamily: 'Cairo',
					productDisplayMode: 'grid',
					productsPerPage: 12,
					enableQuickView: true,
					showRatings: true,
				},
				payment: {
					currency: 'SAR',
					currencySymbol: 'ر.س',
					currencyPosition: 'after',
					paymentGateways: {
						bank: true,
						cash: true,
						mada: true,
						visa: true,
						mastercard: true,
						applepay: false,
					},
					bankDetails: 'البنك السعودي المركزي\nرقم الحساب: SA123456789\nاسم صاحب الحساب: شركة أناقتي للأزياء',
				},
				shipping: {
					shippingMethods: {
						local: true,
						flatRate: true,
						freeShipping: true,
						pickup: false,
					},
					flatRateAmount: 25,
					freeShippingMinAmount: 300,
					deliveryTimeLocal: '2-3 أيام عمل',
					deliveryTimeFlatRate: '3-5 أيام عمل',
					pickupLocations: ['فرع الرياض - حي الملقا', 'فرع جدة - حي الروضة'],
				},
				notifications: {
					newOrderEmail: true,
					newOrderSMS: false,
					lowStockAlert: true,
					lowStockThreshold: 5,
					orderStatusUpdate: true,
					marketingEmails: false,
				},
			};

			setSettings(mockSettings);
			setLoading(false);
		};

		fetchSettings();
	}, []);

	// دالة لتحديث الإعدادات
	const updateSettings = (
		category: keyof StoreSettings,
		field: string,
		value: any,
		isNestedField: boolean = false,
		nestedField?: string
	) => {
		if (!settings) return;

		setSettings((prevSettings) => {
			if (!prevSettings) return prevSettings;

			const newSettings = { ...prevSettings };

			if (isNestedField && nestedField) {
				(newSettings[category] as any)[field][nestedField] = value;
			} else {
				(newSettings[category] as any)[field] = value;
			}

			return newSettings;
		});

		setChangesMade(true);
		setSaveSuccess(false);
	};

	// دالة لحفظ الإعدادات
	const saveSettings = async () => {
		if (!settings) return;

		setSaving(true);

		// محاكاة عملية الحفظ
		await new Promise((resolve) => setTimeout(resolve, 1000));

		setSaving(false);
		setChangesMade(false);
		setSaveSuccess(true);

		// إخفاء رسالة النجاح بعد 3 ثوان
		setTimeout(() => {
			setSaveSuccess(false);
		}, 3000);
	};

	// فحص إذا كانت هناك تغييرات لم تحفظ قبل مغادرة الصفحة
	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (changesMade) {
				e.preventDefault();
				e.returnValue = '';
				return '';
			}
		};

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
		};
	}, [changesMade]);

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
						<Settings className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						إعدادات المتجر
					</h1>
					<p className='mt-1 text-gray-500'>إدارة إعدادات وتكوين المتجر الإلكتروني</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<a
						href={`https://${settings?.general.storeURL}`}
						target='_blank'
						rel='noopener noreferrer'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<Globe className='ml-1 h-4 w-4' />
						زيارة المتجر
					</a>
					<button
						onClick={saveSettings}
						disabled={!changesMade || saving}
						className={`px-4 py-2 rounded-md flex items-center ${
							!changesMade
								? 'bg-gray-300 text-gray-500 cursor-not-allowed'
								: 'bg-indigo-600 text-white hover:bg-indigo-700'
						}`}
					>
						{saving ? (
							<>
								<span className='ml-1 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin'></span>
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
			{saveSuccess && (
				<div className='bg-green-50 border border-green-200 rounded-md p-3 flex items-center'>
					<CheckCircle className='h-5 w-5 text-green-500 ml-2' />
					<span className='text-green-800'>تم حفظ التغييرات بنجاح</span>
				</div>
			)}

			<div className='flex flex-col lg:flex-row gap-6'>
				{/* شريط التنقل الجانبي */}
				<div className='w-full lg:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit'>
					<nav className='space-y-1'>
						<button
							onClick={() => setActiveTab('general')}
							className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
								activeTab === 'general'
									? 'bg-indigo-50 text-indigo-700'
									: 'text-gray-700 hover:bg-gray-100'
							}`}
						>
							<Globe className='ml-2 h-5 w-5' />
							معلومات المتجر
							{activeTab === 'general' && <ChevronRight className='mr-auto h-5 w-5' />}
						</button>

						<button
							onClick={() => setActiveTab('appearance')}
							className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
								activeTab === 'appearance'
									? 'bg-indigo-50 text-indigo-700'
									: 'text-gray-700 hover:bg-gray-100'
							}`}
						>
							<Palette className='ml-2 h-5 w-5' />
							المظهر والتصميم
							{activeTab === 'appearance' && <ChevronRight className='mr-auto h-5 w-5' />}
						</button>

						<button
							onClick={() => setActiveTab('payment')}
							className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
								activeTab === 'payment'
									? 'bg-indigo-50 text-indigo-700'
									: 'text-gray-700 hover:bg-gray-100'
							}`}
						>
							<CreditCard className='ml-2 h-5 w-5' />
							طرق الدفع
							{activeTab === 'payment' && <ChevronRight className='mr-auto h-5 w-5' />}
						</button>

						<button
							onClick={() => setActiveTab('shipping')}
							className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
								activeTab === 'shipping'
									? 'bg-indigo-50 text-indigo-700'
									: 'text-gray-700 hover:bg-gray-100'
							}`}
						>
							<Truck className='ml-2 h-5 w-5' />
							طرق الشحن
							{activeTab === 'shipping' && <ChevronRight className='mr-auto h-5 w-5' />}
						</button>

						<button
							onClick={() => setActiveTab('notifications')}
							className={`flex items-center px-3 py-2 text-sm font-medium rounded-md w-full ${
								activeTab === 'notifications'
									? 'bg-indigo-50 text-indigo-700'
									: 'text-gray-700 hover:bg-gray-100'
							}`}
						>
							<Bell className='ml-2 h-5 w-5' />
							الإشعارات
							{activeTab === 'notifications' && <ChevronRight className='mr-auto h-5 w-5' />}
						</button>
					</nav>

					<div className='mt-6 border-t border-gray-200 pt-4'>
						<h3 className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-2'>
							إعدادات إضافية
						</h3>
						<nav className='space-y-1'>
							<Link
								href='/dashboard/ecommerce/settings/seo'
								className='flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100'
							>
								<Globe className='ml-2 h-5 w-5' />
								تحسين محركات البحث (SEO)
							</Link>

							<Link
								href='/dashboard/ecommerce/settings/tax'
								className='flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100'
							>
								<FileText className='ml-2 h-5 w-5' />
								الضرائب والرسوم
							</Link>

							<Link
								href='/dashboard/ecommerce/settings/legal'
								className='flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100'
							>
								<FileText className='ml-2 h-5 w-5' />
								الشروط والأحكام
							</Link>
						</nav>
					</div>
				</div>

				{/* محتوى الإعدادات */}
				<div className='flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
					{/* معلومات المتجر */}
					{activeTab === 'general' && settings && (
						<div className='space-y-6'>
							<h2 className='text-xl font-bold text-gray-900 border-b border-gray-200 pb-3'>
								معلومات المتجر
							</h2>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<label htmlFor='storeName' className='block text-sm font-medium text-gray-700 mb-1'>
										اسم المتجر <span className='text-red-500'>*</span>
									</label>
									<input
										type='text'
										id='storeName'
										value={settings.general.storeName}
										onChange={(e) => updateSettings('general', 'storeName', e.target.value)}
										className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
										placeholder='أدخل اسم المتجر'
										required
									/>
								</div>

								<div>
									<label htmlFor='storeURL' className='block text-sm font-medium text-gray-700 mb-1'>
										رابط المتجر <span className='text-red-500'>*</span>
									</label>
									<div className='flex'>
										<span className='inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm'>
											https://
										</span>
										<input
											type='text'
											id='storeURL'
											value={settings.general.storeURL}
											onChange={(e) => updateSettings('general', 'storeURL', e.target.value)}
											className='block w-full rounded-none rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
											placeholder='yourstore.com'
											required
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor='storeEmail'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										البريد الإلكتروني للمتجر <span className='text-red-500'>*</span>
									</label>
									<input
										type='email'
										id='storeEmail'
										value={settings.general.storeEmail}
										onChange={(e) => updateSettings('general', 'storeEmail', e.target.value)}
										className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
										placeholder='info@yourstore.com'
										required
									/>
								</div>

								<div>
									<label
										htmlFor='customerSupport'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										رقم خدمة العملاء
									</label>
									<input
										type='text'
										id='customerSupport'
										value={settings.general.customerSupport}
										onChange={(e) => updateSettings('general', 'customerSupport', e.target.value)}
										className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
										placeholder='+966 5X XXX XXXX'
									/>
								</div>

								<div>
									<label htmlFor='country' className='block text-sm font-medium text-gray-700 mb-1'>
										الدولة <span className='text-red-500'>*</span>
									</label>
									<select
										id='country'
										value={settings.general.country}
										onChange={(e) => updateSettings('general', 'country', e.target.value)}
										className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									>
										<option value='المملكة العربية السعودية'>المملكة العربية السعودية</option>
										<option value='الإمارات العربية المتحدة'>الإمارات العربية المتحدة</option>
										<option value='الكويت'>الكويت</option>
										<option value='البحرين'>البحرين</option>
										<option value='قطر'>قطر</option>
										<option value='عمان'>عمان</option>
									</select>
								</div>

								<div>
									<label htmlFor='city' className='block text-sm font-medium text-gray-700 mb-1'>
										المدينة <span className='text-red-500'>*</span>
									</label>
									<input
										type='text'
										id='city'
										value={settings.general.city}
										onChange={(e) => updateSettings('general', 'city', e.target.value)}
										className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
										placeholder='المدينة'
										required
									/>
								</div>
							</div>

							<div>
								<label htmlFor='address' className='block text-sm font-medium text-gray-700 mb-1'>
									العنوان <span className='text-red-500'>*</span>
								</label>
								<textarea
									id='address'
									value={settings.general.address}
									onChange={(e) => updateSettings('general', 'address', e.target.value)}
									className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									placeholder='أدخل عنوان المتجر التفصيلي'
									rows={2}
									required
								/>
							</div>

							<div>
								<label htmlFor='vatNumber' className='block text-sm font-medium text-gray-700 mb-1'>
									الرقم الضريبي
								</label>
								<input
									type='text'
									id='vatNumber'
									value={settings.general.vatNumber}
									onChange={(e) => updateSettings('general', 'vatNumber', e.target.value)}
									className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									placeholder='أدخل الرقم الضريبي'
								/>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>شعار المتجر</label>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center border border-gray-300'>
											<img
												src={settings.general.logo || '/placeholder-logo.png'}
												alt='شعار المتجر'
												className='h-12 w-12 object-contain'
											/>
										</div>
										<div className='mr-4'>
											<button className='bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'>
												تغيير الشعار
											</button>
											<p className='mt-1 text-xs text-gray-500'>
												PNG, JPG أو SVG. الحد الأقصى 1MB.
											</p>
										</div>
									</div>
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										أيقونة المتجر (Favicon)
									</label>
									<div className='flex items-center'>
										<div className='flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center border border-gray-300'>
											<img
												src={settings.general.favicon || '/placeholder-favicon.png'}
												alt='أيقونة المتجر'
												className='h-6 w-6 object-contain'
											/>
										</div>
										<div className='mr-4'>
											<button className='bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'>
												تغيير الأيقونة
											</button>
											<p className='mt-1 text-xs text-gray-500'>PNG أو ICO. يفضل 32x32 بكسل.</p>
										</div>
									</div>
								</div>
							</div>

							<div className='border-t border-gray-200 pt-4'>
								<h3 className='text-lg font-medium text-gray-900 mb-3'>حسابات التواصل الاجتماعي</h3>

								<div className='space-y-4'>
									<div className='flex items-center'>
										<div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 ml-3'>
											<svg
												className='w-5 h-5 text-white'
												fill='currentColor'
												viewBox='0 0 24 24'
												aria-hidden='true'
											>
												<path
													fillRule='evenodd'
													d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
													clipRule='evenodd'
												/>
											</svg>
										</div>
										<div className='flex-1'>
											<label
												htmlFor='facebook'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												فيسبوك
											</label>
											<div className='flex'>
												<span className='inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm'>
													facebook.com/
												</span>
												<input
													type='text'
													id='facebook'
													value={settings.general.socialMedia.facebook.replace(
														'facebook.com/',
														''
													)}
													onChange={(e) =>
														updateSettings(
															'general',
															'socialMedia',
															`facebook.com/${e.target.value}`,
															true,
															'facebook'
														)
													}
													className='block w-full rounded-none rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
													placeholder='yourstore'
												/>
											</div>
										</div>
									</div>

									<div className='flex items-center'>
										<div className='w-8 h-8 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 ml-3'>
											<svg
												className='w-5 h-5 text-white'
												fill='currentColor'
												viewBox='0 0 24 24'
												aria-hidden='true'
											>
												<path
													fillRule='evenodd'
													d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
													clipRule='evenodd'
												/>
											</svg>
										</div>
										<div className='flex-1'>
											<label
												htmlFor='instagram'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												انستغرام
											</label>
											<div className='flex'>
												<span className='inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm'>
													instagram.com/
												</span>
												<input
													type='text'
													id='instagram'
													value={settings.general.socialMedia.instagram.replace(
														'instagram.com/',
														''
													)}
													onChange={(e) =>
														updateSettings(
															'general',
															'socialMedia',
															`instagram.com/${e.target.value}`,
															true,
															'instagram'
														)
													}
													className='block w-full rounded-none rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
													placeholder='yourstore'
												/>
											</div>
										</div>
									</div>

									<div className='flex items-center'>
										<div className='w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0 ml-3'>
											<svg
												className='w-5 h-5 text-white'
												fill='currentColor'
												viewBox='0 0 24 24'
												aria-hidden='true'
											>
												<path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
											</svg>
										</div>
										<div className='flex-1'>
											<label
												htmlFor='twitter'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												تويتر
											</label>
											<div className='flex'>
												<span className='inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm'>
													twitter.com/
												</span>
												<input
													type='text'
													id='twitter'
													value={settings.general.socialMedia.twitter.replace(
														'twitter.com/',
														''
													)}
													onChange={(e) =>
														updateSettings(
															'general',
															'socialMedia',
															`twitter.com/${e.target.value}`,
															true,
															'twitter'
														)
													}
													className='block w-full rounded-none rounded-l-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
													placeholder='yourstore'
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* المظهر والتصميم */}
					{activeTab === 'appearance' && settings && (
						<div className='space-y-6'>
							<h2 className='text-xl font-bold text-gray-900 border-b border-gray-200 pb-3'>
								المظهر والتصميم
							</h2>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<label htmlFor='theme' className='block text-sm font-medium text-gray-700 mb-1'>
										السمة (Theme)
									</label>
									<select
										id='theme'
										value={settings.appearance.theme}
										onChange={(e) =>
											updateSettings(
												'appearance',
												'theme',
												e.target.value as 'light' | 'dark' | 'auto'
											)
										}
										className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									>
										<option value='light'>فاتح (Light)</option>
										<option value='dark'>داكن (Dark)</option>
										<option value='auto'>تلقائي (حسب إعدادات الجهاز)</option>
									</select>
								</div>

								<div>
									<label
										htmlFor='fontFamily'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										الخط
									</label>
									<select
										id='fontFamily'
										value={settings.appearance.fontFamily}
										onChange={(e) => updateSettings('appearance', 'fontFamily', e.target.value)}
										className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									>
										<option value='Cairo'>Cairo</option>
										<option value='Tajawal'>Tajawal</option>
										<option value='Almarai'>Almarai</option>
										<option value='Amiri'>Amiri</option>
										<option value='Markazi Text'>Markazi Text</option>
									</select>
								</div>

								<div>
									<label
										htmlFor='primaryColor'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										اللون الرئيسي
									</label>
									<div className='flex'>
										<input
											type='color'
											id='primaryColor'
											value={settings.appearance.primaryColor}
											onChange={(e) =>
												updateSettings('appearance', 'primaryColor', e.target.value)
											}
											className='h-10 w-10 rounded-l-md border border-gray-300 cursor-pointer'
										/>
										<input
											type='text'
											value={settings.appearance.primaryColor}
											onChange={(e) =>
												updateSettings('appearance', 'primaryColor', e.target.value)
											}
											className='flex-1 rounded-none rounded-l-none border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
											placeholder='#000000'
										/>
									</div>
								</div>

								<div>
									<label
										htmlFor='accentColor'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										اللون الثانوي
									</label>
									<div className='flex'>
										<input
											type='color'
											id='accentColor'
											value={settings.appearance.accentColor}
											onChange={(e) =>
												updateSettings('appearance', 'accentColor', e.target.value)
											}
											className='h-10 w-10 rounded-l-md border border-gray-300 cursor-pointer'
										/>
										<input
											type='text'
											value={settings.appearance.accentColor}
											onChange={(e) =>
												updateSettings('appearance', 'accentColor', e.target.value)
											}
											className='flex-1 rounded-none rounded-l-none border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
											placeholder='#000000'
										/>
									</div>
								</div>
							</div>

							<div className='border-t border-gray-200 pt-4'>
								<h3 className='text-lg font-medium text-gray-900 mb-3'>عرض المنتجات</h3>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									<div>
										<label
											htmlFor='productDisplayMode'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											طريقة عرض المنتجات
										</label>
										<div className='grid grid-cols-2 gap-3'>
											<div
												className={`border rounded-md p-3 cursor-pointer ${
													settings.appearance.productDisplayMode === 'grid'
														? 'border-indigo-500 bg-indigo-50'
														: 'border-gray-300 hover:border-gray-400'
												}`}
												onClick={() =>
													updateSettings('appearance', 'productDisplayMode', 'grid')
												}
											>
												<div className='grid grid-cols-3 gap-1 mb-2'>
													{[...Array(6)].map((_, i) => (
														<div
															key={i}
															className='aspect-w-1 aspect-h-1 bg-gray-300 rounded-sm'
														/>
													))}
												</div>
												<div className='text-center text-sm font-medium'>شبكة (Grid)</div>
											</div>

											<div
												className={`border rounded-md p-3 cursor-pointer ${
													settings.appearance.productDisplayMode === 'list'
														? 'border-indigo-500 bg-indigo-50'
														: 'border-gray-300 hover:border-gray-400'
												}`}
												onClick={() =>
													updateSettings('appearance', 'productDisplayMode', 'list')
												}
											>
												<div className='space-y-2 mb-2'>
													{[...Array(3)].map((_, i) => (
														<div key={i} className='flex'>
															<div className='w-1/4 aspect-w-1 aspect-h-1 bg-gray-300 rounded-sm' />
															<div className='w-3/4 mr-1 space-y-1'>
																<div className='h-2 bg-gray-300 rounded w-3/4' />
																<div className='h-2 bg-gray-300 rounded w-1/2' />
															</div>
														</div>
													))}
												</div>
												<div className='text-center text-sm font-medium'>قائمة (List)</div>
											</div>
										</div>
									</div>

									<div>
										<label
											htmlFor='productsPerPage'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											عدد المنتجات في الصفحة
										</label>
										<select
											id='productsPerPage'
											value={settings.appearance.productsPerPage}
											onChange={(e) =>
												updateSettings(
													'appearance',
													'productsPerPage',
													parseInt(e.target.value)
												)
											}
											className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
										>
											<option value='8'>8 منتجات</option>
											<option value='12'>12 منتج</option>
											<option value='16'>16 منتج</option>
											<option value='24'>24 منتج</option>
											<option value='32'>32 منتج</option>
										</select>
									</div>
								</div>

								<div className='mt-4 space-y-3'>
									<div className='flex items-center'>
										<input
											id='enableQuickView'
											type='checkbox'
											checked={settings.appearance.enableQuickView}
											onChange={(e) =>
												updateSettings('appearance', 'enableQuickView', e.target.checked)
											}
											className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
										/>
										<label htmlFor='enableQuickView' className='mr-2 block text-sm text-gray-700'>
											تفعيل خاصية العرض السريع للمنتجات
										</label>
									</div>

									<div className='flex items-center'>
										<input
											id='showRatings'
											type='checkbox'
											checked={settings.appearance.showRatings}
											onChange={(e) =>
												updateSettings('appearance', 'showRatings', e.target.checked)
											}
											className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
										/>
										<label htmlFor='showRatings' className='mr-2 block text-sm text-gray-700'>
											إظهار تقييمات المنتجات في صفحة المتجر
										</label>
									</div>
								</div>
							</div>

							<div className='border-t border-gray-200 pt-4'>
								<h3 className='text-lg font-medium text-gray-900 mb-3'>معاينة المظهر</h3>

								<div className='border rounded-md p-4 bg-gray-50'>
									<div className='grid grid-cols-3 gap-4 mb-4'>
										<div className='col-span-3 md:col-span-1'>
											<div
												className={`bg-white shadow rounded-md overflow-hidden border border-gray-200`}
											>
												<div className='aspect-w-1 aspect-h-1 bg-gray-200'>
													<div className='flex items-center justify-center text-gray-400'>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='h-12 w-12'
															fill='none'
															viewBox='0 0 24 24'
															stroke='currentColor'
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
															/>
														</svg>
													</div>
												</div>
												<div className='p-3'>
													<div
														className='font-medium'
														style={{ color: settings.appearance.primaryColor }}
													>
														ثوب كلاسيكي
													</div>
													<p className='text-gray-500 text-sm'>ثوب رجالي فاخر</p>
													<div className='mt-2 flex justify-between items-center'>
														<span
															className='font-bold'
															style={{ color: settings.appearance.accentColor }}
														>
															299 ر.س
														</span>
														{settings.appearance.showRatings && (
															<div className='flex items-center'>
																<svg
																	xmlns='http://www.w3.org/2000/svg'
																	className='h-4 w-4 text-yellow-500'
																	viewBox='0 0 20 20'
																	fill='currentColor'
																>
																	<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
																</svg>
																<span className='text-xs text-gray-600 mr-1'>4.5</span>
															</div>
														)}
													</div>
												</div>
											</div>
										</div>

										<div className='col-span-3 md:col-span-2'>
											<div className='bg-white shadow rounded-md p-4 border border-gray-200 flex flex-col h-full'>
												<h3
													className='text-lg font-bold mb-2'
													style={{ color: settings.appearance.primaryColor }}
												>
													معلومات المتجر
												</h3>
												<div className='text-sm text-gray-600 mb-3'>
													هذه معاينة توضيحية لمظهر المتجر باستخدام تنسيق الألوان والخطوط
													المحددة
												</div>
												<div className='mt-auto flex justify-between items-center'>
													<button
														className='py-2 px-4 rounded-md text-white text-sm'
														style={{ backgroundColor: settings.appearance.primaryColor }}
													>
														زر رئيسي
													</button>
													<button
														className='py-2 px-4 rounded-md text-white text-sm'
														style={{ backgroundColor: settings.appearance.accentColor }}
													>
														زر ثانوي
													</button>
												</div>
											</div>
										</div>
									</div>

									<div className='text-center text-sm text-gray-500'>
										المعاينة توضيحية فقط وقد تختلف عن المظهر الفعلي للمتجر
									</div>
								</div>
							</div>
						</div>
					)}

					{/* طرق الدفع */}
					{activeTab === 'payment' && settings && (
						<div className='space-y-6'>
							<h2 className='text-xl font-bold text-gray-900 border-b border-gray-200 pb-3'>طرق الدفع</h2>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<label htmlFor='currency' className='block text-sm font-medium text-gray-700 mb-1'>
										العملة <span className='text-red-500'>*</span>
									</label>
									<select
										id='currency'
										value={settings.payment.currency}
										onChange={(e) => updateSettings('payment', 'currency', e.target.value)}
										className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									>
										<option value='SAR'>ريال سعودي (SAR)</option>
										<option value='AED'>درهم إماراتي (AED)</option>
										<option value='KWD'>دينار كويتي (KWD)</option>
										<option value='BHD'>دينار بحريني (BHD)</option>
										<option value='QAR'>ريال قطري (QAR)</option>
										<option value='OMR'>ريال عماني (OMR)</option>
										<option value='USD'>دولار أمريكي (USD)</option>
									</select>
								</div>

								<div>
									<label
										htmlFor='currencySymbol'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										رمز العملة
									</label>
									<input
										type='text'
										id='currencySymbol'
										value={settings.payment.currencySymbol}
										onChange={(e) => updateSettings('payment', 'currencySymbol', e.target.value)}
										className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
										placeholder='ر.س'
									/>
								</div>

								<div>
									<label
										htmlFor='currencyPosition'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										موضع رمز العملة
									</label>
									<select
										id='currencyPosition'
										value={settings.payment.currencyPosition}
										onChange={(e) =>
											updateSettings(
												'payment',
												'currencyPosition',
												e.target.value as 'before' | 'after'
											)
										}
										className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
									>
										<option value='before'>قبل المبلغ (ر.س 100)</option>
										<option value='after'>بعد المبلغ (100 ر.س)</option>
									</select>
								</div>
							</div>

							<div className='border-t border-gray-200 pt-4'>
								<h3 className='text-lg font-medium text-gray-900 mb-3'>بوابات الدفع</h3>

								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='border rounded-md p-4 flex items-center'>
										<div className='flex h-12 w-12 ml-3 items-center justify-center bg-white rounded-md shadow-sm border border-gray-200'>
											<CreditCard className='h-6 w-6 text-indigo-600' />
										</div>
										<div className='flex-1'>
											<div className='flex items-center justify-between'>
												<label htmlFor='payment-card' className='font-medium'>
													بطاقات الائتمان
												</label>
												<input
													type='checkbox'
													id='payment-card'
													checked={
														settings.payment.paymentGateways.visa ||
														settings.payment.paymentGateways.mastercard
													}
													onChange={(e) => {
														updateSettings(
															'payment',
															'paymentGateways',
															e.target.checked,
															true,
															'visa'
														);
														updateSettings(
															'payment',
															'paymentGateways',
															e.target.checked,
															true,
															'mastercard'
														);
													}}
													className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
												/>
											</div>
											<div className='text-sm text-gray-500 mt-1'>
												قبول بطاقات Visa وMasterCard
											</div>
										</div>
									</div>

									<div className='border rounded-md p-4 flex items-center'>
										<div className='flex h-12 w-12 ml-3 items-center justify-center bg-white rounded-md shadow-sm border border-gray-200'>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 100 100'
												className='h-8 w-8'
											>
												<path
													fill='#00b1e4'
													d='M94.3,50c0,24.5-19.8,44.3-44.3,44.3C25.5,94.3,5.7,74.5,5.7,50C5.7,25.5,25.5,5.7,50,5.7C74.5,5.7,94.3,25.5,94.3,50z'
												/>
												<path
													fill='#fff'
													d='M30.5,46.1h38.9c0,0,4.2-0.3,4.2,3.5s0,9.1,0,9.1s0.2,2.5-2.6,2.5s-40.5,0-40.5,0s-3.8,0.4-3.8-3s0-8.7,0-8.7S26.3,46.1,30.5,46.1z'
												/>
												<path
													fill='#fff'
													d='M59.7,38.7h-19c0,0-3.2-0.1-3.2,2.9v0.9h28.8v-1.2C66.3,41.3,66.2,38.7,59.7,38.7z'
												/>
												<path
													fill='#fff'
													d='M59.9,61h-19c0,0-3.2,0.1-3.2,2.9v0.9h28.8v-1.2C66.5,63.5,66.5,61,59.9,61z'
												/>
											</svg>
										</div>
										<div className='flex-1'>
											<div className='flex items-center justify-between'>
												<label htmlFor='payment-mada' className='font-medium'>
													مدى (Mada)
												</label>
												<input
													type='checkbox'
													id='payment-mada'
													checked={settings.payment.paymentGateways.mada}
													onChange={(e) =>
														updateSettings(
															'payment',
															'paymentGateways',
															e.target.checked,
															true,
															'mada'
														)
													}
													className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
												/>
											</div>
											<div className='text-sm text-gray-500 mt-1'>قبول بطاقات مدى المحلية</div>
										</div>
									</div>

									<div className='border rounded-md p-4 flex items-center'>
										<div className='flex h-12 w-12 ml-3 items-center justify-center bg-white rounded-md shadow-sm border border-gray-200'>
											<svg viewBox='0 0 24 24' className='h-8 w-8'>
												<path d='M20.08 5.24C19.336 4.41 17.928 4 16.032 4H7.968C6.072 4 4.664 4.412 3.92 5.24C3.176 6.066 3 7.228 3 7.96v8.08c0 .736.176 1.898.92 2.724C4.664 19.59 6.072 20 7.968 20h8.064c1.896 0 3.304-.412 4.048-1.24C20.824 17.936 21 16.774 21 16.04V7.96c0-.732-.176-1.894-.92-2.72zM13.43 12.01c-.23.28-.45.528-.512.784-.036.152-.012.332.074.336.108.004.168-.084.23-.22.112-.256.178-.58.196-.768.004-.076-.078-.172-.146-.06-.036.048-.096.1-.142.16zM20 12H17.756c.328 1.176 1.532 2.244 2.288 3.02-1.428 2.496-4.444 3.764-7.228 3.428-3.064-.332-5.736-2.9-6.236-5.984-.5-3.08 1.152-6.892 4.428-7.6 1.74-.38 4.472.192 5.212 2.024.328.812-.256 1.044-.624.444-.508-.832-1.62-1.224-2.672-1.312-2.524-.104-4.488 1.804-4.92 4.016-.68 3.496 2.284 6.492 5.432 5.764 1.136-.292 2.176-.964 2.988-1.892-1.432-.144-2.56-1.452-2.7-2.968H9.78a.28.28 0 0 1-.28-.28v-.92a.28.28 0 0 1 .28-.28h3.5a.28.28 0 0 1 .28.28v.068c0 .812-1.428 1.3-2.424.864C11.48 10.38 11.82 8 14.94 7.416c2.292-.464 4.336.74 5.056 2.144.272.556.152.744-.368.468-1.02-.636-2.3-.928-3.536-.708-1.156.148-2.008.932-2.316 1.7h5.944a.28.28 0 0 1 .28.28v.92a.28.28 0 0 1-.28.28h.28z'></path>
											</svg>
										</div>
										<div className='flex-1'>
											<div className='flex items-center justify-between'>
												<label htmlFor='payment-applepay' className='font-medium'>
													Apple Pay
												</label>
												<input
													type='checkbox'
													id='payment-applepay'
													checked={settings.payment.paymentGateways.applepay}
													onChange={(e) =>
														updateSettings(
															'payment',
															'paymentGateways',
															e.target.checked,
															true,
															'applepay'
														)
													}
													className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
												/>
											</div>
											<div className='text-sm text-gray-500 mt-1'>
												تفعيل الدفع بواسطة Apple Pay
											</div>
										</div>
									</div>

									<div className='border rounded-md p-4 flex items-center'>
										<div className='flex h-12 w-12 ml-3 items-center justify-center bg-white rounded-md shadow-sm border border-gray-200'>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												viewBox='0 0 100 100'
												className='h-8 w-8'
											>
												<path
													d='M89,39V26.3c0-3.3-2.7-6.1-6.1-6.1H17.1c-3.3,0-6.1,2.7-6.1,6.1V39H89z'
													fill='#36404D'
												/>
												<path
													d='M11,45v28.7c0,3.3,2.7,6.1,6.1,6.1h65.8c3.3,0,6.1-2.7,6.1-6.1V45H11z'
													fill='#36404D'
												/>
												<path
													d='M66.2,73.8H33.8c-0.6,0-1.1-0.5-1.1-1.1V40.3c0-0.6,0.5-1.1,1.1-1.1h32.3c0.6,0,1.1,0.5,1.1,1.1v32.3 C67.2,73.3,66.8,73.8,66.2,73.8z'
													fill='#ECF0F1'
												/>
												<path
													d='M26.5,59.2h-6.2c-0.5,0-0.9-0.4-0.9-0.9v-1.6c0-0.5,0.4-0.9,0.9-0.9h6.2c0.5,0,0.9,0.4,0.9,0.9v1.6 C27.4,58.8,27,59.2,26.5,59.2z'
													fill='#ECF0F1'
												/>
												<path
													d='M79.8,59.2h-6.2c-0.5,0-0.9-0.4-0.9-0.9v-1.6c0-0.5,0.4-0.9,0.9-0.9h6.2c0.5,0,0.9,0.4,0.9,0.9v1.6 C80.7,58.8,80.3,59.2,79.8,59.2z'
													fill='#ECF0F1'
												/>
												<path
													d='M44.7,54h10.6c0.4,0,0.8,0.4,0.8,0.8v3.2c0,0.4-0.4,0.8-0.8,0.8H44.7c-0.4,0-0.8-0.4-0.8-0.8v-3.2 C43.9,54.3,44.3,54,44.7,54z'
													fill='#36404D'
												/>
											</svg>
										</div>
										<div className='flex-1'>
											<div className='flex items-center justify-between'>
												<label htmlFor='payment-bank' className='font-medium'>
													التحويل البنكي
												</label>
												<input
													type='checkbox'
													id='payment-bank'
													checked={settings.payment.paymentGateways.bank}
													onChange={(e) =>
														updateSettings(
															'payment',
															'paymentGateways',
															e.target.checked,
															true,
															'bank'
														)
													}
													className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
												/>
											</div>
											<div className='text-sm text-gray-500 mt-1'>
												قبول التحويلات البنكية المباشرة
											</div>
										</div>
									</div>

									<div className='border rounded-md p-4 flex items-center'>
										<div className='flex h-12 w-12 ml-3 items-center justify-center bg-white rounded-md shadow-sm border border-gray-200'>
											<svg
												xmlns='http://www.w3.org/2000/svg'
												className='h-6 w-6 text-green-600'
												fill='none'
												viewBox='0 0 24 24'
												stroke='currentColor'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z'
												/>
											</svg>
										</div>
										<div className='flex-1'>
											<div className='flex items-center justify-between'>
												<label htmlFor='payment-cash' className='font-medium'>
													الدفع عند الاستلام
												</label>
												<input
													type='checkbox'
													id='payment-cash'
													checked={settings.payment.paymentGateways.cash}
													onChange={(e) =>
														updateSettings(
															'payment',
															'paymentGateways',
															e.target.checked,
															true,
															'cash'
														)
													}
													className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
												/>
											</div>
											<div className='text-sm text-gray-500 mt-1'>
												قبول الدفع النقدي عند استلام الطلب
											</div>
										</div>
									</div>
								</div>
							</div>

							{settings.payment.paymentGateways.bank && (
								<div className='border-t border-gray-200 pt-4'>
									<h3 className='text-lg font-medium text-gray-900 mb-3'>تفاصيل الحساب البنكي</h3>

									<div>
										<label
											htmlFor='bankDetails'
											className='block text-sm font-medium text-gray-700 mb-1'
										>
											معلومات الحساب البنكي <span className='text-red-500'>*</span>
										</label>
										<textarea
											id='bankDetails'
											value={settings.payment.bankDetails}
											onChange={(e) => updateSettings('payment', 'bankDetails', e.target.value)}
											className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
											placeholder='أدخل معلومات الحساب البنكي الخاص بك'
											rows={4}
										/>
										<p className='mt-1 text-xs text-gray-500'>
											سيتم عرض هذه المعلومات للعملاء عند اختيار الدفع بالتحويل البنكي.
										</p>
									</div>
								</div>
							)}

							<div className='bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start mt-4'>
								<Info className='h-5 w-5 text-blue-500 mt-0.5 ml-2 flex-shrink-0' />
								<div>
									<h4 className='text-sm font-medium text-blue-800'>معلومات إضافية</h4>
									<p className='mt-1 text-sm text-blue-700'>
										للمزيد من خيارات الدفع المتقدمة ودمج بوابات الدفع الإضافية مثل Tap, PayPal, STC
										Pay وغيرها، يرجى زيارة
										<Link
											href='/dashboard/ecommerce/settings/payment-gateways'
											className='font-medium underline mr-1'
										>
											صفحة بوابات الدفع المتقدمة
										</Link>
										.
									</p>
								</div>
							</div>
						</div>
					)}

					{/* طرق الشحن */}
					{activeTab === 'shipping' && settings && (
						<div className='space-y-6'>
							<h2 className='text-xl font-bold text-gray-900 border-b border-gray-200 pb-3'>طرق الشحن</h2>

							<div className='grid grid-cols-1 gap-4'>
								<div className='border rounded-md p-4 flex items-center'>
									<div className='flex h-12 w-12 ml-3 items-center justify-center bg-white rounded-md shadow-sm border border-gray-200'>
										<Truck className='h-6 w-6 text-indigo-600' />
									</div>
									<div className='flex-1'>
										<div className='flex items-center justify-between'>
											<label htmlFor='shipping-local' className='font-medium'>
												الشحن المحلي
											</label>
											<input
												type='checkbox'
												id='shipping-local'
												checked={settings.shipping.shippingMethods.local}
												onChange={(e) =>
													updateSettings(
														'shipping',
														'shippingMethods',
														e.target.checked,
														true,
														'local'
													)
												}
												className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
											/>
										</div>
										<div className='text-sm text-gray-500 mt-1'>
											تكلفة الشحن حسب المنطقة (داخل المدينة/خارج المدينة)
										</div>

										{settings.shipping.shippingMethods.local && (
											<div className='mt-3'>
												<label
													htmlFor='deliveryTimeLocal'
													className='block text-sm font-medium text-gray-700 mb-1'
												>
													وقت التوصيل المتوقع
												</label>
												<input
													type='text'
													id='deliveryTimeLocal'
													value={settings.shipping.deliveryTimeLocal}
													onChange={(e) =>
														updateSettings('shipping', 'deliveryTimeLocal', e.target.value)
													}
													className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
													placeholder='مثال: 2-3 أيام عمل'
												/>
											</div>
										)}
									</div>
								</div>

								<div className='border rounded-md p-4 flex items-center'>
									<div className='flex h-12 w-12 ml-3 items-center justify-center bg-white rounded-md shadow-sm border border-gray-200'>
										<Truck className='h-6 w-6 text-amber-600' />
									</div>
									<div className='flex-1'>
										<div className='flex items-center justify-between'>
											<label htmlFor='shipping-flat' className='font-medium'>
												رسوم شحن ثابتة
											</label>
											<input
												type='checkbox'
												id='shipping-flat'
												checked={settings.shipping.shippingMethods.flatRate}
												onChange={(e) =>
													updateSettings(
														'shipping',
														'shippingMethods',
														e.target.checked,
														true,
														'flatRate'
													)
												}
												className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
											/>
										</div>
										<div className='text-sm text-gray-500 mt-1'>
											تطبيق رسوم شحن ثابتة على جميع الطلبات
										</div>

										{settings.shipping.shippingMethods.flatRate && (
											<div className='mt-3 grid grid-cols-2 gap-4'>
												<div>
													<label
														htmlFor='flatRateAmount'
														className='block text-sm font-medium text-gray-700 mb-1'
													>
														تكلفة الشحن الثابتة
													</label>
													<div className='relative rounded-md shadow-sm'>
														<input
															type='number'
															id='flatRateAmount'
															value={settings.shipping.flatRateAmount}
															onChange={(e) =>
																updateSettings(
																	'shipping',
																	'flatRateAmount',
																	parseFloat(e.target.value) || 0
																)
															}
															className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
															placeholder='25'
															min='0'
															step='0.01'
														/>
														<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
															<span className='text-gray-500 sm:text-sm'>
																{settings.payment.currencySymbol}
															</span>
														</div>
													</div>
												</div>

												<div>
													<label
														htmlFor='deliveryTimeFlatRate'
														className='block text-sm font-medium text-gray-700 mb-1'
													>
														وقت التوصيل المتوقع
													</label>
													<input
														type='text'
														id='deliveryTimeFlatRate'
														value={settings.shipping.deliveryTimeFlatRate}
														onChange={(e) =>
															updateSettings(
																'shipping',
																'deliveryTimeFlatRate',
																e.target.value
															)
														}
														className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
														placeholder='مثال: 3-5 أيام عمل'
													/>
												</div>
											</div>
										)}
									</div>
								</div>

								<div className='border rounded-md p-4 flex items-center'>
									<div className='flex h-12 w-12 ml-3 items-center justify-center bg-white rounded-md shadow-sm border border-gray-200'>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											className='h-6 w-6 text-green-600'
											fill='none'
											viewBox='0 0 24 24'
											stroke='currentColor'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
											/>
										</svg>
									</div>
									<div className='flex-1'>
										<div className='flex items-center justify-between'>
											<label htmlFor='shipping-free' className='font-medium'>
												الشحن المجاني
											</label>
											<input
												type='checkbox'
												id='shipping-free'
												checked={settings.shipping.shippingMethods.freeShipping}
												onChange={(e) =>
													updateSettings(
														'shipping',
														'shippingMethods',
														e.target.checked,
														true,
														'freeShipping'
													)
												}
												className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
											/>
										</div>
										<div className='text-sm text-gray-500 mt-1'>
											توفير شحن مجاني عند تجاوز قيمة الطلب لمبلغ معين
										</div>

										{settings.shipping.shippingMethods.freeShipping && (
											<div className='mt-3'>
												<label
													htmlFor='freeShippingMinAmount'
													className='block text-sm font-medium text-gray-700 mb-1'
												>
													الحد الأدنى للطلب للحصول على شحن مجاني
												</label>
												<div className='relative rounded-md shadow-sm'>
													<input
														type='number'
														id='freeShippingMinAmount'
														value={settings.shipping.freeShippingMinAmount}
														onChange={(e) =>
															updateSettings(
																'shipping',
																'freeShippingMinAmount',
																parseFloat(e.target.value) || 0
															)
														}
														className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
														placeholder='300'
														min='0'
														step='0.01'
													/>
													<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
														<span className='text-gray-500 sm:text-sm'>
															{settings.payment.currencySymbol}
														</span>
													</div>
												</div>
												<p className='mt-1 text-xs text-gray-500'>
													الطلبات التي تتجاوز هذا المبلغ ستحصل على شحن مجاني
												</p>
											</div>
										)}
									</div>
								</div>

								<div className='border rounded-md p-4 flex items-center'>
									<div className='flex h-12 w-12 ml-3 items-center justify-center bg-white rounded-md shadow-sm border border-gray-200'>
										<Map className='h-6 w-6 text-indigo-600' />
									</div>
									<div className='flex-1'>
										<div className='flex items-center justify-between'>
											<label htmlFor='shipping-pickup' className='font-medium'>
												استلام من المتجر
											</label>
											<input
												type='checkbox'
												id='shipping-pickup'
												checked={settings.shipping.shippingMethods.pickup}
												onChange={(e) =>
													updateSettings(
														'shipping',
														'shippingMethods',
														e.target.checked,
														true,
														'pickup'
													)
												}
												className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
											/>
										</div>
										<div className='text-sm text-gray-500 mt-1'>
											السماح للعملاء باستلام طلباتهم من فروع المتجر
										</div>

										{settings.shipping.shippingMethods.pickup && (
											<div className='mt-3'>
												<label className='block text-sm font-medium text-gray-700 mb-1'>
													مواقع الاستلام
												</label>
												<div className='space-y-2'>
													{settings.shipping.pickupLocations.map((location, index) => (
														<div key={index} className='flex'>
															<input
																type='text'
																value={location}
																onChange={(e) => {
																	const newLocations = [
																		...settings.shipping.pickupLocations,
																	];
																	newLocations[index] = e.target.value;
																	updateSettings(
																		'shipping',
																		'pickupLocations',
																		newLocations
																	);
																}}
																className='block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
																placeholder='عنوان الفرع'
															/>
															<button
																type='button'
																onClick={() => {
																	const newLocations = [
																		...settings.shipping.pickupLocations,
																	];
																	newLocations.splice(index, 1);
																	updateSettings(
																		'shipping',
																		'pickupLocations',
																		newLocations
																	);
																}}
																className='mr-2 text-red-600 hover:text-red-800'
															>
																<svg
																	xmlns='http://www.w3.org/2000/svg'
																	className='h-5 w-5'
																	fill='none'
																	viewBox='0 0 24 24'
																	stroke='currentColor'
																>
																	<path
																		strokeLinecap='round'
																		strokeLinejoin='round'
																		strokeWidth={2}
																		d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
																	/>
																</svg>
															</button>
														</div>
													))}
												</div>
												<button
													type='button'
													onClick={() => {
														const newLocations = [...settings.shipping.pickupLocations, ''];
														updateSettings('shipping', 'pickupLocations', newLocations);
													}}
													className='mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none'
												>
													<svg
														xmlns='http://www.w3.org/2000/svg'
														className='ml-1 h-4 w-4'
														fill='none'
														viewBox='0 0 24 24'
														stroke='currentColor'
													>
														<path
															strokeLinecap='round'
															strokeLinejoin='round'
															strokeWidth={2}
															d='M12 6v6m0 0v6m0-6h6m-6 0H6'
														/>
													</svg>
													إضافة موقع جديد
												</button>
											</div>
										)}
									</div>
								</div>
							</div>

							<div className='bg-yellow-50 border border-yellow-200 rounded-md p-3 flex items-start mt-4'>
								<AlertCircle className='h-5 w-5 text-yellow-500 mt-0.5 ml-2 flex-shrink-0' />
								<div>
									<h4 className='text-sm font-medium text-yellow-800'>ملاحظة هامة</h4>
									<p className='mt-1 text-sm text-yellow-700'>
										يجب تفعيل طريقة شحن واحدة على الأقل ليتمكن العملاء من إتمام عملية الشراء. إذا
										كنت ترغب في تكوين خيارات شحن متقدمة، يرجى زيارة
										<Link
											href='/dashboard/ecommerce/settings/shipping'
											className='font-medium underline mr-1'
										>
											صفحة إعدادات الشحن المتقدمة
										</Link>
										.
									</p>
								</div>
							</div>
						</div>
					)}

					{/* الإشعارات */}
					{activeTab === 'notifications' && settings && (
						<div className='space-y-6'>
							<h2 className='text-xl font-bold text-gray-900 border-b border-gray-200 pb-3'>
								إعدادات الإشعارات
							</h2>

							<div className='space-y-4'>
								<div className='border rounded-md p-4'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center'>
											<Mail className='h-5 w-5 text-indigo-600 ml-2' />
											<label
												htmlFor='newOrderEmail'
												className='text-base font-medium text-gray-900'
											>
												إشعارات البريد الإلكتروني
											</label>
										</div>
										<input
											type='checkbox'
											id='newOrderEmail'
											checked={settings.notifications.newOrderEmail}
											onChange={(e) =>
												updateSettings('notifications', 'newOrderEmail', e.target.checked)
											}
											className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
										/>
									</div>
									<p className='mt-1 text-sm text-gray-500 mr-7'>
										إرسال إشعارات البريد الإلكتروني عند استلام طلبات جديدة
									</p>
								</div>

								<div className='border rounded-md p-4'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center'>
											<Smartphone className='h-5 w-5 text-indigo-600 ml-2' />
											<label
												htmlFor='newOrderSMS'
												className='text-base font-medium text-gray-900'
											>
												إشعارات الرسائل النصية (SMS)
											</label>
										</div>
										<input
											type='checkbox'
											id='newOrderSMS'
											checked={settings.notifications.newOrderSMS}
											onChange={(e) =>
												updateSettings('notifications', 'newOrderSMS', e.target.checked)
											}
											className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
										/>
									</div>
									<p className='mt-1 text-sm text-gray-500 mr-7'>
										إرسال إشعارات SMS عند استلام طلبات جديدة
									</p>
									<div className='text-xs text-amber-500 mt-1 mr-7'>
										يتطلب تكوين خدمة الرسائل النصية (تكلفة إضافية)
									</div>
								</div>

								<div className='border rounded-md p-4'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center'>
											<Bell className='h-5 w-5 text-indigo-600 ml-2' />
											<label
												htmlFor='orderStatusUpdate'
												className='text-base font-medium text-gray-900'
											>
												تحديثات حالة الطلب
											</label>
										</div>
										<input
											type='checkbox'
											id='orderStatusUpdate'
											checked={settings.notifications.orderStatusUpdate}
											onChange={(e) =>
												updateSettings('notifications', 'orderStatusUpdate', e.target.checked)
											}
											className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
										/>
									</div>
									<p className='mt-1 text-sm text-gray-500 mr-7'>
										إرسال إشعارات للعملاء عند تغيير حالة طلباتهم
									</p>
								</div>

								<div className='border rounded-md p-4'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center'>
											<AlertCircle className='h-5 w-5 text-indigo-600 ml-2' />
											<label
												htmlFor='lowStockAlert'
												className='text-base font-medium text-gray-900'
											>
												تنبيهات انخفاض المخزون
											</label>
										</div>
										<input
											type='checkbox'
											id='lowStockAlert'
											checked={settings.notifications.lowStockAlert}
											onChange={(e) =>
												updateSettings('notifications', 'lowStockAlert', e.target.checked)
											}
											className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
										/>
									</div>
									<p className='mt-1 text-sm text-gray-500 mr-7'>
										إرسال تنبيهات عندما ينخفض مخزون المنتجات عن الحد الأدنى
									</p>

									{settings.notifications.lowStockAlert && (
										<div className='mt-3 mr-7'>
											<label
												htmlFor='lowStockThreshold'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												الحد الأدنى للمخزون
											</label>
											<input
												type='number'
												id='lowStockThreshold'
												value={settings.notifications.lowStockThreshold}
												onChange={(e) =>
													updateSettings(
														'notifications',
														'lowStockThreshold',
														parseInt(e.target.value) || 0
													)
												}
												className='block w-1/4 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
												placeholder='5'
												min='1'
											/>
											<p className='mt-1 text-xs text-gray-500'>
												سيتم إرسال تنبيه عندما يصل مخزون أي منتج إلى هذا الرقم أو أقل
											</p>
										</div>
									)}
								</div>

								<div className='border rounded-md p-4'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center'>
											<Mail className='h-5 w-5 text-indigo-600 ml-2' />
											<label
												htmlFor='marketingEmails'
												className='text-base font-medium text-gray-900'
											>
												رسائل البريد التسويقية
											</label>
										</div>
										<input
											type='checkbox'
											id='marketingEmails'
											checked={settings.notifications.marketingEmails}
											onChange={(e) =>
												updateSettings('notifications', 'marketingEmails', e.target.checked)
											}
											className='h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
										/>
									</div>
									<p className='mt-1 text-sm text-gray-500 mr-7'>
										إرسال رسائل بريد إلكتروني تسويقية للعملاء حول العروض والمنتجات الجديدة
									</p>
								</div>
							</div>

							<div className='border-t border-gray-200 pt-4'>
								<h3 className='text-lg font-medium text-gray-900 mb-3'>تكامل قنوات الإشعارات</h3>

								<div className='space-y-4'>
									<div className='border rounded-md p-4 bg-gray-50'>
										<div className='flex items-center'>
											<svg
												className='h-8 w-8 text-blue-500 ml-3'
												viewBox='0 0 24 24'
												fill='currentColor'
											>
												<path d='M22.258 1.33c-1.307-.254-2.693-.283-4.045-.08-2.659.313-5.224 1.205-7.326 2.749C8.81 5.538 7.257 7.395 6.266 9.572c-.503 1.169-.826 2.486-1.038 3.921-.146.595-.2 1.23-.255 1.86l-1.41-.422a1.15 1.15 0 0 0-1.128.249 1.15 1.15 0 0 0-.258 1.121l1.271 4.32c.102.317.349.575.667.692.28.102.613.079.872-.076L10 18.42c.322-.167.527-.486.57-.844a1.058 1.058 0 0 0-.527-.971l-1.627-.493c.06-.55.102-1.073.214-1.582.164-.779.349-1.57.637-2.3.826-2.024 2.18-3.66 3.945-4.822 1.773-1.17 3.925-1.850 6.148-1.936 1.102-.04 2.257.081 3.31.372.566.27.924.837.924 1.457v6.732c0 .681-.444 1.28-1.096 1.475-.764.24-1.695.293-2.616.159-1.21-.18-2.405-.637-3.349-1.277a1.596 1.596 0 0 0-1.902.128c-.512.42-.616 1.16-.267 1.734.391.581 1.2.757 1.828.572 1.257-.372 2.608-.422 3.883-.15 1.288.273 2.526.892 3.467 1.775.429.372.688.91.688 1.484V21c0 .272.219.5.5.5a.493.493 0 0 0 .498-.5V4.242c0-1.42-.92-2.661-2.258-3.013l.002.101z' />
											</svg>
											<div>
												<h4 className='text-base font-medium text-gray-900'>
													WhatsApp Business API
												</h4>
												<p className='text-sm text-gray-500'>
													إرسال تحديثات الطلبات وإشعارات المتجر عبر واتساب
												</p>
											</div>
											<Link
												href='/dashboard/ecommerce/settings/notifications/whatsapp'
												className='mr-auto px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm'
											>
												إعداد
											</Link>
										</div>
									</div>

									<div className='border rounded-md p-4 bg-gray-50'>
										<div className='flex items-center'>
											<svg
												className='h-8 w-8 text-blue-500 ml-3'
												viewBox='0 0 24 24'
												fill='currentColor'
											>
												<path d='M23.954 5.542a10.012 10.012 0 01-2.851.777 4.941 4.941 0 002.162-2.723 9.88 9.88 0 01-3.15 1.204 4.928 4.928 0 00-8.39 4.49A14 14 0 011.674 3.91a4.928 4.928 0 001.523 6.57 4.93 4.93 0 01-2.23-.616v.063a4.926 4.926 0 003.95 4.829 4.964 4.964 0 01-2.223.084 4.93 4.93 0 004.6 3.42A9.885 9.885 0 01.448 20.16 13.944 13.944 0 007.63 22c8.614 0 13.324-7.16 13.324-13.367 0-.203-.004-.405-.013-.607a9.554 9.554 0 002.347-2.436l.001-.048z' />
											</svg>
											<div>
												<h4 className='text-base font-medium text-gray-900'>Twitter</h4>
												<p className='text-sm text-gray-500'>
													إعلان المنتجات الجديدة والعروض عبر حساب المتجر
												</p>
											</div>
											<Link
												href='/dashboard/ecommerce/settings/notifications/twitter'
												className='mr-auto px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm'
											>
												إعداد
											</Link>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* ظل عند فتح لوحة المعلومات في الأجهزة الصغيرة (على سبيل المثال، الهواتف المحمولة) */}
			{changesMade && (
				<div className='fixed bottom-0 inset-x-0 md:hidden bg-white border-t border-gray-200 p-4 flex justify-between items-center'>
					<span className='text-sm font-medium text-gray-900'>لديك تغييرات غير محفوظة</span>
					<button
						onClick={saveSettings}
						disabled={saving}
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						{saving ? (
							<>
								<span className='ml-1 h-4 w-4 border-t-2 border-r-2 border-white rounded-full animate-spin'></span>
								حفظ
							</>
						) : (
							<>
								<Save className='ml-1 h-4 w-4' />
								حفظ
							</>
						)}
					</button>
				</div>
			)}
		</div>
	);
}
