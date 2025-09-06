import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth-service';
import { ILogin } from '../../core/Interfaces/user-interface'; 
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink , CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements OnInit {

  constructor(private _authS:AuthService ,private _router:Router){}
    
ngOnInit(): void {
    
}
    loginform=new FormGroup({
       email:new FormControl<string>('',Validators.required),
       password:new FormControl<string>('',Validators.required)
    })
     loading = false;
     successMessage = '';
  errorMessage = '';
    onSubmit(){
       if (!this.loginform.valid) return;

      this.loading = true;
   

    const myValue: ILogin = this.loginform.value as ILogin;

    this._authS.login(myValue).subscribe({
       next: () => {
          this.successMessage = 'login successful! ';
          this.errorMessage = '';
          
        },
        error: (err) => {
          this.errorMessage = 'login failed. Please try again.';
          this.successMessage = '';
           this.loading = false; 
        },
    
    });
    
    }  
}

