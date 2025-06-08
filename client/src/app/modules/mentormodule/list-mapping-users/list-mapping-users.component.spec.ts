import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMappingUsersComponent } from './list-mapping-users.component';

describe('ListMappingUsersComponent', () => {
  let component: ListMappingUsersComponent;
  let fixture: ComponentFixture<ListMappingUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMappingUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMappingUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
