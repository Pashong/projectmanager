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
  private projectService = inject(ProjectsService);

  async createProject(form: NgForm) {
    try {
      const result = await this.projectService.createProject(form.value);
      this.projectService.newProject.set(false);
      this.projectService.projectId = result.projectId;
    } catch (error) {
      console.log('Something went wrong during the creation', error);
    }
  }
}
