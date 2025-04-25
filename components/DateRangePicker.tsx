// components/DateRangePicker.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { DateRange, DayPicker, SelectRangeEventHandler } from 'react-day-picker';
import { Calendar, X } from 'lucide-react';

interface DateRangePickerProps {
	value: DateRange | undefined;
	onChange: (range: DateRange | undefined) => void;
	locale?: string;
	placeholder?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
	value,
	onChange,
	locale = 'ar',
	placeholder = 'اختر نطاق التاريخ',
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	// تنسيق عرض التاريخ
	const formatDisplayDate = (range: DateRange | undefined) => {
		if (!range || !range.from) {
			return placeholder;
		}

		if (range.to) {
			return `${format(range.from, 'dd/MM/yyyy', { locale: ar })} - ${format(range.to, 'dd/MM/yyyy', {
				locale: ar,
			})}`;
		}

		return format(range.from, 'dd/MM/yyyy', { locale: ar });
	};

	// معالجة اختيار النطاق
	const handleRangeSelect: SelectRangeEventHandler = (range) => {
		onChange(range);
		if (range && range.from && range.to) {
			setIsOpen(false);
		}
	};

	// إغلاق المنتقي عند النقر خارجه
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	// إعادة تعيين النطاق
	const handleReset = () => {
		onChange(undefined);
	};

	return (
		<div className='relative' ref={containerRef}>
			<div
				className='flex items-center relative py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
				onClick={() => setIsOpen(!isOpen)}
			>
				<Calendar className='h-5 w-5 text-gray-400 dark:text-gray-500 ml-1' />
				<span className='flex-1'>{formatDisplayDate(value)}</span>
				{value && value.from && (
					<button
						type='button'
						className='text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'
						onClick={(e) => {
							e.stopPropagation();
							handleReset();
						}}
					>
						<X className='h-4 w-4' />
					</button>
				)}
			</div>

			{isOpen && (
				<div className='absolute z-10 mt-1 w-auto bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg p-2 right-0 ltr:right-auto ltr:left-0'>
					<DayPicker
						mode='range'
						selected={value}
						onSelect={handleRangeSelect}
						locale={ar}
						className='!font-sans p-1'
						classNames={{
							root: 'text-gray-900 dark:text-gray-100',
							month: 'space-y-2',
							caption: 'flex justify-center pt-1 relative items-center',
							caption_label: 'text-sm font-medium',
							nav: 'flex items-center space-x-1 space-x-reverse',
							nav_button:
								'h-7 w-7 inline-flex justify-center items-center rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 focus:dark:ring-offset-gray-800',
							nav_button_previous: 'absolute right-1',
							nav_button_next: 'absolute left-1',
							table: 'w-full border-collapse',
							head_row: 'flex w-full',
							head_cell:
								'text-gray-500 dark:text-gray-400 rounded-md w-10 font-medium text-xs m-0.5 text-center',
							row: 'flex w-full mt-0.5',
							cell: 'text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-r-md last:[&:has([aria-selected])]:rounded-l-md focus-within:relative focus-within:z-20 m-0.5',
							day: 'h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-md flex items-center justify-center',
							day_range_start: 'day-range-start bg-primary text-primary-foreground',
							day_range_end: 'day-range-end bg-primary text-primary-foreground',
							day_selected:
								'bg-primary text-white hover:bg-primary hover:text-white focus:bg-primary focus:text-white',
							day_today: 'bg-gray-100 dark:bg-gray-700',
							day_outside: 'text-gray-400 dark:text-gray-500 opacity-50',
							day_disabled: 'text-gray-400 dark:text-gray-500 opacity-50 cursor-not-allowed',
							day_range_middle:
								'aria-selected:bg-primary-100 dark:aria-selected:bg-primary-900/30 aria-selected:text-gray-700 dark:aria-selected:text-gray-300',
							day_hidden: 'invisible',
						}}
						// Removed invalid properties IconLeft and IconRight
						components={{}}
					/>
					<div className='flex justify-end mt-2 border-t border-gray-200 dark:border-gray-700 pt-2'>
						<button
							type='button'
							onClick={() => setIsOpen(false)}
							className='text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
						>
							إغلاق
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

// المكونات المستوردة
const ChevronLeft = ({ className }: { className?: string }) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
		className={className}
	>
		<path d='m15 18-6-6 6-6' />
	</svg>
);

const ChevronRight = ({ className }: { className?: string }) => (
	<svg
		xmlns='http://www.w3.org/2000/svg'
		width='24'
		height='24'
		viewBox='0 0 24 24'
		fill='none'
		stroke='currentColor'
		strokeWidth='2'
		strokeLinecap='round'
		strokeLinejoin='round'
		className={className}
	>
		<path d='m9 18 6-6-6-6' />
	</svg>
);

export default DateRangePicker;
