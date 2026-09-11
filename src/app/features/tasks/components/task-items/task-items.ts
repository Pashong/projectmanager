import { Component, signal, input, effect } from '@angular/core';
import { TaskItemModel } from '../../model/task-item.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-items',
  imports: [FormsModule],
  templateUrl: './task-items.html',
  styleUrl: './task-items.scss',
})
export class TaskItems {

  taskItems = signal<string[]>([]);
  initialItems = input<TaskItemModel[]>([]);
  source = input<'update' | 'create'>();

  constructor(){
    effect(() => {
      this.taskItems.set(this.initialItems().map(item => item.description) ?? []);
    })
  }

  newTaskItem = '';

  addTaskItem() {
    console.log("in here");
    const item = this.newTaskItem.trim();
    console.log(item);
    if (!item) return;
    this.taskItems.update((items) => [...items, item]);
    console.log(this.taskItems());
    this.newTaskItem = '';
  }

  removeTask(task: string) {
    this.taskItems.update((items) => items.filter((item) => item !== task));
    console.log(this.taskItems());
  }

}
