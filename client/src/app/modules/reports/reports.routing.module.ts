import { RouterModule, Routes } from "@angular/router";
import { SosReportsComponent } from "./sos-reports/sos-reports.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {

    path: 'view-reports',
    component: SosReportsComponent

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule{}