import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../../app-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-book-appointments',
  templateUrl: './book-appointments.component.html',
  styleUrl: './book-appointments.component.scss'
})
export class BookAppointmentsComponent implements OnInit {
  @Input() modalHeaderTitle: string = "ADD Group User";
  @Input() editDataModel: any = {};
  @Input() isEdit: boolean = false;
  @Input() selectedItems: any = [];
  @Input() appointment_Id: number = 0;
  @Input() status_id: number = 0;

  currentDate: any = new Date();
  doctors_list: Array<any> = [];
  status_list: Array<any> = [];
  time_list: Array<any> = [];
  buttonTitle: string = "Save";
  // id: number = 0;
  form: FormGroup;
  submitted = false
  //selectedTime: number = 0;
  
  selectedTime: number | null = null; // Currently selected time slot ID
  errorMessage: string | null = null;
  constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private activeModal: NgbActiveModal,) {

  }


  ngOnInit() {



    this.httpService.getwithAuth(AppConstants.GET_APPOINTMENT_STATUS)
      .subscribe(response => {
        this.status_list = response;

      });
    this.httpService.getwithAuth(`${AppConstants.GET_DOCTOR_NAMES}?page=1&limit=100`)
      .subscribe(response => {
        this.doctors_list = response.data;

      });

      



    this.form = this.formBuilder.group(
      {
        // id: [''],
        doctor_id: ['', [Validators.required]],

        status: [this.status_id, [Validators.required]],

        appointment_date: ['', [Validators.required]],

      }
    );
    this.loadTimeSlot();
  }
  loadTimeSlot() {
    this.httpService.getwithAuth(AppConstants.GET_APPOINTMENT_SLOTS)
      .subscribe(response => {
        this.time_list = response;

      });
  }

  bindData() {

    this.form.patchValue({
      status: this.editDataModel?.status,

    });


  }
  dismissModal() {
    this.activeModal.close();
    // this.httpService.filter("register click");
  }

  onSubmit(): void {

    if (this.selectedTime == 0 || this.selectedTime == null || this.selectedTime == undefined) {
      this.toastr.error("Please Select Time Slot");
      return;
    }
    this.submitted = true;
    console.log(this.form);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    var data = {

      // "diagnosticBookingIds" : this.selectedItems,
      "id": Number(this.appointment_Id),
      "status": this.status_id,
      "doctor_id": Number(this.form.value['doctor_id']),
      "appointment_time_slot": this.selectedTime,
      "appointment_date": this.form.value['appointment_date'],

    }



    this.httpService.patch(AppConstants.UPDATE_DOCTOR_CONSULTATION, data).subscribe(
      (response: any) => {
        this.showSuccessMessage(response);
      },
      error => {
        this.showErrorMessage(error);
      }
    );

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


  selectTime(time: any) {
    if (!this.form.get('appointment_date')?.value) {
      this.toastr.error("please Select The Appointment Date")
       return;
     }
    const now = new Date();
    const selectedDate = this.form.controls['appointment_date'].value; // Get the selected appointment date
    const selectedDateObj = new Date(selectedDate);
  
  
   
    // Check if the selected date is today
    if (selectedDateObj.toDateString() === now.toDateString()) {
      const  timeParts = time.name.split('.'); 
      const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[0], 10);
      const selectedTime = new Date(
        selectedDateObj.getFullYear(),
        selectedDateObj.getMonth(),
        selectedDateObj.getDate(),
        hours,
        minutes
      );
  
      if (selectedTime < now) {
        this.errorMessage = 'You cannot select a past time for today.';
        return;
      }
    }
  
    // Update selected time if no errors
    this.errorMessage = null;
    this.selectedTime = time.id;
}
}
 



