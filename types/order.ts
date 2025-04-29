export interface Order {
	id: string;
	customerId: string;
	branchId: string;
	measurementId: string;
	fabricId: string;
	status: 'pending' | 'in-progress' | 'ready' | 'delivered' | 'needs-repair';
	assignedTailorId: string;
	factoryTailorId: string;
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
	deliveryDate?: Date;
	completedDate?: Date;
	price: number;
	notes?: string;
	repairDetails?: string;
}
