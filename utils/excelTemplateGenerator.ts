// utils/excelTemplateGenerator.ts
import * as XLSX from 'xlsx';

export function generateOrderExcelTemplate(): Blob {
	// Create a new workbook
	const wb = XLSX.utils.book_new();

	// Define the headers
	const headers = [
		'اسم العميل',
		'رقم الهاتف',
		'نوع القماش',
		'اللون',
		'السعر',
		'تاريخ التسليم (اختياري)',
		'ملاحظات (اختياري)',
	];

	// Create a sample row
	const sampleRow = ['أحمد محمد', '966512345678', 'قطن مصري', 'أبيض', '350', '2025-05-10', 'تفاصيل خاصة بالطلب'];

	// Create the worksheet with headers and sample data
	const ws = XLSX.utils.aoa_to_sheet([headers, sampleRow]);

	// Set column widths
	const cols = [
		{ wch: 20 }, // اسم العميل
		{ wch: 15 }, // رقم الهاتف
		{ wch: 15 }, // نوع القماش
		{ wch: 15 }, // اللون
		{ wch: 10 }, // السعر
		{ wch: 20 }, // تاريخ التسليم
		{ wch: 40 }, // ملاحظات
	];

	ws['!cols'] = cols;

	// Add the worksheet to the workbook
	XLSX.utils.book_append_sheet(wb, ws, 'طلبات');

	// Generate the file as a blob
	const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });

	// Convert binary string to blob
	const buf = new ArrayBuffer(wbout.length);
	const view = new Uint8Array(buf);
	for (let i = 0; i < wbout.length; i++) {
		view[i] = wbout.charCodeAt(i) & 0xff;
	}

	return new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
}

// Helper function to download the template
export function downloadOrderExcelTemplate() {
	const blob = generateOrderExcelTemplate();
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = 'نموذج_استيراد_الطلبات.xlsx';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
