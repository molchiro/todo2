import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { auth, provider } from '@/plugins/firebase'

@Module({
  namespaced: true,
  name: 'auth',
  stateFactory: true
})
export default class AuthModule extends VuexModule {
  authedUserUid: string = ''

  @Mutation
  private setUid_(uid: string): void {
    this.authedUserUid = uid
  }

  @Action
  signIn(): void {
    auth.signInWithRedirect(provider)
  }

  @Action
  signOut(): void {
    auth.signOut()
    this.setUid_('')
  }

  @Action
  getCurrentUserUid() {
    return new Promise(async (resolve) => {
      if (!this.authedUserUid) {
        const currentUser: firebase.User | null = await new Promise((resolve) => {
          auth.onAuthStateChanged((user) => {
            resolve(user)
          })
        })
        const uid = currentUser ? currentUser.uid : ''
        this.setUid_(uid)
      }
      resolve(this.authedUserUid)
    })
  }
}
