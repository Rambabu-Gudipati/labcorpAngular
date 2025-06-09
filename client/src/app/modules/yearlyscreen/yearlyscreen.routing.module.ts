import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../gaurds/auth.guard";
import { NgModule } from "@angular/core";
import { ListYearlyScreenComponent } from "./list-yearly-screen/list-yearly-screen.component";

const routes: Routes = [
    {
        path:'list-yearlyscreen',
        data: { title: 'Dashboard', roles: ['Admin','Care Mentor'] },
        component: ListYearlyScreenComponent,
        //  canActivate: [AuthGuard]
      },

];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })


export class YearlyscreenRoutingModule{}
