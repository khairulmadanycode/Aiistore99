import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle } from 'lucide-react';
import { generateWhatsAppChatUrl } from '../utils/formatters';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();

  const waUrl = generateWhatsAppChatUrl(
    settings?.whatsappNumber || '6281234567890',
    settings?.whatsappDefaultMessage || 'Halo AiiStore99, saya ingin konsultasi produk kecantikan dan pemesanan:'
  );

  return (
    <aside aria-label="Konsultasi WhatsApp Cepat" className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        title="Chat WhatsApp dengan Admin AiiStore99"
        aria-label="Chat WhatsApp dengan Admin AiiStore99"
      >
        <MessageCircle className="w-7 h-7 fill-white text-[#25D366]" />

        {/* Hover Pill Tooltip */}
        <span className="absolute right-16 bg-[#1A1918] text-white text-xs font-medium px-3.5 py-1.5 rounded-lg whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
          Tanya Admin AiiStore99
        </span>
      </a>
    </aside>
  );
};
