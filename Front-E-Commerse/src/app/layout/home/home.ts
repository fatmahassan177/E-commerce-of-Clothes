import { Component } from '@angular/core';
import { Header } from "../header/header";
import { HomeProduct } from "../home-product/home-product";
import { Testimonials } from '../testimonials/testimonials';

@Component({
  selector: 'app-home',
  imports: [Header, HomeProduct,Testimonials],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
