import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

interface AdminLoginProps {
  onBackToStore: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToStore }) => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('admin@aiistore99.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const res = await login(email, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Login gagal. Periksa kembali email dan password Anda.');
    }
    setIsSubmitting(false);
  };

  const handleFillDemo = () => {
    setEmail('admin@aiistore99.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#E8E2D5] p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#1A1918] text-[#C5A880] flex items-center justify-center mx-auto shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#1A1918]">AiiStore99 Admin</h1>
          <p className="text-xs text-[#736E67]">
            Masuk untuk mengelola katalog produk, stok, kategori, dan pengaturan toko.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#595652] mb-1">
              Email Administrator
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-[#8C8275] absolute left-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs text-[#1A1918] placeholder-[#9E9B95] outline-none focus:border-[#1A1918] bg-[#FAF8F5]"
                placeholder="admin@aiistore99.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#595652] mb-1">
              Kata Sandi (Password)
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-[#8C8275] absolute left-3.5 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#D9D3C7] text-xs text-[#1A1918] placeholder-[#9E9B95] outline-none focus:border-[#1A1918] bg-[#FAF8F5]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-[#1A1918] hover:bg-[#2C2A28] disabled:opacity-50 text-white text-xs font-medium tracking-wide flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
            <ArrowRight className="w-4 h-4 text-[#C5A880]" />
          </button>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div className="p-4 rounded-xl bg-[#F2EFE9] border border-[#E0DBCF] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#1A1918] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8C7355]" />
              Kredensial Default Demo:
            </span>
            <button
              onClick={handleFillDemo}
              type="button"
              className="text-[#8C7355] font-semibold hover:underline text-[11px]"
            >
              Isi Otomatis
            </button>
          </div>
          <div className="text-[11px] text-[#595652] space-y-0.5 font-mono">
            <p>Email: <span className="text-[#1A1918]">admin@aiistore99.com</span></p>
            <p>Password: <span className="text-[#1A1918]">admin123</span></p>
          </div>
        </div>

        {/* Back to store */}
        <div className="text-center pt-2">
          <button
            onClick={onBackToStore}
            type="button"
            className="text-xs text-[#736E67] hover:text-[#1A1918] transition-colors"
          >
            ← Kembali ke Tampilan Toko
          </button>
        </div>
      </div>
    </div>
  );
};
