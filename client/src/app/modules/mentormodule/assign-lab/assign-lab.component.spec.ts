import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignLabComponent } from './assign-lab.component';

describe('AssignLabComponent', () => {
  let component: AssignLabComponent;
  let fixture: ComponentFixture<AssignLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignLabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
