import { Injectable } from '@angular/core';
import { ProjectModel } from '../model/project.model';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  async getProjects() {
    try {
      const response = await fetch('http://localhost:3030/projects');

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
}
