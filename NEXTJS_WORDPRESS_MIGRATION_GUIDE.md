# Next.js + Headless WordPress Migration Guide for Qahwa World

## 🎯 Project Overview
This guide will help you transform your current Vite + React project into a **Next.js 14+ application** with **WordPress as a headless CMS** and **multilingual support (EN/AR/RU)**.

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [WordPress Backend Setup](#wordpress-backend-setup)
3. [Next.js Frontend Setup](#nextjs-frontend-setup)
4. [Migration Steps](#migration-steps)
5. [File Structure](#file-structure)
6. [Implementation Examples](#implementation-examples)
7. [Deployment](#deployment)

---

## 🏗️ Architecture Overview

### Current Stack (Vite + React)
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Radix UI
- **State**: React Context (Theme + Language)
- **Data**: Mock data (mockArticles.ts)
- **Routing**: Custom state-based navigation

### Target Stack (Next.js + WordPress)
- **Frontend**: Next.js 14+ (App Router)
- **CMS**: WordPress 6.4+ (Headless)
- **API**: WordPress REST API + WPGraphQL
- **Multilingual**: WPML or Polylang
- **Styling**: Keep Tailwind CSS + Radix UI
- **Caching**: Next.js ISR (Incremental Static Regeneration)
- **Deployment**: Vercel/Netlify

---

## 🔧 WordPress Backend Setup

### Step 1: WordPress Installation

1. **Install WordPress** (Latest Version)
   ```bash
   # Local development options:
   # - Local by Flywheel (recommended)
   # - XAMPP/MAMP
   # - Docker
   # - WordPress.com with Business plan
   ```

2. **Required WordPress Plugins**
   ```
   ✅ WPGraphQL (v1.22+)
   ✅ WPGraphQL for Advanced Custom Fields (ACF)
   ✅ WPML Multilingual CMS or Polylang
   ✅ WPGraphQL WPML Extension
   ✅ Advanced Custom Fields (ACF) Pro
   ✅ Yoast SEO or Rank Math
   ✅ WP REST API Controller (optional)
   ✅ JWT Authentication for WP REST API (if needed for admin)
   ```

### Step 2: Configure WordPress for Headless

1. **Enable Pretty Permalinks**
   - Go to Settings → Permalinks
   - Select "Post name" structure
   - Save changes

2. **Install & Activate WPGraphQL**
   ```bash
   # Via WordPress Admin:
   Plugins → Add New → Search "WPGraphQL" → Install → Activate
   
   # GraphQL IDE will be available at:
   # https://your-wordpress-site.com/graphql
   ```

3. **Configure CORS (if WordPress and Next.js are on different domains)**
   
   Add to `wp-config.php`:
   ```php
   // Enable CORS for headless setup
   header("Access-Control-Allow-Origin: *");
   header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
   header("Access-Control-Allow-Headers: Content-Type, Authorization");
   ```

   Or use plugin: "WP GraphQL CORS"

### Step 3: Setup Multilingual Support

#### Option A: WPML (Premium - Recommended)

1. **Install WPML**
   ```
   - WPML Multilingual CMS
   - WPML String Translation
   - WPML Media Translation
   ```

2. **Configure Languages**
   - Go to WPML → Languages
   - Add languages: English, Arabic, Russian
   - Set default language: English
   - Set language switcher options

3. **Install WPGraphQL WPML Extension**
   ```bash
   # Download from GitHub:
   # https://github.com/rburgst/wp-graphql-wpml
   ```

#### Option B: Polylang (Free Alternative)

1. **Install Polylang**
   ```
   Plugins → Add New → Search "Polylang" → Install → Activate
   ```

2. **Install WPGraphQL Polylang Extension**
   ```bash
   # Download from GitHub:
   # https://github.com/valu-digital/wp-graphql-polylang
   ```

3. **Configure Languages**
   - Go to Languages → Settings
   - Add English (en), Arabic (ar), Russian (ru)
   - Set URL modifications (subdirectories recommended)

### Step 4: Create Custom Post Types & Fields

#### Create "Articles" Custom Post Type

Add to `functions.php` or use Custom Post Type UI plugin:

```php
function qahwa_register_article_post_type() {
    $labels = array(
        'name' => 'Articles',
        'singular_name' => 'Article',
        'menu_name' => 'Articles',
        'add_new' => 'Add New Article',
        'add_new_item' => 'Add New Article',
        'edit_item' => 'Edit Article',
        'view_item' => 'View Article',
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'article',
        'graphql_plural_name' => 'articles',
        'supports' => array('title', 'editor', 'excerpt', 'thumbnail', 'author'),
        'rewrite' => array('slug' => 'articles'),
        'taxonomies' => array('category', 'post_tag'),
    );

    register_post_type('article', $args);
}
add_action('init', 'qahwa_register_article_post_type');
```

#### Create Custom Taxonomies

```php
// Categories for Coffee Content
function qahwa_register_taxonomies() {
    // Coffee Categories
    register_taxonomy('coffee_category', 'article', array(
        'label' => 'Coffee Categories',
        'hierarchical' => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'coffeeCategory',
        'graphql_plural_name' => 'coffeeCategories',
    ));

    // Tags
    register_taxonomy('coffee_tag', 'article', array(
        'label' => 'Coffee Tags',
        'hierarchical' => false,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'coffeeTag',
        'graphql_plural_name' => 'coffeeTags',
    ));
}
add_action('init', 'qahwa_register_taxonomies');
```

#### Create ACF Fields for Articles

Using ACF, create a field group "Article Details":

```
Field Group: Article Details
- Apply to: Post Type = article

Fields:
1. Read Time (text)
2. Featured (true/false)
3. Author Bio (textarea)
4. External Image URL (url) - optional
5. Article Content Rich (wysiwyg)
```

### Step 5: Configure WPGraphQL Settings

1. Go to **GraphQL → Settings**
2. Enable **Public Introspection** (for development)
3. Set **GraphQL Endpoint**: `/graphql`
4. Enable **Show in GraphQL** for:
   - Articles post type
   - Categories
   - Tags
   - Media
   - Users/Authors

### Step 6: Import Your Mock Data

Create a simple PHP script or use WP All Import plugin to migrate your mock data:

```php
// Import script - add to functions.php temporarily
function qahwa_import_mock_articles() {
    $mock_articles = array(
        array(
            'title' => 'Larger sizes are setting up specialty coffee division',
            'content' => 'Full article content here...',
            'excerpt' => 'As specialty coffee continues to grow...',
            'category' => 'News',
            'tags' => array('Specialty Coffee', 'Business', 'Industry Trends'),
            'read_time' => '5 min read',
            'featured' => true,
            'image_url' => 'https://images.unsplash.com/photo-1521017432531...',
        ),
        // Add more articles...
    );

    foreach ($mock_articles as $article) {
        $post_id = wp_insert_post(array(
            'post_title' => $article['title'],
            'post_content' => $article['content'],
            'post_excerpt' => $article['excerpt'],
            'post_status' => 'publish',
            'post_type' => 'article',
        ));

        if ($post_id) {
            // Set category
            wp_set_object_terms($post_id, $article['category'], 'coffee_category');
            
            // Set tags
            wp_set_object_terms($post_id, $article['tags'], 'coffee_tag');
            
            // Set ACF fields
            update_field('read_time', $article['read_time'], $post_id);
            update_field('featured', $article['featured'], $post_id);
        }
    }
}
// Run once: qahwa_import_mock_articles();
```

### Step 7: Test GraphQL Queries

Visit `https://your-wordpress-site.com/graphql` and test:

```graphql
query GetArticles {
  articles(first: 10, where: {language: EN}) {
    nodes {
      id
      title
      excerpt
      date
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      coffeeCategories {
        nodes {
          name
          slug
        }
      }
      coffeeTags {
        nodes {
          name
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
      articleDetails {
        readTime
        featured
      }
    }
  }
}
```

---

## 🚀 Next.js Frontend Setup

### Step 1: Create Next.js Project

```bash
# Navigate to your project directory
cd c:/Users/workp/Desktop

# Create new Next.js project with TypeScript
npx create-next-app@latest qahwaworld-nextjs --typescript --tailwind --app --src-dir

# Choose options:
# ✅ TypeScript
# ✅ ESLint
# ✅ Tailwind CSS
# ✅ src/ directory
# ✅ App Router
# ✅ Customize default import alias (@/*)
```

### Step 2: Install Required Dependencies

```bash
cd qahwaworld-nextjs

# Install core dependencies
npm install graphql graphql-request @apollo/client

# Install UI libraries (from your current project)
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip

# Install utilities
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react
npm install sonner
npm install next-themes
npm install embla-carousel-react

# Install dev dependencies
npm install -D @types/node
```

### Step 3: Environment Variables

Create `.env.local`:

```bash
# WordPress API Configuration
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
WORDPRESS_AUTH_REFRESH_TOKEN=your_token_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LANGUAGE=en

# Optional: Preview mode secret
WORDPRESS_PREVIEW_SECRET=your_preview_secret_here
```

---

## 📁 File Structure

```
qahwaworld-nextjs/
├── src/
│   ├── app/
│   │   ├── [locale]/                  # Locale-based routing
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx              # Home page
│   │   │   ├── articles/
│   │   │   │   ├── page.tsx          # Articles listing
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx      # Single article
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── author/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx
│   │   │   ├── about/
│   │   │   │   └── page.tsx
│   │   │   ├── contact/
│   │   │   │   └── page.tsx
│   │   │   └── search/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── preview/
│   │   │   │   └── route.ts
│   │   │   └── revalidate/
│   │   │       └── route.ts
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── articles/
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── ArticleGrid.tsx
│   │   │   ├── ArticleDetail.tsx
│   │   │   └── FeaturedArticle.tsx
│   │   ├── ui/                       # Keep your existing UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── providers/
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── LanguageProvider.tsx
│   │   └── SEO/
│   │       └── Metadata.tsx
│   ├── lib/
│   │   ├── wordpress/
│   │   │   ├── client.ts            # GraphQL client
│   │   │   ├── queries.ts           # GraphQL queries
│   │   │   ├── mutations.ts
│   │   │   └── api.ts               # API helper functions
│   │   ├── utils/
│   │   │   ├── cn.ts               # className utility
│   │   │   └── formatting.ts
│   │   └── constants.ts
│   ├── types/
│   │   ├── wordpress.ts            # WordPress types
│   │   ├── article.ts
│   │   └── index.ts
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── en.json            # UI translations (buttons, labels, etc.)
│   │   │   ├── ar.json
│   │   │   └── ru.json
│   │   ├── config.ts               # i18n configuration
│   │   └── request.ts              # Translation helper
│   └── middleware.ts                # Locale detection & routing
├── public/
│   ├── images/
│   └── locales/
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🌍 Internationalization (i18n) Deep Dive

### How i18n Works in This Setup

The internationalization system has **two layers**:

1. **UI Translations** (Static - from JSON files in Next.js)
   - Button labels, navigation menus, error messages
   - Stored in `src/i18n/locales/{en,ar,ru}.json`
   - Loaded client-side for UI elements

2. **Content Translations** (Dynamic - from WordPress)
   - Articles, categories, tags, author bios
   - Stored in WordPress with WPML/Polylang
   - Fetched via GraphQL with language parameter

---

### Architecture Diagram

```
User visits /ar/articles/coffee-history
           ↓
   [Next.js Middleware]
           ↓
   Detects locale: 'ar'
           ↓
   ┌─────────────────────────────────────┐
   │                                     │
   ↓                                     ↓
[Load UI Translations]         [Fetch WordPress Content]
   ar.json from Next.js           GraphQL query with
   - "Home" → "الرئيسية"            language: AR
   - "Search" → "بحث"               - Arabic article content
   - "Read More" → "اقرأ المزيد"    - Arabic categories
   ↓                                     ↓
   └─────────────────┬─────────────────┘
                     ↓
            [Render Page with locale='ar']
            - UI in Arabic (from JSON)
            - Content in Arabic (from WordPress)
            - dir="rtl" for right-to-left layout
```

---

### Step-by-Step: How Language Data Flows

#### Step 1: WordPress Multilingual Setup

When you setup WPML or Polylang in WordPress:

```php
// WordPress stores content like this:

Post ID: 123 (English version)
- Title: "The History of Coffee"
- Content: "Coffee originated in Ethiopia..."
- Language: EN

Post ID: 124 (Arabic version - linked translation)
- Title: "تاريخ القهوة"
- Content: "نشأت القهوة في إثيوبيا..."
- Language: AR

Post ID: 125 (Russian version - linked translation)
- Title: "История кофе"
- Content: "Кофе возникло в Эфиопии..."
- Language: RU
```

These posts are **linked** as translations of each other. WordPress knows they're the same content in different languages.

---

#### Step 2: GraphQL Language Filtering

When Next.js requests data, it passes the language code:

**Query for English Content:**
```graphql
query GetArticles {
  articles(first: 10, where: { language: EN }) {
    nodes {
      id
      title  # "The History of Coffee"
      excerpt
      slug   # "history-of-coffee"
    }
  }
}
```

**Query for Arabic Content:**
```graphql
query GetArticles {
  articles(first: 10, where: { language: AR }) {
    nodes {
      id
      title  # "تاريخ القهوة"
      excerpt
      slug   # "history-of-coffee-ar" or "تاريخ-القهوة"
    }
  }
}
```

**WordPress returns ONLY the content in the requested language.**

---

#### Step 3: Next.js Middleware (Automatic Locale Detection)

The middleware intercepts every request and handles locale routing:

**File: `src/middleware.ts`**

```typescript
import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ar', 'ru'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Example: User visits "/articles/coffee-history"
  
  // Check if URL already has locale prefix
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    // URL is already like "/en/articles/..." - do nothing
    return;
  }

  // No locale in URL - detect it
  // 1. Check Accept-Language header from browser
  const browserLang = request.headers
    .get('accept-language')
    ?.split(',')[0]
    .split('-')[0]; // Gets 'ar' from 'ar-SA,ar;q=0.9'

  // 2. Use detected language or fallback to default
  const locale = locales.includes(browserLang || '') ? browserLang : defaultLocale;

  // 3. Redirect to locale-prefixed URL
  // "/articles/coffee-history" → "/ar/articles/coffee-history"
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!_next|api|images|favicon.ico).*)',
  ],
};
```

**What happens:**
- User in Saudi Arabia visits `yoursite.com/articles/coffee-history`
- Browser sends `Accept-Language: ar-SA`
- Middleware detects `ar`
- Redirects to `yoursite.com/ar/articles/coffee-history`

---

#### Step 4: Page Component with Locale

**File: `src/app/[locale]/articles/[slug]/page.tsx`**

```typescript
export default async function ArticlePage({
  params: { slug, locale }, // ← locale comes from URL path
}: {
  params: { slug: string; locale: string };
}) {
  // locale = 'ar' (from URL)
  // slug = 'coffee-history'
  
  // Fetch article in the specified language
  const article = await getArticleBySlug(slug, locale);
  
  // Load UI translations for this locale
  const t = await getTranslations(locale);
  
  return (
    <article>
      <h1>{article.title}</h1> {/* Arabic title from WordPress */}
      <button>{t.readMore}</button> {/* "اقرأ المزيد" from ar.json */}
    </article>
  );
}
```

---

#### Step 5: API Helper with Language Parameter

**File: `src/lib/wordpress/api.ts`**

```typescript
export async function getArticleBySlug(
  slug: string,
  locale: string = 'EN'
): Promise<Article | null> {
  try {
    // Convert locale to uppercase for WordPress
    // 'ar' → 'AR', 'en' → 'EN', 'ru' → 'RU'
    const wpLanguage = locale.toUpperCase();
    
    const data = await graphqlClient.request(
      GET_ARTICLE_BY_SLUG,
      {
        slug: slug,
        language: wpLanguage, // ← Pass language to WordPress
      }
    );
    
    return data.article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}
```

---

### UI Translations (Static Text)

For static UI elements (buttons, labels, navigation), use JSON files:

**File: `src/i18n/locales/en.json`**
```json
{
  "navigation": {
    "home": "Home",
    "about": "About Us",
    "contact": "Contact",
    "search": "Search"
  },
  "article": {
    "readMore": "Read More",
    "publishedOn": "Published on",
    "author": "Author",
    "categories": "Categories",
    "tags": "Tags"
  },
  "common": {
    "loading": "Loading...",
    "error": "An error occurred",
    "noResults": "No results found"
  }
}
```

**File: `src/i18n/locales/ar.json`**
```json
{
  "navigation": {
    "home": "الرئيسية",
    "about": "من نحن",
    "contact": "اتصل بنا",
    "search": "بحث"
  },
  "article": {
    "readMore": "اقرأ المزيد",
    "publishedOn": "نشر في",
    "author": "المؤلف",
    "categories": "الفئات",
    "tags": "الوسوم"
  },
  "common": {
    "loading": "جار التحميل...",
    "error": "حدث خطأ",
    "noResults": "لا توجد نتائج"
  }
}
```

**File: `src/i18n/locales/ru.json`**
```json
{
  "navigation": {
    "home": "Главная",
    "about": "О нас",
    "contact": "Контакты",
    "search": "Поиск"
  },
  "article": {
    "readMore": "Читать далее",
    "publishedOn": "Опубликовано",
    "author": "Автор",
    "categories": "Категории",
    "tags": "Теги"
  },
  "common": {
    "loading": "Загрузка...",
    "error": "Произошла ошибка",
    "noResults": "Результатов не найдено"
  }
}
```

---

### Translation Helper Function

**File: `src/i18n/request.ts`**

```typescript
import 'server-only';
import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`./locales/${locale}.json`)).default,
}));
```

**Or simpler version without next-intl:**

```typescript
import en from './locales/en.json';
import ar from './locales/ar.json';
import ru from './locales/ru.json';

