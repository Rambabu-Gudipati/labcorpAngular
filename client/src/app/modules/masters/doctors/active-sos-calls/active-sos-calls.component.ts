import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../../../app-constants';
import { HttpClientService } from '../../../../services/http-client-service';
import { UtilsServiceService } from '../../../../services/util-service';

@Component({
  selector: 'app-active-sos-calls',
  templateUrl: './active-sos-calls.component.html',
  styleUrl: './active-sos-calls.component.scss'
})
export class ActiveSosCallsComponent {


  items: any[] = [];
  pageOfItems?: Array<any>;
  sortProperty: string = 'doctor_name';
  sortOrder = 1;
  loading = false;
  deleteId: any;
  constructor(private httpService: HttpClientService,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private util: UtilsServiceService) { }

  ngOnInit() {
    // fetch items from the backend api
    this.loading = true;
    this.httpService.get(AppConstants.LIST_CARE_DOCTOR)
      .subscribe(x => {
        this.items = x.data;
        this.loading = false;
      });
  }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.pageOfItems = pageOfItems;
  }

  sortBy(property: string) {
    this.sortOrder = property === this.sortProperty ? (this.sortOrder * -1) : 1;
    this.sortProperty = property;
    this.items = [...this.items.sort((a: any, b: any) => {
      // sort comparison function
      let result = 0;
      if (a[property] < b[property]) {
        result = -1;
      }
      if (a[property] > b[property]) {
        result = 1;
      }
      return result * this.sortOrder;
    })];
  }

  sortIcon(property: string) {
    if (property === this.sortProperty) {
      return this.sortOrder === 1 ? '☝️' : '👇';
    }
    return '';
  }

  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }
  // Delete Data
  deleteData(id: any) {
    document.getElementById('t_' + id)?.remove();
  }
  resetForm() {

  }
}
