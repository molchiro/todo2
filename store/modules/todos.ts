import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db, serverTimeStamp } from '@/plugins/firebase'
import { todo } from '@/types/index'
const todosRef = db.collection('todos')

@Module({
  namespaced: true,
  name: 'todos',
  stateFactory: true
})
export default class TodosModule extends VuexModule {
  todos: todo[] = []

  get getTodos(): todo[] {
    return [...this.todos]
  }

  get maxPriority(): number {
    return Math.max(
      0,
      ...this.todos.map((x) => {
        return x.priority
      })
    )
  }

  get lowestNotYetTodoIndex(): number {
    return (
      this.todos.filter((x) => {
        return x.done === false
      }).length - 1
    )
  }

  @Mutation
  private addTodo_(todo: todo): void {
    this.todos.push(todo)
  }

  @Mutation
  private removeTodo_(removedTodoId: string): void {
    this.todos = this.todos.filter((el) => {
      return el.id !== removedTodoId
    })
  }
  
  @Mutation
  private updateTodo_(todo: todo): void {
    const updatedTodoIndex: number = this.todos.findIndex((el) => {
      return el.id === todo.id
    })
    this.todos.splice(updatedTodoIndex, 1, todo)
  }

  @Mutation
  private sort_(): void {
    this.todos = [
      ...this.todos
        .sort((a, b) => {
          return b.priority - a.priority
        })
        .sort((a, b) => {
          if (!a.done && b.done) return -1
          if (a.done && !b.done) return 1
          return 0
        })
        .sort((a, b) => {
          // doneにしてもdoneAtに値が入るまで時間差があるため、
          // done === false and doneAt === nullのレコードを上位にする
          if (!a.doneAt && b.doneAt) return -1 
          if (a.doneAt && b.doneAt) {
            if (a.doneAt > b.doneAt) return -1
            if (a.doneAt < b.doneAt) return 1
          }
          return 0
        })
    ]
  }

  @Action
  add(content: string): void {
    todosRef.add({
      uid: this.context.rootState.auth.authedUserUid,
      content: content,
      priority: this.maxPriority + 1,
      done: false,
      doneAt: null
    })
  }

  @Action
  delete(id: string): void {
    todosRef.doc(id).delete()
  }

  @Action
  updateDone(payload: { id: string; done: boolean }): void {
    todosRef.doc(payload.id).update({
      done: payload.done,
      doneAt: payload.done ? serverTimeStamp : null
    })
  }

  @Action
  updateContent(payload: { id: string; content: string }): void {
    todosRef.doc(payload.id).update({ content: payload.content })
  }

  @Action
  updatePriority(e): void {
    if (this.todos[e.oldIndex].done) return
    const targetId = this.todos[e.oldIndex].id
    let newPriority: number = 0
    if (e.newIndex === 0) {
      newPriority = this.maxPriority + 1
    } else if (e.newIndex >= this.lowestNotYetTodoIndex) {
      newPriority = this.todos[this.lowestNotYetTodoIndex].priority * 0.9
    } else if (e.newIndex > e.oldIndex) {
      newPriority =
        (this.todos[e.newIndex].priority +
          this.todos[e.newIndex + 1].priority) /
        2
    } else {
      newPriority =
        (this.todos[e.newIndex - 1].priority +
          this.todos[e.newIndex].priority) /
        2
    }
    todosRef.doc(targetId).update({
      priority: newPriority
    })
  }

  @Action
  bind(): void {
    const mapDoc2Todo = (doc: firebase.firestore.QueryDocumentSnapshot) => {
      return {
        id: doc.id,
        uid: doc.data().uid,
        content: doc.data().content,
        priority: doc.data().priority,
        done: doc.data().done,
        doneAt: doc.data().doneAt
      }
    }
    todosRef
      .where('uid', '==', this.context.rootState.auth.authedUserUid)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const doc = change.doc
            this.addTodo_(mapDoc2Todo(doc))
          }
          if (change.type === 'modified') {
            const doc = change.doc
            this.updateTodo_(mapDoc2Todo(doc))
          }
          if (change.type === 'removed') {
            this.removeTodo_(change.doc.id)
          }
        })
        this.sort_()
      })
  }
}
