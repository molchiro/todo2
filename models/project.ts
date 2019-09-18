export interface IProjectData {
  uid: string
  title: string
  priority: number
}

export interface IProject extends IProjectData {
  id: string
}

export class Project implements IProject {
  id: string
  uid: string
  title: string
  priority: number
  
  constructor({
    id = '',
    uid = '',
    title = '新しいプロジェクト',
    priority = 1

  }: Partial<IProject>) {
    Object.assign(this, {id, uid, title, priority})
  }
  
  data(): IProjectData {
    return {
      uid: this.uid,
      title: this.title,
      priority: this.priority
    }
  }

  isValid(): boolean {
    return !!this.title && !!this.uid
  }
}
