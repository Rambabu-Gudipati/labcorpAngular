import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../gaurds/auth.guard";
import { ListTestComponent } from "./list-test/list-test.component";



const routes: Routes = [
  {
    path: 'lab-test',
    data: { title: 'Lab test', roles: ['Admin'] },
    component: ListTestComponent,
    // canActivate: [AuthGuard]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LabRoutingModule { }
