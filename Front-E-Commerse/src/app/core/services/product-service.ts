
import { HttpClient, HttpHeaders ,HttpParams} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environment/product.environment';
import { IProductsRes, IProduct} from '../Interfaces/product-interface';
import { ICategoriesRes } from '../Interfaces/category-interface';
import { catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

 
 
  constructor(private _http: HttpClient) {}

  private url = environment.apiURL + '/product';
  private categoryUrl = environment.apiURL + '/category';


private getAuthHeaders() {
  const token = localStorage.getItem('Token'); 
  return {
    Authorization: `Bearer ${token}`
  };
}



  getAllProduct() {
    return this._http.get<IProductsRes>(this.url).pipe(
      tap((res) => console.log('Products Response:', res)),
      catchError((err) => {
        console.error('Error fetching products:', err);
        return throwError(() => new Error('Failed to load products'));
      })
    );
  }



  addProduct(product: FormData) {
    return this._http.post<IProduct>(this.url, product, { headers: this.getAuthHeaders() })
  }






updateProduct(id: string, formData: FormData) {
  return this._http.put(`${this.url}/${id}`, formData,{
    headers: this.getAuthHeaders()
  });
}



  deleteProduct(id: string) {
    return this._http.delete(`${this.url}/${id}`, 
      { headers: this.getAuthHeaders() })
  }
 


  searchProducts(keyword: string){
    const params = new HttpParams().set('q', keyword);
    return this._http.get<IProductsRes>(`${this.url}/search`, { params });
  }

  filterProducts(filters: {
    category?: string;
    gender?: string;
    stockStatus?: string;
  }){
    let params = new HttpParams();
    if (filters.category) params = params.set('category', filters.category);
    if (filters.gender) params = params.set('gender', filters.gender);
    if (filters.stockStatus) params = params.set('stockStatus', filters.stockStatus);
    return this._http.get<IProductsRes>(`${this.url}/filter`, { params });
  }

  getSortedProducts(sortBy: string, order: 'asc' | 'desc'){
    const params = new HttpParams().set('sortby', sortBy).set('order', order);
    return this._http.get<IProductsRes>(`${this.url}/sorted`, { params });
  }



  getCategories(gender?: string) {
    let params = new HttpParams();
    if (gender) params = params.set('gender', gender);
    return this._http.get<ICategoriesRes>(this.categoryUrl, { params });
  }

  getRelatedProducts(route:string){
    return this._http.get<IProductsRes>(this.url+`/related/${route}`)
   }

   getProductByRoute(route:string){
     return this._http.get<IProductsRes>(this.url + `/${route}`)
   }
}
