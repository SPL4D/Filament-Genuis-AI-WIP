import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ChatInterface from './components/ChatInterface';
import Questionnaire from './components/Questionnaire';
import RecommendationCard from './components/RecommendationCard'; // Re-use for project details
import { AppView, Project, User, FilamentRecommendation, ChatMessage } from './types';
import { dbService } from './services/dbService';
import { Plus, ArrowRight, Box, Clock, Search, Trash2, ArrowLeft, MessageSquare, ClipboardList, Bot, User as UserIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Specific state for viewing a project
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    // If we were using a session token, we'd check it here.
    // For this demo, we start logged out or check localStorage if we wanted persistent session
  }, []);

  useEffect(() => {
    if (currentUser) {
      setProjects(dbService.getProjects(currentUser.id));
    } else {
      setProjects([]);
    }
  }, [currentUser]);

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView(AppView.HOME);
    setSelectedProject(null);
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(confirm("Are you sure you want to delete this project?")) {
      dbService.deleteProject(id);
      if (currentUser) setProjects(dbService.getProjects(currentUser.id));
    }
  }

  // --- Login View ---
  const LoginView = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleAuth = (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      try {
        let user;
        if (isSignUp) {
          user = dbService.registerUser(email, password);
        } else {
          user = dbService.loginUser(email, password);
        }
        setCurrentUser(user);
        setCurrentView(AppView.DASHBOARD);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      }
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Box className="text-brand-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-slate-500 mt-2">
              {isSignUp ? 'Join Filament Genius to save your projects.' : 'Sign in to access your dashboard.'}
            </p>
          </div>
          
          <form onSubmit={handleAuth}>
            <div className="space-y-4">
              {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
              <input 
                type="email" 
                placeholder="Email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" 
                required 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white text-slate-900 placeholder-slate-400 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none" 
                required 
              />
              <button type="submit" className="w-full py-3 bg-slate-900 hover:bg-brand-600 text-white rounded-xl font-semibold transition-all">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center border-t border-slate-100 pt-6">
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }} 
              className="text-sm text-slate-500 hover:text-brand-600 transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // --- Project Details View ---
  const ProjectDetailView = () => {
    if (!selectedProject) return null;
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
         <button 
          onClick={() => setSelectedProject(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-6 transition-colors"
        >
          <ArrowLeft size={18} /> Back to Dashboard
        </button>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{selectedProject.title}</h1>
            <p className="text-slate-500 mt-1">Created on {selectedProject.date} • {selectedProject.type}</p>
          </div>
        </div>

        {selectedProject.recommendations && selectedProject.recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedProject.recommendations.map((rec, idx) => (
               <RecommendationCard key={idx} data={rec} />
            ))}
          </div>
        ) : selectedProject.chatHistory && selectedProject.chatHistory.length > 0 ? (
          <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
               <span className="font-semibold text-slate-700">Chat History</span>
             </div>
             <div className="p-6 space-y-6">
               {selectedProject.chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${
                      msg.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                        msg.role === 'user' ? 'bg-slate-900 text-white' : 'bg-brand-500 text-white'
                      }`}
                    >
                      {msg.role === 'user' ? <UserIcon size={18} /> : <Bot size={18} />}
                    </div>
                    
                    <div
                      className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-sm text-sm md:text-base leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-slate-900 text-white rounded-tr-none'
                          : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                      }`}
                    >
                      <ReactMarkdown 
                        components={{
                          a: ({node, ...props}) => <a {...props} className="text-blue-400 underline hover:text-blue-300" target="_blank" rel="noopener noreferrer" />,
                          ul: ({node, ...props}) => <ul {...props} className="list-disc pl-4 my-2" />,
                          strong: ({node, ...props}) => <strong {...props} className="font-bold" />
                        }}
                      >
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500">
            No details available for this project.
          </div>
        )}
      </div>
    );
  };

  // --- Dashboard View ---
  const DashboardView = () => {
    if (selectedProject) return <ProjectDetailView />;

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Projects</h1>
            <p className="text-slate-500 mt-1">Manage your printing queue and material needs.</p>
          </div>
          <button 
            onClick={() => setCurrentView(AppView.NEW_PROJECT_CHOICE)}
            className="flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
          >
            <Plus size={18} /> New Project
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Box size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No projects yet</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Start a new project to get personalized filament recommendations.</p>
            <button 
              onClick={() => setCurrentView(AppView.NEW_PROJECT_CHOICE)}
              className="text-brand-600 font-medium hover:underline"
            >
              Start first project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div 
                key={project.id} 
                onClick={() => setSelectedProject(project)}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all group cursor-pointer relative"
              >
                <div className="h-48 overflow-hidden relative bg-slate-200">
                  <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 uppercase">
                    {project.type}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-slate-900 truncate pr-2">{project.title}</h3>
                    <button 
                      onClick={(e) => handleDeleteProject(e, project.id)}
                      className="text-slate-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-slate-400 text-sm">
                    <Clock size={14} />
                    <span>{project.date}</span>
                    <span>•</span>
                    {project.recommendations ? (
                      <span>{project.recommendations.length} options</span>
                    ) : (
                      <span>Chat Session</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // --- New Project Choice View ---
  const NewProjectChoiceView = () => (
    <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
      <button 
        onClick={() => setCurrentView(AppView.DASHBOARD)}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-8 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Dashboard
      </button>

      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900">Start a New Project</h2>
        <p className="text-slate-500 mt-2 text-lg">Choose how you would like to find your filament.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Chat Option */}
        <button
          onClick={() => setCurrentView(AppView.CHAT)}
          className="flex flex-col text-left bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-400 transition-all group"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <MessageSquare size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">AI Chat Assistant</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Have a conversation with our AI expert. Describe your project freely and get advice, just like talking to a pro.
          </p>
          <div className="mt-auto flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
            Start Chat <ArrowRight size={20} />
          </div>
        </button>

        {/* Questionnaire Option */}
        <button
          onClick={() => setCurrentView(AppView.QUESTIONNAIRE)}
          className="flex flex-col text-left bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-400 transition-all group"
        >
          <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <ClipboardList size={32} />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-3">Guided Wizard</h3>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Take a structured questionnaire to specify your printer, budget, and needs for precise, tailored recommendations.
          </p>
          <div className="mt-auto flex items-center gap-2 text-brand-600 font-semibold group-hover:gap-3 transition-all">
            Start Wizard <ArrowRight size={20} />
          </div>
        </button>
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
      isLoggedIn={!!currentUser}
      logout={handleLogout}
    >
      {currentView === AppView.HOME && <HomeView />}
      {currentView === AppView.LOGIN && <LoginView />}
      {currentView === AppView.DASHBOARD && <DashboardView />}
      {currentView === AppView.NEW_PROJECT_CHOICE && <NewProjectChoiceView />}
      {currentView === AppView.CHAT && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-slate-900">Filament Expert Chat</h2>
            <p className="text-slate-500">Ask about materials, brands, or troubleshooting.</p>
          </div>
          <ChatInterface 
            isLoggedIn={!!currentUser}
            onSaveProject={(title, history) => {
              if (currentUser) {
                dbService.saveProject(currentUser.id, title, "Conversation", { chatHistory: history });
                setProjects(dbService.getProjects(currentUser.id));
                setCurrentView(AppView.DASHBOARD);
              }
            }}
          />
        </div>
      )}
      {currentView === AppView.QUESTIONNAIRE && (
        <div className="max-w-7xl mx-auto px-4">
           <div className="text-center py-6">
            <h2 className="text-2xl font-bold text-slate-900">Guided Recommendation</h2>
            <p className="text-slate-500">Answer a few questions to find the perfect match.</p>
          </div>
          <Questionnaire 
            isLoggedIn={!!currentUser} 
            onGoHome={() => setCurrentView(AppView.HOME)}
            onSaveProject={(title, type, recs) => {
              if (currentUser) {
                dbService.saveProject(currentUser.id, title, type, { recommendations: recs });
                setProjects(dbService.getProjects(currentUser.id));
                setCurrentView(AppView.DASHBOARD);
              }
            }}
          />
        </div>
      )}
    </Layout>
  );
}