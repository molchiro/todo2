import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db } from '@/plugins/firebase'
import { Todo } from '@/models/todo'
const todosRef = db.collection('todos')

type bindTodosPayload = {
  uid: string,
  projectId: string
}

let unsubscribe: Function | null = null

@Module({
  namespaced: true,
  name: 'todos',
  stateFactory: true
})
export default class TodosModule extends VuexModule {
  todos: Todo[] = []

  get getTodos(): Todo[] {
    return this.todos.map((todo) => { return new Todo({ ...todo }) })
  }

  get maxPriority(): number {
    return Math.max(0, ...this.todos.map((x) => { return x.priority }))
  }

  get lowestNotYetTodoIndex(): number {
    return this.todos.filter((x) => { return x.done === false }).length - 1
  }

  @Mutation
  private INIT_TODO(): void {
    this.todos.splice(0)
  }

  @Mutation
  private PUSH_TODO(todo: Todo): void {
    this.todos.push(todo)
  }

  @Mutation
  private REMOVE_TODO(todo: Todo): void {
    this.todos = this.todos.filter((el) => { return el.id !== todo.id })
  }

  @Mutation
  private REPLACE_TODO(todo: Todo): void {
    const updatedTodoIndex: number = this.todos.findIndex((el) => {
      return el.id === todo.id
    })
    this.todos.splice(updatedTodoIndex, 1, todo)
  }

  @Mutation
  private SORT_TODOS(): void {
    this.todos = [
      ...this.todos
        .sort((a, b) => {
          return b.priority - a.priority
        })
        .sort((a, b) => {
          return Number(a.done) - Number(b.done)
        })
        .sort((a, b) => {
          // @ts-ignore
          const doneAta = a.doneAt ? a.doneAt.seconds : Infinity
          // @ts-ignore
          const doneAtb = b.doneAt ? b.doneAt.seconds : Infinity
          return doneAtb - doneAta
        })
    ]
  }

  @Action
  addTodo(todo: Todo): void {
    todosRef.add(todo.data())
  }

  @Action
  deleteTodo(todo: Todo): void {
    todosRef.doc(todo.id).delete()
  }

  @Action
  updateTodo(todo: Todo): void {
    todosRef.doc(todo.id).update(todo.data())
  }

  @Action
  moveTodo({ oldIndex, newIndex }): void {
    let newPriority: number = 0
    if (newIndex === 0) {
      newPriority = this.maxPriority + 1
    } else if (newIndex >= this.lowestNotYetTodoIndex) {
      newPriority = this.todos[this.lowestNotYetTodoIndex].priority * 0.9
    } else {
      const prevIndex = newIndex > oldIndex ? newIndex + 1 : newIndex
      const prevPriority = this.todos[prevIndex - 1].priority
      const nextPriority = this.todos[prevIndex].priority
      newPriority = (prevPriority + nextPriority) / 2
    }
    this.updateTodo(new Todo({
      ...this.todos[oldIndex],
      priority: newPriority
    }))
  }

  @Action
  bindTodos({ uid, projectId }: bindTodosPayload): void {
    const mapDoc2Todo  = (doc: firebase.firestore.QueryDocumentSnapshot) => {
      return new Todo(
        {
          ...doc.data(),
          id: doc.id,
        }
      )
    }
    this.INIT_TODO()
    if (typeof(unsubscribe) === 'function') {
      unsubscribe()
    }
    unsubscribe = todosRef
      .where('uid', '==', uid)
      .where('projectId', '==', projectId)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            this.PUSH_TODO(mapDoc2Todo(change.doc))
          }
          if (change.type === 'modified') {
            this.REPLACE_TODO(mapDoc2Todo(change.doc))
          }
          if (change.type === 'removed') {
            this.REMOVE_TODO(mapDoc2Todo(change.doc))
          }
        })
        this.SORT_TODOS()
      })
  }
}
