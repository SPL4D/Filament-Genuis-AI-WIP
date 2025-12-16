export enum AppView {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  QUESTIONNAIRE = 'QUESTIONNAIRE',
  NEW_PROJECT_CHOICE = 'NEW_PROJECT_CHOICE',
}

export interface User {
  id: string;
  email: string;
  name: string;
  joinedDate: number;
}

export interface FilamentRecommendation {
  name: string;
  brand: string;
  material: string;
  reason: string;
  priceEstimate: string;
  productUrl: string; // Integration with 3dprintergear.com.au
  isTopPick: boolean;
  technicalSpecs: {
    nozzleTemp: string;
    bedTemp: string;
    nozzleType: string;
    notes?: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface QuestionnaireData {
  application: string;
  printerType: 'open' | 'enclosed' | 'heated_chamber';
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
  aesthetic: 'matte' | 'glossy' | 'transparent' | 'silk' | 'standard';
  budget: 'budget' | 'standard' | 'premium';
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  date: string;
  timestamp: number;
  type: string; // e.g. "Engineering" or "Aesthetic" based on input
  thumbnail: string;
  recommendations?: FilamentRecommendation[]; // Store the results (optional)
  chatHistory?: ChatMessage[]; // Store chat history (optional)
}