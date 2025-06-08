import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddYearlyscreenTestComponent } from './add-yearlyscreen-test.component';

describe('AddYearlyscreenTestComponent', () => {
  let component: AddYearlyscreenTestComponent;
  let fixture: ComponentFixture<AddYearlyscreenTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddYearlyscreenTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddYearlyscreenTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
