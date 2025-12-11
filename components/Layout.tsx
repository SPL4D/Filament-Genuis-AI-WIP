import React from 'react';
import { AppView } from '../types';
import { Layers, Menu, X, User, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  setView: (view: AppView) => void;
  isLoggedIn: boolean;
  logout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, isLoggedIn, logout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const NavItem = ({ view, label, icon: Icon }: { view: AppView; label: string; icon?: any }) => (
    <button
      onClick={() => {
        setView(view);
        setMobileMenuOpen(false);
      }}
      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
        currentView === view
          ? 'bg-brand-500 text-white shadow-md'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {Icon && <Icon size={18} />}
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setView(AppView.HOME)}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-cyan-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                <Zap size={20} fill="currentColor" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-cyan-800 tracking-tight">
                Filament Genius
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-2">
              <NavItem view={AppView.HOME} label="Home" />
              {isLoggedIn && <NavItem view={AppView.DASHBOARD} label="Projects" icon={Layers} />}
              
              {!isLoggedIn ? (
                <button
                  onClick={() => setView(AppView.LOGIN)}
                  className="ml-4 px-6 py-2 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  Sign In
                </button>
              ) : (
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-slate-200">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                        <User size={16} />
                      </div>
                      <span className="text-sm font-medium hidden lg:block">Guest User</span>
                   </div>
                   <button onClick={logout} className="text-sm text-slate-500 hover:text-red-500">Sign Out</button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b border-slate-200 shadow-xl p-4 flex flex-col gap-3 animate-fade-in-down">
            <NavItem view={AppView.HOME} label="Home" />
            {isLoggedIn && <NavItem view={AppView.DASHBOARD} label="My Projects" icon={Layers} />}
            {!isLoggedIn ? (
              <button
                onClick={() => {
                  setView(AppView.LOGIN);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-brand-600 text-white font-medium text-center shadow-lg"
              >
                Sign In
              </button>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-xl border border-slate-200 text-slate-600 font-medium text-center"
              >
                Sign Out
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 Filament Genius AI. Powered by Google Gemini.
          </p>
          <p className="text-slate-400 text-xs mt-2">
            Recommendations linked to <a href="https://3dprintergear.com.au" target="_blank" rel="noreferrer" className="underline hover:text-brand-600">3dprintergear.com.au</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;