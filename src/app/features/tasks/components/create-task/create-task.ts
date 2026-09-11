import { Component, inject, input, signal } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { TaskService } from '../../service/task.service';
import { ProjectModel } from '../../../projects/model/project.model';
import { TaskModel } from '../../model/task.model';
import { AuthService } from '../../../auth/services/auth.service';
import { TaskItems } from '../task-items/task-items';
import { viewChild } from '@angular/core';

@Component({
  selector: 'app-create-task',
  imports: [FormsModule, TaskItems],
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss',
})
export class CreateTask {
  private tasksService = inject(TaskService);
  private authService = inject(AuthService);

  taskItemsComponent = viewChild(TaskItems);

  tasks = this.tasksService.tasks;
  status = input<string>();
  taskCreation = signal<boolean>(false);
  currentProject = input<ProjectModel | null>();
  selectedMemberIds: number[] = [];
  requiredFields = signal<boolean>(true);

  openCreateTask() {
    this.taskCreation.update((value) => !value);
  }

  async createTask(form: NgForm, status?: string) {

    console.log(form.value);
    if(!form.value.name || !form.value.description || !form.value.deadline){
      this.requiredFields.set(false);
      return;
    }

    this.requiredFields.set(true);
    const taskItems = this.taskItemsComponent()?.taskItems() ?? [];
    const data = await this.tasksService.createTask(form, taskItems, status);
    const taskMembers = [
      ...this.selectedMemberIds, this.authService.currentUser()?.id,
    ];

    const members = this.currentProject()?.members.filter((member) => 
    taskMembers.includes(member.id) ?? []);

    const newTask = {
      ...data.task,
      members: members,
      task_items: [...data.taskItems]
    }

    console.log(newTask);

    this.tasks.update((tasks) => [...tasks, newTask]);

    this.taskCreation.set(false);

  }

}
