import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Zap, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AdBanner from '../components/AdBanner';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export default function AICoach() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm your Momentum AI Coach. Give me your habit data, or ask me for advice on how to build better consistency."
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const chatHistory = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessage,
          history: chatHistory.slice(0, -1) // Exclude the message we just added
        })
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Server returned non-JSON response: ${text.slice(0, 100)}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'AI sequence failed');
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: data.text || "I'm not sure what to say. Let's try focusing on your goals!"
      }]);
    } catch (error: any) {
       console.error(error);
       setMessages(prev => [...prev, {
         id: (Date.now() + 1).toString(),
         role: 'model',
         text: `Connection to my cognitive core failed: ${error.message}. Stay disciplined anyway.`
       }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-momentum-bg">
      <div className="p-6 pb-2">
        <h1 className="text-3xl font-light tracking-tight pt-2 mb-6">AI <span className="font-bold">{t('coach').split(' ')[1] || t('coach')}</span></h1>
        
        <div className="bg-momentum-surface/50 border border-momentum-accent/20 rounded-[32px] p-6 backdrop-blur-[20px] mb-4">
           <div className="bg-momentum-accent/10 text-[#60A5FA] px-3 py-1.5 rounded-full text-[12px] font-bold uppercase tracking-[1px] inline-block mb-4">{t('insight')}</div>
           <h2 className="text-[20px] font-semibold leading-[1.2] mb-3 text-white">"You're 3x more likely to finish 'Morning Workout' if you start before 8 AM."</h2>
           <p className="text-[#94A3B8] text-[14px] leading-[1.6] m-0">Based on your last 30 days of data, your evening performance drops by 40% on weekends. Try shifting your focus blocks to the morning.</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-2 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id}
              className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-momentum-surface' : 'bg-momentum-accent/20 text-momentum-accent'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-momentum-text-dim" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`py-3 px-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-momentum-accent text-white rounded-tr-sm' 
                  : 'bg-momentum-surface border border-white/5 rounded-tl-sm text-momentum-text'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          {isTyping && (
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-momentum-accent/20 text-momentum-accent flex items-center justify-center shrink-0">
                 <Bot className="w-5 h-5" />
              </div>
              <div className="py-3 px-4 rounded-2xl bg-momentum-surface border border-white/5 rounded-tl-sm flex gap-1 items-center">
                 <span className="w-2 h-2 bg-momentum-text-dim rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                 <span className="w-2 h-2 bg-momentum-text-dim rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                 <span className="w-2 h-2 bg-momentum-text-dim rounded-full animate-bounce"></span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-momentum-bg/80 backdrop-blur-lg border-t border-white/5 space-y-4">
        <AdBanner 
          className="mb-2" 
          title="Personalized Coaching" 
          description="Get 24/7 access to specialized mental models."
          icon="🧠"
          color="bg-purple-500"
        />
        <form onSubmit={sendMessage} className="relative flex items-center">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isTyping}
            placeholder={t('askAdvice')} 
            className="w-full bg-momentum-surface border border-white/10 rounded-full py-3 pl-5 pr-12 text-sm focus:outline-none focus:border-momentum-accent/50 focus:ring-1 focus:ring-momentum-accent/50 transition-all text-white placeholder:text-momentum-text-dim disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={isTyping || !input.trim()}
            className="absolute right-2 w-8 h-8 flex items-center justify-center bg-momentum-accent rounded-full text-white disabled:bg-momentum-surface disabled:text-momentum-text-dim transition-colors"
          >
            <Send className="w-4 h-4 ml-[-2px]" />
          </button>
        </form>
      </div>
    </div>
  );
}
