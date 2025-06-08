import { Component, Input, OnInit } from '@angular/core';
import { HttpClientService } from '../../../../services/http-client-service';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../services/auth.service';
import { AppConstants } from '../../../../app-constants';
import { FormGroup } from '@angular/forms';
import { UploadPdfComponent } from '../../upload-pdf/upload-pdf.component';
import { AssignLabComponent } from '../../assign-lab/assign-lab.component';
import { BookAppointmentsComponent } from '../book-appointments/book-appointments.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-doctor-consultation',

  templateUrl: './view-doctor-consultation.component.html',
  styleUrl: './view-doctor-consultation.component.scss'
})
export class ViewDoctorConsultationComponent implements OnInit {
  @Input() editDataModel: any = {};
  @Input() id: any = 0;
  @Input() doctor_id:number=0;
  @Input() isEdit: boolean = false;
  form: FormGroup;
  loading = false;
  items: any = {};
  checkDisableButton: boolean = false;
  showError = false;
  submitted: boolean;
  isButtonsDisabled: boolean = false;
  selectedItems: string[];
  time_list: Array<any> = [];
  constructor(private httpService: HttpClientService, private route: ActivatedRoute, private modalservice: NgbModal,private auth:AuthService, private toastr: ToastrService,) { }
  
  
  
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.loadDoctorsData();
      // You can now use this ID to fetch data or perform other actions
    });

    this.selectedItems = new Array<string>();

  }

loadDoctorsData() {
    this.loading = true;
    this.httpService.getwithAuth(AppConstants.GET_DOCTORS_BY_ID + '/' + this.id)
      .subscribe(res => {
        this.items = res;
        this.isDisableAll();
        if (this.isEdit === true) {
          this.bindData();
        }
      });
  }
  dismissModal() {

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

  bookAppointment() {
    const modalRef = this.modalservice.open(BookAppointmentsComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.appointment_Id = this.items?.data?.id;
   
    modalRef.componentInstance.status_id = 2;
    modalRef.componentInstance.modalHeaderTitle = "Book Appointment"
    modalRef.result.then((result: any) => {
      console.log(result);
      // this.validateButtons();
      window.location.reload();
    }).catch((error:any) => {
      console.log(error);
      window.location.reload();
      });
      
    }
    addRescheduled() {
      const modalRef = this.modalservice.open(BookAppointmentsComponent, { centered: true, size: 'lg' });
      modalRef.componentInstance.appointment_Id = this.items?.data?.id;
  
      modalRef.componentInstance.status_id = 3;
      modalRef.componentInstance.modalHeaderTitle = "Reschedule Appointment"
      modalRef.result.then((result: any) => {
        console.log(result);
        // this.validateButtons();
        window.location.reload();
      }).catch((error:any) => {
        console.log(error);
        window.location.reload();
        });
      
      }


  cancelOrder()
  {
    
  }
  Notify()
  {
    var data={
   
      // "diagnosticBookingIds" : this.selectedItems,
      "id":Number( this.items?.data?.id),
     
     
   }
  
   
    
      this.httpService.postWithAuth(AppConstants.PUSH_NOTIFY_BUTTON, data).subscribe(
        (response: any) => {
          this.showSuccessMessage(response);
        },
        error => {
          this.showErrorMessage(error);
        }
      );
     
  }
   

  isNotifyEnabled(appointmentDate: string, status: number): boolean {
  
   
 

    const today = new Date();
    const appointment = new Date(appointmentDate);
    
    // Normalize to date only (remove time part)
    today.setHours(0, 0, 0, 0);
    appointment.setHours(0, 0, 0, 0);
    
    // Calculate the difference in days
    const timeDiff = appointment.getTime() - today.getTime();
    const dayDiff = timeDiff / (1000 * 60 * 60 * 24);
    
    // Enable button if:
    // 1. Status is 2 or 3
    // 2. Appointment date is today (dayDiff === 0) or tomorrow (dayDiff === 1)
    if ((status === 2 || status === 3) && (dayDiff === 0 || dayDiff === 1)) {
      return true;
    }
    
    return false;
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
  this.modalservice.dismissAll(true);
}

isDisableAll(): void {
   if(this.items.userOrderDetails.order_status_id==5)
    {
      this.isButtonsDisabled = true;
      return;
    }
    
  for (let item of this.items?.data) {
    if (item.status == 4 || item.status == 5) {
      this.isButtonsDisabled = true;
      return;

    }
  }

  
  this.isButtonsDisabled = false;
}

}
