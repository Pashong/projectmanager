import { Component, inject, OnInit } from '@angular/core';
import { ProjectsService } from '../../service/projects.service';
import { TaskService } from '../../../tasks/service/task.service';
import { Tasks } from '../../../tasks/tasks';
import { ActivatedRoute } from '@angular/router';
import { ProjectModel } from '../../model/project.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-project',
  imports: [Tasks, DatePipe],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project {
  private projectService = inject(ProjectsService);
  private tasksService = inject(TaskService);
  route = inject(ActivatedRoute);

  tasks = this.tasksService.tasks;
  project = this.projectService.project;

  async ngOnInit() {
    try {
      const projectId = await this.route.snapshot.paramMap.get('id');
      if (!projectId) {
        return;
      }
      const resultProject = await this.projectService.getProject(projectId);

      this.project.set(resultProject);
    } catch (error) {
      console.error(error);
    }
  }
}
