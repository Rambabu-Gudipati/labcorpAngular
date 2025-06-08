import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../../../app-constants';
import { HttpClientService } from '../../../../services/http-client-service';
import { UtilsServiceService } from '../../../../services/util-service';
import { AddGroupUserComponent } from '../../group-users/add-group-user/add-group-user.component';
import { AddGroupCenterComponent } from '../add-group-center/add-group-center.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-group-centers',
  templateUrl: './list-group-centers.component.html',
  styleUrls: ['./list-group-centers.component.css']
})
export class ListGroupCentersComponent implements OnInit {
  
  searchText: string = '';
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  pageOfItems?: Array<any>;
  _pageOfItems?: Array<any>;

  data: any[] = [];
  filtered_data: any[] = [];
  checked: boolean;
  loading = false;
  Edit: any;
  Delete: any;
  deleteId: any;
  constructor(private httpService: HttpClientService,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private util: UtilsServiceService) { }

  ngOnInit() {

    this.loadGroupUsers();

  }
  loadGroupUsers() {
    this.loading = true;
    this.httpService.getwithAuth(AppConstants.LIST_USER_LOCATIONS)
      .subscribe(x => {
        this.loading = false;
        this.data = x.data;
        this.filtered_data = x.data;
      });
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
        this.httpService.patch(AppConstants.UPDATE_GROUP_CHANGE_STATUS, data).subscribe(
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
    this.modalService.open(content, { centered: true });
  }
  // Delete Data
  deleteData(id: any) {
    document.getElementById('t_' + id)?.remove();
  }

  onEditClick(dataModel: any) {
    const modalRef = this.modalService.open(AddGroupCenterComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.modalHeaderTitle = "Edit Group Center"
    modalRef.componentInstance.editDataModel = dataModel;
    modalRef.result.then((result) => {
      console.log(result);
      this.loadGroupUsers();
    }).catch((error) => {
      console.log(error);
      this.loadGroupUsers();
    });
  }
  addUser() {
    const modalRef = this.modalService.open(AddGroupCenterComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.user_type = 6;
    modalRef.componentInstance.modalHeaderTitle = "ADD Group Center"
    modalRef.result.then((result) => {
      console.log(result);
      this.loadGroupUsers();
    }).catch((error) => {
      console.log(error);
      this.loadGroupUsers();
    });


  }
  searchItems(): any[] {
    this.filtered_data = this.data.filter(item => item.center_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.mobile_no.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(this.searchText.toLowerCase()) ||
      item.city_name.toLowerCase().includes(this.searchText.toLowerCase()));
    return this.filtered_data;
  }
  sortItems(column: string) {
    this.sortColumn = column;
    this.filtered_data.sort((a, b) => a[column].localeCompare(b[column]));
  }

  onSort(column: string): void {
    this.sortDirection = this.sortColumn === column ? (this.sortDirection === 'asc' ? 'desc' : 'asc') : 'asc';
    this.sortColumn = column;
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
    this._pageOfItems = pageOfItems;
  }
  sortIcon(property: string) {
    if (property === this.sortColumn) {
      this.sortDirection === 'asc' ? 'desc' : 'asc'
      return this.sortDirection === 'asc' ? '☝️' : '👇';
    }
    return '';
  }

  

}
