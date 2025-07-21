export interface PullRequest {
  id: string;
  title: string;
  repo: string;
  status: 'pending' | 'accepted' | 'rejected';
  author: string;
  date: string;
  files: File[];
  filesChanged: number;
  linesAdded: number;
  linesRemoved: number;
  reviewers: string[];
  comments: Comment[];
  score: number;
  url: string;
  
}

export interface File{
  file: string;
  changes: string;
  additions:string[];
  deletions:string[];
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  date: string;
  isReviewer: boolean;
}

export interface UserProfile {
  username: string;
  name: string;
  avatar: string;
  bio: string;
  location: string;
  company: string;
  totalPRs: number;
  acceptedPRs: number;
  rejectedPRs: number;
  pendingPRs: number;
  score: number;
  joinedDate: string;
}

export interface DashboardStats {
  totalPRs: number;
  acceptedPRs: number;
  rejectedPRs: number;
  pendingPRs: number;
  score: number;
  prData: Array<{
    date: string;
    count: number;
  }>;
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  company?: string;
  githubUrl?: string;
  joinedDate: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithGitHub: () => void;
  logout: () => void;
  loading: boolean;
}