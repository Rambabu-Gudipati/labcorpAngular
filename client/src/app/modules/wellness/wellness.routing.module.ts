import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../gaurds/auth.guard";
import { ListWellnessPackageComponent } from "./list-wellness-package/list-wellness-package.component";

const routes: Routes = [
    {
        path:'list-wellness',
        data: { title: 'Dashboard', roles: ['Admin','Care Mentor'] },
        component: ListWellnessPackageComponent,
        //  canActivate: [AuthGuard]
      },

];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

export class WellnessRoutingModule{}
