import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AppConstants } from '../../../app-constants';
import { HttpClientService } from '../../../services/http-client-service';

@Component({
  selector: 'app-add-advertiser',
  templateUrl: './add-advertiser.component.html',
  styleUrls: ['./add-advertiser.component.css']
})
export class AddAdvertiserComponent implements OnInit {

  @Input() modalHeaderTitle: string = "ADD Group User";
  @Input() editDataModel: any = {};
  @Input() isEdit: boolean = false;
  entity_types: Array<any> = [];
  states_list: Array<any> = [];
  city_list: Array<any> = [];
  buttonTitle: string = "Save";
  id: number = 0;
  form: FormGroup;
  submitted = false
  constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private activeModal: NgbActiveModal,) { }

  ngOnInit() {

    //Loadin States
    this.httpService.get(AppConstants.GET_STATES)
      .subscribe(response => {
        this.states_list = response[0]['states'];
        this.city_list = this.states_list[0]['cities']
        if (this.isEdit === true) {
          this.bindData();
        }
      });
    this.form = this.formBuilder.group(
      {
        group_user_id: [''],
        company_name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        mobile_number: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]],
        contact_name: ['', [Validators.required, Validators.minLength(5)]],
        alternate_mobile_no: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]],
        state: ['', [Validators.required]],
        city: ['', [Validators.required]],
        pincode: ['', [Validators.required]],
        address: ['', [Validators.required]],
      }
    );

  }

  bindData() {

    this.form.patchValue({
      company_name: this.editDataModel?.company_name,
      email: this.editDataModel?.email,
      mobile_number: this.editDataModel?.mobile_no,
      contact_name: this.editDataModel?.contact_name,
      alternate_mobile_no: this.editDataModel?.alternate_mobile_number,
      state: this.editDataModel?.state,
      pincode: this.editDataModel?.pincode,
      address: this.editDataModel?.address,
    });
    this.onStateChanged(this.editDataModel?.state)
    this.form.patchValue({
      city: this.editDataModel?.city,
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
      this.httpService.postWithAuth(AppConstants.CREATE_ADVERTISER, JSON.stringify(this.form.value, null, 2)).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        (error: any) => {
          console.log(error);
          this.showErrorMessage(error);
        }
      );
    } else {
      this.form.value['group_user_id'] = this.editDataModel?.id;
      this.httpService.patch(AppConstants.UPDATE_ADVERTISER, JSON.stringify(this.form.value, null, 2)).subscribe(
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
    //this.toastr.success(data.message, "Success");
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

  onStateChanged(stateId: any) {
    this.states_list.forEach(state => {
      if (state.id == stateId) {
        this.city_list = state.cities;
      }
    });

  }

}
