import { Component } from '@angular/core';
import { TaskModel } from './model/task.model';

@Component({
  selector: 'app-tasks',
  imports: [],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks {

taskStatus: string[] = ["in progress", "open", "done", "in review"];
tasks: TaskModel[] = [];
}
