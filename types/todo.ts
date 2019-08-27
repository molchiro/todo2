export interface ITodoData {
  uid: string
  content: string
  priority: number
  done: boolean
  doneAt: firebase.firestore.FieldValue | null
}

export interface ITodo extends ITodoData {
  id: string
}

export interface ITodoParams {
  id?: string
  uid?: string
  content?: string
  priority?: number
  done?: boolean
  doneAt?: firebase.firestore.FieldValue | null
}