export type RequestCategory = 'customer' | 'advertising' | 'job_application';

export type RequestStage = 
  | 'new'
  | 'under_review'
  | 'contacted'
  | 'proposal_sent'
  | 'negotiation'
  | 'won'
  | 'lost';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface Note {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  assignedTo: string;
  assignedToAvatar?: string;
  dueDate: Date;
  status: TaskStatus;
}

export interface EmailHistoryItem {
  id: string;
  direction: 'inbound' | 'outbound';
  from: string;
  to: string;
  subject: string;
  body: string;
  sentAt: Date;
  sentBy: string;
  sentAs?: 'personal' | 'company'; // for outbound emails
}

export interface Request {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  attachments: Attachment[];
  receivedAt: Date;
  stage: RequestStage;
  category: RequestCategory;
  assignedTo?: string;
  assignedToAvatar?: string;
  notes: Note[];
  tasks: Task[];
  priority?: 'low' | 'medium' | 'high';
  emailHistory?: EmailHistoryItem[];
}

export interface StageConfig {
  id: RequestStage;
  label: string;
  color: string;
  order: number;
}

export const STAGE_CONFIG: StageConfig[] = [
  { id: 'new', label: 'New', color: 'bg-primary', order: 0 },
  { id: 'under_review', label: 'Under Review', color: 'bg-warning', order: 1 },
  { id: 'contacted', label: 'Contacted', color: 'bg-accent', order: 2 },
  { id: 'proposal_sent', label: 'Proposal Sent', color: 'bg-primary', order: 3 },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-warning', order: 4 },
  { id: 'won', label: 'Won', color: 'bg-success', order: 5 },
  { id: 'lost', label: 'Lost', color: 'bg-destructive', order: 6 },
];
