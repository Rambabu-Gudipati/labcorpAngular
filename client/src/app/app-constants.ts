
export class AppConstants {
  public static BASE_DOMAIN = "http://localhost:3000/api/v1/";
  public static API_BASE_URL = "http://localhost:3000/api/v1/";

  public static LOGIN = "auth/login";
  public static LIST_USERS = "admin/users";
  public static LIST_USER_TYPES = "admin/users_types"
  public static LIST_HOSPITALS = "admin/get_hospitals";
  public static LIST_DOCTOR = "admin/get_doctors";
  public static GET_SPECIALIZATION_TYPES = "static/specialization-types"
  public static CREATE_DOCTORS = "admin/create_doctor"
  public static UPDATE_DOCTORS = "admin/doctor-update"
  public static LIST_AMBULANCE = "admin/get_ambulances";
  public static CREATE_USER = "admin/add-prevento-user";
  public static UPDATE_USER = "admin/update-user-details";
  public static UPDATE_FCM_TOKEN = "user/update_token";
  public static JOIN_CALL = "sos/join_call";
  public static END_CALL = "sos/end_call";
  public static CREATE_CARE_TEAM = "careteam/create_careteam";
  public static LIST_CARE_TEAM = "admin/get_careteam";
  public static LIST_CARE_DOCTOR = "admin/get_care_doctors";
  public static CREATE_CARE_DOCTOR="admin/add-care-doctor"
  public static UPDATE_CARE_DOCTOR="admin/update-care-doctor-profile"
  public static ADD_CALL_TO_DOCTOR = "sos/add_call_to_doctor"
  public static LIST_GROUP_USERS = "admin/group-users";
  public static CREATE_GROUP_USER = "group-users";
  public static UPDATE_GROUP_USER = "group-users/update";
  public static UPDATE_GROUP_USER_STATUS = "group-users/update-status";
  public static GET_GROUP_TYPES = "static/entity-types";
  public static GET_STATES = "static/state-names";
  public static GET_CITIES = "static/entity-types";
  public static GET_SOS_CASES = "careteam/sos";
  public static GET_SOS_BY_Id = "sos";
  public static LIST_USER_LOCATIONS = "group-users-locations";
  public static CREATE_GROUP_USER_LOCATIONS = "group-users-locations";
  public static UPDATE_GROUP_USER_LOCATIONS = "group-users-locations/update";
  public static UPDATE_GROUP_CHANGE_STATUS = "group-users-locations/update-status";

  public static LIST_USER_ADVERTISERS = "admin/promoters";
  public static CREATE_ADVERTISER = "promoters";
  public static UPDATE_ADVERTISER = "promoters/update";
  public static UPDATE_ADVERTISERE_STATUS = "promoters/update-status";


  public static GET_AID_BRANDS = "static/aid-brand-names";
  public static GET_AID_MANUFACTURERS = "static/aid-manufacturer-names";


  public static LIST_AID_DEVICE = "admin/aid-devices";
  public static CREATE_AID_DEVICE = "aid-devices/create_aid_device";
  public static UPDATE_AID_DEVICE = "aid-devices/update";
  public static UPDATE_AID_DEVICE_STATUS = "aid-devices/update-status";


  public static GET_ECG_MODELS = "static/ecg-model-names";
  public static GET_ECG_MANUFACTURER = "static/ecg-manufacturer-names";


  public static LIST_ECG_DEVICE = "admin/get-ecg-devices";
  public static CREATE_ECG_DEVICE = "admin/create-ecg-device";
  public static UPDATE_ECG_DEVICE = "admin/update-ecg-device";
  public static UPDATE_ECG_DEVICE_STATUS = "ecg-devices/update-status";
  public static TRACK_AMBULANC_LOCATION = "careteam/ambulance-live-location?ambulance_id=";

  public static GET_CATEGORIES = "static/diagnostic-test-categories";


  public static LIST_DIAGNOSTIC_TEST = "admin/diagnostic-tests";
  public static CREATE_DIAGNOSTIC_TEST = "diagnostic-tests";
  public static UPDATE_DIAGNOSTIC_TEST = "diagnostic-tests/update";

  public static LIST_CARE_MENTOR = "admin/care-mentors";
  public static CREATE_CARE_MENTOR = "admin/add-care-mentor";
  public static UPDATE_CARE_MENTOR = "admin/update-user-details";
  // public static UPDATE_ECG_DEVICE_STATUS = "ecg-devices/update-status";


