import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db } from '@/plugins/firebase'
import { authStore } from '@/store'
import { User } from '@/models/user'
import { serverTimeStamp } from '@/plugins/firebase'

const usersRef = db.collection('users')

@Module({
  namespaced: true,
  name: 'currentUser',
  stateFactory: true
})
export default class currentUserModule extends VuexModule {
  innerCurrentUser: User = new User({})

  isExists: boolean = false

  get currentUser(): User {
    return new User({...this.innerCurrentUser})
  }
  
  @Mutation
  private SET_CURRENT_USER(user: User): void {
    this.innerCurrentUser = user
    this.isExists = true
  }

  @Mutation
  private CLEAR_CURRENT_USER(): void {
    this.innerCurrentUser = new User({})
    this.isExists = false
  }

  @Action
  loadCurrentUser(): Promise<boolean> {
    return new Promise((resolve) => {
      const mapDoc2User = (doc: firebase.firestore.DocumentSnapshot) => {
        return new User(
          {
            ...doc.data(),
            id: doc.id,
          }
        )
      }
      usersRef
        .doc(authStore.currentUser!.uid)
        .onSnapshot((snapshot) => {
          if (snapshot.exists) {
            this.SET_CURRENT_USER(mapDoc2User(snapshot))
            resolve(true)
          } else {
            this.CLEAR_CURRENT_USER()
            resolve(false)
          }
        }, () =>{
          this.CLEAR_CURRENT_USER()
          resolve(false)
        })
    })
  }

  @Action
  register(user: User): Promise<void> {
    user.id = authStore.currentUser!.uid
    user.createdAt = serverTimeStamp
    return usersRef.doc(user.id).set(user.data())
  }

  @Action
  updateProjctIds(projectIds): void {
    const user = new User({ ...this.currentUser })
    user.projectIds = projectIds
    user.updatedAt = serverTimeStamp
    usersRef.doc(user.id).set(user.data())
  }
}