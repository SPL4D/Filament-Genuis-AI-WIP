import { User, Project, FilamentRecommendation, ChatMessage } from '../types';

const USERS_KEY = 'fga_users';
const PROJECTS_KEY = 'fga_projects';
const CURRENT_USER_KEY = 'fga_current_user';

// --- Helper Functions ---
const readStore = (key: string) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

const writeStore = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// --- DB Service ---

export const dbService = {
  // --- Auth ---
  
  registerUser: (email: string, password: string): User => {
    // Note: In a real app, never store passwords in local storage.
    // This is a simulation of a backend DB.
    const users = readStore(USERS_KEY);
    
    if (users.find((u: any) => u.email === email)) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name: email.split('@')[0],
      joinedDate: Date.now(),
    };

    // Store "auth" record (simulating a separate auth table)
    const authRecord = { ...newUser, password }; 
    users.push(authRecord);
    writeStore(USERS_KEY, users);
    
    return newUser;
  },

  loginUser: (email: string, password: string): User => {
    const users = readStore(USERS_KEY);
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Return user without password
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  // --- Projects ---

  getProjects: (userId: string): Project[] => {
    const projects = readStore(PROJECTS_KEY);
    return projects
      .filter((p: Project) => p.userId === userId)
      .sort((a: Project, b: Project) => b.timestamp - a.timestamp);
  },

  saveProject: (
    userId: string, 
    title: string, 
    type: string, 
    content: { recommendations?: FilamentRecommendation[], chatHistory?: ChatMessage[] }
  ): Project => {
    const projects = readStore(PROJECTS_KEY);
    
    // Generate a thumbnail
    // If chat, use a generic chat image or seeded random
    // If recommendations, use seed from data
    const seed = title.length + (content.recommendations?.[0]?.material.length || type.length);
    const thumbnail = `https://picsum.photos/400/300?random=${seed}`;

    const newProject: Project = {
      id: crypto.randomUUID(),
      userId,
      title,
      date: new Date().toLocaleDateString(),
      timestamp: Date.now(),
      type: type.charAt(0).toUpperCase() + type.slice(1),
      thumbnail,
      recommendations: content.recommendations,
      chatHistory: content.chatHistory
    };

    projects.push(newProject);
    writeStore(PROJECTS_KEY, projects);
    return newProject;
  },

  deleteProject: (projectId: string) => {
    const projects = readStore(PROJECTS_KEY);
    const filtered = projects.filter((p: Project) => p.id !== projectId);
    writeStore(PROJECTS_KEY, filtered);
  }
};