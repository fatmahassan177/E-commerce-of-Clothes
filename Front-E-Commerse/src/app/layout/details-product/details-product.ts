
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../../core/services/product-service';
import { IProduct } from '../../core/Interfaces/product-interface';
import { environment } from '../../../environment/product.environment';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details-product',
  standalone: true,
  templateUrl: './details-product.html',
  imports: [CommonModule, RouterLink],
  styleUrl: './details-product.css'
})
export class DetailsProduct implements OnInit, OnDestroy {
  product!: IProduct;
  relatedProducts: IProduct[] = [];
  staticURL = environment.uploadsURL + '/';
  private subscription = new Subscription();

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
  ) { this.router.routeReuseStrategy.shouldReuseRoute = () => false;}
 

  ngOnInit(): void {
    
    const myProduct = this.route.snapshot.data['Product'];
    this.product = myProduct?.data;
    console.log('Main product:', this.product);

    const sub = this.route.paramMap.subscribe(params => {
      const slug = params.get('route');
      if (slug) {
        const relatedSub = this.productService.getRelatedProducts(slug).subscribe({
          next: res => {
            this.relatedProducts = res.data;
          },
          error: err => console.error('Error fetching related products:', err)
        });

        this.subscription.add(relatedSub);
      }
    });

    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
