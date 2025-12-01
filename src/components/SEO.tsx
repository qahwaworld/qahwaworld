'use client';

import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  canonical?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Qahwa World - Coffee Culture & News',
  description = 'Explore the world of coffee with Qahwa World. Latest news, brewing techniques, coffee communities, and expert interviews.',
  keywords = 'coffee, qahwa, coffee news, brewing, coffee culture, barista, coffee community',
  author = 'Qahwa World',
  ogTitle,
  ogDescription,
  ogImage = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&h=630&fit=crop',
  ogUrl = 'https://qahwaworld.com',
  twitterCard = 'summary_large_image',
  canonical,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (element) {
        element.content = content;
      } else {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        element.content = content;
        document.head.appendChild(element);
      }
    };

    // Update basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    updateMetaTag('robots', 'index, follow');

    // Update Open Graph meta tags
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:url', ogUrl, true);
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:site_name', 'Qahwa World', true);

    // Update Twitter meta tags
    updateMetaTag('twitter:card', twitterCard);
    updateMetaTag('twitter:title', ogTitle || title);
    updateMetaTag('twitter:description', ogDescription || description);
    updateMetaTag('twitter:image', ogImage);

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonical) {
      if (canonicalLink) {
        canonicalLink.href = canonical;
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = canonical;
        document.head.appendChild(canonicalLink);
      }
    }

    // Add language alternatives
    const addAlternateLink = (hreflang: string, href: string) => {
      let altLink = document.querySelector(`link[hreflang="${hreflang}"]`) as HTMLLinkElement;
      if (!altLink) {
        altLink = document.createElement('link');
        altLink.rel = 'alternate';
        altLink.hreflang = hreflang;
        altLink.href = href;
        document.head.appendChild(altLink);
      }
    };

    addAlternateLink('en', `${ogUrl}/en`);
    addAlternateLink('ar', `${ogUrl}/ar`);
    addAlternateLink('ru', `${ogUrl}/ru`);
    addAlternateLink('x-default', ogUrl);

  }, [title, description, keywords, author, ogTitle, ogDescription, ogImage, ogUrl, twitterCard, canonical]);

  return null;
};
