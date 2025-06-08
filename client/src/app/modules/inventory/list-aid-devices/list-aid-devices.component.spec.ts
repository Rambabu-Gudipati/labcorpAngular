import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAidDevicesComponent } from './list-aid-devices.component';

describe('ListAidDevicesComponent', () => {
  let component: ListAidDevicesComponent;
  let fixture: ComponentFixture<ListAidDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAidDevicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListAidDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
