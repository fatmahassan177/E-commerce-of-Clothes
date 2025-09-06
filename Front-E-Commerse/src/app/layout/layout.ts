import { Component } from '@angular/core';
import { Nav } from './nav/nav';
import { Header } from './header/header';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./footer/footer";

@Component({
  selector: 'app-layout',
  imports: [Nav, RouterOutlet, Footer],
  templateUrl: './layout.html',
    standalone: true,      
   styleUrls: ['./layout.css'] 
})
export class Layout {

}
