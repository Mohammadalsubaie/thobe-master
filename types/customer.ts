import { Measurement } from './measurement';
import { Order } from './order';

export interface Customer {
	id: string;
	name: string;
	phone: string;
	email?: string;
	address?: string;
	branchId: string;
	createdBy: string;
	location?: {
		lat: number;
		lng: number;
	};
	measurements: Measurement[];
	orders: Order[];
	createdAt: Date;
	updatedAt: Date;
}
