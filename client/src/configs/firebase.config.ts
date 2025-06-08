import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';
import { environment } from '../enviroments/enviroment';

firebase.initializeApp(environment.firebaseConfig);
export const messaging = firebase.messaging();

