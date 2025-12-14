export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  estimated_hours: number | null;
  project_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface AITaskSuggestion {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedHours: number;
}

export interface ProjectAnalysis {
  progress: number;
  insights: string[];
  recommendations: string[];
}
