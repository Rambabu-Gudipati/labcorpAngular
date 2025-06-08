import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCareTeamComponent } from './list-care-team.component';

describe('ListCareTeamComponent', () => {
  let component: ListCareTeamComponent;
  let fixture: ComponentFixture<ListCareTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCareTeamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListCareTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
