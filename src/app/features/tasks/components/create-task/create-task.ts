import { Component, inject, input, signal } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { TaskService } from '../../service/task.service';
import { ProjectModel } from '../../../projects/model/project.model';
import { TaskModel } from '../../model/task.model';
import { AuthService } from '../../../auth/services/auth.service';
import { TaskItems } from '../task-items/task-items';
import { viewChild } from '@angular/core';
import { AddMember } from '../../../../shared/components/members/component/add-member/add-member';

@Component({
  selector: 'app-create-task',
  imports: [FormsModule, TaskItems, AddMember],
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss',
})
export class CreateTask {
  private tasksService = inject(TaskService);
  private authService = inject(AuthService);

  taskItemsComponent = viewChild(TaskItems);
  membersToAdd = viewChild(AddMember);

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

    if(!form.value.name || !form.value.description || !form.value.deadline){
      this.requiredFields.set(false);
      return;
    }


    this.requiredFields.set(true);
    this.selectedMemberIds = await this.membersToAdd()?.selectedMemberIds ?? [];
    form.value.members = this.selectedMemberIds;

    const taskItems = this.taskItemsComponent()?.taskItems() ?? [];
    const data = await this.tasksService.createTask(form, taskItems, status);
    const taskMembers = [
      ...this.selectedMemberIds, this.authService.currentUser()?.id,
    ];

    const members = this.currentProject()?.members.filter((member) => 
    taskMembers.includes(member.id) ?? []);

    console.log(members);

    const newTask = {
      ...data.task,
      members: members,
      task_items: [...data.taskItems]
    }

    this.tasks.update((tasks) => [...tasks, newTask]);
    this.taskCreation.set(false);

  }

}
