import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Auth
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routes';
import { MastersModule } from './modules/masters/masters.module';
import { AuthModule } from './modules/auth/auth.module';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { messaging } from '../configs/firebase.config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DateDifference } from './pipes/date-difference.pipe';
import { ViewSosComponent } from './components/view-sos/view-sos.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ToggleButtonComponent } from './components/toggle-switch/toggle-switch.component';
import { NgToggleModule } from 'ng-toggle-button';
import { AdvertisersModule } from './modules/advertisers/advertisers.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { TableModule } from 'primeng/table';
import { AmbulanceTrackingComponent } from './components/ambulance-tracking/ambulance-tracking.component';
import { SosModule } from './modules/sos/sos-module.module';
import { MentormoduleModule } from './modules/mentormodule/mentormodule.module';
import { WellnessModule } from './modules/wellness/wellness.module';
import { YearlyscreenModule } from './modules/yearlyscreen/yearlyscreen.module';
import { CustomerTrackingComponent } from './components/customer-tracking/customer-tracking.component';
import { AttendMeetingComponent } from './components/attend-meeting/attend-meeting.component';
import { MeetingLayoutComponent } from './components/meeting-layout/meeting-layout.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DateDifference, ToggleButtonComponent, AmbulanceTrackingComponent, CustomerTrackingComponent,
    AttendMeetingComponent, MeetingLayoutComponent

  ],
  imports: [
    InventoryModule,
    BrowserAnimationsModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MastersModule,
    AuthModule,
    SosModule,
    GoogleMapsModule,
    AdvertisersModule,
    RouterModule,
    CommonModule,
    FormsModule, TableModule,
    AdvertisersModule,
    MentormoduleModule,
    WellnessModule,
    YearlyscreenModule,
    NgbPaginationModule,
    NgToggleModule.forRoot(),
    ToastrModule.forRoot()
  ],
  providers: [
    { provide: 'messaging', useValue: messaging }
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: FakeBackendInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
