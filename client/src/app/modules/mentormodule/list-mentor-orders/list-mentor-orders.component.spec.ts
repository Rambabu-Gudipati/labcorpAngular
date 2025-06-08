import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListMentorOrdersComponent } from './list-mentor-orders.component';

describe('ListMentorOrdersComponent', () => {
  let component: ListMentorOrdersComponent;
  let fixture: ComponentFixture<ListMentorOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListMentorOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListMentorOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
