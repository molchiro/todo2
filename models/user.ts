export interface IUserData {
  displayName: string
  createdAt: firebase.firestore.FieldValue | null
}

export interface IUser extends IUserData {
  id: string
}

export class User implements IUser {
  id: string
  displayName: string
  createdAt: firebase.firestore.FieldValue | null
  
  constructor({
    id = '',
    displayName = '',
    createdAt = null
  }: Partial<IUser>) {
    Object.assign(this, {id, displayName, createdAt})
  }
  
  data(): IUserData {
    return {
      displayName: this.displayName,
      createdAt: this.createdAt
    }
  }
}
