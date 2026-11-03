import React, { useState } from 'react';
import { Star, X, Check, CheckCircle2, MessageSquare, Sparkles, Bike, Store, User as UserIcon, ThumbsUp } from 'lucide-react';
import { ReviewerRole, ReviewTargetType, SingleReviewItem, OrderReviewRecord } from '@delivery/shared';
import { api } from '../../services/apiClient';

export interface ReviewTargetConfig {
  targetType: ReviewTargetType;
  targetId?: string;
  targetName: string;
  targetRoleLabel: string;
  avatarIcon?: 'DRIVER' | 'MERCHANT' | 'CUSTOMER';
  presetTags: string[];
}

interface OrderReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  serviceType?: string;
  reviewerRole: ReviewerRole;
  reviewerName: string;
  reviewerId?: string;
  targets: ReviewTargetConfig[];
  existingReviews?: OrderReviewRecord[];
  onReviewSubmitted?: (newReviews: OrderReviewRecord[]) => void;
}

export const DRIVER_PRESET_TAGS = [
  '🌟 Sangat Ramah & Sopan',
  '⚡ Pengantaran Cepat & Tepat Waktu',
  '🛡️ Berkendara Hati-hati & Aman',
  '📦 Paket / Makanan Terjaga Rapi',
  '🎒 Membawa Tas Thermal / Box',
  '📍 Titik Antar / Jemput Sangat Akurat',
  '💬 Komunikasi Sangat Baik'
];

export const MERCHANT_PRESET_TAGS = [
  '😋 Rasa Sangat Lezat & Mantap',
  '🍱 Porsi Melimpah & Sesuai',
  '🛍️ Kemasan Rapi & Higienis',
  '⏱️ Pesanan Disiapkan Cepat',
  '🛵 Tempat Parkir Driver Mudah',
  '👨‍🍳 Pelayanan Staff Ramah',
  '🏷️ Makanan Hangat & Segar'
];

export const CUSTOMER_PRESET_TAGS = [
  '👍 Pelanggan Sangat Ramah',
  '📍 Titik Lokasi Sangat Akurat',
  '💵 Pembayaran Lancar / Uang Pas',
  '📱 Respon Cepat di Chat / Telp',
  '⏳ Penjemputan / Penerimaan Cepat',
  '⭐ Sangat Kooperatif'
];

