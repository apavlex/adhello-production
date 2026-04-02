import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Zap, 
  Target, 
  ShieldCheck, 
  Palette,
  Loader2,
  Building2,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SmartSiteQuizProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SmartSiteQuiz: React.FC<SmartSiteQuizProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bizName: '',
    industry: '',
    city: '',
    goal: 'Leads',
    vibe: 'Modern'
  });

  const goals = [
    { id: 'Leads', label: 'More Leads', desc: 'Phone calls & form submissions', icon: <Target className="w-5 h-5" /> },
    { id: 'Appointments', label: 'Bookings', desc: 'Automated direct scheduling', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'Sales', label: 'Direct Sales', desc: 'Selling products or services online', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'Authority', label: 'Authority', desc: 'Building brand trust & presence', icon: <Sparkles className="w-5 h-5" /> },
  ];

  const vibes = [
    { id: 'Modern', label: 'Clean & Techy', desc: 'Minimalist, fast, future-forward', color: 'bg-indigo-500' },
    { id: 'Classic', label: 'Professional', desc: 'Trustworthy, solid, high-end', color: 'bg-blue-900' },
    { id: 'Bold', label: 'High Energy', desc: 'Vibrant colors, strong typography', color: 'bg-red-500' },
    { id: 'Friendly', label: 'Warm & Local', desc: 'Approachable, community-focused', color: 'bg-emerald-500' },
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      // Save results to session storage for the strategy results page
      sessionStorage.setItem('quizData', JSON.stringify(formData));
      sessionStorage.setItem('isNoWebsiteFlow', 'true');
      
      onClose();
      navigate('/strategy-results');
    } catch (error) {
      console.error('Strategy generation failed:', error);
      alert('We hit a small snag building your strategy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/90 backdrop-blur-md"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto mb-8" />
            <h2 className="text-3xl font-black mb-4">Architecting Your ROI...</h2>
            <p className="text-lg text-brand-dark/60 font-bold max-w-xs mx-auto">
              Our AI is currently designing your strategic blueprint and conversion copy.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center p-8 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                  <Zap className="w-6 h-6 text-brand-dark" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">Smart Site Quiz</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-brand-dark/30" />
              </button>
            </div>

            <div className="p-8 md:p-12 mb-20">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-4xl font-black mb-3">Who are we building for?</h2>
                      <p className="text-lg text-brand-dark/50 font-bold">Tell us your brand basics to start the architecture.</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-brand-dark/40 mb-2 ml-2">Business Name</label>
                        <div className="relative">
                          <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                          <input 
                            autoFocus
                            type="text" 
                            placeholder="e.g. Presso Coffee"
                            value={formData.bizName}
                            onChange={e => setFormData({ ...formData, bizName: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl py-5 pl-14 pr-8 text-xl font-bold focus:border-primary focus:outline-none transition-colors shadow-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-brand-dark/40 mb-2 ml-2">Industry</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Specialty Coffee Shop, Contractor, Plumber..."
                          value={formData.industry}
                          onChange={e => setFormData({ ...formData, industry: e.target.value })}
                          className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl py-5 px-8 text-xl font-bold focus:border-primary focus:outline-none transition-colors shadow-sm"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-4xl font-black mb-3">Where is your territory?</h2>
                      <p className="text-lg text-brand-dark/50 font-bold">Location is critical for local GEO search dominance.</p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-brand-dark/40 mb-2 ml-2">Primary City / Service Area</label>
                        <div className="relative">
                          <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                          <input 
                            autoFocus
                            type="text" 
                            placeholder="e.g. Seattle, WA"
                            value={formData.city}
                            onChange={e => setFormData({ ...formData, city: e.target.value })}
                            className="w-full bg-gray-50 border-2 border-gray-100 rounded-3xl py-5 pl-14 pr-8 text-xl font-bold focus:border-primary focus:outline-none transition-colors shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-4xl font-black mb-3">What's your primary goal?</h2>
                      <p className="text-lg text-brand-dark/50 font-bold">We'll architect your site to maximize this ROI.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {goals.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setFormData({ ...formData, goal: g.id })}
                          className={`flex items-start gap-4 p-6 rounded-3xl border-2 transition-all text-left ${formData.goal === g.id ? 'bg-primary/5 border-primary shadow-lg' : 'bg-gray-50 border-gray-100 hover:border-primary/30'}`}
                        >
                          <div className={`p-3 rounded-2xl ${formData.goal === g.id ? 'bg-primary text-brand-dark' : 'bg-white text-brand-dark/30 shadow-sm'}`}>
                            {g.icon}
                          </div>
                          <div>
                            <div className="font-black text-lg">{g.label}</div>
                            <div className="text-sm font-bold text-brand-dark/50 leading-tight">{g.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-4xl font-black mb-3">Pick your visual vibe.</h2>
                      <p className="text-lg text-brand-dark/50 font-bold">This dictates your primary color palette and layout style.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {vibes.map((v) => (
                        <button
                          key={v.id}
                          onClick={() => setFormData({ ...formData, vibe: v.id })}
                          className={`group relative overflow-hidden flex flex-col items-start gap-2 p-6 rounded-3xl border-2 transition-all text-left ${formData.vibe === v.id ? 'bg-primary/5 border-primary shadow-lg scale-[1.02]' : 'bg-gray-50 border-gray-100 hover:border-primary/30'}`}
                        >
                          <div className={`w-8 h-8 rounded-full mb-2 ${v.color} ring-4 ring-white shadow-sm`} />
                          <div>
                            <div className="font-black text-lg">{v.label}</div>
                            <div className="text-sm font-bold text-brand-dark/50 leading-tight">{v.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-8 flex justify-between items-center bg-gray-50/50 backdrop-blur-sm border-t border-gray-100">
              <button
                disabled={step === 1}
                onClick={() => setStep(s => s - 1)}
                className="flex items-center gap-2 font-black uppercase text-xs tracking-widest text-brand-dark/40 hover:text-brand-dark disabled:opacity-0 transition-opacity"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4].map(s => (
                  <div key={s} className={`w-2 h-2 rounded-full transition-all duration-300 ${step === s ? 'w-8 bg-primary' : 'bg-gray-200'}`} />
                ))}
              </div>

              {step < 4 ? (
                <button
                  disabled={step === 1 && !formData.bizName}
                  onClick={() => setStep(s => s + 1)}
                  className="bg-brand-dark text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-30"
                >
                  Next Step <ArrowRight className="w-5 h-5 text-primary" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="bg-primary text-brand-dark px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-primary-hover transition-all shadow-xl"
                >
                  Build My Strategy <Sparkles className="w-5 h-5 animate-pulse" />
                </button>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};
