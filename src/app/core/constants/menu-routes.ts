export interface MenuItemRoute {
  displayName: string;
  path: string[];
  icon: string;
}

export const MenuRoutes: MenuItemRoute[] = [
  {
    displayName: $localize`Home`,
    path: ['/'],
    icon: 'home'
  },
  {
    displayName: $localize`Profile`,
    path: ['/', 'profile'],
    icon: 'person'
  },
  {
    displayName: $localize`Messages`,
    path: ['/', 'messages'],
    icon: 'mail'
  },
  {
    displayName: $localize`Transaction History`,
    path: ['/', 'transactions'],
    icon: 'history'
  },
  {
    displayName: $localize`Security`,
    path: ['/', 'security'],
    icon: 'security'
  }
];
