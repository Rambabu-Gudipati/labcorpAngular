import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoCallComponent } from './components/video-call/video-call.component';
import { StartmeetingComponent } from './components/startmeeting/startmeeting.component';
const routes: Routes = [
  {
    path: 'join-call',
    data: { title: 'Join Call', roles: ['Admin', 'Care Team', 'Care Doctor','Doctor'] },
    component: VideoCallComponent
  },
  {
    path: 'start-call',
    data: { title: 'Join Call', roles: ['Admin', 'Care Team', 'Care Doctor','Doctor'] },
    component: StartmeetingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VideoRoutingModule { }
