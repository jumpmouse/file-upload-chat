import { Routes } from '@angular/router';
import { environment } from '@environment';
import { authGuard, publicAuthGuard } from '@guards';
import { homeResolver } from '@resolvers';
import { StyleGuideComponent } from '@views/_hidden/style-guide/style-guide.component';
import { PageNotFoundComponent } from '@views/page-not-found/page-not-found.component';
import { HomeComponent } from '@views/home/home.component';
import { LoginComponent } from '@views/login/login.component';
import { RegisterComponent } from '@views/register/register.component';
import { ForgotPasswordComponent } from '@views/forgot-password/forgot-password.component';

// Style Guide route
const hiddenRoutes: Routes = environment.production
  ? []
  : [{ outlet: 'hidden', path: 'style-guide', component: StyleGuideComponent }];

const pageNotFoundRoutes: Routes = [{ path: '**', component: PageNotFoundComponent }];

const publicRoutes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent, resolve: [homeResolver] },
  { path: 'login', pathMatch: 'full', component: LoginComponent, canActivate: [publicAuthGuard] },
  { path: 'register', pathMatch: 'full', component: RegisterComponent, canActivate: [publicAuthGuard] },
  { path: 'forgot-password', pathMatch: 'full', component: ForgotPasswordComponent, canActivate: [publicAuthGuard] },
];

const messagesRoutes: Routes = [
  {
    path: 'messages',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./views/messages/messages.component').then((m) => m.MessagesComponent),
      },
    ],
  },
];

const transactionsRoutes: Routes = [
  {
    path: 'transactions',
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./views/transactions/transactions.component').then((m) => m.TransactionsComponent),
      },
    ],
  },
];

const privateRoutes: Routes = [
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      {
        path: 'profile',
        pathMatch: 'full',
        loadComponent: () => import('./views/profile/profile.component').then((m) => m.ProfileComponent),
      },
      {
        path: 'security',
        pathMatch: 'full',
        loadComponent: () => import('./views/security/security.component').then((m) => m.SecurityComponent),
      },
      ...messagesRoutes,
      ...transactionsRoutes,
      ...pageNotFoundRoutes,
    ],
  },
];

export const routes: Routes = [{
  path: '',
  loadComponent: () => import('./views/base/base.component').then((m) => m.BaseComponent),
  children: [...hiddenRoutes, ...publicRoutes, ...privateRoutes, ...pageNotFoundRoutes]
}];
