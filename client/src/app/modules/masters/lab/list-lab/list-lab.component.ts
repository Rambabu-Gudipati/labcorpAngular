import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../../app-constants';
import Swal from 'sweetalert2';
import { AddLabComponent } from '../add-lab/add-lab.component';

@Component({
  selector: 'app-list-lab',
 
  templateUrl: './list-lab.component.html',
  styleUrl: './list-lab.component.scss'
})
export class ListLabComponent implements OnInit{
  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  items: any[] = [];
  form: any;
  searchLabname:string="";
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

  page: number = 0;
  limit: number = 10;
  totalPages: number = 0;

  deleteId: any;
  loading = false;
  Edit: any;
  Delete: any;

  constructor(private httpService: HttpClientService,
    private modalService: NgbModal, private toastr: ToastrService) { }

  ngOnInit() {

    //this.loadLabUsers(this.page,this.limit);

  }
  loadLabUsers(page: number, limit: number) {
    
    const queryParams = new URLSearchParams();
  
    // Add pagination parameters
    queryParams.set('page', (page + 1).toString());  // PrimeNG is zero-based, so add 1 for the API
    queryParams.set('limit', limit.toString());
    
    if (this.searchLabname) {
      queryParams.set('lab_name', this.searchLabname );
    }
   
    // if (this.searchStatus) {
    //   queryParams.set('status', this.searchStatus);
    // }
    // if (this.searchUsertype) {
    //   queryParams.set('user_type',this.searchUsertype);
    // }

    // Make the HTTP request with query parameters
    this.httpService.getwithAuth(`${AppConstants.LIST_LAB}?${queryParams.toString()}`)
      .subscribe(res => {
        this.items = res.data;  // Update items with the response data
        this.totalPages = res.count; // Adjust according to your response structure
      });
   
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
        this.httpService.patch(AppConstants.UPDATE_GROUP_USER_STATUS,JSON.stringify(this.form.value, null, 2)).subscribe(
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
  onEditClick(dataModel: any) {
    const modalRef = this.modalService.open(AddLabComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.modalHeaderTitle = "Edit Labs "
    modalRef.componentInstance.editDataModel = dataModel;
    modalRef.result.then((result) => {
      console.log(result);
      this.loadLabUsers(this.page, this.limit);
    }).catch((error) => {
      console.log(error);
      this.loadLabUsers(this.page, this.limit);
    });
  }
  addUser() {
    const modalRef = this.modalService.open(AddLabComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.user_type = 6;
    modalRef.componentInstance.modalHeaderTitle = "ADD Labs"
    modalRef.result.then((result) => {
      console.log(result);
      this.loadLabUsers(this.page, this.limit);
    }).catch((error) => {
      console.log(error);
      this.loadLabUsers(this.page, this.limit);
    });


  }
 
  onPageChange(event: any) {
    this.page = event.first / event.rows; // calculate current page
    this.limit = event.rows; // number of records per page
    this.loadLabUsers(this.page, this.limit);
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
     this.loadLabUsers(first / rows, rows);
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
     this.items.sort((a: { [x: string]: string; }, b: { [x: string]: string; }) => {
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
   this.searchLabname="";
  
  //  this.searchStatus = '';
  //  this.searchUsertype = '';
   
   // Reload data without filters
   this.loadLabUsers (0, this.limit);
   }
   toggleFilter(): void {
    this.showFilters = !this.showFilters;
  }
}
