import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'
admin.initializeApp()

const serverTimestamp = admin.firestore.FieldValue.serverTimestamp()

const addProjectIntoUsersProjects = async (uid: string, projectId: string) => {
  const userRef = admin.firestore().collection('users').doc(uid)
    const userSnapShot = await userRef.get()
    if (userSnapShot.exists) {
      const projectIds: string[] = userSnapShot.data()!.projectIds
      projectIds.splice(0, 0, projectId)
      userRef.set({ projectIds }, { merge: true })
      .then(() => {
        console.log('adding a project in the user collection was successful')
      }, error => {
        console.log('adding a project in the user collection was failure', error)
      })
    }
}

export const addProject = functions.https.onCall(async (payload, context) => {
  if (context.auth){
    payload.createdAt = serverTimestamp
    payload.createdByUid = context.auth.uid
    payload.updatedAt = serverTimestamp
    payload.updatedByUid = context.auth.uid
    const projectRef = await admin.firestore().collection('projects').add(payload)
    console.log('adding a project was successful')
    addProjectIntoUsersProjects(context.auth.uid, projectRef.id).then(() => {
      console.log('callong addProjectIntoUsersProjects was successful')
    }, error => {
      console.log('callong addProjectIntoUsersProjects was failure', error)
    })
    return { id: projectRef.id }
  } else {
    console.log('not authed')
    return null
  }
})

export const deleteProject = functions.https.onCall(async (targetProjectId, context) => {
  if (context.auth){
    const projectRef = admin.firestore().collection('projects').doc(targetProjectId)
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
      members.forEach(async memberId => {
        const userRef = admin.firestore().collection('users').doc(memberId)
        const userSnapShot = await userRef.get()
        if (userSnapShot.exists) {
          const oldProjectIds: string[] = userSnapShot.data()!.projectIds
          userRef.set({
            'projectIds': oldProjectIds.filter(projectId => projectId !== targetProjectId)
          }, {
            merge: true
          }).then(() => {
            console.log(`deleting ${memberId}'s project was successful`)
          }, error => {
            console.log(`deleting ${memberId}'s project was failure`, error)
          })
        }
      })
    }
    return null
  } else {
    console.log('not authed')
    return null
  }
})

export const joinProject = functions.https.onCall(async (invitationCode, context) => {
  if (context.auth) {
    const projectSnapshot: FirebaseFirestore.QueryDocumentSnapshot = await new Promise((resolve) => {
      admin.firestore()
        .collection('projects')
        .where('invitationCode', "==", invitationCode)
        .get()
        .then((snapshot) => {
          resolve(snapshot.docs[0]) 
        }, error => {
          console.log('getting project snapshot was failure', error)
        })
    })
    if (!projectSnapshot) {
      console.log('target project was not found')
      return null
    }
    const projectId = projectSnapshot.id
    const members = projectSnapshot.data().members
    members.splice(0, 0, context.auth.uid)
    projectSnapshot.ref
      .set({ members }, { merge: true })
      .then(() => {
        console.log('pushing a memberId into the memberIds was successful')
      }, error => {
        console.log('pushing a memberId into the memberIds was failure', error)
      })
    addProjectIntoUsersProjects(context.auth.uid, projectId).then(() => {
      console.log('calling addProjectIntoUsersProjects was successful')
    }, error => {
      console.log('calling addProjectIntoUsersProjects was failure', error)
    })
    return projectId
  } else {
    console.log('not authed')
    return null
  }
})
