'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getNewsArticles } from '@/lib/mockData';
import { NewsCard } from '@/components/cards/NewsCard';
import { PaywallModal } from '@/components/ui/PaywallModal';
import { Search } from 'lucide-react';

export default function NoticiesPage() {
  const t = useTranslations('news');
  const articles = getNewsArticles();

  const [search, setSearch] = useState('');
  const [selectedTicker, setSelectedTicker] = useState('');
  const [paywallOpen, setPaywallOpen] = useState(false);

  const allTickers = Array.from(
    new Set(articles.flatMap((a) => a.relatedTickers))
  ).sort();

  const filtered = articles.filter((article) => {
    const matchSearch =
      !search ||
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.summary.toLowerCase().includes(search.toLowerCase());
    const matchTicker =
      !selectedTicker || article.relatedTickers.includes(selectedTicker);
    return matchSearch && matchTicker;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('title')}</h1>
        <p className="text-[#9CA3AF] mt-1">{t('subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cercar notícies..."
            className="w-full bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] placeholder-[#9CA3AF]/60 rounded-lg pl-10 pr-4 py-2.5 transition-colors"
          />
        </div>
        <select
          value={selectedTicker}
          onChange={(e) => setSelectedTicker(e.target.value)}
          className="bg-white/5 border border-white/10 focus:border-[#00D9A3]/50 focus:outline-none text-[#F2F2F0] rounded-lg px-4 py-2.5 transition-colors"
        >
          <option value="">{t('allNews')}</option>
          {allTickers.map((ticker) => (
            <option key={ticker} value={ticker}>
              {ticker}
            </option>
          ))}
        </select>
      </div>

      {/* Articles Grid */}
      {filtered.length === 0 ? (
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-12 text-center">
          <p className="text-[#9CA3AF]">{t('noNews')}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((article, index) => (
            <NewsCard
              key={article.id}
              article={article}
              locked={index >= 3}
              onReadMore={index >= 3 ? () => setPaywallOpen(true) : undefined}
            />
          ))}
        </div>
      )}

      <PaywallModal isOpen={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </div>
  );
}
