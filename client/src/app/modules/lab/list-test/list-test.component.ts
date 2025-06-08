import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AddTestComponent } from '../add-test/add-test.component';
import { AppConstants } from '../../../app-constants';
import { Observable, Subject } from 'rxjs';
import { HttpClientService } from '../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { stringify } from 'querystring';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list-test',

  templateUrl: './list-test.component.html',
  styleUrl: './list-test.component.scss'
})
export class ListTestComponent implements OnInit {
  isDtInitialized: boolean = false;
  loading: any;
  dtElement: any;

  searchTestname:string="";
  sortBy: string = "";
  sortOrder:string="";
  showFilters: boolean = false;
  // interval:any;
  constructor(private httpService: HttpClientService, private alert: ToastrService, private router: Router, private modalservice: NgbModal) {
    // this.httpService. listen().subscribe((m:any)=>{
    //   console.log(m);
    // this.addUser();
    // })
  }
  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  @ViewChild('content') popupview !: ElementRef;
  panelShow = true;
  filtered_data: any;
  pdfurl = '';
  invoiceno: any;
  page: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  user_types: Array<any> = [];
  ngOnInit(): void {

    //this.loadDiagnosticLab(this.page, this.limit);
  }

  loadDiagnosticLab(page:number,limit:number) {
    const queryParams = new URLSearchParams();
  
    // Add pagination parameters
    queryParams.set('page', (page + 1).toString());  // PrimeNG is zero-based, so add 1 for the API
    queryParams.set('limit', limit.toString());
    
    if (this.searchTestname) {
      queryParams.set('searchValue', this.searchTestname );
    }
   
    // if (this.searchStatus) {
    //   queryParams.set('status', this.searchStatus);
    // }
    // if (this.searchUsertype) {
    //   queryParams.set('user_type',this.searchUsertype);
    // }

    // Make the HTTP request with query parameters
    this.httpService.getwithAuth(`${AppConstants.LIST_DIAGNOSTIC_TEST}?${queryParams.toString()}`)
      .subscribe(res => {
        this.filtered_data = res.data;  // Update items with the response data
        this.totalPages = res.count; // Adjust according to your response structure
      });
   
    // this.httpService.getwithAuth(`${AppConstants.LIST_DIAGNOSTIC_TEST}?page=${page+1}&limit=${limit}`).subscribe(res => {
    //   this.filtered_data = res.data;
    //   this.totalPages = res.count;
    // });

  }
  onPageChange(event: any) {
    this.page = event.first / event.rows; // calculate current page
    this.limit = event.rows; // number of records per page
    this.loadDiagnosticLab(this.page, this.limit);
  }
  removeData(id: number) {
    if (confirm('Do you want to remove this Invoice :' + id)) {
      this.httpService.get(AppConstants.LIST_DIAGNOSTIC_TEST).subscribe(res => {
        let result: any;
        result = res;
        if (result.result == 'pass') {
          this.alert.success('Removed Successfully.', 'Remove Invoice')
          this.loadDiagnosticLab(this.page, this.limit);
        } else {
          this.alert.error('Failed to Remove.', 'Invoice');
        }
      });
    }
  }

  onEditClick(dataModel: any) {
    const modalRef = this.modalservice.open(AddTestComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.modalHeaderTitle = "Edit Lab Test"
    modalRef.componentInstance.editDataModel = dataModel;
    modalRef.result.then((result) => {
      console.log(result);
      this.loadDiagnosticLab(this.page, this.limit);
    }).catch((error) => {
      console.log(error);
      this.loadDiagnosticLab(this.page, this.limit);
    });
  }

  addUser() {
    const modalRef = this.modalservice.open(AddTestComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.user_type = 6;
    modalRef.componentInstance.modalHeaderTitle = "ADD Lab Test"
    modalRef.result.then((result) => {
      console.log(result);
      this.loadDiagnosticLab(this.page, this.limit);
    }).catch((error) => {
      console.log(error);
      this.loadDiagnosticLab(this.page, this.limit);
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
  onSearch() {
    // Get pagination values (first and rows)
     const first = this.dt1?.first || 0; // Default to 0 if dt1 is undefined or null
     const rows = this.dt1?.rows || this.limit; // Default to limit if dt1 is undefined or null
   
     // Call loadUsers with individual filters and pagination
     this.loadDiagnosticLab(first / rows, rows);
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
     this.filtered_data.sort((a: { [x: string]: string; }, b: { [x: string]: string; }) => {
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
   this.searchTestname="";
  
  //  this.searchStatus = '';
  //  this.searchUsertype = '';
   
   // Reload data without filters
   this.loadDiagnosticLab (0, this.limit);
   }
   toggleFilter(): void {
    this.showFilters = !this.showFilters;
  }

}
