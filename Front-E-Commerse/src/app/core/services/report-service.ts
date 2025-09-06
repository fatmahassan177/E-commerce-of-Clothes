import { HttpClient,HttpParams,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/product.environment';
import { ISalesReportRes } from '../Interfaces/report-interface';
@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private url = environment.apiURL + '/Order/report';

  constructor(private _http: HttpClient) {}
private getHeaders() {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

   
getReport(startDate?: string, endDate?: string) {
  let params = new HttpParams();
  if (startDate) params = params.set('startDate', startDate);
  if (endDate) params = params.set('endDate', endDate);

  return this._http.get<ISalesReportRes>(this.url, {
    headers: this.getHeaders(),
    params: params  
  });
}

}
