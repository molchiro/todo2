export interface IProjectData {
  createdByUid: string
  title: string
  members: string[]
}

export interface IProject extends IProjectData {
  id: string
}

export class Project implements IProject {
  id: string
  createdByUid: string
  title: string
  members: string[]

  
  constructor({
    id = '',
    createdByUid = '',
    title = '',
    members = []
  }: Partial<IProject>) {
    Object.assign(this, { id, createdByUid, title, members })
  }
  
  data(): IProjectData {
    return {
      createdByUid: this.createdByUid,
      title: this.title,
      members: this.members.slice()
    }
  }

  isValid(): boolean {
    return !!this.title && !!this.createdByUid && this.members != []
  }
}
