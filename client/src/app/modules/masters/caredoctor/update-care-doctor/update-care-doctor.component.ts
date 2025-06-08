import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../../app-constants';
import Swal from 'sweetalert2';
import Papa from 'papaparse';
@Component({
  selector: 'app-update-care-doctor',

  templateUrl: './update-care-doctor.component.html',
  styleUrl: './update-care-doctor.component.scss'
})
export class UpdateCareDoctorComponent implements OnInit{

    @Input() modalHeaderTitle: string = "ADD Group User";
    @Input() editDataModel: any = {};
    @Input() isEdit: boolean = false;
    specialization_types: Array<any> = [];
    states_list: Array<any> = [];
    city_list: Array<any> = [];
    buttonTitle: string = "Save";
    id: any = 0;
    form: FormGroup;
    submitted = false   
    attachment:File ;
    minDate?:string // Set maxDate to today
    selectedGender: number = 1;
    data: any[] = [];
    displayedColumns: string[] = [];
    constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
      private toastr: ToastrService, private router: Router, private modalService: NgbModal,
      private activeModal: NgbActiveModal,) { 
        const today=new Date();
        this.minDate=today.toISOString().split('T')[0];
      }
  
    ngOnInit() {
      // if (this.isEdit === true) {
      //   this.bindData();
      // }
      // Loading Group User Types
      // this.httpService.get(AppConstants.GET_SPECIALIZATION_TYPES)
      //   .subscribe(response => {
      //     this.specialization_types = response;
          
      //   });
  
      // //Loadin States
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
          experience: ['', [Validators.required]],
        
          qualification: ['', [Validators.required]],
        
          medical_registration_no: ['', [Validators.required]],
          // pincode: ['', [Validators.required]],
          // gender: ['', [Validators.required]],
          // registration_no: ['', [Validators.required]],
          license_expiry_date: ['', [Validators.required]],
          license_no: ['', [Validators.required]],
        }
      );
  
    }
  
    bindData() {
  this.id=this.editDataModel?.id;
      this.form.patchValue({
        username: this.editDataModel?.username,
        email: this.editDataModel?.email,
        mobile_no: this.editDataModel?.mobile_no,
        experience: this.editDataModel?.experience,
      
        qualification: this.editDataModel?.qualification,
        // profile_pic: this.editDataModel?.profile_pic,
        medical_registration_no: this.editDataModel?.medical_registration_no,
        license_expiry_date: this.editDataModel?.license_expiry_date,
        license_no: this.editDataModel?.license_no,
      });
      // this.onStateChanged(this.editDataModel?.state)
      // this.form.patchValue({
      //   city: this.editDataModel?.city,
      // });
  
  
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
      const formData = new FormData();
      formData.append('user_id', this.id.toString()); // Convert to string if this.id is a number
      formData.append('qualification', this.form.value['qualification']);
      formData.append('experience ', this.form.value['experience']);
      formData.append('medical_registration_no ', this.form.value['medical_registration_no']);
      formData.append('license_no', this.form.value['license_no']);
      formData.append('license_expiry_date', this.form.value['license_expiry_date']);
      formData.append('profile_image',this.attachment, this.attachment.name);
      formData.append('signature_image',this.attachment, this.attachment.name);
        this.form.value['user_id'] = this.editDataModel?.id;
        this.httpService.patchFormData(AppConstants.UPDATE_CARE_DOCTOR, formData).subscribe(
          (response: any) => {
         
            this.showSuccessMessage(response);
          },
          error => {
            this.showErrorMessage(error);
          }
          
        );
       
      }
      onFileChange(event: any) {
        const file = event.target.files[0];
        if (file) {
          this.attachment=file
          Papa.parse(file, {
            header: true,
            complete: (results: { data: any[]; }) => {
              this.data = results.data;
              if (this.data.length > 0) {
                this.displayedColumns = Object.keys(this.data[0]);
              }
            },
            error: (error: any) => {
              console.error('Error parsing CSV:', error);
            }
          });
        }
      }
      // genderOptions = [
      //   { label: 'Female', value: 1 },
      //   { label: 'Male', value: 2 }
      // ];
      // onGenderChange(event: Event): void {
      //   const selectedValue = (event.target as HTMLSelectElement).value;
      //   this.selectedGender = +selectedValue; // Convert the value to a number
      //   console.log("Selected gender value to pass to server:", this.selectedGender);
      //   // Here you would pass `this.selectedGender` to the server as needed.
      // }
      
      
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
