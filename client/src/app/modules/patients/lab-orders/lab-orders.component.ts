import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { HttpClientService } from '../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../app-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lab-orders',

  templateUrl: './lab-orders.component.html',
  styleUrl: './lab-orders.component.scss'
})
export class LabOrdersComponent implements OnInit{
  loading: any;
  // dtElement: any;
  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  items: any[] = [];

  selectedItems: string[];
  page: number = 0;
  limit: number = 10;
  totalRecords: number = 0;
  mentorSelector = false;

  // getButtonClass(payment_status: string): string {
  //   switch (payment_status) {
  //     case 'Payment Completed':
  //       return 'success';
  //     case 'Payment Failed':
  //       return 'danger';
  //     case 'Payment Initiated':
  //       return 'warning';
  //     default:
  //       return 'success';
  //   }
  // }

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
 

  
  constructor(private httpService: HttpClientService, private toastr: ToastrService, private modalservice: NgbModal) {
    
  }

 

  
  dtoptions: any = {};
  orderstatus: any[] = [];
  paymentstatus: any[] = [];
  
  ngOnInit(): void {
    this.orderstatus = [
      { label: 'Open', value: 'Open' },
      { label: 'Close', value: 'Close' },
      { label: 'Cancel', value: 'Cancel' },
      { label: 'In Progress', value: 'In Progress' },
    ];
    
    this.paymentstatus = [
      { label: 'Payment Completed', value: 'Payment Completed' },
      { label: 'Payment Failed', value: 'Payment Failed' },
      { label: 'Payment Initiated', value: 'Payment Initiated' },
    ];
   
   
    // this.selectedItems = new Array<string>();
    this.loadMentorsOrders(this.page, this.limit);
  }

 
  loadMentorsOrders(page: number, limit: number) {

    this.httpService.getwithAuth(`${AppConstants.LIST_CAREMENTOR_ORDERS}?page=${this.page+1}&limit=${this.limit}`).subscribe(res => {
      this.items = res.data;
      this.totalRecords = res.total; // adjust according to your response structure
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
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalservice.open(content, { centered: true });
  }
  // Delete Data
  deleteData(id: any) {
    document.getElementById('t_' + id)?.remove();
  }

  // onEditClick(dataModel: any) {
  //   const modalRef = this.modalservice.open(AddCareMentorComponent, { centered: true, size: 'lg' });
  //   modalRef.componentInstance.isEdit = true;
  //   modalRef.componentInstance.modalHeaderTitle = "Edit Aid device"
  //   modalRef.componentInstance.editDataModel = dataModel;
  //   modalRef.result.then((result) => {
  //     console.log(result);
  //     this.loadMentors(this.page, this.limit);
  //   }).catch((error) => {
  //     console.log(error);
  //     this.loadMentors(this.page, this.limit);
  //   });
  // }

  // addUser() {
  //   const modalRef = this.modalservice.open(AddCareMentorComponent, { centered: true, size: 'xl' });
  //   modalRef.componentInstance.user_type = 6;
  //   modalRef.componentInstance.modalHeaderTitle = "ADD Aid device"
  //   modalRef.result.then((result) => {
  //     console.log(result);
  //     this.loadMentors(this.page, this.limit);
  //   }).catch((error) => {
  //     console.log(error);
  //     this.loadMentors(this.page, this.limit);
  //   });

  // }
  filterGlobal(event: Event) {
    const value = (event.target as HTMLInputElement)?.value;
    if (value) {
      this.dt1.filterGlobal(value, 'contains');
    }
  }
  clear() {
    this.dt1.clear();
  }
  // onUserChecked($event: any, id: string) {

  //   if ($event.target.checked) {
  //     console.log(id + 'Checked');
  //     this.selectedItems.push(id);
  //   }
  //   else {
  //     console.log(id + 'UNChecked');
  //     this.selectedItems = this.selectedItems.filter(m => m != id);
  //   }
  //   console.log(this.selectedItems);

  // }
  onPageChange(event: any) {
    this.page = event.first / event.rows; // calculate current page
    this.limit = event.rows; // number of records per page
    this.loadMentorsOrders(this.page, this.limit);
  }
}
