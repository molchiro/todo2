import { ITodoData, ITodo } from '~/types/todo'

export class Todo implements ITodo {
  id: string
  uid: string
  content: string
  priority: number
  done: boolean
  doneAt: firebase.firestore.FieldValue | null
  
  constructor({
    id = '',
    uid = '',
    content = '',
    priority = 0,
    done = false,
    doneAt = null
  }: Partial<ITodo>) {
    Object.assign(this, {id, uid, content, priority, done, doneAt})
  }
  
  data(): ITodoData {
    return {
      uid: this.uid,
      content: this.content,
      priority: this.priority,
      done: this.done,
      doneAt: this.doneAt
    }
  }

  isValid(): boolean {
    return !!this.content
  }
}
