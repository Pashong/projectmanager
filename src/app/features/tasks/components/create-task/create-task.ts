import { Component, inject, input, signal } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { TaskService } from '../../service/task.service';
import { ProjectModel } from '../../../projects/model/project.model';
import { TaskModel } from '../../model/task.model';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-create-task',
  imports: [FormsModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss',
})
export class CreateTask {
  private tasksService = inject(TaskService);
  private authService = inject(AuthService);

  tasks = this.tasksService.tasks;
  status = input<string>();
  taskCreation = signal<boolean>(false);
  currentProject = input<ProjectModel | null>();
  selectedMemberIds: number[] = [];

  openCreateTask() {
    this.taskCreation.update((value) => !value);
  }

  async createTask(form: NgForm, status?: string) {

    const data = await this.tasksService.createTask(form, status);
    const taskMembers = [
      ...this.selectedMemberIds, this.authService.currentUser()?.id,
    ];

    const members = this.currentProject()?.members.filter((member) => 
    taskMembers.includes(member.id) ?? []);
    const newTask = {
      ...data.task,
      members: members
    }

    this.tasks.update((tasks) => [...tasks, newTask]);

    this.taskCreation.set(false);

  }
}
