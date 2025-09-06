import { Component } from '@angular/core';
 import { IFAQ, IFAQRes } from '../../core/Interfaces/faq-interface';
import { FaqService } from '../../core/services/faq-service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-faq',
 providers: [FaqService],
 imports:[CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.css'
})
export class FAQ {
 faqList: IFAQ[]=[] ;
  selectedIndex: number | null = null;
 
 

  constructor(private _faqService: FaqService) {}

  ngOnInit(): void {
    this.loadFAQs();
  }

  loadFAQs() {
    this._faqService.getData().subscribe({
      next: (res) => {
        this.faqList=res.data
      
      },
      
    });
  }

  toggleFAQ(index: number) {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }
}
