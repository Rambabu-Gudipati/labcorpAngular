import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListLabComponent } from './list-lab.component';

describe('ListLabComponent', () => {
  let component: ListLabComponent;
  let fixture: ComponentFixture<ListLabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListLabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
