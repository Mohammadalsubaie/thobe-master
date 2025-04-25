export interface Order {
	id: string;
	customerId: string;
	measurementId: string;
	fabricId: string;
	status: 'pending' | 'in-progress' | 'ready' | 'delivered' | 'needs-repair';
	assignedTailorId: string;
	factoryTailorId: string;
	createdAt: Date;
	updatedAt: Date;
	deliveryDate?: Date;
	completedDate?: Date;
	price: number;
	notes?: string;
	repairDetails?: string;
}
