import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
admin.initializeApp()

const serverTimestamp = admin.firestore.FieldValue.serverTimestamp()

export const addProject = functions.https.onCall(async (payload, context) => {
  if (context.auth){
    payload.createdAt = serverTimestamp
    payload.createdByUid = context.auth.uid
    payload.updatedAt = serverTimestamp
    payload.updatedByUid = context.auth.uid
    const projectRef = await admin.firestore().collection('projects').add(payload)
    console.log('adding a project was successful')
    admin.firestore()
      .collection('users')
      .doc(context.auth.uid)
      .collection('projects')
      .doc(projectRef.id)
      .set({
        title: payload.title,
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

export const updateProjectTitle = functions.https.onCall(async (payload, context) => {
  if (context.auth){
    const projectId = payload.id
    const title = payload.title
    const projectRef = admin.firestore().collection('projects').doc(projectId)
    projectRef.set({
        title: title,
        updatedAt: serverTimestamp,
        updatedByUid: context.auth.uid
      }, { merge: true })
      .then(() => {
        console.log('updating the project title was successful')
      }, error => {
        console.log('updating the project title was failure', error)
      })
    const members: string[] = await new Promise((resolve) => {
      projectRef.get().then(snapShot => {
        // @ts-ignore
        resolve(snapShot.data().members)
      }, error => {
        console.log('getting project members was failure', error)
      })
    })
    members.forEach(memberId => {
      admin.firestore()
        .collection('users')
        .doc(memberId)
        .collection('projects')
        .doc(projectId)
        .set({ title }, { merge: true })
        .then(() => {
          console.log(`updating ${memberId}'s project title was successful`)
        }, error => {
          console.log(`updating ${memberId}'s project title was failure`, error)
        })
    })
    return null
  } else {
    console.log('not authed')
    return null
  }
})

export const deleteProject = functions.https.onCall(async (projectId, context) => {
  if (context.auth){
    const projectRef = admin.firestore().collection('projects').doc(projectId)
    const members: string[] = await new Promise((resolve) => {
      projectRef.get().then(snapShot => {
        // @ts-ignore
        resolve(snapShot.data().members)
      }, error => {
        console.log('getting project members was failure', error)
      })
    })
    if (members) {
      projectRef.delete()
      .then(() => {
        console.log(`deleting project was successful`)
      }, error => {
        console.log(`deleting project was failure`, error)
      })
      members.forEach(memberId => {
        admin.firestore()
          .collection('users')
          .doc(memberId)
          .collection('projects')
          .doc(projectId)
          .delete()
          .then(() => {
            console.log(`deleting ${memberId}'s project was successful`)
          }, error => {
            console.log(`deleting ${memberId}'s project was failure`, error)
          })
      })
    }
    return null
  } else {
    console.log('not authed')
    return null
  }
})
