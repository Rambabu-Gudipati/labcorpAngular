import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDoctorConsultationComponent } from './list-doctor-consultation.component';

describe('ListDoctorConsultationComponent', () => {
  let component: ListDoctorConsultationComponent;
  let fixture: ComponentFixture<ListDoctorConsultationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListDoctorConsultationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDoctorConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
