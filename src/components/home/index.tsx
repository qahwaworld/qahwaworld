import React from 'react';
import Link from 'next/link';
import { mockArticles } from "../../data/mockArticles";
import { ArticleCard } from "../ArticleCard";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "../ui/badge";
import { getTranslations, getCategoryTranslation } from "@/lib/translations";
import { getLocalizedPath } from "@/lib/localization";
import { getHomePageLatestArticles, getTrendingPostsFromHomePage, getCategoriesSectionForHomePage, getSpotlightDataForHomePage, getHomepageAdBanner } from "@/lib/actions/home/homeAction";

const decodeHTMLEntities = (text: string = ""): string => {
  const entityMap: Record<string, string> = {
    "&quot;": '"',
    "&#34;": '"',
    "&#8220;": '"',
    "&#8221;": '"',
    "&#8216;": "'",
    "&#8217;": "'",
    "&#39;": "'",
    "&apos;": "'",
    "&amp;": "&",
    "&nbsp;": " ",
    "&ndash;": "-",
    "&#8211;": "-",
    "&mdash;": "-",
    "&#8212;": "-",
    "&hellip;": "...",
    "&#8230;": "...",
  };

  let decoded = text.replace(/&[a-zA-Z0-9#]+;/g, (entity) => entityMap[entity] || entity);

  decoded = decoded
    .replace(/&#x([\da-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));

  return decoded;
};

const sanitizeExcerpt = (text: string = "") => decodeHTMLEntities(text.replace(/<[^>]*>/g, ""));

interface HomePageProps {
  locale: string;
}

const HomePage: React.FC<HomePageProps> = async ({ locale }) => {
  const t = getTranslations(locale);

  // Helper function to generate correct URL based on locale
  const getPath = (path: string) => getLocalizedPath(path, locale);

  // Helper function to get category for current language
  const getLocalizedCategory = (categories: any) => {
    if (!categories?.edges) return null;

    // Try to find category matching current locale
    const localizedCategory = categories.edges.find((edge: any) =>
      edge.node.languageCode.toLowerCase() === locale.toLowerCase()
    );

    // Fallback to first category if no match found
    return localizedCategory?.node || categories.edges[0]?.node || null;
  };

  // Fetch latest articles from GraphQL
  const latestArticles = await getHomePageLatestArticles(locale);
  const trendingArticles = await getTrendingPostsFromHomePage(locale);
  const categorySections = await getCategoriesSectionForHomePage(locale);
  const spotlightData = await getSpotlightDataForHomePage(locale);
  const adBanners = await getHomepageAdBanner();

  // Helper function to get ad banner by name
  const getAdBanner = (name: string) => {
    return adBanners.find(banner => banner.name === name);
  };

  // Use dynamic data for main content, fallback to mock for other sections
  const featuredArticle = latestArticles.length > 0 ? latestArticles[0] : null;
  const newsArticles = latestArticles.length > 1 ? latestArticles.slice(1) : [];
  const fallbackTrendingArticles = mockArticles.slice(2, 6);
  const spotlightArticles = mockArticles.slice(4, 8);
  const moreArticles = mockArticles.slice(8, 12);

  return (
    <>
      <div className="min-h-screen bg-white dark:bg-gray-900">
        {/* Top Banner Ad - Under Navigation */}
        <div className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-4">
              {getAdBanner('home_page_ad1') ? (
                <div 
                  className="w-full max-w-5xl"
                  dangerouslySetInnerHTML={{ __html: getAdBanner('home_page_ad1')!.content }}
                />
              ) : (
                <div className="w-full max-w-5xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600 border dark:border-gray-600 p-3 text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {/* Advertisement Banner 1 */}
                    📰 Advertisement Banner - 728x90
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <section className="py-8 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Sidebar - Latest Articles */}
              <aside className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-800 px-6 py-6 sticky top-24">
                  {getAdBanner('home_page_ad2') ? (
                    <div 
                      dangerouslySetInnerHTML={{ __html: getAdBanner('home_page_ad2')!.content }}
                    />
                  ) : (
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {/* Advertisement Banner 2 */}
                      Advertisement Banner - 300x800
                    </span>
                  )}
                </div>
              </aside>


              <main className="lg:col-span-6 lg:border-x dark:lg:border-gray-700 lg:px-6">
                {/* Center Content - Latest First Article */}
                {featuredArticle ? (
                  <Link
                    href={getPath(`/${getLocalizedCategory(featuredArticle.categories)?.slug}/${featuredArticle.slug}`)}
                    className="bg-white dark:bg-transparent py-6 mb-8 cursor-pointer block"
                  >
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 mb-4">
                      {getLocalizedCategory(featuredArticle.categories)?.name || 'News'}
                    </Badge>
                    <h2 className="mb-4 text-amber-900 dark:text-amber-100 text-3xl">
                      {decodeHTMLEntities(featuredArticle.title)}
                    </h2>
                    <div className="aspect-video overflow-hidden mb-6">
                      <img
                        src={featuredArticle.featuredImage?.node?.sourceUrl}
                        alt={featuredArticle.featuredImage?.node?.altText || decodeHTMLEntities(featuredArticle.title)}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {sanitizeExcerpt(featuredArticle.excerpt)}
                    </p>
                    <span className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-md transition-colors">
                      {t.readMore}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ) : (
                  // Fallback to mock article if no dynamic data
                  <Link
                    href={getPath(`/${mockArticles[0].category.toLowerCase().replace(' ', '-')}/${mockArticles[0].id}`)}
                    className="bg-white dark:bg-transparent py-6 mb-8 cursor-pointer block"
                  >
                    <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 mb-4">
                      {mockArticles[0].category}
                    </Badge>
                    <h2 className="mb-4 text-amber-900 dark:text-amber-100 text-3xl">
                      {mockArticles[0].title}
                    </h2>
                    <div className="aspect-video overflow-hidden mb-6">
                      <img
                        src={mockArticles[0].image}
                        alt={mockArticles[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {mockArticles[0].excerpt}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                      do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <span className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-md transition-colors">
                      {t.readMore}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                )}

                {/* Remaining LatestArticles */}
                <div className="mt-8 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {newsArticles.length > 0 ? newsArticles.slice(0, 8).map((article) => {
                      const decodedTitle = decodeHTMLEntities(article.title);
                      const sanitizedExcerpt = sanitizeExcerpt(article.excerpt);

                      return (
                        <Link
                          key={article.slug}
                          href={getPath(`/${getLocalizedCategory(article.categories)?.slug}/${article.slug}`)}
                          className="bg-white dark:bg-gray-800 border dark:border-gray-700 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow block"
                        >
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={article.featuredImage?.node?.sourceUrl}
                              alt={article.featuredImage?.node?.altText || decodedTitle}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mb-2">
                              {getLocalizedCategory(article.categories)?.name || 'News'}
                            </Badge>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                              <span>{new Date(article.date).toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                              <span>•</span>
                              <span>5 min read</span>
                            </div>
                            <h3 className="text-lg text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors line-clamp-2 mb-2">
                              {decodedTitle}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {sanitizedExcerpt}
                            </p>
                          </div>
                        </Link>
                      );
                    }) : (
                      // Fallback to mock articles if no dynamic data
                      mockArticles.slice(1, 8).map((article) => (
                        <Link
                          key={article.id}
                          href={getPath(`/${article.category.toLowerCase().replace(' ', '-')}/${article.id}`)}
                          className="bg-white dark:bg-gray-800 border dark:border-gray-700 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow block"
                        >
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mb-2">
                              {article.category}
                            </Badge>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                              <span>{article.date}</span>
                              <span>•</span>
                              <span>{article.readTime}</span>
                            </div>
                            <h3 className="text-lg text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors line-clamp-2 mb-2">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                              {article.excerpt}
                            </p>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </main>

              {/* Right Sidebar - Trending */}
              <aside className="lg:col-span-3">
                <div className="bg-white dark:bg-gray-800 px-6 py-6 sticky top-24">
                  <div className="flex items-center justify-between mb-6 pb-3 border-b dark:border-gray-700">
                    <h2 className="text-amber-900 dark:text-amber-100 text-xl">
                      {t.trending}
                    </h2>
                  </div>
                  <div className="space-y-6">
                    {trendingArticles.length > 0
                      ? trendingArticles.map((article) => {
                        const primaryCategory = article.categories?.[0];
                        const categorySlug = primaryCategory?.slug || "news";
                        const categoryName = primaryCategory?.name || "News";
                        const decodedTitle = decodeHTMLEntities(article.title);
                        const sanitizedExcerpt = sanitizeExcerpt(article.excerpt);

                        return (
                          <Link
                            key={article.id}
                            href={getPath(`/${categorySlug}/${article.slug}`)}
                            className="group cursor-pointer block"
                          >
                            <div className="aspect-video overflow-hidden mb-3">
                              <img
                                src={article.featuredImage}
                                alt={decodedTitle}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 mb-2">
                              {categoryName}
                            </Badge>
                            <h3 className="text-base text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors line-clamp-2 mb-2">
                              {decodedTitle}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                              {sanitizedExcerpt}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                              <Clock className="w-3 h-3" />
                              <span>{`${article.readingTime} min read`}</span>
                            </div>
                          </Link>
                        );
                      })
                      : fallbackTrendingArticles.map((article) => (
                        <Link
                          key={article.id}
                          href={getPath(`/${article.category.toLowerCase().replace(' ', '-')}/${article.id}`)}
                          className="group cursor-pointer block"
                        >
                          <div className="aspect-video overflow-hidden mb-3">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 mb-2">
                            {article.category}
                          </Badge>
                          <h3 className="text-base text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors line-clamp-2 mb-2">
                            {article.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{article.readTime}</span>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* Middle Banner Ad - After Main Section */}
        <div className="border-t border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-4">
              {getAdBanner('home_page_ad3') ? (
                <div 
                  className="w-full max-w-5xl"
                  dangerouslySetInnerHTML={{ __html: getAdBanner('home_page_ad3')!.content }}
                />
              ) : (
                <div className="w-full max-w-5xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 border dark:border-gray-600 p-3 text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {/* Advertisement Banner 3 */}
                    📰 Advertisement Banner - 728x90
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Sections */}
        {categorySections.length > 0 ? (
          categorySections.map((section, index) => (
            <section
              key={section.category.id}
              className="py-8 border-b dark:border-gray-700"
              style={{
                backgroundColor: section.sectionBackgroundColor || '#f9fafb',
              }}
            >
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-amber-900 dark:text-amber-100 text-2xl">
                    {decodeHTMLEntities(section.sectionTitle)}
                  </h2>
                  <Link
                    href={getPath(section.viewAllButtonUrl)}
                    className="text-amber-700 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-600 flex items-center gap-1 text-sm"
                  >
                    {section.viewAllButtonLabel}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {section.posts.length > 0 ? (
                    section.posts.map((post) => {
                      const decodedTitle = decodeHTMLEntities(post.title);
                      const formattedDate = new Date(post.date).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      });
                      return (
                        <Link
                          key={post.id}
                          href={getPath(`/${section.category.slug}/${post.slug}`)}
                          className="bg-white dark:bg-gray-800 border dark:border-gray-700 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow block"
                        >
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={post.featuredImage}
                              alt={decodedTitle}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="p-4">
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mb-2">
                              {decodeHTMLEntities(section.category.name)}
                            </Badge>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                              <span>{formattedDate}</span>
                              <span>•</span>
                              <span>{post.readingTime} min read</span>
                            </div>
                            <h3 className="text-base text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors line-clamp-2">
                              {decodedTitle}
                            </h3>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    // Fallback to mock articles if no posts
                    mockArticles.slice(0, 4).map((article) => (
                      <Link
                        key={article.id}
                        href={getPath(`/${article.category.toLowerCase().replace(' ', '-')}/${article.id}`)}
                        className="bg-white dark:bg-gray-800 border dark:border-gray-700 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow block"
                      >
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-4">
                          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mb-2">
                            {article.category}
                          </Badge>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                            <span>{article.date}</span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                          </div>
                          <h3 className="text-base text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </section>
          ))
        ) : (
          // Fallback to mock sections if no category sections
          mockArticles.slice(0, 4).map((article, index) => (
            <section
              key={index}
              className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 py-8 border-b dark:border-gray-700"
            >
              <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-amber-900 dark:text-amber-100 text-2xl">
                    {t.interview}
                  </h2>
                  <button className="text-amber-700 dark:text-amber-500 hover:text-amber-800 dark:hover:text-amber-600 flex items-center gap-1 text-sm">
                    {t.viewAll}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockArticles.slice(0, 4).map((article) => (
                    <Link
                      key={article.id}
                      href={getPath(`/${article.category.toLowerCase().replace(' ', '-')}/${article.id}`)}
                      className="bg-white dark:bg-gray-800 border dark:border-gray-700 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow block"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mb-2">
                          {article.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
                          <span>{article.date}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>
                        <h3 className="text-base text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))
        )}

        {/* New Spotlight Section - Left Card + Right Listing */}
        <section className="py-8 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-amber-900 dark:text-amber-100 text-2xl">
                {spotlightData ? decodeHTMLEntities(spotlightData.sectionTitle) : getCategoryTranslation('Spotlight', locale)}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Sidebar - Featured Card + Ads */}
              <aside className="lg:col-span-4">
                <div className="sticky top-24">
                  {/* Featured Article Card */}
                  {spotlightData ? (
                    <Link
                      href={getPath(spotlightData?.buttonLink || '')}
                      target="_blank"
                      className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 mb-6 cursor-pointer block"
                    >
                      <div className="h-56 overflow-hidden mb-4 relative">
                        <img
                          src={spotlightData.image}
                          alt={decodeHTMLEntities(spotlightData.title)}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <h3 className="text-xl mb-3 text-amber-900 dark:text-amber-100 hover:text-amber-700 dark:hover:text-amber-500 transition-colors">
                        {decodeHTMLEntities(spotlightData.title)}
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {decodeHTMLEntities(spotlightData.description)}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-md transition-colors">
                          {spotlightData.buttonLabel}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  ) : (
                    // Fallback to mock article
                    <Link
                      href={getPath(`/${spotlightArticles[0].category.toLowerCase().replace(' ', '-')}/${spotlightArticles[0].id}`)}
                      className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 mb-6 cursor-pointer block"
                    >
                      <div className="h-56 overflow-hidden mb-4 relative">
                        <img
                          src="https://qahwaworld.com/wp-content/uploads/2023/04/mokha-view2.jpg"
                          alt="Custom Spotlight"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <h3 className="text-xl mb-3 text-amber-900 dark:text-amber-100 hover:text-amber-700 dark:hover:text-amber-500 transition-colors">
                        Mokha 1450 / Coffee Boutique Al Wasl Rd Dubai
                      </h3>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        One such story combines all these classic ingredients. It
                        began in Yemen at the ancient port of Mokha in 1450. For
                        it is here the heart of coffee culture first started to
                        beat and as this tale began to unfold, a tradition emerged
                        that would forever change the World.
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                        <span className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white px-4 py-2 rounded-md transition-colors">
                          {t.readMore}
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </Link>
                  )}

                  {/* MPU Ad Unit (300x250) */}
                  {getAdBanner('home_page_ad4') ? (
                    <div className="mb-6">
                      <div 
                        dangerouslySetInnerHTML={{ __html: getAdBanner('home_page_ad4')!.content }}
                      />
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border dark:border-gray-600 p-6 mb-6">
                      <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="w-16 h-16 bg-amber-200 dark:bg-amber-700 mb-4 flex items-center justify-center">
                          <span className="text-2xl">📢</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {/* Advertisement Banner 4 */}
                          Advertisement Banner - 300x250
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          MPU 300x250
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </aside>

              {/* Right Content - Article Listings */}
              <main className="lg:col-span-8">
                <div className="space-y-4">
                  {spotlightData && spotlightData.posts.length > 0 ? (
                    spotlightData.posts.map((post) => {
                      const decodedTitle = decodeHTMLEntities(post.title);
                      const primaryCategory = post.categories?.[0];
                      const categorySlug = primaryCategory?.slug || spotlightData.category.slug;
                      const categoryName = primaryCategory?.name || spotlightData.category.name;
                      const formattedDate = new Date(post.date).toLocaleDateString(locale, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      });

                      return (
                        <Link
                          key={post.id}
                          href={getPath(`/${categorySlug}/${post.slug}`)}
                          className="bg-white dark:bg-gray-800 border dark:border-gray-700 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow block"
                        >
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-80 h-48 overflow-hidden flex-shrink-0">
                              <img
                                src={post.featuredImage}
                                alt={decodedTitle}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <div className="flex-1 p-4 md:py-4 md:pr-4 md:pl-0">
                              <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mb-2">
                                {decodeHTMLEntities(categoryName)}
                              </Badge>
                              <h3 className="text-xl mb-3 text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors line-clamp-2">
                                {decodedTitle}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                {sanitizeExcerpt(post.excerpt)}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                                <span>{post.author}</span>
                                <span>•</span>
                                <span>{formattedDate}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {post.readingTime} min read
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  ) : (
                    // Fallback to mock articles
                    moreArticles.map((article) => (
                      <Link
                        key={article.id}
                        href={getPath(`/${article.category.toLowerCase().replace(' ', '-')}/${article.id}`)}
                        className="bg-white dark:bg-gray-800 border dark:border-gray-700 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow block"
                      >
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="md:w-80 h-48 overflow-hidden flex-shrink-0">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                          <div className="flex-1 p-4 md:py-4 md:pr-4 md:pl-0">
                            <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 mb-2">
                              {article.category}
                            </Badge>
                            <h3 className="text-xl mb-3 text-gray-900 dark:text-gray-100 group-hover:text-amber-700 dark:group-hover:text-amber-500 transition-colors line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {article.excerpt}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                              <span>{article.author}</span>
                              <span>•</span>
                              <span>{article.date}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {article.readTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </main>
            </div>
          </div>
        </section>

        {/* Bottom Banner Ad - Above Footer */}
        <div className="border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center py-4">
              {getAdBanner('home_page_ad5') ? (
                <div 
                  className="w-full max-w-5xl"
                  dangerouslySetInnerHTML={{ __html: getAdBanner('home_page_ad5')!.content }}
                />
              ) : (
                <div className="w-full max-w-5xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 border dark:border-gray-600 p-3 text-center">
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {/* Advertisement Banner 5 */}
                    📰 Advertisement Banner - 728x90
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export { HomePage };
