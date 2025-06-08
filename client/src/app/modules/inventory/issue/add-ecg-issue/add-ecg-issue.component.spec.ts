import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEcgIssueComponent } from './add-ecg-issue.component';

describe('AddEcgIssueComponent', () => {
  let component: AddEcgIssueComponent;
  let fixture: ComponentFixture<AddEcgIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEcgIssueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEcgIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
