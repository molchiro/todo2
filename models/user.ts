export interface IUserData {
  displayName: string
  createdAt: firebase.firestore.FieldValue | null
  projectIds: string[]
}

export interface IUser extends IUserData {
  id: string
}

export class User implements IUser {
  id: string
  displayName: string
  createdAt: firebase.firestore.FieldValue | null
  projectIds: string[]
  
  constructor({
    id = '',
    displayName = '',
    createdAt = null,
    projectIds = []
  }: Partial<IUser>) {
    Object.assign(this, {id, displayName, createdAt, projectIds})
  }
  
  data(): IUserData {
    return {
      displayName: this.displayName,
      createdAt: this.createdAt,
      projectIds: this.projectIds
    }
  }
}
