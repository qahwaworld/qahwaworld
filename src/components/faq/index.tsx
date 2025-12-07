'use client';

import React from 'react';
import Link from 'next/link';
import { getLocalizedPath } from '@/lib/localization';
import { ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { getTranslations } from '@/lib/translations';
import { FAQPageData } from '@/lib/actions/faq/faqAction';

interface FAQPageProps {
  locale: string;
  faqData?: FAQPageData | null;
}

const FAQPage: React.FC<FAQPageProps> = ({ locale, faqData }) => {
  const t = getTranslations(locale);
  const getPath = (path: string) => getLocalizedPath(path, locale);

  if (!faqData) {
    return null;
  }

  const currentFaqs = faqData.faqs || [];
  const heroHeading = faqData.heroHeading || '';
  const heroSubHeading = faqData.heroSubHeading || '';
  const ctaHeading = faqData.ctaHeading || '';
  const ctaSubHeading = faqData.ctaSubHeading || '';
  const ctaButtonText = faqData.ctaButtonText || '';
  const ctaButtonLink = faqData.ctaButtonLink || '/contact';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link href={getPath(`/`)} className="hover:text-amber-700 dark:hover:text-amber-500">
              {t.home}
            </Link>
            {locale === 'ar' ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <span className="text-gray-900 dark:text-gray-100">
              {t.faq.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <HelpCircle className="w-16 h-16 text-amber-700 dark:text-amber-500 mx-auto mb-6" />
            <h1 className="text-4xl text-amber-900 dark:text-amber-100 mb-4">
              {heroHeading}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {heroSubHeading}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {currentFaqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-white dark:bg-gray-800 border dark:border-gray-700 px-6 shadow-sm"
              >
                <AccordionTrigger className="text-left hover:text-amber-700 dark:hover:text-amber-500">
                  <span className="text-lg text-gray-900 dark:text-gray-100">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact CTA */}
          <div className="mt-12 bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm p-8 text-center rounded-lg">
            <h3 className="text-2xl text-amber-900 dark:text-amber-100 mb-4">
              {ctaHeading}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {ctaSubHeading}
            </p>
            <Link
              href={getPath(ctaButtonLink)}
              className="px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white rounded-md transition-colors inline-block"
            >
              {ctaButtonText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export { FAQPage };
