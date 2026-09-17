import { Component, inject, OnInit, signal, computed } from '@angular/core';
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

  searchInput = signal('');
  sortValue = signal('');
  searchInputValue = '';

  searchedProjects = computed(() => {
    let projects = [...this.projects()];

    // Suche
    const search = this.searchInput().trim().toLowerCase();

    if (search !== '') {
      projects = projects.filter((project) =>
        project.title.toLowerCase().includes(search),
      );
    }

    // Sortierung
    const sort = this.sortValue();

    if (sort === 'title') {
      projects.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sort === 'deadline') {
      projects.sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
      );
    }

    if (sort === 'status') {
      projects.sort((a, b) => a.status.localeCompare(b.status));
    }

    return projects;
  });

  startNewProject() {
    this.projectsService.newProject.update((value) => !value);
  }

  async ngOnInit() {
    await this.getProjects();
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
    this.searchInput.set(this.searchInputValue);
    console.log(this.searchInputValue);
  }

  sortProjectsBy(value: string) {
    this.sortValue.set(value);
  }
}
