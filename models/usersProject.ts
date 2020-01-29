export interface IUsersProjectData {
  title: string
  priority: number
}

export interface IUsersProject extends IUsersProjectData {
  id: string
}

export class UsersProject implements IUsersProject {
  id: string
  title: string
  priority: number
  
  constructor({
    id = '',
    title = '',
    priority = 1
  }: Partial<IUsersProject>) {
    Object.assign(this, {id, title, priority})
  }
  
  data(): IUsersProjectData {
    return {
      title: this.title,
      priority: this.priority
    }
  }
}
