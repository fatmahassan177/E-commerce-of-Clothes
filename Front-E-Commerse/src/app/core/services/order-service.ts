import { Injectable } from '@angular/core';
import { environment } from '../../../environment/product.environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IOrdersRes, IOrder } from '../Interfaces/order-interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private url = environment.apiURL + '/Order';

  constructor(private _http: HttpClient) {}

 
  private getHeaders() {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  getAllOrders() {
    return this._http.get<IOrdersRes>(`${this.url}/all`, {
      headers: this.getHeaders()
    });
  }

  getPendingOrders() {
    return this._http.get<IOrdersRes>(`${this.url}/pending`, {
      headers: this.getHeaders()
    });
  }

  updateOrderStatus(orderId: string, status: string, cancelReason?: string) {
    return this._http.put<{ message: string; data: IOrder }>(
      `${this.url}/status/${orderId}`,
      { status, cancelReason },
      { headers: this.getHeaders() }
    );
  }

createOrder(data: any) {
  return this._http.post(`${this.url}`, data, {
    headers: this.getHeaders()  
  });
}


}
