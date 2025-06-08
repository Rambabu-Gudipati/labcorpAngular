import { Component, Input, OnInit } from '@angular/core';
import { AppConstants } from '../../../app-constants';
import { HttpClientService } from '../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { UploadPdfComponent } from '../../mentormodule/upload-pdf/upload-pdf.component';


@Component({
  selector: 'app-patient-details',

  templateUrl: './patient-details.component.html',
  styleUrl: './patient-details.component.scss'
})
export class PatientDetailsComponent implements OnInit {
  @Input() bookAppointment: any;
  items: any = {};
  events: DayPilot.EventData[] = [];
  currentDate: Date = new Date();
  constructor(private httpService: HttpClientService, private toastr: ToastrService, private router: Router, private modalservice: NgbModal, private activeModal: NgbActiveModal) {
    //this.viewWeek();
  }

  ngOnInit(): void {


  }
  formattedDate(date: string, time: string) {
    return date.split('T')[0] + 'T' + time.replace('.', ':') + ':00';
  }
  formatToDate(date: string, time: string) {
    var newTime = Number(time) + 1;
    return date.split('T')[0] + 'T' + newTime.toString().replace('.', ':') + ':00:00';
  }

  dismissModal() {
    this.activeModal.close();
    // this.httpService.filter("register click");
  }

  launchVideoCall() {
    var data = { "id": this.bookAppointment.id };
    this.httpService.patch(AppConstants.DOCTOR_JOIN_CALL, data).subscribe(
      (response: any) => {
       response.data.id=this.bookAppointment.id;
          this.router.navigateByUrl('video/start-call', { state: { sos_data: JSON.stringify(response.data) } });

          var sos_data = JSON.parse(JSON.stringify(response.data));
          console.log(sos_data);
          this.activeModal.close();
      },
      
      error => {
        //  this.fireValidateMeeting();
        this.toastr.error(error);

      }
    );


  }
  isJoinCallButtonEnabled(appointment_Date: string | null, timeSlot: string | null): boolean {
    if (!appointment_Date || !timeSlot) {
      return false;
    }

    // 1. Parse the appointment date from the API response
    const appointmentDate = new Date(appointment_Date);

    // 2. Parse the time from the appointment_time_slot_name (e.g., "11:00")
    const timeParts = timeSlot.split('.');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    // 3. Combine the appointment date and time
    const appointmentDateTime = new Date(appointmentDate.setHours(hours, minutes, 0, 0));

    // 4. Get the current date and time
    const currentDateTime = new Date();

    // console.log("currentDateTime-------------->", currentDateTime);

    // 5. Define the cutoff time (1 hour after the appointment time)
    const cutoffTime = new Date(appointmentDateTime);
    cutoffTime.setHours(cutoffTime.getHours() + 1);

    // console.log("cutoffTime------------>", cutoffTime);

    // 6. Check if the current time is within the range (after appointment time and before cutoff)
    return currentDateTime > appointmentDateTime && currentDateTime < cutoffTime;
    // return true;
  }
  
 uploadPrecription() {
     const modalRef = this.modalservice.open(UploadPdfComponent, { centered: true, size: 'lg' });
     modalRef.componentInstance.prescriptionUpload = true;
     modalRef.componentInstance.id=this.bookAppointment.id;
     modalRef.componentInstance.modalHeaderTitle = "Upload Prescription"
     modalRef.result.then((result) => {
       console.log(result);
     }).catch((error) => {
       console.log(error);
     });
   } 
    
}
