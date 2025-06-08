import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Component Pages
import { LoginComponent } from "./login/login.component";
import { NotAuthorizedComponent } from '../../components/not-authorized/not-authorized.component';

const routes: Routes = [
  {

    path: 'login',
    component: LoginComponent

  },
  {

    path: 'not-authorized',
    component: NotAuthorizedComponent

  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