const translations = { en, ar, ru };

export function getTranslations(locale: string) {
  return translations[locale as keyof typeof translations] || translations.en;
}

// Usage in components:
const t = getTranslations(locale);
console.log(t.navigation.home); // "الرئيسية" for Arabic
```

---

### Using Translations in Components

**Example 1: Server Component**

```typescript
// src/app/[locale]/page.tsx
import { getTranslations } from '@/i18n/request';
import { getAllArticles } from '@/lib/wordpress/api';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // Get UI translations
  const t = getTranslations(locale);
  
  // Get content from WordPress (in correct language)
  const articles = await getAllArticles(locale);

  return (
    <div>
      <h1>{t.navigation.home}</h1> {/* UI translation */}
      
      {articles.map((article) => (
        <div key={article.id}>
          <h2>{article.title}</h2> {/* WordPress content */}
          <p>{article.excerpt}</p>
          <button>{t.article.readMore}</button> {/* UI translation */}
        </div>
      ))}
    </div>
  );
}
```

**Example 2: Header Component**

```typescript
// src/components/layout/Header.tsx
'use client';

import { getTranslations } from '@/i18n/request';
import Link from 'next/link';

export function Header({ locale }: { locale: string }) {
  const t = getTranslations(locale);

  return (
    <header>
      <nav>
        <Link href={`/${locale}`}>{t.navigation.home}</Link>
        <Link href={`/${locale}/about`}>{t.navigation.about}</Link>
        <Link href={`/${locale}/contact`}>{t.navigation.contact}</Link>
        
        {/* Language switcher */}
        <LanguageSwitcher currentLocale={locale} />
      </nav>
    </header>
  );
}
```

---

### Language Switcher Component

**File: `src/components/layout/LanguageSwitcher.tsx`**

```typescript
'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export function LanguageSwitcher({ currentLocale }: { currentLocale: string }) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (newLocale: string) => {
    // Current path: /ar/articles/coffee-history
    // Remove current locale: /articles/coffee-history
    const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');
    
    // Add new locale: /en/articles/coffee-history
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-5 h-5" />
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLanguage(lang.code)}
          className={`px-3 py-1 rounded ${
            currentLocale === lang.code
              ? 'bg-amber-700 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {lang.flag} {lang.label}
        </button>
      ))}
    </div>
  );
}
```

---

### How WordPress Handles Translations

#### With WPML:

1. **Create Article in English:**
   - Title: "The History of Coffee"
   - Slug: `history-of-coffee`
   - Language: English

2. **Add Translation (Arabic):**
   - Click "+" next to Arabic flag in WPML
   - Translate all fields
   - Title: "تاريخ القهوة"
   - Slug: `تاريخ-القهوة` (or keep English slug)
   - WordPress links them automatically

3. **GraphQL Query Returns Translations:**
```graphql
query GetArticle($slug: ID!) {
  article(id: $slug, idType: SLUG) {
    id
    title
    translations {  # ← Available translations
      slug
      language {
        code  # EN, AR, RU
      }
    }
  }
}
```

**Response:**
```json
{
  "article": {
    "id": "123",
    "title": "The History of Coffee",
    "translations": [
      { "slug": "تاريخ-القهوة", "language": { "code": "AR" } },
      { "slug": "история-кофе", "language": { "code": "RU" } }
    ]
  }
}
```

---

### Complete Data Flow Example

Let's trace a complete request:

**Scenario:** Arabic user clicks on an article

```
1. User clicks: "تاريخ القهوة"
   ↓
2. Browser navigates to: /ar/articles/تاريخ-القهوة
   ↓
3. Middleware detects: locale = 'ar'
   ↓
4. Next.js calls: ArticlePage({ params: { locale: 'ar', slug: 'تاريخ-القهوة' }})
   ↓
5. Component calls: getArticleBySlug('تاريخ-القهوة', 'ar')
   ↓
6. API sends GraphQL query:
   {
     slug: "تاريخ-القهوة",
     language: AR  ← Filters to Arabic content only
   }
   ↓
7. WordPress returns:
   {
     title: "تاريخ القهوة",
     content: "نشأت القهوة في إثيوبيا...",
     excerpt: "اكتشف أصول القهوة..."
   }
   ↓
8. Component loads UI translations: ar.json
   {
     readMore: "اقرأ المزيد",
     author: "المؤلف"
   }
   ↓
9. Page renders:
   - HTML dir="rtl" (right-to-left)
   - Title: "تاريخ القهوة" (from WordPress)
   - Button: "اقرأ المزيد" (from ar.json)
   - Content: Arabic text (from WordPress)
```

---

### Layout Direction (RTL/LTR)

Arabic requires right-to-left layout:

**File: `src/app/[locale]/layout.tsx`**

```typescript
export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html 
      lang={locale}
      dir={locale === 'ar' ? 'rtl' : 'ltr'}  // ← Automatic RTL for Arabic
    >
      <body>
        {children}
      </body>
    </html>
  );
}
```

**CSS handles the rest automatically:**
```css
/* Tailwind automatically flips these for RTL: */
/* ml-4 becomes mr-4 in RTL */
/* text-left becomes text-right in RTL */
/* etc. */
```

---

### URL Structure Options

You have 3 options for URL structure:

#### Option 1: Subdirectories (Recommended)
```
yoursite.com/en/articles/coffee-history
yoursite.com/ar/articles/coffee-history
yoursite.com/ru/articles/coffee-history
```
✅ Clear language separation
✅ Easy to implement
✅ Good for SEO

#### Option 2: Subdomains
```
en.yoursite.com/articles/coffee-history
ar.yoursite.com/articles/coffee-history
ru.yoursite.com/articles/coffee-history
```
✅ Language completely separate
❌ More complex DNS setup
❌ Requires subdomain configuration

#### Option 3: Query Parameters
```
yoursite.com/articles/coffee-history?lang=en
yoursite.com/articles/coffee-history?lang=ar
```
❌ Not SEO friendly
❌ Not recommended for this use case

**We use Option 1 (subdirectories)** in this guide.

---

### SEO for Multilingual Sites

**Add `hreflang` tags for SEO:**

```typescript
// src/app/[locale]/articles/[slug]/page.tsx
export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(slug, locale);

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      languages: {
        en: `/en/articles/${article.translations?.find(t => t.language.code === 'EN')?.slug}`,
        ar: `/ar/articles/${article.translations?.find(t => t.language.code === 'AR')?.slug}`,
        ru: `/ru/articles/${article.translations?.find(t => t.language.code === 'RU')?.slug}`,
      },
    },
  };
}
```

**Generates HTML:**
```html
<link rel="alternate" hreflang="en" href="https://yoursite.com/en/articles/coffee-history" />
<link rel="alternate" hreflang="ar" href="https://yoursite.com/ar/articles/تاريخ-القهوة" />
<link rel="alternate" hreflang="ru" href="https://yoursite.com/ru/articles/история-кофе" />
```

---

### Testing Your i18n Setup

**Test Checklist:**

1. **URL Detection:**
   ```bash
   # Visit root without locale
   curl -I http://localhost:3000/
   # Should redirect to /en/ or /ar/ based on Accept-Language
   ```

2. **GraphQL Filtering:**
   ```graphql
   # Test in GraphiQL
   query { articles(where: {language: AR}) { nodes { title } } }
   ```

3. **UI Translations:**
   ```typescript
   // Check all JSON files load correctly
   const t = getTranslations('ar');
   console.log(t.navigation.home); // Should print: "الرئيسية"
   ```

4. **Language Switcher:**
   - Click each language
   - Verify URL changes
   - Verify content changes
   - Verify UI labels change

5. **RTL Layout:**
   - Switch to Arabic
   - Check text alignment (right-aligned)
   - Check navigation (flipped)
   - Check scrollbars (on left side)

---

### Summary: Two-Layer Translation System

| Layer | Source | What it Translates | How it's Loaded |
|-------|--------|-------------------|----------------|
| **UI Translations** | JSON files in Next.js | Buttons, labels, navigation, error messages | Loaded at build time or on-demand |
| **Content Translations** | WordPress database | Articles, categories, tags, pages | Fetched via GraphQL with language filter |

**Example Page Composition:**

```typescript
// English version (locale='en')
<article>
  <h1>{article.title}</h1>              {/* "The History of Coffee" - from WordPress */}
  <button>{t.article.readMore}</button> {/* "Read More" - from en.json */}
  <p>{article.content}</p>              {/* Article content - from WordPress */}
</article>

// Arabic version (locale='ar', dir='rtl')
<article dir="rtl">
  <h1>{article.title}</h1>              {/* "تاريخ القهوة" - from WordPress */}
  <button>{t.article.readMore}</button> {/* "اقرأ المزيد" - from ar.json */}
  <p>{article.content}</p>              {/* Arabic content - from WordPress */}
</article>
```

---

## 💻 Implementation Examples

### 1. GraphQL Client Setup

Create `src/lib/wordpress/client.ts`:

```typescript
import { GraphQLClient } from 'graphql-request';

const endpoint = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
  },
});

// For server-side requests with auth
export const authenticatedClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`,
  },
});
```

### 2. GraphQL Queries

Create `src/lib/wordpress/queries.ts`:

```typescript
import { gql } from 'graphql-request';

