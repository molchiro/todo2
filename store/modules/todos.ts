import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { db } from '@/plugins/firebase'
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
    let newPriority: number = 0
    if (newIndex === 0) {
      newPriority = this.maxPriority + 1
    } else if (newIndex >= this.lowestNotYetTodoIndex) {
      newPriority = this.todos[this.lowestNotYetTodoIndex].data.priority * 0.9
    } else {
      const prevIndex = newIndex > oldIndex ? newIndex + 1 : newIndex
      const prevPriority = this.todos[prevIndex - 1].data.priority
      const nextPriority = this.todos[prevIndex].data.priority
      newPriority = (prevPriority + nextPriority ) / 2
    } 
    this.update({
      id: this.todos[oldIndex].id,
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
      .where('uid', '==', this.context.rootGetters['auth/currentUserUid'])
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
