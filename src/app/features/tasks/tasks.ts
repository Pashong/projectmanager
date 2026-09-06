import { Component, inject, OnInit, signal } from '@angular/core';
import { TaskModel } from './model/task.model';
import { TaskService } from './service/task.service';
import { NgForm } from '@angular/forms';
import { CreateTask } from './components/create-task/create-task';
import { UpdateTask } from './components/update-task/update-task';
import { ProjectsService } from '../projects/service/projects.service';
import { MemberModel } from '../../shared/models/member.model';
import { ActivatedRoute } from '@angular/router';
import { DeleteTask } from './components/delete-task/delete-task';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
  CdkDragPlaceholder,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { OpenUpdateTask } from "./components/open-update-task/open-update-task";

@Component({
  selector: 'app-tasks',
  imports: [DeleteTask,OpenUpdateTask,
    CreateTask,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
    OpenUpdateTask
],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks {
  private tasksService = inject(TaskService);
  private projectService = inject(ProjectsService);
  private route = inject(ActivatedRoute);

  taskStatus = this.tasksService.taskStatus;
  tasks = this.tasksService.tasks;
  task = this.tasksService.task;
  changeTask = signal<TaskModel | null>(null);
  project = this.projectService.project;

  async deleteTask(currentTask: TaskModel) {
    try {
      await this.tasksService.deleteTask(currentTask);
      this.tasks.update((tasks) =>
        tasks.filter((task) => task.id !== currentTask.id),
      );
    } catch (error) {
      console.error('Task deletion error: ', error);
    }
  }

  async ngOnInit() {
    try {
      const projectId = await this.route.snapshot.paramMap.get('id');
      const data = await this.tasksService.getTasks(projectId!);
      this.tasks.set(data);
    } catch (error) {
      console.error(error);
    }
  }

  openChangeTask(task: TaskModel) {
    if (task) {
      task.deadline = task.deadline.split('T')[0];
    }
    this.tasksService.task.set(task);
    this.changeTask.set(task);
  }

  async removeUser(taskId: number, userId: number) {
    try {
      await this.tasksService.removeUserFromTask(taskId, userId);
      this.tasks.update((tasks) =>
        tasks.map((task) =>
          taskId === task.id
            ? {
                ...task,
                members: task.members.filter((member) => member.id !== userId),
              }
            : task,
        ),
      );
    } catch (error) {
      console.error('Removing user failed ', error);
    }
  }

  async drop(event: CdkDragDrop<TaskModel[]>) {
    const task = event.item.data as TaskModel;
    const newStatus = event.container.id.replace('-', ' ');

    if(newStatus !== task.status){
          task.status = newStatus;
          await this.tasksService.updateTask(task);
    }

    this.tasks.update((tasks) =>
      tasks.map((currentTask) =>
        currentTask.id === task.id
          ? {
              ...currentTask,
              status: newStatus,
            }
          : currentTask,
      ),
    );
  }
}
