import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProduct } from './home-product';

describe('HomeProduct', () => {
  let component: HomeProduct;
  let fixture: ComponentFixture<HomeProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
