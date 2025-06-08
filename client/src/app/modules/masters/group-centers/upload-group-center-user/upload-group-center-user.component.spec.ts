import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadGroupCenterUserComponent } from './upload-group-center-user.component';

describe('UploadGroupCenterUserComponent', () => {
  let component: UploadGroupCenterUserComponent;
  let fixture: ComponentFixture<UploadGroupCenterUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadGroupCenterUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UploadGroupCenterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
