import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { AppConstants } from '../../../../app-constants';
import { ActivatedRoute, Router } from '@angular/router';
import { SoundService } from '../../../../services/sound-service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-join-screen',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: '../join-screen/join-screen.component.html',
  styleUrls: ['../join-screen/join-screen.component.scss'],
})
export class JoinScreenComponent implements AfterViewInit {

  @Output() joinMeeting = new EventEmitter();
  @ViewChild('videoPlayer') videoPlayer: ElementRef;
  @Input() participantName: string = '';
  @Input() meetingId: string = '--';
  @Input() sosId: string = "";
  @Input() isCreatedMeetingClicked: boolean = false;
  @Input() isJoinedMeetingClicked: boolean = true;
  @Input() showMeetingIdError: boolean = false;
  @Input() showParticipantNameError: boolean = false;
  @Output() changeName = new EventEmitter<string>();
  @Output() validateMeeting = new EventEmitter<string>();
  @Output() createMeeting = new EventEmitter();
  @Output() startMeeting = new EventEmitter();
  @Input() sos_id: number =0;
  @Input() sosData:  any;

@Input() meeting_token: string = "";
@Input() room_id: string = ""; 

  static sos_id = 0;
  sos_data: any = {};
  fireChangeName() {
    this.changeName.emit(this.participantName);
  }

  fireJoinMeeting() {
    this.joinMeeting.emit();
  }

  fireCreateMeeting() {
    this.createMeeting.emit();
  }

  fireStartMeeting() {
    this.startMeeting.emit();
  }

  fireValidateMeeting() {
    this.validateMeeting.emit(this.meetingId);
  }

  constructor(private cdr: ChangeDetectorRef, private httpService: HttpClientService,  private activeModal: NgbActiveModal,
    private toastr: ToastrService, private route: ActivatedRoute,private router:Router,private soundService: SoundService,) {
    this.videoPlayer = new ElementRef(null);
  }
  ngAfterViewInit(): void {
    // this.joinMeeting.emit();
    this.cdr.detectChanges();
  
  }

  setVideoSource(sourceObject: any) {
    //this.videoPlayer.nativeElement.srcObject = sourceObject;
  }

  ngOnInit() {

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Request permission to access the camera
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          const sourceObject = stream;
          this.setVideoSource(sourceObject);
        })
        .catch((error) => {
          console.error('Error accessing camera:', error);
        });
    }
  
    this.joinMeeting.emit();
    this.soundService.playSound();
  //  var sos = JSON.parse(this.sosData);
    this.sos_data = this.sosData;//JSON.parse(sos.data.sos_info);
    this.doinit();
    // if (history.state.sos_data != null && history.state.sos_data != undefined && history.state.sos_data != "") {
    //   var sos = JSON.parse(history.state.sos_data);
    //   this.sos_data = JSON.parse(sos.data.sos_info);
    //   this.doinit();
      
    // } else {
    //   debugger;
    //   this.route.queryParams.subscribe(params => {
    //     const sosData = params['sos_data'];
    //     if (sosData) {
    //       const payload = JSON.parse(decodeURIComponent(sosData));
    //       console.log('Retrieved payload:', payload);
    //       this.sos_data = JSON.parse(payload?.data?.sos_info);
    //       this.doinit();
    //       // Handle the payload as needed
         
    //     }
    //   });
    // }
 
    
  }
  doinit() {
    
    if (this.room_id!= null && this.room_id != undefined) {
      this.meetingId = this.room_id;
      JoinScreenComponent.sos_id = this.sos_id;
      this.fireJoinMeeting();
      var meeting_token = this.sos_data.sos_room_token;
      localStorage.setItem("video_token", meeting_token);
    }
  }




 
