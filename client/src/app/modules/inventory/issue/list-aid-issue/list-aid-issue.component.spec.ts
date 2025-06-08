import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAidIssueComponent } from './list-aid-issue.component';

describe('ListAidIssueComponent', () => {
  let component: ListAidIssueComponent;
  let fixture: ComponentFixture<ListAidIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAidIssueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListAidIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
