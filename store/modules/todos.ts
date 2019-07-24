import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db } from '@/plugins/firebase'
const todosRef = db.collection('todos')

interface todo {
  key: string,
  uid: string,
  content: string,
  priority: number,
  done: boolean,
  doneAt: Date | null
}

@Module({
  namespaced: true,
  name: 'todos',
  stateFactory: true
})
export default class TodosModule extends VuexModule {
  todos: todo[] = []

  @Mutation
  addTodo(todo: todo) {
    this.todos.push(todo)
  }

  @Action
  // 初回の投稿時、priorityでバグりそう
  add(content: string): void {
    todosRef.add({
      uid: this.context.rootState.auth.authedUserUid,
      content: content,
      priority: Math.random() * 10,
      done: false,
      doneAt: null
    })
  }
  @Action
  bind(): void {
    todosRef.where("uid", "==", this.context.rootState.auth.authedUserUid)
      .onSnapshot(snapshot =>  {
        snapshot.docChanges().forEach(change => {
          if (change.type === "added") {
            const doc = change.doc
            this.addTodo({
              key: doc.id,
              uid: doc.data().uid,
              content: doc.data().content,
              priority: doc.data().priority,
              done: doc.data().done,
              doneAt: doc.data().doneAt
            })
          }
          if (change.type === "modified") {
            console.log("Modified: ", change.doc.data());
          }
          if (change.type === "removed") {
            console.log("Removed: ", change.doc.data());
          }
        })
      })
    }
}