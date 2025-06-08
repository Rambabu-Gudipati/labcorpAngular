import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCareDoctorComponent } from './update-care-doctor.component';

describe('UpdateCareDoctorComponent', () => {
  let component: UpdateCareDoctorComponent;
  let fixture: ComponentFixture<UpdateCareDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCareDoctorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCareDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
