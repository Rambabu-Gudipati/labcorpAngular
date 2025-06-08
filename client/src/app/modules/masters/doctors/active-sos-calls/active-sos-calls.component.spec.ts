import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveSosCallsComponent } from './active-sos-calls.component';

describe('ActiveSosCallsComponent', () => {
  let component: ActiveSosCallsComponent;
  let fixture: ComponentFixture<ActiveSosCallsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveSosCallsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ActiveSosCallsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
