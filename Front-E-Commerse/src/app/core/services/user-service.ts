import { Injectable } from '@angular/core';
import { environment } from '../../../environment/product.environment';
import { IUserRes ,IUser } from '../Interfaces/user-interface';
import { HttpClient  } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private _http:HttpClient ,private _router: Router){}

   private url=environment.apiURL+'/user'

  getUsers(){
    
       return this._http.get<IUserRes>(this.url)

  }

  CreateUser(data: IUser) {
    return this._http.post(this.url, data)
  }
}
