

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../core/services/contact-service'; 
import { IContact, IContactRes } from '../../core/Interfaces/contact-interface';

@Component({
  selector: 'app-contact-list-dashboard',
  standalone: true,
  imports: [CommonModule],
 templateUrl: './contact-list.html',
  styleUrl: './contact-list.css'
})
export class ContactList {
  contacts: IContact[] = [];

  constructor(private contactService: ContactService) {}

  ngOnInit() {
    this.fetchContacts();
  }

  fetchContacts() {

  this.contactService.getData().subscribe({
    next: (res: any) => {  
      this.contacts = res.data 
    },
  });
}

  
deleteMessage(id: string) {
  if (confirm('Are you sure you want to delete this message?')) {
    this.contactService.deleteMessage(id).subscribe({
      next: (res) => {
        this.fetchContacts();
      },
    });
  }
}

}
