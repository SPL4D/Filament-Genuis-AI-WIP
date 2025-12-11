import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm Filament Genius. Tell me what you're planning to print, and I'll help you find the perfect material.",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Prepare history for API (excluding the latest user message which is sent separately)
      const history = messages.map(m => ({ role: m.role, text: m.text }));
      const responseText = await sendChatMessage(history, userMsg.text);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-[600px] w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-4 md:my-8">
      {/* Chat Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span className="font-semibold text-slate-700">Conversational Mode</span>
        <span className="text-xs text-slate-400 ml-auto">Powered by Gemini 2.5</span>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg) => (
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
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
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
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0">
              <Bot size={18} />
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-5 py-3 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span className="text-slate-400 text-sm">Genius is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Describe your project (e.g., 'I need a strong part for a drone frame...')"
            className="w-full bg-slate-50 text-slate-900 placeholder-slate-400 border border-slate-200 rounded-full py-3.5 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-300 text-white rounded-full flex items-center justify-center transition-all shadow-md hover:shadow-lg disabled:shadow-none"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
        <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1">
          <Sparkles size={12} /> AI can make mistakes. Verify critical specs.
        </p>
      </div>
    </div>
  );
};

export default ChatInterface;