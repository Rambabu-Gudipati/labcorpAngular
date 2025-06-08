import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpClientService } from '../../services/http-client-service';
import { AppConstants } from '../../app-constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewSosComponent } from '../view-sos/view-sos.component';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  is_admin: boolean = false;
  userProfile: any
  data: any[] = [];
  sosData: any = [];
  page = 1;
  pageSize = 10;
  collectionSize = 0;
  report_from_date: any;
  report_to_date: any;
  report_date: any;

  loading = false;
  constructor(private authService: AuthService, private router: Router, private httpService: HttpClientService, private modalService: NgbModal) { }
 
  ngOnInit() {




    this.userProfile = JSON.parse(this.authService.getUserInfo());
    if (this.userProfile.role != 'Group User Admin') {
      this.is_admin = true;
    } else {
      this.is_admin = false;
    }
    this.report_date = this.getTodayDate();
    this.report_from_date = this.getTodayDate();
    this.report_to_date = this.getTodayDate();
    this.loasSosData();
  }
  getTodayDate(): string {
    const date = new Date();
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const year = date.getFullYear();
    this.report_date = `${year}-${month}-${day}`
    return `${year}-${month}-${day}`
  }
  getPreviousDate(): string {
    const date = new Date();
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const year = date.getFullYear();
    this.report_date = `${year}-${month}-${day}`
    return `${year}-${month}-${day}`
  }
  getNextDate(): string {
    const date = new Date();
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const year = date.getFullYear();
    this.report_date = `${year}-${month}-${day}`
    return `${year}-${month}-${day}`
  }

  loasSosData() {
    this.loading = true;
    let params = new HttpParams()
      .set('report_from_date', this.report_from_date)
      .set('report_to_date', this.report_to_date);
    this.httpService.getwithAuthWithParams(AppConstants.GET_SOS_CASES, params)
      .subscribe(x => {
        this.data = x.data;
        this.collectionSize = this.data.length;
        this.changePage();

      });
  }
  changePage() {
    this.sosData = this.data.map((country, i) => ({ id: i + 1, ...country })).slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize,
    );
  }
  showSOSData(sosId: any) {

    const url = `/sos/view-sos/${sosId}`; // Construct the URL

    window.open(url, '_blank');
    
  }

  // joinCall(payload:any){
  //   payload.sos_id = payload.id;
  //   payload.room_id = payload.meeting_room_id;
  //   this.router.navigateByUrl('video/join-call', { state: { sos_data: JSON.stringify(payload) } });
    
  // }
  onJoinCall(payload:any)
  {
    payload.sos_id = payload.id;
    payload.room_id = payload.meeting_room_id;
    sessionStorage.setItem('sos_data', JSON.stringify(payload));
  
    // Construct the URL with the dynamic route parameter
    const baseUrl = window.location.origin;
    const newTabUrl = `${baseUrl}/video/join-call`;
  
    // Open the new tab
    const newTab = window.open(newTabUrl, '_blank');
    if (!newTab) {
      console.error('Failed to open new tab');
    }
  }
}
