import { Component, inject, OnInit, signal } from '@angular/core';
import { ProjectsService } from '../../service/projects.service';
import { ProjectModel } from '../../model/project.model';
import { CreateProject } from '../../../../shared/components/navbar/components/create-project/create-project';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-projects',
  imports: [CreateProject, RouterLink],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
private projectsService = inject(ProjectsService);

newProject = this.projectsService.newProject;
projects = this.projectsService.projects;

startNewProject(){
 this.projectsService.newProject.set(true);
}
  
ngOnInit(){
  this.getProjects();
}

async getProjects(){
  try{
   const data = await this.projectsService.getProjects();
   this.projects.set(data);
  }
  catch(error){
    console.error("Something went wrong getting the projects", error);
  }
}

async deleteProject(currentProject: ProjectModel){
  
  try{
     await this.projectsService.deleteProject(currentProject.id);

    this.projects.update((projects) =>
      projects.filter((project) => project.id !== currentProject.id),
    );
  }
  catch(error){
    console.error(error);
  }
}
}
