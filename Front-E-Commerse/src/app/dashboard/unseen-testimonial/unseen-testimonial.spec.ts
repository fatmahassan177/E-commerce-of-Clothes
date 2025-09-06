import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnseenTestimonial } from './unseen-testimonial';

describe('UnseenTestimonial', () => {
  let component: UnseenTestimonial;
  let fixture: ComponentFixture<UnseenTestimonial>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnseenTestimonial]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnseenTestimonial);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
