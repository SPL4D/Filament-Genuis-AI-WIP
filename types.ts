export enum AppView {
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  QUESTIONNAIRE = 'QUESTIONNAIRE',
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
  title: string;
  date: string;
  type: string;
  thumbnail: string;
}