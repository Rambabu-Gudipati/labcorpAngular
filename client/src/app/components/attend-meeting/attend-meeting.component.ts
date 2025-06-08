import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { HttpClientService } from '../../services/http-client-service';
import { FormBuilder, Validators, AbstractControl, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoSDK } from '@videosdk.live/js-sdk';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AppConstants } from '../../app-constants';
import { MeetingService } from '../../modules/video-module/services/meeting.service';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-attend-meeting',
  templateUrl: './attend-meeting.component.html',
  styleUrls: ['./attend-meeting.component.css']
})
export class AttendMeetingComponent implements OnInit {

  @ViewChild('participantGridContainer') participantGridContainer: ElementRef;
  sos_data: any;
  title = 'videosdk-angular2-rtc-demo';
  meeting: any;
  isCreateMeeting = false;
  isJoinMeeting = false;
  sosId: string = '';
  participantName: string = '';
  isCreatedMeetingClicked: boolean = false;
  isJoinedMeetingClicked: boolean = true;
  showmeeting_room_idError: boolean = false;
  showParticipantNameError: boolean = false;
  create_meeting: boolean = false;
  showJoinScreen: boolean = true;
  showMeetingScreen: boolean = false;
  showTopBar: boolean = false;
  submitted: boolean = false;
  localParticipant: any;
  participants: any[] = [];
  doctors: any[] = [];
  hospitals: any[] = [];
  meeting_url: any;