export const GET_ALL_ARTICLES = gql`
  query GetAllArticles($first: Int = 100, $language: LanguageCodeFilterEnum) {
    articles(first: $first, where: { language: $language }) {
      nodes {
        id
        databaseId
        title
        excerpt
        slug
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        coffeeCategories {
          nodes {
            name
            slug
          }
        }
        coffeeTags {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
            slug
            avatar {
              url
            }
          }
        }
        articleDetails {
          readTime
          featured
        }
      }
    }
  }
`;

export const GET_ARTICLE_BY_SLUG = gql`
  query GetArticleBySlug($slug: ID!, $language: LanguageCodeEnum) {
    article(id: $slug, idType: SLUG) {
      id
      title
      content
      excerpt
      date
      modified
      slug
      featuredImage {
        node {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
      coffeeCategories {
        nodes {
          name
          slug
        }
      }
      coffeeTags {
        nodes {
          name
          slug
        }
      }
      author {
        node {
          name
          slug
          description
          avatar {
            url
          }
        }
      }
      articleDetails {
        readTime
        featured
      }
      seo {
        title
        metaDesc
        opengraphImage {
          sourceUrl
        }
      }
      translations {
        slug
        language {
          code
        }
      }
    }
  }
`;

export const GET_ARTICLES_BY_CATEGORY = gql`
  query GetArticlesByCategory($categorySlug: String!, $language: LanguageCodeFilterEnum) {
    articles(
      where: {
        coffeeCategory: $categorySlug
        language: $language
      }
    ) {
      nodes {
        id
        title
        excerpt
        slug
        date
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        coffeeCategories {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
          }
        }
        articleDetails {
          readTime
        }
      }
    }
  }
`;

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories($language: LanguageCodeFilterEnum) {
    coffeeCategories(where: { language: $language }) {
      nodes {
        id
        name
        slug
        count
        description
      }
    }
  }
