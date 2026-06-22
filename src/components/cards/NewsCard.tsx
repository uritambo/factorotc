'use client';

import { Calendar, Tag } from 'lucide-react';

interface NewsCardProps {
  article: {
    id: string;
    title: string;
    summary: string;
    relatedTickers: string[];
    publishedAt: string;
    author: string;
    imageUrl?: string;
  };
  onReadMore?: () => void;
  locked?: boolean;
}

export function NewsCard({ article, onReadMore, locked = false }: NewsCardProps) {
  const date = new Date(article.publishedAt).toLocaleDateString('ca-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="border border-white/5 bg-[#15171C] rounded-lg p-5 hover:border-white/10 transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-grotesk font-semibold text-[#F2F2F0] mb-2 leading-snug line-clamp-2">
            {article.title}
          </h3>
          <p className="text-sm text-[#9CA3AF] leading-relaxed line-clamp-2 mb-4">
            {article.summary}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
              <Calendar size={12} />
              <span>{date}</span>
            </div>

            {article.relatedTickers.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Tag size={12} className="text-[#9CA3AF]" />
                <div className="flex gap-1">
                  {article.relatedTickers.slice(0, 3).map((ticker) => (
                    <span
                      key={ticker}
                      className="text-xs font-medium text-[#3D7FFF] bg-[#3D7FFF]/10 px-1.5 py-0.5 rounded"
                    >
                      {ticker}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {onReadMore && (
        <button
          onClick={onReadMore}
          className={`mt-4 w-full text-sm font-medium py-2 rounded-lg transition-colors ${
            locked
              ? 'bg-white/5 text-[#9CA3AF] hover:bg-white/10 hover:text-[#F2F2F0]'
              : 'bg-[#00D9A3]/10 text-[#00D9A3] hover:bg-[#00D9A3]/20'
          }`}
        >
          {locked ? 'Contingut premium — Subscriu-te' : 'Llegir article complet'}
        </button>
      )}
    </div>
  );
}
