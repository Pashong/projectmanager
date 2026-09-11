import { Component, signal, input, effect, inject } from '@angular/core';
import { TaskItemModel } from '../../model/task-item.model';
import { FormsModule } from '@angular/forms';
import { TaskModel } from '../../model/task.model';
import { TaskItemService } from './service/task-item.service';
import { TaskService } from '../../service/task.service';

@Component({
  selector: 'app-task-items',
  imports: [FormsModule],
  templateUrl: './task-items.html',
  styleUrl: './task-items.scss',
})
export class TaskItems {
  private taskItemService = inject(TaskItemService);
  private taskService = inject(TaskService);

  taskItems = signal<string[]>([]);
  initialItems = input<TaskItemModel[]>([]);
  source = input<'update' | 'create'>();
  currentTask = input<TaskModel>();

  constructor() {
    effect(() => {
      this.taskItems.set(
        this.initialItems().map((item) => item.description) ?? [],
      );
    });
  }

  newTaskItem = '';

  addTaskItem() {
    const item = this.newTaskItem.trim();
    if (!item) return;
    this.taskItems.update((items) => [...items, item]);
    this.newTaskItem = '';
  }

  async removeTask(description: string, index: number) {
    this.taskItems.update((items) =>
      items.filter((item) => item !== description),
    );
    if (this.source() === 'update') {
      const taskItem = this.currentTask()?.task_items.at(index)!;
      try {
        await this.taskItemService.deleteTaskItem(taskItem);
        this.taskService.tasks.update((tasks) =>
          tasks.map((task) => (
            task.id === this.currentTask()?.id ?{
            ...task,
            task_items: task.task_items.filter((_, i) => i !== index),
          }: task)),
        );
      } catch (error) {
        console.error(error);
      }
    }
  }
}
