import { Component, input } from '@angular/core';
import { TaskModel } from '../../../tasks/model/task.model';
import { ProjectModel } from '../../model/project.model';
import { UpdateProject } from '../update-project/update-project';
import { Tasks } from '../../../tasks/tasks';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project-component',
  imports: [ DatePipe,Tasks,UpdateProject],
  templateUrl: './project-component.html',
  styleUrl: './project-component.scss',
})
export class ProjectComponent {

  tasks = input<TaskModel[]| null>();
  project = input<ProjectModel>();
  tasksCount = input<number>();

}
