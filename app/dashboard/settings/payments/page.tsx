'use client';

import {
	AlertCircle,
	ArrowLeft,
	CheckCircle,
	CreditCard,
	DollarSign,
	Edit,
	Eye,
	Globe,
	Percent,
	PlusCircle,
	Save,
	Shield,
	Smartphone,
	Trash,
	Upload,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PaymentMethod {
	id: number;
	name: string;
	type: 'card' | 'bank' | 'digital_wallet' | 'cash';
	isEnabled: boolean;
	isDefault: boolean;
	feePercentage: number;
	logo?: string;
	credentials?: {
		apiKey?: string;
		merchantId?: string;
		secretKey?: string;
		[key: string]: string | undefined;
	};
	settings?: {
		supportedCurrencies: string[];
		minAmount?: number;
		maxAmount?: number;
		[key: string]: any;
	};
}

interface TaxSetting {
	id: number;
	name: string;
	value: number;
	type: 'percentage' | 'fixed';
	isEnabled: boolean;
	appliesTo: 'all' | 'products' | 'shipping' | 'services';
}

export default function PaymentSettingsPage() {
	const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
	const [taxSettings, setTaxSettings] = useState<TaxSetting[]>([]);
	const [loading, setLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
	const [activeTab, setActiveTab] = useState<'methods' | 'taxes' | 'receipt'>('methods');
	const [showAddMethodModal, setShowAddMethodModal] = useState(false);
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

	// بيانات مثال للطرق الجديدة
	const availablePaymentMethods = [
		{ id: 'visa_master', name: 'بطاقات Visa/MasterCard', type: 'card', logo: '/logos/visa_master.png' },
		{ id: 'mada', name: 'مدى', type: 'card', logo: '/logos/mada.png' },
		{ id: 'stcpay', name: 'STC Pay', type: 'digital_wallet', logo: '/logos/stcpay.png' },
		{ id: 'apple_pay', name: 'Apple Pay', type: 'digital_wallet', logo: '/logos/apple_pay.png' },
		{ id: 'bank_transfer', name: 'تحويل بنكي', type: 'bank', logo: '/logos/bank.png' },
		{ id: 'cash', name: 'الدفع عند الاستلام', type: 'cash', logo: '/logos/cash.png' },
	];

	// نموذج إضافة طريقة دفع جديدة
	const [newMethod, setNewMethod] = useState({
		type: '',
		name: '',
		feePercentage: 0,
		isEnabled: true,
		isDefault: false,
	});

	// نموذج إضافة ضريبة جديدة
	const [newTax, setNewTax] = useState({
		name: '',
		value: 0,
		type: 'percentage',
		isEnabled: true,
		appliesTo: 'all',
	});

	// تحميل البيانات
	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				// محاكاة استدعاء API
				await new Promise((resolve) => setTimeout(resolve, 1000));

				// بيانات تجريبية لطرق الدفع
				const mockPaymentMethods: PaymentMethod[] = [
					{
						id: 1,
						name: 'مدى',
						type: 'card',
						isEnabled: true,
						isDefault: true,
						feePercentage: 2.5,
						logo: '/logos/mada.png',
						credentials: {
							apiKey: 'mk_test_12345678901234567890',
							merchantId: 'MERCHANT_12345',
							secretKey: 'sk_test_12345678901234567890',
						},
						settings: {
							supportedCurrencies: ['SAR'],
							minAmount: 5,
							maxAmount: 20000,
						},
					},
					{
						id: 2,
						name: 'فيزا / ماستركارد',
						type: 'card',
						isEnabled: true,
						isDefault: false,
						feePercentage: 2.9,
						logo: '/logos/visa_master.png',
						credentials: {
							apiKey: 'mk_test_98765432109876543210',
							merchantId: 'MERCHANT_67890',
							secretKey: 'sk_test_98765432109876543210',
						},
						settings: {
							supportedCurrencies: ['SAR', 'USD', 'EUR'],
							minAmount: 5,
						},
					},
					{
						id: 3,
						name: 'تحويل بنكي',
						type: 'bank',
						isEnabled: true,
						isDefault: false,
						feePercentage: 0,
						settings: {
							supportedCurrencies: ['SAR'],
							bankDetails: {
								bankName: 'البنك الأهلي السعودي',
								accountName: 'شركة ثوب ماستر',
								iban: 'SA123456789012345678901234',
								swiftCode: 'NCBKSAJE',
							},
						},
					},
					{
						id: 4,
						name: 'الدفع عند الاستلام',
						type: 'cash',
						isEnabled: true,
						isDefault: false,
						feePercentage: 15,
						settings: {
							supportedCurrencies: ['SAR'],
							maxAmount: 5000,
						},
					},
				];

				// بيانات تجريبية للضرائب
				const mockTaxSettings: TaxSetting[] = [
					{
						id: 1,
						name: 'ضريبة القيمة المضافة',
						value: 15,
						type: 'percentage',
						isEnabled: true,
						appliesTo: 'all',
					},
					{
						id: 2,
						name: 'رسوم الشحن',
						value: 25,
						type: 'fixed',
						isEnabled: true,
						appliesTo: 'shipping',
					},
				];

				setPaymentMethods(mockPaymentMethods);
				setTaxSettings(mockTaxSettings);
			} catch (error) {
				console.error('Error fetching payment settings:', error);
				setNotification({
					message: 'حدث خطأ أثناء تحميل البيانات',
					type: 'error',
				});
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// تفعيل/تعطيل طريقة الدفع
	const togglePaymentMethod = (id: number) => {
		setPaymentMethods((prevMethods) =>
			prevMethods.map((method) => (method.id === id ? { ...method, isEnabled: !method.isEnabled } : method))
		);
	};

	// تعيين طريقة الدفع كافتراضية
	const setDefaultPaymentMethod = (id: number) => {
		setPaymentMethods((prevMethods) =>
			prevMethods.map((method) => ({
				...method,
				isDefault: method.id === id,
			}))
		);
	};

	// حذف طريقة دفع
	const deletePaymentMethod = (id: number) => {
		setPaymentMethods((prevMethods) => prevMethods.filter((method) => method.id !== id));
	};

	// تفعيل/تعطيل ضريبة
	const toggleTaxSetting = (id: number) => {
		setTaxSettings((prevTaxes) =>
			prevTaxes.map((tax) => (tax.id === id ? { ...tax, isEnabled: !tax.isEnabled } : tax))
		);
	};

	// إضافة طريقة دفع جديدة
	const handleAddPaymentMethod = () => {
		// محاكاة إضافة طريقة دفع جديدة بمعرف جديد
		const newId = Math.max(0, ...paymentMethods.map((m) => m.id)) + 1;

		const method: PaymentMethod = {
			id: newId,
			name: newMethod.name,
			type: newMethod.type as any,
			isEnabled: newMethod.isEnabled,
			isDefault: newMethod.isDefault,
			feePercentage: newMethod.feePercentage,
			settings: {
				supportedCurrencies: ['SAR'],
			},
		};

		setPaymentMethods([...paymentMethods, method]);

		// إعادة تعيين النموذج
		setNewMethod({
			type: '',
			name: '',
			feePercentage: 0,
			isEnabled: true,
			isDefault: false,
		});

		setShowAddMethodModal(false);
	};

	// إضافة ضريبة جديدة
	const handleAddTaxSetting = () => {
		// محاكاة إضافة ضريبة جديدة بمعرف جديد
		const newId = Math.max(0, ...taxSettings.map((t) => t.id)) + 1;

		const tax: TaxSetting = {
			id: newId,
			name: newTax.name,
			value: newTax.value,
			type: newTax.type as 'percentage' | 'fixed',
			isEnabled: newTax.isEnabled,
			appliesTo: newTax.appliesTo as 'all' | 'products' | 'shipping' | 'services',
		};

		setTaxSettings([...taxSettings, tax]);

		// إعادة تعيين النموذج
		setNewTax({
			name: '',
			value: 0,
			type: 'percentage',
			isEnabled: true,
			appliesTo: 'all',
		});
	};

	// حفظ الإعدادات
	const handleSave = async () => {
		setIsSaving(true);
		try {
			// محاكاة استدعاء API
			await new Promise((resolve) => setTimeout(resolve, 1500));

			// إظهار إشعار النجاح
			setNotification({
				message: 'تم حفظ إعدادات الدفع بنجاح',
				type: 'success',
			});

			setTimeout(() => {
				setNotification(null);
			}, 3000);
		} catch (error) {
			console.error('Error saving payment settings:', error);
			setNotification({
				message: 'حدث خطأ أثناء حفظ الإعدادات',
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	// الحصول على أيقونة طريقة الدفع حسب النوع
	const getPaymentMethodIcon = (type: string) => {
		switch (type) {
			case 'card':
				return <CreditCard className='h-5 w-5' />;
			case 'bank':
				return <Smartphone className='h-5 w-5' />;
			case 'digital_wallet':
				return <Smartphone className='h-5 w-5' />;
			case 'cash':
				return <DollarSign className='h-5 w-5' />;
			default:
				return <CreditCard className='h-5 w-5' />;
		}
	};

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<CreditCard className='ml-2 h-6 w-6 text-gray-600' /> إعدادات المدفوعات
					</h1>
					<p className='mt-1 text-sm text-gray-600'>إدارة طرق الدفع والضرائب وإعدادات الفواتير</p>
				</div>

				<div className='flex space-x-2 space-x-reverse'>
					<Link
						href='/dashboard/settings'
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'
					>
						<ArrowLeft className='ml-1 h-4 w-4' />
						العودة للإعدادات
					</Link>

					<button
						onClick={handleSave}
						disabled={isSaving}
						className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center disabled:bg-green-300 disabled:cursor-not-allowed'
					>
						{isSaving ? (
							<>
								<span className='animate-spin h-4 w-4 ml-1 border-2 border-t-transparent border-white rounded-full'></span>
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

			{/* تنبيه هام */}
			<div className='bg-blue-50 border border-blue-200 rounded-md p-4'>
				<div className='flex'>
					<AlertCircle className='h-5 w-5 text-blue-400 ml-2 flex-shrink-0' />
					<div>
						<h3 className='text-sm font-medium text-blue-800'>معلومات هامة</h3>
						<p className='text-sm text-blue-700 mt-1'>
							تغيير إعدادات المدفوعات قد يؤثر على سير عمليات الدفع في المتجر. يُرجى التأكد من صحة
							المعلومات قبل الحفظ.
						</p>
					</div>
				</div>
			</div>

			{/* تبويبات */}
			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='border-b border-gray-200'>
					<nav className='-mb-px flex'>
						<button
							onClick={() => setActiveTab('methods')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'methods'
									? 'border-b-2 border-green-500 text-green-600'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<CreditCard className='inline-block ml-1 h-5 w-5' />
							طرق الدفع
						</button>

						<button
							onClick={() => setActiveTab('taxes')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'taxes'
									? 'border-b-2 border-green-500 text-green-600'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Percent className='inline-block ml-1 h-5 w-5' />
							الضرائب والرسوم
						</button>

						<button
							onClick={() => setActiveTab('receipt')}
							className={`py-4 px-6 text-sm font-medium whitespace-nowrap ${
								activeTab === 'receipt'
									? 'border-b-2 border-green-500 text-green-600'
									: 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
							}`}
						>
							<Smartphone className='inline-block ml-1 h-5 w-5' />
							إعدادات الفواتير
						</button>
					</nav>
				</div>

				<div className='p-6'>
					{/* محتوى تبويب طرق الدفع */}
					{activeTab === 'methods' && (
						<div>
							<div className='flex justify-between items-center mb-6'>
								<h2 className='text-lg font-medium text-gray-900'>طرق الدفع المتاحة</h2>
								<button
									onClick={() => setShowAddMethodModal(true)}
									className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none flex items-center'
								>
									<PlusCircle className='ml-1 h-4 w-4' />
									إضافة طريقة دفع
								</button>
							</div>

							{loading ? (
								<div className='text-center py-10'>
									<div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500'></div>
									<p className='mt-2 text-sm text-gray-500'>جاري تحميل طرق الدفع...</p>
								</div>
							) : paymentMethods.length === 0 ? (
								<div className='text-center py-10 bg-gray-50 rounded-lg border border-gray-200'>
									<CreditCard className='mx-auto h-12 w-12 text-gray-400' />
									<h3 className='mt-2 text-sm font-medium text-gray-900'>لا توجد طرق دفع</h3>
									<p className='mt-1 text-sm text-gray-500'>لم يتم إضافة أي طرق دفع بعد.</p>
									<div className='mt-6'>
										<button
											onClick={() => setShowAddMethodModal(true)}
											className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none'
										>
											<PlusCircle className='ml-1 h-4 w-4' />
											إضافة طريقة دفع
										</button>
									</div>
								</div>
							) : (
								<div className='space-y-4'>
									{paymentMethods.map((method) => (
										<div
											key={method.id}
											className={`border ${
												method.isEnabled ? 'border-gray-200' : 'border-gray-200 bg-gray-50'
											} rounded-lg p-4 transition-all`}
										>
											<div className='flex flex-col sm:flex-row justify-between'>
												<div className='flex items-start mb-4 sm:mb-0'>
													<div className='flex-shrink-0 p-2 bg-gray-100 rounded-md'>
														{getPaymentMethodIcon(method.type)}
													</div>
													<div className='mr-3'>
														<div className='flex items-center'>
															<h3 className='text-lg font-medium text-gray-900'>
																{method.name}
															</h3>
															{method.isDefault && (
																<span className='mr-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-800'>
																	افتراضي
																</span>
															)}
															{!method.isEnabled && (
																<span className='mr-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800'>
																	معطل
																</span>
															)}
														</div>
														<p className='mt-1 text-sm text-gray-500'>
															{method.feePercentage > 0
																? `رسوم الخدمة: ${method.feePercentage}٪`
																: 'بدون رسوم إضافية'}
														</p>
														{method.settings?.supportedCurrencies && (
															<div className='mt-1 flex items-center'>
																<Globe className='h-3 w-3 text-gray-400 ml-1' />
																<span className='text-xs text-gray-500'>
																	{method.settings.supportedCurrencies.join(', ')}
																</span>
															</div>
														)}
													</div>
												</div>

												<div className='flex items-center space-x-2 space-x-reverse'>
													<button
														onClick={() => setSelectedMethod(method)}
														className='p-1.5 text-gray-500 hover:text-gray-700 rounded-md'
														title='عرض التفاصيل'
													>
														<Eye className='h-5 w-5' />
													</button>
													<button
														onClick={() => togglePaymentMethod(method.id)}
														className={`p-1.5 hover:bg-gray-100 rounded-md ${
															method.isEnabled ? 'text-green-600' : 'text-gray-500'
														}`}
														title={method.isEnabled ? 'تعطيل' : 'تفعيل'}
													>
														{method.isEnabled ? (
															<CheckCircle className='h-5 w-5' />
														) : (
															<X className='h-5 w-5' />
														)}
													</button>
													{!method.isDefault && (
														<button
															onClick={() => setDefaultPaymentMethod(method.id)}
															className='p-1.5 text-blue-600 hover:bg-blue-50 rounded-md'
															title='تعيين كافتراضي'
														>
															<Smartphone className='h-5 w-5' />
														</button>
													)}
													<button
														onClick={() => deletePaymentMethod(method.id)}
														className='p-1.5 text-red-600 hover:bg-red-50 rounded-md'
														title='حذف'
													>
														<Trash className='h-5 w-5' />
													</button>
												</div>
											</div>

											{method.settings && (
												<div className='mt-3 pt-3 border-t border-gray-100'>
													<div className='flex items-center text-sm text-gray-500'>
														{method.settings.minAmount && (
															<div className='ml-4'>
																<span className='font-medium'>الحد الأدنى:</span>{' '}
																{method.settings.minAmount} ريال
															</div>
														)}
														{method.settings.maxAmount && (
															<div>
																<span className='font-medium'>الحد الأقصى:</span>{' '}
																{method.settings.maxAmount} ريال
															</div>
														)}
													</div>
												</div>
											)}
										</div>
									))}
								</div>
							)}

							<div className='mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200'>
								<h3 className='text-sm font-medium text-gray-900 mb-2'>إعدادات متقدمة</h3>
								<div className='space-y-3'>
									<div className='flex items-center justify-between'>
										<div className='flex items-center'>
											<Shield className='h-5 w-5 text-gray-400 ml-2' />
											<div>
												<p className='text-sm font-medium text-gray-700'>
													تفعيل التحقق الثنائي للمدفوعات (3D Secure)
												</p>
												<p className='text-xs text-gray-500'>
													زيادة أمان المدفوعات بالبطاقات الائتمانية
												</p>
											</div>
										</div>
										<label className='relative inline-flex items-center cursor-pointer'>
											<input type='checkbox' checked={true} className='sr-only peer' />
											<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
										</label>
									</div>

									<div className='flex items-center justify-between'>
										<div className='flex items-center'>
											<CreditCard className='h-5 w-5 text-gray-400 ml-2' />
											<div>
												<p className='text-sm font-medium text-gray-700'>
													حفظ بطاقات الدفع للمستخدمين
												</p>
												<p className='text-xs text-gray-500'>
													تمكين العملاء من حفظ بيانات البطاقات لعمليات الدفع المستقبلية
												</p>
											</div>
										</div>
										<label className='relative inline-flex items-center cursor-pointer'>
											<input type='checkbox' checked={true} className='sr-only peer' />
											<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
										</label>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* تبويب الضرائب والرسوم */}
					{activeTab === 'taxes' && (
						<div>
							<div className='flex justify-between items-center mb-6'>
								<h2 className='text-lg font-medium text-gray-900'>إعدادات الضرائب والرسوم</h2>
							</div>

							{loading ? (
								<div className='text-center py-10'>
									<div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500'></div>
									<p className='mt-2 text-sm text-gray-500'>جاري تحميل إعدادات الضرائب...</p>
								</div>
							) : (
								<div className='space-y-6'>
									<div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
										<h3 className='text-sm font-medium text-gray-900 mb-4'>
											الضرائب والرسوم المطبقة
										</h3>

										{taxSettings.length === 0 ? (
											<p className='text-sm text-gray-500 text-center py-4'>
												لا توجد ضرائب أو رسوم مضافة
											</p>
										) : (
											<div className='space-y-3'>
												{taxSettings.map((tax) => (
													<div
														key={tax.id}
														className='flex items-center justify-between py-2 border-b border-gray-200 last:border-0'
													>
														<div>
															<div className='flex items-center'>
																<h4 className='text-sm font-medium text-gray-900'>
																	{tax.name}
																</h4>
																{!tax.isEnabled && (
																	<span className='mr-2 px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800'>
																		معطل
																	</span>
																)}
															</div>
															<div className='flex items-center mt-1'>
																<p className='text-sm text-gray-500'>
																	{tax.type === 'percentage'
																		? `${tax.value}٪`
																		: `${tax.value} ريال`}
																</p>
																<span className='mx-2 text-gray-300'>•</span>
																<p className='text-xs text-gray-500'>
																	{tax.appliesTo === 'all' &&
																		'يطبق على: جميع المنتجات والخدمات'}
																	{tax.appliesTo === 'products' &&
																		'يطبق على: المنتجات فقط'}
																	{tax.appliesTo === 'services' &&
																		'يطبق على: الخدمات فقط'}
																	{tax.appliesTo === 'shipping' &&
																		'يطبق على: خدمات الشحن فقط'}
																</p>
															</div>
														</div>

														<div className='flex items-center space-x-2 space-x-reverse'>
															<button
																onClick={() => toggleTaxSetting(tax.id)}
																className={`p-1.5 hover:bg-gray-100 rounded-md ${
																	tax.isEnabled ? 'text-green-600' : 'text-gray-500'
																}`}
																title={tax.isEnabled ? 'تعطيل' : 'تفعيل'}
															>
																{tax.isEnabled ? (
																	<CheckCircle className='h-5 w-5' />
																) : (
																	<X className='h-5 w-5' />
																)}
															</button>
															<button
																className='p-1.5 text-blue-600 hover:bg-blue-50 rounded-md'
																title='تعديل'
															>
																<Edit className='h-5 w-5' />
															</button>
															<button
																className='p-1.5 text-red-600 hover:bg-red-50 rounded-md'
																title='حذف'
															>
																<Trash className='h-5 w-5' />
															</button>
														</div>
													</div>
												))}
											</div>
										)}

										<div className='mt-4 pt-4 border-t border-gray-200'>
											<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
												<div>
													<label
														htmlFor='tax-name'
														className='block text-sm font-medium text-gray-700 mb-1'
													>
														اسم الضريبة أو الرسوم
													</label>
													<input
														type='text'
														id='tax-name'
														value={newTax.name}
														onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
														placeholder='مثال: ضريبة القيمة المضافة'
														className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
													/>
												</div>

												<div>
													<label
														htmlFor='tax-value'
														className='block text-sm font-medium text-gray-700 mb-1'
													>
														القيمة
													</label>
													<div className='relative rounded-md shadow-sm'>
														<input
															type='number'
															id='tax-value'
															value={newTax.value}
															onChange={(e) =>
																setNewTax({
																	...newTax,
																	value: parseFloat(e.target.value) || 0,
																})
															}
															className='block w-full rounded-md border-gray-300 pr-12 focus:border-green-500 focus:ring-green-500 sm:text-sm'
														/>
														<div className='absolute inset-y-0 left-0 flex items-center'>
															<select
																id='tax-type'
																value={newTax.type}
																onChange={(e) =>
																	setNewTax({ ...newTax, type: e.target.value })
																}
																className='h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-green-500 focus:ring-green-500 sm:text-sm'
															>
																<option value='percentage'>٪</option>
																<option value='fixed'>ريال</option>
															</select>
														</div>
													</div>
												</div>

												<div>
													<label
														htmlFor='tax-applies-to'
														className='block text-sm font-medium text-gray-700 mb-1'
													>
														يطبق على
													</label>
													<select
														id='tax-applies-to'
														value={newTax.appliesTo}
														onChange={(e) =>
															setNewTax({ ...newTax, appliesTo: e.target.value })
														}
														className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
													>
														<option value='all'>جميع المنتجات والخدمات</option>
														<option value='products'>المنتجات فقط</option>
														<option value='services'>الخدمات فقط</option>
														<option value='shipping'>خدمات الشحن فقط</option>
													</select>
												</div>

												<div className='flex items-end'>
													<button
														onClick={handleAddTaxSetting}
														disabled={!newTax.name}
														className='w-full px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none disabled:bg-green-300 disabled:cursor-not-allowed'
													>
														<PlusCircle className='inline-block ml-1 h-4 w-4' />
														إضافة ضريبة جديدة
													</button>
												</div>
											</div>
										</div>
									</div>

									<div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
										<h3 className='text-sm font-medium text-gray-900 mb-4'>إعدادات عامة للضرائب</h3>

										<div className='space-y-4'>
											<div className='flex items-center justify-between'>
												<div>
													<p className='text-sm font-medium text-gray-700'>
														عرض الأسعار شاملة الضريبة
													</p>
													<p className='text-xs text-gray-500'>
														عرض أسعار المنتجات متضمنة الضرائب في صفحات المتجر
													</p>
												</div>
												<label className='relative inline-flex items-center cursor-pointer'>
													<input type='checkbox' checked={true} className='sr-only peer' />
													<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
												</label>
											</div>

											<div className='flex items-center justify-between'>
												<div>
													<p className='text-sm font-medium text-gray-700'>
														تفصيل الضرائب في الفاتورة
													</p>
													<p className='text-xs text-gray-500'>
														إظهار تفاصيل كل ضريبة ورسوم في الفاتورة بشكل منفصل
													</p>
												</div>
												<label className='relative inline-flex items-center cursor-pointer'>
													<input type='checkbox' checked={true} className='sr-only peer' />
													<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
												</label>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)}

					{/* تبويب إعدادات الفواتير */}
					{activeTab === 'receipt' && (
						<div>
							<div className='mb-6'>
								<h2 className='text-lg font-medium text-gray-900 mb-2'>إعدادات الفواتير والإيصالات</h2>
								<p className='text-sm text-gray-500'>
									تخصيص محتوى ومظهر الفواتير والإيصالات التي يتم إرسالها للعملاء
								</p>
							</div>

							{loading ? (
								<div className='text-center py-10'>
									<div className='inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500'></div>
									<p className='mt-2 text-sm text-gray-500'>جاري تحميل إعدادات الفواتير...</p>
								</div>
							) : (
								<div className='space-y-6'>
									<div className='bg-white border border-gray-200 rounded-lg p-4'>
										<h3 className='text-sm font-medium text-gray-900 mb-4'>
											معلومات الشركة في الفاتورة
										</h3>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-1'>
													اسم الشركة / المتجر
												</label>
												<input
													type='text'
													defaultValue='ثوب ماستر'
													className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
												/>
											</div>

											<div>
												<label className='block text-sm font-medium text-gray-700 mb-1'>
													رقم السجل التجاري
												</label>
												<input
													type='text'
													defaultValue='1234567890'
													className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
												/>
											</div>

											<div>
												<label className='block text-sm font-medium text-gray-700 mb-1'>
													رقم ضريبة القيمة المضافة
												</label>
												<input
													type='text'
													defaultValue='302010203040'
													className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
												/>
											</div>

											<div>
												<label className='block text-sm font-medium text-gray-700 mb-1'>
													رقم الهاتف
												</label>
												<input
													type='text'
													defaultValue='+966 12 345 6789'
													className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
												/>
											</div>

											<div className='md:col-span-2'>
												<label className='block text-sm font-medium text-gray-700 mb-1'>
													العنوان
												</label>
												<textarea
													rows={2}
													defaultValue='الرياض، المملكة العربية السعودية، 12345'
													className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
												></textarea>
											</div>
										</div>
									</div>

									<div className='bg-white border border-gray-200 rounded-lg p-4'>
										<h3 className='text-sm font-medium text-gray-900 mb-4'>شكل الفاتورة</h3>

										<div className='space-y-4'>
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-1'>
													شعار الشركة
												</label>
												<div className='flex items-center'>
													<div className='flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center'>
														<img
															src='/logo-placeholder.svg'
															alt='Logo'
															className='h-12 w-12'
														/>
													</div>
													<div className='mr-4'>
														<button className='px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none'>
															<Upload className='inline-block ml-1 h-4 w-4' />
															تغيير الشعار
														</button>
														<p className='mt-1 text-xs text-gray-500'>
															يفضل استخدام صورة بصيغة PNG أو SVG بخلفية شفافة
														</p>
													</div>
												</div>
											</div>

											<div>
												<label className='block text-sm font-medium text-gray-700 mb-1'>
													لون القالب
												</label>
												<div className='flex items-center space-x-2 space-x-reverse mt-2'>
													<div className='w-8 h-8 rounded-full bg-green-600 border-2 border-white ring-2 ring-green-600 cursor-pointer'></div>
													<div className='w-8 h-8 rounded-full bg-blue-600 border-2 border-white cursor-pointer'></div>
													<div className='w-8 h-8 rounded-full bg-purple-600 border-2 border-white cursor-pointer'></div>
													<div className='w-8 h-8 rounded-full bg-red-600 border-2 border-white cursor-pointer'></div>
													<div className='w-8 h-8 rounded-full bg-gray-800 border-2 border-white cursor-pointer'></div>
													<input
														type='color'
														defaultValue='#10b981'
														className='w-8 h-8 p-0 border-0 rounded-md cursor-pointer'
													/>
												</div>
											</div>

											<div className='flex items-center justify-between py-2'>
												<div>
													<p className='text-sm font-medium text-gray-700'>
														إضافة توقيع رقمي
													</p>
													<p className='text-xs text-gray-500'>
														إضافة توقيع رقمي في نهاية الفاتورة
													</p>
												</div>
												<label className='relative inline-flex items-center cursor-pointer'>
													<input type='checkbox' className='sr-only peer' />
													<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
												</label>
											</div>

											<div className='flex items-center justify-between py-2'>
												<div>
													<p className='text-sm font-medium text-gray-700'>
														إضافة رمز QR للفاتورة
													</p>
													<p className='text-xs text-gray-500'>
														إضافة رمز QR يحتوي على بيانات الفاتورة وفق متطلبات الضريبة
													</p>
												</div>
												<label className='relative inline-flex items-center cursor-pointer'>
													<input type='checkbox' checked={true} className='sr-only peer' />
													<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
												</label>
											</div>
										</div>
									</div>

									<div className='bg-white border border-gray-200 rounded-lg p-4'>
										<h3 className='text-sm font-medium text-gray-900 mb-4'>محتوى الفاتورة</h3>

										<div className='space-y-4'>
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-1'>
													ملاحظات أسفل الفاتورة
												</label>
												<textarea
													rows={3}
													defaultValue='شكراً لثقتكم بنا. نتطلع للتعامل معكم مرة أخرى.'
													className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
												></textarea>
												<p className='mt-1 text-xs text-gray-500'>
													يتم عرض هذه الملاحظات أسفل الفاتورة لجميع الطلبات
												</p>
											</div>

											<div>
												<label className='block text-sm font-medium text-gray-700 mb-1'>
													شروط وأحكام
												</label>
												<textarea
													rows={3}
													defaultValue='لا تقبل المرتجعات بعد 14 يوم من تاريخ الشراء. يرجى الاحتفاظ بالفاتورة لإتمام عملية الاسترجاع أو الاستبدال.'
													className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
												></textarea>
											</div>

											<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
												<div className='flex items-center justify-between py-2'>
													<div>
														<p className='text-sm font-medium text-gray-700'>
															إظهار بيانات العميل
														</p>
														<p className='text-xs text-gray-500'>
															عرض بيانات العميل كاملة في الفاتورة
														</p>
													</div>
													<label className='relative inline-flex items-center cursor-pointer'>
														<input
															type='checkbox'
															checked={true}
															className='sr-only peer'
														/>
														<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
													</label>
												</div>

												<div className='flex items-center justify-between py-2'>
													<div>
														<p className='text-sm font-medium text-gray-700'>
															إظهار تفاصيل الشحن
														</p>
														<p className='text-xs text-gray-500'>
															عرض عنوان الشحن وتفاصيل التوصيل
														</p>
													</div>
													<label className='relative inline-flex items-center cursor-pointer'>
														<input
															type='checkbox'
															checked={true}
															className='sr-only peer'
														/>
														<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
													</label>
												</div>
											</div>
										</div>
									</div>

									<div className='flex justify-end'>
										<button
											onClick={() => {}}
											className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none flex items-center'
										>
											<Eye className='ml-1 h-4 w-4' />
											معاينة نموذج الفاتورة
										</button>
									</div>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			{/* نافذة إضافة طريقة دفع جديدة */}
			{showAddMethodModal && (
				<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center p-4'>
					<div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
						<div className='px-4 py-3 border-b border-gray-200 flex justify-between items-center'>
							<h3 className='text-lg font-medium text-gray-900'>إضافة طريقة دفع جديدة</h3>
							<button
								onClick={() => setShowAddMethodModal(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-6 w-6' />
							</button>
						</div>

						<div className='p-4'>
							<div className='space-y-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										اختر طريقة الدفع
									</label>
									<div className='grid grid-cols-2 gap-3'>
										{availablePaymentMethods.map((method) => (
											<button
												key={method.id}
												onClick={() =>
													setNewMethod({
														...newMethod,
														type: method.type,
														name: method.name,
													})
												}
												className={`flex flex-col items-center justify-center p-3 border rounded-md hover:bg-gray-50 ${
													newMethod.type === method.type && newMethod.name === method.name
														? 'border-green-500 bg-green-50'
														: 'border-gray-300'
												}`}
											>
												<div className='mb-2'>{getPaymentMethodIcon(method.type)}</div>
												<span className='text-sm font-medium text-gray-900'>{method.name}</span>
											</button>
										))}
									</div>
								</div>

								{newMethod.type && (
									<>
										<div>
											<label
												htmlFor='method-name'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												اسم طريقة الدفع
											</label>
											<input
												type='text'
												id='method-name'
												value={newMethod.name}
												onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
												className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
											/>
										</div>

										<div>
											<label
												htmlFor='method-fee'
												className='block text-sm font-medium text-gray-700 mb-1'
											>
												رسوم الخدمة (٪)
											</label>
											<div className='relative rounded-md shadow-sm'>
												<input
													type='number'
													id='method-fee'
													value={newMethod.feePercentage}
													onChange={(e) =>
														setNewMethod({
															...newMethod,
															feePercentage: parseFloat(e.target.value) || 0,
														})
													}
													min='0'
													step='0.01'
													className='block w-full rounded-md border-gray-300 pl-7 focus:border-green-500 focus:ring-green-500 sm:text-sm'
												/>
												<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
													<span className='text-gray-500 sm:text-sm'>٪</span>
												</div>
											</div>
											<p className='mt-1 text-xs text-gray-500'>
												ملاحظة: هذه الرسوم سيتم إضافتها إلى إجمالي الطلب عند اختيار العميل لهذه
												الطريقة
											</p>
										</div>

										<div className='flex items-center justify-between py-2'>
											<div>
												<p className='text-sm font-medium text-gray-700'>تفعيل طريقة الدفع</p>
												<p className='text-xs text-gray-500'>
													هل تريد تفعيل طريقة الدفع مباشرة؟
												</p>
											</div>
											<label className='relative inline-flex items-center cursor-pointer'>
												<input
													type='checkbox'
													checked={newMethod.isEnabled}
													onChange={(e) =>
														setNewMethod({ ...newMethod, isEnabled: e.target.checked })
													}
													className='sr-only peer'
												/>
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
											</label>
										</div>

										<div className='flex items-center justify-between py-2'>
											<div>
												<p className='text-sm font-medium text-gray-700'>
													تعيين كطريقة دفع افتراضية
												</p>
												<p className='text-xs text-gray-500'>
													هذه الطريقة ستكون مختارة تلقائياً
												</p>
											</div>
											<label className='relative inline-flex items-center cursor-pointer'>
												<input
													type='checkbox'
													checked={newMethod.isDefault}
													onChange={(e) =>
														setNewMethod({ ...newMethod, isDefault: e.target.checked })
													}
													className='sr-only peer'
												/>
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
											</label>
										</div>
									</>
								)}
							</div>
						</div>

						<div className='px-4 py-3 border-t border-gray-200 flex justify-end space-x-2 space-x-reverse'>
							<button
								onClick={() => setShowAddMethodModal(false)}
								className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none'
							>
								إلغاء
							</button>
							<button
								onClick={handleAddPaymentMethod}
								disabled={!newMethod.type || !newMethod.name}
								className='px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none disabled:bg-green-300 disabled:cursor-not-allowed'
							>
								إضافة
							</button>
						</div>
					</div>
				</div>
			)}

			{/* نافذة عرض تفاصيل طريقة الدفع */}
			{selectedMethod && (
				<div className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center p-4'>
					<div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
						<div className='px-4 py-3 border-b border-gray-200 flex justify-between items-center'>
							<h3 className='text-lg font-medium text-gray-900'>تفاصيل طريقة الدفع</h3>
							<button
								onClick={() => setSelectedMethod(null)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-6 w-6' />
							</button>
						</div>

						<div className='px-4 py-4'>
							<div className='flex items-center mb-4'>
								<div className='flex-shrink-0 p-2 bg-gray-100 rounded-md'>
									{getPaymentMethodIcon(selectedMethod.type)}
								</div>
								<div className='mr-3'>
									<h3 className='text-lg font-medium text-gray-900'>{selectedMethod.name}</h3>
									<p className='text-sm text-gray-500'>
										{selectedMethod.type === 'card' && 'بطاقات الدفع الإلكتروني'}
										{selectedMethod.type === 'bank' && 'تحويل بنكي'}
										{selectedMethod.type === 'digital_wallet' && 'محفظة إلكترونية'}
										{selectedMethod.type === 'cash' && 'دفع نقدي'}
									</p>
								</div>
							</div>

							<div className='bg-gray-50 p-3 rounded-md mb-4'>
								<h4 className='text-sm font-medium text-gray-700 mb-2'>إعدادات الرسوم</h4>
								<div className='flex justify-between items-center'>
									<span className='text-sm text-gray-500'>نسبة الرسوم</span>
									<span className='text-sm font-medium text-gray-900'>
										{selectedMethod.feePercentage}٪
									</span>
								</div>

								{selectedMethod.settings?.minAmount && (
									<div className='flex justify-between items-center mt-2'>
										<span className='text-sm text-gray-500'>الحد الأدنى للطلب</span>
										<span className='text-sm font-medium text-gray-900'>
											{selectedMethod.settings.minAmount} ريال
										</span>
									</div>
								)}

								{selectedMethod.settings?.maxAmount && (
									<div className='flex justify-between items-center mt-2'>
										<span className='text-sm text-gray-500'>الحد الأقصى للطلب</span>
										<span className='text-sm font-medium text-gray-900'>
											{selectedMethod.settings.maxAmount} ريال
										</span>
									</div>
								)}
							</div>

							{selectedMethod.credentials && (
								<div className='bg-gray-50 p-3 rounded-md mb-4'>
									<h4 className='text-sm font-medium text-gray-700 mb-2'>بيانات الاتصال API</h4>

									{selectedMethod.credentials.apiKey && (
										<div className='mb-2'>
											<label className='block text-xs text-gray-500 mb-1'>API Key</label>
											<div className='flex'>
												<input
													type='password'
													value={selectedMethod.credentials.apiKey}
													readOnly
													className='block w-full rounded-r-md border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm bg-gray-100'
												/>
												<button className='px-3 py-2 bg-gray-200 border border-gray-300 rounded-l-md'>
													<Eye className='h-4 w-4 text-gray-500' />
												</button>
											</div>
										</div>
									)}

									{selectedMethod.credentials.merchantId && (
										<div className='mb-2'>
											<label className='block text-xs text-gray-500 mb-1'>Merchant ID</label>
											<input
												type='text'
												value={selectedMethod.credentials.merchantId}
												readOnly
												className='block w-full rounded-md border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm bg-gray-100'
											/>
										</div>
									)}

									{selectedMethod.credentials.secretKey && (
										<div>
											<label className='block text-xs text-gray-500 mb-1'>Secret Key</label>
											<div className='flex'>
												<input
													type='password'
													value={selectedMethod.credentials.secretKey}
													readOnly
													className='block w-full rounded-r-md border-gray-300 focus:border-green-500 focus:ring-green-500 text-sm bg-gray-100'
												/>
												<button className='px-3 py-2 bg-gray-200 border border-gray-300 rounded-l-md'>
													<Eye className='h-4 w-4 text-gray-500' />
												</button>
											</div>
										</div>
									)}
								</div>
							)}

							{selectedMethod.type === 'bank' && selectedMethod.settings?.bankDetails && (
								<div className='bg-gray-50 p-3 rounded-md mb-4'>
									<h4 className='text-sm font-medium text-gray-700 mb-2'>بيانات الحساب البنكي</h4>
									<div className='space-y-2'>
										<div>
											<label className='block text-xs text-gray-500 mb-1'>اسم البنك</label>
											<div className='text-sm font-medium text-gray-900'>
												{selectedMethod.settings.bankDetails.bankName}
											</div>
										</div>
										<div>
											<label className='block text-xs text-gray-500 mb-1'>اسم الحساب</label>
											<div className='text-sm font-medium text-gray-900'>
												{selectedMethod.settings.bankDetails.accountName}
											</div>
										</div>
										<div>
											<label className='block text-xs text-gray-500 mb-1'>رقم الآيبان</label>
											<div className='text-sm font-medium text-gray-900 font-mono'>
												{selectedMethod.settings.bankDetails.iban}
											</div>
										</div>
									</div>
								</div>
							)}

							<div className='bg-gray-50 p-3 rounded-md'>
								<h4 className='text-sm font-medium text-gray-700 mb-2'>الحالة</h4>
								<div className='space-y-4'>
									<div className='flex items-center justify-between'>
										<div>
											<p className='text-sm font-medium text-gray-700'>تفعيل طريقة الدفع</p>
										</div>
										<label className='relative inline-flex items-center cursor-pointer'>
											<input
												type='checkbox'
												checked={selectedMethod.isEnabled}
												onChange={() => togglePaymentMethod(selectedMethod.id)}
												className='sr-only peer'
											/>
											<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
										</label>
									</div>

									<div className='flex items-center justify-between'>
										<div>
											<p className='text-sm font-medium text-gray-700'>تعيين كافتراضي</p>
										</div>
										<label className='relative inline-flex items-center cursor-pointer'>
											<input
												type='checkbox'
												checked={selectedMethod.isDefault}
												onChange={() =>
													!selectedMethod.isDefault &&
													setDefaultPaymentMethod(selectedMethod.id)
												}
												disabled={selectedMethod.isDefault}
												className='sr-only peer'
											/>
											<div
												className={`w-11 h-6 ${
													selectedMethod.isDefault
														? 'bg-green-600'
														: 'bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-300'
												} rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600`}
											></div>
										</label>
									</div>
								</div>
							</div>
						</div>

						<div className='px-4 py-3 border-t border-gray-200 flex justify-end space-x-2 space-x-reverse'>
							<button
								onClick={() => setSelectedMethod(null)}
								className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none'
							>
								إغلاق
							</button>
							<button
								onClick={() => {
									setSelectedMethod(null);
									// Here we would typically trigger edit mode
								}}
								className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none'
							>
								<Edit className='inline-block ml-1 h-4 w-4' />
								تعديل
							</button>
						</div>
					</div>
				</div>
			)}

			{/* الإشعارات */}
			{notification && (
				<div
					className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 space-x-reverse z-50 ${
						notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
					}`}
				>
					{notification.type === 'success' ? (
						<CheckCircle className='h-5 w-5 text-green-500' />
					) : (
						<AlertCircle className='h-5 w-5 text-red-500' />
					)}
					<span>{notification.message}</span>
				</div>
			)}
		</div>
	);
}
