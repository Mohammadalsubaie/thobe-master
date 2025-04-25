// app/dashboard/profile/page.tsx
'use client';

import { Calendar, Edit2, Lock, Mail, MapPin, Phone, Save, Upload, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface ProfileData {
	id: string;
	name: string;
	email: string;
	phone: string;
	role: string;
	avatar: string | null;
	joinDate: Date;
	address: string;
	bio: string;
}

export default function ProfilePage() {
	const [user, setUser] = useState<ProfileData | null>(null);
	const [loading, setLoading] = useState(true);
	const [activeTab, setActiveTab] = useState('profile');
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<Partial<ProfileData>>({});
	const [saving, setSaving] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [successMessage, setSuccessMessage] = useState('');
	const fileInputRef = useRef<HTMLInputElement>(null);

	// محاكاة جلب بيانات المستخدم
	useEffect(() => {
		const fetchUserData = async () => {
			try {
				setLoading(true);
				// في الواقع، سيكون هذا استدعاء API
				await new Promise((resolve) => setTimeout(resolve, 800));

				// بيانات تجريبية
				const mockedUser: ProfileData = {
					id: 'u123',
					name: 'محمد عبدالله العتيبي',
					email: 'mohammed@example.com',
					phone: '0512345678',
					role: 'مدير',
					avatar: '/images/profile-avatar.png',
					joinDate: new Date('2023-09-15'),
					address: 'الرياض، حي النخيل',
					bio: 'مدير في متجر ثوب ماستر للخياطة. متخصص في إدارة العمليات وخدمة العملاء.',
				};

				setUser(mockedUser);
				setFormData(mockedUser);
			} catch (error) {
				console.error('Error fetching user data:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	const handleTabChange = (tab: string) => {
		setActiveTab(tab);
		setIsEditing(false);
		setSuccessMessage('');
		setPasswordError('');
	};

	const handleEditToggle = () => {
		if (isEditing) {
			// إذا كنا نخرج من وضع التحرير، نعيد تعيين البيانات إلى قيم المستخدم
			setFormData(user || {});
		}
		setIsEditing(!isEditing);
		setSuccessMessage('');
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleProfileUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			setSaving(true);
			// في الواقع، سيكون هذا استدعاء API لتحديث الملف الشخصي
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// تحديث بيانات المستخدم محلياً
			setUser((prev) => (prev ? { ...prev, ...formData } : null));
			setSuccessMessage('تم تحديث الملف الشخصي بنجاح');
			setIsEditing(false);
		} catch (error) {
			console.error('Error updating profile:', error);
		} finally {
			setSaving(false);
		}
	};

	const handlePasswordChange = async (e: React.FormEvent) => {
		e.preventDefault();
		setPasswordError('');
		setSuccessMessage('');

		if (newPassword.length < 8) {
			setPasswordError('يجب أن تكون كلمة المرور 8 أحرف على الأقل');
			return;
		}

		if (newPassword !== confirmPassword) {
			setPasswordError('كلمات المرور غير متطابقة');
			return;
		}

		try {
			setSaving(true);
			// في الواقع، سيكون هذا استدعاء API لتغيير كلمة المرور
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setSuccessMessage('تم تغيير كلمة المرور بنجاح');
			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');
		} catch (error) {
			console.error('Error changing password:', error);
			setPasswordError('حدث خطأ أثناء تغيير كلمة المرور');
		} finally {
			setSaving(false);
		}
	};

	const handleAvatarClick = () => {
		if (isEditing && fileInputRef.current) {
			fileInputRef.current.click();
		}
	};

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// في تطبيق حقيقي، سنقوم برفع الصورة إلى الخادم
			// هنا، سنقوم فقط بإنشاء عنوان URL مؤقت للصورة المحلية
			const imageUrl = URL.createObjectURL(file);
			setFormData((prev) => ({ ...prev, avatar: imageUrl }));
		}
	};

	if (loading) {
		return (
			<div className='flex justify-center items-center h-64'>
				<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary'></div>
				<span className='mr-2 text-gray-700 dark:text-gray-300'>جاري تحميل البيانات...</span>
			</div>
		);
	}

	if (!user) {
		return (
			<div className='bg-red-50 dark:bg-red-900/20 p-4 rounded-md'>
				<div className='text-red-700 dark:text-red-400 font-medium'>حدث خطأ أثناء تحميل بيانات المستخدم</div>
				<button onClick={() => window.location.reload()} className='mt-2 text-primary hover:underline'>
					إعادة المحاولة
				</button>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>الملف الشخصي</h1>

				{activeTab === 'profile' && (
					<button
						onClick={handleEditToggle}
						className={`inline-flex items-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 ${
							isEditing
								? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
								: 'border-transparent text-white bg-primary hover:bg-primary-dark'
						}`}
					>
						{isEditing ? (
							'إلغاء التعديل'
						) : (
							<>
								<Edit2 size={18} className='ml-2' />
								تعديل الملف الشخصي
							</>
						)}
					</button>
				)}
			</div>

			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900 overflow-hidden'>
				{/* الشريط العلوي مع صورة الخلفية */}
				<div className='bg-gradient-to-r from-primary to-secondary h-32 relative'></div>

				{/* معلومات الملف الشخصي والتنقل */}
				<div className='px-6 pb-6 relative'>
					{/* صورة الملف الشخصي */}
					<div
						className={`absolute -top-16 right-8 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden ${
							isEditing ? 'cursor-pointer' : ''
						}`}
						onClick={handleAvatarClick}
					>
						<div className='w-32 h-32 relative'>
							<Image
								src={formData.avatar || '/images/default-avatar.png'}
								alt={user.name}
								className='object-cover'
								fill
								sizes='(max-width: 768px) 100vw, 128px'
							/>

							{isEditing && (
								<div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity'>
									<Upload className='text-white h-8 w-8' />
								</div>
							)}
						</div>
						<input
							ref={fileInputRef}
							type='file'
							accept='image/*'
							className='hidden'
							onChange={handleAvatarChange}
						/>
					</div>

					{/* معلومات أساسية وشريط التنقل */}
					<div className='pt-20 mr-36'>
						<h2 className='text-2xl font-bold text-gray-800 dark:text-gray-100'>{user.name}</h2>
						<p className='text-primary dark:text-primary-light font-medium'>{user.role}</p>

						{/* شريط التنقل */}
						<div className='mt-6 flex space-x-4 space-x-reverse border-b border-gray-200 dark:border-gray-700'>
							<button
								className={`px-4 py-2 text-sm font-medium ${
									activeTab === 'profile'
										? 'text-primary dark:text-primary-light border-b-2 border-primary dark:border-primary-light'
										: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
								}`}
								onClick={() => handleTabChange('profile')}
							>
								الملف الشخصي
							</button>
							<button
								className={`px-4 py-2 text-sm font-medium ${
									activeTab === 'security'
										? 'text-primary dark:text-primary-light border-b-2 border-primary dark:border-primary-light'
										: 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
								}`}
								onClick={() => handleTabChange('security')}
							>
								الأمان
							</button>
						</div>
					</div>

					{/* محتوى علامة التبويب */}
					<div className='mt-6'>
						{activeTab === 'profile' && (
							<div className='space-y-6'>
								{successMessage && (
									<div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-md text-green-700 dark:text-green-300'>
										{successMessage}
									</div>
								)}

								{isEditing ? (
									<form onSubmit={handleProfileUpdate} className='space-y-6'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
											<div className='space-y-2'>
												<label
													htmlFor='name'
													className='block text-sm font-medium text-gray-700 dark:text-gray-300'
												>
													الاسم الكامل
												</label>
												<div className='relative rounded-md shadow-sm'>
													<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
														<User className='h-5 w-5 text-gray-400' />
													</div>
													<input
														type='text'
														name='name'
														id='name'
														value={formData.name || ''}
														onChange={handleInputChange}
														className='block w-full pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary'
													/>
												</div>
											</div>

											<div className='space-y-2'>
												<label
													htmlFor='email'
													className='block text-sm font-medium text-gray-700 dark:text-gray-300'
												>
													البريد الإلكتروني
												</label>
												<div className='relative rounded-md shadow-sm'>
													<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
														<Mail className='h-5 w-5 text-gray-400' />
													</div>
													<input
														type='email'
														name='email'
														id='email'
														value={formData.email || ''}
														onChange={handleInputChange}
														className='block w-full pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary'
													/>
												</div>
											</div>

											<div className='space-y-2'>
												<label
													htmlFor='phone'
													className='block text-sm font-medium text-gray-700 dark:text-gray-300'
												>
													رقم الهاتف
												</label>
												<div className='relative rounded-md shadow-sm'>
													<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
														<Phone className='h-5 w-5 text-gray-400' />
													</div>
													<input
														type='tel'
														name='phone'
														id='phone'
														value={formData.phone || ''}
														onChange={handleInputChange}
														className='block w-full pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary'
														dir='ltr'
													/>
												</div>
											</div>

											<div className='space-y-2'>
												<label
													htmlFor='address'
													className='block text-sm font-medium text-gray-700 dark:text-gray-300'
												>
													العنوان
												</label>
												<div className='relative rounded-md shadow-sm'>
													<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
														<MapPin className='h-5 w-5 text-gray-400' />
													</div>
													<input
														type='text'
														name='address'
														id='address'
														value={formData.address || ''}
														onChange={handleInputChange}
														className='block w-full pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary'
													/>
												</div>
											</div>

											<div className='space-y-2 md:col-span-2'>
												<label
													htmlFor='bio'
													className='block text-sm font-medium text-gray-700 dark:text-gray-300'
												>
													نبذة تعريفية
												</label>
												<textarea
													id='bio'
													name='bio'
													rows={3}
													value={formData.bio || ''}
													onChange={handleInputChange}
													className='block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary'
												></textarea>
											</div>
										</div>

										<div className='flex justify-end mt-6'>
											<button
												type='button'
												onClick={handleEditToggle}
												className='mx-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800'
											>
												إلغاء
											</button>
											<button
												type='submit'
												disabled={saving}
												className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed'
											>
												{saving ? (
													<>
														<div className='animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white ml-2'></div>
														جاري الحفظ...
													</>
												) : (
													<>
														<Save size={18} className='ml-2' />
														حفظ التغييرات
													</>
												)}
											</button>
										</div>
									</form>
								) : (
									<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
										<div className='space-y-6'>
											<div>
												<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
													الاسم الكامل
												</p>
												<div className='mt-1 flex items-center'>
													<User className='h-5 w-5 text-gray-400 ml-2' />
													<p className='text-lg font-medium text-gray-900 dark:text-gray-100'>
														{user.name}
													</p>
												</div>
											</div>

											<div>
												<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
													البريد الإلكتروني
												</p>
												<div className='mt-1 flex items-center'>
													<Mail className='h-5 w-5 text-gray-400 ml-2' />
													<p
														className='text-lg font-medium text-gray-900 dark:text-gray-100'
														dir='ltr'
													>
														{user.email}
													</p>
												</div>
											</div>

											<div>
												<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
													رقم الهاتف
												</p>
												<div className='mt-1 flex items-center'>
													<Phone className='h-5 w-5 text-gray-400 ml-2' />
													<p
														className='text-lg font-medium text-gray-900 dark:text-gray-100'
														dir='ltr'
													>
														{user.phone}
													</p>
												</div>
											</div>
										</div>

										<div className='space-y-6'>
											<div>
												<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
													الوظيفة
												</p>
												<div className='mt-1 flex items-center'>
													<User className='h-5 w-5 text-gray-400 ml-2' />
													<p className='text-lg font-medium text-gray-900 dark:text-gray-100'>
														{user.role}
													</p>
												</div>
											</div>

											<div>
												<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
													تاريخ الانضمام
												</p>
												<div className='mt-1 flex items-center'>
													<Calendar className='h-5 w-5 text-gray-400 ml-2' />
													<p className='text-lg font-medium text-gray-900 dark:text-gray-100'>
														{user.joinDate.toLocaleDateString('ar-SA', {
															year: 'numeric',
															month: 'long',
															day: 'numeric',
														})}
													</p>
												</div>
											</div>

											<div>
												<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
													العنوان
												</p>
												<div className='mt-1 flex items-center'>
													<MapPin className='h-5 w-5 text-gray-400 ml-2' />
													<p className='text-lg font-medium text-gray-900 dark:text-gray-100'>
														{user.address}
													</p>
												</div>
											</div>
										</div>

										<div className='md:col-span-2'>
											<p className='text-sm font-medium text-gray-500 dark:text-gray-400'>
												نبذة تعريفية
											</p>
											<div className='mt-1 bg-gray-50 dark:bg-gray-700 p-4 rounded-md'>
												<p className='text-gray-900 dark:text-gray-100'>{user.bio}</p>
											</div>
										</div>
									</div>
								)}
							</div>
						)}

						{activeTab === 'security' && (
							<div className='space-y-6 max-w-2xl'>
								{successMessage && (
									<div className='bg-green-50 dark:bg-green-900/20 p-4 rounded-md text-green-700 dark:text-green-300'>
										{successMessage}
									</div>
								)}

								<div className='bg-gray-50 dark:bg-gray-700 p-4 rounded-md'>
									<h3 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
										تغيير كلمة المرور
									</h3>
									<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
										تأكد من استخدام كلمة مرور قوية وفريدة للحفاظ على أمان حسابك.
									</p>

									<form onSubmit={handlePasswordChange} className='mt-4 space-y-4'>
										{passwordError && (
											<div className='bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm text-red-700 dark:text-red-300'>
												{passwordError}
											</div>
										)}

										<div className='space-y-2'>
											<label
												htmlFor='currentPassword'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												كلمة المرور الحالية
											</label>
											<div className='relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
													<Lock className='h-5 w-5 text-gray-400' />
												</div>
												<input
													type='password'
													name='currentPassword'
													id='currentPassword'
													value={currentPassword}
													onChange={(e) => setCurrentPassword(e.target.value)}
													className='block w-full pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary'
													required
												/>
											</div>
										</div>

										<div className='space-y-2'>
											<label
												htmlFor='newPassword'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												كلمة المرور الجديدة
											</label>
											<div className='relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
													<Lock className='h-5 w-5 text-gray-400' />
												</div>
												<input
													type='password'
													name='newPassword'
													id='newPassword'
													value={newPassword}
													onChange={(e) => setNewPassword(e.target.value)}
													className='block w-full pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary'
													required
												/>
											</div>
											<p className='text-xs text-gray-500 dark:text-gray-400'>
												يجب أن تكون كلمة المرور 8 أحرف على الأقل وتحتوي على أرقام وحروف.
											</p>
										</div>

										<div className='space-y-2'>
											<label
												htmlFor='confirmPassword'
												className='block text-sm font-medium text-gray-700 dark:text-gray-300'
											>
												تأكيد كلمة المرور الجديدة
											</label>
											<div className='relative rounded-md shadow-sm'>
												<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
													<Lock className='h-5 w-5 text-gray-400' />
												</div>
												<input
													type='password'
													name='confirmPassword'
													id='confirmPassword'
													value={confirmPassword}
													onChange={(e) => setConfirmPassword(e.target.value)}
													className='block w-full pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-primary focus:border-primary'
													required
												/>
											</div>
										</div>

										<div className='flex justify-end mt-6'>
											<button
												type='submit'
												disabled={saving}
												className='inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-800 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed'
											>
												{saving ? (
													<>
														<div className='animate-spin rounded-full h-4 w-4 border-2 border-t-transparent border-white ml-2'></div>
														جاري الحفظ...
													</>
												) : (
													'تغيير كلمة المرور'
												)}
											</button>
										</div>
									</form>
								</div>

								<div className='border-t border-gray-200 dark:border-gray-700 pt-6'>
									<h3 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
										جلسات الدخول
									</h3>
									<p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
										هذه الأجهزة مسجلة الدخول حاليًا إلى حسابك.
									</p>

									<div className='mt-4 space-y-4'>
										<div className='flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-md'>
											<div className='flex items-center'>
												<div className='p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md'>
													<svg
														width='24'
														height='24'
														viewBox='0 0 24 24'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
														className='text-blue-600 dark:text-blue-400'
													>
														<path
															d='M20 16V7C20 5.9 19.1 5 18 5H6C4.9 5 4 5.9 4 7V16C4 17.1 4.9 18 6 18H18C19.1 18 20 17.1 20 16ZM18 16H6V7H18V16Z'
															fill='currentColor'
														/>
														<path
															d='M4 19H20V20C20 20.55 19.55 21 19 21H5C4.45 21 4 20.55 4 20V19Z'
															fill='currentColor'
														/>
													</svg>
												</div>
												<div className='mr-3'>
													<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
														جهاز الكمبيوتر - Chrome
													</p>
													<p className='text-xs text-gray-500 dark:text-gray-400'>
														الرياض، السعودية • نشط حاليًا
													</p>
												</div>
											</div>
											<div className='flex items-center'>
												<span className='text-xs text-white bg-green-500 dark:bg-green-600 px-2 py-1 rounded-full ml-2'>
													نشط
												</span>
												<span className='text-xs text-gray-500 dark:text-gray-400'>
													هذا الجهاز
												</span>
											</div>
										</div>

										<div className='flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-md'>
											<div className='flex items-center'>
												<div className='p-2 bg-gray-100 dark:bg-gray-600 rounded-md'>
													<svg
														width='24'
														height='24'
														viewBox='0 0 24 24'
														fill='none'
														xmlns='http://www.w3.org/2000/svg'
														className='text-gray-600 dark:text-gray-400'
													>
														<path
															d='M17 1.01L7 1C5.9 1 5 1.9 5 3V21C5 22.1 5.9 23 7 23H17C18.1 23 19 22.1 19 21V3C19 1.9 18.1 1.01 17 1.01ZM17 19H7V5H17V19Z'
															fill='currentColor'
														/>
													</svg>
												</div>
												<div className='mr-3'>
													<p className='text-sm font-medium text-gray-900 dark:text-gray-100'>
														iPhone - Safari
													</p>
													<p className='text-xs text-gray-500 dark:text-gray-400'>
														الرياض، السعودية • آخر نشاط منذ 3 أيام
													</p>
												</div>
											</div>
											<button className='text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300'>
												تسجيل الخروج
											</button>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
