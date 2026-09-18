import { Component, inject, input, signal } from '@angular/core';
import { ProjectModel } from '../../model/project.model';
import { ProjectsService } from '../../service/projects.service';

@Component({
  selector: 'app-delete-project',
  imports: [],
  templateUrl: './delete-project.html',
  styleUrl: './delete-project.scss',
})
export class DeleteProject {
  private projectsService = inject(ProjectsService);
  deleteConfirmation = signal<boolean>(false);

  project = input.required<ProjectModel>();

  async deleteProject(currentProject: ProjectModel) {
    try {
      await this.projectsService.deleteProject(currentProject.id);

      this.projectsService.projects.update((projects) =>
        projects.filter((project) => project.id !== currentProject.id),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async openDeleteConfimration() {
    this.deleteConfirmation.set(true);
  }
}