`;
```

### 3. API Helper Functions

Create `src/lib/wordpress/api.ts`:

```typescript
import { graphqlClient } from './client';
import * as queries from './queries';
import type { Article, Category } from '@/types/wordpress';

export async function getAllArticles(locale: string = 'EN'): Promise<Article[]> {
  try {
    const data = await graphqlClient.request(queries.GET_ALL_ARTICLES, {
      language: locale.toUpperCase(),
    });
    return data.articles.nodes;
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleBySlug(
  slug: string,
  locale: string = 'EN'
): Promise<Article | null> {
  try {
    const data = await graphqlClient.request(queries.GET_ARTICLE_BY_SLUG, {
      slug,
      language: locale.toUpperCase(),
    });
    return data.article;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function getArticlesByCategory(
  categorySlug: string,
  locale: string = 'EN'
): Promise<Article[]> {
  try {
    const data = await graphqlClient.request(queries.GET_ARTICLES_BY_CATEGORY, {
      categorySlug,
      language: locale.toUpperCase(),
    });
    return data.articles.nodes;
  } catch (error) {
    console.error('Error fetching articles by category:', error);
    return [];
  }
}

export async function getAllCategories(locale: string = 'EN'): Promise<Category[]> {
  try {
    const data = await graphqlClient.request(queries.GET_ALL_CATEGORIES, {
      language: locale.toUpperCase(),
    });
    return data.coffeeCategories.nodes;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
```

