import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth-service';
import { Router } from '@angular/router';
import { IAddress,IUserData } from '../../core/Interfaces/user-interface';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
user: IUserData | null = null;
  

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    
    this.user = this.authService.isLoggedin();
    if (!this.user) {
     
      this.router.navigate(['/login']);
      return;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
