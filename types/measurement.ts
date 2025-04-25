export interface Measurement {
	id: string;
	customerId: string;
	createdAt: Date;
	updatedAt: Date;

	// Thobe measurements
	length: number; // طول الثوب
	shoulderWidth: number; // عرض الكتف
	chestWidth: number; // عرض الصدر
	waistWidth: number; // عرض الخصر
	hipWidth: number; // عرض الورك
	sleeveLength: number; // طول الكم
	sleeveWidth: number; // عرض الكم
	neckWidth: number; // عرض الرقبة
	cuffStyle: string; // نوع الكبك
	collarStyle: string; // نوع الياقة

	// Additional measurements
	sidePocketStyle: string; // جيب جانبي
	frontPocketStyle: string; // جيب أمامي
	embroideryDetails?: string; // تفاصيل التطريز
	notes?: string; // ملاحظات إضافية
}

export interface MeasurementFormData {
	length: number;
	shoulderWidth: number;
	chestWidth: number;
	waistWidth: number;
	hipWidth: number;
	sleeveLength: number;
	sleeveWidth: number;
	neckWidth: number;
	cuffStyle: string;
	collarStyle: string;
	sidePocketStyle: string;
	frontPocketStyle: string;
	embroideryDetails?: string;
	notes?: string;
}
