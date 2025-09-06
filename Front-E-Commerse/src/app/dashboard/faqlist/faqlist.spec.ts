import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FAQList } from './faqlist';

describe('FAQList', () => {
  let component: FAQList;
  let fixture: ComponentFixture<FAQList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FAQList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FAQList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
