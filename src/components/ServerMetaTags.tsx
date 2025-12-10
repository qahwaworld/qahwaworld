'use client';

import { useEffect } from 'react';

interface ServerMetaTagsProps {
  codeHead: string | null;
}

export function ServerMetaTags({ codeHead }: ServerMetaTagsProps) {
  useEffect(() => {
    if (!codeHead) return;

    // Extract meta tags from codeHead HTML and inject them into head
    const metaTagRegex = /<meta\s+([^>]+)\s*\/?>/gi;
    let match;
    const injectedMetaTags: HTMLMetaElement[] = [];
    
    while ((match = metaTagRegex.exec(codeHead)) !== null) {
      const attributes = match[1];
      const nameMatch = attributes.match(/name=["']([^"']+)["']/i);
      const propertyMatch = attributes.match(/property=["']([^"']+)["']/i);
      const contentMatch = attributes.match(/content=["']([^"']+)["']/i);
      const httpEquivMatch = attributes.match(/http-equiv=["']([^"']+)["']/i);
      const charsetMatch = attributes.match(/charset=["']([^"']+)["']/i);
      
      if (contentMatch || charsetMatch) {
        const name = nameMatch ? nameMatch[1] : undefined;
        const property = propertyMatch ? propertyMatch[1] : undefined;
        const content = contentMatch ? contentMatch[1] : '';
        const httpEquiv = httpEquivMatch ? httpEquivMatch[1] : undefined;
        const charset = charsetMatch ? charsetMatch[1] : undefined;
        
        // Check if meta tag already exists
        let existing: HTMLMetaElement | null = null;
        if (name) {
          existing = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
        } else if (property) {
          existing = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
        } else if (httpEquiv) {
          existing = document.querySelector(`meta[http-equiv="${httpEquiv}"]`) as HTMLMetaElement;
        }
        
        if (existing) {
          if (content) existing.setAttribute('content', content);
          injectedMetaTags.push(existing);
        } else {
          const newMeta = document.createElement('meta');
          if (name) newMeta.setAttribute('name', name);
          if (property) newMeta.setAttribute('property', property);
          if (httpEquiv) newMeta.setAttribute('http-equiv', httpEquiv);
          if (charset) newMeta.setAttribute('charset', charset);
          if (content) newMeta.setAttribute('content', content);
          document.head.appendChild(newMeta);
          injectedMetaTags.push(newMeta);
        }
      }
    }

    // Cleanup on unmount
    return () => {
      injectedMetaTags.forEach((meta) => {
        if (meta.parentNode) {
          meta.parentNode.removeChild(meta);
        }
      });
    };
  }, [codeHead]);

  return null;
}
