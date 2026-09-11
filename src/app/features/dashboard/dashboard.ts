import { Component, inject, signal, computed } from '@angular/core';
import { ProjectsService } from '../projects/service/projects.service';
import { TaskService } from '../tasks/service/task.service';
import { TaskModel } from '../tasks/model/task.model';
import { Tasks } from '../tasks/tasks';
import { RouterLink } from '@angular/router';
import { ProjectComponent } from '../projects/components/project-component/project-component';

@Component({
  selector: 'app-dashboard',
  imports: [ProjectComponent, Tasks, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private projectService = inject(ProjectsService);
  private tasksService = inject(TaskService);
  projects = this.projectService.projects;
  tasks = this.tasksService.tasks;
  changeTask = signal<TaskModel | null>(null);
  sortedTasks = this.tasksService.sortedTasks;
  projectsWithTasks = computed(() => {
    return this.projects().map((project) => ({
      ...project,
      tasks: this.tasks()?.filter((task) => task.project_id === project.id),
    }));
  });

  taskDetails = signal<{ taskId: number; source: 'tasks' | 'projects' } | null>(
    null,
  );

  
  async ngOnInit() {
    try {
      const projectsData = await this.projectService.getProjects();
      const tasksData =
        (await this.tasksService.getProjectsTasks()) as TaskModel[];

      if (projectsData) {
        this.projects.set(projectsData);
      }

      if (tasksData) {
        this.tasks.set(tasksData);
        const sorted = [...tasksData]
          .sort(
            (a, b) =>
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
          )
          .filter((task) => task.status !== 'closed');

          this.sortedTasks.set(sorted);
      }
    } catch (error) {
      console.error('Dashboard: ', error);
    }
  }

  openTaskDetails(task: TaskModel, source: 'tasks' | 'projects') {
    this.taskDetails.update((current) =>
      current?.taskId === task.id && current?.source === source
        ? null
        : { taskId: task.id, source: source },
    );
  }
}
