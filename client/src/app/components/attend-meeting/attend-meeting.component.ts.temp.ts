import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { HttpClientService } from '../../services/http-client-service';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoSDK } from '@videosdk.live/js-sdk';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AppConstants } from '../../app-constants';
import { MeetingService } from '../../modules/video-module/services/meeting.service';
@Component({
    selector: 'app-attend-meeting',
    templateUrl: './attend-meeting.component.html',
    styleUrls: ['./attend-meeting.component.css']
})
export class AttendMeetingComponent implements OnInit, AfterViewInit {
    deviceChangeEventListener: any;
    cameraPermissionAllowed: any = false;
    microphonePermissionAllowed: any = false;
    currentCamera: any;
    currentMic: any;
    currentPlayback: any;
    cameraDeviceDropDown: HTMLElement | null = null;
    microphoneDeviceDropDown: HTMLElement | null = null;
    playBackDeviceDropDown: HTMLElement | null = null;
    micEnable: boolean;
    webCamEnable: boolean;
    joinPageVideoStream: MediaStream | null = null;
    joinPageWebcam: HTMLVideoElement | null = null;
    joinMeetingCodeValue: string = '';
    joinNameValue: string = '';
    participants: any[] = [];
    totalParticipants: number = 0;
    meeting: any = {
        localParticipant: {
            id: 'local-participant-id',
        },
    };
    localParticipant: HTMLDivElement | null = null;
    localParticipantAudio: HTMLAudioElement | null = null;

    meeting_token: any = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI3ODJkY2E1My0wNmE4LTRjYjMtYjdjMy1jZDZhNGQ0Y2YwZjMiLCJleHBpcmVzSW4iOiI3ZCIsInBlcm1pc3Npb25zIjpbImFsbG93X2pvaW4iXSwiaWF0IjoxNzM2MTQ4ODAyLCJleHAiOjE3MzYyMzUyMDJ9.QnFQCoQ6UFvyes2iXadW9QelG-dM4LP4rQFmaMcELfQ";
    meeting_room_id: any = '8zbc-qkev-4epo';

    private customVideoTrack: any;
    private customAudioTrack: any;
    remoteParticipantId: any;
    videoContainer: HTMLAudioElement | null = null;
    videoScreenShare: HTMLAudioElement | null = null;
    btnStartRecording: HTMLAudioElement | null = null;
    btnStopRecording: HTMLAudioElement | null = null;



    constructor() { }

    async ngOnInit() {
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

            this.handlePermissionUI(checkAudioVideoPermission);
            this.handleNetworkStats();
            this.cameraDeviceDropDown = document.getElementById('cameraDeviceDropDown');
            this.microphoneDeviceDropDown = document.getElementById('microphoneDeviceDropDown');
            this.playBackDeviceDropDown = document.getElementById('playBackDeviceDropDown');


            await this.updateDevices();
            await this.enableCam();
            await this.enableMic();

            // Register device change event listener
            this.deviceChangeEventListener = async () => {
                await this.updateDevices();
                await this.enableCam();
            };
            VideoSDK.on('device-changed', this.deviceChangeEventListener);

            this.startMeeting(this.meeting_token, this.meeting_room_id, 'Devaraju Ratnala');


        } catch (error) {
            console.error('Error in permissions handling', error);
        }
    }

    ngAfterViewInit(): void {
        this.addNetworkStatsEventListeners();
    }

    private handlePermissionUI(permissionStatus: any): void {
        if (!permissionStatus.get(VideoSDK.Constants.permission.AUDIO)) {
            document.getElementById('micButton')!.style.display = 'none';
            document.getElementById('no-microphone-permission')!.style.display = 'block';
        }

        if (!permissionStatus.get(VideoSDK.Constants.permission.VIDEO)) {
            document.getElementById('camButton')!.style.display = 'none';
            document.getElementById('no-camera-permission')!.style.display = 'block';
        }
    }
    async updateDevices(): Promise<void> {
        try {
            const checkAudioVideoPermission = await VideoSDK.checkPermissions(VideoSDK.Constants.permission.AUDIO_AND_VIDEO);

            this.cameraPermissionAllowed = checkAudioVideoPermission.get(VideoSDK.Constants.permission.VIDEO);
            this.microphonePermissionAllowed = checkAudioVideoPermission.get(VideoSDK.Constants.permission.AUDIO);

            if (this.cameraPermissionAllowed) {
                await this.updateCameras();
            } else {
                this.handlePermissionNeeded(this.cameraDeviceDropDown, 'Permission needed');
            }

            if (this.microphonePermissionAllowed) {
                await this.updateMicrophones();
                await this.updatePlaybackDevices();
            } else {
                this.handlePermissionNeeded(this.microphoneDeviceDropDown, 'Permission needed');
                this.handlePermissionNeeded(this.playBackDeviceDropDown, 'Permission needed');
            }
        } catch (error) {
            console.error('Error in check permission', error);
        }
    }

    private async updateCameras(): Promise<void> {
        const cameras = await VideoSDK.getCameras();
        if (cameras.length > 0) {
            this.currentCamera = cameras[0];
        }

        if (this.cameraDeviceDropDown) {
            this.cameraDeviceDropDown.innerHTML = '';
            cameras.forEach((camera: any) => {
                const li = this.createDeviceListItem(camera, 'camera', this.currentCamera);
                li.addEventListener('click', () => {
                    this.selectCamera(camera);
                });

                this.cameraDeviceDropDown!.appendChild(li);
            });
        }
    }

    private async updateMicrophones(): Promise<void> {
        const microphones = await VideoSDK.getMicrophones();

        if (this.microphoneDeviceDropDown) {
            this.microphoneDeviceDropDown.innerHTML = '';
            if (microphones.length > 0) {
                this.selectMicrophone(microphones[0]);
            }
            microphones.forEach((mic: any) => {
                const li = this.createDeviceListItem(mic, 'microphone', this.currentMic);
                li.addEventListener('click', () => {
                    this.selectMicrophone(mic);
                });

                this.microphoneDeviceDropDown!.appendChild(li);
            });
        }
    }

    private async updatePlaybackDevices(): Promise<void> {
        const playBackDevices = await VideoSDK.getPlaybackDevices();

        if (this.playBackDeviceDropDown) {
            this.playBackDeviceDropDown.innerHTML = '';
            if (playBackDevices.length > 0) {
                this.selectPlaybackDevice(playBackDevices[0]);
            }
            playBackDevices.forEach((playback: any) => {
                const li = this.createDeviceListItem(playback, 'playback', this.currentPlayback);
                li.addEventListener('click', () => {
                    this.selectPlaybackDevice(playback);
                });

                this.playBackDeviceDropDown!.appendChild(li);
            });
        }
    }

    private createDeviceListItem(device: any, type: string, currentDevice: any): HTMLLIElement {
        const li = document.createElement('li');
        li.id = device.deviceId;
        li.textContent = device.label;
        if (currentDevice && currentDevice.deviceId === device.deviceId) {
            li.innerHTML = `<i class="bi bi-check2"></i> ${device.label}`;
        }
        return li;
    }

    private selectCamera(camera: any): void {
        this.updateSelectedDevice(this.currentCamera, camera, 'select-camera', 'camera');
        this.currentCamera = camera;
        this.toggleWebCam();
        this.toggleWebCam();
    }

    private selectMicrophone(mic: any): void {
        this.updateSelectedDevice(this.currentMic, mic, 'select-microphone', 'microphone');
        this.currentMic = mic;
        this.enableMic();
    }

    private selectPlaybackDevice(playback: any): void {
        this.updateSelectedDevice(this.currentPlayback, playback, 'select-speaker', 'playback');
        this.currentPlayback = playback;
        this.setAudioOutputDevice(playback.deviceId);
    }

    private updateSelectedDevice(currentDevice: any, newDevice: any, selectorId: string, type: string): void {
        if (currentDevice) {
            const previousElement = document.getElementById(currentDevice.deviceId);
            if (previousElement) {
                previousElement.innerHTML = currentDevice.label;
            }
        }

        const selector = document.getElementById(selectorId);
        if (selector) {
            selector.innerHTML = `<i class="bi bi-${type}" style="font-size: 16px;"></i> ${newDevice.label}`;
        }

        const newElement = document.getElementById(newDevice.deviceId);
        if (newElement) {
            newElement.innerHTML = `<i class="bi bi-check2"></i> ${newDevice.label}`;
        }
    }

    private handlePermissionNeeded(dropdown: HTMLElement | null, message: string): void {
        if (dropdown) {
            const option = document.createElement('option');
            option.value = message;
            option.text = message;
            dropdown.appendChild(option);
            //  dropdown.disabled = true;
            dropdown.style.cursor = 'not-allowed';
        }
    }
    toggleMic() {
        console.log('micEnable', this.micEnable);
        if (this.micEnable) {
            const micButton = document.getElementById('micButton');
            const muteMic = document.getElementById('muteMic');
            const unmuteMic = document.getElementById('unmuteMic');

            if (micButton && muteMic && unmuteMic) {
                micButton.style.backgroundColor = '#FF5D5D';
                muteMic.style.display = 'unset';
                unmuteMic.style.display = 'none';
            }
            this.micEnable = false;
        } else {
            this.enableMic();
        }
    }

    async toggleWebCam(): Promise<void> {
        console.log('joinPageVideoStream', this.joinPageVideoStream);
        const joinPageWebcam = document.getElementById('joinCam') as HTMLVideoElement;

        if (this.joinPageVideoStream) {
            const cameraStatus = document.getElementById('camera-status');
            const camButton = document.getElementById('camButton');
            const offCamera = document.getElementById('offCamera');
            const onCamera = document.getElementById('onCamera');

            if (cameraStatus && joinPageWebcam && camButton && offCamera && onCamera) {
                cameraStatus.style.display = 'block';
                joinPageWebcam.style.backgroundColor = '#1C1C1C';
                joinPageWebcam.srcObject = null;
                camButton.style.backgroundColor = '#FF5D5D';
                offCamera.style.display = 'unset';
                onCamera.style.display = 'none';
            }

            this.webCamEnable = false;

            const tracks = this.joinPageVideoStream.getTracks();
            tracks.forEach((track) => track.stop());
            this.joinPageVideoStream = null;
        } else {
            await this.enableCam();
        }
    }


    private async enableCam() {
        if (this.joinPageVideoStream !== null) {
            const tracks = this.joinPageVideoStream.getTracks();
            tracks.forEach((track: MediaStreamTrack) => {
                track.stop();
            });
            this.joinPageVideoStream = null;
            if (this.joinPageWebcam) {
                this.joinPageWebcam.srcObject = null;
            }
        }

        if (this.cameraPermissionAllowed) {
            let mediaStream: MediaStream | null = null;
            console.log(this.currentCamera.deviceId);

            try {
                mediaStream = await VideoSDK.createCameraVideoTrack({
                    cameraId: this.currentCamera.deviceId ? this.currentCamera.deviceId : undefined,
                    optimizationMode: "motion",
                    multiStream: false,
                });
            } catch (ex) {
                console.error("Exception in enableCam", ex);
            }

            if (mediaStream) {
                const cameraStatusElement = document.getElementById("camera-status") as HTMLElement;
                const camButton = document.getElementById("camButton") as HTMLElement;
                const offCamera = document.getElementById("offCamera") as HTMLElement;
                const onCamera = document.getElementById("onCamera") as HTMLElement;

                if (cameraStatusElement) {
                    cameraStatusElement.style.display = "none";
                }

                this.joinPageVideoStream = mediaStream;

                if (this.joinPageWebcam) {
                    this.joinPageWebcam.srcObject = mediaStream;
                    this.joinPageWebcam.play().catch((error: Error) => {
                        console.error("joinPageWebcam.play() failed", error);
                    });
                }

                if (camButton) {
                    camButton.style.backgroundColor = "white";
                }

                if (offCamera) {
                    offCamera.style.display = "none";
                }

                if (onCamera) {
                    onCamera.style.display = "unset";
                }

                this.webCamEnable = true;
            }
        }

    }

    private async enableMic() {
        if (this.microphonePermissionAllowed) {
            this.micEnable = true;

            const micButton = document.getElementById("micButton") as HTMLElement;
            const muteMic = document.getElementById("muteMic") as HTMLElement;
            const unmuteMic = document.getElementById("unmuteMic") as HTMLElement;

            if (micButton) {
                micButton.style.backgroundColor = "white";
            }

            if (muteMic) {
                muteMic.style.display = "none";
            }

            if (unmuteMic) {
                unmuteMic.style.display = "unset";
            }
        }
    }
    private async setAudioOutputDevice(deviceId: string): Promise<void> {
        // console.log(deviceId);
        console.log(deviceId);
        const audioTags = document.getElementsByTagName("audio");
        for (let i = 0; i < audioTags.length; i++) {
            console.log(audioTags[i])
            const audioTag = audioTags.item(i);
            if (audioTag) {
                audioTag.setSinkId(deviceId);
            }
        }
    }

    private addNetworkStatsEventListeners(): void {
        const refreshButton = document.getElementById('refresh');
        const networkErrorRefreshButtons = Array.from(document.querySelectorAll('.network-error-refresh'));

        if (refreshButton) {
            refreshButton.addEventListener('click', async () => {
                await this.handleNetworkStats();
            });
        }

        networkErrorRefreshButtons.forEach((button) => {
            button.addEventListener('click', async () => {
                await this.handleNetworkStats();
            });
        });
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

    handleInputChange(event: Event): void {
        console.log('Event called');
        const input = event.target as HTMLInputElement;
        const inputValue = input.value;

        if (input.id === 'joinMeetingId') {
            this.joinMeetingCodeValue = inputValue;
        } else if (input.id === 'name') {
            this.joinNameValue = inputValue;
        }

        const joinButton = document.querySelector('.inner-join-button') as HTMLElement;
        if (this.joinMeetingCodeValue.length === 14 && this.joinNameValue.length >= 3) {
            console.log('Changes are called');
            if (joinButton) {
                joinButton.style.backgroundColor = '#5A6BFF';
                joinButton.style.border = 'none';
            }
        } else {
            if (joinButton) {
                joinButton.style.backgroundColor = 'rgb(28, 28, 28)';
                joinButton.style.border = '0.1px solid rgb(122, 122, 122)';
            }
        }
    }

    addParticipantToList({ id, displayName }: any): void {
        const participantTemplate = document.createElement('div');
        participantTemplate.className = 'row';
        participantTemplate.style.cssText = `
      padding: 4px;
      margin-top: 1px;
      margin-left: 7px;
      margin-right: 7px;
      border-radius: 3px;
      border: 1px solid rgb(61, 60, 78);
      background-color: rgb(0, 0, 0);
    `;

        // Icon
        const colIcon = document.createElement('div');
        colIcon.className = 'col-2';
        colIcon.innerHTML = 'Icon';
        participantTemplate.appendChild(colIcon);

        // Name
        const content = document.createElement('div');
        content.className = 'col-3';
        content.innerHTML = `${displayName}`;
        participantTemplate.appendChild(content);

        // Add participant to the list
        this.participants.push({ id, displayName });
        console.log(this.participants);

        const participantsList = document.getElementById('participantsList') as HTMLElement;
        participantsList.appendChild(participantTemplate);
        participantsList.appendChild(document.createElement('br'));
    }

    createLocalParticipant(): void {
        this.totalParticipants++;
        const videoContainer = document.getElementById('videoContainer') as HTMLElement;

        this.localParticipant = this.createVideoElement(this.meeting.localParticipant.id);
        this.localParticipantAudio = this.createAudioElement(this.meeting.localParticipant.id);

        videoContainer.appendChild(this.localParticipant);
    }
    private createVideoElement(participantId: string): HTMLDivElement {
        const videoElement = document.createElement('div');
        videoElement.className = `video-participant-${participantId}`;
        videoElement.textContent = `Video for Participant ${participantId}`;
        return videoElement;
    }

    private createAudioElement(participantId: string): HTMLAudioElement {
        const audioElement = document.createElement('audio');
        audioElement.className = `audio-participant-${participantId}`;
        audioElement.textContent = `Audio for Participant ${participantId}`;
        return audioElement;
    }


    async startMeeting(token: string, meetingId: string, name: string): Promise<void> {
        if (this.joinPageVideoStream) {
            const tracks = this.joinPageVideoStream.getTracks();
            tracks.forEach((track) => track.stop());
            this.joinPageVideoStream = null;
            const joinPageWebcam = document.getElementById('joinCam') as HTMLVideoElement;
            joinPageWebcam.srcObject = null;
        }

        // Unsubscribe device change listener
        VideoSDK.off('device-changed', this.deviceChangeEventListener);

        // Configure the SDK
        VideoSDK.config(token);
        let customVideoTrack, customAudioTrack;

        // Prepare video track if webcam is enabled
        if (this.webCamEnable) {
            customVideoTrack = await VideoSDK.createCameraVideoTrack({
                cameraId: this.currentCamera.deviceId || undefined,
                optimizationMode: 'motion',
                multiStream: false,
            });
        }

        // Prepare audio track if microphone is enabled
        if (this.micEnable) {
            customAudioTrack = await VideoSDK.createMicrophoneAudioTrack({
                microphoneId: this.currentMic.deviceId || undefined,
                encoderConfig: 'high_quality',
                noiseConfig: {
                    noiseSuppression: true,
                    echoCancellation: true,
                    autoGainControl: true,
                },
            });
        }

        // Initialize the meeting
        this.meeting = VideoSDK.initMeeting({
            meetingId,
            name,
            micEnabled: this.micEnable,
            webcamEnabled: this.webCamEnable,
            maxResolution: 'hd',
            customCameraVideoTrack: customVideoTrack,
            customMicrophoneAudioTrack: customAudioTrack,
        });

        // Join the meeting
        this.meeting.join();
        this.createLocalParticipants();
        this.setupMeetingEvents();
    }

    private createLocalParticipants(): void {
        this.totalParticipants++;
        const videoContainer = document.getElementById('videoContainer') as HTMLElement;
        const localParticipant = this.createVideoElement(this.meeting.localParticipant.id);
        const localParticipantAudio = this.createAudioElement(this.meeting.localParticipant.id);
        videoContainer.appendChild(localParticipant);
        videoContainer.appendChild(localParticipantAudio);

        // Add to participant list
        this.addParticipantToList({ id: this.meeting.localParticipant.id, displayName: 'You' });
    }

    private setupMeetingEvents(): void {
        this.meeting.localParticipant.on('stream-enabled', (stream: any) => {
            this.setTrack(stream,
                this.localParticipantAudio!,
                this.meeting.localParticipant,
                true);
        });

        this.meeting.localParticipant.on('stream-disabled', (stream: any) => {
            this.handleStreamDisabled(stream);
        });

        this.meeting.on('meeting-joined', () => this.handleMeetingJoined());
        this.meeting.on('meeting-left', () => this.handleMeetingLeft());
        this.meeting.on('participant-joined', (participant: any) => this.handleParticipantJoined(participant));
        this.meeting.on('participant-left', (participant: any) => this.handleParticipantLeft(participant));
        this.meeting.on('recording-started', this.handleRecordingStarted);
        this.meeting.on('recording-stopped', this.handleRecordingStopped);
        this.meeting.on('presenter-changed', (presenterId: string) => this.handlePresenterChanged(presenterId));
    }


    private handleMeetingJoined(): void {
        console.log('Meeting joined');
    }

    private handleMeetingLeft(): void {
        location.reload();
    }

    private handleParticipantJoined(participant: any): void {
        this.totalParticipants++;
        const videoElement = this.createVideoElement(participant.id);
        const audioElement = this.createAudioElement(participant.id);
        const videoContainer = document.getElementById('videoContainer') as HTMLElement;

        videoContainer.appendChild(videoElement);
        videoContainer.appendChild(audioElement);

        participant.on('stream-enabled', (stream: any) => this.setTrack(stream, participant, audioElement, false));
        this.addParticipantToList(participant);
    }

    private handleParticipantLeft(participant: any): void {
        this.totalParticipants--;
        document.getElementById(`v-${participant.id}`)?.remove();
        document.getElementById(`a-${participant.id}`)?.remove();
        document.getElementById(`p-${participant.id}`)?.remove();
    }

    private handleRecordingStarted(): void {
        console.log('Recording started');
    }

    private handleRecordingStopped(): void {
        console.log('Recording stopped');
    }

    private handlePresenterChanged(presenterId: string): void {
        console.log('Presenter changed:', presenterId);
    }


    setTrack(
        stream: any,
        audioElement: HTMLAudioElement,
        participant: any,
        isLocal: boolean
    ): void {
        if (stream.kind === 'video') {
            console.log('setTrack called...');
            if (isLocal) {
                const videoCamOff = document.getElementById('videoCamOff');
                const videoCamOn = document.getElementById('videoCamOn');
                if (videoCamOff) videoCamOff.style.display = 'none';
                if (videoCamOn) videoCamOn.style.display = 'inline-block';
            }

            const mediaStream = new MediaStream();
            mediaStream.addTrack(stream.track);
            const videoElm = document.getElementById(`v-${participant.id}`) as HTMLVideoElement;
            if (videoElm) {
                videoElm.srcObject = mediaStream;
                videoElm
                    .play()
                    .catch((error) => console.error('videoElem.current.play() failed', error));
                participant.setViewPort(videoElm.offsetWidth, videoElm.offsetHeight);
            }
        }

        if (stream.kind === 'audio') {
            const micOff = document.getElementById('micOff');
            const micOn = document.getElementById('micOn');
            if (isLocal) {
                if (micOff) micOff.style.display = 'none';
                if (micOn) micOn.style.display = 'inline-block';
                return;
            }

            const mediaStream = new MediaStream();
            mediaStream.addTrack(stream.track);
            audioElement.srcObject = mediaStream;
            audioElement
                .play()
                .catch((error) => console.error('audioElem.play() failed', error));
        }

        if (stream.kind === 'share' && !isLocal) {

            const mediaStream = new MediaStream();
            mediaStream.addTrack(stream.track);
            const videoScreenShare = document.getElementById('videoScreenShare') as HTMLVideoElement;
            const btnScreenShare = document.getElementById('btnScreenShare');
            if (videoScreenShare) {
                videoScreenShare.srcObject = mediaStream;
                videoScreenShare
                    .play()
                    .catch((error) => console.error('videoElem.current.play() failed', error));
                videoScreenShare.style.display = 'inline-block';
            }
            if (btnScreenShare) btnScreenShare.style.color = 'grey';
        }
    }
    private handleStreamDisabled(stream: any): void {
        console.log('Stream disabled:', stream);
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

    async joinMeeting(newMeeting: boolean): Promise<void> {

        const joinMeetingNameElement = document.getElementById('name') as HTMLInputElement;
        const meetingIdElement = document.getElementById('joinMeetingId') as HTMLInputElement;
        const meetingId = meetingIdElement?.value || '';

        (document.getElementById('meetingid') as HTMLInputElement).value = this.meeting_room_id;
        document.getElementById('joinPage')!.style.display = 'none';
        document.getElementById('gridPpage')!.style.display = 'flex';
        this.toggleControls();
        this.startMeeting(this.meeting_token, this.meeting_room_id, 'Admin');
    }

    toggleControls(): void {
        console.log('from toggleControls');

        const micOn = document.getElementById('micOn');
        const micOff = document.getElementById('micOff');
        const videoCamOn = document.getElementById('videoCamOn');
        const videoCamOff = document.getElementById('videoCamOff');

        if (this.micEnable) {
            console.log('micEnable True');
            if (micOn) micOn.style.display = 'inline-block';
            if (micOff) micOff.style.display = 'none';
        } else {
            console.log('micEnable False');
            if (micOn) micOn.style.display = 'none';
            if (micOff) micOff.style.display = 'inline-block';
        }

        if (this.webCamEnable) {
            console.log('webCamEnable True');
            if (videoCamOn) videoCamOn.style.display = 'inline-block';
            if (videoCamOff) videoCamOff.style.display = 'none';
        } else {
            console.log('webCamEnable False');
            if (videoCamOn) videoCamOn.style.display = 'none';
            if (videoCamOff) videoCamOff.style.display = 'inline-block';
        }
    }

}
