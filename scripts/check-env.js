#!/usr/bin/env node

/**
 * Environment Check Script for Qahwa World
 * Verifies that all required environment variables are set
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Checking Qahwa World Environment Setup...\n');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (!envExists) {
  console.error('❌ .env.local file not found!');
  console.log('📝 Please create .env.local file from .env.example');
  console.log('   Run: cp .env.example .env.local\n');
  process.exit(1);
}

console.log('✅ .env.local file found\n');

// Read and check environment variables
const envContent = fs.readFileSync(envPath, 'utf-8');
const requiredVars = [
  'NEXT_PUBLIC_WORDPRESS_API_URL',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_DEFAULT_LANGUAGE',
];

let allVarsSet = true;

console.log('Checking required environment variables:\n');

requiredVars.forEach((varName) => {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = envContent.match(regex);
  
  if (match && match[1] && !match[1].includes('your-') && match[1].trim() !== '') {
    console.log(`  ✅ ${varName}`);
  } else {
    console.log(`  ❌ ${varName} - Not set or using placeholder value`);
    allVarsSet = false;
  }
});

console.log('\n');

if (!allVarsSet) {
  console.log('⚠️  Some environment variables need to be configured.');
  console.log('📝 Please update .env.local with your actual values.\n');
  process.exit(1);
}

// Check WordPress connection
console.log('Checking WordPress connection...\n');

const wpUrlMatch = envContent.match(/^NEXT_PUBLIC_WORDPRESS_API_URL=(.+)$/m);
if (wpUrlMatch && wpUrlMatch[1]) {
  const wpUrl = wpUrlMatch[1].trim();
  
  if (wpUrl.includes('your-wordpress-site.com')) {
    console.log('  ❌ WordPress URL is still using placeholder');
    console.log('     Please update NEXT_PUBLIC_WORDPRESS_API_URL with your actual WordPress site\n');
  } else {
    console.log(`  ✅ WordPress URL configured: ${wpUrl}`);
    console.log('     Test it by visiting this URL in your browser\n');
  }
}

// Check required directories
console.log('Checking project structure:\n');

const requiredDirs = [
  'src/app/[locale]',
  'src/components/layout',
  'src/components/articles',
  'src/lib/wordpress',
  'src/types',
  'src/i18n/locales',
];

requiredDirs.forEach((dir) => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`  ✅ ${dir}`);
  } else {
    console.log(`  ❌ ${dir} - Missing`);
  }
});

console.log('\n');

// Check key files
console.log('Checking key files:\n');

const requiredFiles = [
  'src/middleware.ts',
  'src/lib/wordpress/client.ts',
  'src/lib/wordpress/queries.ts',
  'src/lib/wordpress/api.ts',
  'src/types/wordpress.ts',
  'src/i18n/config.ts',
  'src/i18n/locales/en.json',
  'src/i18n/locales/ar.json',
  'src/i18n/locales/ru.json',
];

requiredFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  if (fs.existsSync(filePath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - Missing`);
  }
});

console.log('\n');

// Final summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (allVarsSet) {
  console.log('✅ Environment setup looks good!\n');
  console.log('Next steps:');
  console.log('  1. Make sure WordPress has all required plugins installed');
  console.log('  2. Test GraphQL endpoint in browser');
  console.log('  3. Run: npm run dev');
  console.log('  4. Visit: http://localhost:3000\n');
  console.log('📚 For detailed setup guide, see:');
  console.log('   - QUICK_START.md - Fast setup guide');
  console.log('   - MIGRATION_CHECKLIST.md - Complete checklist\n');
} else {
  console.log('⚠️  Please complete the setup steps above.\n');
  console.log('📚 For help, see:');
  console.log('   - QUICK_START.md - Fast setup guide');
  console.log('   - README_MIGRATION.md - Full documentation\n');
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
