import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { AppConstants } from '../../../../app-constants';
import { AddEcgComponent } from '../../add-ecg/add-ecg.component';
import { AddEcgIssueComponent } from '../add-ecg-issue/add-ecg-issue.component';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list-ecg-issue',

  templateUrl: './list-ecg-issue.component.html',
  styleUrl: './list-ecg-issue.component.scss'
})
export class ListEcgIssueComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  items: any[] = [];
  isDtInitialized: any;
  dtElement: any;
  loading: any;
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

    // this.loadGroupUsers();
  }

  loadGroupUsers() {

    // this.httpService.get(AppConstants.LIST_ECG_DEVICE).subscribe(res => {
    //   this.items = res.data;

    // });

  }


  removeData(id: any) {
    if (confirm('Do you want to remove this Invoice :' + id)) {
      this.httpService.get(AppConstants.LIST_AID_DEVICE).subscribe(res => {
        let result: any;
        result = res;
        if (result.result == 'pass') {
          this.alert.success('Removed Successfully.', 'Remove Invoice')
          this.loadGroupUsers();
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
      this.loadGroupUsers();
    }).catch((error) => {
      console.log(error);
      this.loadGroupUsers();
    });
  }

  addUser() {
    const modalRef = this.modalservice.open(AddEcgIssueComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.user_type = 6;
    modalRef.componentInstance.modalHeaderTitle = "ADD Aid device"
    modalRef.result.then((result) => {
      console.log(result);
      this.loadGroupUsers();
    }).catch((error) => {
      console.log(error);
      this.loadGroupUsers();

    });

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
}
