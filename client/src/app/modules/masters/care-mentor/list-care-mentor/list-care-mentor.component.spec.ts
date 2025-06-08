import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCareMentorComponent } from './list-care-mentor.component';

describe('ListCareMentorComponent', () => {
  let component: ListCareMentorComponent;
  let fixture: ComponentFixture<ListCareMentorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListCareMentorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCareMentorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
