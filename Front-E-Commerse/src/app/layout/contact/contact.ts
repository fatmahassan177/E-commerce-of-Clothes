import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule ,FormGroup,FormControl,Validators} from '@angular/forms';
import { ContactService } from '../../core/services/contact-service';
import { IContact } from '../../core/Interfaces/contact-interface';

@Component({
  selector: 'app-contact',
   providers:[ContactService],
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  contactForm!: FormGroup;
  submitting = false;
 

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.contactForm = new FormGroup({
      FirstName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      LastName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      message: new FormControl('', [Validators.required, Validators.minLength(10)])
    });
  }

  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
   
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.submitting = true;

    const contactData: IContact = this.contactForm.value;

    this.contactService.setContact(contactData).subscribe({
      next: (res) => {

        this.contactForm.reset();
        this.submitting = false;
      },
      error: (err) => {
      
        this.submitting = false;
      }
    });
  }
}
