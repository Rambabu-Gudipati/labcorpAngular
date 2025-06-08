// services/video-sdk.service.ts
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class VideoSDKService {
    async checkPermissions(): Promise<any> {
        try {
            return await (window as any).VideoSDK.checkPermissions(
                (window as any).VideoSDK.Constants.permission.AUDIO_AND_VIDEO
            );
        } catch (error) {
            console.error('Error in checkPermissions', error);
            return null;
        }
    }

    async requestPermissions(): Promise<any> {
        try {
            return await (window as any).VideoSDK.requestPermission(
                (window as any).VideoSDK.Constants.permission.AUDIO_AND_VIDEO
            );
        } catch (error) {
            console.error('Error in requestPermissions', error);
            return null;
        }
    }

    async getNetworkStats(timeoutDuration: number = 120000): Promise<any> {
        try {
            return await (window as any).VideoSDK.getNetworkStats({ timeoutDuration });
        } catch (error) {
            console.error('Error fetching network stats:', error);
            throw error;
        }
    }

    async getCameras(): Promise<any[]> {
        return await (window as any).VideoSDK.getCameras();
    }

    async getMicrophones(): Promise<any[]> {
        return await (window as any).VideoSDK.getMicrophones();
    }

    async getPlaybackDevices(): Promise<any[]> {
        return await (window as any).VideoSDK.getPlaybackDevices();
    }
}