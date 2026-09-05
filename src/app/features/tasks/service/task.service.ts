import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { NgForm } from '@angular/forms';
import { TaskModel } from '../model/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks = signal<TaskModel[]>([]);

  async getTasks() {
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

  async createTask(form: NgForm) {
    try {
      const result = await fetch(`${environment.apiUrl}/tasks/create-task`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value),
      });

      if (!result.ok) {
        throw new Error('Error Status: ' + result.status);
      }
      const data = await result.json();

      return data;
    } catch (error) {
      console.error('Error status', error);
    }
  }

  async deleteTask(task: TaskModel) {
    try {
      const result = await fetch(
        `${environment.apiUrl}/tasks/create-task/${task.id}`,
        {
          method: 'delete',
          credentials: 'include',
        },
      );

      if (!result.ok) {
        throw new Error('Error Status: ' + result.status);
      }


    } catch (error) {
      console.error('Error status', error);
    }
  }

  async updateTask(task: TaskModel) {
    try {
      const result = await fetch(`${environment.apiUrl}/tasks/update-task`, {
        method: 'put',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });

      if (!result.ok) {
        throw new Error('Error Status: ' + result.status);
      }
      const data = await result.json();

      return data.task;
    } catch (error) {
      console.error('Error status', error);
    }
  }
}
