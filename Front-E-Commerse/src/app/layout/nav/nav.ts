import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart-services';

@Component({
  selector: 'app-nav',
  
  imports: [RouterLink,CommonModule],
    standalone: true,
  templateUrl: './nav.html',
  styleUrl: './nav.css'
})
export class Nav {
   logedin = false;
  name = '';
  
  constructor(private _authS: AuthService,private cartService: CartService) {}

  ngOnInit(): void {
    
    this._authS.isAuth$.subscribe(res => {
      this.logedin = !!res;
      this.name = res?.name || '';
    });
  }

  logout(event: Event): void {
    event.preventDefault();
    this._authS.logout(); 
    localStorage.removeItem('userId'); 
  this.cartService.clearCart();       
  }
}



