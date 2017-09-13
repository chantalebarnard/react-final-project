import firebase from 'firebase';

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCnsPwjlHJL0U1BYICy1bvhvh16_t0M3Wo",
  authDomain: "triplist-bba88.firebaseapp.com",
  databaseURL: "https://triplist-bba88.firebaseio.com",
  projectId: "triplist-bba88",
  storageBucket: "triplist-bba88.appspot.com",
  messagingSenderId: "8163245361"
};
firebase.initializeApp(config);

export const provider = new firebase.auth.GoogleAuthProvider();
export const auth = firebase.auth();
export default firebase;  