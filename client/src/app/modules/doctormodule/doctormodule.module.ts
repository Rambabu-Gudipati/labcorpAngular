import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DoctorRoutingModule } from './doctormodule.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgToggleModule } from 'ng-toggle-button';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { StyleClassModule } from 'primeng/styleclass';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { DayPilotModule } from '@daypilot/daypilot-lite-angular';



@NgModule({
  declarations: [DashboardComponent, PatientDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    DoctorRoutingModule,
    NgbToastModule,
    ReactiveFormsModule,
    NgToggleModule,
    DayPilotModule,
    TableModule, ButtonModule, StyleClassModule, IconFieldModule,
    InputIconModule, InputTextModule, TagModule, MultiSelectModule, DropdownModule, CalendarModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DoctormoduleModule { }
