import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../../../services/http-client-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../app-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-ecg',

  templateUrl: './add-ecg.component.html',
  styleUrl: './add-ecg.component.scss'
})
export class AddEcgComponent implements OnInit{
  @Input() modalHeaderTitle: string = "ADD Ecg User";
  @Input() editDataModel: any = {};
  @Input() isEdit: boolean = false;
  entity_types: Array<any> = [];
  manufacturer_list: Array<any> = [];
  models_list: Array<any> = [];
  buttonTitle: string = "Save";
  id: number = 0;
  form: FormGroup;
  submitted = false
  onStateChanged: any;
  constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private activeModal: NgbActiveModal,) { }

  ngOnInit() {
    // Loadin States
    this.httpService.get(AppConstants.GET_ECG_MODELS)
      .subscribe(response => {
        this.models_list = response;
       
      });
      this.httpService.get(AppConstants.GET_ECG_MANUFACTURER)
      .subscribe(response => {
        this.manufacturer_list = response;
        if (this.isEdit === true) {
          this.bindData();
        }
       
      });
    
    this.form = this.formBuilder.group(
      {
        // id: [''],
        device_id: ['', [Validators.required]],
        device_model_id: ['', [Validators.required]],
        manufacturer_id: ['', [Validators.required]],
        
        
      }
    );

  }

  bindData() {

    this.form.patchValue({
      device_id: this.editDataModel?.device_id,
      device_model_id: this.editDataModel?.device_model_id,
      manufacturer_id: this.editDataModel?.manufacturer_id,
      
    });
    this.onStateChanged(this.editDataModel?.manufacturer_id)
    this.form.patchValue({
      device_model_id: this.editDataModel?.device_model_id,
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
      this.httpService.postWithAuth(AppConstants.CREATE_ECG_DEVICE, JSON.stringify(this.form.value, null, 2)).subscribe(
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
      this.httpService.patch(AppConstants.UPDATE_ECG_DEVICE, JSON.stringify(this.form.value, null, 2)).subscribe(
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

}
