import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, User, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { db, auth } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebase/errorHandler';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(auth.currentUser?.email || '');
  const [message, setMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // WordPress style direct client validations
    if (!name.trim()) {
      setErrorMsg('The Name field is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!message.trim() || message.length < 10) {
      setErrorMsg('Your message must be at least 10 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save message directly to Firestore /contact_messages
      await addDoc(collection(db, 'contact_messages'), {
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
        userId: auth.currentUser?.uid || 'guest',
        createdAt: serverTimestamp(),
      });

      setSubmitSuccess(true);
      setName('');
      setMessage('');
    } catch (err: any) {
      console.error('Error submitting feedback message', err);
      setErrorMsg('A validation error occurred. Failed to submit message.');
      try {
        handleFirestoreError(err, OperationType.WRITE, 'contact_messages');
      } catch (firestoreError) {
        // Just logged
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Contact Support</h1>
        <p className="text-sm text-momentum-text-dim">Get in touch with Unwana Peter Otung, App Admin</p>
      </div>

      {/* WordPress-Style Theme Contact Box */}
      <div className="bg-[#121c2f] rounded-2xl border border-white/10 shadow-2xl p-6 relative overflow-hidden">
        {/* Aesthetic Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-momentum-accent"></div>

        {/* Admin Badge */}
        <div className="bg-momentum-accent/10 border border-momentum-accent/25 rounded-xl p-3.5 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-momentum-accent/20 flex items-center justify-center text-momentum-accent">
            <Mail className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-momentum-text-dim">Official App Administrator</h4>
            <p className="text-xs font-bold text-white mt-0.5">unwanaotung@gmail.com</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {submitSuccess ? (
            <motion.div 
              key="success-form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-8 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Message Received!</h3>
                <p className="text-sm text-momentum-text-dim px-4 leading-relaxed">
                  Your form has been successfully sent to Unwana Peter Otung. A reply will be forwarded to your email soon.
                </p>
              </div>
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="mt-4 px-5 py-2.5 bg-momentum-surface hover:bg-momentum-surface-light text-white font-medium text-xs rounded-xl border border-white/10 transition-colors"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <motion.form 
              key="contact-form"
              onSubmit={handleSubmit} 
              className="space-y-5"
            >
              <div className="space-y-1">
                <label className="text-xs font-semibold text-momentum-text-dim flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-momentum-accent" />
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-momentum-accent transition-colors shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-momentum-text-dim flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-momentum-accent" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  value={email}
                  disabled={!!auth.currentUser?.email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-momentum-accent transition-colors disabled:opacity-60 shadow-inner"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-momentum-text-dim flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-momentum-accent" />
                  Your Message <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your suggestions, questions, or message..."
                  required
                  className="w-full bg-[#1e293b] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-momentum-accent transition-colors resize-none shadow-inner"
                />
              </div>

              {errorMsg && (
                <div className="p-3.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-momentum-accent to-blue-600 hover:from-momentum-accent-light hover:to-blue-500 text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-momentum-accent/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Submitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Inquiry</span>
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center text-xs text-momentum-text-dim px-2">
        This form is secure. Your information is protected under modern encryption standards and is only used to address server-side feedback/support queries.
      </div>
    </motion.div>
  );
}
