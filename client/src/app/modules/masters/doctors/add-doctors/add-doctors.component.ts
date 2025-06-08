import { Component, Input, OnInit } from '@angular/core';
import { HttpClientService } from '../../../../services/http-client-service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../../app-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-doctors',
 
  templateUrl: './add-doctors.component.html',
  styleUrl: './add-doctors.component.scss'
})
export class AddDoctorsComponent {
  @Input() modalHeaderTitle: string = "ADD Group User";
  @Input() editDataModel: any = {};
  @Input() isEdit: boolean = false;
  specialization_types: Array<any> = [];
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
    // Loading Group User Types
    // this.httpService.get(AppConstants.GET_SPECIALIZATION_TYPES)
    //   .subscribe(response => {
    //     this.specialization_types = response;
    //   });

    //Loadin States
    // this.httpService.get(AppConstants.GET_STATES)
    //   .subscribe(response => {
    //     this.states_list = response[0]['states'];
    //     this.city_list = this.states_list[0]['cities']
    //     if (this.isEdit === true) {
    //       this.bindData();
    //     }
    //   });
    this.form = this.formBuilder.group(
      {
        // group_user_id: [''],
        username: ['', [Validators.required,Validators.minLength(6)]],
        email: ['', [Validators.required, Validators.email]],
        mobile_no: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]],
     
      }
    );

  }

  // bindData() {

  //   this.form.patchValue({
  //     username: this.editDataModel?.username,
  //     email: this.editDataModel?.email,
  //     mobile_no: this.editDataModel?.mobile_no,
     
  //   });
    


  // }
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

    var data={
      //  "id":Number(this.form.value['id']),
      "username":this.form.value['username'],
      "email": this.form.value['email'],
      "mobile_no":this.form.value['mobile_no'],
   
    };
    // if (this.isEdit == false) {
      this.httpService.postWithAuth(AppConstants.CREATE_DOCTORS, data).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        (error: any) => {
          console.log(error);
          this.showErrorMessage(error);
        }
      );
    // } else {
    //   this.form.value['id'] = this.editDataModel?.id;
    //   this.httpService.patch(AppConstants.UPDATE_DOCTORS, data).subscribe(
    //     (response: any) => {
    //       this.showSuccessMessage(response);
    //     },
    //     error => {
    //       this.showErrorMessage(error);
    //     }
    //   );
    // }
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

  // onStateChanged(stateId: any) {
  //   this.states_list.forEach(state => {
  //     if (state.id == stateId) {
  //       this.city_list = state.cities;
  //     }
  //   });

  // }
}
