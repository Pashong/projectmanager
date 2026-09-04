import { Component, inject } from '@angular/core';
import { ProjectsService } from './service/projects.service';
import { ProjectModel } from './model/project.model';

@Component({
  selector: 'app-projects',
  imports: [],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
private projectsService = inject(ProjectsService);

projects: ProjectModel[] = [];
  
async getProjects(){
  try{
    this.projects = await this.projectsService.getProjects();
  }
  catch(error){
    console.error("Something went wrong getting the projects", error);
  }

}
}
