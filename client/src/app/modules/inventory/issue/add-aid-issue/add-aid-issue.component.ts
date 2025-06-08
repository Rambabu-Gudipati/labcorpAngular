import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AppConstants } from '../../../../app-constants';
import { HttpClientService } from '../../../../services/http-client-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-add-aid-issue',

  templateUrl: './add-aid-issue.component.html',
  styleUrl: './add-aid-issue.component.scss'
})
export class AddAidIssueComponent {

  @Input() modalHeaderTitle: string = "ADD Issues";
  @Input() editDataModel: any = {};
  @Input() isEdit: boolean = false;
  @ViewChild('dt1') dt1!: Table;
  @ViewChild('content') popupview !: ElementRef;
  panelShow = true;
  // filtered_data: any;
  pdfurl = '';
  invoiceno: any;
  user_types: Array<any> = [];
  sortColumn: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  filtered_data: any[] = [];
  data: any[] = [];
  loading = false;
  group_users_list: Array<any> = [];

  numof_devices: Array<any> = [];
  buttonTitle: string = "Save";
  id: number = 0;
  form: FormGroup;
  submitted = false
  onStateChanged: any;
  // checkboxes: any;
  // numDevices: number;
  // startId: null;
  // endId: null;
  // selectedDevices: never[];
  devices: any;
  items: any[];
  searchValue: any;
  constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private activeModal: NgbActiveModal,) { }


  ngOnInit() {

    this.loadfiltereddata();
  }

  loadfiltereddata() {
    this.loading = true;
    this.httpService.getwithAuth(AppConstants.LIST_AID_DEVICE)
      .subscribe(x => {
        this.loading = false;
        this.data = x.data;
        this.items = x.data;

      });


    // Loadin States

    this.httpService.get(AppConstants.LIST_GROUP_USERS)
      .subscribe(response => {
        this.group_users_list = response.data;

      });
    // this.httpService.get(AppConstants.GET_AID_MANUFACTURERS)
    // .subscribe(response => {
    //   this.manufacturers_list = response;
    //   if (this.isEdit === true) {
    //     this.bindData();
    //   }

    // });



    this.form = this.formBuilder.group(
      {
        // id: [''],
        issue_date: ['', [Validators.required]],
        issue_no: ['', [Validators.required]],
        issue_to: ['', [Validators.required]],
        numof_devices: ['', [Validators.required]],
        issue_by: ['', [Validators.required]],

      }
    );

  }

  bindData() {

    this.form.patchValue({
      issue_date: this.editDataModel?.issue_date,
      issue_no: this.editDataModel?.issue_no,
      issue_to: this.editDataModel?.issue_to,
      numof_devices: this.editDataModel?.numof_devices,
      issue_by: this.editDataModel?.issue_by,


    });
    this.onStateChanged(this.editDataModel?.issue_to)
    this.form.patchValue({
      // issue_to: this.editDataModel?.issue_to,

    });


  }
  dismissModal() {
    this.activeModal.close();
  }
  onSubmit(): void {

    this.submitted = true;
    console.log(this.form);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.isEdit == false) {
      this.httpService.postWithAuth(AppConstants.CREATE_AID_DEVICE, JSON.stringify(this.form.value, null, 2)).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        (error: any) => {
          console.log(error);
          this.showErrorMessage(error);
        }
      );
    } else {
      this.form.value['id'] = this.editDataModel?.id;
      this.httpService.patch(AppConstants.UPDATE_AID_DEVICE, JSON.stringify(this.form.value, null, 2)).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        error => {
          this.showErrorMessage(error);
        }
      );
    }
  }
  private showErrorMessage(error: any) {
    console.error('An error occurred:', error);
    this.toastr.error(error, "Error");

  }

  private showSuccessMessage(response: any) {
    var data = response;
    // this.toastr.success(data.message, "Success");
    Swal.fire(this.isEdit ? 'Updated' : 'Saved', data.message, 'success')
    this.form.reset();
    this.modalService.dismissAll(true);
  }

  resetForm() {
    this.form.reset();
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }


  onEditClick(dataModel: any) {
    const modalRef = this.modalService.open(AddAidIssueComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.modalHeaderTitle = "Edit Aid device"
    modalRef.componentInstance.editDataModel = dataModel;
    modalRef.result.then((result) => {
      console.log(result);
      this.loadfiltereddata();
    }).catch((error) => {
      console.log(error);
      this.loadfiltereddata();
    });
  }
  //   checks=false;
  //  checkboxes:[checked:number]=[{}]
  //   isSelected(e:any)
  //   {
  //     for (let index = 0; index < array.length; index++) {
  //       const element = array[index];
  //       const checkedCheckboxes = this.checkboxes.filter(checkbox => checkbox.checked);
  //       if (checkedCheckboxes.length > this.numof_devices) {

  //     }

  // if(e.target.checked.length > this.numof_devices){
  //   this.checks = true;
  //  }
  // else{
  //   alert(`You can select up to ${this.numof_devices} devices.`);
  //   return;

  //   }


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
}
