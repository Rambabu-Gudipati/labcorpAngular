import { Component, ViewChild } from '@angular/core';
import { AddConfigComponent } from '../add-config/add-config.component';
import { AppConstants } from '../../../../app-constants';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list-config',

  templateUrl: './list-config.component.html',
  styleUrl: './list-config.component.scss'
})
export class ListConfigComponent {
 @ViewChild('dt1') dt1!: Table;
  searchValue: any;
  items: any[] = [];
  loading: any;
  isDtInitialized: any;
  dtElement: any;
  constructor(private httpService: HttpClientService, private alert: ToastrService, private modalservice: NgbModal) {
  
  }

 
  user_types: Array<any> = [];
  ngOnInit(): void {



     this.loadConfiguration();
  }

  loadConfiguration() {

    this.httpService.getwithAuth(AppConstants.GET_CONFIGURATION)
    .subscribe(res => {
     
      this.items = res.data;
     

    });
  }

  // removeData(id: any) {
  //   if (confirm('Do you want to remove this Invoice :' + id)) {
  //     this.httpService.get(AppConstants.LIST_AID_DEVICE).subscribe(res => {
  //       let result: any;
  //       result = res;
  //       if (result.result == 'pass') {
  //         this.alert.success('Removed Successfully.', 'Remove Invoice')
  //         this.loadGroupUsers();
  //       } else {
  //         this.alert.error('Failed to Remove.', 'Invoice');
  //       }
  //     });
  //   }
  // }

  // onEditClick(dataModel: any) {
  //   const modalRef = this.modalservice.open(AddConfigComponent, { centered: true, size: 'lg' });
  //   modalRef.componentInstance.isEdit = true;
  //   modalRef.componentInstance.modalHeaderTitle = "Edit Configuration"
  //   modalRef.componentInstance.editDataModel = dataModel;
  //   modalRef.result.then((result) => {
  //     console.log(result);
  //     this.loadConfiguration();
  //   }).catch((error) => {
  //     console.log(error);
  //     this.loadConfiguration();
  //   });
  // }

  addUser() {
    const modalRef = this.modalservice.open(AddConfigComponent, { centered: true, size: 'lg' });
    //modalRef.componentInstance.user_type = 6;
    modalRef.componentInstance.modalHeaderTitle = "ADD Configuration"
    modalRef.result.then((result) => {
      console.log(result);
      this.loadConfiguration();
    }).catch((error) => {
      console.log(error);
      this.loadConfiguration();

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
