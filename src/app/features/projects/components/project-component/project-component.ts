import { Component, inject, input } from '@angular/core';
import { TaskModel } from '../../../tasks/model/task.model';
import { ProjectModel } from '../../model/project.model';
import { UpdateProject } from '../update-project/update-project';
import { Tasks } from '../../../tasks/tasks';
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { ProjectsService } from '../../service/projects.service';

@Component({
  selector: 'app-project-component',
  imports: [DatePipe, Tasks, UpdateProject, RouterLink],
  templateUrl: './project-component.html',
  styleUrl: './project-component.scss',
})
export class ProjectComponent {

  private projectsService = inject(ProjectsService);
  projects = this.projectsService.projects;
  tasks = input<TaskModel[] | null>();
  project = input<ProjectModel>();
  tasksCount = input<number>();

  async deleteProject(currentProject: ProjectModel) {
    try {
      await this.projectsService.deleteProject(currentProject.id);

      this.projects.update((projects) =>
        projects.filter((project) => project.id !== currentProject.id),
      );
    } catch (error) {
      console.error(error);
    }
  }
}
