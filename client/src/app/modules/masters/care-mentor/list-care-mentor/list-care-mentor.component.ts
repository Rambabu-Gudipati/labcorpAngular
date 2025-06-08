import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UtilsServiceService } from '../../../../services/util-service';
import { AppConstants } from '../../../../app-constants';
import { AddCareMentorComponent } from '../add-care-mentor/add-care-mentor.component';
import { Observable, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list-care-mentor',

  templateUrl: './list-care-mentor.component.html',
  styleUrl: './list-care-mentor.component.scss'
})
export class ListCareMentorComponent implements OnInit {
  // isDtInitialized: boolean = false;
  loading: any;
  // dtElement: any;
  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  items: any[] = [];
  deleteId: any;
  selectedItems: string[];
  page: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  mentorSelector = false;
  searchUsername:string="";
  searchEmail:string="";
  searchPhoneno:string="";
  // searchUsertype :string="";
  // searchStatus:string="";
  sortBy: string = "";
  sortOrder:string="";
  showFilters: boolean = false;
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


  // interval:any;
  constructor(private httpService: HttpClientService, private toastr: ToastrService, private router: Router, private modalservice: NgbModal) {
    // this.httpService. listen().subscribe((m:any)=>{
    //   console.log(m);
    // this.addUser();
    // })
  }







  ngOnInit(): void {
    // this.dtoptions = {
    //   pagingType: 'full_numbers',
    //   searching: true,
    //   // paging:false
    //   lengthChange: false,
    //   language: {
    //     searchPlaceholder: 'Text search'
    //   },
    //   processing: false,
    //   serverSide: false,

    // };
    this.selectedItems = new Array<string>();
    //this.loadMentors(this.page, this.limit);
  }

  loadMentors(page: number, limit: number) {
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
    this.httpService.getwithAuth(`${AppConstants.LIST_CARE_MENTOR}?${queryParams.toString()}`)
      .subscribe(res => {
        this.items = res.data;  // Update items with the response data
        this.totalPages = res.count; // Adjust according to your response structure
      });
   
  }
  // getData(page: number, limit: number): Observable<any> {
  //   return this.httpService.get(`${AppConstants.LIST_CARE_MENTOR}?page=${page}&limit=${limit}`);
  // }

  // removeData(id: number) {
  //   if (confirm('Do you want to remove this Invoice :' + id)) {
  //     this.httpService.get(AppConstants.LIST_CARE_MENTOR).subscribe(res => {
  //       let result: any;
  //       result = res;
  //       if (result.result == 'pass') {
  //         this.alert.success('Removed Successfully.', 'Remove Invoice')
  //         this.loadMentors();
  //       } else {
  //         this.alert.error('Failed to Remove.', 'Invoice');
  //       }
  //     });
  //   }
  // }
  toggleStatus(item: any) {
    Swal.fire({
      title: 'Are You Sure!. Do you want to ' + (item.status ? 'In Activete ' : 'Activate ') + 'this account',
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: 'Yes',
      denyButtonText: 'No',
      customClass: {
        actions: 'my-actions',
        confirmButton: 'order-2',
        denyButton: 'order-3',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        var data = {
          'id': item.id,
          'status': item.status
        }
        this.httpService.patch(AppConstants.UPDATE_CARE_MENTOR, data).subscribe(
          (response: any) => {
            this.toastr.success('User has ' + (item.status ? 'In Activete ' : 'Activate ') + 'Successfully')
          },
          (error: any) => {
            console.log(error);
            this.toastr.error('Something went wrong. Try Again')
          }
        );
      } else if (result.isDenied) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }
  getStatusLabel(status: number): string {
    return status === 1 ? 'Active' : status === 2 ? 'Inactive' : 'Unknown';
  }
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalservice.open(content, { centered: true });
  }
  // Delete Data
  deleteData(id: any) {
    document.getElementById('t_' + id)?.remove();
  }

  onEditClick(dataModel: any) {
    const modalRef = this.modalservice.open(AddCareMentorComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.modalHeaderTitle = "Edit Aid device"
    modalRef.componentInstance.editDataModel = dataModel;
    modalRef.result.then((result) => {
      console.log(result);
      this.loadMentors(this.page, this.limit);
    }).catch((error) => {
      console.log(error);
      this.loadMentors(this.page, this.limit);
    });
  }

  addUser() {
    const modalRef = this.modalservice.open(AddCareMentorComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.user_type = 6;
    modalRef.componentInstance.modalHeaderTitle = "ADD Care Mentor"
    modalRef.result.then((result) => {
      console.log(result);
      this.loadMentors(this.page, this.limit);
    }).catch((error) => {
      console.log(error);
      this.loadMentors(this.page, this.limit);
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
  onUserChecked($event: any, id: string) {

    if ($event.target.checked) {
      console.log(id + 'Checked');
      this.selectedItems.push(id);
    }
    else {
      console.log(id + 'UNChecked');
      this.selectedItems = this.selectedItems.filter(m => m != id);
    }
    console.log(this.selectedItems);

  }
  onPageChange(event: any) {
    this.page = event.first / event.rows; // calculate current page
    this.limit = event.rows; // number of records per page
    this.loadMentors(this.page, this.limit);
  }
  onSearch() {
    // Get pagination values (first and rows)
     const first = this.dt1?.first || 0; // Default to 0 if dt1 is undefined or null
     const rows = this.dt1?.rows || this.limit; // Default to limit if dt1 is undefined or null
   
     // Call loadUsers with individual filters and pagination
     this.loadMentors(first / rows, rows);
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
   this.loadMentors(0, this.limit);
   } 
   toggleFilter(): void {
    this.showFilters = !this.showFilters;
  }
}






