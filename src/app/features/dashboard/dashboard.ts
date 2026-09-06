import { Component, inject, signal } from '@angular/core';
import { ProjectsService } from '../projects/service/projects.service';
import { TaskService } from '../tasks/service/task.service';
import { UpdateTask } from '../tasks/components/update-task/update-task';
import { TaskModel } from '../tasks/model/task.model';
import { OpenUpdateTask } from "../tasks/components/open-update-task/open-update-task";

@Component({
  selector: 'app-dashboard',
  imports: [UpdateTask, OpenUpdateTask],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private projectService = inject(ProjectsService);
  private tasksService = inject(TaskService);
  projects = this.projectService.projects;
  tasks = this.tasksService.tasks;
  changeTask = signal<TaskModel | null>(null);
  sortedTasks: TaskModel[] | null = null;

  openChangeTask(task: TaskModel) {
    if (task) {
      task.deadline = task.deadline.split('T')[0];
    }
    this.tasksService.task.set(task);
    this.changeTask.set(task);
  }

  async ngOnInit() {
    const projectsData = await this.projectService.getProjects();
    const tasksData = await this.tasksService.getProjectsTasks();

    console.log(projectsData);
    console.log(tasksData);
    this.projects.set(projectsData);
    this.tasks.set(tasksData);
    this.sortedTasks = [...tasksData].sort((a,b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  }
}
