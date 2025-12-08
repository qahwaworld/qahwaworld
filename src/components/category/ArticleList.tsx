'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLocalizedPath } from '@/lib/localization';
import { Article } from '../../types';
import { Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';

interface ArticleListProps {
  articles: Article[];
  locale: string;
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, locale }) => {
  const { t } = useLanguage();
  const getPath = (path: string) => getLocalizedPath(path, locale);

  // Helper to format date as YYYY-MM-DD
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toISOString().split('T')[0];
  };

  // Helper to strip <p> tags from excerpt
  const cleanExcerpt = (excerpt: string) => {
    if (!excerpt) return '';
    return excerpt.replace(/^<p>/i, '').replace(/<\/p>$/i, '');
  };

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={getPath(`/${encodeURIComponent(article.categorySlug || article.category.toLowerCase().replace(/\s+/g, '-'))}/${encodeURIComponent(article.slug || article.id)}`)}
          className="group flex gap-6 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
        >
          <div className="w-80 h-48 relative overflow-hidden flex-shrink-0">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="320px"
            />
          </div>
          <div className="flex-1 p-6 flex flex-col">
            <div className="mb-2">
              <Badge className="bg-amber-700 hover:bg-amber-800">
                {article.category}
              </Badge>
            </div>
            <h3 className="font-bold text-2xl mb-3 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors">
              {article.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 flex-1 line-clamp-3">
              {cleanExcerpt(article.excerpt)}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{t.readTime} {article.readTime}</span>
              </div>
              <span>{formatDate(article.date)}</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export { ArticleList };
