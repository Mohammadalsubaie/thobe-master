// app/dashboard/customers/[id]/measurements/new/page.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
	AlertTriangle,
	ArrowRight,
	Camera,
	Check,
	ChevronDown,
	ChevronUp,
	Circle,
	Delete,
	Download,
	Edit,
	Edit3,
	Eraser,
	Image as ImageIcon,
	Loader2,
	Pencil,
	RotateCcw,
	Save,
	Square,
	X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// مخطط التحقق من صحة البيانات
const measurementSchema = z.object({
	name: z.string().min(1, { message: 'يجب إدخال اسم للقياسات' }),
	notes: z.string().optional(),
	// القياسات المختلفة
	length: z.string().optional(),
	shoulder: z.string().optional(),
	chest: z.string().optional(),
	waist: z.string().optional(),
	hips: z.string().optional(),
	sleeve: z.string().optional(),
	neck: z.string().optional(),
	cuff: z.string().optional(),
	armhole: z.string().optional(),
	bicep: z.string().optional(),
});

type MeasurementValues = z.infer<typeof measurementSchema>;

// نوع بيانات العميل
interface Customer {
	id: string;
	name: string;
	phone: string;
	email?: string;
	lastVisit?: Date;
}

// نوع أداة الرسم
type DrawingTool = 'pencil' | 'eraser' | 'marker' | 'text' | 'move' | 'line' | 'rect' | 'circle';

// تنسيقات الخط والألوان المتاحة
const strokeColors = ['#FF0000', '#0000FF', '#008000', '#000000', '#FFA500', '#800080'];
const strokeWidths = [1, 2, 3, 5, 8];
const eraserSizes = [5, 10, 20, 30];

// صورة الثوب (Base64 يمكن استخدامها مباشرة)
const THOBE_TEMPLATE_BASE64 =
	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAGQCAMAAAC3Ycb+AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAMAUExURUdwTGVlZWhoaGVlZWZmZmZmZmVlZWVlZWdnZ2ZmZmZmZmVlZWVlZWZmZmZmZmVlZWVlZWZmZmZmZmVlZWdnZ2ZmZmZmZmZmZv///2ZmZmVlZWZmZmVlZWZmZmZmZmZmZmdnZ2VlZWVlZWdnZ2ZmZmVlZWZmZmZmZmVlZWVlZWZmZmZmZmZmZmZmZmVlZWZmZmVlZWZmZmVlZWZmZmVlZWVlZWZmZmVlZWZmZgAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PD09PT4+Pj8/P0BAQEFBQUJCQkNDQ0REREVFRUZGRkdHR0hISElJSUpKSktLS0xMTE1NTU5OTk9PT1BQUFFRUVJSUlNTU1RUVFVVVVZWVldXV1hYWFlZWVpaWltbW1xcXF1dXV5eXl9fX2BgYGFhYWJiYmNjY2RkZGVlZWZmZmdnZ2hoaGlpaWpqamtra2xsbG1tbW5ubm9vb3BwcHFxcXJycnNzc3R0dHV1dXZ2dnd3d3h4eHl5eXp6ent7e3x8fH19fX5+fn9/f4CAgIGBgYKCgoODg4SEhIWFhYaGhoeHh4iIiImJiYqKiouLi4yMjI2NjY6Ojo+Pj5CQkJGRkZKSkpOTk5SUlJWVlZaWlpeXl5iYmJmZmZqampubm5ycnJ2dnZ6enp+fn6CgoKGhoaKioqOjo6SkpKWlpaampqenp6ioqKmpqaqqqqurq6ysrK2tra6urq+vr7CwsLGxsbKysrOzs7S0tLW1tba2tre3t7i4uLm5ubq6uru7u7y8vL29vb6+vr+/v8DAwMHBwcLCwsPDw8TExMXFxcbGxsfHx8jIyMnJycrKysssV2oAAAClSURBVHja7NvLCcAwDERRKxgXkP5LdQmBPfgRJ3Mq0Nt4t6L+aFSAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAgQIECAAAECBAiQT0HeRAgQIECAAAEyOvYCw9wE43eijEAAAAAASUVORK5CYII=';

