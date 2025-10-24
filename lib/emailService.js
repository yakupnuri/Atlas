import nodemailer from 'nodemailer';

// Email transporter configuration
const createTransporter = () => {
  // Check if Gmail credentials are configured
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn('⚠️ Gmail credentials not configured. Email notifications disabled.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

// Email templates
const emailTemplates = {
  newSurveyCreated: (surveyData, locale = 'nl') => {
    const translations = {
      nl: {
        subject: `Nieuwe enquête aangemaakt: ${surveyData.title}`,
        title: 'Nieuwe Enquête Aangemaakt',
        body: `Een nieuwe enquête is succesvol aangemaakt in de ${surveyData.module} module.`,
        details: 'Enquête Details',
        viewAdmin: 'Bekijk in Admin Panel'
      },
      tr: {
        subject: `Yeni anket oluşturuldu: ${surveyData.title}`,
        title: 'Yeni Anket Oluşturuldu',
        body: `${surveyData.module} modülünde yeni bir anket başarıyla oluşturuldu.`,
        details: 'Anket Detayları',
        viewAdmin: 'Admin Panelde Görüntüle'
      },
      en: {
        subject: `New survey created: ${surveyData.title}`,
        title: 'New Survey Created',
        body: `A new survey has been successfully created in the ${surveyData.module} module.`,
        details: 'Survey Details',
        viewAdmin: 'View in Admin Panel'
      }
    };

    const t = translations[locale] || translations.nl;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
      subject: t.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { font-weight: bold; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${t.title}</h1>
            </div>
            <div class="content">
              <p>${t.body}</p>
              
              <div class="details">
                <h3>${t.details}</h3>
                <div class="detail-row">
                  <span class="detail-label">Titel:</span>
                  <span>${surveyData.title}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Module:</span>
                  <span>${surveyData.module}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Vragen:</span>
                  <span>${surveyData.questions?.length || 0}</span>
                </div>
                ${surveyData.endDate ? `
                <div class="detail-row">
                  <span class="detail-label">Einddatum:</span>
                  <span>${new Date(surveyData.endDate).toLocaleDateString(locale)}</span>
                </div>
                ` : ''}
              </div>

              <a href="${baseUrl}/admin/kariyer" class="button">${t.viewAdmin}</a>
            </div>
          </div>
        </body>
        </html>
      `
    };
  },

  newResponseReceived: (surveyData, responseData, locale = 'nl') => {
    const translations = {
      nl: {
        subject: `Nieuwe reactie op: ${surveyData.title}`,
        title: 'Nieuwe Enquête Reactie',
        body: 'Er is een nieuwe reactie ontvangen op uw enquête.',
        participant: 'Deelnemer',
        viewResults: 'Bekijk Resultaten'
      },
      tr: {
        subject: `Yeni yanıt alındı: ${surveyData.title}`,
        title: 'Yeni Anket Yanıtı',
        body: 'Anketinize yeni bir yanıt alındı.',
        participant: 'Katılımcı',
        viewResults: 'Sonuçları Görüntüle'
      },
      en: {
        subject: `New response received: ${surveyData.title}`,
        title: 'New Survey Response',
        body: 'A new response has been received for your survey.',
        participant: 'Participant',
        viewResults: 'View Results'
      }
    };

    const t = translations[locale] || translations.nl;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
      subject: t.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .details { background: white; padding: 20px; border-radius: 8px; margin-top: 20px; }
            .badge { display: inline-block; padding: 5px 15px; background: #dbeafe; color: #1e40af; border-radius: 20px; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${t.title}</h1>
            </div>
            <div class="content">
              <p>${t.body}</p>
              
              <div class="details">
                <h3>${surveyData.title}</h3>
                <p><strong>${t.participant}:</strong> ${responseData.userName || 'Anoniem'}</p>
                ${responseData.userEmail ? `<p><strong>Email:</strong> ${responseData.userEmail}</p>` : ''}
                <p><span class="badge">${responseData.answers?.length || 0} vragen beantwoord</span></p>
              </div>

              <a href="${baseUrl}/admin/kariyer" class="button">${t.viewResults}</a>
            </div>
          </div>
        </body>
        </html>
      `
    };
  },

  surveyExpiringSoon: (surveyData, daysRemaining, locale = 'nl') => {
    const translations = {
      nl: {
        subject: `Enquête sluit binnenkort: ${surveyData.title}`,
        title: 'Enquête Sluit Binnenkort',
        body: `Uw enquête sluit over ${daysRemaining} dagen.`,
        warning: 'Let op',
        action: 'Verlengen of Bekijken'
      },
      tr: {
        subject: `Anket yakında kapanacak: ${surveyData.title}`,
        title: 'Anket Yakında Kapanacak',
        body: `Anketiniz ${daysRemaining} gün içinde kapanacak.`,
        warning: 'Uyarı',
        action: 'Uzat veya Görüntüle'
      },
      en: {
        subject: `Survey closing soon: ${surveyData.title}`,
        title: 'Survey Closing Soon',
        body: `Your survey will close in ${daysRemaining} days.`,
        warning: 'Warning',
        action: 'Extend or View'
      }
    };

    const t = translations[locale] || translations.nl;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
      subject: t.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #f59e0b; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚠️ ${t.title}</h1>
            </div>
            <div class="content">
              <div class="warning-box">
                <strong>${t.warning}:</strong> ${t.body}
              </div>
              
              <p><strong>${surveyData.title}</strong></p>
              <p>Einddatum: ${new Date(surveyData.endDate).toLocaleDateString(locale)}</p>

              <a href="${baseUrl}/admin/kariyer" class="button">${t.action}</a>
            </div>
          </div>
        </body>
        </html>
      `
    };
  },

  surveyExpired: (surveyData, totalResponses, locale = 'nl') => {
    const translations = {
      nl: {
        subject: `Enquête gesloten: ${surveyData.title}`,
        title: 'Enquête Gesloten',
        body: 'Uw enquête is gesloten. Hier is een samenvatting van de resultaten.',
        summary: 'Samenvatting',
        responses: 'Totaal reacties',
        viewFullResults: 'Bekijk Volledige Resultaten'
      },
      tr: {
        subject: `Anket kapatıldı: ${surveyData.title}`,
        title: 'Anket Kapatıldı',
        body: 'Anketiniz kapandı. İşte sonuçların özeti.',
        summary: 'Özet',
        responses: 'Toplam yanıt',
        viewFullResults: 'Tüm Sonuçları Görüntüle'
      },
      en: {
        subject: `Survey closed: ${surveyData.title}`,
        title: 'Survey Closed',
        body: 'Your survey has been closed. Here is a summary of the results.',
        summary: 'Summary',
        responses: 'Total responses',
        viewFullResults: 'View Full Results'
      }
    };

    const t = translations[locale] || translations.nl;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    return {
      subject: t.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #6b7280; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            .stats { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
            .stat-number { font-size: 48px; font-weight: bold; color: #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${t.title}</h1>
            </div>
            <div class="content">
              <p>${t.body}</p>
              
              <div class="stats">
                <h3>${t.summary}</h3>
                <div class="stat-number">${totalResponses}</div>
                <p>${t.responses}</p>
              </div>

              <p><strong>${surveyData.title}</strong></p>

              <a href="${baseUrl}/admin/kariyer" class="button">${t.viewFullResults}</a>
            </div>
          </div>
        </body>
        </html>
      `
    };
  },

  userConfirmation: (surveyData, responseData, locale = 'nl') => {
    const translations = {
      nl: {
        subject: 'Bedankt voor uw deelname',
        title: 'Reactie Ontvangen',
        body: 'Bedankt voor het invullen van onze enquête. Uw reactie is succesvol opgeslagen.',
        reference: 'Referentie ID'
      },
      tr: {
        subject: 'Katılımınız için teşekkürler',
        title: 'Yanıt Alındı',
        body: 'Anketimizi doldurduğunuz için teşekkür ederiz. Yanıtınız başarıyla kaydedildi.',
        reference: 'Referans ID'
      },
      en: {
        subject: 'Thank you for your participation',
        title: 'Response Received',
        body: 'Thank you for completing our survey. Your response has been successfully saved.',
        reference: 'Reference ID'
      }
    };

    const t = translations[locale] || translations.nl;

    return {
      subject: t.subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .checkmark { font-size: 64px; text-align: center; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${t.title}</h1>
            </div>
            <div class="content">
              <div class="checkmark">✓</div>
              <p>${t.body}</p>
              <p><strong>${surveyData.title}</strong></p>
              <p style="color: #6b7280; font-size: 14px;">${t.reference}: ${responseData.id}</p>
            </div>
          </div>
        </body>
        </html>
      `
    };
  }
};

// Send email function
export const sendEmail = async (to, template, data, locale = 'nl') => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('📧 Email skipped (no configuration):', template);
      return { success: false, error: 'Email not configured' };
    }

    const templateFunction = emailTemplates[template];
    if (!templateFunction) {
      throw new Error(`Email template '${template}' not found`);
    }

    const { subject, html } = templateFunction(data, data.responseData, locale);

    const mailOptions = {
      from: `"Stichting Atlas" <${process.env.GMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    return { success: false, error: error.message };
  }
};

// Helper functions
export const sendSurveyCreatedEmail = async (surveyData, adminEmail, locale = 'nl') => {
  return sendEmail(adminEmail, 'newSurveyCreated', surveyData, locale);
};

export const sendNewResponseEmail = async (surveyData, responseData, adminEmail, locale = 'nl') => {
  return sendEmail(adminEmail, 'newResponseReceived', { ...surveyData, responseData }, locale);
};

export const sendExpiringWarningEmail = async (surveyData, daysRemaining, adminEmail, locale = 'nl') => {
  return sendEmail(adminEmail, 'surveyExpiringSoon', { ...surveyData, daysRemaining }, locale);
};

export const sendExpiredEmail = async (surveyData, totalResponses, adminEmail, locale = 'nl') => {
  return sendEmail(adminEmail, 'surveyExpired', { ...surveyData, totalResponses }, locale);
};

export const sendUserConfirmationEmail = async (surveyData, responseData, locale = 'nl') => {
  if (responseData.userEmail) {
    return sendEmail(responseData.userEmail, 'userConfirmation', { ...surveyData, responseData }, locale);
  }
  return { success: false, error: 'No user email provided' };
};
