'use client';

import {
	ArrowLeft,
	ArrowRight,
	BarChart2,
	CheckCircle,
	ChevronDown,
	Clock,
	ExternalLink,
	Eye,
	Flag,
	MessageCircle,
	MessageSquare,
	MoreHorizontal,
	Package,
	RefreshCw,
	Search,
	Settings,
	Slash,
	Star,
	ThumbsDown,
	ThumbsUp,
	Trash,
	User,
	X,
	XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Review {
	id: string;
	productId: string;
	productName: string;
	productSlug: string;
	productImage: string;
	customerId: string;
	customerName: string;
	customerEmail: string;
	rating: number;
	title: string;
	content: string;
	status: 'approved' | 'pending' | 'rejected' | 'spam';
	helpful: number;
	notHelpful: number;
	date: string;
	updatedAt: string;
	reply?: {
		content: string;
		date: string;
	};
	reported: boolean;
	reportReason?: string;
}

interface ReviewStats {
	totalReviews: number;
	pendingReviews: number;
	approvedReviews: number;
	rejectedReviews: number;
	spamReviews: number;
	averageRating: number;
	ratingCounts: {
		5: number;
		4: number;
		3: number;
		2: number;
		1: number;
	};
}

export default function ReviewsPage() {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
	const [loading, setLoading] = useState(true);
	const [expandedReview, setExpandedReview] = useState<string | null>(null);
	const [stats, setStats] = useState<ReviewStats | null>(null);
	const [selectedReview, setSelectedReview] = useState<Review | null>(null);
	const [showReplyModal, setShowReplyModal] = useState(false);
	const [replyContent, setReplyContent] = useState<string>('');
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	// حالة الفلترة
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [ratingFilter, setRatingFilter] = useState('all');
	const [dateFilter, setDateFilter] = useState('all');
	const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);

	// محاكاة استدعاء API للحصول على البيانات
	useEffect(() => {
		const fetchData = async () => {
			// محاكاة تأخير استجابة الخادم
			await new Promise((resolve) => setTimeout(resolve, 800));

			// بيانات تجريبية للتعليقات
			const mockReviews: Review[] = [
				{
					id: 'rev-001',
					productId: 'prod-001',
					productName: 'ثوب كلاسيكي أبيض',
					productSlug: 'classic-white-thobe',
					productImage: '/images/products/thobe-white-1.jpg',
					customerId: 'cust-001',
					customerName: 'محمد عبدالله',
					customerEmail: 'mohamed@example.com',
					rating: 5,
					title: 'منتج ممتاز وخامة عالية الجودة',
					content:
						'اشتريت هذا الثوب وكنت سعيداً جداً بالخامة والجودة. المقاس مضبوط تماماً والخامة ممتازة. أنصح بشدة بشرائه.',
					status: 'approved',
					helpful: 12,
					notHelpful: 1,
					date: '2023-09-15T10:30:00',
					updatedAt: '2023-09-15T12:45:00',
					reply: {
						content: 'شكراً لك على تقييمك الإيجابي! يسعدنا أن المنتج نال إعجابك ونتمنى أن نراك مجدداً.',
						date: '2023-09-16T09:20:00',
					},
					reported: false,
				},
				{
					id: 'rev-002',
					productId: 'prod-002',
					productName: 'بشت شتوي بني',
					productSlug: 'winter-brown-bisht',
					productImage: '/images/products/bisht-brown-1.jpg',
					customerId: 'cust-002',
					customerName: 'فهد سعيد',
					customerEmail: 'fahad@example.com',
					rating: 4,
					title: 'بشت فاخر بتفاصيل دقيقة',
					content:
						'المنتج أكثر من رائع وخامته فاخرة جداً، لكن هناك بعض الملاحظات الصغيرة على التطريز. بشكل عام أنا راضي عن الشراء.',
					status: 'approved',
					helpful: 8,
					notHelpful: 0,
					date: '2023-09-18T16:15:00',
					updatedAt: '2023-09-18T16:15:00',
					reported: false,
				},
				{
					id: 'rev-003',
					productId: 'prod-003',
					productName: 'غترة بيضاء فاخرة',
					productSlug: 'premium-white-ghutra',
					productImage: '/images/products/ghutra-white-1.jpg',
					customerId: 'cust-003',
					customerName: 'عبدالرحمن الفهد',
					customerEmail: 'ar.fahad@example.com',
					rating: 2,
					title: 'الخامة أقل من المتوقع',
					content:
						'للأسف الخامة ليست بالجودة المتوقعة والموضحة في وصف المنتج. الغترة خفيفة جداً ولا تبدو فاخرة كما هو مذكور.',
					status: 'approved',
					helpful: 4,
					notHelpful: 2,
					date: '2023-09-20T14:00:00',
					updatedAt: '2023-09-20T14:00:00',
					reply: {
						content:
							'نأسف لعدم رضاك عن المنتج! نود التواصل معك لحل المشكلة، يرجى التواصل مع خدمة العملاء على الرقم 0501234567.',
						date: '2023-09-21T08:45:00',
					},
					reported: false,
				},
				{
					id: 'rev-004',
					productId: 'prod-004',
					productName: 'عقال أسود كلاسيكي',
					productSlug: 'classic-black-eqal',
					productImage: '/images/products/eqal-black-1.jpg',
					customerId: 'cust-004',
					customerName: 'خالد السالم',
					customerEmail: 'khalid.s@example.com',
					rating: 5,
					title: 'عقال أنيق وعملي',
					content:
						'عقال ممتاز وخامة عالية الجودة، يحافظ على شكله حتى بعد الاستخدام المتكرر. سعره مناسب جداً مقارنة بالجودة.',
					status: 'pending',
					helpful: 0,
					notHelpful: 0,
					date: '2023-10-01T11:20:00',
					updatedAt: '2023-10-01T11:20:00',
					reported: false,
				},
				{
					id: 'rev-005',
					productId: 'prod-005',
					productName: 'ثوب صيفي بيج',
					productSlug: 'summer-beige-thobe',
					productImage: '/images/products/thobe-beige-1.jpg',
					customerId: 'cust-005',
					customerName: 'طارق المطيري',
					customerEmail: 'tarek.m@example.com',
					rating: 1,
					title: 'تجربة سيئة للغاية',
					content:
						'هذا المنتج لا يستحق السعر المطلوب على الإطلاق! الخامة سيئة جداً والتفصيل غير دقيق. حاولت إرجاع المنتج لكن لم أتلقى أي رد من خدمة العملاء.',
					status: 'pending',
					helpful: 1,
					notHelpful: 0,
					date: '2023-10-02T09:15:00',
					updatedAt: '2023-10-02T09:15:00',
					reported: true,
					reportReason: 'محتوى غير لائق',
				},
				{
					id: 'rev-006',
					productId: 'prod-006',
					productName: 'شماغ أحمر فاخر',
					productSlug: 'premium-red-shmagh',
					productImage: '/images/products/shmagh-red-1.jpg',
					customerId: 'cust-006',
					customerName: 'سلطان العتيبي',
					customerEmail: 'sultan.otb@example.com',
					rating: 4,
					title: 'شماغ جميل بالكثير من التفاصيل',
					content:
						'الشماغ ممتاز من ناحية الخامة والنقشة. الألوان ثابتة حتى بعد الغسيل عدة مرات. التغليف كان أنيق ومناسب للهدايا.',
					status: 'approved',
					helpful: 6,
					notHelpful: 1,
					date: '2023-09-25T15:45:00',
					updatedAt: '2023-09-25T15:45:00',
					reported: false,
				},
				{
					id: 'rev-007',
					productId: 'prod-007',
					productName: 'سروال قطني أسود',
					productSlug: 'black-cotton-pants',
					productImage: '/images/products/pants-black-1.jpg',
					customerId: 'cust-007',
					customerName: 'علي الشهري',
					customerEmail: 'ali.sh@example.com',
					rating: 3,
					title: 'منتج مقبول',
					content:
						'السروال جيد من ناحية المقاس لكن الخامة متوسطة الجودة. أعتقد أن هناك خيارات أفضل متاحة بنفس السعر.',
					status: 'approved',
					helpful: 2,
					notHelpful: 3,
					date: '2023-09-28T12:10:00',
					updatedAt: '2023-09-28T12:10:00',
					reported: false,
				},
				{
					id: 'rev-008',
					productId: 'prod-001',
					productName: 'ثوب كلاسيكي أبيض',
					productSlug: 'classic-white-thobe',
					productImage: '/images/products/thobe-white-1.jpg',
					customerId: 'cust-008',
					customerName: 'فيصل الدوسري',
					customerEmail: 'faisal.d@example.com',
					rating: 5,
					title: 'أفضل ثوب اشتريته',
					content:
						'ثوب رائع جداً، والتجربة كانت أكثر من ممتازة. الخامة فاخرة والخياطة متقنة. المقاس مضبوط وشكله أنيق جداً.',
					status: 'approved',
					helpful: 10,
					notHelpful: 0,
					date: '2023-09-10T17:30:00',
					updatedAt: '2023-09-10T17:30:00',
					reply: {
						content: 'شكراً لتقييمك الإيجابي! نعمل دائماً على تقديم أفضل جودة لعملائنا الكرام.',
						date: '2023-09-11T10:00:00',
					},
					reported: false,
				},
				{
					id: 'rev-009',
					productId: 'prod-004',
					productName: 'عقال أسود كلاسيكي',
					productSlug: 'classic-black-eqal',
					productImage: '/images/products/eqal-black-1.jpg',
					customerId: 'cust-009',
					customerName: 'ماجد القحطاني',
					customerEmail: 'majed.q@example.com',
					rating: 5,
					title: 'عقال فاخر بجودة عالية',
					content: 'اشتريت العقال هدية لوالدي وكان سعيداً جداً به. الجودة عالية والسعر مناسب.',
					status: 'rejected',
					helpful: 0,
					notHelpful: 0,
					date: '2023-10-03T14:25:00',
					updatedAt: '2023-10-03T15:40:00',
					reported: false,
				},
				{
					id: 'rev-010',
					productId: 'prod-006',
					productName: 'شماغ أحمر فاخر',
					productSlug: 'premium-red-shmagh',
					productImage: '/images/products/shmagh-red-1.jpg',
					customerId: 'cust-010',
					customerName: 'سمير الراشد',
					customerEmail: 'samir@example.com',
					rating: 2,
					title: 'منتج لم يلبِ التوقعات',
					content: 'جودة الشماغ أقل من المتوقع، لا يستحق السعر المطلوب.',
					status: 'spam',
					helpful: 0,
					notHelpful: 0,
					date: '2023-10-01T16:30:00',
					updatedAt: '2023-10-01T17:15:00',
					reported: true,
					reportReason: 'تعليق مكرر',
				},
				{
					id: 'rev-011',
					productId: 'prod-008',
					productName: 'طاقية صوف شتوية',
					productSlug: 'winter-wool-cap',
					productImage: '/images/products/cap-wool-1.jpg',
					customerId: 'cust-011',
					customerName: 'عبدالعزيز الزهراني',
					customerEmail: 'aziz.z@example.com',
					rating: 4,
					title: 'طاقية دافئة ومريحة',
					content: 'الطاقية دافئة جداً ومناسبة للطقس البارد. المقاس مناسب والخامة مريحة على الرأس.',
					status: 'pending',
					helpful: 0,
					notHelpful: 0,
					date: '2023-10-04T13:20:00',
					updatedAt: '2023-10-04T13:20:00',
					reported: false,
				},
				{
					id: 'rev-012',
					productId: 'prod-005',
					productName: 'ثوب صيفي بيج',
					productSlug: 'summer-beige-thobe',
					productImage: '/images/products/thobe-beige-1.jpg',
					customerId: 'cust-012',
					customerName: 'نايف الحربي',
					customerEmail: 'naif.h@example.com',
					rating: 5,
					title: 'ثوب خفيف ومريح للصيف',
					content: 'ثوب رائع للصيف، خفيف ويمتص العرق. اللون جميل والخامة مريحة جداً.',
					status: 'approved',
					helpful: 5,
					notHelpful: 1,
					date: '2023-09-22T11:10:00',
					updatedAt: '2023-09-22T11:10:00',
					reported: false,
				},
			];

			// حساب الإحصائيات
			const totalReviews = mockReviews.length;
			const pendingReviews = mockReviews.filter((review) => review.status === 'pending').length;
			const approvedReviews = mockReviews.filter((review) => review.status === 'approved').length;
			const rejectedReviews = mockReviews.filter((review) => review.status === 'rejected').length;
			const spamReviews = mockReviews.filter((review) => review.status === 'spam').length;

			const totalRatingSum = mockReviews.reduce((sum, review) => sum + review.rating, 0);
			const averageRating = totalRatingSum / totalReviews;

			// حساب عدد التقييمات لكل نجمة
			const ratingCounts = {
				5: mockReviews.filter((review) => review.rating === 5).length,
				4: mockReviews.filter((review) => review.rating === 4).length,
				3: mockReviews.filter((review) => review.rating === 3).length,
				2: mockReviews.filter((review) => review.rating === 2).length,
				1: mockReviews.filter((review) => review.rating === 1).length,
			};

			const statsData: ReviewStats = {
				totalReviews,
				pendingReviews,
				approvedReviews,
				rejectedReviews,
				spamReviews,
				averageRating,
				ratingCounts,
			};

			setReviews(mockReviews);
			setFilteredReviews(mockReviews);
			setStats(statsData);

			setLoading(false);
		};

		fetchData();
	}, []);

	// تطبيق الفلترة
	useEffect(() => {
		let result = [...reviews];

		// تطبيق فلتر البحث
		if (searchTerm) {
			result = result.filter(
				(review) =>
					review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					review.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
					review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
					review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
					review.content.toLowerCase().includes(searchTerm.toLowerCase())
			);
		}

		// تطبيق فلتر الحالة
		if (statusFilter !== 'all') {
			result = result.filter((review) => review.status === statusFilter);
		}

		// تطبيق فلتر التقييم
		if (ratingFilter !== 'all') {
			const rating = parseInt(ratingFilter);
			result = result.filter((review) => review.rating === rating);
		}

		// تطبيق فلتر التاريخ
		if (dateFilter !== 'all') {
			const now = new Date();
			const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			if (dateFilter === 'today') {
				result = result.filter((review) => {
					const reviewDate = new Date(review.date);
					return reviewDate.toDateString() === today.toDateString();
				});
			} else if (dateFilter === 'week') {
				const weekAgo = new Date(today.getTime() - 7 * 86400000);
				result = result.filter((review) => {
					const reviewDate = new Date(review.date);
					return reviewDate >= weekAgo;
				});
			} else if (dateFilter === 'month') {
				const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
				result = result.filter((review) => {
					const reviewDate = new Date(review.date);
					return reviewDate >= monthAgo;
				});
			}
		}

		// تطبيق الترتيب
		result.sort((a, b) => {
			if (sortBy === 'date') {
				return sortOrder === 'asc'
					? new Date(a.date).getTime() - new Date(b.date).getTime()
					: new Date(b.date).getTime() - new Date(a.date).getTime();
			} else {
				return sortOrder === 'asc' ? a.rating - b.rating : b.rating - a.rating;
			}
		});

		setFilteredReviews(result);
		setCurrentPage(1); // إعادة تعيين الصفحة الحالية عند تغيير الفلاتر
	}, [searchTerm, statusFilter, ratingFilter, dateFilter, sortBy, sortOrder, reviews]);

	// توسيع/طي تفاصيل التعليق
	const toggleReviewExpand = (reviewId: string) => {
		if (expandedReview === reviewId) {
			setExpandedReview(null);
		} else {
			setExpandedReview(reviewId);
		}
	};

	// فتح نافذة الرد على التعليق
	const openReplyModal = (review: Review) => {
		setSelectedReview(review);
		setReplyContent(review.reply?.content || '');
		setShowReplyModal(true);
	};

	// حفظ الرد على التعليق
	const saveReply = () => {
		if (!selectedReview) return;

		const updatedReviews = reviews.map((review) => {
			if (review.id === selectedReview.id) {
				return {
					...review,
					reply: {
						content: replyContent,
						date: new Date().toISOString(),
					},
					updatedAt: new Date().toISOString(),
				};
			}
			return review;
		});

		setReviews(updatedReviews);
		setFilteredReviews(updatedReviews);
		setShowReplyModal(false);
		setSelectedReview(null);
		setReplyContent('');
	};

	// تغيير حالة التعليق
	const changeReviewStatus = (reviewId: string, newStatus: Review['status']) => {
		const updatedReviews = reviews.map((review) => {
			if (review.id === reviewId) {
				return {
					...review,
					status: newStatus,
					updatedAt: new Date().toISOString(),
				};
			}
			return review;
		});

		// تحديث الإحصائيات
		if (stats) {
			const oldReview = reviews.find((r) => r.id === reviewId);
			if (oldReview) {
				const newStats = { ...stats };

				// تقليل العداد من الحالة القديمة
				if (oldReview.status === 'pending') newStats.pendingReviews--;
				else if (oldReview.status === 'approved') newStats.approvedReviews--;
				else if (oldReview.status === 'rejected') newStats.rejectedReviews--;
				else if (oldReview.status === 'spam') newStats.spamReviews--;

				// زيادة العداد في الحالة الجديدة
				if (newStatus === 'pending') newStats.pendingReviews++;
				else if (newStatus === 'approved') newStats.approvedReviews++;
				else if (newStatus === 'rejected') newStats.rejectedReviews++;
				else if (newStatus === 'spam') newStats.spamReviews++;

				setStats(newStats);
			}
		}

		setReviews(updatedReviews);
		setFilteredReviews(updatedReviews);
	};

	// حذف التعليق
	const deleteReview = () => {
		if (!selectedReview) return;

		const updatedReviews = reviews.filter((review) => review.id !== selectedReview.id);

		// تحديث الإحصائيات
		if (stats) {
			const newStats = { ...stats };
			newStats.totalReviews--;

			if (selectedReview.status === 'pending') newStats.pendingReviews--;
			else if (selectedReview.status === 'approved') newStats.approvedReviews--;
			else if (selectedReview.status === 'rejected') newStats.rejectedReviews--;
			else if (selectedReview.status === 'spam') newStats.spamReviews--;

			// تحديث متوسط التقييم
			const totalRatingSum = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
			newStats.averageRating = updatedReviews.length > 0 ? totalRatingSum / updatedReviews.length : 0;

			// تحديث عدد كل تقييم
			newStats.ratingCounts[selectedReview.rating as keyof typeof newStats.ratingCounts]--;

			setStats(newStats);
		}

		setReviews(updatedReviews);
		setFilteredReviews(updatedReviews);
		setShowDeleteConfirm(false);
		setSelectedReview(null);
	};

	// تنسيق التاريخ
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString('ar-SA', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	// عرض التقييم بالنجوم
	const renderStars = (rating: number) => {
		return (
			<div className='flex'>
				{Array.from({ length: 5 }).map((_, index) => (
					<Star
						key={index}
						className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
					/>
				))}
			</div>
		);
	};

	// عرض حالة التعليق
	const renderReviewStatusBadge = (status: string) => {
		switch (status) {
			case 'approved':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
						موافق عليه
					</span>
				);
			case 'pending':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>
						قيد المراجعة
					</span>
				);
			case 'rejected':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
						مرفوض
					</span>
				);
			case 'spam':
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						سبام
					</span>
				);
			default:
				return (
					<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>
						{status}
					</span>
				);
		}
	};

	// حساب صفحات الترقيم
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentItems = filteredReviews.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

	// تغيير الصفحة
	const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

	if (loading) {
		return (
			<div className='flex justify-center items-center h-screen'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500'></div>
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			{/* رأس الصفحة */}
			<div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
				<div>
					<h1 className='text-2xl font-bold text-gray-900 flex items-center'>
						<MessageSquare className='inline-block ml-2 h-7 w-7 text-indigo-600' />
						تعليقات العملاء
					</h1>
					<p className='mt-1 text-gray-500'>إدارة وتنظيم تقييمات ومراجعات العملاء</p>
				</div>

				<div className='flex flex-wrap gap-2'>
					<Link
						href='/dashboard/ecommerce/reviews/settings'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<Settings className='ml-1 h-4 w-4' />
						الإعدادات
					</Link>
					<Link
						href='/dashboard/ecommerce/reviews/reports'
						className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center'
					>
						<BarChart2 className='ml-1 h-4 w-4' />
						التحليلات
					</Link>
					<button
						onClick={() => {
							// محاكاة تحديث البيانات
							setLoading(true);
							setTimeout(() => setLoading(false), 500);
						}}
						className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center'
					>
						<RefreshCw className='ml-1 h-4 w-4' />
						تحديث
					</button>
				</div>
			</div>

			{/* بطاقات الإحصائيات */}
			{stats && (
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>إجمالي التعليقات</p>
								<p className='text-2xl font-bold text-indigo-600'>{stats.totalReviews}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600'>
								<MessageSquare className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>{stats.pendingReviews} تعليق بانتظار المراجعة</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>متوسط التقييم</p>
								<div className='flex items-center'>
									<p className='text-2xl font-bold text-amber-500'>
										{stats.averageRating.toFixed(1)}
									</p>
									<div className='mr-1'>
										<Star className='h-5 w-5 text-amber-400 fill-current' />
									</div>
								</div>
							</div>
							<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
								<Star className='h-6 w-6 fill-current' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>من أصل 5 نجوم</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>التعليقات الموافق عليها</p>
								<p className='text-2xl font-bold text-green-600'>{stats.approvedReviews}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600'>
								<CheckCircle className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>
							{((stats.approvedReviews / stats.totalReviews) * 100).toFixed(0)}% من الإجمالي
						</div>
					</div>

					<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
						<div className='flex justify-between'>
							<div>
								<p className='text-sm text-gray-500'>تعليقات بانتظار المراجعة</p>
								<p className='text-2xl font-bold text-amber-600'>{stats.pendingReviews}</p>
							</div>
							<div className='h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600'>
								<Clock className='h-6 w-6' />
							</div>
						</div>
						<div className='mt-2 text-xs text-gray-500'>
							{stats.rejectedReviews} مرفوض / {stats.spamReviews} سبام
						</div>
					</div>
				</div>
			)}

			{/* أدوات البحث والفلترة */}
			<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
				<div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
					{/* البحث */}
					<div className='md:col-span-2 relative'>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
							<Search className='h-5 w-5 text-gray-400' />
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							placeholder='بحث عن اسم المنتج، اسم العميل، محتوى...'
							className='block w-full pr-10 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						/>
					</div>

					{/* فلتر الحالة */}
					<div className='relative'>
						<select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع الحالات</option>
							<option value='pending'>قيد المراجعة</option>
							<option value='approved'>موافق عليه</option>
							<option value='rejected'>مرفوض</option>
							<option value='spam'>سبام</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر التقييم */}
					<div className='relative'>
						<select
							value={ratingFilter}
							onChange={(e) => setRatingFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع التقييمات</option>
							<option value='5'>5 نجوم</option>
							<option value='4'>4 نجوم</option>
							<option value='3'>3 نجوم</option>
							<option value='2'>2 نجمة</option>
							<option value='1'>1 نجمة</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>

					{/* فلتر التاريخ */}
					<div className='relative'>
						<select
							value={dateFilter}
							onChange={(e) => setDateFilter(e.target.value)}
							className='block w-full appearance-none rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='all'>جميع التواريخ</option>
							<option value='today'>اليوم</option>
							<option value='week'>آخر أسبوع</option>
							<option value='month'>آخر شهر</option>
						</select>
						<div className='absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none'>
							<ChevronDown className='h-4 w-4 text-gray-400' />
						</div>
					</div>
				</div>

				{/* معلومات الفلترة والترتيب */}
				<div className='mt-4 pt-3 border-t border-gray-200 flex flex-wrap justify-between items-center'>
					<div className='text-sm text-gray-500 mb-2'>
						عرض {filteredReviews.length} من {reviews.length} تعليق
						{(searchTerm || statusFilter !== 'all' || ratingFilter !== 'all' || dateFilter !== 'all') && (
							<button
								onClick={() => {
									setSearchTerm('');
									setStatusFilter('all');
									setRatingFilter('all');
									setDateFilter('all');
								}}
								className='mr-3 text-xs text-indigo-600 hover:text-indigo-800'
							>
								مسح الفلاتر
							</button>
						)}
					</div>

					<div className='flex items-center mb-2'>
						<span className='text-sm text-gray-500 ml-2'>ترتيب حسب:</span>
						<select
							value={`${sortBy}_${sortOrder}`}
							onChange={(e) => {
								const [newSortBy, newSortOrder] = e.target.value.split('_') as [
									'date' | 'rating',
									'asc' | 'desc'
								];
								setSortBy(newSortBy);
								setSortOrder(newSortOrder);
							}}
							className='block appearance-none bg-white border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
						>
							<option value='date_desc'>الأحدث أولاً</option>
							<option value='date_asc'>الأقدم أولاً</option>
							<option value='rating_desc'>التقييم (من الأعلى للأقل)</option>
							<option value='rating_asc'>التقييم (من الأقل للأعلى)</option>
						</select>
					</div>
				</div>
			</div>

			{/* قائمة التعليقات */}
			{currentItems.length > 0 ? (
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='divide-y divide-gray-200'>
						{currentItems.map((review) => (
							<div key={review.id} className='p-4 hover:bg-gray-50'>
								<div className='flex flex-col md:flex-row md:items-start'>
									{/* معلومات المنتج والعميل */}
									<div className='md:w-1/3 flex items-start mb-3 md:mb-0'>
										<div className='flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md mr-3'>
											{review.productImage ? (
												<img
													src={review.productImage}
													alt={review.productName}
													className='h-12 w-12 rounded-md object-cover'
												/>
											) : (
												<div className='h-12 w-12 rounded-md flex items-center justify-center text-gray-400'>
													<Package className='h-6 w-6' />
												</div>
											)}
										</div>
										<div>
											<p className='text-sm font-medium text-gray-900'>
												<Link
													href={`/dashboard/ecommerce/products/${review.productId}`}
													className='hover:text-indigo-600'
												>
													{review.productName}
												</Link>
											</p>
											<p className='text-xs text-gray-500 mt-1'>بواسطة: {review.customerName}</p>
											<div className='mt-1 flex items-center'>
												{renderStars(review.rating)}
												<span className='text-xs text-gray-500 mr-2'>
													{formatDate(review.date)}
												</span>
											</div>
										</div>
									</div>

									{/* محتوى التعليق */}
									<div className='md:w-2/5 md:px-4'>
										<div className='mb-1'>
											<button
												onClick={() => toggleReviewExpand(review.id)}
												className='text-sm font-medium text-gray-900 hover:text-indigo-600 focus:outline-none'
											>
												{review.title}
											</button>
										</div>
										<p className='text-sm text-gray-600 line-clamp-2'>{review.content}</p>
										{review.reported && (
											<div className='mt-1'>
												<span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800'>
													<Flag className='h-3 w-3 mr-1' />
													تم الإبلاغ
												</span>
												{review.reportReason && (
													<span className='text-xs text-gray-500 mr-1'>
														({review.reportReason})
													</span>
												)}
											</div>
										)}
										{review.reply && (
											<div className='mt-2 text-xs text-gray-500'>
												<span className='font-medium'>الرد:</span>{' '}
												{review.reply.content.substring(0, 50)}
												{review.reply.content.length > 50 && '...'}
											</div>
										)}
									</div>

									{/* الحالة والإجراءات */}
									<div className='md:w-1/4 flex flex-col items-end mt-3 md:mt-0'>
										<div className='mb-2'>{renderReviewStatusBadge(review.status)}</div>
										<div className='flex items-center space-x-2 space-x-reverse'>
											{/* أزرار الإجراءات على التعليق */}
											<button
												onClick={() => openReplyModal(review)}
												className='p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md'
												title='رد'
											>
												<MessageCircle className='h-5 w-5' />
											</button>

											{review.status !== 'approved' && (
												<button
													onClick={() => changeReviewStatus(review.id, 'approved')}
													className='p-1.5 text-green-600 hover:bg-green-50 rounded-md'
													title='موافقة'
												>
													<CheckCircle className='h-5 w-5' />
												</button>
											)}

											{review.status !== 'rejected' && (
												<button
													onClick={() => changeReviewStatus(review.id, 'rejected')}
													className='p-1.5 text-red-600 hover:bg-red-50 rounded-md'
													title='رفض'
												>
													<XCircle className='h-5 w-5' />
												</button>
											)}

											{review.status !== 'spam' && (
												<button
													onClick={() => changeReviewStatus(review.id, 'spam')}
													className='p-1.5 text-gray-600 hover:bg-gray-100 rounded-md'
													title='سبام'
												>
													<Slash className='h-5 w-5' />
												</button>
											)}

											<div className='relative group'>
												<button
													className='p-1.5 text-gray-500 hover:bg-gray-100 rounded-md'
													title='المزيد من الخيارات'
												>
													<MoreHorizontal className='h-5 w-5' />
												</button>
												<div className='absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block'>
													<button
														className='block w-full text-right px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50'
														onClick={() => toggleReviewExpand(review.id)}
													>
														<Eye className='inline ml-1 h-4 w-4' />
														عرض التفاصيل
													</button>
													<button
														className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
														onClick={() => openReplyModal(review)}
													>
														<MessageCircle className='inline ml-1 h-4 w-4' />
														الرد على التعليق
													</button>
													<a
														href={`https://anaqati.com/products/${review.productSlug}#review-${review.id}`}
														target='_blank'
														rel='noopener noreferrer'
														className='block w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
													>
														<ExternalLink className='inline ml-1 h-4 w-4' />
														عرض في المتجر
													</a>
													<button
														className='block w-full text-right px-4 py-2 text-sm text-red-600 hover:bg-red-50'
														onClick={() => {
															setSelectedReview(review);
															setShowDeleteConfirm(true);
														}}
													>
														<Trash className='inline ml-1 h-4 w-4' />
														حذف التعليق
													</button>
												</div>
											</div>
										</div>

										{/* إحصائيات التعليق */}
										<div className='mt-4 flex items-center text-xs text-gray-500'>
											<ThumbsUp className='h-3 w-3 mr-1' />
											<span>{review.helpful}</span>
											<ThumbsDown className='h-3 w-3 mr-2 ml-1' />
											<span>{review.notHelpful}</span>
										</div>
									</div>
								</div>

								{/* تفاصيل التعليق الموسعة */}
								{expandedReview === review.id && (
									<div className='mt-4 pt-3 border-t border-gray-200 animate-fadeIn'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
											<div>
												<h4 className='text-sm font-medium text-gray-700 mb-2'>
													التعليق الكامل
												</h4>
												<div className='bg-gray-50 p-3 rounded-md border border-gray-200'>
													<h5 className='text-sm font-medium text-gray-900'>
														{review.title}
													</h5>
													<p className='mt-2 text-sm text-gray-600 whitespace-pre-line'>
														{review.content}
													</p>
												</div>

												{review.reply && (
													<div className='mt-3'>
														<h4 className='text-sm font-medium text-gray-700 mb-2'>
															الرد من المتجر
														</h4>
														<div className='bg-indigo-50 p-3 rounded-md border border-indigo-100'>
															<p className='text-sm text-gray-600'>
																{review.reply.content}
															</p>
															<p className='mt-1 text-xs text-gray-500'>
																بتاريخ: {formatDate(review.reply.date)}
															</p>
														</div>
													</div>
												)}
											</div>

											<div>
												<h4 className='text-sm font-medium text-gray-700 mb-2'>
													معلومات إضافية
												</h4>
												<div className='bg-gray-50 p-3 rounded-md border border-gray-200'>
													<div className='grid grid-cols-2 gap-2 text-sm'>
														<div>
															<p className='text-gray-500'>العميل:</p>
															<p className='font-medium text-gray-900'>
																{review.customerName}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>البريد الإلكتروني:</p>
															<p className='font-medium text-gray-900 text-xs' dir='ltr'>
																{review.customerEmail}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>تاريخ التعليق:</p>
															<p className='font-medium text-gray-900'>
																{formatDate(review.date)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>آخر تحديث:</p>
															<p className='font-medium text-gray-900'>
																{formatDate(review.updatedAt)}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>المنتج:</p>
															<p className='font-medium text-gray-900'>
																{review.productName}
															</p>
														</div>
														<div>
															<p className='text-gray-500'>التقييم:</p>
															<div className='flex items-center'>
																{renderStars(review.rating)}
																<span className='mr-1 font-medium'>
																	{review.rating}/5
																</span>
															</div>
														</div>
													</div>

													<div className='mt-3 pt-3 border-t border-gray-200'>
														<p className='text-gray-500 mb-1'>الإحصائيات:</p>
														<div className='flex items-center space-x-4 space-x-reverse'>
															<div className='flex items-center'>
																<ThumbsUp className='h-4 w-4 ml-1 text-green-600' />
																<span className='text-sm'>{review.helpful} مفيد</span>
															</div>
															<div className='flex items-center'>
																<ThumbsDown className='h-4 w-4 ml-1 text-red-600' />
																<span className='text-sm'>
																	{review.notHelpful} غير مفيد
																</span>
															</div>
															{review.reported && (
																<div className='flex items-center'>
																	<Flag className='h-4 w-4 ml-1 text-red-600' />
																	<span className='text-sm'>تم الإبلاغ</span>
																</div>
															)}
														</div>
													</div>
												</div>

												<div className='mt-3 flex flex-wrap gap-2'>
													<button
														onClick={() => openReplyModal(review)}
														className='px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm flex items-center'
													>
														<MessageCircle className='ml-1 h-4 w-4' />
														{review.reply ? 'تعديل الرد' : 'الرد على التعليق'}
													</button>

													{review.status !== 'approved' && (
														<button
															onClick={() => changeReviewStatus(review.id, 'approved')}
															className='px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center'
														>
															<CheckCircle className='ml-1 h-4 w-4' />
															موافقة
														</button>
													)}

													{review.status !== 'rejected' && (
														<button
															onClick={() => changeReviewStatus(review.id, 'rejected')}
															className='px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm flex items-center'
														>
															<XCircle className='ml-1 h-4 w-4' />
															رفض
														</button>
													)}

													<button
														onClick={() => {
															setSelectedReview(review);
															setShowDeleteConfirm(true);
														}}
														className='px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm flex items-center'
													>
														<Trash className='ml-1 h-4 w-4' />
														حذف
													</button>
												</div>
											</div>
										</div>
									</div>
								)}
							</div>
						))}
					</div>

					{/* الترقيم الصفحي */}
					<div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
						<div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
							<div>
								<p className='text-sm text-gray-700'>
									عرض <span className='font-medium'>{indexOfFirstItem + 1}</span> إلى{' '}
									<span className='font-medium'>
										{Math.min(indexOfLastItem, filteredReviews.length)}
									</span>{' '}
									من أصل <span className='font-medium'>{filteredReviews.length}</span> تعليق
								</p>
							</div>
							<div>
								<nav
									className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px space-x-reverse'
									aria-label='Pagination'
								>
									<button
										onClick={() => paginate(Math.max(1, currentPage - 1))}
										className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
											currentPage === 1 ? 'cursor-not-allowed opacity-50' : ''
										}`}
										disabled={currentPage === 1}
									>
										<span className='sr-only'>السابق</span>
										<ArrowRight className='h-5 w-5' />
									</button>

									{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
										let pageNumber;

										if (totalPages <= 5) {
											pageNumber = i + 1;
										} else if (currentPage <= 3) {
											pageNumber = i + 1;
										} else if (currentPage >= totalPages - 2) {
											pageNumber = totalPages - 4 + i;
										} else {
											pageNumber = currentPage - 2 + i;
										}

										return (
											<button
												key={pageNumber}
												onClick={() => paginate(pageNumber)}
												className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
													currentPage === pageNumber
														? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
														: 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
												}`}
											>
												{pageNumber}
											</button>
										);
									})}

									<button
										onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
										className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 ${
											currentPage === totalPages ? 'cursor-not-allowed opacity-50' : ''
										}`}
										disabled={currentPage === totalPages}
									>
										<span className='sr-only'>التالي</span>
										<ArrowLeft className='h-5 w-5' />
									</button>
								</nav>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className='bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center'>
					<MessageSquare className='h-12 w-12 text-gray-300 mx-auto mb-3' />
					<h3 className='text-lg font-medium text-gray-900'>لا توجد تعليقات</h3>
					<p className='mt-1 text-gray-500'>
						{searchTerm || statusFilter !== 'all' || ratingFilter !== 'all' || dateFilter !== 'all'
							? 'لم يتم العثور على تعليقات تطابق معايير البحث المحددة'
							: 'لا توجد تعليقات من العملاء بعد'}
					</p>
				</div>
			)}

			{/* تحليل التقييمات بالنجوم */}
			{stats && (
				<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
					<div className='flex justify-between items-center mb-4'>
						<h2 className='text-lg font-medium text-gray-900'>توزيع التقييمات</h2>
						<Link
							href='/dashboard/ecommerce/reviews/reports'
							className='text-sm text-indigo-600 hover:text-indigo-800'
						>
							عرض التحليل الكامل
						</Link>
					</div>

					<div className='space-y-3'>
						{[5, 4, 3, 2, 1].map((stars) => {
							const count = stats.ratingCounts[stars as keyof typeof stats.ratingCounts];
							const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

							return (
								<div key={stars}>
									<div className='flex items-center'>
										<div className='flex w-24'>
											{Array.from({ length: 5 }).map((_, index) => (
												<Star
													key={index}
													className={`h-4 w-4 ${
														index < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
													}`}
												/>
											))}
										</div>
										<div className='w-full ml-4'>
											<div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
												<div
													className={`h-full rounded-full ${
														stars === 5
															? 'bg-green-500'
															: stars === 4
															? 'bg-green-400'
															: stars === 3
															? 'bg-yellow-500'
															: stars === 2
															? 'bg-orange-500'
															: 'bg-red-500'
													}`}
													style={{ width: `${percentage}%` }}
												></div>
											</div>
										</div>
										<div className='min-w-[60px] text-right text-sm text-gray-500'>
											{count} ({percentage.toFixed(0)}%)
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{/* نوافذ الحوار */}

			{/* نافذة الرد على التعليق */}
			{showReplyModal && selectedReview && (
				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
						<div className='fixed inset-0 transition-opacity' onClick={() => setShowReplyModal(false)}>
							<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
						</div>

						<div className='inline-block align-middle bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
							<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								<div className='flex justify-between items-center mb-4'>
									<h3 className='text-lg font-medium text-gray-900'>
										{selectedReview.reply ? 'تعديل الرد' : 'الرد على التعليق'}
									</h3>
									<button
										onClick={() => setShowReplyModal(false)}
										className='text-gray-400 hover:text-gray-500'
									>
										<X className='h-5 w-5' />
									</button>
								</div>

								<div className='mb-4'>
									<div className='bg-gray-50 p-3 rounded-md border border-gray-200 mb-3'>
										<div className='flex items-center mb-2'>
											<User className='h-4 w-4 text-gray-500 ml-1' />
											<span className='text-sm font-medium text-gray-700'>
												{selectedReview.customerName}
											</span>
											<div className='mr-3'>{renderStars(selectedReview.rating)}</div>
										</div>
										<h4 className='text-sm font-medium text-gray-900'>{selectedReview.title}</h4>
										<p className='mt-1 text-sm text-gray-600'>{selectedReview.content}</p>
									</div>

									<label
										htmlFor='replyContent'
										className='block text-sm font-medium text-gray-700 mb-1'
									>
										الرد <span className='text-red-500'>*</span>
									</label>
									<textarea
										id='replyContent'
										value={replyContent}
										onChange={(e) => setReplyContent(e.target.value)}
										className='block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm'
										placeholder='أدخل ردك على تعليق العميل...'
										rows={4}
										required
									/>
									<p className='mt-1 text-xs text-gray-500'>
										سيظهر الرد عند عرض التعليق في صفحة المنتج.
									</p>
								</div>
							</div>

							<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
								<button
									type='button'
									onClick={saveReply}
									disabled={!replyContent.trim()}
									className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm ${
										!replyContent.trim() ? 'opacity-50 cursor-not-allowed' : ''
									}`}
								>
									حفظ الرد
								</button>
								<button
									type='button'
									onClick={() => setShowReplyModal(false)}
									className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
								>
									إلغاء
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* نافذة تأكيد الحذف */}
			{showDeleteConfirm && selectedReview && (
				<div className='fixed inset-0 z-50 overflow-y-auto'>
					<div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
						<div className='fixed inset-0 transition-opacity' onClick={() => setShowDeleteConfirm(false)}>
							<div className='absolute inset-0 bg-gray-500 opacity-75'></div>
						</div>

						<div className='inline-block align-middle bg-white rounded-lg text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'>
							<div className='bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
								<div className='sm:flex sm:items-start'>
									<div className='mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10'>
										<Trash className='h-6 w-6 text-red-600' />
									</div>
									<div className='mt-3 text-center sm:mt-0 sm:mr-4 sm:text-right'>
										<h3 className='text-lg leading-6 font-medium text-gray-900'>حذف التعليق</h3>
										<div className='mt-2'>
											<p className='text-sm text-gray-500'>
												هل أنت متأكد من رغبتك في حذف هذا التعليق؟ لا يمكن التراجع عن هذا
												الإجراء.
											</p>
										</div>
									</div>
								</div>
							</div>
							<div className='bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse'>
								<button
									type='button'
									onClick={deleteReview}
									className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm'
								>
									حذف
								</button>
								<button
									type='button'
									onClick={() => setShowDeleteConfirm(false)}
									className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm'
								>
									إلغاء
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
