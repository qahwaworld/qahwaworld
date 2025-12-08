import { NextRequest, NextResponse } from 'next/server';
import { getArticlesByTag } from '@/lib/actions/tag/getArticlesByTag';
import { calculateReadTime, formatDate } from '@/lib/utils';
import { getCategoryTranslation } from '@/lib/translations';
import { Article } from '@/types';
import { Article as WordPressArticle } from '@/types/wordpress';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const tagSlug = searchParams.get('tagSlug');
    const language = searchParams.get('language') || 'en';
    const after = searchParams.get('after') || undefined;

    if (!tagSlug) {
      return NextResponse.json(
        {
          error: 'Tag slug is required',
          articles: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        },
        { status: 400 }
      );
    }

    // Fetch 12 articles per page (same as initial load)
    const { articles: backendArticles, pageInfo } = await getArticlesByTag(
      decodeURIComponent(tagSlug),
      language,
      12,
      after
    );

    // Transform WordPress articles to Article type
    const articles: Article[] = backendArticles.map((a: WordPressArticle) => {
      const matchingCategory = a.categories?.nodes?.[0];
      const categoryNameFromWP = matchingCategory?.name || '';
      
      // Find the category slug that matches the current language
      let categorySlug = matchingCategory?.slug || '';
      if (matchingCategory?.translations && matchingCategory.translations.length > 0) {
        // Find translation that matches current language
        const langTranslation = matchingCategory.translations.find(
          (t) => t.languageCode?.toLowerCase() === language.toLowerCase()
        );
        if (langTranslation?.slug) {
          categorySlug = langTranslation.slug;
        }
      }
      
      // Translate category name based on language
      const categoryName = getCategoryTranslation(categoryNameFromWP, language);

      return {
        id: a.id,
        title: a.title,
        excerpt: a.excerpt,
        category: categoryName,
        categorySlug: categorySlug,
        image: a.featuredImage?.node?.sourceUrl || '',
        date: formatDate(a.date, language),
        author: a.author?.node?.name || '',
        readTime: calculateReadTime(a.content || '', language),
        featured: false,
        tags: a.tags?.nodes?.map((t: { name: string; slug: string }) => ({ name: t.name, slug: t.slug })) || [],
        content: a.content,
        slug: a.slug,
      };
    });

    return NextResponse.json({
      articles,
      pageInfo,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch articles',
        articles: [],
        pageInfo: {
          hasNextPage: false,
          endCursor: null,
        },
      },
      { status: 500 }
    );
  }
}

