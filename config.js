import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDLKz-65Gu3DZxOlbFBt5Pfgcco7nZyDds",
    authDomain: "healthprediction-7da70.firebaseapp.com",
    projectId: "healthprediction-7da70",
    storageBucket: "healthprediction-7da70.appspot.com",
    messagingSenderId: "605654658540",
    appId: "1:605654658540:web:28d3c38fed3988c5d6a4c9"
}

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export { firebase }