### 4. Next.js Middleware for i18n

Create `src/middleware.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'ar', 'ru'];
const defaultLocale = 'en';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Detect locale from Accept-Language header or use default
  const locale = request.headers
    .get('accept-language')
    ?.split(',')[0]
    .split('-')[0] || defaultLocale;

  const selectedLocale = locales.includes(locale) ? locale : defaultLocale;

  // Redirect to locale-prefixed URL
  request.nextUrl.pathname = `/${selectedLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, images, etc)
    '/((?!_next|api|images|favicon.ico).*)',
  ],
};
```

### 5. Layout with Providers

Create `src/app/[locale]/layout.tsx`:

```typescript
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import '@/app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }, { locale: 'ru' }];
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <Header locale={locale} />
            <main className="flex-1">{children}</main>
            <Footer locale={locale} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 6. Home Page with ISR

Create `src/app/[locale]/page.tsx`:

```typescript
import { getAllArticles, getAllCategories } from '@/lib/wordpress/api';
import { ArticleGrid } from '@/components/articles/ArticleGrid';
import { FeaturedArticle } from '@/components/articles/FeaturedArticle';
import type { Metadata } from 'next';

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return {
    title: 'Qahwa World - Explore Coffee Culture & News',
    description: 'Discover the latest coffee news, brewing techniques, and stories.',
  };
}

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const articles = await getAllArticles(locale);
  const featuredArticle = articles.find((a) => a.articleDetails?.featured);
  const latestArticles = articles.slice(0, 4);
  const trendingArticles = articles.slice(4, 8);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Featured Article */}
      {featuredArticle && <FeaturedArticle article={featuredArticle} locale={locale} />}

      {/* Latest Articles */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Latest Articles</h2>
        <ArticleGrid articles={latestArticles} locale={locale} />
      </section>

      {/* Trending */}
      <section className="mt-12">
        <h2 className="text-3xl font-bold mb-6">Trending</h2>
        <ArticleGrid articles={trendingArticles} locale={locale} />
      </section>
    </div>
  );
}
```

