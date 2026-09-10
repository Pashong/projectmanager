import { Component, input, signal, inject } from '@angular/core';
import { ProjectModel } from '../../model/project.model';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskService } from '../../../tasks/service/task.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ProjectsService } from '../../service/projects.service';

@Component({
  selector: 'app-update-project',
  imports: [FormsModule],
  templateUrl: './update-project.html',
  styleUrl: './update-project.scss',
})
export class UpdateProject {
  private tasksService = inject(TaskService);
  private authService = inject(AuthService);
  private projectService = inject(ProjectsService);
  changeProject = signal<boolean>(false);
  currentProject = input<ProjectModel>();
  currentUser = this.authService.currentUser();
  noChanges = signal<boolean>(false);
  selectedMemberIds: number[] = [];
  tasksStatus = this.tasksService.taskStatus;

  toggleChangeProject() {
    this.changeProject.update((value) => !value);
  }

  async projectUpdating(form: NgForm, currentProject: ProjectModel) {
    try {
      if (
        this.currentProject()?.title === form.value.title &&
        this.currentProject()?.description === form.value.description &&
        this.currentProject()?.status === form.value.status &&
        this.currentProject()?.deadline === form.value.deadline &&
        this.currentProject()?.members === form.value.members
      ) {
        this.noChanges.set(true);
        return;
      }

      this.noChanges.set(false);
      const data = await this.projectService.updateProject(
        form,
        currentProject.id,
      );

      const projectMembers = this.currentProject()?.members ?? [];
      
      const members = projectMembers.filter((member) =>
        data.members.includes(member.id));

      this.changeProject.set(false);

      this.projectService.projects.update((projects) =>
        projects.map((project) =>
          project.id === data.project.id
            ? { ...data.project, members }
            : project,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }
}
