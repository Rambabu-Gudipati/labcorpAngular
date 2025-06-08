import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../../../app-constants';
import { HttpClientService } from '../../../../services/http-client-service';
import { UtilsServiceService } from '../../../../services/util-service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list-ambulance',
  templateUrl: './list-ambulance.component.html',
  styleUrls: ['./list-ambulance.component.css'],
})
export class ListAmbulanceComponent implements OnInit {

    @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  items: any[] = [];
  page: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  getSeverity(duty_status: string) {
    switch (duty_status) {
      case 'In Active':
        return 'danger';

      case 'Active':
        return 'success';

      default:
        return 'success';
    }
  }



searchUsername:string="";
searchEmail:string="";
searchPhoneno:string="";

sortBy: string = "";
sortOrder:string="";
showFilters: boolean = false;
 
  
  
  loading = false;

  constructor(private httpService : HttpClientService,
    private toastr: ToastrService, private router : Router,
    private util: UtilsServiceService ) { }

    ngOnInit() {
      // fetch items from the backend api
    //   this.loading = true;
    
      
  }

  loadAmbulanceData(page:number,limit:number)
{
  
  this.httpService.getwithAuth(`${AppConstants.LIST_AMBULANCE}?page=${page+1}&limit=${limit}`).subscribe(res => {
    this.items = res.data;
    this.totalPages = res.count; // adjust according to your response structure
  });
}

onPageChange(event: any) {
  this.page = event.first / event.rows; // calculate current page
  this.limit = event.rows; // number of records per page
  this.loadAmbulanceData(this.page, this.limit);
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
  onSearch() {
    // Get pagination values (first and rows)
     const first = this.dt1?.first || 0; // Default to 0 if dt1 is undefined or null
     const rows = this.dt1?.rows || this.limit; // Default to limit if dt1 is undefined or null
   
     // Call loadUsers with individual filters and pagination
     this.loadAmbulanceData(first / rows, rows);
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
   this.loadAmbulanceData(0, this.limit);
   }
   toggleFilter(): void {
    this.showFilters = !this.showFilters;
  }
}
