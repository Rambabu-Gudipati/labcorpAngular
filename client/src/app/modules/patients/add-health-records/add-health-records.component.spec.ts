import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHealthRecordsComponent } from './add-health-records.component';

describe('AddHealthRecordsComponent', () => {
  let component: AddHealthRecordsComponent;
  let fixture: ComponentFixture<AddHealthRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddHealthRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHealthRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
