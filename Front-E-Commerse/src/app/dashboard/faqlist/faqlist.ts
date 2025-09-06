
import { Component, OnInit } from '@angular/core';
import { FaqService } from '../../core/services/faq-service'; 
import { IFAQ } from '../../core/Interfaces/faq-interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-faqlist',
  imports: [CommonModule,FormsModule],
  templateUrl: './faqlist.html',
  styleUrl: './faqlist.css'
})
export class FAQList implements OnInit {

 faqs: IFAQ[] = [];
  selectedFAQ: IFAQ | null = null;
  updatedFAQ: any = {};
  isAddModalOpen = false;
  newFAQ: Partial<IFAQ> = {};

  constructor(private faqService: FaqService) {}

  ngOnInit(): void {
    this.fetchFAQs();
  }

  fetchFAQs() {
    this.faqService.getData().subscribe({
      next: (res) => {
        this.faqs = res.data;
      }
    });
  }

 
  openAddModal() {
    this.newFAQ = {};
    this.isAddModalOpen = true;
  }

  closeAddModal() {
    this.isAddModalOpen = false;
  }

  saveNewFAQ() {
    if (!this.newFAQ.question || !this.newFAQ.answer) {
      alert('Please fill in both fields.');
      return;
    }

    this.faqService.addFAQ(this.newFAQ as IFAQ).subscribe({
      next: () => {
        this.fetchFAQs();
        this.closeAddModal();
      }
    });
  }


  openUpdateModal(faq: IFAQ) {
    this.selectedFAQ = faq;
    this.updatedFAQ = { ...faq };
  }

  closeModal() {
    this.selectedFAQ = null;
  }

  saveUpdate() {
    if (!this.selectedFAQ) return;

    this.faqService.updateFAQ(this.selectedFAQ._id!, this.updatedFAQ).subscribe({
      next: () => {
        this.fetchFAQs();
        this.closeModal();
      }
    });
  }


  deleteFAQ(id: string) {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      this.faqService.deleteFAQ(id).subscribe({
        next: () => this.fetchFAQs()
      });
    }
  }
}
