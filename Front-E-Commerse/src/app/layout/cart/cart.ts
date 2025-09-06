import { Component, OnInit } from '@angular/core';
import { ICart, ICartItem } from '../../core/Interfaces/cart.interface';
import { CartService } from '../../core/services/cart-services';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environment/product.environment';
import { combineLatest, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-cart',
  imports: [CommonModule,RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css'
})
export class Cart implements OnInit{

 cart$!: Observable<ICart>;
  StaticURL=environment.uploadsURL

  constructor(public cartService: CartService) {}

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;
  }

  increase(productId: string) {
    this.cartService.updateQuantity(productId, 'increase').subscribe();
  }

  decrease(productId: string) {
    this.cartService.updateQuantity(productId, 'decrease').subscribe();
  }

  remove(productId: string) {
    this.cartService.removeItem(productId).subscribe();
  }

  clear() {
    this.cartService.clearCart().subscribe();
  }
  

}
