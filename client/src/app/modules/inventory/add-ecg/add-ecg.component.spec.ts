import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEcgComponent } from './add-ecg.component';

describe('AddEcgComponent', () => {
  let component: AddEcgComponent;
  let fixture: ComponentFixture<AddEcgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEcgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEcgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
