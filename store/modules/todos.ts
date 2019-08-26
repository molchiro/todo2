import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db } from '@/plugins/firebase'
import { ITodo, ITodoData } from '@/types/todo'
import { Todo } from '@/models/todo'
const todosRef = db.collection('todos')

@Module({
  namespaced: true,
  name: 'todos',
  stateFactory: true
})
export default class TodosModule extends VuexModule {
  todos: ITodo[] = []

  get getTodos(): Todo[] {
    return this.todos.map((todo) => {
      return new Todo(todo.id, { ...todo.data })
    })
  }

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
  private PUSH_TODO(todo: ITodo): void {
    this.todos.push(todo)
  }

  @Mutation
  private REMOVE_TODO(todo: ITodo): void {
    this.todos = this.todos.filter((el) => {
      return el.id !== todo.id
    })
  }

  @Mutation
  private REPLACE_TODO(todo: ITodo): void {
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
          return b.data.priority - a.data.priority
        })
        .sort((a, b) => {
          return Number(a.data.done) - Number(b.data.done)
        })
        .sort((a, b) => {
          // @ts-ignore
          const doneAta = a.data.doneAt ? a.data.doneAt.seconds : Infinity
          // @ts-ignore
          const doneAtb = b.data.doneAt ? b.data.doneAt.seconds : Infinity
          return doneAtb - doneAta
        })
    ]
  }

  @Action
  addTodo(todo: Todo): void {
    todosRef.add(todo.data)
  }

  @Action
  deleteTodo(todo: Todo): void {
    todosRef.doc(todo.id).delete()
  }

  @Action
  updateTodo(todo: Todo): void {
    todosRef.doc(todo.id).update(todo.data)
  }

  @Action
  moveTodo({ oldIndex, newIndex }): void {
    let newPriority: number = 0
    if (newIndex === 0) {
      newPriority = this.maxPriority + 1
    } else if (newIndex >= this.lowestNotYetTodoIndex) {
      newPriority = this.todos[this.lowestNotYetTodoIndex].data.priority * 0.9
    } else {
      const prevIndex = newIndex > oldIndex ? newIndex + 1 : newIndex
      const prevPriority = this.todos[prevIndex - 1].data.priority
      const nextPriority = this.todos[prevIndex].data.priority
      newPriority = (prevPriority + nextPriority) / 2
    }
    this.updateTodo({
      id: this.todos[oldIndex].id,
      data: {
        ...this.todos[oldIndex].data,
        priority: newPriority
      }
    })
  }

  @Action
  bindTodos(uid: string): void {
    const mapDoc2Todo = (doc: firebase.firestore.QueryDocumentSnapshot) => {
      return new Todo(doc.id,
        {
          uid: doc.data().uid,
          content: doc.data().content,
          priority: doc.data().priority,
          done: doc.data().done,
          doneAt: doc.data().doneAt
        }
      )
    }
    todosRef
      .where('uid', '==', uid)
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
