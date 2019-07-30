import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { auth, provider } from '@/plugins/firebase'

@Module({
  namespaced: true,
  name: 'auth',
  stateFactory: true
})
export default class TestModule extends VuexModule {
  authedUserUid: string = ''

  get isAuthed(): boolean {
    return this.authedUserUid !== ''
  }

  @Mutation
  setUid(uid: string) {
    this.authedUserUid = uid
  }

  @Action
  signIn() {
    auth.signInWithRedirect(provider)
  }

  @Action
  signOut() {
    auth.signOut()
    this.setUid('')
  }

  @Action
  async getCurrentUser() {
    const currentUser: firebase.User | null = await new Promise((resolve) => {
      auth.onAuthStateChanged((user) => {
        resolve(user)
      })
    })
    const uid = currentUser ? currentUser.uid : ''
    this.setUid(uid)
  }
}
