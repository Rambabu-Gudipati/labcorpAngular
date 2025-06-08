import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEcgIssueComponent } from './list-ecg-issue.component';

describe('ListEcgIssueComponent', () => {
  let component: ListEcgIssueComponent;
  let fixture: ComponentFixture<ListEcgIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEcgIssueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListEcgIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
