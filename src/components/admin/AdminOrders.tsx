import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { ShoppingBag, MessageCircle, Clock, CheckCircle2, Truck, AlertCircle, RefreshCw } from 'lucide-react';
import { formatRupiah, generateWhatsAppChatUrl } from '../../utils/formatters';

export const AdminOrders: React.FC = () => {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        setErrorMsg('Gagal memuat pesanan');
      }
    } catch {
      setErrorMsg('Gagal terhubung ke server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#1A1918]">Daftar Pesanan & Konsultasi</h2>
          <p className="text-xs text-[#736E67]">
            Pantau pesanan yang masuk melalui keranjang dan integrasi checkout WhatsApp.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="py-2 px-3.5 rounded-xl border border-[#D9D3C7] bg-white hover:bg-[#FAF8F5] text-xs font-medium text-[#1A1918] flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Segarkan Data</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
          {errorMsg}
        </div>
      )}

      {orders.length === 0 && !isLoading ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#EBE6DD]">
          <ShoppingBag className="w-10 h-10 text-[#C5A880] mx-auto mb-3" />
          <h3 className="text-base font-serif font-semibold text-[#1A1918]">Belum Ada Pesanan Masuk</h3>
          <p className="text-xs text-[#736E67] mt-1 max-w-sm mx-auto">
            Saat pelanggan melakukan checkout dan mengonfirmasi via WhatsApp, rincian pesanan akan otomatis tercatat di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const waChatUrl = generateWhatsAppChatUrl(
              order.customerWhatsapp,
              `Halo Kak ${order.customerName}, terima kasih telah memesan di AiiStore99 (No. Pesanan: #${order.orderNumber}). Kami ingin mengonfirmasi pesanan Anda.`
            );

            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-[#EBE6DD] p-5 shadow-2xs space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F2EFE9]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm font-bold text-[#1A1918]">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[11px] text-[#8C8275] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleString('id-ID', {
                        dateStyle: 'medium',
                        timeStyle: 'short'
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#736E67]">Status Pesanan:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border outline-none cursor-pointer ${
                        order.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : order.status === 'shipped'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : order.status === 'confirmed'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : order.status === 'cancelled'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-[#F2EFE9] text-[#1A1918] border-[#D9D3C7]'
                      }`}
                    >
                      <option value="pending">Menunggu Verifikasi (Pending)</option>
                      <option value="confirmed">Terkonfirmasi & Siap Packing</option>
                      <option value="shipped">Sedang Dikirim (Resi Ada)</option>
                      <option value="completed">Selesai (Sampai)</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </div>
                </div>

                {/* Customer Details & WhatsApp Button */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                  <div className="md:col-span-5 space-y-1.5 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EBE6DD]">
                    <p className="font-semibold text-[#1A1918]">{order.customerName}</p>
                    <p className="text-[#595652] leading-relaxed">{order.shippingAddress}, {order.city}</p>
                    {order.notes && (
                      <p className="text-[#8C7355] italic">Catatan: {order.notes}</p>
                    )}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="font-mono text-[#1A1918]">{order.customerWhatsapp}</span>
                      <a
                        href={waChatUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg font-medium text-[11px] transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Items List & Total */}
                  <div className="md:col-span-7 flex flex-col justify-between">
                    <div className="space-y-1.5">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs py-1 border-b border-[#F7F5F0]">
                          <span className="text-[#1A1918] font-medium">
                            {item.productName} {item.variantName ? `(${item.variantName})` : ''} x {item.quantity}
                          </span>
                          <span className="font-mono text-[#595652]">{formatRupiah(item.subtotal)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 flex items-baseline justify-between border-t border-[#EBE6DD]">
                      <div>
                        <span className="text-[11px] text-[#736E67]">Metode: </span>
                        <span className="font-semibold text-[#1A1918] text-xs">{order.paymentMethod}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-[#736E67] mr-2">Total Pesanan:</span>
                        <span className="font-mono font-bold text-base text-[#1A1918]">
                          {formatRupiah(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
