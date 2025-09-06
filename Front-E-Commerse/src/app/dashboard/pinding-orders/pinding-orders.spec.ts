import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PindingOrders } from './pinding-orders';

describe('PindingOrders', () => {
  let component: PindingOrders;
  let fixture: ComponentFixture<PindingOrders>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PindingOrders]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PindingOrders);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
