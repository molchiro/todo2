export interface todoData {
  uid: string
  content: string
  priority: number
  done: boolean
  doneAt: firebase.firestore.FieldValue | null
}

export interface todo {
  id: string
  data: todoData
}