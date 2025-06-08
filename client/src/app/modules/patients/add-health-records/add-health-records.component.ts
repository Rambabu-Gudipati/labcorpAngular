import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HttpClientService } from '../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConstants } from '../../../app-constants';
import Swal from 'sweetalert2';
import { Category, MedicalHistory, Medication, Section, Subitem } from '../../../models/health-data';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-add-health-records',

  templateUrl: './add-health-records.component.html',
  styleUrl: './add-health-records.component.scss'
})
export class AddHealthRecordsComponent implements OnInit{

  @Input() Id: any = 0;
  @Input() isEdit: boolean = false;
  medicalHistory: MedicalHistory = { sections: [] };
  submitted = false
  
  checked: boolean = false;
  check: boolean = false;
  // form: Array<any> = [];

  form: any[] = [];
  selectedCategories: any[] = [];

  subitems: any[] = [];
  selectedValues: any;
  loading: boolean;
  patient_data: any = {};

  constructor(private httpService: HttpClientService, private toastr: ToastrService, private route: ActivatedRoute, private modalservice: NgbModal,
    private cdr: ChangeDetectorRef,private router: Router,) {

  }

  
  ngOnInit(): void {
    const patientDataString = sessionStorage.getItem('patient_data');
    if (patientDataString) {
      this.patient_data = JSON.parse(patientDataString);
    } else {
      console.error('No patient data found in sessionStorage');
      this.patient_data = null;
    }
      
      console.log('Patient Data:', this.patient_data);


    this.route.paramMap.subscribe(params => {
      this.Id = params.get('user_id');
      console.log('User ID:', this.Id);
      // You can now use this ID to fetch data or perform other actions
    });
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.medicalHistory = navigation.extras.state['medicalHistory'];
    }

    if (!this.medicalHistory) {
      console.error('No medical history data found!');
    } else {
      console.log('Received medicalHistory:', this.medicalHistory);
    }
 
    
    if (!this.medicalHistory) {
      const patient_id = this.route.snapshot.paramMap.get('patient_id');
      if (patient_id) {
        this.loadSavedHealthData(patient_id);
      }
    }
    

    
    this.form = [
      { name: '', id: 1 },
      { name: 'Tablet', id: 2 },
      { name: 'Syrup', id: 3 },
      { name: 'Injection', id: 4 },


    ];
 
    this.httpService.getwithAuth(AppConstants.GET_HEALTH_DATA).subscribe((response) => {
      this.selectedCategories = response;
      this.parseMedicalHistoryData(this.selectedCategories);
      console.log(this.selectedCategories); // You can log the data to the console to verify
    });
    this.subitems = new Array<string>();
  
  }
  loadSavedHealthData(patient_id: string) {
    this.httpService
    .getwithAuth(`${AppConstants.GET_SAVED_HEALTH_DATA}?patient_id=${patient_id}`)
    .subscribe({
      next: (response) => {
        const fetchedData = JSON.parse(response.data.data);
        if (fetchedData.selectedValues) {
          this.updateMedicalHistory(fetchedData.selectedValues);
        }
      },
      error: (err) => {
        console.error('Error fetching health data:', err);
      },
    });
  }
  onCheckboxChange(subitem: any) {
    console.log('Checkbox updated:', subitem);
  }
  updateMedicalHistory(data: any) {
    this.medicalHistory = data;
    this.cdr.detectChanges(); // Notify Angular of changes
  }

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
 
  
  // onSubmit() {

  //   const selectedValues = this.getSelectedValues(); 
  //   const medications = this.medications; 
  //   var data={
  //     selectedValues: selectedValues,
  //     medications: medications,
  //   }
  //   console.log('Updated subitems:', JSON.stringify(data));
  //   if (selectedValues.length === 0 && medications.length === 0) {
  //     this.toastr.error("No data available to submit.");
  //     return;
  //   }
  //   this.submitted = true;
  //   var health_data = {
  //     "data": JSON.stringify(data),
  //     "user_id":this.Id
     
  //   }
  //   this.httpService.postWithAuth(AppConstants.CREATE_HEALTH_DATA, health_data).subscribe(
  //     (response: any) => {
  //       this.showSuccessMessage(response);
  //       window.location.reload();
  //     },
  //     error => {
  //       this.showErrorMessage(error);
      
  //     }
  //   );
  
    
  // }
  onSubmit() {
    const selectedValues = this.getSelectedValues();  // Function to get selected values from `medicalHistory`
    const medications = this.medications;  // Assuming medications are part of the form data
  
    const data = {
      selectedValues: selectedValues,
      medications: medications,
    };
  
    if (selectedValues.length === 0 && medications.length === 0) {
      this.toastr.error("No data available to submit.");
      return;
    }
  
    const health_data = {
      data: JSON.stringify(data),
      user_id: this.Id,
    };
  
    this.httpService.postWithAuth(AppConstants.CREATE_HEALTH_DATA, health_data).subscribe(
      (response: any) => {
        this.showSuccessMessage(response);
        this.router.navigate(['/patients/health-summary']);  // Navigate to summary page after submission
      },
      (error) => {
        this.showErrorMessage(error);
      }
    );
  }
  
  private showErrorMessage(error: any) {
    console.error('An error occurred:', error);
    this.toastr.error(error, "Error");

  }

  private showSuccessMessage(response: any) {
    var data = response;
    // this.toastr.success(data.message, "Success");
     Swal.fire(this.isEdit ? 'Updated' : 'Saved', data.message, 'success')
     //this.form.reset();
    this.modalservice.dismissAll(true);
  }


  
}