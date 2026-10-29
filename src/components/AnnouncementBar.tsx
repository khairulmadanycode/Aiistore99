import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle, X } from 'lucide-react';
import { generateWhatsAppChatUrl } from '../utils/formatters';

export const AnnouncementBar: React.FC = () => {
  const { settings } = useStore();
  const [isDismissed, setIsDismissed] = useState(false);

  if (!settings || !settings.isAnnouncementBarActive || isDismissed) {
    return null;
  }

  const waUrl = generateWhatsAppChatUrl(
    settings.whatsappNumber,
    'Halo AiiStore99, saya ingin menanyakan promo dan konsultasi produk kecantikan.'
  );

  return (
    <aside aria-label="Pengumuman Toko" className="bg-[#1A1918] text-[#F7F5F0] text-xs py-2 px-4 border-b border-[#2A2826] relative z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="w-6 shrink-0 hidden sm:block"></div>
        <div className="flex-1 text-center font-normal tracking-wide flex items-center justify-center gap-2">
          <span>{settings.announcementBarText}</span>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-[#C5A880] hover:text-[#E2CBB0] underline underline-offset-2 transition-colors ml-1 whitespace-nowrap"
          >
            <MessageCircle className="w-3 h-3" />
            <span>Chat WhatsApp</span>
          </a>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-[#9E9B95] hover:text-white transition-colors p-1 shrink-0"
          title="Tutup pengumuman"
          aria-label="Tutup pengumuman"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
