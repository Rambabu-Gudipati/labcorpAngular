import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientService } from '../../../../services/http-client-service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AddMedicationComponent } from '../add-medication/add-medication.component';
import { Medication } from '../../../../models/user';
import { Category, MedicalHistory, Section, Subitem } from '../../../../models/health-data';
import { AppConstants } from '../../../../app-constants';
import Swal from 'sweetalert2';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-create-health-details',

  templateUrl: './create-health-details.component.html',
  styleUrl: './create-health-details.component.scss'
})
export class CreateHealthDetailsComponent implements OnInit {
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
  newMedication: Partial<Medication> = {};
  editingMedication: Medication | null = null;

  constructor(private httpService: HttpClientService, private toastr: ToastrService, private route: ActivatedRoute, private modalservice: NgbModal) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.Id = params.get('user_id');
      console.log('User ID:', this.Id);
      // You can now use this ID to fetch data or perform other actions
    });
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.form = [
      { name: '', id: 1 },
      { name: 'Tablet', id: 2 },
      { name: 'Syrup', id: 3 },
      { name: 'Injection', id: 3 },


    ];
 
    this.httpService.getwithAuth(AppConstants.GET_HEALTH_DATA).subscribe((response) => {
      this.selectedCategories = response;
      this.parseMedicalHistoryData(this.selectedCategories);
      console.log(this.selectedCategories); // You can log the data to the console to verify
    });
    this.subitems = new Array<string>();
  
  }


  medications: Medication[] = [
    { id: 1, medication: 'Dolo', form: 'Tablet', unit: '600mg', frequency: '2 times a day' },
    { id: 2, medication: 'paracetmol', form: 'Tablet', unit: '500mg', frequency: '1 times a day' },
  ];
  // roles: string[] = ['Admin', 'Editor', 'Viewer']; // options for the dropdown
  
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
    
    this.medicalHistory.sections.forEach((section) => {
      const sectionEntry = {
        section_name: section.section_name,
        categories: [] as { category_name: string; selected_subitems: Subitem[] }[]
      };
  
      section.section_data.forEach((category) => {
        const categoryEntry = {
          category_name: category.category,
          selected_subitems: [] as Subitem[]
        };
  
        category.subitems.forEach((subitem) => {
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
    const selectedValues = this.getSelectedValues(); 
    const medications = this.medications; 
    var data={
      selectedValues: selectedValues,
      medications: medications,
    }
    console.log('Updated subitems:', JSON.stringify(data));
    this.submitted = true;
    var health_data = {
      "data": JSON.stringify(data),
      "user_id":this.Id
     
    }
    this.httpService.postWithAuth(AppConstants.CREATE_HEALTH_DATA, health_data).subscribe(
      (response: any) => {
        this.showSuccessMessage(response);
      },
      error => {
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

