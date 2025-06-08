import { Component } from '@angular/core';
import { Medication } from '../../../../models/user';
@Component({
  selector: 'app-add-medication',

  templateUrl: './add-medication.component.html',
  styleUrl: './add-medication.component.scss'
})

export class AddMedicationComponent {
  newMedication: Partial<Medication> = {};
  editingMedication: Medication | null = null;
  form: any[] = [];
  medications: Medication[] = [
    // { id: 1, medication: 'Dolo', form: 'Tablet',unit:'600mg',frequency:'2 times a day'},
    // { id: 2, medication: 'paracetmol', form: 'Tablet',unit:'500mg',frequency:'1 times a day'},
  ];
  // roles: string[] = ['Admin', 'Editor', 'Viewer']; // options for the dropdown
  

  addMedication() {
    if (this.newMedication.medication && this.newMedication.form && this.newMedication.unit  && this.newMedication.frequency) {
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
}


