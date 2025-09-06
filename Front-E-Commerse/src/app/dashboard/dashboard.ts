import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TestimonialsService } from '../core/services/testimonials-service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

};


