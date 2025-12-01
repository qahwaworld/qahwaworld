'use client';

import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { toast } from 'sonner';
import { ContactPageData } from '@/lib/actions/contact/contactAction';
import { submitContactFormAction } from '@/lib/actions/contact/submitContactForm';

interface ContactPageProps {
  contactData: ContactPageData | null;
  language: string;
}

const ContactPage: React.FC<ContactPageProps> = ({ contactData, language: initialLanguage }) => {
  const { language: contextLanguage } = useLanguage();
  const language = contextLanguage || initialLanguage;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const content = {
    en: {
      title: 'Contact Us',
      subtitle: 'Get in touch with the Qahwa World team',
      namePlaceholder: 'Your Name',
      emailPlaceholder: 'Your Email',
      subjectPlaceholder: 'Subject',
      messagePlaceholder: 'Your Message',
      sendButton: 'Send Message',
      successMessage: 'Message sent successfully!',
      successDescription: 'Thank you for your message. We will get back to you soon.',
      errorMessage: 'Failed to send message',
      errorDescription: 'Please check the entered data and try again.',
      connectionError: 'A connection error occurred. Please check your internet connection and try again.',
      formNotConfigured: 'Contact form is not configured. Please contact us directly.',
      info: 'Contact Information',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      addressText: 'Coffee Street, Bean District, World',
    },
    ar: {
      title: 'اتصل بنا',
      subtitle: 'تواصل مع فريق عالم القهوة',
      namePlaceholder: 'اسمك',
      emailPlaceholder: 'بريدك الإلكتروني',
      subjectPlaceholder: 'الموضوع',
      messagePlaceholder: 'رسالت��',
      sendButton: 'إرسال الرسالة',
      successMessage: 'تم إرسال الرسالة بنجاح!',
      successDescription: 'شكراً لرسالتك. سنرد عليك في أقرب وقت ممكن.',
      errorMessage: 'فشل إرسال الرسالة',
      errorDescription: 'يرجى التحقق من البيانات المدخلة والمحاولة مرة أخرى.',
      connectionError: 'حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت وحاول مرة أخرى.',
      formNotConfigured: 'نموذج الاتصال غير مُعد. يرجى الاتصال بنا مباشرة.',
      info: 'معلومات الاتصال',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      address: 'العنوان',
      addressText: 'شارع القهوة، منطقة الحبوب، العالم',
    },
    ru: {
      title: 'Связаться с нами',
      subtitle: 'Свяжитесь с командой Qahwa World',
      namePlaceholder: 'Ваше имя',
      emailPlaceholder: 'Ваш Email',
      subjectPlaceholder: 'Тема',
      messagePlaceholder: 'Ваше сообщение',
      sendButton: 'Отправить сообщение',
      successMessage: 'Сообщение успешно отправлено!',
      successDescription: 'Спасибо за ваше сообщение. Мы свяжемся с вами в ближайшее время.',
      errorMessage: 'Не удалось отправить сообщение',
      errorDescription: 'Пожалуйста, проверьте введенные данные и попробуйте снова.',
      connectionError: 'Произошла ошибка подключения. Проверьте подключение к интернету и попробуйте снова.',
      formNotConfigured: 'Контактная форма не настроена. Пожалуйста, свяжитесь с нами напрямую.',
      info: 'Контактная информация',
      email: 'Email',
      phone: 'Телефон',
      address: 'Адрес',
      addressText: 'Кофейная улица, Бобовый район, Мир',
    },
  };

  const currentContent = content[language as keyof typeof content] || content.en;

  // Use dynamic data from WordPress if available, otherwise use fallback
  const contactInfo = contactData ? {
    heading: contactData.contactBlockHeading,
    emailLabel: contactData.emailLabel,
    email: contactData.emailAddress,
    phoneLabel: contactData.phoneLabel,
    phone: contactData.phoneNumber,
    addressLabel: contactData.addressLabel,
    address: contactData.address,
    description: contactData.description,
    formId: contactData.formId,
  } : {
    heading: currentContent.info,
    emailLabel: currentContent.email,
    email: 'info@qahwaworld.com',
    phoneLabel: currentContent.phone,
    phone: '+1 (555) 123-4567',
    addressLabel: currentContent.address,
    address: currentContent.addressText,
    description: language === 'ar'
      ? 'نحن هنا لمساعدتك! لا تتردد في التواصل معنا بأي أسئلة أو اقتراحات.'
      : language === 'ru'
      ? 'Мы здесь, чтобы помочь! Не стесняйтесь обращаться к нам с любыми вопросами или предложениями.'
      : "We're here to help! Feel free to reach out with any questions or suggestions.",
    formId: '',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contactInfo.formId) {
      toast.error(currentContent.formNotConfigured);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitContactFormAction({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        formId: contactInfo.formId,
      });

      if (result.success) {
        toast.success(currentContent.successMessage, {
          description: currentContent.successDescription,
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        toast.error(currentContent.errorMessage, {
          description: currentContent.errorDescription,
        });
      }
    } catch (error) {
      toast.error(currentContent.errorMessage, {
        description: currentContent.connectionError,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-900 to-amber-700 dark:from-amber-800 dark:to-amber-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-white">{currentContent.title}</h1>
          <p className="text-xl text-amber-100 dark:text-amber-200">{currentContent.subtitle}</p>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder={currentContent.namePlaceholder}
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder={currentContent.emailPlaceholder}
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full"
                    />
                  </div>
                </div>
                <div>
                  <Input
                    type="text"
                    name="subject"
                    placeholder={currentContent.subjectPlaceholder}
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder={currentContent.messagePlaceholder}
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full resize-none"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-amber-700 hover:bg-amber-800 w-full md:w-auto"
                  size="lg"
                >
                  {isSubmitting ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {currentContent.sendButton}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8">
                <h3 className="mb-6 text-gray-900 dark:text-gray-100">{contactInfo.heading}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{contactInfo.emailLabel}</p>
                      <p className="text-gray-900 dark:text-gray-100">{contactInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{contactInfo.phoneLabel}</p>
                      <p className="text-gray-900 dark:text-gray-100">{contactInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-amber-700 dark:text-amber-300" />
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{contactInfo.addressLabel}</p>
                      <p className="text-gray-900 dark:text-gray-100">{contactInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-800">
                <p className="text-gray-700 dark:text-gray-300">
                  {contactInfo.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export { ContactPage };
