import { Component, inject, input } from '@angular/core';
import { TaskModel } from '../../../tasks/model/task.model';
import { ProjectModel } from '../../model/project.model';
import { UpdateProject } from '../update-project/update-project';
import { Tasks } from '../../../tasks/tasks';
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";
import { ProjectsService } from '../../service/projects.service';
import { Members } from '../../../../shared/components/members/members';
import { MemberModel } from '../../../../shared/models/member.model';

@Component({
  selector: 'app-project-component',
  imports: [Members,DatePipe, Tasks, UpdateProject, RouterLink],
  templateUrl: './project-component.html',
  styleUrl: './project-component.scss',
})
export class ProjectComponent {

  private projectsService = inject(ProjectsService);
  projects = this.projectsService.projects;
  tasks = input<TaskModel[] | null>();
  project = input<ProjectModel>();
  tasksCount = input<number>();

  async deleteProject(currentProject: ProjectModel) {
    try {
      await this.projectsService.deleteProject(currentProject.id);

      this.projects.update((projects) =>
        projects.filter((project) => project.id !== currentProject.id),
      );
    } catch (error) {
      console.error(error);
    }
  }

  async removeMemberFromProject(currentMember: MemberModel, projectId: number){
    try{

      await this.projectsService.removeMember(currentMember, projectId);
      this.projectsService.projects.update((projects) => projects.map(project => project.id === projectId ? {...project, members: project.members.filter(member => member.id !== currentMember.id)} : project));
      
    }
    catch(error){
      console.error(error);
    }
  }
}
