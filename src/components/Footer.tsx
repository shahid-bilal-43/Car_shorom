import React, { useState } from 'react';
import { BusinessSettings } from '../types';
import { Shield, MapPin, Phone, Mail, Clock, X } from 'lucide-react';

interface FooterProps {
  businessSettings: BusinessSettings;
  onNavigateAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  businessSettings,
  onNavigateAdmin,
  isAdminLoggedIn,
}) => {
  const [modalContent, setModalContent] = useState<'privacy' | 'terms' | null>(null);

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Showroom Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-slate-900 border border-[#C6A15B] flex items-center justify-center">
                <span className="font-extrabold text-[#C6A15B] text-xs">LM</span>
              </div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">LEGHARI MOTORS</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              3D luxury automotive showroom located on Indus Highway, Dera Ghazi Khan, Punjab, Pakistan. Managed by {businessSettings.ownerName}.
            </p>
            <div className="pt-1 text-[11px] text-slate-500 font-semibold">
              Showroom Currency: Pakistani Rupees (Rs. / PKR)
            </div>
          </div>

          {/* Col 2: Showroom Location */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Showroom Location</h4>
            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#9F7E3B] shrink-0 mt-0.5" />
                <span>{businessSettings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#9F7E3B] shrink-0" />
                <span>{businessSettings.businessHours}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Direct Contacts</h4>
            <div className="space-y-2 text-xs text-slate-600 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#9F7E3B] shrink-0" />
                <a href={`tel:${businessSettings.phone}`} className="hover:text-black font-semibold">
                  {businessSettings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#9F7E3B] shrink-0" />
                <a href={`mailto:${businessSettings.email}`} className="hover:text-black font-semibold">
                  {businessSettings.email}
                </a>
              </div>
              <div className="pt-1 flex items-center gap-3 font-semibold text-slate-600">
                <a
                  href={businessSettings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#9F7E3B] transition-colors"
                >
                  Facebook
                </a>
                <span>·</span>
                <a
                  href={businessSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#9F7E3B] transition-colors"
                >
                  Instagram
                </a>
                <span>·</span>
                <a
                  href={businessSettings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#9F7E3B] transition-colors"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Legal & Quiet Admin Portal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Information</h4>
            <ul className="space-y-2 font-medium">
              <li>
                <button
                  onClick={() => setModalContent('privacy')}
                  className="hover:text-[#9F7E3B] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setModalContent('terms')}
                  className="hover:text-[#9F7E3B] transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onNavigateAdmin}
                  className="text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1.5 text-[11px]"
                >
                  <Shield className="w-3 h-3" />
                  <span>{isAdminLoggedIn ? 'Owner Dashboard (Active)' : 'Staff / Owner Portal'}</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-medium">
          <div>
            © {new Date().getFullYear()} Leghari Motors. All rights reserved. Dera Ghazi Khan, Punjab, Pakistan.
          </div>
          <div>
            Showroom Owner: <span className="text-slate-900 font-bold">{businessSettings.ownerName}</span>
          </div>
        </div>
      </div>

      {/* Legal Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-slate-900">
                {modalContent === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
              </h3>
              <button
                onClick={() => setModalContent(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 leading-relaxed space-y-2 max-h-60 overflow-y-auto pr-2 font-medium">
              {modalContent === 'privacy' ? (
                <>
                  <p>Leghari Motors respects customer privacy for inquiries made within Dera Ghazi Khan and throughout Pakistan.</p>
                  <p>Customer contact details collected for test drives or biometric vehicle transfer verification are maintained confidentially in accordance with Pakistani automotive commerce practices.</p>
                </>
              ) : (
                <>
                  <p>All vehicles displayed on Leghari Motors are subject to prior sale, reservation, or physical deal confirmation in our showroom.</p>
                  <p>Asking prices are listed in Pakistani Rupees (PKR) and are subject to final agreement at Indus Highway, Dera Ghazi Khan, Punjab.</p>
                </>
              )}
            </div>
            <div className="pt-2 text-right">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
