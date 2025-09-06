import { Injectable } from '@angular/core';
import { environment } from '../../../environment/product.environment';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { ITestimonials, ITestimonialsRes } from '../Interfaces/testimonials-interface';

@Injectable({
  providedIn: 'root'
})
export class TestimonialsService {
    constructor(private _http:HttpClient){}
 
    private url=environment.apiURL+'/Testimonial'
    private getHeaders() {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

    getData(){
        return this._http.get<ITestimonialsRes>(this.url+'/approved')
       }

       getUnseen() {
    return this._http.get<ITestimonialsRes>(this.url + '/unseen', {
      headers: this.getHeaders()
    });
  }

  getSeen() {
    return this._http.get<ITestimonialsRes>(this.url + '/seen', {
      headers: this.getHeaders()
    });
  }

  getUnapproved() {
    return this._http.get<ITestimonialsRes>(this.url + '/unapproved', {
      headers: this.getHeaders()
    });
  }

  approve(id: string) {
    return this._http.put<{ message: string }>(this.url + `/approve/${id}`, {}, {
      headers: this.getHeaders()
    });
  }

  markAsSeen(id: string) {
    return this._http.put<{ message: string }>(this.url + `/seen/${id}`, {}, {
      headers: this.getHeaders()
    });
  }

  delete(id: string) {
    return this._http.delete<{ message: string }>(this.url + `/${id}`, {
      headers: this.getHeaders()
    });
  }

  getUnseenCount() {
  return this._http.get<{ count: number }>(this.url + '/unseen', {
      headers: this.getHeaders()
    });
}
}
