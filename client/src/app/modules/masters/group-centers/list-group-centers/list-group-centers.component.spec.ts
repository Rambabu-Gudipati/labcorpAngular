/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListGroupCentersComponent } from './list-group-centers.component';

describe('ListGroupCentersComponent', () => {
  let component: ListGroupCentersComponent;
  let fixture: ComponentFixture<ListGroupCentersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListGroupCentersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListGroupCentersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
