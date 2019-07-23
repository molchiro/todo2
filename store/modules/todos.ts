import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db } from '@/plugins/firebase'
const todosRef = db.collection('todos')

@Module({
  namespaced: true,
  name: 'todos',
  stateFactory: true
})
export default class TodosModule extends VuexModule {
  @Action
  add(content: string) {
    todosRef.add({
      uid: this.context.rootState.auth.authedUserUid,
      content: content,
      priority: Math.random() * 10,
      done: false,
      doneAt: null
    })
  }
}