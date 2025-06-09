
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../gaurds/auth.guard";
import { DashboardComponent } from "./views/dashboard/dashboard.component";


const routes: Routes = [
    {
        path:'dashboard',
        data: { title: 'Dashboard', roles: ['Admin','Doctor'] },
        component: DashboardComponent,
        //  canActivate: [AuthGuard]
      },
      // {
      //   path:'calenderdashboard',
      //   data: { title: 'Dashboard', roles: ['Admin','Doctor'] },
      //   component: CalendarComponent,
      //    canActivate: [AuthGuard]
      // },

];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class DoctorRoutingModule{}
