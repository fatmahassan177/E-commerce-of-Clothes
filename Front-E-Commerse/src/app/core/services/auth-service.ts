import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, tap } from 'rxjs';
import { environment } from '../../../environment/product.environment';
import { jwtDecode} from 'jwt-decode'
import { ActivatedRoute, Router, Routes } from '@angular/router';
import { routes } from '../../app.routes';
import { ILogin,IUserData,ILoginRes } from '../Interfaces/user-interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private Token_key='Token'
  constructor(private _http:HttpClient,private _router:Router,private _activatedRoutr:ActivatedRoute){}
  private isAuth =new BehaviorSubject<IUserData|null>(this.isLoggedin())
  private url=environment.apiURL+'/user'
  public isAuth$=this.isAuth.asObservable()
  login(data : ILogin){
   return  this._http.post<ILoginRes>(this.url+'/login',data).pipe(tap(res=>{  /////tap => no change in data inseide
    const Token=res.Token
    this.storeToken(Token)
    const decode=this.decodeToken(Token)
    this.isAuth.next(decode)
    ///loginRouting
    if(decode){
        if(decode.role === 'admin'){
          
          this._router.navigate(['/dashboard'])
        }
        else{
        this._router.navigate(['/home'])
        }
    }
   }))   
  }

 loginRouting(role:string){
  const query=this._activatedRoutr.snapshot.queryParams
  if (query)
   {const isAdminRoute=query['returnUrl'].startsWith('/dashboard')
  const isUserRoute=query['returnUrl'].startsWith('/')
   if(role === 'admin' && isAdminRoute){
    this._router.navigate([query])
   }

   if(role === 'user' && isUserRoute){
    this._router.navigate([query])
   }
   else{
    if(role === 'admin'){
       this._router.navigate(['/dashboard'])
    }
    else{
        this._router.navigate(['/home'])
    }
   }
  
  console.log(query);}
}

  private decodeToken(Token:string):IUserData | null{
    try{
    const decode = jwtDecode<IUserData>(Token)
    if(!decode){
      return  null
    }
    if(decode.exp){
      const expiry=decode.exp *1000
      if(expiry > Date.now() ){
        return decode
      }
    }
    return null
    }
    catch(err){
    return null
    }
     
  }

  private storeToken(Token:string){
    localStorage.setItem(this.Token_key,Token)
  }

   getToken(){
   return localStorage.getItem(this.Token_key)
  }

  logout(){
    localStorage.removeItem(this.Token_key)
    this.isAuth.next(null)
    const routes=this._router.config
    const currentURL=this._router.url
   

  }





  isLoggedin():IUserData | null{
    const Token =this.getToken()
    if(Token){
      const decode=this.decodeToken(Token)
      return decode
    }
    return null
  }
 
  

  isUserLoggedin():boolean{
    const Token =this.getToken()
    if(Token){
      
      return true
    }
    return false
  }

  

}

