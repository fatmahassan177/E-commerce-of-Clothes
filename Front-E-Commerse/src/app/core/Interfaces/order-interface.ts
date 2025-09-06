import { IProduct } from './product-interface';
import { IUser } from './user-interface';

export interface IOrderProduct {
  productId: IProduct;   
  quantity: number;
  price: number;
  name: string;
  image?: string;
}

export interface IOrder {
  _id: string;
  userId: IUser;   
  products: IOrderProduct[];
  totalPrice: number;
  address: {
    street: string;
    city: string;
    governorate: string;
  };
  status: 'Pending' | 'Preparing' | 'Ready for Shipping' | 'Shipped' | 'Received' | 'Rejected' | 'Cancelled';
  payment: string;
  statusHistory: {
    status: string;
    changedBy?: IUser;
    changedAt: string;
  }[];
  cancelReason?: string;
 
}

export interface IOrdersRes {
  message: string;
  data: IOrder[];
  count: number;
}