  enableWebcamBtn: boolean = false;
  enableMicBtn: boolean = false;
  disableWebcamBtn: boolean = true;
  disableMicBtn: boolean = true;
  form: FormGroup = new FormGroup({
    doctor_name: new FormControl(''),
  });
  form1: FormGroup = new FormGroup({
    hospital_name: new FormControl(''),
  });
  participant: any;
  isVideoEnabled = true;
  isAudioEnabled = true;
  stream: MediaStream;
  private timerSubscription!: Subscription;
  public minutes: number = 0;
  public seconds: number = 0;
  totalParticipants: number = 0;
  isValidMeeting: boolean = false;
  report_id: number = 0;
  meeting_token: any = "";
  meeting_room_id: any = null;
  divWidth: string = 'col-4';
  selectedDate: Date | null = null;
  videoElement!: HTMLVideoElement;
  pageWrapper!: HTMLVideoElement
  constructor(private httpService: HttpClientService, private toastr: ToastrService, private route: ActivatedRoute,
    private renderer: Renderer2, private formBuilder: FormBuilder, private modalService: NgbModal, private authService: AuthService,
    private meetingService: MeetingService, private el: ElementRef, private router: Router
  ) {
    this.participantGridContainer = new ElementRef(null);
  }
  ngOnInit() {
    this.pageWrapper = document.querySelector('.page-wrapper')!;

    if (this.pageWrapper) {
      this.pageWrapper.style.marginLeft = '0';
      this.pageWrapper.style.paddingTop = '0';
      this.pageWrapper.style.backgroundColor = '#212032';
    }
    this.route.paramMap.subscribe(params => {
      console.log('room-id->' + params.get('id'))
      if (params.get('id') != null) {
        this.meeting_room_id = params.get('id');
        this.isCreatedMeetingClicked = true;
      }
    });

    this.checkPermissions();
    this.startVideo();
    localStorage.setItem('video_token', this.meeting_token);
    // this.validateMeeting(this.meeting_room_id);
    this.form = this.formBuilder.group(
      {
        display_name: ['', [Validators.required]],
        meeting_id: [this.meeting_room_id, [Validators.required]]
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

  createMeeting() {
    this.isCreatedMeetingClicked = true;
    this.meetingService.createMeeting().subscribe(
      (roomId) => {
        this.meeting_room_id = roomId;
      },
      (error) => {
        console.error('Failed to create meeting:', error);
      }
    );
  }
  get f1(): { [key: string]: AbstractControl } {
    return this.form1.controls;
  }
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  joinMeeting() {
    if (this.isCreatedMeetingClicked == false) {
      this.isCreatedMeetingClicked = true;
      return;
    }

    if (this.meeting_room_id == undefined || this.meeting_room_id == null || this.meeting_room_id == '' || this.meeting_room_id.trim().length != 14) {
      this.toastr.error('Please enter a valid room id. Room Id should be 14 digits', 'Error');
      return;
    }
    if (this.participantName == undefined || this.participantName == null || this.participantName == '' || this.participantName.trim().length < 3) {
      this.toastr.error('Name should minimum 3 digits', 'Error');
      return;
    }
    this.isJoinedMeetingClicked = true;
    this.httpService.get(AppConstants.JOIN_INSTANT_MEETING + '?meeting_id=' + this.meeting_room_id)
      .subscribe(x => {
        this.meeting_token = x.data;
        localStorage.setItem("video_token", this.meeting_token);
        this.validateMeeting(this.meeting_room_id);
        document.getElementById('join-div')!.style.display = 'none';
      });
  }
  onCreateMeeting(): void {

    this.httpService.postWithAuth(AppConstants.CREATE_INSTANT_MEETING, null).subscribe(
      (response: any) => {
        this.meeting_room_id = response.data.room_id;
        this.meeting_token = response.data.auth_token;
        localStorage.setItem("video_token", this.meeting_token);

        var userProfile = JSON.parse(this.authService.getUserInfo());
        this.participantName = userProfile.username;

        this.validateMeeting(this.meeting_room_id);
        document.getElementById('join-div')!.style.display = 'none';
      },

      error => {
        this.toastr.error(error, "Something went to wrong");
      }
    );

  }
  validateMeeting(meeting_room_id: any) {

    this.meetingService.validateMeeting(meeting_room_id).subscribe(
      (isValid) => {
        if (isValid) {
          this.meeting_url = AppConstants.BASE_DOMAIN + 'meeting/join-meeting/' + meeting_room_id;
          this.isValidMeeting = isValid;
          this.showmeeting_room_idError = false;
          this.meeting_room_id = meeting_room_id;
          this.stream.getVideoTracks()[0].enabled = false;
          this.stream.getAudioTracks()[0].enabled = false;
          this.startMeeting();
        } else {
          this.showmeeting_room_idError = true;
        }
      },
      (error) => {
        this.isValidMeeting = false;
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
    this.form.reset();
  }

  resetForm() {
    this.form.reset();
  }
  dismissModal() {
  }


  async initMeeting() {
    const isNameValid = this.handleNameValidation();
    console.log("this.meeting_room_id    " + this.meeting_room_id);
    if (isNameValid) {
      this.showParticipantNameError = false;
      var authToken = this.meeting_token
      VideoSDK.config(authToken);

      this.meeting = VideoSDK.initMeeting({
        meetingId: this.meeting_room_id, // required
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
      'width: 100%; height: 100%;position: absolute;top: 0;left: 0;object-fit: cover;'
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
  loadSOSData() {
    if (history.state.sos_data != null && history.state.sos_data != undefined && history.state.sos_data != "") {
      var sos = JSON.parse(history.state.sos_data);
      this.sos_data = JSON.parse(history.state.sos_data);
      this.doinit();
    } else {
      this.route.queryParams.subscribe(params => {
        const sosData = params['sos_data'];
        if (sosData) {
          const payload = JSON.parse(decodeURIComponent(sosData));
          console.log('Retrieved payload:', payload);
          this.sos_data = JSON.parse(payload?.data?.sos_info);
          this.doinit();
          // Handle the payload as needed
        }
      });
    }
  }
  doinit() {
    if (this.sos_data != null && this.sos_data != undefined) {
      this.report_id = this.sos_data.report_id;
      this.meeting_room_id = this.sos_data.meeting_room_id;
      var meeting_token = this.sos_data.meeting_room_token;
      localStorage.setItem("video_token", meeting_token);
      this.validateMeeting(this.meeting_room_id);
    }
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

  participantGridGenerator(participant: any) {
    var participantGridItem1 = this.renderer.createElement('div');
    // this.renderer.setStyle(
    //   participantGridItem1,
    //   'backgroundColor',
    //   'white'
    // );
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
    this.getDivClass();
    this.renderer.setAttribute(participantGridItem1, 'class', this.divWidth);

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

    console.log("No of PArticipants --->" + this.participants.length);
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
      this.totalParticipants--;
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
      this.totalParticipants++;
      var { participantMediaElement } =
        this.participantGridGenerator(participant);
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
    this.meeting.leave();
    this.showMeetingScreen = false;
    this.showJoinScreen = true;
    this.isValidMeeting = false;
    // document.getElementById('join-div')!.style.display = 'flex';
    this.router.navigate(['/']).then(() => {
      // Then force a full page reload
      window.location.reload();
    });

  }
  exitMeeting() {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });

  }
  disableWebcam(event: Event) {
    event.preventDefault();
    this.meeting.disableWebcam();
    this.enableWebcamBtn = true;
    this.disableWebcamBtn = false;
  }

  loadAddDoctorPopup(content: any) {
    this.form.reset();
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
  toggleWebCam() {
  }

  showInputFields(): void {
    const inputElements = document.querySelectorAll<HTMLElement>('.join-meeting-input');
    inputElements.forEach((element) => {
      element.style.display = 'block';
    });

    const joinButtons = document.querySelectorAll<HTMLElement>('.join-btn');
    joinButtons.forEach((btn) => {
      btn.style.display = 'none';
    });
  }

  toggleMic() {
  }
  openParticipantWrapper(): void {
    const participantsElement = document.getElementById('participants');
    const gridPageElement = document.getElementById('gridPpage');
    const closeBtnElement = document.getElementById('ParticipantsCloseBtn');
    const totalParticipantsElement = document.getElementById('totalParticipants');

    if (participantsElement) {
      participantsElement.style.width = '350px';
    }
    if (gridPageElement) {
      gridPageElement.style.marginRight = '350px';
    }
    if (closeBtnElement) {
      closeBtnElement.style.visibility = 'visible';
    }
    if (totalParticipantsElement) {
      totalParticipantsElement.style.visibility = 'visible';
      totalParticipantsElement.innerHTML = `Participants (${this.totalParticipants})`;
    }
  }

  startVideo() {
    this.videoElement = document.querySelector('video')!;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        this.stream = stream;
        this.videoElement.srcObject = stream;
      })
      .catch(err => {
        console.error('Error accessing camera:', err);
      });
  }

  toggleVideo() {
    if (this.isVideoEnabled) {
      this.stream.getVideoTracks()[0].enabled = false;
    } else {
      this.stream.getVideoTracks()[0].enabled = true;
    }
    this.isVideoEnabled = !this.isVideoEnabled;
  }

  toggleAudio() {
    if (this.isAudioEnabled) {
      this.stream.getAudioTracks()[0].enabled = false;
    } else {
      this.stream.getAudioTracks()[0].enabled = true;
    }
    this.isAudioEnabled = !this.isAudioEnabled;
  }
  closeParticipantWrapper(): void {
    const participantsElement = document.getElementById('participants');
    const gridPageElement = document.getElementById('gridPpage');
    const closeBtnElement = document.getElementById('ParticipantsCloseBtn');
    const totalParticipantsElement = document.getElementById('totalParticipants');

    if (participantsElement) {
      participantsElement.style.width = '0';
    }
    if (gridPageElement) {
      gridPageElement.style.marginRight = '0';
    }
    if (closeBtnElement) {
      closeBtnElement.style.visibility = 'hidden';
    }
    if (totalParticipantsElement) {
      totalParticipantsElement.style.visibility = 'hidden';
    }
  }

  getDivClass() {
    // if (this.totalParticipants == 1) {
    //   this.divWidth = 'col-12';
    // } else if (this.totalParticipants == 2) {
    //   this.divWidth = 'col-6';
    // } else {
    //   if (this.totalParticipants == 1) {
    //     this.divWidth = 'col-4';
    //   }
    // }
    this.divWidth = 'col-6';
  }
  async checkPermissions() {
    try {
      let checkAudioVideoPermission = await VideoSDK.checkPermissions(
        VideoSDK.Constants.permission.AUDIO_AND_VIDEO
      );

      console.log(
        'Check Audio and Video Permissions',
        checkAudioVideoPermission.get(VideoSDK.Constants.permission.AUDIO),
        checkAudioVideoPermission.get(VideoSDK.Constants.permission.VIDEO)
      );

      if (
        checkAudioVideoPermission.get(VideoSDK.Constants.permission.VIDEO) === false ||
        checkAudioVideoPermission.get(VideoSDK.Constants.permission.AUDIO) === false
      ) {
        checkAudioVideoPermission = await VideoSDK.requestPermission(
          VideoSDK.Constants.permission.AUDIO_AND_VIDEO
        );
      }

      console.log(
        'Request Audio and Video Permissions',
        checkAudioVideoPermission.get(VideoSDK.Constants.permission.AUDIO),
        checkAudioVideoPermission.get(VideoSDK.Constants.permission.VIDEO)
      );




    } catch (error) {
      console.error('Error in permissions handling', error);
    }
  }
  private async handleNetworkStats(): Promise<void> {
    try {
      const refreshElement = document.getElementById('refresh')!;
      refreshElement.firstElementChild?.classList.replace('bi-arrow-cloclwise', 'bi-arrow-repeat');
      refreshElement.classList.add('spin');

      document.getElementById('download-speed-div')!.style.display = 'none';
      document.getElementById('upload-speed-div')!.style.display = 'none';
      document.getElementById('check-speed-div')!.style.display = 'unset';
      document.getElementById('network-stats')!.style.marginLeft = '445px';

      const result = await VideoSDK.getNetworkStats({ timeoutDuration: 120000 });

      document.getElementById('download-speed-div')!.style.display = 'flex';
      document.getElementById('upload-speed-div')!.style.display = 'flex';
      document.getElementById('check-speed-div')!.style.display = 'none';
      document.getElementById('network-stats')!.style.marginLeft = '375px';

      refreshElement.firstElementChild?.classList.replace('bi-arrow-repeat', 'bi-arrow-cloclwise');
      refreshElement.classList.remove('spin');

      document.getElementById('download-speed')!.innerHTML = `${result.downloadSpeed} MBPS`;
      document.getElementById('upload-speed')!.innerHTML = `${result.uploadSpeed} MBPS`;
      document.getElementById('network-stats')!.style.display = 'flex';
    } catch (error) {
      console.error('Error fetching network stats', error);

      document.getElementById('network-stats')!.style.display = 'none';
      if (error === 'Not able to get NetworkStats due to no Network') {
        document.getElementById('network-error-offline')!.style.display = 'flex';
      } else if (error === 'Not able to get NetworkStats due to timeout') {
        document.getElementById('network-error-online')!.style.display = 'flex';
      }
    }
  }
  copyToClipboard(inputElement: HTMLInputElement) {
    inputElement.select(); // Select the text
    inputElement.setSelectionRange(0, 99999); // For mobile devices

    try {
      // Try to execute the clipboard write
      document.execCommand('copy');
      alert("Text copied to clipboard!");
    } catch (err) {
      console.error("Unable to copy text", err);
    }
  }

  getFormattedDate(date: Date | null): string {
    if (!date) return '';
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}
