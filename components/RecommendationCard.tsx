import React from 'react';
import { FilamentRecommendation } from '../types';
import { ExternalLink, Thermometer, CheckCircle, Trophy, PenTool, Flame, AlertCircle } from 'lucide-react';

interface Props {
  data: FilamentRecommendation;
}

const RecommendationCard: React.FC<Props> = ({ data }) => {
  const isTopPick = data.isTopPick;

  return (
    <div 
      className={`relative bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full
        ${isTopPick ? 'border-brand-500 ring-1 ring-brand-500 shadow-brand-500/10' : 'border-slate-100'}
      `}
    >
      {isTopPick && (
        <div className="bg-brand-500 text-white text-xs font-bold px-3 py-1.5 absolute top-0 right-0 rounded-bl-xl flex items-center gap-1.5 shadow-sm z-10">
          <Trophy size={12} className="text-yellow-300" />
          MOST RECOMMENDED
        </div>
      )}

      <div className="p-6 flex-grow flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full mb-2 uppercase tracking-wide">
              {data.brand}
            </span>
            <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-brand-600 transition-colors">
              {data.name}
            </h3>
            <p className="text-slate-500 text-sm font-medium mt-1">{data.material}</p>
          </div>
          <div className="text-right pt-2">
            <span className="block text-lg font-bold text-slate-900">{data.priceEstimate}</span>
          </div>
        </div>

        {/* Reason */}
        <div className="flex items-start gap-3 mb-6">
          <CheckCircle className={`w-5 h-5 shrink-0 mt-0.5 ${isTopPick ? 'text-brand-500' : 'text-emerald-500'}`} />
          <p className="text-sm text-slate-600 leading-relaxed">{data.reason}</p>
        </div>

        {/* Tech Specs Grid */}
        <div className="mt-auto bg-slate-50 rounded-xl p-4 border border-slate-100/50">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Printing Requirements</h4>
          <div className="grid grid-cols-2 gap-y-4 gap-x-2">
            
            <div className="flex items-start gap-2">
              <Flame size={16} className="text-orange-500 mt-0.5" />
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Nozzle Temp</span>
                <span className="text-sm font-semibold text-slate-700">{data.technicalSpecs.nozzleTemp}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Thermometer size={16} className="text-red-500 mt-0.5" />
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Bed Temp</span>
                <span className="text-sm font-semibold text-slate-700">{data.technicalSpecs.bedTemp}</span>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <PenTool size={16} className="text-blue-500 mt-0.5" />
              <div>
                <span className="block text-[10px] text-slate-400 font-semibold uppercase">Nozzle Type</span>
                <span className="text-sm font-semibold text-slate-700">{data.technicalSpecs.nozzleType}</span>
              </div>
            </div>

            {data.technicalSpecs.notes && (
              <div className="flex items-start gap-2 col-span-2 pt-2 border-t border-slate-200/50 mt-1">
                <AlertCircle size={16} className="text-slate-400 mt-0.5" />
                <div>
                   <span className="block text-[10px] text-slate-400 font-semibold uppercase">Notes</span>
                   <span className="text-sm text-slate-600">{data.technicalSpecs.notes}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="p-4 pt-0">
        <a 
          href={data.productUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-all duration-300 shadow-sm
            ${isTopPick 
              ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/20' 
              : 'bg-slate-900 hover:bg-slate-800 text-white'
            }
          `}
        >
          View on Store
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};

export default RecommendationCard;