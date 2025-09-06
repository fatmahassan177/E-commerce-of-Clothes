import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnApproveTestimonial } from './un-approve-testimonial';

describe('UnApproveTestimonial', () => {
  let component: UnApproveTestimonial;
  let fixture: ComponentFixture<UnApproveTestimonial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnApproveTestimonial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnApproveTestimonial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
