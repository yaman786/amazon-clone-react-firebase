import firebase from 'firebase';
const firebaseConfig = {
    apiKey: "AIzaSyBhaCPTz-dWNdXYIK9sPMmpJhuicpyU96A",
    authDomain: "challenge-234d4.firebaseapp.com",
    databaseURL: "https://challenge-234d4.firebaseio.com",
    projectId: "challenge-234d4",
    storageBucket: "challenge-234d4.appspot.com",
    messagingSenderId: "181057217893",
    appId: "1:181057217893:web:947238e95bab9de10f6d8c",
    measurementId: "G-6TRVMSWS1C"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export {db,auth};