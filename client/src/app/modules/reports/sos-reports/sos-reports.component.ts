import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientService } from '../../../services/http-client-service';
import { HttpParams } from '@angular/common/http';
import { AppConstants } from '../../../app-constants';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-sos-reports',

  templateUrl: './sos-reports.component.html',
  styleUrl: './sos-reports.component.scss'
})
export class SosReportsComponent implements OnInit{
   @ViewChild('dt1') dt1!: Table;
    searchValue: any;
is_admin: boolean = false;
  userProfile: any
  data: any[] = [];
   sosData: any = [];
  page = 1;
  // pageSize = 10;
  // collectionSize = 0;
 
  //page1: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  report_from_date: any;
  report_to_date: any;
  report_date: any;
  maxDate: string = new Date().toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format

  loading = false;
  constructor(private authService: AuthService, private httpService: HttpClientService, ) { }
 
  ngOnInit() {
    this.userProfile = JSON.parse(this.authService.getUserInfo());
    if (this.userProfile.role != 'Group User Admin') {
      this.is_admin = true;
    } else {
      this.is_admin = false;
    }
    this.report_from_date = this.getPreviousDate();
    this.report_to_date = this.getTodayDate();

    // Fetch initial data
    this.loadSosData();
  }

  // Get today's date in YYYY-MM-DD format
  getTodayDate(): string {
    const date = new Date();
    return date.toISOString().split('T')[0];
  }

  // Get yesterday's date in YYYY-MM-DD format
  getPreviousDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 1); // Subtract one day
    return date.toISOString().split('T')[0];
  }
  //   this.report_from_date = this.getPreviousDate();
  //     this.report_to_date = this.getTodayDate();
  //   this.loasSosData();
  // }
  // getTodayDate(): string {
  //   const date = new Date();
  //   const day = ('0' + date.getDate()).slice(-2);
  //   const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
  //   const year = date.getFullYear();
  //   this.report_date = `${year}-${month}-${day}`
  //   return `${year}-${month}-${day}`
  // }
  // getPreviousDate(): string {
  //   const date = new Date();
  //   const day = ('0' + date.getDate()).slice(-2);
  //   const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
  //   const year = date.getFullYear();
  //   this.report_date = `${year}-${month}-${day}`
  //   return `${year}-${month}-${day}`
  // }
  // getNextDate(): string {
  //   const date = new Date();
  //   const day = ('0' + date.getDate()).slice(-2);
  //   const month = ('0' + (date.getMonth() + 1)).slice(-2); // Months are zero-based
  //   const year = date.getFullYear();
  //   this.report_date = `${year}-${month}-${day}`
  //   return `${year}-${month}-${day}`
  // }

  loadSosData() {
    this.loading = true;

    // If no date is selected, use yesterday to today by default
    if (!this.report_from_date || !this.report_to_date) {
      this.report_from_date = this.getPreviousDate(); // Yesterday
      this.report_to_date = this.getTodayDate(); // Today
    }

    // Adjust 'toDate' to include the entire day (23:59:59) for inclusivity
    const adjustedToDate = new Date(this.report_to_date);
    adjustedToDate.setHours(23, 59, 59, 999);  // Set time to the end of the day
  
    // Log adjusted dates for debugging
    console.log('Adjusted From Date:', this.report_from_date);
    console.log('Adjusted To Date:', adjustedToDate.toISOString());
  
    // Build query parameters with adjusted 'toDate'
    let params = new HttpParams()
      .set('report_from_date', this.report_from_date)
      .set('report_to_date', adjustedToDate.toISOString().split('T')[0]); // Send date in 'YYYY-MM-DD' format
  
    // Fetch data from the backend
    this.httpService.getwithAuthWithParams(AppConstants.GET_SOS_CASES, params).subscribe(
      (response: any) => {
        this.data = response.data || [];
        this.totalPages = this.data.length;
         // Store full fetched data
        this.filterData(); // Apply filtering
        this.loading = false;
      },
      (error) => {
        console.error('Error loading data', error);
       // this.loading = false;
      }
    );
   
  }
  errorMessage:string;
  //Filter data based on the selected date range
  filterData() {
    const fromDate = new Date(this.report_from_date);
    const toDate = new Date(this.report_to_date);
   
  
    // If the fromDate is yesterday, set it to the start of the day (00:00:00) to include all yesterday's data
    fromDate.setHours(0, 0, 0, 0);
  
    // Set the toDate to the end of the day (23:59:59) to include all of today's data
    toDate.setHours(23, 59, 59, 999);
  
    // Log the filtered data for debugging
    console.log('Filtering data between:', fromDate, 'and', toDate);
  
    this.data = this.data.filter((sos) => {
      const sosDate = new Date(sos.sos_date); // Parse SOS date
      return sosDate >= fromDate && sosDate <= toDate;
    });
  
   // Update total record count
    //this.changePage(); // Apply pagination
  }
  onPageChange(event: any) {
   
    this.page = event.first / event.rows, // calculate current page
    this.limit = event.rows,
   
    this.loadSosData();
  }
  // Paginate the filtered data
  // changePage() {
  //   this.sosData = this.data.map((country, i) => ({ id: i + 1, ...country })).slice(
  //     (this.page - 1) * this.limit,
  //     (this.page - 1) * this.limit + this.limit,
  //   );
  // }

  // Event handler for date change
  onDateChange() {
    this.errorMessage = '';

    if (this.report_from_date && this.report_to_date) {
      const fromDate = new Date(this.report_from_date);
      const toDate = new Date(this.report_to_date);
  
      // Check if the "To Date" is earlier than the "From Date"
      if (toDate < fromDate) {
        this.errorMessage = 'To Date cannot be earlier than From Date.';
        return; // Do not proceed if there's an error
      }
    }
    this.loadSosData(); // Refetch data for the selected date range
  }
  showSOSData(sosId: any) {

    const url = `/sos/view-sos/${sosId}`; // Construct the URL

    window.open(url, '_blank');
    
  }
  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement)?.value;
    if (value) {
      this.dt1.filterGlobal(value, 'contains');
    }
  }
  clear() {
    this.dt1.clear();
  }


  
}
