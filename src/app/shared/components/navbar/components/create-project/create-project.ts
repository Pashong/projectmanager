import { Component, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProjectsService } from '../../../../../features/projects/service/projects.service';

@Component({
  selector: 'app-create-project',
  imports: [FormsModule],
  templateUrl: './create-project.html',
  styleUrl: './create-project.scss',
})
export class CreateProject {
  private projectsService = inject(ProjectsService);

  projects = this.projectsService.projects;

  async createProject(form: NgForm) {
    try {
      const newProject = await this.projectsService.createProject(form.value);

      this.projects.update(projects => [newProject, ...projects]);

      this.projectsService.newProject.set(false);
    } catch (error) {
      console.error('Something went wrong during the project creation', error);
    }
  }
}
