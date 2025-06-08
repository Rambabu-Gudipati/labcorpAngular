import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { HttpClientService } from '../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../app-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-mentor-orders',

  templateUrl: './list-mentor-orders.component.html',
  styleUrl: './list-mentor-orders.component.scss'
})
export class ListMentorOrdersComponent implements OnInit{
  loading: any;
  // dtElement: any;
  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  items: any[] = [];

  selectedItems: string[];
  page: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  mentorSelector = false;
  deleteId: any;
  dtoptions: any = {};
  orderstatus: any[] = [];
  paymentstatus: any[] = [];
  status:any;
  sortBy: string = "";
  sortOrder:string="";

  
  constructor(private httpService: HttpClientService, private toastr: ToastrService, private router: Router, private modalservice: NgbModal,private route: ActivatedRoute) {
    
  }

 

  
 
  ngOnInit(): void {
    this.orderstatus = [
      { label: 'Open', value: 'Open' },
      { label: 'Close', value: 'Close' },
      { label: 'Cancelled', value: 'Cancelled' },
      { label: 'In Progress', value: 'In Progress' },
      { label: 'Payment Not Completed', value: 'Payment Not Completed' },
    ];
    
    this.paymentstatus = [
      { label: 'Payment Completed', value: 'Payment Completed' },
      { label: 'Payment Failed', value: 'Payment Failed' },
      { label: 'Payment Initiated', value: 'Payment Initiated' },
    ];
   
   
    // this.selectedItems = new Array<string>();
    //this.loadMentorsOrders(this.page, this.limit);
  }

 
  loadMentorsOrders(page: number, limit: number) {

    this.httpService.getwithAuth(`${AppConstants.LIST_CAREMENTOR_ORDERS}?page=${page+1}&limit=${limit}`).subscribe(res => {
      this.items = res.data;
      this.totalPages = res.count; // adjust according to your response structure
    });

  }
  showOrdersData(id: any) {
    
   

    const url = `/mentormodule/view-orders/${id}`; // Construct the URL

    window.open(url, '_blank');
    
   
  }

 
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

  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalservice.open(content, { centered: true });
  }
  // Delete Data
  deleteData(id: any) {
    document.getElementById('t_' + id)?.remove();
  }

 
  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement)?.value;
    if (value) {
      this.dt1.filterGlobal(value, 'contains');
    }
  }
  clear() {
    this.dt1.clear();
  }
  
  onPageChange(event: any) {
    this.page = event.first / event.rows; // calculate current page
    this.limit = event.rows; // number of records per page
    this.loadMentorsOrders(this.page, this.limit);
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
  getPaymentstatus(payment_status: string) {
    switch (payment_status) {
      case 'Payment Failed':
        return 'danger';

      case 'Payment Completed':
        return 'success';
        
      case 'Payment Initiated':
        return 'warning';

      default:
        return 'success';
    }
  }
}
