import { Component, inject, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProjectsService } from '../../../../../features/projects/service/projects.service';
import { MemberModel } from '../../../../models/member.model';

@Component({
  selector: 'app-create-project',
  imports: [FormsModule],
  templateUrl: './create-project.html',
  styleUrl: './create-project.scss',
})
export class CreateProject {
  private projectsService = inject(ProjectsService);

  projects = this.projectsService.projects;
  selectedMemberIds: number[] = [];
  users = signal<MemberModel[]>([]); 
  
  async createProject(form: NgForm) {
    try {
      const newProject = await this.projectsService.createProject(form.value);

      this.projects.update((projects) => [newProject, ...projects]);

      this.projectsService.newProject.set(false);
    } catch (error) {
      console.error('Something went wrong during the project creation', error);
    }
  }

  async ngOnInit() {
    try {
      const users = await this.projectsService.getUsers();

      this.users.set(users);
     
    } catch (error) {
      console.log('Users data failed', error);
    }
  }
}
