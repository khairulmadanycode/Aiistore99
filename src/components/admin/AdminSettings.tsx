import React, { useState, useEffect } from 'react';
import { StoreSettings, PaymentMethodConfig } from '../../types/store';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  Save,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Phone,
  Store,
  CreditCard,
  Cloud,
  Lock
} from 'lucide-react';

interface AdminSettingsProps {
  onRefresh: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ onRefresh }) => {
  const { token, changePassword } = useAdminAuth();

  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Reset confirmation
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => setToastMsg(null), 3500);
  };

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch {
      showToast('Gagal memuat pengaturan', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (res.ok) {
        showToast('Pengaturan toko berhasil diperbarui.');
        onRefresh();
      } else {
        const d = await res.json();
        showToast(d.error || 'Gagal menyimpan pengaturan', 'error');
      }
    } catch {
      showToast('Terjadi kesalahan koneksi', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    const res = await changePassword(currentPassword, newPassword);
    if (res.success) {
      setPasswordMsg({ text: 'Password admin berhasil diganti.', isError: false });
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setPasswordMsg({ text: res.error || 'Gagal mengganti password.', isError: true });
    }
  };

  const handleResetDemoData = async () => {
    try {
      const res = await fetch('/api/database/reset', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showToast('Data demo berhasil di-reset ke kondisi awal.');
        setShowResetConfirm(false);
        fetchSettings();
        onRefresh();
      }
    } catch {
      showToast('Gagal mereset data', 'error');
    }
  };

  const updatePaymentMethod = (index: number, field: keyof PaymentMethodConfig, val: any) => {
    if (!settings) return;
    const updated = [...settings.paymentMethods];
    updated[index] = { ...updated[index], [field]: val };
    setSettings({ ...settings, paymentMethods: updated });
  };

  if (isLoading || !settings) {
    return (
      <div className="py-12 text-center text-xs text-[#736E67]">
        Memuat konfigurasi toko...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Toast */}
      {toastMsg && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 shadow-lg ${
            toastMsg.type === 'success'
              ? 'bg-[#1A1918] text-[#FAFAF7] border border-[#C5A880]/30'
              : 'bg-rose-600 text-white'
          }`}
        >
          <CheckCircle className="w-4 h-4 text-[#C5A880]" />
          <span>{toastMsg.text}</span>
        </div>
      )}

      <div>
        <h2 className="text-xl font-serif font-bold text-[#1A1918]">Pengaturan & Identitas Toko</h2>
        <p className="text-xs text-[#736E67]">
          Kelola teks pengumuman, hero banner, nomor WhatsApp, rekening pembayaran, dan integrasi eksternal.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Section 1: Announcement & Hero */}
        <div className="bg-white p-6 rounded-2xl border border-[#EBE6DD] space-y-4 shadow-2xs">
          <h3 className="text-sm font-serif font-bold text-[#1A1918] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#C5A880]" />
            <span>Announcement Bar & Headline Tampilan</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="toggle-announcement"
                checked={settings.isAnnouncementBarActive}
                onChange={(e) =>
                  setSettings({ ...settings, isAnnouncementBarActive: e.target.checked })
                }
                className="w-4 h-4 rounded text-[#1A1918]"
              />
              <label htmlFor="toggle-announcement" className="font-semibold text-[#1A1918]">
                Aktifkan Announcement Bar (Banner Tipis Paling Atas)
              </label>
            </div>

            <div>
              <label className="block text-[#595652] font-medium mb-1">
                Teks Pengumuman Promo / Info Pengiriman
              </label>
              <input
                type="text"
                value={settings.announcementBarText}
                onChange={(e) =>
                  setSettings({ ...settings, announcementBarText: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs outline-none focus:border-[#1A1918]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#595652] font-medium mb-1">
                  Headline Hero Section
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs outline-none focus:border-[#1A1918]"
                />
              </div>

              <div>
                <label className="block text-[#595652] font-medium mb-1">
                  Kicker / Badge Kapsul Hero
                </label>
                <input
                  type="text"
                  value={settings.heroBadgeText}
                  onChange={(e) => setSettings({ ...settings, heroBadgeText: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs outline-none focus:border-[#1A1918]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#595652] font-medium mb-1">
                Subheadline Hero Section
              </label>
              <textarea
                rows={2}
                value={settings.subheadline}
                onChange={(e) => setSettings({ ...settings, subheadline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs outline-none focus:border-[#1A1918]"
              />
            </div>

            <div>
              <label className="block text-[#595652] font-medium mb-1">
                URL Gambar Hero Banner
              </label>
              <input
                type="text"
                value={settings.heroImage}
                onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs font-mono text-[11px] outline-none focus:border-[#1A1918]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: WhatsApp & Store Contact */}
        <div className="bg-white p-6 rounded-2xl border border-[#EBE6DD] space-y-4 shadow-2xs">
          <h3 className="text-sm font-serif font-bold text-[#1A1918] flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#25D366]" />
            <span>Integrasi Nomor WhatsApp & Kontak Toko</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-[#595652] font-medium mb-1">
                Nomor WhatsApp Admin (Format Internasional: 628...)
              </label>
              <input
                type="text"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs font-mono outline-none focus:border-[#1A1918]"
              />
            </div>

            <div>
              <label className="block text-[#595652] font-medium mb-1">
                Ambang Batas Bebas Ongkir (Rp)
              </label>
              <input
                type="number"
                step="10000"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs font-mono outline-none focus:border-[#1A1918]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[#595652] font-medium mb-1">
                Pesan WhatsApp Pembuka Default
              </label>
              <input
                type="text"
                value={settings.whatsappDefaultMessage}
                onChange={(e) =>
                  setSettings({ ...settings, whatsappDefaultMessage: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs outline-none focus:border-[#1A1918]"
              />
            </div>

            <div>
              <label className="block text-[#595652] font-medium mb-1">
                Email Toko
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs outline-none focus:border-[#1A1918]"
              />
            </div>

            <div>
              <label className="block text-[#595652] font-medium mb-1">
                Tautan Profil Instagram Toko
              </label>
              <input
                type="text"
                value={settings.instagramUrl}
                onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs outline-none focus:border-[#1A1918]"
              />
            </div>

            <div>
              <label className="block text-[#595652] font-medium mb-1">
                Jam Operasional
              </label>
              <input
                type="text"
                value={settings.operationalHours}
                onChange={(e) => setSettings({ ...settings, operationalHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs outline-none focus:border-[#1A1918]"
              />
            </div>

            <div>
              <label className="block text-[#595652] font-medium mb-1">
                Alamat / Kota Operasional
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs outline-none focus:border-[#1A1918]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Payment Methods Configuration */}
        <div className="bg-white p-6 rounded-2xl border border-[#EBE6DD] space-y-4 shadow-2xs">
          <h3 className="text-sm font-serif font-bold text-[#1A1918] flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#8C7355]" />
            <span>Rekening & Metode Pembayaran Manual</span>
          </h3>

          <div className="space-y-3">
            {settings.paymentMethods.map((method, idx) => (
              <div
                key={method.id}
                className="p-4 rounded-xl border border-[#EBE6DD] bg-[#FAF8F5] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`pay-${method.id}`}
                      checked={method.isActive}
                      onChange={(e) => updatePaymentMethod(idx, 'isActive', e.target.checked)}
                      className="w-4 h-4 rounded text-[#1A1918]"
                    />
                    <label htmlFor={`pay-${method.id}`} className="text-xs font-bold text-[#1A1918]">
                      {method.name}
                    </label>
                  </div>
                  <span className="text-[10px] text-[#8C8275] uppercase font-mono">
                    ID: {method.id}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-[#595652] mb-0.5">
                      Nomor Rekening / Kode Merchant
                    </label>
                    <input
                      type="text"
                      value={method.accountNumber || ''}
                      onChange={(e) => updatePaymentMethod(idx, 'accountNumber', e.target.value)}
                      placeholder="Contoh: 8830 1928 99"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D9D3C7] bg-white text-xs font-mono outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#595652] mb-0.5">
                      Atas Nama Rekening
                    </label>
                    <input
                      type="text"
                      value={method.accountName || ''}
                      onChange={(e) => updatePaymentMethod(idx, 'accountName', e.target.value)}
                      placeholder="Contoh: AiiStore99 Official"
                      className="w-full px-3 py-1.5 rounded-lg border border-[#D9D3C7] bg-white text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Settings Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="py-3 px-8 rounded-xl bg-[#1A1918] hover:bg-[#2C2A28] disabled:opacity-50 text-white text-xs font-medium tracking-wide flex items-center gap-2 shadow-md transition-all"
          >
            <Save className="w-4 h-4 text-[#C5A880]" />
            <span>{isSaving ? 'Menyimpan Pengaturan...' : 'Simpan Semua Pengaturan'}</span>
          </button>
        </div>
      </form>

      {/* Section 4: Security & Change Password */}
      <div className="bg-white p-6 rounded-2xl border border-[#EBE6DD] space-y-4 shadow-2xs">
        <h3 className="text-sm font-serif font-bold text-[#1A1918] flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#8C7355]" />
          <span>Keamanan Akun & Ubah Password Admin</span>
        </h3>

        {passwordMsg && (
          <div
            className={`p-3 rounded-xl text-xs ${
              passwordMsg.isError
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
            }`}
          >
            {passwordMsg.text}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#595652] font-medium mb-1">
              Password Saat Ini
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs outline-none"
            />
          </div>

          <div>
            <label className="block text-[#595652] font-medium mb-1">
              Password Baru (Min. 6 Karakter)
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs outline-none"
            />
          </div>

          <div className="sm:col-span-2 flex justify-end pt-1">
            <button
              type="submit"
              className="py-2.5 px-5 rounded-xl bg-[#1A1918] text-white text-xs font-medium hover:bg-[#2C2A28]"
            >
              Ubah Password
            </button>
          </div>
        </form>
      </div>

      {/* Section 5: External Configuration / Firebase & Cloud Info */}
      <div className="bg-[#FAF8F5] p-6 rounded-2xl border border-[#EBE6DD] space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1A1918]">
          <Cloud className="w-4 h-4 text-[#8C7355]" />
          <span>Status Penyimpanan Persisten & Kesiapan Firebase Cloud</span>
        </div>
        <div className="text-xs text-[#595652] space-y-2 leading-relaxed">
          <p>
            • <strong>Penyimpanan Database Aktif:</strong> Saat ini toko menggunakan engine database JSON persisten di sisi server Node.js/Express (<code className="bg-white px-1 py-0.5 rounded border border-[#E0DBCF]">/data/store_database.json</code>). Setiap perubahan produk, kategori, stok, foto, dan pesanan tersimpan secara permanen dan tidak hilang saat halaman di-refresh.
          </p>
          <p>
            • <strong>Penyimpanan Foto Produk:</strong> Foto yang di-upload atau diedit disimpan langsung di server (<code className="bg-white px-1 py-0.5 rounded border border-[#E0DBCF]">/uploads/</code>).
          </p>
          <p>
            • <strong>Migrasi ke Cloud Firestore & Auth:</strong> Struktur data telah dirancang 100% kompatibel dengan Firebase Firestore. Jika Anda ingin menghubungkan project Firebase nyata, Anda cukup memasukkan konfigurasi Firebase SDK di environment variable.
          </p>
        </div>
      </div>

      {/* Section 6: Reset Demo Data */}
      <div className="p-6 rounded-2xl border border-rose-200 bg-rose-50/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-rose-900">Reset Data Demo Toko</h4>
          <p className="text-[11px] text-rose-700 mt-0.5">
            Kembalikan seluruh produk, kategori, dan pengaturan ke data contoh awal AiiStore99.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowResetConfirm(true)}
          className="py-2 px-4 rounded-xl border border-rose-300 text-rose-700 bg-white hover:bg-rose-50 text-xs font-medium flex items-center gap-1.5 shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Data Demo Awal</span>
        </button>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowResetConfirm(false)} />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-[#EBE6DD] z-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#1A1918]">Konfirmasi Reset Data</h3>
              <p className="text-xs text-[#736E67] mt-1 leading-relaxed">
                Apakah Anda yakin ingin mengembalikan seluruh data ke sampel awal? Perubahan kustom yang belum dibackup akan tertimpa.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-[#D9D3C7] text-xs font-medium text-[#736E67] hover:bg-[#F2EFE9]"
              >
                Batal
              </button>
              <button
                onClick={handleResetDemoData}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium"
              >
                Ya, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
