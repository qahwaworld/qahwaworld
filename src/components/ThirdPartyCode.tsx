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

    if (position === 'head') {
      nodes.forEach((node) => {
        // Clone the node to avoid issues
        const clonedNode = node.cloneNode(true) as HTMLElement;
        document.head.appendChild(clonedNode);
      });
    } else if (position === 'body') {
      // Insert at the beginning of body
      const body = document.body;
      nodes.forEach((node) => {
        const clonedNode = node.cloneNode(true) as HTMLElement;
        body.insertBefore(clonedNode, body.firstChild);
      });
    } else if (position === 'footer') {
      // Insert at the end of body
      nodes.forEach((node) => {
        const clonedNode = node.cloneNode(true) as HTMLElement;
        document.body.appendChild(clonedNode);
      });
    }

    // Cleanup function to remove injected nodes on unmount
    return () => {
      if (position === 'head') {
        nodes.forEach((node) => {
          const clonedNode = node.cloneNode(true) as HTMLElement;
          if (clonedNode.nodeName) {
            const tagName = clonedNode.nodeName.toLowerCase();
            if (tagName === 'script' && (clonedNode as HTMLScriptElement).src) {
              const existing = document.head.querySelector(`script[src="${(clonedNode as HTMLScriptElement).src}"]`);
              if (existing) existing.remove();
            } else if (tagName === 'style' || tagName === 'link') {
              const existing = document.head.querySelector(tagName);
              if (existing) existing.remove();
            }
          }
        });
      }
    };
  }, [html, position]);

  return null;
}

