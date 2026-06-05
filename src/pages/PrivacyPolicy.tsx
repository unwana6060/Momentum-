import React from 'react';
import { motion } from 'motion/react';
import { Shield, Eye, Lock, RefreshCw, FileText } from 'lucide-react';

export default function PrivacyPolicy() {
  const lastUpdated = "June 2026";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 text-sm"
    >
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl font-bold tracking-tight text-white">Privacy Policy</h1>
        <p className="text-sm text-momentum-text-dim">Last updated: {lastUpdated}</p>
      </div>

      <div className="bg-momentum-surface/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-momentum-accent font-semibold text-base">
          <Shield className="w-5 h-5" />
          <span>Introduction</span>
        </div>
        <p className="text-momentum-text-dim leading-relaxed">
          At Momentum Daily Habit Tracker ("we", "our", or "Momentum"), we take your privacy extremely seriously. 
          This Privacy Policy describes how we collect, use, process, and disclose your information when you use our web application. 
          By using our application, you agree to the collection and use of information in accordance with this policy.
        </p>
      </div>

      <div className="bg-momentum-surface/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-momentum-accent font-semibold text-base">
          <Eye className="w-5 h-5" />
          <span>Information We Collect</span>
        </div>
        <div className="space-y-3 text-momentum-text-dim leading-relaxed">
          <p>
            We process data to provide a seamless, synchronized habit tracking dashboard. Here is how we collect and secure your information:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>
              <strong className="text-white">Account Information:</strong> When you register using Google Login or Email, we store your profile email, name, and profile picture URL inside Google Firebase Authentication safely.
            </li>
            <li>
              <strong className="text-white">Application Habit Data:</strong> Any habits, current/longest streaks, completions, and performance statistics you record are secured directly within Google Cloud Firestore and cannot be read by other users.
            </li>
            <li>
              <strong className="text-white">User Inquiries:</strong> Any support questions, messages, and contact details you enter into our Support Form are stored in Firestore for admin reply.
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-momentum-surface/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-momentum-accent font-semibold text-base">
          <Lock className="w-5 h-5" />
          <span>Cookies and Advertising (AdSense Compliance)</span>
        </div>
        <div className="space-y-3 text-momentum-text-dim leading-relaxed">
          <p>
            Momentum utilizes standard browser cookies to track session states and keep you logged in. 
            We comply with Google AdSense terms and policies regarding cookies:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>
              <strong className="text-white">Third-Party Cookies:</strong> Google and other third-party vendors may use cookies to serve ads based on your prior visits to our webpage or other online platform services.
            </li>
            <li>
              <strong className="text-white">DART Cookies:</strong> Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our sites and/or other sites on the Internet.
            </li>
            <li>
              <strong className="text-white">How to Opt Out:</strong> You may opt-out of personalized advertising by visiting your browser's cookie preferences or by navigating directly to <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-momentum-accent hover:underline">Google Ads Settings</a>.
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-momentum-surface/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-momentum-accent font-semibold text-base">
          <RefreshCw className="w-5 h-5" />
          <span>Data Erasure Rights &amp; Security</span>
        </div>
        <p className="text-momentum-text-dim leading-relaxed">
          We use state-of-the-art security rules on Firestore to prevent unauthorized access. If you wish to delete your history, account, or any support records from our database, please reach out directly via our Contact form or via email. We will process data erasure requests within 48 business hours.
        </p>
      </div>

      <div className="bg-momentum-surface/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 space-y-2">
        <div className="flex items-center gap-2 text-momentum-accent font-semibold text-base">
          <FileText className="w-5 h-5" />
          <span>Contact Privacy Admin</span>
        </div>
        <p className="text-momentum-text-dim leading-relaxed">
          If you have any questions or feedback regarding our privacy standards, you can contact the Chief Administrator, Unwana Peter Otung, at <span className="text-white font-medium">unwanaotung@gmail.com</span>.
        </p>
      </div>
    </motion.div>
  );
}
