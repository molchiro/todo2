import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db, serverTimeStamp } from '@/plugins/firebase'
import { authStore } from '@/store'
import { Todo } from '@/models/todo'

let unsubscribe: Function | null = null
let todoRef: firebase.firestore.CollectionReference | null = null

@Module({
  namespaced: true,
  name: 'todos',
  stateFactory: true
})
export default class TodosModule extends VuexModule {
  innerTodos: Todo[] = []

  isLoading: boolean = true

  isEmpty: boolean = true

  get todos(): Todo[] {
    return this.innerTodos.map(todo => new Todo({ ...todo }))
  }

  get maxPriority(): number {
    return Math.max(0, ...this.innerTodos.map(x => x.priority))
  }

  get lowestNotYetTodoIndex(): number {
    return this.innerTodos.filter(x => x.done === false).length - 1
  }

  @Mutation
  private INIT_TODOS(): void {
    this.innerTodos.splice(0)
  }

  @Mutation
  private PUSH_TODO(todo: Todo): void {
    this.innerTodos.push(todo)
  }

  @Mutation
  private REMOVE_TODO(todo: Todo): void {
    this.innerTodos = this.innerTodos.filter(el => el.id !== todo.id)
  }

  @Mutation
  private REPLACE_TODO(todo: Todo): void {
    const updatedTodoIndex: number = this.innerTodos.findIndex(el => el.id === todo.id)
    this.innerTodos.splice(updatedTodoIndex, 1, todo)
  }

  @Mutation
  private SORT_TODOS(): void {
    this.innerTodos = [
      ...this.innerTodos
        .sort((a, b) => b.priority - a.priority)
        .sort((a, b) => Number(a.done) - Number(b.done))
        .sort((a, b) => {
          // @ts-ignore
          const doneAta = a.doneAt ? a.doneAt.seconds : Infinity
          // @ts-ignore
          const doneAtb = b.doneAt ? b.doneAt.seconds : Infinity
          return doneAtb - doneAta
        })
    ]
  }

  @Mutation
  private SET_ISLOADING(isLoading: boolean): void {
    this.isLoading = isLoading
  }

  @Mutation
  private SET_ISEMPTY(isEmpty: boolean): void {
    this.isEmpty = isEmpty
  }

  @Action
  addTodo(todo: Todo): void {
    todo.priority = this.maxPriority + 1
    todo.createdAt = serverTimeStamp
    todo.createdByUid = authStore.currentUser!.uid
    todo.updatedAt = serverTimeStamp
    todo.updatedByUid = authStore.currentUser!.uid
    todoRef!.add(todo.data())
  }

  @Action
  deleteTodo(todo: Todo): void {
    todoRef!.doc(todo.id).delete()
  }

  @Action
  updateTodo(todo: Todo): void {
    todo.updatedAt = serverTimeStamp
    todo.updatedByUid = authStore.currentUser!.uid
    todoRef!.doc(todo.id).update(todo.data())
  }

  @Action
  moveTodo({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }): void {
    let newPriority: number = 0
    if (newIndex === 0) {
      newPriority = this.maxPriority + 1
    } else if (newIndex >= this.lowestNotYetTodoIndex) {
      newPriority = this.innerTodos[this.lowestNotYetTodoIndex].priority * 0.9
    } else {
      const prevIndex = newIndex > oldIndex ? newIndex + 1 : newIndex
      const prevPriority = this.innerTodos[prevIndex - 1].priority
      const nextPriority = this.innerTodos[prevIndex].priority
      newPriority = (prevPriority + nextPriority) / 2
    }
    this.updateTodo(new Todo({
      ...this.innerTodos[oldIndex],
      priority: newPriority
    }))
  }

  @Action
  bindTodos(projectId): void {
    const mapDoc2Todo  = (doc: firebase.firestore.QueryDocumentSnapshot) => {
      return new Todo(
        {
          ...doc.data(),
          id: doc.id,
        }
      )
    }
    this.INIT_TODOS()
    this.SET_ISLOADING(true)
    this.SET_ISEMPTY(true)
    if (typeof(unsubscribe) === 'function') {
      unsubscribe()
    }
    todoRef = db.collection('projects').doc(projectId).collection('todos')
    unsubscribe = todoRef
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            this.PUSH_TODO(mapDoc2Todo(change.doc))
          } else if (change.type === 'modified') {
            this.REPLACE_TODO(mapDoc2Todo(change.doc))
          } else if (change.type === 'removed') {
            this.REMOVE_TODO(mapDoc2Todo(change.doc))
          }
        })
        this.SET_ISLOADING(false)
        this.SET_ISEMPTY(snapshot.empty)
        this.SORT_TODOS()
      })
  }
}
