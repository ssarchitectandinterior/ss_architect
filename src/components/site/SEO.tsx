import { useEffect } from 'react';

export interface SEOProps {
  title: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  image?: string;
  type?: 'website' | 'article' | 'profile' | 'business';
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
}

const DEFAULT_DOMAIN = 'https://ssachitectandinterior.com';
const DEFAULT_DESCRIPTION = 'SS Architects & Interiors is a Mumbai-based architecture and interior design studio crafting quiet, material-first residences, luxury villas, hospitality and commercial spaces since 2011.';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';
const DEFAULT_KEYWORDS = 'architecture studio Mumbai, interior design India, luxury villa architect, residential architecture, interior designer Mumbai, tropical luxury architecture, SS Architects';

export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    // Title
    const fullTitle = title.includes('SS Architects')
      ? title
      : `${title} | SS Architects & Interiors`;
    document.title = fullTitle;

    // Helper to set meta attribute
    const setMeta = (attr: string, key: string, content: string) => {
      let element = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta
    setMeta('name', 'description', description);
    setMeta('name', 'keywords', keywords);
    setMeta('name', 'author', 'SS Architects & Interiors');
    setMeta('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');

    // Canonical
    const currentUrl = canonical ? (canonical.startsWith('http') ? canonical : `${DEFAULT_DOMAIN}${canonical}`) : window.location.href;
    let canonicalLink = document.head.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    // OpenGraph Meta
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:url', currentUrl);
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', 'SS Architects & Interiors');

    // Twitter Card Meta
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', image);

    // Structured Data JSON-LD
    let scriptElement = document.getElementById('json-ld-seo') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptElement) {
        scriptElement = document.createElement('script');
        scriptElement.id = 'json-ld-seo';
        scriptElement.type = 'application/ld+json';
        document.head.appendChild(scriptElement);
      }
      scriptElement.textContent = JSON.stringify(jsonLd);
    } else if (scriptElement) {
      scriptElement.remove();
    }
  }, [title, description, keywords, canonical, image, type, jsonLd]);

  return null;
}
