export interface ITodoData {
  createdAt: firebase.firestore.FieldValue | null
  createdByUid: string
  content: string
  priority: number
  done: boolean
  doneAt: firebase.firestore.FieldValue | null
  doneByUid: string
  updatedAt: firebase.firestore.FieldValue | null
  updatedByUid: string
  assignToUid: string
}

export interface ITodo extends ITodoData {
  id: string
}

export class Todo implements ITodo {
  id: string
  createdAt: firebase.firestore.FieldValue | null
  createdByUid: string
  content: string
  priority: number
  done: boolean
  doneAt: firebase.firestore.FieldValue | null
  doneByUid: string
  updatedAt: firebase.firestore.FieldValue | null
  updatedByUid: string
  assignToUid: string
  
  constructor({
    id = '',
    createdAt = null,
    createdByUid = '',
    content = '',
    priority = 1,
    done = false,
    doneAt = null,
    doneByUid = '',
    updatedAt = null,
    updatedByUid = '',
    assignToUid = ''

  }: Partial<ITodo>) {
    Object.assign(this, {
      id,
      createdAt,
      createdByUid,
      content,
      priority,
      done,
      doneAt,
      doneByUid,
      updatedAt,
      updatedByUid,
      assignToUid
    })
  }
  
  data(): ITodoData {
    return {
      createdAt: this.createdAt,
      createdByUid: this.createdByUid,
      content: this.content,
      priority: this.priority,
      done: this.done,
      doneAt: this.doneAt,
      doneByUid: this.doneByUid,
      updatedAt: this.updatedAt,
      updatedByUid: this.updatedByUid,
      assignToUid: this.assignToUid
    }
  }

  isValid(): boolean {
    return !!this.content
  }
}
