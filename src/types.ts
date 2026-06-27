export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Active' | 'Lead' | 'Inactive';
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  description: string;
  status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
  progress: number; // 0 to 100
  budget: number; // in USD
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  clientId: string;
  projectId?: string;
  createdAt: string;
  creatorName: string;
  creatorRole: 'Client' | 'Manager' | 'Engineer';
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  features: string[];
  image: string; // fallback SVG icon name or pattern
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string; // Lucide icon name
  features: string[];
}

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: 'Client' | 'Manager';
  company?: string;
  clientId?: string;
  createdAt: string;
}
