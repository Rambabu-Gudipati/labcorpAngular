import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../../app.routes';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MeetingService } from './services/meeting.service';
import { VideoRoutingModule } from './video-routing.module';



@NgModule({
  declarations: [],
  imports: [
    VideoRoutingModule, FormsModule
  ],
  providers: [MeetingService],
})
export class VideoModuleModule { }
