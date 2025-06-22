export interface TimeSession {
  id: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalMinutes: number;
  idleMinutes: number;
  productiveHours: number;
  screenshots: string[];
  status: 'active' | 'submitted' | 'approved' | 'rejected';
  lessHoursComment?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  approvalComment?: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface IdleEvent {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
}

export interface Screenshot {
  id: string;
  timestamp: string;
  url: string;
}

export interface HistoryFilters {
  status: 'all' | 'pending' | 'approved' | 'rejected';
  dateRange: 'all' | 'week' | 'month' | 'quarter';
  hoursRange: 'all' | 'full' | 'partial';
}