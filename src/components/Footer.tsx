import React from 'react';
import { useStore } from '../context/StoreContext';
import { Instagram, MessageCircle, Mail, MapPin, Clock } from 'lucide-react';
import { generateWhatsAppChatUrl } from '../utils/formatters';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenAdmin }) => {
  const { settings, setActiveCategory } = useStore();

  const waUrl = generateWhatsAppChatUrl(
    settings?.whatsappNumber || '6281234567890',
    'Halo AiiStore99, saya ingin bertanya seputar produk dan informasi pengiriman.'
  );

  return (
    <footer id="contact" className="bg-[#1A1918] text-[#F7F5F0] pt-16 pb-12 border-t border-[#2D2A27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#2D2A27]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                onNavigateSection('hero');
              }}
              className="text-2xl sm:text-3xl font-serif tracking-tight text-white inline-block"
            >
              AiiStore99<span className="text-[#C5A880]">.</span>
            </a>
            <p className="text-xs text-[#A8A49C] leading-relaxed max-w-sm">
              Toko online premium untuk gaya hidup elegan. Menghadirkan kurasi Skincare, Kosmetik, Aksesoris, dan Busana berkualitas tinggi untuk melengkapi pesona harian Anda.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings?.instagramUrl || 'https://www.instagram.com/aiistore99'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#2A2724] hover:bg-[#C5A880] hover:text-[#1A1918] transition-colors flex items-center justify-center text-[#E0DBCF]"
                title="Instagram @aiistore99"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#2A2724] hover:bg-[#25D366] hover:text-white transition-colors flex items-center justify-center text-[#E0DBCF]"
                title="WhatsApp Resmi AiiStore99"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
              Kategori
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A49C]">
              <li>
                <button
                  onClick={() => { setActiveCategory('skincare'); onNavigateSection('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Skincare Esensial
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory('cosmetics'); onNavigateSection('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Kosmetik & Lipstik
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory('accessories'); onNavigateSection('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Aksesoris Emas 18K
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCategory('fashion'); onNavigateSection('shop'); }}
                  className="hover:text-white transition-colors"
                >
                  Busana Linen & Fashion
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
              Bantuan
            </h4>
            <ul className="space-y-2 text-xs text-[#A8A49C]">
              <li>
                <button onClick={() => onNavigateSection('about')} className="hover:text-white transition-colors">
                  Tentang AiiStore99
                </button>
              </li>
              <li>
                <button onClick={() => onNavigateSection('about')} className="hover:text-white transition-colors">
                  Tanya Jawab (FAQ)
                </button>
              </li>
              <li>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Konsultasi Pemesanan
                </a>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-[#C5A880] hover:underline transition-colors flex items-center gap-1">
                  Portal Admin
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
              Kontak & Operasional
            </h4>
            <ul className="space-y-2.5 text-xs text-[#A8A49C]">
              <li className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                <span>{settings?.operationalHours || 'Senin - Sabtu: 09:00 - 20:00 WIB'}</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                <span>{settings?.address || 'Jakarta & Surabaya, Indonesia'}</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                <span>{settings?.email || 'hello@aiistore99.com'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#736E67]">
          <p>© {new Date().getFullYear()} AiiStore99. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-6">
            <span>Privasi & Keamanan Terjaga</span>
            <span aria-hidden="true">·</span>
            <span>Estetika Terinspirasi @aiistore99</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
