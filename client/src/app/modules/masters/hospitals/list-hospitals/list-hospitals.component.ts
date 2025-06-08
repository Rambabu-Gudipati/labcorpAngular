
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../../../app-constants';
import { HttpClientService } from '../../../../services/http-client-service';
import { UtilsServiceService } from '../../../../services/util-service';
import { HttpParams } from '@angular/common/http';
import { Table } from 'primeng/table';

@Component({
    selector: 'app-list-hospitals',
    templateUrl: './list-hospitals.component.html',
    styleUrls: ['./list-hospitals.component.css'],
})
export class ListHospitalsComponent implements OnInit {

    @ViewChild('dt1') dt1!: Table;
    searchValue: any;
    items: any[] = [];
    page: number = 0;
    limit: number = 10;
    totalPages: number = 0;

   searchUsername:string="";
  searchHospitalname:string="";
  searchEmail:string="";
  searchPhoneno:string="";
  // searchUsertype :string="";
  // searchStatus:string="";
  sortBy: string = "";
  sortOrder:string="";
  showFilters: boolean = false;
    loading = false;

    constructor(private httpService: HttpClientService,
        private toastr: ToastrService, private router: Router,
        private util: UtilsServiceService) { }

    ngOnInit() {
        // fetch items from the backend api
    this.loadHospital(0, this.limit)
        // let params = new HttpParams()
        //     .set('page', 1)
        //     .set('size', 1000);
        // this.httpService.getwithAuthWithParams(AppConstants.LIST_HOSPITALS, params)
        //     .subscribe(x => {
        //         this.items = x.data;
              
        //     });
    }
    loadHospital(page:number,limit:number)
    {
      let params = new HttpParams();

      // Add pagination parameters
      params = params.set('page', (page + 1).toString()); // PrimeNG is zero-based, so add 1 for the API
      params = params.set('limit', limit.toString());
    
      if (this.searchUsername) {
        params = params.set('username', this.searchUsername);
      }
      if (this.searchHospitalname) {
        params = params.set('hospital_name', this.searchHospitalname);
      }
      if (this.searchEmail) {
        params = params.set('email', this.searchEmail);
      }
      if (this.searchPhoneno) {
        params = params.set('mobile_no', this.searchPhoneno);
      }
    
      // Call the HTTP service with URL and params
      this.httpService.getwithAuthWithParams(`${AppConstants.LIST_HOSPITALS}`, params)
        .subscribe(res => {
          this.items = res.data; // Update items with the response data
          this.totalPages = res.count; // Adjust according to your response structure
        });
    }

    getSeverity(status: string) {
      switch (status) {
        case 'In Active':
          return 'danger';
  
        case 'Active':
          return 'success';
  
        default:
          return 'success';
      }
    }
  

    // filterGlobal(event: Event) {
    //     const value = (event.target as HTMLInputElement)?.value;
    //     if (value) {
    //       this.dt1.filterGlobal(value, 'contains');
    //     }
    //   }
    //   clear() {
    //     this.dt1.clear();
    //   }
      // removeData(_t62: any) {
      //   throw new Error('Method not implemented.');
      //   }
      //   onEditClick(_t62: any) {
      //   throw new Error('Method not implemented.');
      //   }

        onSearch() {
          // Get pagination values (first and rows)
           const first = this.dt1?.first || 0; // Default to 0 if dt1 is undefined or null
           const rows = this.dt1?.rows || this.limit; // Default to limit if dt1 is undefined or null
         
           // Call loadUsers with individual filters and pagination
           this.loadHospital(first / rows, rows);
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
         this.searchHospitalname = '';
        //  this.searchUsertype = '';
         
         // Reload data without filters
         this.loadHospital(0, this.limit);
         }
         toggleFilter(): void {
          this.showFilters = !this.showFilters;
        }
}

