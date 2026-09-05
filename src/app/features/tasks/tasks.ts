import { Component, inject, OnInit } from '@angular/core';
import { TaskModel } from './model/task.model';
import { TaskService } from './service/task.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  imports: [],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks {
  private tasksService = inject(TaskService);

  taskStatus: string[] = ['in progress', 'open', 'done', 'in review'];
  tasks = this.tasksService.tasks;

  async createTask(form: NgForm) {
    try {
      const data = await this.tasksService.createTask(form);
      this.tasks.update((tasks) => [...tasks, data.task]);

    } catch (error) {
      console.error(error);
    }
  }


  async deleteTask(currentTask: TaskModel){
    try{
      await this.tasksService.deleteTask(currentTask);
      this.tasks.update((tasks) => tasks.filter((task) => task.id !== currentTask.id),);
    }
    catch(error){
      console.error("Task deletion error: ",error);
    }
  }

  async updateTask(currentTask: TaskModel){
    try{
      const data = await this.tasksService.updateTask(currentTask);
      this.tasks.update((tasks) => tasks.map(task => task.id === currentTask.id ? data : task));
    }catch(error){
      console.error(error);
    }
  }

  async OnInit() {
    try {
     const data =  await this.tasksService.getTasks();
      this.tasks.set(data);
    } catch (error) {
      console.error(error);
    }
  }
}
