'use client';

import {
	AlertCircle,
	Award,
	BarChart,
	Bell,
	Building,
	Calendar,
	Check,
	ChevronDown,
	CreditCard,
	Edit,
	Eye,
	FileText,
	Filter,
	Info,
	Lock,
	MapPin,
	Pencil,
	Percent,
	Phone,
	Plus,
	Save,
	Search,
	Settings,
	Shield,
	ShoppingCart,
	Star,
	Target,
	Trash,
	User,
	UserCheck,
	UserCog,
	UserPlus,
	Users,
	X,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

// واجهات البيانات المحسنة
interface UserRole {
	id: string;
	name: string;
	description: string;
	isSystem: boolean;
	permissions: Permission[];
	// إعدادات تفصيلية للصلاحيات
	settings: {
		maxDiscount: number; // أقصى نسبة خصم مسموح بها للدور
		maxOrderAmount: number; // أقصى مبلغ للطلب
		canApproveOrders: boolean; // صلاحية الموافقة على الطلبات
		canAccessReports: boolean; // الوصول للتقارير
		canManageInventory: boolean; // إدارة المخزون
		canManageUsers: boolean; // إدارة المستخدمين
	};
	createdAt: string;
	updatedAt: string;
}

interface Permission {
	id: string;
	name: string;
	description: string;
	group: string;
}

interface SystemUser {
	id: number;
	name: string;
	email: string;
	phone: string;
	branch: string;
	role: string;
	isActive: boolean;
	joinDate: string;
	lastLogin?: string;
	// صلاحيات خاصة بالمستخدم (تجاوز صلاحيات الدور)
	customPermissions: {
		maxDiscount: number | null; // null = استخدام إعدادات الدور
		maxOrderAmount: number | null;
		customFields: { [key: string]: any }; // حقول مخصصة إضافية
	};
	// إحصائيات الأداء
	performance: {
		ordersCompleted: number;
		totalSales: number;
		avgOrderValue: number;
		returnRate: number;
		customerRating: number;
		lastEvaluation?: EvaluationResult;
	};
}

interface EvaluationResult {
	id: number;
	date: string;
	evaluator: string;
	score: number; // درجة من 1-5
	review: string;
	strengths: string[];
	improvements: string[];
	goals: {
		description: string;
		dueDate: string;
		isCompleted: boolean;
	}[];
}

interface PermissionLimit {
	id: string;
	name: string;
	description: string;
	defaultValue: number | boolean;
	minValue?: number;
	maxValue?: number;
	valueType: 'number' | 'percentage' | 'boolean';
	group: string;
}

interface UserActivity {
	id: number;
	userId: number;
	activityType: string;
	details: string;
	timestamp: string;
	metadata: { [key: string]: any };
}

interface UserMetric {
	userId: number;
	metric: string;
	value: number;
	period: string;
	timestamp: string;
}

interface RoleTransfer {
	id: number;
	userId: number;
	prevRole: string;
	newRole: string;
	reason: string;
	approvedBy: number;
	timestamp: string;
}

export default function SettingsPage() {
	const [activeTab, setActiveTab] = useState('profile');
	const [activeUserTab, setActiveUserTab] = useState('list'); // list, performance, evaluations
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showDeleteBranchModal, setShowDeleteBranchModal] = useState(false);
	const [showAddUserModal, setShowAddUserModal] = useState(false);
	const [showAddRoleModal, setShowAddRoleModal] = useState(false);
	const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);
	const [showPermissionsModal, setShowPermissionsModal] = useState(false);
	const [showUserPermissionsModal, setShowUserPermissionsModal] = useState(false);
	const [showEvaluationModal, setShowEvaluationModal] = useState(false);
	const [showRoleTransferModal, setShowRoleTransferModal] = useState(false);
	const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
	const [expandedUsers, setExpandedUsers] = useState<{ [key: number]: boolean }>({});

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
	const [newUserBranch, setNewUserBranch] = useState('');
	const [newUserPassword, setNewUserPassword] = useState('');
	const [newUserMaxDiscount, setNewUserMaxDiscount] = useState<string>('');
	const [newUserMaxOrderAmount, setNewUserMaxOrderAmount] = useState<string>('');

	// User Role Management
	const [roles, setRoles] = useState<UserRole[]>([]);
	const [editingRole, setEditingRole] = useState<UserRole | null>(null);
	const [newRoleName, setNewRoleName] = useState('');
	const [newRoleDescription, setNewRoleDescription] = useState('');
	const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
	const [rolePermissions, setRolePermissions] = useState<{ [key: string]: boolean }>({});

	// Role settings
	const [roleMaxDiscount, setRoleMaxDiscount] = useState<number>(0);
	const [roleMaxOrderAmount, setRoleMaxOrderAmount] = useState<number>(0);
	const [rolePermissionLimits, setRolePermissionLimits] = useState<{ [key: string]: number | boolean }>({});

	// Users Management
	const [users, setUsers] = useState<SystemUser[]>([]);
	const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [roleFilter, setRoleFilter] = useState('all');
	const [branchFilter, setBranchFilter] = useState('all');
	const [performanceFilter, setPerformanceFilter] = useState('all');
	const [sortField, setSortField] = useState('name');
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

	// User Performance and Evaluations
	const [newEvaluation, setNewEvaluation] = useState<{
		userId: number | null;
		score: number;
		review: string;
		strengths: string[];
		improvements: string[];
		goals: { description: string; dueDate: string }[];
	}>({
		userId: null,
		score: 3,
		review: '',
		strengths: [''],
		improvements: [''],
		goals: [{ description: '', dueDate: '' }],
	});

	// Role Transfer
	const [roleTransfer, setRoleTransfer] = useState<{
		userId: number | null;
		prevRole: string;
		newRole: string;
		reason: string;
	}>({
		userId: null,
		prevRole: '',
		newRole: '',
		reason: '',
	});

	// Available Permissions
	const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
	const [permissionLimits, setPermissionLimits] = useState<PermissionLimit[]>([]);

	// User Activity
	const [userActivities, setUserActivities] = useState<UserActivity[]>([]);
	const [userMetrics, setUserMetrics] = useState<UserMetric[]>([]);

	// Date ranges for reports
	const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
		start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
		end: new Date().toISOString().split('T')[0],
	});

	const [branchToDelete, setBranchToDelete] = useState<number | null>(null);
	const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

	// تحميل البيانات عند تحميل الصفحة
	useEffect(() => {
		// محاكاة تحميل البيانات
		loadMockData();
	}, []);

	// تحميل البيانات التجريبية
	const loadMockData = () => {
		// حدود الصلاحيات
		const mockPermissionLimits: PermissionLimit[] = [
			{
				id: 'discount_percentage',
				name: 'نسبة الخصم المسموحة',
				description: 'أقصى نسبة خصم يمكن للمستخدم تطبيقها على الطلبات',
				defaultValue: 10,
				minValue: 0,
				maxValue: 50,
				valueType: 'percentage',
				group: 'الطلبات',
			},
			{
				id: 'max_order_amount',
				name: 'الحد الأقصى لقيمة الطلب',
				description: 'أقصى مبلغ يمكن للمستخدم التعامل معه في طلب واحد',
				defaultValue: 10000,
				minValue: 0,
				maxValue: 100000,
				valueType: 'number',
				group: 'الطلبات',
			},
			{
				id: 'can_delete_orders',
				name: 'إمكانية حذف الطلبات',
				description: 'السماح للمستخدم بحذف الطلبات',
				defaultValue: false,
				valueType: 'boolean',
				group: 'الطلبات',
			},
			{
				id: 'can_approve_returns',
				name: 'الموافقة على المرتجعات',
				description: 'السماح للمستخدم بالموافقة على طلبات المرتجعات',
				defaultValue: false,
				valueType: 'boolean',
				group: 'الطلبات',
			},
			{
				id: 'can_modify_prices',
				name: 'تعديل الأسعار',
				description: 'السماح للمستخدم بتعديل أسعار المنتجات',
				defaultValue: false,
				valueType: 'boolean',
				group: 'المنتجات',
			},
			{
				id: 'can_access_financial_reports',
				name: 'الوصول للتقارير المالية',
				description: 'السماح للمستخدم بالوصول للتقارير المالية',
				defaultValue: false,
				valueType: 'boolean',
				group: 'التقارير',
			},
			{
				id: 'can_manage_users',
				name: 'إدارة المستخدمين',
				description: 'السماح للمستخدم بإدارة حسابات المستخدمين',
				defaultValue: false,
				valueType: 'boolean',
				group: 'الإدارة',
			},
		];

		// الصلاحيات
		const mockPermissions: Permission[] = [
			// صلاحيات الطلبات
			{ id: 'orders.view', name: 'عرض الطلبات', description: 'عرض كافة الطلبات', group: 'الطلبات' },
			{ id: 'orders.create', name: 'إضافة طلب', description: 'إنشاء طلب جديد', group: 'الطلبات' },
			{ id: 'orders.edit', name: 'تعديل الطلبات', description: 'تعديل بيانات الطلبات', group: 'الطلبات' },
			{ id: 'orders.delete', name: 'حذف الطلبات', description: 'حذف الطلبات من النظام', group: 'الطلبات' },
			{ id: 'orders.status', name: 'تغيير حالة الطلبات', description: 'تحديث حالة الطلبات', group: 'الطلبات' },
			{ id: 'orders.discount', name: 'تطبيق خصومات', description: 'إضافة خصومات على الطلبات', group: 'الطلبات' },
			{
				id: 'orders.refund',
				name: 'إجراء استرجاع',
				description: 'استرجاع المنتجات أو المبالغ',
				group: 'الطلبات',
			},

			// صلاحيات العملاء
			{ id: 'customers.view', name: 'عرض العملاء', description: 'عرض بيانات العملاء', group: 'العملاء' },
			{ id: 'customers.create', name: 'إضافة عميل', description: 'إضافة عميل جديد', group: 'العملاء' },
			{ id: 'customers.edit', name: 'تعديل العملاء', description: 'تعديل بيانات العملاء', group: 'العملاء' },
			{ id: 'customers.delete', name: 'حذف العملاء', description: 'حذف العملاء من النظام', group: 'العملاء' },
			{
				id: 'customers.special_pricing',
				name: 'أسعار خاصة للعملاء',
				description: 'تحديد أسعار خاصة لعملاء محددين',
				group: 'العملاء',
			},

			// صلاحيات المخزون
			{ id: 'inventory.view', name: 'عرض المخزون', description: 'عرض بيانات المخزون', group: 'المخزون' },
			{ id: 'inventory.add', name: 'إضافة للمخزون', description: 'إضافة عناصر للمخزون', group: 'المخزون' },
			{ id: 'inventory.edit', name: 'تعديل المخزون', description: 'تعديل عناصر المخزون', group: 'المخزون' },
			{
				id: 'inventory.adjust',
				name: 'تسوية المخزون',
				description: 'إجراء تسويات على المخزون',
				group: 'المخزون',
			},

			// صلاحيات التقارير
			{ id: 'reports.view', name: 'عرض التقارير', description: 'الوصول إلى التقارير', group: 'التقارير' },
			{
				id: 'reports.export',
				name: 'تصدير التقارير',
				description: 'تصدير التقارير بتنسيقات مختلفة',
				group: 'التقارير',
			},
			{
				id: 'reports.financial',
				name: 'التقارير المالية',
				description: 'الوصول إلى التقارير المالية',
				group: 'التقارير',
			},
			{
				id: 'reports.performance',
				name: 'تقارير الأداء',
				description: 'الوصول إلى تقارير أداء الموظفين',
				group: 'التقارير',
			},

			// صلاحيات المحاسبة
			{
				id: 'accounting.view',
				name: 'عرض الحسابات',
				description: 'الوصول إلى بيانات المحاسبة',
				group: 'المحاسبة',
			},
			{
				id: 'accounting.transactions',
				name: 'إجراء معاملات',
				description: 'إجراء معاملات مالية',
				group: 'المحاسبة',
			},
			{ id: 'accounting.expenses', name: 'تسجيل مصروفات', description: 'تسجيل المصروفات', group: 'المحاسبة' },
			{ id: 'accounting.revenues', name: 'تسجيل إيرادات', description: 'تسجيل الإيرادات', group: 'المحاسبة' },

			// صلاحيات الإعدادات
			{
				id: 'settings.general',
				name: 'الإعدادات العامة',
				description: 'تعديل الإعدادات العامة',
				group: 'الإعدادات',
			},
			{
				id: 'settings.users',
				name: 'إدارة المستخدمين',
				description: 'إدارة حسابات المستخدمين',
				group: 'الإعدادات',
			},
			{
				id: 'settings.roles',
				name: 'إدارة الصلاحيات',
				description: 'إدارة أدوار وصلاحيات المستخدمين',
				group: 'الإعدادات',
			},
			{ id: 'settings.branches', name: 'إدارة الفروع', description: 'إدارة فروع المتجر', group: 'الإعدادات' },
			{
				id: 'settings.pricing',
				name: 'إعدادات التسعير',
				description: 'ضبط سياسات التسعير والخصومات',
				group: 'الإعدادات',
			},
		];

		// الأدوار
		const mockRoles: UserRole[] = [
			{
				id: 'admin',
				name: 'مدير النظام',
				description: 'صلاحيات كاملة للنظام',
				isSystem: true,
				permissions: mockPermissions,
				settings: {
					maxDiscount: 50,
					maxOrderAmount: 100000,
					canApproveOrders: true,
					canAccessReports: true,
					canManageInventory: true,
					canManageUsers: true,
				},
				createdAt: '2023-01-01T00:00:00Z',
				updatedAt: '2023-01-01T00:00:00Z',
			},
			{
				id: 'manager',
				name: 'مدير فرع',
				description: 'إدارة العمليات اليومية للفرع',
				isSystem: true,
				permissions: mockPermissions.filter((p) => !p.id.includes('settings.roles')),
				settings: {
					maxDiscount: 30,
					maxOrderAmount: 50000,
					canApproveOrders: true,
					canAccessReports: true,
					canManageInventory: true,
					canManageUsers: false,
				},
				createdAt: '2023-01-01T00:00:00Z',
				updatedAt: '2023-01-01T00:00:00Z',
			},
			{
				id: 'tailor',
				name: 'خياط',
				description: 'إدارة عمليات الخياطة والقياسات',
				isSystem: true,
				permissions: mockPermissions.filter(
					(p) =>
						p.id.includes('orders.view') ||
						p.id.includes('orders.status') ||
						p.id.includes('customers.view')
				),
				settings: {
					maxDiscount: 0,
					maxOrderAmount: 0,
					canApproveOrders: false,
					canAccessReports: false,
					canManageInventory: false,
					canManageUsers: false,
				},
				createdAt: '2023-01-01T00:00:00Z',
				updatedAt: '2023-01-01T00:00:00Z',
			},
			{
				id: 'cashier',
				name: 'كاشير',
				description: 'إدارة عمليات الدفع والمبيعات',
				isSystem: false,
				permissions: mockPermissions.filter(
					(p) =>
						p.id.includes('orders.view') ||
						p.id.includes('orders.create') ||
						p.id.includes('customers.view') ||
						p.id.includes('customers.create')
				),
				settings: {
					maxDiscount: 15,
					maxOrderAmount: 20000,
					canApproveOrders: false,
					canAccessReports: false,
					canManageInventory: false,
					canManageUsers: false,
				},
				createdAt: '2023-02-15T00:00:00Z',
				updatedAt: '2023-02-15T00:00:00Z',
			},
			{
				id: 'delivery',
				name: 'مسؤول توصيل',
				description: 'إدارة عمليات التوصيل',
				isSystem: false,
				permissions: mockPermissions.filter(
					(p) => p.id.includes('orders.view') || p.id.includes('orders.status')
				),
				settings: {
					maxDiscount: 0,
					maxOrderAmount: 0,
					canApproveOrders: false,
					canAccessReports: false,
					canManageInventory: false,
					canManageUsers: false,
				},
				createdAt: '2023-02-15T00:00:00Z',
				updatedAt: '2023-02-15T00:00:00Z',
			},
			{
				id: 'sales',
				name: 'مندوب مبيعات',
				description: 'مسؤول عن المبيعات والعروض',
				isSystem: false,
				permissions: mockPermissions.filter((p) => p.id.includes('orders') || p.id.includes('customers')),
				settings: {
					maxDiscount: 20,
					maxOrderAmount: 30000,
					canApproveOrders: false,
					canAccessReports: true,
					canManageInventory: false,
					canManageUsers: false,
				},
				createdAt: '2023-03-10T00:00:00Z',
				updatedAt: '2023-03-10T00:00:00Z',
			},
		];

		// المستخدمين
		const mockUsers: SystemUser[] = [
			{
				id: 1,
				name: 'محمد المدير',
				email: 'admin@example.com',
				phone: '966512345678',
				branch: 'الفرع الرئيسي',
				role: 'admin',
				isActive: true,
				joinDate: '2023-01-15',
				lastLogin: '2023-06-15 08:30:00',
				customPermissions: {
					maxDiscount: null,
					maxOrderAmount: null,
					customFields: {},
				},
				performance: {
					ordersCompleted: 247,
					totalSales: 356000,
					avgOrderValue: 1440.89,
					returnRate: 1.2,
					customerRating: 4.9,
					lastEvaluation: {
						id: 1,
						date: '2023-05-01',
						evaluator: 'عبدالله المالك',
						score: 4.8,
						review: 'أداء ممتاز ومهارات قيادية متميزة',
						strengths: ['إدارة الفريق بكفاءة', 'تحقيق أهداف المبيعات', 'التواصل الفعال مع العملاء'],
						improvements: ['زيادة تدريب الموظفين الجدد'],
						goals: [{ description: 'زيادة المبيعات بنسبة 15%', dueDate: '2023-12-31', isCompleted: false }],
					},
				},
			},
			{
				id: 2,
				name: 'أحمد محمود',
				email: 'ahmad@example.com',
				phone: '966512345679',
				branch: 'الفرع الرئيسي',
				role: 'tailor',
				isActive: true,
				joinDate: '2023-02-10',
				lastLogin: '2023-06-14 14:45:00',
				customPermissions: {
					maxDiscount: null,
					maxOrderAmount: null,
					customFields: {},
				},
				performance: {
					ordersCompleted: 183,
					totalSales: 0,
					avgOrderValue: 0,
					returnRate: 0.5,
					customerRating: 4.7,
					lastEvaluation: {
						id: 2,
						date: '2023-05-05',
						evaluator: 'محمد المدير',
						score: 4.5,
						review: 'مهارات خياطة متميزة ودقة عالية',
						strengths: ['دقة العمل', 'الالتزام بالمواعيد', 'جودة النهائية للمنتج'],
						improvements: ['تحسين سرعة الإنجاز'],
						goals: [
							{ description: 'إتقان تقنيات خياطة جديدة', dueDate: '2023-09-30', isCompleted: true },
							{ description: 'تقليل وقت إنجاز الطلب', dueDate: '2023-10-31', isCompleted: false },
						],
					},
				},
			},
			{
				id: 3,
				name: 'خالد العبدالله',
				email: 'khaled@example.com',
				phone: '966512345680',
				branch: 'فرع الشرقية',
				role: 'manager',
				isActive: true,
				joinDate: '2023-01-20',
				lastLogin: '2023-06-14 09:15:00',
				customPermissions: {
					maxDiscount: 35, // تجاوز إعدادات الدور
					maxOrderAmount: null,
					customFields: {
						canApprovePriorityOrders: true,
					},
				},
				performance: {
					ordersCompleted: 105,
					totalSales: 280000,
					avgOrderValue: 2666.67,
					returnRate: 0.8,
					customerRating: 4.8,
				},
			},
			{
				id: 4,
				name: 'محمد سالم',
				email: 'mohamed@example.com',
				phone: '966512345681',
				branch: 'فرع الشرقية',
				role: 'cashier',
				isActive: false,
				joinDate: '2023-03-05',
				lastLogin: '2023-05-30 16:20:00',
				customPermissions: {
					maxDiscount: 10, // تقييد نسبة الخصم
					maxOrderAmount: 15000,
					customFields: {},
				},
				performance: {
					ordersCompleted: 78,
					totalSales: 124000,
					avgOrderValue: 1589.74,
					returnRate: 2.1,
					customerRating: 4.2,
				},
			},
			{
				id: 5,
				name: 'فيصل الشمري',
				email: 'faisal@example.com',
				phone: '966512345682',
				branch: 'الفرع الرئيسي',
				role: 'delivery',
				isActive: true,
				joinDate: '2023-02-25',
				lastLogin: '2023-06-15 10:10:00',
				customPermissions: {
					maxDiscount: null,
					maxOrderAmount: null,
					customFields: {
						deliveryZones: ['الرياض الشمالي', 'الرياض الغربي'],
					},
				},
				performance: {
					ordersCompleted: 156,
					totalSales: 0,
					avgOrderValue: 0,
					returnRate: 0.3,
					customerRating: 4.9,
				},
			},
			{
				id: 6,
				name: 'سارة العتيبي',
				email: 'sarah@example.com',
				phone: '966512345683',
				branch: 'الفرع الرئيسي',
				role: 'sales',
				isActive: true,
				joinDate: '2023-04-01',
				lastLogin: '2023-06-15 11:25:00',
				customPermissions: {
					maxDiscount: 25, // نسبة خصم أعلى من الافتراضي
					maxOrderAmount: null,
					customFields: {
						specialClients: ['VIP', 'Corporate'],
					},
				},
				performance: {
					ordersCompleted: 87,
					totalSales: 195000,
					avgOrderValue: 2241.38,
					returnRate: 0.9,
					customerRating: 4.8,
				},
			},
		];

		// أنشطة المستخدمين
		const mockUserActivities: UserActivity[] = [
			{
				id: 1,
				userId: 1,
				activityType: 'login',
				details: 'تسجيل دخول ناجح',
				timestamp: '2023-06-15 08:30:00',
				metadata: { ip: '192.168.1.1', device: 'Desktop', browser: 'Chrome' },
			},
			{
				id: 2,
				userId: 1,
				activityType: 'order_create',
				details: 'إنشاء طلب جديد #10045',
				timestamp: '2023-06-15 09:15:00',
				metadata: { orderId: 10045, amount: 1850, items: 3, customerId: 120 },
			},
			{
				id: 3,
				userId: 3,
				activityType: 'discount_apply',
				details: 'تطبيق خصم 25% على طلب #10046',
				timestamp: '2023-06-14 14:30:00',
				metadata: { orderId: 10046, discountAmount: 750, originalAmount: 3000, finalAmount: 2250 },
			},
			{
				id: 4,
				userId: 6,
				activityType: 'customer_create',
				details: 'إضافة عميل جديد: علي الزهراني',
				timestamp: '2023-06-15 10:45:00',
				metadata: { customerId: 342, customerType: 'retail' },
			},
			{
				id: 5,
				userId: 2,
				activityType: 'order_status',
				details: 'تغيير حالة الطلب #10042 من "قيد التنفيذ" إلى "جاهز للتسليم"',
				timestamp: '2023-06-15 11:20:00',
				metadata: { orderId: 10042, prevStatus: 'in_progress', newStatus: 'ready_for_delivery' },
			},
		];

		// مقاييس أداء المستخدمين
		const mockUserMetrics: UserMetric[] = [
			// محمد المدير - مبيعات
			{
				userId: 1,
				metric: 'sales_amount',
				value: 85000,
				period: '2023-05',
				timestamp: '2023-06-01',
			},
			{
				userId: 1,
				metric: 'sales_amount',
				value: 91000,
				period: '2023-06',
				timestamp: '2023-07-01',
			},
			// أحمد محمود - طلبات
			{
				userId: 2,
				metric: 'completed_orders',
				value: 42,
				period: '2023-05',
				timestamp: '2023-06-01',
			},
			{
				userId: 2,
				metric: 'completed_orders',
				value: 47,
				period: '2023-06',
				timestamp: '2023-07-01',
			},
			// سارة العتيبي - تقييم العملاء
			{
				userId: 6,
				metric: 'customer_rating',
				value: 4.7,
				period: '2023-05',
				timestamp: '2023-06-01',
			},
			{
				userId: 6,
				metric: 'customer_rating',
				value: 4.9,
				period: '2023-06',
				timestamp: '2023-07-01',
			},
		];

		// تعيين البيانات
		setPermissionLimits(mockPermissionLimits);
		setAvailablePermissions(mockPermissions);
		setRoles(mockRoles);
		setUsers(mockUsers);
		setUserActivities(mockUserActivities);
		setUserMetrics(mockUserMetrics);

		// تعيين الدور الأول كمحدد افتراضياً
		if (mockRoles.length > 0) {
			setSelectedRoleId(mockRoles[0].id);
			const initialPermissions: { [key: string]: boolean } = {};
			mockRoles[0].permissions.forEach((permission) => {
				initialPermissions[permission.id] = true;
			});
			setRolePermissions(initialPermissions);

			// تعيين إعدادات الدور
			setRoleMaxDiscount(mockRoles[0].settings.maxDiscount);
			setRoleMaxOrderAmount(mockRoles[0].settings.maxOrderAmount);

			const initialLimits: { [key: string]: number | boolean } = {};
			mockPermissionLimits.forEach((limit) => {
				if (limit.valueType === 'percentage' && limit.id === 'discount_percentage') {
					initialLimits[limit.id] = mockRoles[0].settings.maxDiscount;
				} else if (limit.valueType === 'number' && limit.id === 'max_order_amount') {
					initialLimits[limit.id] = mockRoles[0].settings.maxOrderAmount;
				} else if (limit.valueType === 'boolean') {
					if (limit.id === 'can_delete_orders')
						initialLimits[limit.id] = mockRoles[0].permissions.some((p) => p.id === 'orders.delete');
					if (limit.id === 'can_approve_returns')
						initialLimits[limit.id] = mockRoles[0].permissions.some((p) => p.id === 'orders.refund');
					if (limit.id === 'can_modify_prices')
						initialLimits[limit.id] = mockRoles[0].permissions.some((p) => p.id === 'inventory.edit');
					if (limit.id === 'can_access_financial_reports')
						initialLimits[limit.id] = mockRoles[0].permissions.some((p) => p.id === 'reports.financial');
					if (limit.id === 'can_manage_users')
						initialLimits[limit.id] = mockRoles[0].permissions.some((p) => p.id === 'settings.users');
				}
			});

			setRolePermissionLimits(initialLimits);
		}
	};

	// الإشعارات
	const showNotification = (message: string, type: 'success' | 'error') => {
		setNotification({ message, type });
		setTimeout(() => setNotification(null), 3000);
	};

	// حفظ الملف الشخصي
	const handleSaveProfile = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			// محاكاة طلب API
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log('Profile updated:', { userName, userEmail, userPhone });
			showNotification('تم تحديث الملف الشخصي بنجاح', 'success');
		} catch (error) {
			console.error('Error updating profile:', error);
			showNotification('حدث خطأ أثناء تحديث الملف الشخصي', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// حفظ إعدادات الإشعارات
	const handleSaveNotifications = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			console.log('Notification settings updated:', {
				emailNotifications,
				smsNotifications,
				orderCreatedNotif,
				orderCompletedNotif,
				repairRequestNotif,
			});
			showNotification('تم تحديث إعدادات الإشعارات بنجاح', 'success');
		} catch (error) {
			console.error('Error updating notification settings:', error);
			showNotification('حدث خطأ أثناء تحديث إعدادات الإشعارات', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// تغيير كلمة المرور
	const handleChangePassword = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		// التحقق من كلمات المرور
		if (newPassword !== confirmPassword) {
			showNotification('كلمات المرور غير متطابقة', 'error');
			setIsSubmitting(false);
			return;
		}

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// إعادة تعيين النموذج
			setCurrentPassword('');
			setNewPassword('');
			setConfirmPassword('');

			showNotification('تم تغيير كلمة المرور بنجاح', 'success');
		} catch (error) {
			console.error('Error changing password:', error);
			showNotification('حدث خطأ أثناء تغيير كلمة المرور', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// إضافة فرع جديد
	const handleAddBranch = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// إضافة الفرع الجديد للحالة
			const newBranch = {
				id: branches.length + 1,
				name: newBranchName,
				address: newBranchAddress,
				phone: newBranchPhone,
				manager: newBranchManager,
			};

			setBranches([...branches, newBranch]);

			// إعادة تعيين النموذج
			setNewBranchName('');
			setNewBranchAddress('');
			setNewBranchPhone('966');
			setNewBranchManager('');

			// إخفاء النموذج
			document.getElementById('add-branch-form')?.classList.add('hidden');

			showNotification('تم إضافة الفرع بنجاح', 'success');
		} catch (error) {
			console.error('Error adding branch:', error);
			showNotification('حدث خطأ أثناء إضافة الفرع', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// حذف فرع
	const handleDeleteBranch = async () => {
		if (branchToDelete === null) return;

		setIsSubmitting(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// حذف الفرع من الحالة
			setBranches(branches.filter((branch) => branch.id !== branchToDelete));

			setShowDeleteBranchModal(false);
			setBranchToDelete(null);

			showNotification('تم حذف الفرع بنجاح', 'success');
		} catch (error) {
			console.error('Error deleting branch:', error);
			showNotification('حدث خطأ أثناء حذف الفرع', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// إضافة أو تعديل مستخدم
	const handleAddUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// تحضير الصلاحيات المخصصة
			const customPermissions = {
				maxDiscount: newUserMaxDiscount.trim() ? Number(newUserMaxDiscount) : null,
				maxOrderAmount: newUserMaxOrderAmount.trim() ? Number(newUserMaxOrderAmount) : null,
				customFields: {},
			};

			// تعديل أو إضافة مستخدم
			if (editingUser) {
				// تحديث مستخدم موجود
				setUsers(
					users.map((u) =>
						u.id === editingUser.id
							? {
									...u,
									name: newUserName,
									email: newUserEmail,
									phone: newUserPhone,
									branch: newUserBranch,
									role: newUserRole,
									customPermissions,
							  }
							: u
					)
				);

				// تسجيل نشاط تعديل المستخدم
				addUserActivity(1, 'user_update', `تعديل بيانات المستخدم: ${newUserName}`, {
					userId: editingUser.id,
					prevRole: editingUser.role,
					newRole: newUserRole,
				});

				showNotification(`تم تحديث بيانات المستخدم ${newUserName} بنجاح`, 'success');
			} else {
				// إضافة مستخدم جديد
				const newUser: SystemUser = {
					id: users.length + 1,
					name: newUserName,
					email: newUserEmail,
					phone: newUserPhone,
					branch: newUserBranch || 'الفرع الرئيسي',
					role: newUserRole,
					isActive: true,
					joinDate: new Date().toISOString().split('T')[0],
					lastLogin: '',
					customPermissions,
					performance: {
						ordersCompleted: 0,
						totalSales: 0,
						avgOrderValue: 0,
						returnRate: 0,
						customerRating: 0,
					},
				};

				setUsers([...users, newUser]);

				// تسجيل نشاط إضافة المستخدم
				addUserActivity(1, 'user_create', `إضافة مستخدم جديد: ${newUserName}`, {
					newUserId: users.length + 1,
					role: newUserRole,
					branch: newUserBranch,
				});

				showNotification(`تم إضافة المستخدم ${newUserName} بنجاح`, 'success');
			}

			// إعادة تعيين النموذج
			setNewUserName('');
			setNewUserEmail('');
			setNewUserPhone('966');
			setNewUserRole('');
			setNewUserBranch('');
			setNewUserPassword('');
			setNewUserMaxDiscount('');
			setNewUserMaxOrderAmount('');
			setEditingUser(null);

			setShowAddUserModal(false);
		} catch (error) {
			console.error('Error adding/updating user:', error);
			showNotification('حدث خطأ أثناء حفظ بيانات المستخدم', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// فتح نافذة تعديل المستخدم
	const handleEditUser = (user: SystemUser) => {
		setEditingUser(user);
		setNewUserName(user.name);
		setNewUserEmail(user.email);
		setNewUserPhone(user.phone);
		setNewUserBranch(user.branch);
		setNewUserRole(user.role);
		setNewUserPassword(''); // عدم تعبئة كلمة المرور للأمان
		setNewUserMaxDiscount(
			user.customPermissions.maxDiscount !== null ? user.customPermissions.maxDiscount.toString() : ''
		);
		setNewUserMaxOrderAmount(
			user.customPermissions.maxOrderAmount !== null ? user.customPermissions.maxOrderAmount.toString() : ''
		);
		setShowAddUserModal(true);
	};

	// تغيير حالة المستخدم (تفعيل/تعطيل)
	const toggleUserStatus = (userId: number) => {
		const userToToggle = users.find((u) => u.id === userId);
		if (!userToToggle) return;

		const newStatus = !userToToggle.isActive;

		setUsers(users.map((user) => (user.id === userId ? { ...user, isActive: newStatus } : user)));

		// تسجيل نشاط تغيير حالة المستخدم
		addUserActivity(
			1,
			'user_status_change',
			`تغيير حالة المستخدم ${userToToggle.name} إلى ${newStatus ? 'نشط' : 'معطل'}`,
			{
				userId,
				newStatus,
			}
		);

		showNotification(`تم ${newStatus ? 'تفعيل' : 'تعطيل'} حساب ${userToToggle.name} بنجاح`, 'success');
	};

	// عرض تفاصيل المستخدم
	const toggleUserDetails = (userId: number) => {
		setExpandedUsers((prev) => ({
			...prev,
			[userId]: !prev[userId],
		}));
	};

	// إضافة نشاط للمستخدم
	const addUserActivity = (
		adminId: number,
		activityType: string,
		details: string,
		metadata: { [key: string]: any }
	) => {
		const newActivity: UserActivity = {
			id: userActivities.length + 1,
			userId: adminId,
			activityType,
			details,
			timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
			metadata,
		};

		setUserActivities([newActivity, ...userActivities]);
	};

	// تقييم مستخدم
	const handleEvaluateUser = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (!newEvaluation.userId) {
				throw new Error('لم يتم تحديد المستخدم');
			}

			// إضافة التقييم للمستخدم
			setUsers(
				users.map((user) => {
					if (user.id === newEvaluation.userId) {
						const evaluation: EvaluationResult = {
							id: user.performance.lastEvaluation ? user.performance.lastEvaluation.id + 1 : 1,
							date: new Date().toISOString().split('T')[0],
							evaluator: 'محمد المدير', // استخدم اسم المستخدم الحالي في التطبيق الفعلي
							score: newEvaluation.score,
							review: newEvaluation.review,
							strengths: newEvaluation.strengths.filter((s) => s.trim()),
							improvements: newEvaluation.improvements.filter((i) => i.trim()),
							goals: newEvaluation.goals
								.filter((g) => g.description.trim() && g.dueDate)
								.map((g) => ({ ...g, isCompleted: false })),
						};

						return {
							...user,
							performance: {
								...user.performance,
								lastEvaluation: evaluation,
							},
						};
					}
					return user;
				})
			);

			// تسجيل نشاط التقييم
			const evaluatedUser = users.find((u) => u.id === newEvaluation.userId);
			addUserActivity(1, 'user_evaluation', `تقييم المستخدم: ${evaluatedUser?.name}`, {
				userId: newEvaluation.userId,
				score: newEvaluation.score,
				goalsCount: newEvaluation.goals.filter((g) => g.description.trim()).length,
			});

			// إعادة تعيين النموذج
			setNewEvaluation({
				userId: null,
				score: 3,
				review: '',
				strengths: [''],
				improvements: [''],
				goals: [{ description: '', dueDate: '' }],
			});

			setShowEvaluationModal(false);
			showNotification('تم حفظ تقييم المستخدم بنجاح', 'success');
		} catch (error) {
			console.error('Error adding evaluation:', error);
			showNotification('حدث خطأ أثناء حفظ التقييم', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// فتح نافذة تقييم مستخدم
	const openEvaluationModal = (userId: number) => {
		setNewEvaluation({
			userId,
			score: 3,
			review: '',
			strengths: [''],
			improvements: [''],
			goals: [{ description: '', dueDate: '' }],
		});
		setShowEvaluationModal(true);
	};

	// إضافة حقل قوة جديد في التقييم
	const addStrength = () => {
		setNewEvaluation({
			...newEvaluation,
			strengths: [...newEvaluation.strengths, ''],
		});
	};

	// إضافة حقل تحسين جديد في التقييم
	const addImprovement = () => {
		setNewEvaluation({
			...newEvaluation,
			improvements: [...newEvaluation.improvements, ''],
		});
	};

	// إضافة هدف جديد في التقييم
	const addGoal = () => {
		setNewEvaluation({
			...newEvaluation,
			goals: [...newEvaluation.goals, { description: '', dueDate: '' }],
		});
	};

	// تحديث نقاط القوة في التقييم
	const updateStrength = (index: number, value: string) => {
		const updatedStrengths = [...newEvaluation.strengths];
		updatedStrengths[index] = value;
		setNewEvaluation({
			...newEvaluation,
			strengths: updatedStrengths,
		});
	};

	// تحديث نقاط التحسين في التقييم
	const updateImprovement = (index: number, value: string) => {
		const updatedImprovements = [...newEvaluation.improvements];
		updatedImprovements[index] = value;
		setNewEvaluation({
			...newEvaluation,
			improvements: updatedImprovements,
		});
	};

	// تحديث الأهداف في التقييم
	const updateGoal = (index: number, field: 'description' | 'dueDate', value: string) => {
		const updatedGoals = [...newEvaluation.goals];
		updatedGoals[index][field] = value;
		setNewEvaluation({
			...newEvaluation,
			goals: updatedGoals,
		});
	};

	// نقل مستخدم إلى دور آخر
	const handleRoleTransfer = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await new Promise((resolve) => setTimeout(resolve, 1000));

			if (!roleTransfer.userId) {
				throw new Error('لم يتم تحديد المستخدم');
			}

			if (!roleTransfer.newRole) {
				throw new Error('لم يتم تحديد الدور الجديد');
			}

			// تحديث دور المستخدم
			setUsers(
				users.map((user) => {
					if (user.id === roleTransfer.userId) {
						return {
							...user,
							role: roleTransfer.newRole,
							// إعادة تعيين الصلاحيات المخصصة للمستخدم عند تغيير الدور
							customPermissions: {
								maxDiscount: null,
								maxOrderAmount: null,
								customFields: {},
							},
						};
					}
					return user;
				})
			);

			// تسجيل نشاط نقل الدور
			const transferredUser = users.find((u) => u.id === roleTransfer.userId);
			addUserActivity(
				1,
				'role_transfer',
				`تغيير دور المستخدم ${transferredUser?.name} من ${getRoleName(
					transferredUser?.role || ''
				)} إلى ${getRoleName(roleTransfer.newRole)}`,
				{
					userId: roleTransfer.userId,
					prevRole: transferredUser?.role,
					newRole: roleTransfer.newRole,
					reason: roleTransfer.reason,
				}
			);

			// إعادة تعيين النموذج
			setRoleTransfer({
				userId: null,
				prevRole: '',
				newRole: '',
				reason: '',
			});

			setShowRoleTransferModal(false);
			showNotification('تم تغيير دور المستخدم بنجاح', 'success');
		} catch (error) {
			console.error('Error transferring role:', error);
			showNotification('حدث خطأ أثناء تغيير دور المستخدم', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// فتح نافذة نقل الدور
	const openRoleTransferModal = (userId: number) => {
		const user = users.find((u) => u.id === userId);
		if (!user) return;

		setRoleTransfer({
			userId,
			prevRole: user.role,
			newRole: '',
			reason: '',
		});

		setShowRoleTransferModal(true);
	};

	// إضافة دور جديد
	const handleAddRole = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (!newRoleName.trim()) {
				showNotification('يرجى إدخال اسم الدور', 'error');
				setIsSubmitting(false);
				return;
			}

			// التحقق من عدم تكرار الاسم
			if (roles.some((r) => r.name === newRoleName && r.id !== (editingRole?.id || ''))) {
				showNotification('يوجد دور بهذا الاسم بالفعل', 'error');
				setIsSubmitting(false);
				return;
			}

			if (editingRole) {
				// تحديث دور موجود
				setRoles(
					roles.map((role) =>
						role.id === editingRole.id
							? {
									...role,
									name: newRoleName,
									description: newRoleDescription,
									updatedAt: new Date().toISOString(),
							  }
							: role
					)
				);

				// تسجيل نشاط تعديل الدور
				addUserActivity(1, 'role_update', `تعديل الدور: ${newRoleName}`, {
					roleId: editingRole.id,
					prevName: editingRole.name,
					newName: newRoleName,
				});

				showNotification(`تم تحديث الدور ${newRoleName} بنجاح`, 'success');
			} else {
				// إضافة دور جديد
				const roleId = `role_${Date.now()}`;
				const newRole: UserRole = {
					id: roleId,
					name: newRoleName,
					description: newRoleDescription,
					isSystem: false,
					permissions: [],
					settings: {
						maxDiscount: 0,
						maxOrderAmount: 0,
						canApproveOrders: false,
						canAccessReports: false,
						canManageInventory: false,
						canManageUsers: false,
					},
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				};

				setRoles([...roles, newRole]);
				setSelectedRoleId(roleId);

				// تسجيل نشاط إضافة الدور
				addUserActivity(1, 'role_create', `إنشاء دور جديد: ${newRoleName}`, {
					roleId,
					description: newRoleDescription,
				});

				showNotification(`تم إضافة الدور ${newRoleName} بنجاح`, 'success');
			}

			// إعادة تعيين النموذج
			setNewRoleName('');
			setNewRoleDescription('');
			setEditingRole(null);
			setShowAddRoleModal(false);
		} catch (error) {
			console.error('Error adding/editing role:', error);
			showNotification('حدث خطأ أثناء حفظ الدور', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// حذف دور
	const deleteRole = () => {
		if (!roleToDelete) return;

		const roleToRemove = roles.find((role) => role.id === roleToDelete);

		if (!roleToRemove) {
			showNotification('الدور غير موجود', 'error');
			setShowDeleteRoleModal(false);
			setRoleToDelete(null);
			return;
		}

		if (roleToRemove.isSystem) {
			showNotification('لا يمكن حذف الأدوار الأساسية في النظام', 'error');
			setShowDeleteRoleModal(false);
			setRoleToDelete(null);
			return;
		}

		// التحقق من وجود مستخدمين مرتبطين بهذا الدور
		const usersWithRole = users.filter((user) => user.role === roleToDelete);
		if (usersWithRole.length > 0) {
			showNotification('لا يمكن حذف الدور لأنه مستخدم من قبل بعض المستخدمين', 'error');
			setShowDeleteRoleModal(false);
			setRoleToDelete(null);
			return;
		}

		// حذف الدور
		setRoles(roles.filter((role) => role.id !== roleToDelete));

		// تسجيل نشاط حذف الدور
		addUserActivity(1, 'role_delete', `حذف الدور: ${roleToRemove.name}`, {
			roleId: roleToDelete,
			roleName: roleToRemove.name,
		});

		// إعادة تحديد الدور المحدد إذا كان هو المحذوف
		if (selectedRoleId === roleToDelete) {
			const firstAvailableRole = roles.find((r) => r.id !== roleToDelete);
			if (firstAvailableRole) {
				setSelectedRoleId(firstAvailableRole.id);
			} else {
				setSelectedRoleId(null);
			}
		}

		showNotification('تم حذف الدور بنجاح', 'success');
		setShowDeleteRoleModal(false);
		setRoleToDelete(null);
	};

	// تحديث صلاحيات وإعدادات الدور
	const handleUpdatePermissions = () => {
		if (!selectedRoleId) return;

		setIsSubmitting(true);

		try {
			// جمع الصلاحيات المحددة
			const selectedPermissionsList = Object.entries(rolePermissions)
				.filter(([, isChecked]) => isChecked)
				.map(([permId]) => availablePermissions.find((p) => p.id === permId))
				.filter((p): p is Permission => p !== undefined);

			// تحديث الدور
			setRoles(
				roles.map((role) => {
					if (role.id === selectedRoleId) {
						return {
							...role,
							permissions: selectedPermissionsList,
							settings: {
								...role.settings,
								maxDiscount: roleMaxDiscount,
								maxOrderAmount: roleMaxOrderAmount,
								canApproveOrders: rolePermissionLimits['can_approve_returns'] as boolean,
								canAccessReports: rolePermissionLimits['can_access_financial_reports'] as boolean,
								canManageInventory: rolePermissionLimits['can_modify_prices'] as boolean,
								canManageUsers: rolePermissionLimits['can_manage_users'] as boolean,
							},
							updatedAt: new Date().toISOString(),
						};
					}
					return role;
				})
			);

			// تسجيل نشاط تحديث الصلاحيات
			const updatedRole = roles.find((r) => r.id === selectedRoleId);
			addUserActivity(1, 'role_permissions_update', `تحديث صلاحيات الدور: ${updatedRole?.name}`, {
				roleId: selectedRoleId,
				permissionsCount: selectedPermissionsList.length,
				maxDiscount: roleMaxDiscount,
				maxOrderAmount: roleMaxOrderAmount,
			});

			showNotification('تم تحديث الصلاحيات بنجاح', 'success');
			setShowPermissionsModal(false);
		} catch (error) {
			console.error('Error updating permissions:', error);
			showNotification('حدث خطأ أثناء تحديث الصلاحيات', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// تحديث صلاحيات المستخدم المخصصة
	const handleUpdateUserPermissions = () => {
		if (!selectedUserId) return;

		setIsSubmitting(true);

		try {
			// تحديث المستخدم
			setUsers(
				users.map((user) => {
					if (user.id === selectedUserId) {
						return {
							...user,
							customPermissions: {
								maxDiscount: newUserMaxDiscount.trim() ? Number(newUserMaxDiscount) : null,
								maxOrderAmount: newUserMaxOrderAmount.trim() ? Number(newUserMaxOrderAmount) : null,
								customFields: user.customPermissions.customFields,
							},
						};
					}
					return user;
				})
			);

			// تسجيل نشاط تحديث صلاحيات المستخدم
			const updatedUser = users.find((u) => u.id === selectedUserId);
			addUserActivity(1, 'user_permissions_update', `تحديث صلاحيات المستخدم: ${updatedUser?.name}`, {
				userId: selectedUserId,
				maxDiscount: newUserMaxDiscount.trim() ? Number(newUserMaxDiscount) : null,
				maxOrderAmount: newUserMaxOrderAmount.trim() ? Number(newUserMaxOrderAmount) : null,
			});

			showNotification('تم تحديث صلاحيات المستخدم بنجاح', 'success');
			setShowUserPermissionsModal(false);
		} catch (error) {
			console.error('Error updating user permissions:', error);
			showNotification('حدث خطأ أثناء تحديث صلاحيات المستخدم', 'error');
		} finally {
			setIsSubmitting(false);
		}
	};

	// عند تغيير الدور المحدد
	const handleRoleChange = (roleId: string) => {
		setSelectedRoleId(roleId);

		// تحميل صلاحيات وإعدادات الدور المحدد
		const selectedRole = roles.find((r) => r.id === roleId);
		if (selectedRole) {
			// تحميل الصلاحيات
			const currentPermissions: { [key: string]: boolean } = {};
			// تعيين كل الصلاحيات إلى false أولاً
			availablePermissions.forEach((p) => {
				currentPermissions[p.id] = false;
			});
			// ثم تعيين الصلاحيات التي يملكها الدور إلى true
			selectedRole.permissions.forEach((p) => {
				currentPermissions[p.id] = true;
			});
			setRolePermissions(currentPermissions);

			// تحميل إعدادات الدور
			setRoleMaxDiscount(selectedRole.settings.maxDiscount);
			setRoleMaxOrderAmount(selectedRole.settings.maxOrderAmount);

			// تحميل حدود الصلاحيات
			const currentLimits: { [key: string]: number | boolean } = {};
			permissionLimits.forEach((limit) => {
				if (limit.valueType === 'percentage' && limit.id === 'discount_percentage') {
					currentLimits[limit.id] = selectedRole.settings.maxDiscount;
				} else if (limit.valueType === 'number' && limit.id === 'max_order_amount') {
					currentLimits[limit.id] = selectedRole.settings.maxOrderAmount;
				} else if (limit.valueType === 'boolean') {
					if (limit.id === 'can_delete_orders')
						currentLimits[limit.id] = selectedRole.permissions.some((p) => p.id === 'orders.delete');
					if (limit.id === 'can_approve_returns')
						currentLimits[limit.id] = selectedRole.permissions.some((p) => p.id === 'orders.refund');
					if (limit.id === 'can_modify_prices')
						currentLimits[limit.id] = selectedRole.permissions.some((p) => p.id === 'inventory.edit');
					if (limit.id === 'can_access_financial_reports')
						currentLimits[limit.id] = selectedRole.permissions.some((p) => p.id === 'reports.financial');
					if (limit.id === 'can_manage_users')
						currentLimits[limit.id] = selectedRole.permissions.some((p) => p.id === 'settings.users');
				}
			});
			setRolePermissionLimits(currentLimits);
		}
	};

	// فتح نافذة تعديل صلاحيات المستخدم
	const openUserPermissionsModal = (userId: number) => {
		const user = users.find((u) => u.id === userId);
		if (!user) return;

		setSelectedUserId(userId);
		setNewUserMaxDiscount(
			user.customPermissions.maxDiscount !== null ? user.customPermissions.maxDiscount.toString() : ''
		);
		setNewUserMaxOrderAmount(
			user.customPermissions.maxOrderAmount !== null ? user.customPermissions.maxOrderAmount.toString() : ''
		);

		setShowUserPermissionsModal(true);
	};

	// إعداد نافذة تعديل الدور
	const setupEditRole = (role: UserRole) => {
		if (role.isSystem) {
			showNotification('لا يمكن تعديل الأدوار الأساسية في النظام', 'error');
			return;
		}

		setEditingRole(role);
		setNewRoleName(role.name);
		setNewRoleDescription(role.description);
		setShowAddRoleModal(true);
	};

	// فتح نافذة تعديل صلاحيات الدور
	const openPermissionsModal = () => {
		if (!selectedRoleId) {
			showNotification('يرجى اختيار دور أولاً', 'error');
			return;
		}

		const selectedRole = roles.find((r) => r.id === selectedRoleId);
		if (selectedRole?.isSystem) {
			showNotification('لا يمكن تعديل صلاحيات الأدوار الأساسية', 'error');
			return;
		}

		setShowPermissionsModal(true);
	};

	// الحصول على اسم الدور
	const getRoleName = (roleId: string) => {
		return roles.find((r) => r.id === roleId)?.name || roleId;
	};

	// تجميع الصلاحيات حسب المجموعة
	const permissionsByGroup = useMemo(() => {
		return availablePermissions.reduce<{ [key: string]: Permission[] }>((groups, permission) => {
			if (!groups[permission.group]) {
				groups[permission.group] = [];
			}
			groups[permission.group].push(permission);
			return groups;
		}, {});
	}, [availablePermissions]);

	// تصفية المستخدمين حسب البحث والفلاتر
	const filteredUsers = useMemo(() => {
		return users
			.filter((user) => {
				// البحث بالاسم أو البريد الإلكتروني
				const matchesSearch =
					searchTerm === '' ||
					user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
					user.email.toLowerCase().includes(searchTerm.toLowerCase());

				// تصفية حسب الدور
				const matchesRole = roleFilter === 'all' || user.role === roleFilter;

				// تصفية حسب الفرع
				const matchesBranch = branchFilter === 'all' || user.branch === branchFilter;

				// تصفية حسب الأداء
				let matchesPerformance = true;
				if (performanceFilter === 'high') {
					matchesPerformance = user.performance.customerRating >= 4.5;
				} else if (performanceFilter === 'medium') {
					matchesPerformance =
						user.performance.customerRating >= 3.5 && user.performance.customerRating < 4.5;
				} else if (performanceFilter === 'low') {
					matchesPerformance = user.performance.customerRating < 3.5 && user.performance.customerRating > 0;
				}

				return matchesSearch && matchesRole && matchesBranch && matchesPerformance;
			})
			.sort((a, b) => {
				// الترتيب حسب الحقل المختار
				if (sortField === 'name') {
					return sortDirection === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
				} else if (sortField === 'sales') {
					return sortDirection === 'asc'
						? a.performance.totalSales - b.performance.totalSales
						: b.performance.totalSales - a.performance.totalSales;
				} else if (sortField === 'orders') {
					return sortDirection === 'asc'
						? a.performance.ordersCompleted - b.performance.ordersCompleted
						: b.performance.ordersCompleted - a.performance.ordersCompleted;
				} else if (sortField === 'rating') {
					return sortDirection === 'asc'
						? a.performance.customerRating - b.performance.customerRating
						: b.performance.customerRating - a.performance.customerRating;
				} else {
					return 0;
				}
			});
	}, [users, searchTerm, roleFilter, branchFilter, performanceFilter, sortField, sortDirection]);

	// حساب عدد المستخدمين حسب الدور
	const countUsersByRole = (roleId: string) => {
		return users.filter((user) => user.role === roleId).length;
	};

	// حساب إجمالي مبيعات المستخدمين حسب الدور
	const totalSalesByRole = (roleId: string) => {
		return users
			.filter((user) => user.role === roleId)
			.reduce((total, user) => total + user.performance.totalSales, 0);
	};

	// الدور الحالي المحدد
	const selectedRole = roles.find((r) => r.id === selectedRoleId);

	// المستخدم الحالي المحدد
	const selectedUser = users.find((u) => u.id === selectedUserId);

	// الحصول على أنشطة المستخدم
	const getUserActivities = (userId: number) => {
		return userActivities.filter((activity) => activity.userId === userId);
	};

	// الحصول على مقاييس أداء المستخدم
	const getUserMetrics = (userId: number, metric: string) => {
		return userMetrics.filter((m) => m.userId === userId && m.metric === metric);
	};

	return (
		<div className='space-y-6'>
			<div className='flex justify-between items-center'>
				<h1 className='text-2xl font-bold text-gray-800'>الإعدادات</h1>
			</div>

			<div className='bg-white rounded-lg shadow-sm overflow-hidden'>
				<div className='flex border-b border-gray-200 overflow-x-auto'>
					<button
						className={`py-4 px-6 text-sm font-medium flex items-center whitespace-nowrap ${
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
						className={`py-4 px-6 text-sm font-medium flex items-center whitespace-nowrap ${
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
						className={`py-4 px-6 text-sm font-medium flex items-center whitespace-nowrap ${
							activeTab === 'users'
								? 'text-green-600 border-b-2 border-green-500'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('users')}
					>
						<Users className='h-5 w-5 ml-2' />
						المستخدمين
					</button>
					<button
						className={`py-4 px-6 text-sm font-medium flex items-center whitespace-nowrap ${
							activeTab === 'roles'
								? 'text-green-600 border-b-2 border-green-500'
								: 'text-gray-500 hover:text-gray-700'
						}`}
						onClick={() => setActiveTab('roles')}
					>
						<Shield className='h-5 w-5 ml-2' />
						الأدوار والصلاحيات
					</button>
					<button
						className={`py-4 px-6 text-sm font-medium flex items-center whitespace-nowrap ${
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
						className={`py-4 px-6 text-sm font-medium flex items-center whitespace-nowrap ${
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
								<p className='mt-1 text-sm text-gray-500'>إضافة وتعديل الفروع وإدارة بياناتها</p>
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

							<div
								id='add-branch-form'
								className='hidden bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6'
							>
								<h4 className='text-md font-medium text-gray-900 mb-4'>إضافة فرع جديد</h4>
								<form onSubmit={handleAddBranch} className='space-y-4'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div className='space-y-2'>
											<label
												htmlFor='branch-name'
												className='block text-sm font-medium text-gray-700'
											>
												اسم الفرع <span className='text-red-500'>*</span>
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
												العنوان <span className='text-red-500'>*</span>
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
												رقم الهاتف <span className='text-red-500'>*</span>
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
												المدير المسؤول <span className='text-red-500'>*</span>
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

							<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
								<div className='p-4 border-b border-gray-200 flex justify-between items-center'>
									<div>
										<h4 className='text-sm font-medium text-gray-700'>قائمة الفروع</h4>
										<p className='text-xs text-gray-500 mt-1'>
											يمكنك إدارة جميع الفروع والانتقال إلى صفحة تفاصيل كل فرع
										</p>
									</div>
									<div className='relative'>
										<input
											type='text'
											placeholder='بحث في الفروع...'
											className='block w-64 pr-10 pl-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 text-sm'
										/>
										<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
											<Search className='h-4 w-4 text-gray-400' />
										</div>
									</div>
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
												<th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
													الحالة
												</th>
												<th className='relative px-6 py-3 text-center'>
													<span>الإجراءات</span>
												</th>
											</tr>
										</thead>
										<tbody className='bg-white divide-y divide-gray-200'>
											{branches.map((branch) => (
												<tr key={branch.id} className='hover:bg-gray-50'>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='flex items-center'>
															<div className='h-10 w-10 shrink-0 bg-green-100 rounded-full flex items-center justify-center'>
																<Building className='h-5 w-5 text-green-600' />
															</div>
															<div className='mr-3'>
																<div className='text-sm font-medium text-gray-900'>
																	{branch.name}
																</div>
																<div className='text-xs text-gray-500'>
																	كود: BR-{branch.id.toString().padStart(3, '0')}
																</div>
															</div>
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
														<div className='flex items-center'>
															<MapPin className='h-4 w-4 text-gray-400 ml-1' />
															{branch.address}
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
														<div className='flex items-center'>
															<Phone className='h-4 w-4 text-gray-400 ml-1' />
															{branch.phone}
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<div className='flex items-center'>
															<div className='h-6 w-6 bg-gray-200 rounded-full flex items-center justify-center'>
																<User className='h-3 w-3 text-gray-500' />
															</div>
															<span className='mr-2 text-sm text-gray-900'>
																{branch.manager}
															</span>
														</div>
													</td>
													<td className='px-6 py-4 whitespace-nowrap'>
														<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
															نشط
														</span>
													</td>
													<td className='px-6 py-4 whitespace-nowrap text-center text-sm font-medium'>
														<div className='flex items-center justify-center space-x-2 space-x-reverse'>
															<Link
																href={`/dashboard/branches/${branch.id}`}
																className='text-blue-600 hover:text-blue-900'
																title='عرض التفاصيل'
															>
																<Eye className='h-5 w-5' />
															</Link>
															<button
																className='text-green-600 hover:text-green-900'
																title='تعديل'
															>
																<Edit className='h-5 w-5' />
															</button>
															<button
																onClick={() => {
																	setBranchToDelete(branch.id);
																	setShowDeleteBranchModal(true);
																}}
																className='text-red-600 hover:text-red-900'
																title='حذف'
															>
																<Trash className='h-5 w-5' />
															</button>
														</div>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								{branches.length === 0 && (
									<div className='p-8 text-center'>
										<Building className='h-10 w-10 text-gray-300 mx-auto mb-2' />
										<h3 className='text-sm font-medium text-gray-900'>لا توجد فروع</h3>
										<p className='mt-1 text-sm text-gray-500'>
											لم يتم إضافة أي فروع بعد، يمكنك إضافة فرع جديد من خلال زر "إضافة فرع جديد"
										</p>
									</div>
								)}
								{branches.length > 0 && (
									<div className='px-4 py-3 bg-gray-50 border-t border-gray-200 text-left text-xs text-gray-500'>
										إجمالي الفروع: {branches.length}
									</div>
								)}
							</div>

							{/* إضافة قسم للفروع المميزة أو آخر الفروع المضافة */}
							<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
								<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden md:col-span-2'>
									<div className='px-4 py-3 border-b border-gray-200'>
										<h3 className='text-sm font-medium text-gray-700'>إحصائيات الفروع</h3>
									</div>
									<div className='p-4'>
										<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
											<div className='bg-blue-50 rounded-lg p-3 text-center'>
												<h4 className='text-xs text-blue-600 font-medium mb-1'>
													إجمالي الفروع
												</h4>
												<p className='text-2xl font-bold text-blue-800'>{branches.length}</p>
											</div>
											<div className='bg-green-50 rounded-lg p-3 text-center'>
												<h4 className='text-xs text-green-600 font-medium mb-1'>
													الفروع النشطة
												</h4>
												<p className='text-2xl font-bold text-green-800'>{branches.length}</p>
											</div>
											<div className='bg-amber-50 rounded-lg p-3 text-center'>
												<h4 className='text-xs text-amber-600 font-medium mb-1'>
													عدد الموظفين
												</h4>
												<p className='text-2xl font-bold text-amber-800'>42</p>
											</div>
											<div className='bg-purple-50 rounded-lg p-3 text-center'>
												<h4 className='text-xs text-purple-600 font-medium mb-1'>
													إجمالي المبيعات
												</h4>
												<p className='text-2xl font-bold text-purple-800'>5.2M</p>
											</div>
										</div>
									</div>
								</div>

								<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
									<div className='px-4 py-3 border-b border-gray-200'>
										<h3 className='text-sm font-medium text-gray-700'>روابط سريعة</h3>
									</div>
									<div className='p-4'>
										<ul className='divide-y divide-gray-200'>
											<li className='py-2'>
												<Link
													href='/dashboard/branches/reports'
													className='text-sm text-blue-600 hover:text-blue-800 flex items-center'
												>
													<FileText className='h-4 w-4 ml-1.5' />
													تقارير أداء الفروع
												</Link>
											</li>
											<li className='py-2'>
												<Link
													href='/dashboard/settings/branches'
													className='text-sm text-blue-600 hover:text-blue-800 flex items-center'
												>
													<Settings className='h-4 w-4 ml-1.5' />
													إعدادات الفروع
												</Link>
											</li>
											<li className='py-2'>
												<Link
													href='/dashboard/branches/map'
													className='text-sm text-blue-600 hover:text-blue-800 flex items-center'
												>
													<MapPin className='h-4 w-4 ml-1.5' />
													خريطة توزيع الفروع
												</Link>
											</li>
											<li className='py-2'>
												<Link
													href='/dashboard/branches/compare'
													className='text-sm text-blue-600 hover:text-blue-800 flex items-center'
												>
													<BarChart className='h-4 w-4 ml-1.5' />
													مقارنة أداء الفروع
												</Link>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					)}

					{/* تبويب إدارة المستخدمين */}
					{activeTab === 'users' && (
						<div className='space-y-6'>
							<div>
								<h3 className='text-lg font-medium text-gray-900'>إدارة المستخدمين</h3>
								<p className='mt-1 text-sm text-gray-500'>إضافة وتعديل مستخدمي النظام وتقييم أدائهم</p>

								{/* شريط التبويبات الداخلية للمستخدمين */}
								<div className='mt-4 border-b border-gray-200'>
									<nav className='flex space-x-8 space-x-reverse'>
										<button
											onClick={() => setActiveUserTab('list')}
											className={`py-2 px-1 border-b-2 font-medium text-sm ${
												activeUserTab === 'list'
													? 'border-green-500 text-green-600'
													: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
											}`}
										>
											قائمة المستخدمين
										</button>
										<button
											onClick={() => setActiveUserTab('performance')}
											className={`py-2 px-1 border-b-2 font-medium text-sm ${
												activeUserTab === 'performance'
													? 'border-green-500 text-green-600'
													: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
											}`}
										>
											إحصائيات الأداء
										</button>
										<button
											onClick={() => setActiveUserTab('evaluations')}
											className={`py-2 px-1 border-b-2 font-medium text-sm ${
												activeUserTab === 'evaluations'
													? 'border-green-500 text-green-600'
													: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
											}`}
										>
											التقييمات والأهداف
										</button>
									</nav>
								</div>
							</div>

							{/* تبويب قائمة المستخدمين */}
							{activeUserTab === 'list' && (
								<div className='bg-white shadow-sm border border-gray-200 rounded-lg'>
									{/* شريط البحث والفلاتر */}
									<div className='p-4 border-b border-gray-200 bg-gray-50 space-y-4'>
										<div className='flex flex-wrap gap-4 justify-between'>
											<div className='relative flex-grow max-w-md'>
												<input
													type='text'
													className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 pr-10 sm:text-sm'
													placeholder='البحث عن مستخدم...'
													value={searchTerm}
													onChange={(e) => setSearchTerm(e.target.value)}
												/>
												<div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
													<Search className='h-5 w-5 text-gray-400' />
												</div>
											</div>

											<div className='flex flex-wrap gap-2'>
												<div>
													<label
														htmlFor='role-filter'
														className='block text-sm font-medium text-gray-700 mb-1'
													>
														الدور
													</label>
													<select
														id='role-filter'
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
														value={roleFilter}
														onChange={(e) => setRoleFilter(e.target.value)}
													>
														<option value='all'>الكل</option>
														{roles.map((role) => (
															<option key={role.id} value={role.id}>
																{role.name}
															</option>
														))}
													</select>
												</div>

												<div>
													<label
														htmlFor='branch-filter'
														className='block text-sm font-medium text-gray-700 mb-1'
													>
														الفرع
													</label>
													<select
														id='branch-filter'
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
														value={branchFilter}
														onChange={(e) => setBranchFilter(e.target.value)}
													>
														<option value='all'>الكل</option>
														{branches.map((branch) => (
															<option key={branch.id} value={branch.name}>
																{branch.name}
															</option>
														))}
													</select>
												</div>

												<div>
													<label
														htmlFor='performance-filter'
														className='block text-sm font-medium text-gray-700 mb-1'
													>
														تقييم الأداء
													</label>
													<select
														id='performance-filter'
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm'
														value={performanceFilter}
														onChange={(e) => setPerformanceFilter(e.target.value)}
													>
														<option value='all'>الكل</option>
														<option value='high'>أداء مرتفع (4.5+)</option>
														<option value='medium'>أداء متوسط (3.5-4.5)</option>
														<option value='low'>أداء منخفض (&lt;3.5)</option>
													</select>
												</div>

												<div className='flex items-end'>
													<button
														type='button'
														onClick={() => setShowAddUserModal(true)}
														className='inline-flex justify-center items-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
													>
														<UserPlus className='h-5 w-5 ml-2' />
														إضافة مستخدم
													</button>
												</div>
											</div>
										</div>

										<div className='flex justify-between items-center'>
											<div className='flex items-center space-x-4 space-x-reverse'>
												<span className='text-sm text-gray-500'>ترتيب حسب:</span>
												<button
													onClick={() => {
														setSortField('name');
														setSortDirection(
															sortField === 'name' && sortDirection === 'asc'
																? 'desc'
																: 'asc'
														);
													}}
													className={`text-sm px-2 py-1 rounded ${
														sortField === 'name' ? 'bg-gray-200' : 'hover:bg-gray-100'
													}`}
												>
													الاسم{' '}
													{sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
												</button>
												<button
													onClick={() => {
														setSortField('sales');
														setSortDirection(
															sortField === 'sales' && sortDirection === 'asc'
																? 'desc'
																: 'asc'
														);
													}}
													className={`text-sm px-2 py-1 rounded ${
														sortField === 'sales' ? 'bg-gray-200' : 'hover:bg-gray-100'
													}`}
												>
													المبيعات{' '}
													{sortField === 'sales' && (sortDirection === 'asc' ? '↑' : '↓')}
												</button>
												<button
													onClick={() => {
														setSortField('orders');
														setSortDirection(
															sortField === 'orders' && sortDirection === 'asc'
																? 'desc'
																: 'asc'
														);
													}}
													className={`text-sm px-2 py-1 rounded ${
														sortField === 'orders' ? 'bg-gray-200' : 'hover:bg-gray-100'
													}`}
												>
													الطلبات{' '}
													{sortField === 'orders' && (sortDirection === 'asc' ? '↑' : '↓')}
												</button>
												<button
													onClick={() => {
														setSortField('rating');
														setSortDirection(
															sortField === 'rating' && sortDirection === 'asc'
																? 'desc'
																: 'asc'
														);
													}}
													className={`text-sm px-2 py-1 rounded ${
														sortField === 'rating' ? 'bg-gray-200' : 'hover:bg-gray-100'
													}`}
												>
													التقييم{' '}
													{sortField === 'rating' && (sortDirection === 'asc' ? '↑' : '↓')}
												</button>
											</div>

											<div className='text-sm text-gray-500'>
												{filteredUsers.length} من {users.length} مستخدم
											</div>
										</div>
									</div>

									{/* جدول المستخدمين */}
									<div>
										{filteredUsers.length > 0 ? (
											<div className='overflow-hidden'>
												{filteredUsers.map((user) => (
													<div
														key={user.id}
														className='border-b border-gray-200 last:border-b-0'
													>
														<div
															className='px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50'
															onClick={() => toggleUserDetails(user.id)}
														>
															<div className='flex items-center space-x-4 space-x-reverse flex-grow'>
																<div className='h-10 w-10 shrink-0 bg-green-100 rounded-full flex items-center justify-center'>
																	<span className='text-green-600 font-medium text-sm'>
																		{user.name.charAt(0)}
																	</span>
																</div>

																<div className='min-w-0 flex-1'>
																	<div className='flex items-center'>
																		<p className='text-sm font-medium text-gray-900 truncate'>
																			{user.name}
																		</p>
																		{!user.isActive && (
																			<span className='mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800'>
																				معطل
																			</span>
																		)}
																	</div>
																	<div className='flex items-center text-sm text-gray-500'>
																		<span className='truncate'>{user.email}</span>
																	</div>
																</div>

																<div className='hidden md:block'>
																	<div className='text-sm text-gray-900'>
																		{user.branch}
																	</div>
																	<div className='text-sm text-gray-500'>
																		{getRoleName(user.role)}
																	</div>
																</div>

																<div className='hidden lg:flex items-center space-x-2 space-x-reverse'>
																	<div className='flex flex-col items-center px-4 py-2 bg-blue-50 rounded-lg'>
																		<span className='text-sm font-medium text-blue-800'>
																			{user.performance.ordersCompleted}
																		</span>
																		<span className='text-xs text-blue-600'>
																			الطلبات
																		</span>
																	</div>

																	{user.performance.totalSales > 0 && (
																		<div className='flex flex-col items-center px-4 py-2 bg-green-50 rounded-lg'>
																			<span className='text-sm font-medium text-green-800'>
																				{user.performance.totalSales.toLocaleString()}{' '}
																				ر.س
																			</span>
																			<span className='text-xs text-green-600'>
																				المبيعات
																			</span>
																		</div>
																	)}

																	<div className='flex flex-col items-center px-4 py-2 bg-amber-50 rounded-lg'>
																		<div className='flex items-center'>
																			<span className='text-sm font-medium text-amber-800'>
																				{user.performance.customerRating > 0
																					? user.performance.customerRating.toFixed(
																							1
																					  )
																					: '-'}
																			</span>
																			{user.performance.customerRating > 0 && (
																				<Star className='h-3 w-3 text-amber-400 mr-0.5' />
																			)}
																		</div>
																		<span className='text-xs text-amber-600'>
																			التقييم
																		</span>
																	</div>
																</div>
															</div>

															<div className='flex items-center'>
																<div className='flex items-center justify-center'>
																	<ChevronDown
																		className={`h-5 w-5 text-gray-400 transition-transform ${
																			expandedUsers[user.id] ? 'rotate-180' : ''
																		}`}
																	/>
																</div>
															</div>
														</div>

														{/* تفاصيل موسعة للمستخدم */}
														{expandedUsers[user.id] && (
															<div className='px-6 py-4 bg-gray-50 border-t border-gray-200'>
																<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
																	{/* معلومات المستخدم */}
																	<div className='space-y-4'>
																		<h4 className='text-sm font-medium text-gray-900'>
																			معلومات المستخدم
																		</h4>

																		<div className='bg-white p-4 rounded-lg shadow-sm space-y-3'>
																			<div className='grid grid-cols-2 gap-4'>
																				<div>
																					<p className='text-xs text-gray-500'>
																						الاسم
																					</p>
																					<p className='text-sm font-medium'>
																						{user.name}
																					</p>
																				</div>
																				<div>
																					<p className='text-xs text-gray-500'>
																						البريد الإلكتروني
																					</p>
																					<p className='text-sm'>
																						{user.email}
																					</p>
																				</div>
																				<div>
																					<p className='text-xs text-gray-500'>
																						رقم الهاتف
																					</p>
																					<p className='text-sm'>
																						{user.phone}
																					</p>
																				</div>
																				<div>
																					<p className='text-xs text-gray-500'>
																						الفرع
																					</p>
																					<p className='text-sm'>
																						{user.branch}
																					</p>
																				</div>
																				<div>
																					<p className='text-xs text-gray-500'>
																						الدور
																					</p>
																					<p className='text-sm'>
																						{getRoleName(user.role)}
																					</p>
																				</div>
																				<div>
																					<p className='text-xs text-gray-500'>
																						تاريخ الانضمام
																					</p>
																					<p className='text-sm'>
																						{user.joinDate}
																					</p>
																				</div>
																				<div>
																					<p className='text-xs text-gray-500'>
																						آخر دخول
																					</p>
																					<p className='text-sm'>
																						{user.lastLogin ||
																							'لم يسجل دخول'}
																					</p>
																				</div>
																				<div>
																					<p className='text-xs text-gray-500'>
																						الحالة
																					</p>
																					<p
																						className={`text-sm font-medium ${
																							user.isActive
																								? 'text-green-600'
																								: 'text-red-600'
																						}`}
																					>
																						{user.isActive ? 'نشط' : 'معطل'}
																					</p>
																				</div>
																			</div>

																			{/* صلاحيات وإعدادات مخصصة */}
																			{(user.customPermissions.maxDiscount !==
																				null ||
																				user.customPermissions
																					.maxOrderAmount !== null) && (
																				<div className='mt-4 pt-4 border-t border-gray-200'>
																					<h5 className='text-xs font-medium text-gray-700 mb-2'>
																						الصلاحيات المخصصة
																					</h5>
																					<div className='grid grid-cols-2 gap-4'>
																						{user.customPermissions
																							.maxDiscount !== null && (
																							<div>
																								<p className='text-xs text-gray-500'>
																									نسبة الخصم المسموحة
																								</p>
																								<p className='text-sm font-medium text-indigo-600'>
																									{
																										user
																											.customPermissions
																											.maxDiscount
																									}
																									%
																								</p>
																							</div>
																						)}
																						{user.customPermissions
																							.maxOrderAmount !==
																							null && (
																							<div>
																								<p className='text-xs text-gray-500'>
																									الحد الأقصى للطلب
																								</p>
																								<p className='text-sm font-medium text-indigo-600'>
																									{user.customPermissions.maxOrderAmount.toLocaleString()}{' '}
																									ر.س
																								</p>
																							</div>
																						)}
																					</div>
																				</div>
																			)}
																		</div>

																		{/* إجراءات المستخدم */}
																		<div className='flex flex-wrap gap-2'>
																			<button
																				onClick={() => handleEditUser(user)}
																				className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200'
																			>
																				<Edit className='h-3.5 w-3.5 ml-1' />
																				تعديل
																			</button>

																			<button
																				onClick={() =>
																					toggleUserStatus(user.id)
																				}
																				className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md ${
																					user.isActive
																						? 'text-amber-700 bg-amber-100 hover:bg-amber-200'
																						: 'text-green-700 bg-green-100 hover:bg-green-200'
																				}`}
																			>
																				{user.isActive ? (
																					<>
																						<X className='h-3.5 w-3.5 ml-1' />
																						تعطيل
																					</>
																				) : (
																					<>
																						<Check className='h-3.5 w-3.5 ml-1' />
																						تفعيل
																					</>
																				)}
																			</button>

																			<button
																				onClick={() =>
																					openUserPermissionsModal(user.id)
																				}
																				className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-purple-700 bg-purple-100 hover:bg-purple-200'
																			>
																				<Shield className='h-3.5 w-3.5 ml-1' />
																				الصلاحيات
																			</button>

																			<button
																				onClick={() =>
																					openRoleTransferModal(user.id)
																				}
																				className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200'
																			>
																				<UserCog className='h-3.5 w-3.5 ml-1' />
																				تغيير الدور
																			</button>

																			<button
																				onClick={() =>
																					openEvaluationModal(user.id)
																				}
																				className='inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md text-emerald-700 bg-emerald-100 hover:bg-emerald-200'
																			>
																				<Award className='h-3.5 w-3.5 ml-1' />
																				تقييم
																			</button>
																		</div>
																	</div>

																	{/* ملخص الأداء */}
																	<div className='space-y-4'>
																		<h4 className='text-sm font-medium text-gray-900'>
																			ملخص الأداء
																		</h4>

																		<div className='bg-white p-4 rounded-lg shadow-sm'>
																			<div className='grid grid-cols-2 gap-4'>
																				<div className='col-span-2'>
																					<div className='flex justify-between items-center mb-1'>
																						<div className='flex items-center'>
																							<Star className='h-4 w-4 text-amber-400 ml-1' />
																							<span className='text-xs font-medium text-gray-700'>
																								تقييم العملاء
																							</span>
																						</div>
																						<span className='text-sm font-bold'>
																							{user.performance
																								.customerRating > 0
																								? user.performance.customerRating.toFixed(
																										1
																								  )
																								: 'لا يوجد'}
																						</span>
																					</div>
																					<div className='w-full bg-gray-200 rounded-full h-2'>
																						<div
																							className={`h-2 rounded-full ${
																								user.performance
																									.customerRating >=
																								4.5
																									? 'bg-green-500'
																									: user.performance
																											.customerRating >=
																									  3.5
																									? 'bg-amber-500'
																									: user.performance
																											.customerRating >
																									  0
																									? 'bg-red-500'
																									: 'bg-gray-300'
																							}`}
																							style={{
																								width: `${
																									user.performance
																										.customerRating >
																									0
																										? (user
																												.performance
																												.customerRating /
																												5) *
																										  100
																										: 0
																								}%`,
																							}}
																						></div>
																					</div>
																				</div>

																				<div>
																					<p className='text-xs text-gray-500'>
																						الطلبات المكتملة
																					</p>
																					<p className='text-sm font-medium'>
																						{
																							user.performance
																								.ordersCompleted
																						}
																					</p>
																				</div>

																				<div>
																					<p className='text-xs text-gray-500'>
																						نسبة المرتجعات
																					</p>
																					<p
																						className={`text-sm font-medium ${
																							user.performance
																								.returnRate < 1
																								? 'text-green-600'
																								: user.performance
																										.returnRate < 2
																								? 'text-amber-600'
																								: 'text-red-600'
																						}`}
																					>
																						{user.performance.returnRate}%
																					</p>
																				</div>

																				{user.performance.totalSales > 0 && (
																					<>
																						<div>
																							<p className='text-xs text-gray-500'>
																								إجمالي المبيعات
																							</p>
																							<p className='text-sm font-medium'>
																								{user.performance.totalSales.toLocaleString()}{' '}
																								ر.س
																							</p>
																						</div>

																						<div>
																							<p className='text-xs text-gray-500'>
																								متوسط قيمة الطلب
																							</p>
																							<p className='text-sm font-medium'>
																								{user.performance.avgOrderValue.toLocaleString()}{' '}
																								ر.س
																							</p>
																						</div>
																					</>
																				)}
																			</div>

																			{/* آخر تقييم */}
																			{user.performance.lastEvaluation && (
																				<div className='mt-4 pt-4 border-t border-gray-200'>
																					<div className='flex justify-between items-center mb-2'>
																						<h5 className='text-xs font-medium text-gray-700'>
																							آخر تقييم
																						</h5>
																						<span className='text-xs text-gray-500'>
																							{
																								user.performance
																									.lastEvaluation.date
																							}
																						</span>
																					</div>

																					<div className='flex items-center mb-2'>
																						<div className='flex'>
																							{[1, 2, 3, 4, 5].map(
																								(rating) => (
																									<Star
																										key={rating}
																										className={`h-4 w-4 ${
																											rating <=
																											user
																												.performance
																												.lastEvaluation!
																												.score
																												? 'text-amber-400 fill-current'
																												: 'text-gray-300'
																										}`}
																									/>
																								)
																							)}
																						</div>
																						<span className='text-xs font-medium text-gray-700 mr-2'>
																							{user.performance.lastEvaluation.score.toFixed(
																								1
																							)}
																							/5
																						</span>
																					</div>

																					<p className='text-sm text-gray-600 mb-2'>
																						{
																							user.performance
																								.lastEvaluation.review
																						}
																					</p>

																					{/* عرض الأهداف غير المكتملة */}
																					{user.performance.lastEvaluation.goals.some(
																						(g) => !g.isCompleted
																					) && (
																						<div className='mt-2'>
																							<h6 className='text-xs font-medium text-gray-700 mb-1'>
																								الأهداف
																							</h6>
																							<ul className='space-y-1'>
																								{user.performance.lastEvaluation.goals
																									.filter(
																										(g) =>
																											!g.isCompleted
																									)
																									.map(
																										(goal, idx) => (
																											<li
																												key={
																													idx
																												}
																												className='text-xs text-gray-600 flex items-start'
																											>
																												<span className='h-4 w-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center shrink-0 mt-0.5 ml-2'>
																													<Target className='h-3 w-3' />
																												</span>
																												<span>
																													{
																														goal.description
																													}{' '}
																													<span className='text-gray-400'>
																														(
																														{
																															goal.dueDate
																														}

																														)
																													</span>
																												</span>
																											</li>
																										)
																									)}
																							</ul>
																						</div>
																					)}
																				</div>
																			)}
																		</div>
																	</div>

																	{/* آخر الأنشطة */}
																	<div className='space-y-4'>
																		<h4 className='text-sm font-medium text-gray-900'>
																			آخر الأنشطة
																		</h4>

																		<div className='bg-white p-4 rounded-lg shadow-sm'>
																			<div className='space-y-3 max-h-72 overflow-y-auto'>
																				{getUserActivities(user.id).length >
																				0 ? (
																					getUserActivities(user.id).map(
																						(activity) => (
																							<div
																								key={activity.id}
																								className='flex items-start border-b border-gray-100 pb-2 last:border-b-0 last:pb-0'
																							>
																								<div className='h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5'>
																									{activity.activityType.includes(
																										'login'
																									) && (
																										<User className='h-3 w-3 text-gray-500' />
																									)}
																									{activity.activityType.includes(
																										'order'
																									) && (
																										<ShoppingCart className='h-3 w-3 text-blue-500' />
																									)}
																									{activity.activityType.includes(
																										'discount'
																									) && (
																										<Percent className='h-3 w-3 text-green-500' />
																									)}
																									{activity.activityType.includes(
																										'customer'
																									) && (
																										<UserCheck className='h-3 w-3 text-purple-500' />
																									)}
																								</div>
																								<div className='mr-2 flex-1 min-w-0'>
																									<p className='text-xs text-gray-900'>
																										{
																											activity.details
																										}
																									</p>
																									<p className='text-xs text-gray-500 mt-0.5'>
																										{
																											activity.timestamp
																										}
																									</p>
																								</div>
																							</div>
																						)
																					)
																				) : (
																					<p className='text-sm text-gray-500 text-center py-4'>
																						لا توجد أنشطة مسجلة
																					</p>
																				)}
																			</div>
																		</div>
																	</div>
																</div>
															</div>
														)}
													</div>
												))}
											</div>
										) : (
											<div className='text-center py-10 bg-gray-50'>
												<Users className='h-12 w-12 text-gray-300 mx-auto' />
												<h3 className='mt-2 text-sm font-medium text-gray-900'>
													لا توجد نتائج مطابقة
												</h3>
												<p className='mt-1 text-sm text-gray-500'>
													لم يتم العثور على مستخدمين مطابقين لمعايير البحث الحالية.
												</p>
												{searchTerm ||
												roleFilter !== 'all' ||
												branchFilter !== 'all' ||
												performanceFilter !== 'all' ? (
													<button
														onClick={() => {
															setSearchTerm('');
															setRoleFilter('all');
															setBranchFilter('all');
															setPerformanceFilter('all');
														}}
														className='
							
							
							mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none'
													>
														إعادة ضبط الفلاتر
													</button>
												) : null}
											</div>
										)}
									</div>
								</div>
							)}

							{/* تبويب إحصائيات الأداء */}
							{activeUserTab === 'performance' && (
								<div className='space-y-6'>
									{/* أدوات الفلترة والبحث */}
									<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
										<div className='flex flex-wrap gap-4 items-end'>
											<div>
												<label className='block text-sm font-medium text-gray-700 mb-1'>
													الفترة الزمنية
												</label>
												<div className='flex items-center space-x-2 space-x-reverse'>
													<div className='relative'>
														<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
															<Calendar className='h-4 w-4 text-gray-400' />
														</div>
														<input
															type='date'
															value={dateRange.start}
															onChange={(e) =>
																setDateRange({ ...dateRange, start: e.target.value })
															}
															className='pr-10 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
														/>
													</div>
													<span className='text-gray-500'>إلى</span>
													<div className='relative'>
														<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
															<Calendar className='h-4 w-4 text-gray-400' />
														</div>
														<input
															type='date'
															value={dateRange.end}
															onChange={(e) =>
																setDateRange({ ...dateRange, end: e.target.value })
															}
															className='pr-10 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
														/>
													</div>
												</div>
											</div>

											<div>
												<label
													htmlFor='performance-role-filter'
													className='block text-sm font-medium text-gray-700 mb-1'
												>
													عرض حسب الدور
												</label>
												<select
													id='performance-role-filter'
													value={roleFilter}
													onChange={(e) => setRoleFilter(e.target.value)}
													className='block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
												>
													<option value='all'>جميع الأدوار</option>
													{roles.map((role) => (
														<option key={role.id} value={role.id}>
															{role.name}
														</option>
													))}
												</select>
											</div>

											<div>
												<label
													htmlFor='performance-branch-filter'
													className='block text-sm font-medium text-gray-700 mb-1'
												>
													الفرع
												</label>
												<select
													id='performance-branch-filter'
													value={branchFilter}
													onChange={(e) => setBranchFilter(e.target.value)}
													className='block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
												>
													<option value='all'>جميع الفروع</option>
													{branches.map((branch) => (
														<option key={branch.id} value={branch.name}>
															{branch.name}
														</option>
													))}
												</select>
											</div>

											<button
												type='button'
												className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none'
											>
												<Filter className='h-4 w-4 ml-2' />
												تطبيق
											</button>
										</div>
									</div>

									{/* لوحة الإحصائيات العامة */}
									<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
										<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
											<div className='flex justify-between items-start'>
												<div>
													<p className='text-sm font-medium text-gray-500'>إجمالي المبيعات</p>
													<p className='text-2xl font-bold text-gray-900 mt-1'>
														{filteredUsers
															.reduce((sum, user) => sum + user.performance.totalSales, 0)
															.toLocaleString()}{' '}
														ر.س
													</p>
												</div>
												<div className='p-2 rounded-lg bg-green-100'>
													<CreditCard className='h-6 w-6 text-green-600' />
												</div>
											</div>
											<div className='mt-3 flex items-center text-sm'>
												{/* يمكن إضافة مؤشر النمو هنا */}
											</div>
										</div>

										<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
											<div className='flex justify-between items-start'>
												<div>
													<p className='text-sm font-medium text-gray-500'>إجمالي الطلبات</p>
													<p className='text-2xl font-bold text-gray-900 mt-1'>
														{filteredUsers
															.reduce(
																(sum, user) => sum + user.performance.ordersCompleted,
																0
															)
															.toLocaleString()}
													</p>
												</div>
												<div className='p-2 rounded-lg bg-blue-100'>
													<ShoppingCart className='h-6 w-6 text-blue-600' />
												</div>
											</div>
											<div className='mt-3 flex items-center text-sm'>
												{/* يمكن إضافة مؤشر النمو هنا */}
											</div>
										</div>

										<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
											<div className='flex justify-between items-start'>
												<div>
													<p className='text-sm font-medium text-gray-500'>
														متوسط قيمة الطلب
													</p>
													<p className='text-2xl font-bold text-gray-900 mt-1'>
														{Math.round(
															filteredUsers.reduce(
																(sum, user) => sum + user.performance.totalSales,
																0
															) /
																Math.max(
																	1,
																	filteredUsers.reduce(
																		(sum, user) =>
																			sum + user.performance.ordersCompleted,
																		0
																	)
																)
														).toLocaleString()}{' '}
														ر.س
													</p>
												</div>
												<div className='p-2 rounded-lg bg-purple-100'>
													<FileText className='h-6 w-6 text-purple-600' />
												</div>
											</div>
											<div className='mt-3 flex items-center text-sm'>
												{/* يمكن إضافة مؤشر النمو هنا */}
											</div>
										</div>

										<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
											<div className='flex justify-between items-start'>
												<div>
													<p className='text-sm font-medium text-gray-500'>متوسط التقييم</p>
													<div className='flex items-center mt-1'>
														<p className='text-2xl font-bold text-gray-900'>
															{(
																filteredUsers.reduce(
																	(sum, user) =>
																		sum + user.performance.customerRating,
																	0
																) /
																Math.max(
																	1,
																	filteredUsers.filter(
																		(u) => u.performance.customerRating > 0
																	).length
																)
															).toFixed(1)}
														</p>
														<Star className='h-6 w-6 text-amber-400 mr-1' />
													</div>
												</div>
												<div className='p-2 rounded-lg bg-amber-100'>
													<Star className='h-6 w-6 text-amber-600' />
												</div>
											</div>
											<div className='mt-3 flex items-center text-sm'>
												{/* يمكن إضافة مؤشر النمو هنا */}
											</div>
										</div>
									</div>

									{/* مخططات وتقارير الأداء */}
									<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
										{/* جدول أفضل المستخدمين أداءً */}
										<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
											<div className='px-4 py-3 border-b border-gray-200 flex justify-between items-center'>
												<h3 className='text-sm font-medium text-gray-700'>
													أفضل المستخدمين أداءً
												</h3>
												<select
													className='text-xs border-gray-300 rounded-md'
													defaultValue='customer_rating'
												>
													<option value='customer_rating'>حسب تقييم العميل</option>
													<option value='sales'>حسب المبيعات</option>
													<option value='orders'>حسب عدد الطلبات</option>
												</select>
											</div>
											<div className='p-4'>
												<div className='space-y-3'>
													{[...filteredUsers]
														.sort(
															(a, b) =>
																b.performance.customerRating -
																a.performance.customerRating
														)
														.slice(0, 5)
														.map((user) => (
															<div
																key={user.id}
																className='flex items-center justify-between'
															>
																<div className='flex items-center'>
																	<div className='h-8 w-8 rounded-full bg-green-100 flex items-center justify-center'>
																		<span className='text-xs font-medium text-green-800'>
																			{user.name.charAt(0)}
																		</span>
																	</div>
																	<div className='mr-3 min-w-0'>
																		<p className='text-sm font-medium text-gray-900 truncate'>
																			{user.name}
																		</p>
																		<p className='text-xs text-gray-500'>
																			{getRoleName(user.role)}
																		</p>
																	</div>
																</div>
																<div className='flex items-center'>
																	<span className='text-sm font-medium'>
																		{user.performance.customerRating.toFixed(1)}
																	</span>
																	<Star className='h-4 w-4 text-amber-400 mr-1' />
																</div>
															</div>
														))}
												</div>
											</div>
										</div>

										{/* جدول أفضل المبيعات */}
										<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
											<div className='px-4 py-3 border-b border-gray-200 flex justify-between items-center'>
												<h3 className='text-sm font-medium text-gray-700'>أفضل المبيعات</h3>
												<select
													className='text-xs border-gray-300 rounded-md'
													defaultValue='total_sales'
												>
													<option value='total_sales'>حسب إجمالي المبيعات</option>
													<option value='avg_order'>حسب متوسط قيمة الطلب</option>
												</select>
											</div>
											<div className='p-4'>
												<div className='space-y-3'>
													{[...filteredUsers]
														.filter((u) => u.performance.totalSales > 0)
														.sort(
															(a, b) =>
																b.performance.totalSales - a.performance.totalSales
														)
														.slice(0, 5)
														.map((user) => (
															<div
																key={user.id}
																className='flex items-center justify-between'
															>
																<div className='flex items-center'>
																	<div className='h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center'>
																		<span className='text-xs font-medium text-blue-800'>
																			{user.name.charAt(0)}
																		</span>
																	</div>
																	<div className='mr-3 min-w-0'>
																		<p className='text-sm font-medium text-gray-900 truncate'>
																			{user.name}
																		</p>
																		<p className='text-xs text-gray-500'>
																			{getRoleName(user.role)}
																		</p>
																	</div>
																</div>
																<div className='text-sm font-medium'>
																	{user.performance.totalSales.toLocaleString()} ر.س
																</div>
															</div>
														))}
												</div>
											</div>
										</div>
									</div>

									{/* تحليل الأداء حسب الدور */}
									<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
										<div className='px-4 py-3 border-b border-gray-200'>
											<h3 className='text-sm font-medium text-gray-700'>
												تحليل الأداء حسب الدور
											</h3>
										</div>
										<div className='p-4'>
											<div className='overflow-x-auto'>
												<table className='min-w-full divide-y divide-gray-200'>
													<thead className='bg-gray-50'>
														<tr>
															<th
																scope='col'
																className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
															>
																الدور
															</th>
															<th
																scope='col'
																className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
															>
																عدد المستخدمين
															</th>
															<th
																scope='col'
																className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
															>
																إجمالي المبيعات
															</th>
															<th
																scope='col'
																className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
															>
																متوسط المبيعات
															</th>
															<th
																scope='col'
																className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'
															>
																متوسط التقييم
															</th>
														</tr>
													</thead>
													<tbody className='bg-white divide-y divide-gray-200'>
														{roles.map((role) => {
															const roleUsers = users.filter((u) => u.role === role.id);
															const userCount = roleUsers.length;
															const totalSales = roleUsers.reduce(
																(sum, u) => sum + u.performance.totalSales,
																0
															);
															const avgSales = userCount > 0 ? totalSales / userCount : 0;
															const avgRating =
																roleUsers.filter(
																	(u) => u.performance.customerRating > 0
																).length > 0
																	? roleUsers.reduce(
																			(sum, u) =>
																				sum + u.performance.customerRating,
																			0
																	  ) /
																	  roleUsers.filter(
																			(u) => u.performance.customerRating > 0
																	  ).length
																	: 0;

															return (
																<tr key={role.id}>
																	<td className='px-6 py-4 whitespace-nowrap'>
																		<div className='flex items-center'>
																			<div className='h-6 w-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center ml-2'>
																				<Shield className='h-3 w-3' />
																			</div>
																			<div className='text-sm font-medium text-gray-900'>
																				{role.name}
																			</div>
																		</div>
																	</td>
																	<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
																		{userCount}
																	</td>
																	<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
																		{totalSales.toLocaleString()} ر.س
																	</td>
																	<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
																		{Math.round(avgSales).toLocaleString()} ر.س
																	</td>
																	<td className='px-6 py-4 whitespace-nowrap'>
																		<div className='flex items-center text-sm text-gray-500'>
																			{avgRating > 0 ? (
																				<>
																					<span>{avgRating.toFixed(1)}</span>
																					<Star className='h-4 w-4 text-amber-400 mr-1' />
																				</>
																			) : (
																				'غير متوفر'
																			)}
																		</div>
																	</td>
																</tr>
															);
														})}
													</tbody>
												</table>
											</div>
										</div>
									</div>
								</div>
							)}

							{/* تبويب التقييمات والأهداف */}
							{activeUserTab === 'evaluations' && (
								<div className='space-y-6'>
									<div className='bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
										<h3 className='text-sm font-medium text-gray-700 mb-4'>
											تقييمات الأداء والأهداف
										</h3>

										<div className='space-y-4'>
											{/* ملخص التقييمات */}
											<div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
												<div className='bg-green-50 p-4 rounded-lg'>
													<div className='flex items-center mb-2'>
														<Award className='h-5 w-5 text-green-600 ml-2' />
														<h4 className='text-sm font-medium text-green-700'>
															أداء مرتفع (4.5+)
														</h4>
													</div>
													<p className='text-2xl font-bold text-green-700'>
														{
															users.filter((u) => u.performance.customerRating >= 4.5)
																.length
														}
													</p>
													<p className='text-xs text-green-600 mt-1'>
														{Math.round(
															(users.filter((u) => u.performance.customerRating >= 4.5)
																.length /
																Math.max(1, users.length)) *
																100
														)}
														% من المستخدمين
													</p>
												</div>

												<div className='bg-amber-50 p-4 rounded-lg'>
													<div className='flex items-center mb-2'>
														<Award className='h-5 w-5 text-amber-600 ml-2' />
														<h4 className='text-sm font-medium text-amber-700'>
															أداء متوسط (3.5-4.5)
														</h4>
													</div>
													<p className='text-2xl font-bold text-amber-700'>
														{
															users.filter(
																(u) =>
																	u.performance.customerRating >= 3.5 &&
																	u.performance.customerRating < 4.5
															).length
														}
													</p>
													<p className='text-xs text-amber-600 mt-1'>
														{Math.round(
															(users.filter(
																(u) =>
																	u.performance.customerRating >= 3.5 &&
																	u.performance.customerRating < 4.5
															).length /
																Math.max(1, users.length)) *
																100
														)}
														% من المستخدمين
													</p>
												</div>

												<div className='bg-red-50 p-4 rounded-lg'>
													<div className='flex items-center mb-2'>
														<Award className='h-5 w-5 text-red-600 ml-2' />
														<h4 className='text-sm font-medium text-red-700'>
															أداء منخفض (&lt;3.5)
														</h4>
													</div>
													<p className='text-2xl font-bold text-red-700'>
														{
															users.filter(
																(u) =>
																	u.performance.customerRating > 0 &&
																	u.performance.customerRating < 3.5
															).length
														}
													</p>
													<p className='text-xs text-red-600 mt-1'>
														{Math.round(
															(users.filter(
																(u) =>
																	u.performance.customerRating > 0 &&
																	u.performance.customerRating < 3.5
															).length /
																Math.max(1, users.length)) *
																100
														)}
														% من المستخدمين
													</p>
												</div>
											</div>

											{/* قائمة المستخدمين مع التقييمات */}
											<div className='overflow-hidden bg-white shadow sm:rounded-md'>
												<ul role='list' className='divide-y divide-gray-200'>
													{filteredUsers
														.filter((user) => user.performance.lastEvaluation)
														.sort(
															(a, b) =>
																b.performance.lastEvaluation!.score -
																a.performance.lastEvaluation!.score
														)
														.map((user) => (
															<li key={user.id}>
																<a className='block hover:bg-gray-50'>
																	<div className='px-4 py-4 sm:px-6'>
																		<div className='flex items-center justify-between'>
																			<div className='flex items-center min-w-0'>
																				<div className='h-10 w-10 rounded-full bg-green-100 flex items-center justify-center'>
																					<span className='text-green-600 font-medium text-sm'>
																						{user.name.charAt(0)}
																					</span>
																				</div>
																				<div className='mr-4 min-w-0'>
																					<p className='text-sm font-medium text-gray-900 truncate'>
																						{user.name}
																					</p>
																					<div className='flex items-center mt-1'>
																						<p className='text-xs text-gray-500 truncate'>
																							{getRoleName(user.role)} -{' '}
																							{user.branch}
																						</p>
																					</div>
																				</div>
																			</div>

																			<div className='flex items-center'>
																				<div className='flex flex-col items-end mr-4'>
																					<div className='flex items-center'>
																						{[1, 2, 3, 4, 5].map(
																							(rating) => (
																								<Star
																									key={rating}
																									className={`h-4 w-4 ${
																										rating <=
																										user.performance
																											.lastEvaluation!
																											.score
																											? 'text-amber-400 fill-current'
																											: 'text-gray-300'
																									}`}
																								/>
																							)
																						)}
																						<span className='text-sm font-medium text-gray-700 mr-2'>
																							{user.performance.lastEvaluation!.score.toFixed(
																								1
																							)}
																						</span>
																					</div>
																					<p className='text-xs text-gray-500 mt-1'>
																						{
																							user.performance
																								.lastEvaluation!.date
																						}
																					</p>
																				</div>

																				<button
																					onClick={() =>
																						openEvaluationModal(user.id)
																					}
																					className='ml-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none'
																				>
																					<Award className='h-4 w-4 ml-1' />
																					تقييم جديد
																				</button>
																			</div>
																		</div>

																		{user.performance.lastEvaluation?.goals.some(
																			(g) => !g.isCompleted
																		) && (
																			<div className='mt-4 border-t border-gray-200 pt-4'>
																				<h5 className='text-xs font-medium text-gray-700 mb-2'>
																					الأهداف الحالية
																				</h5>
																				<div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
																					{user.performance.lastEvaluation.goals
																						.filter((g) => !g.isCompleted)
																						.map((goal, idx) => (
																							<div
																								key={idx}
																								className='flex items-start'
																							>
																								<div className='mt-0.5 h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center'>
																									<Target className='h-3 w-3 text-blue-600' />
																								</div>
																								<div className='mr-2 flex-1'>
																									<p className='text-xs text-gray-700'>
																										{
																											goal.description
																										}
																									</p>
																									<p className='text-xs text-gray-500'>
																										الموعد:{' '}
																										{goal.dueDate}
																									</p>
																								</div>
																							</div>
																						))}
																				</div>
																			</div>
																		)}
																	</div>
																</a>
															</li>
														))}

													{filteredUsers.filter((user) => user.performance.lastEvaluation)
														.length === 0 && (
														<li className='px-4 py-10 text-center'>
															<Award className='h-12 w-12 text-gray-300 mx-auto' />
															<h3 className='mt-2 text-sm font-medium text-gray-900'>
																لا توجد تقييمات
															</h3>
															<p className='mt-1 text-sm text-gray-500'>
																ابدأ بإضافة تقييمات للمستخدمين لتعزيز أدائهم.
															</p>
														</li>
													)}
												</ul>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					)}

					{/* تبويب إدارة الأدوار والصلاحيات */}
					{activeTab === 'roles' && (
						<div className='space-y-6'>
							<div>
								<h3 className='text-lg font-medium text-gray-900'>إدارة الأدوار والصلاحيات</h3>
								<p className='mt-1 text-sm text-gray-500'>
									تحديد أدوار المستخدمين وصلاحياتهم في النظام
								</p>
							</div>

							<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
								{/* قائمة الأدوار */}
								<div className='lg:col-span-1 bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden'>
									<div className='px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center'>
										<h4 className='text-sm font-medium text-gray-700'>الأدوار</h4>
										<button
											type='button'
											onClick={() => {
												setEditingRole(null);
												setNewRoleName('');
												setNewRoleDescription('');
												setShowAddRoleModal(true);
											}}
											className='inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none'
										>
											<Plus className='h-4 w-4 ml-1' />
											إضافة دور
										</button>
									</div>

									<div className='divide-y divide-gray-200 max-h-[calc(100vh-400px)] overflow-y-auto'>
										{roles.map((role) => (
											<div
												key={role.id}
												className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
													selectedRoleId === role.id
														? 'bg-green-50 border-r-4 border-green-500'
														: ''
												}`}
												onClick={() => handleRoleChange(role.id)}
											>
												<div className='flex justify-between items-start'>
													<div>
														<h5 className='text-sm font-medium text-gray-900 flex items-center'>
															{role.name}
															{role.isSystem && (
																<span className='mr-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800'>
																	أساسي
																</span>
															)}
														</h5>
														<p className='text-xs text-gray-500 mt-1'>{role.description}</p>
														<div className='mt-1 text-xs text-gray-400 space-x-2 space-x-reverse'>
															<span>{countUsersByRole(role.id)} مستخدم</span>
															<span>•</span>
															<span>{role.permissions.length} صلاحية</span>
															{role.settings.maxDiscount > 0 && (
																<>
																	<span>•</span>
																	<span>خصم {role.settings.maxDiscount}%</span>
																</>
															)}
														</div>
													</div>

													{!role.isSystem && (
														<div className='flex space-x-1 space-x-reverse'>
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	setupEditRole(role);
																}}
																className='text-blue-600 hover:text-blue-800'
																title='تعديل'
															>
																<Pencil className='h-4 w-4' />
															</button>
															<button
																onClick={(e) => {
																	e.stopPropagation();
																	setRoleToDelete(role.id);
																	setShowDeleteRoleModal(true);
																}}
																className='text-red-600 hover:text-red-800'
																title='حذف'
															>
																<Trash className='h-4 w-4' />
															</button>
														</div>
													)}
												</div>
											</div>
										))}

										{roles.length === 0 && (
											<div className='px-4 py-6 text-center text-gray-500'>
												لا توجد أدوار مضافة. أضف دوراً جديداً للبدء.
											</div>
										)}
									</div>
								</div>

								{/* تفاصيل الدور */}
								<div className='lg:col-span-2 space-y-6'>
									{selectedRoleId ? (
										<>
											{/* معلومات الدور */}
											<div className='bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden'>
												<div className='px-6 py-4 border-b border-gray-200'>
													<div className='flex justify-between items-center'>
														<h4 className='text-lg font-medium text-gray-900'>
															{roles.find((r) => r.id === selectedRoleId)?.name}
														</h4>

														<div className='flex space-x-2 space-x-reverse'>
															{!roles.find((r) => r.id === selectedRoleId)?.isSystem && (
																<button
																	type='button'
																	onClick={openPermissionsModal}
																	className='inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none'
																>
																	<Shield className='ml-2 -mr-1 h-5 w-5' />
																	إدارة الصلاحيات
																</button>
															)}
														</div>
													</div>

													<p className='mt-1 text-sm text-gray-600'>
														{roles.find((r) => r.id === selectedRoleId)?.description}
													</p>

													{roles.find((r) => r.id === selectedRoleId)?.isSystem && (
														<div className='mt-2 rounded-md bg-yellow-50 p-4'>
															<div className='flex'>
																<div className='shrink-0'>
																	<AlertCircle className='h-5 w-5 text-yellow-400' />
																</div>
																<div className='mr-3'>
																	<p className='text-sm text-yellow-700'>
																		هذا دور أساسي في النظام ولا يمكن تعديله أو حذفه.
																	</p>
																</div>
															</div>
														</div>
													)}
												</div>

												{/* حدود الصلاحيات */}
												<div className='px-6 py-4 border-b border-gray-200'>
													<h5 className='text-sm font-medium text-gray-700 mb-3'>
														حدود الصلاحيات
													</h5>
													<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
														<div className='bg-gray-50 p-3 rounded-lg'>
															<div className='flex justify-between items-center mb-1'>
																<span className='text-xs font-medium text-gray-700'>
																	نسبة الخصم المسموحة
																</span>
																<span
																	className={`text-sm font-medium ${
																		(selectedRole?.settings?.maxDiscount ?? 0) > 0
																			? 'text-green-600'
																			: 'text-gray-500'
																	}`}
																>
																	{selectedRole?.settings.maxDiscount}%
																</span>
															</div>
															<div className='w-full bg-gray-200 rounded-full h-2'>
																<div
																	className='h-2 rounded-full bg-green-500'
																	style={{
																		width: `${
																			((selectedRole?.settings.maxDiscount || 0) /
																				50) *
																			100
																		}%`,
																	}}
																></div>
															</div>
														</div>

														<div className='bg-gray-50 p-3 rounded-lg'>
															<div className='flex justify-between items-center mb-1'>
																<span className='text-xs font-medium text-gray-700'>
																	الحد الأقصى لقيمة الطلب
																</span>
																<span
																	className={`text-sm font-medium ${
																		(selectedRole?.settings?.maxOrderAmount ?? 0) >
																		0
																			? 'text-green-600'
																			: 'text-gray-500'
																	}`}
																>
																	{selectedRole?.settings.maxOrderAmount.toLocaleString()}{' '}
																	ر.س
																</span>
															</div>
															<div className='w-full bg-gray-200 rounded-full h-2'>
																<div
																	className='h-2 rounded-full bg-green-500'
																	style={{
																		width: `${
																			((selectedRole?.settings.maxOrderAmount ||
																				0) /
																				100000) *
																			100
																		}%`,
																	}}
																></div>
															</div>
														</div>

														<div className='bg-gray-50 p-3 rounded-lg flex items-center justify-between'>
															<span className='text-xs font-medium text-gray-700'>
																إمكانية الموافقة على الطلبات
															</span>
															<span
																className={`text-sm font-medium ${
																	selectedRole?.settings.canApproveOrders
																		? 'text-green-600'
																		: 'text-gray-500'
																}`}
															>
																{selectedRole?.settings.canApproveOrders
																	? 'مسموح'
																	: 'غير مسموح'}
															</span>
														</div>

														<div className='bg-gray-50 p-3 rounded-lg flex items-center justify-between'>
															<span className='text-xs font-medium text-gray-700'>
																الوصول إلى التقارير
															</span>
															<span
																className={`text-sm font-medium ${
																	selectedRole?.settings.canAccessReports
																		? 'text-green-600'
																		: 'text-gray-500'
																}`}
															>
																{selectedRole?.settings.canAccessReports
																	? 'مسموح'
																	: 'غير مسموح'}
															</span>
														</div>

														<div className='bg-gray-50 p-3 rounded-lg flex items-center justify-between'>
															<span className='text-xs font-medium text-gray-700'>
																إدارة المخزون
															</span>
															<span
																className={`text-sm font-medium ${
																	selectedRole?.settings.canManageInventory
																		? 'text-green-600'
																		: 'text-gray-500'
																}`}
															>
																{selectedRole?.settings.canManageInventory
																	? 'مسموح'
																	: 'غير مسموح'}
															</span>
														</div>

														<div className='bg-gray-50 p-3 rounded-lg flex items-center justify-between'>
															<span className='text-xs font-medium text-gray-700'>
																إدارة المستخدمين
															</span>
															<span
																className={`text-sm font-medium ${
																	selectedRole?.settings.canManageUsers
																		? 'text-green-600'
																		: 'text-gray-500'
																}`}
															>
																{selectedRole?.settings.canManageUsers
																	? 'مسموح'
																	: 'غير مسموح'}
															</span>
														</div>
													</div>
												</div>

												{/* قائمة مستخدمي هذا الدور */}
												<div className='px-6 py-4 border-b border-gray-200'>
													<div className='flex justify-between items-center mb-3'>
														<h5 className='text-sm font-medium text-gray-700'>
															المستخدمون بهذا الدور
														</h5>
														<span className='text-xs text-gray-500'>
															{users.filter((u) => u.role === selectedRoleId).length}{' '}
															مستخدم
														</span>
													</div>
													<div className='space-y-2 max-h-40 overflow-y-auto'>
														{users.filter((u) => u.role === selectedRoleId).length > 0 ? (
															users
																.filter((u) => u.role === selectedRoleId)
																.map((user) => (
																	<div
																		key={user.id}
																		className='flex items-center justify-between py-2 px-3 bg-gray-50 rounded-md'
																	>
																		<div className='flex items-center'>
																			<div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600'>
																				{user.name.charAt(0)}
																			</div>
																			<div className='mr-3'>
																				<div className='text-sm font-medium text-gray-900'>
																					{user.name}
																				</div>
																				<div className='text-xs text-gray-500'>
																					{user.branch}
																				</div>
																			</div>
																		</div>
																		<div className='text-xs text-gray-500 flex items-center'>
																			{user.isActive ? (
																				<span className='text-green-600'>
																					● نشط
																				</span>
																			) : (
																				<span className='text-gray-400'>
																					● معطل
																				</span>
																			)}
																			{user.customPermissions.maxDiscount !==
																				null && (
																				<span className='mr-3 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800'>
																					خصم{' '}
																					{user.customPermissions.maxDiscount}
																					%
																				</span>
																			)}
																		</div>
																	</div>
																))
														) : (
															<div className='text-center text-sm text-gray-500 py-4'>
																لا يوجد مستخدمين بهذا الدور
															</div>
														)}
													</div>
												</div>

												{/* ملخص الصلاحيات */}
												<div className='px-6 py-4'>
													<div className='flex justify-between items-center mb-3'>
														<h5 className='text-sm font-medium text-gray-700'>الصلاحيات</h5>
														<span className='text-xs text-gray-500'>
															{
																roles.find((r) => r.id === selectedRoleId)?.permissions
																	.length
															}{' '}
															من {availablePermissions.length}
														</span>
													</div>

													<div className='space-y-4'>
														{Object.entries(permissionsByGroup).map(([group, perms]) => {
															const groupPermissions =
																roles
																	.find((r) => r.id === selectedRoleId)
																	?.permissions.filter((p) => p.group === group) ||
																[];
															const percent =
																perms.length > 0
																	? Math.round(
																			(groupPermissions.length / perms.length) *
																				100
																	  )
																	: 0;

															return (
																<div key={group} className='space-y-1'>
																	<div className='flex justify-between items-center'>
																		<h6 className='text-xs font-medium text-gray-700'>
																			{group}
																		</h6>
																		<span className='text-xs text-gray-500'>
																			{groupPermissions.length}/{perms.length}
																		</span>
																	</div>
																	<div className='w-full bg-gray-200 rounded-full h-2'>
																		<div
																			className={`h-2 rounded-full ${
																				percent >= 75
																					? 'bg-green-500'
																					: percent >= 50
																					? 'bg-yellow-500'
																					: percent > 0
																					? 'bg-orange-500'
																					: 'bg-gray-300'
																			}`}
																			style={{ width: `${percent}%` }}
																		></div>
																	</div>
																</div>
															);
														})}
													</div>
												</div>
											</div>
										</>
									) : (
										<div className='bg-white shadow-sm border border-gray-200 rounded-lg p-8 text-center'>
											<Shield className='mx-auto h-12 w-12 text-gray-400' />
											<h3 className='mt-2 text-sm font-medium text-gray-900'>لا يوجد دور محدد</h3>
											<p className='mt-1 text-sm text-gray-500'>
												اختر دوراً من القائمة أو أضف دوراً جديداً للبدء.
											</p>
											<div className='mt-6'>
												<button
													type='button'
													onClick={() => {
														setEditingRole(null);
														setNewRoleName('');
														setNewRoleDescription('');
														setShowAddRoleModal(true);
													}}
													className='inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none'
												>
													<Plus className='ml-2 -mr-1 h-5 w-5' />
													إضافة دور جديد
												</button>
											</div>
										</div>
									)}
								</div>
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

			{/* حذف الفرع */}
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

			{/* نافذة إضافة/تعديل مستخدم */}
			{showAddUserModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white p-5 rounded-md shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-gray-900 mb-4'>
							{editingUser ? 'تعديل بيانات المستخدم' : 'إضافة مستخدم جديد'}
						</h3>
						<form onSubmit={handleAddUser} className='space-y-4'>
							<div className='space-y-2'>
								<label htmlFor='new-user-name' className='block text-sm font-medium text-gray-700'>
									الاسم الكامل <span className='text-red-500'>*</span>
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
									البريد الإلكتروني <span className='text-red-500'>*</span>
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
									رقم الهاتف <span className='text-red-500'>*</span>
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
								<label htmlFor='new-user-branch' className='block text-sm font-medium text-gray-700'>
									الفرع <span className='text-red-500'>*</span>
								</label>
								<select
									id='new-user-branch'
									value={newUserBranch}
									onChange={(e) => setNewUserBranch(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									required
								>
									<option value=''>اختر الفرع</option>
									{branches.map((branch) => (
										<option key={branch.id} value={branch.name}>
											{branch.name}
										</option>
									))}
								</select>
							</div>

							<div className='space-y-2'>
								<label htmlFor='new-user-role' className='block text-sm font-medium text-gray-700'>
									الدور <span className='text-red-500'>*</span>
								</label>
								<select
									id='new-user-role'
									value={newUserRole}
									onChange={(e) => setNewUserRole(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									required
								>
									<option value=''>اختر الدور</option>
									{roles.map((role) => (
										<option key={role.id} value={role.id}>
											{role.name}
										</option>
									))}
								</select>
							</div>

							<div className='border-t border-gray-200 pt-4 mt-4'>
								<h4 className='text-sm font-medium text-gray-700 mb-2'>صلاحيات مخصصة (اختياري)</h4>

								<div className='space-y-4'>
									<div className='space-y-2'>
										<div className='flex justify-between items-center'>
											<label
												htmlFor='new-user-max-discount'
												className='block text-sm font-medium text-gray-700'
											>
												الحد الأقصى للخصم (%)
											</label>
											<span className='text-xs text-gray-500'>تجاوز إعدادات الدور</span>
										</div>
										<input
											id='new-user-max-discount'
											type='number'
											value={newUserMaxDiscount}
											onChange={(e) => setNewUserMaxDiscount(e.target.value)}
											placeholder='القيمة الافتراضية للدور'
											className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
											min='0'
											max='50'
										/>
									</div>

									<div className='space-y-2'>
										<div className='flex justify-between items-center'>
											<label
												htmlFor='new-user-max-order-amount'
												className='block text-sm font-medium text-gray-700'
											>
												الحد الأقصى لقيمة الطلب (ر.س)
											</label>
											<span className='text-xs text-gray-500'>تجاوز إعدادات الدور</span>
										</div>
										<input
											id='new-user-max-order-amount'
											type='number'
											value={newUserMaxOrderAmount}
											onChange={(e) => setNewUserMaxOrderAmount(e.target.value)}
											placeholder='القيمة الافتراضية للدور'
											className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
											min='0'
										/>
									</div>
								</div>
							</div>

							{!editingUser && (
								<div className='space-y-2'>
									<label
										htmlFor='new-user-password'
										className='block text-sm font-medium text-gray-700'
									>
										كلمة المرور <span className='text-red-500'>*</span>
									</label>
									<input
										id='new-user-password'
										type='password'
										value={newUserPassword}
										onChange={(e) => setNewUserPassword(e.target.value)}
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										required={!editingUser}
									/>
								</div>
							)}

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
									className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
								>
									{isSubmitting ? 'جاري الحفظ...' : editingUser ? 'تحديث المستخدم' : 'إضافة المستخدم'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* نافذة إضافة/تعديل دور */}
			{showAddRoleModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white p-5 rounded-md shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-gray-900 mb-4'>
							{editingRole ? 'تعديل الدور' : 'إضافة دور جديد'}
						</h3>
						<form onSubmit={handleAddRole} className='space-y-4'>
							<div className='space-y-2'>
								<label htmlFor='role-name' className='block text-sm font-medium text-gray-700'>
									اسم الدور <span className='text-red-500'>*</span>
								</label>
								<input
									id='role-name'
									type='text'
									value={newRoleName}
									onChange={(e) => setNewRoleName(e.target.value)}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
									required
								/>
							</div>

							<div className='space-y-2'>
								<label htmlFor='role-description' className='block text-sm font-medium text-gray-700'>
									وصف الدور
								</label>
								<textarea
									id='role-description'
									value={newRoleDescription}
									onChange={(e) => setNewRoleDescription(e.target.value)}
									rows={3}
									className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
								></textarea>
							</div>

							<div className='flex justify-end space-x-2 space-x-reverse pt-4'>
								<button
									type='button'
									onClick={() => setShowAddRoleModal(false)}
									className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
									disabled={isSubmitting}
								>
									إلغاء
								</button>
								<button
									type='submit'
									disabled={isSubmitting}
									className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed'
								>
									{isSubmitting ? 'جاري الحفظ...' : editingRole ? 'تحديث الدور' : 'إضافة الدور'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* نافذة حذف دور */}
			{showDeleteRoleModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white p-5 rounded-md shadow-lg max-w-md w-full'>
						<h3 className='text-lg font-bold text-gray-900 mb-4'>تأكيد حذف الدور</h3>
						<p className='text-gray-700 mb-4'>
							هل أنت متأكد من رغبتك في حذف هذا الدور؟ لا يمكن التراجع عن هذا الإجراء.
						</p>
						<div className='flex justify-end space-x-2 space-x-reverse'>
							<button
								onClick={() => setShowDeleteRoleModal(false)}
								className='px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300'
								disabled={isSubmitting}
							>
								إلغاء
							</button>
							<button
								onClick={deleteRole}
								className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed'
								disabled={isSubmitting}
							>
								{isSubmitting ? 'جاري الحذف...' : 'حذف'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* نافذة إدارة صلاحيات الدور */}
			{showPermissionsModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white rounded-md shadow-lg max-w-4xl w-full'>
						<div className='flex justify-between items-center p-4 border-b border-gray-200'>
							<h3 className='text-lg font-bold text-gray-900'>
								إدارة صلاحيات {roles.find((r) => r.id === selectedRoleId)?.name}
							</h3>
							<button
								onClick={() => setShowPermissionsModal(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-5 w-5' />
							</button>
						</div>

						<div className='flex overflow-hidden'>
							<div className='w-1/3 bg-gray-50 overflow-y-auto max-h-[70vh] border-l border-gray-200'>
								<div className='p-4 sticky top-0 bg-gray-50 border-b border-gray-200 z-10'>
									<h4 className='text-sm font-medium text-gray-700'>حدود الصلاحيات</h4>
								</div>

								<div className='p-4 space-y-4'>
									<div className='space-y-2'>
										<label
											htmlFor='role-max-discount'
											className='block text-sm font-medium text-gray-700'
										>
											الحد الأقصى للخصم (%)
										</label>
										<input
											id='role-max-discount'
											type='number'
											value={roleMaxDiscount}
											onChange={(e) => setRoleMaxDiscount(Number(e.target.value))}
											className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
											min='0'
											max='50'
										/>
										<div className='flex items-center justify-between text-xs text-gray-500'>
											<span>0%</span>
											<span>50%</span>
										</div>
										<div className='w-full bg-gray-200 rounded-full h-1.5'>
											<div
												className='h-1.5 rounded-full bg-green-500'
												style={{ width: `${(roleMaxDiscount / 50) * 100}%` }}
											></div>
										</div>
									</div>

									<div className='space-y-2'>
										<label
											htmlFor='role-max-order-amount'
											className='block text-sm font-medium text-gray-700'
										>
											الحد الأقصى لقيمة الطلب (ر.س)
										</label>
										<input
											id='role-max-order-amount'
											type='number'
											value={roleMaxOrderAmount}
											onChange={(e) => setRoleMaxOrderAmount(Number(e.target.value))}
											className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
											min='0'
											step='1000'
										/>
										<div className='flex items-center justify-between text-xs text-gray-500'>
											<span>0</span>
											<span>100,000</span>
										</div>
										<div className='w-full bg-gray-200 rounded-full h-1.5'>
											<div
												className='h-1.5 rounded-full bg-green-500'
												style={{ width: `${(roleMaxOrderAmount / 100000) * 100}%` }}
											></div>
										</div>
									</div>

									<div className='space-y-3 pt-4 border-t border-gray-200'>
										<h5 className='text-sm font-medium text-gray-700'>صلاحيات خاصة</h5>

										<div className='flex items-center justify-between'>
											<div className='flex items-start'>
												<div className='flex items-center h-5'>
													<input
														id='can-approve-returns'
														type='checkbox'
														checked={rolePermissionLimits['can_approve_returns'] as boolean}
														onChange={(e) =>
															setRolePermissionLimits({
																...rolePermissionLimits,
																can_approve_returns: e.target.checked,
															})
														}
														className='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded'
													/>
												</div>
												<div className='mr-3'>
													<label
														htmlFor='can-approve-returns'
														className='text-sm font-medium text-gray-700'
													>
														الموافقة على المرتجعات
													</label>
													<p className='text-xs text-gray-500'>
														إمكانية الموافقة على طلبات الإرجاع
													</p>
												</div>
											</div>
										</div>

										<div className='flex items-center justify-between'>
											<div className='flex items-start'>
												<div className='flex items-center h-5'>
													<input
														id='can-modify-prices'
														type='checkbox'
														checked={rolePermissionLimits['can_modify_prices'] as boolean}
														onChange={(e) =>
															setRolePermissionLimits({
																...rolePermissionLimits,
																can_modify_prices: e.target.checked,
															})
														}
														className='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded'
													/>
												</div>
												<div className='mr-3'>
													<label
														htmlFor='can-modify-prices'
														className='text-sm font-medium text-gray-700'
													>
														تعديل الأسعار
													</label>
													<p className='text-xs text-gray-500'>
														إمكانية تغيير أسعار المنتجات
													</p>
												</div>
											</div>
										</div>

										<div className='flex items-center justify-between'>
											<div className='flex items-start'>
												<div className='flex items-center h-5'>
													<input
														id='can-access-financial-reports'
														type='checkbox'
														checked={
															rolePermissionLimits[
																'can_access_financial_reports'
															] as boolean
														}
														onChange={(e) =>
															setRolePermissionLimits({
																...rolePermissionLimits,
																can_access_financial_reports: e.target.checked,
															})
														}
														className='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded'
													/>
												</div>
												<div className='mr-3'>
													<label
														htmlFor='can-access-financial-reports'
														className='text-sm font-medium text-gray-700'
													>
														الوصول للتقارير المالية
													</label>
													<p className='text-xs text-gray-500'>
														إمكانية الوصول للتقارير المالية
													</p>
												</div>
											</div>
										</div>

										<div className='flex items-center justify-between'>
											<div className='flex items-start'>
												<div className='flex items-center h-5'>
													<input
														id='can-manage-users'
														type='checkbox'
														checked={rolePermissionLimits['can_manage_users'] as boolean}
														onChange={(e) =>
															setRolePermissionLimits({
																...rolePermissionLimits,
																can_manage_users: e.target.checked,
															})
														}
														className='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded'
													/>
												</div>
												<div className='mr-3'>
													<label
														htmlFor='can-manage-users'
														className='text-sm font-medium text-gray-700'
													>
														إدارة المستخدمين
													</label>
													<p className='text-xs text-gray-500'>
														إمكانية إدارة حسابات المستخدمين
													</p>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className='w-2/3 overflow-y-auto max-h-[70vh]'>
								<div className='p-4 sticky top-0 bg-white border-b border-gray-200 z-10'>
									<h4 className='text-sm font-medium text-gray-700'>الصلاحيات</h4>
								</div>

								<div className='p-4'>
									{Object.entries(permissionsByGroup).map(([group, permissions]) => (
										<div key={group} className='mb-8 last:mb-0'>
											<div className='flex justify-between items-center mb-2'>
												<h5 className='text-sm font-medium text-gray-900'>{group}</h5>
												<button
													type='button'
													onClick={() => {
														const newPermissions = { ...rolePermissions };
														const allChecked = permissions.every(
															(p) => rolePermissions[p.id]
														);

														permissions.forEach((permission) => {
															newPermissions[permission.id] = !allChecked;
														});

														setRolePermissions(newPermissions);
													}}
													className='text-xs text-blue-600 hover:text-blue-800'
												>
													{permissions.every((p) => rolePermissions[p.id])
														? 'إلغاء تحديد الكل'
														: 'تحديد الكل'}
												</button>
											</div>

											<div className='bg-gray-50 p-4 rounded-lg space-y-4'>
												{permissions.map((permission) => (
													<div
														key={permission.id}
														className='flex items-start justify-between'
													>
														<div className='flex items-start'>
															<div className='flex items-center h-5 mt-0.5'>
																<input
																	id={permission.id}
																	type='checkbox'
																	checked={rolePermissions[permission.id] || false}
																	onChange={() => {
																		setRolePermissions({
																			...rolePermissions,
																			[permission.id]:
																				!rolePermissions[permission.id],
																		});
																	}}
																	className='focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300 rounded'
																/>
															</div>
															<div className='mr-3'>
																<label
																	htmlFor={permission.id}
																	className='text-sm font-medium text-gray-700'
																>
																	{permission.name}
																</label>
																<p className='text-xs text-gray-500'>
																	{permission.description}
																</p>
															</div>
														</div>

														{/* إذا كانت الصلاحية مرتبطة بالخصومات أو المبالغ، نظهر معلومات إضافية */}
														{permission.id === 'orders.discount' && (
															<div className='text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded'>
																حد الخصم: {roleMaxDiscount}%
															</div>
														)}
													</div>
												))}
											</div>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className='flex justify-end p-4 border-t border-gray-200 bg-gray-50'>
							<button
								type='button'
								onClick={() => setShowPermissionsModal(false)}
								className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-3 hover:bg-gray-50'
							>
								إلغاء
							</button>

							<button
								type='button'
								onClick={handleUpdatePermissions}
								disabled={isSubmitting}
								className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center'
							>
								<Shield className='ml-2 -mr-1 h-5 w-5' />
								{isSubmitting ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* نافذة إدارة صلاحيات المستخدم */}
			{showUserPermissionsModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white rounded-md shadow-lg max-w-lg w-full'>
						<div className='flex justify-between items-center p-4 border-b border-gray-200'>
							<h3 className='text-lg font-bold text-gray-900'>
								صلاحيات المستخدم: {users.find((u) => u.id === selectedUserId)?.name}
							</h3>
							<button
								onClick={() => setShowUserPermissionsModal(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-5 w-5' />
							</button>
						</div>

						<div className='p-6 space-y-6'>
							<div className='bg-blue-50 p-4 rounded-md mb-6'>
								<div className='flex'>
									<div className='shrink-0'>
										<Info className='h-5 w-5 text-blue-400' />
									</div>
									<div className='mr-3'>
										<h4 className='text-sm font-medium text-blue-800'>معلومات الدور</h4>
										<div className='mt-2 text-sm text-blue-700'>
											<p>الدور: {getRoleName(selectedUser?.role || '')}</p>
											<p className='mt-1'>
												الصلاحيات والإعدادات المخصصة أدناه تتجاوز إعدادات الدور الأساسية.
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className='space-y-4'>
								<div className='space-y-2'>
									<div className='flex justify-between items-center'>
										<label
											htmlFor='user-max-discount'
											className='block text-sm font-medium text-gray-700'
										>
											الحد الأقصى للخصم (%)
										</label>
										<span className='text-xs text-gray-500'>
											القيمة الافتراضية:{' '}
											{roles.find((r) => r.id === selectedUser?.role)?.settings.maxDiscount || 0}%
										</span>
									</div>
									<input
										id='user-max-discount'
										type='number'
										value={newUserMaxDiscount}
										onChange={(e) => setNewUserMaxDiscount(e.target.value)}
										placeholder='استخدام القيمة الافتراضية للدور'
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										min='0'
										max='50'
									/>
									<div className='flex items-center justify-between text-xs text-gray-500'>
										<span>0%</span>
										<span>50%</span>
									</div>
									<div className='w-full bg-gray-200 rounded-full h-1.5'>
										<div
											className='h-1.5 rounded-full bg-green-500'
											style={{
												width: `${
													((newUserMaxDiscount ? Number(newUserMaxDiscount) : 0) / 50) * 100
												}%`,
											}}
										></div>
									</div>
								</div>

								<div className='space-y-2'>
									<div className='flex justify-between items-center'>
										<label
											htmlFor='user-max-order-amount'
											className='block text-sm font-medium text-gray-700'
										>
											الحد الأقصى لقيمة الطلب (ر.س)
										</label>
										<span className='text-xs text-gray-500'>
											القيمة الافتراضية:{' '}
											{roles
												.find((r) => r.id === selectedUser?.role)
												?.settings.maxOrderAmount.toLocaleString() || 0}{' '}
											ر.س
										</span>
									</div>
									<input
										id='user-max-order-amount'
										type='number'
										value={newUserMaxOrderAmount}
										onChange={(e) => setNewUserMaxOrderAmount(e.target.value)}
										placeholder='استخدام القيمة الافتراضية للدور'
										className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
										min='0'
										step='1000'
									/>
									<div className='flex items-center justify-between text-xs text-gray-500'>
										<span>0</span>
										<span>100,000</span>
									</div>
									<div className='w-full bg-gray-200 rounded-full h-1.5'>
										<div
											className='h-1.5 rounded-full bg-green-500'
											style={{
												width: `${
													((newUserMaxOrderAmount ? Number(newUserMaxOrderAmount) : 0) /
														100000) *
													100
												}%`,
											}}
										></div>
									</div>
								</div>
							</div>

							<div className='bg-yellow-50 p-4 rounded-md'>
								<div className='flex'>
									<div className='shrink-0'>
										<AlertCircle className='h-5 w-5 text-yellow-400' />
									</div>
									<div className='mr-3'>
										<p className='text-sm text-yellow-700'>
											ترك أي حقل فارغاً سيؤدي إلى استخدام القيمة الافتراضية المحددة في الدور.
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className='flex justify-end p-4 border-t border-gray-200 bg-gray-50'>
							<button
								type='button'
								onClick={() => setShowUserPermissionsModal(false)}
								className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-3 hover:bg-gray-50'
							>
								إلغاء
							</button>

							<button
								type='button'
								onClick={handleUpdateUserPermissions}
								disabled={isSubmitting}
								className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center'
							>
								<Shield className='ml-2 -mr-1 h-5 w-5' />
								{isSubmitting ? 'جاري الحفظ...' : 'حفظ الصلاحيات'}
							</button>
						</div>
					</div>
				</div>
			)}

			{/* نافذة تقييم المستخدم */}
			{showEvaluationModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white rounded-md shadow-lg max-w-4xl w-full'>
						<div className='flex justify-between items-center p-4 border-b border-gray-200'>
							<h3 className='text-lg font-bold text-gray-900'>
								تقييم أداء المستخدم: {users.find((u) => u.id === newEvaluation.userId)?.name}
							</h3>
							<button
								onClick={() => setShowEvaluationModal(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-5 w-5' />
							</button>
						</div>

						<form onSubmit={handleEvaluateUser}>
							<div className='overflow-y-auto max-h-[70vh] p-6'>
								<div className='space-y-6'>
									{/* التقييم العام */}
									<div>
										<h4 className='text-sm font-medium text-gray-900 mb-3'>التقييم العام</h4>
										<div className='flex items-center mb-4'>
											<div className='flex space-x-1 space-x-reverse'>
												{[1, 2, 3, 4, 5].map((rating) => (
													<button
														key={rating}
														type='button'
														onClick={() =>
															setNewEvaluation({ ...newEvaluation, score: rating })
														}
														className={`h-8 w-8 rounded-full flex items-center justify-center ${
															rating <= newEvaluation.score
																? 'bg-amber-100 text-amber-600'
																: 'bg-gray-100 text-gray-400 hover:bg-gray-200'
														}`}
													>
														<Star
															className={`h-5 w-5 ${
																rating <= newEvaluation.score ? 'fill-current' : ''
															}`}
														/>
													</button>
												))}
											</div>
											<span className='mr-3 font-medium text-gray-700'>
												{newEvaluation.score}/5
											</span>
										</div>

										<div className='space-y-2'>
											<label
												htmlFor='evaluation-review'
												className='block text-sm font-medium text-gray-700'
											>
												ملاحظات التقييم
											</label>
											<textarea
												id='evaluation-review'
												rows={3}
												value={newEvaluation.review}
												onChange={(e) =>
													setNewEvaluation({ ...newEvaluation, review: e.target.value })
												}
												className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
												placeholder='أضف ملاحظات عامة حول أداء المستخدم...'
												required
											></textarea>
										</div>
									</div>

									{/* نقاط القوة */}
									<div>
										<div className='flex justify-between items-center mb-3'>
											<h4 className='text-sm font-medium text-gray-900'>نقاط القوة</h4>
											<button
												type='button'
												onClick={addStrength}
												className='text-xs text-blue-600 hover:text-blue-800 flex items-center'
											>
												<Plus className='h-3 w-3 ml-1' />
												إضافة نقطة قوة
											</button>
										</div>

										<div className='space-y-2'>
											{newEvaluation.strengths.map((strength, index) => (
												<div key={index} className='flex items-center'>
													<input
														type='text'
														value={strength}
														onChange={(e) => updateStrength(index, e.target.value)}
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
														placeholder='نقطة قوة...'
													/>
													{index > 0 && (
														<button
															type='button'
															onClick={() => {
																const updatedStrengths = [...newEvaluation.strengths];
																updatedStrengths.splice(index, 1);
																setNewEvaluation({
																	...newEvaluation,
																	strengths: updatedStrengths,
																});
															}}
															className='mr-2 text-red-600 hover:text-red-800'
														>
															<X className='h-5 w-5' />
														</button>
													)}
												</div>
											))}
										</div>
									</div>

									{/* مجالات التحسين */}
									<div>
										<div className='flex justify-between items-center mb-3'>
											<h4 className='text-sm font-medium text-gray-900'>مجالات التحسين</h4>
											<button
												type='button'
												onClick={addImprovement}
												className='text-xs text-blue-600 hover:text-blue-800 flex items-center'
											>
												<Plus className='h-3 w-3 ml-1' />
												إضافة مجال تحسين
											</button>
										</div>

										<div className='space-y-2'>
											{newEvaluation.improvements.map((improvement, index) => (
												<div key={index} className='flex items-center'>
													<input
														type='text'
														value={improvement}
														onChange={(e) => updateImprovement(index, e.target.value)}
														className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
														placeholder='مجال تحسين...'
													/>
													{index > 0 && (
														<button
															type='button'
															onClick={() => {
																const updatedImprovements = [
																	...newEvaluation.improvements,
																];
																updatedImprovements.splice(index, 1);
																setNewEvaluation({
																	...newEvaluation,
																	improvements: updatedImprovements,
																});
															}}
															className='mr-2 text-red-600 hover:text-red-800'
														>
															<X className='h-5 w-5' />
														</button>
													)}
												</div>
											))}
										</div>
									</div>

									{/* الأهداف */}
									<div>
										<div className='flex justify-between items-center mb-3'>
											<h4 className='text-sm font-medium text-gray-900'>الأهداف</h4>
											<button
												type='button'
												onClick={addGoal}
												className='text-xs text-blue-600 hover:text-blue-800 flex items-center'
											>
												<Plus className='h-3 w-3 ml-1' />
												إضافة هدف
											</button>
										</div>

										<div className='space-y-3'>
											{newEvaluation.goals.map((goal, index) => (
												<div key={index} className='p-3 bg-gray-50 rounded-lg'>
													<div className='flex justify-between mb-2'>
														<h5 className='text-xs font-medium text-gray-700'>
															هدف {index + 1}
														</h5>
														{index > 0 && (
															<button
																type='button'
																onClick={() => {
																	const updatedGoals = [...newEvaluation.goals];
																	updatedGoals.splice(index, 1);
																	setNewEvaluation({
																		...newEvaluation,
																		goals: updatedGoals,
																	});
																}}
																className='text-red-600 hover:text-red-800'
															>
																<X className='h-4 w-4' />
															</button>
														)}
													</div>

													<div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
														<div className='md:col-span-2'>
															<label
																htmlFor={`goal-description-${index}`}
																className='block text-xs font-medium text-gray-700 mb-1'
															>
																وصف الهدف
															</label>
															<input
																id={`goal-description-${index}`}
																type='text'
																value={goal.description}
																onChange={(e) =>
																	updateGoal(index, 'description', e.target.value)
																}
																className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
																placeholder='هدف جديد...'
															/>
														</div>

														<div>
															<label
																htmlFor={`goal-date-${index}`}
																className='block text-xs font-medium text-gray-700 mb-1'
															>
																تاريخ الاستحقاق
															</label>
															<input
																id={`goal-date-${index}`}
																type='date'
																value={goal.dueDate}
																onChange={(e) =>
																	updateGoal(index, 'dueDate', e.target.value)
																}
																className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
															/>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
								</div>
							</div>

							<div className='flex justify-end p-4 border-t border-gray-200 bg-gray-50'>
								<button
									type='button'
									onClick={() => setShowEvaluationModal(false)}
									className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-3 hover:bg-gray-50'
								>
									إلغاء
								</button>

								<button
									type='submit'
									disabled={isSubmitting}
									className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center'
								>
									<Award className='ml-2 -mr-1 h-5 w-5' />
									{isSubmitting ? 'جاري الحفظ...' : 'حفظ التقييم'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* نافذة تغيير دور المستخدم */}
			{showRoleTransferModal && (
				<div className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50'>
					<div className='bg-white rounded-md shadow-lg max-w-md w-full'>
						<div className='flex justify-between items-center p-4 border-b border-gray-200'>
							<h3 className='text-lg font-bold text-gray-900'>تغيير دور المستخدم</h3>
							<button
								onClick={() => setShowRoleTransferModal(false)}
								className='text-gray-400 hover:text-gray-500'
							>
								<X className='h-5 w-5' />
							</button>
						</div>

						<form onSubmit={handleRoleTransfer}>
							<div className='p-6 space-y-6'>
								<div className='bg-blue-50 p-4 rounded-md mb-4'>
									<div className='flex'>
										<div className='shrink-0'>
											<Info className='h-5 w-5 text-blue-400' />
										</div>
										<div className='mr-3'>
											<h4 className='text-sm font-medium text-blue-800'>معلومات تغيير الدور</h4>
											<div className='mt-2 text-sm text-blue-700'>
												<p>المستخدم: {users.find((u) => u.id === roleTransfer.userId)?.name}</p>
												<p>الدور الحالي: {getRoleName(roleTransfer.prevRole)}</p>
											</div>
										</div>
									</div>
								</div>

								<div className='space-y-6'>
									<div className='space-y-2'>
										<label htmlFor='new-role' className='block text-sm font-medium text-gray-700'>
											الدور الجديد <span className='text-red-500'>*</span>
										</label>
										<select
											id='new-role'
											value={roleTransfer.newRole}
											onChange={(e) =>
												setRoleTransfer({ ...roleTransfer, newRole: e.target.value })
											}
											className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
											required
										>
											<option value=''>اختر الدور الجديد</option>
											{roles
												.filter((role) => role.id !== roleTransfer.prevRole)
												.map((role) => (
													<option key={role.id} value={role.id}>
														{role.name}
													</option>
												))}
										</select>
									</div>

									<div className='space-y-2'>
										<label
											htmlFor='role-transfer-reason'
											className='block text-sm font-medium text-gray-700'
										>
											سبب التغيير
										</label>
										<textarea
											id='role-transfer-reason'
											rows={3}
											value={roleTransfer.reason}
											onChange={(e) =>
												setRoleTransfer({ ...roleTransfer, reason: e.target.value })
											}
											className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm'
											placeholder='أضف سبب تغيير الدور...'
										></textarea>
									</div>
								</div>

								<div className='bg-yellow-50 p-4 rounded-md'>
									<div className='flex'>
										<div className='shrink-0'>
											<AlertCircle className='h-5 w-5 text-yellow-400' />
										</div>
										<div className='mr-3'>
											<p className='text-sm text-yellow-700'>
												سيتم إعادة تعيين الصلاحيات المخصصة للمستخدم عند تغيير الدور.
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className='flex justify-end p-4 border-t border-gray-200 bg-gray-50'>
								<button
									type='button'
									onClick={() => setShowRoleTransferModal(false)}
									className='px-4 py-2 border border-gray-300 text-gray-700 rounded-md mr-3 hover:bg-gray-50'
								>
									إلغاء
								</button>

								<button
									type='submit'
									disabled={isSubmitting || !roleTransfer.newRole}
									className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center'
								>
									<UserCog className='ml-2 -mr-1 h-5 w-5' />
									{isSubmitting ? 'جاري التغيير...' : 'تغيير الدور'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* إشعار */}
			{notification && (
				<div
					className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 space-x-reverse ${
						notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
					}`}
				>
					{notification.type === 'success' ? (
						<Check className='h-5 w-5 text-green-500' />
					) : (
						<AlertCircle className='h-5 w-5 text-red-500' />
					)}
					<span>{notification.message}</span>
				</div>
			)}
		</div>
	);
}
