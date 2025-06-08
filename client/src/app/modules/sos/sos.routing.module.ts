import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewSosComponent } from '../../components/view-sos/view-sos.component';

const routes: Routes = [
  {

    path: 'view-sos/:id',
    component: ViewSosComponent

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SosRoutingModule { }
