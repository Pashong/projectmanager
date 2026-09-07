import { Component, inject, input } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { TaskModel } from '../../model/task.model';

@Component({
  selector: 'app-delete-task',
  imports: [],
  templateUrl: './delete-task.html',
  styleUrl: './delete-task.scss',
})
export class DeleteTask {
  private tasksService = inject(TaskService);
  tasks = this.tasksService.tasks;
  task = input.required<TaskModel>();

  async deleteTask(currentTask: TaskModel) {
    try {
      await this.tasksService.deleteTask(currentTask);
      this.tasks.update((tasks) =>
        tasks.filter((task) => task.id !== currentTask.id),
      );
    } catch (error) {
      console.error('Task deletion error: ', error);
    }
  }
}
