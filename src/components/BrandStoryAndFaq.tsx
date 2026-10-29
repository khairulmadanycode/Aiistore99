import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronDown, ShieldCheck, HeartHandshake, Package, Truck, CreditCard } from 'lucide-react';

export const BrandStoryAndFaq: React.FC = () => {
  const { settings } = useStore();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara melakukan pemesanan di AiiStore99?',
      a: 'Pilih produk favorit Anda, masukkan ke dalam keranjang, lalu klik "Lanjut ke Checkout". Isi formulir alamat pengiriman dan pilih metode pembayaran. Sistem kami akan otomatis membuat ringkasan pesanan dan menghubungkan Anda langsung ke WhatsApp admin resmi untuk konfirmasi dan proses pengiriman.'
    },
    {
      q: 'Metode pembayaran apa saja yang didukung?',
      a: 'Kami menerima pembayaran melalui Transfer Bank BCA, Bank Mandiri, QRIS (mendukung GoPay, OVO, ShopeePay, DANA), serta Cash on Delivery (COD) khusus untuk area tertentu.'
    },
    {
      q: 'Berapa lama estimasi pengiriman pesanan?',
      a: 'Pesanan yang telah dikonfirmasi dan diverifikasi sebelum pukul 15.00 WIB akan dikirim pada hari yang sama. Estimasi tiba berkisar antara 1 - 3 hari kerja tergantung kota tujuan Anda (menggunakan ekspedisi JNE, J&T, atau SiCepat).'
    },
    {
      q: 'Apakah bisa konsultasi sebelum membeli?',
      a: 'Tentu saja! Anda bisa menekan tombol WhatsApp kapan saja untuk berkonsultasi mengenai shade lipstik yang cocok, panduan ukuran pakaian, maupun kecocokan jenis skincare untuk kondisi kulit Anda.'
    },
    {
      q: 'Bagaimana jaminan keamanan dan pengemasan produk?',
      a: 'Setiap paket dilapisi bubble wrap tebal dan kotak kemasan kokoh untuk memastikan produk sampai dalam kondisi sempurna tanpa risiko tumpah atau rusak.'
    }
  ];

  return (
    <section id="about" className="py-16 bg-[#F7F5F0] border-t border-[#EBE6DD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Brand Story Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C8275] font-medium">Filosofi Brand</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-[#1A1918] leading-tight">
              Kurasi Kecantikan & Gaya Harian yang Abadi
            </h2>
            <p className="text-sm text-[#595652] leading-relaxed">
              Terinspirasi dari keanggunan gaya hidup modern, AiiStore99 hadir untuk menyederhanakan cara Anda menemukan produk kecantikan dan pakaian esensial. Setiap item kami pilih dengan standar mutu tinggi, mengedepankan sentuhan estetika minimalis, kenyamanan, dan keanggunan alami.
            </p>
            <p className="text-sm text-[#595652] leading-relaxed">
              Kami percaya bahwa kecantikan sejati terpancar saat Anda merasa nyaman dengan diri sendiri. Dari perawatan kulit yang menghidrasi hingga aksesoris champagne gold yang melengkapi busana harian Anda, AiiStore99 adalah sahabat gaya Anda.
            </p>

            <div className="pt-2 flex items-center gap-6 text-xs text-[#736E67]">
              <div>
                <p className="font-serif text-xl font-bold text-[#1A1918]">100%</p>
                <p className="text-[11px] text-[#8C8275]">Terkurasi Manual</p>
              </div>
              <div className="w-[1px] h-8 bg-[#D9D3C7]" />
              <div>
                <p className="font-serif text-xl font-bold text-[#1A1918]">Fast</p>
                <p className="text-[11px] text-[#8C8275]">Respon Konsultasi</p>
              </div>
              <div className="w-[1px] h-8 bg-[#D9D3C7]" />
              <div>
                <p className="font-serif text-xl font-bold text-[#1A1918]">Aman</p>
                <p className="text-[11px] text-[#8C8275]">Kemasan Berlapis</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E8E2D5] shadow-xs space-y-6">
              <h3 className="text-base font-serif font-semibold text-[#1A1918]">
                Layanan & Standar Toko AiiStore99
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] space-y-1">
                  <Package className="w-5 h-5 text-[#8C7355] mb-2" />
                  <p className="text-xs font-semibold text-[#1A1918]">Kemasan Eksklusif</p>
                  <p className="text-[11px] text-[#736E67]">Setiap produk dikemas estetik dan terlindung optimal.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] space-y-1">
                  <Truck className="w-5 h-5 text-[#8C7355] mb-2" />
                  <p className="text-xs font-semibold text-[#1A1918]">Pengiriman Seluruh RI</p>
                  <p className="text-[11px] text-[#736E67]">Jangkauan luas dari Sabang hingga Merauke.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] space-y-1">
                  <CreditCard className="w-5 h-5 text-[#8C7355] mb-2" />
                  <p className="text-xs font-semibold text-[#1A1918]">Banyak Opsi Bayar</p>
                  <p className="text-[11px] text-[#736E67]">BCA, Mandiri, QRIS fleksibel, dan COD.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE6DD] space-y-1">
                  <HeartHandshake className="w-5 h-5 text-[#8C7355] mb-2" />
                  <p className="text-xs font-semibold text-[#1A1918]">Konsultasi Hangat</p>
                  <p className="text-[11px] text-[#736E67]">Admin siap merekomendasikan produk terbaik.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-8 border-t border-[#E8E2D5]">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C8275] font-medium">Bantuan & Informasi</span>
            <h3 className="text-2xl sm:text-3xl font-serif font-medium text-[#1A1918] mt-1">
              Pertanyaan yang Sering Diajukan
            </h3>
          </div>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-[#EBE6DD] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-medium text-xs sm:text-sm text-[#1A1918] hover:text-[#8C7355] transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8C7355] shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-[#595652] leading-relaxed border-t border-[#F7F5F0] pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
