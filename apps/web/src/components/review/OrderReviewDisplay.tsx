import React from 'react';
import { Star, MessageSquare, Sparkles, Edit2, CheckCircle2 } from 'lucide-react';
import { OrderReviewRecord } from '@delivery/shared';

interface OrderReviewDisplayProps {
  reviews: OrderReviewRecord[];
  onEditReview?: () => void;
  title?: string;
}

export const OrderReviewDisplay: React.FC<OrderReviewDisplayProps> = ({
  reviews,
  onEditReview,
  title = 'Ulasan & Bintang Anda untuk Pesanan Ini'
}) => {
  if (!reviews || reviews.length === 0) return null;

  return (
    <div className="p-4 bg-gradient-to-br from-amber-50/70 to-emerald-50/50 rounded-2xl border border-amber-200/80 space-y-3">
      <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
        <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          {title}
        </span>
        {onEditReview && (
          <button
            type="button"
            onClick={onEditReview}
            className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 transition"
          >
            <Edit2 className="w-3 h-3" />
            <span>Ubah</span>
          </button>
        )}
      </div>

      <div className="space-y-2.5">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
                  {rev.targetType === 'DRIVER' ? 'Mitra Driver' : rev.targetType === 'MERCHANT' ? 'Mitra Resto / Toko' : 'Pelanggan'}
                </span>
                <span className="font-extrabold text-xs text-slate-900">
                  {rev.targetName}
                </span>
              </div>

              {/* Star Rating Badge */}
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span className="font-black text-xs text-amber-900">
                  {rev.rating}.0
                </span>
              </div>
            </div>

            {/* Tags */}
            {rev.tags && rev.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {rev.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Comment */}
            {rev.comment && (
              <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1 flex items-start gap-1.5">
                <MessageSquare className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                <span>"{rev.comment}"</span>
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-[10px] text-emerald-800 font-bold">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Ulasan tersimpan dan aktif dalam riwayat reputasi ekosistem AZ GO</span>
      </div>
    </div>
  );
};
