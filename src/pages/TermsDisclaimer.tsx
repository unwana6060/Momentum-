import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Scale, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function TermsDisclaimer() {
  const termsDate = "June 2026";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 text-sm"
    >
      <div className="text-center space-y-2 py-4">
        <h1 className="text-3xl font-bold tracking-tight text-white font-sans">Terms &amp; Disclaimers</h1>
        <p className="text-sm text-momentum-text-dim">Effective date: {termsDate}</p>
      </div>

      {/* Terms of Service Section */}
      <div className="bg-momentum-surface/40 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-momentum-accent font-semibold text-base">
          <Scale className="w-5 h-5" />
          <span>1. Terms of Service</span>
        </div>
        <div className="space-y-3 text-momentum-text-dim leading-relaxed">
          <p>
            By accessing and utilizing the Momentum Daily Habit Tracker application, you accept and agree to follow these guidelines:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li>
              <strong className="text-white">Fair Usage:</strong> You agree to utilize Momentum solely for productive, legitimate self-improvement habits. Scripted, automated, or abusive API triggers of our Firestore servers are strictly forbidden.
            </li>
            <li>
              <strong className="text-white">Account Safety:</strong> You are responsible for keeping your login credentials confidential. If you detect unauthorized activity, please contact unwanaotung@gmail.com instantly.
            </li>
            <li>
              <strong className="text-white">Account Revocation:</strong> We reserve the right to suspend or remove accounts that breach integrity standards, spam the support systems, or interfere with other users' database indices.
            </li>
          </ul>
        </div>
      </div>

      {/* Disclaimer of Warranty Section */}
      <div className="bg-momentum-surface/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-momentum-accent font-semibold text-base">
          <ShieldAlert className="w-5 h-5" />
          <span>2. Disclaimer of Warranties</span>
        </div>
        <p className="text-momentum-text-dim leading-relaxed">
          THE APPLICATION AND RELATED UTILITIES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY EXPRESS OR IMPLIED WARRANT OF ANY KIND. 
          Unwana Peter Otung makes no warranties regarding the absolute correctness of streak calculations, continuous database uptime, or automated AI generation outputs from our coach model. 
          Your usage of the application and adherence to the daily habit guidelines remains at your sole discretion and personal risk.
        </p>
      </div>

      {/* AdSense Disclaimer Section */}
      <div className="bg-momentum-surface/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-momentum-accent font-semibold text-base">
          <AlertCircle className="w-5 h-5" />
          <span>3. Advertising &amp; Sponsor Disclaimer</span>
        </div>
        <p className="text-momentum-text-dim leading-relaxed">
          Momentum may partner with Google AdSense and third-party advertising vendors to display contextual or video advertisements. 
          We do not endorse the services, products, or opinions presented in third-party advertisements. 
          Any transactions or click-through actions made between you and subsequent advertisers remain strictly your responsibility.
        </p>
      </div>

      {/* Age Limitation / Content Policy Section */}
      <div className="bg-momentum-surface/30 backdrop-blur-md rounded-2xl p-6 border border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-momentum-accent font-semibold text-base">
          <CheckCircle2 className="w-5 h-5" />
          <span>4. Age Requirements &amp; Eligibility</span>
        </div>
        <p className="text-momentum-text-dim leading-relaxed">
          Momentum is fully designed to comply with Google safety guidelines. You must be at least 13 years old (or the legal age of consent in your territory) to set up an account and synchronize your data with Firestore.
        </p>
      </div>
    </motion.div>
  );
}
