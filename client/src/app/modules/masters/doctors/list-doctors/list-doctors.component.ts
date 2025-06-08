import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../../../app-constants';
import { HttpClientService } from '../../../../services/http-client-service';
import { UtilsServiceService } from '../../../../services/util-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Table } from 'primeng/table';
import { AddDoctorsComponent } from '../add-doctors/add-doctors.component';
import { UpdateDoctorsComponent } from '../update-doctors/update-doctors.component';

@Component({
  selector: 'app-list-doctors',
  templateUrl: './list-doctors.component.html',
  styleUrls: ['./list-doctors.component.css']
})
export class ListDoctorsComponent implements OnInit {


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
  items: any[] = [];
  pageOfItems?: Array<any>;
  loading = false;
  searchUsername:string="";
  searchEmail:string="";
  searchPhoneno:string="";

  sortBy: string = "";
  sortOrder:string="";
  showFilters: boolean = false;
  deleteId: any;
  constructor(private httpService : HttpClientService,
    private toastr: ToastrService, private router : Router,private modalService: NgbModal,
    private util: UtilsServiceService ) { }

    ngOnInit() {
      //this.loadDoctors(this.page,this.limit);
      
  }
  // fetch items from the backend api
   
loadDoctors(page: number, limit: number)
{
  this.httpService.getwithAuth(`${AppConstants.LIST_DOCTOR}?page=${page+1}&limit=${limit}`).subscribe(res => {
   this.items = res.data;
   this.totalPages = res.count; // adjust according to your response structure          
  });
}

  confirm(content: any,id:any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }
   // Delete Data
   deleteData(id:any) {
    document.getElementById('t_'+id)?.remove();
  }
  resetForm(){

  }
  onPageChange(event: any) {
    this.page = event.first / event.rows; // calculate current page
    this.limit = event.rows; // number of records per page
    this.loadDoctors(this.page, this.limit);
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

  addDoctor() {
    const modalRef = this.modalService.open(AddDoctorsComponent, { centered: true, size: 'lg' });
  
    modalRef.componentInstance.modalHeaderTitle = "ADD Doctor Details"
    modalRef.result.then((result) => {
      console.log(result);
      this.loadDoctors(this.page,this.limit);
    }).catch((error) => {
      console.log(error);
      this.loadDoctors(this.page,this.limit);
    });

}
onEditClick(dataModel: any) {
  const modalRef = this.modalService.open(UpdateDoctorsComponent, { centered: true, size: 'lg' });
  modalRef.componentInstance.isEdit = true;
  modalRef.componentInstance.modalHeaderTitle = "Edit Doctor Details"
  modalRef.componentInstance.editDataModel = dataModel;
  modalRef.result.then((result) => {
    console.log(result);
    this.loadDoctors(this.page,this.limit);
  }).catch((error) => {
    console.log(error);
    this.loadDoctors(this.page,this.limit);
  });
}
removeData(_t58: any) {
  throw new Error('Method not implemented.');
}

onSearch() {
  // Get pagination values (first and rows)
   const first = this.dt1?.first || 0; // Default to 0 if dt1 is undefined or null
   const rows = this.dt1?.rows || this.limit; // Default to limit if dt1 is undefined or null
 
   // Call loadUsers with individual filters and pagination
   this.loadDoctors(first / rows, rows);
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

 
 // Reload data without filters
 this.loadDoctors(0, this.limit);
 }
 toggleFilter(): void {
  this.showFilters = !this.showFilters;
}
  
}
