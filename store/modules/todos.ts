import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db, serverTimeStamp } from '@/plugins/firebase'
const todosRef = db.collection('todos')

interface todo {
  id: string,
  uid: string,
  content: string,
  priority: number,
  done: boolean,
  doneAt: firebase.firestore.FieldValue | null
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
  @Mutation
  removeTodo(removedTodoId: string) {
    this.todos = this.todos.filter(el => el.id !== removedTodoId)
  }
  @Mutation
  updateTodo(todo: todo) {
    const updatedTodoIndex: number = this.todos.findIndex(el => el.id === todo.id)
    this.todos.splice(updatedTodoIndex, 1, todo)
  }
  @Mutation
  sort() {
    this.todos = [...this.todos.sort((a, b) => {
      if (a.done < b.done) return -1
      if (a.done > b.done) return 1
      if (!a.doneAt && b.doneAt) return -1
      if (a.doneAt && !b.doneAt) return 1
      if (a.doneAt && b.doneAt) {
        if (a.doneAt > b.doneAt) return -1
        if (a.doneAt < b.doneAt) return 1
      }
      if (a.priority > b.priority) return -1
      if (a.priority < b.priority) return 1
      return 0
    })]
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
  delete(id: string): void {
    todosRef.doc(id).delete()
  }
  @Action
  done(payload: { id: string, done: boolean }): void {
    todosRef.doc(payload.id).update({
      done: payload.done,
      doneAt: payload.done ? serverTimeStamp : null
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
              id: doc.id,
              uid: doc.data().uid,
              content: doc.data().content,
              priority: doc.data().priority,
              done: doc.data().done,
              doneAt: doc.data().doneAt
            })
          }
          if (change.type === "modified") {
            const doc = change.doc
            this.updateTodo({
              id: doc.id,
              uid: doc.data().uid,
              content: doc.data().content,
              priority: doc.data().priority,
              done: doc.data().done,
              doneAt: doc.data().doneAt
            })
          }
          if (change.type === "removed") {
            this.removeTodo(change.doc.id)
          }
        })
      this.sort()
      })
    }
}