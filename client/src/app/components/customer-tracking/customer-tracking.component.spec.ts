import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTrackingComponent } from './customer-tracking.component';

describe('CustomerTrackingComponent', () => {
  let component: CustomerTrackingComponent;
  let fixture: ComponentFixture<CustomerTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
