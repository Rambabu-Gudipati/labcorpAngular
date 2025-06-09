
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MentorDashboardComponent } from "./mentor-dashboard/mentor-dashboard.component";
import { AuthGuard } from "../../gaurds/auth.guard";
import { ListMentorOrdersComponent } from "./list-mentor-orders/list-mentor-orders.component";
import { ViewOrdersComponent } from "./view-orders/view-orders.component";
import { CreateHealthDetailsComponent } from "./health-records/create-health-details/create-health-details.component";
import { ListMappingUsersComponent } from "./list-mapping-users/list-mapping-users.component";
import { ListDoctorConsultationComponent } from "./doctor-consultation/list-doctor-consultation/list-doctor-consultation.component";
import { ViewDoctorConsultationComponent } from "./doctor-consultation/view-doctor-consultation/view-doctor-consultation.component";

const routes: Routes = [
    {
        path:'dashboard',
        data: { title: 'Dashboard', roles: ['Admin','Care Mentor'] },
        component: MentorDashboardComponent,
        //  canActivate: [AuthGuard]
      },
      {
        path:'orders',
        data: { title: 'Orders', roles: ['Admin','Care Mentor'] },
        component: ListMentorOrdersComponent,
        //  canActivate: [AuthGuard]
      },
      {
        path:'view-orders/:id',
        data: { title: 'Orders', roles: ['Admin','Care Mentor'] },
        component: ViewOrdersComponent,
        //  canActivate: [AuthGuard]
      },
      {
        path:'doctorconsultation',
        data: { title: 'Doctor', roles: ['Admin','Care Mentor'] },
        component: ListDoctorConsultationComponent,
        //  canActivate: [AuthGuard]
      },
      {
        path:'view-doctors/:id',
        data: { title: 'Doctor', roles: ['Admin','Care Mentor'] },
        component: ViewDoctorConsultationComponent,
        //  canActivate: [AuthGuard]
      },
      {
        path:'health-details/:user_id',
        data: { title: 'Details', roles: ['Admin','Care Mentor'] },
        component: CreateHealthDetailsComponent,
        //  canActivate: [AuthGuard]
      },

      {
        path:'mappingusers',
        data: { title: 'Mentor', roles: ['Admin','Care Mentor'] },
        component: ListMappingUsersComponent,
        //  canActivate: [AuthGuard]
      },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class mentorRoutingModule{}
