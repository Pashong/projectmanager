import { Component, input, signal, inject, computed } from '@angular/core';
import { ProjectModel } from '../../model/project.model';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskService } from '../../../tasks/service/task.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ProjectsService } from '../../service/projects.service';
import { MemberModel } from '../../../../shared/models/member.model';

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
  users = signal<MemberModel[]>([]);
  projectMembers = computed(() => 
  {
    const projectMembers = this.currentProject()?.members;
    
    return this.users().filter( user => !projectMembers?.some(projectMember => projectMember.id === user.id));
  });
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

      const members = this.users().filter((member) =>
        data.members.includes(member.id),
      );

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

  async ngOnInit() {
    try {
      const users = await this.projectService.getUsers();
      this.users.set(users);
    } catch (error) {
      console.error('Users data failed', error);
    }
  }
}
