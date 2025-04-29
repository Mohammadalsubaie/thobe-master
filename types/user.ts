export interface User {
	id: string;
	name: string;
	email: string;
	role: 'admin' | 'tailor' | 'factory' | 'delivery';
	branchId?: string;
	phone?: string;
	active: boolean;
	createdCustomers?: string[];
	createdOrders?: string[];
	assignedOrders?: string[];
	createdAt: Date;
	updatedAt: Date;
}
