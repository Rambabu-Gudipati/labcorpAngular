import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppConstants } from '../../../app-constants';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientService } from '../../../services/http-client-service';
import { AddAidDevicesComponent } from '../add-aid-devices/add-aid-devices.component';
import { Observable } from 'rxjs';
import { Table, TableModule } from 'primeng/table';
@Component({
  selector: 'app-list-aid-devices',

  templateUrl: './list-aid-devices.component.html',
  styleUrl: './list-aid-devices.component.scss'
})
export class ListAidDevicesComponent implements OnInit {

  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  items: any[] = [];
  manufacturers_list: Array<any> = [];
  brands_list: Array<any> = [];
  loading: any;
  page: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  
  searchManufacturername:string="";
  searchBranchname:string="";
  searchModelno:string="";
  searchSerialno:string="";
   searchAidDeviceid :string="";
  // searchStatus:string="";
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

  @ViewChild('content') popupview !: ElementRef;
  panelShow = true;
  filtered_data: any;
  pdfurl = '';
  invoiceno: any;
  user_types: Array<any> = [];
  ngOnInit(): void {
    this.httpService.get(AppConstants.GET_AID_BRANDS)
    .subscribe(response => {
      this.brands_list = response;
     
    });
    this.httpService.get(AppConstants.GET_AID_MANUFACTURERS)
    .subscribe(response => {
      this.manufacturers_list = response;
      
     
    });
    //this.loadAidDevices(this.page, this.limit);
  }

  loadAidDevices(page:number,limit:number) {
    const queryParams = new URLSearchParams();
  
    // Add pagination parameters
    queryParams.set('page', (page + 1).toString());  // PrimeNG is zero-based, so add 1 for the API
    queryParams.set('limit', limit.toString());
    
    if (this.searchManufacturername) {
      queryParams.set('manufacturer_id', this.searchManufacturername);
    }
    if (this.searchBranchname) {
      queryParams.set('brand_id', this.searchBranchname);
    }
    if (this.searchModelno) {
      queryParams.set('model_no', this.searchModelno);
    }
    if (this.searchSerialno) {
      queryParams.set('serial_no', this.searchSerialno);
    }
    if (this.searchAidDeviceid) {
      queryParams.set('aid_device_id', this.searchAidDeviceid);
    }
    // if (this.searchStatus) {
    //   queryParams.set('status', this.searchStatus);
    // }
    // if (this.searchUsertype) {
    //   queryParams.set('user_type',this.searchUsertype);
    // }

    // Make the HTTP request with query parameters
    this.httpService.getwithAuth(`${AppConstants.LIST_AID_DEVICE}?${queryParams.toString()}`)
      .subscribe(res => {
        this.items = res.data;  // Update items with the response data
        this.totalPages = res.count; // Adjust according to your response structure
      });
   
   

  }
  
 onPageChange(event: any) {
    this.page = event.first / event.rows; // calculate current page
    this.limit = event.rows; // number of records per page
    this.loadAidDevices(this.page, this.limit);
  }

  removeData(id: any) {
    if (confirm('Do you want to remove this Invoice :' + id)) {
      this.httpService.get(AppConstants.LIST_AID_DEVICE).subscribe(res => {
        let result: any;
        result = res;
        if (result.result == 'pass') {
          this.alert.success('Removed Successfully.', 'Remove Invoice')
          this.loadAidDevices(this.page, this.limit);
        } else {
          this.alert.error('Failed to Remove.', 'Invoice');
        }
      });
    }
  }

  onEditClick(dataModel: any) {
    const modalRef = this.modalservice.open(AddAidDevicesComponent, { centered: true, size: 'xl' });
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.modalHeaderTitle = "Edit Aid device"
    modalRef.componentInstance.editDataModel = dataModel;
    modalRef.result.then((result) => {
      console.log(result);
      this.loadAidDevices(this.page, this.limit);
    }).catch((error) => {
      console.log(error);
      this.loadAidDevices(this.page, this.limit);
    });
  }

  addUser() {
    const modalRef = this.modalservice.open(AddAidDevicesComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.user_type = 6;
    modalRef.componentInstance.modalHeaderTitle = "ADD Aid device"
    modalRef.result.then((result) => {
      console.log(result);
      this.loadAidDevices(this.page, this.limit);
    }).catch((error) => {
      console.log(error);
      this.loadAidDevices(this.page, this.limit);
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
     this.loadAidDevices(first / rows, rows);
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
   this.searchManufacturername="";
  this.searchBranchname="";
  this.searchModelno="";
  this.searchSerialno="";
   this.searchAidDeviceid="";
  //  this.searchStatus = '';
  //  this.searchUsertype = '';
   
   // Reload data without filters
   this.loadAidDevices(0, this.limit);
   }
   toggleFilter(): void {
    this.showFilters = !this.showFilters;
  }
}