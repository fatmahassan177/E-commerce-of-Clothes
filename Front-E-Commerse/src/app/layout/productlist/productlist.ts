import { Component, NgModule, OnInit, signal } from '@angular/core';
import { ProductService } from '../../core/services/product-service';
import { IProduct ,IProductsRes } from '../../core/Interfaces/product-interface';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environment/product.environment';
import { debounceTime, distinctUntilChanged, Observable, Subscribable } from 'rxjs';
import { ICategory } from '../../core/Interfaces/category-interface';
import { CartService } from '../../core/services/cart-services';
import { ICart, ICartItem } from '../../core/Interfaces/cart.interface';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-productlist',
  imports: [CommonModule,FormsModule,ReactiveFormsModule,RouterLink],
  templateUrl: './productlist.html',
  styleUrl: './productlist.css'
})
export class Productlist implements OnInit{

products!: IProduct[];
  allProducts!: IProduct[];
  categories: ICategory[] = [];
  staticURL = environment.uploadsURL;
  cart$!: Observable<ICart>;


  filterForm!: FormGroup;

  constructor(
    private _productS: ProductService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.initFilterForm();
    this.cart$ = this.cartService.cart$;
  }

  loadProducts() {
    this._productS.getAllProduct().subscribe(res => {
      this.products = res.data;
      this.allProducts = res.data;
    });
  }

  loadCategories() {
    this._productS.getCategories().subscribe(res => {
      this.categories = res.data;
    });
  }

initFilterForm() {
  this.filterForm = new FormGroup({
    keyword: new FormControl(''),
    category: new FormControl(''),
    gender: new FormControl(''),
    stockStatus: new FormControl(''),
    sortBy: new FormControl('createdAt'),
    order: new FormControl('asc')
  });

 
  this.filterForm.valueChanges.subscribe(() => {
    this.applyFilters();
  });
}


  applyFilters() {
  const { keyword, category, gender, stockStatus, sortBy, order } = this.filterForm.value;

  let filtered = [...this.allProducts]; 


  if (keyword) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(keyword.toLowerCase()));
  }


  if (category) filtered = filtered.filter(p => p.category._id === category);
  if (gender) filtered = filtered.filter(p => p.category.gender === gender);
  if (stockStatus) filtered = filtered.filter(p => p.stockStatus === stockStatus);

  filtered.sort((a, b) => {
    const multiplier = order === 'desc' ? -1 : 1;
    if (sortBy === 'price') return multiplier * (a.price - b.price);
    if (sortBy === 'title') return multiplier * a.title.localeCompare(b.title);
    return 0;
  });


  this.products = filtered;
}


  applyOtherFilters() {
    const { category, gender, stockStatus } = this.filterForm.value;
    this.products = this.products.filter(p => {
      let ok = true;
      if (category) ok = ok && p.category._id === category;
      if (gender) ok = ok && p.category.gender === gender;
      if (stockStatus) ok = ok && p.stockStatus === stockStatus;
      return ok;
    });
  }

  getSorted(sortBy: string, order: 'asc' | 'desc') {
    this._productS.getSortedProducts(sortBy, order).subscribe(res => {
      this.products = res.data;
    });
  }

  addOrRemoveFromCart(product: IProduct, cart: ICart | null) {
    if (!cart) return;
    const inCart = cart.items.some(i => i.productId === product._id);

    if (inCart) {
      this.cartService.removeItem(product._id)?.subscribe();
    } else {
      if (product.stockStatus === 'Out of Stock') {
        alert('Out of stock!');
        return;
      }

      this.cartService.addToCart({
        productId: product._id,
        productName: product.title,
        priceAtAdd: product.price,
        quantity: 1,
        stockStatus: product.stockStatus,
        imgurl: product.imgurl,
        stock: product.stock
      })?.subscribe();
    }
  }

  isInCart(productId: string, cart: ICart | null): boolean {
    if (!cart) return false;
    return cart.items.some(i => i.productId === productId);
  }
}
  






