import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgToggleModule } from 'ng-toggle-button';
import { AddTestComponent } from './add-test/add-test.component';
import { ListTestComponent } from './list-test/list-test.component';
import { LabRoutingModule } from './lab.routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
  declarations: [AddTestComponent, ListTestComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    ReactiveFormsModule,
    LabRoutingModule,
    NgToggleModule, LabRoutingModule, TableModule,ButtonModule, StyleClassModule, IconFieldModule,
    InputIconModule, InputTextModule, TagModule,MultiSelectModule, DropdownModule,CalendarModule 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LabModule { }
