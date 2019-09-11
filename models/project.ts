export interface IProjectData {
  uid: string
  title: string
}

export interface IProject extends IProjectData {
  id: string
}

export class Project implements IProject {
  id: string
  uid: string
  title: string
  
  constructor({
    id = '',
    uid = '',
    title = '新しいプロジェクト'
  }: Partial<IProject>) {
    Object.assign(this, {id, uid, title})
  }
  
  data(): IProjectData {
    return {
      uid: this.uid,
      title: this.title
    }
  }

  isValid(): boolean {
    return !!this.title && !!this.uid
  }
}
