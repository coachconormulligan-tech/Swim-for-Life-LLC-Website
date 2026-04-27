// Initialize Firebase - wait for scripts to load
var db = null;
var firebaseReady = false;
try {
    var firebaseConfig = {
        apiKey: "AIzaSyD36qFfdJfnZ-xxCW2KnKTDNifYphF5FCc",
        authDomain: "swim-team-data-f8300.firebaseapp.com",
        projectId: "swim-team-data-f8300",
        storageBucket: "swim-team-data-f8300.firebasestorage.app",
        messagingSenderId: "181650404201",
        appId: "1:181650404201:web:f58a39ac7d8fc3ae8543f8",
        measurementId: "G-BTMZ5S8WYH"
    };
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    firebaseReady = true;
} catch (e) {
    console.error('Firebase init error:', e);
}

// Initialize EmailJS
emailjs.init('m13Tjtg2maUWTyjPA');
