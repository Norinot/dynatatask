import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'homepage', pathMatch: 'full' },

  { path: 'homepage', loadComponent: () => import('./components/pages/homepage/homepage.component').then(m => m.HomepageComponent) },
  { path: 'admin-page', loadComponent: () => import('./components/pages/adminpage/adminpage.component').then(m => m.AdminpageComponent) },
  { path: 'profile', loadComponent: () => import('./components/pages/profilepage/profilepage.component').then(m => m.ProfilepageComponent) },
];
