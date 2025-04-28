'use client';

import {
	AlertCircle,
	AlignCenter,
	AlignLeft,
	AlignRight,
	ArrowDown,
	ArrowLeft,
	ArrowUp,
	Bold,
	Check,
	Download,
	Eye,
	EyeOff,
	Grid,
	Image,
	Italic,
	Layers,
	Minus,
	Move,
	PenLine,
	Plus,
	RotateCcw,
	Save,
	Settings,
	Type,
	Upload,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// تعريف واجهة حقل القياس
interface MeasurementField {
	id: string;
	name: string;
	value: number;
	isVisible: boolean;
	order: number;
}

// تعريف واجهة قالب الخلفية
interface TemplateImage {
	id: string;
	name: string;
	url: string; // نوع سلسلة نصية فقط
	category: 'male' | 'female' | 'child';
	type: 'front' | 'back' | 'side';
}

// تعريف كائن النص
interface TextObject {
	id: string;
	text: string;
	x: number;
	y: number;
	fontSize: number;
	color: string;
	fontWeight: string;
	fontStyle: string;
	textAlign: 'left' | 'center' | 'right';
	isDragging: boolean;
}

export default function NewMeasurementPage() {
	const params = useParams();
	const router = useRouter();

	if (!params?.id) {
		router.push('/dashboard/customers');
		return null;
	}

	const customerId = params.id as string;

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [lines, setLines] = useState<Array<Array<[number, number]>>>([]);
	const [currentLine, setCurrentLine] = useState<Array<[number, number]>>([]);
	const [selectedTool, setSelectedTool] = useState<string>('pen');
	const [selectedColor, setSelectedColor] = useState<string>('#FF0000');
	const [lineWidth, setLineWidth] = useState<number>(2);
	const [measurementName, setMeasurementName] = useState<string>('قياسات جديدة');
	const [notes, setNotes] = useState<string>('');
	const [showSettingsModal, setShowSettingsModal] = useState(false);
	const [showAddFieldModal, setShowAddFieldModal] = useState(false);
	const [newFieldName, setNewFieldName] = useState('');
	const [unit, setUnit] = useState<'cm' | 'inch'>('cm');
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [canvasModified, setCanvasModified] = useState(false);
	const [showTemplatesModal, setShowTemplatesModal] = useState(false);
	const [showGridLines, setShowGridLines] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<'male' | 'female' | 'child'>('male');
	const [textObjects, setTextObjects] = useState<TextObject[]>([]);
	const [showTextEditor, setShowTextEditor] = useState(false);
	const [currentTextId, setCurrentTextId] = useState<string | null>(null);
	const [newText, setNewText] = useState('أدخل نصاً');
	const [fontSize, setFontSize] = useState(16);
	const [textColor, setTextColor] = useState('#000000');
	const [fontWeight, setFontWeight] = useState('normal');
	const [fontStyle, setFontStyle] = useState('normal');
	const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('right');

	const fileInputRef = useRef<HTMLInputElement>(null);
	const canvasRef = useRef<HTMLDivElement>(null);
	const canvasImageRef = useRef<HTMLCanvasElement>(null);

	// قوالب صور الخلفية
	const templateImages: TemplateImage[] = [
		{
			id: 'male_front_1',
			name: 'رجالي أمامي',
			url: '/measurement/measurement_A.png',
			category: 'male',
			type: 'front',
		},
		{
			id: 'male_front_2',
			name: 'رجالي أمامي (ثوب)',
			url: '/measurement/measurement_B.png',
			category: 'male',
			type: 'front',
		},
		{
			id: 'male_back_1',
			name: 'رجالي خلفي',
			url: '/measurement/measurement_C.png',
			category: 'male',
			type: 'back',
		},
		{
			id: 'male_side_1',
			name: 'رجالي جانبي',
			url: '/measurement/measurement_D.png',
			category: 'male',
			type: 'side',
		},
	];

	// حقول القياس القابلة للتخصيص
	const [measurementFields, setMeasurementFields] = useState<MeasurementField[]>([
		{ id: 'length', name: 'الطول', value: 0, isVisible: true, order: 1 },
		{ id: 'shoulderWidth', name: 'الكتف', value: 0, isVisible: true, order: 2 },
		{ id: 'chestWidth', name: 'الصدر', value: 0, isVisible: true, order: 3 },
		{ id: 'waistWidth', name: 'الخصر', value: 0, isVisible: true, order: 4 },
		{ id: 'sleeveLength', name: 'طول الكم', value: 0, isVisible: true, order: 5 },
		{ id: 'wristWidth', name: 'الرسغ', value: 0, isVisible: true, order: 6 },
		{ id: 'neckWidth', name: 'الياقة', value: 0, isVisible: true, order: 7 },
	]);

	// التحويل بين سم وإنش
	const convertValue = (value: number, from: 'cm' | 'inch', to: 'cm' | 'inch'): number => {
		if (from === to) return value;
		if (from === 'cm' && to === 'inch') return value / 2.54;
		return value * 2.54; // من إنش إلى سم
	};

	// تغيير وحدة القياس
	useEffect(() => {
		if (unit === 'cm' || unit === 'inch') {
			const fromUnit = unit === 'cm' ? 'inch' : 'cm';

			setMeasurementFields((fields) =>
				fields.map((field) => ({
					...field,
					value: convertValue(field.value, fromUnit, unit),
				}))
			);
		}
	}, [unit]);

	// تغيير قيمة حقل
	const handleFieldValueChange = (id: string, value: number) => {
		setMeasurementFields((fields) => fields.map((field) => (field.id === id ? { ...field, value } : field)));
	};

	// تحديث حالة رؤية الحقل
	const toggleFieldVisibility = (id: string) => {
		setMeasurementFields((fields) =>
			fields.map((field) => (field.id === id ? { ...field, isVisible: !field.isVisible } : field))
		);
	};

	// إضافة حقل جديد
	const addNewField = () => {
		if (!newFieldName.trim()) return;

		const newId = `custom_${Date.now()}`;
		const newField: MeasurementField = {
			id: newId,
			name: newFieldName,
			value: 0,
			isVisible: true,
			order: measurementFields.length + 1,
		};

		setMeasurementFields([...measurementFields, newField]);
		setNewFieldName('');
		setShowAddFieldModal(false);
	};

	// حذف حقل
	const deleteField = (id: string) => {
		// تأكد من أن الحقل ليس من الحقول الافتراضية
		if (!id.startsWith('custom_')) return;

		setMeasurementFields((fields) => fields.filter((field) => field.id !== id));
	};

	// إعادة ترتيب الحقول
	const reorderFields = (id: string, direction: 'up' | 'down') => {
		const fields = [...measurementFields];
		const index = fields.findIndex((f) => f.id === id);

		if (direction === 'up' && index > 0) {
			// تبديل مع العنصر السابق
			[fields[index].order, fields[index - 1].order] = [fields[index - 1].order, fields[index].order];
		} else if (direction === 'down' && index < fields.length - 1) {
			// تبديل مع العنصر التالي
			[fields[index].order, fields[index + 1].order] = [fields[index + 1].order, fields[index].order];
		}

		// إعادة ترتيب المصفوفة حسب خاصية الترتيب
		fields.sort((a, b) => a.order - b.order);
		setMeasurementFields(fields);
	};

	// تحديد قالب صورة
	const selectTemplateImage = (template: TemplateImage) => {
		// استخدم الصورة كخلفية
		setBackgroundImage(template.url);
		setShowTemplatesModal(false);
	};

	// إضافة نص جديد
	const addNewText = () => {
		if (selectedTool !== 'text') return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = rect.width / 2;
		const y = rect.height / 2;

		const newTextObj: TextObject = {
			id: `text_${Date.now()}`,
			text: newText,
			x,
			y,
			fontSize,
			color: textColor,
			fontWeight,
			fontStyle,
			textAlign,
			isDragging: false,
		};

		setTextObjects([...textObjects, newTextObj]);
		setCanvasModified(true);
		setCurrentTextId(newTextObj.id);
		setShowTextEditor(true);
	};

	// تحرير نص موجود
	const editText = (id: string) => {
		const textObj = textObjects.find((t) => t.id === id);
		if (!textObj) return;

		setNewText(textObj.text);
		setFontSize(textObj.fontSize);
		setTextColor(textObj.color);
		setFontWeight(textObj.fontWeight);
		setFontStyle(textObj.fontStyle);
		setTextAlign(textObj.textAlign);
		setCurrentTextId(id);
		setShowTextEditor(true);
	};

	// تطبيق تحرير النص
	const applyTextEdit = () => {
		if (!currentTextId) return;

		setTextObjects((texts) =>
			texts.map((t) =>
				t.id === currentTextId
					? {
							...t,
							text: newText,
							fontSize,
							color: textColor,
							fontWeight,
							fontStyle,
							textAlign,
					  }
					: t
			)
		);

		setShowTextEditor(false);
		setCanvasModified(true);
	};

	// حذف نص
	const deleteText = (id: string) => {
		setTextObjects((texts) => texts.filter((t) => t.id !== id));
		if (currentTextId === id) {
			setShowTextEditor(false);
			setCurrentTextId(null);
		}
		setCanvasModified(true);
	};

	// بدء سحب النص
	const startDraggingText = (e: React.MouseEvent, id: string) => {
		// منع التداخل مع أدوات أخرى
		if (selectedTool !== 'text') return;

		// تحديث حالة السحب
		setTextObjects((texts) => texts.map((t) => (t.id === id ? { ...t, isDragging: true } : t)));

		// منع حدوث أحداث أخرى
		e.stopPropagation();
	};

	// سحب النص
	const dragText = (e: React.MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const draggingText = textObjects.find((t) => t.isDragging);
		if (!draggingText) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		setTextObjects((texts) => texts.map((t) => (t.id === draggingText.id ? { ...t, x, y } : t)));

		setCanvasModified(true);
	};

	// إنهاء سحب النص
	const endDraggingText = () => {
		setTextObjects((texts) => texts.map((t) => (t.isDragging ? { ...t, isDragging: false } : t)));
	};

	// حساب أبعاد رسم الصورة للحفاظ على نسبة أبعادها
	const calculateImageDimensions = (img: HTMLImageElement, canvasWidth: number, canvasHeight: number) => {
		const imgRatio = img.width / img.height;
		const canvasRatio = canvasWidth / canvasHeight;

		let drawWidth,
			drawHeight,
			offsetX = 0,
			offsetY = 0;

		// حفاظ على نسبة أبعاد الصورة الأصلية
		if (imgRatio > canvasRatio) {
			// الصورة أعرض من الكانفاس
			drawWidth = canvasWidth;
			drawHeight = canvasWidth / imgRatio;
			offsetY = (canvasHeight - drawHeight) / 2;
		} else {
			// الصورة أطول من الكانفاس
			drawHeight = canvasHeight;
			drawWidth = canvasHeight * imgRatio;
			offsetX = (canvasWidth - drawWidth) / 2;
		}

		return { drawWidth, drawHeight, offsetX, offsetY };
	};

	// حفظ الصورة النهائية مع الرسومات والنصوص
	const saveCanvasImage = () => {
		const canvas = canvasImageRef.current;
		if (!canvas) return null;

		const context = canvas.getContext('2d');
		if (!context) return null;

		// تعيين أبعاد الكانفاس
		const canvasWidth = canvasRef.current?.clientWidth || 800;
		const canvasHeight = canvasRef.current?.clientHeight || 500;
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;

		// تنظيف الكانفاس
		context.clearRect(0, 0, canvas.width, canvas.height);

		return new Promise((resolve) => {
			// إذا كانت هناك صورة خلفية، نحتاج إلى انتظار تحميلها قبل الرسم عليها
			if (backgroundImage) {
				const img: HTMLImageElement = document.createElement('img');

				img.onload = () => {
					// رسم خلفية بيضاء أولاً
					context.fillStyle = '#ffffff';
					context.fillRect(0, 0, canvas.width, canvas.height);

					// حساب أبعاد الصورة للحفاظ على نسبة أبعادها
					const { drawWidth, drawHeight, offsetX, offsetY } = calculateImageDimensions(
						img,
						canvas.width,
						canvas.height
					);

					// رسم الصورة مع المحافظة على نسبة أبعادها
					context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

					// رسم شبكة القياس إذا كانت مفعلة
					if (showGridLines) {
						drawGridLines(context, canvas.width, canvas.height);
					}

					// رسم جميع الخطوط
					drawLinesOnCanvas(context);

					// رسم جميع النصوص
					drawTextsOnCanvas(context);

					// تحويل الكانفاس إلى URL
					const dataUrl = canvas.toDataURL('image/png');

					// إظهار رسالة نجاح
					setCanvasModified(false);
					setShowSuccessMessage(true);
					setTimeout(() => setShowSuccessMessage(false), 3000);

					resolve(dataUrl);
				};

				// معالجة حالات الخطأ في تحميل الصورة
				img.onerror = () => {
					console.error('Error loading background image');
					// رسم خلفية بيضاء في حالة فشل تحميل الصورة
					context.fillStyle = '#ffffff';
					context.fillRect(0, 0, canvas.width, canvas.height);

					if (showGridLines) {
						drawGridLines(context, canvas.width, canvas.height);
					}

					drawLinesOnCanvas(context);
					drawTextsOnCanvas(context);

					const dataUrl = canvas.toDataURL('image/png');
					setCanvasModified(false);
					setShowSuccessMessage(true);
					setTimeout(() => setShowSuccessMessage(false), 3000);

					resolve(dataUrl);
				};

				// تجاوز قيود CORS إذا أمكن
				img.crossOrigin = 'anonymous';

				// تعيين مصدر الصورة (هذا يبدأ تحميلها)
				img.src = backgroundImage;

				// للصور المخزنة محلياً، قد لا يتم استدعاء onload
				// لذلك نتحقق إذا كانت الصورة محملة بالفعل
				if (img.complete) {
					const event = new Event('load');
					img.onload?.(event);
				}
			} else {
				// إذا لم تكن هناك صورة خلفية، ارسم خلفية بيضاء
				context.fillStyle = '#ffffff';
				context.fillRect(0, 0, canvas.width, canvas.height);

				if (showGridLines) {
					drawGridLines(context, canvas.width, canvas.height);
				}

				drawLinesOnCanvas(context);
				drawTextsOnCanvas(context);

				const dataUrl = canvas.toDataURL('image/png');
				setCanvasModified(false);
				setShowSuccessMessage(true);
				setTimeout(() => setShowSuccessMessage(false), 3000);

				resolve(dataUrl);
			}
		});
	};

	// رسم شبكة القياس على الكانفاس
	const drawGridLines = (context: CanvasRenderingContext2D, width: number, height: number) => {
		context.strokeStyle = '#e2e8f0'; // لون فاتح للشبكة
		context.lineWidth = 0.5;

		// رسم خطوط أفقية
		const gridSize = 20; // حجم المربعات
		for (let y = 0; y <= height; y += gridSize) {
			context.beginPath();
			context.moveTo(0, y);
			context.lineTo(width, y);
			context.stroke();
		}

		// رسم خطوط عمودية
		for (let x = 0; x <= width; x += gridSize) {
			context.beginPath();
			context.moveTo(x, 0);
			context.lineTo(x, height);
			context.stroke();
		}
	};

	// رسم الخطوط على الكانفاس
	const drawLinesOnCanvas = (context: CanvasRenderingContext2D) => {
		// رسم كل الخطوط المحفوظة
		for (const line of lines) {
			if (line.length < 2) continue;

			context.beginPath();
			context.moveTo(line[0][0], line[0][1]);

			for (let i = 1; i < line.length; i++) {
				context.lineTo(line[i][0], line[i][1]);
			}

			context.strokeStyle = selectedColor;
			context.lineWidth = lineWidth;
			context.stroke();
		}
	};

	// رسم النصوص على الكانفاس
	const drawTextsOnCanvas = (context: CanvasRenderingContext2D) => {
		// رسم كل النصوص المحفوظة
		for (const textObj of textObjects) {
			context.font = `${textObj.fontStyle} ${textObj.fontWeight} ${textObj.fontSize}px Arial`;
			context.fillStyle = textObj.color;
			context.textAlign = textObj.textAlign;

			// حساب موضع النص بناءً على محاذاة النص
			let textX = textObj.x;
			if (textObj.textAlign === 'center') {
				textX = textObj.x;
			} else if (textObj.textAlign === 'right') {
				textX = textObj.x;
			} else if (textObj.textAlign === 'left') {
				textX = textObj.x;
			}

			context.fillText(textObj.text, textX, textObj.y);
		}
	};

	// تنزيل الصورة النهائية
	const downloadImage = async () => {
		try {
			const dataUrl = await saveCanvasImage();
			if (!dataUrl) return;

			// إنشاء رابط تنزيل مؤقت
			const link = document.createElement('a');
			link.href = dataUrl as string;
			link.download = `${measurementName.replace(/\s+/g, '_')}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error('Error downloading image:', error);
		}
	};

	// تطبيق الإعدادات
	const applySettings = () => {
		setShowSettingsModal(false);
	};

	// Handle form submission
	const handleSubmit = async () => {
		setIsSubmitting(true);

		try {
			// حفظ الصورة أولاً
			const imageData = await saveCanvasImage();

			// جمع كل البيانات
			const formData = {
				name: measurementName,
				notes,
				unit,
				measurements: measurementFields
					.filter((f) => f.isVisible)
					.map((f) => ({
						id: f.id,
						name: f.name,
						value: f.value,
						order: f.order,
					})),
				imageData: imageData,
			};

			console.log('Submitting measurement data:', formData);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// توجيه المستخدم إلى صفحة تفاصيل العميل
			router.push(`/dashboard/customers/${customerId}`);
		} catch (error) {
			console.error('Error submitting measurement:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Handle image upload
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file && file.type.match('image.*')) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result;
				if (typeof result === 'string') {
					setBackgroundImage(result);
				}
			};
			reader.readAsDataURL(file);
		}
	};

	// Drawing functionality - إصلاح مشكلة بدء الرسم وإنهائه
	const startDrawing = (e: React.MouseEvent) => {
		// تخطي إذا كانت الأداة ليست قلم
		if (selectedTool !== 'pen') return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		setIsDrawing(true);
		setCurrentLine([[x, y]]);
	};

	const draw = (e: React.MouseEvent) => {
		// التحقق من وجود حالة الرسم وأن الأداة هي القلم
		if (!isDrawing || selectedTool !== 'pen') return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		setCurrentLine((prevLine) => [...prevLine, [x, y]]);
		setCanvasModified(true);
	};

	const endDrawing = () => {
		// التحقق من وجود حالة الرسم قبل المتابعة
		if (isDrawing) {
			if (currentLine.length > 1) {
				setLines([...lines, currentLine]);
				setCurrentLine([]);
			}
			setIsDrawing(false);
		}
	};

	// Clear all drawings
	const clearDrawings = () => {
		setLines([]);
		setCurrentLine([]);
		setTextObjects([]);
		setCanvasModified(true);
	};

	// Render a line
	const renderLine = (line: Array<[number, number]>, index: number | string) => {
		if (line.length < 2) return null;

		let pathData = `M ${line[0][0]} ${line[0][1]}`;
		for (let i = 1; i < line.length; i++) {
			pathData += ` L ${line[i][0]} ${line[i][1]}`;
		}

		return <path key={index.toString()} d={pathData} stroke={selectedColor} strokeWidth={lineWidth} fill='none' />;
	};

	// Input field with range slider component
	const MeasurementInput = ({ field }: { field: MeasurementField }) => {
		const roundedValue = Math.round(field.value * 10) / 10;

		return (
			<div className='mb-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-md relative group'>
				<div className='flex justify-between items-center mb-1'>
					<label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>{field.name}</label>
					<div className='flex items-center space-x-1 space-x-reverse'>
						{field.id.startsWith('custom_') && (
							<button
								onClick={() => deleteField(field.id)}
								className='p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity'
								title='حذف'
							>
								<X size={14} />
							</button>
						)}
						<button
							onClick={() => toggleFieldVisibility(field.id)}
							className='p-1 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity'
							title={field.isVisible ? 'إخفاء' : 'إظهار'}
						>
							{field.isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
						</button>
						<button
							onClick={() => reorderFields(field.id, 'up')}
							className='p-1 text-gray-500 hover:text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity'
							title='تحريك للأعلى'
							disabled={field.order === 1}
						>
							<Move size={14} className='transform rotate-90' />
						</button>
					</div>
				</div>
				<div className='flex items-center space-x-2 space-x-reverse'>
					<input
						type='range'
						min='0'
						max={unit === 'cm' ? '200' : '80'} // 80 inches is about 200 cm
						step='0.1'
						value={roundedValue}
						onChange={(e) => handleFieldValueChange(field.id, parseFloat(e.target.value))}
						className='flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
					/>
					<div className='w-16 flex'>
						<input
							type='number'
							value={roundedValue}
							onChange={(e) => handleFieldValueChange(field.id, parseFloat(e.target.value))}
							className='w-12 px-1 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-center text-sm focus:outline-none focus:ring-green-500 focus:border-green-500'
							step='0.1'
							min='0'
						/>
						<span className='ml-1 text-xs text-gray-500 dark:text-gray-400 self-center'>{unit}</span>
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
			<div className='px-6 py-4 bg-white dark:bg-gray-800 shadow-sm flex items-center justify-between'>
				<div className='flex items-center'>
					<Link
						href={`/dashboard/customers/${customerId}`}
						className='text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 ml-2'
					>
						<ArrowLeft size={20} />
					</Link>
					<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>
						إضافة قياسات جديدة - محمد أحمد العبدالله
					</h1>
				</div>
				<div>
					<button
						onClick={handleSubmit}
						className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
						disabled={isSubmitting}
					>
						{isSubmitting ? 'جاري الحفظ...' : 'حفظ القياسات'}
					</button>
					<button
						onClick={() => router.push(`/dashboard/customers/${customerId}`)}
						className='mr-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
					>
						إلغاء
					</button>
				</div>
			</div>

			<div className='flex'>
				{/* Main content */}
				<div className='flex-1 p-6'>
					<div className='flex flex-col md:flex-row gap-6'>
						{/* Measurements input */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 w-full md:w-[400px]'>
							<div className='border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 flex justify-between items-center'>
								<h2 className='text-lg font-medium text-gray-900 dark:text-gray-100'>معلومات أساسية</h2>
								<button
									onClick={() => setShowSettingsModal(true)}
									className='p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'
									title='إعدادات'
								>
									<Settings size={18} className='text-gray-500 dark:text-gray-400' />
								</button>
							</div>

							<div className='mb-6'>
								<label
									htmlFor='measurementName'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
								>
									اسم القياسات <span className='text-red-500'>*</span>
								</label>
								<input
									id='measurementName'
									type='text'
									value={measurementName}
									onChange={(e) => setMeasurementName(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm'
								/>
							</div>

							<div className='mb-4'>
								<h3 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
									صورة مرجعية
								</h3>
								<div className='flex gap-2'>
									<button
										onClick={() => setShowTemplatesModal(true)}
										className='flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
									>
										<Layers size={16} className='ml-1' />
										اختيار قالب
									</button>
									<button
										onClick={() => fileInputRef.current?.click()}
										className='flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
									>
										<Upload size={16} className='ml-1' />
										رفع صورة
									</button>
								</div>
							</div>

							<div className='mb-4'>
								<label
									htmlFor='notes'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
								>
									ملاحظات
								</label>
								<textarea
									id='notes'
									rows={3}
									value={notes}
									onChange={(e) => setNotes(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm'
									placeholder='أي ملاحظات إضافية عن القياسات أو التعديلات المطلوبة...'
								></textarea>
							</div>

							<div className='border-b border-gray-200 dark:border-gray-700 pt-2 pb-3 mb-4 flex justify-between items-center'>
								<h2 className='text-lg font-medium text-gray-900 dark:text-gray-100 flex items-center'>
									القياسات
									<span className='text-sm font-normal text-gray-500 dark:text-gray-400 mr-2'>
										({unit === 'cm' ? 'سم' : 'إنش'})
									</span>
								</h2>
								<div className='flex items-center'>
									<button
										onClick={() => setShowAddFieldModal(true)}
										className='mr-1 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
										title='إضافة حقل'
									>
										<Plus size={18} />
									</button>
									<button
										onClick={() => setUnit(unit === 'cm' ? 'inch' : 'cm')}
										className='p-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
									>
										{unit === 'cm' ? 'إلى إنش' : 'إلى سم'}
									</button>
								</div>
							</div>

							<div className='space-y-2 max-h-[350px] overflow-y-auto pr-1'>
								{measurementFields
									.filter((field) => field.isVisible)
									.sort((a, b) => a.order - b.order)
									.map((field) => (
										<MeasurementInput key={field.id} field={field} />
									))}

								{measurementFields.filter((field) => field.isVisible).length === 0 && (
									<div className='text-center py-4 text-gray-500 dark:text-gray-400'>
										لا توجد حقول قياسات مرئية. يمكنك إضافة حقول جديدة أو إظهار الحقول المخفية من
										خلال الإعدادات.
									</div>
								)}
							</div>

							{/* Hidden fields section */}
							{measurementFields.some((field) => !field.isVisible) && (
								<div className='mt-4 pt-3 border-t border-gray-200 dark:border-gray-700'>
									<h3 className='text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center'>
										<EyeOff size={14} className='ml-1' />
										حقول مخفية ({measurementFields.filter((field) => !field.isVisible).length})
									</h3>
									<div className='flex flex-wrap gap-2'>
										{measurementFields
											.filter((field) => !field.isVisible)
											.map((field) => (
												<button
													key={field.id}
													onClick={() => toggleFieldVisibility(field.id)}
													className='text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600'
												>
													{field.name}
													<Eye size={12} className='inline-block mr-1 ml-0' />
												</button>
											))}
									</div>
								</div>
							)}
						</div>

						{/* Drawing panel */}
						<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex-1'>
							<div className='border-b border-gray-200 dark:border-gray-700 pb-3 mb-3 flex justify-between items-center'>
								<h2 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
									لوحة الرسم والتعديلات
								</h2>
								<div className='flex space-x-2 space-x-reverse'>
									{canvasModified && (
										<button
											onClick={() => saveCanvasImage()}
											className='text-sm flex items-center px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-100 dark:hover:bg-blue-800/40'
										>
											<Save size={16} className='ml-1' />
											حفظ التغييرات
										</button>
									)}
									<button
										onClick={downloadImage}
										className='text-sm flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600'
									>
										<Download size={16} className='ml-1' />
										تنزيل الصورة
									</button>
								</div>
							</div>

							{/* Drawing tools */}
							<div className='flex flex-wrap items-center mb-4 gap-2'>
								<button
									onClick={() => setSelectedTool('pen')}
									className={`p-2 rounded ${
										selectedTool === 'pen'
											? 'bg-gray-200 dark:bg-gray-700'
											: 'hover:bg-gray-100 dark:hover:bg-gray-700'
									}`}
									title='قلم'
								>
									<PenLine size={18} className='text-gray-700 dark:text-gray-300' />
								</button>
								<button
									onClick={() => setSelectedTool('text')}
									className={`p-2 rounded ${
										selectedTool === 'text'
											? 'bg-gray-200 dark:bg-gray-700'
											: 'hover:bg-gray-100 dark:hover:bg-gray-700'
									}`}
									title='نص'
								>
									<Type size={18} className='text-gray-700 dark:text-gray-300' />
								</button>

								<div className='h-6 border-r border-gray-300 dark:border-gray-600 mx-1'></div>

								{/* Line width control */}
								<div className='flex items-center'>
									<button
										onClick={() => setLineWidth(Math.max(1, lineWidth - 1))}
										className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
										title='تقليل سمك الخط'
									>
										<Minus size={14} className='text-gray-700 dark:text-gray-300' />
									</button>
									<span className='mx-1 text-sm text-gray-700 dark:text-gray-300'>{lineWidth}</span>
									<button
										onClick={() => setLineWidth(Math.min(10, lineWidth + 1))}
										className='p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
										title='زيادة سمك الخط'
									>
										<Plus size={14} className='text-gray-700 dark:text-gray-300' />
									</button>
								</div>

								<div className='h-6 border-r border-gray-300 dark:border-gray-600 mx-1'></div>

								<div className='flex items-center'>
									<input
										type='color'
										value={selectedColor}
										onChange={(e) => setSelectedColor(e.target.value)}
										className='w-8 h-8 border-0 p-0 rounded-full'
										style={{ appearance: 'none', background: 'none' }}
										title='اختر لون'
									/>
									<div
										className='w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600 ml-1'
										style={{ backgroundColor: selectedColor }}
									></div>
								</div>

								<div className='h-6 border-r border-gray-300 dark:border-gray-600 mx-1'></div>

								{selectedTool === 'text' && (
									<button
										onClick={addNewText}
										className='p-2 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800/40'
										title='إضافة نص'
									>
										<Plus size={18} className='text-blue-700 dark:text-blue-300' />
									</button>
								)}

								<button
									onClick={clearDrawings}
									className='p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
									title='مسح الكل'
								>
									<RotateCcw size={18} className='text-gray-700 dark:text-gray-300' />
								</button>
								<button
									onClick={() => setShowGridLines(!showGridLines)}
									className={`p-2 rounded ${
										showGridLines
											? 'bg-gray-200 dark:bg-gray-700'
											: 'hover:bg-gray-100 dark:hover:bg-gray-700'
									}`}
									title={showGridLines ? 'إخفاء الشبكة' : 'إظهار الشبكة'}
								>
									<Grid size={18} className='text-gray-700 dark:text-gray-300' />
								</button>
								<div className='h-6 border-r border-gray-300 dark:border-gray-600 mx-1'></div>
								<button
									onClick={() => setShowTemplatesModal(true)}
									className='p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
									title='اختيار قالب'
								>
									<Layers size={18} className='text-gray-700 dark:text-gray-300' />
								</button>
								<button
									onClick={() => fileInputRef.current?.click()}
									className='p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
									title='رفع صورة'
								>
									<Upload size={18} className='text-gray-700 dark:text-gray-300' />
								</button>
								{backgroundImage && (
									<button
										onClick={() => setBackgroundImage(null)}
										className='p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700'
										title='حذف الصورة'
									>
										<Image size={18} className='text-gray-700 dark:text-gray-300' />
									</button>
								)}
							</div>

							{/* Hidden file input */}
							<input
								type='file'
								accept='image/*'
								ref={fileInputRef}
								onChange={handleImageUpload}
								className='hidden'
							/>

							{/* Canvas area - إصلاح مشكلة الرسم */}
							<div className='relative w-full h-[500px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden'>
								{showGridLines && !backgroundImage && (
									<div className='absolute inset-0 grid grid-cols-[repeat(40,1fr)] grid-rows-[repeat(25,1fr)]'>
										{Array.from({ length: 41 }).map((_, i) => (
											<div
												key={`v-${i}`}
												className='absolute h-full w-px bg-gray-100 dark:bg-gray-800'
												style={{ left: `${(i / 40) * 100}%` }}
											></div>
										))}
										{Array.from({ length: 26 }).map((_, i) => (
											<div
												key={`h-${i}`}
												className='absolute w-full h-px bg-gray-100 dark:bg-gray-800'
												style={{ top: `${(i / 25) * 100}%` }}
											></div>
										))}
									</div>
								)}

								{backgroundImage ? (
									<img
										src={backgroundImage}
										alt='صورة خلفية'
										className='absolute inset-0 w-full h-full object-contain'
										onError={(e) => {
											console.error(`Error loading image: ${backgroundImage}`);
											// يمكن هنا تعيين صورة بديلة
											// e.currentTarget.src = "/placeholder.png";
										}}
									/>
								) : (
									<div className='absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600'>
										<span className='text-sm'>اختر قالب أو ارفع صورة للبدء</span>
									</div>
								)}

								<div
									ref={canvasRef}
									className='absolute inset-0 w-full h-full'
									onMouseDown={(e) => {
										if (selectedTool === 'pen') {
											startDrawing(e);
										}
									}}
									onMouseMove={(e) => {
										if (isDrawing && selectedTool === 'pen') {
											draw(e);
										} else if (selectedTool === 'text') {
											dragText(e);
										}
									}}
									onMouseUp={() => {
										endDrawing();
										endDraggingText();
									}}
									onMouseLeave={() => {
										endDrawing();
										endDraggingText();
									}}
								>
									<svg className='w-full h-full'>
										{lines.map((line, index) => renderLine(line, index))}
										{renderLine(currentLine, 'current')}
									</svg>

									{/* Text elements */}
									{textObjects.map((textObj) => (
										<div
											key={textObj.id}
											className={`absolute inline-block ${
												textObj.isDragging ? 'cursor-grabbing' : 'cursor-pointer'
											}`}
											style={{
												left: textObj.x + 'px',
												top: textObj.y + 'px',
												transform: 'translate(-50%, -50%)',
												color: textObj.color,
												fontSize: textObj.fontSize + 'px',
												fontWeight: textObj.fontWeight,
												fontStyle: textObj.fontStyle,
												textAlign: textObj.textAlign,
											}}
											onMouseDown={(e) => {
												if (selectedTool === 'text') {
													e.stopPropagation(); // منع انتشار الحدث
													startDraggingText(e, textObj.id);
													editText(textObj.id);
												}
											}}
										>
											{textObj.text}
										</div>
									))}
								</div>

								{/* Hidden canvas for saving image */}
								<canvas ref={canvasImageRef} width={800} height={500} className='hidden'></canvas>
							</div>

							{!backgroundImage && (
								<div className='mt-2 text-center text-gray-500 dark:text-gray-400 text-sm'>
									يمكنك اختيار قالب جاهز أو رفع صورة لاستخدامها كخلفية للرسم
								</div>
							)}

							{/* Success message */}
							{showSuccessMessage && (
								<div className='fixed bottom-6 right-6 bg-green-100 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 rounded-md px-4 py-2 flex items-center shadow-lg'>
									<Check className='ml-2 h-5 w-5' />
									تم حفظ التغييرات بنجاح
								</div>
							)}

							{/* Text Editor */}
							{showTextEditor && (
								<div className='mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600'>
									<div className='flex justify-between items-center mb-2'>
										<h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
											تحرير النص
										</h3>
										<button
											onClick={() => {
												setShowTextEditor(false);
												setCurrentTextId(null);
											}}
											className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
										>
											<X size={16} />
										</button>
									</div>

									<div className='mb-2'>
										<input
											type='text'
											value={newText}
											onChange={(e) => setNewText(e.target.value)}
											className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100'
											placeholder='أدخل نصاً'
										/>
									</div>

									<div className='grid grid-cols-3 gap-2 mb-2'>
										<div>
											<label className='block text-xs text-gray-500 dark:text-gray-400 mb-1'>
												الحجم
											</label>
											<div className='flex items-center'>
												<button
													onClick={() => setFontSize(Math.max(8, fontSize - 1))}
													className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600'
												>
													<Minus size={14} />
												</button>
												<span className='mx-1 text-sm'>{fontSize}</span>
												<button
													onClick={() => setFontSize(Math.min(48, fontSize + 1))}
													className='p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600'
												>
													<Plus size={14} />
												</button>
											</div>
										</div>

										<div>
											<label className='block text-xs text-gray-500 dark:text-gray-400 mb-1'>
												اللون
											</label>
											<div className='flex items-center space-x-1 space-x-reverse'>
												<input
													type='color'
													value={textColor}
													onChange={(e) => setTextColor(e.target.value)}
													className='w-8 h-8 border-0 p-0 rounded-full'
													style={{ appearance: 'none', background: 'none' }}
												/>
												<div
													className='w-6 h-6 rounded-full border border-gray-300 dark:border-gray-600'
													style={{ backgroundColor: textColor }}
												></div>
											</div>
										</div>

										<div>
											<label className='block text-xs text-gray-500 dark:text-gray-400 mb-1'>
												النمط
											</label>
											<div className='flex space-x-1 space-x-reverse'>
												<button
													onClick={() =>
														setFontWeight(fontWeight === 'bold' ? 'normal' : 'bold')
													}
													className={`p-1 rounded ${
														fontWeight === 'bold'
															? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
															: 'hover:bg-gray-200 dark:hover:bg-gray-600'
													}`}
												>
													<Bold size={14} />
												</button>
												<button
													onClick={() =>
														setFontStyle(fontStyle === 'italic' ? 'normal' : 'italic')
													}
													className={`p-1 rounded ${
														fontStyle === 'italic'
															? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
															: 'hover:bg-gray-200 dark:hover:bg-gray-600'
													}`}
												>
													<Italic size={14} />
												</button>
											</div>
										</div>
									</div>

									<div className='flex items-center justify-between'>
										<div className='flex space-x-1 space-x-reverse'>
											<button
												onClick={() => setTextAlign('right')}
												className={`p-1 rounded ${
													textAlign === 'right'
														? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
														: 'hover:bg-gray-200 dark:hover:bg-gray-600'
												}`}
											>
												<AlignRight size={14} />
											</button>
											<button
												onClick={() => setTextAlign('center')}
												className={`p-1 rounded ${
													textAlign === 'center'
														? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
														: 'hover:bg-gray-200 dark:hover:bg-gray-600'
												}`}
											>
												<AlignCenter size={14} />
											</button>
											<button
												onClick={() => setTextAlign('left')}
												className={`p-1 rounded ${
													textAlign === 'left'
														? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
														: 'hover:bg-gray-200 dark:hover:bg-gray-600'
												}`}
											>
												<AlignLeft size={14} />
											</button>
										</div>

										<div className='flex space-x-2 space-x-reverse'>
											{currentTextId && (
												<button
													onClick={() => {
														if (currentTextId) deleteText(currentTextId);
													}}
													className='px-2 py-1 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300'
												>
													حذف
												</button>
											)}
											<button
												onClick={applyTextEdit}
												className='px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700'
											>
												تطبيق
											</button>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Settings Modal */}
			{showSettingsModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4'>
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md'>
						<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
							<h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>إعدادات القياسات</h3>
							<button
								onClick={() => setShowSettingsModal(false)}
								className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
							>
								<X size={20} />
							</button>
						</div>

						<div className='p-6'>
							<div className='mb-6'>
								<h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
									وحدة القياس
								</h4>
								<div className='flex items-center space-x-4 space-x-reverse'>
									<label className='inline-flex items-center'>
										<input
											type='radio'
											className='form-radio text-green-600'
											name='unit'
											value='cm'
											checked={unit === 'cm'}
											onChange={() => setUnit('cm')}
										/>
										<span className='mr-2 text-gray-700 dark:text-gray-300'>سنتيمتر (سم)</span>
									</label>
									<label className='inline-flex items-center'>
										<input
											type='radio'
											className='form-radio text-green-600'
											name='unit'
											value='inch'
											checked={unit === 'inch'}
											onChange={() => setUnit('inch')}
										/>
										<span className='mr-2 text-gray-700 dark:text-gray-300'>إنش</span>
									</label>
								</div>
							</div>

							<div className='mb-4'>
								<h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>القياسات</h4>
								<p className='text-xs text-gray-500 dark:text-gray-400 mb-2'>
									يمكنك إعادة ترتيب القياسات أو إخفاء بعضها حسب احتياجك
								</p>

								<div className='space-y-2 max-h-[250px] overflow-y-auto'>
									{measurementFields
										.sort((a, b) => a.order - b.order)
										.map((field) => (
											<div
												key={field.id}
												className='flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md'
											>
												<div className='flex items-center'>
													<input
														type='checkbox'
														id={`visible-${field.id}`}
														checked={field.isVisible}
														onChange={() => toggleFieldVisibility(field.id)}
														className='form-checkbox h-4 w-4 text-green-600 transition duration-150 ease-in-out'
													/>
													<label
														htmlFor={`visible-${field.id}`}
														className='mr-2 text-sm text-gray-700 dark:text-gray-300'
													>
														{field.name}
													</label>
												</div>
												<div className='flex space-x-1 space-x-reverse'>
													<button
														onClick={() => reorderFields(field.id, 'up')}
														className='p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
														disabled={field.order === 1}
													>
														<ArrowUp size={14} />
													</button>
													<button
														onClick={() => reorderFields(field.id, 'down')}
														className='p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
														disabled={field.order === measurementFields.length}
													>
														<ArrowDown size={14} />
													</button>
													{field.id.startsWith('custom_') && (
														<button
															onClick={() => deleteField(field.id)}
															className='p-1 text-red-500 hover:text-red-700'
														>
															<X size={14} />
														</button>
													)}
												</div>
											</div>
										))}
								</div>
							</div>

							<div className='flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700'>
								<button
									onClick={() => setShowSettingsModal(false)}
									className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 mr-2 hover:bg-gray-50 dark:hover:bg-gray-700'
								>
									إلغاء
								</button>
								<button
									onClick={applySettings}
									className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
								>
									تطبيق
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Add Field Modal */}
			{showAddFieldModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4'>
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md'>
						<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
							<h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
								إضافة حقل قياس جديد
							</h3>
							<button
								onClick={() => setShowAddFieldModal(false)}
								className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
							>
								<X size={20} />
							</button>
						</div>

						<div className='p-6'>
							<div className='mb-4'>
								<label
									htmlFor='newFieldName'
									className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
								>
									اسم الحقل <span className='text-red-500'>*</span>
								</label>
								<input
									id='newFieldName'
									type='text'
									value={newFieldName}
									onChange={(e) => setNewFieldName(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-gray-100 sm:text-sm'
									placeholder='أدخل اسم حقل القياس'
								/>
							</div>

							<div className='text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-start'>
								<AlertCircle size={16} className='ml-1 mt-0.5 flex-shrink-0' />
								<p>سيتم إضافة الحقل الجديد مع قيمة ابتدائية صفر، ويمكنك تعديلها لاحقاً.</p>
							</div>

							<div className='flex justify-end'>
								<button
									onClick={() => setShowAddFieldModal(false)}
									className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 mr-2 hover:bg-gray-50 dark:hover:bg-gray-700'
								>
									إلغاء
								</button>
								<button
									onClick={addNewField}
									className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
									disabled={!newFieldName.trim()}
								>
									إضافة
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Templates Modal */}
			{showTemplatesModal && (
				<div className='fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4'>
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl'>
						<div className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center'>
							<h3 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
								اختيار قالب القياسات
							</h3>
							<button
								onClick={() => setShowTemplatesModal(false)}
								className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
							>
								<X size={20} />
							</button>
						</div>

						<div className='p-6'>
							<div className='mb-6'>
								<div className='flex space-x-2 space-x-reverse mb-4'>
									<button
										onClick={() => setSelectedCategory('male')}
										className={`px-4 py-2 rounded-md ${
											selectedCategory === 'male'
												? 'bg-blue-600 text-white'
												: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
										}`}
									>
										رجالي
									</button>
								</div>

								<div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
									{templateImages
										.filter((template) => template.category === selectedCategory)
										.map((template) => (
											<div
												key={template.id}
												className='border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors'
												onClick={() => selectTemplateImage(template)}
											>
												<div className='h-48 bg-gray-100 dark:bg-gray-900 relative'>
													<img
														src={template.url}
														alt={template.name}
														className='w-full h-full object-contain'
														onError={(e) => {
															console.error(
																`Error loading template image: ${template.url}`
															);
															// يمكن هنا تعيين صورة بديلة
															// e.currentTarget.src = "/placeholder.png";
														}}
													/>
												</div>
												<div className='p-2 text-center'>
													<h4 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
														{template.name}
													</h4>
												</div>
											</div>
										))}
								</div>
							</div>

							<div className='flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700'>
								<button
									onClick={() => setShowTemplatesModal(false)}
									className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
								>
									إغلاق
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
