import { Component, inject, OnInit, signal } from '@angular/core';
import { ProjectsService } from '../../service/projects.service';
import { ProjectModel } from '../../model/project.model';
import { CreateProject } from '../../../../shared/components/navbar/components/create-project/create-project';
import { RouterLink } from "@angular/router";
import { DatePipe } from '@angular/common';
import { UpdateProject } from "../../components/update-project/update-project";
import { ProjectComponent } from '../../components/project-component/project-component';

@Component({
  selector: 'app-projects',
  imports: [ProjectComponent,CreateProject, RouterLink, DatePipe, UpdateProject],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
private projectsService = inject(ProjectsService);

newProject = this.projectsService.newProject;
projects = this.projectsService.projects;

startNewProject(){
 this.projectsService.newProject.update(value => !value);
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

}
