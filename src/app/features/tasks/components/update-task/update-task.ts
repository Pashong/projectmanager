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
import { TaskItems } from '../task-items/task-items';
import { viewChild } from '@angular/core';
import { AddMember } from '../../../../shared/components/members/component/add-member/add-member';

@Component({
  selector: 'app-update-task',
  imports: [TaskItems, FormsModule, AddMember],
  templateUrl: './update-task.html',
  styleUrl: './update-task.scss',
})
export class UpdateTask {
  private tasksService = inject(TaskService);
  private projectService = inject(ProjectsService);

  membersToAdd = viewChild(AddMember);

  task = this.tasksService.task();
  tasks = this.tasksService.tasks;
  tasksStatus = this.tasksService.taskStatus;
  noChanges = signal<boolean>(false);
  project = this.projectService.project;
  selectedMemberIds: number[] = [];
  currentTask = input<TaskModel>();
  currentProject = input<ProjectModel>();
  taskMembers = computed(() => {
    const projectMembers = this.projectService.project()?.members;
    const taskMembers = this.currentTask()?.members ?? [];

    console.log(projectMembers);
    console.log(taskMembers);

    return projectMembers?.filter(
      (projectMember) =>
        !taskMembers.some((taskMember) => taskMember.id === projectMember.id),
    );
  });

  taskItemsComponent = viewChild(TaskItems);

  closeChangeMenu = output<void>();

  async taskUpdating(form: NgForm, taskId?: number) {
    try {
      const selectedMemberIds = this.membersToAdd()?.selectedMemberIds;
      const taskItems = this.taskItemsComponent()?.taskItems() ?? [];

      form.value.members = selectedMemberIds;

      const currentTask = {
        ...form.value,
        id: taskId,
        project_id: this.currentTask()?.project_id,
        taskItems: taskItems,
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
                task_items: data.taskItems,
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
