import React, { useState } from 'react';
import { QuestionnaireData, FilamentRecommendation } from '../types';
import { generateFilamentRecommendations } from '../services/geminiService';
import RecommendationCard from './RecommendationCard';
import { ChevronRight, Printer, Palette, DollarSign, PenTool, Loader2, ArrowLeft } from 'lucide-react';

interface OptionButtonProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  desc?: string;
}

const OptionButton: React.FC<OptionButtonProps> = ({ 
  selected, 
  onClick, 
  label, 
  desc 
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex flex-col gap-1 ${
      selected
        ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500 shadow-md'
        : 'border-slate-200 bg-white hover:border-brand-200 hover:bg-slate-50'
    }`}
  >
    <span className={`font-semibold ${selected ? 'text-brand-700' : 'text-slate-900'}`}>
      {label}
    </span>
    {desc && <span className="text-xs text-slate-500">{desc}</span>}
  </button>
);

const Questionnaire: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<FilamentRecommendation[]>([]);
  const [formData, setFormData] = useState<QuestionnaireData>({
    application: '',
    printerType: 'open',
    experienceLevel: 'beginner',
    aesthetic: 'standard',
    budget: 'standard',
  });

  const handleNext = () => setStep((p) => p + 1);
  const handleBack = () => setStep((p) => Math.max(1, p - 1));

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const recommendations = await generateFilamentRecommendations(formData);
      setResults(recommendations);
      setStep(6); // Results View
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] w-full max-w-2xl mx-auto text-center px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-brand-400 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <Loader2 size={64} className="text-brand-600 animate-spin relative z-10" />
        </div>
        <h3 className="mt-8 text-2xl font-bold text-slate-900">Analyzing Requirements</h3>
        <p className="mt-2 text-slate-500">Searching the filament database for the perfect match...</p>
      </div>
    );
  }

  if (step === 6 && results.length > 0) {
    return (
      <div className="w-full max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Your Recommendations</h2>
          <button 
            onClick={() => { setResults([]); setStep(1); }}
            className="text-brand-600 hover:text-brand-700 font-medium text-sm flex items-center gap-1"
          >
            Start Over <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((rec, idx) => (
            <RecommendationCard key={idx} data={rec} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8">
      {/* Progress Bar */}
      <div className="w-full h-1 bg-slate-100">
        <div 
          className="h-full bg-brand-500 transition-all duration-500 ease-out"
          style={{ width: `${((step - 1) / 4) * 100}%` }}
        ></div>
      </div>

      <div className="p-8">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><PenTool size={24} /></div>
              <h2 className="text-xl font-bold text-slate-900">Project Application</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">What are you printing?</label>
              <textarea
                value={formData.application}
                onChange={(e) => setFormData({...formData, application: e.target.value})}
                placeholder="e.g. A functional gear for a bike, a decorative vase, or a cosplay helmet..."
                className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none min-h-[120px] resize-none text-slate-700"
              />
            </div>
            <button
              onClick={handleNext}
              disabled={!formData.application.trim()}
              className="w-full py-3 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Next Step <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Printer size={24} /></div>
              <h2 className="text-xl font-bold text-slate-900">Printer Setup</h2>
            </div>
            <div className="space-y-3">
              <OptionButton 
                selected={formData.printerType === 'open'} 
                onClick={() => setFormData({...formData, printerType: 'open'})}
                label="Open Frame (Standard)"
                desc="Most Ender 3s, Prusa Mini, etc. without enclosure."
              />
              <OptionButton 
                selected={formData.printerType === 'enclosed'} 
                onClick={() => setFormData({...formData, printerType: 'enclosed'})}
                label="Enclosed"
                desc="Bambu Lab X1/P1S, Flashforge Adventurer, etc."
              />
              <OptionButton 
                selected={formData.printerType === 'heated_chamber'} 
                onClick={() => setFormData({...formData, printerType: 'heated_chamber'})}
                label="Active Heated Chamber"
                desc="Industrial grade printers for engineering materials."
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleBack} className="px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"><ArrowLeft size={20}/></button>
              <button onClick={handleNext} className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">Next Step</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pink-50 text-pink-600 rounded-lg"><Palette size={24} /></div>
              <h2 className="text-xl font-bold text-slate-900">Aesthetics</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['standard', 'matte', 'glossy', 'transparent', 'silk'].map((style) => (
                <OptionButton 
                  key={style}
                  selected={formData.aesthetic === style}
                  onClick={() => setFormData({...formData, aesthetic: style as any})}
                  label={style.charAt(0).toUpperCase() + style.slice(1)}
                />
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={handleBack} className="px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"><ArrowLeft size={20}/></button>
              <button onClick={handleNext} className="flex-1 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors">Next Step</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-lg"><DollarSign size={24} /></div>
              <h2 className="text-xl font-bold text-slate-900">Experience & Budget</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Experience Level</label>
                <div className="flex rounded-xl bg-slate-100 p-1">
                  {['beginner', 'intermediate', 'expert'].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setFormData({...formData, experienceLevel: lvl as any})}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                        formData.experienceLevel === lvl ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Budget Preference</label>
                <div className="space-y-2">
                   <OptionButton 
                    selected={formData.budget === 'budget'} 
                    onClick={() => setFormData({...formData, budget: 'budget'})}
                    label="Value / Budget Friendly"
                  />
                  <OptionButton 
                    selected={formData.budget === 'standard'} 
                    onClick={() => setFormData({...formData, budget: 'standard'})}
                    label="Standard / Performance"
                  />
                  <OptionButton 
                    selected={formData.budget === 'premium'} 
                    onClick={() => setFormData({...formData, budget: 'premium'})}
                    label="Premium / Engineering Grade"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button onClick={handleBack} className="px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"><ArrowLeft size={20}/></button>
              <button onClick={handleSubmit} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2">
                Find My Filament <Sparkles size={18} className="text-brand-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;

function Sparkles({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" />
    </svg>
  )
}