export default function NewCustomerMeasurementPage() {
	const params = useParams();
	const router = useRouter();
	const customerId = params.id as string;

	// المراجع للعناصر
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const photoInputRef = useRef<HTMLInputElement>(null);

	// حالة العميل
	const [customer, setCustomer] = useState<Customer | null>(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);

	// حالة الصور والرسم
	const [referenceImage, setReferenceImage] = useState<string | null>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [canvasHistory, setCanvasHistory] = useState<string[]>([]);
	const [historyIndex, setHistoryIndex] = useState(-1);
	const [canvasLoaded, setCanvasLoaded] = useState(false);

	// أدوات الرسم
	const [currentTool, setCurrentTool] = useState<DrawingTool>('pencil');
	const [currentColor, setCurrentColor] = useState(strokeColors[0]);
	const [currentWidth, setCurrentWidth] = useState(strokeWidths[1]);
	const [eraserSize, setEraserSize] = useState(eraserSizes[1]);
	const [showColorPicker, setShowColorPicker] = useState(false);
	const [showWidthPicker, setShowWidthPicker] = useState(false);
	const [showEraserSizePicker, setShowEraserSizePicker] = useState(false);
	const [drawingText, setDrawingText] = useState('');
	const [isEnteringText, setIsEnteringText] = useState(false);
	const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

	// إظهار/إخفاء الأقسام
	const [showBasicInfo, setShowBasicInfo] = useState(true);
	const [showMeasurements, setShowMeasurements] = useState(true);
	const [showCanvas, setShowCanvas] = useState(true);

	// إعداد React Hook Form
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm<MeasurementValues>({
		resolver: zodResolver(measurementSchema),
		defaultValues: {
			name: 'قياسات جديدة',
			notes: '',
		},
	});

	// جلب بيانات العميل
	useEffect(() => {
		const fetchCustomerDetails = async () => {
			try {
				setLoading(true);

				// في التطبيق الحقيقي، هذا سيكون استدعاء API
				await new Promise((resolve) => setTimeout(resolve, 800));

				// بيانات تجريبية للعميل
				const mockCustomer: Customer = {
					id: customerId,
					name: 'محمد أحمد العبدالله',
					phone: '0501234567',
					email: 'mohammed@example.com',
					lastVisit: new Date('2025-03-10'),
				};

				setCustomer(mockCustomer);
			} catch (err) {
				console.error('Error fetching customer details:', err);
				setError('حدث خطأ أثناء تحميل بيانات العميل');
			} finally {
				setLoading(false);
			}
		};

		fetchCustomerDetails();
	}, [customerId]);

	// إعداد الكانفاس - تحسين للمس والرسم
	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;

		// ضبط حجم الكانفاس بناءً على حجم العنصر الحاوي له
		const resizeCanvas = () => {
			const container = canvas.parentElement;
			if (!container) return;

			// ضبط أبعاد الكانفاس بناءً على أبعاد العنصر الحاوي
			const rect = container.getBoundingClientRect();
			const devicePixelRatio = window.devicePixelRatio || 1;

			// ضبط حجم عنصر الكانفاس CSS
			canvas.style.width = `${rect.width}px`;
			canvas.style.height = `${500}px`;

			// ضبط حجم سطح الرسم الفعلي (pixel density للشاشات عالية الدقة)
			canvas.width = rect.width * devicePixelRatio;
			canvas.height = 500 * devicePixelRatio;

			const context = canvas.getContext('2d');
			if (!context) return;

			// تحجيم السياق لمطابقة pixel density
			context.scale(devicePixelRatio, devicePixelRatio);

			// إعداد الخصائص الأولية
			context.lineCap = 'round';
			context.lineJoin = 'round';
			context.globalCompositeOperation = 'source-over';
			context.strokeStyle = currentColor;
			context.lineWidth = currentWidth;
			contextRef.current = context;
		};

		resizeCanvas();

		// تحميل صورة الثوب كخلفية باستخدام صورة Base64 مباشرة
		const loadBackgroundImage = () => {
			const backgroundImage = document.createElement('img') as HTMLImageElement;
			backgroundImage.src = THOBE_TEMPLATE_BASE64;

			backgroundImage.onload = () => {
				if (!contextRef.current || !canvas) return;

				// استخراج أبعاد الكانفاس CSS (المرئية)
				const canvasWidth = parseInt(canvas.style.width);
				const canvasHeight = parseInt(canvas.style.height);

				// رسم الصورة مع الحفاظ على النسبة
				const imageAspectRatio = backgroundImage.width / backgroundImage.height;
				const canvasAspectRatio = canvasWidth / canvasHeight;

				let drawWidth,
					drawHeight,
					offsetX = 0,
					offsetY = 0;

				if (imageAspectRatio > canvasAspectRatio) {
					drawWidth = canvasWidth;
					drawHeight = canvasWidth / imageAspectRatio;
					offsetY = (canvasHeight - drawHeight) / 2;
				} else {
					drawHeight = canvasHeight;
					drawWidth = canvasHeight * imageAspectRatio;
					offsetX = (canvasWidth - drawWidth) / 2;
				}

				// تفريغ الكانفاس أولاً
				contextRef.current.clearRect(0, 0, canvasWidth, canvasHeight);

				// رسم الصورة
				contextRef.current.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);

				// حفظ الحالة الأولية في التاريخ
				const initialState = canvas.toDataURL();
				setCanvasHistory([initialState]);
				setHistoryIndex(0);
				setCanvasLoaded(true);
			};

			// معالجة خطأ تحميل الصورة
			backgroundImage.onerror = () => {
				console.error('Failed to load thobe template image');

				// إنشاء خلفية بديلة
				if (contextRef.current && canvas) {
					const canvasWidth = parseInt(canvas.style.width);
					const canvasHeight = parseInt(canvas.style.height);

					// رسم مستطيل كبير كخلفية
					contextRef.current.fillStyle = '#FFFFFF';
					contextRef.current.fillRect(0, 0, canvasWidth, canvasHeight);

					// رسم مخطط ثوب بسيط
					contextRef.current.strokeStyle = '#CCCCCC';
					contextRef.current.lineWidth = 2;

					const centerX = canvasWidth / 2;
					// رسم شكل الثوب البسيط
					contextRef.current.beginPath();
					// الكتف
					contextRef.current.moveTo(centerX - 60, 50);
					contextRef.current.lineTo(centerX + 60, 50);
					// الجسم
					contextRef.current.moveTo(centerX - 60, 50);
					contextRef.current.lineTo(centerX - 80, 400);
					contextRef.current.moveTo(centerX + 60, 50);
					contextRef.current.lineTo(centerX + 80, 400);
					// خط الأسفل
					contextRef.current.moveTo(centerX - 80, 400);
					contextRef.current.lineTo(centerX + 80, 400);
					// الرقبة
					contextRef.current.moveTo(centerX - 20, 50);
					contextRef.current.lineTo(centerX, 70);
					contextRef.current.lineTo(centerX + 20, 50);

					// الأكمام
					contextRef.current.moveTo(centerX - 60, 50);
					contextRef.current.lineTo(centerX - 100, 150);
					contextRef.current.moveTo(centerX + 60, 50);
					contextRef.current.lineTo(centerX + 100, 150);

					contextRef.current.stroke();

					// حفظ الحالة الأولية
					const initialState = canvas.toDataURL();
					setCanvasHistory([initialState]);
					setHistoryIndex(0);
					setCanvasLoaded(true);
				}
			};
		};

		loadBackgroundImage();

		// التعامل مع تغيير حجم الشاشة
		const handleResize = () => {
			if (!canvasRef.current || !contextRef.current) return;

			// حفظ الحالة الحالية
			const currentState = canvasRef.current.toDataURL();

			// إعادة تعيين حجم الكانفاس
			resizeCanvas();

			// استعادة الحالة
			const img = document.createElement('img') as HTMLImageElement;
			img.src = currentState;
			img.onload = () => {
				if (!contextRef.current || !canvasRef.current) return;

				const canvasWidth = parseInt(canvasRef.current.style.width);
				const canvasHeight = parseInt(canvasRef.current.style.height);

				contextRef.current.clearRect(0, 0, canvasWidth, canvasHeight);
				contextRef.current.drawImage(img, 0, 0, canvasWidth, canvasHeight);
			};
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [currentColor, currentWidth]);

	// تحديث خصائص الرسم عند تغيير الأداة
	useEffect(() => {
		if (!contextRef.current) return;

		if (currentTool === 'eraser') {
			contextRef.current.globalCompositeOperation = 'destination-out';
			contextRef.current.lineWidth = eraserSize;
		} else {
			contextRef.current.globalCompositeOperation = 'source-over';
			contextRef.current.strokeStyle = currentColor;
			contextRef.current.lineWidth = currentWidth;
		}
	}, [currentTool, currentColor, currentWidth, eraserSize]);

	// معالجات أحداث الرسم - تحسين للمس
	// بدء الرسم - يدعم اللمس والماوس
	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (!contextRef.current || !canvasRef.current) return;

		e.preventDefault(); // منع السلوك الافتراضي مثل التمرير عند اللمس

		const { offsetX, offsetY } = getPointerPosition(e);

		if (currentTool === 'text') {
			setTextPosition({ x: offsetX, y: offsetY });
			setIsEnteringText(true);
			return;
		}

		if (currentTool === 'line' || currentTool === 'rect' || currentTool === 'circle') {
			setStartPoint({ x: offsetX, y: offsetY });
		}

		contextRef.current.beginPath();
		contextRef.current.moveTo(offsetX, offsetY);
		setIsDrawing(true);
	};

	// الرسم المستمر - يدعم اللمس والماوس
	const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (!isDrawing || !contextRef.current || !canvasRef.current) return;

		e.preventDefault(); // منع السلوك الافتراضي

		const { offsetX, offsetY } = getPointerPosition(e);

		const canvasWidth = parseInt(canvasRef.current.style.width);
		const canvasHeight = parseInt(canvasRef.current.style.height);

		if (currentTool === 'pencil' || currentTool === 'eraser' || currentTool === 'marker') {
			contextRef.current.lineTo(offsetX, offsetY);
			contextRef.current.stroke();
		} else if (currentTool === 'line') {
			// إعادة رسم الصورة من الحالة الأخيرة
			const lastState = canvasHistory[historyIndex];
			const img = document.createElement('img') as HTMLImageElement;
			img.src = lastState;

			img.onload = () => {
				if (!contextRef.current || !canvasRef.current) return;

				// مسح الكانفاس ورسم الحالة السابقة
				contextRef.current.clearRect(0, 0, canvasWidth, canvasHeight);
				contextRef.current.drawImage(img, 0, 0, canvasWidth, canvasHeight);

				// رسم الخط الجديد
				contextRef.current.beginPath();
				contextRef.current.moveTo(startPoint.x, startPoint.y);
				contextRef.current.lineTo(offsetX, offsetY);
				contextRef.current.stroke();
			};
		} else if (currentTool === 'rect') {
			const lastState = canvasHistory[historyIndex];
			const img = document.createElement('img') as HTMLImageElement;
			img.src = lastState;

			img.onload = () => {
				if (!contextRef.current || !canvasRef.current) return;

				contextRef.current.clearRect(0, 0, canvasWidth, canvasHeight);
				contextRef.current.drawImage(img, 0, 0, canvasWidth, canvasHeight);

				contextRef.current.beginPath();
				contextRef.current.rect(startPoint.x, startPoint.y, offsetX - startPoint.x, offsetY - startPoint.y);
				contextRef.current.stroke();
			};
		} else if (currentTool === 'circle') {
			const lastState = canvasHistory[historyIndex];
			const img = document.createElement('img') as HTMLImageElement;
			img.src = lastState;

			img.onload = () => {
				if (!contextRef.current || !canvasRef.current) return;

				contextRef.current.clearRect(0, 0, canvasWidth, canvasHeight);
				contextRef.current.drawImage(img, 0, 0, canvasWidth, canvasHeight);

				const radius = Math.sqrt(Math.pow(offsetX - startPoint.x, 2) + Math.pow(offsetY - startPoint.y, 2));

				contextRef.current.beginPath();
				contextRef.current.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
				contextRef.current.stroke();
			};
		}
	};

	// إنهاء الرسم - يدعم اللمس والماوس
	const endDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (!contextRef.current || !canvasRef.current || !isDrawing) return;

		e.preventDefault(); // منع السلوك الافتراضي

		if (currentTool === 'text') {
			return; // التعامل مع النص يحدث عند الضغط على زر الإضافة
		}

		contextRef.current.closePath();
		setIsDrawing(false);

		// إضافة الحالة الجديدة إلى التاريخ
		const newState = canvasRef.current.toDataURL();

		// إزالة الحالات المستقبلية إذا كانت موجودة (في حالة التراجع ثم الرسم مرة أخرى)
		const newHistory = canvasHistory.slice(0, historyIndex + 1);
		newHistory.push(newState);

		setCanvasHistory(newHistory);
		setHistoryIndex(newHistory.length - 1);
	};

	// نقطة بداية الرسم للأشكال
	const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

	// الحصول على موضع المؤشر (يدعم اللمس والماوس)
	const getPointerPosition = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
		if (!canvasRef.current) {
			return { offsetX: 0, offsetY: 0 };
		}

		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();

		// معالجة أحداث اللمس
		if ('touches' in e) {
			const touch = e.touches[0] || e.changedTouches[0];
			return {
				offsetX: touch.clientX - rect.left,
				offsetY: touch.clientY - rect.top,
			};
		}

		// معالجة أحداث الماوس
		return {
			offsetX: e.clientX - rect.left,
			offsetY: e.clientY - rect.top,
		};
	};

	// إضافة نص
	const addText = () => {
		if (!contextRef.current || !drawingText.trim() || !isEnteringText || !canvasRef.current) return;

		contextRef.current.font = `${currentWidth * 5}px Arial`;
		contextRef.current.fillStyle = currentColor;
		contextRef.current.fillText(drawingText, textPosition.x, textPosition.y);

		// إضافة الحالة الجديدة إلى التاريخ
		const newState = canvasRef.current.toDataURL();
		const newHistory = canvasHistory.slice(0, historyIndex + 1);
		newHistory.push(newState);

		setCanvasHistory(newHistory);
		setHistoryIndex(newHistory.length - 1);

		// إعادة تعيين حالة النص
		setDrawingText('');
		setIsEnteringText(false);
	};

	// التراجع عن الخطوة الأخيرة
	const undo = () => {
		if (historyIndex > 0 && canvasRef.current && contextRef.current) {
			setHistoryIndex(historyIndex - 1);

			const img = document.createElement('img') as HTMLImageElement;
			img.src = canvasHistory[historyIndex - 1];
			img.onload = () => {
				if (!contextRef.current || !canvasRef.current) return;

				const canvasWidth = parseInt(canvasRef.current.style.width);
				const canvasHeight = parseInt(canvasRef.current.style.height);

				contextRef.current.clearRect(0, 0, canvasWidth, canvasHeight);
				contextRef.current.drawImage(img, 0, 0, canvasWidth, canvasHeight);
			};
		}
	};

	// إعادة الخطوة
	const redo = () => {
		if (historyIndex < canvasHistory.length - 1 && canvasRef.current && contextRef.current) {
			setHistoryIndex(historyIndex + 1);

			const img = document.createElement('img') as HTMLImageElement;
			img.src = canvasHistory[historyIndex + 1];
			img.onload = () => {
				if (!contextRef.current || !canvasRef.current) return;

				const canvasWidth = parseInt(canvasRef.current.style.width);
				const canvasHeight = parseInt(canvasRef.current.style.height);

				contextRef.current.clearRect(0, 0, canvasWidth, canvasHeight);
				contextRef.current.drawImage(img, 0, 0, canvasWidth, canvasHeight);
			};
		}
	};

	// مسح الكانفاس وإعادة رسم الخلفية
	const clearCanvas = () => {
		if (!contextRef.current || !canvasRef.current || !canvasLoaded) return;

		const confirmClear = window.confirm('هل أنت متأكد من رغبتك في مسح كل الرسومات؟');
		if (!confirmClear) return;

		// إعادة تحميل صورة الثوب فقط
		const backgroundImage = document.createElement('img') as HTMLImageElement;
		backgroundImage.src = THOBE_TEMPLATE_BASE64;
		backgroundImage.onload = () => {
			if (!contextRef.current || !canvasRef.current) return;

			const canvasWidth = parseInt(canvasRef.current.style.width);
			const canvasHeight = parseInt(canvasRef.current.style.height);

			contextRef.current.clearRect(0, 0, canvasWidth, canvasHeight);

			// رسم الصورة مع الحفاظ على النسبة
			const imageAspectRatio = backgroundImage.width / backgroundImage.height;
			const canvasAspectRatio = canvasWidth / canvasHeight;

			let drawWidth,
				drawHeight,
				offsetX = 0,
				offsetY = 0;

			if (imageAspectRatio > canvasAspectRatio) {
				drawWidth = canvasWidth;
				drawHeight = canvasWidth / imageAspectRatio;
				offsetY = (canvasHeight - drawHeight) / 2;
			} else {
				drawHeight = canvasHeight;
				drawWidth = canvasHeight * imageAspectRatio;
				offsetX = (canvasWidth - drawWidth) / 2;
			}

			contextRef.current.drawImage(backgroundImage, offsetX, offsetY, drawWidth, drawHeight);

			// إضافة الحالة الجديدة إلى التاريخ
			const newState = canvasRef.current.toDataURL();
			setCanvasHistory([...canvasHistory, newState]);
			setHistoryIndex(canvasHistory.length);
		};

		// في حالة فشل تحميل الصورة، سنقوم برسم خلفية فارغة
		backgroundImage.onerror = () => {
			if (!contextRef.current || !canvasRef.current) return;

			const canvasWidth = parseInt(canvasRef.current.style.width);
			const canvasHeight = parseInt(canvasRef.current.style.height);

			contextRef.current.clearRect(0, 0, canvasWidth, canvasHeight);
			contextRef.current.fillStyle = '#FFFFFF';
			contextRef.current.fillRect(0, 0, canvasWidth, canvasHeight);

			// رسم مخطط ثوب بسيط
			contextRef.current.strokeStyle = '#CCCCCC';
			contextRef.current.lineWidth = 2;

			const centerX = canvasWidth / 2;
			// رسم شكل الثوب البسيط
			contextRef.current.beginPath();
			// الكتف
			contextRef.current.moveTo(centerX - 60, 50);
			contextRef.current.lineTo(centerX + 60, 50);
			// الجسم
			contextRef.current.moveTo(centerX - 60, 50);
			contextRef.current.lineTo(centerX - 80, 400);
			contextRef.current.moveTo(centerX + 60, 50);
			contextRef.current.lineTo(centerX + 80, 400);
			// خط الأسفل
			contextRef.current.moveTo(centerX - 80, 400);
			contextRef.current.lineTo(centerX + 80, 400);
			// الرقبة
			contextRef.current.moveTo(centerX - 20, 50);
			contextRef.current.lineTo(centerX, 70);
			contextRef.current.lineTo(centerX + 20, 50);

			// الأكمام
			contextRef.current.moveTo(centerX - 60, 50);
			contextRef.current.lineTo(centerX - 100, 150);
			contextRef.current.moveTo(centerX + 60, 50);
			contextRef.current.lineTo(centerX + 100, 150);

			contextRef.current.stroke();

			// إضافة الحالة الجديدة إلى التاريخ
			const newState = canvasRef.current.toDataURL();
			setCanvasHistory([...canvasHistory, newState]);
			setHistoryIndex(canvasHistory.length);

			// استعادة خصائص الرسم الأصلية
			if (currentTool === 'eraser') {
				contextRef.current.globalCompositeOperation = 'destination-out';
				contextRef.current.lineWidth = eraserSize;
			} else {
				contextRef.current.globalCompositeOperation = 'source-over';
				contextRef.current.strokeStyle = currentColor;
				contextRef.current.lineWidth = currentWidth;
			}
		};
	};

	// تحميل صورة مرجعية
	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			const reader = new FileReader();

			reader.onload = () => {
				if (typeof reader.result === 'string') {
					setReferenceImage(reader.result);
				}
			};

			reader.readAsDataURL(file);
		}
	};

	// التقاط صورة من الكاميرا
	const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			const reader = new FileReader();

			reader.onload = () => {
				if (typeof reader.result === 'string') {
					setReferenceImage(reader.result);
				}
			};

			reader.readAsDataURL(file);
		}
	};

	// حذف الصورة المرجعية
	const removeReferenceImage = () => {
		setReferenceImage(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = '';
		}
		if (photoInputRef.current) {
			photoInputRef.current.value = '';
		}
	};

	// تحميل الكانفاس كصورة
	const downloadCanvas = () => {
		if (!canvasRef.current) return;

		const link = document.createElement('a');
		link.download = `${customer?.name || 'عميل'}_قياسات_${new Date().toISOString().split('T')[0]}.png`;
		link.href = canvasRef.current.toDataURL();
		link.click();
	};

	// تقديم النموذج
	const onSubmit = handleSubmit(async (data) => {
		try {
			setSubmitting(true);
			setError(null);

			// إضافة بيانات الكانفاس والصور إلى البيانات المرسلة
			const formData = {
				...data,
				canvasImage: canvasRef.current?.toDataURL() || null,
				referenceImage: referenceImage,
			};

			console.log('Form data to submit:', formData);

			// في التطبيق الحقيقي، هذا سيكون استدعاء API
			await new Promise((resolve) => setTimeout(resolve, 1500));

			setSuccess(true);

			// إعادة التوجيه بعد النجاح
			setTimeout(() => {
				router.push(`/dashboard/customers/${customerId}/measurements`);
			}, 1500);
		} catch (err) {
			console.error('Error submitting form:', err);
			setError('حدث خطأ أثناء حفظ البيانات. الرجاء المحاولة مرة أخرى.');
			setSubmitting(false);
		}
	});

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'></div>
				<span className='mr-2 text-gray-700 dark:text-gray-300'>جاري تحميل البيانات...</span>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-wrap justify-between items-center'>
				<div>
					<div className='flex items-center mb-1'>
						<Link
							href={`/dashboard/customers/${customerId}/measurements`}
							className='text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light mr-2'
						>
							<ArrowRight className='h-5 w-5' />
						</Link>
						<h1 className='text-xl font-bold text-gray-800 dark:text-gray-100'>
							إضافة قياسات جديدة - {customer?.name}
						</h1>
					</div>
					<p className='text-gray-500 dark:text-gray-400 text-sm'>
						إضافة تفاصيل القياسات مع إمكانية الرسم لتوضيح التعديلات الخاصة
					</p>
				</div>

				<div className='flex mt-4 md:mt-0 space-x-3 space-x-reverse'>
					<Link
						href={`/dashboard/customers/${customerId}/measurements`}
						className='inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
					>
						<X className='ml-1.5 -mr-1 h-4 w-4' />
						إلغاء
					</Link>

					<button
						type='button'
						onClick={() =>
							document
								.getElementById('measurementForm')
								?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
						}
						disabled={submitting || success}
						className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed'
					>
						{submitting ? (
							<>
								<Loader2 className='ml-1.5 -mr-1 h-4 w-4 animate-spin' />
								جاري الحفظ...
							</>
						) : success ? (
							<>
								<Check className='ml-1.5 -mr-1 h-4 w-4' />
								تم الحفظ بنجاح
							</>
						) : (
							<>
								<Save className='ml-1.5 -mr-1 h-4 w-4' />
								حفظ القياسات
							</>
						)}
					</button>
				</div>
			</div>

			{/* رسالة الخطأ */}
			{error && (
				<div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-md'>
					<div className='flex'>
						<AlertTriangle className='h-5 w-5 text-red-500 dark:text-red-400 ml-2' />
						<div className='text-red-700 dark:text-red-400'>{error}</div>
					</div>
				</div>
			)}

			{/* نموذج القياسات */}
			<form id='measurementForm' onSubmit={onSubmit} className='space-y-6'>
				<div className='grid grid-cols-1 lg:grid-cols-7 gap-6'>
					{/* العمود الأول: معلومات أساسية والقياسات */}
					<div className='lg:col-span-3 space-y-6'>
						{/* معلومات أساسية */}
						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div
								className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer'
								onClick={() => setShowBasicInfo(!showBasicInfo)}
							>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>معلومات أساسية</h2>
								<button
									type='button'
									className='text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400'
								>
									{showBasicInfo ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
								</button>
							</div>

							{showBasicInfo && (
								<div className='p-6 space-y-4'>
									{/* اسم القياسات */}
									<div>
										<label
											htmlFor='name'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300'
										>
											اسم القياسات <span className='text-red-500'>*</span>
										</label>
										<input
											id='name'
											type='text'
											{...register('name')}
											className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
										/>
										{errors.name && (
											<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
												{errors.name.message}
											</p>
										)}
									</div>

									{/* زر تحميل صورة مرجعية */}
									<div>
										<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
											صورة مرجعية (اختياري)
										</label>

										<div className='space-y-3'>
											{!referenceImage ? (
												<div className='flex space-x-2 space-x-reverse'>
													<button
														type='button'
														onClick={() => fileInputRef.current?.click()}
														className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
													>
														<ImageIcon className='ml-1.5 -mr-1 h-4 w-4' />
														تحميل صورة
													</button>

													<button
														type='button'
														onClick={() => photoInputRef.current?.click()}
														className='inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
													>
														<Camera className='ml-1.5 -mr-1 h-4 w-4' />
														التقاط صورة
													</button>

													<input
														ref={fileInputRef}
														type='file'
														accept='image/*'
														onChange={handleImageUpload}
														className='hidden'
													/>

													<input
														ref={photoInputRef}
														type='file'
														accept='image/*'
														capture='environment'
														onChange={handleCameraCapture}
														className='hidden'
													/>
												</div>
											) : (
												<div className='relative'>
													<div className='relative h-48 rounded-md overflow-hidden'>
														<Image
															src={referenceImage}
															alt='صورة مرجعية'
															fill
															sizes='(max-width: 768px) 100vw, 300px'
															className='object-contain'
														/>
													</div>
													<button
														type='button'
														onClick={removeReferenceImage}
														className='absolute top-2 left-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
													>
														<X className='h-4 w-4' />
													</button>
												</div>
											)}
										</div>
									</div>

									{/* ملاحظات */}
									<div>
										<label
											htmlFor='notes'
											className='block text-sm font-medium text-gray-700 dark:text-gray-300'
										>
											ملاحظات
										</label>
										<textarea
											id='notes'
											{...register('notes')}
											rows={3}
											className='mt-1 block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
											placeholder='أي ملاحظات إضافية عن القياسات أو التعديلات المطلوبة...'
										></textarea>
									</div>
								</div>
							)}
						</div>

						{/* القياسات */}
						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div
								className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer'
								onClick={() => setShowMeasurements(!showMeasurements)}
							>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>القياسات</h2>
								<button
									type='button'
									className='text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400'
								>
									{showMeasurements ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
								</button>
							</div>

							{showMeasurements && (
								<div className='p-6'>
									<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
										{/* القياسات الأساسية */}
										<div>
											<label
												htmlFor='length'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												الطول
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<input
													id='length'
													type='text'
													{...register('length')}
													className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												/>
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
														سم
													</span>
												</div>
											</div>
										</div>

										<div>
											<label
												htmlFor='shoulder'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												الكتف
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<input
													id='shoulder'
													type='text'
													{...register('shoulder')}
													className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												/>
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
														سم
													</span>
												</div>
											</div>
										</div>

										<div>
											<label
												htmlFor='chest'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												الصدر
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<input
													id='chest'
													type='text'
													{...register('chest')}
													className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												/>
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
														سم
													</span>
												</div>
											</div>
										</div>

										<div>
											<label
												htmlFor='waist'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												الخصر
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<input
													id='waist'
													type='text'
													{...register('waist')}
													className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												/>
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
														سم
													</span>
												</div>
											</div>
										</div>

										<div>
											<label
												htmlFor='hips'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												الأرداف
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<input
													id='hips'
													type='text'
													{...register('hips')}
													className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												/>
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
														سم
													</span>
												</div>
											</div>
										</div>

										<div>
											<label
												htmlFor='sleeve'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												طول الكم
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<input
													id='sleeve'
													type='text'
													{...register('sleeve')}
													className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												/>
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
														سم
													</span>
												</div>
											</div>
										</div>

										<div>
											<label
												htmlFor='neck'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												الرقبة
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<input
													id='neck'
													type='text'
													{...register('neck')}
													className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												/>
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
														سم
													</span>
												</div>
											</div>
										</div>

										<div>
											<label
												htmlFor='cuff'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												الأسورة
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<input
													id='cuff'
													type='text'
													{...register('cuff')}
													className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												/>
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
														سم
													</span>
												</div>
											</div>
										</div>

										<div>
											<label
												htmlFor='armhole'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												حفرة الإبط
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<input
													id='armhole'
													type='text'
													{...register('armhole')}
													className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												/>
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
														سم
													</span>
												</div>
											</div>
										</div>

										<div>
											<label
												htmlFor='bicep'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												العضد
											</label>
											<div className='mt-1 relative rounded-md shadow-sm'>
												<input
													id='bicep'
													type='text'
													{...register('bicep')}
													className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
												/>
												<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
													<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
														سم
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>

					{/* العمود الثاني: لوحة الرسم */}
					<div className='lg:col-span-4 space-y-6'>
						<div className='bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900 rounded-lg overflow-hidden'>
							<div
								className='px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer'
								onClick={() => setShowCanvas(!showCanvas)}
							>
								<h2 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
									لوحة الرسم والتعديلات
								</h2>
								<div className='flex items-center'>
									<button
										type='button'
										onClick={(e) => {
											e.stopPropagation();
											downloadCanvas();
										}}
										className='ml-2 text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary-light'
									>
										<Download className='h-5 w-5' />
									</button>
									<button
										type='button'
										className='text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400'
									>
										{showCanvas ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
									</button>
								</div>
							</div>

							{showCanvas && (
								<>
									{/* أدوات الرسم */}
									<div className='p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 overflow-x-auto'>
										<div className='flex space-x-2 space-x-reverse'>
											{/* أدوات الرسم */}
											<div className='flex space-x-1 space-x-reverse'>
												<button
													type='button'
													onClick={() => setCurrentTool('pencil')}
													className={`p-2 rounded ${
														currentTool === 'pencil'
															? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
															: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
													}`}
													title='قلم رصاص'
												>
													<Pencil className='h-5 w-5' />
												</button>

												<button
													type='button'
													onClick={() => setCurrentTool('marker')}
													className={`p-2 rounded ${
														currentTool === 'marker'
															? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
															: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
													}`}
													title='قلم تحديد'
												>
													<Edit3 className='h-5 w-5' />
												</button>

												<button
													type='button'
													onClick={() => setCurrentTool('eraser')}
													className={`p-2 rounded ${
														currentTool === 'eraser'
															? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
															: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
													}`}
													title='ممحاة'
												>
													<Eraser className='h-5 w-5' />
												</button>

												<button
													type='button'
													onClick={() => setCurrentTool('text')}
													className={`p-2 rounded ${
														currentTool === 'text'
															? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
															: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
													}`}
													title='نص'
												>
													<Edit className='h-5 w-5' />
												</button>

												<button
													type='button'
													onClick={() => setCurrentTool('line')}
													className={`p-2 rounded ${
														currentTool === 'line'
															? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
															: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
													}`}
													title='خط'
												>
													<div className='h-5 w-5 flex items-center justify-center'>
														<div className='h-0.5 w-4 bg-current transform rotate-45'></div>
													</div>
												</button>

												<button
													type='button'
													onClick={() => setCurrentTool('rect')}
													className={`p-2 rounded ${
														currentTool === 'rect'
															? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
															: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
													}`}
													title='مستطيل'
												>
													<Square className='h-5 w-5' />
												</button>

												<button
													type='button'
													onClick={() => setCurrentTool('circle')}
													className={`p-2 rounded ${
														currentTool === 'circle'
															? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
															: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
													}`}
													title='دائرة'
												>
													<Circle className='h-5 w-5' />
												</button>
											</div>

											<div className='h-8 border-r border-gray-300 dark:border-gray-600 mx-1'></div>

											{/* اللون */}
											<div className='relative'>
												<button
													type='button'
													onClick={() => setShowColorPicker(!showColorPicker)}
													className='p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center'
													title='اللون'
												>
													<div
														className='h-5 w-5 rounded-full border border-gray-300 dark:border-gray-600'
														style={{ backgroundColor: currentColor }}
													></div>
													<ChevronDown className='h-4 w-4 mr-1' />
												</button>

												{showColorPicker && (
													<div className='absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-2'>
														<div className='grid grid-cols-3 gap-2'>
															{strokeColors.map((color) => (
																<button
																	key={color}
																	type='button'
																	onClick={() => {
																		setCurrentColor(color);
																		setShowColorPicker(false);
																	}}
																	className={`h-8 w-8 rounded-full border-2 ${
																		currentColor === color
																			? 'border-gray-800 dark:border-gray-200'
																			: 'border-gray-300 dark:border-gray-600'
																	}`}
																	style={{ backgroundColor: color }}
																></button>
															))}
														</div>
													</div>
												)}
											</div>

											{/* سمك الخط */}
											{currentTool !== 'eraser' && (
												<div className='relative'>
													<button
														type='button'
														onClick={() => setShowWidthPicker(!showWidthPicker)}
														className='p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center'
														title='سمك الخط'
													>
														<div className='h-5 w-5 flex items-center justify-center'>
															<div
																className='bg-gray-700 dark:bg-gray-300 rounded-full'
																style={{
																	height: `${Math.min(currentWidth * 2, 20)}px`,
																	width: `${Math.min(currentWidth * 2, 20)}px`,
																}}
															></div>
														</div>
														<ChevronDown className='h-4 w-4 mr-1' />
													</button>

													{showWidthPicker && (
														<div className='absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-2'>
															<div className='space-y-2'>
																{strokeWidths.map((width) => (
																	<button
																		key={width}
																		type='button'
																		onClick={() => {
																			setCurrentWidth(width);
																			setShowWidthPicker(false);
																		}}
																		className={`flex items-center p-2 w-full hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
																			currentWidth === width
																				? 'bg-gray-100 dark:bg-gray-700'
																				: ''
																		}`}
																	>
																		<div
																			className='h-5 bg-gray-700 dark:bg-gray-300 rounded-full mr-2'
																			style={{ width: `${width * 2}px` }}
																		></div>
																		<span>{width}px</span>
																	</button>
																))}
															</div>
														</div>
													)}
												</div>
											)}

											{/* حجم الممحاة */}
											{currentTool === 'eraser' && (
												<div className='relative'>
													<button
														type='button'
														onClick={() => setShowEraserSizePicker(!showEraserSizePicker)}
														className='p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center'
														title='حجم الممحاة'
													>
														<div className='h-5 w-5 flex items-center justify-center'>
															<div
																className='border-2 border-gray-500 dark:border-gray-400 rounded-full'
																style={{
																	height: `${Math.min(eraserSize, 20)}px`,
																	width: `${Math.min(eraserSize, 20)}px`,
																}}
															></div>
														</div>
														<ChevronDown className='h-4 w-4 mr-1' />
													</button>

													{showEraserSizePicker && (
														<div className='absolute z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-2'>
															<div className='space-y-2'>
																{eraserSizes.map((size) => (
																	<button
																		key={size}
																		type='button'
																		onClick={() => {
																			setEraserSize(size);
																			setShowEraserSizePicker(false);
																		}}
																		className={`flex items-center p-2 w-full hover:bg-gray-100 dark:hover:bg-gray-700 rounded ${
																			eraserSize === size
																				? 'bg-gray-100 dark:bg-gray-700'
																				: ''
																		}`}
																	>
																		<div
																			className='border-2 border-gray-500 dark:border-gray-400 rounded-full mr-2'
																			style={{
																				height: `${size}px`,
																				width: `${size}px`,
																			}}
																		></div>
																		<span>{size}px</span>
																	</button>
																))}
															</div>
														</div>
													)}
												</div>
											)}

											<div className='h-8 border-r border-gray-300 dark:border-gray-600 mx-1'></div>

											{/* التراجع وإعادة */}
											<button
												type='button'
												onClick={undo}
												disabled={historyIndex <= 0}
												className='p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
												title='تراجع'
											>
												<RotateCcw className='h-5 w-5' />
											</button>

											<button
												type='button'
												onClick={redo}
												disabled={historyIndex >= canvasHistory.length - 1}
												className='p-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
												title='إعادة'
											>
												<svg
													className='h-5 w-5'
													fill='none'
													viewBox='0 0 24 24'
													stroke='currentColor'
													transform='scale(-1, 1)'
												>
													<path
														strokeLinecap='round'
														strokeLinejoin='round'
														strokeWidth={2}
														d='M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
													/>
												</svg>
											</button>

											<button
												type='button'
												onClick={clearCanvas}
												className='p-2 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
												title='مسح الكل'
											>
												<Delete className='h-5 w-5' />
											</button>
										</div>

										{/* إدخال النص */}
										{isEnteringText && (
											<div className='mt-2 flex space-x-2 space-x-reverse'>
												<input
													type='text'
													value={drawingText}
													onChange={(e) => setDrawingText(e.target.value)}
													placeholder='أدخل النص هنا...'
													className='flex-1 py-1 px-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-700 dark:text-gray-100'
													autoFocus
												/>
												<button
													type='button'
													onClick={addText}
													className='px-3 py-1 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
												>
													إضافة
												</button>
												<button
													type='button'
													onClick={() => setIsEnteringText(false)}
													className='px-3 py-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
												>
													إلغاء
												</button>
											</div>
										)}
									</div>

									{/* لوحة الرسم */}
									<div className='p-4 flex justify-center bg-gray-100 dark:bg-gray-900 min-h-[500px]'>
										<canvas
											ref={canvasRef}
											onMouseDown={startDrawing}
											onMouseMove={draw}
											onMouseUp={endDrawing}
											onMouseLeave={endDrawing}
											onTouchStart={startDrawing}
											onTouchMove={draw}
											onTouchEnd={endDrawing}
											onTouchCancel={endDrawing}
											className='border border-gray-300 dark:border-gray-600 rounded shadow-sm w-full max-w-3xl h-[500px] bg-white dark:bg-gray-800 cursor-crosshair touch-none'
										></canvas>
									</div>
								</>
							)}
						</div>
					</div>
				</div>

				{/* أزرار التحكم السفلية */}
				<div className='flex justify-end space-x-3 space-x-reverse'>
					<Link
						href={`/dashboard/customers/${customerId}/measurements`}
						className='px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
					>
						إلغاء
					</Link>

					<button
						type='submit'
						disabled={submitting || success}
						className='px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed'
					>
						{submitting ? (
							<>
								<Loader2 className='inline-block ml-1.5 -mr-1 h-4 w-4 animate-spin' />
								جاري الحفظ...
							</>
						) : success ? (
							<>
								<Check className='inline-block ml-1.5 -mr-1 h-4 w-4' />
								تم الحفظ بنجاح
							</>
						) : (
							<>
								<Save className='inline-block ml-1.5 -mr-1 h-4 w-4' />
								حفظ القياسات
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
