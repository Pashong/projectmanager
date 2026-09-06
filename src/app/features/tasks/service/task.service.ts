import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { NgForm } from '@angular/forms';
import { TaskModel } from '../model/task.model';
import { ProjectsService } from '../../projects/service/projects.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  taskStatus: string[] = ['in progress', 'open', 'in review', 'done'];
  private projectService = inject(ProjectsService);
  project = this.projectService.project;
  tasks = signal<TaskModel[]>([]);
  task = signal<TaskModel | null>(null);
  changeTask = signal(false);

  async getTasks(projectId?: string) {
    try {
      const tasksResult = await fetch(
        `${environment.apiUrl}/tasks/${projectId}`,
        {
          method: 'get',
          credentials: 'include',
        },
      );

      if (!tasksResult.ok) {
        throw new Error('Error Status: ' + tasksResult.status);
      }

      const data = await tasksResult.json();
      return data.tasks;
    } catch (error) {
      console.error('Error status', error);
    }
  }

  async getProjectsTasks() {
    try {
      const tasksResult = await fetch(`${environment.apiUrl}/tasks`, {
        method: 'get',
        credentials: 'include',
      });

      if (!tasksResult.ok) {
        throw new Error('Error Status: ' + tasksResult.status);
      }

      const data = await tasksResult.json();
      return data.tasks;
    } catch (error) {
      console.error('Error status', error);
    }
  }

  async createTask(form: NgForm, status?: string) {
    try {
      const task = {
        ...form.value,
        projectId: this.project()?.id,
        status: status ?? form.value.status,
      };

      const response = await fetch(`${environment.apiUrl}/tasks/create-task`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Error Status: ' + response.status);
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error status', error);
    }
  }

  async deleteTask(task: TaskModel) {
    try {
      const response = await fetch(
        `${environment.apiUrl}/tasks/delete-task/${task.id}`,
        {
          method: 'delete',
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('Error Status: ' + response.status);
      }
    } catch (error) {
      console.error('Error status', error);
    }
  }

  async updateTask(task: TaskModel) {
    try {
      const response = await fetch(`${environment.apiUrl}/tasks/update-task`, {
        method: 'put',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error('Error Status: ' + response.status);
      }
      const data = await response.json();

      return data;
    } catch (error) {
      console.error('Error status', error);
    }
  }

  async removeUserFromTask(taskId: number, userId: number) {
    try {
      const response = await fetch(
        `${environment.apiUrl}/tasks/remove-user/${taskId}/${userId}`,
        {
          method: 'delete',
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('Something went wrong removing the user from the task');
      }
    } catch (error) {
      console.error('Remove User reponse status: ', error);
    }
  }
}
