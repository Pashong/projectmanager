import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Projects } from './features/projects/pages/projects/projects';
import { Project } from './features/projects/pages/project/project';
import { Dashboard } from './features/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    //  canActivate: [authGuard] wenn mein JWT fertig ist kann ich damit weiterleiten
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'register',
    component: Register,
  },
  {
    path: 'projects',
    component: Projects,
    canActivate: [authGuard]
  },
  {
    path: 'projects/:id',
    component: Project,
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  }
];
