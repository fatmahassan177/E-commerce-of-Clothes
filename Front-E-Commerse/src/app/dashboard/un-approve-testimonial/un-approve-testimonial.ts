import { Component } from '@angular/core';
import { TestimonialsService } from '../../core/services/testimonials-service';
import { ITestimonials } from '../../core/Interfaces/testimonials-interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environment/product.environment';

@Component({
  selector: 'app-un-approve-testimonial',
  imports: [CommonModule,FormsModule],
  templateUrl: './un-approve-testimonial.html',
  styleUrl: './un-approve-testimonial.css'
})
export class UnApproveTestimonial {
    testimonials: ITestimonials[] = [];
    loading = true;
    error = '';
    StaticURL = environment.uploadsURL
  
    constructor(private _testimonialsS: TestimonialsService) {}
  
    ngOnInit(): void {
      this.fetchTestimonials();
    }
  
    fetchTestimonials() {
      this.loading = true;
      this._testimonialsS.getUnapproved().subscribe({
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
  
  
    approve(id: string) {
      this._testimonialsS.approve(id).subscribe(() => {
        this.testimonials = this.testimonials.filter(t => t._id !== id);
      });
    }
  
    delete(id: string) {
      if (confirm('Are you sure you want to delete this testimonial?')) {
        this._testimonialsS.delete(id).subscribe(() => {
          this.testimonials = this.testimonials.filter(t => t._id !== id);
        });
      }
    }
}
