import { Injectable } from '@angular/core';
import { environment } from '../../../environment/product.environment';
import { IUserRes ,IUser } from '../Interfaces/user-interface';
import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private _http:HttpClient ,private _router: Router){}

   private url=environment.apiURL+'/user'
    private getHeaders() {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }


  getUsers(){
    
       return this._http.get<IUserRes>(this.url, {
      headers: this.getHeaders()
    })

  }

  CreateUser(data: IUser) {
    return this._http.post(this.url, data)
  }
}
