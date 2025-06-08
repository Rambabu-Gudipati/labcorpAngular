import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEcgComponent } from './list-ecg.component';

describe('ListEcgComponent', () => {
  let component: ListEcgComponent;
  let fixture: ComponentFixture<ListEcgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEcgComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListEcgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
