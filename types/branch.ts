export interface Branch {
	id: string;
	name: string;
	address: string;
	location?: {
		lat: number;
		lng: number;
	};
	phone: string;
	manager: string;
	active: boolean;
	createdAt: Date;
	updatedAt: Date;
}
