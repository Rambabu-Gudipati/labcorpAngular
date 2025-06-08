import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHealthDetailsComponent } from './create-health-details.component';

describe('CreateHealthDetailsComponent', () => {
  let component: CreateHealthDetailsComponent;
  let fixture: ComponentFixture<CreateHealthDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateHealthDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateHealthDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
