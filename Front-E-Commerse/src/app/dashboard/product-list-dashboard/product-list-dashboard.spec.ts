import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListDashboard } from './product-list-dashboard';

describe('ProductListDashboard', () => {
  let component: ProductListDashboard;
  let fixture: ComponentFixture<ProductListDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductListDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductListDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
