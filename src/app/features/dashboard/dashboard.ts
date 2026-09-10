import { Component, inject, signal, computed } from '@angular/core';
import { ProjectsService } from '../projects/service/projects.service';
import { TaskService } from '../tasks/service/task.service';
import { TaskModel } from '../tasks/model/task.model';
import { DatePipe } from '@angular/common';
import { Tasks } from '../tasks/tasks';
import { UpdateProject } from '../projects/components/update-project/update-project';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink,UpdateProject,Tasks, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private projectService = inject(ProjectsService);
  private tasksService = inject(TaskService);
  projects = this.projectService.projects;
  tasks = this.tasksService.tasks;
  changeTask = signal<TaskModel | null>(null);
  sortedTasks: TaskModel[] | null = null;
  projectsWithTasks = computed(() => {
    return this.projects().map((project) => ({
      ...project,
      tasks: this.tasks().filter((task) => task.project_id === project.id),
    }));
  });
  taskDetails = signal<{ taskId: number; source: 'tasks' | 'projects' } | null>(
    null,
  );

  openChangeTask(task: TaskModel) {
    if (task) {
      task.deadline = task.deadline.split('T')[0];
    }
    this.tasksService.task.set(task);
    this.changeTask.set(task);
  }

  async ngOnInit() {
    const projectsData = await this.projectService.getProjects();
    const tasksData = await this.tasksService.getProjectsTasks();

    console.log(projectsData);
    console.log(tasksData);
    this.projects.set(projectsData);
    this.tasks.set(tasksData);
    this.sortedTasks = [...tasksData].sort(
      (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
    ).filter((task) => task.status !== "closed");
  }

  openTaskDetails(task: TaskModel, source: 'tasks' | 'projects') {
    this.taskDetails.update((current) =>
      current?.taskId === task.id && current?.source === source
        ? null
        : { taskId: task.id, source: source },
    );
  }
}
