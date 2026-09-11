import { Component, inject, signal, input, computed } from '@angular/core';
import { TaskModel } from './model/task.model';
import { TaskService } from './service/task.service';
import { ProjectsService } from '../projects/service/projects.service';
import { ActivatedRoute } from '@angular/router';
import { DeleteTask } from './components/delete-task/delete-task';
import { DatePipe } from '@angular/common';
import { OpenUpdateTask } from './components/open-update-task/open-update-task';
import { FormsModule } from '@angular/forms';
import { TaskItemModel } from './model/task-item.model';
import { ProjectModel } from '../projects/model/project.model';
import { TaskItemService } from './components/task-items/service/task-item.service';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-tasks',
  imports: [
    CdkDrag,
    FormsModule,
    DatePipe,
    DeleteTask,
    OpenUpdateTask,
    OpenUpdateTask,
  ],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks {
  private tasksService = inject(TaskService);
  private taskItemService = inject(TaskItemService);
  private saveTimeout: ReturnType<typeof setTimeout> | undefined;

  tasks = this.tasksService.tasks;

  project = input<ProjectModel | null>(null);
  sorted = input<boolean>();
  task = input.required<TaskModel>();

  progress = signal(0);
  taskItems = signal<TaskItemModel[]>([]);
  taskDetails = signal<number | null>(null);
  deleteMember = signal<{ taskId: number; userId: number } | null>(null);
  changeTask = signal<TaskModel | null>(null);

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

  openChangeTask(currentTask: TaskModel) {
    if (currentTask) {
      currentTask.deadline = currentTask.deadline.split('T')[0];
    }
    this.tasksService.task.set(currentTask);
    this.changeTask.set(currentTask);
  }

  async removeUser(taskId: number, userId: number) {
    try {
      await this.tasksService.removeUserFromTask(taskId, userId);
      this.tasks.update((tasks) =>
        tasks.map((task) =>
          taskId === task.id
            ? {
                ...task,
                members: task.members.filter((member) => member.id !== userId),
              }
            : task,
        ),
      );
    } catch (error) {
      console.error('Removing user failed ', error);
    }
  }

  openDeleteMember(id: number, taskId: number) {
    this.deleteMember.update((current) =>
      current?.taskId === taskId && current.userId === id
        ? null
        : { taskId: taskId, userId: id },
    );
  }

  async openTaskDetails(task: TaskModel) {
    this.taskDetails.update((currentId) =>
      currentId === task.id ? null : task.id,
    );
    if (!this.taskDetails()) {
      await this.taskItemService.updateTaskItem(task.task_items ?? []);
    }
  }

  onTaskItemChange() {
    clearTimeout(this.saveTimeout);

    this.saveTimeout = setTimeout(() => {
      this.updateTaskItems();
    }, 1000);
  }

  async updateTaskItems() {
    await this.taskItemService.updateTaskItem(this.task().task_items);
  }

  onCheckboxChange() {
    const items = this.task().task_items;

    if (items) {
      this.onTaskItemChange();
      this.calculateProgress(items);
    }
  }

  calculateProgress(items: TaskItemModel[]) {
    const checkedAmount = items.filter((item) => item.completed).length;
    const progress =
      items.length > 0 ? (checkedAmount / items.length) * 100 : 0;
    this.progress.set(progress);
  }
  ngOnInit() {
    this.calculateProgress(this.task().task_items);
  }
}
