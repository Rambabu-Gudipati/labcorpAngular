import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUserComponent } from './users/list-user/list-user.component';
import { AddUserComponent } from './users/add-user/add-user.component';
import { ListHospitalsComponent } from './hospitals/list-hospitals/list-hospitals.component';
import { ListDoctorsComponent } from './doctors/list-doctors/list-doctors.component';
import { ListAmbulanceComponent } from './ambulance/list-ambulance/list-ambulance.component';
import { AuthGuard } from '../../gaurds/auth.guard';
import { ActiveSosCallsComponent } from './doctors/active-sos-calls/active-sos-calls.component';
import { ListCareTeamComponent } from './careteam/list-care-team/list-care-team.component';
import { ListCareDoctorComponent } from './caredoctor/list-care-doctor/list-care-doctor.component';
import { ListGroupUsersComponent } from './group-users/list-group-users/list-group-users.component';
import { ListGroupCentersComponent } from './group-centers/list-group-centers/list-group-centers.component';
import { ListGroupCenterUsersComponent } from './group-centers/list-group-center-users/list-group-center-users.component';
import { ListMentorMappingUsersComponent } from './get-mentor-users/list-mentor-mapping-users/list-mentor-mapping-users.component';
import { ListCareMentorComponent } from './care-mentor/list-care-mentor/list-care-mentor.component';
import { ListLabComponent } from './lab/list-lab/list-lab.component';
import { ListConfigComponent } from './config/list-config/list-config.component';

const routes: Routes = [
  {
    path: 'users',
    data: { title: 'User Master', roles: ['Admin'] },
    component: ListUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-user',
    data: { title: 'User Master', roles: ['Admin'] },
    component: AddUserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'hospitals',
    data: { title: 'User Master', roles: ['Admin'] },
    component: ListHospitalsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'doctors',
    data: { title: 'User Master', roles: ['Admin'] },
    component: ListDoctorsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ambulance',
    data: { title: 'User Master', roles: ['Admin'] },
    component: ListAmbulanceComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sos-calls',
    data: { title: 'User Master', roles: ['Admin'] },
    component: ActiveSosCallsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'careTeam',
    data: { title: 'User Master', roles: ['Admin'] },
    component: ListCareTeamComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'careDoctor',
    data: { title: 'User Master', roles: ['Admin'] },
    component: ListCareDoctorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'group-users',
    data: { title: 'Group Users', roles: ['Admin',] },
    component: ListGroupUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'group-centers',
    data: { title: 'Group Users', roles: ['Admin', 'Group User Admin'] },
    component: ListGroupCentersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'group-center-users',
    data: { title: 'Group Users', roles: ['Admin',] },
    component: ListGroupCenterUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'careMentor',
    data: { title: 'Care Mentor', roles: ['Admin'] },
    component: ListCareMentorComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mentorMapping',
    data: { title: 'Care Mentor', roles: ['Admin'] },
    component: ListMentorMappingUsersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lab',
    data: { title: 'Lab', roles: ['Admin'] },
    component: ListLabComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'config',
    data: { title: 'Lab', roles: ['Admin'] },
    component: ListConfigComponent,
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MastersRoutingModule { }
