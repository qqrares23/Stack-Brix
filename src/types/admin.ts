export type SubmissionStatus = 'pending' | 'approved' | 'rejected';

export interface QueueItem {
  id: string;
  name: string;
  author: string;
  initials: string;
  color: string;
  cat: string;
  version: string;
  submitted: string;
  status: SubmissionStatus;
  desc: string;
  links: string[];
  mine?: boolean;
}
