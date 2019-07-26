import * as firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBRm6GGQpfIN9GL0YosrIgWOoz5pV5e1gA",
    authDomain: "todo2-b01aa.firebaseapp.com",
    databaseURL: "https://todo2-b01aa.firebaseio.com",
    projectId: "todo2-b01aa",
    storageBucket: "",
    messagingSenderId: "96640668344",
    appId: "1:96640668344:web:a151532922328da3"
}

firebase.initializeApp(firebaseConfig)

export const provider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const db = firebase.firestore()
export const serverTimeStamp = firebase.firestore.FieldValue.serverTimestamp()