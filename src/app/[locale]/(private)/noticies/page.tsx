import { getTranslations } from 'next-intl/server';
import { getPublishedNews } from '@/lib/news';
import { NewsList } from '@/components/news/NewsList';

export default async function NoticiesPage() {
  const t = await getTranslations('news');
  const articles = await getPublishedNews();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-grotesk text-3xl font-bold text-[#F2F2F0]">{t('title')}</h1>
        <p className="text-[#9CA3AF] mt-1">{t('subtitle')}</p>
      </div>

      <NewsList articles={articles} />
    </div>
  );
}
