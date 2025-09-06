export interface IContact {
 _id?: string;
FirstName: string;
LastName: string;
email: string;
message: string;
 type?: string;


}
export interface IContactRes {
  data: IContact[];
  message: string;
  
}