import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db, serverTimeStamp } from '@/plugins/firebase'
import { todo, todoData } from '@/types/index'
const todosRef = db.collection('todos')

@Module({
  namespaced: true,
  name: 'todos',
  stateFactory: true
})
export default class TodosModule extends VuexModule {
  todos: todo[] = []

  get maxPriority(): number {
    return Math.max(
      0,
      ...this.todos.map((x) => {
        return x.data.priority
      })
    )
  }

  get lowestNotYetTodoIndex(): number {
    return (
      this.todos.filter((x) => {
        return x.data.done === false
      }).length - 1
    )
  }

  @Mutation
  private add_(todo: todo): void {
    this.todos.push(todo)
  }

  @Mutation
  private delete_(todo: todo): void {
    this.todos = this.todos.filter((el) => {
      return el.id !== todo.id
    })
  }
  
  @Mutation
  private update_(todo: todo): void {
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
          return b.data.priority - a.data.priority
        })
        .sort((a, b) => {
          if (!a.data.done && b.data.done) return -1
          if (a.data.done && !b.data.done) return 1
          return 0
        })
        .sort((a, b) => {
          // doneにしてもdoneAtに値が入るまで時間差があるため、
          // done === false and doneAt === nullのレコードを上位にする
          if (!a.data.doneAt && b.data.doneAt) return -1 
          if (a.data.doneAt && b.data.doneAt) {
            if (a.data.doneAt > b.data.doneAt) return -1
            if (a.data.doneAt < b.data.doneAt) return 1
          }
          return 0
        })
    ]
  }

  @Action
  add(todoData: todoData): void {
    todosRef.add(todoData)
  }

  @Action
  delete(id: string): void {
    todosRef.doc(id).delete()
  }

  @Action
  update(todo: todo): void {
    todosRef.doc(todo.id).update(todo.data)
  }

  @Action
  move({ oldIndex, newIndex}): void {
    if (this.todos[oldIndex].data.done) return
    const targetId = this.todos[oldIndex].id
    let newPriority: number = 0
    if (newIndex === 0) {
      newPriority = this.maxPriority + 1
    } else if (newIndex >= this.lowestNotYetTodoIndex) {
      newPriority = this.todos[this.lowestNotYetTodoIndex].data.priority * 0.9
    } else if (newIndex > oldIndex) {
      newPriority =
        (this.todos[newIndex].data.priority +
          this.todos[newIndex + 1].data.priority) /
        2
    } else {
      newPriority =
        (this.todos[newIndex - 1].data.priority +
          this.todos[newIndex].data.priority) /
        2
    }
    this.update({
      id: targetId,
      data: {
        ...this.todos[oldIndex].data,
        priority: newPriority
      }
    })
  }

  @Action
  bind(): void {
    const mapDoc2Todo = (doc: firebase.firestore.QueryDocumentSnapshot) => {
      return {
        id: doc.id,
        data: {
          uid: doc.data().uid,
          content: doc.data().content,
          priority: doc.data().priority,
          done: doc.data().done,
          doneAt: doc.data().doneAt
        }
      }
    }
    todosRef
      .where('uid', '==', this.context.rootState.auth.authedUserUid)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            this.add_(mapDoc2Todo(change.doc))
          }
          if (change.type === 'modified') {
            this.update_(mapDoc2Todo(change.doc))
          }
          if (change.type === 'removed') {
            this.delete_(mapDoc2Todo(change.doc))
          }
        })
        this.sort_()
      })
  }
}
