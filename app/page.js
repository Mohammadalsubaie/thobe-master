'use client';
import Link from 'next/link';

export default function Home() {
	return (
		<main className='min-h-screen bg-white'>
			{/* Hero Section */}
			<section className='bg-gradient-to-b from-green-50 to-white'>
				<div className='container mx-auto px-4 py-16'>
					<div className='flex flex-col items-center justify-center text-center'>
						<h1 className='text-4xl md:text-5xl font-bold text-green-800 mb-6'>ثوب ماستر</h1>
						<p className='text-xl text-gray-700 mb-8 max-w-2xl'>
							نظام متكامل لإدارة خدمات الخياطة والأقمشة، يربط بين الخياطين والعملاء في تجربة سلسة
						</p>
						<div className='space-x-4 space-x-reverse'>
							<Link
								href='/auth/login'
								className='bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors'
							>
								تسجيل الدخول
							</Link>
							<Link
								href='/auth/register'
								className='bg-white hover:bg-gray-100 text-green-600 font-bold py-3 px-8 border border-green-600 rounded-lg transition-colors'
							>
								إنشاء حساب
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className='py-16'>
				<div className='container mx-auto px-4'>
					<h2 className='text-3xl font-bold text-center text-gray-800 mb-12'>مميزات نظام ثوب ماستر</h2>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<div className='bg-green-50 p-8 rounded-lg shadow-sm'>
							<div className='bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-6'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-8 w-8 text-green-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
									/>
								</svg>
							</div>
							<h3 className='text-xl font-bold text-green-800 mb-3'>إدارة العملاء</h3>
							<p className='text-gray-700'>
								تسجيل وإدارة العملاء وقياساتهم بشكل سهل ومنظم مع حفظ سجل كامل لكل عميل
							</p>
						</div>

						<div className='bg-green-50 p-8 rounded-lg shadow-sm'>
							<div className='bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-6'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-8 w-8 text-green-600'
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
							<h3 className='text-xl font-bold text-green-800 mb-3'>إدارة الطلبات</h3>
							<p className='text-gray-700'>
								تتبع حالة الطلبات من البداية وحتى التسليم للعميل مع إشعارات تلقائية
							</p>
						</div>

						<div className='bg-green-50 p-8 rounded-lg shadow-sm'>
							<div className='bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-6'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-8 w-8 text-green-600'
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
							<h3 className='text-xl font-bold text-green-800 mb-3'>إدارة المخزون</h3>
							<p className='text-gray-700'>
								إدارة فعالة لمخزون الأقمشة والمستلزمات مع تنبيهات عند انخفاض الكميات
							</p>
						</div>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-8'>
						<div className='bg-green-50 p-8 rounded-lg shadow-sm'>
							<div className='bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-6'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-8 w-8 text-green-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
							</div>
							<h3 className='text-xl font-bold text-green-800 mb-3'>ضمان الجودة</h3>
							<p className='text-gray-700'>
								نظام متكامل لضمان جودة الخياطة ومطابقة القياسات مع إمكانية طلب الإصلاح
							</p>
						</div>

						<div className='bg-green-50 p-8 rounded-lg shadow-sm'>
							<div className='bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-6'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-8 w-8 text-green-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z'
									/>
								</svg>
							</div>
							<h3 className='text-xl font-bold text-green-800 mb-3'>إشعارات تلقائية</h3>
							<p className='text-gray-700'>
								إرسال إشعارات تلقائية للعملاء عند جاهزية الطلبات أو الحاجة للمتابعة
							</p>
						</div>

						<div className='bg-green-50 p-8 rounded-lg shadow-sm'>
							<div className='bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-6'>
								<svg
									xmlns='http://www.w3.org/2000/svg'
									className='h-8 w-8 text-green-600'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
									/>
								</svg>
							</div>
							<h3 className='text-xl font-bold text-green-800 mb-3'>تقارير تحليلية</h3>
							<p className='text-gray-700'>
								تقارير وإحصائيات شاملة عن الأداء والمبيعات لمساعدتك في اتخاذ قرارات أفضل
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials or additional info section can be added here */}

			{/* Footer */}
			<footer className='bg-green-900 text-white py-12'>
				<div className='container mx-auto px-4'>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						<div>
							<h4 className='text-xl font-bold mb-4'>ثوب ماستر</h4>
							<p className='mb-4'>نظام متكامل لإدارة خدمات الخياطة والأقمشة</p>
							<p className='text-green-200'>© {new Date().getFullYear()} ثوب ماستر. جميع الحقوق محفوظة</p>
						</div>
						<div>
							<h4 className='text-xl font-bold mb-4'>روابط سريعة</h4>
							<ul className='space-y-2'>
								<li>
									<Link
										href='/auth/login'
										className='text-green-200 hover:text-white transition-colors'
									>
										تسجيل الدخول
									</Link>
								</li>
								<li>
									<Link
										href='/auth/register'
										className='text-green-200 hover:text-white transition-colors'
									>
										إنشاء حساب
									</Link>
								</li>
								<li>
									<Link href='#' className='text-green-200 hover:text-white transition-colors'>
										سياسة الخصوصية
									</Link>
								</li>
								<li>
									<Link href='#' className='text-green-200 hover:text-white transition-colors'>
										شروط الاستخدام
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<h4 className='text-xl font-bold mb-4'>تواصل معنا</h4>
							<p className='mb-2'>الرياض، المملكة العربية السعودية</p>
							<p className='mb-2'>البريد الإلكتروني: info@thobe-master.com</p>
							<p className='mb-4'>الهاتف: +966 12 345 6789</p>
							<div className='flex space-x-4 space-x-reverse'>
								<a href='#' className='text-green-200 hover:text-white transition-colors'>
									<svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
										<path
											fillRule='evenodd'
											d='M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
											clipRule='evenodd'
										/>
									</svg>
								</a>
								<a href='#' className='text-green-200 hover:text-white transition-colors'>
									<svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
										<path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
									</svg>
								</a>
								<a href='#' className='text-green-200 hover:text-white transition-colors'>
									<svg className='h-6 w-6' fill='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
										<path
											fillRule='evenodd'
											d='M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
											clipRule='evenodd'
										/>
									</svg>
								</a>
							</div>
						</div>
					</div>
				</div>
			</footer>
		</main>
	);
}
