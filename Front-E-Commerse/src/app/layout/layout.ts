import { Component } from '@angular/core';
import { Nav } from './nav/nav';
import { Header } from './header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [Nav,RouterOutlet],
  templateUrl: './layout.html',
    standalone: true,      
   styleUrls: ['./layout.css'] 
})
export class Layout {

}
