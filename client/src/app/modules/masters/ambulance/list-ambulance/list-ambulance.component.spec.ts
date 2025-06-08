/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ListAmbulanceComponent } from './list-ambulance.component';

describe('ListAmbulanceComponent', () => {
  let component: ListAmbulanceComponent;
  let fixture: ComponentFixture<ListAmbulanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAmbulanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAmbulanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
