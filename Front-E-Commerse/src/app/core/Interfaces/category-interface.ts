export interface ICategory {
_id: string;
  name: string;
  gender: 'men' | 'women';
}
export interface ICategoriesRes {
  data: ICategory[];
  message: string;
}


