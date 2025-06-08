import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SosReportsComponent } from './sos-reports.component';

describe('SosReportsComponent', () => {
  let component: SosReportsComponent;
  let fixture: ComponentFixture<SosReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SosReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SosReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
