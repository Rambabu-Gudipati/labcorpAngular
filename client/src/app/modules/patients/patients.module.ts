import { MultiSelectModule } from 'primeng/multiselect';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewPatientsComponent } from './view-patients/view-patients.component';
import { HealthDataComponent } from './health-data/health-data.component';
import {  PatientsRoutingModule } from './patients.routing.module';
import { FormsModule } from '@angular/forms';
import { LabOrdersComponent } from './lab-orders/lab-orders.component';
import { TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';

import { BrowserModule } from '@angular/platform-browser';
import { DoctorCosultComponent } from './doctor-cosult/doctor-cosult.component';

import { AddHealthRecordsComponent } from './add-health-records/add-health-records.component';




@NgModule({
  declarations: [
    ViewPatientsComponent,
    HealthDataComponent,
    LabOrdersComponent,
    DoctorCosultComponent,
   
    AddHealthRecordsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
  
    ButtonModule, StyleClassModule, IconFieldModule,
    InputIconModule, InputTextModule, TagModule, MultiSelectModule, DropdownModule,CalendarModule,
    PatientsRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PatientsModule { }
