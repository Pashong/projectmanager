import {
  Component,
  inject,
  input,
  signal,
  output,
  computed,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskService } from '../../service/task.service';
import { ProjectsService } from '../../../projects/service/projects.service';
import { TaskModel } from '../../model/task.model';
import { ProjectModel } from '../../../projects/model/project.model';

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
  currentTask = input<TaskModel | null>();
  currentProject = input<ProjectModel | null>();
  taskMembers = computed(() => {
    const projectMembers = this.currentProject()?.members ?? [];
    const taskMembers = this.currentTask()?.members ?? [];

    return projectMembers.filter(projectMember => !taskMembers.some(taskMember => taskMember.id === projectMember.id));
  });

  closeChangeMenu = output<void>();

  async taskUpdating(form: NgForm, taskId?: number) {
    try {
      const currentTask = {
        ...form.value,
        id: taskId,
        project_id: this.currentTask()?.project_id,
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

      currentTask.status.replace('-', ' ');

      this.noChanges.set(false);
      const data = await this.tasksService.updateTask(currentTask);

      const projectMembers = this.currentProject()?.members ?? [];

      const members = projectMembers.filter((member) =>
        data?.members.includes(member.id),
      );

      this.tasks.update((tasks) =>
        tasks.map((task) =>
          task.id === data.task.id
            ? {
                ...task,
                ...data?.task,
                members,
              }
            : task,
        ),
      );

      this.closeChangeMenu.emit();
    } catch (error) {
      console.error(error);
    }
  }
}
