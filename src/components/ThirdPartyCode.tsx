'use client';

import { useEffect } from 'react';

interface ThirdPartyCodeProps {
  html: string;
  position: 'head' | 'body' | 'footer';
}

export function ThirdPartyCode({ html, position }: ThirdPartyCodeProps) {
  useEffect(() => {
    if (!html) return;

    // Create a temporary container to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Get all child nodes (scripts, styles, meta tags, etc.)
    const nodes = Array.from(tempDiv.childNodes);
    const injectedNodes: HTMLElement[] = [];

    if (position === 'head') {
      nodes.forEach((node) => {
        const nodeName = node.nodeName?.toLowerCase();
        
        // Handle meta tags specially to ensure they're created properly
        if (nodeName === 'meta') {
          const metaElement = node as HTMLMetaElement;
          const name = metaElement.getAttribute('name');
          const property = metaElement.getAttribute('property');
          const content = metaElement.getAttribute('content');
          const httpEquiv = metaElement.getAttribute('http-equiv');
          const charset = metaElement.getAttribute('charset');
          
          if (content) {
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
              existing.setAttribute('content', content);
              injectedNodes.push(existing);
            } else {
              const newMeta = document.createElement('meta');
              if (name) newMeta.setAttribute('name', name);
              if (property) newMeta.setAttribute('property', property);
              if (httpEquiv) newMeta.setAttribute('http-equiv', httpEquiv);
              if (charset) newMeta.setAttribute('charset', charset);
              newMeta.setAttribute('content', content);
              document.head.appendChild(newMeta);
              injectedNodes.push(newMeta);
            }
          }
        } else {
          // Handle other elements (scripts, styles, links, etc.)
          const clonedNode = node.cloneNode(true) as HTMLElement;
          document.head.appendChild(clonedNode);
          injectedNodes.push(clonedNode);
        }
      });
    } else if (position === 'body') {
      // Insert at the beginning of body
      const body = document.body;
      nodes.forEach((node) => {
        const clonedNode = node.cloneNode(true) as HTMLElement;
        body.insertBefore(clonedNode, body.firstChild);
        injectedNodes.push(clonedNode);
      });
    } else if (position === 'footer') {
      // Insert at the end of body
      nodes.forEach((node) => {
        const clonedNode = node.cloneNode(true) as HTMLElement;
        document.body.appendChild(clonedNode);
        injectedNodes.push(clonedNode);
      });
    }

    // Cleanup function to remove injected nodes on unmount
    return () => {
      injectedNodes.forEach((node) => {
        if (node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
    };
  }, [html, position]);

  return null;
}

