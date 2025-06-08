import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { HttpClientService } from '../../../services/http-client-service';
import { AppConstants } from '../../../app-constants';
import { ViewPackageDetailsComponent } from '../view-package-details/view-package-details.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-list-wellness-package',

  templateUrl: './list-wellness-package.component.html',
  styleUrl: './list-wellness-package.component.scss'
})
export class ListWellnessPackageComponent {
  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  items: any = {};
  isDtInitialized: boolean = false;
  loading: any;
  sortBy: string = "";
  sortOrder:string="";
  page: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  @Input() id: any = 0;
  @ViewChild('content') popupview !: ElementRef;
 
  orderstatus: any[] = [];
  paymentstatus: any[] = [];
  constructor(private httpService: HttpClientService, private modalservice: NgbModal) {
    
  }
  
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
 
    this.loadWellnessPackage(this.page, this.limit);
  }

  loadWellnessPackage(page: number, limit: number) {
    this.httpService.getwithAuth(`${AppConstants.GET_WELLNESS_PACKAGE}?page=${page+1}&limit=${limit}`).subscribe(res => {
      this.items = res.data;
      this.totalPages = res.count; // adjust according to your response structure
    });

    // this.httpService.getwithAuth(AppConstants.GET_WELLNESS_PACKAGE).subscribe(res => {
    //   this.items = res.data;

    // });

  }
  viewPackagedetails(id:any)
  {
   const modalRef = this.modalservice.open(ViewPackageDetailsComponent, { centered: true, size: 'xl' });
   modalRef.componentInstance.id = id;
    // modalRef.componentInstance.modalHeaderTitle = "Edit Aid device"
 
    modalRef.result.then((result) => {
      console.log(result);
     
    }).catch((error) => {
      console.log(error);
    });
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
 
 

  onPageChange(event: any) {
    this.page = event.first / event.rows; // calculate current page
    this.limit = event.rows; // number of records per page
    this.loadWellnessPackage(this.page, this.limit);
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
  
}
