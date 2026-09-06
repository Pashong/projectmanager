import { Component, inject, input, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskService } from '../../service/task.service';
import { ProjectsService } from '../../../projects/service/projects.service';

@Component({
  selector: 'app-update-task',
  imports: [FormsModule],
  templateUrl: './update-task.html',
  styleUrl: './update-task.scss',
})
export class UpdateTask {
  private tasksService = inject(TaskService);
  private projectService = inject(ProjectsService);
  task = this.tasksService.task();
  tasks = this.tasksService.tasks;
  tasksStatus = this.tasksService.taskStatus;
  noChanges = signal<boolean>(false);
  project = this.projectService.project;
  selectedMemberIds: number[] = [];

  async taskUpdating(form: NgForm, taskId?: number) {
    try {
      const currentTask = {
        ...form.value,
        id: taskId,
        project_id: this.task?.project_id,
      };

      if (
        this.task?.title === currentTask.title &&
        this.task?.description === currentTask.description &&
        this.task?.status === currentTask.status &&
        this.task?.deadline === currentTask.deadline &&
        this.task?.members === currentTask.members
      ) {
        this.noChanges.set(true);
        return;
      }
      this.noChanges.set(false);
      const data = await this.tasksService.updateTask(currentTask);

      console.log(data.task);

      const projectMembers = this.project()?.members ?? [];

      const members = projectMembers.filter((member) =>
        data.members.includes(member.id),
      );

      this.tasks.update((tasks) =>
        tasks.map((task) =>
          task.id === data.task.id
            ? {
                ...data.task,
                members,
              }
            : task,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

}
