'use client';

import {
	AlertTriangle,
	ChevronDown,
	Download,
	Edit,
	FileText,
	Filter,
	Package,
	Plus,
	Printer,
	RefreshCw,
	Search,
	Tag,
	Trash,
	X,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Accessory {
	id: string;
	code: string;
	name: string;
	category: string;
	material: string;
	color: string;
	quantity: number;
	unit: string;
	price: number;
	supplier: string;
	status: 'active' | 'low' | 'out_of_stock';
	lastUpdated: string;
}

export default function AccessoriesPage() {
	const [accessories, setAccessories] = useState<Accessory[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('');
	const [selectedStatus, setSelectedStatus] = useState<string>('');
	const [selectedAccessory, setSelectedAccessory] = useState<Accessory | null>(null);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

	useEffect(() => {
		// محاكاة استدعاء API لجلب بيانات الاكسسوارات
		const fetchAccessories = async () => {
			try {
				// تأخير مصطنع لمحاكاة الاتصال بالخادم
				await new Promise((resolve) => setTimeout(resolve, 800));

				const mockAccessories: Accessory[] = [
					{
						id: 'acc-001',
						code: 'ACC-BTN-001',
						name: 'أزرار كلاسيكية',
						category: 'أزرار',
						material: 'بلاستيك',
						color: 'أسود',
						quantity: 500,
						unit: 'قطعة',
						price: 0.5,
						supplier: 'اكسسوارات الخليج',
						status: 'active',
						lastUpdated: '2023-08-15',
					},
					{
						id: 'acc-002',
						code: 'ACC-ZP-001',
						name: 'سحاب معدني',
						category: 'سحابات',
						material: 'معدن',
						color: 'فضي',
						quantity: 200,
						unit: 'قطعة',
						price: 3.0,
						supplier: 'مستلزمات الخياطة',
						status: 'active',
						lastUpdated: '2023-09-05',
					},
					{
						id: 'acc-003',
						code: 'ACC-BTN-002',
						name: 'أزرار خشبية',
						category: 'أزرار',
						material: 'خشب',
						color: 'بني',
						quantity: 120,
						unit: 'قطعة',
						price: 1.2,
						supplier: 'اكسسوارات الخليج',
						status: 'active',
						lastUpdated: '2023-07-20',
					},
					{
						id: 'acc-004',
						code: 'ACC-LBL-001',
						name: 'ملصقات ماركة',
						category: 'ملصقات',
						material: 'قماش',
						color: 'متعدد',
						quantity: 8,
						unit: 'حزمة',
						price: 15.0,
						supplier: 'مستلزمات الخياطة',
						status: 'low',
						lastUpdated: '2023-09-10',
					},
					{
						id: 'acc-005',
						code: 'ACC-ZP-002',
						name: 'سحاب بلاستيك',
						category: 'سحابات',
						material: 'بلاستيك',
						color: 'أحمر',
						quantity: 0,
						unit: 'قطعة',
						price: 2.0,
						supplier: 'اكسسوارات الخليج',
						status: 'out_of_stock',
						lastUpdated: '2023-06-30',
					},
					{
						id: 'acc-006',
						code: 'ACC-SHLD-001',
						name: 'حشوات أكتاف',
						category: 'حشوات',
						material: 'اسفنج',
						color: 'بيج',
						quantity: 80,
						unit: 'زوج',
						price: 5.0,
						supplier: 'مستلزمات الخياطة',
						status: 'active',
						lastUpdated: '2023-08-02',
					},
					{
						id: 'acc-007',
						code: 'ACC-BCK-001',
						name: 'مشابك معدنية',
						category: 'مشابك',
						material: 'معدن',
						color: 'ذهبي',
						quantity: 10,
						unit: 'حزمة',
						price: 8.0,
						supplier: 'اكسسوارات الخليج',
						status: 'low',
						lastUpdated: '2023-09-12',
					},
				];

				setAccessories(mockAccessories);
				setLoading(false);
			} catch (error) {
				console.error('Error fetching accessories:', error);
				setLoading(false);
			}
		};

		fetchAccessories();
	}, []);

	// فلترة الاكسسوارات بناء على عوامل البحث والفلترة
	const filteredAccessories = accessories.filter((accessory) => {
		// فلترة بناء على البحث
		const matchesSearch =
			accessory.name.includes(searchTerm) ||
			accessory.code.includes(searchTerm) ||
			accessory.supplier.includes(searchTerm);

		// فلترة بناء على الفئة
		const matchesCategory = selectedCategory === '' || accessory.category === selectedCategory;

		// فلترة بناء على الحالة
		const matchesStatus = selectedStatus === '' || accessory.status === selectedStatus;

		return matchesSearch && matchesCategory && matchesStatus;
	});

	// الحصول على قائمة فريدة من فئات الاكسسوارات المتاحة
	const accessoryCategories = Array.from(new Set(accessories.map((accessory) => accessory.category)));

	// فتح نافذة حذف الاكسسوار
	const openDeleteModal = (accessory: Accessory) => {
		setSelectedAccessory(accessory);
		setIsDeleteModalOpen(true);
	};

	// إغلاق نافذة حذف الاكسسوار
	const closeDeleteModal = () => {
		setIsDeleteModalOpen(false);
		setSelectedAccessory(null);
	};

	// حذف الاكسسوار
	const handleDeleteAccessory = () => {
		if (selectedAccessory) {
			// حذف الاكسسوار من القائمة
			setAccessories(accessories.filter((accessory) => accessory.id !== selectedAccessory.id));
			closeDeleteModal();
		}
	};

	// تنسيق حالة المخزون
	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'active':
				return <span className='px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full'>متوفر</span>;
			case 'low':
				return <span className='px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full'>منخفض</span>;
			case 'out_of_stock':
				return <span className='px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full'>نفد</span>;
			default:
				return null;
		}
	};

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<Tag className='inline-block ml-2 h-6 w-6 text-green-600' />
						إدارة الاكسسوارات
					</h1>
					<p className='mt-1 text-sm text-gray-600'>إدارة مخزون الإكسسوارات المستخدمة في الخياطة والتصميم</p>
				</div>

				<div className='flex gap-2'>
					<Link
						href='/dashboard/inventory/accessories/new'
						className='px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium flex items-center hover:bg-green-700'
					>
						<Plus className='ml-1 h-4 w-4' />
						إضافة اكسسوار جديد
					</Link>

					<button
						onClick={() => {}}
						className='px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Printer className='ml-1 h-4 w-4' />
						طباعة
					</button>

					<button
						onClick={() => {}}
						className='px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-50'
					>
						<Download className='ml-1 h-4 w-4' />
						تصدير
					</button>
				</div>
			</div>

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
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
							placeholder='ابحث بالاسم، الكود، أو المورد...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm'
						/>
					</div>

					{/* فلترة الفئة */}
					<div className='w-full sm:w-48'>
						<div className='relative'>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm pr-8'
							>
								<option value=''>كل الفئات</option>
								{accessoryCategories.map((category, index) => (
									<option key={index} value={category}>
										{category}
									</option>
								))}
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* فلترة الحالة */}
					<div className='w-full sm:w-48'>
						<div className='relative'>
							<select
								value={selectedStatus}
								onChange={(e) => setSelectedStatus(e.target.value)}
								className='block appearance-none w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 text-sm pr-8'
							>
								<option value=''>كل الحالات</option>
								<option value='active'>متوفر</option>
								<option value='low'>منخفض</option>
								<option value='out_of_stock'>نفد</option>
							</select>
							<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
								<ChevronDown className='h-4 w-4 text-gray-400' />
							</div>
						</div>
					</div>

					{/* زر إعادة تعيين الفلاتر */}
					<button
						onClick={() => {
							setSearchTerm('');
							setSelectedCategory('');
							setSelectedStatus('');
						}}
						className='px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium flex items-center hover:bg-gray-200'
						disabled={!searchTerm && !selectedCategory && !selectedStatus}
					>
						<RefreshCw className='ml-1 h-4 w-4' />
						إعادة تعيين
					</button>
				</div>

				{/* إظهار ملخص الفلاتر النشطة */}
				{(searchTerm || selectedCategory || selectedStatus) && (
					<div className='mt-3 flex flex-wrap gap-2'>
						{searchTerm && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
								بحث: {searchTerm}
								<button onClick={() => setSearchTerm('')} className='mr-1 focus:outline-none'>
									<X className='h-3 w-3 text-gray-500' />
								</button>
							</span>
						)}

						{selectedCategory && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
								الفئة: {selectedCategory}
								<button onClick={() => setSelectedCategory('')} className='mr-1 focus:outline-none'>
									<X className='h-3 w-3 text-gray-500' />
								</button>
							</span>
						)}

						{selectedStatus && (
							<span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
								الحالة:{' '}
								{selectedStatus === 'active' ? 'متوفر' : selectedStatus === 'low' ? 'منخفض' : 'نفد'}
								<button onClick={() => setSelectedStatus('')} className='mr-1 focus:outline-none'>
									<X className='h-3 w-3 text-gray-500' />
								</button>
							</span>
						)}
					</div>
				)}
			</div>

			{/* جدول الاكسسوارات */}
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
				{loading ? (
					<div className='flex justify-center items-center h-64'>
						<div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500'></div>
					</div>
				) : filteredAccessories.length === 0 ? (
					<div className='p-8 text-center'>
						<Package className='mx-auto h-12 w-12 text-gray-300' />
						<h3 className='mt-2 text-base font-medium text-gray-900'>لا توجد اكسسوارات</h3>
						<p className='mt-1 text-sm text-gray-500'>
							{searchTerm || selectedCategory || selectedStatus
								? 'لا توجد اكسسوارات مطابقة لمعايير البحث.'
								: 'لم يتم إضافة أي اكسسوارات بعد.'}
						</p>
						{(searchTerm || selectedCategory || selectedStatus) && (
							<button
								onClick={() => {
									setSearchTerm('');
									setSelectedCategory('');
									setSelectedStatus('');
								}}
								className='mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
							>
								إعادة تعيين الفلاتر
							</button>
						)}
					</div>
				) : (
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الكود
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الاسم
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الفئة
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										المادة
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										اللون
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الكمية المتوفرة
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										السعر (ريال)
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										المورد
									</th>
									<th
										scope='col'
										className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
									>
										الحالة
									</th>
									<th scope='col' className='relative px-4 py-3'>
										<span className='sr-only'>إجراءات</span>
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{filteredAccessories.map((accessory) => (
									<tr key={accessory.id} className='hover:bg-gray-50'>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
											{accessory.code}
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='text-sm font-medium text-gray-900'>{accessory.name}</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-700'>
											{accessory.category}
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-700'>
											{accessory.material}
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='flex items-center'>
												<span
													className='h-4 w-4 rounded-full border border-gray-300 mr-2'
													style={{
														backgroundColor:
															accessory.color === 'أبيض'
																? 'white'
																: accessory.color === 'أسود'
																? 'black'
																: accessory.color === 'فضي'
																? 'silver'
																: accessory.color === 'بني'
																? 'brown'
																: accessory.color === 'متعدد'
																? 'linear-gradient(45deg, red, blue, green)'
																: accessory.color === 'أحمر'
																? 'red'
																: accessory.color === 'بيج'
																? '#f5f5dc'
																: accessory.color === 'ذهبي'
																? 'gold'
																: undefined,
													}}
												></span>
												<span className='text-sm text-gray-700'>{accessory.color}</span>
											</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											<div className='text-sm text-gray-900'>
												{accessory.quantity} {accessory.unit}
											</div>
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-900'>
											{accessory.price.toFixed(2)}
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-sm text-gray-700'>
											{accessory.supplier}
										</td>
										<td className='px-4 py-3 whitespace-nowrap'>
											{getStatusBadge(accessory.status)}
										</td>
										<td className='px-4 py-3 whitespace-nowrap text-left text-sm font-medium'>
											<div className='flex justify-start space-x-2 space-x-reverse'>
												<Link
													href={`/dashboard/inventory/accessories/${accessory.id}`}
													className='text-blue-600 hover:text-blue-800'
												>
													<span className='sr-only'>عرض</span>
													<FileText className='h-5 w-5' />
												</Link>
												<Link
													href={`/dashboard/inventory/accessories/${accessory.id}/edit`}
													className='text-green-600 hover:text-green-800'
												>
													<span className='sr-only'>تعديل</span>
													<Edit className='h-5 w-5' />
												</Link>
												<button
													onClick={() => openDeleteModal(accessory)}
													className='text-red-600 hover:text-red-800'
												>
													<span className='sr-only'>حذف</span>
													<Trash className='h-5 w-5' />
												</button>
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}

				{!loading && filteredAccessories.length > 0 && (
					<div className='bg-white border-t border-gray-200 px-4 py-3 sm:px-6'>
						<div className='flex justify-between items-center'>
							<div className='text-sm text-gray-700'>
								عرض <span className='font-medium'>{filteredAccessories.length}</span> من أصل{' '}
								<span className='font-medium'>{accessories.length}</span> اكسسوار
							</div>
							<div className='flex justify-end'>
								<button className='relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'>
									السابق
								</button>
								<button className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 mr-3'>
									التالي
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* نافذة تأكيد الحذف */}
			{isDeleteModalOpen && selectedAccessory && (
				<div className='fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4'>
					<div className='bg-white rounded-lg max-w-md w-full p-6'>
						<h3 className='text-lg font-medium text-gray-900 mb-4'>تأكيد الحذف</h3>
						<p className='text-sm text-gray-500 mb-4'>
							هل أنت متأكد من رغبتك في حذف الاكسسوار{' '}
							<span className='font-medium'>{selectedAccessory.name}</span>؟ هذا الإجراء لا يمكن التراجع
							عنه.
						</p>
						<div className='flex justify-end gap-3'>
							<button
								onClick={closeDeleteModal}
								className='px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50'
							>
								إلغاء
							</button>
							<button
								onClick={handleDeleteAccessory}
								className='px-4 py-2 bg-red-600 rounded-md text-sm font-medium text-white hover:bg-red-700'
							>
								حذف
							</button>
						</div>
					</div>
				</div>
			)}

			{/* إحصائيات سريعة */}
			<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-blue-100 text-blue-600 mr-4'>
						<Package className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>إجمالي الاكسسوارات</p>
						<p className='text-xl font-semibold'>{accessories.length} نوع</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-green-100 text-green-600 mr-4'>
						<Filter className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>متوفر</p>
						<p className='text-xl font-semibold'>
							{accessories.filter((a) => a.status === 'active').length} نوع
						</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4'>
						<AlertTriangle className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>مخزون منخفض</p>
						<p className='text-xl font-semibold'>
							{accessories.filter((a) => a.status === 'low').length} نوع
						</p>
					</div>
				</div>

				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center'>
					<div className='p-3 rounded-full bg-red-100 text-red-600 mr-4'>
						<XCircle className='h-6 w-6' />
					</div>
					<div>
						<p className='text-sm font-medium text-gray-600'>نفد من المخزون</p>
						<p className='text-xl font-semibold'>
							{accessories.filter((a) => a.status === 'out_of_stock').length} نوع
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
