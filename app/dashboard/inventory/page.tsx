'use client';

import { AlertTriangle, ChevronDown, Edit, Filter, Plus, Search, Trash } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Fabric {
	id: string;
	name: string;
	type: string;
	color: string;
	pattern?: string;
	price: number;
	quantity: number;
	supplier?: string;
	imageUrl?: string;
	createdAt: string;
}

export default function InventoryPage() {
	const [fabrics, setFabrics] = useState<Fabric[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState('');
	const [typeFilter, setTypeFilter] = useState<string>('all');
	const [showFilterMenu, setShowFilterMenu] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [fabricToDelete, setFabricToDelete] = useState<string | null>(null);

	useEffect(() => {
		const fetchFabrics = async () => {
			// Mock API call - replace with actual API call
			setTimeout(() => {
				const fabricTypes = ['قطن مصري', 'كتان', 'حرير', 'صوف', 'بوليستر', 'قطن-بوليستر'];
				const colors = ['أبيض', 'أسود', 'بيج', 'أزرق فاتح', 'أزرق غامق', 'رمادي', 'بني', 'أخضر فاتح'];
				const patterns = ['سادة', 'مخطط', 'مربعات', 'منقوش'];
				const suppliers = [
					'مصانع النسيج المصرية',
					'شركة الحرير السعودية',
					'مصانع الشام للأقمشة',
					'شركة الخليج للنسيج',
				];

				const mockFabrics = Array.from({ length: 20 }, (_, index) => {
					const fabricType = fabricTypes[index % fabricTypes.length];
					const price =
						fabricType === 'حرير' ? 250 : fabricType === 'صوف' ? 200 : fabricType === 'كتان' ? 180 : 150;
					const randomDate = new Date();
					randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 90));

					return {
						id: `f${index + 1}`,
						name: fabricType,
						type: fabricType,
						color: colors[index % colors.length],
						pattern: index % 3 === 0 ? patterns[index % patterns.length] : undefined,
						price,
						quantity: Math.floor(Math.random() * 50) + 5,
						supplier: suppliers[index % suppliers.length],
						imageUrl: index % 5 === 0 ? undefined : `https://example.com/fabric${index + 1}.jpg`,
						createdAt: randomDate.toISOString().split('T')[0],
					};
				});

				setFabrics(mockFabrics);
				setIsLoading(false);
			}, 1000);
		};

		fetchFabrics();
	}, []);

	const filteredFabrics = fabrics.filter((fabric) => {
		// Filter by search query (name, color, or supplier)
		const matchesSearch =
			fabric.name.includes(searchQuery) ||
			fabric.color.includes(searchQuery) ||
			(fabric.supplier && fabric.supplier.includes(searchQuery));

		// Filter by type
		const matchesType = typeFilter === 'all' || fabric.type === typeFilter;

		return matchesSearch && matchesType;
	});

	const handleDeleteClick = (fabricId: string) => {
		setFabricToDelete(fabricId);
		setShowDeleteModal(true);
	};

	const confirmDelete = () => {
		if (fabricToDelete) {
			// Mock delete operation - replace with actual API call
			setFabrics(fabrics.filter((f) => f.id !== fabricToDelete));
			setShowDeleteModal(false);
			setFabricToDelete(null);
		}
	};

	const uniqueTypes = Array.from(new Set(fabrics.map((fabric) => fabric.type)));

	if (isLoading) {
		return <div className='flex items-center justify-center h-96'>جاري التحميل...</div>;
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>المخزون</h1>
				<Link
					href='/dashboard/inventory/fabrics/new'
					className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
				>
					<Plus className='ml-2 h-4 w-4' />
					إضافة قماش جديد
				</Link>
			</div>

			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				<div className='bg-white rounded-lg shadow-sm p-6'>
					<div className='flex items-center'>
						<div className='bg-green-100 p-3 rounded-full'>
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
									d='M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4'
								/>
							</svg>
						</div>
						<div className='mr-4'>
							<p className='text-sm text-gray-500'>إجمالي الأقمشة</p>
							<p className='text-2xl font-bold text-gray-900'>{fabrics.length}</p>
						</div>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-sm p-6'>
					<div className='flex items-center'>
						<div className='bg-blue-100 p-3 rounded-full'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6 text-blue-600'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
								/>
							</svg>
						</div>
						<div className='mr-4'>
							<p className='text-sm text-gray-500'>الأنواع المختلفة</p>
							<p className='text-2xl font-bold text-gray-900'>{uniqueTypes.length}</p>
						</div>
					</div>
				</div>

				<div className='bg-white rounded-lg shadow-sm p-6'>
					<div className='flex items-center'>
						<div className='bg-yellow-100 p-3 rounded-full'>
							<AlertTriangle className='h-6 w-6 text-yellow-600' />
						</div>
						<div className='mr-4'>
							<p className='text-sm text-gray-500'>أقمشة منخفضة المخزون</p>
							<p className='text-2xl font-bold text-gray-900'>
								{fabrics.filter((f) => f.quantity < 10).length}
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div className='relative rounded-md shadow-sm md:w-2/3'>
						<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' aria-hidden='true' />
						</div>
						<input
							type='text'
							className='block w-full pr-10 pl-4 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
							placeholder='بحث بالاسم أو اللون أو المورد...'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>

					<div className='flex space-x-2 space-x-reverse md:w-1/3'>
						<div className='relative inline-block text-left'>
							<button
								type='button'
								className='inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
								onClick={() => setShowFilterMenu(!showFilterMenu)}
							>
								<Filter className='ml-2 -mr-1 h-5 w-5 text-gray-400' />
								فلترة
								<ChevronDown className='mr-2 -ml-1 h-5 w-5 text-gray-400' aria-hidden='true' />
							</button>

							{showFilterMenu && (
								<div className='z-10 origin-top-left absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100'>
									<div className='py-1'>
										<div className='px-4 py-2 text-sm text-gray-700 font-medium'>نوع القماش</div>
										<div className='px-4 py-2'>
											<select
												className='mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
												value={typeFilter}
												onChange={(e) => setTypeFilter(e.target.value)}
											>
												<option value='all'>الكل</option>
												{uniqueTypes.map((type) => (
													<option key={type} value={type}>
														{type}
													</option>
												))}
											</select>
										</div>
									</div>
									<div className='py-1'>
										<button
											className='block w-full text-right px-4 py-2 text-sm text-green-700 hover:bg-gray-100'
											onClick={() => {
												setTypeFilter('all');
											}}
										>
											إعادة ضبط الفلتر
										</button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className='overflow-x-auto'>
					<table className='min-w-full divide-y divide-gray-200'>
						<thead className='bg-gray-50'>
							<tr>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									القماش
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									النوع
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									اللون
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									النقش
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									السعر
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									الكمية
								</th>
								<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
									المورد
								</th>
								<th className='relative px-6 py-3'>
									<span className='sr-only'>تعديل</span>
								</th>
							</tr>
						</thead>
						<tbody className='bg-white divide-y divide-gray-200'>
							{filteredFabrics.map((fabric) => (
								<tr
									key={fabric.id}
									className={`hover:bg-gray-50 ${fabric.quantity < 10 ? 'bg-red-50' : ''}`}
								>
									<td className='px-6 py-4 whitespace-nowrap'>
										<Link
											href={`/dashboard/inventory/fabrics/${fabric.id}`}
											className='text-green-600 hover:text-green-800'
										>
											{fabric.name}
										</Link>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{fabric.type}</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{fabric.color}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{fabric.pattern || '-'}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{fabric.price} ر.س
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<span
											className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
												fabric.quantity < 10
													? 'bg-red-100 text-red-800'
													: 'bg-green-100 text-green-800'
											}`}
										>
											{fabric.quantity}
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{fabric.supplier || '-'}
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
										<div className='flex space-x-2 space-x-reverse'>
											<Link
												href={`/dashboard/inventory/fabrics/${fabric.id}/edit`}
												className='text-indigo-600 hover:text-indigo-900'
											>
												<Edit className='h-5 w-5' />
											</Link>
											<button
												onClick={() => handleDeleteClick(fabric.id)}
												className='text-red-600 hover:text-red-900'
											>
												<Trash className='h-5 w-5' />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{filteredFabrics.length === 0 && (
					<div className='text-center py-8'>
						<p className='text-gray-500'>لا توجد أقمشة مطابقة لبحثك</p>
					</div>
				)}
			</div>

			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white p-5 rounded-md shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-gray-900 mb-4'>تأكيد الحذف</h3>
						<p className='text-gray-700 mb-4'>
							هل أنت متأكد من رغبتك في حذف هذا القماش؟ لا يمكن التراجع عن هذا الإجراء.
						</p>
						<div className='flex justify-end space-x-2 space-x-reverse'>
							<button
								onClick={() => setShowDeleteModal(false)}
								className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
							>
								إلغاء
							</button>
							<button
								onClick={confirmDelete}
								className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
							>
								حذف
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
