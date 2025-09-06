import { Component } from '@angular/core';
import { environment } from '../../../environment/product.environment';
import { TestimonialsService } from '../../core/services/testimonials-service';
import { ITestimonials } from '../../core/Interfaces/testimonials-interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-unseen-testimonial',
  providers:[TestimonialsService],
  imports: [CommonModule,FormsModule],
  templateUrl: './unseen-testimonial.html',
  styleUrl: './unseen-testimonial.css'
})
export class UnseenTestimonial {
    testimonials: ITestimonials[] = [];
  loading = true;
  error = '';
  StaticURL = environment.uploadsURL

  constructor(private testimonialsService: TestimonialsService) {}

  ngOnInit(): void {
    this.fetchTestimonials();
  }

  fetchTestimonials() {
    this.loading = true;
    this.testimonialsService.getUnseen().subscribe({
      next: (res) => {
        this.testimonials = res.data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load testimonials';
        this.loading = false;
      }
    });
  }

  markAsSeen(id: string) {
    this.testimonialsService.markAsSeen(id).subscribe(() => {
      this.testimonials = this.testimonials.filter(t => t._id !== id);
    });
  }

 

  delete(id: string) {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      this.testimonialsService.delete(id).subscribe(() => {
        this.testimonials = this.testimonials.filter(t => t._id !== id);
      });
    }
  }
}
