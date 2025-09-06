import { Component } from '@angular/core';
import { FormGroup ,Validators,FormControl, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user-service';
import { IUser } from '../../core/Interfaces/user-interface';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone:true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register {
 registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    street: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    governorate: new FormControl('', Validators.required),
    agreeTerms: new FormControl(false, Validators.requiredTrue)
  });

  governorates = [
    'Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Sharqia', 'Qalyubia', 'Kafr El Sheikh',
    'Gharbia', 'Monufia', 'Beheira', 'Ismailia', 'Suez', 'Port Said', 'Damietta',
    'Fayoum', 'Beni Suef', 'Minya', 'Assiut', 'Sohag', 'Qena', 'Luxor', 'Aswan',
    'Red Sea', 'New Valley', 'Matrouh', 'North Sinai', 'South Sinai'
  ];

  showPassword = false;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.loading = true;
      const formValue = this.registerForm.value;
      const userData = {
        name: formValue.name!,
        email: formValue.email!,
        password: formValue.password!,
        address: {
          street: formValue.street!,
          city: formValue.city!,
          governorate: formValue.governorate!
        },
       
      };

      this.userService.CreateUser(userData).subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Redirecting to login...';
          this.errorMessage = '';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          this.errorMessage = 'Registration failed. Please try again.';
          this.successMessage = '';
           this.loading = false; 
        },
       
      });
    }
  }
}