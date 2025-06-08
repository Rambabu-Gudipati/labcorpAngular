import { Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { VideoSDK } from '@videosdk.live/js-sdk';
import { MeetingService } from '../../services/meeting.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JoinScreenComponent } from '../join-screen/join-screen.component';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { VideoSDKService } from '../../services/video-sdk.service';
import { interval, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AppConstants } from '../../../../app-constants';
import { HttpClientService } from '../../../../services/http-client-service';
import { Router } from '@angular/router';
import { SoundService } from '../../../../services/sound-service';


@Component({
  selector: 'app-startmeeting',
  standalone: true,
  imports: [TopBarComponent, JoinScreenComponent, CommonModule, FormsModule, ReactiveFormsModule],

  templateUrl: './startmeeting.component.html',
  styleUrl: './startmeeting.component.scss'
})
export class StartmeetingComponent implements OnInit {
  enableWebcamBtn: boolean = false;
  enableMicBtn: boolean = false;

  disableWebcamBtn: boolean = true;
  disableMicBtn: boolean = true;

  meetingId = "";
  token = ""
  id:number;
  @Input() bookAppointment: any;
  @ViewChild('participantGridContainer') participantGridContainer: ElementRef;
  meeting: any;
  sosId: string = '';
  participantName: string = '';
  isCreatedMeetingClicked: boolean = false;
  isJoinedMeetingClicked: boolean = true;
  showMeetingIdError: boolean = false;
  showParticipantNameError: boolean = false;
  showJoinScreen: boolean = true;
  showMeetingScreen: boolean = false;
  showTopBar: boolean = false;
  submitted: boolean = false;
  localParticipant: any;
  participants: any[] = [];
  doctors: any[] = [];
  hospitals: any[] = [];
  sosInfo: any;
  participant: any;
  private timerSubscription!: Subscription;
  public minutes: number = 0;
  public seconds: number = 0;
  sos_data: any;
  constructor(private httpService: HttpClientService, private toastr: ToastrService,
    private renderer: Renderer2, private formBuilder: FormBuilder, private modalService: NgbModal,
    private meetingService: MeetingService, private router: Router,private soundService: SoundService
  ) {
    this.participantGridContainer = new ElementRef(null);
    this.participantName = 'Devaraj';
  }
  ngOnInit() {
    if (history.state.sos_data != null && history.state.sos_data != undefined && history.state.sos_data != "") {
      var sos = JSON.parse(history.state.sos_data);
      console.log(sos);
      this.meetingId = sos.meeting_url;
      this.token = sos.meeting_token;
      this.id=sos.id;
      this.startMeeting();
    }



  }
  // 
  endVideoCall() {
    // Construct the data to update the call status
    var data = { "id": this.id, "status": 4 }; // Status 4 represents an ended call, assuming based on your API
  
    // Make the API call to end the video call
    this.httpService.patch(AppConstants.DOCTOR_JOIN_CALL, data).subscribe(
      (response: any) => {
        // Clear session storage when the call ends
        sessionStorage.removeItem('active_sos_id');
        //sessionStorage.removeItem('sos_data'); // Optionally clear other related data
  
        // Reset the call state to false (not in call anymore)
        this.httpService.isInCall = false;
  
        // Stop any ongoing sounds (if any)
        this.soundService.stopSound();
  
        // Navigate to the dashboard after ending the call
        this.router.navigateByUrl('/doctor/dashboard');
  
        // Optionally log the response data
        var sos_data = JSON.parse(JSON.stringify(response.data));
        console.log(sos_data);
  
        // Optionally show a success toast
        this.toastr.info('The call has been ended.');
      },
      (error) => {
        // Handle any errors
        this.toastr.error('Error ending the call.');
        this.soundService.stopSound();
      }
    );
  }
  public handleNameValidation() {
    if (this.participantName.length < 3) {
      return false;
    } else {
      return true;
    }
  }

  // createMeeting() {
  //   this.isCreatedMeetingClicked = true;
  //   this.meetingService.createMeeting().subscribe(
  //     (roomId) => {
  //       this.meetingId = roomId;
  //     },
  //     (error) => {
  //       console.error('Failed to create meeting:', error);
  //     }
  //   );
  // }

  validateMeeting(meetingId: any) {
    var x = JoinScreenComponent.sos_id;
    this.meetingService.validateMeeting(meetingId).subscribe(
      (isValid) => {
        if (isValid) {

          this.showMeetingIdError = false;
          this.meetingId = meetingId;
          this.startMeeting();
        } else {
          this.showMeetingIdError = true;
        }
      },
      (error) => {
        console.error('Failed to validate meeting:', error);
        // Handle the error
      }
    );
  }
  public changeName(name: any): void {
    this.participantName = name;
  }

  private showErrorMessage(error: any) {
    console.error('An error occurred:', error);
    if (error.message == null || error.message == undefined) {
      this.toastr.error(error.message, "Error");
    } else {
      this.toastr.error(error, "Error");
    }
  }

  private showSuccessMessage(response: any) {
    var data = response;
    //this.toastr.success(data.message, "Success");
    Swal.fire('Saved!', data.message, 'success')

  }

  resetForm() {

  }

  joinMeeting() {
    this.isJoinedMeetingClicked = true;
  }

  async initMeeting() {
    const isNameValid = this.handleNameValidation();
    console.log("this.meetingId    " + this.meetingId);
    if (isNameValid) {
      this.showParticipantNameError = false;
      var authToken = this.token;
      VideoSDK.config(authToken);

      this.meeting = VideoSDK.initMeeting({
        meetingId: this.meetingId, // required
        name: this.participantName, // required
        micEnabled: true, // optional, default: true
        webcamEnabled: true, // optional, default: true
        maxResolution: 'hd', // optional, default: "hd"
      });
    } else {
      this.showParticipantNameError = true;
    }
  }

  startMeeting() {
    this.initMeeting();
    this.meeting.join();
    this.startTimer();
    this.handleMeetingEvents(this.meeting);
    const showJoinScreenMessage = this.renderer.createElement('div');

    this.renderer.setAttribute(
      showJoinScreenMessage,
      'id',
      'show-join-screen-message'
    );
    this.renderer.setProperty(
      showJoinScreenMessage,
      'innerHTML',
      'Please wait to join meeting...'
    );
    this.renderer.setStyle(showJoinScreenMessage, 'color', 'black');
    this.renderer.setStyle(showJoinScreenMessage, 'fontSize', '20px');
    this.renderer.setStyle(showJoinScreenMessage, 'fontWeight', 'bold');
    this.renderer.setStyle(showJoinScreenMessage, 'marginTop', '20px');
    this.renderer.setStyle(showJoinScreenMessage, 'marginLeft', '20px');
    this.renderer.appendChild(document.body, showJoinScreenMessage);
  }

  createVideoElement(
    stream: any,
    participant: any,
    participantMediaElement: any
  ) {
    const video = this.renderer.createElement('video');
    const mediaStream = new MediaStream();
    mediaStream.addTrack(stream.track);
    this.renderer.setAttribute(video, 'id', `v-${participant.id}`);
    this.renderer.setAttribute(video, 'autoplay', 'true');
    this.renderer.setAttribute(video, 'playsinline', 'true');
    this.renderer.setAttribute(video, 'muted', 'true');
    this.renderer.setAttribute(
      video,
      'style',
      'width: 100%; height: 100%;position: absolute;top: 0;left: 0; : none;'
    );
    this.renderer.setProperty(video, 'srcObject', mediaStream);
    const videoElement = this.renderer.createElement('div');
    this.renderer.setAttribute(
      videoElement,
      'id',
      `video-container-${participant.id}`
    );
    this.renderer.setAttribute(
      videoElement,
      'style',
      'width: 100%; height: 100%;'
    );
    this.renderer.setStyle(videoElement, 'position', 'relative');

    this.renderer.appendChild(participantMediaElement, videoElement);
    this.renderer.appendChild(videoElement, video);

    const cornerDisplayName = this.renderer.createElement('div');
    this.renderer.setAttribute(
      cornerDisplayName,
      'id',
      `name-container-${participant.id}`
    );
    this.renderer.setStyle(cornerDisplayName, 'position', 'absolute');
    this.renderer.setStyle(cornerDisplayName, 'bottom', '16px');
    this.renderer.setStyle(cornerDisplayName, 'left', '16px');
    this.renderer.setStyle(cornerDisplayName, 'color', 'white');
    this.renderer.setStyle(
      cornerDisplayName,
      'backgroundColor',
      'rgba(0, 0, 0, 0.5)'
    );
    this.renderer.setStyle(cornerDisplayName, 'padding', '2px');
    this.renderer.setStyle(cornerDisplayName, 'borderRadius', '2px');
    this.renderer.setStyle(cornerDisplayName, 'fontSize', '12px');
    this.renderer.setStyle(cornerDisplayName, 'fontWeight', 'bold');
    this.renderer.setStyle(cornerDisplayName, 'zIndex', '1');
    this.renderer.setStyle(cornerDisplayName, 'padding', '4px');
    cornerDisplayName.innerHTML =
      participant.displayName.length > 15
        ? participant.displayName.substring(0, 15) + '...'
        : participant.displayName;
    this.renderer.appendChild(videoElement, cornerDisplayName);
  }

  createAudioElement(
    stream: any,
    participant: any,
    participantMediaElement: any
  ) {
    const audio = this.renderer.createElement('audio');
    const mediaStream = new MediaStream();
    mediaStream.addTrack(stream.track);
    this.renderer.setAttribute(audio, 'id', `audio-${participant.id}`);
    this.renderer.setAttribute(audio, 'autoplay', 'true');
    this.renderer.setAttribute(audio, 'playsinline', 'true');
    this.renderer.setAttribute(audio, 'muted', 'true');
    this.renderer.setProperty(audio, 'srcObject', mediaStream);

    const audioElement = this.renderer.createElement('div');
    this.renderer.setAttribute(
      audioElement,
      'id',
      `audio-container-${participant.id}`
    );
    this.renderer.appendChild(participantMediaElement, audioElement);
    this.renderer.appendChild(audioElement, audio);
  }

  handleStreamEnabled(
    stream: any,
    participant: any,
    isLocal: any,
    participantMediaElement: any
  ) {
    if (stream.kind == 'video') {
      var nameElement = document.getElementById(
        `name-container-${participant.id}`
      );
      participantMediaElement.removeChild(nameElement);
      this.createVideoElement(stream, participant, participantMediaElement);
    }
    if (!isLocal) {
      if (stream.kind == 'audio') {
        console.log('audio stream enabled');
        this.createAudioElement(stream, participant, participantMediaElement);
      }
    }
  }

  handleStreamDisabled(
    stream: any,
    participant: any,
    isLocal: any,
    participantMediaElement: any
  ) {
    if (stream.kind == 'video') {
      console.log('video stream disabled');

      var videoElement = document.getElementById(
        `video-container-${participant.id}`
      );

      var nameElement = this.renderer.createElement('div');
      this.renderer.setAttribute(
        nameElement,
        'id',
        `name-container-${participant.id}`
      );
      nameElement.innerHTML = participant.displayName.charAt(0).toUpperCase();
      this.renderer.setStyle(nameElement, 'backgroundColor', 'black');
      this.renderer.setStyle(nameElement, 'color', 'white');
      this.renderer.setStyle(nameElement, 'textAlign', 'center');
      this.renderer.setStyle(nameElement, 'padding', '32px');
      this.renderer.setStyle(nameElement, 'borderRadius', '100%');
      this.renderer.setStyle(nameElement, 'fontSize', '20px');
      this.renderer.removeChild(participantMediaElement, videoElement);
      this.renderer.appendChild(participantMediaElement, nameElement);
    }
    if (!isLocal) {
      if (stream.kind == 'audio') {
        console.log('audio stream disabled');
        var audioElement = document.getElementById(
          `audio-container-${participant.id}`
        );
        this.renderer.removeChild(participantMediaElement, audioElement);
      }
    }
  }

  remoteparticipantGridGenerator(participant: any) {
    var participantGridItem1 = this.renderer.createElement('div');
    this.renderer.setStyle(participantGridItem1, 'borderRadius', '10px');
    // this.renderer.setStyle(participantGridItem1, 'height', '0');
    this.renderer.setStyle(participantGridItem1, 'aspectRatio', 16 / 9);
    // this.renderer.setStyle(participantGridItem1, 'width', '360px');
    this.renderer.setStyle(participantGridItem1, 'marginTop', '8px');
    this.renderer.setStyle(participantGridItem1, 'display', 'flex');
    this.renderer.setStyle(participantGridItem1, 'alignItems', 'center');
    this.renderer.setStyle(participantGridItem1, 'justifyContent', 'center');
    // this.renderer.setStyle(participantGridItem1, 'position', 'relative');
    // this.renderer.setStyle(participantGridItem1, 'paddingTop', '56.25%');
    this.renderer.setStyle(participantGridItem1, 'overflow', 'hidden');

    this.renderer.setAttribute(
      participantGridItem1,
      'id',
      `participant-grid-item-${participant.id}`
    );

    this.renderer.setAttribute(participantGridItem1, 'class', 'col-8');

    var participantMediaElement1 = this.renderer.createElement('div');
    this.renderer.setAttribute(
      participantMediaElement1,
      'id',
      `participant-media-container-${participant.id}`
    );
    this.renderer.setStyle(participantMediaElement1, 'position', 'relative');
    this.renderer.setStyle(participantMediaElement1, 'width', '100%');
    this.renderer.setStyle(participantMediaElement1, 'height', '100%');
    this.renderer.setStyle(participantMediaElement1, 'display', 'flex');
    this.renderer.setStyle(participantMediaElement1, 'alignItems', 'center');
    this.renderer.setStyle(
      participantMediaElement1,
      'justifyContent',
      'center'
    );

    var nameElement = this.renderer.createElement('div');
    this.renderer.setAttribute(
      nameElement,
      'id',
      `name-container-${participant.id}`
    );
    nameElement.innerHTML = participant.displayName.charAt(0).toUpperCase();
    this.renderer.setStyle(nameElement, 'backgroundColor', 'black');
    this.renderer.setStyle(nameElement, 'color', 'white');
    this.renderer.setStyle(nameElement, 'textAlign', 'center');
    this.renderer.setStyle(nameElement, 'padding', '32px');
    this.renderer.setStyle(nameElement, 'borderRadius', '100%');
    this.renderer.setStyle(nameElement, 'fontSize', '20px');

    this.renderer.appendChild(
      this.participantGridContainer.nativeElement,
      participantGridItem1
    );

    this.renderer.appendChild(participantGridItem1, participantMediaElement1);
    this.renderer.appendChild(participantMediaElement1, nameElement);

    var participantGridItem = document.getElementById(
      `participant-grid-item-${participant.id}`
    );
    var participantMediaElement = document.getElementById(
      `participant-media-container-${participant.id}`
    );

    return {
      participantGridItem,
      participantMediaElement,
    };
  }

  participantGridGenerator(participant: any) {
    var participantGridItem1 = this.renderer.createElement('div');
    this.renderer.setStyle(participantGridItem1, 'borderRadius', '10px');
    // this.renderer.setStyle(participantGridItem1, 'height', '0');
    this.renderer.setStyle(participantGridItem1, 'aspectRatio', 16 / 9);
    // this.renderer.setStyle(participantGridItem1, 'width', '360px');
    this.renderer.setStyle(participantGridItem1, 'marginTop', '8px');
    this.renderer.setStyle(participantGridItem1, 'display', 'flex');
    this.renderer.setStyle(participantGridItem1, 'alignItems', 'center');
    this.renderer.setStyle(participantGridItem1, 'justifyContent', 'center');
    // this.renderer.setStyle(participantGridItem1, 'position', 'relative');
    // this.renderer.setStyle(participantGridItem1, 'paddingTop', '56.25%');
    this.renderer.setStyle(participantGridItem1, 'overflow', 'hidden');

    this.renderer.setAttribute(
      participantGridItem1,
      'id',
      `participant-grid-item-${participant.id}`
    );

    this.renderer.setAttribute(participantGridItem1, 'class', 'col-4');

    var participantMediaElement1 = this.renderer.createElement('div');
    this.renderer.setAttribute(
      participantMediaElement1,
      'id',
      `participant-media-container-${participant.id}`
    );
    this.renderer.setStyle(participantMediaElement1, 'position', 'relative');
    this.renderer.setStyle(participantMediaElement1, 'width', '100%');
    this.renderer.setStyle(participantMediaElement1, 'height', '100%');
    this.renderer.setStyle(participantMediaElement1, 'display', 'flex');
    this.renderer.setStyle(participantMediaElement1, 'alignItems', 'center');
    this.renderer.setStyle(
      participantMediaElement1,
      'justifyContent',
      'center'
    );

    var nameElement = this.renderer.createElement('div');
    this.renderer.setAttribute(
      nameElement,
      'id',
      `name-container-${participant.id}`
    );
    nameElement.innerHTML = participant.displayName.charAt(0).toUpperCase();
    this.renderer.setStyle(nameElement, 'backgroundColor', 'black');
    this.renderer.setStyle(nameElement, 'color', 'white');
    this.renderer.setStyle(nameElement, 'textAlign', 'center');
    this.renderer.setStyle(nameElement, 'padding', '32px');
    this.renderer.setStyle(nameElement, 'borderRadius', '100%');
    this.renderer.setStyle(nameElement, 'fontSize', '20px');

    this.renderer.appendChild(
      this.participantGridContainer.nativeElement,
      participantGridItem1
    );

    this.renderer.appendChild(participantGridItem1, participantMediaElement1);
    this.renderer.appendChild(participantMediaElement1, nameElement);

    var participantGridItem = document.getElementById(
      `participant-grid-item-${participant.id}`
    );
    var participantMediaElement = document.getElementById(
      `participant-media-container-${participant.id}`
    );

    return {
      participantGridItem,
      participantMediaElement,
    };
  }

  handleMeetingEvents(meeting: any) {
    this.localParticipant = meeting.localParticipant;
    this.participants = meeting.participants;

    meeting.on('meeting-joined', () => {
      var showJoinScreenMessage = document.getElementById(
        'show-join-screen-message'
      );
      this.renderer.removeChild(document.body, showJoinScreenMessage);
      const { participantMediaElement } = this.participantGridGenerator(
        this.meeting.localParticipant
      );
      this.showTopBar = true;

      meeting.localParticipant.on('stream-enabled', (stream: any) => {
        console.log('Stream Enabled: ');
        this.handleStreamEnabled(
          stream,
          meeting.localParticipant,
          true,
          participantMediaElement
        );
      });
      meeting.localParticipant.on('stream-disabled', (stream: any) => {
        console.log('Stream Disabled: ');
        this.handleStreamDisabled(
          stream,
          meeting.localParticipant,
          true,
          participantMediaElement
        );
      });
    });

    meeting.on('participant-left', (participant: any) => {
      console.log('Participant Left: ', participant.id);

      var participantGridItem = document.getElementById(
        `participant-grid-item-${participant.id}`
      );

      this.participantGridContainer.nativeElement.removeChild(
        participantGridItem
      );
    });

    meeting.on('meeting-left', () => {
      console.log('Meeting Left');
      // remove all children nodes from participant grid container
      while (this.participantGridContainer.nativeElement.firstChild) {
        this.participantGridContainer.nativeElement.removeChild(
          this.participantGridContainer.nativeElement.firstChild
        );
      }
      this.showMeetingScreen = false;
      this.showJoinScreen = true;
    });

    //remote participant
    meeting.on('participant-joined', (participant: any) => {
      console.log('New Participant Joined: ', participant.id);

      var { participantMediaElement } =
        this.remoteparticipantGridGenerator(participant);
      participant.setQuality('high');
      participant.on('stream-enabled', (stream: any) => {
        this.handleStreamEnabled(
          stream,
          participant,
          false,
          participantMediaElement
        );
      });
      participant.on('stream-disabled', (stream: any) => {
        this.handleStreamDisabled(
          stream,
          participant,
          false,
          participantMediaElement
        );
      });
    });

    if (meeting) {
      this.showJoinScreen = false;
      this.showMeetingScreen = true;
    }
  }

  enableWebcam(event: Event) {
    event.preventDefault();
    this.meeting.enableWebcam();
    this.enableWebcamBtn = false;
    this.disableWebcamBtn = true;
  }

  muteMic(event: Event) {
    event.preventDefault();
    this.meeting.muteMic();
    this.enableMicBtn = true;
    this.disableMicBtn = false;
  }

  unmuteMic(event: Event) {
    event.preventDefault();
    this.meeting.unmuteMic();
    this.enableMicBtn = false;
    this.disableMicBtn = true;
  }

  leaveMeeting() {
    this.router.navigateByUrl('/doctor/dashboard');
    //this.meeting.leave();
    // this.showMeetingScreen = false;
    // this.showJoinScreen = true;
  }

  disableWebcam(event: Event) {
    event.preventDefault();
    this.meeting.disableWebcam();
    this.enableWebcamBtn = true;
    this.disableWebcamBtn = false;
  }

  loadAddDoctorPopup(content: any) {

    this.modalService.open(content, { centered: true });
  }
  startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      this.seconds++;
      if (this.seconds === 60) {
        this.minutes++;
        this.seconds = 0;
      }
    });
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

 

}

