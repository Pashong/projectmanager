import { Component, inject, signal} from '@angular/core';
import { ProjectsService } from '../../service/projects.service';
import { TaskService } from '../../../tasks/service/task.service';
import { Tasks } from '../../../tasks/tasks';
import { ActivatedRoute } from '@angular/router';
import {
  CdkDrag, 
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  CdkDragHandle
} from '@angular/cdk/drag-drop';
import { TaskModel } from '../../../tasks/model/task.model';
import { CreateTask } from '../../../tasks/components/create-task/create-task';
import { RouteBack } from '../../../../shared/components/route-back/route-back';
import { ProjectComponent } from '../../components/project-component/project-component';

@Component({
  selector: 'app-project',
  imports: [ProjectComponent,RouteBack,
    CreateTask,
    Tasks,
    CdkDropList,
    CdkDropListGroup,
],
  templateUrl: './project.html',
  styleUrl: './project.scss',
})
export class Project {
  private projectService = inject(ProjectsService);
  private tasksService = inject(TaskService);
  route = inject(ActivatedRoute);
  taskStatus = this.tasksService.taskStatus;

  tasks = this.tasksService.tasks;
  project = this.projectService.project;


  async ngOnInit() {
    try {

      const projectId = await this.route.snapshot.paramMap.get('id');
      if (!projectId) {
        return;
      }
      const resultProject = await this.projectService.getProject(projectId);
      
      const data = await this.tasksService.getTasks(projectId!);

      this.tasks.set(data);
      this.project.set(resultProject);
    } catch (error) {
      console.error(error);
    }
  }

  async drop(event: CdkDragDrop<TaskModel[]>) {
    const task = event.item.data as TaskModel;
    const newStatus = event.container.id.replace('-', ' ');

    if (newStatus !== task.status) {
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
