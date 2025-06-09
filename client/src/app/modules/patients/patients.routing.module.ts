import { RouterModule, Routes } from "@angular/router";
import { ViewPatientsComponent } from "./view-patients/view-patients.component";
import { AuthGuard } from "../../gaurds/auth.guard";
import { NgModule } from "@angular/core";
import { AddHealthRecordsComponent } from "./add-health-records/add-health-records.component";

const routes: Routes = [
    {
        path:'view-patients/:user_id',
        data: { title: 'Doctor', roles: ['Admin','Care Mentor'] },
        component: ViewPatientsComponent,
        //  canActivate: [AuthGuard]
      },
      {
        path:'health-details/:user_id',
        data: { title: 'Details', roles: ['Admin','Care Mentor'] },
        component: AddHealthRecordsComponent,
        //  canActivate: [AuthGuard]
      },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class PatientsRoutingModule{}
