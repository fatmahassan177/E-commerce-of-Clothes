export interface IAddress {
  street: string;
  city: string;
  governorate: string;
}

export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  address: IAddress;
  
}
export  interface ILogin{
    email:string 
    password:string
}

export interface ILoginRes{
    message:string,
    Token:string
}

export interface IUserData{
    id:string
    role:string
    name:string
    exp: number;
}

export interface IUserRes{
     message:string,
     data:IUser[]

}