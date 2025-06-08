import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../../../app-constants';
import { HttpClientService } from '../../../../services/http-client-service';
import { UtilsServiceService } from '../../../../services/util-service';
import { AddCareTeamComponent } from '../../careteam/add-care-team/add-care-team.component';
import { Subject } from 'rxjs';
import { Table } from 'primeng/table';
import { UpdateCareDoctorComponent } from '../update-care-doctor/update-care-doctor.component';

@Component({
  selector: 'app-list-care-doctor',
  templateUrl: './list-care-doctor.component.html',
  styleUrl: './list-care-doctor.component.scss'
})
export class ListCareDoctorComponent implements OnInit{
  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  items: any[] = [];
  searchUsername:string="";
  searchEmail:string="";
  searchPhoneno:string="";
  // searchUsertype :string="";
  // searchStatus:string="";
  sortBy: string = "";
  sortOrder:string="";
  showFilters: boolean = false;
  data: any[] = [];
  page: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  loading = false;
  deleteId: any;
  statuses: any[] = [];
  constructor(private httpService: HttpClientService,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private util: UtilsServiceService) { }

  ngOnInit() {

    // this.loadDoctors(this.page, this.limit);

  }
  loadCareDoctors(page:number,limit:number) {

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
    // if (this.searchStatus) {
    //   queryParams.set('status', this.searchStatus);
    // }
    // if (this.searchUsertype) {
    //   queryParams.set('user_type',this.searchUsertype);
    // }

    // Make the HTTP request with query parameters
    this.httpService.getwithAuth(`${AppConstants.LIST_CARE_DOCTOR}?${queryParams.toString()}`)
      .subscribe(res => {
        this.items = res.data;  // Update items with the response data
        this.totalPages = res.count; // Adjust according to your response structure
      });
     
  }
  onPageChange(event: any) {
    this.page = event.first / event.rows; // calculate current page
    this.limit = event.rows; // number of records per page
    this.loadCareDoctors(this.page, this.limit);
  }

  getStatusLabel(status: number): string {
    return status === 1 ? 'Active' : status === 2 ? 'Inactive' : 'Unknown';
  }
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }
  // Delete Data
  deleteData(id: any) {
    document.getElementById('t_' + id)?.remove();
  }
  resetForm() {

  }
  addCareDoctor() {
    const modalRef = this.modalService.open(AddCareTeamComponent,  { centered: true, size: 'lg' });
    modalRef.componentInstance.user_type = 6;
    modalRef.componentInstance.modalHeaderTitle = "ADD Care Doctor"
    modalRef.result.then((result) => {
      console.log(result);
      this.loadCareDoctors(this.page, this.limit);
    }).catch((error) => {
      console.log(error);
    });


  }
   onEditClick(dataModel: any) {
      const modalRef = this.modalService.open(UpdateCareDoctorComponent, { centered: true, size: 'lg' });
      modalRef.componentInstance.isEdit = true;
      modalRef.componentInstance.modalHeaderTitle = "Edit Doctor Details"
      modalRef.componentInstance.editDataModel = dataModel;
      modalRef.result.then((result) => {
        console.log(result);
        this.loadCareDoctors(this.page,this.limit);
      }).catch((error) => {
        console.log(error);
        this.loadCareDoctors(this.page,this.limit);
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
     this.loadCareDoctors(first / rows, rows);
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
  //  this.searchStatus = '';
  //  this.searchUsertype = '';
   
   // Reload data without filters
   this.loadCareDoctors(0, this.limit);
   }
   toggleFilter(): void {
    this.showFilters = !this.showFilters;
  }
}
