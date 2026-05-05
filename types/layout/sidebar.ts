export interface SubMenuItem {
  title: string;
  href: string;
}

export type MenuIcon = 'home' | 'users' | 'settings' | 'LayoutDashboard' | 'message';

export interface MenuItem {
  title: string;
  icon?: MenuIcon;
  href?: string;
  subMenu?: SubMenuItem[];
}

export interface SidebarProps {
  menuItems: MenuItem[];
}
