import { Project } from "./project";

export interface ITodoData {
  uid: string
  content: string
  priority: number
  done: boolean
  doneAt: firebase.firestore.FieldValue | null
  projectId: string
}

export interface ITodo extends ITodoData {
  id: string
}

export class Todo implements ITodo {
  id: string
  uid: string
  content: string
  priority: number
  done: boolean
  doneAt: firebase.firestore.FieldValue | null
  projectId: string
  
  constructor({
    id = '',
    uid = '',
    content = '',
    priority = 0,
    done = false,
    doneAt = null,
    projectId = ''
  }: Partial<ITodo>) {
    Object.assign(this, {id, uid, content, priority, done, doneAt, projectId})
  }
  
  data(): ITodoData {
    return {
      uid: this.uid,
      content: this.content,
      priority: this.priority,
      done: this.done,
      doneAt: this.doneAt,
      projectId: this.projectId
    }
  }

  isValid(): boolean {
    return !!this.content && !!this.uid
  }
}
