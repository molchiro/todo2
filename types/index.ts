export interface todo {
    id: string
    uid: string
    content: string
    priority: number
    done: boolean
    doneAt: firebase.firestore.FieldValue | null
  }