import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/product.environment';
import { IFAQ, IFAQRes } from '../Interfaces/faq-interface';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
    constructor(private _http:HttpClient){}
 
    private url=environment.apiURL+'/FAQ'
  private getHeaders() {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }


    getData(){
        return this._http.get<IFAQRes>(this.url, {
      headers: this.getHeaders()
    })
       }

 addFAQ(faq: IFAQ) {
    return this._http.post<IFAQ>(this.url, faq,{
      headers: this.getHeaders()
    });
  }

  
  updateFAQ(id: string, faq: Partial<IFAQ>) {
    return this._http.put<IFAQ>(`${this.url}/${id}`, faq,{
      headers: this.getHeaders()
    });
  }

  
  deleteFAQ(id: string) {
    return this._http.delete(`${this.url}/${id}`,{ headers: this.getHeaders() });
  }


}
