import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { NgForm } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  newProject = signal<boolean>(false);
  projectId = signal<number>(0);

  async getProjects() {
    try {
      const response = await fetch(`${environment.apiUrl}/projects`);

      if (!response.ok) {
        throw new Error(`Reponse status: ${response.status}`);
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.log('Fetching projects failed', error);
    }
  }

  async createProject(form: NgForm) {
    try {
      const response = await fetch(`${environment.apiUrl}/projects/create-project`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      });

      if (!response.ok) {
        throw new Error('Reponse status creation: ' + response.status);
      }

      return await response.json();
    } catch (error) {
      console.error('Something went wrong creating your project', error);
    }
  }
}
