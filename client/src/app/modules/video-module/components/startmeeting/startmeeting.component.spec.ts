import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartmeetingComponent } from './startmeeting.component';

describe('StartmeetingComponent', () => {
  let component: StartmeetingComponent;
  let fixture: ComponentFixture<StartmeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartmeetingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StartmeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
