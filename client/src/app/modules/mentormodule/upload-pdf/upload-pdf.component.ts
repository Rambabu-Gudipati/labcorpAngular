import { Component, Input, OnInit } from '@angular/core';
import Papa from 'papaparse';
import { HttpClientService } from '../../../services/http-client-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { AppConstants } from '../../../app-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-pdf',

  templateUrl: './upload-pdf.component.html',
  styleUrl: './upload-pdf.component.scss'
})
export class UploadPdfComponent implements OnInit{
  @Input() isEdit: boolean = false;
  @Input() bookingId:any=0;
  @Input() yearlyUpload:boolean = false;
  @Input() prescriptionUpload:boolean=false;
  @Input() id: any=0;
  form: FormGroup;
  submitted = false
  attachment:File ;
  buttonTitle: string = "Save";
  data: any[] = [];
  displayedColumns: string[] = [];
  constructor(private httpService: HttpClientService,
    private toastr: ToastrService, private modalService: NgbModal,
    private formBuilder: FormBuilder,
   ) { }
    // Store column names for the table
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
  ngOnInit() {
    
    this.form = this.formBuilder.group(
      {
        // group_user_id: [''],
        file1: ['', [Validators.required]],
        filename: ['', [Validators.required]],
       
       
      }
    );

  }


  dismissModal() {
    this.modalService.dismissAll();
  }

  onSubmit(): void {
    this.submitted = true;
    console.log(this.form);
   if(this.yearlyUpload == true)
   {
    const formData = new FormData();
    formData.append('id',this.bookingId);
   formData.append('filename',  this.attachment.name);
    formData.append('file1',  this.attachment, this.attachment.name);

   
   
    this.httpService.patchFormData(AppConstants.YEARLY_UPLOAD_REPORT, formData).subscribe(
      (response: any) => {
        this.showSuccessMessage(response);
      },
      (error: any) => {
        console.log(error);
        this.showErrorMessage(error);
      }
    )

   
   }else if(this.prescriptionUpload == true)
    {
      const formData = new FormData();
      formData.append('id',this.id);
     //formData.append('prescription',  this.attachment.name);
     formData.append('prescription',  this.attachment, this.attachment.name);
  
     
     
      this.httpService.patchFormData(AppConstants.UPLOAD_PRESCRIPTION, formData).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        (error: any) => {
          console.log(error);
          this.showErrorMessage(error);
        }
      )
    }
    else{
      const formData = new FormData();
    formData.append('diagnostic_booking_id',this.bookingId);
    formData.append('filename',  this.attachment.name);
    formData.append('file1',  this.attachment, this.attachment.name);

   
   
    this.httpService.patchFormData(AppConstants.UPDATE_UPLOAD_REPORT, formData).subscribe(
      (response: any) => {
        this.showSuccessMessage(response);
      },
      (error: any) => {
        console.log(error);
        this.showErrorMessage(error);
      }
    )
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

