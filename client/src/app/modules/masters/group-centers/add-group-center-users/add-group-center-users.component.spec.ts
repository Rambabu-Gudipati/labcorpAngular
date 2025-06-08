import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGroupCenterUsersComponent } from './add-group-center-users.component';

describe('AddGroupCenterUsersComponent', () => {
  let component: AddGroupCenterUsersComponent;
  let fixture: ComponentFixture<AddGroupCenterUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddGroupCenterUsersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddGroupCenterUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
