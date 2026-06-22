'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { getNewsArticles } from '@/lib/mockData';
import { Newspaper, Plus, CheckCircle, Clock, Trash2, Edit } from 'lucide-react';

export default function NoticiesAdminPage() {
  const t = useTranslations('admin');
  const articles = getNewsArticles();
  const [articles2, setArticles2] = useState(
    articles.map((a, i) => ({ ...a, status: i < 6 ? 'PUBLISHED' : 'PENDING' }))
  );

  const toggleStatus = (id: string) => {
    setArticles2((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === 'PUBLISHED' ? 'PENDING' : 'PUBLISHED' }
          : a
      )
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('news')}</h1>
          <p className="text-[#9CA3AF] mt-1">{t('newsList')}</p>
        </div>
        <button className="flex items-center gap-2 bg-[#00D9A3] hover:bg-[#00D9A3]/90 text-[#0A0B0D] font-semibold px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={18} />
          {t('create')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-2">
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Total articles</p>
          <p className="font-grotesk text-xl font-bold text-[#F2F2F0]">{articles2.length}</p>
        </div>
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Publicats</p>
          <p className="font-grotesk text-xl font-bold text-[#00D9A3]">{articles2.filter(a => a.status === 'PUBLISHED').length}</p>
        </div>
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Pendents</p>
          <p className="font-grotesk text-xl font-bold text-[#FF5C5C]">{articles2.filter(a => a.status === 'PENDING').length}</p>
        </div>
      </div>

      <div className="border border-white/5 bg-[#15171C] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Títol</th>
              <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Tickers</th>
              <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Estat</th>
              <th className="text-left text-xs font-medium text-[#9CA3AF] px-6 py-4">Accions</th>
            </tr>
          </thead>
          <tbody>
            {articles2.map((article) => (
              <tr key={article.id} className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-sm font-medium text-[#F2F2F0] line-clamp-1 max-w-md">{article.title}</p>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">
                    {new Date(article.publishedAt).toLocaleDateString('ca-ES')}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {article.relatedTickers.slice(0, 3).map((ticker) => (
                      <span key={ticker} className="text-xs text-[#3D7FFF] bg-[#3D7FFF]/10 px-1.5 py-0.5 rounded">
                        {ticker}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                      article.status === 'PUBLISHED'
                        ? 'bg-[#00D9A3]/10 text-[#00D9A3]'
                        : 'bg-[#FF5C5C]/10 text-[#FF5C5C]'
                    }`}
                  >
                    {article.status === 'PUBLISHED' ? (
                      <CheckCircle size={10} />
                    ) : (
                      <Clock size={10} />
                    )}
                    {article.status === 'PUBLISHED' ? 'Publicat' : 'Pendent'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStatus(article.id)}
                      className="text-xs font-medium text-[#3D7FFF] hover:text-[#3D7FFF]/80 transition-colors"
                    >
                      {article.status === 'PUBLISHED' ? t('unpublish') : t('publish')}
                    </button>
                    <button className="text-[#9CA3AF] hover:text-[#F2F2F0] transition-colors">
                      <Edit size={14} />
                    </button>
                    <button className="text-[#9CA3AF] hover:text-[#FF5C5C] transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
