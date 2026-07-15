import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { isNewsImportConfigured } from '@/lib/newsImport';
import { isTranslationConfigured } from '@/lib/translate';
import { ImportNewsButton } from '@/components/admin/ImportNewsButton';
import { CreateArticleForm } from '@/components/admin/CreateArticleForm';
import { setArticleStatus, deleteArticle } from '@/app/actions/news';
import { CheckCircle, Clock, Trash2, Languages } from 'lucide-react';

async function getArticles() {
  try {
    return await prisma.newsArticle.findMany({ orderBy: { publishedAt: 'desc' }, take: 100 });
  } catch {
    return [];
  }
}

export default async function NoticiesAdminPage() {
  const t = await getTranslations('admin');
  const articles = await getArticles();

  const published = articles.filter((a) => a.status === 'PUBLISHED');
  const pending = articles.filter((a) => a.status === 'PENDING');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('news')}</h1>
          <p className="text-[#9CA3AF] mt-1">
            Importa notícies reals, revisa-les i publica-les perquè les vegin els usuaris
          </p>
        </div>
        <ImportNewsButton configured={isNewsImportConfigured()} />
      </div>

      {isNewsImportConfigured() && !isTranslationConfigured() && (
        <div className="flex items-center gap-3 text-xs text-[#9CA3AF] border border-white/5 bg-[#15171C] rounded-lg px-4 py-3">
          <Languages size={14} className="text-[#3D7FFF] flex-shrink-0" />
          <span>
            Les notícies s&apos;importen en l&apos;idioma original. Per traduir-les automàticament al català,
            afegeix <code className="text-[#00D9A3]">ANTHROPIC_API_KEY</code> a .env (API de Claude).
          </span>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Total articles</p>
          <p className="font-grotesk text-xl font-bold text-[#F2F2F0] tabular-nums">{articles.length}</p>
        </div>
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Publicats</p>
          <p className="font-grotesk text-xl font-bold text-[#00D9A3] tabular-nums">{published.length}</p>
        </div>
        <div className="border border-white/5 bg-[#15171C] rounded-xl p-4">
          <p className="text-xs text-[#9CA3AF] mb-1">Pendents de revisió</p>
          <p className="font-grotesk text-xl font-bold text-[#FF5C5C] tabular-nums">{pending.length}</p>
        </div>
      </div>

      <CreateArticleForm />

      <div className="space-y-3">
        {articles.length === 0 && (
          <div className="border border-white/5 bg-[#15171C] rounded-xl p-10 text-center text-sm text-[#9CA3AF]">
            Encara no hi ha notícies. Importa&apos;n amb el botó de dalt o crea&apos;n una manualment.
          </div>
        )}
        {articles.map((article) => (
          <div key={article.id} className="border border-white/5 bg-[#15171C] rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                      article.status === 'PUBLISHED'
                        ? 'bg-[#00D9A3]/10 text-[#00D9A3]'
                        : 'bg-[#FF5C5C]/10 text-[#FF5C5C]'
                    }`}
                  >
                    {article.status === 'PUBLISHED' ? <CheckCircle size={10} /> : <Clock size={10} />}
                    {article.status === 'PUBLISHED' ? 'Publicat' : 'Pendent'}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">{article.source}</span>
                  <span className="text-xs text-[#9CA3AF] tabular-nums">
                    {article.publishedAt.toLocaleDateString('ca-ES')}
                  </span>
                  {article.relatedTickers.map((ticker) => (
                    <span key={ticker} className="text-xs text-[#3D7FFF] bg-[#3D7FFF]/10 px-1.5 py-0.5 rounded">
                      {ticker}
                    </span>
                  ))}
                </div>
                <h3 className="font-grotesk font-semibold text-[#F2F2F0] leading-snug">{article.title}</h3>
                <p className="text-sm text-[#9CA3AF] mt-1 line-clamp-2">{article.summary}</p>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <form action={setArticleStatus}>
                  <input type="hidden" name="articleId" value={article.id} />
                  <input
                    type="hidden"
                    name="status"
                    value={article.status === 'PUBLISHED' ? 'PENDING' : 'PUBLISHED'}
                  />
                  <button
                    type="submit"
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                      article.status === 'PUBLISHED'
                        ? 'bg-white/5 text-[#9CA3AF] hover:bg-white/10'
                        : 'bg-[#00D9A3]/10 text-[#00D9A3] hover:bg-[#00D9A3]/20'
                    }`}
                  >
                    {article.status === 'PUBLISHED' ? t('unpublish') : t('publish')}
                  </button>
                </form>
                <form action={deleteArticle}>
                  <input type="hidden" name="articleId" value={article.id} />
                  <button
                    type="submit"
                    className="p-2 rounded-lg text-[#9CA3AF] hover:text-[#FF5C5C] hover:bg-[#FF5C5C]/10 transition-colors"
                    title={t('delete')}
                  >
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
