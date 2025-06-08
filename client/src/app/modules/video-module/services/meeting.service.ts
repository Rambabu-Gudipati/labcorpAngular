import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class MeetingService {

  constructor(private http: HttpClient) { }

  createMeeting(): Observable<string> {
    var authToken = localStorage.getItem('video_token')!;
    const apiUrl = 'https://api.videosdk.live/v2/rooms';
    const headers = new HttpHeaders({
      authorization: authToken,
      'Content-Type': 'application/json',
    });

    return this.http
      .post<{ roomId: string }>(apiUrl, {}, { headers })
      .pipe(map((response) => response.roomId));
  }

  validateMeeting(meetingId: string): Observable<boolean> {
    var authToken = localStorage.getItem('video_token')!;
    const url = `https://api.videosdk.live/v2/rooms/validate/${meetingId}`;
    const headers = new HttpHeaders({
      authorization: authToken,
      'Content-Type': 'application/json',
    });

    return this.http.get<{ roomId: string }>(url, { headers }).pipe(
      map((response) => {
        return response.roomId === meetingId;
      }),
      catchError((error) => {
        console.error('Error:', error);
        return of(false);
      })
    ) as Observable<boolean>;
  }

  ngOnInit() { }
}