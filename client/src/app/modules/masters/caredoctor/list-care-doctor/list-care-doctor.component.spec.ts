import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCareDoctorComponent } from './list-care-doctor.component';

describe('ListCareDoctorComponent', () => {
  let component: ListCareDoctorComponent;
  let fixture: ComponentFixture<ListCareDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCareDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCareDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
