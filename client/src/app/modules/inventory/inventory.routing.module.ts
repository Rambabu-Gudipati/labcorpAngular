import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../gaurds/auth.guard';
import { NgModule } from '@angular/core';
import { ListAidDevicesComponent } from './list-aid-devices/list-aid-devices.component';
import { AddAidDevicesComponent } from './add-aid-devices/add-aid-devices.component';
import { ListEcgComponent } from './list-ecg/list-ecg.component';
import { AddEcgComponent } from './add-ecg/add-ecg.component';
import { ListAidIssueComponent } from './issue/list-aid-issue/list-aid-issue.component';
import { AddAidIssueComponent } from './issue/add-aid-issue/add-aid-issue.component';
import { ListEcgIssueComponent } from './issue/list-ecg-issue/list-ecg-issue.component';
import { AddEcgIssueComponent } from './issue/add-ecg-issue/add-ecg-issue.component';

const routes: Routes = [
  {
    path: 'list-aid-device',
    data: { title: 'aid Master', roles: ['Admin'] },
    component: ListAidDevicesComponent,
    //  canActivate: [AuthGuard]
  },
  {
    path: 'add-aid device',
    data: { title: 'Aid device Master', roles: ['Admin'] },
    component: AddAidDevicesComponent,
    //  canActivate: [AuthGuard]
  },
  {
    path: 'list-ecg',
    data: { title: 'ecg Master', roles: ['Admin'] },
    component: ListEcgComponent,
    //  canActivate: [AuthGuard]
  },
  {
    path: 'add-ecg',
    data: { title: 'ecg Master', roles: ['Admin'] },
    component: AddEcgComponent,
    //  canActivate: [AuthGuard]
  },
  {
    path: 'list-aid-issue',
    data: { title: 'aid Master', roles: ['Admin'] },
    component: ListAidIssueComponent,
    //  canActivate: [AuthGuard]
  },
  {
    path: 'add-aid-issue',
    data: { title: 'aid Master', roles: ['Admin'] },
    component: AddAidIssueComponent,
    //  canActivate: [AuthGuard]
  },
  {
    path: 'list-ecg-issue',
    data: { title: 'ecg Master', roles: ['Admin'] },
    component: ListEcgIssueComponent,
    //  canActivate: [AuthGuard]
  },
  {
    path: 'add-ecg-issue',
    data: { title: 'ecg Master', roles: ['Admin'] },
    component: AddEcgIssueComponent,
    //  canActivate: [AuthGuard]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }

