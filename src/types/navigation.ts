export interface NavItem {
  id: string;
  label: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface PageNode {
  id: string;
  label: string;
}

export interface PageGroup {
  title: string;
  items: PageNode[];
}
