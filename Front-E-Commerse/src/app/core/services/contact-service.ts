import { HttpClient ,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/product.environment';
import { IContact,IContactRes} from '../Interfaces/contact-interface';

HttpClient
@Injectable({
  providedIn: 'root'
})
export class ContactService {
   constructor(private _http:HttpClient){
   }
   
    private url=environment.apiURL+'/contact'
      private getHeaders() {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

   getData(){
    return this._http.get<IContactRes>(this.url, {
      headers: this.getHeaders()
    })
   }

  setContact(contact:IContact) {
return this._http.post<IContact>(this.url,contact);
  }

   getUnseenMessages() {
    return this._http.get<IContactRes>(`${this.url}/unseen`, {
      headers: this.getHeaders()
    });
  }

 


  markAsSeen(id: string) {
    return this._http.put<IContact>(`${this.url}/${id}`, {
      headers: this.getHeaders()
    } ,{});
  }

  deleteMessage(id: string) {
    return this._http.delete(`${this.url}/${id}`, { headers: this.getHeaders() });
  }
  
  


}
