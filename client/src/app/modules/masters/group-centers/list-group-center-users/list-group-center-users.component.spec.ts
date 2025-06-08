import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGroupCenterUsersComponent } from './list-group-center-users.component';

describe('ListGroupCenterUsersComponent', () => {
  let component: ListGroupCenterUsersComponent;
  let fixture: ComponentFixture<ListGroupCenterUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListGroupCenterUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListGroupCenterUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
