import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
admin.initializeApp()

export const addProject = functions.https.onCall(async (data, context) => {
  if (context.auth){
    const projectRef = await admin.firestore().collection('projects').add(data)
    console.log('adding a project was successful')
    admin.firestore()
      .collection('users')
      .doc(context.auth.uid)
      .collection('projects')
      .doc(projectRef.id)
      .set({
        title: data.title,
        priority: 1
      })
      .then(() => {
        console.log('adding a project in the user collection was successful')
      }, error => {
        console.log('adding a project in the user collection was failure', error)
      })
    return { id: projectRef.id }
  } else {
    console.log('not authed')
    return null
  }
})
