

import { Component, OnInit, TrackByFunction } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ProductService } from '../../core/services/product-service';
import { IProduct } from '../../core/Interfaces/product-interface';
import { ICategory, ICategoriesRes } from '../../core/Interfaces/category-interface';
import { environment } from '../../../environment/product.environment';

declare var bootstrap: any;

@Component({
  selector: 'app-product-list-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-list-dashboard.html',
  styleUrls: ['./product-list-dashboard.css']
})
export class ProductListDashboard  {
  
 products: IProduct[] = [];
  categories: ICategory[]= [];
  productForm!: FormGroup;
  selectedFile: File | null = null;
  isEditMode = false;
  apiBase = environment.apiURL;
  
currentProductId: string | null = null;



  constructor(private fb: FormBuilder, private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
    this.initForm();
  }



  onFileSelected(event: any) {
  if (event.target.files && event.target.files.length > 0) {
    this.selectedFile = event.target.files[0];
  }
}

  initForm() {
    this.productForm = this.fb.group({
      _id: [''],
      title: ['', Validators.required],
      desc: ['', Validators.required],
      price: [0, Validators.required],
      route: ['', Validators.required],
      stock: [0, Validators.required],
      category: ['', Validators.required]
    });
  }

  loadProducts() {
    this.productService.getAllProduct().subscribe({
      next: (res) => (this.products = res.data),
      error: (err) => console.error(err)
    });
  }

  loadCategories() {
    this.productService.getCategories().subscribe({
      next: (res) => (this.categories = res.data),
      error: (err) => console.error(err)
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
  if (this.productForm.invalid) return;

  const formValue = this.productForm.value;
  const formData = new FormData();

  formData.append('title', formValue.title);
  formData.append('desc', formValue.desc);
  formData.append('price', formValue.price.toString());
  formData.append('route', formValue.route);
  formData.append('stock', formValue.stock.toString());
  formData.append('gender', formValue.gender);


  if (typeof formValue.category === 'object') {
    formData.append('category', formValue.category._id);
  } else {
    formData.append('category', formValue.category);
  }

 
  if (this.selectedFile) {
    formData.append('img', this.selectedFile);
  }

  if (this.isEditMode && this.currentProductId) {
    
    this.productService.updateProduct(this.currentProductId, formData).subscribe({
      next: (res) => {
        console.log('Product updated:', res);
        this.resetForm();
        this.loadProducts();
      },
      error: (err) => {
        console.error('Update error:', err);
      }
    });
  } else {
  
    this.productService.addProduct(formData).subscribe({
      next: (res) => {
        console.log('Product added:', res);
        this.resetForm();
        this.loadProducts();
      },
      error: (err) => {
        console.error('Add error:', err);
      }
    });
  }
}

editProduct(product: IProduct) {
  this.isEditMode = true;
  this.currentProductId = product._id;

  this.productForm.patchValue({
    title: product.title,
    desc: product.desc,
    price: product.price,
    route: product.route,
    stock: product.stock,
    gender: product.category?.gender,
    category: product.category?._id 
  });

  this.selectedFile = null; 
}


  deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return;
    this.productService.deleteProduct(id).subscribe({
      next: () => this.loadProducts(),
      error: (err) => console.error(err)
    });
  }

  resetForm() {
    this.isEditMode = false;
    this.productForm.reset();
    this.selectedFile = null;
  }


  
}







