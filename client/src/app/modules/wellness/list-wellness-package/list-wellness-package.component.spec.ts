import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListWellnessPackageComponent } from './list-wellness-package.component';

describe('ListWellnessPackageComponent', () => {
  let component: ListWellnessPackageComponent;
  let fixture: ComponentFixture<ListWellnessPackageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListWellnessPackageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListWellnessPackageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
