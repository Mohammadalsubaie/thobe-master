import { Customer } from '@/types/customer';
import { Order } from '@/types/order';
import { User } from '@/types/user';

export const linkCustomerToBranch = async (customerId: string, branchId: string, userId: string): Promise<Customer> => {
	// TODO: Implement database update
	throw new Error('Not implemented');
};

export const linkOrderToBranch = async (orderId: string, branchId: string, userId: string): Promise<Order> => {
	// TODO: Implement database update
	throw new Error('Not implemented');
};

export const linkUserToCustomer = async (userId: string, customerId: string): Promise<User> => {
	// TODO: Implement database update
	throw new Error('Not implemented');
};

export const linkUserToOrder = async (userId: string, orderId: string, type: 'created' | 'assigned'): Promise<User> => {
	// TODO: Implement database update
	throw new Error('Not implemented');
};

export const getBranchCustomers = async (branchId: string): Promise<Customer[]> => {
	// TODO: Implement database query
	throw new Error('Not implemented');
};

export const getBranchOrders = async (branchId: string): Promise<Order[]> => {
	// TODO: Implement database query
	throw new Error('Not implemented');
};

export const getUserCustomers = async (userId: string): Promise<Customer[]> => {
	// TODO: Implement database query
	throw new Error('Not implemented');
};

export const getUserOrders = async (userId: string, type: 'created' | 'assigned'): Promise<Order[]> => {
	// TODO: Implement database query
	throw new Error('Not implemented');
};
