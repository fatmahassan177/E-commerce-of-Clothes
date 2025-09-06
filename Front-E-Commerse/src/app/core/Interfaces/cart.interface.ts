
export interface ICartItem {
  stock: number;
  stockStatus: string;
  productId: string;
  quantity: number;
  priceAtAdd: number;
  productName?: string; 
   imgurl: string;  
}

export interface ICart {
  _id?: string;
  userId?: string; 
  items: ICartItem[];
  totalPrice: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICartRes {
  message: string;
  data: ICart;
}
