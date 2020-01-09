export interface IProjectListItemData {
  title: string
  priority: number
}

export interface IProjectListItem extends IProjectListItemData {
  id: string
}

export class ProjectListItem implements IProjectListItem {
  id: string
  title: string
  priority: number
  
  constructor({
    id = '',
    title = '',
    priority = 1
  }: Partial<IProjectListItem>) {
    Object.assign(this, {id, title, priority})
  }
  
  data(): IProjectListItemData {
    return {
      title: this.title,
      priority: this.priority
    }
  }
}