### 7. Article Detail Page

Create `src/app/[locale]/articles/[slug]/page.tsx`:

```typescript
import { getArticleBySlug, getAllArticles } from '@/lib/wordpress/api';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';

export const revalidate = 3600;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const article = await getArticleBySlug(slug, locale);

  if (!article) return {};

  return {
    title: article.seo?.title || article.title,
    description: article.seo?.metaDesc || article.excerpt,
    openGraph: {
      images: [article.seo?.opengraphImage?.sourceUrl || article.featuredImage?.node?.sourceUrl],
    },
  };
}

export default async function ArticlePage({
  params: { slug, locale },
}: {
  params: { slug: string; locale: string };
}) {
  const article = await getArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Featured Image */}
      {article.featuredImage && (
        <div className="relative aspect-video mb-8">
          <Image
            src={article.featuredImage.node.sourceUrl}
            alt={article.featuredImage.node.altText || article.title}
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>
      )}

      {/* Category Badge */}
      {article.coffeeCategories?.nodes[0] && (
        <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm mb-4">
          {article.coffeeCategories.nodes[0].name}
        </span>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>

      {/* Meta */}
      <div className="flex items-center gap-4 text-gray-600 mb-8">
        <span>{article.author?.node?.name}</span>
        <span>•</span>
        <time dateTime={article.date}>
          {new Date(article.date).toLocaleDateString(locale)}
        </time>
        {article.articleDetails?.readTime && (
          <>
            <span>•</span>
            <span>{article.articleDetails.readTime}</span>
          </>
        )}
      </div>

      {/* Content */}
      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />

      {/* Tags */}
      {article.coffeeTags && article.coffeeTags.nodes.length > 0 && (
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-4">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {article.coffeeTags.nodes.map((tag) => (
              <span
                key={tag.slug}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
```

