import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListYearlyScreenComponent } from './list-yearly-screen.component';

describe('ListYearlyScreenComponent', () => {
  let component: ListYearlyScreenComponent;
  let fixture: ComponentFixture<ListYearlyScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListYearlyScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListYearlyScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
