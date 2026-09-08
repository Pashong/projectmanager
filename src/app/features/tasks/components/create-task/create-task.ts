import { Component, inject, input, signal } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { TaskService } from '../../service/task.service';
import { ProjectModel } from '../../../projects/model/project.model';

@Component({
  selector: 'app-create-task',
  imports: [FormsModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss',
})
export class CreateTask {
  private tasksService = inject(TaskService);

  tasks = this.tasksService.tasks;
  status = input<string>();
  taskCreation = signal<boolean>(false);
  currentProject = input<ProjectModel | null>();
  selectedMemberIds: number[] = [];

  openCreateTask() {
    this.taskCreation.update((value) => !value);
  }

  async createTask(form: NgForm, status?: string) {
    const data = await this.tasksService.createTask(form, status);
    this.tasks.update((tasks) => [...tasks, data.task]);
    this.taskCreation.set(false);
  }
}
