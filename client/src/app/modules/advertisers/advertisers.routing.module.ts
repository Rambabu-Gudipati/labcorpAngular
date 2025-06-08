import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../gaurds/auth.guard';
import { ListAdvertisersComponent } from './list-advertisers/list-advertisers.component';
import { AddAdvertiserComponent } from './add-advertiser/add-advertiser.component';

const routes: Routes = [
  {
    path: 'list-advertiser',
    data: { title: 'User Master', roles: ['Admin'] },
    component: ListAdvertisersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-advertiser',
    data: { title: 'Advertiser Master', roles: ['Admin'] },
    component: AddAdvertiserComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdvertisersRoutingModule { }
