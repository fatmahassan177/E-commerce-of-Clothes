import { Component } from '@angular/core';
import { UserService } from '../../core/services/user-service';
import { IUser } from '../../core/Interfaces/user-interface';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-user-data',
  imports: [CommonModule],
  templateUrl: './user-data.html',
  styleUrl: './user-data.css'
})
export class UserData {
users: IUser[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private _userS: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this._userS.getUsers().subscribe({
      next: (res) => {
        this.users = res.data;
        this.loading = false;
      }
    });
  }
}
