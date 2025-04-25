'use client';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth, db } from '../../../lib/db/firebase';

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');

		// Validate form
		if (password !== confirmPassword) {
			setError('كلمات المرور غير متطابقة');
			return;
		}

		if (password.length < 6) {
			setError('يجب أن تكون كلمة المرور 6 أحرف على الأقل');
			return;
		}

		setLoading(true);

		try {
			// Create user in Firebase Auth
			const userCredential = await createUserWithEmailAndPassword(auth, email, password);
			const user = userCredential.user;

			// Update user profile with name
			await updateProfile(user, {
				displayName: name,
			});

			// Store additional user data in Firestore
			await setDoc(doc(db, 'users', user.uid), {
				name,
				email,
				role: 'admin', // Default role for self-registration
				active: true,
				createdAt: serverTimestamp(),
				updatedAt: serverTimestamp(),
			});

			router.push('/dashboard');
		} catch (error: any) {
			console.error('Registration error:', error);

			switch (error.code) {
				case 'auth/email-already-in-use':
					setError('البريد الإلكتروني مستخدم بالفعل');
					break;
				case 'auth/invalid-email':
					setError('البريد الإلكتروني غير صالح');
					break;
				case 'auth/weak-password':
					setError('كلمة المرور ضعيفة جدًا');
					break;
				default:
					setError('حدث خطأ أثناء إنشاء الحساب. الرجاء المحاولة مرة أخرى');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>إنشاء حساب جديد</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						أو{' '}
						<Link href='/auth/login' className='font-medium text-green-600 hover:text-green-500'>
							قم بتسجيل الدخول إذا كان لديك حساب
						</Link>
					</p>
				</div>

				<form className='mt-8 space-y-6' onSubmit={handleRegister}>
					<div className='rounded-md shadow-sm -space-y-px'>
						<div>
							<label htmlFor='name' className='sr-only'>
								الاسم الكامل
							</label>
							<input
								id='name'
								name='name'
								type='text'
								required
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm'
								placeholder='الاسم الكامل'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor='email-address' className='sr-only'>
								البريد الإلكتروني
							</label>
							<input
								id='email-address'
								name='email'
								type='email'
								autoComplete='email'
								required
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm'
								placeholder='البريد الإلكتروني'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor='password' className='sr-only'>
								كلمة المرور
							</label>
							<input
								id='password'
								name='password'
								type='password'
								autoComplete='new-password'
								required
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm'
								placeholder='كلمة المرور'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor='confirm-password' className='sr-only'>
								تأكيد كلمة المرور
							</label>
							<input
								id='confirm-password'
								name='confirm-password'
								type='password'
								autoComplete='new-password'
								required
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm'
								placeholder='تأكيد كلمة المرور'
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</div>
					</div>

					{error && <div className='text-red-500 text-sm bg-red-50 p-3 rounded-md'>{error}</div>}

					<div>
						<button
							type='submit'
							disabled={loading}
							className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
						>
							{loading ? 'جاري إنشاء الحساب...' : 'إنشاء حساب'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
