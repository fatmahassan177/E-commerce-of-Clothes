import { Component } from '@angular/core';
import{ITestimonials}from '../../core/Interfaces/testimonials-interface'
import { TestimonialsService } from '../../core/services/testimonials-service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-testimonials',
  providers:[TestimonialsService],
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css'
})
export class Testimonials {
  testimonials: ITestimonials[] = [];
  loading = false;
  error = '';

  constructor(private testimonialsService: TestimonialsService) {}

  ngOnInit(): void {
    this.loadTestimonials();
  }

  loadTestimonials(): void {
    this.loading = true;
    this.testimonialsService.getData().subscribe({
      next: (data) => {
        this.testimonials =data.data
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load testimonials';
        this.loading = false;
        console.error('Error loading testimonials:', error);
      }
    });
  }

  getStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('fas fa-star'); 
      } else {
        stars.push('far fa-star'); 
      }
    }
    return stars;
  }
}
