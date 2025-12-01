import { PageSEO } from '@/lib/actions/seo/pagesSeoAction';

interface JsonLdSchemaProps {
  seoData: PageSEO | null;
}

/**
 * Component to render JSON-LD schema from WordPress SEO data
 */
export function JsonLdSchema({ seoData }: JsonLdSchemaProps) {
  if (!seoData?.schema?.raw) {
    return null;
  }

  try {
    // Parse the JSON-LD schema
    // The raw field might already be a stringified JSON
    let schema: any;
    
    if (typeof seoData.schema.raw === 'string') {
      // Try to parse the JSON string
      try {
        schema = JSON.parse(seoData.schema.raw);
      } catch (parseError) {
        return null;
      }
    } else {
      // If it's already an object, use it directly
      schema = seoData.schema.raw;
    }

    // Validate that schema is an object
    if (!schema || typeof schema !== 'object') {
      return null;
    }

    // Stringify the schema for injection
    const schemaJson = JSON.stringify(schema);
    
    if (!schemaJson || schemaJson === '{}') {
      return null;
    }
    
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
    );
  } catch (error) {
    return null;
  }
}

