import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { ICart, ICartItem, ICartRes } from '../Interfaces/cart.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environment/product.environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {


private cartSubject = new BehaviorSubject<ICart>({ items: [], totalPrice: 0 });
  cart$ = this.cartSubject.asObservable();
  private storageKey = 'guest_cart';
  private url = environment.apiURL + '/Cart';

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private get token(): string | null {
    return localStorage.getItem('Token');
  }

  private get isUserLoggedIn(): boolean {
    return !!this.token;
  }

  private loadCart() {
    if (this.isUserLoggedIn) {
      this.http.get<{ data: ICart }>(this.url, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).subscribe(res => {
        if (res?.data) this.cartSubject.next(res.data);
      });
    } else {
      const savedCart = localStorage.getItem(this.storageKey);
      this.cartSubject.next(savedCart ? JSON.parse(savedCart) : { items: [], totalPrice: 0 });
    }
  }

  private saveLocalCart(cart: ICart) {
    cart.totalPrice = cart.items.reduce((acc, i) => acc + i.priceAtAdd * i.quantity, 0);
    this.cartSubject.next(cart);
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
  }

  addToCart(item: ICartItem): Observable<ICart> {
    if (this.isUserLoggedIn) {
      return this.http.post<{ data: ICart }>(this.url, item, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).pipe(
        tap(res => this.cartSubject.next(res.data)),
        map(res => res.data)
      );
    } else {
      const cart = { ...this.cartSubject.value };
      const index = cart.items.findIndex(i => i.productId === item.productId);
      if (index > -1) {
        cart.items[index].quantity += item.quantity;
        cart.items[index].priceAtAdd = item.priceAtAdd;
      } else {
        cart.items.push(item);
      }
      this.saveLocalCart(cart);
      return of(cart);
    }
  }

  updateQuantity(productId: string, action: 'increase' | 'decrease'): Observable<ICart> {
    if (this.isUserLoggedIn) {
      return this.http.put<{ data: ICart }>(this.url, { productId, action }, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).pipe(
        tap(res => this.cartSubject.next(res.data)),
        map(res => res.data)
      );
    } else {
      const cart = { ...this.cartSubject.value };
      const index = cart.items.findIndex(i => i.productId === productId);
      if (index > -1) {
        if (action === 'increase') {
         
          if(cart.items[index].stock && cart.items[index].quantity >= cart.items[index].stock){
            alert('Stock limit reached');
          } else {
            cart.items[index].quantity += 1;
          }
        } else {
          cart.items[index].quantity -= 1;
          if (cart.items[index].quantity <= 0) cart.items.splice(index, 1);
        }
      }
      this.saveLocalCart(cart);
      return of(cart);
    }
  }

  removeItem(productId: string): Observable<ICart> {
    if (this.isUserLoggedIn) {
      return this.http.delete<{ data: ICart }>(`${this.url}/${productId}`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).pipe(
        tap(res => this.cartSubject.next(res.data)),
        map(res => res.data)
      );
    } else {
      const cart = { ...this.cartSubject.value };
      cart.items = cart.items.filter(i => i.productId !== productId);
      this.saveLocalCart(cart);
      return of(cart);
    }
  }

  clearCart(): Observable<ICart> {
    if (this.isUserLoggedIn) {
      return this.http.delete<{ data: ICart }>(`${this.url}/clear`, {
        headers: { Authorization: `Bearer ${this.token}` }
      }).pipe(
        tap(() => this.cartSubject.next({ items: [], totalPrice: 0 })),
        map(() => ({ items: [], totalPrice: 0 }))
      );
    } else {
      localStorage.removeItem(this.storageKey);
      const emptyCart: ICart = { items: [], totalPrice: 0 };
      this.cartSubject.next(emptyCart);
      return of(emptyCart);
    }
  }

  private getHeaders() {
    const token = localStorage.getItem('Token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : ''
    });
  }
 getUserCart() {
    return this.http.get<ICartRes>(this.url, { headers: this.getHeaders() });
  }
  
 
}


