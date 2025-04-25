export interface Fabric {
	id: string;
	name: string;
	type: string;
	color: string;
	pattern?: string;
	price: number;
	quantity: number;
	imageUrl?: string;
	supplier?: string;
	createdAt: Date;
	updatedAt: Date;
}
