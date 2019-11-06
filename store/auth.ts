import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { auth, provider } from '@/plugins/firebase'

@Module({
  namespaced: true,
  name: 'auth',
  stateFactory: true
})
export default class AuthModule extends VuexModule {
  currentUser: { uid: string } | null = null

  get currentUserUid(): string {
    return this.currentUser ? this.currentUser.uid : ''
  }

  @Mutation
  private SET_USER(user: firebase.User | null): void {
    this.currentUser =  user ? { uid: user.uid } : null
  }

  @Action
  signIn(): void {
    auth.signInWithRedirect(provider)
  }

  @Action
  signOut(): void {
    auth.signOut()
    this.SET_USER(null)
  }

  @Action
  authenticate(): Promise<boolean> {
    return new Promise(async (resolve) => {
      if (!this.currentUser) {
        const currentUser: firebase.User | null = await new Promise((resolve) => {
          auth.onAuthStateChanged((user) => {
            resolve(user)
          })
        })
        this.SET_USER(currentUser)
      }
      resolve(!!this.currentUser)
    })
  }
}
