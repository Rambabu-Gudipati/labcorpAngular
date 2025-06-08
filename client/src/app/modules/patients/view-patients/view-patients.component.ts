import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-view-patients',

  templateUrl: './view-patients.component.html',
  styleUrl: './view-patients.component.scss'
})
export class ViewPatientsComponent implements OnInit{
  patient_data: any = {};
ngOnInit(): void {
  
  const patientDataString = sessionStorage.getItem('patient_data');
  if (patientDataString) {
    this.patient_data = JSON.parse(patientDataString);
  } else {
    console.error('No patient data found in sessionStorage');
    this.patient_data = null;
  }
    
}
}
