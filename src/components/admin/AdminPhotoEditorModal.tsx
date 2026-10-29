import React, { useState, useRef, useEffect } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { X, RotateCw, ZoomIn, Sliders, Check, RotateCcw, Image as ImageIcon, Sparkles } from 'lucide-react';

interface AdminPhotoEditorModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newImageUrl: string) => void;
}

export const AdminPhotoEditorModal: React.FC<AdminPhotoEditorModalProps> = ({
  imageUrl,
  isOpen,
  onClose,
  onSave
}) => {
  const { token } = useAdminAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Editor states
  const [rotation, setRotation] = useState<number>(0); // 0, 90, 180, 270
  const [zoom, setZoom] = useState<number>(1.0); // 0.8 to 2.0
  const [brightness, setBrightness] = useState<number>(0); // -50 to +50
  const [contrast, setContrast] = useState<number>(0); // -50 to +50
  const [saturation, setSaturation] = useState<number>(0); // -50 to +50
  const [aspectRatio, setAspectRatio] = useState<'4:3' | '1:1' | '3:4' | 'original'>('4:3');
  const [quality, setQuality] = useState<number>(90); // 60 to 100%
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Image reference
  const imageObjRef = useRef<HTMLImageElement | null>(null);

  // Load image object safely without canvas tainting
  useEffect(() => {
    if (!imageUrl || !isOpen) return;

    const img = new Image();
    // Only set crossOrigin for remote http(s) URLs from other domains
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      try {
        const parsed = new URL(imageUrl);
        if (parsed.origin !== window.location.origin) {
          img.crossOrigin = 'anonymous';
        }
      } catch (e) {
        // ignore
      }
    }
    img.src = imageUrl;
    img.onload = () => {
      imageObjRef.current = img;
      renderCanvas();
    };
    img.onerror = () => {
      setErrorMsg('Gagal memuat gambar untuk diedit. Pastikan format file sesuai.');
    };
  }, [imageUrl, isOpen]);

  // Re-render canvas whenever parameters change
  useEffect(() => {
    if (imageObjRef.current) {
      renderCanvas();
    }
  }, [rotation, zoom, brightness, contrast, saturation, aspectRatio]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine target canvas width/height based on aspect ratio
    const baseWidth = 800;
    let targetWidth = baseWidth;
    let targetHeight = baseWidth * 0.75; // default 4:3

    if (aspectRatio === '1:1') {
      targetHeight = baseWidth;
    } else if (aspectRatio === '3:4') {
      targetHeight = baseWidth * (4 / 3);
    } else if (aspectRatio === 'original') {
      const origRatio = img.naturalHeight / img.naturalWidth;
      targetHeight = baseWidth * origRatio;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Clear
    ctx.clearRect(0, 0, targetWidth, targetHeight);

    // Apply color filters
    const bVal = 100 + brightness;
    const cVal = 100 + contrast;
    const sVal = 100 + saturation;
    ctx.filter = `brightness(${bVal}%) contrast(${cVal}%) saturate(${sVal}%)`;

    // Transformation: Center, rotate, zoom
    ctx.save();
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Draw image centered
    // Calculate draw dimensions preserving image aspect inside crop box
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const targetAspect = targetWidth / targetHeight;

    let drawW: number;
    let drawH: number;

    if (imgAspect > targetAspect) {
      drawH = targetHeight;
      drawW = drawH * imgAspect;
    } else {
      drawW = targetWidth;
      drawH = drawW / imgAspect;
    }

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();
  };

  const handleReset = () => {
    setRotation(0);
    setZoom(1.0);
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setAspectRatio('4:3');
    setQuality(90);
  };

  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const mimeType = 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, quality / 100);

      // Upload to server endpoint to get persistent URL
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          imageBase64: dataUrl,
          filename: 'edited_product'
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Gagal menyimpan foto hasil edit ke server');
      }

      const uploadResult = await res.json();
      onSave(uploadResult.url);
      onClose();
    } catch (err: any) {
      console.error('Error saving edited image:', err);
      // Fallback: use dataUrl if upload endpoint had an issue
      const mimeType = 'image/jpeg';
      const fallbackDataUrl = canvas.toDataURL(mimeType, quality / 100);
      onSave(fallbackDataUrl);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/75 backdrop-blur-xs" onClick={onClose} />

      {/* Editor Modal */}
      <div className="relative bg-[#FAFAF7] rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-[#E8E2D5] z-10 flex flex-col p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#EBE6DD]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#8C7355]" />
            <div>
              <h3 className="text-base sm:text-lg font-serif font-semibold text-[#1A1918]">
                Editor Foto Produk AiiStore99
              </h3>
              <p className="text-[11px] text-[#736E67]">
                Crop, putar, sesuaikan pencahayaan, kontras, dan kompres ukuran foto secara langsung.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F2EFE9] text-[#736E67] hover:text-[#1A1918]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6">
          {/* Canvas Preview Area */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#1A1918] p-4 rounded-xl border border-[#2D2A27] min-h-[320px]">
            <canvas
              ref={canvasRef}
              className="max-h-[380px] max-w-full object-contain rounded shadow-lg border border-white/10"
            />
            <p className="text-[10px] text-[#9E9B95] mt-2 font-mono">
              Live Canvas Preview · Rasio: {aspectRatio} · Rotasi: {rotation}° · Zoom: {zoom.toFixed(1)}x
            </p>
          </div>

          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-5 bg-white p-5 rounded-xl border border-[#EBE6DD]">
            {/* Aspect Ratio Presets */}
            <div>
              <label className="block text-xs font-semibold text-[#1A1918] mb-1.5">
                Rasio Crop Produk
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: '4:3', label: '4:3 (Standar)' },
                  { id: '1:1', label: '1:1 (Persegi)' },
                  { id: '3:4', label: '3:4 (Potret)' },
                  { id: 'original', label: 'Asli' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setAspectRatio(item.id as any)}
                    className={`py-1.5 px-2 text-[11px] rounded font-medium transition-all ${
                      aspectRatio === item.id
                        ? 'bg-[#1A1918] text-white'
                        : 'bg-[#F2EFE9] text-[#595652] hover:bg-[#EBE6DD]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions (Rotate & Zoom) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleRotate}
                className="flex-1 py-2 px-3 rounded-lg border border-[#D9D3C7] hover:bg-[#F7F5F0] text-xs font-medium text-[#1A1918] flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#8C7355]" />
                <span>Putar 90°</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="py-2 px-3 rounded-lg border border-[#D9D3C7] hover:bg-[#F7F5F0] text-xs font-medium text-[#736E67] flex items-center justify-center gap-1.5 transition-colors"
                title="Reset pengaturan"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>

            {/* Sliders: Zoom, Brightness, Contrast, Saturation, Quality */}
            <div className="space-y-3.5 pt-2 border-t border-[#F2EFE9] text-xs">
              {/* Zoom */}
              <div>
                <div className="flex justify-between text-[#595652] mb-1">
                  <span>Zoom / Skala</span>
                  <span className="font-mono">{zoom.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.0"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-[#1A1918]"
                />
              </div>

              {/* Brightness */}
              <div>
                <div className="flex justify-between text-[#595652] mb-1">
                  <span>Kecerahan (Brightness)</span>
                  <span className="font-mono">{brightness > 0 ? `+${brightness}` : brightness}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={brightness}
                  onChange={(e) => setBrightness(parseInt(e.target.value))}
                  className="w-full accent-[#1A1918]"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex justify-between text-[#595652] mb-1">
                  <span>Kontras</span>
                  <span className="font-mono">{contrast > 0 ? `+${contrast}` : contrast}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={contrast}
                  onChange={(e) => setContrast(parseInt(e.target.value))}
                  className="w-full accent-[#1A1918]"
                />
              </div>

              {/* Saturation */}
              <div>
                <div className="flex justify-between text-[#595652] mb-1">
                  <span>Saturasi Warna</span>
                  <span className="font-mono">{saturation > 0 ? `+${saturation}` : saturation}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={saturation}
                  onChange={(e) => setSaturation(parseInt(e.target.value))}
                  className="w-full accent-[#1A1918]"
                />
              </div>

              {/* Quality / Compression */}
              <div>
                <div className="flex justify-between text-[#595652] mb-1">
                  <span>Kompresi Kualitas (Ukuran Ringan)</span>
                  <span className="font-mono">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="5"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full accent-[#1A1918]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#EBE6DD] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-[#D9D3C7] text-xs font-medium text-[#736E67] hover:bg-[#F2EFE9] transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isProcessing}
            className="py-2.5 px-6 rounded-xl bg-[#1A1918] hover:bg-[#2C2A28] disabled:opacity-50 text-white text-xs font-medium tracking-wide flex items-center gap-2 shadow-sm transition-all"
          >
            <Check className="w-4 h-4 text-[#C5A880]" />
            <span>{isProcessing ? 'Menyimpan Foto...' : 'Terapkan & Simpan Foto'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
