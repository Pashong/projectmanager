import { Component, inject, OnInit, signal } from '@angular/core';
import { ProjectsService } from '../../service/projects.service';
import { CreateProject } from '../../components/create-project/create-project';
import { ProjectComponent } from '../../components/project-component/project-component';
import { ProjectModel } from '../../model/project.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-projects',
  imports: [FormsModule, ProjectComponent, CreateProject],
  templateUrl: './projects.html',
  styleUrl: './projects.scss',
})
export class Projects {
  private projectsService = inject(ProjectsService);

  newProject = this.projectsService.newProject;
  projects = this.projectsService.projects;
  searchedProjects = signal<ProjectModel[]>([]);
  searchInput: string = '';

  startNewProject() {
    this.projectsService.newProject.update((value) => !value);
  }

  async ngOnInit() {
    await this.getProjects();
    this.searchedProjects.set(this.projects());
  }

  async getProjects() {
    try {
      const data = await this.projectsService.getProjects();
      this.projects.set(data);
    } catch (error) {
      console.error('Something went wrong getting the projects', error);
    }
  }

  searchProject() {
    const value = this.searchInput;

    if (this.searchInput === '') {
      this.searchedProjects.set(this.projects());
      return;
    }

    this.searchedProjects.set(
      this.projects().filter((project) =>
        project.title.toLowerCase().includes(value.toLocaleLowerCase()),
      ),
    );
  }


  sortProjectsBy(value: string){
    this.searchedProjects.update(projects => [...projects].sort((a,b) => {
      if(value === 'title'){
        return a.title.localeCompare(b.title);
      }

      if(value === 'deadline'){
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }

      if(value === 'status'){
        return a.status.localeCompare(b.status);
      }

      return 0;
    }))
  }
}
