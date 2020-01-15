export interface IProjectData {
  createdAt: firebase.firestore.FieldValue | null
  createdByUid: string
  updatedAt: firebase.firestore.FieldValue | null
  updatedByUid: string
  title: string
  members: string[]
}

export interface IProject extends IProjectData {
  id: string
}

export class Project implements IProject {
  id: string
  createdAt: firebase.firestore.FieldValue | null
  createdByUid: string
  updatedAt: firebase.firestore.FieldValue | null
  updatedByUid: string
  title: string
  members: string[]

  constructor({
    id = '',
    createdAt = null,
    createdByUid = '',
    updatedAt = null,
    updatedByUid = '',
    title = '',
    members = []
  }: Partial<IProject>) {
    Object.assign(this,{
      id,
      createdAt,
      createdByUid,
      updatedAt,
      updatedByUid,
      title,
      members
    })
  }
  
  data(): IProjectData {
    return {
      createdAt: this.createdAt,
      createdByUid: this.createdByUid,
      updatedAt: this.updatedAt,
      updatedByUid: this.updatedByUid,
      title: this.title,
      members: this.members.slice()
    }
  }

  isValid(): boolean {
    return !!this.title && this.members != []
  }
}
