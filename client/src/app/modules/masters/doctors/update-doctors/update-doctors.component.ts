import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { HttpClientService } from '../../../../services/http-client-service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../../app-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update-doctors',

  templateUrl: './update-doctors.component.html',
  styleUrl: './update-doctors.component.scss'
})
export class UpdateDoctorsComponent implements OnInit{
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
 
  maxDate?:string // Set maxDate to today
  selectedGender: number = 1;
 
  constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private activeModal: NgbActiveModal,) { 
      const today=new Date();
      this.maxDate=today.toISOString().split('T')[0];
    }

  ngOnInit() {
    // Loading Group User Types
    this.httpService.get(AppConstants.GET_SPECIALIZATION_TYPES)
      .subscribe(response => {
        this.specialization_types = response;
        
      });

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
      
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        mobile_no: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]],
        years_of_experience: ['', [Validators.required]],
        specialization_id: ['', [Validators.required]],
        qualification: ['', [Validators.required]],
        state: ['', [Validators.required]],
        city: ['', [Validators.required]],
        pincode: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        registration_no: ['', [Validators.required]],
        dob: ['', [Validators.required]],
        // profile_pic: ['', [Validators.required]],
      }
    );

  }

  bindData() {
this.id=this.editDataModel?.id;
    this.form.patchValue({
      username: this.editDataModel?.username,
      email: this.editDataModel?.email,
      mobile_no: this.editDataModel?.mobile_no,
      years_of_experience: this.editDataModel?.years_of_experience,
      specialization_id: this.editDataModel?.specialization_id,
      qualification: this.editDataModel?.qualification,
      state: this.editDataModel?.state,
      pincode: this.editDataModel?.pincode,
      gender_id: this.editDataModel?.gender_id,
      registration_no: this.editDataModel?.registration_no,
      date_of_birth: this.editDataModel?.date_of_birth,
      // profile_pic: this.editDataModel?.profile_pic,
    });
    this.onStateChanged(this.editDataModel?.state)
    this.form.patchValue({
      city: this.editDataModel?.city,
    });


  }
  dismissModal() {
    this.activeModal.close();
  }
  onUpdate(): void {
    this.submitted = true;
    console.log(this.form);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    var data={
       "id":this.id,
      // "username":this.form.value['username'],
      // "email": this.form.value['email'],
      // "mobile_no":this.form.value['mobile_no'],
      "qualification": this.form.value['qualification'],
      "state":Number(this.form.value['state']),
      "city": Number(this.form.value['city']),
     "pincode": Number(this.form.value['pincode']),
      "years_of_experience":Number(this.form.value['years_of_experience']),
      "specialization_id":Number(this.form.value['specialization_id']),
      "registration_no": this.form.value['registration_no'],
      "dob":  this.form.value['dob'],
      "gender": this.selectedGender,
       //"profile_pic": this.form.value['profile_pic'],
    };
    
    
      this.form.value['id'] = this.editDataModel?.id;
      this.httpService.patch(AppConstants.UPDATE_DOCTORS, data).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        error => {
          this.showErrorMessage(error);
        }
      );
    }
    genderOptions = [
      { label: 'Female', value: 1 },
      { label: 'Male', value: 2 }
    ];
    onGenderChange(event: Event): void {
      const selectedValue = (event.target as HTMLSelectElement).value;
      this.selectedGender = +selectedValue; // Convert the value to a number
      console.log("Selected gender value to pass to server:", this.selectedGender);
      // Here you would pass `this.selectedGender` to the server as needed.
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
