'use client';

import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { auth } from '../../../lib/db/firebase';

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setError('');
		setLoading(true);

		try {
			await signInWithEmailAndPassword(auth, email, password);
			router.push('/dashboard');
		} catch (error: any) {
			console.error('Login error:', error);

			switch (error.code) {
				case 'auth/user-not-found':
					setError('لا يوجد حساب بهذا البريد الإلكتروني');
					break;
				case 'auth/wrong-password':
					setError('كلمة المرور غير صحيحة');
					break;
				case 'auth/invalid-email':
					setError('البريد الإلكتروني غير صالح');
					break;
				default:
					setError('حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى');
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>تسجيل الدخول إلى حسابك</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>
						أو{' '}
						<Link href='/auth/register' className='font-medium text-green-600 hover:text-green-500'>
							قم بإنشاء حساب جديد
						</Link>
					</p>
				</div>

				<form className='mt-8 space-y-6' onSubmit={handleLogin}>
					<div className='rounded-md shadow-sm -space-y-px'>
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
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm'
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
								autoComplete='current-password'
								required
								className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm'
								placeholder='كلمة المرور'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>

					{error && <div className='text-red-500 text-sm bg-red-50 p-3 rounded-md'>{error}</div>}

					<div className='flex items-center justify-between'>
						<div className='flex items-center'>
							<input
								id='remember-me'
								name='remember-me'
								type='checkbox'
								className='h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded'
							/>
							<label htmlFor='remember-me' className='mr-2 block text-sm text-gray-900'>
								تذكرني
							</label>
						</div>

						<div className='text-sm'>
							<Link
								href='/auth/forgot-password'
								className='font-medium text-green-600 hover:text-green-500'
							>
								نسيت كلمة المرور؟
							</Link>
						</div>
					</div>

					<div>
						<button
							type='submit'
							disabled={loading}
							className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
						>
							{loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
