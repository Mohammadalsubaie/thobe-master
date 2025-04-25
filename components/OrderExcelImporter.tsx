// components/OrderExcelImporter.tsx
'use client';

import { X } from 'lucide-react';
import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

interface OrderData {
	customerName: string;
	customerPhone: string;
	fabricType: string;
	fabricColor: string;
	deliveryDate?: string;
	price: number;
	notes?: string;
}

interface OrderExcelImporterProps {
	onImport: (data: OrderData[]) => void;
	onClose: () => void;
}

export default function OrderExcelImporter({ onImport, onClose }: OrderExcelImporterProps) {
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<OrderData[]>([]);
	const [error, setError] = useState<string>('');
	const [isLoading, setIsLoading] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		setError('');

		if (!selectedFile) {
			return;
		}

		// Check file type
		const fileType = selectedFile.name.split('.').pop()?.toLowerCase();
		if (fileType !== 'xlsx' && fileType !== 'xls') {
			setError('الرجاء تحميل ملف Excel بصيغة .xlsx أو .xls');
			return;
		}

		setFile(selectedFile);
		processExcelFile(selectedFile);
	};

	const processExcelFile = async (excelFile: File) => {
		setIsLoading(true);
		try {
			const data = await readExcelFile(excelFile);
			if (data.length === 0) {
				setError('الملف فارغ أو لا يحتوي على بيانات صالحة');
				return;
			}

			setPreview(data);
		} catch (err) {
			console.error('Error processing Excel file:', err);
			setError('حدث خطأ أثناء معالجة الملف. تأكد من أن الملف بالتنسيق الصحيح.');
		} finally {
			setIsLoading(false);
		}
	};

	const readExcelFile = (file: File): Promise<OrderData[]> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();

			reader.onload = (e) => {
				try {
					const data = e.target?.result;
					if (!data) {
						reject(new Error('فشل قراءة الملف'));
						return;
					}

					const workbook = XLSX.read(data, { type: 'binary' });
					const sheetName = workbook.SheetNames[0];
					const worksheet = workbook.Sheets[sheetName];

					// Convert to JSON with header row
					const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, { header: 1 });

					// Validate and map the data
					if (jsonData.length < 2) {
						// At least header + 1 row
						reject(new Error('الملف لا يحتوي على بيانات كافية'));
						return;
					}

					const headers = jsonData[0] as string[];
					const requiredColumns = ['اسم العميل', 'رقم الهاتف', 'نوع القماش', 'اللون', 'السعر'];

					// Check if all required columns exist
					const missingColumns = requiredColumns.filter(
						(col) => !headers.some((header) => header.includes(col))
					);

					if (missingColumns.length > 0) {
						reject(new Error(`الأعمدة التالية مفقودة: ${missingColumns.join(', ')}`));
						return;
					}

					// Map data to our format
					const orders: OrderData[] = [];

					for (let i = 1; i < jsonData.length; i++) {
						const row = jsonData[i] as any[];
						if (!row || row.length === 0) continue;

						// Find column indexes based on headers
						const nameIndex = headers.findIndex((h) => h.includes('اسم العميل'));
						const phoneIndex = headers.findIndex((h) => h.includes('رقم الهاتف'));
						const fabricTypeIndex = headers.findIndex((h) => h.includes('نوع القماش'));
						const fabricColorIndex = headers.findIndex((h) => h.includes('اللون'));
						const priceIndex = headers.findIndex((h) => h.includes('السعر'));
						const deliveryDateIndex = headers.findIndex((h) => h.includes('تاريخ التسليم'));
						const notesIndex = headers.findIndex((h) => h.includes('ملاحظات'));

						// Skip rows with missing required fields
						if (
							!row[nameIndex] ||
							!row[phoneIndex] ||
							!row[fabricTypeIndex] ||
							!row[fabricColorIndex] ||
							!row[priceIndex]
						) {
							continue;
						}

						const order: OrderData = {
							customerName: row[nameIndex]?.toString() || '',
							customerPhone: row[phoneIndex]?.toString() || '',
							fabricType: row[fabricTypeIndex]?.toString() || '',
							fabricColor: row[fabricColorIndex]?.toString() || '',
							price: Number(row[priceIndex]) || 0,
						};

						// Add optional fields if they exist
						if (deliveryDateIndex >= 0 && row[deliveryDateIndex]) {
							// Handle Excel date format
							let deliveryDate = row[deliveryDateIndex];
							if (typeof deliveryDate === 'number') {
								// Convert Excel date to JS date
								const excelDate = new Date(Math.round((deliveryDate - 25569) * 86400 * 1000));
								deliveryDate = excelDate.toISOString().split('T')[0];
							}
							order.deliveryDate = deliveryDate.toString();
						}

						if (notesIndex >= 0 && row[notesIndex]) {
							order.notes = row[notesIndex].toString();
						}

						orders.push(order);
					}

					resolve(orders);
				} catch (err) {
					reject(err);
				}
			};

			reader.onerror = () => {
				reject(new Error('حدث خطأ أثناء قراءة الملف'));
			};

			reader.readAsBinaryString(file);
		});
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();

		setError('');
		const files = e.dataTransfer.files;
		if (files.length) {
			const droppedFile = files[0];
			const fileType = droppedFile.name.split('.').pop()?.toLowerCase();

			if (fileType !== 'xlsx' && fileType !== 'xls') {
				setError('الرجاء تحميل ملف Excel بصيغة .xlsx أو .xls');
				return;
			}

			setFile(droppedFile);
			processExcelFile(droppedFile);
		}
	};

	const handleImport = () => {
		if (preview.length > 0) {
			onImport(preview);
		}
	};

	return (
		<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
			<div className='bg-white p-5 rounded-md shadow-lg max-w-4xl w-full'>
				<div className='flex justify-between items-center mb-4'>
					<h3 className='text-lg font-bold text-gray-900'>استيراد طلبات من ملف Excel</h3>
					<button onClick={onClose} className='text-gray-400 hover:text-gray-500'>
						<X className='h-5 w-5' />
					</button>
				</div>

				{!file && (
					<div
						className='border-2 border-dashed border-gray-300 rounded-lg p-12 text-center'
						onDragOver={handleDragOver}
						onDrop={handleDrop}
					>
						<input
							type='file'
							accept='.xlsx, .xls'
							onChange={handleFileChange}
							className='hidden'
							ref={fileInputRef}
						/>

						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-12 w-12 mx-auto text-gray-400'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
							/>
						</svg>

						<p className='mt-4 text-sm text-gray-600'>اسحب وأفلت ملف Excel هنا، أو</p>
						<button
							onClick={() => fileInputRef.current?.click()}
							className='mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700'
						>
							اختر ملف
						</button>

						<p className='mt-2 text-xs text-gray-500'>
							يجب أن يحتوي الملف على الأعمدة التالية: اسم العميل، رقم الهاتف، نوع القماش، اللون، السعر
						</p>
					</div>
				)}

				{error && (
					<div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4'>
						{error}
					</div>
				)}

				{isLoading && (
					<div className='text-center py-4'>
						<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto'></div>
						<p className='mt-2 text-sm text-gray-600'>جاري معالجة الملف...</p>
					</div>
				)}

				{file && preview.length > 0 && !isLoading && (
					<>
						<div className='mb-4'>
							<p className='text-sm text-gray-600'>
								تم العثور على {preview.length} طلب في الملف. يمكنك مراجعة البيانات قبل الاستيراد.
							</p>
						</div>

						<div className='max-h-96 overflow-y-auto border border-gray-200 rounded-md'>
							<table className='min-w-full divide-y divide-gray-200'>
								<thead className='bg-gray-50 sticky top-0'>
									<tr>
										<th className='px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											اسم العميل
										</th>
										<th className='px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											رقم الهاتف
										</th>
										<th className='px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											نوع القماش
										</th>
										<th className='px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											اللون
										</th>
										<th className='px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											تاريخ التسليم
										</th>
										<th className='px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
											السعر
										</th>
									</tr>
								</thead>
								<tbody className='bg-white divide-y divide-gray-200'>
									{preview.map((order, index) => (
										<tr key={index} className='hover:bg-gray-50'>
											<td className='px-3 py-2 whitespace-nowrap text-sm text-gray-900'>
												{order.customerName}
											</td>
											<td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500' dir='ltr'>
												{order.customerPhone}
											</td>
											<td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500'>
												{order.fabricType}
											</td>
											<td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500'>
												{order.fabricColor}
											</td>
											<td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500'>
												{order.deliveryDate || '-'}
											</td>
											<td className='px-3 py-2 whitespace-nowrap text-sm text-gray-500'>
												{order.price} ر.س
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						<div className='flex justify-end space-x-2 space-x-reverse mt-4'>
							<button
								onClick={onClose}
								className='px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50'
							>
								إلغاء
							</button>
							<button
								onClick={handleImport}
								className='px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700'
							>
								استيراد الطلبات ({preview.length})
							</button>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