### 8. TypeScript Types

Create `src/types/wordpress.ts`:

```typescript
export interface Article {
  id: string;
  databaseId: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  date: string;
  modified: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      mediaDetails?: {
        width: number;
        height: number;
      };
    };
  };
  coffeeCategories?: {
    nodes: Category[];
  };
  coffeeTags?: {
    nodes: Tag[];
  };
  author?: {
    node: Author;
  };
  articleDetails?: {
    readTime: string;
    featured: boolean;
  };
  seo?: {
    title: string;
    metaDesc: string;
    opengraphImage?: {
      sourceUrl: string;
    };
  };
  translations?: {
    slug: string;
    language: {
      code: string;
    };
  }[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
  description?: string;
}

export interface Tag {
  name: string;
  slug: string;
}

export interface Author {
  name: string;
  slug: string;
  description?: string;
  avatar?: {
    url: string;
  };
}
```

### 9. Next.js Config

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'your-wordpress-site.com',
      'images.unsplash.com',
      // Add other image domains
    ],
  },
  i18n: {
    locales: ['en', 'ar', 'ru'],
    defaultLocale: 'en',
  },
};

module.exports = nextConfig;
```

---

## 🔄 Migration Steps (Step-by-Step)

### Phase 1: WordPress Setup (Week 1)
1. ✅ Install WordPress locally or on hosting
2. ✅ Install and configure all required plugins
3. ✅ Setup multilingual support (WPML or Polylang)
4. ✅ Create custom post types and taxonomies
5. ✅ Import your mock data into WordPress
6. ✅ Test GraphQL queries in GraphiQL IDE
7. ✅ Configure permalinks and CORS

### Phase 2: Next.js Foundation (Week 1-2)
1. ✅ Create Next.js project with App Router
2. ✅ Setup environment variables
3. ✅ Configure Tailwind CSS
4. ✅ Setup GraphQL client and queries
5. ✅ Create middleware for i18n routing
6. ✅ Copy and adapt UI components from current project

### Phase 3: Component Migration (Week 2-3)
1. ✅ Migrate Header component
2. ✅ Migrate Footer component
3. ✅ Create ArticleCard component
4. ✅ Create ArticleGrid component
5. ✅ Migrate all UI components from `/components/ui`
6. ✅ Setup ThemeProvider with next-themes

### Phase 4: Pages Implementation (Week 3-4)
1. ✅ Home page with ISR
2. ✅ Article detail page
3. ✅ Category listing page
4. ✅ Author page
5. ✅ Search page
6. ✅ Static pages (About, Contact, Privacy, FAQ)

### Phase 5: Testing & Optimization (Week 4-5)
1. ✅ Test all pages and translations
2. ✅ Optimize images with Next.js Image
3. ✅ Setup SEO metadata
4. ✅ Test ISR and caching
5. ✅ Performance audit with Lighthouse
6. ✅ Accessibility testing

### Phase 6: Deployment (Week 5)
1. ✅ Deploy WordPress to production hosting
2. ✅ Deploy Next.js to Vercel/Netlify
3. ✅ Configure environment variables
4. ✅ Setup custom domain
5. ✅ Configure ISR revalidation webhooks
6. ✅ Setup monitoring and analytics

---

## 🚀 Deployment

### WordPress Hosting Options
1. **WP Engine** (Recommended for headless)
2. **Kinsta** (Great performance)
3. **Cloudways** (Affordable)
4. **DigitalOcean** + ServerPilot (DIY)

### Next.js Hosting
1. **Vercel** (Recommended - built by Next.js team)
   ```bash
   # Deploy to Vercel
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   ```bash
   # Deploy to Netlify
   npm install -g netlify-cli
   netlify deploy --prod
   ```

