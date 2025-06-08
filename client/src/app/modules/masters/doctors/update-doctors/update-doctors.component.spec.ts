import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDoctorsComponent } from './update-doctors.component';

describe('UpdateDoctorsComponent', () => {
  let component: UpdateDoctorsComponent;
  let fixture: ComponentFixture<UpdateDoctorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDoctorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
