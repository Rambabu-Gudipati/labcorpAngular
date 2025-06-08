import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAidDevicesComponent } from './add-aid-devices.component';

describe('AddAidDevicesComponent', () => {
  let component: AddAidDevicesComponent;
  let fixture: ComponentFixture<AddAidDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAidDevicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAidDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
