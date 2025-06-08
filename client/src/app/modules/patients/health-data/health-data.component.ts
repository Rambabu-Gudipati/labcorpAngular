


import { Component, Input, input, OnInit } from '@angular/core';
import { HttpClientService } from '../../../services/http-client-service';
import { Category, MedicalHistory, Medication, Section, Subitem } from '../../../models/health-data';
import { AppConstants } from '../../../app-constants';
import { ActivatedRoute, Router } from '@angular/router';

import { AddHealthRecordsComponent } from '../add-health-records/add-health-records.component';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-health-data',
 
  templateUrl: './health-data.component.html',
  styleUrl: './health-data.component.scss'
})
 export class HealthDataComponent implements OnInit{
  medicalHistory: any;
  submitted = false;
 
  checked: boolean = false;
  check: boolean = false;
  // form: Array<any> = [];
  @Input() patient_id:any;
  form: any[] = [];
  selectedCategories: any;
  items: any[] = [];

  subitems: any[] = [];
  patient_data: any = {};
  patientData: any = null;
  constructor(private httpService: HttpClientService,private route: ActivatedRoute,private modalservice: NgbModal,private router: Router,private toastr: ToastrService) {

  }

  ngOnInit(): void {
    const patientDataString = sessionStorage.getItem('patient_data');
    if (patientDataString) {
      this.patient_data = JSON.parse(patientDataString);
    } else {
      console.error('No patient data found in sessionStorage');
      this.patient_data = null;
    }
      
    


    this.route.paramMap.subscribe(params => {
      this.patient_id = params.get('user_id');
    
   
    });
  
 
  //  this.loadSavedHealthRecords(this.user_id)
    
    this.form = [
      { name: '', id: 1 },
      { name: 'Tablet', id: 2 },
      { name: 'Syrup', id: 3 },
      { name: 'Injection', id: 3 },


    ];
    this.httpService.getwithAuth(`${AppConstants.GET_SAVED_HEALTH_DATA}?patient_id=${this.patient_id}`).subscribe((response) => {
      this.selectedCategories =JSON.parse( response.data.data);
      this.medicalHistory=this.selectedCategories.selectedValues;
      this.medications=this.selectedCategories.medications;
      if (response && response.data && response.data.data) {
        this.selectedCategories = JSON.parse(response.data.data);
        this.medicalHistory = this.selectedCategories.selectedValues || [];
        this.medications = this.selectedCategories.medications || [];
      } else {
        // Handle the case where no health data is present
        this.selectedCategories = null;
        this.medicalHistory = [];
        this.medications = [];
        console.log('No health data added.');
        // Optionally, you can show a user-facing message here
      }
    }, (error) => {
      console.error('Error fetching health data:', error);
            
    });
    this.subitems = new Array<string>();
  }
  // loadSavedHealthRecords(patient_id:number) {
    
    
  //   this.httpService..subscribe(res => {
  //     this.selectedCategories = res.data;
  //     // adjust according to your response structure
  //   });
  // }


  medications: Medication[] = [
  
  ];
  // roles: string[] = ['Admin', 'Editor', 'Viewer']; // options for the dropdown
  newMedication: Partial<Medication> = {};
  editingMedication: Medication | null = null;

  addMedication() {
    if (this.newMedication.medication && this.newMedication.form && this.newMedication.unit && this.newMedication.frequency) {
      const newId = this.medications.length ? Math.max(...this.medications.map(u => u.id)) + 1 : 1;
      this.medications.push({ id: newId, ...this.newMedication } as Medication);
      this.newMedication = {}; // Clear the form
    }
  }

  editMedication(user: Medication) {
    this.editingMedication = { ...user }; // Copy to avoid direct mutation
  }

  updateMedication() {
    if (this.editingMedication) {
      const index = this.medications.findIndex(u => u.id === this.editingMedication!.id);
      if (index > -1) this.medications[index] = this.editingMedication;
      this.editingMedication = null; // Exit editing mode
    }
  }

  deleteMedication(id: number) {
    this.medications = this.medications.filter(medication => medication.id !== id);
  }
  parseMedicalHistoryData(data: any): void {
    this.medicalHistory.sections = data.map((section: any) => {
      const parsedSection: Section = {
        section_id: section.section_id,
        section_name: section.section_name,
        section_data: section.section_data.map((category: any) => {
          const parsedCategory: Category = {
            category_id: category.category_id,
            category: category.category,
            subitems: category.subitems.map((subitem: any) => {
              const parsedSubitem: Subitem = {
                id: subitem.id,
                name: subitem.name,
                selected:false
              };
              return parsedSubitem;
            })
          };
          return parsedCategory;
        })
      };
      return parsedSection;
    });
  }
  getSelectedValues(): any[] {
    const selectedValues: any[] = [];
    
    this.medicalHistory.sections.forEach((section: { section_name: any; section_data: any[]; }) => {
      const sectionEntry = {
        section_name: section.section_name,
        categories: [] as { category_name: string; selected_subitems: Subitem[] }[]
      };
  
      section.section_data.forEach((category) => {
        const categoryEntry = {
          category_name: category.category,
          selected_subitems: [] as Subitem[]
        };
  
        category.subitems.forEach((subitem: Subitem) => {
          if (subitem.selected) {
            categoryEntry.selected_subitems.push(subitem);
          }
        });
  
        if (categoryEntry.selected_subitems.length > 0) {
          sectionEntry.categories.push(categoryEntry);
        }
      });
  
      if (sectionEntry.categories.length > 0) {
        selectedValues.push(sectionEntry);
      }
    });
  
    console.log('Selected Values:', selectedValues);
    return selectedValues;
  }
 
  
  onSubmit() {
    console.log('Updated subitems:', JSON.stringify(this.medicalHistory));
    }

    onEditClick(patient_id: any, medicalHistory: any, patient_data: any) {
      // Navigate to 'health-details' with both medicalHistory and patient_data
     
    
    
      // Fetch saved health data
      this.httpService
        .getwithAuth(`${AppConstants.GET_SAVED_HEALTH_DATA}?patient_id=${patient_id}`)
        .subscribe({
          next: (response) => {
            // Parse the response data
            const fetchedData = JSON.parse(response.data.data);
    
            if (fetchedData.selectedValues) {
              // Populate `medicalHistory` with fetched data
              this.medicalHistory = fetchedData.selectedValues;
    
              console.log('Populated medicalHistory:', this.medicalHistory);
    
              // Pass the updated data along with patient_data
               sessionStorage.setItem('patient_data', JSON.stringify(patient_data));
      sessionStorage.setItem('medicalHistory', JSON.stringify(medicalHistory));
  
      // Construct the URL with the dynamic route parameter
      const baseUrl = window.location.origin;
      const newTabUrl = `${baseUrl}/patients/health-details/${patient_id}`;
    
      // Open the new tab
      const newTab = window.open(newTabUrl, '_blank');
      if (!newTab) {
        console.error('Failed to open new tab');
      }
            } else {
              console.warn('No selected values found in fetched data');
            }
          },
          error: (err) => {
            console.error('Error fetching saved health data:', err);
          },
        });
    }
    
    
    onAddHealthDataClick(patient_id: any, patient_data: any) {
      // Store data in sessionStorage
      sessionStorage.setItem('patient_data', JSON.stringify(patient_data));
  
      // Construct the URL with the dynamic route parameter
      const baseUrl = window.location.origin;
      const newTabUrl = `${baseUrl}/patients/health-details/${patient_id}`;
    
      // Open the new tab
      const newTab = window.open(newTabUrl, '_blank');
      if (!newTab) {
        console.error('Failed to open new tab');
      }
}
 }