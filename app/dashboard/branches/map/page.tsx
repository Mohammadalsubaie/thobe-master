'use client';

import { ArrowLeft, Building, ExternalLink, Mail, MapPin, Phone, Search, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Branch {
	id: number;
	name: string;
	code: string;
	address: string;
	city: string;
	phone: string;
	manager: string;
	status: 'active' | 'inactive' | 'maintenance';
	employeesCount: number;
	type: 'main' | 'sub' | 'seasonal';
	rating?: number;
	coordinates: {
		lat: number;
		lng: number;
	};
	email?: string;
}

export default function BranchesMapPage() {
	const [branches, setBranches] = useState<Branch[]>([]);
	const [filteredBranches, setFilteredBranches] = useState<Branch[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [cityFilter, setCityFilter] = useState<string>('all');
	const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

	// تحميل بيانات الفروع
	useEffect(() => {
		const fetchBranches = async () => {
			setLoading(true);
			try {
				// محاكاة لتحميل البيانات من API
				await new Promise((resolve) => setTimeout(resolve, 800));

				// بيانات تجريبية للفروع
				const mockBranches: Branch[] = [
					{
						id: 1,
						name: 'فرع الرياض الرئيسي',
						code: 'RYD-001',
						address: 'شارع الملك فهد، حي العليا',
						city: 'الرياض',
						phone: '966112345678',
						manager: 'أحمد العمري',
						status: 'active',
						employeesCount: 25,
						type: 'main',
						rating: 4.7,
						coordinates: {
							lat: 24.7136,
							lng: 46.6753,
						},
						email: 'riyadh@example.com',
					},
					{
						id: 2,
						name: 'فرع جدة',
						code: 'JED-001',
						address: 'شارع التحلية، حي الروضة',
						city: 'جدة',
						phone: '966122345678',
						manager: 'سعيد القحطاني',
						status: 'active',
						employeesCount: 20,
						type: 'sub',
						rating: 4.5,
						coordinates: {
							lat: 21.5433,
							lng: 39.1728,
						},
						email: 'jeddah@example.com',
					},
					{
						id: 3,
						name: 'فرع الدمام',
						code: 'DMM-001',
						address: 'طريق الملك فهد، الشاطئ',
						city: 'الدمام',
						phone: '966132345678',
						manager: 'خالد السالم',
						status: 'active',
						employeesCount: 15,
						type: 'sub',
						rating: 4.3,
						coordinates: {
							lat: 26.4207,
							lng: 50.0888,
						},
					},
					{
						id: 4,
						name: 'فرع مكة الموسمي',
						code: 'MKH-001',
						address: 'العزيزية، قرب الحرم',
						city: 'مكة',
						phone: '966142345678',
						manager: 'محمد الزهراني',
						status: 'maintenance',
						employeesCount: 10,
						type: 'seasonal',
						rating: 4.2,
						coordinates: {
							lat: 21.3891,
							lng: 39.8579,
						},
					},
					{
						id: 5,
						name: 'فرع المدينة',
						code: 'MDN-001',
						address: 'المنطقة المركزية، قرب المسجد النبوي',
						city: 'المدينة',
						phone: '966142345679',
						manager: 'عبدالرحمن العتيبي',
						status: 'active',
						employeesCount: 12,
						type: 'sub',
						rating: 4.4,
						coordinates: {
							lat: 24.4672,
							lng: 39.615,
						},
					},
					{
						id: 6,
						name: 'فرع الطائف',
						code: 'TAF-001',
						address: 'شارع الشفا',
						city: 'الطائف',
						phone: '966142345680',
						manager: 'فهد الدوسري',
						status: 'inactive',
						employeesCount: 8,
						type: 'sub',
						rating: 4.0,
						coordinates: {
							lat: 21.2703,
							lng: 40.4159,
						},
					},
				];

				setBranches(mockBranches);
				setFilteredBranches(mockBranches);
			} catch (error) {
				console.error('Error fetching branches:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchBranches();
	}, []);

	// تطبيق الفلاتر
	useEffect(() => {
		let result = [...branches];

		// تطبيق البحث
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(
				(branch) =>
					branch.name.toLowerCase().includes(query) ||
					branch.code.toLowerCase().includes(query) ||
					branch.address.toLowerCase().includes(query)
			);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			result = result.filter((branch) => branch.status === statusFilter);
		}

		// تطبيق فلتر المدينة
		if (cityFilter !== 'all') {
			result = result.filter((branch) => branch.city === cityFilter);
		}

		setFilteredBranches(result);
	}, [branches, searchQuery, statusFilter, cityFilter]);

	// الحصول على قائمة المدن الفريدة
	const cities = Array.from(new Set(branches.map((branch) => branch.city)));

	// الحصول على نص حالة الفرع
	const getBranchStatusText = (status: string) => {
		switch (status) {
			case 'active':
				return 'نشط';
			case 'inactive':
				return 'غير نشط';
			case 'maintenance':
				return 'تحت الصيانة';
			default:
				return 'غير معروف';
		}
	};

	// الحصول على لون حالة الفرع
	const getBranchStatusColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'bg-green-100 text-green-800';
			case 'inactive':
				return 'bg-red-100 text-red-800';
			case 'maintenance':
				return 'bg-amber-100 text-amber-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	// الحصول على لون مؤشر الفرع على الخريطة
	const getMarkerColor = (status: string) => {
		switch (status) {
			case 'active':
				return 'text-green-600';
			case 'inactive':
				return 'text-red-600';
			case 'maintenance':
				return 'text-amber-600';
			default:
				return 'text-gray-600';
		}
	};

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-800 flex items-center'>
						<MapPin className='ml-2 h-6 w-6 text-gray-600' /> خريطة الفروع
					</h1>
					<p className='mt-1 text-sm text-gray-600'>عرض توزيع جميع فروع المؤسسة على الخريطة</p>
				</div>

				<div>
					<Link
						href='/dashboard/branches'
						className='px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none flex items-center'
					>
						<ArrowLeft className='ml-1 h-4 w-4' />
						العودة لقائمة الفروع
					</Link>
				</div>
			</div>

			{/* قسم الخريطة والفلاتر */}
			<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
				{/* سايدبار الفلاتر وقائمة الفروع */}
				<div className='lg:col-span-1 space-y-6'>
					{/* الفلاتر */}
					<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
						<div className='p-4 border-b border-gray-200'>
							<h2 className='text-sm font-medium text-gray-700'>فلترة الفروع</h2>
						</div>
						<div className='p-4 space-y-4'>
							<div className='relative'>
								<input
									type='text'
									placeholder='بحث عن فرع...'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className='block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
								/>
								<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
									<Search className='h-4 w-4 text-gray-400' />
								</div>
							</div>

							<div>
								<label htmlFor='status-filter' className='block text-xs font-medium text-gray-700 mb-1'>
									حالة الفرع
								</label>
								<select
									id='status-filter'
									value={statusFilter}
									onChange={(e) => setStatusFilter(e.target.value)}
									className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
								>
									<option value='all'>جميع الحالات</option>
									<option value='active'>نشط</option>
									<option value='inactive'>غير نشط</option>
									<option value='maintenance'>تحت الصيانة</option>
								</select>
							</div>

							<div>
								<label htmlFor='city-filter' className='block text-xs font-medium text-gray-700 mb-1'>
									المدينة
								</label>
								<select
									id='city-filter'
									value={cityFilter}
									onChange={(e) => setCityFilter(e.target.value)}
									className='block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm'
								>
									<option value='all'>جميع المدن</option>
									{cities.map((city) => (
										<option key={city} value={city}>
											{city}
										</option>
									))}
								</select>
							</div>

							<div className='pt-2'>
								<button
									onClick={() => {
										setSearchQuery('');
										setStatusFilter('all');
										setCityFilter('all');
									}}
									className='text-sm text-blue-600 hover:text-blue-800'
								>
									إعادة ضبط الفلاتر
								</button>
							</div>
						</div>
					</div>

					{/* قائمة الفروع */}
					<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
						<div className='p-4 border-b border-gray-200 flex justify-between items-center'>
							<h2 className='text-sm font-medium text-gray-700'>قائمة الفروع</h2>
							<span className='text-xs text-gray-500'>{filteredBranches.length} فرع</span>
						</div>
						<div className='divide-y divide-gray-200 max-h-96 overflow-y-auto'>
							{filteredBranches.length === 0 ? (
								<div className='p-4 text-center text-sm text-gray-500'>
									لا توجد فروع تطابق معايير البحث
								</div>
							) : (
								filteredBranches.map((branch) => (
									<div
										key={branch.id}
										className={`p-3 hover:bg-gray-50 cursor-pointer ${
											selectedBranch?.id === branch.id ? 'bg-green-50' : ''
										}`}
										onClick={() => setSelectedBranch(branch)}
									>
										<div className='flex items-start'>
											<div className='shrink-0 mt-1'>
												<MapPin className={`h-5 w-5 ${getMarkerColor(branch.status)}`} />
											</div>
											<div className='mr-2'>
												<h3 className='text-sm font-medium text-gray-900'>{branch.name}</h3>
												<p className='text-xs text-gray-500 mt-0.5'>{branch.address}</p>
												<div className='flex items-center mt-1'>
													<span
														className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBranchStatusColor(
															branch.status
														)}`}
													>
														{getBranchStatusText(branch.status)}
													</span>
													{branch.rating && (
														<div className='flex items-center mr-2'>
															<Star className='h-3 w-3 text-amber-500 fill-current' />
															<span className='ml-0.5 text-xs text-gray-600'>
																{branch.rating}
															</span>
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>

				{/* الخريطة وتفاصيل الفرع المحدد */}
				<div className='lg:col-span-3 space-y-6'>
					{/* الخريطة */}
					<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
						<div className='p-4 border-b border-gray-200'>
							<h2 className='text-sm font-medium text-gray-700'>خريطة توزيع الفروع</h2>
						</div>
						<div className='h-96 bg-gray-100'>
							<div className='flex items-center justify-center h-full'>
								<div className='text-center'>
									<MapPin className='h-10 w-10 text-gray-300 mx-auto mb-2' />
									<p className='text-gray-500'>
										هنا ستظهر خريطة حقيقية باستخدام Google Maps أو Mapbox
									</p>
									<p className='text-sm text-gray-400 mt-1'>
										قد تحتاج إلى تضمين مكتبة خرائط خارجية لعرض الخريطة بشكل صحيح
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* تفاصيل الفرع المحدد */}
					{selectedBranch ? (
						<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
							<div className='p-4 border-b border-gray-200 flex justify-between items-center'>
								<h2 className='text-sm font-medium text-gray-700'>تفاصيل الفرع المحدد</h2>
								<Link
									href={`/dashboard/branches/${selectedBranch.id}`}
									className='text-xs text-blue-600 hover:text-blue-800 flex items-center'
								>
									عرض الصفحة الكاملة
									<ExternalLink className='h-3 w-3 mr-1' />
								</Link>
							</div>
							<div className='p-4'>
								<div className='flex items-start justify-between'>
									<div className='flex items-start'>
										<div className='h-10 w-10 bg-green-100 rounded-full flex items-center justify-center'>
											<Building className='h-5 w-5 text-green-600' />
										</div>
										<div className='mr-3'>
											<h3 className='text-lg font-medium text-gray-900'>{selectedBranch.name}</h3>
											<div className='flex items-center mt-1'>
												<span className='text-sm text-gray-500'>{selectedBranch.code}</span>
												<span className='mx-2 text-gray-300'>•</span>
												<span
													className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getBranchStatusColor(
														selectedBranch.status
													)}`}
												>
													{getBranchStatusText(selectedBranch.status)}
												</span>
											</div>
										</div>
									</div>

									{selectedBranch.rating && (
										<div className='bg-amber-50 px-3 py-1 rounded-lg'>
											<div className='flex items-center'>
												<Star className='h-4 w-4 text-amber-500 fill-current ml-1' />
												<span className='font-medium text-amber-700'>
													{selectedBranch.rating} / 5
												</span>
											</div>
										</div>
									)}
								</div>

								<div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div className='border border-gray-200 rounded-lg p-3'>
										<h4 className='text-xs font-medium text-gray-500 mb-2'>معلومات الاتصال</h4>
										<div className='space-y-2'>
											<div className='flex items-center'>
												<MapPin className='h-4 w-4 text-gray-400 ml-2' />
												<span className='text-sm text-gray-700'>
													{selectedBranch.address}، {selectedBranch.city}
												</span>
											</div>
											<div className='flex items-center'>
												<Phone className='h-4 w-4 text-gray-400 ml-2' />
												<span className='text-sm text-gray-700'>{selectedBranch.phone}</span>
											</div>
											{selectedBranch.email && (
												<div className='flex items-center'>
													<Mail className='h-4 w-4 text-gray-400 ml-2' />
													<span className='text-sm text-gray-700'>
														{selectedBranch.email}
													</span>
												</div>
											)}
										</div>
									</div>

									<div className='border border-gray-200 rounded-lg p-3'>
										<h4 className='text-xs font-medium text-gray-500 mb-2'>معلومات إدارية</h4>
										<div className='space-y-2'>
											<div className='flex items-center'>
												<Users className='h-4 w-4 text-gray-400 ml-2' />
												<span className='text-sm text-gray-700'>
													المدير: {selectedBranch.manager}
												</span>
											</div>
											<div className='flex items-center'>
												<Users className='h-4 w-4 text-gray-400 ml-2' />
												<span className='text-sm text-gray-700'>
													عدد الموظفين: {selectedBranch.employeesCount}
												</span>
											</div>
											<div className='flex items-center'>
												<Building className='h-4 w-4 text-gray-400 ml-2' />
												<span className='text-sm text-gray-700'>
													نوع الفرع:{' '}
													{selectedBranch.type === 'main'
														? 'رئيسي'
														: selectedBranch.type === 'sub'
														? 'فرعي'
														: 'موسمي'}
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className='mt-4 flex justify-center'>
									<Link
										href={`/dashboard/branches/${selectedBranch.id}`}
										className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none'
									>
										عرض تفاصيل الفرع
									</Link>
								</div>
							</div>
						</div>
					) : (
						<div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
							<div className='p-8 text-center'>
								<MapPin className='h-10 w-10 text-gray-300 mx-auto mb-2' />
								<h3 className='text-lg font-medium text-gray-900'>لم يتم تحديد فرع</h3>
								<p className='mt-1 text-gray-500'>
									اختر فرعاً من القائمة أو انقر على أحد المؤشرات في الخريطة لعرض التفاصيل
								</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
