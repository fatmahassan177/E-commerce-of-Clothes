import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product-service';
import {  IProduct, IProductsRes } from '../../core/Interfaces/product-interface';
import { environment } from '../../../environment/product.environment';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home-product',
  imports: [CommonModule, RouterLink],
  templateUrl: './home-product.html',
  styleUrl: './home-product.css'
})
export class HomeProduct implements OnInit {
  constructor(private _productS:ProductService){}
 products!:IProduct[]
  staticURL=environment.uploadsURL
 limit: number = 4; 
 ngOnInit(): void {
 
       this._productS.getAllProduct().subscribe(res=>{
        this.products=res.data
       })
     
 }
}
