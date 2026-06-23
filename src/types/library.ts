export interface Library {
  name: string;
  author: string;
  cat: string;
  desc: string;
  tags: string[];
  version: string;
  stars: string;
  installs: string;
  color: string;
  initials: string;
}

export interface Category {
  id: string;
  label: string;
  count: number;
}
