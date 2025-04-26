'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  RotateCcw, 
  CircleDot, 
  Square, 
  Circle, 
  ChevronDown,
  PenLine,
  Upload,
  Download,
  Image
} from 'lucide-react';

export default function NewMeasurementPage() {
	const params = useParams();
	const router = useRouter();
	const customerId = params.id as string;

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [lines, setLines] = useState<Array<Array<[number, number]>>>([]);
	const [currentLine, setCurrentLine] = useState<Array<[number, number]>>([]);
	const [selectedTool, setSelectedTool] = useState<string>('pen');
	const [selectedColor, setSelectedColor] = useState<string>('#FF0000');
	const fileInputRef = useRef<HTMLInputElement>(null);
	const canvasRef = useRef<HTMLDivElement>(null);
	const [measurementName, setMeasurementName] = useState<string>('قياسات جديدة');
  
  // Measurement fields
  const [measurements, setMeasurements] = useState({
    length: '', // الطول
    shoulderWidth: '', // الكتف
    chestWidth: '', // الصدر
    waistWidth: '', // الخصر
    sleeveLength: '', // طول الكم
    wristWidth: '', // الرسغ
    neckWidth: '', // الياقة
  });

  const handleInputChange = (field: string, value: string) => {
    setMeasurements({
      ...measurements,
      [field]: value
    });
  };

	// Handle form submission
	const handleSubmit = async () => {
		setIsSubmitting(true);
		try {
			// Combine all data
			const formData = {
				...measurements,
				name: measurementName,
				drawingData: lines,
				backgroundImage: backgroundImage
			};
			
			console.log('Submitting measurement data:', formData);
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Redirect to customer details page
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

	// Drawing functionality
	const startDrawing = (e: React.MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		
		setIsDrawing(true);
		setCurrentLine([[x, y]]);
	};

	const draw = (e: React.MouseEvent) => {
		if (!isDrawing) return;
		
		const canvas = canvasRef.current;
		if (!canvas) return;
		
		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		
		setCurrentLine(prevLine => [...prevLine, [x, y]]);
	};

	const endDrawing = () => {
		if (isDrawing && currentLine.length > 1) {
			setLines([...lines, currentLine]);
			setCurrentLine([]);
		}
		setIsDrawing(false);
	};

	// Clear all drawings
	const clearDrawings = () => {
		setLines([]);
		setCurrentLine([]);
	};

	// Render a line
	const renderLine = (line: Array<[number, number]>, index: number | string) => {
		if (line.length < 2) return null;
		
		let pathData = `M ${line[0][0]} ${line[0][1]}`;
		for (let i = 1; i < line.length; i++) {
			pathData += ` L ${line[i][0]} ${line[i][1]}`;
		}
		
		return <path key={index.toString()} d={pathData} stroke={selectedColor} strokeWidth="2" fill="none" />;
	};

	return (
		<div className='min-h-screen bg-gray-50'>
			<div className='px-6 py-4 bg-white shadow-sm flex items-center justify-between'>
				<div className='flex items-center'>
					<Link href={`/dashboard/customers/${customerId}`} className='text-gray-500 hover:text-gray-700 ml-2'>
						<ArrowLeft size={20} />
					</Link>
					<h1 className='text-xl font-bold text-gray-800'>إضافة قياسات جديدة - محمد أحمد العبدالله</h1>
				</div>
				<div>
					<button 
						onClick={() => handleSubmit()} 
						className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
						disabled={isSubmitting}
					>
						{isSubmitting ? 'جاري الحفظ...' : 'حفظ القياسات'}
					</button>
					<button 
						onClick={() => router.push(`/dashboard/customers/${customerId}`)}
						className='mr-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50'
					>
						إلغاء
					</button>
				</div>
			</div>

			<div className='flex'>
				{/* Main content */}
				<div className='flex-1 p-6'>
					<div className='flex flex-col md:flex-row gap-6'>
						{/* Drawing panel */}
						<div className='bg-white rounded-lg shadow-sm p-4 flex-1'>
							<div className='border-b border-gray-200 pb-3 mb-3'>
								<h2 className='text-lg font-medium text-gray-900'>لوحة الرسم والتعديلات</h2>
							</div>
							
							{/* Drawing tools */}
							<div className='flex items-center mb-4 gap-2'>
								<button 
									onClick={() => setSelectedTool('pen')}
									className={`p-2 rounded ${selectedTool === 'pen' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
									title="قلم"
								>
									<PenLine size={18} />
								</button>
								<button 
									onClick={() => setSelectedTool('circle')}
									className={`p-2 rounded ${selectedTool === 'circle' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
									title="دائرة"
								>
									<Circle size={18} />
								</button>
								<button 
									onClick={() => setSelectedTool('square')}
									className={`p-2 rounded ${selectedTool === 'square' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
									title="مربع"
								>
									<Square size={18} />
								</button>
								<button 
									onClick={() => setSelectedTool('dot')}
									className={`p-2 rounded ${selectedTool === 'dot' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
									title="نقطة"
								>
									<CircleDot size={18} />
								</button>
								<div className="h-6 border-r border-gray-300 mx-1"></div>
								<div className="flex items-center">
									<input
										type="color"
										value={selectedColor}
										onChange={(e) => setSelectedColor(e.target.value)}
										className="w-8 h-8 border-0 p-0 rounded-full"
										style={{ appearance: 'none', background: 'none' }}
										title="اختر لون"
									/>
									<div 
										className="w-6 h-6 rounded-full border border-gray-300 ml-1" 
										style={{ backgroundColor: selectedColor }}
									></div>
								</div>
								<div className="h-6 border-r border-gray-300 mx-1"></div>
								<button 
									onClick={clearDrawings}
									className="p-2 rounded hover:bg-gray-100"
									title="مسح الرسم"
								>
									<RotateCcw size={18} />
								</button>
								<div className="h-6 border-r border-gray-300 mx-1"></div>
								<button 
									onClick={() => fileInputRef.current?.click()} 
									className="p-2 rounded hover:bg-gray-100"
									title="رفع صورة"
								>
									<Upload size={18} />
								</button>
								{backgroundImage && (
									<button 
										onClick={() => setBackgroundImage(null)} 
										className="p-2 rounded hover:bg-gray-100"
										title="حذف الصورة"
									>
										<Image size={18} />
									</button>
								)}
							</div>
							
							{/* Hidden file input */}
							<input 
								type="file" 
								accept="image/*" 
								ref={fileInputRef} 
								onChange={handleImageUpload} 
								className="hidden" 
							/>
							
							{/* Canvas area */}
							<div className="relative w-full h-[500px] bg-white border border-gray-300 rounded-lg overflow-hidden">
								{backgroundImage && (
									<img 
										src={backgroundImage} 
										alt="صورة خلفية" 
										className="absolute inset-0 w-full h-full object-contain"
									/>
								)}
								
								<div 
									ref={canvasRef}
									className="absolute inset-0 w-full h-full"
									onMouseDown={startDrawing}
									onMouseMove={draw}
									onMouseUp={endDrawing}
									onMouseLeave={endDrawing}
								>
									<svg className="w-full h-full">
										{lines.map((line, index) => renderLine(line, index))}
										{renderLine(currentLine, 'current')}
									</svg>
								</div>
							</div>
							
							{!backgroundImage && (
								<div className="mt-2 text-center text-gray-500 text-sm">
									يمكنك رفع صورة لاستخدامها كخلفية للرسم أو البدء بالرسم مباشرة
								</div>
							)}
						</div>
						
						{/* Measurements input */}
						<div className='bg-white rounded-lg shadow-sm p-4 w-full md:w-[400px]'>
							<div className='border-b border-gray-200 pb-3 mb-4'>
								<h2 className='text-lg font-medium text-gray-900'>معلومات أساسية</h2>
							</div>
							
							<div className="mb-6">
								<label htmlFor="measurementName" className="block text-sm font-medium text-gray-700 mb-1">
									اسم القياسات <span className="text-red-500">*</span>
								</label>
								<input
									id="measurementName"
									type="text"
									value={measurementName}
									onChange={(e) => setMeasurementName(e.target.value)}
									className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
								/>
							</div>
							
							<div className="mb-4">
								<h3 className="text-sm font-medium text-gray-700 mb-2">صورة مرجعية (اختياري)</h3>
								<div className="flex gap-2">
									<button 
										onClick={() => fileInputRef.current?.click()}
										className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
									>
										<Upload size={16} className="ml-1" />
										التقاط صورة
									</button>
									<button 
										className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
									>
										<Download size={16} className="ml-1" />
										تحميل صورة
									</button>
								</div>
							</div>
							
							<div className="mb-4">
								<label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
									ملاحظات
								</label>
								<textarea
									id="notes"
									rows={3}
									className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
									placeholder="أي ملاحظات إضافية عن القياسات أو التعديلات المطلوبة..."
								></textarea>
							</div>
							
							<div className='border-b border-gray-200 pt-2 pb-3 mb-4'>
								<h2 className='text-lg font-medium text-gray-900 flex items-center'>
									القياسات
									<ChevronDown size={20} className="mr-1" />
								</h2>
							</div>
							
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										الطول
									</label>
									<div className="relative">
										<input
											type="text"
											value={measurements.length}
											onChange={(e) => handleInputChange('length', e.target.value)}
											className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
											placeholder="سم"
										/>
									</div>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										الكتف
									</label>
									<div className="relative">
										<input
											type="text"
											value={measurements.shoulderWidth}
											onChange={(e) => handleInputChange('shoulderWidth', e.target.value)}
											className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
											placeholder="سم"
										/>
									</div>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										الصدر
									</label>
									<div className="relative">
										<input
											type="text"
											value={measurements.chestWidth}
											onChange={(e) => handleInputChange('chestWidth', e.target.value)}
											className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
											placeholder="سم"
										/>
									</div>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										الخصر
									</label>
									<div className="relative">
										<input
											type="text"
											value={measurements.waistWidth}
											onChange={(e) => handleInputChange('waistWidth', e.target.value)}
											className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
											placeholder="سم"
										/>
									</div>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										طول الكم
									</label>
									<div className="relative">
										<input
											type="text"
											value={measurements.sleeveLength}
											onChange={(e) => handleInputChange('sleeveLength', e.target.value)}
											className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
											placeholder="سم"
										/>
									</div>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										الرسغ
									</label>
									<div className="relative">
										<input
											type="text"
											value={measurements.wristWidth}
											onChange={(e) => handleInputChange('wristWidth', e.target.value)}
											className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
											placeholder="سم"
										/>
									</div>
								</div>
								
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-1">
										الياقة
									</label>
									<div className="relative">
										<input
											type="text"
											value={measurements.neckWidth}
											onChange={(e) => handleInputChange('neckWidth', e.target.value)}
											className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
											placeholder="سم"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}