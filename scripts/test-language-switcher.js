// Test script to verify language switcher functionality
console.log("🧪 Testing language switcher functionality...");

// Test data from the actual API response
const mockArticleData = {
  slug: "jde-peets-share-transfer-keurig-dr-pepper-takeover",
  translations: [
    {
      slug: "جي-دي-إي-بيتس-تنقل-أسهماً-لموظفيها-وسط-ع",
      language: { code: "ar" }
    },
    {
      slug: "джи-ди-и-питс-передала-акции-сотрудник",
      language: { code: "ru" }
    }
  ],
  categories: {
    nodes: [
      {
        name: "News",
        slug: "news",
        translations: [
          { slug: "أخبار", language: { code: "ar" } },
          { slug: "новости", language: { code: "ru" } }
        ]
      }
    ]
  }
};

// Simulate the logic from ArticleLanguageHandler
function generatePaths(translations, categorySlug, categoryTranslations) {
  const paths = {};
  
  translations.forEach((translation) => {
    const langCode = translation.language.code.toLowerCase();
    const articleSlug = translation.slug;
    
    // Find the translated category slug for this language
    const translatedCategory = categoryTranslations?.find(
      (cat) => cat.language.code.toLowerCase() === langCode
    );
    const catSlug = translatedCategory?.slug || categorySlug;
    
    console.log(`🔧 Language ${langCode}: catSlug=${catSlug}, articleSlug=${articleSlug}`);
    
    if (langCode === 'en') {
      paths[langCode] = `/${catSlug}/${articleSlug}`;
    } else {
      paths[langCode] = `/${langCode}/${catSlug}/${articleSlug}`;
    }
  });
  
  return paths;
}

// Test the function
const categorySlug = "news";
const categoryTranslations = mockArticleData.categories.nodes[0]?.translations;
const paths = generatePaths(mockArticleData.translations, categorySlug, categoryTranslations);

console.log("✅ Generated paths:", paths);
console.log("");
console.log("Expected Russian URL: /ru/новости/джи-ди-и-питс-передала-акции-сотрудник");
console.log("Actual Russian URL:  ", paths.ru);
console.log("✅ Match:", paths.ru === "/ru/новости/джи-ди-и-питс-передала-акции-сотрудник");