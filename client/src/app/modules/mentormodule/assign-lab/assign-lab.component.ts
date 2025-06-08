import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientService } from '../../../services/http-client-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../app-constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-assign-lab',

  templateUrl: './assign-lab.component.html',
  styleUrl: './assign-lab.component.scss'
})
export class AssignLabComponent implements OnInit {
  @Input() modalHeaderTitle: string = "";
  @Input() editDataModel: any = {};
  @Input() isEdit: boolean = false;
  @Input() selectedItems: any = [];
  @Input() isReschedule: boolean = false;
  @Input() Reschedule: boolean = false;
  @Input() isYearlyScreeing: boolean = false;
  @Input() checkedItems: any = [];
  @Input() dueDate: string | Date;
  currentDate: any = new Date();
  selectedTime: number | null = null; // Currently selected time slot ID
  errorMessage: string | null = null;
  lab_list: Array<any> = [];
  time_list: Array<any> = [];
  buttonTitle: string = "Save";
  id: number = 0;
  form: FormGroup;
  submitted = false

  constructor(private httpService: HttpClientService, private formBuilder: FormBuilder,
    private toastr: ToastrService, private router: Router, private modalService: NgbModal,
    private activeModal: NgbActiveModal,) {

  }


  ngOnInit() {


    this.httpService.getwithAuth(`${AppConstants.GET_LAB_NAMES}?page=1&limit=10`)
      .subscribe(response => {
        this.lab_list = response.data;
        if (this.isEdit === true) {
          this.bindData();
        }
      });





    this.form = this.formBuilder.group(
      {
        // id: [''],
        lab_name: ['', [Validators.required]],

        technician_name: ['', [Validators.required]],
        technician_contact_no: ['', [Validators.required, Validators.pattern("[0-9]{10}$")]],

        booking_date: ['', [Validators.required]],



      }
    );
    this.loadTimeSlot();

  }
  loadTimeSlot() {
    this.httpService.getwithAuth(AppConstants.GET_TIME_SLOTS)
      .subscribe(response => {
        this.time_list = response;


      });
  }

  bindData() {

    this.form.patchValue({
      lab_name: this.editDataModel?.lab_name,
      technician_name: this.editDataModel?.technician_name,
      technician_contact_no: this.editDataModel?.technician_contact_no,
      booking_date: this.editDataModel?.booking_date,


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
  
if(this.isYearlyScreeing == false)
{


    var data = {

      "diagnosticBookingIds": this.selectedItems,
      "diagnostic_lab_id": this.form.value['lab_name'],
      "booking_time_slot": this.selectedTime,
      "booking_date": this.form.value['booking_date'],
      "technician_name": this.form.value['technician_name'],
      "technician_contact_no": this.form.value['technician_contact_no'],
    }


    // this.form.value['id'] = this.editDataModel?.id;
    this.httpService.patch(this.isReschedule ? AppConstants.UPDATE_RESCHEDULE : AppConstants.UPDATE_ASSIGN_ORDERS, data).subscribe(
      (response: any) => {
        this.showSuccessMessage(response);
      },
      error => {
        this.showErrorMessage(error);
      }
    );
  } else{



    var yearly_data = {

      "yearlyScreeningIds": this.checkedItems,
      "diagnostic_lab_id": this.form.value['lab_name'],
      "booking_time_slot": this.selectedTime,
      "booking_date":  this.form.value['booking_date'],
      "technician_name": this.form.value['technician_name'],
      "technician_contact_no": this.form.value['technician_contact_no'],
    

    }

    this.httpService.patch(this.Reschedule ? AppConstants.YEARLY_RESCHEDULE_LAB : AppConstants.YEARLY_ASSIGN_LAB, yearly_data).subscribe(
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

  

  // selectTime(time: any) {

  //   this.selectedTime = time?.id;

  // }

  
  
  selectTime(time: any) {
    if (!this.form.get('booking_date')?.value) {
     this.toastr.error("please Select The Collection Date")
      return;
    }
    const now = new Date();
    const selectedDate = this.form.controls['booking_date'].value; // Get the selected appointment date
    const selectedDateObj = new Date(selectedDate);
    
    // Check if the selected date is today
    if (selectedDateObj.toDateString() === now.toDateString()) {
      const timeParts = time.slot_time.split('-'); // Split time slot like "6:00 AM-7:00 AM"
      
      const startTimeStr = timeParts[0].trim();  // e.g., "6:00 AM"
      const endTimeStr = timeParts[1].trim();    // e.g., "7:00 AM"
      
      // Convert to Date objects
      const startTime = this.convertToDate(selectedDateObj, startTimeStr);
      const endTime = this.convertToDate(selectedDateObj, endTimeStr);
      
      // Check if start time is in the past
      if (startTime < now) {
        this.errorMessage = 'You cannot select a past time for today.';
        return;
      }
    }
    
    // Update selected time if no errors
    this.errorMessage = null;
    this.selectedTime = time.id;
  }
  
  // Helper function to convert a time string like "6:00 AM" to a Date object
  convertToDate(date: Date, timeStr: string): Date {
    const [time, period] = timeStr.split(' '); // Split time and period (AM/PM)
    const [hours, minutes] = time.split(':').map(num => parseInt(num, 10));
  
    let adjustedHours = hours;
    if (period.toUpperCase() === 'PM' && hours !== 12) {
      adjustedHours += 12;
    }
    if (period.toUpperCase() === 'AM' && hours === 12) {
      adjustedHours = 0;
    }
  
    console.log(`Time: ${timeStr}, Adjusted Hours: ${adjustedHours}, Minutes: ${minutes}`); // Debugging log
  
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), adjustedHours, minutes);
  }
  validateAssignLabDate() {
    const dueDate = new Date(this.dueDate);
    const assignLabDate = new Date(this.form.controls['booking_date'].value);

    // Clear the previous error message
    this.errorMessage = '';

    // Check if the booking date is earlier than the due date
    if (assignLabDate < dueDate) {
      this.errorMessage = 'Assign Lab Date must be on or after the Due Date.';
      
      // Optionally reset the booking date if the validation fails
      this.form.controls['booking_date'].setValue('booking_date');
    }
}
}





