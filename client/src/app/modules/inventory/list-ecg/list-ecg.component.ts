import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClientService } from '../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { AppConstants } from '../../../app-constants';
import { AddEcgComponent } from '../add-ecg/add-ecg.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list-ecg',

  templateUrl: './list-ecg.component.html',
  styleUrl: './list-ecg.component.scss'
})
export class ListEcgComponent implements OnInit {

  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  items: any[] = [];
  loading: any;
  isDtInitialized: any;
  dtElement: any;
  page: number = 0;
  limit: number = 10;
  totalPages: number = 0;
  searchManufacturername:string="";
  searchBranchname:string="";
  searchDeviceid:string="";
  sortBy: string = "";
  sortOrder:string="";
  showFilters: boolean = false;
  constructor(private httpService: HttpClientService, private alert: ToastrService, private router: Router, private modalservice: NgbModal) {
    // this.httpService. listen().subscribe((m:any)=>{
    //   console.log(m);
    // this.addUser();
    // })
  }
  manufacturer_list: Array<any> = [];
  models_list: Array<any> = [];
  @ViewChild('content') popupview !: ElementRef;
  panelShow = true;
  row: any;
  pdfurl = '';
  invoiceno: any;
  user_types: Array<any> = [];
  ngOnInit(): void {
    this.httpService.get(AppConstants.GET_ECG_MODELS)
    .subscribe(response => {
      this.models_list = response;
     
    });
    this.httpService.get(AppConstants.GET_ECG_MANUFACTURER)
    .subscribe(response => {
      this.manufacturer_list = response;
     
     
    });
    //this.loadEcgDevices(this.page, this.limit);
  }

  loadEcgDevices(page:number,limit:number) {

    const queryParams = new URLSearchParams();
  
    // Add pagination parameters
    queryParams.set('page', (page + 1).toString());  // PrimeNG is zero-based, so add 1 for the API
    queryParams.set('limit', limit.toString());
    
    if (this.searchManufacturername) {
      queryParams.set('manufacturer_id', this.searchManufacturername);
    }
    if (this.searchBranchname) {
      queryParams.set('device_model_id', this.searchBranchname);
    }
    if (this.searchDeviceid) {
      queryParams.set('device_id', this.searchDeviceid);
    }
   
    // if (this.searchStatus) {
    //   queryParams.set('status', this.searchStatus);
    // }
    // if (this.searchUsertype) {
    //   queryParams.set('user_type',this.searchUsertype);
    // }

    // Make the HTTP request with query parameters
    this.httpService.getwithAuth(`${AppConstants.LIST_ECG_DEVICE}?${queryParams.toString()}`)
      .subscribe(res => {
        this.items = res.data;  // Update items with the response data
        this.totalPages = res.count; // Adjust according to your response structure
      });
   
    
  }
 
 onPageChange(event: any) {
    this.page = event.first / event.rows; // calculate current page
    this.limit = event.rows; // number of records per page
    this.loadEcgDevices(this.page, this.limit);
  }
  removeData(id: any) {
    if (confirm('Do you want to remove this Invoice :' + id)) {
      this.httpService.get(AppConstants.LIST_ECG_DEVICE).subscribe(res => {
        let result: any;
        result = res;
        if (result.result == 'pass') {
          this.alert.success('Removed Successfully.', 'Remove Invoice')
          this.loadEcgDevices(this.page, this.limit);
        } else {
          this.alert.error('Failed to Remove.', 'Invoice');
        }
      });
    }
  }

  onEditClick(dataModel: any) {
    const modalRef = this.modalservice.open(AddEcgComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.modalHeaderTitle = "Edit Aid device"
    modalRef.componentInstance.editDataModel = dataModel;
    modalRef.result.then((result) => {
      console.log(result);
      this.loadEcgDevices(this.page, this.limit);
    }).catch((error) => {
      console.log(error);
      this.loadEcgDevices(this.page, this.limit);
    });
  }

  addUser() {
    const modalRef = this.modalservice.open(AddEcgComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.user_type = 6;
    modalRef.componentInstance.modalHeaderTitle = "ADD Aid device"
    modalRef.result.then((result) => {
      console.log(result);
      this.loadEcgDevices(this.page, this.limit);
    }).catch((error) => {
      console.log(error);
      this.loadEcgDevices(this.page, this.limit);
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
     this.loadEcgDevices(first / rows, rows);
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
  this.searchDeviceid="";

  //  this.searchStatus = '';
  //  this.searchUsertype = '';
   
   // Reload data without filters
   this.loadEcgDevices (0, this.limit);
   }
   toggleFilter(): void {
    this.showFilters = !this.showFilters;
  }
}
