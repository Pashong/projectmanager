import { Component, inject, input, signal } from '@angular/core';
import { TaskService } from '../../service/task.service';
import { TaskModel } from '../../model/task.model';
import { UpdateTask } from '../update-task/update-task';
import { ProjectModel } from '../../../projects/model/project.model';

@Component({
  selector: 'app-open-update-task',
  imports: [UpdateTask],
  templateUrl: './open-update-task.html',
  styleUrl: './open-update-task.scss',
})
export class OpenUpdateTask {

  currentTask = input.required<TaskModel>();
  currentProject = input.required<ProjectModel>();
  changeTask = signal(false);

  toggleChangeTask() {
    if (this.currentTask()) {
      this.currentTask().deadline = this.currentTask().deadline.split('T')[0];
    }
    this.changeTask.update((value) => !value);
  }
}
