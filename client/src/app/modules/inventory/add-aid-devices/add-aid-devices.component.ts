import { Component, OnInit,Input} from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AppConstants } from '../../../app-constants';
import { HttpClientService } from '../../../services/http-client-service';

@Component({
  selector: 'app-add-aid-devices',

  templateUrl: './add-aid-devices.component.html',
  styleUrl: './add-aid-devices.component.scss'
})
export class AddAidDevicesComponent implements OnInit {
  @Input() modalHeaderTitle: string = "ADD Group User";
  @Input() editDataModel: any = {};
  @Input() isEdit: boolean = false;
  entity_types: Array<any> = [];
  manufacturers_list: Array<any> = [];
  brands_list: Array<any> = [];
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
    this.httpService.get(AppConstants.GET_AID_BRANDS)
      .subscribe(response => {
        this.brands_list = response;
       
      });
      this.httpService.get(AppConstants.GET_AID_MANUFACTURERS)
      .subscribe(response => {
        this.manufacturers_list = response;
        if (this.isEdit === true) {
          this.bindData();
        }
       
      });
    
    this.form = this.formBuilder.group(
      {
        // id: [''],
        serial_no: ['', [Validators.required]],
        brand_id: ['', [Validators.required]],
        aid_device_id: ['', [Validators.required]],
        model_no: ['', [Validators.required]],
        manufacturer_id: ['', [Validators.required]],
        warranty_expiry_date: ['', [Validators.required]],
        
      }
    );

  }

  bindData() {

    this.form.patchValue({
      serial_no: this.editDataModel?.serial_no,
      brand_id: this.editDataModel?.brand_id,
      aid_device_id: this.editDataModel?.aid_device_id,
      model_no: this.editDataModel?.model_no,
      manufacturer_id: this.editDataModel?.manufacturer_id,
      warranty_expiry_date: this.editDataModel?.warranty_expiry_date,
     
    });
    this.onStateChanged(this.editDataModel?.manufacturer_id)
    this.form.patchValue({
      brand_id: this.editDataModel?.brand_id,
      
    });


  }
  dismissModal() {
    this.activeModal.close();
    // this.httpService.filter("register click");
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

}
