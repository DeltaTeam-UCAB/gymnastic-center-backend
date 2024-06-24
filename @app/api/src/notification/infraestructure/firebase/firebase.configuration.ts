import firebase from 'firebase-admin'
import { join } from 'node:path'

firebase.initializeApp({
    credential: firebase.credential.cert(
        require(join(process.cwd(), './firebase.json').replaceAll('\\', '/')),
    ),
})

export const firebaseInitialized = firebase
