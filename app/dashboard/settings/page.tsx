'use client';

import { Bell, Building, Lock, Plus, Save, Trash, User } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState('profile');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showDeleteBranchModal, setShowDeleteBranchModal] = useState(false);
	const [showAddUserModal, setShowAddUserModal] = useState(false);

	// User settings state
	const [userName, setUserName] = useState('محمد المدير');
	const [userEmail, setUserEmail] = useState('admin@example.com');
	const [userPhone, setUserPhone] = useState('966512345678');

	// Branch settings state
	const [branches, setBranches] = useState([
		{
			id: 1,
			name: 'الفرع الرئيسي',
			address: 'الرياض، حي النخيل، شارع العليا',
			phone: '966112345678',
			manager: 'محمد المدير',
		},
		{
			id: 2,
			name: 'فرع الشرقية',
			address: 'الدمام، حي الشاطئ، شارع الأمير محمد',
			phone: '966132345678',
			manager: 'أحمد سعيد',
		},
	]);

	// Notification settings state
	const [emailNotifications, setEmailNotifications] = useState(true);
	const [smsNotifications, setSmsNotifications] = useState(true);
	const [orderCreatedNotif, setOrderCreatedNotif] = useState(true);
	const [orderCompletedNotif, setOrderCompletedNotif] = useState(true);
	const [repairRequestNotif, setRepairRequestNotif] = useState(true);

	// Security settings state
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	// New branch state
	const [newBranchName, setNewBranchName] = useState('');
	const [newBranchAddress, setNewBranchAddress] = useState('');
	const [newBranchPhone, setNewBranchPhone] = useState('966');
	const [newBranchManager, setNewBranchManager] = useState('');

	// New user state
	const [newUserName, setNewUserName] = useState('');
	const [newUserEmail, setNewUserEmail] = useState('');
	const [newUserPhone, setNewUserPhone] = useState('966');
	const [newUserRole, setNewUserRole] = useState('');
	const [newUserPassword, setNewUserPassword] = useState('');

	const [branchToDelete, setBranchToDelete] = useState<number | null>(null);

	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Mock API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log('Profile updated:', { userName, userEmail, userPhone });
			// Success notification would go here
		} catch (error) {
			console.error('Error updating profile:', error);
			// Error notification would go here
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSaveNotifications = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Mock API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log('Notification settings updated:', {
				emailNotifications,
				smsNotifications,
				orderCreatedNotif,
				orderCompletedNotif,
				repairRequestNotif,
			});
			// Success notification would go here
		} catch (error) {
			console.error('Error updating notification settings:', error);
			// Error notification would go here
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Validate passwords
		if (newPassword !== confirmPassword) {
			alert('كلمات المرور غير متطابقة');
			setIsSubmitting(false);
			return;
		}

		try {
			// Mock API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log('Password changed');

			// Reset form
			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');

			// Success notification would go here
		} catch (error) {
			console.error('Error changing password:', error);
			// Error notification would go here
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleAddBranch = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Mock API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Add new branch to state
			const newBranch = {
				id: branches.length + 1,
				name: newBranchName,
				address: newBranchAddress,
				phone: newBranchPhone,
				manager: newBranchManager,
			};

			setBranches([...branches, newBranch]);

			// Reset form
			setNewBranchName('');
			setNewBranchAddress('');
			setNewBranchPhone('966');
			setNewBranchManager('');

			// Success notification would go here
		} catch (error) {
			console.error('Error adding branch:', error);
			// Error notification would go here
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDeleteBranch = async () => {
		if (branchToDelete === null) return;

		setIsSubmitting(true);

		try {
			// Mock API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Remove branch from state
			setBranches(branches.filter((branch) => branch.id !== branchToDelete));

			setShowDeleteBranchModal(false);
			setBranchToDelete(null);

			// Success notification would go here
		} catch (error) {
			console.error('Error deleting branch:', error);
			// Error notification would go here
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleAddUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// Mock API call - replace with actual API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log('User added:', {
				name: newUserName,
				email: newUserEmail,
				phone: newUserPhone,
				role: newUserRole,
				password: newUserPassword,
			});

			// Reset form
			setNewUserName('');
			setNewUserEmail('');
			setNewUserPhone('966');
			setNewUserRole('');
			setNewUserPassword('');

			setShowAddUserModal(false);

			// Success notification would go here
		} catch (error) {
			console.error('Error adding user:', error);
			// Error notification would go here
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>الإعدادات</h1>
			</div>

			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='flex border-b border-gray-200'>
					<button
						className={`py-4 px-6 text-sm font-medium flex items-center ${
							activeTab === 'profile'
								? 'text-green-600 border-b-2 border-green-500'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('profile')}
					>
						<User className='h-5 w-5 ml-2' />
						الملف الشخصي
					</button>
					<button
						className={`py-4 px-6 text-sm font-medium flex items-center ${
							activeTab === 'branches'
								? 'text-green-600 border-b-2 border-green-500'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('branches')}
					>
						<Building className='h-5 w-5 ml-2' />
						الفروع
					</button>
					<button
						className={`py-4 px-6 text-sm font-medium flex items-center ${
							activeTab === 'notifications'
								? 'text-green-600 border-b-2 border-green-500'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('notifications')}
					>
						<Bell className='h-5 w-5 ml-2' />
						الإشعارات
					</button>
					<button
						className={`py-4 px-6 text-sm font-medium flex items-center ${
							activeTab === 'security'
								? 'text-green-600 border-b-2 border-green-500'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('security')}
					>
						<Lock className='h-5 w-5 ml-2' />
						الأمان
					</button>
				</div>

				<div className='p-6'>
					{activeTab === 'profile' && (
						<form onSubmit={handleSaveProfile} className='space-y-6'>
							<div>
								<h3 className='text-lg font-medium text-gray-900'>المعلومات الشخصية</h3>
								<p className='mt-1 text-sm text-gray-500'>تحديث معلوماتك الشخصية</p>
							</div>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div className='space-y-2'>
									<label htmlFor='name' className='block text-sm font-medium text-gray-700'>
										الاسم الكامل
									</label>
									<input
										id='name'
										type='text'
										value={userName}
										onChange={(e) => setUserName(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='email' className='block text-sm font-medium text-gray-700'>
										البريد الإلكتروني
									</label>
									<input
										id='email'
										type='email'
										value={userEmail}
										onChange={(e) => setUserEmail(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
										رقم الهاتف
									</label>
									<input
										id='phone'
										type='tel'
										value={userPhone}
										onChange={(e) => setUserPhone(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									/>
								</div>
							</div>

							<div>
								<button
									type='submit'
									disabled={isSubmitting}
									className='inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed'
								>
									{isSubmitting ? (
										'جاري الحفظ...'
									) : (
										<>
											<Save className='ml-2 -mr-1 h-5 w-5' />
											حفظ التغييرات
										</>
									)}
								</button>
							</div>
						</form>
					)}

					{activeTab === 'branches' && (
						<div className='space-y-6'>
							<div>
								<h3 className='text-lg font-medium text-gray-900'>إدارة الفروع</h3>
								<p className='mt-1 text-sm text-gray-500'>إضافة وتعديل الفروع</p>
							</div>

							<div className='flex justify-end'>
								<button
									type='button'
									onClick={() =>
										document.getElementById('add-branch-form')?.classList.toggle('hidden')
									}
									className='inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
								>
									<Plus className='ml-2 -mr-1 h-5 w-5' />
									إضافة فرع جديد
								</button>
							</div>

							<div id='add-branch-form' className='hidden bg-gray-50 p-4 rounded-lg mb-6'>
								<h4 className='text-md font-medium text-gray-900 mb-4'>إضافة فرع جديد</h4>
								<form onSubmit={handleAddBranch} className='space-y-4'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<label
												htmlFor='branch-name'
												className='block text-sm font-medium text-gray-700'
											>
												اسم الفرع
											</label>
											<input
												id='branch-name'
												type='text'
												value={newBranchName}
												onChange={(e) => setNewBranchName(e.target.value)}
												className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
												required
											/>
										</div>

										<div className='space-y-2'>
											<label
												htmlFor='branch-address'
												className='block text-sm font-medium text-gray-700'
											>
												العنوان
											</label>
											<input
												id='branch-address'
												type='text'
												value={newBranchAddress}
												onChange={(e) => setNewBranchAddress(e.target.value)}
												className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
												required
											/>
										</div>

										<div className='space-y-2'>
											<label
												htmlFor='branch-phone'
												className='block text-sm font-medium text-gray-700'
											>
												رقم الهاتف
											</label>
											<input
												id='branch-phone'
												type='tel'
												value={newBranchPhone}
												onChange={(e) => setNewBranchPhone(e.target.value)}
												className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
												required
											/>
										</div>

										<div className='space-y-2'>
											<label
												htmlFor='branch-manager'
												className='block text-sm font-medium text-gray-700'
											>
												المدير المسؤول
											</label>
											<input
												id='branch-manager'
												type='text'
												value={newBranchManager}
												onChange={(e) => setNewBranchManager(e.target.value)}
												className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
												required
											/>
										</div>
									</div>

									<div className='flex justify-end'>
										<button
											type='button'
											onClick={() =>
												document.getElementById('add-branch-form')?.classList.add('hidden')
											}
											className='inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-3'
										>
											إلغاء
										</button>
										<button
											type='submit'
											disabled={isSubmitting}
											className='inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed'
										>
											{isSubmitting ? 'جاري الإضافة...' : 'إضافة الفرع'}
										</button>
									</div>
								</form>
							</div>

							<div className='overflow-x-auto'>
								<table className='min-w-full divide-y divide-gray-200'>
									<thead className='bg-gray-50'>
										<tr>
											<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												اسم الفرع
											</th>
											<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												العنوان
											</th>
											<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												رقم الهاتف
											</th>
											<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
												المدير المسؤول
											</th>
											<th className='relative px-6 py-3'>
												<span className='sr-only'>إجراءات</span>
											</th>
										</tr>
									</thead>
									<tbody className='bg-white divide-y divide-gray-200'>
										{branches.map((branch) => (
											<tr key={branch.id} className='hover:bg-gray-50'>
												<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
													{branch.name}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
													{branch.address}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
													{branch.phone}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
													{branch.manager}
												</td>
												<td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
													<button
														onClick={() => {
															setBranchToDelete(branch.id);
															setShowDeleteBranchModal(true);
														}}
														className='text-red-600 hover:text-red-900'
													>
														<Trash className='h-5 w-5' />
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							<div className='mt-6'>
								<h3 className='text-lg font-medium text-gray-900'>إدارة المستخدمين</h3>
								<p className='mt-1 text-sm text-gray-500'>إضافة وتعديل المستخدمين للنظام</p>
							</div>

							<div className='flex justify-end'>
								<button
									type='button'
									onClick={() => setShowAddUserModal(true)}
									className='inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
								>
									<Plus className='ml-2 -mr-1 h-5 w-5' />
									إضافة مستخدم جديد
								</button>
							</div>
						</div>
					)}

					{activeTab === 'notifications' && (
						<form onSubmit={handleSaveNotifications} className='space-y-6'>
							<div>
								<h3 className='text-lg font-medium text-gray-900'>إعدادات الإشعارات</h3>
								<p className='mt-1 text-sm text-gray-500'>التحكم في إعدادات الإشعارات</p>
							</div>

							<div className='space-y-4'>
								<div className='flex items-start'>
									<div className='flex items-center h-5'>
										<input
											id='email-notifications'
											name='email-notifications'
											type='checkbox'
											checked={emailNotifications}
											onChange={(e) => setEmailNotifications(e.target.checked)}
											className='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded'
										/>
									</div>
									<div className='mr-3 text-sm'>
										<label htmlFor='email-notifications' className='font-medium text-gray-700'>
											إشعارات البريد الإلكتروني
										</label>
										<p className='text-gray-500'>استلام إشعارات عبر البريد الإلكتروني</p>
									</div>
								</div>

								<div className='flex items-start'>
									<div className='flex items-center h-5'>
										<input
											id='sms-notifications'
											name='sms-notifications'
											type='checkbox'
											checked={smsNotifications}
											onChange={(e) => setSmsNotifications(e.target.checked)}
											className='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded'
										/>
									</div>
									<div className='mr-3 text-sm'>
										<label htmlFor='sms-notifications' className='font-medium text-gray-700'>
											إشعارات الرسائل النصية
										</label>
										<p className='text-gray-500'>استلام إشعارات عبر الرسائل النصية</p>
									</div>
								</div>
							</div>

							<div className='border-t border-gray-200 pt-6'>
								<h4 className='text-md font-medium text-gray-900 mb-4'>أنواع الإشعارات</h4>

								<div className='space-y-4'>
									<div className='flex items-start'>
										<div className='flex items-center h-5'>
											<input
												id='order-created'
												name='order-created'
												type='checkbox'
												checked={orderCreatedNotif}
												onChange={(e) => setOrderCreatedNotif(e.target.checked)}
												className='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded'
											/>
										</div>
										<div className='mr-3 text-sm'>
											<label htmlFor='order-created' className='font-medium text-gray-700'>
												إنشاء طلب جديد
											</label>
											<p className='text-gray-500'>إشعار عند إنشاء طلب جديد</p>
										</div>
									</div>

									<div className='flex items-start'>
										<div className='flex items-center h-5'>
											<input
												id='order-completed'
												name='order-completed'
												type='checkbox'
												checked={orderCompletedNotif}
												onChange={(e) => setOrderCompletedNotif(e.target.checked)}
												className='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded'
											/>
										</div>
										<div className='mr-3 text-sm'>
											<label htmlFor='order-completed' className='font-medium text-gray-700'>
												اكتمال الطلب
											</label>
											<p className='text-gray-500'>إشعار عند اكتمال طلب</p>
										</div>
									</div>

									<div className='flex items-start'>
										<div className='flex items-center h-5'>
											<input
												id='repair-request'
												name='repair-request'
												type='checkbox'
												checked={repairRequestNotif}
												onChange={(e) => setRepairRequestNotif(e.target.checked)}
												className='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded'
											/>
										</div>
										<div className='mr-3 text-sm'>
											<label htmlFor='repair-request' className='font-medium text-gray-700'>
												طلبات الإصلاح
											</label>
											<p className='text-gray-500'>إشعار عند وجود طلب إصلاح جديد</p>
										</div>
									</div>
								</div>
							</div>

							<div>
								<button
									type='submit'
									disabled={isSubmitting}
									className='inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed'
								>
									{isSubmitting ? (
										'جاري الحفظ...'
									) : (
										<>
											<Save className='ml-2 -mr-1 h-5 w-5' />
											حفظ التغييرات
										</>
									)}
								</button>
							</div>
						</form>
					)}

					{activeTab === 'security' && (
						<form onSubmit={handleChangePassword} className='space-y-6'>
							<div>
								<h3 className='text-lg font-medium text-gray-900'>تغيير كلمة المرور</h3>
								<p className='mt-1 text-sm text-gray-500'>تأكد من اختيار كلمة مرور قوية</p>
							</div>

							<div className='space-y-4'>
								<div className='space-y-2'>
									<label
										htmlFor='current-password'
										className='block text-sm font-medium text-gray-700'
									>
										كلمة المرور الحالية
									</label>
									<input
										id='current-password'
										type='password'
										value={currentPassword}
										onChange={(e) => setCurrentPassword(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label htmlFor='new-password' className='block text-sm font-medium text-gray-700'>
										كلمة المرور الجديدة
									</label>
									<input
										id='new-password'
										type='password'
										value={newPassword}
										onChange={(e) => setNewPassword(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>

								<div className='space-y-2'>
									<label
										htmlFor='confirm-password'
										className='block text-sm font-medium text-gray-700'
									>
										تأكيد كلمة المرور
									</label>
									<input
										id='confirm-password'
										type='password'
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required
									/>
								</div>
							</div>

							<div>
								<button
									type='submit'
									disabled={isSubmitting}
									className='inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-green-300 disabled:cursor-not-allowed'
								>
									{isSubmitting ? (
										'جاري الحفظ...'
									) : (
										<>
											<Save className='ml-2 -mr-1 h-5 w-5' />
											تغيير كلمة المرور
										</>
									)}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>

			{/* Delete Branch Modal */}
			{showDeleteBranchModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white p-5 rounded-md shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-gray-900 mb-4'>تأكيد حذف الفرع</h3>
						<p className='text-gray-700 mb-4'>
							هل أنت متأكد من رغبتك في حذف هذا الفرع؟ لا يمكن التراجع عن هذا الإجراء.
						</p>
						<div className='flex justify-end space-x-2 space-x-reverse'>
							<button
								onClick={() => setShowDeleteBranchModal(false)}
								className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
								disabled={isSubmitting}
							>
								إلغاء
							</button>
							<button
								onClick={handleDeleteBranch}
								className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed'
								disabled={isSubmitting}
							>
								{isSubmitting ? 'جاري الحذف...' : 'حذف'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Add User Modal */}
			{showAddUserModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white p-5 rounded-md shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-gray-900 mb-4'>إضافة مستخدم جديد</h3>
						<form onSubmit={handleAddUser} className='space-y-4'>
							<div className='space-y-2'>
								<label htmlFor='new-user-name' className='block text-sm font-medium text-gray-700'>
									الاسم الكامل
								</label>
								<input
									id='new-user-name'
									type='text'
									value={newUserName}
									onChange={(e) => setNewUserName(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									required
								/>
							</div>

							<div className='space-y-2'>
								<label htmlFor='new-user-email' className='block text-sm font-medium text-gray-700'>
									البريد الإلكتروني
								</label>
								<input
									id='new-user-email'
									type='email'
									value={newUserEmail}
									onChange={(e) => setNewUserEmail(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									required
								/>
							</div>

							<div className='space-y-2'>
								<label htmlFor='new-user-phone' className='block text-sm font-medium text-gray-700'>
									رقم الهاتف
								</label>
								<input
									id='new-user-phone'
									type='tel'
									value={newUserPhone}
									onChange={(e) => setNewUserPhone(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									required
								/>
							</div>

							<div className='space-y-2'>
								<label htmlFor='new-user-role' className='block text-sm font-medium text-gray-700'>
									الدور
								</label>
								<select
									id='new-user-role'
									value={newUserRole}
									onChange={(e) => setNewUserRole(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									required
								>
									<option value=''>اختر الدور</option>
									<option value='admin'>مدير</option>
									<option value='tailor'>خياط</option>
									<option value='factory'>مسؤول مصنع</option>
									<option value='delivery'>مسؤول توصيل</option>
								</select>
							</div>

							<div className='space-y-2'>
								<label htmlFor='new-user-password' className='block text-sm font-medium text-gray-700'>
									كلمة المرور
								</label>
								<input
									id='new-user-password'
									type='password'
									value={newUserPassword}
									onChange={(e) => setNewUserPassword(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									required
								/>
							</div>

							<div className='flex justify-end space-x-2 space-x-reverse pt-4'>
								<button
									type='button'
									onClick={() => setShowAddUserModal(false)}
									className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
									disabled={isSubmitting}
								>
									إلغاء
								</button>
								<button
									type='submit'
									disabled={isSubmitting}
									className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed'
								>
									{isSubmitting ? 'جاري الإضافة...' : 'إضافة المستخدم'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
