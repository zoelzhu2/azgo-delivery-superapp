import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Sparkles, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // 1. Cek apakah sudah berjalan di mode standalone (sudah terinstall)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // 2. Deteksi perangkat iOS (iPhone / iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIos(isIosDevice);

    // 3. Tangkap event beforeinstallprompt untuk Android / Chrome / Edge
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Cek apakah pengguna baru saja dismiss banner sesi ini
    const isDismissed = sessionStorage.getItem('azgo_pwa_dismissed') === 'true';
    if (isDismissed) {
      setDismissed(true);
    }

    // 5. Tangkap event ketika aplikasi berhasil diinstall
    const handleAppInstalled = () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      sessionStorage.removeItem('azgo_pwa_dismissed');
      console.log('[PWA] Aplikasi AZ GO berhasil diinstall ke perangkat.');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) {
      // Jika browser belum trigger beforeinstallprompt (misal browser desktop non-Chrome), beri instruksi manual
      alert('Untuk menginstall AZ GO:\nBuka menu browser Anda (titik 3 di kanan atas) lalu pilih "Instal Aplikasi" atau "Tambahkan ke Layar Utama".');
      return;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] Pengguna menyetujui instalasi AZ GO');
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.error('[PWA] Error saat memicu install prompt:', err);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('azgo_pwa_dismissed', 'true');
  };

  // Jangan tampilkan jika sudah diinstall di HP/Desktop atau pengguna sudah dismiss di sesi ini
  if (isStandalone || dismissed) {
    return null;
  }

  return (
    <>
      {/* FLOATING PWA INSTALL BANNER (BOTTOM OF SCREEN) */}
      <aside aria-label="Instalasi Aplikasi AZ GO" className="fixed bottom-3 sm:bottom-5 left-3 sm:left-6 right-3 sm:right-auto z-40 sm:max-w-md animate-in slide-in-from-bottom duration-300">
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 sm:p-4 rounded-3xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              <img
                src="/icon-192.png"
                alt="Logo AZ GO"
                className="w-11 h-11 rounded-2xl object-cover border border-emerald-500/40 shadow-sm"
              />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <Sparkles className="w-2 h-2 text-white" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-white text-xs sm:text-sm tracking-tight truncate">
                  Pasang Aplikasi AZ GO
                </h4>
                <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 font-bold text-[9px] rounded-md border border-emerald-500/30">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-slate-300 truncate mt-0.5">
                Akses cepat, hemat kuota & buka tanpa browser
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="py-2 px-3 sm:px-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-2xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950 transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>Install</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              title="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MODAL PANDUAN INSTALL KHUSUS IPHONE / IPAD (SAFARI) */}
      {showIosGuide && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <img
                  src="/icon-192.png"
                  alt="AZ GO"
                  className="w-10 h-10 rounded-2xl object-cover border border-emerald-200 shadow-sm"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Install di iPhone / iPad</h3>
                  <p className="text-[11px] text-slate-500">Panduan Tambah ke Layar Utama</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 py-1">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl shrink-0 mt-0.5">
                  <Share className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Langkah 1:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Ketuk tombol <strong>Bagikan (Share)</strong> ikon kotak dengan panah ke atas di bilah bawah browser Safari.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl shrink-0 mt-0.5">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Langkah 2:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Gulir ke bawah dan pilih opsi <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-start gap-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-slate-800 block">Langkah 3:</span>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Ketuk <strong>Tambah (Add)</strong> di pojok kanan atas. Ikon AZ GO akan muncul di layar iPhone Anda!
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl text-xs transition"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
};
