
export interface User {
  role: string;
  user_id: number;
  doctor_name: string;
  mobileNo: string;
  email: string;
  profile_pic_url: string;
  access_token: string;
}

export interface Medication {
  id: number;
   medication: string;
  form: string;
  unit: string;
  frequency: string;
}

export interface Tests {

   id: number;
  test_category: string;
  test_sub_category: string;
  test_name: string;
  due_date: string;
}

