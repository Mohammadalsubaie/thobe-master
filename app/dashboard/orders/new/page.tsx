'use client';

import {
	Calendar,
	Check,
	ChevronDown,
	DollarSign,
	Package,
	Plus,
	Ruler,
	Search,
	Settings,
	Trash,
	User,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface Customer {
	id: string;
	name: string;
}

interface Measurement {
	id: string;
	createdAt: string;
	isDefault: boolean;
}

interface Fabric {
	id: string;
	name: string;
	color: string;
	price: number;
	quantity: number;
}

// الواجهة المحدثة لخيارات الثوب
interface StitchingOption {
	id: string;
	name: string;
	type: string; // stitchType, collarType, cuffType, pocketType, buttonLineType
	image?: string;
	price: number;
}

// الواجهة الجديدة للإضافات الاختيارية
interface AdditionalOption {
	id: string;
	name: string;
	description?: string;
	price: number;
	image?: string;
}

// واجهة محدثة للعناصر في الطلب
interface OrderItem {
	id: string;
	measurementId: string;
	fabricId: string;
	quantity: number;
	price: number;
	notes: string;
	stitchTypeId: string;
	collarTypeId: string;
	cuffTypeId: string;
	pocketTypeId: string;
	buttonLineTypeId: string;
	optionsPrice: number; // سعر إضافي للخيارات الرئيسية
	additionalOptions: string[]; // قائمة بالإضافات المختارة
	additionalOptionsPrice: number; // سعر إضافي للإضافات الاختيارية
}

export default function NewOrderPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const initialCustomerId = searchParams.get('customerId');
	const initialMeasurementId = searchParams.get('measurementId');

	const [customers, setCustomers] = useState<Customer[]>([]);
	const [measurements, setMeasurements] = useState<Measurement[]>([]);
	const [fabrics, setFabrics] = useState<Fabric[]>([]);
	const [stitchingOptions, setStitchingOptions] = useState<StitchingOption[]>([]);
	const [additionalOptions, setAdditionalOptions] = useState<AdditionalOption[]>([]);
	const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
	const [filteredFabrics, setFilteredFabrics] = useState<Fabric[]>([]);

	const [selectedCustomerId, setSelectedCustomerId] = useState<string>(initialCustomerId || '');
	const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');
	const [fabricSearchQuery, setFabricSearchQuery] = useState<string>('');
	const [deliveryDate, setDeliveryDate] = useState<string>('');
	const [totalPrice, setTotalPrice] = useState<number>(0);
	const [notes, setNotes] = useState<string>('');
	const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
	const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState<boolean>(false);
	const [currentEditingItemId, setCurrentEditingItemId] = useState<string | null>(null);
	const [showOptionModal, setShowOptionModal] = useState<boolean>(false);
	const [selectedOptionType, setSelectedOptionType] = useState<string | null>(null);

	const [isLoading, setIsLoading] = useState(true);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const dropdownRef = useRef<HTMLDivElement>(null);
	const modalRef = useRef<HTMLDivElement>(null);

	// Fetch initial data
	useEffect(() => {
		const fetchData = async () => {
			try {
				// Mock data - replace with actual API calls
				setTimeout(() => {
					// Mock customers
					const mockCustomers = Array.from({ length: 20 }, (_, index) => ({
						id: `c${index + 1}`,
						name: [
							'أحمد محمد',
							'خالد عبدالله',
							'محمد سعيد',
							'عبدالعزيز سالم',
							'فهد العنزي',
							'سعد القحطاني',
							'عمر العمري',
							'سلطان السلطان',
							'راشد الدوسري',
							'فيصل الفيصل',
							'محمد العتيبي',
							'سعود السعيد',
							'عبدالله الشمري',
							'يوسف البلوي',
							'زيد المطيري',
							'طارق الحربي',
							'ناصر السعدون',
							'صالح الصالح',
							'بدر المالكي',
							'عادل الرشيدي',
						][index],
					}));

					setCustomers(mockCustomers);
					setFilteredCustomers(mockCustomers);

					// If a customer is selected (from query params), fetch their measurements
					if (initialCustomerId) {
						const mockMeasurements = Array.from({ length: 3 }, (_, index) => {
							const date = new Date();
							date.setMonth(date.getMonth() - index);
							return {
								id: `m${index + 1}`,
								createdAt: date.toISOString().split('T')[0],
								isDefault: index === 0,
							};
						});
						setMeasurements(mockMeasurements);

						// Add an initial order item if measurement is provided
						if (initialMeasurementId) {
							setOrderItems([
								{
									id: `item_${Date.now()}`,
									measurementId: initialMeasurementId,
									fabricId: '',
									quantity: 1,
									price: 0,
									notes: '',
									stitchTypeId: '',
									collarTypeId: '',
									cuffTypeId: '',
									pocketTypeId: '',
									buttonLineTypeId: '',
									optionsPrice: 0,
									additionalOptions: [],
									additionalOptionsPrice: 0,
								},
							]);
						}
					}

					// Mock fabrics
					const mockFabrics = [
						{ id: 'f1', name: 'قطن مصري', color: 'أبيض', price: 150, quantity: 50 },
						{ id: 'f2', name: 'قطن مصري', color: 'أسود', price: 150, quantity: 30 },
						{ id: 'f3', name: 'كتان', color: 'بيج', price: 180, quantity: 25 },
						{ id: 'f4', name: 'كتان', color: 'أزرق فاتح', price: 180, quantity: 20 },
						{ id: 'f5', name: 'حرير', color: 'أبيض', price: 250, quantity: 15 },
						{ id: 'f6', name: 'قطن مصري', color: 'أزرق داكن', price: 150, quantity: 40 },
						{ id: 'f7', name: 'صوف', color: 'رمادي', price: 200, quantity: 10 },
						{ id: 'f8', name: 'كشمير', color: 'بني', price: 300, quantity: 8 },
						{ id: 'f9', name: 'ساتان', color: 'أحمر', price: 220, quantity: 12 },
						{ id: 'f10', name: 'قطن عضوي', color: 'أخضر فاتح', price: 170, quantity: 22 },
					];
					setFabrics(mockFabrics);
					setFilteredFabrics(mockFabrics);

					// Mock stitching options
					const mockStitchingOptions = [
						// أنواع الخياطة
						{
							id: 'st1',
							name: 'سعودي',
							type: 'stitchType',
							price: 0,
							image: '/images/options/stitch_saudi.png',
						},
						{
							id: 'st2',
							name: 'كويتي',
							type: 'stitchType',
							price: 20,
							image: '/images/options/stitch_kuwaiti.png',
						},
						{
							id: 'st3',
							name: 'قطري',
							type: 'stitchType',
							price: 30,
							image: '/images/options/stitch_qatar.png',
						},
						{
							id: 'st4',
							name: 'إماراتي',
							type: 'stitchType',
							price: 25,
							image: '/images/options/stitch_uae.png',
						},
						{
							id: 'st5',
							name: 'عماني',
							type: 'stitchType',
							price: 15,
							image: '/images/options/stitch_omani.png',
						},

						// أنواع الياقة
						{
							id: 'cl1',
							name: 'عادية',
							type: 'collarType',
							price: 0,
							image: '/images/options/collar_regular.png',
						},
						{
							id: 'cl2',
							name: 'إيطالي',
							type: 'collarType',
							price: 15,
							image: '/images/options/collar_italian.png',
						},
						{
							id: 'cl3',
							name: 'مستدير',
							type: 'collarType',
							price: 10,
							image: '/images/options/collar_round.png',
						},
						{
							id: 'cl4',
							name: 'فرنسي',
							type: 'collarType',
							price: 20,
							image: '/images/options/collar_french.png',
						},

						// أنواع الأكمام
						{
							id: 'cu1',
							name: 'عادي',
							type: 'cuffType',
							price: 0,
							image: '/images/options/cuff_regular.png',
						},
						{
							id: 'cu2',
							name: 'دبل',
							type: 'cuffType',
							price: 15,
							image: '/images/options/cuff_double.png',
						},
						{
							id: 'cu3',
							name: 'مستدير',
							type: 'cuffType',
							price: 10,
							image: '/images/options/cuff_round.png',
						},

						// أنواع الجيوب
						{
							id: 'po1',
							name: 'بدون جيب',
							type: 'pocketType',
							price: 0,
							image: '/images/options/pocket_none.png',
						},
						{
							id: 'po2',
							name: 'جيب عادي',
							type: 'pocketType',
							price: 10,
							image: '/images/options/pocket_regular.png',
						},
						{
							id: 'po3',
							name: 'جيب بغطاء',
							type: 'pocketType',
							price: 15,
							image: '/images/options/pocket_flap.png',
						},

						// أنواع الجبروز
						{
							id: 'bt1',
							name: 'عادي',
							type: 'buttonLineType',
							price: 0,
							image: '/images/options/button_regular.png',
						},
						{
							id: 'bt2',
							name: 'مخفي',
							type: 'buttonLineType',
							price: 20,
							image: '/images/options/button_hidden.png',
						},
						{
							id: 'bt3',
							name: 'سحاب',
							type: 'buttonLineType',
							price: 25,
							image: '/images/options/button_zipper.png',
						},
					];
					setStitchingOptions(mockStitchingOptions);

					// Mock additional options
					const mockAdditionalOptions = [
						{
							id: 'ao1',
							name: 'جيب جوال',
							description: 'جيب داخلي للجوال',
							price: 0,
							image: '/images/options/mobile_pocket.png',
						},
						{
							id: 'ao2',
							name: 'جيب قلم',
							description: 'جيب صغير للقلم',
							price: 0,
							image: '/images/options/pen_pocket.png',
						},
						{
							id: 'ao3',
							name: 'تطريز ذهبي',
							description: 'تطريز ذهبي على الكم',
							price: 50,
							image: '/images/options/gold_embroidery.png',
						},
						{
							id: 'ao4',
							name: 'تطريز فضي',
							description: 'تطريز فضي على الكم',
							price: 40,
							image: '/images/options/silver_embroidery.png',
						},
						{
							id: 'ao5',
							name: 'زر إضافي',
							description: 'زر إضافي داخلي',
							price: 5,
							image: '/images/options/extra_button.png',
						},
						{
							id: 'ao6',
							name: 'جيب مخفي',
							description: 'جيب مخفي داخلي',
							price: 10,
							image: '/images/options/hidden_pocket.png',
						},
					];
					setAdditionalOptions(mockAdditionalOptions);

					setIsLoading(false);
				}, 1000);
			} catch (error) {
				console.error('Error fetching data:', error);
				setIsLoading(false);
			}
		};

		fetchData();

		// Add click outside listener for dropdown and modal
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsCustomerDropdownOpen(false);
			}

			if (modalRef.current && !modalRef.current.contains(event.target as Node) && showOptionModal) {
				setShowOptionModal(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [initialCustomerId, initialMeasurementId, showOptionModal]);

	// Fetch measurements when customer changes
	useEffect(() => {
		if (selectedCustomerId && selectedCustomerId !== initialCustomerId) {
			setIsLoading(true);

			// Mock API call to get measurements for the selected customer
			setTimeout(() => {
				const mockMeasurements = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, index) => {
					const date = new Date();
					date.setMonth(date.getMonth() - index);
					return {
						id: `m${index + 1}`,
						createdAt: date.toISOString().split('T')[0],
						isDefault: index === 0,
					};
				});

				setMeasurements(mockMeasurements);

				// Add an empty order item if there are no items yet
				if (orderItems.length === 0 && mockMeasurements.length > 0) {
					const defaultMeasurement = mockMeasurements.find((m) => m.isDefault) || mockMeasurements[0];
					setOrderItems([
						{
							id: `item_${Date.now()}`,
							measurementId: defaultMeasurement.id,
							fabricId: '',
							quantity: 1,
							price: 0,
							notes: '',
							stitchTypeId: '',
							collarTypeId: '',
							cuffTypeId: '',
							pocketTypeId: '',
							buttonLineTypeId: '',
							optionsPrice: 0,
							additionalOptions: [],
							additionalOptionsPrice: 0,
						},
					]);
				}

				setIsLoading(false);
			}, 500);
		}
	}, [selectedCustomerId, initialCustomerId]);

	// Update total price when order items change
	useEffect(() => {
		let total = 0;
		orderItems.forEach((item) => {
			// سعر القماش × الكمية + سعر الخيارات الإضافية
			total += item.price * item.quantity + item.optionsPrice + item.additionalOptionsPrice;
		});
		setTotalPrice(total);
	}, [orderItems]);

	// Filter customers based on search query
	useEffect(() => {
		if (customerSearchQuery) {
			const filtered = customers.filter((customer) => customer.name.includes(customerSearchQuery));
			setFilteredCustomers(filtered);
		} else {
			setFilteredCustomers(customers);
		}
	}, [customerSearchQuery, customers]);

	// Filter fabrics based on search query
	useEffect(() => {
		if (fabricSearchQuery) {
			const filtered = fabrics.filter(
				(fabric) => fabric.name.includes(fabricSearchQuery) || fabric.color.includes(fabricSearchQuery)
			);
			setFilteredFabrics(filtered);
		} else {
			setFilteredFabrics(fabrics);
		}
	}, [fabricSearchQuery, fabrics]);

	// Add a new order item
	const addOrderItem = () => {
		if (!selectedCustomerId || measurements.length === 0) {
			setErrorMessage('يجب اختيار عميل له قياسات أولاً');
			return;
		}

		// Get default measurement or first measurement
		const defaultMeasurement = measurements.find((m) => m.isDefault) || measurements[0];

		setOrderItems([
			...orderItems,
			{
				id: `item_${Date.now()}`,
				measurementId: defaultMeasurement.id,
				fabricId: '',
				quantity: 1,
				price: 0,
				notes: '',
				stitchTypeId: '',
				collarTypeId: '',
				cuffTypeId: '',
				pocketTypeId: '',
				buttonLineTypeId: '',
				optionsPrice: 0,
				additionalOptions: [],
				additionalOptionsPrice: 0,
			},
		]);
	};

	// Remove an order item
	const removeOrderItem = (itemId: string) => {
		setOrderItems(orderItems.filter((item) => item.id !== itemId));
	};

	// Update an order item property
	const updateOrderItem = (itemId: string, property: keyof OrderItem, value: any) => {
		setOrderItems(
			orderItems.map((item) => {
				if (item.id === itemId) {
					const updatedItem = { ...item, [property]: value };

					// Update price when fabric changes
					if (property === 'fabricId' && value) {
						const selectedFabric = fabrics.find((fabric) => fabric.id === value);
						if (selectedFabric) {
							// Base price is fabric price plus labor
							updatedItem.price = selectedFabric.price + 150;
						}
					}

					return updatedItem;
				}
				return item;
			})
		);
	};

	// Toggle additional option for an item
	const toggleAdditionalOption = (itemId: string, optionId: string) => {
		setOrderItems(
			orderItems.map((item) => {
				if (item.id === itemId) {
					let updatedAdditionalOptions = [...item.additionalOptions];
					let updatedAdditionalOptionsPrice = item.additionalOptionsPrice;

					// Check if option is already selected
					const optionIndex = updatedAdditionalOptions.indexOf(optionId);
					const option = additionalOptions.find((opt) => opt.id === optionId);

					if (optionIndex > -1) {
						// Remove option if already selected
						updatedAdditionalOptions.splice(optionIndex, 1);
						if (option) {
							updatedAdditionalOptionsPrice -= option.price;
						}
					} else {
						// Add option if not selected
						updatedAdditionalOptions.push(optionId);
						if (option) {
							updatedAdditionalOptionsPrice += option.price;
						}
					}

					return {
						...item,
						additionalOptions: updatedAdditionalOptions,
						additionalOptionsPrice: updatedAdditionalOptionsPrice,
					};
				}
				return item;
			})
		);
	};

	// فتح مودال لاختيار خيار
	const openOptionSelector = (itemId: string, optionType: string) => {
		setCurrentEditingItemId(itemId);
		setSelectedOptionType(optionType);
		setShowOptionModal(true);
	};

	// اختيار خيار من المودال
	const selectOption = (optionId: string) => {
		if (!currentEditingItemId || !selectedOptionType) return;

		setOrderItems(
			orderItems.map((item) => {
				if (item.id === currentEditingItemId) {
					const updatedItem = { ...item };
					const previousOptionId = item[selectedOptionType as keyof OrderItem] as string;

					// حسب نوع الخيار، نحدد الحقل الذي سيتم تحديثه
					switch (selectedOptionType) {
						case 'stitchTypeId':
							updatedItem.stitchTypeId = optionId;
							break;
						case 'collarTypeId':
							updatedItem.collarTypeId = optionId;
							break;
						case 'cuffTypeId':
							updatedItem.cuffTypeId = optionId;
							break;
						case 'pocketTypeId':
							updatedItem.pocketTypeId = optionId;
							break;
						case 'buttonLineTypeId':
							updatedItem.buttonLineTypeId = optionId;
							break;
					}

					// تحديث سعر الخيارات
					let optionsPrice = updatedItem.optionsPrice;

					// طرح سعر الخيار السابق إذا وجد
					if (previousOptionId) {
						const previousOption = stitchingOptions.find((opt) => opt.id === previousOptionId);
						if (previousOption) {
							optionsPrice -= previousOption.price;
						}
					}

					// إضافة سعر الخيار الجديد
					const newOption = stitchingOptions.find((opt) => opt.id === optionId);
					if (newOption) {
						optionsPrice += newOption.price;
					}

					updatedItem.optionsPrice = optionsPrice;

					return updatedItem;
				}
				return item;
			})
		);

		setShowOptionModal(false);
	};

	// Select a customer
	const selectCustomer = (customerId: string) => {
		setSelectedCustomerId(customerId);
		setIsCustomerDropdownOpen(false);
		setCustomerSearchQuery('');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setErrorMessage(null);

		// Validate form
		if (!selectedCustomerId) {
			setErrorMessage('الرجاء اختيار عميل');
			return;
		}

		if (orderItems.length === 0) {
			setErrorMessage('الرجاء إضافة ثوب واحد على الأقل');
			return;
		}

		// Validate all order items
		for (const item of orderItems) {
			if (!item.measurementId) {
				setErrorMessage('الرجاء اختيار قياس لكل الثياب');
				return;
			}

			if (!item.fabricId) {
				setErrorMessage('الرجاء اختيار قماش لكل الثياب');
				return;
			}

			if (item.quantity <= 0) {
				setErrorMessage('الرجاء تحديد كمية صحيحة لكل الثياب');
				return;
			}

			if (item.price <= 0) {
				setErrorMessage('الرجاء تحديد سعر صحيح لكل الثياب');
				return;
			}

			if (
				!item.stitchTypeId ||
				!item.collarTypeId ||
				!item.cuffTypeId ||
				!item.pocketTypeId ||
				!item.buttonLineTypeId
			) {
				setErrorMessage('الرجاء اختيار جميع خصائص الثوب (نوع الخياطة، الياقة، الكم، الجيب، الجبروز)');
				return;
			}
		}

		setIsSubmitting(true);

		try {
			// Mock API call - replace with actual API call
			console.log('Creating order with data:', {
				customerId: selectedCustomerId,
				items: orderItems,
				deliveryDate: deliveryDate || null,
				totalPrice,
				notes: notes || null,
			});

			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirect to orders list
			router.push('/dashboard/orders');
		} catch (error) {
			console.error('Error creating order:', error);
			setErrorMessage('حدث خطأ أثناء إنشاء الطلب. الرجاء المحاولة مرة أخرى.');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Get customer name by ID
	const getCustomerName = (id: string) => {
		const customer = customers.find((c) => c.id === id);
		return customer ? customer.name : '';
	};

	// Get measurement name by ID
	const getMeasurementName = (id: string) => {
		const measurement = measurements.find((m) => m.id === id);
		if (!measurement) return 'قياس غير محدد';
		return `قياس ${new Date(measurement.createdAt).toLocaleDateString('ar-SA')}${
			measurement.isDefault ? ' (افتراضي)' : ''
		}`;
	};

	// Get fabric name by ID
	const getFabricName = (id: string) => {
		const fabric = fabrics.find((f) => f.id === id);
		if (!fabric) return '';
		return `${fabric.name} - ${fabric.color} (${fabric.price} ر.س)`;
	};

	// Get option name by ID
	const getOptionName = (id: string) => {
		const option = stitchingOptions.find((opt) => opt.id === id);
		return option ? option.name : 'غير محدد';
	};

	// Get option image by ID
	const getOptionImage = (id: string) => {
		const option = stitchingOptions.find((opt) => opt.id === id);
		return option?.image;
	};

	// Get additional option price by ID
	const getAdditionalOptionPrice = (id: string) => {
		const option = additionalOptions.find((opt) => opt.id === id);
		return option ? option.price : 0;
	};

	// Get additional option name by ID
	const getAdditionalOptionName = (id: string) => {
		const option = additionalOptions.find((opt) => opt.id === id);
		return option ? option.name : '';
	};

	// Check if item has specific additional option
	const hasAdditionalOption = (itemId: string, optionId: string) => {
		const item = orderItems.find((i) => i.id === itemId);
		return item ? item.additionalOptions.includes(optionId) : false;
	};

	// Get active options by type
	const getOptionsByType = (type: string) => {
		return stitchingOptions.filter((option) => option.type === type);
	};

	if (isLoading && !isSubmitting) {
		return <div className='flex items-center justify-center h-96'>جاري التحميل...</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>إنشاء طلب جديد</h1>
				<Link href='/dashboard/options' className='flex items-center text-sm text-gray-600 hover:text-gray-900'>
					<Settings className='ml-1 h-4 w-4' />
					إدارة خيارات الثياب
				</Link>
			</div>

			<div className='bg-white rounded-lg shadow-sm p-6'>
				<form onSubmit={handleSubmit} className='space-y-6'>
					{errorMessage && (
						<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md'>
							{errorMessage}
						</div>
					)}

					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						<div className='space-y-2'>
							<label
								htmlFor='customer'
								className='block text-sm font-medium text-gray-700 flex items-center'
							>
								<User className='h-4 w-4 ml-1 text-gray-400' />
								العميل <span className='text-red-500'>*</span>
							</label>
							<div className='relative' ref={dropdownRef}>
								<div
									className='flex items-center w-full pl-3 pr-4 py-2 border border-gray-300 rounded-md cursor-pointer'
									onClick={() => setIsCustomerDropdownOpen(!isCustomerDropdownOpen)}
								>
									<span className={`flex-1 ${selectedCustomerId ? '' : 'text-gray-500'}`}>
										{selectedCustomerId ? getCustomerName(selectedCustomerId) : 'اختر عميل'}
									</span>
									<ChevronDown className='h-5 w-5 text-gray-400' />
								</div>

								{isCustomerDropdownOpen && (
									<div className='absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200'>
										<div className='p-2 border-b'>
											<div className='flex items-center px-2 py-1 border border-gray-300 rounded-md'>
												<Search className='h-4 w-4 text-gray-400 ml-2' />
												<input
													type='text'
													value={customerSearchQuery}
													onChange={(e) => setCustomerSearchQuery(e.target.value)}
													placeholder='ابحث عن عميل...'
													className='w-full text-sm focus:outline-none'
												/>
												{customerSearchQuery && (
													<button
														type='button'
														onClick={() => setCustomerSearchQuery('')}
														className='text-gray-400 hover:text-gray-500'
													>
														<X size={16} />
													</button>
												)}
											</div>
										</div>
										<div className='max-h-60 overflow-y-auto'>
											{filteredCustomers.length > 0 ? (
												filteredCustomers.map((customer) => (
													<div
														key={customer.id}
														className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
														onClick={() => selectCustomer(customer.id)}
													>
														{customer.name}
													</div>
												))
											) : (
												<div className='px-4 py-2 text-gray-500'>لا توجد نتائج</div>
											)}
										</div>
										<div className='p-2 border-t text-center'>
											<Link
												href='/dashboard/customers/new'
												className='text-sm text-green-600 hover:text-green-800'
											>
												+ إضافة عميل جديد
											</Link>
										</div>
									</div>
								)}
							</div>
							{selectedCustomerId && (
								<div className='mt-2 text-sm'>
									<Link
										href={`/dashboard/customers/${selectedCustomerId}/measurements/new`}
										className='text-green-600 hover:text-green-800'
									>
										+ إضافة قياس جديد
									</Link>
								</div>
							)}
						</div>

						<div className='space-y-2'>
							<label
								htmlFor='deliveryDate'
								className='block text-sm font-medium text-gray-700 flex items-center'
							>
								<Calendar className='h-4 w-4 ml-1 text-gray-400' />
								تاريخ التسليم المتوقع
							</label>
							<input
								type='date'
								id='deliveryDate'
								className='mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
								value={deliveryDate}
								onChange={(e) => setDeliveryDate(e.target.value)}
								min={new Date().toISOString().split('T')[0]}
								disabled={isSubmitting}
							/>
						</div>
					</div>

					{/* Order items section */}
					<div className='space-y-4'>
						<div className='flex justify-between items-center'>
							<h2 className='text-lg font-medium text-gray-700'>الثياب المطلوبة</h2>
							<button
								type='button'
								onClick={addOrderItem}
								disabled={!selectedCustomerId || measurements.length === 0 || isSubmitting}
								className='px-3 py-1 bg-green-50 text-green-700 rounded-md hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm'
							>
								<Plus size={16} className='ml-1' />
								إضافة ثوب
							</button>
						</div>

						{measurements.length === 0 && selectedCustomerId && (
							<div className='bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-md'>
								لا توجد قياسات لهذا العميل. الرجاء إضافة قياس جديد.
							</div>
						)}

						{orderItems.length === 0 ? (
							<div className='bg-gray-50 border border-dashed border-gray-300 rounded-md py-8 px-3 text-center'>
								<p className='text-gray-500'>لم تقم بإضافة أي ثياب بعد.</p>
								<button
									type='button'
									onClick={addOrderItem}
									disabled={!selectedCustomerId || measurements.length === 0}
									className='mt-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center text-sm'
								>
									<Plus size={16} className='ml-1' />
									إضافة ثوب
								</button>
							</div>
						) : (
							<div className='space-y-6'>
								{orderItems.map((item, index) => (
									<div
										key={item.id}
										className='border border-gray-200 rounded-md p-4 bg-gray-50 dark:bg-gray-900'
									>
										<div className='flex justify-between items-center mb-3'>
											<h3 className='font-medium'>الثوب #{index + 1}</h3>
											{orderItems.length > 1 && (
												<button
													type='button'
													onClick={() => removeOrderItem(item.id)}
													className='text-red-500 hover:text-red-700'
													disabled={isSubmitting}
												>
													<Trash size={18} />
												</button>
											)}
										</div>

										<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
											<div className='space-y-2'>
												<label className='block text-sm font-medium text-gray-700 flex items-center'>
													<Ruler className='h-4 w-4 ml-1 text-gray-400' />
													القياس <span className='text-red-500'>*</span>
												</label>
												<div className='relative'>
													<select
														className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
														value={item.measurementId}
														onChange={(e) =>
															updateOrderItem(item.id, 'measurementId', e.target.value)
														}
														disabled={
															!selectedCustomerId ||
															measurements.length === 0 ||
															isSubmitting
														}
													>
														{measurements.length === 0 ? (
															<option value=''>لا توجد قياسات</option>
														) : (
															<>
																<option value=''>اختر قياس</option>
																{measurements.map((measurement) => (
																	<option key={measurement.id} value={measurement.id}>
																		قياس{' '}
																		{new Date(
																			measurement.createdAt
																		).toLocaleDateString('ar-SA')}
																		{measurement.isDefault ? ' (افتراضي)' : ''}
																	</option>
																))}
															</>
														)}
													</select>
													<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
														<ChevronDown className='h-5 w-5 text-gray-400' />
													</div>
												</div>
											</div>

											<div className='space-y-2'>
												<label className='block text-sm font-medium text-gray-700 flex items-center'>
													<Package className='h-4 w-4 ml-1 text-gray-400' />
													القماش <span className='text-red-500'>*</span>
												</label>
												<div className='relative'>
													<div className='relative'>
														<input
															type='text'
															placeholder='ابحث عن قماش...'
															value={fabricSearchQuery}
															onChange={(e) => setFabricSearchQuery(e.target.value)}
															className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
															disabled={isSubmitting}
														/>
														<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
															<Search className='h-5 w-5 text-gray-400' />
														</div>
													</div>
													<select
														className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
														value={item.fabricId}
														onChange={(e) =>
															updateOrderItem(item.id, 'fabricId', e.target.value)
														}
														disabled={isSubmitting}
													>
														<option value=''>اختر قماش</option>
														{filteredFabrics.map((fabric) => (
															<option key={fabric.id} value={fabric.id}>
																{fabric.name} - {fabric.color} ({fabric.price} ر.س)
															</option>
														))}
													</select>
													<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
														<ChevronDown className='h-5 w-5 text-gray-400' />
													</div>
												</div>
											</div>

											<div className='space-y-2'>
												<label className='block text-sm font-medium text-gray-700'>
													الكمية <span className='text-red-500'>*</span>
												</label>
												<input
													type='number'
													className='mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
													value={item.quantity}
													onChange={(e) =>
														updateOrderItem(
															item.id,
															'quantity',
															parseInt(e.target.value) || 0
														)
													}
													min='1'
													disabled={isSubmitting}
												/>
											</div>

											<div className='space-y-2'>
												<label className='block text-sm font-medium text-gray-700 flex items-center'>
													<DollarSign className='h-4 w-4 ml-1 text-gray-400' />
													السعر (ر.س) <span className='text-red-500'>*</span>
												</label>
												<input
													type='number'
													className='mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
													value={item.price}
													onChange={(e) =>
														updateOrderItem(
															item.id,
															'price',
															parseFloat(e.target.value) || 0
														)
													}
													min='1'
													disabled={isSubmitting}
												/>
											</div>
										</div>

										{/* خيارات الثوب الرئيسية */}
										<div className='border-t border-gray-200 pt-4 mt-2'>
											<h4 className='text-sm font-medium text-gray-700 mb-3'>
												خصائص الثوب الأساسية
											</h4>
											<div className='grid grid-cols-2 md:grid-cols-5 gap-3 mb-3'>
												{/* نوع الخياطة */}
												<div
													className={`rounded-md border ${
														item.stitchTypeId
															? 'border-green-200 bg-green-50'
															: 'border-gray-300 bg-gray-50'
													} p-2 cursor-pointer hover:bg-gray-100 text-center group`}
													onClick={() => openOptionSelector(item.id, 'stitchTypeId')}
												>
													<p className='text-xs text-gray-500 mb-1'>نوع الخياطة</p>
													<div className='flex flex-col items-center'>
														{item.stitchTypeId ? (
															<>
																<div className='w-12 h-12 mb-1 flex items-center justify-center'>
																	{getOptionImage(item.stitchTypeId) ? (
																		<img
																			src={
																				getOptionImage(item.stitchTypeId) || ''
																			}
																			alt={getOptionName(item.stitchTypeId)}
																			className='max-w-full max-h-full object-contain'
																		/>
																	) : (
																		<div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
																			<Check className='h-5 w-5 text-green-600' />
																		</div>
																	)}
																</div>
																<p className='text-sm font-medium text-gray-900'>
																	{getOptionName(item.stitchTypeId)}
																</p>
															</>
														) : (
															<>
																<div className='w-12 h-12 mb-1 flex items-center justify-center'>
																	<div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300'>
																		<Plus className='h-5 w-5 text-gray-500' />
																	</div>
																</div>
																<p className='text-sm font-medium text-gray-500'>
																	اختر النوع
																</p>
															</>
														)}
													</div>
												</div>

												{/* نوع الياقة */}
												<div
													className={`rounded-md border ${
														item.collarTypeId
															? 'border-green-200 bg-green-50'
															: 'border-gray-300 bg-gray-50'
													} p-2 cursor-pointer hover:bg-gray-100 text-center group`}
													onClick={() => openOptionSelector(item.id, 'collarTypeId')}
												>
													<p className='text-xs text-gray-500 mb-1'>الياقة</p>
													<div className='flex flex-col items-center'>
														{item.collarTypeId ? (
															<>
																<div className='w-12 h-12 mb-1 flex items-center justify-center'>
																	{getOptionImage(item.collarTypeId) ? (
																		<img
																			src={
																				getOptionImage(item.collarTypeId) || ''
																			}
																			alt={getOptionName(item.collarTypeId)}
																			className='max-w-full max-h-full object-contain'
																		/>
																	) : (
																		<div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
																			<Check className='h-5 w-5 text-green-600' />
																		</div>
																	)}
																</div>
																<p className='text-sm font-medium text-gray-900'>
																	{getOptionName(item.collarTypeId)}
																</p>
															</>
														) : (
															<>
																<div className='w-12 h-12 mb-1 flex items-center justify-center'>
																	<div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300'>
																		<Plus className='h-5 w-5 text-gray-500' />
																	</div>
																</div>
																<p className='text-sm font-medium text-gray-500'>
																	اختر النوع
																</p>
															</>
														)}
													</div>
												</div>

												{/* نوع الكم */}
												<div
													className={`rounded-md border ${
														item.cuffTypeId
															? 'border-green-200 bg-green-50'
															: 'border-gray-300 bg-gray-50'
													} p-2 cursor-pointer hover:bg-gray-100 text-center group`}
													onClick={() => openOptionSelector(item.id, 'cuffTypeId')}
												>
													<p className='text-xs text-gray-500 mb-1'>الكم</p>
													<div className='flex flex-col items-center'>
														{item.cuffTypeId ? (
															<>
																<div className='w-12 h-12 mb-1 flex items-center justify-center'>
																	{getOptionImage(item.cuffTypeId) ? (
																		<img
																			src={getOptionImage(item.cuffTypeId) || ''}
																			alt={getOptionName(item.cuffTypeId)}
																			className='max-w-full max-h-full object-contain'
																		/>
																	) : (
																		<div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
																			<Check className='h-5 w-5 text-green-600' />
																		</div>
																	)}
																</div>
																<p className='text-sm font-medium text-gray-900'>
																	{getOptionName(item.cuffTypeId)}
																</p>
															</>
														) : (
															<>
																<div className='w-12 h-12 mb-1 flex items-center justify-center'>
																	<div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300'>
																		<Plus className='h-5 w-5 text-gray-500' />
																	</div>
																</div>
																<p className='text-sm font-medium text-gray-500'>
																	اختر النوع
																</p>
															</>
														)}
													</div>
												</div>

												{/* نوع الجيب */}
												<div
													className={`rounded-md border ${
														item.pocketTypeId
															? 'border-green-200 bg-green-50'
															: 'border-gray-300 bg-gray-50'
													} p-2 cursor-pointer hover:bg-gray-100 text-center group`}
													onClick={() => openOptionSelector(item.id, 'pocketTypeId')}
												>
													<p className='text-xs text-gray-500 mb-1'>الجيب</p>
													<div className='flex flex-col items-center'>
														{item.pocketTypeId ? (
															<>
																<div className='w-12 h-12 mb-1 flex items-center justify-center'>
																	{getOptionImage(item.pocketTypeId) ? (
																		<img
																			src={
																				getOptionImage(item.pocketTypeId) || ''
																			}
																			alt={getOptionName(item.pocketTypeId)}
																			className='max-w-full max-h-full object-contain'
																		/>
																	) : (
																		<div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
																			<Check className='h-5 w-5 text-green-600' />
																		</div>
																	)}
																</div>
																<p className='text-sm font-medium text-gray-900'>
																	{getOptionName(item.pocketTypeId)}
																</p>
															</>
														) : (
															<>
																<div className='w-12 h-12 mb-1 flex items-center justify-center'>
																	<div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300'>
																		<Plus className='h-5 w-5 text-gray-500' />
																	</div>
																</div>
																<p className='text-sm font-medium text-gray-500'>
																	اختر النوع
																</p>
															</>
														)}
													</div>
												</div>

												{/* نوع الجبروز */}
												<div
													className={`rounded-md border ${
														item.buttonLineTypeId
															? 'border-green-200 bg-green-50'
															: 'border-gray-300 bg-gray-50'
													} p-2 cursor-pointer hover:bg-gray-100 text-center group`}
													onClick={() => openOptionSelector(item.id, 'buttonLineTypeId')}
												>
													<p className='text-xs text-gray-500 mb-1'>الجبروز</p>
													<div className='flex flex-col items-center'>
														{item.buttonLineTypeId ? (
															<>
																<div className='w-12 h-12 mb-1 flex items-center justify-center'>
																	{getOptionImage(item.buttonLineTypeId) ? (
																		<img
																			src={
																				getOptionImage(item.buttonLineTypeId) ||
																				''
																			}
																			alt={getOptionName(item.buttonLineTypeId)}
																			className='max-w-full max-h-full object-contain'
																		/>
																	) : (
																		<div className='w-8 h-8 rounded-full bg-green-100 flex items-center justify-center'>
																			<Check className='h-5 w-5 text-green-600' />
																		</div>
																	)}
																</div>
																<p className='text-sm font-medium text-gray-900'>
																	{getOptionName(item.buttonLineTypeId)}
																</p>
															</>
														) : (
															<>
																<div className='w-12 h-12 mb-1 flex items-center justify-center'>
																	<div className='w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300'>
																		<Plus className='h-5 w-5 text-gray-500' />
																	</div>
																</div>
																<p className='text-sm font-medium text-gray-500'>
																	اختر النوع
																</p>
															</>
														)}
													</div>
												</div>
											</div>
										</div>

										{/* الخيارات الإضافية */}
										<div className='border-t border-gray-200 pt-4 mt-2'>
											<h4 className='text-sm font-medium text-gray-700 mb-3'>خيارات إضافية</h4>
											<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2'>
												{additionalOptions.map((option) => (
													<div
														key={option.id}
														className={`border rounded-md p-2 cursor-pointer group text-center ${
															hasAdditionalOption(item.id, option.id)
																? 'border-green-300 bg-green-50'
																: 'border-gray-200 hover:bg-gray-50'
														}`}
														onClick={() => toggleAdditionalOption(item.id, option.id)}
													>
														{option.image && (
															<div className='relative w-full h-12 mb-1 flex items-center justify-center'>
																<img
																	src={option.image}
																	alt={option.name}
																	className='max-h-full max-w-full object-contain'
																/>
																{hasAdditionalOption(item.id, option.id) && (
																	<div className='absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center'>
																		<Check className='text-white' size={12} />
																	</div>
																)}
															</div>
														)}
														<p className='text-xs font-medium text-gray-800'>
															{option.name}
														</p>
														<p className='text-xs text-gray-500'>
															{option.price > 0 ? `${option.price} ر.س` : 'مجاناً'}
														</p>
													</div>
												))}
											</div>

											{/* عرض الإضافات المختارة والسعر الإضافي */}
											{item.additionalOptions.length > 0 && (
												<div className='mt-3 bg-gray-50 p-2 rounded-md'>
													<p className='text-xs text-gray-600'>الإضافات المختارة:</p>
													<div className='flex flex-wrap gap-1 mt-1'>
														{item.additionalOptions.map((optionId) => (
															<span
																key={optionId}
																className='inline-flex items-center text-xs bg-green-100 text-green-800 px-2 py-1 rounded'
															>
																{getAdditionalOptionName(optionId)}
																{getAdditionalOptionPrice(optionId) > 0 &&
																	` (${getAdditionalOptionPrice(optionId)} ر.س)`}
																<button
																	className='mr-1 text-green-600 hover:text-green-800'
																	onClick={(e) => {
																		e.stopPropagation();
																		toggleAdditionalOption(item.id, optionId);
																	}}
																>
																	<X size={12} />
																</button>
															</span>
														))}
													</div>

													{item.additionalOptionsPrice > 0 && (
														<p className='text-xs text-gray-500 mt-1'>
															سعر الإضافات: {item.additionalOptionsPrice} ر.س
														</p>
													)}
												</div>
											)}
										</div>

										<div className='mt-3'>
											<label className='block text-sm font-medium text-gray-700'>
												ملاحظات خاصة بهذا الثوب
											</label>
											<textarea
												rows={2}
												className='mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
												value={item.notes}
												onChange={(e) => updateOrderItem(item.id, 'notes', e.target.value)}
												placeholder='أي ملاحظات خاصة بهذا الثوب..'
												disabled={isSubmitting}
											/>
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					{/* Order summary */}
					{orderItems.length > 0 && (
						<div className='bg-gray-50 border border-gray-200 rounded-md p-4'>
							<h3 className='font-medium mb-3'>ملخص الطلب</h3>
							<div className='space-y-2'>
								{orderItems.map((item, index) => (
									<div key={item.id} className='flex justify-between items-center text-sm'>
										<div>
											<span className='font-medium'>الثوب #{index + 1}:</span>{' '}
											{item.measurementId
												? getMeasurementName(item.measurementId)
												: 'قياس غير محدد'}{' '}
											{item.fabricId ? `- ${getFabricName(item.fabricId)}` : ''} ({item.quantity}{' '}
											قطعة)
											{(item.optionsPrice > 0 || item.additionalOptionsPrice > 0) && (
												<span className='text-gray-500 mr-1'>
													+ {item.optionsPrice + item.additionalOptionsPrice} ر.س للخيارات
												</span>
											)}
										</div>
										<div className='font-medium'>
											{(
												item.price * item.quantity +
												item.optionsPrice +
												item.additionalOptionsPrice
											).toLocaleString()}{' '}
											ر.س
										</div>
									</div>
								))}
								<div className='border-t border-gray-300 pt-2 mt-2 flex justify-between items-center font-bold'>
									<div>الإجمالي</div>
									<div>{totalPrice.toLocaleString()} ر.س</div>
								</div>
							</div>
						</div>
					)}

					<div className='space-y-2'>
						<label htmlFor='notes' className='block text-sm font-medium text-gray-700'>
							ملاحظات عامة للطلب
						</label>
						<textarea
							id='notes'
							rows={3}
							className='mt-1 block w-full pl-3 pr-4 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
							value={notes}
							onChange={(e) => setNotes(e.target.value)}
							placeholder='أي ملاحظات إضافية تخص الطلب بشكل عام...'
							disabled={isSubmitting}
						/>
					</div>

					<div className='flex justify-end space-x-2 space-x-reverse pt-4'>
						<Link
							href='/dashboard/orders'
							className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
						>
							إلغاء
						</Link>
						<button
							type='submit'
							disabled={isSubmitting || orderItems.length === 0}
							className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
						>
							{isSubmitting ? 'جاري الإنشاء...' : 'إنشاء الطلب'}
						</button>
					</div>
				</form>
			</div>

			{/* Modal لاختيار الخيارات */}
			{showOptionModal && (
				<div className='fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50'>
					<div
						ref={modalRef}
						className='bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden'
					>
						<div className='px-6 py-4 border-b border-gray-200 flex justify-between items-center'>
							<h3 className='text-lg font-medium text-gray-900'>
								{selectedOptionType === 'stitchTypeId' && 'اختر نوع الخياطة'}
								{selectedOptionType === 'collarTypeId' && 'اختر نوع الياقة'}
								{selectedOptionType === 'cuffTypeId' && 'اختر نوع الكم'}
								{selectedOptionType === 'pocketTypeId' && 'اختر نوع الجيب'}
								{selectedOptionType === 'buttonLineTypeId' && 'اختر نوع الجبروز'}
							</h3>
							<button
								onClick={() => setShowOptionModal(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X size={20} />
							</button>
						</div>

						<div className='p-6 overflow-y-auto max-h-[70vh]'>
							<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
								{selectedOptionType &&
									getOptionsByType(selectedOptionType.replace('Id', '')).map((option) => (
										<div
											key={option.id}
											className='border rounded-lg p-3 cursor-pointer hover:border-green-500 hover:bg-green-50 text-center flex flex-col items-center'
											onClick={() => selectOption(option.id)}
										>
											{option.image ? (
												<div className='w-32 h-32 flex items-center justify-center mb-3'>
													<img
														src={option.image}
														alt={option.name}
														className='max-w-full max-h-full object-contain'
													/>
												</div>
											) : (
												<div className='w-32 h-32 bg-gray-100 flex items-center justify-center mb-3 rounded-md'>
													<span className='text-gray-400'>بدون صورة</span>
												</div>
											)}
											<h4 className='font-medium text-gray-900'>{option.name}</h4>
											<p className='text-sm text-gray-500'>
												{option.price > 0 ? `${option.price} ر.س` : 'بدون تكلفة إضافية'}
											</p>
										</div>
									))}
							</div>
						</div>

						<div className='px-6 py-4 border-t border-gray-200 flex justify-end'>
							<button
								onClick={() => setShowOptionModal(false)}
								className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
							>
								إلغاء
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
