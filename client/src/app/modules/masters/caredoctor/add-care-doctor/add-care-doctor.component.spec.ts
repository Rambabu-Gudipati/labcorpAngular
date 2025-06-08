import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCareDoctorComponent } from './add-care-doctor.component';

describe('AddCareDoctorComponent', () => {
  let component: AddCareDoctorComponent;
  let fixture: ComponentFixture<AddCareDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCareDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCareDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