isIncall:boolean=false;
  // joinCall(): void {
  //   // Check if the user is already in a call
  //   if (this.httpService.isInCall) {
  //     this.toastr.warning('You are already in a call. Finish the current call to join another.');
  //     return;
  //   }
  
  //   const data = { sos_id: this.sos_id };
  
  //   this.httpService.postWithAuth(AppConstants.JOIN_CALL, data).subscribe(
  //     (response: any) => {
  //       if (response.status) {
         
  //         // Successfully joined the call
  //         this.activeModal.dismiss();
  //         sessionStorage.setItem('sos_data', JSON.stringify(this.sosData));
  
  //         // Construct the URL with the dynamic route parameter
  //         const baseUrl = window.location.origin;
  //         const newTabUrl = `${baseUrl}/video/join-call`;
        
  //         // Open the new tab
  //         const newTab = window.open(newTabUrl, '_blank');
  //         if (!newTab) {
  //           console.error('Failed to open new tab');
  //         }
  //         // this.router.navigateByUrl('video/join-call', {
  //         //   state: { sos_data: JSON.stringify(this.sosData) },
  //         // });
         
  //         // Set the call state to active
  //         this.httpService.isInCall = true;
  //         this.soundService.stopSound();
  //       } else {
       
  //         this.toastr.error(response.message);
          
  //       }
  //     },
  //     (error) => {
  //       this.toastr.error('Error joining call.'); 
  //     }
  //   );
  //   this.soundService.stopSound();
  // }
  joinCall(): void {
    const activeSosId = sessionStorage.getItem('active_sos_id'); // Retrieve active SOS ID from sessionStorage

  // Check if there is an active SOS ID (user is in a call)
  if (activeSosId) {
    const activeSosIdNumber = parseInt(activeSosId, 10); // Convert stored SOS ID to number
    if (activeSosIdNumber !== this.sos_id) {
      // User is already in a call with a different SOS ID
      this.toastr.warning(
        'You are already in a call. Please finish the current call to join another.'
      );
      return;
    } else {
      // User is already in a call with the same SOS ID
      this.toastr.info('You are already in this call. Reconnecting...');
    }
  }

  // If no active SOS ID is found, check isInCall flag as a fallback
  if (this.httpService.isInCall) {
    this.toastr.error(
      'Error: You are marked as in a call, but the active SOS ID is missing. Please refresh and try again.'
    );
    return;
  }

  
    // Prepare the data for the API call
    const data = { sos_id: this.sos_id };
  
    // API call to join the call
    this.httpService.postWithAuth(AppConstants.CARETEAM_JOIN_SOSCALL, data).subscribe(
      (response: any) => {
        if (response.status) {
          // Successfully joined the call
          this.activeModal.dismiss();
  
          // Update sessionStorage with the active SOS ID and data
          sessionStorage.setItem('sos_data', JSON.stringify(this.sosData));
          sessionStorage.setItem('active_sos_id', this.sos_id.toString()); // Dynamically set the current SOS ID
  
          // Construct the URL for the video call
          const baseUrl = window.location.origin;
          const newTabUrl = `${baseUrl}/video/join-call`;
  
          // Open the new tab for the video call
          const newTab = window.open(newTabUrl, '_blank');
          if (!newTab) {
            console.error('Failed to open new tab');
          }
  
          // Mark the user as in a call
          this.httpService.isInCall = true;
          this.soundService.stopSound();
        } else {
          // Handle API error response
          this.toastr.error(response.message);   
        }
      },
      // (error) => {
      //   // Handle any errors
      //   this.toastr.error(response.message);
      // }
     
    );
  
    this.soundService.stopSound();
  }

  
  dismissModal() {
   
    this.soundService.stopSound();
    this.activeModal.close();
    this.httpService.isInCall = false;
  }
    
}

// import { CommonModule } from '@angular/common';
// import {
//   Component,
//   ElementRef,
//   EventEmitter,
//   Input,
//   OnInit,
//   Output,
//   ViewChild,
// } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ActivatedRoute, Route, Router } from '@angular/router';
// import { environment } from '../../../../../enviroments/enviroment';

// @Component({
//   selector: 'app-join-screen',
//   standalone: true,
//   imports: [FormsModule, CommonModule],
//   templateUrl: './join-screen.component.html',
//   styleUrls: ['../join-screen/join-screen.component.scss'],
// })
// export class JoinScreenComponent implements OnInit {
//   @Output() joinMeeting = new EventEmitter();
//   @ViewChild('videoPlayer') videoPlayer: ElementRef;
//   @Input() participantName: string = '';
//   @Input() meetingId: string = '';
//   @Input() meeting_token: string = '';
//   @Input() isCreatedMeetingClicked: boolean = false;
//   @Input() isJoinedMeetingClicked: boolean = false;
//   @Input() showMeetingIdError: boolean = false;
//   @Input() showParticipantNameError: boolean = false;
//   @Output() changeName = new EventEmitter<string>();
//   @Output() validateMeeting = new EventEmitter<string>();
//   @Output() createMeeting = new EventEmitter();
//   @Output() startMeeting = new EventEmitter();
//   sos_data!: any;
//   fireChangeName() {
//     this.changeName.emit(this.participantName);
//   }

//   fireJoinMeeting() {
//     this.joinMeeting.emit();
//   }

//   fireCreateMeeting() {
//     this.createMeeting.emit();
//   }

//   fireStartMeeting() {
//     this.startMeeting.emit();
//   }

//   fireValidateMeeting() {
//     this.validateMeeting.emit(this.meetingId);
//   }

//   constructor(private router: Router, private activatedRoute: ActivatedRoute) {
//     debugger;
//     this.videoPlayer = new ElementRef(null);
//     console.log("xxxxxxxxxxxxxxxxx:" + this.router?.getCurrentNavigation()?.extras.state);

//   }

//   setVideoSource(sourceObject: any) {
//     this.videoPlayer.nativeElement.srcObject = sourceObject;
//   }

//   ngOnInit() {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       // Request permission to access the camera
//       navigator.mediaDevices
//         .getUserMedia({ video: true })
//         .then((stream) => {
//           const sourceObject = stream;
//           this.setVideoSource(sourceObject);
//         })
//         .catch((error) => {
//           console.error('Error accessing camera:', error);
//         });
//     }
//     var sos = JSON.parse(history.state.sos_data);
//     this.sos_data = JSON.parse(sos.data.sos_info);
//     if (this.sos_data != null && this.sos_data != undefined) {
//       this.meetingId = this.sos_data.room_id;
//       this.fireJoinMeeting();
//       this.meeting_token = this.sos_data.sos_room_token;
//       localStorage.setItem("video_token", this.meeting_token);
//     }
//   }
// }
