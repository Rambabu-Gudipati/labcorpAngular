import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MastersRoutingModule } from './masters-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ListAmbulanceComponent } from './ambulance/list-ambulance/list-ambulance.component';
import { ListDoctorsComponent } from './doctors/list-doctors/list-doctors.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { ListUserComponent } from './users/list-user/list-user.component';
import { ListHospitalsComponent } from './hospitals/list-hospitals/list-hospitals.component';
import { ActiveSosCallsComponent } from './doctors/active-sos-calls/active-sos-calls.component';

import { ListCareTeamComponent } from './careteam/list-care-team/list-care-team.component';
import { ListGroupUsersComponent } from './group-users/list-group-users/list-group-users.component';
import { AddGroupUserComponent } from './group-users/add-group-user/add-group-user.component';
import { ListGroupCentersComponent } from './group-centers/list-group-centers/list-group-centers.component';
import { AddGroupCenterComponent } from './group-centers/add-group-center/add-group-center.component';
import { AutocompleteComponent } from '../../components/google-places.component';
import { NgToggleModule } from 'ng-toggle-button';
import { AddGroupCenterUsersComponent } from './group-centers/add-group-center-users/add-group-center-users.component';
import { ListGroupCenterUsersComponent } from './group-centers/list-group-center-users/list-group-center-users.component';
import { UploadGroupCenterUserComponent } from './group-centers/upload-group-center-user/upload-group-center-user.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ListMentorMappingUsersComponent } from './get-mentor-users/list-mentor-mapping-users/list-mentor-mapping-users.component';
import { AddLabComponent } from './lab/add-lab/add-lab.component';
import { ListLabComponent } from './lab/list-lab/list-lab.component';
import { AddCareMentorComponent } from './care-mentor/add-care-mentor/add-care-mentor.component';
import { ListCareMentorComponent } from './care-mentor/list-care-mentor/list-care-mentor.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { AddDoctorsComponent } from './doctors/add-doctors/add-doctors.component';
import { UpdateDoctorsComponent } from './doctors/update-doctors/update-doctors.component';
import { CalendarModule } from 'primeng/calendar';
import { ListConfigComponent } from './config/list-config/list-config.component';
import { AddConfigComponent } from './config/add-config/add-config.component';
import { AddCareDoctorComponent } from './caredoctor/add-care-doctor/add-care-doctor.component';
import { UpdateCareDoctorComponent } from './caredoctor/update-care-doctor/update-care-doctor.component';
import { ListCareDoctorComponent } from './caredoctor/list-care-doctor/list-care-doctor.component';

@NgModule({
  declarations: [
    ListDoctorsComponent,
    ListAmbulanceComponent,
    ListHospitalsComponent,
    ListDoctorsComponent,
    ListUserComponent,
    ActiveSosCallsComponent,
    PaginationComponent,
   ListCareDoctorComponent,
    AddCareDoctorComponent,
    UpdateCareDoctorComponent,
    ListCareTeamComponent,
    ListGroupUsersComponent,
    AddGroupUserComponent,
    ListGroupCentersComponent,
    AddGroupCenterComponent,
    AutocompleteComponent,
    AddGroupCenterUsersComponent,
    ListGroupCenterUsersComponent,
    UploadGroupCenterUserComponent,
    AddCareMentorComponent,
    ListCareMentorComponent,
    ListMentorMappingUsersComponent,
    AddLabComponent,
    ListLabComponent,
    AddDoctorsComponent,
    UpdateDoctorsComponent,
    ListConfigComponent,
    AddConfigComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbToastModule,
    ReactiveFormsModule,
    MastersRoutingModule, NgToggleModule,
    TableModule, ButtonModule, StyleClassModule, IconFieldModule,
    InputIconModule, InputTextModule, TagModule,MultiSelectModule, DropdownModule,CalendarModule 
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class MastersModule { }
