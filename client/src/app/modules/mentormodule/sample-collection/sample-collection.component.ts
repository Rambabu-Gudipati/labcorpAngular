import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../app-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sample-collection',

  templateUrl: './sample-collection.component.html',
  styleUrl: './sample-collection.component.scss'
})
export class SampleCollectionComponent implements OnInit{

 @Input() modalHeaderTitle: string = "";

  @Input() isEdit: boolean = false;
  @Input() selectedItems: any = [];
 @Input() isYearlySampleCollection:boolean=false;

 @Input() checkedItems: any = [];
  buttonTitle: string = "Save";

  form: FormGroup;
  submitted = false

  constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
    private toastr: ToastrService,  private modalService: NgbModal,
    private activeModal: NgbActiveModal,) {

  }


  ngOnInit() {

    // Loadin lab names
  

   

    this.form = this.formBuilder.group(
      {
    
        status: ['', [Validators.required]],

        Comments: ['', []],
       



      }
    );
    this.form.get('status')?.valueChanges.subscribe((value) => {
      const commentsControl = this.form.get('Comments');
      if (value === '6') {
        // Add 'required' validator if status is "6"
        commentsControl?.setValidators([Validators.required]);
      } else {
        // Remove 'required' validator if status is not "6"
        commentsControl?.clearValidators();
      }
      commentsControl?.updateValueAndValidity(); // Update validation
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
      return;
    }

   if(this.isYearlySampleCollection ==false)
   {


    var sample_data = {

      "diagnosticBookingIds": this.selectedItems,
      "Comments":  this.form.value['Comments'],
       "status":  Number(this.form.value['status']),
      
    }
    this.httpService.patch(AppConstants.UPDATE_SAMPLE_COLLECTION, sample_data).subscribe(
      (response: any) => {
        this.showSuccessMessage(response);
      },
      error => {
        this.showErrorMessage(error);
      }
    );
  }
  else
  {
    var data = {

      "yearlyScreeningIds": this.checkedItems,
      "Comments":  this.form.value['Comments'],
       "status":  Number(this.form.value['status']),
      
    }
    this.httpService.patch(AppConstants.YEARLY_UPDATE_SAMPLE_COLLECTION, data).subscribe(
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
