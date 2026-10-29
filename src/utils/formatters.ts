export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  return 'Rp ' + amount.toLocaleString('id-ID');
}

export function formatWhatsAppNumber(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1);
  }
  return cleaned;
}

export function generateWhatsAppChatUrl(phone: string, message: string): string {
  const formattedPhone = formatWhatsAppNumber(phone);
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encoded}`;
}

export interface WhatsAppOrderDetails {
  orderNumber: string;
  customerName: string;
  customerWhatsapp: string;
  shippingAddress: string;
  city: string;
  notes?: string;
  paymentMethod: string;
  items: Array<{
    name: string;
    variantName?: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
}

export function generateWhatsAppOrderMessage(details: WhatsAppOrderDetails): string {
  const itemsList = details.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.name}*${item.variantName ? ` (${item.variantName})` : ''}\n   Jumlah: ${item.quantity}x @ ${formatRupiah(item.price)} = ${formatRupiah(item.subtotal)}`
    )
    .join('\n\n');

  return (
    `*PESANAN BARU - AIISTORE99*\n` +
    `---------------------------------------\n` +
    `*No. Pesanan:* #${details.orderNumber}\n` +
    `*Tanggal:* ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}\n\n` +
    `*Data Pemesan:*\n` +
    `• Nama: ${details.customerName}\n` +
    `• WhatsApp: ${details.customerWhatsapp}\n` +
    `• Alamat: ${details.shippingAddress}\n` +
    `• Kota/Provinsi: ${details.city}\n` +
    (details.notes ? `• Catatan: ${details.notes}\n` : '') +
    `\n*Daftar Produk yang Dipesan:*\n` +
    `${itemsList}\n\n` +
    `---------------------------------------\n` +
    `Subtotal: ${formatRupiah(details.subtotal)}\n` +
    `Ongkos Kirim: ${details.shippingFee === 0 ? 'GRATIS (Promo Min. Belanja)' : formatRupiah(details.shippingFee)}\n` +
    `*TOTAL PEMBAYARAN:* *${formatRupiah(details.total)}*\n` +
    `Metode Pembayaran: *${details.paymentMethod}*\n` +
    `---------------------------------------\n` +
    `Halo Admin AiiStore99, mohon konfirmasi pesanan ini beserta nomor rekening / petunjuk pembayaran. Terima kasih!`
  );
}
