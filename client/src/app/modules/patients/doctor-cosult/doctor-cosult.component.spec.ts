import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCosultComponent } from './doctor-cosult.component';

describe('DoctorCosultComponent', () => {
  let component: DoctorCosultComponent;
  let fixture: ComponentFixture<DoctorCosultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorCosultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorCosultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
