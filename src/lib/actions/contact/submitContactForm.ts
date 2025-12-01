'use server';

/**
 * Submit contact form to WordPress Contact Form 7 REST API
 */
export async function submitContactFormAction(formData: {
  name: string;
  email: string;
  subject: string;
  message?: string;
  formId: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    // Get WordPress URL - handle both with and without /graphql suffix
    let wpApiUrl = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || '';
    
    // Remove /graphql if present, and clean up any trailing slashes
    wpApiUrl = wpApiUrl.replace(/\/graphql\/?$/, '').replace(/\/$/, '');
    
    if (!wpApiUrl) {
      return {
        success: false,
        message: 'WordPress API URL is not configured.',
      };
    }

    if (!formData.formId) {
      return {
        success: false,
        message: 'Contact form ID is missing. Please contact us directly via email or phone.',
      };
    }

    // Clean and validate form ID (remove any whitespace)
    const cleanFormId = formData.formId.trim();
    
    if (!cleanFormId) {
      return {
        success: false,
        message: 'Contact form ID is invalid. Please contact us directly via email or phone.',
      };
    }

    const endpoint = `${wpApiUrl}/wp-json/contact-form-7/v1/contact-forms/${cleanFormId}/feedback`;

    // Create FormData for CF7
    const formDataToSend = new FormData();
    
    // Required CF7 fields
    formDataToSend.append('_wpcf7', cleanFormId);
    formDataToSend.append('_wpcf7_version', '5.9.8');
    formDataToSend.append('_wpcf7_locale', 'en_US');
    formDataToSend.append('_wpcf7_unit_tag', `wpcf7-f${cleanFormId}-o1`);
    formDataToSend.append('_wpcf7_container_post', '0');
    
    // Form fields matching CF7 HTML reference
    formDataToSend.append('your-name', formData.name);
    formDataToSend.append('your-email', formData.email);
    formDataToSend.append('your-subject', formData.subject);
    formDataToSend.append('your-message', formData.message || '');

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formDataToSend,
    });

    // Parse response
    const result = await response.json();

    // Handle rest_no_route error (CF7 not available or wrong form ID)
    if (result.code === 'rest_no_route') {
      return {
        success: false,
        message: 'Contact form is not properly configured. Please contact us directly via email or phone.',
      };
    }

    // Handle CF7 response
    if (result.status === 'mail_sent') {
      return {
        success: true,
        message: result.message || 'Your message has been sent successfully!',
      };
    } else if (result.status === 'validation_failed') {
      return {
        success: false,
        message: result.message || 'Please check the entered data and try again.',
      };
    } else if (result.status === 'mail_failed') {
      return {
        success: false,
        message: 'Failed to send email. Please try again.',
      };
    } else {
      return {
        success: false,
        message: result.message || 'An error occurred while sending the message. Please try again.',
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'A connection error occurred. Please check your internet connection and try again.',
    };
  }
}

