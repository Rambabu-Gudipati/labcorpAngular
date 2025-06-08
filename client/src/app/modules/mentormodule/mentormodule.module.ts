import { ListMentorOrdersComponent } from './list-mentor-orders/list-mentor-orders.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgToggleModule } from 'ng-toggle-button';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { StyleClassModule } from 'primeng/styleclass';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { mentorRoutingModule } from './mentormodule.routing';
import { MentorDashboardComponent } from './mentor-dashboard/mentor-dashboard.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { AssignLabComponent } from './assign-lab/assign-lab.component';
import { CalendarModule } from 'primeng/calendar';
import { UploadPdfComponent } from './upload-pdf/upload-pdf.component';
import { CreateHealthDetailsComponent } from './health-records/create-health-details/create-health-details.component';
import { CheckboxModule } from 'primeng/checkbox';
import { AddMedicationComponent } from './health-records/add-medication/add-medication.component';
import { ListMappingUsersComponent } from './list-mapping-users/list-mapping-users.component';
import { ListDoctorConsultationComponent } from './doctor-consultation/list-doctor-consultation/list-doctor-consultation.component';
import { ViewDoctorConsultationComponent } from './doctor-consultation/view-doctor-consultation/view-doctor-consultation.component';
import { BookAppointmentsComponent } from './doctor-consultation/book-appointments/book-appointments.component';
import { SampleCollectionComponent } from './sample-collection/sample-collection.component';

@NgModule({
  declarations: [
    MentorDashboardComponent,
    ListMentorOrdersComponent,
    ViewOrdersComponent,
    AssignLabComponent,
    UploadPdfComponent,
    ListDoctorConsultationComponent,
    ViewDoctorConsultationComponent,
    BookAppointmentsComponent,
    CreateHealthDetailsComponent,
    AddMedicationComponent,
    ListMappingUsersComponent,
    SampleCollectionComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    mentorRoutingModule,
    NgbToastModule,
    ReactiveFormsModule,
    NgToggleModule,
    TableModule, ButtonModule, StyleClassModule, IconFieldModule,
    InputIconModule, InputTextModule, TagModule, MultiSelectModule, DropdownModule, CalendarModule, CheckboxModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MentormoduleModule { }