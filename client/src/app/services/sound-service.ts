import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class SoundService {
    private audio: any;;

    constructor() {
        this.audio = new Audio('assets/incoming-call.mp3');
        this.audio.loop = true;  // Enable repeating the sound
    }

    playSound(): void {
        this.audio.play();
        this.audio.currentTime = 0;
    }

    stopSound(): void {
        this.audio.pause();
        this.audio.currentTime = 0; // Reset to the beginning
    }
}