import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { AppConstants } from '../../../../app-constants';
import { UploadGroupCenterUserComponent } from '../upload-group-center-user/upload-group-center-user.component';
import { AddGroupCenterUsersComponent } from '../add-group-center-users/add-group-center-users.component';
import { Table } from 'primeng/table';
import { NumberLiteralType } from 'typescript';

@Component({
  selector: 'app-list-group-center-users',

  templateUrl: './list-group-center-users.component.html',
  styleUrl: './list-group-center-users.component.scss'
})
export class ListGroupCenterUsersComponent implements OnInit {

  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
 
  loading: boolean;
  submitted: any;
  @ViewChild('content') popupview !: ElementRef;
  panelShow = true;
  Invoiceheader: any;
  pdfurl = '';
  invoiceno: any;
  dtoptions: any = {};
  sortBy: string = "";
  sortOrder:string="";
  user_types: Array<any> = [];
  items: any[] = [];
  page: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  searchUsername:string="";
  searchEmail:string="";
  searchPhoneno:string="";
  searchUsertype :string="";
  searchStatus:string="";
  showFilters: boolean = false;
  modalHeaderTitle: string = "ADD User";

  constructor(private httpService: HttpClientService, private alert: ToastrService, private router: Router, private modalservice: NgbModal) { }

  
  ngOnInit(): void {
    this.httpService.get(AppConstants.LIST_USER_TYPES)
      .subscribe(x => {

        for (var i = 1; i <= 6; i++) {
          this.user_types.push(x.data[i]);
        }

        this.loading = false;

      });
    //this.loadGroupUsers(this.page, this.limit);
  }

  loadGroupUsers(page: number, limit: number) {
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
    if (this.searchStatus) {
      queryParams.set('status', this.searchStatus);
    }
    if (this.searchUsertype) {
      queryParams.set('user_type',this.searchUsertype);
    }

    // Make the HTTP request with query parameters
    this.httpService.getwithAuth(`${AppConstants.LIST_USERS}?${queryParams.toString()}`)
      .subscribe(res => {
        this.items = res.data;  // Update items with the response data
        this.totalPages = res.count; // Adjust according to your response structure
      });
  }
  
 onPageChange(event: any) {
    this.page = event.first / event.rows; // calculate current page
    this.limit = event.rows; // number of records per page
    this.loadGroupUsers(this.page, this.limit);
  }
  onSearch() {
    // Get pagination values (first and rows)
     const first = this.dt1?.first || 0; // Default to 0 if dt1 is undefined or null
     const rows = this.dt1?.rows || this.limit; // Default to limit if dt1 is undefined or null
   
     // Call loadUsers with individual filters and pagination
     this.loadGroupUsers(first / rows, rows);
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
   this.searchStatus = '';
   this.searchUsertype = '';
   
   // Reload data without filters
   this.loadGroupUsers(0, this.limit);
   }
   toggleFilter(): void {
    this.showFilters = !this.showFilters;
  }
  removeData(id: any) {
    if (confirm('Do you want to remove this Invoice :' + id)) {
      this.httpService.get(AppConstants.LIST_AID_DEVICE).subscribe(res => {
        let result: any;
        result = res;
        if (result.result == 'pass') {
          this.alert.success('Removed Successfully.', 'Remove Invoice')
          this.loadGroupUsers(this.page, this.limit);
        } else {
          this.alert.error('Failed to Remove.', 'Invoice');
        }
      });
    }
  }

  onEditClick(dataModel: any) {
    const modalRef = this.modalservice.open(AddGroupCenterUsersComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.modalHeaderTitle = "Edit Aid device"
    modalRef.componentInstance.editDataModel = dataModel;
    modalRef.result.then((result) => {
      console.log(result);
      this.loadGroupUsers(this.page, this.limit);
    }).catch((error) => {
      console.log(error);
      this.loadGroupUsers(this.page, this.limit);
    });
  }

  bulkUpload() {
    const modalRef = this.modalservice.open(UploadGroupCenterUserComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.user_type = 6;
    modalRef.componentInstance.modalHeaderTitle = "Upload"
    modalRef.result.then((result) => {
      console.log(result);
    }).catch((error) => {
      console.log(error);
    });
  }
  addUser() {
    const modalRef = this.modalservice.open(AddGroupCenterUsersComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.user_type = 6;
    modalRef.componentInstance.modalHeaderTitle = "ADD Group Center Users"
    modalRef.result.then((result) => {
      console.log(result);
      this.loadGroupUsers(this.page, this.limit);
    }).catch((error) => {
      console.log(error);
      this.loadGroupUsers(this.page, this.limit);
    });

  }

  dismissModal() {
    this.modalservice.dismissAll();
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

}