export const OrderReviewModal: React.FC<OrderReviewModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  serviceType,
  reviewerRole,
  reviewerName,
  reviewerId,
  targets,
  existingReviews = [],
  onReviewSubmitted
}) => {
  // Inisialisasi state ulasan untuk setiap target
  const [ratings, setRatings] = useState<{ [key: string]: number }>(() => {
    const init: { [key: string]: number } = {};
    targets.forEach(t => {
      const match = existingReviews.find(e => e.targetType === t.targetType);
      init[t.targetType] = match ? match.rating : 5;
    });
    return init;
  });

  const [hoveredStars, setHoveredStars] = useState<{ [key: string]: number }>({});

  const [selectedTags, setSelectedTags] = useState<{ [key: string]: string[] }>(() => {
    const init: { [key: string]: string[] } = {};
    targets.forEach(t => {
      const match = existingReviews.find(e => e.targetType === t.targetType);
      init[t.targetType] = match ? match.tags : [t.presetTags[0], t.presetTags[1]];
    });
    return init;
  });

  const [comments, setComments] = useState<{ [key: string]: string }>(() => {
    const init: { [key: string]: string } = {};
    targets.forEach(t => {
      const match = existingReviews.find(e => e.targetType === t.targetType);
      init[t.targetType] = match ? match.comment || '' : '';
    });
    return init;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleStarClick = (targetType: string, starVal: number) => {
    setRatings(prev => ({ ...prev, [targetType]: starVal }));
  };

  const handleToggleTag = (targetType: string, tag: string) => {
    setSelectedTags(prev => {
      const current = prev[targetType] || [];
      if (current.includes(tag)) {
        return { ...prev, [targetType]: current.filter(t => t !== tag) };
      } else {
        return { ...prev, [targetType]: [...current, tag] };
      }
    });
  };

  const getRatingLabel = (score: number) => {
    switch (score) {
      case 5: return '⭐⭐⭐⭐⭐ Luar Biasa Istimewa!';
      case 4: return '⭐⭐⭐⭐ Sangat Memuaskan';
      case 3: return '⭐⭐⭐ Cukup Baik';
      case 2: return '⭐⭐ Kurang Memuaskan';
      case 1: return '⭐ Perlu Banyak Perbaikan';
      default: return 'Pilih Bintang';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const reviewItems: SingleReviewItem[] = targets.map(t => ({
        targetType: t.targetType,
        targetId: t.targetId,
        targetName: t.targetName,
        rating: ratings[t.targetType] || 5,
        tags: selectedTags[t.targetType] || [],
        comment: (comments[t.targetType] || '').trim()
      }));

      const res = await api.submitOrderReviews({
        orderNumber,
        serviceType,
        reviewerRole,
        reviewerId,
        reviewerName,
        reviews: reviewItems
      });

      if (res.success) {
        setIsSubmittedSuccess(true);
        if (onReviewSubmitted) {
          onReviewSubmitted(res.data);
        }
        setTimeout(() => {
          setIsSubmittedSuccess(false);
          onClose();
        }, 1600);
      }
    } catch (err) {
      console.error('Gagal mengirim ulasan:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* MODAL HEADER */}
        <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 flex items-start justify-between bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Ulasan & Rating Transaksi
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                #{orderNumber}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              Bagaimana Pengalaman Transaksi Anda?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Penilaian Anda sangat penting untuk menjaga kualitas ekosistem AZ GO.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* SUKSES TOAST ANIMASI */}
        {isSubmittedSuccess ? (
          <div className="p-8 sm:p-12 text-center space-y-4 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-sm animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-slate-900">
                Terima Kasih Banyak! ⭐
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Ulasan dan bintang Anda telah berhasil disimpan dan diteruskan ke mitra terkait.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
            {targets.map((target, idx) => {
              const currentScore = ratings[target.targetType] || 5;
              const hoverScore = hoveredStars[target.targetType] || 0;
              const activeDisplayScore = hoverScore || currentScore;
              const currentTags = selectedTags[target.targetType] || [];

              return (
                <div
                  key={target.targetType}
                  className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-4 transition hover:border-amber-300"
                >
                  {/* Target Card Header */}
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm ${
                        target.avatarIcon === 'DRIVER' ? 'bg-amber-600' :
                        target.avatarIcon === 'MERCHANT' ? 'bg-emerald-600' : 'bg-blue-600'
                      }`}>
                        {target.avatarIcon === 'DRIVER' && <Bike className="w-5 h-5" />}
                        {target.avatarIcon === 'MERCHANT' && <Store className="w-5 h-5" />}
                        {target.avatarIcon === 'CUSTOMER' && <UserIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                          Beri Nilai {target.targetRoleLabel}
                        </span>
                        <h4 className="font-extrabold text-slate-900 text-sm">
                          {target.targetName}
                        </h4>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      #{idx + 1} dari {targets.length}
                    </span>
                  </div>

                  {/* Interactive Star Rating Selector */}
                  <div className="text-center py-1 space-y-2">
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      {[1, 2, 3, 4, 5].map(starNum => {
                        const isFilled = starNum <= activeDisplayScore;
                        return (
                          <button
                            key={starNum}
                            type="button"
                            onClick={() => handleStarClick(target.targetType, starNum)}
                            onMouseEnter={() => setHoveredStars(prev => ({ ...prev, [target.targetType]: starNum }))}
                            onMouseLeave={() => setHoveredStars(prev => ({ ...prev, [target.targetType]: 0 }))}
                            className="p-1 transition-transform transform active:scale-125 hover:scale-115 focus:outline-none"
                            title={`Beri ${starNum} Bintang`}
                          >
                            <Star
                              className={`w-8 h-8 sm:w-9 sm:h-9 transition-colors ${
                                isFilled
                                  ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                                  : 'text-slate-300 stroke-[1.5]'
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-xs font-bold text-amber-700">
                      {getRatingLabel(activeDisplayScore)}
                    </p>
                  </div>

                  {/* Quick Chips / Tags */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3 text-emerald-600" />
                      Pilih Hal yang Anda Sukai (Opsional):
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {target.presetTags.map(tag => {
                        const isSelected = currentTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleToggleTag(target.targetType, tag)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition flex items-center gap-1 border ${
                              isSelected
                                ? 'bg-amber-100/80 border-amber-300 text-amber-900 font-bold shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <span>{tag}</span>
                            {isSelected && <Check className="w-3 h-3 text-amber-700 stroke-[3]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review Comment Textarea */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-slate-400" />
                      Tulis Ulasan Tambahan (Opsional):
                    </label>
                    <textarea
                      rows={2}
                      value={comments[target.targetType] || ''}
                      onChange={e => setComments(prev => ({ ...prev, [target.targetType]: e.target.value }))}
                      placeholder={`Ceritakan pengalaman Anda bersama ${target.targetName}...`}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-500/20 focus:outline-amber-500 transition"
                    />
                  </div>
                </div>
              );
            })}

            {/* MODAL FOOTER */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition"
              >
                Nanti Saja
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
              >
                <Star className="w-4 h-4 fill-slate-950" />
                <span>{isSubmitting ? 'Mengirim Ulasan...' : 'Kirim Ulasan & Bintang Sekarang'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
