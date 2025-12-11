import React, { useState } from 'react';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import Questionnaire from './components/Questionnaire';
import { AppView, Project } from './types';
import { Plus, ArrowRight, Box, Clock, Search } from 'lucide-react';

// Mock Data
const MOCK_PROJECTS: Project[] = [
  { id: '1', title: 'Drone Frame Prototype', date: '2 days ago', type: 'Engineering', thumbnail: 'https://picsum.photos/400/300?random=1' },
  { id: '2', title: 'Cosplay Helmet', date: '1 week ago', type: 'Aesthetic', thumbnail: 'https://picsum.photos/400/300?random=2' },
  { id: '3', title: 'Garden Planter', date: '3 weeks ago', type: 'Outdoor', thumbnail: 'https://picsum.photos/400/300?random=3' },
];

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // --- Login View ---
  const LoginView = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Box className="text-brand-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Welcome Back</h2>
          <p className="text-slate-500 mt-2">Sign in to save your filament lists.</p>
        </div>
        <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); setCurrentView(AppView.DASHBOARD); }}>
          <div className="space-y-4">
            <input type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" required />
            <input type="password" placeholder="Password" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" required />
            <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all">Sign In</button>
          </div>
        </form>
        <div className="mt-6 text-center">
          <button onClick={() => { setIsLoggedIn(true); setCurrentView(AppView.DASHBOARD); }} className="text-sm text-brand-600 font-medium hover:underline">
            Skip for demo &rarr;
          </button>
        </div>
      </div>
    </div>
  );

  // --- Dashboard View ---
  const DashboardView = () => (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
          <p className="text-slate-500 mt-1">Manage your printing queue and material needs.</p>
        </div>
        <button 
          onClick={() => setCurrentView(AppView.QUESTIONNAIRE)}
          className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <div key={project.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
            <div className="h-48 overflow-hidden relative">
              <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 uppercase">
                {project.type}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
              <div className="flex items-center gap-2 mt-2 text-slate-400 text-sm">
                <Clock size={14} />
                <span>Last updated {project.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // --- Home View ---
  const HomeView = () => (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-sm font-semibold mb-6 border border-brand-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
          </span>
          AI-Powered Filament Intelligence
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 tracking-tight mb-6">
          The Genius Way to <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-500 to-cyan-600">Choose Your Filament</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-slate-500 mb-10 leading-relaxed">
          Stop guessing. Filament Genius AI analyzes your project requirements to recommend the perfect material from top brands available in Australia.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto">
          <button 
            onClick={() => setCurrentView(AppView.CHAT)}
            className="flex-1 py-4 px-6 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl"
          >
            Chat with AI <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => setCurrentView(AppView.QUESTIONNAIRE)}
            className="flex-1 py-4 px-6 rounded-xl bg-white text-slate-900 border border-slate-200 font-semibold hover:border-brand-500 hover:text-brand-600 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Search size={18} /> Guided Search
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="w-full bg-white border-y border-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Smart Analysis", desc: "Our AI understands strength, flexibility, and temperature requirements.", icon: "🧠" },
            { title: "Local Availability", desc: "Recommendations are checked against 3dprintergear.com.au stock.", icon: "🇦🇺" },
            { title: "Dual Modes", desc: "Chat naturally or use our structured wizard for precise results.", icon: "⚡" }
          ].map((feat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-brand-200 transition-colors">
              <div className="text-4xl mb-4">{feat.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feat.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout 
      currentView={currentView} 
      setView={setCurrentView} 
      isLoggedIn={isLoggedIn}
      logout={() => { setIsLoggedIn(false); setCurrentView(AppView.HOME); }}
    >
      {currentView === AppView.HOME && <HomeView />}
      {currentView === AppView.LOGIN && <LoginView />}
      {currentView === AppView.DASHBOARD && <DashboardView />}
      {currentView === AppView.CHAT && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-slate-900">Filament Expert Chat</h2>
            <p className="text-slate-500">Ask about materials, brands, or troubleshooting.</p>
          </div>
          <ChatInterface />
        </div>
      )}
      {currentView === AppView.QUESTIONNAIRE && (
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-slate-900">Guided Recommendation</h2>
            <p className="text-slate-500">Answer a few questions to find the perfect match.</p>
          </div>
          <Questionnaire />
        </div>
      )}
    </Layout>
  );
}