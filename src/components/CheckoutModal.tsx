import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, MessageCircle, CheckCircle, ShieldCheck, CreditCard, Copy, ArrowRight, ExternalLink } from 'lucide-react';
import {
  formatRupiah,
  generateWhatsAppChatUrl,
  generateWhatsAppOrderMessage,
  WhatsAppOrderDetails
} from '../utils/formatters';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { cart, cartSubtotal, settings, clearCart, refreshData } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerWhatsapp, setCustomerWhatsapp] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [city, setCity] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<string>('bca');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const threshold = settings?.freeShippingThreshold || 250000;
  const isFreeShipping = cartSubtotal >= threshold;
  const shippingFee = isFreeShipping ? 0 : 20000;
  const grandTotal = cartSubtotal + shippingFee;

  const paymentMethods = settings?.paymentMethods?.filter((m) => m.isActive) || [
    { id: 'bca', name: 'Transfer Bank BCA', description: 'Manual transfer', accountNumber: '8830 1928 99', accountName: 'AiiStore99', isActive: true },
    { id: 'mandiri', name: 'Transfer Bank Mandiri', description: 'Manual transfer', accountNumber: '1420 0192 8899', accountName: 'AiiStore99', isActive: true },
    { id: 'qris', name: 'QRIS', description: 'Scan QRIS', accountNumber: '', accountName: 'AiiStore99', isActive: true },
    { id: 'cod', name: 'Cash On Delivery (COD)', description: 'Bayar saat tiba', accountNumber: '', accountName: '', isActive: true }
  ];

  const currentMethod = paymentMethods.find((p) => p.id === selectedPayment) || paymentMethods[0];

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerWhatsapp.trim() || !shippingAddress.trim()) {
      setErrorMsg('Mohon lengkapi Nama, WhatsApp, dan Alamat Pengiriman.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const orderItems = cart.map((item) => {
        const itemPrice = item.product.price + (item.selectedVariant?.priceDelta || 0);
        return {
          productId: item.productId,
          productName: item.product.name,
          variantName: item.selectedVariant?.name || '',
          price: itemPrice,
          quantity: item.quantity,
          subtotal: itemPrice * item.quantity,
          image: item.product.primaryImage
        };
      });

      const payload = {
        customerName,
        customerWhatsapp,
        shippingAddress,
        city: city || 'Indonesia',
        notes,
        paymentMethod: currentMethod.name,
        items: orderItems,
        subtotal: cartSubtotal,
        shippingFee,
        total: grandTotal
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal membuat pesanan');
      }

      const createdOrder = await res.json();
      setCompletedOrder(createdOrder);

      // Prepare WhatsApp message
      const waDetails: WhatsAppOrderDetails = {
        orderNumber: createdOrder.orderNumber,
        customerName,
        customerWhatsapp,
        shippingAddress,
        city: city || 'Indonesia',
        notes,
        paymentMethod: currentMethod.name,
        items: orderItems.map((i) => ({
          name: i.productName,
          variantName: i.variantName,
          quantity: i.quantity,
          price: i.price,
          subtotal: i.subtotal
        })),
        subtotal: cartSubtotal,
        shippingFee,
        total: grandTotal
      };

      const waMsg = generateWhatsAppOrderMessage(waDetails);
      const waUrl = generateWhatsAppChatUrl(settings?.whatsappNumber || '6281234567890', waMsg);

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');

      // Clear cart & refresh store product inventory
      clearCart();
      refreshData();
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMsg(err.message || 'Terjadi gangguan saat memproses pesanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyOrderSummary = () => {
    if (!completedOrder) return;
    const itemsText = completedOrder.items
      .map((i: any) => `${i.productName} (${i.quantity}x)`)
      .join(', ');
    const text = `Pesanan #${completedOrder.orderNumber} di AiiStore99: ${itemsText}. Total ${formatRupiah(completedOrder.total)}.`;
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-[#FAFAF7] rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8E2D5] z-10 flex flex-col p-6 sm:p-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#EBE6DD]">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-[#8C8275] font-medium">Checkout Pemesanan</span>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-[#1A1918]">
              {completedOrder ? 'Pesanan Terkonfirmasi!' : 'Formulir Pemesanan & Alamat'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F2EFE9] text-[#736E67] hover:text-[#1A1918] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Confirmed Screen */}
        {completedOrder ? (
          <div className="py-8 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <p className="text-sm text-[#736E67]">Nomor Pesanan Anda:</p>
              <p className="text-2xl font-mono font-bold text-[#1A1918]">#{completedOrder.orderNumber}</p>
              <p className="text-xs text-[#8C8275]">
                {new Date(completedOrder.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
              </p>
            </div>

            <div className="bg-white rounded-xl p-5 border border-[#EBE6DD] text-left space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#F2EFE9] pb-2">
                <span className="text-[#736E67]">Pemesan:</span>
                <span className="font-semibold text-[#1A1918]">{completedOrder.customerName} ({completedOrder.customerWhatsapp})</span>
              </div>
              <div className="flex justify-between border-b border-[#F2EFE9] pb-2">
                <span className="text-[#736E67]">Alamat Kirim:</span>
                <span className="font-medium text-[#1A1918] text-right max-w-xs">{completedOrder.shippingAddress}, {completedOrder.city}</span>
              </div>
              <div className="flex justify-between border-b border-[#F2EFE9] pb-2">
                <span className="text-[#736E67]">Metode Pembayaran:</span>
                <span className="font-semibold text-[#1A1918]">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between pt-1 text-sm font-bold text-[#1A1918]">
                <span>Total Pesanan:</span>
                <span className="font-mono">{formatRupiah(completedOrder.total)}</span>
              </div>
            </div>

            <div className="bg-[#F2EFE9] p-4 rounded-xl text-left text-xs text-[#595652] space-y-1.5 border border-[#E0DBCF]">
              <p className="font-semibold text-[#1A1918] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#8C7355]" />
                <span>Petunjuk Pembayaran Manual:</span>
              </p>
              <p>
                Rincian pesanan telah dialihkan ke obrolan WhatsApp admin AiiStore99. Admin kami akan segera memverifikasi ketersediaan paket, mengonfirmasi transfer pembayaran, dan membagikan resi pengiriman setelah diproses.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={handleCopyOrderSummary}
                className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl border border-[#D9D3C7] bg-white hover:bg-[#F2EFE9] text-xs font-medium text-[#1A1918] flex items-center justify-center gap-2 transition-colors"
              >
                <Copy className="w-4 h-4 text-[#8C7355]" />
                <span>{copiedText ? 'Tersalin ke Clipboard!' : 'Salin Ringkasan Pesanan'}</span>
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto flex-1 py-3 px-6 rounded-xl bg-[#1A1918] text-white hover:bg-[#2C2A28] text-xs font-medium tracking-wide transition-colors"
              >
                Selesai & Lanjut Belanja
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmitOrder} className="py-6 space-y-6">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {errorMsg}
              </div>
            )}

            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-[#1A1918] uppercase tracking-wider">
                1. Data Penerima Paket
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#595652] mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Sisca Amelia"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D3C7] bg-white text-xs text-[#1A1918] placeholder-[#9E9B95] outline-none focus:border-[#1A1918]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#595652] mb-1">
                    Nomor WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={customerWhatsapp}
                    onChange={(e) => setCustomerWhatsapp(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D3C7] bg-white text-xs text-[#1A1918] placeholder-[#9E9B95] outline-none focus:border-[#1A1918]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#595652] mb-1">
                  Alamat Lengkap (Jalan, No. Rumah, RT/RW, Kecamatan) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Jl. Senopati No. 12, Kebayoran Baru"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D3C7] bg-white text-xs text-[#1A1918] placeholder-[#9E9B95] outline-none focus:border-[#1A1918]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#595652] mb-1">
                    Kota / Kabupaten & Kode Pos
                  </label>
                  <input
                    type="text"
                    placeholder="Jakarta Selatan, 12190"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D3C7] bg-white text-xs text-[#1A1918] placeholder-[#9E9B95] outline-none focus:border-[#1A1918]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#595652] mb-1">
                    Catatan Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Titipkan pada satpam / warna cadangan"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#D9D3C7] bg-white text-xs text-[#1A1918] placeholder-[#9E9B95] outline-none focus:border-[#1A1918]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3 pt-3 border-t border-[#EBE6DD]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-[#1A1918] uppercase tracking-wider">
                  2. Metode Pembayaran (Verifikasi Manual)
                </h3>
                <span className="text-[11px] text-[#8C8275]">Bebas Biaya Layanan</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      selectedPayment === method.id
                        ? 'border-[#1A1918] bg-white shadow-xs ring-1 ring-[#1A1918]'
                        : 'border-[#E0DBCF] bg-white/70 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                      className="mt-0.5 text-[#1A1918] focus:ring-0"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-[#1A1918]">{method.name}</p>
                      <p className="text-[11px] text-[#736E67] mt-0.5">{method.description}</p>
                      {method.accountNumber && (
                        <p className="font-mono text-[11px] text-[#8C7355] mt-1 font-medium">
                          No. Rek: {method.accountNumber} ({method.accountName})
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Order Summary Box */}
            <div className="bg-white rounded-xl p-4 border border-[#E8E2D5] space-y-2 text-xs">
              <div className="flex justify-between text-[#736E67]">
                <span>Total Harga ({cart.length} barang):</span>
                <span className="font-mono text-[#1A1918]">{formatRupiah(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#736E67]">
                <span>Ongkos Kirim:</span>
                <span className="font-mono text-[#1A1918]">
                  {isFreeShipping ? (
                    <span className="text-emerald-700 font-medium">GRATIS (Promo Min. Belanja)</span>
                  ) : (
                    formatRupiah(shippingFee)
                  )}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#F2EFE9] text-sm font-bold text-[#1A1918]">
                <span>Total Pembayaran:</span>
                <span className="font-mono text-base">{formatRupiah(grandTotal)}</span>
              </div>
            </div>

            {/* Trust disclaimer */}
            <div className="p-3.5 rounded-xl bg-[#F2EFE9] border border-[#E0DBCF] text-[11px] text-[#595652] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#8C7355] shrink-0 mt-0.5" />
              <p>
                AiiStore99 menggunakan alur checkout WhatsApp terpadu. Data pesanan Anda tersimpan aman di server kami dan dikirimkan otomatis ke WhatsApp admin untuk verifikasi pembayaran dan pengiriman cepat.
              </p>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full py-4 px-6 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] disabled:opacity-50 text-white font-medium text-sm tracking-wide flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition-all"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>
                  {isSubmitting
                    ? 'Menyiapkan Pesanan...'
                    : `Pesan via WhatsApp (${formatRupiah(grandTotal)})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
