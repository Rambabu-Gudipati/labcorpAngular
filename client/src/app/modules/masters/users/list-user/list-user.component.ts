import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpClientService } from '../../../../services/http-client-service';
import { UtilsServiceService } from '../../../../services/util-service';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { AppConstants } from '../../../../app-constants';
import { NgFor, NgIf } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css'],
})
export class ListUserComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
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
  page: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  selectedCustomers!: any;
  items: any[] = [];
  user_types: Array<any> = [];

  modalHeaderTitle: string = "ADD User";
  buttonTitle: string = "Save";
  sortBy: string = "";
  sortOrder:string="";
  showFilters: boolean = false;
 
  loading = false;
  isLoading = false;
  isError = false;
  searchUsername:string="";
  searchEmail:string="";
  searchPhoneno:string="";
  searchUsertype :string="";
  searchStatus:string="";
  user_id: Number = 0;
  statuses: any[] = [];
  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    mobile_no: new FormControl(''),
    email: new FormControl(''),
    user_type: new FormControl('')
  });
  submitted = false
  constructor(private httpService: HttpClientService,
    private toastr: ToastrService, private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private util: UtilsServiceService) { }

  ngOnInit() {

    this.statuses = [
      { label: 'Active', id: '1' },
      { label: 'In Active', id: '2' },
    ];
    this.form = this.formBuilder.group(
      {

        email: ['', [Validators.required, Validators.email]],
        mobile_no: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]],
        user_type: ['', [Validators.required]],
        username: ['', [Validators.required, Validators.minLength(6)]],
      }
    );

   
    this.httpService.get(AppConstants.LIST_USER_TYPES)  
      .subscribe(x => {

        for (var i = 1; i <= 6; i++) {
          this.user_types.push(x.data[i]);
        }

      
      });
      
  }
  loadUsers(page: number, limit: number) {
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
    // Ensure it's not undefined or null

  // Call loadUsers with page, limit, and searchValue
  this.loadUsers(this.page, this.limit);
  }
  addUser(content: any) {
    this.form.reset();
    this.user_id = 0;
    this.buttonTitle = "Save";
    this.modalHeaderTitle = "ADD User";
    this.modalService.open(content, { centered: true });
  }
  editUser(data: any, content: any) {
    this.buttonTitle = "Update";
    this.modalHeaderTitle = "Edit User";
    this.user_id = Number(data.id);
    this.form.controls['user_type'].setValue(data.user_type_id);
    this.form.controls['username'].setValue(data.user_name);
    this.form.controls['email'].setValue(data.email);
    this.form.controls['mobile_no'].setValue(data.phone_no);
    this.modalService.open(content, { centered: true });
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  onSubmit(): void {
    this.submitted = true;
    console.log(this.form);
    if (this.form.invalid) {
      return;
    }
    if (this.user_id == 0) {
      this.httpService.postWithAuth(AppConstants.CREATE_USER, JSON.stringify(this.form.value, null, 2)).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        error => {
          this.showErrorMessage(error);
        }
      );
    } else {
      var test = this.form.value.HashMap();
      test.add({ id: this.user_id });

      this.httpService.patch(AppConstants.UPDATE_USER, JSON.stringify(test, null, 2)).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        error => {
          this.showErrorMessage(error);
        }
      );
    }
  }
  private showErrorMessage(error: any) {
    console.error('An error occurred:', error);
    this.isError = true;
    this.isLoading = false;
    if (error.message == null || error.message == undefined) {
      this.toastr.error(error.message, "Error");
    } else {
      this.toastr.error(error, "Error");
    }
  }

  private showSuccessMessage(response: any) {
    var data = response;
    this.isLoading = false;
    //this.toastr.success(data.message, "Success");
    Swal.fire('Saved!', data.message, 'success')
    this.form.reset();
    this.modalService.dismissAll();
  }

  resetForm() {
    this.form.reset();
  }
  dismissModal() {
    this.modalService.dismissAll();
  }
  onSearch() {
   // Get pagination values (first and rows)
    const first = this.dt1?.first || 0; // Default to 0 if dt1 is undefined or null
    const rows = this.dt1?.rows || this.limit; // Default to limit if dt1 is undefined or null
  
    // Call loadUsers with individual filters and pagination
    this.loadUsers(first / rows, rows);
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
  this.loadUsers(0, this.limit);
  }
  // Initially hidden
  toggleFilter(): void {
    this.showFilters = !this.showFilters;
  }
}
