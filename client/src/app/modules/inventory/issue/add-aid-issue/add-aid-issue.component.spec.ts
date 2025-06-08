import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAidIssueComponent } from './add-aid-issue.component';

describe('AddAidIssueComponent', () => {
  let component: AddAidIssueComponent;
  let fixture: ComponentFixture<AddAidIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAidIssueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddAidIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
