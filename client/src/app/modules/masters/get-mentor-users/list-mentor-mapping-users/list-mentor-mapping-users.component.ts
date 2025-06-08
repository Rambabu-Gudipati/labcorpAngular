import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { HttpClientService } from '../../../../services/http-client-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../../../app-constants';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-list-mentor-mapping-users',

  templateUrl: './list-mentor-mapping-users.component.html',
  styleUrl: './list-mentor-mapping-users.component.scss'
})
export class ListMentorMappingUsersComponent implements OnInit {

  searchUsername:string="";
  searchEmail:string="";
  searchPhoneno:string="";
  // searchUsertype :string="";
  // searchStatus:string="";
  sortBy: string = "";
  sortOrder:string="";
  showFilters: boolean = false;
  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  items: any[] = [];


  page: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  mentorSelector = false;
  buttonTitle: string = "Save";
  deleteId: any;
  form: FormGroup;
  data: any[] = [];
  filtered_data: any[] = [];
  mentor_users_list: any[] = [];
  loading = false;
  careMentorId=0;
  Edit: any;
  Delete: any;
  username: string = '';
  selectedItems: string[];
  constructor(private httpService: HttpClientService,private fb: FormBuilder,
    private modalService: NgbModal, private toastr: ToastrService) {

  }



  ngOnInit() {
   
    this.httpService.getwithAuth(`${AppConstants.LIST_CARE_MENTOR}?page=1&limit=100`)
      .subscribe(response => {
        this.mentor_users_list = response.data;

      });


    this.selectedItems = new Array<string>();

    //this.loadNotMappingUsers(this.page, this.limit);

  }
  loadNotMappingUsers(page: number, limit: number) {
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
    this.httpService.getwithAuth(`${AppConstants.LIST_NOT_MAPPING_USERS}?${queryParams.toString()}`)
      .subscribe(res => {
        this.items = res.data;  // Update items with the response data
        this.totalPages = res.count; // Adjust according to your response structure
      });
   
  }

  onPageChange(event: any) {
    this.page = event.first / event.rows; // calculate current page
    this.limit = event.rows; // number of records per page
    this.loadNotMappingUsers(this.page, this.limit);
  }

  submit() {
    const jsonArray = this.selectedItems.map(userId => ({
      user_id: userId,
      care_mentor_id: this.careMentorId
    }));
  if(this.selectedItems.length == 0 || this.careMentorId < 1)
    {
  this.toastr.error("Please Select User and Mentors To Map The User To Mentors");
  return;
   }
    this.httpService.postWithAuth(AppConstants.SAVE_MAPPING_USERS,jsonArray).subscribe({

      next: () => {
      
    this.toastr.success('Users have been successfully mapped!');
    console.log(JSON.stringify(jsonArray, null, 2));
    }
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


  onMentorChecked($event: any, id: string) {

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



  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }
  // Delete Data
  deleteData(id: any) {
    document.getElementById('t_' + id)?.remove();
  }
 
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
        this.httpService.patch(AppConstants.UPDATE_ADVERTISERE_STATUS, data).subscribe(
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
  // onEditClick(dataModel: any) {
  //   const modalRef = this.modalService.open(AddAdvertiserComponent, { centered: true, size: 'lg' });
  //   modalRef.componentInstance.isEdit = true;
  //   modalRef.componentInstance.modalHeaderTitle = "Edit Advertiser"
  //   modalRef.componentInstance.editDataModel = dataModel;
  //   modalRef.result.then((result) => {
  //     console.log(result);
  //     this.loadGroupUsers();
  //   }).catch((error) => {
  //     console.log(error);
  //     this.loadGroupUsers();
  //   });
  // }
  // addUser() {
  //   const modalRef = this.modalService.open(AddAdvertiserComponent, { centered: true, size: 'lg' });
  //   modalRef.componentInstance.user_type = 6;
  //   modalRef.componentInstance.modalHeaderTitle = "ADD Advertiser"
  //   modalRef.result.then((result) => {
  //     console.log(result);
  //     this.loadGroupUsers();
  //   }).catch((error) => {
  //     console.log(error);
  //     this.loadGroupUsers();
  //   });


  // }

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
     this.loadNotMappingUsers(first / rows, rows);
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
   this.loadNotMappingUsers(0, this.limit);
   }
   toggleFilter(): void {
    this.showFilters = !this.showFilters;
  }
}
