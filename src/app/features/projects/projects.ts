import { Component, inject, signal } from '@angular/core';
import { ProjectsService } from './service/projects.service';
import { ProjectModel } from './model/project.model';
import { CreateProject } from '../../shared/components/navbar/components/create-project/create-project';

@Component({
  selector: 'app-projects',
  imports: [CreateProject],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
private projectsService = inject(ProjectsService);

newProject = this.projectsService.newProject;

projects: ProjectModel[] = [];

startNewProject(){
 this.projectsService.newProject.set(true);
}
  
async getProjects(){
  try{
    this.projects = await this.projectsService.getProjects();
  }
  catch(error){
    console.error("Something went wrong getting the projects", error);
  }

}
}