  public static LIST_NOT_MAPPING_USERS = "admin/users-not-mapped-with-care-mentor";
  public static SAVE_MAPPING_USERS = "admin/user-mapping-with-care-mentor";
  public static LIST_MAPPING_USERS = "care-mentor/assigned-users"


  public static LIST_LAB = "admin/diagnostic-labs";
  public static CREATE_LAB = "admin/add-diagnostic-lab";
  public static UPDATE_LAB = "admin/update-diagnostic-lab";
  public static UPDATE_UPLOAD_REPORT = "care-mentor/upload-report";


  public static LIST_CAREMENTOR_ORDERS = "care-mentor/diagnostic-bookings";
  public static UPDATE_CAREMENTOR_ORDERS = "care-mentor/update-diagnostic-booking-details";


  public static GET_ORDERS_BY_ID = "care-mentor/diagnostic-bookings";
  public static GET_TIME_SLOTS = "static/time-slots";
  public static UPDATE_ASSIGN_ORDERS = "care-mentor/assign-diagnostic-labs";


  public static UPDATE_RESCHEDULE = "care-mentor/reschedule-sample-collection"
  public static UPDATE_SAMPLE_COLLECTION = "care-mentor/update-sample-collection-status"
  public static LIST_DOCTOR_CONSULTATION = "care-mentor/doctor-consultations"
  public static GET_DOCTORS_BY_ID = "care-mentor/doctor-consultation"
  public static GET_APPOINTMENT_SLOTS = "static/appointment-slots"
  public static GET_APPOINTMENT_STATUS = "static/appointment-status"
  public static UPDATE_DOCTOR_CONSULTATION = "care-mentor/update-doctor-consultation"

  public static LIST_DOCTORS_IN_CALENDER = "doctor/consultations"
  public static DOCTOR_JOIN_CALL = "doctor-consultation/update-token"
  public static CARETEAM_ENDCALL_AND_JOINCALL="careteam/update-call-status"
  public static CARETEAM_JOIN_SOSCALL="careteam/join_sos_call"

  public static GET_WELLNESS_PACKAGE = "care-mentor/wellness-packages"
  public static GET_PACKAGES_BY_ID = "care-mentor/wellness-packages"
  public static GET_PACKAGES="static/wellness-packages";
  public static GET_HEALTH_DATA = "static/health-records"
  public static CREATE_HEALTH_DATA = "care-mentor/health-records"
  public static GET_SAVED_HEALTH_DATA = "care-mentor/health-records"


  public static PUSH_NOTIFY_BUTTON = "care-mentor/notify-consultation"

  public static GET_TESTNAME_BY_CATEGORIESID = "diagnostic-tests/tests-data"

  public static CREATE_YEARLYSCREEN = "care-mentor/yearly-screening"
  public static GET_YEARLYSCREEN = "care-mentor/yearly-screening/"

  public static YEARLY_ASSIGN_LAB = "care-mentor/yearly-screening/assign-diagnostic-labs"
  public static YEARLY_RESCHEDULE_LAB = "care-mentor/yearly-screening/reschedule-sample-collection"
  public static YEARLY_UPDATE_SAMPLE_COLLECTION = "care-mentor/yearly-screening/update-sample-collection-status"
  public static YEARLY_UPLOAD_REPORT = "care-mentor/yearly-screening/upload-report"
  public static DELETE_YERALY_SCREEN = "care-mentor/yearly-screening/delete"


  public static LIST_CONFIGURATION = "static/configurations"
  public static CREATE_CONFIGURATION = "admin/add-configuration"
  public static GET_CONFIGURATION = "admin/get-configurations"



  public static LIST_CARETEAM_CARE_DOCTORS = "careteam/get_care_doctors"
  public static LIST_CARETEAM_GET_HOSPITALS = "careteam/get_hospitals"


  public static GET_LAB_NAMES = "care-mentor/diagnostic-labs"
  public static GET_DOCTOR_NAMES = "care-mentor/get_doctors"

  public static UPLOAD_PRESCRIPTION = "doctor/upload-prescription"


  // public static GET_HEALTH_DATA="static/health-records"
  //   public static CREATE_HEALTH_DATA="care-mentor/health-records"


  public static CREATE_INSTANT_MEETING = "video-call/create-meeting"
  public static JOIN_INSTANT_MEETING = "video-call/join-meeting"
}
