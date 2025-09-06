import { IUser } from "./user-interface"

export interface ITestimonials {
    _id:string
    userId:IUser
    rating:number
    comment:string
}
export interface ITestimonialsRes {
     data:ITestimonials[]
     message:string
}
