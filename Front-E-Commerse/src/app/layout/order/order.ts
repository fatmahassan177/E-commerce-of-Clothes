import { Component, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart-services';
import { Router } from '@angular/router';
import { OrderService } from '../../core/services/order-service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICart } from '../../core/Interfaces/cart.interface';

@Component({
  selector: 'app-order',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './order.html',
  styleUrl: './order.css'
})
export class Order implements OnInit {
 orderForm!: FormGroup;
  cart!: ICart | null;
orderError: any;
orderSuccess: any;

  constructor(
    private _orderS: OrderService,
    private _cartS: CartService
  ) {}

  ngOnInit(): void {
    
    this.orderForm = new FormGroup({
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      governorate: new FormControl('', Validators.required)
    });

    
    this._cartS.getUserCart().subscribe({
      next: (res) => {
        this.cart = res.data;
      },
      error: (err) => console.error(err.message)
    });
  }

  submitOrder() {
    if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }

    if (this.orderForm.invalid) {
      alert('Please complete your address');
      return;
    }

    const formData = new FormData();
    formData.append('address[street]', this.orderForm.value.street);
    formData.append('address[city]', this.orderForm.value.city);
    formData.append('address[governorate]', this.orderForm.value.governorate);

 
    formData.append('cart', JSON.stringify(this.cart));

    this._orderS.createOrder({
  cart: this.cart,
  address: this.orderForm.value
}).subscribe({
      next: (res) => {     
        alert('Order placed successfully');
      }
    });
  }
}
