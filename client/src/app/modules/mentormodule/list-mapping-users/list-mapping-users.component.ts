import { Component, ElementRef, ViewChild } from '@angular/core';
import { AppConstants } from '../../../app-constants';
import { HttpClientService } from '../../../services/http-client-service';
import { Table } from 'primeng/table';

import { Router } from '@angular/router';


@Component({
  selector: 'app-list-mapping-users',

  templateUrl: './list-mapping-users.component.html',
  styleUrl: './list-mapping-users.component.scss'
})
export class ListMappingUsersComponent {
  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  items: any[] = [];
  isDtInitialized: boolean = false;
  loading: any;
  message: any;
  page: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  searchUsername:string="";
  searchEmail:string="";
  searchPhoneno:string="";
  sortBy: string = "user_name";
  sortOrder:string="asc";
  showFilters: boolean = false;
  constructor(private httpService: HttpClientService,private router: Router) {
    
  }




  ngOnInit(): void {

    //this.loadMappingUsers(this.page, this.limit);
  
  }

  loadMappingUsers(page: number, limit: number) {
    const queryParams = new URLSearchParams();
  
    // Add pagination parameters
    queryParams.set('page', (page + 1).toString());  // PrimeNG is zero-based, so add 1 for the API
    queryParams.set('limit', limit.toString());
    
    if (this.searchUsername) {
      queryParams.set('username', this.searchUsername);
    }
    if (this.searchEmail) {
      queryParams.set('email', this.searchEmail);
    }
    if (this.searchPhoneno) {
      queryParams.set('mobile_no', this.searchPhoneno);
    }
  

    // Make the HTTP request with query parameters
    this.httpService.getwithAuth(`${AppConstants.LIST_MAPPING_USERS}?${queryParams.toString()}`)
      .subscribe(res => {
        this.items = res.data;  // Update items with the response data
        this.totalPages = res.count; // Adjust according to your response structure
      });
   

  }


 


  // filterGlobal(event: Event) {
  //   const value = (event.target as HTMLInputElement)?.value;
  //   if (value) {
  //     this.dt1.filterGlobal(value, 'contains');
  //   }
  // }
  // clear() {
  //   this.dt1.clear();
  // }
  showPatientsData(user_id:any,user_data: any) {

    // const url = `/patients/view-patients/${user_id}`; // Construct the URL
    //  this.router.navigateByUrl( `/patients/view-patients/${user_id}`, { state: { patient_data: JSON.stringify(user_data) } });
     sessionStorage.setItem('patient_data', JSON.stringify(user_data));
  
     // Construct the URL with the dynamic route parameter
     const baseUrl = window.location.origin;
     const newTabUrl = `${baseUrl}/patients/view-patients/${user_id}`;
   
     // Open the new tab
     const newTab = window.open(newTabUrl, '_blank');
     if (!newTab) {
       console.error('Failed to open new tab');
     }
   
     
     
   }
  //  addHealthRecords(user_id:any,user_data: any) {
  //    //this.router.navigate(['/patients/health-details', user_id]);
  //    this.router.navigateByUrl( `/patients/health-details/${user_id}`, { state: { patient_data: JSON.stringify(user_data) } });
  //  }
  //  passDataToView()
  //  {
  //    // const messaging = getMessaging();
  //    // onMessage(messaging, (payload) => {
  //    //   console.log('Message received. ', payload);
 
  //      // this.router.navigate(['video/join-call'], { queryParams: { profile: JSON.stringify(payload) } });
  //      this.router.navigateByUrl( `/patients/view-patients`, { state: { patient_data: JSON.stringify(this.items) } });
  //      this.message = this.items;
  //      var patient_data = JSON.parse(JSON.stringify(this.items));
  //      console.log(patient_data);
  //    // });
  //  }
  // showYearlyScreen(user_data:any) {

  //  // this.router.navigate(['/yearlyscreen/list-yearlyscreen']);
  //   this.router.navigateByUrl( '/yearlyscreen/list-yearlyscreen', { state: { patient_data: JSON.stringify(user_data) } });
    
  // }
  showYearlyScreen( user_data: any) {
    // Store data in sessionStorage
    sessionStorage.setItem('patient_data', JSON.stringify(user_data));

    // Construct the URL with the dynamic route parameter
    const baseUrl = window.location.origin;
    const newTabUrl = `${baseUrl}/yearlyscreen/list-yearlyscreen`;
  
    // Open the new tab
    const newTab = window.open(newTabUrl, '_blank');
    if (!newTab) {
      console.error('Failed to open new tab');
    }
}
  
  onPageChange(event: any) {
    this.page = event.first / event.rows; // calculate current page
    this.limit = event.rows; // number of records per page
    this.loadMappingUsers(this.page, this.limit);
  }
  onSearch() {
    // Get pagination values (first and rows)
     const first = this.dt1?.first || 0; // Default to 0 if dt1 is undefined or null
     const rows = this.dt1?.rows || this.limit; // Default to limit if dt1 is undefined or null
   
     // Call loadUsers with individual filters and pagination
     this.loadMappingUsers(first / rows, rows);
   }
   onSort(column: string) {
    if (this.sortBy === column) {
      // Toggle sort order if the same column is clicked
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Set the new column and default to ascending
      this.sortBy = column;
      this.sortOrder = 'asc';
    }
  
    // Perform local sorting
    this.items.sort((a, b) => {
      const aValue = a[column] || ''; // Get value or default to empty string
      const bValue = b[column] || '';
      
      // Compare values based on sort order
      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return this.sortOrder === 'asc' ? comparison : -comparison;
    });
  }
  
  // Method to get the sort icon class
  getSortIcon(column: string): string {
    if (this.sortBy !== column) {
      return ''; // No icon if not sorted by this column
    }
    return this.sortOrder === 'asc' ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
  }
  clear() {
    this.searchUsername = '';
  this.searchEmail = '';
  this.searchPhoneno = '';
 
  // Reload data without filters
  this.loadMappingUsers(0, this.limit);
  }
  toggleFilter(): void {
    this.showFilters = !this.showFilters;
  }
}