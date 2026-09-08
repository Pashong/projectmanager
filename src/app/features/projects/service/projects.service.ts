import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { NgForm } from '@angular/forms';
import { ProjectCreationModel } from '../../../shared/components/navbar/components/create-project/model/project-creation.model';
import { ProjectModel } from '../model/project.model';
import { MemberModel } from '../../../shared/models/member.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  newProject = signal<boolean>(false);
  projects = signal<ProjectModel[]>([]);
  project = signal<ProjectModel | null>(null);

  async getProjects() {
    try {
      const response = await fetch(`${environment.apiUrl}/projects`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Reponse status: ${response.status}`);
      }

      const data = await response.json();

      return data.projects;
    } catch (error) {
      console.error('Fetching projects failed', error);
    }
  }

  async getProject(projectId: string): Promise<ProjectModel> {
    try {
      const response = await fetch(
        `${environment.apiUrl}/projects/${projectId}`,
        {
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error(`Reponse status: ${response.status}`);
      }

      const data = await response.json();

      return data.project;
    } catch (error) {
      console.error('Fetching projects failed', error);
      throw error;
    }
  }

  async createProject(values: ProjectCreationModel) {
    try {
      const response = await fetch(
        `${environment.apiUrl}/projects/create-project`,
        {
          credentials: 'include',
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        throw new Error('Reponse status creation: ' + response.status);
      }

      const data = await response.json();

      return data.project;
    } catch (error) {
      console.error('Something went wrong creating your project', error);
    }
  }

  async deleteProject(projectId: number) {
    try {
      const response = await fetch(
        `${environment.apiUrl}/projects/delete-project/${projectId}`,
        {
          method: 'delete',
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error(`Reponse error ${response.status}`);
      }
    } catch (error) {
      console.error('Something went wrong deleting your project', error);
    }
  }

  async getUsers() {
    try {
      const response = await fetch(`${environment.apiUrl}/users`, {
        credentials: 'include',
      });

      if(!response.ok){
        throw new Error("Something went wrong fetching users");
      }

      const data = await response.json();

      
      return data.users.map((user: any): MemberModel => ({
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      }));

    } catch (error) {
      console.error('fetching users failed', error);
    }
  }

  async updateProject(form: NgForm, projectId: number){
    try{

      const project = {
        ...form.value,
        id: projectId
      }

      console.log(project);
        const response = await fetch(`${environment.apiUrl}/projects/update-project`, {
        method: 'put',
        credentials: 'include',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(project)
      });

      if(!response.ok){
        throw new Error("Failed updating the project " + response.status);
      }

      const data = await response.json();

      return data;
    }
    catch(error){
      console.error("Updating project failed", error)
    }
  }
}
