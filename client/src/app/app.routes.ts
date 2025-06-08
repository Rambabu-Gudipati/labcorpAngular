
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { DefaultComponent } from './components/default/default.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ListHospitalsComponent } from './modules/masters/hospitals/list-hospitals/list-hospitals.component';
import { ListUserComponent } from './modules/masters/users/list-user/list-user.component';
import { ListDoctorsComponent } from './modules/masters/doctors/list-doctors/list-doctors.component';
import { ListAmbulanceComponent } from './modules/masters/ambulance/list-ambulance/list-ambulance.component';
import { NgModule, Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './gaurds/auth.guard';
import { AttendMeetingComponent } from './components/attend-meeting/attend-meeting.component';
import { MeetingLayoutComponent } from './components/meeting-layout/meeting-layout.component';

// export const routes: Routes = [
//   {path:'login' ,component:LoginComponent},
//   {path :'', component:DefaultComponent,
//   children:[
//     {path:'' ,component:DashboardComponent},
//     {path:'dashboard' ,component:DashboardComponent},
//     {path:'doctors' ,component:ListDoctorsComponent},
//     {path:'hospitals' ,component:ListHospitalsComponent},
//     {path:'users' ,component:ListUserComponent},
//     {path:'ambulance' ,component:ListAmbulanceComponent},
//     // {path:'masters', loadChildren: ()=>import('./modules/masters/masters.module').then(m=> m.MastersModule)}
//   ]

//   },

// ];
export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule) },
  {
    path: "", component: DefaultComponent, children: [{ path: '', component: DashboardComponent, canActivate: [AuthGuard], data: { title: 'User Master', roles: ['Admin', 'Care Team', 'Care Doctor', 'Group User Admin', 'Care Mentor', 'Doctor'] }, },
    { path: 'sos', loadChildren: () => import('./modules/sos/sos-module.module').then(m => m.SosModule) },
    { path: 'video', loadChildren: () => import('./modules/video-module/video-module.module').then(m => m.VideoModuleModule) },
    { path: 'masters', loadChildren: () => import('./modules/masters/masters.module').then(m => m.MastersModule) },
    { path: 'advertiser', loadChildren: () => import('./modules/advertisers/advertisers.module').then(m => m.AdvertisersModule) },
    { path: 'inventory', loadChildren: () => import('./modules/inventory/inventory.module').then(m => m.InventoryModule) },
    { path: 'lab', loadChildren: () => import('./modules/lab/lab.module').then(m => m.LabModule) },

    { path: 'mentormodule', loadChildren: () => import('./modules/mentormodule/mentormodule.module').then(m => m.MentormoduleModule) },
    { path: 'doctor', loadChildren: () => import('./modules/doctormodule/doctormodule.module').then(m => m.DoctormoduleModule) },
    { path: 'wellness', loadChildren: () => import('./modules/wellness/wellness.module').then(m => m.WellnessModule) },
    { path: 'yearlyscreen', loadChildren: () => import('./modules/yearlyscreen/yearlyscreen.module').then(m => m.YearlyscreenModule) },
    { path: 'reports', loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule) },
    { path: 'patients', loadChildren: () => import('./modules/patients/patients.module').then(m => m.PatientsModule) },
    ]
  },
  {
    path: 'meeting', component: MeetingLayoutComponent, children: [
      {
        path: 'join-meeting', component: AttendMeetingComponent
      },
      {
        path: 'join-meeting/:id', component: AttendMeetingComponent
      }
    ]
  }
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
