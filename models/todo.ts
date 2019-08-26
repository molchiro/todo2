import { ITodoData, ITodo } from '~/types/todo'

export class Todo implements ITodo {
  constructor(
    public id: string = '',
    public data: ITodoData = {
      uid: '',
      content: '',
      priority: 0,
      done: false,
      doneAt: null
    }) {}
}