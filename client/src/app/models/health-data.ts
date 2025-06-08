export interface Section {
  section_id: number;
  section_name: string;
  section_data: Category[];
}
export interface Subitem {
  id: number;
  name: string;
  selected:boolean;
}

export interface Category {
  category_id: number;
  category: string;
  subitems: Subitem[];
}



export interface MedicalHistory {
  sections: Section[];
}

export interface Medication {
  id: number;
   medication: string;
  form: string;
  unit: string;
  frequency: string;
}