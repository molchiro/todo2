export interface IProjectData {
  createdAt: firebase.firestore.FieldValue | null
  createdByUid: string
  updatedAt: firebase.firestore.FieldValue | null
  updatedByUid: string
  title: string
  members: string[]
  canInvite: boolean
  invitationCode: string
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
  canInvite: boolean
  invitationCode: string

  constructor({
    id = '',
    createdAt = null,
    createdByUid = '',
    updatedAt = null,
    updatedByUid = '',
    title = '',
    members = [],
    canInvite = false,
    invitationCode = ''
  }: Partial<IProject>) {
    Object.assign(this,{
      id,
      createdAt,
      createdByUid,
      updatedAt,
      updatedByUid,
      title,
      members,
      canInvite,
      invitationCode
    })
  }
  
  data(): IProjectData {
    return {
      createdAt: this.createdAt,
      createdByUid: this.createdByUid,
      updatedAt: this.updatedAt,
      updatedByUid: this.updatedByUid,
      title: this.title,
      members: this.members.slice(),
      canInvite: this.canInvite,
      invitationCode: this.invitationCode
    }
  }

  isValid(): boolean {
    return !!this.title && this.members != []
  }
}
