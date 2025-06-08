import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMentorMappingUsersComponent } from './list-mentor-mapping-users.component';

describe('ListMentorMappingUsersComponent', () => {
  let component: ListMentorMappingUsersComponent;
  let fixture: ComponentFixture<ListMentorMappingUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMentorMappingUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMentorMappingUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
