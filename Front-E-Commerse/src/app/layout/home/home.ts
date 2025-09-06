import { Component } from '@angular/core';
import { Header } from "../header/header";
import { HomeProduct } from "../home-product/home-product";
import { Testimonials } from '../testimonials/testimonials';
import { Footer } from "../footer/footer";
import { FAQ } from "../faq/faq";
import { Contact } from "../contact/contact";

@Component({
  selector: 'app-home',
  imports: [Header, HomeProduct, Testimonials, Footer, FAQ, Contact],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
