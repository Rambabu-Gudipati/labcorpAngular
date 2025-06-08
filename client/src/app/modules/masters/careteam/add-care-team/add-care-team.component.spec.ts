import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCareTeamComponent } from './add-care-team.component';

describe('AddCareTeamComponent', () => {
  let component: AddCareTeamComponent;
  let fixture: ComponentFixture<AddCareTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCareTeamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCareTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
