import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../../../app-constants';
import { HttpClientService } from '../../../../services/http-client-service';
import { JoinScreenComponent } from '../join-screen/join-screen.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-bar.component.html',
  styleUrls: ['../top-bar/top-bar.component.scss'],
})
export class TopBarComponent {
  @Input() showTopBar: boolean = false;
  @Input() disableWebcamBtn: boolean = false;
  @Input() enableWebcamBtn: boolean = false;
  @Input() disableMicBtn: boolean = false;
  @Input() enableMicBtn: boolean = false;
  @Output() disableWebcam = new EventEmitter();
  @Output() enableWebcam = new EventEmitter();
  @Output() muteMic = new EventEmitter();
  @Output() unmuteMic = new EventEmitter();
  @Output() leaveMeeting = new EventEmitter();
  @Input() meetingId: string = '';
  @Input() sosId: string = '';
  constructor(
    private httpService: HttpClientService,
    private toastr: ToastrService,
    private router: Router) {
    var x = this.meetingId;
    var y = this.sosId;
  }

  fireDisableWebcam() {
    this.disableWebcam.emit();
  }

  fireEnableWebcam() {
    this.enableWebcam.emit();
  }

  fireMuteMic() {
    this.muteMic.emit();
  }

  fireUnmuteMic() {
    this.unmuteMic.emit();
  }

  fireLeaveMeeting() {
    this.leaveMeeting.emit();
  }

  leaveCall(): void {

    var data = { "sos_id": JoinScreenComponent.sos_id, 'call_ended_by': 'D' };
    this.httpService.postWithAuth(AppConstants.END_CALL, data).subscribe(
      (response: any) => {
        this.fireLeaveMeeting();
        this.showSuccessMessage(response);
        this.router.navigate(['/'])
      },
      error => {
        this.showErrorMessage(error);
      }
    );

  }

  private showErrorMessage(error: any) {
    console.error('An error occurred:', error);

    this.toastr.error(error.message, "Error");
  }

  private showSuccessMessage(response: any) {
    var data = response;

    this.toastr.success(data.message, "Success");

  }
}