### Revalidation Webhook Setup

In WordPress, add a webhook to trigger Next.js revalidation on content updates:

```php
// Add to functions.php
function trigger_nextjs_revalidation($post_id) {
    if (get_post_type($post_id) !== 'article') return;
    
    $post = get_post($post_id);
    $revalidate_url = 'https://your-nextjs-site.com/api/revalidate';
    $secret = 'your_revalidate_secret';
    
    wp_remote_post($revalidate_url, array(
        'body' => json_encode(array(
            'secret' => $secret,
            'slug' => $post->post_name,
        )),
        'headers' => array('Content-Type' => 'application/json'),
    ));
}
add_action('save_post', 'trigger_nextjs_revalidation');
```

Create `src/app/api/revalidate/route.ts`:

```typescript
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const secret = body.secret;
  const slug = body.slug;

  // Check secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  try {
    // Revalidate specific paths
    revalidatePath(`/[locale]/articles/${slug}`);
    revalidatePath('/[locale]');

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}
```

---

## 📊 Benefits of This Architecture

✅ **SEO Optimized**: Server-side rendering + static generation
✅ **Performance**: ISR provides fast page loads
✅ **Scalability**: Separate frontend and backend
✅ **Flexibility**: Easy to change frontend without touching content
✅ **Content Management**: WordPress provides familiar admin UI
✅ **Multilingual**: Native support with WPML/Polylang
✅ **Type Safety**: Full TypeScript support
✅ **Modern Stack**: React 18 + Next.js 14 + WordPress

---

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors**
   - Enable CORS in WordPress
   - Check GraphQL endpoint accessibility
   - Verify domain whitelisting

2. **GraphQL Query Errors**
   - Test queries in GraphiQL IDE first
   - Check field names match your ACF setup
   - Verify language codes are correct

3. **Image Loading Issues**
   - Add WordPress domain to next.config.js
   - Check image URLs in GraphQL response
   - Verify WordPress media library permissions

4. **Locale Detection Not Working**
   - Check middleware.ts configuration
   - Verify locale codes match WordPress
   - Test Accept-Language headers

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [WPGraphQL Documentation](https://www.wpgraphql.com/docs/intro)
- [WPML + WPGraphQL Guide](https://wpml.org/documentation/plugins-compatibility/wpgraphql/)
- [Next.js i18n Routing](https://nextjs.org/docs/app/building-your-application/routing/internationalization)

---

## ✅ Checklist

### WordPress Backend
- [ ] WordPress installed and configured
- [ ] WPGraphQL plugin activated
- [ ] WPML or Polylang configured
- [ ] Custom post types created
- [ ] ACF fields setup
- [ ] Mock data imported
- [ ] GraphQL queries tested
- [ ] CORS configured

### Next.js Frontend
- [ ] Next.js project created
- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] GraphQL client setup
- [ ] Middleware configured
- [ ] Components migrated
- [ ] Pages implemented
- [ ] SEO metadata added
- [ ] Testing completed
- [ ] Deployed to production

---

**Need help?** Feel free to ask specific questions about any part of this setup!
