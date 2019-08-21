import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { auth, provider } from '@/plugins/firebase'

@Module({
  namespaced: true,
  name: 'auth',
  stateFactory: true
})
export default class AuthModule extends VuexModule {
  currentUser: firebase.User | null = null

  get currentUserUid(): string {
    return this.currentUser ? this.currentUser.uid : ''
  }

  @Mutation
  private setUser_(user: firebase.User | null): void {
    this.currentUser = user
  }

  @Action
  signIn(): void {
    auth.signInWithRedirect(provider)
  }

  @Action
  signOut(): void {
    auth.signOut()
    this.setUser_(null)
  }

  @Action
  authenticate() {
    return new Promise(async (resolve) => {
      if (!this.currentUser) {
        const currentUser: firebase.User | null = await new Promise((resolve) => {
          auth.onAuthStateChanged((user) => {
            resolve(user)
          })
        })
        this.setUser_(currentUser)
      }
      resolve(!!this.currentUser)
    })
  }
}
