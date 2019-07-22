import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { auth, provider } from '@/plugins/firebase'

@Module({ namespaced: true, name: 'auth' })
export default class TestModule extends VuexModule {
  authedUserUid: string = ''

  @Mutation
  setUid(uid: string) {
    this.authedUserUid = uid
  }
  @Action
  signIn() {
    auth.signInWithRedirect(provider)
  }
  @Action
  async getCurrentUser() {
    await auth.onAuthStateChanged(user => {
      const uid = user ? user.uid : ''
      this.setUid(uid)
    })
  }
}