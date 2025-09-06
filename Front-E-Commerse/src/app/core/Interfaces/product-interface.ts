
export interface IProduct {
    _id: string;
  title: string;
  desc: string;
  price: number;
  route: string;
  stock: number;
  imgurl: string;
  stockStatus: 'In Stock' | 'Limited Stock' | 'Out of Stock';
  category: {
    _id: string;
    name: string;
    gender: 'men' | 'women';
  };
}
export interface IProductsRes{
    data:IProduct[]
    message:string
}





