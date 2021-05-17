import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyCIEUILPSr8bIAtQ5tqmeifh7J9lnoGp94",
  authDomain: "barter-system-99db0.firebaseapp.com",
  databaseURL: "https://barter-system-99db0.firebaseio.com",
  projectId: "barter-system-99db0",
  storageBucket: "barter-system-99db0.appspot.com",
  messagingSenderId: "842098000498",
  appId: "1:842098000498:web:7cb4cffc3a5f27c2a938eb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();